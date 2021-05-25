var OnBlob = false;


$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "DailyReport_POD_Airline", null, "contains");
    cfi.AutoCompleteV2("DestAirportSNo", "AirportCode,AirportName", "DailyReport_POD_Airport", null, "contains");
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
        $("#AirlineSNo").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
    }

    $('#exportflight').hide();
    $('#grid').css('display', 'none')
    //$("#grid").kendoGrid({
    //    autoBind: false,
    //    dataSource: new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 25,
    //        transport: {
    //            read: {
    //                url: "../DailyReportPOD/DailyReportPODRecord",
    //                dataType: "json",
    //                global: true,
    //                type: 'POST',
    //                method: 'POST',
    //                contentType: "application/json; charset=utf-8",
    //                data:
    //                    function GetReportData() {
    //                        return { Model: Model };
    //                    }

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
    //                    ////S No.	DONo	MAWBNo.	HAWBNo.	Pcs.	GWt.		CreatedBy	CreatedOn
    //                    No: { type: "string" },
    //                    FlightNo: { type: "string" },
    //                    Pieces: { type: "string" },
    //                    MAWB: { type: "string" },
    //                    HAWBNo: { type: "string" },
    //                    Collie: { type: "string" },
    //                    weight: { type: "string" },
    //                    Date: { type: "string" },
    //                    Time: { type: "string" },
    //                    TransferTime: { type: "string" },
    //                    CgoTime: { type: "string" },
    //                    Consignee: { type: "string" },
    //                    Note: { type: "string" }
    //                }
    //            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
    //        },

    //    }),
    //    sortable: true, filterable: false,
    //    pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
    //    scrollable: true,
    //    columns: [
    //       ////S No.	DONo	MAWBNo.	HAWBNo.	Pcs.	GWt.		CreatedBy	CreatedOn
    //        { field: "No", title: "No", width: "120px" },
    //        { field: "FlightNo", title: "Flight No" },
    //        { field: "ArrDate", title: "Arr. Date" },
    //        { field: "MAWB", title: "MAWB" },
    //        { field: "HAWBNo", title: "HAWB" },
    //        { field: "Pieces", title: "Pieces" },
    //        { field: "weight", title: "weight" },
    //         {
    //             headerTemplate: "<span class='hcap' align='center'>DOC. DELIVERY</span>",
    //             columns: [{ field: "Date", title: "Date" },
    //                       { field: "Time", title: "Time" },
    //             ]
    //         },
    //        { field: "TransferTime", title: "Transfer Time<br/>(minutes)" },
    //        {
    //            headerTemplate: "<span class='hcap'>CGO DELIVERY</span>",
    //            columns: [{ field: "Date", title: "Date" },
    //                      { field: "CgoTime", title: "Time" },
    //            ]
    //        },
    //        { field: "Consignee", title: "Consignee" },
    //        { field: "Note", title: "Note" }
    //    ]
    //});
});
var Model = [];

function SearchDailyReportPODRecord() {
    Model =
        {
            AirlineSNo: $('#AirlineSNo').val(),
            AirportSNo: $('#DestAirportSNo').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            IsAutoProcess: (OnBlob == true ? 0 : 1),
            pagesize: 10
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if (Model.AirlineSNo != "" && Model.AirportSNo != "" && Model.ToDate != "" && Model.FromDate != "") {

        if (OnBlob) {
            $.ajax({
                url: "../Reports/DailyReportPOD",
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
                    serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 25,
                    transport: {
                        read: {
                            url: "../DailyReportPOD/DailyReportPODRecord",
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
                                ////S No.	DONo	MAWBNo.	HAWBNo.	Pcs.	GWt.		CreatedBy	CreatedOn
                                No: { type: "string" },
                                FlightNo: { type: "string" },
                                Pieces: { type: "string" },
                                MAWB: { type: "string" },
                                HAWBNo: { type: "string" },
                                Collie: { type: "string" },
                                weight: { type: "string" },
                                Date: { type: "string" },
                                Time: { type: "string" },
                                TransferTime: { type: "string" },
                                CgoTime: { type: "string" },
                                Consignee: { type: "string" },
                                Note: { type: "string" }
                            }
                        }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                    },

                }),
                sortable: true, filterable: false,
                pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
                scrollable: true,
                columns: [
                   ////S No.	DONo	MAWBNo.	HAWBNo.	Pcs.	GWt.		CreatedBy	CreatedOn
                    { field: "No", title: "No", width: "120px" },
                    { field: "FlightNo", title: "Flight No" },
                    { field: "ArrDate", title: "Arr. Date" },
                    { field: "MAWB", title: "MAWB" },
                    { field: "HAWBNo", title: "HAWB" },
                    { field: "Pieces", title: "Pieces" },
                    { field: "weight", title: "weight" },
                     {
                         headerTemplate: "<span class='hcap' align='center'>DOC. DELIVERY</span>",
                         columns: [{ field: "Date", title: "Date" },
                                   { field: "Time", title: "Time" },
                         ]
                     },
                    { field: "TransferTime", title: "Transfer Time<br/>(minutes)" },
                    {
                        headerTemplate: "<span class='hcap'>CGO DELIVERY</span>",
                        columns: [{ field: "Date", title: "Date" },
                                  { field: "CgoTime", title: "Time" },
                        ]
                    },
                    { field: "Consignee", title: "Consignee" },
                    { field: "Note", title: "Note" }
                ]
            });
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
            $('#exportflight').show();

        }
    }
}
function ExportExcelDailyReportPOD() {
    var AirlineSNo = $('#AirlineSNo').val();
    var AirportSNo = $('#DestAirportSNo').val();
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    window.location.href = "../DailyReportPOD/ExportExcelDailyReportPOD?AirlineSNo=" + AirlineSNo + "&AirportSNo=" + AirportSNo + "&FromDate=" + FromDate + "&ToDate=" + ToDate+"&IsAutoProcess=1";
}