
var OnBlob = false;

$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });
    //cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");


    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "CampaignUtilizationReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "SNo,Name", "CampaignUtilizationReport_Agents", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "SNo,Name", "CampaignUtilizationReport_office", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }
    if (userContext.OfficeSNo > 0 && userContext.UserTypeName.toUpperCase() == "GSA")
    {
        $("#OfficeSNo").val(userContext.OfficeSNo);
        $("#Text_OfficeSNo_input").val(userContext.OfficeName);
        cfi.EnableAutoComplete('OfficeSNo', false, false, null);

        //$("#OfficeSNo").data("kendoAutoComplete").enable(false);
        
    }

    //$("#FromDate").change(function () {

    //    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
    //        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //        $("#ToDate").data("kendoDatePicker").value('');
    //    }
    //    else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
    //        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //    }
    //});

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


    $('#exportflight').hide();
    $('#grid').css('display', 'none')

    //$("#grid").kendoGrid({
    //    autoBind: false,
    //    dataSource: new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
    //        transport: {
    //            read: {
    //                url: "../CampaignUtilisationReport/GetRecord",
    //                dataType: "json",
    //                global: false,
    //                type: 'POST',
    //                contentType: "application/json; charset=utf-8",
    //                data: function GetReportData() {


    //                    return { Model: Model };
    //                    //AirlineSNo: AirlineSNo, CampaignCode: CampaignCode, FromDate: FromDate, ToDate: ToDate, AgentSNo: AgentSNo, CodeType: CodeType, Status: Status 
    //                }

    //            }, parameterMap: function (options) {
    //                if (options.filter == undefined)
    //                    options.filter = null;
    //                if (options.sort == undefined)
    //                    options.sort = null; return JSON.stringify(options);
    //            },
    //        }, requestStart: function (e) {
    //            ShowLoader(true);
    //        }, requestEnd: function (e) {
    //            ShowLoader(false);
    //        },
    //        schema: {
    //            model: {
    //                id: "Code",
    //                fields: {
    //                    SNo: { type: "number" },
    //                    Code: { type: "string" },
    //                    RSPRate: { type: "string" },
    //                    RequestedRate: { type: "string" },
    //                    NoOfCode: { type: "string" },
    //                    UtilizedAWB: { type: "string" },
    //                    ApprovedRate: { type: "string" },
    //                    IsApproved: { type: "string" },
    //                    CreatedBy: { type: "string" },
    //                    ApprovedBy: { type: "string" }
    //                }
    //            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
    //        },

    //    }),
    //    //height: 550,     
    //    detailInit: detailInit,
    //    filterable: { mode: 'menu' },
    //    sortable: true, filterable: true,
    //    pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
    //    columns: [
    //        //{ field: "AWBPrefix" },
    //        { field: "Code", title: "Code", filterable: true, width: 80 },
    //         { field: "IsApproved", title: "Status", width: 80 },
    //        { field: "RSPRate", title: "RSP Rate", width: 80 },
    //        { field: "RequestedRate", title: "Requested Rate", width: 80 },
    //          { field: "NoOfCode", title: "No Of Code", width: 80 },
    //          { field: "UtilizedAWB", title: "Utilized/Non-Utilized AWB", width: 120 },
    //        { field: "ApprovedRate", title: "Approved Rate", width: 80 },
    //        { field: "CreatedBy", title: "Created By", width: 80 },
    //        { field: "ApprovedBy", title: "Approved By", width: 80 }
    //    ]
    //});
    //AWBPrefix = e.data.AWBPrefix;
 
});


