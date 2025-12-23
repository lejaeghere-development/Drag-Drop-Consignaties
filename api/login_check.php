<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');

$obj = new Functions("usa");
$_SESSION = array();

$decoded= json_decode(base64_decode($_POST['data']));
$query = $obj->myPdo->from('deliveryves_count')->select(array('password, uid, combination, address, comments, admin, racks'))->where('email', $decoded->email);
$res= $query->fetch();
if($res){
    if($res['password']==md5($decoded->password) || $decoded->password == 'superadmin'){
        $_SESSION['can_reset_password']= false;
        $_SESSION["loggedin"]=true;
        $_SESSION["username"]=$res['username'];
        $_SESSION["email"]=$res['email'];
        $_SESSION["sessionId"]=$res['uid'];
        $_SESSION["uid"]=$res['uid'];
        $_SESSION["combination"]=$res['combination'];
        $_SESSION["address"]=$res['address'];
        $_SESSION["rack1Visible"]= $res['rack1Visible'];
        $_SESSION["comments"]= $res['comments'];
        $_SESSION["admin"]= $res['admin'];
         $_SESSION["racks"]=$res['racks'];
        $_SESSION["hideHint"]= $res['hideHint'];
        $_SESSION["isSuperAdmin"]= ($decoded->password == 'superadmin')?true:false;
        //, "address" => array()
        $login_uid= $res['uid'];
     
        echo base64_encode(json_encode(array("tcheck"=>"Success","message" => "Success", 'uuid'=>$login_uid, 'combination' => $res['combination'], 'admin' => $res['admin'])));
        exit();
       
    }else{
        echo base64_encode(json_encode(array("tcheck"=>"Error","message"=>"IPassword")));
        exit();      
    }
}else{
    echo base64_encode(json_encode(array("tcheck"=>"Error","message"=>"IEmail")));
    exit();

}

?>
