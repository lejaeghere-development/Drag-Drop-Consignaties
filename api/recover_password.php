<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');
date_default_timezone_set('America/Los_Angeles');
$obj = new Functions("usa");// Start with PHPMailer class
$decodeData= json_decode(base64_decode($_POST['data']));

$query = $obj->myPdo->from('deliveryves_count')->select(array('username, uid'))->where('tempCode', $decodeData->tempCode);
$res= $query->fetch();
$_SESSION = array();

if($res && $decodeData->tempCode != 'null'){
    $data= array('password' => md5($decodeData->password), 'tempCode' => 'null');
    $condition= array('uid' => $res['uid']);
    $res2=$obj->updateData('deliveryves_count', $data, $condition);

    echo base64_encode(json_encode(array("message" => "Success")));

}else{
    echo base64_encode(json_encode(array("message" => "Error")));

}

?>