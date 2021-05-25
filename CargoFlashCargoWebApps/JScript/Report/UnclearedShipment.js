/*
*****************************************************************************
Javascript Name:	UnclearedShipmentJS     
Purpose:		    This JS used to get autocomplete for UnclearedShipment.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    21 Sept 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();

    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();


    cfi.AutoCompleteV2("Airline", "AirlineName", "UnclearedShipment_CarrierCode", null, "contains");
    cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "ULDSTOCK_Airport", null, "contains");
    cfi.AutoCompleteV2("Agent", "Name", "UnclearedShipment_Agent", null, "contains");
    cfi.AutoCompleteV2("Type", "AirlineName", "UnclearedShipment_CarrierCode", null, "contains");
    var form = [{ Key: "1", Text: "International" }, { Key: "2", Text: "Domestic" }, { Key: "3", Text: "Both" }, ];
    cfi.AutoCompleteByDataSource("Type", form)
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $('#Airport').val(userContext.AirportSNo);
    $('#Text_Airport').val(userContext.AirportCode + '-' + userContext.AirportName);
    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");




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

    if (userContext.AirlineSNo != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#Airline").val(userContext.AirlineSNo);
        $("#Text_Airline").val(userContext.AirlineCarrierCode);
    }


    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "./Services/Report/UnclearedShipmentService.svc/GetUnclearedShipmentRecord",
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
                        Airline: { type: "string" },
                        Agent: { type: "string" },
                        AWBNo: { type: "string" },
                        DeliveryOrder: { type: "string" },
                        DateofIssuance: { type: "string" },
                        Consignee: { type: "string" },
                        Origin: { type: "string" },
                        Dest: { type: "string" },
                        TotalPieces: { type: "string" },
                        TotalWeight: { type: "string" },
                        FlightNo: { type: "string" },
                        FlightDate: { type: "string" },
                        HAWBNo: { type: "string" },
                        DLVPC: { type: "string" },
                        DLVWT: { type: "string" },
                        DIff: { type: "string" },
                        TimeFromArrivalDaysHour: { type: "string" }
                    }
                }, data: function (data) { return data.value; }, total: function (data) { return data.key; }
            },

        }),

        //detailInit: detailInit,
        //filterable: { mode: 'menu' },
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        //height: 450,
        columns: [

                        { field: 'AirlineName', title: 'Airline', width: 70 },
                          { field: 'AgentName', title: 'Agent', width: 70 },
                        { field: 'AWBNo', title: 'Awb No.', width: 70 },
                        { field: 'DeliveryOrder', title: 'Delivery Order', width: 70 },
                        { field: 'DateofIssuance', title: 'Date of Issuance', width: 80 },
                        { field: 'Consignee', title: 'Consignee', width: 70 },
                         { field: 'Origin', title: 'Origin', width: 70 },
                          { field: 'Dest', title: 'Dest', width: 70 },
                        { field: 'TotalPieces', title: 'Total Pcs', width: 70 },
                        { field: 'TotalWeight', title: 'Total Weight', width: 70 },
                        { field: 'FlightNo', title: 'Flight No', width: 70 },
                        { field: 'FlightDate', title: 'Flight Date', width: 70 },
                        { field: 'HAWBNo', title: 'HAWB No.', width: 70 },
                        { field: 'DLVPC', title: 'DO Pcs', width: 70 },
                        { field: 'DLVWT', title: 'DO Weight', width: 70 },
                        { field: 'DIff', title: 'DIff', width: 70 },
                        { field: 'TimeFromArrivalDaysHour', title: 'Time From Arrival Days/Hour', width: 120 }
        ]
    });



    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        var AirlineSNo = $("#Airline").val() || 0;
        var AirportSNo = $("#Airport").val() || 0;
        var Type = $("#Type").val() || 0;
        var Agent = $("#Agent").val() || 0;
        var FromDt = $("#FromDate").val();
        var ToDt = $("#ToDate").val();

        if (AirlineSNo != "" && FromDt != "" && ToDt != "" && Model.AirportSNo != "") {
            //USGrid();
            if (cfi.IsValidSubmitSection()) {
                window.location.href = "../DataSetToExcel/ExportToExcelAllForUnClearedShipment?AirlineSNo=" + AirlineSNo + "&Type=" + Type + "&Agent=" + Agent + "&AirportSNo=" + AirportSNo + "&FromDt=" + FromDt + "&ToDt=" + ToDt + "";

            }
        }
    });

});
var Model = [];
$("input[id='Search'][name='Search']").click(function () {
    Model =
     {
         AirlineSNo: $("#Airline").val() || 0,
         AirportSNo: $("#Airport").val() || 0,
         AgentSNo: $("#Agent").val() || 0,
         FromDt: $("#FromDate").val(),
         ToDt: $("#ToDate").val(),
         Type: $("#Type").val() || 0,
     };


    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
        return false;
    }
    if (Model.FromDt != "" && Model.ToDt != "" && Model.Airline != "" && Model.AirportSNo !="") {
        //USGrid();
        if (cfi.IsValidSubmitSection()) {
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
        }
    }
    else {


    }



});



function SearchData() {


    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();

    if (cfi.IsValidSubmitSection()) {
        var obj = {
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            airline: $("#Airline").val()
        }


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Report/UnclearedShipmentService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {
                    //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >GARUDA AIRLINES</td><td></td><td align=\"center\" style='width:50%;'>Uncleared Shipment </td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                       "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";
                    //var str = "<html><table border=\"1px\">";
                    str += "<tr ><td>Airline</td><td>Awb No.</td><td>Delivery Order</td><td>Date of Issuance</td><td>Consignee</td> <td>Total Pcs</td><td>Total Weight</td><td>Flight No</td><td>Flight Date</td><td>HAWB No.</td><td>Delivery Pcs.</td><td>Delivery Weight</td><td>Time From Arrival Days/Hour</td></tr>"

                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].AirlineName + "</td><td>" + response[i].AWBNo + "</td><td>"
                            + response[i].DeliveryOrder + "</td><td>" + response[i].DeliveryDate
                             + "</td><td>" + response[i].Consignee + "</td><td>"
                            + response[i].TotalPieces + "</td><td>" + response[i].TotalWeight + "</td><td>" + response[i].FlightNo
                            + "</td><td>" + response[i].FlightDate + "</td><td>" + response[i].hawb
                            + "</td><td>" + response[i].dlvpc
                            + "</td><td>" + response[i].dlvwt + "</td><td>" + response[i].DIff
                            + "</td></tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "Uncleared Shipment";

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}


function BindWhereCondition() {

    return {
        Airline: $("#Airline").val() || 0,
        FromDt: $("#FromDate").val(),
        ToDt: $("#ToDate").val()

    };
}



function USGrid() {
    if (cfi.IsValidSubmitSection()) {

        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();
        var airline = $("#Airline").val();
        var dbtableName = "UnclearedShipment";

        $('#tbl' + dbtableName).appendGrid({
            V2: true,
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'AWBNo',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 50000, model: BindWhereCondition(), sort: '',



            servicePath: './Services/Report/UnclearedShipmentService.svc',
            getRecordServiceMethod: 'GetUnclearedShipmentRecord',
            createUpdateServiceMethod: 'CreateUpdateUnclearedShipment',
            deleteServiceMethod: 'DeleteUnclearedShipment',
            caption: 'Uncleared Shipment',
            initRows: 1,
            columns: [
                        { name: 'AirlineName', display: 'Airline', type: 'label', },
                        { name: 'AWBNo', display: 'Awb No.', type: 'label', },
                        { name: 'DeliveryOrder', display: 'Delivery Order', type: 'label' },
                        { name: 'DeliveryDate', display: 'Date of Issuance', type: 'label' },
                        { name: 'Consignee', display: 'Consignee', type: 'label' },
                        { name: 'TotalPieces', display: 'Total Pcs', type: 'label' },
                        { name: 'TotalWeight', display: 'Total Weight', type: 'label' },
                        { name: 'FlightNo', display: 'Flight No', type: 'label' },
                        { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                        { name: 'hawb', display: 'HAWB No.', type: 'label', },
                        { name: 'dlvpc', display: 'DLV Pcs', type: 'label' },
                        { name: 'dlvwt', display: 'DLV Weight', type: 'label' },
                        { name: 'DIff', display: 'Time From Arrival Days/Hour', type: 'label' }

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_Airline") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }


}


//function USGrid()
//{
//    if (cfi.IsValidSubmitSection()) {

//        var FDate = $("#FromDate").val();
//        var TDate = $("#ToDate").val();

//        var dbtableName = "UnclearedShipment";

//        $('#tbl' + dbtableName).appendGrid({
//            tableID: 'tbl' + dbtableName,
//            contentEditable: true,
//            isGetRecord: true,
//            tableColume: 'AWBNo',
//            masterTableSNo: 1,
//            currentPage: 1, itemsPerPage: 50, whereCondition: '' + FDate +
//                '*' + TDate + '', sort: '',
//                servicePath: './Services/Report/UnclearedShipmentService.svc',
//                getRecordServiceMethod: 'GetUnclearedShipmentRecord',
//                createUpdateServiceMethod: 'CreateUpdateUnclearedShipment',
//                deleteServiceMethod: 'DeleteUnclearedShipment',
//                caption: 'Uncleared Shipment',
//            initRows: 1,
//            columns: [
//                        { name: 'AWBNo', display: 'Awb No.', type: 'label', },
//                        //{ name: 'DeliveryOrder', display: 'Delivery Order', type: 'label' },
//                        //{ name: 'DeliveryDate', display: 'Date of Issuance', type: 'label' },
//                        //{ name: 'Consignee', display: 'Consignee', type: 'label' },
//                        //{ name: 'TotalPieces', display: 'Total Pcs', type: 'label' },
//                        //{ name: 'TotalWeight', display: 'Total Weight', type: 'label' },
//                        //{ name: 'FlightNo', display: 'Flight No', type: 'label' },
//                        //{ name: 'FlightDate', display: 'Flight Date', type: 'label' },
//                        //{ name: 'hawb', display: 'HAWB No.', type: 'label', },
//                        //{ name: 'dlvpc', display: 'DLV Pcs', type: 'label' },
//                        //{ name: 'dlvwt', display: 'DLV Weight', type: 'label' },
//                        //{ name: 'DIff', display: 'Time From Arrival Days/Hour', type: 'label' }

//            ],
//            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
//            isPaging: true,
//        });
//    }
//}

