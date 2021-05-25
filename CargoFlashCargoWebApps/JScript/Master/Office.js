/*
*****************************************************************************
Javascript Name:	OfficeJS     
Purpose:		    This JS used to get autocomplete for office.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    BadiuzzAman Khan
Created On:		    5 March 2014
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
var commastr = "";
var finalstr = "";
var arrlist = [];
var div2 = "";
var commastr = "";
var pageType = $('#hdnPageType').val();
var HidOffice = '';
var HidOfficeSNo = '';
var OfficeType;
var updatedRows = new Array();
var InvoicingCycleType = [{ Key: "2", Text: "Weekly" }, { Key: "4", Text: "Fortnightly" }, { Key: "5", Text: "Monthly" }]
// Add ShowAgentOffice by UMAR on 05-Jul-2018
function ShowAgentOffice() {

    if ($('#Text_OfficeType').val() == "GSA" || $('#Text_OfficeType').val() == "CSA") {
        $('#tbl tbody tr:eq(15)').show();
        $('input[name=AllowCreditLimitOfOffice][value="0"]').prop('checked', true);
        $('input[name=AllowCreditLimitOnAgent][value="1"]').prop('checked', true);
        //$('input[name=AllowCreditLimitOfOffice]').attr('disabled', false);
        //$('input[name=IsAllowedCL][value="0"]').attr('checked', true);
        //$('input[name=IsAllowedCL]').attr('disabled', false);
        //$('input[name=IsHeadOffice][value="0"]').prop('checked', true);

    }
    else {
        $('#tbl tbody tr:eq(15)').hide();
        // $('[type="radio"][id="IsHeadOffice"]:checked').val() == "0"
        //$('input[name=IsHeadOffice][value="0"]').prop('checked', true);
        //$('input[name=IsAllowedCL][value="0"]').attr('checked', true);
        //$('input[name=IsAllowedCL]').attr('disabled', false);
        // $('input[name=AllowCreditLimitOfOffice][value="1"]').prop('checked', true);
        //$('input[name=AllowCreditLimitOnAgent][value="1"]').prop('checked', true);

    }

}
function BindEditBranchOffice() {
    if (($('#Text_OfficeType').val() == "GSA" || $('#Text_OfficeType').val() == "CSA") && $('[type="radio"][id="IsHeadOffice"]:checked').val() == "1") {
        //$('input[name=AllowCreditLimitOnAgent][value="1"]').prop('checked', true);
        $('input[name=IsAllowedCL][value="1"]').prop('checked', true);
        $('input[name=IsAllowedCL]').attr('disabled', true);
        $('input[name=AllowCreditLimitOfOffice][value="1"]').prop('checked', true);
        $('input[name=AllowCreditLimitOfOffice]').attr('disabled', true);
    }
    //else {
    //    // $('input[name=AllowCreditLimitOnAgent][value="1"]').prop('checked', true);
    //    $('input[name=IsAllowedCL][value="0"]').prop('checked', true);
    //    $('input[name=AllowCreditLimitOfOffice][value="0"]').prop('checked', true);
    //    $('input[name=IsAllowedCL]').attr('disabled', false);
    //    $('input[name=AllowCreditLimitOfOffice]').attr('disabled', false);
    //}
}
function BindNoByDefault() {
    //var strOfficeType = $('#Text_OfficeType').val();
    $('[type="radio"][id="IsHeadOffice"]').click(function () {

        if (($('#Text_OfficeType').val() == "GSA" || $('#Text_OfficeType').val() == "CSA") && $('[type="radio"][id="IsHeadOffice"]:checked').val() == "1") {
            //$('input[name=AllowCreditLimitOnAgent][value="1"]').prop('checked', true);
            $('input[name=IsAllowedCL][value="1"]').prop('checked', true);
            $('input[name=IsAllowedCL]').attr('disabled', true);
            $('input[name=AllowCreditLimitOfOffice][value="1"]').prop('checked', true);
            $('input[name=AllowCreditLimitOfOffice]').attr('disabled', true);
        }
        else {
            // $('input[name=AllowCreditLimitOnAgent][value="1"]').prop('checked', true);
            $('input[name=IsAllowedCL][value="0"]').prop('checked', true);
            $('input[name=AllowCreditLimitOfOffice][value="0"]').prop('checked', true);
            $('input[name=IsAllowedCL]').attr('disabled', false);
            $('input[name=AllowCreditLimitOfOffice]').attr('disabled', false);
        }
    })

}
$(document).ready(function () {
    // Add by UMAR ON 05-JUL-2018 ====
    $('#_tempCreditLimit').attr('disabled', true);
    $('#_tempMinimumCL').attr('disabled', true);

    $('#tbl tbody tr:eq(15)').hide();//Updated by indra pratap singh

    // End ===========================

    cfi.ValidateForm();
    $('#Text_OfficeType').prop('readonly', true);
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    //cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], CityCodeChange, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Office_CityCode", null, "contains", null, null, null, null, CityCodeChange);

    //cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "vGetAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoCompleteV2("AirportSNo", "AirportCode,AirportName", "Office_Airport", null, "contains");

    //cfi.AutoComplete("CurrencySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");

    //cfi.AutoComplete("ParentID", "CityCode,Name", "vHeadOffice", "SNo", "CityCode", ["CityCode", "Name"], null, "contains");
    cfi.AutoCompleteV2("ParentID", "CityCode,Name", "Office_ParentID", null, "contains");
    //cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "Office_Currency", null, "contains");

    // Add by Invoicing Cycle By UMAR
    cfi.AutoCompleteByDataSource("InvoicingCycle", InvoicingCycleType);

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //   cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        //    $("#CitySNo").val(userContext.CitySNo);
        //   $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);
        //  $("#AirportSNo").val(userContext.AirportSNo);
        //  $("#Text_AirportSNo").val(userContext.AirportCode + '-' + userContext.AirportName);
        $('#AlertClPercentage').after(' %');
        $('#StockUtilization').after('%');
        BindNoByDefault();
        var toDate = new Date();
        var futureDate = new Date(toDate.setFullYear(toDate.getFullYear() + 1));
        $("#ValidTo").data("kendoDatePicker").value(futureDate);
    }
    //================================Added By Arman Ali Date : 23 mar, 2017 ====================================

    $("#ValidFrom").attr('readOnly', 'true');
    $("#ValidTo").attr('readOnly', 'true');


    //==================================================end======================================================

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('#AlertClPerCentage').after(' %');
        $('#StockUtilization').after('%');
        HidOffice = $('#HidOffice').val();
        HidOfficeSNo = $('#OfficeType').val();

        if ($('#Text_OfficeType').val() == "GSA" || $('#Text_OfficeType').val() == "CSA") {
            $('#tbl tbody tr:eq(15)').show();
            //$('input[name=AllowCreditLimitOfOffice][value="0"]').prop('checked', true);
            //$('input[name=AllowCreditLimitOnAgent][value="0"]').prop('checked', true);
        }
        else {
            $('#tbl tbody tr:eq(15)').hide();
        }
        //$('#tbl tbody tr:eq(14)').show();   
        BindNoByDefault();
        BindEditBranchOffice();
        $('input[name=IsHeadOffice]').attr('disabled', true);
        var varIsHead = $('[type="radio"][name="IsHeadOffice"]:checked').val();
        if (($('#Text_OfficeType').val() == "GSA" || $('#Text_OfficeType').val() == "CSA") && (varIsHead == "0")) {
            $('[type="radio"][name="IsAllowedCL"]').prop('disabled', true)

        }
        $('input[name=IsAllowedCL]').attr('disabled', true);
        $('input[name=AllowCreditLimitOfOffice]').attr('disabled', true);
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        //var value = $("#Text_OfficeType").val()
        //if (value == "SELF") {
        $('span#AlertClPerCentage').after(' %');

        if ($('#OfficeType').val() == "GSA" || $('#OfficeType').val() == "CSA") {
            $('#tbl tbody tr:eq(15)').show();
        }
        else {
            $('span#spnAllowCreditLimitOfOffice').hide();
            $('#CreditLimitOfOffice').hide();
        }
    }
    // Add by UMAR ------------
    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        if ($('#Text_OfficeType').val() == "GSA" || $('#Text_OfficeType').val() == "CSA") {
            $('#tbl tbody tr:eq(15)').show();
        }
        else {
            $('#tbl tbody tr:eq(15)').hide();
        }
    }
    // ----------- End ---------

    //if ($('#Text_OfficeType').val() == "SELF") {
    //    debugger;
    //    $('#Text_OfficeType').prop('readonly', true);
    //    key = $("#OfficeType").val();
    //    text = $('#Text_OfficeType').val();
    //    var OfficeType = [{ Key: key, Text: text }];
    //    cfi.AutoCompleteByDataSource("OfficeType", OfficeType);
    //}
    //else {

    //    var OfficeType = [{ Key: "1", Text: "CSA" }, { Key: "2", Text: "CTO" }, { Key: "0", Text: "GSA" }, { Key: "3", Text: "SELF" }];
    //    cfi.AutoCompleteByDataSource("OfficeType", OfficeType);
    //}

    //var OfficeType = [{ Key: "0", Text: "GSA" }, { Key: "2", Text: "GHA" }, { Key: "3", Text: "GIA" }, { Key: "4", Text: "POS-CSC" }, { Key: "5", Text: "POS-KSO" }];


    /*--------------Add By Pankaj Kumar Ishwar on 29-01-2018------------------------------------------------*/

    $("#GSTNumber").hide();
    if (userContext.SysSetting.ICMSEnvironment == 'I5') {
        $("#GSTNumber").show();
    }
    /*
    if (userContext.SysSetting.ICMSEnvironment == 'JT')
    {
        var OfficeType = [{ Key: "0", Text: "GSA" }, { Key: "2", Text: "GHA" }, { Key: "3", Text: "AIRLINE OFFICE" }, { Key: "4", Text: "POS-CSC" }, { Key: "5", Text: "POS-KSO" }, { Key: "6", Text: "GSSA" }];
    }
    if(userContext.SysSetting.ICMSEnvironment =='GA')
    {
        var OfficeType = [{ Key: "0", Text: "GSA" }, { Key: "2", Text: "GHA" }, { Key: "3", Text: "GIA" }, { Key: "4", Text: "POS-CSC" }, { Key: "5", Text: "POS-KSO" }, { Key: "6", Text: "GSSA" }];
    }
    */
    //cfi.AutoCompleteByDataSource("OfficeType", OfficeType, changeOfficeType);

    //cfi.AutoCompleteV2("OfficeType", "OfficeTypeName", "Office_OfficeType", OfficeTypechange, "contains", null, null, null, null, changeOfficeType);
    cfi.AutoCompleteV2("OfficeType", "OfficeTypeName", "Office_OfficeType", changeOfficeType, "contains");

    //var OfficeType = [{ Key: "0", Text: "GSA" }, { Key: "2", Text: "GHA" }, { Key: "3", Text: "GIA" }, { Key: "4", Text: "POS-CSC" }, { Key: "5", Text: "POS-KSO" }, { Key: "6", Text: "GSSA" }];
    //cfi.AutoCompleteByDataSource("OfficeType", OfficeType, ShowAgentOffice);
    /*-------------------------------------------------------------------------------------------------------------*/

    /* Author : chandra prakash singh 
    Modification Date  : 27/12/2016
    Description : 
    1  Added changeOfficeType function for EDIT MODE
       officetype drop down change value in self mode
       can not show self mode  that show the first time value
       of office type dropdown
   */
    if ($("#IsHeadOffice").val() == "NO") {
        if (pageType != "READ")
            $("#IsHeadOffice").closest("tr").find("td:gt(1)").find('span#spnParentID').Show();
        //$("#Text_ParentID").data("kendoAutoComplete").enable(true);
    }
    else {
        //$("#IsHeadOffice").closest("tr").find("td:gt(1)").find('span#spnParentID').Show();
        $("#IsHeadOffice").closest("tr").find("td:gt(1)").css("display", "");
        if (pageType != "READ") {
            if ($("#Text_ParentID").data("kendoAutoComplete"))

                $("#Text_ParentID").data("kendoAutoComplete").enable(false);
        }
        // $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").css("display","none");
        // $("#IsHeadOffice").closest("tr").find("td:gt(1)").css("display", "none");
    }
    $('input:radio[name=IsHeadOffice]').change(function () { RadioButtonSelectShow(1); });
    var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");

    //$('#liOfficeCommision').hide();

    //$('#CreditLimit,#_tempCreditLimit').unbind('focusin').bind('focusin', function () {

    //    if ($('#CreditLimit').val() == '')
    //        $('#CreditLimit').val(0);
    //    if ($('input:radio[name=IsAllowedCL]:checked').val() == 1)
    //        $('#CreditLimit').attr('readonly', true);
    //    else if (parseInt($('#CreditLimit').val()) != 0)
    //        $('#CreditLimit').attr('readonly', true);
    //    else
    //        $('#CreditLimit').attr('readonly', false);
    //})

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

    var oldminCl = $("#MinimumCL").val();
    $("#MinimumCL").bind("blur", function () {
        var crlmt = $("#CreditLimit").val();
        var minlmt = $("#MinimumCL").val();
        if (crlmt == '' || parseInt(crlmt) == 0) {
            $("#_tempMinimumCL").val(0);
            $("#MinimumCL").val(0);
            $("#_tempAlertClPerCentage").val(0);
            $("#AlertClPerCentage").val(0);
        }
        if (parseInt(crlmt) < parseInt(minlmt)) {
            $("#_tempMinimumCL").val(oldminCl);
            $("#MinimumCL").val(oldminCl);
            ShowMessage('warning', 'Warning - Office!', "Minimum Credit Limit can not exceed the Credit Limit");
            $("#_tempMinimumCL").val('');
            $("#MinimumCL").val('');
            return false;
        }

    });


    $("#CreditLimit").bind("blur", function () {
        var crlmt = $("#CreditLimit").val();
        var minlmt = $("#MinimumCL").val();


        if (crlmt == '' || parseInt(crlmt) == 0) {
            $("#_tempMinimumCL").val(0);
            $("#MinimumCL").val(0);
            $("#_tempAlertClPerCentage").val(0);
            $("#AlertClPerCentage").val(0);
        }
        //======commented by arman ali================
        //else {
        //    $("#CreditLimit").prop("readonly", true);
        //}
        //================end===========================
        if (parseInt(crlmt) < parseInt(minlmt)) {
            $("#_tempMinimumCL").val(oldminCl);
            $("#MinimumCL").val(oldminCl);
            ShowMessage('warning', 'Warning - Office!', "Minimum Credit Limit can not exceed the Credit Limit");
            $("#_tempMinimumCL").val('');
            $("#MinimumCL").val('');
            return false;
        }

    });



    $(document).on('drop', function () {
        return false;
    });

    div2 = $("<div id='divMultisitaAdd' style='overflow: auto;'><ul id='mainul' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    $("#Text_SitaAddress").after(div2);
    //getsetSitaAddress();  //unbind('click').


    $("input[name='operation']").click(function () {



        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        var len = $("ul#mainul li span").text().split(' ').length - 1;
        for (var i = 0; i < len; i++) {
            commastr = commastr + $("ul#mainul li span").text().split(' ')[i] + ','
        }

        if (pageType == "EDIT") {
            finalstr = commastr.slice(0, -1)
            $("#SitaAddress").val(finalstr);
            if ($("#mainul li").length > 0)
                $("#SitaAddress").removeAttr("data-valid");
        }
        else
            finalstr = commastr.slice(0, -1);
        $("#SitaAddress").val(finalstr);
        $("#Text_SitaAddress").val(finalstr);
        if (cfi.IsValidSubmitSection()) {
            $('[type="radio"][name="IsHeadOffice"]').removeAttr('disabled'); 
            $('[type="radio"][name="AllowCreditLimitOfOffice"]').removeAttr('disabled');
            $('[type="radio"][name="IsAllowedCL"]').removeAttr('disabled');
            return true
        }
        else {
            return false
        }




    });

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var a = 0;
        RadioButtonSelectShow(a);
    }

    BindingGridonClick();
    function BindingGridonClick() {
        var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liContactInformation").hide();
            //$("#liOfficeAirline").hide();
            //$("#liAcceptanceVariance").hide();

            tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(3), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(4), false);

        }
        else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            tabStrip.enable(tabStrip.tabGroup.children().eq(4), false);
        }
    }


    $("#SMS").after('SMS');
    $("#Message").after('Email');
    $("#MessageCSR").after('CSR Email');
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#SMS").attr('disabled', true);
        $("#Message").attr('disabled', true);
    }

    if ($("#SMS").is(':checked') == true) {
        $("#Mobile").attr('data-valid', 'required');
        $("#Mobile").closest('td').prev().find('font').html('*');
        //  $("#_tempMobile").show();
        $("#Mobile").show();
        $("#Mobile").closest('td').prev().find('span').show();
        $("#_tempMobile").focus();
    }
    else {
        $("#Mobile").removeAttr('data-valid');
        $("#Mobile").closest('td').prev().find('font').html('');
        $("#_tempMobile").hide();
        $("#Mobile").hide();
        $("#Mobile").closest('td').prev().find('span').hide();
    }

    $("#Email").closest('td').prev().find('span').append(' (Max 5)');
    if ($("#Message").is(':checked') == true) {
        $("#Email").attr('data-valid', 'required');
        $("#Email").closest('td').prev().find('font').html('*');
        $("#Email").show();
        $("#Email").closest('td').prev().find('span').show();

    }
    else {
        $("#Email").removeAttr('data-valid');
        $("#Email").closest('td').prev().find('font').html('');
        $("#Email").hide();
        $("#Email").closest('td').prev().find('span').hide();
    }
    if ($("#MessageCSR").is(':checked') == true) {
        $("#EmailID").attr('data-valid', 'required');
        $("#EmailID").closest('td').prev().html('CSR Email');
        $("#EmailID").show();
    }
    else {
        $("#EmailID").removeAttr('data-valid');
        $("#EmailID").closest('td').prev().html('');
        $("#EmailID").hide();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        RadioButtonSelectShow(0);
        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
        $("#Email").after(spnlbl2);
        $("#EmailLabel").hide();

        divemail = $("<div id='divemailAdd' style='overflow:auto;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("#Email").after(divemail);
        SetEMailNew();


        var spnlbl3 = $("<span class='k-label'id='EmailIDLabel'>(Press space key to capture receiver E-mail Address)</span>");
        $("#EmailID").after(spnlbl3);
        $("#EmailIDLabel").hide();
        $("#Email").css("text-transform", "uppercase");
        $("#EmailID").css("text-transform", "uppercase");

        divemailid = $("<div id='divemailidAdd' style='overflow:auto;'><ul id='addlist3' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailid").length == 0)
            $("#EmailID").after(divemailid);
        SetEMailIDNew();


        //var M = '';
        //for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++)
        //{ M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }


        //$("#Email").val(M.substring(0, M.length - 1));       //remove last comma   

        if ($("#addlist2 li").length > 0 && $("#Message").is(':checked') == true) {
            $("#Email").removeAttr("data-valid");
        }
        else if ($("#addlist2 li").length == 0 && $("#Message").is(':checked') == false) {
            $("#Email").removeAttr("data-valid");
        }
        else {
            $("#Email").attr("data-valid", "required");
        }

        if ($("#addlist3 li").length > 0 && $("#MessageCSR").is(':checked') == true) {
            $("#MessageCSR").removeAttr("data-valid");
        }
        else if ($("#addlist3 li").length == 0 && $("#MessageCSR").is(':checked') == false) {
            $("#MessageCSR").removeAttr("data-valid");
        }
        else {
            $("#MessageCSR").attr("data-valid", "required");
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        if ($("#Message").is(':checked') == true) {
            $("#EmailLabel").show();
            var textemail = $("#Email").val();
            $("#Email").val('');// added by arman ali
            var len = textemail.split(",").length;
            if (textemail != "") {
                for (var jk = 0; jk < len; jk++) {
                    $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textemail.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                }
                //$("#Email").val("");
                $("#Email").removeAttr('data-valid');
            }
        }
        if ($("#MessageCSR").is(':checked') == true) {
            $("#EmailIDLabel").show();
            var textemail = $("#EmailID").val();
            $("#EmailID").val('');// added by arman ali
            var len = textemail.split(",").length;
            if (textemail != "") {
                for (var jk = 0; jk < len; jk++) {
                    $("ul#addlist3").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textemail.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                }
                //$("#Email").val("");
                $("#EmailID").removeAttr('data-valid');
            }
        }
    }


    $('input[name=operation]').on('click', function () {
        if (getQueryStringValue("FormAction").toUpperCase() != "DELETE") {
            var M = '';
            var N = '';
            for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++) { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
            $("#Email").val(M == '' ? '' : M.substring(0, M.length - 1));
            for (var i = 0; i < $("ul#addlist3 li").text().split(' ').length - 1; i++) { N = N + $("ul#addlist3 li span").text().split(' ')[i] + ','; }
            $("#EmailID").val(N == '' ? '' : N.substring(0, N.length - 1));
            cfi.ValidateForm();
            if ($("#Mobile").val().length < 6 && $("#SMS").attr('checked') == "checked") {
                ShowMessage('info', 'Need your Kind Attention!', "Mobile Number Length Should Be Greater Than 5");
                // $("#Mobile,#_tempMobile").val('');
                return false;
            }
        }
    });


});
var pageType = getQueryStringValue("FormAction").toUpperCase();

