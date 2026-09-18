<?php

header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

require_once "../../config/database.php";

try {

    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = isset($data["user_id"])
        ? (int)$data["user_id"]
        : 0;

    $role = isset($data["role"])
        ? trim($data["role"])
        : "";

    if ($user_id <= 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid user ID"
        ]);

        exit;
    }

    if (!in_array($role, ["user", "admin"], true)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid role"
        ]);

        exit;
    }

    // Check user exists
    $check = $conn->prepare(
        "SELECT id, name, email, role FROM users WHERE id = ?"
    );

    $check->bind_param("i", $user_id);
    $check->execute();

    $result = $check->get_result();

    if ($result->num_rows === 0) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }

    // Update role
    $stmt = $conn->prepare(
        "UPDATE users SET role = ? WHERE id = ?"
    );

    $stmt->bind_param("si", $role, $user_id);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode([
        "success" => true,
        "message" => "User role updated successfully",
        "userId" => $user_id,
        "role" => $role
    ]);

    $stmt->close();
    $check->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update user role",
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>