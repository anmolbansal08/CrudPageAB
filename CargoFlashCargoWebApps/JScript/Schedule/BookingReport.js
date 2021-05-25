/// <reference path="../../Scripts/references.js" />
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

    //comentd by akash bcz getting wrong code on 23 aug  2017
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "BookingReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentName", "AccountCode,Name", "BookingReport_Agents", null, "contains");
    cfi.AutoCompleteV2("BookingFlightNo", "FlightNo", "BookingReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Destination", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "BookingReport_Product", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "BookingReport_Commodity", null, "contains");
    cfi.AutoCompleteV2("Office", "OfficeName", "BookingReport_OfficeName", null, "contains");

    if (userContext.CitySNo != "" && userContext.CityCode != "" && userContext.CityName != "") {
        $("#Origin").val(userContext.CitySNo);
        $("#Text_Origin_input").val(userContext.CityCode + '-' + userContext.CityName);
    }
    if (userContext.GroupName.toUpperCase().indexOf("ADMIN") >= 0) {

    }
    else {
        cfi.EnableAutoComplete('Origin', false, false, null);//diasble
    }


    if (userContext.GroupName.indexOf('ADMIN') >= 0) {    //Comment By Akash bcz of Super Admin

    }
    else if (userContext.GroupName == "AGENT") {

        if (userContext.AgentSNo != "" && userContext.AgentName != "") {
            $('#AgentName').val(userContext.AgentSNo == 0 ? "0" : userContext.AgentSNo);
            $('#Text_AgentName_input').val(userContext.AgentName);
        }
        cfi.EnableAutoComplete('AgentName', false, false, null);//diasble
    }
    else { }


    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {

        $("#Airline").val(userContext.AirlineName.substring(0, 3));
        $("#Text_Airline_input").val(userContext.AirlineCarrierCode);
    }
    cfi.DateType("Fromdate");
    cfi.DateType("Todate");

    $('#Fromdate').attr('readonly', true);
    $('#Todate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#Todate").data("kendoDatePicker");
    validTodate.min(todaydate);

    //$("#Fromdate").change(function () {

    //    $("#Todate").data("kendoDatePicker").min($("#Fromdate").val());
    //    $("#Todate").data("kendoDatePicker").value('');
    //});

    $("#Fromdate").change(function () {

        if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {
            $("#Todate").data("kendoDatePicker").min($("#Fromdate").val());
            $("#Todate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#Fromdate").val()) < Date.parse($("#Todate").val())) {
            $("#Todate").data("kendoDatePicker").min($("#Fromdate").val());
        }
        else if (isNaN(Date.parse($("#Todate").val())) == true) {
            $("#Todate").data("kendoDatePicker").min($("#Fromdate").val());
            $("#Todate").data("kendoDatePicker").value('');
        }
    });

    $('#exportflight').hide();
    $('#grid').css('display', 'none')

    //$("#grid").kendoGrid({
    //    autoBind: false,
    //    dataSource: new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
    //        transport: {
    //            read: {
    //                url: "../SearchSchedule/GetBookingReport",
    //                dataType: "json",
    //                global: false,
    //                type: 'POST',
    //                contentType: "application/json; charset=utf-8",
    //                data:Model, 
    //               // function GetReportData() {
    //                //    Airline = $('#Airline').val();
    //                //    AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val(),
    //                //    OfficeName = $('#Office').val() == "" ? "0" : $('#Office').val(),
    //                //    Product = $('#Product').val() == "" ? "0" : $('#Product').val(),
    //                //    Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    //                //    if ($("#Text_Origin_input").val() != "") {
    //                //        Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    //                //    } else { Origin = 0; }
    //                //    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    //                //    Fromdate = $('#Fromdate').val();
    //                //    Todate = $('#Todate').val();
    //                //    BookingFlightNo = $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val();
    //                //    CheckedStatus = $('input[name=Filter]:checked').val();
    //                //    return { careerCode: Airline, OfficeName: OfficeName, Agentsno: AgentName, productSno: Product, CommoditySno: Commodity, OriginCitySno: Origin, DestinationCitySno: Destination, fromdate: Fromdate, todate: Todate, CheckedStatus: CheckedStatus, BookingFlightNo: BookingFlightNo };
    //                //}

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
    //                    AWBDATE: { type: "string" },
    //                    FlightDate: { type: "string" },
    //                    OfficeName: { type: "string" },
    //                    AccountName: { type: "string" },
    //                    ORIGIN: { type: "string" },
    //                    DESTINATION: { type: "string" },
    //                    COMMODITYCODE: { type: "string" },
    //                    SHC: { type: "string" },
    //                    ProductName: { type: "string" },
    //                    FlightNo: { type: "string" },
    //                    Pieces: { type: "string" },
    //                    Vol: { type: "string" },
    //                    VolWt: { type: "string" },
    //                    GrWt: { type: "string" },
    //                    ChWt: { type: "string" },
    //                    Rate: { type: "string" },
    //                    Yield: { type: "string" },
    //                    Amount: { type: "string" },
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
    //    columns: [

    //        { field: "AWBNo", title: "AWB No", filterable: true, width: 70 },
    //        { field: "BookingType", title: "Book Type", width: 70 },
    //        { field: "AWBDATE", title: "AWB DATE", width: 70 },
    //        { field: "FlightDate", title: "Flight Date", width: 70 },
    //        { field: "ORIGIN", title: "Origin", width: 40 },
    //        { field: "DESTINATION", title: "Dest", width: 40 },
    //        { field: "OfficeName", title: "Office Name", width: 80 },
    //        { field: "AccountName", title: "Account Name", width: 90 },
    //        { field: "COMMODITYCODE", title: "Commodity", width: 120 },
    //        { field: "SHC", title: "SHC", width: 120 },
    //        { field: "ProductName", title: "Product Name", width: 70 },
    //        { field: "FlightNo", title: "Flight No", width: 70 },
    //        { field: "Pieces", title: "Pieces", width: 70 },
    //        { field: "Vol", title: "Vol.", width: 70 },
    //        { field: "VolWt", title: "Vol Wt", width: 70 },
    //        { field: "GrWt", title: "Gr.Wt", width: 70 },
    //        { field: "ChWt", title: "Ch.Wt", width: 70 },
    //        { field: "Rate", title: "Rate", width: 70 },
    //        { field: "Yield", title: "Yield", width: 70 },
    //        { field: "Amount", title: "Amount", width: 70 },
    //        { field: "TotalOtherCharges", title: "Total Other Charges", width: 90 }
    //    ]
    //});
    $("#Text_AgentName").change(function ()
    {

        GetProductAsPerAgent();
    });


});


