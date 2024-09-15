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
    require_once ('libs/functions.php');
    $obj = new Functions("usa");
    $query = $obj->myPdo->from('deliveryves_count')->select(array('combination, rack1Visible, vat'))->where('uid', $_SESSION["uid"]);
    $res= $query->fetch();
    if($res){
        $_SESSION["combination"]=$res['combination'];
       $_SESSION["hideHint"]=$res['hideHint']==0?false:true;
        // $_SESSION["address"]=$res['address'];
        $_SESSION["rack1Visible"]= $res['rack1Visible'];
        $_SESSION["vat"]= $res['vat'];
    }

    $addressInfo= array();
    $addressQ = $obj->myPdo->from('deliveryves_address')->select(array())->where('uid', $_SESSION["uid"]);
    $addressR= $addressQ->fetchAll();
    foreach ($addressR as $resA) {
        // echo json_encode($resA);
        $addressInfo[$resA['addressID']]= array();
        $addressInfo[$resA['addressID']]['title'] = $resA['title'];
        $addressInfo[$resA['addressID']]['street'] = $resA['street'];
        $addressInfo[$resA['addressID']]['housenumber'] = $resA['housenumber'];
        $addressInfo[$resA['addressID']]['postalcode'] = $resA['postalcode'];
        $addressInfo[$resA['addressID']]['city'] = $resA['city'];
    }
    $_SESSION['address']= json_encode($addressInfo);

?><!doctype html><html lang="en"><head><meta charset="UTF-8" content="width=device-width,minimum-scale=1,maximum-scale=1" name="viewport"><link rel="icon" href="https://deliveryves.be/wp-content/uploads/2022/03/cropped-cropped-deliveryves-site-icon-1-192x192-1-32x32.png" sizes="32x32"/><link rel="icon" href="https://deliveryves.be/wp-content/uploads/2022/03/cropped-cropped-deliveryves-site-icon-1-192x192-1-192x192.png" sizes="192x192"/><style>@font-face {
    font-family: 'greycliff-medium';
    src: url('./fonts/greycliff-medium.ttf');
}

@font-face {
    font-family: 'greycliff-bold';
    src: url('./fonts/greycliff-bold.ttf');
}


body {
    overflow-x: hidden;
}

.dummy {
    color: #ffffff;
    position: absolute;
    top: 0;
    opacity: 0;
    z-index: -1;
}

.dummy p {
    opacity: 0;
}

.dummy p:nth-child(1) {
    font-family: 'greycliff-bold';
}

.dummy p:nth-child(2) {
    font-family: 'greycliff-medium';
}

#rotate.active {
    display: block;
}

#rotate {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    z-index: 1000;
}

#rotate img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 10%;
    max-width: 200px;
}

@media screen and (max-width: 768px) {

    #rotate img {
        width: 30% !important;
    }
}

#search-container,
#homeScr,
#delete_confirm,
#skip_confirm,
#logout_confirm,
.user_form,
#ready_info,
#crate_info,
#toggle_info,
#crate_info2,
.search_bottles,
#change_address_confirm,
.address_sec {
    display: none;
}
.mobile_menu{
    transform: translateX(-400%);
}</style><script>
           window.hideHint = '<?php echo $_SESSION["hideHint"]; ?>';
