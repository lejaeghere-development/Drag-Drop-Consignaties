<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
require_once ('libs/functions.php');
$obj = new Functions("usa");

// 1. Get metadata from POST (non-file fields)
$uid = $_POST['uid'] ?? null;
$imageName = $_POST['imageName'] ?? 'screenshot';

// 2. Handle the file from the $_FILES array
if (isset($_FILES['screenshot']) && $_FILES['screenshot']['error'] === UPLOAD_ERR_OK) {
    
    $fileTmpPath = $_FILES['screenshot']['tmp_name'];
    
    // Determine the folder path
    if (isset($_SESSION["uid"]) && $_SESSION["uid"]) {
        $folderpath = 'Email/' . $_SESSION["uid"];
    } else {
        $folderpath = 'Email/' . $uid;
    }

    // Creating the folder if it doesn't exist
    if (!file_exists($folderpath)) {
        mkdir($folderpath, 0777, true);
    }

    // Path to save the image
    $filename = $imageName . '.png';
    $filepath = $folderpath . '/' . $filename;

    // 3. Move the uploaded file from temp storage to your destination
    $res = move_uploaded_file($fileTmpPath, $filepath);
    
    // Return response
    echo base64_encode(json_encode($res));
} else {
    // Handle error if file wasn't sent
    echo base64_encode(json_encode(false));
}
?>