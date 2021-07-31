<?php
class Database {

    private $host       = 'localhost';
    private $username   = 'X34309148';
    private $password   = 'X34309148';
    private $db_name    = 'X34309148';
    private $conn;


    public function __construct() {
        $this->conn = null;
    }
    
    public function connect() {
        try {
            $this->conn = new PDO('mysql:host=' .$this->host. ';dbname=' .$this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   
            return $this->conn;
        } catch (PDOException $e) {
            echo 'Connection Error: ' .$e->getMessage();
        }
    }

}
?>