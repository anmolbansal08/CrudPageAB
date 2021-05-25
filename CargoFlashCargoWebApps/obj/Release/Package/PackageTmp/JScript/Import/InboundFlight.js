/// <reference path="../../Scripts/references.js" />

var currentDailyFlightSno = "";
var currentFFMFlightMasterSNo = "";
var currentULDNo = "";

$(document).ready(function () {
    SearchInboundFlight();
    var _CURR_PRO_ = "InboundFlight";

    $("#tblAwbULDLocation_btnAppendRow").live("click", function () {
        //var prevRow = $("table tr[id^='tblAwbULDLocation_Row_']").last().prev().attr("id").split('_')[2];
        //if ($("#tblAwbULDLocation_MovableLocation_" + prevRow).val() == "" && $("#tblAwbULDLocation_AssignLocation_" + prevRow).val() == undefined)
        //{
        //    $("#tblAwbULDLocation_HdnAssignLocation_" + prevRow).attr("required", "required").css("cursor", "not-allowed");
        //    $("#tblAwbULDLocation_AssignLocation_" + prevRow).attr("required", "required").css("cursor", "not-allowed");
        //}
        //else {
        //    $("#tblAwbULDLocation_HdnAssignLocation_" + prevRow).removeAttr("required").css("cursor", "auto");
        //    $("#tblAwbULDLocation_AssignLocation_" + prevRow).removeAttr("required").css("cursor", "auto");
        //}

        $("#tblAwbULDLocation_btnRemoveLast").show();
        GetTempreatureControlled();
        //$("#tblAwbULDLocation_AssignLocation_1").focus();
    });

    $("#tblAddShipment_btnAppendRow").live("click", function () {
        var lastRow = $("table tr[id^='tblAddShipment_Row_']").last().attr("id").split('_')[2];
        var prevRow = $("table tr[id^='tblAddShipment_Row_']").last().prev().attr("id").split('_')[2];

        //if ($("tblAddShipment_PartSplitTotal_'" + prevRow + "  option:selected").val() == "Select") {
        //    ShowMessage("warning", "Warning - Add Shipment", "Select Build/Load");
        //}

        $("#tblAddShipment").find("input[id^='tblAddShipment_AWBNumber']").each(function () {
            var ind = $(this).attr('id').split('_')[2];

            //if ($("#tblAddShipment_BULKOrULD_" + ind + " option:selected").val() == 'BULK') {
            //    $("input[id*='tblAddShipment_ULDType_" + ind + "']").val("");
            //    $("input[id*='tblAddShipment_ULDType_" + ind + "']").val("BULK");
            //    $("input[id*='tblAddShipment_ULDType_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
            //    $("#tblAddShipment_ULDType_" + ind).prop('disabled', true);
            //}
            //else {
            //    $("input[id*='tblAddShipment_ULDType_" + ind + "']").val("");
            //    $("input[id*='tblAddShipment_ULDType_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
            //    $("#tblAddShipment_ULD_" + ind).removeAttr('disabled');
            //}

            //if (($("table tr[id^='tblAddShipment_Row_']").find("select[id='tblAddShipment_PartSplitTotal_" + ind + "'] option:selected").val() == $("select[id='tblAddShipment_PartSplitTotal_" + lastRow + "'] option:selected").val()) &&
            //($("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_AWBNumber_" + ind + "']").val() == $("input[id='tblAddShipment_AWBNumber_" + lastRow + "']").val()) && ($("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_AWBPrefix_" + ind + "']").val() == $("input[id='tblAddShipment_AWBPrefix_" + lastRow + "']").val()))
            //{
            //    $("select[id='tblAddShipment_PartSplitTotal_" + prevRow + "'] option:selected").focus();
            //    $("table tr[id^='tblAddShipment_Row_']").last().remove();
            //    return false;
            //}


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
                //if ($("#tblAddShipment_ULDType_" + lastRow).val() == "BULK")
                //    $("#tblAddShipment_ThroughULD_" + lastRow).prop('disabled', true).css("cursor", "not-allowed");
                //else
                //    $("#tblAddShipment_ThroughULD_" + lastRow).prop('disabled', false).css("cursor", "auto");
            }
            else {
                $("#tblAddShipment_HdnULDType_" + lastRow).val(0);
                $("#tblAddShipment_ULDType_" + lastRow).val('BULK');
                $("#tblAddShipment_ULDType_" + lastRow).data("kendoAutoComplete").enable(true);
                $("#tblAddShipment_SerialNo_" + lastRow).prop('disabled', true);
                $("#_temptblAddShipment_SerialNo" + lastRow).prop('disabled', true);
                $("#tblAddShipment_OwnerCode_" + lastRow).prop('disabled', true);
                $("#_temptblAddShipment_OwnerCode" + lastRow).prop('disabled', true);
                //if ($("#tblAddShipment_ULDType_" + lastRow).val() == "BULK")
                //    $("#tblAddShipment_ThroughULD_" + lastRow).prop('disabled', true).css("cursor", "not-allowed");
                //else
                //    $("#tblAddShipment_ThroughULD_" + lastRow).prop('disabled', false).css("cursor", "auto");

            }
        });


        //$("table tr[id^='tblAddShipment_Row_']").each(function () {
        //    var ind1 = $(this).attr('id').split('_')[2];
        //    if ($("table tr[id^='tblAddShipment_Row_']").length > 2 && $("select[id='tblAddShipment_PartSplitTotal_" + prevRow + "'] option:selected").val() != "S")
        //        if (($("table tr[id^='tblAddShipment_Row_']").find("select[id='tblAddShipment_PartSplitTotal_" + ind1 + "'] option:selected").val() == $("select[id='tblAddShipment_PartSplitTotal_" + prevRow + "'] option:selected").val()) &&
        //           ($("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_AWBNumber_" + ind1 + "']").val() == $("input[id='tblAddShipment_AWBNumber_" + prevRow + "']").val()) && ($("table tr[id^='tblAddShipment_Row_']").find("input[id='tblAddShipment_AWBPrefix_" + ind1 + "']").val() == $("input[id='tblAddShipment_AWBPrefix_" + prevRow + "']").val())) {

        //            var msgErr1;
        //            if ($("select[id='tblAddShipment_PartSplitTotal_" + prevRow + "'] option:selected").val() == 'T')
        //                msgErr1 = 'Total';
        //            if ($("select[id='tblAddShipment_PartSplitTotal_" + prevRow + "'] option:selected").val() == 'P')
        //                msgErr1 = 'Part';

        //            ShowMessage('warning', 'Need your Kind Attention!', msgErr1 + ' pieces already exist for ' + $("input[id='tblAddShipment_AWBPrefix_" + prevRow + "']").val() + '-' + $("input[id='tblAddShipment_AWBNumber_" + prevRow + "']").val());

        //            $("table tr[id^='tblAddShipment_Row_']").last().remove();
        //        }
        //});
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

    // Hide Remove button on consumables
    //$("#tblFAConsumable_btnRemoveLast").live("click", function () {
    //    $("#tblFAConsumable").find("input[id^='tblFAConsumable_Quantity']").each(function () {
    //        if ($('#tblFAConsumable tr').index() == 1)
    //            $("#tblFAConsumable_btnRemoveLast").hide();
    //        else
    //            $("#tblFAConsumable_btnRemoveLast").show();
    //    });
    //});


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
});

function OffloadedStopOverULDAndShipment(DailyFlightSNo, FFMFlightMasterSNo, FFMShipmentTransSNo) {
    if (FFMShipmentTransSNo != undefined || FFMShipmentTransSNo != '') {
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/OffloadedStopOverULDAndShipment", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DailyFlightSNo: DailyFlightSNo, FFMFlightMasterSNo: FFMFlightMasterSNo, FFMShipmentTransSNo: FFMShipmentTransSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData[0].Column1 == '0') {
                    ShowMessage('success', 'Success - Stopover Offloaded', "Offloaded successfully.");
                }
            }
        });
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
    //var DivId = div; // get div id.
    //var textboxid = textboxid; // get textbox id.
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
                $(this).closest('tr').find("input[process='FC']").attr("class", "incompleteprocess")
                ; $(this).closest('tr').find("input[process='FLIGHTASSIGNTEAM']").attr("class", "incompleteprocess");

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
}

