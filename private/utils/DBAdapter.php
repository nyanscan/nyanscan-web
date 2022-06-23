<?php

class DBAdapter {
    public static $db_adapter_instance;

    // using static property to escape multi connection for one request
    private ?PDO $pdo = null;

    public function __construct() {
        DBAdapter::$db_adapter_instance = $this;
        try {
            $this->pdo = new PDO(DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT, DB_USER, DB_PASSWORD);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            die("SQL Exception" . $e->getMessage());
        }
    }

    public function get_pdo(): PDO {
        return $this->pdo;
    }

    public function select($table, $column, $where, $limit = 0, $order=null, $offset=0, $force_multi=false) {
        $statement = "SELECT " . join(', ', $column) . ' FROM ' . DB_PREFIX.$table;
        return $this->select_set_settings($statement, $where, $limit, $order, $offset, false, $force_multi);
    }

    public function count($table, $col, $where=[]) {
        return $this->select_set_settings("SELECT COUNT(" . $col . ") AS amount FROM " . DB_PREFIX.$table, $where, 1)["amount"];
    }

    public function select_set_settings($statement, $where, $limit = 0, $order=null, $offset=0, $no_where=false, $force_multi=false) {
        $to_bind = [];
        if (count($where) > 0) {
            $condition = [];
            foreach ($where as $k => $v) {
                if (is_array($v)) {
                    $fv = $v['v'];
                    $fp = $v['o'];
                    $n_k = str_replace('.', '_', $k);
                    $to_bind[$n_k] = $fv;
                    $condition[] = $k . $fp .':' . $n_k;
                } else {
                    $n_k = str_replace('.', '_', $k);
                    $to_bind[$n_k] = $v;
                    $condition[] = $k . '=:' . $n_k;
                }
            }

            $statement .= $no_where ? ' AND ' : ' WHERE ';
            $statement .= join(' AND ', $condition);
        }

        if($order != null) {
            $statement .= " ORDER BY " . $order;
        }
        if ($limit > 0) {
            $statement .= ' LIMIT '.$limit;
            if ($offset > 0) {
                $statement .= ' OFFSET ' . $offset;
            }
        }
        $req = $this->pdo->prepare($statement);

        $req->execute($to_bind);

        if ($limit === 1 && !$force_multi) {
            return $req->fetch(PDO::FETCH_ASSOC);
        } else {
            return $req->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function delete($table, $where) : bool {
        if (count($where) === 0) {
            return false;
        }
        $to_bind = [];
        $condition = [];
        foreach ($where as $k => $v) {
            $n_k = str_replace('.', '_', $k);
            $to_bind[$n_k] = $v;
            $condition[] = $k . '=:' . $n_k;
        }
        $statement = "DELETE FROM " .DB_PREFIX.$table . " WHERE " . join(' AND ', $condition);
        $req = $this->pdo->prepare($statement);
        return $req->execute($to_bind);
    }

    public function insert($table, $data): bool {
        //Get a list of column names to use in the SQL statement.
        $columnNames = array_keys($data);
        //Contain SQL snippets.
        $rowsSQL = array_map(function ($k) {
            return ':' . $k;
        }, $columnNames);
        //Constructing SQL statement
        $sql = "INSERT INTO ".DB_PREFIX.$table." (" . implode(", ", $columnNames) . ") VALUES (" . implode(", ", $rowsSQL) . ')';
        //Preparing PDO statement.
        $pdoStatement = $this->pdo->prepare($sql);
        return $pdoStatement->execute($data);
    }

    public function update($table, $data, $where): bool {
        if (count($where) > 0) {
            $to_bind = [];
            $condition = [];
            foreach ($where as $k => $v) {
                $n_k = str_replace('.', '_', $k);
                $to_bind[$n_k] = $v;
                $condition[] = $k . '=:' . $n_k;
            }
            $rowsSQL = array_map(function ($k) {
                return $k . ' = :' . $k;
            }, array_keys($data));
            $statement = "UPDATE " . DB_PREFIX.$table . " SET " . join(', ', $rowsSQL) . ' WHERE ' . join(', ', $condition);
            $req =$this->pdo->prepare($statement);
            return $req->execute(array_merge($data, $to_bind));
        }
        return false;
    }

    public function multi_insert($table, $data): bool {
        //Will contain SQL snippets.
        $rowsSQL = [];

        //Will contain the values that we need to bind.
        $toBind = [];

        //Get a list of column names to use in the SQL statement.
        $columnNames = array_keys($data[0]);

        //Loop through the $data array.
        foreach ($data as $arrayIndex => $row) {
            $params = array();
            foreach ($row as $columnName => $columnValue) {
                $param = ":" . $columnName . $arrayIndex;
                $params[] = $param;
                $toBind[$param] = $columnValue;
            }
            $rowsSQL[] = "(" . implode(", ", $params) . ")";
        }

        //Constructing SQL statement
        $sql = "INSERT INTO ".DB_PREFIX."$table (" . implode(", ", $columnNames) . ") VALUES " . implode(", ", $rowsSQL);

        //Preparing PDO statement.
        $pdoStatement = $this->pdo->prepare($sql);

        //Binding values.
        foreach ($toBind as $param => $val) {
            $pdoStatement->bindValue($param, $val);
        }

        //Executing statement (i.e. insert the data).
        return $pdoStatement->execute();
    }
}