<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

$user_id = $_GET["user_id"] ?? null;

if (!$user_id || !is_numeric($user_id)) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required"
    ]);
    exit;
}

$sql = "
    SELECT
        i.id,
        i.application_id,
        i.interview_date,
        i.interview_time,
        i.duration,
        i.interview_type,
        i.mode,
        i.meeting_link,
        i.interviewer,
        i.location,
        i.notes,
        i.status,
        i.created_at,

        a.user_id,
        a.job_id,
        a.full_name,
        a.email,

        j.title AS job_title,
        j.company,
        j.location AS job_location,
        j.job_type,
        j.experience,
        j.salary

    FROM interviews i

    INNER JOIN applications a
        ON i.application_id = a.id

    INNER JOIN jobs j
        ON a.job_id = j.id

    WHERE a.user_id = ?

    ORDER BY
        i.interview_date ASC,
        i.interview_time ASC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Database query preparation failed"
    ]);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$interviews = [];

while ($row = $result->fetch_assoc()) {

    $interviews[] = [
        "id" => (int)$row["id"],
        "applicationId" => (int)$row["application_id"],
        "userId" => (int)$row["user_id"],
        "jobId" => (int)$row["job_id"],

        "candidateName" => $row["full_name"],
        "email" => $row["email"],

        "company" => $row["company"],
        "jobTitle" => $row["job_title"],
        "jobLocation" => $row["job_location"],
        "jobType" => $row["job_type"],
        "experience" => $row["experience"],
        "salary" => $row["salary"],

        "date" => $row["interview_date"],
        "time" => $row["interview_time"],
        "duration" => $row["duration"],

        "interviewType" => $row["interview_type"],
        "mode" => $row["mode"],
        "meetingLink" => $row["meeting_link"],
        "interviewer" => $row["interviewer"],
        "location" => $row["location"],
        "notes" => $row["notes"],

        "status" => $row["status"],
        "createdAt" => $row["created_at"]
    ];
}

echo json_encode([
    "success" => true,
    "count" => count($interviews),
    "interviews" => $interviews
]);

$stmt->close();
$conn->close();

?>