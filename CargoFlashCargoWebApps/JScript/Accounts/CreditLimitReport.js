var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

   // cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "CreditLimitReport_Airline", clearnext, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "CLR_Airline", clearnext, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "OfficeName", "CreditLimitReport_AirlineOffice", clearagent, "contains");
    cfi.AutoCompleteV2("AccountSNo", "AgentName", "CreditLimitReport_AirlineOfficeAgent", promptMsg, "contains"); 
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "DirectPayment_Currency", checkExchangeRate, "contains");
    cfi.AutoCompleteV2("TransactionMode", "Mode", "CreditLimitReport_TransactionMode", null, "contains");
    $('#SearchTransactionHistory').removeClass('button');
    $('#SearchTransactionHistory').addClass('btn btn-success');
    // added 2017-10-27
    $("#SearchTransactionHistory").closest('td').attr('colspan', '3');
    $('#AirlineSNo').val(userContext.AirlineSNo);
    $('#Text_AirlineSNo').val(userContext.AirlineCarrierCode);
    $('#CurrencySNo').val(userContext.CurrencySNo);
    $('#Text_CurrencySNo').val(userContext.CurrencyCode + '-' + userContext.CurrencyName);
    if (userContext.GroupName == "ADMIN") {
        $('#AirlineSNo').val(userContext.AirlineSNo);
        $('#Text_AirlineSNo').val(userContext.AirlineCarrierCode);
        //$('#OfficeSNo').val(userContext.OfficeSNo);
        //$('#Text_OfficeSNo').val(userContext.OfficeName);
        //$('#AccountSNo').val(userContext.AgentSNo);
        //$('#Text_AccountSNo').val(userContext.AgentName);
        // $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
    }
    else if (userContext.GroupName == "AGENT" || userContext.GroupName == "AJC") {
        $('#AirlineSNo').val(userContext.AirlineSNo);
        $('#Text_AirlineSNo').val(userContext.AirlineCarrierCode);
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
        $('#OfficeSNo').val(userContext.OfficeSNo);
        $('#Text_OfficeSNo').val(userContext.OfficeName);
        $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
        $('#AccountSNo').val(userContext.AgentSNo);
        $('#Text_AccountSNo').val(userContext.AgentName);
        $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
      
    }
  
    var todaydate = new Date();
    var validTodate = $("#ValidTo").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("#ValidFrom").change(function () {

        if (Date.parse($("#ValidFrom").val()) > Date.parse($("#ValidTo").val())) {
            $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
            $("#ValidTo").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#ValidFrom").val()) < Date.parse($("#ValidTo").val())) {
            $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
        }
        else if (isNaN(Date.parse($("#ValidTo").val())) == true) {
            $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
            $("#ValidTo").data("kendoDatePicker").value('');
        }

    });

    // Date picker
    //if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() == "JT") {

    //}
    //var todaydate = new Date()
    //$("#ValidFrom").data('kendoDatePicker').max(todaydate);
    ////$("#ValidTo").data('kendoDatePicker').max(todaydate);
    //$("#ValidFrom").kendoDatePicker({
    //    change: clearDate
    //});
    //$("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    //$("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');
    //$("#ValidTo,#ValidFrom").closest("span").width(100);
    //$("#ValidFrom").data('kendoDatePicker').value('');
    //$("#ValidTo").data('kendoDatePicker').value('');
    //$("#ValidFrom").data('kendoDatePicker').max(todaydate);
    //$("#ValidTo").data('kendoDatePicker').max(todaydate);

    var str = '<input type="radio" name="CustomerType" checked="True" id="CustomerType" value="0">Transaction Report <input type="radio" tabindex="3" name="CustomerType" id="CustomerType" value="1">BG Report ';
    $(".formbuttonrow").closest('tr td').html(str);
    
    // Add New Agent Office Radio On 16-Jul-2018 ,by UMAR ==================================================================================================================
    //$(".formbuttonrow1").closest('tr td').html(str1);

    $(".formbuttonrow").attr('colspan', 1)
    var str1 = '<td class="formbuttonrow" colspan="3"><div id="divAgentOffice"><input type="radio" name="AgentOfficeType" checked="True" id="AgentOfficeType" value="0">Agent Type <input type="radio" tabindex="4" name="AgentOfficeType" id="AgentOfficeType" value="1">Office Type </div></td>'
    
    $("#tbl > tbody tr:eq(1)").append(str1);

    // Add AwBNo and RefNo Radio By UMAR ON 27-Jul-2018
    //$('#searchAWBNo').attr('checked', false);
  

    var strawbno = '<td class="formInputcolumn" colspan="3"><input type="hidden" name="searchAWBNo" id="searchAWBNo" value="">'
    strawbno += '<span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-default" unselectable="on" style="width: 100%; text-transform: uppercase;">'
    strawbno += '<input type="text" class="k-input" name="Text_searchAWBNo" id="Text_searchAWBNo" tabindex="5" controltype="autocomplete" colname="awb no." maxlength="20" value="" placeholder="AWB No." data-role="autocomplete" autocomplete="off" style="width: 175px; text-transform: uppercase;">'
    strawbno += '<span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span></td>'

    var strawbref = '<td class="formInputcolumn" colspan="3"><input type="hidden" name="searchReferenceNo" id="searchReferenceNo" value="">'
    strawbref += '<span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-default" unselectable="on" style="width: 100%; text-transform: uppercase;">'
    strawbref += '<input type="text" class="k-input" name="Text_searchReferenceNo" id="Text_searchReferenceNo" tabindex="6" controltype="autocomplete" colname="reference no." maxlength="50" value="" placeholder="Reference No." data-role="autocomplete" autocomplete="off" style="width: 175px; text-transform: uppercase;">'
    strawbref +='<span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span></td>'

    //var strAwbRefRadio = '<td class="formlabel" colspan="1"><input type="radio" name="AwbRefType" id="AwbRefType" value="0">AWB NO. <input type="radio" tabindex="4" name="AwbRefType" id="AwbRefType" value="1">REFERENCE NO.</td>'
      
    $("#tbl").append("<tr><td  class='formlabel' colspan='1'><input type='radio' name='AwbRefType' id='AwbRefType' value='0'>AWB NO. <input type='radio' tabindex='4' name='AwbRefType' id='AwbRefType' value='1'>REFERENCE NO.</td>  " + strawbno + " </tr>");
  
    cfi.AutoCompleteV2("searchAWBNo", "AWBNumber", "AWB_SearchAWBNoCreditLimitReport", null, "contains");
    cfi.AutoCompleteV2("searchReferenceNo", "ReferenceNumber", "AWB_RefNoSearchCreditLimitReport", null, "contains");

    $(':input').removeAttr('placeholder');

    // For GSA Office Login Checked Only G9 case by umar
    if (userContext.SysSetting.ClientEnvironment == "G9" && userContext.OfficeSNo > 0 && userContext.AgentSNo == "0") {
        // if (userContext.OfficeSNo == '' ? 0 : userContext.OfficeSNo > 0 && userContext.AgentSNo == "0") {     
            $('#AirlineSNo').val(userContext.AirlineSNo);
            $('#Text_AirlineSNo').val(userContext.AirlineCarrierCode);
            $('#OfficeSNo').val(userContext.OfficeSNo);
            $('#Text_OfficeSNo').val(userContext.OfficeName);
            $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
            $('[name="AgentOfficeType"][value="0"]').attr('disabled', true);
            $('[name="AgentOfficeType"][value="1"]').attr('checked', true);
            $('[name="AgentOfficeType"][value="1"]').attr('disabled', true);
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);

       // }
    }


    $('[type="radio"][id="AwbRefType"]').on('change', function () {
        var checkAwb1 = parseInt($(this).val());
      
        if (checkAwb1 == 1) {
            $("#searchAWBNo").closest("td").remove();
            $("#searchReferenceNo").closest("td").remove();
            $("#tbl > tbody tr:eq(6)").append(strawbref);
            cfi.AutoCompleteV2("searchReferenceNo", "ReferenceNumber", "AWB_RefNoSearchCreditLimitReport", null, "contains");
        }

        else {
            $("#searchReferenceNo").closest("td").remove();
            $("#searchAWBNo").closest("td").remove();
            $("#tbl > tbody tr:eq(6)").append(strawbno);
            cfi.AutoCompleteV2("searchAWBNo", "AWBNumber", "AWB_SearchAWBNoCreditLimitReport", null, "contains");
        }     

    });


    // END ===================================================================================================================================================================

    // Add Agent/Office Radio By UMAR
    var CheckAgent = $('#AgentOfficeType').val();
    if (CheckAgent=="0")
    {
        $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
        
    }
    
    $('[type="radio"][id="AgentOfficeType"]').on('change', function () {
        var checkAgentOffice = parseInt($(this).val());
        if(checkAgentOffice==0)
        {          
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(true);
            $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
            $('#Text_OfficeSNo, #OfficeSNo').val('');
            $('[type="radio"][id="AwbRefType"]').attr('checked', false);
            $('#Text_searchReferenceNo,#searchReferenceNo').val('');
            $('#Text_searchAWBNo,#searchAWBNo').val('');
            $(':input').removeAttr('placeholder');
            //$('#tblCreditLimitReport tbody tr').remove();
            $('#tblCreditLimitReport').hide();
        }
        else
        {        
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $('#Text_OfficeSNo').data("kendoAutoComplete").enable(true);
            //$('#Text_CurrencySNo, #CurrencySNo').val('');
            $('#Text_AccountSNo, #AccountSNo').val('');
            $('[type="radio"][id="AwbRefType"]').attr('checked', false);
            $('#Text_searchReferenceNo,#searchReferenceNo').val('');
            $('#Text_searchAWBNo,#searchAWBNo').val('');
            $(':input').removeAttr('placeholder');
            //$('#tblCreditLimitReport tbody tr').remove();
            $('#tblCreditLimitReport').hide();
        }
    })

    // END  ======================================================================

    $('[type="radio"][id="CustomerType"]').on('change', function () {
       var check =parseInt( $(this).val());
       if (check == 1) {
    //        $("#Text_OfficeSNo").removeAttr('data-valid');
    //        $("#spnOfficeSNo").closest('td').find('font').text("")
            //$('#Text_CurrencySNo').data("kendoAutoComplete").enable(false);
            $('#Text_CurrencySNo').removeAttr('data-valid');
            $('[type="radio"][id="AwbRefType"]').attr('checked', false);
            $('#Text_searchReferenceNo,#searchReferenceNo').val('');
            $('#Text_searchAWBNo,#searchAWBNo').val('');
            $(':input').removeAttr('placeholder');
            //$('#tblCreditLimitReport tbody tr').remove();
            $('#tblCreditLimitReport').hide();
           //$('#Text_CurrencySNo, #CurrencySNo').val('');
           
      }
        else{
    //        $("#Text_OfficeSNo").attr("data-valid", 'required');
    //        $("#spnOfficeSNo").closest('td').find('font').text("*")
            $('#Text_CurrencySNo').data("kendoAutoComplete").enable(true);
            $('#Text_CurrencySNo').attr('data-valid', 'required');
            $('[type="radio"][id="AwbRefType"]').attr('checked', false);
            $('#Text_searchReferenceNo,#searchReferenceNo').val('');
            $('#Text_searchAWBNo,#searchAWBNo').val('');
            $(':input').removeAttr('placeholder');
            //$('#tblCreditLimitReport tbody tr').remove();
            $('#tblCreditLimitReport').hide();           
       }
    })

    // For Hide Agent Office type for GA by umar  
    //if (userContext.SysSetting.IsHideCreditLimitReport == "FALSE") {
    //    //$('#divAgentOffice').hide();    Commented by UMAR , discussed with PK/Neha for TFS : 11603 (18-Jun-19)
    //    //$('#divAgentOffice').show();
    //    $('#Text_OfficeSNo').data("kendoAutoComplete").enable(true);
    //}
   

    if (userContext.AgentSNo > 0) {
        $(".formbuttonrow  input")[3].nextSibling.textContent = '';
        $("input[name=AgentOfficeType][value='1']").hide();
        $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
    }
        //if (userContext.OfficeSNo > 0 && userContext.AgentSNo == 0) {
        //    $(".formbuttonrow  input")[2].nextSibling.textContent = '';
        //    $("input[name=AgentOfficeType][value='0']").hide();
        //}
});



