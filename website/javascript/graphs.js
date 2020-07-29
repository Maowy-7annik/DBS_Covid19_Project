let graphOptions = {
    axisX: {
        title: "cases"
    },
    axisY: {
        includeZero: true,
        lineThickness: 1,
        titel: "date"
    },
    data: [{
        type: "line",
        lineThickness: 3,
        dataPoints: []
    }]
};

function toArray(csvString) {
    let array = [];
    csvString.split("\n").map(line => line.split(",")).forEach(element => {
        array.push({x: new Date(element[0]), y: parseInt(element[1])});
    });
    return array;
}
function queryDatabase(sql) {
    const dbConnection = new XMLHttpRequest();
    dbConnection.open("GET", "db_connection.php?query=" + sql);
    dbConnection.send();

    return dbConnection;
}

function test() {
    const answer = queryDatabase("SELECT date, cases FROM covid19 WHERE country='Germany' ORDER BY date DESC;");

    answer.onreadystatechange = function () {
        graphOptions.data[0].dataPoints = toArray(this.responseText);
        graphContainerId = "chartContainer";
        new CanvasJS.Chart(graphContainerId, graphOptions).render()
    }
}