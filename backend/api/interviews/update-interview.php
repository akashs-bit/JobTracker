<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        throw new Exception("Invalid JSON request.");
    }

    $id = isset($input["id"]) ? (int)$input["id"] : 0;

    if ($id <= 0) {
        throw new Exception("Interview ID is required.");
    }

    $date = trim($input["interview_date"] ?? "");
    $time = trim($input["interview_time"] ?? "");
    $duration = trim($input["duration"] ?? "45 min");
    $type = trim($input["interview_type"] ?? "");
    $mode = trim($input["mode"] ?? "Video Call");
    $meetingLink = trim($input["meeting_link"] ?? "");
    $interviewer = trim($input["interviewer"] ?? "");
    $location = trim($input["location"] ?? "");
    $notes = trim($input["notes"] ?? "");
    $status = trim($input["status"] ?? "Upcoming");

    if ($date === "" || $time === "" || $type === "") {
        throw new Exception(
            "Date, time and interview type are required."
        );
    }

    $allowedStatuses = [
        "Upcoming",
        "Completed",
        "Cancelled"
    ];

    if (!in_array($status, $allowedStatuses, true)) {
        throw new Exception("Invalid interview status.");
    }

    $check = $conn->prepare(
        "SELECT id FROM interviews WHERE id = ? LIMIT 1"
    );
    $check->bind_param("i", $id);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Interview not found.");
    }

    $stmt = $conn->prepare(
        "UPDATE interviews
         SET interview_date = ?,
             interview_time = ?,
             duration = ?,
             interview_type = ?,
             mode = ?,
             meeting_link = ?,
             interviewer = ?,
             location = ?,
             notes = ?,
             status = ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        "ssssssssssi",
        $date,
        $time,
        $duration,
        $type,
        $mode,
        $meetingLink,
        $interviewer,
        $location,
        $notes,
        $status,
        $id
    );

    if (!$stmt->execute()) {
        throw new Exception(
            "Failed to update interview."
        );
    }

    echo json_encode([
        "success" => true,
        "message" => "Interview updated successfully.",
        "interviewId" => $id
    ]);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
