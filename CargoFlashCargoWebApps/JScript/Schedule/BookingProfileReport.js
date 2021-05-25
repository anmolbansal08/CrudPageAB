var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("AgentName", "AccountCode,Name", "BookingProfileReport_Agent", null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "BookingProfileReport_Airline", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CityCode,CityName", "BookingProfileReport_City", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "BookingProfileReport_City", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "Name", "BookingProfileReport_Office", null, "contains", null, null, null, null, ClearAgent);
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

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


    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "") {
        $("#AirlineSNo").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
    }

    if (userContext.CitySNo != "" && userContext.CityCode != "" && userContext.CityName != "") {
        $("#OriginSNo").val(userContext.CitySNo);
        $("#Text_OriginSNo_input").val(userContext.CityCode + '-' + userContext.CityName);
    }


    $('#exportflight').hide();
    $('#grid').css('display', 'none')
    //var dataSource = $("#grid").kendoGrid({
    //    autoBind: false,
    //    dataSource: new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
    //        transport: {
    //            read: {
    //                url: "../SearchSchedule/GetBookingProfileReport",
    //                dataType: "json",
    //                global: false,
    //                type: 'POST',
    //                contentType: "application/json; charset=utf-8",
    //                data: function GetReportData() {
    //                    AirlineCode = $('#AirlineSNo').val();
    //                    fromdate = $('#FromDate').val();
    //                    todate = $('#ToDate').val();
    //                    flightNo = $('#FlightNo').val();
    //                    Origin = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    //                    Destination = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
    //                    AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val();
    //                    DateType = $('input[type="radio"][name=Filter]:checked').val();
    //                    OfficeSNo = $('#OfficeSNo').val() == "" ? "0" : $('#OfficeSNo').val();
    //                    return {
    //                        airlineCode: AirlineCode, FlightNo: flightNo, Fromdate: fromdate, Todate: todate, OriginSno: Origin, DestinationSno: Destination, AgentSno: AgentName, DateType: DateType, OfficeSNo: OfficeSNo
    //                    };
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
    //                //AWBSNo	AWBNo	Origin	Destination	IssuePlace	IssueDate	ProductName	
    //                //SHC	CommodityCode	NatureOfGoods	FlightNo	FlightDate	BookingDate	
    //                //AccountName	AccountNo	GrWt	ChWt	CurrCode	GrossCapacity	NetAmount	GrKG	NetKG	TotalOtherCharges
    //                id: "AWBSNo",
    //                fields: {
    //                    AWBSNo: { type: "number" },
    //                    AWBNo: { type: "string" },
    //                    Origin: { type: "string" },
    //                    Destination: { type: "string" },
    //                    Dom: { type: "string" },
    //                    IssuePlace: { type: "string" },
    //                    IssueDate: { type: "string" },
    //                    ProductName: { type: "string" },
    //                    SHC: { type: "string" },
    //                    CommodityCode: { type: "string" },
    //                    NatureOfGoods: { type: "string" },
    //                    FlightNo: { type: "string" },
    //                    FlightNo2: { type: "string" },
    //                    FlightNo3: { type: "string" },
    //                    FlightDate: { type: "string" },
    //                    BookingDate: { type: "string" },
    //                    AccountName: { type: "string" },
    //                    AccountNo: { type: "string" },
    //                    GrWt: { type: "string" },
    //                    ChWt: { type: "string" },
    //                    CurrCode: { type: "string" },
    //                    GrossCapacity: { type: "string" },
    //                    NetAmount: { type: "string" },
    //                    GrKG: { type: "string" },
    //                    NetKG: { type: "string" },
    //                    GrossFreight: { type: "string" },
    //                    CommissionAmount: { type: "string" },
    //                    DiscountAmount: { type: "string" },
    //                    NetFreight: { type: "string" },
    //                    TotalOtherCharges: { type: "string" },
    //                    RateType: { type: "string" },
    //                    RefferenceCode: { type: "string" },
    //                    Insurance: { type: "string" },
    //                    CCA: { type: "string" },
    //                    OfficeName: { type: "string" }

    //                }
    //            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
    //        },

    //    }),

    //    //detailInit: detailInit,
    //    //filterable: { mode: 'menu' },
    //    sortable: true, filterable: false,
    //    pageable: {
    //        refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false
    //    },
    //    scrollable: true,

    //    //height: 450,
    //    columns: [
    //             //AWBSNo	AWBNo	Origin	Destination	IssuePlace	IssueDate	ProductName	
    //                //SHC	CommodityCode	NatureOfGoods	FlightNo	FlightDate	BookingDate	
    //                //AccountName	AccountNo	GrWt	ChWt	CurrCode	GrossCapacity	NetAmount	GrKG	NetKG	TotalOtherCharges


    //        { field: "AWBNo", title: "AWBNo", width: "90px" },
    //        { field: "Origin", title: "Origin", width: "70px" },
    //        { field: "Destination", title: "Dest", width: "70px" },
    //         { field: "Dom", title: "Dom/Int", width: "70px" },
    //        { field: "IssuePlace", title: "Issue Place", width: "70px" },
    //        { field: "IssueDate", title: "IssueDate", width: "70px" },
    //         { field: "ProductName", title: "Product Name", width: "70px" },
    //        { field: "CommodityCode", title: "Commodity", width: "70px" },
    //        { field: "NatureOfGoods", title: "Nature Of Goods", width: "90px" },
    //        { field: "FlightNo", title: "Flight No", width: "70px" },
    //         { field: "FlightNo2", title: "Flight No2", width: "70px" },
    //          { field: "FlightNo3", title: "Flight No3", width: "70px" },
    //        { field: "FlightDate", title: "Flight Date", width: "70px" },
    //         { field: "BookingDate", title: "Booking Date", width: "90px" },
    //         { field: "OfficeName", title: "Office", width: "90px" },
    //        { field: "AccountName", title: "Agent", width: "90px" },
    //        { field: "AccountNo", title: "IATA/AccountNo", width: "90px" },
    //        {
    //            headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Weight</div>",
    //            columns: [{ field: "GrWt", headerTemplate: "<span style='color: blue;font-weight: bold'>Grs.Wt</span>", width: "70px" },
    //               { field: "ChWt", headerTemplate: "<span style='color: blue;font-weight: bold'>Chg.Wt</span>", width: "70px" }, ]
    //        },
    //          { field: "CurrCode", title: "Curr" },
    //         {
    //             headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Revenue</div>",
    //             columns: [{ field: "GrossCapacity", headerTemplate: "<span style='color: blue;font-weight: bold'>Gross. Capt.</span>", width: "70px" },
    //                { field: "NetAmount", headerTemplate: "<span style='color: blue;font-weight: bold'>Net.</span>", width: "70px" }, ]
    //         },

    //           {
    //               headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Rev/Kg</div>",
    //               columns: [{ field: "GrKG", headerTemplate: "<span style='color: blue;font-weight: bold'>Grs.Kg.</span>", width: "70px" },
    //                  { field: "NetKG", headerTemplate: "<span style='color: blue;font-weight: bold'>Net.Kg.</span>", width: "70px" }, ]
    //           },
    //             { field: "GrossFreight", title: "Gross Freight", width: "100px" },
    //               { field: "CommissionAmount", title: "Commission Amount", width: "100px" },
    //                 { field: "DiscountAmount", title: "Discount Amount", width: "100px" },
    //                   { field: "NetFreight", title: "Net Freight", width: "100px" },
    //               { field: "TotalOtherCharges", title: "Oth.Chg.", width: "100px" },
    //                { field: "RateType", title: "Rate Type", width: "70px" },
    //               { field: "RefferenceCode", title: "Refference Code", width: "100px" },
    //                 { field: "Insurance", title: "Insurance", width: "70px" },
    //                   { field: "CCA", title: "CCA", width: "100px" }

    //    ]
    //});
  //  dataSource.bind("error", dataSource_error);


});

