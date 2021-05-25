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
        //if ($("input:radio[name='ReportType']:checked").val() == "2" ) {
        //    ShowMessage('warning', 'Information', "Kindly provide Airline");

        //    return false;

        //} else 

        ULDGrid();

    });
    cfi.AutoCompleteV2("AirportCode", "AirportCode,AirportName", "Airline_AirportCode", null, "contains");
    cfi.AutoCompleteV2("AirlineName", "CarrierCode,AirlineName", "ULD_ChargeAirlineName", null, "contains");

    cfi.AutoCompleteV2("OwnerCode", "OwnerCode,Airline", "ULD_ULDInventory", null, "contains");

    cfi.AutoCompleteV2("Type", "ULDType", "ULDInventory_ULDType", onSelectType, "contains");
    cfi.AutoCompleteV2("ULDNumber", "ULDNo", "ULDInventory_ULDNumber", null, "contains", ",");

    $('#AirportCode').val(userContext.AirportSNo);
    $('#Text_AirportCode').val(userContext.AirportCode + '-' + userContext.AirportName);


    $("#AirlineName").val(userContext.AirlineSNo)
    $("#Text_AirlineName").val(userContext.AirlineCarrierCode)

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        //if ($("input:radio[name='ReportType']:checked").val() == "2" && $("#Airline").val() == "") {
        //    ShowMessage('warning', 'Information', "Kindly provide Airline");

        //    return false;

        //} else 
        // {
        SearchData();
        //}



    });
});

function onSelectType() {

    if ($("#Text_Type").val() == "") {
        $("#divMultiULDNumber ul").html("");
        $("#ULDNumber").val("");
        $("#Multi_ULDNumber").val("");
        $("#FieldKeyValuesULDNumber").val("");
        $("#divMultiULDNumber ul").append('<li class="k-button" style="display:none;margin-bottom:10px !important;"><input type="hidden" id="Multi_UldNumber" name="Multi_UldNumber" value=""><span style="display:none;" id="FieldKeyValuesUldNumber" name="FieldKeyValuesUldNumber"></span></li>');
    }
}
//function ExtraCondition(textId) {

//    var filterEmbargo = cfi.getFilter("AND");
//    if (textId.indexOf("Text_Type") >= 0) {

//        cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#Text_Airline").data("kendoAutoComplete").key() == "" ? "TT" : $("#Text_Airline").data("kendoAutoComplete").key());

//        var filterULD = cfi.autoCompleteFilter(filterEmbargo);
//        return filterULD;

//    }

//    if (textId == "Text_AirportCode") {
//        try {
//            cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_CountryName").data("kendoAutoComplete").key())
//            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
//            return OriginCityAutoCompleteFilter2;
//        }
//        catch (exp)
//        { }
//    }




//}