//function BlankAirport()
//{
//  $('#Text_AirportSNo').val('');
//}

function getsetSitaAddress() {

    if (pageType == "NEW" || pageType == "EDIT") {
        if (pageType == "EDIT") {
            $("#SitaAddress").after(div2);
            var txtval = $("#SitaAddress").val().toUpperCase();
            var lens = $("#SitaAddress").val().split(',').length;
            if (txtval != "") {
                for (var jk = 0; jk < lens ; jk++) {
                    $("ul#mainul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + $("#SitaAddress").val().split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>") //--- 4
                }
            }
            $('#SitaAddress').val("");
        }
        $("#SitaAddress").keyup(function (event) {
            // if (event.which == 13) {
            var txtval1 = $("#SitaAddress").val().toUpperCase();
            txtval1 = txtval1.replace(/\s/g, '');

            txtval1 = $("#SitaAddress").val(txtval1);
            var txtval = txtval1.val().toUpperCase();

            if (txtval.length == 7) {

                var restdata = $("ul#mainul li").text().split(" ");

                for (var i = 0; i < restdata.length; i++) {
                    if (txtval == restdata[i]) {
                        $("#SitaAddress").val('');
                        ShowMessage('warning', 'Warning - Office', "SITA Address already entered");
                        return;
                    }
                }

                if ($("ul#mainul li").length < 4) {
                    var i = $("ul#mainul li").length;
                    $("ul#mainul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + txtval + " </span><span id='" + i + "' class='k-icon k-delete remove'></span></li>") //--- 4
                    $('#SitaAddress').val("");
                }
                else {
                    ShowMessage('warning', 'Warning - Office', "Maximum 4 SITA Address allowed.");
                }
                $('#SitaAddress').val("");
            }
            event.preventDefault();
            // }          
        });
        $("#SitaAddress").blur(function () {
            $("#SitaAddress").val('');
        });
        $("#Text_SitaAddress").keyup(function (event) {
            var txtval1 = $("#Text_SitaAddress").val().toUpperCase();
            txtval1 = txtval1.replace(/[^0-9a-zA-Z]/g, '');
            txtval1 = $("#Text_SitaAddress").val(txtval1);
            var txtval = txtval1.val().toUpperCase();

            if (txtval.length == 7) {

                var restdata = $("ul#mainul li").text().split(" ");

                for (var i = 0; i < restdata.length; i++) {
                    if (txtval == restdata[i]) {
                        $("#Text_SitaAddress").val('');
                        ShowMessage('warning', 'Warning - Office', "SITA Address already entered");
                        return;
                    }
                }
                if (txtval != "") {
                    if ($("ul#mainul li").length < 4) {
                        var i = $("ul#mainul li").length;
                        $("ul#mainul").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + txtval + " </span><span id='" + i + "' class='k-icon k-delete remove'></span></li>") //--- 4
                        $('#Text_SitaAddress').val("");
                    }
                    else {
                        ShowMessage('warning', 'Warning - Office', "Maximum 4 SITA Address allowed.");
                    }
                }
                $('#Text_SitaAddress').val("");
            }
            event.preventDefault();
            // }
        });

        $("#Text_SitaAddress").blur(function () {
            $("#Text_SitaAddress").val('');
        });

        $("body").on("click", ".remove", function () {
            $(this).closest("li").remove();
        });
    }
}
function SetFormData(strval) {
    $('#SitaAddress').val(strval);
}

function ExtraCondition(textId) {
    CityId = textId.replace("CountryName", "CityName");
    var Env = userContext.SysSetting.ICMSEnvironment;
    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("tblContactInformation_CityName") >= 0) {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.setFilter(filterEmbargo, "CountrySNo", "in", $('#tblContactInformation_HdnCountryName_' + textId.split('_')[2]).val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
    if (textId == "Text_CurrencySNo") {
        return cfi.getFilter("AND"), cfi.setFilter(filterEmbargo, "SNo", "notin", $("#CurrencySNo").val()), cfi.autoCompleteFilter(filterEmbargo);
    };

    if (textId.indexOf("tblOfficeAirlineTrans_AirlineCode") >= 0) {
        var val = $("input[id^='tblOfficeAirlineTrans_AirlineCode']").map(function () {
            return $("#" + $(this).attr("id").replace('tblOfficeAirlineTrans_AirlineCode_', 'tblOfficeAirlineTrans_HdnAirlineCode_')).val();
        }).get().join(',');

        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", val), filter = cfi.autoCompleteFilter(textId);
    }

    if (textId == "Text_AirportSNo") {
        cfi.setFilter(filterEmbargo, "CitySNo", "eq", $("#CitySNo").val())
        return cfi.autoCompleteFilter(filterEmbargo);
    };

    if (textId == "Text_OfficeType") {
        cfi.setFilter(filterEmbargo, "AirlineCode", "eq", Env);
        return cfi.autoCompleteFilter(filterEmbargo);
    };
    if (textId == "Text_ParentID") {
        if ($('#OfficeType').val() != "") {
            cfi.setFilter(filterEmbargo, "OfficeType", "eq", $('#OfficeType').val());
        }
        return cfi.autoCompleteFilter(filterEmbargo);
    };
}


function RadioButtonSelectShow(a) {

    if ($("input[name='IsHeadOffice']:checked").val() == 1 || $("input[name='IsHeadOffice']").val() == "No") {
        $("#IsHeadOffice").closest("tr").find("td:gt(1)").css("display", "");  //.removeAttr('disabled'); // .attr('disabled', '');   
        //$("#IsHeadOffice").closest("tr").find("td:gt(1)").prop("disabled", false);
        if (pageType != "READ") {
            $("#Text_ParentID").data("kendoAutoComplete").enable(true);
            if (pageType != "READ" && pageType != "DELETE" && a == 1) {
                $("#ERPCode").val('') // ADDED  BY DEVENDRA ON 10 MAY 2019
                $("#ERPCode").attr('disabled', true)
            }
        }

    }
    else {
        if (pageType != "READ") {
            $("#Text_ParentID").data("kendoAutoComplete").enable(false);
            $("#Text_ParentID").val('');
            if (pageType != "READ" && pageType != "DELETE" && a == 1) {
                $("#ERPCode").attr('disabled', false)

            }
        }
        // $("#IsHeadOffice").closest("tr").find("td:gt(1)").css("display","none");  //.prop("disabled", true);.attr("disabled", true)
        //$("#IsHeadOffice").closest("tr").find("td:gt(1)").prop("disabled", true);
    }
    $('br:gt(1)').remove();
}




$('#liOfficeCommision').click(function () {
    CreateOfficeCommisonTable();
    $('#tblOfficeCommision tr select[id*="tblOfficeCommision_OfficeCommisionType"]').each(function () {
        if ($(this).val() == '1') {
            var inputID = this.id;
            if (inputID.split('_').length == 3) {
                CheckOfficeCommision(eval(inputID.split('_')[2]) - 1);
            }
        }
    });

});

function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
            alert(cntrlId);
            /////////////;///////////
            //var k = $('#' + obj).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            //var dfrom = new Date(Date.parse(k));
            //var validFrom = $('#' + obj).attr("id").replace("From", "To");
            //// alert(validFrom);
            //k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            //var dto = new Date(Date.parse(k));
            //if (dfrom > dto) {
            //    $('#' + obj).val("");
            //    alert('Valid From date can not be greater than Valid To date.');
            //}



            ///////////////////////


        });
    }


}

