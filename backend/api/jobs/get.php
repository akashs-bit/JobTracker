<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed"
    ]);

    exit;
}

$query = "
    SELECT
        id,
        title,
        company,
        location,
        job_type,
        experience,
        salary,
        work_mode,
        description,
        requirements,
        skills,
        created_at
    FROM jobs
    ORDER BY id DESC
";

$result = $conn->query($query);

if (!$result) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch jobs"
    ]);

    exit;
}

$jobs = [];

while ($row = $result->fetch_assoc()) {

    /*
    |--------------------------------------------------------------------------
    | Convert skills string into array
    |--------------------------------------------------------------------------
    */

    $skills = [];

    if (!empty($row["skills"])) {
        $skills = array_map(
            "trim",
            explode(",", $row["skills"])
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Salary
    |--------------------------------------------------------------------------
    |
    | Example:
    | ₹4L - ₹7L
    |
    | We extract maximum salary for frontend filtering.
    |
    */

    $salaryText = $row["salary"];

    $salaryNumbers = [];

    preg_match_all(
        '/\d+(?:\.\d+)?/',
        $salaryText,
        $matches
    );

    if (!empty($matches[0])) {
        foreach ($matches[0] as $number) {
            $salaryNumbers[] = (float) $number;
        }
    }

    $maxSalary = !empty($salaryNumbers)
        ? max($salaryNumbers)
        : 0;

    /*
    |--------------------------------------------------------------------------
    | Posted time
    |--------------------------------------------------------------------------
    */

    $createdTimestamp = strtotime($row["created_at"]);
    $currentTimestamp = time();

    $difference = $currentTimestamp - $createdTimestamp;

    $days = floor($difference / 86400);

    if ($days <= 0) {
        $posted = "Today";
    } elseif ($days === 1) {
        $posted = "1 day ago";
    } elseif ($days < 7) {
        $posted = $days . " days ago";
    } elseif ($days < 14) {
        $posted = "1 week ago";
    } else {
        $weeks = floor($days / 7);
        $posted = $weeks . " weeks ago";
    }

    /*
    |--------------------------------------------------------------------------
    | Company Logo
    |--------------------------------------------------------------------------
    */

    $companyWords = preg_split(
        '/\s+/',
        trim($row["company"])
    );

    $logo = "";

    foreach ($companyWords as $word) {
        if (!empty($word)) {
            $logo .= strtoupper(substr($word, 0, 1));
        }

        if (strlen($logo) >= 2) {
            break;
        }
    }

    if ($logo === "") {
        $logo = "CO";
    }

    /*
    |--------------------------------------------------------------------------
    | Final Job Object
    |--------------------------------------------------------------------------
    */

    $jobs[] = [
        "id" => (int) $row["id"],

        "title" => $row["title"],

        "company" => $row["company"],

        "location" => $row["location"],

        "type" => $row["job_type"],

        "experience" => $row["experience"],

        "salary" => $maxSalary,

        "salaryText" => $salaryText,

        "mode" => $row["work_mode"],

        "posted" => $posted,

        "skills" => $skills,

        "logo" => $logo,

        "description" => $row["description"],

        "requirements" => $row["requirements"],

        "created_at" => $row["created_at"]
    ];
}

echo json_encode([
    "success" => true,
    "count" => count($jobs),
    "jobs" => $jobs
]);

$conn->close();

?>