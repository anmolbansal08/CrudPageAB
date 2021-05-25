$(function () {
    MasterFWBImport();
});
function MasterFWBImport() {
    _CURR_PRO_ = "FWBIMPORT";
    _CURR_OP_ = "Master FWBImport";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divFWBImportDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Import/FWBImportService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FWBImportSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            cfi.AutoComplete("searchAirline", "AirlineCode,AirlineName", "Airline", "AirlineCode", "AirlineName", ["AirlineCode", "AirlineName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "v_DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNo", "Awb", "AWBNo", "AWBNo", ["AWBNo"], null, "contains");
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                FWBImportSearch();
            });
            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                $("#hdnAWBSNo").val("");
                currentawbsno = 0;
                var module = "Import";
                if (_CURR_PRO_ == "HOUSE") {
                    module = "House";
                }
                //$.ajax({
                //    url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/RESERVATION/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                //    success: function (result) {
                //        $("#divNewBooking").html(result);
                //        if (result != undefined || result != "") {
                //            InitializePage("FWB", "divNewBooking");
                //            currentprocess = "FWB";

                //            //$("#tblShipmentInfo").hide();
                //            GetProcessSequence("ACCEPTANCE");
                //        }
                //    }
                //});

            });
        }
    });
}

function FWBImportSearch() {
    var searchAirline = $("#searchAirline").val() == "" ? "0" : $("#searchAirline").val();
    var searchFlightNo = $("#searchFlightNo").val() == "" ? "0" : $("#searchFlightNo").val();
    var searchAWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val();
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#searchFromDate").val() != "") {
        searchFromDate = cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate");// "";//month + "-" + day + "-" + year;
    }
    if ($("#searchToDate").val() != "") {
        searchToDate = cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate");// "";//month + "-" + day + "-" + year;
    }
    //var SearchIncludeTransitAWB = $("input[name='SearchIncludeTransitAWB']:checked").val() == undefined ? "0" : "1";
    //var SearchExcludeDeliveredAWB = $("input[name='SearchExcludeDeliveredAWB']:checked").val() == undefined ? "0" : "1";
    var LoggedInCity = "DEL";
    if (_CURR_PRO_ == "FWBIMPORT") {
        cfi.ShowIndexView("FWBImportDetails", "Services/Import/FWBImportService.svc/GetGridData/" + _CURR_PRO_ + "/Import/FWBImport/" + searchAirline.trim() + "/" + searchFlightNo.trim() + "/" + searchAWBNo.trim() + "/" + searchFromDate.trim() + "/" + searchToDate.trim() + "/" + LoggedInCity.trim());
    }
}
function CleanUI() {
    //$("#divXRAY").hide();
    ////$("#tblShipmentInfo").hide();
    //$("#divDetail").html("");
    //$("#divDetail1").html("");
    //$("#divDetail2").html("");
    //$("#divDetail3").html("");
    ////$("#tblShipmentInfo").hide();
    //$("#divNewBooking").html("");
    //$("#btnSave").unbind("click");

    //$("#divXRAY").hide();

    //$("#ulTab").hide();
    //$("#divDetail_SPHC").html("");
    //$("#divDetailSHC").html("");

    //$("#divTab3").html("");
    //$("#divTab4").html("");
    //$("#divTab5").html("");
    //$("#tabstrip").hide();
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
    //$("#SearchIncludeTransitAWB").after("Include Transit AWB");
    //$("#SearchExcludeDeliveredAWB").after("Exclude Delivered AWB");
}

