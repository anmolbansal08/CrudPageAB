$(document).ready(function () {
  
    cfi.ValidateForm();
    var check = "";  // Distance_OriginAirportSNo
    //cfi.AutoComplete("OriginAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode");
    //cfi.AutoComplete("DestinationAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode");
    cfi.AutoCompleteV2("OriginAirportSNo", "AirportCode", "Distance_OriginAirportSNo",null);
    cfi.AutoCompleteV2("DestinationAirportSNo", "AirportCode", "Distance_OriginAirportSNo",null);
   // $('#TDistance').after($('<input/>').attr({ type: 'button', name: 'rad', value: 'CLICK' }));
    //var data = {
    //    'Country': 'India', 'Country1': 'USA', 'Country2': 'Australia',
    //    'Country3': 'Srilanka'
    //};
 
    //var s = $('<select />');
    //for (var val in data) {
    //    $('<option />', { value: val, text: data[val] } ).appendTo(s);
    //}
  
    //$('#TDistance').after("   " ,s.appendTo('#TDistance'));

});

function ExtraCondition(textId)
{
    var f = cfi.getFilter("AND");

    if (textId.indexOf("OriginAirportSNo") >= 0 || (textId.indexOf("DestinationAirportSNo") >= 0)) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "DestinationAirportSNo").replace("Text_DestinationAirportSNo", "OriginAirportSNo")).val());
}
  
    return cfi.autoCompleteFilter([f]);
}

if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW")
{
   $('#TDistance').after(" (Nms)");
 
   
}

$('input[type="submit"][name="operation"]').click(function () {
    if ($('#TDistance').val() == 0)
        {
        ShowMessage('warning', 'Warning-Distance', "Distance Cannot Be Zero");
        return false;
    }

});