<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$title = trim($data["title"] ?? "");
$company = trim($data["company"] ?? "");
$location = trim($data["location"] ?? "");
$job_type = trim($data["job_type"] ?? "");
$experience = trim($data["experience"] ?? "");
$salary = trim($data["salary"] ?? "");
$work_mode = trim($data["work_mode"] ?? "");
$description = trim($data["description"] ?? "");
$requirements = trim($data["requirements"] ?? "");
$skills = trim($data["skills"] ?? "");

if (
    $title === "" ||
    $company === "" ||
    $location === "" ||
    $job_type === "" ||
    $experience === "" ||
    $salary === "" ||
    $work_mode === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Required fields are missing"
    ]);

    exit;
}

$query = "
    INSERT INTO jobs
    (
        title,
        company,
        location,
        job_type,
        experience,
        salary,
        work_mode,
        description,
        requirements,
        skills
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare database query"
    ]);

    exit;
}

$stmt->bind_param(
    "ssssssssss",
    $title,
    $company,
    $location,
    $job_type,
    $experience,
    $salary,
    $work_mode,
    $description,
    $requirements,
    $skills
);

if ($stmt->execute()) {

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Job created successfully",
        "job" => [
            "id" => $stmt->insert_id,
            "title" => $title,
            "company" => $company,
            "location" => $location,
            "job_type" => $job_type,
            "experience" => $experience,
            "salary" => $salary,
            "work_mode" => $work_mode,
            "description" => $description,
            "requirements" => $requirements,
            "skills" => $skills
        ]
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create job"
    ]);
}

$stmt->close();
$conn->close();

?>