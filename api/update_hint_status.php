<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');
date_default_timezone_set('America/Los_Angeles');
$obj = new Functions("usa");// Start with PHPMailer class
$decodeData= json_decode(base64_decode($_POST['data']));


$data = array('hideHint' => $decodeData->hideHint);
$condition = array('email' => $decodeData->email);
$res = $obj->updateData('deliveryves_count', $data, $condition);

?>