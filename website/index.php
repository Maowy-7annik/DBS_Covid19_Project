<!DOCTYPE html>
<html>
    <head>
        <title>DBS Project</title>
    </head>
    <body>
        <h1>Covid 19 Data</h1>
        <?php 
            $db = mysqli_connect("localhost", "webservice", "password", "dbs_project");
            if(!$db) {
                echo mysqli_connect_error() . PHP_EOL;
                exit;
            }
            $result = $db->query("SELECT * FROM covid19 WHERE country='Germany';") or exit(mysql_error());
            $row = $result->fetch_assoc();

            mysqli_close($db);
            print $row["country"]." ".$row["date"].": ".$row["cases"]."neue Fälle";
        ?>
    </body>
</html>