function checkProgrss(item, subprocess, displaycaption) {
    //dependentprocess
    //BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if (item.toUpperCase().indexOf("," + subprocess.toUpperCase() + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }
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



function BindEvents(obj, e, isdblclick) {

    $("#divDetail").html('');
    $("#divDetailSHC").html('');
    $("#divTab3").html('');
    $("#divTab4").html('');
    $("#divTab5").html('');
    $("#divXRAY").hide();
    $("#tabstrip").show();
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
    //var clickedRowIndex = $(obj).closest("tr").index();
    //var closestLockedTr = $(obj).closest("div.k-grid").find("div.k-grid-content-locked").find("tr:eq(" + clickedRowIndex.toString() + ")");

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
    $("#tabstrip").kendoTabStrip();
}


function ShowProcessDetails(subprocess, isdblclick) {
    $("#IdAWBPrint").css("display", "");
    $("#IdAcptNote").css("display", "");
    $("#IdEDINote").css("display", "");
    $("#ulTab").hide();
    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);

    if (subprocess.toUpperCase() == "FWBIMPORTRESERVATION") {
        $("#ulTab").show();

        $('#tabstrip ul:first li:eq(0) a').text("AIR WAYBILL");
        $('#tabstrip ul:first li:eq(1) a').text("RATE");
        $('#tabstrip ul:first li:eq(2) a').text("CUSTOMER INFORMATION");
        $('#tabstrip ul:first li:eq(3) a').text("CUSTOMS");
        $('#tabstrip ul:first li:eq(4) a').text("OTHER INFO");

        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        $('#tabstrip ul:first li:eq(4) a').show();

        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBIMPORTRESERVATION", "divDetail", isdblclick);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBIMPORTRATE", "divDetailSHC", isdblclick);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBIMPORTCUSTOMER", "divTab3", isdblclick);
        });
        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBIMPORTHANDLING", "divTab4", isdblclick);
        });
        $('#tabstrip ul:first li:eq(4) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBIMPORTSUMMARY", "divTab5", isdblclick);
        });
    }

    if (subprocess.toUpperCase() == "DIMENSION") {
        $("#ulTab").show();
        $('#tabstrip ul:first li:eq(0) a').text("BULK Information");
        $('#tabstrip ul:first li:eq(1) a').text("ULD Information");
        $('#tabstrip ul:first li:eq(2) a').text("ULD Details");
        $('#tabstrip ul:first li:eq(3) a').text("");
        $('#tabstrip ul:first li:eq(4) a').text("");

        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').hide();
        $('#tabstrip ul:first li:eq(4) a').hide();

        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("DIMENSION", "divDetail", isdblclick);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("ULDDimensionInfo", "divDetailSHC", isdblclick);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("ULDDimensionDetails", "divTab3", isdblclick);
        });
    }


    if (subprocess.toUpperCase() == "HOUSEWAYBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/HOUSEWAYBILL/" + currentawbsno);

        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "SHIPPINGBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/SHIPPINGBILL/" + currentawbsno);
        // bind
        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        $('#tabstrip ul:first li:eq(0) a').text("General");
        $('#tabstrip ul:first li:eq(1) a').text("SPHC Wise");
        $('#tabstrip ul:first li:eq(2) a').hide();
        $('#tabstrip ul:first li:eq(3) a').hide();
        $('#tabstrip ul:first li:eq(4) a').hide();

        $("#divXRAY").show();
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/CHECKLIST/" + currentawbsno);
        cfi.ShowIndexView("divDetailSHC", "Services/Shipment/FWBService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/CHECKLIST_SPHC/" + currentawbsno);
        $("#ulTab").show();
        //SAVE SECTION
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);
    }

    else {
        $.ajax({
            url: "Services/Import/FWBImportService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("FWBIMPORT");
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

function InitializePage(subprocess, cntrlid, isdblclick) {
    $("#tblShipmentInfo").show();
    InstantiateControl(cntrlid);

    if (subprocess.toUpperCase() == "FWBIMPORTCUSTOMER") {
        BindCustomerInfo();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                    
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(3);
                    ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        BindDimensionEvents();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                    ShowProcessDetailsNew("ULDDIMENSIONINFO", "divDetailSHC", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;

    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONINFO") {
        BindULDDimensionInfo();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                    ShowProcessDetailsNew("ULDDIMENSIONDETAILS", "divTab3", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONDETAILS") {
        BindULDDimensionDetails();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
                    ShowProcessDetailsNew("DIMENSION", "divDetail", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "FWBIMPORTRATE") {
        BindAWBRate();
        BindDimensionEventsNew();
        BindDimensionEventsNewULD();
        BindAWBOtherCharge();

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                    ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "FWBIMPORTSUMMARY") {
        BindAWBSummary(isdblclick);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
                    ShowProcessDetailsNew("RESERVATION", "divDetail", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "WEIGHINGMACHINE") {
        BindWeighingMachineEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "XRAY") {
        BindXRayEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "LOCATION") {

        BindLocationEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "FWBIMPORTHANDLING") {
        BindHandlingInfoDetails();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                }

            } else {
                return false;
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(4);
                    ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;

    }
    else if (subprocess.toUpperCase() == "PAYMENT") {

        InitializePaymentData();
    }
    else if (subprocess.toUpperCase() == "FWBIMPORTRESERVATION") {
        BindReservationSection();

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FWBImportSearch();
                }

            } else {
                return false;
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    $("#divDetailSHC").html("");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                    ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                }

            } else {
                return false;
            }

        });
        return false;
    }
        //else if (subprocess.toUpperCase() == "CHECKLIST") {
        //    BindCheckList();
        //}
    else if (subprocess.toUpperCase() == "EDOX") {
        $("#divXRAY").show();
        $("#spnShowSlacDetails").html("All Docs Received")
        BindEDox();
    }
    if (subprocess.toUpperCase() != "PAYMENT") {
        var sectionId = "";
        if (parseInt(currentawbsno) > 0) {
            sectionId = "divDetail";
        }
        else {
            sectionId = "divNewBooking";
        }
        cfi.ValidateSection(sectionId);
        //SAVE SECTION
        $("#btnSave").unbind("click").bind("click", function () {
            if (_IS_DEPEND) {
                ShowMessage('error', 'Error!', "AWB No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked House data is in process.", "bottom-right");
                return false;
            }
            else if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    if (SaveFormData(subprocess)) {
                        FWBImportSearch();
                    }

                }
            }
            else {
                return false
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var saveflag = false;

            if (_IS_DEPEND) {
                ShowMessage('error', 'Error!', "AWB No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked House data is in process.", "bottom-right");
                return false;
            }
            else if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    saveflag = SaveFormData(subprocess);
                }
            }
            else {
                saveflag = false
            }
            if (saveflag) {
                FWBImportSearch();
                for (var i = 0; i < processList.length; i++) {
                    if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                        if (currentawbsno > 0) {
                            currentprocess = processList[i + 1].value;
                            ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);
                        }
                        else {
                            CleanUI();
                            cfi.ShowIndexView("FWBImportDetails", "Services/Import/FWBImportService.svc/GetGridData/" + _CURR_PRO_ + "/Import/Booking");
                        }
                        return;
                    }
                }
            }
        });

    }

}

