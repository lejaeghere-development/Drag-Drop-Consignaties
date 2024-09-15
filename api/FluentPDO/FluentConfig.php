<?php
include "FluentPDO.php";
try
{
    
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=", "", "", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",PDO::ATTR_PERSISTENT => true));

    $fpdo = new FluentPDO($pdo);
}
catch(PDOException $e)
{
    echo $e->getMessage();
}
?>