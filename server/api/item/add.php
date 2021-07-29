<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: multipart/form-data");

include_once('../config/Database.php');
include_once('../models/item.php');

$database = new Database();
$db = $database->connect();

$item = new Item($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_POST['name']) || !isset($_POST['category']) || !isset($_POST['description']) || !isset($_POST['price'])) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }   
    
    $item->name = $_POST['name'];
    $item->category = $_POST['category'];
    $item->description = $_POST['description'];
    $item->price = $_POST['price'];
    $item->imageName = $_FILES['image']['name'];


    $target_dir = "../../images/";
    $target_file = $target_dir . basename($_FILES["image"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    $check = getimagesize($_FILES["image"]["tmp_name"]);

    if($check == false) {
        http_response_code(406);
        echo json_encode(
            array(
                'message' => 'File is not an image.'
            )
        );
        die();
    }

    // Check if file already exists
    if (file_exists($target_file)) {
        http_response_code(406);
        echo json_encode(
            array(
                'message' => 'Sorry, file already exists.'
            )
        );
        die();
    }


    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        if ($item->newItem()) {
    
            http_response_code(201);
            echo json_encode(
                array(
                    'message' => 'ok'
                )
            );
        } else {
            http_response_code(503);
            echo json_encode(
                array(
                    'message' => 'New item error'
                )
            );
            die();
        }
    } else {
        http_response_code(406);
        echo json_encode(
            array(
                'message' => 'Sorry, there was an error uploading your file.'
            )
        );
        die();
    }

}

