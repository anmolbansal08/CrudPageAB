$(document).ready(function ()
{
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "AirMail_Report_Airline", null, "contains", null, null, null, null, null);
    //cfi.AutoCompleteV2("MovementTypeSNo", "Description", "AirMailReport_GetMovementType", null, "contains");
    var MovementTypeSNo = [{ Key: "1", Text: "Import" }, { Key: "2", Text: "Export" }, { Key: "3", Text: "Both" }]
    cfi.AutoCompleteByDataSource("MovementTypeSNo", MovementTypeSNo, null, null);
    //cfi.AutoCompleteV2("FlightNo", "FlightNo", "BookingProfileReport_FlightNo", null, "contains");
    //cfi.AutoCompleteV2("OriginSNo", "CITYCODE,CityName", "BookingVarianceReport_CITY", null, "contains");
    cfi.AutoCompleteV2("AirportCode", "AirportCode,AirportName", "AirMail_Report", null, "contains");
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

    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3)
    {
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
                    url: "../AirMailReport/AirMailReportGetRecord",
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

                }, parameterMap: function (options)
                {
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
                        //MovementType 	TotalConsignment	TotalPcs	TotalGrWt	TotalChWt
                        SNo: { type: "number" },
                        //Org: { type: "string" },
                        //Dest: { type: "string" },
                        FlightNo: { type: "string" },
                        FlightDate: { type: "string" },
                        MovementType: { type: "string" },
                        TotalConsignment: { type: "string" },
                        TotalPcs: { type: "string" },
                        TotalGrWt: { type: "string" },
                        TotalChWt: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
             //{ field: "SNo", title: "SNo" },
             //{ field: "Org", title: "Org"},
             //{ field: "Dest", title: "Dest"},
            { field: "FlightNo", title: "Flight No." },
            { field: "FlightDate", title: "Flight Date" },
            { field: "MovementType", title: "Movement Type" },
            { field: "TotalConsignment", title: "Total Consignment" },
            { field: "TotalPcs", title: "Total Pcs." },
            { field: "TotalGrWt", title: "Total Gr Wt." },
            { field: "TotalChWt", title: "Total Ch Wt." }
        ]
    });
});
var Model = [];
function SearchAirMailReport() {
    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            //FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
            AirportCode: $('#AirportCode').val() == "" ? "0" : $('#AirportCode').val(),
            //DestinationSNo: $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            MovementTypeSNo: $("#MovementTypeSNo").val() == "" ? "0" : $("#MovementTypeSNo").val()
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineCode != "" && Model.AirportCode !="" && Model.ToDate != "" && Model.FromDate != "") {
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
    //else if (textId == "Text_DestinationSNo")
    //{
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
function ExportExcelHoldType()
{
    var AirlineCode = $('#AirlineCode').val();
    //var FlightNo = $('#FlightNo').val() == "" ? "0" : $("#FlightNo").val();
    //var OriginSNo = $('#OriginSNo').val() == "" ? "0" : $('#OriginSNo').val();
    //var DestinationSNo = $('#DestinationSNo').val() == "" ? "0" : $('#DestinationSNo').val();
    var AirportCode = $('#AirportCode').val() == "" ? "0" : $('#AirportCode').val()
    var MovementTypeSNo = $("#MovementTypeSNo").val() == "" ? "0" : $("#MovementTypeSNo").val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    window.location.href = "../AirMailReport/ExportToExcel?AirlineCode=" + AirlineCode + "&AirportCode=" + AirportCode + "&MovementTypeSNo=" + MovementTypeSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate;
}