var ProductAsPerAgent = "";
function GetProductAsPerAgent() {
    ProductAsPerAgent = '';
    if ($("#Text_AgentName").val() != "" && $("#Text_AgentName").val() != undefined) {
        $.ajax({
            url: "../Services/Shipment/ReservationBookingService.svc/GetProductAsPerAgent",
            async: false,
            type: "GET",
            dataType: "json",
            data: { AgentSNo: $("#AgentName").val() == "" ? 0 : $("#AgentName").val() },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    //if (myData.Table0.length > 0) {
                    ProductAsPerAgent = myData.Table0[0].ProductSNo;
                    //}
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}



//var Airline = "";
//var AgentName = "";
//var Product = "";
//var Commodity = "";
//var Origin = "";
//var Destination = "";
//var Fromdate = "";
//var CheckedStatus = "";
//var BookingFlightNo = "";
//var OfficeName = "";

var Model = [];

$('#btnSubmit').click(function () {

    Model = {
        careerCode: $('#Airline').val(),
        Agentsno: $('#AgentName').val() == "" ? "0" : $('#AgentName').val(),
    OfficeName : $('#Office').val() == "" ? "0" : $('#Office').val(),
    productSno: $('#Product').val() == "" ? "0" : $('#Product').val(),
    CommoditySno: $('#Commodity').val() == "" ? "0" : $('#Commodity').val(),
    OriginCitySno: $('#Origin').val() == "" ? "0" : $('#Origin').val(),
    DestinationCitySno: $('#Destination').val() == "" ? "0" : $('#Destination').val(),
    Fromdate : $('#Fromdate').val(),
    Todate : $('#Todate').val(),
    BookingFlightNo : $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val(),
    CheckedStatus: $('input[name=Filter]:checked').val(),
    ShipmentType:$('input[name=Domestic]:checked').val(),
    IsAutoProcess: (OnBlob==true?0:1),
        pagesize:100000
    };

    if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        alert('From Date can not be greater than To Date');
        return false;;
    }


    if (!cfi.IsValidSubmitSection()) {
        return false;
    }


    //Airline = $('#Airline').val();
    //AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()
    //OfficeName = $('#Office').val() == "" ? "0" : $('#Office').val(),
    //Product = $('#Product').val() == "" ? "0" : $('#Product').val();
    //Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    //if ($("#Text_Origin_input").val() != "") {
    //    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    //} else { Origin = 0; }
    //Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    //Fromdate = $('#Fromdate').val();
    //Todate = $('#Todate').val();
    //BookingFlightNo = $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val();
    //CheckedStatus = $('input[name=Filter]:checked').val();
    if (Airline != "" && Fromdate != "" && Todate != "") {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/BookingReport",
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
    //         $('#exportflight').hide();
    //$('#grid').css('display', 'none')

    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../SearchSchedule/GetBookingReport",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: 
                    function GetReportData() {
                        Airline = $('#Airline').val();
                        AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val(),
                        OfficeName = $('#Office').val() == "" ? "0" : $('#Office').val(),
                        Product = $('#Product').val() == "" ? "0" : $('#Product').val(),
                        Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
                        if ($("#Text_Origin_input").val() != "") {
                            Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
                        } else { Origin = 0; }
                        Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
                        Fromdate = $('#Fromdate').val();
                        Todate = $('#Todate').val();
                        BookingFlightNo = $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val();
                        CheckedStatus = $('input[name=Filter]:checked').val();
                        ShipmentType=$('input[name=Domestic]:checked').val();
                        IsAutoProcess = 1;
                        return {
                            careerCode: Airline, OfficeName: OfficeName, Agentsno: AgentName, productSno: Product, CommoditySno: Commodity, OriginCitySno: Origin, DestinationCitySno: Destination, fromdate: Fromdate, todate: Todate, CheckedStatus: CheckedStatus, BookingFlightNo: BookingFlightNo, IsAutoProcess: IsAutoProcess, ShipmentType: ShipmentType};
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
                        SNo: { type: "number" },
                        AWBNo: { type: "string" },
                        BookingType: { type: "string" },
                        AWBDATE: { type: "string" },
                        FlightDate: { type: "string" },
                        OfficeName: { type: "string" },
                        AccountName: { type: "string" },
                        ORIGIN: { type: "string" },
                        DESTINATION: { type: "string" },
                        COMMODITYCODE: { type: "string" },
                        SHC: { type: "string" },
                        ProductName: { type: "string" },
                        FlightNo: { type: "string" },
                        Pieces: { type: "string" },
                        Vol: { type: "string" },
                        VolWt: { type: "string" },
                        GrWt: { type: "string" },
                        ChWt: { type: "string" },
                        Rate: { type: "string" },
                        Yield: { type: "string" },
                        Amount: { type: "string" },
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
        columns: [

            { field: "AWBNo", title: "AWB No", filterable: true, width: 70 },
            { field: "BookingType", title: "Book Type", width: 70 },
            { field: "AWBDATE", title: "AWB DATE", width: 70 },
            { field: "FlightDate", title: "Flight Date", width: 70 },
            { field: "ORIGIN", title: "Origin", width: 40 },
            { field: "DESTINATION", title: "Dest", width: 40 },
            { field: "OfficeName", title: "Office Name", width: 80 },
            { field: "AccountName", title: "Account Name", width: 90 },
            { field: "COMMODITYCODE", title: "Commodity", width: 120 },
            { field: "SHC", title: "SHC", width: 120 },
            { field: "ProductName", title: "Product Name", width: 70 },
            { field: "FlightNo", title: "Flight No", width: 70 },
            { field: "Pieces", title: "Pieces", width: 70 },
            { field: "Vol", title: "Vol.", width: 70 },
            { field: "VolWt", title: "Vol Wt", width: 70 },
            { field: "GrWt", title: "Gr.Wt", width: 70 },
            { field: "ChWt", title: "Ch.Wt", width: 70 },
            { field: "Rate", title: "Rate", width: 70 },
            { field: "Yield", title: "Yield", width: 70 },
            { field: "Amount", title: "Amount", width: 70 },
            { field: "TotalOtherCharges", title: "Total Other Charges", width: 90 }
        ]
    });

            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
            $('#exportflight').show();
            $('#grid table thead tr th a').css('cursor', 'none')
        }
    }
});

