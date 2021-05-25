
var IssueTo = "Agent";
var pageType = "";
var InvoiceCurrency = "";
var FinalData = "";
var InvoiceNo = "";

$(document).ready(function () {

    cfi.ValidateForm();

    cfi.AutoCompleteV2("AirlineSNo", "IssuedName", "CreditDebitNoteApproval_IssuedName", null, "contains");
    cfi.AutoCompleteV2("InvoiceNo", "InvoiceNo", "CreditDebitNoteApproval_InvoiceNo", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "CreditDebitNoteApproval_AWBNo", ResetAWB, "contains");

    $('td.form2buttonrow').hide();

    if ($('#hdnInvoiceSNo').val()!=undefined && $('#hdnInvoiceSNo').val() != "")
    {
        BindInvoiceCharges();
        loadAppendGridDataOnEdit($('#hdnInvoiceSNo').val());
        $('.formSection').css("padding-left", "5px");
        $('#spnAWBNo').closest('tr').hide();
        $('#spnAWBNo').closest('tr').next().hide();
        if($("#hdnActionMode").val()=="EDIT")
        {
            $('#__SpanHeader__').text('Approve Credit Note');
            if (FinalData == "2" || FinalData == "5" || FinalData == "6") {
                $("input[name='operation']").hide();
               
            }
            else {
                $("input[name='operation']").val('Approve');
            }
        }
        else if ($("#hdnActionMode").val() == "READ") {
         //Added By Shivali Thakur
            $(".btn-info").hide();
            $("input[name='operation']").hide();
        }
        

    }

    //if ($('#_temptblCNList_TariffAmount_1').length == 0) {
    //    $("input[name='operation']").hide();
    //}
    //else {
    //    $("input[name='operation']").show();
      
    //}

    $('#btnSearchInvoice').click(function (evt) {
        var InvoiceCount = 0;
        if ($("#Text_AWBNo").data("kendoAutoComplete").key() != "" && $("#Text_InvoiceNo").data("kendoAutoComplete").value() == "") {
            InvoiceCount = parseInt($("#Text_AWBNo").data("kendoAutoComplete").key().split('-')[1]);
        }
        if (InvoiceCount > 1) {
            ShowMessage('warning', 'Information', "Please select Invoice No.");
            return;
        }

        if ($("#Text_AWBNo").data("kendoAutoComplete").value() == "" && $("#Text_InvoiceNo").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Information', "Please select either AWB No. or Invoice No.");
            return;
        }

        BindInvoiceCharges();
        loadAppendGridData();
        $('.formSection').css("padding-left", "5px");
        $('#spnAWBNo').closest('tr').hide();
        $('#spnAWBNo').closest('tr').next().hide();

       
    });

    $("input[name='operation']").unbind('click').click(function () {
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        SaveCreditNote();
    });

    if (ActionType == 'Agent_CancelInvoice') // Add by parvez khan,12-02-2018, for remove pending value from drp
    {
        var ddl = $('select[id*="tblCNList_Action_"]')
        ddl.find('option[value="1"]').remove();
    }
   
});

function ResetAWB() {
    $("#Text_InvoiceNo").data("kendoAutoComplete").value("");
    $("#Text_InvoiceNo").data("kendoAutoComplete").key("");
    $('#dvInvoiceDetails').hide();
    $('#divCNList').hide();
    $('#divInvoiceCharges').hide();
    $('#dvCNDNCompleted').hide();
}

