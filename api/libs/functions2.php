<?Php
class Functions {
    var $myPdo = null;
    
    function __construct($location = "dubai"){
        $location_list=array(
            "australia" => "Australia/Adelaide",
            "canada" => "Canada/Central",
            "dubai" => "Asia/Dubai",
            "germany" => "Europe/Berlin",
            "india" => "Asia/Kolkata",
            "lebanon" => "Asia/Beirut",
            "london" => "Europe/London",
            "netherlands" => "Europe/Amsterdam",
            "nigeria" => "Africa/Lagos",
            "oman" => "Asia/Muscat",
            "qatar" => "Asia/Qatar",
            "saudi" => "Asia/Riyadh",
            "singapore" => "Asia/Singapore",
            "usa" => "America/New_York", 
            "vietnam"=> "Asia/Ho_Chi_Minh",
            "croatia"=> "Europe/Zagreb",
            "south_africa" => "Africa/Johannesburg",
            "sri_lanka" => "Asia/Colombo",
            "kenya" => "Africa/Nairobi",
            "spain" => "Europe/Madrid"
        );
        if(array_key_exists($location,$location_list))
            date_default_timezone_set($location_list[$location]);
        else
            date_default_timezone_set("Asia/Dubai");
        require_once ('FluentConfig.php');
        $this->myPdo=$fpdo; 
    }
    
    function createUser($tbl_count = '', $device = 'web', $values=array()){
        $tbl_count = $this->htmlEncode($tbl_count);
        $device =($device=="mobile")?"mobile":"web";
        $values = $this->htmlEncode($values);
        if(!is_array($values))
            $values = array();
        if($tbl_count=='')
            return false;
        require_once ('Browser.php');
        $browser = new Browser();
        $br=$browser->getBrowser();
        $os=$browser->getPlatform();
        $uid=0;
        $max=mt_getrandmax();
        if($max>4294967290)
            $max=4294967290;
        while($uid==0){
            $uid = mt_rand(1,$max); 
            $query = $this->myPdo->from($tbl_count)->where('uid', $uid);
            $res=$query->fetch();
            if(count($res)>1)
            {
                $uid=0;
            }
        }
        $values['uid']=$uid;
        $values['device'] = $this->htmlEncode($device);
        $values['browser']=$this->htmlEncode($br);
        $values['os']=$this->htmlEncode($os);
        $values['user_ip']=$this->htmlEncode($this->getClientIp());
        $values['created_date']=date("Y-m-d H:i:s");
        $query = $this->myPdo->insertInto($tbl_count)->values($values);
        $x=$query->execute();
        if($x!==false)
            return $uid;
        return false;
    }
    
