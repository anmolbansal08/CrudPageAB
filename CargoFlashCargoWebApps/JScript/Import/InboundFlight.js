/// <reference path="../../Scripts/references.js" />
var currentDailyFlightSno = "";
var currentGroupFlightSNo = "";
var currentFFMFlightMasterSNo = "";
var currentULDNo = "";
var checkmani = true;
var recpcsvalue = 0;
var POMailDetailsArray = [];
var POMailSNo = 0;
var POMSNo = 0;
var tempResult = "";
var ischeckhandling = 0;
var arrayOfValuesForMessage = [];
var CheckCustomIsDeparted = "";
var CheckCustomCOGAFlightRoute = "";
var IsThroughULD;
var IsBUP;
var DTR;
var arrAddShipment = [];
var DTRIndex = "";
var breakdownFFMFlightMasterSNo = "";
var breakdownUldNo = "";
var currentBreakdown = "";
var seletedObj1;
var seletedObj2;
var breakdownStartTime;
var breakdownEndTime;
var tempATA;
var tempArrivalDate;
var currentCargoClassification;
var ClickThis;

$(document).ready(function () {
    //------------------blink css--------------
    $("<style type='text/css'> blink { -webkit-animation: 0.8s linear infinite condemned_blink_effect; animation: 0.8s linear infinite condemned_blink_effect;    }@-webkit-keyframes condemned_blink_effect { 0% { visibility: hidden;} 50% { visibility: hidden; } 100% { visibility: visible;}}@keyframes condemned_blink_effect { 0% {visibility: hidden;} 50% {   visibility: hidden;   }  100% { visibility: visible;} } </style>").appendTo("head");
    AddJavaScriptFile('../../scripts/html2canvas.js', 'js');
    AddJavaScriptFile('../../scripts/jspdf.debug.js', 'js');
    //--------------------end-------------------
    // $("body").append('<div id="DivEPouch"></div>');
    SearchInboundFlight();
    var _CURR_PRO_ = "InboundFlight";

    $("#tblAwbULDLocation_btnAppendRow").live("click", function () {
        $("#tblAwbULDLocation_btnRemoveLast").show();
        GetTempreatureControlled();
    });

    $("#tblAddShipment_btnAppendRow").live("click", function () {
        var lastRow = $("table tr[id^='tblAddShipment_Row_']").last().attr("id").split('_')[2];
        var prevRow = $("table tr[id^='tblAddShipment_Row_']").last().prev().attr("id").split('_')[2];

        $("#tblAddShipment").find("input[id^='tblAddShipment_AWBNumber']").each(function () {
            var ind = $(this).attr('id').split('_')[2];
            if ($("input[id='tblAddShipment_KeepSameULD_" + prevRow + "']").prop("checked") == true) {
                $("#tblAddShipment_HdnULDType_" + lastRow).val($("#tblAddShipment_HdnULDType_" + prevRow + "").val());
                $("#tblAddShipment_ULDType_" + lastRow).val($("#tblAddShipment_ULDType_" + prevRow + "").val());
                $("#_temptblAddShipment_SerialNo_" + lastRow).val($("#_temptblAddShipment_SerialNo_" + prevRow + "").val());
                $("#tblAddShipment_SerialNo_" + lastRow).val($("#tblAddShipment_SerialNo_" + prevRow + "").val());
                $("#tblAddShipment_OwnerCode_" + lastRow).val($("#tblAddShipment_OwnerCode_" + prevRow + "").val());
                $("#tblAddShipment_ULDType_" + lastRow).data("kendoAutoComplete").enable(false);
                $("#tblAddShipment_SerialNo_" + lastRow).prop('disabled', true);
                $("#_temptblAddShipment_SerialNo" + lastRow).prop('disabled', true);
                $("#tblAddShipment_OwnerCode_" + lastRow).prop('disabled', true);
                $("#_temptblAddShipment_OwnerCode" + lastRow).prop('disabled', true);
            }
            else {
                $("#tblAddShipment_HdnULDType_" + lastRow).val(0);
                $("#tblAddShipment_ULDType_" + lastRow).val('BULK');
                $("#tblAddShipment_ULDType_" + lastRow).data("kendoAutoComplete").enable(true);
                $("#tblAddShipment_SerialNo_" + lastRow).prop('disabled', true);
                $("#_temptblAddShipment_SerialNo" + lastRow).prop('disabled', true);
                $("#tblAddShipment_OwnerCode_" + lastRow).prop('disabled', true);
                $("#_temptblAddShipment_OwnerCode" + lastRow).prop('disabled', true);
            }
        });
    });

    $("#tblAwbULDLocation_btnRemoveLast").live("click", function () {
        $("#tblAwbULDLocation").find("input[id^='tblAwbULDLocation_AssignLocation']").each(function () {
            if ($('#tblAwbULDLocation tr').index() == 1) {
                $("#tblAwbULDLocation_btnRemoveLast").hide();
                $("#tblAwbULDLocation_StartPieces_1").removeAttr("disabled").css("cursor", "auto");
                $("#tblAwbULDLocation_EndPieces_1").removeAttr("disabled").css("cursor", "auto");
                $("#tblAwbULDLocation_HAWB_1").data("kendoAutoComplete").enable(true);
            }
            else
                $("#tblAwbULDLocation_btnRemoveLast").show();
        });
    });

    $("#tblAddShipment_btnRemoveLast").live("click", function () {
        $("#tblAddShipment").find("input[id^='tblAddShipment_AWBPrefix']").each(function () {
            if ($("tr[id^='tblAddShipment_Row").length == 1)
                $("#tblAddShipment_btnRemoveLast").hide();
            else
                $("#tblAddShipment_btnRemoveLast").show();
        });
    });

    $("#tblAwbULDDamage_btnRemoveLast").live("click", function () {
        $("#tblAwbULDDamage").find("input[id^='tblAwbULDDamage_IrregularityDamage']").each(function () {
            if ($('#tblAwbULDDamage tr').index() == 1)
                $("#tblAwbULDDamage_btnRemoveLast").hide();
            else
                $("#tblAwbULDDamage_btnRemoveLast").show();
        });
    });

    $("#Text_AircraftType").live('blur', function () {
        if ($("#Text_AircraftType").val() == "") {
            $("#Text_Vendor").data("kendoAutoComplete").enable(false);
            $("#TruckScheduleNo").prop('disabled', true);
            $("#TruckScheduleNo").css("cursor", "not-allowed");
            $("#TruckDate").data("kendoDatePicker").enable(false);
            $("#TruckDate").css("cursor", "not-allowed");
            $("#Vendor").val("");
            $("#Text_Vendor").val("");
            $("#TruckScheduleNo").val("");
            $("#AircraftRegistrationNo").val("");
            $("#TruckDate").data("kendoDatePicker").value("");
            $("#AircraftType").closest("td").next().html("<font>&nbsp;&nbsp;&nbsp;</font>Aircraft Registration No.");
            $("#AircraftType").closest("td").next().attr("title", "Enter Aircraft Registration No.");
        }
    });

    $("#tblAwbULDDamage_btnAppendRow").live("click", function () {
        $("#tblAwbULDDamage_btnRemoveLast").show();
        GetAWBDamageAppend();
    });

    $("#tblFAConsumable_btnAppendRow").live("click", function () {
        GetFAULDConsumables();
    });

    $("#tblAddShipment_btnAppendRow").live("click", function () {
        $("#tblAddShipment").find("input[id^='tblAddShipment_AWBOrigin']").each(function () {
            $("#tblAddShipment_DailyFlightSNo_" + this.id.split('_')[2]).val($("#tblAddShipment_DailyFlightSNo_1").val());
            $("#tblAddShipment_FFMShipmentTransSNo_" + this.id.split('_')[2]).val($("#tblAddShipment_FFMShipmentTransSNo_1").val());
            $("#tblAddShipment_FFMFlightMasterSNo_" + this.id.split('_')[2]).val($("#tblAddShipment_FFMFlightMasterSNo_1").val());
        });
    });

    $("#ATA,#txtETATime").live("keypress", function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var Charactors = ":";
        var regex = /^[0-9]*$/;
        if (Charactors.indexOf(key) < 0 && !regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    });


    PageRightsCheckInboundFlight()
});

function onGridDataBound(e) {
    this.thead.find('th').each(function (item) {
        $(this).attr('title', $(this).text());
    });

    $('#divFlightArrivalDetails').find('.k-grid').find('.btn-block').each(function () {
        var awbsno = $(this).closest('tr').find('td[data-column="AWBSNo"]').text();
        var destinationcode = $(this).closest('tr').find('td[data-column="ShipmentDestinationAirportCode"]').text();

        $('#divFlightArrivalDetails').find('.k-grid').find('tr').find('td[data-column="AWBSNo"]:contains("' + awbsno + '")').each(function () {
            if (destinationcode != userContext.CityCode) {
                $(this).closest('tr').find('td[data-column="IsRushHandling"]').find('#chkIsRushHandling').hide();
            }
        })
    });
}

function OffloadedStopOverULDAndShipment(DailyFlightSNo, FFMFlightMasterSNo, FFMShipmentTransSNo, ULDStockSNo, Pieces, MoveToSegregation, obj) {
    var Pieces = $(obj).closest("tr").find("#txtBulkRecPieces").val();
    var Grosswt = $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val();
    var Volwt = $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val();
    var CBM = $(obj).closest("tr").find("#txtAviOFLDCBM").val();

    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }
    else {
        if (FFMShipmentTransSNo != undefined || FFMShipmentTransSNo != '') {
            $.ajax({
                url: "Services/Import/InboundFlightService.svc/OffloadedStopOverULDAndShipment", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ DailyFlightSNo: DailyFlightSNo, FFMFlightMasterSNo: FFMFlightMasterSNo, FFMShipmentTransSNo: FFMShipmentTransSNo, ULDStockSNo: ULDStockSNo, Pieces: Pieces, Grosswt: Grosswt, Volwt: Volwt, CBM: CBM, MoveToSegregation: MoveToSegregation }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData[0].Column1 == '0') {
                        ShowMessage('success', 'Success - Stopover Offloaded', "Offloaded successfully.");
                        $(obj).closest('.k-grid').data('kendoGrid').dataSource.read();

                        if (resData[0].Column2 == '1') {
                            $(obj).attr("value", "Offloaded");
                            $(obj).attr("class", "btn btn-block btn-success btn-sm");
                            $(obj).prop('disabled', true);  /// After Save Arrive Button shows as Disabled
                            $('#selector').css('cursor', 'not-allowed') ///// After Save Arrive Button cursor
                        }
                    }
                    else if (resData[0].Column1 == '5') {
                        ShowMessage("warning", "Warning", "Next Flight Cancelled and AWB Available in Lying List.");
                    }
                    else if (resData[0].Column1 == '2') {
                        ShowMessage("warning", "Warning", "Flight already departed shipment can not offload.");
                    }
                    else if (resData[0].Column1 == '6') {
                        ShowMessage("warning", "Warning", "Flight already departed shipment can not offload.");
                    }
                    else if (resData[0].Column1 == '3') {
                        ShowMessage("warning", "Warning", "Offload Pieces can not be greater than FFM Pieces.");
                    }
                    else if (resData[0].Column1 == '4') {
                        ShowMessage("success", "Success-Stopover Move To Segregation", "Move To Segregation successfully.");
                        $(obj).closest('.k-grid').data('kendoGrid').dataSource.read();
                        $('#divFlightArrivalDetails .k-grid').data('kendoGrid').dataSource.read();
                    }
                    else {
                        ShowMessage("warning", "Warning", "Kindly save flight details.");
                    }
                }
            });
        }
    }
}

var arr = [];
function ValidatePartAndTotal() {
    arr = [];
    $("#tblAddShipment").find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").closest("tr").each(function () {
        var _PartSplitTotal = $(this).find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
        var _AWBNo = $(this).closest("tr").prev().prev().find("input[id^='tblAddShipment_AWBPrefix']").val() + '-' + $(this).closest("tr").prev().prev().find("input[id^='tblAddShipment_AWBNumber']").val();

        if (_AWBNo.length < 12) {
            return false;
        }
        arr.push(
            {
                PartSplitTotal: _PartSplitTotal,
                AWBNo: _AWBNo
            });
    });

    if (arr != null && arr.length > 0) {
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            var currentValue = arr[i]["PartSplitTotal"] + '#' + arr[i]["AWBNo"];
            for (var j = 0; j < arr.length; j++) {
                var checkedValue = arr[j]["PartSplitTotal"] + '#' + arr[i]["AWBNo"];
                if (currentValue == checkedValue && (checkedValue.split('#')[0] == 'T' || checkedValue.split('#')[0] == 'P')) {
                    count = count + 1;
                    if (count > 1) {
                        ShowMessage("warning", "Warning - Add Shipment", "More than one Total/Part (Build/Load) can not be in same AWBNo: " + checkedValue.split('#')[1]);
                        return false;
                    }
                }
            }
            if (count > 1)
                return false;
            count = 0;
        }
    }
    return true
}

function AutoCompleteDeleteCallBack(e, div, textboxid) {
    var target = e.target; // get current Span.
    $(target).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val("");
    $(target).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val("");
}

function checkProgress() {
    $("#divInboundFlightDetails").find("span[id=spnIsArrivalStatus]").each(function () {
        switch ($(this).text()) {
            case "0":
                $(this).closest('tr').find("input[process='FC']").attr("class", "incompleteprocess");
                $(this).closest('tr').find("input[process='FLIGHTASSIGNTEAM']").attr("class", "incompleteprocess");
                break;
            case "1":
                $(this).closest('tr').find("input[process='FC']").attr("class", "incompleteprocess");
                $(this).closest('tr').find("input[process='FLIGHTASSIGNTEAM']").attr("class", "incompleteprocess");
                break;
            case "2":
                $(this).closest('tr').find("input[process='FC']").attr("class", "partialprocess");
                $(this).closest('tr').find("input[process='FLIGHTASSIGNTEAM']").attr("class", "incompleteprocess");
                break;
            case "3":
                $(this).closest('tr').find("input[process='FC']").attr("class", "completeprocess");
                $(this).closest('tr').find("input[process='FLIGHTASSIGNTEAM']").attr("class", "incompleteprocess");
                break;
            case "4":
                $(this).closest('tr').find("input[process='FC']").attr("class", "completeprocess");
                $(this).closest('tr').find("input[process='FLIGHTASSIGNTEAM']").attr("class", "incompleteprocess");
                break;
            default:
                break;
        }
    });

    PageRightsCheckInboundFlight()
}

function AddFlight() {
    if ($("#tblAddFlight").length === 0) {
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblAddFlight'><tr><td><input type='hidden' name='AirlineCarrierCode' id='AirlineCarrierCode' value=''></td><td><input id='Text_AirlineCarrierCode' width='130px' name='Text_AirlineCarrierCode' placeholder='Carrier Code' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;'  data-role='autocomplete' autocomplete='off'></td><td><input type='text' name='txtFlightNo' id='txtFlightNo' placeholder='Flight No' maxlength='5' style='text-transform:uppercase;'></td><td><input type='text' controltype='datetype' id='txtFlightdate' class='flightdatepicker' width='130px' /></td><td><input type='text' class='timePicker' id='txtETATime' placeholder='STA'  /></td><td><input type='hidden' name='FlightOrigin' id='FlightOrigin' value=''></td><td><input id='Text_FlightOrigin' width='130px' name='Text_FlightOrigin' controltype='autocomplete' onSelect='return CheckAddFlightOrgDest(this);' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' placeholder='Origin' autocomplete='off'></td><td><input type='hidden' name='FlightDestination' id='FlightDestination' value=''></td><td><input id='Text_FlightDestination' width='130px' name='Text_FlightDestination' onSelect='return CheckAddFlightOrgDest(this);' placeholder='Destination' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;'  data-role='autocomplete' autocomplete='off'></td><td colspan='4' align='center'><input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='SaveFlightDetails(this);' /></td></tr></table>");

        cfi.AutoCompleteV2("AirlineCarrierCode", "CarrierCode", "ImportInbound_AirlineCarrierCode", null, "contains");
        $("#tblAddFlight").find(".flightdatepicker").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });

        var ETAStartTime = $("#tblAddFlight").find(".timePicker").kendoTimePicker({
            format: "HH:mm",
            change: function () {
                var startTime = ETAStartTime.value();
                if (startTime) {
                    startTime = new Date(startTime);
                    startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                } else {
                    $("#tblAddFlight").find(".timePicker").val('');
                }
            }
        }).data("kendoTimePicker");

        cfi.AutoCompleteV2("FlightOrigin", "AirportCode", "ImportInbound_FlightOrigin");
        cfi.AutoCompleteV2("FlightDestination", "AirportCode", "ImportInbound_FlightDest");
    }

    $("#txtFlightNo").val("");
    $("#Text_AirlineCarrierCode").val("");
    $('#txtFlightdate').data("kendoDatePicker").value("");
    $("#FlightOrigin").val("");
    $("#Text_FlightOrigin").val("");
    $("#FlightDestination").val("");
    $("#Text_FlightDestination").val("");
    $("#txtETATime").data("kendoTimePicker").value("");

    // ******************  Start ****** Added By Rahul to validate FLight No On 24-11-2017 ******************************************
    function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }

    $("#txtFlightNo").on("blur", function (e) {
        if ($("#txtFlightNo").val() != "") {
            var txt = $("#txtFlightNo").val()
            var check = txt.substring(0, txt.length - 1);
            if (check.match(/[a-z]/i)) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Invalid Flight No.');
                $("#txtFlightNo").val('');
                return false
            }
            var count
            if ($("#txtFlightNo").val().match(/[a-z]/i)) {
                count = 5
            }
            else
                count = 4

            if ($("#txtFlightNo").val().length < count) {
                var abc = count - $("#txtFlightNo").val().length
                var newstr = pad('0', abc)
                $("#txtFlightNo").val(newstr + $("#txtFlightNo").val())
            }
        }

        if ($("#txtFlightNo").val().match(/[a-z]/i) && $("#txtFlightNo").val().length > 4) {
        }
        else {
            if ($("#txtFlightNo").val().length > 4) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Invalid Flight No.');
                $("#txtFlightNo").val("");
                return false;
            }
        }
    });
    // ******************  End ****** Added By Rahul to validate FLight No On 24-11-2017 **********************//

    $("[id=txtFlightNo]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var Charactors = "";    // allow only numbers [0-9] 
        var regex = /^[a-zA-Z0-9]*$/;    // allow only alphanumeric

        if (Charactors.indexOf(key) < 0 && !regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    });

    cfi.PopUp("tblAddFlight", "Add Flight", 1000, null, null, 1);
}

function CheckAddFlightOrgDest(obj) {
    var FlightOrigin = $(obj).closest("tr").find("input[id='FlightOrigin']").val();
    var FlightDestination = $(obj).closest("tr").find("input[id='FlightDestination']").val();
    if (FlightOrigin != "" && FlightDestination != "") {
        if (FlightOrigin == FlightDestination) {
            $(obj).val('');
            ShowMessage('warning', 'Need your Kind Attention!', 'Origin & Destination can not be same.');
            return;
        }
    }
}

function GetTempreatureControlled() {
    var lastRow = $("#tblAwbULDLocation tbody tr:last").attr("id").split("_")[2];
    $("#tblAwbULDLocation").find("input[id^='tblAwbULDLocation_AssignLocation']").each(function () {
        var ind = this.id.split('_')[2];
        $("#tblAwbULDLocation_AWBNo_" + ind).text($("#tblAwbULDLocation_AWBNo_1").text());
        $("#tblAwbULDLocation_RcvdPieces_" + ind).text($("#tblAwbULDLocation_RcvdPieces_1").text());
        $("#tblAwbULDLocation_RcvdGrossWeight_" + ind).text($("#tblAwbULDLocation_RcvdGrossWeight_1").text());
        $("#tblAwbULDLocation_ArrivedShipmentSNo_" + ind).val($("#tblAwbULDLocation_ArrivedShipmentSNo_1").val());
        $("#tblAwbULDLocation_AWBSNo_" + ind).val($("#tblAwbULDLocation_AWBSNo_1").val());
        $("#tblAwbULDLocation_HdnAWBNo_" + ind).val($("#tblAwbULDLocation_AWBNo_1").text());
        $("#tblAwbULDLocation_HdnRcvdPieces_" + ind).val($("#tblAwbULDLocation_RcvdPieces_1").text());
        $("#tblAwbULDLocation_HdnRcvdGrossWeight_" + ind).val($("#tblAwbULDLocation_RcvdGrossWeight_1").text());

        if (ind != lastRow) {
            $("#tblAwbULDLocation_StartPieces_" + (ind)).attr("disabled", true).css("cursor", "not-allowed");
            $("#tblAwbULDLocation_EndPieces_" + (ind)).attr("disabled", true).css("cursor", "not-allowed");
            $("#tblAwbULDLocation_HAWB_" + (ind)).data("kendoAutoComplete").enable(false);
        }
    });

    if (lastRow > 0) {
        $("#tblAwbULDLocation_SPHC_" + lastRow).val($("#tblAwbULDLocation_SPHC_1").val());
        if ($("#tblAwbULDLocation_TempControlled_" + lastRow + " option:checked").val() == 1) {
            $("input[id*='tblAwbULDLocation_StartTemperature_" + lastRow + "']").removeAttr("required").css("cursor", "not-allowed");
            $("input[id*='tblAwbULDLocation_EndTemperature_" + lastRow + "']").removeAttr("required").css("cursor", "not-allowed");
            $("#tblAwbULDLocation_StartTemperature_" + lastRow).data("kendoNumericTextBox").enable(false);
            $("#tblAwbULDLocation_EndTemperature_" + lastRow).data("kendoNumericTextBox").enable(false);
            $("#tblAwbULDLocation_StartTemperature_" + lastRow).data("kendoNumericTextBox").value(0);
            $("#tblAwbULDLocation_EndTemperature_" + lastRow).data("kendoNumericTextBox").value(0);
        }
        else {
            $("input[id*='tblAwbULDLocation_StartTemperature_" + lastRow + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
            $("input[id*='tblAwbULDLocation_EndTemperature_" + lastRow + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
            $("#tblAwbULDLocation_StartTemperature_" + lastRow).data("kendoNumericTextBox").enable(true);
            $("#tblAwbULDLocation_EndTemperature_" + lastRow).data("kendoNumericTextBox").enable(true);
            $("#tblAwbULDLocation_StartTemperature_" + lastRow).data("kendoNumericTextBox").value('');
            $("#tblAwbULDLocation_EndTemperature_" + lastRow).data("kendoNumericTextBox").value('');
        }
    }
}

function GetAWBDamageAppend() {
    $("#tblAwbULDDamage").find("input[id^='tblAwbULDDamage_IrregularityDamage']").each(function () {
        $("#tblAwbULDDamage_AWBNo_" + this.id.split('_')[2]).text($("#tblAwbULDDamage_AWBNo_1").text());
        $("#tblAwbULDDamage_ArrivedShipmentSNo_" + this.id.split('_')[2]).val($("#tblAwbULDDamage_ArrivedShipmentSNo_1").val());
        $("#tblAwbULDDamage_AWBSNo_" + this.id.split('_')[2]).val($("#tblAwbULDDamage_AWBSNo_1").val());
        $("#tblAwbULDDamage_HdnAWBNo_" + this.id.split('_')[2]).val($("#tblAwbULDDamage_AWBNo_1").text());
        $("#tblAwbULDDamage_TotalPieces_" + this.id.split('_')[2]).val($("#tblAwbULDDamage_TotalPieces_1").val());
    });
}

function GetFAULDConsumables() {
    $("#tblFAConsumable").find("input[id^='tblFAConsumable_Quantity']").each(function () {
        $("#tblFAConsumable_FFMShipmentTransSNo_" + this.id.split('_')[2]).val($("#tblFAConsumable_FFMShipmentTransSNo_1").val());
    });
}

// Get Inbound flight search page
function SearchInboundFlight() {
    _CURR_PRO_ = "InboundFlight";
    _CURR_OP_ = "Inbound Flight";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divInboundFlightDetails").html("");
    var model = {
        processName: _CURR_PRO_,
        moduleName: 'Import',
        appName: 'InboundFlight',
        Action: 'Search',
        IsSubModule: 1,
    }
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetWebForm", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: model }),
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            setTimeout(function () { PageRightsCheckInboundFlight() }, 100)
            $("#searchFromDate").change(function () {
                ValidateDate();
            });

            $("#searchToDate").change(function () {
                ValidateDate();
            });

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            // Inbound flight search
            $("#btnSearch").bind("click", function () {
                cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
                InboundFlightSearch();
            });

            $("#ConnectingFlights").change(function () {
                if ($(this).is(':checked')) {
                    $("#Text_searchFilterConnFlights").data("kendoAutoComplete").enable(true);
                }
                else {
                    $("#Text_searchFilterConnFlights").data("kendoAutoComplete").enable(false);
                }
            });

            $("#ULDCounts").change(function () {
                if ($(this).is(':checked')) {
                    $("#Text_searchFilterULDCounts").data("kendoAutoComplete").enable(true);
                }
                else {
                    $("#Text_searchFilterULDCounts").data("kendoAutoComplete").enable(false);
                }
            });

            $("#MCT").change(function () {
                if ($(this).is(':checked')) {
                    $("#Text_searchFilterMCT").data("kendoAutoComplete").enable(true);
                }
                else {
                    $("#Text_searchFilterMCT").data("kendoAutoComplete").enable(false);
                }
            });
            if (sessionStorage.getItem("SessionInboundFlight") == null)
                $('#searchFromDate').data("kendoDatePicker").value("");
        }
    });

}

function ValidateDate() {
    var fromDate = $("#searchFromDate").attr("sqldatevalue");
    var toDate = $("#searchToDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");
            $("#searchFromDate").val("");
            $("#searchToDate").val("");
            ShowMessage('warning', 'Warning - Inbound Flight', "From date should not be greater than To date.");
        }
    }
}

// Inbound flight search
function InboundFlightSearch() {
    $("#divInboundFlightInformation").html("");
    $("#divInboundFlightULDInformation").html("");
    var SearchAirlineCarrierCode = $("#SearchAirlineCarrierCode").val() == "" ? "A~A" : $("#SearchAirlineCarrierCode").val();
    var SearchBoardingPoint = $("#SearchBoardingPoint").val() == "" ? "A~A" : $("#SearchBoardingPoint").val();
    var SearchFlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val();
    var searchFromDate = "0";
    searchFromDate = $("#searchFromDate").attr("sqldatevalue") != "" ? $("#searchFromDate").attr("sqldatevalue") : "0";
    var searchToDate = "0";
    searchToDate = $("#searchToDate").attr("sqldatevalue") != "" ? $("#searchToDate").attr("sqldatevalue") : "0";
    var StartTime = $("#StartTime").val() == "" ? "0" : $("#StartTime").val();
    var EndTime = $("#EndTime").val() == "" ? "0" : $("#EndTime").val();
    var SearchFFMRcvd = ($("input[id=SearchFFMRcvd]").is(":checked") == true) ? 'YES' : 'NO';
    var SearchQRT = ($("input[id=SearchQRT]").is(":checked") == true) ? 'YES' : 'NO';
    var SearchSHCDGR = ($("input[id=SearchSHCDGR]").is(":checked") == true) ? 'YES' : 'NO';
    var SearchTransitFlight = ($("input[id=SearchTransitFlight]").is(":checked") == true) ? 'YES' : 'NO';
    var SearchFStatus = $("#searchFStatus").val() == "" ? "A~A" : $("#searchFStatus").val();

    var SearchConnectingFlights;
    if ($("input[id=ConnectingFlights]").is(":checked") == true) {
        if ($("#Text_searchFilterConnFlights").val() == "") {
            ShowMessage('warning', 'Warning', "Select connecting flight.");
            return;
        }
        else
            SearchConnectingFlights = $("#searchFilterConnFlights").val();
    }
    else
        SearchConnectingFlights = "0";

    var SearchFilterULDCounts;
    if ($("input[id=ULDCounts]").is(":checked") == true) {
        if ($("#Text_searchFilterULDCounts").val() == "") {
            ShowMessage('warning', 'Warning', "Select ULD count.");
            return;
        }
        else
            SearchFilterULDCounts = $("#searchFilterULDCounts").val()
    }
    else
        SearchFilterULDCounts = "0";

    var SearchFilterMCT;
    if ($("input[id=MCT]").is(":checked") == true) {
        if ($("#Text_searchFilterMCT").val() == "") {
            ShowMessage('warning', 'Warning', "Select MCT.");
            return;
        }
        else
            SearchFilterMCT = $("#searchFilterMCT").val();
    }
    else
        SearchFilterMCT = "0";

    _CURR_PRO_ = "InboundFlight";
    var model = {
        processName: _CURR_PRO_,
        moduleName: 'Import',
        appName: 'INBOUNDFLIGHT',
        SearchAirlineCarrierCode: SearchAirlineCarrierCode,
        SearchBoardingPoint: SearchBoardingPoint,
        searchFromDate: searchFromDate,
        searchToDate: searchToDate,
        StartTime: StartTime.replace(':', '-'),
        EndTime: EndTime.replace(':', '-'),
        SearchFFMRcvd: SearchFFMRcvd,
        SearchQRT: SearchQRT,
        SearchSHCDGR: SearchSHCDGR,
        SearchTransitFlight: SearchTransitFlight,
        SearchFlightNo: SearchFlightNo.trim(),
        SearchConnectingFlights: SearchConnectingFlights,
        SearchFilterULDCounts: SearchFilterULDCounts,
        SearchFilterMCT: SearchFilterMCT,
        SearchFStatus: SearchFStatus
    }

    if (_CURR_PRO_ == "InboundFlight") {
        cfi.ShowIndexViewV2("divInboundFlightDetails", "Services/Import/InboundFlightService.svc/GetGridData", model);
        //Added by jitendra kumar
        var obj = {
            Text_SearchAirlineCarrierCode: $("#Text_SearchAirlineCarrierCode").val(),
            SearchAirlineCarrierCode: $("#SearchAirlineCarrierCode").val(),
            Text_SearchBoardingPoint: $("#Text_SearchBoardingPoint").val(),
            SearchBoardingPoint: $("#SearchBoardingPoint").val(),
            searchFromDate: $("#searchFromDate").val(),
            searchToDate: $("#searchToDate").val(),
            StartTime: $("#StartTime").val(),
            EndTime: $("#EndTime").val(),
            SearchTransitFlight: $("#SearchTransitFlight").is(":checked"),
            SearchQRT: $("#SearchQRT").is(":checked"),
            SearchSHCDGR: $("#SearchSHCDGR").is(":checked"),
            SearchFFMRcvd: $("#SearchFFMRcvd").is(":checked"),
            Text_searchFlightNo: $("#Text_searchFlightNo").val(),
            searchFlightNo: $("#searchFlightNo").val(),
            ConnectingFlights: $("#ConnectingFlights").is(":checked"),
            Text_searchFilterConnFlights: $("#Text_searchFilterConnFlights").val(),
            searchFilterConnFlights: $("#searchFilterConnFlights").val(),
            ULDCounts: $("#ULDCounts").is(":checked"),
            Text_searchFilterULDCounts: $("#Text_searchFilterULDCounts").val(),
            searchFilterULDCounts: $("#searchFilterULDCounts").val(),
            MCT: $("#MCT").is(":checked"),
            Text_searchFilterMCT: $("#Text_searchFilterMCT").val(),
            searchFilterMCT: $("#searchFilterMCT").val(),
            Text_searchFStatus: $("#Text_searchFStatus").val(),
            searchFStatus: $("#searchFStatus").val()
        };
        //Added by Amit Yadav
        sessionStorage.setItem("SessionInboundFlight", JSON.stringify(obj));

        $("#divInboundFlightDetails").find("tr:eq(1)").remove();
    }

}

// Inbound Flight Grid Operation
function GetInboundFlightDetails(obj, FFMFlightMasterSNo) {
    _CURR_PRO_ = "InboundFlightInformation";
    _CURR_OP_ = "Inbound Flight Information";
    currentFFMFlightMasterSNo = FFMFlightMasterSNo;
    $("#divInboundFlightInformation").html("");
    $("#divInboundFlightULDInformation").html(""); // for rebind uld information
    $("#divInboundFlightDetails").after("<div id='divInboundFlightInformation' style='width: 100%;'></div");
    if (_CURR_PRO_ == "InboundFlightInformation") {
        var model = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: 'InboundFlightInformation',
            FFMFlightMasterSNo: currentFFMFlightMasterSNo
        }
        cfi.ShowIndexViewV2("divInboundFlightInformation", "Services/Import/InboundFlightService.svc/GetInboundFlightInformationGrid", model);

        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "JT") {
            $("#btnAWBInfo").show();
        }
        else {
            $("#btnAWBInfo").hide();
        }
    }
}

function GetInboundFlightULDInformation1(obj, FFMFlightMasterSNo) {
    _CURR_PRO_ = "InboundFlightULDInformation";
    _CURR_OP_ = "Inbound Flight ULD Information";
    currentFFMFlightMasterSNo = FFMFlightMasterSNo;
    $("#divInboundFlightULDInformation").html("");
    $("#divInboundFlightInformation").html("");

    if ($("#divInboundFlightInformation").html() == "" || $("#divInboundFlightInformation").html() == null)
        $("#divInboundFlightDetails").after("<div id='divInboundFlightULDInformation' style='width: 100%;'></div");
    else
        $("#divInboundFlightInformation").after("<div id='divInboundFlightULDInformation' style='width: 100%;'></div");

    if (_CURR_PRO_ == "InboundFlightULDInformation") {
        var model = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: 'InboundFlightULDInformation',
            FFMFlightMasterSNo: currentFFMFlightMasterSNo
        }
        cfi.ShowIndexViewV2("divInboundFlightULDInformation", "Services/Import/InboundFlightService.svc/GetInboundFlightULDInformationGrid", model);
        if (userContext.SysSetting.IsMultipleSelectionOnArrival.toUpperCase() == 'TRUE') {
            $("#chkAll").show();
            $("#btnArrive").show();
        }
        else {
            $("#chkAll").hide();
            $("#btnArrive").hide();
        }
    }
}

function GetInboundFlightULDInformation(obj, FFMFlightMasterSNo) {
    _CURR_PRO_ = "InboundFlightULDInformation";
    _CURR_OP_ = "Inbound Flight ULD Information";
    currentULDNo = $(obj).closest("span").html();

    $("#divInboundFlightULDInformation").html("");
    if ($("#divInboundFlightInformation").html() == "")
        $("#divInboundFlightDetails").after("<div id='divInboundFlightULDInformation' style='width: 100%;'></div");
    else
        $("#divInboundFlightInformation").after("<div id='divInboundFlightULDInformation' style='width: 100%;'></div");

    if (_CURR_PRO_ == "InboundFlightULDInformation") {
        var model = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: 'InboundFlightULDInformation',
            FFMFlightMasterSNo: currentULDNo
        }

        cfi.ShowIndexViewV2("divInboundFlightULDInformation", "Services/Import/InboundFlightService.svc/GetInboundFlightULDInformationGrid", model);
        if (userContext.SysSetting.IsMultipleSelectionOnArrival.toUpperCase() == 'TRUE') {
            $("#chkAll").show();
            $("#btnArrive").show();
        }
        else {
            $("#chkAll").hide();
            $("#btnArrive").hide();
        }
    }
}

function OpenPopUp() {
    $("#divAWBInfo").attr("display", "block");
    $("#divAWBInfo").html("");
    $("#divAWBInfo").append("<input type='radio' data-radioval='PDF' name='DownloadType' id='DownloadType' value='0' onclick='DownloadAWBInfo(this," + currentFFMFlightMasterSNo + ")'>PDF <input type='radio' data-radioval='EXCEL' name='DownloadType' id='DownloadType' value='1' onclick='DownloadAWBInfo(this," + currentFFMFlightMasterSNo + ")'>EXCEL");
    cfi.PopUp("divAWBInfo", "AWB Info Download", 300, null, null, 100);
}

function DisableControl() {
    //$("#chkAll");
    //$("#divFlightArrivalDetails input[type='text']").prop("disabled", true);
    if ($("[id^='chkAll']").prop('checked') == true)
        $("#divFlightArrivalDetails [class='k-icon k-plus']").css("display", "none")
    else
        $("#divFlightArrivalDetails [class='k-icon k-plus']").css("display", "block")
}

function DownloadAWBInfo(obj, FFMFlightMasterSNo) {
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetAWBInformation",
        async: false, type: "GET", dataType: "json", cache: false,
        data: { FFMFlightMasterSNo: FFMFlightMasterSNo },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var AWBInfoBulk = jQuery.grep(resData.Table0, function (a) {
                return a.BuildType == 'BULK'
            });
            var AWBInfoULD = jQuery.grep(resData.Table0, function (a) {
                return a.BuildType != 'BULK'
            });

            var tblHtml = "<table style='width: 100%;' cellspacing='0' cellpadding='2'>";
            tblHtml += "<thead class='k-grid-header' role='rowgroup'><tr><th class='k-hierarchy-cell k-header' colspan='4' style='text-align:left;font-size:large;'>Flight No- " + resData.Table1[0].FlightNo + "</th><th class='k-hierarchy-cell k-header' colspan='4' style='text-align:left;font-size:large;'>Flight Date- " + resData.Table1[0].FlightDate + "</th><th class='k-hierarchy-cell k-header' colspan='4' style='text-align:left;font-size:large;'>Flight Route- " + resData.Table1[0].FlightRoute + "</th></tr></thead>";
            if (AWBInfoBulk.length > 0) {
                tblHtml += "<thead class='k-grid-header' role='rowgroup'><tr><th class='k-hierarchy-cell k-header' style='font-size:large;'>Build Type</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB No</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Agent Name</th>                   <th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB Type</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB Origin</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB Destination</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Nature Of Goods</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Cargo Type</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>SHC</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Total AWB Pieces</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Manifested Pieces</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Gross Weight</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Build Details</th></tr></thead>";
                tblHtml += "<tbody>";
                for (var i = 0; i < AWBInfoBulk.length; i++) {
                    if (i % 2 == 0) {
                        tblHtml += "<tr class='k-master-row'><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].BuildType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBNo + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AgentName + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBOrigin + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBDestination + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].NatureOfGoods + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].CargoType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].SHC + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].TotalAWBPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].ManifestedPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].GrossWeight + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].BuildDetails + "</td></tr>";
                    }
                    else {
                        tblHtml += "<tr class='k-alt'><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].BuildType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBNo + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AgentName + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBOrigin + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].AWBDestination + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].NatureOfGoods + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].CargoType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].SHC + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].TotalAWBPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].ManifestedPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].GrossWeight + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoBulk[i].BuildDetails + "</td></tr>";
                    }
                }
                tblHtml += "</tbody>";
            }
            else {
                if (AWBInfoULD.length > 0) { }
                else {
                    tblHtml += "</tbody>";
                    tblHtml += "<tr class='k-master-row'><td class='k-hierarchy-cell' style='font-size:large;'>No Record Found</td></tr>";
                    tblHtml += "</tbody>";
                }
            }

            tblHtml += "<tbody><tr height='50px'><td class='k-hierarchy-cell' colspan='12' style='text-align:left;' height='50px'>&nbsp;</th></tr></tbody>";

            if (AWBInfoULD.length > 0) {
                tblHtml += "<thead class='k-grid-header' role='rowgroup'><tr><th class='k-hierarchy-cell k-header' style='font-size:large;'>ULD</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB No</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Agent Name</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB Type</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB Origin</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>AWB Destination</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Nature Of Goods</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Cargo Type</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>SHC</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Total AWB Pieces</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Manifested Pieces</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Gross Weight</th><th class='k-hierarchy-cell k-header' style='font-size:large;'>Build Details</th></tr></thead>";
                tblHtml += "<tbody>";
                for (var i = 0; i < AWBInfoULD.length; i++) {
                    if (i % 2 == 0) {
                        tblHtml += "<tr class='k-master-row'><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].BuildType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBNo + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AgentName + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBOrigin + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBDestination + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].NatureOfGoods + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].CargoType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].SHC + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].TotalAWBPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].ManifestedPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].GrossWeight + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].BuildDetails + "</td></tr>";
                    }
                    else {
                        tblHtml += "<tr class='k-alt'><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].BuildType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBNo + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AgentName + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBOrigin + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].AWBDestination + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].NatureOfGoods + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].CargoType + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].SHC + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].TotalAWBPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].ManifestedPieces + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].GrossWeight + "</td><td class='k-hierarchy-cell' style='font-size:large;'>" + AWBInfoULD[i].BuildDetails + "</td></tr>";
                    }
                }
                tblHtml += "</tbody>";
            }
            else {
                if (AWBInfoBulk.length > 0) { }
                else {
                    tblHtml += "</tbody>";
                    tblHtml += "<tr class='k-master-row'><td class='k-hierarchy-cell' style='font-size: medium;'>No Record Found</td></tr>";
                    tblHtml += "</tbody>";
                }
            }

            tblHtml += "</table>";
            $('#divExport').append(tblHtml.toString());
            var FileName = "AWB Information";
            if ($("#" + obj.id + ":checked").val() == 1) {
                exportToExcelNew($('#divExport').html(), FileName);
                setTimeout(function () { $('#divExport').html(""); }, 500);
                window.close();
            }
            else {
                var pdf = new jsPDF('l', 'pt', 'a4');
                pdf.internal.scaleFactor = 1.3;
                $("#divExport").append("<style>.highcharts-container>svg>g>text{display:none;}</style>");
                $("#divExport").css("background", "white");
                $("#divExport").css("color", "black");
                pdf.addHTML($('#divExport'), 10, 10, {
                    pagesplit: true, border: 10, html2canvas: { scale: 2, logging: true, background: '#FFFFFF', },
                }, function () {
                    pdf.save(FileName + '.pdf');
                    setTimeout(function () { $('#divExport').html(""); }, 500);
                    window.close();
                });
            }
        },
        error: function (ex) {
            var ex = ex;
        }
    });
    $("#divAWBInfo").data("kendoWindow").close();
}

// Get Inbound flight ULD info on popup window
function GetInboundFlightULDInfo(obj, FFMFlightMasterSNo) {
    _CURR_PRO_ = "InboundFlightULDInfo";
    _CURR_OP_ = "ULD Details";
    currentFFMFlightMasterSNo = FFMFlightMasterSNo;

    if ($("#divInboundFlightULDInfo").length === 0)
        $("#divInboundFlightULDInformation").after("<div id='divInboundFlightULDInfo' style='width: 100%;'></div");

    if (_CURR_PRO_ == "InboundFlightULDInfo") {
        var model = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: 'InboundFlightULDInfo',
            FFMFlightMasterSNo: currentFFMFlightMasterSNo
        }

        cfi.ShowIndexViewV2("divInboundFlightULDInfo", "Services/Import/InboundFlightService.svc/GetInboundFlightULDInfoGrid", model);
        cfi.PopUp("divInboundFlightULDInfo", "ULD Information", 1000, null, null, 100);
    }
}

function PrintFCReportData(divID) {
    var divContents = $("#" + divID).html();
    var printWindow = window.open('', '', '');
    printWindow.document.write(divContents);
    printWindow.document.close();
    printWindow.print();
}

//----------------- FC Report -----------------------------------//
function GetFCReport(obj, DailyFlightSNo) {
    if (DailyFlightSNo == "" || DailyFlightSNo == "0")
        ShowMessage('warning', 'Warning - FC Report', "Record not found.");
    else
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/CheckRushHandling", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DailyFlightSNo: DailyFlightSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result == "Success") {
                    window.open("HtmlFiles/Import/FCReport/FCReport.html?DailyFlightSNo=" + DailyFlightSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
                }
                else {
                    if ($((obj.parentElement.parentNode)).find("td[data-column='IsFlightClosed'] span").text() != "1") {
                        ShowMessage('warning', 'Warning - FC Report', "Flight Not Closed.");
                    }
                    else {
                        window.open("HtmlFiles/Import/FCReport/FCReport.html?DailyFlightSNo=" + DailyFlightSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
                    }
                }
            }
        });
}

//------------------- Save Flight Details -----------------------------//
function SaveFlightDetails() {
    var flightNo = $("#txtFlightNo").val();
    var airlineCarrierCode = $("#AirlineCarrierCode").val();
    var flightDate = $("#txtFlightdate").attr("sqldatevalue");
    var flightOrigin = $("#FlightOrigin").val();
    var flightDestination = $("#FlightDestination").val();
    var ETATime = $("#txtETATime").val();

    if (airlineCarrierCode == "" || flightNo == "" || flightDate == "" || flightOrigin == "" || flightDestination == "" || ETATime == "") {
        ShowMessage('warning', 'Warning - Add Flight', "Enter flight details.");
    }
    else {
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/SaveFlightDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AirlineCarrierCode: airlineCarrierCode, FlightNo: flightNo, FlightDate: flightDate, FlightOriginSNo: flightOrigin, FlightDestinationSNo: flightDestination, ETATime: ETATime }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.length > 0) {
                    if (result == "0") {
                        $("#txtFlightNo").val("");
                        $("#Text_AirlineCarrierCode").val("");
                        $('#txtFlightdate').data("kendoDatePicker").value("");
                        $("#FlightOrigin").val("");
                        $("#Text_FlightOrigin").val("");
                        $("#FlightDestination").val("");
                        $("#Text_FlightDestination").val("");
                        $("#txtETATime").data("kendoTimePicker").value("");
                        $("#tblAddFlight").data("kendoWindow").close();
                        ShowMessage('success', 'Success - Flight Details', "Flight added successfully.");
                    }
                    else
                        ShowMessage('warning', 'Warning - Flight Details', "Flight already exist.");
                }
                else
                    ShowMessage('warning', 'Warning - Flight Details', "Unable to add flight.");
            },
            error: function () {
                ShowMessage('warning', 'Warning - Flight Details', "Unable to add flight.");
            }
        });
    }
}

//------------------ Add Shipment Details--------------------------------//
function SelectAWBType(id, obj) {
    $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").attr('required', 'required');
    $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").attr('style', 'width: 100%; height: 20px; text-transform: uppercase;border: 1px solid red;');
    $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").attr('required', 'required');
    $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").attr('style', 'width: 100%; height: 20px; text-transform: uppercase;border: 1px solid red;');

    var VolumeCBM = 0;
    var VolumeWeight = 0;
    var TableNamerowIndex = id.split('_')[0];
    var temptable = "_temptblAddShipment";
    var rowIndex = id.split('_')[2];
    var awbPrefixval = $('input:radio[name=' + TableNamerowIndex + '_RbtnAwbType_' + rowIndex + ']:checked').val();
    var awbPrefix = "";

    if (awbPrefixval == 1) {
        awbPrefix = 'UNK';
    }

    if (awbPrefix == "UNK") {
        $('input:text[name=' + TableNamerowIndex + '_AWBPrefix_' + rowIndex + ']').val(awbPrefix);
        $('#' + TableNamerowIndex + '_PartSplitTotal_' + rowIndex + '').val('T');

        $('#' + TableNamerowIndex + '_NatureOfGoods_' + rowIndex + '').removeAttr('required');
        $('#' + TableNamerowIndex + '_NatureOfGoods_' + rowIndex + '').removeAttr('style');
        $('#' + TableNamerowIndex + '_NatureOfGoods_' + rowIndex + '').removeAttr('style', 'width: 115px; text-transform: uppercase; border: 1px solid red;');

        $('#' + TableNamerowIndex + '_FoundAWB_' + rowIndex + '').prop('selectedIndex', 0);
        $('#' + TableNamerowIndex + '_FoundAWB_' + rowIndex + '').removeAttr('disabled');
        $('#' + TableNamerowIndex + '_PartSplitTotal_' + rowIndex + '').attr('disabled', 'disabled');
        $('input:text[name=' + TableNamerowIndex + '_AWBPrefix_' + rowIndex + ']').attr('disabled', 'disabled');

        $('#' + temptable + '_TotalPieces_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_TotalPieces_' + rowIndex + '').val('');

        $('#' + temptable + '_GrossWeight_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_GrossWeight_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedPcs_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedPcs_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedGrossWt_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedGrossWt_' + rowIndex + '').val('');

        $('#' + temptable + '_CBM_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_CBM_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedCBM_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedCBM_' + rowIndex + '').val('');

        $('#' + temptable + '_VolumeWeight_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_VolumeWeight_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedVolume_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedVolume_' + rowIndex + '').val('');

        $('#' + TableNamerowIndex + '_AWBOrigin_' + rowIndex + '').data("kendoAutoComplete").setDefaultValue('', '');
        $('#' + TableNamerowIndex + '_HdnAWBOrigin_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_AWBDestination_' + rowIndex + '').data("kendoAutoComplete").setDefaultValue('', '');
        $('#' + TableNamerowIndex + '_HdnAWBDestination_' + rowIndex + '').val('');
        CheckAWBAWBPrefix($('input:text[name=' + TableNamerowIndex + '_AWBPrefix_' + rowIndex + ']'));
    }
    else {
        $('#' + TableNamerowIndex + '_FoundAWB_' + rowIndex + '').prop('selectedIndex', 0);
        $('#' + TableNamerowIndex + '_FoundAWB_' + rowIndex + '').removeAttr('disabled');

        $('input:text[name=' + TableNamerowIndex + '_AWBPrefix_' + rowIndex + ']').val('');
        $('#' + TableNamerowIndex + '_PartSplitTotal_' + rowIndex + '').val('-1');

        $('#' + TableNamerowIndex + '_NatureOfGoods_' + rowIndex + '').attr('required', 'required');

        $('#' + TableNamerowIndex + '_NatureOfGoods_' + rowIndex + '').attr('style', 'width: 115px; text-transform: uppercase; border: 1px solid red;');

        $('#' + TableNamerowIndex + '_PartSplitTotal_' + rowIndex + '').attr('disabled', 'disabled');
        $('input:text[name=' + TableNamerowIndex + '_AWBPrefix_' + rowIndex + ']').removeAttr('disabled');

        $('#' + temptable + '_TotalPieces_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_TotalPieces_' + rowIndex + '').val('');

        $('#' + temptable + '_GrossWeight_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_GrossWeight_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedPcs_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedPcs_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedGrossWt_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedGrossWt_' + rowIndex + '').val('');

        $('#' + temptable + '_CBM_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_CBM_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedCBM_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedCBM_' + rowIndex + '').val('');

        $('#' + temptable + '_VolumeWeight_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_VolumeWeight_' + rowIndex + '').val('');

        $('#' + temptable + '_ArrivedVolume_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_ArrivedVolume_' + rowIndex + '').val('');

        $('#' + TableNamerowIndex + '_AWBOrigin_' + rowIndex + '').data("kendoAutoComplete").setDefaultValue('', '');
        $('#' + TableNamerowIndex + '_HdnAWBOrigin_' + rowIndex + '').val('');
        $('#' + TableNamerowIndex + '_AWBDestination_' + rowIndex + '').data("kendoAutoComplete").setDefaultValue('', '');
        $('#' + TableNamerowIndex + '_HdnAWBDestination_' + rowIndex + '').val('');
        CheckAWBAWBPrefix($('input:text[name=' + TableNamerowIndex + '_AWBPrefix_' + rowIndex + ']'));
    }
}

function AddShipmentDetails(obj) {
    $("#btnSaveAddShipment").removeAttr('disabled');
    var shipmentID = obj.id;
    var dFlightSNo = currentDailyFlightSno == "" ? 0 : currentDailyFlightSno;
    var dFFMFlightMSNo = currentFFMFlightMasterSNo == "" ? 0 : currentFFMFlightMasterSNo;
    if ($("#tbl" + shipmentID).length === 0)
        $("#divAfterContent").html("<table id='tbl" + shipmentID + "'></table>");
    $('#tbl' + shipmentID).appendGrid({
        tableID: 'tbl' + shipmentID,
        contentEditable: true,
        tableColumns: 'SNo,AWBNo,AWBOrigin,AWBDestination,ULD,TotalPieces,GrossWeight,VolumeWeight,SPHC,NatureOfGoods,ArrivedPcs,ArrivedGrossWt,ArrivedCBM,ShipmentRemarks',
        masterTableSNo: (dFlightSNo + '.' + dFFMFlightMSNo),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Import/InboundFlightService.svc',
        getRecordServiceMethod: 'Get' + shipmentID + 'Record',
        isGetRecord: true,
        createUpdateServiceMethod: 'createUpdate' + shipmentID,
        deleteServiceMethod: 'delete' + shipmentID,
        caption: obj.defaultValue,
        initRows: 1,
        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'DailyFlightSNo', type: 'hidden' },
            { name: 'FFMFlightMasterSNo', type: 'hidden' },
            { name: 'HdnAWBSNo', type: 'hidden' },
            { name: 'HdnUpdateFlightDetail', type: 'hidden', value: 0 },
            { name: 'HdnIsNoShow', type: 'hidden' },
            { name: 'HdnFlightDetail', type: 'hidden' },
            {
                name: 'DivAWBNo', display: '', type: 'div', isRequired: true, ctrlCss: { width: '150px' }, divElements:
                    [
                        { divRowNo: 1, name: 'AwbType', display: 'Awb Type', type: 'radiolist', ctrlOptions: { 0: 'AWB', 1: 'UNK' }, selectedIndex: 0, onClick: function (evt, rowIndex) { SelectAWBType(evt.target.id, this); } },
                        { divRowNo: 1, name: 'PartSplitTotal', display: 'Type', type: 'select', ctrlAttr: { onchange: "return CheckPartSplitTotal(this);" }, ctrlOptions: { '-1': 'Select', 'T': 'Total', 'P': 'Part', 'S': 'Split', 'D': 'Divided' }, ctrlCss: { width: '90px', height: '20px' }, isRequired: false, ctrlCss: { width: '125px', height: '20px', color: '#9d331d', 'font-weight': 'bold' } },
                        {
                            divRowNo: 1, name: 'FoundAWB', display: 'Found', type: 'select', ctrlOptions: { '0': 'NONE', '1': 'FDCA', '2': 'FDAW' },
                            ctrlCss: { width: '125px', height: '20px', color: '#9d331d', 'font-weight': 'bold' }, onChange: function (evt, rowIndex) {
                                var ind = evt.target.id.split('_')[2];
                                $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_TotalPieces']").val("");
                                $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_TotalPieces']").val("");
                                $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").val("");
                                $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").val("");

                                if ($("#" + evt.target.id + " option:selected").val() != "0") {
                                    $('#tblAddShipment_lblArrivedPcs_' + ind + '').text('Received Pcs');
                                    $('#tblAddShipment_lblArrivedGrossWt_' + ind + '').text('Received GR.WT');
                                    $('#tblAddShipment_lblArrivedCBM_' + ind + '').text('Received CBM');
                                    $('#tblAddShipment_lblArrivedVolume_' + ind + '').text('Received Volume');
                                }
                                else {
                                    $('#tblAddShipment_lblArrivedPcs_' + ind + '').text('Manifested Pcs');
                                    $('#tblAddShipment_lblArrivedGrossWt_' + ind + '').text('Manifested GR.WT');
                                    $('#tblAddShipment_lblArrivedCBM_' + ind + '').text('Manifested CBM');
                                    $('#tblAddShipment_lblArrivedVolume_' + ind + '').text('Manifested Volume');
                                }

                                if ($("#" + evt.target.id + " option:selected").val() == "2") {
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").val(0);
                                    $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").val(0);
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").val(0);
                                    $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val(0);
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").prop('disabled', true).css("cursor", "not-allowed");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").prop('disabled', true).css("cursor", "not-allowed");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").removeAttr("required", "required");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").removeAttr("required", "required");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").removeAttr("required", "required");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").removeAttr("required", "required");
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_HdnULDType_'").val(0);
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").val('BULK');
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").data("kendoAutoComplete").enable(false);
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").css("cursor", "not-allowed");

                                    $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_OwnerCode']").val("");
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_SerialNo']").val("");
                                    $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_SerialNo']").val("");
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_OwnerCode']").val("");
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_SerialNo']").prop('disabled', true).css("cursor", "not-allowed");
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_OwnerCode']").prop('disabled', true).css("cursor", "not-allowed");
                                    $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_SerialNo']").prop('disabled', true).css("cursor", "not-allowed");
                                    $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_OwnerCode']").prop('disabled', true).css("cursor", "not-allowed");
                                    $("#" + evt.target.id).closest("tr").find("select[id^='tblAddShipment_PartSplitTotal']").val("T");
                                    $("#" + evt.target.id).closest("tr").find("select[id^='tblAddShipment_PartSplitTotal']").prop('disabled', true).css("cursor", "not-allowed");
                                }
                                else {

                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").prop('disabled', false).css("cursor", "auto");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").prop('disabled', false).css("cursor", "auto");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").attr("required", "required");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").attr("required", "required");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").attr("required", "required");
                                    $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").attr("required", "required");
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").data("kendoAutoComplete").enable(true);
                                    $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").css("cursor", "auto");
                                    $("#" + evt.target.id).closest("tr").find("select[id^='tblAddShipment_PartSplitTotal']").prop('disabled', false).css("cursor", "auto");
                                }
                                ChkAwbDetailsExistence(evt.target.id);
                            }
                        },
                        { divRowNo: 1, name: 'ULDType', display: 'ULD/BULK', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckULDType(this);" }, ctrlCss: { width: '90px', height: '20px' }, isRequired: false, AutoCompleteName: 'ImportInbound_ULDType', filterField: 'ULDName' },
                        { divRowNo: 2, name: 'AWBPrefix', display: 'AWB Prefix', type: 'text', ctrlAttr: { maxlength: 3, controltype: "alphanumericupper", onBlur: "CheckAWBAWBPrefix(this);" }, ctrlCss: { width: '67px', color: '#9d331d', 'font-weight': 'bold' }, isRequired: true },
                        { divRowNo: 2, name: 'AWBNumber', display: 'AWB No', type: 'text', ctrlAttr: { maxlength: 8, controltype: "alphanumeric", onBlur: "CheckAWBNumber(this);", oninput: "this.value = this.value.replace(/[^0-9.]/g, '');" }, ctrlCss: { width: '70px', color: '#9d331d', 'font-weight': 'bold' }, isRequired: true },
                        {
                            divRowNo: 2, name: 'AWBOrigin', display: 'Org.', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckFAOriginAndDestination(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, AutoCompleteName: 'ImportInbound_AWBOrigin', filterField: 'CityCode', filterCriteria: "contains"
                        },
                        { divRowNo: 2, name: 'AWBDestination', display: 'Dest.', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckFAOriginAndDestination(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, AutoCompleteName: 'ImportInbound_AWBDestination', filterField: 'CityCode', filterCriteria: "contains" },
                        {
                            divRowNo: 2, name: 'RefNo', display: 'CN38 No', type: 'text', ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 12, allowchar: '-' },
                            ctrlCss: { width: '105px', display: "none" }, isRequired: false
                        },
                        {
                            divRowNo: 2, name: 'FlightDetail', type: 'custom',
                            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                                var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                                var ctrl = document.createElement('span');
                                $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                                $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_btnFlightDetail', value: 'Flight Detail', onclick: ' OpenFlightPopUp(this)' }).css('width', '75px').appendTo(ctrl).button();
                                return ctrl;
                            }
                        },
                        { divRowNo: 3, name: 'TotalPieces', display: 'Total Pcs', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "AWBCheckTotalPcs(this);" }, ctrlCss: { width: '70px' }, isRequired: true },

                        { divRowNo: 3, name: 'GrossWeight', display: 'Gr.WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal3", onBlur: "CheckTotalGrossWt(this);" }, ctrlCss: { width: '75px' }, isRequired: true },
                        { divRowNo: 3, name: 'CBM', display: 'CBM', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal3", onBlur: "CheckCBM(this);" }, ctrlCss: { width: '128px' }, isRequired: true },
                        { divRowNo: 3, name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "CheckVolume(this);" }, ctrlCss: { width: '128px' }, isRequired: true },

                        { divRowNo: 3, name: 'SPHC', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return GetAddShipmentSPHC(this);" }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'ImportInbound_SPHC', filterField: 'Code' },
                        {
                            divRowNo: 3, name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 15 },
                            ctrlCss: { width: '115px' }, isRequired: true
                        },
                        { divRowNo: 4, name: 'ArrivedPcs', display: 'Manifested Pcs', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckTotalPcs(this);" }, ctrlCss: { width: '70px' }, isRequired: true },
                        { divRowNo: 4, name: 'ArrivedGrossWt', display: 'Manifested GR.WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal3", onBlur: "CheckTotalGrossWt(this);" }, ctrlCss: { width: '75px' }, isRequired: true },
                        { divRowNo: 4, name: 'ArrivedCBM', display: 'Manifested CBM', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal3", onBlur: "CheckManifestCBM(this);" }, ctrlCss: { width: '128px' }, isRequired: true },
                        { divRowNo: 4, name: 'ArrivedVolume', display: 'Manifested Volume', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "CheckArrivedVolume(this);" }, ctrlCss: { width: '128px' }, isRequired: true },
                        { divRowNo: 4, name: 'ShipmentRemarks', display: 'Remarks', type: 'text', ctrlAttr: { maxlength: 40, controltype: "alphanumericupper" }, ctrlCss: { width: '120px' } },
                        { divRowNo: 4, name: 'KeepSameULD', display: 'Keep Same ULD', type: 'checkbox' },
                    ]
            },
        ],
        rowUpdateExtraFunction: function (id) {
            $("#tblAddShipment").find("tr:eq(1)").find("td:eq(1)").find("font").hide();
        },
        afterRowAppended: function (tbWhole, parentIndex, addedRows) {
            var currentIndex = addedRows.length;
            $("#tblAddShipment").find("input[id^='tblAddShipment_AWBPrefix']").each(function (i, el) {
                var ind = $(this).attr('id').split('_')[2];
                $(el).css('background', 'bisque');
                $(el).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").css('background', 'bisque');
                $(el).closest("table").find("select[id^='tblAddShipment_FoundAWB']").css('background', 'bisque');
                $(el).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                $(el).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                $(el).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(false);
                $(el).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(false);
                $(el).closest("table").find("select[id^='tblAddShipment_PartSplitTotal']").attr('disabled', 'disabled');
                if (i == currentIndex) {
                    $(el).closest("table").find("input[id^='tblAddShipment_FlightDetail']").css("display", "none");
                }
                if (userContext.SysSetting.ClientEnvironment == "JT") {
                    $(el).closest("table").find("input[id^='tblAddShipment_HdnUpdateFlightDetail']").val(1);
                }
                if (ind > 1) {

                }
            })
        },
        isPaging: true,
    });

    $("#tblAddShipment_btnAppendRow").closest("td").append("&nbsp;&nbsp;<input type='button' id='btnSaveAddShipment' value='Save Shipment' class='incompleteprocess' />");

    $("input[id^='tblAddShipment_FlightDetail']").css("display", "none");
    if (userContext.SysSetting.ClientEnvironment != "JT") {
        $("input[id^='tblAddShipment_HdnUpdateFlightDetail']").val(1);
    }

    if ($("tr[id^='tblAddShipment_Row").length == 1)
        $("#tblAddShipment_btnRemoveLast").hide();
    else
        $("#tblAddShipment_btnRemoveLast").show();

    cfi.PopUp("tbl" + shipmentID, obj.defaultValue, 1350, null, null, 10);

    $("#btnSaveAddShipment").on('click', function (event) {
        SaveShipment(event);
    });
}

function OpenFlightPopUp(obj) {
    if ($("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_HdnFlightDetail_").val().length > 0) {
        var data = JSON.parse($("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_HdnFlightDetail_").val().replace(/'/g, '"'));

        $("#tblShipmentFlight").appendGrid({
            V2: true,
            tableID: 'tblShipmentFlight',
            contentEditable: true,
            masterTableSNo: awbFlightSNo,
            servicePath: './Services/Import/InboundFlightService.svc',
            isGetRecord: false,
            deleteServiceMethod: 'DeleteShipmentFlightRecord',
            hideButtons: { updateAll: true, append: false, insert: true, remove: false, removeLast: true },
            columns: [
                { name: 'AWBSNo', type: 'hidden', value: awbFlightSNo },
                { name: 'ShipmentOriginSNo', type: 'hidden', value: awbOriginSNo },
                { name: 'AirlineName', display: 'Airline', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ShipmentAirlineAutocomplete', filterField: 'AirlineName,AirlineCode' },
                { name: 'OriginAirport', display: 'Origin Airport', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ImportInbound_FlightOrigin', filterField: 'AirportCode,AirportName' },
                { name: 'DestinationAirport', display: 'Destination Airport', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckCurrentDestination(this);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ImportInbound_FlightDest', filterField: 'AirportCode,AirportName' },
                { name: 'FlightDate', display: 'Flight Date', type: "text", ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', dblclick: "return false", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false" }, },
                { name: 'FlightNo', display: 'Flight No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onclick: "return false;" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'OpenFlightDetailAutocomplete', filterField: 'FlightNo' },
            ],
            rowUpdateExtraFunction: function (id) {
            },
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {
                //$("tr[id='tblShipmentFlight_Row_" + addedRows + "']").next("tr")
                $("#tblShipmentFlight_Delete_" + addedRows).hide();
                if ($("tr[id^='tblShipmentFlight_Row_").length == 1) {
                    //$("input[id^='tblShipmentFlight_OriginAirport_']").data("kendoAutoComplete").setDefaultValue(awbOriginSNo, awbOrigin);
                    //$("input[id^='tblShipmentFlight_OriginAirport_']").data("kendoAutoComplete").enable(false);
                }

                if (addedRows > 0) {
                    var NewRow = $("tr[id='tblShipmentFlight_Row_" + addedRows + "']").next("tr").attr("id").split("_")[2];
                    var DestinationAirportCode = $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").value();
                    var DestinationAirportSNo = $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").key();
                    $("input[id^='tblShipmentFlight_OriginAirport_" + NewRow.toString() + "']").data("kendoAutoComplete").setDefaultValue(DestinationAirportSNo, DestinationAirportCode);

                    $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_AirlineName_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_FlightDate_" + addedRows + "']").data("kendoDatePicker").enable(false);
                    $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_FlightNo_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_FlightNo_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_OriginAirport_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_OriginAirport_" + NewRow.toString() + "']").data("kendoAutoComplete").enable(false);
                }

                if (parentIndex == null) {
                    $("#tblShipmentFlight").find("tbody").find("tr").each(function (i, el) {
                        $(el).closest("tr").find("input[id^='tblShipmentFlight_OriginAirport']").data("kendoAutoComplete").setDefaultValue("", "");
                        $(el).closest("tr").find("input[id^='tblShipmentFlight_DestinationAirport']").data("kendoAutoComplete").setDefaultValue("", "");
                    })
                }
            },
            afterRowRemoved: function (caller, rowIndex) {
                $("#tblShipmentFlight_Delete_" + rowIndex).show();
                //var ind = $(this).attr('id').split('_')[2];
                //if ($("#tblShipmentFlight").find("tbody").find("tr").length != Number(ind)) {
                var citySno = 0;
                if (rowIndex != 0) {
                    if ($("table[id$='tblShipmentFlight']").find("tbody").find("tr").length == 1) {
                        $("input[id^='tblShipmentFlight_DestinationAirport_']").data("kendoAutoComplete").enable(true)
                        citySno = $("#tblShipmentFlight_HdnDestinationAirport_").val();
                    }
                    else {
                        $("input[id^='tblShipmentFlight_DestinationAirport_" + rowIndex + "']").data("kendoAutoComplete").enable(true);
                        citySno = $("#tblShipmentFlight_HdnDestinationAirport_" + rowIndex).val();
                    }
                }

                if (citySno == userContext.AirportSNo) {
                    $("#tblShipmentFlight_btnAppendRow").hide();
                    $("#btnSaveFlightDetail").hide();
                }
                else {
                    $("#tblShipmentFlight_btnAppendRow").show();
                    $("#btnSaveFlightDetail").show();
                }
            }
        });

        $("#tblShipmentFlight").appendGrid('load', data);

        $("#tblShipmentFlight_btnAppendRow").closest("td").append("&nbsp;&nbsp;<input type='button' id='btnSaveFlightDetail' value='Save Flight' class='incompleteprocess'/>");

        $("#tblShipmentFlight").find("tbody").find("tr").each(function (i, el) {
            var ind = $(this).attr('id').split('_')[2];
            $(el).closest("tr").find("input[id^='tblShipmentFlight_OriginAirport']").data("kendoAutoComplete").enable(false);
            if ($("#tblShipmentFlight").find("tbody").find("tr").length != Number(ind)) {
                $(el).closest("tr").find("input[id^='tblShipmentFlight_AirlineName']").data("kendoAutoComplete").enable(false);
                $(el).closest("tr").find("input[id^='tblShipmentFlight_DestinationAirport']").data("kendoAutoComplete").enable(false);
                $(el).closest("tr").find("input[id^='tblShipmentFlight_FlightDate']").data("kendoDatePicker").enable(false);
                $(el).closest("tr").find("input[id^='tblShipmentFlight_FlightNo']").data("kendoAutoComplete").enable(false);
                $(el).closest("table").find("button[id^='tblShipmentFlight_Delete_" + i + "']").hide();
            }

            var citySno = $(el).closest("tr").find("input[id^='tblShipmentFlight_HdnDestinationAirport']").val();
            if (citySno == userContext.AirportSNo) {
                $("#tblShipmentFlight_btnAppendRow").hide();
                $("#btnSaveFlightDetail").hide();
                $(el).closest("table").find("button[id^='tblShipmentFlight_Delete_" + i + "']").show();
                $(el).closest("tr").find("input[id^='tblShipmentFlight_DestinationAirport']").data("kendoAutoComplete").enable(true);
            }
        })
    }
    else {
        var awbFlightSNo = 0;
        var awbOriginSNo = 0;
        var awbOrigin = 0;
        awbFlightSNo = $("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_HdnAWBSNo_").val();
        awbOriginSNo = $("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_HdnAWBOrigin_").val();
        awbOrigin = $("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_AWBOrigin_").val();

        $("#tblShipmentFlight").appendGrid({
            V2: true,
            tableID: 'tblShipmentFlight',
            contentEditable: true,
            masterTableSNo: awbFlightSNo,
            servicePath: './Services/Import/InboundFlightService.svc',
            isGetRecord: false,
            deleteServiceMethod: 'DeleteShipmentFlightRecord',
            hideButtons: { updateAll: true, append: false, insert: true, remove: false, removeLast: true },
            columns: [
                { name: 'AWBSNo', type: 'hidden', value: awbFlightSNo },
                { name: 'ShipmentOriginSNo', type: 'hidden', value: awbOriginSNo },
                { name: 'AirlineName', display: 'Airline', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ShipmentAirlineAutocomplete', filterField: 'AirlineName,AirlineCode' },
                { name: 'OriginAirport', display: 'Origin Airport', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ImportInbound_FlightOrigin', filterField: 'AirportCode,AirportName' },
                { name: 'DestinationAirport', display: 'Destination Airport', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckCurrentDestination(this);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ImportInbound_FlightDest', filterField: 'AirportCode,AirportName' },
                { name: 'FlightDate', display: 'Flight Date', type: "text", ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', dblclick: "return false", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false" }, },
                { name: 'FlightNo', display: 'Flight No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onclick: "return false;" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'OpenFlightDetailAutocomplete', filterField: 'FlightNo' },
            ],
            rowUpdateExtraFunction: function (id) {
            },
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {
                $("#tblShipmentFlight_Delete_" + addedRows).hide();
                if ($("tr[id^='tblShipmentFlight_Row_").length == 1) {
                }

                if (addedRows > 0) {
                    var NewRow = $("tr[id='tblShipmentFlight_Row_" + addedRows + "']").next("tr").attr("id").split("_")[2];
                    var DestinationAirportCode = $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").value();
                    var DestinationAirportSNo = $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").key();
                    $("input[id^='tblShipmentFlight_OriginAirport_" + NewRow.toString() + "']").data("kendoAutoComplete").setDefaultValue(DestinationAirportSNo, DestinationAirportCode);

                    $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_AirlineName_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_FlightDate_" + addedRows + "']").data("kendoDatePicker").enable(false);
                    $("input[id^='tblShipmentFlight_DestinationAirport_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_FlightNo_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_FlightNo_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_OriginAirport_" + addedRows + "']").data("kendoAutoComplete").enable(false);
                    $("input[id^='tblShipmentFlight_OriginAirport_" + NewRow.toString() + "']").data("kendoAutoComplete").enable(false);
                }
            },
            afterRowRemoved: function (caller, rowIndex) {
                $("#tblShipmentFlight_Delete_" + rowIndex).show();
                $("input[id^='tblShipmentFlight_DestinationAirport_" + rowIndex + "']").data("kendoAutoComplete").enable(true);
                var citySno = $("#tblShipmentFlight_HdnDestinationAirport_" + rowIndex).val();

                if (citySno == userContext.AirportSNo) {
                    $("#tblShipmentFlight_btnAppendRow").hide();
                }
                else {
                    $("#tblShipmentFlight_btnAppendRow").show();
                }
            }
        });

        $("#tblShipmentFlight").find("input[id^='tblShipmentFlight_AirlineName']").each(function (i, el) {
            var ind = $(this).attr('id').split('_')[2];
            $(el).closest("table").find("input[id^='tblShipmentFlight_HdnAirlineName']").val($(el).closest("table").find("input[id^='tblShipmentFlight_AirlineSNo']").val());
            $(el).closest("table").find("input[id^='tblShipmentFlight_HdnFlightNo']").val($(el).closest("table").find("input[id^='tblShipmentFlight_DailyFlightSNo']").val());
        })

        $("#tblShipmentFlight_btnAppendRow").closest("td").append("&nbsp;&nbsp;<input type='button' id='btnSaveFlightDetail' value='Save Flight' class='incompleteprocess' />");
    }
    $("#btnSaveFlightDetail").on('click', function (event) {
        var res = $("#tblShipmentFlight tr[id^='tblShipmentFlight']").map(function () { return $(this).attr("id").split('_')[2] }).get();
        if (!validateTableData('tblShipmentFlight', res)) {
            return false;
        }
        var strData = "";
        if ($("#tblShipmentFlight").find("tbody").find("tr").find("td").text() == "This Grid Is Empty") {
            ShowMessage('warning', 'Kindly add flight detail.');
        }
        else {
            var settings = $("#tblShipmentFlight").data('appendGrid');
            var strData = tableToJSON(settings.tableID, settings.columns, res);
            strData = strData.replace(/"/g, "'");
            $("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_HdnFlightDetail_").val(strData);

            //$("#tblShipmentFlight").find("tbody").find("tr").each(function (i, el) {
            //    var AirlineName = $(this).find("input[id^='tblShipmentFlight_AirlineName']").val();
            //    var HdnFlightNo = $(this).find("input[id^='tblShipmentFlight_HdnFlightNo']").val();
            //    awbFlightSNo = $("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_HdnAWBSNo_").val();
            //    strData += (strData.length > 0 ? "^" : "") + HdnFlightNo + "-" + awbFlightSNo + "-" + AirlineName + "-" + HdnFlightNo;
            //});
            //$("#tblAddShipment_Row_" + obj.id.split('_')[2] + "").find("input[id^='tblAddShipment_HdnFlightDetail_").val(strData);
            ShowMessage('success', 'Success', "Flight details added successfully");
            //$("#divFlightDetailSection").data("kendoWindow").close();
            $("#divFlightDetailSection").data("kendoWindow").destroy();
            $("#divFlightArrivalDetails").append("<div id='divFlightDetailSection'><table id='tblShipmentFlight'></table></div>");
            //$("#divFlightArrivalDetails").append("<div id='divFlightDetailSection'><table id='tblShipmentFlight' class='appendGrid ui-widget k-window-content k-content' data-role='window'><thead class='ui-widget-header'><tr><td class='ui-widget-header'></td><td class='ui-widget-header'></td><td class='ui-widget-header'></td><td class='ui-widget-header'></td><td class='ui-widget-header'></td><td class='ui-widget-header'></td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'></tbody></table></div>");
            $("input[id^='tblAddShipment_HdnUpdateFlightDetail_" + obj.id.split('_')[2] + "']").val(1);
        }
    });

    cfi.PopUp("divFlightDetailSection", "Flight Detail", 1000, null, null);
}

function CheckCurrentDestination(obj) {
    if ($(obj).val() != "") {
        var citySno = $("#" + $(obj).attr("id").split("_")[0] + "_" + $(obj).attr("id").split("_")[1].replace("DestinationAirport", "HdnDestinationAirport") + "_" + $(obj).attr("id").split("_")[2]).val();
        if (citySno == userContext.AirportSNo) {
            $("#tblShipmentFlight_btnAppendRow").hide();
        }
        else {
            $("#tblShipmentFlight_btnAppendRow").show();
            $("#btnSaveFlightDetail").show();
            $("#" + $(obj).attr("id").split("_")[0] + "_" + $(obj).attr("id").split("_")[1].replace("DestinationAirport", "FlightNo") + "_" + $(obj).attr("id").split("_")[2]).data("kendoAutoComplete").enable(true);
            $("#" + $(obj).attr("id").split("_")[0] + "_" + $(obj).attr("id").split("_")[1].replace("DestinationAirport", "FlightNo") + "_" + $(obj).attr("id").split("_")[2]).data("kendoAutoComplete").setDefaultValue("", "");
            $("#" + $(obj).attr("id").split("_")[0] + "_" + $(obj).attr("id").split("_")[1].replace("DestinationAirport", "FlightDate") + "_" + $(obj).attr("id").split("_")[2]).data("kendoDatePicker").enable(true)
        }
    }
}

function CheckAWBTPS(obj) {
    var arrAddShipment = [];
    var ind = obj.split('_')[2];
    var awbPrefix = $('#tblAddShipment_AWBPrefix_' + ind).val();
    var awbNo = $('#tblAddShipment_AWBNumber_' + ind).val();
    var CurrentAWBNo = awbPrefix + '-' + awbNo;
    var PartSplitTotal = $("select[id='tblAddShipment_PartSplitTotal_" + ind + "'] option:selected").val();
    var ULDType = $('#tblAddShipment_ULDType_' + ind).val();
    var SerialNo = $('#tblAddShipment_SerialNo_' + ind).val();
    var OwnerCode = $('#tblAddShipment_OwnerCode_' + ind).val();
    var ULDNo = ULDType + (SerialNo == undefined ? '' : SerialNo) + (OwnerCode == undefined ? '' : OwnerCode);

    if (ULDNo == undefined || ULDNo == "") {
        return;
    }

    $("table tr[id^='tblAddShipment_Row_']").each(function () {
        var ind1 = $(this).attr('id').split('_')[2];
        var msgErr1;
        var _ValuePartSplitTotal = $("select[id='tblAddShipment_PartSplitTotal_" + ind1 + "'] option:selected").val();
        var _ValueAWBPrefix = $("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_AWBPrefix_" + ind1 + "']").val();
        var _ValueAWBNumber = $("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_AWBNumber_" + ind1 + "']").val();
        var _ValueAWBNo = _ValueAWBPrefix + '-' + _ValueAWBNumber;
        var _ValueULDType = $("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_ULDType_" + ind1 + "']").val();
        var _ValueSerialNo = $("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_SerialNo_" + ind1 + "']").val();
        var _ValueOwnerCode = $("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_OwnerCode_" + ind1 + "']").val();
        var _ValueULDNo = _ValueULDType + (_ValueSerialNo == undefined ? '' : _ValueSerialNo) + (_ValueOwnerCode == undefined ? '' : _ValueOwnerCode);

        arrAddShipment.push({
            ValuePartSplitTotal: _ValuePartSplitTotal,
            ValueAWBNo: _ValueAWBNo,
            ValueULDNo: _ValueULDNo
        })
    });

    if (arrAddShipment != null && arrAddShipment.length > 0) {
        var count = 0;
        for (var i = 0; i < arrAddShipment.length; i++) {
            for (var j = 0; j < arrAddShipment.length; j++) {
                var checkedValue = arrAddShipment[j]["ValuePartSplitTotal"] + '#' + arrAddShipment[j]["ValueAWBNo"];

                // Start 
                // Case For Error prompt in T/S/P/D at "Add shipment" Bug ID 6781
                var checkedValueType = checkedValue.substring(0, 1);
                var text = "";
                switch (checkedValueType) {
                    case "T":
                        text = "Total";
                        break;
                    case "P":
                        text = "Part";
                        break;
                    case "S":
                        text = "Split";
                        break;
                    case "D":
                        text = "Divided";
                        break;
                }
                // END

                if (PartSplitTotal == "T") { // Check More than T
                    if ((PartSplitTotal + '#' + CurrentAWBNo) == checkedValue) {
                        count = count + 1;
                        if (count > 1) {
                            var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + " With Description Code(Total) Already Exists.";
                            ShowMessage("warning", "Warning - Add Shipment", msg);
                            $('#tblAddShipment_AWBPrefix_' + ind).val("");
                            $('#tblAddShipment_AWBNumber_' + ind).val("");
                            $('#tblAddShipment_OwnerCode_' + ind).val("");
                            $('#tblAddShipment_SerialNo_' + ind).val("");
                            return;
                        }
                    }
                    else if (CurrentAWBNo == arrAddShipment[j]["ValueAWBNo"] && (arrAddShipment[j]["ValuePartSplitTotal"] != PartSplitTotal)) {
                        var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + " With Description Code(" + text + ") Already Exists.";
                        ShowMessage("warning", "Warning - Add Shipment", msg);
                        $('#tblAddShipment_AWBPrefix_' + ind).val("");
                        $('#tblAddShipment_AWBNumber_' + ind).val("");
                        $('#tblAddShipment_OwnerCode_' + ind).val("");
                        $('#tblAddShipment_SerialNo_' + ind).val("");
                        return;
                    }
                }

                if (PartSplitTotal == "P") { // Check More than P
                    if ((PartSplitTotal + '#' + CurrentAWBNo) == checkedValue) {
                        count = count + 1;
                        if (count > 1) {
                            var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + " With Description Code(Part) Already Exists.";
                            ShowMessage("warning", "Warning - Add Shipment", msg);
                            $('#tblAddShipment_AWBPrefix_' + ind).val("");
                            $('#tblAddShipment_AWBNumber_' + ind).val("");
                            $('#tblAddShipment_OwnerCode_' + ind).val("");
                            $('#tblAddShipment_SerialNo_' + ind).val("");
                            return;
                        }
                    }
                }

                if (PartSplitTotal == "P") { // Check P with T or S
                    if (CurrentAWBNo == arrAddShipment[j]["ValueAWBNo"] && (arrAddShipment[j]["ValuePartSplitTotal"] != PartSplitTotal)) {
                        var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + " With Description Code(" + text + ") Already Exists.";
                        ShowMessage("warning", "Warning - Add Shipment", msg);
                        $('#tblAddShipment_AWBPrefix_' + ind).val("");
                        $('#tblAddShipment_AWBNumber_' + ind).val("");
                        $('#tblAddShipment_OwnerCode_' + ind).val("");
                        $('#tblAddShipment_SerialNo_' + ind).val("");
                        return;
                    }
                }

                if (PartSplitTotal == "S") { // Check S with T or P
                    if (CurrentAWBNo == arrAddShipment[j]["ValueAWBNo"] && (arrAddShipment[j]["ValuePartSplitTotal"] != PartSplitTotal)) {
                        var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + " With Description Code(" + text + ") Already Exists.";
                        ShowMessage("warning", "Warning - Add Shipment", msg);
                        $('#tblAddShipment_AWBPrefix_' + ind).val("");
                        $('#tblAddShipment_AWBNumber_' + ind).val("");
                        $('#tblAddShipment_OwnerCode_' + ind).val("");
                        $('#tblAddShipment_SerialNo_' + ind).val("");
                        return;
                    }
                    else if (('S#' + CurrentAWBNo + '#' + ULDNo) == checkedValue + '#' + arrAddShipment[j]["ValueULDNo"]) {
                        {
                            count = count + 1;
                            if (count > 1) {
                                var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + " With Description Code(Split) Already Exists in Bulk.";
                                ShowMessage("warning", "Warning - Add Shipment", msg);
                                $('#tblAddShipment_AWBPrefix_' + ind).val("");
                                $('#tblAddShipment_AWBNumber_' + ind).val("");
                                $('#tblAddShipment_OwnerCode_' + ind).val("");
                                $('#tblAddShipment_SerialNo_' + ind).val("");
                                return;
                            }
                        }
                    }
                }

                /// Added by Deepak sharma for D checkin/////////////
                if (PartSplitTotal == "D") { // Check D with T or P
                    if (CurrentAWBNo == arrAddShipment[j]["ValueAWBNo"] && (arrAddShipment[j]["ValuePartSplitTotal"] != PartSplitTotal)) {
                        var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + "With Description Code(" + text + ") Already Exists.";
                        ShowMessage("warning", "Warning - Add Shipment", msg);
                        $('#tblAddShipment_AWBPrefix_' + ind).val("");
                        $('#tblAddShipment_AWBNumber_' + ind).val("");
                        $('#tblAddShipment_OwnerCode_' + ind).val("");
                        $('#tblAddShipment_SerialNo_' + ind).val("");
                        return;
                    }
                    else if (('D#' + CurrentAWBNo + '#' + ULDNo) == checkedValue + '#' + arrAddShipment[j]["ValueULDNo"]) {
                        {
                            count = count + 1;
                            if (count > 1) {
                                var msg = "AWB No: " + CurrentAWBNo.toUpperCase() + " With Description Code(Divide) Already Exists.";
                                ShowMessage("warning", "Warning - Add Shipment", msg);
                                $('#tblAddShipment_AWBPrefix_' + ind).val("");
                                $('#tblAddShipment_AWBNumber_' + ind).val("");
                                $('#tblAddShipment_OwnerCode_' + ind).val("");
                                $('#tblAddShipment_SerialNo_' + ind).val("");
                                return;
                            }
                        }
                    }
                }
            }
            if (count > 1)
                return;
            count = 0;
        }
    }
}

function ChkAwbDetailsExistence(obj) {
    var ind = obj.split('_')[2];
    var awbPrefix = $('#tblAddShipment_AWBPrefix_' + ind).val();
    var awbNo = $('#tblAddShipment_AWBNumber_' + ind).val();
    var CurrentAWBNo = awbPrefix + '-' + awbNo;
    var ffmflightMasterSno = $('#tblAddShipment_FFMFlightMasterSNo_' + ind).val();
    var PartSplitTotal = $('#tblAddShipment_PartSplitTotal_' + ind).val();
    var ULdType = $('#tblAddShipment_ULDType_' + ind).val();
    var SerialNo = $('#tblAddShipment_SerialNo_' + ind).val();
    var OwnerCode = $('#tblAddShipment_OwnerCode_' + ind).val();
    var FoundAWB = $('#tblAddShipment_FoundAWB_' + ind + " option:selected").val();

    var ULDNo = ULdType + (SerialNo == undefined ? '' : SerialNo) + (OwnerCode == undefined ? '' : OwnerCode);
    if (CurrentAWBNo.length == 12) {
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/ChkAwbDetailsExistence", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CurrentAWBNo: CurrentAWBNo, ffmflightMasterSno: ffmflightMasterSno, PartSplitTotal: PartSplitTotal, ULDNo: ULDNo, DailyFlightSNo: currentDailyFlightSno, FoundAWB: FoundAWB }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "1") {
                    ShowMessage('warning', 'Need your Kind Attention!', result);
                    $('#tblAddShipment_AWBPrefix_' + ind).val("");
                    $('#tblAddShipment_AWBNumber_' + ind).val("");
                    $('#tblAddShipment_AWBPrefix_' + ind).focus();
                }
            }
        });
    }
}

function GetAddShipmentSPHC(obj) {
    if ($(obj).val() == "MAL") {
        $(obj).closest("tr").find("input[id^='tblAddShipment_RefNo']").css("display", "block");
        $(obj).closest("tr").find("input[id^='tblAddShipment_RefNo']").attr("required", "required");
    }
    else {
        $(obj).closest("tr").find("input[id^='tblAddShipment_RefNo']").css("display", "none");
        $(obj).closest("tr").find("input[id^='tblAddShipment_RefNo']").removeAttr("required");
    }
}

function CheckULDType(obj) {
    $("input[id^='tblAddShipment_SerialNo']").removeClass("k-state-disabled");
    $(obj).closest("tr").find("input[id^='_temptblAddShipment_SerialNo']").val("");
    $(obj).closest("tr").find("input[id^='tblAddShipment_SerialNo']").val("");
    $(obj).closest("tr").find("input[id^='_temptblAddShipment_OwnerCode']").val("");
    $(obj).closest("tr").find("input[id^='tblAddShipment_OwnerCode']").val("");
    if ($(obj).val() == 'BULK') {
        $(obj).closest("tr").find("input[id^='tblAddShipment_SerialNo']").prop('disabled', true).css("cursor", "not-allowed");
        $(obj).closest("tr").find("input[id^='tblAddShipment_OwnerCode']").prop('disabled', true).css("cursor", "not-allowed");
        $(obj).closest("tr").find("input[id^='_temptblAddShipment_SerialNo']").prop('disabled', true).css("cursor", "not-allowed");
        $(obj).closest("tr").find("input[id^='_temptblAddShipment_OwnerCode']").prop('disabled', true).css("cursor", "not-allowed");
        $(obj).closest("tr").next().find("input[id^='tblAddShipment_ThroughULD']").prop('disabled', true).css("cursor", "not-allowed");
        $(obj).closest("tr").next().find("input[id^='tblAddShipment_ThroughULD']").removeAttr("checked");
    }
    else {
        $(obj).closest("tr").find("input[id^='tblAddShipment_SerialNo']").prop('disabled', false).css("cursor", "auto");
        $(obj).closest("tr").find("input[id^='tblAddShipment_OwnerCode']").prop('disabled', false).css("cursor", "auto");
        $(obj).closest("tr").find("input[id^='_temptblAddShipment_SerialNo']").prop('disabled', false).css("cursor", "auto");
        $(obj).closest("tr").find("input[id^='_temptblAddShipment_OwnerCode']").prop('disabled', false).css("cursor", "auto");
        $(obj).closest("tr").next().find("input[id^='tblAddShipment_ThroughULD']").prop('disabled', false).css("cursor", "auto");
    }

    if ($(obj).closest("table").find("select[id^='tblAddShipment_FoundAWB'] option:selected").val() == "0") {
        CheckAWBTPS($(obj).attr('id'));
        ChkAwbDetailsExistence($(obj).attr('id'));
    }
}

function CheckSerialNo(obj) {
    if ($("#tblAddShipment_SerialNo_" + $(obj).attr('id').split('_')[2]).val().length < 4) {
        $(obj).val("");
        ShowMessage('warning', 'Need your Kind Attention!', 'Serial No should be minimum 4 character.');
    }
    if ($("#tblAddShipment_SerialNo_" + $(obj).attr('id').split('_')[2]).val() == 0000 || $("#tblAddShipment_SerialNo_" + $(obj).attr('id').split('_')[2]).val() == 00000) {
        $(obj).val("");
        ShowMessage('warning', 'Need your Kind Attention!', "ULD Serial No should be greater than 0 !!!");
    }
    if ($(obj).closest("table").find("select[id^='tblAddShipment_FoundAWB'] option:selected").val() == "0") {
        CheckAWBTPS($(obj).attr('id'));
        ChkAwbDetailsExistence($(obj).attr('id'));
    }
}

function CheckOwnerCode(obj) {
    if ($("#tblAddShipment_OwnerCode_" + $(obj).attr('id').split('_')[2]).val().length < 2) {
        $(obj).val("");
        ShowMessage('warning', 'Need your Kind Attention!', 'Owner Code should be minimum 2 character.');
    }
    if ($(obj).closest("table").find("select[id^='tblAddShipment_FoundAWB'] option:selected").val() == "0") {
        CheckAWBTPS($(obj).attr('id'));
        ChkAwbDetailsExistence($(obj).attr('id'));
    }
}

function CheckULDNo(obj) {
    if ($("#tblAddShipment_BULKOrULD_" + $(obj).attr('id').split('_')[2] + " option:selected").val() == "ULD") {
        if ($("#tblAddShipment_ULD_" + $(obj).attr('id').split('_')[2]).val().length < 9) {
            $(obj).val("");
            ShowMessage('warning', 'Need your Kind Attention!', 'ULD No should be minimum 9 character.');
        }
    }
}

function SaveShipment(event) {

    var res = $("#tblAddShipment tr[id^='tblAddShipment']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAddShipment');
    var data = JSON.parse(($('#tblAddShipment').appendGrid('getStringJson')));
    var cehckpieces = true;
    var cehckULD = true;
    var avilship = true;
    var IsBookedNoShow;
    for (var i = 0; i < data.length; i++) {
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT' && data[i].HdnUpdateFlightDetail == 0 && data[i].HdnIsNoShow == 1) {
            ShowMessage('warning', 'Need your Kind Attention!', 'Please update Flight detail for No Show shipment');
            return false;
        }

        if (data[i].ULDType == "") {
            ShowMessage('warning', 'Need your Kind Attention!', 'Select ULD Type');
            return false;
        }

        if ((parseInt(data[i].ArrivedPcs) < parseInt(data[i].TotalPieces)) && (parseFloat(data[i].ArrivedGrossWt) == parseFloat(data[i].GrossWeight))) {
            ShowMessage('warning', 'Need your Kind Attention!', 'Received GR.WT can not be equal or greater than Gr.WT ');
            return false;
        }

        if (data[i].ArrivedCBM == "") {
            data[i].ArrivedCBM = "0";
        }

        if (data[i].VolumeWeight == "") {
            data[i].VolumeWeight = "0";
        }

        if (data[i].ArrivedPcs == "") {
            data[i].ArrivedPcs = "0";
        }

        if (data[i].ArrivedGrossWt == "") {
            data[i].ArrivedGrossWt = "0";
        }

        if (data[i].ULDType != "BULK") {

            data[i].SerialNo = data[i].ULDType.substring(3, data[i].ULDType.length - 3);
            data[i].OwnerCode = data[i].ULDType.substring(data[i].ULDType.length - 3, data[i].ULDType.length);
            data[i].ULDType = data[i].ULDType.substring(0, 3);
        }

        if (data[i].AWBPrefix.toUpperCase() == "UNK") {
            data[i].AWBDestination = "0";
            data[i].HdnAWBDestination = "0";
            data[i].HdnAWBOrigin = "0";
        }

        $.ajax({
            url: "Services/Import/InboundFlightService.svc/CheckAwbExistinExport", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CheckCurrentAWBNo: data[i].AWBPrefix + '-' + data[i].AWBNumber, Pieces: data[i].ArrivedPcs, DailyFlightSNo: data[i].DailyFlightSNo, ULDType: data[i].ULDStockSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    IsBookedNoShow = resData[0].IsNoShow;
                    if (data[i].FoundAWB != "0") {
                        if (parseInt(resData[0].Column11) > 0) {
                            avilship = false;
                            return false;
                        }
                    }

                    if (resData[0].Column9 != "") {
                        cehckULD = false;
                        return false;
                    }

                    if (userContext.SysSetting.ClientEnvironment == "JT") {
                        if (resData[0].IsAWBStockExistsOrNot == 1 && resData[0].IsBooked == 1) {
                            ShowMessage('warning', 'Add Shipment', 'AWB is in Booked state. Cannot be marked as Found Cargo.');
                            return false;
                        }
                    }
                }
            }
        });

        $.ajax({
            url: "Services/Import/InboundFlightService.svc/CheckAirlineExistsByPrefix", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ Prefix: data[i].AWBPrefix, DailyFlighSNo: currentDailyFlightSno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData3 = Data.Table3;
                if (resData3.length > 0) {
                    if (resData3[0].AirlineCode == data[i].AWBPrefix) {
                        cehckpieces = true;
                    }
                }
            }
        });

        if (!avilship) {
            ShowMessage('warning', 'Need your Kind Attention!', 'Shipment already added.');
            return false;
        }

        if (!cehckULD) {
            ShowMessage('warning', 'Need your Kind Attention!', 'ULD already exist.');
            return false;
        }

        if (data[i].ULDType != "BULK") {
            if ((data[i].SerialNo == "") || (data[i].OwnerCode == "")) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Enter serial no or owner code');
                return false;
            }
        }
    }

    if (!validateTableData('tblAddShipment', res)) {
        return false;
    }

    if (data != false) {
        $("#btnSaveAddShipment").attr('disabled', true);
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT' && IsBookedNoShow == 1) {
            FlightDetail = [];
            $(data).each(function (row, i) {
                var rowData = JSON.parse(i.HdnFlightDetail.replace(/'/g, '"'));
                $(rowData).each(function (row, j) {
                    FlightDetail.push({ "DailyFlightSNo": j.HdnFlightNo, "AWBSNo": j.AWBSNo, "AirlineName": j.AirlineName, "FlightNo": j.HdnFlightNo });
                });
            });
        }

        $.ajax({
            url: "Services/Import/InboundFlightService.svc/createUpdateAddShipment", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ data: data }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split(',')[0] == "2000") {
                    currentFFMFlightMasterSNo = result.split(',')[1];
                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT' && IsBookedNoShow == 1) {
                        $.ajax({
                            url: "Services/Import/InboundFlightService.svc/createUpdateShipmentFlightDetail", async: false, type: "POST", dataType: "json", cache: false,
                            data: JSON.stringify({ FlightDetail: FlightDetail }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                var ss = result;
                            }
                        });
                    }

                    if (userContext.SysSetting.IsMultipleSelectionOnArrival.toUpperCase() == 'TRUE') {
                        $("#chkAll").show();
                        $("#btnArrive").show();
                        IsAllShipmentArrived();
                    }
                    else {
                        $("#chkAll").hide();
                        $("#btnArrive").hide();
                    }

                    $("#CloseFlight").prop('disabled', false);
                    $("#tblAddShipment").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    ShowMessage("success", "Success - Add Shipment", "Shipment Added Successfully.");
                    $('#Chkamended').each(function (row, tr) {
                    });
                }
                if (result.split(',')[0] == "5000") {

                    ShowMessage("warning", "Success - Add Shipment", "Shipment can not void Added .");
                    $('#Chkamended').each(function (row, tr) {
                    });
                }

                if (result.split(',')[0] == "3000") {
                    currentFFMFlightMasterSNo = result.split(',')[1];
                    GetFlightArrivalGrid();
                    ShowMessage('warning', 'Information!', "UNK Shipment already added", "bottom-right");
                }
                //$("#btnSaveAddShipment").attr('disabled', false)
            }, error: function (ex) {
                $("#btnSaveAddShipment").attr('disabled', false)
            }
        });
    }
}

// Save FA ULD Location
function SaveFAULDLocation() {
    var res = $("#tblFAULDLocation tr[id^='tblFAULDLocation']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblFAULDLocation');
    var data = JSON.parse(($('#tblFAULDLocation').appendGrid('getStringJson')));

    for (var i = 0; i < data.length; i++) {
        if (data[i].Location == "" && data[i].MovableLocation == "") {
            $("#tblFAULDLocation_Row_1").closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").attr("required", "required").css("cursor", "auto");
            $("#tblFAULDLocation_Row_1").closest("tr").find("input[id^='tblFAULDLocation_Location']").attr("required", "required").css("cursor", "auto");
            $("#tblFAULDLocation_Row_1").closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();
            return false;
        }

        if (data[i].Location != "" && data[i].MovableLocation == "") {
            data[i].HdnMovableLocation = 0;
        }

        if (data[i].Location == "" && data[i].MovableLocation != "") {
            data[i].HdnLocation = 0;
        }
    }

    if (!validateTableData('tblFAULDLocation', res)) {
        return false;
    }

    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateFAULDLocation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "<value>ULD Location Added Successfully.</value>") {
                    $("#tblFAULDLocation").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    ShowMessage('success', 'Success', "ULD Location Added Successfully.");
                }
                else {
                    return;
                }
            }
        });
    }
}

// Save FA ULD Damage
function SaveFAULDDamage() {
    var res = $("#tblFAULDDamage tr[id^='tblFAULDDamage']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblFAULDDamage');
    var data = JSON.parse(($('#tblFAULDDamage').appendGrid('getStringJson')));

    if (!validateTableData('tblFAULDDamage', res)) {
        return false;
    }

    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateFAULDDamage", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "<value>ULD Damage Added Successfully.</value>") {
                    //ShowProcessDetails("FC", "AddShipment");
                    $("#tblFAULDDamage").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    ShowMessage('success', 'Success', "ULD Damage Added Successfully.");
                }
                else {
                    return;
                }
            }
        });
    }
}

// Save FA Consumable
function SaveFAConsumable() {
    var res = $("#tblFAConsumable tr[id^='tblFAConsumable']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblFAConsumable');
    var data = JSON.parse(($('#tblFAConsumable').appendGrid('getStringJson')));

    if (!validateTableData('tblFAConsumable', res)) {
        return false;
    }

    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateFAConsumable", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "<value>Consumables Added Successfully.</value>") {
                    //ShowProcessDetails("FC", "AddShipment");
                    $("#tblFAConsumable").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    ShowMessage('success', 'Success', "Consumables Added Successfully.");
                }
                else {
                    return;
                }
            }
        });
    }
}

function SaveAWBULDLocation_pomail() {

    var res = $("#tblAwbULDLocation tr[id^='tblAwbULDLocation']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAwbULDLocation');
    var data = JSON.parse(($('#tblAwbULDLocation').appendGrid('getStringJson')));
    var AssignLocationBool = true;
    var totalpices = parseInt(data[0].HdnRcvdPieces)

    $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() == "") {
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
            AssignLocationBool = false;
        }

        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() != "") {
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required").css("cursor", "auto");
        }
        return AssignLocationBool;
    });

    if (AssignLocationBool == false)
        return;

    for (var i = 0; i < data.length; i++) {
        if (data[i].AssignLocation != "" && data[i].MovableLocation == "") {
            data[i].HdnMovableLocation = 0;
        }
        if (data[i].AssignLocation == "" && data[i].MovableLocation != "") {
            data[i].HdnAssignLocation = 0;
        }

        if (data[i].HdnLocSNo == "") {
            data[i].HdnLocSNo = 0;
        }

        if (data[i].HdnEndPieces == "") {
            data[i].HdnEndPieces = 0;
        }
    }

    // required field validation by rahul on 07/11/2017
    if ($("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").val() != "")
        $("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").attr('required', 'required');
    else
        $("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").removeAttr('required');
    //------------------end here----------------------------------------------------

    if (!validateTableData('tblAwbULDLocation', res)) {
        return false;
    }

    var awbsno = data[0].AWBSNo;
    var hawbcounter = 0;
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/CheckHAwb", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: parseInt(awbsno) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var totalassignpieces = 0;
            if (resData && resData.length > 0) {
                if (resData[0].ErrorNumber == "9000") {
                    for (var j = 0; j < data.length; j++) {
                        totalassignpieces = parseInt(totalassignpieces) + parseInt(data[j].EndPieces);
                        if (data[j].HdnHAWB == "" || data[j].HdnHAWB == "0") {
                            ShowMessage('warning', 'Location ', "HAWB is mandatory.", "bottom-right");
                            hawbcounter = 1;
                        }
                    }

                    if (parseInt(totalassignpieces) > parseInt(totalpices)) {
                        ShowMessage('warning', 'Location ', "Location Pieces can't be more than Receive Pieces.", "bottom-right");
                        hawbcounter = 1;
                    }
                }
            }
        }
    });

    if (hawbcounter == 1) {
        return;
    }

    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateAwbULDLocation_pomail", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $("input[id^='btnsaveLocation']").attr('disabled', true)
            },
            success: function (result) {
                if (result == "<value>AWB Location Added Successfully.</value>") {
                    $("#tblAwbULDLocation").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    DTRIndex = "";
                    DTRIndex = $(DTR).parent().parent().parent().parent().parent().parent().closest('tr').prev().index();
                    ShowMessage('success', 'Success', "Location assigned successfully.");
                }
                else {
                    return;
                }
            },
            complete: function () {
                $("input[id^='btnsaveLocation']").attr('disabled', true)
            }
        });
    }

}

// Save AWB ULD Location
function SaveAWBULDLocation() {
    var res = $("#tblAwbULDLocation tr[id^='tblAwbULDLocation']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAwbULDLocation');
    var data = JSON.parse(($('#tblAwbULDLocation').appendGrid('getStringJson')));
    var AssignLocationBool = true;
    var totalpices = parseInt(data[0].HdnRcvdPieces)

    $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() == "") {
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
            AssignLocationBool = false;
        }

        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() != "") {
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required").css("cursor", "auto");
        }
        return AssignLocationBool;
    });

    if (AssignLocationBool == false)
        return;

    for (var i = 0; i < data.length; i++) {
        if (data[i].AssignLocation != "" && data[i].MovableLocation == "") {
            data[i].HdnMovableLocation = 0;
        }
        if (data[i].AssignLocation == "" && data[i].MovableLocation != "") {
            data[i].HdnAssignLocation = 0;
        }

        if (data[i].HdnLocSNo == "") {
            data[i].HdnLocSNo = 0;
        }

        if (data[i].HdnEndPieces == "") {
            data[i].HdnEndPieces = 0;
        }
    }

    // required field validation by rahul on 07/11/2017
    if ($("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").val() != "")
        $("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").attr('required', 'required');
    else
        $("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").removeAttr('required');
    //------------------end here----------------------------------------------------

    if (!validateTableData('tblAwbULDLocation', res)) {
        return false;
    }

    var awbsno = data[0].AWBSNo;
    var hawbcounter = 0;
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/CheckHAwb", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: parseInt(awbsno) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var totalassignpieces = 0;
            if (resData && resData.length > 0) {
                if (resData[0].ErrorNumber == "9000") {
                    for (var j = 0; j < data.length; j++) {
                        totalassignpieces = parseInt(totalassignpieces) + parseInt(data[j].EndPieces);
                        if (data[j].HdnHAWB == "" || data[j].HdnHAWB == "0") {
                            ShowMessage('warning', 'Location ', "HAWB is mandatory.", "bottom-right");
                            hawbcounter = 1;
                        }
                    }

                    if (parseInt(totalassignpieces) > parseInt(totalpices)) {
                        ShowMessage('warning', 'Location ', "Location Pieces can't be more than Receive Pieces.", "bottom-right");
                        hawbcounter = 1;
                    }
                }
            }
        }
    });

    if (hawbcounter == 1) {
        return;
    }

    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateAwbULDLocation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $("input[id^='btnsaveLocation']").attr('disabled', true)
            },
            success: function (result) {
                if (result == "<value>AWB Location Added Successfully.</value>") {
                    $("#tblAwbULDLocation").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    DTRIndex = "";
                    DTRIndex = $(DTR).parent().parent().parent().parent().parent().parent().closest('tr').prev().index();
                    ShowMessage('success', 'Success', "Location assigned successfully.");
                }
                else {
                    return;
                }
            },
            complete: function () {
                $("input[id^='btnsaveLocation']").attr('disabled', true)
            }
        });
    }
}

// Save AWB Damage
function SaveAwbULDDamage() {
    var res = $("#tblAwbULDDamage tr[id^='tblAwbULDDamage']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAwbULDDamage');
    var data = JSON.parse(($('#tblAwbULDDamage').appendGrid('getStringJson')));

    if (!validateTableData('tblAwbULDDamage', res)) {
        return false;
    }
    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateAwbULDDamage", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "<value>AWB Discrepancy Added Successfully.</value>") {
                    $("#tblAwbULDDamage").data("kendoWindow").close();
                    GetFlightArrivalGrid();

                    DTRIndex = $(DTR).parent().parent().parent().parent().parent().parent().closest('tr').prev().index();

                    ShowMessage('success', 'Success', "AWB Discrepancy Added Successfully.");
                }
                else {
                    return;
                }
            }
        });
    }
}

function fn_SuccessShipmentGrid() {
    $('.k-detail-cell tbody tr').each(function (row, tr) {
        if ($(tr).find("td[data-column='IsManual']").html() == 1)
            $(tr).css('background-color', 'rgba(204, 39, 39, 0.22)');
    });
}

function fn_SuccessArrivalGrid() {
    if (DTRIndex != undefined) {
        $("#divFlightArrivalDetails  table > tbody > tr:eq(" + DTRIndex + ").k-master-row").find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
        DTRIndex = "";
    }
    setTimeout(function () {
        UserSubProcessRights("divFlightArrivalDetails", 2110);
    }, 1000)
}

function ViewOSIRemarks(obj) {
    if ($("#divRemarks").length === 0) {
        $("#divAfterContent").html('<div style="float:left; width:200px; max-width:200px; word-wrap:break-word;" id="divRemarks"></div>');
    }
    $("div#divRemarks").text("").text($(obj).closest("tr").find("span#spnOSIRemarks").text());
    cfi.PopUp("divRemarks", "OSI Remarks", 400, null, null, 10);
}

function ViewRemarks(obj) {
    if ($("#divRemarks").length === 0) {
        $("#divAfterContent").html('<div style="float:left; width:200px; max-width:200px; word-wrap:break-word;" id="divRemarks"></div>');
    }

    var remarksmsg = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    var popremarksmsg = "";
    $('#divRemarks').html('');

    if (remarksmsg == "BULK") {
        popremarksmsg = "BULK";
    }
    else {
        popremarksmsg = "ULD";
    }

    $("div#divRemarks").text("").text($(obj).closest("tr").find("span#spnULDRemarks").text());
    cfi.PopUp("divRemarks", popremarksmsg + " Remarks", 400, null, null, 10);
}

//--------------- Print FFM Details -----------------------------------------//
function PrintFFMDetails(obj) {
    //---Chandra Shekhar Tripathi-----------------------------------------------//
    isFFMOrNot('FFM')
    //showffm();
    //if ($("#divDescription").length === 0) {
    //    $("#divAfterContent").html('<div id=divDescription1><div><span style="float:right; padding:5px;"><input type="button" name="name" id="ffmprint" value="Print" onclick="Fun_printFFmDetails();" /></span><div class="k-content" id="divDescription"><b>' + $("#hdnFFMDetais").val().replace(/\n/g, '<br />\n') + '</b></div></div>');
    //}

    //if ($("#hdnFFMDetais").val() != "" && $("#divDescription").length === 0) {
    //    cfi.PopUp("divDescription1", "Print FFM", 400, null, null, 10);
    //}
    //else {
    //    $.ajax({
    //        url: "Services/Import/InboundFlightService.svc/GetPrintFFMDetails", async: false, type: "POST", dataType: "json", cache: false,
    //        data: JSON.stringify({
    //            DailyFlightSNo: currentDailyFlightSno
    //        }),
    //        contentType: "application/json; charset=utf-8",
    //        success: function (result) {
    //            debugger
    //            var parsedResult = JSON.parse(result).Table0;
    //           // $('#hdnFFMDetais').val(parsedResult == "" ? "" : parsedResult);
    //            $("#divAfterContent").html('');

    //            var html = '';
    //            for (var i = 0; i < parsedResult.length; i++) {
    //                html = html + parsedResult[i].ActualMessage.replace(/\n/g, '<br />\n')
    //            }

    //            $("#divAfterContent").html('<span id=divDescription1><div><span style="float:right; padding:5px; height:150px"><input type="button" name="name" id="ffmprint" value="Print" onclick="Fun_printFFmDetails();" /></span><div style="color: red;"><blink ><b>Note* FFM details are being displayed as per the Manifest</b></blink></div><div id="divDescription"><b>' + html + '</b></div></span>');

    //            if (html != "") {
    //                cfi.PopUp("divAfterContent", "Print FFM", 400, null, null, 10);
    //            }

    //            $('#divAfterContent').bind('cut copy paste', function (e) { e.preventDefault(); });
    //        }
    //    });
    //    //$.ajax({
    //    //    url: "../Services/Common/CommonService.svc/GenerateCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
    //    //    data: JSON.stringify({
    //    //        MessageType: 'FFM', SerialNo: "", SubType: "", flightNumber: $("#__tblflightarrivalflightinformation__").find("#FlightNo").text(),
    //    //        flightDate: $("#__tblflightarrivalflightinformation__").find("#FLIGHTDATE").text(),
    //    //        OriginAirport: $("#__tblflightarrivalflightinformation__").find("#Origin").text(),
    //    //        isDoubleSignature: false, version: '7', nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: ""
    //    //    }),
    //    //    contentType: "application/json; charset=utf-8",
    //    //    success: function (result) {
    //    //        $('#hdnFFMDetais').val(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);
    //    //        $("#divAfterContent").html('');
    //    //        $("#divAfterContent").html('<span id=divDescription1><div><span style="float:right; padding:5px; height:150px"><input type="button" name="name" id="ffmprint" value="Print" onclick="Fun_printFFmDetails();" /></span><div style="color: red;"><blink ><b>Note* FFM details are being displayed as per the Manifest</b></blink></div><div id="divDescription"><b>' + $("#hdnFFMDetais").val().replace(/\n/g, '<br />\n') + '</b></div></span>');

    //    //        if ($("#hdnFFMDetais").val() != "") {
    //    //            cfi.PopUp("divAfterContent", "Print FFM", 400, null, null, 10);
    //    //        }

    //    //        $('#divAfterContent').bind('cut copy paste', function (e) { e.preventDefault(); });
    //    //    }
    //    //});
    //}
}

function Fun_printFFmDetails() {
    $("#divDescription").printArea();
}

function PrintMANDetails(obj) {
    if ($("#divDescriptionman").length === 0) {
        $("#divAfterContent").html('<div id=divDescriptionprint style="height:auto; overflow:none ! important"><div style="overflow:none ! important"><span style="float:right; padding:5px;"><input type="button" name="name" value="Print"  id="manprint" onclick="Fun_printMANDetails();" /></span><div class="k-content" id="divDescriptionman"></div></div>');
        $('#divDescriptionprint').removeAttr('class');
    }
    isFFMOrNot('MAN');
    //GetManifestReportData(currentDailyFlightSno, 'N')

    if (!checkmani) {
        ShowMessage('warning', 'Warning -Manifest ', "Flight not manifested.", "bottom-right");
        $('#manprint').hide();
    }
}

/** Airmail Print Start **/
function PrintAIRMAILDetails(obj) {
    $("#divAfterContent").html('<div id=divDescriptionprint style="height:auto; overflow:none ! important"><div style="overflow:none ! important"><span style="float:right; padding:5px;"><input type="button" name="name" value="Print"  id="airmailprint" onclick="Fun_printAirmailDetails();" /></span><div class="k-content" id="divDescriptionairmail"></div></div>');

    $.ajax({
        url: "HtmlFiles/Export/AirMailPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDescriptionairmail").html(result);
            fn_AirmailDetails();
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
        }
    });
    $('#divDescriptionairmail').bind('cut copy paste', function (e) { e.preventDefault(); });
    cfi.PopUp("divDescriptionprint", "Print Airmail", 900, null, null, 50);
}

function Fun_printAirmailDetails() {
    var contents = document.getElementById("divDescriptionairmail").innerHTML;
    var frame2 = document.createElement('iframe');
    frame2.name = "frame2";
    frame2.id = "frame2";

    window.parent.$("#iMasterFrame").after(frame2);
    var frameDoc = (frame2.contentWindow) ? frame2.contentWindow : (frame2.contentDocument.document) ? frame2.contentDocument.document : frame2.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write('<html><head><title>DIV Contents</title>');
    frameDoc.document.write('</head><body>');
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.parent.frame2.print()
        window.parent.top.$("#frame2").remove()
    }, 500);
}

function fn_AirmailDetails() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetAirMailPrintData",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ DailyFlightSNo: currentGroupFlightSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var Data = jQuery.parseJSON(result)
            var FinalData = Data.Table0

            if (FinalData.length > 0) {
                $('#spnflightno').text(FinalData[0].FlightNo)
                $('#spnflightdate').html(FinalData[0].FlightDate)
                $('#spnupliftstation').html(FinalData[0].ShipmentOrigin)
                $('#spnTotalPices').text(FinalData[0].TotalPieces)
                $('#spnTotalWeight').text(FinalData[0].TotalWeight)
                $('#spnTotalBegs').text(FinalData.length)
                $('#spnCompletedBy').text(FinalData[0].UserName)
                var i = 0
                $(FinalData).each(function (row, tr) {
                    i = parseInt(i) + 1;
                    $('#tr1').after('<tr>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.MailBegSrNo + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.CNNo + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.NoOfBages + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.ShipmentOrigin + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.ShipmentDest + '</td>' +

                        '<td style="border:1px solid black;text-align:center">' + tr.AO + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.CP + '</td>' +
                        '<td style="border:1px solid black;text-align:center">' + tr.SC + '</td>' +
                        '</tr>')
                    if (i < 20) {
                        $('#trlast').prev('tr').remove();
                    }
                })
            }
        }
    })
}

/** Airmail Print End **/
function Fun_printMANDetails() {
    var contents = document.getElementById("divDescriptionman").innerHTML;
    var frame1 = document.createElement('iframe');
    frame1.name = "frame1";
    frame1.id = "frame1";
    window.parent.$("#iMasterFrame").after(frame1);
    var frameDoc = (frame1.contentWindow) ? frame1.contentWindow : (frame1.contentDocument.document) ? frame1.contentDocument.document : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write('<html><head><style>.grdTableHeader { background-color: #cccccc;    background-position: center;    background-repeat: repeat-x;    height: 24px;   border: 1px solid black;    padding-left: 5px;    font-family: Verdana;    font-weight: bold;    font-size: 8pt;    text-align: left;}</style><style> .grdTableRow {     background-position: center;    background-repeat: repeat-x;    height: 24px;    border: 1px solid red!important;    padding-left: 5px;    font-family: Verdana;    font- weight: bold;    font-size: 8pt;    text-align: left;}</style><title>Manifest Print</title>');
    frameDoc.document.write('</br><div class="page-break"></div>');
    frameDoc.document.write('</head><body>');
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');

    frameDoc.document.close();
    setTimeout(function () {
        window.parent.frame1.print()
        window.parent.top.$("#frame1").remove()
    }, 500);
}

function GetManifestReportData(FlightSNo, Type, isFor = '') {
    var RouteFlightArray;
    if (isFor == 'FFM') {
        $('#divDescriptionman').html("<b style='color:red'>Manifest details are being displayed as per the FFM.</b>");
    }
    else {
        $('#divDescriptionman').html("");
    }

    $("#divDescriptionman").css('display', 'none');
    $('#manprint').hide();
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetRouteFlight?DailyFlightSNo=" + FlightSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            RouteFlightArray = result.split(',');

        },
        error: {
        }
    });

    $(RouteFlightArray).each(function (index) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetInboundManifestReport?DailyFlightSNo=" + RouteFlightArray[index] + "&Type=" + Type, async: false, type: "get", dataType: "html", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    $('#divDescriptionman').html("");
                    checkmani = false;

                }
                else {
                    $("#divDescriptionman").append(result);

                    tempResult = result;
                    if (index < (RouteFlightArray.length - 1)) {
                        $("#divDescriptionman").append('</br><div class="page-break"></div>');
                    }
                }
            },
            error: {
            }
        });
    });

    printDiv('Manifest');
    //$("#divDescriptionman #btnPrint:last").unbind("click").bind("click", function () {
    //    $("#divDescriptionprint").printArea();
    //});
}

function printDiv(PageTitle) {
    var divToPrint = document.getElementById('divDescriptionman');
    var newWin = window.open('', '_blank');
    newWin.document.open();
    newWin.document.title = PageTitle;
    newWin.document.write('<html><head><link type="text/css" rel="stylesheet" href="Styles/Application.css" /><title>' + PageTitle + '</title></head><body oncopy="return false" oncut="return false" onpaste="return false"><div><input id="btnPrint" type="button" value="Print" class="no-print" onclick="window.print();"/></div><br\>' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    newWin.focus();

}

function CheckFAOriginAndDestination(obj) {
    var awbOriginValue = $(obj).closest("tr").find("input[id^='tblAddShipment_AWBOrigin']").val();
    var awbDestinationValue = $(obj).closest("tr").find("input[id^='tblAddShipment_AWBDestination']").val();
    if (awbOriginValue != "" && awbDestinationValue != "") {
        if (awbOriginValue == awbDestinationValue) {
            $(obj).val('');
            ShowMessage('warning', 'Need your Kind Attention!', 'Origin & Destination can not be same.');
            return;
        }
    }
}

function AWBCheckTotalPcs(obj) {
    var AWbPcs = 0;
    var AWBGrossweight = 0;
    var AWBVolumeWeight = 0;
    var AWBCBM = 0;
    var awbprefix = $(obj).closest("table").find("input[id^='tblAddShipment_AWBPrefix']").val();
    var ishandling = 0;
    var awbNo = $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val();

    $.ajax({
        url: "Services/Import/InboundFlightService.svc/CheckAwbExistinExport", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ CheckCurrentAWBNo: awbprefix + '-' + awbNo, Pieces: 0 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData3 = Data.Table3;
            if (resData.length > 0) {
                AWbPcs = resData[0].AWbPcs
                AWBGrossweight = resData[0].AWBGrossweight
                AWBVolumeWeight = resData[0].AWBVolumeWeight
                AWBCBM = resData[0].AWBCBM
            }
        }
    });

    var TotalPieces = $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val();
    if (TotalPieces == "") {
        ShowMessage("warning", "Need your Kind Attention!", 'Please Enter Total Pieces');
        return;
    }

    var TotalGrossWt = (parseFloat(AWBGrossweight) / parseFloat(AWbPcs)) * parseInt(TotalPieces);
    var TotalVolumeWt = (parseFloat(AWBVolumeWeight) / parseFloat(AWbPcs)) * parseInt(TotalPieces);
    var TotalCBMWt = (parseFloat(AWBCBM) / parseFloat(AWbPcs)) * parseInt(TotalPieces);

    $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val(isNaN(TotalGrossWt) ? 0.00 : parseFloat(TotalGrossWt).toFixed(3));
    $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val(isNaN(TotalGrossWt) ? 0.00 : parseFloat(TotalGrossWt).toFixed(3));
    $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val(isNaN(TotalVolumeWt) ? 0.00 : parseFloat(TotalVolumeWt).toFixed(2));
    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val(isNaN(TotalVolumeWt) ? 0.00 : parseFloat(TotalVolumeWt).toFixed(2));
    $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val(isNaN(TotalCBMWt) ? 0.000 : parseFloat(TotalCBMWt).toFixed(3));
    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val(isNaN(TotalCBMWt) ? 0.000 : parseFloat(TotalCBMWt).toFixed(3));
}

function CheckTotalPcs(obj) {
    var TotalPieces = $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val();
    var Totalwt = $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val();
    var Totalvolume = $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val();
    var TotalCBM = $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val();
    var ArrivedPcs = $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val();
    var ShimentType = $(obj).closest("table").find("input[id^='tblAddShipment_ShimentType']").val();
    var DescriptionType = $(obj).closest('table').find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").text();
    var awbprefix = $(obj).closest("table").find("input[id^='tblAddShipment_AWBPrefix']").val();
    var ishandling = 0;
    var awbNo = $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val();
    if (ArrivedPcs == "") {
        ShowMessage("warning", "Need your Kind Attention!", 'Please Enter Manifested Pieces');
        return;
    }

    var ArrivedGrossWt = (parseFloat(Totalwt) / parseFloat(TotalPieces)) * parseInt(ArrivedPcs);
    var ArrivedVolumeWt = (parseFloat(Totalvolume) / parseFloat(TotalPieces)) * parseInt(ArrivedPcs);
    var ArrivedCBMWt = (parseFloat(TotalCBM) / parseFloat(TotalPieces)) * parseInt(ArrivedPcs);
    if (awbprefix.toUpperCase() == 'UNK') {
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val(isNaN(ArrivedGrossWt) ? 0.00 : parseFloat(ArrivedGrossWt).toFixed(3));
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val(isNaN(ArrivedGrossWt) ? 0.00 : parseFloat(ArrivedGrossWt).toFixed(3));
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val(isNaN(ArrivedVolumeWt) ? 0.00 : parseFloat(ArrivedVolumeWt).toFixed(2));
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val(isNaN(ArrivedVolumeWt) ? 0.00 : parseFloat(ArrivedVolumeWt).toFixed(2));
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val(isNaN(ArrivedCBMWt) ? 0.000 : parseFloat(ArrivedCBMWt).toFixed(3));
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val(isNaN(ArrivedCBMWt) ? 0.000 : parseFloat(ArrivedCBMWt).toFixed(3));
        if (FoundType == "NONE" && DescriptionType == "T") {
            if (parseInt(ArrivedPcs) != parseInt(TotalPieces)) {
                var msgAddShipment = (parseInt(ArrivedPcs) < parseInt(TotalPieces)) ? "less" : "greater";
                ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be ' + msgAddShipment + ' than total pieces: ' + TotalPieces);
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                return;
            }
        }

        if (DescriptionType == "P") {
            if (parseInt(ArrivedPcs) == parseInt(TotalPieces)) {
                ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be equal to total pieces: ' + TotalPieces);
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                return;
            }

            if (parseInt(ArrivedPcs) > parseInt(TotalPieces)) {
                ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be greater than total pieces: ' + TotalPieces);
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                return;
            }
        }
    }
    else {
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/CheckAwbExistinExport", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CheckCurrentAWBNo: awbprefix + '-' + awbNo, Pieces: ArrivedPcs }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData3 = Data.Table3;
                if (resData.length > 0) {
                    if (parseInt(resData[0].Column13) != 0) {
                        ArrivedGrossWt = resData[0].Column13
                    }

                    if (parseInt(resData[0].Column17) != 0) {
                        ArrivedVolumeWt = resData[0].Column17
                    }

                    if (parseInt(resData[0].Column18) != 0) {
                        ArrivedCBMWt = resData[0].Column18
                    }
                    ishandling = resData[0].Column19;
                    ischeckhandling = resData[0].Column19;
                }
            }
        });

        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val(isNaN(ArrivedGrossWt) ? 0.00 : parseFloat(ArrivedGrossWt).toFixed(3));
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val(isNaN(ArrivedGrossWt) ? 0.00 : parseFloat(ArrivedGrossWt).toFixed(3));
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val(isNaN(ArrivedVolumeWt) ? 0.00 : parseFloat(ArrivedVolumeWt).toFixed(2));
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val(isNaN(ArrivedVolumeWt) ? 0.00 : parseFloat(ArrivedVolumeWt).toFixed(2));
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val(isNaN(ArrivedCBMWt) ? 0.000 : parseFloat(ArrivedCBMWt).toFixed(3));
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val(isNaN(ArrivedCBMWt) ? 0.000 : parseFloat(ArrivedCBMWt).toFixed(3));

        if (parseInt(ArrivedPcs) > parseInt(TotalPieces) && parseInt(ishandling) == 0) {
            ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be greater than total pieces: ' + TotalPieces);
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
            return;
        }
    }
}

function CheckVolume(obj) {
    var Volumevalue = $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val();
    var totalcbm = parseFloat(Volumevalue) / 166.67
    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val(isNaN(totalcbm) ? 0 : totalcbm.toFixed(3));
    $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val(isNaN(totalcbm) ? 0 : totalcbm.toFixed(3));
}

function CheckArrivedVolume(obj) {
    var totalvolume = $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val();
    if (totalvolume == "") {
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
        ShowMessage('warning', 'Need your Kind Attention!', 'Enter Volume.');
        return false;
    }

    var ArrivedVolume = $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val();
    var totalArrivedVolume = parseFloat(ArrivedVolume) / 166.67
    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val(isNaN(totalArrivedVolume) ? 0 : totalArrivedVolume.toFixed(2));
    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val(isNaN(totalArrivedVolume) ? 0 : totalArrivedVolume.toFixed(2));

    if (parseFloat(ArrivedVolume) > parseFloat(totalvolume) && parseInt(ischeckhandling) == 0) {
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
        ShowMessage("warning", "Need your Kind Attention!", 'Arrived Volume can not be more than Volume.');
        return false;
    }
}

function CheckCBM(obj) {
    var CBMvalue = $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val();
    var totalvolumn = parseFloat(CBMvalue) * 166.67
    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val(isNaN(totalvolumn) ? 0 : totalvolumn.toFixed(2));
    $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val(isNaN(totalvolumn) ? 0 : totalvolumn.toFixed(2));
}

function CheckManifestCBM(obj) {
    var totalcbm = $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val();
    if (totalcbm == "") {
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
        ShowMessage('warning', 'Need your Kind Attention!', 'Enter CBM.');
        return false;
    }

    var ArrivedCBM = $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val();
    var totalArrivedCBM = parseFloat(ArrivedCBM) * 166.67
    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val(isNaN(totalArrivedCBM) ? 0 : totalArrivedCBM.toFixed(2));
    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val(isNaN(totalArrivedCBM) ? 0 : totalArrivedCBM.toFixed(2));

    if (parseFloat(ArrivedCBM) > parseFloat(totalcbm) && parseInt(ischeckhandling) == 0) {
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
        ShowMessage("warning", "Need your Kind Attention!", 'Arrived CBM can not be more than CBM.');
        return false;
    }
}

function CheckTotalGrossWt(obj) {
    var prefixtype = $(obj).closest("table").find("input[id^='tblAddShipment_AWBPrefix']").val();
    var TotalGrossWeight = $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val();
    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val($(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val());
    var ArrivedGrossWeight = $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val();
    var DescriptionType = $(obj).closest('table').find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").text();

    var NoShow = 0;
    NoShow = $(obj).closest("table").closest("td").next("td").find("input[id^='tblAddShipment_HdnIsNoShow']").val();
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT' && NoShow == 1) {
        $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val(ArrivedGrossWeight);
        $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val(ArrivedGrossWeight);
    }

    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != 'JT') {
        if ((FoundType == "FDCA" || FoundType == "FDAW") && DescriptionType != "P") {
            if (parseFloat(ArrivedGrossWeight) > parseFloat(TotalGrossWeight)) {
                var msgAddShipment = (parseFloat(ArrivedGrossWeight) > parseFloat(TotalGrossWeight)) ? "greater" : "less";

                ShowMessage("warning", "Need your Kind Attention!", 'Gross Weight: ' + ArrivedGrossWeight + ' can not be ' + msgAddShipment + ' than total Gross Weight: ' + TotalGrossWeight);
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                return;
            }
        }
    }

    if (ArrivedGrossWeight != "" && TotalGrossWeight != "" && DescriptionType == "T") {
        if (parseFloat(ArrivedGrossWeight) < parseFloat(TotalGrossWeight) || parseFloat(ArrivedGrossWeight) > parseFloat(TotalGrossWeight)) {
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val("");
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val("");
            var msgAddShipment = (parseFloat(ArrivedGrossWeight) > parseFloat(TotalGrossWeight)) ? "greater" : "less";
            ShowMessage("warning", "Need your Kind Attention!", 'Manifested gross wt: ' + ArrivedGrossWeight + ' can not be ' + msgAddShipment + ' than Gross wt: ' + TotalGrossWeight);
            return;
        }
    }

    if (FoundType == "NONE" && DescriptionType == "P") {
        if (parseFloat(ArrivedGrossWeight) == parseFloat(TotalGrossWeight)) {
            ShowMessage("warning", "Need your Kind Attention!", 'Manifested gross wt: ' + ArrivedGrossWeight + ' can not be equal to Gross wt: ' + TotalGrossWeight);
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
            return;
        }

        if (parseFloat(ArrivedGrossWeight) > parseFloat(TotalGrossWeight)) {

            ShowMessage("warning", "Need your Kind Attention!", 'Manifested gross wt: ' + ArrivedGrossWeight + ' can not be greater than Gross wt: ' + TotalGrossWeight);
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
            return;
        }
    }

    if (prefixtype == "UNK") {
        var respieces = 0;
        var recwt = 0.000;
        respieces = $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val();
        recwt = $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val();
        $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val(respieces);
        $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").val(respieces);
        $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val(recwt);
        $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val(recwt);
    }
}

function CheckPartSplitTotal(obj) {
    try {
        var awbprefix = $(obj).parents().closest("tr").find("input[id^='tblAddShipment_AWBPrefix']").val();
        if (awbprefix.toUpperCase() == 'UNK') {
            $(obj).parents().closest("tr").find("input[id^='tblAddShipment_AWBPrefix']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(false);
            $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(false);
            $(obj).parents().closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
            $(obj).parents().closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');

            $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val('');
            $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").val('');
            $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val('');

            $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');

            $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
            $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val('');
            $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
            $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
        }
    }
    catch (e) { }
}

function CheckAWBAWBPrefix(obj) {
    var awbPrefix = $(obj).val();
    var awbNo = $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val();
    var awbDescriptionType = $(obj).parents().closest('tr').find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
    try {
        if (awbPrefix.toUpperCase() == 'UNK') {
            if (awbPrefix == "" || awbPrefix == "0") {
                return false;
            }

            if (awbDescriptionType == "-1" && awbPrefix.toUpperCase() == "UNK") {
                ShowMessage('warning', 'Need your Kind Attention!', 'Please Select Type.');
                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBPrefix']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(false);
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(false);

                $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val('');

                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val('');

                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
                return false;
            }

            if (awbDescriptionType != "-1" && awbPrefix.toUpperCase() == "UNK") {
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").removeAttr('required');
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").removeAttr('style');
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").attr('style', 'width: 100%; height: 20px; text-transform: uppercase;');

                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(false);

                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").removeAttr('required');
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").removeAttr('style');
                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").attr('style', 'width: 100%; height: 20px; text-transform: uppercase;');

                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(false);
                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
            }

            if (awbPrefix.length != 3) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
                $(obj).val("");
                return false;
            }
            else {
                $.ajax({
                    url: "Services/Import/InboundFlightService.svc/CheckAirlineExistsByPrefix", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ Prefix: awbPrefix, DailyFlighSNo: currentDailyFlightSno }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;
                        var resData1 = Data.Table1;
                        var resData2 = Data.Table2;
                        if (resData.length > 0) {
                            if (resData[0].Column1 == '0') {
                                ShowMessage('warning', 'Add Shipment', 'Invalid Prefix.');
                                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBPrefix']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(false);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(false);
                                $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                                return false;
                            }
                            else {
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces_']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces_']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('1');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedPcs']").val('1');
                                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").removeAttr("disabled");

                                if (resData2.length > 0) {
                                    var parentAwbUNKNo = $(obj).parents().closest("tr").prev().find("input[id^='tblAddShipment_AWBNumber']").val();
                                    var parentAwbUNKNoType = $(obj).parents().closest("tr").prev().find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(resData2[0].Column1);
                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');

                                    if (parentAwbUNKNo != "" && (parentAwbUNKNoType.toUpperCase() == "T" || parentAwbUNKNoType.toUpperCase() == "P")) {
                                        if (typeof parentAwbUNKNo != 'undefined') {
                                            if (awbDescriptionType == "S" || awbDescriptionType == "D") {
                                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(parseInt(parentAwbUNKNo) + 1);
                                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');
                                            }
                                            else if (awbDescriptionType == "P") {
                                                if (parentAwbUNKNoType.toUpperCase() == "P") {
                                                    ShowMessage('warning', 'Need your Kind Attention!', 'Part already added');
                                                    $(obj).parents().closest('tr').find("select[id^='tblAddShipment_PartSplitTotal']").attr('disabled', 'disabled');
                                                    $(obj).closest("tr").find("input[id^='tblAddShipment_AWBPrefix']").val('');
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                                    $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val('');
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                                    $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                                                }
                                                else {
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(parseInt(parentAwbUNKNo));
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');
                                                }
                                            }
                                            else {
                                                if (awbDescriptionType == "T" || awbDescriptionType == "P") {
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(parseInt(parentAwbUNKNo) + 1);
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');
                                                }
                                                else {
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(parseInt(parentAwbUNKNo));
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        if (parentAwbUNKNo != "" && (parentAwbUNKNoType.toUpperCase() == "S" || parentAwbUNKNoType.toUpperCase() == "D")) {
                                            if (typeof parentAwbUNKNo != 'undefined') {
                                                if (awbDescriptionType == "T" || awbDescriptionType == "P") {
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(parseInt(parentAwbUNKNo) + 1);
                                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');
                                                }
                                                else {
                                                    if (awbDescriptionType == "S" || awbDescriptionType == "D") {
                                                        $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(parseInt(parentAwbUNKNo));
                                                        $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');
                                                    }
                                                    else {
                                                        $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val(parseInt(parentAwbUNKNo) + 1);
                                                        $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").attr('disabled', 'disabled');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        else {
            $.ajax({
                url: "Services/Import/InboundFlightService.svc/CheckAirlineExistsByPrefix", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ Prefix: awbPrefix, DailyFlighSNo: currentDailyFlightSno }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData3 = Data.Table3;
                    if (resData3.length > 0) {
                        if (resData3[0].AirlineCode == awbPrefix) {
                            $(obj).parents().closest('tr').find("select[id^='tblAddShipment_PartSplitTotal']").val('-1');
                            $(obj).parents().closest('tr').find("select[id^='tblAddShipment_PartSplitTotal']").attr('disabled', 'disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(true);
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(true);
                            $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val('');
                            $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val('');

                            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');

                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val('');
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").removeAttr('disabled');
                        }
                        else {
                            $(obj).parents().closest('tr').find("select[id^='tblAddShipment_PartSplitTotal']").val('-1');
                            $(obj).parents().closest('tr').find("select[id^='tblAddShipment_PartSplitTotal']").attr('disabled', 'disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(false);
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(false);

                            $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val('');
                            $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val('');

                            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").removeAttr('disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").removeAttr('disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');

                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").val('');
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBNumber']").removeAttr('disabled');
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                            $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val('');
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                            $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                        }
                    }
                }
            });
        }
    }
    catch (e) { }
}

function CheckBuildLoad(obj) {
    try {
        if ($(obj).val() == "-1") {
            ShowMessage('warning', 'Need your Kind Attention!', 'Select Build/Load');
            return false;
        }
    }
    catch (e) { }
}

function CheckAWBNumber(obj) {
    var awbNo = $(obj).val();
    var HandlingPrefix = "";
    var awbPrefix = $(obj).closest("tr").find("input[id^='tblAddShipment_AWBPrefix']").val();
    var awbDescriptionType = $(obj).closest('tr').next().next().find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
    var CheckCurrentAWBNo = awbPrefix + '-' + awbNo;
    var ULDType = $(obj).closest("table").find("input[id^='tblAddShipment_HdnULDType']").val();

    if (CheckCurrentAWBNo.trim().length == 4) {
        return false;
    }

    var ishandle = 0;
    try {
        if (awbPrefix.toUpperCase() != "UNK") {
            $.ajax({
                url: "Services/Import/InboundFlightService.svc/CheckAirlineExistsByPrefix", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ Prefix: awbPrefix, DailyFlighSNo: currentDailyFlightSno }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData3 = Data.Table3;
                    if (resData3.length > 0) {
                        HandlingPrefix = resData3[0].AirlineCode;
                    }
                }
            });

            if (awbPrefix == HandlingPrefix) {
                $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").removeAttr('disabled');
                $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").removeAttr('disabled');
                $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").removeAttr('disabled');
                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").removeAttr('disabled');
                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").removeAttr('disabled');
                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").removeAttr('disabled');

                if (awbNo.length != 8) {
                    ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
                    $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").prop('selectedIndex', 0);
                    $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").removeAttr('disabled');
                    $(obj).val("");
                    $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                    $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                    $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val('');
                    $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                    return false;
                }
                else {
                    if (awbPrefix.length != 3) {
                        return false;
                    }
                    if (awbPrefix == "" || awbPrefix == "0" || awbNo == "" || awbNo == "0") {
                        ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
                        $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                        $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                        $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val('');
                        $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                        $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                        $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                        $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                        $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                        $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                        $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                        return false;
                    }
                    else {
                        var CurrentAWBNo = awbPrefix + '-' + awbNo;
                        var matchedPosition = awbPrefix.search(/[a-z]/i);
                        if (matchedPosition != -1) {
                        }
                        else {
                            if (awbNo.substring(0, 7) % 7 != awbNo.substring(7, 8)) {
                                ShowMessage('warning', 'Need your Kind Attention!', "Invalid AWB Number");
                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").prop('selectedIndex', 0);
                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                $(obj).val("");
                                return false;
                            }
                        }
                    }
                }
            }
            else {
                $.ajax({
                    url: "Services/Import/InboundFlightService.svc/CheckAwbExistinExport", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ CheckCurrentAWBNo: CheckCurrentAWBNo, DailyFlightSNo: currentDailyFlightSno, ULDType: ULDType }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;
                        var resData3 = Data.Table3;

                        if (resData.length > 0) {
                            ishandle = parseInt(resData[0].Column19);
                            if (resData[0].Column1 == '1' && resData[0].IsAWBStockExistsOrNot == 1) {
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").attr('disabled', 'disabled');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(false);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(false);
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val(resData[0].Column2);
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val(resData[0].Column3);
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val(resData[0].Column2);
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val(resData[0].Column3);
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val(resData[0].Column16);
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val(resData[0].Column16);
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val(parseFloat(resData[0].Column15).toFixed(2));
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val(parseFloat(resData[0].Column15).toFixed(2));
                                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val(resData[0].Column14);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue(resData[0].Column5, resData[0].Column4);
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue(resData[0].Column7, resData[0].Column6);
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val(resData[0].Column7);
                            }
                            else if (resData[0].Column1 == '0' && resData[0].IsAWBStockExistsOrNot == 1) {
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").removeAttr('disabled');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").removeAttr('disabled');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").removeAttr('disabled');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").removeAttr('disabled');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").removeAttr('disabled');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").removeAttr('disabled');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").removeAttr('disabled');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").removeAttr('disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").enable(true);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").enable(true);
                            }
                            else if (resData[0].Column1 == '0' && resData[0].IsAWBStockExistsOrNot == 0) {
                                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBSNo']").val('');
                                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');

                                ShowMessage('warning', 'Add Shipment', 'Entered AWB Number is not found in System. Please recheck AWB Number and try again.');
                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").prop('selectedIndex', 0);
                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").removeAttr('disabled');
                                return false;
                            }

                            if (userContext.SysSetting.ClientEnvironment == "JT" && $("input[id^='tblAddShipment_AWBNumber']").parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").val() != 1) {
                                if (resData[0].IsCompleteOffload != 1) {
                                    ShowMessage('warning', 'Add Shipment', 'Complete pieces are not reached at previous station/pieces are not offloaded.');
                                    $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val('');
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val('');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                    $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                    $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
                                    return false;
                                }
                            }

                            if (userContext.SysSetting.ClientEnvironment == "JT") {
                                if (resData[0].IsAWBStockExistsOrNot == 1 && resData[0].IsAWBBooked == 0) {
                                    ShowMessage('warning', 'Add Shipment', 'AWB Number is not booked and will be kept on HOLD after saving Relevant details.');
                                }

                                if (resData[0].IsAWBStockExistsOrNot == 1 && resData[0].IsBooked == 1) {
                                    ShowMessage('warning', 'Add Shipment', 'AWB is in Booked state. Cannot be marked as Found Cargo.');
                                    $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val('');
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val('');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                    $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                    $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                    $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                    $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                    $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
                                    return false;
                                }
                            }

                            if (resData[0].IsAWBStockExistsOrNot == 1 && resData[0].IsExistInImport == 1) {
                                ShowMessage('warning', 'Add Shipment', 'AWB already exists in this flight and ULD.');

                                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
                                return false;
                            }

                            if (resData[0].Column5 == userContext.CitySNo && resData[0].IsNoShow == 0) {
                                ShowMessage('warning', 'Add Shipment', 'Flight destination and shipment origin should not be same.');
                                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
                                return false;
                            }

                            if (userContext.SysSetting.ClientEnvironment == "JT") {
                                if (resData[0].OriginAirportCode != $("span[id='Origin']").text() && resData[0].IsNoShow == 1) {
                                    ShowMessage('warning', 'Add Shipment', 'Shipment is marked as No Show Flight origin and shipment origin is different & will be kept on HOLD after saving relevant details. Please update flight detail');
                                }
                                else if (resData[0].OriginAirportCode == $("span[id='Origin']").text() && resData[0].IsNoShow == 1) {
                                    ShowMessage('warning', 'Add Shipment', 'Shipment is marked as No Show will be kept on HOLD after saving relevant details.');
                                }
                            }
                            else if (resData[0].IsNoShow == 1) {
                                ShowMessage('warning', 'Add Shipment', 'Shipment is marked as No Show/Void or Cancel.');
                                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
                                return false;
                            }
                            else if (userContext.SysSetting.ClientEnvironment == "GA" && (resData[0].IsVoid == 1 || resData[0].IsCancel == 1)) {
                                ShowMessage('warning', 'Add Shipment', 'Shipment is marked as No Show/Void or Cancel.');
                                $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val('');
                                $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedPcs']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='tblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("tr").next().next().find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").attr('disabled', 'disabled');
                                $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedCBM']").val('');
                                $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedVolume']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                                $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue('', '');
                                $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val('');
                                $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val('');
                                return false;
                            }

                            if (parseInt(resData[0].IsNoShow) == 1) {
                                $("input[id^='tblAddShipment_HdnAWBSNo_" + obj.id.split('_')[2] + "']").val(resData[0].AWBSNo);
                                $("input[id^='tblAddShipment_HdnIsNoShow_" + obj.id.split('_')[2] + "']").val(resData[0].IsNoShow);

                                if (userContext.SysSetting.ClientEnvironment == "JT") {
                                    if (Number(resData[0].IsNoShow) == 1) {
                                        $(obj).closest("tr").find("input[id^='tblAddShipment_FlightDetail']").css("display", "block");
                                    }
                                    else {
                                        $(obj).closest("tr").find("input[id^='tblAddShipment_FlightDetail']").css("display", "none");
                                    }
                                }

                                if (parseInt(resData[0].IsPanaltyApproved) == 1) {
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").removeAttr('disabled');
                                    //ShowMessage('warning', 'Add Shipment', 'AWB is marked as Approved. So Shipment will not be on Hold for further Approval.');
                                }
                                else {
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").removeAttr('disabled');
                                    //ShowMessage('warning', 'Add Shipment', 'Shipment being marked as NO SHOW at Origin Station and will be kept on HOLD after saving relevant details.');
                                }

                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").prop('selectedIndex', 1);
                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").attr('disabled', 'disabled');

                                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT') {
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").removeAttr('disabled');
                                    $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").removeAttr('disabled');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").removeAttr('disabled');
                                    $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").removeAttr('disabled');
                                }
                            }
                            else {
                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").prop('selectedIndex', 0);
                                $(obj).parents().closest('tr').find("select[id^='tblAddShipment_FoundAWB']").removeAttr('disabled');
                            }

                            $(obj).closest("tr").next().find("input[id^='tblAddShipment_TotalPieces']").val(resData[0].Column2);
                            $(obj).closest("tr").next().find("input[id^='tblAddShipment_GrossWeight']").val(resData[0].Column3);
                            $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_TotalPieces']").val(resData[0].Column2);
                            $(obj).closest("tr").next().find("input[id^='_temptblAddShipment_GrossWeight']").val(resData[0].Column3);
                            $(obj).closest("table").find("input[id^='tblAddShipment_CBM']").val(resData[0].Column16);
                            $(obj).closest("table").find("input[id^='_temptblAddShipment_CBM']").val(resData[0].Column16);
                            $(obj).closest("table").find("input[id^='tblAddShipment_VolumeWeight']").val(parseFloat(resData[0].Column15).toFixed(2));
                            $(obj).closest("table").find("input[id^='_temptblAddShipment_VolumeWeight']").val(parseFloat(resData[0].Column15).toFixed(2));
                            $(obj).closest("table").find("input[id^='tblAddShipment_NatureOfGoods']").val(resData[0].Column14);
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBOrigin']").data("kendoAutoComplete").setDefaultValue(resData[0].Column5, resData[0].Column4);
                            $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBOrigin']").val(resData[0].Column5);
                            $(obj).closest("table").find("input[id^='tblAddShipment_AWBDestination']").data("kendoAutoComplete").setDefaultValue(resData[0].Column7, resData[0].Column6);
                            $(obj).closest("table").find("hidden[id^='tblAddShipment_HdnAWBDestination']").val(resData[0].Column7);
                        }
                    }
                });
            }

            if (awbNo == "" || awbNo == "0") {
                return false;
            }

            if (awbNo.length != 8) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
                $(obj).val("");
                return false;
            }
            else {
                if (awbPrefix.length != 3) {
                    return false;
                }
                if (awbPrefix == "" || awbPrefix == "0" || awbNo == "" || awbNo == "0" || awbDescriptionType == "" || awbDescriptionType == "0") {
                    ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
                    return false;
                }
                else {
                    var CurrentAWBNo = awbPrefix + '-' + awbNo;
                    var matchedPosition = awbPrefix.search(/[a-z]/i);
                    if (matchedPosition != -1) {
                    }
                    else {
                        if (awbNo.substring(0, 7) % 7 != awbNo.substring(7, 8) && ishandle == 0) {
                            ShowMessage('warning', 'Need your Kind Attention!', "Invalid AWB Number");
                            $(obj).val("");
                            return false;
                        }
                    }
                }
            }
        }
    }
    catch (e) { }
}

function CheckAddShipmentAwbNoTotal(FFMFlightMasterSNo, AWBNo, DescriptionType, obj) {
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/AddShipmentCheckAWBNoTotal", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FFMFlightMasterSNo: FFMFlightMasterSNo, AWBNo: AWBNo, DescriptionType: DescriptionType }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData1 = Data.Table1;
            if (resData.length > 0) {
                if (resData[0].Column1 == '0') {
                    if (resData1.length > 0) {
                        $("input[id='tblAddShipment_HdnAWBOrigin_" + obj).val(resData1[0].AirportOriginSNo);
                        $("input[id='tblAddShipment_AWBOrigin_" + obj).val(resData1[0].AirportOrigin);
                        $("input[id='tblAddShipment_HdnAWBDestination_" + obj).val(resData1[0].AirportDestinationSNo);
                        $("input[id='tblAddShipment_AWBDestination_" + obj).val(resData1[0].AirportDestination);
                        $("input[id='_temptblAddShipment_TotalPieces_" + obj).val(resData1[0].Pieces);
                        $("input[id='tblAddShipment_TotalPieces_" + obj).val(resData1[0].Pieces);
                        $("input[id='_temptblAddShipment_GrossWeight_" + obj).val(resData1[0].GrossWT);
                        $("input[id='tblAddShipment_GrossWeight_" + obj).val(resData1[0].GrossWT);
                        $("input[id='_temptblAddShipment_VolumeWeight_" + obj).val(parseFloat(resData1[0].VolumeWT).toFixed(2));
                        $("input[id='tblAddShipment_VolumeWeight_" + obj).val(parseFloat(resData1[0].VolumeWT).toFixed(2));
                        $("input[id='tblAddShipment_NatureOfGoods_" + obj).val(resData1[0].NatureOfGoods);
                    }
                    else {

                    }
                    return true;
                }
                else {
                    var msgErr;
                    if (DescriptionType == 'T')
                        msgErr = 'Total';
                    if (DescriptionType == 'P')
                        msgErr = 'Part';
                    if (DescriptionType == 'S')
                        msgErr = 'Split';
                    if (DescriptionType == 'D')
                        msgErr = 'Divided';

                    ShowMessage('warning', 'Need your Kind Attention!', msgErr + ' pieces already exist for ' + AWBNo);
                    $("input[id='tblAddShipment_AWBPrefix_" + obj + "']").val("");
                    $("input[id='tblAddShipment_AWBNumber_" + obj + "']").val("");
                    $("input[id='tblAddShipment_AWBPrefix_" + obj + "']").focus();
                    return false;
                }
            }
            else {
                ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
                return false;
            }
        }
    });
}

//------------ SaveFlighClosed -----------------------------------------------//
function SaveFlighClosed(obj) {
    var ata = $("#__tblflightarrivalflightinformation__").find("#ATA").val();
    var arrivalDate = $("#ArrivalDate").attr("sqldatevalue");

    var AircraftRegistration = $("#AircraftRegistrationNo").val();

    if (arrivalDate == "" || arrivalDate == undefined) {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }
    if (ata == "" || ata == undefined) {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    if (userContext.SysSetting.ICMSInstance != "Airline") {
        if (AircraftRegistration == "") {
            ShowMessage("warning", "Warning", "Kindly enter Aircraft Registration No.");
            return;
        }
    }

    var ArrivalDateATATime = arrivalDate + ' ' + ata + ':00';
    var CurrentCityDateTime = GetUserLocalTime("L");

    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveFlighClosed", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DailyFlightSNo: currentDailyFlightSno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success', "Flight closed successfully", "bottom-right");
                $("#CloseFlight").prop('disabled', true);
            }
            else if (result.split('?')[0] == "2") {
                ShowMessage('warning', 'Warning', 'Can not proceed with Flight Close due to all shipments have not arrived.', "bottom-right");
                $("#CloseFlight").removeAttr("disabled");
            }
            else if (result.split('?')[0] == "5") {
                if (result.split('?')[1] != "5") {
                    ShowMessage('warning', 'Warning', result.split('?')[1], "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning', 'Flight is not Arrived. ', "bottom-right");
                }
            }
            else {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        },
        error: function () {
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}

//----------------- Save flight checkIn details ------------------------------//
function SaveFlightCheckInDetails(obj) {
    var ata = $("#__tblflightarrivalflightinformation__").find("#ATA").val();
    var arrivalDate = $("#ArrivalDate").attr("sqldatevalue");

    var AircraftRegistration = $("#AircraftRegistrationNo").val();

    if (arrivalDate == "" || arrivalDate == undefined) {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }
    if (ata == "" || ata == undefined) {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    if (userContext.SysSetting.ICMSInstance != "Airline") {
        if (AircraftRegistration == "") {
            ShowMessage("warning", "Warning", "Kindly enter Aircraft Registration No.");
            return;
        }
    }

    var ArrivalDateATATime = arrivalDate + ' ' + ata + ':00';
    var CurrentCityDateTime = GetUserCurrentUTCTime("L");
    if (Date.parse(ArrivalDateATATime) > Date.parse(CurrentCityDateTime.slice(0, -2) + '00')) {
        ShowMessage("warning", "Warning", "ATA can not be greater than current Date & Time at the station.");
        return;
    }

    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
        var PreviousCityTime;
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/GetAirportCurrentUTCTime?Format=L&AirportSNo=" + userContext.AirportSNo,
            async: false,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                PreviousCityTime = result;
            }
        });

        if (Date.parse(PreviousCityTime) > Date.parse(CurrentCityDateTime)) {
            ShowMessage("warning", "Warning", "Flight can not be arrive before ATD.");
            return;
        }
    }

    var aircraftRegistration = $("#__tblflightarrivalflightinformation__").find("#AircraftRegistrationNo").val();
    var vendor = $("#Vendor").val();
    var AgendOrVendorName = $("#Text_Vendor").val();
    var grossWT = $("#__tblflightarrivalflightinformation__").find("#GrossWeight").val();
    var volumeWT = $("#__tblflightarrivalflightinformation__").find("#VolumeWeight").val();
    var aircraftTypeSNo = $("#AircraftType").val();
    var IsNil = ($("#IsNil").is(':checked')) ? "1" : "0";
    var FlightType = $('#FlightType:checked').val();

    var CustomRefNo = $("#CustomRefNo").val() == "" ? "" : $("#CustomRefNo").val();
    var FlightCheckInDetails = [];

    var flightCheckInData = { ATA: ata, ArrivalDate: arrivalDate, AircraftRegistration: aircraftRegistration, GrossWT: (grossWT == "") ? 0 : grossWT, VolumeWT: (volumeWT == "") ? 0 : volumeWT, AircraftTypeSNo: (aircraftTypeSNo == "") ? 0 : aircraftTypeSNo, AccountSNo: (vendor == "") ? 0 : vendor, AgendOrVendorName: AgendOrVendorName == "" ? "" : AgendOrVendorName, IsNil: IsNil, TruckScheduleNo: ($("#TruckScheduleNo").val() == undefined || $("#TruckScheduleNo").val() == '') ? '' : $("#TruckScheduleNo").val(), TruckDate: $("#TruckDate").attr("sqldatevalue"), IsRFSAircraftType: (IsRFSAircraftType == undefined || IsRFSAircraftType == "") ? 0 : IsRFSAircraftType, FlightType: FlightType }

    FlightCheckInDetails.push(flightCheckInData);
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveFlightCheckInDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FlightCheckInDetails: FlightCheckInDetails, DailyFlightSNo: currentDailyFlightSno, CustomRefNo: CustomRefNo, loginAirportSno: userContext.AirportSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                tempATA = ata;
                tempArrivalDate = arrivalDate;
                if (result.split('?')[1] == "4") {
                    $("#Text_AircraftType").data("kendoAutoComplete").enable(false);
                    $("#Text_Vendor").data("kendoAutoComplete").enable(false);
                    $("#AircraftRegistrationNo").prop('disabled', true);
                }
                ShowMessage('success', 'Success', "Details Saved successfully", "bottom-right");
                $("#SaveFlightDetails").prop('disabled', true);
                $('#divFlightArrivalDetails .k-grid').data('kendoGrid').dataSource.read();
            }
            else if (result.split('?')[0] == "2") {
                ShowMessage('warning', 'Warning', 'TimeZone not found for Current City: ' + userContext.CityCode, "bottom-right");

            }

            else if (result.split('?')[0] == "3") {
                ShowMessage('warning', 'Warning', 'ATA Date & Time should not be less than ATD Date & Time. ', "bottom-right");

            }
            else if (result.split('?')[0] == "5") {
                if (result.split('?')[1] != "5") {
                    ShowMessage('warning', 'Warning', result.split('?')[1], "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning', 'Flight is not departed. ', "bottom-right");
                }

            }
            else if (result.split('?')[0] == "6") {
                ShowMessage('warning', 'Warning', result.split('?')[1], "bottom-right");

            }

            else {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        },
        error: function () {
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });

}

function BindTimePicker(obj) {
    $("#divFlightArrivalDetails").find(".datepicker").kendoDatePicker({
        format: "dd-MMM-yyyy",
        value: new Date()
    });
}

//---------------- Instantiate Search Control for inbound flight --------------------------------------//
function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("table[cfi-aria-search='search']").find("span").each(function () {
        var attr = $(this).attr('controltype');
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });

    cfi.AutoCompleteV2("SearchAirlineCarrierCode", "CarrierCode,AirlineName", "ImportInbound_SearchAirlineCRCode", null, "contains");
    cfi.AutoCompleteV2("SearchBoardingPoint", "AirportCode,AirportName", "ImportInbound_SearchBoardPoint", null, "contains");
    $("#Text_SearchAirlineCarrierCode").attr("placeholder", "Airline");
    $("#Text_SearchBoardingPoint").attr("placeholder", "Boarding Point");
    $('#__tblinboundflight__ tr:first td:eq(1) span > span:first ').css('width', '130px');
    $('#__tblinboundflight__ tr:first td:eq(3) span > span:first ').css('width', '130px');

    $('#__tblinboundflight__ tr:first td:eq(0)').remove();
    $('#__tblinboundflight__ tr:first td:eq(1)').remove();
    $('#__tblinboundflight__ tr:first td:eq(2)').remove();
    $('#__tblinboundflight__ tr:first td:eq(3)').remove();
    $('#__tblinboundflight__ tr:first td:eq(4)').remove();
    $('#__tblinboundflight__ tr:first td:eq(5)').remove();
    $('#__tblinboundflight__ tr:first td:eq(6)').remove();
    $('#__tblinboundflight__ tr:first td:eq(7)').remove();

    $('<td style="display:none;"><input type="checkbox" class="formSearchInputcolumn" name="ConnectingFlights" id="ConnectingFlights">Connecting Flights</td><td ><input type="hidden" name="searchFilterConnFlights" id="searchFilterConnFlights" value=""><input id="Text_searchFilterConnFlights" name="Text_searchFilterConnFlights" controltype="autocomplete" placeholder="Connecting Flight" type="text" class="k-input" style="width: 130px; text-transform: uppercase;display:none;" data-role="autocomplete" autocomplete="off"></td><td  style="display:none;"><input type="checkbox" class="formSearchInputcolumn" name="ULDCounts" id="ULDCounts">ULD Count</td><td><input type="hidden" name="searchFilterULDCounts" id="searchFilterULDCounts" value=""><input id="Text_searchFilterULDCounts" name="Text_searchFilterULDCounts" placeholder="ULD Count" controltype="autocomplete" type="text" class="k-input" style="width: 110px; text-transform: uppercase;display:none;" data-role="autocomplete" autocomplete="off"></td><td style="display:none;"><input type="checkbox" name="MCT" id="MCT">MCT</td><td><input type="hidden" name="searchFilterMCT" id="searchFilterMCT" value=""><input id="Text_searchFilterMCT" name="Text_searchFilterMCT" controltype="autocomplete" placeholder="MCT" type="text" class="k-input" style="width: 110px; text-transform: uppercase;display:none;" data-role="autocomplete" autocomplete="off"></td><td>&nbsp;</td><td><input type="hidden" name="searchFStatus" id="searchFStatus" value=""><input id="Text_searchFStatus" name="Text_searchFStatus" controltype="autocomplete" placeholder="Flight Status" type="text" class="k-input" style="width: 100px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"><td>').insertAfter($('#__tblinboundflight__').find('tbody  tr').closest('tr'));

    var ConnectingFlightsAndULd = [{ Key: "1", Text: "LESS THAN 10" }, { Key: "2", Text: "MORE THAN 10" }, { Key: "3", Text: "MORE THAN 20" }, { Key: "4", Text: "MORE THAN 30" }];
    var searchMCT = [{ Key: "1", Text: "LESS THAN 1 HOUR" }, { Key: "2", Text: "LESS THAN 2 HOUR" }, { Key: "3", Text: "LESS THAN 3 HOUR" }];
    cfi.AutoCompleteByDataSource("searchFilterULDCounts", ConnectingFlightsAndULd);
    cfi.AutoCompleteByDataSource("searchFilterConnFlights", ConnectingFlightsAndULd);
    cfi.AutoCompleteByDataSource("searchFilterMCT", searchMCT);

    $("#ConnectingFlights").parent("td").before('<td><input type="hidden" name="searchFlightNo" id="searchFlightNo" value=""><input id="Text_searchFlightNo" name="Text_searchFlightNo" placeholder="Flight No" controltype="autocomplete" type="text" style="width: 130px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"></td>');
    cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "ImportInbound_searchFlightNo", null, "contains");

    $("#Text_searchFStatus").after('<td>&nbsp;</td><td colspan="2"><span class="ActionView" style="cursor:pointer;color:Blue;text-decoration:underline;font-size:13px;margin-left:4px;" id="idAddFlight" onclick="AddFlight();">Add Flight</span></td>');
    var searchFStatus = [{ Key: "0", Text: "NOT ARRIVED" }, { Key: "1", Text: "ARRIVED" }, { Key: "2", Text: "FC PENDING" }, { Key: "3", Text: "FC COMPLETE" }, { Key: "4", Text: "NIL ARRIVED" }];
    cfi.AutoCompleteByDataSource("searchFStatus", searchFStatus);

    $("#SearchSHCDGR").parent().next().remove();
    $("#SearchQRT").parent().next().remove();
    $("#SearchFFMRcvd").parent().next().remove();

    $("#SearchTransitFlight").after("Trans. Flight");
    $("#SearchSHCDGR").after("SHC/DGR");
    $("#SearchQRT").after("QRT");
    $("#SearchFFMRcvd").after("FFM Rcvd");
    $("#Text_searchFilterConnFlights").data("kendoAutoComplete").enable(false);
    $("#Text_searchFilterULDCounts").data("kendoAutoComplete").enable(false);
    $("#Text_searchFilterMCT").data("kendoAutoComplete").enable(false);

    /*Start Time Control***************************/
    $("#ValidFrom").change(function () {
        if ((dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate()) + "-" + mnth[dt.getMonth()] + "-" + dt.getFullYear() != $("#ValidFrom").val()) {
            start.min("00:00");
            $("#StartTime").val('');
            $("#EndTime").val('');
        }
        else {
            setTime(dt, start);
            $("#StartTime").val('');
            $("#EndTime").val('');
        }
    });

    $("#StartTime").css('width', '100px').attr("placeholder", "Start Time");
    $("#EndTime").css('width', '100px').attr("placeholder", "End Time");

    var start = $("#StartTime").kendoTimePicker({
        format: "HH:mm",
        change: function () {
            var startTime = start.value();

            if (startTime) {
                startTime = new Date(startTime);
                end.max(startTime);
                startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                end.min(startTime);
                end.value(startTime);
            } else {
                $('#StartTime').val('');
            }
        }
    }).data("kendoTimePicker");

    //init end timepicker
    var end = $("#EndTime").kendoTimePicker({
        format: "HH:mm"
    }).data("kendoTimePicker");

    /*End Time Control***************************/
    if (getQueryStringValue("IsBack").toUpperCase() == "TRUE") {
        var obj = JSON.parse(sessionStorage.getItem("SessionInboundFlight"))
        if (obj) {
            setTimeout(function () {
                $("#Text_SearchAirlineCarrierCode").val(obj.Text_SearchAirlineCarrierCode);
                $("#SearchAirlineCarrierCode").val(obj.SearchAirlineCarrierCode);
                $("#Text_SearchBoardingPoint").val(obj.Text_SearchBoardingPoint);
                $("#SearchBoardingPoint").val(obj.SearchBoardingPoint);
                $("#searchFromDate").data("kendoDatePicker").value(obj.searchFromDate);
                $("#searchToDate").data("kendoDatePicker").value(obj.searchToDate);
                $("#StartTime").val(obj.StartTime);
                $("#EndTime").val(obj.EndTime);

                $("#Text_searchFlightNo").val(obj.Text_searchFlightNo);
                $("#searchFlightNo").val(obj.searchFlightNo);

                $("#Text_searchFilterConnFlights").val(obj.Text_searchFilterConnFlights);
                $("#searchFilterConnFlights").val(obj.searchFilterConnFlights);
                $("#Text_searchFilterULDCounts").val(obj.Text_searchFilterULDCounts);
                $("#searchFilterULDCounts").val(obj.searchFilterULDCounts);
                $("#Text_searchFilterMCT").val(obj.Text_searchFilterMCT);
                $("#searchFilterMCT").val(obj.searchFilterMCT);
                $("#Text_searchFStatus").val(obj.Text_searchFStatus);
                $("#searchFStatus").val(obj.searchFStatus);

                if (obj.SearchTransitFlight) $("#SearchTransitFlight").click();
                if (obj.SearchQRT) $("#SearchQRT").click();
                if (obj.SearchSHCDGR) $("#SearchSHCDGR").click();
                if (obj.SearchFFMRcvd) $("#SearchFFMRcvd").click();
                if (obj.ConnectingFlights) $("#ConnectingFlights").click();
                if (obj.ULDCounts) $("#ULDCounts").click();
                if (obj.MCT) $("#MCT").click();

                setTimeout(function () { $("#btnSearch").click(); }, 100);
            }, 200);
        }
    }
    else {
        sessionStorage.removeItem("SessionInboundFlight");
    }
    // setTimeout(function () { PageRightsCheckInboundFlight() }, 500)
}

//----------------- Bind Events for subprocess -----------------------------//
function BindEvents(obj, e, isdblclick) {
    var subprocess = $(obj).attr("process").toUpperCase();

    currentprocess = subprocess;
    _CURR_PRO_ = $(obj).attr("currentprocess");

    if (currentprocess == "FC" && _CURR_PRO_ == "InboundFlight") {
        currentDailyFlightSno = $(obj).closest("tr").find("td:eq(1)").text();
        currentGroupFlightSNo = $(obj).closest("tr").find("td:eq(2)").text();
        currentFFMFlightMasterSNo = $(obj).closest("tr").find("td:eq(4)").text();

    }

    if (currentprocess == "FLIGHTASSIGNTEAM" && _CURR_PRO_ == "InboundFlight") {
        location.href = "Default.cshtml?Module=Shipment&Apps=AssignTeam&FormAction=INDEXVIEW&DailyFlightSNo=" + $(obj).closest("tr").find("td:eq(1)").text() + "&Page=0&MovementTypeSNo=1";
        getCustomButton();
    }


    if (currentprocess == "INBOUNDEPOUCH" && _CURR_PRO_ == "InboundFlight") {
        //$('#FirstTab').text('Flight Pouch Details');
        //$('#divAction').hide();
        currentDailyFlightSno = $(obj).closest("tr").find("td:eq(1)").text();
        currentGroupFlightSNo = $(obj).closest("tr").find("td:eq(2)").text();
        currentFFMFlightMasterSNo = $(obj).closest("tr").find("td:eq(4)").text();
        // BindEPouchData();
        //BindEPouch();
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/GetWebForm",
            async: false,
            data: JSON.stringify({ model: { processName: "InboundFlight", moduleName: "Import", appName: "INBOUNDEPOUCH", Action: "New", IsSubModule: 1 } }),
            type: "POST",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //var divv = $(result).find('#divareaTrans_import_inboundepouch').html();

                //$('#divareaTrans_import_inboundepouch').remove();
                //$('#divbody').append("<div id='divareaTrans_import_inboundepouch'>" + divv + "</div>").html();

                // $("#divDetail").html(result);

                //cfi.makeTrans("import_inboundepouch", null, null, null, null, null, null, null, true);
                //setTimeout(function () {
                BindEPouch();
                //}, 2000);

                // cfi.makeTrans("import_inboundepouch", null, null, BindE_Pouch, ReBindE_Pouch, null, null, null, true);
                ///// cfi.makeTrans("shipment_shipmentsphcedoxinfo", null, null, BindE_Pouch, ReBindE_Pouch, null, null);
                // $("#divareaTrans_import_inboundepouchtr:first").find("font").remove();

                // $("div[id$='areaTrans_import_inboundepouch']").find("[id='areaTrans_import_inboundepouch']").each(function () {



                //     $(this).find("a[id^='ahref_DocName']").each(function () {
                //         $(this).unbind("click").bind("click", function () {
                //             DownloadEDoxDocument($(this).attr("id"), "DocName");
                //         })
                //     });
                //     $(this).find("input[type='file']").css('width', '');
                //     $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                // });

            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }

        });
    }


    if (userContext.TerminalSNo == '0') {
        ShowMessage('warning', 'Warning', "Terminal not assign for current user.");
        setTimeout(function () {

        }, 2000);
    }

    var Message = cfi.GetAWBLockedEvent(userContext.UserSNo, "0", currentGroupFlightSNo, "", "", "");
    if (Message == "") {

        ShowProcessDetails(subprocess, isdblclick);
        cfi.SaveUpdateLockedProcess("0", currentGroupFlightSNo, "", "", userContext.UserSNo, "0", "Inbound Flight", 3, "");
    }
    else {

        $("#__divdimension__").html('');
        return false;
    }
}

function BindEPouchData() {
    var dbTableName = "InboundEPouch";
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: true,
        tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
        masterTableSNo: currentGroupFlightSNo,
        currentPage: 1, itemsPerPage: 50,
        model: { GroupFlightSNo: currentGroupFlightSNo },
        sort: '',
        servicePath: 'Services/FlightControl/FlightControlService.svc',//'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'GetRecordAtFlightEPouch',
        //createUpdateServiceMethod: 'createUpdate' + dbTableName,
        //deleteServiceMethod: 'delete' + dbTableName,
        caption: 'EPouch',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: "SNo", type: "hidden", value: 0 },
            { name: 'DocName', display: 'Document Name', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
            { name: 'AltDocName', display: 'Download', type: 'button', ctrlAttr: { controltype: 'linkbutton', onClick: "return DownloadEPouchDocument(this.id)" }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
        ],
        isPaging: false,
        hideButtons: { updateAll: false, insert: false, removeLast: false },

    });

    //var Modeldata = {
    //    GroupFlightSNo: currentGroupFlightSNo
    //}
    // var res = $("#tblInboundEPouch tr[id^='tblInboundEPouch']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    //// getUpdatedRowIndex(res, 'tblInboundEPouch');
    // var data = JSON.parse(($('#tblInboundEPouch').appendGrid('getStringJson')));
    // if (!validateTableData('tblInboundEPouch', res)) {
    //     return false;
    // }
    ////var dbtableName = "InboundEPouch";
    ////$("#tbl" + dbtableName).appendGrid({
    ////    V2: true,
    ////    tableID: "tbl" + dbtableName,
    ////    contentEditable: true,
    ////    masterTableSNo: currentGroupFlightSNo,
    ////    isExtraPaging: true,
    ////    currentPage: 1, itemsPerPage: 50, whereCondition: null, model: Modeldata, sort: "",
    ////    //currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
    ////    isGetRecord: true,
    ////    servicePath: "Services/FlightControl/FlightControlService.svc",
    ////    getRecordServiceMethod: "GetRecordAtFlightEPouch",
    ////    //deleteServiceMethod: "DeletePOMailTrans",
    ////    // POMailTransSNo: $('[id^="tblAirMailTrans_SNo_"]').va(),
    ////    // PoMailSNo: CurrentAirMailSNo,
    ////    caption: "EPouch",

    ////    initRows: 1,
    ////    columns: [


    ////             { name: "SNo", type: "hidden" },
    ////             { name: 'DocName', display: 'Document Name', type: 'text', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
    ////             { name: 'AltDocName', display: 'Download', type: 'button', ctrlAttr: { controltype: 'linkbutton', onClick: "return DownloadEPouchDocument(this.id)" }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },

    ////    ],

    ////    //isPaging: true,
    ////    //hideButtons: { updateAll: true, insert: true, removeLast: true },
    ////    //.append$('<input type="button" value="new button"/>');

    ////});
    //UserSubProcessRights("divAirMailTrans_", subprocesssno);
    //$('#btnPayment').css("display", "none");
    //$('#btnUpdate').css("display", "none");
    //$('#btnSave').css("display", "none");
    //$('#btnSaveToNext').css("display", "none");
    //$('#btnNew').css("display", "none");
    ////$("tr[id^='tblAirMailTrans']").each(function (row, tr) {
    ////    CheckValueValidation($(tr).find("input[id^='tblAirMailTrans_DNNo_']").attr("id")); _
    ////});
}

function BindEPouch() {
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetRecordAtFlightEPouch?GroupFlightSNo=" + currentGroupFlightSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var StrData = '';
            var tabledetails = '';
            $("#divContent").find('#tabstrip').remove();
            var table = "<table class='WebFormTable' id='tblEPouch' validateonsubmit='true' width='100%'>";
            if (result != null && result != "" && result != '"{"Table0":[]}"') {
                var ePouchData = jQuery.parseJSON(result);
                var ePouchArray = ePouchData.Table0;
                //var theDiv = document.getElementById("DivEPouch");
                //var theDiv = '<div id"DivEPouch"></div>';
                // var theDiv = $("#divContent").append('<div id"DivEPouch"></div>');
                //theDiv.innerHTML = "";
                if (ePouchData.Table0.length > 0) {
                    StrData = "<tr><td class='formHeaderLabel'>SNo.</td><td class='formHeaderLabel'>Document Name</td><td class='formHeaderLabel'>Attachment</td></tr>";
                }
                for (var i = 0; i < ePouchData.Table0.length; i++) {
                    var ii = i + 1;
                    StrData += "<tr><td class='formfourInputcolumn'>" + ii + "</td><td class='formfourInputcolumn'>" + ePouchData.Table0[i].docname + "</td><td class='formfourInputcolumn'><a href='#' id='ahref_DocName_" + i + "' title='Doc....' recname='AltDocName' onclick='return DownloadEPouchDocument(this.id);' linkdata='" + ePouchData.Table0[i].altdocname + "'><span  id='DocName_" + i + "' controltype='alphanumericupper' recname='DocName'>" + ePouchData.Table0[i].docname + "</span></a></td></tr>";
                    //<a href='../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=''" + ePouchData.Table0[i].altdocname + "' >" + ePouchData.Table0[i].docname + "</a>

                }
                table += StrData + "</table>";
                //theDiv.innerHTML += table;
                tabledetails = '<div id="tabstrip" data-role="tabstrip" class="k-widget k-header k-tabstrip"> <ul id="ulTab" style="" class="k-tabstrip-items k-reset"><li class="k-state-active k-item k-tab-on-top k-state-default k-first" id="FirstTab"><a class="k-link"><b>Inbound EPouch Details</b></a></li></ul><div id="DivEPouch">' + table + '</div></div>'
                $("#divContent").append(tabledetails);




                //cfi.makeTrans("import_inboundepouch", null, null, BindE_Pouch, ReBindE_Pouch, null, ePouchArray, null, true);
                //$("#divareaTrans_import_inboundepouch tr:first").find("font").remove();
                ////var divPrintableTBLDetails = $("#divInboundEPouch");
                ////divPrintableTBLDetails.empty();
                ////var str = "<div><table width='100%'><tr><td></td><td><a href='Documents'>Documents</a></td></tr></table></div>"
                ////divPrintableTBLDetails.append(str);

                //$("div[id$='divareaTrans_import_inboundepouch']").find("[id='areaTrans_import_inboundepouch']").each(function () {
                //    //$(this).find("input[id^='DocsName']").each(function () {
                //    //    $(this).unbind("change").bind("change", function () {
                //    //        UploadEPouchDocument($(this).attr("id"), "DocName");
                //    //        WrapSelectedFileName();
                //    //    })
                //    //});
                //    $(this).find("a[id^='ahref_DocName']").each(function () {
                //        $(this).unbind("click").bind("click", function () {
                //            DownloadEPouchDocument($(this).attr("id"), "DocName");
                //        })

                //    });
                //    if ($(this).find("a[id^='ahref_DocName']").attr("linkdata") == "" || $(this).find("a[id^='ahref_DocName']").attr("linkdata") == undefined) {
                //        $(this).find("input[id^='DocsName']").css('width', '');
                //        $(this).find("input[id^='DocsName']").attr("data-valid-msg", "Attach Document");
                //        $(this).find("input[id^='DocsName']").attr("data-valid", "required");
                //    }
                //    //$(this).find("textarea[id^='Doc_Remarks']").attr('style', 'width: 100px; text-transform: uppercase;');

                //});

                // $('#transActionDiv').find('i:first').hide();
            }
        }
    });
}

function DownloadEPouchDocument(id) {

    if ($("#" + id).attr("linkdata") != undefined && $("#" + id).attr("linkdata") != "") {
        window.location.href = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + $("#" + id).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function BindE_Pouch(elem, mainElem) {
    //$(elem).find("input[type='file']").attr("data-valid-msg", "Attach Document");
    //$(elem).find("input[id^='DocsName']").each(function () {
    //    $(this).unbind("change").bind("change", function () {
    //        UploadEPouchDocument($(this).attr("id"), "DocName");
    //        WrapSelectedFileName();
    //    })
    //});
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEPouchDocument($(this).attr("id"), "DocName");
        })
    });
    //WrapSelectedFileName();
}

function ReBindE_Pouch(elem, mainElem) {
    $(elem).closest("div[id$='divareaTrans_import_inboundepouch']").find("[id^='areaTrans_import_inboundepouch']").each(function () {
        //$(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
        //    UploadEPouchDocument($(this).attr("id"), "DocName");
        //    WrapSelectedFileName();
        //})
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEPouchDocument($(this).attr("id"), "DocName");
        })
    });
}

function getCustomButton() {
    var FlightDestinationCode = userContext.AirportCode;
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetCOGACustomButton",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DailyFlightSNo: currentDailyFlightSno, FlightDestination: FlightDestinationCode }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            CheckCustomIsDeparted = JSON.parse(result).Table0[0].IsDeparted
            CheckCustomCOGAFlightRoute = JSON.parse(result).Table1[0].COGACustomFile
        },
        error: function () {
            ShowMessage('warning', 'Warning', "Unable to Load Custom Button.");
        }
    });
}

function ULDAppendProcess(dbTableName, transSNO) {
    var dbCaption = '';
    var columnsValue = '';
    var tableColumnsValue = '';
    if ($("#tbl" + dbTableName).length === 0)
        $("#divAfterContent").html("<table id='tbl" + dbTableName + "'></table>");
    if (dbTableName == 'FAULDLocation') {
        dbCaption = 'ULD Location';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: true,
            tableColumns: 'SNo,ULDNo,BUP,MovableLocation,Location',
            masterTableSNo: transSNO,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/InboundFlightService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: dbCaption,
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'FFMFlightMasterSNo', type: 'hidden' },
                { name: 'FFMShipmentTransSNo', type: 'hidden' },
                { name: 'ULDNo', type: 'hidden' },
                { name: 'ULDNo', display: 'ULD No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                { name: 'BUP', type: 'hidden' },
                { name: 'BUP', display: 'BUP', type: 'label' },
                { name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckULDMovableLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, AutoCompleteName: 'ImportInbound_BUPMovableLocation', filterField: 'ConsumablesName' },
                { name: 'Location', display: 'Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckULDLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ImportInbound_BUPLocation', filterField: 'LocationName' },
            ],
            rowUpdateExtraFunction: function (id) {
                $("input[id^=tblFAULDLocation_ULDNo]").each(function () {
                    var ind = $(this).attr('id').split('_')[2];
                    ExtraCondition("#tblFAULDLocation_Location_" + ind);
                    $(this).closest("table").find("td").removeClass("ui-widget-content");

                    $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();
                    if ($(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() == "" && $(this).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() == "") {
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").attr("required", "required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").attr("required", "required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();
                    }

                    if ($(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() == "" && $(this).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() != "") {
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").removeAttr("required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblFAULDLocation_Location']").removeAttr("required").css("cursor", "auto");
                    }
                });

                if (userContext.SpecialRights.MOVIMPORT == false) {
                    $("table[id$='tblFAULDLocation']").find("[id^='tblFAULDLocation_Row_']").each(function (row, tr) {
                        $(tr).find("input[id^=tblFAULDLocation_MovableLocation_]").hide();
                        $(tr).find("input[id^=tblFAULDLocation_HdnMovableLocation_]").hide();
                        $(tr).find("input[id^=tblFAULDLocation_MovableLocation_]").closest("td").hide();
                        $("table[id$='tblFAULDLocation']").find('tr').find('td:nth-child(4)').hide();
                    });
                }

                if (typeof (userContext.SpecialRights.MOVIMPORT) === "undefined") {
                    $("table[id$='tblFAULDLocation']").find("[id^='tblFAULDLocation_Row_']").each(function (row, tr) {
                        $(tr).find("input[id^=tblFAULDLocation_MovableLocation_]").hide();
                        $(tr).find("input[id^=tblFAULDLocation_HdnMovableLocation_]").hide();
                        $(tr).find("input[id^=tblFAULDLocation_MovableLocation_]").closest("td").hide();
                        $("table[id$='tblFAULDLocation']").find('tr').find('td:nth-child(4)').hide()
                    });
                }
            },
            hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });

        $("#tblFAULDLocation_rowOrder").closest("td").append("<input type='button' value='Save' class='incompleteprocess' onclick='SaveFAULDLocation();' />");
        $("#tblFAULDLocation_rowOrder").closest("tr").css("display", "block");
    }
    else if (dbTableName == 'FAULDDamage') {
        dbCaption = 'Damage';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: true,
            tableColumns: 'SNo,ULDNo,Serviceable,Remarks',
            masterTableSNo: transSNO,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/InboundFlightService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: dbCaption,
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'FFMShipmentTransSNo', type: 'hidden' },
                { name: 'ULDNo', display: 'ULD No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                { name: 'ULDNo', type: 'hidden' },
                { name: 'Serviceable', display: 'Serviceable', type: 'radiolist', selectedIndex: 1, ctrlOptions: { 0: 'Yes', 1: 'No' } },
                { name: 'Remarks', display: 'Remarks', type: 'text', ctrlAttr: { maxlength: 50, controltype: "text" }, ctrlCss: { width: '150px' }, isRequired: true }
            ],
            hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });

        $("#tblFAULDDamage_rowOrder").closest("td").append("<input type='button' value='Save' class='incompleteprocess' onclick='SaveFAULDDamage();' />");
        $("#tblFAULDDamage_rowOrder").closest("tr").css("display", "block");
    }
    else if (dbTableName == 'FAConsumable') {
        dbCaption = 'Consumable';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: true,
            tableColumns: 'SNo,List,Quantity',
            masterTableSNo: transSNO,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/InboundFlightService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            caption: dbCaption,
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'FFMShipmentTransSNo', type: 'hidden' },
                { name: 'ConsumablesList', display: 'List', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'Import_ConsumablesList', filterField: 'ItemName' },
                { name: 'Quantity', display: 'Quantity', type: 'text', ctrlAttr: { maxlength: 6, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true }
            ],
            hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: true },
            isPaging: true,
        });

        $("#tblFAConsumable_rowOrder").closest("td").append("<input type='button' value='Save' class='incompleteprocess' onclick='SaveFAConsumable();' />");
        $("#tblFAConsumable_rowOrder").closest("tr").css("display", "block");
    }
    else {
        dbCaption = '';
        tableColumnsValue = '';
        columnsValue = '';
    }

    cfi.PopUp("tbl" + dbTableName, dbCaption, 800, null, null, 10);
    $("#tbl" + dbTableName).parent("div").css("position", "fixed");
}

function GetFAULDLocation(ffmShipmentTransSNo, isThroughULD, isBUP) {
    var dbTableName = 'FAULDLocation';
    IsThroughULD = isThroughULD;
    IsBUP = isBUP;
    ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
}

function GetDamage(ffmShipmentTransSNo) {
    var dbTableName = 'FAULDDamage';
    ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
}

// AWB Locaton
function GetAWBULDLocation(awbSNo, obj) {
    var arvShipmentSNo = $(obj).closest("tr").find("td[data-column='ArrivedShipmentSNo']").text();
    DTR = $(obj).closest("tr");
    DTRIndex = "";
    var dbAwbTableName = 'AwbULDLocation';
    if (arvShipmentSNo == '0' || awbSNo == '0') {
        ShowMessage('warning', 'Warning - ULD Location', "Shipment not arrived.");
        return;
    }

    if (userContext.TerminalSNo == '0') {
        ShowMessage('warning', 'Warning', "Terminal not assign for current user.");
        return;
    }
    AWBAppendProcess(dbAwbTableName, arvShipmentSNo, awbSNo);
    $("#tblAwbULDLocation_AssignLocation_1").focus();
    if ($('#tblAwbULDLocation tr').index() == 1)
        $("#tblAwbULDLocation_btnRemoveLast").hide();
    else
        $("#tblAwbULDLocation_btnRemoveLast").show();

}

function GetAWBULDLocationPomail(awbSNo, obj) {
    var arvShipmentSNo = $(obj).closest("tr").find("td[data-column='POMArrivedShipmentSNo']").text();
    DTR = $(obj).closest("tr");
    DTRIndex = "";
    var dbAwbTableName = 'AwbULDLocation';
    if (arvShipmentSNo == '0' || awbSNo == '0') {
        ShowMessage('warning', 'Warning - ULD Location', "Shipment not arrived.");
        return;
    }

    if (userContext.TerminalSNo == '0') {
        ShowMessage('warning', 'Warning', "Terminal not assign for current user.");
        return;
    }
    AWBAppendProcess_pomail(dbAwbTableName, arvShipmentSNo, awbSNo);
    $("#tblAwbULDLocation_AssignLocation_1").focus();
    if ($('#tblAwbULDLocation tr').index() == 1)
        $("#tblAwbULDLocation_btnRemoveLast").hide();
    else
        $("#tblAwbULDLocation_btnRemoveLast").show();
}
// AWB Damage process
function GetAWBDamage(awbSNo, obj) {
    var arvShipmentSNo = $(obj).closest("tr").find("td[data-column='ArrivedShipmentSNo']").text();
    DTR = $(obj).closest("tr");
    DTRIndex = "";
    if (arvShipmentSNo == '0' || awbSNo == '0') {
        ShowMessage('warning', 'Warning - AWB Discrepancy', "Shipment not arrived.");
        return;
    }
    var dbAwbTableName = 'AwbULDDamage';
    AWBAppendProcess(dbAwbTableName, arvShipmentSNo, awbSNo);
    $("#tblAwbULDDamage_IrregularityDamage_1").focus();

    if ($('#tblAwbULDDamage tr').index() == 1)
        $("#tblAwbULDDamage_btnRemoveLast").hide();
    else
        $("#tblAwbULDDamage_btnRemoveLast").show();
}

// AWB Locaton and Damage process
function AWBAppendProcess_pomail(dbAwbTableName, arrivedShipmentSNo, awbSNo) {
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table id='tbl" + dbAwbTableName + "'></table>");
    } else {
        $("#tbl" + dbAwbTableName).html('');
    }
    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, dbAwbTableName == 'AwbULDDamage' ? 800 : 1330, null, null, 10);
    $("#tbl" + dbAwbTableName).parent("div").css("position", "fixed");

    if (dbAwbTableName == 'AwbULDLocation') {
        dbAWBCaption = 'AWB Location';
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,RcvdPieces,RcvdGrossWeight,HAWB,SPHC,EndPieces,AssignLocation,TempControlled,StartTemperature,EndTemperature',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/InboundFlightService.svc',
            getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record_Pomail',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbAwbTableName + '_Pomail',
            deleteServiceMethod: 'delete' + dbAwbTableName + '_Pomail',
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AWBSNo', type: 'hidden' },
                { name: 'ArrivedShipmentSNo', type: 'hidden' },
                { name: 'SPHC', type: 'hidden' },
                { name: 'HdnAWBNo', type: 'hidden' },
                { name: 'HdnHAWB', type: 'hidden' },
                { name: 'HdnRcvdPieces', type: 'hidden' },
                { name: 'HdnRcvdGrossWeight', type: 'hidden' },
                { name: 'AWBNo', display: 'AWB No', type: 'label' },
                { name: 'RcvdPieces', display: 'Rcvd Pieces', type: 'label' },
                { name: 'RcvdGrossWeight', display: 'Rcvd Gr.WT', type: 'label' },
                { name: 'HdnLocSNo', type: 'hidden' },
                { name: 'HdnEndPieces', type: 'hidden' },
                { name: 'HAWB', display: 'HAWB No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckHAWB(this);" }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'ImportInbound_HAWB', filterField: 'HAWBNo' },
                {
                    name: 'SPHC', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckSPHC(this);" }, ctrlCss: { width: '80px', height: '20px' }, AutoCompleteName: 'ImportInbound_LocationSPHC', filterField: 'Code', filterCriteria: "contains", separator: ","
                },
                { name: 'EndPieces', display: 'Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '55px' }, isRequired: true },
                {
                    name: 'TempControlled', display: 'Temp Controlled', type: 'text', value: "1", type: 'select', onChange: function (evt, rowIndex) {
                        var ind = evt.target.id.split('_')[2];
                        if ($("#" + evt.target.id + " option:checked").val() == 1) {
                            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        } else {
                            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
                        }

                        $("#tblAwbULDLocation_HdnAssignLocation_" + ind).val("");
                        $("#tblAwbULDLocation_AssignLocation_" + ind).val("");

                    }, ctrlOptions: { '0': 'Yes', '1': 'No' }, ctrlCss: { width: '50px', height: '20px' }
                },

                { divRowNo: 1, name: 'StartTemperature', display: 'Start Temp.', type: 'text', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true },
                {
                    divRowNo: 1, name: 'EndTemperature', display: 'End Temp.', type: 'text', ctrlAttr: {
                        controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)"
                    }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
                },
                {
                    name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'ImportInbound_MovableLocation', filterField: 'ConsumablesName', onChange: function (evt, rowIndex) {
                    }
                },
                {
                    name: 'AssignLocation', display: 'Assign Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'ImportInbound_AssignLocation', filterField: 'LocationName', filterCriteria: "contains", isRequired: true, onChange: function (evt, rowIndex) {
                    }
                }
            ], rowUpdateExtraFunction: function (id) {
                var rowAWBULDCount = $("#tblAwbULDLocation").find("input[id^=tblAwbULDLocation_StartPieces_]").length;
                $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                    var ind = $(this).attr('id').split('_')[2];
                    $("#tblAwbULDLocation_StartTemperature_" + ind).closest("table").find("td").removeClass("ui-widget-content");
                    if ($("#tblAwbULDLocation_TempControlled_" + ind + " option:checked").val() == 1) {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    } else {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_StartTemperature_" + ind).val());
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_EndTemperature_" + ind).val());
                    }

                    $("#divMultitblAwbULDLocation_SPHC_" + ind).find("ul").css("width", "163px");
                    $("#tblAwbULDLocation_SPHC_" + ind).val("");
                    ExtraCondition("#tblAwbULDLocation_AssignLocation_" + ind);
                    if (rowAWBULDCount == 1) {
                        if (ind > 0) {
                            $("#tblAwbULDLocation_StartPieces_" + (ind - 1)).removeAttr("disabled").css("cursor", "auto");
                            $("#tblAwbULDLocation_EndPieces_" + (ind - 1)).removeAttr("disabled").css("cursor", "auto");
                        }
                    }
                    else {
                        if (ind > 0) {
                            $("#tblAwbULDLocation_StartPieces_" + (ind - 1)).attr("disabled", true).css("cursor", "not-allowed");
                            $("#tblAwbULDLocation_EndPieces_" + (ind - 1)).attr("disabled", true).css("cursor", "not-allowed");
                        }
                    }

                    $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
                        $(this).closest("table").find("td").removeClass("ui-widget-content");
                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() == "") {
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                        }

                        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() != "") {
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required").css("cursor", "auto");
                        }
                    });
                });
            },
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {
                if (userContext.SpecialRights.MOVIMPORT == false) {
                    $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_HdnMovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").closest("td").hide();
                        $("td[title='Movable Location']").hide();
                        $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(11)').hide()
                    });
                }

                if (typeof (userContext.SpecialRights.MOVIMPORT) === "undefined") {
                    $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_HdnMovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").closest("td").hide();
                        $("td[title='Movable Location']").hide();
                        $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(11)').hide()
                    });
                }
            }, afterRowRemoved: function (caller, rowIndex) {
                var countindex = 0;
                $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                    var ind = $(this).attr('id').split('_')[2];
                    var rowAWBULDCount = $("#tblAwbULDLocation").find("input[id^=tblAwbULDLocation_StartPieces_]").length;
                    countindex = countindex + 1;

                    if (countindex == rowAWBULDCount) {
                        $("#tblAwbULDLocation_StartPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_EndPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_HAWB_" + ind).data("kendoAutoComplete").enable(true);
                    }
                });
            }
        });

        $("#tblAwbULDLocation_rowOrder").closest("td").append("<input type='button' id='btnsaveLocation' value='Save' class='incompleteprocess' onclick='SaveAWBULDLocation_pomail();' />");
        $("#tblAwbULDLocation_rowOrder").closest("tr").css("display", "block");

        // Added  By Rahul Singh  09-18-2017 To add SNo in Location Grid Pop Up     
        $('#tblAwbULDLocation tr:nth-child(2) td:first').text('SNo');
    }

    if (dbAwbTableName == 'AwbULDDamage') {
        dbAWBCaption = "AWB Discrepancy";
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,IrregularityDamage',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/InboundFlightService.svc',
            getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbAwbTableName,
            deleteServiceMethod: 'delete' + dbAwbTableName,
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AWBSNo', type: 'hidden' },
                { name: 'ArrivedShipmentSNo', type: 'hidden' },
                { name: 'TotalPieces', type: 'hidden' },
                { name: 'HdnAWBNo', type: 'hidden' },
                { name: 'AWBNo', display: 'AWB No', type: 'label' },
                { name: 'Pieces', display: 'Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "return CheckTotalPieces(this);" }, ctrlCss: { width: '80px' }, isRequired: true },
                { name: 'IrregularityDamage', display: 'Irregularity Discrepancy', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckAWBIrregularityDamage(this);" }, ctrlCss: { width: '180px', height: '20px' }, AutoCompleteName: 'ImportInbound_IrregularityDamage', filterField: 'Damage', filterCriteria: "contains", isRequired: true, }
            ],
            isPaging: true,
        });

        $("#tblAwbULDDamage_rowOrder").closest("td").append("<input type='button' value='Save' class='incompleteprocess' onclick='SaveAwbULDDamage();' />");
        $("#tblAwbULDDamage_rowOrder").closest("tr").css("display", "block");
    }
}

function AWBAppendProcess(dbAwbTableName, arrivedShipmentSNo, awbSNo) {
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table id='tbl" + dbAwbTableName + "'></table>");
    } else {
        $("#tbl" + dbAwbTableName).html('');
    }
    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, dbAwbTableName == 'AwbULDDamage' ? 800 : 1330, null, null, 10);
    $("#tbl" + dbAwbTableName).parent("div").css("position", "fixed");

    if (dbAwbTableName == 'AwbULDLocation') {
        dbAWBCaption = 'AWB Location';
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,RcvdPieces,RcvdGrossWeight,HAWB,SPHC,EndPieces,AssignLocation,TempControlled,StartTemperature,EndTemperature',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/InboundFlightService.svc',
            getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbAwbTableName,
            deleteServiceMethod: 'delete' + dbAwbTableName,
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AWBSNo', type: 'hidden' },
                { name: 'ArrivedShipmentSNo', type: 'hidden' },
                { name: 'SPHC', type: 'hidden' },
                { name: 'HdnAWBNo', type: 'hidden' },
                { name: 'HdnHAWB', type: 'hidden' },
                { name: 'HdnRcvdPieces', type: 'hidden' },
                { name: 'HdnRcvdGrossWeight', type: 'hidden' },
                { name: 'AWBNo', display: 'AWB No', type: 'label' },
                { name: 'RcvdPieces', display: 'Rcvd Pieces', type: 'label' },
                { name: 'RcvdGrossWeight', display: 'Rcvd Gr.WT', type: 'label' },
                { name: 'HdnLocSNo', type: 'hidden' },
                { name: 'HdnEndPieces', type: 'hidden' },
                { name: 'HAWB', display: 'HAWB No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckHAWB(this);" }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'ImportInbound_HAWB', filterField: 'HAWBNo' },
                {
                    name: 'SPHC', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckSPHC(this);" }, ctrlCss: { width: '80px', height: '20px' }, AutoCompleteName: 'ImportInbound_LocationSPHC', filterField: 'Code', filterCriteria: "contains", separator: ","
                },
                { name: 'EndPieces', display: 'Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '55px' }, isRequired: true },
                {
                    name: 'TempControlled', display: 'Temp Controlled', type: 'text', value: "1", type: 'select', onChange: function (evt, rowIndex) {
                        var ind = evt.target.id.split('_')[2];
                        if ($("#" + evt.target.id + " option:checked").val() == 1) {
                            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        } else {
                            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
                        }

                        $("#tblAwbULDLocation_HdnAssignLocation_" + ind).val("");
                        $("#tblAwbULDLocation_AssignLocation_" + ind).val("");

                    }, ctrlOptions: { '0': 'Yes', '1': 'No' }, ctrlCss: { width: '50px', height: '20px' }
                },

                { divRowNo: 1, name: 'StartTemperature', display: 'Start Temp.', type: 'text', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true },
                {
                    divRowNo: 1, name: 'EndTemperature', display: 'End Temp.', type: 'text', ctrlAttr: {
                        controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)"
                    }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
                },
                {
                    name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'ImportInbound_MovableLocation', filterField: 'ConsumablesName', onChange: function (evt, rowIndex) {
                    }
                },
                {
                    name: 'AssignLocation', display: 'Assign Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'ImportInbound_AssignLocation', filterField: 'LocationName', filterCriteria: "contains", isRequired: true, onChange: function (evt, rowIndex) {
                    }
                }
            ], rowUpdateExtraFunction: function (id) {
                var rowAWBULDCount = $("#tblAwbULDLocation").find("input[id^=tblAwbULDLocation_StartPieces_]").length;
                $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                    var ind = $(this).attr('id').split('_')[2];
                    $("#tblAwbULDLocation_StartTemperature_" + ind).closest("table").find("td").removeClass("ui-widget-content");
                    if ($("#tblAwbULDLocation_TempControlled_" + ind + " option:checked").val() == 1) {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    } else {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_StartTemperature_" + ind).val());
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_EndTemperature_" + ind).val());
                    }

                    $("#divMultitblAwbULDLocation_SPHC_" + ind).find("ul").css("width", "163px");
                    $("#tblAwbULDLocation_SPHC_" + ind).val("");
                    ExtraCondition("#tblAwbULDLocation_AssignLocation_" + ind);
                    if (rowAWBULDCount == 1) {
                        if (ind > 0) {
                            $("#tblAwbULDLocation_StartPieces_" + (ind - 1)).removeAttr("disabled").css("cursor", "auto");
                            $("#tblAwbULDLocation_EndPieces_" + (ind - 1)).removeAttr("disabled").css("cursor", "auto");
                        }
                    }
                    else {
                        if (ind > 0) {
                            $("#tblAwbULDLocation_StartPieces_" + (ind - 1)).attr("disabled", true).css("cursor", "not-allowed");
                            $("#tblAwbULDLocation_EndPieces_" + (ind - 1)).attr("disabled", true).css("cursor", "not-allowed");
                        }
                    }

                    $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
                        $(this).closest("table").find("td").removeClass("ui-widget-content");
                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() == "") {
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                        }

                        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() != "") {
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required").css("cursor", "auto");
                            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required").css("cursor", "auto");
                        }
                    });
                });
            },
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {
                if (userContext.SpecialRights.MOVIMPORT == false) {
                    $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_HdnMovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").closest("td").hide();
                        $("td[title='Movable Location']").hide();
                        $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(11)').hide()
                    });
                }

                if (typeof (userContext.SpecialRights.MOVIMPORT) === "undefined") {
                    $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_HdnMovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").closest("td").hide();
                        $("td[title='Movable Location']").hide();
                        $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(11)').hide()
                    });
                }
            }, afterRowRemoved: function (caller, rowIndex) {
                var countindex = 0;
                $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                    var ind = $(this).attr('id').split('_')[2];
                    var rowAWBULDCount = $("#tblAwbULDLocation").find("input[id^=tblAwbULDLocation_StartPieces_]").length;
                    countindex = countindex + 1;

                    if (countindex == rowAWBULDCount) {
                        $("#tblAwbULDLocation_StartPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_EndPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_HAWB_" + ind).data("kendoAutoComplete").enable(true);
                    }
                });
            }
        });

        $("#tblAwbULDLocation_rowOrder").closest("td").append("<input type='button' id='btnsaveLocation' value='Save' class='incompleteprocess' onclick='SaveAWBULDLocation();' />");
        $("#tblAwbULDLocation_rowOrder").closest("tr").css("display", "block");

        // Added  By Rahul Singh  09-18-2017 To add SNo in Location Grid Pop Up     
        $('#tblAwbULDLocation tr:nth-child(2) td:first').text('SNo');
    }

    if (dbAwbTableName == 'AwbULDDamage') {
        dbAWBCaption = "AWB Discrepancy";
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,IrregularityDamage',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/InboundFlightService.svc',
            getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbAwbTableName,
            deleteServiceMethod: 'delete' + dbAwbTableName,
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AWBSNo', type: 'hidden' },
                { name: 'ArrivedShipmentSNo', type: 'hidden' },
                { name: 'TotalPieces', type: 'hidden' },
                { name: 'HdnAWBNo', type: 'hidden' },
                { name: 'AWBNo', display: 'AWB No', type: 'label' },
                { name: 'Pieces', display: 'Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "return CheckTotalPieces(this);" }, ctrlCss: { width: '80px' }, isRequired: true },
                { name: 'IrregularityDamage', display: 'Irregularity Discrepancy', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckAWBIrregularityDamage(this);" }, ctrlCss: { width: '180px', height: '20px' }, AutoCompleteName: 'ImportInbound_IrregularityDamage', filterField: 'Damage', filterCriteria: "contains", isRequired: true, }
            ],
            isPaging: true,
        });

        $("#tblAwbULDDamage_rowOrder").closest("td").append("<input type='button' value='Save' class='incompleteprocess' onclick='SaveAwbULDDamage();' />");
        $("#tblAwbULDDamage_rowOrder").closest("tr").css("display", "block");
    }
}

function CheckSPHC(obj) {
    $(obj).closest("td").find("div > ul").css("width", "163px");
}

function CheckHAWB(obj) {
    var houseNo = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val();
    var houseLastIndex = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val().lastIndexOf('-');
    var housePieces = houseNo.substring(houseLastIndex + 1, houseNo.length);
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val("");
    $(obj).closest("tr").find("input[id^='_temptblAwbULDLocation_StartPieces']").val("");
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val("");
    $(obj).closest("tr").find("input[id^='_temptblAwbULDLocation_EndPieces']").val("")
}

function CheckAWBIrregularityDamage(obj) {
    $("#tblAwbULDDamage").find("input[id^='tblAwbULDDamage_IrregularityDamage']").each(function () {
        var ind = $(this).attr('id').split('_')[2];
        var lastRow = $("#tblAwbULDDamage tbody tr:last").attr("id").split("_")[2];
        if ($("#tblAwbULDDamage_IrregularityDamage_" + ind).val().toUpperCase() == $(obj).val() && lastRow != ind) {
            $(obj).val('');
            ShowMessage("warning", "Discrepancy", "Discrepancy already exist.");
            return false;
        }
    });
}

function CheckTotalPieces(obj) {
    var Pieces = 0;
    var TotalPieces = parseInt($(obj).parents("tr").find("input[id^='tblAwbULDDamage_TotalPieces']").val());
    $("#tblAwbULDDamage").find("input[id^='tblAwbULDDamage_Pieces']").each(function () {
        Pieces = (Pieces == 0 ? parseInt($(this).val()) : Pieces + parseInt($(this).val()));
        if (Pieces > TotalPieces) {
            $(obj).val('');
            ShowMessage("warning", "Discrepancy", "Pieces can not be greater than Total Piece " + TotalPieces + ' .');
            return false;
        }
    });
}

//tblAwbULDLocation_AssignLocation
function CheckMovableLocation(obj) {
    var hdnMovableLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnMovableLocation']").val();
    var movableLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val();
    var hdnAssignLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val();
    var assignLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val();
    if ((hdnMovableLocation != "0" && movableLocation != "") && (hdnAssignLocation == "" && assignLocation == "")) {
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation_']").data("kendoAutoComplete").enable(false);
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation_']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation_']").val('0');
    }
    else if ((hdnMovableLocation == "0" && movableLocation == "") && (hdnAssignLocation != "" && assignLocation != "")) {
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").data("kendoAutoComplete").enable(false);
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnMovableLocation']").val('0');
    }
}

// Check ULD movable location
function CheckULDMovableLocation(obj) {
    if ($(obj).val() != "") {
        $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").val("");
        $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").val("0");

        if ($(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() == "" && $(obj).val() == "") {
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").attr("required", "required").css("cursor", "auto");
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").attr("required", "required").css("cursor", "auto");
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();
        }

        if ($(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() == "" && $(obj).val() != "") {
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").removeAttr("required").css("cursor", "auto");
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").removeAttr("required").css("cursor", "auto");
        }
    }
}

// Check ULD Location
function CheckULDLocation(obj) {
    if ($(obj).val() != "") {
        $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val("");
        $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnMovableLocation']").val("0");

        if ($(obj).val() == "" && $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() != "") {
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").data("kendoAutoComplete").enable(false);
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").val("");
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").val('0');
        }

        if ($(obj).val() == "" && $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() != "") {
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").data("kendoAutoComplete").enable(false);
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val("");
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnMovableLocation']").val('0');
        }
    }
}

//------------- Breakdown Start and End TIme --------------------//
function GetBreakdownStartTime(obj1) {
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    var startdatetime = $(obj1).closest("tr").find("span[id=spnBreakDownStart]").text();
    if ($('#tblBreakdownStartTime').length == 0) {
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblBreakdownStartTime'><tr><td><input type='text' controltype='datetype' id='txtBreakdownStartDate' class='datepicker' />&nbsp;<input type='text' class='timePicker' id='txtBreakdownStartTime'  /><input type='hidden' controltype='datetype' id='txtpomsno' />&nbsp;<input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='UpdateBreakDownTime(this,1);' /></td></tr></table>");

        $("#tblBreakdownStartTime").find(".datepicker").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        breakdownStartTime = $("#tblBreakdownStartTime").find(".timePicker").kendoTimePicker({
            format: "HH:mm",
            change: function () {
                var startTime = breakdownStartTime.value();
                if (startTime) {
                    startTime = new Date(startTime);
                    startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                } else {
                    breakdownStartTime.value('');
                }
            }
        }).data("kendoTimePicker");

        if (startdatetime != "+ Add Time") {
            breakdownStartTime.value(startdatetime.substring(12, 17));
            $("#txtBreakdownStartDate").val(startdatetime.substring(0, 11));
        }
    } else {
        if (startdatetime != "+ Add Time") {
            breakdownStartTime.value(startdatetime.substring(12, 17));
            $("#txtBreakdownStartDate").val(startdatetime.substring(0, 11));
        }
        else {
            breakdownStartTime.value('');
        }
    }

    cfi.PopUp("tblBreakdownStartTime", "Breakdown Start Time", 400, null, null, 100);
    $("#tblBreakdownStartTime").parent("div").css("position", "fixed");

    breakdownFFMFlightMasterSNo = $(obj1).closest("tr").find("td:eq(3)").text();
    breakdownUldNo = $(obj1).closest("tr").find("td:eq(6)").text();

    delete seletedObj1;
    seletedObj1 = obj1;
    txtpomsno = parseInt($(obj1).closest("tr").find("td[data-column='POMailSNo']").text());
}

function GetBreakdownEndTime(obj2) {
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    var enddatetime = $(obj2).closest("tr").find("span[id=spnBreakDownEnd]").text();
    if ($("#tblBreakdownEndTime").length === 0) {
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblBreakdownEndTime'><tr><td><input type='text' controltype='datetype' id='txtBreakdownEndDate' class='datepicker' />&nbsp;<input type='text' class='timePicker' id='txtBreakdownEndTime'  /><input type='hidden' controltype='datetype' id='txtpomsno' />&nbsp;<input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='UpdateBreakDownTime(this,2);'  /></td></tr></table>");
        $("#tblBreakdownEndTime").find(".datepicker").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });

        breakdownEndTime = $("#tblBreakdownEndTime").find(".timePicker").kendoTimePicker({
            format: "HH:mm",
            change: function () {
                var startTime = breakdownEndTime.value();
                if (startTime) {
                    startTime = new Date(startTime);
                    startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                } else {
                    breakdownEndTime.value('');
                }
            }
        }).data("kendoTimePicker");

        if (enddatetime != "+ Add Time") {
            breakdownEndTime.value(enddatetime.substring(12, 17));
            $("#txtBreakdownEndDate").val(enddatetime.substring(0, 11));
        }
    }
    else {
        if (enddatetime != "+ Add Time") {
            breakdownEndTime.value(enddatetime.substring(12, 17));
            $("#txtBreakdownEndDate").val(enddatetime.substring(0, 11));
        }
        else {
            breakdownEndTime.value('');
        }
    }
    cfi.PopUp("tblBreakdownEndTime", "Breakdown End Time", 400, null, null, 100);
    $("#tblBreakdownEndTime").parent("div").css("position", "fixed");

    breakdownFFMFlightMasterSNo = $(obj2).closest("tr").find("td:eq(3)").text();
    breakdownUldNo = $(obj2).closest("tr").find("td:eq(6)").text();
    seletedObj2 = obj2;
    txtpomsno = parseInt($(obj2).closest("tr").find("td[data-column='POMailSNo']").text());
}

function GetDate(str) {
    var arr = str.split(" ");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = ('0' + (months.indexOf(arr[1]) + 1)).slice(-2);
    var final = arr[2] + '-' + month + '-' + arr[0];
    return final;
}

function UpdateBreakDownTime(obj, boolBreakdown) {
    var breakdownStartDateTime; var breakdownEndDateTime; var breakdownStartDateTime1; var breakdownEndDateTime1;
    var spanStart; var spanEnd; var spanStartDate; var spanEndDate; var ftDate; var arr1; var final1; var arr2; var final2; var flightDateAndATA;
    var FinalEndDate; var FinalStartDate; var bdStartTime; var bdEndTime;

    /* NaN Handling Start  */
    if (isNaN(POMSNo)) {
        var POMSNo = 0;
    }
    /*NaN Handling END  */

    if (boolBreakdown == 1) {
        if ($("#txtBreakdownStartDate").attr("sqldatevalue") == "") {
            ShowMessage("warning", "Warning-Breakdown Time", "Enter breakdown start date.");
            return;
        }

        if ($("#txtBreakdownStartTime").val() == "") {
            ShowMessage("warning", "Warning-Breakdown Time", "Enter breakdown start time.");
            return;
        }

        breakdownStartDateTime = $("#txtBreakdownStartDate").attr("sqldatevalue") + ' ' + $("#txtBreakdownStartTime").val();
        bdStartTime = ($("#txtBreakdownStartTime").val() == '') ? '00:00' : $("#txtBreakdownStartTime").val();
        breakdownStartDateTime1 = $("#txtBreakdownStartDate").attr("sqldatevalue").replace('-', ' ').replace('-', ' ') + ' ' + bdStartTime + ':00';
        breakdownEndDateTime = '0';
        spanEnd = $(seletedObj1).closest("tr").find("#spnBreakDownEnd").text();
        spanEndDate = spanEnd.substring(0, 11);
        spanEndTime = spanEnd.substring(12, 20);
        FinalEndDate = GetDate(spanEndDate) + ' ' + spanEndTime;
        ftDate = $("#ArrivalDate").val().replace('-', ' ').replace('-', ' ');
        arr1 = ftDate.split(" ");
        final1 = arr1[0] + ' ' + arr1[1] + ' ' + arr1[2];

        var ataData = ($("#ATA").val() == '') ? '00:00' : $("#ATA").val();
        flightDateAndATA = GetDate(final1).replace('-', ' ').replace('-', ' ') + ' ' + ataData + ':00';

        var starttimevalue = $("#txtBreakdownStartTime").val().substring($("#txtBreakdownStartTime").val().length - 2, $("#txtBreakdownStartTime").val().length);
        if (parseInt(starttimevalue) >= 60) {
            ShowMessage("warning", "Warning-Breakdown Time", " Incorrect time format.");
            return;
        }

        if (Date.parse(breakdownStartDateTime1) <= Date.parse(flightDateAndATA)) {
            ShowMessage("warning", "Breakdown", "Breakdown start Time details can not be less than or equal to Flight Time details and ATA.");
            return;
        }

        if (Date.parse(breakdownStartDateTime1) >= Date.parse(FinalEndDate)) {
            ShowMessage("warning", "Breakdown", "Breakdown Start Time details can not be greater or equal to Breakdown End Time.");
            return;
        }
    }
    else {
        if ($("#txtBreakdownEndDate").attr("sqldatevalue") == "") {
            ShowMessage("warning", "Warning-Breakdown Time", "Enter breakdown end date.");
            return;
        }

        if ($("#txtBreakdownEndTime").val() == "") {
            ShowMessage("warning", "Warning-Breakdown Time", "Enter breakdown end time.");
            return;
        }

        breakdownEndDateTime = $("#txtBreakdownEndDate").attr("sqldatevalue") + ' ' + $("#txtBreakdownEndTime").val();
        bdEndTime = ($("#txtBreakdownEndTime").val() == '') ? '00:00' : $("#txtBreakdownEndTime").val();
        breakdownEndDateTime1 = $("#txtBreakdownEndDate").attr("sqldatevalue").replace('-', ' ').replace('-', ' ') + ' ' + bdEndTime + ':00';
        breakdownStartDateTime = '0';

        spanStart = $(seletedObj2).closest("tr").find("#spnBreakDownStart").text();
        spanStartDate = spanStart.substring(0, 11);
        spanStartTime = spanStart.substring(12, 20);
        FinalStartDate = GetDate(spanStartDate) + ' ' + spanStartTime;

        ftDate = $("#ArrivalDate").val().replace('-', ' ').replace('-', ' ');
        arr2 = ftDate.split(" ");
        final2 = arr2[0] + ' ' + arr2[1] + ' ' + arr2[2];

        var ataData = ($("#ATA").val() == '') ? '00:00' : $("#ATA").val();
        flightDateAndATA = GetDate(final2).replace('-', ' ').replace('-', ' ') + ' ' + ataData + ':00';

        var Endtimevalue = $("#txtBreakdownEndTime").val().substring($("#txtBreakdownEndTime").val().length - 2, $("#txtBreakdownEndTime").val().length);
        if (parseInt(Endtimevalue) >= 60) {
            ShowMessage("warning", "Warning-Breakdown Time", " Incorrect time format.");
            return;
        }

        if (Date.parse(breakdownEndDateTime1) <= Date.parse(flightDateAndATA)) {
            ShowMessage("warning", "Breakdown", "Breakdown End Time details can not be less than or equal to Flight Time details and ATA.");
            return;
        }

        if (Date.parse(breakdownEndDateTime1) <= Date.parse(FinalStartDate)) {
            ShowMessage("warning", "Breakdown", "Breakdown End Time details can not be less or equal to Breakdown Start Time.");
            return;
        }
    }

    $.ajax({
        url: "Services/Import/InboundFlightService.svc/UpdateBreakDownTime", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ BreakdownStartTime: breakdownStartDateTime, BreakdownEndTime: breakdownEndDateTime, FFMFlightMasterSNo: breakdownFFMFlightMasterSNo, ULDNo: breakdownUldNo, POMailSNo: parseInt(txtpomsno), DailyFlightSNo: currentDailyFlightSno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resultData = result.split(",")
            if (resultData[1] == "0") {
                $("#ATA").prop('disabled', true);
                $("#ATA").css("cursor", "not-allowed");
                ShowMessage('success', 'Success - Breakdown Time', "Updated successfully");
                if (boolBreakdown == 1) {
                    $("#tblBreakdownStartTime").data("kendoWindow").close();
                    $(seletedObj1).text(resultData[0]);
                }
                else {
                    $("#tblBreakdownEndTime").data("kendoWindow").close();
                    $(seletedObj2).text(resultData[0]);
                }
            }
            else {
                ShowMessage('warning', 'Warning - Breakdown Time', "Unable to update breakdown time.");
                return;
            }
        },
        error: function () {
            ShowMessage('warning', 'Warning - Breakdown Time', "Unable to update breakdown time.");
            return;
        }
    });
}

function CheckFATempratureStartEnd(obj) {
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val("");
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val("");
    var startVal = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartTemperature']").val());
    var endVal = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndTemperature']").val());
    if (startVal > endVal) {
        $(obj).val('');
        ShowMessage("warning", "", "End temperature should be greater than start temperature.");
    }
}

function CheckFAStartEndPieces(obj) {
    var cValue = $(obj).val();
    var startPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val());
    var endPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val());
    var rcvdPieces = $("#tblAwbULDLocation_RcvdPieces_1").text();
    var houseNo = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val();
    var houseLastIndex = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val().lastIndexOf('-');
    var housePieces = houseNo.substring(houseLastIndex + 1, houseNo.length);
    var housesno = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnHAWB']").val();
    var awbno = $("#tblAwbULDLocation_AWBNo_1").text();
    var hawbpieces = 0;
    var Dailyflightsno = 0;
    var CurDailyflightsno = 0;

    //==============Added by Akaram Ali=====
    if (startPieces == 0) {
        ShowMessage("warning", "", "Pieces can not be zero");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val('');
    }

    if (endPieces == 0) {
        ShowMessage("warning", "", "Pieces can not be zero");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val('');
    }

    //==================end==================

    if (startPieces > endPieces) {
        $(obj).val('');
        ShowMessage("warning", "", "Start Pieces can not be greater than End Pieces");
    }

    if (houseNo != "") {
        var TotalPcs = 0;
        arrHAWB = [];
        arrList = [];
        $(obj).closest("table").find("tr[id^='tblAwbULDLocation_Row_']").each(function () {
            if ($(this).find("input[id^='tblAwbULDLocation_HAWB_']").val() != "" && $(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val() != "") {
                var _HAWBNo = $(this).find("input[id^='tblAwbULDLocation_HAWB_']").val();
                var _HousePieces = parseInt($(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val());
                var _HouseSNo = parseInt($(this).find("input[id^='tblAwbULDLocation_HdnHAWB_']").val());
                arrHAWB.push(
                    {
                        HAWBNo: _HAWBNo,
                        HousePieces: _HousePieces,
                        HouseSNo: _HouseSNo

                    });
                if ((arrList.length > 0 && $.inArray(_HAWBNo, arrList) == -1) || arrList.length == 0)
                    arrList.push(
                        _HAWBNo
                    );
            }
        });

        if (arrHAWB != null && arrHAWB.length > 0) {
            for (var k = 0; k <= arrList.length - 1; k++) {
                {
                    housePieces1 = 0;
                    for (var i = 0; i < arrHAWB.length; i++) {
                        if (arrList[k] == arrHAWB[(arrHAWB.length - 1)]["HAWBNo"]) {
                            if (arrHAWB[(i)]["HAWBNo"] == arrHAWB[(arrHAWB.length - 1)]["HAWBNo"]) {
                                TotalPcs = TotalPcs + parseInt(arrHAWB[i]["HousePieces"]);
                            }
                        }
                    }
                }
            }
        }

        var arrivedshipmentsno = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_ArrivedShipmentSNo']").val();
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/GetHousePieces", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBNo: awbno, Hawbno: housesno, ArrivedShipmentSno: arrivedshipmentsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;

                if (resData && resData.length > 0) {
                    hawbpieces = resData[0].Pieces;
                    Dailyflightsno = resData[0].DailyFlightSNo;
                }

                if (resData1 && resData1.length > 0) {
                    CurDailyflightsno = resData1[0].DailyFlightSNo;
                }
            },
        });

        var totalrecpices = parseInt(housePieces) - parseInt(hawbpieces)
        if (parseInt(TotalPcs) > parseInt(totalrecpices)) {
            $(obj).val('');
            ShowMessage("warning", "", "Entered Pieces can not be greater than House Pieces");
            return;
        }

        var TotalPcs = 0;
    }
    else {

        if (parseInt(cValue) > parseInt(rcvdPieces)) {
            $(obj).val('');
            ShowMessage("warning", "", "Entered Pieces can not be greater than Received Pieces");
            return;
        }

        var count = 0;
        if ($("#tblAwbULDLocation > tbody").children.length > 1) {
            var totalpcs = 0;
            $("#tblAwbULDLocation").find("input[id^='tblAwbULDLocation_AssignLocation']").each(function () {
                count = count + 1;
                var aEnd = $(this).parents("tr").find("input[type='text'][id^='tblAwbULDLocation_EndPieces']").val();
                if (aEnd != "" && aEnd != "0") {
                    totalpcs = parseInt(totalpcs) + parseInt(aEnd);
                }

                if (rcvdPieces < totalpcs) {
                    $(this).parents("tr").find("input[type='text'][id^='tblAwbULDLocation_EndPieces']").val('');
                    $(this).parents("tr").find("input[type='text'][id^='_temptblAwbULDLocation_EndPieces']").val('');
                    ShowMessage("warning", "", "Entered Pieces can not be greater than Received Pieces");
                    return false;
                }
            });
        }
    }
}

function IsValidateDecimalNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&
        (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function ValidateFloatKeyPress(el, evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var number = el.value.split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    if (number.length > 1 && charCode == 46) {
        return false;
    }

    var caratPos = getSelectionStart(el);
    var dotPos = el.value.indexOf(".");
    if (caratPos > dotPos && dotPos > -1 && (number[1].length > 2)) {
        return false;
    }
    return true;
}

function getSelectionStart(o) {
    if (o.createTextRange) {
        var r = document.selection.createRange().duplicate()
        r.moveEnd('character', o.value.length)
        if (r.text == '') return o.value.length
        return o.value.lastIndexOf(r.text)
    } else return o.selectionStart
}

function Numbercheckfun(e, t) {
    $('input[title="PosNo"]').keyup(function () {
        if (e.value.match(/[^a-zA-Z0-9 ]/g)) {
            e.value = e.value.replace(/[^a-zA-Z0-9 ]/g, '');
        }
    });
}

function AmmendShipment(obj, event) {
    if ($("#" + obj.id).is(":checked") == true) {
        $("#" + obj.id).closest("tr").find("td:eq(22) input").prop('disabled', false);
        $("#" + obj.id).closest("tr").find("td:eq(23) input:eq(1)").prop('disabled', false);
        $("#" + obj.id).closest("tr").find("td:eq(24) input:eq(1)").prop('disabled', false);
        $("#Chkamended").closest("tr").find("td:eq(31) input").remove();
        $("#Chkamended").closest("tr").find("td:eq(31)").html("<input type=\"button\" class=\"btn btn-block btn-primary btn-sm\" style=\"cursor:pointer\" value=\"Save\" onclick=\"SaveULDDetails(this)\" />")
    }
    else {
        $("#" + obj.id).closest("tr").find("td:eq(22) input").prop('disabled', true);
        $("#" + obj.id).closest("tr").find("td:eq(23) input:eq(1)").prop('disabled', true);
        $("#" + obj.id).closest("tr").find("td:eq(24) input:eq(1)").prop('disabled', true);
        $("#Chkamended").closest("tr").find("td:eq(31) input").remove();
        $("#Chkamended").closest("tr").find("td:eq(31)").html("<input type=\"button\" class=\"btn btn-block btn-success btn-sm \"  value=\"Arr- LI\" style=\"cursor: not-allowed;\" disabled=\"true\"  style=\"cursor: not-allowed;\" disabled=\"true\"/>")
    }
}

function WriteRemarks(awbno, obj, event) {
    var remarks = obj.value;
    var kcheck = 0;
    if ($('input[id*="' + obj.id + '"]').length > 1) {
        if (arrayOfValuesForMessage.length > 0) {
            var Array = {
                AWBSno: awbno,
                PosNo: remarks,
            };

            for (var i = 0; i < arrayOfValuesForMessage.length; i++) {
                if (arrayOfValuesForMessage[i].PosNo == remarks && arrayOfValuesForMessage[i].AWBSno != awbno) {
                    $('input[id*="' + obj.id + '"]').val('')
                    ShowMessage('warning', 'Warning', "PosNo should be uniqe according AWBNo.");

                    for (var p = arrayOfValuesForMessage.length - 1; p >= 0; --p) {
                        if (arrayOfValuesForMessage[p].AWBSno == awbno) {
                            arrayOfValuesForMessage.splice(p, 1);
                        }
                    }
                    kcheck = 1;
                    break;
                }
            }

            if (kcheck != 1) {
                for (var p = arrayOfValuesForMessage.length - 1; p >= 0; --p) {
                    if (arrayOfValuesForMessage[p].AWBSno == awbno) {
                        arrayOfValuesForMessage.splice(p, 1);
                    }
                }
                arrayOfValuesForMessage.push(Array);
                $('input[id*="' + obj.id + '"]').val(remarks);
            }
        }
    }
    else {
        var Array = {
            AWBSno: awbno,
            PosNo: remarks,
        };

        if (remarks == "") {
            for (var i = arrayOfValuesForMessage.length - 1; i >= 0; --i) {
                if (arrayOfValuesForMessage[i].AWBSno == awbno) {
                    arrayOfValuesForMessage.splice(i, 1);
                }
            }
            kcheck = 2
        }

        if (arrayOfValuesForMessage.length > 0) {
            if (kcheck != 2) {
                for (var i = 0; i < arrayOfValuesForMessage.length; i++) {
                    if (arrayOfValuesForMessage[i].PosNo == remarks && arrayOfValuesForMessage[i].AWBSno != awbno) {
                        $('input[id*="' + obj.id + '"]').val('')
                        ShowMessage('warning', 'Warning', "PosNo should be uniqe according AWBNo.");

                        for (var p = arrayOfValuesForMessage.length - 1; p >= 0; --p) {
                            if (arrayOfValuesForMessage[p].AWBSno == awbno) {
                                arrayOfValuesForMessage.splice(p, 1);
                            }
                        }
                        kcheck = 1;
                        break;
                    }
                }

                if (kcheck != 1) {
                    for (var j = 0; j < arrayOfValuesForMessage.length; j++) {
                        if (arrayOfValuesForMessage[j].PosNo != remarks && arrayOfValuesForMessage[j].AWBSno != awbno) {
                            for (var p = arrayOfValuesForMessage.length - 1; p >= 0; --p) {
                                if (arrayOfValuesForMessage[p].AWBSno == awbno) {
                                    arrayOfValuesForMessage.splice(p, 1);
                                }
                            }
                            arrayOfValuesForMessage.push(Array);
                            break;
                        }

                        if (arrayOfValuesForMessage[j].PosNo != remarks && arrayOfValuesForMessage[j].AWBSno == awbno) {

                        }
                    }
                }
            }
        }

        if (arrayOfValuesForMessage.length == 0) {
            arrayOfValuesForMessage.push(Array);
        }
    }
}

function IsValidateNumber(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    catch (err) {

    }
}

//---------------- ULD Report ---------------
function GetULDReport(obj, FFMFlightMasterSNo) {
    if (FFMFlightMasterSNo == "" || FFMFlightMasterSNo == "0")
        ShowMessage('warning', 'Warning - FC Report', "Record not found.");
    else
        window.open("HtmlFiles/Import/ULDReport.html?FFMFlightMasterSNo=" + FFMFlightMasterSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
}

//------------- Pomail ULD Report Added by Akaram Ali on 09 Dec 2017 ---------------
function GetPOMailULDReport(obj, FFMFlightMasterSNo, POMULDCount) {
    if (FFMFlightMasterSNo == "" || FFMFlightMasterSNo == "0")
        ShowMessage('warning', 'Warning - FC Report', "Record not found.");
    else
        window.open("HtmlFiles/Import/ULDReport.html?FFMFlightMasterSNo=" + FFMFlightMasterSNo + "&POMULDCount=" + POMULDCount + "&LogoURL=" + userContext.SysSetting.LogoURL);
}

function GetAviOFLDGrossWeight(obj) {
    var grosswt = $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val();
    $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val(isNaN(grosswt) ? 0 : parseFloat(grosswt).toFixed(1));
    var hdnbulkvalue = $(obj).closest("tr").find("#ffmpiecesvalue").text();
    var hdnvalue = $(obj).closest("tr").find("#txtBulkRecPieces").val();
    var totalgrosswt = $(obj).closest("tr").find("td[data-column='GrossWeight']").text();
    var totalofldgt = $(obj).closest("tr").find("td[data-column='OFLDGrossWeight']").text();
    var grosswtcheck = $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val();
    var totalpieces = $(obj).closest("tr").find("td[data-column='TotalPieces']").text();
    var totalavilabegrossweight = parseFloat(totalgrosswt) - parseFloat(totalofldgt)
    var avggrosswt = 0;
    totalgrosswt = parseFloat(totalgrosswt) - parseFloat(totalofldgt)
    if (grosswtcheck == "0.0") {
        ShowMessage('warning', 'Warning - Inbound Flight', "Offload Gross weight can't be zero.");
        avggrosswt = ((parseFloat(totalgrosswt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
        $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val(isNaN(avggrosswt) ? 0 : avggrosswt.toFixed(1));
        return;
    }

    if (grosswtcheck != "0.0") {
        if (parseInt(hdnvalue) == parseInt(hdnbulkvalue) && parseFloat(grosswtcheck) > parseFloat(totalgrosswt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload Gross weight can't be more than or equal to total gross weight.");
            avggrosswt = ((parseFloat(totalgrosswt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val(isNaN(avggrosswt) ? 0 : avggrosswt.toFixed(1));
        }

        if (parseInt(hdnvalue) < parseInt(hdnbulkvalue) && parseFloat(grosswtcheck) >= parseFloat(totalgrosswt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload Gross weight can't be more than or equal to total gross weight.");
            avggrosswt = ((parseFloat(totalgrosswt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val(isNaN(avggrosswt) ? 0 : avggrosswt.toFixed(1));
        }

        if (parseInt(hdnvalue) == parseInt(hdnbulkvalue) && parseFloat(grosswtcheck) < parseFloat(totalgrosswt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload Gross weight can't be less than to total gross weight.");
            avggrosswt = ((parseFloat(totalgrosswt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val(isNaN(avggrosswt) ? 0 : avggrosswt.toFixed(1));
        }
    }
}

//volume
function GetAviOFLDVolumeWeight(obj) {
    var volwt = $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val();
    $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val(isNaN(volwt) ? 0 : parseFloat(volwt).toFixed(2));


    var hdnbulkvalue = $(obj).closest("tr").find("#ffmpiecesvalue").text();
    var hdnvalue = $(obj).closest("tr").find("#txtBulkRecPieces").val();
    var totalvolwt = $(obj).closest("tr").find("td[data-column='VolumeWeight']").text();
    var totalofldvolwt = $(obj).closest("tr").find("td[data-column='OFLDVolumeWeight']").text();
    var volumewtcheck = $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val();
    var totalpieces = $(obj).closest("tr").find("td[data-column='TotalPieces']").text();
    var totalavilabevolumeweight = parseFloat(totalvolwt) - parseFloat(totalofldvolwt)
    var avgvolwt = 0;
    totalvolwt = parseFloat(totalvolwt) - parseFloat(totalofldvolwt)

    if (volumewtcheck == "0.00") {
        ShowMessage('warning', 'Warning - Inbound Flight', "Offload Volume weight can't be zero.");
        avgvolwt = ((parseFloat(totalvolwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
        $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val(isNaN(avgvolwt) ? 0 : avgvolwt.toFixed(2));
        return;
    }

    if (volumewtcheck != "0.00") {
        if (parseInt(hdnvalue) == parseInt(hdnbulkvalue) && parseFloat(volumewtcheck) > parseFloat(totalvolwt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload Volume weight can't be more than or equal to total Volume Weight.");
            avgvolwt = ((parseFloat(totalvolwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val(isNaN(avgvolwt) ? 0 : avgvolwt.toFixed(2));
        }

        if (parseInt(hdnvalue) < parseInt(hdnbulkvalue) && parseFloat(volumewtcheck) >= parseFloat(totalvolwt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload Volume Weight can't be more than or equal to total Volume Weight.");
            avgvolwt = ((parseFloat(totalvolwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val(isNaN(avgvolwt) ? 0 : avgvolwt.toFixed(2));
        }

        if (parseInt(hdnvalue) == parseInt(hdnbulkvalue) && parseFloat(volumewtcheck) < parseFloat(totalvolwt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload Volume weight can't be less than to total Volume Weight.");
            avgvolwt = ((parseFloat(totalvolwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val(isNaN(avgvolwt) ? 0 : avgvolwt.toFixed(2));
        }
    }
}

function GetAviOFLDCBM(obj) {
    var cbmwt = $(obj).closest("tr").find("#txtAviOFLDCBM").val();
    $(obj).closest("tr").find("#txtAviOFLDCBM").val(isNaN(cbmwt) ? 0 : parseFloat(cbmwt).toFixed(3));

    var hdnbulkvalue = $(obj).closest("tr").find("#ffmpiecesvalue").text();
    var hdnvalue = $(obj).closest("tr").find("#txtBulkRecPieces").val();
    var totalcbmwt = $(obj).closest("tr").find("td[data-column='CBMWeight']").text();
    var totalofldcbmwt = $(obj).closest("tr").find("td[data-column='OFLDCBM']").text();
    var cbmwtcheck = $(obj).closest("tr").find("#txtAviOFLDCBM").val();
    var totalpieces = $(obj).closest("tr").find("td[data-column='TotalPieces']").text();
    var totalavilabecbmweight = parseFloat(totalcbmwt) - parseFloat(totalofldcbmwt)
    var avgcbmwt = 0;
    totalcbmwt = (parseFloat(totalcbmwt) - parseFloat(totalofldcbmwt)).toFixed(3)

    if (cbmwtcheck == "0.000") {
        ShowMessage('warning', 'Warning - Inbound Flight', "Offload CBM can't be zero.");
        avgcbmwt = ((parseFloat(totalcbmwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
        $(obj).closest("tr").find("#txtAviOFLDCBM").val(isNaN(avgcbmwt) ? 0 : avgcbmwt.toFixed(3));
        return;
    }

    if (cbmwtcheck != "0.000") {
        if (parseInt(hdnvalue) == parseInt(hdnbulkvalue) && parseFloat(cbmwtcheck) > parseFloat(totalcbmwt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload CBM can't be more than or equal to total CBM.");
            avgcbmwt = ((parseFloat(totalcbmwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDCBM").val(isNaN(avgcbmwt) ? 0 : avgcbmwt.toFixed(3));
        }

        if (parseInt(hdnvalue) < parseInt(hdnbulkvalue) && parseFloat(cbmwtcheck) >= parseFloat(totalcbmwt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload CBM can't be more than or equal to total CBM.");
            avgcbmwt = ((parseFloat(totalcbmwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDCBM").val(isNaN(avgcbmwt) ? 0 : avgcbmwt.toFixed(3));
        }

        if (parseInt(hdnvalue) == parseInt(hdnbulkvalue) && parseFloat(cbmwtcheck) < parseFloat(totalcbmwt)) {
            ShowMessage('warning', 'Warning - Inbound Flight', "Offload CBM can't be less than to total CBM.");
            avgcbmwt = ((parseFloat(totalcbmwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))
            $(obj).closest("tr").find("#txtAviOFLDCBM").val(isNaN(avgcbmwt) ? 0 : avgcbmwt.toFixed(3));
        }
    }
}

function GetRecPieces(obj) {
    var hdnbulkvalue = $(obj).closest("tr").find("#ffmpiecesvalue").text();
    var hdnvalue = $(obj).closest("tr").find("#txtBulkRecPieces").val();
    var totalgrosswt = $(obj).closest("tr").find("td[data-column='GrossWeight']").text();
    var totalvolwt = $(obj).closest("tr").find("td[data-column='VolumeWeight']").text();
    var totalcbmwt = $(obj).closest("tr").find("td[data-column='CBMWeight']").text();
    var totalpieces = $(obj).closest("tr").find("td[data-column='TotalPieces']").text();
    var totalofldgt = $(obj).closest("tr").find("td[data-column='OFLDGrossWeight']").text();
    var totalofldvolwt = $(obj).closest("tr").find("td[data-column='OFLDVolumeWeight']").text();
    var totalofldcbmwt = $(obj).closest("tr").find("td[data-column='OFLDCBM']").text();

    $(obj).closest("tr").find("#textrecpiecesvalue").val(hdnvalue);
    recpcsvalue = $(obj).closest("tr").find("#textrecpiecesvalue").val();

    var spanffmpiecesvalue = $(obj).closest("tr").find("#ffmpiecesvalue").text();
    if (parseInt(hdnvalue) == 0) {
        ShowMessage('warning', 'Warning - Inbound Flight', "Offload Pieces can't be zero.");
        $(obj).closest("tr").find("#txtBulkRecPieces").val($(obj).closest("tr").find("#ffmpiecesvalue").text());
        $(obj).closest("tr").find("#textrecpiecesvalue").val($(obj).closest("tr").find("#ffmpiecesvalue").text());
        return;
    }

    if (parseInt(hdnvalue) > parseInt(hdnbulkvalue)) {
        ShowMessage('warning', 'Warning - Inbound Flight', "Offload Pieces can not be greater than Receive Pieces.");
        $(obj).closest("tr").find("#txtBulkRecPieces").val($(obj).closest("tr").find("#ffmpiecesvalue").text());
        $(obj).closest("tr").find("#textrecpiecesvalue").val($(obj).closest("tr").find("#ffmpiecesvalue").text());
        return;
    }

    totalgrosswt = parseFloat(totalgrosswt) - parseFloat(totalofldgt)
    var avggrosswt = ((parseFloat(totalgrosswt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))

    totalvolwt = parseFloat(totalvolwt) - parseFloat(totalofldvolwt)
    var avgvolwt = ((parseFloat(totalvolwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))

    totalcbmwt = parseFloat(totalcbmwt) - parseFloat(totalofldcbmwt)
    var avgcbmwt = ((parseFloat(totalcbmwt) / parseInt(hdnbulkvalue)) * parseInt(hdnvalue))

    $(obj).closest("tr").find("#txtAviOFLDGrossWeight").val(isNaN(avggrosswt) ? 0 : avggrosswt.toFixed(1));
    $(obj).closest("tr").find("#txtAviOFLDVolumeWeight").val(isNaN(avgvolwt) ? 0 : avgvolwt.toFixed(2));
    $(obj).closest("tr").find("#txtAviOFLDCBM").val(isNaN(avgcbmwt) ? 0 : avgcbmwt.toFixed(3));
}

function GetFAReceivedPieces(obj, ffmPieces) {
    if (isNaN(parseInt($(obj).val()))) {
        $(obj).val('');
        return;
    }

    var CCADetailsCheckval = false;
    var awbNo = $(obj).closest("tr").find("td[data-column='AWBNo']").text();
    var shdesc = $(obj).closest("tr").find("td[data-column='LoadDetails']").text();

    //start
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetCCADetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AwbNo: awbNo, DailyFlightSNo: currentDailyFlightSno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData1 = Data.Table1;
            if (resData.length > 0) {
                CCADetailsCheckval = true;
            }
        },
    });
    //END

    if (CCADetailsCheckval == false) {
        if ($(obj).val() > ffmPieces) {
            var retVal = confirm("Received pieces exceeding the total pieces. Are you sure, you want to continue ?");
            if (retVal == true)
                $(obj).val($(obj).val());
            else
                $(obj).val(ffmPieces);
        }
        else {
            $(obj).val($(obj).val());
        }

        var tGWt = $(obj).closest("tr").find("#txtGrossWt").val();
        var tvwt = $(obj).closest("tr").find("#txtVolumeWeighthidden").val();
        if ($(obj).val() == '') {
            $(obj).val('');
            $(obj).closest("tr").find("#txtActualGrossWt").val("");
            ShowMessage('warning', 'Warning', "Received pieces not found.");
            return;
        }

        var gWT = parseFloat((parseFloat(tGWt) / parseInt(ffmPieces)) * parseInt($(obj).val())).toFixed(2);
        var gvwt = parseFloat((parseFloat(tvwt) / parseInt(ffmPieces)) * parseInt($(obj).val())).toFixed(2);
        $(obj).closest("tr").find("#txtActualGrossWt").val("");
        $(obj).closest("tr").find("#txtActualGrossWt").val(isNaN(gWT) ? 0 : gWT);
        $(obj).closest("tr").find("#txtVolumeWeight").val("");
        $(obj).closest("tr").find("#txtVolumeWeight").val(isNaN(gvwt) ? 0 : gvwt);
    }
    else {
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/GetCCADetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AwbNo: awbNo, DailyFlightSNo: currentDailyFlightSno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;
                if (resData.length > 0) {
                    var resItem = resData[0];
                    RevisedPcs = resItem.RevisedPcs;
                    RevisedWt = resItem.RevisedWt;
                    ReviseVolWt = resItem.ReviseVolWt;
                    aviShpCount = resData1[0].aviShpCount;
                    arrivedPcs = resData1[0].arrivedPcs;
                    ArrivedWt = resData1[0].ArrivedWt;
                    ArrivedVolWt = resData1[0].ArrivedVolWt;

                    if (shdesc == 'T') {
                        var tGWt = RevisedWt;
                        var tvWt = ReviseVolWt;
                        if ($(obj).val() == '') {
                            $(obj).val('');
                            $(obj).closest("tr").find("#txtActualGrossWt").val("");
                            ShowMessage('warning', 'Warning', "Received pieces not found.");
                            return;
                        }

                        var gWT = parseFloat((parseFloat(tGWt) / parseInt(RevisedPcs)) * parseInt($(obj).val())).toFixed(2);
                        $(obj).closest("tr").find("#txtActualGrossWt").val("");
                        $(obj).closest("tr").find("#txtActualGrossWt").val(isNaN(gWT) ? 0 : gWT);

                        var gvWT = parseFloat((parseFloat(tvWt) / parseInt(RevisedPcs)) * parseInt($(obj).val())).toFixed(2);
                        $(obj).closest("tr").find("#txtVolumeWeight").val("");
                        $(obj).closest("tr").find("#txtVolumeWeight").val(isNaN(gvWT) ? 0 : gvWT);
                    }
                    else {
                        var tGWt = $(obj).closest("tr").find("#txtGrossWt").val();
                        var tvWt = $(obj).closest("tr").find("#txtRecVolumeWeight").val();

                        if ($(obj).val() == '') {
                            $(obj).val('');
                            $(obj).closest("tr").find("#txtActualGrossWt").val("");
                            $(obj).closest("tr").find("#txtVolumeWeight").val("");
                            ShowMessage('warning', 'Warning', "Received pieces not found.");
                            return;
                        }

                        if (aviShpCount == "1") {
                            if (parseInt(RevisedPcs) - parseInt(arrivedPcs) == parseInt($(obj).val())) {
                                var gWT = parseFloat(parseFloat(RevisedWt) - parseFloat(ArrivedWt)).toFixed(2);
                                $(obj).closest("tr").find("#txtActualGrossWt").val("");
                                $(obj).closest("tr").find("#txtActualGrossWt").val(isNaN(gWT) ? 0 : gWT);

                                var gvWT = parseFloat(parseFloat(ReviseVolWt) - parseFloat(ArrivedVolWt)).toFixed(2);
                                $(obj).closest("tr").find("#txtVolumeWeight").val("");
                                $(obj).closest("tr").find("#txtVolumeWeight").val(isNaN(gvWT) ? 0 : gvWT);
                            }
                            else {
                                var gWT = parseFloat((parseFloat(tGWt) / parseInt(ffmPieces)) * parseInt($(obj).val())).toFixed(2);
                                $(obj).closest("tr").find("#txtActualGrossWt").val("");
                                $(obj).closest("tr").find("#txtActualGrossWt").val(isNaN(gWT) ? 0 : gWT);

                                var gvWT = parseFloat((parseFloat(tvWt) / parseInt(ffmPieces)) * parseInt($(obj).val())).toFixed(2);
                                $(obj).closest("tr").find("#txtVolumeWeight").val("");
                                $(obj).closest("tr").find("#txtVolumeWeight").val(isNaN(gvWT) ? 0 : gvWT);
                            }
                        }
                        else {
                            var gWT = parseFloat((parseFloat(tGWt) / parseInt(ffmPieces)) * parseInt($(obj).val())).toFixed(2);
                            $(obj).closest("tr").find("#txtActualGrossWt").val("");
                            $(obj).closest("tr").find("#txtActualGrossWt").val(isNaN(gWT) ? 0 : gWT);

                            var gvWT = parseFloat((parseFloat(tvWt) / parseInt(ffmPieces)) * parseInt($(obj).val())).toFixed(2);
                            $(obj).closest("tr").find("#txtVolumeWeight").val("");
                            $(obj).closest("tr").find("#txtVolumeWeight").val(isNaN(gvWT) ? 0 : gvWT);
                        }
                    }
                }
            },
        });
    }
}

//----------------- Show subprocess details of fligh checkIn & subprocess of flight arrival ------------------------------------//
function ShowProcessDetails(subprocess, isdblclick) {
    if (currentprocess == "FC" && _CURR_PRO_ == "InboundFlight") {
        _CURR_PRO_ = "FlightArrival";
        _CURR_OP_ = "Flight Arrival";
        subprocess = "FlightArrivalFlightInformation";
    }
    else if (currentprocess == "FC" && isdblclick == "AddShipment") {
        _CURR_PRO_ = "FlightArrival";
        _CURR_OP_ = "Flight Arrival";
        subprocess = "FlightArrivalFlightInformation";
    }

    var model = {
        processName: _CURR_PRO_,
        moduleName: 'Import',
        appName: subprocess,
        Action: 'New',
        IsSubModule: 1,
    }
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetWebForm", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: model }),
        success: function (result) {
            if (_CURR_PRO_ == "FlightArrival") {
                $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                $("#divContent").html(divContentAppend);
                $("#divContent").after("<div id='divStopOverFlightInformation' style='width: 100%;'></div");
                $("#divContent").before("<div id='divDetail2'></div>");
                InitializePage("FlightArrivalFlightInformation", 'divContent');
                InitializePage("StopOverFlightInformation", 'divStopOverFlightInformation');
                cfi.AutoCompleteV2("AircraftType", "AircraftType", "ImportInbound_AircraftType", OnSelectAircraftType, "contains");
                cfi.AutoCompleteV2("Vendor", "Name", "ImportInbound_Vendor", null, "contains");

                if (currentCargoClassification == 4) {
                    $("#Text_Vendor").data("kendoAutoComplete").enable(true);
                    //added by Bhupendra Singh Bhandari as discuss with Madhav sir
                    $("#TruckScheduleNo").prop('disabled', true);
                    $("#TruckScheduleNo").css("cursor", "not-allowed");
                    $("#TruckDate").data("kendoDatePicker").enable(false);
                    $("#TruckDate").css("cursor", "not-allowed");
                    //end

                    $("#AircraftType").closest("td").next().html("<font style='color: rgb(255, 0, 0);'></font>Truck Plate No.");
                    $("#AircraftType").closest("td").next().attr("title", "Enter Truck Plate No. ");
                }
                else {
                    $("#Text_Vendor").data("kendoAutoComplete").enable(false);
                    $("#TruckScheduleNo").prop('disabled', true);
                    $("#TruckScheduleNo").css("cursor", "not-allowed");
                    $("#TruckDate").data("kendoDatePicker").enable(false);
                    $("#TruckDate").css("cursor", "not-allowed");
                    $("#AircraftType").closest("td").next().html("<font>&nbsp;&nbsp;&nbsp;</font>Aircraft Registration No.");
                    $("#AircraftType").closest("td").next().attr("title", "Enter Aircraft Registration No.");
                }

                GetFlightArrivalGrid();
                var model = {
                    processName: _CURR_PRO_,
                    moduleName: 'Import',
                    appName: 'FlightArrivalStopOverShipment',
                    FFMFlightMasterSNo: currentFFMFlightMasterSNo
                }

                $.ajax({
                    url: "Services/Import/InboundFlightService.svc/GetFlightArrivalShipmentGrid", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8", data: JSON.stringify({ model: model }),
                    success: function (result) {
                        $("#divStopOverFlightInformation").html(result);
                        $("#divStopOverFlightInformation").find(".datepicker").kendoDatePicker({
                            format: "dd-MMM-yyyy",
                            value: new Date()
                        });
                    }
                });

                if (userContext.SysSetting.IsMultipleSelectionOnArrival.toUpperCase() == 'TRUE') {
                    $("#chkAll").show();
                    $("#btnArrive").show();
                }
                else {
                    $("#chkAll").hide();
                    $("#btnArrive").hide();
                }

            }
            else {
                $("#divAfterContent").html(result);
                if (result != undefined || result != "") {
                    InitializePage(subprocess, "divAfterContent", isdblclick);
                    $("#Validate").addClass("btn-info");
                }
            }
        }
    });
}

var IsRFSAircraftType;
function OnSelectAircraftType(e) {
    $("#Text_Vendor").val("");
    $("#Vendor").val("");
    var AircraftTypeSNo = $("#AircraftType").val();
    if (AircraftTypeSNo != undefined || AircraftTypeSNo != "") {
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/GetAircraftType", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AircraftTypeSNo: AircraftTypeSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    if (resData[0].CargoClassification == "4") {
                        $("#Text_Vendor").data("kendoAutoComplete").enable(true);

                        //added by Bhupendra Singh Bhandari as discuss with Madhav sir
                        $("#TruckScheduleNo").prop('disabled', true);
                        $("#TruckScheduleNo").css("cursor", "not-allowed");
                        $("#TruckScheduleNo").val($("span#FlightNo").text());
                        $("#TruckDate").data("kendoDatePicker").enable(false);
                        $("#TruckDate").css("cursor", "not-allowed");
                        $("#TruckDate").data("kendoDatePicker").value($("span#FLIGHTDATE").text());
                        //end

                        $("#AircraftType").closest("td").next().html("<font style='color: rgb(255, 0, 0);'>*</font>Truck Plate No.");
                        $("#AircraftType").closest("td").next().attr("title", "Enter Truck Plate No. ");
                        IsRFSAircraftType = resData[0].CargoClassification;
                        $.ajax({
                            url: "Services/Import/InboundFlightService.svc/GetCurrentATATime", async: false, type: "POST", dataType: "json", cache: false,
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                var Data = jQuery.parseJSON(result);
                                var resData = Data.Table0;
                                if (resData.length > 0) {
                                    if ($("#ATA").prop('disabled') == false)
                                        $("#ATA").val(resData[0].CurrentTime);
                                }
                            }
                        });
                    }
                    else {
                        $("#Text_Vendor").data("kendoAutoComplete").enable(false);
                        $("#TruckScheduleNo").prop('disabled', true);
                        $("#TruckScheduleNo").css("cursor", "not-allowed");
                        $("#TruckScheduleNo").val("");//added by Bhupendra
                        $("#TruckDate").data("kendoDatePicker").enable(false);
                        $("#TruckDate").css("cursor", "not-allowed");
                        $("#TruckDate").data("kendoDatePicker").value("");//added by Bhupendra
                        $("#AircraftType").closest("td").next().html("<font>&nbsp;&nbsp;&nbsp;</font>Aircraft Registration No.");
                        $("#AircraftType").closest("td").next().attr("title", "Enter Aircraft Registration No.");
                    }
                    currentCargoClassification = resData[0].CargoClassification;
                }
            }
        });
    }
}

function GetFlightArrivalGrid() {
    var model = {
        processName: 'FlightArrival',
        moduleName: 'Import',
        appName: 'FlightArrivalShipment',
        FFMFlightMasterSNo: currentFFMFlightMasterSNo
    }

    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetFlightArrivalShipmentGrid", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: model }),
        success: function (result) {
            $("#divFlightArrivalDetails").html(result);
            $("#divFlightArrivalDetails").find(".datepicker").kendoDatePicker({
                format: "dd-MMM-yyyy",
                value: new Date()
            });

            if ($("#lblGrWt").length === 0)
                $("#_tempGrossWeight").before("<lable id='lblGrWt'>Gross Wt: </label>");

            if ($("#lblTruckScheduleNo").length === 0)
                $("#TruckScheduleNo").before("<lable id='lblTruckScheduleNo' style='font-weight:bold;'>Truck Schedule No: </label>");

            if ($("#lblVolWt").length === 0)
                $("#_tempVolumeWeight").before("<label id='lblVolWt'>Volume Wt: </label>");

            if ($("#lblIsNil").length === 0 && userContext.SysSetting.ClientEnvironment.toUpperCase() != 'JT')
                $("#CustomRefNo").before("<lable id='lblcustomrefno' style='font-weight:bold;'>Custom Ref No :</label>");

            $("#IsNil").after("<lable id='lblIsNil'>NIL</label>");
            $("#ATA").closest("td").prev().find("font").text("*").css("color", "red");

            if ($("#lblATA").length === 0)
                $("#ATA").before("<lable id='lblATA' style='font-weight:bold;'>ATA: </label>");

            if ($("#lblVendor").length === 0)
                $("#Vendor").before("<lable id='lblVendor' style='font-weight:bold;'>Vendor: </label>");

            if ($("#lblFlightType").length === 0)
                $("span#FLIGHTDATE").after("<label id='lblFlightType' style='font-weight:bold;margin-left: 90px;'>Flight Classification: </label>");
        }
    });

    if (userContext.SysSetting.IsMultipleSelectionOnArrival.toUpperCase() == 'TRUE') {
        $("#chkAll").show();
        $("#btnArrive").show();
        IsAllShipmentArrived();
    }
    else {
        $("#chkAll").hide();
        $("#btnArrive").hide();
    }
}

//-------------- Back ---------------------------------------//
function GoBack() {
    cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
    navigateUrl('Default.cshtml?Module=Import&Apps=InboundFlight&FormAction=INDEXVIEW&IsBack=True');
}

//--------------------- Bind flight information for flight checkin ----------------------------------//
function BindFlightInfo() {
    var DailyFlightSno = (currentDailyFlightSno == "" ? 0 : currentDailyFlightSno);
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetFlightArrivalFlightInformation?DailyFlightSno=" + DailyFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData1 = Data.Table1;
            if (resData.length > 0) {
                var resItem = resData[0];
                $("span#FlightNo").html(resItem.FlightNo);
                $("span#Origin").html(resItem.OriginAirport);
                $("span#FLIGHTDATE").html(resItem.FlightDate);
                $("#ATA").val(resItem.ATA);
                $("#ArrivalDate").data("kendoDatePicker").value(resItem.ArrivalDate);

                tempATA = (resItem.ATA == "" || resItem.ATA == undefined) ? "" : resItem.ATA;
                tempArrivalDate = (resItem.ArrivalDate == "" || resItem.ArrivalDate == undefined) ? "" : resItem.ArrivalDate;

                if (tempATA == "") {
                    var dt = GetUserCurrentUTCTime("L");
                    var date_components = dt.split(" ");
                    $("#ArrivalDate").data("kendoDatePicker").value(date_components[0]);
                    $("#ATA").val(date_components[1].substring(0, 5))
                    tempATA = $("#ATA").val();
                }

                $("#AircraftRegistrationNo").val(resItem.RegistrationNo);
                $("#Vendor").val(resItem.VendorAccountSNo);
                $("#Text_Vendor").val(resItem.Vendor);
                $("#_tempGrossWeight").val(resItem.GrossWeight);
                $("input[name=GrossWeight]").val(resItem.GrossWeight);
                $("#_tempVolumeWeight").val(resItem.VolumeWeight);
                $("input[name=VolumeWeight]").val(resItem.VolumeWeight);
                $("#AircraftType").val(resItem.AirCraftSNo);
                $("#Text_AircraftType").val(resItem.AircraftType);
                $("#IsATAEnable").val(resItem.IsATAEnable);
                $("#hdnFFMDetais").val(resItem.FFMText);
                $('#CustomRefNo').val(resItem.CustomRefNo);

                if (resItem.CargoClassification == "1") {
                    $('input[name=FlightType][data-radioval=FREIGHTER]').attr('checked', true);
                }
                else if (resItem.CargoClassification == "2") {
                    $('input[name=TruckSource][data-radioval=PAX]').attr('checked', true);
                }
                else {
                    $('input[name=TruckSource][data-radioval=PAX]').attr('checked', true);
                }

                $("#TruckDate").data("kendoDatePicker").value(resItem.TruckDate);
                $("#TruckScheduleNo").val(resItem.TruckScheduleNo);

                if (resItem.IsFlightClosed == "1") {
                    if (userContext.SpecialRights.ADS == true) {
                        $("#AddShipment").removeAttr("disabled");
                    }
                    else {
                        $("#AddShipment").prop('disabled', true);
                    }
                    if (resData1.length == 0) {
                        $("#CloseFlight").prop('disabled', true);
                    }
                }
                else {
                    $("#CloseFlight").removeAttr("disabled");
                }

                if (resItem.IsArrived == "True") {
                    $("#SaveFlightDetails").prop('disabled', true);
                }

                currentCargoClassification = resItem.CargoClassification;
                if (currentCargoClassification == 4) {
                    $("#Text_AircraftType").prop('disabled', true).css("cursor", "not-allowed")
                }

                if (resItem.IsATAEnable == "0") {
                    $("#ATA").prop('disabled', true);
                    $("#ATA").css("cursor", "not-allowed");
                }
                else {
                    $("#ATA").prop('disabled', false);
                    $("#ATA").css("cursor", "auto");
                    $("#ArrivalDate").data("kendoDatePicker").enable(true);
                    $("#ArrivalDate").css("cursor", "auto");
                }

                if (resItem.ATA != "") {
                    $("#ATA").prop('disabled', true);
                    $("#ATA").css("cursor", "not-allowed");
                    $("#ArrivalDate").data("kendoDatePicker").enable(false);
                    $("#ArrivalDate").css("cursor", "not-allowed");
                }

                if (resItem.IsNil == "True") {
                    $("#IsNil").prop('disabled', true);
                    $("#IsNil").css("cursor", "not-allowed");
                    $("#IsNil").prop('checked', true);
                    if ($("#IsNil").is(':checked')) {
                        $("#AddShipment").prop('disabled', true);
                        $("#AddShipment").css("cursor", "not-allowed");
                    }
                    else {
                        $("#AddShipment").prop('disabled', false);
                        $("#AddShipment").css("cursor", "pointer");
                    }
                }
                else {
                    if (currentFFMFlightMasterSNo > 0) {
                        $("#IsNil").prop('disabled', true);
                        $("#IsNil").css("cursor", "not-allowed");
                    }
                    else {
                        $("#IsNil").prop('disabled', false);
                        $("#IsNil").css("cursor", "auto");
                    }
                }

                if (userContext.SpecialRights.ADSP == false) {
                    $("#AddShipment").prop('disabled', true);
                    $("#AddShipment").css("cursor", "not-allowed");
                }
                else {
                    $("#AddShipment").prop('disabled', false);
                    $("#AddShipment").css("cursor", "pointer");
                }

                if (userContext.SpecialRights.EFADT == false) {
                    $("#ArrivalDate").data("kendoDatePicker").enable(false);
                    $("#ATA").attr("disabled", "disabled");
                }
            }
        },
        error: {
        }
    });

    if (CheckCustomIsDeparted.toUpperCase() == "FALSE") {
        $('#Custom').hide()
    }

    if (CheckCustomCOGAFlightRoute.toUpperCase() == "HIDEBUTTON") {
        $('#Custom').hide()
    }

    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT') {
        $('#Custom').hide();
        $('#CustomRefNo').hide();
    }
}

$(document).on("change", "input[name='IsNil']", function () {
    if (this.checked) {
        $("#AddShipment").prop('disabled', true);
        $("#AddShipment").css("cursor", "not-allowed");
    }
    else {
        $("#AddShipment").prop('disabled', false);
        $("#AddShipment").css("cursor", "pointer");
    }
});

$(document).on("change", "input[id='Chkamended']", function () {

});

$(document).on("change", "input[name='chkThroughULD']", function () {
    var IsChecked = this.checked ? "1" : "0";
    var chMessage = IsChecked == "1" ? ("Are you sure you want to convert the ULD as a Through ULD?") : ("Are you sure you want to break a Through ULD?");
    var chSuccessMessage = IsChecked == "1" ? ("ULD marked as Through successfully.") : ("ULD removed as Through successfully.");
    var ThroughULDFFMShipmentTransSNo = $(this).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();
    var ThroughULDNo = $(this).closest("tr").find("td[data-column='ULDNo']").text();
    if (ThroughULDFFMShipmentTransSNo != "") {
        var retThroughULD = confirm(chMessage);
        if (retThroughULD == true) {
            $.ajax({
                url: "Services/Import/InboundFlightService.svc/UpdateThroughtULDStatus", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ FFMShipmentTransSNo: ThroughULDFFMShipmentTransSNo, ThroughtULD: IsChecked, ULDNo: ThroughULDNo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData[0].Column1 == '0') {
                        ShowMessage('success', 'Success- Through ULD', chSuccessMessage);
                        GetFlightArrivalGrid();
                    }
                }
            });
        }
        else {
            if (IsChecked == "1") {
                $(this).closest("tr").find('input[name=chkThroughULD]').removeAttr("checked");
            }
            else {
                $(this).closest("tr").find('input[name=chkThroughULD]').attr('checked', true);
            }
        }
    }
});

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    var filterTerminal = cfi.getFilter("AND");
    var filterTerminalULD = cfi.getFilter("AND");
    var filterEmbargo1 = cfi.getFilter("OR");
    var filterEmbargo2 = cfi.getFilter("in");

    if (textId == "Text_searchFlightNo") {
        try {
            cfi.setFilter(filterEmbargo, "DestinationAirport", "eq", userContext.AirportCode)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }

    if (textId.indexOf('tblFlight_FlightNo_') >= 0) {
        var Text = textId.replace('Airline', 'HdnAirline');
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $('#' + Text).val()), cfi.autoCompleteFilter(textId);
    }

    if (textId == "tblAddShipment_ULDType_" + textId.split('_')[2]) {
        var EquipmentfilterOR = cfi.getFilter("AND");
        var EquipmentfilterAnd = cfi.getFilter("OR");
        var CurrentCityCodeAND = cfi.getFilter("AND");

        if (userContext.AirportSNo != undefined && userContext.AirportSNo != "" && userContext.AirportSNo != 0) {
            cfi.setFilter(EquipmentfilterAnd, "CurrentAirportSNo", "eq", userContext.AirportSNo);
        }

        if (userContext.CityCode != undefined && userContext.CityCode != "" && userContext.CityCode != 0) {
            cfi.setFilter(CurrentCityCodeAND, "CurrentCityCode", "eq", userContext.CityCode);
        }
        cfi.setFilter(EquipmentfilterOR, "SNo", "eq", 0);

        var EquipmentSNoFilter = cfi.autoCompleteFilter([EquipmentfilterOR, EquipmentfilterAnd, CurrentCityCodeAND]);
        return EquipmentSNoFilter;
    }

    if (textId == "tblFAULDLocation_Location_" + textId.split('_')[2]) {
        cfi.setFilter(filterTerminalULD, "TerminalSno", "eq", userContext.TerminalSNo);
        var OriginCityAutoCompleteFilter222 = cfi.autoCompleteFilter([filterTerminalULD]);
        return OriginCityAutoCompleteFilter222;
    }

    if (textId == "tblAwbULDLocation_AssignLocation_" + textId.split('_')[2]) {
        cfi.setFilter(filterTerminal, "TerminalSno", "eq", userContext.TerminalSNo);
        var OriginCityAutoCompleteFilter22 = cfi.autoCompleteFilter([filterTerminal]);
        return OriginCityAutoCompleteFilter22;
    }

    if (textId == "tblShipmentFlight_FlightNo_" + textId.split('_')[2]) {
        var filter = cfi.getFilter("AND");
        var id = textId;
        cfi.setFilter(filter, "AirlineSNo", "eq", $("#tblShipmentFlight_HdnAirlineName_" + id.split('_')[2]).val());
        cfi.setFilter(filter, "OriginAirportSNo", "eq", $("#tblShipmentFlight_HdnOriginAirport_" + id.split('_')[2]).val());
        cfi.setFilter(filter, "DestinationAirportSNo", "eq", $("#tblShipmentFlight_HdnDestinationAirport_" + id.split('_')[2]).val());
        cfi.setFilter(filter, "FlightDate", "eq", $("#tblShipmentFlight_FlightDate_" + id.split('_')[2]).val());
        return cfi.autoCompleteFilter(filter);
    }

    if (textId == "tblShipmentFlight_OriginAirport_" + textId.split('_')[2]) {
        var filter = cfi.getFilter("AND");
        var id = textId;
        var AirportCode = "";
        if ($("table[id$='tblShipmentFlight']").find("tbody").find("tr").length != 1) {
            $("table[id$='tblShipmentFlight']").find("tbody").each(function (row, tr) {
                AirportCode = (Number(row) + 1 != textId.split('_')[2] ? $(tr).find("input[id^='tblShipmentFlight_OriginAirport_']").data("kendoAutoComplete").value().split("-")[0] : "") + "," + $(tr).find("input[id^='tblShipmentFlight_DestinationAirport']").data("kendoAutoComplete").value().split("-")[0] + (AirportCode == "" ? "" : ",");
            });
        }

        cfi.setFilter(filter, "AirportCode", "notin", AirportCode);
        return cfi.autoCompleteFilter(filter);
    }

    if (textId == "tblShipmentFlight_DestinationAirport_" + textId.split('_')[2]) {
        var filter = cfi.getFilter("AND");
        var id = textId;
        var AirportCode = "";
        if ($("table[id$='tblShipmentFlight']").find("tbody").find("tr").length != 1) {
            $("table[id$='tblShipmentFlight']").find("tbody").each(function (row, tr) {
                AirportCode = $(tr).find("input[id^='tblShipmentFlight_OriginAirport_']").data("kendoAutoComplete").value().split("-")[0] + "," + (Number(row) + 1 != textId.split('_')[2] ? $(tr).find("input[id^='tblShipmentFlight_DestinationAirport']").data("kendoAutoComplete").value().split("-")[0] : "") + (AirportCode == "" ? "" : ",");
            });
        }

        cfi.setFilter(filter, "AirportCode", "notin", AirportCode);
        return cfi.autoCompleteFilter(filter);
    }

    if (textId == "tblAwbULDLocation_SPHC_" + textId.split('_')[2]) {
        var id = textId;
        if (textId.split('_')[0] == "tblAwbULDLocation")
            return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#tblAwbULDLocation_HdnSPHC_" + id.split('_')[2]).val()), filter = cfi.autoCompleteFilter(textId);
    }

    if (textId == "tblAwbULDLocation_HAWB_" + textId.split('_')[2]) {
        arrHAWB = [];
        var arrGroup = [];
        var arrList = [];
        $("#tblAwbULDLocation_HAWB_" + textId.split('_')[2]).closest("table").find("tr[id^='tblAwbULDLocation_Row_']").each(function () {
            if ($(this).find("input[id^='tblAwbULDLocation_HAWB_']").val() != "" && $(this).find("input[id^='tblAwbULDLocation_StartPieces_']").val() != "" && $(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val() != "") {
                var _HAWBNo = $(this).find("input[id^='tblAwbULDLocation_HAWB_']").val();
                var _HousePieces = parseInt(parseInt($(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val()) - parseInt($(this).find("input[id^='tblAwbULDLocation_StartPieces_']").val()) + parseInt(1));
                arrHAWB.push(
                    {
                        HAWBNo: _HAWBNo,
                        HousePieces: _HousePieces
                    });
                if ((arrList.length > 0 && $.inArray(_HAWBNo, arrList) == -1) || arrList.length == 0)
                    arrList.push(

                        _HAWBNo
                    );
            }
        });

        var TotalPcs = 0;
        var str = "";
        var FinalHAWBNo = "";

        if (arrHAWB != null && arrHAWB.length > 0) {
            for (var k = 0; k < arrList.length; k++) {
                {
                    TotalPcs = 0;
                    housePieces1 = 0;
                    for (var i = 0; i < arrHAWB.length; i++) {
                        if (arrList[k] == arrHAWB[i]["HAWBNo"]) {
                            TotalPcs = TotalPcs + parseInt(arrHAWB[i]["HousePieces"]);
                        }
                        var housePieces1 = arrList[k].substring(arrList[k].lastIndexOf('-') + 1, arrList[k].length);
                    }
                    if (TotalPcs == parseInt(housePieces1)) {
                        str = arrList[k] + "," + str;
                    }
                }
            }
        }

        FinalHAWBNo = str.substring(0, str.lastIndexOf(','));
        try {
            cfi.setFilter(filterEmbargo, "AWBSNo", "eq", $("#tblAwbULDLocation_AWBSNo_" + textId.split('_')[2]).val());
            cfi.setFilter(filterEmbargo, "HAWBNo", "notin", FinalHAWBNo);
            var HAWBAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return HAWBAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "tblAwbULDLocation_AssignLocation_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "CityCode", "eq", userContext.CityCode);
            if ($("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "0" && $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val() != "") {
                cfi.setFilter(filterEmbargo, "StartTemperature", "lte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filterEmbargo, "EndTemperature", "gte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filterEmbargo, "StartTemperature", "lte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filterEmbargo, "EndTemperature", "gte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filterEmbargo, "SHCSNo", "in", $("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val());
            }
            else if ($("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "1") {
                cfi.setFilter(filterEmbargo, "SHCSNo", "in", $("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val());
            }
            else if ($("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val() == "") {
                if ($("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "0" && $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val() != "") {
                    cfi.setFilter(filterEmbargo, "StartTemperature", "lte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filterEmbargo, "EndTemperature", "gte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filterEmbargo, "StartTemperature", "lte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filterEmbargo, "EndTemperature", "gte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filterEmbargo, "SHCSNo", "in", $("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val());
                }
                if ($("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "0" && $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val() == "" && $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val() == "") {
                    cfi.setFilter(filterEmbargo, "SHCSNo", "eq", -1);
                }
                if ($("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "1") {
                    cfi.setFilter(filterEmbargo, "SHCSNo", "eq", "0");
                }
            }
            else {
                cfi.setFilter(filterEmbargo, "SHCSNo", "eq", -1);
            }

            var SPHCAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return SPHCAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "tblAwbULDLocation_MovableLocation_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "AirportSNo", "eq", userContext.AirportSNo);
            var MovableAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return MovableAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "tblFAULDLocation_Location_1") {
        try {
            if (IsThroughULD == 0 && IsBUP == 0) {
                cfi.setFilter(filterEmbargo, "LocationTypeSNo", "eq", 6);
                var FAULDLocationAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return FAULDLocationAutoCompleteFilter;
            }
            else {
                cfi.setFilter(filterEmbargo, "LocationTypeSNo", "eq", 2);
                var FAULDLocationAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return FAULDLocationAutoCompleteFilter;
            }
        }
        catch (exp) { }
    }

    if (textId == "Text_AircraftType") {
        try {
            cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("span#FlightNo").text().substring(0, 2))
            var AircraftTypeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return AircraftTypeAutoCompleteFilter2;
        }
        catch (exp) { }
    }

    if (textId == "tblFAConsumable_ConsumablesList_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "CitySno", "eq", userContext.CitySNo);
            var FAConsumableAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return FAConsumableAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_FlightOrigin") {
        try {
            cfi.setFilter(filterEmbargo, "AirportCode", "notin", userContext.AirportCode)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }

    if (textId == "Text_FlightDestination") {
        try {
            cfi.setFilter(filterEmbargo, "AirportCode", "eq", userContext.AirportCode)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }

    if (textId == "Text_Vendor") {
        try {
            cfi.setFilter(filterEmbargo, "AccountTypeName", "in", ("SASV-TRUCK VENDOR,AIRV-TRUCK VENDOR"));
            var VendorAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return VendorAutoCompleteFilter;
        }
        catch (exp) { }
    }
}

//-------------------- Sub process of flight arrival for ULD location, damage, and consumable -----------------//
function InitializePage(subprocess, cntrlid, isdblclick) {
    InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "FlightArrivalFlightInformation".toUpperCase()) {
        BindFlightInfo();
    }

    if (subprocess.toUpperCase() == "StopOverFlightInformation".toUpperCase()) {
    }
}

function ArriveAllShipment() {
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    var retBUPULDVal = confirm("Are you sure, you want to arrive All Shipment?");
    if (retBUPULDVal == false) {
        return
    }

    //$.ajax({
    //    url: "Services/Import/InboundFlightService.svc/GetCCADetails", async: false, type: "POST", dataType: "json", cache: false,
    //    data: JSON.stringify({ AwbNo: awbNo, DailyFlightSNo: currentDailyFlightSno }),
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        var Data = jQuery.parseJSON(result);
    //        var resData = Data.Table0;
    //        var resData1 = Data.Table1;
    //        if (resData.length > 0) {
    //            var resItem = resData[0];
    //            RevisedPcs = resItem.RevisedPcs;
    //            RevisedWt = resItem.RevisedWt;
    //            RevisedVolWt = resItem.ReviseVolWt;
    //            aviShpCount = resData1[0].aviShpCount;
    //            arrivedPcs = resData1[0].arrivedPcs;
    //            ArrivedWt = resData1[0].ArrivedWt;
    //            ArrivedVolWt = resData1[0].ArrivedVolWt;
    //        }
    //    },
    //});

    //if (!CCADetailsCheck) {
    //    $(obj).closest("tr").find("#txtFAMAWBRcdPieces").focus();
    //}

    //if (shdesc == 'T' && CCADetailsCheck == false) {

    //}

    //var dflightSNo = $(obj).closest("tr").find("td[data-column='DailyFlightSNo']").text();
    //var fFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();
    //var uULDNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    //var IsRushHandling = $(obj).closest("tr").find("input[type='checkbox'][id='chkIsRushHandlingTop']:checked").length;
    //var BUPULDDetails = [];
    //var BUPuldData = {
    //    DailyFlightSNo: dflightSNo, FFMFlightMasterSNo: fFlightMasterSNo, ULDNo: uULDNo
    //}

    //BUPULDDetails.push(BUPuldData);
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveAllShipmentDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FFMFlightMasterSNo: currentFFMFlightMasterSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resultData = result.split(",")
            if (resultData[0] == "0") {
                //$(obj).closest("tr").find("td:eq(5)").text(resultData[1]);
                //$(obj).attr("value", "Arrived");
                //$(obj).attr("class", "btn btn-block btn-success btn-sm");
                //$(obj).prop('disabled', true);  /// After Save Arrive Button shows as Disabled
                //$('#selector').css('cursor', 'not-allowed') ///// After Save Arrive Button cursor
                //$("#ATA").prop('disabled', true);
                //$("#ATA").css("cursor", "not-allowed");
                //$(obj).closest("tr").find("td[data-column='SNo']").find("input").css("cursor", "auto").removeAttr("disabled");

                //if ($(obj).closest("table").closest("tr").prev().find("input[type='checkbox'][id='chkThroughULD']").length > 0 && $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkThroughULD']").is(":checked")) {
                //    $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkThroughULD']").closest("td[data-column='IsThroughULD']").text("Yes");
                //}

                ShowMessage('success', 'Success', "Details Saved Successfully");
                $("#chkAll").prop("checked", false);
                $("#btnArrive").prop("disabled", true);
                $("#btnArrive").attr('value', 'Arrived');
                $("#btnArrive").addClass('btn btn-block btn-success btn-sm');

                var shipmentList = document.querySelectorAll('input[onClick="SaveULDDetails(this)"]');

                for (var i = 0; i < shipmentList.length; i++) {
                    $(shipmentList[i]).prop("disabled", true);
                    $(shipmentList[i]).attr('value', 'Arrived');
                    $(shipmentList[i]).addClass('btn btn-block btn-success btn-sm');
                }

                //$(obj).closest("tr").find("input[type='checkbox'][id='chkThroughULD']").attr("disabled", true);

                //if (userContext.SpecialRights.IMPORTSHIP == true) {
                //    $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").html('');
                //    $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").append("<input id='Chkamended' type='checkbox' />");
                //}
                //if ($((obj.parentElement.parentNode)).find("td[data-column='IsamendedvalueTop']").text() == "0") {
                //    $((obj.parentElement.parentNode)).find("td[data-column='IsamendedvalueTop']").text('1');
                //}
            }
            else if (resultData[0] == "1") {
                ShowMessage('warning', 'Warning', "ULD not exist.");
            }
            else
                ShowMessage('warning', 'Warning', "Unable to save data.");
        },
        error: function () {
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}

function SaveBUPULDDetails(obj) {
    $(obj.parentNode.parentNode).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    if ($(obj).closest("tr").find("td[data-column='Isamended']").find('#Chkamended').prop('checked') != true && parseInt($(obj).closest("tr").find("td[data-column='IsamendedvalueTop']").text()) != 0) {
        ShowMessage('warning', 'Warning', "Kindly select Amendment.");
        return;
    }

    if ($(obj).closest("tr").find("input[type='checkbox'][id='ChkamendedTop']").length > 0) {
        if (!$(obj).closest("tr").find("input[type='checkbox'][id='ChkamendedTop']:checked").length > 0) {
            ShowMessage('warning', 'Warning', "Kindly select Amendment.");
            return;
        }
    }

    if ($(obj).closest("tr").find("td[data-column='BreakDownStart']").text() == "+ Add Time") {
        if (parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
            ShowMessage('warning', 'Warning', "Kindly Enter Breakdown Start Time.");
            return;
        }
    }

    if ($(obj).closest("tr").find("td[data-column='BreakDownEnd']").text() == "+ Add Time") {
        if (parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
            ShowMessage('warning', 'Warning', "Kindly Enter Breakdown End Time.");
            return;
        }
    }

    var retBUPULDVal = confirm("Are you sure, you want to arrive ULD?");
    if (retBUPULDVal == false) {
        return
    }

    var dflightSNo = $(obj).closest("tr").find("td[data-column='DailyFlightSNo']").text();
    var fFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();
    var uULDNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    var IsRushHandling = $(obj).closest("tr").find("input[type='checkbox'][id='chkIsRushHandlingTop']:checked").length;
    var BUPULDDetails = [];
    var BUPuldData = {
        DailyFlightSNo: dflightSNo, FFMFlightMasterSNo: fFlightMasterSNo, ULDNo: uULDNo
    }

    BUPULDDetails.push(BUPuldData);
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveBUPULDDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ UldData: BUPULDDetails, IsRushHandling: IsRushHandling }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resultData = result.split(",")
            if (resultData[0] == "0") {
                $(obj).closest("tr").find("td:eq(5)").text(resultData[1]);
                $(obj).attr("value", "Arrived");
                $(obj).attr("class", "btn btn-block btn-success btn-sm");
                $(obj).prop('disabled', true);  /// After Save Arrive Button shows as Disabled
                $('#selector').css('cursor', 'not-allowed') ///// After Save Arrive Button cursor
                $("#ATA").prop('disabled', true);
                $("#ATA").css("cursor", "not-allowed");
                $(obj).closest("tr").find("td[data-column='SNo']").find("input").css("cursor", "auto").removeAttr("disabled");

                if ($(obj).closest("table").closest("tr").prev().find("input[type='checkbox'][id='chkThroughULD']").length > 0 && $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkThroughULD']").is(":checked")) {
                    $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkThroughULD']").closest("td[data-column='IsThroughULD']").text("Yes");
                }

                ShowMessage('success', 'Success', "Details Saved Successfully");
                $(obj).closest("tr").find("input[type='checkbox'][id='chkThroughULD']").attr("disabled", true);

                //Added by rahul on 21-Nov 2017 for through uld chk box disabled on arrival 
                if (userContext.SpecialRights.IMPORTSHIP == true) {
                    $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").html('');
                    $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").append("<input id='Chkamended' type='checkbox' />");
                }
                if ($((obj.parentElement.parentNode)).find("td[data-column='IsamendedvalueTop']").text() == "0") {
                    $((obj.parentElement.parentNode)).find("td[data-column='IsamendedvalueTop']").text('1');
                }
            }
            else if (resultData[0] == "1") {
                ShowMessage('warning', 'Warning', "ULD not exist.");
            }
            else
                ShowMessage('warning', 'Warning', "Unable to save data.");
        },
        error: function () {
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}

//----------------------- Save ULD Details when flight checking ----------------//
function saveArrivedShipment(obj) {
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and Save Flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    if (userContext.TerminalSNo == '0') {
        ShowMessage('warning', 'Warning', "Terminal not assign for current user.");
        return;
    }

    var dflightSNo = $(obj).closest("tr").find("td[data-column='DailyFlightSNo']").text();
    var GroupflightSNo = $(obj).closest("tr").find("td[data-column='GroupFlightSNo']").text();
    var fFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();
    var uNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    var ffmShipmentTrans1 = $(obj).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();
    var arrivedShipmentSNo = $(obj).closest("tr").find("td[data-column='ArrivedShipmentSNo']").text();
    var awbNo = $(obj).closest("tr").find("td[data-column='AWBNo']").text();
    var origin = $(obj).closest("tr").find("td[data-column='ShipmentOriginAirportCode']").text();
    var destination = $(obj).closest("tr").find("td[data-column='ShipmentDestinationAirportCode']").text();
    var commodity = $(obj).closest("tr").find("td[data-column='NatureOfGoods']").text();
    var shc = $(obj).closest("tr").find("td[data-column='SPHC']").text();
    var awbPieces = $(obj).closest("tr").find("td[data-column='Pieces']").text();
    var buildDetails = $(obj).closest("tr").find("td[data-column='LoadDetails']").text();
    var recvdPieces = $(obj).closest("tr").find("#txtFAMAWBRcdPieces").val();
    var recvVolumeweight = $(obj).closest("tr").find("#txtVolumeWeight").val();
    var grossWT = $(obj).closest("tr").find("#txtGrossWt").val();
    var volumeWT = $(obj).closest("tr").find("#txtVolumeWeight").val();
    var piecesGWT = $(obj).closest("tr").find("#txtActualGrossWt").val()
    var volumeGWT = $(obj).closest("tr").find("#txtVolumeWeight").val();
    var remarks = $(obj).closest("tr").find("#txtFAMAWBRemarks").val();
    var PosNo = $(obj).closest("tr").find(('#txtPosNo_"' + awbNo).replace(/[""]/g, '')).val()
    var CCADetailsCheck = true;
    var Isrushhandling = $(obj).closest("tr").find("input[type='checkbox'][id='chkIsRushHandling']:checked").length;
    POMailSNo = parseInt($(obj).closest("tr").find("td[data-column='POMailSNo']").text());
    var POMArrivedShipmentSNo = $(obj).closest("tr").find("td[data-column='POMArrivedShipmentSNo']").text();//Added by akaram on 21 Aug 2017
    var shdesc = $(obj).closest("tr").find("td[data-column='LoadDetails']").text();
    var RevisedPcs = 0;
    var RevisedWt = 0.00;
    var RevisedVolWt = 0.00;
    var aviShpCount = 0;
    var arrivedPcs = 0;
    var ArrivedWt = 0.00;
    var ArrivedVolWt = 0.00;
    var retULDVal = confirm("Are you sure, you want to arrive this ?");
    if (retULDVal == false) {
        return
    }

    cfi.SaveUpdateLockedProcess("0", GroupflightSNo, "", "", userContext.UserSNo, "0", "Inbound Flight", 0, "");
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetCCADetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AwbNo: awbNo, DailyFlightSNo: currentDailyFlightSno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData1 = Data.Table1;
            if (resData.length > 0) {
                var resItem = resData[0];
                RevisedPcs = resItem.RevisedPcs;
                RevisedWt = resItem.RevisedWt;
                RevisedVolWt = resItem.ReviseVolWt;
                aviShpCount = resData1[0].aviShpCount;
                arrivedPcs = resData1[0].arrivedPcs;
                ArrivedWt = resData1[0].ArrivedWt;
                ArrivedVolWt = resData1[0].ArrivedVolWt;
                //var CCADetails = confirm("CCA raised for: " + awbNo + ", Pieces: " + resItem.RevisedPcs + ", Weight: " + resItem.RevisedWt + ", Volume Weight: " + RevisedVolWt);
                //if (CCADetails == true && recvdPieces <= RevisedPcs && grossWT <= RevisedWt) {
                //    CCADetailsCheck = false;
                //    return
                //}

                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                    if (recvdPieces <= RevisedPcs && grossWT <= RevisedWt) {
                        CCADetailsCheck = false;
                    }
                }

                //if (parseInt(recvdPieces) < parseInt(RevisedPcs) || parseFloat(piecesGWT) < parseFloat(RevisedWt) || parseFloat(volumeGWT) < parseFloat(RevisedVolWt)) {
                //    ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + RevisedPcs + ", Weight: " + RevisedWt + ", Volume Weight: " + RevisedVolWt);
                //    return;
                //}
            }
        },
    });

    if (!CCADetailsCheck) {
        $(obj).closest("tr").find("#txtFAMAWBRcdPieces").focus();
    }

    if (shdesc == 'T' && CCADetailsCheck == false) {

    }

    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
        if (shdesc == 'T' && CCADetailsCheck == false) {
            if (parseInt(recvdPieces) < parseInt(RevisedPcs) || parseFloat(piecesGWT) < parseFloat(RevisedWt) || parseFloat(volumeGWT) < parseFloat(RevisedVolWt)) {
                ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + RevisedPcs + ", Weight: " + RevisedWt + ", Volume Weight: " + RevisedVolWt);
                return;
            }
        }
        else if (shdesc == 'T' && CCADetailsCheck == true) {
            if (parseInt(awbPieces) < parseInt(recvdPieces) || parseFloat(grossWT) < parseFloat(piecesGWT) || parseFloat(volumeGWT) < parseFloat(volumeGWT)) {
                ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + recvdPieces + ", Weight: " + piecesGWT + ", Volume Weight: " + volumeGWT);
                return;
            }
        }
        //if ((shdesc == 'T' || shdesc == 'S') && CCADetailsCheck == false) {
        //    if (parseInt(recvdPieces) < parseInt(RevisedPcs) || parseFloat(piecesGWT) < parseFloat(RevisedWt) || parseFloat(volumeGWT) < parseFloat(RevisedVolWt)) {
        //        ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + RevisedPcs + ", Weight: " + RevisedWt + ", Volume Weight: " + RevisedVolWt);
        //        return;
        //    }
        //}
        //else if ((shdesc == 'P' || shdesc == 'D') && CCADetailsCheck == false) {
        //    if (parseInt(recvdPieces) < parseInt(RevisedPcs) || parseFloat(piecesGWT) < parseFloat(RevisedWt) || parseFloat(volumeGWT) < parseFloat(RevisedVolWt)) {
        //        ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + RevisedPcs + ", Weight: " + RevisedWt + ", Volume Weight: " + RevisedVolWt);
        //        return;
        //    }
        //}
        //else if ((shdesc == 'T' || shdesc == 'S') && CCADetailsCheck == true) {
        //    if (parseInt(awbPieces) < parseInt(recvdPieces) || parseFloat(grossWT) < parseFloat(piecesGWT) || parseFloat(volumeGWT) < parseFloat(volumeGWT)) {
        //        ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + recvdPieces + ", Weight: " + piecesGWT + ", Volume Weight: " + volumeGWT);
        //        return;
        //    }
        //}
        //else if ((shdesc == 'P' || shdesc == 'D') && CCADetailsCheck == true) {
        //    if (parseInt(recvdPieces) < parseInt(RevisedPcs) || parseFloat(piecesGWT) < parseFloat(grossWT) || parseFloat(volumeGWT) < parseFloat(volumeWT)) {
        //        ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + recvdPieces + ", Weight: " + piecesGWT + ", Volume Weight: " + volumeGWT);
        //        return;
        //    }
        //}

    }
    //if (shdesc == 'T' && CCADetailsCheck == false) {
    //    if (parseInt(recvdPieces) < parseInt(RevisedPcs) || parseFloat(piecesGWT) < parseFloat(RevisedWt) || parseFloat(volumeGWT) < parseFloat(RevisedVolWt)) {
    //        ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + RevisedPcs + ", Weight: " + RevisedWt + ", Volume Weight: " + RevisedVolWt);
    //        return;
    //    }
    //}

    //if (shdesc != 'T' && aviShpCount == "1" && (parseFloat(recvdPieces) + parseFloat(arrivedPcs)) < parseFloat(RevisedPcs)) {
    //    $(obj).closest("tr").find("#txtFAMAWBRcdPieces").focus();
    //    ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + RevisedPcs + ", Weight: " + RevisedWt + ", Volume Weight: " + RevisedVolWt);
    //    return;
    //}


    //if (shdesc != 'T' && aviShpCount == "1" && (parseFloat(piecesGWT) + parseFloat(ArrivedWt)) < parseFloat(RevisedWt) && (parseFloat(volumeGWT) + parseFloat(ArrivedVolWt)) < parseFloat(RevisedVolWt)) {
    //    $(obj).closest("tr").find("#txtFAMAWBRcdPieces").focus();
    //    ShowMessage("warning", "Warning", "CCA raised for: " + awbNo + ", Pieces: " + RevisedPcs + ", Weight: " + RevisedWt + ", Volume Weight: " + RevisedVolWt);
    //    return;
    //}

    if (recvdPieces == "")
        ShowMessage('warning', 'Warning', "Received pieces can not be left blank.");
    else if (recvVolumeweight == "")
        ShowMessage('warning', 'Warning', "Volume can not be left blank.");
    else {
        var ULDDetails = [];
        var uldData = {
            DailyFlightSNo: dflightSNo, FFMFlightMasterSNo: fFlightMasterSNo, FFMShipmentTransSNo: ffmShipmentTrans1, ULDNo: uNo, AWBNo: awbNo, Origin: origin, Destination: destination, Commodity: commodity, SHC: '1', AWBPieces: awbPieces, BuildDetails: buildDetails, FFM: '', RecvdPieces: recvdPieces, GrossWT: piecesGWT, Remarks: remarks, PosNo: PosNo, IsRushHandling: Isrushhandling, VolumeWeight: volumeWT
        }

        ULDDetails.push(uldData);
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/SaveULDDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ UldData: ULDDetails, ArrivedShipmentSNo: (arrivedShipmentSNo == "") ? 0 : arrivedShipmentSNo, POMailDetailsArray: POMailDetailsArray, POMailSNo: POMailSNo, POMArrivedShipmentSNo: POMArrivedShipmentSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resultData = result.split(",")
                if (resultData[0] == "0") {
                    $(obj).closest("tr").find("td[data-column='ArrivedShipmentSNo']").text(resultData[1]);
                    $(obj).attr("value", "Arrived");
                    $(obj).attr("class", "btn btn-block btn-success btn-sm");
                    $(obj).prop('disabled', true);  /// After Save Arrive Button shows as Disabled
                    $('#selector').css('cursor', 'not-allowed') ///// After Save Arrive Button cursor
                    $("#ATA").prop('disabled', true);
                    $("#ATA").css("cursor", "not-allowed");
                    $("#ArrivalDate").data("kendoDatePicker").enable(false);
                    $("#ArrivalDate").css("cursor", "not-allowed");
                    $(obj).closest("table").closest("tr").prev().find("input[type='button'][value='L']").prop('disabled', false).css("cursor", "auto");
                    $(obj).closest("table").closest("tr").prev().find("input[type='button'][value='D']").prop('disabled', false).css("cursor", "auto");
                    $(obj).closest("table").closest("tr").prev().find("input[type='button'][value='C']").prop('disabled', false).css("cursor", "auto");
                    $(obj).closest("tr").find("input[type='button'][value='E']").prop('disabled', true).css("cursor", "not-allowed").attr('class', '');
                    if ($(obj).closest("table").closest("tr").prev().find("input[type='checkbox'][id='chkThroughULD']").length > 0) {
                        $(obj).closest("table").closest("tr").prev().find("input[type='checkbox'][id='chkThroughULD']").closest("td[data-column='IsThroughULD']").text("No");
                    }

                    if (userContext.SpecialRights.IMPORTSHIP == true) {
                        $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").html('');
                        $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").append("<input id='Chkamended' type='checkbox' />");
                    }

                    if ($((obj.parentElement.parentNode)).find("td[data-column='Isamendedvalue']").text() == "0") {
                        $((obj.parentElement.parentNode)).find("td[data-column='Isamendedvalue']").text('1');
                    }

                    if (resultData[2] == "True") {
                        $("#AddShipment").prop('disabled', true);
                    }
                    else {
                        $("#AddShipment").removeAttr("disabled");
                    }
                    ShowMessage('success', 'Success', "Details Saved Successfully");

                    var rushcheckedval = $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkIsRushHandling']").is(":checked");
                    if (rushcheckedval) {
                        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                            $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkIsRushHandling']").prop('disabled', true);
                        }
                    }
                    var rushawbsno = $(obj).closest("tr").find("td[data-column='AWBSNo']").text();
                    var rushlloopawbso = "";
                    $(obj.parentElement.parentNode).closest("table").closest("tr").closest("tbody").closest("table").closest("tr").find("input[type='checkbox'][id='chkIsRushHandling']").each(function (i, row) {
                        rushlloopawbso = $(row).closest("tr").find("td[data-column='AWBSNo']").text();
                    });
                }
                else if (resultData[0] == "1") {
                    ShowMessage('warning', 'Warning', resultData[1]);
                    return;
                }
                else if (resultData[0] == "500") {
                    ShowMessage('warning', 'Warning', resultData[1]);
                    return;
                }
                else if (resultData[0] == "100") {
                    ShowMessage('warning', 'Warning', 'ULD Stock does not exist. Can not proceed with arrival.');
                    return;
                }
                else
                    ShowMessage('warning', 'Warning', "Unable to save data.");
            },
            error: function () {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        });
        IsAllShipmentArrived();
    }
}

function sendSMS(MobileNo, Message) {
    var MessageURL = "http://203.212.70.200/smpp/sendsms?username=democargohttp&password=cargo123&to=" + MobileNo + "&from=VFirst&udh=&text=" + Message + "&dlr-mask=19&dlr-url";
    $.ajax({
        url: MessageURL, async: false, type: "POST", cache: false,
        contentType: "text/plain; charset=utf-8",
        success: function (result) {

        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - SMS', "unable to process SMS.", "bottom-right");
        }
    });
}

function SaveULDDetails(obj) {
    var checktime = true;
    if ($(obj).closest("tr").find("td[data-column='Isamended']").find('#Chkamended').prop('checked') != true && parseInt($(obj).closest("tr").find("td[data-column='Isamendedvalue']").text()) > 0) {
        ShowMessage('warning', 'Warning', "Kindly select Amendment.");
        return;
    }

    POMailSNo = parseInt($(obj).closest("tr").find("td[data-column='POMailSNo']").text());
    POMailArrivedShipmentSNo = parseInt($(obj).closest("tr").find("td[data-column='POMArrivedShipmentSNo']").text());
    if ($(obj).closest("tr").find("input[type='checkbox'][id='Chkamended']").length > 0) {
        if (!$(obj).closest("tr").find("input[type='checkbox'][id='Chkamended']:checked").length > 0) {
            ShowMessage('warning', 'Warning', "Kindly select Amendment.");
            return;
        }
    }

    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
        if ($(obj).closest("tr").find('input[title="PosNo"]').length > 0) {
            if ($(obj).closest("tr").find('input[title="PosNo"]').prop('disabled') == false) {
                if ($(obj).closest("tr").find('input[title="PosNo"]').val() == '') {
                    ShowMessage('warning', 'Warning', "Kindly enter PosNo.");
                    return;
                }
            }
        }
    }

    var transsno = $(obj).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/getstaartandendtime", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FFMShipmentTransSNo: transsno, DailyFlightSno: currentDailyFlightSno, POMailSNo: POMailSNo, POMailArrivedShipmentSNo: POMailArrivedShipmentSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData[0].BreakdownStartTime == "") {
                if (parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
                    ShowMessage('warning', 'Warning', "Kindly Enter Breakdown Start Time.");
                    checktime = false;
                    return;
                }
            }

            if (resData[0].BreakdownEndTime == "") {
                if (parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
                    ShowMessage('warning', 'Warning', "Kindly Enter Breakdown End Time.");
                    checktime = false;
                    return;
                }
            }
        },
    });

    if (!checktime) {
        return;
    }

    saveArrivedShipment(obj);
}

function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });

    $("#" + containerId).find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });

    $("#" + containerId).find("span").each(function () {
        var attr = $(this).attr('controltype');
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });

    SetDateRangeValue();
    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });

    $("input[name='operation']").click(function () {
        _callBack();
    });

    $("[id$='divRemoveRecord']").hide();
    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            StopProgress();
            return true;
        }
        else {
            return false
        }
    });

    _callBack = function () {
        if ($.isFunction(window.MakeTransDetailsData)) {
            return MakeTransDetailsData();
        }
    }

    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }

    $(".removepopup").click(function () {
        $("#divRemovePanel").show();
        cfi.PopUp("divRemoveRecord", "");
    });

    $(".cancelpopup").click(function () {
        $("#divRemovePanel").hide();
        cfi.ClosePopUp("divRemoveRecord");
    });

    $("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
        var transid = this.id.replace("divareaTrans_", "");
        cfi.makeTrans(transid, null, null, null, null, null, null);
    });
}

//----------------- Div content for inbound flight ----------------------------//
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divInboundFlightDetails' style='width:100%'></div></td></tr></table></div><div id='divDescriptionman'></div>";

//---------------------- Div content for flight arrival -----------------------//
var divContentAppend = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divFlightArrivalDetails' style='width:100%'></div></td></tr></table></div>";

function OpenExclude(FFMFlightMasterSNo, FFMShipmentTransSNo, ArrivedShipmentSNo, awbSNo, obj) {
    DTR = $(obj).closest("tr");
    var AwbNo = $(obj).closest("tr").find("td[data-column='AWBNo']").text();
    $("#divExclude").remove();
    $("#divStopOverFlightInformation").append("<div id='divExclude' validateonsubmit='true' style='overflow:auto;'><table id=tblExclude width='100%' class='WebFormTable'><tr width='100%'><td class='formlabel' width='50%'>AWB No.</td><td class='formlabel' width='50%'><span id='spnAWBNo'></span><input type='hidden' id='AWBSNo' name='AWBSNO' ></td></tr><tr><td class='formlabel' width='50%'><font id=\"ftbillto\" color=\"red\">*</font><span id='spnRemarks'> Remark</span></td><td width='50%' class='formInputcolumn'><textarea class='k-input' name='Remarks' id='Remarks' style='width: 200px;text-transform: uppercase;'  data-valid='required' data-valid-msg='Remarks can not be blank' controltype='alphanumeric' maxlength='150' data-role='alphabettextbox' autocomplete='off'></textarea></td></tr><tr><td colspan='2' class='form2buttonrow' width='100%'><center><input type='button' class='btn btn-success' onclick='SaveExcludeRemarks(" + FFMFlightMasterSNo + "," + FFMShipmentTransSNo + "," + ArrivedShipmentSNo + "," + awbSNo + ")' value='Save'><center></td></tr></table></div>");
    $("#spnAWBNo").text(AwbNo);
    $("#AWBSNo").val(awbSNo);
    cfi.PopUp("divExclude", "Exclude Remarks", 500, null, null, 80);
    $("#divExclude").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $("#tblExclude tbody tr:nth-child(1) td:nth-child(2)").css("text-align", "left");
}

function SaveExcludeRemarks(FFMFlightMasterSNo, FFMShipmentTransSNo, ArrivedShipmentSNo, awbSNo) {
    var remark = $("#Remarks").val();
    if (remark == undefined) {
        ShowMessage("warning", "Warning - Exclude Remarks", "Enter remakrs.");
        return;
    }
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveExcludeRemarks", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FFMFlightMasterSNo: FFMFlightMasterSNo, FFMShipmentTransSNo: FFMShipmentTransSNo, ArrivedShipmentSNo: (ArrivedShipmentSNo == "") ? 0 : ArrivedShipmentSNo, awbSNo: awbSNo, remark: remark }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData[0].Column1 == '0') {
                $("#divExclude").data("kendoWindow").close();
                ShowMessage('success', 'Success - Exclude Remarks', "Remark Saved Successfully");
                GetFlightArrivalGrid();
                DTRIndex = "";
                DTRIndex = $(DTR).parent().parent().parent().parent().parent().parent().closest('tr').prev().index();
            }
            else {
                ShowMessage('warning', 'Warning', "Unable to save data.");
                return;
            }
        },
        error: function () {
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}

function ClearOnChange() {
}

//-----------------------Start Work By Akash (For Custom Button- 29 June 2017)
function SaveCustomFile(obj) {
    //"GA-716";"2017-05-09","4";
    var FlightNo = $("span#FlightNo").text();
    var FlightDate = $("span#FLIGHTDATE").text();
    var FlightOriginSNo = $("span#Origin").text();
    var FlightDestinationSNo = userContext.AirportCode;
    var NoOfTransaction = "1";
    var IsFlightStatus = "IN";
    var CreatedBy = userContext.UserSNo;

    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveAndDownloadCustomFile", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, FlightOriginSNo: FlightOriginSNo, FlightDestinationSNo: FlightDestinationSNo, NoOfTransaction: NoOfTransaction, IsFlightStatus: IsFlightStatus, CreatedBy: CreatedBy }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            if (Data.Table0 != undefined && Data.Table0.length > 0) {
                if (jQuery.parseJSON(result).Table0[0].COGACustomFile == "Message") {
                    ShowMessage('warning', 'warning - COGA', jQuery.parseJSON(result).Table1[0].COGACustomFile, "bottom-right");
                    return
                }

                var resData = "";
                for (var i = 0; i < Data.Table0.length; i++) {
                    resData += Data.Table0[i].COGACustomFile + "\r\n";
                }

                var text = resData;
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                var today = yyyy + dd + mm;
                var COGAFileName = FlightNo.replace('-', '') + '_' + today + '' + ".txt";
                download(COGAFileName, text);
                ShowMessage('success', 'Success - COGA File', "File Downloaded Successfully !!");
            }
            else {
                ShowMessage('warning', 'warning - COGA', 'Record Not Found !', "bottom-right");
            }
        },
    });
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/*******************for PoMAil DN Details ******************/
//adding for POMail Details
var POMailDetailsDiv = '<div id="divPOMailDetails" style="display:none;display: block; overflow: auto;max-height: 300px;" cfi-aria-trans="trans"> <table class="WebFormTable"><tbody><tr><td>POMail No : <b><label id="lblCN38No"></label></b></td><td>Received Piece : <b><label id="lblPlanPcs"></label></b></td></tr><tr><td colspan="3"></td></tr></tbody></table><table class="WebFormTable"><thead><tr><td class="ui-widget-header">Select</td><td class="ui-widget-header">DN Number</td><td class="ui-widget-header">Origin City</td><td class="ui-widget-header">Destination City</td><td class="ui-widget-header">Mail Category</td><td class="ui-widget-header">Sub Category</td><td class="ui-widget-header">Receptacle Number</td><td class="ui-widget-header">Receptacle Weight</td></tr></thead><tbody id ="bodyPOMailDetails"></tbody></table></div>';

var divContentValue = '<div ><input type="hidden" id="hdnProcessType" value="1"><input type="hidden" id="hdnSubProcessType" value="1"><div id="content">' +
    '<div class="rows"> <table style="width: 100%"><tr><td valign="top" class="td100Padding"><div id="divFlightDetails" style="width: 100%"></div></td></tr><tr>' +
    '<td valign="top"><div id="divFltDetails" style="width: 100%"></div></td></tr><tr><td valign="top"><table style="width: 100%"><tr><td style="width: 20%;display:none;"' +
    'valign="top" class="tdInnerPadding"><table class="TTFtable" style="width: 100%; margin: 0px; padding: 0px; display: none;" id="tblFlightAWBInfo"><tr>' +
    '<td class="formSection" colspan="3" style="color: maroon; font-size: 11px; font-weight: bold; border-bottom: #cccccc 1px solid;">Flight Information</td></tr><tr>' +
    '<td>Flight No<input type="hidden" id="hdnFlightSNo" /></td><td>:</td><td id="tdFlightNo"></td></tr><tr><td>Flight Date</td><td>:</td><td id="tdFlightDate"></td>' +
    '</tr><tr><td>Boarding Point</td><td>:</td><td id="tdBoardingPoint"></td></tr><tr><td>End Point</td><td>:</td><td id="tdEndPoint"></td></tr><tr><td>Flight Route</td>' +
    '<td>:</td><td id="tdFlightRoute"></td></tr><tr><td>Booked Gross</td><td>:</td><td id="tdBookedGross"></td></tr><tr><td>Booked Volume</td><td>:</td>' +
    '<td id="tdBookedVolume"></td></tr><tr><td>Booked CBM</td><td>:</td><td id="tdBookedCBM"></td></tr><tr><td>Available Gross</td><td>:</td><td id="tdAvailableGross"></td>' +
    '</tr><tr><td>Available Volume</td><td>:</td><td id="tdAvailableVolume"></td></tr><tr><td>Available CBM</td><td>:</td><td id="tdAvailableCBM"></td></tr><tr>' +
    '<td>Aircraft Type</td><td>:</td><td id="tdAircraftType"></td></tr><!--<tr><td>A/C Regn No</td><td>:</td><td id="tdACRegnNo"></td></tr>--><tr><td>Flight Status</td>' +
    '<td>:</td><td id="tdFlightStatus"></td></tr> </table><!--<table class="TTFtable" style="width: 100%; margin: 0px; padding: 0px; display:none; " id="tblAWBButtonInfo">' +
    '<tr><td class="formSection" colspan="3" style="color: maroon; font-size: 11px; font-weight: bold; border-bottom: #cccccc 1px solid;">Flight Action Information</td>' +
    '</tr><tr><td colspan="2"><br /></td></tr><tr><td><button class="btn btn-info btn-sm" style="width:110px;" id="btnLyingList">Lying List</button></td><td>' +
    '<button class="btn btn-info btn-sm" style="width: 110px;" id="btnViewManifest">View Manifest</button></td><!--<td><button class="btn btn-info btn-sm"' +
    'style="width: 110px;" id="btnOffLoadedCargo">Off-Loaded Cargo</button></td></tr><!--<tr><td colspan="2"><br /></td></tr><tr><td><button ' +
    'class="btn btn-info btn-sm" style="width: 110px;" id="btnBuildupDetails">Build up Details</button></td><td><button class="btn btn-info btn-sm"' +
    'style="width: 110px;" id="btnCreateManifest">Create Manifest</button></td></tr><tr><td colspan="2"><br /></td></tr><tr><td><button class="btn btn-info btn-sm"' +
    'style="width: 110px;" id="btnViewManifest">View Manifest</button></td><td><button class="btn btn-info btn-sm" style="width: 110px;" ' +
    'id="btnCloseFlightFFM">Close Flight/FFM</button></td></tr><tr><td colspan="2"><br /></td></tr></table>--></td><td style="width: 80%;" valign="top"' +
    'class="tdInnerPadding"><div id="dv_FlightManifestPrint" style="display:none"><div class="mfs_rel_wrapper make_relative append_bottom5 clearfix">' +
    '<div class="modify_search noneAll"><div class="modify_top col-md-12 col-sm-12 hidden-xs visible-stb ng-scope"><div class="row"><div class="col-xs-12 col-sm-12">' +
    '<!-- city and country --><a class="col-xs-12 col-sm-12 has_fade" style="padding-left: 2px; padding-right: 2px;"><table id="tblSearch"><tr><td>' +
    '<input type="radio" name="R" id="rbNormal" value="All" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"N") />All &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td><td><input type="radio" name="R" id="rbBulk" value="BULK" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"B") />BULK &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td><td><input type="radio" name="R" id="rbULD" value="ULD" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"U") />ULD &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td><td><input type="radio" name="R" id="rbHSC" value="HSC" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"S") />SHC &nbsp; &nbsp;</td>' +
    '<td>&nbsp;</td>' +
    '<td>&nbsp;</td></tr></table></a></div></div></div></div></div></div><div id="divDetailPrint"><div id="divContentDetail"> <div id="tabstrip"> <ul id="ulTab" style="display:none;"> <li class="k-state-active" id="FirstTab">Loading Instruction Details</li><li id="SecondTab">Lying List</li><li id="OSCTab">Other Station Cargo</li><li id="StackDetailTab" onclick="GetFlightULDSTACKDetails();" >Stack Details</li><li id="FlightStopOverDetailTab" onclick="GetStopOverFlightULDDetails();" >Stop Over Cargo</li><div style="float:right;margin-top:-5px;"><table><tr><td id="tdFlightType" style="display:none;"><input type="radio" data-radioval="Pax" class="" name="Pax" checked="Checked" id="Pax" value="0">PAX <input type="radio" data-radioval="Freighter" class="" name="Pax" id="Pax" value="1">FREIGHTER</td><td id="tdEDIMSG"  ><button style="display:none;" class="btn btn-info btn-sm" id="btnEDIMSG" onclick="GetFlightMSGGrid(this);">Send EDI Message</button></td><td id="tdUWS"><button class="btn btn-info btn-sm" id="btnUWS" onclick="fn_ViewUWSDetails(this);">UWS</button></td><td id="tdCancelLI" style="display:none;"><button class="btn btn-info btn-sm" id="btnCancelLI" onclick="fn_CancelLI(this);">Cancel LI</button></td><td id="tdMoveToLying"><button class="btn btn-info btn-sm" id="btnMoveToLying" onclick="fn_MoveToLying(this);">Move To Lying List</button></td><td id="tdbtnliversion"><button class="btn btn-info btn-sm" id="btnliversion" onclick="fn_liVersion(this);">View LI Version</button></td><td id="tdbtnliRemarks"><button class="btn btn-info btn-sm" id="btnliRemarks" onclick="fn_liRemarks(1);">View LI Remarks</button></td><td id="tdNILManifest"><button class="btn btn-info btn-sm" id="btnNILManifest" onclick="fn_ValidateNILManifest(this);">Transfer/Create NIL Manifest</button></td><td id="tdManRemarks"><Label id="lblManRemarks">ATD Date/Time</Label></td><td id="tdATDDate"><input type="text" class="k-input k-state-default" name="txtATDDate" id="txtATDDate"  controltype="datetype" placeholder="ATD Date"></td><td id="tdATDTime"><input type="text" class="k-input k-state-default" name="txtATDTime" id="txtATDTime"  placeholder="ATD Time"></td><td id="tdManifestRemarks"><a id="btnManifestRemarks" onclick="fn_AddManifestRemarks()" href="#" >Remarks</a> </td><td id="tdregnNo" ><span id="spnRegistrationNo"> Aircraft Regn No.</span></td><td id="tdregnNoTxt"><input type="text" class="k-input" name="RegistrationNo" id="RegistrationNo" style="width: 80px;  text-transform: uppercase;" controltype="alphanumericupper" tabindex="8" maxlength="10" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td><td><button class="btn btn-info btn-sm" id="btn_Print" onclick="fun_PrintByProcess();">Print</button></td><td><button class="btn btn-info btn-sm" id="btnCBV" onclick="fnGetCBV(this);">CBV</button></td><td id="td_sendNtm"><button class="btn btn-info btn-sm" id="btn_SendNtm"  onclick="fun_SendNTM();">Send NTM</button></td><td id="tdIsExcludeFromFFM" style="display:none;" ><input type="checkbox" id="IsExcludeFromFFM"> Exclude Stop Over from FFM</td></tr></table> </div></ul> <div> <div id="divDetail"></div></div><div><div id="divLyingSearch"></div> <div id="divLyingDetail"> </div></div><div><div id="divOSCSearch"></div><div id="divOSCDetail"> </div></div> <div><div id="divStackDetail"></div></div><div><div id="divStopOverDetail"></div></div></div></div> </div> <div id="divDetailPop"></div> <div id="divManifestRemarksPop"></div></div>' + '<div id="divLyingListDetail"></div></td></tr></table></td></tr></table></div></div></div>';

function fn_GetPOMAilDNDetails(input, TotalPcs, MCBookingSNo, ActualGrossWt) {
    var ULDNo = $("#" + input.id).closest("tr").find("td:eq(5)").text();
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/POMailDNInfo", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MCBookingSNo: MCBookingSNo, ULDNo: ULDNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var table = JSON.parse(result);
            $("#divPOMailDetails").remove();
            $("div[id$='divDetail2']").append(POMailDetailsDiv);

            var recvd = $('#txtFAMAWBRcdPieces').val();
            if (recvd < TotalPcs && $("input[type='button'][value='Arrived']").length == 0) {
                cfi.PopUp("divPOMailDetails", "Inbound PO Mail Details", 950, null, null, null);
            }
            else {
                $("#divPOMailDetails").remove();
            }

            $('div[class="k-window-actions k-header"]').hide();
            $('#lblCN38No').text($(input).closest('tr').find('td[data-column="AWBNo"]').text());
            $('#lblPlanPcs').text(TotalPcs);

            $(table.Table0).each(function (row, tr) {
                $("#bodyPOMailDetails").append('<tr>' + '<input type="hidden" id="hdnMCBookingSNo" value=' + tr.MCBookingSNo + '><input type="hidden" id="hdnULDSNo" value=' + tr.ULDStockSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + tr.DailyFlightSNo + '><input type="hidden" id="hdnDNSNo" value=' + tr.DNSNo + '><input type="hidden" id="hdnDNNo" value=' + tr.DNNo + '><input type="hidden" id="hdnMailCategory" value=' + tr.MailCategorySNo + '><input type="hidden" id="hdnSubCategory" value=' + tr.MailSubCategorySNo + '><input type="hidden" id="hdnReceptacleNumber" value=' + tr.ReceptacleNumber + '><input type="hidden" id="hdnReceptacleWeight" value=' + tr.ReceptacleWeight + '><input type="hidden" id="hdnMailHCCode" value=' + tr.Code + '><input type="hidden" id="hdnactulaweight" value=' + ActualGrossWt + '><td class="ui-widget-content"><input type="checkbox" id="chkDNNo" checked=1  ></td><td class="ui-widget-content"><Label id="DNNo">' + tr.DNNo + '</Label></td><td class="ui-widget-content"><Label id="OriginCity">' + tr.OriginCity + '</Label></td><td class="ui-widget-content"><Label id="DestinationCity">' + tr.DestinationCity + '</Label></td><td class="ui-widget-content"><Label id="MailCategory">' + tr.MailCategory + '</Label></td><td class="ui-widget-content"><Label id="SubCategory">' + tr.SubCategory + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleNumber">' + tr.ReceptacleNumber + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleWeight">' + tr.ReceptacleWeight + '</Label></td><td class="ui-widget-content"></td></tr>')
            });

            $("#bodyPOMailDetails").append('<td colspan="8"><input type="button" class="btn btn-block btn-success btn-sm" name="" id="saveDNDetails" style="width:90px;float:right;"value="Save" onclick="SavePoMailDNDetails(' + MCBookingSNo + ',' + $(input).val() + ',' + parseInt($('label#lblPlanPcs').text()) + ')"><input type="button" class="btn btn-block btn-danger btn-sm" name="" id="btnDNSCancel" style="width:90px;float:right;"value="Cancel" onclick=fn_CancelDNDetails(this)></td>');

            $("#bodyPOMailDetails tr").each(function (r, t) {
                $(POMailDetailsArray).each(function (row, n) {
                    if ($(t).find("[id^='hdnDNSNo']").val() == n.DNSNo)
                        $(t).find('input[type=checkbox]').prop('checked', n.isSelect);
                });
            });
        }
    });
}

function fn_CancelDNDetails(input) {
    var planpc = $('#lblPlanPcs').text()
    $('#txtFAMAWBRcdPieces').val(planpc);
    $("#divPOMailDetails").data("kendoWindow").close();
}

function removeValue(Arr, key, value) {
}

var PlanPcs = parseInt($('label#lblPlanPcs').text())
function SavePoMailDNDetails(MCBookingSNo, ULDStockSNo, PlanPcs) {
    var tolpc = 0;
    if ($("#bodyPOMailDetails tr td").find('input:checkbox:checked').length == "0") {
        tolpc = PlanPcs;
    }
    else {
        var tolpc = $("#bodyPOMailDetails tr td").find('input:checkbox:checked').length;
    }

    removeValue(POMailDetailsArray, 'MCBookingSNo', MCBookingSNo);
    var act = $("#bodyPOMailDetails tr").find("[id^='hdnactulaweight']").val();
    var totalactualwt = (act / PlanPcs) * tolpc;
    $('#txtFAMAWBRcdPieces').val(tolpc.toString());
    $('#txtActualGrossWt').val(totalactualwt.toString());

    if ($("#bodyPOMailDetails tr td").find('input:checkbox:checked').length > PlanPcs) {
        ShowMessage('warning', 'Warning - POMail Details  ', "Selected DN should be equal to Plan Piece!", "bottom-right");
    }
    else {
        $("div[id$='divPOMailDetails']").find("[id^='bodyPOMailDetails']").find("tr").each(function () {
            POMailDetailsArray.push({
                isSelect: $(this).find("[id^='chkDNNo']").prop('checked') == true ? 1 : 0,
                POMailSNo: $(this).find("[id^='hdnMCBookingSNo']").val(),
                MailCategorySNo: $(this).find("[id^='hdnMailCategory']").val(),
                MailSubCategorySNo: $(this).find("[id^='hdnSubCategory']").val(),
                DNNo: $(this).find("[id^='hdnDNNo']").val(),
                ReceptacleNumber: $(this).find("[id^='hdnReceptacleNumber']").val(),
                ReceptacleWeight: $(this).find("[id^='hdnReceptacleWeight']").val(),
                MailHCCode: $(this).find("[id^='hdnMailHCCode']").val(),
                ExportDNSNo: $(this).find("[id^='hdnDNSNo']").val(),
            });
        }
        );
        $("#divPOMailDetails").data("kendoWindow").close();
    }
};
//End by Akaram ALI

/// Add By sushant 
function UserSubProcessRights(container, subProcessSNo) {
    var isView = false, IsBlocked = false;
    //get the subprocess view permission
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            isView = e.IsView;
            return;
        }
    });

    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            IsBlocked = e.IsBlocked;
            return;
        }
    });

    if (IsBlocked) {
        $('#' + container).html("")
        $(".btn-success").attr("style", "display:none;");
        $(".btn-danger").attr("style", "display:none;");
        $(".btn-primary").attr("style", "display:none;");
        $(".btn-block").attr("style", "display:none;");

    } else {
        if (isView) {
            $(".btn-success").attr("style", "display:none;");
            $(".btn-danger").attr("style", "display:none;");
            $(".btn-primary").attr("style", "display:none;");
            $(".btn-block").attr("style", "display:none;");
            $("#CloseFlight").hide()
            $('#divFlightArrivalDetails').find('span').attr('onclick', '');

            var nodes = document.getElementById(container).getElementsByTagName('*');
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].disabled = true;
            }
        }
        else {
        }
    }
}
var YesReady = false;
function PageRightsCheckInboundFlight() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Apps.toString().toUpperCase() == "INBOUNDFLIGHT") {

            if (i.Apps.toString().toUpperCase() == "INBOUNDFLIGHT" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "INBOUNDFLIGHT" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "INBOUNDFLIGHT" && i.PageRight == "Delete") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                YesReady = true;
                CheckIsFalse = 1;
                return
            }

        }
    });

    if (YesReady) {
        $('#idAddFlight').hide();
        $('input[value="FC"]').hide();
        $('input[value="E"]').hide();
    }
}

//adding function for showing ffm popup
function showffm(isFor = '') {
    var NogDivFFM = '';
    //ADDING popup for Showing FFM
    if (isFor == 'FFM') {
        NogDivFFM = '<div id="divareaFFM" style="display:none;display: block;" cfi-aria-trans="trans"><center><table style="width:95%;"><tbody id ="showFFMMessage"></tbody></table><tr align="center"><td align="center" colspan="2">&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="closeviewffm();" /></td><td><button class="btn btn-info btn-sm" id="" onclick="CopyText();">Copy</button></td></tr></center></div>'
    }
    else {
        NogDivFFM = '<div id="divareaFFM" style="display:none;display: block;" cfi-aria-trans="trans"><center><table style="width:95%;"><b style="color:red">FFM details are being displayed as per the Manifest.</b><tbody id ="showFFMMessage"></tbody></table><tr align="center"><td align="center" colspan="2">&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="closeviewffm();" /></td><td><button class="btn btn-info btn-sm" id="" onclick="CopyText();">Copy</button></td></tr></center></div>'
    }

    $.ajax({
        url: "Services/Common/CommonService.svc/GenerateCIMPMessage", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MessageType: "FFM", SerialNo: "", SubType: "", flightNumber: $("#__tblflightarrivalflightinformation__").find("#FlightNo").text(), flightDate: $("#__tblflightarrivalflightinformation__").find("#FLIGHTDATE").text(), OriginAirport: $("#__tblflightarrivalflightinformation__").find("#Origin").text(), isDoubleSignature: false, version: "7", nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: "-99" }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var NoOfMsgSeq = result.GenerateCIMPMessageResult.split('@')[0];
            var buttonHTML = '';
            if (NoOfMsgSeq > 1) {
                var NoOfMsgSeq = result.GenerateCIMPMessageResult.split('@')[0];
                var FFMMessage = result.GenerateCIMPMessageResult.split('@')[1];
                buttonHTML = '<tr style="float:left;">';
                for (i = 1; i <= NoOfMsgSeq; i++) {
                    buttonHTML = buttonHTML + '<td><input type="button" value="' + i + '" id="btn' + i + '" onclick="GetFFMBySeq(' + i + ');" ></td>';
                }
                buttonHTML = buttonHTML + '</tr>';
                $("#divareaFFM").remove();
                $("div[id$='divbody']").append(NogDivFFM);

                $("#showFFMMessage").html('<thead>' + buttonHTML + '<tr><td><textarea readonly id="txtFFMMessage" style="height:auto;min-width:490%; min-height:280px; width:auto; height:180px;overflow-y:auto;">' + FFMMessage + '</textarea></td></tr><tr></tr><tr><td colspan="2">&nbsp;</td></tr></thead>')


                $('#btn1').addClass("completeprocess");
            }
            else {
                var NoOfMsgSeq = result.GenerateCIMPMessageResult.split('@')[0];
                $("#divareaFFM").remove();
                $("div[id$='divbody']").append(NogDivFFM);

                $("#showFFMMessage").html('<thead>' + buttonHTML + '<tr><td><textarea readonly id="txtFFMMessage" style="height:auto;min-width:490%; min-height:280px; width:auto; height:180px;overflow-y:auto;">' + NoOfMsgSeq + '</textarea></td></tr><tr></tr><tr><td colspan="2">&nbsp;</td></tr></thead>')


            }

            cfi.PopUp("divareaFFM", "FFM", 880, null, null, null);
        }
    });


}

function GetFFMBySeq(SeqNo) {
    $.ajax({
        url: "Services/Common/CommonService.svc/GenerateCIMPMessage", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MessageType: "FFM", SerialNo: "", SubType: "", flightNumber: $("#__tblflightarrivalflightinformation__").find("#FlightNo").text(), flightDate: $("#__tblflightarrivalflightinformation__").find("#FLIGHTDATE").text(), OriginAirport: $("#__tblflightarrivalflightinformation__").find("#Origin").text(), isDoubleSignature: false, version: "8", nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: SeqNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $('#txtFFMMessage').text(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);

        }
    });

    $('input[type=button][id*=btn]').removeClass("completeprocess");
    $('input[type=button][id=btn' + SeqNo + ']').addClass("completeprocess");

}
function closeviewffm() {
    $("#divareaFFM").data("kendoWindow").close();


}
//copy to clipboard function
function CopyText() {
    if (copyToClipboard(document.getElementById("showFFMMessage"))) {
        ShowMessage('success', '', 'Text copied to the clipboard');
    }
    else
        ShowMessage('warning', '', "Can't copy");
}

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
function isFFMOrNot(isFor) {
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/IsFFMOrNot",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ flightNo: $("#__tblflightarrivalflightinformation__").find("#FlightNo").text(), flightDate: $("#__tblflightarrivalflightinformation__").find("#FLIGHTDATE").text() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var parsedResult = JSON.parse(result);

            if (parsedResult != undefined && parsedResult.Table0[0].IsFFM == 'True') {
                if (isFor == 'FFM') {
                    showffm('FFM');
                }
                else if (isFor == 'MAN') {
                    GetManifestReportData(currentDailyFlightSno, 'N', 'FFM')
                }
            }
            else {
                if (isFor == 'FFM') {
                    showffm('');
                }
                else if (isFor == 'MAN') {
                    GetManifestReportData(currentDailyFlightSno, 'N', '')
                }
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}
function IsAllShipmentArrived() {
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/IsAllShipmentArrived",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FFMFlightMasterSNo: currentFFMFlightMasterSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var tempResult = JSON.parse(result);
            if (tempResult.Table0[0].allShipmentArrived == 1) {
                $("#btnArrive").prop("disabled", true);
                $("#btnArrive").attr('value', 'Arrived');
                $("#btnArrive").addClass('btn btn-block btn-success btn-sm');
            }
            else {
                $("#btnArrive").prop("disabled", false);
                $("#btnArrive").attr('value', 'Save');
                $("#btnArrive").addClass('btn btn-block btn-primary btn-sm');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
