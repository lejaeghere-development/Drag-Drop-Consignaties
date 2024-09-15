<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');
date_default_timezone_set('America/Los_Angeles');
$obj = new Functions("usa");// Start with PHPMailer class

$decodeData= json_decode(base64_decode($_POST['data']));


$query = $obj->myPdo->from('deliveryves_count')->select(array('password, uid'))->where('email', $_SESSION["email"]);
$res= $query->fetch();

if($res['password'] != md5($decodeData->password)){
    echo base64_encode(json_encode(array("message" => "OError")));
    exit();
}
$data= array('password' => md5($decodeData->newPassword));
$condition= array('uid' => $_SESSION["uid"]);
$res2=$obj->updateData('deliveryves_count', $data, $condition);

session_destroy();
echo base64_encode(json_encode(array("message" => "Success")));


?>