var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "BookingVarianceReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentName", "AccountCode,Name", "BookingVarianceReport_AccountCode", null, "contains");
    cfi.AutoCompleteV2("BookingFlightNo", "FlightNo", "BookingVarianceReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Destination", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "BookingVarianceReport_Product", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "BookingVarianceReport_Commodity", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "BookingVarianceReport_AWB", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");



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
    //                url: "../BookingVarianceReport/GetBookingReport",
    //                dataType: "json",
    //                global: false,
    //                type: 'POST',
    //                contentType: "application/json; charset=utf-8",
    //                data: function GetReportData() {
    //                    Airline = $('#Airline').val();
    //                    AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val()
    //                    Product = $('#Product').val() == "" ? "0" : $('#Product').val();
    //                    Commodity = $('#Commodity').val() == "" ? "0" : $('#Commodity').val();
    //                    Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    //                    Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    //                    Fromdate = $('#Fromdate').val();
    //                    Todate = $('#Todate').val();
    //                    DateType = $('input[type="radio"][name=Filter]:checked').val();
    //                    AWBSNo = $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val();
    //                    FlightNo = $('#FlightNo').val();
    //                    IsAutoProcess = 1;
    //                    return { careerCode: Airline, Agentsno: AgentName, productSno: Product, CommoditySno: Commodity, OriginCitySno: Origin, DestinationCitySno: Destination, fromdate: Fromdate, todate: Todate, DateType: DateType, AWBSNo: AWBSNo, FlightNo: FlightNo, IsAutoProcess: IsAutoProcess };
    //                }

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
    //                    FlightNo: { type: "string" },
    //                    FlightDate: { type: "string" },
    //                    BookingDate: { type: "string" },
    //                    AccountName: { type: "string" },
    //                    ORIGIN: { type: "string" },
    //                    DESTINATION: { type: "string" },
    //                    CommodityCode: { type: "string" },
    //                    ProductName: { type: "string" },
    //                    //Pieces: { type: "string" },
    //                    //TotalChargeableWeight: { type: "string" },
    //                    BookingPieces: { type: "string" },
    //                    ExecutedPieces: { type: "string" },
    //                    AcceptedPieces: { type: "string" },


    //                    BookingStatus: { type: "string" },
    //                    //BookingGrossWeight: { type: "string" },
    //                    //AcceptedGrossWeight: { type: "string" },
    //                    //ExecutedGrossWeight: { type: "string" },
    //                    BookingVolume: { type: "string" },
    //                    AcceptedVolume: { type: "string" },
    //                    ExecutedVolume: { type: "string" }
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

    //        { field: "AWBNo", title: "AWB No", filterable: true, width: 110 },
    //        { field: "BookingType", title: "Book Type", width: 90 },
    //        { field: "FlightNo", title: "Flight No", width: 90 },
    //        { field: "FlightDate", title: "Flight Date", width: 90 },
    //        { field: "BookingDate", title: "Booking Date", width: 90 },
    //        { field: "AccountName", title: "Account Name", width: 110 },
    //        { field: "ORIGIN", title: "Origin", width: 90 },
    //       { field: "DESTINATION", title: "Dest", width: 90 },
    //       { field: "CommodityCode", title: "Commodity Code", width: 100 },
    //        { field: "ProductName", title: "Product Name", width: 90 },


    //        //{ field: "Pieces", title: "B/E/A Pieces", width: 90 },
    //        { field: "BookingPieces", title: "Booked Pcs/Gr.Wt", width: 110 },
    //       { field: "ExecutedPieces", title: "Executed Pcs/Gr.Wt", width: 110 },
    //         { field: "AcceptedPieces", title: "Accepted Pcs/Gr.Wt", width: 110 },
    //        //{ field: "TotalChargeableWeight", title: "Chrgl.Wt", width: 70 },
    //       // { field: "BookingGrossWeight", title: "Booked Gr.Wt", width: 90 },
    //       //{ field: "ExecutedGrossWeight", title: "Executed Gr.Wt", width: 90 },
    //       //  { field: "AcceptedGrossWeight", title: "Accepted Gr.Wt", width: 90 },
    //        { field: "BookingVolume", title: "Booked Vol.Wt", width: 110 },
    //        { field: "ExecutedVolume", title: "Executed Vol.Wt", width: 110 },
    //        { field: "AcceptedVolume", title: "Accepted Vol.Wt", width: 110 },
    //           { field: "BookingStatus", title: "Status", width: 110 },
    //    ]
    //});
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

//var Airline = "";
//var AgentName = "";
//var Product = "";
//var Commodity = "";
//var Origin = "";
//var Destination = "";
//var Fromdate = "";
//var Todate = "";
//var DateType = "";
//var AWBSNo = "";
//var FlightNo = "";
var Model = [];

$('#btnSubmit').click(function () {

    Model = {
        careerCode: $('#Airline').val() == "" ? "0" : $('#Airline').val(),
        Agentsno: $('#AgentName').val() == "" ? "0" : $('#AgentName').val(),
        productSno: $('#Product').val() == "" ? "0" : $('#Product').val(),
        CommoditySno: $('#Commodity').val() == "" ? "0" : $('#Commodity').val(),
        OriginCitySno: $('#Origin').val() == "" ? "0" : $('#Origin').val(),
        DestinationCitySno: $('#Destination').val() == "" ? "0" : $('#Destination').val(),
        Fromdate: $('#Fromdate').val(),
        Todate: $('#Todate').val(),
        DateType: $('input[type="radio"][name=Filter]:checked').val(),
        AWBSNo: $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1),
        FlightNo: $('#FlightNo').val(),
        pagesize: 100000
    };

    if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        //alert('From Date can not be greater than To Date');
        ShowMessage('warning', 'warning - Booking VS Accepted Report', "From Date can not be greater than To Date !");
        return false;;
    }


    if (!cfi.IsValidSubmitSection()) {
        return false;
    }


    if (Model.Airline != "" && Model.Fromdate != "" && Model.Todate != "") {

        if (OnBlob) {
            $.ajax({
                url: "../Reports/BookingVSAcceptedReport",
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
                    dataBinding: function (e) {
                        alert("dataBinding");
                    },
                    transport: {
                        read: {
                            url: "../BookingVarianceReport/GetBookingReport",
                            dataType: "json",
                            global: false,
                          //  async: false,

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
                                DateType = $('input[type="radio"][name=Filter]:checked').val();
                                AWBSNo = $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val();
                                FlightNo = $('#FlightNo').val();
                                IsAutoProcess = 1;
                                return { careerCode: Airline, Agentsno: AgentName, productSno: Product, CommoditySno: Commodity, OriginCitySno: Origin, DestinationCitySno: Destination, fromdate: Fromdate, todate: Todate, DateType: DateType, AWBSNo: AWBSNo, FlightNo: FlightNo, IsAutoProcess: IsAutoProcess };
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
                            id: "SNo",
                            fields: {
                                SNo: { type: "number" },
                                AWBNo: { type: "string" },
                                BookingType: { type: "string" },
                                FlightNo: { type: "string" },
                                FlightDate: { type: "string" },
                                BookingDate: { type: "string" },
                                AccountName: { type: "string" },
                                ORIGIN: { type: "string" },
                                DESTINATION: { type: "string" },
                                CommodityCode: { type: "string" },
                                ProductName: { type: "string" },
                                //Pieces: { type: "string" },
                                //TotalChargeableWeight: { type: "string" },
                                BookingPieces: { type: "string" },
                                ExecutedPieces: { type: "string" },
                                AcceptedPieces: { type: "string" },


                                BookingStatus: { type: "string" },
                                //BookingGrossWeight: { type: "string" },
                                //AcceptedGrossWeight: { type: "string" },
                                //ExecutedGrossWeight: { type: "string" },
                                BookingVolume: { type: "string" },
                                AcceptedVolume: { type: "string" },
                                ExecutedVolume: { type: "string" }
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

                    { field: "AWBNo", title: "AWB No", filterable: true, width: 110 },
                    { field: "BookingType", title: "Book Type", width: 90 },
                    { field: "FlightNo", title: "Flight No", width: 90 },
                    { field: "FlightDate", title: "Flight Date", width: 90 },
                    { field: "BookingDate", title: "Booking Date", width: 90 },
                    { field: "AccountName", title: "Account Name", width: 110 },
                    { field: "ORIGIN", title: "Origin", width: 90 },
                   { field: "DESTINATION", title: "Dest", width: 90 },
                   { field: "CommodityCode", title: "Commodity Code", width: 100 },
                    { field: "ProductName", title: "Product Name", width: 90 },


                    //{ field: "Pieces", title: "B/E/A Pieces", width: 90 },
                    { field: "BookingPieces", title: "Booked Pcs/Gr.Wt", width: 110 },
                   { field: "ExecutedPieces", title: "Executed Pcs/Gr.Wt", width: 110 },
                     { field: "AcceptedPieces", title: "Accepted Pcs/Gr.Wt", width: 110 },
                    //{ field: "TotalChargeableWeight", title: "Chrgl.Wt", width: 70 },
                   // { field: "BookingGrossWeight", title: "Booked Gr.Wt", width: 90 },
                   //{ field: "ExecutedGrossWeight", title: "Executed Gr.Wt", width: 90 },
                   //  { field: "AcceptedGrossWeight", title: "Accepted Gr.Wt", width: 90 },
                    { field: "BookingVolume", title: "Booked Vol.Wt", width: 110 },
                    { field: "ExecutedVolume", title: "Executed Vol.Wt", width: 110 },
                    { field: "AcceptedVolume", title: "Accepted Vol.Wt", width: 110 },
                       { field: "BookingStatus", title: "Status", width: 110 },
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
    else if (textId == "Text_FlightNo") {
        if ($('#Origin').val() != '')
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Origin").val());
        if ($('#Destination').val() != '')
            cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#Destination").val());

        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Airline").val());

        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
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
    DateType = $('input[type="radio"][name=Filter]:checked').val();
    AWBSNo = $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val();
    FlightNo = $('#FlightNo').val();
    IsAutoProcess = 1;
    if (Airline != "" && Fromdate != "" && Todate != "") {
        window.location.href = "../BookingVarianceReport/GetBookingReportForExcel?careerCode=" + Airline + "&Agentsno=" + AgentName + "&productSno=" + Product + "&CommoditySno=" + Commodity + "&OriginCitySno=" + Origin + "&DestinationCitySno=" + Destination + "&fromdate=" + Fromdate + "&todate=" + Todate + "&DateType=" + DateType + "&AWBSNo=" + AWBSNo + "&FlightNo=" + FlightNo + "&IsAutoProcess=" + IsAutoProcess;

    }
}
