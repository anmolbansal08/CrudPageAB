/// <reference path="D:\CFProjects\Cargoflash.Garuda\Cargoflash.Garuda.Reservation\GADev\CargoFlashCargoWebApps\Scripts/references.js" />
$(document).ready(function () {

    if (userContext.SysSetting.RecipientMsgConfigExcel.toUpperCase() == "TRUE" && getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW") {
        $(".WebFormTable tbody tr:eq(1) td").append('<span align="right"><input type="button" id="GenExcelBtn" value="Generate Excel" onclick="tablebind(this)" class="btn btn-info" style="  float: right; "></span>');
    }
    cfi.AutoCompleteV2("AirlineName", "CarrierCode,AirlineName", "EDI_EventCongig_Airline", null, "contains");

    cfi.AutoCompleteV2("MessageType", "MessageType", "EDI_RecipientConfig_Messagetype", MessageTypeOnSelect, "contains", null, null, null, null, null);
    cfi.AutoCompleteV2("MessageVersion", "MessageVersion", "EDI_RecipientConfig_MessageVersion", null, "contains");
    cfi.AutoCompleteV2("AirportName", "AirportName", "EDI_RecipientConfig_AirportName", null, "contains");
    // cfi.AutoCompleteV2("TriggerEvent", "TriggerEvent", "EDI_RecipientConfig_Subprocess", null, "contains");
    cfi.AutoCompleteV2("DestinationCity", "AirportName", "EDI_RecipientConfig_DestinationCity", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "Flightno", "EDI_RecipientConfig_Flightno", null, "contains", ",", null, null, null, null, true);
    cfi.BindMultiValue("FlightNo", $("#Text_FlightNo").val(), $("#FlightNo").val());
    var SearchDataSource = [{ Key: "E", Text: "Outbound" }, { Key: "I", Text: "Inbound" }];//, { Key: "Transit", Text: "Transit" } , { Key: "B", Text: "Both" }
    cfi.AutoCompleteByDataSource("MessageMovementType", SearchDataSource);
    var SearchDataSource = [{ Key: "STD", Text: "STD" }, { Key: "ATA", Text: "ATA" }];
    cfi.AutoCompleteByDataSource("Basis", SearchDataSource);

    SearchDataSource = [{ Key: "0", Text: "Manual" }, { Key: "1", Text: "Auto" }];
    cfi.AutoCompleteByDataSource("ExecutionType", SearchDataSource);
    cfi.AutoCompleteV2($(this).attr("name"), "TriggerEvent", "EDI_RecipientConfig_Subprocess", null, "contains");

    MakeTrans();
    /*
    cfi.makeTrans("EDI_RecipientMsgConfigTrans", null, null, beforeAddEventCallback, null, null, null);
    $("div[id='divareaTrans_EDI_RecipientMsgConfigTrans']").find("tr[id^='areaTrans_EDI_RecipientMsgConfigTrans']").each(function () {
        $(this).find("input[id^='TriggerEvent']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "TriggerEvent", "EDI_RecipientConfig_Subprocess", null, "contains");
        });
    });
    */
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //if (userContext.SysSetting.ICMSEnvironment == 'GA') {
        //    $('#AirlineName').val('1');
        //    $('#Text_AirlineName').val('GA-GARUDA AIRLINE');
        //}
        //else if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        //    $('#AirlineName').val('1');
        //    $('#Text_AirlineName').val('JT-LION AIR');
        //}
        // commented code as told by khan sir on 7May2019 for G9 Prd hotfix 
        var AsNo = userContext.AirlineSNo || "";
        var AName = userContext.AirlineCarrierCode || "";
        $('#AirlineName').val(AsNo);
        $('#Text_AirlineName').val(AName);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        //$("#AirportName").val(userContext.AirportSNo);
        //$("#Text_AirportName").val(userContext.AirportCode + '-' + userContext.AirportName);
        //$("#DestinationCity").val(userContext.CitySNo);
        //$("#Text_DestinationCity").val(userContext.CityCode + '-' + userContext.CityName);

        //  $("#DestinationCity").val(userContext.AirportSNo);
        // $("#Text_DestinationCity").val(userContext.AirportCode + '-' + userContext.AirportName);


        /*********Get Country*********************/
        /* $.ajax({
             url: "Services/EDI/RecipientMsgConfigService.svc/GetCountry", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
             data: JSON.stringify({ CitySNo: userContext.CitySNo }),
             success: function (result) {
                 if (result != "") {
                     //$('#Text_DestinationCountry').data("kendoAutoComplete").key(result.split('__')[0]);
                     //$('#Text_DestinationCountry').data("kendoAutoComplete").value(result.split('__')[1]);
                     $('#Text_DestinationCountry').data("kendoAutoComplete").enable(true);
 
                     // om commented
                   //  $('#Text_DestinationCity').data("kendoAutoComplete").enable(true);
 
 
                 }
 
             }
 
         });*/
        /*****************************************/
    }
    enabeldisabletranscontrol();

    validateEditReceipient();

    if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT")||getQueryStringValue("FormAction").toUpperCase() =="DUPLICATE") {
        $("input[name='RecipientType']").attr('disabled', true);
        $("#Text_MessageType").data("kendoAutoComplete").enable(false);

        $("#Text_MessageMovementType").data("kendoAutoComplete").enable(false);

    }
    else if ((getQueryStringValue("FormAction").toUpperCase() == "READ")) {
        $("input[name='RecipientType']").attr('disabled', true);
        $("input[name^='Mode']").attr('disabled', true);
        $("input[name='IsActive']").attr('disabled', true);
        $("input[name='IsDoubleSignature']").attr('disabled', true);
    }
    else if ((getQueryStringValue("FormAction").toUpperCase() == "NEW")) {
        $("input[name='IsDoubleSignature']:eq(1)").attr("checked", true);
    }
    //ValidateRecipientType();
    if (userContext.SysSetting.RecipientMsgConfigExcel.toUpperCase() == "TRUE" && (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ"))
    {
        $("input[type='button'][value='Back']").before("<input type='button' class='btn btn-success' style='width:92px;'onclick='tablebind(this)' value='Generate Excel' name='GenExcel' id='GenExcel' />");
        $("#GenExcel").css("background-color", " #008CBA");
    }

    var FType = getQueryStringValue("FormAction").toUpperCase();
    if (FType == "EDIT" || FType == "READ" || FType == "DUPLICATE" || FType == "NEW" || FType == "DELETE") {
        $('input[name="operation"]').prop('type', '').prop('type', 'button');
    }
    $('input[name="operation"]').unbind('click').bind('click', function (e) {
        //if (!cfi.IsValidForm()) {
        //    e.preventDefault;
        //    return false;
        //}

        cfi.ValidateForm();
        // cfi.IsValidForm();    
        var res = $("#tblRecipientMsgConfigTrans tr[id^='tblRecipientMsgConfigTrans']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        if (!validateTableData('tblRecipientMsgConfigTrans', res)) {
            return false;
        }
        $("#divRecipientMsgConfigTrans tr[id^=areaTrans_EDI_RecipientMsgConfigTrans]").each(function (i, e) {
            var hasData = false;
            $(e).find("input[type=text]").each(function (index, ele) {
                if ($(ele).val() != "") {
                    hasData = true;
                    return true;
                }
            });
            if (!hasData) {
                $(e).find("input[id^='UserID']").removeAttr("data-valid");
                $(e).find("input[id^='Password']").removeAttr("data-valid");
                $(e).find("input[id^='ReceivingID']").removeAttr("data-valid");

                $(e).find("input[id^='UserID']").removeAttr("data-valid-msg");
                $(e).find("input[id^='Password']").removeAttr("data-valid-msg");
                $(e).find("input[id^='ReceivingID']").removeAttr("data-valid-msg");

                $(e).find("input[id^='UserID']").removeClass("valid_invalid");
                $(e).find("input[id^='Password']").removeClass("valid_invalid");
                $(e).find("input[id^='ReceivingID']").removeClass("valid_invalid");

                $(e).find("input[id^='UserID']").closest("td").find(".bVErrMsgContainer").replaceWith("<div></div>");
                $(e).find("input[id^='Password']").closest("td").find(".bVErrMsgContainer").replaceWith("<div></div>");
                $(e).find("input[id^='ReceivingID']").closest("td").find(".bVErrMsgContainer").replaceWith("<div></div>");
            }
        });
        if (cfi.IsValidSubmitSection()) {
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
                return SaveRecipientMsgConfigTrans();
            }
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                return UpdateRecipientMsgConfigTrans();
            }

        }
    });

});

