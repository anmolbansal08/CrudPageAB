$(function () {
    MasterIrregularityFlightReport();
});

var paymentList = null;
var currentprocess = "";
var currentawbsno = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var DGRSPHC = [];
var ItenaryArray = [];
var FlightDateForGetRate = '';
var FlightNoForGetRate = '';
var isSaveAndNext = '';
var TactArray = [];



function MasterIrregularityFlightReport() {
    _CURR_PRO_ = "IrregularityFlightReport";
    _CURR_OP_ = "Irregularity";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divIrregularityFlightReportDetails").html("");
    $.ajax({
        url: "Services/Irregularity/IrregularityFlightReportService.svc/GetWebForm/" + _CURR_PRO_ + "/Irregularity/IrregularityFlightReportSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html(result);
            $("#divContent").html(divContent);
            $('#__tblirregularityflightreportsearch__ tr:eq(0) td:eq(5) span').width("180px");
            $("#__divIrregularityFlightReportDetails__ table:first").find("tr>td:first").text("Irregularity Report");
            //$('#__tblirregularityflightreportearch__ tr:eq(0) td:eq(7)').width("");
            cfi.AutoCompleteV2("FlightNo", "FlightNo,SNo", "FlightReport_FlightNo", null, "contains");
            var MnWeather = [{ Key: "1", Text: "SUNNY" }, { Key: "2", Text: "CLOUDY" }, { Key: "3", Text: "MISTY" }, { Key: "4", Text: "RAINY" }, { Key: "5", Text: "HEAVY RAIN" }];
            cfi.AutoCompleteByDataSource("Weather", MnWeather);
            var MnDamage = [{ Key: "HOLED", Text: "HOLED" }, { Key: "BROKEN", Text: "BROKEN" }, { Key: "DENTED", Text: "DENTED" }, { Key: "OTHERS", Text: "OTHERS" }, { Key: "UNKNOWN", Text: "UNKNOWN" }];
            cfi.AutoCompleteByDataSource("DamageType", MnDamage, null, ',');
            $('#Text_Weather').closest('span').width(180);
            $('#Text_DamageType').closest('span').width(250);

            $("#btnSearch").on("click", function () {
                if ($("#FlightDate").attr("sqldatevalue") && $('#FlightNo').val()) {
                    BindAppendGrid($('#FlightNo').val());
                }
            });
        }
    });
}

function BindAppendGrid(DailyFlightSNo) {
    $('#divIrregularityFlightReportDetails').empty();
    $("#divIrregularityFlightReportDetails").append("<table id='tblIrregularityFlightReportAppendGrid' style='width:100%'></table>");

    $("#tblIrregularityFlightReportAppendGrid").appendGrid({
        tableID: "tblIrregularityFlightReportAppendGrid",
        //contentEditable: pageType,
        isGetRecord: true,
        tableColume: "SNo,AWBNo,Commodity,TotalPieces,TotalGrossWeight,Irrpieces,IrrWeight,Description,Action",
        masterTableSNo: DailyFlightSNo,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: "./Services/Irregularity/IrregularityFlightReportService.svc",
        getRecordServiceMethod: "GetIrregularityFlightReportRecord",
        caption: "Irregularity Flight Report",
        initRows: 1,
        columns: [{ name: "SNo", type: "hidden", value: 0 },
                 { name: "AWBNo", display: "AWB No.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 { name: "Commodity", display: "Commodity", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 { name: "TotalPieces", display: "Total Pcs. as per AWB", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 { name: "TotalGrossWeight", display: "Total Wt. as per AWB", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 { name: "Irrpieces", display: "Pcs. of IRREG", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 { name: "IrrWeight", display: "Wt. of IRREG", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 { name: "Description", display: "Desc.", type: "label", ctrlCss: { width: "60px" }, value: 0 },
                 { name: "Action", display: "Action", type: "label", ctrlCss: { width: "60px" }, value: 0 }

                 //{ name: "IncidentCategory", display: "Incident Cat.", type: "label", ctrlCss: { width: "60px" }, value: 0 },
                 //{ name: "ReportingStation", display: "Reporting St.", type: "label", ctrlCss: { width: "100px" }, value: 0 },
                 //{ name: "IrregularityStatus", display: "Irregularity Status", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "UpdatedUser", display: "Updated By", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "CreatedUser", display: "Created By", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "FlightNo", display: "Flt.No.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "FlightDate", display: "Flt.Dt.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "OriginAirportCode", display: "Org. Airport Code", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "DestinationAirportCode", display: "Dest. Airport Code", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "TotalPieces", display: "Irr. Pcs.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
                 //{ name: "TotalGrossWeight", display: "Irr. Gr.Wt.", type: "label", ctrlCss: { width: "242px" }, value: 0 }
        ],
        isPaging: true,
        hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true }
    });
    $("#divIrregularityFlightReportDetails").append("<div id='divIrregularityFlightReport' style='width:100%'><table id='tblIrregularityFlightReportPrint' style='width:100%'></table></div>");

    $.ajax({
        url: "HtmlFiles/CargoIrregularityReport/IrregularityFlightReport.html",
        async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblIrregularityFlightReportPrint").html(result);
            GetPrintData(DailyFlightSNo);
            $('#spnWeather').text($('#Text_Weather').val());
            $('#spnDamageType').text($('#DamageType').val());
            $("#spnSigned").text(userContext.FirstName);
            $("#spnFunction").text(userContext.GroupName);
            $("#spnSignature").text(userContext.FirstName);
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var inventoryDate = new Date();
            var CurrentDate = inventoryDate.getUTCDate() + "-" + (monthNames[inventoryDate.getUTCMonth()]) + "-" + inventoryDate.getUTCFullYear();
            $('#DateofIssue').text(CurrentDate);
            $('#Printdiv').after('<table id="PrintPage" style="width: 70%;margin-left: 15%;margin-right: 15%;background-color: white;"><tr style="text-align:center;background-color:white;padding-bottom:20px" id="trPrint"><td><div style="align-content:center;"><input type="button" id="btnCDRPrint" value="Print" /></div></td></tr></table>');
            $('#btnCDRPrint').on('click', function () {
                PrintElem('#Printdiv');
            })

        }
    });
}

function GetPrintData(DailyFlightSNo) {
    $.ajax({
        url: "Services/Irregularity/IrregularityFlightReportService.svc/GetPrintData?DailyFlightSNo=" + DailyFlightSNo,
        dataType: "json",
        success: function (result) {
            var Table = jQuery.parseJSON(result).Table0;

            if (Table[0]) {
                if (Table.length > 0) {
                    for (var i = 0; i < Table.length; i++) {
                        $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span>' + (i + 1) + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].AWBno + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].Commodity + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].TotalPieces + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].TotalGrossWeight + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].Irrpieces + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].IrrWeight + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].Description + '</span></td><td style="border:1px solid black;text-align:center"><span>' + Table[i].Action + '</span></td> </tr>');
                    }
                }
                $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td>');
                $('#spnFlight').text(Table[0].FlightDateNo);
                $('#spnRouting').text(Table[0].Routing);
            }
            else {
                $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td>');
            }
        }
    });
}

function PrintElem(elem) {
    Popup($(elem).html());
}

function Popup(data) {
    var mywindow = window.open('', '', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}

function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("table[cfi-aria-search='search']").find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
}


function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_FlightNo") {
        try {
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#FlightDate").attr("sqldatevalue"))
            cfi.setFilter(filterEmbargo, "DestinationAirportCode", "eq", userContext.AirportCode)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
}

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divIrregularityFlightReportDetails' style='width:100%'></div></td></tr></table></div>";