function clearDate() {
    if ($("#ValidTo").data('kendoDatePicker').value() < $("#ValidFrom").data('kendoDatePicker').value()) {
        $("#ValidTo").data('kendoDatePicker').value('');
    }
    $("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());
    $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');
    $("#ValidTo,#ValidFrom").closest("span").width(100);
}

//end

var strData = [];
var wCondition = "";
var pageType = $('#hdnPageType').val();
var Model = [];
function CreateCreditLimitReportGrid() {
    var dbtableName = "CreditLimitReport";
    Model = {
        AccountSNo: $("#AccountSNo").val() == "" ? "0" : $("#AccountSNo").val(),
        officeSno: $("#OfficeSNo").val() == "" ? "0" : $("#OfficeSNo").val(),
        CurrencySNo: $("#CurrencySNo").val() == "" ? "0" : $("#CurrencySNo").val(),
        TransactionMode: $('#Text_TransactionMode').val() == "" ? "0" : $('#Text_TransactionMode').val(),
        IsBGREport: $('[type="radio"][id="CustomerType"]:checked').val() == "" ? "0" : $('[type="radio"][id="CustomerType"]:checked').val(),
        BgType: $('[type="radio"][id="AgentOfficeType"]:checked').val() == "" ? "0" : $('[type="radio"][id="AgentOfficeType"]:checked').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1),
        page: 1,
        pageSize: 100000,
        ValidFrom: $('#ValidFrom').val(),
        ValidTo: $('#ValidTo').val(),
        sort: ""
 
    };
    //wCondition = BindWhereCondition();
    if (OnBlob) {
        $.ajax({
            url: "../Reports/CreditLimitReport",
            async: true,
            type: "GET",
            dataType: "json",
            data: Model,
            success: function (result) {

                var data = result.Table0[0].ErrorMessage.split('~');

                if (parseInt(data[0]) == 0)
                    ShowMessage('success', 'Reports!', data[1]);
                else
                    ShowMessage('warning', 'Reports!', data[1]);
            }
        });
    }
    else {
        
        $("#tblCreditLimitReport").appendGrid({
            V2: true,
            tableID: "tbl" + dbtableName,
            tableColumns: 'SNo',
            masterTableSNo: 1,
            isExtraPaging: true,
            currentPage: 1,
            itemsPerPage: 10, model: BindWhereCondition(), sort: "",
            contentEditable: false,
            servicePath: "Services/Accounts/CreditLimitReportService.svc",
            getRecordServiceMethod: "GetCreditLimitReportRecord",
            deleteServiceMethod: "",
            caption: "Credit Limit Report",
            initRows: 1,
            isGetRecord: true,
            columns: [
                { name: "SNo", type: "hidden" },
                userContext.SysSetting.ICMSEnvironment == 'GA' ? { name: "RefNumber", display: "Booking Ref No", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false } : { name: "RefNumber", type: "hidden" },
                //{ name: "RefNumber", display: "Booking Ref No", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
                { name: "Reference", display: "AWB No", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
                { name: "OfficeName", display: "Office Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "AgentName", display: "Agent Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "Type", display: "Type", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "Product", display: "Product", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "Commodity", display: "Commodity", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ExchangeCurrency", display: "Exchange Currency", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ExchangeRate", display: "Exchange Rate", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ChargeableWeight", display: "Chargeable Weight", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "TariffRate", display: "Tariff Rate", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "CreditLimit", display: "Max. Credit Limit", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "RemainingCreditLimit", display: "Balance Credit Limit", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "DebitAmount", display: "Debit Amount", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "CreditAmount", display: "Credit Amount", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "PaymentCurrency", display: "Payment Currency", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                 { name: "Cancel", display: "AWB Status", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "Transaction_Mode", display: "Transaction Mode", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "BankName", display: "Bank Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ReferenceNo", display: "Payment Reference", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "Remarks", display: "Remarks", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "TransactionDate", display: "Transaction Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "PenaltyCharges", display: "Penalty Charges", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                 { name: "BookingStatus", display: "Event Details", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                 { name: "RequestedBy", display: "Requested By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "RequestedOn", display: "Requested On", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "UpdatedBy", display: "Updated By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            ],
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            },
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                //  $("#tblCreditLimitReport_divStatusMsg").text().replace(' 1 to 10 of', '');
                //$("#tblCreditLimitReport_divStatusMsg").text('');
                ShowLoader(false);
            },
            isPaging: true,
            hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
        })
        $('#tblCreditLimitReport_btnRemoveLast').remove();
        $('#tblCreditLimitReport_btnAppendRow').remove();
        //  $("#tblCreditLimitReport").appendGrid('hideColumn', '');
    }
}
//--------------------------- bg Report-----------------------------------------------
function CreateBGReport() {
    var dbtableName = "CreditLimitReport";
    Model = {
        AccountSNo: $("#AccountSNo").val() == "" ? "0" : $("#AccountSNo").val(),
        officeSno: $("#OfficeSNo").val() == "" ? "0" : $("#OfficeSNo").val(),
        CurrencySNo: $("#CurrencySNo").val() == "" ? "0" : $("#CurrencySNo").val(),
        TransactionMode: $('#Text_TransactionMode').val() == "" ? "0" : $('#Text_TransactionMode').val(),
        IsBGREport: $('[type="radio"][id="CustomerType"]:checked').val() == "" ? "0" : $('[type="radio"][id="CustomerType"]:checked').val(),
        BgType: $('[type="radio"][id="AgentOfficeType"]:checked').val() == "" ? "0" : $('[type="radio"][id="AgentOfficeType"]:checked').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1),
        page: 1,
        pageSize: 100000,
        ValidFrom: $('#ValidFrom').val(),
        ValidTo: $('#ValidTo').val(),
        sort:""
    };
    if (OnBlob) {
        $.ajax({
            url: "../Reports/CreateBGReport",
            async: true,
            type: "GET",
            dataType: "json",
            data: Model,
            success: function (result) {

                var data = result.Table0[0].ErrorMessage.split('~');

                if (parseInt(data[0]) == 0)
                    ShowMessage('success', 'Reports!', data[1]);
                else
                    ShowMessage('warning', 'Reports!', data[1]);
            }
        });
    }
    else {
       
        //wCondition = BindWhereCondition();
        $("#tblCreditLimitReport").appendGrid({
            V2: true,
            tableID: "tbl" + dbtableName,
            tableColumns: 'SNo',
            masterTableSNo: 1,
            isExtraPaging: true,
            currentPage: 1,
            itemsPerPage: 10, model: BindWhereCondition(), sort: "",
            contentEditable: false,
            servicePath: "Services/Accounts/CreditLimitReportService.svc",
            getRecordServiceMethod: "GetCreditLimitBGRecord",
            deleteServiceMethod: "",
            caption: "BG Report",
            initRows: 1,
            isGetRecord: true,
            columns: [
                { name: "SNo", type: "hidden" },
                { name: "ReferenceNumber", display: "Reference Number", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "text" }, isRequired: false },
                { name: "Office", display: "Office", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "AgentName", display: "Agent Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ParticipantId", display: "ParticipantId", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "MaxCreditlimit", display: "Max Credit limit", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                //{ name: "BalanceCreditlimit", display: "Balance Credit limit", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                  { name: "Amount", display: "Payment Amount", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                  { name: "CurrencyCode", display: "Payment Currency", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "BGReferencenumber", display: "BGReferencenumber", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                 { name: "TransactionDate", display: "Transaction Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ValidFrom", display: "Validity from date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ValidTo", display: "Valid to (expired date)", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "Transactiontype", display: "Transaction type", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "Status", display: "Status", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "RequestedBy", display: "Requested By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "RequestedOn", display: "Requested On", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ApprovedBy", display: "Approved By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                { name: "ApproveDate", display: "Approved Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },

                //{ name: "PaymentCurrency", display: "Payment Currency", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                //{ name: "BookingStatus", display: "AWB/Ref No. Status", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                //{ name: "Transaction_Mode", display: "Transaction Mode", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                //{ name: "TransactionDate", display: "Transaction Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                //{ name: "PenaltyCharges", display: "Penalty Charges", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                //{ name: "Cancel", display: "Booking Status", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
                //{ name: "UpdatedBy", display: "Updated By", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
            ],
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            },
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                ShowLoader(false);
                //  $("#tblCreditLimitReport_divStatusMsg").text().replace(' 1 to 10 of', '');
                //$("#tblCreditLimitReport_divStatusMsg").text('');

            },
            isPaging: true,
            hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
        })
        $('#tblCreditLimitReport_btnRemoveLast').remove();
        $('#tblCreditLimitReport_btnAppendRow').remove();
    }
}


