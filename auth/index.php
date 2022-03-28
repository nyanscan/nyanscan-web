<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Connection | NyanScan</title>
    <link rel="stylesheet" type="text/css" href="../css/nyanscan.css">
</head>
<body>
    <div id="login" style="background-color: darkcyan">
        <form method="post" action="login.php">
            <input type="email" name="user" placeholder="Adresse mail" required="required">
            <input type="password" name="password" placeholder="mot de passe" required="required">
            <input type="submit" name="login" value="Connexion">
        </form>
    </div>
    <div id="register">
        <form method="post" action="register.php">
            <input type="text" name="username" placeholder="Nom d'utilisateur" required="required">
            <input type="email" name="email" placeholder="Adresse mail" required="required">
            <input type="password" name="password" placeholder="mot de passe" required="required">
            <input type="password" name="password-v" placeholder="verification" required="required">
            <label>
                News Letter:
                <input type="checkbox" name="newsletter" required="required">
            </label>
            <label>
                CGU:
                <input type="checkbox" name="cgu" required="required">
            </label>
            <input type="submit" name="register" value="S'enregister">
        </form>
    </div>
</body>
</html>