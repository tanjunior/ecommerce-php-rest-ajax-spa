<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, X-Requested-With, Access-Control-Allow-Methods, Origin, Content-Type, X-Auth-Token");

include_once('../config/Database.php');
include_once('../models/Order.php');
include_once('../models/Item.php');

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


    $price = 0;
    foreach($data['cart'] as $key => $value) {
        $item = new Item($db);
        $itemResult = $item->readOne($key);

        if($itemResult->rowCount() > 0) {
        
            $row = $itemResult->fetch(PDO::FETCH_ASSOC);

            $itemPrice = $row["Price"];
            $price+= $itemPrice * $value;
            
        } else {
            http_response_code(404);
            echo json_encode(
                array('message' => 'Error calculating total')
            );
        }

    }

    $order->price = $price;

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
        $result = $order->readOne($_GET['id']);
    } else {
        $result = $order->search($_GET['type'], $_GET['value']);
    }
        if($result->rowCount() > 0) {
            $orders = array();
        
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
        
                array_push($orders, $orders_arr);
            }
        
            http_response_code(200);
        
            echo json_encode($orders);
        } else {
            http_response_code(400);
            echo json_encode(
                array('message' => 'No order found')
            );
        }
    
} else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"));
    if (empty($data->orderid) || empty($data->status)) {
        http_response_code(400);
        echo json_encode(
            array(
                'message' => 'No data found'
            )
        );
        die();
    }

    $order->orderid = $data->orderid;
    $order->status = $data->status;

    if($order->update()) {
  
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