var pageType = "";

$(document).ready(function () {
    pageType = getQueryStringValue("FormAction").toUpperCase();
    //alert(pageType);
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        $('#MasterSaveAndNew').after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Save" class="btn btn-success">');
        $("input[type='submit'][name='operation']").hide();


        cfi.AutoCompleteByDataSource("OriginLevel", Origin, FnGetOriginAC, null);
        cfi.AutoCompleteByDataSource("DestinationLevel", Destination, FnGetDestinationAC, null);
        cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
        cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");

        cfi.AutoCompleteByDataSource("Status", Status, null, null);
        cfi.AutoCompleteByDataSource("Type", Type, null, null);
        cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode@", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoCompleteByDataSource("TaxType", TaxType, null, null);
        cfi.AutoComplete("AirlineCode", "AirlineCode", "TaxRate_vwAirline", "SNo", "AirlineCode@", ["AirlineCode", "AirlineName"], GetAirlineCurrency, "contains");
        //cfi.AutoComplete("TaxDefinition", "TaxDefinition", "vwTaxDefinition", "SNo", "TaxDefinition", ["TaxDefinition"], null, "contains");
        cfi.AutoComplete("TaxAppliedOn", "TaxAppliedOn", "Tax_vwTaxAppliedOn", "SNo", "TaxAppliedOn", ["TaxAppliedOn"], null, "contains", ",");
        $('#_tempMinimum').val('0');
        $('#Minimum').val('0');

        $('#Tax').after('<span id="percent">%</span>');
        if (pageType == 'NEW') {
            $("#StartDate").data("kendoDatePicker").value("");
            $("#EndDate").data("kendoDatePicker").value("");
        }
        var todaydate = new Date();
        var validfromdate = $("#StartDate").data("kendoDatePicker");
        validfromdate.min(todaydate);
        var validTodate = $("#EndDate").data("kendoDatePicker");
        validTodate.min(todaydate);

        $("input[id^=EndDate]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("To", "From");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");
        });

        $("input[id^=StartDate]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("From", "To");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");

        });

        // GetTaxAppliedOnEdit();
        CreateTaxRateParamGrid();
        CreateRemarks();
        $('#tblRemarks').appendGrid('insertRow', 1, 0);
        //GetAirlineCurrency();
        //GetTaxAppliedOn();
        $("#btnSaveRateMaster").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                SaveTaxRateDetailsMaster("NEW");

            }
        });


    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if (getQueryStringValue("View") == "History") {
            $('#MasterDuplicate').hide();
            $("input[type ='button'][value='Edit']").hide();
            // $("input[type ='button'][value='Back']").hide();
            $("input[type ='button'][value='Back']").unbind("click").bind("click", function () {
                navigateUrl('Default.cshtml?Module=Rate&Apps=TaxLogs&FormAction=INDEXVIEW')
            });

        }
        CreateTaxRateParamGrid();
        CreateRemarks();
        //UserSubProcessRightswithoutsubprocess("divbody", true);

    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        $("input[type='submit'][name='operation']").after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Update" class="btn btn-success">');
        $("input[type='submit'][name='operation']").hide();
        cfi.AutoCompleteByDataSource("OriginLevel", Origin, FnGetOriginAC, null);
        cfi.AutoCompleteByDataSource("DestinationLevel", Destination, FnGetDestinationAC, null);
        cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
        cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
        cfi.AutoCompleteByDataSource("Status", Status, null, null);
        cfi.AutoCompleteByDataSource("Type", Type, null, null);
        cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode@", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoCompleteByDataSource("TaxType", TaxType, null, null);
        //cfi.AutoComplete("AirlineCode", "AirlineCode", "TaxRate_vwAirline", "SNo", "AirlineCode@", ["AirlineCode", "AirlineName"], GetAirlineCurrency, "contains");
        cfi.AutoComplete("AirlineCode", "AirlineCode", "TaxRate_vwAirline", "SNo", "AirlineCode@", ["AirlineCode", "AirlineName"], GetAirlineCurrency, "contains");
        //cfi.AutoComplete("TaxDefinition", "TaxDefinition", "vwTaxDefinition", "SNo", "TaxDefinition", ["TaxDefinition"], null, "contains");
        cfi.AutoComplete("TaxAppliedOn", "TaxAppliedOn", "Tax_vwTaxAppliedOn", "SNo", "TaxAppliedOn", ["TaxAppliedOn"], null, "contains", ",");
        if ($("#OriginLevel").val() == "1") {
                  
            // cfi.AutoComplete("OriginSNo", "CityCode,CityName", "City", "SNo", "CityCode@", ["CityCode", "CityName"], OnSelectOrigin, "contains");
            var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode@", ["CityCode", "CityName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
           
        } else if ($("#OriginLevel").val() == "2") {
                    
            //cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
            var dataSource = GetDataSource("OriginSNo", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
           
        }
        else {
            
            //cfi.AutoComplete("OriginSNo", "RegionName", "Region", "SNo", "RegionName@", ["RegionName"], OnSelectOrigin, "contains");

            var dataSource = GetDataSource("OriginSNo", "Tax_vwRegion", "SNo", "RegionName", ["RegionName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");
           

        }

        if ($("#DestinationLevel").val() == "1") {
           
            // cfi.AutoComplete("DestinationSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectDestination, "contains");
            var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityCode@", ["CityCode", "CityName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");


        } else if ($("#DestinationLevel").val() == "2") {
            
            //cfi.AutoComplete("DestinationSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectDestination, "contains");
            var dataSource = GetDataSource("DestinationSNo", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
                    
        }
        else {
           
            //cfi.AutoComplete("DestinationSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], OnSelectDestination, "contains");
            var dataSource = GetDataSource("DestinationSNo", "Tax_vwRegion", "SNo", "RegionName", ["RegionName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");
                       
        }
        $('#Tax').after('<span id="percent">%</span>');
        if ($('#REFNo').val() != "") {
            $('#REFNo').attr('disabled', true);
        }
        //$("#ValidFrom").data("kendoDatePicker").value("");
        //$("#ValidTo").data("kendoDatePicker").value("");
        var todaydate = new Date();
        var validfromdate = $("#StartDate").data("kendoDatePicker");
        validfromdate.min(todaydate);
        var validTodate = $("#EndDate").data("kendoDatePicker");
        validTodate.min(todaydate);

        $("input[id^=EndDate]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("To", "From");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");
        });

        $("input[id^=StartDate]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("From", "To");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");

        });

        // GetTaxAppliedOnEdit();
        CreateTaxRateParamGrid();
        CreateRemarks();
        $('#tblRemarks').appendGrid('insertRow', 1, 0);
        //$('#MasterSaveAndNew').show();

        $("#btnSaveRateMaster").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection()) {
                SaveTaxRateDetailsMaster("EDIT");
            }
        });


        //var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
        //var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
        //if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        //    $("#REFNo").val($("#Text_RateCardSNo").val() + "_" + Text_OriginSNo.split("-")[0] + "_" + Text_DestinationSNo.split("-")[0] + "_1");
        //}
        // onSelectRateCard();
        // onSelectAllotment();
    }

});

