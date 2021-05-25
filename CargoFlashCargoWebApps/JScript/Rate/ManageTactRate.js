/// <reference path="../../Scripts/references.js" />



$(document).ready(function () {


    $(".k-pager-info").closest('span').on('DOMSubtreeModified', function () { $('.icon-trash').closest('a:contains("Delete")').remove() });
    var Government = [{ Key: "0", Text: "" }, { Key: "1", Text: "Effective" }, { Key: "2", Text: "Adopted" }];
    var Category = [{ Key: "0", Text: "MC" }];
    var Area = [{ Key: "0", Text: "" }, { Key: "1", Text: "TC1" }, { Key: "2", Text: "TC2" }, { Key: "3", Text: "TC3" }];
    var ProportionalCode = [{ Key: "0", Text: "" }, { Key: "1", Text: "+" }, { Key: "2", Text: "-" }];

    var RateType = [{ Key: "0", Text: "" }, { Key: "1", Text: "SPECIFIC COMMODITY" }, { Key: "2", Text: "GENERAL CARGO" }];

    var DecimalPlace = [{ Key: "0", Text: "0" }, { Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }];

    var DirectionCode = [{ Key: "0", Text: "" }, { Key: "1", Text: "BTEWEEN/AND" }, { Key: "2", Text: "FROM/TO" }, { Key: "3", Text: "TO/FROM" }];

    var ActionCode = [{ Key: "0", Text: "" }, { Key: "1", Text: "ADD" }, { Key: "2", Text: "CHANGE" }, { Key: "3", Text: "DELETE" }];
    // Changes by Vipin Kumar
    //cfi.AutoComplete("OriginSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], OnSelectDestination, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CityCode", "TactRate_Origin", OnSelectDestination, "contains");

    //cfi.AutoComplete("OriginCountrySNo", "CountryCode", "Country", "SNo", "CountryCode", ["CountryCode"], ChangeCountry, "contains");
    cfi.AutoCompleteV2("OriginCountrySNo", "CountryCode", "TactRate_Country", ChangeCountry, "contains");

    //cfi.AutoComplete("DestinationSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], OnSelectOriginCity, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "CityCode", "TactRate_Origin", OnSelectOriginCity, "contains");

    //cfi.AutoComplete("CurrencyCode", "CurrencyCode", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
    cfi.AutoCompleteV2("CurrencyCode", "CurrencyCode", "TactRate_Currency", null, "contains");

    //cfi.AutoComplete("DestinationCountrySNo", "CountryCode", "Country", "SNo", "CountryCode", ["CountryCode"], ChangeDestination, "contains");
    cfi.AutoCompleteV2("DestinationCountrySNo", "CountryCode", "TactRate_Country", ChangeDestination, "contains");

    //cfi.AutoComplete("CommoditySNo", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityDescription"], null, "contains");
    cfi.AutoCompleteV2("CommoditySNo", "CommodityCode,CommodityDescription", "TactRate_Commodity", null, "contains");
    // Ends
    cfi.AutoCompleteByDataSource("Category", Category, null);
    cfi.AutoCompleteByDataSource("ActionCode", ActionCode, null);
    cfi.AutoCompleteByDataSource("GovernmentStatus", Government, null);
    cfi.AutoCompleteByDataSource("ProportionalCode", ProportionalCode, null);
    cfi.AutoCompleteByDataSource("DecimalPlace", DecimalPlace, null);
    cfi.AutoCompleteByDataSource("RateTypeSNo", RateType, FnGetCommodity);
    cfi.AutoCompleteByDataSource("DirectionCode", DirectionCode, null);
    //$('#RateTypeSNo').val(0);
    //$('#Text_RateTypeSNo').val('');
    //  cfi.AutoComplete("Category", "TactCategoryCode", "TactCategory", "TactCategoryCode", "TactCategoryCode", ["TactCategoryCode"], null, "contains");
    $('#Text_DecimalPlace').data("kendoAutoComplete").enable(false);
    $("#spnDecimalPlace").closest('td').find('font').text('');
    cfi.AutoCompleteByDataSource("AreaSNo", Area, null);
    CreateConditionGrid();
  
    
    $('#IntendedDate').attr('readOnly', true);
    $('#ExpiryDate').attr('readOnly', true);
    $('#ActualDate').attr('readOnly', true);
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var todaydate = new Date();
        $('#IntendedDate').data("kendoDatePicker").min(todaydate);
        $('#ActualDate').data("kendoDatePicker").min(todaydate);
       
        $('#ExpiryDate').data("kendoDatePicker").min(todaydate); 
    }
});
if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

    if (($("#ExpiryDate").val().indexOf('9999')) >= 0) {
        $("span#ExpiryDate").text('');
       
    }

}
//CreateSlabGrid();
if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
    $('#Rate').keypress(function (event) {
        var decimal = $('#Text_DecimalPlace').val();
        if (decimal != "0") {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) &&
              ((event.which < 48 || event.which > 57) &&
                (event.which != 0 && event.which != 8))) {
                event.preventDefault();
            }
            var text = $(this).val();
            if ((text.indexOf('.') != -1) &&
                 (text.substring(text.indexOf('.')).length > parseInt(decimal)) &&
                 (event.which != 0 && event.which != 8)) {
                event.preventDefault();
            }
        }
        else {

            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();

            }
        }
    });
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_OriginSNo") {
        try {
            cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_OriginCountrySNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    else if (textId == "Text_DestinationSNo") {

        try {
            cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_DestinationCountrySNo").data("kendoAutoComplete").key())

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }



    //if (textId == "Text_CommoditySNo") {
    //    try {


    //            cfi.setFilter(filterAirline, "CommodityDescription", "notin", $("#RateTypeSNo").val() == "1" ? "GENERAL CARGO" : "")

    //        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //        return OriginCityAutoCompleteFilter2;
    //    }
    //    catch (exp)
    //    { }
    //}


}

function FnGetCommodity(input) {
    var Ratetype = $("#RateTypeSNo").val();
    cfi.ResetAutoComplete('CommoditySNo')

    //if (textId.indexOf("OriginCountrySNo") >= 0 || (textId.indexOf("DestinationCountrySNo") >= 0)) {
    //    cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginCountrySNo", "DestinationCountrySNo").replace("Text_DestinationCountrySNo", "OriginCountrySNo")).val());

    //}
    //Specific Commodity
    if (Ratetype == "1") {
        // Changes by Vipin Kumar
        //cfi.AutoComplete("CommoditySNo", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityDescription"], null, "contains");
        cfi.AutoCompleteV2("CommoditySNo", "CommodityDescription", "TactRate_Commodity", null, "contains");
        //Ends
    }
        //General Cargo
    else if (Ratetype == "2") {
        // Changes by Vipin Kumar
        //cfi.AutoComplete("CommoditySNo", "CommodityDescription", "vTactCommodity", "SNo", "CommodityDescription", ["CommodityDescription"], null, "contains");
        cfi.AutoCompleteV2("CommoditySNo", "CommodityDescription", "TactRate_CommoditySNo", null, "contains");
        //Ends
    }
}


function ChangeCountry() {
    cfi.ResetAutoComplete("OriginSNo");

}

function ChangeDestination() {
    cfi.ResetAutoComplete("DestinationSNo");
}

$('#Minimum').bind("cut copy paste", function (e) {
    e.preventDefault();
});
function validate(el, evt) {
    var isSelected;
    if (el.selectionStart == 0 && el.selectionEnd == el.value.length)
        isSelected = true;
    else
        isSelected = false;
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var number = el.value.split('.');   
    //just one dot
    if (number.length > 1 && charCode == 46) {
        return false;
    }
    //get the carat position
    var caratPos = getSelectionStart(el);

    var dotPos = el.value.indexOf(".");

    if (number[0].length >= 8 && number.length != 2 && charCode != 46)
        return false;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57) ) {
        return false;
    }
    if (dotPos > -1) {
        if ((number[1].length > 2) && isSelected==false )
                return false;
       else if ((number[1].length > 2) && isSelected == true)
            return true;
            else
                return true;
        }        
    
    return true;
}


