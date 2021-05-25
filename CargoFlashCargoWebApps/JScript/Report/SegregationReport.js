$(document).ready(function ()
{
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "Segregation_Report_Airline", null, "contains");
    //cfi.AutoCompleteV2("AWBNo", "AWBNo", "BookingVarianceReport_AWB", null, "contains");
    //cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Station", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    //cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);
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
    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }
    $('#exportflight').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../SegregationReport/SegregationReportGetRecord",
                    dataType: "json",
                    global: true,
                    type: 'POST',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data:
                        function GetReportData()
                        {
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
                        //Flight No. 	Flight Date	MAWB	HAWB	Manifested Pcs	Manifested G Wt.	Receive Pcs	Receive G Wt.
                        SNo: { type: "number" },
                        //Org: { type: "string" },
                        //Dest: { type: "string" },
                        FlightNo: { type: "string" },
                        FlightDate: { type: "string" },
                        MAWBCount: { type: "string" },
                        ReceivePcs: { type: "string" },
                        ReceiveGWt: { type: "string" },
                        ReceiveChWt: { type: "string" },
                        Status: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },
        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
              //Flight No. 	Flight Date	MAWB	HAWB	Manifested Pcs	Manifested G Wt.	Receive Pcs	Receive G Wt.
             //{ field: "SNo", title: "SNo", width: 30 },
             //{ field: "Org", title: "Org", width: 50 },
             //{ field: "Dest", title: "Dest", width: 70 },
             { field: "FlightNo", title: "Flight No"},
             { field: "FlightDate", title: "Flight Date"},
             { field: "MAWBCount", title: "AWBCount"},
             { field: "ReceivePcs", title: "Receive Pcs"},
             { field: "ReceiveGWt", title: "Receive G Wt."},
             { field: "ReceiveChWt", title: "Receive Ch Wt"},
             { field: "Status", title: "Status"}
        ]
    });
});
var Model = [];
function SearchSegregationReport()
{
    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            //FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
            //OriginSNo: $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val(),
            DestinationSNo: $('#Station').val() == "" ? "0" : $('#Station').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            //AWBNo: $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val()
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val()))
    {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineCode !="" && Model.ToDate != "" && Model.FromDate != "")
    {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#exportflight').show();
    }
}
function ExtraCondition(textId)
{
    //var filterAirline = cfi.getFilter("AND");
    //if (textId == "Text_AirlineCode") {
    //    cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //    return OriginCityAutoCompleteFilter2;
    //}
    //else if (textId == "Text_DestinationSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    //}
    //else if (textId == "Text_OriginSNo") {
    //    //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
    //    cfi.autoCompleteFilter(filterAirline);
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    //}
    //else if (textId == "Text_FlightNo") {
    //    if ($('#Text_OriginSNo').val() != '')
    //        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#OriginSNo").val());
    //    if ($('#Text_DestinationSNo').val() != '')
    //        cfi.setFilter(filterAirline, "DestinationSNo", "eq", $("#DestinationSNo").val());

    //    cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#AirlineCode").val());

    //    var RT_Filter = cfi.autoCompleteFilter(filterAirline);
    //    return RT_Filter;
    //}
}
function ExportExcelSegregation()
{
    var AirlineCode = $('#AirlineCode').val();
    //var FlightNo = $('#FlightNo').val() == "" ? "0" : $("#FlightNo").val();
    //var OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    var DestinationSNo = $('#Station').val() == "" ? "0" : $('#Station').val();
    //var AWBNo = $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    window.location.href = "../SegregationReport/ExportToExcel?AirlineCode=" + AirlineCode + "&DestinationSNo=" + DestinationSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate;
}

