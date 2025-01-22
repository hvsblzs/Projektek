<?php
    $id = $_GET['id'];
    include_once('carstorage.php');
    $carStorage = new CarStorage();
    $car = $carStorage->findById($id);

    session_start();

    if(isset($_SESSION['user'])){
        $user = $_SESSION['user'];
    }else{
        $user = [];
        $user['isAdmin'] = 'false';
    }

    include_once('reservationstorage.php');
    $reservationStorage = new ReservationStorage();

    $dateFrom = isset($_POST['dateFrom']) ? $_POST['dateFrom'] : '';
    $dateTo = isset($_POST['dateTo']) ? $_POST['dateTo'] : '';

    $errors = '';

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        if(isset($_SESSION['user'])){
            if(empty($dateFrom) || empty($dateTo)){
                $errors = 'Kérjük, válasszon érvényes dátumot!';
            }
            else if($dateFrom > $dateTo){
                $errors = 'A kezdő dátumnak korábbinak kell lennie a végső dátumnál!';
            }
            else{
                $resId = $reservationStorage->add([
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo,
                    'user_email' => $_SESSION['user']['email'],
                    'car_id' => $id
                ]); 
                header('Location: success.php?resid=' . $resId);
                exit();
            }
        }
        else if(!isset($_SESSION['user'])){
            $errors = 'Kérjük, előbb jelentkezzen be vagy ha még nincs fiókja, regisztráljon!';
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/details.css">
    <title>Részletek</title>
</head>
<body>
    <nav class="navbar">
        <a href="main.php" id="homePage"><p id="headerText">iKarRental</p></a>
            <?php if (isset($_SESSION['user'])): ?>
                <nav class="navBtns">
                    <a href="profile.php"><button class="btn btn-warning" type="submit">Profil</button></a>
                    <a href="logout.php"><button class="btn btn-warning" type="submit">Kijelentkezés</button></a>
                </nav>
            <?php else: ?>
                <nav class="navBtns">
                    <a href="register.php"><button class="btn btn-warning" type="submit">Regisztráció</button></a>
                    <a href="login.php"><button class="btn btn-warning" type="submit">Bejelentkezés</button></a>
                </nav>
            <?php endif; ?>
    </nav>
    <div class="container">
        <div class="row">
            <div class="col"></div>
            <div class="col carName">
                <span><?= $car['brand'] . ' ' . $car['model']?></span>
            </div>
        </div>
        <div class="row">
            <div class="col carImageDiv">
                <img src="<?= $car['image'] ?>" alt="Car image" id="carImage">
            </div>
            <div class="col">
                <div id="carDetailsDiv">
                    <div class="row">
                        <div class="col">
                            <p>Üzemanyag: <?= $car['fuel_type'] == 'Petrol' ? 'Benzin' : ($car['fuel_type'] == 'Diesel' ? 'Dizel' : 'Elektromos') ?></p>
                        </div>
                        <div class="col rightColText">
                            <p>Gyártási év: <?= $car['year'] ?></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p>Férőhelyek: <?= $car['passengers'] ?></p>
                        </div>
                        <div class="col rightColText">
                            <p>Váltó: <?= $car['transmission'] == 'Automatic' ? 'Automata' : 'Manuális' ?></p>
                        </div>
                    </div>
                    <p id="dailyPrice"><?= $car['daily_price_huf'] ?> <strong>Ft</strong>/nap</p>
                </div>
                <div id="detailRentDiv">
                <?php if ($user['isAdmin'] === 'false') : ?>
                    <form action="details.php?id=<?= $id ?>" method="post" novalidate>
                        <input type="hidden" name="id" value="<?= $id ?>">
                        <input type="date" class="btn btn-info" name="dateFrom"></input><span class="dateSpan">-tól</span>
                        <input type="date" class="btn btn-info" name="dateTo"></input><span class="dateSpan">-ig</span>
                        <button type="submit" class="btn btn-warning">Lefoglalom</button>
                    </form>
                <?php endif; ?>
                </div>
                <?php if (!empty($errors)) : ?>
                    <div style="color: red;" id="error"><?= $errors ?></div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>