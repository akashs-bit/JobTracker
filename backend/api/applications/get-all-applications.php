<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

try {
    if (!isset($conn) || !$conn) {
        throw new Exception("Database connection failed.");
    }

    $sql = "
        SELECT
            a.id,
            a.user_id,
            a.job_id,
            a.full_name,
            a.email,
            a.phone,
            a.resume,
            a.cover_letter,
            a.status,
            a.applied_at,

            j.title AS job_title,
            j.company,
            j.location,
            j.job_type,
            j.experience,
            j.salary,
            j.work_mode

        FROM applications a
        LEFT JOIN jobs j ON a.job_id = j.id
        ORDER BY a.applied_at DESC, a.id DESC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception($conn->error);
    }

    $applications = [];

    while ($row = $result->fetch_assoc()) {
        $applications[] = [
            "id" => (int) $row["id"],
            "userId" => (int) $row["user_id"],
            "jobId" => (int) $row["job_id"],

            "fullName" => $row["full_name"],
            "email" => $row["email"],
            "phone" => $row["phone"],

            "resume" => $row["resume"],
            "coverLetter" => $row["cover_letter"],
            "status" => $row["status"],
            "appliedAt" => $row["applied_at"],

            "jobTitle" => $row["job_title"],
            "company" => $row["company"],
            "location" => $row["location"],
            "jobType" => $row["job_type"],
            "experience" => $row["experience"],
            "salary" => $row["salary"],
            "workMode" => $row["work_mode"],

            "logo" => strtoupper(
                substr(
                    preg_replace("/[^A-Za-z]/", "", $row["company"] ?? "JB"),
                    0,
                    2
                )
            )
        ];
    }

    echo json_encode([
        "success" => true,
        "count" => count($applications),
        "applications" => $applications
    ]);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "applications" => []
    ]);
}
?>
