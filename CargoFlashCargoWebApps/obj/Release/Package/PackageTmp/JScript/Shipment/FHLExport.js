/*********** Declare variables ********************/
var SearchDocsDataSource = [{ Key: "1", Text: "Invoice" }, { Key: "2", Text: "Consignee AWB Copy" }, { Key: "3", Text: "Packing List" }, { Key: "4", Text: "Doc Type" }, { Key: "5", Text: "Bank" }];
var SearchTypeDataSource = [{ Key: "1", Text: "Delivery Order" }, { Key: "2", Text: "Physical Delivery" }];
var SearchBillToDataSource = [{ Key: "0", Text: "Agent" }];
var SearchChargeDataSource = [{ Key: "0", Text: "CC" }, { Key: "1", Text: "PP" }];
var IsPopUp = true;
var IsHouseAwb = false;
var IsPart = false;
var DLVSNo;
var InvoiceNo;
var awbType;
var DOType = "Full";
var shipmentType = "";
var totalHandlingCharges = 0;
var totalAmountDO = 0;
var totalServiceCharges = 0;
var MendatoryHandlingCharges = new Array();
var rowId;
var pValue = 0;
var sValue = 0;
var IsPartDo = 0;
var IsHouseDo = 0;
var FOCConsigneeSNo = 0;
var subprocesssno;
var temp = "";
var PaymentRow = '';

$(function () {
    //$('body').bind('cut copy paste', function (e) {
    //    e.preventDefault();
    //});


    //$(document).on('drop', function () {


    //    return false;
    //})




    //_CURR_PRO_ = "FHLExport";
    //_CURR_OP_ = "Master Delivery Order";
    //$("#licurrentop").html(_CURR_OP_);
    //$("#divSearch").html("");
    //$("#divDeliveryOrderDetails").html("");
    //CleanUI()
    //FHLSearch();


    MasterFHL();
    //$('#__divfhlexportsearch__').html("")
    //CleanUI()
    //FHLSearch();





});

function MasterFHL() {
    _CURR_PRO_ = "FHLExport";
    _CURR_OP_ = "Master Delivery Order";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divDeliveryOrderDetails").html("");
    CleanUI();
    $.ajax({
        //url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/FHLSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        url: "Services/Shipment/FHLExportService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FHLExportSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            $("#divbody table[id='__tblfhlexportsearch__']").remove();
            //$('#divDeliveryOrderDetails table:first tbody tr:first').remove();

            //$('#Text_searchAirline').remove();
            //$('#Text_searchFlightNo').remove();
            //$('#Text_searchAWBNo').remove();
            //$('#searchFromDate').remove();
            //$('#searchToDate').remove();
            //$('#SearchConsignee').remove();
            //$('#Text_searchSPHC').remove();
            //$('#SearchIncludeTransitAWB').remove();
            //$('#SearchExcludeDeliveredAWB').remove();
            //$('#btnSearch').remove();
            //$('#searchToDate').remove();
            //$('#SearchConsignee').remove();
            //$("#divbody");
            //cfi.AutoComplete("searchAirline", "CarrierCode,AirlineName", "Airline", "CarrierCode", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            //cfi.AutoComplete("searchFlightNo", "FlightNo", "v_DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            //cfi.AutoComplete("searchAWBNo", "AWBNo", "Awb", "AWBNo", "AWBNo", ["AWBNo"], null, "contains");
            //cfi.AutoComplete("searchSPHC", "Code,Description", "SPHC", "Code", "Description", ["Code", "Description"], null, "contains");
            //$('#searchFromDate').data("kendoDatePicker").value("");
            //$('#searchToDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            //$("#btnSearch").bind("click", function () {
            CleanUI();
            FHLSearch();

            //});


        }
    });
}

function CleanUI() {
    //$("#divXRAY").hide();
    ////$("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    ////$("#tblShipmentInfo").hide();
    //$("#divNewBooking").html("");
    $("#btnSave").unbind("click");
    $("#btnPrint").unbind("click");
    //$("#divXRAY").hide();

    //$("#ulTab").hide();
    //$("#divDetail_SPHC").html("");
    //$("#divDetailSHC").html("");

    //$("#divTab3").html("");
    //$("#divTab4").html("");
    //$("#divTab5").html("");
    $("#tabstrip").hide();
    $("#btnSave").css("display", "block");
    $("#btnUpdate").css("display", "none");
}

function FHLSearch() {
    var searchAirline = "0";
    var searchFlightNo = "0";
    var searchAWBNo = "0";
    var searchSPHC = "0";
    var SearchConsignee = "A~A";
    var SearchIncludeTransitAWB = userContext.CityCode;
    var SearchExcludeDeliveredAWB = "0";
    var LoggedInCity = "DEL";
    var searchFromDate = "0";
    var searchToDate = "0";
    //if ($("#searchFromDate").val() != "") {
    //    searchFromDate = cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate");// "";//month + "-" + day + "-" + year;
    //}

    //if ($("#searchToDate").val() != "") {
    //    searchToDate = cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate");// "";//month + "-" + day + "-" + year;
    //}


    if (_CURR_PRO_ == "FHLExport") {
        cfi.ShowIndexView("divDeliveryOrderDetails", "Services/Shipment/FHLExportService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/FHLExport/" + searchAirline.trim() + "/" + searchFlightNo.trim() + "/" + searchAWBNo.trim() + "/" + searchFromDate.trim() + "/" + searchToDate.trim() + "/" + SearchIncludeTransitAWB.trim() + "/" + SearchExcludeDeliveredAWB.trim() + "/" + LoggedInCity.trim() + "/" + searchSPHC.trim() + "/" + SearchConsignee.trim());
    }
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
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //else {
                    //    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //}
                }
            }
        }
    });
    $("#SearchIncludeTransitAWB").after("Include Transit AWB");
    $("#SearchExcludeDeliveredAWB").after("Exclude Delivered AWB");
}

function checkProgrss(item, subprocess, displaycaption) {
    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_P") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_P") >= 0) {
        return "\"partialprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }
}



function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    //$("#tblShipmentInfo").hide();
    $("#divNewDeliveryOrder").html("");
    $("#btnSave").css("display", "block");
    $("#btnUpdate").css("display", "none");
    $("#btnPrint").css("display", "none");
}

function BindEvents(obj, e, isdblclick) {
    subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    $("#divDetail").html('');
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
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
    var ArrivedShipmentSNoIndexs = 0;
    var ArrivedShipmentATAIndex = 0;

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    arrivedSNoIndex = trLocked.find("th[data-field='ArrivedShipmentSNo']").index();
    ArrivedShipmentATAIndex = trLocked.find("th[data-field='ATA']").index();
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
    currentdetination = closestTr.find("td:eq(" + destIndex + ")").text();
    CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    currentArrivedShipmentSNo = closestTr.find("td:eq(" + arrivedSNoIndex + ")").text();
    ArrivedShipmentATA = closestTr.find("td:eq(" + ArrivedShipmentATAIndex + ")").text();

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

function GetProcessSequence(processName) {
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

function InitializePage(subprocess, cntrlid, isdblclick) {
    //$("#tblShipmentInfo").show();
    InstantiateControl(cntrlid);
    $('#divDetail3').html("");
    $('#divDetail').show();

    UserSubProcessRights("divDetail", subprocesssno);

    $("#btnChargeNote").hide();
    $("#btnUpdate").hide();
    $("#btnSaveToNext").hide();
    $("#btnChargeNote").hide();
    $("#btnPrintDLV").hide();
    $("#btnPrint").hide();

    if (subprocess.toUpperCase() == "FHL") {
        BindFHLSection();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    FHLSearch();
                }
            }
            else {
                return false;
            }
        });
        return false;
    }


}

function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
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
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //else {
                    //    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //}
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

    //$("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
    //    var transid = this.id.replace("divareaTrans_", "");
    //    cfi.makeTrans(transid, null, null, null, null, null, null);
    //});
}

