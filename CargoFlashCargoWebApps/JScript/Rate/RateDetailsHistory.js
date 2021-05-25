
$(document).ready(function () {
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    //cfi.ValidateForm();
    //$("#IsTaxable").after('Taxable');
    //$("#IsCommissionable").after('Commissionable');
    $("#Search").after('<input type="button" name="Search" id="Search" value="VIEW" class="btn btn-success">')
    BindAutoComplete();
    //$('#MasterSaveAndNew').after('<input type="button" id="btnSaveDueMaster" name="btnSaveDueMaster" value="Save" class="btn btn-success">');
    //$("input[type='submit'][name='operation']").hide();
    //$("#tbl .formSection").append('<span id="spnShiftTime" style="padding-left:400px;">Shift Start Date Time <input name="StartDate" id="StartDate" type="text" /> Shift End Date Time <input name="EndDate" id="EndDate" type="text" /></span>');

    $("#Text_AllotmentSNo").closest("span").hide();
    $("#Text_OriginType").val("AIRPORT");
    $("#Text_DestinationType").val("AIRPORT");
    $("#OriginType").val("1");
    $("#DestinationType").val("1");
    var todaydate = new Date();
    var validfromdate = $("#ValidFrom").data("kendoDatePicker");
    //validfromdate.min(todaydate);
    var validTodate = $("#ValidTo").data("kendoDatePicker");
    //validTodate.min(todaydate);
    $("#ValidFrom").attr('readonly', true);
    $("#ValidTo").attr('readonly', true);


    $("tr[id^='tblRateBase_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblRateBase_RateClassSNo_']").val("");
        $(tr).find("input[id^='tblRateBase_Rate_']").val("");
        $(tr).find("input[id^='_temptblRateBase_Rate_']").val("");
        $(tr).find("input[id^='tblRateBase_Based_']").val("");
    });


});

