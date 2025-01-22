<?php
    session_start();
    if(!isset($_SESSION['user'])){
        header("Location: login.php");
    }else{
        $user = $_SESSION['user'];
    }

    include_once('reservationstorage.php');
    $reservationStorage = new ReservationStorage();

    $userReservation = [];
    $userReservation = $reservationStorage->findAll(["user_email" => $user['email']]);

    include_once('carstorage.php');
    $carStorage = new CarStorage();

    $cars = [];
    foreach($userReservation as $reservation){
        $car = $carStorage->findById($reservation['car_id']);
        if ($car) {
            $car['date_from'] = $reservation['date_from'];
            $car['date_to'] = $reservation['date_to'];
            $cars[] = $car;
        }
    }

    $allReservations = $reservationStorage->findAll();
    $reservedCars = [];
    foreach($allReservations as $reservation){
        $car = $carStorage->findById($reservation['car_id']);
        $reservedCars[] = $car;
    }

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $errors = '';

        if(isset($_POST['car_id'])){
            $deleteCarId = $_POST['car_id'];
            $reservationDelete = $reservationStorage->findOne(["car_id" => $deleteCarId]);
            $reservationDeleteId = $reservationDelete['id'];
            $reservationStorage->delete($reservationDeleteId);
            header("Location: profile.php");
        } else {
            $brand = $_POST['brand'];
            $model = $_POST['model'];
            $year = $_POST['year'];
            $passengers = $_POST['passengers'];
            $transmission = $_POST['transmission'];
            $fuel_type = $_POST['fuel_type'];
            $daily_price_huf = $_POST['daily_price_huf'];
            $image = $_POST['image'];

            if(empty($brand) || empty($model) || empty($year) || empty($passengers) || empty($transmission) || empty($fuel_type) || empty($daily_price_huf) || empty($image)){
                $errors = 'Minden adatot kötelező megadni!';
            }
            else if($daily_price_huf < 0){
                $errors = 'A napi bérleti díj nem lehet negatív!';
            }
            else if($passengers < 2){
                $errors = 'Az autóban legalább 2 utasnak el kell férnie!';
            }
            else if($year > date('Y')){
                $errors = 'Az autó évszáma nem lehet nagyobb, mint az aktuális év!';
            }
            else if($transmission !== 'Manual' && $transmission !== 'Automatic'){
                $errors = 'A váltó típusa csak manuális vagy automata lehet!';
            }
            else if($fuel_type !== 'Petrol' && $fuel_type !== 'Diesel' && $fuel_type !== 'Electric'){
                $errors = 'Az üzemanyag típusa csak benzin, dizel vagy elektromos lehet!';
            }
            else{
                $carStorage->add([
                    'brand' => $brand,
                    'model' => $model,
                    'year' => $year,
                    'transmission' => $transmission,
                    'fuel_type' => $fuel_type,
                    'passengers' => $passengers,
                    'daily_price_huf' => $daily_price_huf,
                    'image' => $image
                ]);
                header("Location: main.php");
            }
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/profile.css">
    <title>Profil</title>
</head>
<body>
    <?php if($user['isAdmin'] === 'false') : ?>
        <header>
            <div class="header">
                <a href="main.php" id="homePage"><p class="logo">iKarRental</p></a>
                <nav>
                    <img src="../imgs/profPic2.jpeg" alt="Profile picture" id="profilePic">
                    <a href="logout.php"><button class="btn btn-warning" type="submit">Kijelentkezés</button></a>
                </nav>
            </div>
        </header>
        <div id="profile">
            <img src="../imgs/profPic2.jpeg" alt="Profile picture" id="bigProfilePic">
            <p>Bejelentkezve, mint <br> <strong><?= $user['fullname'] ?></strong></p>
        </div>
        <div id="reservations">
            <h2>Foglalásaim</h2>
            <div class="container-fluid">
            <div class="row row-cols-1 row-cols-md-6 g-4">
                <?php foreach($cars as $car): ?>
                <div class="col">
                    <div class="card">
                        <img src="<?=$car['image'] ?>" class="card-img-top" alt="Car image">
                        <div class="card-body">
                            <h5 class="card-title"><?=$car['brand'] . " " . $car['model'] ?></h5>
                            <p class="card-text"><?=$car['passengers'] . " férőhely - " . ($car['transmission'] == 'Automatic' ? 'Automata' : 'Manuális') ?></p>
                            <div id="rentAndPrice">
                                <span id="dates"><?=$car['date_from'] . ' - ' . $car['date_to'] ?></span>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php else: ?>
        <header>
        <div class="header">
            <a href="main.php" id="homePage"><p class="logo">iKarRental</p></a>
            <nav>
                <img src="../imgs/adminprofpic.jpg" alt="Profile picture" id="profilePic">
                <a href="logout.php"><button class="btn btn-warning" type="submit">Kijelentkezés</button></a>
            </nav>
        </div>
        </header>
        <div id="adminLoggedIn">
                <p>Bejelentkezve, mint <br> <strong>Admin</strong></p>
        </div>
        <div id="addCar">
            <h2>Autó hozzáadása</h2>
            <form action="profile.php" method="post" novalidate>
                <?php if (!empty($errors)) : ?>
                    <span style="color: red;"><?= $errors ?></span>
                <?php endif; ?>
                <label for="i1">Autó márkája:</label><input type="text" name="brand" id="i1" value="<?php echo isset($brand) ? $brand : '' ?>"><br>
                <label for="i2">Autó tipusa:</label><input type="text" name="model" id="i2" value="<?php echo isset($model) ? $model : '' ?>"><br>
                <label for="i3">Évjárat:</label><input type="number" name="year" id="i3" value="<?php echo isset($year) ? $year : '' ?>"><br>
                <label for="i4">Ülések száma:</label><input type="number" name="passengers" id="i4" value="<?php echo isset($passengers) ? $passengers : '' ?>"><br>
                <label for="i5">Váltó tipusa:</label>
                <select name="transmission" id="transmission">
                    <option value="Manual" <?php echo isset($transmission) === 'Manual' ? 'selected' : ''; ?>>Manuális</option>
                    <option value="Automatic" <?php echo isset($transmission) === 'Automatic' ? 'selected' : ''; ?>>Automata</option>
                </select><br>
                <label for="i6">Üzemanyag tipusa:</label>
                <select name="fuel_type" id="fuel_type">
                    <option value="Petrol" <?php echo isset($fuel_type) === 'Petrol' ? 'selected' : ''; ?>>Benzin</option>
                    <option value="Diesel" <?php echo isset($fuel_type) === 'Diesel' ? 'selected' : ''; ?>>Dizel</option>
                    <option value="Electric" <?php echo isset($fuel_type) === 'Electric' ? 'selected' : ''; ?>>Elektromos</option>
                </select><br>
                <label for="i7">Napi bérleti díj:</label><input type="number" name="daily_price_huf" id="i7" value="<?php echo isset($daily_price_huf) ? $daily_price_huf : '' ?>"><br>
                <label for="i8">Kép URL:</label><input type="text" name="image" id="i8" value="<?php echo isset($image) ? $image : '' ?>"><br>
                <div id="addButton"><button class="btn btn-warning" id="addButton" type="submit">Hozzáadás</button></div>
            </form>
        </div>
        <div id="adminProfile">
            <div id="reservedCarsText"><h2>Foglalások</h2></div>
            <div class="container-fluid">
                <div class="row row-cols-1 row-cols-md-6 g-4">
                    <?php foreach($reservedCars as $car): ?>
                        <?php if ($car): ?>
                            <div class="col">
                                <div class="card">
                                    <img src="<?=$car['image'] ?>" class="card-img-top" alt="Car image">
                                    <div class="card-body">
                                        <h5 class="card-title"><?=$car['brand'] . " " . $car['model'] ?></h5>
                                        <p class="card-text"><?=$car['passengers'] . " férőhely - " . ($car['transmission'] == 'Automatic' ? 'Automata' : 'Manuális') ?></p>
                                        <div id="rentAndPrice">
                                            <form action="profile.php" method="post" novalidate>
                                                <input type="hidden" name="car_id" value="<?=$car['id'] ?>">
                                                <button class="btn btn-warning" type="submit">Foglalás törlése</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    <?php endif; ?>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>