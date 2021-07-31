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

    public function readOne($ID) {
        $query = 'SELECT * FROM ' .$this->table. ' WHERE orderid = ' .$ID. ';';

        $statement = $this->conn->prepare($query);

        $statement->execute();

        return $statement;
    }

    function search($type, $value) {
        $query = 'SELECT * FROM ' .$this->table. ' WHERE ' .$type. ' = ' .$value;

        $statement = $this->conn->prepare($query);
        $statement->execute();

        return $statement;
    }

    function update() {
  
        // update query
        $query = "UPDATE " . $this->table . "
                SET status = :status
                WHERE orderid = :orderid";
      
        // prepare query statement
        $stmt = $this->conn->prepare($query);
      
        // sanitize
        $this->orderid=htmlspecialchars(strip_tags($this->orderid));
        $this->status=htmlspecialchars(strip_tags($this->status));

        // bind new values
        $stmt->bindParam(':orderid', $this->orderid);
        $stmt->bindParam(':status', $this->status);
      
        // execute the query
        if($stmt->execute()){
            return true;
        }
      
        return false;
    }
}
?>