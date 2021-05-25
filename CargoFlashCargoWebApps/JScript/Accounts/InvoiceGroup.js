var StartDate = "";
var HasData = false;
$('#MasterDuplicate').remove();
$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("AccountSNo", "Name", "InvoiceGroup_AgentName", GetInvoiceDateOnSelect, "contains");
    $('input[type="radio"][name="IsActive"]').attr('disabled', true);
    $("input[name=Type]:radio").click(function () {
        if ($(this).attr("value") == "0") {
            cfi.ResetAutoComplete("AccountSNo");
            var data = GetDataSourceV2("AccountSNo", "InvoiceGroup_Name", null);
            cfi.ChangeAutoCompleteDataSource("AccountSNo", data, true, GetInvoiceDateOnSelect, "Name", "contains");
            $('span#spnAccountSNo').text('Forwarder(Agent)');
            $('#Text_AccountSNo').attr("data-valid-msg", "Forwarder (Agent) can not be blank");
            $('span#spnAccountSNo').closest('td').attr("title", "Select Forwarder (Agent)");
        }
        else {
            cfi.ResetAutoComplete("AccountSNo");
            var data = GetDataSourceV2("AccountSNo", "InvoiceGroup_AirlineName", null);
            cfi.ChangeAutoCompleteDataSource("AccountSNo", data, true, GetInvoiceDateOnSelect, "CarrierCode,AirlineName", "contains");
            $('span#spnAccountSNo').text('Airline');
            $('#Text_AccountSNo').attr("data-valid-msg", "Airline can not be blank");
            $('span#spnAccountSNo').closest('td').attr("title", "Select Airline");
        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#Validity").data("kendoDatePicker").value('');
    }

    var InvoiceTransArray = [];
    var arrayLength = 0;
    //Parameter: processName, moduleName, appName, formAction
    $('#dvInvoiceGroupTrans').html('');
    $.ajax({
        url: "Services/Accounts/InvoiceGroupService.svc/GetWebForm/InvoiceGroup/Accounts/InvoiceGroup/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $('#dvInvoiceGroupTrans').html(result);

            InstantiateControl("divareaTrans_accounts_invoicegrouptrans");

            if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                $.ajax({
                    url: "Services/Accounts/InvoiceGroupService.svc/GetRecordInvoiceGroupTrans?SNo=" + $('#hdnInvoiceGroupSNo').val() + "", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    Data: $('#hdnInvoiceGroupSNo').val(),
                    success: function (result) {
                        var basis = JSON.parse(result);
                        InvoiceTransArray = basis.Table0;
                        arrayLength = InvoiceTransArray.Length;
                    }
                });
            }
            //Parameter: ProcessName_XML Name
            cfi.makeTrans("accounts_invoicegrouptrans", null, null, BindAutoCompleteFor, BindAutoCompleteForremove, null, InvoiceTransArray);
            cfi.AutoCompleteV2("ChargeSNo", "GroupCode,GroupName", "InvoiceGroup_GroupName",  null, "contains", ",");
            $('[id^="GroupName"]').on('blur', function () {
                var value = $(this).val().toUpperCase();
                var ID = $(this).attr('id');
                $('[id^="GroupName"]').not(this).each(function () {
                    if ($(this).val().toUpperCase() == value) {
                        ShowMessage('warning', 'Warning - Invoice Group', $('#' + ID).val().toUpperCase() + " Group Name should not be duplicate.");
                        $('#' + ID).val('');
                        return false;
                    }
                })
            });

            $("div[id$='divareaTrans_accounts_invoicegrouptrans']").find("[id^='areaTrans_accounts_invoicegrouptrans']").each(function () {
                if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || (getQueryStringValue("FormAction").toUpperCase() == "EDIT" && ($('#isUsed').val() == 1 || $('#Active').val() == 'NO'))) {


                    var GroupID = $(this).find("input[id^='GroupName']").attr("id");
                    var GroupName = $('#' + GroupID).val().toUpperCase();

                    var CargeID = $(this).find("input[id^='Text_ChargeSNo']").attr("id");
                    var ChargeText = $('#' + CargeID).val().toUpperCase();

                    $('#' + GroupID).closest('td').html('').html(GroupName);
                    $('#' + CargeID).closest('td').html('').html(ChargeText);
                }
                else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                    var id = $(this).find("input[id^='Text_ChargeSNo']").attr("id").replace('Text_', '');
                    var txt = $(this).find("input[id^='Text_ChargeSNo']").val();
                    var val = $(this).find("input[id^='ChargeSNo']").val();
                    cfi.BindMultiValue(id, txt, val);
                }
            });

            if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || (getQueryStringValue("FormAction").toUpperCase() == "EDIT" && ($('#isUsed').val() == 1 || $('#Active').val() == 'NO'))) {
                $('[id^="transActionDiv"]').hide();
                $('input[type="submit"][value="Update"]').hide();
            }
        }
    });

    if ($('#Type').val() == 'AIRLINE') {
        $('span#spnText_AccountSNo').html('Airline');
        $('span#spnText_AccountSNo').closest('td').attr('title', "Airline")
    }
    else {
        $('span#spnText_AccountSNo').html('Forwarder (Agent)');
        $('span#spnText_AccountSNo').closest('td').attr('title', "Forwarder (Agent)")
    }

});

