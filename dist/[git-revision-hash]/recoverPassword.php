<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Recover Password</title>
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
        <div class="sec2"></div>
    </header>
    <div class="bg_right"><img src="./assets/loginItem.png" alt="" srcset=""></div>
    <div class="bg_left"><img src="./assets/Banner.svg" alt="" srcset=""></div>
    <div id="recover_sec">
        <div class="head">HERSTEL WACHTWOORD</div>
        <div class="content">
            <div class="field"><input type="password" name="password" id="password" placeholder="Wachtwoord"></div>
            <div class="field"><input type="password" name="confirmPassword" id="confirmPassword"
                    placeholder="Bevestig wachtwoord"></div>
            <div class="info">Wachtwoord opnieuw instellen succesvol.</div>
            <div id="save">BEWAAR</div>
            <div id="loginBtn" class="">LOGIN</div>
        </div>
    </div>
    <div class="error"></div>
    <script src="./recoverPassword.js"></script>
</body>

</html>