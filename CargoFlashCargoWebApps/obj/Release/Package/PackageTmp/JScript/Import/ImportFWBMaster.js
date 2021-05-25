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
var IsFWbComplete = false;
var IsFWBAmmendment = false
var IsFlightExist = false;
var _IS_DEPEND = false;
var paymentList = null;
var currentprocess = "";
var currentawbsno = 0;
var arrivedShipmentSNo = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var eDoxDataSource = [{ Key: "1", Text: "Invoice" }, { Key: "2", Text: "Security" }, { Key: "3", Text: "Others" }];
var IsFWBCheck = 0;
var IsDOCreated = 0;
var tblhtml;
var pageType = $('#hdnPageType').val();
var CurrentRow;
var paymentData;
var MendatoryPaymentCharges = new Array();

$(function () {
    ImportFWB();
});

function ImportFWB() {
    _CURR_PRO_ = "ImportFWB";
    _CURR_OP_ = "Import FWB";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetWebForm/" + _CURR_PRO_ + "/ImportFWB/ImportFWBSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            var rights = GetPageRightsByAppName("Import", "ImportFWB");
            if (!rights.IsNew) {
                $("#btnNew").remove();
            }
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNo", "ImportAwb", "AWBNo", "AWBNo", ["AWBNo"], null, "contains");

            $("#Text_searchOriginCity").hide();
            $("#Text_searchAWBPrefix").hide();
            $("#Text_searchDestinationCity").hide();

            $('#searchFlightDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ShipmentSearch();
            });
            CleanUI();
            ShipmentSearch();

        }
    });
}

function BindFlightChart(DailyFlightNo) {



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
    BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

}

function onRowChange(arg) {
    if (_CURR_PRO_ == "ImportFWB") {
    }
}

function onChange(arg) {

    if (_CURR_PRO_ == "ImportFWB") {

    }

}

function ShipmentSearch() {

    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val().trim();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val().trim();
    var FlightNo = $("#searchFlightNo").val() == "" ? "0" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }

    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "0" : $("#searchAWBPrefix").val().trim();
    var AWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val().trim();
    var LoggedInCity = userContext.CityCode;

    cfi.ShowIndexView("divShipmentDetails", "Services/Import/ImportFWBService.svc/GetGridData/" + _CURR_PRO_ + "/Import/ImportFWB/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity);
}

function AutoShipmentSearch(SubProcess) {
    $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
        if ($(e).text() == currentawbsno) {
            BindEvents($(e).parent().find("[process=" + SubProcess + "]"), event); return false;
        }
    });
}

function ReloadSameGridPage(subprocess) {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}

function BindSubProcess() {
    AutoShipmentSearch(currentprocess);
}

function checkProgrss(item, subprocess, displaycaption) {
    CleanUI();
    if (subprocess.toString() == "RESERVATION") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("RESERVATION") > -1) {
            if (item.indexOf("RESERVATION-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("RESERVATION-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("RESERVATION-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
}

function CleanUI() {
    $("#divXRAY").hide();
    $("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#divDetail2").html("");
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

function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            debugger
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

function ShowAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            var cancel = $(this).closest("tr").find("td:last").html();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId, addOnFunction: addOnFunction, addOnParmeter: cancel });
            }
        });
    });
}

function showAWBPrint() {
    window.open("http://ngenops.cargoflash.com/Shipment/GenerateAWB.aspx?AWBSNo=" + currentawbsno + "&HAWBSNo=");
}

function showAWBlbl() {
    ShowMessage('warning', 'Information!', "Printer Not Configured", "bottom-right");
}

function showAp() {
    window.open("AcceptanceNote.html?aId=" + currentawbsno);
}

function showPayRcpt() {
    window.open("http://localhost:9602/ReportBuilder/PaymentReceipt.aspx?AWBNo=" + printInvoiceSno + "&WMSCity=" + printorigin + "~WMSCity &HAWBSNo=");
}

function addOnFunction(content, obj, recId) {
    $("#header-user-options").find("a").css("display", "");
    if (recId.toUpperCase() == "YES") {
        $("#header-user-options").find(".actionSpan").each(function () {
            if ($(this).text().toUpperCase() == "EDIT") {
                $(this).closest("a").css("display", "none");
            }
        });
        $(content).find(".actionSpan").each(function (index) {
            if ($(this).text().toUpperCase() == "EDIT") {
                $(content).find("a:eq(" + index + ")").css("display", "none");
            }
        });
    }
}

function BindEvents(obj, e, isdblclick) {
    $("#btnSaveToNext").show();
    $("#divDetail").html('');
    $("#divDetail2").html("");
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
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    isSaveAndNext = "0";

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
    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
    awbDateIndex = trRow.find("th[data-field='AWBDate']").index();
    pcsIndex = trRow.find("th[data-field='Pcs']").index();
    chwtIndex = trRow.find("th[data-field='ChWt']").index();
    flightNoIndex = trRow.find("th[data-field='FlightNo']").index();
    flightDateIndex = trRow.find("th[data-field='FlightDate']").index();
    commodityIndex = trRow.find("th[data-field='CommodityCode']").index();
    accpcsindex = trRow.find("th[data-field='AccPcs']").index();
    accgrwtindex = trRow.find("th[data-field='AccGrWt']").index();
    accvolwtindex = trRow.find("th[data-field='AccVolWt']").index();
    arrivedSNoIndex = trLocked.find("th[data-field='ArrivedShipmentSNo']").index();
    CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();
    currentArrivedShipmentSNo = closestTr.find("td:eq(" + arrivedSNoIndex + ")").text();

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
    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    $("#tabstrip").kendoTabStrip();
}

function AutoCompleteForFBLHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
        $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
            filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
            dataSource: dataSource,
            filterField: basedOn,
            separator: (separator == undefined ? null : separator),
            dataTextField: autoCompleteText,
            dataValueField: autoCompleteKey,
            valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
            template: '<span>#: TemplateColumn #</span>',
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            newAllowed: newAllowed,
            confirmOnAdd: confirmOnAdd
        });
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

