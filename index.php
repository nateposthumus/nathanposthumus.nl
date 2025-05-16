<?php
session_start(); // sessie starten
require "database_connection.php"; // database verbinding maken

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RO Motoren</title>
    <link rel="stylesheet" href="style.css">
    

</head>
<body>

<?php if (isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] === false): ?>
<?php require "nav.php"; ?>
<?php endif; ?>
<?php if (isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] === true): ?>
        <?php require "invisnav.php"; ?>
        <h1 class="loggedIn_msg">login gelukt</h1>
<div class="container_loggedIn">
    

        <h2 class="user_name">Welkom, <?php echo $_SESSION["firstname"]; ?>!</h2>

        <!-- Log out knop -->
        <form action="logout.php" method="post">
            <button class="logout_btn" type="submit">Log out</button>
        </form>
    <?php endif; ?>
</div>
   
    
    <img src="images/BMW-M-Logo-500x281.jpg" alt="" class="bmw_logo">
    <img src="images/BMW-S1000RR-19-22-DECAT-LK-180-Ti-Star-Tip-Side-view.jpg" alt="" class="bmwIndex">

    <div class="menu">
        <a href="producten.html"><button>Start</button></a>
        <a href=""><button>Sign In</button></a>
    </div>
    
</body>
</html>
