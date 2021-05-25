$(function () {
    LoadImportFlightMonitoringDetails();
});
var FlightSNo;
var SlectedTd;
function LoadImportFlightMonitoringDetails() {
    _CURR_PRO_ = "ImportFlightMonitoringSearch";
    $.ajax({
        url: "Services/Report/ImportFlightMonitoringService.svc/GetWebForm/" + _CURR_PRO_ + "/Report/ImportFlightMonitoringSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html(result);
            $("#divContent").html(divContent);


            $("#__tblimportflightmonitoringsearch__ td:eq(0)").css("width", "80px")
            $("#__tblimportflightmonitoringsearch__ td:eq(0)").html("<input type='button'  rel='btnback' style='display:none;' class='btn btn btn-info' onclick='ShowMaingrid()' value='Back'/>");
            //$("#__tblimportflightmonitoringsearch__ td:last").css("width", "200px")
            //$("#__tblimportflightmonitoringsearch__ td:last").html("<input type=\"button\" rel='btnback' style='display:none;' onclick=\"GetFlightDataPart('C')\" title=\"Counter view\" value=\"Counter View\" class=\"completeprocess\" >&nbsp;<input type=\"button\" rel='btnback' style='display:none;' onclick=\"GetFlightDataPart('W')\"  title=\"Warehouse view\" value=\"Warehouse View\" class=\"incompleteprocess\" >");

            cfi.AutoComplete("searchFlightNo", "FlightNo", "vwExportFlightMonitoringFlightNo", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("SearchOrigin", "AirportName", "vwImportFlightMonitoringAirport", "AirportCode", "AirportName", ["AirportName"], null, "contains");
            cfi.AutoComplete("searchAirline", "AirlineName", "vwImportFlightMonitoringAirline", "CarrierCode", "AirlineName", ["AirlineName"], null, "contains");

            var d = new Date();
            d.setHours(d.getHours() - 3);
            //$('#searchFlightDate').kendoDateTimePicker({
            //    format: "dd-MMM-yyyy HH:mm",
            //    interval: 1,
            //    value: d
    
            //});

            $('#searchFlightDate').kendoDateTimePicker({
                format: "dd-MMM-yyyy HH:mm",
                timeFormat: "HH:mm",
                interval: 1,
                value:d
            });



            var d = new Date();
            d.setHours(d.getHours() + 12);
            $('#ToDate').kendoDateTimePicker({
                format: "dd-MMM-yyyy HH:mm",
                timeFormat: "HH:mm",
                interval: 1,
                value: d
            });
            ImportFlightMonitoringSearch();

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
                    ImportFlightMonitoringSearch();
                }
            });
            window.parent.$("#divSlider").trigger("click");
            setInterval(function () { ImportFlightMonitoringSearch() }, 300000);
            $("body").append("<style>.ui-widget-header{border-right: transparent;}</style>)");
        }
    });
}

function ImportFlightMonitoringSearch() {
    var SearchFlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val();;
    var FromDate = kendo.toString($('#searchFlightDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var SearchOrigin = $("#SearchOrigin").val() == "" ? "A~A" : $("#SearchOrigin").val();
    var SearchAirline = $("#searchAirline").val() == "" ? "A~A" : $("#searchAirline").val();

    cfi.ShowIndexView("divImportFlightMonitoringDetails", "Services/Report/ImportFlightMonitoringService.svc/GetGrid/" + _CURR_PRO_ + "/SearchRecord/SearchRecord/" + SearchFlightNo + "/" + FromDate + "/" + "/" + ToDate + "/" + SearchOrigin + "/" + SearchAirline);
}

function InstantiateSearchControl(cntrlId) {
    $("#Text_searchAirline").attr("placeholder", "Airline");
    $("#Text_SearchOrigin").attr("placeholder", "Origin");
    $("#Text_searchFlightNo").attr("placeholder", "Flight No.");
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_searchFlightNo") {

    }
}
function GetFlightData(sno, obj, type) {
    FlightSNo = sno;
    SlectedTd = obj;
    var FromDate = kendo.toString($('#searchFlightDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");
    var ToDate = kendo.toString($('#ToDate').data("kendoDateTimePicker").value(), "yyyy-MM-dd HH_mm tt");

    $.ajax({
        url: "Services/Report/ImportFlightMonitoringService.svc/GetNestedGrid/" + sno,
        async: true, type: "GET",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divNested").remove();
            $("#divContent").append("<div id='divNested'></div>");
            var tbl = "<table width='100%' class='WebFormTable'>";
            $tr = $(obj).closest("tr");

            tbl += "<tr><td class='formlabel'>Flight No</td><td class='formInputcolumn' style='width:20px;'>" + $tr.find("td[data-column='FlightNo']:eq(0)").text() + "</td><td class='formlabel'>Flight Date</td><td class='formInputcolumn' style='width:20px;'>" + $tr.find("td[data-column='FlightDate']").text().split('/')[0] + "</td><td class='formlabel'>ATA</td><td class='formInputcolumn' style='width:20px;'>" + $tr.find("td[data-column='FlightDate']").text().split('/')[1] + "</td></tr>";

            tbl += "<tr><td class='formlabel'>Airline</td><td class='formInputcolumn' style='width:20px;'>" + $tr.find("td[data-column='AirlineName']").text() + "</td><td class='formlabel'>Capacity</td><td class='formInputcolumn' style='width:20px;'>" + $tr.find("td[data-column='FlightCapacity']").text() + "</td><td class='formlabel'>FFM Weight/Pieces</td><td class='formInputcolumn' style='width:20px;'>" + $tr.find("td[data-column='FFMWT']").text() + " / " + $tr.find("td[data-column='FFMPc']").text() + "</td></tr>";

            tbl += "</tabel>";
            $("#divNested").append(tbl);
            $("#divNested").append(result);
            $("#divImportFlightMonitoringDetails").hide();
            $(".WebFormTable:eq(2) tr:eq(1)").css("vertical-align", "-webkit-baseline-middle");

            $(".WebFormTable:eq(2)").after("<iframe width='98%' height='270px' src='HtmlFiles/ImportFlightMonitoring/ImportFlightMonitoring.html?StartDate=" + FromDate + "&EndDate=" + ToDate + "&DailyFlightSno=" + sno + "'></iframe>");
            $("input[rel='btnback']").show();
        }
    });
}

function ShowMaingrid() {
    $("#divNested").remove();
    $("input[rel='btnback']").hide();
    $("#divImportFlightMonitoringDetails").show();
}
function addToolBar() {
    $("td[data-column='LocationPercent'],td[data-column='DLVSuccess'],td[data-column='NFDSuccess'],td[data-column='ARRSuccess'],td[data-column='RCFSuccess']").each(function (e) {
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
                else if (val >= 76 && val <= 90) {
                    $(this).find('.ui-widget-header').css({ 'background-color': 'GREEN' });
                    $(this).find(".progresslabel").css("color", "white");
                }
                else {
                    $(this).find('.ui-widget-header').css({ 'background-color': 'darkgreen' });
                    $(this).find(".progresslabel").css("color", "white");
                }
            }
        }).css("height", "20px");
    });
}

var divContent = "<div class='rows'><table style='width:100%'><tr><td valign='top' class='td100Padding'><div id='divImportFlightMonitoringDetails' style='width:100%'></div></td></tr></table></div><div id='test1'></div>";