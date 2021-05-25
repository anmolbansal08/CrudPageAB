/// <reference path="../../Scripts/references.js" />


var PageType = '';
var valuedata = [];
var duplicate_CheckSelectedItem = [];
var duplicate_CheckSelectedItem_nos = [];
var SNumArray = [];
var foundPresent = false;
var foundPresent_nos = false;
var value_0 = '';
var check = 0;
$(document).ready(function () {

    var foundPresent = false;
    var Origin = [{ Key: "0", Text: "CITY" }, { Key: "1", Text: "COUNTRY" }];
    var BasedOn = [{ Key: "1", Text: "PER PIECE" }, { Key: "2", Text: "CHARGEABLE WEIGHT" }, { Key: "3", Text: "PER PIECE ON GROSS WT" }];
    var Destination = [{ Key: "0", Text: "CITY" }, { Key: "1", Text: "COUNTRY" }];
    //var Applicable = [{ Key: "0", Text: "TACT GCR" }, { Key: "1", Text: "TACT NORMAL GCR" }, { Key: "2", Text: "TACT MINIMUM" }, { Key: "3", Text: "PUBLISH GCR" }, { Key: "4", Text: "PUBLISH NORMAL GCR" }, { Key: "5", Text: "PUBLISH MINIMUM" }];
    var Applicable = [{ Key: "0", Text: "TACT GCR" }, { Key: "1", Text: "TACT NORMAL GCR" }, { Key: "3", Text: "PUBLISH GCR" }, { Key: "4", Text: "PUBLISH NORMAL GCR" }];
    var StatusType = [{ Key: "0", Text: "InActive" }, { Key: "1", Text: "Active" }, { Key: "2", Text: "Draft" }];
    PageType = getQueryStringValue("FormAction").toUpperCase();
    // Changes by Vipin Kumar
    //cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "v_airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Class_Rate_Airline", resetFields, "contains");
    // Ends
    //  cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
    //  cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
    // cfi.AutoComplete("OriginSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
    cfi.AutoCompleteByDataSource("OriginSNo", null);
    cfi.AutoCompleteByDataSource("ApplicableOn", Applicable, null);
    //cfi.AutoComplete("DestinationSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
    cfi.AutoCompleteByDataSource("DestinationSNo", null);
    cfi.AutoCompleteByDataSource("Status", StatusType, null); 
    cfi.AutoCompleteByDataSource("OriginLevel", Origin, FnGetOriginAC, null);
    cfi.AutoCompleteByDataSource("DestinationLevel", Origin, FnGetDestinationAC, null);
    cfi.AutoCompleteV2("AccountSNo", "AgentName", "Rate_rate_RateAgentName", null, "contains", ",");
    cfi.AutoCompleteByDataSource("BasedOn", BasedOn, null);
    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    $("#Text_CommoditySNo").removeAttr('data-valid');
    $("#fid").remove();
    /*  Added By DEVENDRA ON 6 JUNE 2018*/
    cfi.AutoCompleteV2("OtherAirlineSNo", "CarrierCode,AirlineName", "Class_Rate_MultiAirline", null, "contains", ",");
    cfi.BindMultiValue("OtherAirlineSNo", $("#Text_OtherAirlineSNo").val(), $("#OtherAirlineSNo").val());
    if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT") {
             
        cfi.AutoCompleteV2("FlightSNo", "FlightNo", "SpotRate_AppendFlightNo", null, "contains", ",");
        cfi.BindMultiValue("FlightSNo", $("#Text_FlightSNo").val(), $("#FlightSNo").val());
       
    }
    else {
        $("#FlightSNo").closest('tr').prev('tr').remove();
        $("#FlightSNo").closest('tr').remove();
    }

    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto) {
            $(this).val("");
            alert('Valid From date can not be greater than Valid To date.');
        }
    })

    //added by jitendra kumar
    $('input:radio[name="IsInternational"]').change(
    function () {
        if ($(this).is(':checked') && $(this).val() == 0) {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        if ($(this).is(':checked') && $(this).val() == 1) {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
    });




    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto) {
            $(this).val("");
            alert('Valid From date can not be greater than Valid To date.');
        }
    })

    if (PageType == 'READ') {

        $('#Text_OriginLevel').after('-');
        $('#Text_DestinationLevel').after('-');
        $('span#RateInPercentage').after(' %');
    }
    if (PageType == 'NEW') {
        $("#ValidFrom").data('kendoDatePicker').value('');
        $("#ValidTo").data('kendoDatePicker').value('');
        $("#ValidFrom").data('kendoDatePicker').min(new Date());
        $("#ValidTo").data('kendoDatePicker').min(new Date());

    }
    if (PageType == "EDIT" || pageType=="DUPLICATE") {
        //$("#ValidFrom").data('kendoDatePicker').min($("#ValidFrom").val());
        //$("#ValidTo").data('kendoDatePicker').max($("#ValidTo").val());
        $("#ValidFrom").data('kendoDatePicker').min(new Date());
        $("#ValidTo").data('kendoDatePicker').min(new Date());

        FnGetOriginAC();
        FnGetDestinationAC();
    }
    $('#Text_OriginLevel').select(function () {
        if (PageType == "EDIT" || pageType == "DUPLICATE") {
            check = 1;
        }
    });
    // $("#ValidFrom").data('kendoDatePicker').min($("#ValidFrom").val());
    //  $("#ValidFrom").data('kendoDatePicker').max($("#ValidTo").val());
    // $("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());
    //  $("#ValidTo").data('kendoDatePicker').max($("#ValidTo").val());

    if (getQueryStringValue("FormAction").toUpperCase() != 'READ')
    CreateConditionGrid();
    if (userContext.SysSetting.IsClassRateWithSlab.toUpperCase()== "TRUE") {
        $('#RateInPercentage').attr('disabled', true);
        $('#_tempRateInPercentage').attr('disabled', true);
        $('#RateInPercentage, #_tempRateInPercentage').val('');
        $('#RateInPercentage').removeAttr('data-valid');
        CreateSlabGrid();
    }
    else {
        $("#Text_BasedOn").removeAttr('data-valid');
        $("#Text_AccountSNo").removeAttr('data-valid');
        $("#Text_AccountSNo").closest('tr').prev('tr').hide();
        $("#Text_AccountSNo").closest('tr').hide();
        $('#RateInPercentage').attr('disabled', false);
    }
  
    $("#Text_CommoditySNo").removeAttr('data-valid');
    $("#fid").remove();

    // checkvalid();
  
});

