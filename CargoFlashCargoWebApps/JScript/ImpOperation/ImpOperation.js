/// <reference path="../../Scripts/references.js" />

$(document).ready(function () {
    var ctypes = [{ Key: "1", Text: "Agent" }, { Key: "2", Text: "Destination" }, { Key: "3", Text: "SHC" }];
    cfi.AutoCompleteByDataSource("Type", ctypes);
    //  alert("");


});


$(function () {
    $.ajax({
        type: "GET",
        url: 'HtmlFiles/ImpOperation/ImpOperation.html',
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
                Search();
            }, 100);
        }
    });
});


var totalrecd;
var totalarr;
var totalpending;
var totalongoing;
var totalcomplete;
var totallocation;


var totalrecdn;
var totalarrn;
var totalpendingn;
var totalongoingn;
var totalcompleten;
var totallocationn;
var pre;
var Grouptotal;

function Search() {

    var FromDate = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
    var ToDate = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")

    var eDate = new Date(ToDate);

    var sDate = new Date(FromDate);
    var i = 0;
    if (FromDate != '' && ToDate != '' && sDate > eDate) {

        ShowMessage('warning', 'Information', "Start Date/Time should be greater than End Date/Time");

        return false;
    }
    else {
        Chart();

        if (totalrecdn > 0) {
            FfmChart();

        }
        if (totalrecdn == "") {
            ShowMessage("info", "", "No Data Found...");
        }
        if (totalarrn > 0) {
            ArrChart();
        }
        if (totalpendingn > 0) {
            PendingChart();
        }
        if (totalongoingn > 0) {
            OngoingChart();
        }

        if (totalcompleten > 0) {
            CompleteChart();
        }
        if (totallocationn > 0) {
            LocationChart();
        }

        //Grouptotal = totalrecdn + totalarrn + totalpendingn + totalongoingn + totalcompleten + totallocationn;


        //if (Grouptotal == 0) {
        //    ShowMessage("info", "", "No Data Found...");
        //}
    }
}



function FfmChartWindow(id, max) {
    $("#winFfmWindow").remove();
    $("body").append("<div id='winFfmWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winFfmWindow", "FFM RECEIVED");
    FfmChart(id, max);
}


function ArrChartWindow(id, max) {
    $("#winArrWindow").remove();
    $("body").append("<div id='winArrWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winArrWindow", "FFM ARRIVED");
    ArrChart(id, max);
}

function PendingChartWindow(id, max) {
    $("#winPendingWindow").remove();
    $("body").append("<div id='winPendingWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winPendingWindow", "PENDING SEGREGATION");
    PendingChart(id, max);
}


function OngoingChartWindow(id, max) {
    $("#winOngoingWindow").remove();
    $("body").append("<div id='winOngoingWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winOngoingWindow", "ONGOING SEGREGATION");
    OngoingChart(id, max);
}

function CompleteChartWindow(id, max) {
    $("#winCompleteWindow").remove();
    $("body").append("<div id='winCompleteWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winCompleteWindow", "COMPLETE SEGREGATION");
    CompleteChart(id, max);
}


function LocationChartWindow(id, max) {
    $("#winLocationWindow").remove();
    $("body").append("<div id='winLocationWindow'><div style='height:100%' id=" + id + "></div></div>");
    OpenKendowindow("winLocationWindow", "LOCATION");
    LocationChart(id, max);
}



