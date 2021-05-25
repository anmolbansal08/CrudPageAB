$(document).ready(function ()
{
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "HoldType_Report_Airline", null, "contains");
    //cfi.AutoCompleteV2("AWBNo", "AWBNo", "BookingVarianceReport_AWB", null, "contains");
    //cfi.AutoCompleteV2("HoldType", "HoldType", "HoldTypeReport_GetHoldType", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);
    $("#FromDate").change(function ()
    {
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
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../HoldTypeReport/HoldTypeReportGetRecord",
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
                        SNo: { type: "number" },
                        AWB: { type: "string" },
                        HAWBNo: { type: "string" },
                        Pkgs: { type: "string" },
                        Gwt: { type: "string" },
                        HoldDate: { type: "string" },
                        HoldedBy: { type: "string" },
                        HoldRemark: { type: "string" }

                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
            //{ field: "SNo", title: "SNo", width: 30 },
            { field: "AWB", title: "AWB No.", width: 50 },
            { field: "HAWBNo", title: "HAWB No.", width: 70 },
            { field: "Pkgs", title: "Pkgs", width: 40 },
            { field: "Gwt", title: "G wt.", width: 40 },
            { field: "HoldDate", title: "Hold Date", width: 50 },
            { field: "HoldedBy", title: "Holded By", width: 50 },
            { field: "HoldRemark", title: "Hold Remark", width: 90 }
        ]
    });
});
var Model = [];
function SearchHoldTypeReport() {
    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            //HoldType: $("#HoldType").val() == "" ? "0" : $("#HoldType").val(),
            //AWBNo: $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val()
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineCode != "" && Model.ToDate != "" && Model.FromDate != "")
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
}
function ExportExcelHoldType()
{
    var AirlineCode = $('#AirlineCode').val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    //var HoldType = $("#HoldType").val() == "" ? "0" : $("#HoldType").val();
    //var AWBNo = $("#AWBNo").val() == "" ? "0" : $("#AWBNo").val();
    window.location.href = "../HoldTypeReport/ExportToExcel?AirlineCode=" + AirlineCode + " &FromDate=" + FromDate + "&ToDate=" + ToDate
}

