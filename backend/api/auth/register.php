<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle browser preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only POST allowed
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

// Database connection
require_once "../../config/database.php";

// Check database connection
if (!isset($conn)) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection not found."
    ]);

    exit;
}

if ($conn->connect_error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);

    exit;
}

$conn->set_charset("utf8mb4");

// Get JSON data from React
$data = json_decode(
    file_get_contents("php://input"),
    true
);

// Check JSON
if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid request data."
    ]);

    exit;
}

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

// Validate fields
if ($name === "" || $email === "" || $password === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);

    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address"
    ]);

    exit;
}

// Password length
if (strlen($password) < 6) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 6 characters"
    ]);

    exit;
}

// Check if email already exists
$checkQuery = "SELECT id FROM users WHERE email = ?";

$stmt = $conn->prepare($checkQuery);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database query preparation failed."
    ]);

    $conn->close();
    exit;
}

$stmt->bind_param("s", $email);

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database query execution failed."
    ]);

    $stmt->close();
    $conn->close();
    exit;
}

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Email already registered"
    ]);

    $stmt->close();
    $conn->close();

    exit;
}

$stmt->close();

// Hash password
$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);

// Insert user
$insertQuery = "
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
";

$stmt = $conn->prepare($insertQuery);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Registration query preparation failed."
    ]);

    $conn->close();
    exit;
}

$stmt->bind_param(
    "sss",
    $name,
    $email,
    $hashedPassword
);

if ($stmt->execute()) {

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "user" => [
            "id" => (int) $stmt->insert_id,
            "name" => $name,
            "email" => $email
        ]
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Registration failed"
    ]);
}

$stmt->close();
$conn->close();

?>