function ShowProcessDetails(subprocess, isdblclick, subprocesssno) {
    $("#IdAWBPrint").css("display", "");
    $("#IdAcptNote").css("display", "");
    $("#IdEDINote").css("display", "");
    $("#ulTab").hide();
    $("#tabstrip").html(rpl);

    $("body").append("<style>ul.k-tabstrip-items li.k-state-active{border-bottom:3px solid red;}</style>");

    if (subprocess.toUpperCase() == "RESERVATION") {
        $("#tabstrip").kendoTabStrip();
        $("#ulTab").show();

        if (isSaveAndNext == "1") {
            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
            isSaveAndNext = "0";
        } else {
            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
        }
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
            ShowProcessDetailsNew("RESERVATION", "divDetail", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(4) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick, subprocesssno);
        });

        if ($("#ulTab").find("table").find("input[id='chkFWBAmmendment']").length == 0)
            $("#ulTab").append("<table align=\"right\"><tr><td><span id=\"Amendment\"><b>Amendment</b></span>&nbsp;<input id=\"chkFWBAmmendment\" type=\"checkbox\"\">&nbsp;<span id=\"AmendmentCharges\"><b>Waive off Amendment Charges</b></span>&nbsp;<input id=\"chkAmendmentCharges\" type=\"checkbox\"\"></td></tr></table>");
    }

    if (subprocess.toUpperCase() == "DIMENSION") {
        $("#tabstrip").kendoTabStrip();
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
            ShowProcessDetailsNew("DIMENSION", "divDetail", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("ULDDimensionInfo", "divDetailSHC", isdblclick, subprocesssno);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("ULDDimensionDetails", "divTab3", isdblclick, subprocesssno);
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
        InitializePage(subprocess, "divDetail", isdblclick, subprocesssno);
    }

    else {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetWebForm/" + _CURR_PRO_ + "/ImportFWB/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("ImportFWB");
                    InitializePage(subprocess, "divDetail", isdblclick, subprocesssno);
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

function ShowProcessDetailsNew(subprocess, divID, isdblclick, subprocesssno) {
    if (subprocess == "RATE") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetWebForm/" + _CURR_PRO_ + "/ImportFWB/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divDetailSHC').html('');
                $('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");

                $('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                $('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                $('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");
                $("#divDetailSHC").append(result);
                if (result != undefined || result != "") {

                    GetProcessSequence("ImportFWB");
                    InitializePage(subprocess, divID, isdblclick, subprocesssno);
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
            url: "Services/Import/ImportFWBService.svc/GetWebForm/" + _CURR_PRO_ + "/ImportFWB/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#" + divID).html(result);
                if (result != undefined || result != "") {
                    //GetProcessSequence("ACCEPTANCE");
                    InitializePage(subprocess, divID, isdblclick, subprocesssno);
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

function ShowEDI() {
    $("#divEDIDetail").show();
    var awbsno = $('#tblShipmentInfo tr:nth-child(2)>td:eq(2)').text();
    var FlightDate = $('#tblShipmentInfo tr:nth-child(3)>td:eq(2)').text();
    var FlightNo = $('#tblShipmentInfo tr:nth-child(5)>td:eq(2)').text();
    cfi.ShowIndexView("divDetail", "Services/Shipment/FWBService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/EDIDETAILS/A~A/A~A/" + FlightNo + "/" + FlightDate + "/A~A/" + awbsno + "/A~A");
    $("#btnSave").unbind("click");
}

function MarkSelected(obj) {
    var trRow = $(obj).closest("tr");
    trRow.find("input[type='radio']").each(function () {
        $(this).prop('checked', false);
    });
    $(obj).prop('checked', true);
}

$(document).ready(function () {

});

function ExtraCondition(textId) {

    var filterShipperCity = cfi.getFilter("AND");
    var CommodityFilter = cfi.getFilter("AND");
    var CommoditySubGroupFilter = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var filterAgent = cfi.getFilter("AND");
    var LocaFilter = cfi.getFilter("AND");
    var FlightOriginFilter = cfi.getFilter("AND");
    var FlightDestFilter = cfi.getFilter("AND");

    var SPHCFilter = cfi.getFilter("AND");
    var SPHCDGRFilter = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");

    var filterNotifyCity = cfi.getFilter("AND");
    var filterSLINo = cfi.getFilter("AND");

    var filterUnNo = cfi.getFilter("AND");
    var filterShippingName = cfi.getFilter("AND");
    var filterSubRisk = cfi.getFilter("AND");
    var filterPakagingGroup = cfi.getFilter("AND");
    var filterunitDGR = cfi.getFilter("AND");
    var filterPackingInst = cfi.getFilter("AND");
    var filterErg = cfi.getFilter("AND");

    var SearchFlightFilter = cfi.getFilter("AND");


    if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");

        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    if (textId.indexOf("Text_Commodity") >= 0) {
        if (parseInt($("#Text_SubGroupCommodity").data("kendoAutoComplete").key() || "0") > 0) {
            var _CommodityFilter = cfi.getFilter("AND");
            cfi.setFilter(_CommodityFilter, "SubGroupSNo", "eq", $("#Text_SubGroupCommodity").data("kendoAutoComplete").key());
            CommodityFilter = cfi.autoCompleteFilter(_CommodityFilter);
            return CommodityFilter;
        }
    }
    if (textId.indexOf("Text_SubGroupCommodity") >= 0) {
        if (parseInt($("#Text_Commodity").data("kendoAutoComplete").key() || "0") > 0) {
            var _CommoditySubGroupFilter = cfi.getFilter("AND");
            cfi.setFilter(_CommoditySubGroupFilter, "CommoditySNo", "eq", $("#Text_Commodity").data("kendoAutoComplete").key());
            CommoditySubGroupFilter = cfi.autoCompleteFilter(_CommoditySubGroupFilter);
            return CommoditySubGroupFilter;
        }
    }


    if (textId.indexOf("Text_Notify_City") >= 0) {
        var filterNCity = cfi.getFilter("AND");

        cfi.setFilter(filterNCity, "CountrySNo", "eq", $("#Text_Notify_CountryCode").data("kendoAutoComplete").key());
        filterNotifyCity = cfi.autoCompleteFilter(filterNCity);
        return filterNotifyCity;
    }

    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");

        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    else if (textId.indexOf("Text_IssuingAgent") >= 0) {
        var filterWAgent = cfi.getFilter("AND");

        cfi.setFilter(filterWAgent, "AirportSno", "eq", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        filterAgent = cfi.autoCompleteFilter(filterWAgent);
        return filterAgent;
    }//ChargeName

    else if (textId.indexOf("Text_FlightNo") >= 0) {
        var FlightOriginwFilter = cfi.getFilter("AND");
        cfi.setFilter(FlightOriginwFilter, "OriginAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(FlightOriginwFilter, "DestinationAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(FlightOriginwFilter, "FlightDate", "eq", cfi.CfiDate($("#" + textId).closest('tr').find("[id^='FlightDate']").attr('id')));
        cfi.setFilter(FlightOriginwFilter, "IsDeparted", "eq", 0);
        cfi.setFilter(FlightOriginwFilter, "IsNILManifested", "eq", 0);
        FlightOriginFilter = cfi.autoCompleteFilter(FlightOriginwFilter);

        return FlightOriginFilter;
    }

    else if (textId.indexOf("Text_Location") >= 0) {

    }
    else if (textId.indexOf("Text_SPHC") >= 0) {
        var filterSPHC1 = cfi.getFilter("AND");
        cfi.setFilter(filterSPHC1, "IsDGR", "eq", "1");
        SPHCFilter = cfi.autoCompleteFilter(filterSPHC1);
        return SPHCFilter;
    }
    else if (textId.indexOf("Text_SpecialHandlingCode") >= 0) {
        var filterSPHC2 = cfi.getFilter("AND");
        cfi.setFilter(filterSPHC2, "SNo", "notin", $("#SpecialHandlingCode").val());
        SPHCDGRFilter = cfi.autoCompleteFilter(filterSPHC2);

        return SPHCDGRFilter;
    }

    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        var SHIPPER_AccountNo2 = cfi.getFilter("AND");
        cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
        ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
        return ShipperAccountFilter;
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        var ConsigneeFilter2 = cfi.getFilter("AND");
        cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
        ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
        return ConsigneeFilter;
    }

    else if (textId.indexOf("Text_SLINo") >= 0) {
        var filterSLINo2 = cfi.getFilter("AND");
        cfi.setFilter(filterSLINo2, "AWBSNo", "eq", currentawbsno);
        filterSLINo = cfi.autoCompleteFilter(filterSLINo2);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_UnNo") >= 0) {
        var _filterUnNo = cfi.getFilter("AND");
        cfi.setFilter(_filterUnNo, "UNNumber", "neq", '');
        if ($("#" + textId).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key() != "" && $("#" + textId).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key() != "0") {
            cfi.setFilter(_filterUnNo, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key());
        }
        filterUnNo = cfi.autoCompleteFilter(_filterUnNo);
        return filterUnNo;
    }
    else if (textId.indexOf("Text_ShippingName") >= 0) {
        var _filterShippingName = cfi.getFilter("AND");
        cfi.setFilter(_filterShippingName, "ColumnSearch", "neq", '');
        if ($("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key() != "") {
            cfi.setFilter(_filterShippingName, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        }
        filterShippingName = cfi.autoCompleteFilter(_filterShippingName);
        return filterShippingName;
    }
    else if (textId.indexOf("Text_SubRisk") >= 0) {
        var _filterSubRisk = cfi.getFilter("AND");
        cfi.setFilter(_filterSubRisk, "SubRisk", "neq", '');
        cfi.setFilter(_filterSubRisk, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSubRisk = cfi.autoCompleteFilter(_filterSubRisk);
        return filterSubRisk;
    }
    else if (textId.indexOf("Text_Class") >= 0) {
        var _filterSLINo = cfi.getFilter("AND");
        cfi.setFilter(_filterSLINo, "ClassDivSub", "neq", '');
        cfi.setFilter(_filterSLINo, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSLINo = cfi.autoCompleteFilter(_filterSLINo);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_PackingGroup") >= 0) {
        var _filterPakagingGroup = cfi.getFilter("AND");
        cfi.setFilter(_filterPakagingGroup, "PackingGroup", "neq", '');
        cfi.setFilter(_filterPakagingGroup, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterPakagingGroup = cfi.autoCompleteFilter(_filterPakagingGroup);
        return filterPakagingGroup;
    }
    else if (textId.indexOf("Text_Unit") >= 0) {
        if ($("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete") != undefined) {
            var _filterunitDGR = cfi.getFilter("AND");
            cfi.setFilter(_filterunitDGR, "Unit", "neq", '');
            cfi.setFilter(_filterunitDGR, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
            filterunitDGR = cfi.autoCompleteFilter(_filterunitDGR);
            return filterunitDGR;
        }
    }
    else if (textId.indexOf("Text_PackingInst") >= 0) {
        var _filterPackingInst = cfi.getFilter("AND");
        cfi.setFilter(_filterPackingInst, "PackingInst", "neq", '');
        cfi.setFilter(_filterPackingInst, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterPackingInst = cfi.autoCompleteFilter(_filterPackingInst);
        return filterPackingInst;
    }
    else if (textId.indexOf("Text_ERG") >= 0) {
        var _filterErg = cfi.getFilter("AND");
        cfi.setFilter(_filterErg, "ERGN", "neq", '');
        cfi.setFilter(_filterErg, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterErg = cfi.autoCompleteFilter(_filterErg);
        return filterErg;
    }
    else if (textId == "Text_ShipmentDestination") {
        var filter = cfi.getFilter("AND");
        cfi.setFilter(filter, "SNo", "Notin", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }
    else if (textId.indexOf("Text_offPoint") >= 0) {
        var filter = cfi.getFilter("AND");
        cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }
    else if (textId.indexOf("Text_BoardPoint") >= 0) {
        var filter = cfi.getFilter("AND");
        cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }

}

function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno) {
    InstantiateControl(cntrlid);

    $("#trAmmendment").hide();

    var IsFWBWaybill = "0"
    var IsColorFHL = "0";
    if (subprocess.toUpperCase() == "RESERVATION" || subprocess.toUpperCase() == "FWB" || subprocess.toUpperCase() == "RATE" || subprocess.toUpperCase() == "CUSTOMER" || subprocess.toUpperCase() == "HANDLING" || subprocess.toUpperCase() == "SUMMARY") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetFWBType", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                IsFWBCheck = resData.Table0[0].IsFWB;
                var IsDOCreate = resData.Table0[0].IsDOCreate;
                IsDOCreated = resData.Table0[0].IsDOCreated;
                var IsFWBColor = resData.Table0[0].IsColorFWB;
                var IsFWBRate = resData.Table0[0].IsFWBRate;
                IsFWBWaybill = resData.Table0[0].IsFWBWaybill;
                var IsFWBRateColor = resData.Table0[0].ISFWBRateColor;
                var ISFWBCustomer = resData.Table0[0].ISFWBCustomer;
                var IsFWBCustoms = resData.Table0[0].IsFWBCustoms;
                var IsFWBSummary = resData.Table0[0].IsFWBSummary;
                IsColorFHL = resData.Table0[0].IsColorFHL;

                if (IsFWBWaybill == "1" && IsFWBRateColor == "1" && IsFWBColor == "2") {
                    $(ButtonProcess).removeClass("partialprocess completeprocess").addClass("completeprocess ");
                }
                else if (IsFWBWaybill == "1" && IsFWBRateColor == "1") {
                    $(ButtonProcess).removeClass("incompleteprocess partialprocess").addClass("partialprocess");
                }
                else if (ISFWBCustomer == "1" || IsFWBWaybill == "1") {
                    $(ButtonProcess).removeClass("incompleteprocess partialprocess").addClass("partialprocess");
                }


                if (IsFWBWaybill != "0") {
                    $("#ulTab li").eq(0).css("background-color", "rgb(175, 243, 153)");
                    $('#chkDocReceived').attr("disabled", true);
                }
                if (IsFWBRateColor != "0") {
                    $("#ulTab li").eq(1).css("background-color", "rgb(175, 243, 153)");
                }
                if (ISFWBCustomer != "0") {
                    $("#ulTab li").eq(2).css("background-color", "rgb(175, 243, 153)");
                }
                if (IsFWBCustoms != "0") {
                    $("#ulTab li").eq(3).css("background-color", "rgb(175, 243, 153)");
                }
                if (IsFWBSummary != "0") {
                    $("#ulTab li").eq(4).css("background-color", "rgb(175, 243, 153)");
                }



                if (Number(IsFWBCheck) == 1) {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").show();
                    $("#ulTab").find("table").find("span[id='Amendment']").show();


                }
                else {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").hide();
                    $("#ulTab").find("table").find("span[id='Amendment']").hide();
                }

                if (Number(IsFWBCheck) == 1 && userContext.SpecialRights.IFWB == true) {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").show();
                    $("#ulTab").find("table").find("span[id='Amendment']").show();
                }
                else {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").hide();
                    $("#ulTab").find("table").find("span[id='Amendment']").hide();
                }

                if (Number(IsFWBCheck) == 1 && userContext.SpecialRights.IFWBC == true) {
                    $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").show();
                    $("#ulTab").find("table").find("span[id='AmendmentCharges']").show();
                }
                else {
                    $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").hide();
                    $("#ulTab").find("table").find("span[id='AmendmentCharges']").hide();
                }

                if (Number(IsDOCreate) == 1) {
                    $("#tabstrip input,select").attr("disabled", true);

                }
                else if (IsFWBWaybill == "1") {
                    $('#chkDocReceived').attr("disabled", true);
                }
                else {
                    $("#tabstrip input,select").attr("disabled", false);
                }
            },
            error: function (xhr) {
                var ex = xhr;
            }
        });
    }

    if (subprocess.toUpperCase() == "CUSTOMER") {
        BindCustomerInfo();
        UserSubProcessRights("divTab3", subprocesssno);
        if (Number(IsDOCreated) == 1) {

            $("#divTab3 input,select").attr("disabled", true);
        }
        else
            $("#divTab3 input,select").attr("disabled", false);
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "0";
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $(".k-grid-content  tbody tr").find("td:eq(0)").each(function (i, e) {
                            if ($(e).text() == currentawbsno) {
                                $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(3);
                                ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
                            }
                        });
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "RATE") {
        BindDimensionEventsNew();
        BindDimensionEventsNewULD();
        BindAWBOtherCharge();
        BindAWBRate();
        if ($("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").length <= 0) {
            SetAWBDefaultValues();
        }
        CalculateRateTotal();
        UserSubProcessRights("divDetailSHC", subprocesssno);
        if (Number(IsDOCreated) == 1)
            $("#divDetailSHC input,select").attr("disabled", true);
        else
            $("#divDetailSHC input,select").attr("disabled", false);
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "0";
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                        ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
        BindAWBSummary(isdblclick);
        UserSubProcessRights("divTab5", subprocesssno);
        if (Number(IsDOCreated) == 1)
            $("#divTab5 input,select").attr("disabled", true);
        else
            $("#divTab5 input,select").attr("disabled", false);
        $("#btnSaveToNext").hide();
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
                        ShowProcessDetailsNew("RESERVATION", "divDetail", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        BindHandlingInfoDetails();
        if (Number(IsDOCreated) == 1)
            $("#divTab4 input,select").attr("disabled", true);
        else
            $("#divTab4 input,select").attr("disabled", false);
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "0";
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(4);
                        ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;

    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        BindReservationSection();
        UserSubProcessRights("divDetail", subprocesssno);
        if (Number(IsDOCreated) == 1)
            $("#divDetail input,select").attr("disabled", true);
        else if (IsFWBWaybill == "1") {
            $('#chkDocReceived').attr("disabled", true);
        }
        else {
            $("#divDetail input,select").attr("disabled", false);
        }

        if (IsColorFHL != "0") {
            $("#NoofHouse").attr("disabled", "disabled");
        }
        else {
            $("#NoofHouse").attr("disabled", false);
        }

        $("#btnSave").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_importfwb_fwbshipmentitinerary']").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "") {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "0";

                    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                        alert("Please Check FWB amendment.", "bottom-right");
                        return false;
                    }

                    var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;
                    if (IsDocReceived == 0) {
                        if ($("#chkDocReceived").prop('disabled') == false) {
                            $("#divDetail2").html("Document not selected irregularity will be raised for same as MSAW.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        $("#divDetail2").dialog('destroy');
                                        if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                            $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                            $("#divDetail2").dialog({
                                                resizable: false,
                                                modal: true,
                                                title: "SHC Information",
                                                height: 250,
                                                width: 400,
                                                buttons: {
                                                    "Yes": function () {
                                                        if (SaveFormData(subprocess)) {
                                                            ShipmentSearch();
                                                            CleanUI();
                                                        }
                                                        $("#divDetail2").dialog('destroy');
                                                    },
                                                    "No": function () {
                                                        $("#divDetail2").dialog('destroy');
                                                        return false;
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            if (SaveFormData(subprocess)) {
                                                ShipmentSearch();
                                                CleanUI();
                                            }
                                        }
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('destroy');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            if (SaveFormData(subprocess)) {
                                                ShipmentSearch();
                                                CleanUI();
                                            }
                                            $("#divDetail2").dialog('destroy');
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('destroy');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if (SaveFormData(subprocess)) {
                                    ShipmentSearch();
                                    CleanUI();
                                }
                            }
                        }
                    }
                    else {
                        if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                            $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        if (SaveFormData(subprocess)) {
                                            ShipmentSearch();
                                            CleanUI();
                                        }
                                        $("#divDetail2").dialog('destroy');
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('destroy');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if (SaveFormData(subprocess)) {
                                ShipmentSearch();
                                CleanUI();
                            }
                        }
                    }
                }
                else {
                    return false;
                }
            }
            else {
                if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                    if (cfi.IsValidSection(cntrlid)) {
                        isSaveAndNext = "0";

                        if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                            alert("Please Check FWB amendment.", "bottom-right");
                            return false;
                        }

                        var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;
                        if (IsDocReceived == 0) {
                            if ($("#chkDocReceived").prop('disabled') == false) {
                                $("#divDetail2").html("Document not selected irregularity will be raised for same as MSAW.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            $("#divDetail2").dialog('destroy');
                                            if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                                $("#divDetail2").dialog({
                                                    resizable: false,
                                                    modal: true,
                                                    title: "SHC Information",
                                                    height: 250,
                                                    width: 400,
                                                    buttons: {
                                                        "Yes": function () {
                                                            if (SaveFormData(subprocess)) {
                                                                ShipmentSearch();
                                                                CleanUI();
                                                            }
                                                            $("#divDetail2").dialog('destroy');
                                                        },
                                                        "No": function () {
                                                            $("#divDetail2").dialog('destroy');
                                                            return false;
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                if (SaveFormData(subprocess)) {
                                                    ShipmentSearch();
                                                    CleanUI();
                                                }
                                            }
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('destroy');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                    $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                    $("#divDetail2").dialog({
                                        resizable: false,
                                        modal: true,
                                        title: "SHC Information",
                                        height: 250,
                                        width: 400,
                                        buttons: {
                                            "Yes": function () {
                                                if (SaveFormData(subprocess)) {
                                                    ShipmentSearch();
                                                    CleanUI();
                                                }
                                                $("#divDetail2").dialog('destroy');
                                            },
                                            "No": function () {
                                                $("#divDetail2").dialog('destroy');
                                                return false;
                                            }
                                        }
                                    });
                                }
                                else {
                                    if (SaveFormData(subprocess)) {
                                        ShipmentSearch();
                                        CleanUI();
                                    }
                                }
                            }
                        }
                        else {
                            if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            if (SaveFormData(subprocess)) {
                                                ShipmentSearch();
                                                CleanUI();
                                            }
                                            $("#divDetail2").dialog('destroy');
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('destroy');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if (SaveFormData(subprocess)) {
                                    ShipmentSearch();
                                    CleanUI();
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                } else {
                    if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                        ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                    else
                        ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
                }
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_importfwb_fwbshipmentitinerary']").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "" > 0) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "1";

                    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                        alert("Please Check FWB amendment.", "bottom-right");
                        return false;
                    }

                    var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;
                    if (IsDocReceived == 0) {
                        if ($("#chkDocReceived").prop('disabled') == false) {
                            $("#divDetail2").html("Document not selected irregularity will be raised for same as MSAW.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        $("#divDetail2").dialog('destroy');
                                        if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                            $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                            $("#divDetail2").dialog({
                                                resizable: false,
                                                modal: true,
                                                title: "SHC Information",
                                                height: 250,
                                                width: 400,
                                                buttons: {
                                                    "Yes": function () {
                                                        if (SaveFormData(subprocess)) {
                                                            $('#tabstrip ul:first li:eq(1) a').click();
                                                        }
                                                        $("#divDetail2").dialog('destroy');
                                                    },
                                                    "No": function () {
                                                        $("#divDetail2").dialog('destroy');
                                                        return false;
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            if (SaveFormData(subprocess)) {
                                                $('#tabstrip ul:first li:eq(1) a').click();
                                            }
                                        }
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('destroy');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            if (SaveFormData(subprocess)) {
                                                $('#tabstrip ul:first li:eq(1) a').click();
                                            }
                                            $("#divDetail2").dialog('destroy');
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('destroy');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if (SaveFormData(subprocess)) {
                                    $('#tabstrip ul:first li:eq(1) a').click();
                                }
                            }
                        }
                    }
                    else {
                        if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                            $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        if (SaveFormData(subprocess)) {
                                            $('#tabstrip ul:first li:eq(1) a').click();
                                        }
                                        $("#divDetail2").dialog('destroy');
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('destroy');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if (SaveFormData(subprocess)) {
                                $('#tabstrip ul:first li:eq(1) a').click();
                            }
                        }
                    }
                }
                else {
                    return false;
                }
            }
            else {
                if ((IsFWbComplete && $("#chkFWBAmmendment").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendment").prop("checked"))) {
                    if (cfi.IsValidSection(cntrlid)) {
                        isSaveAndNext = "1";

                        if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                            alert("Please Check FWB amendment.", "bottom-right");
                            return false;
                        }

                        var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;
                        if (IsDocReceived == 0) {
                            if ($("#chkDocReceived").prop('disabled') == false) {
                                $("#divDetail2").html("Document not selected irregularity will be raised for same as MSAW.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            $("#divDetail2").dialog('destroy');
                                            if ($('#SpecialHandlingCode').val() == "") {
                                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                                $("#divDetail2").dialog({
                                                    resizable: false,
                                                    modal: true,
                                                    title: "SHC Information",
                                                    height: 250,
                                                    width: 400,
                                                    buttons: {
                                                        "Yes": function () {
                                                            if (SaveFormData(subprocess)) {
                                                                FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                                FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                                $("#divDetailSHC").html("");
                                                                $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);

                                                                ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                                                            }
                                                            $("#divDetail2").dialog('destroy');
                                                        },
                                                        "No": function () {
                                                            $("#divDetail2").dialog('destroy');
                                                            return false;
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                if (SaveFormData(subprocess)) {
                                                    FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                    FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                    $("#divDetailSHC").html("");
                                                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                                                    ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                                                }
                                            }
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('destroy');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                    $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                    $("#divDetail2").dialog({
                                        resizable: false,
                                        modal: true,
                                        title: "SHC Information",
                                        height: 250,
                                        width: 400,
                                        buttons: {
                                            "Yes": function () {
                                                if (SaveFormData(subprocess)) {
                                                    FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                    FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                    $("#divDetailSHC").html("");
                                                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);

                                                    ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                                                }
                                                $("#divDetail2").dialog('destroy');
                                            },
                                            "No": function () {
                                                $("#divDetail2").dialog('destroy');
                                                return false;
                                            }
                                        }
                                    });
                                }
                                else {
                                    if (SaveFormData(subprocess)) {
                                        FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                        FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                        $("#divDetailSHC").html("");
                                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                                        ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                                    }
                                }

                            }
                        }
                        else {
                            if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            $("#divDetail2").dialog('destroy');
                                            if (SaveFormData(subprocess)) {
                                                FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                $("#divDetailSHC").html("");
                                                $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                                                ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                                            }
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('destroy');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if (SaveFormData(subprocess)) {
                                    FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                    FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                    $("#divDetailSHC").html("");
                                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);

                                    ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                                }
                            }
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (IsFWBAmmendment && !$("#chkFWBAmmendment").prop("checked"))
                        ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                    else
                        ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
                }
            }

        });
        return false;
    }
}

function getNonObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getNonObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function ResetFBLCharge(textId, textValue, keyId, keyValue) {

    if (ValidateExistingCharges(textId, textValue, keyId, keyValue)) {

        $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function () {

            if (textId == $(this).find("input[id^='Text_ChargeName']").attr("id")) {
                if (keyValue == "") {
                    $(this).find("input[id^='Amount']").val("0");
                    $(this).find("span[id^='TotalAmount']").html("");
                    $(this).find("input[id^='TotalAmount']").val("");
                }
                else {
                    var obj = $(this);
                    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];

                    var paymentList = paymentData.Table0;

                    var NonMendatory = getNonObjects(paymentData.Table0, 'TariffSNo', keyValue);

                    obj.find("input[id^='Amount']").val(NonMendatory[0].ChargeAmount);
                    obj.find("input[id^='_tempAmount']").val(NonMendatory[0].ChargeAmount);
                    var totalAmount = parseFloat(NonMendatory[0].ChargeAmount).toFixed(3);
                    obj.find("span[id^='TotalAmount']").html(totalAmount);
                    obj.find("input[id^='TotalAmount']").val(totalAmount);
                    obj.find("input[id^='Remarks']").val(NonMendatory[0].ChargeRemarks.replace('<Br>', '').replace('<Br>', ''));
                    obj.find("input[id^='rate']").val(NonMendatory[0].Rate);
                    obj.find("input[id^='min']").val(NonMendatory[0].Min);
                    obj.find("input[id^='totaltaxamount']").val(NonMendatory[0].TotalTaxAmount);
                    if (NonMendatory[0].TotalTaxAmount != "2") {
                        obj.closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                    }
                }
            }
        });
    }
    CalculateTotalFBLAmount();
}

function CalculateFBLAmount(obj) {
    var a = "";
    var chargeName = $(obj).closest("tr").find("[id^='ChargeName']");
    var chargeText = $(obj).closest("tr").find("[id^='Text_ChargeName']").attr("id");
    var chargeKey = $("#" + chargeText).data("kendoAutoComplete").key();
    for (var i = 0; i < paymentList.length; i++) {
        if (paymentList[i].TariffSNo == chargeKey) {
            var totalAmount = parseFloat($(obj).val());
            if ((isNaN(totalAmount))) {
                totalAmount = '0';
            }
            totalAmount = parseFloat(totalAmount).toFixed(3);
            $(obj).closest("tr").find("span[id^='TotalAmount']").html(totalAmount.toString());
            $(obj).closest("tr").find("input[id^='TotalAmount']").val(totalAmount.toString());

        }
    }
    CalculateTotalFBLAmount();
}

function CalculateTotalFBLAmount() {
    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {

                    totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else { }

            }

        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
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
    $(elem).closest("div[id$='areaTrans_importfwb_fwbshipmentocitrans']").find("[id^='areaTrans_importfwb_fwbshipmentocitrans']").each(function () {
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
        url: "Services/Import/ImportFWBService.svc/GetOSIInfoAndHandlingMessage?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var osiData = jQuery.parseJSON(result);
            var osiInfo = osiData.Table0;
            var handlingArray = osiData.Table1;
            var osiTransInfo = osiData.Table2;
            var ocitransInfo = osiData.Table3;
            cfi.makeTrans("importfwb_fwbshipmentositrans", null, null, null, null, null, osiTransInfo, 2);//added by Manoj Kumar
            cfi.makeTrans("importfwb_fwbshipmentocitrans", null, null, BindCountryCodeAutoComplete, ReBindCountryCodeAutoComplete, null, ocitransInfo);
            if (ocitransInfo.length > 0) {
                $("div[id$='divareaTrans_importfwb_fwbshipmentocitrans']").find("[id='areaTrans_importfwb_fwbshipmentocitrans']").each(function () {
                    $(this).find("input[id^='CountryCode']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
                    });

                    $(this).find("input[id^='InfoType']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
                    });

                    $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
                    });
                });

                $("div[id$='divareaTrans_importfwb_fwbshipmentocitrans']").find("[id^='areaTrans_importfwb_fwbshipmentocitrans']").find("span[class^='k-dropdown-wrap']").removeAttr("style")
            }
        },
        error: {

        }
    });
}

function CleaeCity(valueId, value, keyId, key) {
    if (valueId.indexOf("SHIPPER") > -1) {
        $("#Text_SHIPPER_City").val('');
    }
    if (valueId.indexOf("CONSIGNEE") > -1) {
        $("#Text_CONSIGNEE_City").val('');
    }
    if (valueId.indexOf("Notify") > -1) {
        $("#Text_Notify_City").val('');
    }
}

function BindCustomerInfo() {
    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], CleaeCity, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], CleaeCity, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("Notify_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], CleaeCity, "contains");
    cfi.AutoComplete("Notify_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    $("#SHIPPER_MobileNo").css("text-align", "left");
    $("#_tempSHIPPER_MobileNo").css("text-align", "left");
    $("#CONSIGNEE_MobileNo").css("text-align", "left");
    $("#_tempCONSIGNEE_MobileNo").css("text-align", "left");
    $("#Notify_MobileNo").css("text-align", "left");
    $("#_tempNotify_MobileNo").css("text-align", "left");
    $("#Notify_Fax").css("text-align", "left");
    $("#_tempNotify_Fax").css("text-align", "left");

    $("#SHIPPER_MobileNo").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#CONSIGNEE_MobileNo").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#SHipper_Fax").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#CONSIGNEE_Fax").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#Notify_Fax").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    AllowedSpecialChar("CONSIGNEE_AccountNoName");
    AllowedSpecialChar("CONSIGNEE_Street");
    AllowedSpecialChar("CONSIGNEE_TownLocation");
    AllowedSpecialChar("CONSIGNEE_State");

    AllowedSpecialChar("SHIPPER_Name");
    AllowedSpecialChar("SHIPPER_Street");
    AllowedSpecialChar("SHIPPER_TownLocation");
    AllowedSpecialChar("SHIPPER_State");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetShipperAndConsigneeInformation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
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
                    $("#chkSHIPPER_AccountNo").closest('td').hide();
                }

                $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                $("#_tempSHIPPER_Name").val(shipperData[0].ShipperName);
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
                $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                $("#_tempSHIPPER_Name2").val(shipperData[0].ShipperName2);
                $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
            }

            if (consigneeData.length > 0) {
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                if (consigneeData[0].ConsigneeAccountNo != "") {
                    $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                }

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
                $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                $("#_tempCONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
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

            if (userContext.SpecialRights.FWBS == true) {
                $("input[id='FWBShipper']").show();
                $("span[id='spnFWBShipper']").show();
            }
            else {
                $("input[id='FWBShipper']").hide();
                $("span[id='spnFWBShipper']").hide();
            }

            if (userContext.SpecialRights.FWBC == true) {
                $("input[id='FWB_Consignee']").show();
                $("span[id='spnFWB_Consignee']").show();
            }
            else {
                $("input[id='FWB_Consignee']").hide();
                $("span[id='spnFWB_Consignee']").hide();
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
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
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
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
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

function CalculatePayment(obj) {
    MarkSelected(obj);

    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {
                    totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else {
                }
            }
        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
    }

}

function BindHandlingChargeAutoComplete(elem, mainElem) {
    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
    });
    $(elem).find("input[id^='BillTo']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
        $("#Text_" + $(this).attr("name")).data("kendoAutoComplete").setDefaultValue(BillTo[0]["Key"], BillTo[0]["Text"]);
    });
    $(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');
    $(elem).find('td:eq(7)').css("display", "none");
    $(elem).find('td:eq(8)').css("display", "none");
    $(elem).find('td:eq(9)').css("display", "none");
    $(elem).find("input[id^='chkCash']").prop('checked', true)
    $(elem).find("input[id^='Amount']").each(function () {
        $(this).unbind("blur").bind("blur", function () {
            CalculateFBLAmount(this);
        });
    });

}

function ReBindHandlingChargeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function () {
        var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
        $(this).find("input[id^='ChargeName']").each(function () {
            AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
        });
        if ($(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').attr('style') != "display: none;") {
            $(this).find("input[id^='BillTo']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
            });
        }

        $(this).find("input[id^='Text_BillTo']").closest('span').css('width', '');
        $(this).find("input[id^='Text_ChargeName']").closest('span').css('width', '');
        $(this).find("input[id^='Amount']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                CalculateFBLAmount(this);
            });
        });
    });
    if ($(elem).find("td[id^='tdSNoCol']").html() == MendatoryPaymentCharges.length) {
        $(elem).find("td[id^=transAction]").find("i[title=Delete]").remove();

    }

    CalculateTotalFBLAmount();
}

function SetChargeValues(textId, textValue, keyId, keyValue) {
    var chkCash = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCash]");
    var chkCredit = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCredit]");

    if (keyValue == "0") {
        MarkSelected(chkCash);
        chkCash.attr('disabled', false);
    } else {
        MarkSelected(chkCredit);
        chkCash.attr('disabled', true);
    }
    CalculateTotalFBLAmount();
}

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");
                $("#" + textId).closest('tr').find("input[id^='Amount']").val("0");
                $("#" + textId).closest('tr').find("input[id^='_tempAmount']").val("0");
                $("#" + textId).closest('tr').find("span[id^='TotalAmount']").html("");
                $("#" + textId).closest('tr').find("input[id^='TotalAmount']").val("");
                Flag = false;
            }
        }
    });
    return Flag;
}

function BindEDox() {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtAWBEDox?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            var alldocrcvd = edoxData.Table1;

            var docRcvd = false;
            if (alldocrcvd.length > 0) {
                var docItem = alldocrcvd[0];
                docRcvd = docItem.IsAllEDoxRecieved.toLowerCase() == "true" ? true : false;
                $("#XRay").prop("checked", docRcvd);
                $("#Remarks").val(docItem.AllEDoxReceivedRemarks);
            }

            cfi.makeTrans("importfwb_shipmentedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray);
            if (!docRcvd) {
                $("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("[id='areaTrans_importfwb_shipmentedoxinfo']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
                    });
                    $(this).find("input[id^='DocsName']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                    $(this).find("a[id^='ahref_DocName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                });
            }
            else {
                var prevtr = $("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("tr[id='areaTrans_importfwb_shipmentedoxinfo']").prev()
                prevtr.find("td:eq(2)").remove();
                prevtr.find("td:last").remove();
                $("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("tr[id^='areaTrans_importfwb_shipmentedoxinfo']").each(function () {
                    $(this).find("td:eq(2)").remove();
                    $(this).find("td:last").remove();
                })

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
            }
        },
        error: {

        }
    });
}

function BindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='DocType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
    });
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("[id^='areaTrans_importfwb_shipmentedoxinfo']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

function UploadEDoxDocument(objId, nexctrlid) {

    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }
    $.ajax({
        url: "Handler/FileUploadHandler.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#eDox#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#eDox#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });

}

function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "Handler/FileUploadHandler.ashx?l=e-Dox&f=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function BindBankAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='BankName']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
    });
}

function ReBindBankAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentaddcheque']").find("[id^='areaTrans_importfwb_shipmentaddcheque']").each(function () {
        $(this).find("input[id^='BankName']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindReservationSection() {
    cfi.AutoComplete("Product", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    cfi.AutoComplete("Commodity", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("ShipmentOrigin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("ShipmentDestination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");

    cfi.AutoComplete("SpecialHandlingCode", "CODE", "SPHC", "SNO", "CODE@", ["CODE", "Description"], null, "contains", ",", null, null, null, GetDGRDetails, true);
    cfi.AutoComplete("buptype", "Description", "buptype", "SNO", "Description", "", null, "contains");
    cfi.AutoComplete("densitygroup", "GroupName", "CommodityDensityGroup", "SNO", "GroupName", "", null, "contains");
    cfi.AutoComplete("SubGroupCommodity", "SubGroupName", "vw_Commodity_CommoditySubGroup", "SubGroupSNo", "SubGroupName", "", null, "contains");
    cfi.AutoComplete("CarrierCode", "CarrierCode", "airline", "SNo", "CarrierCode", "", null, "contains");

    $("#AWBDate").data("kendoDatePicker").value(new Date());

    $('#AWBDate').prop('readonly', true);
    $('#AWBDate').parent().css('width', '100px');
    $('#chkFWBAmmendment').prop('checked', false);
    $("div[id$='divDetail']").append(NogDiv);

    cfi.AutoComplete("NatureofGoods", "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], ShowOtherNog, "contains");
    $("#Text_NatureofGoods").closest("td").append('</br><input type="text" class="transSection k-input" name="OtherNOG" id="OtherNOG" style="width: 170px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off">')
    $("#OtherNOG").hide();

    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc'] table >tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');
    $("#btnSaveDGR").unbind("click").bind("click", function () {
        SaveDGRDetails();
    });

    tblhtml = $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("table").html();
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    var IsNoOfHouse = false;
    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetIFWBInformation?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            var sphcArray = fblData.Table2;
            var itenData = fblData.Table1;
            var sphcArray2 = fblData.Table3;
            var HasDGRArray = fblData.Table4;
            var NOGData = fblData.Table8;
            ItenaryArray = itenData;
            IsNoOfHouse = fblData.Table0[0].NoOfHouse != "0" ? true : false;
            IsFWbComplete = fblData.Table5[0].Status == "True" ? true : false;
            IsFWBAmmendment = fblData.Table6[0].IsEnabled == "True" ? true : false;
            IsFlightExist = fblData.Table7[0].FlightExist == "1" ? true : false;
            var resItem;
            if (resData.length > 0) {
                resItem = resData[0];
                $("#Text_CarrierCode").closest('span').hide();
                $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySNo, resItem.CommodityCode == "" ? "" : resItem.CommodityCode + '-' + resItem.CommodityDescription);
                $("#Text_SubGroupCommodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySubGroupSNo, resItem.SubGroupName);
                $("#Pieces").val(resItem.Pieces);
                $("#_tempPieces").val(resItem.Pieces);
                $("#GrossWt").val(resItem.GrossWeight);
                $("#_tempGrossWt").val(resItem.GrossWeight);
                $("#ChargeableWt").val(resItem.ChargeableWeight);
                $("#_tempChargeableWt").val(resItem.ChargeableWeight);
                $("#CBM").val(resItem.CBM);
                $("#_tempCBM").val(resItem.CBM);
                $("#VolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#_tempVolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("span[id='VolumeWt']").html(parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#AWBNo").val(resItem.AWBNo);
                $("#AWBDate").data("kendoDatePicker").value(resItem.AWBDate);
                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(resItem.ProductSNo, resItem.ProductName);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue(resItem.DestinationCity, resItem.DestinationCityName);
                $("#NoofHouse").val(resItem.NoOfHouse);
                $("#FlightDate").data("kendoDatePicker").value(resItem.FlightDate);
                $("#X-RayRequired[value='" + resItem.XRayRequired + "']").prop('checked', true);
                $("#FreightType[value='" + resItem.FreightType + "']").prop('checked', true);
                $("#NatureofGoods").val(resItem.NatureOfGoodsSNo);
                $("#Text_NatureofGoods").val(resItem.Text_NatureOfGoods);
                if (resItem.Text_NatureOfGoods.toUpperCase() == 'OTHER'.toUpperCase()) {
                    $("#OtherNOG").show();
                    $("#OtherNOG").val(resItem.NatureOfGoods);
                }
                $("#IssuingAgent").val(resItem.AgentName);
                $('#AWBDate').parent().css('width', '100px');
                $("[id^='chkDocReceived']").prop("checked", resItem.IsDocReceived == "" || resItem.IsDocReceived == 1 ? true : false);
                if (resItem.IsBup == "False") {
                    $("#chkisBup").prop('checked', false);
                } else {
                    $("#chkisBup").prop('checked', true);
                }
                $("#Text_buptype").data("kendoAutoComplete").setDefaultValue(resItem.BupTypeSNo, resItem.BupType);
                $("#Text_densitygroup").data("kendoAutoComplete").setDefaultValue(resItem.DensityGroupSNo, resItem.DensityGroupName);

                if (resItem.HouseCreated == 1)
                    $("#NoofHouse").attr("disabled", "disabled");
                else
                    $("#NoofHouse").attr("disabled", false);

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
            $("#SpecialHandlingCode").closest("td").find("div").css("overflow-x", "scroll").css("width", "200");
            $("div[id=divareaTrans_importfwb_fwbshipmentclasssphc]").not(':first').remove();

            // get val for autocomplete from dgr array to bind SPHC autocomp-lete
            if (HasDGRArray.length > 0) {
                DGRSPHC = [];
                for (i = 0; i < HasDGRArray.length; i++) {
                    var info = {
                        Key: HasDGRArray[i].SNo,
                        Text: HasDGRArray[i].Code
                    };
                    DGRSPHC.push(info);
                }
            }

            cfi.makeTrans("importfwb_fwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, sphcArray, 8);
            $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
                $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
                cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
                $(this).find("input[id^='SPHC']").each(function () {
                    cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
                });
                $(this).find("input[id^='UnNo']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
                    }
                });
                $(this).find("input[id^='ShippingName']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
                    }
                });
                $(this).find("input[id^='Class']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
                    }
                });
                $(this).find("input[id^='SubRisk']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
                });
                $(this).find("input[id^='PackingGroup']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
                    }
                });
                $(this).find("input[id^='Unit']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
                    }
                });
                $(this).find("input[id^='PackingInst']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
                    }
                });
                $(this).find("input[id^='ERG']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
                    }
                });

                $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
            });

            if (HasDGRArray.length > 0) {
                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "DGR Details", 1400);
                });
                $("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });
            }

            /************** NOG ***************/
            $("div[id='divareaTrans_importfwb_shipmentnog']").find("tr[id^='areaTrans_importfwb_shipmentnog']").each(function (i, row) {
                cfi.AutoComplete($(row).find("input[id^='OtherNatureofGoods']").attr("name"), "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], EnableOtherNog, "contains");
                $(row).find("input[id^='Text_OtherNatureofGoods']").parent().parent().css('width', '200px');
                $(row).find("input[id^='NOG']").attr('disabled', 1);
                if (NOGData.length > 0) {
                    if (NOGData[i] != undefined) {
                        $("#" + $(row).find("input[id^='Text_OtherNatureofGoods']").attr("id")).data("kendoAutoComplete").setDefaultValue(NOGData[i].OtherNatureofGoods, NOGData[i].Text_OtherNatureofGoods);
                    }
                }
            });

            cfi.makeTrans("importfwb_shipmentnog", null, null, null, null, null, NOGData);// Bind NOG Data
            $("a[id^='ahref_NOGDetails']").unbind("click").bind("click", function () {
                var Pieces = parseInt($("#Pieces").val() || "0");
                var GrsWt = parseFloat($("#GrossWt").val() || "0");
                //var NatureofGd = $("#NatureofGoods").val() || "";
                var NatureofGd = ($("#Text_NatureofGoods").data("kendoAutoComplete").key() || "0");

                if (Pieces == 0 || GrsWt == 0 || parseInt(NatureofGd) <= 0) {
                    jAlert("Enter Pieces, Gross weight and Nature of Goods Details.", "Warning - Nature of Goods Details");
                    return false;
                }

                if ((($("#Text_NatureofGoods").data("kendoAutoComplete").value() || "") == "OTHER") && ($("#OtherNOG").val() == "")) {
                    jAlert("Enter Other Nature of Goods Details.", "Warning - Nature of Goods Details");
                    return false;
                }

                if (!$("#divareaTrans_importfwb_shipmentnog").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_importfwb_shipmentnog", "Nature of Goods Details", 650);
                }
                else {
                    $("#divareaTrans_importfwb_shipmentnog").data("kendoWindow").open();
                }

                var PcsRow = 0, WtRow = 0, NogRow = 0;
                $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id^='areaTrans_importfwb_shipmentnog']").each(function () {
                    if (parseInt(($(this).find("input[id^='Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='_tempPieces']").val() || 0) : ($(this).find("input[id^='Pieces']").val() || 0)) > 0) {
                        PcsRow += 1;
                    }
                    if (parseFloat(($(this).find("input[id^='NogGrossWt']").val() || 0) == 0 ? ($(this).find("input[id^='_tempNogGrossWt']").val() || 0) : ($(this).find("input[id^='NogGrossWt']").val() || 0)) > 0) {
                        WtRow += 1;
                    }
                    if (($(this).find("input[id^='NOG']").val() != "")) {
                        NogRow += 1;
                    }
                });

                var FirstNogRow = $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id='areaTrans_importfwb_shipmentnog']:first");
                if (parseInt(PcsRow) > 0 || parseInt(WtRow) > 0 || parseInt(NogRow) > 0) { } else {
                    FirstNogRow.find("input[id*='Pieces']").val(Pieces);
                    FirstNogRow.find("input[id*='NogGrossWt']").val(GrsWt);
                }

                var NogKey = $("#Text_NatureofGoods").data("kendoAutoComplete").key();
                var NogVal = $("#Text_NatureofGoods").data("kendoAutoComplete").value();
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").setDefaultValue(NogKey, NogVal);
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").enable(false);
                FirstNogRow.find("input[id^='NOG']").val($("#OtherNOG").val());
                FirstNogRow.find("input[id^='NOG']").attr('readonly', true);
            });

            $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id^='areaTrans_importfwb_shipmentnog']").each(function () {
                cfi.Numeric($(this).find("input[id^='Pieces']").attr("id"), 0);
                cfi.Numeric($(this).find("input[id^='NogGrossWt']").attr("id"), 3);
                if ($(this).find("input[id^='NOG_']").val() != "") {
                    $(this).find("input[id^='NOG_']").removeAttr('disabled');
                }
            });
            /************** NOG ***************/

            cfi.makeTrans("importfwb_fwbshipmentitinerary", null, null, BindItenAutoComplete, ReBindItenAutoComplete, null, itenData);
            $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {

                $(this).find("input[id^='BoardPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='offPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='FlightNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], null, "contains");
                });
                var ctrlID = $(this).find("input[id^='FlightDate']").attr("id");
                $(this).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight(ctrlID) });
            });

            $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
            if (itenData.length <= 0) {
                if (resData.length > 0 && resItem != undefined) {
                    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id='areaTrans_importfwb_fwbshipmentitinerary']").first().find("input[id^=Text_BoardPoint]").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id='areaTrans_importfwb_fwbshipmentitinerary']").first().find("input[id^=Text_offPoint]").data("kendoAutoComplete").setDefaultValue(resItem.RoutingSNo, resItem.RoutingCityCode);
                }
            }
            $("input[id='Pieces']").unbind("blur").bind("blur", function () {
            });

            $("#ChargeableWt").unbind("blur").bind("blur", function () {
                compareGrossVolValue();
            });

            $("#GrossWt").unbind("blur").bind("blur", function () {
                CalculateShipmentChWt(this);
            });
            $("#CBM").unbind("blur").bind("blur", function () {
                CalculateShipmentChWt(this);
            });

            $("#VolumeWt").unbind("blur").bind("blur", function () {
                CalculateShipmentCBM();
            });

            $("#AWBNo").unbind("keyup").bind("keyup", function () {
                if ($(this).val().length == 3) {
                    $(this).val($(this).val() + "-");
                }
            });
            $("#Text_CarrierCode").closest('span').css('width', '50px');
            if (resData.length <= 0) {
                $("div[id=divareaTrans_importfwb_fwbshipmentitinerary]").find("tr[id='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='FlightDate']").data("kendoDatePicker").value("");
            }
            if (userContext.SpecialRights.DGR == true) {
                $("a[id^='ahref_ClassDetails']").show();
            } else {
                $("a[id^='ahref_ClassDetails']").hide();
            }

        },
        error: {
        }
    });
}

function ShowOtherNog(e) {
    if (($("#" + e).data("kendoAutoComplete").value() || "") == "OTHER") {
        $("#OtherNOG").show();
        $("#OtherNOG").attr("data-valid", "required").attr("data-valid-msg", "Enter Other Nature of Goods");

    } else {
        $("#OtherNOG").hide();
        $("#OtherNOG").val('');
        $("#OtherNOG").removeAttr("data-valid", "data-valid-msg");
    }
}

function EnableOtherNog(e) {
    if (($("#" + e).data("kendoAutoComplete").value() || "") == "OTHER") {
        $("#" + e).closest("tr").find("input[id^='NOG']").removeAttr('disabled');
    } else {
        $("#" + e).closest("tr").find("input[id^='NOG']").val('');
        $("#" + e).closest("tr").find("input[id^='NOG']").attr('disabled', 1);
    }
}

function CheckIsAWBUsable() {
    if ($('#AWBNo').val() != "") {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/CheckIsAWBUsable?AWBNo=" + $('#AWBNo').val(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = JSON.parse(result);
                var isValid = data.Table;
                if (isValid[0].MSG != "") {
                    jAlert(isValid[0].MSG, "Warning - FWB");
                    $('#AWBNo').val('');
                }

            },
            error: {
            }
        });
    }
}

function GetDGRDetails(e) {
    if ($("#divMultiSpecialHandlingCode").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    } else {
        GetDGRDetailsBySHC(($("#Multi_SpecialHandlingCode").val() == "" ? "" : $("#Multi_SpecialHandlingCode").val() + ",") + this.dataItem(e.item.index()).Key);
    }
}

function GetDGRDetailsAfterDelete(obj) {
    GetDGRDetailsBySHC($("#Multi_SpecialHandlingCode").val());
    var GDRRemainingData = [];

    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
        if ($(obj).attr("id") != $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key()) {
            var DGRInfo = {
                sphc: $(this).find("input[type=hidden][id^='SPHC']").val(),
                text_sphc: $(this).find("input[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                unno: $(this).find("input[type=hidden][id^='UnNo']").val(),
                text_unno: $(this).find("input[id^='Text_UnNo']").data("kendoAutoComplete").value(),
                shippingname: $(this).find("input[type=hidden][id^='ShippingName']").val(),
                text_shippingname: $(this).find("input[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                class: $(this).find("input[type=hidden][id^='Class']").val(),
                text_class: $(this).find("input[type=hidden][id^='Class']").val(),
                subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
                text_subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
                packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),
                text_packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),
                dgrpieces: $(this).find("[id^='DGRPieces']").val(),
                netquantity: $(this).find("[id^='NetQuantity']").val(),
                unit: $(this).find("input[type=hidden][id^='Unit']").val(),
                text_unit: $(this).find("input[type=hidden][id^='Unit']").val(),
                quantity: $(this).find("[id^='Quantity']").val(),
                packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
                text_packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
                ramcat: $(this).find("[id^='RamCat']").val(),
                erg: $(this).find("input[type=hidden][id^='ERG']").val(),
                text_erg: $(this).find("input[type=hidden][id^='ERG']").val()
            };
            GDRRemainingData.push(DGRInfo);
        }
    });

    $("div[id=divareaTrans_importfwb_fwbshipmentclasssphc]").not(':first').remove();
    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("tbody").remove();
    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").append(tblhtml);

    cfi.makeTrans("importfwb_fwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, GDRRemainingData);
    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");

        $(this).find("input[id^='SPHC']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
        });

        $(this).find("input[id^='UnNo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
        });

        $(this).find("input[id^='ShippingName']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
        });

        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        });

        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        });

        $(this).find("input[id^='PackingGroup']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
        });

        $(this).find("input[id^='Unit']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
        });

        $(this).find("input[id^='PackingInst']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
        });

        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        });
        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
    });
}

function GetDGRDetailsBySHC(SPHCSNos) {
    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetDGRInfo?SPHCSNo=" + SPHCSNos, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var DGRData = jQuery.parseJSON(result);
            var SPHCDGR = DGRData.Table;

            DGRSPHC = [];
            for (i = 0; i < SPHCDGR.length; i++) {
                var info = {
                    Key: SPHCDGR[i].SNo,
                    Text: SPHCDGR[i].Code
                };
                DGRSPHC.push(info);
            }
            if (DGRSPHC.length > 0) {
                $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
                    $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
                    $(this).find("input[id^='SPHC']").each(function () {
                        cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
                    });
                    $(this).find("input[id^='UnNo']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
                    });
                    $(this).find("input[id^='ShippingName']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
                    });
                    $(this).find("input[id^='Class']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
                    });
                    $(this).find("input[id^='SubRisk']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
                    });
                    $(this).find("input[id^='PackingGroup']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
                    });
                    $(this).find("input[id^='Unit']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
                    });
                    $(this).find("input[id^='PackingInst']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
                    });
                    $(this).find("input[id^='ERG']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
                    });
                    $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')

                });

                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "DGR Details", 1400);
                    // Use this to unbing click event of DGR when delete shc for future
                    $("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });
                });
            } else {
                $("a[id^='ahref_ClassDetails']").unbind("click");
            }

        },
        error: {

        }
    });
}

function GetQty(obj) {
    $(obj).closest('tr').find("input[id^='Quantity']").val((parseInt($(obj).closest('tr').find("input[id^='DGRPieces']").val() || "0") * parseFloat($(obj).closest('tr').find("input[id^='NetQuantity']").val() || "0")).toFixed(2));
}

function ResetDGROtherDetails(e) {
    if ($("#" + e).data("kendoAutoComplete") != undefined && $("#" + e).data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Shipment/AcceptanceService.svc/GetDGRInfoByID?SNo=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var DGRData = jQuery.parseJSON(result);
                var DGRDetail = DGRData.Table;

                if (DGRDetail.length > 0) {
                    var currentRow = $("#" + e).closest('tr');
                    if (e.indexOf("Text_UnNo") >= 0) {
                        currentRow.find("input[id^='Text_ShippingName']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["ColumnSearch"]);
                    } else if (e == "Text_ShippingName") {
                        currentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["UNNumber"]);
                    }
                    currentRow.find("input[id^='Text_Class']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ClassDivSub"], DGRDetail[0]["ClassDivSub"]);
                    currentRow.find("input[id^='Text_SubRisk']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["SubRisk"], DGRDetail[0]["SubRisk"]);
                    currentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingGroup"], DGRDetail[0]["PackingGroup"]);
                    currentRow.find("input[id^='Text_Unit']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["Unit"], DGRDetail[0]["Unit"]);
                    currentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingInst"], DGRDetail[0]["PackingInst"]);
                    currentRow.find("input[id^='Text_ERG']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ERGN"], DGRDetail[0]["ERGN"]);
                }

            },
            error: {

            }
        });
    }
}

function SaveDGRDetails() {
    var DGRArray = [];
    $("div[id$='divareaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
        if (DGRSPHC.length > 0) {
            var DGRViewModel = {
                SPHCSNo: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
                SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                DGRSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                UNNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").value(),
                DGRShipperSNo: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").key(),
                ProperShippingName: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                SubRisk: $(this).find("[id^='Text_SubRisk']").data("kendoAutoComplete").key(),
                PackingGroup: $(this).find("[id^='Text_PackingGroup']").data("kendoAutoComplete").key(),
                Pieces: $(this).find("[id^='DGRPieces']").val(),
                NetQuantity: $(this).find("[id^='NetQuantity']").val().replace(".00", ""),
                Unit: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                Quantity: $(this).find("[id^='Quantity']").val().replace(".00", ""),
                PackingInst: $(this).find("[id^='Text_PackingInst']").data("kendoAutoComplete").key(),
                RAMCategory: $(this).find("[id^='RamCat']").val(),
                ERGN: $(this).find("[id^='Text_ERG']").data("kendoAutoComplete").key(),
            };
            DGRArray.push(DGRViewModel);
        }
    });

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/SaveDGRDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBDGRTrans: DGRArray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - DGR', " DGR Details Saved Successfully", "bottom-right");

            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - DGR [' + awbNo + ']', result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DGR', "unable to process.", "bottom-right");

        }
    });

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

function comparePcsValue(obj) {
    var value = $(obj).val();
    if (parseFloat(value) < parseFloat(accpcs)) {
        $(obj).val(bkdpcs);
        ShowMessage('warning', 'Information!', "Entered Pieces cannot be less than Accepted Pieces. Accepted Pieces : " + bkdpcs.toString() + ".", "bottom-right");
    }
}

function compareGrossValue(obj) {
    if (parseFloat(accgrwt) > 0) {
        var flag = false;
        var value = $(obj).val();
        if (parseFloat(value) < parseFloat(accgrwt)) {
            $(obj).val(bkdgrwt);
            ShowMessage('warning', 'Information!', "Entered Gross weight cannot be less than accepted Gross weight. Accepted gross weight : " + bkdgrwt.toString() + ".", "bottom-right");
            flag = true;
        }
        return flag;
    } else
        return true;
}

function compareVolValue(obj) {
    var flag = true;
    var cbm = ($(obj).val() == "" ? 0 : parseFloat($(obj).val()));
    var volwt = cbm * 166.6667;
    if (parseFloat(volwt) < parseFloat(accvolwt)) {
        $(obj).val(bkdvolwt);
        ShowMessage('warning', 'Information!', "Entered Volume weight cannot be less than accepted Volume weight. Accepted volume weight : " + bkdvolwt.toString() + ".", "bottom-right");
        flag = false;
    }
    return flag;
}

function CalculateShipmentCBM() {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var volwt = ($("#VolumeWt").val() == "" ? 0 : parseFloat($("#VolumeWt").val()));
    var cbm = (volwt / 166.6667).toFixed(3);
    $("#CBM").val(Number(cbm) > 0 ? cbm.toString() : "");
    $("#_tempCBM").val(Number(cbm) > 0 ? cbm.toString() : "");
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
}

function CalculateShipmentChWt(obj) {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.6667;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='VolumeWt']").text(Number(volwt) > 0 ? volwt.toFixed(3) : "");
        $("#VolumeWt").val(Number(volwt) > 0 ? volwt.toFixed(3) : "");
        $("#_tempVolumeWt").val(Number(volwt) > 0 ? volwt.toFixed(3) : "");
    }
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toFixed(3).toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
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

function ISNumericNew(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 6)) {
        event.preventDefault();
    }
}

function ISNumber(obj) {
    if ($.inArray(event.keyCode, [8, 9, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]) !== -1 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
    } else {
        event.preventDefault();
    }
}

function BindItenAutoComplete(elem, mainElem) {
    var totalRow = $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").length;
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 != totalRow) {
            $(this).find("div[id^='transActionDiv']").hide();
        }

        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], null, "contains");
            }
        });

    });

    $(elem).find("input[id^='BoardPoint']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
        $("input[id^='BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());
        $("input[id^='Text_BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='Text_offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());

    });

    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").value("");
    $(elem).find("[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
    // diable previous row controles
    $(elem).prev().find("[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
    $(elem).prev().find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(false);
    $(elem).prev().find("[id^='FlightDate']").data("kendoDatePicker").enable(false);
    $(elem).prev().find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(false);

    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
}

function ResetSelectedFlight(obj) {
    if ($("#" + obj).attr("recname") == "Text_BoardPoint") {
        $("#" + obj).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
    } else if ($("#" + obj).attr("recname") == "Text_offPoint") {
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
    } else {
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        if (parseInt($("#" + obj).closest('tr').find("td[id^='tdSNoCol']").text() || "0") > 1) {
            if (Date.parse($("#" + obj).closest('tr').find("input[id^='FlightDate']").attr("sqldatevalue")) < Date.parse($("#" + obj).closest('tr').prev().find("input[id^='FlightDate']").attr("sqldatevalue"))) {
                $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
            }
        }
        if ($("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value() || "" != "") {
            $("#" + obj).closest('tr').find("[id^='Text_FlightNo']").attr("data-valid", "required");
        } else {
            $("#" + obj).closest('tr').find("[id^='Text_FlightNo']").removeAttr("data-valid");
        }
    }
}

function ReBindItenAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {
        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], null, "contains");
            }
        });
    });
    $(elem).find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(true);
    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").enable(true);
    $(elem).find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(true);
    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });

    var totalRow = $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").length;
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 == totalRow) {
            $(this).find("div[id^='transActionDiv']").show();
        }
    });
}

function BindSPHCAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SpecialHandlingCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
    });
    $(elem).find("a[id^='ahref_ClassDetails']").each(function () {
        $(this).unbind("click").bind("click", function () {
            cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "SPHC Trans");
        });
    });
}

function ReBindSPHCAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentsphc']").find("[id^='areaTrans_importfwb_shipmentsphc']").each(function () {
        $(this).find("input[id^='SPHC']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHC", "SNO", "CODE", ["CODE", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("a[id^='ahref_ClassDetails']").each(function () {
            $(this).unbind("click").bind("click", function () {
                cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "SPHC Trans");
            });
        });
    });
}

function BindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Quantity']").attr("disabled", "disabled");
    cfi.Numeric($(elem).find("input[id^='NetQuantity']").attr("id"), 2);
    $(elem).find("input[id^='SPHC']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
        }
        else {
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
        }
    });
    $(elem).find("input[id^='UnNo']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
        }
    });
    $(elem).find("input[id^='ShippingName']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
        }
    });
    $(elem).find("input[id^='Class']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        }
    });
    $(elem).find("input[id^='SubRisk']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        }
    });
    $(elem).find("input[id^='PackingGroup']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
        }
    });
    $(elem).find("input[id^='Unit']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
        }
    });
    $(elem).find("input[id^='PackingInst']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
        }
    });
    $(elem).find("input[id^='ERG']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        }
    });
    $(elem).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
}

function ReBindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
        cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
        $(this).find("input[id^='SPHC']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
            }
            else {
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
            }
        });
        $(this).find("input[id^='UnNo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='ShippingName']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        });
        $(this).find("input[id^='PackingGroup']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
        });
        $(this).find("input[id^='Unit']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
        });
        $(this).find("input[id^='PackingInst']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        });
        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')
    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
    });
}

