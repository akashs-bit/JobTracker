<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://job-tracker-drab-mu.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        throw new Exception("Only POST method is allowed.");
    }

    if (!isset($conn) || !$conn) {
        throw new Exception("Database connection failed.");
    }

    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        throw new Exception("Invalid JSON request.");
    }

    $applicationId = isset($data["application_id"])
        ? (int) $data["application_id"]
        : (int) ($data["id"] ?? 0);

    $status = trim($data["status"] ?? "");

    $allowedStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected"
    ];

    if ($applicationId <= 0) {
        throw new Exception("Application ID is required.");
    }

    if (!in_array($status, $allowedStatuses, true)) {
        throw new Exception("Invalid application status.");
    }

    $check = $conn->prepare(
        "SELECT id FROM applications WHERE id = ? LIMIT 1"
    );

    if (!$check) {
        throw new Exception($conn->error);
    }

    $check->bind_param("i", $applicationId);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows === 0) {
        $check->close();
        http_response_code(404);
        throw new Exception("Application not found.");
    }

    $check->close();

    $stmt = $conn->prepare(
        "UPDATE applications SET status = ? WHERE id = ?"
    );

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("si", $status, $applicationId);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $stmt->close();

    echo json_encode([
        "success" => true,
        "message" => "Application status updated successfully.",
        "application_id" => $applicationId,
        "status" => $status
    ]);

} catch (Throwable $e) {
    if (http_response_code() < 400) {
        http_response_code(400);
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