$('input:radio[name=RecipientType]').change(function () {
    ValidateRecipientType();
});

function ValidateRecipientType() {
    if ($("input[name='RecipientType']:checked").val() == 0) {
        //cfi.ResetAutoComplete("AirlineName");
        //var dataSource = new kendo.data.DataSource({
        //    data: []
        //});
        //var autocomplete = $("#Text_AirlineName").data("kendoAutoComplete");
        //autocomplete.setDataSource(dataSource);
        ////cfi.AutoComplete("AirlineName", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");
        //cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
        //$('#spnAirlineName').text('Airline Name:');

        cfi.ResetAutoComplete("AirlineName");
        var dataSource = GetDataSourceV2("AirlineName", "EDI_EventCongig_Airline");
        cfi.ChangeAutoCompleteDataSource("AirlineName", dataSource, false, null, "CarrierCode,AirlineName", "contains");
        //cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
        $('#spnAirlineName').text('Airline Name:');


    }
    else if ($("input[name='RecipientType']:checked").val() == 1) {
        //cfi.ResetAutoComplete("AirlineName");
        //var dataSource = new kendo.data.DataSource({
        //    data: []
        //});
        //var autocomplete = $("#Text_AirlineName").data("kendoAutoComplete");
        //if (autocomplete != undefined)
        //    autocomplete.setDataSource(dataSource);
        //cfi.AutoComplete("AirlineName", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
        //$('#spnAirlineName').text('Office Name:');

        cfi.ResetAutoComplete("AirlineName");
        var dataSource = GetDataSourceV2("AirlineName", "EDI_RecipientConfig_Office")
        cfi.ChangeAutoCompleteDataSource("AirlineName", dataSource, false, null, "Name");
        $('#spnAirlineName').text('Office Name:');

    }
    else if ($("input[name='RecipientType']:checked").val() == 2) {
        //cfi.ResetAutoComplete("AirlineName");
        //var dataSource = new kendo.data.DataSource({
        //    data: []
        //});
        //var autocomplete = $("#Text_AirlineName").data("kendoAutoComplete");
        //autocomplete.setDataSource(dataSource);
        //cfi.AutoComplete("AirlineName", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
        //$('#spnAirlineName').text('Agent Name:');

        cfi.ResetAutoComplete("AirlineName");
        var dataSource = GetDataSourceV2("AirlineName", "EDI_RecipientConfig_Account")
        cfi.ChangeAutoCompleteDataSource("AirlineName", dataSource, false, null, "Name");
        $('#spnAirlineName').text('Agent Name:');

    }
}

function hide() {
    $('table#tbl tr:nth-child(5) td:nth-child(3) font').hide();
    $('#spnAirportDestination').hide();
    $('table#tbl tr:nth-child(5) td:nth-child(4) span').hide();
    $("input[id=Text_AirportDestination]").attr("disabled", 1);
}

