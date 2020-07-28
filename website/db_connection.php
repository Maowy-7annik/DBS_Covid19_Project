<?php
    $db = mysqli_connect("localhost", "webservice", "password", "dbs_project");
    if(!$db) {
        echo mysqli_connect_error() . PHP_EOL;
        exit;
    }
    $result = $db->query($_GET["query"]) or exit(mysql_error());
    $row = $result->fetch_assoc();
    echo $row["country"]." ".$row["date"].": ".$row["cases"]." neue Fälle";

    mysqli_close($db);
?>