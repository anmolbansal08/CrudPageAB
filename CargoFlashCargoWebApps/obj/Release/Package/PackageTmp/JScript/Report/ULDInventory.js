/*
*****************************************************************************
Javascript Name:	ULDInventoryJS     
Purpose:		    This JS used to get autocomplete for ULD Inventory.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    17 Sept 2016
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
   
    $('#spntestspn').closest('td').next().html(' <input type="radio" tabindex="16" data-radioval="Summary" class="" name="ReportType" id="ReportType" value="1" checked="True">Summary<input type="radio" tabindex="16" data-radioval="Detail" class="" name="ReportType" id="ReportType" value="2" >Detail')

    $('#spntestspn').closest('td').next().show();

    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    $("input[id='Search'][name='Search']").click(function () {
        if ($("input:radio[name='ReportType']:checked").val() == "2" && $("#Airline").val()=="" )
        {
            ShowMessage('warning', 'Information', "Kindly provide Airline");

            return false;

        }else{
        ULDGrid();
        }
    });


    cfi.AutoComplete("Airline", "AirlineName", "Airline", "CarrierCode", "AirlineName", ["AirlineName"], null, "contains");


    cfi.AutoComplete("Type", "ULDType", "vuldtype", "ULDType", "ULDType", ["ULDType"], null, "contains");


    $("input[id='GenExcel'][name='GenExcel']").click(function () {
               
        if ($("input:radio[name='ReportType']:checked").val() == "2" && $("#Airline").val() == "") {
            ShowMessage('warning','Information', "Kindly provide Airline");

            return false;

        } else {
            SearchData();
        }

               
       
    });
});


function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("Text_Type") >= 0) {           
      
        cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#Text_Airline").data("kendoAutoComplete").key() == "" ? "TT" : $("#Text_Airline").data("kendoAutoComplete").key());
      
        var filterULD = cfi.autoCompleteFilter(filterEmbargo);
        return filterULD;

    }

}


function SearchData() {
    var rpt = $("input:radio[name='ReportType']:checked").val();
    var type = $("#Type").val();
    var airline = $("#Airline").val();
   

    if (cfi.IsValidSubmitSection()) {
        
            var obj = {
                Air: airline,
                Rpt: rpt,
                Type:type
            }

            var postfix = "";
            if (rpt == "1") {
                postfix = "Summary";
            }
            else {
                postfix = "Detail";
            }

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                url: "./Services/Report/ULDInventoryService.svc/SearchData",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.length > 0) {

                        var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >SHARJAH AVIATION SERVICES</td><td></td><td align=\"center\" style='width:50%;'>Airline ULD Inventory "+postfix+"</td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                            "</td></tr><tr><td colspan='2' align='LEFT'>&nbsp;</td></tr></table> "

                        str += "<br/><table style='width:90%;'  border=\"1px\">";
                        if (rpt == "1")
                            {
                        str += "<tr ><td>Airline</td><td>ULD Type </td><td>ULD Count</td></tr>"
                        }
                        else
                        {
                            str += "<tr ><td>Airline</td><td>ULD Type </td><td>ULD No</td></tr>"
                        }
                        for (var i = 0; i < response.length; i++) {
                            str += "<tr><td>" + response[i].Airline + "</td><td>" + response[i].ULDType + "</td><td>" + response[i].ULDNo 
                                + "</td></tr>"
                        }
                        str += "</table></html>";


                        var data_type = 'data:application/vnd.ms-excel'
                      


                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Airline ULD Inventory' + postfix + '.xls';
                        a.click();
                    }
                    else {
                        ShowMessage("info", "", "No Data Found...");
                    }
                }
            });        
    }
}


function ULDGrid() {
    if (cfi.IsValidSubmitSection()) {

        var rpt = $("input:radio[name='ReportType']:checked").val();
        var type = $("#Type").val();
        var airline = $("#Airline").val();
      
        if (rpt == "1")
            {
        var dbtableName = "ULDInventory";
        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'ULD',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 50000, whereCondition: '' + type +
                '*' + airline +'*'+ rpt+ '', sort: '',
            servicePath: './Services/Report/ULDInventoryService.svc',
            getRecordServiceMethod: 'GetULDInventoryRecord',               
            caption: "Airline ULD Inventory Summary",
            initRows: 1,
            columns: [
                 
                      { name: 'Airline', display: 'Airline', type: 'label', },
                      { name: 'ULDType', display: 'ULD Type', type: 'label' },
                      { name: 'ULDNo', display: 'ULD Count', type: 'label' }

            ],
            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            isPaging: true,
        });
        }
        else
        {
            var dbtableName = "ULDInventory";
            $('#tbl' + dbtableName).appendGrid({
                tableID: 'tbl' + dbtableName,
                contentEditable: true,
                isGetRecord: true,
                tableColume: 'ULD',
                masterTableSNo: 1,
                currentPage: 1, itemsPerPage: 50000, whereCondition: '' + type +
                  '*' + airline + '*' + rpt + '', sort: '',
                servicePath: './Services/Report/ULDInventoryService.svc',
                getRecordServiceMethod: 'GetULDInventoryRecord',               
                caption: "Airline ULD Inventory Detail",
                initRows: 1,
                columns: [
                      { name: 'Airline', display: 'Airline', type: 'label', },
                      { name: 'ULDType', display: 'ULD Type', type: 'label' },
                      { name: 'ULDNo', display: 'ULD No', type: 'label' }
                ],
                hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                isPaging: true,
            });
            
        }
    }

}