function removeHandlingMessage(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmenthandlinginfo']").find("[id^='areaTrans_importfwb_shipmenthandlinginfo']").each(function () {
        $(this).find("input[id^='Type']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "HandlingMessageType", "SNo", "MessageType", ["MessageType"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function ValidateFlight(obj) {
    var CurrentRow = $("#" + obj).closest('tr');
    var CurrentRowNo = $("#" + obj).closest('tr').find("td[id^='tdSNoCol']").text();
    var FlightSNo = $("#" + obj).data("kendoAutoComplete").key();
    $.ajax({
        url: "Services/Import/ImportFWBService.svc/ValidateFlight?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var FlightData = Data.Table0;

            if (FlightData.length > 0) {
                if (FlightData[0].FlightStatus == "B") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert("AWB already Build Up. Flight amendment restricted.", "Warning - Flight No.");
                            $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " ");
                        }
                    } else {
                        jAlert("AWB already Build Up. Flight amendment restricted.", "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
                else if (FlightData[0].FlightStatus == "P") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert("AWB already planned in Loading Instructions. Kindly contact your supervisor in case you want to amend Flight Details.", "Warning - Flight No.");
                            $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " ");
                        }
                    } else {
                        jAlert("AWB already planned in Loading Instructions. Kindly contact your supervisor in case you want to amend Flight Details.", "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
            }
        }
    });

}

function ValidatePieces(obj) {

    var elem = $("#areaTrans_importfwb_shipmentdimension");
    var Pcs = 0;
    var balancePc = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        balancePc = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });

    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find($(obj).closest("tr")).index() - 1;

    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");
        CalculateVolume(elem);
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = balancePc;
        return false;
    }
    CalculateVolume(elem);
    return true;
}

function CalculateVolume(elem, obj) {
    elem = $("#areaTrans_importfwb_shipmentdimension");
    var divisor = 1;
    if ($("#Unit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;

    elem.closest("div").find("table > tbody").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function () {

        var Width = $(this).find("input[id^='Width']").val() == "" ? "0" : $(this).find("input[id^='Width']").val();
        var Length = $(this).find("input[id^='Length']").val() == "" ? "0" : $(this).find("input[id^='Length']").val();
        var Height = $(this).find("input[id^='Height']").val() == "" ? "0" : $(this).find("input[id^='Height']").val();
        var Pieces = $(this).find("input[id^='Pieces']").val() == "" ? "0" : $(this).find("input[id^='Pieces']").val();

        var currentVolume = 0;
        if (Pieces != "" && Pieces != undefined) {
            currentVolume = parseFloat(Pieces) * parseFloat(Length) * parseFloat(Width) * parseFloat(Height);
            var volWeight = (currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);
            VolumeCalculation = parseFloat(VolumeCalculation) + parseFloat(volWeight.toFixed(3));
            $(this).find("span[id^='VolumeWt']").html(volWeight.toFixed(3));
            $(this).find("input[id^='VolumeWt']").val(volWeight.toFixed(3));
        }
    });

    if (VolumeCalculation != 0) {
        $("span[id='DimVolumeWt']").html(VolumeCalculation.toFixed(3));
        $("input[id='DimVolumeWt']").val(VolumeCalculation.toFixed(3));
    }
    else {
        $("span[id='DimVolumeWt']").html(0);
        $("input[id='DimVolumeWt']").val(0);
    }
}

function checkonRemove(elem) {
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    $('.disablechk').removeAttr('disabled');
    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = false;
    $(elem).find("td[id^=transAction]").find("i[title='Add More']").hide();
    CalculateVolume(elem);

}

function beforeAddEventCallback(elem) {
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value);
    });
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");

        CalculateVolume(elem);
        return false;
    }

    if (Pcs == parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "Pieces already added.", "bottom-right");
        return false;
    }

    return true;
}

function beforeAddULDEventCallback(elem) {
    var Pcs = 0;
    elem.closest("table").find("[id^='Text_ULDNo']").each(function () {
        Pcs = Pcs + 1;
    });
    var ManualPcs = 0;

    $("#divareaTrans_importfwb_shipmentdimension").find('table:eq(0) > tbody').find("tr[data-popup='false']").each(function (row, i) {
        ManualPcs = $(i).find("td:nth-child(5) input[type=text]").val();
    });
    ManualPcs = ManualPcs == "" ? "0" : ManualPcs;
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='ULDNo']").length - 1;
    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='UldTareWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldPieces']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldGrossWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='ULDPivotWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldVolWt']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");

        CalculateVolume(elem);
        return false;
    }
    if (parseInt(Pcs) + parseInt(ManualPcs) >= parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "Pieces already added.", "bottom-right");
        return false;
    }

    return true;
}

function AfterAddDim() {
    var elem = $("#areaTrans_importfwb_shipmentdimension");
    var elem = $("#areaTrans_importfwb_shipmentdimension");
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });
    Pcs = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
    var count = elem.closest("table").find("[id^='Pieces']").length - 2;
    elem.closest("table").find("td[id^=transAction]").find("i[title='Add More']").hide();
}

function ValidateWeighingProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select SLI for processing.", "bottom-right");
        return;
    }

    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;

    $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:590px;'></div>");

    $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        $("#Piecestobeweighed").val("");
        $("#toPiecestobeweighed").val("")
        return;
    }

    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);
    var processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());

        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    if (!isProcessed) {
        handleAdd($("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentweightdetail", pieceSequence, "ScanPieces", "RemainingPieces");
        var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
        var SLINO = $("#Text_SLINo").val().split("-")[0];
        var HAWBNO = $("#Text_SLINo").val().split("-")[2];

        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("span[id^='SLISNo']").html(SLISNO);

        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("span[id^='SLINo']").html(SLINO);

        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

    }



}

function ValidateXRayProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select SLI for processing.", "bottom-right");
        return;
    }
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:590px;'></div>");
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs.trim() + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        return;
    }
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);

    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    handleAdd($("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("td:last"), "areaTrans_importfwb_shipmentxraydetail", pieceSequence, "ScanPieces", "RemainingPieces");

    var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
    var SLINO = $("#Text_SLINo").val().split("-")[0];
    var HAWBNO = $("#Text_SLINo").val().split("-")[2];

    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("span[id^='SLISNo']").html(SLISNO);

    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("span[id^='SLINo']").html(SLINO);

    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

}

function ValidateLocationProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select SLI for processing.", "bottom-right");
        return;
    }
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    var ULDLocationPcs = 0;
    $("div[id='divareaTrans_importfwb_shipmentuldlocation']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentuldlocation']").each(function () {
        ULDLocationPcs += 1;
    });
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        $("#Piecestobeweighed").val("");
        $("#toPiecestobeweighed").val("")
        return;
    }
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val() == "" ? "0" : $("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val() == "" ? "0" : $("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    handleAdd($("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentlocationdetail", pieceSequence, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);

    var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
    var SLINO = $("#Text_SLINo").val().split("-")[0];
    var HAWBNO = $("#Text_SLINo").val().split("-")[2];

    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("span[id^='SLISNo']").html(SLISNO);

    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("span[id^='SLINo']").html(SLINO);

    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

}

function handleAdd(elem, strid, pcsseq, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");

    var closestDiv = $(self).closest("div");

    addEventCallback = (addEventCallback == undefined ? null : addEventCallback);
    beforeAddEventCallback = (beforeAddEventCallback == undefined ? null : beforeAddEventCallback);
    removeEventCallback = (removeEventCallback == undefined ? null : removeEventCallback);

    var idCount = 0;
    var lastTable = $(closestDiv).find("[id^='areaTrans']:last");
    var lastAction = $(lastTable).find("[id^='transAction']");
    var myClone = $(self).clone(false);
    var linkText = 'Add more',
    linkClass = 'icon-trans-plus-sign',
    resetLinkText = 'Reset',
    resetLinkClass = 'icon-trans-refresh',
    enableRemove = true,
    removeLinkText = 'Delete',
    removeLinkClass = 'icon-trans-trash',
    confirmOnRemove = true,
    confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
    convertToControl = ConvertToControl,
    maxItemsAllowedToAdd = null,
    maxItemReachedCallback = null,
    searchType = false,
    isReset = false,
    data = [],
    isAdd = false,
    afterConvertMultiField = null;
    if (beforeAddEventCallback !== null) {
        var retVal = beforeAddEventCallback(elem.closest("[id^='areaTrans_']"));
        if (!retVal) {
            return false;
        }
    }

    var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
    var fieldCount = parseInt($(self).attr("FieldCount"), 10);
    if (maxItemsAllowedToAdd === null || totalCount < maxItemsAllowedToAdd) {
        var newElem = myClone.clone(true);
        $(newElem).attr("id", $(newElem).attr("id") + "_" + totalCount).show();

        var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) - pcsseq.split(',').length).toString();
        $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
        $("span[id='" + remailpcsctrlid + "']").html(remainPcs);

        $(newElem).find("*[id!=''][name!='']").each(function () {
            if ($(this).attr("id")) {
                var strid = $(this).attr("id");
                var strname = "";
                var type = $(this).attr("type");

                $(this).closest("tr").find("td[id^='tdSNoCol']").text((totalCount + 1).toString());

                if ($(this).attr("name")) {
                    strname = $(this).attr("name");
                }
                if ($(this).attr("controltype") == "datetype") {
                    if ($(this).attr("endcontrol") != undefined) {
                        $(this).attr("endcontrol", $(this).attr("endcontrol") + "_" + totalCount)
                    }
                    if ($(this).attr("startcontrol") != undefined) {
                        $(this).attr("startcontrol", $(this).attr("startcontrol") + "_" + totalCount)
                    }
                }

                $(this).attr("id", strid + "_" + totalCount);
                if (strname != undefined)
                    $(this).attr("name", strname + "_" + totalCount);
                if (type != "radio" && type != "checkbox")
                    $(this).val("");
                if (type == "checkbox")
                    $(this).attr("validatename", strid + "_" + totalCount + "[]");
            }
        });

        $(newElem).closest("tr").find("span[id^='" + pcscontrolid + "']").text(pcsseq);
        $(newElem).closest("tr").find("input[id^='" + pcscontrolid + "']").val(pcsseq);
        totalCount++;
        fieldCount++;

        $(self).attr("TotalFieldsAdded", totalCount);
        $(self).attr("FieldCount", fieldCount);

        $(newElem).removeAttr("uniqueId");

        if (enableRemove && $(self).attr("uniqueId") != $(elem).closest("[id^='areaTrans']").attr("uniqueId")) {
            if ($(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).length === 0) {
                $(elem).closest("[id^='areaTrans']").find("#transAction").append(" <input type='button' class='" + removeLinkClass + "'value='" + removeLinkText + "'/>");
            }
            $(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(newElem).attr("uniqueId", linkClass + Math.random());
        $(elem).closest("[id^='areaTrans']").after(newElem);

        $(elem).closest("[id^='areaTrans']").find("." + linkClass).remove();

        $(newElem).find("." + resetLinkClass).remove();
        $(newElem).find("." + linkClass).remove();
        $(newElem).find("." + removeLinkClass).remove();

        if (enableRemove) {
            if ($(newElem).find("." + removeLinkClass).length === 0) {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
            }
            $(newElem).find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(self).attr("maxCountReached", "false");
        if (isAdd) {
            if (linkClass != "scheduletransradiocss") {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                newElem.find("." + linkClass).unbind("click").click(function () {
                    if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                        return handleAdd($(this));
                    }
                });
            }
            else {
                $(newElem).find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                    if ($(this).val() == "1") {
                        if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                        else {
                            $(newElem).find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                $(this).removeAttr("checked");
                                if ($(this).val() == "0") {
                                    $(this).attr("checked", true);
                                }
                            });
                        }
                    }
                });
            }
        }
        if (convertToControl !== null) {
            convertToControl($(newElem), self);
        }
        if (addEventCallback !== null) {
            addEventCallback($(newElem), self);
        }
    }

    if (maxItemsAllowedToAdd !== null && totalCount >= maxItemsAllowedToAdd) {
        newElem.find("." + linkClass).hide();

        if (maxItemReachedCallback !== null) {
            maxItemReachedCallback($(newElem), self);
        }
    }
    return true;
}

function handleRemove(elem, strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var cnt = true;

    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");
    var linkText = 'Add more',
    linkClass = 'icon-trans-plus-sign',
    resetLinkText = 'Reset',
    resetLinkClass = 'icon-trans-refresh',
    enableRemove = true,
    removeLinkText = 'Delete',
    removeLinkClass = 'icon-trans-trash',
    confirmOnRemove = true,
    confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
    convertToControl = ConvertToControl,
    maxItemsAllowedToAdd = null,
    maxItemReachedCallback = null,
    searchType = false,
    isReset = false,
    data = [],
    isAdd = false,
    afterConvertMultiField = null;
    if (confirmOnRemove) {
        cnt = confirm(confirmationMsgOnRemove);
    }
    if (cnt) {
        var prevParent = $(elem).closest("[id^='areaTrans']").prev();

        var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
        totalCount--;

        $(self).attr("TotalFieldsAdded", totalCount);

        if ($(elem).closest("[id^='areaTrans']").find("." + linkClass).length >= 0) {
            if (enableRemove && $(self).attr("uniqueId") != $(prevParent).attr("uniqueId")) {
                if ($(prevParent).find("." + removeLinkClass).length === 0) {
                    $(prevParent).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
                }

                $(prevParent).find("." + removeLinkClass).unbind("click").click(function () {
                    return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid);
                });
            }
            var pieceSequence = $(elem).closest("tr").find("input[id^='" + pcscontrolid + "']").val();
            if (pieceSequence != undefined && pieceSequence != "") {
                var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) + pieceSequence.split(',').length).toString();
                $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
                $("span[id='" + remailpcsctrlid + "']").html(remainPcs);
            }
            $(elem).closest("[id^='areaTrans']").remove();
            $(prevParent).closest("div").find("." + linkClass).remove();
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                }
            }
            var idCount = 0;
            var parentID = $(prevParent).closest("div").find("[id^='areaTrans']:eq(0)").attr("id");
            $(prevParent).closest("div").find("[id^='areaTrans']:gt(0)").each(function () {
                $(this).attr("id", parentID + "_" + idCount);
                $(this).find("*[id!=''][name!='']").each(function () {
                    if ($(this).attr("id")) {
                        var strid = $(this).attr("id");
                        var strname = "";
                        $(this).closest("tr").find("td[id^='tdSNoCol']").text((idCount + 1).toString());
                        if ($(this).attr("name")) {
                            strname = $(this).attr("name");
                        }

                        if ($(this).attr("controltype") == "datetype") {
                            var EndControl = $(this).attr("endcontrol");

                            var StartControl = $(this).attr("startcontrol");
                            if (EndControl != undefined) {
                                $(this).attr("endcontrol", EndControl.substr(0, EndControl.lastIndexOf('_')) + "_" + idCount)
                            }
                            if (StartControl != undefined) {
                                $(this).attr("startcontrol", StartControl.substr(0, StartControl.lastIndexOf('_')) + "_" + idCount)
                            }
                        }
                        $(this).attr("id", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                        if (strname != undefined)
                            $(this).attr("name", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                    }
                });
                idCount++;
            });
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("." + linkClass).unbind("click").click(function () {
                        if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                    });
                }
                else {
                    $(prevParent).closest("div").find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                        if ($(this).val() == "1") {
                            if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                                return handleAdd($(this));
                            }
                            else {
                                $(prevParent).closest("div").find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                    $(this).removeAttr("checked");
                                    if ($(this).val() == "0") {
                                        $(this).attr("checked", true);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }

        if (maxItemsAllowedToAdd !== null && totalCount < maxItemsAllowedToAdd) {
            $(self).siblings().find("." + linkClass).show();
        }

        if (convertToControl !== null) {
            convertToControl($(prevParent), self);
        }
        if (removeEventCallback !== null) {
            removeEventCallback($(prevParent), self);
        }

    }
    return true;
}

function SwitchScanType(val, obj) {
    var closesttable = $(obj).closest("table");
    var closesttrindex = $(obj).closest("tr").index();
    closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").hide();
    if (val == "0") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    else if (val == "1") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    SetTotalPcs();
}

function BindWeighingMachineEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
        if (typevalue == "1") {
            $('#AWBNo').focus();
        }
    });
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtWeighing?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var weighingData = jQuery.parseJSON(result);
            var weighingArray = weighingData.Table0;
            var arr = weighingData.Table1;
            var ULDDimArray = weighingData.Table2;
            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();
            $("div[id$='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentweightdetail']:first").hide();
            if (weighingArray.length > 0) {
                for (var i = 0; i < weighingArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentweightdetail", weighingArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");
                    var row = $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last");
                    row.find("[id^='GrossWt_']").val(weighingArray[i].GrossWt);
                    row.find("[id^='Remarks_']").val(weighingArray[i].Remarks);
                    row.find("input[type=hidden][id^='SLISNo']").val(weighingArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(weighingArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(weighingArray[i].SLINO);
                    row.find("span[id^='SLINo']").html(weighingArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(weighingArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(weighingArray[i].HAWBNo);

                }

            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentweightdetail", dblscan, "ScanPieces", "RemainingPieces");
            }
            cfi.makeTrans("importfwb_shipmentweightulddetail", null, null, null, null, null, ULDDimArray);
            if (ULDDimArray.length <= 0) {
                $("div[id$='areaTrans_importfwb_shipmentweightulddetail']").find("[id='areaTrans_importfwb_shipmentweightulddetail']:first").hide();
            } else {
                $("input[id='RemainingPieces']").val(parseInt($("input[id='RemainingPieces']").val()) - parseInt($("div[id$='areaTrans_importfwb_shipmentweightulddetail']").find("tr[id^='areaTrans_importfwb_shipmentweightulddetail']").length));
                $("span[id='RemainingPieces']").text($("input[id='RemainingPieces']").val());
            }

            $('#divareaTrans_importfwb_shipmentweightulddetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find('td:eq(10)').css("display", "none");
                $(tr).find("input[id^='CapturedWt']").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='CapturedWt']").attr("data-valid", "required");
                $(tr).find("input[id^='TareWt']").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='GrossWt']").attr('readonly', true);
            });

            $('#divareaTrans_importfwb_shipmentweightdetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");

            });

            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}

function fn_ValidateULDWt(obj) {
    var CurrentRow = $(obj).closest('tr');
    if (parseFloat(CurrentRow.find("input[id^='CapturedWt']").val() == "" ? "0" : CurrentRow.find("input[id^='CapturedWt']").val()) < parseFloat(CurrentRow.find("input[id^='TareWt']").val() == "" ? "0" : CurrentRow.find("input[id^='TareWt']").val())) {
        if ($(obj).attr('recname') == "CapturedWt") {
            ShowMessage('warning', 'Warning - Weighing Machine', "Captured Weight can't be less than Tare Weight.", "bottom-right");
            CurrentRow.find("input[id^='CapturedWt']").val('');
            CurrentRow.find("input[id^='GrossWt']").val('');
        } else {
            ShowMessage('warning', 'Warning - Weighing Machine', "Tare Weight can't be greater than Captured Weight.", "bottom-right");
            CurrentRow.find("input[id^='CapturedWt']").val('');
            CurrentRow.find("input[id^='GrossWt']").val('');
        }
    } else {
        CurrentRow.find("input[id^='GrossWt']").val((parseFloat(CurrentRow.find("input[id^='CapturedWt']").val() == "" ? "0" : CurrentRow.find("input[id^='CapturedWt']").val()) - parseFloat(CurrentRow.find("input[id^='TareWt']").val() == "" ? "0" : CurrentRow.find("input[id^='TareWt']").val())).toFixed(3));
    }

}

function ResetPieces() {
    $("#Piecestobeweighed").val("");
    $("#_tempPiecestobeweighed").val("");
    $("#toPiecestobeweighed").val("")
    $("#_temptoPiecestobeweighed").val("")
}

function BindULDAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ULDNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    });
}

function BindDimensionEvents() {
    SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetDimemsionsAndULD?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var dimArray = dimuldData.Table0;
            var uldArray = dimuldData.Table1;
            var totaldim = dimuldData.Table2;
            var awbInfo = dimuldData.Table3;

            var arr = dimuldData.Table4;
            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();

            cfi.makeTrans("importfwb_shipmentdimension", null, null, AfterAddDim, checkonRemove, beforeAddEventCallback, dimArray);

            if (totaldim.length > 0) {
                $("#Unit[value='" + totaldim[0].Unit + "']").prop('checked', true);
                $("input[id='DimVolumeWt']").val(totaldim[0].DimVolumeWt);
                $("span[id='DimVolumeWt']").html(totaldim[0].DimVolumeWt);
            }
            else if (awbInfo.length > 0) {
                $("input[id='DimVolumeWt']").val(awbInfo[0].VOLUMEWEIGHT);
                $("span[id='DimVolumeWt']").html(awbInfo[0].VOLUMEWEIGHT);
            }
            $("[id='Unit']").unbind("click").bind("click", function (e) {
                var typevalue = $(this).attr("value");
                CalculateVolume();
            });

            $("div[id$='divareaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                //$(tr).find('td:eq(7)').prepend("<label for='Pieces'>" + $(tr).find("input[id^='Pieces']").val().toString() + " /</label>");
                $(tr).find('td:eq(7)').append("<label for='Pieces'>/" + dimArray[row]['totalpieces'].toString() + "</label>");

                $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
                $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    fn_RemoveRow(this);
                });
                $(tr).find("input[id^=Length]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=Width]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=Height]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
            });
            $("div[id$='divareaTrans_importfwb_shipmentdimension'] table tr:first").find('td:eq(1)').css("display", "none");

        },
        error: {

        }
    });
}

function fn_AddNewRow(input) {
    fn_CalculateSplitTotalPcs(input);
    var TotalPlanPcs = 0;
    var CurrentTotalPcs = 0;
    var CurrentSLISNo = 0;
    if ($(input).parent().find("label").text() != undefined && $(input).parent().find("label").text() != "") {
        CurrentTotalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
    }
    CurrentSLISNo = $(input).parent().parent().find("span[id^='SLISNo']").text();

    $(input).parent().parent().parent().find('tr').each(function (row, tr) {
        if ($(tr).find("span[id^='SLISNo']").text() == CurrentSLISNo) {
            TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find("input[id^='Pieces']").val());
        }
    });

    if (TotalPlanPcs > CurrentTotalPcs) {
        $(input).val('');
        return false;
    }
    if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
        var trClone = $(input).parent().parent().clone(false);
        if ($(trClone).find("i[title='Delete']").length <= 0) {
            $(trClone).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-trash' title='Delete'></i>");
        }
        trClone.find("input[id^='Pieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);

        trClone.find("input[id*='Length']").attr('readonly', false);
        trClone.find("input[id*='Width']").attr('readonly', false);
        trClone.find("input[id*='Height']").attr('readonly', false);

        $(input).parent().parent().after(trClone);
        $("div[id$='divareaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function (row, tr) {
            $(tr).find('td:eq(0)').text(row + 1);
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").remove();
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveRow(this);
            });
            $(tr).find("input[id^=Length]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=Width]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=Height]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });

            $(tr).find("input[id^='Length']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });
            $(tr).find("input[id^='Width']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });
            $(tr).find("input[id^='Height']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });


        });
    }
    CalculateVolume();
}

function fn_RemoveRow(input) {
    var tr = $(input).closest('tr');
    if (tr.find("span[id^='SLISNo']").text() == tr.prev().find("span[id^='SLISNo']").text()) {
        if (confirm('Are you sure, you wish to remove selected row?')) {
            tr.prev().find("input[id*='Pieces']").val(parseInt(tr.prev().find("input[id^='Pieces']").val()) + parseInt(tr.find("input[id^='Pieces']").val()));
            $(input).closest('tr').remove();
        }
    }
    $("div[id$='divareaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function (row, tr) {
        $(tr).find('td:eq(0)').text(row + 1);;
    });
    CalculateVolume(input);
}

