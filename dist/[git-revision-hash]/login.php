<?php
    session_start();
    if(isset($_GET['isGuest']) && $_GET['isGuest'] == "true"){
        session_destroy();
        $_SESSION = array();
        header("Location:index.php?isGuest=true");
        exit;
    }
    if(isset($_SESSION["loggedin"])){
        header("Location:index.php");
        exit;
    }

?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Login</title>
    <style>
        @font-face {
            font-family: 'greycliff-medium';
            src: url('./fonts/greycliff-medium.ttf');
        }

        @font-face {
            font-family: 'greycliff-bold';
            src: url('./fonts/greycliff-bold.ttf');
        }
        body{
            opacity: 0;
        }
        body.active{
            opacity: 1;
        }
    </style>
</head>

<body>
    <header>
        <div class="sec1">
            <div class="logo"><img src="./assets/logo.png" alt="" srcset=""></div>
        </div>
        <div class="sec2">
            <div id="registerBtn">Registreer</div>
        </div>
    </header>
    <div class="bg_right"><img src="./assets/loginItem.png" alt="" srcset=""></div>
    <div class="bg_left"><img src="./assets/Banner.svg" alt="" srcset=""></div>
    <div id="login_sec">
        <div class="head">LOGIN</div>
        <div class="content">
            <div class="field"><input type="email" name="email" id="email" placeholder="Email"></div>
            <div class="field"><input type="password" name="password" id="password" placeholder="Wachtwoord"></div>
            <div id="forgot_password">Wachtwoord vergeten?</div>
            <div id="loginBtn">LOGIN</div>
        </div>
    </div>
    <div class="error"></div>
    <script src="./login.js"></script>
</body>

</html>