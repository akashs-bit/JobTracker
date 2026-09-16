<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

$user_id = isset($_GET["user_id"])
    ? (int)$_GET["user_id"]
    : 0;

$job_id = isset($_GET["job_id"])
    ? (int)$_GET["job_id"]
    : 0;

if ($user_id <= 0 || $job_id <= 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "user_id and job_id are required"
    ]);

    exit;
}

try {

    $stmt = $conn->prepare(
        "SELECT id
         FROM saved_jobs
         WHERE user_id = ? AND job_id = ?"
    );

    $stmt->bind_param("ii", $user_id, $job_id);
    $stmt->execute();

    $result = $stmt->get_result();

    echo json_encode([
        "success" => true,
        "saved" => $result->num_rows > 0
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>