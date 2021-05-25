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

//function ExtraCondition(textId) {
//    var filterZone = cfi.getFilter("AND");

//    if (textId == "Text_ZoneBasedOnSNo") {
//        try {
//            cfi.setFilter(filterZone, "SNo", "eq", $("#ZoneBasedOn").data("kendoAutoComplete").key())
//            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterZone]);
//            return OriginCityAutoCompleteFilter2;
//        }
//        catch (exp)
//        { }
//    }
  
//}

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
        cfi.AutoComplete("ZoneBasedOnSNo", "RegionName", "Region", "SNo", "RegionName",null , null, "contains", ",");

    }
    else if (Zonearea == 1) {
        cfi.AutoComplete("ZoneBasedOnSNo", "CountryName", "Country", "SNo", "CountryName", null, null, "contains", ",");

    }
    else if (Zonearea == 2) {
        cfi.AutoComplete("ZoneBasedOnSNo", "CityName", "City", "SNo", "CityName", null, null, "contains", ",");

    }
    else if (Zonearea == 3) {
        cfi.AutoComplete("ZoneBasedOnSNo", "AirportName", "Airport", "SNo", "AirportName", null, null, "contains", ",");

    }
}

/// Method Have been added to Bind  ZoneTrans Details Added By Vsingh Task-57 on 12/01/2017
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    $('#spnZoneBasedOnSNo').text(' ' + $('#Text_ZoneBasedOn').val());
}
if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
    $('#spnZone').text(' ' + $('#ZoneLevel').val());
}