function BindAutoComplete() {
    //cfi.AutoComplete("AirlineSNo", "AirlineName", "vwAirlineCurrencyDetails", "SNo", "AirlineName");
    //cfi.AutoComplete("AirlineSNo", "SNo", "vwAirlineDetails", "SNo", "AirlineName");
    // Changes by Vipin Kumar
    //cfi.AutoComplete("AirlineSNo", "SNo", "GetAirline_isinterline", "SNo", "airlinename", ["CarrierCode", "airlinename"], null, null);   // add carriercode
    cfi.AutoCompleteV2("AirlineSNo", "SNo", "RateDetailsHistory_Airline", null, null);   // add carriercode
    //cfi.AutoComplete("OfficeSNo", "SNo", "Office", "SNo", "Name", ["CityCode", "Name"], null, null);
    cfi.AutoCompleteV2("OfficeSNo", "SNo", "RateDetailsHistory_Office", null, null);
    //Ends
    var ChargeList = [{ Key: "1", Text: "DueCarrier" }, { Key: "2", Text: "DueAgent" }]
    cfi.AutoCompleteByDataSource("Charge", ChargeList);
    // Changes by Vipin Kumar
    //cfi.AutoComplete("RateTypeSNo", "RateTypeName", "RateType", "SNo", "RateTypeName", ["RateTypeName"], null, null);
    cfi.AutoCompleteV2("RateTypeSNo", "RateTypeName", "RateDetailsHistory_RateType", null, null);
    //Ends
    // cfi.AutoComplete("OCCodeSNo", "Code,Name", "vwDueCarrierDetails", "SNo", "Name", ["Code", "Name"], onChangeOtherCharges, "contains");
    // Changes by Vipin Kumar
    //cfi.AutoComplete("OCCodeSNo", "SNo", "DueCarrier", "SNo", "Name", ["Code", "Name"], null, null);
    cfi.AutoCompleteV2("OCCodeSNo", "SNo", "RateDetailsHistory_DueCarrier", null, null);
    cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
    cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
    //cfi.AutoComplete("OriginSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", null, OnSelectOrigin, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode", "RateDetailsHistory_Airport", OnSelectOrigin, "contains");
    //cfi.AutoComplete("DestinationSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", null, OnSelectDestination, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode", "RateDetailsHistory_Airport", OnSelectDestination, "contains");
    
    cfi.AutoCompleteByDataSource("Active", Active, null, null);
    //cfi.AutoComplete("CurrencySNo", "CurrencyCode", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
    cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode", "RateDetailsHistory_Currency", null, "contains");
    //Ends
    //------------ set Active for Stauus  By Arman Ali Date 2017-05-07 -----------
    $("#Active").val('0');
    $("#Text_Active").val('Active');
    $("#AirlineSNo").val(userContext.AirlineSNo);
    $("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
}

$(document).on("click", "#Search", function () {
    if ($('#tblOtherChargesHistoryView').length) {
        $('#tblOtherChargesHistoryView').remove();
        $('#divOtherChargesHistory').remove();
        $('#tbl').after("<br/><div id='divOtherChargesHistory' style='height:350px; width:100%; overflow:auto'><table width=100% id='tblOtherChargesHistoryView'></table></div><br/>")
        //$('#Search').after("<br/><div id='divOtherChargesHistory' style='height:100px; overflow:auto'><table id='tblOtherChargesHistoryView'></table></div><br/>")
        //$('#tbl').after("<br/><div id='divFirst'></div><br/>")
        //$('#divOtherChargesHistory').style.width = '1500px';
        //$('#divOtherChargesHistory').style.height = '500px';
        //$('#divOtherChargesHistory').width('1500px');
        getOtherChargesHistoryData();
        //abc();
    }
    else {
        $('#tbl').after("<br/><div id='divOtherChargesHistory' style='height:350px; width:100%; overflow:auto'><table width=100% id='tblOtherChargesHistoryView'></table></div><br/>")
        //$('#Search').after("<br/><div id='divOtherChargesHistory' style='height:100px; overflow:auto'><table id='tblOtherChargesHistoryView'></table></div><br/>")
        //$('#tbl').after("<br/><div id='divFirst'></div><br/>")

        //$('#divOtherChargesHistory').style.width = '1500px';
        //$('#divOtherChargesHistory').style.height = '500px';
        //$('#divFirst').css('clientwidth', '1500');
        //$('#divFirst').css('style', 'overflow-y: auto');
        //$('#divOtherChargesHistory').css('width', '100%');
        //$('#divFirst').attr('style', 'width:1500');
        //divelement.appendChild('#divOtherChargesHistory');
        //$("#divOtherChargesHistory").css('width', '500px');
        //$('#tbl').after("<br/><div id='divOtherChargesHistory' style='height:100px overflow:auto'><table id='tblOtherChargesHistoryView'><tr id='RowCaption'><td id='ColCaption'>Other Charges History View Details</td></tr><tr id='Row2'><td id='ColRow2'><div id='divDetailView' style='height:100px overflow:auto'><table id='tblDetailView'></table></div></td></tr></table></div><br/>")
        //$("#divOtherChargesHistory").scrollTop($("#divOtherChargesHistory")[300].scrollHeight);
        getOtherChargesHistoryData();
        //abc();
    }

});

function onChangeOtherCharges() {
    if ($("#OCCodeSNo").val() != "") {
        if ($("#OCCodeSNo").val().split('-')[1] == '1') {
            $("#IsOtherChargeMandatory").attr('checked', true);
        }
        else {
            $("#IsOtherChargeMandatory").attr('checked', false);
        }
    }
    else {
        $("#IsOtherChargeMandatory").attr('checked', false);
    }
}

function onSelectAllotment(input) {
    if ($("#Text_RateTypeSNo").val() == "ALLOTMENT") {
        $("#Text_AllotmentSNo").closest("span").show();
    }
    else {
        $("#Text_AllotmentSNo").closest("span").hide();
    }
}
function GetAllotmentType() {
    var AllotmentSNo = $("#AllotmentSNo").val();
    $.ajax({
        url: "Services/Rate/RateService.svc/GetAllotmentType?AllotmentSNo=" + AllotmentSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            var ResultData = jQuery.parseJSON(result);
            $("#Text_AllotmentSNo").after("<span style='padding-left:40px;font-weight:BOLD;'>" + ResultData.Table0[0].AllotmentType + "</span>");


        }
    });
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
    // CreateSlabGrid(Origin, $("#OriginSNo").val());  // commented by arman ali   Date 2017-07-05

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
}