function getSelectionStart(o) {
    if (o.createTextRange) {
        var r = document.selection.createRange().duplicate()
        r.moveEnd('character', o.value.length)
        if (r.text == '') return o.value.length
        return o.value.lastIndexOf(r.text)
    } else return o.selectionStart
}
function CheckValidation(obj) {
    if ($("#" + obj).prop('checked') == true)//? 1 : 0
        $('#' + obj).val('1');
    else {
        $('#' + obj).val('0');

    }
}
function HideSpan() {
    //$('#Text_ULDClass').data("kendoAutoComplete").enable(true);
    $('#Text_Minimum').hide();
    $('#Text_Normal').hide();
    $('#Text_SlabValue1').hide(); ///+45
    $('#Text_SlabValue2').hide();//+100
    $('#Text_SlabValue3').hide();//+250
    $('#Text_SlabValue4').hide();//+300
    $('#Text_SlabValue5').hide();//+500
    $('#Text_SlabValue6').hide();//+1000

    $('#Minimum').show();
    $('#Normal').show();
    $('#SlabValue1').show(); ///+45
    $('#SlabValue2').show();//+100
    $('#SlabValue3').show();//+250
    $('#SlabValue4').show();//+300
    $('#SlabValue5').show();//+500
    $('#SlabValue6').show();//+1000
}


