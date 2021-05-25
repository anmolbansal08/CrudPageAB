

var OnBlob = false;
var GtDays = false;


$(document).ready(function () {

    ClickOnBlob();
    
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "FprLionReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "FprLionReport_AWBNo", null, "contains");
    //cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "DirectPayment_Currency", null, "contains"); // Add CurrencySNo by umar on 04-Sep-2018
    //cfi.AutoCompleteV2("AgentSNo", "SNo,Name", "AWBStockStatus_Agent", null, "contains");
    //cfi.AutoCompleteV2("AccountSNo", "AgentName", "CreditLimitReport_AirlineOfficeAgent", null, "contains");
    cfi.AutoCompleteV2("Agent", "AgentName", "DirectPayment_AgentName", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);


    if (userContext.AgentSNo > 0) {
        //cfi.EnableAutoComplete('AirlineCode', false, false, null);
        // $("#AgentName").text(userContext.AgentName);

        if (userContext.AgentSNo != "" && userContext.AgentName != "") {
            $('#Agent').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
            $('#Text_Agent_input').val(userContext.AgentName);
            cfi.EnableAutoComplete('Agent', false, false, null);
            //$("#AirlineCode").val(userContext.AirlineName);
            // $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
        }
    }

    //if (userContext.AgentName != '')
    //{

    //}
    ////$('#AgentName').closest('tr').hide();



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

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }
    CurrencyChange();

    $('#exportflight').hide();
    $('#grid').css('display', 'none')
    //$("#grid").kendoGrid({
    //    autoBind: false,
    //    dataSource: new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
    //        transport: {
    //            read: {
    //                url: "../FPRLionReport/FPRLionReportGetRecord",
    //                dataType: "json",
    //                global: true,
    //                type: 'POST',
    //                method: 'POST',
    //                contentType: "application/json; charset=utf-8",
    //                data:
    //                    function GetReportData() {
    //                        return { Model: Model };
    //                    }

    //            }, parameterMap: function (options) {
    //                if (options.filter == undefined)
    //                    options.filter = null;
    //                if (options.sort == undefined)
    //                    options.sort = null; return JSON.stringify(options);
    //            },
    //        },
    //        schema: {
    //            model: {
    //                id: "SNo",
    //                fields: {
    //                    //TransactionDate,AgentCode,AgentName,TransactionType,Commodity,Product,SPCharges,NetPyable,AWBNo,User,Remark,TariffRate,ChargeableWeight,AWBCurrency,Sector
    //                    SNo: { type: "number" },
    //                    TransactionDate: { type: "string" },
    //                    AgentCode: { type: "string" },
    //                    AgentName: { type: "string" },
    //                    DebitCredit: { type: "string" },
    //                    TransactionType: { type: "string" },
    //                    PenaltySubType: { type: "string" },
    //                    ServiceCargo: { type: "string" },
    //                    RateClass: { type: "string" },
    //                    Commodity: { type: "string" },
    //                    NatureofGoods: { type: "string" },
    //                    Product: { type: "string" },
    //                    ExchangeCurrency: { type: "string" },
    //                    ExchangeRate: { type: "string" },
    //                    SPCharges: { type: "string" },
    //                    ReplanCharges: { type: "string" },
    //                    NetPayable: { type: "string" },
    //                    AWBNo: { type: "string" },
    //                    AWBOrigin: { type: "string" },
    //                    AWBDestination: { type: "string" },
    //                    User: { type: "string" },
    //                    Remark: { type: "string" },
    //                    TariffRate: { type: "string" },
    //                    ChargeableWeight: { type: "string" },
    //                    AWBCurrency: { type: "string" },
    //                    Sector: { type: "string" },
    //                    LACharges: {type : "string"}
    //                }
    //            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
    //        },

    //    }),
    //    sortable: true, filterable: false,
    //    pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
    //    scrollable: true,
    //    columns: [
    //        //TransactionDate,AgentCode,AgentName,TransactionType,Commodity,Product,SPCharges,NetPyable,AWBNo,User,Remark,TariffRate,ChargeableWeight,AWBCurrency,Sector
    //         //{ field: "SNo", title: "SNo", width: 90 },
    //         { field: "TransactionDate", title: "Transaction Date", width: 110 },
    //         { field: "AgentCode", title: "Agent Code", width: 90 },
    //         { field: "AgentName", title: "Agent Name", width: 110 },
    //         { field: "DebitCredit", title: "Debit/Credit", width: 90 },
    //         { field: "TransactionType", title: "Transaction Type", width: 110 },
    //         { field: "PenaltySubType", title: "Penalty Sub Type", width: 110 },
    //          { field: "ServiceCargo", title: "Service Cargo", width: 90 },
    //          { field: "RateClass", title: "Rate Class", width: 90 },
    //         { field: "Commodity", title: "Commodity", width: 90 },
    //         { field: "NOG", title: "Nature of Goods", width: 90 },
    //         { field: "Product", title: "Product", width: 130 },
    //         { field: "ExchangeCurrency", title: "Exchange Currency", width: 130 },
    //         { field: "ExchangeRate", title: "Exchange Rate", width: 130 },
    //         { field: "SPCharges", title: "SP Charges", width: 110 },
    //        { field: "ReplanCharges", title: "Replan Charges", width: 110 },
    //        { field: "LACharges", title: "Late Acceptance", width: 90 },
    //         { field: "NetPayable", title: "Net Payable", width: 90 },
    //         { field: "AWBNo", title: "AWB No", width: 90 },
    //         { field: "AWBOrigin", title: "AWB Origin", width: 90 },
    //         { field: "AWBDestination", title: "AWB Destination", width: 90 },
    //         { field: "User", title: "User", width: 110 },
    //         { field: "Remark", title: "Remark", width: 110 },
    //         { field: "TariffRate", title: "Tariff Rate", width: 90 },
    //         { field: "ChargeableWeight", title: "Chargeable Weight", width: 110 },
    //         { field: "AWBCurrency", title: "AWB Currency", width: 90 },
    //        { field: "Sector", title: "Sector", width: 90 }
              
    //    ]
    //});

});


