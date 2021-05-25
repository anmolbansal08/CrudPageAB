
var flag = 0;
var FilterTrans = 0;
var strDes = '';
var bankGuaranteeValidToDate = '';
//-------- added by arman for hide delete button from grid : 2018-06- 
//function BeforeRowActionClick(td, tr, recId, grid) {
//    $(".tool-items").find("a:eq(2)").hide();
//}

$(document).ready(function () {
    $('#MasterSaveAndNew').remove();
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "DirectPayment_Airline", null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "DirectPayment_Currency", checkExchangeRate, "contains");
    cfi.AutoCompleteV2("City", "CityCode,CityName", "DirectPayment_City", ClearOffice, "contains");

    cfi.AutoCompleteV2("Office", "Name", "DirectPayment_Name", GetOfficeData, "contains");
    cfi.AutoCompleteV2("Agent", "AgentName", "DirectPayment_AgentName", GetAgentData, "contains");

    cfi.AutoCompleteV2("TransectionModeSNo", "Mode", "DirectPayment_Mode", OnSelectTrans, "contains");

    // Add Awb Number by UMAR On 29-Aug-2018
    cfi.AutoCompleteV2("AWBSNo", "AWBNumber", "AWBNo_SearchDirectPayment", BindNtaAmount, "contains");

    strDes += '<tr><td class="formlabel" title="BG "><font color="red">*</font><span id="spnDescription"> Description</span></td><td class="formInputcolumn">'
    strDes += '<input type="text" class="k-input" name="Description" id="Description" style="width: 174px; text-transform: uppercase;" controltype="default" colname="Description" data-valid="required" data-valid-msg="Description cannot be blank"  maxlength="35" value="" data-role="alphabettextbox" autocomplete="off">'
    strDes += '<span style="max-width: 250px;word-wrap: break-word; display: inline-block;max-height: 50px;overflow: auto;" class="" id="ExistingCreditLimit1">'
    strDes += '</span></td><td class="formlabel" title="Payment1 Date"></td><td class="formInputcolumn">'
    strDes += '<input type="hidden" name="lbldsc" id="lbldsc" value="7-Mar-2019">'
    strDes += '<span style="max-width: 250px;word-wrap: break-word; display: inline-block;max-height: 50px;overflow: auto;" class="" id="spnlbldsc"></span></td></tr>'


    //alert($("[type='radio'][id='UpdateType']").length)
    if ($('#Text_TransectionModeSNo').length>0 && $('#Text_TransectionModeSNo').val().toUpperCase() == "CASH") {
        $('#ReferenceNo').removeAttr('data-valid');
    } else { $("#ReferenceNo").attr('data-valid', 'required'); }
    // $("[type='radio'][id='UpdateType']").closest('td').contents().hide();
    // $("[type='radio'][id='UpdateType']").closest('td').prev('td').contents().hide();
    // OnSelectTrans();   
    $("[title='Credit Limit']").closest('td').text('Max. Credit Limit');
    // ClearAgent();
    // ClearOffice();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        // aDDEED BY ARMAn ali date 2017-08-14
        $(document).ready(function () {
            $("[type='radio'][id='UpdateType']").closest('td').attr('style', 'display : none');
            $("[type='radio'][id='UpdateType']").closest('td').prev('td').attr('style', 'display : none');
        });
        $("input[type='radio'][id='UpdateType']").removeAttr('checked');
        $('input[type="radio"][id="PaymentBy"][value="1"]').attr('checked', true);
        //$('input[type="radio"][id="UpdateType"][value="0"]').attr('checked', true);
        $("#Text_City").val('');
        $("#Text_Office").val("");
        $("#Office").val("");
        var datepicker = $("#PaymentDate").data("kendoDatePicker");
        datepicker.value($("#PaymentDate").val());
        $('#Text_Agent').attr('data-valid', 'required');
        $('#Text_Office').data("kendoAutoComplete").enable(false);
        //$('#AWBNo').closest('td').attr('style', 'display:none');
        ChkAmountSeperator();
        ChkAmountNumber();
        $('#Remarks').closest('tr').after(strDes);
        $('#Description').closest('tr').hide();
        // This code is used for vistara GSA Users only by umar on 04-Dec-2019 TFS:(15259)
        if (userContext.SysSetting.ClientEnvironment == "UK" && userContext.OfficeSNo > 0) {
            $('#City').val(userContext.CitySNo);
            $('#Text_City').val(userContext.CityCode + '-' + userContext.CityName);
            $('#Text_City').data("kendoAutoComplete").enable(false);
        }
        if (userContext.OfficeSNo > 0 && userContext.AgentSNo == "0") {
            $("input[type='radio'][id='PaymentBy'][value='0']").attr('disabled', true);
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        flag = 1;
        if ($('input[type="radio"][name="PaymentBy"]:checked').val() == "0") {
            $('#Text_Agent').removeAttr('data-valid');
            $('#Text_Office').attr('data-valid', 'required');
            $('td[title="Select Office"]').html("<span style = 'color:red'>*</span>  Office");
            $('td[title="Select Forwarder (Agent)"]').html("Forwarder (Agent)");
            $('#Text_Office').data("kendoAutoComplete").enable(true);
            $('#Text_Agent').data("kendoAutoComplete").enable(false);
        }
        else {
            $('#Text_Office').removeAttr('data-valid');
            $('#Text_Agent').attr('data-valid', 'required');
            $('td[title="Select Forwarder (Agent)"]').html("<span style = 'color:red'>*</span> Forwarder (Agent)");
            $('td[title="Select Office"]').html("Office");
            $('#Text_Office').data("kendoAutoComplete").enable(false);
            $('#Text_Agent').data("kendoAutoComplete").enable(true);

        }
        //------- disable fields for edit case by Arman ali-------
        $('#Text_Office').data("kendoAutoComplete").enable(false);
        $('#Text_City').data("kendoAutoComplete").enable(false);
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
        $('#Text_CurrencySNo').data("kendoAutoComplete").enable(false);
        $('#Text_Agent').data("kendoAutoComplete").enable(false);
        $("[id='PaymentBy']").attr('disabled', true)
        ChkAmountSeperator();
        ChkAmountNumber();

        if ($('#Text_TransectionModeSNo').val() == 'BANK GUARANTEE') {
            $('#ValidTo').closest('tr').nextAll().hide();
            $('#ReferenceNo').attr('data-valid', 'required');
            $("#ValidFrom").attr('data-valid', 'required');
            $("#ValidTo").attr('data-valid', 'required');
            //   $("#Text_TransectionModeSNo").closest('tr').after('<div id = Agentvalidfrom></div>')
            getAgentBankGurantee();
        }
        //else {
        //    $('#ReferenceNo').closest('tr').nextAll().hide();
        //    $("#ValidFrom").removeAttr('data-valid');
        //    $("#ValidTo").removeAttr('data-valid');
        //}


    }


    function ChkAmountSeperator() {
        //  For Thousand Seperator 
        $('#Amount').keyup(function (event) {
            // if (event.which >= 37 && event.which <= 40) return;           
            $(this).val(function (index, value) {
                return value
                .replace(/[^0-9.]/g, "").replace(/(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g,
                function (m, s1, s2) {
                    return s2 || (s1 + ',');
                });

                // .replace(/\D/g, "")
                //.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                //;
            });

        });

        $('input#Amount').blur(function () {
            var x = $('#Amount').val().split('.');
            if (x.length == 1) {
                $('#Amount').val($('#Amount').val() + '.00')
            }
            if ($('#Amount').val() == ".00") {
                $('#Amount').val('');
                return;
            }
        });
    }

    function ChkAmountNumber() {
        $("input[id*='Amount']").keydown(function (event) {
            if (event.shiftKey == true) {
                event.preventDefault();
            }
            if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

            } else {
                event.preventDefault();
            }
            if ($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
                event.preventDefault();
        });
    }


    // Add Delete checks by UMAR on 10-Aug-2018
    if (getQueryStringValue("FormAction").toUpperCase() == "DELETE") {

        $('<input type="button" name="operation" value="Delete" class="btn btn-danger" id="btndelete" />').insertAfter($('input[type="button"][value="Back"]'));
        $('#btndelete').click(function () {
            DeleteDirectPayment();
        })
        //MsgData[0].Column1 == 0 && $('#AccountSNo').val() > 0
        //MsgData[0].Column1 == 0 && Agent > 0
        //MsgData[0].Column1 == "0"
    }


    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if (userContext.SysSetting.IsHideCreditLimitReport.toUpperCase() == "FALSE") {
            $('#spnTotalNtaAmount').hide();
            $('span#TotalNtaAmount').hide();
        }
        else {
            $('#spnTotalNtaAmount').show();
            $('span#TotalNtaAmount').show();
        }

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if (userContext.SysSetting.IsHideCreditLimitReport.toUpperCase() == "FALSE") {
            $('#spnTotalNtaAmount').hide();
            $('span#TotalNtaAmount').hide();
        }
        else {
            $('#spnTotalNtaAmount').show();
            $('span#TotalNtaAmount').show();
        }

    }


    // For Awb no of GA  13-Dec-2018 by umar
    //if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() == "GA") {
    //}

    if (userContext.SysSetting.IsHideCreditLimitReport.toUpperCase() == "FALSE") {
        $("[title='Select AWB No	']").html('');
        $('#Text_AWBSNo').closest('td').html('');
    }

    //added by himanshu
    if (userContext.SysSetting["ClientEnvironment"].toUpperCase() == "TH" && (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT")) {
        if(userContext.SysSetting.IsShowPaymentDateControlOnDirectPayment =="TRUE") {
            $("#PaymentDate").data('kendoDatePicker');
        }
        else if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            var date = new Date();
            date = (date.toLocaleDateString("en-au", { year: "numeric", month: "short", day: "numeric" }).replace(/\s/g, '-')).replace('.', '');
            $('#PaymentDate').val(date);
            $("#tbl > tbody > tr:nth-child(7) > td:nth-child(4) > span").remove()
            $("#tbl > tbody > tr:nth-child(7) > td:nth-child(4)").append("<span id='tdPaymentDate'></span>");
            $('#tdPaymentDate').text(date);
        }
        else {
            var date = new Date();
            date = (date.toLocaleDateString("en-au", { year: "numeric", month: "short", day: "numeric" }).replace(/\s/g, '-')).replace('.', '');
            $('#PaymentDate').val(date);
            $("#tbl > tbody > tr:nth-child(8) > td:nth-child(4) > span").remove()
            $("#tbl > tbody > tr:nth-child(8) > td:nth-child(4)").append("<span id='tdPaymentDate'></span>");
            $('#tdPaymentDate').text(date);
}
    }






    
    else {
        var date = new Date();
        date = (date.toLocaleDateString("en-au", { year: "numeric", month: "short", day: "numeric" }).replace(/\s/g, '-')).replace('.', '');
        $('#PaymentDate').val(date);
        //$("#tbl > tbody > tr:nth-child(7) > td:nth-child(4) > span").remove()
        //$("#tbl > tbody > tr:nth-child(7) > td:nth-child(4)").append("<span id='tdPaymentDate'></span>");
        $('#tdPaymentDate').text(date);

    }
    //var payment = $("#PaymentDate").data("kendoDatePicker");
    // var todaydate = new Date();
    //$('#ChequeDate').val(todaydate);
    //$('#ChequeDate').text(todaydate);
    // $('#ChequeDate').focus('');

    var todaydate = new Date();
    var validfromdate = $("#ChequeDate").data("kendoDatePicker"); 
    if (validfromdate != undefined) {
        validfromdate.max(todaydate);
    }


    //=== by arman for date
    $("#ValidFrom").kendoDatePicker({

        change : clearDate
    });
    $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');

    $("#ValidTo,#ValidFrom").closest("span").width(100);
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
        $("#ValidFrom").data('kendoDatePicker').min(todaydate);
        $("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());
       // $("#PaymentDate").data('kendoDatePicker').min(payment);
    }

    function clearDate() {
        if ($("#ValidTo").data('kendoDatePicker').value() < $("#ValidFrom").data('kendoDatePicker').value()) {
            $("#ValidTo").data('kendoDatePicker').value('');
        }

        $("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());

        $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
        $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');

        $("#ValidTo,#ValidFrom").closest("span").width(100);
    }


    //---end

    //   $('#Text_Agent').data("kendoAutoComplete").enable(false);


    OnSelectTrans();
    $("#__SpanHeader__").css("color", "black");

    $("#btnSaveRateMaster").unbind("click").bind("click", function () {
        if (cfi.IsValidSubmitSection()) {
            SaveTaxRateDetailsMaster("NEW");

        }
    });


    UserPageRights("DirectPayment")
    if (isCreate == false) {
        $('input[value="New Direct Payment"]').hide()
    } else {
        $('input[value="New Direct Payment"]').show()
    }

});

