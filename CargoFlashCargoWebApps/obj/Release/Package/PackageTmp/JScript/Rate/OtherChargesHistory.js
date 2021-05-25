
$(document).ready(function () {
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    cfi.ValidateForm();
    $("#IsTaxable").after('Taxable');
    $("#IsCommissionable").after('Commissionable');
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
    cfi.AutoComplete("AirlineSNo", "SNo", "Airline", "SNo", "AirlineName", ["AirlineCode", "AirlineName"], null, null);
    var ChargeList = [{ Key: "1", Text: "DueCarrier" }, { Key: "2", Text: "DueAgent" }]
    cfi.AutoCompleteByDataSource("Charge", ChargeList);

   // cfi.AutoComplete("OCCodeSNo", "Code,Name", "vwDueCarrierDetails", "SNo", "Name", ["Code", "Name"], onChangeOtherCharges, "contains");
    cfi.AutoComplete("OCCodeSNo", "SNo", "DueCarrier", "SNo", "Name", ["Code", "Name"], null, null);
    cfi.AutoCompleteByDataSource("OriginType", Origin, FnGetOriginAC, null);
    cfi.AutoCompleteByDataSource("DestinationType", Destination, FnGetDestinationAC, null);
    cfi.AutoComplete("OriginSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], OnSelectOrigin, "contains");
    cfi.AutoComplete("DestinationSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], OnSelectDestination, "contains");
    cfi.AutoCompleteByDataSource("Active", Active, null, null);
   
    cfi.AutoComplete("CurrencySNo", "CurrencyCode", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
    
}

$(document).on("click", "#Search", function () {
    if ($('#tblOtherChargesHistoryView').length) {
        $('#tblOtherChargesHistoryView').remove();
        $('#divOtherChargesHistory').remove();
        $('#tbl').after("<br/><div id='divOtherChargesHistory' style='height:350px; width:1500px; overflow:auto'><table id='tblOtherChargesHistoryView'></table></div><br/>")
        //$('#Search').after("<br/><div id='divOtherChargesHistory' style='height:100px; overflow:auto'><table id='tblOtherChargesHistoryView'></table></div><br/>")
        //$('#tbl').after("<br/><div id='divFirst'></div><br/>")
        //$('#divOtherChargesHistory').style.width = '1500px';
        //$('#divOtherChargesHistory').style.height = '500px';
        //$('#divOtherChargesHistory').width('1500px');
        getOtherChargesHistoryData();
        //abc();
    }
    else {
        $('#tbl').after("<br/><div id='divOtherChargesHistory' style='height:350px; width:1500px; overflow:auto'><table id='tblOtherChargesHistoryView'></table></div><br/>")
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
    CreateSlabGrid(Origin, $("#OriginSNo").val());

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
        cfi.AutoComplete("OriginSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }
    else if (Origin == "CITY") {
        cfi.AutoComplete("OriginSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }
    else if (Origin == "REGION") {
        cfi.AutoComplete("OriginSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], null, "contains");
        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }
    else if (Origin == "COUNTRY") {
        cfi.AutoComplete("OriginSNo", "CountryCode", "vwcountry", "SNo", "CountryCode", ["CountryCode"], null, "contains");
        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }
    else if (Origin == "ZONE") {
        cfi.AutoComplete("OriginSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }
    else {
    }

}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationType").val().toUpperCase();
    if (Destination == "AIRPORT") {
        cfi.AutoComplete("DestinationSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
    }
    else if (Destination == "CITY") {
        cfi.AutoComplete("DestinationSNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
    }
    else if (Destination == "REGION") {
        cfi.AutoComplete("DestinationSNo", "RegionName", "Region", "SNo", "RegionName", ["RegionName"], null, "contains");
        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
    }
    else if (Destination == "COUNTRY") {
        cfi.AutoComplete("DestinationSNo", "CountryCode", "vwcountry", "SNo", "CountryCode", ["CountryCode"], null, "contains");
        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
    }
    else if (Destination == "ZONE") {
        cfi.AutoComplete("DestinationSNo", "ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
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
    var AirlineSNo =    $("#AirlineSNo").val();
    var chargeTypeval = $("#Charge").val();
    var DueCarrierCode = $("#OCCodeSNo").val();
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
        
        $.ajax({
            //url: "Services/Rate/OtherChargesHistoryService.svc/GetOtherChargesHistoryData?AirlineSNo=" + AirlineSNo + "&chargeTypeval= " + chargeTypeval + "&DueCarrierCode= " + DueCarrierCode + "&stausval= " + stausval + "&OriginLev= " + OriginLev + "&Origin= " + Origin + "&DestLev= " + DestLev + "&Destination= " + Destination + "&vallidFrom= " + vallidFrom + "&VallidTo= " + VallidTo, type: "get", async: false, dataType: "json", cache: false
            url: "Services/Rate/OtherChargesHistoryService.svc/GetOtherChargesHistoryData?AirlineSNo=" + AirlineSNo + "&chargeTypeval="+ chargeTypeval + "&DueCarrierCode=" + DueCarrierCode + "&stausval=" + stausval + "&OriginLev=" + OriginLev + "&Origin=" + Origin + "&DestLev=" + DestLev + "&Destination=" + Destination + "&vallidFrom=" + vallidFrom + "&VallidTo=" + VallidTo, type: "get", async: false, dataType: "json", cache: false,
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
                    $('#tblOtherChargesHistoryView').appendGrid('load', dataTableobj.Table0);
                    abc();
                }
                else {
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
        caption: 'Other Charges History View Details',
        captionTooltip: 'OtherChargesHistoryView',
        columns: [
               { name: 'abc', display: '', type: 'button', value: 'ViewDetails', ctrlCss: { width: "70px", height: '25px'}, ctrlAttr: { maxlength: 70, onClick: "return Opennew(this.id)" } },
                  { name: 'SNo',display: 'Airline', type: 'hidden', value: 0 },

                  { name: 'MSNo', type: 'hidden', value: 0 },

                  { name: 'AirlineSNo', type: 'hidden', value: 0 },

                  { name: 'Airline', display: 'Airline', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  { name: 'DueChargeType', display: 'Charge Type', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                   { name: 'DueCarrierCodeSNo', type: 'hidden', value: 0 },

                   { name: 'OtherCharges', display: 'Other Charges', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  {
                      name: 'Taxable', display: 'Taxable', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                  },

                  { name: 'Commissionable', display: 'Commissionable', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                 //{ name: 'OriginLevelSNo', type: 'hidden', value: 0 },

                 {
                     name: 'OriginLevel', display: 'Origin', type: "label", ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false
                 },

                  //{ name: 'DestinationLevelSNo', type: 'hidden', value: 0 },

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
                  
                  //{ name: 'CurrencySNo', type: 'hidden', value: 0 },
                   { name: 'Currency', display: 'Currency', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                   { name: 'ValidFrom', display: 'VallidFrom', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'ValidTo', display: 'VallidTo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'UnitText', display: 'Unit', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'PaymentType', display: 'Payment', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'StatusText', display: 'Status', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'Charge', display: 'Charge', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'ChargeTypeText', display: 'ChargeType', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'Remarks', display: 'Remarks', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'SlabTrans', display: 'SlabTrans', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AirlineCarrierCodeSNO', type: 'hidden', value: 0 },
                 //{ name: 'AirlineCarrierCodeSNO', display: 'AirlineCarrierCodeSNO', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AirlineCarrierCode', display: 'AirlineCarrierCode', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AirlineCarrierCodeText', display: 'AirlineCarrierCodeText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AirlineCarrierCodeIsInclude', display: 'AirlineCarrierCodeIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'FlightNo', display: 'FlightNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'FlightText', display: 'FlightText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'FlightIsInclude', display: 'FlightIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'StartTime', display: 'StartTime', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'EndTime', display: 'EndTime', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'ETDIsInclude', display: 'ETDIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'TransitSNo', type: 'hidden', value: 0 },
                 //{ name: 'TransitSNo', display: 'TransitSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'TransitText', display: 'TransitText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'TransitIsInclude', display: 'TransitIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AgentSNo', type: 'hidden', value: 0 },
                 //{ name: 'AgentSNo', display: 'AgentSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AgentText', display: 'AgentText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AgentGroupSNo', type: 'hidden', value: 0 },
                 //{ name: 'AgentGroupSNo', display: 'AgentGroupSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AgentGroupText', display: 'AgentGroupText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AgentGroupIsInclude', display: 'AgentGroupIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                  { name: 'AccountShipperSNo', type: 'hidden', value: 0 },
                 //{ name: 'AccountShipperSNo', display: 'AccountShipperSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AccountShipperText', display: 'AccountShipperText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'AccountShipperIsInclude', display: 'AccountShipperIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'CommoditySNo', type: 'hidden', value: 0 },
                 //{ name: 'CommoditySNo', display: 'CommoditySNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'CommodityText', display: 'CommodityText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'CommodityIsInclude', display: 'CommodityIsInclude', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'ProductSNo', type: 'hidden', value: 0 },
                 //{ name: 'ProductSNo', display: 'ProductSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'ProductText', display: 'ProductText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'SHCHSNo', type: 'hidden', value: 0 },
                 //{ name: 'SHCHSNo', display: 'SHCHSNo', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                 { name: 'SHCHText', display: 'SHCHText', type: 'label', ctrlCss: { width: '100px', height: '30px' }, ctrlAttr: { maxlength: 600 }, isRequired: false }


                 
                //{ name: 'abc', display: '', type: 'button', value: 'ViewDetails', ctrlCss: { width: "100px", height: '30px'}, ctrlAttr: { maxlength: 100, onClick: "return Opennew(this.id)" } }
                //{ name: '', display: '', type: 'button', value: 'ViewDetails', ctrlCss: { width: "100px" }, ctrlAttr: {'<button id="btn' : id + '" value="btn' + id + '" class="btn btn-info" style="margin-top:0px; width:100px;">View Details</button>'} }
                //{ name: '', display: '', type: 'label', value: 'ViewDetails', ctrlCss: { width: "100px" }, ctrlAttr: { maxlength: 100 } }
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
    window.location.href = 'Default.cshtml?Module=Rate&Apps=OtherCharges&FormAction=Read&UserID='+ userContext.UserSNo +'&RecID='+startval;
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