function fn_CalculateSplitTotalPcs(input) {
    var flag = false;
    var CurrentSLISNo = 0;
    var trRow = $(input).closest('tr');
    CurrentSLISNo = $(input).parent().parent().find("span[id^='SLISNo']").text();

    if ($(input).val() != "") {
        var totalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();

        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find("span[id^='SLISNo']").text() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='Pieces']").val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='Pieces']").val());
            }
        });
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                alert("Pieces should be less than Total Pieces");
                ShowMessage('warning', 'Warning -Pieces should be less than Total Pieces', "", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', "", "bottom-right");
            $(input).val(totalPcs);
            flag = false;

        }
    }
    return flag;
}

function BindULDDimensionInfo() {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetULDDimensionInfo?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var uldArray = dimuldData.Table0;

            cfi.makeTrans("importfwb_shipmentuld", null, null, BindULDAutoComplete, null, null, uldArray);
            if (uldArray.length <= 0) {
                $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id='areaTrans_importfwb_shipmentuld']:first").hide();
            }

            $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
                $(tr).find("input[id^='Unit']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode", "UnitName"], CalculateULDVolume, "contains");
                });
                $(tr).find('td:eq(6)').append("<label for='Pieces' style='display:none'>/" + uldArray[row]['totalpieces'].toString() + "</label>");
                $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
                $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    fn_RemoveULDRow(this);
                });
                $(tr).find("input[id^=SLACPieces]").unbind("keydown").bind("keydown", function () {
                    ISNumber(this);
                });
                $(tr).find("input[id^=UldPieces]").unbind("keydown").bind("keydown", function () {
                    ISNumber(this);
                });
                $(tr).find("input[id^=ULDLength]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=ULDWidth]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=ULDHeight]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
                $(tr).find("span[id^='SLISNo']").css("display", "none");
                if (row > 0) {
                    if ($(tr).find("span[id^='ULDNo']").text() == $(tr).prev().find("span[id^='ULDNo']").text()) {
                        $(tr).find("span[id^='SLINo']").css("display", "none");
                        $(tr).find("span[id^='HAWBNo']").css("display", "none");
                        $(tr).find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
                        $(tr).find("input[id*='SLACPieces']").css("display", "none");
                    }
                }
            });

            $("div[id$='areaTrans_importfwb_shipmentuld'] table tr:eq(2)").find('td:eq(1)').css("display", "none");

        },
        error: {

        }
    });
}

function fn_AddNewULDRow(input) {
    fn_CalculateSplitTotalULDPcs(input);
    var TotalPlanPcs = 0;
    var CurrentTotalPcs = 0;
    var CurrentSLISNo = 0;
    var SLACPcs = 0;
    if ($(input).parent().find("label").text() != undefined && $(input).parent().find("label").text() != "") {
        CurrentTotalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
    }
    SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() == "" ? "0" : $(input).parent().parent().find("input[id*='SLACPieces']").val();
    CurrentTotalPcs = parseInt(SLACPcs) > parseInt(CurrentTotalPcs) ? SLACPcs : CurrentTotalPcs;

    CurrentSLISNo = $(input).parent().parent().find("span[id^='ULDNo']").text();

    $(input).parent().parent().parent().find('tr').each(function (row, tr) {
        if ($(tr).find("span[id^='ULDNo']").text() == CurrentSLISNo) {
            TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
        }
    });

    if (TotalPlanPcs > CurrentTotalPcs) {
        $(input).val('');
        return false;
    }
    if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
        var trClone = $(input).parent().parent().clone(false);
        if ($(trClone).find("i[title='Delete']").length <= 0) {
            $(trClone).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-trash' title='Delete'></i>");
        }
        trClone.find("input[id^='UldPieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);

        $(input).parent().parent().find("input[id*='SLACPieces']").attr('disabled', true);
        trClone.find("span[id^='SLINo']").css("display", "none");
        trClone.find("span[id^='HAWBNo']").css("display", "none");
        trClone.find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
        trClone.find("input[id*='SLACPieces']").css("display", "none");

        trClone.find("input[id^='ULDLength']").attr('readonly', false);
        trClone.find("input[id^='ULDWidth']").attr('readonly', false);
        trClone.find("input[id^='ULDHeight']").attr('readonly', false);


        $(input).parent().parent().after(trClone);

        $("div[id$='divareaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function (row, tr) {
            $(tr).find("[id^='Unit']").attr('id', 'Unit' + row)
            $(tr).find("[id^='Unit']").attr('name', 'Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('id', 'Text_Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('name', 'Text_Unit' + row)

            $(tr).find('td:eq(0)').text(row + 1);
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").remove();
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveULDRow(this);
            });
            //$(tr).find("input[id^='ULDNo']").each(function () {
            //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            //});

            $(tr).find("input[id^='Unit']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode", "UnitName"], CalculateULDVolume, "contains");
            });

            $(tr).find("input[id^=UldPieces]").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $(tr).find("input[id^=ULDLength]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=ULDWidth]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=ULDHeight]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });


            $(tr).find("input[id^='ULDLength']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDWidth']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDHeight']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });


        });
        $("div[id$='divareaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").find("input[id*='Text_Unit']").closest('span').css('width', '')
    }
    CalculateULDVolume();
}

function fn_RemoveULDRow(input) {
    var tr = $(input).closest('tr');
    if (tr.find("span[id^='ULDNo']").text() == tr.prev().find("span[id^='ULDNo']").text()) {
        if (confirm('Are you sure, you wish to remove selected row?')) {
            tr.prev().find("input[id*='UldPieces']").val(parseInt(tr.prev().find("input[id^='UldPieces']").val()) + parseInt(tr.find("input[id^='UldPieces']").val()));
            $(input).closest('tr').remove();
        }
    }
    $("div[id$='divareaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function (row, tr) {
        $(tr).find('td:eq(0)').text(row + 1);;
    });
    CalculateULDVolume(input);
}

function fn_ValidateSLACPCS(input) {
    var tr = $(input).closest('tr');
    var SLACPcs, PCS;
    SLACPcs = $(input).val() == "" ? "0" : $(input).val();
    PCS = $(input).closest('tr').find("label[for='Pieces']").text().replace("/", "") == "" ? "0" : $(input).closest('tr').find("label[for='Pieces']").text().replace("/", "");
    if (parseInt(SLACPcs) < parseInt(PCS)) {
        alert("SLAC Pieces should not be less than ULD Pieces");
        $(input).val(PCS);
    }
}

function fn_CalculateSplitTotalULDPcs(input) {
    var flag = false;
    var CurrentSLISNo = 0;
    var trRow = $(input).closest('tr');
    CurrentSLISNo = $(input).parent().parent().find("span[id^='ULDNo']").text();

    if ($(input).val() != "") {
        var totalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();
        SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() == "" ? "0" : $(input).parent().parent().find("input[id*='SLACPieces']").val();
        totalPcs = parseInt(SLACPcs) > parseInt(totalPcs) ? SLACPcs : totalPcs;
        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find("span[id^='ULDNo']").text() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
            }
        });
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                alert("Pieces should be less than Total Pieces");
                ShowMessage('warning', 'Warning -Pieces should be less than Total Pieces', "", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', "", "bottom-right");
            $(input).val(totalPcs);
            flag = false;

        }
    }
    return flag;
}

function CalculateULDVolume(elem, obj) {
    elem = $("#areaTrans_importfwb_shipmentuld");

    var VolumeCalculation = 0;


    elem.closest("div").find("table > tbody").find("[id^='areaTrans_importfwb_shipmentuld']").each(function () {

        var Width = $(this).find("input[id^='ULDWidth']").val() == "" ? "0" : $(this).find("input[id^='ULDWidth']").val();
        var Length = $(this).find("input[id^='ULDLength']").val() == "" ? "0" : $(this).find("input[id^='ULDLength']").val();
        var Height = $(this).find("input[id^='ULDHeight']").val() == "" ? "0" : $(this).find("input[id^='ULDHeight']").val();
        var Pieces = $(this).find("input[id^='UldPieces']").val() == "" ? "0" : $(this).find("input[id^='UldPieces']").val();
        var divisor = 1;
        divisor = $(this).find("input[id^='Text_Unit'").data("kendoAutoComplete").value().split('-')[0] == "CMT" ? 6000 : 366;
        var currentVolume = 0;
        if (Pieces != "" && Pieces != undefined) {
            currentVolume = parseFloat(Pieces) * parseFloat(Length) * parseFloat(Width) * parseFloat(Height);
            var volWeight = (currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);

            $(this).find("span[id^='UldVolWt']").html(volWeight.toFixed(3) + "(" + (volWeight.toFixed(3) / 166.6667).toFixed(3) + ")");
            $(this).find("input[id^='UldVolWt']").val(volWeight.toFixed(3));
        }
    });
}

function BindULDDimensionDetails() {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetULDDimensionDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var uldArray = dimuldData.Table0;

            cfi.makeTrans("importfwb_shipmentulddetails", null, null, BindULDAutoComplete, null, null, uldArray);
            if (uldArray.length <= 0) {
                $("div[id$='divareaTrans_importfwb_shipmentulddetails']").find("[id='areaTrans_importfwb_shipmentulddetails']:first").hide();
            }


            $("div[id$='areaTrans_importfwb_shipmentulddetails']").find("[id^='areaTrans_importfwb_shipmentulddetails']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
                $(tr).find("input[id^='UldLoadingCode']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDLoadingCode", "ULDLoadingCodes", "SNo", "ULDLoadingCode", ["ULDLoadingCode", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldLoadingIndicators']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDLoadingIndicator", "ULDLoadingIndicator", "SNo", "ULDLoadingIndicator", ["ULDLoadingIndicator", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldContourCode']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AbbrCode", "ULDContour", "SNo", "AbbrCode", ["AbbrCode", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldBupType']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "Description", "buptype", "SNo", "Description", ["Description"], null, "contains");
                });
                $(tr).find("input[id^='UldBasePallet']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });

                $(tr).find("td[id^=transAction]").hide();
                $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
            });
            $("div[id$='areaTrans_importfwb_shipmentulddetails'] table tr:eq(2)").find('td:eq(1)').css("display", "none");
            $("div[id$='areaTrans_importfwb_shipmentulddetails'] table tr:eq(2)").find('td:last').css("display", "none");

        },
        error: {

        }
    });
}

function BindDimensionEventsNew() {
    var dbtableName = "AWBRateDesription";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
        getRecordServiceMethod: "GetFDimemsionsAndULDNew",
        masterTableSNo: currentawbsno,
        caption: "Rating",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: 'NoOfPieces', display: 'Pieces', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 5 }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                {
                    name: 'GrossWeight', display: 'Gr. Wt.', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, onChange: function (evt, rowIndex) { }
                },
                 {
                     name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
                 },
                {
                    name: 'CommodityItemNumber', display: 'Com. Item No.', type: 'text', value: 0, ctrlCss: { width: '100px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, }, onChange: function (evt, rowIndex) { }
                },
                {
                    name: 'ChargeableWeight', display: 'Ch. Wt.', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: false, value: 0
                },
                {
                    name: 'Charge', display: 'Rate', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, }, isRequired: false, value: 0
                },
                 {
                     name: 'ChargeAmount', display: 'Freight Amt.', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, }, isRequired: false, value: 0
                 },
                  {
                      name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 18, onBlur: "CheckLength(this)", onkeypress: "ISNumeric(this);", }, isRequired: false, value: 0
                  },
               {
                   name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, tableName: "Country", textColumn: "CountryCode", templateColumn: ["CountryCode", "CountryName"], keyColumn: "SNo"
               },
                 {
                     name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }
                 },
                  {
                      name: 'ConsolDesc', display: 'Consol Desc.', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: false
                  },
                {
                    name: 'hdnChildData', type: 'hidden', value: 0
                },

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
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            if (addedRowIndex == 0) {
                var Pieces = $("#Pieces").val();
                var GrossWt = $("#GrossWt").val();
                if ($("#tblAWBRateDesription_NoOfPieces_" + addedRowIndex).val() != 0) {
                    $(caller).appendGrid('setCtrlValue', 'NoOfPieces', addedRowIndex, Pieces);
                }
                if ($("#tblAWBRateDesription_GrossWeight_" + addedRowIndex).val() != 0) {
                    $(caller).appendGrid('setCtrlValue', 'NoOfPieces', addedRowIndex, Pieces);
                    $(caller).appendGrid('setCtrlValue', 'GrossWeight', addedRowIndex, GrossWt);
                }
            }
        },
        customFooterButtons: [
            { uiButton: { label: 'Get Rate', text: true }, btnAttr: { title: 'Get Rate' }, click: function (evt) { SearchData(this) }, atTheFront: true },
        ],

        isPaging: true,
        hideButtons: { updateAll: true, insert: true }

    });
}

function CalculateVol(obj) {
    if ($(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_HdnMeasurementUnitCode_").val() == "") {
        ShowMessage('warning', 'Information!', "Select Mes. Unit.", "bottom-right");
        $(obj).val('');
        return false;
    }
    var Pcs, Len, Width, Height;
    Pcs = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Pieces_").val();
    Len = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Length_").val();
    Width = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Width_").val();
    Height = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Height_").val();

    if ($(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_HdnMeasurementUnitCode_").val() == "CMP")
        divisor = 6000;
    else
        divisor = 366;


    var currentVolume = 0;
    if (Pcs != "" && Pcs != undefined) {
        currentVolume = parseFloat(Pcs == "" ? "0" : Pcs) * parseFloat(Len == "" ? "0" : Len) * parseFloat(Width == "" ? "0" : Width) * parseFloat(Height == "" ? "0" : Height);
        var volWeight = Math.ceil(currentVolume / divisor);
        volWeight = (volWeight < 1 ? 1 : volWeight);
        $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_VolumeWeight_").val(volWeight);
        $(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_VolumeWeight_").val(volWeight);
    }

}

function BindDimensionEventsNewULD() {
    var dbtableName = "AWBRateDesriptionULD";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
        getRecordServiceMethod: "GetFDimemsionsAndULDRate",
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
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: 0, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
                 },
                     {
                         name: 'SLAC', display: 'SLAC', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                     },
                 {
                     name: "ULD", display: "ULD Type", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "50px" }, isRequired: true, tableName: "ULD", textColumn: "ULDName", templateColumn: "", keyColumn: "SNo"
                 },
                {
                    name: 'ULDNo', display: 'ULD No.', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 8, }, isRequired: true, onChange: function (evt, rowIndex) { }
                },

                 {
                     name: 'Charge', display: 'Charge', type: 'decimal3', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: 0, value: 0
                 },
                 {
                     name: 'ChargeAmount', display: 'Charge Amt.', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: 0, value: 0
                 },
                    {
                        name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 10, onBlur: "CheckLength(this)", onkeypress: "ISNumeric(this);", }, isRequired: false, value: 0
                    },
               {
                   name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, tableName: "Country", textColumn: "CountryCode", templateColumn: ["CountryCode", "CountryName"], keyColumn: "SNo"
               },
                  {
                      name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: true
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
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
        getRecordServiceMethod: "GetAWBOtherChargeData",
        masterTableSNo: currentawbsno,
        caption: "Other Charges",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: pageType == 'EDIT' ? 'Type' : 'Type', display: 'Type', type: 'select', ctrlOptions: { 'P': 'PREPAID', 'C': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { CalculateRateTotal(); }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "150px" }, isRequired: true, tableName: "AWBOtherChargeCode", textColumn: "OtherChargeCode", keyColumn: "OtherChargeCode", templateColumn: ["OtherChargeCode", "Description"],
                 },
                 {
                     name: pageType == 'EDIT' ? 'DueType' : 'DueType', display: 'Due Carrier/Forwarder(Agent)', type: 'select', ctrlOptions: { 'A': 'Agent', 'C': 'Carrier' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: 'Amount', display: 'Amount', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: true, value: 0
                 }
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function SetAWBDefaultValues() {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetAWBRateDefaultValues?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            if (RateArray.length > 0) {
                for (i = 0; i < RateArray.length; i++) {
                    $('#tblAWBRateDesription').appendGrid('appendRow', [
                     {
                         NoOfPieces: RateArray[0]["TotalPieces"],
                         GrossWeight: RateArray[0]["TotalGrossWeight"],
                         WeightCode: "K",
                         RateClassCode: "",
                         CommodityItemNumber: "",
                         ChargeableWeight: "",
                         Charge: "",
                         ChargeAmount: "",
                         NatureOfGoods: RateArray[0]["NatureOfGoods"]
                     }
                    ]);
                }
            }

        },
        error: {

        }
    });


}

