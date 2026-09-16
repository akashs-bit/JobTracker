<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only GET method is allowed"
    ]);
    exit;
}

require_once "../../config/database.php";

try {
    $user_id = isset($_GET["user_id"])
        ? (int) $_GET["user_id"]
        : 0;

    if ($user_id <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid user ID."
        ]);
        exit;
    }

    /*
    |--------------------------------------------------------------------------
    | Get applications for this user
    |--------------------------------------------------------------------------
    | We join applications with jobs so the frontend gets the latest
    | job information directly from the jobs table.
    */

    $query = "
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

            j.title,
            j.company,
            j.location,
            j.job_type,
            j.experience,
            j.salary,
            j.work_mode,
            j.skills

        FROM applications a

        INNER JOIN jobs j
            ON a.job_id = j.id

        WHERE a.user_id = ?

        ORDER BY a.applied_at DESC
    ";

    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("Failed to prepare application query.");
    }

    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $result = $stmt->get_result();

    $applications = [];

    while ($row = $result->fetch_assoc()) {

        $company = $row["company"] ?? "Company";

        $logo = strtoupper(
            substr(
                preg_replace("/[^A-Za-z0-9]/", "", $company),
                0,
                2
            )
        );

        if ($logo === "") {
            $logo = "JT";
        }

        $applications[] = [
            "id" => (int) $row["id"],
            "jobId" => (int) $row["job_id"],

            "jobTitle" => $row["title"],
            "company" => $company,
            "location" => $row["location"],

            "jobType" => $row["job_type"],
            "experience" => $row["experience"],
            "salary" => $row["salary"],
            "workMode" => $row["work_mode"],

            "skills" => !empty($row["skills"])
                ? array_values(
                    array_filter(
                        array_map(
                            "trim",
                            explode(",", $row["skills"])
                        )
                    )
                )
                : [],

            "fullName" => $row["full_name"],
            "email" => $row["email"],
            "phone" => $row["phone"],

            "resume" => $row["resume"],
            "coverLetter" => $row["cover_letter"],

            "status" => $row["status"],
            "appliedAt" => $row["applied_at"],

            "logo" => $logo
        ];
    }

    echo json_encode([
        "success" => true,
        "count" => count($applications),
        "applications" => $applications
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