function AddFlight() {
    if ($("#tblAddFlight").length === 0) {
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblAddFlight'><tr><td><input type='hidden' name='AirlineCarrierCode' id='AirlineCarrierCode' value=''></td><td><input id='Text_AirlineCarrierCode' width='130px' name='Text_AirlineCarrierCode' placeholder='Carrier Code' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;'  data-role='autocomplete' autocomplete='off'></td><td><input type='text' name='txtFlightNo' id='txtFlightNo' placeholder='Flight No' maxlength='5' style='text-transform:uppercase;'></td><td><input type='text' controltype='datetype' id='txtFlightdate' class='flightdatepicker' width='130px' /></td><td><input type='text' class='timePicker' id='txtETATime' placeholder='STA'  /></td><td><input type='hidden' name='FlightOrigin' id='FlightOrigin' value=''></td><td><input id='Text_FlightOrigin' width='130px' name='Text_FlightOrigin' controltype='autocomplete' onSelect='return CheckAddFlightOrgDest(this);' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' placeholder='Origin' autocomplete='off'></td><td><input type='hidden' name='FlightDestination' id='FlightDestination' value=''></td><td><input id='Text_FlightDestination' width='130px' name='Text_FlightDestination' onSelect='return CheckAddFlightOrgDest(this);' placeholder='Destination' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;'  data-role='autocomplete' autocomplete='off'></td><td colspan='4' align='center'><input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='SaveFlightDetails(this);' /></td></tr></table>");

        //<td><input type='text' class='timePicker' id='txtETATime' placeholder='STA'  /></td>

        cfi.AutoComplete("AirlineCarrierCode", "CarrierCode", "Airline", "CarrierCode", "CarrierCode", ["CarrierCode"], null, "contains");
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

        cfi.AutoComplete("FlightOrigin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);
        cfi.AutoComplete("FlightDestination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);

        //$("#txtFlightdate").find(".datepicker").kendoDatePicker({
        //    format: "dd-MMM-yyyy",
        //    value: new Date()
        //});
    }
    $("#txtFlightNo").val("");
    $("#Text_AirlineCarrierCode").val("");
    $('#txtFlightdate').data("kendoDatePicker").value("");
    $("#FlightOrigin").val("");
    $("#Text_FlightOrigin").val("");
    $("#FlightDestination").val("");
    $("#Text_FlightDestination").val("");
    $("#txtETATime").data("kendoTimePicker").value("");

    $("#txtFlightNo").on("blur", function (e) {
        if ($("#txtFlightNo").val().length < 3) {
            $("#txtFlightNo").val("");
            ShowMessage('warning', 'Need your Kind Attention!', "Flight No. should be minimum 3 character.");
        }

    });

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
        } else {
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
//------------------------------------------------------------------------------//
// Get Inbound flight search page
//------------------------------------------------------------------------------//
function SearchInboundFlight() {
    _CURR_PRO_ = "InboundFlight";
    _CURR_OP_ = "Inbound Flight";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divInboundFlightDetails").html("");

    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/InboundFlight/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);

            $("#searchFromDate").change(function () {
                ValidateDate();
            });

            $("#searchToDate").change(function () {
                ValidateDate();
            });

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            //------------------------------------------------------------------------------//
            // Inbound flight search
            //------------------------------------------------------------------------------//
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

            $('#searchFromDate').data("kendoDatePicker").value("");
            //$('#searchToDate').data("kendoDatePicker").value("");
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

//------------------------------------------------------------------------------//
// Inbound flight search
//------------------------------------------------------------------------------//
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
    if (_CURR_PRO_ == "InboundFlight") {
        cfi.ShowIndexView("divInboundFlightDetails", "Services/Import/InboundFlightService.svc/GetGridData/" + _CURR_PRO_ + "/Import/INBOUNDFLIGHT/" + SearchAirlineCarrierCode + "/" + SearchBoardingPoint + "/" + searchFromDate + "/" + searchToDate + "/" + StartTime.replace(':', '-') + "/" + EndTime.replace(':', '-') + "/" + SearchFFMRcvd + "/" + SearchQRT + "/" + SearchSHCDGR + "/" + SearchTransitFlight + "/" + SearchFlightNo.trim() + "/" + SearchConnectingFlights + "/" + SearchFilterULDCounts + "/" + SearchFilterMCT + "/" + SearchFStatus);
        $("#divInboundFlightDetails").find("tr:eq(1)").remove();
    }
}

//function MarkSelected(input) {   
//    //$(input).prop('checked', false);
//    $(input).closest('form').find(':checkbox').each(function (i, val) {
//        if (val.id == 'chkIsShipmentArrived') {
//            if (val.id == 'chkIsShipmentArrived') {
//                if ($(input).parent().parent().find('input:checkbox:first').prop("checked") == false) {
//                    $(val).prop('checked',false)
//                }
//                else {
//                    $(val).prop('checked', true)
//                }
//            }
//        }
//        //alert(i);
//       // alert(val);
//    });
//}

//------------------------------------------------------------------------------//
// Inbound Flight Grid Operation
function GetInboundFlightDetails(obj, FFMFlightMasterSNo) {
    _CURR_PRO_ = "InboundFlightInformation";
    _CURR_OP_ = "Inbound Flight Information";
    currentFFMFlightMasterSNo = FFMFlightMasterSNo;
    $("#divInboundFlightInformation").html("");
    $("#divInboundFlightULDInformation").html(""); // for rebind uld information
    $("#divInboundFlightDetails").after("<div id='divInboundFlightInformation' style='width: 100%;'></div");
    if (_CURR_PRO_ == "InboundFlightInformation") {
        cfi.ShowIndexView("divInboundFlightInformation", "Services/Import/InboundFlightService.svc/GetInboundFlightInformationGrid/InboundFlightInformation/Import/InboundFlightInformation/" + currentFFMFlightMasterSNo);
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
        cfi.ShowIndexView("divInboundFlightULDInformation", "Services/Import/InboundFlightService.svc/GetInboundFlightULDInformationGrid/InboundFlightULDInformation/Import/InboundFlightULDInformation/" + currentFFMFlightMasterSNo);
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
        cfi.ShowIndexView("divInboundFlightULDInformation", "Services/Import/InboundFlightService.svc/GetInboundFlightULDInformationGrid/InboundFlightULDInformation/Import/InboundFlightULDInformation/" + currentULDNo);
    }
}

//------------------------------------------------------------------------------//
// Get Inbound flight ULD info on popup window
//------------------------------------------------------------------------------//
function GetInboundFlightULDInfo(obj, FFMFlightMasterSNo) {
    _CURR_PRO_ = "InboundFlightULDInfo";
    _CURR_OP_ = "ULD Details";
    currentFFMFlightMasterSNo = FFMFlightMasterSNo;
    if ($("#divInboundFlightULDInfo").length === 0)
        $("#divInboundFlightULDInformation").after("<div id='divInboundFlightULDInfo' style='width: 100%;'></div");
    if (_CURR_PRO_ == "InboundFlightULDInfo") {
        cfi.ShowIndexView("divInboundFlightULDInfo", "Services/Import/InboundFlightService.svc/GetInboundFlightULDInfoGrid/InboundFlightULDInfo/Import/InboundFlightULDInfo/" + currentFFMFlightMasterSNo);
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

//------------------------------------------------------------------------------//
// FC Report
//------------------------------------------------------------------------------//
function GetFCReport(obj, DailyFlightSNo) {
    if (DailyFlightSNo == "" || DailyFlightSNo == "0")

        ShowMessage('warning', 'Warning - FC Report', "Record not found.");
    else


        if ($((obj.parentElement.parentNode)).find("td[data-column='IsFlightClosed'] span").text() == "1")
        {
            window.open("HtmlFiles/Import/FCReport/FCReport.html?DailyFlightSNo=" + DailyFlightSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);

        }
        else
        {

            ShowMessage('warning', 'Warning - FC Report', "Flight Not Closed.");
        }



       
}

//------------------------------------------------------------------------------//
// Save Flight Details
//------------------------------------------------------------------------------//
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

//------------------------------------------------------------------------------//
// Add Shipment Details
//------------------------------------------------------------------------------//
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
        tableColumns: 'SNo,AWBNo,AWBOrigin,AWBDestination,ULD,TotalPieces,GrossWeight,VolumeWeight,SPHC,NatureOfGoods,ArrivedPcs,        ArrivedGrossWt,ArrivedCBM,ShipmentRemarks',
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
        {
            name: 'DivAWBNo', display: '', type: 'div', isRequired: true, ctrlCss: { width: '150px' }, divElements:
            [
                     {
                         divRowNo: 1, name: 'PartSplitTotal', display: 'Build/Load', type: 'select', ctrlOptions: { '-1': 'Select', 'T': 'Total', 'P': 'Part', 'S': 'Split', 'D': 'Divided' },
                         ctrlCss: { width: '70px', height: '20px', color: '#9d331d', 'font-weight': 'bold' }, ctrlAttr: { onBlur: "CheckBuildLoad(this);" }, onChange: function (evt, rowIndex) {
                             var ind = evt.target.id.split('_')[2];
                             $("input[id='tblAddShipment_AWBPrefix_" + ind + "']").val("");
                             $("input[id='tblAddShipment_AWBNumber_" + ind + "']").val("");
                             $("input[id='_temptblAddShipment_TotalPieces_" + ind + "']").val("");
                             $("input[id='tblAddShipment_TotalPieces_" + ind + "']").val("");
                             $("input[id='_temptblAddShipment_ArrivedPcs_" + ind + "']").val("");
                             $("input[id='tblAddShipment_ArrivedPcs_" + ind + "']").val("");
                             $("input[id='_temptblAddShipment_GrossWeight_" + ind + "']").val("");
                             $("input[id='tblAddShipment_GrossWeight_" + ind + "']").val("");
                             $("input[id='_temptblAddShipment_ArrivedGrossWt_" + ind + "']").val("");
                             $("input[id='tblAddShipment_ArrivedGrossWt_" + ind + "']").val("");

                             var awbPrefix = $("input[id='tblAddShipment_AWBPrefix_" + ind + "']").val();
                             var awbNo = $("input[id='tblAddShipment_AWBNumber_" + ind + "']").val();
                             var awbDescriptionType = $("#" + evt.target.id + " option:selected").val();
                             if ($("input[id='tblAddShipment_PartSplitTotal_" + ind + "']") == "-1") {
                                 ShowMessage('warning', 'Need your Kind Attention!', 'Select Build/Load');
                                 return false;
                             }
                             if (awbPrefix == "" || awbPrefix == "0" || awbNo == "" || awbNo == "0" || awbDescriptionType == "" || awbDescriptionType == "0") {
                                 return false;
                             }
                             else {
                                 var CurrentAWBNo = awbPrefix + '-' + awbNo;
                                 //CheckAddShipmentAwbNoTotal(currentFFMFlightMasterSNo, CurrentAWBNo, awbDescriptionType, evt.target.id.split('_')[2]);
                                 if (CurrentAWBNo.length == 12) {
                                     if ($("select[id='tblAddShipment_FoundAWB_" + ind + "'] option:selected").val() == "0") {
                                         CheckAWBTPS(evt.target.id);
                                         ChkAwbDetailsExistence(evt.target.id);
                                     }
                                 }
                             }
                             var CurrentAWBNo = awbPrefix + '-' + awbNo;
                         }, isRequired: true
                     },
                     {
                         divRowNo: 1, name: 'FoundAWB', display: 'Found', type: 'select', ctrlOptions: { '0': 'NONE', '1': 'FDCA', '2': 'FDAW' },
                         ctrlCss: { width: '125px', height: '20px', color: '#9d331d', 'font-weight': 'bold' }, onChange: function (evt, rowIndex) {
                             var ind = evt.target.id.split('_')[2];
                             //   $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_TotalPieces']").val(0);
                             $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_TotalPieces']").val("");
                             $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_TotalPieces']").val("");
                             $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").val("");
                             $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").val("");


                          
                             if ($("#" + evt.target.id + " option:selected").val() != "0") {

                                 $('#tblAddShipment_lblArrivedPcs_' + ind + '').text('Received Pcs');
                                 $('#tblAddShipment_lblArrivedGrossWt_' + ind + '').text('Received GR.WT');
                                 $('#tblAddShipment_lblArrivedCBM_' + ind + '').text('Received CBM');
                              
                             }
                             else
                             {
                                 $('#tblAddShipment_lblArrivedPcs_' + ind + '').text('Manifested Pcs');
                                 $('#tblAddShipment_lblArrivedGrossWt_' + ind + '').text('Manifested GR.WT');
                                 $('#tblAddShipment_lblArrivedCBM_' + ind + '').text('Manifested CBM');

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
                      { divRowNo: 1, name: 'ULDType', display: 'ULD/BULK', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckULDType(this);" }, ctrlCss: { width: '90px', height: '20px' }, isRequired: false, tableName: 'vwInboundULDTypeList', textColumn: 'ULDName', templateColumn: ["ULDName"], keyColumn: 'SNo' },

                      {
                          divRowNo: 1, name: 'SerialNo', display: 'Serial No', type: 'text', ctrlAttr: {
                              maxlength: 5, controltype: 'default', onBlur: "CheckSerialNo(this)", oninput: "this.value = this.value.replace(/[^0-9]/g, '');", disabled: 'disabled'
                          }, ctrlCss: { width: '100px', 'text-transform': 'uppercase', "cursor": "not-allowed" }
                      },

              { divRowNo: 1, name: 'OwnerCode', display: 'Owner Code', type: 'text', ctrlAttr: { maxlength: 3, controltype: 'alphanumericupper', onBlur: "CheckOwnerCode(this)", disabled: 'true' }, ctrlCss: { width: '90px', 'text-transform': 'uppercase', "cursor": "not-allowed" } },


                { divRowNo: 2, name: 'AWBPrefix', display: 'AWB Prefix', type: 'text', ctrlAttr: { maxlength: 3, controltype: "alphanumericupper", onBlur: "CheckAWBAWBPrefix(this);" }, ctrlCss: { width: '67px', color: '#9d331d', 'font-weight': 'bold' }, isRequired: true },
                { divRowNo: 2, name: 'AWBNumber', display: 'AWB No', type: 'text', ctrlAttr: { maxlength: 8, controltype: "alphanumeric", onBlur: "CheckAWBNumber(this);", oninput: "this.value = this.value.replace(/[^0-9.]/g, '');" }, ctrlCss: { width: '70px', color: '#9d331d', 'font-weight': 'bold' }, isRequired: true },
                {
                    divRowNo: 2, name: 'AWBOrigin', display: 'Org.', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckFAOriginAndDestination(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'vAddShipmentAirport', textColumn: 'AirportCode', keyColumn: 'SNo', templateColumn: ["AirportCode", "AirportName"], basedOn: "AirportCode,AirportName", filterCriteria: "contains"
                },

              { divRowNo: 2, name: 'AWBDestination', display: 'Dest.', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckFAOriginAndDestination(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'vAddShipmentAirport', textColumn: 'AirportCode', keyColumn: 'SNo', templateColumn: ["AirportCode", "AirportName"], basedOn: "AirportCode,AirportName", filterCriteria: "contains" },

            {
                divRowNo: 2, name: 'RefNo', display: 'CN38 No', type: 'text', ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 12, allowchar: '-' },
                ctrlCss: { width: '105px', display: "none" }, isRequired: false
            },

                { divRowNo: 3, name: 'TotalPieces', display: 'Total Pcs', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckTotalPcs(this);" }, ctrlCss: { width: '70px' }, isRequired: true },

                { divRowNo: 3, name: 'GrossWeight', display: 'Gr.WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal3", onBlur: "CheckTotalGrossWt(this);" }, ctrlCss: { width: '75px' }, isRequired: true },
                { divRowNo: 3, name: 'VolumeWeight', display: 'CBM', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal3" }, ctrlCss: { width: '128px' }, isRequired: false },

                 { divRowNo: 3, name: 'SPHC', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return GetAddShipmentSPHC(this);" }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'vAddShipmentSPHC', textColumn: 'Code', keyColumn: 'SNo' },
                   {
                       divRowNo: 3, name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 15 },
                       ctrlCss: { width: '115px' }, isRequired: true
                   },

                     { divRowNo: 4, name: 'ArrivedPcs', display: 'Manifested Pcs', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckTotalPcs(this);" }, ctrlCss: { width: '70px' }, isRequired: true },
                { divRowNo: 4, name: 'ArrivedGrossWt', display: 'Manifested GR.WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal3", onBlur: "CheckTotalGrossWt(this);" }, ctrlCss: { width: '75px' }, isRequired: true },
                { divRowNo: 4, name: 'ArrivedCBM', display: 'Manifested CBM', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal3" }, ctrlCss: { width: '128px' }, isRequired: false },


                //{ divRowNo: 4, name: 'ArrivedPcs', display: 'Manifested Pcs', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckTotalPcs(this);" }, ctrlCss: { width: '70px' }, isRequired: true },
                //{ divRowNo: 4, name: 'ArrivedGrossWt', display: 'Manifested GR.WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal3", onBlur: "CheckTotalGrossWt(this);" }, ctrlCss: { width: '75px' }, isRequired: true },
                //{ divRowNo: 4, name: 'ArrivedCBM', display: 'Manifested CBM', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal3" }, ctrlCss: { width: '128px' }, isRequired: false },

                //{
                //    divRowNo: 2, name: 'FoundAWB', display: 'Found', type: 'select', ctrlOptions: { '0': 'NONE', '1': 'FDCA', '2': 'FDAW' },ctrlCss: { width: '125px' }
                //},
                //{
                //    divRowNo: 4, name: 'FoundAWB', display: 'Found', type: 'select', ctrlOptions: { '0': 'NONE', '1': 'FDCA', '2': 'FDAW' },
                //    ctrlCss: { width: '125px', height: '20px', color: '#9d331d', 'font-weight': 'bold' }, onChange: function (evt, rowIndex) {
                //        var ind = evt.target.id.split('_')[2];
                //        if ($("#" + evt.target.id + " option:selected").val() == "2") {
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").val(0);
                //            $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").val(0);
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").val(0);
                //            $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val(0);
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").prop('disabled', true).css("cursor", "not-allowed");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").prop('disabled', true).css("cursor", "not-allowed");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").removeAttr("required", "required");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").removeAttr("required", "required");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").removeAttr("required", "required");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").removeAttr("required", "required");
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_HdnULDType_'").val(0);
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").val('BULK');
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").data("kendoAutoComplete").enable(false);
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").css("cursor", "not-allowed");

                //            $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_OwnerCode']").val("");
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_SerialNo']").val("");
                //            $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_SerialNo']").val("");
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_OwnerCode']").val("");
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_SerialNo']").prop('disabled', true).css("cursor", "not-allowed");
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_OwnerCode']").prop('disabled', true).css("cursor", "not-allowed");
                //            $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_SerialNo']").prop('disabled', true).css("cursor", "not-allowed");
                //            $("#" + evt.target.id).closest("table").find("input[id^='_temptblAddShipment_OwnerCode']").prop('disabled', true).css("cursor", "not-allowed");
                //            $("#" + evt.target.id).closest("tr").find("select[id^='tblAddShipment_PartSplitTotal']").val("T");
                //            $("#" + evt.target.id).closest("tr").find("select[id^='tblAddShipment_PartSplitTotal']").prop('disabled', true).css("cursor", "not-allowed");
                //        }
                //        else {
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").prop('disabled', false).css("cursor", "auto");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").prop('disabled', false).css("cursor", "auto");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedPcs']").attr("required", "required");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedPcs']").attr("required", "required");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='tblAddShipment_ArrivedGrossWt']").attr("required", "required");
                //            $("#" + evt.target.id).closest("tr").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").attr("required", "required");
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").data("kendoAutoComplete").enable(true);
                //            $("#" + evt.target.id).closest("table").find("input[id^='tblAddShipment_ULDType_'").css("cursor", "auto");
                //            $("#" + evt.target.id).closest("tr").find("select[id^='tblAddShipment_PartSplitTotal']").prop('disabled', false).css("cursor", "auto");
                //        }
                //        ChkAwbDetailsExistence(evt.target.id);
                //    }
                //},

                { divRowNo: 4, name: 'ShipmentRemarks', display: 'Remarks', type: 'text', ctrlAttr: { maxlength: 40, controltype: "alphanumericupper" }, ctrlCss: { width: '120px' } },
                { divRowNo: 4, name: 'KeepSameULD', display: 'Keep Same ULD', type: 'checkbox' },
            ]
        },
        ], rowUpdateExtraFunction: function (id) {
            $("#tblAddShipment").find("tr:eq(1)").find("td:eq(1)").find("font").hide();

        },
        afterRowAppended: function (tbWhole, parentIndex, addedRows) {

            var currentIndex = addedRows.length;

            $("#tblAddShipment").find("input[id^='tblAddShipment_AWBPrefix']").each(function (i, el) {
                var ind = $(this).attr('id').split('_')[2];
                $(el).css('background', 'bisque');
                $(el).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").css('background', 'bisque');
                $(el).closest("table").find("select[id^='tblAddShipment_FoundAWB']").css('background', 'bisque');
                $(el).closest("table").find("select[id^='tblAddShipment_PartSplitTotal']").css('background', 'bisque');

                if (ind > 1) {
                    //$(el).closest("tr").find("input[id^='tblAddShipment_AWBPrefix_" + (ind ) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_AWBPrefix_1']"));
                    //$(el).closest("tr").find("input[id^='tblAddShipment_AWBNumber_" + (ind) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_AWBNumber_1']"));
                    //$(el).closest("tr").find("input[id^='tblAddShipment_AWBOrigin_" + (ind ) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_AWBOrigin_1']"));
                    //$(el).closest("tr").find("input[id^='tblAddShipment_HdnAWBOrigin_" + (ind) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_HdnAWBOrigin_1']"));
                    //$(el).closest("tr").find("input[id^='tblAddShipment_HdnAWBDestination_" + (ind) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_HdnAWBDestination_1']"));
                    //$(el).closest("tr").find("input[id^='tblAddShipment_HdnAWBDestination_" + (ind) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_HdnAWBDestination_1']"));
                    //$(el).closest("tr").find("input[id^='tblAddShipment_AWBDestination_" + (ind ) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_AWBDestination_1']"));

                    //$("#tblAddShipment").find("input[id^='tblAddShipment_TotalPieces_" + (ind) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_TotalPieces_1']"));
                    //$("#tblAddShipment").find("input[id^='_temptblAddShipment_TotalPieces_" + (ind) + "']").val($(el).closest("tr").find("input[id^='_temptblAddShipment_TotalPieces_1']"));


                    //$("#tblAddShipment").find("input[id^='_temptblAddShipment_GrossWeight_" + (ind) + "']").val($(el).closest("tr").find("input[id^='_temptblAddShipment_GrossWeight_1']"));
                    //$("#tblAddShipment").find("input[id^='tblAddShipment_GrossWeight_" + (ind) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_GrossWeight_1']"));


                    //$("#tblAddShipment").find("input[id^='_temptblAddShipment_VolumeWeight_" + (ind) + "']").val($(el).closest("tr").find("input[id^='_temptblAddShipment_VolumeWeight_1']"));

                    //$("#tblAddShipment").find("input[id^='tblAddShipment_VolumeWeight_" + (ind) + "']").val($(el).closest("tr").find("input[id^='tblAddShipment_VolumeWeight_1']"));
                }

            })
        },
        //afterRowAppended: function (tbWhole, parentIndex, addedRows) {
        //    var countindex = 0;
        //    $("select[id^='tblAddShipment_Row']").each(function (i, el) {
        //        var ind = $(this).attr('id').split('_')[2];

        //        var rowAWBULDCount = $("#tblAddShipment").find("input[id^=tblAddShipment_AWBPrefix_]").length;
        //        countindex = countindex + 1;


        //        if (countindex == rowAWBULDCount) {

        //            //$("#tblAwbULDLocation_StartPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
        //            //$("#tblAwbULDLocation_EndPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
        //            //$("#tblAwbULDLocation_HAWB_" + ind).data("kendoAutoComplete").enable(true);
        //        }
        //    });
        //},

        isPaging: true
    });


    $("#tblAddShipment_btnAppendRow").closest("td").append("&nbsp;&nbsp;<input type='button' id='btnSaveAddShipment' value='Save Shipment' class='incompleteprocess' />");

    if ($("tr[id^='tblAddShipment_Row").length == 1)
        $("#tblAddShipment_btnRemoveLast").hide();
    else
        $("#tblAddShipment_btnRemoveLast").show();

    cfi.PopUp("tbl" + shipmentID, obj.defaultValue, 1350, null, null, 10);

    $("#btnSaveAddShipment").on('click', function (event) {
        SaveShipment(event);
    });
}

var arrAddShipment = [];
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
    //var boolPartAndTotal = ValidatePartAndTotal();
    //if (boolPartAndTotal == false) {
    //    return;
    //}
    //$("#tblAddShipment").find("input[class='incompleteprocess']").css("disabled", true);

    var res = $("#tblAddShipment tr[id^='tblAddShipment']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAddShipment');
    var data = JSON.parse(($('#tblAddShipment').appendGrid('getStringJson')));

    for (var i = 0; i < data.length; i++) {
        if (data[i].ULDType == "") {
            ShowMessage('warning', 'Need your Kind Attention!', 'Select ULD Type');
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
            if ((data[i].SerialNo == "") || (data[i].OwnerCode == "")) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Enter serial no or owner code');
                return false;
            }
        }
    }

    if (!validateTableData('tblAddShipment', res)) {
        return false;
    }
    //else {
    //    event.preventDefault();
    //    //$("#btnSaveAddShipment").prop('disabled', true);
    //}

    if (data != false) {
        //$.ajax({
        //    url: "./Services/Import/InboundFlightService.svc/createUpdateAddShipment", async: false, type: "POST", dataType: "json", cache: false,
        //    data: JSON.stringify(data),
        //    contentType: "application/json; charset=utf-8",
        //    success: function (result) {
        //        if (result == "<value>Shipment Added Successfully.</value>") {
        //            $("#tblAddShipment").data("kendoWindow").close();
        //            var a = currentFFMFlightMasterSNo;
        //            ShowProcessDetails("FC", "AddShipment");
        //        }
        //        else {
        //            return;
        //        }
        //    }
        //});

        $.ajax({
            url: "Services/Import/InboundFlightService.svc/createUpdateAddShipment", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ data: data }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split(',')[0] == "2000") {
                    currentFFMFlightMasterSNo = result.split(',')[1];
                    //ShowProcessDetails("FC", "AddShipment");
                    $("#btnSaveAddShipment").prop('disabled', true);
                    $("#tblAddShipment").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    ShowMessage("success", "Success - Add Shipment", "Shipment Added Successfully.");

                    $('#Chkamended').each(function (row, tr) {
                        alert('1');
                        //if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                        //    $(tr).find("[id^='Delete_']").css("display", "none");
                    });
                }
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
                    //ShowProcessDetails("FC", "AddShipment");
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

// Save AWB ULD Location
function SaveAWBULDLocation() {
    var res = $("#tblAwbULDLocation tr[id^='tblAwbULDLocation']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAwbULDLocation');
    var data = JSON.parse(($('#tblAwbULDLocation').appendGrid('getStringJson')));
    var AssignLocationBool = true;
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
    }

    if (!validateTableData('tblAwbULDLocation', res)) {
        return false;
    }

    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateAwbULDLocation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "<value>AWB Location Added Successfully.</value>") {
                    $("#tblAwbULDLocation").data("kendoWindow").close();
                    GetFlightArrivalGrid();
                    DTRIndex = "";
                    DTRIndex = $(DTR).parent().parent().parent().parent().parent().parent().closest('tr').prev().index();
                    ShowMessage('success', 'Success', "AWB Location Added Successfully.");
                }
                else {
                    return;
                }
            }
        });
    }
}

// Save AWB Damage
var DTRIndex = "";
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
                    //$(DTR).closest('tr').find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
                    //$("#divFlightArrivalDetails  table > tbody > tr:eq(1).k-master-row").find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
                    DTRIndex = $(DTR).parent().parent().parent().parent().parent().parent().closest('tr').prev().index();
                    //$(DTR).closest('tr.k-detail-row').prev().find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
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

}

