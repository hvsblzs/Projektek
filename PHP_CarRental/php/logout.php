<?php
    session_start();
    session_unset();
    session_destroy();
    header("Location: main.php");
    exit();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/main.css">
    <title>iKarRental</title>
</head>
<body>
    <header>
        <div class="navbar">
            <p id="headerText">iKarRental</p>
            <?php if (isset($_SESSION['user'])): ?>
                <nav>
                    <a href="profile.php"><button class="btn btn-warning" type="submit">Profil</button></a>
                    <a href="logout.php"><button class="btn btn-warning" type="submit">Kijelentkezés</button></a>
                </nav>
            <?php else: ?>
                <nav>
                    <a href="register.php"><button class="btn btn-warning" type="submit">Regisztráció</button></a>
                    <a href="login.php"><button class="btn btn-warning" type="submit">Bejelentkezés</button></a>
                </nav>
            <?php endif; ?>
        </div>
    </header>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <h1 class="display-2">Kölcsönözz autókat <br> könnyedén!</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <a href="register.php"><button class="btn btn-warning registration" type="submit">Regisztráció</button></a> 
            </div>
            <div class="col">
                <form action="" method="post">
                    <button type="submit" class="button">-</button>
                    <input type="text" id="seatsInput" placeholder="0" class="passengerBtn" readonly value="0">
                    <button type="submit" class="button">+</button> férőhely
                    <input type="date" placeholder="2024.10.04">-tól
                    <input type="date" placeholder="2024.10.04">-ig
                    <select name="" id="">
                        <option value="">Váltó tipusa</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </form>
            </div>
        </div>
    </div>
</body>
</html>