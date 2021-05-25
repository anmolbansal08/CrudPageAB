$(document).ready(function () {

    var type = [{ Key: "1", Text: "CONSUMABLE" }, { Key: "0", Text: "EQUIPMENT" }];
    var Ownertype = [{ Key: "AIRLINE", Text: "AIRLINE" }, { Key: "FORWARDER", Text: "FORWARDER" }, { Key: "SELF", Text: "SELF" }];
  

    cfi.AutoComplete("City", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], OnchangeCity, "contains");

   // cfi.AutoComplete("Item", "SNo,ItemName", "vInventoryItem", "SNo", "ItemName", ["SNo", "ItemName"], "contains");

    cfi.AutoComplete("Item", "SNo,ItemName", "vInventoryItem", "SNo", "ItemName", null, null, "contains");

    //cfi.AutoComplete("Airport", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("Airport", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");



    cfi.AutoComplete("Office", "SNo,Name", "VOfficeForConsumable", "SNo", "Name", null, onchangeOffice, "contains");

    //cfi.AutoComplete("BasisOfChargeSNo", "BasisOfCharge", "InvBasisOfCharge", "SNo", "BasisOfCharge", null, null, "contains");
    cfi.AutoCompleteByDataSource("Type", type, onchangeType, null);

    cfi.AutoComplete("OwnerName", "SNo,Name", "vAccountForAgent", "SNo", "Name", null, onchangeowner, "contains"); //onchangeowner

   // cfi.AutoCompleteByDataSource("Owner", Ownertype, bindOwner);

    cfi.AutoComplete("IssuedTo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");
    var txtvalnew = null;
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("#City").val(userContext.CitySNo);
        $("#Text_City").val(userContext.CityCode + '-' + userContext.CityName);
        $("#Airport").val(userContext.AirportSNo);
        $("#Text_Airport").val(userContext.AirportCode + '-' + userContext.AirportName);
        // $("#Text_Type").data("kendoAutoComplete").setDefaultValue(1, "CONSUMABLE");


        $.ajax({
            url: "./Services/Inventory/ConsumableService.svc/Getofficelist", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ OfficeSNo: userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#Office').val(resData[0].officeSNo);
                    $('#Text_Office').val(resData[0].officeName);
                }
            }
        });
        /*****************************************/



        txtvalnew = $('#Type').val();
        if (txtvalnew == '0') {
            $('input[id=IsNumbered][value=0]').prop("checked", true);
            
        }
        else {
            $('input[id=IsNumbered][value=1]').prop("checked", true);
        }
     //   $('input[type=radio][value="0"]#IsNumbered').attr('disabled', true);
        //  $('input[type=radio][value="1"]#IsNumbered').attr('disabled', true);
        CheckOwnerViceVersa();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {

      //  $("#__SpanHeader__").html('Inventory Type Edit:');

        //if ($("input[name='IsChargeable']:checked").val() == 0) {
        //    $('#Text_BasisOfChargeSNo').attr('data-valid', 'required');
        //    $('#Text_BasisOfChargeSNo').attr('data-valid-msg', 'Enter Basis Of Charges.');
        //    $('#spnBasisOfChargeSNo').parent().find('font').html('*');
        //    $("#Text_BasisOfChargeSNo").data("kendoAutoComplete").enable(true);
        //   // cfi.ResetAutoComplete("BasisOfChargeSNo");
        //} else {
        //    $('#Text_BasisOfChargeSNo').removeAttr("data-valid");
        //    $('#Text_BasisOfChargeSNo').removeAttr("data-valid-msg");
        //    $('#spnBasisOfChargeSNo').parent().find('font').html(' ');
        //    $("#Text_BasisOfChargeSNo").data("kendoAutoComplete").enable(false);
        //   // cfi.ResetAutoComplete("BasisOfChargeSNo");

        //}


        // $("#IsNumbered").data("kendoAutoComplete").enable(true);
        //$(':radio:is(:checked)').attr('disabled', true);
        //$('#IsNumbered').find('input').each(function () { $(this).attr("disabled", true); });

        $("#Text_City").data("kendoAutoComplete").enable(false);
        $("#Text_Airport").data("kendoAutoComplete").enable(false);
        $("#Text_Office").data("kendoAutoComplete").enable(false);            
        $("#Text_Item").data("kendoAutoComplete").enable(false);
        $("#Text_OwnerName").data("kendoAutoComplete").enable(false);
        jQuery("input[name='Owner']").each(function (i) {
            jQuery(this).attr('disabled', 'disabled');
        });
      
        var txtval2 = $('#Text_Type').val(); 
        if (txtval2 == 'CONSUMABLE') {
            $('input[id=IsNumbered][value=1]').prop("checked", true);
        }
        else {
            $('input[id=IsNumbered][value=0]').prop("checked", true);

        }
     
      // CheckOwnerViceVersa();
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
       // $("#__SpanHeader__").html('Inventory Type Read:');
    }
  
  
    $("input[name=Owner]:radio").click(function () {
        if ($(this).attr("value") == "0") {
            var data = GetDataSource("OwnerName", "vAccountForAgent", "SNo", "Name", ["Name"], null);
            cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");
            $('#Text_OwnerName').attr('data-valid', 'required');
            $('#Text_OwnerName').attr('data-valid-msg', 'Enter Forwarder.');
            $('#spnOwnerName').parent().find('font').html('*');
           $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
           // cfi.ResetAutoComplete("BasisOfChargeSNo");

        }
        else if ($(this).attr("value") == "1") {
            var data = GetDataSource("OwnerName", "VAirlineForOffice", "AirlineSNo", "AirlineName", ["AirlineName"], null);
            cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "AirlineName", "contains");
            $('#Text_OwnerName').attr('data-valid', 'required');
            $('#Text_OwnerName').attr('data-valid-msg', 'Enter Airline.');
            $('#spnOwnerName').parent().find('font').html('*');
           $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
          //  cfi.ResetAutoComplete("BasisOfChargeSNo");

        } else {
            $('#Text_OwnerName').removeAttr("data-valid");
            $('#Text_OwnerName').removeAttr("data-valid-msg");
            $('#Text_OwnerName').removeClass("valid_invalid");
            $('#spnOwnerName').parent().find('font').html(' ');
            $("#Text_OwnerName").data("kendoAutoComplete").enable(false);
            cfi.ResetAutoComplete("OwnerName");
            $('#OwnerName').closest('td').find('span').find('.k-state-disabled').removeAttr('style');
        }
    });

  
  //  ResetOwner();

    // $("#IsNumbered").prop("disabled", true);

    //$('input[type=radio][value="0"]#IsNumbered').prop("disabled", true);
    //  $('input[type=radio][value="1"]#IsNumbered').prop("disabled", true);

    //$('#IsNumbered input[type=radio]').attr('disabled', true);


    $("input[name=IsNumbered]:radio").click(function () {
        var txtval = $('#Type').val();
        if (txtval == '0' || txtval=='False') {
            $('input[id=IsNumbered][value=0]').prop("checked", true);
        }
        else
        {
            $('input[id=IsNumbered][value=1]').prop("checked", true);
        }
    });

});