function GetAirlineCurrency() {
    var AirlineCode = $("#AirlineCode").val();
    if (AirlineCode != "") {
        $.ajax({
            url: "Services/Rate/TaxRateService.svc/GetAirlineCurrency?AirlineSNo=" + AirlineCode, async: true, type: "GET", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "" && result != null) {
                    var ResultData = jQuery.parseJSON(result);
                    if (ResultData.Table0.length > 0) {

                        $("#hdnCurrencySNo").val(ResultData.Table0[0].CurrencySNo);
                        $("#Text_CurrencySNo").val(ResultData.Table0[0].CurrencyCode);
                        $("#CurrencySNo").val(ResultData.Table0[0].CurrencySNo);


                    }
                    else {
                        $("#hdnCurrencySNo").val('');
                        $("#Text_CurrencySNo").val('');
                        $("#CurrencySNo").val('');
                    }
                }
            }
        });
    }
}

//function GetTaxAppliedOn() {


//    $.ajax({
//        url: "Services/Rate/TaxRateService.svc/GetTaxAppliedOn", async: true, type: "GET", cache: false, contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            if (result != "" && result != null) {
//                var ResultData = jQuery.parseJSON(result);
//                if (ResultData.Table0.length > 0) {
//                    $("#spnallotement").html("");
//                    $("#Text_AllotmentSNo").after("<span id='spnallotement' style='padding-left:40px;font-weight:BOLD;'>" + ResultData.Table0[0].AllotmentType + "</span>");
//                }
//            }
//        }
//    });

//}

$('#Tax').on('blur', function () {

    var amount = $('#Tax').val();
    //var minimum = $('#Minimum').val();
    //if (amount == 0 && minimum == 0) {
    //    ShowMessage('warning', 'Warning - Tax Rate', "Amount & Minimum cannot be 0");
    //    return false;
    //}
    if (amount == 0) {
        ShowMessage('warning', 'Warning - Tax Rate', "Tax cannot be 0");
        $('#Tax').val('');
        $('#_tempTax').val('')
        return false;
    }
    //if (minimum == 0) {
    //    ShowMessage('warning', 'Warning - Tax Rate', "Minimum cannot be 0");
    //    return false;
    //}
});

//$('#Minimum').on('blur', function () {
//    var minimum = $('#Minimum').val();
//    if (minimum == 0) {
//        ShowMessage('warning', 'Warning - Tax Rate', "Minimum cannot be 0");
//        $('#Minimum').val('');
//        $('#_tempMinimum').val('')
//        return false;
//    }
//});


function OnSelectOriginCity(input) {
    var Text_OriginCitySNo = $("#Multi_OriginCitySNo").val();
    var Text_DestinationCitySNo = $("#Multi_DestinationCitySNo").val();
    if (Text_OriginCitySNo != "" && Text_DestinationCitySNo != "") {
        if (Text_OriginCitySNo == Text_DestinationCitySNo) {
            ShowMessage('warning', 'Warning - Tax Rate', "Origin City can not be same as Destination City.", "bottom-right");
            $("#Multi_DestinationCitySNo").val("");
            $("#DestinationCitySNo").val("");

        }
    }
}
function OnSelectDestinationCity(input) {
    var Text_OriginCitySNo = $("#Multi_OriginCitySNo").val();
    var Text_DestinationCitySNo = $("#Multi_DestinationCitySNo").val();
    if (Text_OriginCitySNo != "" && Text_DestinationCitySNo != "") {
        if (Text_OriginCitySNo == Text_DestinationCitySNo) {
            ShowMessage('warning', 'Warning - Tax Rate', "Destination City can not be same as Origin City.", "bottom-right");
            $("#Multi_DestinationCitySNo").val("");
            $("#DestinationCitySNo").val("");

        }
    }
}
function OnSelectOriginCountry(input) {
    var Text_OriginCountrySNo = $("#Multi_OriginCountrySNo").val();
    var Text_DestinationCountrySNo = $("#Multi_DestinationCountrySNo").val();
    if (Text_OriginCountrySNo != "" && Text_DestinationCountrySNo != "") {
        if (Text_OriginCountrySNo == Text_DestinationCountrySNo) {
            ShowMessage('warning', 'Warning - Tax Rate', "Origin Country can not be same as Destination Country.", "bottom-right");
            $("#Multi_OriginCountrySNo").val("");
            $("#OriginCountrySNo").val("");

        }
    }
}
function OnSelectDestinationCountry(input) {
    var Text_OriginCountrySNo = $("#Multi_OriginCountrySNo").val();
    var Text_DestinationCountrySNo = $("#Multi_DestinationCountrySNo").val();
    if (Text_OriginCountrySNo != "" && Text_DestinationCountrySNo != "") {
        if (Text_OriginCountrySNo == Text_DestinationCountrySNo) {
            ShowMessage('warning', 'Warning - Tax Rate', "Destination Country can not be same as Origin Country.", "bottom-right");
            $("#Multi_DestinationCountrySNo").val("");
            $("#DestinationCountrySNo").val("");

        }
    }
}

