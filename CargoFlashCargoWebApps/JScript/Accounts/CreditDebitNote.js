
var IssueTo = "Agent";
var pageType = "";
var InvoiceCurrency = "";
var InvoiceType = "0";
var FormAction = "";
var Status = "";
var Status1 = "";
var UnPaid = 0;
var InvoiceNo = "";
$(document).ready(function () {

    //  $('#MasterSaveAndNew').hide();
    cfi.ValidateForm();

    FormAction = getQueryStringValue("FormAction").toUpperCase();
    cfi.AutoCompleteV2("AirlineName", "Airline", "CreditDebitNote_Airline", ResetAirlineInvoice, "contains");
    cfi.AutoCompleteV2("AirlineInvoiceNo", "InvoiceNo", "CreditDebitNote_AirlineInvoice", null, "contains");
    
        cfi.AutoCompleteV2("InvoiceNo", "InvoiceNo", "CreditDebitNote_InvoiceNo", null, "contains");
        cfi.AutoCompleteV2("AWBNo", "AWBNo", "CreditDebitNote_AWBNo", null, "contains");
    
  
    // ResetAWB CreditDebitNote_WorkOrderInvoiceNo
    cfi.AutoCompleteV2("WorkOrderAirline", "IssuedTo", "CreditDebitNote_WorkOrderAirline", ResetAirlineInvoice, "contains");
    cfi.AutoCompleteV2("WorkOrderInvoiceNo", "InvoiceNo", "CreditDebitNote_WorkOrderInvoiceNo", null, "contains");


    // Add By Sushant Kumar Nayak
    cfi.AutoCompleteV2("ForwarderAgentName", "Name", "Account_Credit_CreditNote", null, "contains");
    cfi.AutoCompleteV2("ForwarderInvoiceNo", "InvoiceNo", "Account_Credit_CreditNote_Invoice", null, "contains");


    // $("input[name='operation']").hide();
    // $('#MasterSaveAndNew').hide();
    //if(  $("input[name='operation']") == "VIEW")
    //{

  

    //}
    if (FormAction == "NEW" || FormAction == "EDIT") {
        $('#spnCreditNoteFor').closest('td').next().html('<input type="radio" name="rdCreditNoteFor" id="rdCreditNoteFor"  checked="checked" value="Agent">Forwarder (Agent)');
        //<input type="radio" name="rdCreditNoteType" id="rdCreditNoteType" value="CreditInvoice">Credit Invoice
        $('#spnCreditNoteType').closest('td').next().html('<input type="radio" name="rdCreditNoteType" id="rdCreditNoteType" value="CashInvoice">Cash Invoice<input type="radio" name="rdCreditNoteType" id="rdCreditNoteType" value="WorkOrder">Work Order<input type="radio" name="rdCreditNoteType" id="rdCreditNoteType" value="CancelInvoice">Cancel Invoice');


    }
    $('#btnSearchInvoice').click(function (evt) {
        var InvoiceCount = 0;
        if (InvoiceType == "Agent_CashInvoice" || InvoiceType == "Agent_CancelInvoice") {
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
        if (InvoiceType != "Agent_CancelInvoice") {
            if ($('#_temptblInvoiceCharges_InputAmount_1').length <= 0) {
                $("input[name='operation']").hide();
            }
            else {
                $("input[name='operation']").show();
                $('#MasterSaveAndNew').hide();
            }

        }


        if (Status == 1) {
            $("input[name='operation']").hide();
        }
        else {
            $("input[name='operation']").show();
            $('#MasterSaveAndNew').hide();
        }


    });
    if (FormAction == 'NEW' || FormAction == 'EDIT') {
        $("input[name='operation']").unbind('click').click(function () {
            if (InvoiceType != "Agent_CancelInvoice") {
                if ($('#_temptblInvoiceCharges_InputAmount_1').length == 0) {
                    ShowMessage('warning', 'Information', "Please search data to create Credit Note.");
                    return;
                }
                else {
                    dirtyForm.isDirty = false;//to track the changes
                    _callBack();

                    SaveCreditNote();
                }

            }
            else if (InvoiceType == "Agent_CancelInvoice") {


                dirtyForm.isDirty = false;//to track the changes
                _callBack();

                SaveCreditNote();

            }


        });
    }
    ShowHideControl(false, false, false, false, false);
    //<input type="radio" name="rdCreditNoteFor" id="rdCreditNoteFor" value="Airline">Airline

    //$('#spnCreditNoteFor').closest('td').next().html('<input type="radio" name="rdCreditNoteFor" id="rdCreditNoteFor"  checked="checked" value="Agent">Forwarder (Agent)');

    $('input[type="radio"][name="rdCreditNoteFor"]').change(function () {
        $('input[type="radio"][name="rdCreditNoteType"]').removeAttr('checked');
        ShowHideControl(false, false, false, false, false);
    });
    $('#btnRefund').hide();
    //$('#btnRefund').css("display", "none");
    if (FormAction == "READ" || FormAction == "EDIT" || FormAction == "DELETE") {

        //$('#dvInvoiceDetails').show();
        //$('#dvInvoiceDetails').css("display", "block");
        BindInvoiceCharges();
        loadAppendGridData();
        //  $('#rdCreditNoteFor').attr('disabled', 'disabled');
        //$('#spnCreditNoteFor').closest('tr').html('');
        //$('#spnCreditNoteType').closest('tr').html('');
        $('#dvInvoiceDetails').css("display", "block");
        $('#divCNList').css("display", "block");
        $('#divInvoiceCharges').css("display", "block");
        $('.formSection').css("padding-left", "5px");
        $('[id^="tblInvoiceCharges_ChargeName"]').closest('td').css('padding-left', '5px');
        $('[id^="tblInvoiceCharges_ChargeName"]').closest('td').css('text-align', 'left');
        if (InvoiceType == "Agent_CashInvoice" || InvoiceType == "Agent_CancelInvoice") {
            $("#tbl .formbuttonrow").append('<input type="button" id="btnRefund" value="Refund"  class="btn btn-success" onclick="CashRefund()"></span>');
        }
        if (FormAction == "EDIT") {

            $("input[type='radio']").prop('disabled', true);
            if (Status == 2 || Status == 5) {
                $("input[name='operation']").hide();
                if (Status == 5) {
                    $('#btnRefund').show();
                    $('#btnRefund').attr("disabled", true);
                }
                if (Status == 2) {
                    $('#btnRefund').show();
                    $('#btnRefund').attr("disabled", false);
                }
                $('#divInvoiceCharges').hide();

            }
            else {
                $('#btnRefund').hide();
                $("input[name='operation']").show();
                $('#MasterSaveAndNew').hide();
            }


        }
        else if (FormAction == "READ") {
            $('#spnCreditNoteFor').closest('tr').html('');
            $('#spnCreditNoteType').closest('tr').html('');
            $('#btnRefund').hide();
            $('#divInvoiceCharges').hide();
            $("#MasterDuplicate").hide();
            $("input[value='Delete']").hide();
        }
        else if (FormAction == "DELETE") {
            $('#spnCreditNoteFor').closest('tr').html('');
            $('#spnCreditNoteType').closest('tr').html('');
            $('#btnRefund').hide();
            if (Status1 == 2 || Status1 == 5) {
                $("input[name='operation']").hide();
            }
            else {
                $("input[name='operation']").show();
                // $('#MasterSaveAndNew').hide();
            }
        }
    }
    else {
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

            if (CreditNoteFor == "Airline") {
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
                ShowHideControl(true, false, true, false, false);
            }
            else if (CreditNoteFor == "Agent" && CreditNoteType == "CashInvoice") {
                ShowHideControl(false, true, true, false, false);
            }
            else if (CreditNoteFor == "Agent" && CreditNoteType == "CancelInvoice") {
                ShowHideControl(false, true, true, false, false);
            }
            else if ((CreditNoteFor == "Airline" || CreditNoteFor == "Agent") && CreditNoteType == "WorkOrder") {
                ShowHideControl(false, false, true, true, false);
            } else if (CreditNoteFor == "Agent" && CreditNoteType == "CreditInvoice") {
                ShowHideControl(false, false, true, false, true);
            }
            else {
                ShowHideControl(false, false, false, false, false);
            }

        });
    }

    if (FormAction == 'EDIT') 
    {
        if (InvoiceType == "Agent_CancelInvoice") {
            $("input[value='Update']").hide();
        }

        if (InvoiceType == "Agent_CancelInvoice" && UnPaid == 1) {
            $("input[value='Update']").hide();
            $('#btnRefund').hide();
        }

      }
});
$(document).on('click', '#rdCreditNoteType', function () {

    $(this).val();
    if ($(this).val() == "CancelInvoice") {
        cfi.ResetAutoComplete("InvoiceNo")
        var dataSource = GetDataSourceV2("InvoiceNo", "CreditDebitNote_InvoiceNo_cancel")
        cfi.ChangeAutoCompleteDataSource("InvoiceNo", dataSource, false, null, "InvoiceNo");
        //   cfi.AutoCompleteV2("InvoiceNo", "InvoiceNo", "CreditDebitNote_InvoiceNo_cancel", null, "contains");
        cfi.ResetAutoComplete("AWBNo")
        var dataSource1 = GetDataSourceV2("AWBNo", "CreditDebitNote_AWBNo_Cancel")
        cfi.ChangeAutoCompleteDataSource("AWBNo", dataSource1, false, null, "AWBNo");
        //cfi.AutoCompleteV2("AWBNo", "AWBNo", "CreditDebitNote_AWBNo_Cancel", null, "contains");
     //  ;
        //var dataSource = GetDataSourceV2("DestinationSNo", "Rate_rate_Destination")
      //  cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "AirportCode");
    }
    else if ($(this).val() == "CashInvoice" || $(this).val() == "WorkOrder") {

        //cfi.AutoCompleteV2("AirlineName", "Airline", "CreditDebitNote_Airline", ResetAirlineInvoice, "contains");
        //cfi.AutoCompleteV2("AirlineInvoiceNo", "InvoiceNo", "CreditDebitNote_AirlineInvoice", null, "contains");

       // cfi.AutoCompleteV2("InvoiceNo", "InvoiceNo", "CreditDebitNote_InvoiceNo", null, "contains");
      //  cfi.AutoCompleteV2("AWBNo", "AWBNo", "CreditDebitNote_AWBNo", null, "contains");
        cfi.ResetAutoComplete("InvoiceNo")
        var dataSource = GetDataSourceV2("InvoiceNo", "CreditDebitNote_InvoiceNo")
        cfi.ChangeAutoCompleteDataSource("InvoiceNo", dataSource, false, null, "InvoiceNo");
        //   cfi.AutoCompleteV2("InvoiceNo", "InvoiceNo", "CreditDebitNote_InvoiceNo_cancel", null, "contains");
        cfi.ResetAutoComplete("AWBNo")
        var dataSource1 = GetDataSourceV2("AWBNo", "CreditDebitNote_AWBNo")
        cfi.ChangeAutoCompleteDataSource("AWBNo", dataSource1, false, null, "AWBNo");

        // ResetAWB CreditDebitNote_WorkOrderInvoiceNo
       // cfi.AutoCompleteV2("WorkOrderAirline", "IssuedTo", "CreditDebitNote_WorkOrderAirline", ResetAirlineInvoice, "contains");
       // cfi.AutoCompleteV2("WorkOrderInvoiceNo", "InvoiceNo", "CreditDebitNote_WorkOrderInvoiceNo", null, "contains");


        // Add By Sushant Kumar Nayak
       // cfi.AutoCompleteV2("ForwarderAgentName", "Name", "Account_Credit_CreditNote", null, "contains");
       // cfi.AutoCompleteV2("ForwarderInvoiceNo", "InvoiceNo", "Account_Credit_CreditNote_Invoice", null, "contains");


    }
});

