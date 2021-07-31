<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, X-Requested-With, Access-Control-Allow-Methods, Origin, Content-Type, X-Auth-Token");

include_once('../config/Database.php');
include_once('../models/User.php');

$database = new Database();
$db = $database->connect();

$user = new User($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['type'])) {
        if (!isset($_GET['id'])) {
            $result = $user->read();
        } else {
            $result = $user->readOne($_GET['id']);
        }
    } else {
        $result = $user->search($_GET['type'], $_GET['value']);
    }

    if($result->rowCount() > 0) {
        $users = array();
    
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
    
            $item_arr = array(
                'id'            => $id,
                'name'          => $name,
                'email'      => $email,
                'role'         => $role,
                'created_at'      => $created_at
            );
    
            array_push($users, $item_arr);
        }
    
        http_response_code(200);
    
        echo json_encode($users);
    } else {
        http_response_code(400);
        echo json_encode(
            array('message' => 'No user found')
        );
    }
}