//var AirlineCode = "";
//var fromdate = "";
//var todate = "";
//var flightNo = "";
//var Origin = "";
//var Destination = "";
//var AgentName = "";
//var DateType = "";

function dataSource_error(e) {
    //alert(e.status); // displays "error"
    ShowMessage('warning', 'Something went wrong,please try later !', e.status, "bottom-right");
}

var Model=[];
$('#btnSubmit').click(function () {

    Model={
        AirlineCode : $('#AirlineSNo').val(),
    fromdate : $('#FromDate').val(),
    todate : $('#ToDate').val(),
    FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
    OriginSno: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
    DestinationSno: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val(),
    AgentSno: $('#AgentName').val() == "" ? "0" : $('#AgentName').val(),
    DateType : $('input[type="radio"][name=Filter]:checked').val(),
    OfficeSNo: $('#OfficeSNo').val() == "" ? "0" : $('#OfficeSNo').val(),
    PageSize: 100000,
    IsAutoProcess: (OnBlob == true ? 0 : 1)
    };


    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Booking Profile Report', "From Date can not be greater than To Date !");
        return false;;
    }
  
  //  if (AirlineCode != undefined && fromdate != undefined && todate != undefined) {
    //    if (AirlineCode != "" && fromdate != "" && todate != "") {
    if (OnBlob) {
        $.ajax({
            url: "../Reports/BookingProfileReport",
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
       
        var dataSource = $("#grid").kendoGrid({
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
                transport: {
                    read: {
                        url: "../SearchSchedule/GetBookingProfileReport",
                        dataType: "json",
                        global: false,
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data:
                            function GetReportData() {
                            AirlineCode = $('#AirlineSNo').val();
                            fromdate = $('#FromDate').val();
                            todate = $('#ToDate').val();
                            flightNo = $('#FlightNo').val();
                            Origin = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
                            Destination = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
                            AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val();
                            DateType = $('input[type="radio"][name=Filter]:checked').val();
                            OfficeSNo = $('#OfficeSNo').val() == "" ? "0" : $('#OfficeSNo').val();
                            IsAutoProcess = 1;
                            return {
                                airlineCode: AirlineCode, FlightNo: flightNo, Fromdate: fromdate, Todate: todate, OriginSno: Origin, DestinationSno: Destination, AgentSno: AgentName, DateType: DateType, OfficeSNo: OfficeSNo, IsAutoProcess: IsAutoProcess
                            };
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
                        //AWBSNo	AWBNo	Origin	Destination	IssuePlace	IssueDate	ProductName	
                        //SHC	CommodityCode	NatureOfGoods	FlightNo	FlightDate	BookingDate	
                        //AccountName	AccountNo	GrWt	ChWt	CurrCode	GrossCapacity	NetAmount	GrKG	NetKG	TotalOtherCharges
                        id: "AWBSNo",
                        fields: {
                            AWBSNo: { type: "number" },
                            AWBNo: { type: "string" },
                            Origin: { type: "string" },
                            Destination: { type: "string" },
                            Dom: { type: "string" },
                            IssuePlace: { type: "string" },
                            IssueDate: { type: "string" },
                            ProductName: { type: "string" },
                            SHC: { type: "string" },
                            CommodityCode: { type: "string" },
                            NatureOfGoods: { type: "string" },
                            FlightNo: { type: "string" },
                            FlightNo2: { type: "string" },
                            FlightNo3: { type: "string" },
                            FlightDate: { type: "string" },
                            BookingDate: { type: "string" },
                            AccountName: { type: "string" },
                            AccountNo: { type: "string" },
                            GrWt: { type: "string" },
                            ChWt: { type: "string" },
                            CurrCode: { type: "string" },
                            GrossCapacity: { type: "string" },
                            NetAmount: { type: "string" },
                            GrKG: { type: "string" },
                            NetKG: { type: "string" },
                            GrossFreight: { type: "string" },
                            CommissionAmount: { type: "string" },
                            DiscountAmount: { type: "string" },
                            NetFreight: { type: "string" },
                            TotalOtherCharges: { type: "string" },
                            RateType: { type: "string" },
                            RefferenceCode: { type: "string" },
                            Insurance: { type: "string" },
                            CCA: { type: "string" },
                            OfficeName: { type: "string" }

                        }
                    }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                },

            }),

            //detailInit: detailInit,
            //filterable: { mode: 'menu' },
            sortable: true, filterable: false,
            pageable: {
                refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false
            },
            scrollable: true,

            //height: 450,
            columns: [
                     //AWBSNo	AWBNo	Origin	Destination	IssuePlace	IssueDate	ProductName	
                        //SHC	CommodityCode	NatureOfGoods	FlightNo	FlightDate	BookingDate	
                        //AccountName	AccountNo	GrWt	ChWt	CurrCode	GrossCapacity	NetAmount	GrKG	NetKG	TotalOtherCharges


                { field: "AWBNo", title: "AWBNo", width: "90px" },
                { field: "Origin", title: "Origin", width: "70px" },
                { field: "Destination", title: "Dest", width: "70px" },
                 { field: "Dom", title: "Dom/Int", width: "70px" },
                { field: "IssuePlace", title: "Issue Place", width: "70px" },
                { field: "IssueDate", title: "IssueDate", width: "70px" },
                 { field: "ProductName", title: "Product Name", width: "70px" },
                { field: "CommodityCode", title: "Commodity", width: "70px" },
                { field: "NatureOfGoods", title: "Nature Of Goods", width: "90px" },
                { field: "FlightNo", title: "Flight No", width: "70px" },
                 { field: "FlightNo2", title: "Flight No2", width: "70px" },
                  { field: "FlightNo3", title: "Flight No3", width: "70px" },
                { field: "FlightDate", title: "Flight Date", width: "70px" },
                 { field: "BookingDate", title: "Booking Date", width: "90px" },
                 { field: "OfficeName", title: "Office", width: "90px" },
                { field: "AccountName", title: "Agent", width: "90px" },
                { field: "AccountNo", title: "IATA/AccountNo", width: "90px" },
                {
                    headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Weight</div>",
                    columns: [{ field: "GrWt", headerTemplate: "<span style='color: blue;font-weight: bold'>Grs.Wt</span>", width: "70px" },
                       { field: "ChWt", headerTemplate: "<span style='color: blue;font-weight: bold'>Chg.Wt</span>", width: "70px" }, ]
                },
                  { field: "CurrCode", title: "Curr" },
                 {
                     headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Revenue</div>",
                     columns: [{ field: "GrossCapacity", headerTemplate: "<span style='color: blue;font-weight: bold'>Gross. Capt.</span>", width: "70px" },
                        { field: "NetAmount", headerTemplate: "<span style='color: blue;font-weight: bold'>Net.</span>", width: "70px" }, ]
                 },

                   {
                       headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Rev/Kg</div>",
                       columns: [{ field: "GrKG", headerTemplate: "<span style='color: blue;font-weight: bold'>Grs.Kg.</span>", width: "70px" },
                          { field: "NetKG", headerTemplate: "<span style='color: blue;font-weight: bold'>Net.Kg.</span>", width: "70px" }, ]
                   },
                     { field: "GrossFreight", title: "Gross Freight", width: "100px" },
                       { field: "CommissionAmount", title: "Commission Amount", width: "100px" },
                         { field: "DiscountAmount", title: "Discount Amount", width: "100px" },
                           { field: "NetFreight", title: "Net Freight", width: "100px" },
                       { field: "TotalOtherCharges", title: "Oth.Chg.", width: "100px" },
                        { field: "RateType", title: "Rate Type", width: "70px" },
                       { field: "RefferenceCode", title: "Refference Code", width: "100px" },
                         { field: "Insurance", title: "Insurance", width: "70px" },
                           { field: "CCA", title: "CCA", width: "100px" }

            ]
        });

        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
        //  }
        //}
    }
});



