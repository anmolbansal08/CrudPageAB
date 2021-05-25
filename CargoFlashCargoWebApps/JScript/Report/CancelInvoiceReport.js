/// <reference path="D:\CargoProject\Cargoflash.Garuda.Reservation\GADev\CargoFlashCargoWebApps\Scripts/references.js" />
var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "WareHouseAccountReport_CarrierCode", null, "contains");

    // cfi.AutoComplete("ConAWBPrefix", "AirlineCode", "vwAirline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains");

    cfi.AutoCompleteV2("AWBSNo", "AWBNo", "WareHouseAccountReport_AWBNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    cfi.AutoCompleteV2("Destination", "CITYCODE,CityName", "BookingReport_CITY", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "AccountCode,Name", "BookingVarianceReport_AccountCode", null, "contains");
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
        $('#grid').css('display', 'none')
    });
});

//var AirlineSNo = "";
//var OriginSNo = "";
//var DestinationSno = "";
//var FromDate = "";
//var ToDate = "";
//var AWBSNo = "";
//var CancelType = "";
var OptionType = "";
//var agentsno = "";

var Model = [];
function SearchCancelInvoiceRefund() {
    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }
    //AirlineSNo = $('#AirlineSNo').val();
    //OriginSNo = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    //DestinationSno = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    //FromDate = $("#FromDate").val();
    //ToDate = $("#ToDate").val();
    //AWBSNo = $('#AWBSNo').val() == "" ? "0" : $('#AWBSNo').val();
    //CancelType = $('input[type="radio"][name=BasedOnCancel]:checked').val();
    //OptionType = $('input[type="radio"][name=BasedOn]:checked').val();
    //agentsno = $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val();

    Model =
       {
           AirlineSNo: $('#AirlineSNo').val(),
           OriginSNo: $('#Origin').val() == "" ? "0" : $('#Origin').val(),
           DestinationSno: $('#Destination').val() == "" ? "0" : $('#Destination').val(),
           FromDate: $("#FromDate").val(),
           ToDate: $("#ToDate").val(),
           AWBSNo: $('#AWBSNo').val() == "" ? "0" : $('#AWBSNo').val(),
           CancelType: $('input[type="radio"][name=BasedOnCancel]:checked').val(),
           OptionType: $('input[type="radio"][name=BasedOn]:checked').val(),
           agentsno: $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val(),
           pagesize: 100000,
           IsAutoProcess: (OnBlob == true ? 0 : 1)

       };
    if (Date.parse(Model.FromDate) > Date.parse(Model.ToDate)) {

        ShowMessage('warning', 'Warning - Penalty Report ', "From Date can not be greater than To Date !");
        //alert('From Date can not be greater than To Date');
        return;
    }

    var frmdate = $('#FromDate').val();
    var tdate = $('#ToDate').val();
    if (frmdate != undefined && tdate != undefined) {
        if (frmdate != "" && tdate != "") {
            // $('#grid').css('display', '')
            // if (OptionType == 0) {
            if (OnBlob) {
                $.ajax({
                    url: "../Reports/CancelInvoiceandRefundReport",
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
                //   }
                $('#grid').css('display', '')
                if (OptionType == 0) {
                    //  $("#grid").data('kendoGrid').dataSource.page(1);
                    $('#grid').html('');
                    $('#btnExportToExcel').show();
                    var dataSource = $("#grid").kendoGrid({
                        autoBind: false,
                            dataSource: new kendo.data.DataSource({
                            type: "json",
                            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
                            transport: {
                                read: {
                                    url: "../CancelInvoicereport/GetCancelInvoiceReport",
                                    dataType: "json",
                                    global: false,
                                    type: 'POST',
                                    contentType: "application/json; charset=utf-8",
                                    //////////////////////////
                                    data: function GetReportData() {
                                        return { Model: Model };
                                    }
                                    //////////////////////////////////////
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
                                        awbno: { type: "string" },
                                        InvoiceNo: { type: "string" },
                                        bookingType: { type: "string" },
                                        agentname: { type: "string" },
                                        origin: { type: "string" },
                                        destination: { type: "string" },
                                        flightno: { type: "string" },
                                        flightdate: { type: "string" },
                                        bookingdate: { type: "string" },
                                        pieces: { type: "string" },
                                        grossweight: { type: "string" },
                                        volumeweight: { type: "string" },
                                        Chargeableweight: { type: "string" },
                                        Amount: { type: "string" },
                                        Type: { type: "string" },
                                        //RequestedBy: { type: "string" },
                                        ApprovedBy: { type: "string" },
                                        //RequestedDate: { type: "string" },
                                        ApprovalDate: { type: "string" }



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
                            { field: "awbno", title: "AWB Number", width: "120px" },
                              { field: "InvoiceNo", title: "Invoice No", width: "120px" },
                            { field: "bookingType", title: "Booking Type", width: "120px" },
                            { field: "agentname", title: "Agent Name", width: "50px" },
                            { field: "origin", title: "origin", width: "50px" },
                             { field: "destination", title: "Destination", width: "90px" },
                            { field: "flightno", title: "Flight No", width: "115px" },
                            { field: "flightdate", title: "Flight Date", width: "120px" },
                             { field: "bookingdate", title: "Booking Date", width: "50px" },
                              { field: "pieces", title: "Pieces", width: "70px" },
                                 { field: "grossweight", title: "Gross Weight", width: "70px" },
                                     { field: "volumeweight", title: "Volume Weight", width: "70px" },
                            { field: "Chargeableweight", title: "Chargeable Weight", width: "100px" },
                             { field: "Amount", title: "Amount", width: "70px" },
                                { field: "Type", title: "Type", width: "70px" },
                            //{ field: "RequestedBy", title: "Requested By", width: "70px" },
                            { field: "ApprovedBy", title: "Approved By", width: "125px" },
                             //{ field: "RequestedDate", title: "Requested Date", width: "120px" },
                              { field: "ApprovalDate", title: "Approval Date", width: "120px" }



                        ]
                    });
                    $("#grid").data('kendoGrid').dataSource.page(1);
                    dataSource.bind("error", dataSource_error);
                }

                if (OptionType == 1) {
                    $('#grid').html('');
                    $('#btnExportToExcel').show();
                    var dataSource = $("#grid").kendoGrid({
                        autoBind: false,
                        dataSource: new kendo.data.DataSource({
                            type: "json",
                            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
                            transport: {
                                read: {
                                    url: "../CancelInvoicereport/GetCancelInvoiceReport",
                                    dataType: "json",
                                    global: false,
                                    type: 'POST',
                                    contentType: "application/json; charset=utf-8",
                                    //////////////////////////
                                    data: function GetReportData() {
                                        return { Model: Model };
                                    }
                                    //////////////////////////////////////
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
                                        awbno: { type: "string" },
                                        InvoiceNo: { type: "string" },
                                        bookingType: { type: "string" },
                                        agentname: { type: "string" },
                                        origin: { type: "string" },
                                        destination: { type: "string" },
                                        flightno: { type: "string" },
                                        flightdate: { type: "string" },
                                        bookingdate: { type: "string" },
                                        pieces: { type: "string" },
                                        grossweight: { type: "string" },
                                        volumeweight: { type: "string" },
                                        Chargeableweight: { type: "string" },
                                        Amount: { type: "string" },
                                        Type: { type: "string" },
                                        RequestedBy: { type: "string" },
                                        //ApprovedBy: { type: "string" },
                                        RequestedDate: { type: "string" },
                                        //ApprovalDate: { type: "string" }



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
                            { field: "awbno", title: "AWB Number", width: "120px" },
                              { field: "InvoiceNo", title: "Invoice No", width: "120px" },
                            { field: "bookingType", title: "Booking Type", width: "120px" },
                            { field: "agentname", title: "Agent Name", width: "50px" },
                            { field: "origin", title: "origin", width: "50px" },
                             { field: "destination", title: "Destination", width: "90px" },
                            { field: "flightno", title: "Flight No", width: "115px" },
                            { field: "flightdate", title: "Flight Date", width: "120px" },
                             { field: "bookingdate", title: "Booking Date", width: "50px" },
                              { field: "pieces", title: "Pieces", width: "70px" },
                                 { field: "grossweight", title: "Gross Weight", width: "70px" },
                                     { field: "volumeweight", title: "Volume Weight", width: "70px" },
                            { field: "Chargeableweight", title: "Chargeable Weight", width: "100px" },
                             { field: "Amount", title: "Amount", width: "70px" },
                                { field: "Type", title: "Type", width: "70px" },
                            { field: "RequestedBy", title: "Requested By", width: "70px" },
                            //{ field: "ApprovedBy", title: "Approved By", width: "125px" },
                             { field: "RequestedDate", title: "Requested Date", width: "120px" },
                              //{ field: "ApprovalDate", title: "Approval Date", width: "120px" }



                        ]
                    });
                    $("#grid").data('kendoGrid').dataSource.page(1);
                    dataSource.bind("error", dataSource_error);
                }
                if (OptionType == 2) {
                    $.ajax({
                        url: "../Reports/CancelInvoiceandRefundReport",
                        async: true,
                        type: "GET",
                        dataType: "json",
                        data: Model,
                        success: function (result) {
                            ShowMessage('warning', 'Reports!', result.Table0[0].ErrorMessage);
                        }
                    });
                }
                $('#grid').html('');
                $('#btnExportToExcel').show();
                var dataSource = $("#grid").kendoGrid({
                    autoBind: false,
                    dataSource: new kendo.data.DataSource({
                        type: "json",
                        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
                        transport: {
                            read: {
                                url: "../CancelInvoicereport/GetCancelInvoiceReport",
                                dataType: "json",
                                global: false,
                                type: 'POST',
                                contentType: "application/json; charset=utf-8",
                                //////////////////////////
                                data: function GetReportData() {
                                    return { Model: Model };
                                }
                                //////////////////////////////////////
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
                                    awbno: { type: "string" },
                                    InvoiceNo: { type: "string" },
                                    bookingType: { type: "string" },
                                    agentname: { type: "string" },
                                    origin: { type: "string" },
                                    destination: { type: "string" },
                                    flightno: { type: "string" },
                                    flightdate: { type: "string" },
                                    bookingdate: { type: "string" },
                                    pieces: { type: "string" },
                                    grossweight: { type: "string" },
                                    volumeweight: { type: "string" },
                                    Chargeableweight: { type: "string" },
                                    Amount: { type: "string" },
                                    Type: { type: "string" },
                                    //  RequestedBy: { type: "string" },
                                    ApprovedBy: { type: "string" },
                                    //  RequestedDate: { type: "string" },
                                    ApprovalDate: { type: "string" }



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
                        { field: "awbno", title: "AWB Number", width: "120px" },
                          { field: "InvoiceNo", title: "Invoice No", width: "120px" },
                        { field: "bookingType", title: "Booking Type", width: "120px" },
                        { field: "agentname", title: "Agent Name", width: "50px" },
                        { field: "origin", title: "origin", width: "50px" },
                         { field: "destination", title: "Destination", width: "90px" },
                        { field: "flightno", title: "Flight No", width: "115px" },
                        { field: "flightdate", title: "Flight Date", width: "120px" },
                         { field: "bookingdate", title: "Booking Date", width: "50px" },
                          { field: "pieces", title: "Pieces", width: "70px" },
                             { field: "grossweight", title: "Gross Weight", width: "70px" },
                                 { field: "volumeweight", title: "Volume Weight", width: "70px" },
                        { field: "Chargeableweight", title: "Chargeable Weight", width: "100px" },
                         { field: "Amount", title: "Amount", width: "70px" },
                            { field: "Type", title: "Type", width: "70px" },
                       // { field: "RequestedBy", title: "Requested By", width: "70px" },
                        { field: "ApprovedBy", title: "Rejected By", width: "125px" },
                       //  { field: "RequestedDate", title: "Requested Date", width: "120px" },
                          { field: "ApprovalDate", title: "Rejected Date", width: "120px" }



                    ]
                });
                $("#grid").data('kendoGrid').dataSource.page(1);
                dataSource.bind("error", dataSource_error);
            }

        }
    }
}



// $('#grid').css('display', 'none')







////////////////////////////////
function dataSource_error(e) {
    //alert(e.status); // displays "error"
    ShowMessage('warning', 'Something went wrong,please try later !', e.status, "bottom-right");
}

function SearchCancelInvoiceRefund1() {
    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        return false;;
    }
    AirlineSNo = $('#AirlineSNo').val();
    OriginSNo = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    DestinationSno = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    FromDate = $("#FromDate").val();
    ToDate = $("#ToDate").val();
    AWBSNo = $('#AWBSNo').val() == "" ? "0" : $('#AWBSNo').val();
    CancelType = $('input[type="radio"][name=BasedOnCancel]:checked').val();
    OptionType = $('input[type="radio"][name=BasedOn]:checked').val();
    agentsno = $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val();
    IsAutoProcess = 1;
    $('#theadid').html('');
    $('#tbodyid').html('');
    if (AirlineSNo != undefined && $('#ToDate').val() != undefined && $('#FromDate').val() != undefined) {
        if (AirlineSNo != "" && $('#ToDate').val() != "" && $('#FromDate').val() != "") {
            $.ajax({
                url: "../CancelInvoicereport/GetCancelInvoiceReport",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AirlineSNo: AirlineSNo, OriginSNo: OriginSNo, DestinationSno: DestinationSno, FromDate: FromDate, ToDate: ToDate, AWBSNo: AWBSNo, CancelType: CancelType, OptionType: OptionType, agentsno: agentsno, IsAutoProcess: IsAutoProcess }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    if (dataTableobj.Table0.length > 0) {

                        var Result = dataTableobj.Table0
                        var thead_body = "";
                        var thead_row = "";

                        if (Result.length > 0) {

                            for (var i = 0; i < Result.length; i++) {
                                var columnsIn = Result[0];// Coulms Name geting from First Row
                                thead_row += '<tr>'
                                for (var key in columnsIn) { // Printing Columns
                                    if (i == 0)
                                        thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";

                                    thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                                }
                                thead_row += '</tr>'
                            }
                        }
                        $('#theadid').append('<tr>' + thead_body + '</tr>');
                        $('#tbodyid').append(thead_row);
                        $(".k-grid-header-wrap").closest('div').attr('style', 'overflow: scroll;height:400px;');
                        $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                        $("#Serial").closest('td').attr('style', 'color:#daecf4');
                        $("#Serial").closest('td').text('Seri');
                        $('#example').show();
                        $('#imgexcel').show();
                    }
                    else {
                        $('#theadid').html('');
                        $('#tbodyid').html('');
                        $('#example').hide();

                        ShowMessage('warning', 'Warning - Warehouse Accounting Report!', "Record Not Found !");
                    }
                },
                error: function (xhr) {

                }
            });
        }
    }
}


function ExtraCondition(textId) {




    if (textId == "Text_AgentSNo") {


        var filterFlt = cfi.getFilter("AND");


        cfi.setFilter(filterFlt, "AirlineCode", "in", $('#AirlineSNo').val());
        filterEmbargo = cfi.autoCompleteFilter(filterFlt);
        return filterEmbargo;
    }
}
function ExportToExcel() {

    AirlineSNo = $('#AirlineSNo').val();
    OriginSNo = $('#Origin').val() == "" ? "0" : $('#Origin').val();
    DestinationSno = $('#Destination').val() == "" ? "0" : $('#Destination').val();
    FromDate = $("#FromDate").val();
    ToDate = $("#ToDate").val();
    AWBSNo = $('#AWBSNo').val() == "" ? "0" : $('#AWBSNo').val();
    CancelType = $('input[type="radio"][name=BasedOnCancel]:checked').val();
    OptionType = $('input[type="radio"][name=BasedOn]:checked').val();
    agentsno = $('#AgentSNo').val() == "" ? "0" : $('#AgentSNo').val();

    if (AirlineSNo != "" && FromDate != "" && ToDate != "") {

        //AirlineSNo: AirlineSNo, OriginSNo: OriginSNo, FromDate: FromDate, ToDate: ToDate, AWBSNo: AWBSNo, ReportType: ReportType

        window.location.href = "../CancelInvoicereport/ExportToExcel?AirlineSNo=" + AirlineSNo + "&OriginSNo=" + OriginSNo + "&DestinationSno=" + DestinationSno + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&AWBSNo=" + AWBSNo + "&CancelType=" + CancelType + "&OptionType=" + OptionType + "&agentsno=" + agentsno + "&IsAutoProcess=1";

    }

}