$("input[type='submit'][name='operation']").click(function () {
    var v = -1;
    if (!cfi.IsValidForm()) {
        return false;
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var answer = true;

        if (HasData === "True")
            answer = confirm("All other Invoice Groups of " + $('#Text_AccountSNo').val() + " will be marked as In-Active, Are you sure want to continue?");

        if (answer) {
            var InvoiceGroupTransArray = [];
            $("div[id$='divareaTrans_accounts_invoicegrouptrans']").find("[id^='areaTrans_accounts_invoicegrouptrans']").each(function () {
                var InvoiceGroupTransViewModel = {
                    SNo: $(this).find("[id^='GroupLotNo']").val() == "" ? 0 : $(this).find("[id^='GroupLotNo']").val(),
                    GroupName: $(this).find("[id^='GroupName']").val(),
                    ChargeSNo: $(this).find("[id^='Text_ChargeSNo']").data("kendoAutoComplete").key(),
                    Text_ChargeSNo: $(this).find("[id^='Text_ChargeSNo']").data("kendoAutoComplete").value(),
                };
                InvoiceGroupTransArray.push(InvoiceGroupTransViewModel);
            });

            var InvoiceGroup = {
                SNo: $('#hdnInvoiceGroupSNo').val() == "" ? 0 : $('#hdnInvoiceGroupSNo').val(),
                Type: $('input[type="radio"][name="Type"][data-radioval="Forwarder (Agent)"]').is(':checked') == true ? 0 : 1,
                Text_Type: '',
                AccountSNo: $('#AccountSNo').val(),
                Text_AccountSNo: $('#Text_AccountSNo').val(),
                Text_AirlineSNo: '',
                Validity: cfi.CfiDate("Validity"), //cfi.CfiDate("Validity"),
                IsActive: $('input[type="radio"][name="IsActive"][data-radioval="Yes"]').is(':checked'),
                Active: $('input[type="radio"][name="IsActive"][data-radioval="Yes"]').is(':checked') == true ? 'YES' : 'NO',
                InvoiceGroupTrans: InvoiceGroupTransArray,
                CreatedUser: '',
                UpdatedUser: '',
                isUsed: 0
            }

            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                $.ajax({
                    url: "Services/Accounts/InvoiceGroupService.svc/CreateInvoiceGroup",
                    async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify(InvoiceGroup),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var yui = data;
                        if (data == '0') {
                            v = 0;
                        }
                        else if (data == "1") {
                            v = 1;
                        }
                        else if (data == "2") {
                            v = 2;
                        }
                        else {
                            v = 3
                        }
                    }
                });
            }
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                $.ajax({
                    url: "Services/Accounts/InvoiceGroupService.svc/UpdateInvoiceGroup",
                    async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify(InvoiceGroup),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var yui = data;
                        if (data == '0') {
                            v = 0;
                        }
                        else if (data == "1") {
                            v = 1;
                        }
                        else if (data == "2") {
                            v = 2;
                        }
                        else {
                            v = 4
                        }
                    }
                });
            }

            if (v == 0) {
                return true;
            }
            else if (v == 1) {
                ShowMessage('warning', 'Warning - Invoice Group', "Group Name should not be duplicate.");
                return false;
            }
            else if (v == 2) {
                ShowMessage('warning', 'Warning - Invoice Group', "Start Date should be different from other Groups of " + $('#Text_AccountSNo').val());
                return false;
            }
            else if (v == 3) {
                ShowMessage('warning', 'Warning - Invoice Group', "Invoice Group Not saved, Please Try Again ");
                return false;
            }
            else if (v == 4) {
                ShowMessage('warning', 'Warning - Invoice Group', "Invoice Group Not Update, Please Try Again ");
                return false;
            }
        }
        else
            return false;
    }
});

