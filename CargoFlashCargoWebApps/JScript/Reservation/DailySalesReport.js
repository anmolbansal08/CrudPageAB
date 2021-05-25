
var OnBlob = false;
$(document).ready(function ()
{
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });


    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "DailySalesReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "AccountCode,Name", "BookingVarianceReport_AccountCode", null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "City_Report", null, "contains");
    cfi.AutoCompleteV2("Destination", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");
    //cfi.AutoCompleteV2("AWBNo", "AWBNo", "BookingVarianceReport_AWB", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "BookingReport_AWB", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "OfficeName", "DailySalesReport_OfficeName", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);
    IdefaultAirportSno()
    $("#FromDate").change(function ()
    {
        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val()))
        {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val()))
        {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true)
        {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
    });

    if (userContext.SysSetting.ClientEnvironment == "G9")
        $('label[for=Sales]').html('G9');

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3)
    {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }

    if (userContext.CitySNo != "" && userContext.CityCode != "" && userContext.CityName != "") {
        $("#Origin").val(userContext.CitySNo);
        $("#Text_Origin_input").val(userContext.CityCode + '-' + userContext.CityName);
    }
    if (userContext.AgentSNo != "" && userContext.OfficeSNo!="") {
        $("#OfficeSNo").val(userContext.OfficeSNo);
        $("#Text_OfficeSNo_input").val(userContext.OfficeName);
        cfi.EnableAutoComplete("OfficeSNo", false);
        var agentName1 = userContext.AgentName.split("-", 1);
        var len = agentName1.toString().length;
        var agentName2 = userContext.AgentName.slice(len + 1, userContext.AgentName.length);
        $("#AgentSNo").val(userContext.OfficeSNo);
        $("#Text_AgentSNo_input").val(agentName1 + '-' + agentName2);
        cfi.EnableAutoComplete("AgentSNo", false);        
    }
    if (userContext.AgentSNo==0 && userContext.OfficeSNo != "") {
        $("#OfficeSNo").val(userContext.OfficeSNo);
        $("#Text_OfficeSNo_input").val(userContext.OfficeName);
        cfi.EnableAutoComplete("OfficeSNo", false);
    }
    $('#exportflight').hide();
    $('#grid').css('display', 'none')
    //$("#grid").kendoGrid({
    //    autoBind: false,
    //    dataSource: new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
    //        transport: {
    //            read: {
    //                url: "../DailySalesReport/DailySalesReportGetRecord",
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
    //                    SNo: { type: "number" },
    //                    AWBNo: { type: "string" },
    //                    BookingType: { type: "string" },
    //                    FlightDate: { type: "string" },
    //                    BookingDate: { type: "string" },
    //                    OfficeName:{type:"string"},
    //                    GSAName: { type: "string" },
    //                    ParticipantID: { type: "string" },
    //                    Origin: { type: "string" },
    //                    Destination: { type: "string" },
    //                    FlightNo: { type: "string" },
    //                    Pieces: { type: "string" },
    //                    GrWt: { type: "string" },
    //                    ChWt: { type: "string" },
    //                    Amount: { type: "string" },
    //                    Rate: { type: "string" },
    //                    Yield: { type: "string" },
    //                    TotalOtherCharges: { type: "string" }

    //                }
    //            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
    //        },

    //    }),

    //    //detailInit: detailInit,
    //    //filterable: { mode: 'menu' },
    //    sortable: true, filterable: false,
    //    pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
    //    scrollable: true,
    //    //height: 450,
    //    columns:
    //        [
    //        { field: "AWBNo", title: "AWB No", filterable: true, width: 80 },
    //        { field: "BookingType", title: "Booking Type", width: 70 },
    //        { field: "Origin", title: "Origin", width: 70 },
    //        { field: "Destination", title: "Destination", width: 70 },
    //        { field: "OfficeName", title: "Office Name", width:70},
    //        { field: "GSAName", title: "Agent Name", width: 80 },
    //        { field: "ParticipantID", title: "Participant ID", width: 80 },
    //       { field: "FlightNo", title: "Flight No", width: 70 },
    //       { field: "FlightDate", title: "Flight Date", width: 70 },
    //       { field: "BookingDate", title: "Booking Date", width: 70 },
    //       { field: "Pieces", title: "Pieces", width: 60 },
    //       { field: "GrWt", title: "GrWt", width: 60 },
    //        { field: "ChWt", title: "ChWt", width: 60 },
    //        { field: "Amount", title: "Amount", width: 70 },
    //         { field: "Rate", title: "Rate", width: 70 },
    //        { field: "Yield", title: "Yield", width: 70 },
    //        { field: "TotalOtherCharges", title: "Total Other Charges", width: 70 }
    //        ]
    //});
});
var Model = [];
function SearchDailySalesReport()
{
    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            Type: $('input[type="radio"][name=Filter]:checked').val(),
            DateType: $('input[type="radio"][name=DateTypeFilter]:checked').val(),
            OfficeSNo: $('#OfficeSNo').val() == "" ? "0" : $('#OfficeSNo').val(),
            AgentSNo: $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val(),
            Origin: $('#Origin').val() == "" ? "0" : $('#Origin').val(),
            Destination: $('#Destination').val() == "" ? "0" : $('#Destination').val(),
            AWBSNo: $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val(),
            IsAutoProcess: (OnBlob==true?0:1),
            pagesize:10,
        };
    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val()))
    {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "") {
        if (OnBlob) {

            $.ajax({
                url: "../Reports/DailySales",
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
            $('#exportflight').hide();
            $('#grid').css('display', 'none')
            $("#grid").kendoGrid({
                autoBind: false,
                dataSource: new kendo.data.DataSource({
                    type: "json",
                    serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
                    transport: {
                        read: {
                            url: "../DailySalesReport/DailySalesReportGetRecord",
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
                               // SNo: { type: "number" },
                                AWBNo: { type: "string" },
                                BookingType: { type: "string" },
                                FlightDate: { type: "string" },
                                BookingDate: { type: "string" },
                                OfficeName: { type: "string" },
                                GSAName: { type: "string" },
                                ParticipantID: { type: "string" },
                                Origin: { type: "string" },
                                Destination: { type: "string" },
                                FlightNo: { type: "string" },
                                Pieces: { type: "string" },
                                GrWt: { type: "string" },
                                ChWt: { type: "string" },
                                Amount: { type: "string" },
                                Rate: { type: "string" },
                                Yield: { type: "string" },
                                TotalOtherCharges: { type: "string" }

                            }
                        }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },

                }),

                //detailInit: detailInit,
                //filterable: { mode: 'menu' },
                sortable: true, filterable: false,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                scrollable: true,
                //height: 450,
                columns:
                    [
                    { field: "AWBNo", title: "AWB No", filterable: true, width: 80 },
                    { field: "BookingType", title: "Booking Type", width: 70 },
                    { field: "Origin", title: "Origin", width: 70 },
                    { field: "Destination", title: "Destination", width: 70 },
                    { field: "OfficeName", title: "Office Name", width: 70 },
                    { field: "GSAName", title: "Agent Name", width: 80 },
                    { field: "ParticipantID", title: "Participant ID", width: 80 },
                   { field: "FlightNo", title: "Flight No", width: 70 },
                   { field: "FlightDate", title: "Flight Date", width: 70 },
                   { field: "BookingDate", title: "Booking Date", width: 70 },
                   { field: "Pieces", title: "Pieces", width: 60 },
                   { field: "GrWt", title: "GrWt", width: 60 },
                    { field: "ChWt", title: "ChWt", width: 60 },
                    { field: "Amount", title: "Amount", width: 70 },
                     { field: "Rate", title: "Rate", width: 70 },
                    { field: "Yield", title: "Yield", width: 70 },
                    { field: "TotalOtherCharges", title: "Total Other Charges", width: 70 }
                    ]
            });

            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);

            $('#exportflight').show();
            $('#df #AirlineCode').val(Model.AirlineCode);
            $('#df #FromDate').val(Model.FromDate);
            $('#df #ToDate').val(Model.ToDate);
            $('#df #Type').val(Model.Type);
            $('#df #DateType').val(Model.DateType);
        }
    }
}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        cfi.setFilter(filterAirline, "IsActive", "eq", "1");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    else if (textId == "Text_Destination") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Origin").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_Origin") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);

        cfi.setFilter(filterAirline, "SNo", "in", IsdefaultAirPortSno);
        cfi.setFilter(filterAirline, "SNo", "notin", $("#Destination").val());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;


        //cfi.autoCompleteFilter(filterAirline);
        //return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Destination").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_OfficeSNo")
    {
        //if (userContext.AgentSNo == 0 && userContext.OfficeSNo == 0) {
        if ($("#Text_Origin").val() != '')
    {
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_Origin").data("kendoComboBox").key());
        var OfficeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OfficeAutoCompleteFilter2;
    }
    }
    //} 
    else if (textId == "Text_AgentSNo")
    {
        if ($("#Text_OfficeSNo").val() != '')
        {
        cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key())
        var AgentAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return AgentAutoCompleteFilter2;
        }
    }
    //else if (textId == "Text_AWBNo") {
    //    if(userContext.OfficeSNo==0 && userContext.AgentSno==0){
    //    cfi.setFilter(filterAirline, "OfficeSNo", "eq", userContext.OfficeSNo)
    //        var AWBNoAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //    return AWBNoAutoCompleteFilter2;
    //}
    //}
}

