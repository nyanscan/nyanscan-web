<?php
require($_SERVER['DOCUMENT_ROOT'] . '/utils/functions.php');


$id = $_GET["id"]??"";

if (!$id) redirect404();

$pdo = connectDB();
if (is_numeric($id)) {
    $req = $pdo->prepare("SELECT id, email, username, birthday, date_inserted, date_updated, token FROM PAE_USER WHERE id=?");
} else {
    $req = $pdo->prepare("SELECT id, email, username, birthday, date_inserted, date_updated, token FROM PAE_USER WHERE username=?");
}

$req->execute([$id]);
$user = $req->fetch();

if (!$user) redirect404();

// force id in case use username
$id = $user["id"];

session_start();
$is_self = isset($_SESSION["token"]) && $_SESSION["token"] === $user["token"];
$age = floor((time() - strtotime($user["birthday"]))/60/60/24/365.25);

$noFunction = true;
$no_session = true;
$title = $user["username"]." | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/components/nav.php');

?>

    <section class="d-flex flex-column">
        <h3><?php echo $user["username"]?></h3>
        <span><?php echo $age?> ans</span>
        <span> Join the <?php echo $user["date_inserted"]?></span>
        <span> Last activity <?php echo $user["date_updated"]?></span>
    </section>

<?php
if ($is_self) {
?>

    <section>
        <h4>Modifier le profils</h4>

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
            <h3>Inforation</h3>
            <div class="ns-f-w-group">
                <label for="email">Adresse Email :</label>
                <input id="email" class="form-control ns-form-pink" type="email" name="email" required="required" value="<?php echo $user["email"]?>">
            </div>
            <div class="ns-f-w-group">
                <label for="username">Pseudo :</label>
                <input id="username" class="form-control ns-form-pink" type="text" name="username" required="required" value="<?php echo $user["username"]?>">
            </div>
            <div class="ns-f-w-group">
                <label for="birth">Date de Naissance :</label>
                <input id="birth" class="form-control ns-form-pink" type="date"  name="birth" required="required" value="<?php echo $user["username"]?>">
            </div>

            <h5>Modifier le mot de passe</h5>
            <p>Si vous ne voulez pas modifier votre mot de passe merci de ne pas remplire les casse</p>

            <div class="ns-f-w-group">
                <label for="pasword">Mot de Passe :</label>
                <input id="pasword" class="form-control ns-form-pink" type="password" name="password">
            </div>
            <div class="ns-f-w-group">
                <label for="password-v">Confirmation Mot De Passe :</label>
                <input id="password-v" class="form-control ns-form-pink" type="password" name="password-v">
            </div>

            <p>Pour des raison de sécurité veuillez renseigner à nouveaux votre mots de passe pour toute modification !</p>

            <div class="ns-f-w-group">
                <label for="pasword-c">Mot de Passe actuelle :</label>
                <input id="pasword-c" class="form-control ns-form-pink" type="password" name="password">
            </div>

            <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit">S'enregister</button>

        </form>
    </section>

    <section>
        <h4>Zonne danger</h4>
        <button  type="submit">Suprimer le compte</button>
    </section>

<?php
}

include($_SERVER['DOCUMENT_ROOT'] . '/components/foot.php');
?>