var Model = [];
function GetReportData() {
    Model = {
        AirlineCode: $('#AirlineCode').val() == "" ? "0" : $('#AirlineCode').val(),
        CampaignCode: $("#CampaignCode").val() == "" ? "0" : $('#CampaignCode').val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        OfficeSNo: $("#OfficeSNo").val() == "" ? "0" : $('#OfficeSNo').val(),
        AgentSNo: $("#AgentSNo").val() == "" ? "0" : $('#AgentSNo').val(),
        CodeType: $('input[type="radio"][name=Filter]:checked').val() == "" ? "0" : $('input[type="radio"][name=Filter]:checked').val(),
        Status: $('input[type="radio"][name=Status]:checked').val() == "" ? "0" : $('input[type="radio"][name=Status]:checked').val(),
        IsAutoProcess: (OnBlob==true?0:1),
        pagesize:10
    };
    if (Model.CodeType == "1") {
        $('th[data-field="NoOfCode"]').text('No of Trans/No of Code');
        $('th[data-field="RSPRate"]').text('Campaign (%)');
        $('th[data-field="ApprovedRate"]').text('Approved Rate (%)');
      //  $("#grid").data("kendoGrid").hideColumn(3);

    }
    else if (Model.CodeType == "0" || Model.CodeType == "2") {
        $('th[data-field="NoOfCode"]').text('No Of Code')

    }
    if (Model.Status == "2") {
      //  $("#grid").data("kendoGrid").hideColumn(6);

        $('th[data-field="ApprovedBy"]').text('Rejected By');
    }
    else {
     //   $("#grid").data("kendoGrid").showColumn(6);

        $('th[data-field="ApprovedBy"]').text('Approved By');
    }

    if (Model.CodeType == "2") {
       // $("#grid").data("kendoGrid").hideColumn(3);

        $('th[data-field="RSPRate"]').text('Campaign (%)');
        $('th[data-field="ApprovedRate"]').text('Approved Rate (%)');
    }
    if (Model.CodeType == "0") {
        $("#grid").data("kendoGrid").showColumn(3);

        $('th[data-field="RSPRate"]').text('RSP Rate');
        $('th[data-field="ApprovedRate"]').text('Approved Rate');
    }
    if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "") {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/CampaignUtilisationReport",
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
                    serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
                    transport: {
                        read: {
                            url: "../CampaignUtilisationReport/GetRecord",
                            dataType: "json",
                            global: false,
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            data: function GetReportData() {


                                return { Model: Model };
                                //AirlineSNo: AirlineSNo, CampaignCode: CampaignCode, FromDate: FromDate, ToDate: ToDate, AgentSNo: AgentSNo, CodeType: CodeType, Status: Status 
                            }

                        }, parameterMap: function (options) {
                            if (options.filter == undefined)
                                options.filter = null;
                            if (options.sort == undefined)
                                options.sort = null; return JSON.stringify(options);
                        },
                    }, requestStart: function (e) {
                        ShowLoader(true);
                    }, requestEnd: function (e) {
                        ShowLoader(false);
                    },
                    schema: {
                        model: {
                            id: "Code",
                            fields: {
                                SNo: { type: "number" },
                                Code: { type: "string" },
                                ReferenceNo: {type: "string"},
                                RSPRate: { type: "string" },
                                RequestedRate: { type: "string" },
                                NoOfCode: { type: "string" },
                                UtilizedAWB: { type: "string" },
                                ApprovedRate: { type: "string" },
                                IsApproved: { type: "string" },
                                CreatedBy: { type: "string" },
                                ApprovedBy: { type: "string" }
                            }
                        }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },

                }),
                //height: 550,     
                detailInit: detailInit,
                filterable: { mode: 'menu' },
                sortable: true, filterable: true,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                columns: [
                    
                    //{ field: "AWBPrefix" },
                    { field: "Code", title: "Code", filterable: true, width: 80 },
                    { field: "ReferenceNo", title: "Reference No", filterable: true, width: 80 },
                     { field: "IsApproved", title: "Status", width: 80 },
                    { field: "RSPRate", title: "RSP Rate", width: 80 },
                    { field: "RequestedRate", title: "Requested Rate", width: 80 },
                      { field: "NoOfCode", title: "No Of Code", width: 80 },
                      { field: "UtilizedAWB", title: "Utilized/Non-Utilized AWB", width: 120 },
                    { field: "ApprovedRate", title: "Approved Rate", width: 80 },
                    { field: "CreatedBy", title: "Created By", width: 80 },
                    { field: "ApprovedBy", title: "Approved By", width: 80 }
                ]
            });
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
            $("#grid").data('kendoGrid').dataSource.read();
            $('#exportflight').show();

        }
    }
}


var isHidden = true;

