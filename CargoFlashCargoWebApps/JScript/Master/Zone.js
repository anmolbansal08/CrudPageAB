var zone = [{ Key: "-1", Text: "Select" }];
var zoneArea = [{ Key: "0", Text: "Region" }, { Key: "1", Text: "Country" }, { Key: "2", Text: "City" }, { Key: "3", Text: "Airport" }];

$(document).ready(function () {
   
    /// Method Have been added to Bind  ZoneTrans Details Added By Vsingh Task-57 on 12/01/2017
    var aa=$('#ZoneBasedOn').val();
    if (aa == "") {

        /// added to Clear Zone DropDown Clear On load  Added By Vsingh Task-57 on 12/01/2017
        cfi.AutoCompleteByDataSource("ZoneBasedOnSNo", null);
        cfi.EnableAutoComplete("ZoneBasedOnSNo", false, true, "grey");

    }
    else
    {
        //if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT") || (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE"))
        //{
              BindAutoComplete(); 
            cfi.BindMultiValue("ZoneBasedOnSNo", $("#Text_ZoneBasedOnSNo").val(), $("#ZoneBasedOnSNo").val());
        //}
    }

    cfi.AutoCompleteByDataSource("ZoneBasedOn", zoneArea, getZone);  
});
/// Method Have been added to Bind  ZoneTrans Details Added By Vsingh Task-57 on 12/01/2017   //$('#Text_ZoneBasedOnSNo').next("span").remove();

function getZone()
{
    $('#divMultiZoneBasedOnSNo').remove();
    $('#Text_ZoneBasedOnSNo').nextAll("span").remove();
    BindAutoComplete();
    //
    //$('#Text_ZoneBasedOnSNo').after('<span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span>');
   // <span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span>
    $('#spnZoneBasedOnSNo').text(' ' + $('#Text_ZoneBasedOn').val());
}
/// Method Have been added to  Bind  ZoneTrans Details Added By Vsingh Task-57 on 12/01/2017



function resetzonelevel()
{
    //ShowMessage('warning', 'Warning-Message', "Please Select Zone Level First");
   // cfi.ResetAutoComplete("#ZoneBasedOnSNo");
}


/// Method Have been added to Bind  ZoneTrans Details Added By Vsingh Task-57 on 12/01/2017
function BindAutoComplete()
{
    cfi.EnableAutoComplete("ZoneBasedOnSNo", true, true, "grey");
    var Zonearea = $('#ZoneBasedOn').val();
    if (Zonearea == 0) {
        cfi.AutoCompleteV2("ZoneBasedOnSNo", "RegionName", "Master_Zone_RegionName", null, "contains", ",");
    }
    else if (Zonearea == 1) {
        
        //cfi.AutoComplete("ZoneBasedOnSNo", "CountryName", "Country", "SNo", "CountryName", null, null, "contains", ",");
        cfi.AutoCompleteV2("ZoneBasedOnSNo", "CountryCode,CountryName", "Master_Zone_CountryName", null, "contains", ",");
    }
    else if (Zonearea == 2) {
       // cfi.AutoComplete("ZoneBasedOnSNo", "CityName", "City", "SNo", "CityName", null, null, "contains", ",");
        cfi.AutoCompleteV2("ZoneBasedOnSNo", "CityCode,CityName", "Master_Zone_CityName", null, "contains", ",");
    }
    else if (Zonearea == 3) {
       // cfi.AutoComplete("ZoneBasedOnSNo", "AirportName", "Airport", "SNo", "AirportName", null, null, "contains", ",");
        cfi.AutoCompleteV2("ZoneBasedOnSNo", "AirportCode,AirportName", "Master_Zone_AirportName", null, "contains", ",");
    }
}

/// Method Have been added to Bind  ZoneTrans Details Added By Vsingh Task-57 on 12/01/2017
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    $('#spnZoneBasedOnSNo').text(' ' + $('#Text_ZoneBasedOn').val());
}
if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
    $('#spnZone').text(' ' + $('#ZoneLevel').val());
}


$('input[name="operation"]').on('click', function () {
    if ($('#Multi_ZoneBasedOnSNo').val() == "") {
        $('#Text_ZoneBasedOnSNo').attr('data-valid', 'required');
        $('#Text_ZoneBasedOnSNo').attr('data-valid-msg', 'Field cannot be blank');
    }
    else
    {
        $('#Text_ZoneBasedOnSNo').removeAttr('data-valid');
        $('#Text_ZoneBasedOnSNo').removeAttr('data-valid-msg')
    }
});


function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_ZoneBasedOnSNo") {
        
        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_ZoneBasedOnSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        
}