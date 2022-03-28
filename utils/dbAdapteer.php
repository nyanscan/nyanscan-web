<?php

require 'config.php';

function connectDB() {
    try {
        $pdo = new PDO(DB_DRIVER.":host=".DB_HOST.";port=".DB_PORT, DB_USER, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (Exception $e) {
        die("SQL Exception". $e->getMessage());
    }
}

function tryLogUser($pdo, $email, $password) {




}