function show() {
    $('table#tbl tr:nth-child(5) td:nth-child(3) font').show();
    $('#spnAirportDestination').show();
    $('table#tbl tr:nth-child(5) td:nth-child(4) span').show();
    $("input[id=Text_AirportDestination]").removeAttr("disabled");
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_MessageVersion") {
        try {
            cfi.setFilter(filter, "MessageTypeMasterSNo", "neq", 0);
            cfi.setFilter(filter, "MessageTypeMasterSNo", "eq", $("#Text_MessageType").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }




    else if (textId == "Text_MessageType") {
        try {

            if ($('#Text_MessageMovementType').val().toUpperCase() == "OUTBOUND") {
                cfi.setFilter(filter, "MessageType", "neq", "ALL");

            }


            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }



    //var filterAirline = cfi.getFilter("AND");
    //if (textId == "Text_AirportName") {
    //    try {
    //        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_DestinationCity").data("kendoAutoComplete").key())
    //        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //        return OriginCityAutoCompleteFilter2;
    //    }
    //    catch (exp)
    //    { }
    //}


    //var filterAirline = cfi.getFilter("AND");
    //if (textId == "Text_DestinationCity") {
    //    try {
    //        cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_DestinationCountry").data("kendoAutoComplete").key())
    //        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
    //        return OriginCityAutoCompleteFilter2;
    //    }
    //    catch (exp)
    //    { }
    //}



}

function enabeldisabletranscontrol() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        BindRadioEvent();
    }
}

function validateEditReceipient() {

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        //if ($("input[name='RecipientType'][value='0']").prop("checked")) {
        //    $('#spnAirlineName').text('Airline Name:');
        //    cfi.AutoComplete("AirlineName", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");
        //}
        //else if ($("input[name='RecipientType'][value='1']").prop("checked")) {
        //    $('#spnAirlineName').text('Office Name:');
        //    cfi.AutoComplete("AirlineName", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
        //}
        //else if ($("input[name='RecipientType'][value='2']").prop("checked")) {
        //    $('#spnAirlineName').text('Agent Name:');
        //    cfi.AutoComplete("AirlineName", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
        //}



        $("tr[id^=areaTrans_EDI]").each(function () {
            var id = $(this).find("input:radio[type^=radio]").attr("id");
            var $td = $(this);
            if ($("input[name^='" + id + "'][value='1']").prop("checked") || $("input[name^='" + id + "'][value='2']").prop("checked")) {
                $td.find("input[id^='UserID']").attr("disabled", 1).hide();
                $td.find("input[id^='Password']").attr("disabled", 1).hide();
            }
            else {
                $td.find("input[id^='UserID']").removeAttr("disabled").show();
                $td.find("input[id^='Password']").removeAttr("disabled").show();
            }
        });
        BindRadioEvent();



    }

}

function BindRadioEvent() {
    $('#divareaTrans_EDI_RecipientMsgConfigTrans input:radio[type^=radio]').live("click", function () {
        var id = $(this).attr("id");
        var $td = $(this).closest("tr");
        if ($("input[name='" + id + "']:checked").val() == 1 || $("input[name='" + id + "']:checked").val() == 2) {

            $td.find("input[id^='UserID']").attr("disabled", 1).hide();
            $td.find("input[id^='Password']").attr("disabled", 1).hide();
            $td.find("input[id*='Password']").removeAttr("data-valid");
            $td.find("input[id*='Password']").removeAttr("data-valid-msg");
            $td.find("input[id*='Password']").removeAttr("required");
            $td.find("input[id*='UserID']").removeAttr("data-valid");
            $td.find("input[id*='UserID']").removeAttr("data-valid-msg");
            $td.find("input[id*='UserID']").removeAttr("required");
            if ($("input[name='" + id + "']:checked").val() == 1) {
                $td.find("input[id^='ReceivingID']").val("");
                $td.find("input[id^='ReceivingID']").attr("data-valid", "maxlength[7],minlength[7],required");
                $td.find("input[id^='ReceivingID']").attr("data-valid-msg", "SITA ID Must be 7 Character.");
                $td.find("input[id^='ReceivingID']").attr("maxlength", "7");
                $td.find("input[id^='ReceivingID']").css("text-transform", "uppercase");
                $td.find("input[id^='ReceivingID']").attr("placeholder", "AAABBCC");
            }
            if ($("input[name='" + id + "']:checked").val() == 2) {
                $td.find("input[id^='ReceivingID']").val("");
                $td.find("input[id^='ReceivingID']").attr("data-valid", "email,required");
                $td.find("input[id^='ReceivingID']").attr("data-valid-msg", "Enter Valid Email Address.");
                $td.find("input[id^='ReceivingID']").attr("maxlength", "200");
                $td.find("input[id^='ReceivingID']").css("text-transform", "lowercase");
                $td.find("input[id^='ReceivingID']").attr("placeholder", "myname@example.net");
            }
        }
        else {
            $td.find("input[id^='ReceivingID']").val("");
            $td.find("input[id^='UserID']").removeAttr("disabled").show();
            $td.find("input[id^='Password']").removeAttr("disabled").show();
            $td.find("input[id^='ReceivingID']").attr("data-valid", "required");
            $td.find("input[id^='ReceivingID']").attr("data-valid-msg", "Receiving ID is Required.");
            $td.find("input[id^='ReceivingID']").attr("maxlength", "200");
            $td.find("input[id^='ReceivingID']").attr("placeholder", "");
        }
    });
}