function fn_SuccessArrivalGrid() {
    if (DTRIndex != undefined) {
        $("#divFlightArrivalDetails  table > tbody > tr:eq(" + DTRIndex + ").k-master-row").find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
        DTRIndex = "";
    }
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
    $("div#divRemarks").text("").text($(obj).closest("tr").find("span#spnULDRemarks").text());
    cfi.PopUp("divRemarks", "ULD Remarks", 400, null, null, 10);
}

//------------------------------------------------------------------------------//
// Print FFM Details
//------------------------------------------------------------------------------//
function PrintFFMDetails(obj) {
    //---Chandra Shekhar Tripathi-----------------------------------------------//
    if ($("#divDescription").length === 0) {
        $("#divAfterContent").html('<div id=divDescription1><div><span style="float:right; padding:5px;"><input type="button" name="name" value="Print" onclick="Fun_printFFmDetails();" /></span><div class="k-content" id="divDescription">' + $("#hdnFFMDetais").val() + '</div></div>');
    }

    //$("#divDescription").html($("#hdnFFMDetais").val())
    cfi.PopUp("divDescription1", "Print FFM", 400, null, null, 10);
}

function Fun_printFFmDetails() {
    //var divID = "divDescription";
    //var divContents = $("#" + divID).html();
    //var printWindow = window.open('', '', '');
    //printWindow.document.write(divContents);
    //printWindow.document.close();
    //printWindow.print();
    $("#divDescription").printArea();
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


function CheckTotalPcs(obj) {
    var TotalPieces = $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val();
    var ArrivedPcs = $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val();
    var DescriptionType = $(obj).closest('table').find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").text();

    //if (FoundType == "FDCA" || FoundType == "FDAW")
    //{
    //    if (parseInt(ArrivedPcs) > parseInt(TotalPieces)) {
    //        var msgAddShipment = (ArrivedPcs > TotalPieces) ? "greater" : "less";
    //        ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be ' + msgAddShipment + ' than total pieces: ' + TotalPieces);
    //        return;
    //    }
    //}
    if (FoundType == "FDCA" || FoundType == "FDAW") {
        if (parseInt(ArrivedPcs) > parseInt(TotalPieces)) {
            var msgAddShipment = (parseInt(ArrivedPcs) > parseInt(TotalPieces)) ? "greater" : "less";
            ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be ' + msgAddShipment + ' than total pieces: ' + TotalPieces);
            return;
        }
        else {
            return;
        }
    }

    if (ArrivedPcs != "" && TotalPieces != "" && DescriptionType == "T") {
        if (parseInt(ArrivedPcs) < parseInt(TotalPieces) || parseInt(ArrivedPcs) > parseInt(TotalPieces)) {
            $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").val("");
            $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val("");
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedPcs']").val("");
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val("");
            var msgAddShipment = (parseInt(ArrivedPcs) > parseInt(TotalPieces)) ? "greater" : "less";
            ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be ' + msgAddShipment + ' than total pieces: ' + TotalPieces);
            return;
        }


    }
    else {
        if (parseInt(ArrivedPcs) > parseInt(TotalPieces)) {
            $(obj).closest("table").find("input[id^='_temptblAddShipment_TotalPieces']").val("");
            $(obj).closest("table").find("input[id^='tblAddShipment_TotalPieces']").val("");
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedPcs']").val("");
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedPcs']").val("");
            var msgAddShipment = (parseInt(ArrivedPcs) > parseInt(TotalPieces)) ? "greater" : "less";
            ShowMessage("warning", "Need your Kind Attention!", 'Manifested Pieces: ' + ArrivedPcs + ' can not be ' + msgAddShipment + ' than total pieces: ' + TotalPieces);
            return;
        }

    }

}

function CheckTotalGrossWt(obj) {
    var TotalGrossWeight = $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val();
    var ArrivedGrossWeight = $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val();
    var DescriptionType = $(obj).closest('table').find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").val();
    var FoundType = $(obj).closest('table').find("select[id^='tblAddShipment_FoundAWB'] option:selected").text();

    if (FoundType == "FDCA" || FoundType == "FDAW") {
        if (parseInt(ArrivedGrossWeight) > parseInt(TotalGrossWeight)) {
            var msgAddShipment = (ArrivedGrossWeight > TotalGrossWeight) ? "greater" : "less";
            ShowMessage("warning", "Need your Kind Attention!", 'Gross Weight: ' + ArrivedGrossWeight + ' can not be ' + msgAddShipment + ' than total pieces: ' + TotalPieces);
            return;
        }
        else {
            return;
        }
    }

    if (ArrivedGrossWeight != "" && TotalGrossWeight != "" && DescriptionType == "T") {
        if (parseFloat(ArrivedGrossWeight) < parseFloat(TotalGrossWeight) || parseFloat(ArrivedGrossWeight) > parseFloat(TotalGrossWeight)) {
            $(obj).closest("table").find("input[id^='_temptblAddShipment_GrossWeight']").val("");
            $(obj).closest("table").find("input[id^='tblAddShipment_GrossWeight']").val("");
            $(obj).closest("table").find("input[id^='_temptblAddShipment_ArrivedGrossWt']").val("");
            $(obj).closest("table").find("input[id^='tblAddShipment_ArrivedGrossWt']").val("");
            var msgAddShipment = (ArrivedGrossWeight > TotalGrossWeight) ? "greater" : "less";
            ShowMessage("warning", "Need your Kind Attention!", 'Manifested gross wt: ' + ArrivedGrossWeight + ' can not be ' + msgAddShipment + ' than gross wt: ' + TotalGrossWeight);
            return;
        }
    }
}

function CheckAWBAWBPrefix(obj) {
    var awbPrefix = $(obj).val();
    var awbNo = $(obj).closest("tr").find("input[id^='tblAddShipment_AWBNumber']").val();
    var awbDescriptionType = $(obj).closest('tr').next().next().find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();
    try {
        if ($(obj).closest("tr").parent().find("[id^=tblAddShipment_PartSplitTotal_]").val() == "-1") {
            ShowMessage('warning', 'Need your Kind Attention!', 'Select Build/Load.');
            $(obj).val("");
            return false;
        }
        if (awbPrefix == "" || awbPrefix == "0") {
            return false;
        }
        if (awbPrefix.length != 3) {
            ShowMessage('warning', 'Need your Kind Attention!', 'Invalid AWB Number.');
            $(obj).val("");
            return false;
        }
        else {
            if (awbNo.length != 8) {
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
                    if (awbNo.substring(0, 7) % 7 != awbNo.substring(7, 8)) {
                        ShowMessage('warning', 'Need your Kind Attention!', "Invalid AWB Number");
                        $(obj).val("");
                        return false;
                    }
                }

                //$.ajax({
                //    url: "Services/Import/InboundFlightService.svc/CheckIsCheckModulus7", async: false, type: "POST", dataType: "json", cache: false,
                //    data: JSON.stringify({ AirlineCode: awbPrefix }),
                //    contentType: "application/json; charset=utf-8",
                //    success: function (result) {
                //        var Data = jQuery.parseJSON(result);
                //        var resData = Data.Table0;
                //        if (resData.length > 0) {
                //            if (resData[0].IsCheckModulus7 == "True") {
                //                if (awbNo.substring(0, 7) % 7 != awbNo.substring(7, 8)) {
                //                    ShowMessage('warning', 'Need your Kind Attention!', "Invalid AWB Number");
                //                    $(obj).val("");
                //                    return false;
                //                }
                //            }
                //        }
                //    }
                //});


                //CheckAddShipmentAwbNoTotal(currentFFMFlightMasterSNo, CurrentAWBNo, awbDescriptionType, $(obj).attr('id').split('_')[2]);
                if ($(obj).closest("table").find("select[id^='tblAddShipment_FoundAWB'] option:selected").val() == "0") {
                    CheckAWBTPS($(obj).attr('id'));
                    ChkAwbDetailsExistence($(obj).attr('id'));
                }
            }
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
    var awbPrefix = $(obj).closest("tr").find("input[id^='tblAddShipment_AWBPrefix']").val();
    var awbDescriptionType = $(obj).closest('tr').next().next().find("select[id^='tblAddShipment_PartSplitTotal'] option:selected").val();

    try {
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
                    if (awbNo.substring(0, 7) % 7 != awbNo.substring(7, 8)) {
                        ShowMessage('warning', 'Need your Kind Attention!', "Invalid AWB Number");
                        $(obj).val("");
                        return false;
                    }
                }

                //$.ajax({
                //    url: "Services/Import/InboundFlightService.svc/CheckIsCheckModulus7", async: false, type: "POST", dataType: "json", cache: false,
                //    data: JSON.stringify({ AirlineCode: awbPrefix }),
                //    contentType: "application/json; charset=utf-8",
                //    success: function (result) {
                //        var Data = jQuery.parseJSON(result);
                //        var resData = Data.Table0;
                //        if (resData.length > 0) {
                //            if (resData[0].IsCheckModulus7 == "True") {
                //                if (awbNo.substring(0, 7) % 7 != awbNo.substring(7, 8)) {
                //                    ShowMessage('warning', 'Need your Kind Attention!', "Invalid AWB Number");
                //                    $(obj).val("");
                //                    return false;
                //                }
                //            }
                //        }
                //    }
                //});

                //CheckAddShipmentAwbNoTotal(currentFFMFlightMasterSNo, CurrentAWBNo, awbDescriptionType, $(obj).attr('id').split('_')[2]);
                if ($(obj).closest("table").find("select[id^='tblAddShipment_FoundAWB'] option:selected").val() == "0") {
                    CheckAWBTPS($(obj).attr('id'));
                    ChkAwbDetailsExistence($(obj).attr('id'));
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
                        $("input[id='_temptblAddShipment_VolumeWeight_" + obj).val(resData1[0].VolumeWT);
                        $("input[id='tblAddShipment_VolumeWeight_" + obj).val(resData1[0].VolumeWT);
                        $("input[id='tblAddShipment_NatureOfGoods_" + obj).val(resData1[0].NatureOfGoods);
                    }
                    else {
                        //$("input[id='tblAddShipment_HdnAWBOrigin_" + obj).val("");
                        //$("input[id='tblAddShipment_AWBOrigin_" + obj).val("");
                        //$("input[id='tblAddShipment_HdnAWBDestination_" + obj).val("");
                        //$("input[id='tblAddShipment_AWBDestination_" + obj).val("");
                        //$("input[id='_temptblAddShipment_TotalPieces_" + obj).val("");
                        //$("input[id='tblAddShipment_TotalPieces_" + obj).val("");
                        //$("input[id='_temptblAddShipment_GrossWeight_" + obj).val("");
                        //$("input[id='tblAddShipment_GrossWeight_" + obj).val("");
                        //$("input[id='_temptblAddShipment_VolumeWeight_" + obj).val("");
                        //$("input[id='tblAddShipment_VolumeWeight_" + obj).val("");
                        //$("input[id='tblAddShipment_NatureOfGoods_" + obj).val("");
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


//------------------------------------------------------------------------------//
// Save flight checkIn details
//------------------------------------------------------------------------------//
function SaveFlightCheckInDetails(obj) {
    var ata = $("#__tblflightarrivalflightinformation__").find("#ATA").val();
    var arrivalDate = $("#ArrivalDate").attr("sqldatevalue");

    var AircraftRegistration = $("#AircraftRegistrationNo").val();

    if (arrivalDate == "" || arrivalDate == undefined) {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and save flight details.");
        return;
    }
    if (ata == "" || ata == undefined) {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }


    if (AircraftRegistration == "") {
        ShowMessage("warning", "Warning", "Kindly enter Aircraft Registration No.");
        return;
    }

    if (currentCargoClassification == 4 && $("#AircraftRegistrationNo").val() == "") {
        ShowMessage("warning", "Warning", "Kindly enter Truck Plate No.");
        return;
    }

    if ((/\d/.test($("#AircraftRegistrationNo").val()) == false) && currentCargoClassification == 4 && $("#AircraftRegistrationNo").val() != "") {
        ShowMessage("warning", "Warning", "Kindly provide minimum one Numeric character for Truck Plate No.");
        return;
    }

   // var a = GetUserLocalTime("L").split(' ')[1].substr(0, 5);
    var ArrivalDateATATime = arrivalDate + ' ' + ata + ':00';
    var CurrentCityDateTime = GetUserLocalTime("L");

    if (Date.parse(ArrivalDateATATime) > Date.parse(CurrentCityDateTime)) {
        ShowMessage("warning", "Warning", "ATA can not be greater than current Date & Time at the station.");
        return;
    }
    //var ArrivalDateATATime = arrivalDate + ' ' + ata + ':00';
    //var CurrentCityDateTime = GetUserLocalTime("L");
    //if (Date.parse(ArrivalDateATATime) > Date.parse(CurrentCityDateTime)) {
    //    ShowMessage("warning", "Warning", "ATA can not be greater than current time at the station.");
    //    return;
   // }

    var aircraftRegistration = $("#__tblflightarrivalflightinformation__").find("#AircraftRegistrationNo").val();
    var vendor = $("#Vendor").val();
    var AgendOrVendorName = $("#Text_Vendor").val();
    var grossWT = $("#__tblflightarrivalflightinformation__").find("#GrossWeight").val();
    var volumeWT = $("#__tblflightarrivalflightinformation__").find("#VolumeWeight").val();
    var aircraftTypeSNo = $("#AircraftType").val();
    var IsNil = ($("#IsNil").is(':checked')) ? "1" : "0";
    var FlightType = $('#FlightType:checked').val();
    //var TruckScheduleNo = "";
    //if (currentCargoClassification == 4) {
    //    TruckScheduleNo = $("#TruckScheduleNo").val();
    //}

    var FlightCheckInDetails = [];

    var flightCheckInData = { ATA: ata, ArrivalDate: arrivalDate, AircraftRegistration: aircraftRegistration, GrossWT: (grossWT == "") ? 0 : grossWT, VolumeWT: (volumeWT == "") ? 0 : volumeWT, AircraftTypeSNo: (aircraftTypeSNo == "") ? 0 : aircraftTypeSNo, AccountSNo: (vendor == "") ? 0 : vendor, AgendOrVendorName: AgendOrVendorName == "" ? "" : AgendOrVendorName, IsNil: IsNil, TruckScheduleNo: ($("#TruckScheduleNo").val() == undefined || $("#TruckScheduleNo").val() == '') ? '' : $("#TruckScheduleNo").val(), TruckDate: $("#TruckDate").attr("sqldatevalue"), IsRFSAircraftType: (IsRFSAircraftType == undefined || IsRFSAircraftType == "") ? 0 : IsRFSAircraftType, FlightType: FlightType }

    FlightCheckInDetails.push(flightCheckInData);
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveFlightCheckInDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FlightCheckInDetails: FlightCheckInDetails, DailyFlightSNo: currentDailyFlightSno }),
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
            }
            else if (result.split('?')[0] == "2")
            {
                ShowMessage('warning', 'Warning', 'TimeZone not found for Current City: '+ userContext.CityCode, "bottom-right");
                 
            }

                //if (result == "10002") {
                //    ShowMessage('warning', 'Warning', "Truck not found.", "bottom-right");
                //    return;
                //}
                //if (result == "10003") {
                //    ShowMessage('warning', 'Warning', "Truck already exist.", "bottom-right");
                //    return;
                //}
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


//------------------------------------------------------------------------------//
// Instantiate Search Control for inbound flight
//------------------------------------------------------------------------------//
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

    /*
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    });*/

    cfi.AutoComplete("SearchAirlineCarrierCode", "CarrierCode,AirlineName", "VGetInventoryAirline", "CarrierCode", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("SearchBoardingPoint", "AirportCode,AirportName", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    //cfi.AutoComplete("searchFlightNo", "FlightNo", "vFlightDetail", "SNo", "FlightNo", ["FlightNo"], null, "contains");
    //cfi.AutoComplete("AircraftType", "SNo,AircraftType", "Aircraft", "SNo", "AircraftType", ["AircraftType"], null, "contains");


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


    //$("#__tblinboundflight__ td:empty").remove();

    //var bindSubSearch = '</tr><tr><td>' + $('#__tbltransitflightarrival__').find('td').eq(13).html() + '</td>';
    //var previous = $('#__tbltransitflightarrival__').find('td').eq(13).html();
    //$('tr').append(bindSubSearch).after(previous + '</td>');

    //alert($("#__tbltransitflightarrival__ tr:first td:last").html());
    //$("#list_toppager_center tr:first td:last").after(bindSubSearch);

    //<td><input type="hidden" name="SearchFlightNo" id="SearchFlightNo" value=""></td><td><input id="Text_SearchFlightNo" width="130px" name="Text_SearchFlightNo" controltype="autocomplete" type="text" style="width: 150px; text-transform: uppercase;" data-role="autocomplete" placeholder="Flight No" autocomplete="off"></td>

    $('<tr><td><input type="checkbox" class="formSearchInputcolumn" name="ConnectingFlights" id="ConnectingFlights">Connecting Flights</td><td><input type="hidden" name="searchFilterConnFlights" id="searchFilterConnFlights" value=""><input id="Text_searchFilterConnFlights" name="Text_searchFilterConnFlights" controltype="autocomplete" placeholder="Connecting Flight" type="text" class="k-input" style="width: 130px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"></td><td>&nbsp;</td><td><input type="checkbox" class="formSearchInputcolumn" name="ULDCounts" id="ULDCounts">ULD Count</td><td><input type="hidden" name="searchFilterULDCounts" id="searchFilterULDCounts" value=""><input id="Text_searchFilterULDCounts" name="Text_searchFilterULDCounts" placeholder="ULD Count" controltype="autocomplete" type="text" class="k-input" style="width: 110px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"></td><td>&nbsp;</td><td><input type="checkbox" name="MCT" id="MCT">MCT</td><td><input type="hidden" name="searchFilterMCT" id="searchFilterMCT" value=""><input id="Text_searchFilterMCT" name="Text_searchFilterMCT" controltype="autocomplete" placeholder="MCT" type="text" class="k-input" style="width: 110px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"></td><td>&nbsp;</td><td><input type="hidden" name="searchFStatus" id="searchFStatus" value=""><input id="Text_searchFStatus" name="Text_searchFStatus" controltype="autocomplete" placeholder="Flight Status" type="text" class="k-input" style="width: 100px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"><td></tr>').insertAfter($('#__tblinboundflight__').find('tbody  tr').closest('tr'));

    var ConnectingFlightsAndULd = [{ Key: "1", Text: "LESS THAN 10" }, { Key: "2", Text: "MORE THAN 10" }, { Key: "3", Text: "MORE THAN 20" }, { Key: "4", Text: "MORE THAN 30" }];
    var searchMCT = [{ Key: "1", Text: "LESS THAN 1 HOUR" }, { Key: "2", Text: "LESS THAN 2 HOUR" }, { Key: "3", Text: "LESS THAN 3 HOUR" }];
    cfi.AutoCompleteByDataSource("searchFilterULDCounts", ConnectingFlightsAndULd);
    cfi.AutoCompleteByDataSource("searchFilterConnFlights", ConnectingFlightsAndULd);
    cfi.AutoCompleteByDataSource("searchFilterMCT", searchMCT);

    $("#ConnectingFlights").parent("td").before('<td><input type="hidden" name="searchFlightNo" id="searchFlightNo" value=""><input id="Text_searchFlightNo" name="Text_searchFlightNo" placeholder="Flight No" controltype="autocomplete" type="text" style="width: 130px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"></td>');
    cfi.AutoComplete("searchFlightNo", "FlightNo", "vInboundSearchFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    //<td>&nbsp;</td><td><span class="ActionView" style="cursor:pointer;color:Blue;text-decoration:underline;font-size:13px;margin-left:4px;" id="idAddFlight" onclick="AddFlight();">Add Flight</span></td>
    $("#Text_searchFStatus").after('<td>&nbsp;</td><td colspan="2"><span class="ActionView" style="cursor:pointer;color:Blue;text-decoration:underline;font-size:13px;margin-left:4px;" id="idAddFlight" onclick="AddFlight();">Add Flight</span></td>');
    var searchFStatus = [{ Key: "0", Text: "NOT ARRIVED" }, { Key: "1", Text: "ARRIVED" }, { Key: "2", Text: "FC PENDING" }, { Key: "3", Text: "FC COMPLETE" }, { Key: "4", Text: "NIL ARRIVED" }];
    cfi.AutoCompleteByDataSource("searchFStatus", searchFStatus);

    $("#searchFStatus").before("<td id='tdCheck'>");
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

}

//------------------------------------------------------------------------------//
// Bind Events for subprocess
//------------------------------------------------------------------------------//
function BindEvents(obj, e, isdblclick) {
    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    _CURR_PRO_ = $(obj).attr("currentprocess");
    if (currentprocess == "FC" && _CURR_PRO_ == "InboundFlight") {
        currentDailyFlightSno = $(obj).closest("tr").find("td:eq(1)").text();
        currentFFMFlightMasterSNo = $(obj).closest("tr").find("td:eq(3)").text();
    }
    if (currentprocess == "FLIGHTASSIGNTEAM" && _CURR_PRO_ == "InboundFlight") {
        location.href = "Default.cshtml?Module=Shipment&Apps=AssignTeam&FormAction=INDEXVIEW&DailyFlightSNo=" + $(obj).closest("tr").find("td:eq(1)").text() + "&Page=0&MovementTypeSNo=1";
    }

    if (userContext.TerminalSNo == '0') {
        ShowMessage('warning', 'Warning', "Terminal not assign for current user.");
        
    }


    var Message = cfi.GetAWBLockedEvent(userContext.UserSNo, "0", currentDailyFlightSno, "", "", "");
    //alert(Message);
    if (Message == "") {
        
        ShowProcessDetails(subprocess, isdblclick);
        cfi.SaveUpdateLockedProcess("0", currentDailyFlightSno, "", "", userContext.UserSNo, "0", "Inbound Flight", 3, "");
    }
    else {

            $("#__divdimension__").html('');
           return false;
    }
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
               //{
               //    name: 'ReturnTo', display: 'Return To', type: 'select', ctrlOptions: { 'Airline': 'Airline', 'SAS': 'SAS' }, onChange: function (evt, rowIndex) {
               //        if ($("#tblFAULDLocation_ReturnTo_1 option:selected").val() == 'SAS') {
               //            $("input[id*='tblFAULDLocation_Airline_1']").removeAttr("required").css("cursor", "not-allowed");
               //            $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(false);
               //            $("#tblFAULDLocation_Location_1").focus();
               //        }
               //        else {
               //            $("input[id*='tblFAULDLocation_Airline_1']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
               //            $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(true);
               //            $("#tblFAULDLocation_Location_1").focus();
               //        }
               //    }, ctrlCss: { width: '100px' }, isRequired: true
               //},
                { name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckULDMovableLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, tableName: 'vInboundMovableLocation', textColumn: 'ConsumablesName', keyColumn: 'SNo' },
               { name: 'Location', display: 'Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckULDLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'vAssignULDLocation', textColumn: 'LocationName', keyColumn: 'SNo' },
                //{
                //    name: 'Airline', display: 'Select Airline', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'Airline', textColumn: 'AirlineName', keyColumn: 'SNo'
                //}
            ],
            //rowUpdateExtraFunction: function (id) {
            //    $("select[id^='tblFAULDLocation_ReturnTo_1']").each(function (i, el) {
            //        if ($("#tblFAULDLocation_ReturnTo_1 option:selected").val() == 'SAS') {
            //            $("input[id*='tblFAULDLocation_Airline_1']").removeAttr("required").css("cursor", "not-allowed");
            //            $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(false);
            //            $("#tblFAULDLocation_Location_1").focus();
            //        }
            //        else {
            //            $("input[id*='tblFAULDLocation_Airline_1']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
            //            $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(true);
            //            $("#tblFAULDLocation_Location_1").focus();
            //            //$("#tblFAULDLocation_Airline_1").focus();
            //        }
            //    });
            //},

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

                        $("table[id$='tblFAULDLocation']").find('tr').find('td:nth-child(4)').hide()


                    });









                }


                if (typeof (userContext.SpecialRights.MOVIMPORT) === "undefined")
                {
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
            //deleteServiceMethod: 'delete' + dbTableName,
            caption: dbCaption,
            initRows: 1,
            columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'FFMShipmentTransSNo', type: 'hidden' },
            { name: 'ConsumablesList', display: 'List', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, tableName: 'vInboundCounsumableList', textColumn: 'ItemName', keyColumn: 'SNo' },

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

var IsThroughULD;
var IsBUP;
//
function GetFAULDLocation(ffmShipmentTransSNo, isThroughULD, isBUP) {
    //DTRIndex = "";
    var dbTableName = 'FAULDLocation';
    IsThroughULD = isThroughULD;
    IsBUP = isBUP;
    ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
}

function GetDamage(ffmShipmentTransSNo) {
    //DTRIndex = "";
    var dbTableName = 'FAULDDamage';
    ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
}

//function GetConsumable(ffmShipmentTransSNo) {
//    //DTRIndex = "";
//    var dbTableName = 'FAConsumable';
//    ULDAppendProcess(dbTableName, ffmShipmentTransSNo);
//    $("#tblFAConsumable_ConsumablesList_1").focus();

//    //if ($('#tblFAConsumable tr').index() == 1)
//    //    $("#tblFAConsumable_btnRemoveLast").hide();
//    //else
//    //    $("#tblFAConsumable_btnRemoveLast").show();
//}

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

    if (userContext.TerminalSNo=='0') {
        ShowMessage('warning', 'Warning', "Terminal not assign for current user.");
        return;
    }
    AWBAppendProcess(dbAwbTableName, arvShipmentSNo, awbSNo);
    //GetTempreatureControlled();
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

//function GetHAWB(awbSNo, obj) {
//    var arvShipmentSNo = $(obj).closest("tr").find("td:eq(5)").text();
//    if (arvShipmentSNo == '0' || awbSNo == '0') {
//        ShowMessage('warning', 'Warning - HAWB', "Shipment not arrived.");
//        return;
//    }

//    var dbAwbTableName = 'HAWB';
//    $('#tbl' + dbAwbTableName).appendGrid({
//        tableID: 'tbl' + dbAwbTableName,
//        contentEditable: true,
//        tableColumns: 'SNo,AWBNo,IrregularityDamage',
//        masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
//        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
//        servicePath: './Services/Import/InboundFlightService.svc',
//        getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
//        isGetRecord: true,
//        createUpdateServiceMethod: 'createUpdate' + dbAwbTableName,
//        deleteServiceMethod: 'delete' + dbAwbTableName,
//        caption: 'HAWB',
//        initRows: 1,
//        hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: false },
//        columns: [
//       { name: 'SNo', type: 'hidden', value: 0 },
//       { name: 'DailyFlightSNo', type: 'hidden' },
//       { name: 'FFMFlightMasterSNo', type: 'hidden' },
//       { name: 'ULDNo', type: 'hidden' },
//       { name: 'FFMShipmentTransSNo', type: 'hidden' },
//       { name: 'ArrivedShipmentSNo', type: 'hidden' },
//       { name: 'AWBSNo', type: 'hidden' },
//       { name: 'TotalFFMPieces', type: 'hidden' },
//       { name: 'AWBNo', display: 'AWB No', type: 'label' },
//       { name: 'ShipmentOriginAirportCode', display: 'Origin', type: 'label' },
//       { name: 'ShipmentDestinationAirportCode', display: 'Dest', type: 'label' },
//       { name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'label' },
//       { name: 'SHC', display: 'Nature Of Goods', type: 'label' },

//       { name: 'Priority', display: 'Priority', type: 'label' },
//       { name: 'Pieces', display: 'AWB', type: 'label' },
//       { name: 'LoadDetails', display: 'Build/Load Details', type: 'label' },
//       { name: 'OSI', display: 'OSI', type: 'label' },
//       { name: 'COR', display: 'COR', type: 'label' },
//       { name: 'FFMPieces', display: 'FFM Pieces', type: 'label' },

//       ],
//        isPaging: true,
//    });


//}
var DTR;
// AWB Locaton and Damage process



function AWBAppendProcess(dbAwbTableName, arrivedShipmentSNo, awbSNo) {
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    $("#tbl" + dbAwbTableName).remove();
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table id='tbl" + dbAwbTableName + "'></table>");
    }
    //var newDataSource;
    if (dbAwbTableName == 'AwbULDLocation') {
        dbAWBCaption = 'AWB Location';
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,RcvdPieces,RcvdGrossWeight,HAWB,SPHC,StartPieces,EndPieces,AssignLocation,TempControlled,StartTemperature,EndTemperature',
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
               { name: 'HAWB', display: 'HAWB No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckHAWB(this);" }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'vInboundFlightImportHAWB', textColumn: 'HAWBNo', keyColumn: 'SNo' },

               //{ name: 'HAWB', display: 'HAWB No', type: 'text', ctrlAttr: { maxlength: 15, controltype: "alphanumericupper", onBlur: "CheckHAWBNo(this)" }, ctrlCss: { width: '100px' } },
               {
                   name: 'SPHC', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckSPHC(this);" }, ctrlCss: { width: '80px', height: '20px' }, tableName: 'vAddShipmentSPHC', textColumn: 'Code', keyColumn: 'SNo', filterCriteria: "contains", separator: ","
               },

               { name: 'StartPieces', display: 'Start Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '55px' }, isRequired: true },
               { name: 'EndPieces', display: 'End Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '55px' }, isRequired: true },
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






                   name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, tableName: 'vInboundMovableLocation', textColumn: 'ConsumablesName', keyColumn: 'SNo', onChange: function (evt, rowIndex) {
                       //var ind = evt.target.id.split('_')[2];
                       //var HdnMovableLocation = $("input[id='tblAwbULDLocation_HdnMovableLocation_" + ind + "']").val();
                       //var MovableLocation = $("input[id='tblAwbULDLocation_MovableLocation_" + ind + "']").val();
                       //var HdnAssignLocation = $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").val();
                       //var AssignLocation = $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").val();

                       //if ((HdnMovableLocation != "" && MovableLocation != "") && (HdnAssignLocation == "" && AssignLocation == "")) {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").removeAttr("required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").removeAttr("required");
                       //}
                       //else if ((HdnMovableLocation == "" && MovableLocation == "") && (HdnAssignLocation != "" && AssignLocation != "")) {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").removeAttr("required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").removeAttr("required");
                       //}
                       //else if ((HdnMovableLocation != "" && MovableLocation != "") && (HdnAssignLocation != "" && AssignLocation != "")) {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").removeAttr("required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").removeAttr("required");
                       //}
                       //else {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").attr("required", "required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").attr("required", "required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").focus();
                       //}
                   }
               },
               {
                   name: 'AssignLocation', display: 'Assign Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, tableName: 'vAssignLocation', textColumn: 'LocationName', keyColumn: 'SNo', filterCriteria: "contains", isRequired: true, onChange: function (evt, rowIndex) {
                       //var ind = evt.target.id.split('_')[2];
                       //var HdnMovableLocation = $("input[id='tblAwbULDLocation_HdnMovableLocation_" + ind + "']").val();
                       //var MovableLocation = $("input[id='tblAwbULDLocation_MovableLocation_" + ind + "']").val();
                       //var HdnAssignLocation = $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").val();
                       //var AssignLocation = $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").val();

                       //if ((HdnMovableLocation != "" && MovableLocation != "") && (HdnAssignLocation == "" && AssignLocation == "")) {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").removeAttr("required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").removeAttr("required");
                       //}
                       //else if ((HdnMovableLocation == "" && MovableLocation == "") && (HdnAssignLocation != "" && AssignLocation != "")) {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").removeAttr("required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").removeAttr("required");
                       //}
                       //else if ((HdnMovableLocation != "" && MovableLocation != "") && (HdnAssignLocation != "" && AssignLocation != "")) {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").removeAttr("required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").removeAttr("required");
                       //}
                       //else {
                       //    $("input[id='tblAwbULDLocation_HdnAssignLocation_" + ind + "']").attr("required", "required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").attr("required", "required");
                       //    $("input[id='tblAwbULDLocation_AssignLocation_" + ind + "']").focus();
                       //}
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
                        //$("#tblAwbULDLocation_HAWB_" + ind).data("kendoAutoComplete").enable(false);
                    } else {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_StartTemperature_" + ind).val());
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_EndTemperature_" + ind).val());
                        //$("#tblAwbULDLocation_HAWB_" + ind).data("kendoAutoComplete").enable(true);
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
                        $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(12)').hide()


                    });



                }


                if (typeof (userContext.SpecialRights.MOVIMPORT) === "undefined")
                {
                    $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_HdnMovableLocation_]").hide();
                        $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").closest("td").hide();
                        $("td[title='Movable Location']").hide();
                        $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(12)').hide()


                    });

                }

                //var filter = cfi.getFilter("AND");
                //cfi.setFilter(filter, "TerminalSno", "eq", userContext.TerminalSNo);
                //var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
                //return OriginCityAutoCompleteFilter2;
                

              

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

        $("#tblAwbULDLocation_rowOrder").closest("td").append("<input type='button' value='Save' class='incompleteprocess' onclick='SaveAWBULDLocation();' />");
        $("#tblAwbULDLocation_rowOrder").closest("tr").css("display", "block");
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
           { name: 'IrregularityDamage', display: 'Irregularity Discrepancy', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckAWBIrregularityDamage(this);" }, ctrlCss: { width: '180px', height: '20px' }, tableName: 'IrregularityDamage', textColumn: 'Damage', keyColumn: 'SNo', filterCriteria: "contains", isRequired: true, }
            ],
            isPaging: true,
        });

        $("#tblAwbULDDamage_rowOrder").closest("td").append("<input type='button' value='Save' class='incompleteprocess' onclick='SaveAwbULDDamage();' />");
        $("#tblAwbULDDamage_rowOrder").closest("tr").css("display", "block");
    }

    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, dbAwbTableName == 'AwbULDDamage' ? 800 : 1330, null, null, 10);
    $("#tbl" + dbAwbTableName).parent("div").css("position", "fixed");
}




 


