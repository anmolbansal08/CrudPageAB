$(document).ready(function () {
    //cfi.AutoComplete("AirlineName", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");
    cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("DestinationCountry", "Country", "vCountryCode", "SNo", "Country", ["Country"], OnSelectCountryCodeChange, "contains");
    cfi.AutoComplete("DestinationCity", "CityCode", "vCityCode", "SNo", "CityCode", ["CityCode"], CityCodeChange, "contains");
    cfi.AutoComplete("MessageType", "MessageType", "vwMessageType", "SNo", "MessageType", ["MessageType"], null, "contains", null, null, null, null, MessageTypeOnSelect);
    cfi.AutoComplete("MessageVersion", "MessageVersion", "MessageTypeVersionTrans", "SNo", "MessageVersion", ["MessageVersion"], null, "contains");
    cfi.AutoComplete("AirportName", "AirportName", "vAirportCode", "SNo", "AirportName", ["AirportName"], null, "contains");
    var SearchDataSource = [{ Key: "E", Text: "Outbound" }, { Key: "I", Text: "Inbound" }, { Key: "B", Text: "Both" }];//, { Key: "Transit", Text: "Transit" }
    cfi.AutoCompleteByDataSource("MessageMovementType", SearchDataSource);
    var SearchDataSource = [{ Key: "STD", Text: "STD" }, { Key: "ATA", Text: "ATA" }];
    cfi.AutoCompleteByDataSource("Basis", SearchDataSource);

    SearchDataSource = [{ Key: "0", Text: "Manual" }, { Key: "1", Text: "Auto" }];
    cfi.AutoCompleteByDataSource("ExecutionType", SearchDataSource);

    cfi.makeTrans("EDI_RecipientMsgConfigTrans", null, null, beforeAddEventCallback, null, null, null);



    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        $("#AirportName").val(userContext.AirportSNo);
        $("#Text_AirportName").val(userContext.AirportCode + '-' + userContext.AirportName);
        //$("#DestinationCity").val(userContext.CitySNo);
        //$("#Text_DestinationCity").val(userContext.CityCode + '-' + userContext.CityName);



        /*********Get Country*********************/
        $.ajax({
            url: "Services/EDI/RecipientMsgConfigService.svc/GetCountry", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ CitySNo: userContext.CitySNo }),
            success: function (result) {
                if (result != "") {
                    //$('#Text_DestinationCountry').data("kendoAutoComplete").key(result.split('__')[0]);
                    //$('#Text_DestinationCountry').data("kendoAutoComplete").value(result.split('__')[1]);
                    $('#Text_DestinationCountry').data("kendoAutoComplete").enable(true);
                    $('#Text_DestinationCity').data("kendoAutoComplete").enable(true);


                }

            }

        });
        /*****************************************/
    }
    enabeldisabletranscontrol();

    validateEditReceipient();

    if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT")) {
        $("input[name='RecipientType']").attr('disabled', true);
        $("#Text_MessageType").data("kendoAutoComplete").enable(false)
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

    $('input[name="operation"]').click(function (e) {

        $("#divareaTrans_EDI_RecipientMsgConfigTrans tr[id^=areaTrans_EDI_RecipientMsgConfigTrans]").each(function (i, e) {
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
        cfi.ResetAutoComplete("AirlineName");
        var dataSource = new kendo.data.DataSource({
            data: []
        });
        var autocomplete = $("#Text_AirlineName").data("kendoAutoComplete");
        autocomplete.setDataSource(dataSource);
        //cfi.AutoComplete("AirlineName", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");
        cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
        $('#spnAirlineName').text('Airline Name:');

    }
    else if ($("input[name='RecipientType']:checked").val() == 1) {
        cfi.ResetAutoComplete("AirlineName");
        var dataSource = new kendo.data.DataSource({
            data: []
        });
        var autocomplete = $("#Text_AirlineName").data("kendoAutoComplete");
        if (autocomplete != undefined)
            autocomplete.setDataSource(dataSource);
        cfi.AutoComplete("AirlineName", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
        $('#spnAirlineName').text('Office Name:');

    }
    else if ($("input[name='RecipientType']:checked").val() == 2) {
        cfi.ResetAutoComplete("AirlineName");
        var dataSource = new kendo.data.DataSource({
            data: []
        });
        var autocomplete = $("#Text_AirlineName").data("kendoAutoComplete");
        autocomplete.setDataSource(dataSource);
        cfi.AutoComplete("AirlineName", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
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
        catch (exp)
        { }
    }
    else if (textId == "Text_DestinationCity") {
        try {
            cfi.setFilter(filter, "CountrySNo", "neq", 0);
            cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_DestinationCountry").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }



    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_AirportName") {
        try {
            cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_DestinationCity").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }


    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_DestinationCity") {
        try {
            cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_DestinationCountry").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }



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
    debugger;

    var RecipientMsgConfigInfo = new Array();
    RecipientMsgConfigInfo.push({
        AirlineSNo: AlineSno,
        OfficeSNo: OSNo,
        AccountSNo: AccSno,
        DestinationCountrySNo: $("#DestinationCountry").val() == "" ? 0 : $("#DestinationCountry").val(),
        DestinationCitySNo: $("#DestinationCity").val() == "" ? 0 : $("#DestinationCity").val(),
        MessageTypeMasterSNo: $("#MessageType").val(),
        MessageVersion: $("#MessageVersion").val(),
        AirportSNo: $("#AirportName").val() == "" ? 0 : $("#AirportName").val(),
        Basis: $("#Basis").val(),
        MessageMovementType: $("#MessageMovementType").val(),
        CutOffMins: $("#CutOffMins").val() == "" ? 0 : $("#CutOffMins").val(),
        IsActive: $("input[name=IsActive]:checked").val() == "0" ? true : false,
        IsDoubleSignature: $("input[name=IsDoubleSignature]:checked").val() == "0" ? true : false
    })



    $('#divareaTrans_EDI_RecipientMsgConfigTrans table:last tbody tr[id^="areaTrans_EDI_RecipientMsgConfigTrans"]').each(function (row, tr) {
        var Radiotext = "";

        if ($(this).find(":radio:checked").val() == 0) {
            Radiotext = "FTP";
        }
        else if ($(this).find(":radio:checked").val() == 1) {
            Radiotext = "SITA";
        }
        else if ($(this).find(":radio:checked").val() == 2) {
            Radiotext = "Email   ";
        }

        RecipientMsgConfigTransInfo.push({
            ReceivingMode: Radiotext,
            ReceivingID: $(tr).find("td").find('input:text[id^="ReceivingID"]').val(),
            ReceivingUserId: $(tr).find("td").find('input:text[id^="UserID"]').val(),
            ReceivingPassword: $(tr).find("td").find('input:text[id^="Password"]').val(),
        });
    });
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
                //ShowMessage('success', 'Success!', "Recipient Message Config Added Successfully");
                dirtyForm.isDirty = false;
                returnVal = true;
                //navigateUrl('Default.cshtml?Module=EDI&Apps=EventMessageTrans&FormAction=INDEXVIEW');
            }
            else if ($(result)[0].indexOf("Recipient Message Config Already Exists") != -1) {
                ShowMessage('info', 'Need your Kind Attention!', "Recipient Message Config Already Exists");
                //alert("Message Type already exists");
                returnVal = false;
            }

        },
        error: function (xhr) {
            debugger
        }
    });
    return returnVal;
}


function UpdateRecipientMsgConfigTrans() {
    var returnVal = false;
    var RecipientMsgConfigTransInfoUpdate = new Array();
    $('#divareaTrans_EDI_RecipientMsgConfigTrans table:last tbody tr[id^="areaTrans_EDI_RecipientMsgConfigTrans"]').each(function (row, tr) {
        var Radiotext = "";

        if ($(this).find(":radio:checked").val() == 0) {
            Radiotext = "FTP";
        }
        else if ($(this).find(":radio:checked").val() == 1) {
            Radiotext = "SITA";
        }
        else if ($(this).find(":radio:checked").val() == 2) {
            Radiotext = "Email   ";
        }

        RecipientMsgConfigTransInfoUpdate.push({
            ReceivingMode: Radiotext,
            ReceivingID: $(tr).find("td").find('input:text[id^="ReceivingID"]').val(),
            ReceivingUserId: $(tr).find("td").find('input:text[id^="UserID"]').val(),
            ReceivingPassword: $(tr).find("td").find('input:text[id^="Password"]').val(),
            SNo: $(tr).find("td").find('input:hidden[id^="SNo"]').val() == "" ? 0 : $(tr).find("td").find('input:hidden[id^="SNo"]').val(),
            RecipientMsgConfigSNo: getQueryStringValue("RecID") == "" ? 0 : getQueryStringValue("RecID"),
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
        IsDoubleSignature: $("input[name=IsDoubleSignature]:checked").val() == "0" ? true : false
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
            debugger

        }
    });
    return returnVal;
}

function beforeAddEventCallback(elem) {

    var modeType = elem.find("input:radio[name^=Mode]:checked").val();
    var userId = elem.find("input[id^='UserID']");
    var pwd = elem.find("input[id^='Password']");
    var receivingId = elem.find("input[id^='ReceivingID']");

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

function MessageTypeOnSelect() {
    cfi.ResetAutoComplete("MessageVersion");
}

function OnSelectCountryCodeChange() {
    try {


        $.ajax({
            url: "Services/EDI/RecipientMsgConfigService.svc/GetCityInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#DestinationCountry").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#DestinationCity').val(resData[0].SNo);
                    $('#Text_DestinationCity').val(resData[0].CityName);
                }
            }
        });
    }
    catch (exp) { }

}


function CityCodeChange() {
    try {
        $.ajax({
            type: "GET",
            url: "Services/EDI/RecipientMsgConfigService.svc/GetAirportInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#DestinationCity").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#AirportName').val(FinalData[0].SNo);
                    $('#Text_AirportName').val(FinalData[0].AirportName);
                }
            }
        });
    }
    catch (exp) { }

}