function CreateOfficeCommisonTable() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Office Commission  can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableName = "OfficeCommision";
        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: pageType == 'EDIT',
            tableColume: 'SNo,OfficeSNo,NetNet,CommisionType,CommisionAmount,IncentiveType,IncentiveAmount,ValidFrom,ValidTo,IsActive',
            masterTableSNo: $('#hdnOfficeCommisionSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/OfficeService.svc',
            getRecordServiceMethod: 'GetOfficeCommisionRecord',
            createUpdateServiceMethod: 'CreateUpdate' + dbtableName,
            deleteServiceMethod: 'Delete' + dbtableName,
            caption: 'GSA Commission',
            isGetRecord: true,
            initRows: 1,
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                     { name: 'OfficeSNo', type: 'hidden', value: $('#hdnOfficeCommisionSNo').val() },
                     { name: pageType == 'EDIT' ? 'NetNet' : 'NetNet', display: 'Type', type: 'select', ctrlOptions: { 0: '--Select--', 1: 'NetNet', 2: 'Commision' }, onChange: function (evt, rowIndex) { } },
                     { name: pageType == 'EDIT' ? 'CommisionType' : 'CommisionType', display: 'Unit', type: 'select', ctrlOptions: { 0: '--Select--', 1: 'Revenue', 2: 'Weight' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                     { name: 'CommisionAmount', display: 'Commission Amount', type: 'text', value: 0, ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, onChange: function (evt, rowIndex) { } },
                     { name: pageType == 'EDIT' ? 'IncentiveType' : 'OfficeIncentive', display: 'Incentive Type', type: 'select', ctrlOptions: { 0: '--Select--', 1: 'Percentage', 2: 'Kg' }, onChange: function (evt, rowIndex) { } },
                     { name: 'IncentiveAmount', display: 'Incentive Amount', type: 'text', ctrlCss: { width: '60px', height: '20px' }, value: 0, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return checkNumeric(this.id);" } },
                     { name: 'ValidFrom', display: 'Valid From', type: 'text', ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { CheckDateOfficeCommision(rowIndex) } },
                     { name: 'ValidTo', display: 'Valid To', type: 'text', ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { CheckDateOfficeCommision(rowIndex) } },
                     { name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } }
            ],
            isPaging: true,

        });

    }
}

