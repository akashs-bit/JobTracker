<?php

header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

require_once "../../config/database.php";

try {

    $sql = "
        SELECT 
            id,
            name,
            email,
            role,
            created_at
        FROM users
        ORDER BY id DESC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception($conn->error);
    }

    $users = [];

    while ($row = $result->fetch_assoc()) {

        $users[] = [
            "id" => (int)$row["id"],
            "name" => $row["name"],
            "email" => $row["email"],
            "role" => $row["role"],
            "createdAt" => $row["created_at"]
        ];
    }

    echo json_encode([
        "success" => true,
        "count" => count($users),
        "users" => $users
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch users",
        "error" => $e->getMessage()
    ]);
}
?>