function BindCustomerInfo() {

    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("SHIPPER_Name", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("CONSIGNEE_AccountNoName", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("Notify_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("Notify_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    //$.ajax({
    //    url: "Services/Shipment/FWBService.svc/GetShipperAndConsigneeInformation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
    //    data: JSON.stringify({ AWBSNO: currentawbsno }),
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        var customerData = jQuery.parseJSON(result);
    //        var shipperData = customerData.Table0;
    //        var consigneeData = customerData.Table1;
    //        var agentData = customerData.Table2;
    //        var notifyData = customerData.Table3;
    //        var nominyData = customerData.Table4;

    //        if (shipperData.length > 0) {
    //            $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
    //            if (shipperData[0].ShipperAccountNo != "") {
    //                $("#Text_SHIPPER_AccountNo").prop('disabled', true);
    //                $("#chkSHIPPER_AccountNo").closest('td').hide();
    //            }

    //            //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperName, shipperData[0].ShipperName);
    //            $("#SHIPPER_Name").val(shipperData[0].ShipperName);
    //            $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
    //            $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
    //            $("#SHIPPER_State").val(shipperData[0].ShipperState);
    //            $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
    //            $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
    //            $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);

    //            $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
    //            $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);

    //            $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);

    //            $("#SHipper_Fax").val(shipperData[0].Fax);
    //            $("#_tempSHipper_Fax").val(shipperData[0].Fax);
    //        }
    //        if (consigneeData.length > 0) {
    //            $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
    //            if (consigneeData[0].ConsigneeAccountNo != "") {
    //                $("#Text_CONSIGNEE_AccountNo").prop('disabled', true);
    //                $("#chkCONSIGNEE_AccountNo").closest('td').hide();
    //            }

    //            //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeName, consigneeData[0].ConsigneeName);
    //            $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
    //            $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
    //            $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
    //            $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
    //            $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
    //            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
    //            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
    //            $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
    //            $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
    //            $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
    //            $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
    //            $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
    //        }
    //        if (agentData.length > 0) {
    //            $('#AGENT_AccountNo').val(agentData[0].AccountNo.toUpperCase());
    //            $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo.toUpperCase());
    //            $('#AGENT_Participant').val(agentData[0].Participant.toUpperCase());
    //            $('span[id=AGENT_Participant]').text(agentData[0].Participant.toUpperCase());
    //            $('#AGENT_IATACODE').val(agentData[0].IATANo.toUpperCase());
    //            $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo.toUpperCase());
    //            $('#AGENT_Name').val(agentData[0].AgentName.toUpperCase());
    //            $('span[id=AGENT_Name]').text(agentData[0].AgentName.toUpperCase());
    //            $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress.toUpperCase());
    //            $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress.toUpperCase());
    //            $('#AGENT_PLACE').val(agentData[0].Location.toUpperCase());
    //            $('span[id=AGENT_PLACE]').text(agentData[0].Location.toUpperCase());
    //        }
    //        if (notifyData.length > 0) {
    //            $("#Notify_Name").val(notifyData[0].CustomerName),
    //            $("#Text_Notify_CountryCode").data("kendoAutoComplete").setDefaultValue(notifyData[0].CountrySno, notifyData[0].CountryCode + '-' + notifyData[0].CountryName);
    //            $("#Text_Notify_City").data("kendoAutoComplete").setDefaultValue(notifyData[0].CitySno, notifyData[0].CityCode + '-' + notifyData[0].CityName);
    //            $("#Notify_MobileNo").val(notifyData[0].Phone);
    //            $("#_tempNotify_MobileNo").val(notifyData[0].Phone);
    //            $("#Notify_Address").val(notifyData[0].Location);
    //            $("#Notify_State").val(notifyData[0].State);
    //            $("#Notify_Place").val(notifyData[0].Street);
    //            $("#Notify_PostalCode").val(notifyData[0].PostalCode);
    //            $("#Notify_Fax").val(notifyData[0].Fax);
    //            $("#_tempNotify_Fax").val(notifyData[0].Fax);
    //        }
    //        if (nominyData.length > 0) {
    //            $('#Nominate_Name').val(nominyData[0].NOMName);
    //            $('#Nominate_Place').val(nominyData[0].NOMPlace);
    //        }
    //    },
    //    error: {

    //    }
    //});

}

function SaveFormData(subprocess) {
    var issave = false;

    if (subprocess.toUpperCase() == "FWBImportCustomer") {
        issave = SaveCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        issave = SaveDimensionInfo();
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONINFO") {
        issave = SaveDimensionULDInfo();
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONDETAILS") {
        issave = SaveDimensionULDDetails();
    }
    else if (subprocess.toUpperCase() == "FWBImportRate") {
        issave = SaveDimensionInfoNew();
    }
    else if (subprocess.toUpperCase() == "FWBImportSUMMARY") {
        issave = SaveAWBSummary();
    }
    else if (subprocess.toUpperCase() == "WEIGHINGMACHINE") {
        issave = SaveWeighingMachineInfo();
    }
    else if (subprocess.toUpperCase() == "XRAY") {
        issave = SaveXRayInfo();
    }
    else if (subprocess.toUpperCase() == "LOCATION") {
        issave = SaveLocationInfo();
    }
    else if (subprocess.toUpperCase() == "FWBImportHandling") {
        issave = SaveHandlingInfo();
    }
    else if (subprocess.toUpperCase() == "FWBImportReservation") {
        issave = SaveReservationInfo();
    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        issave = SaveCheckList();
    }
    else if (subprocess.toUpperCase() == "EDOX") {
        issave = SaveEDoxList();
    }

    return issave;
}



function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Import/FWBImportService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            if (processdata.Table0 != undefined && processdata.Table0.length > 0) {
                var processlist = processdata.Table0;
                var out = '[';
                $.each(processlist, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                        else {
                            out = out + '{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                    }
                });
            }
            out = out + ']';
            processList = eval(out);

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


function BindReservationSection() {

    cfi.AutoComplete("Product", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    cfi.AutoComplete("Commodity", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("ShipmentOrigin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("ShipmentDestination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");

    cfi.AutoComplete("IssuingAgent", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
    cfi.AutoComplete("SpecialHandlingCode", "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains", ",");
    cfi.AutoComplete("buptype", "Description", "buptype", "SNO", "Description", "", null, "contains");
    cfi.AutoComplete("densitygroup", "GroupName", "CommodityDensityGroup", "SNO", "GroupName", "", null, "contains");
    cfi.AutoComplete("SubGroupCommodity", "SubGroupName", "vw_Commodity_CommoditySubGroup", "SubGroupSNo", "SubGroupName", "", null, "contains");

    $("#AWBDate").data("kendoDatePicker").value(new Date());

    $('#AWBDate').prop('readonly', true);

    //$("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
    //    cfi.PopUp("divareaTrans_shipment_shipmentclasssphc", "SPHC");
    //});
    $("#NoofHouse").attr('readonly', 'true');

    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $.ajax({
        url: "Services/Import/FWBImportService.svc/GetFWBImportInformation?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            var sphcArray = fblData.Table2;
            var itenData = fblData.Table1;
            var sphcArray2 = fblData.Table3;

            if (resData.length > 0) {
                var resItem = resData[0];

                $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySNo, resItem.CommodityCode == "" ? "" : resItem.CommodityCode + '-' + resItem.CommodityDescription);
                $("#Text_SubGroupCommodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySubGroupSNo, resItem.SubGroupName);
                //$("#Pieces").data("kendoNumericTextBox").value(resItem.Pieces);
                $("#Pieces").val(resItem.Pieces);
                $("#_tempPieces").val(resItem.Pieces);


                $("span[id='TotalPartPieces']").text("/ " + resItem.TotalPartPieces);
                $("#TotalPartPieces").text("/ " + resItem.TotalPartPieces);
                //$("#GrossWt").data("kendoNumericTextBox").value(resItem.GrossWeight);
                $("#GrossWt").val(resItem.GrossWeight);
                $("#_tempGrossWt").val(resItem.GrossWeight);

                //$("#ChargeableWt").data("kendoNumericTextBox").value(resItem.ChargeableWeight);
                $("#ChargeableWt").val(resItem.ChargeableWeight);
                $("#_tempChargeableWt").val(resItem.ChargeableWeight);
                //$("#CBM").data("kendoNumericTextBox").value(resItem.CBM);
                $("#CBM").val(resItem.CBM);
                $("#_tempCBM").val(resItem.CBM);

                //$("#VolumeWt").data("kendoNumericTextBox").value(parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#VolumeWt").val(parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#_tempVolumeWt").val(parseFloat(resItem.VolumeWeight).toFixed(3));

                $("span[id='VolumeWt']").html(parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#AWBNo").val(resItem.AWBNo);
                $("#AWBDate").data("kendoDatePicker").value(resItem.AWBDate);
                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(resItem.ProductSNo, resItem.ProductName);
                $("#Text_IssuingAgent").data("kendoAutoComplete").setDefaultValue(resItem.AgentBranchSNo, resItem.AgentName);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue(resItem.DestinationCity, resItem.DestinationCityName);
                $("#NoofHouse").val(resItem.NoOfHouse);
                $("#FlightDate").data("kendoDatePicker").value(resItem.FlightDate);
                $("#X-RayRequired[value='" + resItem.XRayRequired + "']").prop('checked', true);
                $("#FreightType[value='" + resItem.FreightType + "']").prop('checked', true);
                $("#NatureofGoods").val(resItem.NatureOfGoods);

                $('#AWBDate').parent().css('width', '100px');

                if (resItem.IsBup == "False") {
                    $("#chkisBup").prop('checked', false);
                } else {
                    $("#chkisBup").prop('checked', true);
                }
                $("#Text_buptype").data("kendoAutoComplete").setDefaultValue(resItem.BupTypeSNo, resItem.BupType);
                $("#Text_densitygroup").data("kendoAutoComplete").setDefaultValue(resItem.DensityGroupSNo, resItem.DensityGroupName);

                $("#AWBNo").attr("disabled", "disabled");

                bkdgrwt = resItem.GrossWeight;
                bkdvolwt = resItem.CBM;
                bkdpcs = resItem.Pieces;

                if (sphcArray2.length > 0) {
                    if (sphcArray2[0].sphcsno != "0" && sphcArray2[0].sphcsno != "") {
                        cfi.BindMultiValue("SpecialHandlingCode", sphcArray2[0].text_specialhandlingcode, sphcArray2[0].sphcsno)
                        $("#SpecialHandlingCode").val(sphcArray2[0].sphcsno);
                    }
                }

                $("input[id='GrossWt']").unbind("blur").bind("blur", function () {

                });

                $("input[id='CBM']").unbind("blur").bind("blur", function () {
                    compareVolValue("V", this, accvolwt, resItem.VolumeWeight);
                });

            }


            cfi.makeTrans("shipment_shipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, sphcArray, 8);
            $("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id='areaTrans_shipment_shipmentclasssphc']").each(function () {
                $(this).find("input[id^='SPHC']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
                });
                $(this).find("input[id^='Class']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ClassName", "SPHCClass", "SNo", "ClassName", ["ClassName"], null, "contains");
                });
            });
            cfi.makeTrans("import_fwbimportshipmentitinerary", null, null, BindItenAutoComplete, ReBindItenAutoComplete, null, itenData);
            $("div[id$='divareaTrans_import_fwbimportshipmentitinerary']").find("[id='areaTrans_import_fwbimportshipmentitinerary']").each(function () {

                $(this).find("input[id^='BoardPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
                });
                $(this).find("input[id^='offPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
                });
                $(this).find("input[id^='FlightNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], null, "contains");
                });
            });
            if (itenData.length <= 0) {
                $("div[id$='divareaTrans_import_fwbimportshipmentitinerary']").find("[id='areaTrans_import_fwbimportshipmentitinerary']").first().find("input[id^=Text_BoardPoint]").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                $("div[id$='divareaTrans_import_fwbimportshipmentitinerary']").find("[id='areaTrans_import_fwbimportshipmentitinerary']").first().find("input[id^=Text_offPoint]").data("kendoAutoComplete").setDefaultValue(resItem.RoutingSNo, resItem.RoutingCityCode);
            }
            $("input[id='Pieces']").unbind("blur").bind("blur", function () {
                //comparePcsValue(this);
            });

            $("#ChargeableWt").unbind("blur").bind("blur", function () {
                compareGrossVolValue();
            });

            $("#GrossWt").unbind("blur").bind("blur", function () {
                //if (compareGrossValue(this))
                CalculateShipmentChWt();
            });
            $("#CBM").unbind("blur").bind("blur", function () {
                //if (compareVolValue(this))                
                CalculateShipmentChWt();
            });

            $("#VolumeWt").unbind("blur").bind("blur", function () {
                //if (compareVolValue(this))
                CalculateShipmentCBM();
            });

            $("#GrossWt").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#VolumeWt").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#ChargeableWt").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CBM").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#AWBNo").unbind("keyup").bind("keyup", function () {
                if ($(this).val().length == 3) {
                    $(this).val($(this).val() + "-");
                }
            });
        },
        error: {

        }
    });
}

function BindItenAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='BoardPoint']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
        $("input[id^='BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());
        $("input[id^='Text_BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='Text_offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());

    });
    $(elem).find("[id^='FlightDate']").val('');
    $(elem).find("input[id^='offPoint']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    });
    $(elem).find("input[id^='FlightNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], null, "contains");
    });
}

function ReBindItenAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='divareaTrans_import_fwbimportshipmentitinerary']").find("[id^='areaTrans_import_fwbimportshipmentitinerary']").each(function () {
        $(this).find("input[id^='BoardPoint']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='offPoint']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SPHC']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
    });
    $(elem).find("input[id^='Class']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ClassName", "SPHCClass", "SNo", "ClassName", ["ClassName"], null, "contains");
    });
}

function ReBindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
        $(this).find("input[id^='SpecialHandlingCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHC", "SNO", "CODE", ["CODE", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='Class']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHCClass", "SNo", "ClassName", ["ClassName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function ShowProcessDetailsNew(subprocess, divID, isdblclick) {
    if ($("#" + divID).html() != "") {

        $("div[id$='divareaTrans_shipment_shipmentdimension']").find("[id^='areaTrans_shipment_shipmentdimension']").each(function (row, tr) {
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
        });
        $("div[id$='areaTrans_shipment_shipmentuld']").find("[id^='areaTrans_shipment_shipmentuld']").each(function (row, tr) {
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
            $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
        });

        return
    }
    if (subprocess == "FWBIMPORTRATE") {
        $.ajax({
            url: "Services/Import/FWBImportService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetailSHC").html(result);
                if (result != undefined || result != "") {

                    $('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");

                    $('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                    $('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                    $('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");
                    //GetProcessSequence("ACCEPTANCE");
                    InitializePage(subprocess, divID, isdblclick);
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

    else {

        $.ajax({
            url: "Services/Import/FWBImportService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#" + divID).html(result);
                if (result != undefined || result != "") {
                    //GetProcessSequence("ACCEPTANCE");
                    InitializePage(subprocess, divID, isdblclick);
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

function BindAWBRate() {

    cfi.AutoComplete("AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");

    cfi.AutoComplete("Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("ChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", ["AWBChargeCode", "Description"], null, "contains");
    cfi.AutoCompleteByDataSource("Valuation", WeightValuation, EnableDisableChargeField);
    cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);

    cfi.AutoComplete("CDCCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("CDCDestCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");

    $.ajax({
        url: "Services/Import/FWBImportService.svc/GetAWBRateDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            if (RateArray.length > 0) {

                $("#Text_AWBCurrency").data("kendoAutoComplete").setDefaultValue(RateArray[0].AWBCurrencySNo, RateArray[0].CurrencyCode);
                //$("#TotalFreight").val();
                //$("#TotalAmount").val();
                //--CVD
                $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDCurrencyCode, RateArray[0].CVDCurrencyCode);
                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDChargeCode, RateArray[0].CVDChargeCode);
                $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDWeightValuation, RateArray[0].CVDWeightValuationtext);
                $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDOtherCharges, RateArray[0].CVDOtherChargestext);


                $("#DecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(3));
                $("#_tempDecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(3));

                $("#DecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(3));
                $("#_tempDecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(3));

                $("#Insurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(3));
                $("#_tempInsurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(3));

                $("#ValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(3));
                $("#_tempValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(3));
                //-- CCD
                $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCCurrencyCode, RateArray[0].CDCCurrencyCode);
                $("#CDCConversionRate").val(RateArray[0].CDCCurrencyConversionRate == "" ? "" : parseFloat(RateArray[0].CDCCurrencyConversionRate).toFixed(6));
                $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCDestinationCurrencyCode, RateArray[0].CDCDestinationCurrencyCode);
                $("#CDCChargeAmount").val(RateArray[0].CDCChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCChargeAmount).toFixed(3));
                // $("#CDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));

                $("#CDCTotalCharAmount").data("kendoNumericTextBox").value(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));

                if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
                    $('#CDCChargeAmount').removeAttr('disabled');
                    $('#CDCTotalCharAmount').removeAttr('disabled');
                    $('#Text_CDCCurrencyCode').removeAttr('disabled');
                    $('#CDCConversionRate').removeAttr('disabled');
                    $('#Text_CDCDestCurrencyCode').removeAttr('disabled');
                } else {
                    $('#CDCChargeAmount').val('');
                    $('#_tempCDCChargeAmount').val('');
                    $('#CDCTotalCharAmount').val('');
                    $('#_tempCDCTotalCharAmount').val('');
                    $('#CDCConversionRate').val('');
                    $('#CDCChargeAmount').attr("disabled", "disabled");
                    $('#CDCTotalCharAmount').attr("disabled", "disabled");
                    $('#Text_CDCCurrencyCode').attr("disabled", "disabled");
                    $('#CDCConversionRate').attr("disabled", "disabled");
                    $('#Text_CDCDestCurrencyCode').attr("disabled", "disabled");
                    $('#Text_CDCCurrencyCode').val('');
                }
            }
            if ($("#DecCarriageVal").val() == "")
                $("#_tempDecCarriageVal").val("NVD");
            if ($("#DecCustomsVal").val() == "")
                $("#_tempDecCustomsVal").val("NCV");
            if ($("#Insurance").val() == "")
                $("#_tempInsurance").val("XXX");

            $("#DecCarriageVal").bind("blur", function () {
                if ($("#DecCarriageVal").val() == "") {
                    $("#DecCarriageVal").val("NVD");
                    $("#_tempDecCarriageVal").val("NVD");
                }
            });

            $("#DecCustomsVal").bind("blur", function () {
                if ($("#DecCustomsVal").val() == "") {
                    $("#DecCustomsVal").val("NCV");
                    $("#_tempDecCustomsVal").val("NCV");
                }
            });

            $("#Insurance").bind("blur", function () {
                if ($("#Insurance").val() == "") {
                    $("#Insurance").val("XXX");
                    $("#_tempInsurance").val("XXX");
                }
            });

            $("#CDCTotalCharAmount").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CDCChargeAmount").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CDCConversionRate").unbind("keypress").bind("keypress", function () {
                ISNumericNew(this);
            });

        },
        error: {

        }
    });
}

function EnableDisableChargeField() {
    if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
        $('#CDCChargeAmount').removeAttr('disabled');
        $('#CDCTotalCharAmount').removeAttr('disabled');
        $('#Text_CDCCurrencyCode').removeAttr('disabled');
        $('#CDCConversionRate').removeAttr('disabled');
        $('#Text_CDCDestCurrencyCode').removeAttr('disabled');
    } else {
        $('#CDCChargeAmount').val('');
        $('#_tempCDCChargeAmount').val('');
        $('#CDCTotalCharAmount').val('');
        $('#_tempCDCTotalCharAmount').val('');
        $('#CDCConversionRate').val('');
        $('#CDCChargeAmount').attr("disabled", "disabled");
        $('#CDCTotalCharAmount').attr("disabled", "disabled");
        $('#Text_CDCCurrencyCode').attr("disabled", "disabled");
        $('#CDCConversionRate').attr("disabled", "disabled");
        $('#Text_CDCDestCurrencyCode').attr("disabled", "disabled");
        $('#Text_CDCCurrencyCode').val('');
    }
}

var pageType = $('#hdnPageType').val();
function BindDimensionEventsNew() {
    var dbtableName = "AWBRateDesription";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Import/FWBImportService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDNew",
        masterTableSNo: currentawbsno,
        caption: "Rating",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: 'NoOfPieces', display: 'Pieces', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 5 }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                 {
                     name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
                 },
                 {
                     name: 'GrossWeight', display: 'Gr. Wt.', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                 },
                {
                    name: 'ChargeableWeight', display: 'Ch. Wt.', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: 0
                },
                {
                    name: 'Charge', display: 'Charge', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: true, value: 0
                },
                 {
                     name: 'ChargeAmount', display: 'Charge Amt.', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: true, value: 0
                 },
                {
                    name: 'CommodityItemNumber', display: 'Com. Item No.', type: 'text', value: 0, ctrlCss: { width: '100px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                },
                 {
                     name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 15 }, isRequired: true
                 },
                {
                    name: 'hdnChildData', type: 'hidden', value: 0
                },

                {
                    name: 'GetRate', display: 'Rate', type: 'custom',
                    customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                        var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                        var ctrl = document.createElement('span');
                        $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                        $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_GetRate', value: 'Get Rate', onclick: 'SearchData(this)' }).css('width', '75px').appendTo(ctrl).button();
                        return ctrl;
                    }
                }
                ,
        {
            name: 'Dimension', display: 'Dimension', type: 'custom',
            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                var ctrl = document.createElement('span');
                $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_btnDimension', value: 'Dimension', onclick: ' PopupDiv(this)' }).css('width', '75px').appendTo(ctrl).button();
                return ctrl;
            }
        }
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function BindDimensionEventsNewULD() {
    var dbtableName = "AWBRateDesriptionULD";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Import/FWBImportService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDRate",
        masterTableSNo: currentawbsno,
        isGetRecord: true,
        caption: "ULD Rating",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
                 },
                     {
                         name: 'SLAC', display: 'SLAC', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                     },
                 {
                     name: "ULD", display: "ULD Type", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "50px" }, isRequired: true, tableName: "ULD", textColumn: "ULDName", templateColumn: "", keyColumn: "SNo"
                 },
                {
                    name: 'ULDNo', display: 'ULD No.', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, isRequired: true, onChange: function (evt, rowIndex) { }
                },

                 {
                     name: 'Charge', display: 'Charge', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: true, value: 0
                 },
                 {
                     name: 'ChargeAmount', display: 'Charge Amt.', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: true, value: 0
                 },
                    {
                        name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, isRequired: false, value: 0
                    },
               {
                   name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, tableName: "Country", textColumn: "CountryCode", templateColumn: ["CountryCode", "CountryName"], keyColumn: "SNo"
               },
                  {
                      name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 15 }, isRequired: true
                  }

        ],

        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function BindAWBOtherCharge() {
    var dbtableName = "AWBRateOtherCharge";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Import/FWBImportService.svc',
        getRecordServiceMethod: "GetAWBOtherChargeData",
        masterTableSNo: currentawbsno,
        caption: "Other Charges",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: pageType == 'EDIT' ? 'Type' : 'Type', display: 'Type', type: 'select', ctrlOptions: { 'PP': 'PREPAID', 'CC': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, tableName: "AWBOtherChargeCode", textColumn: "OtherChargeCode", keyColumn: "OtherChargeCode", templateColumn: ["OtherChargeCode", "Description"],
                 },
                 {
                     name: pageType == 'EDIT' ? 'DueType' : 'DueType', display: 'Due Carrier/Agent', type: 'select', ctrlOptions: { 'Agent': 'Agent', 'Carrier': 'Carrier' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: 'Amount', display: 'Amount', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: true, value: 0
                 }
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function BindCustomerInfo() {

    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("SHIPPER_Name", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("CONSIGNEE_AccountNoName", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("Notify_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("Notify_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    $.ajax({
        url: "Services/Import/FWBImportService.svc/GetShipperAndConsigneeInformation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var customerData = jQuery.parseJSON(result);
            var shipperData = customerData.Table0;
            var consigneeData = customerData.Table1;
            var agentData = customerData.Table2;
            var notifyData = customerData.Table3;
            var nominyData = customerData.Table4;

            if (shipperData.length > 0) {
                $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                if (shipperData[0].ShipperAccountNo != "") {
                    $("#Text_SHIPPER_AccountNo").prop('disabled', true);
                    $("#chkSHIPPER_AccountNo").closest('td').hide();
                }

                //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperName, shipperData[0].ShipperName);
                $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                $("#SHIPPER_State").val(shipperData[0].ShipperState);
                $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);

                $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);

                $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);

                $("#SHipper_Fax").val(shipperData[0].Fax);
                $("#_tempSHipper_Fax").val(shipperData[0].Fax);
            }
            if (consigneeData.length > 0) {
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                if (consigneeData[0].ConsigneeAccountNo != "") {
                    $("#Text_CONSIGNEE_AccountNo").prop('disabled', true);
                    $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                }

                //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeName, consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
            }
            if (agentData.length > 0) {
                $('#AGENT_AccountNo').val(agentData[0].AccountNo.toUpperCase());
                $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo.toUpperCase());
                $('#AGENT_Participant').val(agentData[0].Participant.toUpperCase());
                $('span[id=AGENT_Participant]').text(agentData[0].Participant.toUpperCase());
                $('#AGENT_IATACODE').val(agentData[0].IATANo.toUpperCase());
                $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo.toUpperCase());
                $('#AGENT_Name').val(agentData[0].AgentName.toUpperCase());
                $('span[id=AGENT_Name]').text(agentData[0].AgentName.toUpperCase());
                $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress.toUpperCase());
                $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress.toUpperCase());
                $('#AGENT_PLACE').val(agentData[0].Location.toUpperCase());
                $('span[id=AGENT_PLACE]').text(agentData[0].Location.toUpperCase());
            }
            if (notifyData.length > 0) {
                $("#Notify_Name").val(notifyData[0].CustomerName),
                $("#Text_Notify_CountryCode").data("kendoAutoComplete").setDefaultValue(notifyData[0].CountrySno, notifyData[0].CountryCode + '-' + notifyData[0].CountryName);
                $("#Text_Notify_City").data("kendoAutoComplete").setDefaultValue(notifyData[0].CitySno, notifyData[0].CityCode + '-' + notifyData[0].CityName);
                $("#Notify_MobileNo").val(notifyData[0].Phone);
                $("#_tempNotify_MobileNo").val(notifyData[0].Phone);
                $("#Notify_Address").val(notifyData[0].Location);
                $("#Notify_State").val(notifyData[0].State);
                $("#Notify_Place").val(notifyData[0].Street);
                $("#Notify_PostalCode").val(notifyData[0].PostalCode);
                $("#Notify_Fax").val(notifyData[0].Fax);
                $("#_tempNotify_Fax").val(notifyData[0].Fax);
            }
            if (nominyData.length > 0) {
                $('#Nominate_Name').val(nominyData[0].NOMName);
                $('#Nominate_Place').val(nominyData[0].NOMPlace);
            }
        },
        error: {

        }
    });

}

