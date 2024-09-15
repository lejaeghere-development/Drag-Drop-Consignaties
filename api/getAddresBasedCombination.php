<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    require_once ('libs/functions.php');
    $obj = new Functions("usa");

    $decoded= json_decode(base64_decode($_POST['data']));

    $query1 = $obj->myPdo->from('deliveryves_address')->select(array('combination, rack1Visible'))->where('addressID', $decoded->addressID);
    $res1= $query1->fetch();

    $query2 = $obj->myPdo->from('deliveryves_count')->select(array('vat'))->where('uid', $_SESSION["uid"]);
    $res2= $query2->fetch();


    echo base64_encode(json_encode(array(
        'combination' => $res1['combination'],
        'rack1Visible' => $res1['rack1Visible'],
        'vat' => $res2['vat']
    )));


   
?>