function BindWhereCondition() {
    return {
        OfficeSNo: $("#Text_OfficeSNo").data("kendoAutoComplete").key() || 0,
        AccountSNo: $("#Text_AccountSNo").data("kendoAutoComplete").key() || 0,
        ValidFrom: $('#ValidFrom').val(),
        ValidTo: $('#ValidTo').val(),
        CurrencySNo: $('#CurrencySNo').val() == "" ? 0 : $('#CurrencySNo').val(),
        AirlineSNo: $('#AirlineSNo').val(),
        TransactionMode: $('#Text_TransactionMode').val(),
        //AwbRefType: $("#searchReferenceNo").val() == "" || $("#searchAWBNo").val() == "" ? 0 : $("#Text_searchReferenceNo").data("kendoAutoComplete").key() || 0,
        AwbRefType: $("#Text_searchReferenceNo").val() == "" || $("#Text_searchAWBNo").val() == "" ? 0 : $("#searchReferenceNo").val(),      
        AwbNumber: $("#Text_searchAWBNo").val() == "" || $("#Text_searchReferenceNo").val() == "" ? 0 : $("#searchAWBNo").val(),
        BgType: $('[type="radio"][id="AgentOfficeType"]:checked').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)
        
    };
}

// Add CurrencyChange function by UMAR on 13-Sep-2018
function CurrencyChange() {
    try {
        $.ajax({
            type: "GET",
            url: "./Services/Accounts/CreditLimitReportService.svc/GetCurrencyInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#AirlineSNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#CurrencySNo').val(FinalData[0].SNo);
                    $('#Text_CurrencySNo').val(FinalData[0].CurrencyName);
                }
            }
        });

    }
    catch (exp) { }

}

