<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Franciszek Dawid</title>
    <link rel="stylesheet" href="/~25_dawid/dh/web/media/index.css?v=2">
</head>
<body class="dark-theme">

<h2>Wyszukaj gracza</h2>
<form method="POST" action="wyszukaj.php">
    <label for="imie">Imię:</label><br>
    <input type="text" id="imie" name="imie" required><br><br>
    
    <label for="nazwisko">Nazwisko:</label><br>
    <input type="text" id="nazwisko" name="nazwisko" required><br><br>
    
    <input type="submit" name="wyszukaj" value="Szukaj">
</form>
<br>

<?php
if (isset($_POST['wyszukaj'])) {
    
    include 'autoryzacja.php';
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) 
        or die('Błąd połączenia z serwerem: ' . mysqli_connect_error());
    
    mysqli_set_charset($conn, "utf8");

    $imie = mysqli_real_escape_string($conn, $_POST['imie']);
    $nazwisko = mysqli_real_escape_string($conn, $_POST['nazwisko']);

    // Pobranie danych gracza, nazwy drużyny oraz parametrów fizycznych (wzrost, waga)
    $q_gracz = "SELECT g.*, d.nazwa AS nazwa_druzyny, p.wzrost, p.waga 
                FROM gracze g 
                LEFT JOIN druzyny d ON g.druzyna_id = d.druzyna_id 
                LEFT JOIN parametry_gracza p ON g.gracz_id = p.gracz_id 
                WHERE g.imie = '$imie' AND g.nazwisko = '$nazwisko' 
                LIMIT 1";
                
    $res_gracz = mysqli_query($conn, $q_gracz);

    if (mysqli_num_rows($res_gracz) > 0) {
        $row_gracz = mysqli_fetch_assoc($res_gracz);
        $szukana_druzyna_id = $row_gracz['druzyna_id'];

        echo "<h3>Dane gracza:</h3>";
        echo "<table>";
        echo "<tr>
                <th>ID Gracza</th>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Drużyna</th>
                <th>Numer</th>
                <th>Wzrost [cm]</th>
                <th>Waga [kg]</th>
              </tr>";
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row_gracz['gracz_id']) . "</td>";
        echo "<td>" . htmlspecialchars($row_gracz['imie']) . "</td>";
        echo "<td>" . htmlspecialchars($row_gracz['nazwisko']) . "</td>";
        echo "<td>" . htmlspecialchars($row_gracz['nazwa_druzyny'] ?? 'Brak przypisania') . "</td>";
        echo "<td>" . htmlspecialchars($row_gracz['numer'] ?? 'Brak') . "</td>";
        echo "<td>" . htmlspecialchars($row_gracz['wzrost'] ?? 'Brak danych') . "</td>";
        echo "<td>" . htmlspecialchars($row_gracz['waga'] ?? 'Brak danych') . "</td>";
        echo "</tr>";
        echo "</table>";

        if (is_null($szukana_druzyna_id)) {
            echo "<p>Gracz nie jest przypisany do żadnej drużyny.</p>";
        } else {
            echo "<h3>Lista wszystkich drużyn:</h3>";
            echo "<table>";
            echo "<tr><th>ID Drużyny</th><th>Nazwa Drużyny</th></tr>";

            $q_wszystkie_druzyny = "SELECT druzyna_id, nazwa FROM druzyny";
            $res_wszystkie = mysqli_query($conn, $q_wszystkie_druzyny);

            while ($row_druzyna = mysqli_fetch_assoc($res_wszystkie)) {
                $klasa = ($row_druzyna['druzyna_id'] == $szukana_druzyna_id) ? " class='wyrozniona'" : "";
                echo "<tr$klasa>";
                echo "<td>" . htmlspecialchars($row_druzyna['druzyna_id']) . "</td>";
                echo "<td>" . htmlspecialchars($row_druzyna['nazwa']) . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    }else {
        echo "<p>Podany gracz (<b>" . htmlspecialchars($imie) . " " . htmlspecialchars($nazwisko) . "</b>) nie występuje w bazie danych.</p>";
    }

    mysqli_close($conn);
}
?>

</body>
</html>