function OnSelectOrigin(input) {
    var Origin = $("#Text_OriginLevel").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        //if (Origin == "COUNTRY") {
        //    if (Text_OriginSNo == Text_DestinationSNo) {
        //        ShowMessage('warning', 'Warning - Tax Rate', 'Origin Country can not be same as Destination Country.', "bottom-right");
        //        $("#Text_DestinationSNo").val("");
        //        $("#DestinationSNo").val("");
        //    }

        //}else 
        if (Origin == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Tax Rate', "Origin City can not be same as Destination City.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }
        }
        //else if (Origin == "REGION") {
        //    if (Text_OriginSNo == Text_DestinationSNo) {
        //        ShowMessage('warning', 'Warning - Tax Rate', "Origin Region can not be same as Region City.", "bottom-right");
        //        $("#Text_DestinationSNo").val("");
        //        $("#DestinationSNo").val("");

        //    }
        //}
    }



}
function OnSelectDestination(input) {
    var Destination = $("#Text_DestinationLevel").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        //if (Destination == "COUNTRY") {
        //    if (Text_OriginSNo == Text_DestinationSNo) {
        //        ShowMessage('warning', 'Warning - Tax Rate', "Destination Country can not be same as Origin Country.", "bottom-right");
        //        $("#Text_DestinationSNo").val("");
        //        $("#DestinationSNo").val("");

        //    }
        //}else
        if (Destination == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Tax Rate', "Destination City can not be same as Origin City.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }

        }
        //else if (Destination == "REGION") {
        //    if (Text_OriginSNo == Text_DestinationSNo) {
        //        ShowMessage('warning', 'Warning - Tax Rate', "Destination Region can not be same as Origin Region.", "bottom-right");
        //        $("#Text_DestinationSNo").val("");
        //        $("#DestinationSNo").val("");

        //    }

        //}
    }
    //if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
    //    $("#REFNo").val($("#Text_RateCardSNo").val() + "_" + Text_OriginSNo.split("-")[0] + "_" + Text_DestinationSNo.split("-")[0] + "_1");
    //}

}



var Status = [{ Key: "1", Text: "Active" }, { Key: "2", Text: "Draft" }, { Key: "3", Text: "In Active" }, { Key: "4", Text: "Expired" }];
var Type = [{ Key: "0", Text: "DueAgent " }, { Key: "1", Text: "DueCarrier " }, ]
var Origin = [{ Key: "1", Text: "CITY" }, { Key: "2", Text: "COUNTRY" }, { Key: "3", Text: "REGION" }];
var Destination = [{ Key: "1", Text: "CITY" }, { Key: "2", Text: "COUNTRY" }, { Key: "3", Text: "REGION" }];
var TaxType = [{ Key: "0", Text: "Domestic" }, { Key: "1", Text: "International" }, { Key: "2", Text: "Both" }];


