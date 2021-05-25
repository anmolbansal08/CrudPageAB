var flag = "0";
var modeForSlab = "0"

$(document).ready(function ()
{
    $(".WebFormTable tbody tr:eq(1) td").append('<span align="right"><input type="button" id="btnDownload" value="Download Rate" class="btn btn-info" style="  float: right; "></span>');
    if (getQueryStringValue("FormAction").toUpperCase() != "READ" || getQueryStringValue("FormAction").toUpperCase() != "DELETE") {
        if ($('#IsInterlineval').length > 0) {
            $('#IsInterlineval').closest('input').remove()
        }
        $("input[id='RAirlineSNo']:hidden").after('<input type="hidden" name="IsInterlineval" id="IsInterlineval" value="">')
        if ($("#RAirlineSNo").val() != "") {
            OnSelectInterline() // Added by devendra for check is interline 
        }

    }
    $("#btnDownload").unbind("click").bind("click", function () {
        $("#divAfterContent").remove();
        $('body').append($("<div />", {
            id: 'divAfterContent'
        }));
        $("#divAfterContent").html('');
        $("#divAfterContent").html('<span><table><tr><td>Airline :</td><td><input type="hidden" name="AirlineSno" id="AirlineSno" value=""><input type="text" class="" name="Text_AirlineSno" id="Text_AirlineSno" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><tr><td>Origin :</td><td><input type="hidden" name="OriginSno" id="OriginSno" value=""><input type="text" class="" name="Text_OriginSno" id="Text_OriginSno" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><tr><td>Destination :</td><td><input type="hidden" name="DestinationSno" id="DestinationSno" value=""><input type="text" class="" name="Text_DestinationSno" id="Text_DestinationSno" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><tr><td>Office :</td><td><input type="hidden" name="OfficeSno" id="OfficeSno" value=""><input type="text" class="" name="Text_OfficeSno" id="Text_OfficeSno" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><tr><td>Agent :</td><td><input type="hidden" name="AccountSno" id="AccountSno" value=""><input type="text" class="" name="Text_AccountSno" id="Text_AccountSno" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><tr><td>SHC :</td><td><input type="hidden" name="SHCSno" id="SHCSno" value=""><input type="text" class="" name="Text_SHCSno" id="Text_SHCSno" controltype="autocomplete" maxlength="20" value="" placeholder=""></td></tr><tr><td>Status :</td><td><input type="hidden" name="Status" id="Status" value=""><input type="text" class="" name="Text_Status" id="Text_Status" controltype="autocomplete" maxlength="20" value="" placeholder=""></td></tr><tr><td colspan=2><input type = button id="btnDownloadRequest" value="Rate Download Request" onclick="Fn_downloadrate()" class="btn btn-info"></td></tr></table></span>');
        //cfi.AutoCompleteV2("OtherNatureofGoods", "CarrierCode,AirlineName", "Rate_rate_AirlineName", null, "contains");
        cfi.AutoCompleteV2("AirlineSno", "CarrierCode,AirlineName", "CreditLimitReport_Airline", null, "contains");


        //cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);     
        //cfi.AutoCompleteByDataSource("DestinationType", Destination1, FnGetDestinationAC, null);
       
        cfi.AutoCompleteV2("OriginSno", "AirportCode,AirportName", "Rate_rate_Origin", OnSelectOrigin, "contains");

        cfi.AutoCompleteV2("DestinationSno", "AirportCode,AirportName", "Rate_rate_Destination", OnSelectDestination, "contains");

        cfi.AutoCompleteV2("OfficeSno", "Name", "Rate_rate_Office", OnSelectOffice, "contains");

        cfi.AutoCompleteV2("AccountSno", "AgentName", "Rate_rate_RateAgentName", null, "contains");

        cfi.AutoCompleteV2("SHCSno", "Name", "Rate_rate_SPHCName", null, "contains");
   
        cfi.AutoCompleteByDataSource("Status", Active, null, ",");
        //if ($("#Status").val() == "") {
        //    ShowMessage('warning', 'Warning - Rate', 'Status Can Not Be Blank', "bottom-right");
        //    $("#Text_Status").focus();
        //    return false;
        //}
       
        cfi.PopUp("divAfterContent", "Download Rate", 400, null, null, 100);

        //$("#divAfterContent").html('<span><table><tr><td>Airline :</td><td><input type="hidden" name="AirlineSno1" id="AirlineSno1" value=""><input type="text" class="" name="Text_AirlineSno1" id="Text_AirlineSno1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td></tr><tr><td>Status :</td><td><input type="hidden" name="Status" id="Status" value=""><input type="text" class="" name="Text_Status" id="Text_Status" controltype="autocomplete" maxlength="20" value="" placeholder=""></td></tr><tr><td colspan=2><input type = button value="Download"</td></tr></table></span>');
        //cfi.AutoCompleteV2("RAirlineSNo", "CarrierCode,AirlineName", "Rate_rate_AirlineName", OnSelectAirline, "contains");
        //cfi.AutoCompleteByDataSource("Status", Active, null, null);
        //cfi.PopUp("divAfterContent", "Rate Download", 400, null, null, 100);

    });
 
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#btnDownload").closest("span").hide();
        cfi.AutoCompleteByDataSource("MailRatingCodeSNo", MailRatingCode, null, null);
        $('#MasterSaveAndNew').after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Save" class="btn btn-success">');
        $("input[type='submit'][name='operation']").hide();
        cfi.AutoCompleteV2("RateCardSNo", "RateCardName", "Rate_rate_RateCardName", onSelectRateCard, "contains");
        cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
        // cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
        cfi.AutoCompleteByDataSource("DestinationType", Destination1, FnGetDestinationAC, null);

        cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Rate_rate_Origin", OnSelectOrigin, "contains");
        cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Rate_rate_Destination", OnSelectDestination, "contains");
        cfi.AutoCompleteByDataSource("Active", Active, null, null);
        //$("#Text_OriginSNo").css("display", "none");
        cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "Rate_rate_CurrencyName", null, "contains");
        cfi.AutoCompleteByDataSource("RateBaseSNo", RateBaseName, null, null);
        cfi.AutoCompleteV2("RateTypeSNo", "RateTypeName", "Rate_rate_RateType", onSelectAllotment, "contains");
        //cfi.AutoCompleteByDataSource("UOMSNo", UOM, null, null);
        cfi.AutoCompleteV2("TransitStationSNo", "AirportCode,AirportName", "Rate_rate_TransitStation", null, "contains", ",");
        cfi.AutoCompleteV2("FlightTypeSNo", "FlightTypeName", "Rate_rate_FlightType", null, "contains");
        cfi.AutoCompleteV2("AllotmentSNo", "AllotmentCode", "Rate_rate_AllotmentCode", GetAllotmentType, "contains");
        cfi.AutoCompleteV2("RAirlineSNo", "CarrierCode,AirlineName", "Rate_rate_AirlineName", OnSelectAirline, "contains");
        cfi.AutoCompleteV2("OfficeSNo", "Name", "Rate_rate_Office", OnSelectOffice, "contains");




        $("#Text_RateBaseSNo").val("ON CHARGEABLE WEIGHT.");
        $("#RateBaseSNo").val("3");
        //$("#Text_RAirlineSNo").val("On Chargable Wt.");
        //$("#RAirlineSNo").val("3");

        $("#Text_AllotmentSNo").closest("span").hide();
        $("#Text_OriginType").val("AIRPORT");
        $("#Text_DestinationType").val("AIRPORT");
        $("#OriginType").val("1");
        $("#DestinationType").val("1");

        $("#ValidFrom").data("kendoDatePicker").value("");
        $("#ValidTo").data("kendoDatePicker").value("");
        var todaydate = new Date();
        var validfromdate = $("#ValidFrom").data("kendoDatePicker");
        validfromdate.min(todaydate);
        var validTodate = $("#ValidTo").data("kendoDatePicker");
        validTodate.min(todaydate);

        $("input[id^=ValidTo]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("To", "From");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");
        });

        $("input[id^=ValidFrom]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("From", "To");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");

        });





        CreateRemarks();
        //CreateSlabGrid();
        CreateULDSlabGrid();
        CreateRateParamGrid();
        $("#btnSaveRateMaster").unbind("click").bind("click", function () {

            CheckRateslab();
            if ($('[id^=tblULDRate_UldMinChWT_]').val() == "0" || $('[id^=tblULDRate_UldMinChWT_]').val() == "0.00" || $('[id^=tblULDRate_UldMinChWT_]').val() == "") {
                ShowMessage('warning', 'Warning - Rate', 'Pivot weight should be greater than zero.', "bottom-right");
                $('[id^=tblULDRate_UldMinChWT_]').val('');
                return false;
            }
            if (cfi.IsValidSubmitSection()) {
                SaveRateAirlineMaster("NEW");
            }
            // SaveRateAirlineMaster("NEW");
        });
        $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
            //if (parseInt((this.id).split('_')[2] > 1) {
            $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");
            $(tr).find("input[id^='tblRateBase_Rate_']").val("");
            $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
            $(tr).find("input[id^='tblRateBase_Based_']").val("");
            // }
        });
        $("#Text_MailRatingCodeSNo").closest("span").hide();



        $("input[id^='REFNo']").on("contextmenu", function (e) {
            alert('Right click disabled');
            return false;
        });
        $("input[id^='REFNo']").on('drop', function () {
            return false;
        });


    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {

        $("#btnDownload").closest("span").hide()
        cfi.AutoCompleteByDataSource("MailRatingCodeSNo", MailRatingCode, null, null);
        //$('#MasterSaveAndNew').after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Update" class="btn btn-success">');
        //$("input[type='submit'][name='operation']").hide();
        cfi.AutoCompleteV2("RateCardSNo", "RateCardName", "Rate_rate_RateCardName", onSelectRateCard, "contains");
        cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
        //cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
        cfi.AutoCompleteByDataSource("DestinationType", Destination1, FnGetDestinationAC, null);
        cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Rate_rate_Origin", OnSelectOrigin, "contains");
        cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Rate_rate_Destination", OnSelectDestination, "contains");
        cfi.AutoCompleteByDataSource("Active", Active, null, null);
        //$("#Text_OriginSNo").css("display", "none");
        cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "Rate_rate_CurrencyName", null, "contains");
        cfi.AutoCompleteByDataSource("RateBaseSNo", RateBaseName, null, null);
        cfi.AutoCompleteV2("RateTypeSNo", "RateTypeName", "Rate_rate_RateType", onSelectAllotment, "contains");
        //cfi.AutoCompleteByDataSource("UOMSNo", UOM, null, null);
        cfi.AutoCompleteV2("TransitStationSNo", "AirportCode,AirportName", "Rate_rate_TransitStation", null, "contains", ",");
        cfi.AutoCompleteV2("FlightTypeSNo", "FlightTypeName", "Rate_rate_FlightType", null, "contains");
        cfi.AutoCompleteV2("AllotmentSNo", "AllotmentCode", "Rate_rate_AllotmentCode", GetAllotmentType, "contains");
        cfi.AutoCompleteV2("RAirlineSNo", "CarrierCode,AirlineName", "Rate_rate_AirlineName", OnSelectAirline, "contains");
        cfi.AutoCompleteV2("OfficeSNo", "Name", "Rate_rate_Office", OnSelectOffice, "contains");

        CreateRemarks();
        CreateSlabGrid();
        CreateULDSlabGrid();
        CreateRateParamGrid();
        onSelectRateCard();
        onSelectAllotment();
        UserSubProcessRightswithoutsubprocess("divbody", true);
        //-------------- search rate condition
        if (window.parent.top.$("#flagForSearch").length > 0 && getQueryStringValue("FormAction").toUpperCase() == "READ") {
            $(".btn").closest('tr').remove();
            window.parent.top.$("#flagForSearch").remove();
        }


        //---------------------- end

        //$("#Text_MailRatingCodeSNo").closest("span").hide();
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#btnDownload").closest("span").hide()
        flag = "1";
        cfi.AutoCompleteByDataSource("MailRatingCodeSNo", MailRatingCode, null, null);


        $("input[type='submit'][name='operation']").hide();
        cfi.AutoCompleteV2("RateCardSNo", "RateCardName", "Rate_rate_RateCardName", onSelectRateCard, "contains");
        cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
        // cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
        cfi.AutoCompleteByDataSource("DestinationType", Destination1, FnGetDestinationAC, null);
        // cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
        //cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
        var Destination = $("#Text_DestinationType").val().toUpperCase();

        cfi.AutoCompleteByDataSource("Active", Active, null, null);
        //$("#Text_OriginSNo").css("display", "none");
        cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "Rate_rate_CurrencyName", null, "contains");
        cfi.AutoCompleteByDataSource("RateBaseSNo", RateBaseName, null, null);
        cfi.AutoCompleteV2("RateTypeSNo", "RateTypeName", "Rate_rate_RateType", onSelectAllotment, "contains");
        //cfi.AutoCompleteByDataSource("UOMSNo", UOM, null, null);
        cfi.AutoCompleteV2("TransitStationSNo", "AirportCode,AirportName", "Rate_rate_TransitStation", null, "contains", ",");
        cfi.AutoCompleteV2("FlightTypeSNo", "FlightTypeName", "Rate_rate_FlightType", null, "contains");
        cfi.AutoCompleteV2("AllotmentSNo", "AllotmentCode", "Rate_rate_AllotmentCode", GetAllotmentType, "contains");
        cfi.AutoCompleteV2("RAirlineSNo", "CarrierCode,AirlineName", "Rate_rate_AirlineName", OnSelectAirline, "contains");
        cfi.AutoCompleteV2("OfficeSNo", "Name", "Rate_rate_Office", OnSelectOffice, "contains");

        //========================================================by arman date 9-5-2017
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            $("input[type='submit'][name='operation']").after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Update" class="btn btn-success">');
            //===================== by arman ali 02 may 2017===================//
            $('#Text_RAirlineSNo').data("kendoAutoComplete").enable(false);
            // end
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            $('#MasterSaveAndNew').after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Save" class="btn btn-success">');
            $('#Text_RAirlineSNo').data("kendoAutoComplete").enable(true);
            $('#REFNo').val('');
            var status = $("#Active").val();
            if (status == "3") {
                var sno = 0;
                var status = "Active";
                $("#Text_Active").data("kendoAutoComplete").setDefaultValue(sno, status);
            }
        }
        //============================================= end
        var todaydate = new Date();
        var validfromdate = $("#ValidFrom").data("kendoDatePicker");
        validfromdate.min(todaydate);
        var validTodate = $("#ValidTo").data("kendoDatePicker");
        validTodate.min(todaydate);

        $("input[id^=ValidTo]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("To", "From");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");
        });

        $("input[id^=ValidFrom]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("From", "To");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");

        });

        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            $("#ValidFrom").data("kendoDatePicker").enable(false);
        }

        CreateRemarks();
        //$("#OriginType").val(), $("#OriginSNo").val()
        CreateSlabGrid();
        CreateULDSlabGrid();
        CreateRateParamGrid();

        //$('#MasterSaveAndNew').show();

        $("#btnSaveRateMaster").unbind("click").bind("click", function () {
            CheckRateslab();
            var modeOfOperation = ""
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
                modeOfOperation = "EDIT"
            else if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
                modeOfOperation = "NEW"
                $("#hdnRateSNo").val('0');
            }

            if ($('[id^=tblULDRate_UldMinChWT_]').val() == "0" || $('[id^=tblULDRate_UldMinChWT_]').val() == "0.00" || $('[id^=tblULDRate_UldMinChWT_]').val() == "") {
                ShowMessage('warning', 'Warning - Rate', 'Pivot weight should be greater than zero.', "bottom-right");
                $('[id^=tblULDRate_UldMinChWT_]').val('');
                return false;
            }

            if (cfi.IsValidSubmitSection()) {
                if (cfi.IsValidSubmitSection("divRateBase")) {
                    SaveRateAirlineMaster(modeOfOperation);
                }
            }
        });

        BindOriginOnEdit();
        BindDestinationOnEdit();
        onSelectRateCard();
        onSelectAllotment();

    }
});