function FetchNetNet(rowIndex) {
    if (rowValue == 1) {
        var rowValue = $('#tbl' + dbtableName + '_OfficeCommisionType_' + eval(eval(rowIndex) + 1)).val();
        $('#tbl' + dbtableName + '_NetNet_' + eval(rowIndex + 1)).val("1");
    }
}

function CheckOfficeCommision(rowIndex) {
    var dbtableName = "OfficeCommision";
    var rowValue = $('#tbl' + dbtableName + '_OfficeCommisionType_' + eval(eval(rowIndex) + 1)).val();
    if (rowValue == 1) {
        $('#tbl' + dbtableName + '_CommisionAmount_' + eval(rowIndex + 1)).attr("disabled", "disabled");
        $('#tbl' + dbtableName + '_CommisionAmount_' + eval(rowIndex + 1)).removeAttr("required");
        $('#tbl' + dbtableName + '_CommisionAmount_' + eval(rowIndex + 1)).val("0");
        $('#tbl' + dbtableName + '_CommisionType_' + eval(rowIndex + 1)).attr("disabled", "disabled");
        $('#tbl' + dbtableName + '_CommisionType_' + eval(rowIndex + 1)).val("0");
        $('#tbl' + dbtableName + '_NetNet_' + eval(rowIndex + 1)).val("1");
    }
    else {
        $('#tbl' + dbtableName + '_CommisionAmount_' + eval(rowIndex + 1)).removeAttr("disabled");
        $('#tbl' + dbtableName + '_CommisionType_' + eval(rowIndex + 1)).removeAttr("disabled", "disabled");
        $('#tbl' + dbtableName + '_NetNet_' + eval(rowIndex + 1)).val("0");
    }
}

function CheckDateOfficeCommision(rowIndex) {
    var dbtableName = "OfficeCommision";
    var ValidFrom = $('#tbl' + dbtableName + '_ValidFrom_' + eval(eval(rowIndex) + 1)).val();
    var ValidTo = $('#tbl' + dbtableName + '_ValidTo_' + eval(eval(rowIndex) + 1)).val();

    var k = ValidFrom.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    k = ValidTo.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    if (dfrom > dto) {
        alert('Valid From date can not be greater than Valid To date.');
    }

    //$("input[id*=ValidTo]").change(function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    var validFrom = $(this).attr("id").replace("To", "From");
    //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));
    //    if (dfrom > dto) {
    //        $(this).val("");
    //        alert('Valid From date can not be greater than Valid To date.');
    //    }
    //});

    //$("input[id*=ValidFrom]").change(function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));
    //    var validFrom = $(this).attr("id").replace("From", "To");
    //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    if (dfrom > dto)
    //        $(this).val("");
    //    alert('Valid From date can not be greater than Valid To date.');
    //});
}

//Below Method used to assign airline to  office


/* Author : chandra prakash singh 
   Modification Date  : 27/12/2016
   Description : 
   1  Added condition that in office type self  mode 
  we add only single associate airlines
   2  d==1 means database table return single row 
   
   3 d==0 means database table return no row (zero)

   4  #HidOffice is hidden field hold officetype name at editable time
 */



$('#liOfficeAirline').click(function () {

    //var Text_OfficeType = $("#Text_OfficeType").val();
    var HidOffice = ($('#HidOffice').val());


    getAssociatedAirlineCount(function (d) {
        //processing the data


        if (d == 1 && HidOffice == 'SELF') {

            CreateOfficeAirlineTable();
            $("#tblOfficeAirlineTrans_btnAppendRow").hide();

        }
        else if (d == 0 && HidOffice == 'SELF') {
            CreateOfficeAirlineTable();

            $("#tblOfficeAirlineTrans_btnAppendRow").show();


        }
        else {

            CreateOfficeAirlineTable();


        }
        $('[id^="tblOfficeAirlineTrans_ValidFrom_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
            setdatevalue();
        });
        $('[id^="tblOfficeAirlineTrans_ValidTo_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
            setdatevalue();
        });


    });




});

/* Author : chandra prakash singh 
   Modification Date  : 27/12/2016
   Description : 
   1  Added condition that is if officetype self mode 
     then associate airline  has single row then 
     then we hide append button
   
 */

$('#tblOfficeAirlineTrans_btnAppendRow').live("click", function () {

    var HidOffice = ($('#HidOffice').val());

    if (HidOffice == "SELF") {

        $("#tblOfficeAirlineTrans_btnAppendRow").hide();
    }
    else {

        $("#tblOfficeAirlineTrans_btnAppendRow").show();
    }

});

/* Author : chandra prakash singh 
   Modification Date  : 27/12/2016
   Description : 
   1  Added condition that is if officetype self mode 
     if associate airline  has zero row then 
     then we show append button
   
 */
