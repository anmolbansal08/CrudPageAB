/*
*****************************************************************************
Javascript Name:	BackLogCargoJS
Purpose:		    This JS used to get autocomplete for BackLogCargo.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    02 FEB 2016
Updated By:
Updated On:
Approved By:
Approved On:
* *****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();
    //$('#__SpanHeader__').html("Walking Rate:")
    //$('.formbuttonrow').remove();
    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();
    var alphabettypes = [{ Key: "0", Text: "OffLoaded" }, { Key: "1", Text: "Transit" }, { Key: "2", Text: "Transfer" }, { Key: "3", Text: "RCS Not Departed" }];
    cfi.AutoCompleteByDataSource("Status", alphabettypes);
    cfi.AutoComplete("SHC", "Code", "SPHC", "Code", "Code", null, null, "contains");
    cfi.AutoComplete("AWBNo", "AWBNo", "AWB", "AWBNo", "AWBNo", null, null, "contains");
    cfi.AutoComplete("Origin", "AirportCode,AirportName", "vAirport", "AirportCode", "SNo", ["AirportCode", "AirportName"], null, "contains");
    $("#LyingDate").val('');

    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    $("input[id='GenExcel'][name='GenExcel']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Send Mail' name='SendMail' id='SendMail' />");
    $("#Text_Origin").data("kendoAutoComplete").setDefaultValue("SHJ", "SHJ-SHARJAH INTERNATIONAL AIRPORT");

    cfi.AutoComplete("Destination", "AirportCode,AirportName", "vAirport", "AirportCode", "SNo", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "vwairline", "CarrierCode", "AirlineCode", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("ULDNo", "ULDName", "vwuldno", "ULDName", "ULDName", null, null, "contains");
    //cfi.AutoComplete("ULDNo", "ULDName,SNo", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");

    $("input[id='Search'][name='Search']").click(function () {
        BackLogCargoGrid();
    });

    $("input[id='SendMail'][name='SendMail']").click(function () {
        SendData();
    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        SearchData();
    });
    if (!userContext.IsShowAllData && $("#Text_Origin").data("kendoAutoComplete")) {
        $("#Text_Origin").data("kendoAutoComplete").enable(true);
    }



});


//function CheckAirline()
//{

//  // $("input[id='GenExcel'][name='GenExcel']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Send Mail' name='SendMail' id='SendMail' />");
//}



function BackLogCargoGrid() {
    if (cfi.IsValidSubmitSection()) {
        var VAirline = $('#Airline').val();
        var VStatus = $('#Status').val();
        var VOrigin = $('#Origin').val();
        var VDestination = $('#Destination').val();
        var VSHC = $('#SHC').val();
        var VAWBNo = $('#AWBNo').val();
        var dbtableName = "BackLogCargo";
        var Airline = $("#Airline").val();
        var VULD = $("#ULDNo").val();
        var VDate = $("#LyingDate").val();

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'SNo',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 5, whereCondition: '' + VAirline + '*' + VStatus + '*' + VOrigin + '*' + VDestination + '*' + VSHC + '*' + VAWBNo + '*' + VULD +
                '*' + VDate + '', sort: '',
            servicePath: './Services/Shipment/BackLogCargoService.svc',
            getRecordServiceMethod: 'GetBackLogCargoRecord',
            createUpdateServiceMethod: 'CreateUpdateBackLogCargo',
            deleteServiceMethod: 'DeleteBackLogCargo',
            caption: 'Lying List',
            initRows: 1,
            columns: [
                      { name: 'SNo', type: 'hidden', value: '0' },
                      { name: 'Airline', display: 'Airline', type: 'label', },

                      { name: 'Origin', display: 'Origin', type: 'label' },
                      { name: 'Destination', display: 'Destination', type: 'label' },
                      { name: 'FlightNo', display: 'Flight No', type: 'label' },
                      { name: 'FlightDate', display: 'Flight Date', type: 'label' },
                      { name: 'AWBNo', display: 'AWB No', type: 'label' },
                      //

                      { name: 'TotalPc', display: 'Total Pieces', type: 'label' },
                      { name: 'GrossWeight', display: 'Gross Weight', type: 'label' },
                      { name: 'VolumeWeight', display: 'Volume Weight', type: 'label' },
                        { name: 'NOG', display: 'Nature of Goods', type: 'label', ctrlCss: { width: '50px', height: '20px' } },
                      { name: 'SHC', display: 'SHC', type: 'label' },
                      { name: 'Status', display: 'Status', type: 'label' },
                      { name: 'OffloadFrom', display: 'Offloaded From', type: 'label' },
                       { name: 'ULD', display: 'ULD No', type: 'label' },
                         { name: 'OffloadSince', display: 'Arr/Acc Date Time', type: 'label' },
                           { name: 'Diffdays', display: 'Pending Days', type: 'label' },
                           { name: 'LyingPc', display: 'Lying at '+VOrigin+' -Pcs/Gross Wt', type: 'label' }

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }

}



function SearchData() {
    var obj = {
        Airline: $("#Airline").val(),
        Status: $("#Status").val(),
        Origin: $("#Origin").val(),
        Destination: $("#Destination").val(),
        SHC: $("#SHC").val(),
        AWBNo: $("#AWBNo").val(),
        ULD: $("#ULDNo").val(),
        FlightDate: $("#LyingDate").val()
    }


    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        url: "./Services/Shipment/BackLogCargoService.svc/SearchData",
        data: JSON.stringify(obj),
        success: function (response) {
            if (response.length > 0) {

                var str = "<html><table border=\"1px\">";
                str += "<tr ><td>Airline</td><td>Origin </td><td>Destination</td><td>Flight No</td> <td>Flight Date</td><td>AWB No</td><td>SLI</td><td>Total Pieces</td><td>GrossWeight</td><td>VolumeWeight</td><td>Nature of Goods</td><td>SHC</td><td>Status</td><td>Offloaded From</td> <td>ULD</td><td>Arr/Acc Date Time</td><td>Pending Days</td><td>Lying at SHJ- PCs/Gross Wt</td> </tr>"

                for (var i = 0; i < response.length; i++) {
                    str += "<tr><td>" + response[i].Airline + "</td><td>" + response[i].Origin + "</td><td>" + response[i].Destination + "</td><td>" + response[i].FlightNo
                        + "</td><td>'" + response[i].FlightDate + "</td><td>" + response[i].AWBNo
                        + "</td><td>" + response[i].SLI
                        + "</td><td>" + response[i].TotalPc + "</td><td>" + response[i].GrossWeight
                         + "</td><td>" + response[i].VolumeWeight + "</td><td>" + response[i].NOG + "</td><td>" + response[i].SHC
                          + "</td><td>" + response[i].Status + "</td><td>" + response[i].OffloadFrom
                          + "</td><td>" + response[i].ULD
                           + "</td><td>'" + response[i].OffloadSince + "</td><td>" + response[i].Diffdays + "</td><td>" + response[i].LyingPc
                        + "</td></tr>"
                }
                str += "</table></html>";
                var data_type = 'data:application/vnd.ms-excel';

                var postfix = "";

                var a = document.createElement('a');
                a.href = data_type + ' , ' + encodeURIComponent(str);
                a.download = 'Lying List.xls';

                a.click();


            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}


function SendData() {
    var obj = {
        Airline: $("#Airline").val(),
        Status: $("#Status").val(),
        Origin: $("#Origin").val(),
        Destination: $("#Destination").val(),
        SHC: $("#SHC").val(),
        AWBNo: $("#AWBNo").val(),
        ULD: $("#ULDNo").val(),
        FlightDate: $("#LyingDate").val()
    }

    if ($("#Airline").val() != "") {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Shipment/BackLogCargoService.svc/SendData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {
                    ShowMessage("info", "", "Mail Sent Successfully !!");
                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }

        });
    }
    else {
        ShowMessage("info", "", "Please Select Airline");
    }
}