function Fn_downloadrate() {
    $.ajax({
        url: "Services/Rate/RateService.svc/SaveRateDownloadRequest",
        async: false,
        type: "POST",
        dataType: "json",
        cache: false,

     //   $("#txtcity").val() != '' ? $("#txtState").show() : $("#txtState").hide()
        data: JSON.stringify({ AirlineSno: $("#AirlineSno").val() != '' ? $("#AirlineSno").val() : '0', OriginSno: $("#OriginSno").val() != '' ? $("#OriginSno").val() : '0', DestinationSno: $("#DestinationSno").val() != '' ? $("#DestinationSno").val() : '0', OfficeSno: $("#OfficeSno").val() != '' ? $("#OfficeSno").val() : '0', AgentSno: $("#AccountSno").val() != '' ? $("#AccountSno").val() : '0', SHCSno: $("#SHCSno").val() != '' ? $("#SHCSno").val() : '0', Status: $("input[id^='Multi_Status']").val(), Message: "Rate Excel Download request is send by user" }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result != null && result != "") {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].MessageNumber == '1') {
                    ShowMessage('success', 'Success - Rate Download Request', MsgData[0].result, "bottom-right");
                    $("#divAfterContent").data("kendoWindow").close();
                }
                else {
                    ShowMessage('warning', 'Warning - Rate Download Request', MsgData[0].result, "bottom-right");
                }
            }
        },
        error: function (error) {
        }
    });

}
function OnSelectOffice(input) {

    var Text_OfficeSNo = $("#Text_OfficeSNo").val();
    var OfficeSNo = $("#OfficeSNo").val() || "0";
    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        if (Text_OfficeSNo != "") {
            // by arman for clearing shipper,agent name and group
            $('#divMultiShipperSNo').remove();
            $('#divMultiAccountSNo').remove();
            $('#divMultiAccountGroupSNo').remove();
            cfi.AutoCompleteV2("AccountGroupSNo", "AgentGroupName", "Rate_rate_AgentGroupName", null, "contains", ",");

            cfi.AutoCompleteV2("ShipperSNo", "AgentName", "Rate_rate_AgentName", null, "contains", ",");

            cfi.AutoCompleteV2("AccountSNo", "AgentName", "Rate_rate_RateAgentName", null, "contains", ",");
            $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(false);
            $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
            $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
        }
        else {
            if (flag != "1") {
                $('#divMultiShipperSNo').remove();
                $('#divMultiAccountSNo').remove();
                $('#divMultiAccountGroupSNo').remove();
                cfi.AutoCompleteV2("AccountGroupSNo", "AgentGroupName", "Rate_rate_AgentGroupName", null, "contains", ",");

                cfi.AutoCompleteV2("ShipperSNo", "AgentName", "Rate_rate_AgentName", null, "contains", ",");

                cfi.AutoCompleteV2("AccountSNo", "AgentName", "Rate_rate_RateAgentName", null, "contains", ",");
                // end here
                $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(true);
                $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
                $("#Text_ShipperSNo").data("kendoAutoComplete").enable(true);
            }
        }
    }
    flag = "0";

}

function OnSelectAirline(input) {
    $("#divMultiFlightSNo").find('li span[class="k-icon k-delete"]').click();
    var AirlineSNo = $("#RAirlineSNo").val() | "0";
    $.ajax({
        url: "Services/Rate/RateService.svc/GetAirlineCurruncy?AirlineSNo=" + AirlineSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "" && result != null) {
                var ResultData = jQuery.parseJSON(result);
                if (ResultData.Table0.length > 0) {
                    $("#CurrencySNo").val(ResultData.Table0[0].CurrencySNo);
                    $("#Text_CurrencySNo").val(ResultData.Table0[0].Currency);
                    $("#IsInterlineval").val('');
                    $("#IsInterlineval").val(ResultData.Table0[0].IsInterline);
                }
            }
        }
    });
    modeForSlab = "1";
    CreateSlabGrid();  // arman ali
}

function onSelectRateCard(input) {
    //$("#Text_MailRatingCodeSNo").closest("span").hide();
    if ($("#Text_RateCardSNo").val().toUpperCase() == "MAIL") {
        $("#Text_MailRatingCodeSNo").closest("span").show();
        $("#Text_MailRatingCodeSNo").attr("data-valid", "required");
        $("#Text_RateTypeSNo").val("MAIL RATING");
        $("#RateTypeSNo").val("0");
        $("#Text_RateTypeSNo").data("kendoAutoComplete").enable(false);

    }
    else {
        $("#Text_MailRatingCodeSNo").closest("span").hide();
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            $("#Text_RateTypeSNo").val("");
            $("#RateTypeSNo").val("");
        }
        if ($("#Text_RateCardSNo").val().toUpperCase() != "MAIL") {
            $("#Text_RateTypeSNo").data("kendoAutoComplete").enable(true);
            $("#Text_MailRatingCodeSNo").removeAttr("data-valid");
            $("#Text_MailRatingCodeSNo").removeAttr("class");
            $("#Text_MailRatingCodeSNo").attr("class", "k-formatted-value k-input transSection k-state-default");
            $("#Text_MailRatingCodeSNo").val("");
            $("#MailRatingCodeSNo").val("");
            if ($("#Text_RateTypeSNo").val() == "MAIL RATING") {
                $("#Text_RateTypeSNo").val("");
                $("#RateTypeSNo").val("");
            }
        }
    }

}
function onSelectAllotment(input) {

    if ($("#Text_RateTypeSNo").val() == "ALLOTMENT RATE") {
        $("#Text_AllotmentSNo").closest("span").show();
        $("#Text_AllotmentSNo").attr("data-valid", "required");
        GetAllotmentType();
        ClearAgent();
    }
    else {
        $("#Text_AllotmentSNo").closest("span").hide();
        $("#Text_AllotmentSNo").removeAttr("data-valid");
        $("#Text_AllotmentSNo").removeAttr("class");
        $("#Text_AllotmentSNo").attr("class", "k-formatted-value k-input transSection k-state-default");
        //=======by arman 

        enableFields();
        // $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
        ClearAgent();

    }


}
function GetAllotmentType() {

    var AllotmentSNo = $("#AllotmentSNo").val();
    if (AllotmentSNo != "") {
        $.ajax({
            url: "Services/Rate/RateService.svc/GetAllotmentType?AllotmentSNo=" + AllotmentSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "" && result != null) {
                    var ResultData = jQuery.parseJSON(result);

                    if (ResultData.Table0.length > 0) {
                        $("#spnallotement").html("");
                        $("#Text_AllotmentSNo").after("<span id='spnallotement' style='padding-left:40px;font-weight:BOLD;'>" + ResultData.Table0[0].AllotmentType + "</span>");
                        $("#Text_OriginType, #Text_DestinationType").val('AIRPORT');
                        $("#OriginType, #DestinationType").val('1');
                        $("#Text_OriginType").data("kendoAutoComplete").enable(false);
                        $("#Text_DestinationType").data("kendoAutoComplete").enable(false);
                        $("#Text_OriginSNo").val(ResultData.Table0[0].OriginAirport);
                        $("#OriginSNo").val(ResultData.Table0[0].OriginAirportSNo);
                        $("#Text_DestinationSNo").val(ResultData.Table0[0].DestinationAirport);
                        $("#DestinationSNo").val(ResultData.Table0[0].DestinaitionAirportSNo);
                        $("#Text_OriginSNo").data("kendoAutoComplete").enable(false);
                        $("#Text_DestinationSNo").data("kendoAutoComplete").enable(false);
                        $("#Text_OfficeSNo").data("kendoAutoComplete").enable(false);
                        $('#Text_OfficeSNo').val('');
                        $('#OfficeSNo').val('');
                        $('#Text_OfficeSNo').val(ResultData.Table0[0].Office)
                        $('#OfficeSNo').val(ResultData.Table0[0].OfficeSNo)
                        $("#Text_OfficeSNo").data("kendoAutoComplete").enable(false);
                        $('#Text_AccountSNo').val(ResultData.Table0[0].Agent)
                        $('#AccountSNo').val(ResultData.Table0[0].AccountSNo)
                        $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                        $('#Text_RAirlineSNo').val(ResultData.Table0[0].AirlineName)
                        $('#RAirlineSNo').val(ResultData.Table0[0].AirlineSNo)
                        $("#Text_RAirlineSNo").data("kendoAutoComplete").enable(false);
                        $("[id='IE5']").attr('disabled', true);

                    }
                }
            }
        });
    }
    else {

        enableFields();



    }



}
function OnSelectOrigin(input) {

    var Origin = $("#Text_OriginType").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Origin == "AIRPORT") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', 'Origin Airport can not be same as Destination Airport.', "bottom-right");
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
    CreateSlabGrid();
    ClearAgent();
    // flag = "0";
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        //$("#REFNo").val($("#Text_RateCardSNo").val() + "_" + Text_OriginSNo.split("-")[0] + "_" + Text_DestinationSNo.split("-")[0] + "_1");
    }
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    //    FnGetOriginAC();
    //}

}
function OnSelectDestination(input) {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        if (Destination == "AIRPORT") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Destination Airport can not be same as Origin Airport.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }
        }
        else if (Destination == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Rate', "Destination Airport can not be same as Origin Airport.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }

        }
    }

    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        //$("#REFNo").val($("#Text_RateCardSNo").val() + "_" + Text_OriginSNo.split("-")[0] + "_" + Text_DestinationSNo.split("-")[0] + "_1");
    }

}


