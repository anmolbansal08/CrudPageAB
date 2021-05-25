/// <reference path="../../Scripts/references.js" />



$(function () {
    $.ajax({
        type: "GET",
        url: 'HtmlFiles/Operation/Operation.html',
        async: false,
        success: function (response) {
            $("body").html(response);

            var d = new Date();
            d.setHours(d.getHours() - 1);

            $('#StartDate').kendoDateTimePicker({
                format: "dd-MMM-yyyy HH:mm",
                timeFormat: "HH:mm",
                interval: 1,
                value: d
            });
            var d = new Date();
            // d.setHours(d.getHours() + 12);
            $('#EndDate').kendoDateTimePicker({
                format: "dd-MMM-yyyy HH:mm",
                timeFormat: "HH:mm",
                interval: 1,
                value: d
            });

            setTimeout(function () {
                //  OperationInit();

                Search();
            }, 100);
        }
    });
});


var totalrcs;
var totalrcsnot;
var totalongoing;
var totalrcsbuild;
var totaluws;
var totaluwsnot;


var totalrcsn;
var totalrcsnotn;
var totalongoingn;
var totalrcsbuildn;
var totaluwsn;
var totaluwsnotn;


function Search() {

    var FromDate = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
    var ToDate = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")

    var eDate = new Date(ToDate);

    var sDate = new Date(FromDate);

    if (FromDate != '' && FromDate != '' && sDate > eDate) {

        ShowMessage('warning', 'Information', "Start Date/Time should be greater than End Date/Time");

        return false;
    }
    else {
        Chart();

        if (totalrcsn > 0) {
            RCSChart();
        }
        if (totalrcsn == "") {
            ShowMessage("info", "", "No Data Found...");
        }

        if (totalrcsnotn > 0) {
            RCSNotChart();
        }
        if (totalongoingn > 0) {
            OnGoingChart();
        }
        if (totalrcsbuildn > 0) {
            RCSBuildChart();
        }
        if (totaluwsnotn > 0) {
            UWSNotDoneChart();
        }
        if (totaluwsn > 0) {
            UWSDoneChart();
        }

        //  ShowMessage("info", "", "No Data Found...");


    }


}

function RCSChartWindow(id, max) {
    $("#winRCSWindow").remove();
    $("body").append("<div id='winRCSWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winRCSWindow", "RCS CARGO");
    RCSChart(id, max);
}


function RCSNotChartWindow(id, max) {
    $("#winRCSNotWindow").remove();
    $("body").append("<div id='winRCSNotWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winRCSNotWindow", "RCS CARGO NOT BUILD");
    RCSNotChart(id, max);
}

function OnGoingChartWindow(id, max) {
    $("#winOnGoingWindow").remove();
    $("body").append("<div id='winOnGoingWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winOnGoingWindow", "ON GOING BUILD");
    OnGoingChart(id, max);
}


function RCSBuildChartWindow(id, max) {
    $("#winRCSBuildWindow").remove();
    $("body").append("<div id='winRCSBuildWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winRCSBuildWindow", "RCS BUILD");
    RCSBuildChart(id, max);
}

function UWSNotDoneChartWindow(id, max) {
    $("#winUWSNotDoneWindow").remove();
    $("body").append("<div id='winUWSNotDoneWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winUWSNotDoneWindow", "UWS NOT DONE");
    UWSNotDoneChart(id, max);
}


function UWSDoneChartWindow(id, max) {
    $("#winUWSDoneWindow").remove();
    $("body").append("<div id='winUWSDoneWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winUWSDoneWindow", "UWS Done");
    UWSDoneChart(id, max);
}