function CheckOwnerViceVersa()
{
    var vid = $("input[name=Owner]:checked").val();
    var vls = $('#Text_OwnerName').val();
    var vls2 = $('#OwnerName').val();
    if (vid == "0") {     
        var data = GetDataSource("OwnerName", "vAccountForAgent", "SNo", "Name", ["Name"], null);
        cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");
        $('#OwnerName').val(vls2);
        $('#Text_OwnerName').val(vls);
        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Forwarder.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        // cfi.ResetAutoComplete("BasisOfChargeSNo");
    }
    else if (vid == "1") {       
        var data = GetDataSource("OwnerName", "VAirlineForOffice", "AirlineSNo", "AirlineName", ["AirlineName"], null);
        cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "AirlineName", "contains");       
        // $("[id$='" + OwnerName + "']").val(vls);
        $('#OwnerName').val(vls2);
        $('#Text_OwnerName').val(vls);
        //$("*[id$='" + OwnerName + "']").val($("*[id$='" + OwnerName + "'] option:first").attr(vls));
        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Airline.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        //  cfi.ResetAutoComplete("BasisOfChargeSNo");
    }
   else {
        $('#Text_OwnerName').removeAttr("data-valid");
        $('#Text_OwnerName').removeAttr("data-valid-msg");
        $('#Text_OwnerName').removeClass("valid_invalid");
        $('#spnOwnerName').parent().find('font').html(' ');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(false);
        cfi.ResetAutoComplete("OwnerName");
        $('#OwnerName').closest('td').find('span').find('.k-state-disabled').removeAttr('style');
    }   
}
function onchangeowner()
{
    //Need to find value manuallly
    var ownerval = $("input[name=Owner]:checked").val();
    if (ownerval == "0") {  
        var data = GetDataSource("OwnerName", "vAccountForAgent", "SNo", "Name", ["Name"], null);
        cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");
        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Forwarder.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        // cfi.ResetAutoComplete("BasisOfChargeSNo");
    }
   //  else if ($(this).attr("value") == "1") {
    else if (ownerval == "1") {
        var data = GetDataSource("OwnerName", "VAirlineForOffice", "AirlineSNo", "AirlineName", ["AirlineName"], null);
        cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "AirlineName", "contains");
        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Airline.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        //  cfi.ResetAutoComplete("BasisOfChargeSNo");
    }
    else {
        $('#Text_OwnerName').removeAttr("data-valid");
        $('#Text_OwnerName').removeAttr("data-valid-msg");
        $('#Text_OwnerName').removeClass("valid_invalid");
        $('#spnOwnerName').parent().find('font').html(' ');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(false);
        cfi.ResetAutoComplete("OwnerName");
        $('#OwnerName').closest('td').find('span').find('.k-state-disabled').removeAttr('style');
    }
}
function onchangeType() {
    var txtval3 = $('#Type').val();
    if (txtval3 == '0') {        
        $('input[id=IsNumbered][value=0]').prop("checked", true);      
    }
    else
    {       
        $('input[id=IsNumbered][value=1]').prop("checked", true);     
       
    }
}
function ResetOwner() {
    
   // cfi.ResetAutoComplete("OwnerName");
    if ($("input[type='radio'][name='Owner']:checked").val() == "0") {
        //    var data = GetDataSource("OwnerName", "Account", "SNo", "Name", ["Name"], null);
        //    cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");

        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Forwarder.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        // cfi.ResetAutoComplete("BasisOfChargeSNo");

    }
    else if ($("input[type='radio'][name='Owner']:checked").val() == "1") {
        //    var data = GetDataSource("OwnerName", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
        //    cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "AirlineName", "contains");

        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Airline.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        //  cfi.ResetAutoComplete("BasisOfChargeSNo");

    } else {
        $('#Text_OwnerName').removeAttr("data-valid");
        $('#Text_OwnerName').removeAttr("data-valid-msg");


        $('#Text_OwnerName').removeClass("valid_invalid");
        $('#spnOwnerName').parent().find('font').html(' ');
     //   $("#Text_OwnerName").data("kendoAutoComplete").enable(false);

        cfi.ResetAutoComplete("OwnerName");
        $('#OwnerName').closest('td').find('span').find('.k-state-disabled').removeAttr('style');
    }
}
//function OnchangeCity() {
   // cfi.ResetAutoComplete("Airport");
   // cfi.ResetAutoComplete("Office");
   // cfi.ResetAutoComplete("OwnerName");
