$(function () {
    $.ajax({
        type: "GET",
        url: 'HtmlFiles/Dashboard/Dashboard.html',
        success: function (response) {
            $("body").html(response);
            DashboardInit();
        }
    });
});


function DashboardInit() {
    createChart();
    cfi.DateType("StartDate");
    cfi.DateType("EndDate");
}
function createChart() {
    $("#TeamSales").kendoChart({
        title: {
            text: "Site Visitors Stats \n /thousands/"
        },
        legend: {
            visible: false
        },
        seriesDefaults: {
            type: "bar"
        },
        series: [{
            name: "Total Visits",
            data: [56000, 63000, 74000, 91000, 117000, 138000]
        }, {
            name: "Unique visitors",
            data: [52000, 34000, 23000, 48000, 67000, 83000]
        }],
        valueAxis: {
            max: 140000,
            line: {
                visible: false
            },
            minorGridLines: {
                visible: true
            },
            labels: {
                rotation: "auto"
            }
        },
        categoryAxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            majorGridLines: {
                visible: false
            }
        },
        tooltip: {
            visible: true,
            template: "#= series.name #: #= value #"
        }
    });
    $("#Team").kendoChart({
        title: {
            position: "bottom",
            text: "Share of Internet Population Growth, 2007 - 2012"
        },
        legend: {
            visible: false
        },
        chartArea: {
            background: ""
        },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: \n #= value#%"
            }
        },
        series: [{
            type: "pie",
            startAngle: 150,
            data: [{
                category: "Asia",
                value: 53.8,
                color: "#9de219"
            },{
                category: "Europe",
                value: 16.1,
                color: "#90cc38"
            },{
                category: "Latin America",
                value: 11.3,
                color: "#068c35"
            },{
                category: "Africa",
                value: 9.6,
                color: "#006634"
            },{
                category: "Middle East",
                value: 5.2,
                color: "#004d38"
            },{
                category: "North America",
                value: 3.6,
                color: "#033939"
            }]
        }],
        tooltip: {
            visible: true,
            format: "{0}%"
        }
    });


}
