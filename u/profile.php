<?php
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

$id = $_GET["id"] ?? "";
// if no id set go on a 404 can't load none user profile
if (!$id) redirect404();

// get user from id if id is numerical or by username if id is text
$pdo = connectDB();
if (is_numeric($id)) {
    $req = $pdo->prepare("SELECT id, email, username, birthday, date_inserted, date_updated, password, token FROM PAE_USER WHERE id=?");
} else {
    $req = $pdo->prepare("SELECT id, email, username, birthday, date_inserted, date_updated, password, token FROM PAE_USER WHERE username=?");
}

$req->execute([$id]);
$user = $req->fetch();

// if user not found => 404
if (!$user) redirect404();

// force id in case use username
$id = $user["id"];

session_start();

// a user are in own profile page
$is_self = isset($_SESSION["token"]) && $_SESSION["token"] === $user["token"];
// calc age
$age = floor((time() - strtotime($user["birthday"])) / 60 / 60 / 24 / 365.25);

$edit_errors = [];
$edit_success = false;

// edit
if ($is_self && ($_POST["type"]??"none") === "edit" && $id = $_POST["id"]) {
    // start check edit

    if (
        empty($_POST["email"]) ||
        empty($_POST["username"]) ||
        empty($_POST["birth"]) ||
        empty($_POST["password-c"]) ||
        !isset($_POST["password"]) ||
        !isset($_POST["password-v"]) ||
        count($_POST) != 8
    ) {
        $edit_errors[] = "Donnée du formulaire invalide merci de recommencer !";
    } else {
        $username = trim($_POST["username"]);
        $email = strtolower(trim($_POST["email"]));
        $password = trim($_POST["password"]);
        $password_v = trim($_POST["password-v"]);
        $password_c = trim($_POST["password-c"]);
        $birthday = $_POST["birth"];

        if (!password_verify($password_c, $user["password"])) $edit_errors[] = "Mot de passe actuel invalide !";

        $change_pwd = strlen($password) !== 0 || strlen($password_v) !== 0;
        $change_mail = $email !== $user["email"];
        $change_user = $username !== $user["username"];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $edit_errors[] = "Format de mail invalide";
        if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/', $username)) $edit_errors[] = "Le pseudo ne peux contenir que des miniscule, majuscles, chiffres ou un _ avec une longeur maximum de 20 caractéres";
        if ($change_pwd) {
            if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password)) $edit_errors[] = "Le mots de passe dois contenire au minimum 8 caractéres dont 1 majuscule 1 majuscule 1 chiffres et 1 caractéres spéciale";
            if ($password !== $password_v) $edit_errors[] = "Les motrs de passes de coresponde pas !";
        }

        $birthdayExploded = explode("-", $birthday);

        if (count($birthdayExploded) != 3 || !checkdate($birthdayExploded[1], $birthdayExploded[2], $birthdayExploded[0])) {
            $edit_errors[] = "Date de naissance incorrecte";
        } else {
            $age = (time() - strtotime($birthday)) / 60 / 60 / 24 / 365.25;
            if ($age < 13 || $age > 100) {
                $edit_errors[] = "Vous êtes trop jeune ou trop vieux";
            }
        }

        if ($change_mail || $change_user) {
            $rq_select = $pdo->prepare("SELECT email, username FROM " . DB_PREFIX . "USER WHERE email=:email OR username=:username LIMIT 2");
            $rq_select->execute(["email" => $email, "username" => $username]);
            foreach ($rq_select->fetchAll() as $fu) {
                if ($change_mail && $fu["email"] === $email) $edit_errors[] = "Ce mail est dèja reliée à un compte";
                if ($change_user && $fu["username"] === $username) $edit_errors[] = "Ce nom d'utilisateur est dèja reliée à un compte";
            }
        }

        if (count($edit_errors) === 0) {

            $password = password_hash($password, PASSWORD_DEFAULT);

            if ($change_pwd) {
                $rq = $pdo->prepare("UPDATE " . DB_PREFIX . "USER SET email=:email, username=:username, birthday=:birthday, password=:password WHERE id=:id");
                $rq->execute([
                    "id" => $id,
                    "email" => $email,
                    "username" => $username,
                    "password" => $password,
                    "birthday" => $birthday
                ]);
            } else {
                $rq = $pdo->prepare("UPDATE " . DB_PREFIX . "USER SET email=:email, username=:username, birthday=:birthday WHERE id=:id");
                $rq->execute([
                    "id" => $id,
                    "email" => $email,
                    "username" => $username,
                    "birthday" => $birthday
                ]);

                $user["email"] = $email;
                $user["username"] = $username;
                $user["birthday"] = $birthday;
                $edit_success = true;
            }
        }
    }
}

$_POST = array();

$noFunction = true;
$no_session = true;
$title = $user["username"] . " | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/private/components/nav.php');

?>

<?php
if ($edit_success) {
?>

    <section class="rounded bg-primary">
        <p>Les modifications ont bien été prise en considération.</p>
    </section>
<?php
}
?>

