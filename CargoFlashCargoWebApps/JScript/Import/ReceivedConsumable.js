$(function () {
    cfi.ValidateForm();

    MasterDeliveryOrder();
});
function MasterDeliveryOrder() {
    _CURR_PRO_ = "RECEIVEDCONSUMABLE";
    _CURR_OP_ = "Master Received Consumable";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divReceivedConsumableDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Import/ReceivedConsumableService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/ReceivedConsumableSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Ftype = [{ Key: "0", Text: "FLIGHT" }, { Key: "1", Text: "SELF" }];
            var Rtype = [{ Key: "0", Text: "AGENT" }, { Key: "1", Text: "AIRLINE" }];
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            $('#__tblreceivedconsumablesearch__ tbody tr td:eq(9)').hide();
            $('#__tblreceivedconsumablesearch__ tbody tr td:eq(11)').hide();
            cfi.AutoCompleteV2("searchAirline", "CarrierCode,AirlineName", "ReceiveConsumable_searchAirline", OnchangeFlightnew, "contains");



           
            cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "ReceiveConsumable_searchFlightNo", null, "contains");


            cfi.AutoCompleteByDataSource("FlightAirline", Ftype, onchangeflighttype, null);
            cfi.AutoCompleteByDataSource("ReceivedFrom", Rtype, null, null);
            $('#FlightDate').data("kendoDatePicker").value("");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ReceivedConsumableSearch();
            });
            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                $("#hdnAWBSNo").val("");
                currentawbsno = 0;
                var module = "Import";
                if (_CURR_PRO_ == "HOUSE") {
                    module = "House";
                }

                var DeliveryOrderGetWebForm8 = {
                    processName: _CURR_PRO_,
                    moduleName: module,
                    appName: 'RESERVATION',
                    Action: 'New',
                    IsSubModule: '1'

                }





                $.ajax({
                    //url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/RESERVATION/New/1",
                    //async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
                    async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ model: DeliveryOrderGetWebForm8 }),

                    success: function (result) {
                        $("#divNewBooking").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("IssueConsumable", "divNewBooking");
                            currentprocess = "IssueConsumable";

                            //$("#tblShipmentInfo").hide();
                            GetProcessSequence("ACCEPTANCE");
                        }
                    }
                });

            });
        }
    });
}

