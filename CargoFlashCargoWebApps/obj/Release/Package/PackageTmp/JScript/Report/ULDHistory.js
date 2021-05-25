/*
*****************************************************************************
Javascript Name:	CargoRankingJS     
Purpose:		    This JS used to get autocomplete for ULD History.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    09 Sept 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function ()
{
    cfi.ValidateForm();

    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();

    cfi.AutoComplete("ULDNo", "ULDNo", "vsearchuld", "sno", "ULDNo", null, null, "contains");

    $("input[id='Search'][name='Search']").click(function ()
    {
        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate)
        {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
            return false;
        }
        else
        {
            ULDHistoryGrid();
        }
    });
    $("input[id='ExportToExcel'][name='ExportToExcel']").click(function ()
    {
        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && FromDate != '' && sDate > eDate)
        {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");
            return false;
        }
        else
        {
            ExportToExcel();
        }
    });
});

function ExportToExcel()
{
    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();

    if (cfi.IsValidSubmitSection())
    {
        var obj =
        {
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
        }
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "./Services/Report/ULDHistoryService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response)
            {
                if (response.length > 0)
                {
                    var str = "<html><table  style='width:100%;'><tr><td align=\"left\" style='width:100%;color:RED' >ULD History</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "
                    str += "<br/><table style='width:100%;'  border=\"1px\">";
                    str += "<tr><td>Event</td><td>Event DateTime</td><td>Flight No</td><td>Flight Date</td> <td>Way bill Count</td><td>Gross Weight</td><td>Volume Weight</td><td>User ID</td><td>City Code</td></tr>"
                    for (var i = 0; i < response.length; i++)
                    {
                        str += "<tr><td>" + response[i].StageName + "</td><td>" + response[i].EventTime + "</td><td>" + response[i].FlightNo + "</td><td>" + response[i].FlightDate + "</td><td>" + response[i].WaybillCount + "</td><td>" + response[i].GrossWeight + "</td><td>" + response[i].VolumeWeight + "</td><td>" + response[i].UserID + "</td><td>" + response[i].CityCode + "</td></tr>"
                    }
                    str += "</table></html>";
                    var data_type = 'data:application/vnd.ms-excel';
                    var postfix = "Agent Wise";
                    var a = document.createElement('a');
                    a.href = data_type + ' , ' + encodeURIComponent(str);
                    a.download = 'ULD History ' + postfix + '.xls';
                    a.click();
                }
                else
                {
                    ShowMessage("info", "", "No Data Found...");
                }
            }
        });
    }
}

function ULDHistoryGrid()
{
    if (cfi.IsValidSubmitSection())
    {
        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();
        var ULD = $("#ULDNo").val();

        var dbtableName = "ULDHistory";

        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'ULDNo',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 10, whereCondition: '' + FDate +
                '*' + TDate + '*' + ULD, sort: '',
            servicePath: './Services/Report/ULDHistoryService.svc',
            getRecordServiceMethod: 'GetULDHistoryRecord',
            createUpdateServiceMethod: 'CreateUpdateCargoRanking',
            deleteServiceMethod: 'DeleteCargoRanking',
            caption: 'ULD History',
            initRows: 1,
            columns: [
                     { name: 'SNo', type: 'hidden', value: '0' },
                      { name: 'StageName', display: 'Event', type: 'label' },
                      { name: 'EventTime', display: 'Event DateTime', type: 'label' },
                      { name: 'FlightNo', display: 'FlightNo', type: 'label', },
                      { name: 'FlightDate', display: 'FlightDate', type: 'label' },
                      { name: 'WaybillCount', display: 'WaybillCount', type: 'label' },
                      { name: 'GrossWeight', display: 'GrossWeight', type: 'label' },
                      { name: 'VolumeWeight', display: 'VolumeWeight', type: 'label' },
                      { name: 'UserID', display: 'UserID', type: 'label' },
                      { name: 'CityCode', display: 'CityCode', type: 'label' }
            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
    }
}

