$(document).ready(function () {
    $('#MasterSaveAndNew').remove();
    //$("input[name='operation'][value='Update']").hide();
    $("#tbl tr").slice(3).hide();
    cfi.AutoCompleteV2("Agent", "Name", "Master_CreditLimitUpdate_Agent", GetAgentData, "contains");
    //cfi.AutoComplete("ApprovedBy", "UserName,Name", "CreditLimitUpdateUsers", "SNo", "UserName", ["UserName", "Name"], null, "contains");
    $('#TopUpCreditLimit').after('   <span style="max-width: 250px;word-wrap: break-word; display: inline-block;max-height: 50px;overflow: auto;" class="" id="CurrencyCode"></span> &nbsp;<span style="max-width: 250px;word-wrap: break-word; display: inline-block;max-height: 50px;overflow: auto;" class="" id="Re_Amount"></span>')
    $("#__SpanHeader__").css("color", "black");



});
$('input[type="submit"][name="operation"]').click(function () {

    if ($('input[type="radio"][name="UpdateType"][value="0"]').is(':checked') == true && $('#IsRevert').is(':checked') == true && ($('#TopUpCreditLimit').val() > Math.abs($('#Re_Amount').html()))) {
        ShowMessage('warning', 'Warning - Credit Limit Update', "Top-Up Amount cannot be greater than " + Math.abs($('#Re_Amount').html()));
        return false;
    }

});

$('#TopUpCreditLimit').on('blur', function () {

    if ($('input[type="radio"][name="UpdateType"][value="0"]').is(':checked') == true && $('#IsRevert').is(':checked') == true && ($('#TopUpCreditLimit').val() > Math.abs($('#Re_Amount').html()))) {
        ShowMessage('warning', 'Warning - Credit Limit Update', "Top-Up Amount cannot be greater than " + Math.abs($('#Re_Amount').html()));
        return false;
    }

});

$('input[type="radio"][name="UpdateType"]').click(function () {
    if (this.value == 1) {
        $('#IsRevert').attr('disabled', true);
        $('#IsRevert').removeAttr('checked', false)
    }
    else if (this.value == 0) {
        if ($('#Re_Amount').html() < 0) {
            $('#IsRevert').removeAttr('disabled');
        }
    }
});

function GetAgentData() {
    $('#TopUpCreditLimit').val('');
    $('#_tempTopUpCreditLimit').val('');
    if ($('#Text_Agent').val() != "") {
        AccountSNo = $('#Agent').val();
        Flag1 = "";
        $.ajax({
            url: "./Services/Master/CreditLimitUpdateService.svc/GetCreditLimitUpdateAgentDetailsRecord?SNo=" + AccountSNo + "&Flag1=" + Flag1,
            async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    //$('span#AccountNo').text(FinalData[0].AgentName);
                    $("span#ApprovedBy").text(userContext.UserName);
                    $('span#AccountNo').text(FinalData[0].AccountNo);
                    $('span#City').text(FinalData[0].City);
                    $('span#ValidTo').text(FinalData[0].ValidTo);
                    $('span#Currency').text(FinalData[0].CurrencyCode);
                    $('span#CurrencyCode').text(FinalData[0].CurrencyCode);
                    $('span#CreditLimit').text(FinalData[0].RemainingCreditLimit);
                    $('span#MinimumCreditLimit').text(FinalData[0].MinimumCL);
                    $('span#AlertCreditLimit').text(FinalData[0].AlertCLPercentage);
                    $('span#Re_Amount').text(FinalData[0].Re_Amount);
                    $("#tbl tr").slice(3).show();

                    if (FinalData[0].Re_Amount < 0) {
                        $('#IsRevert').removeAttr('disabled');
                    }
                    else {
                        $('#IsRevert').attr('disabled', true);
                        $('#IsRevert').removeAttr('checked', false)
                    }
                    //$("input[name='operation'][value='Update']").show();
                }
                else {
                    ShowMessage('warning', 'Warning - Credit Limit Update', "Forwarder (Agent) details not exists!!");
                    //$("input[name='operation'][value='Update']").hide();
                    $("#tbl tr").slice(3).hide();
                }
            }
        });
    }
    else {
        $("#tbl tr").slice(3).hide();
        //$("input[name='operation'][value='Update']").hide();
    }

}