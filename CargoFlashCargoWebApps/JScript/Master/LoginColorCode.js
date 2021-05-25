
$(document).ready(function () {
    var template = '<span>#: TemplateColumn #</span><div style="height:10px;padding:5px;background-color:#: SplitColorCode(TemplateColumn) #"/></div>';
   // cfi.AutoComplete("ColorCode", "ColorCode,ColorName", "Color", "SNo", "ColorCode", ["ColorCode", "ColorName"], AppendColorDiv, "contains", null, null, null, null, null, null, template);
    cfi.AutoCompleteV2("ColorCode", "ColorCode,ColorName", "Master_Login_ColorCode", AppendColorDiv, "contains", null, null, null, null, null, null, template);
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('#Text_ColorCode').parent().parent().after('<div  style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + SplitColorCode($('#Text_ColorCode').val()) + '"></div>');
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('#Text_ColorCode').after('<div  style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + SplitColorCode($('#Text_ColorCode').html()) + '"></div>');
    }
});
function AppendColorDiv()
{
    $('#Text_ColorCode').parent().parent().parent().find('div').remove();
    $('#Text_ColorCode').parent().parent().after('<div  style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + SplitColorCode($('#Text_ColorCode').val()) + '"></div>');

}

function SplitColorCode(colorName)
{
    return colorName.split('-',1);
}