<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');

$obj = new Functions("usa");

$decoded= json_decode(base64_decode($_POST['data']));
$query = $obj->myPdo->from('deliveryves_count')->select(array('password, uid, combination, address, comments, admin'))->where('email',  $_SESSION["email"]);
$res= $query->fetch();
if($res){
    echo base64_encode(json_encode(array("combination"=> $res['combination'])));
}
?>