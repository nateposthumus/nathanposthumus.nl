<?php
session_start();
require "database_connection.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = strtolower(trim($_POST["email"]));
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if (password_verify($password, $row["password"])) {
            $_SESSION["logged_in"] = true;
            $_SESSION["firstname"] = $row["firstname"]; // ✅ Voor welkom
            $_SESSION["email"] = $row["email"];         // Optioneel

            header("Location: index.php");
            exit();
        } else {
            $message = "Ongeldig wachtwoord.";
        }
    } else {
        $message = "E-mailadres niet gevonden.";
    }
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>



    <h1>Inloggen</h1>
    
    <form method="post" action="">
        <label for="email">E-mailadres:</label><br>
        <input type="email" id="email" name="email" required><br><br>

        <label for="password">Wachtwoord:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <button type="submit">Login</button>
    </form>

    <?php if (!empty($message)) echo "<p style='color: red;'>$message</p>"; ?>

</body>
</html>
