//$(document).ready(function () {
//    cfi.ValidateForm();
//    var template = '<span>#: TemplateColumn #</span><div style="height:10px;padding:5px;background-color:#: TemplateColumn #"/></div>';
//    cfi.AutoComplete("ColorCode", "ColorCode", "Color", "SNo", "ColorCode", ["ColorCode"], null, "contains", null, null, null, null, null, null, template);
//});

//function ExtraCondition(textId) {
//    var filterAirline = cfi.getFilter("AND");
//    if (textId == "Text_UserSNo") {
//        try {
//            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
//            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
//            return OriginCityAutoCompleteFilter2;
//        }
//        catch (exp)
//        { }
//    }
//    if (textId == "Text_NewTerminalSNo") { 
//        try {
//            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
//            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
//            return OriginCityAutoCompleteFilter2;
//        }
//        catch (exp)
//        { }
//    }
//}

$(document).ready(function () {
    cfi.ValidateForm();
    var template = '<span>#: TemplateColumn #</span><div style="height:10px;padding:5px;background-color:#: SplitColorCode(TemplateColumn) #"/></div>';
    cfi.AutoCompleteV2("ColorCode", "ColorCode,ColorName", "Warehouse_ColorCode",  AppendColorDiv, "contains", null, null, null, null, null, null, template);

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('#Text_ColorCode').parent().parent().after('<div  style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + SplitColorCode($('#Text_ColorCode').val()) + '"></div>');
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('#Text_ColorCode').after('<div  style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + SplitColorCode($('#Text_ColorCode').html()) + '"></div>');
    }
});

function AppendColorDiv() {
    $('#Text_ColorCode').parent().parent().parent().find('div').remove();
    $('#Text_ColorCode').parent().parent().after('<div  style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + SplitColorCode($('#Text_ColorCode').val()) + '"></div>');

}

function SplitColorCode(colorName) {
    return colorName.split('-', 1);
}