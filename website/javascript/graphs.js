let graphOptions = {
    title: {
        fontFamily: "Nexus, Geneva, sans-serif",
        fontSize: 18,
        fontWeight: "lighter",
        margin: 8
    },
    subtitles: [{

    }],
    axisX: {
        title: "",
        fontColor: "#000000",
        titleFontSize: 16,
        labelFontSize: 14,
        fontFamily: "Nexus, Geneva, sans-serif",
        interval: 1,
        intervalType: "month",
        valueFormatString: "MMM",
        lineThickness: 0.1,
        gridThickness: 0.1,
        stripLines: [{
            color: "#003366",
            opacity: 0.2,
            showOnTop: true
        }]
    },
    axisY: {
        title: "",
        fontColor: "#000000",
        titleFontSize: 16,
        labelFontSize: 14,
        fontFamily: "Nexus, Geneva, sans-serif",
        includeZero: true,
        minimum: 0,
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
        lineColor: "#000000",
        dataPoints: []
    }, {}]
};

function to2DArray(csvString) {
    let array = [];
    csvString.split("\n").map(line => line.split(",")).forEach(element => {
        if (element[0] != "" && element[1] != "") {
            array.push({x: new Date(element[0]), y: parseInt(element[1])});
        }
    });
    return array;
}
function to1DArray(csvString) {
    return csvString.split("\n");
}
function queryDatabase(sql) {
    const dbConnection = new XMLHttpRequest();
    dbConnection.open("GET", "db_connection.php?query=" + sql);
    dbConnection.send();

    return dbConnection;
}

function display(country) {
    const answer = queryDatabase(`SELECT date, cases FROM covid19 WHERE country='${country}' ORDER BY date DESC;`);
    const answer_lockdown = queryDatabase(`SELECT date, cases FROM covid19 WHERE country='${country}' AND lockdown=TRUE ORDER BY date ASC`);

    let graph = new CanvasJS.Chart("chartContainer", graphOptions);

    answer.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            graph.options.data[0].dataPoints = to2DArray(this.responseText);
            graph.options.data[0].name = "cases";
            graph.render();
        }
    }

    answer_lockdown.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            daysOfLockdown = to2DArray(this.responseText);
            if (daysOfLockdown.length > 0) {
                graph.options.axisX.stripLines[0].startValue = daysOfLockdown[0]["x"];
                graph.options.axisX.stripLines[0].endValue = daysOfLockdown[daysOfLockdown.length-2]["x"];
                
                let array = [];
                daysOfLockdown.forEach(element => { array.push(element["y"]) });
    
                let lableAxisX = new Date ((graph.options.axisX.stripLines[0].endValue.getTime() + graph.options.axisX.stripLines[0].startValue.getTime()) / 2);
    
                let lable = [{ x: lableAxisX, y: Math.max.apply(null, array) * 1.1, indexLabel: "lockdown"}];
                graph.options.data[1] = {type: "scatter", markerSize: 0, toolTipContent: null, highlightEnabled: false, dataPoints: lable};
                graph.render();    
            }
        }
    }
}

function initalization() {
    const selectCountry = document.getElementById("countrySelector");
    selectCountry.addEventListener('change', function () {
        const selectCountry = document.getElementById("countrySelector");
        display(selectCountry.options[selectCountry.selectedIndex].value);
    });

    const answer = queryDatabase(`SELECT DISTINCT country FROM covid19`);
    answer.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            to1DArray(this.responseText).forEach(element => {
                let option = document.createElement('option');
                option.text = element;
                option.value = element;
                selectCountry.appendChild(option);
    
                if (element == 'Germany') {
                    selectCountry.selectedIndex = option.index;
                    selectCountry.dispatchEvent(new Event('change'));
                }
            });
        }
    }
}