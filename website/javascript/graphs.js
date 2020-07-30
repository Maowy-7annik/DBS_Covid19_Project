let graphOptions = {
    title: {

    },
    subtitles: [{

    }],
    axisX: {
        title: "",
        fontColor: "#000000",
        titleFontSize: 16,
        labelFontSize: 14,
        fontFamily: "Verdana, Geneva, sans-serif",
        interval: 1,
        intervalType: "month",
        valueFormatString: "MMM",
        lineThickness: 0.1,
        gridThickness: 0.1
    },
    axisY: {
        title: "",
        fontColor: "#000000",
        titleFontSize: 16,
        labelFontSize: 14,
        fontFamily: "Verdana, Geneva, sans-serif",
        includeZero: true,
        minimum: -15,
        valueFormatString: "#######",
        lineThickness: 0.1,
        gridThickness: 0.1
    },
    toolTip: {
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        fontColor: "#000000",
        fontFamily: "Verdana, Geneva, sans-serif",
        contentFormatter: function(e){
            let toolTip = "";
            for(let i = 0; i < e.entries.length; i++) {
                let entry = e.entries[i];
                toolTip += entry.dataPoint.x.toDateString().slice(3,10)+ ": " + entry.dataPoint.y;
            }
            return toolTip;
        }
    },
    data: [{
        type: "line",
        name: "",
        lineThickness: 2,
        lineColor: "#003366",
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
        graphOptions.data[0].name = "cases";
        graphContainerId = "chartContainer";
        new CanvasJS.Chart(graphContainerId, graphOptions).render()
    }
}