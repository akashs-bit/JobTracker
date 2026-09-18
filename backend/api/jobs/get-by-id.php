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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed"
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| GET JOB ID
|--------------------------------------------------------------------------
*/

$id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

if ($id <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Valid job ID is required"
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| FETCH JOB
|--------------------------------------------------------------------------
*/

$stmt = $conn->prepare("
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
    WHERE id = ?
    LIMIT 1
");

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare database query"
    ]);

    exit;
}

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Job not found"
    ]);

    $stmt->close();
    $conn->close();

    exit;
}

$row = $result->fetch_assoc();

/*
|--------------------------------------------------------------------------
| SKILLS
|--------------------------------------------------------------------------
*/

$skills = [];

if (!empty($row["skills"])) {
    $skills = array_values(
        array_filter(
            array_map("trim", explode(",", $row["skills"]))
        )
    );
}

/*
|--------------------------------------------------------------------------
| EXACT SALARY
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Keep the exact salary text entered by admin.
|
| Example:
| "4L - 5L"
| "₹3 LPA - ₹5 LPA"
|
| Do NOT convert it into a number.
|--------------------------------------------------------------------------
*/

$salaryText = trim((string) $row["salary"]);

/*
|--------------------------------------------------------------------------
| OPTIONAL NUMERIC SALARY VALUE
|--------------------------------------------------------------------------
|
| This can be used later for filtering/sorting.
| It does NOT replace the original salary text.
|--------------------------------------------------------------------------
*/

$maxSalary = 0;

preg_match_all(
    '/(\d+(?:\.\d+)?)\s*([KkLl])?/i',
    $salaryText,
    $matches,
    PREG_SET_ORDER
);

if (!empty($matches)) {

    foreach ($matches as $match) {

        $number = (float) $match[1];

        $unit = isset($match[2])
            ? strtolower($match[2])
            : "";

        if ($unit === "k") {
            $number = $number / 100;
        }

        if ($number > $maxSalary) {
            $maxSalary = $number;
        }
    }
}

/*
|--------------------------------------------------------------------------
| POSTED TIME
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
| COMPANY LOGO INITIALS
|--------------------------------------------------------------------------
*/

$companyWords = preg_split(
    '/\s+/',
    trim($row["company"])
);

$logo = "";

foreach ($companyWords as $word) {

    if (!empty($word)) {

        $logo .= strtoupper(
            substr($word, 0, 1)
        );
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
| RESPONSE
|--------------------------------------------------------------------------
*/

$job = [

    "id" => (int) $row["id"],

    "title" => $row["title"],

    "company" => $row["company"],

    "location" => $row["location"],

    "type" => $row["job_type"],

    "experience" => $row["experience"],

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    | Exact salary entered by admin.
    |--------------------------------------------------------------------------
    */

    "salary" => $salaryText,

    /*
    |--------------------------------------------------------------------------
    | Numeric value for future filtering/sorting
    |--------------------------------------------------------------------------
    */

    "salaryValue" => $maxSalary,

    "salaryText" => $salaryText,

    "mode" => $row["work_mode"],

    "posted" => $posted,

    "skills" => $skills,

    "logo" => $logo,

    "description" => $row["description"],

    "requirements" => $row["requirements"],

    "created_at" => $row["created_at"]
];

echo json_encode([
    "success" => true,
    "job" => $job
]);

$stmt->close();
$conn->close();

?>