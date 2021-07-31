<?php
class User{
    private $conn;
    private $table = 'users';

    public $userid;
    public $name;
    public $email;
    public $password;
    public $role;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        $query = 'INSERT INTO ' .$this->table.' 
        SET
            name = :name,
            email = :email,
            password = :password,
            role = :role';

        $statement = $this->conn->prepare($query);
        $name = htmlspecialchars(strip_tags($this->name));
        $email = htmlspecialchars(strip_tags($this->email));
        $password = htmlspecialchars(strip_tags($this->password));

        $statement->bindParam(':name', $name);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':password', $password);

        if ($this->role !== null) {
            $role = htmlspecialchars(strip_tags($this->role));
            $statement->bindParam(':role', $role);
        } else {
            $role = 'member';
            $statement->bindParam(':role', $role);
        }
        

        if ($statement->execute()) {
            $this->userid = $this->conn->lastInsertId();
            return true;
        }

        printf("Error: %s.\n",$statement->error);
        return false;        
    }

    public function login() {
        $query = 'SELECT userid, email, password FROM ' .$this->table.' WHERE email = :email';
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':email', $this->email);

        $statement->execute();

        return $statement;     
    }

    public function read() {
        $query = 'SELECT * FROM ' .$this->table.' ;';

        $statement = $this->conn->prepare($query);

        $statement->execute();

        return $statement;
    }

    public function readOne($ID) {
        $query = 'SELECT * FROM ' .$this->table. ' WHERE userid = ' .$ID. ';';

        $statement = $this->conn->prepare($query);

        $statement->execute();

        return $statement;
    }

    function emailExists(){
 
        // query to check if email exists
        $query = "SELECT *
                FROM " . $this->table . "
                WHERE email = ?
                LIMIT 0,1";
     
        // prepare the query
        $stmt = $this->conn->prepare( $query );
     
        // sanitize
        $this->email=htmlspecialchars(strip_tags($this->email));
     
        // bind given email value
        $stmt->bindParam(1, $this->email);
     
        // execute the query
        $stmt->execute();
     
        // get number of rows
        $num = $stmt->rowCount();
     
        // if email exists, assign values to object properties for easy access and use for php sessions
        if($num>0){     
            // return true because email exists in the database
            return true;
        }
     
        // return false if email does not exist in the database
        return false;
    }

    function update() {
        if ($this->role == null) {
            // update query
            $query = "UPDATE " . $this->table . "
                    SET name = :name, email = :email
                    WHERE userid = :userid";
                    // prepare query statement
            $stmt = $this->conn->prepare($query);
        
            // sanitize
            $this->name=htmlspecialchars(strip_tags($this->name));
            $this->email=htmlspecialchars(strip_tags($this->email));
            $this->userid=htmlspecialchars(strip_tags($this->userid));
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':email', $this->email);
            $stmt->bindParam(':userid', $this->userid);
        } else {
            // update query
            $query = "UPDATE " . $this->table . "
                    SET name = :name, email = :email, role = :role
                    WHERE userid = :userid";
                    // prepare query statement
            $stmt = $this->conn->prepare($query);
        
            // sanitize
            $this->name=htmlspecialchars(strip_tags($this->name));
            $this->email=htmlspecialchars(strip_tags($this->email));
            $this->userid=htmlspecialchars(strip_tags($this->userid));
            $this->role=htmlspecialchars(strip_tags($this->role));
        
            // bind new values
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':email', $this->email);
            $stmt->bindParam(':userid', $this->userid);
            $stmt->bindParam(':role', $this->role);
        }
      
        
      
        // execute the query
        if($stmt->execute()){
            return true;
        }
      
        return false;
    }

    function changePassword($currentPassword, $newPassword) {
        
        $query = 'SELECT password FROM ' .$this->table.' WHERE userid = :userid LIMIT 0,1';
        $statement = $this->conn->prepare($query);
        $this->userid=htmlspecialchars(strip_tags($this->userid));
        $statement->bindParam(':userid', $this->userid);

        $statement->execute();
        $num = $statement->rowCount();
        if ($num > 0) {
            $row = $statement->fetch(PDO::FETCH_ASSOC);
            $password = $row["password"];
            if ($currentPassword == $password) {
                $this->password = $newPassword;
                // update query
                $query = "UPDATE " . $this->table . "
                        SET password = :password
                        WHERE userid = :userid";
                $statement = $this->conn->prepare($query);
                $statement->bindParam(':userid', $this->userid);
                $statement->bindParam(':password', $this->password);
      
                if ($statement->execute()) {
                    return true;
                } else {
                    return false;
                }
            } else {
                // set response code - 503 service unavailable
                http_response_code(503);
            
                // tell the user
                echo json_encode(array("message" => "password does not match."));
                return false;
            
            }

        }
    }

    function search($type, $value) {
        if ($type == "id") {
            $query = 'SELECT * FROM ' .$this->table. ' WHERE ' .$type. ' = ' .$value;
        } else {
            $query = 'SELECT * FROM ' .$this->table. ' WHERE ' .$type. ' LIKE "%' .$value. '%"';
        }

        $statement = $this->conn->prepare($query);
        $statement->execute();

        return $statement;
    }
}