function ShowProcessDetails(subprocess, isdblclick) {
    $("#IdAWBPrint").css("display", "");
    $("#IdAcptNote").css("display", "");
    $("#IdEDINote").css("display", "");
    $("#ulTab").hide();
    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);

    if (subprocess.toUpperCase() == "FWB") {
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
            ShowProcessDetailsNew("FWB", "divDetail", isdblclick);
        });

        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBRATE", "divDetailSHC", isdblclick);
        });

        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBCUSTOMER", "divTab3", isdblclick);
        });

        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBHANDLING", "divTab4", isdblclick);
        });

        $('#tabstrip ul:first li:eq(4) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("FWBSUMMARY", "divTab5", isdblclick);
        });
    }

    if (subprocess.toUpperCase() == "LOCATION") {
        //$("#tblShipmentInfo").show();
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);
    }
    else if (subprocess.toUpperCase() == "FHL") {
        //$("#tblShipmentInfo").show();
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);
    }
    else {
        $.ajax({
            url: "Services/Shipment/FHLExportService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("DELIVERYORDER");
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

function ShowProcessDetailsNew(subprocess, divID, isdblclick) {
    if (subprocess == "FWBRATE") {
        $.ajax({
            url: "Services/Shipment/FHLExportService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetailSHC").html(result);
                if (result != undefined || result != "") {
                    $('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");

                    $('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                    $('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                    $('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");
                    GetProcessSequence("ACCEPTANCE");
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
            url: "Services/Shipment/FHLExportService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#" + divID).html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("ACCEPTANCE");
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

function ClearAutoComplete(e) {
    if (e == "Text_FHL_HAWB_SHI_CountryCode")
        cfi.ResetAutoComplete("FHL_HAWB_SHI_City");
    else if (e == "Text_FHL_HAWB_CON_CountryCode")
        cfi.ResetAutoComplete("FHL_HAWB_CON_City");
    else if (e == "Text_SHIPPER_CountryCode")
        cfi.ResetAutoComplete("SHIPPER_City");
    else if (e == "Text_CONSIGNEE_CountryCode")
        cfi.ResetAutoComplete("CONSIGNEE_City");
    else if (e == "Text_Notify_CountryCode")
        cfi.ResetAutoComplete("Notify_City");
}



function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}

function CalculateShipmentCBM() {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var volwt = ($("#VolumeWt").val() == "" ? 0 : parseFloat($("#VolumeWt").val()));
    var cbm = (volwt / 166.6667).toFixed(3);
    $("#CBM").val(cbm.toString());
    $("#_tempCBM").val(cbm.toString());
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
}

function CalculateShipmentChWt(obj) {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.6667;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='VolumeWt']").text(volwt.toFixed(3));
        $("#VolumeWt").val(volwt.toFixed(3));
        $("#_tempVolumeWt").val(volwt.toFixed(3));
    }

    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toFixed(3).toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
}

function compareGrossVolValue() {
    var gw = $("#GrossWt").val();
    var vw = $("#VolumeWt").val();
    var cw = $("#ChargeableWt").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#ChargeableWt").val() == "" ? "0" : $("#ChargeableWt").val()) < chwt) {
        $("#ChargeableWt").val(chwt);
        $("#_tempChargeableWt").val(chwt);
    }
}




function GetShipperConsigneeDetails(e) {
    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Shipment/FHLExportService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
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

    $(elem).find("input[id^='FHL_OCI_CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}

function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_import_fwbshipmentocitrans']").find("[id^='areaTrans_import_fwbshipmentocitrans']").each(function () {
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

    $(elem).closest("div[id$='areaTrans_shipment_fhlexportshipmentocitrans']").find("[id^='areaTrans_shipment_fhlexportshipmentocitrans']").each(function () {
        $(this).find("input[id^='FHL_OCI_CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}


function BindFHLSection() {
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/BindFHLSectionTable",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AWBSNO: currentawbsno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var theDiv = document.getElementById("divDetail");
            theDiv.innerHTML = "";
            var table = "<table class='appendGrid ui-widget' id='tblFHLSection'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Lot No</td><td class='ui-widget-header'>AWB No</td><td class='ui-widget-header'>No of House</td><td class='ui-widget-header'>Origin City</td><td class='ui-widget-header'>Destination City</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gross weight</td><td class='ui-widget-header'>Volume weight</td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'><tr id='tblFHLSection_Row_1'>";
            var FHLtable = "";
            var hdntblFHLPieces = 0;
            var hdntblFHLGrossWeight = 0;
            var hdnFHLVolumeWeight = 0;
            //var hdntblNoOfHouses=0;
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    table += "<td class='ui-widget-content first'>" + myData.Table0[0].SLINo + "<input type='hidden' id='SLISNo' value='" + myData.Table0[0].SLISNo + "'></input></td><td class='ui-widget-content first'>" + myData.Table0[0].AWBNo + "<input type='hidden' id='AWBSNo' value='" + myData.Table0[0].SNo + "'></input></td><td class='ui-widget-content first'>" + myData.Table0[0].NoOfHouse + "<input type='hidden' id='hdnNoOfHouse' value=" + myData.Table0[0].NoOfHouse + " /></td><td class='ui-widget-content first'>" + myData.Table0[0].Origin + "</td><td class='ui-widget-content first'>" + myData.Table0[0].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[0].TotalPieces + "<input type='hidden' id='hdnTotalPieces' value=" + myData.Table0[0].TotalPieces + " /></td><td class='ui-widget-content first'>" + myData.Table0[0].TotalGrossWeight + "<input type='hidden' id='hdnTotalGrossWeight' value=" + myData.Table0[0].TotalGrossWeight + " /></td><td class='ui-widget-content first'>" + myData.Table0[0].TotalVolumeWeight + "<input type='hidden' id='hdnTotalVolumeWeight' value=" + myData.Table0[0].TotalVolumeWeight + " /></td>";

                    if (myData.Table0[0].NoOfHouse > 0 && myData.Table1.length < myData.Table0[0].NoOfHouse) {
                        table += "<td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnSubmit' value=" + myData.Table0[0].AWBNo + " tabindex='16' class='btn btn-success' style='width:60px;' onclick='AddFHL();'><span class='ui-button-text'>Add</span></button></td>";
                    }
                    else
                        table += "<td class='ui-widget-content first'></td>";
                    table += "</tr></tbody></table>";

                    if (myData.Table1.length > 0) {
                        FHLtable = "</BR><table class='appendGrid ui-widget' id='tblFHL'><thead class='ui-widget-header' style='text-align:center'><tr><td colspan='12' class='ui-widget-header'>HAWB Information</td></tr><tr><td class='ui-widget-header'>HAWB No</td><td class='ui-widget-header'>Origin City</td><td class='ui-widget-header'>Destination City</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gross weight</td><td class='ui-widget-header'>Volume weight</td><td class='ui-widget-header'>Consignee Name</td><td class='ui-widget-header'>SHC</td><td class='ui-widget-header'>Freight Type</td><td class='ui-widget-header'>Nature of Goods</td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'>";

                        for (var i = 0; i < myData.Table1.length; i++) {
                            FHLtable += "<tr><td class='ui-widget-content first'>" + myData.Table1[i].HAWBNo + "</td><td class='ui-widget-content first'>" + myData.Table1[i].Origin + "</td><td class='ui-widget-content first'>" + myData.Table1[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table1[i].TotalPieces + "</td><td class='ui-widget-content first'>" + myData.Table1[i].TotalGrossWeight + "</td><td class='ui-widget-content first'>" + myData.Table1[i].TotalVolumeWeight + "</td><td class='ui-widget-content first'>" + myData.Table1[i].CustomerName.toUpperCase() + "</td><td class='ui-widget-content first'>" + myData.Table1[i].SPHC.toUpperCase() + "</td><td class='ui-widget-content first'>" + myData.Table1[i].FreightType + "</td><td class='ui-widget-content first'>" + myData.Table1[i].NatureOfGoods.toUpperCase() + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnUpdateFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='16' class='btn btn-success' style='width:50px;' onclick='UpdateFHL(" + myData.Table1[i].SNo + ");'><span class='ui-button-text'>Edit</span></button><button aria-disabled='false' role='button' title='Submit' type='button' id='btnViewFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='16' class='btn btn-success' style='width:50px;' onclick='ViewFHL(" + myData.Table1[i].SNo + ");'><span class='ui-button-text'>View</span></button><button aria-disabled='false' role='button' title='Submit' type='button' id='btnDeleteFHLGrid' value=" + myData.Table1[i].SNo + " tabindex='16' class='btn btn-danger' style='width:50px;' onclick='DeleteFHL(" + myData.Table1[i].SNo + ");'><span class='ui-button-text'>Delete</span></button></td></tr>";
                            //if (i != myData.Table1.length - 1) {
                            hdntblFHLPieces = parseInt(hdntblFHLPieces) + parseInt(myData.Table1[i].TotalPieces);
                            hdntblFHLGrossWeight = parseFloat(hdntblFHLGrossWeight) + parseFloat(myData.Table1[i].TotalGrossWeight);
                            hdnFHLVolumeWeight = parseFloat(hdnFHLVolumeWeight) + parseFloat(myData.Table1[i].TotalVolumeWeight);
                            // }
                        }
                        FHLtable += "<input type='hidden' id='hdntblFHLPieces' value=" + hdntblFHLPieces + " /><input type='hidden' id='hdntblFHLGrossWeight' value=" + hdntblFHLGrossWeight + " /><input type='hidden' id='hdnFHLVolumeWeight' value=" + hdnFHLVolumeWeight + " /><input type='hidden' id='hdntblCount' value=" + myData.Table1.length + " /><input type='hidden' id='hdntblrowFHLPieces' value='' /><input type='hidden' id='hdntblrowFHLGrossWeight' value='' /><input type='hidden' id='hdntblrowFHLVolumeWeight' value='' /><input type='hidden' id='hdntblrowFHLHawbNo' value='' /><input type='hidden' id='hdntblrowFHLIsEdi' value='' /></tbody></table>";
                    }
                    theDiv.innerHTML += table + FHLtable;
                }
                else {
                    var table = "<table class='appendGrid ui-widget' id='tblFHLSection'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                    theDiv.innerHTML += table;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function DeleteFHL(SNo) {
    if (confirm('Are you sure want to Delete this record ?')) {
        $.ajax({
            url: "Services/Shipment/FHLExportService.svc/DeleteFHL",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ HAWBSNo: SNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - HAWB', "HAWB Deleted Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                    flag = false;
                }
            }
        });
        BindFHLSection();
        $('#divDetail1').html('')

    }
    FHLSearch();
    // return flag;
}

function ViewFHL(SNo) {
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FHL/New/1",
        async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail1").html(result);
            cfi.AutoComplete("FHL_HAWB_Origin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Destination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            //cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SPHC", "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains", ",");
            cfi.AutoComplete("FHL_HAWB_AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");

            cfi.AutoComplete("FHL_HAWB_SHI_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

            cfi.AutoComplete("FHL_HAWB_CD_Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_Valuation", WeightValuation);
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_OtherCharge", WeightValuation);

            cfi.AutoComplete("FHL_OCI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
            cfi.AutoComplete("FHL_OCI_InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
            cfi.AutoComplete("FHL_OCI_CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

            $("input[id='FHL_HAWB_Pieces']").unbind("blur").bind("blur", function () {
                validatePcsFHL();
            });


            $("#FHL_HAWB_ChargeableWeight").unbind("blur").bind("blur", function () {
                //compareGrossVolValueFHL();
            });

            $("#FHL_HAWB_GrossWeight").unbind("blur").bind("blur", function () {
                //CalculateShipmentChWtFHL(this);
                // alert('hi')
            });

            $("#FHL_HAWB_VolumeWeight").unbind("blur").bind("blur", function () {
                //CalculateShipmentCBMFHL();
            });
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        }
    });

    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/BindHAWBSectionData",
        async: false, type: "get", dataType: "json", cache: false,
        data: { HAWBSNo: SNo },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var MainData = Data.Table0;
            var ocitransInfo = Data.Table1;
            var shipperData = Data.Table2;
            var consigneeData = Data.Table3;
            var harmonizedCommodity = Data.Table6;
            var textDescription = Data.Table7;

            //if (harmonizedCommodity.length > 0) {
            //$("#Text_HarmonizedCommodity").val(harmonizedCommodity[0].HarmonisedCommodity).attr("disabled", "disabled");
            // }
            // if (textDescription.length > 0) {
            //  $("#Text_HAWBDescription").val(textDescription[0].HAWBTextDescription).attr("disabled", "disabled");
            // }


            if (MainData.length > 0) {
                $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").setDefaultValue(MainData[0].OriginAirportSNo, MainData[0].OriginCityName);
                $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").setDefaultValue(MainData[0].DestinationAirportSNo, MainData[0].DestinationCityName);
                $("#FHL_HAWB_HAWBNo").val(MainData[0].HAWBNo);
                $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").setDefaultValue(MainData[0].CommoditySNo, MainData[0].CommodityCode);
                $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").setDefaultValue(MainData[0].AWBCurrencySNo, MainData[0].Currency);

                if (MainData[0].SPHCSNo.length > 0) {
                    if (MainData[0].SPHCSNo != "0" && MainData[0].SPHC != "") {
                        cfi.BindMultiValue("FHL_HAWB_SPHC", MainData[0].SPHC, MainData[0].SPHCSNo)
                        $("#FHL_HAWB_SPHC").val(MainData[0].SPHCSNo);
                    }
                }

                $("#FHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#_tempFHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#FHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $("#_tempFHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $("#FHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#_tempFHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#FHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#_tempFHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#FHL_HAWB_NatureofGoods").val(MainData[0].NatureOfGoods);
                $("#FHL_HAWB_DescriptionofGoods").val(MainData[0].DescriptionOfGoods);
                $("#FHL_HAWB_HarmonisedCommodityCode").val(MainData[0].HarmonisedCommodityCode);

                if (MainData[0].IsFreightPrepaid == "False") {
                    $('input:radio[name=FHL_HAWB_FreightType]')[1].checked = true;
                }
                else {
                    $('input:radio[name=FHL_HAWB_FreightType]')[0].checked = true;
                }

                $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDCurrencyCode, MainData[0].CVDCurrencyCode);
                $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDWeightValuation, MainData[0].CVDWeightValuationtxt);
                $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDOtherCharges, MainData[0].CVDOtherChargesTxt);
                $("#FHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue);
                $("#_tempFHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue);
                $("#FHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue);
                $("#_tempFHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue);
                $("#FHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue);
                $("#_tempFHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue);
                $("#FHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge);
                $("#_tempFHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge);

                cfi.makeTrans("shipment_fhlexportshipmentocitrans", null, null, BindFHLCountryCodeAutoComplete, ReBindFHLCountryCodeAutoComplete, null, ocitransInfo);
                cfi.makeTrans("shipment_hawbharmonisedcommoditytrans", null, null, BindHarmonizedCommodity, REBindHarmonizedCommodity, null, harmonizedCommodity);
                InstantiateControl("divareaTrans_shipment_hawbharmonisedcommoditytrans")
                cfi.makeTrans("shipment_hawbdescription", null, null, null, null, null, textDescription);
                InstantiateControl("divareaTrans_shipment_hawbdescription")
                if (shipperData.length > 0) {
                    $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                    if (shipperData[0].ShipperAccountNo != "") {
                        $("#Text_FHL_HAWB_SHI_AccountNo").prop('disabled', true);
                        $("#chkFHL_HAWB_SHI_AccountNo").closest('td').hide();
                    }

                    $("#FHL_HAWB_SHI_Name").val(shipperData[0].ShipperName);
                    $("#FHL_HAWB_SHI_Street").val(shipperData[0].ShipperStreet);
                    $("#FHL_HAWB_SHI_TownLocation").val(shipperData[0].ShipperLocation);
                    $("#FHL_HAWB_SHI_State").val(shipperData[0].ShipperState);
                    $("#FHL_HAWB_SHI_PostalCode").val(shipperData[0].ShipperPostalCode);
                    $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                    $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                    $("#FHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#_tempFHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#FHL_HAWB_SHI_Email").val(shipperData[0].ShipperEMail);
                    $("#FHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                    $("#_tempFHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                }

                if (consigneeData.length > 0) {
                    $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                    if (consigneeData[0].ConsigneeAccountNo != "") {
                        $("#Text_FHL_HAWB_CON_AccountNo").prop('disabled', true);
                        $("#chkFHL_HAWB_CON_AccountNo").closest('td').hide();
                    }

                    $("#FHL_HAWB_CON_AccountNoName").val(consigneeData[0].ConsigneeName);
                    $("#FHL_HAWB_CON_Street").val(consigneeData[0].ConsigneeStreet);
                    $("#FHL_HAWB_CON_TownLocation").val(consigneeData[0].ConsigneeLocation);
                    $("#FHL_HAWB_CON_State").val(consigneeData[0].ConsigneeState);
                    $("#FHL_HAWB_CON_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                    $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                    $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                    $("#FHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#_tempFHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#FHL_HAWB_CON_Email").val(consigneeData[0].ConsigneeEMail);
                    $("#FHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                    $("#_tempFHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                }
                $("#btnSave").css("display", "none");
                $("#btnUpdate").css("display", "none");
            }

            $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_SPHC").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").enable(false);
            $("#FHL_HAWB_Pieces").attr("disabled", "disabled");
            $("#FHL_HAWB_GrossWeight").attr("disabled", "disabled");
            $("#FHL_HAWB_VolumeWeight").attr("disabled", "disabled");
            $("#FHL_HAWB_ChargeableWeight").attr("disabled", "disabled");
            $("#FHL_HAWB_NatureofGoods").attr("disabled", "disabled");
            $("#FHL_HAWB_HarmonisedCommodityCode").attr("disabled", "disabled");
            $("#FHL_HAWB_HAWBNo").attr("disabled", "disabled");

            $("input[name='FHL_HAWB_FreightType']").each(function (i) {
                $(this).attr('disabled', 'disabled');
            });

            $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").enable(false);
            $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").enable(false);
            $("#FHL_HAWB_SHI_Name").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_Street").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_TownLocation").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_State").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_PostalCode").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_MobileNo").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_Email").attr("disabled", "disabled");
            $("#FHL_HAWB_SHI_Fax").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_AccountNoName").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_Street").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_TownLocation").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_State").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_PostalCode").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_MobileNo").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_Email").attr("disabled", "disabled");
            $("#FHL_HAWB_CON_Fax").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_DecCarriageVal").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_DecCustomsVal").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_Insurance").attr("disabled", "disabled");
            $("#FHL_HAWB_CD_ValuationCharge").attr("disabled", "disabled");

            $("#divareaTrans_shipment_fhlexportshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
                $(i).find("[id^='Text_FHL_OCI_CountryCode']").data("kendoAutoComplete").enable(false);
                $(i).find("[id^='Text_FHL_OCI_InfoType']").data("kendoAutoComplete").enable(false);
                $(i).find("[id^='Text_FHL_OCI_CSControlInfoIdentifire']").data("kendoAutoComplete").enable(false);
                $(i).find("[id^='FHL_OCI_SCSControlInfoIdentifire']").attr("disabled", "disabled");
                $(i).find("[id^='transActionDiv']").attr("style", "display: none;");
            });

            $("#divareaTrans_shipment_hawbharmonisedcommoditytrans table tr[data-popup='false']").each(function (row, i) {
                $(this).find('input:text[id^="HarmonizedCommodity"]').attr("disabled", "disabled");
                $(i).find("[id^='transActionDiv']").attr("style", "display: none;");


            });
            $("#divareaTrans_shipment_hawbdescription table tr[data-popup='false']").each(function (row, i) {
                $(this).find('input:text[id^="HAWBDescription"]').attr("disabled", "disabled");
                $(i).find("[id^='transActionDiv']").attr("style", "display: none;");
            });


        },
        error: {
        }
    });
}

function UpdateFHL(SNo) {
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FHL/New/1",
        async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail1").html(result);
            cfi.AutoComplete("FHL_HAWB_Origin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Destination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            //cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SPHC", "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains", ",");
            cfi.AutoComplete("FHL_HAWB_AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CD_Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_Valuation", WeightValuation);
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_OtherCharge", WeightValuation);
            cfi.AutoComplete("FHL_OCI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
            cfi.AutoComplete("FHL_OCI_InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
            cfi.AutoComplete("FHL_OCI_CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

            $("input[id='FHL_HAWB_Pieces']").unbind("blur").bind("blur", function () {
                validatePcsFHL();
            });

            $("#FHL_HAWB_ChargeableWeight").unbind("blur").bind("blur", function () {
                Zero(this);
            });

            $("#FHL_HAWB_GrossWeight").unbind("blur").bind("blur", function () {
                Zero(this);
                validateWtFHL();
            });

            $("#FHL_HAWB_VolumeWeight").unbind("blur").bind("blur", function () {
                Zero(this);
                validateValWtFHL();
            });
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        }
    });

    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/BindHAWBSectionData",
        async: false, type: "get", dataType: "json", cache: false,
        data: { HAWBSNo: SNo },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var MainData = Data.Table0;
            var ocitransInfo = Data.Table1;
            var shipperData = Data.Table2;
            var consigneeData = Data.Table3;
            var harmonizedCommodity = Data.Table6;
            var textDescription = Data.Table7;


            if (MainData.length > 0) {
                $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").setDefaultValue(MainData[0].OriginAirportSNo, MainData[0].OriginCityName);
                $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").setDefaultValue(MainData[0].DestinationAirportSNo, MainData[0].DestinationCityName);
                $("#FHL_HAWB_HAWBNo").val(MainData[0].HAWBNo);
                $("#hdntblrowFHLHawbNo").val(MainData[0].HAWBNo)
                $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").setDefaultValue(MainData[0].CommoditySNo, MainData[0].CommodityCode);
                $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").setDefaultValue(MainData[0].AWBCurrencySNo, MainData[0].Currency);
                //  $("#Text_HarmonizedCommodity").val(MainData[0].HarmonisedCommodity);
                // $("#Text_HAWBDescription").val(MainData[0].HAWBTextDescription);

                if (MainData[0].SPHCSNo.length > 0) {
                    if (MainData[0].SPHCSNo != "0" && MainData[0].SPHC != "") {
                        cfi.BindMultiValue("FHL_HAWB_SPHC", MainData[0].SPHC, MainData[0].SPHCSNo)
                        $("#FHL_HAWB_SPHC").val(MainData[0].SPHCSNo);
                    }
                }

                $("#FHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#_tempFHL_HAWB_Pieces").val(MainData[0].TotalPieces);
                $("#hdntblrowFHLPieces").val(MainData[0].TotalPieces);
                $("#hdntblrowFHLIsEdi").val(MainData[0].IsEdi)
                $("#FHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $("#_tempFHL_HAWB_GrossWeight").val(MainData[0].TotalGrossWeight);
                $("#hdntblrowFHLGrossWeight").val(MainData[0].TotalGrossWeight);
                $("#FHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#hdntblrowFHLVolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#_tempFHL_HAWB_VolumeWeight").val(MainData[0].TotalVolumeWeight);
                $("#FHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#_tempFHL_HAWB_ChargeableWeight").val(MainData[0].TotalChargeableWeight);
                $("#FHL_HAWB_NatureofGoods").val(MainData[0].NatureOfGoods);
                $("#FHL_HAWB_DescriptionofGoods").val(MainData[0].DescriptionOfGoods);
                //$("#FHL_HAWB_HarmonisedCommodityCode").val(MainData[0].HarmonisedCommodityCode);
                //$("#_tempFHL_HAWB_HarmonisedCommodityCode").val(MainData[0].HarmonisedCommodityCode);


                if (MainData[0].IsFreightPrepaid == "False") {
                    $('input:radio[name=FHL_HAWB_FreightType]')[1].checked = true;
                }
                else {
                    $('input:radio[name=FHL_HAWB_FreightType]')[0].checked = true;
                }

                $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDCurrencyCode, MainData[0].CVDCurrencyCode);
                $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDWeightValuation, MainData[0].CVDWeightValuationtxt);
                $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").setDefaultValue(MainData[0].CVDOtherCharges, MainData[0].CVDOtherChargesTxt);
                $("#FHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue == "0.000" ? '' : MainData[0].CVDDeclareCarriageValue);
                $("#_tempFHL_HAWB_CD_DecCarriageVal").val(MainData[0].CVDDeclareCarriageValue == "0.000" ? '' : MainData[0].CVDDeclareCarriageValue);
                $("#FHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue == "0.000" ? '' : MainData[0].CVDDeclareCustomValue);
                $("#_tempFHL_HAWB_CD_DecCustomsVal").val(MainData[0].CVDDeclareCustomValue == "0.000" ? '' : MainData[0].CVDDeclareCustomValue);
                $("#FHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue == "0.000" ? '' : MainData[0].CVDDeclareInsurenceValue);
                $("#_tempFHL_HAWB_CD_Insurance").val(MainData[0].CVDDeclareInsurenceValue == "0.000" ? '' : MainData[0].CVDDeclareInsurenceValue);
                $("#FHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge == "0.000" ? '' : MainData[0].CVDValuationCharge);
                $("#_tempFHL_HAWB_CD_ValuationCharge").val(MainData[0].CVDValuationCharge == "0.000" ? '' : MainData[0].CVDValuationCharge);

                cfi.makeTrans("shipment_fhlexportshipmentocitrans", null, null, BindFHLCountryCodeAutoComplete, ReBindFHLCountryCodeAutoComplete, null, ocitransInfo, 8);

                cfi.makeTrans("shipment_hawbharmonisedcommoditytrans", null, null, BindHarmonizedCommodity, REBindHarmonizedCommodity, null, harmonizedCommodity, 8);
                InstantiateControl("divareaTrans_shipment_hawbharmonisedcommoditytrans");
                cfi.makeTrans("shipment_hawbdescription", null, null, null, null, null, textDescription, 8);
                InstantiateControl("divareaTrans_shipment_hawbdescription");
                if (shipperData.length > 0) {
                    $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                    $("#FHL_HAWB_SHI_Name").val(shipperData[0].ShipperName);
                    $("#FHL_HAWB_SHI_Street").val(shipperData[0].ShipperStreet);
                    $("#FHL_HAWB_SHI_TownLocation").val(shipperData[0].ShipperLocation);
                    $("#FHL_HAWB_SHI_State").val(shipperData[0].ShipperState);
                    $("#FHL_HAWB_SHI_PostalCode").val(shipperData[0].ShipperPostalCode);
                    $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                    $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                    $("#FHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#_tempFHL_HAWB_SHI_MobileNo").val(shipperData[0].ShipperMobile);
                    $("#FHL_HAWB_SHI_Email").val(shipperData[0].ShipperEMail);
                    $("#FHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                    $("#_tempFHL_HAWB_SHI_Fax").val(shipperData[0].Fax);
                }

                if (consigneeData.length > 0) {
                    $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                    $("#FHL_HAWB_CON_AccountNoName").val(consigneeData[0].ConsigneeName);
                    $("#FHL_HAWB_CON_Street").val(consigneeData[0].ConsigneeStreet);
                    $("#FHL_HAWB_CON_TownLocation").val(consigneeData[0].ConsigneeLocation);
                    $("#FHL_HAWB_CON_State").val(consigneeData[0].ConsigneeState);
                    $("#FHL_HAWB_CON_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                    $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                    $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                    $("#FHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#_tempFHL_HAWB_CON_MobileNo").val(consigneeData[0].ConsigneeMobile);
                    $("#FHL_HAWB_CON_Email").val(consigneeData[0].ConsigneeEMail);
                    $("#FHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                    $("#_tempFHL_HAWB_CON_Fax").val(consigneeData[0].Fax);
                }
                $("#btnSave").css("display", "none");
                $("#btnUpdate").css("display", "block");


                $("#FHL_HAWB_HAWBNo").blur(function () {
                    if ($("#FHL_HAWB_HAWBNo").val() != '' && $("#FHL_HAWB_HAWBNo").val() != undefined) {
                        var HAWBNo = $("#FHL_HAWB_HAWBNo").val().toUpperCase();
                        var AWBSNo = $("input[type='hidden'][id='AWBSNo']").val();
                        var SLISNo = $("input[type='hidden'][id='SLISNo']").val();
                        if ($('#hdntblrowFHLHawbNo').val() != HAWBNo) {
                            GetHAWBNoDetails(HAWBNo, AWBSNo, SLISNo);
                        }
                    }
                });


                CheckCommodityCode();

                $("#btnUpdate").unbind("click").bind("click", function () {
                    //if (flag = true) {
                    if (cfi.IsValidSection('divDetail1')) {
                        if (UpdateFHLData('FHL', SNo)) {
                            FHLSearch();
                        }
                    }
                    else {
                        return false;
                    }
                    // }
                    //else
                    //{
                    //    return false;
                    //}
                });
            }

        },
        error: {
        }
    });
}

function BindHarmonizedCommodity() {
    CheckCommodityCode();
}
function REBindHarmonizedCommodity() {
    CheckCommodityCode();
}

function CheckCommodityCode() {
    $('#divareaTrans_shipment_hawbharmonisedcommoditytrans table tbody tr[id^="areaTrans_shipment_hawbharmonisedcommoditytrans"]').find('input:text[id^="HarmonizedCommodity"]').keypress(function (event) {
        var key = event.which;
        //var valu = $("#HoldPieces").val();
        //alert(valu)

        if (!(key >= 48 && key <= 57))
            event.preventDefault();

    });



    $('#divareaTrans_shipment_hawbharmonisedcommoditytrans table tbody tr[id^="areaTrans_shipment_hawbharmonisedcommoditytrans"]').find('input:text[id^="HarmonizedCommodity"]').blur(function () {
        var value = $(this).val();
        var ID = $(this).attr('id')
        var Length = $(this).val().length;
        if (Length != 0) {
            if (Length < 6 || Length > 18) {
                if (Length < 6) {
                    jAlert('Length can not be less than 6', 'Alert Dialog');
                    $('#' + ID).val("");
                    $('#_temp' + ID).val("");

                }
                //if (Length > 19) {
                //    jAlert('Length can not be greater than 18', 'Alert Dialog');
                //    $('#' + ID).val("");
                //    $('#_temp' + ID).val("");
                //}
            }
        }
    });
}

function AddFHL() {
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/FHL/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail1").html(result);
            cfi.AutoComplete("FHL_HAWB_Origin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Destination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            // cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_Commodity", "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SPHC", "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains", ",");
            cfi.AutoComplete("FHL_HAWB_AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_SHI_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetailsFHL, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearAutoComplete, "contains");
            cfi.AutoComplete("FHL_HAWB_CON_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("FHL_HAWB_CD_Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_Valuation", WeightValuation);
            cfi.AutoCompleteByDataSource("FHL_HAWB_CD_OtherCharge", WeightValuation);
            cfi.AutoComplete("FHL_OCI_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
            cfi.AutoComplete("FHL_OCI_InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
            cfi.AutoComplete("FHL_OCI_CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

            if (result != undefined || result != "") {
                InitializePage("FHL", "divDetail1");
            }

            $("input[id='FHL_HAWB_Pieces']").unbind("blur").bind("blur", function () {
                validatePcsFHL();
            });

            $("#FHL_HAWB_ChargeableWeight").unbind("blur").bind("blur", function () {
                Zero(this);
            });

            $("#FHL_HAWB_GrossWeight").unbind("blur").bind("blur", function () {
                Zero(this);
                validateWtFHL();
            });

            $("#FHL_HAWB_VolumeWeight").unbind("blur").bind("blur", function () {
                Zero(this);
                validateValWtFHL();

            });





            CheckCommodityCode();

            //$('div[id^="transActionDiv"]').unbind("click").bind("click", function () {
            //    alert('hi')
            //})



            $("#btnSave").css("display", "block");
            $("#btnUpdate").css("display", "none");
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        }
    });

    cfi.makeTrans("shipment_fhlexportshipmentocitrans", null, null, BindFHLCountryCodeAutoComplete, ReBindFHLCountryCodeAutoComplete, null, null, 8);
    cfi.makeTrans("shipment_hawbharmonisedcommoditytrans", null, null, BindHarmonizedCommodity, REBindHarmonizedCommodity, null, null, 8);
    cfi.makeTrans("shipment_hawbdescription", null, null, null, null, null, null, 8);

    $("#FHL_HAWB_HAWBNo").blur(function () {
        if ($("#FHL_HAWB_HAWBNo").val() != '' && $("#FHL_HAWB_HAWBNo").val() != undefined) {
            var HAWBNo = $("#FHL_HAWB_HAWBNo").val().toUpperCase();
            var AWBSNo = $("input[type='hidden'][id='AWBSNo']").val();
            var SLISNo = $("input[type='hidden'][id='SLISNo']").val();
            if ($('#hdntblrowFHLHawbNo').val() != HAWBNo) {
                GetHAWBNoDetails(HAWBNo, AWBSNo, SLISNo);
            }
        }
    });

    $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").setDefaultValue(userContext.CurrencySNo, userContext.CurrencyCode);
  
}
function GetHAWBNoDetails(HAWBNo, AWBSNo, SLISNo) {
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/GetHAWBNoDetailsFromSLIDetails?HAWBNo=" + HAWBNo + "&AWBSNo=" + AWBSNo + "&SLISNo=" + SLISNo,
        async: false, type: "GET", dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var HAWBDetails = resData.Table0;
            var HAWBShiperConsig = resData.Table1;
            if (HAWBDetails.length > 0 && HAWBDetails[0].EMessage != undefined) {
                if ($("#FHL_HAWB_HAWBNo").val().length > 0) {
                    ShowMessage('warning', 'Information', HAWBDetails[0].EMessage);
                    $("#FHL_HAWB_HAWBNo").val('');
                }

            }
            else {
                if (HAWBDetails.length > 0) {
                    $('#FHL_HAWB_Origin').val(HAWBDetails[0].OriginAirportSNo);
                    $('#Text_FHL_HAWB_Origin').val(HAWBDetails[0].OriginAirportName);
                    $('#FHL_HAWB_Destination').val(HAWBDetails[0].DestinationAirportSNo);
                    $('#Text_FHL_HAWB_Destination').val(HAWBDetails[0].DestinationAirportName);
                    $('#FHL_HAWB_Commodity').val(HAWBDetails[0].CommoditySNo);
                    $('#Text_FHL_HAWB_Commodity').val(HAWBDetails[0].CommodityDescription);
                    $('#FHL_HAWB_SPHC').val(HAWBDetails[0].SPHCCode);
                    //$('#Text_FHL_HAWB_SPHC').val(HAWBDetails[0].SPHCDescription);
                    cfi.BindMultiValue("FHL_HAWB_SPHC", HAWBDetails[0].SPHCDescription, HAWBDetails[0].SPHCCode);
                    $('#FHL_HAWB_Pieces').val(HAWBDetails[0].TotalPieces);
                    $('#_tempFHL_HAWB_Pieces').val(HAWBDetails[0].TotalPieces);
                    $('#_tempFHL_HAWB_GrossWeight').val(HAWBDetails[0].TotalGrossWeight);
                    $('#FHL_HAWB_GrossWeight').val(HAWBDetails[0].TotalGrossWeight);
                    $('#FHL_HAWB_VolumeWeight').val(HAWBDetails[0].TotalVolumeWeight);
                    $('#_tempFHL_HAWB_VolumeWeight').val(HAWBDetails[0].TotalVolumeWeight);
                    $('#_tempFHL_HAWB_ChargeableWeight').val(HAWBDetails[0].TotalChargeableWeight);
                    $('#FHL_HAWB_ChargeableWeight').val(HAWBDetails[0].TotalChargeableWeight);
                    $('#FHL_HAWB_AWBCurrency').val(HAWBDetails[0].AWBCurrencySNo);
                    $('#Text_FHL_HAWB_AWBCurrency').val(HAWBDetails[0].AWBCurrencyName);
                    $('#FHL_HAWB_NatureofGoods').val(HAWBDetails[0].NatureOfGoods);
                    if (HAWBDetails[0].ChargeCode == '1')
                        $('input[type="radio"][data-radioval="Prepaid"]').click();
                    if (HAWBDetails[0].ChargeCode == '2')
                        $('input[type="radio"][data-radioval="Collect"]').click();
                }
                if (HAWBShiperConsig.length > 0) {
                    if (HAWBShiperConsig[0].CustomerTypeSNo == 5) {

                        $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").setDefaultValue(HAWBShiperConsig[0].CAccountSNo, HAWBShiperConsig[0].CAccountNo);
                        $("#FHL_HAWB_SHI_Name").val(HAWBShiperConsig[0].CustomerName);
                        $("#FHL_HAWB_SHI_Street").val(HAWBShiperConsig[0].Street);
                        $("#FHL_HAWB_SHI_TownLocation").val(HAWBShiperConsig[0].Location);
                        $("#FHL_HAWB_SHI_State").val(HAWBShiperConsig[0].State);
                        $("#FHL_HAWB_SHI_PostalCode").val(HAWBShiperConsig[0].PostalCode);
                        //$("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(HAWBShiperConsig[0].CountrySNo, HAWBShiperConsig[0].CountryCode + '-' + HAWBShiperConsig[0].CountryName);

                        $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(HAWBShiperConsig[0].CountrySno, HAWBShiperConsig[0].CountryCode + '-' + HAWBShiperConsig[0].CountryName);


                        $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue(HAWBShiperConsig[0].CitySno, HAWBShiperConsig[0].CityCode + '-' + HAWBShiperConsig[0].CityName);
                        $("#FHL_HAWB_SHI_MobileNo").val(HAWBShiperConsig[0].Phone);
                        $("#_tempFHL_HAWB_SHI_MobileNo").val(HAWBShiperConsig[0].Phone);
                        $("#FHL_HAWB_SHI_Email").val(HAWBShiperConsig[0].EMail);
                        $("#_tempFHL_HAWB_SHI_Fax").val(HAWBShiperConsig[0].FAX);
                        $("#FHL_HAWB_SHI_Fax").val(HAWBShiperConsig[0].FAX);

                    }
                    if (HAWBShiperConsig[1].CustomerTypeSNo == 6) {

                        $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").setDefaultValue(HAWBShiperConsig[1].CAccountSNo, HAWBShiperConsig[1].CAccountNo);
                        $("#FHL_HAWB_CON_AccountNoName").val(HAWBShiperConsig[1].CustomerName);
                        $("#FHL_HAWB_CON_Street").val(HAWBShiperConsig[1].Street);
                        $("#FHL_HAWB_CON_TownLocation").val(HAWBShiperConsig[1].Location);
                        $("#FHL_HAWB_CON_State").val(HAWBShiperConsig[1].State);
                        $("#FHL_HAWB_CON_PostalCode").val(HAWBShiperConsig[1].PostalCode);
                        $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue(HAWBShiperConsig[1].CitySno, HAWBShiperConsig[1].CityCode + '-' + HAWBShiperConsig[1].CityName);
                        $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue(HAWBShiperConsig[1].CountrySno, HAWBShiperConsig[1].CountryCode + '-' + HAWBShiperConsig[1].CountryName);
                        $("#FHL_HAWB_CON_MobileNo").val(HAWBShiperConsig[1].Phone);
                        $("#_tempFHL_HAWB_CON_MobileNo").val(HAWBShiperConsig[1].Phone);
                        $("#FHL_HAWB_CON_Email").val(HAWBShiperConsig[1].EMail);
                        $("#_tempFHL_HAWB_CON_Fax").val(HAWBShiperConsig[1].FAX);
                        $("#FHL_HAWB_CON_Fax").val(HAWBShiperConsig[1].FAX);
                    }
                }
                else {
                    if ($("#FHL_HAWB_HAWBNo").val().length > 0 && HAWBDetails.length == 0) {
                        //ShowMessage('warning', 'Information', "HAWB No-" + $("#FHL_HAWB_HAWBNo").val().toUpperCase() + " does not belong to this MAWB");
                        //$("#FHL_HAWB_HAWBNo").val('');
                    }

                }
            }
        },
        error: function (ex) {
            ShowMessage('warning', 'FHL', '' + ex);
        }
    });
}

function Zero(e) {
    if (parseFloat($("#" + e.id).val()) <= 0) {
        if (e.id == "FHL_HAWB_GrossWeight")
            ShowMessage('warning', 'Warning - House Air WayBill', "Gross Weight can not be less than or equal to 0.", "bottom-right");
        else if (e.id == "FHL_HAWB_VolumeWeight")
            ShowMessage('warning', 'Warning - House Air WayBill', "Volume Weight can not be less than or equal to 0.", "bottom-right");
        else
            ShowMessage('warning', 'Warning - House Air WayBill', "Chargeable Weight can not be less than or equal to 0.", "bottom-right");

        $("#" + e.id).val('');
        $("#" + e.id).focus();
        return false;
    }
}

function validatePcsFHL() {
    var totalPcs = $("#hdnTotalPieces").val();
    var countPcs = 0;
    var updatedrowpieces = 0;
    var pcsOnUpdate = $("#FHL_HAWB_Pieces").val();

    if (pcsOnUpdate == "")
        pcsOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs
    countPcs = $("#hdntblFHLPieces").val();
    updatedrowpieces = $("#hdntblrowFHLPieces").val();
    if (countPcs == "" || countPcs == undefined)
        countPcs = 0;

    if (updatedrowpieces == "" || updatedrowpieces == undefined)
        updatedrowpieces = 0;
    if (tblCount > 0) {
        if (parseInt(updatedrowpieces) == 0)
            var MaxTotalPieces = (parseInt(totalPcs) - (parseInt(countPcs) - parseInt(updatedrowpieces)) - (parseInt(NoOfHouse) - parseInt(tblCount))) + 1
        else
            var MaxTotalPieces = (parseInt(totalPcs) - (parseInt(countPcs) - parseInt(updatedrowpieces)) - (parseInt(NoOfHouse) - parseInt(tblCount)))
    }
    else
        var MaxTotalPieces = (parseInt(totalPcs) - parseInt(NoOfHouse)) + 1;
    if (parseInt($("#FHL_HAWB_Pieces").val()) > MaxTotalPieces) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Pieces can not be greater than " + MaxTotalPieces + ".", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }
    //if (tblCount != NoOfHouse) {
    //    if (((parseInt(countPcs) - parseInt(updatedrowpieces)) + parseInt(pcsOnUpdate)) > parseInt(MaxTotalPieces)) {
    //        ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces can not be eqal  AWB total pieces.", "bottom-right");
    //        $("#FHL_HAWB_Pieces").val('');
    //        return false;
    //    }
    //}


    if (parseInt($("#FHL_HAWB_Pieces").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Pieces can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (((parseInt(countPcs) - parseInt(updatedrowpieces)) + parseInt(pcsOnUpdate)) > parseInt(totalPcs)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces can not be exceed from AWB total pieces.", "bottom-right");
        $("#FHL_HAWB_Pieces").val('');
        return false;
    }

    if (updatedrowpieces == 0) {
        if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
            if (((parseInt(countPcs) - parseInt(updatedrowpieces)) + parseInt(pcsOnUpdate)) != parseInt(totalPcs)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces should be equal to AWB pieces.", "bottom-right");
                $("#FHL_HAWB_Pieces").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((parseInt(countPcs) - parseInt(updatedrowpieces)) + parseInt(pcsOnUpdate)) != parseInt(totalPcs)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of pieces should be equal to AWB pieces.", "bottom-right");
                $("#FHL_HAWB_Pieces").val('');
                return false;
            }
        }
    }
    if ($("#hdntblrowFHLIsEdi").val() != "True") {
        calcPcs();
        var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
        var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
        var expectedChWt = (shipmentGrWt > shipmentVolWt ? shipmentGrWt : shipmentVolWt);
        $("[id$='FHL_HAWB_ChargeableWeight']").val(expectedChWt.toFixed(2));
        $("[id$='_tempFHL_HAWB_ChargeableWeight']").val(expectedChWt.toFixed(2));
    }
}

function validateWtFHL() {
    var totalGrossWeight = $("#hdnTotalGrossWeight").val();
    //var GrossWeightOnUpdate = $("#FHL_HAWB_GrossWeight").val();



    //var totalPcs = $("#hdnTotalPieces").val();
    var countGrossWeight = 0;
    var updatedrowGrossWeight = 0;
    var GrossWeightOnUpdate = $("#FHL_HAWB_GrossWeight").val();

    if (GrossWeightOnUpdate == "")
        GrossWeightOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total added pcs
    countGrossWeight = $("#hdntblFHLGrossWeight ").val();
    updatedrowGrossWeight = $("#hdntblrowFHLGrossWeight").val();
    if (countGrossWeight == "" || countGrossWeight == undefined)
        countGrossWeight = 0;

    if (updatedrowGrossWeight == "" || updatedrowGrossWeight == undefined)
        updatedrowGrossWeight = 0;

    //  var MaxGrossWeight = totalGrossWeight * NoOfHouse / 100;


    if (tblCount > 0) {
        if (parseFloat(updatedrowGrossWeight) == 0)
            var MaxTotalGrossWeight = ((parseFloat(totalGrossWeight) - (parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100))) + 0.01).toFixed(3);
        else
            var MaxTotalGrossWeight = ((parseFloat(totalGrossWeight) - (parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100)))).toFixed(3)
    }
    else
        var MaxTotalGrossWeight = ((parseFloat(totalGrossWeight) - parseFloat(NoOfHouse / 100)) + 0.01).toFixed(3);





    //if (tblCount > 0) {
    //if (parseFloat(updatedrowGrossWeight) == 0)
    //    var MaxTotalGrossWeight = (parseFloat(totalGrossWeight) - (parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) - (parseFloat(NoOfHouse) - parseFloat(tblCount))) + 0.01
    //else {
    //    var a = (parseFloat(NoOfHouse) - parseFloat(tblCount)) / 100;
    //    var MaxTotalGrossWeight = (parseFloat(totalGrossWeight) - (parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) - (a))
    //}
    //}
    //else
    //    var MaxTotalGrossWeight = (parseFloat(totalGrossWeight) - (parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) - (parseFloat(NoOfHouse) - parseFloat(tblCount))) + 0.01
    if (parseFloat($("#FHL_HAWB_GrossWeight").val()) > MaxTotalGrossWeight) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Gross Weight can not be greater than " + MaxTotalGrossWeight + ".", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }



    if (parseFloat($("#FHL_HAWB_GrossWeight").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Gross Weight can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (((parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) + parseFloat(GrossWeightOnUpdate)) > parseFloat(totalGrossWeight)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total  Gross Weight can not be exceed from AWB total GrossWeight.", "bottom-right");
        $("#FHL_HAWB_GrossWeight").val('');
        return false;
    }

    if (updatedrowGrossWeight == 0) {
        if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
            if (((parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) + parseFloat(GrossWeightOnUpdate)) != parseFloat(totalGrossWeight)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total  Gross Weight should be equal to AWB GrossWeight.", "bottom-right");
                $("#FHL_HAWB_GrossWeight").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((parseFloat(countGrossWeight) - parseFloat(updatedrowGrossWeight)) + parseFloat(GrossWeightOnUpdate)) != parseFloat(totalGrossWeight)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total  Gross Weight should be equal to AWB GrossWeight.", "bottom-right");
                $("#FHL_HAWB_GrossWeight").val('');
                return false;
            }
        }
    }
    //if ($("#hdntblrowFHLIsEdi").val() != "True") {
    //    calcPcs();
    //    var shipmentGrWt = parseFloat($("#FHL_HAWB_GrossWeight").val());
    //    var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
    //    var expectedChWt = (shipmentGrWt > shipmentVolWt ? shipmentGrWt : shipmentVolWt);
    //    $("[id$='FHL_HAWB_ChargeableWeight']").val(expectedChWt);
    //    $("[id$='_tempFHL_HAWB_ChargeableWeight']").val(expectedChWt);

    //}
    if ($("#FHL_HAWB_VolumeWeight").val() > $("#FHL_HAWB_GrossWeight").val()) {
        $("#FHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_VolumeWeight").val().toString());
        $("#_tempFHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_VolumeWeight").val().toString());
    }
    else {
        $("#FHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_GrossWeight").val().toString());
        $("#_tempFHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_GrossWeight").val().toString());
    }


}


function validateValWtFHL() {
    var totalVolumeWeight = $("#hdnTotalVolumeWeight").val();
    //var VolumeWeightOnUpdate = $("#FHL_HAWB_VolumeWeight").val();



    //var totalPcs = $("#hdnTotalPieces").val();
    var countVolumeWeight = 0;
    var updatedrowVolumeWeight = 0;
    var VolumeWeightOnUpdate = $("#FHL_HAWB_VolumeWeight").val();

    if (VolumeWeightOnUpdate == "")
        VolumeWeightOnUpdate = 0;

    var NoOfHouse = $("#hdnNoOfHouse").val();
    if (NoOfHouse == "" || NoOfHouse == undefined)
        NoOfHouse = 0;

    var tblCount = $("#hdntblCount").val();
    if (tblCount == "" || tblCount == undefined)
        tblCount = 0;

    // Count total fhed pcs
    countVolumeWeight = $("#hdnFHLVolumeWeight").val();
    updatedrowVolumeWeight = $("#hdntblrowFHLVolumeWeight").val();
    if (countVolumeWeight == "" || countVolumeWeight == undefined)
        countVolumeWeight = 0;

    if (updatedrowVolumeWeight == "" || updatedrowVolumeWeight == undefined)
        updatedrowVolumeWeight = 0;

    //  var MaxVolumeWeight = totalVolumeWeight * NoOfHouse / 100;


    if (tblCount > 0) {
        if (parseFloat(updatedrowVolumeWeight) == 0)
            var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100))) + 0.01).toFixed(3);
        else
            var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse / 100) - parseFloat(tblCount / 100)))).toFixed(3)
    }
    else
        var MaxTotalVolumeWeight = ((parseFloat(totalVolumeWeight) - parseFloat(NoOfHouse / 100)) + 0.01).toFixed(3);





    //if (tblCount > 0) {
    //if (parseFloat(updatedrowVolumeWeight) == 0)
    //    var MaxTotalVolumeWeight = (parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse) - parseFloat(tblCount))) + 0.01
    //else {
    //    var a = (parseFloat(NoOfHouse) - parseFloat(tblCount)) / 100;
    //    var MaxTotalVolumeWeight = (parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (a))
    //}
    //}
    //else
    //    var MaxTotalVolumeWeight = (parseFloat(totalVolumeWeight) - (parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) - (parseFloat(NoOfHouse) - parseFloat(tblCount))) + 0.01
    if (parseFloat($("#FHL_HAWB_VolumeWeight").val()) > MaxTotalVolumeWeight) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Volume Weight can not be greater than " + MaxTotalVolumeWeight + ".", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        return false;
    }



    if (parseFloat($("#FHL_HAWB_VolumeWeight").val()) <= 0) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Volume Weight can not be less than or equal to 0.", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        return false;
    }

    if (((parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) + parseFloat(VolumeWeightOnUpdate)) > parseFloat(totalVolumeWeight)) {
        ShowMessage('warning', 'Warning - House Air WayBill', "Total number of Volume Weight can not be exceed from AWB total VolumeWeight.", "bottom-right");
        $("#FHL_HAWB_VolumeWeight").val('');
        return false;
    }

    if (updatedrowVolumeWeight == 0) {
        if (NoOfHouse > 0 && (parseInt(tblCount) + 1) == NoOfHouse) {
            if (((parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) + parseFloat(VolumeWeightOnUpdate)) != parseFloat(totalVolumeWeight)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of Volume Weight should be equal to AWB VolumeWeight.", "bottom-right");
                $("#FHL_HAWB_VolumeWeight").val('');
                return false;
            }
        }
    }
    else {
        if (NoOfHouse > 0 && tblCount == NoOfHouse) {
            if (((parseFloat(countVolumeWeight) - parseFloat(updatedrowVolumeWeight)) + parseFloat(VolumeWeightOnUpdate)) != parseFloat(totalVolumeWeight)) {
                ShowMessage('warning', 'Warning - House Air WayBill', "Total number of Volume Weight should be equal to AWB VolumeWeight.", "bottom-right");
                $("#FHL_HAWB_VolumeWeight").val('');
                return false;
            }
        }
    }
    //if ($("#hdntblrowFHLIsEdi").val() != "True") {
    //    calcPcs();
    //    var shipmentGrWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
    //    var shipmentVolWt = parseFloat($("#FHL_HAWB_VolumeWeight").val());
    //    var expectedChWt = (shipmentGrWt > shipmentVolWt ? shipmentGrWt : shipmentVolWt);
    //    $("[id$='FHL_HAWB_ChargeableWeight']").val(expectedChWt);
    //    $("[id$='_tempFHL_HAWB_ChargeableWeight']").val(expectedChWt);
    //}
    if ($("#FHL_HAWB_VolumeWeight").val() > $("#FHL_HAWB_GrossWeight").val()) {
        $("#FHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_VolumeWeight").val().toString());
        $("#_tempFHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_VolumeWeight").val().toString());
    }
    else {
        $("#FHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_GrossWeight").val().toString());
        $("#_tempFHL_HAWB_ChargeableWeight").val($("#FHL_HAWB_GrossWeight").val().toString());
    }


}