//function checkvalid() {
//    if (PageType == "EDIT") {
//        if ($('#SHCSNO').val() != "") {
//            $('#Text_CommoditySNo').removeAttr('data-valid');
//            $('#Text_CommoditySNo').removeAttr('data-valid-msg');
//            $('#fid').html('');
//        }
//    }
//}

//function ExtraCondition(textId) {
//    var f = cfi.getFilter("AND");

//    if (textId.indexOf("AWBOriginSNo") >= 0 || (textId.indexOf("AWBDestinationSNo") >= 0)) {
//        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_AWBOriginSNo", "AWBDestinationSNo").replace("Text_AWBDestinationSNo", "AWBOriginSNo")).val());
//      //  cfi.setFilter(f, "SNo", "notin", $("#Leg").val());
//    }

//    return cfi.autoCompleteFilter([f]);
//}
function FnGetOriginAC(input) {
    var Origin = $("#Text_OriginLevel").val().toUpperCase();
  //  $("#divMultiFlightSNo").closest('td').find('[class="k-icon k-delete"]').click();
    if (Origin == "CITY") {
        //Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
        var dataSource = GetDataSourceV2("OriginSNo", "Class_Rate_Origin");
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");

        //cfi.AutoComplete("OriginSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
        if ((PageType == 'EDIT' || pageType == "DUPLICATE") && check == 1) {
           
            
                $("#Text_OriginSNo").val("");
                $("#OriginSNo").val("");

            
        }
    else if (PageType == 'NEW') {
        if (userContext.GroupName.toUpperCase() == 'GSA') {
            if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
                $("#OriginSNo").val(userContext.CityCode);
                $("#Text_OriginSNo").val(userContext.CityCode + '-' + userContext.CityName);

                $('#Text_OriginSNo').data("kendoAutoComplete").enable(false);
            }
        }
        else {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
        }
    }

    else if (Origin == "COUNTRY") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"])
        var dataSource = GetDataSourceV2("OriginSNo", "Class_Rate_Country");
        // Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
        // cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
        if ((PageType == 'EDIT' || pageType == "DUPLICATE") && check == 1) {
           
            
                $("#Text_OriginSNo").val("");
                $("#OriginSNo").val("");
                        

        }
    else if (PageType == 'NEW') {
        if (userContext.GroupName.toUpperCase() == 'GSA') {
            if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
                $("#OriginSNo").val(userContext.CountrySNo);
                $("#Text_OriginSNo").val(userContext.CountryCode + '-' + userContext.CountryName);

                $('#Text_OriginSNo').data("kendoAutoComplete").enable(false);
            }
        }
        else {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
        }
    }



}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationLevel").val().toUpperCase();
    //$("#divMultiFlightSNo").closest('td').find('[class="k-icon k-delete"]').click();
    if (Destination == "CITY") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityName", ["CityCode", "CityName"]);
        var dataSource = GetDataSourceV2("DestinationSNo", "Class_Rate_Destination");
        // Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");
        //cfi.AutoComplete("DestinationSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
        if ((PageType == 'EDIT' || pageType == "DUPLICATE") && check == 1) {
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        else if (PageType == 'NEW') {
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }

    }

    else if (Destination == "COUNTRY") {
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "Class_Rate_Country")
        //Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
        //cfi.AutoComplete("DestinationSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
        if ((PageType == 'EDIT' || pageType == "DUPLICATE") && check == 1) {
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        else if (PageType == 'NEW') {
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
    }


}