var currentRateSNo = 0;
function FnGetOriginAC(input) {
   
    var Origin = $("#Text_OriginLevel").val().toUpperCase();
    //$("#Text_OriginSNo").val("");
    //$("#OriginSNo").val("");
    if (Origin == "CITY") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            //cfi.AutoComplete("OriginSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectOrigin, "contains");
            //alert(1)
            //$("#Text_OriginSNo").val("");
            //$("#OriginSNo").val("");
            var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode@", ["CityCode", "CityName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
        else {
            var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode@", ["CityCode", "CityName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
            
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
    }

    else if (Origin == "COUNTRY") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            
            //cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
            //alert(11)
            //$("#Text_OriginSNo").val("");
            //$("#OriginSNo").val("");
            var dataSource = GetDataSource("OriginSNo", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
          
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
        else {
            
            var dataSource = GetDataSource("OriginSNo", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
           
            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
    }
    else if (Origin == "REGION") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            //cfi.AutoComplete("OriginSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], OnSelectOrigin, "contains");
            //$("#Text_OriginSNo").val("");
            //$("#OriginSNo").val("");
            var dataSource = GetDataSource("OriginSNo", "Tax_vwRegion", "SNo", "RegionName", ["RegionName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");

            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
        else {
            var dataSource = GetDataSource("OriginSNo", "Tax_vwRegion", "SNo", "RegionName", ["RegionName"])
            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");

            $("#Text_OriginSNo").val("");
            $("#OriginSNo").val("");
        }
    }


}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationLevel").val().toUpperCase();
    //$("#Text_DestinationSNo").val("");
    //$("#DestinationSNo").val("");
    if (Destination == "CITY") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            //cfi.AutoComplete("DestinationSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectDestination, "contains");
            //$("#Text_DestinationSNo").val("");
            //$("#DestinationSNo").val("");
            var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityCode@", ["CityCode", "CityName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");

            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        else {
            var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityCode@", ["CityCode", "CityName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");

            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
    }

    else if (Destination == "COUNTRY") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            //cfi.AutoComplete("DestinationSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectDestination, "contains");
            //$("#Text_DestinationSNo").val("");
            //$("#DestinationSNo").val("");
            var dataSource = GetDataSource("DestinationSNo", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        else {
            var dataSource = GetDataSource("DestinationSNo", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
    }
    else if (Destination == "REGION") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            //cfi.AutoComplete("DestinationSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], OnSelectDestination, "contains");
            //$("#Text_DestinationSNo").val("");
            //$("#DestinationSNo").val("");
            var dataSource = GetDataSource("DestinationSNo", "Tax_vwRegion", "SNo", "RegionName", ["RegionName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");

            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
        else {
            var dataSource = GetDataSource("DestinationSNo", "Tax_vwRegion", "SNo", "RegionName", ["RegionName"])
            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");

            $("#Text_DestinationSNo").val("");
            $("#DestinationSNo").val("");
        }
    }


}

//function CheckValidation(input) {

//}
//function CheckValueValidation(input) {

//}
//function ChangeUnitType(input) {

//}

function CreateRemarks() {
    //divReference
    var dbtableName = "Remarks";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnTaxRateSNo").val() || 1, //$("#hdnRateSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/TaxRateService.svc",
        getRecordServiceMethod: "GetRemarks",
        deleteServiceMethod: "",
        caption: "Remarks",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
                 { name: "Remarks", display: "Remark", type: "textarea", ctrlAttr: { maxlength: 500, }, ctrlCss: { width: "350px", height: "40px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
        isPaging: true,
        //hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? true : true, removeLast: true }
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? true : false, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });

    $('#tblRemarks button.insert,#tblRemarks button.remove').hide();
    $("#tblRemarks button.removeLast").hide();
    $("#RemarksCount").val($("[id^='tblRemarks_Remarks_']").length);
    // Buttons at footer row

    $('#tblRemarks button.append,#tblRemarks button.removeLast').hide();

    //$("tr[id^='tblRemarks_Row']").each(function (row, tr) {
    //    if ($(tr).find("input[id^='tblRemarks_Remarks_']").val() != "") {
    //        $(tr).find("input[id^='tblRemarks_Remarks_']").attr("disabled", true);
    //        $(tr).find("input[id^='tblRemarks_Remarks_']").attr("enabled", false);
    //    }

    //});


}



//AirlineCode   tempMinimum

function SaveTaxRateDetailsMaster(input) {
    //$("#btnSaveRateMaster").hide();
    var TaxAmount = 0;
    var minimum = 0;
    if ($("#ApplicableTaxAmount").val() != "") {
        TaxAmount = $("#ApplicableTaxAmount").val();
    }
    var strType = 2;
    if ($("#Type").val() != "") {
        strType = $("#Type").val();
    }
    var strTaxAppliedOn = "";
    if ($("#TaxAppliedOn").val() == "1") {
        strTaxAppliedOn = '2,3,4,5,6,7,8';
    }
    else {
        strTaxAppliedOn = $("#TaxAppliedOn").val() || $("input[id^='Multi_TaxAppliedOn']").val();
    }
    if ($("#Minimum").val() != '') {
        minimum = $("#Minimum").val()
    }

    var TaxRateRemarksarray = [];
    var RateParamArray = [];

    var TaxRateViewModel = {
        SNo: $("#hdnTaxRateSNo").val() || 0,
        AirlineCodeSNo: $("#AirlineCode").val() || 0,
        TaxType: $("#TaxType").val() || 0,
        TaxCode: $("#TaxCode").val(),
        TaxName: $("#TaxName").val(),
        //TaxDefination: $("#TaxDefinition").val() || 0,
        Refundable: parseInt($("#Refundable").val()) || 0,

        StartDate: $("#StartDate").val(),
        EndDate: $("#EndDate").val(),
        ReferenceNo: $("#REFNo").val(),
        OriginLevel: $("#OriginLevel").val() || 0,
        OriginCitySno: $("#OriginSNo").val() || 0,
        DestinationLevel: parseInt($("#DestinationLevel").val()) || 0,
        DestinationCitySNo: $("#DestinationSNo").val() || 0,
        //Tax: $("#Tax").val() || 0.0,
        TaxApplicableAt: $("input[name=AppliedAt]:checked").val() || 0,
        CurrencySNo: $("#CurrencySNo").val() || 0,
        //TaxApplicableAt: parseInt($("#TaxApplicableAt").val()) || 0,
        MinimumCharges: minimum,
        Tax: $("#Tax").val() || 0,
        TaxApplicableOn: strTaxAppliedOn,
        Status: $("#Status").val() || 0,
        Type: strType,
        ApplicableTaxAmount: TaxAmount,

    }

    //var RateRemarks = $("#tblRemarks").serializeToJSON();
    $("tr[id^='tblRemarks_Row']").each(function (row, tr) {
        var TaxRateRemarksViewModel = {
            SNo: 0,
            TaxRateSNo: 0,
            Remarks: $(tr).find("input[id^='tblRemarks_Remarks_']").val()
        }
        TaxRateRemarksarray.push(TaxRateRemarksViewModel);

    });

    var OriginCity = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        CitySNo: $("#OriginCitySNo").val() || $("input[id^='Multi_OriginCitySNo']").val(),
        IsExclude: $("input[name='IE1']:checked").val(),
    }

    var OriginCountry = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        CountrySNo: $("#OriginCountrySNo").val() || $("input[id^='Multi_OriginCountrySNo']").val(),
        IsExclude: $("input[name='IE2']:checked").val(),
    }

    var DestinationCity = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        DestinationCitySNo: $("#DestinationCitySNo").val() || $("input[id^='Multi_DestinationCitySNo']").val(),
        IsExclude: $("input[name='IE3']:checked").val(),
    }

    var DestinationCountry = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        DestinationCountrySNo: $("#DestinationCountrySNo").val() || $("input[id^='Multi_DestinationCountrySNo']").val(),
        IsExclude: $("input[name='IE4']:checked").val(),
    }

    var AgentName = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        AgentSno: $("#AccountSNo").val() || $("input[id^='Multi_AccountSNo']").val(),
        IsExclude: $("input[name='IE5']:checked").val(),
    }

    var ShipperName = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        AgentShipperAccountSno: $("#ShipperSNo").val() || $("input[id^='Multi_ShipperSNo']").val(),
        IsExclude: $("input[name='IE6']:checked").val(),
    }

    var ProductName = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        ProductSno: $("#ProductSNo").val() || $("input[id^='Multi_ProductSNo']").val(),
        IsExclude: $("input[name='IE7']:checked").val(),
    }

    var CommodityName = {
        SNo: 0,
        TaxRateSNo: $("#hdnTaxRateSNo").val() || 0,
        CommoditySno: $("#CommoditySNo").val() || $("input[id^='Multi_CommoditySNo']").val(),
        IsExclude: $("input[name='IE8']:checked").val(),
    }

    var OtherChargeCode = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        OtherChargeCodeSNo: $("#OtherChargeSNo").val() || $("input[id^='Multi_OtherChargeSNo']").val(),
        IsExclude: $("input[name='IE9']:checked").val(),
    }

    var IssueCarrier = {
        SNo: 0,
        RateAirlineTaxMasterSNo: $("#hdnTaxRateSNo").val() || 0,
        IssueAirlinecarrierSNo: $("#ICAirlineSNo").val() || $("input[id^='Multi_ICAirlineSNo']").val(),
        IsExclude: $("input[name='IE10']:checked").val(),
    }


    //debugger;
    if (input == 'NEW') {
        $.ajax({
            url: "Services/Rate/TaxRateService.svc/SaveTaxRateDetais", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ TaxRateSNo: $("#hdnTaxRateSNo").val() || 1, PerformAction: input, TaxRateDetails: TaxRateViewModel, TaxRateRemarks: TaxRateRemarksarray, TaxRateOriginCity: OriginCity, TaxRateOriginCountry: OriginCountry, TaxRateDestinationCity: DestinationCity, TaxRateDestinationCountry: DestinationCountry, TaxRateProduct: ProductName, TaxRateCommodity: CommodityName, TaxRateAgent: AgentName, TaxRateAgentShipper: ShipperName, TaxRateOtherChargeCode: OtherChargeCode, TaxRateIssueCarrier: IssueCarrier }),//  }),//, TaxRateCommodity: CommodityName,  }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != null && result != "") {

                    var MsgTable = jQuery.parseJSON(result);
                    var MsgData = MsgTable.Table0;
                    if (MsgData[0].ErrorMessage == "Tax Rate Already Exists") {
                        // navigateUrl('Default.cshtml?Module=Rate&Apps=TaxRate&FormAction=INDEXVIEW');
                        ShowMessage('warning', 'warning - Tax Rate', "Tax Rate Already Exists", "bottom-right");
                    }
                    else {

                        $("input[type='submit'][name='operation'][value='Save']").click();
                        //navigateUrl('Default.cshtml?Module=Rate&Apps=TaxRate&FormAction=INDEXVIEW');
                        //ShowMessage('success', 'Success - Tax Rate', "Tax Rate Details Successfully Saved", "bottom-right");
                    }


                }
                else {

                }
            }

        });
    }
    if (input == 'EDIT') {
        var ErrorMessage = 'Tax Rate already exists.Do you want to split';
        $.ajax({
            url: "Services/Rate/TaxRateService.svc/UpdateTaxRateDetais", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ TaxRateSNo: $("#hdnTaxRateSNo").val() || 1, PerformAction: input, TaxRateDetails: TaxRateViewModel, TaxRateRemarks: TaxRateRemarksarray, TaxRateOriginCity: OriginCity, TaxRateOriginCountry: OriginCountry, TaxRateDestinationCity: DestinationCity, TaxRateDestinationCountry: DestinationCountry, TaxRateProduct: ProductName, TaxRateCommodity: CommodityName, TaxRateAgent: AgentName, TaxRateAgentShipper: ShipperName, TaxRateOtherChargeCode: OtherChargeCode, TaxRateIssueCarrier: IssueCarrier, ErrorMSG: ErrorMessage }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != null && result != "") {
                    //  navigateUrl('Default.cshtml?Module=Rate&Apps=TaxRate&FormAction=INDEXVIEW');
                    // ShowMessage('success', 'Success - Tax Rate', "Rate Details Successfully Saved", "bottom-right");
                    $("input[type='submit'][name='operation'][value='Update']").click();
                }
            }
        });
    }


}
function OnSuccessGrid() {
    $("table[class='k-focusable k-selectable']").find("tr").each(function (row, tr) {
        var Status = $(tr).find("td[data-column='Status'] span").attr("title");
        //$(tr).find('td:first input[name^="faction"]').each(function () {
        //    $(this).prop('checked', false);
        //});
        if ($(tr).find("td[data-column='Status'] span").attr("title").toUpperCase() == "EXPIRED") {
            // $(tr).find('div[id$="user-options"]').remove();

            $(tr).find("input[name^='faction']").parent().unbind("click").bind("click", function () {
                return false;
            });
        }
    });
}