function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {

        $.ajax({
            url: "Services/Shipment/FWBService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperName, shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                    }
                    else if (UserTyp == "C") {
                        CONSIGNEE_AccountNoName
                        //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeName, shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#SHIPPER_Email").val('');
                    }
                    else if (UserTyp == "C") {
                        //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_Email").val('');
                    }
                }

            },
            error: {

            }
        });
    }

}

function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });
    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });
    $(elem).find("input[id^='CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}
function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='divareaTrans_import_fwbimportshipmentocitrans']").find("[id^='areaTrans_import_fwbimportshipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindHandlingInfoDetails() {
    cfi.AutoComplete("CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    cfi.AutoComplete("CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

    $.ajax({
        url: "Services/Import/FWBImportService.svc/GetOSIInfoAndHandlingMessage?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var osiData = jQuery.parseJSON(result);
            var osiInfo = osiData.Table0;
            var handlingArray = osiData.Table1;
            var osiTransInfo = osiData.Table2;

            var ocitransInfo = osiData.Table3;

            //if (osiInfo.length > 0) {
            //    $("#SCI").val(osiInfo[0].SCI.toUpperCase());
            //}

            cfi.makeTrans("import_fwbimportshipmentositrans", null, null, null, null, null, osiTransInfo, 2);//added by Manoj Kumar
            cfi.makeTrans("import_fwbimportshipmentocitrans", null, null, BindCountryCodeAutoComplete, ReBindCountryCodeAutoComplete, null, ocitransInfo);//added by Manoj Kumar
            //cfi.makeTrans("shipment_shipmenthandlinginfo", null, null, BindHandlingAutoComplete, removeHandlingMessage, null, handlingArray);

            //$("div[id$='areaTrans_shipment_shipmenthandlinginfo']").find("[id='areaTrans_shipment_shipmenthandlinginfo']").each(function () {
            //    $(this).find("input[id^='Type']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
            //    });
            //});
        },
        error: {

        }
    });
}

