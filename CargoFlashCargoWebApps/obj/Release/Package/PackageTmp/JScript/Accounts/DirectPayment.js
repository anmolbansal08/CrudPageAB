$(document).ready(function () {
    $('#MasterSaveAndNew').remove();
    cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode", ["CarrierCode", "AirlineName"], GetAirlineCurrency, "contains");
    cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode@", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("City", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], ClearOffice, "contains");
    // cfi.AutoComplete("Office", "Name", "vCreditLimitOffice", "SNo", "Name", ["Name"], ClearAgent, "contains");
    cfi.AutoComplete("Office", "Name", "DirectPay_View_GetOffice", "SNo", "Name", ["Name"], GetOfficeData, "contains");
    cfi.AutoComplete("Agent", "Name", "CreditLimitUpdateAgents", "SNo", "Name", ["Name"], GetAgentData, "contains");
    //cfi.AutoComplete("Agent", "Name", "CreditLimitUpdateAgents", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("TransectionModeSNo", "Mode", "VTransectionMode", "SNo", "Mode", ["Mode"], OnSelectTrans, "contains");
    
    $("input[type='radio'][id='UpdateType']").removeAttr('checked');
    $('#Text_Office').attr('data-valid', 'required');
    var date = new Date();
    date = (date.toLocaleDateString("en-au", { year: "numeric", month: "short", day: "numeric" }).replace(/\s/g, '-')).replace('.', '');
    $('#PaymentDate').val(date);
    $('span#PaymentDate').text(date);
    // var todaydate = new Date();
    //$('#ChequeDate').val(todaydate);
    //$('#ChequeDate').text(todaydate);
    // $('#ChequeDate').focus('');

    var todaydate = new Date();
    var validfromdate = $("#ChequeDate").data("kendoDatePicker");
    validfromdate.min(todaydate);

    $('#Text_Agent').data("kendoAutoComplete").enable(false);


    OnSelectTrans();
    $("#__SpanHeader__").css("color", "black");

    $("#btnSaveRateMaster").unbind("click").bind("click", function () {
        if (cfi.IsValidSubmitSection()) {
            SaveTaxRateDetailsMaster("NEW");

        }
    });

});

var amount = 0;
var creditlimit = 0;
var balance = 0;
var total = 0;
var credit = 0;

$('input[type="radio"][name="PaymentBy"]').click(function () {
   
    if (this.value == 1) {
       
        cfi.ResetAutoComplete("Office");
        $('spn#Office').text('');
        $('span#ExistingCreditLimit').text('');
        $('span#CreditLimit').text('');
        $('span#AccountNo').text('');
        $('#Text_Office').attr('disabled', true);
        $('#Text_Agent').attr('disabled', false);
        $('#Text_Office').data("kendoAutoComplete").enable(false);
        $('#Text_Agent').data("kendoAutoComplete").enable(true);
    }
    else {
        cfi.ResetAutoComplete("Agent");
        $('spn#Agent').text('');
        $('span#ExistingCreditLimit').text('');
        $('span#CreditLimit').text('');
        $('span#AccountNo').text('');
        $('#Text_Agent').attr('disabled', true);
        $('#Text_Office').attr('disabled', false);
        $('#Text_Agent').data("kendoAutoComplete").enable(false);
        $('#Text_Office').data("kendoAutoComplete").enable(true);
   
    }
});



/*updated by shahbaz akhtar on -29-12-2016 : purpose - for binding agent dropdown on the basis of office
and for hide bank guarantee if agent type is topup*/