function GetTaxRateParameterForRead() {
    var CurrentTaxRateSno = parseInt($("#hdnTaxRateSNo").val());
    $.ajax({
        url: "Services/Rate/TaxRateService.svc/GetTaxRateParameter",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            TaxRateSNo: CurrentTaxRateSno
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // if (result.substring(1, 2) == "{") {
            // var myData = jQuery.parseJSON(result);

            var ArrayData = jQuery.parseJSON(result);
            var Array = ArrayData.Table0;

            cfi.BindMultiValue("OriginCitySNo", Array[0].Text_OriginCitySNo, Array[0].OriginCitySNo);
            if (Array[0].IE1 == "True")
                $('input[type=radio][name=IE1][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE1][value=0]').attr('checked', true);

            $('#Text_OriginCitySNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE1"]').attr("disabled", true);

            cfi.BindMultiValue("OriginCountrySNo", Array[0].Text_OriginCountrySNo, Array[0].OriginCountrySNo);
            if (Array[0].IE2 == "True")
                $('input[type=radio][name=IE2][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE2][value=0]').attr('checked', true);
            $('#Text_OriginCountrySNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE2"]').attr("disabled", true);

            cfi.BindMultiValue("DestinationCitySNo", Array[0].Text_DestinationCitySNo, Array[0].DestinationCitySNo);
            if (Array[0].IE3 == "True")
                $('input[type=radio][name=IE3][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE3][value=0]').attr('checked', true);;
            $('#Text_DestinationCitySNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE3"]').attr("disabled", true);

            cfi.BindMultiValue("DestinationCountrySNo", Array[0].Text_DestinationCountrySNo, Array[0].DestinationCountrySNo);
            if (Array[0].IE4 == "True")
                $('input[type=radio][name=IE4][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE4][value=0]').attr('checked', true);
            $('#Text_DestinationCountrySNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE4"]').attr("disabled", true);

            cfi.BindMultiValue("AccountSNo", Array[0].Text_AccountSNo, Array[0].AccountSNo);
            if (Array[0].IE5 == "True")
                $('input[type=radio][name=IE5][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE5][value=0]').attr('checked', true);
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE5"]').attr("disabled", true);

            cfi.BindMultiValue("ShipperSNo", Array[0].Text_ShipperSNo, Array[0].ShipperSNo);
            if (Array[0].IE6 == "True")
                $('input[type=radio][name=IE6][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE6][value=0]').attr('checked', true);
            $('#Text_ShipperSNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE6"]').attr("disabled", true);

            cfi.BindMultiValue("ProductSNo", Array[0].Text_ProductSNo, Array[0].ProductSNo);
            if (Array[0].IE7 == "True")
                $('input[type=radio][name=IE7][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE7][value=0]').attr('checked', true);
            $('#Text_ProductSNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE7"]').attr("disabled", true);

            cfi.BindMultiValue("CommoditySNo", Array[0].Text_CommoditySNo, Array[0].CommoditySNo);
            if (Array[0].IE8 == "True")
                $('input[type=radio][name=IE8][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE8][value=0]').attr('checked', true);
            $('#Text_CommoditySNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE8"]').attr("disabled", true);


            cfi.BindMultiValue("OtherChargeSNo", Array[0].Text_OtherChargeSNo, Array[0].OtherChargeSNo);
            if (Array[0].IE9 == "True")
                $('input[type=radio][name=IE9][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE9][value=0]').attr('checked', true);
            $('#Text_OtherChargeSNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE9"]').attr("disabled", true);

            cfi.BindMultiValue("ICAirlineSNo", Array[0].Text_ICAirlineSNo, Array[0].ICAirlineSNo);
            if (Array[0].IE10 == "True")
                $('input[type=radio][name=IE10][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE10][value=0]').attr('checked', true);
            $('#Text_ICAirlineSNo').data("kendoAutoComplete").enable(false);
            $('input[type="radio"][name="IE10"]').attr("disabled", true);

            $('[id*="tblRemarks_Remarks_"]').each(function () {
                if ($("#" + this.id).val() != "") {
                    $("#" + this.id).attr("disabled", true);
                }
                else {
                    $("#" + this.id).closest("tr").hide();
                }
            });
            //BindMultipleValues();
            // }

        }
    });
}

