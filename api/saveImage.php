<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');
$obj = new Functions("usa");// Start with PHPMailer class
$decodeData= json_decode(base64_decode($_POST['data']));

$base64_image = $decodeData->base64_image;
$uid = $decodeData->uid;
// Example base64 encoded image data. Replace this with your actual base64 string.

// Extracting the mime type and the base64 image data
list($type, $data) = explode(';', $base64_image);
list(, $data)      = explode(',', $data);

// Decoding base64 image data
$image_data = base64_decode($data);

// Generating a unique filename for the image
$filename = $decodeData->imageName.'.png'; // You can use different extension based on your image type.

// Generating a unique folder name

// Path to save the folder
if($_SESSION["uid"]){
    $folderpath = 'Email/' . $_SESSION["uid"];
}else{
    $folderpath = 'Email/' . $uid;
}


// Creating the folder if it doesn't exist
if (!file_exists($folderpath)) {
    mkdir($folderpath, 0777, true); // Ensure to set proper permissions
}

// Path to save the image inside the folder
$filepath = $folderpath . '/' . $filename;

// Saving the decoded image data to the file
$res= file_put_contents($filepath, $image_data);
echo base64_encode(json_encode($res));

?>