$(document).ready(function () {

    cfi.AutoCompleteV2("CarrierCode", "CarrierCode,AirlineName", "AWBLevelPrimeGCR_Airline", null, "contains");
    cfi.AutoCompleteV2("CustomerType", "AccountTypeName", "AWBLevelPrimeGCR_CustomerType", null, "contains");
    cfi.AutoCompleteV2("BillingCitycode", "CityCode,CityName", "AWBLevelPrimeGCR_City", null, "contains");
    cfi.AutoCompleteV2("AgentCode", "Code,Name", "AWBLevelPrimeGCR_Agent", null, "contains");
    cfi.AutoCompleteV2("BasedOn", "Name", "AWBLevelPrimeGCR_BasedOn", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    //var todaydate = new Date();
    //var validTodate = $("#ToDate").data("kendoDatePicker");
    ////validTodate.min(todaydate);
    bindTodate_minmax();
    $("#FromDate").change(function () {

        bindTodate_minmax();
        //if ((Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) || (isNaN(Date.parse($("#ToDate").val())) == true)) {
        //    $("#ToDate").data("kendoDatePicker").value('');
        //}
        $("#ToDate").data("kendoDatePicker").value('');
     });    

    $("#ToDate").change(function () {
        var dateDiff = (Date.parse($("#ToDate").val()) - Date.parse($("#FromDate").val())) / (1000 * 60 * 60 * 24)
        if (dateDiff > 30) {
            alert("Maximum 30 days should be get selected !");
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (dateDiff < 0) {
            alert("To Date should be greater or equal to From Date !");
            $("#ToDate").data("kendoDatePicker").value('');
        }
    });
    
});

function bindTodate_minmax(){
    var addMaxDays = 30;
    $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    $("#ToDate").data("kendoDatePicker").max(kendo.date.addDays(new Date($("#FromDate").val()), addMaxDays - 1));

}

var CarrierCode = "";
var FromDate = "";
var ToDate = "";
var CustomerType = "";
var CityCode = "";
var AgentCode = "";
var BasedOn = "";

function DownloadExcelReport() {

    FromDate = $("#FromDate").val(),
    ToDate = $("#ToDate").val(),
    CustomerType = $("#CustomerType").val() == null ? "" : $("#CustomerType").val();
    CityCode = $("#BillingCitycode").val() == null ? "" : $("#BillingCitycode").val();
    AgentCode = $("#AgentCode").val() == null ? "" : $("#AgentCode").val();
    BasedOn = $("#BasedOn").val() == null ? "" : $("#BasedOn").val();
    CarrierCode = $("#CarrierCode").val() == null ? "" : $("#CarrierCode").val();

    if (FromDate != "" && ToDate != "" && BasedOn != "" && CarrierCode != "") {
        window.location.href = "../AWBLevelPrimeGCRFlightReport/GetRecordInExcel?FromDate=" + FromDate + "&ToDate=" + ToDate + "&CustomerType=" + CustomerType + "&CityCode=" + CityCode + "&AgentCode=" + AgentCode + "&BasedOn=" + BasedOn + "&CarrierCode=" + CarrierCode;
    }
}



//function ExtraParameters(id) {
//    var param = [];
//    if (id == "Text_AirlineSNo") {
//        var UserSNo = userContext.UserSNo;
//        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
//        return param;
//    }
//}