<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once('../config/Database.php');
include_once('../models/item.php');

$database = new Database();
$db = $database->connect();

$items = new Item($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['value'])) {
        return false;
    } else {
        $result = $items->search("keyword", $_GET['value']);
    }

    if($result->rowCount() > 0) {
        $items_arr = array();
        $items_arr['data'] = array();
    
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
    
            $item = array(
                'id'            => $ItemID,
                'name'          => $Name,
                'capacity'      => $Capacity,
                'color'         => $Color,
                'category'      => $Category,
                'description'   => $Description,
                'price'         => $Price,
                'imagename'     => $ImageName
            );
    
            array_push($items_arr['data'], $item);
        }
    
        http_response_code(200);
    
        echo json_encode($items_arr);
    } else {
        http_response_code(404);
        echo json_encode(
            array('message' => 'No matches found')
        );
    }
}
?>