function BindAutoCompleteFor(elem, mainElem) {

    $(elem).find("input[id^='ChargeSNo']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "GroupCode,GroupName", "InvoiceGroup_GroupName", null, "contains", ",");
    });

    $('[id^="GroupName"]').on('blur', function () {
        var value = $(this).val().toUpperCase();
        var ID = $(this).attr('id');
        $('[id^="GroupName"]').not(this).each(function () {
            if ($(this).val().toUpperCase() == value) {
                ShowMessage('warning', 'Warning - Invoice Group', $('#' + ID).val() + " Group Name should not be duplicate.");
                $('#' + ID).val('');
                return false;
            }
        })
    });
}

function BindAutoCompleteForremove(elem, mainElem) {
    $(elem).last().find("input[id^='ChargeSNo']").attr("readonly", false);
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

    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });
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
            //StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            //StopProgress();
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

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");



    var IDVal = "";
    var x = textId.split('_')[2];
    var ID = textId.split('_')[1];
    var text_ID = 'Text_' + ID + (x == undefined || x == "" ? "" : '_' + x);
    if (ID == "ChargeSNo") {

        $("div[id$='divareaTrans_accounts_invoicegrouptrans']").find("[id^='areaTrans_accounts_invoicegrouptrans']").each(function () {
            var id = $(this).find("input[id^='Text_ChargeSNo']").attr("id").replace('Text_', '');
            IDVal = IDVal == "" ? IDVal + $('#' + id).val() : IDVal + ',' + $('#' + id).val();
        });
        //  var addedValue = "";        
        //addedValue = $('input[type="hidden"][id="' + textId.replace('Text_', '') + '"]').val();
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", IDVal), cfi.autoCompleteFilter(textId);
    }

}

function GetInvoiceDateOnSelect() {
    var type = $('input[type="radio"][name="Type"][data-radioval="Forwarder (Agent)"]').is(':checked') == true ? 0 : 1;
    var AgentAirlineSNo = $('#AccountSNo').val();
    if ($('#AccountSNo').val() != "" && $('#AccountSNo').val() != undefined) {
        $.ajax({
            url: "Services/Accounts/InvoiceGroupService.svc/GetInoviceDate_InvoiceGroup?GroupType=" + type + "&AgentAirlineSNo=" + AgentAirlineSNo, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            Data: $('#hdnInvoiceGroupSNo').val(),
            success: function (result) {
                var basis = JSON.parse(result);
                if (basis.Table0.length > 0) {
                    StartDate = basis.Table0[0]['InvoiceDate'];
                    HasData = basis.Table0[0]['HasData'];
                    InvoiceGroupDate = basis.Table0[0]['InvoiceGroupDate'];
                    $("#Validity").data("kendoDatePicker").value('');
                    if (InvoiceGroupDate != "") {
                        $("#Validity").data("kendoDatePicker").min(InvoiceGroupDate);
                        $("#Validity").focus();
                        $("#Validity").blur();
                        $(document).click();
                    }
                    else {
                        var k = '1-Jan-1900';
                        $("#Validity").data("kendoDatePicker").min(k);
                        $("#Validity").focus();
                        $("#Validity").blur();
                        $(document).click();
                        //$("#Validity").data("kendoDatePicker").value(InvoiceGroupDate);
                    }
                }
            }
        });
    }
}