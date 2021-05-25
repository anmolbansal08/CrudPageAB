$(document).ready(function () {
    
    var type = [{ Key: "1", Text: "CONSUMABLE" }, { Key: "0", Text: "EQUIPMENT" }];
    var Ownertype = [{ Key: "AIRLINE", Text: "AIRLINE" }, { Key: "FORWARDER", Text: "FORWARDER" }, { Key: "SELF", Text: "SELF" }];


    cfi.AutoCompleteV2("City", "CityCode,CityName", "InventoryType_CityCode", OnchangeCity, "contains");


    cfi.AutoCompleteV2("Item", "SNo,ItemName", "InventoryType_ItemName", null, "contains");

    cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "InventoryType_AirportName", null, "contains");



    cfi.AutoCompleteV2("Office", "SNo,Name", "InventoryType_Name", onchangeOffice, "contains");

    cfi.AutoCompleteByDataSource("Type", type, onchangeType, null);

   cfi.AutoCompleteV2("OwnerName", "SNo,Name", "InventoryType_OwnerName_ForOffice", onchangeowner, "contains"); //onchangeowner


    cfi.AutoCompleteV2("IssuedTo", "SNo,Name", "InventoryType_IssuedTo", null, "contains");
    var txtvalnew = null;

    if (getQueryStringValue("FormAction").toUpperCase() != 'READ' && getQueryStringValue("FormAction").toUpperCase() != 'DELETE') {
        
        //$('#InventoryBuild').after('Inventory for Build-up');
        //$('#InventoryLocation').after('Inventory for Location');
        //$('#InventoryWeighing').after('Inventory for Weighing Cargo');
        $('#InventoryBuild').after('<br/>').after('Inventory for Build-up');
        $('#InventoryLocation').after('<br/>').after('Inventory for Location');
        $('#InventoryWeighing').after('<br/>').after('Inventory for Weighing Cargo');
        $('#InventoryBuild').closest('td').html(function (i, html) {

            return html.replace(/&nbsp;/g, '');
        });
       
        $("#InventoryBuild").closest('td').append('<input type="hidden" id="Checkboxvalue" name="Checkboxvalue" value="">')
        SetCheckboxvalue()
        $('input[type=checkbox]').click(function () {
            var txt = $(this).attr('id')
            if ($(this).is(':checked') && txt == 'InventoryBuild') {
                $(this).val('1');
            }
            if ($(this).is(':checked') && txt == 'InventoryLocation') {
                $(this).val('2');
            }
            if ($(this).is(':checked') && txt == 'InventoryWeighing') {
                $(this).val('3');
            }
        });
    }
    $('#Office').removeAttr('data-valid');
    $('#Text_Office').removeAttr('data-valid');
    $('#spnOffice').parent().find('font').html('');
    $('#Office').val('0');

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $("#City").val(userContext.CitySNo);
        $("#Text_City").val(userContext.CityCode + '-' + userContext.CityName);
        $("#Airport").val(userContext.AirportSNo);
        $("#Text_Airport").val(userContext.AirportCode + '-' + userContext.AirportName);
        // $("#Text_Type").data("kendoAutoComplete").setDefaultValue(1, "CONSUMABLE");
        $("#InventoryBuild").closest('tr').hide();

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
      
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $('#Text_OwnerName').val('LION AIR');
            $('#OwnerName').val('1');
            $('input[id=Owner][value=1]').prop('checked', true);
        }
        CheckOwnerViceVersa();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
        var ENV = userContext.SysSetting.ICMSEnvironment.toUpperCase();
        var txtvalue = $('#Text_Type').val()
        if (ENV != 'JT' || txtvalue=='CONSUMABLE') {
            $("#InventoryBuild").closest('tr').hide();
        }
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
    else if (getQueryStringValue("FormAction").toUpperCase() == 'READ' || getQueryStringValue("FormAction").toUpperCase() == 'DELETE') {
        // $("#__SpanHeader__").html('Inventory Type Read:');
        var ENV = userContext.SysSetting.ICMSEnvironment.toUpperCase();
        var txtvalue = $('#Type').val()
        if (ENV!= 'JT' || txtvalue == 'CONSUMABLE') {
            $("#InvenatoryUsage").closest('tr').hide();
        }
    }


    $("input[name=Owner]:radio").click(function () {
        if ($(this).attr("value") == "0") {
            var data = GetDataSourceV2("OwnerName", "InventoryType_OwnerName_ForAgent", null);
            cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");
            $('#Text_OwnerName').attr('data-valid', 'required');
            $('#Text_OwnerName').attr('data-valid-msg', 'Enter Forwarder.');
            $('#spnOwnerName').parent().find('font').html('*');
            $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
            // cfi.ResetAutoComplete("BasisOfChargeSNo");

        }
        else if ($(this).attr("value") == "1") {
            var data = GetDataSourceV2("OwnerName", "InventoryType_OwnerName_ForOffice", null);
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
        if (txtval == '0' || txtval == 'False') {
            $('input[id=IsNumbered][value=0]').prop("checked", true);
        }
        else {
            $('input[id=IsNumbered][value=1]').prop("checked", true);
        }
    });


   
});

