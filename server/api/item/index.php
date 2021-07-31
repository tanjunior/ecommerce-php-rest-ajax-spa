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
    if (isset($_GET['id']) && $_GET['id'] != null) {
        $result = $item->readOne($_GET['id']);
    } else {
        $result = $item->read();    
    }

    if($result->rowCount() > 0) {
        $items = array();
    
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
    
            $item_arr = array(
                'id'            => $ItemID,
                'name'          => $Name,
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
} else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"));
    if (empty($data->itemid) || empty($data->name) || empty($data->category) || empty($data->price) || empty($data->description)) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }

    $item->itemId = $data->itemid;
    $item->name = $data->name;
    $item->category = $data->category;
    $item->price = $data->price;
    $item->description = $data->description;

    if($item->update()) {
  
        // set response code - 200 ok
        http_response_code(200);
      
        // tell the item
        echo json_encode(array("message" => "Item was updated."));
    }
      
    // if unable to update the product, tell the item
    else{
      
        // set response code - 503 service unavailable
        http_response_code(503);
      
        // tell the item
        echo json_encode(array("message" => "Unable to update Item."));
    }
}

