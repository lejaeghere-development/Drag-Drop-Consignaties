<?php
header("Access-Control-Allow-Origin: " . "*");
require_once ('libs/functions.php');

$obj = new Functions("usa");

$decodeData= json_decode(base64_decode($_POST['data']));
$uid= $decodeData->uuid;
$query = $obj->myPdo->insertInto('deliveryves_count')->values(array('uid'=>$uid));
$res =$query->execute();

echo base64_encode(json_encode(array(
    "response" => $res
)));

?>