function CheckOwnerViceVersa() {
    var vid = $("input[name=Owner]:checked").val();
    var vls = $('#Text_OwnerName').val();
    var vls2 = $('#OwnerName').val();
    if (vid == "0") {
        var data = GetDataSourceV2("OwnerName", "InventoryType_OwnerName_ForAgent", null);
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
        var data = GetDataSourceV2("OwnerName", "InventoryType_OwnerName_ForOffice", null);
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
function onchangeowner() {
    //Need to find value manuallly
    var ownerval = $("input[name=Owner]:checked").val();
    if (ownerval == "0") {
        var data = GetDataSourceV2("OwnerName", "InventoryType_OwnerName_ForAgent", null);
        cfi.ChangeAutoCompleteDataSource("OwnerName", data, true, null, "Name", "contains");
        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Forwarder.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        // cfi.ResetAutoComplete("BasisOfChargeSNo");
    }
        //  else if ($(this).attr("value") == "1") {
    else if (ownerval == "1") {
        var data = GetDataSourceV2("OwnerName", "InventoryType_OwnerName_ForOffice", null);
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
    var Txt = $('#Text_Type').val().toUpperCase();
    var ENV = userContext.SysSetting.ICMSEnvironment.toUpperCase();
    if (Txt == 'CONSUMABLE') {
        $("#InventoryBuild").closest('tr').hide();
    }
    else if (ENV == 'JT' && Txt == 'EQUIPMENT') {
        $("#InventoryBuild").closest('tr').show();
        $("#spnInventoryUsage").before("<font color=red>* </font>")
    }
    if (txtval3 == '0') {
        $('input[id=IsNumbered][value=0]').prop("checked", true);
    }
    else {
        $('input[id=IsNumbered][value=1]').prop("checked", true);
     

    }
}
function ResetOwner() {

    // cfi.ResetAutoComplete("OwnerName");
    if ($("input[type='radio'][name='Owner']:checked").val() == "0") {


        $('#Text_OwnerName').attr('data-valid', 'required');
        $('#Text_OwnerName').attr('data-valid-msg', 'Enter Forwarder.');
        $('#spnOwnerName').parent().find('font').html('*');
        $("#Text_OwnerName").data("kendoAutoComplete").enable(true);
        // cfi.ResetAutoComplete("BasisOfChargeSNo");

    }
    else if ($("input[type='radio'][name='Owner']:checked").val() == "1") {


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
    if ($('#Text_Office').val() == "") {
        $('#Office').val('0');
    }
    // cfi.ResetAutoComplete("OwnerName");
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
    //if (textId == "OwnerName") {
    //    cfi.setFilter(filterAirport, "OfficeSNo", "eq", $("#Office").val());


    //    var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
    //    return CurrencyAutoCompleteFilter;
    //}
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


$('input[name="operation"]').click(function (e) {
    $('#Checkboxvalue').val('');
    var txt = $('input[type=checkbox]:checked').map(function () { return this.value; }).get().join(',');
    var Txtvalue = $('#Text_Type').val().toUpperCase();
    var ENV = userContext.SysSetting.ICMSEnvironment.toUpperCase();
    $('#Checkboxvalue').val(txt);
    if (txt == "" && Txtvalue == 'EQUIPMENT' && ENV =='JT') {
        ShowMessage('warning', 'Warning - Inventory Type !', "Please select Inventory Usage	!");
        e.preventDefault();
        return true;
    }
});


function SetCheckboxvalue(){
$('input[type=checkbox]').each(function () {
    var txt = $(this).attr('id')
    if ($(this).is(':checked') && txt == 'InventoryBuild') {
        $(this).val('1');
    }
    if ($(this).is(':checked') && txt == 'InventoryLocation') {
        $(this).val('2');
    }
    if ($(this).is(':checked') && txt == 'InventoryWeighing') {
        $(this).val('3');
    }
});
}
