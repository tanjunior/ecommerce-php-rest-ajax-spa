<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, X-Requested-With, Access-Control-Allow-Methods, Origin, Content-Type, X-Auth-Token");

include_once('../config/Database.php');
include_once('../models/Item.php');

$database = new Database();
$db = $database->connect();

$item = new Item($db);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['type']) && !isset($_GET['value'])) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }

    $result = $item->search($_GET['type'], $_GET['value']);
    if($result->rowCount() > 0) {
        $items = array();
    
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
    
            $item_arr = array(
                'itemid'        => $ItemID,
                'name'          => $Name,
                'capacity'      => $Capacity,
                'color'         => $Color,
                'category'      => $Category,
                'description'   => $Description,
                'price'         => $Price,
                'imagename'     => $ImageName
            );
    
            array_push($items, $item_arr);
        }
    
        http_response_code(200);
    
        echo json_encode($items);
    } else {
        http_response_code(404);
        echo json_encode(
            array('message' => 'No item found')
        );
    }
}