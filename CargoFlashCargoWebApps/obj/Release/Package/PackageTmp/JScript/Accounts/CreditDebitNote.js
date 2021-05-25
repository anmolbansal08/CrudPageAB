
var IssueTo = "Agent";
var pageType = "";
var InvoiceCurrency = "";
var InvoiceType = "";

$(document).ready(function () {
    $('#MasterSaveAndNew').hide();
    cfi.ValidateForm();

    cfi.AutoComplete("AirlineName", "Airline", "vwCNDNAirline", "SNo", "Airline", ["Airline"], ResetAirlineInvoice, "contains");
    cfi.AutoComplete("AirlineInvoiceNo", "InvoiceNo", "vwCNDNAirlineInvoice", "SNo", "InvoiceNo", ["InvoiceNo"], null, "contains");

    cfi.AutoComplete("InvoiceNo", "InvoiceNo", "vCNDNInvoice", "InvoiceSNo", "InvoiceNo", ["InvoiceNo"], null, "contains");
    cfi.AutoComplete("AWBNo", "AWBNo", "vCNDNInvoice_AWB", "InvoiceAWBSNo", "AWBNo", ["AWBNo"], ResetAWB, "contains");

    cfi.AutoComplete("WorkOrderAirline", "IssuedTo", "vwCNDN_WO_Airline", "SNo", "IssuedTo", ["IssuedTo"], ResetAirlineInvoice, "contains");
    cfi.AutoComplete("WorkOrderInvoiceNo", "InvoiceNo", "vwCNDN_WO_AirlineInvoice", "SNo", "InvoiceNo", ["InvoiceNo"], null, "contains");

    $("input[name='operation']").hide();
    $('#MasterSaveAndNew').hide();

    $('#btnSearchInvoice').click(function (evt) {
        var InvoiceCount = 0;
        if (InvoiceType == "Agent_CashInvoice") {
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
        }
        else if (InvoiceType == "Airline_CreditInvoice") {
            if ($("#Text_AirlineName").data("kendoAutoComplete").key() != "" && $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").value() == "") {
                InvoiceCount = parseInt($("#Text_AirlineName").data("kendoAutoComplete").key().split('-')[1]);
            }
            if (InvoiceCount > 1) {
                ShowMessage('warning', 'Information', "Please Select Airline Invoice No.");
                return;
            }

            if ($("#Text_AirlineName").data("kendoAutoComplete").value() == "") {
                ShowMessage('warning', 'Information', "Please Select Airline Name");
                return;
            }
            else if ($("#Text_AirlineInvoiceNo").data("kendoAutoComplete").value() == "") {
                ShowMessage('warning', 'Information', "Please Select Airline Invoice No.");
                return;
            }

        }
        else if (InvoiceType == "Airline_WorkOrder" || InvoiceType == "Agent_WorkOrder") {
            if ($("#Text_WorkOrderAirline").data("kendoAutoComplete").key() != "" && $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").value() == "") {
                InvoiceCount = parseInt($("#Text_AirlineName").data("kendoAutoComplete").key().split('-')[1]);
            }
            if (InvoiceCount > 1) {
                ShowMessage('warning', 'Information', "Please Select Work Order No.");
                return;
            }

            if ($("#Text_WorkOrderAirline").data("kendoAutoComplete").value() == "") {
                if (InvoiceType == "Airline_WorkOrder")
                    ShowMessage('warning', 'Information', "Please Select Airline Name");
                if (InvoiceType == "Agent_WorkOrder")
                    ShowMessage('warning', 'Information', "Please Select Agent Name");
                return;
            }
            else if ($("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").value() == "") {
                ShowMessage('warning', 'Information', "Please Select Work Order No.");
                return;
            }

        }

        BindInvoiceCharges();
        loadAppendGridData();
        $('.formSection').css("padding-left", "5px");
        $('[id^="tblInvoiceCharges_ChargeName"]').closest('td').css('padding-left', '5px');
        $('[id^="tblInvoiceCharges_ChargeName"]').closest('td').css('text-align', 'left');

        if ($('#_temptblInvoiceCharges_InputAmount_1').length == 0) {
            $("input[name='operation']").hide();
        }
        else {
            $("input[name='operation']").show();
            $('#MasterSaveAndNew').hide();
        }
    });

    $("input[name='operation']").unbind('click').click(function () {
        if ($('#_temptblInvoiceCharges_InputAmount_1').length == 0) {
            ShowMessage('warning', 'Information', "Please search data to create Credit Note.");
            return;
        }
        else {
            dirtyForm.isDirty = false;//to track the changes
            _callBack();
            SaveCreditNote();
        }
       
    });

    ShowHideControl(false,false,false,false);

    $('#spnCreditNoteFor').closest('td').next().html('<input type="radio" name="rdCreditNoteFor" id="rdCreditNoteFor" value="Airline">Airline<input type="radio" name="rdCreditNoteFor" id="rdCreditNoteFor" value="Agent">Forwarder (Agent)');

    $('#spnCreditNoteType').closest('td').next().html('<input type="radio" name="rdCreditNoteType" id="rdCreditNoteType" value="CashInvoice">Cash Invoice<input type="radio" name="rdCreditNoteType" id="rdCreditNoteType" value="CreditInvoice">Credit Invoice<input type="radio" name="rdCreditNoteType" id="rdCreditNoteType" value="WorkOrder">Work Order');

    $('input[type="radio"][name="rdCreditNoteFor"]').change(function () {
        $('input[type="radio"][name="rdCreditNoteType"]').removeAttr('checked');      
        ShowHideControl(false, false, false,false);
    });

    $('input[type="radio"][name="rdCreditNoteType"]').change(function () {

        var CreditNoteFor = $('input[type="radio"][name="rdCreditNoteFor"]:checked').val();
        var CreditNoteType = $(this).val();

        $("#Text_AWBNo").data("kendoAutoComplete").key('');
        $("#Text_AWBNo").data("kendoAutoComplete").value('');
        $("#Text_InvoiceNo").data("kendoAutoComplete").value('');
        $("#Text_InvoiceNo").data("kendoAutoComplete").key('');

        $("#Text_AirlineName").data("kendoAutoComplete").key('');
        $("#Text_AirlineName").data("kendoAutoComplete").value('');
        $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").value('');
        $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").key('');

        $("#Text_WorkOrderAirline").data("kendoAutoComplete").key('');
        $("#Text_WorkOrderAirline").data("kendoAutoComplete").value('');
        $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").value('');
        $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").key('');

        $('#dvInvoiceDetails').hide();
        $('#divCNList').hide();
        $('#divInvoiceCharges').hide();

        InvoiceType = CreditNoteFor + '_' + CreditNoteType;

        if (CreditNoteFor == "Airline")
        {
            $('#spnWorkOrderAirline').text('Airline Name');
        }
        else if (CreditNoteFor == "Agent") {
            $('#spnWorkOrderAirline').text('Agent Name');
        }

        if ($('input[type="radio"][name="rdCreditNoteFor"]:checked').length == 0) {
            ShowMessage('warning', 'Information', "Please Select Credit Note For.");
            $('input[type="radio"][name="rdCreditNoteType"]').removeAttr('checked');
            return;
        }
        if (CreditNoteFor == "Airline" && CreditNoteType == "CreditInvoice") {
            ShowHideControl(true, false, true,false);
        }
        else if (CreditNoteFor == "Agent" && CreditNoteType == "CashInvoice") {
            ShowHideControl(false, true, true,false);
        }
        else if ((CreditNoteFor == "Airline" || CreditNoteFor == "Agent" )&& CreditNoteType == "WorkOrder") {
            ShowHideControl(false, false, true,true);
        }
        else {
            ShowHideControl(false, false, false,false);
        }
    });

});

