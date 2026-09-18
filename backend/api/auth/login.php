<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only POST request
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

// Get JSON data
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

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

// Validate fields
if ($email === "" || $password === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Email and password are required."
    ]);

    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address."
    ]);

    exit;
}

// Find user
$query = "
    SELECT
        id,
        name,
        email,
        password,
        role
    FROM users
    WHERE email = ?
    LIMIT 1
";

$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database query preparation failed."
    ]);

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

// User not found
if ($result->num_rows === 0) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password."
    ]);

    $stmt->close();
    $conn->close();

    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user["password"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password."
    ]);

    $stmt->close();
    $conn->close();

    exit;
}

// Check role
$role = strtolower(trim($user["role"] ?? "user"));

if ($role !== "admin" && $role !== "user") {
    $role = "user";
}

// Login successful
http_response_code(200);

echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "user" => [
        "id" => (int) $user["id"],
        "name" => $user["name"],
        "email" => $user["email"],
        "role" => $role
    ]
]);

$stmt->close();
$conn->close();

?>