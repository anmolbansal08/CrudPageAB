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
    var Destination = [{ Key: "0", Text: "CITY" }, { Key: "1", Text: "COUNTRY" }];
    var Applicable = [{ Key: "0", Text: "Tact GCR" }, { Key: "1", Text: "Tact NORMAL GCR" }, { Key: "2", Text: "Tact MINIMUM" }, { Key: "3", Text: "Publish GCR" }, { Key: "4", Text: "Publish NORMAL GCR" }, { Key: "5", Text: "Publish MINIMUM" }];
    var StatusType = [{ Key: "0", Text: "In Active" }, { Key: "1", Text: "Active" }, { Key: "2", Text: "Draft" }];
    PageType = getQueryStringValue("FormAction").toUpperCase();
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "v_airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
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




    //  $('#Text_OriginLevel').val('CITY');
    // $('#Text_DestinationLevel').val('CITY');

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
    if (PageType == "EDIT") {
        $("#ValidFrom").data('kendoDatePicker').min($("#ValidFrom").val());
        $("#ValidTo").data('kendoDatePicker').max($("#ValidTo").val());
        
        FnGetOriginAC();
        FnGetDestinationAC();
    }
    $('#Text_OriginLevel').select(function () {
        if (PageType == "EDIT") {
            check = 1;
        }
    });
    // $("#ValidFrom").data('kendoDatePicker').min($("#ValidFrom").val());
    //  $("#ValidFrom").data('kendoDatePicker').max($("#ValidTo").val());
    // $("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());
    //  $("#ValidTo").data('kendoDatePicker').max($("#ValidTo").val());


    CreateConditionGrid();

    // checkvalid();

});

function checkvalid() {
    if (PageType == "EDIT") {
        if ($('#SHCSNO').val() != "") {
            $('#Text_CommoditySNo').removeAttr('data-valid');
            $('#Text_CommoditySNo').removeAttr('data-valid-msg');
            $('#fid').html('');
        }
    }
}

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

    if (Origin == "CITY") {

        var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");

        //cfi.AutoComplete("OriginSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
        if (PageType == 'EDIT' && check == 1) {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
        else if (PageType == 'NEW') {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
    }

    else if (Origin == "COUNTRY") {
        var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
        // cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
        if (PageType == 'EDIT' && check == 1) {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
        else if (PageType == 'NEW') {
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
    }



}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationLevel").val().toUpperCase();
    if (Destination == "CITY") {
        var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");
        //cfi.AutoComplete("DestinationSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
        if (PageType == 'EDIT' && check == 1) {
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        else if (PageType == 'NEW') {
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        
    }

    else if (Destination == "COUNTRY") {
        var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
        //cfi.AutoComplete("DestinationSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
        if (PageType == 'EDIT' && check == 1) {
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
    if ($('#CommoditySNo').val() == '') {
        $('#Text_CommoditySNo').removeAttr('data-valid');
        $('#Text_CommoditySNo').removeAttr('data-valid-msg');
        $('#fid').html('');
    }
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



function AutoCompleteDeleteCallBack(e, div, textboxid) {

    if (textboxid == "Text_SHCSNO" && div == "divMultiSHCSNO") {

        var length = $("div[id^='divMultiSHCSNO']").find('ul').find('li').length;
        if (length <= 2) {

            $('#Text_CommoditySNo').attr('data-valid', 'required');
            $('#Text_CommoditySNo').attr('data-valid-msg', 'Commodity cannot be blank.');
            $('#fid').html('<font id="fid" color="red" style="font-size:14px;">*</font>');


        }
        else {
            $('#Text_CommoditySNo').removeAttr('data-valid');
            $('#Text_CommoditySNo').removeAttr('data-valid-msg');
            $('#fid').html('');
        }



    }
}
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
                AutoCompleteDeleteCallBack_(e, divId, textboxid);

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


function CreateConditionGrid() {
    //    
    var dbtableName = "ManageRateCondition";
    $.ajax({
        url: "HtmlFiles/Rate/ManageRateCondition.html", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tbl" + dbtableName).html(result);

            cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains", ",");
            // $('#CommoditySNo').attr("data-required", "true");
            //if (PageType != "NEW")
            //{
            //    cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());

            //}
            cfi.AutoComplete("SHCSNO", "Codes,Name", "vwsphc_rate", "SNo", "Code", ["Name"], null, "contains", ",", null, null, null, SelectCheckCommodity);

            //  cfi.AutoComplete("SHCSNO", "Code,Name", "vwsphc_rate", "Snum", "Code", ["Name", "Code"], null, "contains", ",", null, null, null, separater_SPHC);
            //  $('#SHCSNO').attr("data-required", "true");

            if (getQueryStringValue("FormAction").toUpperCase() != "NEW" && getQueryStringValue("FormAction").toUpperCase() != 'INDEXVIEW' && getQueryStringValue("FormAction").toUpperCase() != 'READ') {


                var CurrentRateSno = $("#hdnRateSNo").val();
                $.ajax({
                    url: "Services/Rate/ManageClassRateService.svc/GetClassRate?RateSNo=" + CurrentRateSno, async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    data: JSON.stringify({ RateSNo: CurrentRateSno }),
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

                        if ($('#SHCSNO').val() != "0" && $('#SHCSNO').val() != "") {

                            $('#Text_CommoditySNo').removeAttr('data-valid');
                            $('#Text_CommoditySNo').removeAttr('data-valid-msg');
                            $('#fid').html('');
                        }
                        else if (($('#SHCSNO').val() == "0" || $('#SHCSNO').val() == "") && $('#CommoditySNo').val() == "") {

                            $('#Text_CommoditySNo').attr('data-valid');
                            $('#Text_CommoditySNo').attr('data-valid-msg');
                            $('#fid').html('<font id="fid" color="red" style="font-size:14px;">*</font>');

                        }

                    }
                });

            }
        }

    });
}

function OnSelectOrigin(input) {
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
            CitySNo: $("#OriginSNo").val()
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
        debugger;
        //    alert('domestic');
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
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }


}
//================================================end===========================================================//