function ShowHideControl(spnAirlineName, spnAWBNo, btnSearchInvoice, spnWorkOrderAirline) {
    if (spnAirlineName)
        $('#spnAirlineName').closest('tr').show();
    else
        $('#spnAirlineName').closest('tr').hide();

    if (spnAWBNo)
        $('#spnAWBNo').closest('tr').show();
    else
        $('#spnAWBNo').closest('tr').hide();

    if (btnSearchInvoice)
        $('#btnSearchInvoice').closest('tr').show();
    else
        $('#btnSearchInvoice').closest('tr').hide();

    if (spnWorkOrderAirline)
        $('#spnWorkOrderAirline').closest('tr').show();
    else
        $('#spnWorkOrderAirline').closest('tr').hide();
}

function PrintSlip(InvoiceSNo) {

    window.open("HtmlFiles/Shipment/Payment/CreditNotePrint.html?InvoiceSNo=" + InvoiceSNo);
}
function ResetAWB() {
    $("#Text_InvoiceNo").data("kendoAutoComplete").value("");
    $("#Text_InvoiceNo").data("kendoAutoComplete").key("");
    $('#dvInvoiceDetails').hide();
    $('#divCNList').hide();
    $('#divInvoiceCharges').hide();
}

function ResetAirlineInvoice() {
    $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").value("");
    $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").key("");

    $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").value("");
    $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").key("");
}

