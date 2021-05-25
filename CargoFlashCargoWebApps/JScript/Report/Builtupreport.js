$(document).ready(function () {

    cfi.AutoCompleteV2("Flightno", "FlightNo", "BuildUpReport_FlightNo", null, "contains");

    $("#DivBuiltUpReport").html("");
    $.ajax({
        url: 'HtmlFiles/Report/BuiltupReport.html',
        success: function (result) {
            $("#DivBuiltUpReport").html(result);

        }
    });

    $("<div  id=tblDivDetailsPop style=\"width:500px\"></div>").appendTo('body');
    $("<div  id=tblDivSummaryPop style=\"width:500px\"></div>").appendTo('body');


    $("#Search").click(function () {


        var FromDate = document.getElementById('fromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate == "" && FromDate == "" || sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
            return false;
        }

        BuiltUpReport();
    })





});



function BuiltUpReport() {

    var To_Date = $("#ToDate").val();
    var F_Date = $("#fromDate").val();
    var Flight_no = $("#Flightno").val()
    var tbl = "";
    var tbl1 = "";
    var tblecss = "border-collapse: collapse;border: 1px solid black;";

    $.ajax({
        url: "Services/Report/BuiltupreportService.svc/BuiltUpReport",
        async: false,
        type: "GET",
        dataType: "json",
        data: { ToDate: To_Date, FDate: F_Date, Flightno: Flight_no },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            tbl1 += '<tr><td align="center" style="border:1px solid #ccc">NO</td><td align="center" style="border:1px solid #ccc">Flight No</td>'
            tbl1 += '<td align="center" style="border:1px solid #ccc">Date</td>'
            tbl1 += '<td align="center" style="border:1px solid #ccc" colspan="2">Action</td>'
            tbl1 += '</tr>';

            if (FinalData.length > 0) {
                for (var i = 0; i < FinalData.length; i++) {
                    tbl += '<tr>'
                    tbl += '<td align="center" style="border:1px solid #ccc">' + (i + 1) + '</td>'
                    tbl += '<td align="center" style="border:1px solid #ccc"><span id="FlightNo-' + (i + 1) + '">' + FinalData[i].FlightNo + '</span></td>'
                    tbl += '<td align="center" style="border:1px solid #ccc"><span id="FlightDt-' + (i + 1) + '">' + FinalData[i].FlightDate + '</span></td>'
                    tbl += '<td align="center" style="border:1px solid #ccc;width:100px"><span><input type="button" value="Details" style="background-color: #4CAF50;text-align: center;color: white;" onclick="msgDetails(' + (i + 1) + ')"></span></td>'
                    tbl += '<td align="center" style="border:1px solid #ccc;width:100px"><span><input type="button" value="Summary" style="background-color: #008CBA;text-align: center;color: white;"  onclick="msgSummary(' + (i + 1) + ')"></span></td>'
                    tbl += '</tr>';
                }
            }
            $("#DivBuiltUpReport").attr("align", "center")
            $("#tblBindMainReport").html("")
            $("#tblBindMainReport").append(tbl1 + tbl)
            $(".prev").show()
            $(".next").show()
        },
        error: function (er) {
            debugger
        }
    });
    setTimeout(function () {
        Pagging()
    }, 500)
}
function msgDetails(GG) {


    var FlightNo = $("#FlightNo-" + GG).html()
    var FlightDt = $("#FlightDt-" + GG).html()
    GetDetails(FlightNo, FlightDt, "2")

}
function msgSummary(GG) {

    var FlightNo = $("#FlightNo-" + GG).html()
    var FlightDt = $("#FlightDt-" + GG).html()
    GetDetails(FlightNo, FlightDt, "1")



}

