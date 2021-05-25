$(document).ready(function () {
    ULDSupportRequest();
});
var paymentList = null;
var currentprocess = "";
var CurrentSNo = 0;
var _CURR_PRO_ = "";
var _CURR_OP_ = "";
function GetProcessSequence(processName) {
    $.ajax({
        url: "Services/ULD/ULDSupportAssignedService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
    $("#tblShipmentInfo").hide();
    $("#divNewRequest").html("");
    $("#btnSave").unbind("click");
    $("#btnSaveToNext").unbind("click");
}
function ULDSupportRequest() {
    _CURR_PRO_ = "ULDSupportAssigned";
    _CURR_OP_ = "ULD Support Assigned";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divULDSupportrequest").html("");
    CleanUI();
    $.ajax({
        url: "Services/ULD/ULDSupportAssignedService.svc/GetWebForm/" + _CURR_PRO_ + "/ULD/ULDSupportAssigned/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
                CleanUI();
                CurrentSNo = 0;
                HighLightGridButton(this.event);
                var module = "ULD";
                $("div[id$='divareaTrans_shipment_shipmentnog']").remove();
                $("div[id$='divareaTrans_shipment_fwbshctemp']").remove();
                $.ajax({
                    url: "Services/ULD/ULDSupportAssignedService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ULDSupportAssigned/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divNewRequest").html(result);

                        if (result != undefined || result != "") {
                            InitializePage("ULDSUPPORTASSIGNED", "divNewRequest");
                            currentprocess = "ULDSUPPORTASSIGNED";
                            CurrentSNo = 0;
                        }
                    }
                });

            });
            setTimeout(function () { PageRightsCheck() }, 200)
        }
    });
}
//Added by KK
var ButtonProcess = null;
function HighLightGridButton(obj, e) {
    $("#divNewRequest").show();
    $("#tblUldType").show();
    $("#tblAssigned").show();
    $("#tblConsumableType").show();
    if (ButtonProcess)
        $(ButtonProcess).removeAttr("style");
    $(obj).css({ "font-size": "15px", "box-shadow": "3px 3px 3px #000000", "border": "2px solid yellow" });
    ButtonProcess = obj;
    $('#btnSave').attr("disabled", false);
}
function BindSubProcess() {
    AutoShipmentSearch(currentprocess);
    var grid = $("#divULDSupportrequest div[data-role='grid']").data('kendoGrid');
    var pager = grid.pager;
    pager.unbind('change').bind('change', fn_pagechange);
    function fn_pagechange(e) {
        //CurrentSNo = 0;
    }
}
function AutoShipmentSearch(SubProcess) {
    var a = false;
    $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
        if ($(e).text() == CurrentSNo) {
            a = true;
            BindEvents($(e).parent().find("[process=" + SubProcess.toUpperCase() + "]"), event); return false;
        }
    });
    if (a == false) {
        CleanUI();
    }
}
function ShowProcessDetails(subprocess, isdblclick, subprocesssno) {
    $.ajax({
        url: "Services/ULD/ULDSupportAssignedService.svc/GetWebForm/" + _CURR_PRO_ + "/ULD/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
var RequestStatus = "";
function BindEvents(obj, e, isdblclick) {
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    CurrentSNo = closestTr.find("td:eq(0)").text();
    RequestStatus = closestTr.find("td:eq(4)").text();

    if (subprocess.toUpperCase() == 'ULDSUPPORTREQUESTASSIGNED') {
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
            }
            else {
                return false;
            }
        });
    }
    else if (subprocess.toUpperCase() == "ULDSUPPORTREQUESTASSIGNED") {
        BindULDSUPPORTASSIGNED();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection("tblAssigned")) {
                if (SaveFormData(subprocess)) {
                    ULDrequestSearch();
                    CleanUI();
                }
            }
            else {
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
            }
            else {
                return false;
            }

        });
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
    }
    $("#btnCancel").unbind("click").bind("click", function () {
        $("#divNewRequest").hide();
        $("#divUldType").hide();
        $("#tblConsumableType").hide();
    });
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
function BindULDSUPPORTASSIGNED() {
    cfi.AutoCompleteV2("ReqByAirport", "AirportCode,AirportName", "ULD_SupportAirportCode", null, "contains");
    cfi.AutoCompleteV2("ReqToAirport", "AirportCohttp://localhost:3139/Default.cshtml?Module=ULD&Apps=ULDSUPPORTASSIGNED&FormAction=INDEXVIEW#de,AirportName", "ULD_SupportAirportCode", null, "contains");
    $.ajax({
        url: "Services/ULD/ULDSupportAssignedService.svc/GetULDSUPPORTREQUEST?SNo=" + CurrentSNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: CurrentSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var USRData = jQuery.parseJSON(result);
            var UData = USRData.Table0;
            if (UData.length > 0) {
                var Item = UData[0];
                $("#ReferenceNo").val(Item.ReferenceNo);
                $("#Text_ReqToAirport").data("kendoAutoComplete").setDefaultValue(Item.ReqToAirport, Item.Text_ReqToAirport);
                $("#Text_ReqByAirport").data("kendoAutoComplete").setDefaultValue(Item.ReqbyAirport, Item.Text_ReqbyAirport);
                $("span[id=EmailAddress]").text(Item.EmailAddress);
                $("input[id=EmailAddress]").text(Item.EmailAddress);
                $("span[id=Remarks]").text(Item.Remarks);
            }
        }
    });
    BindUldGrid();
    BindConsumableGrid();
    $("#EmailAddress").bind('keydown', function (e) {
        var keyCode = e.keyCode;
        if (e.keyCode == 13) {
            EnterEmailAddress();
        }

    });
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
    ///  $("#Text_ReqToAirport").attr("disabled", true);
    // $("#Text_ReqByAirport").attr("disabled", true);
    $("#ReqToAirport").attr("enabled", true);

    $("#Text_ReqToAirport").data("kendoAutoComplete").enable(false);
    $("#Text_ReqByAirport").data("kendoAutoComplete").enable(false);

    if (RequestStatus == "CLOSED") {
        $("tr[id^='tblUldType_Row']").each(function (row, tr) {
            $(tr).find("input[id^='tblUldType_CheckAvailability_']").attr("disabled", true);

        });
    }
}
function BindULDSUPPORTREQUEST() {
    cfi.AutoCompleteV2("ReqByAirport", "AirportCode,AirportName", "ULD_SupportAirportCode", null, "contains");
    cfi.AutoCompleteV2("ReqToAirport", "AirportCode,AirportName", "ULD_SupportAirportCode", null, "contains");
    $("#Text_ReqByAirport").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
    $("#Text_ReqByAirport").data("kendoAutoComplete").enable(false);
    BindUldGrid();
    BindConsumableGrid();
    $("#EmailAddress").bind('keydown', function (e) {
        var keyCode = e.keyCode;
        if (e.keyCode == 13) {
            EnterEmailAddress();
        }
    });
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
function EnterEmailAddress() {
    var Email = $("#EmailAddress").val();
    if ($("ul#addlist1").length == 0) {

        $("#EmailAddress").after("<ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul>");
    }

    if (Email != "") {
        if (ValidateEMail(Email)) {
            $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + Email + " </span><span id='" + Email + "' class='k-icon k-delete remove'></span></li>");
            $("body").on("click", ".remove", function () {
                $(this).closest("li").remove();
            });
            $("#EmailAddress").val("");
        }
        else {
            alert("Please Enter valid Email address");
        }
    }
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
        servicePath: "./Services/ULD/ULDSupportAssignedService.svc",
        getRecordServiceMethod: "GetUldType",
        deleteServiceMethod: "",
        caption: "ULD Type Request",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'UldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'ULD_UldGrid', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: true },

            { name: "CheckAvailability", display: "Check Availability", type: "button", ctrlAttr: { onBlur: "", controltype: "button", onclick: "return CheckAvailabilty(this.id);" }, ctrlCss: { width: "60px" } },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblUldType_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblUldType_UldTypeSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblUldType_HdnUldTypeSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblUldType_CheckAvailability_']").attr('value', 'Check');
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
        $(tr).find("input[id^='tblUldType_CheckAvailability_']").attr('value', 'Check');
        $(tr).find("input[id^='_temptblUldType_Qty_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblUldType_Qty_']").attr("data-valid", "required");
    });
}
var ULDType = "";
var count = 0;
function CheckAvailabilty(input) {
    var ClosestTr = $("#" + input).closest("tr")
    var ReqQty = ClosestTr.find("input[id^='tblUldType_Qty']").val();
    var ReqHdnUldTypeSNo = ClosestTr.find("input[id^='tblUldType_HdnUldTypeSNo']").val();


    if (count == 0) {
        $("#tblUldTypeCheckAvailability").append("<div ><form ><table class='WebFormTable' id='tblCheckULDAvailability' validateonsubmit='true'></table><table><tr><td style='text-align: right; '><input type=button class='btn btn-block btn-success btn-sm' id='btnSelect' value='Select' height:'100px' onclick='AssignedULD(" + ReqQty + "," + ReqHdnUldTypeSNo + ");'/></td></tr></table></form></div>");
        count++;
    }
    //var DailyFlightNo = ClosestTr.find("input[id^='tblUCMInOutAlert_DailyFlightNo'").val();
    BindULDCheckAvailability(input);
    cfi.PopUp("tblUldTypeCheckAvailability", "Check ULD Type Details", "900");
    $("#txtMessageType").remove();
    $('#Re_execute').remove();

}
var AssignedULDarr = [];
var AssignedULDViewModel = [];
function AssignedULD(ReqQty, ReqHdnUldTypeSNo) {
    var totalAssignQTY = 0;
    var totalQTYOfAssign = 0;
    var tassignedQTY = 0;
    $("tr[id^='tblCheckULDAvailability_Row_']").each(function (row, tr) {

        AssignedULDViewModel = {

            HdnAUldTypeSNo: $(tr).find("input[id^='tblCheckULDAvailability_ULDSNo_']").val(),
            AUldTypeSNo: $(tr).find("input[id^='tblCheckULDAvailability_hdnULDCode_']").val(),
            HdnAssignToAirportSNo: $(tr).find("input[id^='tblCheckULDAvailability_hdnAirportSno_']").val(),
            AssignToAirportSNo: $(tr).find("input[id^='tblCheckULDAvailability_hdnAirport_']").val(),
            Qty: $(tr).find("input[id^='tblCheckULDAvailability_AssignULD_']").val(),
        }
        if ($(tr).find("input[id^='tblCheckULDAvailability_AssignULD_']").val() != "") {
            totalAssignQTY += parseInt($(tr).find("input[id^='tblCheckULDAvailability_AssignULD_']").val());
        }
        if (AssignedULDViewModel.Qty > 0) {
            AssignedULDarr.push(AssignedULDViewModel);
        }
    });
    if (totalAssignQTY <= ReqQty) {
        $("#tblUldTypeCheckAvailability").data("kendoWindow").close();
        $("tr[id^='tblAssigned_Row']").each(function (row, tr) {
            tassignedQTY += parseInt($(tr).find("input[id^='tblAssigned_Qty_']").val());
        });
        totalQTYOfAssign = totalAssignQTY + tassignedQTY;
        if (totalQTYOfAssign <= ReqQty) {
            $("#tblAssigned").appendGrid('load', AssignedULDarr);
        }
        else {
            ShowMessage('warning', 'Warning ', "Total Assign ULD QTY can not be greater than Total Requested QTY.");
            AssignedULDViewModel.Qty = [];
            AssignedULDarr = [];
        }
    }
    else {
        AssignedULDViewModel = [];
        AssignedULDarr = [];
        ShowMessage('warning', 'Warning ', "Assign ULD QTY can not be greater than Total Requested QTY.");
        return false;
    }
    cfi.ValidateSubmitSection = false;
    return true;
}
function validateULDQTY(input) {
    var ClosestTr = $("#" + input).closest("tr")
    var AssignULD = ClosestTr.find("input[id^='tblCheckULDAvailability_AssignULD'").val();
    var hdnTotalULD = ClosestTr.find("input[id^='tblCheckULDAvailability_hdnTotalULD'").val();
    ULDSupportRequestAssigned(input, ClosestTr)
    if (parseInt(AssignULD) > parseInt(hdnTotalULD)) {

        ClosestTr.find("input[id^='tblCheckULDAvailability_AssignULD'").attr('value', '');

        ShowMessage('warning', 'Warning ', "Assign ULD QTY can not be greater than Total QTY.");
        return false;

    }
    cfi.ValidateSubmitSection = false;
    return true;

}
function BindWhereCondition(input) {
    var ClosestTr = $("#" + input).closest("tr")
    return {
        ULDSNo: "'" + ClosestTr.find("input[id^='tblUldType_HdnUldTypeSNo'").val() + "'"
    };
}
function BindULDCheckAvailability(input) {
    var dbtableName = "CheckULDAvailability";
    $("#tbl" + dbtableName).appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1, itemsPerPage: 50, model: BindWhereCondition(input), sort: "",
        isGetRecord: true,
        servicePath: "./Services/ULD/ULDSupportAssignedService.svc",
        getRecordServiceMethod: "GetULDAvailability",
        deleteServiceMethod: "",
        caption: "ULD Availability",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: "hdnULDCode", type: "hidden" },
            { name: "hdnAirport", type: "hidden" },
            { name: "hdnAirportSno", type: "hidden" },
            { name: "ULDSNo", type: "hidden" },
            { name: "hdnTotalULD", type: "hidden" },
            { name: 'ULDCode', display: 'ULD Code', type: 'label', ctrlAttr: { controltype: "label" }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'Airport', display: 'Airport', type: 'label', ctrlAttr: { controltype: "label" }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'TotalULD', display: 'Total ULD', type: 'label', ctrlAttr: { controltype: "label" }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'RequiredULD', display: 'Total Required ULD', type: 'label', ctrlAttr: { controltype: "label" }, ctrlCss: { width: '50px', height: '20px' } },
            { name: 'Deviation', display: 'Deviation', type: 'label', ctrlAttr: { controltype: "label" }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'DeviationPercentage', display: 'Deviation %', type: 'label', ctrlAttr: { controltype: "label" }, ctrlCss: { width: '100px', height: '20px' } },
            {
                name: "AssignULD", display: "Assign ULD", type: "text", ctrlAttr: {
                    controltype: "number", maxlength: 8
                    , onchange: 'return validateULDQTY(this.id);'
                }, ctrlCss: { width: "120px" }

            },
            // { name: 'Select', display: 'Select', type: 'button', ctrlAttr: { controltype: 'button', onclick: "return AssignedULD(this.id);" }, ctrlCss: { width: '50px', height: '15px' } }
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblCheckULDAvailability_Row_']").each(function (row, tr) {
                $(tr).find("input[id^='tblCheckULDAvailability_Select_']").attr('value', 'Select');
                $(tr).find("input[id^='tblCheckULDAvailability_AssignULD_']").attr("data-valid", "required");
            });
        },
        isPaging: false,
        isExtraPaging: false,
        hideButtons: { remove: true, removeLast: true, insert: true, append: true, updateAll: true }
    });
    $("tr[id^='tblCheckULDAvailability_Row_']").each(function (row, tr) {
        $(tr).find("input[id^='tblCheckULDAvailability_Select_']").attr('value', 'Select');
        $(tr).find("input[id^='tblCheckULDAvailability_AssignULD_']").attr("data-valid", "required");
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
        servicePath: "./Services/ULD/ULDSupportAssignedService.svc",
        getRecordServiceMethod: "GetConsumableType",
        deleteServiceMethod: "",
        caption: "Consumable Type Request",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'ConsumableTypeSNo', display: 'Consumable', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportConsumableGrid', filterField: 'ConsumablesName', filterCriteria: "SNo" },
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
        tableColume: "ProceesedSNo,AUldTypeSNo,Qty,AssignToAirportSNo",
        servicePath: "./Services/ULD/ULDSupportAssignedService.svc",
        getRecordServiceMethod: "GetUldAssigned",
        deleteServiceMethod: "DeleteULDSupportRequestAssigned",
        caption: "ULD Support Request Assigned",
        initRows: 1,
        columns: [
            { name: "ProceesedSNo", type: "hidden" },
            { name: 'AUldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'ULD_SupportAssignedGrid', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: true },
            { name: 'AssignToAirportSNo', display: 'Assign To', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'ULD_SupportAssignedGrids', filterField: 'AirportCode', filterCriteria: "contains" },
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
        afterRowRemoved: function (tbWhole, rowIndex) {

            AssignedULDarr = [];
            AssignedULDViewModel = [];

        },
        isPaging: false,
        hideButtons: { remove: false, removeLast: true, insert: true, append: true, updateAll: true }
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
        servicePath: "./Services/ULD/ULDSupportAssignedService.svc",
        getRecordServiceMethod: "GetUldProcessed",
        deleteServiceMethod: "",
        caption: "ULD Support Request Processed",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'PUldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportUldProcessedGrids', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: "AQty", display: "Actual Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: 'AssignToAirportSNo', display: 'Assign To', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportUldProcessed', filterField: 'AirportCode', filterCriteria: "contains" },
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
    var dbtableName = "Closed";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/ULD/ULDSupportAssignedService.svc",
        getRecordServiceMethod: "GetUldClosed",
        deleteServiceMethod: "",
        caption: "ULD Support Request Closed",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
            { name: 'CUldTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportUldClosed', filterField: 'ULDName', filterCriteria: "contains" },
            { name: "Qty", display: "Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: "AQty", display: "Actual Quantity", type: "text", ctrlAttr: { onBlur: "", controltype: "number", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: false },
            { name: 'AssignToAirportSNo', display: 'Assign To', type: 'text', ctrlAttr: { onSelect: "", onBlur: "", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ULD_SupportUldClose', filterField: 'AirportCode', filterCriteria: "contains" },
            { name: "Remark", display: "Remark", type: "text", ctrlAttr: { onBlur: "", controltype: "alphanumeric", maxlength: 500 }, ctrlCss: { width: "200px" }, isRequired: false },
            { name: "CloseRemark", display: "Closed Remark", type: "text", ctrlAttr: { onBlur: "", controltype: "alphanumeric", maxlength: 500 }, ctrlCss: { width: "200px" }, isRequired: true },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblClosed_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblClosed_CloseRemark_']").attr("data-valid", "required");

            });
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false }
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
function ULDrequestSearch() {
    if (_CURR_PRO_ == "ULDSupportAssigned") {
        cfi.ShowIndexView("divULDSupportrequest", "Services/ULD/ULDSupportAssignedService.svc/GetGridData/" + _CURR_PRO_ + "/ULD/ULDSupportAssigned");
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
    var ULDTypesarray = [];
    var ConsumableTypearray = [];

    $("ul#addlist1 li").each(function (row, li) {
        if (EMails == "") {
            EMails = $(li).find("span[class='k-icon k-delete remove']").attr("id");
        }
        else {
            EMails = EMails + ',' + $(li).find("span[class='k-icon k-delete remove']").attr("id");
        }

    });
    var ULDSupportRequestModel = {
        SNo: CurrentSNo || 0,
        ReferenceNo: "",
        ReqByAirport: $("#ReqByAirport").val() | 0,
        ReqToAirport: $("#ReqToAirport").val(),
        EmailAddress: EMails,
    }

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
            ShowMessage('warning', 'Warning - Uld Support Request', "Please Add Any One (Uld type or Consumable)", "bottom-right");
            return false;
        }
        else {
            $("#btnSave").hide();
            $.ajax({
                url: "Services/ULD/ULDSupportAssignedService.svc/SaveUSRDetais", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ USRSNo: CurrentSNo, ULDSRequest: ULDSupportRequestModel, USRULDType: ULDTypesarray, USRConsumableType: ConsumableTypearray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != null) {
                        var MsgTable = jQuery.parseJSON(result);
                        var MsgData = MsgTable.Table0;
                        if (MsgData[0].ErrorMessage == "Success") {
                            ShowMessage('success', 'Success - Uld Support Request', "Uld Support Request details successfully saved.", "bottom-right");
                            _CURR_PRO_ == "ULDSupportRequest";
                            ULDrequestSearch();
                            $("#divUldType").hide();
                            $("#divConsumableType").hide();
                            $("#divAssigned").hide();
                            $("#divProcessed").hide();
                            $("#divClosed").hide();
                            $("#btnSave").show();
                        }
                        else {
                            $("#btnSave").show();
                            ShowMessage('warning', 'Warning - Uld Support Request', "unable to process", "bottom-right");
                        }
                    }
                    else {
                        $("#btnSave").show();
                        ShowMessage('warning', 'Warning - Uld Support Request', "unable to process", "bottom-right");
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
                url: "Services/ULD/ULDSupportAssignedService.svc/SaveUSRAssignDetais", async: false, type: "POST", dataType: "json", cache: false,
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
                            event.preventDefault();
                            $('#btnSave').attr("disabled", true);
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
        url: "Services/ULD/ULDSupportAssignedService.svc/UpdateProcessremarks", async: false, type: "POST", dataType: "json", cache: false,
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
        url: "Services/ULD/ULDSupportAssignedService.svc/UpdateClosedremarks", async: false, type: "POST", dataType: "json", cache: false,
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
                    $("#btnSave").show();
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
function AssignQtyCheck(id) {

}
function ULDSupportRequestAssigned(input, ClosestTr) {
    var ULDCode = ClosestTr.find("label[id^='tblCheckULDAvailability_ULDCode'").text();
    var Airport = ClosestTr.find("label[id^='tblCheckULDAvailability_Airport'").text();
    var TotalULD = ClosestTr.find("label[id^='tblCheckULDAvailability_TotalULD'").text();
    var Qty = 0;
    $("tr[id^='tblAssigned_Row']").each(function (row, tr) {

        var ULDCode1 = $(tr).find("input[id^='tblAssigned_AUldTypeSNo_']").val()
        var Airport1 = $(tr).find("input[id^='tblAssigned_AssignToAirportSNo_']").val()
        if (ULDCode == ULDCode1 && Airport == Airport1) {
            Qty += parseInt($(tr).find("input[id^='tblAssigned_Qty_']").val());
        }
        if (parseInt(Qty) == parseInt(TotalULD)) {
            ShowMessage('warning', 'Warning ', "Assigned ULD QTY Can't Be More Than Total ULD QTY.");
            ClosestTr.find("input[id^='tblCheckULDAvailability_AssignULD'").attr('value', '');

        }
    });
}
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divULDSupportrequest' style='width:100%'></div><div id='divNewRequest' style='width:100%'></div><div id='divUldType' style='width:100%'   validateonsubmit='true'><table id='tblUldType' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table><div id='divUldTypeCheckAvailability' style='width:100%;overflow: hidden;'   validateonsubmit='true'><table id='tblUldTypeCheckAvailability' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divConsumableType' style='width:100%'  validateonsubmit='true'><table id='tblConsumableType' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divProcessed' style='width:100%'  validateonsubmit='true'><table id='tblProcessed' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divAssigned' style='width:100%'  validateonsubmit='true'><table id='tblAssigned' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div><div id='divClosed' style='width:100%'  validateonsubmit='true'><table id='tblClosed' class='WebFormTable appendGrid ui-widget' validateonsubmit='true' class='WebFormTable'></table></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li></ul> <div> <div id='divDetail'></div></div></div></div></div></td></tr></table> </td></tr></table> </div>";
var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
    "</tr></tbody></table> </div>";
var YesReady = false;
function PageRightsCheck() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Apps.toString().toUpperCase() == "ULDSUPPORTASSIGNED") {
            if (i.Apps.toString().toUpperCase() == "ULDSUPPORTASSIGNED" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "ULDSUPPORTASSIGNED" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "ULDSUPPORTASSIGNED" && i.PageRight == "Delete") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
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


