$(function () {
    LoadFBLDetails();
    $(document.body).append('<div id="divPrintableTBLDetails" style="width: 100%" ></div>');
});

function LoadFBLDetails() {
    _CURR_PRO_ = "FreightBookingList";
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    $.ajax({
        url: "../Services/SpaceControl/FreightBookingListService.svc/GetWebForm/" + _CURR_PRO_ + "/SpaceControl/FreightBookingListSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
            $("#searchFlightDate").attr('readonly', true);
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                //CleanUI();
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
        url: "../Services/Shipment/FBLService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FBLInitiateFBR/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
                    url: "../Services/Shipment/FBLService.svc/InitiateFBR?DailyFlightSNo=" + DailyFlightSNo,
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

    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CityCode;
    cfi.ShowIndexView("divShipmentDetails", "../Services/SpaceControl/FreightBookingListService.svc/GetGridData/" + _CURR_PRO_ + "/SpaceControl/FreightBookingList/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate);
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
    $("#MainDiv").remove()
    $("#ApplicationTabs-1").html('');
    $("#ApplicationTabs-2").html('');
    $("#ApplicationTabs-3").html('');
    $("#ApplicationTabs-4").html('');
    $("#ApplicationTabs-5").html("");
    $("#ApplicationTabs").show();
    //if ($(obj).attr("class") == "dependentprocess")
    //    _IS_DEPEND = true;
    //else
    //    _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        $("#ApplicationTabs-1").html("");
        $("#ApplicationTabs-2").html("");
        $("#ApplicationTabs-3").html("");
        $("#ApplicationTabs-4").html("");
        $("#ApplicationTabs-5").html("");
        $("#ApplicationTabs").hide();
        ResetDetails();
        $("#hdnBookingSNo").val('');
        $("#hdnBookingMasterRefNo").val('');
        FlightNo = 0;
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#btnNew").css("display", "block");
    });
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var DailyFlightSNoIndex = 0;
    var FlightNoIndex = 0;
    var FlightOriginIndex = 0;
    var FlightDestinationIndex = 0;
    var FlightDateIndex = 0;
    var FlightEtdIndex = 0;

    DailyFlightSNo = 0;
    FlightNo = '';
    FlightOrigin = '';
    FlightDestination = '';
    FlightDate = '';
    FlightEtd = '';

    var AWBReferenceBookingSNoIndex = 0;
    var BookingRefNoIndex = 0;
    var OriginIndex = 0;
    var DestinationIndex = 0;
    var AWBStatusIndex = 0;


    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    FlightNoIndex = trLocked.find("th[data-field='FlightNo']").index();
    DailyFlightSNoIndex = trLocked.find("th[data-title='SNo']").index();
    FlightOriginIndex = trLocked.find("th[data-field='FlightOrigin']").index();
    FlightDestinationIndex = trLocked.find("th[data-field='FlightDestination']").index();
    FlightDateIndex = trLocked.find("th[data-field='FlightDate']").index();
    FlightEtdIndex = trLocked.find("th[data-field='ETD']").index();

    DailyFlightSNo = closestTr.find("td:eq(" + DailyFlightSNoIndex + ")").text().trim();
    //alert(DailyFlightSNo);
    FlightNo = closestTr.find("td:eq(" + FlightNoIndex + ")").text().trim();
    //alert(FlightNo);
    FlightOrigin = closestTr.find("td:eq(" + FlightOriginIndex + ")").text().trim();
    //alert(FlightOrigin);
    FlightDestination = closestTr.find("td:eq(" + FlightDestinationIndex + ")").text().trim();
    //alert(FlightDestination);
    FlightDate = closestTr.find("td:eq(" + FlightDateIndex + ")").text().trim();
    //alert(FlightDate);
    FlightEtd = closestTr.find("td:eq(" + FlightEtdIndex + ")").text().trim();
    //alert(FlightEtd);

    //$("#hdnBookingSNo").val(AWBReferenceBookingPrimarySNo);
    //$("#hdnBookingMasterRefNo").val(BookingPrimaryRefNo);


    //if (userContext.AgentSNo > 0 && AWBStatusDetails != "Booked") {
    //    ShowMessage('warning', 'Information!', "Already Executed");
    //}
    //else {
    if (currentprocess == "FREIGHTBOOKINGLISTSENDFBL") {
        SendFreightBookingList(DailyFlightSNo, FlightNo, FlightOrigin, FlightDestination, FlightDate, FlightEtd);
    }
    if (currentprocess == "FREIGHTBOOKINGLISTPRINTFBL") {
        PrintFreightBookingList(DailyFlightSNo, FlightNo, FlightOrigin, FlightDestination, FlightDate, FlightEtd);
    }
    if (currentprocess == "FREIGHTBOOKINGLISTVERSION") {
        FreightBookingListVersion(DailyFlightSNo, FlightNo, FlightDate, 0);
    }
    //if (AWBStatusDetails == "Booked" || AWBStatusDetails == "Executed") {
    //    var CheckITLResult = true;
    //    if (AWBStatusDetails == "Booked")
    //        CheckITLResult = CheckITL();
    //    if (CheckITLResult == true) {
    //        if (subprocess.toUpperCase() == "EXECUTERESERVATIONBOOKING") {
    //            var CheckAWBRouteStatusResult = CheckAWBRouteStatus();
    //            if (CheckAWBRouteStatusResult == true) {
    //                ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    //            }
    //            else
    //                ShowMessage('warning', 'Information!', "First Confirm Itinerary Route Status.");
    //        }
    //        else if (subprocess.toUpperCase() == "EDOXRESERVATIONBOOKING") {
    //            if (AWBStatusDetails == "Executed")
    //                ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    //            else
    //                ShowMessage('warning', 'Information!', "First Execute Shipment than E-Dox Process.");
    //        }
    //        else if (subprocess.toUpperCase() == "UPDATERESERVATIONBOOKING") {
    //            if (AWBStatusDetails != "Booked")
    //                ShowMessage('warning', 'Information!', "Executed shipment update from E button.");
    //            else
    //                ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    //        }
    //        else
    //            ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    //    }
    //    else
    //        ShowMessage('warning', 'Information!', "ITL Time Expired.");
    //}
    //else
    //    ShowMessage('warning', 'Information!', "Shipment " + AWBStatusDetails + "");
    ////}

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
            url: "../Services/Shipment/FBLService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/Read/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
        url: "../Services/Shipment/FBLService.svc/GetFBLInformation?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
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
            //});am
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
    var filter1 = cfi.getFilter("AND");
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
    if (textId == "Text_searchOriginCity") {
        try {
            cfi.setFilter(filter, "CityCode", "notin", $("#searchDestinationCity").val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
    if (textId == "Text_searchDestinationCity") {
        try {
            cfi.setFilter(filter, "CityCode", "notin", $("#searchOriginCity").val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
}

function SendFreightBookingList(DailyFlightSNo, FlightNo, FlightOrigin, FlightDestination, FlightDate, FlightEtd) {

    $.ajax({
        url: "../Services/SpaceControl/FreightBookingListService.svc/SendFreightBookingDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DailyFlightSNo: parseInt(DailyFlightSNo), FlightNo: FlightNo, FlightOrigin: FlightOrigin, FlightDestination: FlightDestination, FlightDate: FlightDate, FlightEtd: FlightEtd }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null && result != "") {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData.length > 0 && MsgData[0].Message == 'FBL Details Send Successfully') {
                    ShowMessage('success', 'Success - Frieght Booking List', MsgData[0].Message, "bottom-right");
                }
                else {
                    ShowMessage('failure', 'Failure - Frieght Booking List', MsgData[0].Message, "bottom-right");
                }
            }
        }
    });
}

function PrintFreightBookingList(DailyFlightSNo, FlightNo, FlightOrigin, FlightDestination, FlightDate, FlightEtd) {
    $.ajax({
        url: "../Services/SpaceControl/FreightBookingListService.svc/PrintFreightBookingDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DailyFlightSNo: parseInt(DailyFlightSNo), FlightNo: FlightNo, FlightDate: FlightDate, FlightEtd: FlightEtd }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null && result != "") {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                var divPrintableTBLDetails = $("#divPrintableTBLDetails");
                if (MsgData.length > 0) {
                    if (MsgData.length > 0) {
                        divPrintableTBLDetails.empty();
                        var str = "<div id='divPrint'><a id='anchorPrint'  onclick='printDetails();' href='#' title='Print'><img alt='' border='0' style='height:30px' src='../Images/IconPrint.png'></a><a id='saveVersionDetails' onclick='saveVersionDetails();' href='#' title='Save'><img alt='' border='0' style='height:30px' src='../Images/SaveIcon.png'></a></div>";
                        str += "<table width='100%' border='0' id='tblShipmentDetails' cellspacing='0px'><tr><td align='center' style='text-decoration:underline'><b>Booking List For " + FlightNo.trim() + "/" + FlightDate + "</b></td></tr>";
                        str += "<tr style='border-left-width:0px;border-right-width:0px;'><td>&nbsp;</td></tr><tr><td>";
                        str += "<table width='100%' border='1' cellspacing='0px'><tr style='background-color:#FFFF00'><td colspan='2' align='center' style='border-right-width:0px;'><b>POL/POD - " + FlightOrigin + "/" + FlightDestination + "</b></td><td colspan='7' align='center' style='border-left-width:0px;border-right-width:0px;'><b>Flight Number : " + FlightNo + "</b></td><td colspan='2' align='center' style='border-left-width:0px;'><b>ETD " + FlightEtd + " hrs</b></td></tr>";
                        str += "<tr ><td colspan='11' >&nbsp;</td></tr>";
                        str += "<tr><td align='center'><b>Airway bill</b></td><td align='center'><b>Origin</b></td><td align='center'><b>Destination</b></td><td align='center'><b>Pieces</b></td><td align='center'><b>Weight</b></td><td align='center'><b>Volume</b></td><td align='center'><b>Commodity</b></td><td align='center'><b>SHC</b></td><td align='center'><b>Nature Of Goods</b></td><td align='center'><b>Remarks</b></td><td align='center'><b>Priority</b></td></tr>";

                        for (var i = 0; i < MsgData.length; i++) {
                            str += "<tr><td align='center'><label id = AirwayBill_" + i + ">" + MsgData[i]["AirwayBill"] + "</td><td align='center'><label id = Origin_" + i + ">" + MsgData[i]["Origin"] + "</td><td align='center'><label id = Destination_" + i + ">" + MsgData[i]["Destination"] + "</td><td align='center'><label id = Pieces_" + i + ">" + MsgData[i]["Pieces"] + "</td><td align='center'><label id = GrossWeight_" + i + ">" + MsgData[i]["GrossWeight"] + "</td><td align='center'><label id = Volume_" + i + ">" + MsgData[i]["Volume"] + "</td><td align='center'><label id = Commodity_" + i + ">" + MsgData[i]["Commodity"] + "</td><td align='center'><label id = SHC_" + i + ">" + MsgData[i]["SHC"] + "</td><td align='center'><label id = NatureOfGoods_" + i + ">" + MsgData[i]["NatureOfGoods"] + "</td><td align='center'><label id = RemarksTo_" + i + ">" + MsgData[i]["RemarksTo"] + "</td><td align='center'><label id = Priority_" + i + ">" + MsgData[i]["Priority"] + "</td></tr>";
                        }
                        str += "</td></tr></table>";
                    }
                    else {
                        str += " <table><tr>";
                        str += "<td colspan='7'><center><p style='color:red'>Not Record Exists</p></center></td>";
                        str += "</tr></table>";
                    }
                    divPrintableTBLDetails.append(str);
                    cfi.PopUp("divPrintableTBLDetails", "Shipment List", 1300, null, null, null);
                    $("#divPrintableTBLDetails").closest(".k-window").css({
                        position: 'fixed',
                        top: '5%'
                    });
                }
                else {
                    divPrintableTBLDetails.empty();
                    var str = "<div id='divPrint'><a id='anchorPrint'  onclick='printDetails();' href='#' title='Print'><img alt='' border='0' style='height:30px' src='../Images/IconPrint.png'></a><a id='saveVersionDetails' onclick='saveVersionDetails();' href='#' title='Save'><img alt='' border='0' style='height:30px' src='../Images/SaveIcon.png'></a></div>";
                    str += "<table width='100%' border='0' id='tblShipmentDetails' cellspacing='0px'><tr><td align='center' style='text-decoration:underline'><b>Booking List For " + FlightNo.trim() + "/" + FlightDate + "</b></td></tr>";
                    str += "<tr style='border-left-width:0px;border-right-width:0px;'><td>&nbsp;</td></tr><tr><td>";
                    str += "<table width='100%' border='1' cellspacing='0px'><tr style='background-color:#FFFF00'><td colspan='2' align='center' style='border-right-width:0px;'><b>POL/POD - " + FlightOrigin + "/" + FlightDestination + "</b></td><td colspan='7' align='center' style='border-left-width:0px;border-right-width:0px;'><b>Flight Number : " + FlightNo + "</b></td><td colspan='2' align='center' style='border-left-width:0px;'><b>ETD " + FlightEtd + " hrs</b></td></tr>";
                    str += "<tr ><td colspan='11'>&nbsp;</td></tr>";
                    str += "<tr><td align='center'><b>Airway bill</b></td><td align='center'><b>Origin</b></td><td align='center'><b>Destination</b></td><td align='center'><b>Pieces</b></td><td align='center'><b>Weight</b></td><td align='center'><b>Volume</b></td><td align='center'><b>Commodity</b></td><td align='center'><b>SHC</b></td><td align='center'><b>Nature of Goods</b></td><td align='center'><b>Remarks</b></td><td align='center'><b>Priority</b></td></tr>";
                    str += "<tr><td colspan='11'style='text-align:center;font-size: 21px;font-weight: bold;'>NIL</td></tr>";
                    str += "</td></tr></table>";
                    divPrintableTBLDetails.append(str);
                    cfi.PopUp("divPrintableTBLDetails", "Shipment List", 1300, null, null, null);
                    $("#divPrintableTBLDetails").closest(".k-window").css({
                        position: 'fixed',
                        top: '5%'
                    });
                }
            }
        }
    });
}

function saveVersionDetails() {
    //alert("saveVersionDetails");
    var FlightNumber = FlightNo;
    var DateOfFlight = FlightDate;
    var RecordsCount = $("[id^=AirwayBill_]").length - 1;
    //alert(RecordsCount);
    var strPrintDetails = [];
    if (RecordsCount == -1) {
        var PrintRecord = {
            AirwayBill: 'N/A',
            Origin: '',
            Destination: '',
            Pieces: 0,
            GrossWeight: 0.00,
            Volume: 0.00,
            Commodity: '',
            SHC: '',
            NatureOfGoods: '',
            RemarksTo: '',
            Priority: '',
            FlightNo: FlightNo.trim(),
            FlightDate: FlightDate.trim(),
        };
        strPrintDetails.push(PrintRecord);
    }
    else {
        for (var i = 0; i < RecordsCount ; i++) {
            var PrintRecord = {
                AirwayBill: $("#AirwayBill_" + i).text(),
                Origin: $("#Origin_" + i).text(),
                Destination: $("#Destination_" + i).text(),
                Pieces: parseInt($("#Pieces_" + i).text()),
                GrossWeight: parseFloat($("#GrossWeight_" + i).text()),
                Volume: parseFloat($("#Volume_" + i).text()),
                Commodity: $("#Commodity_" + i).text(),
                SHC: $("#SHC_" + i).text(),
                NatureOfGoods: $("#NatureOfGoods_" + i).text(),
                RemarksTo: $("#RemarksTo_" + i).text(),
                Priority: $("#Priority_" + i).text(),
                FlightNo: FlightNo.trim(),
                FlightDate: FlightDate.trim(),
            };
            strPrintDetails.push(PrintRecord);
        }
    }


    $.ajax({
        url: "../Services/SpaceControl/FreightBookingListService.svc/SaveFBLShipmentDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ ShipmentDetails: strPrintDetails }),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var MsgTable = jQuery.parseJSON(response);
            var MsgData = MsgTable.Table0;
            if (MsgData.length > 0) {
                if (MsgData.length > 0) {
                    if (MsgData[0].MessageNumber == '1') {
                        ShowMessage('success', 'Success - Booking List', MsgData[0].Message, "bottom-right");
                    }
                    else {
                        ShowMessage('warning', 'Warning - Booking List', MsgData[0].Message, "bottom-right");
                    }
                }
            }
        }
    });
}

function FreightBookingListVersion(DailyFlightSNo, FlightNo, FlightDate, FBLVersion) {
    $.ajax({
        url: "../Services/SpaceControl/FreightBookingListService.svc/FreightBookingVersionDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DailyFlightSNo: parseInt(DailyFlightSNo), FlightNo: FlightNo, FlightDate: FlightDate, FBLVersion: FBLVersion }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null && result != "") {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                var divPrintableTBLDetails = $("#divPrintableTBLDetails");
                if (MsgData.length > 0) {
                    if (MsgData.length > 0) {
                        divPrintableTBLDetails.empty();
                        $("#divVersion").empty();
                        var str = "<table><tr  style='width:100%'><td style='width:70%'><div id='divPrint'><a id='anchorVersionPrint' onclick='printVersionDetails();' href='#' title='Print'><img alt='' border='0' style='height:30px' src='../Images/IconPrint.png'></a></div></td>";
                        var versionDetails = "<b>Version Details : </b><table><tbody><tr>";
                        str += "<td style='width:10%'><div id='divVersion'></div></td></tr></table>";
                        str += "<table style='margin-top: 20px;' width='100%' border='0' id='tblShipmentDetails' cellspacing='0px'><tr><td><table width='100%' cellspacing='0px'><tbody><tr><td align='center' colspan='3' style='border-right-width:0px;font-size:small'><b>Version : " + MsgData[0]["Version"] + "</b></td><td colspan='5' align='center' style='border-left-width:0px;border-right-width:0px;text-decoration:underline;font-size:small'><b>Booking List For " + FlightNo.trim() + "/" + FlightDate + "</b></td><td align='center' colspan='3' style='border-left-width:0px;font-size:small'><b>Created By : " + MsgData[0]["CreatedBy"] + "</b></td></tr></tbody></table></td></tr>";
                        str += "<tr style='border-left-width:0px;border-right-width:0px;'><td>&nbsp;</td></tr><tr><td>";
                        str += "<table width='100%' border='1' cellspacing='0px'><tr style='background-color:#FFFF00'><td colspan='2' align='center' style='border-right-width:0px;'><b>POL/POD - " + FlightOrigin + "/" + FlightDestination + "</b></td><td colspan='7' align='center' style='border-left-width:0px;border-right-width:0px;'><b>Flight Number : " + FlightNo + "</b></td><td colspan='2' align='center' style='border-left-width:0px;'><b>ETD " + FlightEtd + " hrs</b></td></tr>";
                        str += "<tr ><td colspan='11' >&nbsp;</td></tr>";
                        str += "<tr><td align='center'><b>Airway bill</b></td><td align='center'><b>Origin</b></td><td align='center'><b>Destination</b></td><td align='center'><b>Pieces</b></td><td align='center'><b>Weight</b></td><td align='center'><b>Volume</b></td><td align='center'><b>Commodity</b></td><td align='center'><b>SHC</b></td><td align='center'><b>Nature Of Goods</b></td><td align='center'><b>Remarks</b></td><td align='center'><b>Priority</b></td></tr>";

                        //<button type='button'>1</button></td><td><button type='button'>2</button></td></tr></tbody></table>
                        if (MsgData[0]["AirwayBill"] != '') {
                            for (var i = 0; i < MsgData.length; i++) {
                                str += "<tr><td align='center'><label id = AirwayBill_" + i + ">" + MsgData[i]["AirwayBill"] + "</td><td align='center'><label id = Origin_" + i + ">" + MsgData[i]["Origin"] + "</td><td align='center'><label id = Destination_" + i + ">" + MsgData[i]["Destination"] + "</td><td align='center'><label id = Pieces_" + i + ">" + MsgData[i]["Pieces"] + "</td><td align='center'><label id = GrossWeight_" + i + ">" + MsgData[i]["GrossWeight"] + "</td><td align='center'><label id = Volume_" + i + ">" + MsgData[i]["Volume"] + "</td><td align='center'><label id = Commodity_" + i + ">" + MsgData[i]["Commodity"] + "</td><td align='center'><label id = SHC_" + i + ">" + MsgData[i]["SHC"] + "</td><td align='center'><label id = NatureOfGoods_" + i + ">" + MsgData[i]["NatureOfGoods"] + "</td><td align='center'><label id = RemarksTo_" + i + ">" + MsgData[i]["RemarksTo"] + "</td><td align='center'><label id = Priority_" + i + ">" + MsgData[i]["Priority"] + "</td></tr>";
                            }
                        }
                        else {
                            str += "<tr><td colspan='11'style='text-align:center;font-size: 21px;font-weight: bold;'>NIL</td></tr>";
                        }
                        for (var i = 1; i <= parseInt(MsgData[0]["MaxVersion"]) ; i++) {
                            //for (var i = 1; i <= 1 ; i++) {
                            versionDetails += "<td><button type='button' id = 'btnFBLVersion_" + i + "'>" + i + "</td>";
                        }
                        str += "</td></tr></table>";
                        versionDetails += "</tr></tbody></table>";
                    }
                    else {
                        str += " <table><tr>";
                        str += "<td colspan='7'><center><p style='color:red'>Not Record Exists</p></center></td>";
                        str += "</tr></table>";
                    }
                    divPrintableTBLDetails.append(str);
                    $("#divVersion").append(versionDetails);
                    cfi.PopUp("divPrintableTBLDetails", "Shipment List", 1300, null, null, null);
                    $("#divPrintableTBLDetails").closest(".k-window").css({
                        position: 'fixed',
                        top: '5%'
                    });
                }
                else {
                    divPrintableTBLDetails.empty();
                    var str = "<table><tr  style='width:100%'><td style='width:70%'><div id='divPrint'><a id='anchorVersionPrint' onclick='printVersionDetails();' href='#' title='Print'><img alt='' border='0' style='height:30px' src='../Images/IconPrint.png'></a></div></td>";
                    var versionDetails = "<b>Version Details : </b><table><tbody><tr>";
                    str += "<td style='width:10%'><div id='divVersion'></div></td></tr></table>";
                    str += "<table style='margin-top: 20px;' width='100%' border='0' id='tblShipmentDetails' cellspacing='0px'><tr><td><table width='100%' cellspacing='0px'><tbody><tr><td align='center' colspan='3' style='border-right-width:0px;font-size: small;'><b>Version : 0</b></td><td colspan='5' align='center' style='border-left-width:0px;border-right-width:0px;text-decoration:underline;font-size: small;'><b>Booking List For " + FlightNo.trim() + "/" + FlightDate + "</b></td><td align='center' colspan='3' style='border-left-width:0px;font-size: small;'><b>Created By :</b></td></tr></tbody></table></td></tr>";
                    str += "<tr style='border-left-width:0px;border-right-width:0px;'><td>&nbsp;</td></tr><tr><td>";
                    str += "<table width='100%' border='1' cellspacing='0px'><tr style='background-color:#FFFF00'><td colspan='2' align='center' style='border-right-width:0px;'><b>POL/POD - " + FlightOrigin + "/" + FlightDestination + "</b></td><td colspan='7' align='center' style='border-left-width:0px;border-right-width:0px;'><b>Flight Number : " + FlightNo + "</b></td><td colspan='2' align='center' style='border-left-width:0px;'><b>ETD " + FlightEtd + " hrs</b></td></tr>";
                    str += "<tr ><td colspan='11' >&nbsp;</td></tr>";
                    str += "<tr><td align='center'><b>Airway bill</b></td><td align='center'><b>Origin</b></td><td align='center'><b>Destination</b></td><td align='center'><b>Pieces</b></td><td align='center'><b>Weight</b></td><td align='center'><b>Volume</b></td><td align='center'><b>Commodity</b></td><td align='center'><b>SHC</b></td><td align='center'><b>Nature Of Goods</b></td><td align='center'><b>Remarks</b></td><td align='center'><b>Priority</b></td></tr>";
                    str += "<tr><td colspan='11'style='text-align:center;font-size: 21px;font-weight: bold;'>NIL</td></tr>";
                    str += "</td></tr></table>";
                    divPrintableTBLDetails.append(str);
                    cfi.PopUp("divPrintableTBLDetails", "Shipment List", 1300, null, null, null);
                    $("#divPrintableTBLDetails").closest(".k-window").css({
                        position: 'fixed',
                        top: '5%'
                    });
                }
            }
        }
    });
}

