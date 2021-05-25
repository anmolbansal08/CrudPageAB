//========== updated by  Arman Ali ===================
//==========  Date : 2017-07-06    ===================
//=========== purpose :  for saving record (recorde were not saving properly ).======= 

$(document).ready(function () {
    cfi.ValidateForm();
    var GroupLevelList = [{ Key: "0", Text: "Country" }, { Key: "1", Text: "City" }, { Key: "2", Text: "World" }]
    cfi.AutoCompleteByDataSource("GroupLevel", GroupLevelList, setGroup);
    // Changes by Vipin Kumar
    //cfi.AutoComplete("CountrySNo", "CountryCode,CountryName", "vCountryListDetails", "CountrySNo", "CountryCode", ["CountryCode", "CountryName"], null, null, null, null, null, null, setCountry);
    cfi.AutoCompleteV2("CountrySNo", "CountryCode,CountryName", "Agent_Group_CountrySNo", null, null, null, null, null, null, setCountry);
    //cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, null, null, null, null, null, setCity);
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Agent_Group_CitySNo", null, null, null, null, null, null, setCity);
    //cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
    cfi.AutoCompleteV2("AccountSNo", "AccountName,ParticipantID", "Agent_Group_AccountSNo", null, "contains", ",");
    // Ends
    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('#GroupLevel').closest('tr').next().hide();
        $('#CountrySNo').closest('tr').next().hide();

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" && $('#GroupLevel').val() == '0') {
        $('#CountrySNo').closest('td').next().hide();
        $('#CitySNo').closest('td').hide();
    }
    if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") && $('#GroupLevel').val() == '2') {

        $("#Text_AccountSNo").closest('tr').show()
        $("#Text_AccountSNo").closest('tr').prev('tr').hide()
        $('#Text_CountrySNo').removeAttr('data-valid');
        $('#Text_CitySNo').removeAttr('data-valid')
        $("#Text_CitySNo,#CitySNo").val('');
        $("#Text_CountrySNo,#CountrySNo").val('');
    }
});




function LevelChange() {
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW")
    //{
    //    cfi.ResetAutoComplete("CountrySNo");

    //    $('#GroupLevel').closest('tr').next().show();
    //    $('#CountrySNo').closest('tr').next().hide();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(4)').show();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(3)').show();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(2)').hide();
    //    $('#CountrySNo').closest('tr').find('td:nth-last-child(1)').hide();

    //}
}

function selectcity() {
    //AutoCompleteDeleteCallBack('', "divMultiAccountSNo", "Text_AccountSNo");
    //cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //    cfi.ResetAutoComplete("CitySNo");
    //    $("#divMultiAccountSNo").remove();
    //    cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
    //    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    //    if ($('#GroupLevel').val() == 0) {
    //        $('#CountrySNo').closest('tr').next().show();

    //    }
    //    if ($('#GroupLevel').val() == 1) {
    //        $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(2)').show();
    //        $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(1)').show();
    //        $('#CountrySNo').closest('tr').next().hide();
    //    }
    //}
}


function selectaccount() {
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {

    //    $('#CountrySNo').closest('tr').next().show();
    //    $("#divMultiAccountSNo").remove();
    //    cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
    //    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    //}
}


function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_CitySNo") {
        try {
            cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#Text_CountrySNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if ($("#Text_GroupLevel").val().toUpperCase() == "WORLD") {
       
    }
    else {
        if ($('#CitySNo').val() == "" || $('#CitySNo').val() == "0") {
            if (textId == "Text_AccountSNo") {
                try {
                    cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#Text_CountrySNo").data("kendoAutoComplete").key())
                    cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key())
                    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
                    return OriginCityAutoCompleteFilter2;
                }
                catch (exp)
                { }
            }
        }
        else {
            if (textId == "Text_AccountSNo" && $('#CitySNo').val() != "" && $('#CitySNo').val() != "0") {

                cfi.setFilter(filterEmbargo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key())
                cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key())
                var OriginCityAutoCompleteFilter3 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter3;


            }
        }
    }
}


