

$(document).ready(function () {
   // AnyTimeCSR_City
    //cfi.AutoCompleteV2("AirlineSNo", "CarrierCode", "CreditLimitReport_Airline", null, "contains");   
    //cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "AnyTimeCSR_City", null, "contains");  
    //cfi.AutoCompleteV2("OfficeSNo", "OfficeName", "AnyTimeCSR_Office", null, "contains");
    //cfi.AutoCompleteV2("AccountSNo", "AgentName", "AnyTimeCSR_Agent", null, "contains");

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Users_Airline", null, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "AnyTimeCSR_City", null, "contains", null, null, null, null, clearCity);
    cfi.AutoCompleteV2("OfficeSNo", "OfficeName", "AnyTimeCSR_Office", null, "contains", null, null, null, null, clearAgent);
    cfi.AutoCompleteV2("AccountSNo", "AgentName", "AnyTimeCSR_Agent", null, "contains", null, null, null, null, null);

    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "DirectPayment_Currency", null, "contains"); // // user same code from Credit limit report js


   // if (userContext.GroupName == 'ADMIN' || userContext.GroupName == 'SUPER ADMIN')
    //if (userContext.GroupName.indexOf('ADMIN') >= 0) {  

    //}
   
     if (userContext.GroupName == "AGENT" || userContext.GroupName == "GSA" || userContext.GroupName == "GSSA") {
         $('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
         $('#Text_AirlineSNo_input').val(userContext.AirlineName);

        $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        $('#Text_OfficeSNo_input').val(userContext.OfficeName);

        $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
        $('#Text_CitySNo_input').val(userContext.CityCode);


        $('#AccountSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        $('#Text_AccountSNo_input').val(userContext.AgentName);

        //cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble  Commented by 24-Apr-19 & Open Airline/Office for Agent
        //cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble   Commented by 24-Apr-19 & Open Airline/Office for Agent
        //cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
        //cfi.EnableAutoComplete('AccountSNo', false, false, null);//diasble Commented by 23-May-19 Open for Agent
     }

     if (userContext.OfficeSNo > 0) {
         $('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
         $('#Text_AirlineSNo_input').val(userContext.AirlineName);

         $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
         $('#Text_CitySNo_input').val(userContext.CityCode);

        // $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
         //$('#Text_OfficeSNo_input').val(userContext.OfficeName);

         //cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble Commented by 24-Apr-19 & Open Airline/Office for Agent
     }

     $('#exportflight').hide();

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $('#Airline').val(userContext.AirlineSNo);
    $('#Text_Airline').val(userContext.AirlineCarrierCode);
  
    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("#FromDate").change(function () {

        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }

    });

    //CurrencyChange();

});


function clearAgent() {
    $('#Text_AccountSNo_input').val('');
}

function clearCity()
{    
    $('#Text_OfficeSNo_input').val('');
    $('#Text_AccountSNo_input').val('');   
}


//$("#Text_CurrencySNo").change(function () {
//    checkExchangeRate();
//});


function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AirlineSNo" || textId == "Text_CitySNo" || textId == "Text_OfficeSNo" || textId == "Text_AccountSNo") {

        //var UserSNo = $("#htmlkeysno").val() || userContext.UserSNo;
        var UserSNo = userContext.UserSNo;
        //var UserSNo = 0
        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
        //    UserSNo = userContext.UserSNo;
        //else
        //    UserSNo = $("#htmlkeysno").val();

        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}
function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    
    if (textId == "Text_AirlineSNo") {
        //cfi.setFilter(filterAirline, "IsInterline", "eq", "0")
        //return OriginCityAutoCompleteFilter2;
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        //if (userContext.OfficeSNo >0) {
        //   // cfi.setFilter(filterAirline, "AgentSNo", "eq", AgentSNo);
        //    cfi.setFilter(filterAirline, "ParentId", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key());
        //}
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_AccountSNo") {
        //cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "Branch", "eq", "0");
        //cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());

        //cfi.setFilter(filterAirline, "Branch", "eq", 0);
        //if (usercontext.AgentSNo != 0)
        //{

        //    cfi.setFilter(filterAirline, "ParentId", "eq", usercontext.AgentSNo);
            
        //}
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

}


//$("#Text_CurrencySNo").change(function () {
//    checkExchangeRate();
//});

// Add checkExchangeRate function By UMAR
function checkExchangeRate() {

    if ($("#Text_AirlineSNo_input").val() == "") {
        ShowMessage('warning', 'Warning - FPR Report', "Select Airline");
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


//$("#Text_AirlineSNo").change(function () {
//    CurrencyChange();
//});
// Add CurrencyChange function by UMAR on 20-Sep-2018
function CurrencyChange() {
    try {
        $.ajax({
            type: "GET",
            url: "../Services/Accounts/CreditLimitReportService.svc/GetFprCurrencyInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#AirlineSNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#CurrencySNo').val(FinalData[0].SNo);
                    $('#Text_CurrencySNo_input').val(FinalData[0].CurrencyName);
                }
            }
        });

    }
    catch (exp) { }

}

function SearchAnyTimeCSR() {

    AirlineSNo = $('#AirlineSNo').val();
    OfficeSNo = $("#OfficeSNo").val() == "" ? -1 : $("#OfficeSNo").val();
    AccontSNo = $("#AccountSNo").val() == "" ? -1 : $("#AccountSNo").val();   
    //BranchSNo = $("#CurrencySNo").val() == "" ? -1 : $("#CurrencySNo").val();
    BranchSNo = "-1";
    //CitySNo = $("#CitySNo").val() == null ? "0" : $("#CitySNo").val();
    CitySNo = $("#CitySNo").val() == "" ? -1 : $("#CitySNo").val();   // TFS-16910- 06-May-2020 by Umar- admin and sysadmin get all city data in AnytimeCSR 
    CurrencySNo = $("#CurrencySNo").val() == "" ? "0" : $("#CurrencySNo").val();
    FromDate = $("#FromDate").val() == null ? "0" : $("#FromDate").val();
    ToDate = $("#ToDate").val() == null ? "0" : $("#ToDate").val();
    UserSNo = userContext.UserSNo == null ? "0" : userContext.UserSNo;
    //AgentSNo = $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val();
   
    if (AirlineSNo != "" && OfficeSNo != "" && AccontSNo != "" && BranchSNo != "" && CitySNo!="" && FromDate!="" && ToDate!="") {

        window.location.href = "../AnyTimeCSR/GetRecordInExcel?AirlineSNo=" + AirlineSNo + " &AccountSNo=" + AccontSNo + "&OfficeSNo=" + OfficeSNo + "&BranchSNo=" + BranchSNo + "&CitySNo=" + CitySNo + "&CurrencySNo=" + CurrencySNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&UserSNo=" + UserSNo;

    }
}
