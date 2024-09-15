<?php
session_start();
header("Access-Control-Allow-Origin: " . "*");
require_once ('libs/functions.php');

$obj = new Functions("usa");

$decodeData= json_decode(base64_decode($_POST['data']));
$uid= $decodeData->uuid;
$dataSent= $decodeData->data;



$data= array();
foreach($dataSent as $key => $val){
    if(strlen($val) > 0){
        $data[$key]= $val;
    }

}
if($_SESSION["uid"]){
    $condition = array('uid' => $_SESSION["uid"]);
    $res = $obj->updateData('deliveryves_count', $data, $condition);
    if(strlen($data['addressID']) > 0){
    
        $rackData= array(
            'rack1Visible' => $data['rack1Visible'],
            'combination' => $data['combination']
        );
        $rackCondition = array('addressID' => $data['addressID']);
        $obj->updateData('deliveryves_address', $rackData, $rackCondition);
    }
}else{
    $query = $obj->myPdo->from('deliveryves_count')->select(array('uid'))->where('email', $dataSent->email);
    $res= $query->fetch();
    if($res){
        $condition = array('email' => $dataSent->email);
        $res = $obj->updateData('deliveryves_count', $data, $condition);
    }else{
        $data['uid']= $uid;
        $res = $obj->saveData('deliveryves_count', $data);
    }
}



echo base64_encode(json_encode(array(
    "response" => $res,
    "email" => $dataSent->email,
    "data" => $data
)));

?>