function Chart() {

    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();




    $.ajax({
        url: "Services/Report/OperationService.svc/GetData",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            from: start, to: end, citycode: userContext.CityCode, Type: type
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            totalrcsnot = "Total Tonnage : " + dataTableobj.Table2[0].RCSCargoNotBuild;
            totalrcs = "Total Tonnage : " + dataTableobj.Table2[0].RCSCargo;
            totalongoing = "Total Tonnage : " + dataTableobj.Table2[0].OngoingBuild;
            totalrcsbuild = "Total Tonnage : " + dataTableobj.Table2[0].RCSBuild;
            totaluwsnot = "Total Tonnage : " + dataTableobj.Table2[0].UWSNotDone;
            totaluws = "Total Tonnage : " + dataTableobj.Table2[0].UWSDone;


            totalrcsnotn = dataTableobj.Table2[0].RCSCargoNotBuild;
            totalrcsn = dataTableobj.Table2[0].RCSCargo;
            totalongoingn = dataTableobj.Table2[0].OngoingBuild;
            totalrcsbuildn = dataTableobj.Table2[0].RCSBuild;
            totaluwsnotn = dataTableobj.Table2[0].UWSNotDone;
            totaluwsn = dataTableobj.Table2[0].UWSDone;
        }
    });

}

function RCSChart(id, max) {


    var themes = kendo.dataviz.ui.themes;
    var MyTheme = kendo.deepExtend(
      // Deep copy
      {},

      // Base theme      
    //  themes.silver,

      {
          chart: {
              // Can contain any chart settings
              seriesColors: ["#ffae19", "#008000", "#af4f44", "#5861e2", "#848053", "#e86509", "#3880b2", "#ce7167", "#963f8d"]
          }
      }
    );

    themes.MyTheme = MyTheme;

    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();



    //var dataTableobj;
    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "RCSChart";

    $("#" + id).kendoChart({
        // theme: "MyTheme",
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {

                    url: "./Services/Report/OperationService.svc/GetRCSData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
                    async: true, type: "GET", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",

                }
            },
            requestStart: function () {
                kendo.ui.progress($("#loader"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#loader"), false);
            }
        }),



        title: {
            text: totalrcs
            //  TEXT: kendo.toString(TotalRCSCargo)
        },
        //legend: {
        //    position: "top"
        //},
        seriesDefaults: {

            type: "pie"
           ,
            labels: {
                visible: false,
                format: "{0}"
            }
        },

        series: [
             {
                 field: "TotalRCSCargo",
                 categoryField: "AgentName",
                 colorField: "yellow"
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}


function RCSNotChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();

    var themes = kendo.dataviz.ui.themes;
    var MyTheme = kendo.deepExtend(
      // Deep copy
      {},

      // Base theme      
    //  themes.silver,

      {
          chart: {
              // Can contain any chart settings
              seriesColors: ["#ffae19", "#008000", "#af4f44", "#5861e2", "#848053", "#e86509", "#3880b2", "#ce7167", "#963f8d"]
          }
      }
    );

    themes.MyTheme = MyTheme;


    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "RCSNotChart";
    $("#" + id).kendoChart({
        // theme: "MyTheme",
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "./Services/Report/OperationService.svc/GetRCSData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
                    async: true, type: "GET", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                }
            },
            requestStart: function () {
                kendo.ui.progress($("#loader"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#loader"), false);
            }
        }),

        title: {
            text: totalrcsnot
        },

        seriesDefaults: {

            type: "pie"
           ,
            labels: {
                visible: false,
                format: "{0}"
            }
        },

        series: [
             {
                 field: "TotalRCSCargoNotBuild",
                 categoryField: "AgentName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}


function OnGoingChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();

    var themes = kendo.dataviz.ui.themes;
    var MyTheme = kendo.deepExtend(
      // Deep copy
      {},

      // Base theme      
    //  themes.silver,

      {
          chart: {
              // Can contain any chart settings
              seriesColors: ["#ffae19", "#008000", "#af4f44", "#5861e2", "#848053", "#e86509", "#3880b2", "#ce7167", "#963f8d"]
          }
      }
    );

    themes.MyTheme = MyTheme;


    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "OnGoingChart";
    $("#" + id).kendoChart({

        //  theme: "MyTheme",
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {

                    url: "./Services/Report/OperationService.svc/GetRCSData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
                    async: true, type: "GET", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                }
            },
            requestStart: function () {
                kendo.ui.progress($("#loader"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#loader"), false);
            },


        }),



        title: {
            text: totalongoing
        },

        //legend: {
        //    position: "top"
        //},
        seriesDefaults: {

            type: "pie"
           ,

            labels: {

                //visible: true,
                //format: "{0}",

                visible: false
                //   template: "#= value#">0 
            }

        },

        series: [
             {
                 field: "TotalOngoingBuild",
                 categoryField: "AgentName",
                 labels: {
                     skip: 0
                 }
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}

function RCSBuildChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();

    var themes = kendo.dataviz.ui.themes;
    var MyTheme = kendo.deepExtend(
      // Deep copy
      {},

      // Base theme      
    //  themes.silver,

      {
          chart: {
              // Can contain any chart settings
              seriesColors: ["#ffae19", "#008000", "#af4f44", "#5861e2", "#848053", "#e86509", "#3880b2", "#ce7167", "#963f8d"]
          }
      }
    );

    themes.MyTheme = MyTheme;


    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "RCSBuildChart";
    $("#" + id).kendoChart({

        //   theme: "MyTheme",
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {

                    url: "./Services/Report/OperationService.svc/GetRCSData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
                    async: true, type: "GET", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                }
            },
            requestStart: function () {
                kendo.ui.progress($("#loader"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#loader"), false);
            }
        }),

        title: {
            text: totalrcsbuild
        },
        //legend: {
        //    position: "top"
        //},
        seriesDefaults: {

            type: "pie"
           ,
            labels: {
                visible: false,
                format: "{0}"
            }
        },

        series: [
             {
                 field: "TotalRCSBuild",
                 categoryField: "AgentName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}

function UWSNotDoneChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();
    var themes = kendo.dataviz.ui.themes;
    var MyTheme = kendo.deepExtend(
      // Deep copy
      {},

      // Base theme      
    //  themes.silver,

      {
          chart: {
              // Can contain any chart settings
              seriesColors: ["#ffae19", "#008000", "#af4f44", "#5861e2", "#848053", "#e86509", "#3880b2", "#ce7167", "#963f8d"]
          }
      }
    );

    themes.MyTheme = MyTheme;


    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "UWSNotDoneChart";
    $("#" + id).kendoChart({
        //$("#UWSNotDoneChart").kendoChart({



        //  theme: "MyTheme",
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    //url: "./Services/Report/OperationService.svc/GetSHCData/" + $("input[name='rdSHCExport']:checked").val() + "/" + start + "/" + end + "/" + userContext.CityCode + "/" + ($("#FlightNo").val() || "0"),
                    url: "./Services/Report/OperationService.svc/GetRCSData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
                    async: true, type: "GET", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                }
            },
            requestStart: function () {
                kendo.ui.progress($("#loader"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#loader"), false);
            }
        }),

        title: {
            text: totaluwsnot
        },
        //legend: {
        //    position: "top"
        //},
        seriesDefaults: {

            type: "pie"
           ,
            labels: {
                visible: false,
                format: "{0}"
            }
        },

        series: [
             {
                 field: "TotalUWSNotDone",
                 categoryField: "AgentName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}

function UWSDoneChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();

    var themes = kendo.dataviz.ui.themes;
    var MyTheme = kendo.deepExtend(
      // Deep copy
      {},

      // Base theme      
    //  themes.silver,

      {
          chart: {
              // Can contain any chart settings
              seriesColors: ["#ffae19", "#008000", "#af4f44", "#5861e2", "#848053", "#e86509", "#3880b2", "#ce7167", "#963f8d"]
          }
      }
    );

    themes.MyTheme = MyTheme;



    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "UWSDoneChart";
    $("#" + id).kendoChart({
        // $("#UWSDoneChart").kendoChart({



        //theme: "MyTheme",
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    //url: "./Services/Report/OperationService.svc/GetSHCData/" + $("input[name='rdSHCExport']:checked").val() + "/" + start + "/" + end + "/" + userContext.CityCode + "/" + ($("#FlightNo").val() || "0"),
                    url: "./Services/Report/OperationService.svc/GetRCSData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
                    //+ $("input:radio[name='Type']:checked").val(),
                    async: true, type: "GET", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                }
            },
            requestStart: function () {
                kendo.ui.progress($("#loader"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#loader"), false);
            }
        }),

        title: {
            text: totaluws
        },
        //legend: {
        //    position: "top"
        //},
        seriesDefaults: {

            type: "pie"
           ,
            labels: {
                visible: false,
                format: "{0}"
            }
        },

        series: [
             {
                 field: "TotalUWSDone",
                 categoryField: "AgentName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}


function SearchDetail() {



    var Fdt = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "dd-MM-yyyy HH:mm");
    var Tdt = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "dd-MM-yyyy HH:mm");

    var type = $("input:radio[name='Type']:checked").val(); //== undefined ? 4 : $("input:radio[name='Type']:checked").val();
    if (cfi.IsValidSubmitSection()) {
        var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
        var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");


        var prefix = "";
        var lb = "";
        if (type == "1") {
            prefix = "AGENT WISE DETAIL";
            lb = "Agent";
        }
        else if (type == "2") {
            prefix = "DESTINATION WISE DETAIL";
            lb = "Destination";
        }
        else if (type == "3") {
            prefix = "SHC WISE DETAIL";
            lb = "SHC";
        }
        else if (type == "4") {
            prefix = "AIRLINE WISE DETAIL";
            lb = "Airline";
        }


        $.ajax({
            url: "Services/Report/OperationService.svc/GetData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                from: start, to: end, citycode: userContext.CityCode, Type: type
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0.length > 0) {


                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:50%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'><b>EXPORT PROCESS MONITORING <br/>" + prefix + " </b></td></tr><tr><td  align='LEFT' colspan='2' nowrap>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";

                    str += "<tr ><td align='center'><b>AWB No</b></td><td align='center'><b>AWB Date</b></td><td align='center'><b>RCS Date Time</b></td><td  align='center'><b>" + lb + "</b></td><td align='center'><b>RCS Cargo</b></td>"
                    str += "<td align='center'><b>Ongoing Build</b></td><td align='center'><b>RCS Build</b></td>"
                    str += "<td align='center'><b>UWS Done</b></td><td align='center'><b>UWS Not Done</b></td>"

                    str += "<td align='center'><b>RCS Cargo Not Build</b></td></tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {
                        str += "<tr><td>" + dataTableobj.Table0[i].AWBNo +
                            "</td><td>" + dataTableobj.Table0[i].AWBDate +
                            "</td><td>" + dataTableobj.Table0[i].RCSDate +
                           "</td><td>" + dataTableobj.Table0[i].Agent +
                            "</td><td>" + dataTableobj.Table0[i].RCSCargo +
                            "</td><td>" + dataTableobj.Table0[i].OngoingBuild +
                        "</td><td>" + dataTableobj.Table0[i].RCSBuild +
                            "</td><td>" + dataTableobj.Table0[i].UWSDone
                            + "</td><td>" + dataTableobj.Table0[i].UWSNotDone
                             + "</td><td>" + dataTableobj.Table0[i].RCSCargoNotBuild
                            + "</td></tr>"
                    }

                    str += "<tr><td colspan='4'> <B>TOTAL</B></td><td><B>" + dataTableobj.Table2[0].RCSCargo + "</B></td><td><b>" + dataTableobj.Table2[0].OngoingBuild + "</b></td><td><b>" + dataTableobj.Table2[0].RCSBuild
                       + "</b></td><td><b>" + dataTableobj.Table2[0].UWSDone
                           + "</b></td><td><b>" + dataTableobj.Table2[0].UWSNotDone
                            + "</b></td><td><b>" + dataTableobj.Table2[0].RCSCargoNotBuild
                           + "</b></td></tr>"


                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "EXPORT PROCESS MONITORING " + prefix;

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}



function SearchSummary() {

    var Fdt = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "dd-MM-yyyy HH:mm");
    var Tdt = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "dd-MM-yyyy HH:mm");

    var type = $("input:radio[name='Type']:checked").val();
    if (cfi.IsValidSubmitSection()) {
        var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
        var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");


        var prefix = "";
        var lb = "";
        if (type == "1") {
            prefix = "AGENT WISE SUMMARY";
            lb = "Agent";
        }
        else if (type == "2") {
            prefix = "DESTINATION WISE SUMMARY";
            lb = "Destination";
        }
        else if (type == "3") {
            prefix = "SHC WISE SUMMARY";
            lb = "SHC";
        }
        else if (type == "4") {
            prefix = "AIRLINE WISE SUMMARY";
            lb = "Airline";
        }

        $.ajax({
            url: "Services/Report/OperationService.svc/GetData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                from: start, to: end, citycode: userContext.CityCode, Type: type
            },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table1.length > 0) {


                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:50%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'><b>EXPORT PROCESS MONITORING <br/>" + prefix + " </b></td></tr><tr><td align='LEFT' colspan='2' nowrap>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";

                    str += "<tr ><td align='center'><b>" + lb + "</b></td><td align='center'><b>RCS Cargo</b> </td>"
                    str += "<td align='center'><b>Ongoing Build</b></td><td align='center'><b>RCS Build</b></td><td align='center'><b>UWS Done</b></td>"
                    str += "<td align='center'><b>UWS Not Done</b></td><td align='center'><b>RCS Cargo Not Build</b></td></tr>"

                    for (var i = 0; i < dataTableobj.Table1.length; i++) {
                        str += "<tr><td>" + dataTableobj.Table1[i].Agent + "</td><td>" + dataTableobj.Table1[i].RCSCargo + "</td><td>" + dataTableobj.Table1[i].OngoingBuild + "</td><td>" + dataTableobj.Table1[i].RCSBuild
                        + "</td><td>" + dataTableobj.Table1[i].UWSDone
                            + "</td><td>" + dataTableobj.Table1[i].UWSNotDone
                             + "</td><td>" + dataTableobj.Table1[i].RCSCargoNotBuild
                            + "</td></tr>"
                    }

                    str += "<tr><td> <B>TOTAL</B></td><td><B>" + dataTableobj.Table2[0].RCSCargo + "</B></td><td><b>" + dataTableobj.Table2[0].OngoingBuild + "</b></td><td><b>" + dataTableobj.Table2[0].RCSBuild
                       + "</b></td><td><b>" + dataTableobj.Table2[0].UWSDone
                           + "</b></td><td><b>" + dataTableobj.Table2[0].UWSNotDone
                            + "</b></td><td><b>" + dataTableobj.Table2[0].RCSCargoNotBuild
                           + "</b></td></tr>"


                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "EXPORT PROCESS MONITORING " + prefix;

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}


function ChageChart(obj) {
    var res = $(obj).attr("rel");
    if (res == "grid") {
        $("div[rel='grid']").show();
        $("div[rel='chart']").hide();
    } else {
        $("div[rel='grid']").hide();
        $("div[rel='chart']").show();
    }
}

function ChangeData(obj) {

    setTimeout(function () {

        Search();
    }, 100);

}


function OpenKendowindow(cntrlId, rname) {

    var Kwindow = $("#" + cntrlId);
    if (!Kwindow.data("kendoWindow")) {
        Kwindow.kendoWindow({
            height: "90%",
            width: "90%",
            actions: ["close"],
            modal: true,
            title: rname,

            animation: {
                close: {
                    duration: 700
                }, open: {
                    duration: 700
                }
            }
        });
        Kwindow.data("kendoWindow").open();
        Kwindow.data("kendoWindow").center();
    }
    else {
        Kwindow.data("kendoWindow").open();
    }
    $(document).bind("keydown", function (e) {
        if (e.keyCode == kendo.keys.ESC) {
            var visibleWindow = $(".k-window:visible:last > .k-window-content")
            if (visibleWindow.length)
                visibleWindow.data("kendoWindow").close();
        }
    });
}

var url;
if (location.hostname == "localhost")
    url = "";
else
    url = "http://" + location.hostname + "/" + window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');

var Autourl = url + "/Services/AutoCompleteService.svc/AutoCompleteDataSource";


var GetDataSource = function (textId, tableName, keyColumn, textColumn, templateColumn, procName) {

    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: Autourl,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

var AutoComplete = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, onSelect, onChange, filterCriteria, separator, procName, addOnFunction) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (keyColumn == null || keyColumn == undefined)
        keyColumn = basedOn;
    if (textColumn == null || textColumn == undefined)
        textColumn = basedOn;
    var dataSource = GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName);

    $("#" + textId).kendoComboBox({
        filter: (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria),
        dataSource: dataSource,
        change: (onChange == undefined ? null : onChange),
        select: (onSelect == undefined ? null : onSelect),
        filterField: basedOn,
        separator: (separator == undefined ? null : separator),
        dataTextField: autoCompleteText,
        dataValueField: autoCompleteKey,
        valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
        template: '<span>#: TemplateColumn #</span>',
        addOnFunction: (addOnFunction == undefined ? null : addOnFunction)
    });

}