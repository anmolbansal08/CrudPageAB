
/*
*****************************************************************************
Javascript Name:	ExportImportJS     
Purpose:		    This JS used to get autocomplete for Export Import
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Swati Rastogi
Created On:		    06 July 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(document).ready(function () {

    $('#spntestspn').closest('td').next().html(' <input type="radio" tabindex="16" data-radioval="Airline" class="" name="OwnerType" id="OwnerType" value="1" checked="True">Airline<input type="radio" tabindex="16" data-radioval="Agent" class="" name="OwnerType" id="OwnerType" value="0" >Agent<input type="radio" tabindex="16" data-radioval="Self" class="" name="OwnerType" id="OwnerType" value="2">Self')

    $('#spntestspn').closest('tr').next().show();
    //$('#spnGenExcel').closest('tr').prev().hide();    


    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    cfi.AutoCompleteV2("Agent", "Name", "Consume_Name", null, "contains");
    cfi.AutoCompleteV2("Airline", "AirlineName", "Consume_AirlineName", null, "contains");
    cfi.AutoCompleteV2("CItem", "Item", "Consume_Item", null, "contains");

    cfi.ValidateForm();

  
    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();
   

  
    $("input[id='Search'][name='Search']").click(function () {

        Search();
      

    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {
        
        SearchData();


    });

   // $('#spntspn').closest('tr').prev().hide();
    $('#spnSearch').closest('tr').prev().show();
    $('#spntspn').closest('tr').prev().hide();

    $("input:radio[name='OwnerType']").on("change", function () {
        if ($("input:radio[name='OwnerType']:checked").val() == "0") {

            $('#spnSearch').closest('tr').prev().hide();
            $('#spntspn').closest('tr').prev().show();
          
        }

        else if ($("input:radio[name='OwnerType']:checked").val() == "1") {
          
            $('#spnSearch').closest('tr').prev().show();
            $('#spntspn').closest('tr').prev().hide();

        }
        else if ($("input:radio[name='OwnerType']:checked").val() == "2") {
            $('#spntspn').closest('tr').prev().hide();
            $('#spnSearch').closest('tr').prev().hide();
        }
        

    });
    
});


function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("Text_CItem") >= 0) {

        
       
        if ($("#Text_Agent").data("kendoAutoComplete").key() !="")
            {
       cfi.setFilter(filterEmbargo, "itemsno", "eq", $("#Text_Agent").data("kendoAutoComplete").key() );
        }
        if ($("#Text_Airline").data("kendoAutoComplete").key() != "") {
            cfi.setFilter(filterEmbargo, "itemsno", "eq", $("#Text_Airline").data("kendoAutoComplete").key());
        }
        if ($("#Text_Agent").data("kendoAutoComplete").key() == "" && $("#Text_Airline").data("kendoAutoComplete").key() !== "")
        {
            cfi.setFilter(filterEmbargo, "owner", "eq", $("input:radio[name='OwnerType']:checked").val() == "" ? 3 : $("input:radio[name='OwnerType']:checked").val());
        }
        var filterULD = cfi.autoCompleteFilter(filterEmbargo);
        return filterULD;

    }

}

function Search() {
    if (cfi.IsValidSubmitSection()) {

      
        //var rpt = $("input:radio[name='OwnerType']:checked").val();
        //var agent = $("#Agent").val();
        //var airline = $("#Airline").val();
        //var citem = $("#CItem").val();


        var dbtableName = "Consume";

        $('#tbl' + dbtableName).appendGrid({
            V2:true,
                tableID: 'tbl' + dbtableName,
                contentEditable: true,
                isGetRecord: true,
                tableColume: 'Consume',
                masterTableSNo: 1,
                //currentPage: 1, itemsPerPage: 50, whereCondition: '' + rpt +
                //    '*' + agent + '*' + airline + '*' + citem + '', 
                currentPage: 1, itemsPerPage: 50, model: BindWhereCondition(),
                sort: '',
                servicePath: './Services/Report/ConsumeService.svc',
                getRecordServiceMethod: 'GetConsumeRecord',
                //createUpdateServiceMethod: 'CreateUpdateCargoRankingEI',
                // deleteServiceMethod: 'DeleteCargoRankingEI',
                caption: 'Consumable Utilization Report',
                initRows: 1,
                columns: [
                        //  { name: 'SNo', type: 'hidden', value: '0' },
                         { name: 'Owner', display: 'Owner', type: 'label' },
                          { name: 'Item', display: 'Item', type: 'label', },
                          { name: 'City', display: 'City', type: 'label' },
                          //{ name: 'Ownertype', display: 'Owner Type', type: 'label' },
                          { name: 'Consumble', display: 'Consumable Item', type: 'label' },
                           { name: 'ULDOut', display: 'ULD Out', type: 'label' },
                          { name: 'ULDStack', display: 'ULD Stack', type: 'label' },
                          { name: 'BuildUp', display: 'BuildUp-ULD', type: 'label' },
                          
                            { name: 'Balance', display: 'Balance Item', type: 'label' }


                ],
                hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                isPaging: true,
            });
        
    }

}

function SearchData() {

   
    if (cfi.IsValidSubmitSection()) {
        
            var obj = {
               
         Rpt : $("input:radio[name='OwnerType']:checked").val(),
         Agt: $("#Agent").val(),
         Air: $("#Airline").val(),
         CItem: $("#CItem").val()
            }
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                url: "./Services/Report/ConsumeService.svc/SearchData",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.length > 0) {
                        //Replaced Sharjah Avition Services To Garuda Airlines on 12-07-2017  By RAHUL KUMAR SINGH
                        var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >GARUDA AIRLINES</td><td></td><td align=\"center\" style='width:50%;'>Consumable Utilization Report</td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                            "</td></tr><tr><td colspan='2' align='LEFT'>&nbsp;</td></tr></table> "

                        str += "<br/><table style='width:90%;'  border=\"1px\">";
                        str += "<tr ><td>Owner<td>Item</td><td>City </td><td>Consumable Item</td><td>ULD Out</td><td>ULD Stack</td><td>BuildUp-ULD</td><td>Balance Item</td></tr>"

                        for (var i = 0; i < response.length; i++) {
                            str += "<tr><td>" + response[i].Owner + "</td><td>" + response[i].Item + "</td><td>" + response[i].City + "</td><td>" + response[i].Consumble + "</td><td>" + response[i].ULDOut
                                 + "</td><td>" + response[i].ULDStack + "</td><td>" + response[i].BuildUp
                                + "</td><td>" + response[i].Balance
                                + "</td></tr>"
                        }
                        str += "</table></html>";


                        var data_type = 'data:application/vnd.ms-excel'

                        var postfix = "Consumable Utilization Report";
                        var a = document.createElement('a');
                        a.href = data_type + ' , ' + encodeURIComponent(str);
                        a.download = 'Consumable Utilization Report.xls';
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
     rpt : $("input:radio[name='OwnerType']:checked").val(),
     agent : $("#Agent").val(),
     airline : $("#Airline").val(),
     citem : $("#CItem").val(),

    }


   
}