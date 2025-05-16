<?php
// Verbinding maken met de database
session_start(); // Start de sessie
require "database_connection.php";


// Controleren of de verbinding gelukt is
if ($conn->connect_error) {
    die("Verbinding mislukt: " . $conn->connect_error);
}

// Als formulier is verzonden
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST["firstname"];
    $lastname = $_POST["lastname"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $address = $_POST["address"];
    $city = $_POST["city"];
    $zipcode = $_POST["zipcode"];
    $phonenumber = $_POST["phonenumber"];
    $role = "user"; // automatisch instellen

    // SQL-query
    $sql = "INSERT INTO users (firstname, lastname, email, password, role, address, city, zipcode, phonenumber)
            VALUES ('$firstname', '$lastname', '$email', '$password', '$role', '$address', '$city', '$zipcode', '$phonenumber')";

    if ($conn->query($sql) === TRUE) {
        $_SESSION["acc_made"] = true; // Sessie variabele instellen
        header("Location: signin.php"); // Doorsturen naar inlogpagina
        
        exit();
    } else {
        echo "Fout: " . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Registreren</title>
</head>
<body>
    <h2>Signup</h2>
    <form method="post" action="">
        Voornaam: <input type="text" name="firstname" required><br>
        Achternaam: <input type="text" name="lastname" required><br>
        E-mail: <input type="email" name="email" required><br>
        Wachtwoord: <input type="password" name="password" required><br>
        Adres: <input type="text" name="address" required><br>
        Stad: <input type="text" name="city" required><br>
        Postcode: <input type="text" name="zipcode" required><br>
        Telefoonnummer: <input type="text" name="phonenumber" required><br>
        <input type="submit" value="Registreren">
    </form>
</body>
</html>