//function CheckHAWBNo(obj) {
//    var awbSNo = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AWBSNo']").val();
//    var hawbNo = $(obj).val();
//    if (awbSNo != "" || awbSNo != 0 && currentFFMFlightMasterSNo != "", hawbNo != "") {
//        $.ajax({
//            url: "Services/Import/InboundFlightService.svc/CheckHAWBNo", async: false, type: "POST", dataType: "json", cache: false,
//            data: JSON.stringify({ AWBSNo: awbSNo, FFMFlightMasterSNo: currentFFMFlightMasterSNo, HAWBNo: hawbNo }),
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                var Data = jQuery.parseJSON(result);
//                var resData = Data.Table0;
//                if (resData.length > 0) {
//                    if (resData[0].Column1 == '0') {
//                        var retHAWBVal = confirm("HAWB No not exists. Are you sure, you want to add this ?");
//                        if (retHAWBVal == true) {
//                            $.ajax({
//                                url: "Services/Import/InboundFlightService.svc/SaveHAWBNo", async: false, type: "POST", dataType: "json", cache: false,
//                                data: JSON.stringify({ AWBSNo: awbSNo, FFMFlightMasterSNo: currentFFMFlightMasterSNo, HAWBNo: hawbNo }),
//                                contentType: "application/json; charset=utf-8",
//                                success: function (result) {
//                                    var Data = jQuery.parseJSON(result);
//                                    var resData = Data.Table0;
//                                    if (resData.length > 0) {
//                                        if (resData[0].Column1 == '0') {
//                                            ShowMessage("success", "Success", "HAWB added successfully.")
//                                            $(obj).val($(obj).val());
//                                            $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnHAWB']").val(resData[0].Column2);
//                                        }
//                                    }
//                                    else {
//                                        $(obj).val("");
//                                        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnHAWB']").val("");
//                                    }
//                                }
//                            });
//                        }
//                        else {
//                            $(obj).val("");
//                            $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnHAWB']").val("");
//                        }
//                    }
//                }
//            }
//        });
//    }
//}

