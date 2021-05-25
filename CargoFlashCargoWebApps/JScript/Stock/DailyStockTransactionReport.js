
var OnBlob = false;



$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "DailyStockTransactionreport_Airline", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CityCode,CityName", "DailyStockTransactionreport_City", null, "contains");


    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("#FromDate").change(function () {

        //$("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        //$("#ToDate").data("kendoDatePicker").value('');

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


    $('#imgexcel').hide();
    $('#grid').css('display', 'none')





    //$.ajax({
    //    url: "../Reports/DailyStock",
    //    async: true,
    //    type: "GET",
    //    dataType: "json",
    //    data: function GetReportData(){
    //        AirlineSNo= $('#AirlineSNo').val();
    //        FromDate = $("#FromDate").val();
    //        ToDate = $("#ToDate").val();
    //        OriginSNo = $("#OriginSNo").val();
    //        DestinationSNo = $("#DestinationSNo").val();
    //        Type = $('input[type="radio"][name=Filter]:checked').val();
    //        IsAutoProcess: (OnBlob == true ? 0 : 1)
    //    },
    //    success: function (result) {
    //        ShowMessage('warning', 'Reports!', result.Table0[0].ErrorMessage);
    //    }
    //});
    
        //$("#grid").kendoGrid({

        //    autoBind: false,
        //    dataSource: new kendo.data.DataSource({
        //        type: "json",
        //        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
        //        transport: {
        //            read: {
        //                url: "../DailyStockTransactionReport/DailyStockTransactionReportGetRecord",
        //                dataType: "json",
        //                global: false,
        //                type: 'POST',
        //                contentType: "application/json; charset=utf-8",
        //                data: function GetReportData() {
        //                    AirlineSNo = $('#AirlineSNo').val();
        //                    FromDate = $("#FromDate").val();
        //                    ToDate = $("#ToDate").val();
        //                    OriginSNo = $("#OriginSNo").val();
        //                    IsAutoProcess = $("#IsAutoProcess").val();
        //                    //DestinationSNo = $("#DestinationSNo").val();
        //                    //Type = $('input[type="radio"][name=Filter]:checked').val();
        //                    return { AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, OriginSNo: OriginSNo, IsAutoProcess: IsAutoProcess };
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
        //                    FromLocation: { type: "string" },
        //                    ToLocation: { type: "string" },
        //                    StartRange: { type: "string" },
        //                    EndRange: { type: "string" },
        //                    Count: { type: "string" },
        //                    TransactionType: { type: "string" },
        //                    TransactionDate: { type: "string" }
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

        //        { field: "FromLocation", title: "From Location", filterable: true },
        //        { field: "ToLocation", title: "To Location" },
        //        { field: "StartRange", title: "Start Range" },
        //        { field: "EndRange", title: "End Range" },
        //        { field: "Count", title: "Count" },
        //       { field: "TransactionType", title: "Transaction Type" },
        //       { field: "TransactionDate", title: "Transaction Date" }
        //    ]
        //});
    

});

var Model = [];

function GetReportData() {
    Model = {
        AirlineSNo: $('#AirlineSNo').val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        OriginSNo: $("#OriginSNo").val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1),
        PageSize: 10000
    };

    if (OnBlob) {
        $.ajax({
            url: "../Reports/DailyStockTransactionReport",
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
                transport: {
                    read: {
                        url: "../DailyStockTransactionReport/DailyStockTransactionReportGetRecord",
                        dataType: "json",
                        global: false,
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data:
                        function GetReportData() {
                            AirlineSNo = $('#AirlineSNo').val();
                            FromDate = $("#FromDate").val();
                            ToDate = $("#ToDate").val();
                            OriginSNo = $("#OriginSNo").val();
                            IsAutoProcess =1;
                            //DestinationSNo = $("#DestinationSNo").val();
                            //Type = $('input[type="radio"][name=Filter]:checked').val();
                            return { AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, OriginSNo: OriginSNo, IsAutoProcess: IsAutoProcess };
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
                            FromLocation: { type: "string" },
                            ToLocation: { type: "string" },
                            StartRange: { type: "string" },
                            EndRange: { type: "string" },
                            Count: { type: "string" },
                            TransactionType: { type: "string" },
                            TransactionDate: { type: "string" }
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

                { field: "FromLocation", title: "From Location", filterable: true },
                { field: "ToLocation", title: "To Location" },
                { field: "StartRange", title: "Start Range" },
                { field: "EndRange", title: "End Range" },
                { field: "Count", title: "Count" },
               { field: "TransactionType", title: "Transaction Type" },
               { field: "TransactionDate", title: "Transaction Date" }
            ]
        });


        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
        $('#imgexcel').show();
    }
}


//var AirlineSNo = "";
//var FromDate = "";
//var ToDate = "";
//var OriginSNo = "";
//var DestinationSNo = "";

//function SearchDailyStockTransactionReport() {


//    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
//        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
//        return false;;
//    }

//    AirlineSNo = $('#AirlineSNo').val();

//    $("#BlackListTbl").remove();
//    if (AirlineSNo != "" && $('#ToDate').val() != "" && $('#FromDate').val() != "") {
//        $('#grid').css('display', '')
//        $("#grid").data('kendoGrid').dataSource.page(1);
//        //$("#grid").data('kendoGrid').dataSource.pageSize(20);
//        // $("#grid").data('kendoGrid').dataSource.read();

//        $('#imgexcel').show();
//    }
//}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
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

}


