$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    // Changes by Vipin Kumar
    //cfi.AutoComplete("OriginCountrySNo", "CountryCode,CountryName", "vwCountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains", null, null, null, null, OnSelectOriginCountry);
    cfi.AutoCompleteV2("OriginCountrySNo", "CountryCode,CountryName", "RateGlobalDueCarrier_Country", null, "contains", null, null, null, null, OnSelectOriginCountry);
    //cfi.AutoComplete("DestinationCountrySNo", "CountryCode,CountryName", "vwCountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains", null, null, null, null, OnSelectDestinationCountry);
    cfi.AutoCompleteV2("DestinationCountrySNo", "CountryCode,CountryName", "RateGlobalDueCarrier_Country", null, "contains", null, null, null, null, OnSelectDestinationCountry);
    //cfi.AutoComplete("OriginAirportSNo", "AirportCode,AirportName", "VAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("OriginAirportSNo", "AirportCode,AirportName", "RateGlobalDueCarrier_Airport", null, "contains", null, null, null, null, null);
    //cfi.AutoComplete("DestinationAirportSNo", "AirportCode,AirportName", "VAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("DestinationAirportSNo", "AirportCode,AirportName", "RateGlobalDueCarrier_Airport", null, "contains", null, null, null, null, null);
    //cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "vwAirline", "SNo", "AirlineName", null, null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName", "RateGlobalDueCarrier_Airline", null, "contains");
    //Ends
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    cfi.AutoCompleteByDataSource("OriginIATASNo", IATATYPE, OnSelectOriginIATA);
    cfi.AutoCompleteByDataSource("DestinationIATASNo", IATATYPE, OnSelectDestinationIATA);

});

//$(function ()
//{

//    cfi.AutoCompleteByDataSource("OriginIATASNo", IATATYPE, OnSelectOriginIATA);
//    cfi.AutoCompleteByDataSource("DestinationIATASNo", IATATYPE, OnSelectDestinationIATA);
//});


$('input:submit[name=operation]').click(function () {
    if ($('input:submit[name=operation]').val() != "Delete") {

        if ($("#Text_OriginIATASNo").data("kendoAutoComplete").value().trim() != ('') && $("#Text_DestinationIATASNo").data("kendoAutoComplete").value().trim() == ('')) {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select Destination IATACode");
            return false;
        }

        else if ($("#Text_OriginIATASNo").data("kendoAutoComplete").value().trim() == ("") && $("#Text_DestinationIATASNo").data("kendoAutoComplete").value().trim() != ("")) {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select Origin IATACode");
            return false;
        }

        else if ($("#Text_OriginCountrySNo").data("kendoAutoComplete").value().trim() == ("") && $("#Text_DestinationCountrySNo").data("kendoAutoComplete").value().trim() != ("")) {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select Origin Country Code");
            return false;

        }

        else if ($("#Text_OriginCountrySNo").data("kendoAutoComplete").value().trim() != ("") && $("#Text_DestinationCountrySNo").data("kendoAutoComplete").value().trim() == ("")) {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select Destination Country Code");
            return false;
        }

        else if ($("#Text_OriginAirportSNo").data("kendoAutoComplete").value().trim() == ("") && $("#Text_DestinationAirportSNo").data("kendoAutoComplete").value().trim() != ("")) {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select Origin Airport Code");
            return false;
        }

        else if ($("#Text_OriginAirportSNo").data("kendoAutoComplete").value().trim() != ("") && $("#Text_DestinationAirportSNo").data("kendoAutoComplete").value().trim() == ("")) {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select Destination Airport Code");
            return false;
        }
        else {
            return true;
        }
    }
});

function OnSelectOriginIATA() {
    $("#Text_OriginCountrySNo").data("kendoAutoComplete").key('');
    $("#Text_OriginCountrySNo").data("kendoAutoComplete").value('');
    $("#Text_OriginAirportSNo").data("kendoAutoComplete").key('');
    $("#Text_OriginAirportSNo").data("kendoAutoComplete").value('');
}

function OnSelectDestinationIATA() {
    $("#Text_DestinationCountrySNo").data("kendoAutoComplete").key('');
    $("#Text_DestinationCountrySNo").data("kendoAutoComplete").value('');
    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").key('');
    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").value('');
}

function OnSelectOriginCountry() {
    $("#Text_OriginAirportSNo").data("kendoAutoComplete").key('');
    $("#Text_OriginAirportSNo").data("kendoAutoComplete").value('');
}