$(document).on('click', '#tblOfficeAirlineTrans_btnRemoveLast', function () {
    //RemoveLast = $('#Text_OfficeType').val();
    var HidOffice = ($('#HidOffice').val());

    if (HidOffice == "SELF") {

        $("#tblOfficeAirlineTrans_btnAppendRow").show();
    }
    else {


    }


});



/* Author : chandra prakash singh 
   Modification Date  : 27/12/2016
   Description : 
   1  Added condition that in EDIT MODE
      officetype drop down change value in self mode
      can not show self mode  that show the first time value
      of office type dropdown
      
   
 */

function changeOfficeType() {
    $('#Text_ParentID').data("kendoAutoComplete").value(''); //Added by devendra 2may2019
    $('#Text_ParentID').data("kendoAutoComplete").key(''); //Added by devendra 2may2019
    ShowAgentOffice();
    OfficeTypechange();
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        var value = $("#Text_OfficeType").val()
        //if (value == "SELF") {
        //    cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        //}
        //else {
        //    cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains", ",");

        //}
        cfi.ResetAutoComplete("CitySNo");
        $('#Text_CitySNo').val('');
        var OfficeType = $("#Text_OfficeType").val();
        var HidOffice = ($('#HidOffice').val());


        if (HidOffice == "SELF") {
            $('#Text_OfficeType').val(HidOffice);

        }

        getAssociatedAirlineCount(function (d) {
            //processing the data
            //  alert(d);

            if (d >= 1 && HidOffice == 'SELF') {
                $('#OfficeType').val(HidOfficeSNo);
                $('#Text_OfficeType').val(HidOffice);

                ShowMessage('info', 'Need your Kind Attention!', "Associate Airline Can Not Be More Than One  For Office Type SELF.");

            }
            else if (d >= 1 && OfficeType == 'SELF') {
                $('#OfficeType').val(HidOfficeSNo);
                $('#Text_OfficeType').val(HidOffice);

                ShowMessage('info', 'Need your Kind Attention!', "Associate Airline Can Not Be More Than One  For Office Type SELF.");

            }


        });
        //  alert(d);
    }
}


//function CreatePracticeTable() {
//    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//        ShowMessage('info', 'Need your Kind Attention!', "Associated Airlines  can be added in Edit/Update mode only.");
//        return;
//    }
//    else {


//        var Practice = "Practice";
//        $('#tbl' + Practice).appendGrid({
//            tableID: 'tbl' + Practice,
//            contentEditable: pageType == 'EDIT',
//            tableColume: 'SNo,OfficeSNo,AirlineSNo,ValidFrom,ValidTo,IsActive',
//            masterTableSNo: $('#hdnofficSNo').val(),
//            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: '',
//            servicePath: './Services/Master/OfficeService.svc',
//            getRecordServiceMethod: 'GetOfficeAirlineTransRecord',
//            createUpdateServiceMethod: 'CreateUpdate' + Practice,
//            deleteServiceMethod: 'DeleteOfficeAirline',
//            caption: 'Associated Practice',
//            isGetRecord: true,
//            initRows: 1,


//            columns: [
//                     { name: 'SNo', type: 'hidden', value: 0 },
//                     { name: 'OfficeSNo', type: 'hidden', value: $('#hdnofficSNo').val() },
//                     {
//                         name: 'AirlineCode', display: 'Airline', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'view_airline', textColumn: 'AirlineCode', keyColumn: 'SNo', filterCriteria: "contains"
//                     },
//                    // { name: "FFM", display: "FFM", type: "select", ctrlCss: { height: '20px' }, ctrlOptions: ['MANUAL', 'AUTO'] },

//                     { name: "FAASMSMobile", display: "FAA (SMS Mobile)", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, minlength: 0, controltype: "number" }, isRequired: true, onblur: "return validate(this);" },
//                      {
//                          name: 'FFMStatus', display: "FFM", type: 'radiolist', ctrlOptions: { 0: 'Auto', 1: 'Manual' }, selectedIndex: 0, onClick: function (evt, rowIndex) { }
//                      },

//                     {
//                         name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) {
//                             SetDateRangeValue(rowIndex)
//                         }
//                     },
//                     {
//                         name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) {
//                             SetDateRangeValue(rowIndex)

//                         }
//                     },

//                     {
//                         name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
//                     }

//            ],
//            isPaging: true,
//        });
//    }
//}


function CreateOfficeAirlineTable() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Associated Airlines  can be added in Edit/Update mode only.");
        return;
    }
    else {


        var OfficeAirlineTrans = "OfficeAirlineTrans";
        $('#tbl' + OfficeAirlineTrans).appendGrid({
            tableID: 'tbl' + OfficeAirlineTrans,
            contentEditable: pageType == 'EDIT',
            tableColume: 'SNo,OfficeSNo,AirlineSNo,ValidFrom,ValidTo,IsActive',
            masterTableSNo: $('#hdnofficSNo').val(),
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: '',
            servicePath: './Services/Master/OfficeService.svc',
            getRecordServiceMethod: 'GetOfficeAirlineTransRecord',
            createUpdateServiceMethod: 'CreateUpdate' + OfficeAirlineTrans,
            deleteServiceMethod: 'DeleteOfficeAirline',
            caption: 'Associated Airline',
            isGetRecord: true,
            initRows: 1,


            columns: [
                     { name: 'SNo', type: 'hidden', value: 0 },
                     { name: 'OfficeSNo', type: 'hidden', value: $('#hdnofficSNo').val() },
                     {
                         name: 'AirlineCode', display: 'Airline', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'Office_AssociateAirlinecode', filterField: 'AirlineCode', filterCriteria: "contains"
                     },
                    // { name: "FFM", display: "FFM", type: "select", ctrlCss: { height: '20px' }, ctrlOptions: ['MANUAL', 'AUTO'] },

                     { name: "FAASMSMobile", display: "FAA (SMS Mobile)", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 16, minlength: 6, controltype: "number", onblur: "return validate(this.id);" } }, // added by arman ali
                      { name: "FAAEmail", display: "FAA Email", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 50, minlength: 0, onblur: "return checkForEmail(this.id);" } },
                      {
                          name: 'FFMStatus', display: "FFM", type: 'radiolist', ctrlOptions: { 0: 'Auto', 1: 'Manual' }, selectedIndex: 0, onClick: function (evt, rowIndex) { }
                      },

                     {
                         name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', onChange: "return Checkstart(this.id);", readOnly: true }, ctrlCss: { width: '90px', height: '20px' }
                     },
                     {
                         name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', onChange: "return CheckEnd(this.id);", readOnly: true }, ctrlCss: { width: '90px', height: '20px' }
                     },

                     {
                         name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
                     }

            ],
            isPaging: true,
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                if (pageType == "EDIT" || pageType == "DUPLICATE") {
                    $('[id^="tblOfficeAirlineTrans_ValidFrom_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
                        setdatevalue();
                    });
                    $('[id^="tblOfficeAirlineTrans_ValidTo_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
                        setdatevalue();
                    });
                    lastRowIndex = $("tr[id^='tblOfficeAirlineTrans_Row_']:last").attr('id').split("_")[2];
                    var toDate = new Date();
                    var futureDate = new Date(toDate.setFullYear(toDate.getFullYear() + 1));
                    var cntrlId = 'tblOfficeAirlineTrans_ValidTo_' + lastRowIndex;
                    $("#" + cntrlId).data("kendoDatePicker").value(futureDate);
                }
            },
        });
    }
}

function ContactInformationGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Account Contact Information  can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableName = "ContactInformation";
        $("#tbl" + dbtableName).appendGrid({
            tableID: "tbl" + dbtableName,
            contentEditable: pageType == 'EDIT',
            //contentEditable: $('#hdnPageType').val(),
            masterTableSNo: $("#hdnofficSNo").val(),
            currentPage: 1,
            itemsPerPage: 10,
            whereCondition: null,
            sort: "",
            isGetRecord: true,
            servicePath: "./Services/Master/OfficeService.svc",
            getRecordServiceMethod: "GetContactInformationRecord",
            createUpdateServiceMethod: "CreateUpdateOfficeContact",
            caption: "Contact Information",
            deleteServiceMethod: "DeleteOfficeContact",
            initRows: 1,
            columns: [{ name: "SNo", type: "hidden", value: 0 },
                     { name: 'OfficeSNo', type: 'hidden', value: $('#hdnofficSNo').val() },
                     //  { name: "SitaAddress", display: "SitaAddress", type: "hidden", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 500, controltype: "default" }, isRequired: true },
                     { name: "Name", display: "Name", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "alphanumericupper" }, isRequired: true },
                      {
                          name: "CountryName", display: "Country", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return RemoveCity(this.id);" }, ctrlCss: { width: "100px" }, isRequired: true, AutoCompleteName: "Master_OfficeContact_CountryName", filterField: 'CountryName', onChange: function (evt, rowIndex) {

                          }
                      },
                      { name: "CityName", display: "City", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, AutoCompleteName: "Master_OfficeContact_City", filterField: "CityName" },
                     { name: "EmailId", display: "Email Id", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 498, onblur: "return checkForEmail(this.id);" }, isRequired: true },

                     { name: "MobileNo", display: "Mobile No", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 16, minlength: 6, controltype: "number", onblur: "return checkForLength(this.id);" }, onChange: function (evt, rowIndex) { }, isRequired: true },
                     { name: "PhoneNo", display: "Phone No", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 16, minlength: 6, controltype: "number", onblur: "return checkForLength(this.id);" }, isRequired: true },
                     { name: "Address", display: "Address", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 498, controltype: "default" }, isRequired: true },


                     { name: "PostalCode", display: "Postal Code", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "number" }, isRequired: true },

                     { name: pageType == "EDIT" || pageType == "NEW" ? "Active" : "IsActive", display: "Active", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 1 }
            ],

            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

                //  debugger;
                var count = $('#tblContactInformation  >tbody >tr').length;
                for (i = 1; i <= count; i++) {

                    var sno = $("#tblContactInformation_HdnCountryName_" + i).val();
                    //  alert(i);
                    GetIsdCode(sno, i);

                    $("#tblContactInformation_CountryName_" + i).attr('disabled', true);
                    $("#tblContactInformation_CityName_" + i).attr('disabled', true);
                }


            },
            isPaging: true
        });
    }
}
function OfficeBranchGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        ShowMessage('info', 'Need your Kind Attention!', "Office Branch Information can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableName = "Branch";
        $("#tbl" + dbtableName).appendGrid({
            tableID: "tbl" + dbtableName,
            contentEditable: "EDIT",
            masterTableSNo: $("#hdnofficSNo").val(),
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
            isGetRecord: true,
            servicePath: "./Services/Master/OfficeService.svc",
            getRecordServiceMethod: "GetofficeBranchRecord",
            caption: "Branch Information",
            initRows: 1,
            columns: [{ name: "SNo", type: "hidden" },
                     { name: "OfficeSNo", type: "hidden", value: $("#hdnofficSNo").val() },
                     { name: "CityCode", display: "City Code", type: "label", ctrlCss: { width: "100px" } },
                     //{ name: "CityName", display: "City Name", type: "label", ctrlCss: { width: "100px" } },
                     { name: "Name", display: "Name", type: "label", ctrlCss: { width: '100px' } },
                     { name: "Address", display: "Address", type: "label", ctrlCss: { width: '100px' } }

            ],
            isPaging: true,
            hideButtons: { updateAll: true, insert: true, remove: true, append: true, removeLast: true }
        });
        // $("#tblBranch tr td:first-child").hide;// for hiding first td
        //$("#tblBranch tr td:last-child").hide();// for hiding last td
    }
}
$('#liAcceptanceVariance').click(function () {

    AcceptanceVarianceGrid();
    //ContactInformationGrid1();


    $('#tblAcceptanceVariance thead tr').each(function () {
        $(this).closest('tr').children('td').attr('align', 'center');
    })

    //$('#tblAcceptanceVariance_btnAppendRow').click(function () {
    $('#tblAcceptanceVariance table tbody tr').each(function () {
        $(this).closest('tr').children('td').attr('align', 'center');
    })

    var count = 1;
    $('#tblAcceptanceVariance table tbody tr td').each(function () {
        if ($(this).find('input:text').val() == "0") {
            $(this).find('input:text').val("");
            if (count % 2 == 0) {
                $(this).find('input:text').attr('PlaceHolder', 'Vol%').css('color', 'gray')
            }
            else {
                $(this).find('input:text').attr('PlaceHolder', 'Gr%').css('color', 'gray')
            }


            //$(this).find("input:button[id^='tblAcceptanceVariance_Delete'").remove();
        }
        count = count + 1;
    })
    //$('*[id^=tblAcceptanceVariance_Insert_]').attr('title', 'Save Row')
    $('#tblAcceptanceVariance_btnRemoveLast').remove();
    $('#tblAcceptanceVariance_btnAppendRow').remove();
    $('#tblAcceptanceVariance_btnUpdateAll ').attr('title', 'Save All Record')
    $('#tblAcceptanceVariance_btnUpdateAll').text("Save All");
});

function AcceptanceVarianceGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Acceptance Variance  can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableName = "AcceptanceVariance";
        $("#tbl" + dbtableName).appendGrid({
            tableID: "tbl" + dbtableName,
            contentEditable: pageType == 'EDIT',
            //contentEditable: $('#hdnPageType').val(),
            masterTableSNo: $("#hdnofficSNo").val(),
            currentPage: 1,
            itemsPerPage: 5,
            whereCondition: null,
            sort: "",
            isGetRecord: true,
            servicePath: "./Services/Master/OfficeService.svc",
            getRecordServiceMethod: "GetAcceptanceVarianceRecord",
            createUpdateServiceMethod: "CreateUpdateAcceptanceVariance",
            caption: "Airline Office",
            deleteServiceMethod: "DeleteAcceptanceVariance",
            initRows: 1,
            columns: [
                 { name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AirlineSNo', type: 'hidden', value: $('#hdnAirlineSNo').val() },
                 { name: 'OfficeSNo', type: 'hidden', value: $("#hdnofficSNo").val() },
                 { name: 'OfficeAirlineTransSNo', type: 'hidden', value: $("#hdnOfficeAirlineTransSNo").val() },
                 {
                     name: 'AirlineCode', display: 'Airline', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '40px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'Master_Officevar_AirlineCode', filterField: 'AirlineCode', filterCriteria: "contains"
                 },

                  {
                      name: 'FBL-FWB', display: 'FBL-FWB(%)', type: 'div', isRequired: false, ctrlCss: { width: '50px' },
                      divElements:
                      [
                      {
                          // divRowNo: 1, name: 'CarrierCode', type: 'label'
                          divRowNo: 1, name: "FblFwbGrWt", type: "text", ctrlAttr: { maxlength: 5, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: false

                      },

                      {
                          divRowNo: 1, name: "FblFwbVolWt", type: "text", ctrlAttr: { maxlength: 5, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: false
                      }
                      ]
                  },

                 {
                     name: 'FWB-FOH', display: 'FWB-FOH(%)', type: 'div', isRequired: false, ctrlCss: { width: '50px' },
                     divElements:
                        [
                        {
                            // divRowNo: 1, name: 'CarrierCode', type: 'label'
                            divRowNo: 1, name: "FwbFohGrWt", type: "text", ctrlAttr: { maxlength: 5, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: false

                        },

                        {
                            divRowNo: 1, name: "FwbFohVolWt", type: "text", ctrlAttr: { maxlength: 5, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: false
                        }
                        ]
                 },
                 {
                     name: 'FBL-FOH', display: 'FBL-FOH(%)', type: 'div', isRequired: false, ctrlCss: { width: '50px' },
                     divElements:
                        [
                        {
                            // divRowNo: 1, name: 'CarrierCode', type: 'label'
                            divRowNo: 1, name: "FblFohGrWt", type: "text", ctrlAttr: { maxlength: 5, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: false

                        },

                        {
                            divRowNo: 1, name: "FblFohVolWt", type: "text", ctrlAttr: { maxlength: 5, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: false
                        }
                        ]
                 }
            ],
            hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: true },
            isPaging: true
        });
    }
}

//function AcceptanceVarianceGrid() {
//    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//        ShowMessage('info', 'Need your Kind Attention!', "Acceptance Variance can be added in Edit/Update mode only.");
//        return;
//    }

//    var AcceptanceVariance = "AcceptanceVariance";
//    $('#tbl' + AcceptanceVariance).appendGrid({
//        tableID: 'tbl' + AcceptanceVariance,
//        contentEditable: pageType == 'EDIT',
//        tableColume: 'SNo,FBLFWBGrWt,FBLFWBVolwt,FWBFOHGrWt,FWBFOHVolWt,FBLFOHGtWt,FWBFOHVolWt',
//        masterTableSNo: $('#hdnofficSNo').val(),
//        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: '',
//        servicePath: './Services/Master/OfficeService.svc',
//        getRecordServiceMethod: 'GetAcceptanceVarianceRecord',
//        createUpdateServiceMethod: 'CreateUpdate' + AcceptanceVariance,
//        deleteServiceMethod: 'DeleteAcceptanceVariance',
//        caption: 'Airline Office',
//        isGetRecord: true,
//        initRows: 1,

//        columns: [
//                 { name: 'SNo', type: 'hidden', value: 0 },
//                 { name: 'AirlineSNo', type: 'hidden', value: $('#hdnAirlineSNo').val() },
//                 { name: 'OfficeSNo', type: 'hidden', value: $("#hdnofficSNo").val() },
//                 { name: 'OfficeAirlineTransSNo', type: 'hidden', value: $("#hdnOfficeAirlineTransSNo").val() },
//                 {
//                     name: 'AirlineCode', display: 'Airline', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '40px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'Airline', textColumn: 'AirlineCode', keyColumn: 'SNo', filterCriteria: "contains"
//                 },

//                  {
//                      name: 'FBL-FWB', display: 'FBL-FWB(%)', type: 'div', isRequired: true, ctrlCss: { width: '50px' },
//                      divElements:
//                      [
//                      {
//                          // divRowNo: 1, name: 'CarrierCode', type: 'label'
//                          divRowNo: 1, name: "FblFwbGrWt", type: "text", ctrlAttr: { maxlength: 100, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: true

//                      },

//                      {
//                          divRowNo: 1, name: "FblFwbVolWt", type: "text", ctrlAttr: { maxlength: 100, controltype: "decimal2",onblur:"return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: true
//                      }
//                      ]
//                  },

//                 {
//                     name: 'FWB-FOH', display: 'FWB-FOH(%)', type: 'div', isRequired: true, ctrlCss: { width: '50px' },
//                     divElements:
//                        [
//                        {
//                            // divRowNo: 1, name: 'CarrierCode', type: 'label'
//                            divRowNo: 1, name: "FwbFohGrWt", type: "text", ctrlAttr: { maxlength: 100, controltype: "decimal2",onblur:"return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: true

//                        },

//                        {
//                            divRowNo: 1, name: "FwbFohVolWt", type: "text", ctrlAttr: { maxlength: 100, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: true
//                        }
//                        ]

//                 },

//                 {
//                     name: 'FBL-FOH', display: 'FBL-FOH(%)', type: 'div', isRequired: true, ctrlCss: { width: '50px' },
//                     divElements:
//                        [
//                        {
//                            // divRowNo: 1, name: 'CarrierCode', type: 'label'
//                            divRowNo: 1, name: "FblFohGrWt", type: "text", ctrlAttr: { maxlength: 100, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: true

//                        },

//                        {
//                            divRowNo: 1, name: "FblFohVolWt", type: "text", ctrlAttr: { maxlength: 100, controltype: "decimal2", onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: "70px" }, isRequired: true
//                        }
//                        ]

//                 }
//        ],

//        //hideButtons: { updateAll: false, append: false, insert: true, remove: false, removeLast: false },
//        isPaging: true,

//    });

//    //function delRow(obj) {
//    //    var current = window.event.srcElement;
//    //    //here we will delete the line
//    //    while ((current = current.parentElement) && current.tagName != "TR");
//    //    current.parentElement.removeChild(current);
//    //    tblAcceptanceVariance_Delete_
//    //}

//}
// Added By Arman Ali
//================================================Date : 21-03-2017=============================================
function validate(obj) {
    if ($("#" + obj).val().length < 6) {
        ShowMessage('info', 'Need your Kind Attention!', "Minimum Six Digits are Required.", "bottom-left");
        $("#" + obj).val('0');
        //    $("#" + obj).focus();
    }
}
//================================= End here===================================================================

function RemoveCity(obj) {
    var id = obj.context.id.match(/\d+/g).map(Number);
    $("#tblContactInformation_CityName_" + id[0] + "").val("");
    var sno = $("#tblContactInformation_HdnCountryName_" + id).val();
    GetIsdCode(sno, id);
    // alert(sno);
}

function CheckAndClearText(obj) {
    if ($(obj).val() > 100) {
        ShowMessage('info', 'Need your Kind Attention!', "You are not allow to enter more than 100.", "bottom-left");
        $(obj).val('0');
        $(obj).focus();
    }
    //$("#" + $("#" + obj).id).focus(function () {
    if ($("#" + obj.id).val() < 1)
        $("#" + obj.id).val("");
    //});
}


function CityCodeChange() {
    try {
        $.ajax({
            type: "GET",
            url: "./Services/Master/OfficeService.svc/GetAirportInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CitySNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#AirportSNo').val(FinalData[0].SNo);
                    $('#Text_AirportSNo').val(FinalData[0].AirportName);
                }
            }
        });
        CurrencyChange();
        $('#Text_ParentID').data("kendoAutoComplete").value(''); //Added by devendra 2may2019
        $('#Text_ParentID').data("kendoAutoComplete").key(''); //Added by devendra 2may2019
    }
    catch (exp) { }

}
function CurrencyChange() {
    try {
        $.ajax({
            type: "GET",
            url: "./Services/Master/OfficeService.svc/GetCurrencyInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CitySNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#CurrencySNo').val(FinalData[0].SNo);
                    $('#Text_CurrencySNo').val(FinalData[0].CurrencyName);
                }
            }
        });

    }
    catch (exp) { }

}
function getAssociatedAirlineCount(callback) {
    var count;

    $.ajax({
        type: "GET",
        url: "./Services/Master/OfficeService.svc/GetAssociatedAirlineCount",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ masterTableSNo: $("#hdnofficSNo").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var ResultData = jQuery.parseJSON(response);
            //var FinalData = ResultData.Table0;

            //data = FinalData.length
            count = ResultData.Table0[0]["Column1"];
            callback(count);

        }

    });


}

