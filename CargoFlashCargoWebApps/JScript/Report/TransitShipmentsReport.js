



$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "DailySalesReport_Airline", null, "contains");
    //cfi.AutoCompleteV2("AWBNo", "AWBNo", "BookingVarianceReport_AWB", null, "contains");
    //cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");
    //cfi.AutoCompleteV2("OriginSNo", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    //cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");


    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Flight_Control_searchBoardingPoint", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "Flight_Control_searchBoardingPoint", null, "contains");

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

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }

    $('#exportflight').hide();
    $('#exportflight1').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../TransitShipmentsReport/TransitShipmentsReportGetRecord",
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
                        //Station,Org,Dest,JoiningCargo,RampTransfer,Transit,Total
                        SNo: { type: "number" },
                        Station: { type: "string" },
                        Org: { type: "string" },
                        Dest: { type: "string" },
                        JoiningCargo: { type: "string" },
                        RampTransfer: { type: "string" },
                        Transit: { type: "string" },
                        Total: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
            //Station,Org,Dest,JoiningCargo,RampTransfer,Transit,Total
             //{ field: "SNo", title: "SNo" },
               { field: "Station", title: "Station" },
            { field: "Org", title: "Org" },
            { field: "Dest", title: "Dest" },
            { field: "JoiningCargo", title: "Joining Cargo", template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"JC\",this)'>#= JoiningCargo #</a>" },
            { field: "RampTransfer", title: "Ramp Transfer", template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"RT\",this)'>#= RampTransfer #</a>" },
            { field: "Transit", title: "Transit", template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"TR\",this)'>#= Transit #</a>" },
            { field: "Total", title: "Total", template: "<a href='\\\#' class='name-link' onclick='ShowDetails(\"#=SNo#\",\"TO\",this)'>#= Total #</a>" }
            //{ field: "RampTransfer", title: "Ramp Transfer" },
            //{ field: "Transit", title: "Transit" },
            //{ field: "Total", title: "Total" }
        ]
    });


    //---------------------------AWB Show Details ----------------------
    $('#AWBDetailgrid').css('display', 'none')
    $("#AWBDetailgrid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../TransitShipmentsReport/ShowAWBDetails",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
                        return { Model: AWBModel };
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
                        FlightNo: { type: "string" },
                        FlightDate: { type: "string" },
                        TotalPieces: { type: "string" },
                        TotalGrossWeight: { type: "string" },
                        TotalCBM: { type: "string" },
                        TotalChargeableWeight: { type: "string" }
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

            { field: "AWBNo", title: "AWBNo" },
            { field: "FlightNo", title: "Flight No" },
                { field: "FlightDate", title: "Flight Date" },

              { field: "TotalPieces", title: "TotalPieces" },
                { field: "TotalGrossWeight", title: "TotalGrossWeight" },
                  { field: "VolumeWeight", title: "Volume Weight" },
                    { field: "TotalChargeableWeight", title: "TotalChargeableWeight" },
        ]
    });

});


var Model = [];
var AWBModel = [];
var KeyAWBSNo = "";
var SumType = "";
var OriginCode = "";
var DestinationCode = "";
var LoginAirport = "";

function ShowDetails(TextColumn, Type, input) {


    
    var OrgText = $(input).closest('tr').find("td:eq(" + $(input).closest("div.k-grid").find("div.k-grid-header").find("th[data-field='Org']").index() + ")").text()
    var DestText = $(input).closest('tr').find("td:eq(" + $(input).closest("div.k-grid").find("div.k-grid-header").find("th[data-field='Dest']").index() + ")").text()

    

    AWBModel =
       {
           LoginAirportSNo: userContext.AirportSNo,
           AirlineCode: $('#AirlineCode').val(),
           Origin: OrgText,
           Destination: DestText,
           FromDate: $("#FromDate").val(),
           ToDate: $("#ToDate").val(),
           SNo: TextColumn,
           Type: Type
       };
    KeyAWBSNo = TextColumn;
    SumType = Type;
    OriginCode = OrgText;
    DestinationCode = DestText;
    LoginAirport = AWBModel.LoginAirportSNo;
    $('#AWBDetailgrid').css('display', '')
    $("#AWBDetailgrid").data('kendoGrid').dataSource.page(1);

    if (!$("#DivAWBDeatils").data("kendoWindow")) {
        $('#exportflight1').show();
        cfi.PopUpCreate("DivAWBDeatils", "AWB Details", 800);
    } else {

        var win = $("#DivAWBDeatils").data("kendoWindow");
        win.open();
    }


}

function SearchTransitShipmentsReport() {
    Model =
        {
            LoginAirportSNo: userContext.AirportSNo,
            AirlineCode: $('#AirlineCode').val(),
            Origin: $('#Origin').val() == "" ? "0" : $('#Origin').val(),
            Destination: $('#Destination').val() == "" ? "0" : $('#Destination').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val()
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
    }
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_Destination") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "AirportCode", "notin", $("#Origin").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_Origin") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "AirportCode", "notin", $("#Destination").val()), cfi.autoCompleteFilter(textId);
    }
}



function ExportExcelTransitShipments() {
    var LoginAirportSNo = userContext.AirportSNo;
    var AirlineCode = $('#AirlineCode').val();
    var Origin = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    var Destination = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    window.location.href = "../TransitShipmentsReport/ExportToExcel?LoginAirportSNo=" + LoginAirportSNo + "&AirlineCode=" + AirlineCode + "&Origin=" + Origin + "&Destination=" + Destination + "&FromDate=" + FromDate + "&ToDate=" + ToDate;
}

function ExportToExcel_GetAWBDetails() {

    var AirlineCode = $('#AirlineCode').val();
    var Origin = OriginCode;
    var Destination = DestinationCode;
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    var SNo = KeyAWBSNo;
    var TypeOf = SumType;
    //AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, ReportType: ReportType, KeyColumn: KeyColumn
    if (AirlineCode != "" && FromDate != "" && ToDate != "") {
        window.location.href = "../TransitShipmentsReport/ExportToExcelAWBShowDetails?AirlineCode=" + AirlineCode + "&Origin=" + Origin + "&Destination=" + Destination + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&SNo=" + SNo + "&TypeOf=" + TypeOf + "";

    }

}