//$('#Text_GroupLevel').select(function ()
function setGroup() {
    if ($("#Text_GroupLevel").val() != ""){
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        cfi.ResetAutoComplete("CountrySNo");
        cfi.ResetAutoComplete("CitySNo");

        $('#GroupLevel').closest('tr').next().show();
        $('#CountrySNo').closest('tr').next().hide();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(4)').show();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(3)').show();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(2)').hide();
        $('#CountrySNo').closest('tr').find('td:nth-last-child(1)').hide();
        $('#Text_CountrySNo').attr('data-valid','required');
        $('#Text_CitySNo').attr('data-valid', 'required');

    }
   
    }
    else
    {
        $("#Text_GroupLevel").closest('tr').nextAll('tr').hide()
        // alert('1')// $("#Text_GroupLevel").nextAll().hide();
    }

    if ($("#Text_GroupLevel").val() != "" && $("#Text_GroupLevel").val().toUpperCase() == "WORLD") {

        $("#AccountSNo").closest('tr').show()
        $("#AccountSNo").closest('tr').prev('tr').hide()
        $('#Text_CountrySNo').removeAttr('data-valid');
        $('#Text_CitySNo').removeAttr('data-valid')
        cfi.ResetAutoComplete("AccountSNo");
        $("#divMultiAccountSNo").find('.k-delete').click()
    }
 
}//);

//$('#Text_CountrySNo').select(function () 

function setCountry() {
    //if ($("#Text_CountrySNo").val() != "")
    //    {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        cfi.ResetAutoComplete("CitySNo");
        cfi.ResetAutoComplete("AccountSNo");
        //$("#AccountSNo").val('');
        //   $("#divMultiAccountSNo li").remove();
       $("#divMultiAccountSNo").find('.k-delete').click();
        
        // Changes by Vipin Kumar
        //cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
        //cfi.AutoCompleteV2("AccountSNo", "AccountName,ParticipantID", "Agent_Group_AccountSNo", null, "contains", ",");
        // Ends
      //  cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
        if ($('#GroupLevel').val() == 0) {
            $('#CountrySNo').closest('tr').next().show();
            $("#Text_CitySNo").removeAttr('data-valid');

        }
        if ($('#GroupLevel').val() == 1) {
            $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(2)').show();
            $('#Text_CountrySNo').closest('tr').find('td:nth-last-child(1)').show();
            $('#CountrySNo').closest('tr').next().hide();
            $("#Text_CitySNo").attr('data-valid', 'required');
        }
        if ($('#GroupLevel').val() == 2) {
            $("#Text_CitySNo").removeAttr('data-valid');
            $('#Text_CountrySNo').removeAttr('data-valid');
        }
    }
  //  }
    //else {
    //   // $("#Text_GroupLevel").nextAll().hide();
    //}
}//);

//$('#Text_CitySNo').select(function () 
function setCity() {
    //if ($("#Text_CitySNo").val() != ""){
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        $('#CountrySNo').closest('tr').next().show();
        cfi.ResetAutoComplete("AccountSNo");
        //$("#AccountSNo").val('');
     //   $("#divMultiAccountSNo li").remove();
        $("#divMultiAccountSNo").find('.k-delete').click()
        // Changes by Vipin Kumar
        //cfi.AutoComplete("AccountSNo", "AccountName", "vwAccountAgent", "SNo", "AccountName", ["AccountName"], null, "contains", ",");
       // cfi.AutoCompleteV2("AccountSNo", "AccountName,ParticipantID", "Agent_Group_AccountSNo", null, "contains", ",");
        //Ends
      //  cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    }
   // }
    //else
    //{
    //   // $("#Text_CitySNo").nextAll().hide();
    //}
}//);
//================================ added B  2017========================================================
//===================================End============================================================================================ 