function CheckSPHC(obj) {
    $(obj).closest("td").find("div > ul").css("width", "163px");
    $("#tblAwbULDLocation_HdnAssignLocation_" + $(obj).attr("id").split('_')[2]).val("");
    $("#tblAwbULDLocation_AssignLocation_" + $(obj).attr("id").split('_')[2]).val("");
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
        //if ($("#tblAwbULDDamage_IrregularityDamage_" + ind).val().toUpperCase() == $(obj).val() && ($(obj).parents("tr").index() + 1) != ind) {
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
        //$(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation_']").data("kendoAutoComplete").enable(false);
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation_']").data("kendoAutoComplete").enable(false);


        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation_']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation_']").val('0');


    }
    else if ((hdnMovableLocation == "0" && movableLocation == "") && (hdnAssignLocation != "" && assignLocation != "")) {
        // $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnMovableLocation']").data("kendoAutoComplete").enable(false);
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").data("kendoAutoComplete").enable(false);
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnMovableLocation']").val('0');
    }
    //else if ((hdnMovableLocation != "" && movableLocation != "") && (hdnAssignLocation != "" && assignLocation != "")) {
    //    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required");
    //    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required");
    //}
    //else {
    //    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required");
    //    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required");
    //    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
    //}



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

        //if ($(obj).val() == "" && $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() == "") {
        //    $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").attr("required", "required").css("cursor", "auto");
        //    $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").attr("required", "required").css("cursor", "auto");
        //    $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();
        //}

        if ($(obj).val() == "" && $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() != "") {
            //$(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").removeAttr("required").css("cursor", "auto");
            //$(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").removeAttr("required").css("cursor", "auto");

            $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").data("kendoAutoComplete").enable(false);
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").val("");
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").val('0');

        }


        if ($(obj).val() == "" && $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").val() != "") {
            //$(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").removeAttr("required").css("cursor", "auto");
            //$(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").removeAttr("required").css("cursor", "auto");

            $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").data("kendoAutoComplete").enable(false);
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val("");
            $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnMovableLocation']").val('0');
        }

        //$(obj).closest("tr").find("input[id^='tblAwbULDLocation_Location']").focus();
    }
}

