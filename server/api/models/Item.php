<?php
class Item{
    private $conn;
    private $table = 'items';

    public $itemId;
    public $name;
    public $category;
    public $description;
    public $price;
    public $imageName;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = 'SELECT * FROM ' .$this->table.' ;';

        $statement = $this->conn->prepare($query);

        $statement->execute();

        return $statement;
    }

    public function readOne($ID) {
        $query = 'SELECT * FROM ' .$this->table. ' WHERE ItemID = ' .$ID. ';';

        $statement = $this->conn->prepare($query);

        $statement->execute();

        return $statement;
    }

    public function search($type, $value) {
        if ($type == "keyword") {
            $query = 'SELECT * FROM ' .$this->table. ' WHERE Name LIKE "%' .$value. '%" OR Description LIKE "%' .$value. '%"';
        } else if ($type == "itemid") {
            $query = 'SELECT * FROM ' .$this->table. ' WHERE ItemID = ' .$value;
        } else if ($type == "category") {
            $query = 'SELECT * FROM ' .$this->table. ' WHERE Category LIKE "%' .$value. '%"';
        } 
        

        $statement = $this->conn->prepare($query);

        $statement->execute();

        return $statement;
    }

    public function newItem() {
        $query = 'INSERT INTO ' .$this->table.' 
        SET
            Name = :name,
            Description = :description,
            Price = :price,
            Category = :category,
            Color = :color,
            Capacity = :capacity,
            ImageName = :imageName';

        $statement = $this->conn->prepare($query);
        
        $name = htmlspecialchars(strip_tags($this->name));
        $description = htmlspecialchars(strip_tags($this->description));
        $price = htmlspecialchars(strip_tags($this->price));
        $category = htmlspecialchars(strip_tags($this->category));
        $color = "white";
        $capacity = 1;
        $imageName = htmlspecialchars(strip_tags($this->imageName));

        $statement->bindParam(':name', $name);
        $statement->bindParam(':description', $description);
        $statement->bindParam(':price', $price);
        $statement->bindParam(':category', $category);
        $statement->bindParam(':color', $color);
        $statement->bindParam(':capacity', $capacity);
        $statement->bindParam(':imageName', $imageName);

        if ($statement->execute()) {
            //$this->id = $this->conn->lastInsertId();
            return true;
        }

        printf("Error: %s.\n",$statement->error);
        return false;        
    }

    function delete(){
  
        $query = "SELECT ImageName FROM " . $this->table . " WHERE ItemID = ?";
        // delete query
        
      
        // prepare query
        $stmt = $this->conn->prepare($query);
      
        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
      
        // bind id of record to delete
        $stmt->bindParam(1, $this->id);
      
        // execute query
        if($stmt->execute()){
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (unlink("../../images/" .$row['ImageName'])) {
                $query = "DELETE FROM " . $this->table . " WHERE ItemID = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(1, $this->id);

                if($stmt->execute()) {
                    return true;
                }

            } else {
                http_response_code(404);
                echo json_encode(
                    array('message' => 'No item found')
                );
                return false;
            }
        }
        
        return false;
    }

    function update() {
  
        // update query
        $query = "UPDATE " . $this->table . "
                SET name = :name, category = :category, price= :price, description= :description
                WHERE itemID = :itemid";
      
        // prepare query statement
        $stmt = $this->conn->prepare($query);
      
        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->category=htmlspecialchars(strip_tags($this->category));
        $this->itemid=htmlspecialchars(strip_tags($this->itemId));
        $this->price=htmlspecialchars(strip_tags($this->price));
        $this->description=htmlspecialchars(strip_tags($this->description));
      
        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':itemid', $this->itemid);
      
        // execute the query
        if($stmt->execute()){
            return true;
        }
      
        return false;
    }
}
?>