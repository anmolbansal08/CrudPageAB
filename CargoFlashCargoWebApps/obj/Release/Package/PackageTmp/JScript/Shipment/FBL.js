$(function () {
    LoadFBLDetails();


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


var _IS_DEPEND = false;
function LoadFBLDetails() {
    _CURR_PRO_ = "FBL";
    //  _CURR_OP_ = "Master Acceptance";
    //$("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Shipment/FBLService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FBLSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            //$("#divFooter").html(fotter).show();

            cfi.AutoComplete("searchOriginCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchDestinationCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vDailyFlightFBL", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("searchAWBPrefix", "AWBPrefix", "Awb", "AWBPrefix", "AWBPrefix", ["AWBPrefix"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNumber", "Awb", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
            $("#__tblfblsearch__ tr").append("<td><button class='btn btn-block btn-primary' style='width:90px; height:26px' id='btnInitiateFBR' onclick=FBR();>Initiate FBR</button></td>");
            $("#__tblfblsearch__ tbody").append("<div id='divInitiateFBR'></div>")
            $('#searchFlightDate').data("kendoDatePicker").value("");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ShipmentSearch();
            });
            //$("#btnNew").unbind("click").bind("click", function () {
            //    CleanUI();
            //    $("#hdnAWBSNo").val("");


            //    currentawbsno = 0;
            //    var module = "Shipment";
            //    if (_CURR_PRO_ == "HOUSE") {
            //        module = "House";
            //    }
            //    $.ajax({
            //        url: "Services/Shipment/AcceptanceService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/RESERVATION/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            //        success: function (result) {
            //            $("#divNewBooking").html(result);
            //            if (result != undefined || result != "") {
            //                InitializePage("RESERVATION", "divNewBooking");
            //                currentprocess = "RESERVATION";

            //                $("#tblShipmentInfo").hide();
            //                GetProcessSequence("ACCEPTANCE");
            //            }
            //        }
            //    });

            //});
        }
    });
}

function FBR() {
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    CleanUI();
    _CURR_PRO_ = "FBL";
    $.ajax({
        url: "Services/Shipment/FBLService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FBLInitiateFBR/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divInitiateFBR").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            //cfi.AutoComplete("searchOriginCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            //cfi.AutoComplete("searchDestinationCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchFlightNo1", "FlightNo,SNo", "vDailyFlightInitiateFBR", "SNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("AirlineName1", "AirlineName,SNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");
            //$('#searchFlightDate1').data("kendoDatePicker").value(Date());
            //$("#searchFlightDate1").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
            $("#__tblfblinitiatefbr__").find("button").hide();
            $("#__tblfblinitiatefbr__ tr").append("<td><button class='btn btn-block btn-primary' style='width:90px; height:26px' id='btnSendInitiateFBR'>SEND</button></td>");
            $("#__tblfblinitiatefbr__").find('input[id^=Text_AirlineName1]').closest("span").css("width", "130px");
            $("#__tblfblinitiatefbr__").find('input[id^=Text_searchFlightNo1]').closest("span").css("width", "130px");
            $("#__tblfblinitiatefbr__").find('button[id^=btnSearch]').text('Send');
            $("#__divfblinitiatefbr__").find('table:nth-child(1)').hide();
            $("#btnSendInitiateFBR").unbind("click").bind("click", function () {
                if ($("#Text_AirlineName1").val() == "" || $("#searchFlightDate1").val() == "Flight Date" || $("#Text_searchFlightNo1").val() == "") {
                    if ($("#Text_AirlineName1").val() == "" && $("#Text_searchFlightNo1").val() == "") {
                        ShowMessage('info', 'WARNING!', "Kindly provide Airline Name and Flight Number.", "bottom-right");
                        return false;
                    }
                    if ($("#Text_AirlineName1").val() == "") {
                        ShowMessage('info', 'WARNING!', "Kindly provide Airline Name.", "bottom-right");
                        return false;
                    }
                    if ($("#Text_searchFlightNo1").val() == "") {
                        ShowMessage('info', 'WARNING!', "Kindly provide Flight Number.", "bottom-right");
                        return false;
                    }

                    if ($("#searchFlightDate1").val() == "Flight Date") {
                        $("#Text_searchFlightNo1").val("");
                        ShowMessage('info', 'WARNING!', "Kindly provide Flight Number.", "bottom-right");
                        return false;
                    }
                }
                //else {
                var DailyFlightSNo = $("#searchFlightNo1").val();
                $.ajax({
                    type: "GET",
                    url: "Services/Shipment/FBLService.svc/InitiateFBR?DailyFlightSNo=" + DailyFlightSNo,
                    dataType: "html",
                    success: function (response) {
                        //ShowMessage('success', 'Success', "FBR Initiated Successfully", "bottom-right");
                        //$("#divInitiateFBR").fadeOut(3000);
                        CallMessageBox('success', 'Success', 'FBR Initiated Successfully', undefined, undefined, 50000, undefined);
                        //$("#divInitiateFBR").fadeOut(3000);
                        //(msgType, title, msg, position, fadeInTime, fadeOutTime, timeout)
                    },
                    error: function (er) {
                        debugger
                    }
                });


                // }
            });
        }
    });



    cfi.PopUp("divInitiateFBR", "FBR", 700, null, null, 80);
    //$("div[id^=__divfblinitiatefbr__] table[id^=__tblfblinitiatefbr__] tbody td:nth-last-child(2)").css('width', '50px')


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


