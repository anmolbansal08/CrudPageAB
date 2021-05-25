var flag = "0";
$(document).ready(function () {
    debugger;
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        cfi.AutoCompleteByDataSource("MailRatingCodeSNo", MailRatingCode, null, null);
        $('#MasterSaveAndNew').after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Save" class="btn btn-success">');
        $("input[type='submit'][name='operation']").hide();
        cfi.AutoComplete("RateCardSNo", "RateCardName", "RateCard", "SNo", "RateCardName", ["RateCardName"], onSelectRateCard, "contains");
        cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
       // cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
        cfi.AutoCompleteByDataSource("DestinationType", Destination1, FnGetDestinationAC, null);
        
        cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
        cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
        cfi.AutoCompleteByDataSource("Active", Active, null, null);
        //$("#Text_OriginSNo").css("display", "none");
        cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoCompleteByDataSource("RateBaseSNo", RateBaseName, null, null);
        cfi.AutoComplete("RateTypeSNo", "RateTypeName", "RateType", "SNo", "RateTypeName", ["RateTypeName"], onSelectAllotment, "contains");
        //cfi.AutoCompleteByDataSource("UOMSNo", UOM, null, null);
        cfi.AutoComplete("TransitStationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains", ",");
        cfi.AutoComplete("FlightTypeSNo", "FlightTypeName", "FlightType", "SNo", "FlightTypeName", ["FlightTypeName"], null, "contains");
        cfi.AutoComplete("AllotmentSNo", "AllotmentCode", "v_RateAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], GetAllotmentType, "contains");
        cfi.AutoComplete("RAirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineCode", ["CarrierCode", "AirlineName"], OnSelectAirline, "contains");
        cfi.AutoComplete("OfficeSNo", "Name", "Office", "SNo", "Name", ["Name"], OnSelectOffice, "contains");

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

      


        //$("input[id^=ValidTo]").change(function (e) {
        //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dfrom = new Date(Date.parse(k));
        //    var validFrom = $(this).attr("id").replace("From", "To");
        //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dto = new Date(Date.parse(k));
        //    if (dfrom > dto) {
        //        var todaydate = new Date();
        //        validTodate.min(todaydate);
        //        validTodate.max(dto);
        //    }
        //    else {
        //        var todaydate = new Date();
        //        var validTodate = $("#ValidTo").data("kendoDatePicker");
        //        validTodate.min(dfrom);
        //    }
        //});

        //$("input[id^=ValidFrom]").change(function (e) {
        //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dto = new Date(Date.parse(k));
        //    var validFrom = $(this).attr("id").replace("To", "From");
        //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dfrom = new Date(Date.parse(k));
        //    if (dfrom > dto) {
        //        var todaydate = new Date();
        //        var validTodate = $("#ValidTo").data("kendoDatePicker");
        //        validTodate.min(validFrom);
        //        validTodate.max(dfrom);
        //    }
        //    else {
        //        var todaydate = new Date();
        //        var validTodate = $("#ValidFrom").data("kendoDatePicker");
        //        validTodate.min(todaydate);
        //        validTodate.max(dto);
        //    }

        //});

        CreateRemarks();
        //CreateSlabGrid();
        CreateULDSlabGrid();
        CreateRateParamGrid();
        $("#btnSaveRateMaster").unbind("click").bind("click", function () {
           
            //a = CheckValidationTable();
            if ($('[id^=tblULDRate_UldMinChWT_]').val() == "0" || $('[id^=tblULDRate_UldMinChWT_]').val() == "0.00" || $('[id^=tblULDRate_UldMinChWT_]').val() == "") {
                ShowMessage('warning', 'Warning - Rate', 'Gross weight should be greater than zero.', "bottom-right");
                $('[id^=tblULDRate_UldMinChWT_]').val('');
                return false;
            }
            if (cfi.IsValidSubmitSection()) {
                SaveRateAirlineMaster("NEW");
            }
           // SaveRateAirlineMaster("NEW");
        });
        $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
            $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");
            $(tr).find("input[id^='tblRateBase_Rate_']").val("");
            $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
            $(tr).find("input[id^='tblRateBase_Based_']").val("");
        });
        $("#Text_MailRatingCodeSNo").closest("span").hide();
     

        $("input[id^='REFNo']").keydown(function (event) {
            if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
                event.preventDefault();
            }
        });
        $("input[id^='REFNo']").on("contextmenu", function (e) {
            alert('Right click disabled');
            return false;
        });
        $("input[id^='REFNo']").on('drop', function () {
            return false;
        });


    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {

        cfi.AutoCompleteByDataSource("MailRatingCodeSNo", MailRatingCode, null, null);
        //$('#MasterSaveAndNew').after('<input type="button" id="btnSaveRateMaster" name="btnSaveRateMaster" value="Update" class="btn btn-success">');
        //$("input[type='submit'][name='operation']").hide();
        cfi.AutoComplete("RateCardSNo", "RateCardName", "RateCard", "SNo", "RateCardName", ["RateCardName"], onSelectRateCard, "contains");
        cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
        //cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
        cfi.AutoCompleteByDataSource("DestinationType", Destination1, FnGetDestinationAC, null);
        cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
        cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
        cfi.AutoCompleteByDataSource("Active", Active, null, null);
        //$("#Text_OriginSNo").css("display", "none");
        cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoCompleteByDataSource("RateBaseSNo", RateBaseName, null, null);
        cfi.AutoComplete("RateTypeSNo", "RateTypeName", "RateType", "SNo", "RateTypeName", ["RateTypeName"], onSelectAllotment, "contains");
        //cfi.AutoCompleteByDataSource("UOMSNo", UOM, null, null);
        cfi.AutoComplete("TransitStationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains", ",");
        cfi.AutoComplete("FlightTypeSNo", "FlightTypeName", "FlightType", "SNo", "FlightTypeName", ["FlightTypeName"], null, "contains");
        cfi.AutoComplete("AllotmentSNo", "AllotmentCode", "v_RateAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], GetAllotmentType, "contains");
        cfi.AutoComplete("RAirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], OnSelectAirline, "contains");
        cfi.AutoComplete("OfficeSNo", "Name", "Office", "SNo", "Name", ["Name"], OnSelectOffice, "contains");
        //$("#Text_RateBaseSNo").val("On Chargable Wt.");
        //$("#RateBaseSNo").val("3");

        //$("#Text_AllotmentSNo").closest("span").hide();
        //$("#Text_OriginType").val("AIRPORT");
        //$("#Text_DestinationType").val("AIRPORT");
        //$("#OriginType").val("1");
        //$("#DestinationType").val("1");

        //$("#ValidFrom").data("kendoDatePicker").value("");
        //$("#ValidTo").data("kendoDatePicker").value("");
        //var todaydate = new Date();
        //var validfromdate = $("#ValidFrom").data("kendoDatePicker");
        //validfromdate.min(todaydate);
        //var validTodate = $("#ValidTo").data("kendoDatePicker");
        //validTodate.min(todaydate);

        //$("input[id^=ValidTo]").change(function (e) {
        //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dto = new Date(Date.parse(k));
        //    var validFrom = $(this).attr("id").replace("To", "From");
        //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dfrom = new Date(Date.parse(k));
        //    if (dfrom > dto)
        //        $(this).val("");
        //});

        //$("input[id^=ValidFrom]").change(function (e) {
        //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dfrom = new Date(Date.parse(k));
        //    var validFrom = $(this).attr("id").replace("From", "To");
        //    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        //    var dto = new Date(Date.parse(k));
        //    if (dfrom > dto)
        //        $(this).val("");

        //});
        CreateRemarks();
        CreateSlabGrid();
        CreateULDSlabGrid();
        CreateRateParamGrid();


        //$("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        //    $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");
        //    $(tr).find("input[id^='tblRateBase_Rate_']").val("");
        //    $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
        //    $(tr).find("input[id^='tblRateBase_Based_']").val("");


        //});
        onSelectRateCard();
        onSelectAllotment();
        UserSubProcessRightswithoutsubprocess("divbody", true);


        //$("#Text_MailRatingCodeSNo").closest("span").hide();
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        debugger;
        flag = "1";
        cfi.AutoCompleteByDataSource("MailRatingCodeSNo", MailRatingCode, null, null);
       
       
        $("input[type='submit'][name='operation']").hide();
        cfi.AutoComplete("RateCardSNo", "RateCardName", "RateCard", "SNo", "RateCardName", ["RateCardName"], onSelectRateCard, "contains");
        cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
       // cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
        cfi.AutoCompleteByDataSource("DestinationType", Destination1, FnGetDestinationAC, null);
        // cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
        //cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
        var Destination = $("#Text_DestinationType").val().toUpperCase();

        cfi.AutoCompleteByDataSource("Active", Active, null, null);
        //$("#Text_OriginSNo").css("display", "none");
        cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoCompleteByDataSource("RateBaseSNo", RateBaseName, null, null);
        cfi.AutoComplete("RateTypeSNo", "RateTypeName", "RateType", "SNo", "RateTypeName", ["RateTypeName"], onSelectAllotment, "contains");
        //cfi.AutoCompleteByDataSource("UOMSNo", UOM, null, null);
        cfi.AutoComplete("TransitStationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains", ",");
        cfi.AutoComplete("FlightTypeSNo", "FlightTypeName", "FlightType", "SNo", "FlightTypeName", ["FlightTypeName"], null, "contains");
        cfi.AutoComplete("AllotmentSNo", "AllotmentCode", "v_RateAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], GetAllotmentType, "contains");
        cfi.AutoComplete("RAirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], OnSelectAirline, "contains");
        cfi.AutoComplete("OfficeSNo", "Name", "Office", "SNo", "Name", ["Name"], OnSelectOffice, "contains");
        //$("#Text_RateBaseSNo").val("On Chargable Wt.");
        //$("#RateBaseSNo").val("3");

        //$("#Text_AllotmentSNo").closest("span").hide();
        //$("#Text_OriginType").val("AIRPORT");
        //$("#Text_DestinationType").val("AIRPORT");
        //$("#OriginType").val("1");
        //$("#DestinationType").val("1");

        //$("#ValidFrom").data("kendoDatePicker").value("");
        //$("#ValidTo").data("kendoDatePicker").value("");
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

        CreateRemarks();
        //$("#OriginType").val(), $("#OriginSNo").val()
        CreateSlabGrid();
        CreateULDSlabGrid();
        CreateRateParamGrid();

        //$('#MasterSaveAndNew').show();

        $("#btnSaveRateMaster").unbind("click").bind("click", function () {
            // by arman 9-5-2017  For duplicate action
            debugger;
            var modeOfOperation=""
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
                modeOfOperation = "EDIT"
            else if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
                modeOfOperation = "NEW"
                $("#hdnRateSNo").val('0');
            }
            //======end
            if ($('[id^=tblULDRate_UldMinChWT_]').val() == "0" || $('[id^=tblULDRate_UldMinChWT_]').val() == "0.00" || $('[id^=tblULDRate_UldMinChWT_]').val()== "") {
                ShowMessage('warning', 'Warning - Rate', 'Gross weight should be greater than zero.', "bottom-right");
                $('[id^=tblULDRate_UldMinChWT_]').val('');
                return false;
            }

            if (cfi.IsValidSubmitSection()) {
                if (cfi.IsValidSubmitSection("divRateBase")) {
                    SaveRateAirlineMaster(modeOfOperation);
                }
            }
        });
        //$("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        //    $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");
        //    $(tr).find("input[id^='tblRateBase_Rate_']").val("");
        //    $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
        //    $(tr).find("input[id^='tblRateBase_Based_']").val(""); 


        //});

        //var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
        //var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
        //if (Text_OriginSNo != "" && Text_DestinationSNo != "") {
        //    $("#REFNo").val($("#Text_RateCardSNo").val() + "_" + Text_OriginSNo.split("-")[0] + "_" + Text_DestinationSNo.split("-")[0] + "_1");
        //}
      
        //FnGetOriginAC();
        //FnGetDestinationAC();
        BindOriginOnEdit();
        BindDestinationOnEdit();
        onSelectRateCard();
        onSelectAllotment();
    }
    //$("#Text_MailRatingCodeSNo").closest("span").hide();
});
function OnSelectOffice(input) {
    debugger;
    var Text_OfficeSNo = $("#Text_OfficeSNo").val();
    var OfficeSNo = $("#OfficeSNo").val() || "0";
    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        if (Text_OfficeSNo != "" ) {
            // by arman for clearing shipper,agent name and group
            $('#divMultiShipperSNo').remove();
            $('#divMultiAccountSNo').remove();
            $('#divMultiAccountGroupSNo').remove();
            cfi.AutoComplete("AccountGroupSNo", "AgentGroupName", "RateAirlineAgentGroup", "SNo", "AgentGroupName@", ["AgentGroupName"], null, "contains", ",");

            cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSShipper", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");

            cfi.AutoComplete("AccountSNo", "AgentName", "vw_RateAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
            $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(false);
            $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
            $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
        }
        else {
            if (flag != "1") {
                $('#divMultiShipperSNo').remove();
                $('#divMultiAccountSNo').remove();
                $('#divMultiAccountGroupSNo').remove();
                cfi.AutoComplete("AccountGroupSNo", "AgentGroupName", "RateAirlineAgentGroup", "SNo", "AgentGroupName@", ["AgentGroupName"], null, "contains", ",");

                cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSShipper", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");

                cfi.AutoComplete("AccountSNo", "AgentName", "vw_RateAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
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
    var AirlineSNo = $("#RAirlineSNo").val() | "0";
    $.ajax({
        url: "Services/Rate/RateService.svc/GetAirlineCurruncy?AirlineSNo=" + AirlineSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "" && result != null) {
                var ResultData = jQuery.parseJSON(result);
                if (ResultData.Table0.length > 0) {
                    $("#CurrencySNo").val(ResultData.Table0[0].CurrencySNo);
                    $("#Text_CurrencySNo").val(ResultData.Table0[0].Currency);
                }
            }
        }
    });
    CreateSlabGrid();
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
    debugger;
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
    
    //if (flag !=1) {
    //    $('#Text_OfficeSNo').val('');
    //    $('#OfficeSNo').val('');
    //}
  //  OnSelectOffice();
 //   flag = "0";
}
function GetAllotmentType() {
    debugger;
    var AllotmentSNo = $("#AllotmentSNo").val();
    if (AllotmentSNo != "") {
        $.ajax({
            url: "Services/Rate/RateService.svc/GetAllotmentType?AllotmentSNo=" + AllotmentSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "" && result != null) {
                    var ResultData = jQuery.parseJSON(result);
                    debugger;
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
                        //if ($("#Text_OfficeSNo").val() != "") {
                        //    //  $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                        //    $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(false);
                        //    $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                        //    $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
                           
                        //}
                        //else {
                        //    $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
                        //    $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(true);
                        //    // $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                        //    $("#Text_ShipperSNo").data("kendoAutoComplete").enable(true);
                        //    $("#Text_OfficeSNo").data("kendoAutoComplete").enable(true);
                        //}
                      
                        $('#Text_AccountSNo').val(ResultData.Table0[0].Agent)
                      $('#AccountSNo').val(ResultData.Table0[0].AccountSNo)
                     $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                        $('#Text_RAirlineSNo').val(ResultData.Table0[0].AirlineName)
                        $('#RAirlineSNo').val(ResultData.Table0[0].AirlineSNo)
                        $("#Text_RAirlineSNo").data("kendoAutoComplete").enable(false);
                    }
                }
            }
        });
    }
    else
    {
        debugger;
        enableFields();
     //   $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
       
           
    }
    //OnSelectOffice();

  
}
function OnSelectOrigin(input) {
    debugger;
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
        var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
    }
    else if (Origin == "CITY") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
    }
    else if (Origin == "REGION") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSource("OriginSNo", "Region", "SNo", "RegionName", ["RegionName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");
    }
    else if (Origin == "COUNTRY") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
        cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
    }
    else if (Origin == "ZONE") {
        cfi.ResetAutoComplete("OriginSNo");
        var dataSource = GetDataSource("OriginSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "ZoneName");
    }
}
//function FnGetOriginAC(input) {
//    var Origin = $("#Text_OriginType").val().toUpperCase();   
//    if (Origin == "AIRPORT") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.ResetAutoComplete("OriginSNo");
//           // cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
//            var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"])
//            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
//        }
//        else {
//            var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"])
//            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
//            $("#Text_OriginSNo").val("");
//            $("#OriginSNo").val("");
//        }