var FlightType = [{ Key: "", Text: "" }]
var UOM = [{ Key: "0", Text: "Kg" }, { Key: "1", Text: "Lbs" }];
var PaymentType = [{ Key: "1", Text: "PP" }, { Key: "2", Text: "CC" }];
var ChargeType = [{ Key: "0", Text: "Flat Charges" }, { Key: "1", Text: "Per Piece" }, { Key: "2", Text: "Weight Slab" }, { Key: "3", Text: "Per House" }, { Key: "4", Text: "Chargeable Weight" }, { Key: "5", Text: "Gross Weight" }];
var ChargeApplyOn = [{ Key: "1", Text: "Freight" }, { Key: "2", Text: "Declare Value" }, { Key: "2", Text: "Due Agent" }];
var RateBaseName = [{ Key: "0", Text: "Per AWB" }, { Key: "1", Text: "On Gross Wt." }, { Key: "2", Text: "Per Piece" }, { Key: "0", Text: "On Chargable Wt." }];
var Active = [{ Key: "0", Text: "Active" }, { Key: "1", Text: "Draft" }, { Key: "2", Text: "In Active" }, { Key: "3", Text: "Expire" }];
var RateCard = [{ Key: "0", Text: "IATA" }, { Key: "1", Text: "MARKET" }, { Key: "2", Text: "SPA" }];
var Origin = [{ Key: "1", Text: "Airport" }, { Key: "2", Text: "City" }, { Key: "3", Text: "Region" }, { Key: "4", Text: "Zone" }, { Key: "5", Text: "Country" }];
var Destination = [{ Key: "1", Text: "Airport" }, { Key: "2", Text: "City" }, { Key: "3", Text: "Region" }, { Key: "4", Text: "Zone" }, { Key: "5", Text: "Country" }];
var currentRateSNo = 0;
function FnGetOriginAC(input) {
    var Origin = $("#Text_OriginType").val().toUpperCase();
    if (Origin == "AIRPORT") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwAirport", "SNo", "AirportCode", null)
        var dataSource = GetDataSourceV2("OriginSNo", "RateDetailsHistory_Airport")
        // Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "AirportCode");
    }
    else if (Origin == "CITY") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "City", "SNo", "CityCode", null)
        var dataSource = GetDataSourceV2("OriginSNo", "RateDetailsHistory_City")
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");
    }
    else if (Origin == "REGION") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "Region", "SNo", "RegionName", ["RegionName"])
        var dataSource = GetDataSourceV2("OriginSNo", "RateDetailsHistory_Region")
        //Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");
    }
    else if (Origin == "COUNTRY") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes By Vipin Kumar
        //var dataSource = GetDataSource("OriginSNo", "vwcountry", "SNo", "CountryCode", null);
        var dataSource = GetDataSourceV2("OriginSNo", "RateDetailsHistory_Country");
        // Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");
        //   cfi.AutoComplete("OriginSNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectOrigin, "contains");
    }
    else if (Origin == "ZONE") {
        cfi.ResetAutoComplete("OriginSNo");
        // Changes by Vipin Kumar
        // var dataSource = GetDataSource("OriginSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
        var dataSource = GetDataSourceV2("OriginSNo", "RateDetailsHistory_Zone")
        // Ends
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "ZoneName");
    }
}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "vwAirport", "SNo", "AirportCode", null)
        var dataSource = GetDataSourceV2("DestinationSNo", "RateDetailsHistory_Airport")
        // Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "AirportCode");
    }
    else if (Destination == "CITY") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "City", "SNo", "CityCode", null)
        var dataSource = GetDataSourceV2("DestinationSNo", "RateDetailsHistory_City")
        //ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");
    }
    else if (Destination == "REGION") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes By Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "Region", "SNo", "RegionName", ["RegionName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "RateDetailsHistory_Region")
        //Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");
    }
    else if (Destination == "COUNTRY") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
        //var dataSource = GetDataSource("DestinationSNo", "vwcountry", "SNo", "CountryCode", null)
        var dataSource = GetDataSourceV2("DestinationSNo", "RateDetailsHistory_Country")
        // Ends
        cfi.ChangeAutoCompleteDataSourceV2("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
    }
    else if (Destination == "ZONE") {
        cfi.ResetAutoComplete("DestinationSNo");
        // Changes by Vipin Kumar
       // var dataSource = GetDataSource("DestinationSNo", "Zone", "SNo", "ZoneName", ["ZoneName"])
        var dataSource = GetDataSourceV2("DestinationSNo", "RateDetailsHistory_Zone")
        //Ends
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "ZoneName");
    }

}

