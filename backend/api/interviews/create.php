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

$data = json_decode(file_get_contents("php://input"), true);

$application_id  = $data["application_id"] ?? null;
$interview_date  = $data["interview_date"] ?? null;
$interview_time  = $data["interview_time"] ?? null;
$duration        = $data["duration"] ?? "45 min";
$interview_type  = $data["interview_type"] ?? null;
$mode            = $data["mode"] ?? "Video Call";
$meeting_link    = $data["meeting_link"] ?? null;
$interviewer     = $data["interviewer"] ?? null;
$location        = $data["location"] ?? null;
$notes           = $data["notes"] ?? null;
$status          = $data["status"] ?? "Upcoming";

if (!$application_id || !$interview_date || !$interview_time || !$interview_type) {
    echo json_encode([
        "success" => false,
        "message" => "Required fields are missing"
    ]);
    exit;
}

$check = $conn->prepare("
    SELECT id
    FROM applications
    WHERE id = ?
");

$check->bind_param("i", $application_id);
$check->execute();

$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Application not found"
    ]);
    exit;
}

$sql = "
    INSERT INTO interviews
    (
        application_id,
        interview_date,
        interview_time,
        duration,
        interview_type,
        mode,
        meeting_link,
        interviewer,
        location,
        notes,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "issssssssss",
    $application_id,
    $interview_date,
    $interview_time,
    $duration,
    $interview_type,
    $mode,
    $meeting_link,
    $interviewer,
    $location,
    $notes,
    $status
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Interview scheduled successfully",
        "interviewId" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to schedule interview"
    ]);
}
?>