//$("#Text_CurrencySNo").change(function () {
//    checkExchangeRate();
//});


var Model = [];


function SearchFPRLionReport() {
    var startDate = new Date($("#FromDate").data("kendoDatePicker").value());
    startDate = new Date(startDate.setHours(0, 0, 0, 0));
    var endDate = new Date($("#ToDate").data("kendoDatePicker").value());
    endDate = new Date(endDate.setHours(0, 0, 0, 0));

    var day = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);

    if (day < 7) {
        GtDays = false;
    }
    else {
        GtDays = true;
        $('#grid').css('display', 'none');
        $('#exportflight').hide();

    }

    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            //FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
            OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
            DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            AWBNo: $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val(),
            //AccountSNo: userContext.AgentSNo== "" ? "0" : userContext.AgentSNo,
            AccountSNo: $("#Agent").val() == "" ? "0" : $("#Agent").val(),
            CurrencySNo: $('#CurrencySNo').val() == "" ? "0" : $('#CurrencySNo').val(),
            IsAutoProcess: (OnBlob == true && GtDays==true ? 0 : 1),
            pageSize: 100000
        };

    



    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

   

        if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "") {
            var cur = $('#Text_CurrencySNo_input').val();
            if (cur == "") {
                return;
            }
            if (OnBlob && GtDays) {
                $.ajax({
                    url: "../Reports/FPRReport",
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
                $("#grid").kendoGrid({
                    autoBind: false,
                    dataSource: new kendo.data.DataSource({
                        type: "json",
                        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
                        transport: {
                            read: {
                                url: "../FPRLionReport/FPRLionReportGetRecord",
                                dataType: "json",
                                global: true,
                                type: 'POST',
                                method: 'POST',
                                contentType: "application/json; charset=utf-8",
                                data:
                                    function GetReportData() {
                                        return { Model: Model };
                                    }

                            }, parameterMap: function (options) {
                                if (options.filter == undefined)
                                    options.filter = null;
                                if (options.sort == undefined)
                                    options.sort = null; return JSON.stringify(options);
                            },
                        },
                        schema: {
                            model: {
                                id: "SNo",
                                fields: {
                                    //TransactionDate,AgentCode,AgentName,TransactionType,Commodity,Product,SPCharges,NetPyable,AWBNo,User,Remark,TariffRate,ChargeableWeight,AWBCurrency,Sector
                                    SNo: { type: "number" },
                                    TransactionDate: { type: "string" },
                                    AgentCode: { type: "string" },
                                    AgentName: { type: "string" },
                                    DebitCredit: { type: "string" },
                                    TransactionType: { type: "string" },
                                    PenaltySubType: { type: "string" },
                                    ServiceCargo: { type: "string" },
                                    RateClass: { type: "string" },
                                    Commodity: { type: "string" },
                                    NatureofGoods: { type: "string" },
                                    Product: { type: "string" },
                                    ExchangeCurrency: { type: "string" },
                                    ExchangeRate: { type: "string" },
                                    SPCharges: { type: "string" },
                                    ReplanCharges: { type: "string" },
                                    NetPayable: { type: "string" },
                                    AWBNo: { type: "string" },
                                    AWBOrigin: { type: "string" },
                                    AWBDestination: { type: "string" },
                                    User: { type: "string" },
                                    Remark: { type: "string" },
                                    TariffRate: { type: "string" },
                                    ChargeableWeight: { type: "string" },
                                    AWBCurrency: { type: "string" },
                                    Sector: { type: "string" },
                                    LACharges: { type: "string" }
                                }
                            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                        },

                    }),
                    sortable: true, filterable: false,
                    pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                    scrollable: true,
                    columns: [
                        //TransactionDate,AgentCode,AgentName,TransactionType,Commodity,Product,SPCharges,NetPyable,AWBNo,User,Remark,TariffRate,ChargeableWeight,AWBCurrency,Sector
                         //{ field: "SNo", title: "SNo", width: 90 },
                         { field: "TransactionDate", title: "Transaction Date", width: 110 },
                         { field: "AgentCode", title: "Agent Code", width: 90 },
                         { field: "AgentName", title: "Agent Name", width: 110 },
                         { field: "DebitCredit", title: "Debit/Credit", width: 90 },
                         { field: "TransactionType", title: "Transaction Type", width: 110 },
                         { field: "PenaltySubType", title: "Penalty Sub Type", width: 110 },
                          { field: "ServiceCargo", title: "Service Cargo", width: 90 },
                          { field: "RateClass", title: "Rate Class", width: 90 },
                         { field: "Commodity", title: "Commodity", width: 90 },
                         { field: "NOG", title: "Nature of Goods", width: 90 },
                         { field: "Product", title: "Product", width: 130 },
                         { field: "ExchangeCurrency", title: "Exchange Currency", width: 130 },
                         { field: "ExchangeRate", title: "Exchange Rate", width: 130 },
                         { field: "SPCharges", title: "SP Charges", width: 110 },
                        { field: "ReplanCharges", title: "Replan Charges", width: 110 },
                        { field: "LACharges", title: "Late Acceptance", width: 90 },
                         { field: "NetPayable", title: "Net Payable", width: 90 },
                         { field: "AWBNo", title: "AWB No", width: 90 },
                         { field: "AWBOrigin", title: "AWB Origin", width: 90 },
                         { field: "AWBDestination", title: "AWB Destination", width: 90 },
                         { field: "User", title: "User", width: 110 },
                         { field: "Remark", title: "Remark", width: 110 },
                         { field: "TariffRate", title: "Tariff Rate", width: 90 },
                         { field: "ChargeableWeight", title: "Chargeable Weight", width: 110 },
                         { field: "AWBCurrency", title: "AWB Currency", width: 90 },
                        { field: "Sector", title: "Sector", width: 90 }

                    ]
                });

                $('#grid').css('display', '');
                $('#exportflight').show();
                $("#grid").data('kendoGrid').dataSource.page(1);
                // $('#exportflight').show();
            }
        }
}


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
   // var filterAwb = cfi.getFilter("AND");
    var filterAWBNo = cfi.getFilter("OR");
    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
      
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_DestinationSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_OriginSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_AWBNo") {
        if (userContext.AgentSNo != '') {
            try {
                cfi.setFilter(filterAWBNo, "AccountSNo", "eq", userContext.AgentSNo);
                cfi.setFilter(filterAWBNo, "ParentID", "eq", userContext.AgentSNo);
                var awbno = cfi.autoCompleteFilter([filterAWBNo]);
                return awbno;
            }
            catch (exp)
            { }
        }

    }






    //else if (textId == "Text_FlightNo") {
    //    if ($('#Text_OriginSNo').val() != '')
    //        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
    //    if ($('#Text_DestinationSNo').val() != '')
    //        cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());

    //    cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());

    //    var RT_Filter = cfi.autoCompleteFilter(filterAirline);
    //    return RT_Filter;
    //}
}



