<?php

session_start();

unset($_SESSION["token"]);
unset($_SESSION["account-id"]);
unset($_SESSION["account-username"]);

header("Location: index.php");