//}

function onchangeOffice() {
    cfi.ResetAutoComplete("OwnerName");
}
function ExtraCondition(textId) {
    var filterAirport = cfi.getFilter("AND");
   
    if (textId == "Text_Airport") {
        cfi.setFilter(filterAirport, "CitySno", "eq", $("#City").val())
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }

    if (textId == "Text_Office") {
        cfi.setFilter(filterAirport, "CitySno", "eq", $("#City").val())
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }
    if (textId == "OwnerName") {
        cfi.setFilter(filterAirport, "OfficeSNo", "eq", $("#Office").val());
     
            
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }
}



function OnchangeCity() {
    cfi.ResetAutoComplete("OwnerName");
    try {
        $.ajax({
            url: "./Services/Inventory/ConsumableService.svc/GetAirportOfficeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CitySNo: $("#City").val() == undefined ? "" : $("#City").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#Airport').val(resData[0].AirportSNo);
                    $('#Text_Airport').val(resData[0].AirportName);
                    $('#Office').val(resData[0].OfficeSNo);
                    $('#Text_Office').val(resData[0].OfficeName);

                }
                else {
                    $('#Office').val("");
                    $('#Text_Office').val("");
                    $('#Airport').val("");
                    $('#Text_Airport').val("");
                }
            }
        });
    }
    catch (exp) { }
}