function ExtraCondition(textId) {
    var filtertextId = cfi.getFilter("AND");
    if (textId == "Text_AWBNo")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "CitySNo", "eq", userContext.CitySNo), cfi.autoCompleteFilter(textId);

    if (textId == "Text_InvoiceNo" && $("#AWBNo").val() != "") {
        var SelectedAWB = $("#Text_AWBNo").data("kendoAutoComplete").value();
        cfi.setFilter(filtertextId, "AWBNo", "eq", SelectedAWB);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_AirlineInvoiceNo") {
        var SelectedAirline = $("#Text_AirlineName").data("kendoAutoComplete").key();
        SelectedAirline = SelectedAirline == "" ? "0" : SelectedAirline.split('-')[0];
        cfi.setFilter(filtertextId, "AirlineSNo", "eq", SelectedAirline);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_WorkOrderInvoiceNo") {
        var SelectedAirline = $("#Text_WorkOrderAirline").data("kendoAutoComplete").key();
        SelectedAirline = SelectedAirline == "" ? "0" : SelectedAirline.split('-')[0];
        cfi.setFilter(filtertextId, "AirlineSNo", "eq", SelectedAirline);
        if (InvoiceType == "Airline_WorkOrder")
            cfi.setFilter(filtertextId, "InvoiceType", "eq", "1");
        else if (InvoiceType == "Agent_WorkOrder")
            cfi.setFilter(filtertextId, "InvoiceType", "eq", "2");
        else
            cfi.setFilter(filtertextId, "InvoiceType", "eq", "0");
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_WorkOrderAirline") {
        if (InvoiceType == "Airline_WorkOrder")
            cfi.setFilter(filtertextId, "IssuedType", "eq", "1");
        else if (InvoiceType == "Agent_WorkOrder")
            cfi.setFilter(filtertextId, "IssuedType", "eq", "2");
        else
            cfi.setFilter(filtertextId, "IssuedType", "eq", "0");
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

    $('#tblCNList').appendGrid({
        caption: 'Credit Note Details',
        captionTooltip: 'Credit Note Charges Information',
        columns: [{ name: 'SNo', type: 'hidden' },
        { name: 'TransactionNo', display: 'Credit No.', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'ChargeName', display: 'Charge Name', type: 'label', ctrlCss: { width: '40px', align:'left' }, isRequired: false },
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

    $('#tblInvoiceCharges').appendGrid({
        caption: 'Add Credit Note',
        captionTooltip: 'Invoice Charges Information',
        tableID: "tblInvoiceCharges",
        columns: [
        { name: 'InvTariffSNo', type: 'hidden' },
        { name: 'ChargeSNo', type: 'hidden' },
        { name: 'ChargeName', display: 'Charge Name', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'TariffAmount', display: 'Charge Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'CNAvailableAmount', display: 'CN Available Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'InputAmount', display: 'Amount', type: 'text', ctrlAttr: { controltype: "decimal2", maxlength: 6, allowchar: '-100!100', title: "Enter Amount", onblur: "CheckAmount(this);" }, ctrlCss: { width: '100px' }, isRequired: false },
        { name: 'Remarks', display: 'Remarks', type: 'text', ctrlAttr: { maxlength: 50, controltype: 'alphanumericupper' }, ctrlCss: { width: '150px' }, isRequired: false },
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

function CheckAmount(obj) {
    var Remarkctrl = $(obj).closest('tr').find('input[id^="tblInvoiceCharges_Remarks_"]');

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
    }

}

function loadAppendGridData() {

    var _AirlineInvoiceSNo = 0, _AirlineSNo = 0;

    var _WhereCondition = "";
    var _InvoiceSNo = $("#Text_InvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_InvoiceNo").data("kendoAutoComplete").key();
    var _AWBSNo = $("#Text_AWBNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AWBNo").data("kendoAutoComplete").key().split('-')[0];

    _WhereCondition = _InvoiceSNo + "-" + _AWBSNo;

    if (InvoiceType == "Airline_CreditInvoice") {
        _AirlineInvoiceSNo = $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").key();
        _AirlineSNo = $("#Text_AirlineName").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AirlineName").data("kendoAutoComplete").key().split('-')[0];
    }
    else if (InvoiceType == "Airline_WorkOrder" || InvoiceType == "Agent_WorkOrder") {
        _AirlineInvoiceSNo = $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").key();
        _AirlineSNo = $("#Text_WorkOrderAirline").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_WorkOrderAirline").data("kendoAutoComplete").key().split('-')[0];
    }

    _WhereCondition = _WhereCondition + '-' + _AirlineSNo + "-" + _AirlineInvoiceSNo + '-' + InvoiceType;

    $.ajax({
        url: "Services/Accounts/CreditDebitNoteService.svc/GetCNDNInvoice",
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
            if (dataTableobj.Table0!=undefined && dataTableobj.Table0.length > 0) {
                GetInvoiceDetails(dataTableobj.Table0);
            }
            if (dataTableobj.Table1!= undefined && dataTableobj.Table1.length > 0) {
                $('#tblCNList').appendGrid('load', dataTableobj.Table1);
            }
            if (dataTableobj.Table2 != undefined && dataTableobj.Table2.length > 0) {
                $('#tblInvoiceCharges').appendGrid('load', dataTableobj.Table2);
            }

            $('#dvInvoiceDetails').show();
            $('#divCNList').show();
            $('#divInvoiceCharges').show();
        },
        error: function (err) {
            alert("Generated Error");
        }
    });


}

function GetInvoiceDetails(InvoiceDetails) {

    var strVar = "";
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

    if ($("#Text_InvoiceNo").data("kendoAutoComplete").value() == "") {
        $("#Text_InvoiceNo").data("kendoAutoComplete").value(InvoiceDetails[0]["InvoiceNo"]);
        $("#Text_InvoiceNo").data("kendoAutoComplete").key(InvoiceDetails[0]["SNo"]);
    }
    if ($("#Text_AWBNo").data("kendoAutoComplete").value() == "") {
        $("#Text_AWBNo").data("kendoAutoComplete").value(InvoiceDetails[0]["AWBNo"]);
    }
}

function SaveCreditNote() {

    if (!cfi.IsValidForm()) {
        return false;
    }

    if ($('#_temptblInvoiceCharges_InputAmount_1').length == 0)
    {
        ShowMessage('warning', 'Information', "Please search data to create Credit Note.");
        return false;
    }   

    var tblGrid = "tblInvoiceCharges";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () {
        return $(this).attr("id").split('_')[2];
    }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    var Griddata = JSON.parse($('#' + tblGrid).appendGrid('getStringJson'));
    $.each(Griddata, function (i, item) {
        if (item.InputAmount == undefined || item.InputAmount == "") {
            item.InputAmount = 0;
        }
    });
    $("#hdnFormData").val(JSON.stringify(Griddata));

}