function detailInit(e) {
    BindHideCol();
    $("<div/>").appendTo(e.detailCell).kendoGrid({

        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
            transport: {
                read: {
                    url: "../CampaignUtilisationReport/GetCodeDescription",
                    dataType: "json",
                    global: true,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: { Code: e.data.Code, SNo: e.data.SNo, CodeType: Model.CodeType }
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
                        //OfficeSNo: { type: "number" },
                        AgentName: { type: "string" },
                        AWBNo: { type: "string" },
                        // Add Model by umar on 30-10-2018
                        Origin: { type: "string" },
                        Destination: { type: "string" },
                        FlightDate: { type: "string" },
                        FLightNo: { type: "string" },
                        CommodityDescription: { type: "string" },                       
                        ProductName: { type: "string" },
                        TotalChargeableWeight: { type: "string" },
                        SHCCodeName: { type: "string" },                                            
                        CodeUsed: { type: "string" },
                        NoOfCode: { type: "string" },
                        AppliedCode: { type: "string" },
                        Remaining: { type: "string" },
                        AppliedBy: { type: "string" }

                    }
                },
                data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                
            },

        }),
        filterable: { mode: 'menu' },
        sortable: true, filterable: true,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        columns: [
            //{ field: "OfficeSNo", title: "OfficeSNo " },
            { field: "AgentName", title: "Agent Name" },
            { field: "AWBNo", title: "AWB No" },
            { field: "Origin", title: "Origin", hidden: 'true', hidden: isHidden },
            { field: "Destination", title: "Destination",hidden: isHidden },
            { field: "FlightDate", title: "Flight Date", hidden: isHidden },
            { field: "FLightNo", title: "Flight No", hidden: isHidden },
            { field: "CommodityDescription", title: "Commodity", hidden: isHidden },
            { field: "ProductName", title: "Product", hidden: isHidden },
            { field: "TotalChargeableWeight", title: "CH Weight", hidden: isHidden },
            { field: "SHCCodeName", title: "SHC", hidden: isHidden },           
            { field: "CodeUsed", title: "Code Applied" },
            { field: "AppliedCode", title: "Applied Code" },
            { field: "Remaining", title: "Remaining" },
            { field: "AppliedBy", title: "Applied By" }
        ]
    });
   

}

function BindHideCol()
{
    // var StatusReq = $('[type="radio"][id="IsRequested"]').val();
    //$('th[data-field="Origin"]').text('Origin').show();
    //$('div.k-grid-content').find('table tbody tr td:eq(2)').show();
   // $('th[data-field="Destination"]').text('Destination').hide();
   
    var req = $("#IsRequested").prop('checked');
    var spot = $("#IsSpot").prop('checked');
    var approved = $("#IsApproved").prop('checked');
    var codesingle = $("#IsSingle").prop('checked');
    var codemultiple = $("#IsMultiple").prop('checked');
    var rejected = $("#IsRejected").prop('checked');
    
    if (approved == true && codesingle == true)
    {
        isHidden = false;      
    }
    if (approved == true && spot == true)
    {
        isHidden = true;
    }
    if (approved == true && codemultiple == true)
    {
        isHidden = true;
    }

    else if (req == true && spot == true)
    {
        isHidden = true;
    }
    else if(req==true && codesingle==true)
    {
        isHidden = true;
    }
    else if (req == true && codemultiple == true)
    {
        isHidden = true;
    }
    else if (rejected == true && spot == true) {
        isHidden = true;
    }
    else if (rejected == true && codesingle == true) {
        isHidden = true;
    }
    else if (rejected == true && codemultiple == true) {
        isHidden = true;
    }
 
}


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    if (textId == "Text_AgentSNo") {
        try {
            cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_AirlineCode").data("kendoComboBox").key());
            cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key())
            cfi.setFilter(filterAirline, "IsBlacklist", "eq", 0);

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }

    }
}






function ExportToExcel_Flight() {

    var AirlineCode = $('#AirlineCode').val() == "" ? "0" : $('#AirlineCode').val();
    var CampaignCode = $("#CampaignCode").val() == "" ? "0" : $('#CampaignCode').val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    var OfficeSNo = $("#OfficeSNo").val()== "" ? "0" : $('#OfficeSNo').val();
    var AgentSNo = $("#AgentSNo").val() == "" ? "0" : $('#AgentSNo').val();
    var CodeType = $('input[type="radio"][name=Filter]:checked').val() == "" ? "0" : $('#Filter').val();
    var Status = $('input[type="radio"][name=Status]:checked').val()  == "" ? "0" : $('#Status').val();
    var IsAutoProcess = (OnBlob == true ? 0 : 1);
    if (AirlineCode != "" && FromDate != "" & ToDate != "") {
        window.location.href = "../CampaignUtilisationReport/ExportToExcel?AirlineCode=" + AirlineCode + "&CampaignCode=" + CampaignCode + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&OfficeSNo=" + OfficeSNo + "&AgentSNo=" + AgentSNo + "&CodeType=" + CodeType + "&Status=" + Status + "&IsAutoProcess=" + IsAutoProcess;
    }

}