function ShowSpan() {
    //$('#Text_ULDClass').data("kendoAutoComplete").enable(false);
    $('#Text_Minimum').show();
    $('#Text_Normal').show();
    $('#Text_SlabValue1').show(); ///+45
    $('#Text_SlabValue2').show();//+100
    $('#Text_SlabValue3').show();//+250
    $('#Text_SlabValue4').show();//+300
    $('#Text_SlabValue5').show();//+500
    $('#Text_SlabValue6').show();//+1000

    $('#Minimum').hide();
    $('#Normal').hide();
    $('#SlabValue1').hide(); ///+45
    $('#SlabValue2').hide();//+100
    $('#SlabValue3').hide();//+250
    $('#SlabValue4').hide();//+300
    $('#SlabValue5').hide();//+500
    $('#SlabValue6').hide();//+1000
}
function CreateConditionGrid() {


    //debugger;    
    var PageHints = 0;
    var dbtableName = "TactRateSlab";
    $.ajax({
        url: "HtmlFiles/Rate/ManageTactRate.html", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tbl" + dbtableName).html(result);

            //success: function (result) {
            //    $("body").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'></form");
            //    $('#aspnetForm').on('submit', function (e) {
            //        e.preventDefault();
            //    });
            //    //added end pagehints 
            //    if (PageHints == 0) {
            //        $('#aspnetForm').append($("#tbl" + dbtableName) + result);
            //        //PageLoaded();
            //    }
            //    else {

            //    }

            //Changes By Vipin Kumar
            //cfi.AutoComplete("ULDClass", "RateClassCode", "ULDRateClass", "SNo", "RateClassCode", ["RateClassCode"], GetWeight, "contains");
            cfi.AutoCompleteV2("ULDClass", "RateClassCode", "TactRate_ULDClass", GetWeight, "contains");
            // Ends
            //$('#CommoditySNo').attr("data-required", "true");
            //if (PageType != "NEW")
            //{
            //    cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());

            //}
            if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
                ShowSpan();
               
                    $('#Text_ULDClass').data("kendoAutoComplete").enable(false);
               
                for (var i = 1; i <= 10; i++) {
                    $('#ChargeableWeight' + i).attr('disabled', true);
                    $('#txtUldRate' + i).attr('disabled', true);
                    $('#chk' + i).attr('disabled', true);
                }
            }
            else {
                HideSpan();
            }

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
                var CurrentRateSno = $("#hdnTactRateSlabSNo").val();
                $.ajax({
                    url: "Services/Rate/ManageTactRateService.svc/GetTactRate?RateSNo=" + CurrentRateSno, async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    //data: JSON.stringify({ RateSNo: CurrentRateSno }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var ArrayData = jQuery.parseJSON(result);
                        var Array = ArrayData.Table0;
                        var len = ArrayData.Table1.length;

                        if (len != '0') {
                            for (var i = 1; i <= len; i++) {
                                var Array1 = ArrayData.Table1[i - 1];
                                // alert(Array1);
                                var count = Array1.ULDNo;
                                $('#ChargeableWeight' + count).val(Array1.ULDWeight);
                                $('#txtUldRate' + count).val(Array1.ULDRate);
                                $('#chk' + count).prop('checked', true);
                                $('#chk' + count).val('1');
                            }
                        }
                        //$("input[type=radio][name=IsInclude][value=" + Array[0].IsInclude + "]").attr('checked', 1);
                        //$('#CommoditySNo').val($('#Multi_CommoditySNo').val());
                        if (Array.length != '0') {
                            $('#Minimum').val(Array[0].Minimum);
                            $('#Normal').val(Array[0].Normal);
                            $('#SlabValue1').val(Array[0].SlabValue1); ///+45
                            $('#SlabValue2').val(Array[0].SlabValue2);//+100
                            $('#SlabValue3').val(Array[0].SlabValue3);//+250
                            $('#SlabValue4').val(Array[0].SlabValue4);//+300
                            $('#SlabValue5').val(Array[0].SlabValue5);//+500
                            $('#SlabValue6').val(Array[0].SlabValue6);//+1000

                            $('#Text_Minimum').text(Array[0].Minimum);
                            $('#Text_Normal').text(Array[0].Normal);
                            $('#Text_SlabValue1').text(Array[0].SlabValue1); ///+45
                            $('#Text_SlabValue2').text(Array[0].SlabValue2);//+100
                            $('#Text_SlabValue3').text(Array[0].SlabValue3);//+250
                            $('#Text_SlabValue4').text(Array[0].SlabValue4);//+300
                            $('#Text_SlabValue5').text(Array[0].SlabValue5);//+500
                            $('#Text_SlabValue6').text(Array[0].SlabValue6);//+1000

                            $('#ULDClass').val(Array[0].ULDClass);
                            $('#Text_ULDClass').val(Array[0].Text_ULDClass);
                            $('span#Text_ULDWeight').text(Array[0].ULDWeight);
                            $('#ULDWeight').val(Array[0].ULDWeight);
                        }


                    }
                });

            }
            AuditLogBindOldValue('tblTactRateSlab');
        }

    });
}