function indexOfWordAtCaret(caret, text, separator) {
    return separator ? text.substring(0, caret).split(separator).length - 1 : 0;
}

function SelectCheckCommodity() {
    //if ($('#CommoditySNo').val() == '') {
    //    $('#Text_CommoditySNo').removeAttr('data-valid');
    //    $('#Text_CommoditySNo').removeAttr('data-valid-msg');
    //    $('#fid').html('');
    //}
}

function separater_SPHC(e) {

    // alert($('#Text_SHCSNO').val());
    var spandata = $("li[class^='k-item k-state-hover']").find('span').text();
    var codes = spandata.split('-')[0];
    var name = spandata.split('-')[1];
    var length = $("div[id^='divMultiSHCSNO']").find('ul').find('li').length;

    $.ajax({
        url: "Services/Rate/ManageClassRateService.svc/GetMultipleSHSNo",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            Name: name, CodesData: codes, length: length
            // codes: $("div[id^='divMultiSHCSNO']").find('ul').find('li:first').find('span').text().split('-')[1], sno: $("div[id^='divMultiSHCSNO']").find('ul').find('li:first').find('span:eq(1)').attr('id')
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {


        },
        error: function (xhr) {
            var a = "";
        }

    });
}



//function AutoCompleteDeleteCallBack(e, div, textboxid) {

//    if (textboxid == "Text_SHCSNO" && div == "divMultiSHCSNO") {

//        var length = $("div[id^='divMultiSHCSNO']").find('ul').find('li').length;
//        if (length <= 2) {

//            $('#Text_CommoditySNo').attr('data-valid', 'required');
//            $('#Text_CommoditySNo').attr('data-valid-msg', 'Commodity cannot be blank.');
//            $('#fid').html('<font id="fid" color="red" style="font-size:14px;">*</font>');


//        }
//        else {
//            $('#Text_CommoditySNo').removeAttr('data-valid');
//            $('#Text_CommoditySNo').removeAttr('data-valid-msg');
//            $('#fid').html('');
//        }