function BindAWBRate() {
    cfi.AutoComplete("AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("ChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", ["AWBChargeCode", "Description"], null, "contains");
    cfi.AutoCompleteByDataSource("Valuation", WeightValuation, EnableDisableChargeField);
    cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);
    cfi.AutoComplete("CDCCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], CalculateConversionAmount, "contains");
    cfi.AutoComplete("CDCDestCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], CalculateConversionAmount, "contains");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetAWBRateDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            var TACTRateArray = Data.Table1;
            if (RateArray.length > 0) {
                $("#Text_AWBCurrency").data("kendoAutoComplete").setDefaultValue(RateArray[0].AWBCurrencySNo, RateArray[0].CurrencyCode);
                $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDCurrencyCode, RateArray[0].CVDCurrencyCode);
                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDChargeCode, RateArray[0].CVDChargeCode);
                $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(RateArray[0].FreightType, RateArray[0].txtFreightType);
                $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDOtherCharges, RateArray[0].CVDOtherChargestext);
                $("#DecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(2));
                $("#_tempDecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(2));
                $("#DecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(2));
                $("#_tempDecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(2));
                $("#Insurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(2));
                $("#_tempInsurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(2));
                $("#ValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(2));
                $("#_tempValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(2));
                $("#CVDTax").val(RateArray[0].CVDTax == "" ? "" : parseFloat(RateArray[0].CVDTax).toFixed(3));
                $("#_tempCVDTax").val(RateArray[0].CVDTax == "" ? "" : parseFloat(RateArray[0].CVDTax).toFixed(2));
                $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCCurrencyCode, RateArray[0].CDCCurrencyCode);
                $("#CDCConversionRate").val(RateArray[0].CDCCurrencyConversionRate == "" ? "" : parseFloat(RateArray[0].CDCCurrencyConversionRate).toFixed(6));
                $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCDestinationCurrencyCode, RateArray[0].CDCDestinationCurrencyCode);
                $("#CDCChargeAmount").val(RateArray[0].TotalCollectAmount == "" ? "" : parseFloat(RateArray[0].TotalCollectAmount).toFixed(2));
                $("#_tempCDCChargeAmount").val(RateArray[0].TotalCollectAmount == "" ? "" : parseFloat(RateArray[0].TotalCollectAmount).toFixed(2));
                $("#CDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(2));
                $("#_tempCDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(2));
                $("#TotalFreight").val(RateArray[0].TotalPrepaidAmount);
                $("#_tempTotalFreight").val(RateArray[0].TotalPrepaidAmount);
                $("#TotalAmount").val(RateArray[0].TotalCollectAmount);
                $("#_tempTotalAmount").val(RateArray[0].TotalCollectAmount);

                if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
                    $('#CDCChargeAmount').removeAttr('disabled');
                    $('#CDCTotalCharAmount').removeAttr('disabled');
                    $('#Text_CDCCurrencyCode').data("kendoAutoComplete").enable(true);
                    $('#CDCConversionRate').removeAttr('disabled');
                    $('#Text_CDCDestCurrencyCode').data("kendoAutoComplete").enable(true);
                } else {
                    $('#CDCChargeAmount').val('');
                    $('#_tempCDCChargeAmount').val('');
                    $('#CDCTotalCharAmount').val('');
                    $('#_tempCDCTotalCharAmount').val('');
                    $('#CDCConversionRate').val('');
                    $('#CDCChargeAmount').attr("disabled", "disabled");
                    $('#CDCTotalCharAmount').attr("disabled", "disabled");
                    $('#Text_CDCCurrencyCode').data("kendoAutoComplete").enable(false);
                    $('#CDCConversionRate').attr("disabled", "disabled");
                    $('#Text_CDCDestCurrencyCode').data("kendoAutoComplete").enable(false);
                    $('#Text_CDCCurrencyCode').val('');

                }
            }
            if (TACTRateArray.length > 0) {
                TactArray = [];
                var tactdata = {
                    AWBSNo: TACTRateArray[0].AWBSNo,
                    BaseOn: TACTRateArray[0].BaseOn,
                    ChargeableWeight: TACTRateArray[0].ChargeableWeight,
                    CommodityItemNumber: TACTRateArray[0].CommodityItemNumber,
                    GrossWeight: TACTRateArray[0].GrossWeight,
                    NatureOfGoods: TACTRateArray[0].NatureOfGoods,
                    NoOfPieces: TACTRateArray[0].NoOfPieces,
                    RateClassCode: TACTRateArray[0].RateClassCode,
                    Charge: TACTRateArray[0].Charge,
                    ChargeAmount: TACTRateArray[0].ChargeAmount,
                    WeightCode: TACTRateArray[0].WeightCode,
                }
                TactArray.push(tactdata);
                $("#tblAWBRateDesription > tfoot > tr > td > button:nth-child(1)").after("<span class='ui-button-text' id='spanTactRate'>TACT Rate: " + TACTRateArray[0].Charge + "</span>");
            }
            if ($("#DecCarriageVal").val() == "")
                $("#_tempDecCarriageVal").val("NVD");
            $("#DecCarriageVal").val("NVD");
            if ($("#DecCustomsVal").val() == "")
                $("#_tempDecCustomsVal").val("NCV");
            $("#DecCustomsVal").val("NCV");
            if ($("#Insurance").val() == "")
                $("#_tempInsurance").val("XXX");
            $("#Insurance").val("XXX");
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

function CalculateConversionAmount(valueId, value, keyId, key) {
    var total = $("#TotalAmount").val() == "" ? 0 : $("#TotalAmount").val();
    var FromCurrency = $("#Text_CDCCurrencyCode").data("kendoAutoComplete").key();
    var ToCurrency = $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetExchangeRate", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FromCurrency: FromCurrency, ToCurrency: ToCurrency }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var conversionRate = resData.Table0[0].Rate;
            var totalAmount = parseFloat(total) * parseFloat(conversionRate);
            $("#CDCConversionRate").val(conversionRate);
            $("#CDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
            $("#_tempCDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
        },
        error: function (xhr) {
            var ex = xhr;
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
    // calculate Total of rates fetched from Get Rate 
    CalculateRateTotal();
}

function PopupDiv(obj) {
    CurrentRow = obj;
    var HidDataVal = $(obj).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val();
    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    if (HidDataVal != 0 && HidDataVal != "undefined") {
        $("#tblAWBRateDesriptionChild").appendGrid('load', JSON.parse(HidDataVal));
    }

    $("div[id=ChildGrid]").not(':first').remove();
    if (!$("#ChildGrid").data("kendoWindow"))
        cfi.PopUp("ChildGrid", "", null, null, ShowAlert);
    else
        $("#ChildGrid").data("kendoWindow").open();

}

function ShowAlert(e) {
    var childdata = [];
    $("#tblAWBRateDesriptionChild").find("tr[id^='tblAWBRateDesriptionChild_Row_']").each(function (i, row) {
        var dimInfo = {
            SNo: i + 1,
            AWBSNo: currentawbsno,
            Length: $(row).find("[id^=tblAWBRateDesriptionChild_Length_]").val() || "0",
            Width: $(row).find("[id^=tblAWBRateDesriptionChild_Width_]").val() || "0",
            Height: $(row).find("[id^=tblAWBRateDesriptionChild_Height_]").val() || "0",
            MeasurementUnitCode: $(row).find("[id^=tblAWBRateDesriptionChild_MeasurementUnitCode_]").val() || "0",
            Pieces: $(row).find("[id^=tblAWBRateDesriptionChild_Pieces_]").val() || "0",
            VolumeWeight: $(row).find("[id^=tblAWBRateDesriptionChild_VolumeWeight_]").val() || "0",
            VolumeUnit: $(row).find("[id^=tblAWBRateDesriptionChild_VolumeUnit_]").val() || "0",
            AWBRateDescriptionSNo: "0"
        }
        childdata.push(dimInfo);
    });

    $(CurrentRow).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val(JSON.stringify(childdata));
}

function BindDimensionChildGrid(tableid) {
    var dbtableName = tableid;
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
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

function BindAWBSummary(isdblclick) {
    cfi.AutoComplete("OPIAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("OPIOfficeDesignator", "Code", "OfficeFunctionDesignator", "Code", "Code", "", null, "contains");
    cfi.AutoComplete("OPIOtherAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    cfi.AutoComplete("REFOthAirportCityCode", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    cfi.AutoComplete("ISUPlace", "CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetAWBSummary?AWBSNo=" + currentawbsno + "&OfficeSNo=" + userContext.OfficeSNo || "0", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var SummaryArray = Data.Table0;
            var SenderRefArray = Data.Table1;

            var AirportCityData = [];
            var OfficeDesignatorData = [];
            var CompanyDesignatorData = [];

            if (SenderRefArray.length > 0) {
                for (i = 0; i < SenderRefArray.length; i++) {
                    var AirportCityinfo = {
                        Key: SenderRefArray[i]["AirportCity"],
                        Text: SenderRefArray[i]["AirportCity"]
                    };
                    var OfficeDesignatorinfo = {
                        Key: SenderRefArray[i]["OfficeDesignator"],
                        Text: SenderRefArray[i]["OfficeDesignator"]
                    };
                    var CompanyDesignatorinfo = {
                        Key: SenderRefArray[i]["CompanyDesignator"],
                        Text: SenderRefArray[i]["CompanyDesignator"]
                    };

                    AirportCityData.push(AirportCityinfo);
                    OfficeDesignatorData.push(OfficeDesignatorinfo);
                    CompanyDesignatorData.push(CompanyDesignatorinfo);
                }
            }
            cfi.AutoCompleteByDataSource("REFAirportCityCode", AirportCityData);
            cfi.AutoCompleteByDataSource("REFOfficeDesignator", OfficeDesignatorData);
            cfi.AutoCompleteByDataSource("REFCompDesignator", CompanyDesignatorData);


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
                $("#_tempOPIParticipantCode").val(SummaryArray[0].OPIParticipantCode);
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
                $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFCompanyDesignator, SummaryArray[0].REFCompanyDesignator);

                $("#REFCompDesignator").val(SummaryArray[0].REFCompanyDesignator);
                $("#REFOthPartOfficeFileRef").val(SummaryArray[0].REFOtherParticipantOfficeFileReference);
                $("#REFParticipantCode").val(SummaryArray[0].REFParticipantCode);
                $("#_tempREFParticipantCode").val(SummaryArray[0].REFParticipantCode);
                $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOtherAirportCityCode, SummaryArray[0].REFOtherAirportCityCode);
                $("#CORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
            }
            if ($("#Text_REFAirportCityCode").data("kendoAutoComplete").key() == "") {
                $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(AirportCityData[0]["Key"], AirportCityData[0]["Key"]);
            }
            if ($("#Text_REFOfficeDesignator").data("kendoAutoComplete").key() == "") {
                $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(OfficeDesignatorData[0]["Key"], OfficeDesignatorData[0]["Key"]);
            }
            if ($("#Text_REFCompDesignator").data("kendoAutoComplete").key() == "") {
                $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(CompanyDesignatorData[0]["Key"], CompanyDesignatorData[0]["Key"]);
            }
        },
        error: {

        }
    });
}

function BindXRayEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");

    cfi.AutoComplete("SecurityStatus", "Description", "SecurityCodes", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("SecurityIssuanc", "Description", "securityissuance", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("ScreeningMethod", "Description", "ScreeningMethods", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("ScreeningExemption", "Description", "ScreeningExemptions", "SNo", "Code", ["Code", "Description"], null, "contains");
    $("#Time").kendoTimePicker({
        format: "HH:mm"
    });

    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtXray?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var xrayData = jQuery.parseJSON(result);
            var xrayArray = xrayData.Table0;
            var arr = xrayData.Table1;
            var UldArray = xrayData.Table2;
            var OtherDetailsArray = xrayData.Table3;

            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();

            $("div[id$='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentxraydetail']:first").hide();

            if (xrayArray.length > 0) {
                for (var i = 0; i < xrayArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("td:last"), "areaTrans_importfwb_shipmentxraydetail", xrayArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");

                    var row = $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last");

                    row.find("input[type=hidden][id^='SLISNo']").val(xrayArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(xrayArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(xrayArray[i].SLINo);
                    row.find("span[id^='SLINo']").html(xrayArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(xrayArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(xrayArray[i].HAWBNo);
                }

            }
            else if ((isdblclick == undefined ? "FALSE" : isdblclick.toUpperCase()) == "TRUE") {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("td:last"), "areaTrans_importfwb_shipmentxraydetail", dblscan, "ScanPieces", "RemainingPieces");
            }

            cfi.makeTrans("importfwb_shipmentxrayulddetail", null, null, null, null, null, UldArray);
            if (UldArray.length <= 0) {
                $("div[id$='areaTrans_importfwb_shipmentxrayulddetail']").find("[id='areaTrans_importfwb_shipmentxrayulddetail']:first").hide();
            }
            $('#divareaTrans_importfwb_shipmentxrayulddetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find('td:eq(6)').css("display", "none");
                if (row > 2) {
                    $(tr).find("span[id^='XrayStatus']").remove();
                    var checked = $(tr).find("input[id^='XrayStatus']").val() == "True" ? "checked='true'" : "";
                    $(tr).find('td:eq(5)').append("<input type='checkbox' name='chXray" + $(tr).find('td:eq(0)').text() + "' id='chXray" + $(tr).find('td:eq(0)').text() + "' " + checked + "'>");
                }
            });

            if (OtherDetailsArray.length > 0) {
                $("#Text_SecurityStatus").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].SecurityStatusSNo, OtherDetailsArray[0].Text_SecurityStatusSNo);
                $("#Text_SecurityIssuanc").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].SecurityIssuanceSNo, OtherDetailsArray[0].Text_SecurityIssuanceSNo);
                $("#Text_ScreeningMethod").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].ScreerningMethodSNo, OtherDetailsArray[0].Text_ScreerningMethodSNo);
                $("#Text_ScreeningExemption").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].ExemptionSNo, OtherDetailsArray[0].Text_ExemptionSNo);
                $("#OthScreeningMthd").val(OtherDetailsArray[0].OtherScreening);
                $("#AdditionalSecurity").val(OtherDetailsArray[0].AdditionalSecurity);
                $("#Name").val(OtherDetailsArray[0].IssuedBy);
                $("#Date").val(OtherDetailsArray[0].IssueDate);
                $("#Time").val(OtherDetailsArray[0].IssueTime);
            }


            $('#divareaTrans_importfwb_shipmentxraydetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
            });
            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}

function BindLocationEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtLocation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var locationData = jQuery.parseJSON(result);
            var locationArray = locationData.Table0;
            var uldArray = locationData.Table1;

            if (uldArray.length > 0) {
                id = "areaTrans_importfwb_shipmentuldlocation"
                cfi.makeTrans("importfwb_shipmentuldlocation", null, null, BindLocationAutoCompleteForULD, ReBindLocationAutoCompleteForULD, null, uldArray)
                $('#divareaTrans_importfwb_shipmentuldlocation table tr td:last').remove();
                $('#divareaTrans_importfwb_shipmentuldlocation table tr[id!="areaTrans_importfwb_shipmentuldlocation"] td:eq(9)').remove();
            }



            cfi.makeTrans("importfwb_shipmentlocationdetail", null, null, BindLocationAutoComplete, ReBindLocationAutoComplete, null, null);

            $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentlocationdetail']:first").hide();
            $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentlocationdetail']:first").find("input[id^='Text_Location']").removeAttr("data-valid");
            if (uldArray.length > 0) {
                $("div[id$='divareaTrans_importfwb_shipmentuldlocation']").find("[id='areaTrans_importfwb_shipmentuldlocation']").each(function () {
                    $(this).find("input[id^='ULDLocation']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
                    });
                });
            }
            if (locationArray.length > 0) {
                for (var i = 0; i < locationArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentlocationdetail", locationArray[i].ScannedPieces, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
                    var row = $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last");
                    row.find("[id^='Text_Location_']").data("kendoAutoComplete").setDefaultValue(locationArray[i].LocationSNo, locationArray[i].LocationName);

                    row.find("input[type=hidden][id^='SLISNo']").val(locationArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(locationArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(locationArray[i].SLINo);
                    row.find("span[id^='SLINo']").html(locationArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(locationArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(locationArray[i].HAWBNo);
                }

            }
            if (uldArray.length > 0) {
                var RemainingPieces;
                RemainingPieces = $("input[id='RemainingPieces']").val();
                $("input[id='RemainingPieces']").val(RemainingPieces - uldArray.length);
                $("span[id='RemainingPieces']").html(RemainingPieces - uldArray.length);
            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentlocationdetail", dblscan, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
            }

            $('#divareaTrans_importfwb_shipmentuldlocation table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("td[id^=transAction]").hide();
                $(tr).find("input[id^='Text_ULDLocation']").closest('span').css('width', '');
            });
            if (uldArray.length == 0) {
                $('#divareaTrans_importfwb_shipmentuldlocation table tr[id^="areaTrans_importfwb_shipmentuldlocation"]').remove();
            }


            $('#divareaTrans_importfwb_shipmentlocationdetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
            });
            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}

function BindLocationAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Location']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
    $(elem).find("input[id^='Text_Location']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        $(this).attr("data-valid", "required");
    });
}

function ReBindLocationAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentlocationdetail']").find("[id^='areaTrans_importfwb_shipmentlocationdetail']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).find("input[id^='ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });

    $(mainElem).find("input[id^='ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
    $(elem).find("input[id^='Text_ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
}

function ReBindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentuldlocation']").find("[id^='areaTrans_importfwb_shipmentuldlocation']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function SetTotalPcs() {
    var totalPcs = parseInt($("#tdPcs").html());
    var addedPcs = 0;
    var remainingPcs = totalPcs - addedPcs;
    $("input[id='RemainingPieces']").val(remainingPcs);
    $("span[id='RemainingPieces']").html(remainingPcs);

    $("input[id='Added']").val(addedPcs);
    $("span[id='Added").html(addedPcs);

    $("input[id='TotalPieces']").val(totalPcs);
    $("span[id='TotalPieces']").html(totalPcs);

}

function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#divDetail2").html("");
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

function SaveHandlingInfo() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var osi = '';
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
        var OSIInfoModel = new Array();
        var OCIInfoModel = new Array();

        $("#divareaTrans_importfwb_fwbshipmentositrans table tr[data-popup='false']").each(function (row, i) {
            if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
                OSIInfoModel.push({ AWBSNo: currentawbsno, OSI: $(i).find('td:nth-child(2) input[type=text]').val() });
            }

        });

        $("#divareaTrans_importfwb_fwbshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
            if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {

                OCIInfoModel.push({
                    AWBSNo: currentawbsno,
                    CountryCode: $(i).find("td:eq(1) > [id^='CountryCode']").val(),
                    InfoType: $(i).find("td:eq(2) > [id^='InfoType']").val(),
                    CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='CSControlInfoIdentifire']").val(),
                    SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
                });
            }
        });

        var osiViewModel;

        var HandlingInfoArray = [];
        $("div[id$='areaTrans_importfwb_fwbshipmenthandlinginfo']").find("[id^='areaTrans_importfwb_fwbshipmenthandlinginfo']").each(function () {

            var type = $(this).find("[id^='Text_Type']").data("kendoAutoComplete").key();
            var message = $(this).find("[id^='Message']").val();
            var HandlingInfoViewModel = {
                AWBSNo: currentawbsno,
                HandlingMessageTypeSNo: type,
                Message: message
            };
            HandlingInfoArray.push(HandlingInfoViewModel);

        });
        var isAmmendment = $("#chkFWBAmmendment").prop("checked") ? "1" : "0";
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateOSIInfoAndHandlingMessage", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                OSIInformation: osiViewModel,
                AWBHandlingMessage: HandlingInfoArray,
                AWBOSIModel: OSIInfoModel,
                AWBOCIModel: OCIInfoModel,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Customs', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    $("#divDetail").html("");
                    $("#tblShipmentInfo").hide();

                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Customs', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Customs', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                }

            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customs', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    }
    return flag;
}

function SaveCustomerInfo() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
        var IsShipperEnable = 0;
        var IsConsigneeEnable = 0;
        IsShipperEnable = $("#FWBShipper").is(":checked") == true ? 1 : 0;
        IsConsigneeEnable = $("#FWB_Consignee").is(":checked") == true ? 1 : 0;

        var ShipperViewModel = {
            ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
            ShipperName: $("#SHIPPER_Name").val(),
            ShipperStreet: $("#SHIPPER_Street").val(),
            ShipperLocation: $("#SHIPPER_TownLocation").val(),
            ShipperState: $("#SHIPPER_State").val(),
            ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
            ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
            ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
            ShipperMobile: $("#SHIPPER_MobileNo").val(),
            ShipperEMail: $("#SHIPPER_Email").val(),
            ShipperFax: $("#SHipper_Fax").val(),
            ShipperName2: $("#SHIPPER_Name2").val(),
            ShipperStreet2: $("#SHIPPER_Street2").val(),
            ShipperMobile2: $("#SHIPPER_MobileNo2").val()
        };

        var ConsigneeViewMode = {
            ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
            ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
            ConsigneeStreet: $("#CONSIGNEE_Street").val(),
            ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
            ConsigneeState: $("#CONSIGNEE_State").val(),
            ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
            ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
            ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
            ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
            ConsigneeEMail: $("#CONSIGNEE_Email").val(),
            ConsigneeFax: $("#CONSIGNEE_Fax").val(),
            ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
            ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
            ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val()
        };

        var NotifyModel = {
            NotifyName: $("#Notify_Name").val(),
            NotifyCountryCode: $("#Text_Notify_CountryCode").data("kendoAutoComplete").key(),
            NotifyCityCode: $("#Text_Notify_City").data("kendoAutoComplete").key(),
            NotifyMobile: $("#Notify_MobileNo").val(),
            NotifyAddress: $("#Notify_Address").val(),
            NotifyState: $("#Notify_State").val(),
            NotifyPlace: $("#Notify_Place").val(),
            NotifyPostalCode: $("#Notify_PostalCode").val(),
            NotifyFax: $("#Notify_Fax").val(),
            NotifyName2: $("#Notify_Name2").val(),
            NotifyAddress2: $("#Notify_Address2").val(),
            NotifyMobile2: $("#Notify_MobileNo2").val()
        }

        var NominyModel = {
            NominyName: $("#Nominate_Name").val(),
            NominyAddress: $("#Nominate_Place").val(),
        }

        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateShipperAndConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                ShipperInformation: ShipperViewModel,
                ConsigneeInformation: ConsigneeViewMode,
                NotifyModel: NotifyModel,
                NominyModel: NominyModel,
                ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0",
                IsShipperEnable: IsShipperEnable,
                IsConsigneeEnable: IsConsigneeEnable,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Customer', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Customer', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Customer', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customer', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        });
    }
    return flag;
}

function SaveWeighingMachineInfo() {
    var flag = false;
    var GrWtFlag = true;
    var ScanType = ($("[id='Type']:checked").val() == 0);
    var WeighingMachineArray = [];
    var WeighingULDArray = [];

    $("div[id$='areaTrans_importfwb_shipmentweightdetail']").find("[id^='areaTrans_importfwb_shipmentweightdetail_']").each(function () {
        if ($(this).find("input[id^='GrossWt_']").val() == "") {
            if (GrWtFlag != false) {
                $(this).find("input[id^='GrossWt_']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Enter Gross Weight.", "bottom-right");
                GrWtFlag = false;
            }
        }
    });
    $("div[id$='areaTrans_importfwb_shipmentweightulddetail']").find("[id^='areaTrans_importfwb_shipmentweightulddetail']").each(function () {
        if ($(this).attr('style') != "display: none;") {
            if (parseFloat($(this).find("input[id^='CapturedWt']").val() == "" ? "0" : $(this).find("input[id^='CapturedWt']").val()) <= 0) {
                if (GrWtFlag != false) {
                    $(this).find("input[id^='CapturedWt']").focus();
                    ShowMessage('warning', 'Warning - Weighing Machine', "Enter Captured Weight should be greater than 0.", "bottom-right");
                    GrWtFlag = false;
                }
            }
        }
    });

    if (GrWtFlag == false) { return }

    $("div[id$='areaTrans_importfwb_shipmentweightdetail']").find("[id^='areaTrans_importfwb_shipmentweightdetail_']").each(function () {
        var WeighingMachineViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            NoOfPieces: $(this).find("input[id^='ScanPieces_']").val().split(',').length,
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            GrossWt: $(this).find("input[id^='GrossWt_']").val(),
            Remarks: $(this).find("[id^='Remarks_']").val(),
            SLISNo: $(this).find("input[type=hidden][id^='SLISNo_']").val(),
            SLINo: $(this).find("span[id^='SLINo_']").text(),
            HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
        };
        WeighingMachineArray.push(WeighingMachineViewModel);
    });

    $("div[id$='areaTrans_importfwb_shipmentweightulddetail']").find("[id^='areaTrans_importfwb_shipmentweightulddetail']").each(function () {
        if ($(this).attr('style') != "display: none;") {
            var ULDWeighingModel = {
                ULDSNo: $(this).find("span[id^='ULDSNo']").text(),
                CapturedWeight: $(this).find("input[id^='CapturedWt']").val(),
                UldGrossWt: $(this).find("input[id^='GrossWt']").val(),
                UldTareWt: $(this).find("input[id^='TareWt']").val(),
            };
            WeighingULDArray.push(ULDWeighingModel);
        }
    });

    if (WeighingMachineArray.length > 0)
        $.ajax({
            url: "Services/Shipment/FWBService.svc/SaveAtWeighing", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, lsAWBGroup: WeighingMachineArray, lstUldWeigh: WeighingULDArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Weighing Machine', "Gross weight Deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;

                    }
                }
                else
                    ShowMessage('warning', 'Warning - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    else {
        ShowMessage('warning', 'Warning - Weighing Machine', "AWB No. [" + $("#tdAWBNo").text() + "] -  Enter weighing detail.", "bottom-right");
    }
    return flag;
}

function SaveXRayInfo() {
    var flag = false;
    var ScanType = ($("[id='Type']:checked").val() == 0);
    var XRayArray = [];
    var ULDXray = [];
    var ECSDArray = [];
    $("div[id$='areaTrans_importfwb_shipmentxraydetail']").find("[id^='areaTrans_importfwb_shipmentxraydetail_']").each(function () {
        var XRayViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            SLISNo: $(this).find("input[type=hidden][id^='SLISNo_']").val(),
            SLINo: $(this).find("input[type=hidden][id^='SLINo_']").val(),
            HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
        };
        XRayArray.push(XRayViewModel);
    });
    if (ScanType != "0" && ScanType != "1") {
        var sXRayViewModel = {
            SNo: 0,
            ScannedPieces: ""
        };
        XRayArray.push(sXRayViewModel);
    }

    $("div[id$='areaTrans_importfwb_shipmentxrayulddetail']").find("[id^='areaTrans_importfwb_shipmentxrayulddetail']").each(function () {
        var XRayULDViewModel = {
            ULDSNo: $(this).find("span[id^='ULDSNo']").text(),
            ULDXrayDone: $(this).find("[type=checkbox][id^='chXray']").prop("checked") == true ? 1 : 0
        };
        ULDXray.push(XRayULDViewModel);
    });
    var ECSDArrayViewModel = {
        SecurityCode: $("#Text_SecurityStatus").data("kendoAutoComplete").key(),
        SecurityIssuance: $("#Text_SecurityIssuanc").data("kendoAutoComplete").key(),
        ScreeningMethod: $("#Text_ScreeningMethod").data("kendoAutoComplete").key(),
        ScreeningExemption: $("#Text_ScreeningExemption").data("kendoAutoComplete").key(),
        OthScreeningMthode: $("#OthScreeningMthd").val(),
        AdditionalSecurity: $("#AdditionalSecurity").val(),
        Name: $("#Name").val(),
        Date: cfi.CfiDate("Date"),
        Time: $("#Time").val(),
    };
    ECSDArray.push(ECSDArrayViewModel);


    if (XRayArray.length > 0 || ULDXray.length > 0 || ECSDArray.length > 0)
        $.ajax({
            url: "Services/Shipment/FWBService.svc/SaveAtXRay", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, lsAWBXRay: XRayArray, lstULDXrayArray: ULDXray, lstECSDArray: ECSDArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] - weighing machine process missing.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    else {
        ShowMessage('warning', 'Warning - XRay', "AWB No. [" + $("#tdAWBNo").text() + "] -  Validate X-Ray detail.", "bottom-right");
    }
    return flag;
}

function SaveLocationInfo() {
    var flag = false;
    var ScanType = $("[id='Type']:checked").val();
    var LocationArray = [];
    $("div[id$='areaTrans_importfwb_shipmentlocationdetail']").find("[id^='areaTrans_importfwb_shipmentlocationdetail_']").each(function () {
        var LocationViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            AWBSNo: currentawbsno,
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            LocationSNo: $(this).find("[id^='Text_Location']").data("kendoAutoComplete").key(),
            SLISNo: $(this).find("input[type=hidden][id^='SLISNo_']").val(),
            SLINo: $(this).find("input[type=hidden][id^='SLINo_']").val(),
            HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
        };
        LocationArray.push(LocationViewModel);

    });

    var ULDLocationArray = [];
    var i = 1;
    $("div[id$='areaTrans_importfwb_shipmentuldlocation']").find("[id^='areaTrans_importfwb_shipmentuldlocation']").each(function () {
        var ULDLocationModel = {
            RowNo: i,
            ULDSNo: $(this).find("span[id^='ULDSNo']").text(),
            LocationSno: $(this).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").key(),

        };
        ULDLocationArray.push(ULDLocationModel);
        i += 1;

    });

    if (LocationArray.length > 0 || ULDLocationArray.length > 0) {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/SaveAtLocation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, lsAWBLocation: LocationArray, lsULDLocation: ULDLocationArray, ScanType: ScanType, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - Location', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - Location', "AWB No. [" + $("#tdAWBNo").text() + "] - weighing machine process missing.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Location', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Location', "AWB No. [" + $("#tdAWBNo").text() + "] -  Enter location detail.", "bottom-right");
    }
    return flag;
}