function calcPcs() {


    var updatedrowpieces = $("#hdntblrowFHLPieces").val();
    if (updatedrowpieces == "" || updatedrowpieces == undefined)
        updatedrowpieces = 0;


    var updatedrowGrossWeight = $("#hdntblrowFHLGrossWeight").val();
    if (updatedrowGrossWeight == "" || updatedrowGrossWeight == undefined)
        updatedrowGrossWeight = 0;

    var updatedrowVolumeWeight = $("#hdntblrowFHLVolumeWeight").val();
    if (updatedrowVolumeWeight == "" || updatedrowVolumeWeight == undefined)
        updatedrowVolumeWeight = 0;
    //var FHLPieces = $('#hdntblFHLPieces').val();
    //var hdntblFHLGrossWeight = $('#hdntblFHLGrossWeight').val();
    //var hdnFHLVolumeWeight = $('#hdnFHLVolumeWeight').val();
    // var gr = $('#hdntblFHLGrossWeight').val();
    var tblrowcount = updatedrowGrossWeight > 0 ? 1 : 0;
    var tblCount = $("#hdntblCount").val() == undefined ? 0 : $("#hdntblCount").val();

    var countHouse = $("#hdnNoOfHouse").val() - tblCount + tblrowcount;
    var countFhlGrossWeight = $('#hdntblFHLGrossWeight').val() == undefined ? 0 : $('#hdntblFHLGrossWeight').val();
    var countFhlVolumeWeight = $('#hdnFHLVolumeWeight').val() == undefined ? 0 : $('#hdnFHLVolumeWeight').val();
    var totalMinWeight = countHouse * 0.01;
    var remainGrossWeight = ($('#hdnTotalGrossWeight').val() - countFhlGrossWeight).toFixed(3);
    var remaingVolweight = ($('#hdnTotalVolumeWeight').val() - countFhlVolumeWeight).toFixed(3);

    if ($('#hdntblFHLPieces').val() != undefined)
        var totalPcs = $("#hdnTotalPieces").val() - ($('#hdntblFHLPieces').val() - updatedrowpieces);
    else
        var totalPcs = $("#hdnTotalPieces").val()
    if ($("#hdntblFHLGrossWeight").val() != undefined)
        var totalGWt = $("#hdnTotalGrossWeight").val() - ($('#hdntblFHLGrossWeight').val() - updatedrowGrossWeight);
    else
        var totalGWt = $("#hdnTotalGrossWeight").val();
    if ($('#hdnFHLVolumeWeight').val() != undefined)
        var totalVWt = $("#hdnTotalVolumeWeight").val() - ($('#hdnFHLVolumeWeight').val() - updatedrowVolumeWeight);
    else
        var totalVWt = $("#hdnTotalVolumeWeight").val()



    var spGWt = parseFloat(totalGWt) / parseInt(totalPcs);
    var spVWt = parseFloat(totalVWt) / parseInt(totalPcs);
    if ($("#FHL_HAWB_Pieces").val() != "") {
        if (remainGrossWeight > totalMinWeight)
            var calcGwt = parseInt($("#FHL_HAWB_Pieces").val()) * parseFloat(spGWt);
        else
            var calcGwt = 0.01;

        $("#FHL_HAWB_GrossWeight").val(calcGwt.toFixed(3));
        $("#_tempFHL_HAWB_GrossWeight").val(calcGwt.toFixed(3));
        if (remaingVolweight > totalMinWeight)
            var calcVwt = (parseInt($("#FHL_HAWB_Pieces").val()) * (parseFloat(spVWt) * 166.66)) / 166.66;
        else
            calcVwt = 0.01;
        $("#FHL_HAWB_VolumeWeight").val(calcVwt.toFixed(3));
        $("#_tempFHL_HAWB_VolumeWeight").val(calcVwt.toFixed(3));
    }
    else {
        $("#FHL_HAWB_VolumeWeight").val("0.00");
        $("#FHL_HAWB_GrossWeight").val("0.00");
        $("#_tempFHL_HAWB_VolumeWeight").val("0.00");
        $("#_tempFHL_HAWB_GrossWeight").val("0.00");
    }
}