//var FlightType = [{ Key: "", Text: "" }]
var UOM = [{ Key: "0", Text: "Kg" }, { Key: "1", Text: "Lbs" }];
var MailRatingCode = [{ Key: "0", Text: "CN38" }, { Key: "1", Text: "CN47" }];
var RateBaseName = [{ Key: "0", Text: "Per Piece" }, { Key: "1", Text: "Per AWB" }, { Key: "2", Text: "On Gross weight." }, { Key: "3", Text: "On Chargeable weight." }];
var Active = [{ Key: "0", Text: "Active" }, { Key: "1", Text: "Draft" }, { Key: "2", Text: "InActive" }, { Key: "3", Text: "Expired" }];
var RateCard = [{ Key: "0", Text: "IATA" }, { Key: "1", Text: "MARKET" }, { Key: "2", Text: "SPA" }];
var Origin = [{ Key: "1", Text: "AIRPORT" }, { Key: "2", Text: "CITY" }, { Key: "3", Text: "REGION" }, { Key: "4", Text: "ZONE" }, { Key: "5", Text: "COUNTRY" }];
var Destination = [{ Key: "1", Text: "AIRPORT" }, { Key: "2", Text: "CITY" }, { Key: "3", Text: "REGION" }, { Key: "4", Text: "ZONE" }, { Key: "5", Text: "COUNTRY" }];
var Destination1 = [{ Key: "1", Text: "AIRPORT" }, { Key: "2", Text: "CITY" }, { Key: "3", Text: "REGION" }, { Key: "4", Text: "ZONE" }, { Key: "5", Text: "COUNTRY" }];
//var Destination = [{ Key: "1", Text: "AIRPORT" }, { Key: "2", Text: "CITY" }, { Key: "3", Text: "REGION" }, { Key: "4", Text: "ZONE" }, { Key: "5", Text: "COUNTRY" }];
var currentRateSNo = 0;
function FnGetOriginAC(input) {
    var Origin = $("#Text_OriginType").val().toUpperCase();
    if (Origin == "AIRPORT") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSourceV2("OriginSNo", "Rate_rate_Origin")
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
    }
    else if (Origin == "CITY") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSourceV2("OriginSNo", "Rate_rate_OriginCityName")
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
    }
    else if (Origin == "REGION") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSourceV2("OriginSNo", "Rate_rate_OriginRegionName")
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");
    }
    else if (Origin == "COUNTRY") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSourceV2("OriginSNo", "Rate_rate_OriginCountryName");
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
        cfi.AutoCompleteV2("OriginSNo", "CountryCode,CountryName", "Rate_rate_OriginCountryName", OnSelectOrigin, "contains");
    }
    else if (Origin == "ZONE") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSourceV2("OriginSNo", "Rate_rate_OriginZoneName")
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "ZoneName");
    }
}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSourceV2("DestinationSNo", "Rate_rate_Destination")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "AirportCode");
    }
    else if (Destination == "CITY") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSourceV2("DestinationSNo", "Rate_rate_OriginCityName")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");
    }
    else if (Destination == "REGION") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSourceV2("DestinationSNo", "Rate_rate_OriginRegionName")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");
    }
    else if (Destination == "COUNTRY") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSourceV2("DestinationSNo", "Rate_rate_OriginCountryName")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
    }
    else if (Destination == "ZONE") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSourceV2("DestinationSNo", "Rate_rate_OriginZoneName")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "ZoneName");
    }
}



function CheckValidation(input) {

}
function CheckRate(input) {
    //var CurrentRow = $('#' + input).closest("tr");
    //var Type = CurrentRow.find("input[id^='tblRateBase_RateClassSNo_']").val() == '' ? false : true;
    ////var Type2 = CurrentRow.find("input[id^='tblRateBase_Rate_']").val() == '' ? false : true;


    //if (Type) {
    //    CurrentRow.find("input[id^='tblRateBase_Rate_']").attr("data-valid", "min[0.01],required");
    //    CurrentRow.find("input[id^='_temptblRateBase_Rate_']").attr("data-valid", "min[0.01],required");

    //}
    //else {
    //    CurrentRow.find("input[id^='tblRateBase_Rate_']").removeAttr("data-valid");
    //    CurrentRow.find("input[id^='_temptblRateBase_Rate_']").removeAttr("data-valid");
    //}


}
function ChangeUnitType(input) {

}
//function CheckValidationTable(){
//    var table = $('#tblRateBase').IsValidSubmitSection();
//    return table;
//}

function CheckValueValidation(input) {

    var CurrentRowVal = $("#" + input).val();
    var rowNo = input.split("_")[2];
    var previousRowVal = $("#tblRateBase_Rate_" + (parseInt(rowNo) - 1)).val();
    var nextRowVAl = $("#tblRateBase_Rate_" + (parseInt(rowNo) + 1)).val()
    var RateClass = $("#tblRateBase_RateClassSNo_" + (parseInt(rowNo))).val().toUpperCase();
    var RateClassName = RateClass.split("-")[1];
    if (typeof (RateClassName) == "undefined")
        RateClassName = RateClass;

    // if (userContext.SysSetting.IsFlatRateApplicable != "True") {
    if (RateClassName != 'FLAT CHARGE') {
        if (parseFloat(CurrentRowVal) > parseFloat(previousRowVal) && rowNo >= 2) {
            ShowMessage('warning', 'warning - Rate', "Rate Cannot be greater than previous rate ", "bottom-right");
            // $("#tblRateBase_Rate_" + (parseInt(rowNo) - 1)).val('');
            $("#" + input).val("");
            $("#_temp" + input).val("");

        }
        else if (parseFloat(nextRowVAl) > parseFloat(CurrentRowVal) && rowNo != 1) {

            ShowMessage('warning', 'warning - Rate', "Rate Cannot be greater than previous rate ", "bottom-right");
            // $("#tblRateBase_Rate_" + (parseInt(rowNo) - 1)).val('');
            $("#tblRateBase_Rate_" + (parseInt(rowNo) + 1)).val("")
            $("#_temptblRateBase_Rate_" + (parseInt(rowNo) + 1)).val("")
        }
    }

    //}


}