function GetTaxRateParameterForEdit() {
    var CurrentTaxRateSno = parseInt($("#hdnTaxRateSNo").val());
    $.ajax({
        url: "Services/Rate/TaxRateService.svc/GetTaxRateParameter",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            TaxRateSNo: CurrentTaxRateSno
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            //  if (result.substring(1, 2) == "{") {
            // var myData = jQuery.parseJSON(result);

            var ArrayData = jQuery.parseJSON(result);
            var Array = ArrayData.Table0;

            cfi.BindMultiValue("OriginCitySNo", Array[0].Text_OriginCitySNo, Array[0].OriginCitySNo);
            if (Array[0].IE1 == "True")
                $('input[type=radio][name=IE1][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE1][value=0]').attr('checked', true);

            cfi.BindMultiValue("OriginCountrySNo", Array[0].Text_OriginCountrySNo, Array[0].OriginCountrySNo);
            if (Array[0].IE2 == "True")
                $('input[type=radio][name=IE2][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE2][value=0]').attr('checked', true);

            cfi.BindMultiValue("DestinationCitySNo", Array[0].Text_DestinationCitySNo, Array[0].DestinationCitySNo);
            if (Array[0].IE3 == "True")
                $('input[type=radio][name=IE3][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE3][value=0]').attr('checked', true);;

            cfi.BindMultiValue("DestinationCountrySNo", Array[0].Text_DestinationCountrySNo, Array[0].DestinationCountrySNo);
            if (Array[0].IE4 == "True")
                $('input[type=radio][name=IE4][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE4][value=0]').attr('checked', true);

            cfi.BindMultiValue("AccountSNo", Array[0].Text_AccountSNo, Array[0].AccountSNo);
            if (Array[0].IE5 == "True")
                $('input[type=radio][name=IE5][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE5][value=0]').attr('checked', true);

            cfi.BindMultiValue("ShipperSNo", Array[0].Text_ShipperSNo, Array[0].ShipperSNo);
            if (Array[0].IE6 == "True")
                $('input[type=radio][name=IE6][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE6][value=0]').attr('checked', true);

            cfi.BindMultiValue("ProductSNo", Array[0].Text_ProductSNo, Array[0].ProductSNo);
            if (Array[0].IE7 == "True")
                $('input[type=radio][name=IE7][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE7][value=0]').attr('checked', true);

            cfi.BindMultiValue("CommoditySNo", Array[0].Text_CommoditySNo, Array[0].CommoditySNo);
            if (Array[0].IE8 == "True")
                $('input[type=radio][name=IE8][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE8][value=0]').attr('checked', true);

            cfi.BindMultiValue("OtherChargeSNo", Array[0].Text_OtherChargeSNo, Array[0].OtherChargeSNo);
            if (Array[0].IE9 == "True")
                $('input[type=radio][name=IE9][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE9][value=0]').attr('checked', true);

            cfi.BindMultiValue("ICAirlineSNo", Array[0].Text_ICAirlineSNo, Array[0].ICAirlineSNo);
            if (Array[0].IE10 == "True")
                $('input[type=radio][name=IE10][value=1]').attr('checked', true);
            else
                $('input[type=radio][name=IE10][value=0]').attr('checked', true);

            //$('[id*="tblRemarks_Remarks_"]').each(function () {
            //    if ($("#" + this.id).val() != "") {
            //        $("#" + this.id).attr("disabled", true);
            //    }
            //    else {
            //        $("#" + this.id).closest("tr").hide();
            //    }
            //});
            $('[id*="tblRemarks_Remarks_"]').each(function () {
                if ($("#" + this.id).val() != "") {
                    $("#" + this.id).attr("disabled", true);
                }
            });
            //}
        }

    });
}
function GetTaxAppliedOnEdit() {
    var CurrentTaxRateSno = parseInt($("#hdnTaxRateSNo").val());
    $.ajax({
        url: "Services/Rate/TaxRateService.svc/GetTaxAppliedOnEdit",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            TaxRateSNo: CurrentTaxRateSno
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            // if (result.substring(1, 2) == "{") {
            // var myData = jQuery.parseJSON(result);
            var ArrayData = jQuery.parseJSON(result);
            var Array = ArrayData.Table0;
            cfi.BindMultiValue("TaxAppliedOn", Array[0].Text_TaxAppliedOn, Array[0].TaxAppliedOn);
            // }
        }
    });

}