function ExportExcelHoldType() {
    var AirlineCode = $('#AirlineCode').val();
    //var FlightNo = $('#FlightNo').val() == "" ? "0" : $("#FlightNo").val();
    var OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    var DestinationSNo = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
    var AWBNo = $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    //var AccountSNo = userContext.AgentSNo == "" ? "0" : userContext.AgentSNo;
    var AccountSNo = $("#Agent").val() == "" ? "0" : $("#Agent").val();
    var CurrencySNo = $('#CurrencySNo').val() == "" ? "0" : $('#CurrencySNo').val();
    window.location.href = "../FPRLionReport/ExportToExcel?AirlineCode=" + AirlineCode + "&OriginSNo=" + OriginSNo + "&DestinationSNo=" + DestinationSNo + "&AWBNo=" + AWBNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&AccountSNo=" + AccountSNo + "&CurrencySNo=" + CurrencySNo + "&IsAutoProcess=1";
}

function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AirlineCode") {

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

$("#Text_CurrencySNo").change(function () {
    checkExchangeRate();
});

//$("#Text_AirlineCode").change(function () {
//    checkExchangeRate();
//});
//// Add checkExchangeRate function By UMAR on 23-Oct-2018
function checkExchangeRate() {

    if ($("#Text_AirlineCode_input").val() == "") {
        ShowMessage('warning', 'Warning - FPR Report', "Select Airline");
        $("#CurrencySNo, #Text_CurrencySNo").val('');
        return false;
    }
    else {
        var currency = $("#CurrencySNo").val();
        var AirlineSNo = $("#AirlineCode").val();
        if (currency != "") {
            $.ajax({
                url: "../Services/Accounts/DirectPaymentService.svc/GetFPRExchangeRate", async: false, type: "GET", dataType: "json", cache: false,
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


$("#Text_AirlineCode").change(function () {
    CurrencyChange();
});

//Add CurrencyChange function by UMAR on 20-Sep-2018
function CurrencyChange() {
    try {
        $.ajax({
            type: "GET",
            url: "../Services/Accounts/CreditLimitReportService.svc/GetFprCurrencyInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#AirlineCode").val() }),
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

function ClickOnBlob() {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue('Apps').toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

}