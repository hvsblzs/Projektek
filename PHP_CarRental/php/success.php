<?php 
    session_start();

    if(isset($_SESSION['user'])){
        $user = $_SESSION['user'];
    }

    include_once('reservationstorage.php');
    $reservationStorage = new ReservationStorage();
    $reservation = $reservationStorage->findById($_GET['resid']);

    include_once('carstorage.php');
    $carStorage = new CarStorage();
    $car = $carStorage->findById($reservation['car_id']);
    $car['date_from'] = $reservation['date_from'];
    $car['date_to'] = $reservation['date_to'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/profile.css">
    <link rel="stylesheet" href="../css/success.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>Sikeres foglalás</title>
</head>
<body>
    <header>
        <div class="header">
            <a href="main.php" id="homePage"><p class="logo">iKarRental</p></a>
            <nav>
                <img src="../imgs/profPic2.jpeg" alt="Profile picture" id="profilePic">
            </nav>
        </div>
    </header>
    <div id="success">
        <img src="../imgs/success_icon.jpg" alt="">
        <h1>Sikeres foglalás!</h1>
        <p>A(z) <strong class="successStrong"><?= $car['brand'] . ' ' . $car['model'] ?></strong> sikeresen lefoglalva <strong class="successStrong"><?= $car['date_from'] . ' - ' . $car['date_to'] ?></strong> intervallumra.</p>
        <p>Foglalásod státuszát a profiloldaladon követheted nyomon.</p>
        <a href="profile.php"><button class="btn btn-warning">Profilom</button></a>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>