function OnchangeFlightnew() {
    cfi.ResetAutoComplete("searchFlightNo");
}
function onchangeflighttype() {
    if ($('#Text_FlightAirline').val() == 'SELF') {
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(2)').hide();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(3)').hide();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(4)').hide();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(5)').hide();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(6)').hide();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(7)').hide();
        $('#btnSearch').hide();
        $('#divDetail').html('');
        $('#divReceivedConsumableDetails').hide();
        $('#divDetail').append("<table id='tblDORating'></table><table id='tblIssueConsumableSelf'></table> ");
        BindIssueConsumableSelf();
    }
    else {
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(2)').show();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(4)').show();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(6)').show();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(3)').show();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(5)').show();
        $('#__tblreceivedconsumablesearch__ tbody tr td:eq(7)').show();
        $('#btnSearch').show();
        $('#divDetail').html('');
        $('#divReceivedConsumableDetails').show();
    }
}
function CleanUI() {
    $("#tabstrip-1").hide();
    //$('#divNewDeliveryOrder').hide()
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
function ReceivedConsumableSearch() {
    var searchAirline = $("#searchAirline").val() == "" ? "0" : $("#searchAirline").val();
    var searchFlightNo = $("#searchFlightNo").val() == "" ? "0" : $("#searchFlightNo").val();

    var FlightDate = "0";

    if ($("#FlightDate").val() != "") {
        FlightDate = cfi.CfiDate("FlightDate") == "" ? "0" : cfi.CfiDate("FlightDate");// "";//month + "-" + day + "-" + year;
    }
    var type = $('#FlightAirline').val() == "" ? "0" : $('#FlightAirline').val();



    var LoggedInCity = "DEL";
    if (_CURR_PRO_ == "RECEIVEDCONSUMABLE") {

        cfi.ShowIndexView("divReceivedConsumableDetails", "Services/Import/ReceivedConsumableService.svc/GetGridData/" + _CURR_PRO_ + "/Import/ReceivedConsumable/" + searchAirline.trim() + "/" + searchFlightNo.trim() + "/" + FlightDate.trim() + "/" + LoggedInCity.trim() + "/" + type);
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
    $("#SearchIncludeTransitAWB").after("Include Transit AWB");
    $("#SearchExcludeDeliveredAWB").after("Exclude Delivered AWB");
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
function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    //$("#tblShipmentInfo").hide();
    $("#divNewDeliveryOrder").html("");
}
function BindEvents(obj, e, isdblclick) {


    //$("#divDetail1").html("");
    //$("#divDetail2").html("");
    //$("#divDetail3").html("");
    //$("#divDetailSHC").html('');
    //$("#divTab3").html('');
    //$("#divTab4").html('');
    //$("#divTab5").html('');
    //$("#divXRAY").hide();
    //$("#tabstrip").show();
    //if ($(obj).attr("class") == "dependentprocess")
    //    _IS_DEPEND = true;
    //else
    //    _IS_DEPEND = false;
    //ResetDetails();
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
    var SnoIndex = 0;
    var ItemIndex = 0;
    var ConsumableSNoIndex = 0;
    var NumberdIndex = 0;
    var QuantityIndex = 0;


    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    awbSNoIndex = 0;
    ItemIndex = trRow.find("th[data-field='Item']").index();
    ConsumableSNoIndex = trRow.find("th[data-field='ConsumableSno']").index();
    NumberdIndex = trRow.find("th[data-field='Numbered']").index();
    QuantityIndex = trRow.find("th[data-field='Quantity']").index();

    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    Item = closestTr.find("td:eq(" + ItemIndex + ")").text();
    ConsumableSNo = closestTr.find("td:eq(" + ConsumableSNoIndex + ")").text();
    Numbered = closestTr.find("td:eq(" + NumberdIndex + ")").text();
    Quantity = closestTr.find("td:eq(" + QuantityIndex + ")").text();



    $("#hdnItem").val(Item);
    $("#hdnConsumableSNo").val(ConsumableSNo);
    $("#hdnNumbered").val(Numbered);
    $("#hdnQuantity").val(Quantity);
    ShowProcessDetails(subprocess, isdblclick);
    $("#tabstrip").kendoTabStrip();
}
function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

    if (subprocess.toUpperCase() == "ISSUECONSUMABLE") {
        $('#divDetail').append("<table id='tblDORating'></table><table id='tblIssueConsumable'></table> ");
        BindIssueConsumable();
        //BindDeliveryOrder();
        //BindDORating();
        //BindDOULD();
        //BindDOOtherCharge();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }

            } else {
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


        var DeliveryOrderGetWebForm9 = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName:subprocess,
            Action: 'New',
            IsSubModule: '1'

        }

        $.ajax({
            //url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1",
            //async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
            async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: DeliveryOrderGetWebForm9 }),

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

        var DeliveryOrderGetWebForm10 = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: subprocess,
            Action: 'New',
            IsSubModule: '1'

        }

        $.ajax({
            //url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1",
            //async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",


            url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
            async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: DeliveryOrderGetWebForm10}),

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

        var DeliveryOrderGetWebForm11 = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: subprocess,
            Action: 'New',
            IsSubModule: '1'

        }





        $.ajax({

            url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
            async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: DeliveryOrderGetWebForm11 }),

            //url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1",
            //async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("tblIssueConsumable_IssueTo") >= 0) {
        cfi.setFilter(filterEmbargo, "Type", "eq", $('#tblIssueConsumable_IssueType_' + textId.split('_')[2]).val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }

    if (textId.indexOf("tblIssueConsumableSelf_IssueTo") >= 0) {
        cfi.setFilter(filterEmbargo, "Type", "eq", $('#tblIssueConsumableSelf_IssueType_' + textId.split('_')[2]).val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
    if (textId == "Text_searchFlightNo") {
        cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#searchAirline").val())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
        return RegionAutoCompleteFilter;
    }

    if (textId == "tblIssueConsumableSelf_Item_" + textId.split('_')[2]) {

        cfi.setFilter(filterEmbargo, "CitySno", "eq", userContext.CitySNo);
        cfi.setFilter(filterEmbargo, "Owner", "eq", $('#tblIssueConsumableSelf_IssueType_' + textId.split('_')[2]).val());

        if ($('#tblIssueConsumableSelf_IssueType_' + textId.split('_')[2]).val() != '2')
            cfi.setFilter(filterEmbargo, "OwnerSno", "eq", $('#tblIssueConsumableSelf_HdnIssueTo_' + textId.split('_')[2]).val());

        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }

}


function BindIssueConsumableSelf() {
    var dbtableName = "IssueConsumableSelf";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/AcceptanceService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDNew",
        //masterTableSNo: 0,
        caption: "Receive Consumable",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                { name: 'ConsumableSno', type: 'hidden', value: 0 },
                  { name: 'hdnNumber', type: 'hidden', value: 0 },

                    {
                        name: pageType == 'EDIT' ? 'IssueType' : 'IssueType', display: 'Receive For', type: 'select', ctrlOptions: { '0': 'Agent', '1': 'Airline', '2': 'Self' }, onChange: function (evt, rowIndex) { checkContourValidationSelf(rowIndex) }, ctrlCss: { width: '80px' }
                    },
                 {
                     name: "IssueTo", display: "Forwarder(Agent)/Airline/Self", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, AutoCompleteName: 'ImportInbound_IssueTo', filterField: 'Name', addOnFunction: function (id, text, hdnid, key) {
                         debugger
                         var ind = $("#" + id).attr("id").split('_')[2];
                         cfi.ResetAutoComplete("tblIssueConsumableSelf_Item_" + ind);
                         $("#_temptblIssueConsumableSelf_Quantity_" + ind).val('');
                         $("#tblIssueConsumableSelf_Quantity_" + ind).val('');
                     }
                 },

                {
                    name: "Item", display: "Item", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, AutoCompleteName: 'ImportInbound_Item', filterField: 'Name', addOnFunction: function (id, text, hdnid, key) {
                        debugger
                        var ind = $("#" + id).attr("id").split('_')[2];
                        var indexName = $("#" + id).attr("id").split('_')[1];
                        var replacedID = $("#" + id).attr("id").replace(indexName, 'ContentType');
                        checkNumberdItem(id)

                    }
                },
                 {
                     name: 'Quantity', display: 'Quantity', type: 'text', value: ($('#hdnNumber').val() == "true" ? "1" : " "), ctrlCss: { width: '60px', height: '20px', readonly: true }, ctrlAttr: { controltype: 'number', maxlength: 5 }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },

                 {
                     name: 'ConsumablePrefix', display: 'Consumable Prefix', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 3, readonly: ($('#hdnNumber').val() == "true" ? false : true) }, isRequired: ($('#hdnNumber').val() == "true" ? true : false)
                 },
                 {
                     name: 'ConsumableType', display: 'Consumable Type', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 3, readonly: ($('#hdnNumber').val() == "true" ? false : true) }, isRequired: ($('#hdnNumber').val() == "true" ? true : false)
                 },
                 {
                     name: 'ConsumableNo', display: 'Consumable No', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { Controltype: 'number', maxlength: 3, readonly: ($('#hdnNumber').val() == "true" ? false : true) }, isRequired: ($('#hdnNumber').val() == "true" ? true : false)
                 },

                    {
                        name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 20, readonly: ($('#hdnNumber').val() == "true" ? false : true) }, isRequired: ($('#hdnNumber').val() == "true" ? true : false)
                    }



        ],
        customFooterButtons: [
            { uiButton: { label: 'Receive Consumable', text: true }, btnAttr: { title: 'Receive Consumable' }, click: function (evt) { SaveDataSelf(this) }, atTheFront: true },
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }
    });
}

