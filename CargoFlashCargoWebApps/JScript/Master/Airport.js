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

$(document).ready(function ()
{
    cfi.ValidateForm();
    $("input[name='operation']").click(function ()
    {
        if (cfi.IsValidSubmitSection())
        {
            timeVal = "";
            $("#ulTime span.k-delete").each(function ()
            {
                timeVal = timeVal+$(this).attr("id") + ","
            });
            $("#EmailAlertTime").val((timeVal || ""));
        }
        window.onbeforeunload = function () { };
    });
    var recordSNO = $("#htmlkeysno").val();
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    cfi.AutoCompleteV2("CountryCode", "CountryCode,CountryName", "Airport_CountryCode", OnSelectCountryCodeChange, "contains");
    cfi.AutoCompleteV2("CityCode", "CityCode,CityName", "Airport_CityCode", null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName", "Airport_AirlineSNo", null, "contains");
    cfi.AutoCompleteV2("AircraftSNo", "SNo,AircraftType", "Airport_AircraftSNo", null, "contains");
    cfi.AutoCompleteV2("ProductSNo", "SNo,ProductName", "Airport_ProductSNo", null, "contains");
    cfi.AutoCompleteV2("SPHCSNo", "SNo,Code", "Airport_SPHCSNo", null, "contains", ",");

    cfi.AutoCompleteByDataSource("AcceptanceCutoffType", AcceptanceCutoffType);

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
    $(document).on('keypress keyup blur', '#EmailAlertTime', function (evt)
    {
        var keyCode = event.keyCode || event.which

        if (keyCode == 13)
        {
            event.preventDefault();
            return false;
        }
    });
    BindingGridonClick();
    $("#liAirportCutoffTime").hide();
});
function BindingGridonClick() {
    $('input:radio[name=IsEmailAlertonoffloadedCargo]').change(function () { EmailAlertTime(); });
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
    {
        var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
        tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
        $("input:radio[name='IsEmailAlertonoffloadedCargo'][value ='1']").prop('checked', true);
        $("input:radio[name='IsDoChargeApplicable'][value ='1']").prop('checked', true);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
    {
        if ($("input[name='IsEmailAlertonoffloadedCargo']:checked").val() == 0)
        {
            EmailAlertTime();
        }
    }
}
var timeVal = "";
function EmailAlertTime() {
    if ($("input[name='IsEmailAlertonoffloadedCargo']:checked").val() == 0)
    {
        $("#IsEmailAlertonoffloadedCargo").closest("td").append("<div id='divtime'><input type='text' class='k-input k-state-default' name='EmailAlertTime' id='EmailAlertTime' data-valid-msg='Kindly select at least one Time Slot.'></div>");
        if ($("#divMultiTime").length === 0 && getQueryStringValue("FormAction").toUpperCase() == "NEW")
        {
            EmailAlertValidate();
            $("#divtime").closest("td").append('<div style="overflow: auto;" id="divMultiTime"><ul id="ulTime" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div>');
            $('#EmailAlertTime').attr('data-valid', 'required');
        }
        else 
        {
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
            {
                EmailAlertValidate();
                $("#divtime").closest("td").append('<div style="overflow: auto;" id="divMultiTime"><ul id="ulTime" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div>');
                if ($("#Time").val() != "")
                {
                    var t1 = $("#Time").val().split(',');
                    for (var i = 0; i < t1.length; i++)
                    {
                        $("ul#ulTime").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + t1[i] + " </span><span onclick='removeTimeItem(this)' id='" + t1[i] + "' class='k-icon k-delete remove'></span></li>");
                    }
                }
                else
                {
                    $('#EmailAlertTime').attr('data-valid', 'required');
                }
            }
        }
       
        //   timeVal = "";
        if (!$("#EmailAlertTime").data("kendoTimePicker"))
        {
            $("#EmailAlertTime").kendoTimePicker({
                format: "HH:mm",
                change: function (a) {
                    var t = kendo.toString(this.value(), 'HH:mm');
                    if (t != null) {
                          timeVal += t + ",";
                        var isTrue = 0;
                        $("#ulTime span.k-delete").each(function ()
                        {
                            if (t == $(this).attr("id"))
                            {
                                isTrue = 1;                                
                            }
                        });
                        if (isTrue == 0)
                        {
                            $("ul#ulTime").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + t + " </span><span onclick='removeTimeItem(this)' id='" + t + "' class='k-icon k-delete remove'></span></li>");
                            $("#space").next('span').remove();
                            $("#space").remove();
                        }
                        RequiredValidate();
                        $("#EmailAlertTime").val('');
                    }
                }
            }).data("kendoTimePicker");
        }
    }
    else
    {
        $("#divMultiTime").remove();
        $("#EmailAlertTime").remove();
        $("#divtime").remove();
    }
}
//function __callBack() { }
function removeTimeItem(obj)
{
    $(obj).closest("li").remove();
    RequiredValidate();
}
var AcceptanceCutoffType = [{ Key: "0", Text: "Domestic" }, { Key: "1", Text: "International" }];
//function OnSelectCountry(e)
//{
//    var Data = this.dataItem(e.item.index());
//    $("#CityCode").val('');
//    $("#Text_CityCode").val('');
//    //$.ajax({
//    //    type: "POST",
//    //    url: "./Services/Master/AirportService.svc/GetCity?recid=" + Data.Text.substr(0, 2),
//    //    data: { id: 1 },
//    //    dataType: "json",
//    //    success: function (response) {
//    //        if (response.Data.length>0) {
//    //            var code = response.Data[0];
//    //            var text = response.Data[1];
//    //            $("#CityCode").val(code);
//    //            $("#Text_CityCode").val(code + "-" + text);
//    //        }

//    //    }
//    //});
//}
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
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
    {
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
                { name: 'AcceptanceCutoffType', display: 'Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, AutoCompleteName: 'Airport_AcceptanceCutoffType', filterField: 'ConnectionTypeName' },
                { name: 'AirlineSNo', display: 'Airline', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'Airport_AirlineSNo_', filterField: 'airlinecode' },
                { name: 'AircraftSNo', display: 'Aircraft Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, AutoCompleteName: 'Airport_AircraftSNo_', filterField: 'AircraftType' },
                { name: 'ProductSNo', display: 'Product', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'Airport_ProductSNo_', filterField: 'ProductName' },
                { name: 'SPHCSNo', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'Airport_SPHCSNo_', filterField: 'Code', separator: "," },
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

function RequiredValidate()
{
    var listlen = $("ul#ulTime li").length;
    if (listlen > 0)
    {
        $('#EmailAlertTime').attr('data-valid', '');
    }
    else
    {
        $('#EmailAlertTime').attr('data-valid', 'required');
    }
}
function EmailAlertValidate()
{
    $("#EmailAlertTime").bind('keyup', function (e)
    {
        this.value = this.value.replace(/[^0-9:]/g, '');
    });
    $("#EmailAlertTime").bind('keyup', function (e) {
        var validTime = $(this).val().match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
        if (!validTime)
        {
            $(this).val('');
        }
    });
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

