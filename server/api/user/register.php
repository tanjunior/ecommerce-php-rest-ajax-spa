<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, X-Requested-With, Access-Control-Allow-Methods");

include_once('../config/Database.php');
include_once('../models/User.php');

$database = new Database();
$db = $database->connect();

$user = new User($db);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $data = json_decode(stripslashes(file_get_contents('php://input')), true);

    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }   
    
    if (!empty($data['role'])) {
        $user->role = $data['role'];
    }
    $user->name = $data['name'];
    $user->email = $data['email'];
    $user->password = password_hash($data['password'], PASSWORD_DEFAULT); 

    if ($user->register()) {
        http_response_code(201);
        echo json_encode(
            array(
                'message' => $user->id
            )
        );
    } else {
        http_response_code(503);
        echo json_encode(
            array(
                'message' => 'New user error'
            )
        );
    
    }
} else {
    echo "not post";
}