// checks for GSA User as per selected Airline
function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;     
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}

function ExtraCondition(textId) {
    var filter1 = cfi.getFilter("AND");
    // Add AwbNo And Ref No of Agent Wise By Umar 

    //if (textId == "Text_AirlineSNo") {
    //    cfi.getFilter(filter1, "AirlineSNo", "eq", userContext.AirlineSNo);
    //    var firAirline = cfi.autoCompleteFilter([filter1]);
    //    return firAirline;
    //}
    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filter1, "IsInterline", "eq","0");
        var firAirline = cfi.autoCompleteFilter([filter1]);
        return firAirline;
    }

    if (textId == "Text_searchAWBNo") {
        if (($('[id=AwbRefType][value ="0"]').is(':checked') == false && $('[id=AwbRefType][value ="1"]').is(':checked') == false) == true) {
            ShowMessage('warning', 'Warning - Credit Limit Report', "Please Select AWB Number OR Reference Number First.");
            cfi.setFilter(filter1, "AWBNumber", "eq", "0")
            cfi.setFilter(filter1, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter2;
        }
        else {
            if ($("#AccountSNo").val() != '') {
                try {
                    cfi.setFilter(filter1, "AccountSNo", "eq", $("#AccountSNo").val())
                    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
                    return OriginCityAutoCompleteFilter2;
                }
                catch (exp)
                { }
            }
        }
    }

    if (textId == "Text_searchReferenceNo") {
        if (($('[id=AwbRefType][value ="0"]').is(':checked') == false && $('[id=AwbRefType][value ="1"]').is(':checked') == false) == true) {
            ShowMessage('warning', 'Warning - Credit Limit Report', "Please Select AWB Number OR Reference Number First.");
            cfi.setFilter(filter1, "AWBNumber", "eq", "0")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter2;
        }
        else {
            if ($("#AccountSNo").val() != '') {
                try {
                    cfi.setFilter(filter1, "AccountSNo", "eq", $("#AccountSNo").val())
                    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
                    return OriginCityAutoCompleteFilter2;
                }
                catch (exp)
                { }
            }
        }
    }

    // END AwbNo And Ref No of Agent Wise

    // Add for Awb No By UMAR
    if (textId == "Text_searchAWBNo") {
        if (($('[id=AwbRefType][value ="0"]').is(':checked') == false && $('[id=AwbRefType][value ="1"]').is(':checked') == false) == true) {
            ShowMessage('warning', 'Warning - Credit Limit Report', "Please Select AWB Number OR Reference Number First.");
            cfi.setFilter(filter1, "AWBNumber", "eq", "0")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter2;
        }
        else {
            if ($("#OfficeSNo").val() != '') {
                try {
                    // checks for GSA User 
                    if (userContext.SysSetting.ClientEnvironment == "G9" && userContext.OfficeSNo > 0 && userContext.AgentSNo == "0") {
                        cfi.setFilter(filter1, "OfficeSNo", "eq", userContext.OfficeSNo);
                    }
                    else {
                        cfi.setFilter(filter1, "OfficeSNo", "eq", $("#OfficeSNo").val());
                    }
                    
                    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
                    return OriginCityAutoCompleteFilter2;
                }
                catch (exp)
                { }
            }
        }
    }
    
    // Add for Awb Ref Number By UMAR
    if (textId == "Text_searchReferenceNo") {
        if (($('[id=AwbRefType][value ="0"]').is(':checked') == false && $('[id=AwbRefType][value ="1"]').is(':checked') == false) == true) {
            ShowMessage('warning', 'Warning - Credit Limit Report', "Please Select AWB Number OR Reference Number First.");
            cfi.setFilter(filter1, "ReferenceNumber", "eq", "0")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter2;
        }
        else {
            if ($("#OfficeSNo").val() != '') {
                try {
                    // checks for GSA User 
                    if (userContext.SysSetting.ClientEnvironment == "G9" && userContext.OfficeSNo > 0 && userContext.AgentSNo == "0") {
                        cfi.setFilter(filter1, "OfficeSNo", "eq", userContext.OfficeSNo);
                    }

                    cfi.setFilter(filter1, "OfficeSNo", "eq", $("#OfficeSNo").val())
                    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
                    return OriginCityAutoCompleteFilter2;
                }
                catch (exp)
                { }
            }
        }
    }
    // End 
    
    if (textId == "Text_OfficeSNo") {
        if ($("#AirlineSNo").val() == '') {
            ShowMessage('info', 'Need your Kind Attention!', " Select Airline first");
        }
        try {
            cfi.setFilter(filter1, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }

    if (textId == "Text_AccountSNo") {
        if ($("#AirlineSNo").val() == '' ) {
            ShowMessage('info', 'Need your Kind Attention!', " Select Airline first");
        }
        try {
            cfi.setFilter(filter1, "Branch", "eq", "0")
            cfi.setFilter(filter1, "AirlineSNo", "eq", $("#AirlineSNo").val()) // Auto fill Agent drop down as per selected Airline by UMAR ON 11-Oct-2016
            if ($("#Text_OfficeSNo").val() != "")
                cfi.setFilter(filter1, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter4 = cfi.autoCompleteFilter([filter1]);
            return OriginCityAutoCompleteFilter4;
        }
        catch (exp)
        { }
    }

    ////////////////////
    
    //    try {
    //       // cfi.setFilter(filter1, "Branch", "eq", "0")
    //        if ($("#Text_AirlineSNo").val() != "")
    //            //cfi.setFilter(filter1, "SNo", "eq", $("#AirlineSNo").data("kendoAutoComplete").key())
    //            cfi.setFilter(filter1, "SNo", "in", $("#Text_AirlineSNo").data("kendoAutoComplete").key())
    //        var OriginCityAutoCompleteFilter4 = cfi.autoCompleteFilter([filter1]);
    //        return OriginCityAutoCompleteFilter4;
    //    }
    //    catch (exp)
    //    { }
    //}
    ///////////////////

    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
}

$('#SearchTransactionHistory').click(function (e) {
    checkExchangeRate();
    if (!cfi.IsValidSubmitSection()) {
        return false;
    };
    $("#exportflight").remove();
    $('#tblCreditLimitReport').hide();
    if (($('#AirlineSNo').val() == "" )) {
        ShowMessage('info', 'Need your Kind Attention!', " Select Airline");
    }
    else if ($("#Text_AccountSNo").val() == "" && $("#Text_OfficeSNo").val() == "" && $('[type="radio"][id="CustomerType"]:checked').val() == "0") {
        ShowMessage('info', 'Need your Kind Attention!', "Select Either Office Or Agent");
        return;
    }
    //else if ($("#Text_AccountSNo").val() == "" && $("#Text_OfficeSNo").val() == "" && $('[type="radio"][id="CustomerType"]:checked').val() == "1") {
    //    ShowMessage('info', 'Need your Kind Attention!', "Select Either Office Or Agent");
    //    return;
    //}  
    if ($("#CurrencySNo").val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Currency");
    }
    else if ($('#ValidFrom').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Valid From Date")
    }
    else if ($('#ValidTo').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Valid To Date")
    }
    else {
        $('#tblCreditLimitReport').show();
        ShowLoader(true);
        $('[type="radio"][id="CustomerType"]:checked').val()== "0" ? CreateCreditLimitReportGrid() :  CreateBGReport()
        //  if (getQueryStringValue("FormAction").toUpperCase() == "NEW"){
        if ($('#tblCreditLimitReport_Type_1').length < 1 && $('#tblCreditLimitReport_ReferenceNumber_1').length < 1) {
            //ShowMessage('info', 'Need your Kind Attention!', " No Record Found For Given Parameters");
            //$('#tblCreditLimitReport').hide();
            $('#tblCreditLimitReport').show(); // If there is no data then grid bind empty, add by UMAR on 09-Aug-2018
        }
        else {
            $('#SearchTransactionHistory').closest('td').append('<div id="exportflight" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"></div>');
           
        }
    }

    $("#divCreditLimitReport").attr('style', 'overflow-x: scroll');
});
function clearnext() {
    CurrencyChange();
    $('#OfficeSNo').val('');
    $('#Text_OfficeSNo').val('');
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');
}
function clearagent() {
    if ($("#AirlineSNo").val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', " Select Airline first");
    }
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');

}

function ExportToExcel() {
 
    var AccountSNo = $("#AccountSNo").val() == "" ? "0" : $("#AccountSNo").val();
    var officeSno = $("#OfficeSNo").val() == "" ? "0" : $("#OfficeSNo").val();
    var CurrencySNo = $("#CurrencySNo").val() == "" ? "0" : $("#CurrencySNo").val();
    var TransactionMode = $('#Text_TransactionMode').val() || "";
    var IsBGREport = parseInt($('[type="radio"][id="CustomerType"]:checked').val());
    var IsAutoProcess= (OnBlob == true ? 0 : 1);
    var BgType = $('[type="radio"][id="AgentOfficeType"]:checked').val(); // Add by Umar 18-Jun-19 for TFS:(11603)
    // Changes By Vipin Kumar
    var Env = userContext.SysSetting["ICMSEnvironment"].toUpperCase()
    window.onbeforeunload = null;
    window.location.href = "../DataSetToExcel/DataSetToExcelFile?officeSno=" + officeSno + "&AccountSNo=" + AccountSNo + "&ValidFrom=" + $("#ValidFrom").val() + "&ValidTo=" + $("#ValidTo").val() + "&AirlineSNo=" + $("#AirlineSNo").val() + "&CurrencySNo=" + CurrencySNo + "&IsBGREport=" + IsBGREport + "&TransactionMode=" + TransactionMode + "&BgType=" + BgType + "&Env=" + Env + "&IsAutoProcess=" + IsAutoProcess;
   
  
}
function promptMsg() {
    if ($("#AirlineSNo").val() == '' ) {
        ShowMessage('info', 'Need your Kind Attention!', " Select Airline");
    }
}

function checkExchangeRate() {
   
    if ($("#Text_AirlineSNo").val() == "") {
        ShowMessage('warning', 'Warning - Credit Limit Report', "Select Airline");
        $("#CurrencySNo, #Text_CurrencySNo").val('');
        return false;
    }
    else {
        var currency = $("#CurrencySNo").val();
        var AirlineSNo = $("#AirlineSNo").val();
        if (currency != "") {
            $.ajax({
                url: "../Services/Accounts/DirectPaymentService.svc/GetExchangeRate", async: false, type: "GET", dataType: "json", cache: false,
                data: { currency: currency, Mode: 2, AirlineSNo: AirlineSNo },  // 2 from report
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != undefined && result.length > 0) {

                        var ResultData = jQuery.parseJSON(result);
                        var FromCurrency = ResultData.Table0[0]["FromCurrency"]
                        var ToCurrency = ResultData.Table0[0]["ToCurrency"]
                        if (ResultData.Table0[0]["Error"] == "2") {
                            ShowMessage('warning', 'Warning - Credit Limit Report', "Exchange Rate Not Available for: " + FromCurrency + " To " + ToCurrency + "");
                            $("#CurrencySNo").val('');
                            $("#Text_CurrencySNo").val('');
                        }

                        // createAgentBankGurantee(FinalData);
                        //   $("#ValidFromDate").text(FinalData[0].ValidFrom);
                        //   $("#ValidToDate").text(FinalData[0].ValidTo);
                    }
                }
            });
        }
    }
}