function CalculateShipmentCBMFHL() {
    var grosswt = ($("#FHL_HAWB_GrossWeight").val() == "" ? 0 : parseFloat($("#FHL_HAWB_GrossWeight").val()));
    var volwt = ($("#FHL_HAWB_VolumeWeight").val() == "" ? 0 : parseFloat($("#FHL_HAWB_VolumeWeight").val()));
    var cbm = (volwt / 166.6667).toFixed(3);
    $("#CBM").val(cbm.toString());
    $("#_tempCBM").val(cbm.toString());
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#FHL_HAWB_ChargeableWeight").val(chwt.toString());
    $("#_tempFHL_HAWB_ChargeableWeight").val(chwt.toFixed(3).toString());
}

function CalculateShipmentChWtFHL(obj) {
    var grosswt = ($("#FHL_HAWB_GrossWeight").val() == "" ? 0 : parseFloat($("#FHL_HAWB_GrossWeight").val()));
    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.6667;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='FHL_HAWB_VolumeWeight']").text(volwt.toFixed(3));
        $("#FHL_HAWB_VolumeWeight").val(volwt.toFixed(3));
        $("#_tempFHL_HAWB_VolumeWeight").val(volwt.toFixed(3));
    }

    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#FHL_HAWB_ChargeableWeight").val(chwt.toFixed(3).toString());
    $("#_tempFHL_HAWB_ChargeableWeight").val(chwt.toFixed(3).toString());
}

