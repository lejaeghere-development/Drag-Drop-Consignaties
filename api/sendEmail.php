<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require("mailer/Exception.php");
require("mailer/PHPMailer.php");
require("mailer/SMTP.php");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');
date_default_timezone_set('America/Los_Angeles');
$obj = new Functions("usa");

$decodeData= json_decode(base64_decode($_POST['data']));
$domainBase='https://www.deliveryves.be/krattenrek/';

// Create drinks HTML block
$drinksHtml = "";
if (isset($decodeData->drinks) && is_object($decodeData->drinks)) {
    $drinksHtml .= "<tr><td class='txt_regular black_txt sub' style='padding-top:20px; font-weight: bold;'>Je nieuwe drankvoorraad:</td></tr>";
    foreach ($decodeData->drinks as $drink => $qty) {
        $drinksHtml .= "<tr><td class='txt_regular black_txt sub' style='padding-bottom: 5px;'>"
                     . htmlspecialchars($drink) . ": " . htmlspecialchars($qty) . "</td></tr>";
    }

}
if (isset($decodeData->prevdrinks) && is_object($decodeData->prevdrinks)) {
  $drinksHtml .= "<tr><td class='txt_regular black_txt sub' style='padding-top:20px; font-weight: bold;'>Je vorige drankvoorraad:</td></tr>";
    foreach ($decodeData->prevdrinks as $drink => $qty) {
        $drinksHtml .= "<tr><td class='txt_regular black_txt sub' style='padding-bottom: 5px;'>"
                     . htmlspecialchars($drink) . ": " . htmlspecialchars($qty) . "</td></tr>";
    }
}

// create a new object
$mail = new PHPMailer();
// configure SMTP
$mail->isSMTP();
$mail->Mailer = "smtp";
$mail->Host = "mail.smtp2go.com";
$mail->Port = 443;
$mail->SMTPAuth = true;
$mail->SMTPSecure = 'ssl';

$mail->CharSet  = 'UTF-8';
$mail->Encoding = 'base64'; // or '8bit' if you prefer
$mail->isHTML(true);

$mail->Username = "fit-it.be";
$mail->Password = 'I2m8sFymIgiiNVN0';

$tempPass = rand(10000,99999);

$mail->From = "deliveryves@fit-it.be";
$mail->FromName = "Deliveryves";
$mail->AddAddress($decodeData->email, $decodeData->name);
$mail->AddAddress('hello@deliveryves.be','DeliverYves');

$mail->isHTML(TRUE);