function CreateTaxRateParamGrid() {
    //debugger;    
    var dbtableName = "RateParam";
    $.ajax({
        url: "HtmlFiles/Rate/TaxRateCondition.html", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tbl" + dbtableName).html(result);

            cfi.AutoComplete("OriginCitySNo", "CityCode,CityName", "City", "SNo", "CityCode@", ["CityCode", "CityName"], OnSelectOriginCity, "contains", ",");
            cfi.AutoComplete("OriginCountrySNo", "CountryCode,CountryName", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"], OnSelectOriginCountry, "contains", ",");
            cfi.AutoComplete("DestinationCitySNo", "CityCode,CityName", "City", "SNo", "CityCode@", ["CityCode", "CityName"], OnSelectOriginCity, "contains", ",");
            cfi.AutoComplete("DestinationCountrySNo", "CountryCode,CountryName", "vw_TaxRateCountry", "SNo", "CountryCode@", ["CountryCode", "CountryName"], OnSelectDestinationCountry, "contains", ",");
            cfi.AutoComplete("AccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
            cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");


            cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains", ",");
            cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNO", "CommodityCode@", ["CommodityCode", "CommodityDescription"], null, "contains", ",", null, null, null, null, true);
            cfi.AutoComplete("OtherChargeSNo", "Code,Name", "DueCarrier", "SNo", "Code", ["Code", "Name"], null, "contains", ",");
            cfi.AutoComplete("ICAirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode@", ["CarrierCode", "AirlineName"], null, "contains", ",");

            if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
                GetTaxRateParameterForRead();
                UserSubProcessRightswithoutsubprocess("divRateParam", true);
            }
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

                GetTaxAppliedOnEdit();
                GetTaxRateParameterForEdit();

            }
            //$('input[type=radio][name^=IE][value=0]').each(function () {
            //    $('input[type=radio][name^=IE][value=0]').attr('checked', true);
            //    //$('input[type=radio][name^=IE][value=1]').removeAttr('checked');
            //});
            // $("#btnSave").unbind("click").bind("click", function () {




            //if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
            //    var CurrentTaxRateSno = parseInt($("#hdnTaxRateSNo").val());
            //    $.ajax({
            //        url: "Services/Rate/TaxRateService.svc/GetTaxRateParameter",
            //        async: false,
            //        type: "GET",
            //        dataType: "json",
            //        data: {
            //            TaxRateSNo: CurrentTaxRateSno
            //        },
            //        contentType: "application/json; charset=utf-8",
            //        success: function (result) {
            //            //if (result.substring(1, 2) == "{") {
            //                var ArrayData = jQuery.parseJSON(result);
            //                var Array = ArrayData.Table0;
            //                //  var myData = jQuery.parseJSON(result);
            //                alert(myData);

            //            }
            //        //}
            //    });

            //}
        }

    });


    // $("#tbl" + dbtableName).css("border", "1px");


}


