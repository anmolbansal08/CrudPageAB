$(document).ready(function () {
    ULDSupportRequest();


});
var paymentList = null;
var currentprocess = "";
var CurrentSNo = 0;
var _CURR_PRO_ = "";
var _CURR_OP_ = "";
function GetProcessSequence(processName) {
    // 
    $.ajax({
        url: "Services/ULD/ULDSupportRequestService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            // alert(processdata.Table0)
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
        }
    });
}
function CleanUI() {
    $("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divRequest").hide();
    $("#tblShipmentInfo").hide();
    $("#divNewRequest").html("");
    $("#btnSave").unbind("click");
    $("#btnSave").show()
    $("#btnSaveToNext").unbind("click");
}
function ULDSupportRequest() {

    _CURR_PRO_ = "ULDSupportRequest";
    _CURR_OP_ = "ULD Support Request";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divULDSupportrequest").html("");
    CleanUI();
    $.ajax({
        url: "Services/ULD/ULDSupportRequestService.svc/GetWebForm/" + _CURR_PRO_ + "/ULD/ULDSupportAssigned/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ULDrequestSearch();
            });
            CleanUI();
            ULDrequestSearch();
            $("#btnNew").unbind("click").bind("click", function () {
                $('#btnSave').attr("disabled", false);
                $("#btnSave").show();
                CleanUI();
                CurrentSNo = 0;
                HighLightGridButton(this.event);
                var module = "ULD";
                $("div[id$='divareaTrans_shipment_shipmentnog']").remove();
                $("div[id$='divareaTrans_shipment_fwbshctemp']").remove();
                $.ajax({
                    url: "Services/ULD/ULDSupportRequestService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ULDSupportRequest/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divNewRequest").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("ULDSUPPORTREQUEST", "divNewRequest");
                            currentprocess = "ULDSUPPORTREQUEST";
                            CurrentSNo = 0;
                            EnterEmailAddress();
                            $("#divNewRequest").show();
                            $("#tblConsumableType").show();
                            $("#tblUldType").show();
                        }

                    }
                });
            });

            setTimeout(function () { PageRightsCheck() }, 800)
        }
    });

}
//Added by KK
var ButtonProcess = null;
function HighLightGridButton(obj, e) {
    if (ButtonProcess)
        $(ButtonProcess).removeAttr("style");

    $(obj).css({ "font-size": "15px", "box-shadow": "3px 3px 3px #000000", "border": "2px solid yellow" });
    ButtonProcess = obj;

}
function BindSubProcess() {

    AutoShipmentSearch(currentprocess);
    //$("#divULDSupportrequest").find("div[class='k-grid k-widget'] > div.k-grid-header > div > table > thead > tr > th:nth-child(2) > a.k-grid-filter > span").remove();
    // HighLightGridButton($(".k-grid").find("table tr").find("td:contains('" + (CurrentSNo == 0 ? "~" : CurrentSNo) + "')").closest("tr").find("input[process='" + currentprocess.toUpperCase() + "']"));

    var grid = $("#divULDSupportrequest div[data-role='grid']").data('kendoGrid');
    var pager = grid.pager;
    pager.unbind('change').bind('change', fn_pagechange);

    function fn_pagechange(e) {
        //CurrentSNo = 0;
    }
}
function AutoShipmentSearch(SubProcess) {

    //var gridPage = $(".k-pager-input").find("input").val();
    //var grid = $(".k-grid").data("kendoGrid");
    //grid.dataSource.page(gridPage);
    var a = false;
    $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
        if ($(e).text() == CurrentSNo) {
            //var SubProcess = "WEIGHINGMACHINE";
            //$(e).parent().find("[process=" + SubProcess + "]").click(); return false;
            a = true;
            BindEvents($(e).parent().find("[process=" + SubProcess.toUpperCase() + "]"), event); return false;
        }
    });
    if (a == false) {
        CleanUI();
    }
}
function ShowProcessDetails(subprocess, isdblclick, subprocesssno) {
    //if (subprocess.toUpperCase() == "ULDSUPPORTREQUEST") {
    //    $('#tabstrip ul:first li:eq(0) a').text("Uld Support Request");
    //}


    $.ajax({
        url: "Services/ULD/ULDSupportRequestService.svc/GetWebForm/" + _CURR_PRO_ + "/ULD/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divNewRequest").html(result);
            if (result != undefined || result != "") {

                GetProcessSequence("ULDSUPPORTREQUEST");
                InitializePage(subprocess, "divNewRequest", isdblclick, subprocesssno);
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
function BindEvents(obj, e, isdblclick) {
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    CurrentSNo = closestTr.find("td:eq(0)").text();
    //ShowProcessDetails("ULDSupportRequest", isdblclick, "2369");
    if (subprocess.toUpperCase() == 'ULDSUPPORTREQUESTASSIGNED') {
        ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    }
    else if (subprocess.toUpperCase() == 'ULDSUPPORTREQUESTPROCESSED') {
        ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    }
    else if (subprocess.toUpperCase() == 'ULDSUPPORTREQUESTCLOSED') {
        //$("#btnSave").show()
        $('#btnSave').attr('disabled', false);
        ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    }
    else if (subprocess.toUpperCase() == 'ULDSUPPORTREQUEST') {
        ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    }
    else if (subprocess.toUpperCase() == 'ULDSUPPORTREQUESTEDDETAIL') {
        $("#btnSave").hide();
        ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    }
}
function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno) {
    InstantiateControl(cntrlid);

    if (subprocess.toUpperCase() == "ULDSUPPORTREQUEST") {
        BindULDSUPPORTREQUEST();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                if (SaveFormData(subprocess)) {
                    ULDrequestSearch();
                    CleanUI();
                }
            } else {
                return false;
            }

        });
        PageRightsCheck()
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTASSIGNED") {
        BindULDSUPPORTASSIGNED();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                if (SaveFormData(subprocess)) {
                    ULDrequestSearch();
                    CleanUI();
                }
            } else {
                return false;
            }

        });
        PageRightsCheck()
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTPROCESSED") {
        BindULDSUPPORTREQUESTPROCESSED();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                if (SaveFormData(subprocess)) {
                    ULDrequestSearch();
                    CleanUI();
                }
            } else {
                return false;
            }

        });
        PageRightsCheck()
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTCLOSED") {
        BindULDSUPPORTREQUESTCLOSED();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                if (SaveFormData(subprocess)) {
                    ULDrequestSearch();
                    CleanUI();
                }
            } else {
                return false;
            }

        });
        PageRightsCheck()
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTEDDETAIL") {
        BindULDSUPPORTREQUESTEDDETAIL();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                if (SaveFormData(subprocess)) {
                    ULDrequestSearch();
                    CleanUI();
                }
            } else {
                return false;
            }

        });
        PageRightsCheck()
    }

    $("#btnCancel").unbind("click").bind("click", function () {
        $("#divClosed").hide();
        $("#divNewRequest").hide();
        $("#divUldType").hide();
        $("#tblConsumableType").hide();
        $("#divUldRequest").hide();
    });
    PageRightsCheck()
}
function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            $(this).css("text-align", "right");
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
            cfi.AlphabetTextBox(controlId, alphabetstyle);
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
function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
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
function BindULDSUPPORTASSIGNED() {
    cfi.AutoCompleteV2("ReqByAirport", "AirportCode,AirportName", "ULD_ULDSUPPORTASSIGNED", null, "contains");
    cfi.AutoCompleteV2("ReqToAirport", "AirportCode,AirportName", "ULD_ULDSUPPORTASSIGNED", null, "contains");
    $("#Text_ReqByAirport").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
    $("#Text_ReqByAirport").data("kendoAutoComplete").enable(false);
    $.ajax({
        url: "Services/ULD/ULDSupportRequestService.svc/GetULDSUPPORTREQUEST?SNo=" + CurrentSNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: CurrentSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var USRData = jQuery.parseJSON(result);
            var UData = USRData.Table0;
            if (UData.length > 0) {
                var Item = UData[0];
                $("#ReferenceNo").val(Item.ReferenceNo);
                $("#Text_ReqToAirport").data("kendoAutoComplete").setDefaultValue(Item.ReqToAirport, Item.Text_ReqToAirport);
                $("span[id=EmailAddress]").text(Item.EmailAddress);
                $("input[id=EmailAddress]").text(Item.EmailAddress);
            }
        }
    });
    BindUldGrid();
    BindConsumableGrid();

    //$("#EmailAddress").bind('keydown', function (e) {
    //    var keyCode = e.keyCode;
    //    if (e.keyCode == 13) {
    //        EnterEmailAddress();
    //    }

    //});
    $('#tblUldType button.insert,#tblUldType button.remove').hide();//#tblRateBase button.moveUp,#tblRateBase button.moveDown
    //Buttons at footer row
    $("#tblUldType button.removeLast").hide();
    $('#tblUldType button.append,#tblUldType button.removeLast').hide();

    $('#tblConsumableType button.insert,#tblConsumableType button.remove').hide();
    // Buttons at footer row
    $("#tblConsumableType button.removeLast").hide();
    $('#tblConsumableType button.append,#tblConsumableType button.removeLast').hide();
    $("tr[id^='tblUldType_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblUldType_UldTypeSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").attr("enabled", false);

        $(tr).find("input[id^='_temptblUldType_Qty_']").attr("disabled", true);
        $(tr).find("input[id^='tblUldType_Qty_']").attr("enabled", false);
    });
    $("tr[id^='tblConsumableType_Row']").each(function (row, tr) {

        $(tr).find("input[id^='tblConsumableType_ConsumableTypeSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblConsumableType_HdnConsumableTypeSNo_']").attr("enabled", false);

        $(tr).find("input[id^='_temptblConsumableType_CQty_']").attr("disabled", true);
        $(tr).find("input[id^='tblConsumableType_CQty_']").attr("enabled", false);
    });
    BindUldAssigned();
    $("#divUldType").show();
    $("#divConsumableType").show();
    $("#divAssigned").show();
    $("#divProcessed").hide();
    $("#divClosed").hide();
    $("#ReferenceNo").attr("disabled", true);
    $("#ReferenceNo").attr("enabled", true);
    $("#Text_ReqToAirport").attr("disabled", true);
    $("#ReqToAirport").attr("enabled", true);
}
function BindULDSUPPORTREQUEST() {
    cfi.AutoCompleteV2("ReqByAirport", "AirportCode,AirportName", "ULD_ULDSUPPORTASSIGNED", null, "contains");
    cfi.AutoCompleteV2("ReqToAirport", "AirportCode,AirportName", "ULD_ULDSUPPORTASSIGNED", null, "contains");

    if (userContext.AirportSNo == userContext.SysSetting.ULDControlid) {
        $("#Text_ReqByAirport").data("kendoAutoComplete").enable(true);
    }
    else {
        $("#Text_ReqByAirport").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
        $("#Text_ReqByAirport").data("kendoAutoComplete").enable(false);
    }
    $("#Text_ReqToAirport").data("kendoAutoComplete").setDefaultValue(userContext.SysSetting.ULDControlid, userContext.SysSetting.ULDControl);
    $("#Text_ReqToAirport").data("kendoAutoComplete").enable(false);



    BindUldGrid();
    BindConsumableGrid();
    //$("#EmailAddress").bind('keydown', function (e) {
    //    var keyCode = e.keyCode;
    //    if (e.keyCode == 13) {
    //        EnterEmailAddress();
    //    }
    //});
    $("#divUldType").show();
    $("#divConsumableType").show();
    $("#divAssigned").hide();
    $("#divProcessed").hide();
    $("#divClosed").hide();
}
function BindULDSUPPORTREQUESTPROCESSED() {
    BindUldProcessed();

    $("tr[id^='tblUldType_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblUldType_UldTypeSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").attr("enabled", false);

        $(tr).find("input[id^='_temptblUldType_Qty_']").attr("disabled", true);
        $(tr).find("input[id^='tblUldType_Qty_']").attr("enabled", false);
    });
    $("#divUldType").hide();
    $("#divConsumableType").hide();
    $("#divAssigned").hide();
    $("#divProcessed").show();
    $("#divClosed").hide();

}
function BindULDSUPPORTREQUESTCLOSED() {
    BindUldClosed();
    $("#divUldType").hide();
    $("#divConsumableType").hide();
    $("#divAssigned").hide();
    $("#divProcessed").hide();
    $("#divClosed").show();
}
function BindULDSUPPORTREQUESTEDDETAIL() {
    //  BindUldRequestedDetail();
    cfi.AutoCompleteV2("ReqByAirport", "AirportCode,AirportName", "ULD_ULDSUPPORTASSIGNED", null, "contains");
    cfi.AutoCompleteV2("ReqToAirport", "AirportCode,AirportName", "ULD_ULDSUPPORTASSIGNED", null, "contains");
    $("#Text_ReqByAirport").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
    $("#Text_ReqByAirport").data("kendoAutoComplete").enable(false);
    $.ajax({
        url: "Services/ULD/ULDSupportRequestService.svc/GetULDSUPPORTREQUEST?SNo=" + CurrentSNo, async: false, type: "get", dataType: "json", cache: false,
        // data: JSON.stringify({ SNo: CurrentSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var USRData = jQuery.parseJSON(result);
            var UData = USRData.Table0;
            if (UData.length > 0) {
                var Item = UData[0];
                $("#ReferenceNo").val(Item.ReferenceNo);
                $("#Text_ReqToAirport").data("kendoAutoComplete").setDefaultValue(Item.ReqToAirport, Item.Text_ReqToAirport);
                var textval = Item.EmailAddress;
                var l = textval.split(",").length;
                if (textval != "") {
                    for (var jk = 0; jk < l; jk++) {
                        $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                    }
                    $("#EmailAddress").val("");
                    $("#EmailAddress").removeAttr("required");
                }
                $("span[id=EmailAddress]").text(textval);
                $("input[id=EmailAddress]").text(textval);
                $("span[id=Remarks]").text(Item.Remarks);
            }
        }
    });
    BindUldGrid();
    BindConsumableGrid();
    //$("#EmailAddress").bind('keydown', function (e) {
    //    var keyCode = e.keyCode;
    //    if (e.keyCode == 13) {
    //        EnterEmailAddress();
    //    }

    //});
    $('#tblUldType button.insert,#tblUldType button.remove').hide();//#tblRateBase button.moveUp,#tblRateBase button.moveDown
    //Buttons at footer row
    $("#tblUldType button.removeLast").hide();
    $('#tblUldType button.append,#tblUldType button.removeLast').hide();

    $('#tblConsumableType button.insert,#tblConsumableType button.remove').hide();
    // Buttons at footer row
    $("#tblConsumableType button.removeLast").hide();
    $('#tblConsumableType button.append,#tblConsumableType button.removeLast').hide();
    $("tr[id^='tblUldType_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblUldType_UldTypeSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").attr("enabled", false);

        $(tr).find("input[id^='_temptblUldType_Qty_']").attr("disabled", true);
        $(tr).find("input[id^='tblUldType_Qty_']").attr("enabled", false);
    });
    $("tr[id^='tblConsumableType_Row']").each(function (row, tr) {

        $(tr).find("input[id^='tblConsumableType_ConsumableTypeSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblConsumableType_HdnConsumableTypeSNo_']").attr("enabled", false);

        $(tr).find("input[id^='_temptblConsumableType_CQty_']").attr("disabled", true);
        $(tr).find("input[id^='tblConsumableType_CQty_']").attr("enabled", false);
    });

    $("#divUldType").show();
    $("#divConsumableType").show();
    $("#divAssigned").hide();
    $("#divProcessed").hide();
    $("#divClosed").hide();
    $("#ReferenceNo").attr("disabled", true);
    $("#ReferenceNo").attr("enabled", true);
    $("#Text_ReqToAirport").attr("disabled", true);
    $("#ReqToAirport").attr("enabled", true);

}
function EnterEmailAddress() {
    /****************************Add by Pankaj Kumar Ishwar*****************************/
    $("#EmailAddress").attr("placeholder", "PRESS SPACE KEY FOR ADDING EMAIL");
    divmail = $("<div id='divmailAdds' style='overflow:hidden'><ul id='addlist2' style='padding:0px 2px 0px 0px;margin-top:0px;'></ul></div>");
    //var spnlbl2 = $("<span class='k-label'><strong>(Press space key to  add New E-mail ( If Required))</strong></span>");
    //$("#EmailAddress").after(spnlbl2);
    if ($("#divmailAdds").length === 0)
        $("#EmailAddress").after(divmail);
    SetnewEMail()
}
function SetnewEMail() {
    $("#EmailAddress").keyup(function (e) {
        var addlen = $("#EmailAddress").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    var listlen = $("ul#addlist2 li").length;
                    $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                    $("#EmailAddress").val('');
                }
                else {
                    ShowMessage('warning', 'Warning', "Please enter valid Email Address", "bottom-right");
                }
            }
        }
        else
            e.preventDefault();
    });
    $("#EmailAddress").blur(function () {
        $("#EmailAddress").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    }); $("#EmailAddress").val("");
}
function removeEMail(Obj) {
    var lastspn = Obj.parentElement.id;
    var lastspan_ = parseFloat(lastspn.substr(0, 8));
    $("span[id='" + lastspn + "']").remove();
}
function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}
function BindUldGrid() {
    var dbtableName = "UldType";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/ULD/ULDSupportRequestService.svc",
        getRecordServiceMethod: "GetUldType",
        deleteServiceMethod: "",
        caption: "ULD Type Reuqest",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'UldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'ULD_UldGrid', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: true },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblUldType_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblUldType_UldTypeSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").attr("data-valid", "required");

                $(tr).find("input[id^='_temptblUldType_Qty_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblUldType_Qty_']").attr("data-valid", "required");
            });
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false }
    });
    $("tr[id^='tblUldType_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblUldType_UldTypeSNo_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").attr("data-valid", "required");

        $(tr).find("input[id^='_temptblUldType_Qty_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblUldType_Qty_']").attr("data-valid", "required");
    });
}
function BindConsumableGrid() {
    var dbtableName = "ConsumableType";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/ULD/ULDSupportRequestService.svc",
        getRecordServiceMethod: "GetConsumableType",
        deleteServiceMethod: "",
        caption: "Consumable Type Request",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'ConsumableTypeSNo', display: 'Consumable', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportConsumableGrid', filterField: 'ConsumablesName', filterCriteria: "contains" },
            { name: "CQty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblConsumableType_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblConsumableType_ConsumableTypeSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblConsumableType_HdnConsumableTypeSNo_']").attr("data-valid", "required");

                $(tr).find("input[id^='_temptblConsumableType_CQty_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblConsumableType_CQty_']").attr("data-valid", "required");
            });
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false }
    });
    $("tr[id^='tblConsumableType_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblConsumableType_ConsumableTypeSNo_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblConsumableType_HdnConsumableTypeSNo_']").attr("data-valid", "required");

        $(tr).find("input[id^='_temptblConsumableType_CQty_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblConsumableType_CQty_']").attr("data-valid", "required");
    });
}
function BindUldAssigned() {
    var dbtableName = "Assigned";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/ULD/ULDSupportRequestService.svc",
        getRecordServiceMethod: "GetUldAssigned",
        deleteServiceMethod: "",
        caption: "ULD Support Request Assigned",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'AUldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'ULD_SupportAssignedGrid', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: true },
            { name: 'AssignToAirportSNo', display: 'Assign To', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'ULD_SupportAirportCode', filterField: 'AirportCode', filterCriteria: "contains" },
            { name: "ULD", display: "Action", type: "label", value: "ULD", ctrlCss: { width: "50px" } }

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblAssigned_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblAssigned_AUldTypeSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAssigned_HdnAUldTypeSNo_']").attr("data-valid", "required");

                $(tr).find("input[id^='_temptblAssigned_Qty_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAssigned_Qty_']").attr("data-valid", "required");

                $(tr).find("input[id^='tblAssigned_AssignToAirportSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAssigned_HdnAssignToAirportSNo_']").attr("data-valid", "required");
            });
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false }
    });
    $("tr[id^='tblAssigned_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblAssigned_AUldTypeSNo_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblAssigned_HdnAUldTypeSNo_']").attr("data-valid", "required");

        $(tr).find("input[id^='_temptblAssigned_Qty_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblAssigned_Qty_']").attr("data-valid", "required");

        $(tr).find("input[id^='tblAssigned_AssignToAirportSNo_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblAssigned_HdnAssignToAirportSNo_']").attr("data-valid", "required");
    });
}
function BindUldProcessed() {
    var dbtableName = "Processed";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/ULD/ULDSupportRequestService.svc",
        getRecordServiceMethod: "GetUldProcessed",
        deleteServiceMethod: "",
        caption: "ULD Support Request Processed",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'PUldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_UldGrid', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: "AQty", display: "Actual Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: 'AssignToAirportSNo', display: 'Assign To', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportUldClose', filterField: 'AirportCode', filterCriteria: "contains" },
            { name: "Remark", display: "Remark", type: "text", ctrlAttr: { onBlur: "", controltype: "alphanumeric", maxlength: 500 }, ctrlCss: { width: "200px" }, isRequired: true },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblProcessed_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblProcessed_Remark_']").attr("data-valid", "required");

            });
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false }
    });
    $("tr[id^='tblProcessed_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblProcessed_PUldTypeSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblProcessed_HdnPUldTypeSNo_1']").attr("enabled", false);

        $(tr).find("input[id^='_temptblProcessed_Qty_']").attr("disabled", true);
        $(tr).find("input[id^='tblProcessed_Qty_']").attr("enabled", false);

        $(tr).find("input[id^='_temptblProcessed_AQty_']").attr("disabled", true);
        $(tr).find("input[id^='tblProcessed_AQty_']").attr("enabled", false);

        $(tr).find("input[id^='tblProcessed_AssignToAirportSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblProcessed_HdnAssignToAirportSNo_']").attr("enabled", false);

        $(tr).find("input[id^='tblProcessed_Remark_']").attr("data-valid", "required");
    });
}
function BindUldClosed() {
    $("#btnSave").show();
    // $("#btnSave").attr("disabled", false);
    var dbtableName = "Closed";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/ULD/ULDSupportRequestService.svc",
        getRecordServiceMethod: "GetUldClosed",
        deleteServiceMethod: "DeleteClosedremarksSlab",
        caption: "ULD Support Request Closed",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'CUldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_UldGrid', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: "AQty", display: "Actual Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: 'AssignToAirportSNo', display: 'Assign To', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportUldClose', filterField: 'AirportCode', filterCriteria: "contains" },
            { name: "Remark", display: "Remark", type: "text", ctrlAttr: { onBlur: "", controltype: "alphanumeric", maxlength: 500 }, ctrlCss: { width: "200px" }, isRequired: false },
            { name: 'InitiateRemarks', display: 'Initiate Remarks', type: 'label', ctrlAttr: { controltype: 'label', onblur: '' }, ctrlCss: { width: '350px', height: '30px' }, isRequired: false },
            { name: "CloseRemark", display: "Closed Remark", type: "text", ctrlAttr: { onBlur: "", controltype: "alphanumeric", maxlength: 500 }, ctrlCss: { width: "200px" }, isRequired: true },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblClosed_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblClosed_CloseRemark_']").attr("data-valid", "required");

            });
        },
        isPaging: false,
        hideButtons: { remove: true, removeLast: true, insert: true, append: true, updateAll: true }
    });
    $("tr[id^='tblClosed_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblClosed_CUldTypeSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblClosed_HdnCUldTypeSNoo_1']").attr("enabled", false);

        $(tr).find("input[id^='_temptblClosed_Qty_']").attr("disabled", true);
        $(tr).find("input[id^='tblClosed_Qty_']").attr("enabled", false);

        $(tr).find("input[id^='_temptblClosed_AQty_']").attr("disabled", true);
        $(tr).find("input[id^='tblClosed_AQty_']").attr("enabled", false);

        $(tr).find("input[id^='tblClosed_AssignToAirportSNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblClosed_HdnAssignToAirportSNo_']").attr("enabled", false);

        $(tr).find("input[id^='tblClosed_Remark_']").attr("disabled", true);
        $(tr).find("input[id^='tblClosed_Remark_']").attr("enabled", false);

        $(tr).find("input[id^='tblClosed_CloseRemark_']").attr("data-valid", "required");
    });
}
//akaram
function BindUldRequestedDetail() {
}
//
function ULDrequestSearch() {

    if (_CURR_PRO_ == "ULDSupportRequest") {
        cfi.ShowIndexView("divULDSupportrequest", "Services/ULD/ULDSupportRequestService.svc/GetGridData/" + _CURR_PRO_ + "/ULD/ULDSupportRequest");
    }
    // Remove extra blank row
    if ($("#divULDSupportrequest > table > tbody >tr:eq(1)").attr("align") != "") {
        $("#divULDSupportrequest > table > tbody >tr:eq(1)").remove();
    }
}
function SaveFormData(subprocess) {
    var issave = false;

    if (subprocess.toUpperCase() == "ULDSUPPORTREQUEST") {
        issave = SaveULDSupportRequest();
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTASSIGNED") {
        issave = SaveULDSupportRequestAssigned();
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTPROCESSED") {
        issave = SaveULDSupportRequestProcessed();
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTCLOSED") {
        issave = SaveULDSupportRequestCLosed();
    }
    return issave;
}
var EMails = "";
function SaveULDSupportRequest() {
    var ULDSupportRequestarray = [];
    var ULDTypesarray = [];
    var ConsumableTypearray = [];
    //$("ul#addlist1 li").each(function (row, li)
    //{
    //    if ($("ul#addlist1 li").length == 1)
    //    {
    //        EMails = $(li).find("span[class='k-icon k-delete remove']").attr("id");
    //    }
    //    else if ($("ul#addlist1 li").length == 0)
    //    {
    //        EMails = $(li).find("span[class='k-icon k-delete remove']").attr("id");
    //    }
    //    else
    //    {
    //        if (EMails == "")
    //        {
    //            EMails = $(li).find("span[class='k-icon k-delete remove']").attr("id");
    //        }
    //        else
    //        {
    //            EMails = EMails + ',' + $(li).find("span[class='k-icon k-delete remove']").attr("id");
    //        }
    //    }
    //});

    var k = ''; var L = ''; var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++) { L = L + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#EmailAddress").val(L.substring(0, L.length - 1));

    var ULDSupportRequestModel =
        {
            SNo: CurrentSNo || 0,
            ReferenceNo: "",
            ReqByAirport: $("#ReqByAirport").val() | 0,
            ReqToAirport: $("#ReqToAirport").val(),
            EmailAddress: $("#EmailAddress").val(),
        }
    ULDSupportRequestarray.push(ULDSupportRequestModel);
    var Remarks = $("#Remarks").val()//$('#Remarks').val();

    $("tr[id^='tblUldType_Row']").each(function (row, tr) {
        var UldTypeViewModel = {
            SNo: CurrentSNo || 0,
            UldTypeSNo: $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").val() || 0,
            HdnUldTypeSNo: "",
            Qty: $(tr).find("input[id^='tblUldType_Qty_']").val() || ""
        }
        ULDTypesarray.push(UldTypeViewModel);

    });
    $("tr[id^='tblConsumableType_Row']").each(function (row, tr) {
        var ConsumableTypeViewModel = {
            SNo: CurrentSNo || 0,
            ConsumableTypeSNo: $(tr).find("input[id^='tblConsumableType_HdnConsumableTypeSNo_']").val() || 0,
            HdnConsumableTypeSNo: "",
            CQty: $(tr).find("input[id^='tblConsumableType_CQty_']").val() || ""
        }
        ConsumableTypearray.push(ConsumableTypeViewModel);
    });
    try {
        if ($("tr[id^='tblUldType_Row']").length == 0 && ($("tr[id^='tblConsumableType_Row']").length == 0)) {
            ShowMessage('warning', 'warning - Uld Support Request', "Please Add Any One (Uld type or Consumable)", "bottom-right");
            return false;
        }
        else {
            $("#btnSave").hide();
            $.ajax({
                url: "Services/ULD/ULDSupportRequestService.svc/SaveUSRDetais", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ USRSNo: CurrentSNo, ULDSRequest: ULDSupportRequestarray, USRULDType: ULDTypesarray, USRConsumableType: ConsumableTypearray, Remarks: Remarks }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != null) {

                        //  var MsgTable = jQuery.parseJSON(result);
                        //  var MsgData = MsgTable.Table0;
                        // if (MsgData[0].ErrorMessage == "Success")

                        var MsgTable = JSON.parse(result).Table0[0].ErrorMessage;
                        var Msg = MsgTable.substring(0, 7)
                        var refNo = MsgTable.substring(8, 30)
                        if (Msg == "Success") {
                            ShowMessage('success', 'Reference no.-' + refNo + '', "Uld Support Request details successfully saved.", "bottom-right");
                            _CURR_PRO_ == "ULDSupportRequest";
                            ULDrequestSearch();
                            $("#divUldType").hide();
                            $("#divConsumableType").hide();
                            $("#divAssigned").hide();
                            $("#divProcessed").hide();
                            $("#divClosed").hide();
                            $("#btnSave").show();
                            $('#btnSave').attr("disabled", true);

                        }
                        else {
                            $("#btnSave").show();
                            ShowMessage('warning', 'warning - Uld Support Request', "unable to process", "bottom-right");
                        }
                    }
                    else {
                        $("#btnSave").show();
                        ShowMessage('warning', 'warning - Uld Support Request', "unable to process", "bottom-right");
                    }
                }
            });
        }

    }
    catch (ex) {

    }
}
function SaveULDSupportRequestAssigned() {
    var ULDTypesarray = [];
    $("tr[id^='tblAssigned_Row']").each(function (row, tr) {
        var UldTypeViewModel = {
            SNo: CurrentSNo || 0,
            AUldTypeSNo: $(tr).find("input[id^='tblAssigned_HdnAUldTypeSNo_']").val() || 0,
            HdnUldTypeSNo: "",
            Qty: $(tr).find("input[id^='tblAssigned_Qty_']").val() || "",
            AssignToAirportSNo: $(tr).find("input[id^='tblAssigned_HdnAssignToAirportSNo_']").val() || 0,
            HdnAssignToAirportSNo: ""
        }
        ULDTypesarray.push(UldTypeViewModel);
    });
    try {
        if ($("tr[id^='tblAssigned_Row']").length == 0) {
            ShowMessage('warning', 'Warning - Uld Support Request', "Please Assign Any One ULD Type", "bottom-right");
            return false;
        }
        else {
            $("#btnSave").hide();
            $.ajax({
                url: "Services/ULD/ULDSupportRequestService.svc/SaveUSRAssignDetais", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ USRSNo: CurrentSNo, USRULDType: ULDTypesarray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != null) {
                        var MsgTable = jQuery.parseJSON(result);
                        var MsgData = MsgTable.Table0;
                        if (MsgData[0].ErrorMessage == "Success") {
                            ShowMessage('success', 'Success - Uld Support Request Assigned', "Uld details successfully assigned.", "bottom-right");
                            _CURR_PRO_ == "ULDSupportRequest";
                            ULDrequestSearch();
                            $("#btnSave").show();
                        }
                        else {
                            $("#btnSave").show();
                            ShowMessage('warning', 'Warning - Uld Support Request Assigned', "unable to process", "bottom-right");
                        }
                    }
                    else {
                        $("#btnSave").show();
                        ShowMessage('warning', 'Warning - Uld Support Request Assigned', "unable to process", "bottom-right");
                    }
                }
            });
        }

    }
    catch (ex) {

    }
}
function SaveULDSupportRequestProcessed() {
    var ULDTypesarray = [];
    $("tr[id^='tblProcessed_Row']").each(function (row, tr) {
        var UldTypeViewModel = {
            SNo: $(tr).find("input[id^='tblProcessed_SNo_']").val() || 0,
            Remark: $(tr).find("input[id^='tblProcessed_Remark_']").val() || "",
        }
        ULDTypesarray.push(UldTypeViewModel);
    });
    $("#btnSave").hide();
    $.ajax({
        url: "Services/ULD/ULDSupportRequestService.svc/UpdateProcessremarks", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ USRSNo: CurrentSNo, USRProcessedRemarks: ULDTypesarray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].ErrorMessage == "Success") {
                    ShowMessage('success', 'Success - Uld Support Request Processed', "Remarks details successfully saved.", "bottom-right");
                    _CURR_PRO_ == "ULDSupportRequest";
                    ULDrequestSearch();
                    $("#btnSave").show();
                }
                else {
                    $("#btnSave").show();
                    ShowMessage('warning', 'Warning - Uld Support Request Processed', "unable to process", "bottom-right");
                }
            }
            else {
                $("#btnSave").show();
                ShowMessage('warning', 'Warning - Uld Support Request Processed', "unable to process", "bottom-right");
            }
        }
    });
}
function SaveULDSupportRequestCLosed() {
    var ULDTypesarray = [];
    $("tr[id^='tblClosed_Row']").each(function (row, tr) {
        var UldTypeViewModel = {
            SNo: $(tr).find("input[id^='tblClosed_SNo_']").val() || 0,
            CloseRemark: $(tr).find("input[id^='tblClosed_CloseRemark_']").val() || "",
        }
        ULDTypesarray.push(UldTypeViewModel);
    });
    $("#btnSave").hide();
    $.ajax({
        url: "Services/ULD/ULDSupportRequestService.svc/UpdateClosedremarks", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ USRSNo: CurrentSNo, USRClosedRemarks: ULDTypesarray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].ErrorMessage == "Success") {
                    ShowMessage('success', 'Success - Uld Support Request Closed', "Closed Remarks details successfully saved.", "bottom-right");
                    _CURR_PRO_ == "ULDSupportRequest";
                    ULDrequestSearch();
                    BindUldClosed();
                    $('#btnSave').attr('disabled', true);
                }
                else {
                    $("#btnSave").show();
                    ShowMessage('warning', 'Warning - Uld Support Request Closed', "unable to process", "bottom-right");
                }
            }
            else {
                $("#btnSave").show();
                ShowMessage('warning', 'Warning - Uld Support Request Closed', "unable to process", "bottom-right");
            }
        }
    });
}
function ExtraCondition(textId) {

    var filterReqTo = cfi.getFilter("AND");
    if (textId.indexOf("Text_ReqToAirport") >= 0) {
        var ReqToFilter = cfi.getFilter("AND");
        cfi.setFilter(ReqToFilter, "SNo", "notin", $("#ReqByAirport").val());
        filterReqTo = cfi.autoCompleteFilter(ReqToFilter);
        return filterReqTo;
    }
    //CGK can request for ULD to other City (commented by CS)
    //else
    //    if (textId.indexOf("Text_ReqByAirport") >= 0) {
    //        var ReqToFilter = cfi.getFilter("AND");
    //        cfi.setFilter(ReqToFilter, "SNo", "notin", $("#ReqToAirport").val());
    //        filterReqTo = cfi.autoCompleteFilter(ReqToFilter);
    //        return filterReqTo;
    //    }

    if (textId.indexOf("tblAssigned_AUldTypeSNo") >= 0) {
        var ReqToFilter = cfi.getFilter("AND");
        cfi.setFilter(ReqToFilter, "ULDSupportRequestSNo", "eq", CurrentSNo);
        filterReqTo = cfi.autoCompleteFilter(ReqToFilter);
        return filterReqTo;
    }
    if (textId.indexOf("tblAssigned_AssignToAirportSNo") >= 0) {
        var ReqToFilter = cfi.getFilter("AND");
        cfi.setFilter(ReqToFilter, "SNo", "notin", $("#ReqByAirport").val());
        filterReqTo = cfi.autoCompleteFilter(ReqToFilter);
        return filterReqTo;
    }
    //if (textId.indexOf("tblUldType_UldTypeSNo") >= 0)
    //{
    //    var ReqToFilter = cfi.getFilter("AND");
    //    cfi.setFilter(ReqToFilter, "AirlineSno", "eq", 1);
    //    filterReqTo = cfi.autoCompleteFilter(ReqToFilter);
    //    return filterReqTo;

    //}
    if (textId.indexOf("tblUldType_UldTypeSNo") >= 0) {
        var ULDType = 0;
        $("tr[id^='tblUldType_Row_']").each(function (row, tr) {
            ULDType = ULDType + ',' + $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").val();
        });
        var UldTypeFilter = cfi.getFilter("AND");
        cfi.setFilter(UldTypeFilter, "SNo", "notin", ULDType);
        cfi.setFilter(UldTypeFilter, "AirlineSno", "eq", 1);
        filterUldTypeSNo = cfi.autoCompleteFilter(UldTypeFilter);
        return filterUldTypeSNo;
    }
    if (textId.indexOf("tblConsumableType_ConsumableTypeSNo_") >= 0) {
        var ConsumableType = 0;
        $("tr[id^='tblConsumableType_Row_']").each(function (row, tr) {
            ConsumableType = ConsumableType + ',' + $(tr).find("input[id^='tblConsumableType_HdnConsumableTypeSNo_']").val();
        });
        var ConsumableTypeFilter = cfi.getFilter("AND");
        cfi.setFilter(ConsumableTypeFilter, "SNo", "notin", ConsumableType);
        filterConsumableType = cfi.autoCompleteFilter(ConsumableTypeFilter);
        return filterConsumableType;
    }

}
function checkProgrss(item, subprocess, displaycaption) {

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_P") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_F") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_2_F") >= 0) {
        return "\"partialprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }
}
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divULDSupportrequest' style='width:100%'></div><div id='divNewRequest' style='width:100%'></div><div id='divUldType' style='width:100%' validateonsubmit='true'><table id='tblUldType' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divConsumableType' style='width:100%'  validateonsubmit='true'><table id='tblConsumableType' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divProcessed' style='width:100%'  validateonsubmit='true'><table id='tblProcessed' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divAssigned' style='width:100%'  validateonsubmit='true'><table id='tblAssigned' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divClosed' style='width:100%'  validateonsubmit='true'><table id='tblClosed' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divRequest' style='width:100%'  validateonsubmit='true'><table id='tblRequest' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li></ul> <div> <div id='divDetail'></div></div></div></div></div></td></tr></table> </td></tr></table></div>";
var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
    "</tr></tbody></table> </div>";
var YesReady = false;
function PageRightsCheck() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Apps.toString().toUpperCase() == "ULDSUPPORTREQUEST") {      
                if (i.Apps.toString().toUpperCase() == "ULDSUPPORTREQUEST" && i.PageRight == "New") {
                    YesReady = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "ULDSUPPORTREQUEST" && i.PageRight == "Edit") {
                    YesReady = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "ULDSUPPORTREQUEST" && i.PageRight == "Delete") {
                    YesReady = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read"){
                    YesReady = true;
                    return
                }  
        }
    });

    if (YesReady) {
        $("#btnSave").hide();
        $("#btnNew").hide();
        $("#btnCancel").hide();
        $("#btnSaveToNext").hide();
    }
}