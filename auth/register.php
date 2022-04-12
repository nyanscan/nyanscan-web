<?php


$title = "Inscirption | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');


require("../utils/dbAdapter.php");
require("../utils/const.php");

$errors = [];
if (count($_POST) !== 0) {
    if (
        (count($_POST) != 6 and count($_POST) != 7) ||
        empty($_POST["username"]) ||
        empty($_POST["email"]) ||
        empty($_POST["password"]) ||
        empty($_POST["password-v"]) ||
        empty($_POST["birth"]) ||
        empty($_POST["cgu"])
    ) {
        $errors[] = "Donnée du formulaire invalide merci de recommencer !";
    } else {
        $username = trim($_POST["username"]);
        $email = strtolower(trim($_POST["email"]));
        $password = trim($_POST["password"]);
        $password_v = trim($_POST["password-v"]);
        $newsLetter = !empty($_POST["newsletter"]);
        $newsLetter = !empty($_POST["newsletter"]);
        $birthday = $_POST["birth"];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Format de mail invalide";
        if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/', $username)) $errors[] = "Le pseudo ne peux contenir que des miniscule, majuscles, chiffres ou un _ avec une longeur maximum de 20 caractéres";
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password)) $errors[] = "Le mots de passe dois contenire au minimum 8 caractéres dont 1 majuscule 1 majuscule 1 chiffres et 1 caractéres spéciale";
        if ($password !== $password_v) $errors[] = "Les motrs de passes de coresponde pas !";

        $birthdayExploded = explode("-", $birthday);

        if( count($birthdayExploded)!=3 || !checkdate($birthdayExploded[1], $birthdayExploded[2], $birthdayExploded[0]) ){
            $errors[] = "Date de naissance incorrecte";
        }else{
            $age = (time() - strtotime($birthday))/60/60/24/365.25;
            if($age<13 || $age>100){
                $errors[] = "Vous êtes trop jeune ou trop vieux";
            }
        }

        $pdo = connectDB();

        $rq_select = $pdo->prepare("SELECT email, username FROM " . DB_PREFIX . "USER WHERE email=:email OR username=:username LIMIT 2");
        $rq_select->execute(["email" => $email, "username" => $username]);
        foreach ($rq_select->fetchAll() as $user) {
            if ($user["email"] === $email) $errors[] = "Ce mail est dèja reliée à un compte";
            if ($user["username"] === $email) $errors[] = "Ce nom d'utilisateur est dèja reliée à un compte";
        }

        if (count($errors) === 0) {

            $password = password_hash($password, PASSWORD_DEFAULT);

            $rq = $pdo->prepare("INSERT INTO " . DB_PREFIX . "USER (email, username, password, birthday, status) VALUES (:email, :username, :password, :birthday, :status)");
            $rq->execute([
                "email" => $email,
                "username" => $username,
                "password" => $password,
                "birthday" => $birthday,
                "status" => $newsLetter ? STATUS_EMAIL_NEWS_LETTER : STATUS_NOTHING
            ]);
            header("Location: loginSucces.php");
        }
    }
}


redirectIfConnected();
?>

<section id="register">
    <div class="ns-f-bg ns-f-bg-auth"></div>
    <div class="container vh-100">
        <div class="row vh-100">
            <div id="register" class="ns-theme-bg ns-theme-text rounded my-5 align-self-center col-10 offset-1 col-md-8 offset-md-2">
                <div class="container pt-5 pb-3 d-flex flex-column align-items-center justify-content-around">
                    <div class="row pb-3">
                        <a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo"></a>
                    </div>
                    <div class="row"><h2>Créer un compte</h2></div>
                    <?php
                    if (!empty($errors)) {
                        echo "<div class='row rounded mt-2 ns-b-azalea ns-text-red'>";
                        foreach ($errors as $err) {
                            echo "<p class='my-1 justify-content-center'>" . $err . "</p><br>";
                        }
                        echo "</div>";
                        $d_class = 'row col-12 col-md-10 mt-2 mb-5';
                    } else $d_class = 'row col-12 col-md-10 mt-5 mb-5';
                    ?>
                    <div class="<?php echo  $d_class ?>">
                    <form class="ns-f-wrap" method="post"">
                        <div class="ns-f-w-group">
                            <label for="email">Adresse Email :</label>
                            <input id="email" class="form-control ns-form-pink" type="email" name="email" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="username">Pseudo :</label>
                        <input id="username" class="form-control ns-form-pink" type="text" name="username" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="pasword">Mot de Passe :</label>
                        <input id="pasword" class="form-control ns-form-pink" type="password" name="password" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="password-v">Confirmation Mot De Passe :</label>
                        <input id="password-v" class="form-control ns-form-pink" type="password" name="password-v" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="birth">Date de Naissance :</label>
                        <input id="birth" class="form-control ns-form-pink" type="date"  name="birth" required="required">
                        </div>
                        <div class="ns-f-w-group align-self-center">
                            <div class="form-check">
                                <input id="ns-i-check-news" class="form-check-input  ns-form-check" type="checkbox" name="newsletter">
                                <label for="ns-i-check-news" class="form-check-label">NewsLetter</label>
                            </div>
                            <div class="form-check">
                                <input  id="ns-i-check-cgu" class="form-check-input ns-form-check" type="checkbox" name="cgu" required="required">
                                <label for="ns-i-check-cgu" class="form-check-label">CGU</label>
                            </div>
                        </div>
                        <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit">S'enregister</button>
                    </form>
                    </div>
                    <div class="row"><p>Tu as dèja un compte ? <a href="./">Se connecter</a></p></div>
                </div>
            </div>
        </div>
    </div>
</section>
<?php
include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
?>