function GetAirlineCurrency() {
    var AirlineCode = $("#Airline").val();
    if (AirlineCode != "") {
        $.ajax({
            url: "Services/Accounts/DirectPaymentService.svc/GetAirlineCurrency?AirlineSNo=" + AirlineCode, async: true, type: "GET", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "" && result != null) {
                    var ResultData = jQuery.parseJSON(result);
                    if (ResultData.Table0.length > 0) {

                        $("#hdnCurrencySNo").val(ResultData.Table0[0].CurrencySNo);
                        $("#Text_CurrencySNo").val(ResultData.Table0[0].CurrencyCode);
                        $("#CurrencySNo").val(ResultData.Table0[0].CurrencySNo);


                    }
                    else {
                        $("#hdnCurrencySNo").val('');
                        $("#Text_CurrencySNo").val('');
                        $("#CurrencySNo").val('');
                    }
                }
            }
        });
    }
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    var filteragent = cfi.getFilter("AND");
    var filterMode = cfi.getFilter("AND");
    if (textId == "Text_Office") {
        try {
            cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Airline").val());
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#City").val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_Agent") {
        try {
            //cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_Office").data("kendoAutoComplete").key())
            cfi.setFilter(filteragent, "AirlineSNo", "eq", $("#Airline").val());
            cfi.setFilter(filteragent, "CitySNo", "eq", $("#City").val());
            var AgentSno = cfi.autoCompleteFilter([filteragent]);
            return AgentSno;
        }
        catch (exp)
        { }
    }
    
    if (textId == "Text_Airline") {
        try {
            cfi.setFilter(filterAirline, "IsInterline", "eq", 0)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
  
    if (textId == "Text_TransectionModeSNo") {
        try {
            if (TransactionType == 0) {
                cfi.setFilter(filterMode, "TranscationType", "eq", 0);
            }

            var Mode = cfi.autoCompleteFilter([filterMode]);
            return Mode;
        }
        catch (exp)
        { }
    }
}

function ClearAgent() {
    cfi.ResetAutoComplete("Agent");
    ResetFields();
}
function ClearOffice() {
    cfi.ResetAutoComplete("Office");

    ResetFields();
}
function ClearCity() {
    cfi.ResetAutoComplete("City");
    cfi.ResetAutoComplete("Office");
    ResetFields();
}
$('input[type="submit"][name="operation"]').click(function () {
    debugger;
    amount = Math.abs($('#Amount').val());
    creditlimit = Math.abs($('span#CreditLimit').html());
    balance = Math.abs($('span#ExistingCreditLimit').html());
    total = balance + amount;
    credit = creditlimit + amount;
    
    if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true && ($('#Amount').val() > Math.abs($('span#ExistingCreditLimit').html())) && (Math.abs($('span#ExistingCreditLimit').html()) <= Math.abs($('span#CreditLimit').html()))) {
        ShowMessage('warning', 'Warning - Direct Payment', "Amount cannot be greater than " + Math.abs($('span#ExistingCreditLimit').html()));
        return false;
    }

    else if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true && ($('#Amount').val() > Math.abs($('span#CreditLimit').html())) && (Math.abs($('span#CreditLimit').html()) <= Math.abs($('span#ExistingCreditLimit').html()))) {
        ShowMessage('warning', 'Warning - Direct Payment', "Amount cannot be greater than " + Math.abs($('span#CreditLimit').html()));
        return false;
    }
        //updated by shahbaz akhtar on -29-12-2016 : purpose - if update type is Decrease: Transaction mode non mandatory
    else if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true) {
        $("#Text_TransectionModeSNo").removeAttr("data-valid");
        $("#Amount").removeAttr("data-valid");
    }

    else if ($('input[type="radio"][name="UpdateType"][value="0"]').is(':checked') == true) {
        if (total > credit)//updated by shahbaz akhtar on -29-12-2016 : purpose - Balance Credit Limit can not be exceed credit limit 
        {
            ShowMessage('warning', 'Warning - Direct Payment', "Balance Credit Limit cannot be greater than " + Math.abs($('span#CreditLimit').html()));
            $("#Amount").val("");
            return false;

        }


    }
    //if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true && ($('#Amount').val() > Math.abs($('span#ExistingCreditLimit').html()))) {
    //    ShowMessage('warning', 'Warning - Direct Payment', "Amount cannot be greater than " + Math.abs($('span#ExistingCreditLimit').html()));
    //    return false;
    //}

});
$('#Amount').on('blur', function () {
    amount = Math.abs($('#Amount').val());
    creditlimit = Math.abs($('span#CreditLimit').html());
    balance = Math.abs($('span#ExistingCreditLimit').html());
    total = balance + amount;
    credit = creditlimit + amount;
   


    if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true && ($('#Amount').val() > Math.abs($('span#ExistingCreditLimit').html())) && (Math.abs($('span#ExistingCreditLimit').html()) <= Math.abs($('span#CreditLimit').html()))) {
        ShowMessage('warning', 'Warning - Direct Payment', "Amount cannot be greater than " + Math.abs($('span#ExistingCreditLimit').html()));

        return false;
    }

    else if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true && ($('#Amount').val() > Math.abs($('span#CreditLimit').html())) && (Math.abs($('span#CreditLimit').html()) <= Math.abs($('span#ExistingCreditLimit').html()))) {
        ShowMessage('warning', 'Warning - Direct Payment', "Amount cannot be greater than " + Math.abs($('span#CreditLimit').html()));

        return false;

    }
    else if ($('input[type="radio"][name="UpdateType"][value="0"]').is(':checked') == true) {
        if (total > credit)//updated by shahbaz akhtar on -29-12-2016 : purpose - Balance Credit Limit can not be exceed credit limit 
        {
            ShowMessage('warning', 'Warning - Direct Payment', "Balance Credit Limit cannot be greater than " + Math.abs($('span#CreditLimit').html()));

            return false;
            $("#Amount").val("");
        }

        //  $("#Amount").val("");

        return true;
    }




    //if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true && ($('#Amount').val() > Math.abs($('span#ExistingCreditLimit').html()))) {
    //    ShowMessage('warning', 'Warning - Direct Payment', "Amount cannot be greater than " + Math.abs($('span#ExistingCreditLimit').html()));
    //    return false;
    //}
});



