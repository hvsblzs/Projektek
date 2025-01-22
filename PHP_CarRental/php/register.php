<?php
    include_once('userstorage.php');
    $userStorage = new UserStorage();

    if ($_SERVER['REQUEST_METHOD'] == 'POST'){
        $fullname = isset($_POST['fullname']) ? $_POST['fullname'] : '';
        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';
        $password_again = isset($_POST['password_again']) ? $_POST['password_again'] : '';

        $errors = [];

        if (empty($fullname) || count(explode(' ', trim($fullname))) < 2) {
            $errors['fullname'] = 'A teljes név megadása kötelező és legalább két szóból kell állnia.';
        }

        else if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Megfelő email cím megadása kötelező.';
        }

        else if (empty($password)) {
            $errors['password'] = 'Jelszó megadása kötelező.';
        }

        else if (empty($password_again)){
            $errors['password_again'] = 'Adja meg a jelszót mégegszer.';
        }

        else if ($password != $password_again){
            $errors['password_again'] = 'A két jelszó nem egyezik.';
        }
        else if ($userStorage->findOne(["email" => $email])){
            $errors['email'] = 'Ez az email cím már regisztrálva van.';
        }
        else{
            $userStorage->add([
                'fullname' => $fullname,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_DEFAULT),
                'isAdmin' => ($email == 'admin@ikarrental.hu' && $password == 'admin') ? 'true' : 'false'
            ]);
            header('Location: login.php');
            exit();
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/register.css">
    <title>Register</title>
</head>
<body>
    <header>
        <div class="container header">
            <a href="main.php" id="homePage"><p class="logo">iKarRental</p></a>
            <nav>
                <a href="login.php" class="btn loginBtn">Bejelentkezés</a>
            </nav>
        </div>
    </header>
    <div class="register">
        <h1>Regisztráció</h1>
        <form action="register.php" method="post" novalidate>
            <label for="i1">Teljes név:</label><input type="text" name="fullname" id="i1" value="<?php echo isset($fullname) ? $fullname : '' ?>"><br>
            <span style="color: red;"><?= isset($errors['fullname']) ? $errors['fullname'] : '' ?></span>

            <label for="i2">Email:</label><input type="text" name="email" id="i2" value="<?php echo isset($email) ? $email : '' ?>"><br>
            <span style="color: red;"><?= isset($errors['email']) ? $errors['email'] : '' ?></span>

            <label for="i3">Jelszó:</label><input type="password" name="password" id="i3"><br>
            <span style="color: red;"><?= isset($errors['password']) ? $errors['password'] : '' ?></span>

            <label for="i4">Jelszó mégegyszer:</label><input type="password" name="password_again" id="i4"><br>
            <span style="color: red;"><?= isset($errors['password_again']) ? $errors['password_again'] : '' ?></span>

            <span id="submitBtn"><button type="submit">Regisztráció</button></span>
        </form>
    </div>

    

</body>
</html>