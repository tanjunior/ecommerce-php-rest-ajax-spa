<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, X-Requested-With, Access-Control-Allow-Methods, Origin, Content-Type, X-Auth-Token");

include_once('../config/Database.php');
include_once('../models/User.php');

$database = new Database();
$db = $database->connect();

$user = new User($db);

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"));
    if (empty($data->id) || empty($data->current) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }

    $user->userid = (int)$data->id;

    if($user->changePassword($data->current, $data->password)) {
  
        // set response code - 200 ok
        http_response_code(200);
      
        // tell the user
        echo json_encode(array("message" => "Password changed."));
    }
      
    // if unable to update the product, tell the user
    else{
      
        // set response code - 503 service unavailable
        http_response_code(503);
      
        // tell the user
        echo json_encode(array("message" => "Unable to change password."));
    }
}