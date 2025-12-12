<?php
header("Access-Control-Allow-Origin: " . "*");
require_once ('libs/functions.php');

$obj = new Functions("usa");
$decodeData= json_decode(base64_decode($_POST['data']));
try {
    foreach ($decodeData->customData as $bottle_key => $enabled) {
        $data = [
            'bottle_key' => $bottle_key,
            'enabled' => (int)$enabled
        ];

        // Perform UPSERT using FluentPDO's insertInto + onDuplicateKeyUpdate
        $obj->myPdo->insertInto('deliveryves_custom_crate')->values($data)
            ->onDuplicateKeyUpdate(['enabled' => (int)$enabled])
            ->execute();
    }

    echo base64_encode(json_encode(['success' => true, 'message' => 'Bottle data inserted/updated']));
} catch (PDOException $e) {
    echo base64_encode(json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]));
}
    ?>