//    }
//}
function BindMultiValue_(controlName, textDetail, keyDetail) {

    if (textDetail != "" && textDetail != null) {
        var totalText = textDetail.split(',');
        var totalKeys = keyDetail.split(',');
        for (lIndex = 0; lIndex < totalText.length; lIndex++) {
            $("div[id='divMulti" + controlName + "']").find("ul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + totalText[lIndex] + "</span><span id='" + totalKeys[lIndex] + "' class='k-icon k-delete'></span></li>");

            if (lIndex == 0) {
                $("div[id='divMulti" + controlName + "']").show();
                $("div[id='divMulti" + controlName + "']").find("span[id^='FieldKeyValues" + controlName + "']").text(totalKeys[lIndex]);
            }
            else {
                var lPreviousKey = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text();
                lPreviousKey = lPreviousKey + "," + totalKeys[lIndex];
                $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(lPreviousKey);
            }
            $("div[id='divMulti" + controlName + "']").find("span[id='" + totalKeys[lIndex] + "'].k-delete").click(function (e) {

                //Added By Amit Yadav Delete Callback
                var divId = "divMulti" + controlName;
                var textboxid = "Text_" + controlName;
                //    AutoCompleteDeleteCallBack_(e, divId, textboxid);

                $(this).parent().remove();

                var arr = $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text().split(',').filter(function (n) { return n != '' });
                var idx = arr.indexOf($(this)[0].id);
                arr.splice(idx, 1);

                $("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text(arr.join(','));
                //   $("div[id='divMulti" + controlName + "']").closest("td").find("input:hidden[name^='" + controlName + "']").val(arr.join(','));
                //  $("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + controlName + "']").val(arr.join(','));
            });
        }

        $("div[id='divMulti" + controlName + "']").find("input:hidden[name^='Multi_" + controlName + "']").val($("div[id='divMulti" + controlName + "']").find("span[name^='FieldKeyValues" + controlName + "']").text());
        $("#Text_" + controlName + "").val("");
    }
}
var pageType = getQueryStringValue("FormAction").toUpperCase();

function CreateConditionGrid() {
    //    
    var dbtableName = "ManageRateCondition";
    var str = '<tr> <td class="formlabel"><font id="fid" color="red" style="font-size:14px;">*</font><strong>Commodity&nbsp;&nbsp;</strong> </td><td class="formInputcolumn">   <input type="hidden" id="CommoditySNo" name="CommoditySNo" tabindex="0" explicitvalid="1">   <span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-default" unselectable="on" style="width: 200px;"><input type="text" id="Text_CommoditySNo" name="Text_CommoditySNo" tabindex="17" data-valid="required" data-valid-msg="Commodity cannot be blank." controltype="autocomplete" style="width: 100%; text-transform: uppercase;" data-role="autocomplete" autocomplete="off" class="k-input"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span> <div style="display:none;overflow: auto;" id="divMultiCommoditySNo"><ul style="padding:3px 2px 2px 0px;margin-top:0px;"><li class="k-button" style="display:none;margin-bottom:10px !important;"><input type="hidden" id="Multi_CommoditySNo" name="Multi_CommoditySNo"><span style="display:none;" id="FieldKeyValuesCommoditySNo" name="FieldKeyValuesCommoditySNo"></span></li></ul></div></td> <td class="formlabel"><strong>SHC&nbsp;&nbsp;</strong> </td><td class="formInputcolumn"> <input type="hidden" id="SHCSNO" name="SHCSNO" tabindex="0"> <span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-default" unselectable="on" style="width: 200px;"><input type="text" id="Text_SHCSNO" name="Text_SHCSNO" tabindex="18" controltype="autocomplete" style="width: 100%; text-transform: uppercase;" data-role="autocomplete" autocomplete="off" class="k-input"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span> <div style="display:none;overflow: auto;" id="divMultiSHCSNO"><ul style="padding:3px 2px 2px 0px;margin-top:0px;"><li class="k-button" style="display:none;margin-bottom:10px !important;"><input type="hidden" id="Multi_SHCSNO" name="Multi_SHCSNO"><span style="display:none;" id="FieldKeyValuesSHCSNO" name="FieldKeyValuesSHCSNO"></span></li></ul></div></td>  </tr>'
    // $("#tblManageRateCondition").append(str);
    $("#Text_Status").closest('tr').after(str);
    $("#divMultiCommoditySNo").remove();
    $("#divMultiSHCSNO").remove();

     //   $("#tbl" + dbtableName).html(result);

        // Changes by Vipin Kumar
        //cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains", ",");
        cfi.AutoCompleteV2("CommoditySNo", "CommodityCode,CommodityDescription", "Class_Rate_Commodity", null, "contains", ",");
        // Ends
        // $('#CommoditySNo').attr("data-required", "true");
        //if (PageType != "NEW")
        //{
        //    cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());

        //}
        // Changes by Vipin Kumar
        //cfi.AutoComplete("SHCSNO", "Name", "vwsphc_rate", "SNo", "Name", ["Name"], null, "contains", ",", null, null, null, SelectCheckCommodity);
        cfi.AutoCompleteV2("SHCSNO", "Name", "Class_Rate_SHC", null, "contains", ",", null, null, null, SelectCheckCommodity);
        //Ends

        //  cfi.AutoComplete("SHCSNO", "Code,Name", "vwsphc_rate", "Snum", "Code", ["Name", "Code"], null, "contains", ",", null, null, null, separater_SPHC);
        //  $('#SHCSNO').attr("data-required", "true");

        if (getQueryStringValue("FormAction").toUpperCase() != "NEW" && getQueryStringValue("FormAction").toUpperCase() != 'INDEXVIEW' && getQueryStringValue("FormAction").toUpperCase() != 'READ') {


            var CurrentRateSno = $("#hdnRateSNo").val();
            $.ajax({
                url: "Services/Rate/ManageClassRateService.svc/GetClassRate?RateSNo=" + CurrentRateSno, async: false, type: "get", dataType: "json", cache: false,
                //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                //data: JSON.stringify({ RateSNo: CurrentRateSno }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ArrayData = jQuery.parseJSON(result);
                    var Array = ArrayData.Table0;
                    var Array1 = ArrayData.Table1;
                    if (Array.length != 0) {
                        cfi.BindMultiValue("CommoditySNo", Array[0].Text_CommoditySNo, Array[0].CommoditySNo);

                        //  $("input[type=radio][name=IsInclude][value=" + Array[0].IsInclude + "]").attr('checked', 1);
                        $('#CommoditySNo').val($('#Multi_CommoditySNo').val());
                    }
                    if (Array1.length != 0) {
                        cfi.BindMultiValue("SHCSNO", Array1[0].Text_SHCSNO, Array1[0].SHCSNO);


                        $('#SHCSNO').val(Array1[0].SHCSNO);
                    }
                    //alert("1");

                    //if ($('#SHCSNO').val() != "0" && $('#SHCSNO').val() != "") {

                    //    $('#Text_CommoditySNo').removeAttr('data-valid');
                    //    $('#Text_CommoditySNo').removeAttr('data-valid-msg');
                    //    $('#fid').html('');
                    //}
                    //else if (($('#SHCSNO').val() == "0" || $('#SHCSNO').val() == "") && $('#CommoditySNo').val() == "") {

                    //    $('#Text_CommoditySNo').attr('data-valid');
                    //    $('#Text_CommoditySNo').attr('data-valid-msg');
                    //    $('#fid').html('<font id="fid" color="red" style="font-size:14px;">*</font>');

                    //    }

                }
            });

        }
    
}

function OnSelectOrigin(input) {
   // resetFields();
    var Origin = $("#Text_OriginLevel").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Origin == "COUNTRY") {
            if (Text_OriginSNo == Text_DestinationSNo && $('input:radio[name=IsInternational]:checked').val() != "1") {
                ShowMessage('warning', 'Warning - Rate', 'Origin Country can not be same as Destination Country.', "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");
            }

        }
        else if (Origin == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Origin City can not be same as Destination City.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }
        }
    }



}
function OnSelectDestination(input) {
   // resetFields();
    var Destination = $("#Text_DestinationLevel").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Destination == "COUNTRY") {
            if (Text_OriginSNo == Text_DestinationSNo && $('input:radio[name=IsInternational]:checked').val() != "1") {
                ShowMessage('warning', 'Warning - Rate', "Destination Country can not be same as Origin Country.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }
        }
        else if (Destination == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Destination City can not be same as Origin City.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }

        }
    }
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        $("#REFNo").val($("#Text_RateCardSNo").val() + "_" + Text_OriginSNo.split("-")[0] + "_" + Text_DestinationSNo.split("-")[0] + "_1");
    }

}