function BindAWBSummary(isdblclick) {
    cfi.AutoComplete("OPIAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("OPIOfficeDesignator", "Code", "OfficeFunctionDesignator", "Code", "Code", "", null, "contains");
    cfi.AutoComplete("OPIOtherAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    cfi.AutoComplete("REFAirportCityCode", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("REFOfficeDesignator", "Code", "OfficeFunctionDesignator", "Code", "Code", "", null, "contains");
    cfi.AutoComplete("REFOthAirportCityCode", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    //cfi.AutoComplete("CORCustomsOriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("ISUPlace", "CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");

    $.ajax({
        url: "Services/Import/FWBImportService.svc/GetAWBSummary?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var SummaryArray = Data.Table0;
            if (SummaryArray.length > 0) {
                $('#CEDate').parent().css('width', '100px');
                //-- SSR (Special Service Request)
                $("#SSRDescription").val(SummaryArray[0].SpecialServiceRequest1);
                $("#SSRDescription2").val(SummaryArray[0].SpecialServiceRequest2);
                $("#SSRDescription3").val(SummaryArray[0].SpecialServiceRequest3);

                // ARD (Agent Reference Data)
                $("#ARDFileRefrence").val(SummaryArray[0].ARDFileRefrence);

                // OPI (Other Participant Information)
                $("#OPIName").val(SummaryArray[0].ARDFileRefrence);
                $("#Text_OPIAirportCity").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIAirportCityCode, SummaryArray[0].OPIAirportCityCode);
                $("#Text_OPIOfficeDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIOfficeFunctionDesignator, SummaryArray[0].OPIOfficeFunctionDesignator);
                $("#OPICompDesignator").val(SummaryArray[0].OPICompanyDesignator);
                $("#OPIOtherFileReference").val(SummaryArray[0].OPIOtherParticipantOfficeFileReference);
                $("#OPIParticipantCode").val(SummaryArray[0].OPIParticipantCode);
                $("#Text_OPIOtherAirportCity").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIOtherAirportCityCode, SummaryArray[0].OPIOtherAirportCityCode);

                // SRI (Shipment Reference Information)
                $("#SRIRefNumber").val(SummaryArray[0].SRIReferenceNumber);
                $("#SRISupInfo1").val(SummaryArray[0].SRISupplementaryShipmentInformation1);
                $("#SRISupInfo2").val(SummaryArray[0].SRISupplementaryShipmentInformation2);

                // SI (Shipper's Certification)
                $("#CERSignature").val(SummaryArray[0].CERSignature);

                // Carrier's Execution
                $("#CEDate").data("kendoDatePicker").value(SummaryArray[0].ISUDate);
                $("#Text_ISUPlace").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].ISUPlace, SummaryArray[0].ISUPlace);
                $("#ISUSignature").val(SummaryArray[0].ISUSignature);

                // Sender Reference
                $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFAirportCityCode, SummaryArray[0].REFAirportCityCode);
                $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOfficeFunctionDesignator, SummaryArray[0].REFOfficeFunctionDesignator);
                $("#REFCompDesignator").val(SummaryArray[0].REFCompanyDesignator);
                $("#REFOthPartOfficeFileRef").val(SummaryArray[0].REFOtherParticipantOfficeFileReference);
                $("#REFParticipantCode").val(SummaryArray[0].REFParticipantCode);
                $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOtherAirportCityCode, SummaryArray[0].REFOtherAirportCityCode);
                //$("#Text_CORCustomsOriginCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].CORCustomsOriginCode, SummaryArray[0].CORCustomsOriginCode);
                $("#CORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
                $("#_tempCORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
            }

        },
        error: {

        }
    });
}