//------------------------------------------------------------------------------//
// Breakdown Start and End TIme
//------------------------------------------------------------------------------//

var breakdownFFMFlightMasterSNo = "";
var breakdownUldNo = "";
var currentBreakdown = "";
var seletedObj1;
var seletedObj2;
function GetBreakdownStartTime(obj1) {
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and save flight details.");
        return;
    }
    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }


    if ($("#tblBreakdownStartTime").length === 0) {
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblBreakdownStartTime'><tr><td><input type='text' controltype='datetype' id='txtBreakdownStartDate' class='datepicker' />&nbsp;<input type='text' class='timePicker' id='txtBreakdownStartTime'  /><input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='UpdateBreakDownTime(this,1);' /></td></tr></table>");
        //var a = obj1.innerHTML.substring(12, 17);
        $("#tblBreakdownStartTime").find(".datepicker").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        var breakdownStartTime = $("#tblBreakdownStartTime").find(".timePicker").kendoTimePicker({
            format: "HH:mm",
            //value: obj1.innerHTML.substring(12, 17),
            change: function () {
                var startTime = breakdownStartTime.value();
                if (startTime) {
                    startTime = new Date(startTime);
                    startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                } else {
                    $("#tblBreakdownStartTime").find(".timePicker").val('');
                }
            }
        }).data("kendoTimePicker");

        //$("#tblBreakdownStartTime").find(".timePicker").kendoTimePicker({ format: "HH:MM", value: new Date() });
    }


    //var bDownStartDT = $(obj1).closest("tr").find("#spnBreakDownStart").text();
    //var bDownEndDT = $(obj1).closest("tr").find("#spnBreakDownEnd").text();

    breakdownFFMFlightMasterSNo = $(obj1).closest("tr").find("td:eq(3)").text();
    breakdownUldNo = $(obj1).closest("tr").find("td:eq(6)").text();
    delete seletedObj1;
    seletedObj1 = obj1;

    cfi.PopUp("tblBreakdownStartTime", "Breakdown Start Time", 400, null, null, 100);
    $("#tblBreakdownStartTime").parent("div").css("position", "fixed");
}

