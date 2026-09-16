<?php

$host = "127.0.0.1";
$dbname = "jobtracker";
$username = "root";
$password = "Akash@05";

$conn = new mysqli(
    $host,
    $username,
    $password,
    $dbname,
    3306
);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

?>