$(document).ready(function () {



    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "BookingVarianceReport_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "AccountCode,Name", "BookingVarianceReport_AccountCode", null, "contains");
    cfi.AutoCompleteV2("ProductSNo", "ProductName", "BookingVarianceReport_Product", null, "contains");

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
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
                    url: "../StationSummaryReport/GetStationSummaryReport",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {

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
                        //STATIONS AGENT   TOTALSHPTS GRSWT CHWT   CumulativeShpts    CumulativeGrWt CumulativeChWt
                        SNo: { type: "number" },
                        STATIONS: { type: "string" },
                        AGENT: { type: "string" },
                        TOTALSHPTS: { type: "string" },
                        CHWT: { type: "string" },
                        CumulativeShpts: { type: "string" },
                        CumulativeGrWt: { type: "string" },
                        CumulativeChWt: { type: "string" }
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
             //STATIONS AGENT   TOTALSHPTS GRSWT CHWT   CumulativeShpts    CumulativeGrWt CumulativeChWt
            { field: "STATIONS", title: "Stations", filterable: true, width: 110 },
            { field: "AGENT", title: "Agent", width: 90 },
            { field: "TOTALSHPTS", title: "Total Shpts", width: 90 },
            { field: "GRSWT", title: "Grs.Wt", width: 90 },
            { field: "CHWT", title: "Ch.Wt", width: 90 },
            { field: "CumulativeShpts", title: "Cumulative Shpts", width: 110 },
            { field: "CumulativeGrWt", title: "Cumulative Gr.Wt", width: 90 },
           { field: "CumulativeChWt", title: "Cumulative Ch.Wt", width: 90 }
        ]
    });
    $("#Text_AgentSNo").change(function () {

        GetProductAsPerAgent();
    });

});
var ProductAsPerAgent = "";
function GetProductAsPerAgent() {
    ProductAsPerAgent = '';
    if ($("#Text_AgentSNo").val() != "" && $("#Text_AgentSNo").val() != undefined) {
        $.ajax({
            url: "../Services/Shipment/ReservationBookingService.svc/GetProductAsPerAgent",
            async: false,
            type: "GET",
            dataType: "json",
            data: { AgentSNo: $("#AgentSNo").val() == "" ? 0 : $("#AgentSNo").val() },
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

var Model = [];
$('#btnSubmit').click(function () {
    if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        //alert('From Date can not be greater than To Date');
        ShowMessage('warning', 'warning - Booking VS Accepted Report', "From Date can not be greater than To Date !");
        return false;;
    }
    Model = {
        AirlineCode: $('#AirlineCode').val(),
        AgentSNo: $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val(),
        ProductSNo: $('#ProductSNo').val() == "" ? "0" : $('#ProductSNo').val(),
        FromDate: $('#Fromdate').val(),
        ToDate: $('#Todate').val(),
        //ISCumulative: $('input[type="radio"][name=Filter]:checked').val()
    };


    if (!cfi.IsValidSubmitSection()) {
        return false;
    }



    if (Model.AirlineCode != "" && Model.FromDate != "" && Model.ToDate != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
        $('#grid table thead tr th a').css('cursor', 'none')
    }
});

function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    else if (textId.indexOf("Text_ProductSNo") >= 0) {
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

    var AirlineCode = $('#AirlineCode').val();
    var AgentSNo = $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val()
    var ProductSNo = $('#ProductSNo').val() == "" ? "0" : $('#ProductSNo').val();
    //var ISCumulative = $('input[type="radio"][name=Filter]:checked').val();
    var FromDate = $('#Fromdate').val();
    var ToDate = $('#Todate').val();


    if (AirlineCode != "" && FromDate != "" && ToDate != "") {
        window.location.href = "../StationSummaryReport/GetStationSummaryReportForExcel?AirlineCode=" + AirlineCode + "&ProductSNo=" + ProductSNo + "&AgentSNo=" + AgentSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate;

    }
}