function GetDetails(FlightNo, FlightDt, Details) {

    var tbl = "", tbl1 = "", tbl0 = "";
    $("#tblDivSummaryPop").html("")
    $("#tblDivDetailsPop").html("")
    $.ajax({
        url: "Services/Report/BuiltupreportService.svc/BuiltUpReportDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: { Flightno: FlightNo, FlightDt: FlightDt },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var PriceSum = 0, GrossWeight = 0, ULDNO = 0, BULK = 0, tblh1 = "";
            if (FinalData.length > 0) {
                if (Details == "1") {

                    tbl1 += '<tr style="background-color: #2762af;color: white;font-size:14px"><td align="center" style="border:1px solid #ccc">NO</td><td align="center" style="border:1px solid #ccc">ULD NO</td>'
                    tbl1 += '<td align="center" style="border:1px solid #ccc">PCS</td>'
                    tbl1 += '<td align="center" style="border:1px solid #ccc">WEIGHT</td>'
                    tbl1 += '</tr>';

                    if (FinalData.length > 0) {
                        for (var i = 0; i < FinalData.length; i++) {
                            tbl += '<tr>'
                            tbl += '<td align="center" style="border:1px solid #ccc">' + (i + 1) + '</td>'
                            tbl += '<td align="center" style="border:1px solid #ccc"><span>' + FinalData[i].ULDNO + '</span></td>'
                            tbl += '<td align="center" style="border:1px solid #ccc"><span>' + FinalData[i].Pieces + '</span></td>'
                            tbl += '<td align="center" style="border:1px solid #ccc"><span>' + FinalData[i].GrossWeight + '</span></td>'
                            tbl += '</tr>';
                            PriceSum += parseInt(FinalData[i].Pieces == "" ? 0 : FinalData[i].Pieces)
                            GrossWeight += parseInt(FinalData[i].GrossWeight == "" ? 0 : FinalData[i].GrossWeight)

                            if (FinalData[i].ULDNO == "BULK") {
                                BULK += 1;
                            } else {
                                ULDNO += 1;
                            }
                        }

                        tblh1 += '<tr style="background-color: #2762af;color: white;font-size:14px"><td align="center" style="border:1px solid #ccc">Total</td><td align="center" style="border:1px solid #ccc">' + ULDNO + '/' + BULK + '</td>'
                        tblh1 += '<td align="center" style="border:1px solid #ccc">' + PriceSum + '</td>'
                        tblh1 += '<td align="center" style="border:1px solid #ccc">' + GrossWeight + '</td>'
                        tblh1 += '</tr>';

                        $("#tblDivDetailsPop").append('<center><table style="margin-bottom: 14px;border-collapse: collapse;width:400px">' + tbl1 + tbl + tblh1 + '</table></center>')
                        $("#tblDivDetailsPop").show();
                        cfi.PopUp("tblDivDetailsPop", "SUMMARY", "500", null, null, 10);
                    }

                } else if (Details == "2") {

                    if (FinalData.length > 0) {
                        for (var i = 0; i < FinalData.length; i++) {
                            tbl0 += '<table onclick="ExpanRow(' + (i + 1) + ')" style="margin-bottom: 14px;border-collapse: collapse;width:400px"><tr>'
                            tbl0 += '<td align="center" style="border:1px solid #ccc;background-color: #4CAF50;color: white;">ULD NO</td><td align="center" style="border:1px solid #ccc;width:100px"><input type="hidden" id="ULDNO-' + (i + 1) + '" value="' + FinalData[i].ULDSTOCKSno + '" />' + FinalData[i].ULDNO + '</td>'
                            tbl0 += '<td align="center" style="border:1px solid #ccc;background-color: #4CAF50;color: white;">FLIGHT NO / DATE</td>'
                            tbl0 += '<td align="center" style="border:1px solid #ccc"><span id="Filgtno-' + (i + 1) + '">' + FinalData[i].FlightNo + '//' + FinalData[i].FlightDate + '</span></td>'
                            tbl0 += '</tr>';
                            tbl0 += '<tr><td colspan="4"><div style="display:none" id="ExpanRow-' + (i + 1) + '"></div><td></tr></table>';


                        }

                        $("#tblDivSummaryPop").append('<center>' + tbl0 + '</center>')
                        $("#tblDivSummaryPop").show();
                        cfi.PopUp("tblDivSummaryPop", "DETAIL", "500", null, null, 10);

                    }
                }
            } else {

                ShowMessage('info', '', "NO RECORD FOUND!", "bottom-right");
                return
            }
        },
        error: function (er) {
            debugger
        }
    });
}

