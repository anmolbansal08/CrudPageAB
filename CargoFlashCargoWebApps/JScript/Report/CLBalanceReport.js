var OnBlob = false;

$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "CLR_Airline", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "OfficeName", "CreditLimitReport_AirlineOffice", clearagent, "contains");
    cfi.AutoCompleteV2("AccountSNo", "AgentName", "CreditLimitReport_AirlineOfficeAgent", promptMsg, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "CLBalance_AirportCode", null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "DirectPayment_Currency", checkExchangeRate, "contains");


 

    $('#AirlineSNo').val(userContext.AirlineSNo);
    $('#Text_AirlineSNo_input').val(userContext.AirlineCarrierCode);
    $('#CurrencySNo').val(userContext.CurrencySNo);
    $('#Text_CurrencySNo_input').val(userContext.CurrencyCode + '-' + userContext.CurrencyName);


    if (userContext.GroupName == "ADMIN") {
        $('#AirlineSNo').val(userContext.AirlineSNo);
        $('#Text_AirlineSNo_input').val(userContext.AirlineCarrierCode);

    }
    else if (userContext.GroupName == "AGENT" || userContext.GroupName == "AJC") {
        $('#AirlineSNo').val(userContext.AirlineSNo);
        $('#Text_AirlineSNo_input').val(userContext.AirlineCarrierCode);
    
        $('#AccountSNo').val(userContext.AgentSNo);
        $('#Text_AccountSNo_input').val(userContext.AgentName);
        cfi.EnableAutoComplete("AccountSNo", false);
        $(".Agent").attr('disabled', true);
        $(".Office").attr('disabled', true);
        $("#Office").val(1);

    }
    else if (userContext.GroupName == "GSA") {
        $('#AirlineSNo').val(userContext.AirlineSNo);
        $('#Text_AirlineSNo_input').val(userContext.AirlineCarrierCode);
        $('#OfficeSNo').val(userContext.OfficeSNo);
        $('#Text_OfficeSNo_input').val(userContext.OfficeName);
        cfi.EnableAutoComplete("OfficeSNo", false);
        $('.Office').prop('checked', false);
        $('.Agent').prop('checked', true);
        $(".Agent").attr('disabled', true);
        $(".Office").attr('disabled', true);
        $("#Office").val(0);
    }

    cfi.DateType("ValidFrom");
    cfi.DateType("ValidTo");

    $('#ValidFrom').attr('readonly', true);
    $('#ValidTo').attr('readonly', true);


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


    var CheckAgent = $('#Office').val();
    if (CheckAgent == "1") {

        cfi.EnableAutoComplete("AccountSNo", false);
    }

    $('[type="radio"][id="Office"]').on('change', function () {
        var checkAgentOffice = parseInt($(this).val());
        if (checkAgentOffice == 0) {
      
            cfi.EnableAutoComplete("AccountSNo", true);
            cfi.EnableAutoComplete("OfficeSNo", false);
            $('#Text_OfficeSNo_input, #OfficeSNo').val('');
     
        }
        else {

            cfi.EnableAutoComplete("AccountSNo", false);
            cfi.EnableAutoComplete("OfficeSNo", true);
            $('#Text_AccountSNo_input, #AccountSNo').val('');
          
        }
    })
    $('#imgexcel').hide();

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
function promptMsg() {
    if ($("#AirlineSNo").val() == '' || 0 ) {
        ShowMessage('info', 'Need your Kind Attention!', " Select Airline");
    }
}
function checkExchangeRate() {

    if ($("#Text_AirlineSNo_input").val() == "") {
        ShowMessage('warning', 'Warning - CL Balance Report', "Select Airline");
        $("#CurrencySNo, #Text_CurrencySNo_input").val('');
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
                            ShowMessage('warning', 'Warning - CL Balance Report', "Exchange Rate Not Available for: " + FromCurrency + " To " + ToCurrency + "");
                            $("#CurrencySNo").val('');
                            $("#Text_CurrencySNo_input").val('');
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

function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}





function CreateCLBalanceReportGrid() {
   
    $('#grid').empty();
    Model = {
        OfficeSNo: $("#OfficeSNo").val() == '' ? '0' : $("#OfficeSNo").val(),
        AccountSNo: $("#AccountSNo").val() == '' ? '0' : $("#AccountSNo").val(),
        ValidFrom: $('#ValidFrom').val(),
        ValidTo: $('#ValidTo').val(),
        CurrencySNo: $('#CurrencySNo').val() == '' ? 0 : $('#CurrencySNo').val(),
        AirlineSNo: $('#AirlineSNo').val() == '' ? 0: $('#AirlineSNo').val(),
        CitySNo: $('#CitySNo').val() == '' ? '0' : $('#CitySNo').val(),
        Type: $('input[name="Type"]:checked').val()
    };
    if ($("#Text_AirlineSNo_input").val() == "" || $("#AirlineSNo").val() == 0) {
       // ShowMessage('warning', 'Warning - CL Balance Report', "Select Airline");
        $('#imgexcel').hide();
        return false;
    }
    else {
        $('#imgexcel').show();
        if (Model.AccountSNo != "0") {

            $("#grid").kendoGrid({
                autoBind: true,

                dataSource: new kendo.data.DataSource({
                    type: "json",
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    pageSize: 10,
                    transport: {
                        read: {
                            url: "../CLBalanceReport/GetCLBalanceRecord",
                            dataType: "json",
                            global: true,
                            type: 'POST',
                            method: 'POST',
                            contentType: "application/json; charset=utf-8",
                            data: { model: Model }

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
                                Origin: { type: "string" },
                                OfficeName: { type: "string" },
                                AgentName: { type: "string" },
                                MaxCL: { type: "number" },
                                AvlBalanceCL: { type: "number" },
                                TransactionAmount: { type: "number" },
                                TransactionType: { type: "string" },
                                Currency: { type: "string" },
                                ReferenceNo: { type: "string" },
                                ApprovedBy: { type: "string" },
                                ApprovedDate: { type: "string" },
                                Remarks: { type: "string" },
                                Status: { type: "string" }


                            }
                        }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },
                    group: {
                        field: "AgentName", hidden: true, aggregates: [
                            { field: "MaxCL", aggregate: "sum" },
                            { field: "AvlBalanceCL", aggregate: "sum" },
                            { field: "AgentName", aggregate: "count" }
                        ]
                    },

                    aggregate: [
                        { field: "AgentName", aggregate: "count" },
                        { field: "MaxCL", aggregate: "sum" },
                        { field: "AvlBalanceCL", aggregate: "sum" }

                    ]

                }),
                filterable: true,
                sortable: true,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                scrollable: true,
                columns: [
                    { field: "Origin", title: "Origin" },
                    { field: "OfficeName", title: "Office Name", filterable: true },
                    { field: "AgentName", title: "Agent Name" },
                    { field: "MaxCL", title: "Max CL", aggregates: ["sum"], footerTemplate: "Total: #=sum#" },
                    { field: "AvlBalanceCL", title: "Avl Balance CL", aggregates: ["sum"], footerTemplate: "Total: #=sum#" },
                    { field: "TransactionAmount", title: "Transaction Amount" },
                    { field: "TransactionType", title: "Transaction Type" },
                    { field: "Currency", title: "Currency" },
                    { field: "ReferenceNo", title: "Reference No" },
                    { field: "ApprovedBy", title: "Approved By" },
                    { field: "ApprovedDate", title: "Approved Date" },
                    { field: "Remarks", title: "Remarks" },
                    { field: "Status", title: "Status" },

                ],

            });

            $("#grid").kendoTooltip({
                filter: "table tr:not(.k-grouping-row):not(.k-footer-template) :nth-child(n):not(.k-group-cell):not(:empty):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):not(.k-filter):empty)):not(a)",
                content: function (e) {

                    var target = e.target;
                    return $(target).text();
                }
            });

        }
        else {


            $("#grid").kendoGrid({
                autoBind: true,

                dataSource: new kendo.data.DataSource({
                    type: "json",
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    pageSize: 10,
                    transport: {
                        read: {
                            url: "../CLBalanceReport/GetCLBalanceRecord",
                            dataType: "json",
                            global: true,
                            type: 'POST',
                            method: 'POST',
                            contentType: "application/json; charset=utf-8",
                            data: { model: Model }

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
                                Origin: { type: "string" },
                                OfficeName: { type: "string" },
                                AgentName: { type: "string" },
                                MaxCL: { type: "string" },
                                AvlBalanceCL: { type: "string" },
                                TransactionAmount: { type: "number" },
                                TransactionType: { type: "string" },
                                Currency: { type: "string" },
                                ReferenceNo: { type: "string" },
                                ApprovedBy: { type: "string" },
                                ApprovedDate: { type: "string" },
                                Remarks: { type: "string" },
                                Status: { type: "string" }


                            }
                        }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },


                }),
                filterable: true,
                sortable: true,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                scrollable: true,
                columns: [
                    { field: "Origin", title: "Origin" },
                    { field: "OfficeName", title: "Office Name", filterable: true },
                    { field: "AgentName", title: "Agent Name" },
                    { field: "MaxCL", title: "Max CL" },
                    { field: "AvlBalanceCL", title: "Avl Balance CL" },
                    { field: "TransactionAmount", title: "Transaction Amount" },
                    { field: "TransactionType", title: "Transaction Type" },
                    { field: "Currency", title: "Currency" },
                    { field: "ReferenceNo", title: "Reference No" },
                    { field: "ApprovedBy", title: "Approved By" },
                    { field: "ApprovedDate", title: "Approved Date" },
                    { field: "Remarks", title: "Remarks" },
                    { field: "Status", title: "Status" },

                ],

            });
            $('span.k-i-excel').removeClass('k-icon');



            $("#grid").kendoTooltip({
                filter: "table tr:not(.k-grouping-row):not(.k-footer-template) :nth-child(n):not(.k-group-cell):not(:empty):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):not(.k-filter):empty)):not(a)",
                content: function (e) {

                    var target = e.target;
                    return $(target).text();
                }
            });
        }
    }
 
}
function ExportExcelHoldType() {

  
    var OfficeSNo = $("#OfficeSNo").val() == '' ? '0' : $("#OfficeSNo").val();
    var AccountSNo = $("#AccountSNo").val() == '' ? '0' : $("#AccountSNo").val();
    var ValidFrom = $('#ValidFrom').val();
    var ValidTo = $('#ValidTo').val();
    var CurrencySNo = $('#CurrencySNo').val() == '' ? 0 : $('#CurrencySNo').val();
    var AirlineSNo = $('#AirlineSNo').val();
    var CitySNo = $('#CitySNo').val() == '' ? '0' : $('#CitySNo').val();
    var Type = $('input[name="Type"]:checked').val();
  
  
    window.location.href = "../CLBalanceReport/ExportToExcel?OfficeSNo=" + OfficeSNo + "&AccountSNo=" + AccountSNo + "&ValidFrom=" + ValidFrom + "&ValidTo=" + ValidTo + "&CurrencySNo=" + CurrencySNo + "&AirlineSNo=" + AirlineSNo + "&CitySNo=" + CitySNo + "&Type=" + Type;
}


