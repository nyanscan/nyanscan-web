<?php


function send_verification_mail($token, $id, $mail, $username) {
    $headers = "From : NyanScan " . '<register-no-reply@nyanscan.fr>';
    $subject = 'Vérifie ton mail '.$username.' pour NyanScan !';
    $content = <<<EOT
Salut $username,

Merci de t'être inscrit(e) sur NyanScan !

Tu y es presque ! Une petite dernière étape et tu pourras parcourir notre immense catalogue !

Vérifie ton mail maintenant en cliquant sur le lien suivant :

https://nyanscan.fr/verification.php?t=$token&user=$id

Et à bientôt sur NyanScan !;
EOT;
    mail(
        $mail,
        $subject,
        $content,
        $headers
    );
}