function CheckSession() {
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/CheckSession",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            if (result[0] == 1001) {
                $("#Container").after('<div id="divWindow"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>Continue with Old Session(Yes/No).</b></td></tr></table></div>');
                $("#divWindow").dialog({
                    autoResize: true,
                    maxWidth: 250,
                    maxHeight: 150,
                    width: 250,
                    height: 150,
                    modal: true,
                    title: 'Confirmation',
                    draggable: false,
                    resizable: false,
                    buttons:
                      {
                          'Yes': function () {
                              $(this).dialog('close');
                              $.ajax({

                              });
                              $(this).find("#yes").click();
                          },
                          'No': function () {
                              $.ajax({
                                  url: "./Services/Accounts/CashRegisterService.svc/NewCashRegister",
                                  contentType: "application/json; charset=utf-8",
                                  data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
                                  async: false,
                                  type: 'post',
                                  cache: false,
                                  success: function (result) {

                                  }
                              });
                              $(this).dialog('close');
                              $(this).find("#no").click();
                          }
                      }
                });
            }
            else if (result[0] == 1002) {

            }

        }
    });
}

function getOtherChargesHistoryData() {
    var divelement, fldElement, lgndElemnet, tableElement, rowElement, colElement, input;
    var user = userContext.UserSNo;
    var AirlineSNo = $("#AirlineSNo").val();
    var OfficeSNo = $("#OfficeSNo").val();
    var RateTypeSNo = $("#RateTypeSNo").val();
    var stausval = $("#Active").val();
    var OriginLev = $("#OriginType").val();
    var Origin = $("#OriginSNo").val();
    var DestLev = $("#DestinationType").val();
    var Destination = $("#DestinationSNo").val();
    //var vallidFrom = Date.parse($("#ValidFrom").val(), "MM/dd/yyyy"); 
    //var VallidTo = Date.parse($("#ValidTo").val(), "MM/dd/yyyy"); 
    var vallidFrom = $("#ValidFrom").val();
    var VallidTo = $("#ValidTo").val();
    //$("#Close").removeAttr("disabled");
    if (user != "") {
        //    GetSNo();
        getOtherChargesHistory();
        $("#divOtherChargesHistory").hide();
        $.ajax({
            //url: "Services/Rate/RateDetailsHistoryService.svc/GetData", type: "get", async: true, dataType: "json", cache: false,
            url: "./Services/Rate/RateDetailsHistoryService.svc/GetRateDetailsHistoryData?AirlineSNo=" + AirlineSNo + "&OfficeSNo=" + OfficeSNo + "&RateTypeSNo=" + RateTypeSNo + "&stausval=" + stausval + "&OriginLev=" + OriginLev + "&Origin=" + Origin + "&DestLev=" + DestLev + "&Destination=" + Destination + "&vallidFrom=" + vallidFrom + "&VallidTo=" + VallidTo, type: "get", async: true, dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            //data: JSON.stringify({ AirlineSNo: AirlineSNo, chargeTypeval: chargeTypeval, DueCarrierCode: DueCarrierCode, stausval: stausval, OriginLev: OriginLev, Origin: Origin, DestLev: DestLev, Destination: Destination, vallidFrom: vallidFrom, VallidTo: VallidTo }),
            //async: false,
            //type: 'post',
            //cache: false,
            success: function (result) {
                //$("#Container").show();
                //if ($("#ReceiveAmount").length === 0) {//(" + Amount + ")
                //    $("#Container").before("<input type='button' id='ReceiveAmount' value='Receive Amount' class='btn btn-success' onclick='GetReceiveAmountDetail()'>&emsp;<input type='button' id='DepositAmount' value='Cash Transfer(" + inv + " IDR)' class='btn btn-success' onclick='AmountDeposited()'>&emsp;<input type='button' id='Close' value='Close Account' class='btn btn-success' onclick='ClosedAccount()'>");
                //}
                //else
                //    $("#DepositAmount").val("Cash Transfer(" + inv + " IDR)");

                var dataTableobj = JSON.parse(result);
                if (dataTableobj.Table0.length > 0) {
                    $("#divOtherChargesHistory").show();  /// show grid if record exists

                    $('#tblOtherChargesHistoryView').appendGrid('load', dataTableobj.Table0);
                    abc();
                }
                else {
                    $("#divOtherChargesHistory").hide();   // hide grid if record not exists
                    ShowMessage('warning', 'warning - Information', "Record Doesnot Exist", "bottom-right");
                    return;
                }
            },
            error: function (err) {
                ShowMessage('warning', 'warning - Information', "Record Doesnot Exist", "bottom-right");
                //alert("Generated Error");
            }
        });
    }
    //rowElement = document.createElement('tr');
    //colElement = document.createElement('td');
}