function GetBreakdownEndTime(obj2) {
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and save flight details.");
        return;
    }
    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    if ($("#tblBreakdownEndTime").length === 0) {
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblBreakdownEndTime'><tr><td><input type='text' controltype='datetype' id='txtBreakdownEndDate' class='datepicker' />&nbsp;<input type='text' class='timePicker' id='txtBreakdownEndTime'  /><input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='UpdateBreakDownTime(this,2);'  /></td></tr></table>");
        $("#tblBreakdownEndTime").find(".datepicker").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        var breakdownEndTime = $("#tblBreakdownEndTime").find(".timePicker").kendoTimePicker({
            format: "HH:mm",
            change: function () {
                var startTime = breakdownEndTime.value();
                if (startTime) {
                    startTime = new Date(startTime);
                    startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                } else {
                    $("#tblBreakdownEndTime").find(".timePicker").val('');
                }
            }
        }).data("kendoTimePicker");

        //$("#tblBreakdownEndTime").find(".timePicker").kendoTimePicker({ format: "HH:MM", value: new Date() });
    }

    //var bDownStartDT = $(obj2).closest("tr").find("#spnBreakDownStart").text();
    //var bDownEndDT = $(obj2).closest("tr").find("#spnBreakDownEnd").text();

    breakdownFFMFlightMasterSNo = $(obj2).closest("tr").find("td:eq(3)").text();
    breakdownUldNo = $(obj2).closest("tr").find("td:eq(6)").text();
    seletedObj2 = obj2;
    cfi.PopUp("tblBreakdownEndTime", "Breakdown End Time", 400, null, null, 100);
    $("#tblBreakdownEndTime").parent("div").css("position", "fixed");
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

        ftDate = $("span#FLIGHTDATE").text().replace('-', ' ').replace('-', ' ');
        arr1 = ftDate.split(" ");
        final1 = arr1[0] + ' ' + arr1[1] + ' ' + arr1[2];
        var ataData = ($("#ATA").val() == '') ? '00:00' : $("#ATA").val();

        flightDateAndATA = GetDate(final1).replace('-', ' ').replace('-', ' ') + ' ' + ataData + ':00';

        if (Date.parse(breakdownStartDateTime1) <= Date.parse(flightDateAndATA)) {
            ShowMessage("warning", "BreakDown", "Breakdown start date time can not be less than flight date and ATA.");
            return;
        }

        if (Date.parse(breakdownStartDateTime1) >= Date.parse(FinalEndDate)) {
            ShowMessage("warning", "BreakDown", "Breakdown start date can not be greater than breakdown end date.");
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

        spanStart = $(seletedObj1).closest("tr").find("#spnBreakDownStart").text();
        spanStartDate = spanStart.substring(0, 11);
        spanStartTime = spanStart.substring(12, 20);
        FinalStartDate = GetDate(spanStartDate) + ' ' + spanStartTime;

        ftDate = $("span#FLIGHTDATE").text().replace('-', ' ').replace('-', ' ');
        arr2 = ftDate.split(" ");
        final2 = arr2[0] + ' ' + arr2[1] + ' ' + arr2[2];

        var ataData = ($("#ATA").val() == '') ? '00:00' : $("#ATA").val();
        flightDateAndATA = GetDate(final2).replace('-', ' ').replace('-', ' ') + ' ' + ataData + ':00';

        if (Date.parse(breakdownEndDateTime1) <= Date.parse(flightDateAndATA)) {
            ShowMessage("warning", "BreakDown", "Breakdown End date time can not be less than flight date and ATA.");
            return;
        }

        if (Date.parse(breakdownEndDateTime1) <= Date.parse(FinalStartDate)) {
            ShowMessage("warning", "BreakDown", "Breakdown end date can not be less than breakdown start date.");
            return;
        }
    }

    $.ajax({
        url: "Services/Import/InboundFlightService.svc/UpdateBreakDownTime", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ BreakdownStartTime: breakdownStartDateTime, BreakdownEndTime: breakdownEndDateTime, FFMFlightMasterSNo: breakdownFFMFlightMasterSNo, ULDNo: breakdownUldNo }),
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
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val("");
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val("");

    var cValue = $(obj).val();
    var startPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val());
    var endPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val());
    var rcvdPieces = $("#tblAwbULDLocation_RcvdPieces_1").text();
    var houseNo = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val();
    var houseLastIndex = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val().lastIndexOf('-');
    var housePieces = houseNo.substring(houseLastIndex + 1, houseNo.length);

    if (startPieces > endPieces) {
        $(obj).val('');
        ShowMessage("warning", "", "Start Pieces can not be greater than End Pieces");
    }
    if (houseNo != "") {
        arrHAWB = [];
        arrList = [];
        $(obj).closest("table").find("tr[id^='tblAwbULDLocation_Row_']").each(function () {
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
                    if (TotalPcs > parseInt(housePieces1)) {
                        $(obj).val('');
                        ShowMessage("warning", "", "Entered Pieces can not be greater than House Pieces");
                        return;
                    }
                }
            }
        }
    }

    if (parseInt(cValue) > parseInt(rcvdPieces)) {
        $(obj).val('');
        ShowMessage("warning", "", "Entered Pieces can not be greater than Received Pieces");
        return;
    }
    var count = 0;
    if ($("#tblAwbULDLocation > tbody").children.length > 1) {
        $("#tblAwbULDLocation").find("input[id^='tblAwbULDLocation_AssignLocation']").each(function () {
            count = count + 1;
            if (count != $(obj).parents("tr").index() + 1) {

                var aStart = $(this).parents("tr").find("input[type='text'][id*='StartPieces']").val();
                var aEnd = $(this).parents("tr").find("input[type='text'][id*='EndPieces']").val();

                if ((aStart == "" || aStart == "0")) {
                    //$(obj).val('');
                    ShowMessage("warning", "", "Enter value in row number: <b>" + count + "</b>");
                    return false;
                }

                if (aEnd == "" || aEnd == "0") {
                    //$(obj).val('');
                    ShowMessage("warning", "", "Enter value in row number: <b>" + count + "</b>");
                    return false;
                }

                if ((parseInt(cValue) >= parseInt(aStart)) && (parseInt(cValue) <= parseInt(aEnd))) {
                    $(obj).val('');
                    ShowMessage("warning", "", "Piece Number is already used in row number: <b>" + count + "</b>");
                    return false;
                }
            }
        });
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

//----------------
// ULD Report
//----------------
function GetULDReport(obj, FFMFlightMasterSNo) {
    if (FFMFlightMasterSNo == "" || FFMFlightMasterSNo == "0")
        ShowMessage('warning', 'Warning - FC Report', "Record not found.");
    else
        window.open("HtmlFiles/Import/ULDReport.html?FFMFlightMasterSNo=" + FFMFlightMasterSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
}

function GetFAReceivedPieces(obj, ffmPieces) {
    //$(obj).keypress(function (e) {
    //    var iKeyCode = (e.which) ? e.which : e.keyCode
    //    if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
    //        return false;
    //});

    if (isNaN(parseInt($(obj).val()))) {
        $(obj).val('');
        return;
    }

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
    if ($(obj).val() == '') {
        $(obj).val('');
        $(obj).closest("tr").find("#txtActualGrossWt").val("");
        ShowMessage('warning', 'Warning', "Received pieces not found.");
        return;
    }

    var gWT = parseFloat((parseFloat(tGWt) / parseInt(ffmPieces)) * parseInt($(obj).val())).toFixed(2);
    $(obj).closest("tr").find("#txtActualGrossWt").val("");
    $(obj).closest("tr").find("#txtActualGrossWt").val(isNaN(gWT) ? 0 : gWT);
}
//------------------------------------------------------------------------------//
// Show subprocess details of fligh checkIn & subprocess of flight arrival
//------------------------------------------------------------------------------//
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
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //InitializePage("FlightArrivalFlightInformation", 'divContent')
            if (_CURR_PRO_ == "FlightArrival") {
                $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                $("#divContent").html(divContentAppend);
                $("#divContent").after("<div id='divStopOverFlightInformation' style='width: 100%;'></div");
                $("#divContent").before("<div id='divDetail2'></div>");
                InitializePage("FlightArrivalFlightInformation", 'divContent');
                InitializePage("StopOverFlightInformation", 'divStopOverFlightInformation');

                //cfi.ShowIndexView("divFlightArrivalDetails", "Services/Import/InboundFlightService.svc/GetFlightArrivalShipmentGrid/" + _CURR_PRO_ + "/Import/FlightArrivalShipment/" + currentFFMFlightMasterSNo);

                cfi.AutoComplete("AircraftType", "AircraftType", "vInboundAircraftType", "SNo", "AircraftType", ["AircraftType"], OnSelectAircraftType, "contains");
                cfi.AutoComplete("Vendor", "Name", "vInboundFlightVendor", "SNo", "Name", ["Name"], null, "contains");

                if (currentCargoClassification == 4) {
                    $("#Text_Vendor").data("kendoAutoComplete").enable(true);
                    //$("#TruckScheduleNo").prop('disabled', false);
                    //$("#TruckScheduleNo").css("cursor", "auto");
                    //$("#TruckDate").data("kendoDatePicker").enable(true);
                    //$("#TruckDate").css("cursor", "auto");

                    //added by Bhupendra Singh Bhandari as discuss with Madhav sir

                    $("#TruckScheduleNo").prop('disabled', true);
                    $("#TruckScheduleNo").css("cursor", "not-allowed");
                    $("#TruckDate").data("kendoDatePicker").enable(false);
                    $("#TruckDate").css("cursor", "not-allowed");

                    //end

                    $("#AircraftType").closest("td").next().html("<font style='color: rgb(255, 0, 0);'>*</font>Truck Plate No.");
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



                //$("#__tblflightarrivalflightinformation__").closest("tr").find("td:eq(1)").text('').append("<input type='button' id='btnBack' value='Back' onclick='GoBack()' class='btn btn-inverse' />" + " Flight Arrival Information");

                //if ($("#Text_AircraftType").val() == "")
                //    $("#Text_AircraftType").focus();
                //cfi.AutoComplete("AircraftType", "AircraftType", "Aircraft", "SNo", "AircraftType", ["AircraftType"]);


                GetFlightArrivalGrid();
                //$.ajax({
                //    url: "Services/Import/InboundFlightService.svc/GetFlightArrivalShipmentGrid/" + _CURR_PRO_ + "/Import/FlightArrivalShipment/" + currentFFMFlightMasterSNo, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                //    success: function (result) {
                //        $("#divFlightArrivalDetails").html(result);
                //        $("#divFlightArrivalDetails").find(".datepicker").kendoDatePicker({
                //            format: "dd-MMM-yyyy",
                //            value: new Date()
                //        });

                //        $("#_tempGrossWeight").before("<lable>Gross Wt: </label>");
                //        $("#_tempVolumeWeight").before("<label>Volume Wt: </label>");
                //        $("#IsNil").after("NIL");
                //        $("#ATA").closest("td").prev().find("font").text("*").css("color", "red");

                //    }
                //});


                $.ajax({
                    url: "Services/Import/InboundFlightService.svc/GetFlightArrivalShipmentGrid/" + _CURR_PRO_ + "/Import/FlightArrivalStopOverShipment/" + currentFFMFlightMasterSNo, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //var Data = jQuery.parseJSON(result);
                        //var resData = Data.Table0;
                        //if (resData.length > 0) {
                        $("#divStopOverFlightInformation").html(result);
                        $("#divStopOverFlightInformation").find(".datepicker").kendoDatePicker({
                            format: "dd-MMM-yyyy",
                            value: new Date()
                        });
                        //}
                        //else
                        //{
                        //    $("#divStopOverFlightInformation").html('');
                        //}
                    }
                });
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
                        //$("#TruckScheduleNo").prop('disabled', false);
                        //$("#TruckScheduleNo").css("cursor", "auto");
                        //$("#TruckDate").data("kendoDatePicker").enable(true);
                        //$("#TruckDate").css("cursor", "auto");

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
                        //var CurrentDateATA = new Date();
                        //var ATATime = ('0' + (CurrentDateATA.getUTCHours())).slice(-2) + ":" + ('0' + (CurrentDateATA.getUTCMinutes())).slice(-2);

                        //if ($("#ATA").prop('disabled') == false)
                        //    $("#ATA").val(ATATime);
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

    //if ($("#" + e).val() == "RFS") {
    //    $("#Text_Vendor").data("kendoAutoComplete").enable(true);
    //    $("#AircraftType").closest("td").next().html("<font>&nbsp;&nbsp;&nbsp;</font>Truck Plate No.");
    //    $("#AircraftType").closest("td").next().attr("title", "Enter Truck Plate No. ");

    //    var CurrentDateATA = new Date();
    //    var ATATime = ('0' + (CurrentDateATA.getUTCHours())).slice(-2) + ":" + ('0' + (CurrentDateATA.getUTCMinutes())).slice(-2);
    //    if ($("#ATA").prop('disabled') == false)
    //        $("#ATA").val(ATATime);
    //}
    //else {
    //    $("#Text_Vendor").data("kendoAutoComplete").enable(false);
    //    $("#AircraftType").closest("td").next().html("<font>&nbsp;&nbsp;&nbsp;</font>Aircraft Registration No.");
    //    $("#AircraftType").closest("td").next().attr("title", "Enter Aircraft Registration No.");
    //}
}

function GetFlightArrivalGrid() {
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetFlightArrivalShipmentGrid/FlightArrival/Import/FlightArrivalShipment/" + currentFFMFlightMasterSNo, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

            if ($("#lblIsNil").length === 0)
                $("#IsNil").after("<lable id='lblIsNil'>NIL</label>");
            $("#ATA").closest("td").prev().find("font").text("*").css("color", "red");

            if ($("#lblATA").length === 0)
                $("#ATA").before("<lable id='lblATA' style='font-weight:bold;'>ATA: </label>");

            if ($("#lblVendor").length === 0)
                $("#Vendor").before("<lable id='lblVendor' style='font-weight:bold;'>Vendor: </label>");

            if ($("#lblFlightType").length === 0)
                $("span#FLIGHTDATE").after("<label id='lblFlightType' style='font-weight:bold;margin-left: 90px;'>Flight Type: </label>");
        }
    });
}

//------------------------------------------------------------------------------//
// Back
//------------------------------------------------------------------------------//
function GoBack() {

    cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
    navigateUrl('Default.cshtml?Module=Import&Apps=InboundFlight&FormAction=INDEXVIEW');
}


//------------------------------------------------------------------------------//
// Bind flight information for flight checkin
//------------------------------------------------------------------------------//
var tempATA;
var tempArrivalDate;
var currentCargoClassification;
function BindFlightInfo() {
    var DailyFlightSno = (currentDailyFlightSno == "" ? 0 : currentDailyFlightSno);
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/GetFlightArrivalFlightInformation?DailyFlightSno=" + DailyFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData.length > 0) {
                var resItem = resData[0];
                $("span#FlightNo").html(resItem.FlightNo);
                $("span#Origin").html(resItem.OriginAirport);
                $("span#FLIGHTDATE").html(resItem.FlightDate);

                $("#ATA").val(resItem.ATA);
                $("#ArrivalDate").data("kendoDatePicker").value(resItem.ArrivalDate);

                tempATA = (resItem.ATA == "" || resItem.ATA == undefined) ? "" : resItem.ATA;
                tempArrivalDate = (resItem.ArrivalDate == "" || resItem.ArrivalDate == undefined) ? "" : resItem.ArrivalDate;

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

                if (resItem.FlightType == "1") {
                    $('input[name=FlightType][data-radioval=FREIGHTER]').attr('checked', true);
                }
                else {
                    $('input[name=TruckSource][data-radioval=PAX]').attr('checked', true);
                }

                $("#TruckDate").data("kendoDatePicker").value(resItem.TruckDate);
                $("#TruckScheduleNo").val(resItem.TruckScheduleNo);

                if (resItem.ArrivalStatus == 3) {
                    $("#AddShipment").prop('disabled', true);
                }
                else {
                    $("#AddShipment").removeAttr("disabled");
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
            }
        },
        error: {
        }
    });
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