function compareGrossVolValueFHL() {
    var gw = $("#FHL_HAWB_GrossWeight").val();
    var vw = $("#FHL_HAWB_VolumeWeight").val();
    var cw = $("#FHL_HAWB_ChargeableWeight").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#FHL_HAWB_ChargeableWeight").val() == "" ? "0" : $("#FHL_HAWB_ChargeableWeight").val()) < chwt) {
        $("#FHL_HAWB_ChargeableWeight").val(chwt);
        $("#_tempFHL_HAWB_ChargeableWeight").val(chwt);
    }
}

function GetShipperConsigneeDetailsFHL(e) {
    var UserTyp = (e == "Text_FHL_HAWB_SHI_AccountNo" || e == "Text_FHL_HAWB_SHI_Name") ? "S" : "C";
    var FieldType = (e == "Text_FHL_HAWB_SHI_Name" || e == "Text_FHL_HAWB_CON_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Shipment/FHLExportService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#FHL_HAWB_SHI_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#FHL_HAWB_SHI_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#FHL_HAWB_SHI_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#FHL_HAWB_SHI_State").val(shipperConsigneeData[0].ShipperState);
                        $("#FHL_HAWB_SHI_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#FHL_HAWB_SHI_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempFHL_HAWB_SHI_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#FHL_HAWB_SHI_Email").val(shipperConsigneeData[0].ShipperEMail);
                    }
                    else if (UserTyp == "C") {
                        $("#FHL_HAWB_CON_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#FHL_HAWB_CON_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#FHL_HAWB_CON_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#FHL_HAWB_CON_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#FHL_HAWB_CON_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#FHL_HAWB_CON_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempFHL_HAWB_CON_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#FHL_HAWB_CON_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                    }
                }
                else {
                    if (UserTyp == "S") {
                        $("#FHL_HAWB_SHI_Name").val('');
                        $("#FHL_HAWB_SHI_Street").val('');
                        $("#FHL_HAWB_SHI_TownLocation").val('');
                        $("#FHL_HAWB_SHI_State").val('');
                        $("#FHL_HAWB_SHI_PostalCode").val('');
                        $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#FHL_HAWB_SHI_MobileNo").val('');
                        $("#_tempFHL_HAWB_SHI_MobileNo").val('');
                        $("#FHL_HAWB_SHI_Email").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#FHL_HAWB_CON_AccountNoName").val('');
                        $("#FHL_HAWB_CON_Street").val('');
                        $("#FHL_HAWB_CON_TownLocation").val('');
                        $("#FHL_HAWB_CON_State").val('');
                        $("#FHL_HAWB_CON_PostalCode").val('');
                        $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#FHL_HAWB_CON_MobileNo").val('');
                        $("#_tempFHL_HAWB_CON_MobileNo").val('');
                        $("#FHL_HAWB_CON_Email").val('');
                    }
                }
            },
            error: {
            }
        });
    }
}

function BindFHLCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='FHL_OCI_CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}

function ReBindFHLCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_fhlexportshipmentocitrans']").find("[id^='areaTrans_shipment_fhlexportshipmentocitrans']").each(function () {
        $(this).find("input[id^='FHL_OCI_CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function CheckBankConsigned(e) {
    if (e == 'BankConsigned' || e == 'BankReleaseReceived') {
        if ($("[id='BankConsigned']:checked").val() == 'on' || $("[id='BankReleaseReceived']:checked").val() == 'on' || $("[id='BankConsigned']:checked").val() == 'True' || $("[id='BankReleaseReceived']:checked").val() == 'True') {
            $('#DocsName').attr('data-valid', 'required');
            $('#DocsName').attr('data-valid-msg', 'Please Attach Document.');
        }
        else {
            $('#DocsName').removeAttr('data-valid');
            $('#DocsName').removeAttr('data-valid-msg');
            $('#DocsName').closest('td').find('.valid_errmsg').css('display', 'none');
        }
    }
    else {
        if ($("[id='BankConsigned_'" + e.split('_')[1] + "]:checked").val() == 'on' || $("[id='BankReleaseReceived'" + e.split('_')[1] + "]:checked").val() == 'on' || $("[id='BankConsigned_'" + e.split('_')[1] + "]:checked").val() == 'True' || $("[id='BankReleaseReceived'" + e.split('_')[1] + "]:checked").val() == 'True') {
            $('#DocsName_' + e.split('_')[1]).attr('data-valid', 'required');
            $('#DocsName_' + e.split('_')[1]).attr('data-valid-msg', 'Please Attach Document.');
        }
        else {
            $('#DocsName_' + e.split('_')[1]).removeAttr('data-valid');
            $('#DocsName_' + e.split('_')[1]).removeAttr('data-valid-msg');
            $('#DocsName_' + e.split('_')[1]).closest('td').find('.valid_errmsg').css('display', 'none');
        }
    }
}


function SaveFormData(subprocess) {
    var issave = false;
    if (subprocess.toUpperCase() == "FHL") {
        issave = SaveFHLinfo();
    }
    return issave;
}

function UpdateFHLData(subprocess, Sno) {
    var flag = false;
    var HAWBViewModel = {
        AWBSNo: currentawbsno,
        HAWBOrigin: $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").key(),
        HAWBDestination: $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").key(),
        HAWBNo: $("#FHL_HAWB_HAWBNo").val().toUpperCase(),
        HAWBCommodity: $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").key(),
        HAWBSPHC: $("#FHL_HAWB_SPHC").val(),
        HAWBPieces: $("#FHL_HAWB_Pieces").val(),
        HAWBGrossWeight: $("#FHL_HAWB_GrossWeight").val(),
        HAWBVolumeWeight: $("#FHL_HAWB_VolumeWeight").val(),
        HAWBChargeableWeight: $("#FHL_HAWB_ChargeableWeight").val(),
        HAWBAWBCurrency: $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").key(),
        HAWBNatureofGoods: $("#FHL_HAWB_NatureofGoods").val(),
        HAWBDescriptionOfGoods: $("#FHL_HAWB_DescriptionofGoods").val(),
        HAWBFreightType: ($("[id='FHL_HAWB_FreightType']:checked").val() == 0 ? "Prepaid" : "Collect"),
        HAWBHarmonisedCommodityCode: $("#FHL_HAWB_HarmonisedCommodityCode").val()
    };

    var ShipperViewModel = {
        ShipperAccountNo: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key() == "" ? null : $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(),
        //ShipperName: $("#Text_SHIPPER_Name").data("kendoAutoComplete").key(),
        ShipperName: $("#FHL_HAWB_SHI_Name").val().toUpperCase(),
        ShipperStreet: $("#FHL_HAWB_SHI_Street").val(),
        ShipperLocation: $("#FHL_HAWB_SHI_TownLocation").val(),
        ShipperState: $("#FHL_HAWB_SHI_State").val(),
        ShipperPostalCode: $("#FHL_HAWB_SHI_PostalCode").val(),
        ShipperCity: $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").key(),
        ShipperCountryCode: $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").key(),
        ShipperMobile: $("#FHL_HAWB_SHI_MobileNo").val(),
        ShipperEMail: $("#FHL_HAWB_SHI_Email").val(),
        ShipperFax: $("#FHL_HAWB_SHI_Fax").val(),
    };

    var ConsigneeViewMode = {
        ConsigneeAccountNo: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() == "" ? null : $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key(),
        //ConsigneeName: $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").key(),
        ConsigneeName: $("#FHL_HAWB_CON_AccountNoName").val().toUpperCase(),
        ConsigneeStreet: $("#FHL_HAWB_CON_Street").val(),
        ConsigneeLocation: $("#FHL_HAWB_CON_TownLocation").val(),
        ConsigneeState: $("#FHL_HAWB_CON_State").val(),
        ConsigneePostalCode: $("#FHL_HAWB_CON_PostalCode").val(),
        ConsigneeCity: $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").key(),
        ConsigneeCountryCode: $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").key(),
        ConsigneeMobile: $("#FHL_HAWB_CON_MobileNo").val(),
        ConsigneeEMail: $("#FHL_HAWB_CON_Email").val(),
        ConsigneeFax: $("#FHL_HAWB_CON_Fax").val(),
    };

    var ChargeDeclarationsViewMode = {
        ChargeDeclarationsCurrency: $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").key(),
        ChargeDeclarationsValuation: $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").key(),
        ChargeDeclarationsOtherCharge: $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").key(),
        ChargeDeclarationsDecCarriageVal: $("#FHL_HAWB_CD_DecCarriageVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCarriageVal").val(),
        ChargeDeclarationsDecCustomsVal: $("#FHL_HAWB_CD_DecCustomsVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCustomsVal").val(),
        ChargeDeclarationsInsurance: $("#FHL_HAWB_CD_Insurance").val() == "" ? 0.00 : $("#FHL_HAWB_CD_Insurance").val(),
        ChargeDeclarationsValuationCharge: $("#FHL_HAWB_CD_ValuationCharge").val() == "" ? 0.00 : $("#FHL_HAWB_CD_ValuationCharge").val(),
    };

    var OCIInfoModel = new Array();
    var HarmonizedCommodityCode = new Array();
    var HAWBNo = $("#FHL_HAWB_HAWBNo").val()
    var HawbDescription = new Array();
    var SliSNo = $('#SLISNo').val();

    $("#divareaTrans_shipment_fhlexportshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
        if (($(i).find('td:nth-child(2) input[type=text]').val() != '') && ($(i).find('td:nth-child(3) input[type=text]').val() != '') && ($(i).find('td:nth-child(4) input[type=text]').val() != '')) {
            OCIInfoModel.push({
                AWBSNo: currentawbsno,
                CountryCode: $(i).find("td:eq(1) > [id^='FHL_OCI_CountryCode']").val(),
                InfoType: $(i).find("td:eq(2) > [id^='FHL_OCI_InfoType']").val(),
                CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='FHL_OCI_CSControlInfoIdentifire']").val(),
                SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
            });
        }
    });

    $("#divareaTrans_shipment_hawbharmonisedcommoditytrans table tr[data-popup='false']").each(function (row, i) {
        //if ($(this).find('input:text[id^="HarmonizedCommodity"]').length < 6)
        //{
        //    return false;
        //}
        if ($(this).find('input:text[id^="HarmonizedCommodity"]').val() != "") {
            HarmonizedCommodityCode.push({
                harmonizedCommodityCode: $(this).find('input:text[id^="HarmonizedCommodity"]').val()

            })
        }

    });
    $("#divareaTrans_shipment_hawbdescription table tr[data-popup='false']").each(function (row, i) {
        if ($(this).find('input:text[id^="HAWBDescription"]').val() != "") {
            HawbDescription.push({
                hawbDescription: $(this).find('input:text[id^="HAWBDescription"]').val()
            })
        }

    });

    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/UpdateFHLinfoImport", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo, HAWBSNo: Sno, HAWBInformation: HAWBViewModel, ShipperInformation: ShipperViewModel, ConsigneeInformation: ConsigneeViewMode, ChargeDeclarationsInformation: ChargeDeclarationsViewMode, OCIInformation: OCIInfoModel, UpdatedBy: 2, ShipperSno: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(), ConsigneeSno: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (result == "0") {
                ShowMessage('success', 'Success - HAWB', "HAWB Updated Successfully", "bottom-right");
                BindFHLSection();
                var theFHLDiv = document.getElementById("divDetail1");
                theFHLDiv.innerHTML = "";
                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            flag = false;
        }
    });
    /*Added By Brajendra*/

    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/SaveFHLHarmonizedCommodity", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ HarmonizedCommodityCode: HarmonizedCommodityCode, HAWBNo: HAWBNo, SliSNo: SliSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {

                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
            flag = false;
        }
    });



    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/SaveFHLHAWBDescription", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ HawbDescription: HawbDescription, HAWBNo: HAWBNo, SliSNo: SliSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {

                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
            flag = false;
        }
    });

    /*Ended By Brajendra*/




    return flag;
}