function SaveRecipientMsgConfigTrans() {


    var returnVal = false;
    var ExecutionType1 = '';
    var RecipientMsgConfigTransInfo = new Array();
    if ($("input[name='RecipientType']:checked").val() == 0) {
        var AlineSno = $('#AirlineName').val()
    }
    else {
        AlineSno = 0;
    }
    if ($("input[name='RecipientType']:checked").val() == 1) {
        var OSNo = $('#AirlineName').val()
    }
    else {
        OSNo = 0;
    }
    if ($("input[name='RecipientType']:checked").val() == 2) {
        var AccSno = $('#AirlineName').val()
    }
    else {
        AccSno = 0;
    }


    if ($("#ExecutionType").val() == 'False') {
        ExecutionType1 = 0;
    }
    else if ($("#ExecutionType").val() == 'True') {

        ExecutionType1 = 1;
    }
    else {
        ExecutionType1 = $("#ExecutionType").val()
    }


    var RecipientMsgConfigInfo = new Array();
    RecipientMsgConfigInfo.push({
        AirlineSNo: AlineSno,
        OfficeSNo: OSNo,
        AccountSNo: AccSno,

        DestinationCountrySNo: $("#DestinationCountry").val() == "" ? 0 : $("#DestinationCountry").val(),
        DestinationCitySNo: $("#DestinationCity").val() == "" ? 0 : $("#DestinationCity").val(),
        MessageTypeMasterSNo: $("#MessageType").val(),
        MessageVersion: $("#MessageVersion").val() == "" ? 0 : $("#MessageVersion").val(),
        AirportSNo: $("#AirportName").val() == "" ? 0 : $("#AirportName").val(),
        Basis: $("#Basis").val(),
        MessageMovementType: $("#MessageMovementType").val(),
        CutOffMins: $("#CutOffMins").val() == "" ? 0 : $("#CutOffMins").val(),
        IsActive: $("input[name=IsActive]:checked").val() == "0" ? true : false,
        IsDoubleSignature: $("input[name=IsDoubleSignature]:checked").val() == "0" ? true : false,
        FlightNo: $("#FlightNo").val(),
        ExecutionType: ExecutionType1,

        //$("#ExecutionType").val(),
    })

    //$('[id*="slabtable_rowOrder"]').each(function () {
    //    var el = $('#slabtable_rowOrder').val().split(',').length;
    //    SlabName = $('#tblSLATrans_SlabName_' + (el)).val();
    //    CutOfmin = $('#tblSLATrans_CutOffMins_' + (el)).val();
    //    if (SlabName == "" || CutOfmin == "") {
    //        ShowMessage('warning', 'Need your Kind Attention!', 'Slab can not be blank !.');
    //        e.preventDefault();
    //        return false;
    //    }

    //});


    $('#divRecipientMsgConfigTrans  table tbody tr[id^="tblRecipientMsgConfigTrans_Row_"]').each(function (row, tr) {
        var Radiotext = "";

        if ($(this).find(":radio:checked").val() == 0) {
            Radiotext = "FTP";
        }
        else if ($(this).find(":radio:checked").val() == 1) {
            Radiotext = "SITA";
        }
        else if ($(this).find(":radio:checked").val() == 2) {
            Radiotext = "Email";
        }

        RecipientMsgConfigTransInfo.push({
            ReceivingMode: Radiotext,
            //ReceivingID: $(tr).find("td").find('input:text[id^="ReceivingID"]').val(btoa($(tr).find("td").find('input:text[id^="ReceivingID"]').val())),
            ReceivingID: btoa($(tr).find("td").find('input:text[id*="ReceivingID"]').val()),
            ReceivingUserId: $(tr).find("td").find('input:text[id*="ReceivingUserId"]').val(),
            ReceivingPassword: $(tr).find("td").find('input:text[id*="Password"]').val(),
            TriggerEvent:$(tr).find("td").find('input:hidden[id*="TriggerEvent"]').val() == "" ? 0 : $(tr).find("td").find('input:hidden[id*="TriggerEvent"]').val()
        });
    });
    if (!cfi.IsValidSubmitSection("divRecipientMsgConfigTrans")) {
        return false;

    }
    $.ajax({
        url: "Services/EDI/RecipientMsgConfigService.svc/SaveRecipientMsgConfig",
        async: false,
        type: "POST",
        dataType: "json",
        cache: false,
        data: JSON.stringify({ RecipientMsgConfigTransInfo: RecipientMsgConfigTransInfo, RecipientMsgConfigInfo: RecipientMsgConfigInfo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if ($(result).length == 0) {
                ShowMessage('success', 'Success!', "Recipient Message Config Added Successfully");
                dirtyForm.isDirty = false;
                returnVal = true;
                //navigateUrl('Default.cshtml?Module=EDI&Apps=EventMessageTrans&FormAction=INDEXVIEW');
                navigateUrl('Default.cshtml?Module=EDI&Apps=RecipientMsgConfig&FormAction=INDEXVIEW');
            }
            else if ($(result)[0].indexOf("Recipient Message Config Already Exists") != -1) {
                ShowMessage('info', 'Need your Kind Attention!', "Recipient Message Config Already Exists");
                //alert("Message Type already exists");
                returnVal = false;
            }

        },
        error: function (xhr) {

        }
    });
    return returnVal;
}


// Done by tarun
//$("input[name='operation']").click(function () {
//    if (!cfi.IsValidSubmitSection("divareaTrans_EDI_RecipientMsgConfigTrans")) {
//       // ShowMessage('info', 'Error!', 'Error');
//        return;

//    }
//});

function UpdateRecipientMsgConfigTrans() {
    var returnVal = false;
    var RecipientMsgConfigTransInfoUpdate = new Array();
    $('#divRecipientMsgConfigTrans  table tbody tr[id^="tblRecipientMsgConfigTrans_Row_"]').each(function (row, tr) {
        var Radiotext = "";

        if ($(this).find(":radio:checked").val() == 0) {
            Radiotext = "FTP";
        }
        else if ($(this).find(":radio:checked").val() == 1) {
            Radiotext = "SITA";
        }
        else if ($(this).find(":radio:checked").val() == 2) {
            Radiotext = "Email";
        }

        RecipientMsgConfigTransInfoUpdate.push({
            ReceivingMode: Radiotext,
            ReceivingID: btoa($(tr).find("td").find('input:text[id*="ReceivingID"]').val()),
            ReceivingUserId: $(tr).find("td").find('input:text[id*="ReceivingUserId"]').val(),
            ReceivingPassword: $(tr).find("td").find('input:text[id*="Password"]').val(),
            SNo: $(tr).find("td").find('input:hidden[id^="tblRecipientMsgConfigTrans_SNo_"]').val() == "" ? 0 : $(tr).find("td").find('input:hidden[id^="tblRecipientMsgConfigTrans_SNo_"]').val(),
            RecipientMsgConfigSNo: getQueryStringValue("RecID") == "" ? 0 : getQueryStringValue("RecID"),
            TriggerEvent: $(tr).find("td").find('input:hidden[id*="TriggerEvent"]').val() == "" ? 0 : $(tr).find("td").find('input:hidden[id*="TriggerEvent"]').val(),
        });
    });
    var RecipientMsgConfigInfo = new Array();
    RecipientMsgConfigInfo.push({
        SNo: getQueryStringValue("RecID"),
        MessageVersion: $("#MessageVersion").val(),
        Basis: $("#Basis").val(),
        MessageMovementType: $("#MessageMovementType").val(),
        CutOffMins: $("#CutOffMins").val() == "" ? 0 : $("#CutOffMins").val(),
        IsActive: $("input[name=IsActive]:checked").val() == "0" ? true : false,
        IsDoubleSignature: $("input[name=IsDoubleSignature]:checked").val() == "0" ? true : false,
        FlightNo: $("#FlightNo").val()
    });

    $.ajax({
        url: "Services/EDI/RecipientMsgConfigService.svc/UpdateRecipientMsgConfig",
        async: false,
        type: "POST",
        dataType: "json",
        cache: false,
        data: JSON.stringify({ RecipientMsgConfigTransInfoUpdate: RecipientMsgConfigTransInfoUpdate, RecipientMsgConfigInfo: RecipientMsgConfigInfo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if ($(result).length == 0) {
                ShowMessage('success', 'Success!', "Recipient Message Config Updated Successfully");
                dirtyForm.isDirty = false;
                returnVal = true;
                //navigateUrl('Default.cshtml?Module=EDI&Apps=EventMessageTrans&FormAction=INDEXVIEW');
            }
            else if ($(result)[0].indexOf("Recipient Message Config Already Exists") != -1) {
                ShowMessage('info', 'Need your Kind Attention!', "Recipient Message Config Already Exists");
                //alert("Message Type already exists");
                returnVal = false;
            }
            if (returnVal)
                setTimeout(function () { navigateUrl('Default.cshtml?Module=EDI&Apps=RecipientMsgConfig&FormAction=INDEXVIEW'); }, 1000);

        },
        error: function (xhr) {


        }
    });
    return returnVal;
}


//$("div[id='divareaTrans_EDI_RecipientMsgConfigTrans']").find("tr[id^='areaTrans_EDI_RecipientMsgConfigTrans']").each(function () {
//    $(this).find("input[id^='TriggerEvent']").each(function () {
//        cfi.AutoCompleteV2($(this).attr("name"), "TriggerEvent", "EDI_RecipientConfig_Subprocess", null, "contains");
//    });
//});
/*
function beforeAddEventCallback(elem) {
    //$('#divRecipientMsgConfigTrans  table tbody tr[id^="tblRecipientMsgConfigTrans_Row_"]').each(function () {
    //    //$(this).find("input[id^='TriggerEvent']").each(function () {
    //    //    if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete"))
    //    //        cfi.AutoCompleteV2($(this).attr("name"), "TriggerEvent", "EDI_RecipientConfig_Subprocess", null, "contains");
    //    //});
    //});



    var modeType = elem.find("input:radio[name*=Mode]:checked").val();
    var userId = elem.find("input[id*='UserID']");
    var pwd = elem.find("input[id*='Password']");
    var receivingId = elem.find("input[id*='ReceivingID']");

    if (modeType == 2 || modeType == 1) {
        userId.attr("disabled", 1).hide();
        pwd.attr("disabled", 1).hide();

        if (modeType == 1) {
            receivingId.val("");
            receivingId.attr("data-valid", "maxlength[7],minlength[7],required");
            receivingId.attr("data-valid-msg", "SITA ID Must be 7 Character.");
            receivingId.attr("maxlength", "7");
            receivingId.css("text-transform", "uppercase");
            receivingId.attr("placeholder", "AAABBCC");
        }
        if (modeType == 2) {
            receivingId.val("");
            receivingId.attr("data-valid", "email,required");
            receivingId.attr("data-valid-msg", "Enter Valid Email Address.");
            receivingId.attr("maxlength", "200");
            receivingId.css("text-transform", "lowercase");
            receivingId.attr("placeholder", "myname@example.net");
        }
    }
    else {
        userId.removeAttr("disabled").show();
        pwd.removeAttr("disabled").show();

        receivingId.val("");
        receivingId.attr("data-valid", "required");
        receivingId.attr("data-valid-msg", "Receiving ID is Required.");
        receivingId.attr("maxlength", "200");
        receivingId.attr("placeholder", "");
    }
}
*/
function MessageTypeOnSelect() {
    cfi.ResetAutoComplete("MessageVersion");
    if ($("#Text_MessageType").val().toUpperCase() == "ALL") {
        $("#Text_MessageVersion").removeAttr('data-valid');
        $("#Text_MessageVersion").data("kendoAutoComplete").enable(false);
        $('#spnMessageVersion').closest('td').find('font').text('');
    }
    else {
        $("#Text_MessageVersion").attr('data-valid', 'required');
        $("#Text_MessageVersion").data("kendoAutoComplete").enable(true);
        $('#spnMessageVersion').closest('td').find('font').text('*');
    }
}

function OnSelectCountryCodeChange() {
    //try {


    //    $.ajax({
    //        url: "Services/EDI/RecipientMsgConfigService.svc/GetCityInformation", async: false, type: "POST", dataType: "json", cache: false,
    //        data: JSON.stringify({ SNo: $("#DestinationCountry").val() }),
    //        contentType: "application/json; charset=utf-8",
    //        success: function (result) {
    //            var Data = jQuery.parseJSON(result);
    //            var resData = Data.Table0;
    //            if (resData.length > 0) {
    //                $('#DestinationCity').val(resData[0].SNo);
    //                $('#Text_DestinationCity').val(resData[0].CityName);
    //            }
    //        }
    //    });
    //}
    //catch (exp) { }

}


//function CityCodeChange() {
//    try {
//        $.ajax({
//            type: "GET",
//            url: "Services/EDI/RecipientMsgConfigService.svc/GetAirportInformation",
//            async: false, type: "POST", dataType: "json", cache: false,
//            data: JSON.stringify({ SNo: $("#DestinationCity").val() }),
//            contentType: "application/json; charset=utf-8",
//            success: function (response) {
//                var ResultData = jQuery.parseJSON(response);
//                var FinalData = ResultData.Table0;
//                if (FinalData.length > 0) {
//                    $('#AirportName').val(FinalData[0].SNo);
//                    $('#Text_AirportName').val(FinalData[0].AirportName);
//                }
//            }
//        });
//    }
//    catch (exp) { }

//}


function MakeTrans() {
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var REcordID = getQueryStringValue("RecID") == "" ? 0 : getQueryStringValue("RecID");
    var dbtableName = "RecipientMsgConfigTrans";
    $("#tbl" + dbtableName).appendGrid({
        V2: false,
        tableID: "tbl" + dbtableName,
        contentEditable: pageType != 'READ' && pageType != 'DELETE' ? true : false,
        isGetRecord: true,
        masterTableSNo: REcordID,
        currentPage: 1,
        itemsPerPage: 10,
        whereCondition: $('#SearchBtn').length == 0?"":btoa($('#SearchBtn').val()),
        rowUpdateExtraFunction: beforeAddEventCallback,
        dataLoaded: true,
        caption: 'Recipient Message Config',
        sort: "",
        servicePath: "./Services/EDI/RecipientMsgConfigService.svc",
        getRecordServiceMethod: "GetRecipientMsgConfigTransRecord",
        deleteServiceMethod: 'DeleteRecipientMsgConfigTransRecord',
        i18n: { customValidationMessage: "Kindly enter Mandatory Details ..." },
        initRows: 1,
        columns: [{ name: "SNo", type: "hidden", value: 0 },
           
                 { name: (pageType != "EDIT"&&pageType!="DUPLICATE") ? "ModeText" : "Mode", display: "Mode", type: "radiolist", ctrlOptions: { 0: "FTP", 1: "SITA", 2: "Email" }, selectedIndex: 2, isRequired: true },
                 { name: "ReceivingID", display: "Receiving ID", type: "text", ctrlAttr: { maxlength: 50, controltype: "default", onblur: "return Checkvalidity(this.id);", }, ctrlCss: { width: "300px" }, isRequired: true },
                 { name: "ReceivingUserId", display: " User ID", type: "text", ctrlAttr: { maxlength: 50, controltype: "default", onblur: "return Checkvalidity(this.id);", }, ctrlCss: { width: "300px" }, isRequired: true },
                 { name: "ReceivingPassword", display: "Password", type: "text", ctrlAttr: { maxlength: 50, controltype: "default", onkeypress: "", }, ctrlCss: { width: "300px" }, isRequired: true },
                 { name: "TriggerEvent", display: "Trigger Event", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "" }, ctrlCss: { width: "200px" }, AutoCompleteName: "EDI_RecipientConfig_Subprocess", filterField: "TriggerEvent" },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            uniqueindex = $('#tblRecipientMsgConfigTrans').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
            var elem= $('#tblRecipientMsgConfigTrans_Row_' + uniqueindex).closest('tr');
            onAppendGridRowappend(elem)
        },
        hideButtons: { updateAll: true, append: false, insert: true, remove: false, removeLast: false, },
        isPaging: true,
        isExtraPaging: true,
    });
    if (pageType == "EDIT" || pageType == "READ") {
        $('#tblRecipientMsgConfigTrans tr:first').children('td').append('<input type="text" placeholder="Search..." id="SearchBtn" autocomplete="off"><button id="Btn1"><i class="fa fa-search"></i></button>')
        $('#Btn1').after('<button="#" class="btn btn-info btn-lg" style="margin-left: 65px" ;title="Refresh Grid" id="RefreshBtn"; > <span class="glyphicon glyphicon-refresh"></span> Refresh </button>')
        $('#SearchBtn').css('margin-left', '106px').css('text-transform', 'uppercase');
        $("#tblRecipientMsgConfigTrans tbody").find('.k-input').css('text-transform', 'uppercase');
        $('#SearchBtn').css('height', '18px');
        $('#Btn1').css('height', '23px');
    }
}

//function getradiobuttonvalue() {
//    //$('#divRecipientMsgConfigTrans  table tbody tr[id^="tblRecipientMsgConfigTrans_Row_"]').each(function (i, e) {
//    //    var id = $(this).attr("id");
//    //    var $td = $('#' + id).closest('table').closest('tr');
//    //    var $len = $td.find("input[id^='ReceivingID']").prevObject[0].childNodes[2].firstChild.value;
//    //    $len == '';
//    //});
//   // var Mode = $('#' + obj).closest('tr').find("input:radio[name*=Mode]:checked").val();
//    $('#tblRecipientMsgConfigTrans tbody tr input:radio[type^=radio]').each(function () {
//        var id = $(this).attr("id");
//        var $td = $('#' + id).closest('table').closest('tr');
       
//        if ($("input[id='" + id + "']:checked").val() == 1) {
//            var usershow = $td.find("input[id*='UserID']").removeAttr("disabled").hide();
//            usershow.prevObject[0].cells[3].lastChild.hidden = true;
//            $td.find("input[id*='ReceivingID']").val("");
//            $td.find("input[id*='ReceivingID']").attr("data-valid", "maxlength[7],minlength[7],required");
//            $td.find("input[id*='ReceivingID']").attr("data-valid-msg", "SITA ID Must be 7 Character.");
//            $td.find("input[id*='ReceivingID']").attr("maxlength", "7");
//            $td.find("input[id*='ReceivingID']").css("text-transform", "uppercase");
//            $td.find("input[id*='ReceivingID']").attr("placeholder", "AAABBCC");
//            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("data-valid");
//            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("data-valid-msg");
//            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("required");

//        }
       
//        //var $radval=$("input[id='" + id + "']:checked").val();
//        //var $actualradval=$radval[0].parentElement.innerText;
//        //  if ($("input[id='" + id + "']:checked").val() == 1){
//        //var elem = $('#' + id).closest('tr');
//        //var modeType = elem.find("input:radio[name*=Mode]:checked").val();
//    });
//};

$('#tblRecipientMsgConfigTrans tbody tr input:input[id*=ReceivingID]').live('click', function () {
    this.attributes[10].nodeValue = '';
    Checkvalidity(this.id);
   
});
$('#tblRecipientMsgConfigTrans tbody tr input:radio[type^=radio]').live("click", function () {
    var id = $(this).attr("id");
    var $td = $('#'+id).closest('table').closest('tr');
    if ($("input[id='" + id + "']:checked").val() == 1 || $("input[id='" + id + "']:checked").val() == 2) {
        $td.find("input[id*='UserID']").val('');
        $td.find("input[id*='Password']").val('');
        $td.find("input[id*='UserID']").attr("disabled", 1).hide();
        $td.find("input[id*='Password']").attr("disabled", 1).hide();
        $td.find("input[id*='Password']").removeAttr("data-valid");
        $td.find("input[id*='Password']").removeAttr("data-valid-msg");
        $td.find("input[id*='UserID']").removeAttr("data-valid");
        $td.find("input[id*='UserID']").removeAttr("data-valid-msg");
        $td.find("input[id*='Password']").removeAttr("required");
        $td.find("input[id*='UserID']").removeAttr("required");
        if ($("input[id='" + id + "']:checked").val() == 1) {
            var usershow = $td.find("input[id*='UserID']").removeAttr("disabled").hide();
            usershow.prevObject[0].cells[3].lastChild.hidden = true;
            $td.find("input[id*='ReceivingID']").val("");
            $td.find("input[id*='ReceivingID']").attr("data-valid", "maxlength[7],minlength[7],required");
            $td.find("input[id*='ReceivingID']").attr("data-valid-msg", "SITA ID Must be 7 Character.");
            $td.find("input[id*='ReceivingID']").attr("maxlength", "7");
            $td.find("input[id*='ReceivingID']").css("text-transform", "uppercase");
            $td.find("input[id*='ReceivingID']").attr("placeholder", "AAABBCC");
            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("data-valid");
            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("data-valid-msg");
            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("required");

        }
        if ($("input[id='" + id + "']:checked").val() == 2) {
            var usershow = $td.find("input[id*='UserID']").removeAttr("disabled").hide();
            usershow.prevObject[0].cells[3].lastChild.hidden = true;
            $td.find("input[id*='ReceivingID']").val("");
            $td.find("input[id*='ReceivingID']").attr("data-valid", "email,required");
            $td.find("input[id*='ReceivingID']").attr("data-valid-msg", "Enter Valid Email Address.");
            $td.find("input[id*='ReceivingID']").attr("maxlength", "200");
            $td.find("input[id*='ReceivingID']").css("text-transform", "lowercase");
            $td.find("input[id*='ReceivingID']").attr("placeholder", "myname@example.net");
            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("data-valid");
            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("data-valid-msg");
            $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").removeAttr("required");
        }
    }
    if ($("input[id='" + id + "']:checked").val() == 0) {
        $td.find("input[id*='ReceivingID']").val("");
        var usershow = $td.find("input[id*='UserID']").removeAttr("disabled").show();
        usershow.prevObject[0].cells[3].lastChild.hidden = false;
        $td.find("input[id*='Password']").removeAttr("disabled").show();
        $td.find("input[id*='ReceivingID']").attr("data-valid", "required");
        $td.find("input[id*='ReceivingID']").attr("data-valid-msg", "Receiving ID is Required.");
        $td.find("input[id*='ReceivingID']").attr("maxlength", "200");
        $td.find("input[id*='ReceivingID']").attr("placeholder", "");
        $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingUserId_']").attr("required", "required");
        $td.find("input[id*='tblRecipientMsgConfigTrans_ReceivingPassword_']").attr("required", "required");
    }
});


function ValidateEMail(email) {

    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}

function Checkvalidity(obj) {
    var Mode = $('#' + obj).closest('tr').find("input:radio[name*=Mode]:checked").val();
    var email = $('#' + obj).val();
    if (Mode == "2" && email!="") {
        if (ValidateEMail(email)) {

        }
        else{
            ShowMessage('warning', 'Warning - Recipient Message Config !', "Please Add Valid Email Address.");
            $('#' + obj).val('');
            return false;
        }

    } else if (Mode == "1") {
    
        $("#" + obj + "").attr("maxlength", "7");
        $("#" + obj + "").attr("placeholder", "AAABBCC");
        $("#" + obj + "").attr("data-valid", "maxlength[7],minlength[7],required");
        $("#" + obj + "").attr("data-valid-msg", "SITA ID Must be 7 Character.");
      //  $("#" + obj + "").val('');
    }
}


//$(document).on('load', function () {
//    MakeTrans();
//});


function beforeAddEventCallback() {
    $('#divRecipientMsgConfigTrans  table tbody tr[id^="tblRecipientMsgConfigTrans_Row_"]').each(function (i,e) {
        var id = $(this).attr("id");
        var elem = $('#' + id).closest('tr');
        var modeType = elem.find("input:radio[name*=Mode]:checked").val();
        var userId = elem.find("input[id*='UserID']");
        var pwd = elem.find("input[id*='Password']");
        var receivingId = elem.find("input[id*='ReceivingID']");

        if (modeType == 2 || modeType == 1) {
            pwd.val('');
            userId.prevObject[0].cells[3].lastChild.hidden = true;
            userId.attr("disabled", 1).hide();
            pwd.attr("disabled", 1).hide();
            userId.removeAttr("required");
            pwd.removeAttr("required");

        }

    });
}
function onAppendGridRowappend(elem) {
    $("tr[id^='tblRecipientMsgConfigTrans_Row']").each(function (i, elem) {
        var t = $(elem).find("input:radio:checked").val();
        var stremail = $(elem).find("input[id^='tblRecipientMsgConfigTrans_ReceivingUserId']");
        if (t == 2 || t == 1)
            stremail.removeAttr("required");
    });

    var modeType = elem.find("input:radio[name*=Mode]:checked").val();
    var userId = elem.find("input[id*='UserID']");
    var pwd = elem.find("input[id*='Password']");
    var receivingId = elem.find("input[id*='ReceivingID']");

    if (modeType == 2 || modeType == 1) {
        userId.val('');
        pwd.val('');
        var userhide = userId.prevObject[0].cells[3];
        userhide.lastChild.hidden = true;
      //  userId.attr("disabled", 1).hide();
        pwd.attr("disabled", 1).hide();
        userId.removeAttr("required");
        pwd.removeAttr("required");

        if (modeType == 1) {
            receivingId.val("");
            receivingId.attr("data-valid", "maxlength[7],minlength[7],required");
            receivingId.attr("data-valid-msg", "SITA ID Must be 7 Character.");
            receivingId.attr("maxlength", "7");
            receivingId.css("text-transform", "uppercase");
            receivingId.attr("placeholder", "AAABBCC");
        }
        if (modeType == 2) {
            receivingId.val("");
            receivingId.attr("data-valid", "email,required");
            receivingId.attr("data-valid-msg", "Enter Valid Email Address.");
            receivingId.attr("maxlength", "200");
            receivingId.css("text-transform", "lowercase");
            receivingId.attr("placeholder", "myname@example.net");
        }
    }
    if (modeType == 0) {
       // userhide.lastChild.hidden = false;
       //userId.removeAttr("disabled").show();
        //pwd.removeAttr("disabled").show();

        receivingId.val("");
        receivingId.attr("data-valid", "required");
        receivingId.attr("data-valid-msg", "Receiving ID is Required.");
        receivingId.attr("maxlength", "200");
        receivingId.attr("placeholder", "");
    }
}


$(document).on('click', '#[id^=Btn1]', function (e) {
    if ($('#SearchBtn').val() != "") {
        var SearchText = $('#SearchBtn').val();
        MakeTrans();
        $('#SearchBtn').val(SearchText);
    } else {
        e.preventDefault();
        return true;
    }
});
$(document).on('click', '#[id^=RefreshBtn]', function (e) {
    $('#SearchBtn').val("");
    MakeTrans();
});
function tablebind(obj) {
    var Defaultpara = "";
    var RecordID = getQueryStringValue("RecID");
    var id = obj.id;
    if (id == "GenExcelBtn") {
        Defaultpara = "1"
        RecordID="1"
    } else { Defaultpara = "0" }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "Services/EDI/RecipientMsgConfigService.svc/GetRecipientMsgConfigExcel?recid=" + RecordID + "&defaultPara=" + Defaultpara,
        // data: "{}",
        dataType: "json",
        success: function (response) {
            var obj = $.parseJSON(response);
            var dt = obj.Table0;
            if (dt.length > 0) {

                var str = "<html><table class='dataTable' width:100%  border=\"1px\">";
                str += "<tr style='background-color:#D5E1F0;border:1px solid;font-size: 18px;height:20px;text-align: center;'><td colspan=12><b>Airline Messaging</b></td></tr>"
                str += "<tr style='background-color:#C0C0C0;border:1px solid;font-size: 16px;height: 20px;'><td>Recipient Type</td><td>Airline Name</td><td>Execution Type</td><td>Message Movement Type</td><td>Basis</td><td>Origin Airport</td><td>Destination Airport</td><td>Flight No</td> <td>Message Type</td><td>Message SubType</td><td>Message Version</td><td>Receiving Mode</td><td>Receiving ID</td><td>Double Signature</td><td>Messaging Enabled</td></tr>"

                for (var i = 0; i < dt.length; i++) {
                    str += "<tr><td>" + dt[i].RecipientType + "</td><td>" + dt[i].AirlineName
                        + "</td><td>" + dt[i].ExecutionType
                        + "</td><td>" + dt[i].MessageMovementType
                        + "</td><td>" + dt[i].Basis + "</td><td>" + dt[i].OriginAirport+ "</td>"
                        + "</td><td>" + dt[i].DestinationAirport + "</td><td>"+ dt[i].FlightNo
                        + "</td><td>" + dt[i].MessageType + "</td><td>" + dt[i].MessageSubType
                        + "</td><td>" + dt[i].MessageVersion + "</td><td>" + dt[i].ReceivingMode
                        + "</td><td>" + dt[i].ReceivingID + "</td><td>" + dt[i].DoubleSignature
                        + "</td><td>" + dt[i].MessagingEnabled + "</td></tr>"
                }
                str += "</table></html>";

                var d = new Date();
                var dd = d.getDate();
                var month = d.getMonth() + 1;
                var yrs = d.getFullYear();
                var yyyy = d.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                var today = dd + '_' + month + '_' + yrs;
                var filename = 'Airline Messaging_' + today +'_'; //  
                exportToExcelNew(str, filename);
            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }

        },
        error: function (response) {
            //                      
        }
    });

}