function ExportToExcel_Flight() {
    AirlineCode = $('#AirlineSNo').val();
    fromdate = $('#FromDate').val();
    todate = $('#ToDate').val();
    flightNo = $('#FlightNo').val();
    Origin = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    Destination = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
    AgentName = $('#AgentName').val() == "" ? "0" : $('#AgentName').val();
    DateType = $('input[type="radio"][name=Filter]:checked').val();
    OfficeSNo = $('#OfficeSNo').val() == "" ? "0" : $('#OfficeSNo').val();
    if (AirlineCode != undefined && fromdate != undefined && todate != undefined) {
        if (AirlineCode != "" && fromdate != "" && todate != "") {
            //airlineCode: AirlineCode, FlightNo: flightNo, Fromdate: fromdate, Todate: todate, OriginSno: Origin, DestinationSno: Destination, AgentSno: AgentName, DateType: DateType
            window.location.href = "../SearchSchedule/GetBookingProfileReportInExcel?airlineCode=" + AirlineCode + "&FlightNo=" + flightNo + "&Fromdate=" + fromdate + "&Todate=" + todate + "&OriginSno=" + Origin + "&DestinationSno=" + Destination + "&AgentSno=" + AgentName + "&DateType=" + DateType + "&OfficeSNo=" + OfficeSNo+"&IsAutoProcess=1"
        }
    }
}

function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
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


    else if (textId == "Text_FlightNo") {
        if ($('#OriginSNo').val() != '')
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
        if ($('#DestinationSNo').val() != '')
            cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());

        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineSNo").val());
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);

        var RT_Filter = cfi.autoCompleteFilter(filterAirline);
        return RT_Filter;
    }

    else if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineSNo").val());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    
    else if (textId == "Text_AgentName") {
        cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#OfficeSNo").val());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }


}


function ClearAgent() {
    $('#AgentName').val('');
    $("#Text_AgentName_input").val('');
    $('#Text_AgentName').val('');
}