function SaveReservationInfo() {
    var flag = true;
    var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
    var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
    var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;

    var FWBPieces = parseInt(($("#Pieces").val() || 0) == 0 ? ($("#_tempPieces").val() || 0) : ($("#Pieces").val() || 0));
    var FWBGrossWeight = ($("#GrossWt").val() || 0) == 0 ? ($("#_tempGrossWt").val() || 0) : ($("#GrossWt").val() || 0);

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetAndCheckCompleteShipment",
        async: false, type: "get", dataType: "json", cache: false,
        data: { AWBSNo: currentawbsno },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var ArrivedPieces = 0,
				ULDPieces = 0,
				TotalPieces = 0,
				GrossWeight = 0,
				ULDGrossWeight = 0,
				TotalGrossWeight = 0,
				ShipmentType = "";

            if (resData.length > 0) {
                ArrivedPieces = resData[0].ArrivedPieces;
                ULDPieces = resData[0].ULDPieces;
                TotalPieces = resData[0].TotalPieces;
                GrossWeight = resData[0].GrossWeight;
                ULDGrossWeight = resData[0].ULDGrossWeight;
                TotalGrossWeight = resData[0].TotalGrossWeight;
                ShipmentType = resData[0].ShipmentType;

                if ((ShipmentType == "T" || ShipmentType == "S") && Number(FWBPieces) != Number(ArrivedPieces)) {
                    ShowMessage('warning', 'Warning', "FWB pieces must be same as arrived pieces.", "bottom-right");
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(FWBPieces) < Number(ArrivedPieces)) {
                    ShowMessage('warning', 'Warning', "FWB pieces must be same as arrived pieces.", "bottom-right");
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(FWBPieces) == Number(ArrivedPieces) && Number(FWBGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "FWB gross weight must be same as gross weight.", "bottom-right");
                }
            }
        }
    });

    if ($("#Text_NatureofGoods").data("kendoAutoComplete").value() == "OTHER" && $("#OtherNOG").val() == "") {
        flag = false;
        ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', "Kindly Enter Nature of Goods", "bottom-right");
        return false;
    }

    var NogPcs = 0;
    var NogWt = 0;
    var NogMessage = '';
    $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id^='areaTrans_importfwb_shipmentnog']").each(function () {
        NogPcs += parseInt(($(this).find("input[id^='Pieces']").val() || 0));
        NogWt += parseFloat(($(this).find("input[id^='NogGrossWt']").val() || 0));
    });

    if (flag == true) {
        var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
        var awbNo = $("#AWBNo").val();
        var IsCourier = ($("[id='ShipmentType']:checked").val() == 1),
        ShowSlacDetails = false,
        AWBNo = $("#AWBNo").val(),
        AgentBranchSNo = 0;
        AWBTotalPieces = $("#Pieces").val(),
        CommoditySNo = $("#Text_Commodity").data("kendoAutoComplete").key(),
        GrossWeight = $("#GrossWt").val(),
        VolumeWeight = $("#VolumeWt").val(),
        ChargeableWeight = $("#ChargeableWt").val(),
        Pieces = $("#Pieces").val()
        var ShipmentInfo = {
            IsCourier: ($("[id='ShipmentType']:checked").val() == 0 ? 1 : 2),
            ShowSlacDetails: false,
            AWBNo: $("#AWBNo").val(),
            AgentBranchSNo: 0,
            AWBTotalPieces: $("#Pieces").val(),
            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
            GrossWeight: $("#GrossWt").val(),
            VolumeWeight: $("#VolumeWt").val() == "" ? "0.00" : $("#VolumeWt").val(),
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
            NatureOfGoods: $("#Text_NatureofGoods").data("kendoAutoComplete").value() == "OTHER" ? $("#OtherNOG").val() : $("#Text_NatureofGoods").data("kendoAutoComplete").value(),
            IsBup: $("#chkisBup").prop('checked') == false ? 0 : 1,
            buptypeSNo: $("#Text_buptype").data("kendoAutoComplete").key(),
            DensityGroupSNo: $("#Text_densitygroup").data("kendoAutoComplete").key(),
            AirlineSNo: 0,
            CBM: $("#CBM").val() == "" ? "0.00" : $("#CBM").val(),
            AgentName: $("#IssuingAgent").val(),
            ConsigneeMobileNo: 0
        };
        var ShipmentSPHCArray = [];
        if ($("#Multi_SpecialHandlingCode").val() != "") {
            var sphcarr = $("#Multi_SpecialHandlingCode").val().split(",")
            for (i = 0; i < sphcarr.length; i++) {
                var ShipmentSPHCInfo = {
                    AWBSNo: awbSNo,
                    AWBNo: $("#AWBNo").val(),
                    SPHCCode: sphcarr[i]
                };
                ShipmentSPHCArray.push(ShipmentSPHCInfo);
            }
        }

        var DGRArray = [];
        $("div[id$='divareaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
            if (DGRSPHC.length > 0) {
                var DGRViewModel = {
                    SPHCSNo: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
                    SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                    DGRSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                    UNNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").value(),
                    DGRShipperSNo: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").key(),
                    ProperShippingName: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                    Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                    SubRisk: $(this).find("[id^='Text_SubRisk']").data("kendoAutoComplete").key(),
                    PackingGroup: $(this).find("[id^='Text_PackingGroup']").data("kendoAutoComplete").key(),
                    Pieces: $(this).find("[id^='DGRPieces']").val(),
                    NetQuantity: $(this).find("[id^='NetQuantity']").val(),
                    Unit: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                    Quantity: $(this).find("[id^='Quantity']").val(),
                    PackingInst: $(this).find("[id^='Text_PackingInst']").data("kendoAutoComplete").key(),
                    RAMCategory: $(this).find("[id^='RamCat']").val(),
                    ERGN: $(this).find("[id^='Text_ERG']").data("kendoAutoComplete").key(),
                };
                DGRArray.push(DGRViewModel);
            }
        });

        var NOGArray = [];
        $("div[id$='areaTrans_importfwb_shipmentnog']").find("[id^='areaTrans_importfwb_shipmentnog']").each(function () {
            var pcs = $(this).find("input[id^='Pieces']").val() || 0;
            var grwt = $(this).find("input[id^='NogGrossWt']").val() || 0;
            var Nog = $(this).find("input[id^='NOG']").val();
            var NogSNo = $(this).find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").key() || "0";
            if (parseInt(pcs) > 0 || parseFloat(grwt) > 0 || Nog != "" || parseInt(NogSNo) > 0) {
                var NOGModel = {
                    AWBSNo: currentawbsno,
                    NogPieces: $(this).find("input[id^='Pieces']").val() || 0,
                    NogGrossWt: $(this).find("input[id^='NogGrossWt']").val() || 0,
                    NogSNo: $(this).find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").key() || "0",
                    NOG: $(this).find("input[id^='NOG']").val(),
                };
                NOGArray.push(NOGModel);
            }
        });

        var FlightArray = [];
        $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {
            var FlightViewModel = {
                DailyFlightSNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").key(),
                BoardPoint: $(this).find("[id^='Text_BoardPoint']").data("kendoAutoComplete").key(),
                OffPoint: $(this).find("[id^='Text_offPoint']").data("kendoAutoComplete").key(),
                FlightDate: cfi.CfiDate($(this).find("[id^='FlightDate']").attr("id")),
                FlightNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").value()
            };
            FlightArray.push(FlightViewModel);
        });

        $.ajax({
            url: "Services/Import/ImportFWBService.svc/SaveFWB", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBNo: $("#AWBNo").val(),
                AWBSNo: awbSNo,
                ShipmentInformation: ShipmentInfo,
                lstAWBSPHC: ShipmentSPHCArray,
                listItineraryInformation: FlightArray,
                AWBDGRTrans: DGRArray,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges,
                IsDocReceived: IsDocReceived,
                IsLateAccepTance: 0,
                ArrivedShimentSNo: currentArrivedShipmentSNo,
                NOGArray: NOGArray
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - FWB Saved Successfully', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                    if (isSaveAndNext == "1") {
                        FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                        FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight No value after save and next
                    } else {
                        ShipmentSearch();
                        CleanUI();
                    }
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', result + ".", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - FWB', "AWB No. [" + awbNo + "] -  unable to process.", "bottom-right");

            }
        });
    }
    return flag;
}

function SaveDimensionInfo() {
    var flag = false;

    var DimArray = [];
    $("div[id$='areaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function () {
        var DimViewModel = {
            AWBSNo: currentawbsno,
            Height: $(this).find("[id^='Height']").val(),
            Length: $(this).find("[id^='Length']").val(),
            Width: $(this).find("input[id^='Width']").val(),
            Pieces: $(this).find("input[id^='Pieces']").val(),
            CBM: $(this).find("input[id^='VolumeWt']").val(),
            Unit: $("#Unit:checked").val() == "1" ? 1 : 0,
            VolumeWeight: 0,
            SLISNo: $(this).find("span[id^='SLISNo']").text(),
            HAWBNo: $(this).find("span[id^='HAWBNo']").text(),
        };
        DimArray.push(DimViewModel);
    });


    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateAWBDimemsions", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, Dimensions: DimArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Dimension', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;
                }
            }
            else
                ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveDimensionULDInfo() {
    var flag = false;
    var ULDArray = [];
    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
    var tempULDSNo = 0;
    var tempULDNo = '';

    var LenWidHei = true;
    $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function () {
        var L, W, H;
        L = $(this).find("input[id^='ULDLength']").val() == "" ? "0" : $(this).find("input[id^='ULDLength']").val();
        W = $(this).find("input[id^='ULDWidth']").val() == "" ? "0" : $(this).find("input[id^='ULDWidth']").val();
        H = $(this).find("input[id^='ULDHeight']").val() == "" ? "0" : $(this).find("input[id^='ULDHeight']").val();

        if (parseFloat(L) <= 0) {
            if (LenWidHei != false) {
                $(this).find("input[id^='ULDLength']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Length should be greater than 0.", "bottom-right");
                LenWidHei = false;
            }
        }
        if (parseFloat(W) <= 0) {
            if (LenWidHei != false) {
                $(this).find("input[id^='ULDWidth']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Width should be greater than 0.", "bottom-right");
                LenWidHei = false;
            }
        }
        if (parseFloat(H) <= 0) {
            if (LenWidHei != false) {
                $(this).find("input[id^='ULDHeight']").focus();
                ShowMessage('warning', 'Warning - Weighing Machine', "Height should be greater than 0.", "bottom-right");
                LenWidHei = false;
            }
        }
    });
    if (LenWidHei == false) { return }

    $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function () {
        tempULDSNo = $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete") == undefined ? tempULDSNo : $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").key();
        tempULDNo = $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete") == undefined ? tempULDNo : $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").value();
        var ULDViewModel = {
            AWBSNo: currentawbsno,
            SLISNo: $(this).find("span[id^='SLISNo']").text(),
            HAWBNo: $(this).find("span[id^='HAWBNo']").text(),
            ULDSNo: tempULDSNo,
            ULDNo: tempULDNo,
            SLACPieces: $(this).find("input[id^='SLACPieces']").val(),
            UldPieces: $(this).find("input[id^='UldPieces']").val(),
            IsCMS: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
            ULDLength: $(this).find("input[id^='ULDLength']").val(),
            ULDWidth: $(this).find("input[id^='ULDWidth']").val(),
            ULDHeight: $(this).find("input[id^='ULDHeight']").val(),
            ULDVolWt: $(this).find("span[id^='UldVolWt']").text().split("(")[0],
            ULDCBM: $(this).find("span[id^='UldVolWt']").text().split("(")[1].replace(")", ""),
            CityCode: origin,
            MCBookingSNo: 0,
            DNNo: 0,
            MailDestination: 0,
            OriginRefNo: 0,
        };
        ULDArray.push(ULDViewModel);
    });


    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateAWBDimemsionsULDInfo", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBULDTrans: ULDArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;

                }
            }
            else
                ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveDimensionULDDetails() {
    var flag = false;
    var ULDDetailArray = [];
    $("div[id$='areaTrans_importfwb_shipmentulddetails']").find("[id^='areaTrans_importfwb_shipmentulddetails']").each(function () {
        var ULDViewModel = {
            AWBSNo: currentawbsno,
            SLISNo: $(this).find("span[id^='SLINo2']").text(),
            ULDSNo: $(this).find("[id^='Text_ULDNo2']").data("kendoAutoComplete").key(),
            LoadingCodeSNo: $(this).find("[id^='Text_UldLoadingCode']").data("kendoAutoComplete").key(),
            LoadingIndicatorSNo: $(this).find("[id^='Text_UldLoadingIndicators']").data("kendoAutoComplete").key(),
            ContourCodeSNo: $(this).find("[id^='Text_UldContourCode']").data("kendoAutoComplete").key(),
            BupTypeSNo: $(this).find("[id^='Text_UldBupType']").data("kendoAutoComplete").key(),
            BasePalletSNo: $(this).find("[id^='Text_UldBasePallet']").data("kendoAutoComplete").key(),
            OtherPallets: $(this).find("input[id^='ULDOtherPallets']").val(),
        };
        ULDDetailArray.push(ULDViewModel);
    });




    $.ajax({
        url: "Services/Shipment/FWBService.svc/UpdateAWBDimemsionsULDDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBULDDetails: ULDDetailArray, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                if (result.split('?')[1] == "") {
                    ShowMessage('success', 'Success - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                    accpcs = 0;//Manoj
                    accgrwt = 0;//Manoj
                    flag = true;

                }
            }
            else
                ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveDimensionInfoNew() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;

        var strData, strData2;
        var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");

        var rows2 = $("tr[id^='tblAWBRateDesriptionULD']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        getUpdatedRowIndex(rows.join(","), "tblAWBRateDesriptionULD");

        var rows3 = $("tr[id^='tblAWBRateOtherCharge']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        getUpdatedRowIndex(rows.join(","), "tblAWBRateOtherCharge");

        strData = $('#tblAWBRateDesription').appendGrid('getStringJson');
        strData2 = $('#tblAWBRateDesriptionULD').appendGrid('getStringJson');
        strData3 = $('#tblAWBRateOtherCharge').appendGrid('getStringJson');

        if (strData == false || strData2 == false || strData3 == false) { return false; }
        var DimArray = [];
        var ULDDimArray = [];
        var OtherCharge = [];
        var AWBRateArray = [];

        if ($('input:radio[id="FreightType"]:checked').val() == 1 && ($("#CDCTotalCharAmount").val() == undefined || $("#CDCTotalCharAmount").val() == "" || Number($("#CDCTotalCharAmount").val()) == 0)) {
            ShowMessage('warning', 'Warning - Rate', "Rate are mandatory for CC shipment", "bottom-right");
            flag = false;
            return false
        }

        if (strData != "[]") {
            $("#tblAWBRateDesription tbody tr").each(function (index, row) {
                var DimData = {
                    AWBSNo: currentawbsno,
                    Charge: $(row).find("[id^=tblAWBRateDesription_Charge_]").val() || "0",
                    ChargeAmount: $(row).find("[id^=tblAWBRateDesription_ChargeAmount_]").val() || "0",
                    ChargeableWeight: $(row).find("[id^=tblAWBRateDesription_ChargeableWeight_]").val() || "0",
                    CommodityItemNumber: $(row).find("[id^=tblAWBRateDesription_CommodityItemNumber_]").val(),
                    GrossWeight: $(row).find("[id^=tblAWBRateDesription_GrossWeight_]").val(),
                    NatureOfGoods: $(row).find("[id^=tblAWBRateDesription_NatureOfGoods_]").val(),
                    NoOfPieces: $(row).find("[id^=tblAWBRateDesription_NoOfPieces_]").val(),
                    RateClassCode: $(row).find("[id^=tblAWBRateDesription_HdnRateClassCode_]").val(),
                    SNo: index + 1,
                    WeightCode: $(row).find("[id^=tblAWBRateDesription_WeightCode_]").val(),
                    hdnChildData: $(row).find("[id^=tblAWBRateDesription_hdnChildData_]").val(),
                    HarmonisedCommodityCode: $(row).find("[id^=tblAWBRateDesription_HarmonisedCommodityCode_]").val(),
                    CountrySNo: $(row).find("[id^=tblAWBRateDesription_HdnCountry_]").val(),
                    CountryCode: $(row).find("[id^=tblAWBRateDesription_Country_]").val().split('-')[0],
                    ConsolDesc: $(row).find("[id^=tblAWBRateDesription_ConsolDesc_]").val()
                }
                DimArray.push(DimData);
            });
        }
        else
            DimArray = null;

        if (strData2 != "[]") {
            $("#tblAWBRateDesriptionULD").find("tr[id^='tblAWBRateDesriptionULD_Row_']").each(function (index, row) {
                var ULDDimData = {
                    AWBSNo: currentawbsno,
                    ChargeLineCount: index + 1,
                    WeightCode: $(row).find("[id^=tblAWBRateDesriptionULD_WeightCode_]").val(),
                    RateClassCode: $(row).find("[id^=tblAWBRateDesriptionULD_RateClassCode_]").val().trim(),
                    SLAC: $(row).find("[id^=tblAWBRateDesriptionULD_SLAC_]").val(),
                    ULDTypeSNo: $(row).find("[id^=tblAWBRateDesriptionULD_HdnULD_]").val(),
                    ULDTypeCode: $(row).find("[id^=tblAWBRateDesriptionULD_ULD_]").val(),
                    ULDNo: $(row).find("[id^=tblAWBRateDesriptionULD_ULDNo_]").val(),// ULD No
                    Charge: $(row).find("[id^=tblAWBRateDesriptionULD_Charge_]").val(),
                    ChargeAmount: $(row).find("[id^=tblAWBRateDesriptionULD_ChargeAmount_]").val(),
                    HarmonisedCommodityCode: $(row).find("[id^=tblAWBRateDesriptionULD_HarmonisedCommodityCode_]").val(),
                    CountrySNo: $(row).find("[id^=tblAWBRateDesriptionULD_HdnCountry_]").val(),
                    CountryCode: $(row).find("[id^=tblAWBRateDesriptionULD_Country_]").val().split('-')[0],
                    NatureOfGoods: $(row).find("[id^=tblAWBRateDesriptionULD_NatureOfGoods_]").val()
                }
                ULDDimArray.push(ULDDimData);
            });
        }
        else
            ULDDimArray = null;

        if (strData3 != "[]") {
            $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function (index, row) {
                var OtherChargeData = {
                    AWBSNo: currentawbsno,
                    Type: $(row).find("[id^=tblAWBRateOtherCharge_Type_]").val(),
                    OtherChargeCode: $(row).find("[id^=tblAWBRateOtherCharge_OtherCharge_]").val(),
                    DueType: $(row).find("[id^=tblAWBRateOtherCharge_DueType_]").val(),
                    ChargeAmount: $(row).find("[id^=tblAWBRateOtherCharge_Amount_]").val(),
                }
                OtherCharge.push(OtherChargeData);
            });
        }
        else
            OtherCharge = null;

        var AWBRate = {
            AWBCurrencySNo: $("#Text_AWBCurrency").data("kendoAutoComplete").key(),
            TotalPrepaid: $("#TotalFreight").val() == "" ? 0 : $("#TotalFreight").val(),
            TotalCollect: $("#TotalAmount").val() == "" ? 0 : $("#TotalAmount").val(),
            CVDCurrency: $("#Text_Currency").data("kendoAutoComplete").key(),
            CVDChargeCode: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
            CVDWeightValuation: $("#Text_Valuation").data("kendoAutoComplete").key(),
            CVDOtherCharges: $("#Text_OtherCharge").data("kendoAutoComplete").key(),
            CVDDCarriageValue: $("#DecCarriageVal").val(),
            CVDCustomValue: $("#DecCustomsVal").val(),
            CVDInsurence: $("#Insurance").val(),
            CVDValuationCharge: $("#ValuationCharge").val(),
            CDCCurrency: $("#Text_CDCCurrencyCode").data("kendoAutoComplete").key(),
            CDCConversionRate: $("#CDCConversionRate").val() == "" ? "0" : $("#CDCConversionRate").val(),
            CDCDestCurrency: $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").key(),
            CDCChargeAmount: $("#CDCChargeAmount").val() == "" ? "0" : $("#CDCChargeAmount").val(),
            CDCTotalCharAmount: $("#CDCTotalCharAmount").val() == "" ? "0" : $("#CDCTotalCharAmount").val(),
            CVDTax: $("#CVDTax").val() == "" ? "0" : $("#CVDTax").val()
        }
        AWBRateArray.push(AWBRate);

        var isAmmendment = $("#chkFWBAmmendment").prop("checked") ? "1" : "0";

        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateRateDimemsionsAndULD", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                Dimensions: DimArray,
                ULDDimension: ULDDimArray,
                OtherCharge: OtherCharge,
                RateArray: AWBRateArray,
                TactRateArray: TactArray,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Rate', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");

                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Rate', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;

                    }
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Rate', result.split('?')[1], "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - Rate', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Rate', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    }
    return flag;
}

function SaveAWBSummary() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
        var SummaryArray = [];

        var SaveData = {
            SSRDesc1: $("#SSRDescription").val(),
            SSRDesc2: $("#SSRDescription2").val(),
            SSRDesc3: $("#SSRDescription3").val(),
            ARDFileRef: $("#ARDFileRefrence").val(),
            OPIName: $("#OPIName").val(),
            OPIAirport: $("#Text_OPIAirportCity").data("kendoAutoComplete").key(),
            OfficeDesignator: $("#Text_OPIOfficeDesignator").data("kendoAutoComplete").key(),
            OPICompDesignator: $("#OPICompDesignator").val(),
            OPIOtherFileRef: $("#OPIOtherFileReference").val(),
            OPIParticipantCode: $("#OPIParticipantCode").val(),
            OPIOthAirport: $("#Text_OPIOtherAirportCity").data("kendoAutoComplete").key(),
            SRIRefNumber: $("#SRIRefNumber").val(),
            SRISupInfo1: $("#SRISupInfo1").val(),
            SRISupInfo2: $("#SRISupInfo2").val(),
            CERSignature: $("#CERSignature").val(),
            ISUDate: cfi.CfiDate("CEDate"),
            ISUPlace: $("#Text_ISUPlace").data("kendoAutoComplete").key(),
            ISUSignature: $("#ISUSignature").val(),
            REFAirportCity: $("#Text_REFAirportCityCode").data("kendoAutoComplete").key(),
            REFOfficeDesignator: $("#Text_REFOfficeDesignator").data("kendoAutoComplete").key(),
            REFCompDesignator: $("#REFCompDesignator").val(),
            REFOthPartOfficeFileRef: $("#REFOthPartOfficeFileRef").val(),
            REFParticipantCode: $("#REFParticipantCode").val(),
            REFOthAirportCity: $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").key(),
            TCORCustomsOrigin: $("#CORCustomsOriginCode").val()
        }

        SummaryArray.push(SaveData);

        var isAmmendment = $("#chkFWBAmmendment").prop("checked") ? "1" : "0";
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateAWBSummary", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                Summary: SummaryArray,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Other Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");

                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Other Info', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                        flag = true;
                    }
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Other Info', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Other Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                }

            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Other Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
    }
    return flag;
}

function InitializePaymentData() {
    //Use this function after Crayon System Integartion According to Manish Sir 
    BindPaymentDetails();
}