function SearchData() {
    var rpt = $("input:radio[name='ReportType']:checked").val();
    var type = $("#Type").val();
    // var airline = $("#Airline").val();
    var Aircode = $("#AirportCode").val() || 0;
    var Ocode = $("#OwnerCode").val();
    var UldNumber = $("#Multi_ULDNumber").val() == "" ? "" : $("#Multi_ULDNumber").val();

    if (cfi.IsValidSubmitSection()) {

        var obj = {
            Rpt: rpt,
            Type: type,
            Airportcode: Aircode,
            ownercode: Ocode,
            ULDNumber: UldNumber

        }

        var postfix = "";
        if (rpt == "1") {
            postfix = "Summary";
        }
        else {
            postfix = "Detail";
        }
        // var AirlineName = $("#Text_Airline").val()
        var AirlineName = userContext.AirlineCarrierCode;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Report/ULDInventoryService.svc/SearchData",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.length > 0) {

                    var str = "<html><table  style='width:90%;'><tr><td align=\"left\" style='width:30%;' >" + AirlineName + "</td><td></td><td align=\"center\" style='width:50%;'>Airline ULD Inventory " + postfix + "</td><td align=\"right\" style='width:20%;'>Date : " + response[0].Dt +
                        "</td></tr><tr><td colspan='2' align='LEFT'>&nbsp;</td></tr></table> "

                    str += "<br/><table style='width:90%;'  border=\"1px\">";
                    if (rpt == "1") {
                        str += "<tr ><td>Airline</td><td>ULD Type </td><td>ULD Count</td></tr>"
                        for (var i = 0; i < response.length; i++) {
                            str += "<tr><td>" + response[i].Airline + "</td><td>" + response[i].ULDType + "</td><td>" + response[i].ULDNo
                                + "</td></tr>"
                        }
                    }
                    else {
                        str += "<tr ><td>Airline</td><td>ULD Type </td><td>ULD No</td><td>Current City</td><td>Last Flight No.</td><td>Last Flight Date</td><td>Content</td></tr>"
                        for (var i = 0; i < response.length; i++) {
                            str += "<tr><td>" + response[i].Airline + "</td><td>" + response[i].ULDType + "</td><td>" + response[i].ULDNo
                                + "</td><td>" + response[i].CurrentCity
                                + "</td><td>" + response[i].FlightNo
                                + "</td><td>" + response[i].FlightDate
                                + "</td><td>" + response[i].ContentType
                                + "</td></tr>"
                        }
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

        if (rpt == "1") {
            var dbtableName = "ULDInventory";
            $('#tbl' + dbtableName).appendGrid({
                V2: true,
                tableID: 'tbl' + dbtableName,
                contentEditable: true,
                isGetRecord: true,
                tableColume: 'ULD',
                masterTableSNo: 1,
                currentPage: 1, itemsPerPage: 50000, model: BindWhereCondition(), sort: '',
                servicePath: './Services/Report/ULDInventoryService.svc',
                getRecordServiceMethod: 'GetULDInventoryRecord',
                caption: "Airline ULD Inventory Summary",
                initRows: 1,
                columns: [

                          { name: 'Airline', display: 'Airline', type: 'label', },
                          { name: 'ULDType', display: 'ULD Type', type: 'label' },
                          { name: 'ULDNo', display: 'ULD Count', type: 'label' },


                ],
                hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                isPaging: true,
            });
        }
        else {
            var dbtableName = "ULDInventory";
            $('#tbl' + dbtableName).appendGrid({
                V2: true,
                tableID: 'tbl' + dbtableName,
                contentEditable: true,
                isGetRecord: true,
                tableColume: 'ULD',
                masterTableSNo: 1,
                currentPage: 1, itemsPerPage: 50000, model: BindWhereCondition(), sort: '',
                servicePath: './Services/Report/ULDInventoryService.svc',
                getRecordServiceMethod: 'GetULDInventoryRecord',
                caption: "Airline ULD Inventory Detail",
                initRows: 1,
                columns: [
                      { name: 'Airline', display: 'Airline', type: 'label', },
                      { name: 'ULDType', display: 'ULD Type', type: 'label' },
                      { name: 'ULDNo', display: 'ULD No', type: 'label' },
                      { name: 'CurrentCity', display: 'Current City', type: 'label' },
                      { name: 'CurrentAirPort', display: 'Current Airport', type: 'label' },
                      { name: 'FlightNo', display: 'Last Flight No', type: 'label' },
                      { name: 'FlightDate', display: 'Last Flight Date', type: 'label' },
                      { name: 'ContentType', display: 'Content', type: 'label' },
                     { name: 'MovementStatus', display: 'Movement Status', type: 'label' }
                ],
                hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
                isPaging: true,
            });

        }
    }

}

function BindWhereCondition() {
    if (cfi.IsValidSubmitSection()) {
        return {
            rpt: $("input:radio[name='ReportType']:checked").val(),
            Type: $("#Type").val(),
            Airportcode: $("#AirportCode").val() || 0,
            ownercode: $("#OwnerCode").val(),
            ULDNumber: $("#Multi_ULDNumber").val(),
            AirlineN: $("#AirlineName").val()

        };
    }
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_ULDNumber") {
        cfi.setFilter(filter, "ULDType", "eq", $("#Text_Type").val())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }
}