function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");

    if (textId == "Text_Airline")
    {
        cfi.setFilter(filterAirline, "IsInterline", "eq", 0);
      cfi.setFilter(filterAirline, "IsActive", "eq", "1");
        // cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_Destination")
    {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Origin").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_Origin")
    {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Destination").val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId == "Text_BookingFlightNo")
    {
        if ($('#Origin').val() != '')
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Origin").val());
        if ($('#Destination').val() != '')
            cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#Destination").val());
        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_Airline").data("kendoComboBox").key());
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
    }
    else if (textId.indexOf("Text_Product") >= 0)
    {
        //var BookingType = $('input:radio[name=BookingType]:checked').val();
        //if (BookingType == 1) {
        //}
        if (ProductAsPerAgent != "" && ProductAsPerAgent != "0")
        {
            var filterProduct = cfi.getFilter("AND");
            cfi.setFilter(filterProduct, "SNo", "in", ProductAsPerAgent);
            ProductFilter = cfi.autoCompleteFilter(filterProduct);
            return ProductFilter;
        }
    }
    else if (textId == "Text_Office")
    {
        if ($("#Text_Origin").val() != '')
        {
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_Origin").data("kendoComboBox").key());
        var OfficeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OfficeAutoCompleteFilter2;
        }
    }
    else if (textId == "Text_AgentName")
    {
        if ($("#Text_Office").val() != '')
        {
        cfi.setFilter(filterAirline, "Office", "eq", $("#Text_Office").data("kendoComboBox").key());
        var AgentAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return AgentAutoCompleteFilter2
        }
    }
}
function ExportToExcel_Flight() {

    Airline = $('#Airline').val();
    AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()
    OfficeName = $('#Office').val() == "" ? "0" : $('#Office').val(),
    Product = $('#Product').val() == "" ? "0" : $('#Product').val();
    Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    if ($("#Text_Origin_input").val() != "") {
        Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    } else { Origin = 0; }
    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    Fromdate = $('#Fromdate').val();
    Todate = $('#Todate').val();
    BookingFlightNo = $('#BookingFlightNo').val() == "" ? "0" : $('#BookingFlightNo').val();
    CheckedStatus = $('input[name=Filter]:checked').val();
    ShipmentType=$('input[name=Domestic]:checked').val();
    if (Airline != "" && Fromdate != "" & Todate != "")
    {
        window.location.href = "../SearchSchedule/GetBookingReportRecordInExcel?careerCode=" + Airline + "&Agentsno=" + AgentName + "&productSno=" + Product + "&CommoditySno=" + Commodity + "&OriginCitySno=" + Origin + "&DestinationCitySno=" + Destination + "&fromdate=" + Fromdate + "&todate=" + Todate + "&BookingFlightNo=" + BookingFlightNo + "&CheckedStatus=" + CheckedStatus + "&OfficeName=" + OfficeName + "&IsAutoProcess=1"+"&ShipmentType=" + ShipmentType;
    }
}
$("#Text_Origin").change(function ()
{
    $("#Text_AgentName_input").val('');
    $("#Text_Destination_input").val('');
    $("#Text_Office_input").val('');
});
$("#Text_Office").change(function ()
{
    $("#Text_AgentName_input").val('');
});
function ExtraParameters(id)
{
    var param = [];
    if (id == "Text_Airline")
    {
        var UserSNo = userContext.UserSNo
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}