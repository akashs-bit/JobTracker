<?php

header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
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

    if (!$input) {
        throw new Exception("Invalid request data");
    }

    $id = intval($input["id"] ?? 0);

    if ($id <= 0) {
        throw new Exception("Invalid job ID");
    }

    $title = trim($input["title"] ?? "");
    $company = trim($input["company"] ?? "");
    $location = trim($input["location"] ?? "");
    $job_type = trim($input["job_type"] ?? "");
    $experience = trim($input["experience"] ?? "");
    $salary = trim($input["salary"] ?? "");
    $work_mode = trim($input["work_mode"] ?? "");
    $description = trim($input["description"] ?? "");
    $requirements = trim($input["requirements"] ?? "");
    $skills = trim($input["skills"] ?? "");

    if (
        $title === "" ||
        $company === "" ||
        $location === "" ||
        $job_type === "" ||
        $experience === "" ||
        $salary === "" ||
        $work_mode === ""
    ) {
        throw new Exception("Please fill all required fields");
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

    $stmt = $conn->prepare("
        UPDATE jobs
        SET
            title = ?,
            company = ?,
            location = ?,
            job_type = ?,
            experience = ?,
            salary = ?,
            work_mode = ?,
            description = ?,
            requirements = ?,
            skills = ?
        WHERE id = ?
    ");

    $stmt->bind_param(
        "ssssssssssi",
        $title,
        $company,
        $location,
        $job_type,
        $experience,
        $salary,
        $work_mode,
        $description,
        $requirements,
        $skills,
        $id
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update job");
    }

    echo json_encode([
        "success" => true,
        "message" => "Job updated successfully"
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}