function CreateRemarks() {
    //divReference
    var dbtableName = "Remarks";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnRateSNo").val() || 1, //$("#hdnRateSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/RateService.svc",
        getRecordServiceMethod: "GetRemarks",
        deleteServiceMethod: "",
        caption: "Remarks",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
                 { name: "Remarks", display: "Remark", type: "text", ctrlAttr: { maxlength: 500, }, ctrlCss: { width: "350px", height: "40px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });
    $('#tblRemarks button.insert,#tblRemarks button.remove').hide();//#tblRateBase button.moveUp,#tblRateBase button.moveDown
    // Buttons at footer row
    //$("#tblRemarks button.removeLast").hide();
    $('#tblRemarks button.append,#tblRemarks button.removeLast').hide();

    $("tr[id^='tblRemarks_Row']").each(function (row, tr) {
        if ($(tr).find("input[id^='tblRemarks_Remarks_']").val() != "") {
            $(tr).find("input[id^='tblRemarks_Remarks_']").attr("disabled", true);
            $(tr).find("input[id^='tblRemarks_Remarks_']").attr("enabled", false);
        }

    });

}

var strData = [];
var pageType = $('#hdnPageType').val();
function CreateSlabGrid() {
    var AirlineSNo = $("#RAirlineSNo").val() || 0;
    var Origin = $("#OriginType").val() || 0;
    var OriginSNo = $("#OriginSNo").val() || 0;

    if (AirlineSNo == 0) {
        return;
    }

    if (AirlineSNo > 0) {
        var Wh = (AirlineSNo || 0) + "_" + (Origin || 0) + "_" + (OriginSNo || 0);
    }
    else {
        Wh = null;

    }


    var SlabProc = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        SlabProc = "GetRateSLAB_New";
    }
    else {
        if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            SlabProc = modeForSlab == "1" ? "GetRateSLAB_New" : "GetRateSLAB";
        }
        else { SlabProc = "GetRateSLAB"; }
    }
    var dbtableName = "RateBase";
    //var caption = "Rate Slab Information"+' '+ "Slab Title" 
    //$('#divRateBase').before('Slab Title : &nbsp;&nbsp;<label id="lblSlabTitle" style="font-weight:bold; font-size:13px"></label>');
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnRateSNo").val() || 1,//$("#hdnRateSNo").val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: Wh, sort: "",// AirlineSNo: AirlineSNo, Origin: Origin, OriginSNo: OriginSNo,
        isGetRecord: true,
        servicePath: "./Services/Rate/RateService.svc",
        //getRecordServiceMethod: "GetRateSLAB",
        getRecordServiceMethod: SlabProc,
        // deleteServiceMethod: 'delete' + dbtableName,
        caption: "Rate Slab Information",
        initRows: 1,
        columns: [
                     { name: "SNo", type: "hidden" },
                     { name: "SlabTitle", type: "hidden" },
                     { name: "SlabName", display: "Slab Name", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },
                     { name: "StartWt", display: "Start Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },
                     { name: "EndWt", display: "End Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, onblur: "", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },
                     { name: 'RateClassSNo', display: 'Type', type: 'text', ctrlAttr: { onSelect: "return CheckRate(this.id);", onBlur: "return CheckRate(this.id);", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: 'Rate_rate_RateClassName', filterField: "RateClassCode", filterCriteria: "contains" },
                     { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: true },//isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
                     //{ name: "Based", display: "Based", type: "select", ctrlAttr: { maxlength: 100, onchange: "" }, ctrlOptions: { 0: "IATA", 1: "MARKET" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            //uniqueindex = $('#tblULDRate').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
            //prevrowuniqueindex = $('#tblULDRate').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
            if ($("#divSlabtitle").length > 0)
                $("#divSlabtitle").remove();
            $("#tblRateBase thead tr:eq(0) td").append('<span id="divSlabtitle"> &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:black">Slab Title :</span>&nbsp;&nbsp;<span id="slabtitle"></span></span>')
            
            $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
                //debugger;
                $("#slabtitle").text($("[id='tblRateBase_SlabTitle_1']").val());
                if (userContext.SysSetting.EnableSlabOnRate == "True") {
                   
                    $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", false);
                    $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", true);

                    $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", false);
                    $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", true);

                    $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", false);
                    $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", true);
                }
                else {
                   
                    $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
                    $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

                    $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
                    $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

                    $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
                    $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);
                }

            });
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            $("#slabtitle").text($("[id='tblRateBase_SlabTitle_1']").val())
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: pageType == "DUPLICATE" || pageType == "NEW" ? false : true }
    });
    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        //debugger;
        if (userContext.SysSetting.EnableSlabOnRate == "True") {
            $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", false);
            $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", true);

            $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", false);
            $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", true);

            $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", false);
            $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", true);
        }
        else {
            $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
            $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

            $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
            $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

            $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
            $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").val("");
            $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");

            $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
            $(tr).find("input[id^='tblRateBase_Rate_']").val("");
        }
        $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblRateBase_RateClassSNo_']").attr("data-valid", "required");

        $(tr).find("input[id^='_temptblRateBase_Rate_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblRateBase_Rate_']").attr("data-valid", "required");
    });
    // commented by arman for delete button
    // $('#tblRateBase button.insert,#tblRateBase button.remove').hide();//#tblRateBase button.moveUp,#tblRateBase button.moveDown
    // Buttons at footer row

    $('#tblRateBase button.append').hide();
    //========================================= added by arman ali [id*= 'tblRateBase_Delete_']
    //  $('#tblRateBase_Delete_1,#tblRateBase_Delete_2,#tblRateBase_Delete_3').remove();
    $("#tblRateBase_btnRemoveLast").unbind("click").bind("click", function () {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

            var table = document.getElementById("tblRateBase");
            if (table != null && table.rows.length > 1) {
                // $('#tblRateBase  tbody  tr').each(function (row, tr) {
                var id = table.rows.length;
                var valid = id - 3;
                if (valid > 1) {
                    $('#tblRateBase_Row_' + valid).remove();
                    ShowMessage('success', 'Success', "Row Deleted Successfully!", "bottom-right");

                }

                // });
            }
        }

    });
    $("[id *='tblRateBase_Delete_']").unbind("click").bind("click", function () {

        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            var table = document.getElementById("tblRateBase");
            var rowno = (this.id).split('_')[2];
            if (table != null && table.rows.length > 1) {
                // $('#tblRateBase  tbody  tr').each(function (row, tr) {
                var id = table.rows.length;
                var valid = id - 3;
                if (valid > 1) {
                    $('#tblRateBase_Row_' + rowno).remove();
                    ShowMessage('success', 'Success', "Row Deleted Successfully!", "bottom-right");
                }
            }
        }
    });


}


