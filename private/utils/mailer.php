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

function send_password_change_verification($token, $id, $mail, $username) {
	$headers = "From : NyanScan " . '<register-no-reply@nyanscan.fr>';
	$subject = 'Vérifie ton mail '.$username.' pour NyanScan !';
	$content = <<<EOT
Salut $username,

Tu veux de changer de mot de passe ?

Pour valider cette action click sur ce lien

https://nyanscan.fr/verification.php?t=$token&user=$id

Si tu n'est pas à l'origine de cette action click ici et nous te conseillions de changer toi même ton mot de passe

https://nyanscan.fr/verification.php?t=$token&user=$id&deny=1

Et à bientôt sur NyanScan !;
EOT;
	mail(
		$mail,
		$subject,
		$content,
		$headers
	);
}

function send_email_change_verification($token, $id, $mail, $username) {
	$headers = "From : NyanScan " . '<register-no-reply@nyanscan.fr>';
	$subject = 'Vérifie ton mail '.$username.' pour NyanScan !';
	$content = <<<EOT
Salut $username,

Tu veux de changer d'email ?

Pour valider cette action click sur ce lien

https://nyanscan.fr/verification.php?t=$token&user=$id

Si tu n'est pas à l'origine de cette action click ici et nous te conseillions de changer toi même ton mot de passe

https://nyanscan.fr/verification.php?t=$token&user=$id&deny=1

Et à bientôt sur NyanScan !;
EOT;
	mail(
		$mail,
		$subject,
		$content,
		$headers
	);
}

function send_project_status_change_mail($status, $title, $email, $username) {
    $headers = "From : NyanScan " . '<no-reply@nyanscan.fr>';
    $subject = 'Status de votre project actualisé';
    $content = <<<EOT
Salut $username !

Un de tes projet a subit un changement de statut :

Projet : $title
Status : $status

Rends-toi sur NyanScan pour avoir plus d'information.

À très vite !
EOT;
    mail(
        $email,
        $subject,
        $content,
        $headers
    );
}

function send_event_status_change_mail($status, $name, $email, $username) {
    $headers = "From : NyanScan " . '<no-reply@nyanscan.fr>';
    $subject = 'Status de votre project actualisé';
    $content = <<<EOT
Salut $username !

Un de tes évènements a subit un changement de statut :

Évènement : $name
Status : $status

Rends-toi sur NyanScan pour avoir plus d'information.

À très vite !
EOT;
    mail(
        $email,
        $subject,
        $content,
        $headers
    );
}