function BindIssueConsumable() {
    var dbtableName = "IssueConsumable";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/AcceptanceService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDNew",
        masterTableSNo: currentawbsno,
        caption: "Receive Consumable",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'ConsumableSno', type: 'hidden', value: $('#hdnConsumableSno').val() },
                   { name: 'Item', display: 'Item', value: $("#hdnItem").val(), type: 'label' },
                 {
                     name: 'Quantity', display: 'Quantity', type: 'text', value: ($('#hdnNumbered').val() == "true" ? "1" : " "), ctrlCss: { width: '60px', height: '20px', readonly: true }, ctrlAttr: { controltype: 'number', maxlength: 5 }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                 {
                     name: pageType == 'EDIT' ? 'IssueType' : 'IssueType', display: 'Issue Type', type: 'select', ctrlOptions: { '0': 'Agent', '1': 'Airline', '2': 'Self' }, onChange: function (evt, rowIndex) { checkContourValidation(rowIndex) }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "IssueTo", display: "Issue To", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, AutoCompleteName: 'ImportInbound_IssueTo', filterField: 'Name'
                 },
                 {
                     name: 'ConsumablePrefix', display: 'Consumable Prefix', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 3, readonly: ($('#hdnNumbered').val() == "true" ? false : true) }, isRequired: ($('#hdnNumbered').val() == "true" ? true : false)
                 },
                 {
                     name: 'ConsumableType', display: 'Consumable Type', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 3, readonly: ($('#hdnNumbered').val() == "true" ? false : true) }, isRequired: ($('#hdnNumbered').val() == "true" ? true : false)
                 },
                 {
                     name: 'ConsumableNo', display: 'Consumable No', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { Controltype: 'number', maxlength: 3, readonly: ($('#hdnNumbered').val() == "true" ? false : true) }, isRequired: ($('#hdnNumbered').val() == "true" ? true : false)
                 },

                    {
                        name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'text', maxlength: 20, readonly: ($('#hdnNumbered').val() == "true" ? false : true) }, isRequired: ($('#hdnNumbered').val() == "true" ? true : false)
                    }



        ],
        customFooterButtons: [
            { uiButton: { label: 'Receive Consumable', text: true }, btnAttr: { title: 'Receive Consumable' }, click: function (evt) { SaveData(this) }, atTheFront: true },
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }
    });
}