function ExportToExcel_DailyStockTransactionReport() {

    AirlineSNo = $('#AirlineSNo').val();
    FromDate = $("#FromDate").val();
    ToDate = $("#ToDate").val();
    OriginSNo = $("#OriginSNo").val();
    IsAutoProcess = 1;
    //Type = $('input[type="radio"][name=Filter]:checked').val();
    window.location.href = "/DailyStockTransactionReport/ExportToExcel?airlineSNo=" + AirlineSNo + "&fromDate=" + FromDate + "&todate=" + ToDate + "&OriginSNo=" + OriginSNo + "&IsAutoProcess=" + IsAutoProcess;


    //$.ajax({
    //    url: '../DailyStockTransactionReport/ExportToExcel',
    //    async: false,
    //    type: "GET",
    //    dataType: "json",
    //    data: {
    //        AirlineSNo: AirlineSNo, FromDate: FromDate, ToDate: ToDate, OriginSNo: OriginSNo
    //    },
    //    contentType: "application/json; charset=utf-8", cache: false,
    //    success: function (result) {
    //        var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'><thead role='rowgroup'><tr role='row' style='background-color: #daecf4;'><th role='columnheader' data-field='FromLocation' rowspan='1' data-title='From Location' data-index='0' class='k-header' data-role='columnsorter'>From Location</th><th role='columnheader' data-field='To Location' rowspan='1' data-title='To Location' data-index='1' class='k-header' data-role='columnsorter'>To Location</th><th role='columnheader' data-field='StartRange' rowspan='1' data-title='Start Range' data-index='2' class='k-header' data-role='columnsorter'>Start Range</th><th role='columnheader' data-field='EndRange' rowspan='1' data-title='End Range' data-index='3' class='k-header' data-role='columnsorter'>End Range</th><th role='columnheader' data-field='Count' rowspan='1' data-title='Count' data-index='4' class='k-header' data-role='columnsorter'>Count</th><th role='columnheader' data-field='TransactionType' rowspan='1' data-title='Transaction Type' data-index='5' class='k-header' data-role='columnsorter'>Transaction Type</th><th role='columnheader' data-field='TransactionDate' rowspan='1' data-title='Transaction Date' data-index='6' class='k-header' data-role='columnsorter'>Transaction Date</th></tr></thead>";
    //        if (result.Data.length > 0) {
    //            for (var i = 0; i < result.Data.length; i++) {
    //                str += "<tr>";
    //                str += "<td>" + result.Data[i].FromLocation + "</td>";
    //                str += "<td>" + result.Data[i].ToLocation + "</td>";
    //                str += "<td>" + result.Data[i].StartRange + "</td>";
    //                str += "<td>" + result.Data[i].EndRange + "</td>";
    //                str += "<td>" + result.Data[i].Count + "</td>";
    //                str += "<td>" + result.Data[i].TransactionType + "</td>";
    //                str += "<td>" + result.Data[i].TransactionDate + "</td>";
    //                str += "</tr>";
    //            }
    //        }
    //        else {
    //            str += " <tr>";
    //            str += "<td colspan='7'><center><p style='color:red'>No Record Found</p></center></td>";
    //            str += "</tr>";
    //        }
    //        str += "</table>";

    //        var today = new Date();
    //        var dd = today.getDate();
    //        var mm = today.getMonth() + 1; //January is 0!

    //        var yyyy = today.getFullYear();
    //        if (dd < 10) {
    //            dd = '0' + dd;
    //        }
    //        if (mm < 10) {
    //            mm = '0' + mm;
    //        }
    //        var today = dd + '_' + mm + '_' + yyyy;


    //        var a = document.createElement('a');
    //        var data_type = 'data:application/vnd.ms-excel';
    //        var table_div = str;
    //        var table_html = table_div.replace(/ /g, '%20');
    //        a.href = data_type + ', ' + table_html;
    //        a.download = 'DailyStockTransactionReport_' + today + '_.xls';
    //        a.click();
    //        //}
    //        return false
    //    },
    //    error: function (xhr) {
    //        var a = "";
    //    }
    //});

}