function onDataBound(arg) {

    var grid = $("#" + arg.sender.element[0].id + "").data("kendoGrid");
    var gridData = grid.dataSource.view();
    var DailyFlightSNo = '';
    for (var i = 0; i < gridData.length; i++) {
        var currentUid = gridData[i].uid;
        var currenRow = grid.table.find("tr[data-uid='" + currentUid + "']");
        DailyFlightSNo = DailyFlightSNo + "," + gridData[i].DailyFlightSNo;

    }
    //
    //DailyFlightSNo.substr();
    BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

}
function onChange(arg) {
    //
    if (_CURR_PRO_ == "ACCEPTANCE") {

    }

}
function ShipmentSearch() {
    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val();
    var FlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    // Temporary Set values
    //FlightDate = "2015-10-15";

    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CityCode;
    cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FBLService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/FBLGRID/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity);
}
function checkProgrss(item, subprocess, displaycaption) {
    ////dependentprocess
    ////BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

    //if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
    //    return "\"dependentprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
    //    return "\"dependentprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
    //    return "\"partialprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
    //    return "\"completeprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
    //    return "\"partialprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1" + ",") >= 0) {
    //    return "\"completeprocess\"";
    //}
    //else if (item.toUpperCase().indexOf("," + subprocess.toUpperCase() + ",") >= 0) {
    //    return "\"completeprocess\"";
    //}
    //else {
    return "\"incompleteprocess\"";
    // }
}
function CleanUI() {
    $("#divXRAY").hide();
    $("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");

    $("#divXRAY").hide();

    $("#ulTab").hide();
    $("#divDetail_SPHC").html("");
    $("#divDetailSHC").html("");

    $("#divTab3").html("");
    $("#divTab4").html("");
    $("#divTab5").html("");
    $("#tabstrip").hide();
}
function BindEvents(obj, e, isdblclick) {

    $("#divDetail").html('');
    //$("#divDetailSHC").html('');
    //$("#divTab3").html('');
    //$("#divTab4").html('');
    //$("#divTab5").html('');
    //$("#divXRAY").hide();
    //$("#tabstrip").show();
    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        $("#divTab3").html("");
        $("#divTab4").html("");
        $("#divTab5").html("");
        $("#tabstrip").hide();
        ResetDetails();
    });
    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var awbNoIndex = 0;
    var awbSNoIndex = 0;
    var awbDateIndex = 0;
    var pcsIndex = 0;
    var chwtIndex = 0;
    var originIndex = 0;
    var destIndex = 0;
    var flightNoIndex = 0;
    var flightDateIndex = 0;
    var commodityIndex = 0;
    var accpcsindex = 0;
    var accgrwtindex = 0;
    var accvolwtindex = 0;

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
    originIndex = trLocked.find("th[data-field='Origin']").index();
    destIndex = trLocked.find("th[data-field='Destination']").index();
    awborigin = originIndex;
    awbSNoIndex = 0;
    awbDateIndex = trRow.find("th[data-field='AWBDate']").index();
    pcsIndex = trRow.find("th[data-field='Pcs']").index();
    chwtIndex = trRow.find("th[data-field='ChWt']").index();
    flightNoIndex = trRow.find("th[data-field='FlightNo']").index();
    flightDateIndex = trRow.find("th[data-field='FlightDate']").index();
    commodityIndex = trRow.find("th[data-field='CommodityCode']").index();
    accpcsindex = trRow.find("th[data-field='AccPcs']").index();
    accgrwtindex = trRow.find("th[data-field='AccGrWt']").index();
    accvolwtindex = trRow.find("th[data-field='AccVolWt']").index();

    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();


    var FBLWtIndex = 0;
    var FWBWtIndex = 0;
    var RCSWtIndex = 0;
    FBLWtIndex = trRow.find("th[data-field='FBLWt']").index();
    FWBWtIndex = trRow.find("th[data-field='FWBWt']").index();
    RCSWtIndex = trRow.find("th[data-field='RCSWt']").index();
    $("#tdFBLwt").text(closestTr.find("td:eq(" + FBLWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FBLWtIndex + ")").text());
    $("#tdFWBwt").text(closestTr.find("td:eq(" + FWBWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FWBWtIndex + ")").text());
    $("#tdRCSwt").text(closestTr.find("td:eq(" + RCSWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + RCSWtIndex + ")").text());

    $("#tdAWBNo").text(closestTr.find("td:eq(" + awbNoIndex + ")").text());
    $("#tdOD").text(closestTr.find("td:eq(" + originIndex + ")").text() + " - " + closestTr.find("td:eq(" + destIndex + ")").text());

    $("#hdnAWBSNo").val(currentawbsno);
    $("#hdnAccPcs").val(accpcs);
    $("#hdnAccGrWt").val(accgrwt);
    $("#hdnAccVolWt").val(accvolwt);

    $("#tdAWBDate").text(closestTr.find("td:eq(" + awbDateIndex + ")").text());
    $("#tdFlightNo").text(closestTr.find("td:eq(" + flightNoIndex + ")").text());
    $("#tdFlightDate").text(closestTr.find("td:eq(" + flightDateIndex + ")").text() == "null" ? "" : closestTr.find("td:eq(" + flightDateIndex + ")").text());
    $("#tdCommodity").text(closestTr.find("td:eq(" + commodityIndex + ")").text());
    $("#tdPcs").text(closestTr.find("td:eq(" + pcsIndex + ")").text());
    $("#tdChWt").text(closestTr.find("td:eq(" + chwtIndex + ")").text());

    awbNoIndex = trRow.find("th[data-field='AWBNo']").index();
    ShowProcessDetails(subprocess, isdblclick);
    //$("#tabstrip").kendoTabStrip();
}
function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");

    $("#divDetailSHC").html("");
    $("#divTab3").html("");
    $("#divTab4").html("");
    $("#divTab5").html("");
    $('#tabstrip ul:first li:eq(0) a').hide();
    $('#tabstrip ul:first li:eq(1) a').hide();
    $('#tabstrip ul:first li:eq(2) a').hide();
    $('#tabstrip ul:first li:eq(3) a').hide();
    $('#tabstrip ul:first li:eq(4) a').hide();

}
function InstantiateControl(containerId) {

    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
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
    $("#" + containerId).find("textarea").each(function () {
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
    $("#" + containerId).find("span").each(function () {
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
    SetDateRangeValue();

    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });
    $("input[name='operation']").click(function () {
        _callBack();
    });
    $("[id$='divRemoveRecord']").hide();
    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            StopProgress();
            return true;
        }
        else {
            return false
        }
    });
    _callBack = function () {
        if ($.isFunction(window.MakeTransDetailsData)) {
            return MakeTransDetailsData();
        }
    }

    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }
    $(".removepopup").click(function () {
        $("#divRemovePanel").show();
        cfi.PopUp("divRemoveRecord", "");
    });
    $(".cancelpopup").click(function () {
        $("#divRemovePanel").hide();
        cfi.ClosePopUp("divRemoveRecord");
    });
    $("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
        var transid = this.id.replace("divareaTrans_", "");
        cfi.makeTrans(transid, null, null, null, null, null, null);
    });
}
function InitializePage(subprocess, cntrlid, isdblclick) {
    $("#tblShipmentInfo").show();
    InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "FBL") {
        BindFBLSection();
        //$("#btnSave").unbind("click").bind("click", function () {
        //    if (cfi.IsValidSection(cntrlid)) {
        //        if (SaveFormData(subprocess)) {
        //            ShipmentSearch();
        //        }

        //    } else {
        //        return false;
        //    }
        //});
        //$("#btnSaveToNext").unbind("click").bind("click", function () {
        //    if (cfi.IsValidSection(cntrlid)) {
        //        if (SaveFormData(subprocess)) {
        //            $("#divDetailSHC").html("");
        //            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
        //            ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
        //        }

        //    } else {
        //        return false;
        //    }

        //});
        //// Disable Save & Next button tempor..
        //$("#btnSaveToNext").unbind("click");
        //return false;
    }

}
function ShowProcessDetails(subprocess, isdblclick) {
    if (subprocess.toUpperCase() == "FBL") {
        $.ajax({
            url: "Services/Shipment/FBLService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/Read/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    InitializePage(subprocess, "divDetail", isdblclick);
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function BindFBLSection() {
    //$("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
    //    cfi.PopUp("divareaTrans_shipment_fblshipmentclasssphc", "SPHC");
    //});
    $("a[id^='ahref_DIMS']").unbind("click").bind("click", function () {

        var DIMSawbSNo = (currentawbsno == "" ? 0 : currentawbsno);
        GetDIMSInfo(DIMSawbSNo);
    })
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $.ajax({
        url: "Services/Shipment/FBLService.svc/GetFBLInformation?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            var sphcArray = fblData.Table2;
            var itenData = fblData.Table1;
            var sphcArray2 = fblData.Table3;

            if (resData.length > 0) {
                var resItem = resData[0];
                //$("span[id='Commodity']").text(resItem.CommodityCode);
                $("span[id='Pieces']").text(resItem.Pieces + "/ " + resItem.TotalPartPieces);
                //$("span[id='TotalPartPieces']").text("/ " + resItem.TotalPartPieces);
                $("span[id='GrossWt']").text(resItem.GrossWeight);
                $("span[id='ChargeableWt']").text(resItem.ChargeableWeight);
                $("span[id='CBM']").text(resItem.CBM);
                $("span[id='VolumeWt']").html(parseFloat(resItem.VolumeWeight).toFixed(3));
                //$("span[id='VolumeWt']").html(parseFloat(resItem.VolumeWeight).toFixed(3));
                $("span[id='AWBNo']").text(resItem.AWBNo);
                $("span[id='AWBDate']").text(resItem.AWBDate);
                //$("span[id='Product']").text(resItem.ProductName);
                $("span[id='IssuingAgent']").text(resItem.AgentName);
                $("span[id='ShipmentOrigin']").text(resItem.OriginCityName);
                $("span[id='ShipmentDestination']").text(resItem.DestinationCityName);
                //$("span[id='NoofHouse']").text(resItem.NoOfHouse);
                $("span[id='FlightDate']").text(resItem.FlightDate);
                $("span[id='NatureofGoods']").text(resItem.NatureOfGoods);
                //$("span[id='X-RayRequired']").text(resItem.XRayRequired);
                $("span[id='MovementPriority']").text(resItem.Movement_Priority_Code);
                $("span[id='Aircraft_Registration']").text(resItem.Aircraft_Registration);
                $("span[id='SpecialServiceRequest1']").text(resItem.SpecialServiceRequest1);
                $("span[id='SpecialServiceRequest2']").text(resItem.SpecialServiceRequest2);
                $("span[id='OSI1']").text(resItem.OSI1);
                $("span[id='OSI2']").text(resItem.OSI2);
                //$("span[id='OSI2']").text(resItem.OSI2);
                $("span[id='SpecialHandlingCode']").text(resItem.SHC);
                $("span[id='ULD']").text(resItem.ULD);
                //$("#X-RayRequired[value='" + resItem.XRayRequired + "']").prop('checked', true);
                //$("#FreightType[value='" + resItem.FreightType + "']").prop('checked', true);


                //$('#AWBDate').parent().css('width', '100px');

                //if (resItem.IsBup == "False") {
                //    $("span[id='chkisBup']").text('Yes');
                //} else {
                //    $("span[id='chkisBup']").text('No');
                //}
                //$("span[id='buptype']").text(resItem.BupType);
                $("span[id='densitygroup']").text(resItem.DensityGroupName);
                //$("#Text_buptype").data("kendoAutoComplete").setDefaultValue(resItem.BupTypeSNo, resItem.BupType);
                //$("#Text_densitygroup").data("kendoAutoComplete").setDefaultValue(resItem.DensityGroupSNo, resItem.DensityGroupName);


                bkdgrwt = resItem.GrossWeight;
                bkdvolwt = resItem.CBM;
                bkdpcs = resItem.Pieces;

                //if (sphcArray2.length > 0) {
                //    if (sphcArray2[0].sphcsno != "0" && sphcArray2[0].sphcsno != "") {
                //        cfi.BindMultiValue("SpecialHandlingCode", sphcArray2[0].text_specialhandlingcode, sphcArray2[0].sphcsno)
                //        $("#SpecialHandlingCode").val(sphcArray2[0].sphcsno);
                //    }
                //}

            }

            cfi.makeTrans("shipment_fblshipmentclasssphc", null, null, null, null, null, sphcArray);
            // cfi.makeTrans("shipment_shipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, sphcArray, 8);
            //$("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id='areaTrans_shipment_shipmentclasssphc']").each(function () {
            //    $(this).find("input[id^='SPHC']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
            //    });
            //    $(this).find("input[id^='Class']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "ClassName", "SPHCClass", "SNo", "ClassName", ["ClassName"], null, "contains");
            //    });
            //});
            // cfi.makeTrans("shipment_shipmentitinerary", null, null, BindItenAutoComplete, ReBindItenAutoComplete, null, itenData);
            //$("div[id$='divareaTrans_shipment_shipmentitinerary']").find("[id='areaTrans_shipment_shipmentitinerary']").each(function () {

            //    $(this).find("input[id^='BoardPoint']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            //    });
            //    $(this).find("input[id^='offPoint']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            //    });
            //    $(this).find("input[id^='FlightNo']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], null, "contains");
            //    });
            //});
            //if (itenData.length <= 0) {
            //    $("div[id$='divareaTrans_shipment_shipmentitinerary']").find("[id='areaTrans_shipment_shipmentitinerary']").first().find("input[id^=Text_BoardPoint]").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
            //    $("div[id$='divareaTrans_shipment_shipmentitinerary']").find("[id='areaTrans_shipment_shipmentitinerary']").first().find("input[id^=Text_offPoint]").data("kendoAutoComplete").setDefaultValue(resItem.RoutingSNo, resItem.RoutingCityCode);
            //}
            //$("input[id='Pieces']").unbind("blur").bind("blur", function () {
            //    //comparePcsValue(this);
            //});

            //$("#ChargeableWt").unbind("blur").bind("blur", function () {
            //    compareGrossVolValue();
            //});

            //$("#GrossWt").unbind("blur").bind("blur", function () {
            //    //if (compareGrossValue(this))
            //    CalculateShipmentChWt();
            //});
            //$("#CBM").unbind("blur").bind("blur", function () {
            //    //if (compareVolValue(this))                
            //    CalculateShipmentChWt();
            //});

            //$("#VolumeWt").unbind("blur").bind("blur", function () {
            //    //if (compareVolValue(this))
            //    CalculateShipmentCBM();
            //});

            //$("#GrossWt").unbind("keypress").bind("keypress", function () {
            //    ISNumeric(this);
            //});
            //$("#VolumeWt").unbind("keypress").bind("keypress", function () {
            //    ISNumeric(this);
            //});
            //$("#ChargeableWt").unbind("keypress").bind("keypress", function () {
            //    ISNumeric(this);
            //});
            //$("#CBM").unbind("keypress").bind("keypress", function () {
            //    ISNumeric(this);
            //});
            //$("#AWBNo").unbind("keyup").bind("keyup", function () {
            //    if ($(this).val().length == 3) {
            //        $(this).val($(this).val() + "-");
            //    }
            //});
        },
        error: {

        }
    });
}


function GetDIMSInfo(AWBSNo) {
    if ($("#divDIMSInfo").length === 0)
        $("#divAfterContent").after("<div id='divDIMSInfo' style='width: 100%;'></div");
    cfi.ShowIndexView("divDIMSInfo", "Services/Shipment/FBLService.svc/GetDIMSFBLInformationGrid/DIMSFBLInformation/Shipment/DIMSFBLInformation/" + AWBSNo);
    cfi.PopUp("divDIMSInfo", "Dimension Information", 1000, null, null, 100);
}


function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    var filter1 = cfi.getFilter("OR");
    if (textId == "Text_searchFlightNo1") {
        try {
            cfi.setFilter(filter, "AirlineSNo", "eq", $("#AirlineName1").val())
            cfi.setFilter(filter, "FlightDate", "eq", $("#searchFlightDate1").attr("sqldatevalue"))
            cfi.setFilter(filter, "OriginAirport", "eq", userContext.AirportCode)
            cfi.setFilter(filter, "IsDirectFlight", "eq", 1)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
}


var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;display:none' id='btnNew'>New Booking</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <div id='divDetail'></div></td></tr></table></div>";//<option value='EDI'>EDI Messages</option>