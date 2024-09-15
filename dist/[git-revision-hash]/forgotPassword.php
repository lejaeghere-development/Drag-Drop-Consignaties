<?php
    session_start();
    if(isset($_SESSION["loggedin"]) ){
        header("Location:index.php");
        exit;
    }

?>
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WACHTWOORD VERGETEN</title><link rel="icon" href="https://deliveryves.be/wp-content/uploads/2022/03/cropped-cropped-deliveryves-site-icon-1-192x192-1-32x32.png" sizes="32x32"/><link rel="icon" href="https://deliveryves.be/wp-content/uploads/2022/03/cropped-cropped-deliveryves-site-icon-1-192x192-1-192x192.png" sizes="192x192"/><style>@font-face {
            font-family: 'greycliff-medium';
            src: url('./fonts/greycliff-medium.ttf');
        }
        @font-face {
            font-family: 'greycliff-bold';
            src: url('./fonts/greycliff-bold.ttf');
        }
        body{
            display: none;
        }
        body.active{
            display: block;
        }</style></head><body><header><div class="sec1"><div class="logo"><img src="./assets/logo.png" alt="" srcset=""></div></div><div class="sec2"></div></header><div class="bg_right"><img src="./assets/loginItem.png" alt="" srcset=""></div><div class="bg_left"><img src="./assets/Banner.svg" alt="" srcset=""></div><div id="forgot_sec"><div class="head">WACHTWOORD VERGETEN?</div><div class="content"><div class="field"><input type="email" name="email" id="email" placeholder="Email"></div><div class="info">Je ontvangt binnenkort een mail om je wachtwoord te wijzigen.</div><div id="submit">VERSTUUR</div></div></div><div class="error"></div><script src="./forgotPassword.js"></script></body></html>