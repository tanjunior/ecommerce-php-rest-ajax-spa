<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once('../config/Database.php');
include_once('../models/item.php');

$database = new Database();
$db = $database->connect();

$item = new Item($db);

$data = json_decode(file_get_contents('php://input'));

    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    } 

    $item->id = $data->id;

    if ($item->delete()) {

        // set response code - 200 ok
        http_response_code(200);
      
        // tell the user
        echo json_encode(array("message" => "Item was deleted."));
    } else {
  
        // set response code - 503 service unavailable
        http_response_code(503);
      
        // tell the user
        echo json_encode(array("message" => "Unable to delete the item."));
    }