function Pagging() {

    var maxRows = 10;
    $('.paginated-table').each(function () {
        var cTable = $(this);
        var cRows = cTable.find('tr:gt(0)');
        var cRowCount = cRows.size();

        if (cRowCount < maxRows) {
            return;
        }

        cRows.each(function (i) {
            $(this).find('td:first').text(function (j, val) {
                //  return (i + 1) + " - " + val;
            });
        });

        cRows.filter(':gt(' + (maxRows - 1) + ')').hide();


        var cPrev = cTable.siblings('.prev');
        var cNext = cTable.siblings('.next');

        cPrev.addClass('disabled');

        cPrev.click(function () {
            var cFirstVisible = cRows.index(cRows.filter(':visible'));

            if (cPrev.hasClass('disabled')) {
                return false;
            }

            cRows.hide();
            if (cFirstVisible - maxRows - 1 > 0) {
                cRows.filter(':lt(' + cFirstVisible + '):gt(' + (cFirstVisible - maxRows - 1) + ')').show();
            } else {
                cRows.filter(':lt(' + cFirstVisible + ')').show();
            }

            if (cFirstVisible - maxRows <= 0) {
                cPrev.addClass('disabled');
            }

            cNext.removeClass('disabled');

            return false;
        });

        cNext.click(function () {
            var cFirstVisible = cRows.index(cRows.filter(':visible'));

            if (cNext.hasClass('disabled')) {
                return false;
            }

            cRows.hide();
            cRows.filter(':lt(' + (cFirstVisible + 2 * maxRows) + '):gt(' + (cFirstVisible + maxRows - 1) + ')').show();

            if (cFirstVisible + 2 * maxRows >= cRows.size()) {
                cNext.addClass('disabled');
            }

            cPrev.removeClass('disabled');

            return false;
        });

    });

}
function ExpanRow(id) {

    $("#ExpanRow-" + id).slideToggle("slow");
    var ULDNO = $("#ULDNO-" + id).val()
    var Filgtno = $("#Filgtno-" + id).html()
    var vSpilt = Filgtno.split("//")
    SummeryDetails(ULDNO, id, vSpilt[0], vSpilt[1])
}
function SummeryDetails(ULDNO, id, FlightNo, FlightDt) {

    var tbl = "";
    var tbl1 = "";
    var tblecss = "border-collapse: collapse;border: 1px solid black;";
    $("#ExpanRow-" + id).html("")
    $.ajax({
        url: "Services/Report/BuiltupreportService.svc/SummeryDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: { Flightno: FlightNo, FlightDt: FlightDt, ULDNO: ULDNO },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var PriceSum = 0, GrossWeight = 0, AWB = 0, BULK = 0, tblh1 = "";
            tbl1 += '<tr style="background-color: #2762af;color: white;font-size:14px"><td align="center" style="border:1px solid #ccc">NO</td><td align="center" style="border:1px solid #ccc">AWB NO</td>'
            tbl1 += '<td align="center" style="border:1px solid #ccc">PCS</td>'
            tbl1 += '<td align="center" style="border:1px solid #ccc">WEIGHT</td>'
            tbl1 += '</tr>';

            if (FinalData.length > 0) {
                for (var i = 0; i < FinalData.length; i++) {
                    tbl += '<tr>'
                    tbl += '<td align="center" style="border:1px solid #ccc">' + (i + 1) + '</td>'
                    tbl += '<td align="center" style="border:1px solid #ccc"><span>' + FinalData[i].Awbno + '</span></td>'
                    tbl += '<td align="center" style="border:1px solid #ccc"><span>' + FinalData[i].Pieces + '</span></td>'
                    tbl += '<td align="center" style="border:1px solid #ccc"><span>' + FinalData[i].GrossWeight + '</span></td>'
                    tbl += '</tr>';
                    PriceSum += parseInt(FinalData[i].Pieces == "" ? 0 : FinalData[i].Pieces)
                    GrossWeight += parseInt(FinalData[i].GrossWeight == "" ? 0 : FinalData[i].GrossWeight)

                    AWB += 1;

                }
                tblh1 += '<tr style="background-color: #2762af;color: white;font-size:14px"><td align="center" style="border:1px solid #ccc">Total</td><td align="center" style="border:1px solid #ccc">' + AWB + '</td>'
                tblh1 += '<td align="center" style="border:1px solid #ccc">' + PriceSum + '</td>'
                tblh1 += '<td align="center" style="border:1px solid #ccc">' + GrossWeight + '</td>'
                tblh1 += '</tr>';
                $("#ExpanRow-" + id).append('<center><table style="margin-bottom: 14px;border-collapse: collapse;width:400px">' + tbl1 + tbl + tblh1 + '</table></center>')

            }
        },
        error: function (er) {
            debugger
        }
    });

}

function ExtraCondition(textId) {


    //if (textId.indexOf("Flightno") >= 0) {
    //    var FromDateFilter = cfi.getFilter("AND");
    //    var ToDateFilter = cfi.getFilter("AND");
    //    var FromDate = $("#fromDate").val() == "From Date" ? $("#ToDate").val() : $("#fromDate").val();
    //    cfi.setFilter(FromDateFilter, "FlightDate", "eq", FromDate);
    //    cfi.setFilter(ToDateFilter, "FlightDate", "eq", $("#ToDate").val());
    //    FlightFromToDateFilter = cfi.autoCompleteFilter(FromDateFilter);
    //    FlightFromToDateFilter = cfi.autoCompleteFilter(ToDateFilter);

    //    return FlightFromToDateFilter;

    //}

}