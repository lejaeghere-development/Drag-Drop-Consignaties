<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Register</title>
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
            <div id="loginBtn">Login</div>
        </div>
    </header>
    <div class="bg_right"><img src="./assets/loginItem.png" alt="" srcset=""></div>
    <div class="bg_left"><img src="./assets/Banner.svg" alt="" srcset=""></div>
    <div id="register_sec">
        <div class="head">Registreer</div>
        <div class="content">
            <div class="field"><input name="username" id="username" placeholder="Naam"></div>
            <div class="field"><input type="email" name="email" id="email" placeholder="Email"></div>
            <div class="field"><input type="tel" name="mobile" id="mobile" placeholder="GSM"></div>
            <div class="field"><input type="password" name="password" id="password" placeholder="Wachtwoord"></div>
            <div id="registerBtn">Registreer</div>
        </div>
    </div>
    <div class="error"></div>
    <script src="./register.js"></script>
</body>

</html>