//==========================Added By Arman Ali====================================================================================//
var coutrysno = 0;

function onselectCoutrySNO(obj) {

    $.ajax({
        url: "Services/Rate/ManageClassRateService.svc/GetCountrySNo",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#OriginSNo").val() ||0
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {


            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    coutrysno = parseInt(myData.Table0[0].CountrySNo);
                }
            }
            return coutrysno;
        },
        error: function (xhr) {
            var a = "";
        }

    });
    return coutrysno;
}
var CountrySNo = 0;
function ExtraCondition(textId) {
    //  

    var filterAirline = cfi.getFilter("AND");
    var filterForwarderCode = cfi.getFilter("AND");
    var filterForwarderName = cfi.getFilter("AND");
    var international = $('input:radio[name=IsInternational]:checked').val();
    var origin = $('#Text_OriginLevel').val().toUpperCase();
    var destination = $('#Text_DestinationLevel').val().toUpperCase();

    if (textId == "DestinationSNo" || textId == "OriginSNo")
    {
        resetFields();
    }

    if (international == '0') {
        if (textId == "DestinationSNo" && origin == 'COUNTRY') {
            cfi.setFilter(filterForwarderCode, "CountrySNo", "notin", $('#OriginSNo').val());
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            return ForwarderFilter;
        }
        if (textId == "OriginSNo" && destination == 'COUNTRY') {
            cfi.setFilter(filterForwarderCode, "CountrySNo", "notin", $('#DestinationSNo').val());
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            return ForwarderFilter;
        }

        if (textId == "DestinationSNo" && origin == 'CITY' && destination == 'CITY') {



            if (CountrySNo == 0) {
                CountrySNo = onselectCoutrySNO($("#OriginSNo").val());

            }


            cfi.setFilter(filterForwarderCode, "CountrySNo", "notin", CountrySNo);
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            return ForwarderFilter;
        }
    }
    else if (international == '1') {
        if (textId == "DestinationSNo" && $('#OriginSNo').val() != "" && origin == 'COUNTRY') {
            cfi.setFilter(filterForwarderCode, "CountrySNo", "eq", $('#OriginSNo').val());
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            return ForwarderFilter;
        }
        if (textId == "OriginSNo" && $('#DestinationSNo').val() != "" && destination == 'COUNTRY') {
            cfi.setFilter(filterForwarderCode, "CountrySNo", "eq", $('#DestinationSNo').val());
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            return ForwarderFilter;
        }
        if (textId == "DestinationSNo" && origin == 'CITY' && destination == 'CITY') {



            if (CountrySNo == 0) {
                CountrySNo = onselectCoutrySNO($("#OriginSNo").val());

            }


            cfi.setFilter(filterForwarderCode, "CountrySNo", "eq", CountrySNo);
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            return ForwarderFilter;
        }
        if (textId == "DestinationSNo" && origin == 'CITY' && destination == 'COUNTRY') {



            if (CountrySNo == 0) {
                CountrySNo = onselectCoutrySNO($("#OriginSNo").val());

            }


            cfi.setFilter(filterForwarderCode, "CountrySNo", "eq", CountrySNo);
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            return ForwarderFilter;
        }
    }
    if (textId == "Text_AirlineSNo") {
        try {
            cfi.setFilter(filterAirline, "IsInterline", "eq", 0);
            cfi.setFilter(filterAirline, "SNo", "notin", $('#OtherAirlineSNo').val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    else if (textId == "Text_OtherAirlineSNo") {
        try {
            cfi.setFilter(filterAirline, "IsInterline", "eq", 0);
            cfi.setFilter(filterAirline, "SNo", "neq", $('#AirlineSNo').val());
            cfi.setFilter(filterAirline, "SNo", "notin", $('#OtherAirlineSNo').val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    else if (textId == 'Text_SHCSNO') {
        cfi.setFilter(filterAirline, "SNo", "notin", $('#Multi_SHCSNO').val());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    if (textId == "Text_FlightSNo") {
        if ($("#OtherAirlineSNo").val() != "") {
            cfi.setFilter(filterAirline, "AirlineSNo", "in", $("#AirlineSNo").val() + "," + $("#OtherAirlineSNo").val());
        } else {
            cfi.setFilter(filterAirline, "AirlineSNo", "eq", $("#AirlineSNo").val());
        }
        cfi.setFilter(filterAirline, "Origin" + origin, "in", $("#OriginSNo").val());
        cfi.setFilter(filterAirline, "FlightNo", "notin", $("#FlightSNo").val());
        cfi.setFilter(filterAirline, "Destination" + destination, "in", $("#DestinationSNo").val());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    
}

$('input[type="submit"][name="operation"]').click(function () {
    $("#Text_CommoditySNo").removeAttr('data-valid');
    $("#fid").remove();
    if (userContext.SysSetting.IsClassRateWithSlab.toUpperCase() == "FALSE") {
        if ($("#Multi_CommoditySNo").val() == "" && $("#Multi_SHCSNO").val() == "") {
            ShowMessage('warning', 'Warning - Rate', 'Please Select Either Commodity Or SHC Or Both', "bottom-right");
            return false;

        }
    }
    else {
        if ($("#Multi_CommoditySNo").val() == "" && $("#Multi_SHCSNO").val() == ""  && $("#AccountSNo").val() == "") {
            ShowMessage('warning', 'Warning - Rate', 'Please Select Either Commodity Or SHC Or Agent', "bottom-right");
            return false;

        }

    }


});
//================================================end===========================================================//

function CreateSlabGrid() {
    var dbtableName = "ClassRateSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable:  true,
        masterTableSNo: $("#hdnClassRateSlabSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/ManageClassRateService.svc",
        getRecordServiceMethod: "GetClassRateSlabRecord",
        deleteServiceMethod: "DeleteClassRateSlab",
        caption: " Slab Information",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },

                 { name: "StartWeight", display: "Start Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 5, controltype: "default", onkeypress: "return validate(event);", onblur: "return CheckValidation(this.id);" }, isRequired: true },
                 { name: "EndWeight", display: "End Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 5, controltype: "default", onkeypress: "return validate(event);", onblur: "return CheckValidation(this.id);" }, isRequired: true },
                  { name: "RateBasedOn", display: "Based On", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 2: "Fixed Value", 3: "Fixed Amount", 1: "Percentage"}, ctrlCss: { width: "150px", height: "20px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },

               {
                   name: "Value", display: "Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 12, controltype: "default",  onkeypress: "return validate(event);", onblur: "return CheckValue(this.id);" }, isRequired: true, maxlength: 10, title: "Enter Amount"
               }
                

        ]
        ,

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            if (addedRowIndex > 0) {
                uniqueindex = $('#tblClassRateSlab').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
                prevrowuniqueindex = $('#tblClassRateSlab').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
                var end = Math.abs($('#tblClassRateSlab_EndWeight_' + prevrowuniqueindex).val());
                $('#tblClassRateSlab_StartWeight_' + uniqueindex).val(end + 1);
                $('#tblClassRateSlab_StartWeight_' + uniqueindex).attr('disabled', true);
                $('#tblClassRateSlab_EndWeight_' + uniqueindex).attr('disabled', false);

            }
            var action = $('#hdnPageType').val();
            var length = $("tr[id^='tblClassRateSlab_Row']").find("select")[$("tr[id^='tblClassRateSlab_Row']").find("select").length - 1].id.split("_")[2];
            for (var i = 1; i < length; i++) {

                if (action == "EDIT" || action == "NEW" || action == "DUPLICATE") {
                    $('#tblClassRateSlab_StartWeight_' + i).attr('disabled', true);
                    $('#tblClassRateSlab_EndWeight_' + i).attr('disabled', true);
                    $('#tblClassRateSlab_RateBasedOn_' + i).attr('disabled', true);
                    $('#tblClassRateSlab_Value_' + i).attr('disabled', true);
                    $('#tblClassRateSlab_Delete_' + i).hide();
                }
                if (action == "READ" || action == "DELETE") {
                    $('#tblClassRateSlab_StartWeight_' + i).attr('disabled', true);
                    $('#tblClassRateSlab_EndWeight_' + i).attr('disabled', true);
                    $('#tblClassRateSlab_Value_' + i).attr('disabled', true);
                }
            }

        },
        beforeRowRemove: function (caller, rowIndex) {

        },
        afterRowRemoved: function (caller, rowIndex) {
            if ($("tr[id^='tblClassRateSlab_Row']").find("select").length > 0) {

                var getLastvalue = $("tr[id^='tblClassRateSlab']").find("select")[$("tr[id^='tblClassRateSlab_Row']").find("select").length - 1].id.split("_")[2];

                if ($("tr[id^='tblClassRateSlab_Row']").find("select").length == 1) {
                    $('#tblClassRateSlab_StartWeight_' + getLastvalue).attr('disabled', false);
                    //$('#tblClassRateSlab_BasedOn_' + getLastvalue).attr('disabled', false);
                    // $('#tblClassRateSlab_Amount_' + getLastvalue).attr('disabled', false);
                }

                $('#tblClassRateSlab_Delete_' + getLastvalue).show();



                $('#tblClassRateSlab_EndWeight_' + getLastvalue).attr('disabled', false);
                $('#tblClassRateSlab_BasedOn_' + getLastvalue).attr('disabled', false);
                $('#tblClassRateSlab_Value_' + getLastvalue).attr('disabled', false);
            }


        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            if ($("tr[id^='tblClassRateSlab_Row']").find("select").length == 1)
                $("[id*='tblClassRateSlab_StartWeight_']").attr('disabled', false);
            else
                $("[id*='tblClassRateSlab_StartWeight_']").attr('disabled', true);
            if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
                $("[id*='tblClassRateSlab_StartWeight_']").attr('disabled', true);
                $("[id*='tblClassRateSlab_EndWeight_']").attr('disabled', true);
                $("[id*='tblClassRateSlab_RateBasedOn_']").attr('disabled', true);
                $("[id*='tblClassRateSlab_Value_']").attr('disabled', true);
                $('#tblClassRateSlab_btnRemoveLast').remove();
                $('#tblClassRateSlab_btnAppendRow').remove();
            }
        },
        isPaging: true,
        //   hideButtons: { updateAll: true,  remove: pageType == "DUPLICATE"  || pageType == "EDIT" ? false : true, removeLast: true }
        hideButtons: { updateAll: true, insert: true, removeLast: true },
        showButtons: { removeAll: true, remove: true }

    });
    $("tr[id^='tblClassRateSlab_Row']").each(function (index) {
        var page = getQueryStringValue("FormAction").toUpperCase();
        if (page == "READ" || page == "EDIT" || page == 'DUPLICATE') {
            $('#tblClassRateSlab_Insert_' + (index + 1)).remove();
            if ($("tr[id^='tblClassRateSlab_Row']").find("select").length == 1) {
                $('[id^="tblClassRateSlab_StartWeight_"]').attr("disabled", false);
            }
        }
        if (page == "READ") {
            $('#tblClassRateSlab_Insert_' + (index + 1)).remove();
            $('#tblClassRateSlab_Delete_' + (index + 1)).remove();
        }
    });


}

function CheckValidation(obj) {
    var startValue = 0;
    var endValue = 0;


    if (obj.indexOf("Start") >= 0) {
        startValue = $("#" + obj).val();
        endValue = $("#" + obj.replace("Start", "End")).val();
        previousEndValue = $("#" + obj.replace("Start", "End").replace(obj.split("_")[2], obj.split("_")[2] - 1)).val();
    }
    else {
        endValue = $("#" + obj).val();
        startValue = $("#" + obj.replace("End", "Start")).val();
    }

    if (parseFloat(startValue) == 0) {
        ShowMessage('warning', 'Warning - Class Rate', "Start Weight cannot be 0", "bottom-right");
        //alert("Start Weight cannot be 0");
        $("#" + obj.replace("End", "Start")).val("");
        $("#" + obj.replace("End", "Start")).attr("required", "required");
    }
    else if (parseFloat(endValue) == 0) {
        ShowMessage('warning', 'Warning - Class Rate', "End Weight cannot be 0", "bottom-right");
        // alert("End Weight cannot be 0.");
        $("#" + obj.replace("Start", "End")).val("");
        $("#" + obj.replace("Start", "End")).attr("required", "required");
    }

    else if (parseFloat(startValue) > parseFloat(endValue)) {
        ShowMessage('warning', 'Warning - Class Rate', "Start Range can not be greater than End Range.", "bottom-right");
        //alert("Start Range can not be greater than End Range.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }
}

function CheckValue(obj) {
    var Amount = 0;
    var startValue = 0;
    var endValue = 0;
    var index = $("#" + obj).attr('id').split('_')[2];
    amount = $('#' + obj).val();
    var id = obj.split('_')[2];
    if (parseInt($('#tblClassRateSlab_RateBasedOn_' + id).val()) == 1) {
        $("#" + obj).attr('maxlength', '4');
        //if (parseFloat($("#" + obj).val()) > 100) {
        //    ShowMessage('warning', 'Warning - Class Rate', "Value Should Be Less Than Or Equal To 100", "bottom-right");
        //    $("#" + obj).val('');
        //}
    }
    else {
        $("#" + obj).attr('maxlength', '12');
    }

    if (parseFloat(amount) <= 0) {
        ShowMessage('warning', 'Warning - Class Rate', "Value should be greater than 0.", "bottom-right");
        // alert("Value should be greater than 0.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }

    //if ($('#tblClassRateSlab_RateBasedOn_' + index).val() == 1) {
    //    if (amount > 100) {
    //        ShowMessage('warning', 'Warning - Class Rate', "Value should be smaller than 100.", "bottom-right");
    //        $("#" + obj).val("");
    //        $("#" + obj).attr("required", "required");
    //    }
    //}

}

function validate(evt) {
 
    var id = evt['currentTarget'].id.split('_')[2];
    if ($("#tblClassRateSlab_RateBasedOn_" + id).val() == '1') {
        $("#tblClassRateSlab_Value_" + id).attr('maxlength', 4)
    }
    else {
        $("#tblClassRateSlab_Value_" + id).attr('maxlength', 12)
    }

    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./g;

    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }

 

}

$('input[type="submit"][name="operation"]]').click(function () {

    if (userContext.SysSetting.IsClassRateWithSlab.toUpperCase() == "TRUE"){
    $('[id^="tblClassRateSlab_StartWeight_"]').attr("disabled", false);
    $('[id^="tblClassRateSlab_EndWeight_"]').attr("disabled", false);
    $('[id^="tblClassRateSlab_RateBasedOn_"]').attr("disabled", false);
    $('[id^="tblClassRateSlab_Value_"]').attr("disabled", false);

    if ($('#tblClassRateSlab_rowOrder').val() == "") {       
        ShowMessage('warning', 'Warning - Class Rate!', "Add Slab");
        return false;
    }
    }

});


function ChangeUnitType(obj) {
    var id = obj.split('_')[2];
    var val = $("#" + obj).val()
    if (parseInt(val) == 1) {
        //if (parseFloat( $("#tblClassRateSlab_Value_"+ id).val()) > 100) {
        //    $("#tblClassRateSlab_Value_" + id).val('');
        //}
        $("#tblClassRateSlab_Value_" + id).attr('maxlength', '4');
    }
    else {
        $("#tblClassRateSlab_Value_" + id).attr('maxlength', '12');
    }
}

function resetFields() {
    $("#divMultiFlightSNo").closest('td').find('[class="k-icon k-delete"]').click();
}

function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
    else if (id == "Text_OtherAirlineSNo") 
    {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}
