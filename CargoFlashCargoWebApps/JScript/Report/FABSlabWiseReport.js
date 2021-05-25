$(document).ready(function () {



    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "BookingVarianceReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentName", "AccountCode,Name", "BookingVarianceReport_AccountCode", null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Destination", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "BookingVarianceReport_Product", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "BookingVarianceReport_Commodity", null, "contains");



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

    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../FABSlabWiseReport/GetFABSlabWiseReport",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
                        Airline = $('#Airline').val();
                        AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()
                        Product = $('#Product').val() == "" ? "0" : $('#Product').val();
                        Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
                        Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
                        Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
                        Fromdate = $('#Fromdate').val();
                        Todate = $('#Todate').val();
                        return { careerCode: Airline, Agentsno: AgentName, productSno: Product, CommoditySno: Commodity, OriginCitySno: Origin, DestinationCitySno: Destination, fromdate: Fromdate, todate: Todate };
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
                        //POSSlabs,TotalAcceptedNoofAWB,TotalAcceptedPcs,TotalAcceptedGr,TotalAcceptedVol,TotalAcceptedCh,
                        //DepartedNoofAWB,DepartedPcs,DepartedGr,DepartedVol,DepartedCh,TotalFABAWB,TotalFABCh,OffloadedAWB,OffloadedChWt,
                        //NoofshptsoffloadedPercentage,TotalOffloadedPercentageslabwise
                        //SNo: { type: "number" },
                        POSSlabs: { type: "string" },
                        TotalAcceptedNoofAWB: { type: "string" },
                        TotalAcceptedPcs: { type: "string" },
                        TotalAcceptedGr: { type: "string" },
                        TotalAcceptedVol: { type: "string" },
                        TotalAcceptedCh: { type: "string" },
                        DepartedNoofAWB: { type: "string" },
                        DepartedPcs: { type: "string" },
                        DepartedGr: { type: "string" },
                        DepartedVol: { type: "string" },
                        DepartedCh: { type: "string" },
                        TotalFABAWB: { type: "string" },
                        TotalFABCh: { type: "string" },
                        OffloadedAWB: { type: "string" },
                        OffloadedChWt: { type: "string" },
                        NoofshptsoffloadedPercentage: { type: "string" },
                        TotalOffloadedPercentageslabwise: { type: "string" }
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
           //POSSlabs,TotalAcceptedNoofAWB,TotalAcceptedPcs,TotalAcceptedGr,TotalAcceptedVol,TotalAcceptedCh,
                        //DepartedNoofAWB,DepartedPcs,DepartedGr,DepartedVol,DepartedCh,TotalFABAWB,TotalFABCh,OffloadedAWB,OffloadedChWt,
                        //NoofshptsoffloadedPercentage,TotalOffloadedPercentageslabwise

            { field: "POSSlabs", title: "POS Slabs", width: 110 },
            {
                headerTemplate: "<div style='text-align: center;color: Green;font-weight: bold'>Total Accepted</div>",
                columns: [
                   { field: "TotalAcceptedNoofAWB", headerTemplate: "<span style='color: Green;font-weight: bold'>No of AWB</span>", width: 90 },
                    { field: "TotalAcceptedPcs", headerTemplate: "<span style='color: Green;font-weight: bold'>Pcs</span>", width: 70 },
                   { field: "TotalAcceptedGr", headerTemplate: "<span style='color: Green;font-weight: bold'>Gr.</span>", width: 70 },
                    { field: "TotalAcceptedVol", headerTemplate: "<span style='color: Green;font-weight: bold'>Vol.</span>", width: 70 },
                   { field: "TotalAcceptedCh", headerTemplate: "<span style='color: Green;font-weight: bold'>Ch.</span>", width: 70 }
                ]
            },
             {
                 headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Departed</div>",
                 columns: [
                    { field: "DepartedNoofAWB", headerTemplate: "<span style='color: blue;font-weight: bold'>No of AWB</span>", width: 90 },
                     { field: "DepartedPcs", headerTemplate: "<span style='color: blue;font-weight: bold'>Pcs</span>", width: 70 },
                    { field: "DepartedGr", headerTemplate: "<span style='color: blue;font-weight: bold'>Gr.</span>", width: 70 },
                     { field: "DepartedVol", headerTemplate: "<span style='color: blue;font-weight: bold'>Vol.</span>", width: 70 },
                    { field: "DepartedCh", headerTemplate: "<span style='color: blue;font-weight: bold'>Ch.</span>", width: 70 }
                 ]
             },
             {
                 headerTemplate: "<div style='text-align: center;color: black;font-weight: bold'>Total FAB</div>",
                 columns: [
                    { field: "TotalFABAWB", headerTemplate: "<span style='color: black;font-weight: bold'>AWB</span>", width: 90 },
                     { field: "TotalFABCh", headerTemplate: "<span style='color: black;font-weight: bold'>Ch.</span>", width: 70 }
                 ]
             },
           {
               headerTemplate: "<div style='text-align: center;color: darkred;font-weight: bold'>Offloaded</div>",
               columns: [
                  { field: "OffloadedAWB", headerTemplate: "<span style='color: darkred;font-weight: bold'>AWB</span>", width: 90 },
                   { field: "OffloadedChWt", headerTemplate: "<span style='color: darkred;font-weight: bold'>Ch.</span>", width: 70 }
               ]
           },
               { field: "NoofshptsoffloadedPercentage", title: "No of shpts offloaded %", width: 160 },
                   { field: "TotalOffloadedPercentageslabwise", title: "Total Offloaded % slabwise", width: 180 }

        ]
    });
    $("#Text_AgentName").change(function () {

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

var Airline = "";
var AgentName = "";
var Product = "";
var Commodity = "";
var Origin = "";
var Destination = "";
var Fromdate = "";
var Todate = "";
$('#btnSubmit').click(function () {
    if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        //alert('From Date can not be greater than To Date');
        ShowMessage('warning', 'warning - Booking VS Accepted Report', "From Date can not be greater than To Date !");
        return false;;
    }


    if (!cfi.IsValidSubmitSection()) {
        return false;
    }


    Airline = $('#Airline').val();
    AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()
    Product = $('#Product').val() == "" ? "0" : $('#Product').val();
    Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    Fromdate = $('#Fromdate').val();
    Todate = $('#Todate').val();
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
    else if (textId.indexOf("Text_Product") >= 0) {
        //var BookingType = $('input:radio[name=BookingType]:checked').val();
        //if (BookingType == 1) {

        //}
        if (ProductAsPerAgent != "" && ProductAsPerAgent != "0") {
            var filterProduct = cfi.getFilter("AND");
            cfi.setFilter(filterProduct, "SNo", "in", ProductAsPerAgent);
            ProductFilter = cfi.autoCompleteFilter(filterProduct);
            return ProductFilter;
        }
    }
}
function ExportToExcel_Flight() {

    Airline = $('#Airline').val();
    AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()
    Product = $('#Product').val() == "" ? "0" : $('#Product').val();
    Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    Fromdate = $('#Fromdate').val();
    Todate = $('#Todate').val();
    if (Airline != "" && Fromdate != "" && Todate != "") {
        window.location.href = "../FABSlabWiseReport/GetFABSlabWiseReportForExcel?careerCode=" + Airline + "&Agentsno=" + AgentName + "&productSno=" + Product + "&CommoditySno=" + Commodity + "&OriginCitySno=" + Origin + "&DestinationCitySno=" + Destination + "&fromdate=" + Fromdate + "&todate=" + Todate;

    }
}
