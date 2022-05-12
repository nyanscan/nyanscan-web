<?php

class DBAdapter
{
    public static $db_adapter_instance;

    // use static to escape multi connexion for one request
    private $pdo = null;

    public function __construct()
    {
        DBAdapter::$db_adapter_instance = $this;
        try {
            $this->pdo = new PDO(DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT, DB_USER, DB_PASSWORD);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            die("SQL Exception" . $e->getMessage());
        }
    }

    public function get_pdo(): PDO
    {
        return $this->pdo;
    }

    public function select($table, $collum, $where, $one = false)
    {
        if (count($where) > 0) {
            $condition = array_map(function ($k) {
                return $k . '=:' . $k;
            }, array_keys($where));
            $statement = "SELECT " . join(', ', $collum) . ' FROM ' . DB_PREFIX.$table . ' WHERE ' . join(' AND ', $condition);
            if ($one) $statement .= ' LIMIT 1';
            $req =$this->pdo->prepare($statement);
            $req->execute($where);

        } else {
            $statement = "SELECT " . join(', ', $collum) . ' FROM ' . DB_PREFIX.$table;
            if ($one) $statement .= ' LIMIT 1';
            $req = $this->pdo->prepare($statement);
            $req->execute();
        }
        if ($one) return $req->fetch(PDO::FETCH_ASSOC);
        else return $req->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insert($table, $data): bool
    {
        //Get a list of column names to use in the SQL statement.
        $columnNames = array_keys($data);
        //Contain SQL snippets.
        $rowsSQL = array_map(function ($k) {
            return ':' . $k;
        }, $columnNames);
        //Construct our SQL statement
        $sql = "INSERT INTO ".DB_PREFIX.$table." (" . implode(", ", $columnNames) . ") VALUES " . implode(", ", $rowsSQL);
        //Prepare our PDO statement.
        $pdoStatement = $this->pdo->prepare($sql);
        return $pdoStatement->execute($data);
    }

    public function update($table, $data, $where): bool
    {
        if (count($where) > 0) {
            $condition = array_map(function ($k) {
                return $k . '=:' . $k;
            }, array_keys($where));
            $rowsSQL = array_map(function ($k) {
                return $k . ' = :' . $k;
            }, array_keys($data));
            $statement = "UPDATE " . DB_PREFIX.$table . " SET " . join(', ', $rowsSQL) . ' WHERE ' . join(', ', $condition);
            print_r(array_merge($data, $where));
            $req =$this->pdo->prepare($statement);
            return $req->execute(array_merge($data, $where));
        }
        return false;
    }

    public function multi_insert($table, $data): bool
    {
        //Will contain SQL snippets.
        $rowsSQL = [];

        //Will contain the values that we need to bind.
        $toBind = [];

        //Get a list of column names to use in the SQL statement.
        $columnNames = array_keys($data[0]);

        //Loop through our $data array.
        foreach ($data as $arrayIndex => $row) {
            $params = array();
            foreach ($row as $columnName => $columnValue) {
                $param = ":" . $columnName . $arrayIndex;
                $params[] = $param;
                $toBind[$param] = $columnValue;
            }
            $rowsSQL[] = "(" . implode(", ", $params) . ")";
        }

        //Construct our SQL statement
        $sql = "INSERT INTO ".DB_PREFIX."$table (" . implode(", ", $columnNames) . ") VALUES " . implode(", ", $rowsSQL);

        //Prepare our PDO statement.
        $pdoStatement = $this->pdo->prepare($sql);

        //Bind our values.
        foreach ($toBind as $param => $val) {
            $pdoStatement->bindValue($param, $val);
        }

        //Execute our statement (i.e. insert the data).
        return $pdoStatement->execute();
    }


}