<?php


function send_verification_mail($token, $id, $mail, $username) {
    $headers = "From : NyanScan " . '<register-no-reply@nyanscan.fr>';
    $subject = 'Vérifie ton mail '.$username.' pour NyanScan !';
    $content = <<<EOT
Salut $username,
Merci de t'être inscrit(e) sur NyanScan !,

Il faut maintent que tu vérifie ton mail en clickant sur le lien suivant :

https://nyanscan.fr/verification.php?t=$token&user=$id

Et à bientot sur NyanScan !;
EOT;
    mail(
        $mail,
        $subject,
        $content,
        $headers
    );
}