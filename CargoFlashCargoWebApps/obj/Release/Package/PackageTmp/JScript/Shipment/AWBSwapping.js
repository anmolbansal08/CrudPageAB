/// <reference path="../../Services/Shipment/AWBSwappingService.svc" />
/// <reference path="../../Services/Shipment/AWBSwappingService.svc" />
/*
*****************************************************************************
Javascript Name:	AWB Swapping  
Purpose:		    
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Karan
Created On:		    28 Oct 2015
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/


$(document).ready(function () {
    //alert('load');
    $('#divAwbHeaderDetail').hide();
});


function SwapAWB() {
    var totalPieces = 0;
    var totalSwapPieces = 0;
    var totalgrwt = 0;
    var totalSwapgrwt = 0;
    var totalvolwt = 0;
    var totalSwapvolwt = 0;
    var lst = [];

    $("#tblAWBDetail tbody tr").each(function (i, e) {
        if ($(e).find('td:gt(0)').closest("tr").find("input[type=checkbox]").is(":checked")) {
            var r = {
                FPSno: $(e).find('td:gt(0)').closest("tr").find("input[type=checkbox]")[0].id.split('_')[1],
                FlightNo: $(e).find('td:gt(0)')[0].innerHTML,
                FlightDate: $(e).find('td:gt(0)')[1].innerHTML,
                Origin: $(e).find('td:gt(0)')[2].innerHTML,
                Dest: $(e).find('td:gt(0)')[3].innerHTML,
                Pieces:$(e).find('td:gt(0)').find("input[type=textbox]")[0].value,
                Grwt:$(e).find('td:gt(0)').find("input[type=textbox]")[1].value,
                VolWt:$(e).find('td:gt(0)').find("input[type=textbox]")[2].value,
                Status: $(e).find('td:gt(0)')[7].innerHTML,

            }
            totalPieces = totalPieces + $(e).find('td:gt(0)').find("input[type=textbox]")[0].value;
            totalgrwt = totalgrwt + $(e).find('td:gt(0)').find("input[type=textbox]")[1].value;
            totalvolwt = totalvolwt + $(e).find('td:gt(0)').find("input[type=textbox]")[2].value;
            lst.push(r);
        }
    });

    var lstSwapAWB = [];
    $("#tblSwapAWBDetail tbody tr").each(function (i, e) {
        if ($(e).find('td:gt(0)').closest("tr").find("input[type=checkbox]").is(":checked")) {
            var r = {
                FPSno: $(e).find('td:gt(0)').closest("tr").find("input[type=checkbox]")[0].id.split('_')[1],
                FlightNo: $(e).find('td:gt(0)')[0].innerHTML,
                FlightDate: $(e).find('td:gt(0)')[1].innerHTML,
                Origin: $(e).find('td:gt(0)')[2].innerHTML,
                Dest: $(e).find('td:gt(0)')[3].innerHTML,
                Pieces:$(e).find('td:gt(0)').find("input[type=textbox]")[0].value,
                Grwt:$(e).find('td:gt(0)').find("input[type=textbox]")[1].value,
                VolWt:$(e).find('td:gt(0)').find("input[type=textbox]")[2].value,
                Status: $(e).find('td:gt(0)')[7].innerHTML,
            }
            totalSwapPieces = totalSwapPieces + $(e).find('td:gt(0)').find("input[type=textbox]")[0].value;
            totalSwapgrwt = totalSwapgrwt + $(e).find('td:gt(0)').find("input[type=textbox]")[1].value;
            totalSwapvolwt = totalSwapvolwt + $(e).find('td:gt(0)').find("input[type=textbox]")[2].value;
            lstSwapAWB.push(r);
        }     
    });

    //if (totalPieces != totalSwapPieces ) {
    //    ShowMessage('warning', 'warning!', 'AWB Pieces And Swap Pieces Should be Equal.!');
    //    return true;
    //}
    //if (totalgrwt != totalSwapgrwt) {
    //    ShowMessage('warning', 'warning!', 'AWB GrossWt. And Swap GrossWt. Should be Equal.!');
    //    return true;
    //}
    //if (totalvolwt != totalSwapvolwt) {
    //    ShowMessage('warning', 'warning!', 'AWB VolWt. And Swap VolWt. Should be Equal.!');
    //    return true;
    //}
    if (lst.length > 0 && lstSwapAWB.length>0) {
        var AWBList = JSON.stringify(lst);
        var SwapAWBList = JSON.stringify(lstSwapAWB);

        $.ajax({
            url: "./Services/Shipment/AWBSwappingService.svc/AWBSwap",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBList: AWBList, SwapAWBList: SwapAWBList }),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (eval(data) == 2003) {
                    BindAWBSwap();
                    ShowMessage('success', 'Success!', 'AWM Swapped Successfully');

                }
                else 
                    ShowMessage('error', 'Need your Kind Attention!', 'AWM Swapped Error.');
            },
            error: function (ex) {
             
            }
        });
    }


}

function getchkval(id) {  
    var rowindex = id.split('_')[1];


    if ($('#' + id)[0].checked) {
        $('#txtSwapPieces_' + rowindex).prop("disabled", false);
        $('#txtSwapvolumewt_' + rowindex).prop("disabled", false);
        $('#txtSwapgrosswt_' + rowindex).prop("disabled", false);

       
    } else {
        $('#txtSwapPieces_' + rowindex).prop("disabled", true);
        $('#txtSwapvolumewt_' + rowindex).prop("disabled", true);
        $('#txtSwapgrosswt_' + rowindex).prop("disabled", true);
      
    }

}

function getAWBchkval(id) {
    var rowindex = id.split('_')[1];


    if ($('#' + id)[0].checked) {
        $('#txtPieces_' + rowindex).prop("disabled", false);
        $('#txtvolumewt_' + rowindex).prop("disabled", false);
        $('#txtgrosswt_' + rowindex).prop("disabled", false);


    } else {
        $('#txtPieces_' + rowindex).prop("disabled", true);
        $('#txtvolumewt_' + rowindex).prop("disabled", true);
        $('#txtgrosswt_' + rowindex).prop("disabled", true);

    }

}
function BindAWBSwap() {

    var AWBno = $('#txtAwbNo').val();
    var SwapAWB = $('#txtSwapAwbNo').val();
  
    $.ajax({
        url: "./Services/Shipment/AWBSwappingService.svc/BindAWBSwap",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AWBNO: AWBno, SwapAWBNO: SwapAWB },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            var myData = jQuery.parseJSON(result);
        


            if (myData.Table0.length > 0) {
                $('#divAwbHeaderDetail').show();

                $('#AgentName').html(myData.Table0[0].AgentName);
                $('#AwbDate').html(myData.Table0[0].AwbDate);
                $('#Origin').html(myData.Table0[0].OriginAirportCode);
                $('#Destination').html(myData.Table0[0].DestinationAirportCode);
                $('#Pieces').html(myData.Table0[0].TotalPieces);
                $('#GrossWt').html(myData.Table0[0].TotalGrossWeight);
                $('#VolumeWt').html(myData.Table0[0].TotalVolumeWeight);
                $('#AWBNo').html(myData.Table0[0].AWBNo);
               
            }
            if (myData.Table1.length > 0) {
                $('#SwapAgentName').html(myData.Table1[0].AgentName);
                $('#SwapAwbDate').html(myData.Table1[0].AwbDate);
                $('#SwapOrigin').html(myData.Table1[0].OriginAirportCode);
                $('#SwapDestination').html(myData.Table1[0].DestinationAirportCode);
                $('#SwapPieces').html(myData.Table1[0].TotalPieces);
                $('#SwapGrossWt').html(myData.Table1[0].TotalGrossWeight);
                $('#SwapVolumeWt').html(myData.Table1[0].TotalVolumeWeight);
                $('#SwapAWBNo').html(myData.Table1[0].AWBNo);
             
            }


            //if (result.substring(1, 2) == "{") {
            //    var myData = jQuery.parseJSON(result);

            if (myData.Table2.length > 0) {
                var genHtml = "<table class='appendGrid ui-widget' id='tblAWBDetail'><thead class='ui-widget-header'><tr><td></td><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Flight Date</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>Dest</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol. Wt.</td><td class='ui-widget-header'>Status</td><td class='ui-widget-header'>Commodity</td></tr></thead><tbody class='ui-widget-content'>";
                //    var listrecord = '';
                for (var num = 0; num < myData.Table2.length; num++) {
                    genHtml = genHtml + "<tr id='tblSPHCSubClass_Row_" + myData.Table2[num].Sno + "'><td><input name='chkselectAWB_" + myData.Table2[num].Sno + "' id='chkselectAWB_" + myData.Table2[num].Sno + "' type='checkbox' value='" + myData.Table2[num].Sno + "' onchange='getAWBchkval(this.id)' ></td><td  class='ui-widget-content' colspan='1'>" + myData.Table2[num].Flightno + "</td><td class='ui-widget-content' colspan='1' >" + myData.Table2[num].FlightDate + "</td><td class='ui-widget-content' colspan='1' >" + myData.Table2[num].OriginAirportCode + "</td><td class='ui-widget-content' colspan='1' >" + myData.Table2[num].DestinationAirportCode + "</td><td class='ui-widget-content' colspan='1' ><input name='txtPieces_" + myData.Table2[num].Sno + "'  type='textbox' value='" + myData.Table2[num].Pieces + "' style='width:50px' disabled='disabled' id='txtPieces_" + myData.Table2[num].Sno + "' /></td><td class='ui-widget-content' colspan='1'><input name='txtgrosswt_" + myData.Table2[num].Sno + "'  id='txtgrosswt_" + myData.Table2[num].Sno + "' type='textbox' value='" + myData.Table2[num].GrossWeight + "' style='width:50px'  disabled='disabled'   /></td><td class='ui-widget-content' colspan='1' ><input name='txtvolumewt_" + myData.Table2[num].Sno + "' id='txtvolumewt_" + myData.Table2[num].Sno + "' type='textbox' value='" + myData.Table2[num].VolumeWeight + "' style='width:50px'  disabled='disabled'   /></td><td class='ui-widget-content' colspan='1' >" + myData.Table2[num].StatusCode + "</td><td class='ui-widget-content' colspan='1' >" + myData.Table2[num].CommodityCode + "</td></tr>";
                }
                genHtml = genHtml + "</tbody></table></span>";
                $("#spnAWBDetail").html('');
                $("#spnAWBDetail").html(genHtml);
            }
            if (myData.Table3.length > 0) {

                var genSwapHtml = "<table class='appendGrid ui-widget' id='tblSwapAWBDetail'><thead class='ui-widget-header'><tr><td></td><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Flight Date</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>Dest</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol. Wt.</td><td class='ui-widget-header'>Status</td><td class='ui-widget-header'>Commodity</td></tr></thead><tbody class='ui-widget-content'>";
                //    var listrecord = '';
                for (var num = 0; num < myData.Table3.length; num++) {
                    genSwapHtml = genSwapHtml + "<tr id='tblSPHCSubClass_Row_" + myData.Table3[num].Sno + "'><td><input name='chkselectSwapAWB_" + myData.Table3[num].Sno + "' id='chkselectSwapAWB_" + myData.Table3[num].Sno + "' type='checkbox' value='0' onchange='getchkval(this.id)' ></td><td  class='ui-widget-content' colspan='1'>" + myData.Table3[num].Flightno + "</td><td class='ui-widget-content' colspan='1' >" + myData.Table3[num].FlightDate + "</td><td class='ui-widget-content' colspan='1' >" + myData.Table3[num].OriginAirportCode + "</td><td class='ui-widget-content' colspan='1' >" + myData.Table3[num].DestinationAirportCode + "</td><td class='ui-widget-content' colspan='1' ><input name='txtSwapPieces_" + myData.Table3[num].Sno + "' id='txtSwapPieces_" + myData.Table3[num].Sno + "' type='textbox'  disabled='disabled'   value='" + myData.Table3[num].Pieces + "' style='width:50px' /></td><td class='ui-widget-content' colspan='1' ><input name='txtSwapgrosswt_" + myData.Table3[num].Sno + "' id='txtSwapgrosswt_" + myData.Table3[num].Sno + "' type='textbox'  disabled='disabled'   value='" + myData.Table3[num].GrossWeight + "' style='width:50px' /></td><td class='ui-widget-content' colspan='1' ><input name='txtSwapvolumewt_" + myData.Table3[num].Sno + "' id='txtSwapvolumewt_" + myData.Table3[num].Sno + "'  disabled='disabled'    type='textbox' value='" + myData.Table3[num].VolumeWeight + "' style='width:50px' /></td><td class='ui-widget-content' colspan='1' >" + myData.Table3[num].StatusCode + "</td><td class='ui-widget-content' colspan='1'>" + myData.Table3[num].CommodityCode + "</td></tr>";
                }
                genSwapHtml = genSwapHtml + "</tbody></table></span>";
                $("#spnSwapAWBDetail").html('');
                $("#spnSwapAWBDetail").html(genSwapHtml);
            }
            return false
        },

        error: function (xhr) {
            var a = "";
        }
    });

}