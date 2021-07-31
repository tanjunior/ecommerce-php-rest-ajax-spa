<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, X-Requested-With, Access-Control-Allow-Methods, Origin, Content-Type, X-Auth-Token");

include_once('../config/Database.php');
include_once('../models/User.php');

$database = new Database();
$db = $database->connect();

$user = new User($db);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(stripslashes(file_get_contents('php://input')), true);

    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }   
    
    $user->email = $data['email'];
    $password = $data['password'];

    $result = $user->login();
    if ($result->rowCount() == 1) {
        if ($row = $result->fetch()) {
            if ($password == $row["password"]) {
                http_response_code(200);
                echo json_encode(
                    array(
                        'message' => $row['userid']
                    )
                );
            } else {
                http_response_code(422);
                echo json_encode(
                    array(
                        'message' => 'incorrect password'
                    )
                );
            
            }
        }
    }
} else {
    echo "not post";
}