function GetWeight() {

    if ($('#Text_ULDClass').val() != "") {
        ULDSNo = $('#ULDClass').val();
        $.ajax({
            url: "./Services/Rate/ManageTactRateService.svc/GetWeightRecord?SNo=" + ULDSNo, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {



                if (result.length > 0) {
                    $('span#Text_ULDWeight').text(JSON.parse(result).Table0[0].MinWeight);
                    $('#ULDWeight').val(JSON.parse(result).Table0[0].MinWeight);


                }
                else {
                    ShowMessage('warning', 'Warning - Tact Rate', " Minimum weight not found for this ULD Class!!");
                    $('#ULDClass').val('');
                    $('#Text_ULDClass').val('');
                }
            }
        });

    }


}

//function GetMessageReceived()
//{
//    $.ajax({
//        url: "./Services/Master/MessageTestService.svc/GetMessageReceived", async: false, type: "GET", dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {



//            if (result.length > 0) {
//                alert(result);


//            }
//            else {
//                ShowMessage('warning', 'Warning - Tact Rate', " Minimum weight not found for this ULD Class!!");

//            }
//        }
//    });

//}

$("#ButtonTest").click(function () {
    GetMessageReceived();
});


function OnSelectOriginCity(input) {
    var Text_OriginCity = $("#Text_OriginSNo").val().toUpperCase();

    var Text_DestinationCity = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginCity != "" && Text_DestinationCity != "") {

        if (Text_OriginCity == Text_DestinationCity) {
            ShowMessage('warning', 'Warning - Manage Tact Rate', 'Destination City can not be same as Origin City.', "bottom-right");
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }



    }



}
function OnSelectDestination(input) {
    var Text_OriginCity = $("#Text_OriginSNo").val().toUpperCase();

    var Text_DestinationCity = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginCity != "" && Text_DestinationCity != "") {

        if (Text_OriginCity == Text_DestinationCity) {
            ShowMessage('warning', 'Warning - Manage Tact Rate', 'Origin City can not be same as Destination City.', "bottom-right");
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }



    }
}

$('#OriginNumeric').attr('onblur', 'originnumeric(1);');
$('#DestinationNumeric').attr('onblur', 'originnumeric(2);');
function originnumeric(i) {

    if ($('#OriginNumeric').val() == $('#DestinationNumeric').val()) {

        if (i == 1 && $('#OriginNumeric').val() != "") {
            ShowMessage('warning', 'Warning - Manage Tact Rate', 'Origin City Numeric can not be same as Destination City Numeric.', "bottom-right");
            $("#OriginNumeric").val("");
        }

        else if (i == 2 && $('#DestinationNumeric').val() != "") {
            ShowMessage('warning', 'Warning - Manage Tact Rate', 'Origin City Numeric can not be same as Destination City Numeric.', "bottom-right");

            $("#DestinationNumeric").val("");
        }
    }

}


$("input[id^=IntendedDate]").change(function (e) {
   
    var intendeddate = $('#IntendedDate').val();
    $('#ActualDate').data("kendoDatePicker").min(intendeddate);
    $('#ExpiryDate').data("kendoDatePicker").min(intendeddate);
});

$("input[id^=ActualDate]").change(function (e) {

    var intended = $('#ActualDate').val();
    
    $('#ExpiryDate').data("kendoDatePicker").min(intended);
});


function checkslab($this) {
    var id = $($this).closest('td').find('input').attr('id');
   var currentvalue=$($this).closest('td').find('input').val();
   var previousvalue = $($this).closest('td').prev('td').find('input').val();
   var nextvalue = $($this).closest('td').next('td').find('input').val();
   if (id != 'Minimum') {
       if (parseFloat(currentvalue) > parseFloat(previousvalue)) {
           ShowMessage('warning', 'Warning - Manage Tact Rate', 'Rate Cannot be greater than previous rate', "bottom-right");
           $($this).closest('td').find('input').val('');
       }

       if (parseFloat(currentvalue) < parseFloat(nextvalue)) {
           ShowMessage('warning', 'Warning - Manage Tact Rate', 'Rate Cannot be smaller than next rate', "bottom-right");
           $($this).closest('td').find('input').val('');
       }
   }
   else
   {
       if (parseFloat(currentvalue) < parseFloat(nextvalue)) {
           ShowMessage('warning', 'Warning - Manage Tact Rate', 'Rate Cannot be smaller than next rate', "bottom-right");
           $($this).closest('td').find('input').val('');
       }

   }
}