//    }
//    else if (Origin == "CITY") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//             cfi.AutoComplete("OriginSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectOrigin, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
//            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
//            $("#Text_OriginSNo").val("");
//            $("#OriginSNo").val("");
//        }
//    }
//    else if (Origin == "REGION") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("OriginSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], OnSelectOrigin, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("OriginSNo", "Region", "SNo", "RegionName", ["RegionName"])
//            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");
//            $("#Text_OriginSNo").val("");
//            $("#OriginSNo").val("");
//        }
//    }
//    else if (Origin == "COUNTRY") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
//            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
//            cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
//            $("#Text_OriginSNo").val("");
//            $("#OriginSNo").val("");
//        }
//    }
//    else if (Origin == "ZONE") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("OriginSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], OnSelectOrigin, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("OriginSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
//            cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "ZoneName");
//            $("#Text_OriginSNo").val("");
//            $("#OriginSNo").val("");
//        }
//    }
//    else {
//        //  $("#Text_OriginSNo").css("display", "none");
//    }

//}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSource("DestinationSNo", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "AirportCode");
    }
    else if (Destination == "CITY") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");
    }
    else if (Destination == "REGION") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSource("DestinationSNo", "Region", "SNo", "RegionName", ["RegionName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");
    }
    else if (Destination == "COUNTRY") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
    }
    else if (Destination == "ZONE") {
        cfi.ResetAutoComplete("DestinationSNo");
        var dataSource = GetDataSource("DestinationSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "ZoneName");
    }
}

