<?php
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/forum.php');
$no_session = true;
session_start();
redirectIfNotConnected();

$title = 'Forum créer une catégorie | NyanScan';
$css = ["forum.css"];
$noFunction = true;
require($_SERVER['DOCUMENT_ROOT'] . '/private/components/nav.php');

$scripts = ["carousel.js"];
?>

<section class="vh-100">
    <?php
    if (isset($errors)) {
        echo '<div class="alert alert-danger">';
        foreach ($errors as $e) {
            echo '<p>' . $e . '</p>';
        }
        echo '</div>';
    }
    ?>
    <div id="add-c-error" class="alert alert-danger mt-3" style="display: none">

    </div>
    <form method="post">
        <input type="text" name="title" class="form-control ns-form-pink" placeholder="title">
        <input type="text" name="description" class="form-control ns-form-pink" placeholder="description">
        <select name="view" class="form-select ns-form-pink">
            <option>--Visibilité--</option>
            <option value="0">Tous le monde</option>
            <option value="1">Connecter</option>
            <option value="2">Modo</option>
            <option value="3">Admin</option>
        </select>
        <select name="create" class="form-select ns-form-pink">
            <option>--Qui peux créer--</option>
            <option value="0">Tous le monde</option>
            <option value="1">Connecter</option>
            <option value="2">Modo</option>
            <option value="3">Admin</option>
        </select>
        <button id="nsf-c-category-form" type="button" class="btn form-control ns-form-pink">SEND</button>
    </form>
</section>

<?php
$more_script = '
<script>
const settings = {
    on_send: {
        disable_btn: true,
        loading_screen: true
    },
    on_load: {
        on_error: {
            type: "function",
            value: (ev) => {
                const alert = _("#add-c-error");
                alert.style.display="block";
                alert.innerHTML = "";
                const data = JSON.parse(ev.target.responseText)["reason"];
                for (let key of Object.keys(data)) {
                    let line = create("p", null, alert);
                    line.innerText = `${key}: ${data[key]}`;
                }
            }
        },
        on_success: {
            type: "toast",
            title: "Success",
            message: "La ctégorie à bien était crée",
            redirect: "/forum"
        }
    }};
setupAPIForm("nsf-c-category-form", "forum/category", settings);
</script>
';
include($_SERVER['DOCUMENT_ROOT'] . '/private/components/foot.php');
?>