function PopupDiv(obj) {
    CurrentRow = obj;
    var HidDataVal = $(obj).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val();
    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    if (HidDataVal != 0) {
        $("#tblAWBRateDesriptionChild").appendGrid('load', JSON.parse(HidDataVal));
    }
    //else {
    //    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    //}

    cfi.PopUp("ChildGrid", "", null, null, ShowAlert);

}

function BindDimensionChildGrid(tableid) {
    var dbtableName = tableid;
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Import/FWBImportService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDChild",
        isGetRecord: false,
        masterTableSNo: 10,
        caption: "Dimension Information",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: "MeasurementUnitCode", display: "Mes. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CalculateVol(this);" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "MeasurementUnitCode", textColumn: "UnitCode", templateColumn: "", keyColumn: "UnitCode", templateColumn: ["UnitCode", "UnitName"]
                 },
                 {
                     name: 'Length', display: 'Length', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                {
                    name: 'Width', display: 'Width', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
                },
                 {
                     name: 'Height', display: 'Height', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
                 },

                {
                    name: 'Pieces', display: 'Pieces', type: 'text', value: 0, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
                },
                  {
                      name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: 0
                  },
                     {
                         name: "VolumeUnit", display: "Vol. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "VolumeCode", textColumn: "VolumeCode", templateColumn: ["VolumeCode", "Description"], keyColumn: "VolumeCode"
                     },

        { name: 'AWBRateDescriptionSNo', type: 'hidden', value: 0 },

        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function ShowAlert(e) {
    var strData;
    strData = $('#tblAWBRateDesriptionChild').appendGrid('getStringJson');
    $(CurrentRow).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val(strData);
}

function SearchData(obj) {
    //if (cfi.IsValidSubmitSection()) {
    //    var lWeight = $('#GrossWt').val();
    //    var lNOG = $('#Text_Commodity').val();
    //    var lOrigin = $('#Text_Origin').val();
    //    var lDestination = $('#Text_Destination').val();
    //    var lAirlinePrefix = $('#Text_Airline').val().split('-')[0];
    //    var lFlightNumber = $('#Text_FlightNo').val().split('-')[1];
    //    var lFlightCarrierCode = $('#Text_FlightNo').val().split('-')[0];
    //    var lFlightdate = $("#FlightDate").attr("sqldatevalue");
    var dd = { "lNOP": "12", "lWeight": "77", "lWeightCode": "K", "lNOG": "SPARE PARTS", "lOrigin": "BOM", "lDestination": "HYD", "lAirlinePrefix": "589", "lCarrierCode": "9W", "lFlightNumber": "111", "lFlightdate": "06/16/2015", "lFlightCarrierCode": "9W" };
    //var dd = { "lNOP": "12", "lWeight": lWeight, "lWeightCode": "K", "lNOG": lNOG, "lOrigin": lOrigin, "lDestination": lDestination, "lAirlinePrefix": lAirlinePrefix, "lCarrierCode": "9W", "lFlightNumber": lFlightNumber, "lFlightdate": "16/06/2015", "lFlightCarrierCode": lFlightCarrierCode };
    $.ajax({
        type: "POST",
        cache: false,
        url: userContext.SysSetting.CRAServiceURL + 'WebServiceGetRates.asmx/GetRates',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(dd),
        success: function (data) {
            $(obj).closest('tr').find("input[id^=_temptblAWBRateDesription_Charge_").val(JSON.parse(data.d).Airwaybill_ChargeLines[0][6]);
            $(obj).closest('tr').find("input[id^=_temptblAWBRateDesription_ChargeAmount_").val(JSON.parse(data.d).Airwaybill_ChargeLines[0][7]);

        },
        error: function (a, b) {

        }
    });
    //}
}

function SaveReservationInfo() {
    var flag = false;
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    var awbNo = $("#AWBNo").val();
    var IsCourier = ($("[id='ShipmentType']:checked").val() == 1),
    ShowSlacDetails = false,//$("[id='ShowSlacDetails']:checked").val(),
    AWBNo = $("#AWBNo").val(),
    AgentBranchSNo = $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
    //AWBDate: cfi.CfiDate("AWBDate"),
    //IssuingAgent: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
    AWBTotalPieces = $("#Pieces").val(),
    CommoditySNo = $("#Text_Commodity").data("kendoAutoComplete").key(),
    GrossWeight = $("#GrossWt").val(),
    VolumeWeight = $("#VolumeWt").val(),
    ChargeableWeight = $("#ChargeableWt").val(),
    Pieces = $("#Pieces").val()
    var ShipmentInfo = {
        IsCourier: ($("[id='ShipmentType']:checked").val() == 0 ? 1 : 2),
        ShowSlacDetails: false,//$("[id='ShowSlacDetails']:checked").val(),
        AWBNo: $("#AWBNo").val(),
        AgentBranchSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
        AWBTotalPieces: $("#Pieces").val(),
        CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
        GrossWeight: $("#GrossWt").val(),
        VolumeWeight: $("#VolumeWt").val(),
        ChargeableWeight: $("#ChargeableWt").val(),
        Pieces: $("#Pieces").val(),
        ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
        IsPrepaid: ($("[id='FreightType']:checked").val() == 0),
        OriginCity: $("#Text_ShipmentOrigin").data("kendoAutoComplete").key(),
        DestinationCity: $("#Text_ShipmentDestination").data("kendoAutoComplete").key(),
        XRayRequired: ($("[id='X-RayRequired']:checked").val() == 0),
        NoOfHouse: ($("#NoofHouse").val() == "" ? 0 : $("#NoofHouse").val()),
        HouseFeededBy: "",
        AWBDate: cfi.CfiDate("AWBDate"),
        NatureOfGoods: $("#NatureofGoods").val(),
        IsBup: $("#chkisBup").prop('checked') == false ? 0 : 1,
        buptypeSNo: $("#Text_buptype").data("kendoAutoComplete").key(),
        DensityGroupSNo: $("#Text_densitygroup").data("kendoAutoComplete").key()
    };
    var ShipmentSPHCArray = [];
    if ($("#SpecialHandlingCode").val() != "") {
        var sphcarr = $("#SpecialHandlingCode").val().split(",")
        for (i = 0; i < sphcarr.length; i++) {
            var ShipmentSPHCInfo = {
                AWBSNo: awbSNo,
                AWBNo: $("#AWBNo").val(),
                SPHCCode: sphcarr[i]
            };
            ShipmentSPHCArray.push(ShipmentSPHCInfo);
        }
    }

    var SPHCArray = [];

    //$("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
    $("div[id$='divareaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
        if ($(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key() != "" || $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key() != "" || $(this).find("input[id^='UnNo']").val() != "" || $(this).find("input[id^='SubRisk']").val() != "") {
            var SPHCViewModel = {
                SNo: 0,
                AWBSNo: awbSNo,
                AWBNo: $("#AWBNo").val(),
                SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
                UNNo: $(this).find("input[id^='UnNo']").val(),
                SPHCClassSNo: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key() == "" ? "0" : $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                HAWBSNo: 0,
                IsRadioActive: false,
                MCBookingSNo: 0,
                SubRisk: $(this).find("input[id^='SubRisk']").val(),
                RamCat: $(this).find("input[id^='RamCat']").val(),
                UnPackingGroupImpCode: $(this).find("[id^='UnPackingGroup']").val(),
                CaoX: $(this).find("[id^='Caox']").val(),
                ImpCode: $(this).find("[id^='ImpCode']").val()
            };
            SPHCArray.push(SPHCViewModel);
        }
    });
    //if (SPHCArray.length == 0) {
    //    SPHCArray = {
    //        SNo: 0,
    //        AWBSNo: 0,
    //        SPHCCode: "",
    //        UnNo: "",
    //        SPHCClassSNo: 0,
    //        HAWBSNo: 0,
    //        IsRadioActive: false,
    //        MCBookingSNo: 0,
    //        SubRisk: "",
    //        RamCat: "",
    //        UnPackingGroupImpCode: "",
    //        Caox: "",
    //        ImpCode: ""
    //    };
    //}
    var FlightArray = [];
    $("div[id$='areaTrans_shipment_shipmentitinerary']").find("[id^='areaTrans_shipment_shipmentitinerary']").each(function () {
        if ($(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").key() != "") {
            var FlightViewModel = {
                DailyFlightSNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").key(),
                BoardPoint: $(this).find("[id^='Text_BoardPoint']").data("kendoAutoComplete").key(),
                OffPoint: $(this).find("[id^='Text_offPoint']").data("kendoAutoComplete").key(),
                FlightDate: cfi.CfiDate($(this).find("[id^='FlightDate']").attr("id")),
                FlightNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").value()
            };
            FlightArray.push(FlightViewModel);
        }
    });

    var DalyFlghtSno, Origin, Dest, ValidFlag, Messg;
    ValidFlag = true;
    DlyFlghtSno = $("#Text_FlightNo").data("kendoAutoComplete").key();
    Origin = $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();
    Dest = $("#Text_ShipmentDestination").data("kendoAutoComplete").key();
    if (DalyFlghtSno > 0) {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/ValidateCutoffTime?DlyFlghtSno=" + DlyFlghtSno + "&Origin=" + Origin + "&Dest=" + Dest, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "") {
                    Messg = result;
                    ValidFlag = false;
                }
            }
        });

    }

    if (ValidFlag == false) {
        ShowMessage('warning', 'Warning - Reservation [' + awbNo + ']', Messg, "bottom-right");
        return false;
    }

    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveAcceptance", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBNo: $("#AWBNo").val(), AWBSNo: awbSNo, ShipmentInformation: ShipmentInfo, AwbSPHC: ShipmentSPHCArray, listItineraryInformation: FlightArray, AWBSPHCTrans: SPHCArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "") {
                //cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                ShowMessage('success', 'Success - Reservation', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                $("#btnSave").unbind("click");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Reservation [' + awbNo + ']', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Reservation', "AWB No. [" + awbNo + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
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

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='FWBImportDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";
