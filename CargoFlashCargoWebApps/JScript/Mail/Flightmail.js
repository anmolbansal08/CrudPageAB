$(document).ready(function () {
   
    Itinerary();

    $("#btnNew").bind("click", function () {
        alert("1");
        
    });
});


function Itinerary() {
    $('#__divairmaildetails__').append(
        
        '<table id="tblItinerary" border="1" cellspacing="0" cellpadding="0" style="width: 100%; margin: 0px; padding: 0px;">'+
                                        '<tr><td class="formSection" colspan="6">Itinerary : </td></tr>'+
    '<tr><td colspan="6"><table width="100%">'+
                '<tr><td><label>Origin Airport :</label><input type="hidden" name="ItineraryOrigin" id="ItineraryOrigin" value=""><input type="text" class="" name="Text_ItineraryOrigin" id="Text_ItineraryOrigin" tabindex="101" controltype="autocomplete" maxlength="50" value="" placeholder="Origin Airport" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">'+
                    '</td>'+
                    '<td>'+
                       ' <label>Destination Airport :</label>'+
                       ' <input type="hidden" name="ItineraryDestination" id="ItineraryDestination" value="">'+
                       ' <input type="text" class="" name="Text_ItineraryDestination" id="Text_ItineraryDestination" tabindex="102" controltype="autocomplete" maxlength="50" value="" placeholder="Destination Airport" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">'+
                   ' </td>'+
                    
                   
                   ' <td>'+
                    '    <label>Carrier Code :</label>'+
                     '   <input type="hidden" name="ItineraryCarrierCode" id="ItineraryCarrierCode" value="">'+
                     '   <input type="text" class="" name="Text_ItineraryCarrierCode" id="Text_ItineraryCarrierCode" tabindex="103" controltype="autocomplete" maxlength="50" value="" placeholder="Carrier Code" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">'+
                    '</td>'+
                   ' <td>'+
                        '<label>Flight No. :</label>'+
                        '<input type="hidden" name="ItineraryFlightNo" id="ItineraryFlightNo" value="">'+
                       ' <input type="text" class="" name="Text_ItineraryFlightNo" id="Text_ItineraryFlightNo" tabindex="104" controltype="autocomplete" maxlength="50" value="" placeholder="Flight No" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">'+
                    '</td>'+
    '<td>'+
                       
                       
                       ' <label>Date :</label>'+
                        '<span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 100px;">'+
                          '  <input type="text" class="k-input k-state-default" name="ItineraryDate" id="ItineraryDate" style="color: rgb(0, 0, 0);" tabindex="105" controltype="datetype" value="" data-role="datepicker">'+
                           ' <span unselectable="on" class="k-select">'+
                             '   <span unselectable="on" class="k-icon k-i-calendar">select</span>'+
                           ' </span>'+
                       ' </span>'+
                       
                   ' </td>'+
                   ' <td>'+
                     '   <label>Pieces :</label>'+
                      '  <input type="text" class="" name="ItineraryPieces" id="ItineraryPieces" style="width: 50px;" placeholder="Pieces" controltype="number" data-valid="min[1]" data-valid-msg="Enter Pieces" tabindex="106" maxlength="5" value="" placeholder="" data-role="numerictextbox">'+
                    '</td>'+
                   ' <td>'+
                      '  <label>Gr. Wt. :</label>'+
                      '  <input type="text" class="" name="ItineraryGrossWeight" id="ItineraryGrossWeight" style="width: 50px;" placeholder="Gr. Wt." controltype="decimal2" data-valid="min[1.00]" data-valid-msg="Enter Gross Weight" tabindex="107" maxlength="7" value="" placeholder="" data-role="numerictextbox">&nbsp;'+
                    '</td>'+
    '<td>'+
                     '   <label>Vol.(CBM) :</label>'+
                     '   <input type="text" class="" name="ItineraryVolumeWeight" id="ItineraryVolumeWeight" style="width: 50px;" placeholder="Vol. Wt." controltype="decimal3" data-valid="min[0.001]" data-valid-msg="Enter Volume (CBM)" tabindex="108" maxlength="8" value="" placeholder="" data-role="numerictextbox">'+
    ' </td>'+
                  '  <td>'+
                   '     <label>Routing Complete :</label>'+
                    '    <input type="checkbox" tabindex="109" class="" name="chkIsRoutingComplete" id="chkIsRoutingComplete">'+
                      
                   ' </td>'+
                  '  <td>'+
                      '  <label>MCT :</label>'+
                      '  <input type="checkbox" tabindex="110" class="" name="chkOverrideConnectionTime" id=" chkOverrideConnectionTime">'+
                      '  <span id="spnOverrideConnectionTime"></span>'+
                    '</td>'+
                '</tr>'+
               ' <tr>'+
                    '<td class="formSection" style="text-align: left; white-space: nowrap;" colspan="12">'+
                       ' <input type="submit" name="ItineraryViewRoute" id="ItineraryViewRoute" tabindex="111" onclick="ViewRoute();" value="View Route" class="btn btn-block btn-primary">'+
                       ' <input type="submit" name="ItinerarySearch" id="ItinerarySearch" tabindex="112" onclick="SearchFlight();" value="Search" class="btn btn-block btn-primary">'+
                       ' <input type="submit" name="btnClearItineraryRoute" id="btnClearItineraryRoute" tabindex="112" onclick="ClearItineraryRoute();" value="Clear Itinerary Route" class="btn btn-block btn-primary">'+
                      
                   ' </td>'+
               ' </tr>'+
            '</table>'+
       ' </td>'+
    '</tr>'+
'</table>'
    );
}
