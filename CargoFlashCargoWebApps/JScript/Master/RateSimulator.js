
function xmlGenerator() 
{

    var xmlDoc = new ActiveXObject("MSXML.DOMDocument");
    xmlDoc.async = "false";
    xmlDoc.load("ProductError.xml");
   var Errors = xmlDoc.documentElement;
   var Error = Errors.childNodes(0);
//   var key = objErrors.getElementsByTagName("key");

//   var ActualErrorNumber = objErrors.getElementsByTagName("ActualErrorNumber");
//   var CustomiseMessages = objErrors.getElementsByTagName("CustomiseMessages");
   //   alert(ActualErrorNumber);
   //alert(document.getElementById("Key"));
   document.getElementById("Key").innerHTML = Error.getElementsByTagName("Key")[0].text;
   document.getElementById("Key").innerHTML = Error.getElementsByTagName("Key")[0].text;
    document.getElementById("ActualErrorNumber").innerHTML = Error.getElementsByTagName("ActualErrorNumber")[0].text;
   document.getElementById("CustomiseMessages").innerHTML = Error.getElementsByTagName("CustomiseMessages")[0].text;
   //alert(document.getElementById("CustomiseMessages").innerHTML, document.getElementById("Key").innerHTML);

}
var BucketName = [];
function createChart() {
    $("#chart").kendoChart({
        title: {
            text: "Rate Growth/Time in days %/"
        },
        legend: {
            position: "bottom"
        },
        chartArea: {
            background: ""
        },
        			
        seriesDefaults: {
            type: "line"
        },
        series: [{
            name: "DISCOUNTED",
            data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
        }, {
            name: "HIGHER",
            data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, 9, 4.339, 2.727]
        }, {
            name: "LOWER",
            data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, 8, 4.3, 4.3]
        }, {
            name: "PRIME",
            data: [0, 1, 2, 1.799, 2.252, 3.343, 0.843, 2.877, 5, 5.590]
        }],
        valueAxis: {
            labels: {
                format: "{0}%"
            },
            line: {
                visible: false
            },
            axisCrossingValue: 0
        },
        categoryAxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            majorGridLines: {
                visible: false
            }
        },
        tooltip: {
            visible: true,
            format: "{0}%",
            template: "#= series.name #: #= value #"
        }
    });
}

//$(document).ready(createChart);



$(document).ready(function () {
    $(document).bind("kendo:skinChange", createChart);
    cfi.ValidateForm();
    // cfi.AutoComplete('txtFlightNo', "FlightNo", "vDailyFlight", "FlightNo", "FlightNo", null, null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2('txtFlightNo', "FlightNo", "Master_RateSimulator_FlightNo",  null, "contains", null, null, null, null, null);
    $("#btnSubmit").click(function () {
        if (!cfi.IsValidForm()) {
            return;
        }
        $("#wrapper").html("");
        $.ajax({
            type: "GET",
            url: "./Services/DashBoardHomeService.svc/GetDashBoardAllocationVsBooked",
            data: { FlightNo: $("#txtFlightNo").val(), FlightDate: $("#txtFlightDate").val() },
            dataType: "json",
            success: function (response) {
                // var tempdiv = $('<div class="divs" style="border:1px solid red"></div>');
                $("#wrapper").append($("<table style='border:1px solid #BEBDBE;border-spacing:0'>").append($("<tr/><tr/><tr/><tr/>")));

                $.each(response, function (key, val) {
                    var divs = $('<td><div class="divs"><input id="Text' + key + '" class="balSlider"/><span style="color:#0574B8"></div></td>')
                    if (key == 0) {
                        $("#wrapper table tr:eq(0)").append($("<td style='width:100px;text-align:left;border-bottom:1px solid red'>BOOKED</td>"));
                        $("#wrapper table tr:eq(1)").append($("<td style='width:100px;text-align:left;border-bottom:1px solid red'>ALLOCATED</td>"));
                        $("#wrapper table tr:eq(2)").append($("<td/>"));
                        $("#wrapper table tr:eq(3)").append($("<td style='border-top:1px solid #BEBDBE'>").append('BUCKET NAME'));
                    }
                    $("#wrapper table tr:eq(0)").append($('<td style="border-bottom:1px solid red"><div id="divCurValueSlider' + key + '"style="height:30px;color:green;text-align:left">' + val.Allocated + ' Kg</div></td>'));
                    $("#wrapper table tr:eq(1)").append($('<td style="border-bottom:1px solid red"><div><span style="color:red">' + val.Maximum + ' Kg</span></div></td>'));
                    $("#wrapper table tr:eq(2)").append($('<td style="">').append(divs));
                    $("#wrapper table tr:eq(3)").append($('<td style="color:#0774B8;border-top:1px solid #BEBDBE">').append(val.BucketName));

                    //$(tempdiv).text("");
                    var num = val.Maximum;
                    num = num.toFixed(0);
                    var len = num.toString().length - 1;
                    len = len < 0 ? 0 : len;
                    num = Math.ceil((num / Math.pow(10, len)).toFixed(2));
                    num = num * Math.pow(10, len);
                    large = Math.ceil(num / 10);
                    small = Math.ceil(num / 100);
                    small = small * 2;
                    var slider = $("#Text" + key.toString()).kendoSlider({
                        orientation: "vertical",
                        change: function (e) {
                            $(e.sender.element.attr("id").replace("Text", "#divCurValueSlider")).text(e.value + " Kg");
                        },
                        slide: function (e) {
                            $(e.sender.element.attr("id").replace("Text", "#divCurValueSlider")).text(e.value + " Kg");
                        },
                        name: "Slider",
                        min: 0,
                        tooltip: { visible: true, format: "{0} Kg", template: "" },
                        tickPlacement: "both",
                        max: val.Maximum,
                        smallStep: small,
                        largeStep: large,
                        value: val.Allocated,
                        showButtons: false
                    }).data("kendoSlider");
                })
                //end of each
                createChart();
            },
            complete: function () {
            }
        });
    })
})