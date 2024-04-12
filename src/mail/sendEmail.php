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
$obj = new Functions("usa");// Start with PHPMailer class
$decodeData= json_decode(base64_decode($_POST['data']));


    // create a new object
    $mail = new PHPMailer();
    // configure an SMTP
    $mail->isSMTP();
    $mail->Mailer = "smtp";
    $mail->Host = "mail.smtp2go.com";
    $mail->Port = 443; // 8025, 587 and 25 can also be used. Use Port 465 for SSL. 8025, 587, 80 or 25// 443
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'ssl';
    /* $mail->Username = "apexexp.in";
    $mail->Password = '4g5trDUlSAOZBvuD'; */
    
        $mail->Username = "fit-it.be";
    $mail->Password = 'I2m8sFymIgiiNVN0';
   
    
    $tempPass = rand(10000,99999);


    $mail->From = "deliveryves@fit-it.be";
    $mail->FromName = "Deliveryves StackUp";
     $mail->AddAddress($decodeData->email,'Saif');
     $mail->AddAddress('hello@deliveryves.be','DeliveryVes');
    $mail->Subject = 'Deliveryves Result';
    $mail->isHTML(TRUE);
    $mail->Body = "
    <html lang='en'>
<head>
     <meta charset='UTF-8'>
     <meta name='viewport' content='width=device-width, initial-scale=1'>
     <meta http-equiv='X-UA-Compatible' content='IE=edge'>
     <title>New Email</title>
     <!--Dark Mode meta tags needed to enable Dark Mode in email client user agents-->
     <meta name='color-scheme' content='light dark'>
     <meta name='supported-color-schemes' content='light dark only'>

     <link rel='preconnect' href='https://fonts.googleapis.com'>
     <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
     <link href='https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap' rel='stylesheet'>
     <style type='text/css'>
          :root {
               color-scheme: light dark;
               supported-color-schemes: light dark;
          }


          /* targets color attribute */
          [data-ogsc] .text-color{

          }

       
               @font-face {
                font-family: 'Montserrat-Bold';
                src: url('./fonts/Montserrat-Bold.otf');

               }
               @font-face {
                    font-family: 'Montserrat-Regular';
                    src: url('./fonts/Montserrat-Regular.otf');
    
                   }


          @media (prefers-color-scheme: dark) {


               u + .body .gmail-screen { background:#fff; mix-blend-mode:screen; }
               u + .body .gmail-difference { background:#fff; mix-blend-mode:difference; }

          }




          *{

               box-sizing: border-box;
               padding: 0;border-spacing: 0px;
               margin: 0;
               padding: 0;
               font-family: 'Lato', sans-serif;
          }
          .blue_txt{
               color: #007892;
          }
          .txt_regular, .txt_regular *{
               font-family:'Arial'
          }
          .txt_bold, .txt_bold *{
               font-family:'Montserrat-Bold'
          }
          .hover:hover{
               background-color: #34526C !important;
               color: #fff !important;
          }
          .head{
               font-size: 20px;
               text-align: left;
               padding: 5px 0;
          }
          .sub{
               font-size: 17px;
               text-align: left;
               
          }
          @media only screen and (max-width:500px){

          }
     </style>
</head>
<body style='margin:0;background-color: #111111;' class='full-back'>
     <table style='width: 100%;background-color: #111111;' cellpadding='0' cellspacing='0' border='0' align='center' class='full-back'>
          <tr>
               <td style='background-color: #111111;' class='full-back' align='center'>


                    <table style='border: none;padding: 0;margin: 0 auto;width:100%;' align='center' border='0' cellpadding='0' cellspacing='0' class='w100'>
                         <tr>
                              <td style='padding: 0;max-width: 700px; min-width: 200px; line-height: 1.4; color: #212121;padding: 0;border-spacing: 0;border-spacing: 0;padding: 0;margin: 0;box-sizing: border-box;width: 700px;background-color: #F7F8F9;' width='700' class='w100'>


                                  <div style='padding:20px;background: linear-gradient(#ffdf43, #ffdf43);background-color:#9EE1D6;width: 100%;'>

     <table style='background: #ffffff;padding: 20px; border: 1px solid #007892;border-radius: 10px;width: 700px;margin:auto;' width='700' cellpadding='0' cellspacing='0' border='0' class='full-width'>
       <tr>
          <td width='700' valign='top' align='center' style='background-repeat:no-repeat; background-size:cover;text-align: center;padding-bottom: 0px;width: 700px;padding-top: 60px;background-repeat: no-repeat;' class='full-width'>
               <table style='width: 700px;margin:auto;' width='700' cellpadding='0' cellspacing='0' border='0' class='full-width'>
                    <tr>
                         <td style='padding-left: 0px;padding-right: 0px;text-align: center;padding-top: 0px;'>
                              <table style='width: 700px;' width='700' cellpadding='0' cellspacing='0' border='0' class='full-width'>
                                   <tr>
                                        <td style='width: 175px;vertical-align: middle;' width='175'>
                                        </td>
                                        <td style='width: 350px;vertical-align: middle;' width='350'>
                                             <img class='img-fluid logo' src='https://www.fit-it.be/krattenrek/Email/Logo.png' style='width: 350px;' width='350'>
                                        </td>
                                        <td style='width: 175px;vertical-align: middle;' align='right' width='175'>
                                        </td>
                                   </tr>
                              </table>
                         </td>
                    </tr>
               </table>

               <table style='width: 700px;margin-bottom:100px;' width='700' cellpadding='0' cellspacing='0' border='0' class='full-width'>
                   <tr>
                         <td class='txt_bold blue_txt head'>
                         Beste ".$decodeData->name.",
                         </td>
                   </tr>
                   <tr>
                         <td class='txt_regular black_txt sub'>
                              Hartelijk dank voor het aangename gesprek. DeliverYves kijkt ernaar uit om met jou samen te werken en wil ervoor zorgen dat jouw drankvoorraad perfect aansluit bij de dranken die jullie graag nuttigen.
                         </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub'>
                              We hebben de gekozen dranken alvast overzichtelijk geplaatst in onze zeer handige krattenrekken. Zo krijg je een duidelijk beeld van wat je binnenkort thuis geleverd zult krijgen.
                         </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub'>
                              Klopt alles, of wil je nog aanpassingen maken?
                         </td>
                    </tr>
                    <tr>
                              <td class='txt_bold blue_txt head'>
                              <u>Overzicht</u>
                              </td>
                    </tr>
                    <tr>
                              <td style='padding-left: 100px;padding-right: 100px;text-align: center;padding-top: 28px;' align='center'>
                              <img class='img-fluid img-texto' src='https://www.fit-it.be/krattenrek/Email/".$decodeData->uid."/Poster.png' style='width: 700px;border: 1px solid #007892; border-radius: 10px;' width='500'>

                              <table style='width: 500px;display: none;' width='500' cellpadding='0' cellspacing='0' border='0' class='full-width'>
                                   <tr>
                                        <td style='width: 500px;padding-top: 15px;' width='500' align='center'>
                                             <table style='width: 350px;' width='350' cellpadding='0' cellspacing='0' border='0' class='full-width'>
                                                  <tr>
                                                       <td style='width: 350px;' width='350'>
                                                            <a href='' target='_blank' style='display: block;text-decoration: none;text-align: center;padding: 21px;font-size: 30px;-moz-box-shadow: 3px 4px 0px 0px #34526c;-webkit-box-shadow: 3px 4px 0px 0px #34526c;box-shadow: 3px 4px 0px 0px #34526c;background-color: #fff;-webkit-border-radius: 15px;-moz-border-radius: 15px;border-radius: 20px;border: 1px solid #fff;cursor: pointer;color: #34526c;font-family: Arial;font-weight: bold;text-decoration: none;text-shadow: 0px 1px 0px #34526c;' class='hover'>$tempPass</a>
                                                       </td>
                                                  </tr>
                                             </table>
                                        </td>
                                   </tr>
                              </table>
                         </td>
                    </tr>
                    <tr>
                              <td class='txt_bold blue_txt head'>
                              <u>Naam</u>
                              </td>
                    </tr>
                    <tr>
                              <td class='txt_regular black_txt head'>
                              ".$decodeData->name."
                              </td>
                    </tr>
                    <tr>
                              <td class='txt_bold blue_txt head'>
                              <u>Telefoonnummer</u>
                              </td>
                    </tr>
                    <tr>
                              <td class='txt_regular black_txt head'>
                              ".$decodeData->mobile."
                              </td>
                    </tr>
                    <tr>
                              <td class='txt_bold blue_txt head'>
                              <u>Opmerkingen</u>
                              </td>
                    </tr>
                    <tr>
                              <td class='txt_regular black_txt head'>
                              ".$decodeData->comments."
                              </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub' style='padding-top:20px;'>
                              Als de huidige selectie klopt, hoef je niets te doen. Als je echter nog wijzigingen wilt aanbrengen in je consignatie/drankenvoorraad, <a href='".(string)$decodeData->redirectUrl."' target='_blank'>druk dan op</a> ... of stuur ons een e-mail op hello@deliveryves.be
                         </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub'>
                              We staan klaar om je drankenvoorraad aan te vullen als deze nog niet volledig op is, dus wanneer ongeveer 80% verbruikt is. Je kunt de leveringsmomenten zelf regelen door de kalender aan te passen, die we automatisch naar je sturen zodra we vermoeden dat je drankvoorraad aanzienlijk geslonken is.
                         </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub'>
                              Dank je wel voor het vertrouwen in DeliverYves. We kijken ernaar uit om jou binnenkort van dienst te zijn.
                         </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub' style='padding-top:20px;'>
                         Met vriendelijke groet,
                         </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub'>
                         Het Team van DeliverYves
                         </td>
                    </tr>
                    <tr>
                         <td class='txt_regular black_txt sub'>
                         hello@deliveryves.be
                         </td>
                    </tr>
           </table>


         



      





</td>
</tr>
</table>
 <!--[if gte mso 9]>
</v:textbox>
</v:rect>
<![endif]-->
</div>











</td>
</tr>
</table>






</td>
</tr>
</table>
</body>
</html>

    ";
    if(!$mail->send()){
          echo json_encode(array('info' => 'Message could not be sent.'));
     //    echo base64_encode('Mailer Error: ' . $mail->ErrorInfo);
    } else {
          echo json_encode(array('info' => 'Message has been sent'));
    }
   /*  $resetkey= $decodeData->reset_key;
    $data= array('resetkey'=> (string)$resetkey);
    $data= array('tempPassword'=> (string)$tempPass);
    $condition= array('uid' => $id);
    $res=$obj->updateData('dino_game_users', $data, $condition);
 */


?>