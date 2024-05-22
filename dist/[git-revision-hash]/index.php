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
    $query = $obj->myPdo->from('deliveryves_count')->select(array('combination, address, rack1Visible, vat'))->where('uid', $_SESSION["uid"]);
    $res= $query->fetch();
    if($res){
        $_SESSION["combination"]=$res['combination'];
        $_SESSION["address"]=$res['address'];
        $_SESSION["rack1Visible"]= $res['rack1Visible'];
        $_SESSION["vat"]= $res['vat'];
    }
?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" content="width=device-width,minimum-scale=1,maximum-scale=1" name="viewport">
    <link rel="icon" type="image/x-icon" href="favicon.png">
    <style>
        @font-face {
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
        .user_form,
        #ready_info,
        #crate_info,
        #crate_info2,
        .search_bottles {
            display: none;
        }
    </style>
    <script>
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
        }
        
    </script>
</head>

<body>
    <div class="dummy">
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>HELLo</p>
    </div>
    <div class="form_bg"></div>
    <div id="game-sec"></div>
    <div class="search_bottles">
        <div class="bottle" id="bottle_water"><img src="./assets/water.png" alt="" srcset=""></div>
        <div class="bottle" id="bottle_frisdrank"><img src="./assets/frisdrank.png" alt="" srcset=""></div>
        <div class="bottle" id="bottle_fruitsap"><img src="./assets/fruitsap.png" alt="" srcset=""></div>
        <div class="bottle" id="bottle_bieren"><img src="./assets/bier.png" alt="" srcset=""></div>
        <div class="bottle" id="bottle_zuivel"><img src="./assets/zuivel.png" alt="" srcset=""></div>
    </div>
    <div id="search-container">
        <div class="box-container"><input id="search-box" placeholder="Zoek je favoriete drank...">
            <div class="search-icon"><img src="./assets/search-icon.png" alt=""></div>
        </div>
        <div id="suggestions-container"></div>
    </div>
    <div id="delete_confirm" class="">
        <div class="container">
            <div class="head">Ben je zeker dat je het 2de rek wil weghalen??</div>
            <div class="info">Een 2de rek resulteerd in minder delivery kosten.</div>
            <div class="buttons">
                <div class="btn" id="confirm">Bevestig</div>
                <div class="btn yellow" id="cancel">Annuleer</div>
            </div>
        </div>
    </div>
    <div id="skip_confirm" class="">
        <div class="container">
            <div class="head">Pas op! Je hebt je rekken niet volledig opgevuld.</div>
            <div class="info">Ben je zeker dat je wil doorgaan?</div>
            <div class="buttons">
                <div class="btn" id="confirm">Bevestig</div>
                <div class="btn yellow" id="cancel">Annuleer</div>
            </div>
        </div>
    </div>
    <div id="ready_info" class="">
        <div class="container">
            <div class="head">Proficiat, je krattenrekken zijn nu netjes opgevuld.</div>
            <div class="info">Zit je drankenvooraard nu goed? Bevestigen om verder te gaan.</div>
            <div class="buttons">
                <div class="btn" id="confirm">Bevestig</div>
                <div class="btn yellow" id="cancel">Annuleer</div>
            </div>
        </div>
    </div>
    <div class="user_form">
        <div class="container">
            <div class="head">Je hebt nu je ideale consignatie samengesteld!</div>
            <div class="field"><input name="name" id="name" placeholder="Naam"></div>
            <div class="field"><input type="email" name="email" id="email" placeholder="Email"></div>
            <div class="field"><input type="tel" name="mobile" id="mobile" placeholder="GSM"></div>
            <div class="field"><input name="address" id="address" placeholder="Adress"></div>
            <div class="field"><input name="vat" id="vat" placeholder="VAT number"></div>
            <div class="field"><textarea type="text" name="comments" id="comments" placeholder="extra Info"
                    rows="1"></textarea></div>
            <div class="buttons">
                <div class="back">Wijzig</div>
                <div class="user_submit">Verstuur</div>
            </div>
        </div>
    </div>
    <div id="crate_info" class="">
        <div class="container">
            <div class="head">Wanneer kies je voor een krat kleine flessen mixed?</div>
            <div class="info">Voor het samenstellen van het perfecte drankenassortiment heb je soms geen volle kratten van elke drank nodig. Drink je bepaalde dranken minder vaak, maar wil je ze toch graag in je assortiment? Dan is een mixed krat de ideale oplossing. Hiermee kun je een krat vullen per 6 of 12 flesjes van verschillende dranken (meestal 24 flesjes in en krat). Beperk het aantal mixed kratten tot maximaal 2 per consignatie. Een mixed voor grote flessen is niet mogelijk.</div>
            <div class="buttons">
                <div class="btn yellow" id="cancel">Terug</div>
            </div>
        </div>
    </div>
    <div id="crate_info2" class="">
        <div class="container">
            <div class="head">Waarvoor dient de leeggoedbox?</div>
            <div class="info">Omdat onze dranken niet gekoeld worden geleverd, plaatsen de meeste klanten (vooral in de zomer) een aantal flesjes in de koelkast. Bij de levering vervangt onze driver alle lege of halflege kratten door volle kratten, zodat je krattenrek weer netjes gevuld is. In de dagen daarna passen je flesjes niet meer in de volle kratten en kun je ze in de leeggoedbox plaatsen. Onze driver zal deze box bij elke levering weer netjes leegmaken.</div>
            <div class="buttons">
                <div class="btn yellow" id="cancel">Terug</div>
            </div>
        </div>
    </div>
    <div class="gameError"></div>
    <div id="rotate"><img src="./assets/rotate.png" alt="" srcset=""></div>
    <script src="./index.js"></script>
</body>

</html>