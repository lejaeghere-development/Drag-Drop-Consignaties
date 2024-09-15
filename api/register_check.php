<?php
session_start();

header("Access-Control-Allow-Origin: " . "*");
require_once ('libs/functions.php');

$obj = new Functions("usa");
$decoded= json_decode(base64_decode( $_POST['data']));
$query = $obj->myPdo->from('deliveryves_count')->select(array('uid', 'password, combination'))->where('email', $decoded->email);
$res= $query->fetch();
$uid=$decoded->uuid;
if(!$res || ($res && strlen($res['password']) == 0)){

    $activation_random = rand();
    $activation_code = md5($activation_random);
    $team = explode(".",explode("@",$decoded->email)[1])[0];

    if($res && strlen($res['password']) == 0){
        $data = array('username' => $decoded->username, 'password' => md5($decoded->password), 'mobile' => $decoded->mobile, 'rack1Visible' => 1);
        $condition = array('email' => $decoded->email);
        $res2 = $obj->updateData('deliveryves_count', $data, $condition);
        echo base64_encode(json_encode(array("message" => "Success")));
        exit();
    }else{
        try {
            $query = $obj->myPdo->insertInto('deliveryves_count')->values(array('uid'=>$uid,'username' => $decoded->username,'email' => $decoded->email,'mobile' => $decoded->mobile,'password' => md5($decoded->password), 'rack1Visible' => 1));
            $res2 =$query->execute();
            $_SESSION['can_reset_password']= false;
            $_SESSION["loggedin"]=true;
            $_SESSION["username"]=$decoded->username;
            $_SESSION["email"]=$decoded->email;
            $_SESSION["hideHint"]= false;
           
            $_SESSION["sessionId"]=$uid;
            
            if($res && strlen($res['password']) == 0){
                $_SESSION["combination"]=$res['combination'];
                $_SESSION["uid"]=$res['uid'];
                $_SESSION["address"]=$res['address'];
            }else{
                $_SESSION["combination"]='';
                $_SESSION["uid"]=$uid;
                $_SESSION["address"]='';
            }
            $_SESSION["rack1Visible"]= 1;
    
            echo base64_encode(json_encode(array("message" => "Success")));
            exit();
        } catch (PDOException $e) {
            echo base64_encode(json_encode(array("message" => "Error")));
            exit();
        }
      
    }
  
}else{
    echo base64_encode(json_encode(array("message" => "dEmail")));
    exit();
}

// echo $res;


?>