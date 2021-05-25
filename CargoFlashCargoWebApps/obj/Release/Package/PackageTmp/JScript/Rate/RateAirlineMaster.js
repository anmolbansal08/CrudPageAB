var QueryString = "";
var pageType = $('#hdnPageType').val();
$(function () {
    $("input[type='submit'][name='operation']").attr("onclick", "return ValidateRateAirlineMasterForm();");
    cfi.ValidateForm();
    $('input[name="RateType"][value="1"]:radio').prop("checked", true);
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    cfi.AutoComplete("CommoditySubGroupSNo", "SubGroupName,SNo", "vwCommoditySubGroup", "SNo", "SubGroupName", ["SubGroupName"], null, "contains", null, null, null, null, null);
    //cfi.AutoComplete("CountryCode", "CountryName,CountryCode,SNo", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains", null, null, null, null, OnSelectCountry);
    // cfi.AutoComplete("CommodityPackageSNo", "Name,SNo", "vwCommodityPackage", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "vwAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains", null, null, null, null, null);

    //Name: Anshul verma,  Date: 31-Jan-2017, Work: Add two field Truck Code and AWB Origin Airport.

    cfi.AutoComplete("TruckCode", "CarrierCode,AirlineName", "vwAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains", null, null, null, null, null);


    cfi.AutoComplete("AirportName", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains", ",");

    cfi.BindMultiValue("AirportName", $("#Text_AirportName").val(), $("#AirportName").val());



    //OnSelectAirline
    cfi.AutoComplete("SPHCGroupSNo", "Name,SNo", "vwSPHCGroup", "SNo", "Name", ["Name"], OnSelectSPHCGroupSNo, "contains");
    cfi.AutoComplete("SHCSNo", "Code,SNo", "SPHC", "SNo", "Code", ["Code", "Description"], OnSelectSHCSNo, "contains");
    cfi.AutoComplete("OfficeSNo", "SNo,Name", "VOffice", "SNo", "Name", '[Name]', null, "contains");
    cfi.AutoComplete("AccountSNo", "Name,SNo", "Account", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("AccountGroupSNo", "Name,SNo", "vwAccountGroup", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("OriginZoneSNo", "ZoneName,SNo", "vwZone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
    cfi.AutoComplete("DestinationZoneSNo", "ZoneName,SNo", "vwZone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
    cfi.AutoComplete("OriginCitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains", null, null, null, null);
    cfi.AutoComplete("DestinationCitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains", null, null, null, null);
    cfi.AutoComplete("OriginAirportSNo", "AirportCode,AirportName", "vAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains", null, null, null, null, null);
    cfi.AutoComplete("DestinationAirportSNo", "AirportCode,AirportName", "vAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains", null, null, null, null, null);
    cfi.AutoComplete("ProductSNo", "ProductName,ProductName", "vwProduct", "SNo", "ProductName", null, null, "contains");
    cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyCode", "vwCurrency", "SNo", "CurrencyCode", null, null, "contains");
    cfi.AutoComplete("FlightTypeSNo", "FlightTypename", "vwFlightType", "SNo", "FlightTypename", null, null, "contains");
    cfi.AutoComplete("CommoditySNo", "CommodityCode,SNo", "vCommodity", "SNo", "CommodityDescription", null, null, "contains");

    cfi.AutoComplete("TruckType", "Name,SNo", "vTruckType", "SNo", "Name", null, null, "contains");
    cfi.AutoComplete("SPHC", "Code", "vwManageTariffSPHC", "SNo", "Code", ["Code"], null, "contains", ",");
    checkRateType();

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#Text_CurrencySNo").val(userContext.CurrencyCode);
        $("#CurrencySNo").val(userContext.CurrencySNo);

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        // removeValidationOnTrucking();
        var QueryString = "rateAirlineMasterSNo=" + $("#hdnRateAirlineMasterSNo").val() + "&originAirportSNo=" + ($("#OriginAirportSNo").val() == "" ? "0" : $("#OriginAirportSNo").val()) + "";


        //var QueryString = "rateAirlineMasterSNo=" + $("#hdnRateAirlineMasterSNo").val() + "&originCitySNo=" + ($("#OriginCitySNo").val() == "" ? "0" : $("#OriginCitySNo").val()) + "&originAirportSNo=" + ($("#OriginAirportSNo").val() == "" ? "0" : $("#OriginAirportSNo").val()) + "";


        createRateAirlineTrans(QueryString);


    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

        //removeValidationOnTrucking();
        $("input[type='button'][value='Delete']").hide();
        var QueryString = "rateAirlineMasterSNo=" + $("#hdnRateAirlineMasterSNo").val() + "&originAirportSNo=0";
        //var QueryString = "rateAirlineMasterSNo=" + $("#hdnRateAirlineMasterSNo").val() + "&originCitySNo=0&originAirportSNo=0";
        createRateAirlineTrans(QueryString);
    }
    else {
        QueryString = "rateAirlineMasterSNo=0&originAirportSNo=0";
        //QueryString = "rateAirlineMasterSNo=0&originCitySNo=0&originAirportSNo=0";
        createRateAirlineTrans(QueryString);
        // OnRateTypechange();       
    }

    getRateDueCarrierTrans();
    //if ($('input[name="RateType"]:radio:checked').val() == "1") {
    QueryString = "rateAirlineMasterSNo=" + ($('#hdnRateAirlineMasterSNo').val() == "" ? "0" : $('#hdnRateAirlineMasterSNo').val()) + "&originAirportSNo=0";
    createCustomCharges(QueryString);
    // }

    //$("[id^='tblRateAirlineCustomCharges_Charge_Name']").change(function () {
    //    alert("change1");
    //    var selectedId = $(this).attr('id');
    //    var selectedIndex = $(this).get(0).selectedIndex;
    //    $("#tblRateAirlineCustomCharges tbody tr[id^='tblRateAirlineCustomCharges_Row_'] select[id^='tblRateAirlineCustomCharges_Charge_Name_']").each(function () {
    //        var currentId = $(this).attr('id');
    //        if (selectedId != currentId) {
    //            $("#" + currentId + " option:eq(" + selectedIndex + ")").remove();
    //        }
    //    });
    //});
    $("[id^='tblRateAirlineCustomCharges_Delete']").hide();
    $("[id^='tblRateAirlineCustomCharges_btnAppendRow']").hide();
    $("#tblRateAirlineCustomCharges tbody tr").each(function () {
        $(this).find("[id^=tblRateAirlineCustomCharges_Charge_Name_]").attr("disabled", "disabled");
    });
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

        $("#tblRateAirlineTrans tbody tr").each(function () {
            $(this).find("[id^=tblRateAirlineTrans_Value_]").attr("disabled", "disabled");

        });

        $("#tblRateAirlineCustomCharges tbody tr").each(function () {
            $(this).find("[id^=tblRateAirlineCustomCharges_Value_]").attr("disabled", "disabled");

        });

    }
    //else {
    //    //$("[id^='tblRateAirlineCustomCharges_Delete']").show();
    //    $("[id^='tblRateAirlineCustomCharges_btnAppendRow']").show();
    //}
    $("#Text_CurrencySNo").data("kendoAutoComplete").enable(false);

});
function checkRateType() {

    var rateTypeVal = $("#RateType:checked").val();
    switch (rateTypeVal) {

        case '2':
            cfi.EnableAutoComplete("OfficeSNo", true);
            cfi.EnableAutoComplete("AccountGroupSNo", false);
            break;
        case '3':
            cfi.EnableAutoComplete("OfficeSNo", true);
            cfi.EnableAutoComplete("AccountGroupSNo", true);
            break
        default:
            cfi.EnableAutoComplete("OfficeSNo", false);
            cfi.EnableAutoComplete("AccountGroupSNo", false);
    }
}
function getRateDueCarrierTrans() {
    if ($("#IsGlobalDueCarrier:checked").val() == "0" || $("#IsGlobalDueCarrier").val() == "True") {
        var QueryString = "rateAirlineMasterSNo=" + ($("#hdnRateAirlineMasterSNo").val() == "" ? 0 : $("#hdnRateAirlineMasterSNo").val()) + "";

        createRateDueCarrierTrans(QueryString);
    }
    else {
        $("#tblRateDueCarrierTrans").html('');
    }
}
function ValidateRateAirlineMasterForm() {

    // Assigining Rate Airline Trans data into Hidden Filed tblRateAirlineTrans
    var originZoneSno = $("#OriginZoneSNo").val() == undefined ? "0" : $("#OriginZoneSNo").val();
    var destinationZoneSNo = $("#DestinationZoneSNo").val() == undefined ? "0" : $("#DestinationZoneSNo").val();
    var originCitySNo = $("#OriginCitySNo").val() == undefined ? "0" : $("#OriginCitySNo").val();
    var destinationCitySNo = $("#DestinationCitySNo").val() == undefined ? "0" : $("#DestinationCitySNo").val();
    var originAirportSNo = $("#OriginAirportSNo").val() == undefined ? "0" : $("#OriginAirportSNo").val();
    var destinationAirportSNo = $("#DestinationAirportSNo").val() == undefined ? "0" : $("#DestinationAirportSNo").val();
    var officeSNo = $("#OfficeSNo").val() == undefined ? "0" : $("#OfficeSNo").val();
    var accountGroupSNo = $("#AccountGroupSNo").val() == undefined ? "0" : $("#AccountGroupSNo").val();
    //if ((originZoneSno == "" ? "0" : originZoneSno) == "0" && (originCitySNo == "" ? "0" : originCitySNo) == "0" && (originAirportSNo == "" ? "0" : originAirportSNo) == "0") {
    //    ShowMessage('error', 'Failed!', "Select atleast one among Zone, City and Airport");
    //    return false;
    //}
    //if ((originZoneSno == "" ? "0" : originZoneSno) != "0" && (destinationZoneSNo == "" ? "0" : destinationZoneSNo) == "0") {
    //    ShowMessage('error', 'Failed!', "Select Destination Zone or Unselect both");
    //    return false;
    //}
    //if ((originZoneSno == "" ? "0" : originZoneSno) == "0" && (destinationZoneSNo == "" ? "0" : destinationZoneSNo) != "0") {
    //    ShowMessage('error', 'Failed!', "Select Origin Zone or Unselect both");
    //    return false;
    //}
    //if ((originCitySNo == "" ? "0" : originCitySNo) != "0" && (destinationCitySNo == "" ? "0" : destinationCitySNo) == "0") {
    //    ShowMessage('error', 'Failed!', "Select Destination City or Unselect both");
    //    return false;
    //}
    //if ((originCitySNo == "" ? "0" : originCitySNo) == "0" && (destinationCitySNo == "" ? "0" : destinationCitySNo) != "0") {
    //    ShowMessage('error', 'Failed!', "Select Origin City or Unselect both");
    //    return false;
    //}
    if ((originAirportSNo == "" ? "0" : originAirportSNo) != "0" && (destinationAirportSNo == "" ? "0" : destinationAirportSNo) == "0") {
        //ShowMessage('error', 'Failed!', "Select Destination Airport or Unselect both");
        return false;
    }
    if ((originAirportSNo == "" ? "0" : originAirportSNo) == "0" && (destinationAirportSNo == "" ? "0" : destinationAirportSNo) != "0") {
        //ShowMessage('error', 'Failed!', "Select Origin Airport or Unselect both");
        return false;
    }
    var rateTypeVal = $("#RateType:checked").val();
    switch (rateTypeVal) {

        case '2':
            if ((officeSNo == "" ? "0" : officeSNo) != "0") {
                ShowMessage('error', 'Failed!', "Select Office Name");
                return false;
            }
            break;
        case '3':
            if ((accountGroupSNo == "" ? "0" : accountGroupSNo) != "0") {
                ShowMessage('error', 'Failed!', "Select Account Group Name");
                return false;
            }
            break

    }

    var rateAirlineUpdatedRows = new Array();
    var isValidate = true;
    $("#tblRateAirlineTrans tr").each(function (index, val) {
        var rateAirlineSlabId = $(this).find("input[type='text'][id*='Value']").attr("Id");
        var rateAirlineSlabIdArray = new Array();
        var rateAirlineSlabValue = $(this).find("input[type='text'][id*='Value']").val();
        if (rateAirlineSlabValue != undefined && parseFloat(rateAirlineSlabValue) == "0") {
            $(this).find("[id^='_temptblRateAirlineTrans_Value_" + parseFloat(index - 1) + "']").css("border-color", "red");
            isValidate = false;
        }
        //$(this).find("[id^='_temptblRateAirlineTrans_Value_" + parseFloat(index - 1) + "']").removeAttr("data-valid", "required");
        $(this).find("[id^='_temptblRateAirlineTrans_Value_" + parseFloat(index - 1) + "']").css("border-color", "");
        if (rateAirlineSlabId != undefined && parseFloat(rateAirlineSlabValue) >= 0) {
            rateAirlineSlabIdArray = rateAirlineSlabId.split('_');
            if (rateAirlineSlabIdArray.length > 0)
                rateAirlineUpdatedRows.push(rateAirlineSlabIdArray[rateAirlineSlabIdArray.length - 1]);
        }
    });

    // Anshul Bug 7345 Truck rate-Prompt is wrong 

    if (isValidate == false) { ShowMessage('error', '', "Enter Value in Slab Information"); return false; }
    var strData = staticTableToJSON("tblRateAirlineTrans", "SNo,SlabName,StartWeight,EndWeight,Value", "hidden,label,label,label,text", rateAirlineUpdatedRows);
    $("#hdnRateAirlineTrans").val(strData);
    rateAirlineUpdatedRows = [];
    $("#tblRateDueCarrierTrans tr").each(function () {
        var rateAirlineSlabId = $(this).find("input[type='text'][id*='Value']").attr("Id");
        var rateAirlineSlabIdArray = new Array();
        var rateAirlineSlabValue = $(this).find("input[type='text'][id*='Value']").val();
        //if (rateAirlineSlabValue != undefined && parseFloat(rateAirlineSlabValue) <= 0)
        //    ShowMessage('error', 'Failed!', "Enter Value in Slab Information");
        if (rateAirlineSlabId != undefined && parseFloat(rateAirlineSlabValue) > 0) {
            rateAirlineSlabIdArray = rateAirlineSlabId.split('_');
            if (rateAirlineSlabIdArray.length > 0)
                rateAirlineUpdatedRows.push(rateAirlineSlabIdArray[rateAirlineSlabIdArray.length - 1]);
        }
    });
    strData = staticTableToJSON("tblRateDueCarrierTrans", "SNo,HdnName,IsChargeableWeight,Value,MinimumValue,ValidFrom,ValidTo", "hidden,hidden,radiolist,text,text,text,text", rateAirlineUpdatedRows);
    $("#hdnRateDueCarrierTrans").val(strData);

    rateAirlineUpdatedRows = [];
    $("#tblRateAirlineCustomCharges tr").each(function () {

        var rateAirlineSlabId = $(this).find("input[type='text'][id*='Value']").attr("Id");
        var rateAirlineSlabIdArray = new Array();
        var rateAirlineSlabValue = $(this).find("input[type='text'][id*='Value']").val();
        //if (rateAirlineSlabValue != undefined && parseFloat(rateAirlineSlabValue) == "") {
        //    //ShowMessage('error', 'Failed!', "Enter Value in Custom Charge Information");
        //    return false;
        //}
        if (rateAirlineSlabId != undefined && parseFloat(rateAirlineSlabValue) >= 0) {
            rateAirlineSlabIdArray = rateAirlineSlabId.split('_');
            if (rateAirlineSlabIdArray.length > 0)
                rateAirlineUpdatedRows.push(rateAirlineSlabIdArray[rateAirlineSlabIdArray.length - 1]);
        }
    });
    strData = staticTableToJSON("tblRateAirlineCustomCharges", "SNo,RateAirlineMasterSNo,Charge_Name,Value", "hidden,hidden,select,text", rateAirlineUpdatedRows);
    $("#hdnRateAirlineCustomCharges").val(strData);



}
function GetUnique(inputArray) {
    var outputArray = [];
    for (var i = 0; i < inputArray.length; i++) {


        if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
            outputArray.push(inputArray[i]);
        }
    }
    return outputArray;
}

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

})
function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
            //new Date(start.setDate(start.getDate() + 1))
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
            //new Date(start.setDate(start.getDate() + 1))
        });
    }
}

