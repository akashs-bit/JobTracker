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

$user_id = isset($_GET["user_id"])
    ? (int) $_GET["user_id"]
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

    $stmt = $conn->prepare("
        SELECT
            u.id,
            u.name,
            u.email,
            u.phone,
            COALESCE(p.location, '') AS location,
            COALESCE(p.headline, '') AS headline,
            COALESCE(p.github, '') AS github,
            COALESCE(p.linkedin, '') AS linkedin,
            COALESCE(p.skills, '') AS skills,
            COALESCE(p.about, '') AS about,
            COALESCE(p.photo, '') AS photo
        FROM users u
        LEFT JOIN profiles p
            ON p.user_id = u.id
        WHERE u.id = ?
        LIMIT 1
    ");

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("i", $user_id);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }

    $row = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "profile" => [
            "id" => (int) $row["id"],
            "name" => $row["name"],
            "email" => $row["email"],
            "phone" => $row["phone"],
            "location" => $row["location"],
            "headline" => $row["headline"],
            "github" => $row["github"],
            "linkedin" => $row["linkedin"],
            "skills" => $row["skills"],
            "about" => $row["about"],
            "photo" => $row["photo"]
        ]
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>