$("#ChequeNo").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
});

function OnSelectTrans() {
    //var todaydate = new Date();
    //$("#ChequeDate").val(todaydate);
    //$("#ChequeDate").text(todaydate);
    //validfromdate.min(todaydate);
    if ($('#Text_TransectionModeSNo').val() == 'CASH') { //CASH
        resetTransectionFields();
        $('#Text_TransectionModeSNo').closest('tr').nextAll().hide();
        removeValidation();
        $('#UpdateType').closest('td').hide();
        $('#spnUpdateType').closest('td').hide();

    }
    else if ($('#Text_TransectionModeSNo').val() == 'CHEQUE') { //CHEQUE
        resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Cheque Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Cheque Date');
        $('#ChequeDate').attr("data-valid-msg", "Cheque Date cannot be blank");
        $('#ChequeNo').removeAttr('disabled');
        $('#spnChequeNo').closest('td').find('font').text('*');
        $('#ChequeNo').closest('tr').nextAll().hide();
        applyValidation();
        $('#UpdateType').closest('td').hide();
        $('#spnUpdateType').closest('td').hide();

    }
    else if ($('#Text_TransectionModeSNo').val() == 'BANK GUARANTEE' || $('#Text_TransectionModeSNo').val() == 'ONLINE PAYMENT') { //BANK GUARANTEE AND ONLINE PAYMENT
        resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Transaction Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Transaction Date');
        $('#ChequeDate').attr("data-valid-msg", "Transaction Date cannot be blank");
        $('#ChequeNo').attr('disabled', true);
        $('#spnChequeNo').closest('td').find('font').text('');
        $('#ReferenceNo').closest('tr').nextAll().hide();

        applyValidation();
        $('#ChequeNo').removeAttr('data-valid');
        $('#UpdateType').closest('td').hide();
        $('#spnUpdateType').closest('td').hide();
    }
    else if ($('#Text_TransectionModeSNo').val() == 'VIRTUAL UPDATE') {// VIRTUAL UPDATE
        resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Transaction Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Transaction Date');
        $('#ChequeDate').attr("data-valid-msg", "Transaction Date cannot be blank");
        $('#ChequeNo').attr('disabled', true);
        $('#spnChequeNo').closest('td').find('font').text('');
        $('#ReferenceNo').closest('tr').nextAll().hide();
        $('#ReferenceNo').closest('tr').prev().hide().prev().hide();
        $('#UpdateType').closest('td').show();
        $('#spnUpdateType').closest('td').show();
        removeValidation();
        $('#ChequeDate').attr('data-valid', 'required');

    }
    else {
        resetTransectionFields();
        $('#TransectionModeSNo').closest('tr').nextAll().hide();
        removeValidation();
        $('#UpdateType').closest('td').show();
        $('#spnUpdateType').closest('td').show();
    }
}
//var types