function ExtraCondition(textId) {
    //$("#Text_CommoditySNo").val('');
    //$("#CommoditySNo").val('');
    var f = cfi.getFilter("AND");

    // ANshul Verma 22Feb 2017 Add Truck COde

    if (textId == "Text_TruckCode") {
        try {

            cfi.setFilter(f, "SNo", "eq", 342)
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }



    if (textId == "Text_CommoditySNo") {
        try {
            cfi.setFilter(f, "SNo", "neq", $("#OriginZoneSNo").val())
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
    if (textId == "Text_OriginZoneSNo") {
        cfi.ResetAutoComplete("OriginCitySNo");
        cfi.ResetAutoComplete("OriginAirportSNo");
    }
    if (textId == "Text_OriginCitySNo") {
        try {
            cfi.ResetAutoComplete("OriginAirportSNo");
            if ($("#Text_OriginZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#OriginZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }
    if (textId == "Text_OriginAirportSNo") {
        try {
            if ($("#Text_OriginCitySNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "CitySNo", "eq", $("#OriginCitySNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
        try {
            if ($("#Text_OriginZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#OriginZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }
    if (textId == "Text_DestinationZoneSNo") {
        cfi.ResetAutoComplete("DestinationCitySNo");
        cfi.ResetAutoComplete("DestinationAirportSNo");
    }
    if (textId == "Text_DestinationCitySNo") {
        try {
            cfi.ResetAutoComplete("DestinationAirportSNo");
            if ($("#Text_DestinationZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#DestinationZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }


    if (textId == "Text_DestinationAirportSNo") {
        try {
            if ($("#Text_DestinationCitySNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "CitySNo", "eq", $("#DestinationCitySNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
        try {
            if ($("#Text_DestinationZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#DestinationZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }

    //if (textId == "Text_DestinationCitySNo") {
    //    try {
    //        cfi.setFilter(f, "SNo", "neq", $("#OriginCitySNo").val())
    //        return cfi.autoCompleteFilter([f]);
    //    }
    //    catch (exp)  
    //    { }
    //}

    //if (textId == "Text_DestinationAirportSNo") {
    //    try {
    //        cfi.setFilter(f, "SNo", "neq", $("#OriginAirportSNo").val())
    //        return cfi.autoCompleteFilter([f]);
    //    }
    //    catch (exp)
    //    { }
    //}

    // Anshul 21 Feb Bug 7344 Truck rate-Origin and destination cannot be same.


    if (textId == "Text_OriginAirportSNo") {
        try {
            cfi.setFilter(f, "SNo", "neq", $("#DestinationAirportSNo").val())
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }



}
function OnSelectSHCSNo() {
    $("#Text_SPHCGroupSNo").val('');
}
function OnSelectSPHCGroupSNo() {
    $("#Text_SHCSNo").val('');
}
function OnSelectAirport(e) {
    var QueryString = "";
    var Data = this.dataItem(e.item.index());
    $("#AccountSNo").val('');
    $("#Text_AccountSNo").val('');
    $("#Name").val('');
    QueryString = "rateAirlineMasterSNo=" + ($("#AirlineSNo").val() == "" ? "0" : $("#AirlineSNo").val()) + "&originCitySNo=" + ($("#OriginCitySNo").val() == "" ? "0" : $("#OriginCitySNo").val()) + "&originAirportSNo=" + Data.Key + "";
    //var QueryString = "airlineSNo=" + $('#AirlineSNo').val() + "&originCitySNo=" + $('#OriginCitySNo').val() + "&originAirportSNO=" + $('#OriginAirportSNo').val();
    //var QueryString = "rateAirlineMasterSNo=0&originCitySNo=0&originAirportSNO=" + Data.Key;
    createRateAirlineTrans(QueryString);
    $.ajax({
        type: "POST",
        url: "./Services/Master/AccountTargetService.svc/GetAccount?recid=" + Data.Key,
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            var SNo = response.Data[0];
            var Name = response.Data[1];
            CitySno = response.Data[2];
            $("#AccountSNo").val(SNo);
            $("#Text_AccountSNo").val(Name);
            $("#Name").val(Name);

        }
    });
}
function OnSelectAirline(e) {
    var Data = this.dataItem(e.item.index());
    var QueryString = "rateAirlineMasterSNo=" + Data.Key + "&originCitySNo=" + ($("#OriginCitySNo").val() == "" ? "0" : $("#OriginCitySNo").val()) + "&originAirportSNo=" + ($("#OriginAirportSNo").val() == "" ? "0" : $("#OriginAirportSNo").val()) + "";
    createRateAirlineTrans(QueryString);
}

function createRateAirlineTrans(QueryString) {
    // Initialize appendGrid
    var dbTableName = 'RateAirlineTrans';
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: true,
        tableColumns: 'SNo,SlabName,StartWeight,EndWeight,Value',
        masterTableSNo: 1,// $('#hdnRateAirlineMasterSNo').val() == "" ? "0" : $('#hdnRateAirlineMasterSNo').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        isGetRecord: true,
        servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Slab Information',
        initRows: 1,
        // column for edit
        //{ name: 'SubGroupName', display: 'Sub Group Name', type: 'autocomplete', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px' }, onChange: function (evt, rowIndex) { updatedRows[updatedRows.length] = rowIndex + 1; }, tableName: 'CommodityGroup', textColumn: 'GroupName', keyColumn: 'SNo' },
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
              { name: 'SlabName', display: 'Slab Name', type: 'label', value: 0, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '100px', 'text-align': 'center' }, onChange: function (evt, rowIndex) { } },
                  { name: 'StartWeight', display: 'Start Unit', type: 'label', value: 0, ctrlAttr: { maxlength: 18 }, ctrlCss: { width: '100px', 'text-align': 'center' }, isRequired: false },
                  { name: 'EndWeight', display: 'End Unit', type: 'label', value: 0, ctrlAttr: { maxlength: 18 }, ctrlCss: { width: '100px', 'text-align': 'center' }, onChange: function (evt, rowIndex) { }, isRequired: false },

                  { name: 'Value', display: 'Value', type: 'text', ctrlAttr: { maxlength: 18, controltype: 'number' }, ctrlCss: { width: '40px', 'text-align': 'center' }, onChange: function (evt, rowIndex) { }, isRequired: true },

        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: true, removeLast: true }
    });
    // load data
    getRecordQueryString(QueryString, 'tblRateAirlineTrans');
    //showPage(1);
}
$("input[name='RateType']:radio").on('change', function () {
    // OnRateTypechange();
});
function createRateDueCarrierTrans(QueryString) {
    // Initialize appendGrid

    var dbTableName = 'RateDueCarrierTrans';
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,StartWeight,EndWeight,Value',
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Carrier Information',
        initRows: 1,
        // column for edit
        //{ name: 'SubGroupName', display: 'Sub Group Name', type: 'autocomplete', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px' }, onChange: function (evt, rowIndex) { updatedRows[updatedRows.length] = rowIndex + 1; }, tableName: 'CommodityGroup', textColumn: 'GroupName', keyColumn: 'SNo' },
        columns: [
            { name: 'HdnName', type: 'hidden' },
            { name: 'SNo', type: 'hidden', value: 0 },

                  { name: 'IsMandatory', type: 'hidden', value: 0 },
                  { name: 'Name', display: 'Due Carrier Name', type: 'text', ctrlAttr: { maxlength: 150, controltype: 'autocomplete' }, ctrlCss: { width: '150px' }, tableName: 'VDueCarrierNonMandatory', textColumn: 'Name', keyColumn: 'SNo', onSelect: selectDueCarrier, onChange: function (evt, rowIndex) { } },
                  { name: 'FreightType', display: 'Freight Type', type: 'label' },
                  { name: 'Value', display: 'Rate/Kg', type: 'text', value: 0, ctrlAttr: { maxlength: 18, controltype: 'decimal3', textmode: 'Multiline' }, ctrlCss: { width: '40px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                  { name: 'MinimumValue', display: 'Minimum Value', type: 'text', value: 0, ctrlAttr: { maxlength: 18, controltype: 'decimal3' }, ctrlCss: { width: '40px' }, onChange: function (evt, rowIndex) { }, isRequired: true },

                 //{ name: pageType == 'Edit' ? 'ChargeableWeight' : 'IsChargeableWeight', display: 'Based On', type: 'radiolist', ctrlOptions: { 1: 'Ch. Wt.', 0: 'Gr. Wt.' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },

                   { name: 'IsChargeableWeight', display: 'Based On', type: 'radiolist', ctrlOptions: { 1: 'Ch. Wt.', 0: 'Gr. Wt.' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },

                  { name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' } },
                  { name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' } },
        ],

        isPaging: false,
        hideButtons: {

            removeLast: true,
            insert: true,
            updateAll: true

        },


    });
    // load data
    getRecordQueryString(QueryString, 'tblRateDueCarrierTrans');
    $("#tblRateDueCarrierTrans").find('input[type="hidden"][id*="IsMandatory"]').each(function () {
        if ($(this).val() == "true") {
            $(this).closest("tr").find('input[id*="Name"]').removeClass("k-input");
            $(this).closest("tr").find('input[id*="Name"]').attr('readonly', 'true');
            $(this).closest("tr").find('input[id*="Name"]').attr("style", "readonly:true;display:block;border:0px");
            $(this).closest("tr").find('input[id*="Name"]').parent().children(':first').find('span.k-select').html("");
            $(this).closest("tr").find('button[id*="Delete"]').attr('style', 'visibility:hidden');
        }

    });

    // showPage(1);
}
function selectDueCarrier(e) {
    var Data = this.dataItem(e.item.index());
    var id = this.element[0].name;
    var nameArray = id.split('_');
    var freightTypeID = "";
    if (nameArray.length > 2) freightTypeID = nameArray[0] + "_" + "FreightType" + "_" + nameArray[2];
    $.ajax({
        type: "GET",
        url: "./Services/Rate/RateDueCarrierTransService.svc/GetFreightType?recid=" + Data.Key,
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            $("#" + freightTypeID).text(response);
            $('#' + nameArray[0]).appendGrid('setCtrlValue', 'FreightType', nameArray[2], response);

        }
    });
}
function staticGetJSONDataString(tableName, colName, type, rIndex) {
    var str = '';
    if (type == 'radio' || type == 'checkbox')
        str += '"' + colName + '":"' + (document.getElementById(tableName + '_' + colName + '_' + rIndex).checked ? 1 : 0) + '"';
    else if (type == 'autocomplete') {
        str += '"Hdn' + colName + '":"' + $('#' + tableName + '_Hdn' + colName + '_' + rIndex).val() + '",';
        str += '"' + colName + '":"' + $('#' + tableName + '_' + colName + '_' + rIndex).val() + '"';
    }
    else if (!isEmpty($('#' + tableName + '_' + colName + '_' + rIndex).attr('data-role')) && $('#' + tableName + '_' + colName + '_' + rIndex).attr('data-role') == 'numerictextbox') {
        str += '"' + colName + '":"' + $('#_temp' + tableName + '_' + colName + '_' + rIndex).val() + '"';
    }
    else if (type == 'label') {
        str += '"' + colName + '":"' + $('#' + tableName + '_' + colName + '_' + rIndex).text() + '"';
    }
    else if (type == 'radiolist') {
        str += '"' + colName + '":"' + $('input[id^=' + tableName + '_Rbtn' + colName + '_' + rIndex + ']:checked').val() + '"'
    }
    else
        str += '"' + colName + '":"' + $('#' + tableName + '_' + colName + '_' + rIndex).val() + '"';
    return str;
}
function getRecordQueryString(QueryString, id) {

    //+ "&pageNo=" + (settings.currentPage == null ? 1 : settings.currentPage) + "&pageSize=" + (settings.itemsPerPage == null ? 10 : settings.itemsPerPage) + "&whereCondition=" + (settings.whereCondition == null ? '' : settings.whereCondition) + "&sort=" + (settings.sort == null ? '' : settings.sort)
    var settings = $("#" + id).data('appendGrid');
    // if (settings != null)

    $.ajax({
        type: "GET",
        async: false,
        cache: false,
        url: settings.servicePath + "/" + settings.getRecordServiceMethod + "?" + QueryString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.key >= 0)
                $('#' + settings.tableID).appendGrid('load', data.value);
            else if (document.getElementById('btnUpdateAll') != null)
                document.getElementById('btnUpdateAll').style.display = 'none';
            totalRows = data.key;
            if (settings.isPaging && !isDataLoad && settings.currentPage == 1)//
                showPage(settings.currentPage);
            settings.isDataLoad = true;
            if (typeof (settings.rowUpdateExtraFunction) == 'function') {
                settings.rowUpdateExtraFunction(settings.idPrefix);
            }
        },
        error: function (err) {
            debugger;
        }
    });
}
function staticTableToJSON(tableName, colName, colType, uRows) {
    try {
        uRows = GetUnique(uRows);
        var colName = colName.split(',');
        var colType = colType.split(',');
        var noOfRows;
        if (!$.isArray(uRows)) {
            noOfRows = new Array();
            noOfRows[0] = uRows;
        }
        else
            noOfRows = uRows;
        var strJSON = '[';
        for (var row = 0; row < noOfRows.length; row++) {
            strJSON += '{';
            for (var col = 0; col < colName.length; col++) {
                if (colName[col].type == 'div') {
                    for (var d = 0; d < colName[col].divElements.length; d++) {
                        if (colName[col].divElements[d].type != 'label') {
                            strJSON += getJSONDataString(tableName, colName[col].divElements[d], colName[col].divElements[d].type, noOfRows[row]);
                            if (d < (colName[col].divElements.length - 1))
                                strJSON += ',';
                        }
                    }
                }
                else {

                    strJSON += staticGetJSONDataString(tableName, colName[col], colType[col], noOfRows[row]);

                }
                if (col < (colName.length - 1))
                    strJSON += ',';
            }
            strJSON += '}';
            if (row < noOfRows.length - 1)
                strJSON += ',';
        }
        // }
        strJSON += ']';
        return strJSON;
    }
    catch (e) { return '[]'; }
}
function removeValidationOnTrucking() {
    if ($('input[name="RateType"]:radio:checked').val() == "1") {

        /*Remove validation*/
        $("#RateClassCode").removeAttr("data-valid");
        $("#spnRateClassCode").closest("td").find("font").html('');

        $("#Text_CommoditySubGroupSNo").removeAttr("data-valid");
        $("#spnCommoditySubGroupSNo").closest("td").find("font").html('');


        $("#Text_CommoditySNo").removeAttr("data-valid");
        $("#spnCommoditySNo").closest("td").find("font").html('');



        $("#Text_ProductSNo").removeAttr("data-valid");
        $("#spnProductSNo").closest("td").find("font").html('');


        $("#Text_SHCSNo").removeAttr("data-valid");
        $("#spnSHCSNo").closest("td").find("font").html('');

        $("#Text_SPHCGroupSNo").removeAttr("data-valid");
        $("#spnSPHCGroupSNo").closest("td").find("font").html('');


        $("#Text_FlightTypeSNo").removeAttr("data-valid");
        $("#spnFlightTypeSNo").closest("td").find("font").html('');

        $("#spnTax").removeAttr("data-valid");
        $("#spnTax").closest("td").find("font").html('');


        $("#Remarks").removeAttr("data-valid");
        $("#spnRemarks").closest("td").find("font").html('');

        $("#Tax").removeAttr("data-valid");
        $("#spnTax").closest("td").find("font").html('');



        $("#Text_AccountSNo").removeAttr("data-valid");


        /*Set value for Global Due carrier*/
        $("input:radio[id='IsGlobalDueCarrier'][value='0']").attr("checked", "checked");
        //$("input:radio[id='IsGlobalDueCarrier']").attr("disabled", "disabled");

        //$("input:radio[id='IsGlobalSurCharge'][value='0']").attr("checked", "checked");
        //$("input:radio[id='IsGlobalSurCharge']").attr("disabled", "disabled");
        $("#tblRateDueCarrierTrans").html('');


    }
    else {
        /*Remove validation*/
        $("#RateClassCode").attr("data-valid", "required");
        $("#spnRateClassCode").closest("td").find("font").html('*');

        $("#Text_CommoditySubGroupSNo").attr("data-valid", "required");
        $("#spnCommoditySubGroupSNo").closest("td").find("font").html('*');

        $("#Text_CommoditySNo").attr("data-valid", "required");
        $("#spnCommoditySNo").closest("td").find("font").html('*');

        $("#Text_ProductSNo").attr("data-valid", "required");
        $("#spnProductSNo").closest("td").find("font").html('*');

        $("#Text_SHCSNo").attr("data-valid", "required");
        $("#spnSHCSNo").closest("td").find("font").html('*');

        $("#Text_SPHCGroupSNo").attr("data-valid", "required");
        $("#spnSPHCGroupSNo").closest("td").find("font").html('*');


        $("#Text_FlightTypeSNo").attr("data-valid", "required");
        $("#spnFlightTypeSNo").closest("td").find("font").html('*');


        $("#Tax").removeAttr("data-valid", "required");
        $("#spnTax").closest("td").find("font").html('*');


        $("#Remarks").removeAttr("data-valid");
        $("#spnRemarks").closest("td").find("font").html('');

        $("#Text_AccountSNo").removeAttr("data-valid");

        /*Set value for Global Due carrier*/
        $("input:radio[id='IsGlobalDueCarrier'][value='0']").attr("checked", "checked");
        $("input:radio[id='IsGlobalDueCarrier']").attr("disabled", false);
        $("input:radio[id='IsGlobalSurCharge'][value='0']").attr("checked", "checked");
        $("input:radio[id='IsGlobalSurCharge']").attr("disabled", false);

    }
}
function OnRateTypechange() {
    if ($('input[name="RateType"]:radio:checked').val() == "1") {
        // removeValidationOnTrucking();
        var QueryString = "rateAirlineMasterSNo=116&originCitySNo=0&originAirportSNo=0";
        createRateAirlineTrans(QueryString);

    }
    else {
        // removeValidationOnTrucking();
        var QueryString = "rateAirlineMasterSNo=" + ($("#AirlineSNo").val() == "" ? 0 : $("#AirlineSNo").val()) + "";
        createRateAirlineTrans(QueryString);
        createRateDueCarrierTrans(QueryString);
        $("#tblRateAirlineCustomCharges").html('');
    }

}
function createCustomCharges(QueryString) {
    // Initialize appendGrid   
    var dbTableName = 'RateAirlineCustomCharges';
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: true,
        tableColumns: 'SNo,Minimum,Maximum,Value',
        masterTableSNo: 1,// $('#hdnRateAirlineMasterSNo').val() == "" ? "0" : $('#hdnRateAirlineMasterSNo').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        isGetRecord: true,
        servicePath: './Services/Rate/' + dbTableName + 'Service.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Custom Charge Information',
        initRows: 1,
        // column for edit
        //{ name: 'SubGroupName', display: 'Sub Group Name', type: 'autocomplete', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px' }, onChange: function (evt, rowIndex) { updatedRows[updatedRows.length] = rowIndex + 1; }, tableName: 'CommodityGroup', textColumn: 'GroupName', keyColumn: 'SNo' },
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'RateAirlineMasterSNo', type: 'hidden', value: 0 },
            {
                name: 'Charge_Name', display: 'Charge Name', type: 'select', ctrlOptions: { 'IPTA Charge': 'IPTA Charge', 'OAC Charge': 'OAC Charge', 'CSL Charge': 'CSL Charge' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, onChange: function (evt, rowIndex) {


                    $("#tblRateAirlineCustomCharges tbody tr[id^=tblRateAirlineCustomCharges_Row_]").each(function (index, val) {
                        if (rowIndex != index) {
                            var value = $('#tblRateAirlineCustomCharges_Charge_Name_' + parseInt(rowIndex + 1) + " :selected").val();
                            $('#tblRateAirlineCustomCharges_Charge_Name_' + parseInt(parseInt(index) + parseInt(1)) + " option[value='" + value + "']").remove();
                        }

                    });
                    //alert("OnCHange");
                    //var selectedId = $(this).attr('id');
                    //var selectedIndex = $(this).get(0).selectedIndex;
                    //$("#tblRateAirlineCustomCharges tbody tr[id^='tblRateAirlineCustomCharges_Row_'] select[id^='tblRateAirlineCustomCharges_Charge_Name_']").each(function () {
                    //    var currentId = $(this).attr('id');
                    //    if (selectedId != currentId) {
                    //        $("#" + currentId + " option:eq(" + selectedIndex + ")").remove();
                    //    }
                    //});
                }

            },
                  //{ name: 'Minimum', display: 'Minimum', type: 'label', value: 0, ctrlAttr: { maxlength: 18 }, ctrlCss: { width: '100px', 'text-align': 'center' }, isRequired: false },
                  //{ name: 'Maximum', display: 'Maximum', type: 'label', value: 0, ctrlAttr: { maxlength: 18 }, ctrlCss: { width: '100px', 'text-align': 'center' }, onChange: function (evt, rowIndex) { }, isRequired: false },

                  { name: 'Value', display: 'Value', type: 'text', value: 0, ctrlAttr: { maxlength: 18, controltype: 'text' }, ctrlCss: { width: '40px', 'text-align': 'center' }, onChange: function (evt, rowIndex) { }, Required: true },

        ],
        isPaging: false,
        hideButtons: {

            removeLast: true,
            insert: true,
            updateAll: true

        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            if ($("#tblRateAirlineCustomCharges tbody tr[id^=tblRateAirlineCustomCharges_Row_]").length == 4) {
                $("#tblRateAirlineCustomCharges tbody tr[id^=tblRateAirlineCustomCharges_Row_]:last").remove();
            }

            if (parseInt(parentRowIndex) >= 0) {
                $("#tblRateAirlineCustomCharges tbody tr[id^=tblRateAirlineCustomCharges_Row_]").each(function (index, val) {
                    if (addedRowIndex == index) {
                        return false;
                        var value = $('#tblRateAirlineCustomCharges_Charge_Name_' + parseInt(index + 1) + " :selected").val();
                        $('#tblRateAirlineCustomCharges_Row_' + parseInt(parseInt(addedRowIndex) + parseInt(1))).remove();
                    }

                });


            }
        }
    });
    // load data
    getRecordQueryString(QueryString, 'tblRateAirlineCustomCharges');
    //showPage(1);


}
//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};
function CheckValidation(obj) {
    var startValue = 0;
    var endValue = 0;

    if (!$("#" + obj).val()) {
        $("#" + obj).attr("required", "required");
        $("#_temp" + obj).attr("required", "required");
    }
    else {
        $("#" + obj).removeAttr("required");
        $("#_temp" + obj).removeAttr("required");
        $("#" + obj).removeAttr("required");
    }

    if (obj.indexOf("Start") >= 0) {
        startValue = $("#" + obj).val();
        endValue = $("#" + obj.replace("Start", "End")).val();
    }
    else {
        endValue = $("#" + obj).val();
        startValue = $("#" + obj.replace("End", "Start")).val();
    }
    if (parseFloat(startValue) > parseFloat(endValue)) {
        alert("Start Range can not be greater than End Range.");
        $("#" + obj).val("");
    }
}