/* Author : shahbaz akhtar 
   Modification Date  : 10/01/2017
   Description : 
   1 To get isd code on he basis of selected country      
   
 */
$("#tblContactInformation_btnAppendRow").live("click", function () {

    var lastRow = $("table tr[id^='tblContactInformation_Row_']").last().attr("id").split('_')[2];

    CountryCity(lastRow);

});

//function ChangeCurrency()
//{
//    alert("ssd");
//}

function checkForLength(obj) {
    // alert(obj);
    var msg = ""
    if (obj.split('_')[1].toUpperCase() == 'MOBILENO')
        msg = "Mobile No."
    else
        msg = "Phone No."
    var length = $("#" + obj).val().length;
    //alert(length);
    if (length < 6) {
        ShowMessage('info', 'Need your Kind Attention!', "Kindly enter " + msg + " greater than six digit.", "bottom-left");
        $('#' + obj).val('0');
        // $('#' + obj).focus();
    }

}

function CountryCity(id) {
    try {
        // alert("dgdfgd");

        $.ajax({
            type: "GET",
            url: "./Services/Master/OfficeService.svc/GetCurrencyInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CitySNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {

                    var values = FinalData[0].CountrySNo;
                    var citysno = $('#CitySNo').val();
                    var citytext = $('#Text_CitySNo').val();
                    //      alert(values);
                    $('#tblContactInformation_HdnCountryName_' + id).val(FinalData[0].CountrySNo);
                    $('#tblContactInformation_CountryName_' + id).val(FinalData[0].CountryName);
                    $('#tblContactInformation_HdnCityName_' + id).val(citysno);
                    $('#tblContactInformation_CityName_' + id).val(citytext);
                    GetIsdCode(values, id);
                    $('#tblContactInformation_CountryName_' + id).attr('disabled', true);
                    $('#tblContactInformation_CityName_' + id).attr('disabled', true);
                }
            }
        });
        // CurrencyChange();
    }
    catch (exp) { }

}

function GetIsdCode(id, controlid) {
    try {
        $.ajax({
            type: "GET",
            url: "./Services/Master/OfficeService.svc/GetIsdCode",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ masterTableSNo: id }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                //  alert("dsds");
                if (FinalData.length > 0) {
                    //  $('#AirportSNo').val(FinalData[0].SNo);

                    //     $('#_temptblContactInformation_MobileNo_' + controlid).val(FinalData[0].ISD);
                    var gr = FinalData[0].ISD;
                    //      alert(gr);
                    $('#_isdcode_' + controlid).remove();
                    //   $('#tblContactInformation_MobileNo_' + controlid).before('<span  id="_isdcode_' + controlid + '">' + gr + '-' + '</span>&nbsp;');
                    $('#_temptblContactInformation_MobileNo_' + controlid).before('<span  id="_isdcode_' + controlid + '">' + gr + '-' + '</span>&nbsp;');
                    //   $('#_tempisd_' + controlid).val(gr);
                }
            }
        });
    }
    catch (exp) { }

}