function getOtherChargesHistory() {
    $("#tblOtherChargesHistoryView").appendGrid({
        caption: 'Rate Details History View',
        captionTooltip: 'RateDetailsHistoryView',
        columns: [
               { name: 'abc', display: '', type: 'button', value: 'ViewDetails', ctrlCss: { width: "70px", height: '25px' }, ctrlAttr: { maxlength: 70, onClick: "return Opennew(this.id)" } },
                  { name: 'SNo', display: 'Airline', type: 'hidden', value: 0 },

                  { name: 'MSNo', type: 'hidden', value: 0 },

                  { name: 'AirlineSNo', type: 'hidden', value: 0 },

                  { name: 'Airline', display: 'Airline', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  { name: 'RateTypeName', display: 'Rate Type Name', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },


                   { name: 'WeightType', display: 'Weight Type', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                 {
                     name: 'OriginLevel', display: 'Origin', type: "label", ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                 },

                  {
                      name: 'DestinationLevel', display: 'Destination', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'OriginZone', display: 'Origin Zone', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'DestinationZone', display: 'Destination Zone', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'OriginCity', display: 'Origin City', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'DestinationCity', display: 'Destination City', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'OriginCountry', display: 'Origin Country', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'DestinationCountry', display: 'Destination Country', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'OriginRegion', display: 'Origin Region', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'DestinationRegion', display: 'Destination Region', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'OriginAirport', display: 'Origin Airport', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },
                  {
                      name: 'DestinationAirport', display: 'Destination Airport', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },

                 { name: 'FlightTypeName', display: 'Flight Type', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                   { name: 'Currency', display: 'Currency', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                   { name: 'Tax', display: 'Tax', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                   { name: 'ValidFrom', display: 'VallidFrom', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'ValidTo', display: 'VallidTo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'NextSlab', display: 'NextSlab', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateRaferenceNumber', display: 'Rate Reference', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'StatusText', display: 'Status', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateBasedOn', display: 'Rate Based', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'Proration', display: 'Proration', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'SpaMarkup', display: 'SpaMarkup', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateAirlineSlab', display: 'RateAirlineSlab', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'RateAirlineUldSlab', type: 'hidden', value: 0 },
                 { name: 'RateAirlineUldSlab', display: 'RateAirlineUldSlab', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateAirlineRemarks', display: 'RateAirlineRemarks', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateAirlineWeekDayTrans', display: 'RateAirlineWeekDayTrans', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateAirlineETDTrans', display: 'RateAirlineETDTrans', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateAirlineCommodityTrans', display: 'RateAirlineCommodityTrans', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'RateAirlineProductTrans', display: 'RateAirlineProductTrans', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false }
                // { name: 'FlightIsInclude', display: 'FlightIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'StartTime', display: 'StartTime', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'EndTime', display: 'EndTime', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'ETDIsInclude', display: 'ETDIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'TransitSNo', type: 'hidden', value: 0 },
                // //{ name: 'TransitSNo', display: 'TransitSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'TransitText', display: 'TransitText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'TransitIsInclude', display: 'TransitIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'AgentSNo', type: 'hidden', value: 0 },
                // //{ name: 'AgentSNo', display: 'AgentSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'AgentText', display: 'AgentText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'AgentGroupSNo', type: 'hidden', value: 0 },
                // //{ name: 'AgentGroupSNo', display: 'AgentGroupSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'AgentGroupText', display: 'AgentGroupText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'AgentGroupIsInclude', display: 'AgentGroupIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                //  { name: 'AccountShipperSNo', type: 'hidden', value: 0 },
                // //{ name: 'AccountShipperSNo', display: 'AccountShipperSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'AccountShipperText', display: 'AccountShipperText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'AccountShipperIsInclude', display: 'AccountShipperIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'CommoditySNo', type: 'hidden', value: 0 },
                // //{ name: 'CommoditySNo', display: 'CommoditySNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'CommodityText', display: 'CommodityText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'CommodityIsInclude', display: 'CommodityIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'ProductSNo', type: 'hidden', value: 0 },
                // //{ name: 'ProductSNo', display: 'ProductSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'ProductText', display: 'ProductText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'SHCHSNo', type: 'hidden', value: 0 },
                // //{ name: 'SHCHSNo', display: 'SHCHSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                // { name: 'SHCHText', display: 'SHCHText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false }



                ////{ name: 'abc', display: '', type: 'button', value: 'ViewDetails', ctrlCss: { width: "100px", height: '30px'}, ctrlAttr: { maxlength: 100, onClick: "return Opennew(this.id)" } }
                ////{ name: '', display: '', type: 'button', value: 'ViewDetails', ctrlCss: { width: "100px" }, ctrlAttr: {'<button id="btn' : id + '" value="btn' + id + '" class="btn btn-info" style="margin-top:0px; width:100px;">View Details</button>'} }
                ////{ name: '', display: '', type: 'label', value: 'ViewDetails', ctrlCss: { width: "100px" }, ctrlAttr: { maxlength: 100 } }
        ],
        isPaging: false,
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            //var uniqueindex;
            //var prevrowuniqueindex;
            //uniqueindex = $('#tblOtherChargesHistoryView').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
            //prevrowuniqueindex = $('#tblOtherChargesHistoryView').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));

            //$('#tblOtherChargesHistoryView_abc_' + uniqueindex).val('SHOW');
            //$('#tblOtherChargesHistoryView_abc_' + prevrowuniqueindex).val('SHOW');




        },
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true
        }

    });


}

function abc() {
    var Rowremovecount = $('#tblOtherChargesHistoryView_rowOrder').val().split(',').length;
    for (var i = 1 ; i <= Rowremovecount; i++) {
        $('#tblOtherChargesHistoryView_abc_' + i).val('View Details');
        $('#tblOtherChargesHistoryView_abc_' + i).addClass("btn btn-success");
    }

}

function Opennew(obj) {
    //  alert(obj);
    //startval = $("#" + obj.replace("abc", "SNo")).val();
    startval = $("#" + obj.replace("abc", "MSNo")).val();
    //alert(startval);
    endValue = $("#" + obj).val();
    //var recId = '8';
    //   location.href = "www.yoursite.com";
    window.location.href = 'Default.cshtml?Module=Rate&Apps=Rate&FormAction=Read&UserID=' + userContext.UserSNo + '&RecID=' + startval;
    //    $.ajax({
    //        url: "Services/Rate/OtherChargesService.svc/GetOtherChargesRecord?recordID=" + startval + "&UserSNo=" + 2, type: "get", async:
    //false, dataType: "json", cache: false,
    //        contentType: "application/json; charset=utf-8",

    //        //success: function (result) {
    //        //    var dataTableobj = JSON.parse(result);
    //        //    if (dataTableobj.Table0.length > 0) {
    //        //        $('#tblOtherChargesHistoryView').appendGrid('load', dataTableobj.Table0); userContext.UserSNo
    //        //        abc();
    //        //    }
    //        //    else {
    //        //        return;
    //        //    }
    //        //},
    //        //error: function (err) {
    //        //    alert("Generated Error");
    //        //}
    //    });
}