//$("body").on("click", ".remove", function () {
//    $(this).closest("li").remove();
//    $("#tblRecipient_MobileNo_" + i).val("");
//    $("#tblRecipient_EmailId_" + i).val("");
//});

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

    //if (textId == "tblAwbULDLocation_AssignLocation_1") {
    //    try {
    //        cfi.setFilter(filterEmbargo, "TerminalSno", "eq", userContext.TerminalSNo)
    //        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //        return OriginCityAutoCompleteFilter2;
    //    }
    //    catch (exp) { }
    //}

    
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


    if (textId == "tblAwbULDLocation_SPHC_" + textId.split('_')[2]) {
        $("#tblAwbULDLocation_HdnAssignLocation_" + textId.split('_')[2]).val("")
        $("#tblAwbULDLocation_AssignLocation_" + textId.split('_')[2]).val("");

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
        //$("#tblAwbULDLocation_AssignLocation_" + textId.split('_')[2]).val("");
        //$("#tblAwbULDLocation_HdnAssignLocation_" + textId.split('_')[2]).val("");
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


//------------------------------------------------------------------------------//
//Sub process of flight arrival for ULD location, damage, and consumable
//------------------------------------------------------------------------------//
function InitializePage(subprocess, cntrlid, isdblclick) {
    InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "FlightArrivalFlightInformation".toUpperCase()) {
        BindFlightInfo();
    }
    if (subprocess.toUpperCase() == "StopOverFlightInformation".toUpperCase()) {

    }
}

function SaveBUPULDDetails(obj) {

    $(obj.parentNode.parentNode).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");

    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and save flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    var dflightSNo = $(obj).closest("tr").find("td[data-column='DailyFlightSNo']").text();
    var fFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();
    var uULDNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();

    var BUPULDDetails = [];
    var BUPuldData = {
        DailyFlightSNo: dflightSNo, FFMFlightMasterSNo: fFlightMasterSNo, ULDNo: uULDNo
    }
    BUPULDDetails.push(BUPuldData);
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/SaveBUPULDDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ UldData: BUPULDDetails }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resultData = result.split(",")
            if (resultData[0] == "0") {

                $(obj).closest("tr").find("td:eq(5)").text(resultData[1]);
                $(obj).attr("value", "Arrived");
                $(obj).attr("class", "btn btn-block btn-success btn-sm");

                $("#ATA").prop('disabled', true);
                $("#ATA").css("cursor", "not-allowed");
                $(obj).closest("tr").find("td[data-column='SNo']").find("input").css("cursor", "auto").removeAttr("disabled");
                if ($(obj).closest("table").closest("tr").prev().find("input[type='checkbox'][id='chkThroughULD']").length > 0 && $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkThroughULD']").is(":checked")) {
                    $(obj).closest("table").closest("tr").find("input[type='checkbox'][id='chkThroughULD']").closest("td[data-column='IsThroughULD']").text("Yes");
                }
                ShowMessage('success', 'Success', "Details Saved Successfully");
            }
            else
                ShowMessage('warning', 'Warning', "Unable to save data.");
        },
        error: function () {
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}
//------------------------------------------------------------------------------//
// Save ULD Details when flight checking
//------------------------------------------------------------------------------//
function saveArrivedShipment(obj) {
    if (tempArrivalDate == "") {
        ShowMessage("warning", "Warning", "Kindly enter Arrival Date and save flight details.");
        return;
    }

    if (tempATA == "") {
        ShowMessage("warning", "Warning", "Kindly enter ATA and save flight details.");
        return;
    }

    //var flightNo = $("#FlightNo span").text();

    var dflightSNo = $(obj).closest("tr").find("td[data-column='DailyFlightSNo']").text();
    var fFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();
    var uNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    var ffmShipmentTrans1 = $(obj).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();
    var arrivedShipmentSNo = $(obj).closest("tr").find("td[data-column='ArrivedShipmentSNo']").text();
    var awbNo = $(obj).closest("tr").find("td[data-column='AWBNo']").text();
    var origin = $(obj).closest("tr").find("td[data-column='ShipmentOriginAirportCode']").text();
    var destination = $(obj).closest("tr").find("td[data-column='ShipmentDestinationAirportCode']").text();
    var commodity = $(obj).closest("tr").find("td[data-column='NatureOfGoods']").text();
    var shc = $(obj).closest("tr").find("td[data-column='SPHC']").text();
    //var document = $(obj).closest("tr").find("input[id=chkDocument]").is(":checked");
    var awbPieces = $(obj).closest("tr").find("td[data-column='Pieces']").text();
    var buildDetails = $(obj).closest("tr").find("td[data-column='LoadDetails']").text();
    //var ffm = $(obj).closest("tr").find("td:eq(17)").text();
    var recvdPieces = $(obj).closest("tr").find("#txtFAMAWBRcdPieces").val();
    var grossWT = $(obj).closest("tr").find("#txtGrossWt").val();
    var piecesGWT = $(obj).closest("tr").find("#txtActualGrossWt").val()
    var remarks = $(obj).closest("tr").find("#txtFAMAWBRemarks").val();

    cfi.SaveUpdateLockedProcess("0", dflightSNo, "", "", userContext.UserSNo, "0", "Inbound Flight", 0, "");


    //if ($(obj).closest("tr").find($('#Chkamended').is(":checked"))=false)
    //{
    //    ShowMessage('warning', 'Warning', "Kindly select Amendment.");
    //    return;
    //}


    if (recvdPieces == "")
        ShowMessage('warning', 'Warning', "Received pieces can not be left blank.");

    else {
        var ULDDetails = [];
        var uldData = {
            //DailyFlightSNo: dflightSNo, FFMFlightMasterSNo: fFlightMasterSNo, FFMShipmentTransSNo: ffmShipmentTrans1, ULDNo: uNo, AWBNo: awbNo, Origin: origin, Destination: destination, Commodity: commodity, SHC: '1', Document: document == true ? 'Y' : 'N', AWBPieces: awbPieces, BuildDetails: buildDetails, FFM: '', RecvdPieces: recvdPieces, GrossWT: piecesGWT, Remarks: remarks
            DailyFlightSNo: dflightSNo, FFMFlightMasterSNo: fFlightMasterSNo, FFMShipmentTransSNo: ffmShipmentTrans1, ULDNo: uNo, AWBNo: awbNo, Origin: origin, Destination: destination, Commodity: commodity, SHC: '1', AWBPieces: awbPieces, BuildDetails: buildDetails, FFM: '', RecvdPieces: recvdPieces, GrossWT: piecesGWT, Remarks: remarks
        }

        ULDDetails.push(uldData);
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/SaveULDDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ UldData: ULDDetails, ArrivedShipmentSNo: (arrivedShipmentSNo == "") ? 0 : arrivedShipmentSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resultData = result.split(",")
                if (resultData[0] == "0") {

                    //$(obj).closest("tr").find("td:eq(5)").text(resultData[1]);
                    $(obj).closest("tr").find("td[data-column='ArrivedShipmentSNo']").text(resultData[1]);
                    $(obj).attr("value", "Arrived");
                    $(obj).attr("class", "btn btn-block btn-success btn-sm");

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
                    // if (resultData[2] == "True") {
                    //     var FlightMessage = $("#span#FlightNo").text() + ' ' + $("#span#FlightDate").text() + ' ' + 'Flight Arrived.';
                    //     sendSMS(971501160101, FlightMessage);
                    //}




                //    foreach (KeyValuePair<string, bool> list in dict)
                //    {
                //        if(list.Key=="IMPORTSHIP")
                //        {
                //            if (list.Value==true)
                //            {

                //                g.NestedColumn.Add(new GridColumn { Field = "Isamended", Title = "Amendment", Template = "#if(Isamended>0){#<input id=\"Chkamended\" type=\"checkbox\" />#} #", DataType = GridDataType.String.ToString(), Width = 30 });
                //        }

                //    }
                //}



                    //$(obj).closest("table tr").closest("td").closest("td[data-column='Isamended']").append("<input id='Chkamended' type='checkbox' />");



                    if (userContext.SpecialRights.IMPORTSHIP == true)
                    {
                        $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").html('');
                        $((obj.parentElement.parentNode)).find("td[data-column='Isamended']").append("<input id='Chkamended' type='checkbox' />");

                    }

                    if ($((obj.parentElement.parentNode)).find("td[data-column='Isamendedvalue'] span").text() == "0") {

                        $((obj.parentElement.parentNode)).find("td[data-column='Isamendedvalue'] span").text('1');
                    }

                   
                    if (resultData[2] == "True") {
                        $("#AddShipment").prop('disabled', true);
                    }
                    else {
                        $("#AddShipment").removeAttr("disabled");
                    }
                    ShowMessage('success', 'Success', "Details Saved Successfully");
                }
                else if (resultData[0] == "1") {
                    ShowMessage('warning', 'Warning', resultData[1]);
                    return;
                }
                else if (resultData[0] == "100") {
                    ShowMessage('warning', 'Warning', 'Terminal not assign for current user.');
                    return;
                }
                else
                    ShowMessage('warning', 'Warning', "Unable to save data.");
            },
            error: function () {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        });
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
    // $(obj.parentNode.parentNode).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
    // $(obj.parent()).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
    //if ($(obj).closest("tr").find($('#Chkamended').is(":checked"))) {
    //    ShowMessage('warning', 'Warning', "Kindly select Amendment.");
    //    return;
    //}
    //saveArrivedShipment(obj);
    if (parseInt( $(obj).closest("tr").find("td[data-column='Isamended']").text())> 0) {
         ShowMessage('warning', 'Warning', "Kindly select Amendment.");
            return;
    }
    //var ffmShipmentTrans1 = $(obj).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();

    if ($(obj).closest("tr").find("input[type='checkbox'][id='Chkamended']").length > 0) {

        if (!$(obj).closest("tr").find("input[type='checkbox'][id='Chkamended']:checked").length > 0) {



            ShowMessage('warning', 'Warning', "Kindly select Amendment.");
            return;
        }
    }
    

    saveArrivedShipment(obj);


    //  var dataval = obj.parentNode.parentNode.nextElementSibling.closest('table')
    //  $(obj.parentNode.parentNode.nextElementSibling).find('tr').each(function (i, val) {
    //      alert(val);
    //  })
    //if ($(obj).closest("tr").find("#chkDocument").is(':checked')) {
    //    saveArrivedShipment(obj);
    //}
    //else
    //    OpenPopUp("Document not selected irregularity will be raised for same as MSAW", "DocumentCheck", obj);

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
    /*
    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });*/
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

//------------------------------------------------------------------------------//
// Div content for inbound flight
//------------------------------------------------------------------------------//
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divInboundFlightDetails' style='width:100%'></div></td></tr></table></div>";

//------------------------------------------------------------------------------//
// Div content for flight arrival
//------------------------------------------------------------------------------//
var divContentAppend = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divFlightArrivalDetails' style='width:100%'></div></td></tr></table></div>";

function OpenExclude(FFMFlightMasterSNo, FFMShipmentTransSNo, ArrivedShipmentSNo, awbSNo, obj) {
    DTR = $(obj).closest("tr");
    var AwbNo = $(obj).closest("tr").find("td[data-column='AWBNo']").text();
    $("#divExclude").remove();
    //if ($("#divExclude").length === 0) {

    $("#divStopOverFlightInformation").append("<div id='divExclude' validateonsubmit='true' style='overflow:auto;'><table id=tblExclude width='100%' class='WebFormTable'><tr width='100%'><td class='formlabel' width='50%'>AWB No.</td><td class='formlabel' width='50%'><span id='spnAWBNo'></span><input type='hidden' id='AWBSNo' name='AWBSNO' ></td></tr><tr><td class='formlabel' width='50%'><font id=\"ftbillto\" color=\"red\">*</font><span id='spnRemarks'> Remark</span></td><td width='50%' class='formInputcolumn'><textarea class='k-input' name='Remarks' id='Remarks' style='width: 200px;text-transform: uppercase;'  data-valid='required' data-valid-msg='Remarks can not be blank' controltype='alphanumeric' maxlength='150' data-role='alphabettextbox' autocomplete='off'></textarea></td></tr><tr><td colspan='2' class='form2buttonrow' width='100%'><center><input type='button' class='btn btn-success' onclick='SaveExcludeRemarks(" + FFMFlightMasterSNo + "," + FFMShipmentTransSNo + "," + ArrivedShipmentSNo + "," + awbSNo + ")' value='Save'><center></td></tr></table></div>");
    //}
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