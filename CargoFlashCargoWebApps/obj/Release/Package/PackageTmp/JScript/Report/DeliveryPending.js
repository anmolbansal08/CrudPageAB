/*
*****************************************************************************
Javascript Name:	DeliveryPendingShipmentJS     
Purpose:		    This JS used to get autocomplete for DeliveryPending.
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


    cfi.AutoComplete("Airline", "AirlineName", "Airline", "sno", "AirlineName", ["AirlineName"], null, "contains");


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    $("input[id='Search'][name='Search']").click(function () {

        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            Grid();
        }



    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            SearchData();
        }
    });


});



function SearchData() {


    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();
    var airline = $("#Airline").val();

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

            url: "./Services/Report/DeliveryPendingService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {
                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>Delivery Pending Shipment </td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                       "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";
                    //var str = "<html><table border=\"1px\">";
                    str += "<tr ><td>Airline</td><td>Awb No</td><td>Total Pcs </td><td>Total Weight</td><td>Origin</td> <td>Flight No</td><td>Flight Date</td><td>Nature of Goods</td><td>Cargo Type</td><td>Consignee</td><td>Time From Arrival Days/Hour</td><td>Freight Type</td><td>NFD Date & Time</td><td>User ID</td><td>NFD Remark</td></tr>"

                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].AirlineName + "</td><td>" + response[i].AWBNo + "</td><td>" + response[i].TotalPieces + "</td><td>" + response[i].TotalWeight + "</td><td>" + response[i].Origin
                        + "</td><td>" + response[i].FlightNo
                            + "</td><td>" + response[i].FlightDate + "</td><td>" + response[i].NatureOfGoods
                            + "</td><td>" + response[i].Cargotype + "</td><td>" + response[i].Consignee
                            + "</td><td>" + response[i].DIff + "</td><td>" + response[i].FreightType
                             + "</td><td>" + response[i].NFDDate + "</td><td>" + response[i].NFDBy
                              + "</td><td>" + response[i].NFDRemark
                            + "</td></tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "Delivery Pending Shipment";

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





function Grid() {
    if (cfi.IsValidSubmitSection()) {

        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();
        var airline = $("#Airline").val();
        var dbtableName = "DeliveryPending";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'AWBNo',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 50000, whereCondition: '' + FDate +
                '*' + TDate +
                '*' + airline + '', sort: '',
            servicePath: './Services/Report/DeliveryPendingService.svc',
            getRecordServiceMethod: 'GetDeliveryPendingRecord',
            createUpdateServiceMethod: 'CreateUpdateDeliveryPending',
            deleteServiceMethod: 'DeleteDeliveryPending',
            caption: 'Delivery Pending Shipment',
            initRows: 1,
            columns: [
                        { name: 'SNo', type: 'hidden', value: '0' },
                        { name: 'AirlineName', display: 'Airline', type: 'label', },
                        { name: 'AWBNo', display: 'Awb No', type: 'label', },
                        { name: 'TotalPieces', display: 'Total Pcs', type: 'label' },
                        { name: 'TotalWeight', display: 'Total Weight', type: 'label' },
                        { name: 'Origin', display: 'Origin', type: 'label' },
                        { name: 'FlightNo', display: 'Flight No', type: 'label' },
                        { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                        { name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'label', },
                        { name: 'Cargotype', display: 'Cargo Type', type: 'label' },
                        { name: 'Consignee', display: 'Consignee', type: 'label' },
                        { name: 'DIff', display: 'Time From Arrival Days/Hour', type: 'label' },
                        { name: 'FreightType', display: 'Freight Type', type: 'label' },
                        { name: 'NFDDate', display: 'NFD Date & Time', type: 'label' },
                        { name: 'NFDBy', display: 'User ID', type: 'label' },
                        { name: 'NFDRemark', display: 'NFD Remark', type: 'label' }

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}


