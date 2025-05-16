<?php
session_start();

// Verwijder de sessie of zet logged_in op false
$_SESSION["logged_in"] = false;

// Optioneel: alle sessiegegevens verwijderen
// session_unset();
// session_destroy();

header("Location: index.php"); // terug naar loginpagina
exit();
?>
