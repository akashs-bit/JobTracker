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

if ($user_id <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "user_id is required"
    ]);

    exit;
}

try {

    $sql = "
        SELECT
            s.id AS saved_id,
            s.user_id,
            s.job_id,
            s.created_at AS saved_date,

            j.title,
            j.company,
            j.location,
            j.job_type,
            j.experience,
            j.salary,
            j.work_mode,
            j.description,
            j.requirements,
            j.skills,
            j.created_at

        FROM saved_jobs s

        INNER JOIN jobs j
            ON s.job_id = j.id

        WHERE s.user_id = ?

        ORDER BY s.created_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("i", $user_id);

    $stmt->execute();

    $result = $stmt->get_result();

    $savedJobs = [];

    while ($row = $result->fetch_assoc()) {

        $skills = [];

        if (!empty($row["skills"])) {
            $skills = array_values(
                array_filter(
                    array_map(
                        "trim",
                        explode(",", $row["skills"])
                    )
                )
            );
        }

        $savedJobs[] = [
            "savedId" => (int)$row["saved_id"],
            "userId" => (int)$row["user_id"],
            "jobId" => (int)$row["job_id"],

            "title" => $row["title"],
            "company" => $row["company"],
            "location" => $row["location"],

            "type" => $row["job_type"],
            "jobType" => $row["job_type"],

            "experience" => $row["experience"],
            "salary" => $row["salary"],

            "mode" => $row["work_mode"],
            "workMode" => $row["work_mode"],

            "description" => $row["description"],
            "requirements" => $row["requirements"],

            "skills" => $skills,

            "savedDate" => $row["saved_date"]
        ];
    }

    echo json_encode([
        "success" => true,
        "count" => count($savedJobs),
        "savedJobs" => $savedJobs
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>