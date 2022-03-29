<header>


    <?php
    if(isset($_SESSION["account-username"])) {

        echo "Username : ". $_SESSION["account-username"];
        echo "<a href=\"/auth/logout.php\">Deconexion</a>";
    } else {
        echo "<a href='/auth'>Conexion</a>";
    }
    ?>


</header>