function checkctrlanddisable(rowIndex) {
    $('#tblIssueConsumable_IssueTo_1').removeAttr("data-valid");
    $('#tblIssueConsumable_IssueTo_1').removeAttr("data-valid-msg");
    $('#tblIssueConsumable_IssueTo_1').removeClass("valid_invalid");
    $('#spnOwnerName').parent().find('font').html(' ');
    $("#tblIssueConsumable_IssueTo_1").data("kendoAutoComplete").enable(false);
    cfi.ResetAutoComplete("tblIssueConsumable_HdnIssueTo_1");
    $('#tblIssueConsumable_HdnIssueTo_1').closest('td').find('span').find('.k-state-disabled').removeAttr('style');
}

function checkContourValidation(id) {
    //  $("#tblIssueConsumable").find("input[id^='tblIssueConsumable_IssueTo']").each(function () {
    varvalue = $("#tblIssueConsumable_IssueType_" + (id + 1)).val()
    if (varvalue == '2') {
        $("tblIssueConsumable_ConsumablePrefix_" + (id + 1)).val('');
        $("#tblIssueConsumable_IssueTo_" + (id + 1)).data("kendoAutoComplete").enable(false);
        $("#tblIssueConsumable_IssueTo_" + (id + 1)).val('');
        $("#tblIssueConsumable_HdnIssueTo_" + (id + 1)).val('');

        $("#tblIssueConsumable_IssueTo_" + (id + 1)).removeAttr("required");

    }
    else {
        $("#tblIssueConsumable_IssueTo_" + (id + 1)).data("kendoAutoComplete").enable(true);
        $("#tblIssueConsumable_IssueTo_" + (id + 1)).val('');
        $("#tblIssueConsumable_HdnIssueTo_" + (id + 1)).val('');
        $("#tblIssueConsumable_IssueTo_" + (id + 1)).attr('required', 'required');
    }
    //  });
}


