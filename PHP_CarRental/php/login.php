<?php
    include_once('userstorage.php');
    $userStorage = new UserStorage();

    $errors = '';

    if ($_SERVER['REQUEST_METHOD'] == 'POST'){
        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors = 'Megfelő email cím megadása kötelező.';
        }

        else if (empty($password)) {
            $errors = 'Jelszó megadása kötelező.';
        }

        else{
            $user = $userStorage->findOne(["email" => $email]);
            if ($user && password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['user'] = $user;
                header('Location: main.php');
                exit();
            } else {
                $errors = 'Hibás email cím vagy jelszó.';
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/register.css">
    <title>Login</title>
</head>
<body>
    <header>
        <div class="container header">
            <a href="main.php" id="homePage"><p class="logo">iKarRental</p></a>
            <nav>
                <a href="register.php" class="btn loginBtn">Regisztráció</a>
            </nav>
        </div>
    </header>
    <div class="register">
        <h1>Bejelentkezés</h1>
        <form action="login.php" method="post" novalidate>
            <?php if (!empty($errors)) : ?>
                <span style="color: red;"><?= $errors ?></span>
            <?php endif; ?>
            <label for="i2">Email:</label><input type="text" name="email" id="i2"><br>
            <label for="i3">Jelszó:</label><input type="password" name="password" id="i3"><br>
            <span id="submitBtn"><button type="submit">Bejelentkezés</button></span>
        </form>
    </div>
</body>
</html>