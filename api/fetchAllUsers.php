<?php
header("Access-Control-Allow-Origin: " . "*");
require_once ('libs/functions.php');

$obj = new Functions("usa");

$addressInfo=array();
$userInfo=array();
$query = $obj->myPdo->from('deliveryves_count')->select(array('uid','email'));
$results= $query->fetchAll();
foreach ($results as $res) {
    if($res['admin'] != 1){
        $userInfo[$res['email']]= array();
        $addressInfo[$res['email']]= array();

        $userInfo[$res['email']]['racks']= $res['racks'];
        $userInfo[$res['email']]['showEmpty']=$res['show_empty'];

        $addressQ = $obj->myPdo->from('deliveryves_address')->select(array())->where('uid', $res['uid']);
        $addressR= $addressQ->fetchAll();
        foreach ($addressR as $resA) {
    
            // echo json_encode($resA);
            $addressInfo[$res['email']][$resA['addressID']]= array();
            $addressInfo[$res['email']][$resA['addressID']]['title'] = $resA['title'];
            $addressInfo[$res['email']][$resA['addressID']]['street'] = $resA['street'];
            $addressInfo[$res['email']][$resA['addressID']]['housenumber'] = $resA['housenumber'];
            $addressInfo[$res['email']][$resA['addressID']]['postalcode'] = $resA['postalcode'];
            $addressInfo[$res['email']][$resA['addressID']]['city'] = $resA['city'];
        }
    }
   
}
/* $query = $obj->myPdo->from('deliveryves_count AS u')
            //  ->select(array('uid','username','email'))
             ->leftJoin('deliveryves_address AS a ON u.uid = a.uid')
             ->select('u.uid AS user_id, u.username AS user_name, u.email AS user_email, 
                       a.addressID AS address_id, a.street,a.housenumber, a.city, a.postalcode')
             ->orderBy('u.uid');

$results = $query->fetchAll(); */
// echo json_encode($addressInfo);


/* $dataToSent= array();
for($i=0; $i< count($res); $i++){
    array_push($dataToSent, array(
        'email' => $res[$i]['email'],
        'address' => $res[$i]['address'],
        
    ));
} */


echo base64_encode(json_encode(array(
    "address_info" => $addressInfo,
    "user_info" => $userInfo
)));

?>