function SaveFHLinfo() {
    var flag = false;
    var HAWBViewModel = {
        AWBSNo: currentawbsno,
        HAWBOrigin: $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").key(),
        HAWBDestination: $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").key(),
        HAWBNo: $("#FHL_HAWB_HAWBNo").val().toUpperCase(),
        HAWBCommodity: $("#Text_FHL_HAWB_Commodity").data("kendoAutoComplete").key(),
        HAWBSPHC: $("#FHL_HAWB_SPHC").val(),
        HAWBPieces: $("#FHL_HAWB_Pieces").val(),
        HAWBGrossWeight: $("#FHL_HAWB_GrossWeight").val(),
        HAWBVolumeWeight: $("#FHL_HAWB_VolumeWeight").val(),
        HAWBChargeableWeight: $("#FHL_HAWB_ChargeableWeight").val(),
        HAWBAWBCurrency: $("#Text_FHL_HAWB_AWBCurrency").data("kendoAutoComplete").key(),
        HAWBNatureofGoods: $("#FHL_HAWB_NatureofGoods").val(),
        HAWBDescriptionOfGoods: $("#FHL_HAWB_DescriptionofGoods").val(),
        HAWBFreightType: ($("[id='FHL_HAWB_FreightType']:checked").val() == 0 ? "Prepaid" : "Collect"),
        HAWBHarmonisedCommodityCode: $("#FHL_HAWB_HarmonisedCommodityCode").val()
    };

    var ShipperViewModel = {
        ShipperAccountNo: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key() == "" ? null : $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(),
        ShipperName: $("#FHL_HAWB_SHI_Name").val().toUpperCase(),
        ShipperStreet: $("#FHL_HAWB_SHI_Street").val(),
        ShipperLocation: $("#FHL_HAWB_SHI_TownLocation").val(),
        ShipperState: $("#FHL_HAWB_SHI_State").val(),
        ShipperPostalCode: $("#FHL_HAWB_SHI_PostalCode").val(),
        ShipperCity: $("#Text_FHL_HAWB_SHI_City").data("kendoAutoComplete").key(),
        ShipperCountryCode: $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").key(),
        ShipperMobile: $("#FHL_HAWB_SHI_MobileNo").val(),
        ShipperEMail: $("#FHL_HAWB_SHI_Email").val(),
        ShipperFax: $("#FHL_HAWB_SHI_Fax").val(),
    };

    var ConsigneeViewMode = {
        ConsigneeAccountNo: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() == "" ? null : $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key(),
        ConsigneeName: $("#FHL_HAWB_CON_AccountNoName").val().toUpperCase(),
        ConsigneeStreet: $("#FHL_HAWB_CON_Street").val(),
        ConsigneeLocation: $("#FHL_HAWB_CON_TownLocation").val(),
        ConsigneeState: $("#FHL_HAWB_CON_State").val(),
        ConsigneePostalCode: $("#FHL_HAWB_CON_PostalCode").val(),
        ConsigneeCity: $("#Text_FHL_HAWB_CON_City").data("kendoAutoComplete").key(),
        ConsigneeCountryCode: $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").key(),
        ConsigneeMobile: $("#FHL_HAWB_CON_MobileNo").val(),
        ConsigneeEMail: $("#FHL_HAWB_CON_Email").val(),
        ConsigneeFax: $("#FHL_HAWB_CON_Fax").val(),
    };

    var ChargeDeclarationsViewMode = {
        ChargeDeclarationsCurrency: $("#Text_FHL_HAWB_CD_Currency").data("kendoAutoComplete").key(),
        ChargeDeclarationsValuation: $("#Text_FHL_HAWB_CD_Valuation").data("kendoAutoComplete").key(),
        ChargeDeclarationsOtherCharge: $("#Text_FHL_HAWB_CD_OtherCharge").data("kendoAutoComplete").key(),
        ChargeDeclarationsDecCarriageVal: $("#FHL_HAWB_CD_DecCarriageVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCarriageVal").val(),
        ChargeDeclarationsDecCustomsVal: $("#FHL_HAWB_CD_DecCustomsVal").val() == "" ? 0.00 : $("#FHL_HAWB_CD_DecCustomsVal").val(),
        ChargeDeclarationsInsurance: $("#FHL_HAWB_CD_Insurance").val() == "" ? 0.00 : $("#FHL_HAWB_CD_Insurance").val(),
        ChargeDeclarationsValuationCharge: $("#FHL_HAWB_CD_ValuationCharge").val() == "" ? 0.00 : $("#FHL_HAWB_CD_ValuationCharge").val(),
    };

    var OCIInfoModel = new Array();
    var HarmonizedCommodityCode = new Array();
    var HAWBNo = $("#FHL_HAWB_HAWBNo").val()
    var HawbDescription = new Array();
    var SliSNo = $('#SLISNo').val();
    $("#divareaTrans_shipment_fhlexportshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
        if (($(i).find('td:nth-child(2) input[type=text]').val() != '') && ($(i).find('td:nth-child(3) input[type=text]').val() != '') && ($(i).find('td:nth-child(4) input[type=text]').val() != '')) {
            OCIInfoModel.push({
                AWBSNo: currentawbsno,
                CountryCode: $(i).find("td:eq(1) > [id^='FHL_OCI_CountryCode']").val(),
                InfoType: $(i).find("td:eq(2) > [id^='FHL_OCI_InfoType']").val(),
                CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='FHL_OCI_CSControlInfoIdentifire']").val(),
                SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
            });
        }
    });

    $("#divareaTrans_shipment_hawbharmonisedcommoditytrans table tr[data-popup='false']").each(function (row, i) {
        if ($(this).find('input:text[id^="HarmonizedCommodity"]').val() != "") {
            HarmonizedCommodityCode.push({
                harmonizedCommodityCode: $(this).find('input:text[id^="HarmonizedCommodity"]').val()

            })
        }

    });
    $("#divareaTrans_shipment_hawbdescription table tr[data-popup='false']").each(function (row, i) {
        if ($(this).find('input:text[id^="HAWBDescription"]').val() != "") {
            HawbDescription.push({
                hawbDescription: $(this).find('input:text[id^="HAWBDescription"]').val()
            })
        }

    });


    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/SaveFHLinfoImport", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo, HAWBInformation: HAWBViewModel, ShipperInformation: ShipperViewModel, ConsigneeInformation: ConsigneeViewMode, ChargeDeclarationsInformation: ChargeDeclarationsViewMode, OCIInformation: OCIInfoModel, UpdatedBy: 2, ShipperSno: $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_SHI_AccountNo").data("kendoAutoComplete").key(), ConsigneeSno: $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_FHL_HAWB_CON_AccountNo").data("kendoAutoComplete").key() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - HAWB', "HAWB Saved Successfully", "bottom-right");
                BindFHLSection();
                var theFHLDiv = document.getElementById("divDetail1");
                theFHLDiv.innerHTML = "";
                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            flag = false;
        }
    });


    /*Added By Brajendra*/
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/SaveFHLHarmonizedCommodity", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ HarmonizedCommodityCode: HarmonizedCommodityCode, HAWBNo: HAWBNo, SliSNo: SliSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {

                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
            flag = false;
        }
    });



    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/SaveFHLHAWBDescription", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ HawbDescription: HawbDescription, HAWBNo: HAWBNo, SliSNo: SliSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {

                flag = true;
            }
            else {
                ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - HAWB', "HAWB unable to process.", "bottom-right");
            flag = false;
        }
    });






    /*Ended By Brajedra*/



    return flag;
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId.indexOf("Text_FHL_HAWB_SHI_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").key());
        var filterShipperCityFHL = cfi.autoCompleteFilter(filter);
        return filterShipperCityFHL;
    }
    else if (textId.indexOf("Text_FHL_HAWB_CON_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").key());
        var filterConsigneeCityFHL = cfi.autoCompleteFilter(filter);
        return filterConsigneeCityFHL;
    }
    else if ((textId.indexOf("Text_FHL_HAWB_SHI_AccountNo") >= 0) || (textId.indexOf("Text_FHL_HAWB_SHI_Name") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "SHIPPER");
        var ShipperAccountFilterFHL = cfi.autoCompleteFilter(filter);
        return ShipperAccountFilterFHL;
    }
    else if ((textId.indexOf("Text_FHL_HAWB_CON_AccountNo") >= 0) || (textId.indexOf("Text_FHL_HAWB_CON_AccountNoName") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "CONSIGNEE");
        var ConsigneeFilterFHL = cfi.autoCompleteFilter(filter);
        return ConsigneeFilterFHL;
    }
    else if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        var filterShipperCity = cfi.autoCompleteFilter(filter);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_Commodity") >= 0) {
        if (parseInt($("#Text_SubGroupCommodity").data("kendoAutoComplete").key() || "0") > 0) {
            cfi.setFilter(filter, "SubGroupSNo", "eq", $("#Text_SubGroupCommodity").data("kendoAutoComplete").key());
            var CommodityFilter = cfi.autoCompleteFilter(filter);
            return CommodityFilter;
        }
    }
    else if (textId.indexOf("Text_SubGroupCommodity") >= 0) {
        if (parseInt($("#Text_Commodity").data("kendoAutoComplete").key() || "0") > 0) {
            cfi.setFilter(filter, "CommoditySNo", "eq", $("#Text_Commodity").data("kendoAutoComplete").key());
            CommoditySubGroupFilter = cfi.autoCompleteFilter(filter);
            return CommoditySubGroupFilter;
        }
    }
    else if (textId.indexOf("Text_Notify_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_Notify_CountryCode").data("kendoAutoComplete").key());
        var filterNotifyCity = cfi.autoCompleteFilter(filter);
        return filterNotifyCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        var filterConsigneeCity = cfi.autoCompleteFilter(filter);
        return filterConsigneeCity;
    }
        //else if (textId.indexOf("Text_IssuingAgent") >= 0) {
        //    cfi.setFilter(filterDo, "AirportSno", "eq", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        //    var filterAgent = cfi.autoCompleteFilter(filterDo);
        //    return filterAgent;
        //}
    else if (textId.indexOf("Text_FlightNo") >= 0) {
        cfi.setFilter(filter, "OriginAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(filter, "DestinationAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(filter, "FlightDate", "eq", cfi.CfiDate($("#" + textId).closest('tr').find("[id^='FlightDate']").attr('id')));
        var FlightOriginFilter = cfi.autoCompleteFilter(filter);
        return FlightOriginFilter;
    }
    else if (textId.indexOf("Text_Location") >= 0) {
        //var Origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
        //cfi.setFilter(filter, "WarehouseCity", "eq", Origin);
        //var LocaFilter = cfi.autoCompleteFilter(filter);
        //return LocaFilter;
    }
    else if (textId.indexOf("Text_SPHC") >= 0) {
        cfi.setFilter(filter, "IsDGR", "eq", "1");
        var SPHCFilter = cfi.autoCompleteFilter(filter);
        return SPHCFilter;
    }
    else if (textId.indexOf("Text_SpecialHandlingCode") >= 0) {
        cfi.setFilter(filter, "IsDGR", "eq", "0");
        var SPHCDGRFilter = cfi.autoCompleteFilter(filter);
        return SPHCDGRFilter;
    }
    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "SHIPPER");
        var ShipperAccountFilter = cfi.autoCompleteFilter(filter);
        return ShipperAccountFilter;
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "CONSIGNEE");
        var ConsigneeFilter = cfi.autoCompleteFilter(filter);
        return ConsigneeFilter;
    }
    else if (textId.indexOf("Text_SLINo") >= 0) {
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno);
        var filterSLINo = cfi.autoCompleteFilter(filter);
        return filterSLINo;
    }
    else if (textId == "Text_AuthorizedPerson") {
        cfi.setFilter(filter, "CustomerSNo", "eq", $("#Text_Consignee").data("kendoAutoComplete").key())
        var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
        return filterAuthorizedPerson;
    }
        //else if (textId == "Text_DocumentNo") {
        //    cfi.setFilter(filter, "CustomerSNo", "eq", $("#Text_Consignee").data("kendoAutoComplete").key())
        //    var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
        //    return filterAuthorizedPerson;
        //}
    else if (textId == "Text_HAWB") {
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
        var filterAuthorizedPerson = cfi.autoCompleteFilter([filter]);
        return filterAuthorizedPerson;
    }
    else if (textId == "Text_DONo") {
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
        cfi.setFilter(filter, "IsPayment", "eq", "0")
        var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
        return filterAuthorizedPerson;
    }
    else if (textId == "Text_FAD_ReportingStation") {
        cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
        var filterReportingStation = cfi.autoCompleteFilter([filter]);
        return filterReportingStation;
    }
    else if (textId == "Text_BillTo") {
        cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
        var filterBillTo = cfi.autoCompleteFilter([filter]);
        return filterBillTo;
    }
    else if (textId == "Text_ParticipantName") {
        if ($("#HAWB").val() != "") {
            cfi.setFilter(filter, "HAWBSNo", "eq", $("#HAWB").val())
            var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
            return filterAuthorizedPerson;
        }
        else {
            cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
            var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
            return filterAuthorizedPerson;
        }
    }
    else if (textId == "Text_FHL_HAWB_Origin") {
        cfi.setFilter(filter, "SNo", "neq", $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").key())
        var filterOrigintxt = cfi.autoCompleteFilter([filter]);
        return filterOrigintxt;
    }
    else if (textId == "Text_FHL_HAWB_Destination") {
        cfi.setFilter(filter, "SNo", "neq", $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").key())
        var filterOrigintxt = cfi.autoCompleteFilter([filter]);
        return filterOrigintxt;
    }
}





















function CheckUnCheck(obj) {
    if ($("#" + obj.id).is(":checked") == true) {
        $('#divDetail2').find("tr:gt(0)").each(function () {
            if ($(this).find("input[id^='chkFOC']").attr("id") != obj.id)
                chkFlag = $("#" + $(this).find("input[id^='chkFOC']").attr("id")).attr("disabled", true);
        });
    }
    else {
        $('#divDetail2').find("tr:gt(0)").each(function () {
            chkFlag = $("#" + $(this).find("input[id^='chkFOC']").attr("id")).attr("disabled", false);
        });
    }
    var currAmount = 0;
    if ($("#" + obj.id).is(":checked") == true) {
        currAmount = parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges);
        $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
    }
}






