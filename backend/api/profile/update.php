<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data["user_id"]) ? (int)$data["user_id"] : 0;

if ($user_id <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "user_id is required"
    ]);
    exit;
}

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$location = trim($data["location"] ?? "");
$headline = trim($data["headline"] ?? "");
$github = trim($data["github"] ?? "");
$linkedin = trim($data["linkedin"] ?? "");
$skills = trim($data["skills"] ?? "");
$about = trim($data["about"] ?? "");
$photo = $data["photo"] ?? "";

if ($name === "" || $email === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Name and email are required"
    ]);
    exit;
}

try {
    $conn->begin_transaction();

    // Keep the core account fields in users table.
    $userStmt = $conn->prepare("
        UPDATE users
        SET name = ?, email = ?, phone = ?
        WHERE id = ?
    ");
    $userStmt->bind_param("sssi", $name, $email, $phone, $user_id);
    $userStmt->execute();

    // Keep extended profile information in profiles table.
    $profileStmt = $conn->prepare("
        INSERT INTO profiles
            (user_id, location, headline, github, linkedin, skills, about, photo)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            location = VALUES(location),
            headline = VALUES(headline),
            github = VALUES(github),
            linkedin = VALUES(linkedin),
            skills = VALUES(skills),
            about = VALUES(about),
            photo = VALUES(photo)
    ");

    $profileStmt->bind_param(
        "isssssss",
        $user_id,
        $location,
        $headline,
        $github,
        $linkedin,
        $skills,
        $about,
        $photo
    );

    $profileStmt->execute();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully",
        "profile" => [
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "location" => $location,
            "headline" => $headline,
            "github" => $github,
            "linkedin" => $linkedin,
            "skills" => $skills,
            "about" => $about,
            "photo" => $photo
        ]
    ]);
} catch (Exception $e) {
    $conn->rollback();

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>