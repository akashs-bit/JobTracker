<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        throw new Exception("Invalid JSON request.");
    }

    $id = isset($input["id"]) ? (int)$input["id"] : 0;

    if ($id <= 0) {
        throw new Exception("Interview ID is required.");
    }

    $stmt = $conn->prepare(
        "DELETE FROM interviews WHERE id = ?"
    );

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        throw new Exception(
            "Failed to delete interview."
        );
    }

    if ($stmt->affected_rows === 0) {
        throw new Exception("Interview not found.");
    }

    echo json_encode([
        "success" => true,
        "message" => "Interview deleted successfully."
    ]);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
