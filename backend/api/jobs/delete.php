<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

try {

    $input = json_decode(file_get_contents("php://input"), true);

    $id = intval($input["id"] ?? 0);

    if ($id <= 0) {
        throw new Exception("Invalid job ID");
    }

    $check = $conn->prepare(
        "SELECT id FROM jobs WHERE id = ? LIMIT 1"
    );

    $check->bind_param("i", $id);
    $check->execute();

    $result = $check->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Job not found");
    }

    $stmt = $conn->prepare(
        "DELETE FROM jobs WHERE id = ?"
    );

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        throw new Exception("Failed to delete job");
    }

    echo json_encode([
        "success" => true,
        "message" => "Job deleted successfully"
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}