function ExportToExcel_DailySalesReport()
{
    var AirlineCode = $('#AirlineCode').val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    var Type = $('input[type="radio"][name=Filter]:checked').val();
    var DateType = $('input[type="radio"][name=DateTypeFilter]:checked').val();
    var OfficeSNo = $('#OfficeSNo').val() == "" ? "0" : $('#OfficeSNo').val();
    var AgentSNo = $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val();
    var Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    var Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    var AWBSNo = $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val();
    
    if (AirlineCode != "" && FromDate != "" && ToDate != "") 
    {
        window.location.href = "../DailySalesReport/ExportToExcel?AirlineCode=" + AirlineCode + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Type=" + Type + "&DateType=" + DateType + "&AgentSNo=" + AgentSNo + "&Origin=" + Origin + "&Destination=" + Destination + "&AWBSNo=" + AWBSNo + "&OfficeSNo=" + OfficeSNo + "&IsAutoProcess=1";
    }
}
var IsdefaultAirPortSno = "";
function IdefaultAirportSno()
{
    $.ajax({
        url: '/DailySalesReport/IdefaultAirportSno',
        dataType: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        async: true,
        processData: false,
        cache: false,
        success: function (response) {
            IsdefaultAirPortSno = response.Data[0].IsdefaultAirPortSno
        },
        error: function (xhr)
        {
            alert('error');
        }
    });
}
$("#Text_Origin").change(function ()
{
    if (userContext.AgentSno == 0 && userContext.OfficeSNo == 0) {
        $("#Text_AgentSNo_input").val('');
        $("#AgentSNo").val('');
    }
    $("#Text_Destination_input").val('');
    $("#Destination").val('');
    if (userContext.AgentSno == 0 || userContext.OfficeSNo == 0) {
        $("#Text_OfficeSNo_input").val('');
        $("#OfficeSNo").val('');
    }
});
$("#Text_OfficeSNo").change(function ()
{
    $("#Text_AgentSNo_input").val('');
    $("#AgentSNo").val('');
});
function ExtraParameters(id)
{
    var param = [];
    if (id == "Text_AirlineCode")
    {
        var UserSNo = userContext.UserSNo
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
    else if (id == "Text_Origin") {

        var UserSNo = userContext.UserSNo;
        var AgentSno = userContext.AgentSNo;
        var OfficeSNo = userContext.OfficeSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        param.push({ ParameterName: "AgentSno", ParameterValue: AgentSno });
        param.push({ ParameterName: "OfficeSNo", ParameterValue: OfficeSNo });
        return param;
    }
    else if (id == "Text_AWBNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}

$("#Text_Origin,#Text_AirlineCode").blur(function (e) {
    var txtid = e.currentTarget.id;
    if (txtid == "Text_Origin" && $("#Text_Origin_input").val() == "")
        $("#Origin").val('');
    else if (txtid == "Text_AirlineCode" && $("#Text_AirlineCode_input").val() == "")
        $("#AirlineCode").val('');
});