function Checkstart(obj) {
    // tblOfficeAirlineTrans_ValidFrom_1
    //---------by arman
    var today = new Date()
    var dateset = $("#" + obj).data("kendoDatePicker");
    dateset.min(today);
    if (obj.split('_')[1] == "ValidFrom") {
        var cntrlId = 'tblOfficeAirlineTrans_ValidTo_' + obj.split('_')[2];
        var lastValue = $("#" + cntrlId).val();
        $("#" + cntrlId).val('');
        var end = $("#" + cntrlId).data("kendoDatePicker");
        end.min($('#' + obj).val());
        if (new Date(Date.parse($('#' + obj).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) <= new Date(Date.parse(lastValue.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')))) {
            $("#" + cntrlId).val(lastValue);
        }
    }
    //---------end
    var k = $('#' + obj).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    var validFrom = $('#' + obj).attr("id").replace("From", "To");
    // alert(validFrom);
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    if (dfrom > dto) {
        $('#' + obj).val("");
        alert('Valid From date can not be greater than Valid To date.');
    }
    //   setdatevalue();
}
function CheckEnd(obj) {

    var k = $('#' + obj).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    var validFrom = $('#' + obj).attr("id").replace("To", "From");
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    if (dfrom > dto) {
        $('#' + obj).val("");
        alert('Valid From date can not be greater than Valid To date.');
    }
    //    setdatevalue();
}
//=====Added by arman for alertcreditlimit Date : 18-05-2017=============
$('#AlertClPercentage').blur(function () {

    alertCreditLimit();

});
$('#AlertClPerCentage').blur(function () {

    alertCreditLimit();

});


function alertCreditLimit() {
    var Creditlimt = $("#CreditLimit").val();
    var MinCreditlimt = $("#MinimumCL").val();
    var AlertCreditlimt = ""
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
        AlertCreditlimt = $('#AlertClPercentage').val();
    else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
        AlertCreditlimt = $('#AlertClPerCentage').val();
    var check = "";
    if (AlertCreditlimt != "") {
        if ((Creditlimt != "") && (MinCreditlimt != "")) {
            check = (MinCreditlimt / Creditlimt) * 100;
            if (parseFloat(AlertCreditlimt) < parseFloat(check)) {
                ShowMessage('warning', 'Warning - Office!', "Alert Credit Limit Cannot Be less than " + parseInt(check) + "%");
                if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
                    $('#AlertClPercentage').val('');
                else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
                    $('#AlertClPerCentage').val('');
                return false;

            }

        }
        //else {
        //    ShowMessage('warning', 'Warning - Office!', "select Credit limit & Min Credit limit first ");
        //}
    }
}
// added by arman ali Date : 2017-10-04
function setdatevalue() {
    var date = new Date();
    $('[id^="tblOfficeAirlineTrans_ValidTo_"]').each(function () {
        var rowno = $(this).attr('id').split('_')[2]
        var minm = $("#" + $(this).attr('id')).val()
        var validfrom = $("#tblOfficeAirlineTrans_ValidFrom_" + rowno).val() == "" ? date : $("#tblOfficeAirlineTrans_ValidFrom_" + rowno).val()
        var validto = $("#tblOfficeAirlineTrans_ValidFrom_" + rowno).data("kendoDatePicker");
        validto.min(date);
        var abc = $("#" + $(this).attr('id')).data("kendoDatePicker");
        abc.min(validfrom);

    });
}
//=========end here=======================================================

//$("#ERPCode").keydown(function (e) {
//      if ($("#ERPCode").val().length >= 8) {
//          e.preventDefault();
//      }
//  });

$('#ERPCode').keyup(function () {
    var val = this.value.replace(/\D/g, '');
    this.value = val ? ('AR-' + val).substr(0, 8) : val;
});

function ShowEmail(obj) {
    if ($(obj).is(':checked') == true) {
        $("#Email").attr('data-valid', 'required');
        $("#Email").closest('td').prev().find('font').html('*');
        $("#Email").show();
        $("#Email").val('');
        $("#_tempEmail").val('');
        $("#Email").closest('td').prev().find('span').show();
        $("#Email").closest('td').find('span').show();
        $("#EmailLabel").show();
        $("#Email").focus();
    }
    else {
        $("#Email").removeAttr('data-valid');
        $("#Email").closest('td').prev().find('font').html('');
        $("#Email").hide();
        $("#Email").closest('td').find('span').hide();
        $("#Email").closest('td').prev().find('span').hide();
        $("#EmailLabel").hide();
        $("#Email").val('');
        $("#eEmail").val('');
        $('#divemailAdd ul').find('li span[id]').click();
    }
}

function ShowEmailID(obj) {
    if ($(obj).is(':checked') == true) {
        $("#EmailID").attr('data-valid', 'required');
        $("#EmailID").show();
        $("#EmailID").val('');
        $("#_tempEmail").val('');
        //$("#EmailID").closest('td').prev().find('span').show();
        //$("#EmailID").closest('td').find('span').show();
        $("#EmailID").closest('td').prev().html('CSR Email');
        $("#EmailIDLabel").show();
        $("#EmailID").focus();
        $("#EmailID").show();
    }
    else {
        $("#EmailID").removeAttr('data-valid');
        $("#EmailID").hide();
        $("#EmailID").closest('td').prev().html('');
        $("#EmailIDLabel").hide();
        $("#EmailID").val('');
        $("#eEmail").val('');
        $('#divemailidAdd ul').find('li span[id]').click();
        $("#EmailID").hide();
    }
}
function ShowMobile(obj) {

    if ($(obj).is(':checked') == true) {
        $("#_tempMobile").hide();
        $("#Mobile").show();
        $("#Mobile").closest('td').prev().find('span').show();
        $("#Mobile").attr('data-valid', 'required');
        $("#_tempMobile").attr('data-valid', 'required');
        $("#Mobile").closest('td').prev().find('font').html('*');
        $("#Mobile").val('');
        $("#_tempMobile").val('');
        $("#Mobile").focus();
    }
    else {
        $("#Mobile").removeAttr('data-valid');
        $("#_tempMobile").removeAttr('data-valid');
        $("#Mobile").closest('td').prev().find('font').html('');
        $("#_tempMobile").hide();
        $("#Mobile").hide();
        $("#Mobile").closest('td').prev().find('span').hide();
        $("#Mobile").val('');
        $("#CrMobile").val('');
    }
}

function checkForLength(obj) {
    // alert(obj);
    var length = $("#" + obj).val().length;
    //alert(length);
    if (length < 6) {
        ShowMessage('info', 'Need your Kind Attention!', "You are not allow to enter Mobile number less than 6 .", "bottom-left");
        $('#' + obj).val('0');
        // $('#' + obj).focus();
    }

}

function checkForEmail(currObject) {
    var emailaddress = $("#" + currObject).val();
    var emailexp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if
    (!emailexp.test(emailaddress)) {
        alert('Please enter valid email address.');
        $("#" + currObject).val('');
        $("#_temp" + currObject).val('');
        //  $("#" + currObject).focus();
        return false;

    }
}
function SetEMailIDNew() {
    // var arm = $("#Email").val().toUpperCase()
    $("#EmailID").keyup(function (e) {
        var addlen = $("#EmailID").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    if ($("ul#addlist3 li").length < 5) {
                        //--------added by arman For Duplicate Email---------------
                        var abc = $("#addlist2 li span").text().split(' ')
                        if (abc.includes(addlen)) {
                            ShowMessage('warning', 'Warning - Account', "Email Already Entered");
                            $("#EmailID").val('');
                        }
                            //---------------end
                        else {
                            var listlen = $("ul#addlist3 li").length;
                            $("ul#addlist3").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                        }
                    }
                    else {
                        ShowMessage('warning', 'Warning - Account', "Maximum 5 E-mail Addresses allowed.");
                    }
                    $("#EmailID").val('');
                    $("#EmailID").removeAttr('data-valid');
                }
                else {
                    ShowMessage('warning', 'Warning - Account', "Please enter valid Email Address.");
                    $("#EmailID").val('');
                }
            }
        }
        else
            e.preventDefault();
    });
    $("#EmailID").blur(function () {
        $("#EmailAddress").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();

        if ($("ul#addlist3 li").length == 0 && $("#Message").is(':checked') == true) {
            $("#EmailID").attr('data-valid', 'required');
        }
        else {
            $("#EmailID").removeAttr('data-valid');
        }
    });
}
function SetEMailNew() {
    // var arm = $("#Email").val().toUpperCase()
    $("#Email").keyup(function (e) {
        var addlen = $("#Email").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    if ($("ul#addlist2 li").length < 5) {
                        //-------added by arman For Duplicate Email --------------
                        var abc = $("#addlist2 li span").text().split(' ')
                        if (abc.includes(addlen)) {
                            ShowMessage('warning', 'Warning - Account', "Email Already Entered");
                            $("#Email").val('');
                        }
                            //---------------end
                        else {
                            var listlen = $("ul#addlist2 li").length;
                            $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                        }
                    }
                    else {
                        ShowMessage('warning', 'Warning - Account', "Maximum 5 E-mail Addresses allowed.");
                    }
                    $("#Email").val('');
                    $("#Email").removeAttr('data-valid');
                }
                else {
                    ShowMessage('warning', 'Warning - Account', "Please enter valid Email Address.");
                    $("#Email").val('');
                }
            }
        }
        else
            e.preventDefault();
    });
    $("#Email").blur(function () {
        $("#EmailAddress").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();

        if ($("ul#addlist2 li").length == 0 && $("#Message").is(':checked') == true) {
            $("#Email").attr('data-valid', 'required');
        }
        else {
            $("#Email").removeAttr('data-valid');
        }
    });
}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}

function OfficeTypechange() {
    $("#SMS").attr('checked', false);
    ShowMobile("#SMS");

    $("#Message").attr('checked', false);
    ShowEmail("#Message");

    $("#MessageCSR").attr('checked', false);
    ShowEmailID("#MessageCSR");
    if ($('#Text_OfficeType').val() == "GSA" || $('#Text_OfficeType').val() == "CSA") {
        $("#SMS").attr('disabled', false);
        $("#Message").attr('disabled', false);
    }
    else {
        $("#SMS").attr('disabled', true);
        $("#Message").attr('disabled', true);
    }
};


function ExtraParameters(id) {
    var param = [];
    if (id.indexOf("tblOfficeAirlineTrans_AirlineCode") >= 0) {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}