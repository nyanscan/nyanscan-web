<?php
require 'private/utils/functions.php';
session_start();
$user = get_log_user();
if (!($user->is_connected() && $user->get_permission_level() > PERMISSION_MODERATOR)){
    header('Location: /');
    exit();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin NyanScan</title>
    <base href="/admin">
    <meta name="viewport" content="width=device-width, initial-scale=1 shrink-to-fit=no">
    <link rel="icon" href="/res/logo-ns-icon.ico">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/css/nyanscan.css">

</head>
<body class="d-flex flex-column min-vh-100">
<header class="sticky-top">

</header>
<div class="flex-grow-1 ns-theme-text" id="ns-main">

</div>
<footer class="flex-grow-0">

</footer>
<script src="/js/utils/custom_elements.js"></script>
<script src="/js/utils/utils.js"></script>
<script type="module" src="/js/adminIndex.js"></script>
<script src="/js/utils/theme.js"></script>
<script src="/js/utils/carousel.js"></script>
</body>
</html>