//function FnGetDestinationAC(input) {
//    var Destination = $("#Text_DestinationType").val().toUpperCase();
//    if (Destination == "AIRPORT") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("DestinationSNo", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"])
//            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "AirportCode");
//            $("#Text_DestinationSNo").val("");
//            $("#DestinationSNo").val("");
//        }
//    }
//    else if (Destination == "CITY") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("DestinationSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectDestination, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityName", ["CityCode", "CityName"])
//            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");
//            $("#Text_DestinationSNo").val("");
//            $("#DestinationSNo").val("");
//        }
//    }
//    else if (Destination == "REGION") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("DestinationSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], OnSelectDestination, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("DestinationSNo", "Region", "SNo", "RegionName", ["RegionName"])
//            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");
//            $("#Text_DestinationSNo").val("");
//            $("#DestinationSNo").val("");
//        }
//    }
//    else if (Destination == "COUNTRY") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("DestinationSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectDestination, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"])
//            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
//            $("#Text_DestinationSNo").val("");
//            $("#DestinationSNo").val("");
//        }
//    }
//    else if (Destination == "ZONE") {
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
//            cfi.AutoComplete("DestinationSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], OnSelectDestination, "contains");
//        }
//        else {
//            var dataSource = GetDataSource("DestinationSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
//            cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "ZoneName");
//            $("#Text_DestinationSNo").val("");
//            $("#DestinationSNo").val("");
//        }
//    }