function CreateULDSlabGrid() {
    // debugger;
    //$("#divULDRate").ctrlCss("display", "block");
    var dbtableName = "ULDRate";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType == "READ" || pageType == "DELETE" ? false : true,
        masterTableSNo: $("#hdnRateSNo").val() || 1, //$("#hdnRateSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/RateService.svc",
        getRecordServiceMethod: "GetULDRate",
        deleteServiceMethod: "",
        caption: "ULD Rate Slab Information",
        initRows: 1,
        columns: [
                    { name: "SNo", type: "hidden" },
                  //{ name: "SLABName", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 25, }, ctrlCss: { width: '100px' }, ctrlAttr: { controltype: 'alphanumericupper' }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                    { name: 'ULDSNo', display: 'ULD Type', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: 'return GetULDMinimumCWt(this.id);' }, ctrlCss: { width: '150px', height: '20px' }, onChange: 'return GetULDMinimumCWt(this.id);', isRequired: true, AutoCompleteName: 'Rate_rate_ULDTypeName', filterField: "ULDName", filterCriteria: "contains" },
                    { name: 'RateClassCode', display: 'Rate Class Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: false, AutoCompleteName: 'Rate_rate_RateClassCodeName', filterField: "RateClassCode", filterCriteria: "contains" },
                    { name: 'RateClassSNo', display: 'Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: 'return GetULDMinimumCWt(this.id);', isRequired: true, AutoCompleteName: 'Rate_rate_RateClassCode', filterField: "RateClassCode", filterCriteria: "contains" },
                    { name: "UldMinChWT", display: "Pivot Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal2" : "label", onblur: "return GetULDMinimumGrossWT(this.id);" }, ctrlCss: { width: "50px" }, onChange: 'return GetULDMinimumGrossWT(this.id);', isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },   // made this field required by arman ali 2017-05-15
                      { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal2" : "", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },

               //  { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal2" : "", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            $("tr[id^='tblULDRate_Row']").each(function (row, tr) {
                $(tr).find("input[id^='tblULDRate_UldMinChWT_']").attr("disabled", false);  // true to false by arman ali
                $(tr).find("input[id^='tblULDRate_UldMinChWT_']").attr("enabled", true);  // false to true by arman ali
                //if ($("tr[id^='tblULDRate_Row']").length > 0) {
                $(tr).find("input[id^='tblULDRate_SLABName_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblULDRate_SLABName_']").attr("width", "100px");
                $(tr).find("input[id^='tblULDRate_HdnULDSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblULDRate_ULDSNo_']").attr("data-valid", "required");

                $(tr).find("input[id^='tblULDRate_HdnRateClassSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblULDRate_UldMinChWT_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblULDRate_RateClassSNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblULDRate_HdnRateClassSNo_']").attr("width", "150px");
                $(tr).find("input[id^='tblULDRate_RateClassSNo_']").attr("width", "150px");

                $(tr).find("input[id^='_temptblULDRate_Rate_']").attr("data-valid", "min[0.01],required");
                $(tr).find("input[id^='tblULDRate_Rate_']").attr("data-valid", "min[0.01],required");



                $(tr).find("input[id^='tblULDRate_SLABName_']").on("contextmenu", function (e) {
                    alert('Right click disabled');
                    return false;
                });

                $(tr).find("input[id^='tblULDRate_SLABName_']").on('drop', function () {
                    return false;
                });
                //}
            });
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType || "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: pageType == "DUPLICATE" || pageType == "NEW" || pageType || "EDIT" ? false : true }
    });
    // ADDED BY ARMAN ALI DATE ;2017-06-02 FUNCTIONALITY FOR DELETE BUTTON IN ULD SLAB
    //if (pageType == "READ" || pageType == "DELETE") {
    //    $("#tblULDRate_btnRemoveLast").remove();
    //    $("[id *='tblULDRate_Delete_']").remove();
    //}
    $("#tblULDRate_btnRemoveLast").unbind("click").bind("click", function () {
        // if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        var table = document.getElementById("tblULDRate");
        if (table != null && table.rows.length > 1) {

            var id = table.rows.length;

            $('#tblULDRate_Row_' + (parseInt(id) - 3)).remove();
            ShowMessage('success', 'Success', "Row Deleted Successfully!", "bottom-right");

        }

        // });
        //   }


    });
    $("[id *='tblULDRate_Delete_']").unbind("click").bind("click", function () {


        var table = document.getElementById("tblRateBase");
        var rowno = (this.id).split('_')[2];
        if (table != null && table.rows.length > 1) {

            var id = table.rows.length;

            $('#tblULDRate_Row_' + rowno).remove();
            ShowMessage('success', 'Success', "Row Deleted Successfully!", "bottom-right");

        }
    });
    // END HERE 
}
function GetULDMinimumCWt(input) {
    input = input.attr('id');  // added by arman ali date : 2017-07-10
    $("#" + input.replace("ULDSNo", "UldMinChWT")).val('');// clear pivot weight on uld type change date : 17-05-2017  Arman Ali 

    var ClosestTr = $("#" + input).closest("tr")
    var ULDSNo = ClosestTr.find("input[id^='tblULDRate_HdnULDSNo_'").val();
    var AirlineSNo = $('#RAirlineSNo').val();
    var ULDType = $("#" + input).val().substring(0, 1);
    if ($('#Text_RAirlineSNo').val() == "") {
        ShowMessage('warning', 'warning - Rate', "Select Airline First ", "bottom-right");
        $("#" + input).val("");
        return false;
    }
    else {
        $.ajax({
            url: "Services/Rate/RateService.svc/GetULDClassMinimumCWt?ClassCodeSNo=" + ULDSNo + "&AirlineSNo=" + AirlineSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "" || result != null || result != "undefined") {

                    var ResultData = jQuery.parseJSON(result);
                    if (ResultData.Table0.length > 0) {
                        if (ResultData.Table0[0].GrossWeight <= 0) {
                            ClosestTr.find("input[id^='tblULDRate_UldMinChWT_'").val('');
                        }
                        else
                            ClosestTr.find("input[id^='tblULDRate_UldMinChWT_'").val(ResultData.Table0[0].GrossWeight);
                        ClosestTr.find("input[id^='_temptblULDRate_UldMinChWT_'").val(ResultData.Table0[0].GrossWeight); // by arman for temp field


                        ClosestTr.find("input[id^='tblULDRate_RateClassCode_'").val(ResultData.Table0[0].RateClassCode);
                        ClosestTr.find("input[id^='tblULDRate_HdnRateClassCode_'").val(ResultData.Table0[0].HdnRateClassSNo);

                        // added by arman for pivot weight
                        var RNo = input.split('_')[2];
                        var PivotWeight = parseFloat($("#tblULDRate_UldMinChWT_" + RNo).val());
                        var ULDTypeSNo = $('#tblULDRate_HdnULDSNo_' + RNo).val();
                        var AllExe = ''
                        $('#tblULDRate tr[id^="tblULDRate_Row_"]').each(function () {
                            var RowNo = this.id.split('_')[2];
                            if ($('#tblULDRate_HdnULDSNo_' + RowNo).val() == ULDTypeSNo && this.id != 'tblULDRate_Row_' + RNo && parseFloat($('#tblULDRate_UldMinChWT_' + RowNo).val()) != PivotWeight) {
                                $('#_temptblULDRate_UldMinChWT_' + RNo).select();
                                return false;
                            }
                            // }
                        });
                        // }

                    }
                }
            }
        });
    }

}
function SaveRateAirlineMaster(input) {
    //if (ValidaveBeforeSave() == false) { return;}
    //$("#btnSaveRateMaster").hide();
    var RateRemarksarray = [];
    var RateSLABInfoarray = [];
    var RateULDSLABInfoArray = [];
    var RateParamArray = [];
    var RateViewModel = {
        SNo: $("#hdnRateSNo").val() || 0,
        RateCardSNo: parseInt($("#RateCardSNo").val()) || 0,
        MailRatingCodeSNo: parseInt($("#MailRatingCodeSNo").val()) || 0,
        RAirlineSNo: parseInt($("#RAirlineSNo").val()) || 0,
        OfficeSNo: parseInt($("#OfficeSNo").val()) || 0,
        OriginType: parseInt($("#OriginType").val()) || 0,
        OriginSNo: parseInt($("#OriginSNo").val()) || 0,
        DestinationType: parseInt($("#DestinationType").val()) || 0,
        DestinationSNo: parseInt($("#DestinationSNo").val()) || 0,
        REFNo: $("#REFNo").val(),
        CurrencySNo: parseInt($("#CurrencySNo").val()) || 0,
        Active: parseInt($("#Active").val()) || 0,
        RateBaseSNo: parseInt($("#RateBaseSNo").val()) || 0,
        ValidFrom: $("#ValidFrom").val(),
        ValidTo: $("#ValidTo").val(),
        IsNextSLAB: $("#IsNextSLAB").prop('checked') == true ? 1 : 0,
        Tax: $("#Tax").val() || 0.0,
        UOMSNo: parseInt($("input[name=UOMSNo]:checked").val()) || 0,
        FlightTypeSNo: parseInt($("#FlightTypeSNo").val()) || 0,
        RateTypeSNo: parseInt($("#RateTypeSNo").val()) || 0,
        AllotmentSNo: parseInt($("#AllotmentSNo").val()) || 0,
        //TransitStationSNo: $("#TransitStationSNo").val(),
        Remark: null,
        IsCommissionable: $("#IsCommissionable").prop('checked') == true ? 1 : 0,
    }
    //Ratearray.push(RateViewModel);
    //var RateRemarks = $("#tblRemarks").serializeToJSON();
    $("tr[id^='tblRemarks_Row']").each(function (row, tr) {
        var RateRemarksViewModel = {
            SNo: 0,
            RateSNo: 0,
            Remarks: $(tr).find("input[id^='tblRemarks_Remarks_']").val()
        }
        RateRemarksarray.push(RateRemarksViewModel);

    });


    //var RateSLABInfo = $("#tblRateBase").serializeToJSON();
    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        var RateSLABViewModel = {
            SNo: $(tr).find("input[id^='tblRateBase_SNo_']").val(),
            SlabSNo: $(tr).find("input[id^='tblRateBase_SNo_']").val(),
            RateSNo: $("#hdnRateSNo").val() || 0,
            SlabName: $(tr).find("input[id^='tblRateBase_SlabName_']").val() || 0,
            RateClassSNo: $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").val(),
            Text_RateClassSNo: "",
            StartWt: $(tr).find("input[id^='tblRateBase_StartWt_']").val() || 0,
            EndWt: $(tr).find("input[id^='tblRateBase_EndWt_']").val() || 0,
            Rate: $(tr).find("input[id^='_temptblRateBase_Rate_']").val() || 0,
            Based: null,
            HdnRateClassSNo: $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").val()
        }
        RateSLABInfoarray.push(RateSLABViewModel);
    });
    //var RateULDSLABInfo = $("#tblULDRate").serializeToJSON();

    $("tr[id^='tblULDRate_Row']").each(function (row, tr) {
        var RateULDSLABViewModel = {
            SNo: 0,
            ULDSNo: $(tr).find("input[id^='tblULDRate_HdnULDSNo_']").val(),
            HdnULDSNo: $(tr).find("input[id^='tblULDRate_HdnULDSNo_']").val(),
            HdnRateClassCodeSNo: $(tr).find("input[id^='tblULDRate_HdnRateClassCode_']").val(),
            HdnRateClassCode: $(tr).find("input[id^='tblULDRate_HdnRateClassCode_']").val(),
            Text_RateClassCode: $(tr).find("input[id^='tblULDRate_RateClassCode_']").val(),
            SlabSNo: 0,
            RateSNo: $("#hdnRateSNo").val() || 0,
            SLABName: null,//$(tr).find("input[id^='tblULDRate_SLABName_']").val(),
            RateClassSNo: $(tr).find("input[id^='tblULDRate_HdnRateClassSNo_']").val(),
            Text_RateClassSNo: "",
            StartWt: 0.000, //$(tr).find("input[id^='tblULDRate_StartWt_']").val(),
            EndWt: 0,
            UldMinChWT: $(tr).find("input[id^='tblULDRate_UldMinChWT_']").val(),
            Rate: $(tr).find("input[id^='_temptblULDRate_Rate_']").val() || 0,
            HdnRateClassSNo: $(tr).find("input[id^='tblULDRate_HdnRateClassSNo_']").val(),
            // Based: 0,
        }
        RateULDSLABInfoArray.push(RateULDSLABViewModel);
    });

    //var RateBaseParam = $("#tblRateParam").serializeToJSON();
    var SelectedDays = "";

    $("input[type='checkbox'][id^='Days']").each(function () {

        if ($("input[name='Days'][value=0]:checked").val()) {
            SelectedDays = "0,1,2,3,4,5,6,7";
        }
        else {
            if ($("input[name='Days'][value=0]:checked").val() == undefined) {
                //var chkLen = $("input[name='Days']:checked").length;

                var days = [];
                $("input[name='Days']:checked").each(function (item) {
                    days.push(this.value);
                });
                SelectedDays = days.join(',');
            }
        }
    });
    var RateParamViewModel = {
        SNo: 0,
        RateSNo: $("#hdnRateSNo").val() || 0,
        AirlineSNo: $("#AirlineSNo").val() || $("input[id^='Multi_AirlineSNo']").val(),
        IsIncludeCarrier: $("input[name='IE']:checked").val(),
        IAirlineSNo: $("#IAirlineSNo").val() || $("input[id^='Multi_IAirlineSNo']").val(),
        IsIncludeICarrier: $("input[name='IE1']:checked").val(),
        FlightSNo: $("#FlightSNo").val() || $("input[id^='Multi_FlightSNo']").val(),
        IsIncludeFlight: $("input[name='IE2']:checked").val(),
        Days: SelectedDays,
        IsIncludeDays: $("input[name='IE3']:checked").val(),
        StartTime: $("#StartTime").val(),
        EndTime: $("#EndTime").val(),
        IsIncludeETD: $("input[name='IE100']:checked").val(),
        TransitStationsSNo: $("#TransitStationsSNo").val() || $("input[id^='Multi_TransitStationsSNo']").val(),
        IsIncludeTransitStations: $("input[name='IE4']:checked").val(),
        AccountSNo: $("#AccountSNo").val() || $("input[id^='Multi_AccountSNo']").val(),
        IsIncludeAccount: $("input[name='IE5']:checked").val(),
        ShipperSNo: $("#ShipperSNo").val() || $("input[id^='Multi_ShipperSNo']").val(),
        IsIncludeShipper: $("input[name='IE6']:checked").val(),
        CommoditySNo: $("#CommoditySNo").val() || $("input[id^='Multi_CommoditySNo']").val(),
        IsIncludeCommodity: $("input[name='IE7']:checked").val(),
        ProductSNo: $("#ProductSNo").val() || $("input[id^='Multi_ProductSNo']").val(),
        IsIncludeProduct: $("input[name='IE8']:checked").val(),
        SHCSNo: $("#SHCSNo").val() || $("input[id^='Multi_SHCSNo']").val(),
        IsIncludeSHC: $("input[name='IE9']:checked").val(),
        AgentGroupSNo: $("#AccountGroupSNo").val() || $("input[id^='Multi_AccountGroupSNo']").val(),
        IsIncludeAgentGroup: $("input[name='IE11']:checked").val(),
        SHCGroupSNo: $("#SHCGroupSNo").val() || $("input[id^='Multi_SHCGroupSNo']").val(),
        IsIncludeSHCGroup: $("input[name='IE10']:checked").val(),
    }
    // RateParam.push(RateParamViewModel);


    try {
        if ($("tr[id^='tblRateBase_Row']").length == 0 && ($("tr[id^='tblULDRate_Row']").length == 0)) {
            ShowMessage('warning', 'warning - Rate', "Please Add Any One (Loose Cargo Rate or ULD Rate )", "bottom-right");
            return false;
        }

        var IsULDCheck = $("#IsULDRateSlab").prop('checked') == true ? 1 : 0
        //if ($("tr[id^='tblRateBase_Row']").length > 0) {
        $.ajax({
            url: "Services/Rate/RateService.svc/SaveRateDetais", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RateSNo: $("#hdnRateSNo").val() || 0, action: input, RateInfo: RateViewModel, RateRemarks: RateRemarksarray, RateSLABInfoarray: RateSLABInfoarray, RateULDSLABInfoArray: RateULDSLABInfoArray, RateParamList: RateParamViewModel, IsULDCheck: IsULDCheck }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != null && result != "") {
                    var MsgTable = jQuery.parseJSON(result);
                    var MsgData = MsgTable.Table0;
                    if (MsgData[0].ErrorNo.split('?')[0] == "0") {
                        if ($("input[type='submit'][name='operation'][value='Save']").length > 0) {
                            $("input[type='submit'][name='operation'][value='Save']").click();
                        }
                        else {
                            $("input[type='submit'][name='operation'][value='Update']").click(); // Saved message comming from Management WebUI
                        }
                    }
                    else if (MsgData[0].ErrorNo.split('?')[0] == "1") {
                        ShowMessage('warning', 'warning - Rate', "'" + MsgData[0].ErrorMessage + "'", "bottom-right");
                        //e.preventDefault();
                    }
                    else if (MsgData[0].ErrorNo.split('?')[0] == "89") {
                        ShowMessage('warning', 'warning - Rate', "'" + MsgData[0].ErrorMessage + "'", "bottom-right");
                        //e.preventDefault();
                    }
                    else if (MsgData[0].ErrorNo.split('?')[0] == "23") {
                        ShowMessage('warning', 'warning - Rate', "'" + MsgData[0].ErrorMessage + "'", "bottom-right");

                    }
                    else if (MsgData[0].ErrorMessage == "Reference Number already exists.,") {
                        ShowMessage('warning', 'warning - Rate', "'" + MsgData[0].ErrorMessage + "'", "bottom-right");
                    }
                    else if (MsgData[0].ErrorMessage == "Record Already Exist For Given Parameters") {
                        ShowMessage('warning', 'warning - Rate', "'" + MsgData[0].ErrorMessage + "'", "bottom-right");
                    }
                    else {
                        ShowMessage('warning', 'warning - Rate', "unable to process", "bottom-right");
                        $("#btnSaveRateMaster").show();
                    }

                }
                else {

                }
            }

        });
        //}
        //else {
        //    ShowMessage('warning', 'warning - Rate', "SLAB can not blank.Kindly add SLAB.", "bottom-right");
        //    $("#btnSaveRateMaster").show();

        //}
    }
    catch (ex) {
        ShowMessage('warning', 'warning - Rate', "Unable to process.", "bottom-right");
        return;
    }
}
/*----Code by Pankaj Kumar Ishwar on 26-04-2018 in case of Expired----*/
if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
    var status = $("#Active").val();
    if (status == "3") {
        $('input[value="Edit"]').remove();
        $('input[value="Delete"]').remove();
    }
}


