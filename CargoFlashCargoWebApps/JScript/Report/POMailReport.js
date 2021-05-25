/// <reference path="../../Scripts/references.js" />
$(document).ready(function () {

    //cfi.AutoComplete("Airline", "CarrierCode,airlinename", "Airline", "CarrierCode", "airlinecode", ["CarrierCode", "airlinename"], null, "contains");

    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "POMailReport_CarrierCode", null, "contains");
    //cfi.AutoComplete("SHC", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains");
    //cfi.AutoComplete("BookingFlightNo", "FlightNo", "DAILY_FlightNo", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "AirMail_ShipmentOrigin_New", null, "contains");
    cfi.AutoCompleteV2("Destination", "CITYCODE", "Warehouse_CityCode", null, "contains");
    //cfi.AutoComplete("Product", "ProductName", "Product", "SNO", "ProductName", ["ProductName"], null, "contains");
    //cfi.AutoComplete("Commodity", "CommodityCode,CommodityDescription", "Commodity", "SNO", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoCompleteV2("CN38No", "CN38No", "POMailReport_CN38No", null, "contains");
    cfi.AutoCompleteV2("CN47No", "CN38No", "POMailReport_CN47No", null, "contains");
    var UMSource = [{ Key: "0", Text: "CN38" }, { Key: "1", Text: "CN47" }];

    cfi.AutoCompleteByDataSource("CNNo", UMSource);

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

    //$("#FtFromdate").change(function () {

    //    $("#FtTodate").data("kendoDatePicker").min($("#FtFromdate").val());
    //    $("#FtTodate").data("kendoDatePicker").value('');
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

    cfi.EnableAutoComplete('CN47No', false, false, null);
    cfi.EnableAutoComplete('CN38No', false, false, null);

    $("#Text_CNNo").change(function () {
    if ($("#Text_CNNo_input").val() == "CN38") {
        $('#lblCNNo').text('CN38No.')
        cfi.EnableAutoComplete('CN47No', false, false, null);
        cfi.EnableAutoComplete('CN38No', true, true, null);
        $("#Text_CN47No_input").val('');
        $("#CN47No").val('');
    }
    else if ($("#Text_CNNo_input").val() == "CN47") {
        $('#lblCNNo').text('CN47No.')
        cfi.EnableAutoComplete('CN38No', false, false, null);
        cfi.EnableAutoComplete('CN47No', true, true, null);
        $("#Text_CN38No_input").val('');
        $("#CN38No").val('');
    }
    else {
        $("#CN38No").val('');
        $("#CN47No").val('');
        cfi.EnableAutoComplete('CN47No', false, false, null);
        cfi.EnableAutoComplete('CN38No', false, false, null);
    }

    });



    //$('input[type="radio"][name="FilterReference"]').click(function () {
    //    if (this.value == "CN38No") {
    //        $('#lblCNNo').text('CN38No.')
    //        cfi.EnableAutoComplete('CN47No', false, false, null);
    //        cfi.EnableAutoComplete('CN38No', true, true, null);
    //        $("#Text_CN47No_input").val('');
    //        $("#CN47No").val('');
    //    }
    //    else {
    //        $('#lblCNNo').text('CN47No.')
    //        cfi.EnableAutoComplete('CN38No', false, false, null);
    //        cfi.EnableAutoComplete('CN47No', true, true, null);
    //        $("#Text_CN38No_input").val('');
    //        $("#CN38No").val('');
    //    }

    //});

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
                    url: "../POMailReport/GetPOMailReport",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
                        Airline = $('#Airline').val();
                        //SHC = $('#SHC').val() == "" ? "0" : $('#SHC').val();
                        //Product = $('#Product').val() == "" ? "0" : $('#Product').val();
                        //Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
                        Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
                        Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
                        Fromdate = $('#Fromdate').val();
                        Todate = $('#Todate').val();
                        //FlightFromdate = $('#FtFromdate').val() == "" ? "0" : $('#FtFromdate').val();;
                        //FlightTodate = $('#FtTodate').val() == "" ? "0" : $('#FtTodate').val();;
                        CNNo = $('#CNNo').val() == "" ? "" : $('#CNNo').val();
                        CN38No = $('#CN38No').val() == "" ? "" : $('#CN38No').val();
                        CN47No = $('#CN47No').val() == "" ? "" : $('#CN47No').val();
                        DateType = $('input[type="radio"][name=FilterDate]:checked').val();
                        return { careerCode: Airline, OriginCitySno: Origin, DestinationCitySno: Destination, fromdate: Fromdate, todate: Todate,CNNo: CNNo, CN38No: CN38No, CN47No: CN47No, DateType: DateType };
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
                        CN38No: { type: "string" },
                        AccountName: { type: "string" },
                        ParticipantID: { type: "string" },
                        ORIGIN: { type: "string" },
                        DESTINATION: { type: "string" },
                        FlightNo: { type: "string" },
                        BookedPieces: { type: "string" },
                        AcceptedPieces: { type: "string" },
                        BookedWeight: { type: "string" },
                        AcceptedWeight: { type: "string" },
                        DNNo: { type: "string" },
                        BookingStatus: { type: "string" },
                        BookingDate: { type: "string" },
                        FlightDate: { type: "string" },
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
            { field: "CN38No", title: "CN38/47 No.", filterable: true, width: 90 },
            { field: "BookingDate", title: "Booking Date", width: 70 },
            { field: "AccountName", title: "Agent Name", width: 70 },
            { field: "ParticipantID", title: "ParticipantID", width: 90 },
            { field: "ORIGIN", title: "Origin", width: 40 },
            { field: "DESTINATION", title: "Dest", width: 40 },
            { field: "FlightNo", title: "Flight No", width: 70 },

            { field: "FlightDate", title: "Flight Date", width: 70 },
            { field: "BookedPieces", title: "Booked pcs", width: 70 },
            { field: "AcceptedPieces", title: "Accepted pcs", width: 70 },
            { field: "BookedWeight", title: "Booked wt./Kg.", width: 90 },
            { field: "AcceptedWeight", title: "Accepted wt./Kg.", width: 90 },
            { field: "DNNo", title: "DN No.", width: 70 },
            { field: "BookingStatus", title: "Booking Status", width: 90 }
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

    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    Fromdate = $('#Fromdate').val();
    Todate = $('#Todate').val();
    //FlightFromdate = $('#FtFromdate').val() == "" ? "0" : $('#FtFromdate').val();
    //FlightTodate = $('#FtTodate').val() == "" ? "0" : $('#FtTodate').val();

    CN37NO = $('#CN37No').val() == "" ? "" : $('#CN37No').val();
    CN47No = $('#CN47No').val() == "" ? "" : $('#CN47No').val();

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

    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    Fromdate = $('#Fromdate').val();
    Todate = $('#Todate').val();
    //FlightFromdate = $('#FtFromdate').val() == "" ? "0" : $('#FtFromdate').val();;
    //FlightTodate = $('#FtTodate').val() == "" ? "0" : $('#FtTodate').val();;
    CN37No = $('#CN37No').val() == "" ? "" : $('#CN37No').val();
    CN47No = $('#CN47No').val() == "" ? "" : $('#CN47No').val();
    DateType = $('input[type="radio"][name=FilterDate]:checked').val();
    if (Airline != "" && Fromdate != "" & Todate != "") {
        window.location.href = "../POMailReport/GetPOMailReportForExcel?careerCode=" + Airline + "&OriginCitySno=" + Origin + "&DestinationCitySno=" + Destination + "&fromdate=" + Fromdate + "&todate=" + Todate + "&CN37No=" + CN37No + "&CN47No=" + CN47No + "&DateType=" + DateType;
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