//}

function CheckValidation(input) {

}
function CheckRate(input) {
    var CurrentRow = $('#' + input).closest("tr");
    var Type = CurrentRow.find("input[id^='tblRateBase_RateClassSNo_']").val() == '' ? false : true;
    //var Type2 = CurrentRow.find("input[id^='tblRateBase_Rate_']").val() == '' ? false : true;


    if (Type) {
        CurrentRow.find("input[id^='tblRateBase_Rate_']").attr("data-valid", "min[0.01],required");
        CurrentRow.find("input[id^='_temptblRateBase_Rate_']").attr("data-valid", "min[0.01],required");

    }
    else {
        CurrentRow.find("input[id^='tblRateBase_Rate_']").removeAttr("data-valid");
        CurrentRow.find("input[id^='_temptblRateBase_Rate_']").removeAttr("data-valid");
    }


}
function ChangeUnitType(input) {

}
//function CheckValidationTable(){
//    var table = $('#tblRateBase').IsValidSubmitSection();
//    return table;
//}

function CheckValueValidation(input) {
    var CurrentRow = $('#' + input).closest("tr");
    var Type = CurrentRow.find("input[id^='tblRateBase_Rate_']").val() == '' ? false : true;

    if (Type) {
        CurrentRow.find("input[id^='tblRateBase_RateClassSNo_']").attr("data-valid", "required");
        CurrentRow.find("input[id^='tblRateBase_HdnRateClassSNo_']").attr("data-valid", "required");
    }
    else {
        CurrentRow.find("input[id^='tblRateBase_RateClassSNo_']").removeAttr("data-valid");
        CurrentRow.find("input[id^='tblRateBase_HdnRateClassSNo_']").removeAttr("data-valid");
    }
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

    //if (Origin != "undefined" && OriginSNo != "") {
    //    var Wh = Origin + "-" + OriginSNo + "-" + AirlineSNo || "";
    //}
    //else {
    //    Wh = null;
    //}
    var SlabProc = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        SlabProc = "GetRateSLAB_New";
    }
    else {
        SlabProc = "GetRateSLAB";
    }
    var dbtableName = "RateBase";
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
                     { name: "SlabName", display: "Slab Name", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },
                     { name: "StartWt", display: "Start Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },
                     { name: "EndWt", display: "End Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, onblur: "", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? false : false },
                     { name: 'RateClassSNo', display: 'Type', type: 'text', ctrlAttr: { onSelect: "return CheckRate(this.id);", onBlur: "return CheckRate(this.id);", controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'vwRate_RateClass', textColumn: 'RateClassCode', keyColumn: 'SNo', filterCriteria: "contains" },
                     { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal2" : "", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: true },//isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
                     //{ name: "Based", display: "Based", type: "select", ctrlAttr: { maxlength: 100, onchange: "" }, ctrlOptions: { 0: "IATA", 1: "MARKET" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
                //debugger;
                $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
                $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

                $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
                $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

                $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
                $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);

            });
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true }
    });
    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        //debugger;
        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
        $(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

        $(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
        $(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

        $(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
        $(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);

        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").val("");
            $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");

            $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
            $(tr).find("input[id^='tblRateBase_Rate_']").val("");
        }
        $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").attr("data-valid", "required");
        $(tr).find("input[id^='tblRateBase_RateClassSNo_']").attr("data-valid", "required");

        $(tr).find("input[id^='_temptblRateBase_Rate_']").attr("data-valid", "min[0.01],required");
        $(tr).find("input[id^='tblRateBase_Rate_']").attr("data-valid", "min[0.01],required");
    });
    // commented by arman for delete button
    // $('#tblRateBase button.insert,#tblRateBase button.remove').hide();//#tblRateBase button.moveUp,#tblRateBase button.moveDown
    // Buttons at footer row

    $('#tblRateBase button.append').hide();
    //========================================= added by arman ali [id*= 'tblRateBase_Delete_']
    $("#tblRateBase_btnRemoveLast,[id*= 'tblRateBase_Delete_']").unbind("click").bind("click", function () {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

            var table = document.getElementById("tblRateBase");
            if (table != null && table.rows.length > 1) {
                // $('#tblRateBase  tbody  tr').each(function (row, tr) {
                var id = table.rows.length;
                var valid = id - 3;
                if (valid > 3) {
                    $('#tblRateBase_Row_' + valid).remove();
                    ShowMessage('success', 'Success', "Row Deleted Successfully!", "bottom-right");

                }

                // });
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
        contentEditable: true,
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
                    { name: 'ULDSNo', display: 'ULD Type', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: 'return GetULDMinimumCWt(this.id);' }, ctrlCss: { width: '150px', height: '20px' }, onChange: 'return GetULDMinimumCWt(this.id);', isRequired: true, tableName: 'vwRateULDType', textColumn: 'ULDName', keyColumn: 'SNo', filterCriteria: "contains" },
                    { name: 'RateClassCode', display: 'Rate Class Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' },  isRequired: false, tableName: 'ULDRateClass', textColumn: 'RateClassCode', keyColumn: 'SNo', filterCriteria: "contains" },
                    { name: 'RateClassSNo', display: 'Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: 'return GetULDMinimumCWt(this.id);', isRequired: true, tableName: 'vwRate_RateClass', textColumn: 'RateClassCode', keyColumn: 'SNo', filterCriteria: "contains" },
                    { name: "UldMinChWT", display: "Pivot Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", onblur: "return GetULDMinimumGrossWT(this.id);" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },   // made this field required by arman ali 2017-05-15
                    { name: "Rate", display: "Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal2" : "", maxlength: 8 }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
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


                $(tr).find("input[id^='tblULDRate_SLABName_']").keydown(function (event) {
                    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
                        event.preventDefault();
                    }
                });
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
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW"  ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });


}
function GetULDMinimumCWt(input) {
    $("#" + input.replace("ULDSNo", "UldMinChWT")).val('');// clear pivot weight on uld type change date : 17-05-2017  Arman Ali 
    debugger;
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
                    debugger;
                    var ResultData = jQuery.parseJSON(result);
                    if (ResultData.Table0.length > 0) {
                        if (ResultData.Table0[0].GrossWeight <= 0) {
                            ClosestTr.find("input[id^='tblULDRate_UldMinChWT_'").val('');
                        }
                        else
                            ClosestTr.find("input[id^='tblULDRate_UldMinChWT_'").val(ResultData.Table0[0].GrossWeight);
                        //if (ULDType == 'U') {
                        //    ClosestTr.find("input[id^='tblULDRate_UldMinChWT_'").val(ResultData.Table0[0].GrossWeight);
                        //}
                        //else if (ULDType == 'E') {
                        //    ClosestTr.find("input[id^='tblULDRate_UldMinChWT_'").val("1");
                        //}
                        //else {
                        //    if (ULDType == 'X') {
                        //        ClosestTr.find("input[id^='tblULDRate_UldMinChWT_'").val("0");
                        //    }
                        //}
                        ClosestTr.find("input[id^='tblULDRate_RateClassCode_'").val(ResultData.Table0[0].RateClassCode);
                        ClosestTr.find("input[id^='tblULDRate_HdnRateClassCode_'").val(ResultData.Table0[0].HdnRateClassSNo);
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
            SlabName: 0,
            RateClassSNo: $(tr).find("input[id^='tblRateBase_HdnRateClassSNo_']").val(),
            Text_RateClassSNo: "",
            StartWt: 0,
            EndWt: 0,
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
        //debugger;
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
        IsIncludeETD: $("input[name='IE10']:checked").val(),
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
    }
    // RateParam.push(RateParamViewModel);

    //debugger;
    try {
        if ($("tr[id^='tblRateBase_Row']").length == 0 && ($("tr[id^='tblULDRate_Row']").length == 0)) {
            ShowMessage('warning', 'warning - Rate', "Please Add Any One (Loose Cargo Rate or ULD Rate )", "bottom-right");
            return false;
        }

        var IsULDCheck = $("#IsULDRateSlab").prop('checked') == true ? 1 : 0
        //if ($("tr[id^='tblRateBase_Row']").length > 0) {
        $.ajax({
            url: "Services/Rate/RateService.svc/SaveRateDetais", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RateSNo: $("#hdnRateSNo").val() || 0, PerformAction: input, RateInfo: RateViewModel, RateRemarks: RateRemarksarray, RateSLABInfoarray: RateSLABInfoarray, RateULDSLABInfoArray: RateULDSLABInfoArray, RateParamList: RateParamViewModel, IsULDCheck: IsULDCheck }),
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
function OnSuccessGrid() {
    $("table[class='k-focusable k-selectable']").find("tr").each(function (row, tr) {
        var Status = $(tr).find("td[data-column='Active'] span").attr("title");
        //$(tr).find('td:first input[name^="faction"]').each(function () {
        //    $(this).prop('checked', false);
        //});
        if ($(tr).find("td[data-column='Active'] span").attr("title").toUpperCase() == "EXPIRED") {
            // $(tr).find('div[id$="user-options"]').remove();

            $(tr).find("input[name^='faction']").parent().unbind("click").bind("click", function () {
                return false;
            });
        }
    });
}

function CreateRateParamGrid() {
    //debugger;    
    var dbtableName = "RateParam";
    $.ajax({
        url: "HtmlFiles/Rate/RateConditions.html", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tbl" + dbtableName).html(result);
            cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode@", ["CarrierCode", "AirlineName"], null, "contains", ",");
            cfi.AutoComplete("IAirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode@", ["CarrierCode", "AirlineName"], null, "contains", ",");
            cfi.AutoComplete("FlightSNo", "FlightNo", "Schedule", "SNo", "FlightNo", ["FlightNo"], null, "contains", ",");
            // cfi.AutoComplete("WeekDay", "ShortWeekDay", "WeekDays", "SNo", "ShortWeekDay", ["ShortWeekDay"], null, "contains", ",");
            cfi.AutoComplete("TransitStationsSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode@", ["AirportCode", "AirportName"], null, "contains", ",");
            cfi.AutoComplete("AccountSNo", "AgentName", "vw_RateAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
            // cfi.AutoComplete("ShipperSNo", "AgentName", "vw_RateAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
            cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSShipper", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
            // cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains", ",");
            cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription", "Commodity", "SNO", "CommodityCode@", ["CommodityCode", "CommodityDescription"], null, "contains", ",", null, null, null, null, true);
            cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains", ",");
            cfi.AutoComplete("SHCSNo", "Code,Description", "SPHC", "SNo", "Code@", ["Code", "Description"], null, "contains", ",");
            cfi.AutoComplete("AccountGroupSNo", "AgentGroupName", "RateAirlineAgentGroup", "SNo", "AgentGroupName@", ["AgentGroupName"], null, "contains", ",");
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
                debugger;
                var CurrentRateSno = $("#hdnRateSNo").val();
                $.ajax({
                    url: "Services/Rate/RateService.svc/GetRateParameter?RateSNo=" + CurrentRateSno, async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    data: JSON.stringify({ RateSNo: CurrentRateSno }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        debugger;
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
                            $("input[type=radio][name=IE10][value=" + Array[0].IsIncludeETD + "]").attr('checked', 1);

                            cfi.BindMultiValue("TransitStationsSNo", Array[0].Text_TransitStationsSNo, Array[0].TransitStationsSNo);
                            $("#TransitStationsSNo").val(Array[0].TransitStationsSNo);
                            $("input[type=radio][name=IE4][value=" + Array[0].IsIncludeTransitStations + "]").attr('checked', 1);

                            cfi.BindMultiValue("AccountGroupSNo", Array[0].Text_AGentGroupSNo, Array[0].AGentGroupSNo);
                            $("#AccountGroupSNo").val(Array[0].AccountGroupSNo);
                            $("input[type=radio][name=IE11][value=" + Array[0].IsIncludeAgentGroup + "]").attr('checked', 1);
                            debugger;
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
                            debugger;
                            flag = 1;
                            OnSelectOffice();  // run this method for edit case only one tome on page load
                            flag = 0;
                           // by arman 
                        }
                    }
                });
               
                if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                    UserSubProcessRightswithoutsubprocess("divRateParam", true);
                }

            }
        }

    });


    // $("#tbl" + dbtableName).css("border", "1px");


}
function checkETD(input) {
    //;
    //$("input[class='k-list']").find("li").remove();

    //for (var i = 1; i <= 24; i++) {
    //    $("input[class='k-list']").append("<li class='k-item' unselectable='on'>" + i + "</li>");
    //}



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


    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNO", "notin", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter1, "IsActive", "eq", 1);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    else if (textId.indexOf("Text_RAirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNO", "notin", $("#Text_RAirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter1, "IsInterline", "eq", 0);
        cfi.setFilter(filter1, "IsActive", "eq", 1);
        filterRAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterRAirlineSNo;
    }
    else if (textId.indexOf("Text_IAirlineSNo") >= 0) {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "SNO", "notin", $("#Text_IAirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter2, "SNO", "notin", $("#Text_RAirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter2, "IsActive", "eq", 1);
        filterIAirlineSNo = cfi.autoCompleteFilter(filter2);
        return filterIAirlineSNo;
    }
    else if (textId.indexOf("Text_FlightSNo") >= 0) {
        var filter3 = cfi.getFilter("AND");
        cfi.setFilter(filter3, "SNO", "notin", $("#Text_FlightSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter3, "IsActive", "eq", 1);
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
        debugger;
        // addeed by arman ali for agent based on OD pair  date = 9-5-2017
        var Origin = $("#Text_OriginType").val().toUpperCase();
        var Destination = $("#Text_DestinationType").val().toUpperCase();
        var filter5 = cfi.getFilter("AND");
        cfi.setFilter(filter5, "SNO", "notin", $("#Text_AccountSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filter5, "AccountTypeName", "eq", "FORWARDER");
        cfi.setFilter(filter5, Origin + "SNO", "in", $("#OriginSNo").val());

      
       
        //if (Origin =="AIRPORT")
        //    cfi.setFilter(filter5, "AirportSNo", "in", $("#OriginSNo").val());
        //else if (Origin == "CITY")
        //    cfi.setFilter(filter5, "CitySNo", "in", $("#OriginSNo").val());
        //else if (Origin == "COUNTRY")
        //    cfi.setFilter(filter5, "CountrySNo", "in", $("#OriginSNo").val());
        //else if (Origin == "REGION")
        //    cfi.setFilter(filter5, "RegionSNo", "in", $("#OriginSNo").val());

        //cfi.setFilter(filter5, "RateAirlineAgentGroupSNo", "in", $("#Text_AccountGroupSNo").data("kendoAutoComplete").key());
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
            cfi.setFilter(filter9, "IsActive", "eq", 1);
            filterSHCSNo = cfi.autoCompleteFilter(filter9);
            return filterSHCSNo;
        }
        if (textId.indexOf("Text_AirlineSNo") >= 0) {
            var filter9 = cfi.getFilter("AND");
            cfi.setFilter(filter9, "SNO", "notin", $("#Text_SHCSNo").data("kendoAutoComplete").key());
            cfi.setFilter(filter9, "IsActive", "eq", 1);
            filterSHCSNo = cfi.autoCompleteFilter(filter9);
            return filterSHCSNo;
        }
        if (textId.indexOf("Text_OfficeSNo") >= 0) {
            debugger;
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
        if (textId.indexOf("tblRateBase_RateClassSNo") >= 0) {
            var filter9 = cfi.getFilter("AND");
            cfi.setFilter(filter9, "class", "in", "1,2");

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
   
        if (textId.indexOf("tblULDRate_RateClassSNo") >= 0) {
            var filter9 = cfi.getFilter("AND");
            cfi.setFilter(filter9, "class", "in", "3");
            //$("tr[id^='tblULDRate_Row']").each(function (row, tr) {
            //    var RateClass = $(tr).find("input[id^='tblULDRate_RateClassSNo_']").val().substring(0, 1).toUpperCase();
            //    var hdnClass = $(tr).find("input[id^='tblULDRate_HdnULDSNo_']").val()
            ////    alert(hdnClass);
            //    var RateClassName = $(tr).find("input[id^='tblULDRate_RateClassSNo_']").val().toUpperCase();
            //    var ULDType = $(tr).find("input[id^='tblULDRate_ULDSNo_']").val().toUpperCase();
            //    var leng = $('[type="hidden"][id^="tblULDRate_HdnULDSNo_"][value= "'+ hdnClass + '"]').length;
            // //   alert(leng);
            //    //tblULDRate_ULDSNo_
            //    //============= by arman 12-05-2017===========
            //    if (RateClass == "E" && leng <= 2 && leng>=1) {
            //        cfi.setFilter(filter9, "RateClassCode", "notin", RateClassName);
            //    }
            //    else if (RateClass == "U" && leng <=2  && leng>=1) {
            //        cfi.setFilter(filter9, "RateClassCode", "notin", RateClassName);

            //    }
            //    //=========end================================
            //});
            // cfi.setFilter(filter9, "IsActive", "eq", 1);
         //   cfi.setFilter(filter9, "RateClassCode", "notin", RateClassName);
            filterSHCSNo = cfi.autoCompleteFilter(filter9);
            return filterSHCSNo;
        }
    //================by arman for filter ULd type date : 17-05-2017
        if (textId.indexOf("tblULDRate_ULDSNo") >= 0) {
            if ($("#RAirlineSNo").val() == "")
                ShowMessage('warning', 'Warning - Rate', ' Select Airline First', "bottom-right");
            var filter9 = cfi.getFilter("AND");
            cfi.setFilter(filter9, "AirlineSNo", "in", $('#RAirlineSNo').val());
            filterSHCSNo = cfi.autoCompleteFilter(filter9);
            return filterSHCSNo;
        }
    //=============end
        //if (textId.indexOf("tblRateBase_RateClassSNo") >= 0) {
        //    var filter1 = cfi.getFilter("AND");
        //    cfi.setFilter(filter1, "RateClassCode", "notin", "M-MINIMUM CHARGE ");
        //    cfi.setFilter(filter1, "RateClassCode", "notin", "N-NORMAL RATE ");
        //    //cfi.setFilter(filter1, "IsActive", "eq", 1);
        //    filterClass = cfi.autoCompleteFilter(filter1);
        //    return filterClass;
        //}
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
    }

    //Disabled any div by Div ID 
    function UserSubProcessRightswithoutsubprocess(container, isView) {
        //if view permission is true
        if (isView) {
            //$(".btn-success").attr("style", "display:none;");
            //$(".btn-danger").attr("style", "display:none;");
            //$(".ui-button").closest("td").attr("style", "display:none;");
            //$(".btnTrans").closest("td").attr("style", "display:none;");
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
                        //else if ($(this).attr("id").indexOf("_temp") >= 0) {
                        //    $(this).replaceWith("<input type='hidden' id='" + $(this).attr("id") + "' value='" + this.value + "' />");
                        //}
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
        //$("span[id=MasterDuplicate]").remove();

        //$("td[class=formbuttonrow]").html("");
        //var HTML = "<input type='button' value='Edit' onclick='navigateUrl(Default.cshtml?Module=Rate&Apps=Rate&FormAction=Edit&RecID=" + $("#hdnRateSNo").val() + ");' class='btn btn-info'><input type=button value=Duplicate id=MasterDuplicate onclick='navigateUrl(Default.cshtml?Module=Rate&Apps=Rate&FormAction=DUPLICATE&RecID=" + $("#hdnRateSNo").val() + ");' class=btn btn-info><input type=button value=Delete onclick='navigateUrl(Default.cshtml?Module=Rate&Apps=Rate&FormAction=DELETE&RecID=" + $("#hdnRateSNo").val() + ");' class='btn btn-danger'><input type=button value=Back onclick='navigateUrl(Default.cshtml?Module=Rate&Apps=Rate&FormAction=INDEXVIEW);' class='btn btn-inverse'></td>";
        //$("td[class=formbuttonrow]").append(HTML);
        // $("input[name='operation']").attr("style", "display:block;");
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
        cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectOrigin, "contains");
    }
    else if (Origin == "CITY") {
        cfi.AutoComplete("OriginSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectOrigin, "contains");
    }
    else if (Origin == "REGION") {
        cfi.AutoComplete("OriginSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], OnSelectOrigin, "contains");
    }
    else if (Origin == "COUNTRY") {
        cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
    }
    else if (Origin == "ZONE") {
        cfi.AutoComplete("OriginSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], OnSelectOrigin, "contains");
    }
}
function BindDestinationOnEdit() {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
            cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "vwAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
    }
    else if (Destination == "CITY") {
            cfi.AutoComplete("DestinationSNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], OnSelectDestination, "contains");
    }
    else if (Destination == "REGION") {
            cfi.AutoComplete("DestinationSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], OnSelectDestination, "contains");
    }
    else if (Destination == "COUNTRY") {
            cfi.AutoComplete("DestinationSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectDestination, "contains");
    }
    else if (Destination == "ZONE") {
            cfi.AutoComplete("DestinationSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], OnSelectDestination, "contains");
    }
}

function enableFields() {
    debugger;
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
            // $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
                //clearAgent();
            //  ===end
        
    });
}


function ClearAgent() {
    debugger;
    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {

   
    if (flag != "1") {
        ///   $('#divMultiShipperSNo').remove();
    
        $('#divMultiAccountSNo').remove();
        $("#Text_AccountSNo").val('');
        $("#AccountSNo").val('');

   cfi.AutoComplete("ShipperSNo", "AgentName", "v_WMSShipper", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");

        cfi.AutoComplete("AccountSNo", "AgentName", "vw_RateAgent", "SNo", "AgentName@", ["AgentName"], null, "contains", ",");
        // end here
        if ($("#Text_OfficeSNo").val() != "") {
            //  $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
            $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(false);
            $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
            $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
        }
        else { 
            $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
        $("#Text_AccountGroupSNo").data("kendoAutoComplete").enable(true);
       // $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
        $("#Text_ShipperSNo").data("kendoAutoComplete").enable(true);
        }
    }
    flag = "0";
    }
}
//by arman for gross weight 2017-05-15
function GetULDMinimumGrossWT(obj) {
    if ($("#" + obj).val() == "0" || $("#" + obj).val() == "0.00") {
        ShowMessage('warning', 'Warning - ULDRate', 'Gross Weight should be greater than zero.', "bottom-right");
        $("#" + obj).val("");
        return false;
    }
}
// end