function printDetails() {
    var mywindow = window.open('', 'PRINT', 'height=600,width=600');
    var mainDiv = $("#divPrintableTBLDetails").html();
    var printDiv = $("#divPrintableTBLDetails").find('#divPrint');
    printDiv.remove();
    mywindow.document.write($("#divPrintableTBLDetails").html());
    //mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    $("#divPrintableTBLDetails").empty();
    $("#divPrintableTBLDetails").append(mainDiv);
}

function printVersionDetails() {
    var mywindow = window.open('', 'PRINT', 'height=600,width=600');
    var mainDiv = $("#divPrintableTBLDetails").html();
    var versionDiv = $("#divPrintableTBLDetails").find('#divVersion');
    var printDiv = $("#divPrintableTBLDetails").find('#divPrint');
    versionDiv.remove();
    printDiv.remove();
    mywindow.document.write($("#divPrintableTBLDetails").html());
    //mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    $("#divPrintableTBLDetails").empty();
    $("#divPrintableTBLDetails").append(mainDiv);
}






$(document).on('click', '[id^="btnFBLVersion_"]', function () {
    var FBLVersion = parseInt(this.id.split('_')[1]);
    FreightBookingListVersion(DailyFlightSNo, FlightNo, FlightDate, FBLVersion);
});



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
var divContent = "<div class='rows'><table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <div id='divDetail'></div></td></tr></table></div>";//<option value='EDI'>EDI Messages</option>