function ExtraCondition(textId) {
    var country = "";
  
    setTimeout(100);
    
    var filterOriginCitySNo = cfi.getFilter("AND");
    var filterOriginCountrySNo = cfi.getFilter("AND");
    var filterICAirlineSNo = cfi.getFilter("AND");
    var filterDestinationCitySNo = cfi.getFilter("AND");
    var filterDestinationCountrySNo = cfi.getFilter("AND");
    var filterAccountSNo = cfi.getFilter("AND");
    var filterShipperSNo = cfi.getFilter("AND");
    var filterCommoditySNo = cfi.getFilter("AND");
    var filterProductSNo = cfi.getFilter("AND");
    var filterOtherChargeSNo = cfi.getFilter("AND");
    var filterTaxAppliedSNo = cfi.getFilter("AND");
    var filterCurrencySNo = cfi.getFilter("AND");

    //if (textId.indexOf("Text_CurrencySNo") >= 0) {
    //    var filter0 = cfi.getFilter("AND");
    //   // if ($("#hdnCurrencySNo").val() != '')
    //   //    cfi.setFilter(filter0, "SNO", "in", $("#hdnCurrencySNo").val());
    //   cfi.setFilter(filter0, "SNO", "eq", $("#hdnCurrencySNo").val());
    //    filterCurrencySNo = cfi.autoCompleteFilter(filter0);
    //    return filterCurrencySNo;
    //}textId.indexOf("Text_AirlineSNo") >= 0

    if (textId.indexOf("Text_ICAirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNO", "notin", $("#Text_ICAirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter1, "IsActive", "eq", 1);
        filterICAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterICAirlineSNo;
    }

    else if (textId.indexOf("Text_AccountSNo") >= 0) {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "SNO", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter2, "AccountTypeSNo", "eq", 56);
        filterAccountSNo = cfi.autoCompleteFilter(filter2);
        return filterAccountSNo;
    }
    else if (textId.indexOf("Text_ShipperSNo") >= 0) {
        var filter3 = cfi.getFilter("AND");
        cfi.setFilter(filter3, "SNO", "notin", $("#Text_ShipperSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter3, "AccountTypeSNo", "eq", 66);
        filterShipperSNo = cfi.autoCompleteFilter(filter3);
        return filterShipperSNo;
    }
    else if (textId.indexOf("Text_CommoditySNo") >= 0) {
        var filter4 = cfi.getFilter("AND");
        cfi.setFilter(filter4, "SNO", "notin", $("#Text_CommoditySNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter4, "IsActive", "eq", 1);
        filterCommoditySNo = cfi.autoCompleteFilter(filter4);
        return filterCommoditySNo;
    }
    else if (textId.indexOf("Text_ProductSNo") >= 0) {
        var filter8 = cfi.getFilter("AND");
        cfi.setFilter(filter8, "SNO", "notin", $("#Text_ProductSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter8, "IsActive", "eq", 1);
        filterProductSNo = cfi.autoCompleteFilter(filter8);
        return filterProductSNo;
    }
        // filter for domestic and international  date 18-05-2017
    else if (textId == "OriginSNo") {
   
        var filter5 = cfi.getFilter("AND");
        cfi.setFilter(filter5, "SNO", "notin", $("#Text_OriginSNo").data("kendoAutoComplete").key());
        if ($("#Text_DestinationLevel").val().toUpperCase() == "CITY" && $("#Text_DestinationSNo").val() != "")
            country = onSelectCity($("#DestinationSNo").val());
        else
            country = $("#Text_DestinationSNo").data("kendoAutoComplete").key();
        if ($('#Text_TaxType').val().toUpperCase() == "DOMESTIC" && $("#Text_DestinationSNo").val() != "")
       {
            cfi.setFilter(filter5, "CountrySNo", "eq", country);
        }
        else if ($('#Text_TaxType').val().toUpperCase() == "INTERNATIONAL" && $("#Text_DestinationSNo").val() != "") {
            cfi.setFilter(filter5, "CountrySNo", "neq", country);
        }
       
        filterOriginCitySNo = cfi.autoCompleteFilter(filter5);
        return filterOriginCitySNo;
    }
        //end
    else if (textId.indexOf("Text_OriginCountrySNo") >= 0) {
    
        var filter6 = cfi.getFilter("AND");
        cfi.setFilter(filter6, "SNO", "notin", $("#Text_OriginCountrySNo").data("kendoAutoComplete").key());
        filterOriginCountrySNo = cfi.autoCompleteFilter(filter6);
        return filterOriginCountrySNo;
    }
        // filter for domestic and internationl origin and destination   date 18-05-2017
    else if (textId == "DestinationSNo") {
      
        var filter7 = cfi.getFilter("AND");
        cfi.setFilter(filter7, "SNO", "notin", $("#Text_DestinationSNo").data("kendoAutoComplete").key());
        if ($("#Text_OriginLevel").val().toUpperCase() == "CITY" && $("#Text_OriginSNo").val() != "")
            country = onSelectCity($("#OriginSNo").val());
        else
            country = $("#Text_OriginSNo").data("kendoAutoComplete").key();
        if ($('#Text_TaxType').val().toUpperCase() == "DOMESTIC" && $("#Text_OriginSNo").val() != "") {
            cfi.setFilter(filter7, "CountrySNo", "eq", country);
        }
        else if ($('#Text_TaxType').val().toUpperCase() == "INTERNATIONAL" && $("#Text_OriginSNo").val() != "") {
            cfi.setFilter(filter7, "CountrySNo", "neq", country);
        }
        filterDestinationCitySNo = cfi.autoCompleteFilter(filter7);
        return filterDestinationCitySNo;
    }
        //= end
    else if (textId.indexOf("Text_DestinationCountrySNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "SNO", "notin", $("#Text_DestinationCountrySNo").data("kendoAutoComplete").key());
        //cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterDestinationCountrySNo = cfi.autoCompleteFilter(filter9);
        return filterDestinationCountrySNo;
    }
    else if (textId.indexOf("Text_OtherChargeSNo") >= 0) {
        var filter10 = cfi.getFilter("AND");
        cfi.setFilter(filter10, "SNO", "notin", $("#Text_OtherChargeSNo").data("kendoAutoComplete").key());
        //cfi.setFilter(filter10, "IsActive", "eq", 1);
        filterOtherChargeSNo = cfi.autoCompleteFilter(filter10);
        return filterOtherChargeSNo;
    }
    if (textId.indexOf("Text_TaxAppliedOn") >= 0) {
        var addedValue = "";

        addedValue = $('input[type="hidden"][id="' + textId.replace('Text_', '') + '"]').val();

        var filter11 = cfi.getFilter("AND");
        if ($("#TaxAppliedOn").val() == "1") {
            return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNO", "in", addedValue), cfi.autoCompleteFilter(textId);
        }
        else if ($("#TaxAppliedOn").val() > "1") {

            return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNO", "notin", "1," + addedValue), cfi.autoCompleteFilter(textId);
        }
        else {
            return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNO", "notin", addedValue), cfi.autoCompleteFilter(textId);
        }

    }
    //var Origin = $("#Text_OriginLevel").val().toUpperCase();

    //if (Origin == "CITY") {
    //    alert($("#OriginLevel").val());
    //    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    //        //cfi.AutoComplete("OriginSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectOrigin, "contains");
    //    //}
    //    //else {

    //        var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode@", ["CityCode", "CityName"])
    //        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");

    //        //$("#Text_OriginSNo").val("");
    //        //$("#OriginSNo").val("");
    //    //}
    //}
}

//Disabled any div by Div ID 
function UserSubProcessRightswithoutsubprocess(container, isView) {
    //if view permission is true
    if (isView) {
        $(".btn-success").attr("style", "display:none;");
        $(".btn-danger").attr("style", "display:none;");
        $(".ui-button").closest("td").attr("style", "display:none;");
        $(".btnTrans").closest("td").attr("style", "display:none;");
        //$(".k-icon,.k-delete").replaceWith("");

        $('#' + container).find('input').each(function () {
            var ctrltype = $(this).attr("type");
            var dataRole = $(this).attr("data-role");
            if (ctrltype != "hidden") {
                if (dataRole == "autocomplete") {
                    $(this).parent().parent().replaceWith("<span>" + this.value + "</span>");
                }
                else if (dataRole == "datepicker") {
                    $(this).parent().replaceWith("<span>" + this.value + "</span>");
                }
                else if (ctrltype == "radio") {
                    var name = $(this).attr("name");
                    if ($(this).attr("data-radioval"))
                        $(this).closest("td").html("<span>" + $("input[name='" + name + "']:checked").attr("data-radioval") + "</span>");
                    else
                        $(this).attr("disabled", true);
                }
                else if (ctrltype == "checkbox" || ctrltype == "radio") {// && (this.value == "0" || this.value == "1")
                    $(this).attr("disabled", true);
                }
                else if ($(this).attr("id").indexOf("_temp") >= 0) {
                    $(this).replaceWith("<input type='hidden' id='" + $(this).attr("id") + "' value='" + this.value + "' />");
                }
                else {
                    $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
                }
            }

        });

        $('#' + container).find('select').each(function () {
            $(this).replaceWith("<span>" + $("#" + $(this).attr("id") + " :selected").text() + "</span>");
        });

        $('#' + container).find('ul li span').each(function (i, e) {
            $(e).removeClass();
        });

    }
    else {
        $(".btn-success").attr("style", "display:block;");
        $(".btn-danger").attr("style", "display:block;");
        $(".btnTrans").closest("td").attr("style", "display:table-cell;");
        $(".ui-button").closest("td").attr("style", "display:table-cell;");
    }
}

function onSelectCity(obj) {
    $.ajax({
        url: "Services/Rate/TaxRateService.svc/GetCountrySNo",
        datatpye: "JSON",
        data: { CitySNo: obj },
        tpye: "GET",
        async: false,
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