function checkContourValidationSelf(id) {
    //$("#tblIssueConsumableSelf").find("input[id^='tblIssueConsumableSelf_IssueTo']").each(function () {

    cfi.ResetAutoComplete("tblIssueConsumableSelf_IssueTo_" + (id + 1));
    cfi.ResetAutoComplete("tblIssueConsumableSelf_Item_" + (id + 1))
    $("#_temptblIssueConsumableSelf_Quantity_" + (id + 1)).val('');
    $("#tblIssueConsumableSelf_Quantity_" + (id + 1)).val('');

    varvalue = $("#tblIssueConsumableSelf_IssueType_" + (id + 1)).val()
    if (varvalue == '2') {
        $("tblIssueConsumableSelf_ConsumablePrefix_" + (id + 1)).val('');
        $("#tblIssueConsumableSelf_IssueTo_" + (id + 1)).data("kendoAutoComplete").enable(false);
        $("#tblIssueConsumableSelf_IssueTo_" + (id + 1)).val('');
        $("#tblIssueConsumableSelf_HdnIssueTo_" + (id + 1)).val('');
        $("#tblIssueConsumableSelf_IssueTo_" + (id + 1)).removeAttr("required");
    }
    else {
        $("#tblIssueConsumableSelf_IssueTo_" + (id + 1)).data("kendoAutoComplete").enable(true);
        $("#tblIssueConsumableSelf_IssueTo_" + (id + 1)).val('');
        $("#tblIssueConsumableSelf_HdnIssueTo_" + (id + 1)).val('');
        $("#tblIssueConsumableSelf_IssueTo_" + (id + 1)).attr('required', 'required');
    }
    //});
}
function checkNumberdItem(id) {


    $("#_temptblIssueConsumableSelf_Quantity_" + id.split('_')[2]).val('');
    $("#tblIssueConsumableSelf_Quantity_" + id.split('_')[2]).val('');

    // $("#tblIssueConsumableSelf").find("input[id^='tblIssueConsumableSelf_Item']").each(function () {
    varvalue = $("#tblIssueConsumableSelf_HdnItem_" + id.split('_')[2]).val().split('-')[1]
    $("#tblIssueConsumableSelf_hdnNumber_" + id.split('_')[2]).val(varvalue);
    if (varvalue == '0') {
        //   $("tblIssueConsumable_ConsumablePrefix_" + this.id.split('_')[2]).val('').removeAttr("style")
        $("#tblIssueConsumableSelf_ConsumablePrefix_" + id.split('_')[2]).attr('readonly', 'readonly');
        $("#tblIssueConsumableSelf_ConsumablePrefix_" + id.split('_')[2]).val('');
        $("#tblIssueConsumableSelf_ConsumablePrefix_" + id.split('_')[2]).val('');

        $("#tblIssueConsumableSelf_ConsumableType_" + id.split('_')[2]).attr('readonly', 'readonly');
        $("#tblIssueConsumableSelf_ConsumableType_" + id.split('_')[2]).val('');
        $("#tblIssueConsumableSelf_ConsumableType_" + id.split('_')[2]).val('');

        $("#tblIssueConsumableSelf_ConsumableNo_" + id.split('_')[2]).attr('readonly', 'readonly');
        $("#tblIssueConsumableSelf_ConsumableNo_" + id.split('_')[2]).val('');
        $("#tblIssueConsumableSelf_ConsumableNo_" + id.split('_')[2]).val('');

        $("#tblIssueConsumableSelf_EquipmentNo_" + id.split('_')[2]).attr('readonly', 'readonly');
        $("#tblIssueConsumableSelf_EquipmentNo_" + id.split('_')[2]).val('');
        $("#tblIssueConsumableSelf_EquipmentNo_" + id.split('_')[2]).val('');

        $("#tblIssueConsumableSelf_ConsumablePrefix_" + id.split('_')[2]).removeAttr('required');
        $("#tblIssueConsumableSelf_ConsumableType_" + id.split('_')[2]).removeAttr('required');
        $("#tblIssueConsumableSelf_ConsumableNo_" + id.split('_')[2]).removeAttr('required');
        $("#tblIssueConsumableSelf_EquipmentNo_" + id.split('_')[2]).removeAttr('required');
    }
    else {
        $("#tblIssueConsumableSelf_ConsumablePrefix_" + id.split('_')[2]).removeAttr('readonly');
        $("#tblIssueConsumableSelf_ConsumableType_" + id.split('_')[2]).removeAttr('readonly');
        $("#tblIssueConsumableSelf_ConsumableNo_" + id.split('_')[2]).removeAttr('readonly');
        $("#tblIssueConsumableSelf_EquipmentNo_" + id.split('_')[2]).removeAttr('readonly');

        $("#tblIssueConsumableSelf_ConsumablePrefix_" + id.split('_')[2]).attr('required', 'required');
        $("#tblIssueConsumableSelf_ConsumableType_" + id.split('_')[2]).attr('required', 'required');
        $("#tblIssueConsumableSelf_ConsumableNo_" + id.split('_')[2]).attr('required', 'required');
        $("#tblIssueConsumableSelf_EquipmentNo_" + id.split('_')[2]).attr('required', 'required');
    }
    ///  });

}
function SaveData(id) {
    //if (!cfi.IsValidForm()) {
    //    return false;
    //}


    var quantityval = 0;
    var res = $("#tblIssueConsumable tr[id^='tblIssueConsumable']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblIssueConsumable');

    var data = JSON.parse(($('#tblIssueConsumable').appendGrid('getStringJson')));

    var lstItem = [];
    for (var i = 0; i <= data.length - 1; i++) {
        //  $("#tblIssueConsumables tbody tr").each(function (i, e) {

        quantityval = parseInt(quantityval) + parseInt(data[i].Quantity);
        if ($("#hdnNumbered").val() == 'true') {
            var r = {

                ConsumableSNo: $('#hdnConsumableSNo').val(),
                ConsumablePrefix: data[i].ConsumablePrefix,
                ConsumableType: data[i].ConsumableType,
                ConsumableNo: data[i].ConsumableNo,
                EquipmentNo: data[i].EquipmentNo,
                Quantity: data[i].Quantity,
                IssuedType: data[i].IssueType,
                IssuedTo: data[i].HdnIssueTo == '' ? '0' : data[i].HdnIssueTo

            }
            lstItem.push(r);
        } else {

            var r = {

                ConsumableSNo: $('#hdnConsumableSNo').val(),
                ConsumablePrefix: 0,
                ConsumableType: 0,
                ConsumableNo: 0,
                EquipmentNo: 0,
                Quantity: data[i].Quantity,
                IssuedType: data[i].IssueType,
                IssuedTo: data[i].HdnIssueTo == '' ? '0' : data[i].HdnIssueTo

            }
            lstItem.push(r);

        }

        //  });
    }
    if (parseInt(quantityval) > parseInt($('#hdnQuantity').val())) {
        ShowMessage('warning', 'Warning - Issued item should be less grater then Qunatity.', null);

        quantityval = 0;
        return false;
    }


    //   var lstConsumabIssue = JSON.stringify(lstItem);
    if (lstItem.length > 0) {
        $.ajax({
            url: "./Services/Import/ReceivedConsumableService.svc/CreateIssueConsumables/1",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ReceivedConsumableList: lstItem }),

            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (eval(data) == 0) {
                    //BindAWBSwap();
                    ShowMessage('success', 'Success!', 'Received Successfully!');
                    CleanUI();
                    ReceivedConsumableSearch();
                }
                else {
                    ShowMessage('warning', 'Warning.', null);
                }
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning -Enter Required Fields.', null);
    }
}


function SaveDataSelf(id) {
    //if (!cfi.IsValidForm()) {
    //    return false;
    //}


    var quantityval = 0;
    var res = $("#tblIssueConsumableSelf tr[id^='tblIssueConsumableSelf']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblIssueConsumableSelf');

    var data = JSON.parse(($('#tblIssueConsumableSelf').appendGrid('getStringJson')));

    var lstItem = [];
    for (var i = 0; i <= data.length - 1; i++) {
        //  $("#tblIssueConsumables tbody tr").each(function (i, e) {

        quantityval = parseInt(quantityval) + parseInt(data[i].Quantity);
        if (data[i].hdnNumber == '1') {
            var r = {

                ConsumableSNo: data[i].HdnItem.split('-')[0],
                ConsumablePrefix: data[i].ConsumablePrefix,
                ConsumableType: data[i].ConsumableType,
                ConsumableNo: data[i].ConsumableNo,
                EquipmentNo: data[i].EquipmentNo,
                Quantity: data[i].Quantity,
                IssuedType: data[i].IssueType,
                IssuedTo: data[i].HdnIssueTo == '' ? '0' : data[i].HdnIssueTo

            }
            lstItem.push(r);
        } else {

            var r = {

                ConsumableSNo: data[i].HdnItem.split('-')[0],
                ConsumablePrefix: 0,
                ConsumableType: 0,
                ConsumableNo: 0,
                EquipmentNo: 0,
                Quantity: data[i].Quantity,
                IssuedType: data[i].IssueType,
                IssuedTo: data[i].HdnIssueTo == '' ? '0' : data[i].HdnIssueTo

            }
            lstItem.push(r);

        }

        //  });
    }


    if (lstItem.length > 0) {
        $.ajax({
            url: "./Services/Import/ReceivedConsumableService.svc/CreateIssueConsumables/0",
            async: false, type: "POST", dataType: "json", cache: false,
            // data: lstConsumabIssue,
            data: JSON.stringify({ ReceivedConsumableList: lstItem }),

            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (eval(data) == 0) {
                    //BindAWBSwap();
                    ShowMessage('success', 'Success!', 'Received Successfully!');
                    BindIssueConsumableSelf();
                }
                else {
                    ShowMessage('warning', 'Warning.', null);
                }
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning -Enter Required Fields.', null);
    }
}


var pageType = $('#hdnPageType').val();
var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;display:none' id='btnNew'>New Delivery Order</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' style='display:none' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table><input type='hidden' id='hdnCheck' value=''><input type='hidden' id='hdnItem'/> <input type='hidden' id='hdnConsumableSNo'/><input type='hidden' id='hdnNumbered'/><input type='hidden' id='hdnQuantity'/></div>";

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divReceivedConsumableDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewDeliveryOrder' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";//<option value='EDI'>EDI Messages</option>