function OnSuccessGrid() {
    $("table[class='k-focusable k-selectable']").find("tr").each(function (row, tr) {
        var Status = $(tr).find("td[data-column='Active'] span").attr("title");
        $(this).unbind("click").bind("click", function () {
            if ($(tr).find("td[data-column='Active'] span").attr("title").toUpperCase() == "EXPIRED") {
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "none");
                    }
                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "none");
                    }
                });
            }
            if ($(tr).find("td[data-column='Active'] span").attr("title").toUpperCase() == "ACTIVE") {
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "");
                    }
                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "");
                    }
                });
            }
            if ($(tr).find("td[data-column='Active'] span").attr("title").toUpperCase() == "DRAFT") {
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "");
                    }
                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "");
                    }
                });
            }
            if ($(tr).find("td[data-column='Active'] span").attr("title").toUpperCase() == "INACTIVE") {
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "");
                    }
                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "");
                    }
                });
            }
        });
    });
    // $(tr).find('div[id$="user-options"]').remove();
    //$(tr).find("input[type='radio']").attr("checked", true);
    //$(tr).find('td:first input[name^="faction"]').each(function () {
    //    $(this).prop('checked', false);
    //});
    //$(tr).find("input[name^='faction']").parent().unbind("click").bind("click", function ()
    //{
    //    return false;
    //});
}
/*---------------------------------------------------------------------------------------------------------*/

function CreateRateParamGrid() {
    //debugger;    
    var dbtableName = "RateParam";
    $.ajax({
        url: "HtmlFiles/Rate/RateConditions.html", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tbl" + dbtableName).html(result);
            cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Rate_rate_AirlineName", null, "contains", ",");
            cfi.AutoCompleteV2("IAirlineSNo", "CarrierCode,AirlineName", "Rate_rate_AirlineName", null, "contains", ",");
            cfi.AutoCompleteV2("FlightSNo", "FlightNo", "Rate_rate_FlightName", null, "contains", ",");
            // cfi.AutoComplete("WeekDay", "ShortWeekDay", "WeekDays", "SNo", "ShortWeekDay", ["ShortWeekDay"], null, "contains", ",");
            cfi.AutoCompleteV2("TransitStationsSNo", "AirportCode,AirportName", "Rate_rate_TransitStation", null, "contains", ",");
            cfi.AutoCompleteV2("AccountSNo", "AgentName", "Rate_rate_RateAgentName", null, "contains", ",");
            // cfi.AutoComplete("ShipperSNo", "AgentName", "vw_RateAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
            cfi.AutoCompleteV2("ShipperSNo", "AgentName", "Rate_rate_AgentName", null, "contains", ",");
            // cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains", ",");
            cfi.AutoCompleteV2("CommoditySNo", "CommodityCode,CommodityDescription", "Rate_rate_CommodityName", null, "contains", ",");
            cfi.AutoCompleteV2("ProductSNo", "ProductName", "Rate_rate_ProductName", null, "contains", ",");
            cfi.AutoCompleteV2("SHCSNo", "Name", "Rate_rate_SPHCName", null, "contains", ",", null, null, null, null);
            cfi.AutoCompleteV2("SHCGroupSNo", "Name", "Rate_SPHCCode", null, "contains", ",", null, null, null, null);
            //  cfi.AutoComplete("SHCSNo", "Code,Description", "SPHC", "SNo", "Code@", ["Code", "Description"], null, "contains", ",");
            cfi.AutoCompleteV2("AccountGroupSNo", "AgentGroupName", "Rate_rate_AgentGroupName", null, "contains", ",");
            if (getQueryStringValue("FormAction").toUpperCase() != "READ" && getQueryStringValue("FormAction").toUpperCase() != "DELETE") {
                $('[id^="StartTime"]').kendoTimePicker({
                    format: "HH", interval: 60
                });
                //$('[id^="StartTime"]').kendoTimePicker({ timeFormat: 'h' }); 
                $('[id^="EndTime"]').kendoTimePicker({
                    format: "HH", interval: 60
                });

                $("input[id^=StartTime]").change(function (e) {
                    checkETD(this);
                });
                $("input[id^=EndTime]").change(function (e) {
                    checkETD(this);

                });
            }

            $("span[class='k-widget k-timepicker k-header']").removeAttr("style");
            $("span[class='k-widget k-timepicker k-header']").attr("style", "width: 85px; height: 30px;");
            //======by arman 15-05-2017 for alll days in new case
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                $('[type="checkbox"][id="Days"]').attr('checked', 'checked');
            }
            //=============end here
            $('input[type=radio][name^=IE][value=0]').each(function () {
                $('input[type=radio][name^=IE][value=0]').attr('checked', true);
                //$('input[type=radio][name^=IE][value=1]').removeAttr('checked');
            });
            // $("#btnSave").unbind("click").bind("click", function () {
            $("input[type='checkbox'][id^='Days']").each(function () {
                // debugger;
                $(this).click(function () {
                    if ($(this).val() == "0") {
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']").attr("checked", $(this).is(":checked"));
                    }
                    else {
                        if (!$(this).is(":checked")) {
                            $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", $(this).is(":checked"));
                        }
                        else {
                            var checked = true;
                            $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:gt(0)").each(function () {
                                if (checked)
                                    checked = $(this).is(":checked");
                                if (!checked)
                                    return false;
                            });
                            if (checked) {
                                $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", checked);
                            }
                        }
                    }
                });
            });

            if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {

                var CurrentRateSno = $("#hdnRateSNo").val();
                $.ajax({
                    url: "Services/Rate/RateService.svc/GetRateParameter?RateSNo=" + CurrentRateSno, async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    //data: JSON.stringify({ RateSNo: CurrentRateSno }),
                    //contentType: "application/json; charset=utf-8",
                    success: function (result) {

                        var ArrayData = jQuery.parseJSON(result);
                        var Array = ArrayData.Table0;
                        if (Array.length > 0) {
                            cfi.BindMultiValue("AirlineSNo", Array[0].Text_AirlineSNo, Array[0].AirlineSNo);
                            $("#AirlineSNo").val(Array[0].AirlineSNo);
                            $("input[type=radio][name=IE][value=" + Array[0].IsIncludeCarrier + "]").attr('checked', 1);

                            cfi.BindMultiValue("IAirlineSNo", Array[0].Text_IAirlineSNo, Array[0].IAirlineSNo);
                            $("#IAirlineSNo").val(Array[0].IAirlineSNo);
                            $("input[type=radio][name=IE1][value=" + Array[0].IsIncludeICarrier + "]").attr('checked', 1);

                            cfi.BindMultiValue("FlightSNo", Array[0].Text_FlightSNo, Array[0].FlightSNo);
                            $("#FlightSNo").val(Array[0].FlightSNo);
                            $("input[type=radio][name=IE2][value=" + Array[0].IsIncludeFlight + "]").attr('checked', 1);

                            $("input[type=radio][name=IE3][value=" + Array[0].IsIncludeDays + "]").attr('checked', 1);
                            $("#StartTime").val(Array[0].StartTime);
                            $("#EndTime").val(Array[0].EndTime);

                            var Days = [];
                            Days = Array[0].Days;
                            for (var i = 0; i < 20; i++) {
                                $("input[type='checkbox'][value^='" + Days[i] + "']").attr("checked", 1);
                            }
                            $("input[type=radio][name=IE100][value=" + Array[0].IsIncludeETD + "]").attr('checked', 1);

                            cfi.BindMultiValue("TransitStationsSNo", Array[0].Text_TransitStationsSNo, Array[0].TransitStationsSNo);
                            $("#TransitStationsSNo").val(Array[0].TransitStationsSNo);
                            $("input[type=radio][name=IE4][value=" + Array[0].IsIncludeTransitStations + "]").attr('checked', 1);

                            cfi.BindMultiValue("AccountGroupSNo", Array[0].Text_AGentGroupSNo, Array[0].AGentGroupSNo);
                            $("#AccountGroupSNo").val(Array[0].AGentGroupSNo);
                            $("input[type=radio][name=IE11][value=" + Array[0].IsIncludeAgentGroup + "]").attr('checked', 1);

                            cfi.BindMultiValue("AccountSNo", Array[0].Text_AccountSNo, Array[0].AccountSNo);
                            $("#AccountSNo").val(Array[0].AccountSNo);
                            $("input[type=radio][name=IE5][value=" + Array[0].IsIncludeAccount + "]").attr('checked', 1);

                            cfi.BindMultiValue("ShipperSNo", Array[0].Text_ShipperSNo, Array[0].ShipperSNo);
                            $("#ShipperSNo").val(Array[0].ShipperSNo);
                            $("input[type=radio][name=IE6][value=" + Array[0].IsIncludeShipper + "]").attr('checked', 1);

                            cfi.BindMultiValue("CommoditySNo", Array[0].Text_CommoditySNo, Array[0].CommoditySNo);
                            $("#CommoditySNo").val(Array[0].CommoditySNo);
                            $("input[type=radio][name=IE7][value=" + Array[0].IsIncludeCommodity + "]").attr('checked', 1);

                            cfi.BindMultiValue("ProductSNo", Array[0].Text_ProductSNo, Array[0].ProductSNo);
                            $("#ProductSNo").val(Array[0].ProductSNo);
                            $("input[type=radio][name=IE8][value=" + Array[0].IsIncludeProduct + "]").attr('checked', 1);

                            cfi.BindMultiValue("SHCSNo", Array[0].Text_SHCSNo, Array[0].SHCSNo);
                            $("#SHCSNo").val(Array[0].SHCSNo);
                            $("input[type=radio][name=IE9][value=" + Array[0].IsIncludeSHC + "]").attr('checked', 1);
                            //-----------------------------------------Added By Preeti deep (26-Dec-2017)----------------------------------------------
                            cfi.BindMultiValue("SHCGroupSNo", Array[0].Text_SHCGroupSNo, Array[0].SPHCCodeSNo);
                            $("#SHCGroupSNo").val(Array[0].SPHCCodeSNo);
                            $("input[type=radio][name=IE10][value=" + Array[0].IsIncludeSHCCode + "]").attr('checked', 1);
                            //---------------------------------------------------------------------------------------------------------------------------
                            flag = 1;
                            OnSelectOffice();  // run this method for edit case only one tome on page load
                            flag = 0;
                            agentOnAllotemnt();
                            // by arman 
                        }
                    }
                });

                if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                    UserSubProcessRightswithoutsubprocess("divRateParam", true);
                }

            }
            AuditLogBindOldValue('tblRateParam');
        }


    });


    // $("#tbl" + dbtableName).css("border", "1px");


}
function checkETD(input) {




    var StartTime = $("#StartTime").val();
    var EndTime = $("#EndTime").val();
    if (StartTime != "" && EndTime != "") {
        if (EndTime <= StartTime) {
            ShowMessage('warning', 'Warning - Rate', 'End Time can not be less than or equal Start Time.', "bottom-right");
            $("#EndTime").val("");
        }
    }
}

