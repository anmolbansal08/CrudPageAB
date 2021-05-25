/*
*****************************************************************************
Javascript Name:	ULDOutJS     
Purpose:		    This JS used to get autocomplete for ULD Out.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    14 Sept 2016
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
    var alphabettypes = [{ Key: "0", Text: "Forwarder" }, { Key: "1", Text: "Shipper" }, { Key: "2", Text: "Airline" }];
    cfi.AutoCompleteByDataSource("Issue", alphabettypes);
    
    $("#FromDate").val("");
    $("#ToDate").val("");

    cfi.AutoComplete("ULDNo", "ULDNumber", "vwULDTransfer", "ULDStockSNo", "ULDNumber", null, null, "contains");

    cfi.AutoComplete("Recd", "name", "vwAccountAgentForwarderAirline", "sno", "name", ["name"], null, "contains");

    cfi.AutoComplete("UCR", "UCRReceiptNo", "ULDTransferUCRTrans", "UCRReceiptNo", "UCRReceiptNo", null, null, "contains");



    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");


    $("input[id='Search'][name='Search']").click(function () {


        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var ULD = document.getElementById('ULDNo').value;
        var UCR = document.getElementById('UCR').value;
        var Rcd = document.getElementById('Recd').value;
        var Is = document.getElementById('Issue').value;


        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);

      
        if (ULD == "" && UCR == "" && Rcd == "" && Is == ""  && FromDate == "" && ToDate == "")
        {
            
            ShowMessage('warning', 'Information', "Kindly provide filter criteria to fetch data");

            return false;

        }
        else{
        if (FromDate != '' && FromDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            ULDOutGrid();
            }
        }


    });


    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        var FromDate = document.getElementById('FromDate').value;
        var ToDate = document.getElementById('ToDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);

        var ULD = document.getElementById('ULDNo').value;
        var UCR = document.getElementById('UCR').value;
        var Rcd = document.getElementById('Recd').value;
        var Is = document.getElementById('Issue').value;

        if (ULD == "" && UCR == "" && Rcd == "" && Is == ""  && FromDate == "" && ToDate == "")
            {
            ShowMessage('warning', 'Information', "Kindly provide filter criteria to fetch data");

            return false;

        }
        else {

            if (FromDate != '' && FromDate != '' && sDate > eDate) {
                ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

                return false;
            }

            else {
                SearchData();
            }
        }
       
    });
});




function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("Text_Recd") >= 0) {
       
      //  cfi.setFilter(filterEmbargo, "accounttypename", "eq", "1");
        cfi.setFilter(filterEmbargo, "accounttypename", "eq", $("#Text_Issue").data("kendoAutoComplete").key() == "" ? 3 : $("#Text_Issue").data("kendoAutoComplete").key());
            var filterULD = cfi.autoCompleteFilter(filterEmbargo);
            return filterULD;
       
    }  

}

function SearchData() {

    var Fdt = $("#FromDate").val();
    var Tdt = $("#ToDate").val();
    if (cfi.IsValidSubmitSection()) {
        var obj = {
            FromDt: $("#FromDate").val(),
            ToDt: $("#ToDate").val(),
            ULD: $("#ULD").val(),
            UCR:$("#UCR").val(),
            Issue: $("#Issue").val(),
            Recd:$("#Recd").val()
        }
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Report/ULDOutService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {

                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>ULD Transfer Report</td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                        "</td></tr><tr><td colspan='2' align='LEFT'>From " + Fdt + " To " + Tdt + "</td></tr></table> "



                    str += "<br/><table style='width:90%;'  border=\"1px\">";
                    str += "<tr ><td>ULD Nbr</td><td>UCR Nbr</td><td>Transferred  By</td><td>Issued To</td> <td>Received By</td><td>Issuance Date </td><td>Destination</td> <td>Updated By</td></tr>"

                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].ULDNo + "</td><td>" + response[i].UCRReceiptNo + "</td><td>" + response[i].TransfredBy + "</td><td>" + response[i].IssuedTo + "</td><td>" + response[i].ReceivedBy + "</td><td>'" + response[i].IssuanceDate + "</td><td>" + response[i].Destination
                            + "</td><td>" + response[i].UserName 
                            
                            + "</td></tr>"
                    }
                    str += "</table></html>";


                    var data_type = 'data:application/vnd.ms-excel'

                    var postfix = "ULD Transfer Report";
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


function ULDOutGrid() {
    if (cfi.IsValidSubmitSection()) {

        var FDate = $("#FromDate").val();
        var TDate = $("#ToDate").val();       
        var Issue = $("#Issue").val();
        var ULD = $('#ULDNo').val();
        var UCR = $("#UCR").val();
        var Recd = $("#Recd").val();

        var dbtableName = "ULDOut";




        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'ULDNo',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 500, whereCondition: '' + FDate +
                '*' + TDate + '*' + Issue + '*' + ULD +'*'+UCR +'*'+Recd + '', sort: '',
            servicePath: './Services/Report/ULDOutService.svc',
            getRecordServiceMethod: 'GetULDOutRecord',
            //createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
            // deleteServiceMethod: 'DeleteCargoRankingEI',
            caption: 'ULD Transfer Report',
            initRows: 1,
            columns: [
                 
                      { name: 'ULDNo', display: 'ULD Nbr', type: 'label', },
                      { name: 'UCRReceiptNo', display: 'UCR Nbr', type: 'label' },
                      { name: 'TransfredBy', display: 'Transferred  By', type: 'label' },
                      { name: 'IssuedTo', display: 'Issued To', type: 'label' },
                      { name: 'ReceivedBy', display: 'Received By', type: 'label' },
                      { name: 'IssuanceDate', display: 'Issuance Date', type: 'label' },                    
                      { name: 'Destination', display: 'Destination', type: 'label' },
                      { name: 'UserName', display: 'Updated By', type: 'label' }                      

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });

    }

}

