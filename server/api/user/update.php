<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once('../config/Database.php');
include_once('../models/User.php');

$database = new Database();
$db = $database->connect();

$user = new User($db);

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"));
    if (empty($data->id) || empty($data->name) || empty($data->email)) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }

    $user->id = (int)$data->id;
    $user->name = $data->name;
    $user->email = $data->email;

    if($user->update()) {
  
        // set response code - 200 ok
        http_response_code(200);
      
        // tell the user
        echo json_encode(array("message" => "User was updated."));
    }
      
    // if unable to update the product, tell the user
    else{
      
        // set response code - 503 service unavailable
        http_response_code(503);
      
        // tell the user
        echo json_encode(array("message" => "Unable to update user."));
    }
}

?>