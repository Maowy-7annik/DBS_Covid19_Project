<?php
    $db = mysqli_connect("localhost", "webservice", "password", "dbs_project");
    
    $result = $db->query($_GET["query"]) or exit(mysql_error());
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            printf("%s\n",implode(",", $row));
        }
        $result->free();
    }

    mysqli_close($db);
?>