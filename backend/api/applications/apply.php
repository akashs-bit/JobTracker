<?php

header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST method is allowed"
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Database connection
|--------------------------------------------------------------------------
*/

require_once "../../config/database.php";

/*
|--------------------------------------------------------------------------
| Check connection
|--------------------------------------------------------------------------
*/

if (!isset($conn)) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection variable \$conn was not found."
    ]);

    exit;
}

if ($conn->connect_error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);

    exit;
}

$conn->set_charset("utf8mb4");

try {

    /*
    |--------------------------------------------------------------------------
    | Get form data
    |--------------------------------------------------------------------------
    */

    $user_id = isset($_POST["user_id"])
        ? (int) $_POST["user_id"]
        : 0;

    $job_id = isset($_POST["job_id"])
        ? (int) $_POST["job_id"]
        : 0;

    $full_name = trim($_POST["full_name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $phone = trim($_POST["phone"] ?? "");
    $cover_letter = trim($_POST["cover_letter"] ?? "");

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if ($user_id <= 0) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid user ID. Please login again."
        ]);
        exit;
    }

    if ($job_id <= 0) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid job ID."
        ]);
        exit;
    }

    if ($full_name === "") {
        echo json_encode([
            "success" => false,
            "message" => "Full name is required."
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid email."
        ]);
        exit;
    }

    if ($phone === "") {
        echo json_encode([
            "success" => false,
            "message" => "Phone number is required."
        ]);
        exit;
    }

    /*
    |--------------------------------------------------------------------------
    | Check whether job exists
    |--------------------------------------------------------------------------
    */

    $jobQuery = "
        SELECT id, title, company
        FROM jobs
        WHERE id = ?
        LIMIT 1
    ";

    $jobStmt = $conn->prepare($jobQuery);

    if (!$jobStmt) {
        throw new Exception(
            "Job query failed: " . $conn->error
        );
    }

    $jobStmt->bind_param("i", $job_id);

    if (!$jobStmt->execute()) {
        throw new Exception(
            "Job query execution failed: " . $jobStmt->error
        );
    }

    $jobResult = $jobStmt->get_result();

    if ($jobResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Job not found. Job ID: " . $job_id
        ]);
        exit;
    }

    $job = $jobResult->fetch_assoc();

    /*
    |--------------------------------------------------------------------------
    | Check duplicate application
    |--------------------------------------------------------------------------
    */

    $checkQuery = "
        SELECT id
        FROM applications
        WHERE user_id = ?
        AND job_id = ?
        LIMIT 1
    ";

    $checkStmt = $conn->prepare($checkQuery);

    if (!$checkStmt) {
        throw new Exception(
            "Duplicate check failed: " . $conn->error
        );
    }

    $checkStmt->bind_param(
        "ii",
        $user_id,
        $job_id
    );

    if (!$checkStmt->execute()) {
        throw new Exception(
            "Duplicate check execution failed: " . $checkStmt->error
        );
    }

    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        echo json_encode([
            "success" => false,
            "message" => "You have already applied for this job."
        ]);
        exit;
    }

    /*
    |--------------------------------------------------------------------------
    | Resume upload
    |--------------------------------------------------------------------------
    */

    $resumePath = null;

    if (
        isset($_FILES["resume"]) &&
        $_FILES["resume"]["error"] !== UPLOAD_ERR_NO_FILE
    ) {

        if ($_FILES["resume"]["error"] !== UPLOAD_ERR_OK) {
            echo json_encode([
                "success" => false,
                "message" => "Resume upload failed."
            ]);
            exit;
        }

        /*
        |----------------------------------------------------------------------
        | Maximum 5 MB
        |----------------------------------------------------------------------
        */

        $maxSize = 5 * 1024 * 1024;

        if ($_FILES["resume"]["size"] > $maxSize) {
            echo json_encode([
                "success" => false,
                "message" => "Resume must be less than 5MB."
            ]);
            exit;
        }

        /*
        |----------------------------------------------------------------------
        | Allowed extensions
        |----------------------------------------------------------------------
        */

        $allowedExtensions = [
            "pdf",
            "doc",
            "docx"
        ];

        $fileName = $_FILES["resume"]["name"];
        $fileTmp = $_FILES["resume"]["tmp_name"];

        $extension = strtolower(
            pathinfo($fileName, PATHINFO_EXTENSION)
        );

        if (!in_array($extension, $allowedExtensions, true)) {
            echo json_encode([
                "success" => false,
                "message" => "Only PDF, DOC and DOCX files are allowed."
            ]);
            exit;
        }

        /*
        |----------------------------------------------------------------------
        | Upload directory
        |----------------------------------------------------------------------
        */

       $uploadDir = "../../uploads/resumes/";

        if (!is_dir($uploadDir)) {

            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception(
                    "Could not create resume upload folder."
                );
            }
        }

        /*
        |----------------------------------------------------------------------
        | Unique filename
        |----------------------------------------------------------------------
        */

        $newFileName =
            "resume_" .
            $user_id .
            "_" .
            $job_id .
            "_" .
            time() .
            "." .
            $extension;

        $destination = $uploadDir . $newFileName;

        if (!move_uploaded_file($fileTmp, $destination)) {
            throw new Exception(
                "Could not save resume file."
            );
        }

        $resumePath = "uploads/resumes/" . $newFileName;
    }

    /*
    |--------------------------------------------------------------------------
    | Insert application
    |--------------------------------------------------------------------------
    */

    $insertQuery = "
        INSERT INTO applications
        (
            user_id,
            job_id,
            full_name,
            email,
            phone,
            resume,
            cover_letter,
            status
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, 'Applied')
    ";

    $insertStmt = $conn->prepare($insertQuery);

    if (!$insertStmt) {
        throw new Exception(
            "Application INSERT prepare failed: " . $conn->error
        );
    }

    $insertStmt->bind_param(
        "iisssss",
        $user_id,
        $job_id,
        $full_name,
        $email,
        $phone,
        $resumePath,
        $cover_letter
    );

    if (!$insertStmt->execute()) {

        if ($insertStmt->errno === 1062) {
            echo json_encode([
                "success" => false,
                "message" => "You have already applied for this job."
            ]);
            exit;
        }

        throw new Exception(
            "Application INSERT failed: " . $insertStmt->error
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        "success" => true,
        "message" => "Application submitted successfully!",
        "application" => [
            "id" => $insertStmt->insert_id,
            "user_id" => $user_id,
            "job_id" => $job_id,
            "job_title" => $job["title"],
            "company" => $job["company"],
            "status" => "Applied"
        ]
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>