<?php
class Cart{
    private $conn;
    private $table = 'cart';

    public $id;
    public $name;
    public $category;
    public $description;
    public $price;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function newCart() {
        return;
    }

    public function add($item) {
        $query = 'SELECT * FROM ' .$this->table.' ;';

        $statement = $this->conn->prepare($query);

        $statement->execute();

        return $statement;
    }
}
?>