<?php
class Order{
    private $conn;
    private $table = 'orders';

    public $orderid;
    public $userid;
    public $items;
    public $price;
    public $status;
    public $date;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function newOrder() {
        $query = 'INSERT INTO ' .$this->table.' 
        SET
            userid = :userid,
            items = :items,
            price = :price,
            status = :status';

        $statement = $this->conn->prepare($query);
        
        $userid = htmlspecialchars(strip_tags($this->userid));
        $items = json_encode($this->items);
        $price = htmlspecialchars(strip_tags($this->price));
        $status = "processing";

        $statement->bindParam(':userid', $userid);
        $statement->bindParam(':items', $items);
        $statement->bindParam(':price', $price);
        $statement->bindParam(':status', $status);

        if ($statement->execute()) {
            //$this->id = $this->conn->lastInsertId();
            return true;
        }

        printf("Error: %s.\n",$statement->error);
        return false;        
    }

    function search($type, $value) {
        $query = 'SELECT * FROM ' .$this->table. ' WHERE ' .$type. ' = ' .$value;

        $statement = $this->conn->prepare($query);
        $statement->execute();

        return $statement;
    }
}
?>