    function getClientIp() {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if(getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if(getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if(getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if(getenv('HTTP_FORWARDED'))
            $ipaddress = getenv('HTTP_FORWARDED');
        else if(getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }
    
    function clickUpdater($tbl_name = "", $uid = 0, $col_name = "", $col_on = 'uid'){
        $tbl_name = $this->htmlEncode($tbl_name);
        $uid = $this->htmlEncode($uid);
        $col_name = $this->htmlEncode($col_name);
        $col_on = $this->htmlEncode($col_on);
        if($tbl_name=='' || $uid== 0)
            return false;
        if($col_name!=''){
            $query = $this->myPdo->update($tbl_name)->set($col_name,new FluentLiteral($col_name.'+1'))->where($col_on, $uid);
            $query->execute();
            return true;
        }
        return false;
    }
    
    function clickActivator($tbl_name = "", $uid = 0, $col_name = "", $col_on = 'uid'){
        $tbl_name = $this->htmlEncode($tbl_name);
        $uid = $this->htmlEncode($uid);
        $col_name = $this->htmlEncode($col_name);
        $col_on = $this->htmlEncode($col_on);
        if($tbl_name=='' || $uid== 0)
            return false;
        if($col_name!=''){
            $query = $this->myPdo->update($tbl_name)->set($col_name,1)->where($col_on, $uid);
            $query->execute();
            return true;
        }
        return false;
    }
    
    function isUnique($tbl_name = "", $col_name = "", $values = ""){
        $tbl_name = $this->htmlEncode($tbl_name);
        $col_name = $this->htmlEncode($col_name);
        $values = $this->htmlEncode($values);
        
        if($tbl_name=='' || $col_name == '' || $values == '')
            return false;
        $query = $this->myPdo->from($tbl_name)->select()->select($col_name)->where($col_name, $values);
        $res=$query->fetch();
        if(isset($res[$col_name]) && $res[$col_name] != '')
            return false;
        else
            return true;
    }
    
    function htmlEncode($data){
        if(is_array($data)){
            foreach($data as $key=>$val){
                $data[htmlspecialchars(trim($key),ENT_QUOTES,'UTF-8')]=htmlspecialchars(trim($val),ENT_QUOTES,'UTF-8');
            }
            return $data;
        }
        else{
            return htmlspecialchars(trim($data),ENT_QUOTES,'UTF-8');
        }
    }
    
    function isEmail($email = ""){
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) 
            return true;
        return false;
    }
    
    function isNumber($number = 0, $min = 0 , $max = 50, $start_with_plus = false){
        $num =strval($number);
        if($num!="" && $num["0"]==0){
            $t_num = substr($number,1);
            if($t_num!=""){
                $number = intval ($t_num);
            }
            else{ 
                $number = "";
            }
        }
        if (filter_var($number, FILTER_VALIDATE_INT) && $number>=0 && (!$start_with_plus || $number[0]=="+")){
            if(strlen($number) >= $min && strlen($number) <= $max){
                return true;
            }
        }
        return false;
    }
    
    function saveData($tbl_name = "", $data = array(),$add_date = true){
        $tbl_name =$this->htmlEncode($tbl_name);
        if($tbl_name=="")
            return array("code"=>400,"message"=>"Invalid data format");
        $values =  array();
        if(is_array($data)){
            foreach($data as $key=>$val){
                $values[$this->htmlEncode($key)]=$this->htmlEncode($val);
            }
            if($add_date==true)
                $values['created_date']=date("Y-m-d H:i:s");
            $query = $this->myPdo->insertInto($tbl_name)->values($values);
            $query->execute();
            return array("code"=>200,"message"=>"Data saved");
        }
    }
    
    function saveValidatedData($tbl_name = "", $data = array(),$add_date = true){
        $tbl_name =$this->htmlEncode($tbl_name);
        if($tbl_name=="")
            return array("code"=>400,"message"=>"Invalid!");
         if(is_array($data)){
             $values =  array();
             foreach($data as $field){
                 if(is_array($data) && isset($field["name"]) && isset($field["value"])){
                     $type = isset($field["type"])?$field["type"]:"text";
                     switch ($type){
                         case "email":
                             if((!isset($field["required"]) || $field["required"]!=true) && trim($field["value"])==""){
                                 $values[$field["name"]] = $field["value"];
                             }
                             else{
                                 if($this->isEmail($field["value"])){
                                     $values[$field["name"]] = $field["value"];
                                 }
                                 else
                                     return array("code"=>406,"message"=>"Invalid ".$field["name"]);
                             }
                             break;
                         case "number":
                             $min = isset($field["minLength"])?$field["minLength"]:0;
                             $max = isset($field["maxLength"])?$field["maxLength"]:50;
                             if(isset($field["required"]) && $field["required"]==true && $min==0)
                                 $min=1;
                             $start_with_plus = isset($field["start_with_plus"])?$field["start_with_plus"]:false;
                             if($min>0 || $field["value"]!=""){
                                 if($this->isNumber($field["value"],$min,$max,$start_with_plus)){
                                     $values[$field["name"]] = $field["value"];
                                 }
                                 else
                                     return array("code"=>406,"message"=>"Invalid ".$field["name"]);
                             }
                             else{}
                                 
                             break;
                         default:
                             if(isset($field["required"]) && $field["required"]==true){
                                 if(trim($field["value"])=="")
                                     return array("code"=>406,"message"=>$field["name"]." can not be empty.");
                             }
                             if(isset($field["minLength"])){
                                 if(strlen($field["value"])<$field["minLength"])
                                     return array("code"=>406,"message"=>$field["name"]." should be at least ".$field["minLength"]." character long");
                             }
                             if(isset($field["maxLength"])){
                                 if(strlen($field["value"])>$field["maxLength"])
                                     return array("code"=>406,"message"=>$field["name"]." cannot have more than ".$field["maxLength"]." character");
                             }
                             $values[$field["name"]] = $field["value"];
                     }
                     if(isset($field["unique"]) && $field["unique"]==true){
                         if(!$this->isUnique($tbl_name,$field["name"], $field["value"]))
                             return array("code"=>412,"message"=>$field["name"]." already registered");
                     }
                 }
                 else 
                     return array("code"=>400,"message"=>"Invalid data format");
                 
             }
             $flag= false;
             if($add_date==true)
                 $flag=true;
             return $this->saveData($tbl_name,$values,$flag);
         }
    }
    
    function updateData($tbl_name = "", $data = array(),$condition = array()){
        $tbl_name =$this->htmlEncode($tbl_name);
        if($tbl_name=="")
            return array("code"=>400,"message"=>"Invalid data format");
        $set =  array();
        if(is_array($data)){
            if(is_array($condition)){
                $query = $this->myPdo->from($tbl_name);
                foreach($condition as $key=>$val)
                    $query = $query->where($key, $val);
                
                $result = $query->fetchAll();
                if($result===false || count($result)!=1)
                    return array("code"=>416,"message"=>"Invalid condition");
                
                foreach($data as $key=>$val)
                    $set[$this->htmlEncode($key)]=$this->htmlEncode($val);
                
                $query1 = $this->myPdo->update($tbl_name)->set($set);
                foreach($condition as $key=>$val)
                    $query1 = $query1->where($key, $val);
                
                $x= $query1->execute();
                if($x!==false)
                    return array("code"=>200,"message"=>"Data updated");
            }
        }
        return array("code"=>400,"message"=>"Invalid data format.");
    }
    
    function updateValidatedData($tbl_name = "", $data = array(),$condition = array()){
        $tbl_name =$this->htmlEncode($tbl_name);
        if($tbl_name=="")
            return array("code"=>400,"message"=>"Invalid ");
         if(is_array($data)){
             $values =  array();
             foreach($data as $field){
                 if(is_array($data) && isset($field["name"]) && isset($field["value"])){
                     $type = isset($field["type"])?$field["type"]:"text";
                     switch ($type){
                         case "email":
                             if((!isset($field["required"]) || $field["required"]!=true) && trim($field["value"])==""){
                                 $values[$field["name"]] = $field["value"];
                             }
                             else{
                                 if($this->isEmail($field["value"])){
                                     $values[$field["name"]] = $field["value"];
                                 }
                                 else
                                     return array("code"=>406,"message"=>"Invalid ".$field["name"]);
                             }
                             break;
                         case "number":
                             $min = isset($field["minLength"])?$field["minLength"]:0;
                             $max = isset($field["maxLength"])?$field["maxLength"]:50;
                             if(isset($field["required"]) && $field["required"]==true && $min==0)
                                 $min=1;
                             $start_with_plus = isset($field["start_with_plus"])?$field["start_with_plus"]:false;
                             if($min>0 || $field["value"]!=""){
                                 if($this->isNumber($field["value"],$min,$max,$start_with_plus)){
                                     $values[$field["name"]] = $field["value"];
                                 }
                                 else
                                     return array("code"=>406,"message"=>"Invalid ".$field["name"]);
                             }
                             break;
                         default:
                             if(isset($field["required"]) && $field["required"]==true){
                                 if(trim($field["value"])=="")
                                     return array("code"=>406,"message"=>$field["name"]." can not be empty.");
                             }
                             if(isset($field["minLength"])){
                                 if(strlen($field["value"])<$field["minLength"])
                                     return array("code"=>406,"message"=>$field["name"]." should be at least ".$field["minLength"]." character long");
                             }
                             if(isset($field["maxLength"])){
                                 if(strlen($field["value"])>$field["maxLength"])
                                     return array("code"=>406,"message"=>$field["name"]." cannot have more than ".$field["maxLength"]." character");
                             }
                             $values[$field["name"]] = $field["value"];
                     }
                 }
                 else 
                     return array("code"=>400,"message"=>"Invalid data format");
                 
             }
             $flag= false;
             if($add_date==true)
                 $flag=true;
             return $this->updateData($tbl_name,$values,$condition);
         }
    }
    
    function leadersBoard($data_tbl = array() ,$score_table = array(), $limit = 7,$unique = true, $order = "DESC",$order2 = "created_date ASC"){
        $query = $this->myPdo->from($data_tbl["table"]);
        if(isset($data_tbl["condition"])){
            foreach($data_tbl["condition"] as $key=>$val){
                $query =$query->where($key, $val);
            }
        }
        $user_data=$query->fetchAll();
        $user_keys=array();
        foreach($user_data as $row){
 
            $user_keys[$row["uid"]] = $row;
        }
        $query1 = $this->myPdo->from($score_table["table"]);
        if(isset($score_table["condition"])){
            foreach($score_table["condition"] as $key=>$val){
                $query1 = $query1->where($key, $val);
            }
        }
        if($order!="ASC")
            $order="DESC";
        $query1 =$query1->orderBy($score_table["fields"][0]." ".$order);
        $query1 =$query1->orderBy($order2);
        $score_data=$query1->fetchAll();
        $output = array();
        $flag = array();
        $flag2 = array();
        $i=0;
        foreach($score_data as $data)
        {

            if(array_key_exists($data["uid"],$user_keys)){
                if((!array_key_exists($data["uid"],$flag)&&!array_key_exists($user_keys[$data["uid"]]["mobile"],$flag2)) || !$unique){
                    $a=array();
                    foreach($data_tbl["fields"] as $val){
                        $a[$val]=$user_keys[$data["uid"]][$val];
                    }
                    foreach($score_table["fields"] as $val){
                        $a[$val]=$data[$val];
                    }
              
                    $output[]=$a;
                    $flag[$data["uid"]]=$data["uid"];
                    $flag2[$user_keys[$data["uid"]]["mobile"]]=$user_keys[$data["uid"]]["mobile"];
                
                    $i++;
                    if($i>=$limit&&$limit!=7)
                        break;
                }
            }
        }
        return $output;
    }
    
    function getData($list = array(),$key = ""){
        if(is_array($list))
        {
            if(isset($list[$key]))
                return $list[$key];
        }
        return "";
    }
    
    function getToken($min = 8,$max = 8){
        $possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        if($min==$max)
            $l=$min;
        else
            $l= mt_rand($min,$max);
        $str = "";
        for($i=0; $i<$l;$i++){
            $k= mt_rand(0,(strlen($possible)-1));
            $str .= $possible[$k];
        }
        return $str;
    }

    function decryptData($uid, $data, $key){
        $output = [
            "code" => 400,//$uid, $data or $key is empty
            "data"=> []
        ];
        if($uid != "" && $data != "" && $key != ""){
            $output["code"] = 401;//invalid data
            $dataAr=explode(".",$data);
    
            if(count($dataAr) == 3){
                $output["code"] = 402;//head mismatch
    
                $hader=$dataAr[0];
                $pay=$dataAr[1];
                $sig=$dataAr[2];
    
    
                $my_sig = hash_hmac('sha256', $hader.".".$pay, $key);
                $hed=base64_decode($hader);
                $decode_pay=json_decode(base64_decode($dataAr[1]),true);
                if($decode_pay["t"]==$hed){
                    $output["code"] = 403;//signature mismatch
    
                    $r2 = $sig[0];
                    $r1 = $sig[1];
                    $x=substr($sig,2);
                    $a_sig = substr($x,0,$r1).substr($x,$r1+$r2);
                    $my_sig=base64_encode(hash_hmac('sha256', $hader.".".$pay, $key));
    
                    if($my_sig==$a_sig){
                        $output["code"] = 404; //uid mismatch
    
                        $array_str = base64_decode($pay);
                        $json = json_decode($array_str,true);
    
                        if($uid==$json["uniqID"]){
                            $output["code"] = 200;
                            $output["data"] = $json;
                        }
                    }
                }
            }
        }
        return $output;
    }
}
?>