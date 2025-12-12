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
        }</style></head><body><header><div class="sec1"><div class="logo"><img src="./assets/logo.png" alt="" srcset=""/></div></div><div class="sec2"><div id="" class="header_btn"><a href="./addressBook.php">Address Book</a></div><div id="" class="header_btn"><a href="./customCrate.php">Custom Crate</a></div><div id="logout" class="header_btn"> <a href="javascript:void();">Logout</a></div></div></header><div class="app-container"><div class="left"><div id="edit_update_info">EDIT</div><div class="title">CUSTOM CRATE BOTTLES</div><div class="sub_title">(Mark this field to enable the inclusion of a bottle within the custom crate.)</div><div class="bottles"></div></div><script src="./customCrate.js?v=1.4.0"></script></div><div id="logout_confirm" class=""> <div class="container"> <div class="head">Ben je zeker dat je wilt uitloggen?</div> <div class="info"> Je wijzigingen zullen niet worden niet opgeslagen. </div> <div class="buttons"> <div class="btn" id="lg_confirm">Uitloggen</div> <div class="btn yellow" id="lg_cancel">Terug</div> </div> </div> </div></body></html>