function OnSelectDestinationCountry() {
    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").key('');
    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").value('');
}

function ExtraCondition(textId) {
    var filterCountry = cfi.getFilter("AND");
    if (textId == "Text_OriginCountrySNo") {
        try {
            if ($("#Text_OriginIATASNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(filterCountry, "IATAAreaCode", "eq", $("#Text_OriginIATASNo").data("kendoAutoComplete").key())
                var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCountry]);
                return OriginCityAutoCompleteFilter2;
            }
        }
        catch (exp) {

        }
    }

    if (textId == "Text_DestinationCountrySNo") {
        try {
            if ($("#Text_DestinationIATASNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(filterCountry, "IATAAreaCode", "eq", $("#Text_DestinationIATASNo").data("kendoAutoComplete").key())
                var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCountry]);
                return OriginCityAutoCompleteFilter2;
            }
        }
        catch (exp) {

        }
    }

    if (textId == "Text_OriginAirportSNo") {
        try {
            if ($("#Text_OriginCountrySNo").data("kendoAutoComplete").value() == '' && $("#Text_OriginIATASNo").data("kendoAutoComplete").value() == '') {
                cfi.setFilter(filterCountry, "SNo", "neq", $("#Text_DestinationAirportSNo").data("kendoAutoComplete").key())
            }
            else if ($("#Text_OriginCountrySNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(filterCountry, "SNo", "neq", $("#Text_DestinationAirportSNo").data("kendoAutoComplete").key())
                cfi.setFilter(filterCountry, "CountrySNo", "eq", $("#Text_OriginCountrySNo").data("kendoAutoComplete").key())
            }
            else if ($("#Text_OriginIATASNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(filterCountry, "SNo", "neq", $("#Text_DestinationAirportSNo").data("kendoAutoComplete").key())
                cfi.setFilter(filterCountry, "IATAAreaCode", "eq", $("#Text_OriginIATASNo").data("kendoAutoComplete").key())
            }
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCountry]);
            return OriginCityAutoCompleteFilter2;

        }
        catch (exp) {

        }
    }

    if (textId == "Text_DestinationAirportSNo") {
        try {

            if ($("#Text_DestinationCountrySNo").data("kendoAutoComplete").value() == '' && $("#Text_DestinationIATASNo").data("kendoAutoComplete").value() == '') {
                cfi.setFilter(filterCountry, "SNo", "neq", $("#Text_OriginAirportSNo").data("kendoAutoComplete").key())
            }
            else if ($("#Text_DestinationCountrySNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(filterCountry, "SNo", "neq", $("#Text_OriginAirportSNo").data("kendoAutoComplete").key())
                cfi.setFilter(filterCountry, "CountrySNo", "eq", $("#Text_DestinationCountrySNo").data("kendoAutoComplete").key())
            }
            else if ($("#Text_DestinationIATASNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(filterCountry, "SNo", "neq", $("#Text_DestinationAirportSNo").data("kendoAutoComplete").key())
                cfi.setFilter(filterCountry, "IATAAreaCode", "eq", $("#Text_DestinationIATASNo").data("kendoAutoComplete").key())
            }
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCountry]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {

        }
    }


}
/*
*****************************************************************************
Javascript Name:	Account.js   
Purpose:		    This JS used to Add,Update,Delete and Read RateGlobalDueCarrierTrans .
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Amit Kumar Gupta
Created On:		    06 MAY 2014
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
var dbTableName = 'RateGlobalDueCarrierTrans';
function RateGlobalDueCarrierTransGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Rate Global Due Carrier Trans add on update mode.");
        return;
    }
    else {
        isDataLoad = false;
        var dbTableName = 'RateGlobalDueCarrierTrans';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,RateGlobalDuecarrierSNo,DueCarrierSNo,CommoditySNo,SPHCSNo,ProductSNo,CurrencySNo,Value,MinimumValue,OriginalValue,IsChargeableWeight,ValidFrom,ValidTo,IsActive',
            masterTableSNo: $('#hdnRateGlobalDuecarrierSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Other Charges',
            initRows: 1,
            isGetRecord: true,
            columns: [
                      { name: 'SNo', type: 'hidden', value: 0 },
                      { name: 'RateGlobalDuecarrierSNo', type: 'hidden', value: $('#hdnRateGlobalDuecarrierSNo').val() },

                      { name: 'DueCarrierSNo', display: 'Due Carrier Code', type: 'text', ctrlAttr: { maxlength: 90, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, AutoCompleteName: 'RateGlobalDueCarrier_DueCarrier', filterField: 'Code' },
                     {
                         name: 'CommoditySNo', display: 'Commodity Code', type: 'text', ctrlAttr: { maxlength: 5, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, AutoCompleteName: 'RateGlobalDueCarrier_Commodity', filterField: 'CommodityCode', addOnFunction: function (evt) {
                             setValue(evt);
                         }
                     },

                      {
                          name: 'SPHCSNo', display: 'SPHC Code', type: 'text', ctrlAttr: { maxlength: 49, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, AutoCompleteName: 'RateGlobalDueCarrier_SPHC', filterField: 'Code', addOnFunction: function (evt) {
                              setValue(evt);
                          }
                      },

                      { name: 'ProductSNo', display: 'Product Name', type: 'text', ctrlAttr: { maxlength: 49, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, AutoCompleteName: 'RateGlobalDueCarrier_Product', filterField: 'ProductName', addOnFunction: function (evt) { setValue(evt); } },

                      { name: 'CurrencySNo', display: 'Currency Code', type: 'text', ctrlAttr: { maxlength: 3, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, AutoCompleteName: 'RateGlobalDueCarrier_Currency', filterField: 'CurrencyCode' },

                       {
                           name: 'OriginalValue', display: 'Rate/Kg', type: 'text', value: '0', ctrlAttr: { maxlength: 14, controltype: 'decimal2' }, ctrlCss: { width: '60px' }, isRequired: true
                       },

                      //{name: 'Value', display: 'Value', type: 'text', value: '0', ctrlAttr: { maxlength: 3, controltype: 'decimal2' }, ctrlCss: { width: '60px' }, isRequired: true},

                      { name: 'MinimumValue', display: 'Minimum', type: 'text', value: '0', ctrlAttr: { maxlength: 14, controltype: 'decimal2' }, ctrlCss: { width: '60px' }, isRequired: true },


                      {
                          name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                      },
                      {
                          name: 'ValidTo', display: 'Valid To', type: 'text', ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                      },
                      {
                          name: pageType == 'EDIT' ? 'IsChargeableWeight' : 'ChargeableWeight', display: 'Based On', type: 'radiolist', ctrlOptions: { 0: 'Gr. Wt.', 1: 'Ch. Wt.' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
                      },
                      {
                          name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
                      },
                       { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                       { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],

            isPaging: true
            //,
            //appendRowExtraFunction: 'setValue();'
        });

    }



}

function setValue(elementId) {
    if (elementId.split('_')[1] == 'CommoditySNo' && $('#' + elementId)[0].value != '') {

        $('#tblRateGlobalDueCarrierTrans_SPHCSNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnSPHCSNo_' + elementId.split('_')[2]).val('0');
        $('#tblRateGlobalDueCarrierTrans_SPHCSNo_' + elementId.split('_')[2]).removeAttr("required");
        $('#tblRateGlobalDueCarrierTrans_ProductSNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnProductSNo_' + elementId.split('_')[2]).val('0');
        $('#tblRateGlobalDueCarrierTrans_ProductSNo_' + elementId.split('_')[2]).removeAttr("required");

    }
    else if (elementId.split('_')[1] == 'SPHCSNo' && $('#' + elementId)[0].value != '') {

        $('#tblRateGlobalDueCarrierTrans_CommoditySNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnCommoditySNo_' + elementId.split('_')[2]).val('0');
        $('#tblRateGlobalDueCarrierTrans_CommoditySNo_' + elementId.split('_')[2]).removeAttr("required");
        $('#tblRateGlobalDueCarrierTrans_ProductSNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnProductSNo_' + elementId.split('_')[2]).val('0');
        $('#tblRateGlobalDueCarrierTrans_ProductSNo_' + elementId.split('_')[2]).removeAttr("required");
    }
    else if (elementId.split('_')[1] == 'ProductSNo' && $('#' + elementId)[0].value != '') {

        $('#tblRateGlobalDueCarrierTrans_CommoditySNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnCommoditySNo_' + elementId.split('_')[2]).val('0');
        $('#tblRateGlobalDueCarrierTrans_CommoditySNo_' + elementId.split('_')[2]).removeAttr("required");
        $('#tblRateGlobalDueCarrierTrans_SPHCSNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnSPHCSNo_' + elementId.split('_')[2]).val('0');
        $('#tblRateGlobalDueCarrierTrans_SPHCSNo_' + elementId.split('_')[2]).removeAttr("required");
    }
    else {
        $('#tblRateGlobalDueCarrierTrans_CommoditySNo_' + elementId.split('_')[2]).attr("required", true);
        $('#tblRateGlobalDueCarrierTrans_SPHCSNo_' + elementId.split('_')[2]).attr("required", true);
        $('#tblRateGlobalDueCarrierTrans_ProductSNo_' + elementId.split('_')[2]).attr("required", true);
        $('#tblRateGlobalDueCarrierTrans_HdnCommoditySNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnSPHCSNo_' + elementId.split('_')[2]).val('');
        $('#tblRateGlobalDueCarrierTrans_HdnProductSNo_' + elementId.split('_')[2]).val('');
    }
    return false;
}


//function CheckAutoComplete() {
//        var id = this.element[0].name;
//        var nameArray = id.split('_');
//        if (nameArray.length > 2) {

//            switch (nameArray[1]) {

//                case 'CommoditySNo':
//                    $('#tbl' + dbTableName + '_CommoditySNo_' + nameArray[2]).attr("required", true);

//                    $('#tbl' + dbTableName + '_SPHCSNo_' + nameArray[2]).removeAttr("required");
//                    $('#tbl' + dbTableName + '_SPHCSNo_' + nameArray[2]).val('');
//                    $('#tbl' + dbTableName + '_HdnSPHCSNo_' + nameArray[2]).val("0");

//                    $('#tbl' + dbTableName + '_ProductSNo_' + nameArray[2]).removeAttr("required");
//                    $('#tbl' + dbTableName + '_ProductSNo_' + nameArray[2]).val('');
//                    $('#tbl' + dbTableName + '_HdnProductSNo_' + nameArray[2]).val("0");
//                    break;

//                case 'SPHCSNo':

//                    $('#tbl' + dbTableName + '_CommoditySNo_' + nameArray[2]).removeAttr("required");
//                    $('#tbl' + dbTableName + '_CommoditySNo_' + nameArray[2]).val('');
//                    $('#tbl' + dbTableName + '_HdnCommoditySNo_' + nameArray[2]).val("0");

//                    $('#tbl' + dbTableName + '_SPHCSNo_' + nameArray[2]).attr("required", "true");

//                    $('#tbl' + dbTableName + '_ProductSNo_' + nameArray[2]).removeAttr("required");
//                    $('#tbl' + dbTableName + '_ProductSNo_' + nameArray[2]).val('');
//                    $('#tbl' + dbTableName + '_HdnProductSNo_' + nameArray[2]).val("0");
//                    break;

//                case 'ProductSNo':


//                    $('#tbl' + dbTableName + '_CommoditySNo_' + nameArray[2]).removeAttr("required");
//                    $('#tbl' + dbTableName + '_CommoditySNo_' + nameArray[2]).val('');
//                    $('#tbl' + dbTableName + '_HdnCommoditySNo_' + nameArray[2]).val("0");

//                    $('#tbl' + dbTableName + '_SPHCSNo_' + nameArray[2]).removeAttr("required");
//                    $('#tbl' + dbTableName + '_SPHCSNo_' + nameArray[2]).val('');
//                    $('#tbl' + dbTableName + '_HdnSPHCSNo_' + nameArray[2]).val("0");

//                    $('#tbl' + dbTableName + '_ProductSNo_' + nameArray[2]).attr("required", "true");
//                    break;
//            }
//        }
//}


//function CheckAutoCompleteonChange(rowIndex, name)
//{
//    switch (name)
//    {
//        case 'CommoditySNo':

//            if ($('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).val() == "")
//            {

//            $('#tbl' + dbTableName + '_HdnCommoditySNo_' + eval(rowIndex + 1)).val('');
//            $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).attr("required", true);

//            $('#tbl' + dbTableName + '_HdnSPHCSNo_' + eval(rowIndex + 1)).val('');
//            $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).attr("required", true);
//            $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).val('');

//            $('#tbl' + dbTableName + '_HdnProductSNo_' + eval(rowIndex + 1)).val('');
//            $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).attr("required", true);
//            $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).val('');
//            }
//            else
//            {
//                $('#tbl' + dbTableName + '_HdnSPHCSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).attr("required", false);
//                $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).val('');

//                $('#tbl' + dbTableName + '_HdnProductSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).attr("required", false);
//                $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).val('');

//            }
//            break;

//        case 'SPHCSNo':

//            if ($('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).val() == "")
//            {
//                $('#tbl' + dbTableName + '_HdnCommoditySNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).attr("required", true);
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).val('');

//                $('#tbl' + dbTableName + '_HdnSPHCSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).attr("required", true);


//                $('#tbl' + dbTableName + '_HdnProductSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).attr("required", true);
//                $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).val('');
//            }
//            else
//            {
//                $('#tbl' + dbTableName + '_HdnCommoditySNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).attr("required", false);
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).val('');

//                $('#tbl' + dbTableName + '_HdnProductSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).attr("required", false);
//                $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).val('');
//            }
//            break;

//        case 'ProductSNo':
//            if ($('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).val() == "")
//            {
//                $('#tbl' + dbTableName + '_HdnCommoditySNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).attr("required", true);
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).val('');

//                $('#tbl' + dbTableName + '_HdnSPHCSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).attr("required", true);
//                $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).val('');


//                $('#tbl' + dbTableName + '_HdnProductSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_ProductSNo_' + eval(rowIndex + 1)).attr("required", true);
//            }
//            else
//            {
//                $('#tbl' + dbTableName + '_HdnCommoditySNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).attr("required", false);
//                $('#tbl' + dbTableName + '_CommoditySNo_' + eval(rowIndex + 1)).val('');

//                $('#tbl' + dbTableName + '_HdnSPHCSNo_' + eval(rowIndex + 1)).val('');
//                $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).attr("required", false);
//                $('#tbl' + dbTableName + '_SPHCSNo_' + eval(rowIndex + 1)).val('');
//            }
//            break;
//    }
//}




//function setValue() {
//    $("input[id*=tblRateGlobalDueCarrierTrans_CommoditySNo]").each(function () {
//        $(this).focusout(function () {
//            var Iddata = this.id.split('_');
//            if ($(this).val() != '')
//            {
//                $('#tbl' + dbTableName + '_CommoditySNo_' + Iddata[2]).attr("required", true);

//                $('#tbl' + dbTableName + '_SPHCSNo_' + Iddata[2]).removeAttr("required");
//                $('#tbl' + dbTableName + '_SPHCSNo_' + Iddata[2]).val('');
//                $('#tbl' + dbTableName + '_HdnSPHCSNo_' + Iddata[2]).val("0");

//                $('#tbl' + dbTableName + '_ProductSNo_' + Iddata[2]).removeAttr("required");
//                $('#tbl' + dbTableName + '_ProductSNo_' + Iddata[2]).val('');
//                $('#tbl' + dbTableName + '_HdnProductSNo_' + Iddata[2]).val("0");
//            }
//            else if ($('#tbl' + dbTableName + '_SPHCSNo_' + Iddata[2]).val()!='')
//            {
//                $('#tbl' + dbTableName + '_CommoditySNo_' + Iddata[2]).removeAttr("required");
//                $('#tbl' + dbTableName + '_CommoditySNo_' + Iddata[2]).val('');
//                $('#tbl' + dbTableName + '_HdnCommoditySNo_' + Iddata[2]).val("0");

//                $('#tbl' + dbTableName + '_SPHCSNo_' + Iddata[2]).attr("required", "true");

//                $('#tbl' + dbTableName + '_ProductSNo_' + Iddata[2]).removeAttr("required");
//                $('#tbl' + dbTableName + '_ProductSNo_' + Iddata[2]).val('');
//                $('#tbl' + dbTableName + '_HdnProductSNo_' + Iddata[2]).val("0");
//            }
//            else if ($('#tbl' + dbTableName + '_ProductSNo_' + Iddata[2]).val() != '')
//            {
//                $('#tbl' + dbTableName + '_CommoditySNo_' + Iddata[2]).removeAttr("required");
//                $('#tbl' + dbTableName + '_CommoditySNo_' + Iddata[2]).val('');
//                $('#tbl' + dbTableName + '_HdnCommoditySNo_' + Iddata[2]).val("0");

//                $('#tbl' + dbTableName + '_SPHCSNo_' + Iddata[2]).removeAttr("required");
//                $('#tbl' + dbTableName + '_SPHCSNo_' + Iddata[2]).val('');
//                $('#tbl' + dbTableName + '_HdnSPHCSNo_' + Iddata[2]).val("0");

//                $('#tbl' + dbTableName + '_ProductSNo_' + Iddata[2]).attr("required", "true");
//            }

//        });
//    });
//}






