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
                    url: "../FABReport/GetFABReport",
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
                        //StationName,TotalAcceptedNoOfShipts,TotalAcceptedPCS,TotalAcceptedGWt,TotalAcceptedChwt,TotalAcceptedVolwt,
                        //UpliftedNoOfShipts,UpliftedPCS,UpliftedGWt,UpliftedChwt,UpliftedVolwt,TotalFlownasbookedNoOfShipts,TotalFlownasbookedChwt,
                        //TotalFlownasbookedFABPercentage,OffloadNoOfShipts,OffloadChwt,OffloadOLPercentageNoOfShipts,OffloadOLPercentageBasedOnChwt
                        SNo: { type: "number" },
                        StationName: { type: "string" },
                        TotalAcceptedNoOfShipts: { type: "string" },
                        TotalAcceptedPCS: { type: "string" },
                        TotalAcceptedGWt: { type: "string" },
                        TotalAcceptedChwt: { type: "string" },
                        TotalAcceptedVolwt: { type: "string" },
                        UpliftedNoOfShipts: { type: "string" },
                        UpliftedPCS: { type: "string" },
                        UpliftedGWt: { type: "string" },
                        UpliftedChwt: { type: "string" },
                        UpliftedVolwt: { type: "string" },
                        TotalFlownasbookedNoOfShipts: { type: "string" },
                        TotalFlownasbookedChwt: { type: "string" },
                        TotalFlownasbookedFABPercentage: { type: "string" },
                        OffloadNoOfShipts: { type: "string" },
                        OffloadChwt: { type: "string" },
                        OffloadOLPercentageNoOfShipts: { type: "string" },
                        OffloadOLPercentageBasedOnChwt: { type: "string" }
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
             //StationName,TotalAcceptedNoOfShipts,TotalAcceptedPCS,TotalAcceptedGWt,TotalAcceptedChwt,TotalAcceptedVolwt,
                        //UpliftedNoOfShipts,UpliftedPCS,UpliftedGWt,UpliftedChwt,UpliftedVolwt,TotalFlownasbookedNoOfShipts,TotalFlownasbookedChwt,
                        //TotalFlownasbookedFABPercentage,OffloadNoOfShipts,OffloadChwt,OffloadOLPercentageNoOfShipts,OffloadOLPercentageBasedOnChwt

            { field: "StationName", title: "Station Name",  width: 110 },
            {
                headerTemplate: "<div style='text-align: center;color: Green;font-weight: bold'>Total Accepted</div>",
                columns: [
                   { field: "TotalAcceptedNoOfShipts", headerTemplate: "<span style='color: Green;font-weight: bold'>No Of Shpts</span>", width: 90 },
                    { field: "TotalAcceptedPCS", headerTemplate: "<span style='color: Green;font-weight: bold'>PCS</span>", width: 70 },
                   { field: "TotalAcceptedGWt", headerTemplate: "<span style='color: Green;font-weight: bold'>G.Wt</span>", width: 70 },
                    { field: "TotalAcceptedChwt", headerTemplate: "<span style='color: Green;font-weight: bold'>Ch.wt</span>", width: 70 },
                   { field: "TotalAcceptedVolwt", headerTemplate: "<span style='color: Green;font-weight: bold'>Vol wt.</span>", width: 70 }
                ]
            },
             {
                 headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Uplifted</div>",
                 columns: [
                    { field: "UpliftedNoOfShipts", headerTemplate: "<span style='color: blue;font-weight: bold'>No Of Shpts</span>", width: 90 },
                     { field: "UpliftedPCS", headerTemplate: "<span style='color: blue;font-weight: bold'>PCS</span>", width: 70 },
                    { field: "UpliftedGWt", headerTemplate: "<span style='color: blue;font-weight: bold'>G.Wt</span>", width: 70 },
                     { field: "UpliftedChwt", headerTemplate: "<span style='color: blue;font-weight: bold'>Ch.wt</span>", width: 70 },
                    { field: "UpliftedVolwt", headerTemplate: "<span style='color: blue;font-weight: bold'>Vol wt.</span>", width: 70 }
                 ]
             },
             {
                 headerTemplate: "<div style='text-align: center;color: black;font-weight: bold'>Total Flown as booked</div>",
                 columns: [
                    { field: "TotalFlownasbookedNoOfShipts", headerTemplate: "<span style='color: black;font-weight: bold'>No Of Shpts</span>", width: 90 },
                     { field: "TotalFlownasbookedChwt", headerTemplate: "<span style='color: black;font-weight: bold'>Ch.wt</span>", width: 70 },
                    { field: "TotalFlownasbookedFABPercentage", headerTemplate: "<span style='color: black;font-weight: bold'>FAB %</span>", width: 70 }
                 ]
             },
           {
               headerTemplate: "<div style='text-align: center;color: darkred;font-weight: bold'>Offload</div>",
               columns: [
                  { field: "OffloadNoOfShipts", headerTemplate: "<span style='color: darkred;font-weight: bold'>No Of Shpts</span>", width: 90 },
                   { field: "OffloadChwt", headerTemplate: "<span style='color: darkred;font-weight: bold'>Ch.wt</span>", width: 70 },
                  { field: "OffloadOLPercentageNoOfShipts", headerTemplate: "<span style='color: darkred;font-weight: bold'>Total O/L %  (no of shpts)</span>", width: 180 },
                   { field: "OffloadOLPercentageBasedOnChwt", headerTemplate: "<span style='color: darkred;font-weight: bold'>% OL based on Ch weight</span>", width: 160 }
               ]
           },

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
        window.location.href = "../FABReport/GetFABReportForExcel?careerCode=" + Airline + "&Agentsno=" + AgentName + "&productSno=" + Product + "&CommoditySno=" + Commodity + "&OriginCitySno=" + Origin + "&DestinationCitySno=" + Destination + "&fromdate=" + Fromdate + "&todate=" + Todate;

    }
}
