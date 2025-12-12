<?php
session_start();
header("Access-Control-Allow-Origin: " . "*");
require_once ('libs/functions.php');

$obj = new Functions("usa");

/* $decodeData= (object)$_POST;//json_decode(base64_decode($_POST['data']));//(object)$_POST;//json_decode(base64_decode($_POST['data']));
$uid= $decodeData->uuid;
$dataSent= $decodeData;//$decodeData->data;//$decodeData;//$decodeData->data;
 */

 $decodeData= json_decode(base64_decode($_POST['data']));
//  echo json_encode($decodeData);
// $uid= $decodeData->uuid;
$dataSent= $decodeData;

$operation= $dataSent->operation;



// var_dump($dataSent);
// exit();

$data= array();
    $query = $obj->myPdo->from('deliveryves_count')->select(array('uid'))->where('email', $dataSent->email);
    $res= $query->fetch();
    if($res && $operation == 'ADD'){
        $street= $dataSent->street;
        $title= $dataSent->title;
        $housenumber= $dataSent->housenumber;
        $postalcode= $dataSent->postalcode;
        $city= $dataSent->city;
  
        $addressID=0;

        $max=mt_getrandmax();
        if($max>4294967290)
            $max=4294967290;
        while($addressID==0){
            $addressID = mt_rand(1,$max); 
            $query = $obj->myPdo->from('deliveryves_address')->where('addressID', $addressID);
            $res2=$query->fetch();
            if($res2 && count($res2)>1)
            {
                $addressID=0;
            }
        }
        $data['title']= $title;
        $data['street']= $street;
        $data['housenumber']= $housenumber;
        $data['postalcode']= $postalcode;
        $data['city']= $city;
        $data['addressID']= $addressID;
        $data['uid']= $res['uid'];
        $res = $obj->saveData('deliveryves_address', $data);
        echo base64_encode(json_encode(array(
            "response" => $res,
            "addressID" => $addressID
        )));
        // echo json_encode($res);
    }
    if($res && $operation == 'REMOVE'){
        $addressID= $dataSent->addressID;
        $query = $obj->myPdo->delete('deliveryves_address', 'addressID', $addressID);//->where('address', $addressID);
        $res= $query->execute();
        echo base64_encode(json_encode(array(
            "response" => $res,
            "addressID" => $addressID
        )));
    }

    if($operation == 'NEW_EMAIL'){

        $uid=  $dataSent->uid;
        $email=  $dataSent->email;
        $query = $obj->myPdo->from('deliveryves_count')->select(array('uid'))->where('email', $email);
        $res= $query->fetch();

        if($res){
            echo base64_encode(json_encode(array(
                "response" => array('code' => 409, 'message' => 'Email already exists.')
            )));
        }else{
            $data=array('uid' => $uid, 'email' => $email);
            $res = $obj->saveData('deliveryves_count', $data);
            echo base64_encode(json_encode(array(
                "response" => $res
            )));
        }
       
        
    }

    
// $condition = array('email' => $dataSent->email);


// $query = $obj->myPdo->from('deliveryves_count')->select(array('uid, address'))->where('email', $dataSent->email);
//     $res= $query->fetch();
//     if($res && $operation == 'ADD'){
//         if(strlen($res['address']) == 0){
//             $data['address']= $newTitle.'::'.$newAddress;
//         }else{
//             $data['address']= $res['address'].'::::'.$newTitle.'::'.$newAddress;
//         }
//         //
//         $condition = array('email' => $dataSent->email);
//         $res = $obj->updateData('deliveryves_count', $data, $condition);
//     }
//     if($res && $operation == 'REMOVE'){
//         $address_list= explode('::::', $res['address']);
//         // echo json_encode($address_list);

//         $removeIndex= array_search($newTitle.'::'.$newAddress, $address_list);
//         if ($removeIndex !== false) {
//             unset($address_list[$removeIndex]);
//         }else{
//             // echo "Not Found";
//         }

//         $joined_address = implode('::::', $address_list);
//         $data['address']= $joined_address;
//         $condition = array('email' => $dataSent->email);
//         $res = $obj->updateData('deliveryves_count', $data, $condition);
      
//     }
?>