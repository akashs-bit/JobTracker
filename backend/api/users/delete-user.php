<?php

header("Access-Control-Allow-Origin: *");
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

    // Validate user ID
    if ($user_id <= 0) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid user ID"
        ]);

        exit;
    }

    // Find user
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

    $user = $result->fetch_assoc();

    // Never delete admin
    if ($user["role"] === "admin") {

        http_response_code(403);

        echo json_encode([
            "success" => false,
            "message" => "Admin users cannot be deleted"
        ]);

        exit;
    }

    // Start transaction
    $conn->begin_transaction();

    try {

        // Delete user's applications first
        $deleteApplications = $conn->prepare(
            "DELETE FROM applications WHERE user_id = ?"
        );

        $deleteApplications->bind_param("i", $user_id);
        $deleteApplications->execute();

        $deleteApplications->close();

        // Delete user
        $deleteUser = $conn->prepare(
            "DELETE FROM users WHERE id = ?"
        );

        $deleteUser->bind_param("i", $user_id);

        if (!$deleteUser->execute()) {
            throw new Exception($deleteUser->error);
        }

        $deleteUser->close();

        // Commit
        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "User deleted successfully",
            "userId" => $user_id
        ]);

    } catch (Exception $e) {

        // Rollback if anything fails
        $conn->rollback();

        throw $e;
    }

    $check->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete user",
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>