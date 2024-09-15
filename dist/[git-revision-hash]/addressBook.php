<?php
    session_start();
    if((!isset($_SESSION["loggedin"]) || (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] == false))){
        if(!isset($_GET['isGuest']) ||(isset($_GET['isGuest']) && $_GET['isGuest'] == "false")){
            header("Location:login.php");
            exit;
        }
       
    }
    if(isset($_GET['isGuest']) && $_GET['isGuest'] == "true"){
        session_destroy();
        $_SESSION = array();
    }
    if(!isset($_SESSION["admin"]) || (isset($_SESSION["admin"]) && $_SESSION["admin"] ==0)){
        header("Location:index.php");
    }
    ?>
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Address Book</title><link rel="icon" href="https://deliveryves.be/wp-content/uploads/2022/03/cropped-cropped-deliveryves-site-icon-1-192x192-1-32x32.png" sizes="32x32"/><link rel="icon" href="https://deliveryves.be/wp-content/uploads/2022/03/cropped-cropped-deliveryves-site-icon-1-192x192-1-192x192.png" sizes="192x192"/><style>@font-face {
            font-family: 'greycliff-medium';
            src: url('./fonts/greycliff-medium.ttf');
        }
        @font-face {
            font-family: 'greycliff-bold';
            src: url('./fonts/greycliff-bold.ttf');
        }
        body, #delete_confirm,#logout_confirm{
            display: none;
        }
        body.active{
            display: block;
        }</style></head><body><header><div class="sec1"><div class="logo"><img src="./assets/logo.png" alt="" srcset=""></div></div><div class="sec2"><div id="logout">UITLOGGEN</div></div></header><div class="app-container"><div class="left"><div class="title">EMAILS KLANTEN</div><div class="email_search"><input type="email" name="search_eamil" id="search_eamil" placeholder="Zoek Email" autocomplete="off"></div><div class="emails"></div><div class="new_email"><div class="info">NA</div><div class="field"><input type="email" name="new_email" id="new_email" placeholder="Email Toevoegen" autocomplete="off"></div><div id="newEmailSubmit">REDDEN</div></div></div><div class="right"><div class="adresses"><div class="title">Locaties</div><div class="content"></div><div id="add_address">+ LOCATIE TOEVOEGEN</div></div><div class="address_addition"><div class="title">ADDRESS ADDITION</div><div class="content"><div class="field"><div class="icon"><img src="./assets/location.png" alt="" srcset=""></div><input name="title" id="title" placeholder="Enter Address Type"></div><div class="field"><input name="housenumber" id="housenumber" placeholder="House Number"></div><div class="field"><input name="street" id="street" placeholder="Street"></div><div class="field"><input name="city" id="city" placeholder="City"></div><div class="field"><input name="postalcode" id="postalcode" placeholder="Postal Code"></div></div><div class="buttons"><div class="btn" id="save_address">REDDEN</div><div class="btn" id="cancel_address">ANNULEREN</div></div><div class="error_info"></div></div></div></div><div id="delete_confirm" class=""><div class="container"><div class="head">Weet u zeker dat u dit adres wilt verwijderen?</div><div class="info"></div><div class="buttons"><div class="btn" id="dt_confirm">Bevestig</div><div class="btn yellow" id="dt_cancel">Annuleer</div></div></div></div><div id="logout_confirm" class=""><div class="container"><div class="head">Ben je zeker dat je wilt uitloggen?</div><div class="info"></div><div class="buttons"><div class="btn" id="lg_confirm">Bevestig</div><div class="btn yellow" id="lg_cancel">Annuleer</div></div></div></div><script src="./addressBook.js"></script></body></html>