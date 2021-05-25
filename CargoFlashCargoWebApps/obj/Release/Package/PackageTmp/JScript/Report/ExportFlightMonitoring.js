
$(function () {
    LoadExportFlightMonitoringDetails();
});
var FlightSNo;
var SlectedTd;
function LoadExportFlightMonitoringDetails() {
    _CURR_PRO_ = "ExportFlightMonitoringSearch";
    $.ajax({
        url: "Services/Report/ExportFlightMonitoringService.svc/GetWebForm/" + _CURR_PRO_ + "/Report/ExportFlightMonitoringSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html(result);
            $("#divContent").html(divContent);
            $("#__tblexportflightmonitoringsearch__ td:eq(0)").css("width", "80px")
            $("#__tblexportflightmonitoringsearch__ td:eq(0)").html("<input type='button'  rel='btnback' style='display:none;' class='btn btn btn-info' onclick='ShowMaingrid()' value='Back'/>");
            //$("#__tblexportflightmonitoringsearch__ td:last").css("width", "200px")
            //$("#__tblexportflightmonitoringsearch__ td:last").html("<input type=\"button\" rel='btnback' style='display:none;' onclick=\"GetFlightDataPart('C')\" title=\"Counter view\" value=\"Counter View\" class=\"completeprocess\" >&nbsp;<input type=\"button\" rel='btnback' style='display:none;' onclick=\"GetFlightDataPart('W')\"  title=\"Warehouse view\" value=\"Warehouse View\" class=\"incompleteprocess\" >");
            var d = new Date();
            d.setHours(d.getHours() - 3);
            $('#searchFlightDate').kendoDateTimePicker({
                format: "dd-MMM-yyyy HH:mm",
                timeFormat: "HH:mm",
                interval: 1,
                value: d
            });
            var d = new Date();
            d.setHours(d.getHours() + 12);
            $('#ToDate').kendoDateTimePicker({
                format: "dd-MMM-yyyy HH:mm",
                timeFormat: "HH:mm",
                interval: 1,
                value: d
            });
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vwExportFlightMonitoringFlightNo", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("searchDestination", "AirportName", "vwExportFlightMonitoringAirport", "AirportCode", "AirportName", ["AirportName"], null, "contains");
            cfi.AutoComplete("searchAirline", "AirlineName", "vwExportFlightMonitoringAirline", "CarrierCode", "AirlineName", ["AirlineName"], null, "contains");
            ExportFlightMonitoringSearch();
            $("#btnSearch").bind("click", function () {

                var FromDate = kendo.toString($('#searchFlightDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")
                var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd")

                var eDate = new Date(ToDate);

                var sDate = new Date(FromDate);


                if ($("#searchFlightDate").val() == "") {
                    ShowMessage('warning', 'Information', "Please Select From Date");
                    return;
                }
                else if ($("#ToDate").val() == "") {
                    ShowMessage('warning', 'Information', "Please Select To Date");
                    return;
                }

                else if (FromDate != '' && ToDate != '' && sDate > eDate) {

                    ShowMessage('warning', 'Information', "From Date/Time should be greater than To Date/Time");

                    return false;
                }
                else {
                    ShowMaingrid();
                    ExportFlightMonitoringSearch();
                }
            });
            window.parent.$("#divSlider").trigger("click");
            setInterval(function () { ExportFlightMonitoringSearch() }, 300000);
            $("body").append("<style>.ui-widget-header{border-right: transparent;}</style>")
        }
    });
}

function ExportFlightMonitoringSearch() {
    var SearchFlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val();
    var FromDate = kendo.toString($('#searchFlightDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var SearchDestination = $("#searchDestination").val() == "" ? "A~A" : $("#searchDestination").val();
    var SearchAirline = $("#searchAirline").val() == "" ? "A~A" : $("#searchAirline").val();

    cfi.ShowIndexView("divExportFlightMonitoringDetails", "Services/Report/ExportFlightMonitoringService.svc/GetGrid/" + _CURR_PRO_ + "/SearchRecord/SearchRecord/" + SearchFlightNo + "/" + FromDate + "/" + "/" + ToDate + "/" + SearchDestination + "/" + SearchAirline);
}

function InstantiateSearchControl(cntrlId) {
    $("#Text_searchAirline").attr("placeholder", "Airline");
    $("#Text_searchDestination").attr("placeholder", "Destination");
    $("#Text_searchFlightNo").attr("placeholder", "Flight No.");
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_searchFlightNo") {

    }
}

function addToolBar() {
    $("td[data-column='ActualBuildUpWeight'],td[data-column='FWB'],td[data-column='FOH'],td[data-column='RCS']").each(function (e) {
        $(this).find("div[rel='progressbar']").progressbar({
            value: parseInt($(this).find(".progresslabel").text().replace('%', '')),
            create: function (event, ui) {
                var val = $(event.target).attr("aria-valuenow");
                if (val >= 0 && val <= 25)
                    $(this).find('.ui-widget-header').css({ 'background-color': '#F24F4A' });
                else if (val >= 26 && val <= 50)
                    $(this).find('.ui-widget-header').css({ 'background-color': 'ORANGE' });
                else if (val >= 51 && val <= 75)
                    $(this).find('.ui-widget-header').css({ 'background-color': 'lightgreen' });
                else if (val >= 76 && val <= 90)
                    $(this).find('.ui-widget-header').css({ 'background-color': 'GREEN' });
                else {
                    $(this).find('.ui-widget-header').css({ 'background-color': 'darkgreen' });
                    $(this).find(".progresslabel").css("color", "white");
                }
            }
        }).css("height", "20px");;
    });

    $("td[data-column='FlightNo']").each(function (e) {
        $(this).find("div[rel='progressbar']").progressbar({
            value: parseInt($(this).find(".progresslabel").attr("data-rel")),
            create: function (event, ui) {
                var val = $(event.target).attr("aria-valuenow");
                if (val >= 0 && val <= 25)
                    $(this).find('.ui-widget-header').css({ 'background-color': '#F24F4A' });
                else if (val >= 26 && val <= 50)
                    $(this).find('.ui-widget-header').css({ 'background-color': 'ORANGE' });
                else if (val >= 51 && val <= 75)
                    $(this).find('.ui-widget-header').css({ 'background-color': 'lightgreen' });
                else if (val >= 76 && val <= 90)
                    $(this).find('.ui-widget-header').css({ 'background-color': 'GREEN' });
                else {
                    $(this).find('.ui-widget-header').css({ 'background-color': 'darkgreen' });
                    //  $(this).find(".progresslabel").css("color", "white");
                }
            }
        }).css("height", "20px");
    });
}

function GetFlightDataPart(type) {
    GetFlightData(FlightSNo, SlectedTd, type);
}

function GetFlightData(sno, obj, type) {
    FlightSNo = sno;
    SlectedTd = obj;

    var FromDate = kendo.toString($('#searchFlightDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    $.ajax({
        url: "Services/Report/ExportFlightMonitoringService.svc/GetNestedGrid/" + sno,
        async: true, type: "GET",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divNested").remove();
            $("#divContent").append("<div id='divNested'></div>");
            var tbl = "<table width='100%' class='WebFormTable'>";
            tbl += "<tr><td class='formlabel'>Flight No</td><td class='formInputcolumn' style='width:20px;'>" + $(obj).closest("tr").find("td[data-column='FlightNo']:eq(0)").text() + "</td><td class='formlabel'>Flight Date Time</td><td class='formInputcolumn' style='width:20px;'>" + $(obj).closest("tr").find("td[data-column='FlightDate']").text() + "</td><td class='formlabel'>ETD</td><td class='formInputcolumn' style='width:20px;'>" + $(obj).closest("tr").find("td[data-column='FlightDate']").text().split('/')[1] + "</td><td class='formlabel'>Destination</td><td class='formInputcolumn' style='width:20px;'>" + $(obj).closest("tr").find("td[data-column='DestinationAirportCode']").text() + "</td></tr>";

            tbl += "<tr><td class='formlabel'>Airline</td><td class='formInputcolumn' style='width:20px;'>" + $(obj).closest("tr").find("td[data-column='AirlineName']").text() + "</td><td class='formlabel'>Capacity</td><td class='formInputcolumn' style='width:20px;'>" + $(obj).closest("tr").find("td[data-column='GrossWeight']").text() + "</td><td class='formlabel'>LP Weight/Pieces</td><td class='formInputcolumn' style='width:20px;'>" + $(obj).closest("tr").find("td[data-column='LPWeight']").text() + "</td><td><td></tr>";

            tbl += "</tabel>";
            $("#divNested").append(tbl);
            $("#divNested").append(result);
            $("#divExportFlightMonitoringDetails").hide();
            $(".WebFormTable:eq(2) tr:eq(1)").css("vertical-align", "-webkit-baseline-middle");

            $(".WebFormTable:eq(2)").after("<iframe width='98%' height='270px' src='HtmlFiles/ExportFlightMonitoring/ExportFlightMonitoring.html?StartDate=" + FromDate + "&EndDate=" + ToDate + "&DailyFlightSno=" + sno + "'></iframe>");
            $("input[rel='btnback']").show();


        }
    });
}
function ShowMaingrid() {
    $("#divNested").remove();
    $("input[rel='btnback']").hide();
    $("#divExportFlightMonitoringDetails").show();
}


var divContent = "<div class='rows'><table style='width:100%'><tr><td valign='top' class='td100Padding'><div id='divExportFlightMonitoringDetails' style='width:100%'></div></td></tr></table></div><div id='test1'></div>";