<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once('../config/Database.php');
include_once('../models/Order.php');

$database = new Database();
$db = $database->connect();

$order = new Order($db);


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(stripslashes(file_get_contents('php://input')), true);

    if (empty($data['user']) || empty($data['cart'])) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }     

    $order->userid = $data['user'];
    $order->items = $data['cart'];

    if ($order->newOrder()) {

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
    

} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['type'])) {
        http_response_code(400);
        echo json_encode(
            array('message' => 'Search type not specified')
        );
    } else {
        $result = $order->search($_GET['type'], $_GET['value']);

        if($result->rowCount() > 0) {
            $orders = array();
            $orders['data'] = array();
        
            while($row = $result->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
        
                $orders_arr = array(
                    'orderid'   => $orderid,
                    'userid'    => $userid,
                    'items'     => $items,
                    'price'     => $price,
                    'status'    => $status,
                    'date'      => $date
                );
        
                array_push($orders['data'], $orders_arr);
            }
        
            http_response_code(200);
        
            echo json_encode($orders);
        } else {
            http_response_code(400);
            echo json_encode(
                array('message' => 'No order found')
            );
        }
    }


}


