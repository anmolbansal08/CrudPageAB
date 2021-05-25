/// <reference path="../../Scripts/references.js" />
$(document).ready(function () {

   
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "EmbargoReport_AirlineCode", null, "contains");
    cfi.AutoCompleteV2("SHC", "Code", "EmbargoReport_Code", null, "contains");
    cfi.AutoCompleteV2("BookingFlightNo", "FlightNo", "EmbargoReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "EmbargoReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Destination", "CITYCODE", "Warehouse_CityCode",  null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "EmbargoReport_ProductName",  null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "EmbargoReport_Commodity", null, "contains");
    cfi.AutoCompleteV2("AWBNumber", "AWBNo", "EmbargoReport_AWBNo",  null, "contains");
    cfi.AutoCompleteV2("ReferenceNumber", "ReferenceNumber", "EmbargoReport_ReferenceNumber", null, "contains");


    //$("#Origin").val(userContext.CitySNo);
    //$("#Text_Origin_input").val(userContext.CityCode + '-' + userContext.CityName);

    if (userContext.GroupName.toUpperCase() == "SUPER ADMIN") {

    }
    else {
        //cfi.EnableAutoComplete('Origin', false, false, null);//diasble
    }

    $("#Airline").val(userContext.AirlineName.substring(0, 3));
    $("#Text_Airline_input").val(userContext.AirlineCarrierCode);

    //cfi.DateType("FtFromdate");
    //cfi.DateType("FtTodate");
    cfi.DateType("Fromdate");
    cfi.DateType("Todate");

    //$('#FtFromdate').attr('readonly', true);
    //$('#FtTodate').attr('readonly', true);
    $('#Fromdate').attr('readonly', true);
    $('#Todate').attr('readonly', true);

    var todaydate = new Date();
    //var validFtTodate = $("#FtFromdate").data("kendoDatePicker");
    //validFtTodate.min(todaydate);
    var validBkTodate = $("#Todate").data("kendoDatePicker");
    validBkTodate.min(todaydate);

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
    });



    cfi.EnableAutoComplete('ReferenceNumber', false, false, null);
    cfi.EnableAutoComplete('AWBNumber', false, false, null);

    $('input[type="radio"][name="FilterReference"]').click(function () {
        if (this.value == "A") {
            $('#lblAwbRef').text('AWBNo.')
            cfi.EnableAutoComplete('ReferenceNumber', false, false, null);
            cfi.EnableAutoComplete('AWBNumber', true, true, null);
            $("#Text_ReferenceNumber_input").val('');
            $("#ReferenceNumber").val('');
        }
        else {
            $('#lblAwbRef').text('ReferenceNo.')
            cfi.EnableAutoComplete('AWBNumber', false, false, null);
            cfi.EnableAutoComplete('ReferenceNumber', true, true, null);
            $("#Text_AWBNumber_input").val('');
            $("#AWBNumber").val('');
        }
       
    });

    //var ARNo = $('input[type="radio"][name=FilterReference]:checked').val();
   
    //if (ARNo == 'A') {
    //    cfi.EnableAutoComplete('ReferenceNumber', false, false, null);
    //    cfi.EnableAutoComplete('AWBNumber', true, true, null);
    //}
    //if (ARNo == 'R') {
    //    cfi.EnableAutoComplete('AWBNumber', false, false, null);
    //    cfi.EnableAutoComplete('ReferenceNumber', true, true, null);
    //}


    $('#exportflight').hide();
    $('#grid').css('display', 'none')

    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../EmbargoReport/GetSoftEmbargoReport",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
                        Airline = $('#Airline').val();
                        SHC = $('#SHC').val() == "" ? "0" : $('#SHC').val();
                        Product = $('#Product').val() == "" ? "0" : $('#Product').val();
                        Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
                        Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
                        Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
                        Fromdate = $('#Fromdate').val();
                        Todate = $('#Todate').val();
                        //FlightFromdate = $('#FtFromdate').val() == "" ? "0" : $('#FtFromdate').val();;
                        //FlightTodate = $('#FtTodate').val() == "" ? "0" : $('#FtTodate').val();;

                        AWBNumber = $('#AWBNumber').val() == "" ? "" : $('#AWBNumber').val();
                        ReferenceNumber = $('#ReferenceNumber').val() == "" ? "" : $('#ReferenceNumber').val();
                        DateType = $('input[type="radio"][name=FilterDate]:checked').val();
                        return { careerCode: Airline, SHCSNo: SHC, productSno: Product, CommoditySno: Commodity, OriginCitySno: Origin, DestinationCitySno: Destination, fromdate: Fromdate, todate: Todate, AWBNumber: AWBNumber, ReferenceNumber: ReferenceNumber, DateType: DateType };
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
                        ReferenceNumber: { type: "string" },
                        AWBNo: { type: "string" },
                        //BookingType: { type: "string" },
                        //AWBDATE: { type: "string" },
                        BookingDate: { type: "string" },
                        FlightDate: { type: "string" },
                        
                        SHC: { type: "string" },
                        AccountName: { type: "string" },
                        ParticipantID: { type: "string" },
                        ORIGIN: { type: "string" },
                        DESTINATION: { type: "string" },
                        COMMODITYCODE: { type: "string" },
                        ProductName: { type: "string" },
                        NatureOfGoods: { type: "string" },
                        FlightNo: { type: "string" },
                        BookedPieces: { type: "string" },
                        ExecutedPieces: { type: "string" },
                        SoftEmbargo: { type: "string" },
                        BookingStatus: { type: "string" },
                        //Pieces: { type: "string" },
                        //GrWt: { type: "string" },
                        //ChWt: { type: "string" },
                        //Rate: { type: "string" },
                        //Yield: { type: "string" },
                        //Amount: { type: "string" },
                        //TotalOtherCharges: { type: "string" }
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
            { field: "ReferenceNumber", title: "Reference No", filterable: true, width: 90 },
            { field: "AWBNo", title: "AWB No", filterable: true, width: 70 },
            //{ field: "BookingType", title: "Book Type", width: 40 },
            //{ field: "AWBDATE", title: "AWB DATE", width: 70 },
            { field: "BookingDate", title: "Booking Date", width: 70 },
            { field: "FlightDate", title: "Flight Date", width: 70 },
           
            { field: "SHC", title: "SHC", width: 70 },
            { field: "AccountName", title: "Agent Name", width: 70 },
            { field: "ParticipantID", title: "ParticipantID", width: 90 },
            { field: "ORIGIN", title: "Origin", width: 40 },
            { field: "DESTINATION", title: "Dest", width: 40 },
            { field: "COMMODITYCODE", title: "Commodity", width: 70 },
            { field: "ProductName", title: "Product Name", width: 70 },
            { field: "NatureOfGoods", title: "NOG", width: 70 },
            { field: "FlightNo", title: "Flight No", width: 70 },
            { field: "BookedPieces", title: "Booked pcs./wt.", width: 90 },
            { field: "ExecutedPieces", title: "Executed pcs./wt.", width: 90 },
            { field: "SoftEmbargo", title: "Soft Embargo", width: 90 },
            { field: "BookingStatus", title: "Booking Status", width: 50 }
            //{ field: "Amount", title: "Amount", width: 40 },
            //   { field: "TotalOtherCharges", title: "Total Other Charges", width: 90 }

        ]
    });

});

