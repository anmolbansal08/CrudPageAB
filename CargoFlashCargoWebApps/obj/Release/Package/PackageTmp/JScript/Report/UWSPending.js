/*
*****************************************************************************
Javascript Name:	CargoRankingJS     
Purpose:		    This JS used to get autocomplete for Cargo Ranking.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    06 June 2016
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

    //$("#FlightDt").val("");

    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");
    //$("#AirlineSNo").before("<input type="");

    cfi.AutoComplete("EquipmentNo", "EquipmentNo", "vequipment", "EquipmentNo", "EquipmentNo", null, null, "contains");
    cfi.AutoComplete("Destination", "DestinationCode", "vequipdestination", "DestinationCode", "DestinationCode", null, null, "contains");

    cfi.AutoComplete("Airline", "AirlineName", "Airline", "CarrierCode", "AirlineName", ["AirlineName"], null, "contains");

    cfi.AutoComplete("FlightNumber", "FlightNo", "vwuwsflghtno", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");

    cfi.AutoComplete("ULD", "ULDNo", "vuwsuld", "ULDNo", "ULDNo", ["ULDNo"], null, "contains");

    cfi.AutoComplete("AwbNo", "AwbNo", "vwuwsawb", "AwbNo", "AwbNo", ["AwbNo"], null, "contains");


    $("input[id='Search'][name='Search']").click(function () {
        if ($("#EquipmentNo").val() == '' && $("#Destination").val() == '' && $("#Airline").val() == '' && $("#FlightNumber").val() == '' && $("#FlightDt").val() == '' && $("#ULD").val() == '' && $("#AwbNo").val() == '') {
            ShowMessage('warning', 'Information', "Please Select Any Criteria");

            return false;
        }
        else {
            UWSGrid();
        }


    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        if ($("#EquipmentNo").val() == '' && $("#Destination").val() == '' && $("#Airline").val() == '' && $("#FlightNumber").val() == '' && $("#FlightDt").val() == '' && $("#ULD").val() == '' && $("#AwbNo").val() == '') {
            ShowMessage('warning', 'Information', "Please Select Any Criteria");

            return false;
        }
        else {
            SearchData();
        }

    });


});

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");

    if (textId.indexOf("Text_FlightNumber") >= 0) {
        if ($("#Text_Airline").val() != "") {

            cfi.setFilter(filterEmbargo, "FlightCode", "eq", $("#Text_Airline").data("kendoAutoComplete").key());
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", cfi.CfiDate("FlightDt"));

            var filterULD = cfi.autoCompleteFilter(filterEmbargo);

            return filterULD;
        }

        else {



            cfi.setFilter(filterEmbargo, "FlightDate", "eq", cfi.CfiDate("FlightDt"));

            var filterULD = cfi.autoCompleteFilter(filterEmbargo);

            return filterULD;


        }

    }

}

function SearchData() {

    if (cfi.IsValidSubmitSection()) {
        var obj = {
            Equipment: $("#EquipmentNo").val(),
            DestCode: $("#Destination").val(),
            Airline: $("#Airline").val(),
            FlightNumber: $("#FlightNumber").val(),
            FlightDt: $("#FlightDt").val(),
            ULD: $("#ULD").val(),
            AwbNo: $("#AwbNo").val()
        }

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Report/UWSPendingService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {
                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" colspan='4'>SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\"  colspan='7'>Pending UWS </td><td align=\"right\" colspan='5'>Date : " + response[0].Dt +
                       "</td></tr></table> "


                    str += "<br/><table style='width:90%;'  border=\"1px\">";

                    str += "<tr ><td>Flight No</td><td>Flight Date </td><td>Load Type</td><td>Equipment No</td> <td>Issued</td><td>ULDNo/BULK</td><td>AWB Nbr</td><td>Origin</td><td>Destination</td><td>Process</td><td>Scale WT</td><td>Tare WT</td><td>Total WT</td><td>Net WT</td><td>Variance %</td><td>Manual</td><td>Remarks</td><td>SHC</td></tr>"

                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].FlightNo + "</td><td>" + response[i].FlightDate + "</td><td>" + response[i].Load + "</td><td>" + response[i].EquipmentNo
                            + "</td><td>" + response[i].Issued + "</td><td>" + response[i].ULDNo + "</td><td>" + response[i].AwbNo
                            + "</td><td>" + response[i].Origin + "</td><td>" + response[i].Destination
                             + "</td><td>" + response[i].Process + "</td><td>" + response[i].ScaleWt
                             + "</td><td>" + response[i].TareWt + "</td><td>" + response[i].TotalWt
                             + "</td><td>" + response[i].NetWt + "</td><td>" + response[i].Variance
                             + "</td><td>" + response[i].Manual + "</td><td>" + response[i].Remark
                              + "</td><td>" + response[i].SHC
                            + "</td></tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';

                    var postfix = "";

                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'Pending UWS List ' + postfix + '.xls';

                    a.click();


                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}

function UWSGrid() {
    if (cfi.IsValidSubmitSection()) {

        var Equipment = $("#EquipmentNo").val();
        var Destination = $("#Destination").val();
        var Airline = $("#Airline").val();
        var FlightNumber = $("#FlightNumber").val();
        var FlightDt = $("#FlightDt").val();
        var ULD = $("#ULD").val();
        var AwbNo = $("#AwbNo").val();

        var dbtableName = "UWSPending";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'EquipmentNo',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 50, whereCondition: '' + Equipment +
                  '*' + Destination + '*' + Airline + '*' + FlightNumber + '*' + FlightDt + '*' + ULD + '*' + AwbNo + '', sort: '',
            servicePath: './Services/Report/UWSPendingService.svc',
            getRecordServiceMethod: 'GetUWSPendingRecord',
            //   createUpdateServiceMethod: 'CreateUpdateUWSPending',
            //deleteServiceMethod: 'DeleteUWSPending',
            caption: 'Pending UWS List',
            initRows: 1,
            columns: [
                      { name: 'SNo', type: 'hidden', value: '0' },
                      { name: 'FlightNo', display: 'Flight No', type: 'label', },
                      { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                      { name: 'Load', display: 'Load Type', type: 'label' },
                      { name: 'EquipmentNo', display: 'Equipment No', type: 'label' },
                      { name: 'Issued', display: 'Issued', type: 'label' },
                      { name: 'ULDNo', display: 'ULDNo/BULK', type: 'label' },
                      { name: 'AwbNo', display: 'AWB Nbr', type: 'label', width: '20px' },
                      { name: 'Origin', display: 'Origin', type: 'label', },
                      { name: 'Destination', display: 'Destination', type: 'label' },
                       { name: 'Process', display: 'Process', type: 'label' },
                      { name: 'ScaleWt', display: 'Scale WT', type: 'label' },
                      { name: 'TareWt', display: 'Tare WT', type: 'label' },
                      { name: 'TotalWt', display: 'Total WT', type: 'label' },
                      { name: 'NetWt', display: 'Net WT', type: 'label' },
                      { name: 'Variance', display: 'Variance %', type: 'label' },
                      { name: 'Manual', display: 'Manual', type: 'label' },
                      { name: 'Remark', display: 'Remarks', type: 'label' },
                      { name: 'SHC', display: 'SHC', type: 'label' }

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}

