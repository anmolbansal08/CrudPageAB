/*
*****************************************************************************
Javascript Name:	AirportJS     
Purpose:		    This JS used to get autocomplete for city Country and Grid data for Airport.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    
Created On:		    
Updated By:         Tarun Kumar
Updated On:	        13 May 2014
Approved By:        
Approved On:	    
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    cfi.AutoComplete("CountryCode", "CountryCode,CountryName", "vwCountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectCountryCodeChange, "contains");
    cfi.AutoComplete("CityCode", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
   // cfi.AutoComplete("ConnectionTypeSNo", "SNo,ConnectionTypeName", "ConnectionType", "SNo", "ConnectionTypeName", ["ConnectionTypeName"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "vwAirline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("AircraftSNo", "SNo,AircraftType", "vAirCraftGetList", "SNo", "AircraftType", ["AircraftType"], null, "contains");
    cfi.AutoComplete("ProductSNo", "SNo,ProductName", "vwProduct", "SNo", "ProductName", ["ProductName"], null, "contains");
    cfi.AutoComplete("SPHCSNo", "SNo,Code", "vwsphc", "SNo", "Code", ["Code"], null, "contains", ",");

    cfi.AutoCompleteByDataSource("AcceptanceCutoffType", AcceptanceCutoffType);



    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //    //$("#CityCode").val(userContext.CitySNo);
    //    //$("#Text_CityCode").val(userContext.CityCode + '-' + userContext.CityName);

    //    /*********Get Country*********************/
    //    $.ajax({
    //        url: "Services/Master/TaxService.svc/GetCountry", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
    //        data: JSON.stringify({ CitySNo: userContext.CitySNo }),
    //        success: function (result) {
    //            if (result != "") {
    //                $('#Text_CountryCode').data("kendoAutoComplete").key(result.split('__')[0]);
    //                $('#Text_CountryCode').data("kendoAutoComplete").value(result.split('__')[1]);
    //                $('#Text_CountryCode').data("kendoAutoComplete").enable(true);
    //                $('#Text_CityCode').data("kendoAutoComplete").enable(true);
    //            }
    //        }
    //    });
        /*****************************************/
    //}


    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ") {

    //    var SPHCSNoDataField = ($('#SPHCSNo').val());
    //    var SPHCSNoDataText = ($('#Text_SPHCSNo').val());
    //    $('#Text_SPHCSNo')[0].defaultValue = '';
    //    $('#Text_SPHCSNo')[0].Value = '';
    //    $('#Text_SPHCSNo').val('');
    //    $('#Multi_SPHCSNo').val(SPHCSNoDataField);
    //    $('#FieldKeyValuesSPHCSNo')[0].innerHTML = SPHCSNoDataField;
    //    var i = 0;
    //    if (SPHCSNoDataField.split(',').length > 0) {
    //        while (i < SPHCSNoDataField.split(',').length) {
    //            if (SPHCSNoDataField.split(',')[i] != '')
    //                $('#divMultiSPHCSNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SPHCSNoDataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SPHCSNoDataField.split(',')[i] + "'></span></li>");
    //            i++;
    //        }
    //    }
    //    //}
    //}
    //$('.k-delete').click(function () {
    //    $(this).parent().remove();
    //    if ($("div[id='divMultiSPHCSNo']").find("span[name^='FieldKeyValuesSPHCSNo']").text().indexOf($(this)[0].id + ",") > -1) {
    //        var SPHCSNoVal = $("div[id='divMultiSPHCSNo']").find("span[name^='FieldKeyValuesSPHCSNo']").text().replace($(this)[0].id + ",", '');
    //        $("div[id='divMultiSPHCSNo']").find("span[name^='FieldKeyValuesSPHCSNo']").text(SPHCSNoVal);
    //        $('#SPHCSNo').val(SPHCSNoVal);
    //    }
    //    else {
    //        var SPHCSNoValfield = $("div[id='divMultiSPHCSNo']").find("span[name^='FieldKeyValuesSPHCSNo']").text().replace($(this)[0].id, '');
    //        $("div[id='divMultiSPHCSNo']").find("span[name^='FieldKeyValuesSPHCSNo']").text(SPHCSNoValfield);
    //        $('#SPHCSNo').val(SPHCSNoValfield);
    //    }
    //    $("div[id='divMultiSPHCSNo']").find("input:hidden[name^='Multi_SPHCSNo']").val($("div[id='divMultiSPHCSNo']").find("span[name^='FieldKeyValuesSPHCSNo']").text());

    //});

    //$("input[type='text']:eq(0)").focus();
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
    $('#AirportCode').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })
    BindingGridonClick();
    function BindingGridonClick() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liAirportCutoffTime").hide();
            var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
            tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
        }
    }
});
var AcceptanceCutoffType = [{ Key: "0", Text: "Domestic" }, { Key: "1", Text: "International" }];
function OnSelectCountry(e) {
    var Data = this.dataItem(e.item.index());
    $("#CityCode").val('');
    $("#Text_CityCode").val('');
    //$.ajax({
    //    type: "POST",
    //    url: "./Services/Master/AirportService.svc/GetCity?recid=" + Data.Text.substr(0, 2),
    //    data: { id: 1 },
    //    dataType: "json",
    //    success: function (response) {
    //        if (response.Data.length>0) {
    //            var code = response.Data[0];
    //            var text = response.Data[1];
    //            $("#CityCode").val(code);
    //            $("#Text_CityCode").val(code + "-" + text);
    //        }
            
    //    }
    //});
}
function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_CityCode") {
        try {
            cfi.setFilter(filterAirline, "CountryCode", "eq", $("#Text_CountryCode").data("kendoAutoComplete").value().substr(0, 2))
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_CountryCode") {
        try {
            
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_ConnectionTypeSNo") {
        try {
            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_AirlineSNo") {
        try {
            
            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_AircraftSNo") {
        try {
            
            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_ProductSNo") {
        try {
            
            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_SPHCSNo") {
        try {
            
            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}
function AirportCutoffTimeGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Acceptance Cut-Off Time - Can be added in Edit/Update Mode only.");
        return;
    }
    else {
        var dbTableName = 'AirportCutoffTime';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,AirportSNo,AcceptanceCutoffType,AirlineSNo,AircraftSNo,ProductSNo,ConnectionTime,IsBaseSetting,IsActive',
            masterTableSNo: $('#hdnAirportSNo').val(),
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: '',
            servicePath: 'Services/Master/AirportService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Acceptance Cut-Off Time',
            initRows: 1,
            isGetRecord: true,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirportSNo', type: 'hidden', value: $('#hdnAirportSNo').val() },
                { name: 'AcceptanceCutoffType', display: 'Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'ConnectionType', textColumn: 'ConnectionTypeName', keyColumn: 'SNo' },
                { name: 'AirlineSNo', display: 'Airline', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'vairline', textColumn: 'airlinecode', keyColumn: 'SNo' },
                { name: 'AircraftSNo', display: 'Aircraft Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' },  tableName: 'vAircraftType', textColumn: 'AircraftType', keyColumn: 'SNo' },
                { name: 'ProductSNo', display: 'Product', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'vProduct', textColumn: 'ProductName', keyColumn: 'SNo' },
                { name: 'SPHCSNo', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' },  tableName: 'vwsphc', textColumn: 'Code', keyColumn: 'SNo', separator: "," },
                { name: 'ConnectionTime', display: 'Time(min)', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number' }, ctrlCss: { width: '90px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'IsBaseSetting' : 'BaseSetting', display: 'Base Setting', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
        });

    }
}


function OnSelectCountryCodeChange() {
    try {

        $('#CityCode').val('');
          $('#Text_CityCode').val('');
        //$.ajax({
        //    url: "Services/Master/AirportService.svc/GetCityInformation", async: false, type: "POST", dataType: "json", cache: false,
        //    data: JSON.stringify({ SNo: $("#CountryCode").val() }),
        //    contentType: "application/json; charset=utf-8",
        //    success: function (result) {
        //        var Data = jQuery.parseJSON(result);
        //        var resData = Data.Table0;
        //        if (resData.length > 0) {
        //         //   $('#CityCode').val(resData[0].SNo);
        //          //  $('#Text_CityCode').val(resData[0].CityName);
        //        }
        //    }
        //});
    }
    catch (exp) { }

}
