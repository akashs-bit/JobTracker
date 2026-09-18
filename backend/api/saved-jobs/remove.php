<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data["user_id"]) ? (int)$data["user_id"] : 0;
$job_id = isset($data["job_id"]) ? (int)$data["job_id"] : 0;

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
        "DELETE FROM saved_jobs
         WHERE user_id = ? AND job_id = ?"
    );

    $stmt->bind_param("ii", $user_id, $job_id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        echo json_encode([
            "success" => true,
            "message" => "Job was not saved",
            "removed" => false
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Job removed from saved jobs",
        "removed" => true
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>