window.isGuest = '<?php echo $_GET["isGuest"]; ?>';
window.isLoggedIn = '<?php echo $_SESSION["loggedin"]; ?>';
window.username = '<?php echo $_SESSION["username"]; ?>';
window.email = '<?php echo $_SESSION["email"]; ?>';
window.mobile = '<?php echo $_SESSION["mobile"]; ?>';
window.rack1Visible = '<?php echo $_SESSION["rack1Visible"]; ?>';
window.userConfig = '<?php echo $_SESSION["combination"]; ?>';
window.address = '<?php echo $_SESSION["address"]; ?>';
window.vat = '<?php echo $_SESSION["vat"]; ?>';
window.comments= '<?php echo $_SESSION["comments"]; ?>';
window.rack1Visible= parseInt(window.rack1Visible);
if(!window.isLoggedIn){
    window.rack1Visible=1;
    window.userConfig='[]';
    window.address='';
    window.vat='';
    window.comments='';
}else{
    window.address= JSON.parse(window.address)
    
}
</script></head><body><div class="dummy"><p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p><p>HELLo</p></div><div class="mobile_menu active2"><div class="mobile_menu_close close"></div><div class="content"><div class="logo"><img src="./assets/logo.png" alt="" srcset=""></div><div class="buttons"><div id="skipBtn"><img src="./assets/skip.png" alt="" srcset=""></div><div id="changeAddress"><img src="./assets/changeAddr.png" alt="" srcset=""></div><div class="mobile_skip_ui"><div class="bg"><img src="./assets/mobile_ui.png" alt="" srcset=""></div><div class="container"><div class="title">Zorg ervoor dat u uw kratplaatsingen opslaat zodra u klaar bent.</div><div class="footer"><div class="left"><div class="mobile_skip_check"><img src="./assets/hintCheck.png" alt="" srcset=""> <img src="./assets/hintCheck1.png" alt="" srcset="" class=""></div><div class="label">Toon dit nooit meer</div></div><div class="right"><div id="hideBtn"><img src="./assets/hintClose.png" alt=""></div></div></div></div></div></div><div id="logoutBtn"><img src="./assets/logout.png" alt=""></div></div></div><div class="form_bg"></div><div id="game-sec"></div><div class="search_bottles"><div class="bottle" id="bottle_water"><img src="./assets/water.png" alt="" srcset=""></div><div class="bottle" id="bottle_frisdrank"><img src="./assets/frisdrank.png" alt="" srcset=""></div><div class="bottle" id="bottle_fruitsap"><img src="./assets/fruitsap.png" alt="" srcset=""></div><div class="bottle" id="bottle_bieren"><img src="./assets/bier.png" alt="" srcset=""></div><div class="bottle" id="bottle_zuivel"><img src="./assets/zuivel.png" alt="" srcset=""></div></div><div id="search-container"><div class="box-container"><input id="search-box" placeholder="Zoek je favoriete drank..."><div class="search-icon"><img src="./assets/search-icon.png" alt=""></div></div><div id="suggestions-container"></div></div><div id="delete_confirm" class=""><div class="container"><div class="head">Wil je echt je tweede rek wil weghalen?</div><div class="info">Even een tip: als je twee krattenrekken houdt, heb je minder vaak bezoek van ons en betaal je minder delivery fee. Als je toch kiest voor maar één rek, wordt er een extra fee aangerekend als je omzet onder de 60 euro blijft. Met twee rekken vermijd je die extra kosten.</div><div class="buttons"><div class="btn" id="confirm">Bevestig</div><div class="btn yellow" id="cancel">Annuleer</div></div></div></div><div id="change_address_confirm" class=""><div class="container"><div class="head">Ben je zeker dat je naar je ander adres wilt gaan? </div><div class="info">Je wijzigingen op dit adres zijn nog niet opgeslagen.</div><div class="buttons"><div class="btn" id="confirm">OK</div><div class="btn yellow" id="cancel">TERUG</div></div></div></div><div id="skip_confirm" class=""><div class="container"><div class="head">Je kunt opslaan zodra je krattenrekken volledig gevuld zijn. Bijna daar, bedankt!</div><div class="buttons"><div class="btn yellow" id="cancel">OK</div></div></div></div><div id="ready_info" class=""><div class="container"><div class="head">Proficiat, je krattenrekken zijn nu netjes opgevuld.</div><div class="info">Zit je drankenvooraad nu goed? Klik op BEWAAR om verder te gaan. Wil je nog eens controleren of iets wijzigen klik op TERUG.</div><div class="buttons"><div class="btn" id="confirm">BEWAAR</div><div class="btn yellow" id="cancel">TERUG</div></div></div></div><div id="logout_confirm" class=""><div class="container"><div class="head">Ben je zeker dat je wilt uitloggen?</div><div class="info">Je wijzigingen zullen niet worden niet opgeslagen.</div><div class="buttons"><div class="btn" id="lg_confirm">UITLOGGEN</div><div class="btn yellow" id="lg_cancel">TERUG</div></div></div></div><div class="user_form"><div class="container"><div class="head">Je bent er bijna! Vergeet niet op VERSTUUR te drukken. hieronder kan je nog eventuele vragen of opmerkingen toevoegen.</div><div class="field"><input name="name" id="name" placeholder="Naam"></div><div class="field"><input type="email" name="email" id="email" placeholder="Email"></div><div class="field"><input type="tel" name="mobile" id="mobile" placeholder="GSM"></div><div class="field"><input name="address" id="address" placeholder="Adress"></div><div class="field"><input name="vat" id="vat" placeholder="VAT number"></div><div class="field"><textarea type="text" name="comments" id="comments" placeholder="Noteer hier vragen of opmerkingen." rows="1"></textarea></div><div class="buttons"><div class="user_submit">VERSTUUR</div><div class="back">WIJZIG</div></div></div></div><div id="crate_info" class=""><div class="container"><div class="head">Wanneer kies je voor een krat kleine flessen mixed?</div><div class="info">Voor het samenstellen van het perfecte drankenassortiment heb je soms geen volle kratten van elke drank nodig. Drink je bepaalde dranken minder vaak, maar wil je ze toch graag in je assortiment? Dan is een mixed krat de ideale oplossing. Hiermee kun je een krat vullen per 6 of 12 flesjes van verschillende dranken (meestal 24 flesjes in en krat). Beperk het aantal mixed kratten tot maximaal 2 per consignatie. Een mixed voor grote flessen is niet mogelijk.</div><div class="buttons"><div class="btn yellow" id="cancel">TERUG</div></div></div></div><div id="crate_info2" class=""><div class="container"><div class="head">Wat is de Leeggoedbox?</div><div class="info">Onze dranken worden ongekoeld geleverd, dus veel klanten zetten een paar flesjes in de koelkast, vooral in de zomer. Bij elke levering vervangen wij alle (lege en halflege) kratten door volle kratten, zodat je krattenrek weer volledig gevuld is. Flesjes die dan nog uit de koelkast komen passen niet meer in de volle kratten. Gebruik de Leeggoedbox om deze flesjes op te bergen, onze driver neemt ze bij de volgende levering weer mee.</div><div class="buttons"><div class="btn yellow" id="cancel">Terug</div></div></div></div><div id="toggle_info" class=""><div class="container"><div class="head">Mixed Krat:</div><div class="info">Combineer 2 tot 4 dranken voor een verrassende mix! Maximaal 1 per krattenrek. Cheers!</div><div class="buttons"><div class="btn yellow" id="toggle_cancel">Terug</div></div></div></div><div class="gameError"></div><div class="address_sec"><div class="content"></div><div class="btn" id="confirm_address">BEVESTIG</div><div class="address_error">Please choose an address</div></div><div id="rotate"><img src="./assets/rotate.png" alt="" srcset=""></div><script src="./index.js"></script></body></html>