<?php
if (count($edit_errors) > 0) {
    ?>

    <section class="rounded bg-warning">
        <p>Des erreurs sont survenues :</p>
        <ul>
            <?php
                foreach ($edit_errors as $err) {
                    echo "<li>".$err."</li>";
                }
            ?>
        </ul>
    </section>
    <?php
}
?>

<?php
if (!$is_self) {
    ?>
    <section class="row d-flex flex-column">
        <div class="col-md-8 d-flex">
            <div class="col-4">
                <div class="ns-avatar"></div>
            </div>
            <div class="col-8">
                <h3><?php echo $user["username"] ?></h3>
                <span><?php echo $age ?> ans</span>
            </div>
        </div>
        <div class="col-md-4 d-flex">
            <span> Join on <?php echo $user["date_inserted"] ?></span>
            <span> Last activity <?php echo $user["date_updated"] ?></span>
        </div>
    </section>
    <?php
}

?>

<?php
if ($is_self) {
    ?>
        <div class="ns-min-vh-100 ns-center py-5">
            <div class="ns-scan-preview-profil">

                <section class="flex-row d-flex">
                    <div class="col-md-8 d-flex justify-content-start">
                        <div class="p-2">
                            <div class="ns-avatar img-circle img-responsive"></div>
                        </div>
                        <div class="p-2">
                            <h3><?php echo $user["username"] ?></h3>
                            <span><?php echo $age ?> ans</span>
                        </div>
                    </div>
                    <div class="d-flex flex-column justify-content-end">
                        <div class="p-2">
                            <span> Join on <?php echo $user["date_inserted"] ?></span>
                        </div>
                        <div class="p-2">
                            <span> Last activity <?php echo $user["date_updated"] ?></span>
                        </div>
                    </div>
                </section>

                <div class="ns-center py-5">
                    <div class="ns-scan-preview-gray">
                        <h4 class="ns-scan-preview-tile">Scans aimés</h4>
                        <div class="ns-scan-preview-elements">
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ns-center py-5">
                    <div class="ns-scan-preview-gray">
                        <h4 class="ns-scan-preview-tile">Scans uploadés</h4>
                        <div class="ns-scan-preview-elements">
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                            <div class="ns-scan-preview-component-profil">
                                <a href="/">
                                    <img src="../res/book/love-is-war.jpg">
                                </a>
                                <span>Love Is War</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ns-center py-5">
                    <div class="ns-scan-preview-gray">
                        <section>
                            <h4>Modifier le profil</h4>

                            <?php
                            if (!empty($errors_edit)) {
                                echo "<div class='row rounded mt-2 ns-b-azalea ns-text-red'>";
                                foreach ($errors_edit as $err) {
                                    echo "<p class='my-1 justify-content-center'>" . $err . "</p><br>";
                                }
                                echo "</div>";
                            }
                            ?>

                            <form method="post">
                                <h3>Information</h3>
                                <input class="d-none" name="type" value="edit" type="hidden">
                                <input class="d-none" name="id" value="<?php echo $id ?>" type="hidden">
                                <div class="ns-f-w-group">
                                    <label for="email">Adresse Email :</label>
                                    <input id="email" class="form-control ns-form-pink" type="email" name="email" required="required"
                                           value="<?php echo $user["email"] ?>">
                                </div>
                                <div class="ns-f-w-group">
                                    <label for="username">Pseudo :</label>
                                    <input id="username" class="form-control ns-form-pink" type="text" name="username" required="required"
                                           value="<?php echo $user["username"] ?>">
                                </div>
                                <div class="ns-f-w-group">
                                    <label for="birth">Date de Naissance :</label>
                                    <input id="birth" class="form-control ns-form-pink" type="date" name="birth" required="required"
                                           value="<?php echo $user["birthday"] ?>">
                                </div>

                                <h5>Modifier le mot de passe</h5>
                                <p>Si vous ne voulez pas modifier votre mot de passe merci de ne pas remplir les casse</p>

                                <div class="ns-f-w-group">
                                    <label for="password">Mot de Passe :</label>
                                    <input id="password" class="form-control ns-form-pink" type="password" name="password">
                                </div>
                                <div class="ns-f-w-group">
                                    <label for="password-v">Confirmation Mot De passe :</label>
                                    <input id="password-v" class="form-control ns-form-pink" type="password" name="password-v">
                                </div>

                                <p>Pour des raisons de sécurité veuillez renseigner à nouveaux votre mot de passe pour toute modification
                                    !</p>

                                <div class="ns-f-w-group">
                                    <label for="password-c">Mot de Passe actuelle :</label>
                                    <input id="password-c" class="form-control ns-form-pink" type="password" name="password-c">
                                </div>

                                <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit">Modifier</button>

                            </form>
                        </section>
                    </div>
                </div>
                <div class="ns-center pb-5">
                    <div class="ns-scan-preview-gray">
                        <section>
                            <h4>Zone dangereuse</h4>
                            <p>Suppression du compte : Une fois ton compte supprimé, tu ne peux pas revenir en arrière !</p>
                            <button class="ns-form-danger w-100 w-md-50 mx-auto mt-4" type="submit">Supprimer le compte</button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    <?php
}

include($_SERVER['DOCUMENT_ROOT'] . '/private/components/foot.php');
?>