function ExtraCondition(textId) {


    var filterAirlineSNo = cfi.getFilter("AND");
    var filterIAirlineSNo = cfi.getFilter("AND");
    var filterFlightSNo = cfi.getFilter("AND");
    var filterTransitStationsSNo = cfi.getFilter("AND");
    var filterAccountSNo = cfi.getFilter("AND");
    var filterShipperSNo = cfi.getFilter("AND");
    var filterCommoditySNo = cfi.getFilter("AND");
    var filterProductSNo = cfi.getFilter("AND");
    var filterSHCSNo = cfi.getFilter("AND");
    var filterRAirlineSNo = cfi.getFilter("AND");
    var filterClass = cfi.getFilter("AND");
    var FilterOffice = cfi.getFilter("AND");
    var FilterAgentGroup = cfi.getFilter("AND");


    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNO", "notin", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter1, "IsActive", "eq", 1);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    else if (textId.indexOf("Text_RAirlineSNo") >= 0) {

        var filter1 = cfi.getFilter("AND");
        if ($("#Text_RateTypeSNo").val().trim() == "") {
            ShowMessage('warning', 'Warning - Rate', 'Please Select Rate Type First.', "bottom-right");
            $("#Text_RAirlineSNo").val("");
            cfi.setFilter(filter1, "sno", "eq", 0);
            filterRAirlineSNo = cfi.autoCompleteFilter(filter1);
            return filterRAirlineSNo;

        }
        // cfi.setFilter(filter1, "SNO", "notin", $("#Text_RAirlineSNo").data("kendoAutoComplete").key());
        if ($("#Text_RateTypeSNo").val().toUpperCase().match(/SPA.*/))
            cfi.setFilter(filter1, "IsInterline", "eq", 1);
        else
            cfi.setFilter(filter1, "IsInterline", "eq", 0);
        cfi.setFilter(filter1, "IsActive", "eq", 1);
        filterRAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterRAirlineSNo;
    }
    else if (textId.indexOf("Text_IAirlineSNo") >= 0) {
        var filter2 = cfi.getFilter("AND");
        if ($("#RAirlineSNo").val().trim() == "") {
            ShowMessage('warning', 'Warning - Rate', 'Please Select Airline First.', "bottom-right");
            return true
        }
        else {
            cfi.setFilter(filter2, "SNO", "notin", $("#Text_IAirlineSNo").data("kendoAutoComplete").key());
            cfi.setFilter(filter2, "SNO", "notin", $("#Text_RAirlineSNo").data("kendoAutoComplete").key());
            cfi.setFilter(filter2, "IsActive", "eq", 1);
            if (userContext.SysSetting.EnableAllAirlinesAsIssueCarrier.toUpperCase() != 'TRUE'){
                if ($('#IsInterlineval').val() == "0")
                    cfi.setFilter(filter2, "IsInterline", "eq", 1);
                else
                    cfi.setFilter(filter2, "IsInterline", "eq", 0);
            }
            filterIAirlineSNo = cfi.autoCompleteFilter(filter2);
            return filterIAirlineSNo;
        }
    }
    else if (textId.indexOf("Text_FlightSNo") >= 0) {
        var filter3 = cfi.getFilter("AND");
        cfi.setFilter(filter3, "FlightNo", "notin", $("#Text_FlightSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter3, "IsActive", "eq", 1);
        cfi.setFilter(filter3, "AirlineSNo", "eq", $("#RAirlineSNo").val());  // added by Arman for flight of selected Airline
        filterFlightSNo = cfi.autoCompleteFilter(filter3);
        return filterFlightSNo;
    } else if (textId.indexOf("Text_TransitStationsSNo") >= 0) {
        var filter4 = cfi.getFilter("AND");
        cfi.setFilter(filter4, "SNO", "notin", $("#Text_TransitStationsSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter4, "IsActive", "eq", 1);
        filterTransitStationsSNo = cfi.autoCompleteFilter(filter4);
        return filterTransitStationsSNo;
    }
    else if (textId.indexOf("Text_AccountSNo") >= 0) {

        // addeed by arman ali for agent based on OD pair  date = 9-5-2017
        var Origin = $("#Text_OriginType").val().toUpperCase();
        var Destination = $("#Text_DestinationType").val().toUpperCase();
        var filter5 = cfi.getFilter("AND");
        cfi.setFilter(filter5, "SNO", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key());
        //  cfi.setFilter(filter5, "AccountTypeName", "eq", "FORWARDER");
        cfi.setFilter(filter5, Origin + "SNO", "in", $("#OriginSNo").val());
        filterAccountSNo = cfi.autoCompleteFilter(filter5);
        return filterAccountSNo;
        //============end here 
    }
    else if (textId.indexOf("Text_ShipperSNo") >= 0) {
        var filter6 = cfi.getFilter("AND");
        cfi.setFilter(filter6, "SNO", "notin", $("#Text_ShipperSNo").data("kendoAutoComplete").key());
        //cfi.setFilter(filter6, "AccountTypeSNo", "eq", 66);
        cfi.setFilter(filter6, "AccountTypeName", "eq", "SHIPPER");
        filterShipperSNo = cfi.autoCompleteFilter(filter6);
        return filterShipperSNo;
    }
    else if (textId.indexOf("Text_CommoditySNo") >= 0) {
        var filter7 = cfi.getFilter("AND");
        cfi.setFilter(filter7, "SNO", "notin", $("#Text_CommoditySNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter7, "IsActive", "eq", 1);
        filterCommoditySNo = cfi.autoCompleteFilter(filter7);
        return filterCommoditySNo;
    }
    else if (textId.indexOf("Text_ProductSNo") >= 0) {
        var filter8 = cfi.getFilter("AND");
        cfi.setFilter(filter8, "SNO", "notin", $("#Text_ProductSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter8, "IsActive", "eq", 1);
        filterProductSNo = cfi.autoCompleteFilter(filter8);
        return filterProductSNo;
    }
    if (textId.indexOf("Text_SHCSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "SNO", "notin", $("#Text_SHCSNo").data("kendoAutoComplete").key());
        //   cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    //-------------------Preeti Deep(26-Dec-2016)-----------------------------------------------------------
    if (textId.indexOf("Text_SHCGroupSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "SNO", "notin", $("#Text_SHCGroupSNo").data("kendoAutoComplete").key());
        //   cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    //------------------------------------------------------------------------------------------------------
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "SNO", "notin", $("#Text_SHCSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    if (textId.indexOf("Text_OfficeSNo") >= 0) {

        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "IsActive", "eq", 1);
        FilterOffice = cfi.autoCompleteFilter(filter9);
        return FilterOffice;
    }
    //=== added by arman
    if (textId.indexOf("Text_AllotmentSNo") >= 0) {
        if ($("#RAirlineSNo").val() == "")
            ShowMessage('warning', 'Warning - Rate', ' Select Airline First', "bottom-right");
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "AirlineSNo", "eq", $('#RAirlineSNo').val());
        FilterOffice = cfi.autoCompleteFilter(filter9);
        return FilterOffice;
    }
    //===end
    //if ($("#Text_OriginType").val() == "City") {
    if (textId.indexOf("Text_AccountGroupSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "CitySNo", "eq", $('#OriginSNo').val());
        FilterAgentGroup = cfi.autoCompleteFilter(filter9);
        return FilterAgentGroup;
    }
    //}

    if (textId.indexOf("tblRateBase_RateClassSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "class", "in", "1,2");
        //======= added by arman date : 2017-07-07==============
        var RNo = textId.split('_')[2];
        var filterslab = ""
        if ($("tbody [id*='tblRateBase_Row_']").length < 2 && $('#tblRateBase tr:eq(2)').attr('id').split('_')[2] == RNo) {
            //if ($('#tblRateBase tr:eq(2)').attr('id').split('_')[2] == RNo) {
            filterslab = 'N-NORMAL RATE';
            cfi.setFilter(filter9, "RateClassCode", "in", filterslab);
        }
        else if (RNo == $('#tblRateBase tr:eq(2)').attr('id').split('_')[2] || RNo == $('#tblRateBase tr:eq(3)').attr('id').split('_')[2]) {
            var filterrow = ''
            //   else if ($('#tblRateBase tr:eq(3)').attr('id').split('_')[2] == RNo) {
            if (userContext.SysSetting.EnableSlabOnRate == "True") {
                filterslab = 'F-FLAT CHARGE,M-MINIMUM CHARGE,N-NORMAL RATE'
            }
            else {
                filterslab = 'M-MINIMUM CHARGE,N-NORMAL RATE'
            }
            cfi.setFilter(filter9, "RateClassCode", "in", filterslab);
        }
        else
            if (userContext.SysSetting.EnableSlabOnRate == "True") {
                cfi.setFilter(filter9, "RateClassCode", "notin", 'N-NORMAL RATE,M-MINIMUM CHARGE,QUANTITY RATE');
                // filterslab = 'F-FLAT,M-MINIMUM CHARGE,N-NORMAL RATE'
            }
            else {
                cfi.setFilter(filter9, "RateClassCode", "notin", 'N-NORMAL RATE,M-MINIMUM CHARGE,F-FLAT CHARGE');
            }
        //======end============================================

        $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
            var RateClass = $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val().substring(0, 1).toUpperCase();
            var RateClassName = $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val().toUpperCase();

            if (RateClass == "M") {
                cfi.setFilter(filter9, "RateClassCode", "notin", RateClassName);
            }
            else if (RateClass == "N") {
                cfi.setFilter(filter9, "RateClassCode", "notin", RateClassName);

            }
        });


        //cfi.setFilter(filter9, "IsActive", "eq", 1);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    // addeed by arman date 2017-31-05  for filter uldclass on basis of uldtype
    if (textId.indexOf("tblULDRate_RateClassSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");

        var RNo = textId.split('_')[2];
        var ULDTypeSNo = $('#tblULDRate_HdnULDSNo_' + RNo).val();
        var AllExe = ''
        $('#tblULDRate tr[id^="tblULDRate_Row_"]').each(function () {
            var RowNo = this.id.split('_')[2];
            if ($('#tblULDRate_HdnULDSNo_' + RowNo).val() == ULDTypeSNo && this.id != 'tblULDRate_Row_' + RNo) {
                AllExe = AllExe + ',' + $('#tblULDRate_HdnRateClassSNo_' + RowNo).val();
            }
        });
        cfi.setFilter(filter9, "class", "in", "3");
        cfi.setFilter(filter9, "SNo", "notin", AllExe);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    // end

    //================by arman for filter ULd type date : 17-05-2017
    if (textId.indexOf("tblULDRate_ULDSNo") >= 0) {

        var c
        var filteruldSNo = "";
        if ($("#RAirlineSNo").val() == "")
            ShowMessage('warning', 'Warning - Rate', ' Select Airline First', "bottom-right");
        var filter9 = cfi.getFilter("AND");
        var array = $('#tblULDRate_rowOrder').val().split(",");
        for (var count = 0; count < $('#tblULDRate_rowOrder').val().split(',').length; count++) {
            c = $("[id*='tblULDRate_HdnULDSNo_'][value=" + $("[id*=tblULDRate_HdnULDSNo_" + array[count] + "]").val() + "]").length;
            if (c >= 3) {
                filteruldSNo = filteruldSNo + $("#tblULDRate_HdnULDSNo_" + array[count]).val() + ","
            }
        }
        //alert(filteruldSNo);

        cfi.setFilter(filter9, "AirlineSNo", "in", $('#RAirlineSNo').val());
        cfi.setFilter(filter9, "SNo", "notin", filteruldSNo);
        filterSHCSNo = cfi.autoCompleteFilter(filter9);
        return filterSHCSNo;
    }
    //=============end

    var filterTransit = cfi.getFilter("AND");
    if (textId.indexOf("Text_TransitStationSNo") >= 0) {
        var addedValue = "";
        if (textId == "Text_TransitStationSNo") {
            addedValue = $('input[type="hidden"][id="TransitStationSNo"]').val();
        }
        else {
            addedValue = $('input[type="hidden"][id="' + textId.replace('Text_', '') + '"]').val();
        }
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", addedValue), cfi.autoCompleteFilter(textId);
    }
    ////-------- added by arman ali date : 2017-10-25-----
    if (textId.indexOf("Text_AccountGroupSNo") >= 0) {
        var filter9 = cfi.getFilter("AND");
        cfi.setFilter(filter9, "SNo", "notin", $('#AccountGroupSNo').val());
        FilterOffice = cfi.autoCompleteFilter(filter9);
        return FilterOffice;
    }
}



function ExtraParameters(id) {
    var param = [];
    if (id == "Text_RAirlineSNo" || id == "Text_IAirlineSNo") {
        //var UserSNo = $("#htmlkeysno").val() || userContext.UserSNo;
        var UserSNo = userContext.UserSNo;
        //var UserSNo = 0
        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
        //    UserSNo = userContext.UserSNo;
        //else
        //    UserSNo = $("#htmlkeysno").val();

        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}

//Disabled any div by Div ID 
function UserSubProcessRightswithoutsubprocess(container, isView) {
    //if view permission is true
    if (isView) {


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

                else {
                    if (ctrltype != "button") {
                        $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
                    }
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
    $("span[id=undefined]").hide();

}

//Added On 14-04-2017 
function ValidaveBeforeSave() {
    if ($("#RateCardSNo").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'RateCard Can Not Be Blank', "bottom-right");
        $("#Text_RateCardSNo").focus();
        return false;
    }
    if ($("#RateCardSNo").val() == "4") {
        if ($("#MailRatingCodeSNo").val() == "") {
            ShowMessage('warning', 'Warning - Rate', 'MailRatingCode Can Not Be Blank', "bottom-right");
            $("#Text_MailRatingCodeSNo").focus();
            return false;
        }
    }
    if ($("#RAirlineSNo").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Airline Can Not Be Blank', "bottom-right");
        $("#Text_RAirlineSNo").focus();
        return false;
    }
    if ($("#RateTypeSNo").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Rate Type Can Not Be Blank', "bottom-right");
        $("#Text_RateTypeSNo").focus();
        return false;
    }
    if ($("#RateTypeSNo").val() == "4") {
        if ($("#AllotmentSNo").val() == "") {
            ShowMessage('warning', 'Warning - Rate', 'Allotment Can Not Be Blank', "bottom-right");
            $("#Text_AllotmentSNo").focus();
            return false;
        }

    }
    if ($("#OriginType").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Origin Level Can Not Be Blank', "bottom-right");
        $("#Text_OriginType").focus();
        return false;
    }
    if ($("#OriginType").val() != "") {
        if ($("#OriginSNo").val() == "") {
            ShowMessage('warning', 'Warning - Rate', 'Origin Can Not Be Blank', "bottom-right");
            $("#Text_OriginSNo").focus();
            return false;
        }
    }
    if ($("#DestinationType").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Destination Level Can Not Be Blank', "bottom-right");
        $("#Text_DestinationType").focus();
        return false;
    }
    if ($("#DestinationType").val() != "") {
        if ($("#DestinationSNo").val() == "") {
            ShowMessage('warning', 'Warning - Rate', 'Destination Can Not Be Blank', "bottom-right");
            $("#Text_DestinationSNo").focus();
            return false;
        }
    }
    if ($("#ValidFrom").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Valid From Can Not Be Blank', "bottom-right");
        $("#ValidFrom").focus();
        return false;
    }
    if ($("#ValidTo").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Valid To Can Not Be Blank', "bottom-right");
        $("#ValidTo").focus();
        return false;
    }
    if ($("#Active").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Status Can Not Be Blank', "bottom-right");
        $("#Text_Active").focus();
        return false;
    }
    if ($("#RateBaseSNo").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Rate Base Can Not Be Blank', "bottom-right");
        $("#Text_RateBaseSNo").focus();
        return false;
    }
    if ($("#CurrencySNo").val() == "") {
        ShowMessage('warning', 'Warning - Rate', 'Currency Can Not Be Blank', "bottom-right");
        $("#Text_CurrencySNo").focus();
        return false;
    }
    else {
        return true;
    }
}
$('#IsULDRateSlab').on('change', function () {
    if (this.checked == true) {
        var table = document.getElementById("tblRateBase");
        if (table != null && table.rows.length > 1) {
            var id = table.rows.length;
            var valid = id - 3;
            for (i = 0; i < id - 1; i++) {
                $('#tblRateBase_Row_' + valid).remove();
                valid = valid - 1;
            }
            $('#tblRateBase').hide();
        }
    }
    else {
        CreateSlabGrid();
        $('#tblRateBase').show();
    }
});
function BindOriginOnEdit() {
    var Origin = $("#Text_OriginType").val().toUpperCase();
    if (Origin == "AIRPORT") {
        cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Rate_rate_Origin", OnSelectOrigin, "contains");
    }
    else if (Origin == "CITY") {
        cfi.AutoCompleteV2("OriginSNo", "CityCode,CityName", "Rate_rate_OriginCityName", OnSelectOrigin, "contains");
    }
    else if (Origin == "REGION") {
        cfi.AutoCompleteV2("OriginSNo", "RegionName", "Rate_rate_OriginRegionName", OnSelectOrigin, "contains");
    }
    else if (Origin == "COUNTRY") {
        cfi.AutoCompleteV2("OriginSNo", "CountryCode,CountryName", "Rate_rate_OriginCountryName", OnSelectOrigin, "contains");
    }
    else if (Origin == "ZONE") {
        cfi.AutoCompleteV2("OriginSNo", "ZoneName", "Rate_rate_OriginZoneName", OnSelectOrigin, "contains");
    }
}
function BindDestinationOnEdit() {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
        cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Rate_rate_Destination", OnSelectDestination, "contains");
    }
    else if (Destination == "CITY") {
        cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "Rate_rate_OriginCityName", OnSelectDestination, "contains");
    }
    else if (Destination == "REGION") {
        cfi.AutoCompleteV2("DestinationSNo", "RegionName", "Rate_rate_OriginRegionName", OnSelectDestination, "contains");
    }
    else if (Destination == "COUNTRY") {
        cfi.AutoCompleteV2("DestinationSNo", "CountryCode,CountryName", "Rate_rate_OriginCountryName", OnSelectDestination, "contains");
    }
    else if (Destination == "ZONE") {
        cfi.AutoCompleteV2("DestinationSNo", "ZoneName", "Rate_rate_OriginZoneName", OnSelectDestination, "contains");
    }
}

function enableFields() {

    //  =======by arman 

    $(document).ready(function () {

        $("#Text_DestinationType").data("kendoAutoComplete").enable(true);
        $("#Text_OriginType").data("kendoAutoComplete").enable(true);
        $("#Text_OriginSNo").data("kendoAutoComplete").enable(true);
        $("#Text_DestinationSNo").data("kendoAutoComplete").enable(true);
        $("#Text_OfficeSNo").data("kendoAutoComplete").enable(true);
        //     alert($("#Text_AccountSNo").length);
        if (getQueryStringValue("FormAction").toUpperCase() != "EDIT")
            $("#Text_RAirlineSNo").data("kendoAutoComplete").enable(true);
        //  $("#Text_AccountSNo,#AccountSNo").val('');
        $('#spnallotement').text('');
        $("[id='IE5']").attr('disabled', false);

        // $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
        //clearAgent();
        //  ===end

    });
}


function ClearAgent() {

    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {


        if (flag != "1") {
            ///   $('#divMultiShipperSNo').remove();

            $('#divMultiAccountSNo').remove();
            $("#Text_AccountSNo").val('');
            $("#AccountSNo").val('');
            ////-------- added by arman ali date : 2017-10-25-----
            $('#divMultiShipperSNo').remove();
            $("#Text_ShipperSNo").val('');
            $("#ShipperSNo").val('');

            cfi.AutoCompleteV2("ShipperSNo", "AgentName", "Rate_rate_AgentName", null, "contains", ",");

            cfi.AutoCompleteV2("AccountSNo", "AgentName", "Rate_rate_RateAgentName", null, "contains", ",");
            // end here
            if ($("#Text_OfficeSNo").val() != "") {
                //  $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(false);
                $("[id='IE5']").attr('disabled', true);
                $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
            }
            else {
                $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
                $("[id='IE5']").attr('disabled', false);
                $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(true);
                // $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                $("#Text_ShipperSNo").data("kendoAutoComplete").enable(true);
            }
        }
        flag = "0";
    }
}
//by arman for gross weight 2017-05-15   tblULDRate_UldMinChWT_1
function GetULDMinimumGrossWT(obj) {

    if ($("#" + obj).val() == "0" || $("#" + obj).val() == "0.00" || $("#" + obj).val() == "") {
        ShowMessage('warning', 'Warning - ULDRate', 'Pivot Weight should be greater than zero.', "bottom-right");
        $("#" + obj).val("");
        return false;
    }
    else {
        var RNo = obj.split('_')[2];
        var PivotWeight = parseFloat($("#" + obj).val());
        var ULDTypeSNo = $('#tblULDRate_HdnULDSNo_' + RNo).val();
        var AllExe = ''
        $('#tblULDRate tr[id^="tblULDRate_Row_"]').each(function () {
            var RowNo = this.id.split('_')[2];
            if ($('#tblULDRate_HdnULDSNo_' + RowNo).val() == ULDTypeSNo && this.id != 'tblULDRate_Row_' + RNo && parseFloat($('#tblULDRate_UldMinChWT_' + RowNo).val()) != PivotWeight && $("#" + obj).val() != "" && $('#tblULDRate_UldMinChWT_' + RowNo).val() != "") {
                ShowMessage('warning', 'Warning - ULDRate', 'Pivot Weight Cannot be different for Same ULD Type', "bottom-right");
                $("#" + obj).val('');
                $("#_temp" + obj).val('');
                return false;
            }
        });
    }
}
// added by arman for checking Rate in rateSlab
function CheckRateslab() {

    if ($("#tblRateBase tr").length > 0) {
        //  debugger;
        var array = $('#tblRateBase_rowOrder').val().split(",");
        var length = parseInt($('#tblRateBase_rowOrder').val().split(',').length);
        for (var count = 0; count < length && count > 1; count++) {
            for (var j = count + 1; j < length; j++) {
                if (parseFloat($('#tblRateBase_Rate_' + (array[j])).val() == "" ? 0 : $('#tblRateBase_Rate_' + (array[j])).val()) > parseFloat($('#tblRateBase_Rate_' + array[count]).val() == "" ? 0 : $('#tblRateBase_Rate_' + array[count]).val())) {
                    for (var i = j; i < length ; i++) {
                        $('#tblRateBase_Rate_' + array[i]).val('')
                        $('#_temptblRateBase_Rate_' + array[i]).val('');
                    }
                }
            }
        }

    }
}
// add function for Allotment Rate in Edit Mode Date: 2107-09-15
function agentOnAllotemnt() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($("#Text_RateTypeSNo").val().toUpperCase() == "ALLOTMENT RATE") {
            $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
            $("#divMultiAccountSNo ul li span[class='k-icon k-delete']").attr("class", "");
        }

    }
}


// Added By devendra on 25 Sep 2018 
function OnSelectInterline(input) {
    var AirlineSNo = $("#RAirlineSNo").val() | "0";
    $.ajax({
        url: "Services/Rate/RateService.svc/GetAirlineCurruncy?AirlineSNo=" + AirlineSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "" && result != null) {
                var ResultData = jQuery.parseJSON(result);
                if (ResultData.Table0.length > 0) {
                    $("#IsInterlineval").val(ResultData.Table0[0].IsInterline);
                  
                   // $("#lblSlabTitle").val(ResultData.Table0[0].SlabTitle);
                }
            }
        }
    });
}