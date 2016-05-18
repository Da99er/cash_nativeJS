function pieRender(obj) {
    console.log("pie", obj);
    var totalCash = 0;
    var table = [];
    var stData = parseInt(startTime.value.match(/\d+/g).join(''));
    var endData = parseInt(endTime.value.match(/\d+/g).join(''));

    for (var i in obj) {
        if (~i.indexOf('_')) {
            continue;
        }
        var arr = obj[i]['_moneyHistory'].filter((e) => {
            var curData = parseInt(e[0].match(/\d+/g).join(''));
            if (curData >= stData && curData <= endData) {
                return e[1];
            }
        });
        res = reduceArrayMoney(arr);
        totalCash += res;
        var itemName = i.split("~").join(" ");
        table.push({
            y: res,
            legendText: itemName,
            label: itemName
        });
    }
    var onePercent = totalCash / 100;
    console.log(onePercent, totalCash);
    table.forEach((e) => {
        e.y = (e.y / onePercent).toFixed(2);
    });
    var pieTitle = `Your money story from ${startTime.value} to ${endTime.value}`;
    console.log("table", table, totalCash);

    if (!totalCash) {
        table = [{ y: 0, legendText: "NoData!", label: "NoData!" }];
        pieTitle = `No data from ${startTime.value} to ${endTime.value}`;
    }



    //15-05-2016

    /*[
        { y: 8.16, legendText: "Yahoo!", label: "Yahoo!" },
        { y: 4.67, legendText: "Bing", label: "Bing" },
        { y: 1.67, legendText: "Baidu", label: "Baidu" },
        { y: 0.98, legendText: "Others", label: "Others" }
    ]*/


    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: pieTitle
        },
        animationEnabled: true,
        legend: {
            verticalAlign: "center",
            horizontalAlign: "left",
            fontSize: 20,
            fontFamily: "Helvetica"
        },
        theme: "theme2",
        data: [{
            type: "pie",
            indexLabelFontFamily: "Garamond",
            indexLabelFontSize: 20,
            indexLabel: "{label} {y}%",
            startAngle: -20,
            showInLegend: true,
            toolTipContent: "{legendText} {y}%",
            dataPoints: table
        }]
    });
    chart.render();
}