var amount = 0;
var creditlimit = 0;
var balance = 0;
var total = 0;
var credit = 0;


$('input[type="radio"][name="PaymentBy"]').click(function () {
    $("#AgentBankDetails, #tblAegntBankGurantee").remove();
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
        $('span#AmountNTA').text('');
        cfi.ResetAutoComplete("Text_AWBSNo");
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
        $('span#AmountNTA').text('');
        cfi.ResetAutoComplete("Text_AWBSNo");
    }
});



/*updated by shahbaz akhtar on -29-12-2016 : purpose - for binding agent dropdown on the basis of office
and for hide bank guarantee if agent type is topup*/

function GetAirlineCurrency() {
    // var AirlineCode = $("#Airline").val();
    var CityCode = $("#City").val();
    if (CityCode != "") {
        $.ajax({
            url: "Services/Accounts/DirectPaymentService.svc/GetAirlineCurrency?AirlineSNo=" + CityCode, async: true, type: "GET", cache: false, contentType: "application/json; charset=utf-8",
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

function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AWBSNo") {

        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        param.push({ ParameterName: "AccountSno", ParameterValue: $('#Agent').val() });
        param.push({ ParameterName: "CitySNo", ParameterValue: $("#City").val() });
        param.push({ ParameterName: "AirlineSno", ParameterValue: $("#AirlineSNo").val() });

        return param;
    }
    else if (textId == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    var filteragent = cfi.getFilter("AND");
    var filterMode = cfi.getFilter("AND");
    var filtercurrency = cfi.getFilter("AND");
    var filterAwbNo = cfi.getFilter("AND");
    if (textId == "Text_Office") {
        try {
            if ($("#AirlineSNo").val() == "")
                ShowMessage('warning', 'Warning - Direct Payment', "Please! Select Airline");
            if ($("#City").val() == "")
                ShowMessage('warning', 'Warning - Direct Payment', "Please! Select City");
            cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#AirlineSNo").val());
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
            if ($("#AirlineSNo").val() == "" || $("#City").val() == "")
                ShowMessage('warning', 'Warning - Direct Payment', "Kindly select Airline and City For Agent");
            cfi.setFilter(filteragent, "AirlineSNo", "eq", $("#AirlineSNo").val());
            cfi.setFilter(filteragent, "CitySNo", "eq", $("#City").val());
            cfi.setFilter(filteragent, "Branch", "eq", "0");
            var AgentSno = cfi.autoCompleteFilter([filteragent]);
            return AgentSno;
        }
        catch (exp)
        { }
    }

    if (textId == "Text_AirlineSNo") {
        try {
            cfi.setFilter(filterAirline, "IsInterline", "eq", 0)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }

    // Add AWBNo by UMAR on 30-Aug-2018
    if (textId == "Text_AWBSNo") {
        try {
            //cfi.setFilter(filterAwbNo, "AirlineSNo", "eq", $("#AirlineSNo").val());
            //cfi.setFilter(filterAwbNo, "AccountSNo", "eq", $('#Agent').val())
            //cfi.setFilter(filterAwbNo, "CitySNo", "eq", $("#City").val()); comment by umar on 06-Sep-2018
            var awbno = cfi.autoCompleteFilter([filterAwbNo]);
            return awbno;
        }
        catch (exp)
        { }
    }
    //if (textId == "Text_CurrencySNo") {
    //    try {
    //        if ( $("#Office").val() == "")
    //            ShowMessage('warning', 'Warning - Direct Payment', "Please! Select City For Currency");
    //        cfi.setFilter(filtercurrency, "CitySNo", "eq", $("#City").val())
    //        var OriginCityAutoCompleteFilter4 = cfi.autoCompleteFilter([filtercurrency]);
    //        return OriginCityAutoCompleteFilter4;
    //    }
    //    catch (exp)
    //    { }
    //}

    if (textId == "Text_TransectionModeSNo") {
        cfi.setFilter(filterMode, "Mode", "notin", "ONLINE PAYMENT FROM BNI");
        try {
            //--------office ------
            if ($("#Text_Office").val() != "" && FilterTrans <= 0) {
                cfi.setFilter(filterMode, "Mode", "in", 'BANK GUARANTEE');
                var Mode = cfi.autoCompleteFilter([filterMode]);
                return Mode
            }
            //------end
            if (($("#Agent").val() == "" && $("#Text_Office").val() == "")) {
                ShowMessage('warning', 'Warning - Direct Payment', "Kindly select Office or Agent");
                $("#Text_TransectionModeSNo,#TransectionModeSNo").val('')
                cfi.setFilter(filterMode, "SNo", "in", '');
                var Mode = cfi.autoCompleteFilter([filterMode]);
                return Mode
            }
            else {

                if ($("#Agent").val() != "" && $("#TransactionType").next('span').text().toUpperCase() != "CREDIT" && $("#TransactionType").next('span').text().toUpperCase() != "CASH") {
                    cfi.setFilter(filterMode, "CassCondition", "notin", '1');
                    var Mode = cfi.autoCompleteFilter([filterMode]);
                    return Mode
                }
            }

            if ($("#Agent").val() != "" && ($("#TransactionType").next('span').text().toUpperCase() == "CREDIT" || $("#TransactionType").next('span').text().toUpperCase() == "CASH") && FilterTrans <= 0) {
                cfi.setFilter(filterMode, "Mode", "in", 'BANK GUARANTEE');
                var Mode = cfi.autoCompleteFilter([filterMode]);
                return Mode
            }


        }


        catch (exp)
        { }


    }
}

// Clear Section Form 
function ClearAgent() {
    cfi.ResetAutoComplete("Agent");
    ResetFields();
}

function ClearOffice() {
    cfi.ResetAutoComplete("Office");
    ResetFields();
    //  GetAirlineCurrency();
    $("#Agent,#Text_Agent,#Office,#Text_Office").val('');
    $("#TransectionModeSNo,#Text_TransectionModeSNo").val('');
    resetTransectionFields();
    $("#tblAegntBankGurantee").remove();
    $("#TransactionType,#PaymentDate").text('');
}
function ClearCity() {
    cfi.ResetAutoComplete("City");
    cfi.ResetAutoComplete("Office");
    ResetFields();
}


$('input[type="submit"][name="operation"]').click(function () {
    checkExchangeRate();
    amount = Math.abs($('#Amount').val());
    creditlimit = Math.abs($('span#CreditLimit').html());
    balance = Math.abs($('span#ExistingCreditLimit').html());
    total = balance + amount;
    credit = creditlimit + amount;
    checkAmount();      // by arman
    if ($("#Text_TransectionModeSNo").val().toUpperCase() != "BANK GUARANTEE") {
        $("#ValidFrom").val("");
        $("#ValidTo").val("");
    }
});
$('#Amount').on('blur', function () {
    checkAmount();     // by arman

});



$("#ChequeNo").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
});

function OnSelectTrans() {
    $("[type='radio'][id='UpdateType']").closest('td').css('display', 'none');
    $("[type='radio'][id='UpdateType']").closest('td').prev('td').css('display', 'none');
    //var todaydate = new Date();
    //$("#ChequeDate").val(todaydate);
    //$("#ChequeDate").text(todaydate);
    //validfromdate.min(todaydate);
    //if (($("#Agent").val() == "" && $("#Text_Office").val() == "")) {
    //    ShowMessage('warning', 'Warning - Direct Payment', "Please! Select Office or Agent");
    //    $("#Text_TransectionModeSNo,#TransectionModeSNo").val('')
    //    return false;
    //}
    //else{
    $("#AgentBankDetails, #tblAegntBankGurantee").remove();
    // $("#Text_TransectionModeSNo").closest('tr').after('<tr><td class="formlabel" title="Valid From">Valid From</td><td class="formInputcolumn"><span style="max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;" class="" id="ValidFromDate"></span></td><td class="formlabel" title="Valid To">Valid To</td><td class="formInputcolumn">|<span style="max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;" class="" id="ValidToDate"></span></td></tr>')
    $('span#ValidFromDate').closest('tr').remove();

    $("#ReferenceNo").attr('data-valid', 'required');

    if ($('#Text_TransectionModeSNo').val() == 'CASH') { //CASH
        $('#ReferenceNo').removeAttr('data-valid');
        flag != 1 ? resetTransectionFields() : null;
        $('#Text_TransectionModeSNo').closest('tr').nextAll().hide();
        removeValidation();
        $('#UpdateType').closest('td').hide();
        $('#spnUpdateType').closest('td').hide();
        $("#ValidFrom").removeAttr('data-valid');
        $("#ValidTo").removeAttr('data-valid');
        $('#spnDescription').closest('td').find('font').hide();
        $('#Description').removeAttr('data-valid');
        $("input[type='radio'][id='UpdateType'][value='0']").removeAttr('data-valid');
        $("input[type='radio'][id='UpdateType'][value='1']").removeAttr('data-valid');
       
    }
    else if ($('#Text_TransectionModeSNo').val() == 'CHEQUE') { //CHEQUE
        flag != 1 ? resetTransectionFields() : null;
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Cheque Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Cheque Date');
        $('#ChequeDate').attr("data-valid-msg", "Cheque Date cannot be blank");
        $('#ChequeNo').removeAttr('disabled');
        $('#spnChequeNo').closest('td').find('font').text('*');
        $('#ChequeNo').closest('tr').nextAll().hide();
        $("#ValidFrom").closest('tr').hide();   // by arman
        $("#ValidFrom").removeAttr('data-valid');
        $("#ValidTo").removeAttr('data-valid');
        applyValidation();
        $('#UpdateType').closest('td').hide();
        $('#spnUpdateType').closest('td').hide();
        $('#spnDescription').closest('td').find('font').hide();
        $('#Description').removeAttr('data-valid');
        $("input[type='radio'][id='UpdateType'][value='0']").removeAttr('data-valid');
        $("input[type='radio'][id='UpdateType'][value='1']").removeAttr('data-valid');
    }

    else if ($('#Text_TransectionModeSNo').val() == 'BANK GUARANTEE' || $('#Text_TransectionModeSNo').val() == 'ONLINE PAYMENT') { //BANK GUARANTEE AND ONLINE PAYMENT
        flag != 1 ? resetTransectionFields() : null;
        $('span#ValidFromDate').closest('tr').hide();
        $('#TransectionModeSNo').closest('tr').nextAll().show();
        $('#spnChequeDate').text('Transaction Date');
        $('#spnChequeDate').closest('td').attr('title', 'Select Transaction Date');
        $('#ChequeDate').attr("data-valid-msg", "Transaction Date cannot be blank");
        $('#ChequeNo').attr('disabled', true);
        $('#spnChequeNo').closest('td').find('font').text('');
        if ($('#Text_TransectionModeSNo').val() == 'BANK GUARANTEE') {
            $('#ValidTo').closest('tr').nextAll().hide();
            $('#ReferenceNo').attr('data-valid', 'required');
            $("#ValidFrom").attr('data-valid', 'required');
            $("#ValidTo").attr('data-valid', 'required');
            //$('#spnDescription').closest('td').find('font').show();
            //$('#Description').attr('data-valid', 'required');
            //   $("#Text_TransectionModeSNo").closest('tr').after('<div id = Agentvalidfrom></div>')
            $('#tblAegntBankGurantee').remove();
            getAgentBankGurantee();
            // resetTransectionFields();       
        }
        else {
            $('#ReferenceNo').closest('tr').nextAll().hide();
            $("#ValidFrom").removeAttr('data-valid');
            $("#ValidTo").removeAttr('data-valid');
            $('#spnDescription').closest('td').find('font').hide();
            $('#Description').removeAttr('data-valid');
        }
        applyValidation();
        $('#ChequeNo').removeAttr('data-valid');
        $('#UpdateType').closest('td').hide();
        $('#spnUpdateType').closest('td').hide();
        $("input[type='radio'][id='UpdateType'][value='0']").removeAttr('data-valid');
        $("input[type='radio'][id='UpdateType'][value='1']").removeAttr('data-valid');
    }
    else if ($('#Text_TransectionModeSNo').val() == 'VIRTUAL UPDATE') {// VIRTUAL UPDATE
        flag != 1 ? resetTransectionFields() : null;
        $("[type='radio'][id='UpdateType']").closest('td').css('display', '');
        $("[type='radio'][id='UpdateType']").closest('td').prev('td').css('display', '');
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
        $("#ValidFrom").removeAttr('data-valid');
        $("#ValidTo").removeAttr('data-valid');
        $('#ChequeDate').attr('data-valid', 'required');
        $('#spnDescription').closest('td').find('font').hide();
        $('#Description').removeAttr('data-valid');
        //$('#AWBNo').closest('tr').nextAll().show();

        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" && $('#Text_TransectionModeSNo').val() == "VIRTUAL UPDATE") {
            $('input[type="radio"][id="UpdateType"][value="0"]').prop('checked', false);
            $('input[type="radio"][id="UpdateType"][value="1"]').prop('checked', false);
            $("input[type='radio'][id='UpdateType'][value='0']").attr('data-valid', 'required');
            $("input[type='radio'][id='UpdateType'][value='1']").attr('data-valid', 'required');
        }

    }
    else {
        flag != 1 ? resetTransectionFields() : null;
        $('#TransectionModeSNo').closest('tr').nextAll().hide();
        removeValidation();
        //$('#UpdateType').closest('td').show();
        //$('#spnUpdateType').closest('td').show();
        $("#ValidFrom").removeAttr('data-valid');
        $("#ValidTo").removeAttr('data-valid');

    }
    //  }
    flag = 0;
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
    // $("#AgentBankDetails, #tblAegntBankGurantee").remove();
    if ($('#Text_Office').val() != "") {
        OfficeSNo = $('#Office').val();
        $.ajax({
            url: "./Services/Accounts/DirectPaymentService.svc/GetCreditLimitOffice?SNo=" + OfficeSNo, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //resetTransectionFields(); 
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                currency = ResultData.Table2
                ResetFields();
                //     $("#TransectionModeSNo,#Text_TransectionModeSNo").val(''); // clear transactionmode
                if (FinalData.length > 0) {
                    //$('span#AccountNo').text(FinalData[0].AccountNo);
                    //$('span#CitySNo').text(FinalData[0].City);
                    $('span#ExistingCreditLimit').text(FinalData[0].RemainingCreditLimit);
                    $('span#CreditLimit').text(FinalData[0].CreditLimit);
                    $('#HdnTransactionType').val(FinalData[0].TransactionType);//updated by shahbaz akhtar on -29-12-2016 : purpose - for getting transaction type
                    $("#hdnCurrencySNo").val(currency[0].CurrencySNo);
                    $("#Text_CurrencySNo").val(currency[0].CurrencyCode);
                    $("#CurrencySNo").val(currency[0].CurrencySNo);
                    FilterTrans = ResultData.Table1[0].filterTrans;
                    $('span#TransactionType').text('');
                    //  $("#tbl td:contains('Credit')").html("Topup");
                    bankGuaranteeValidToDate = new Date(FinalData[0].Validdate);
                    $("#ValidFrom").data('kendoDatePicker').min(bankGuaranteeValidToDate);
                    $("#ValidFrom").data('kendoDatePicker').value(bankGuaranteeValidToDate);
                    $("#ValidTo").data('kendoDatePicker').min(bankGuaranteeValidToDate);
                    //   $("#ValidTo").data('kendoDatePicker').value(bankGuaranteeValidToDate);

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

//url: "./Services/Shipment/ReservationBookingService.svc/createUpdateInsurance",
//    async: false, type: "POST", dataType: "json", cache: false,
//data: JSON.stringify({ strData: btoa(ValidData) }),

function GetAgentData() {
    //$("#AgentBankDetails, #tblAegntBankGurantee").remove();
    if ($('#Text_Agent').val() != "") {
        AccountSNo = $('#Agent').val();
        Flag1 = $('#htmlkeysno').val();
        $.ajax({
            url: "./Services/Master/CreditLimitUpdateService.svc/GetCreditLimitUpdateAgentDetailsRecord?SNo= "+ AccountSNo + "&Flag1=" + Flag1,
            async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                // resetTransectionFields();
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                currency = ResultData.Table2
                var strDescription = ResultData.Table0[0].Description;
                // ModeData = ResultData.Table1;
                //$('#TransectionModeSNo').val(ModeData.SNo);
                // $('#Text_TransectionModeSNo').text(ModeData.Mode);
                // ResetFields();
                //  $("#TransectionModeSNo,#Text_TransectionModeSNo").val(''); // clear transactionmode

                if (FinalData.length > 0) {
                    $('span#AccountNo').text(FinalData[0].AccountNo);
                    $('span#CitySNo').text(FinalData[0].City);
                    $('span#ExistingCreditLimit').text(FinalData[0].RemainingCreditLimit);
                    $('span#CreditLimit').text(FinalData[0].CreditLimit);
                    $('#HdnTransactionType').val(FinalData[0].TransactionType);//updated by shahbaz akhtar on -29-12-2016 : purpose - for getting transaction type
                    TransactionType = FinalData[0].TransactionType;
                    // TransactionTypeName = FinalData[0].TransactionTypeName;
                    $("#hdnCurrencySNo").val(currency[0].CurrencySNo);
                    $("#Text_CurrencySNo").val(currency[0].CurrencyCode);
                    $("#CurrencySNo").val(currency[0].CurrencySNo);
                    $('span#TransactionType').text(FinalData[0].TransactionTypeName);
                    $('span#AWBSNo').text(FinalData[0].AwbNumber);
                    FilterTrans = ResultData.Table1[0].filterTrans;
                    //Description = FinalData[0].Description;
                    //  $("#tbl td:contains('Credit')").html("Topup");
                    bankGuaranteeValidToDate = new Date(FinalData[0].Validdate);
                    $("#ValidFrom").data('kendoDatePicker').min(bankGuaranteeValidToDate);
                    $("#ValidFrom").data('kendoDatePicker').value(bankGuaranteeValidToDate);
                    $("#ValidTo").data('kendoDatePicker').min(bankGuaranteeValidToDate);
                    // $("#ValidTo").data('kendoDatePicker').value(bankGuaranteeValidToDate);
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

                    if (FinalData[0].IsExcludeBankGuarantee == "True") {
                        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                            $('#Remarks').closest('tr').after('<tr><td class="formlabel" title="Enter Description"><font color="red">*</font><span id="spnDescription"> Description</span></td><td class="formInputcolumn"><input type="text" class="k-input" name="Description" id="Description" style="width: 175px; text-transform: uppercase;" controltype="alphanumericupper" colname="Description" data-valid="required" data-valid-msg="Description cannot be blank" maxlength="35" data-role="alphabettextbox" autocomplete="off"/><span style="max-width: 250px;word-wrap: break-word; display: inline-block;max-height: 50px;overflow: auto;" class="" id="ExistingCreditLimit12"></span></td> <td class="formlabel"></td><td class="formInputcolumn"></td></tr>');
                            $('#Description').val(strDescription);
                        }
                        else {
                            $('#Description').closest('tr').show();
                            $('#Description').attr('data-valid', 'required');
                            $('#spnDescription').closest('td').find('font').show();
                        }
                    }
                    else {
                        $('#Description').closest('tr').hide();
                        $('#Description').removeAttr('data-valid');
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

// Reset Field

function ResetFields() {
    //$('span#AccountNo').text('');
    $('span#CitySNo').text('');
    $('span#ExistingCreditLimit').text('');
    $('span#CreditLimit').text('');
    $('spn#Office').text('');
    $('#City').text('');
    // Add by umar on 10-Oct-2018
    //$('#Text_Airline').val('');
    //$('#Text_Office').val('');
    //$('#Text_CurrencySNo').val();
    //$('#Text_TransectionModeSNo').val('');

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
    //$("#ValidFrom").val('');
    $("#ValidTo").data("kendoDatePicker").value("");
    // $('#ChequeNo').val('');
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

//$('input[type="radio"][name="PaymentBy"]:checked').val() == "1"



$('input[type="radio"][name="PaymentBy"]').click(function () {
    if (this.value == 0) {
        $('#Text_Agent').removeAttr('data-valid');
        $('#Text_Office').attr('data-valid', 'required');
        $('td[title="Select Office"]').html("<span style = 'color:red'>*</span>  Office");
        $('td[title="Select Forwarder (Agent)"]').html("Forwarder (Agent)");
        $('#Description').closest('tr').hide();
        $('#Description').removeAttr('data-valid');
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
//========================================added by arman date : 07-06-2017================================================
function checkAmount() {
    amount = parseFloat($('#Amount').val());
    if (amount <= 0) {
        ShowMessage('warning', 'Warning - Direct Payment', "Amount Should Be Greater Than Zero");
        $('#Amount').val('');
        $('#_tempAmount').val('');
        return false;
    }

}
function getAgentBankGurantee()
{
    if ( ($("#Agent").val() != "" || $("#Text_Office").val()!= ""))
    {

        //  var AccountSno = $("#Agent").val() == "" || 0 ? $("#Office").val() : $("#Agent").val()
        var AccountSno = "";

        if ($("#Agent").val() == "")
        {
            AccountSno = $("#Office").val();
        }
        else if ($("#Agent").val() == "0") {
            AccountSno = $("#Office").val();
        }
        else {
            AccountSno = $("#Agent").val();
        }

        var Flag = $("input[name='PaymentBy']:checked").val()
        $.ajax({
            url: "../Services/Accounts/DirectPaymentService.svc/getAgentBankGurantee", async: false, type: "GET", dataType: "json", cache: false,
            data: { AccountSNo: AccountSno, Flag: Flag },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined && result.length > 0) {

                    var ResultData = jQuery.parseJSON(result);
                    FinalData = ResultData.Table0;
                    createAgentBankGurantee(FinalData);
                    //   $("#ValidFromDate").text(FinalData[0].ValidFrom);
                    //   $("#ValidToDate").text(FinalData[0].ValidTo);
                    if (FinalData[0].IsExcludeBankGuarantee == "True") {
                        $('#spnDescription').closest('td').find('font').show();
                        $('#Description').attr('data-valid', 'required');
                    }
                    else {
                        $('#spnDescription').closest('td').find('font').hide();
                        $('#Description').removeAttr('data-valid');
                    }
                }
            }

        });
    }

}
//==============================================end here=========================================================
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    if ($('#PaymentBy:checked').val() == '0')
        GetOfficeData()
    else
        GetAgentData()
    //  GetAgentData();
}

function createAgentBankGurantee(FinalData) {
    var str = "";
    //=====================header============================
    str = "<table id='tblAegntBankGurantee' width='100%' cellspacing=0 border='1px'><tr bgcolor='#7bd2f6'>"
    str += "<td class='ui-widget-header'>Bank Name</td>"
    str += "<td class='ui-widget-header'>Branch Name</td>"
    str += "<td class='ui-widget-header'>Account Name</td>"
    str += "<td class='ui-widget-header'>Account No</td>"
    str += "<td class='ui-widget-header'>Reference No</td>"
    str += "<td class='ui-widget-header'>Transaction Date</td>"
    str += "<td class='ui-widget-header'>Valid From</td>"
    str += "<td class='ui-widget-header'>Valid To</td>"
    str += "<td class='ui-widget-header'>Amount</td>"
    str += "<td class='ui-widget-header'>Payment Currency</td>"
    str += "<td class='ui-widget-header'>Updated By</td>"
    str += "</tr>"
    //======== body===================================================
    var tdclass = "ui-widget-content"
    for (var i = 0 ; i < FinalData.length; i++) {
        str += "<tr><td class ='ui-widget-content' >" + FinalData[i].BankName + "</td><td class ='ui-widget-content' >" + FinalData[i].BranchName;
        str += "</td><td class ='ui-widget-content' >" + FinalData[i].AccountName + "</td><td class ='ui-widget-content' >" + FinalData[i].AccountNo;
        str += "</td><td class ='ui-widget-content' >" + FinalData[i].ReferenceNo + "</td>"
        str += "</td><td class ='ui-widget-content' >" + FinalData[i].TransectionDate + "</td><td class ='ui-widget-content' >" + FinalData[i].ValidFrom;
        str += "</td><td class ='ui-widget-content' >" + FinalData[i].ValidTo + "</td><td class ='ui-widget-content' >" + FinalData[i].Amount;
        str += "</td><td class ='ui-widget-content' >" + FinalData[i].currency + "</td><td class ='ui-widget-content' >" + FinalData[i].UpdatedBy;
        str += "</td></tr>"
    }

    str += "</table>"
    $("#tbl tbody tr:last").after('<tr style="display: table-row;" id = "AgentBankDetails"><td class="formSection" colspan="4">Previous Bank Guarantee Information</td></tr>')
    $("#tbl").after(str);

    //var dbtableName = "AegntBankGurantee";
    //wCondition = BindWhereCondition();
    //$("#tblAegntBankGurantee").appendGrid({

    //    tableID: "tbl" + dbtableName,
    //    tableColumns: 'SNo',
    //    masterTableSNo: 1,
    //    isExtraPaging: true,
    //    currentPage: 1,
    //    itemsPerPage: 10, whereCondition: wCondition, sort: "",
    //    contentEditable: true,
    //    servicePath: "Services/Accounts/CreditLimitReportService.svc",
    //    getRecordServiceMethod: "GetCreditLimitReportRecord",
    //    deleteServiceMethod: "",
    //    caption: "Bank Gurantee Details",
    //    initRows: 1,
    //    isGetRecord: true,
    //    columns: [
    //        { name: "SNo", type: "hidden" },
    //        { name: "BankName", display: "Bank Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
    //         { name: "BranchName", display: "Branch Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
    //          { name: "AccountName", display: "Account Name", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
    //           { name: "AccountNo", display: "Account No", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
    //            { name: "TransactionDate", display: "Transaction Date", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },
    //               { name: "ValidFrom", display: "Valid From", type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "" }, isRequired: false },

    //        ],
    //    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

    //    },
    //    dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
    //        //  $("#tblCreditLimitReport_divStatusMsg").text().replace(' 1 to 10 of', '');
    //        //$("#tblCreditLimitReport_divStatusMsg").text('');

    //    },
    //    isPaging: true,
    //    hideButtons: { updateAll: true, insert: true, remove: true, removeAll: true }
    //})
    //$('#tblAegntBankGurantee_btnRemoveLast').remove();
    //$('#tblAegntBankGurantee_btnAppendRow').remove();

}
function checkExchangeRate() {
    if ($("#Text_AirlineSNo").val() == "") {
        //ShowMessage('warning', 'Warning - Direct Payment', "Select Airline");
        $("#CurrencySNo, #Text_CurrencySNo").val('');
        return false;
    }
    else {
        var currency = $("#CurrencySNo").val();
        var AirlineSNo = $("#AirlineSNo").val();
        if (currency != "") {
            $.ajax({
                url: "../Services/Accounts/DirectPaymentService.svc/GetExchangeRate", async: false, type: "GET", dataType: "json", cache: false,
                data: {
                    currency: currency, Mode: 1, AirlineSNo: AirlineSNo, AccountSNo: $("#Agent").val() ||0
                },   // 1 for direct payment
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != undefined && result.length > 0) {
                        var ResultData = jQuery.parseJSON(result);
                        var FromCurrency = ResultData.Table0[0]["FromCurrency"]
                        var ToCurrency = ResultData.Table0[0]["ToCurrency"]
                        if (ResultData.Table0[0]["Error"] == "2") {
                            ShowMessage('warning', 'Warning - Direct Payment', "Exchange Rate Not Available for: " + FromCurrency + " To " + ToCurrency + "");
                            $("#CurrencySNo").val('');
                            $("#Text_CurrencySNo").val('');
                            return false;
                        }
                        else {
                            if (ResultData.Table1 != undefined) {
                                $("span[id='CreditLimit']").text(ResultData.Table1[0]["CL"])
                                $("span[id='ExistingCreditLimit']").text(ResultData.Table1[0]["RCL"])
                            }
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
$(window).on('beforeunload', function () {

    $('input[name="operation"]').prop("disabled", "disabled");
});

//--- validate ref no--
//$('#ReferenceNo').blur(function () {
//    if ($('#ReferenceNo').val() != '') {
//        $.ajax({
//            url: "../Services/Accounts/DirectPaymentService.svc/CheckRefNo", async: false, type: "GET", dataType: "json", cache: false,
//            data: { RefNo: $('#ReferenceNo').val() },
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                if (result != undefined && result.length > 0) {
//                    var ResultData = jQuery.parseJSON(result);
//                    var flag = ResultData.Table0[0]["flag"]
//                    if (flag == '0')
//                    {
//                        ShowMessage('warning', 'Warning - Direct Payment', "Reference Number Already Exists ");
//                        $('#ReferenceNo').val('');
//                        return false;
//                    }
//                }
//            }

//        });

//    }
//})


// add By Sushant on 24-07-2018
var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;

function UserPageRights(apps) {

    $(userContext.PageRights).each(function (i, e) {
        if (e.Apps.toUpperCase() == apps.toUpperCase() && e.PageName.toUpperCase() == "Direct Payment".toUpperCase()) {
            if (e.PageRight.toUpperCase() == 'New'.toUpperCase()) {
                isCreate = true;
            }
            if (e.PageRight.toUpperCase() == 'Edit'.toUpperCase()) {
                IsEdit = true;
            }
            if (e.PageRight.toUpperCase() == 'Delete'.toUpperCase()) {
                IsDelete = true;
            }
            if (e.PageRight.toUpperCase() == 'Read'.toUpperCase()) {
                IsRead = true;
            }
        }
    });

}

// Selection of Awb No for NTA Amount

function BindNtaAmount() {
    var AwbSNo = $('#AWBSNo').val();
    $('span#AmountNTA').text('');
    $.ajax({
        url: "Services/Accounts/DirectPaymentService.svc/NtaAmountDirectPayment",
        async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ AwbSNo: AwbSNo || 0 }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData = jQuery.parseJSON(result);
            var msgData = myData.Table0;

            // Only for JT Air Lion
            if (userContext.SysSetting["ICMSEnvironment"].toUpperCase() == "JT") {
                if (msgData.length > 0) {
                    $('span#AmountNTA').text(msgData[0].TotalNtaAmount);

                    //$('span#AmountNTA').css("font-weight", "Bold");
                    // $('#AmountNTA').val(msgData[0].TotalNtaAmount);
                }
            }
        }

    });
}

// Add DeleteDirectPayment method by UMAR on 13-Aug-2018
function DeleteDirectPayment() {

    var Sno = $('#SNo').val();
    var OfficeSno = $('#OfficeSNo').val();
    var AccountSno = $('#AccountSNo').val();


    $.ajax({
        url: "Services/Accounts/DirectPaymentService.svc/DeleteDirectPayment",
        async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ SNo: Sno, AccountSNo: AccountSno, OfficeSNo: OfficeSno }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData = jQuery.parseJSON(result);
            var msgData = myData.Table0;

            if (msgData[0].Column1 == "0" && $('#AccountSNo').val() > 0) {
                ShowMessage('success', 'Success', "  Direct Payment Deleted Successfully.");
                setTimeout(function () {
                    navigateUrl("Default.cshtml?Module=Accounts&Apps=DirectPayment&FormAction=INDEXVIEW");

                }, 2000);
                return;
            }
            else {
                ShowMessage('success', 'Success', "  Direct Payment Deleted Successfully.");
                setTimeout(function () {
                    navigateUrl("Default.cshtml?Module=Accounts&Apps=DirectPayment&FormAction=INDEXVIEW");

                }, 2000);
                return;
            }
        }

    });
}

// Comeeee 
//$("#Amount").blur(function () {
//    var aa = $('#Amount').val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
//    //alert(aa);

//    //$('#Amount').val(aa);
//    $("#Amount").val(parseFloat(aa, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
//});