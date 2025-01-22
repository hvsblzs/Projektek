<?php
    include_once('carstorage.php');

    $carStorage = new CarStorage();
    $cars = $carStorage->findAll();

    session_start();

    $seats = isset($_GET['seats']) ? (int)($_GET['seats']) : min(array_column($cars, 'passengers'))-1;
    $dateFrom = isset($_GET['dateFrom']) ? $_GET['dateFrom'] : '';
    $dateTo = isset($_GET['dateTo']) ? $_GET['dateTo'] : '';
    $transmission = isset($_GET['transmission']) ? $_GET['transmission'] : '';
    $priceFrom = isset($_GET['priceFrom']) ? (int)($_GET['priceFrom']) : min(array_column($cars, 'daily_price_huf'));
    $priceTo = isset($_GET['priceTo']) ? (int)($_GET['priceTo']) : max(array_column($cars, 'daily_price_huf'));

    $filteredCars = $cars;

    if ($seats > 0) {
        $filteredCars = array_filter($filteredCars, function($car) use ($seats) {
            return $car['passengers'] > $seats;
        });
    }

    if (!empty($transmission)) {
        $filteredCars = array_filter($filteredCars, function($car) use ($transmission) {
            return $car['transmission'] === $transmission;
        });
    }

    if ($priceFrom > min(array_column($cars, 'daily_price_huf')) || $priceTo < max(array_column($cars, 'daily_price_huf'))) {
        $filteredCars = array_filter($filteredCars, function($car) use ($priceFrom, $priceTo) {
            return $car['daily_price_huf'] >= $priceFrom && $car['daily_price_huf'] <= $priceTo;
        });
    };

    if(isset($_SESSION['user'])){
        $user = $_SESSION['user'];
    }
    else{
        $user = [];
        $user['isAdmin'] = 'false';
    }

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        if(isset($_POST['car_edit'])){
            $carId = $_POST['car_edit'];
            header("Location: edit.php?id=$carId");
        }
        else if(isset($_POST['car_delete'])){
            $carId = $_POST['car_delete'];
            $carStorage->delete($carId);
            header("Location: main.php");
        }
    }
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
            <a href="main.php"><p id="headerText">iKarRental</p></a>
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
                <form action="main.php" method="get" novalidate>
                    <button type="button" class="button" id="minus">-</button>
                    <input type="text" id="seatsInput" class="passengerBtn" readonly value="<?php echo $seats; ?>" name="seats">
                    <button type="button" class="button" id="plus">+</button> férőhely
                    <input type="date" placeholder="2024.10.04" name="dateFrom">-tól
                    <input type="date" placeholder="2024.10.04" name="dateTo">-ig
                    <select name="transmission" name="transmission">
                        <option value="" <?php echo $transmission === '' ? 'selected' : ''; ?>>Váltó tipusa</option>
                        <option value="Manual" <?php echo $transmission === 'Manual' ? 'selected' : ''; ?>>Manuális</option>
                        <option value="Automatic" <?php echo $transmission === 'Automatic' ? 'selected' : ''; ?>>Automata</option>
                    </select>
                    <input type="text" value="<?php echo $priceFrom; ?>" name="priceFrom">-
                    <input type="text" value="<?php echo $priceTo; ?>" name="priceTo">Ft
                    <button class="btn btn-warning szures" type="submit">Szűrés</button>
                </form>
            </div>
        </div>
    </div>
    <br>
    <div class="container-fluid cars">
        <div class="row row-cols-1 row-cols-md-6 g-4">
            <?php if(empty($filteredCars)): ?>
                <h2>Nincs találat</h2>
            <?php else: ?>
                <?php foreach($filteredCars as $car): ?>
                <div class="col">
                    <a href="details.php?id=<?=$car['id'] ?>">
                        <div class="card">
                            <img src="<?=$car['image'] ?>" class="card-img-top" alt="Car image">
                            <div class="card-body">
                                <h5 class="card-title"><?=$car['brand'] . " " . $car['model'] ?></h5>
                                <p class="card-text"><?=$car['passengers'] . " férőhely - " . ($car['transmission'] == 'Automatic' ? 'Automata' : 'Manuális') ?></p>
                                <?php if($user['isAdmin'] === 'false'): ?>
                                    <div id="rentAndPrice">
                                        <span><?=$car['daily_price_huf'] ?> Ft</span>
                                        <button class="btn btn-warning" type="submit">Foglalás</button>
                                    </div>
                                <?php else: ?>
                                    <div id="rentAndPrice">
                                        <form action="main.php" method="post" novalidate>
                                            <input type="hidden" value="<?=$car['id'] ?>" name="car_edit">
                                            <button class="btn btn-warning" type="submit">Szerkesztés</button>
                                        </form>
                                        <form action="main.php" method="post" novalidate>
                                            <input type="hidden" value="<?=$car['id'] ?>" name="car_delete">
                                            <button class="btn btn-warning" type="submit">Törlés</button>
                                        </form>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </a>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script>
        document.querySelector('#minus').addEventListener('click', function() {
            const seatsInput = document.querySelector('#seatsInput');
            let currentValue = parseInt(seatsInput.value);
            if (currentValue > 0) {
                seatsInput.value = currentValue - 1;
            }
        });

        document.querySelector('#plus').addEventListener('click', function() {
            const seatsInput = document.querySelector('#seatsInput');
            let currentValue = parseInt(seatsInput.value);
            seatsInput.value = currentValue + 1;
        });

        seatsInput.addEventListener('input', function() {
            if (parseInt(seatsInput.value) < 0) {
                seatsInput.value = 0;
            }
            seatsInput.value = currentValue + 1;
        });
    </script>
</body>
</html>