if($_SESSION['loggedin']){ // Logged in
     if($_SESSION["isSuperAdmin"]){
     $mail->Subject = 'Activeer je drankplanner';
     $mail->Body = "<html lang='en'>
     <head>
          <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1'>
          <meta http-equiv='X-UA-Compatible' content='IE=edge'>
          <title>New Email</title>
          <meta name='color-scheme' content='light dark'>
          <meta name='supported-color-schemes' content='light dark only'>
     </head>
     <body style='margin:0;background-color: #111111;' class='full-back'>
          <table style='width: 100%;background-color: #111111;' cellpadding='0' cellspacing='0' border='0' align='center'>
          <tr><td align='center'>
               <table style='max-width:700px;width:100%;background:#F7F8F9;' cellpadding='0' cellspacing='0' border='0'>
               <tr><td>
               <div style='padding:20px;background-color:#FFF9F4;'>
                    <table style='border:1px solid #007892;border-radius:10px;width:100%;margin:auto;' cellpadding='0' cellspacing='0' border='0'>
                    <tr><td align='center' style='padding:40px 20px;'>
                         <img src='".$domainBase."assets/logo.png' style='width:350px;'>
                         <p style='font-weight:bold;'>Hallo,</p>
                         <p>We hebben een nieuwe tool ontwikkeld waarmee je wijzigingen in je drankvoorraad doorgeeft voor je volgende levering.</p>
                         <p>Vanaf nu hoef je hiervoor niet meer te mailen — alles kan snel via deze online drankplanner.</p>
                        <p>Registreer je éénmalig via onderstaande link: <a href='https://www.deliveryves.be/krattenrek/register.php'><span style='font-weight:bold;'>deze link</span></a></p>
                        <p><span style='font-weight:bold;'>Belangrijk: </span>wijzigingen altijd <span style='font-weight:bold;'>minstens 2 werkdagen vooraf.</span></p>
                        <p><span style='font-weight:bold;'>NAAM: ".$decodeData->name."</span></p>
                        <p><span style='font-weight:bold;'>Leveradres: </span>".$decodeData->address."</p>
                    
                         
                         <img src='".$domainBase."Email/".$_SESSION["uid"]."/".$decodeData->imageName.".png' style='width:100%;max-width:700px;border:1px solid #007892;border-radius:10px;'>
                         
                         <!-- Drinks block -->
                         ".$drinksHtml."
                    </td></tr>
                    </table>
               </div>
               </td></tr>
               </table>
          </td></tr>
          </table>
     </body>
     </html>";
     }else{
    $mail->Subject = 'Je wijziging in je drankenvoorraad hebben we goed ontvangen';
     $mail->Body = "<html lang='en'>
     <head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1'>
          <meta http-equiv='X-UA-Compatible' content='IE=edge'>
          <title>New Email</title>
          <meta name='color-scheme' content='light dark'>
          <meta name='supported-color-schemes' content='light dark only'>
     </head>
     <body style='margin:0;background-color: #111111;' class='full-back'>
          <table style='width: 100%;background-color: #111111;' cellpadding='0' cellspacing='0' border='0' align='center'>
          <tr><td align='center'>
               <table style='max-width:700px;width:100%;background:#F7F8F9;' cellpadding='0' cellspacing='0' border='0'>
               <tr><td>
               <div style='padding:20px;background-color:#FFF9F4;'>
                    <table style='border:1px solid #007892;border-radius:10px;width:100%;margin:auto;' cellpadding='0' cellspacing='0' border='0'>
                    <tr><td align='center' style='padding:40px 20px;'>
                         <img src='".$domainBase."assets/logo.png' style='width:350px;'>
                         <p style='font-weight:bold;'>Hallo,</p>
                         <p>Je voorraadwijziging voor de volgende levering is goed ontvangen.</p>
                         <p><span style='font-weight:bold;'>Belangrijk: </span>wijzigingen graag uiterlijk <span style='font-weight:bold;'>2 werkdagen vooraf.</span></p>
                        <p><span style='font-weight:bold;'>NAME: </span></p>
                         <p><span style='font-weight:bold;'>Leveradres: </span>".$decodeData->address."</p>
              
                    
                         <img src='".$domainBase."Email/".$_SESSION["uid"]."/".$decodeData->imageName.".png' style='width:100%;max-width:700px;border:1px solid #007892;border-radius:10px;'>
                         
                         <!-- Drinks block -->
                         ".$drinksHtml."
                    </td></tr>
                    </table>
               </div>
               </td></tr>
               </table>
          </td></tr>
          </table>
     </body>
     </html>";

     }
    
}else{ // Not logged in
    $mail->Subject = 'Deliveryves: Jouw ideale drankenvoorraad';
    $mail->Body = "<html lang='en'>
    <head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1'>
      <meta http-equiv='X-UA-Compatible' content='IE=edge'>
      <title>New Email</title>
      <meta name='color-scheme' content='light dark'>
      <meta name='supported-color-schemes' content='light dark only'>
    </head>
    <body style='margin:0;background-color: #111111;' class='full-back'>
      <table style='width:100%;background:#111111;' cellpadding='0' cellspacing='0' border='0' align='center'>
        <tr><td align='center'>
          <table style='max-width:700px;width:100%;background:#F7F8F9;' cellpadding='0' cellspacing='0' border='0'>
            <tr><td>
              <div style='padding:20px;background:#FFF9F4;'>
                <table style='border:1px solid #007892;border-radius:10px;width:100%;margin:auto;' cellpadding='0' cellspacing='0' border='0'>
                  <tr><td align='center' style='padding:40px 20px;'>
                    <img src='".$domainBase."assets/logo.png' style='width:350px;'>
                    <p>Hallo,</p>
                    <p>Bedankt voor het fijne gesprek. We hebben de gekozen dranken geplaatst in je krattenrekken.</p>
                   
                    <img src='".$domainBase."Email/".$decodeData->uid."/".$decodeData->imageName.".png' style='width:100%;max-width:700px;border:1px solid #007892;border-radius:10px;'>
                    
                    <p>Naam: ".$decodeData->name."</p>
                    <p>Telefoonnummer: ".$decodeData->mobile."</p>
                    <p>Adres: ".$decodeData->address."</p>
                    <p>BTW: ".$decodeData->vat."</p>
                    <p>Opmerkingen: ".$decodeData->comments."</p>
                    
                    <!-- Drinks block -->
                    ".$drinksHtml."
                    
                  
                  </td></tr>
                </table>
              </div>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>";
}

if(!$mail->send()){
    echo json_encode(array('info' => 'Message could not be sent.'));
}else {
    echo json_encode(array('info' => 'Message has been sent', 'isAdmin'=>$_SESSION["isSuperAdmin"]));
}
?>
