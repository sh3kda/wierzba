<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Franciszek Dawid</title>
    <link rel="stylesheet" href="/~25_dawid/dh/web/media/index.css?v=2">
    <style>
        table th,
        table td {
            text-align: center;
        }
    </style>
</head>
<body class="dark-theme">

<h2>Dodaj gracza</h2>
<form action="dodaj.php" method="POST">
    <label for="imie">Imię:</label><br>
    <input type="text" id="imie" name="imie" required><br><br>

    <label for="nazwisko">Nazwisko:</label><br>
    <input type="text" id="nazwisko" name="nazwisko" required><br><br>

    <label for="druzyna">ID drużyny:</label><br>
    <input type="number" id="druzyna" name="druzyna" required><br><br>

    <label for="numer">Numer:</label><br>
    <input type="number" id="numer" name="numer" required><br><br>

    <input type="submit" value="Dodaj">
</form>
<br>

<?php
    include 'autoryzacja.php';

    $pol = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname)
        or die('Błąd połączenia z serwerem: ' . mysqli_connect_error());

    mysqli_set_charset($pol, "utf8");

    $nowy = -1;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $imie = mysqli_real_escape_string($pol, $_POST['imie']);
        $nazwisko = mysqli_real_escape_string($pol, $_POST['nazwisko']);
        $druzyna = (int)$_POST['druzyna'];
        $numer = (int)$_POST['numer'];

        $zap = "INSERT INTO gracze (imie, nazwisko, druzyna_id, numer) VALUES ('$imie', '$nazwisko', '$druzyna', '$numer')";

        if (mysqli_query($pol, $zap)) {
            echo "<p>Gracz został dodany pomyślnie.</p>";
            $nowy = mysqli_insert_id($pol);
        } else {
            echo "<p>Błąd podczas dodawania gracza: " . htmlspecialchars(mysqli_error($pol)) . "</p>";
        }
    }

    $zap = "SELECT * FROM gracze ORDER BY gracz_id ASC";
    $wynik = mysqli_query($pol, $zap);

    echo "<h3>Lista graczy:</h3>";
    echo "<table>";
    echo "<tr>
            <th>ID Gracza</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>ID drużyny</th>
            <th>Numer</th>
          </tr>";

    while ($wiersz = mysqli_fetch_assoc($wynik)) {
        $klasa = ($wiersz['gracz_id'] == $nowy) ? " class='wyrozniona'" : "";

        echo "<tr$klasa>";
        echo "<td>" . htmlspecialchars($wiersz['gracz_id']) . "</td>";
        echo "<td>" . htmlspecialchars($wiersz['imie']) . "</td>";
        echo "<td>" . htmlspecialchars($wiersz['nazwisko']) . "</td>";
        echo "<td>" . htmlspecialchars($wiersz['druzyna_id'] ?? 'Brak') . "</td>";
        echo "<td>" . htmlspecialchars($wiersz['numer'] ?? 'Brak') . "</td>";
        echo "</tr>";
    }

    echo "</table>";
    mysqli_close($pol);
?>
</body>
</html>