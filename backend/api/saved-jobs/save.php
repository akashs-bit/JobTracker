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

    // Check job exists
    $checkJob = $conn->prepare(
        "SELECT id FROM jobs WHERE id = ?"
    );

    $checkJob->bind_param("i", $job_id);
    $checkJob->execute();

    $jobResult = $checkJob->get_result();

    if ($jobResult->num_rows === 0) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Job not found"
        ]);

        exit;
    }

    // Check already saved
    $checkSaved = $conn->prepare(
        "SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?"
    );

    $checkSaved->bind_param("ii", $user_id, $job_id);
    $checkSaved->execute();

    $savedResult = $checkSaved->get_result();

    if ($savedResult->num_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Job already saved",
            "saved" => true
        ]);

        exit;
    }

    // Save job
    $stmt = $conn->prepare(
        "INSERT INTO saved_jobs (user_id, job_id)
         VALUES (?, ?)"
    );

    $stmt->bind_param("ii", $user_id, $job_id);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode([
        "success" => true,
        "message" => "Job saved successfully",
        "saved" => true,
        "savedId" => $stmt->insert_id
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>