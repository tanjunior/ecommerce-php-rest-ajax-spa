<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, X-Requested-With, Access-Control-Allow-Methods, Origin, Content-Type, X-Auth-Token");

include_once('../config/Database.php');
include_once('../models/cart.php');

$database = new Database();
$db = $database->connect();

$items = new Item($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id'])) {
        $result = $items->read();
    } else {
        $result = $items->readOne($_GET['id']);
    }

    if($result->rowCount() > 0) {
        $items_arr = array();
        $items_arr['data'] = array();
    
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
    
            $item = array(
                'id'            => $ItemID,
                'name'          => $Name,
                'capacity'      => $Capacity,
                'color'         => $Color,
                'category'      => $Category,
                'description'   => $Description,
                'price'         => $Price,
                'imagename'     => $ImageName
            );
    
            array_push($items_arr['data'], $item);
        }
    
        http_response_code(200);
    
        echo json_encode($items_arr);
    } else {
        http_response_code(404);
        echo json_encode(
            array('message' => 'No item found')
        );
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_GET['id'];
    $result = $items->readOne($_GET['id']);
}