function ShowHideControl(spnAirlineName, spnAWBNo, btnSearchInvoice, spnWorkOrderAirline, ForwarderInvoiceNo) {
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
    if (ForwarderInvoiceNo)
        $('#spnForwarderInvoiceNo').closest('tr').show();
    else
        $('#spnForwarderInvoiceNo').closest('tr').hide();
}
function CashRefund() {
    isAccountClosed = IsShiftClosed();
    if (!isAccountClosed) {
        var UserSNo = userContext.UserSNo;
        Recid = getQueryStringValue("RecID");
        if (Recid == "") {
            Recid = 0;
        }
        $.ajax({
            url: "Services/Accounts/CreditDebitNoteService.svc/UpdateCashRefund?InvoiceSNo=" + Recid + "&UserSNo=" + UserSNo,
            async: false,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                var dataTableobj = JSON.parse(data);
                if (dataTableobj.Table0 != undefined && dataTableobj.Table0.length > 0) {
                    var updatecashrefund = dataTableobj.Table0;
                    if (updatecashrefund[0].result == 1) {
                        //Added By Shivali Thakur
                        AuditLogSaveNewValue("tblInvoiceCharges", "true", "CREDITDEBITNOTE", "Invoice No", InvoiceNo, "1", getQueryStringValue("FormAction").toUpperCase(), userContext.TerminalSNo, userContext.NewTerminalName);

                        $('#btnRefund').attr("disabled", true);

                        ShowMessage('success', 'Success!', "Cash Refunded Successfully");
                    }
                    else if (updatecashrefund[0].result == 0) {
                        $('#btnRefund').attr("disabled", false);
                        ShowMessage('warning', '', "Insufficient Amount!");
                    }
                    else if (updatecashrefund[0].result == 2) {
                      ShowMessage('warning', '', "Unable to refund!");
                    }
                }
            }
        });
    }
    else {
        ShowMessage('warning', '', "You are not able to refund. Please start your shift first!");
        return false;
    }
}
function PrintSlip(InvoiceSNo) {
    window.open("HtmlFiles/Shipment/Payment/CreditNotePrint.html?InvoiceSNo=" + InvoiceSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
}
function ResetAWB() {
    $("#Text_InvoiceNo").data("kendoAutoComplete").value("");
    $("#Text_InvoiceNo").data("kendoAutoComplete").key("");
    $('#dvInvoiceDetails').hide();
    $('#divCNList').hide();
    $('#divInvoiceCharges').hide();
}

function ResetAirlineInvoice() {
    //$("#Text_AirlineInvoiceNo").data("kendoAutoComplete").value("");
    //$("#Text_AirlineInvoiceNo").data("kendoAutoComplete").key("");
    //$("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").value("");
    //$("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").key("");
}

function ExtraCondition(textIdd) {
    var textId = textIdd.split('_')[0]
    if (textId == "Text") {
        textId = textIdd
    } else {
        textId = "Text_" + textIdd;
    }
    var filtertextId = cfi.getFilter("AND");
    //if (textId == "Text_AWBNo")
    //    var SelectedINV = $("#Text_InvoiceNo").data("kendoAutoComplete").value();
    //cfi.setFilter(filtertextId, "InvoiceNo", "eq", SelectedINV);
    //var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
    //return RegionAutoCompleteFilter;
    //return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "CitySNo", "eq", userContext.CitySNo), cfi.autoCompleteFilter(textId);
    // && $("#AWBNo").val() != ""
    if (textId == "Text_InvoiceNo" && $("#Text_AWBNo").val() != "") {
        var SelectedAWB = $("#Text_AWBNo").data("kendoAutoComplete").value();
        cfi.setFilter(filtertextId, "AWBNo", "eq", SelectedAWB);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else
        if (textId == "Text_AWBNo" && $("#Text_InvoiceNo").val() != "") {
            var SelectedINV = $("#Text_InvoiceNo").data("kendoAutoComplete").value();
            cfi.setFilter(filtertextId, "InvoiceNo", "eq", SelectedINV);
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
        else if (textId == "Text_WorkOrderInvoiceNo" && $("#Text_WorkOrderAirline").val() != "") {
            //var SelectedINV = $("#Text_WorkOrderAirline").data("kendoAutoComplete").value();
            //cfi.setFilter(filtertextId, "IssuedTo", "eq", SelectedINV);
            //var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
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
        else if (textId == "Text_WorkOrderAirline" && $("#Text_WorkOrderInvoiceNo").val() != "") {
            var SelectedAirline = $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").value();
            //SelectedAirline = SelectedAirline == "" ? "0" : SelectedAirline.split('-')[0];
            //cfi.setFilter(filtertextId, "AirlineSNo", "eq", SelectedAirline);
            if (InvoiceType == "Airline_WorkOrder")
                cfi.setFilter(filtertextId, "InvoiceType", "eq", "1");
            else if (InvoiceType == "Agent_WorkOrder")
                cfi.setFilter(filtertextId, "InvoiceNo", "eq", SelectedAirline);
            else
                cfi.setFilter(filtertextId, "InvoiceType", "eq", "0");
            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
            return RegionAutoCompleteFilter;

        } else if (textId == "Text_ForwarderInvoiceNo") {
            var ForwarderAgentName = $("#ForwarderAgentName").val();
            cfi.setFilter(filtertextId, "Sno", "eq", ForwarderAgentName);
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
        currentPage: 1, itemsPerPage: 20,
        columns: [{ name: 'SNo', type: 'hidden' },
        { name: 'TransactionNo', display: 'Credit No.', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'ChargeName', display: 'Charge Name', type: 'label', ctrlCss: { width: '40px', align: 'left' }, isRequired: false },
        { name: 'InvoiceTariffAmount', display: 'Tariff Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'TariffAmount', display: 'Requested Amount', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'Remarks', display: 'Remarks', type: 'label', isRequired: false },
        { name: 'CreatedBy', display: 'Created By', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'CreatedOn', display: 'Created On', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'UserActionStatus', display: 'Status', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'ApprovedAmount', display: 'Approved/Rejected Amount', type: 'label', isRequired: false },
        { name: 'ApprovedRemarks', display: 'Approved/Rejected Remarks', type: 'label', isRequired: false },
        ],
        isPaging: true,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true
        }
    });
    if (InvoiceType != "Agent_CancelInvoice") {
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
            { name: 'InputAmount', display: 'Amount', type: 'text', ctrlAttr: { controltype: "decimal2", allowchar: '-100!100', title: "Enter Amount", onblur: "CheckAmount(this);" }, ctrlCss: { width: '100px' }, isRequired: false },
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
    else {
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
            { name: 'CNAvailableAmountcancel', display: 'Amount', type: 'text', ctrlAttr: {controltype: "decimal2", allowchar: '-100!100',readonly: 'true' },ctrlCss: { width: '40px' } },
            { name: 'Remarks', display: 'Remarks', type: 'text', ctrlAttr: { maxlength: 50, controltype: 'alphanumericupper' , onblur: "WriteRemarks(this);"}, ctrlCss: { width: '150px' }, isRequired: true },
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
}

function WriteRemarks(obj)
{
    var remarks = $("#" + obj.id).val();
    $('input[id*="tblInvoiceCharges_Remarks_"]').val(remarks);
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
            // var final = parseFloat(AvailedAmount) - parseFloat(EnteredAmount)
            // $(obj).closest('tr').find('label[id^="tblInvoiceCharges_CNAvailableAmount_"]').text(final.toFixed(3))
            Remarkctrl.addClass('k-input valid_invalid');
            Remarkctrl.attr('data-valid', 'required');
            Remarkctrl.attr('data-valid-msg', 'Please Enter Remarks.');
        }
    }
    else {
        //var final = parseFloat(AvailedAmount) - parseFloat(EnteredAmount)
        //  $(obj).closest('tr').find('label[id^="tblInvoiceCharges_CNAvailableAmount_"]').text(final.toFixed(3))
        Remarkctrl.removeAttr('data-valid');
        Remarkctrl.removeAttr('data-valid-msg');
        Remarkctrl.removeClass('k-input valid_invalid');
    }

}

function loadAppendGridData() {
    var Recid = 0;
    var _AirlineInvoiceSNo = 0, _AirlineSNo = 0;
    var _InvoiceSNo = 0;
    var _AWBSNo = 0;
    var _WhereCondition = "";
    var InvSNo = 0;
    //var InvoiceType = "0";
   

    if (FormAction == "READ" || FormAction == "EDIT" || FormAction == "DELETE") {

        Recid = getQueryStringValue("RecID");
        if (Recid == "") {
            Recid = 0;
        }
        $.ajax({
            url: "Services/Accounts/CreditDebitNoteService.svc/GetCreditNoteType?InvoiceSNo=" + Recid,
            async: false,
            type: "GET",
            dataType: "json",
            data:
            {
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
                    var InvoiceDetails = dataTableobj.Table0;
                    InvoiceType = InvoiceDetails[0]["CreditNoteType"];
                    InvoiceNo = InvoiceDetails[0]["InvoiceNo"];
                    UnPaid = InvoiceDetails[0]["UnPaid"];

                    if (FormAction == "EDIT") {
                        Status = InvoiceDetails[0]["Status"];
                      

                    }
                    else if (FormAction == "DELETE") {
                        Status1 = InvoiceDetails[0]["Status"];
                    }

                    var allCB = document.querySelectorAll("input[id='rdCreditNoteType']");
                    for (var i = 0; i < allCB.length; i++) {
                        if (InvoiceType == "Agent_CashInvoice") {
                            allCB[0].checked = true;
                        }
                       else if (InvoiceType == "Agent_CancelInvoice") {
                           allCB[2].checked = true;
                          
                           
                        }
                            //else if (InvoiceType == "Agent_CreditInvoice") {
                            //    allCB[1].checked = true;
                            //}
                        else if (InvoiceType == "Agent_WorkOrder") {
                            allCB[1].checked = true;
                        }
                    }

                }
                //if (dataTableobj.Table1 != undefined && dataTableobj.Table1.length > 0) {
                //    $('#tblCNList').appendGrid('load', dataTableobj.Table1);
                //}
                //if (dataTableobj.Table2 != undefined && dataTableobj.Table2.length > 0) {
                //    $('#tblInvoiceCharges').appendGrid('load', dataTableobj.Table2);
                //}
                //$('#dvInvoiceDetails').show();
                //$('#divCNList').show();
                //$('#divInvoiceCharges').show();
            },
            error: function (err) {
                alert("Generated Error");
            }
        });
        _WhereCondition = _InvoiceSNo + "-" + _AWBSNo;
        _WhereCondition = _WhereCondition + '-' + _AirlineSNo + "-" + _AirlineInvoiceSNo + '-' + InvoiceType + '-' + Recid;
    }
    else {
        _InvoiceSNo = $("#Text_InvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_InvoiceNo").data("kendoAutoComplete").key();
        _AWBSNo = $("#Text_AWBNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AWBNo").data("kendoAutoComplete").key().split('-')[0];

        _WhereCondition = _InvoiceSNo + "-" + _AWBSNo;

        if (InvoiceType == "Agent_CashInvoice" || InvoiceType == "Agent_CancelInvoice") {
            // $("#tbl .formbuttonrow").append('<input type="button" id="btnRefund" value="Refund"  class="btn btn-success" onclick="CashRefund()"></span>');
            _AirlineInvoiceSNo = $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AirlineInvoiceNo").data("kendoAutoComplete").key();
            _AirlineSNo = $("#Text_AirlineName").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AirlineName").data("kendoAutoComplete").key().split('-')[0];
        }
        else if (InvoiceType == "Agent_WorkOrder" || InvoiceType == "Agent_WorkOrder") {
            _AirlineInvoiceSNo = $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_WorkOrderInvoiceNo").data("kendoAutoComplete").key();
            _AirlineSNo = $("#Text_WorkOrderAirline").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_WorkOrderAirline").data("kendoAutoComplete").key().split('-')[0];
        } else if (InvoiceType == "Agent_CreditInvoice") {
            _AirlineInvoiceSNo = $("#ForwarderInvoiceNo").val() == "" ? 0 : $("#ForwarderInvoiceNo").val().split('-')[0];
            _AirlineSNo = $("#ForwarderAgentName").val() == "" ? 0 : $("#ForwarderAgentName").val().split('-')[0];
        }
        //if (InvoiceType != undefined && InvoiceType != '' && )
        _WhereCondition = _WhereCondition + '-' + _AirlineSNo + "-" + _AirlineInvoiceSNo + '-' + InvoiceType + '-' + Recid;
    }


    $.ajax({
        url: "Services/Accounts/CreditDebitNoteService.svc/GetCNDNInvoice?InvoiceNo=" + InvoiceNo,
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
            }
            if (dataTableobj.Table2 != undefined && dataTableobj.Table2.length > 0) {
                $('#tblInvoiceCharges').appendGrid('load', dataTableobj.Table2);


                //var v = dataTableobj.Table2;
                //var count = dataTableobj.Table2.length;
                //var Cal = parseFloat("0.00");
                //for (var i = 0; i < count; i++)
                //{
                // Cal += parseFloat(v[i].CNAvailableAmount);               
                //}              
                //if (parseFloat(Cal).toFixed(2) == "0.00")
                //{
                //  $("input[name='operation']").hide();
                //}
            }

            $('#dvInvoiceDetails').show();
            $('#divCNList').show();
            $('#divInvoiceCharges').show();
            if (FormAction == "READ" || FormAction == "EDIT" || FormAction == "DELETE") {
                if (InvoiceType == "Agent_CancelInvoice") {
                    $('input[id*="_temptblInvoiceCharges_InputAmount_"]').attr('disabled', true)
                    $('input[id*="tblInvoiceCharges_Remarks_"]').attr('disabled', true)
                }
            }
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
    //Added By Shivali Thakur
   AuditLogBindOldValue("tblInvoiceCharges");
}

function GetInvoiceDetails(InvoiceDetails) {

    var strVar = "";
    strVar += "<table class=\"appendGrid ui-widget\" style=\"text-align:center\"><thead class='ui-widget-header'><tr><td class=\"formSection\" align=\"left\" colspan=\"11\">Invoice Details<\/td><\/tr>";
    strVar += "<tr style=\"font-weight: bold\">";
    strVar += "<td class=\"ui-widget-header\">Issued To<\/td>";
    strVar += "<td class=\"ui-widget-header\">Invoice No<\/td>";
    strVar += "<td class=\"ui-widget-header\">Invoice Date<\/td>";
    if (InvoiceType != "Agent_CreditInvoice") {
        strVar += "<td class=\"ui-widget-header\">AWB No<\/td>";
        strVar += "<td class=\"ui-widget-header\">Charge To<\/td>";
        strVar += "<td class=\"ui-widget-header\">Movement Type<\/td>";
    }
    strVar += "<td class=\"ui-widget-header\">Total Amount<\/td>";
    strVar += "<td class=\"ui-widget-header\">Total Tax Amount<\/td>";
    strVar += "<td class=\"ui-widget-header\">Grand Total<\/td>";
    strVar += "<td class=\"ui-widget-header\">Round Off Amount<\/td>";
    strVar += "<td class=\"ui-widget-header\">Currency Code<\/td>";
    strVar += "<\/tr></thead><tr>";

    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["IssuedTo"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["InvoiceNo"] + "<\/td>";
    strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["InvoiceDate"] + "<\/td>";

    if (InvoiceType != "Agent_CreditInvoice") {
        strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["AWBNo"] + "<\/td>";
        strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["ChargeTo"] + "<\/td>";
        strVar += "<td class=\"ui-widget-content\">" + InvoiceDetails[0]["MovementType"] + "<\/td>";
    }
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

    var IsInputData = 0;
    $("input[type='radio']").prop('disabled', false);
    if (!cfi.IsValidForm()) {
        return false;
    }
    if (InvoiceType != "Agent_CancelInvoice") {
        if ($('#_temptblInvoiceCharges_InputAmount_1').length == 0) {
            ShowMessage('warning', 'Information', "Please search data to create Credit Note.");
            return false;
        }
    }

    var tblGrid = "tblInvoiceCharges";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () {
        return $(this).attr("id").split('_')[2];
    }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    var Griddata = JSON.parse($('#' + tblGrid).appendGrid('getStringJson'));
    //Added By Shivali Thakur
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
       
        AuditLogSaveNewValue("tblInvoiceCharges", "true", "CREDITDEBITNOTE", "Invoice No", InvoiceNo, "", getQueryStringValue("FormAction").toUpperCase(), userContext.TerminalSNo, userContext.NewTerminalName);
    }
    if (InvoiceType != "Agent_CancelInvoice") {
        $.each(Griddata, function (i, item) {
            if (item.InputAmount == undefined || item.InputAmount == "") {
                item.InputAmount = 0;               
            }
            else
            { IsInputData =1}
        });

    }
    else {
        $.each(Griddata, function (i, item) {
            if (item.InputAmount == undefined || item.InputAmount == "") {
                item.InputAmount = item.CNAvailableAmountcancel;
                IsInputData = 1
            }
            
        });
    }

    if (IsInputData == 1)
    {
        $("#hdnFormData").val(btoa(JSON.stringify(Griddata)));
        setTimeout(function () {

            navigateUrl('Default.cshtml?Module=Accounts&Apps=CreditDebitNote&FormAction=INDEXVIEW');

        }, 1000)


        setTimeout(function () {

            ShowMessage('success', 'Success!', "Updated Successfully");

        }, 2000)
    }
   
   
}


function IsShiftClosed() {
    var isShiftStarted = false;
 
        $.ajax({
            url: "./Services/Accounts/CashRegisterService.svc/IsShiftClosed/" + userContext.UserSNo,
            contentType: "application/json; charset=utf-8",
            type: 'GET',
            cache: false,
            async: false,
            success: function (result) {
                isShiftStarted = result.IsShiftClosedResult;
            },
            error: function (err) {
            }
        });
        return isShiftStarted;
    }



