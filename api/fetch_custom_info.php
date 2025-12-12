<?php
header("Access-Control-Allow-Origin: " . "*");
require_once ('libs/functions.php');

$obj = new Functions("usa");

$addressInfo=array();
$userInfo=array();
$query = $obj->myPdo->from('deliveryves_custom_crate')->select(array('bottle_key','enabled'));
$results= $query->fetchAll();
echo base64_encode(json_encode($results));
    ?>