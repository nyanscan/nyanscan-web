<header>


    <nav id="ns-nav">
        <img src="../res/logo-ns.png" alt="nyanscan-logo">
        <form class="form-inline">
            <input id="ns-nav-search" type="search" placeholder="Rechercher...">
        </form>
        <div>

        </div>
    </nav>

    <?php
    if(isset($_SESSION["account-username"])) {

        echo "Username : ". $_SESSION["account-username"];
        echo "<a href=\"/auth/logout.php\">Deconexion</a>";
    } else {
        echo "<a href='/auth'>Conexion</a>";
    }
    ?>





</header>