function ExtraCondition(textId) {
    var filtertextId = cfi.getFilter("AND");
    if (textId == "Text_InvoiceNo" && $("#AWBNo").val() != "") {
        var SelectedAWB = $("#Text_AWBNo").data("kendoAutoComplete").value();
        cfi.setFilter(filtertextId, "AWBNo", "eq", SelectedAWB);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
}

function CalculateTax() {
    var Amount = $("#Amount").val();
    var TotalRate = 12.36;
    var ServiceTaxRate = 12.36;
    var CalculatedAmount = ((Amount / (1 + (TotalRate / 100)))).toFixed(2);
    var ServiceTaxAmount = (((CalculatedAmount * ServiceTaxRate) / 100)).toFixed(2);
    $('span[id="CreditNoteAmount"]').html(CalculatedAmount);
    $('span[id="ServiceTaxAmount"]').html(ServiceTaxAmount);
    $('input[type="hidden"][id="CreditNoteAmount"]').val(CalculatedAmount);
    $('input[type="hidden"][id="ServiceTaxAmount"]').val(ServiceTaxAmount);
}

function BindInvoiceCharges() {
    pageType = $("#hdnActionMode").val();

    var _WhereCondition = $('#InvoiceNo').val() == "" ? 0 : $('#InvoiceNo').val() + "-";
    _WhereCondition = _WhereCondition + ($('#AWBNo').val() == "" ? 0 : _WhereCondition + $('#AWBNo').val());

    $('#tblCNDNCompleted').appendGrid({
        caption: 'Approved/Rejected Credit Note',
        captionTooltip: 'Credit Note Charges Information',
        tableID: "tblCNDNCompleted",
        columns: [{ name: 'CNDN_Charge_SNo', type: 'hidden' },
        { name: 'TransactionNo', display: 'Credit Note No.', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'ChargeName', display: 'Charge Name', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'InvoiceTariffAmount', display: 'Tariff Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'TariffAmount', display: 'Requested Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'Remarks', display: 'Remarks', type: 'label', isRequired: false },
        { name: 'CreatedBy', display: 'Created By', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'CreatedOn', display: 'Created On', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'UserActionStatus', display: 'Status', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'ApprovedAmount', display: 'Approved/Rejected Amount', type: 'label', isRequired: false },
        { name: 'ApprovedRemarks', display: 'Approved/Rejected Remarks', type: 'label', isRequired: false },
        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true
        }
    });

    if (pageType == "READ") {
        $('#tblCNList').appendGrid({
            caption: 'Pending Credit Note',
            captionTooltip: 'Credit Note Charges Information',
            tableID: "tblCNList",
            columns: [{ name: 'CNDN_Charge_SNo', type: 'hidden' },
            { name: 'TransactionNo', display: 'Credit Note No.', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'ChargeName', display: 'Charge Name', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            //{ name: 'TariffAmount', display: 'Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'CreatedBy', display: 'Created By', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'CreatedOn', display: 'Created On', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'Remarks', display: 'Entered Remarks', type: 'label', isRequired: false },
            { name: 'TariffAmount', display: 'Requested Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            
            ],
            isPaging: false,
            hideButtons: {
                remove: true,
                removeLast: true,
                insert: true,
                append: true,
                updateAll: true
            }
        });
    }
    else {
        $('#tblCNList').appendGrid({
            caption: 'Pending Credit Note',
            captionTooltip: 'Credit Note Charges Information',
            tableID: "tblCNList",
            columns: [{ name: 'CNDN_Charge_SNo', type: 'hidden' },
            { name: 'TransactionNo', display: 'Credit Note No.', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'ChargeName', display: 'Charge Name', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            //{ name: 'TariffAmount', display: 'Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'CreatedBy', display: 'Created By', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'CreatedOn', display: 'Created On', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'Remarks', display: 'Entered Remarks', type: 'label', isRequired: false },
            { name: 'TariffAmount', display: 'Requested Amount', type: 'text', ctrlAttr: { controltype: "decimal2", maxlength: 6, allowchar: '-100!100', title: "Amount", onblur: "CheckAmount(this);" }, ctrlCss: { width: '100px' }, isRequired: true },
            { name: 'ApprovedRemarks', display: 'Approve/Reject Remarks', type: 'text', ctrlAttr: { maxlength: 50, controltype: 'alphanumericupper', onblur: "WriteRemarks(this);" }, ctrlCss: { width: '150px' }, isRequired: true },
            {
                name: 'Action', display: 'Action', type: "select", controltype: 'autocomplete', isRequired: true, ctrlOptions: { 1: 'Pending', 2: 'Approve', 3: 'Reject' }, ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 500, onchange: "ChangeAction(this);" }
            },
            { name: 'CNAvailableAmount', type: 'hidden' }
            ],
            isPaging: false,
            hideButtons: {
                remove: true,
                removeLast: true,
                insert: true,
                append: true,
                updateAll: true
            }
        });
    }

    $('#tblInvoiceCharges').appendGrid({
        caption: 'Add Credit Note',
        captionTooltip: 'Invoice Charges Information',
        tableID: "tblInvoiceCharges",
        columns: [{ name: 'InvTariffSNo', type: 'hidden' },
        { name: 'ChargeName', display: 'Charge Name', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'TariffAmount', display: 'Charge Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'CNAvailableAmount', display: 'CN Availed Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'InputAmount', display: 'Amount', type: 'text', ctrlAttr: { controltype: "decimal2", maxlength: 6, allowchar: '-100!100', title: "Enter Amount", onblur: "CheckAmount(this);" }, ctrlCss: { width: '100px' }, isRequired: false },
        { name: 'Remarks', display: 'Remarks', type: 'text', ctrlCss: { width: '150px' }, isRequired: false },
        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true
        }
    });
}

// Add by parvez khan,12-02-2018
function WriteRemarks(obj) {
    if (ActionType == 'Agent_CancelInvoice') {
        var remarks = $("#" + obj.id).val();
        $('input[id*="tblCNList_ApprovedRemarks_"]').val(remarks);
    }
}
// Add by parvez khan,12-02-2018
function ChangeAction(obj)
{
    if (ActionType == 'Agent_CancelInvoice') {
        var ActionVal = $("#" + obj.id).val();
        $('select[id*="tblCNList_Action_"]').val(ActionVal)
    }
   
}
function CheckAmount(obj) {
    /*var Remarkctrl = $(obj).closest('tr').find('input[id^="tblInvoiceCharges_Remarks_"]');

    if (obj.value != "") {
        var EnteredAmount = parseFloat(obj.value);
        var AvailedAmount = parseFloat($('#' + obj.id.replace("InputAmount", "CNAvailableAmount")).text());
        if (EnteredAmount > AvailedAmount) {
            ShowMessage('warning', 'Information', "Entered amount should be less than or equal to Availed Amount.");
            $('#' + obj.id).val('');
            Remarkctrl.removeAttr('data-valid');
            Remarkctrl.removeAttr('data-valid-msg');
            Remarkctrl.removeClass('k-input valid_invalid');
        }
        else if (EnteredAmount > 0) {
            Remarkctrl.addClass('k-input valid_invalid');
            Remarkctrl.attr('data-valid', 'required');
            Remarkctrl.attr('data-valid-msg', 'Please Enter Remarks.');
        }
    }
    else {
        Remarkctrl.removeAttr('data-valid');
        Remarkctrl.removeAttr('data-valid-msg');
        Remarkctrl.removeClass('k-input valid_invalid');
    }*/

    var Remarkctrl = $(obj).closest('tr').find('input[id^="tblCNList_ApprovedRemarks_"]');
    var Actionkctrl = $(obj).closest('tr').find('select[id^="tblCNList_Action_"]');

    if (obj.value != "") {
        var EnteredAmount = parseFloat(obj.value);

        var AvailedAmount = parseFloat($('#' + obj.id.replace("TariffAmount", "CNAvailableAmount")).val());
        if (EnteredAmount > AvailedAmount) {
            ShowMessage('warning', 'Information', "Approved amount should be less than or equal to Requested Amount.");
            $('#' + obj.id).val(AvailedAmount);
            //Remarkctrl.removeAttr('data-valid');
            //Remarkctrl.removeAttr('data-valid-msg');
            //Remarkctrl.removeClass('k-input valid_invalid');
        }

        if(EnteredAmount>0)
        {
            Remarkctrl.addClass('k-input valid_invalid');
            Remarkctrl.attr('data-valid', 'required');
            Remarkctrl.attr('data-valid-msg', 'Please Enter Remarks.');

            Actionkctrl.addClass('k-input valid_invalid');
            Actionkctrl.attr('data-valid', 'required');
            Actionkctrl.attr('data-valid-msg', 'Please Select Action.');

        }
        else {
            Remarkctrl.removeAttr('data-valid');
            Remarkctrl.removeAttr('data-valid-msg');
            Remarkctrl.removeClass('k-input valid_invalid');

            Actionkctrl.removeAttr('data-valid');
            Actionkctrl.removeAttr('data-valid-msg');
            Actionkctrl.removeClass('k-input valid_invalid');
        }
    }
    else {
        Remarkctrl.removeAttr('data-valid');
        Remarkctrl.removeAttr('data-valid-msg');
        Remarkctrl.removeClass('k-input valid_invalid');

        Actionkctrl.removeAttr('data-valid');
        Actionkctrl.removeAttr('data-valid-msg');
        Actionkctrl.removeClass('k-input valid_invalid');
    }

}

function loadAppendGridData() {

    var _InvoiceSNo = $("#Text_InvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_InvoiceNo").data("kendoAutoComplete").key();
    var _AWBSNo = $("#Text_AWBNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AWBNo").data("kendoAutoComplete").key().split('-')[0];

    var _WhereCondition = _InvoiceSNo + "-" + _AWBSNo;

    $.ajax({
        url: "Services/Accounts/CreditDebitNoteApprovalService.svc/GetCNDNInvoice",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            recordID: 1,
            page: 1,
            pageSize: 1,
            whereCondition: _WhereCondition,
            sort: "",
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            if (dataTableobj.Table0.length > 0) {
           
                GetInvoiceDetails(dataTableobj.Table0);
            }
            if (dataTableobj.Table1.length > 0) {
                $('#tblCNList').appendGrid('load', dataTableobj.Table1);
               
            }
            if (dataTableobj.Table2.length > 0) {
                $('#tblInvoiceCharges').appendGrid('load', dataTableobj.Table2);
            }
            if (dataTableobj.Table3.length > 0) {
                $('#tblCNDNCompleted').appendGrid('load', dataTableobj.Table3);
            }

            $('#dvInvoiceDetails').show();
            $('#divCNList').show();
            //$('#divInvoiceCharges').show();
            $('#dvCNDNCompleted').show();

           
        },
        error: function (err) {
            alert("Generated Error");
        }
    });


}
var ActionType = '';
function loadAppendGridDataOnEdit(CNDN_SNo) {

    //var _InvoiceSNo = $("#Text_InvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_InvoiceNo").data("kendoAutoComplete").key();
    //var _AWBSNo = $("#Text_AWBNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AWBNo").data("kendoAutoComplete").key().split('-')[0];

    var _WhereCondition = CNDN_SNo;//+ "-" + _AWBSNo;

    $.ajax({
        url: "Services/Accounts/CreditDebitNoteApprovalService.svc/GetCNDNInvoiceRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            recordID: 1,
            page: 1,
            pageSize: 1,
            whereCondition: _WhereCondition,
            sort: "",
        },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (data) {
            var dataTableobj = JSON.parse(data);
            if (dataTableobj.Table0 != undefined && dataTableobj.Table0.length > 0) {
               
                GetInvoiceDetails(dataTableobj.Table0);
            }
            if (dataTableobj.Table1 != undefined && dataTableobj.Table1.length > 0) {
                $('#tblCNList').appendGrid('load', dataTableobj.Table1);

                // Add by parvez khan,12-02-2018,for getting invoice type
                var ListActionType = dataTableobj.Table1;
                ActionType=ListActionType[0].CreditNoteType;
            }
            if (dataTableobj.Table2 != undefined && dataTableobj.Table2.length > 0) {
                $('#tblInvoiceCharges').appendGrid('load', dataTableobj.Table2);
            }            
            if (dataTableobj.Table3 != undefined && dataTableobj.Table3.length > 0) {
                $('#tblCNDNCompleted').appendGrid('load', dataTableobj.Table3);
            }

            $('#dvInvoiceDetails').show();
            $('#divCNList').show();
            $('#divInvoiceCharges').hide();
            $('#dvCNDNCompleted').show();
            //Added by shivali Thakur  to make tariff amount non- editable.
            for (var i = 1; i <= dataTableobj.Table1.length; i++) {
                $('#_temptblCNList_TariffAmount_' + i).attr("disabled", true)
                $('#_tblCNList_TariffAmount_' + i).attr("disabled", true)
            }
            var list = dataTableobj.Table4;
            FinalData = list[0].UserAction;
            if (FinalData == 2 || FinalData == 5 || FinalData == 6) {
                $('#divCNList').hide();
                $("input[name='operation']").hide();
            }
            else {
                $('#divCNList').show();
                $("input[name='operation']").show();
            }
        },
        error: function (err) {
            alert("Generated Error");
        }
    });

    AuditLogBindOldValue("tblCNList");
}

function GetInvoiceDetails(InvoiceDetails) {

    var strVar = "";
    InvoiceNo = InvoiceDetails[0]["InvoiceNo"];
    strVar += "<table class=\"appendGrid ui-widget\" style=\"text-align:center\"><thead class='ui-widget-header'><tr><td class=\"formSection\" align=\"left\" colspan=\"11\">Invoice Details<\/td><\/tr>";
    strVar += "<tr style=\"font-weight: bold\">";
    strVar += "<td class=\"ui-widget-header\">Issued To<\/td>";
    strVar += "<td class=\"ui-widget-header\">Invoice No<\/td>";
    strVar += "<td class=\"ui-widget-header\">Invoice Date<\/td>";
    strVar += "<td class=\"ui-widget-header\">AWB No<\/td>";
    strVar += "<td class=\"ui-widget-header\">Charge To<\/td>";
    strVar += "<td class=\"ui-widget-header\">Movement Type<\/td>";
    strVar += "<td class=\"ui-widget-header\">Total Amount<\/td>";
    strVar += "<td class=\"ui-widget-header\">Total Tax Amount<\/td>";
    strVar += "<td class=\"ui-widget-header\">Grand Total<\/td>";
    strVar += "<td class=\"ui-widget-header\">Round Off Amount<\/td>";
    strVar += "<td class=\"ui-widget-header\">Currency Code<\/td>";
    strVar += "<\/tr></thead><tr>";

    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["IssuedTo"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["InvoiceNo"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["InvoiceDate"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["AWBNo"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["ChargeTo"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["MovementType"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["TotalAmount"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["TotalTaxAmount"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["GrandTotal"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["RoundOffAmount"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["CurrencyCode"] + "<\/td>";
    strVar += "<\/tr><\/tbody>";
    strVar += "<\/table>";
    $('#dvInvoiceDetails').html(strVar);
    /*
    if ($("#Text_InvoiceNo").data("kendoAutoComplete").value() == "") {
        $("#Text_InvoiceNo").data("kendoAutoComplete").value(InvoiceDetails[0]["InvoiceNo"]);
        $("#Text_InvoiceNo").data("kendoAutoComplete").key(InvoiceDetails[0]["SNo"]);
    }
    if ($("#Text_AWBNo").data("kendoAutoComplete").value() == "") {
        $("#Text_AWBNo").data("kendoAutoComplete").value(InvoiceDetails[0]["AWBNo"]);
    }*/
}

function SaveCreditNote() {

    if ($("#hdnActionMode").val() == "EDIT") {
        $('#__SpanHeader__').text('Approve Credit Note');
        $("input[name='operation']").val('Update');
    }

    if (!cfi.IsValidForm()) {
        return false;
    }

    var tblGrid = "tblCNList";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () {
        return $(this).attr("id").split('_')[2];
    }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    var Griddata = JSON.parse($('#' + tblGrid).appendGrid('getStringJson'));
    AuditLogSaveNewValue("tblCNList", "true", "CREDITDEBITNOTEAPPROVAL", "Invoice No", InvoiceNo, "", getQueryStringValue("FormAction").toUpperCase(), userContext.TerminalSNo, userContext.NewTerminalName);

    $.each(Griddata, function (i, item) {
        if (item.TariffAmount == undefined || item.TariffAmount == "") {
            item.TariffAmount = 0;
        }
        if (item.Action == undefined || item.Action == "" || item.Action == "null") {
            item.Action = "1";
        }
    });
    $("#hdnFormData").val(btoa(JSON.stringify(Griddata)));

}