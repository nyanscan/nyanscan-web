<!DOCTYPE html>
<?php
session_start();
?>
<html>
<head>
    <meta charset="UTF-8">
    <title>Connection | NyanScan</title>
</head>
<body>
<?php
if(isset($_SESSION["account-username"])) {
    echo "Username : ". $_SESSION["account-username"];
}
?>


</body>
</html>