function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        if ($('#Text_AirlineSNo_input').val() == "") {
            $('#AirlineSNo').val(0);
        }
    }

    if (userContext.GroupName == 'GSA') {
        if (textId == "Text_AccountSNo") {
            cfi.setFilter(filter, "OfficeSNo", "in", userContext.OfficeSNo);
            return cfi.autoCompleteFilter(filter);
        }
    }
    if (userContext.GroupName == 'GSA ADMIN') {
        if (textId == "Text_OfficeSNo") {
            cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo);
            return cfi.autoCompleteFilter(filter);
        }
        if (textId == "Text_AccountSNo") {
            cfi.setFilter(filter, "OfficeSNo", "in", userContext.OfficeSNo);
            return cfi.autoCompleteFilter(filter);
        }
    }
}


$('#SearchTransactionHistory').click(function (e) {
    checkExchangeRate();
    if (!cfi.IsValidSubmitSection()) {
        return false;
    };
  //  $("#exportflight").remove();
    $('#grid').hide();
    if (($('#AirlineSNo').val() == "")) {
        //ShowMessage('info', 'Need your Kind Attention!', " Select Airline");
        return;
    }
    //else if ($("#Text_AccountSNo_input").val() == "" && $("#Text_OfficeSNo_input").val() == "" && $('[type="radio"][id="Office"]:checked').val() == "0") {
    //    ShowMessage('info', 'Need your Kind Attention!', "Select Either Office Or Agent");
    //    return;
    //}
    //else if ($("#Text_AccountSNo").val() == "" && $("#Text_OfficeSNo").val() == "" && $('[type="radio"][id="CustomerType"]:checked').val() == "1") {
    //    ShowMessage('info', 'Need your Kind Attention!', "Select Either Office Or Agent");
    //    return;
    //}  
    //if ($("#CurrencySNo").val() == "") {
    //    ShowMessage('info', 'Need your Kind Attention!', " Select Currency");
    //}
    else if ($('#ValidFrom').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Valid From Date")
    }
    else if ($('#ValidTo').val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', " Select Valid To Date")
    }
    else {
        $('#grid').show();
        ShowLoader(true);
        //$('[type="radio"][id="Office"]:checked').val() == "0" ? CreateCreditLimitReportGrid() : CreateBGReport()
        ////  if (getQueryStringValue("FormAction").toUpperCase() == "NEW"){
        //if ($('#tblCreditLimitReport_Type_1').length < 1 && $('#tblCreditLimitReport_ReferenceNumber_1').length < 1) {
        //    //ShowMessage('info', 'Need your Kind Attention!', " No Record Found For Given Parameters");
        //    //$('#tblCreditLimitReport').hide();
        //    $('#tblCreditLimitReport').show(); // If there is no data then grid bind empty, add by UMAR on 09-Aug-2018
        //}
        //else {
        //    $('#SearchTransactionHistory').closest('td').append('<div id="exportflight" style="margin-left: 130px; margin-top: -26px;"><img id=" imgexcel" src="../Images/IconExcel.png" style="width:30px;height:30px;cursor: pointer;" title="Export To Excel" onclick="ExportToExcel()"></div>');

        //}
    }

    //$("#divCreditLimitReport").attr('style', 'overflow-x: scroll');
});