function SavePaymentInfo() {
    var flag = false;
    var HandlingChargeArray = [];

    var TotalCash = 0;
    var TotalCredit = 0;
    TotalCash = $("#FBLAmount").val();
    TotalCredit = $("#CrediAmount").val();
    $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingCharge = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentawbsno,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(), //3
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),//'TERMINAL CHARGES',
                Value: parseFloat($(this).find("[id^='TotalAmount']").text()).toFixed(3),//80.00
                Remarks: $(this).find("[id^='Remarks']").val(),
                Rate: $(this).find("[id^='rate']").val(),
                Min: $(this).find("[id^='min']").val(),
                TotalTaxAmount: $(this).find("[id^='totaltaxamount']").val(),
                Mode: $(this).find("[id^='chkCash']").prop('checked') == true ? "CASH" : "CREDIT",
                Basis: 'PER KG',
                OnWt: 'ChWt',
                ChargeTo: $(this).find("[id^='Text_BillTo']").data("kendoAutoComplete").key()
            }
            HandlingChargeArray.push(HandlingCharge);
        }

    })



    //single Row
    var AWBChequeArray = [];

    $("div[id$='divareaTrans_importfwb_shipmentaddcheque']").find("[id^='areaTrans_importfwb_shipmentaddcheque']").each(function () {
        if ($(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key() != "") {
            var AWBCheque = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentawbsno,
                BankSNo: $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key(),
                Branch: $(this).find("[id^='Branch']").val(),
                ChequeNo: $(this).find("[id^='ChequeNo']").val(),
                ChequeLimit: $(this).find("[id^='ChequeLimit']").val()
            }
            AWBChequeArray.push(AWBCheque);
        }
    })


    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveAtPayment", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, TotalCash: TotalCash, TotalCredit: TotalCredit, lstHandlingCharge: HandlingChargeArray, lstAWBCheque: AWBChequeArray, CityCode: 'DEL', UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "") {
                ShowMessage('success', 'Success - Payment', "Payment Processed Successfully", "bottom-right");
                ShipmentSearch();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Payment', "Unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Payment', "Unable to process.", "bottom-right");

        }
    });
    return flag;
}

var fblurl = 'Services/AutoCompleteService.svc/WMSFBLAutoCompleteDataSource';
function GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? fblurl : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    chWt: chWt,
                    cityChangeFlag: cityChangeFlag
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

function BindPaymentDetails() {

    $("div[id='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_importfwb_shipmenthandlingchargeinfo']:first").show();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtPayment?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var payementData = jQuery.parseJSON(result);
            var handlingChargeArray = payementData.Table0;
            var awbChequeArray = [];
            $("span[id='AgentName']").text(payementData.Table1[0].AgentName.toUpperCase());
            $("input[name='AgentName']").val(payementData.Table1[0].AgentBranchSNo);

            var tableHandleCharge = "";
            var BillAmt = 0.000;
            var CreditAmt = 0.000;
            if (handlingChargeArray.length > 0) {
                $("div[id='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("table:first").find("tr:first").find("td:last").hide();
                $("div[id='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_importfwb_shipmenthandlingchargeinfo']:first").hide();
                for (var i = 0; i < handlingChargeArray.length; i++) {
                    tableHandleCharge += "<tr><td>" + (i + 1) + "</td><td>" + handlingChargeArray[i].Description + "</td><td>" + handlingChargeArray[i].ChargeValue + "</td><td>" + handlingChargeArray[i].Amount + "</td><td>" + handlingChargeArray[i].PaymentMode + "</td><td>" + handlingChargeArray[i].Remarks + "</td><td>" + handlingChargeArray[i].ChargeTo + "</td></tr>"
                    if (handlingChargeArray[i].PaymentMode == "CASH") {
                        BillAmt = BillAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
                    } else {
                        CreditAmt = CreditAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
                    }
                }
                $("div[id='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("table:first").find("tr").each(function () {
                    $(this).find("td:contains('Payment')").css("display", "none");
                    $(this).find("td:contains('Action')").css("display", "none");
                    $(this).find("td:contains('Credit')").text("Mode");
                });
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='FBLAmount']").text(parseFloat(BillAmt).toFixed(3));
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='FBLAmount']").val(parseFloat(BillAmt).toFixed(3));

                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='CrediAmount']").text(parseFloat(CreditAmt).toFixed(3));
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='CrediAmount']").val(parseFloat(CreditAmt).toFixed(3));
                $("#CashAmount").val(parseFloat(BillAmt).toFixed(3));
                $("#_tempCashAmount").val(parseFloat(BillAmt).toFixed(3));

            }
            if (handlingChargeArray.length == 0 && awbChequeArray.length == 0) {

                cfi.makeTrans("importfwb_shipmenthandlingchargeinfo", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, null);

                cfi.makeTrans("importfwb_shipmentaddcheque", null, null, BindBankAutoComplete, ReBindBankAutoComplete, null, null);
                $("div[id$='areaTrans_importfwb_shipmentaddcheque']").find("[id='areaTrans_importfwb_shipmentaddcheque']").each(function () {
                    $(this).find("input[id^='BankName']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
                    });
                });

                $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table2[0].CurrencyCode + ')');
                var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
                $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function () {
                    $(this).find("input[id^='ChargeName']").each(function () {
                        cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, null, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
                    });
                    $(this).find("input[id^='BillTo']").each(function () {
                        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
                    });
                    $(this).find("input[id^='Amount']").each(function () {
                        $(this).unbind("blur").bind("blur", function () {
                            CalculateFBLAmount(this);
                        });
                    });

                });
                $("#CashAmount").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });

                var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
                $.ajax({
                    url: "Services/Shipment/FWBService.svc/FBLHandlingCharges?AWBSNo=" + currentawbsno + "&CityCode=" + origin, async: false, type: "get", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        paymentData = jQuery.parseJSON(result);
                        paymentList = paymentData.Table0;
                        //Added By Manoj Kumar on 16/9/2015

                        MendatoryPaymentCharges = [];
                        $(paymentList).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "amount": i.ChargeAmount, "totalamount": parseFloat(i.ChargeAmount), "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, "min": i.Min, "totaltaxamount": i.TotalTaxAmount, "list": 1, "billto": i.ChargeTo, "text_billto": i.Text_ChargeTo });
                            }
                        })
                        cfi.makeTrans("importfwb_shipmenthandlingchargeinfo", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, MendatoryPaymentCharges);

                        $("div[id$='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function (row, tr) {
                            $(tr).find('td:eq(7)').css("display", "none");
                            $(tr).find('td:eq(8)').css("display", "none");
                            $(tr).find('td:eq(9)').css("display", "none");
                            $(tr).find("input[id^='chkCash']").prop('checked', true)
                        });

                        $("div[id='divareaTrans_importfwb_shipmenthandlingchargeinfo'] table tr").each(function (row, tr) {
                            if ($(tr).find("td[id^=tdSNoCol]").text() != "" && $(tr).find("td[id^=tdSNoCol]").text() != undefined) {
                                if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) < MendatoryPaymentCharges.length) {
                                    $(tr).find("td[id^=transAction]").remove();
                                }
                                else if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) == MendatoryPaymentCharges.length) {
                                    $(tr).find("td[id^=transAction]").find("i[title=Delete]").remove();
                                }
                            }

                            $(tr).find("input[id^=Text_ChargeName]").each(function () {
                                var NMendatory = getNonObjects(MendatoryPaymentCharges, 'chargename', $(this).data("kendoAutoComplete").key());
                                if (NMendatory[0].billto != "2") {
                                    $(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                                }
                            });
                        });

                        CalculateTotalFBLAmount();
                        $("div[id$='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(7)").css("display", "none");
                        $("div[id$='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(8)").css("display", "none");
                        $("div[id$='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(9)").css("display", "none");

                    },
                    error: function (xhr) {

                    }
                });

                CalculateTotalFBLAmount();

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
                    if (cfi.IsValidSection(sectionId)) {
                        if (true) {
                            SavePaymentInfo();
                        }
                    }
                    else {
                        return false
                    }
                });

                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    var saveflag = false;
                    if (cfi.IsValidSection(sectionId)) {
                        if (true) {
                            saveflag = SavePaymentInfo();
                        }
                    }
                    else {
                        saveflag = false
                    }
                    if (saveflag) {
                        for (var i = 0; i < processList.length; i++) {
                            if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                                if (currentawbsno > 0) {
                                    currentprocess = processList[i + 1].value;
                                    ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);
                                }
                                else {
                                    CleanUI();
                                    cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                                }
                                return;
                            }
                        }
                    }
                });
            }
            else {
                $("div[id='divareaTrans_importfwb_shipmenthandlingchargeinfo']").find("table:first").append(tableHandleCharge);

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('warning', 'Warning - Payment', "Payment already Processed", "bottom-right");
                });
            }
            $("div[id$='areaTrans_importfwb_shipmentaddcheque']").hide();
        }
    });
}

function BindCheckList() {
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $("#XRay").prop("checked", false);
    $("#Remarks").val('');
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetCheckList?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var CheckListData = jQuery.parseJSON(result);
            var CheckListInfo = CheckListData.Table0;


            if (CheckListInfo.length > 0) {
                var resItem = CheckListInfo[0];
                if (resItem.XrayRequired = true)
                    $("#XRay").prop("checked", true);
                else
                    $("#XRay").prop("checked", true);
                $("#Remarks").val(resItem.Remarks);
            }
        }
    });
}

function SaveCheckList() {
    var flag = false;
    var XRayRequired = ($("[id='XRay']:checked").val() == 'on');
    var Remarks = $("#Remarks").val();



    var DocumentInfoArray = [];

    $("div[id='divDetail']").find("[id^='rbtnY']").each(function () {
        var rbtnY = $(this).closest('tr').find("[id^='rbtnY']:checked").val();
        var rbtnN = $(this).closest('tr').find("[id^='rbtnN']:checked").val();
        var rbtnNA = $(this).closest('tr').find("[id^='rbtnNA']:checked").val();

        var DocumentViewModel = {
            CheckListDetailSNo: $(this).closest('tr').find("td:first").html(),
            Status: (rbtnY == "Y" ? rbtnY : (rbtnN == "N" ? rbtnN : (rbtnNA == "NA" ? rbtnNA : ""))),
            AWBSNo: currentawbsno,
            EnteredBy: "1",
            Remarks: ""
        };
        DocumentInfoArray.push(DocumentViewModel);
    }
    );


    $("div[id='divDetailSHC']").find("[id^='rbtnY']").each(function () {
        var rbtnY = $(this).closest('tr').find("[id^='rbtnY']:checked").val();
        var rbtnN = $(this).closest('tr').find("[id^='rbtnN']:checked").val();
        var rbtnNA = $(this).closest('tr').find("[id^='rbtnNA']:checked").val();

        var DocumentViewModel = {
            CheckListDetailSNo: $(this).closest('tr').find("td:first").html(),
            Status: (rbtnY == "Y" ? rbtnY : (rbtnN == "N" ? rbtnN : (rbtnNA == "NA" ? rbtnNA : ""))),
            AWBSNo: currentawbsno,
            EnteredBy: "1",
            Remarks: ""
        };
        DocumentInfoArray.push(DocumentViewModel);
    }
    );

    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveCheckList", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, CheckListTrans: DocumentInfoArray, XRay: XRayRequired, Remarks: Remarks, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveEDoxList() {
    var EDoxArray = [];
    var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
    var Remarks = $("#Remarks").val();
    var flag = false; rese
    $("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("[id^='areaTrans_importfwb_shipmentedoxinfo']").each(function () {
        var eDoxViewModel = {
            EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
            DocName: $(this).find("span[id^='DocName']").text(),
            AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
            ReferenceNo: $(this).find("input[id^='Reference']").val(),
            Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
        };
        EDoxArray.push(eDoxViewModel);

    });
    if (EDoxArray.length == 0) {
        ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
    }
    $.ajax({
        url: "Services/Shipment/FWBService.svc/SaveAWBEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBEDoxDetail: EDoxArray, AllEDoxReceived: AllEDoxReceived, Remarks: Remarks, UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveFormData(subprocess) {
    var issave = false;

    if (subprocess.toUpperCase() == "CUSTOMER") {
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
    else if (subprocess.toUpperCase() == "RATE") {
        issave = SaveDimensionInfoNew();
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
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
    else if (subprocess.toUpperCase() == "HANDLING") {
        issave = SaveHandlingInfo();
    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
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
                }
            }
        }
    });
}

function SearchData(obj) {
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");
    var testData = $('#tblAWBRateDesription').appendGrid('getStringJson');

    if (testData == "[]" || testData == false) {
        ShowMessage('warning', 'Information!', "Rate Not Found");
        return false;
    }
    if ($('#tdFlightDate').text().trim() == "" && FlightDateForGetRate == "") {
        //alert('Please provide Flight Date & Flight No. to proceed.');
        jAlert("Please provide Flight Date & Flight No. to proceed.", "Get Rate");
        return false;
    }
    var flightdt = $('#tdFlightDate').text().trim() == "" ? FlightDateForGetRate : $('#tdFlightDate').text();
    var m = "0" + parseInt(months.indexOf(flightdt.split('-')[1].toLowerCase()) + parseInt(1));
    var d = "0" + flightdt.split('-')[0].trim();
    var AirlinePrefix = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[1].trim() || "514" : $('#tdFlightNo').text().split('-')[0].trim() || "514";
    var CarCode = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[0].trim() || "G9" : $('#Text_FlightNo').val().split('-')[0] || "G9";
    var FlightNo = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[1].trim() || "G9" : $('#tdFlightNo').text().split('-')[1].trim() || "";

    PushArray = [];
    if ($("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").length > 0) {
        $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function (i, row) {
            var dd = {
                "lNOP": $(row).find("[id^='tblAWBRateDesription_NoOfPieces_']").val(),
                "lWeight": $(row).find("[id^='tblAWBRateDesription_GrossWeight_']").val(),
                "lWeightCode": $(row).find("[id^='tblAWBRateDesription_WeightCode_']").val(),
                "lNOG": $(row).find("[id^='tblAWBRateDesription_NatureOfGoods_']").val() || "General",
                "lOrigin": $("#tdOD").text().split('-')[0].trim(),
                "lDestination": $("#tdOD").text().split('-')[1].trim(),
                "lAirlinePrefix": AirlinePrefix,
                "lCarrierCode": CarCode,
                "lFlightNumber": FlightNo,
                "lFlightdate": d.substring(d.length - 2, d.length) + '/' + m.substring(m.length - 2, m.length) + '/' + flightdt.split('-')[2],
                "lFlightCarrierCode": $('#Text_FlightNo').val().split('-')[0] || "G9",
                "lCurrencyCode": userContext.CurrencyCode,
                "lRateType": "BOTH"
            };
            PushArray.push(dd);
        });
    }

    var req = { "lText": JSON.stringify(PushArray) }

    $.ajax({
        type: "POST",
        cache: false,
        url: userContext.SysSetting.CRAServiceURL + 'WebServiceGetRates.asmx/GetMultipleRTDRates',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(req),
        success: function (data) {
            var ChargeArray = JSON.parse(data.d).Airwaybill_ChargeLines;
            var OtherData = JSON.parse(data.d).Airwaybill_Other_Charges;
            var OtherCharge = [];
            if (ChargeArray != undefined && ChargeArray.length > 0) {
                $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function (i, row) {

                    $(row).find("input[id^='_temptblAWBRateDesription_ChargeableWeight_']").val(ChargeArray[i]["Display_ChargeableWeight"]);
                    $(row).find("input[id^='tblAWBRateDesription_ChargeableWeight_']").val(ChargeArray[i]["Display_ChargeableWeight"]);
                    $(row).find("input[id^='_temptblAWBRateDesription_Charge_']").val(ChargeArray[i]["Display_RateOrCharge"]);
                    $(row).find("input[id^='tblAWBRateDesription_Charge_']").val(ChargeArray[i]["Display_RateOrCharge"]);
                    $(row).find("input[id^='_temptblAWBRateDesription_ChargeAmount_']").val(ChargeArray[i]["Display_TotalChargeAmount"]);
                    $(row).find("input[id^='tblAWBRateDesription_ChargeAmount_']").val(ChargeArray[i]["Display_TotalChargeAmount"]);

                    $(row).find("input[id^='tblAWBRateDesription_RateClassCode_']").data("kendoAutoComplete").setDefaultValue(ChargeArray[i].Display_RateClassShortCode, ChargeArray[i].Display_RateClassShortCode);
                    $(row).find("button[id^='tblAWBRateDesription_Delete_']").remove();
                });
            }

            if (ChargeArray.length > 1) {
                var tactdata = {
                    AWBSNo: currentawbsno,
                    BaseOn: ChargeArray[1].Based_On,
                    ChargeableWeight: ChargeArray[1].Display_ChargeableWeight,
                    CommodityItemNumber: ChargeArray[1].Display_CommodityItemNumber,
                    GrossWeight: ChargeArray[1].Display_GrossWeight,
                    NatureOfGoods: ChargeArray[1].Display_NOGDIMS,
                    NoOfPieces: ChargeArray[1].Display_NOPRCP,
                    RateClassCode: ChargeArray[1].Display_RateClassShortCode,
                    Charge: ChargeArray[1].Display_RateOrCharge,
                    ChargeAmount: ChargeArray[1].Display_TotalChargeAmount,
                    WeightCode: ChargeArray[1].Display_UnitOfGrossWeight,
                }
                TactArray.push(tactdata);
                if ($("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").length > 0) {
                    $("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").text("TACT Rate: " + ChargeArray[1].Display_RateOrCharge);
                } else {
                    $("#tblAWBRateDesription > tfoot > tr > td > button:nth-child(1)").after("<span class='ui-button-text' id='spanTactRate' id='spanTactRate'>TACT Rate: " + ChargeArray[1].Display_RateOrCharge + "</span>");
                }
            }

            if (OtherData != undefined && OtherData.length > 0) {
                for (i = 0; i < OtherData.length; i++) {
                    var otherinfo = {
                        Type: OtherData[i]["PC_Indicator"],
                        OtherCharge: OtherData[i]["Code"],
                        DueType: OtherData[i]["Entitlement_Code"],
                        Amount: OtherData[i]["Charge_Amount"]
                    };
                    OtherCharge.push(otherinfo);
                }
                $("#tblAWBRateOtherCharge").appendGrid('load', OtherCharge);
                $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function (i, row) {
                    $(row).find("input[id^='_temptblAWBRateOtherCharge_Amount_']").val(OtherCharge[i]["Amount"]);
                    $(row).find("button[id^='tblAWBRateOtherCharge_Delete_']").remove();

                });
            }
            CalculateRateTotal();

        },
        error: function (a, b) {
            ShowMessage('warning', 'Information!', "Rate Not Found");
        }
    });
}

function CalculateRateTotal() {
    CalculateChargeAmt();
    var FrieghtType = "";
    var TotalPrepaid = 0;
    var TotalCollect = 0;
    if ($("#Text_Valuation").data("kendoAutoComplete").key() == "") {
        $.ajax({
            url: "Services/Shipment/AcceptanceService.svc/GetFieldsFromTable?Fields=IsFreightPrepaid&Table=AWB&AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNO: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Frieghtdata = jQuery.parseJSON(result);
                FrieghtType = Frieghtdata.Table[0]["IsFreightPrepaid"] = true ? "PP" : "CC";
                if (FrieghtType = "PP") {
                    $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue("PP", "Prepaid");
                } else {
                    $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue("CC", "Collect");
                }

            },
            error: {

            }
        });
    }
    else {
        FrieghtType = $("#Text_Valuation").data("kendoAutoComplete").key();
    }

    var _rateAmt = 0;
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        _rateAmt += parseFloat($(this).find("[id^='tblAWBRateDesription_ChargeAmount_']").val() || "0");
    });

    if (FrieghtType == "PP") {
        TotalPrepaid = _rateAmt;
    } else {
        TotalCollect = _rateAmt;
    }

    $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function () {
        if ($(this).find("[id^='tblAWBRateOtherCharge_Type_']").val() == "P") {
            TotalPrepaid += parseFloat($(this).find("[id^='tblAWBRateOtherCharge_Amount_']").val() || "0");
        } else if ($(this).find("[id^='tblAWBRateOtherCharge_Type_']").val() == "C") {
            TotalCollect += parseFloat($(this).find("[id^='tblAWBRateOtherCharge_Amount_']").val() || "0");
        }
    });

    CalculateTotalAmount();
}

function CalculateTotalAmount() {
    var total = $("#TotalAmount").val() == "" ? 0 : $("#TotalAmount").val();
    var conversionRate = $("#CDCConversionRate").val() == "" ? 0 : $("#CDCConversionRate").val();
    var totalAmount = parseFloat(total) * parseFloat(conversionRate);

    $("#CDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
    $("#_tempCDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
}

function CalculateChargeAmt() {
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        if ($(this).find("[type='button'][id*='tblAWBRateDesription_Delete']").length > 0) {
            var CharWt = ($(this).find("input[id^='tblAWBRateDesription_ChargeableWeight']").val() || "0") == "0" ? ($(this).find("input[id^='_temptblAWBRateDesription_ChargeableWeight']").val() || "0") : ($(this).find("input[id^='tblAWBRateDesription_ChargeableWeight']").val() || "0");
            var Charge = ($(this).find("input[id^='tblAWBRateDesription_Charge_']").val() || "0") == "0" ? ($(this).find("input[id^='_temptblAWBRateDesription_Charge_']").val() || "0") : ($(this).find("input[id^='tblAWBRateDesription_Charge_']").val() || "0");
            $(this).find("input[id*='tblAWBRateDesription_ChargeAmount']").val((parseFloat(CharWt) * parseFloat(Charge)).toFixed(2));
        }
    });

    var freightAmount = 0;
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        freightAmount = Number(freightAmount) + Number($(this).find("input[id*='tblAWBRateDesription_ChargeAmount']").val());
    });
    $("#CDCChargeAmount").val(freightAmount);
    $("#_tempCDCChargeAmount").val(freightAmount);
    CalculateTotalAmount();
}

function CheckLength(obj) {
    if ($(obj).val() != "") {
        if ($(obj).val().length < 6) {
            $(obj).val('');
            $("#" + '_temp' + $(obj).attr('id')).val('');
            CallMessageBox('info', 'H S Code', 'H S Code should be of minimum 6 digits.');
        }
    }
}

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            //"<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New FWB</button></td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div><div id='pWindow'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:0%;' valign='top' style='display:none' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td colspan='3'></td></tr><tr> <td id='IdAWBPrint' colspan='3' class='tdInnerPadding'>Print &nbsp;&nbsp;&nbsp;&nbsp;<select id='sprint' ><option value='AWB' selected>AWB</option><option value='CSD'  selected>eCSD</option><option value='AWBLabel'>AWB Label</option><option value='AcceptanceNote'>Acceptance Note</option><option value='PReceipt'>Payment Receipt</option><option value='Checklist'>Check List</option></select>&nbsp;<button name='button' onclick='bprint();' value='OK type='button'>Print</button></td></tr><tr id='trAmmendment'> <td>FWB Amendment</td><td>:</td><td><input type='checkbox' name='chkFWBAmmendment' id='chkFWBAmmendment'></td></tr></table> </td><td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";
var rpl = "<ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail2'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div>";

var NogDiv = '<div id="divareaTrans_importfwb_shipmentnog" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Nature of Good"><span id="spnNOG"> Nature of Goods</span></td><td class="formHeaderLabel" title="Other Nature of Good"><span id="spnOtherNOG">Other</span></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods" id="OtherNatureofGoods" value=""><input type="text" class="" name="Text_OtherNatureofGoods" id="Text_OtherNatureofGoods" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_0" id="OtherNatureofGoods_0" value=""><input type="text" class="" name="Text_OtherNatureofGoods_0" id="Text_OtherNatureofGoods_0" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_1" id="OtherNatureofGoods_1" value=""><input type="text" class="" name="Text_OtherNatureofGoods_1" id="Text_OtherNatureofGoods_1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_2" id="OtherNatureofGoods_2" value=""><input type="text" class="" name="Text_OtherNatureofGoods_2" id="Text_OtherNatureofGoods_2" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_3" id="OtherNatureofGoods_3" value=""><input type="text" class="" name="Text_OtherNatureofGoods_3" id="Text_OtherNatureofGoods_3" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr></tbody></table>'
    + '</div>'