//function GetOffice() {

//    var AirlineSNo = $("#Airline").val();
//    var CitySNo = $("#City").val();
//    if (AirlineSNo != "" && CitySNo != "") {
//        $.ajax({
//            url: "Services/Accounts/DirectPaymentService.svc/GetOffice?AirlineSNo=" + AirlineSNo + "&CitySNo=" + CitySNo, async: true, type: "GET", cache: false, contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                if (result != "" && result != null) {
//                    var ResultData = jQuery.parseJSON(result);
//                    if (ResultData.Table0.length > 0) {

//                        //$("#hdnCurrencySNo").val(ResultData.Table0[0].CurrencySNo);
//                        $("#Text_Office").val(ResultData.Table0[0].Name);
//                        $("#Office").val(ResultData.Table0[0].SNo);


//                    }
//                    else {
//                       // $("#hdnCurrencySNo").val('');
//                        $("#Text_Office").val('');
//                        $("#Office").val('');
//                    }
//                }
//            }
//        });
//    }
//}

function GetOfficeData() {

    if ($('#Text_Office').val() != "") {
        OfficeSNo = $('#Office').val();
        $.ajax({
            url: "./Services/Accounts/DirectPaymentService.svc/GetCreditLimitOffice?SNo=" + OfficeSNo, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                resetTransectionFields();
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                ResetFields();

                if (FinalData.length > 0) {
                    //$('span#AccountNo').text(FinalData[0].AccountNo);
                    //$('span#CitySNo').text(FinalData[0].City);
                    $('span#ExistingCreditLimit').text(FinalData[0].RemainingCreditLimit);
                    $('span#CreditLimit').text(FinalData[0].CreditLimit);
                    $('#HdnTransactionType').val(FinalData[0].TransactionType);//updated by shahbaz akhtar on -29-12-2016 : purpose - for getting transaction type

                    //  $("#tbl td:contains('Credit')").html("Topup");

                    var currentRow = $('#HdnTransactionType').val();
                    if (currentRow == 0) {
                        $("td").each(function () {
                            if ($(this).text() == "Credit Limit") {
                                $(this).text("Topup");
                            }
                            if ($(this).text() == "Balance Credit Limit") {
                                $(this).text("Balance Topup");
                            }
                        });
                    }
                    else if (currentRow == 1) {
                        $("td").each(function () {
                            if ($(this).text() == "Topup") {
                                $(this).text("Credit Limit");
                            }
                            if ($(this).text() == "Balance Topup") {
                                $(this).text("Balance Credit Limit");
                            }
                        });
                    }
                }
                else {
                    ShowMessage('warning', 'Warning - Direct Payment', "Office-" + $('#Text_Office').val() + " details not found!!");
                    $('#Office').val('');
                    $('#Text_Office').val('');
                }
            }
        });

    }


}