function GetHouseWiseData(valueId, value, keyId, key) {
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    $.ajax({
        url: "Services/Shipment/FHLExportService.svc/BindHAWBSectionData",
        async: false, type: "get", dataType: "json", cache: false,
        data: { HAWBSNo: key, AWBSNo: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo, DestCity: currentdetination },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var fdData = Data.Table0;
            var cData = Data.Table3;
            var hcData = Data.Table4;

            if (cData.length > 0) {
                $("span[id='HAWBConsigneeName']").text(cData[0].ConsigneeName);
            }

            if (fdData.length > 0) {
                ShipmentDetail = [];
                if (fdData != []) {
                    $(fdData).each(function (row, i) {
                        ShipmentDetail.push({ "pieces": i.TotalPieces, "_tempPieces": i.TotalPieces, "totalpieces": i.TotalPieces, "grossweight": i.TotalGrossWeight, "_tempGrossWeight": i.TotalGrossWeight, "totalgrossweight": i.TotalGrossWeight, "list": 1 });
                    });
                }

                cfi.makeTrans("import_doshipmenttypedetail", null, null, null, null, null, fdData);
                $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']:gt(0)").remove();
                $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                    $("#" + $(this).find("span").find("input")[0].id).val(ShipmentDetail[i]._tempPieces);
                    $("#" + $(this).find("span").find("input")[1].id).val(ShipmentDetail[i].Pieces);
                    $("span[id=" + $(this).find("span[id^='TotalPieces']").attr("id") + "]").text(ShipmentDetail[i].totalpieces);
                    $("#" + $(this).find("span").find("input")[2].id).val(ShipmentDetail[i]._tempGrossWeight);
                    $("#" + $(this).find("span").find("input")[3].id).val(ShipmentDetail[i].GrossWeight);
                    $("span[id=" + $(this).find("span[id^='TotalGrossWeight']").attr("id") + "]").text(ShipmentDetail[i].totalgrossweight);
                    $(this).find("div[id^='transActionDiv']").hide();
                });
            }

            if (hcData.length > 0) {
                /****************Handling Charge Information*************************************/
                MendatoryHandlingCharges = [];
                if (hcData != []) {
                    $(hcData).each(function (row, i) {
                        if (i.isMandatory == 1) {
                            MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "pbasis": i.PrimaryBasis == undefined ? "" : i.PrimaryBasis, "pvalue": i.pValue == undefined ? 0 : i.pValue, "sbasis": i.SecondryBasis == undefined ? "" : i.SecondryBasis, "svalue": i.sValue == undefined ? 0 : i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                            totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                        }
                    });
                }

                $("#divareaTrans_import_dohandlingcharge").html(temp);
                cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                if (MendatoryHandlingCharges.length > 0) {
                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue == undefined ? 0 : MendatoryHandlingCharges[i].pvalue);
                        $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue == undefined ? 0 : MendatoryHandlingCharges[i].pvalue);
                        $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                        $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue == undefined ? 0 : MendatoryHandlingCharges[i].svalue);
                        $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue == undefined ? 0 : MendatoryHandlingCharges[i].svalue);
                        $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                    });

                    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, null, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                        });
                    });
                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                        $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                        $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                        if (MendatoryHandlingCharges.length - 1 == i) {
                            $(this).find("div[id^='transActionDiv']").show();
                            if (MendatoryHandlingCharges.length > 1)
                                $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                        }
                    });
                }
                else {
                    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                        });
                        $(this).find("span[id^='Type']").text("E");
                        $(this).find("input[id^='WaveOff']").hide();
                    });
                }

                $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                    if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                        $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                        $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                    }
                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        },
        error: {
        }
    });
}
















function CheckValidation(obj) {
    if (obj.id.indexOf("Pieces") == 0) {
        var piecs = $("#" + obj.id).val();
        var totalPieces = $("#divareaTrans_import_doflightdetail").find("table").find("tr:gt(0)").find("td").find("span[id^='TotalPieces']").text().split("/")[1];
        if (Number(piecs) > Number(totalPieces)) {
            alert("Pieces should not be greater than Total Pieces");
            $("#" + obj.id).val($("#_temp" + obj.id).val());
        }
        else if (Number(piecs) == 0) {
            alert("Pieces should not be zero");
            $("#" + obj.id).val($("#_temp" + obj.id).val());
        }
        else {
            if (piecs != "") {
                var totalWt = $("#divareaTrans_import_doflightdetail").find("table").find("tr:gt(0)").find("td").find("span[id^='TotalGrossWeight']").text().split("/")[1];
                var actualWt = (Number(totalWt) / Number(totalPieces)) * Number(piecs);
                $("#" + obj.id).closest("tr").find("input[id^='_tempGrossWeight']").val(actualWt.toFixed(3));
                $("#" + obj.id).closest("tr").find("input[id^='GrossWeight']").val(actualWt.toFixed(3));
            }
            else
                $("#" + obj.id).val($("#_temp" + obj.id).val());
        }
    }

    if (obj.id.indexOf("GrossWeight") == 0) {
        var grossWeight = $("#" + obj.id).val();
        var totalgrossWeight = $("#divareaTrans_import_doflightdetail").find("table").find("tr:gt(0)").find("td").find("span[id^='TotalGrossWeight']").text().split("/")[1];
        if (Number(grossWeight) > Number(totalgrossWeight)) {
            alert("Gross Weight should not be greater than Total Gross Weight");
            $("#" + obj.id).val($("#_temp" + obj.id).val());
        }
        else if (Number(grossWeight) == 0) {
            alert("Gross Weight should not be zero");
            $("#" + obj.id).val($("#_temp" + obj.id).val());
        }
        else {
            var totalPieces = $("#divareaTrans_import_doflightdetail").find("table").find("tr:gt(0)").find("td").find("span[id^='TotalPieces']").text().split("/")[1];
            var pieces = $("#" + obj.id).closest("tr").find("input[id^='Pieces']").val();
            var wt = (Number(totalgrossWeight) / Number(totalPieces)) * Number(pieces).toFixed(3);
            var startWt = Number(wt) - (Number(wt) * .1);
            var endWt = Number(wt) + (Number(wt) * .1);
            if (Number(grossWeight) < Number(startWt) || Number(grossWeight) > Number(endWt)) {
                alert("Gross Weight should be vary between +/- 10% of actual Gross Weight");
                $("#" + obj.id).val($("#_temp" + obj.id).val());
            }
        }
    }

    if ($("#" + obj.id).val() == "" || $("#" + obj.id).val() == "0")
        $("#" + obj.id).val($("#_temp" + obj.id).val());

    HAWBSNo = 0;
    DOSNo = 0;
    PDSNo = 0;
    pValue = $("#" + obj.id).closest("tr").find("input[id^='GrossWeight']").val();
    sValue = 0;
    TariffSNo = 0;

    if (Number(pValue) > 0) {
        totalHandlingCharges = 0;
        totalAmountDO = 0;
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetHandlingChargesRecorde?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&DOType=" + DOType + "&DestCity=" + currentdetination + "&HAWBSNo=" + HAWBSNo + "&DOSNo=" + DOSNo + "&PDSNo=" + PDSNo + "&TariffSNo=" + TariffSNo + "&PValue=" + pValue + "&SValue=" + sValue, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var hcData = resData.Table0;

                /****************Handling Charge Information*************************************/
                MendatoryHandlingCharges = [];
                if (hcData != []) {
                    $(hcData).each(function (row, i) {
                        if (i.isMandatory == 1) {
                            MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                            totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                        }
                    });
                }
                $("#divareaTrans_import_dohandlingcharge").html(temp);
                cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                if (MendatoryHandlingCharges.length > 0) {
                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                        $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                        $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                        $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                        $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                        $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                    });

                    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, null, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                        });
                    });

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                        $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                        $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                        if (MendatoryHandlingCharges.length - 1 == i) {
                            $(this).find("div[id^='transActionDiv']").show();
                            if (MendatoryHandlingCharges.length > 1)
                                $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                        }
                    });
                }
                else {
                    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                        });
                        $(this).find("span[id^='Type']").text("E");
                        $(this).find("input[id^='WaveOff']").hide();
                    });
                }
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            },
            error: function (ex) {
                var ex = ex;
            }
        });
    }
}






var pageType = $('#hdnPageType').val();
var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;display:none' id='btnNew'>New Delivery Order</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' tabindex='68'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  tabindex='69' id='btnUpdate'>Update</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  tabindex='70' id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm'  id='btnCancel'>Cancel</button></td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnChargeNote'>Charge Note</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                             "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrintDLV'>Print DLV Slip</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                             "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrint'>Print</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divDeliveryOrderDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewDeliveryOrder' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>"; $