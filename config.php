<?php
header("Content-Type: application/json; charset=UTF-8");

// MySQL ulanish sozlamalari
define('DB_HOST', 'localhost');
define('DB_USER', 'username');
define('DB_PASS', 'password');
define('DB_NAME', 'ochamiz_db');

// Telegram bot tokeni
define('8084848221:AAENpSROVayqo3WHmN31IVI6Fm-xbENdXSs', 'YOUR_TELEGRAM_BOT_TOKEN');

// Xatoliklar
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// MySQL ga ulanish
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        sendError("Database connection failed: " . $conn->connect_error, 500);
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}

// Telegram autentifikatsiya
function verifyTelegramAuth($auth_data) {
    $check_hash = $auth_data['hash'];
    unset($auth_data['hash']);
    
    $data_check_arr = [];
    foreach ($auth_data as $key => $value) {
        $data_check_arr[] = $key . '=' . $value;
    }
    
    sort($data_check_arr);
    $data_check_string = implode("\n", $data_check_arr);
    $secret_key = hash('sha256', BOT_TOKEN, true);
    $hash = hash_hmac('sha256', $data_check_string, $secret_key);
    
    if (strcmp($hash, $check_hash) !== 0) {
        sendError("Data is NOT from Telegram");
    }
    
    if ((time() - $auth_data['auth_date']) > 86400) {
        sendError("Data is outdated");
    }
    
    return $auth_data;
}

// Umumiy API javobi
function sendResponse($data) {
    echo json_encode($data);
    exit;
}
?>