function GetAgentData() {

    if ($('#Text_Agent').val() != "") {
        AccountSNo = $('#Agent').val();
        $.ajax({
            url: "./Services/Master/CreditLimitUpdateService.svc/GetCreditLimitUpdateAgentDetailsRecord?SNo=" + AccountSNo, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                resetTransectionFields();
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
               // ModeData = ResultData.Table1;
               //$('#TransectionModeSNo').val(ModeData.SNo);
               // $('#Text_TransectionModeSNo').text(ModeData.Mode);
                ResetFields();

                if (FinalData.length > 0) {
                    $('span#AccountNo').text(FinalData[0].AccountNo);
                    $('span#CitySNo').text(FinalData[0].City);
                    $('span#ExistingCreditLimit').text(FinalData[0].RemainingCreditLimit);
                    $('span#CreditLimit').text(FinalData[0].CreditLimit);
                    $('#HdnTransactionType').val(FinalData[0].TransactionType);//updated by shahbaz akhtar on -29-12-2016 : purpose - for getting transaction type
                    TransactionType = FinalData[0].TransactionType;
                   // TransactionTypeName = FinalData[0].TransactionTypeName;
                    $('span#TransactionType').text(FinalData[0].TransactionTypeName);
                    //  $("#tbl td:contains('Credit')").html("Topup");

                    var currentRow = $('#HdnTransactionType').val();
                    if (currentRow == 0) {
                        $("td").each(function () {
                            if ($(this).text() == "Credit Limit") {
                                $(this).text("Topup");
                            }
                            if ($(this).text() == "Balance Credit Limit") {
                                $(this).text("Balance Topup");
                            }
                        });
                    }
                    else if (currentRow == 1) {
                        $("td").each(function () {
                            if ($(this).text() == "Topup") {
                                $(this).text("Credit Limit");
                            }
                            if ($(this).text() == "Balance Topup") {
                                $(this).text("Balance Credit Limit");
                            }
                        });
                    }
                }
                else {
                    ShowMessage('warning', 'Warning - Direct Payment', "Forwarder (Agent)-" + $('#Text_Agent').val() + " details not found!!");
                    $('#Agent').val('');
                    $('#Text_Agent').val('');
                }
            }
        });

    }


}


function ResetFields() {
    //$('span#AccountNo').text('');
    $('span#CitySNo').text('');
    $('span#ExistingCreditLimit').text('');
    $('span#CreditLimit').text('');
    $('spn#Office').text('');
    $('#City').text('');
}

function removeValidation() {
    $('#BankName').removeAttr('data-valid');
    $('#BranchName').removeAttr('data-valid');
    $('#ChequeAccountName').removeAttr('data-valid');
    $('#BankAccountNo').removeAttr('data-valid');
    // $('#ChequeDate').removeAttr('data-valid');
    $('#ChequeNo').removeAttr('data-valid');
}

function applyValidation() {
    $('#BankName').attr('data-valid', 'required');
    $('#BranchName').attr('data-valid', 'required');
    $('#ChequeAccountName').attr('data-valid', 'required');
    $('#BankAccountNo').attr('data-valid', 'required');
    //$('#ChequeDate').attr('data-valid', 'required');
    $('#ChequeNo').attr('data-valid', 'required');
}

function resetTransectionFields() {
    $('#BankName').val('');
    $('#BranchName').val('');
    $('#ChequeAccountName').val('');
    $('#BankAccountNo').val('');
    $('#ReferenceNo').val('');
    //$('#ChequeDate').val('');
    $('#ChequeDate').focus();
    $('#ChequeDate').focusout();
    $('#ChequeNo').val('');
}

///updated by shahbaz akhtar on 02-01-17

//$("input[name=UpdateType]:radio").change(function () {
//    if ($('input[type="radio"][name="UpdateType"][value="1"]').is(':checked') == true) {

//        $('#UpdateType').closest('tr').nextAll().hide();
//    }
//    else if ($('input[type="radio"][name="UpdateType"][value="0"]').is(':checked') == true) {

//        $('#UpdateType').closest('tr').nextAll().show();
//        $('#BankName').closest('tr').nextAll().hide();
//    }
//});

$('input[type="radio"][name="PaymentBy"]').click(function () {
    if (this.value == 0) {
        $('#Text_Agent').removeAttr('data-valid');
        $('#Text_Office').attr('data-valid', 'required');
        $('td[title="Select Office"]').html("<span style = 'color:red'>*</span>  Office");
        $('td[title="Select Forwarder (Agent)"]').html("Forwarder (Agent)");
    }
    else {
        $('#Text_Office').removeAttr('data-valid');
        $('#Text_Agent').attr('data-valid', 'required');
        $('td[title="Select Forwarder (Agent)"]').html("<span style = 'color:red'>*</span> Forwarder (Agent)");
        $('td[title="Select Office"]').html("Office");

    }


});

$('#Text_Agent').select(function () {
    if(TransactionType == 0)
    {
        $('#UpdateType').closest('td').hide();
        $('#spnUpdateType').closest('td').hide();
    }
    else
    {
        $('#UpdateType').closest('td').show();
        $('#spnUpdateType').closest('td').show();
    }
});