var Airline = "";
var AgentName = "";
var Product = "";
var Commodity = "";
var Origin = "";
var Destination = "";
var Fromdate = "";
var CheckedStatus = "";


$('#btnSubmit').click(function () {
    if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        alert('Booking From Date can not be greater than Booking To Date');
        return false;;
    }


    if (!cfi.IsValidSubmitSection()) {
        return false;
    }


    Airline = $('#Airline').val();
    SHC = $('#SHC').val() == "" ? "0" : $('#SHC').val()
    Product = $('#Product').val() == "" ? "0" : $('#Product').val();
    Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    Fromdate = $('#Fromdate').val();
    Todate = $('#Todate').val();
    //FlightFromdate = $('#FtFromdate').val() == "" ? "0" : $('#FtFromdate').val();
    //FlightTodate = $('#FtTodate').val() == "" ? "0" : $('#FtTodate').val();
    
        AWBNumber = $('#AWBNumber').val() == "" ? "" : $('#AWBNumber').val();
       ReferenceNumber = $('#ReferenceNumber').val() == "" ? "" : $('#ReferenceNumber').val();
   
    DateType = $('input[type="radio"][name=FilterDate]:checked').val();
    if (Airline != "" && Fromdate != "" && Todate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
        $('#grid table thead tr th a').css('cursor', 'none')
    }
});

function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_Airline") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
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
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Destination").val()), cfi.autoCompleteFilter(textId);
    }

}
function ExportToExcel_Flight() {

    Airline = $('#Airline').val();
    SHC = $('#SHC').val() == "" ? "0" : $('#SHC').val()
    Product = $('#Product').val() == "" ? "0" : $('#Product').val();
    Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    Fromdate = $('#Fromdate').val();
    Todate = $('#Todate').val();
    //FlightFromdate = $('#FtFromdate').val() == "" ? "0" : $('#FtFromdate').val();;
    //FlightTodate = $('#FtTodate').val() == "" ? "0" : $('#FtTodate').val();;
    AWBNumber = $('#AWBNumber').val() == "" ? "" : $('#AWBNumber').val();
    ReferenceNumber = $('#ReferenceNumber').val() == "" ? "" : $('#ReferenceNumber').val();
    DateType = $('input[type="radio"][name=FilterDate]:checked').val();
    if (Airline != "" && Fromdate != "" & Todate != "") {
        window.location.href = "../EmbargoReport/GetSoftEmbargoReportForExcel?careerCode=" + Airline + "&SHCsno=" + SHC + "&productSno=" + Product + "&CommoditySno=" + Commodity + "&OriginCitySno=" + Origin + "&DestinationCitySno=" + Destination + "&fromdate=" + Fromdate + "&todate=" + Todate + "&AWBNumber=" + AWBNumber + "&ReferenceNumber=" + ReferenceNumber + "&DateType=" + DateType;
    }


    //var today = new Date();
    //var dd = today.getDate();
    //var mm = today.getMonth() + 1;

    //var yyyy = today.getFullYear();
    //if (dd < 10) {
    //    dd = '0' + dd;
    //}
    //if (mm < 10) {
    //    mm = '0' + mm;
    //}
    //var today = dd + '_' + mm + '_' + yyyy;


    //var a = document.createElement('a');
    //var data_type = 'data:application/vnd.ms-excel';

    //var table_div = '<html><body><table width="100%" cellspacing=0 border="1px">' + $('#tbl_bookingprofile').html() + '</table></body></html>';
    //var table_html = table_div.replace(/ /g, '%20');
    //a.href = data_type + ', ' + table_html;
    //a.download = 'BookingProfile' + today + '_.xls';
    //a.click();

    //return false

}