function Chart() {

    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 1 : $("input:radio[name='Type']:checked").val();


    $.ajax({
        url: "Services/Report/ImpOperationService.svc/GetData",
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
            totalrecd = "Total Tonnage : " + dataTableobj.Table2[0].TTonnageRecd;
            totalarr = "Total Tonnage : " + dataTableobj.Table2[0].TTonnageArrived;
            totalpending = "Total Tonnage : " + dataTableobj.Table2[0].TPending;
            totalongoing = "Total Tonnage : " + dataTableobj.Table2[0].TOngoing;
            totalcomplete = "Total Tonnage : " + dataTableobj.Table2[0].TCompleted;
            totallocation = "Total Tonnage : " + dataTableobj.Table2[0].TLocation;


            totalrecdn = dataTableobj.Table2[0].TTonnageRecd;
            totalarrn = dataTableobj.Table2[0].TTonnageArrived;
            totalpendingn = dataTableobj.Table2[0].TPending;
            totalongoingn = dataTableobj.Table2[0].TOngoing;
            totalcompleten = dataTableobj.Table2[0].TCompleted;
            totallocationn = dataTableobj.Table2[0].TLocation;
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
        if (type == "4") {
            prefix = "AIRLINE WISE DETAIL";
            lb = "Airline";
        }
        else if (type == "2") {
            prefix = "ORIGIN WISE DETAIL";
            lb = "Origin";
        }
        else if (type == "3") {
            prefix = "SHC WISE DETAIL";
            lb = "SHC";
        }

        $.ajax({
            url: "Services/Report/ImpOperationService.svc/GetData",
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


                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:50%;' >Garuda Indonesia</td><td></td><td align=\"center\" style='width:50%;'><b>IMPORT PROCESS MONITORING <br/>" + prefix + " </b></td></tr><tr><td colspan='2' align='LEFT' nowarap>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";

                    str += "<tr ><td align='center'><b>Flight No</b></td><td align='center'><b>Flight Date</b></td><td align='center'><b>FFM DateTime</b></td><td align='center'><b>" + lb + "</b></td><td align='center'><b>Tonnage FFM Received</b> </td><td align='center'><b>Tonnage Arrived</b></td><td align='center'><b>Pending Segregation</b></td> <td align='center'><b>Ongoing Segregation</b></td><td align='center'><b>Segregation Complete</b></td><td align='center'><b>Pending Location</b></td></tr>"

                    for (var i = 0; i < dataTableobj.Table1.length; i++) {
                        str += "<tr><td>" + dataTableobj.Table1[i].FlightNo +
                            "</td><td>" + dataTableobj.Table1[i].FlightDate +
                            "</td><td>" + dataTableobj.Table1[i].FFMDate +
                           "</td><td>" + dataTableobj.Table1[i].Airline +
                            "</td><td>" + dataTableobj.Table1[i].TonnageRecd +
                            "</td><td>" + dataTableobj.Table1[i].TonnageArrived +
                            "</td><td>" + dataTableobj.Table1[i].Pending
                        + "</td><td>" + dataTableobj.Table1[i].Ongoing
                            + "</td><td>" + dataTableobj.Table1[i].Completed
                             + "</td><td>" + dataTableobj.Table1[i].Location
                            + "</td></tr>"
                    }

                    str += "<tr><td colspan='4'> <B>TOTAL</B></td><td><B>" + dataTableobj.Table2[0].TTonnageRecd + "</B></td><td><b>" + dataTableobj.Table2[0].TTonnageArrived + "</b></td><td><b>" + dataTableobj.Table2[0].TPending
                       + "</b></td><td><b>" + dataTableobj.Table2[0].TOngoing
                           + "</b></td><td><b>" + dataTableobj.Table2[0].TCompleted
                            + "</b></td><td><b>" + dataTableobj.Table2[0].TLocation
                           + "</b></td></tr>"


                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "IMPORT PROCESS MONITORING " + prefix;

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

    var type = $("input:radio[name='Type']:checked").val(); //== undefined ? 4 : $("input:radio[name='Type']:checked").val();
    if (cfi.IsValidSubmitSection()) {
        var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
        var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");


        var prefix = "";
        var lb = "";
        if (type == "4") {
            prefix = "AIRLINE WISE SUMMARY";
            lb = "Airline";
        }
        else if (type == "2") {
            prefix = "ORIGIN WISE SUMMARY";
            lb = "Origin";
        }
        else if (type == "3") {
            prefix = "SHC WISE SUMMARY";
            lb = "SHC";
        }

        $.ajax({
            url: "Services/Report/ImpOperationService.svc/GetData",
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


                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:50%;' >Garuda Indonesia</td><td></td><td align=\"center\" style='width:50%;'><b>IMPORT PROCESS MONITORING <br/>" + prefix + " </b></td></tr><tr><td colspan='2' align='LEFT' nowrap>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";

                    str += "<tr ><td align='center'><b>" + lb + "</b></td><td align='center'><b>Tonnage FFM Received</b> </td><td align='center'><b>Tonnage Arrived</b></td><td align='center'><b>Pending Segregation</b></td> <td align='center'><b>Ongoing Segregation</b></td><td align='center'><b>Segregation Complete</b></td><td align='center'><b>Pending Location</b></td></tr>"

                    for (var i = 0; i < dataTableobj.Table0.length; i++) {
                        str += "<tr><td>" + dataTableobj.Table0[i].Airline + "</td><td>" + dataTableobj.Table0[i].TonnageRecd + "</td><td>" + dataTableobj.Table0[i].TonnageArrived + "</td><td>" + dataTableobj.Table0[i].Pending
                        + "</td><td>" + dataTableobj.Table0[i].Ongoing
                            + "</td><td>" + dataTableobj.Table0[i].Completed
                             + "</td><td>" + dataTableobj.Table0[i].Location
                            + "</td></tr>"
                    }

                    str += "<tr><td> <B>TOTAL</B></td><td><B>" + dataTableobj.Table2[0].TTonnageRecd + "</B></td><td><b>" + dataTableobj.Table2[0].TTonnageArrived + "</b></td><td><b>" + dataTableobj.Table2[0].TPending
                       + "</b></td><td><b>" + dataTableobj.Table2[0].TOngoing
                           + "</b></td><td><b>" + dataTableobj.Table2[0].TCompleted
                            + "</b></td><td><b>" + dataTableobj.Table2[0].TLocation
                           + "</b></td></tr>"


                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "IMPORT PROCESS MONITORING " + prefix;

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


function FfmChart(id, max) {

    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 4 : $("input:radio[name='Type']:checked").val();



    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "FfmChart";

    $("#" + id).kendoChart({

        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    //url: "./Services/Report/OperationService.svc/GetSHCData/" + $("input[name='rdSHCExport']:checked").val() + "/" + start + "/" + end + "/" + userContext.CityCode + "/" + ($("#FlightNo").val() || "0"),
                    url: "./Services/Report/ImpOperationService.svc/GetFFMData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
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
            text: totalrecd

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
                 field: "TotalTonnageRecd",
                 categoryField: "AirlineName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}


function ArrChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 4 : $("input:radio[name='Type']:checked").val();

    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "ArrChart";
    $("#" + id).kendoChart({

        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "./Services/Report/ImpOperationService.svc/GetFFMData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
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
            text: totalarr
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
                 field: "TotalTonnageArrived",
                 categoryField: "AirlineName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}


function PendingChart(id, max) {

    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 4 : $("input:radio[name='Type']:checked").val();


    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "PendingChart";
    $("#" + id).kendoChart({

        dataSource: new kendo.data.DataSource({
            transport: {
                read: {

                    url: "./Services/Report/ImpOperationService.svc/GetFFMData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
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
            text: totalpending
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
                 field: "TotalPending",
                 categoryField: "AirlineName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}

function OngoingChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 4 : $("input:radio[name='Type']:checked").val();


    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "OngoingChart";
    $("#" + id).kendoChart({

        dataSource: new kendo.data.DataSource({
            transport: {
                read: {

                    url: "./Services/Report/ImpOperationService.svc/GetFFMData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
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
            text: totalongoing
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
                 field: "TotalOngoing",
                 categoryField: "AirlineName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}

function CompleteChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 4 : $("input:radio[name='Type']:checked").val();


    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "CompleteChart";
    $("#" + id).kendoChart({

        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "./Services/Report/ImpOperationService.svc/GetFFMData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,
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
            text: totalcomplete
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
                 field: "TotalCompleted",
                 categoryField: "AirlineName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
}

function LocationChart(id, max) {
    var start = kendo.toString($('#StartDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var end = kendo.toString($('#EndDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var type = $("input:radio[name='Type']:checked").val() == undefined ? 4 : $("input:radio[name='Type']:checked").val();

    if (!max) max = 250;
    if (typeof (id) == "object") id = null;
    if (!id) id = "LocationChart";
    $("#" + id).kendoChart({
        // $("#UWSDoneChart").kendoChart({
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {

                    url: "./Services/Report/ImpOperationService.svc/GetFFMData/" + start + "/" + end + "/" + userContext.CityCode + "/" + type,

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
            text: totallocation
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
                 field: "TotalLocation",
                 categoryField: "AirlineName",
             }

        ],
        tooltip: {
            visible: true,
            template: "#= category  #" + " - Tonnage: #= value  #"
        }


    });
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