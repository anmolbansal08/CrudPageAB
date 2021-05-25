/// <reference path="../../Scripts/references.js" />

var CTMBillto = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }];

$(function () {
    LoadRFSDetails();
    cfi.AutoCompleteByDataSource("BillType", CTMBillto, onBillToSelect, null);

    $(document).on("change", "input[name='AirlineAgent']", function () {
        if ($("input[name=AirlineAgent]:checked").val() == 0) {
            var data = GetDataSource("Account", "vRFSAgent", "SNo", "Name", ["Name"], null);
            cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "Name", "contains");
        }
        else {
            var data = GetDataSource("Account", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
            cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "AirlineName", "contains");
        }

        //if (RFSTruckDetailsSNo != undefined || RFSTruckDetailsSNo != "") {
        //    $.ajax({
        //        url: "Services/RFS/RFSService.svc/GetAgentInformation", async: false, type: "POST", dataType: "json", cache: false,
        //        data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
        //        contentType: "application/json; charset=utf-8",
        //        success: function (result) {
        //            var Data = jQuery.parseJSON(result);
        //            var resData = Data.Table0;
        //            if (resData.length > 0) {
        //                var AccountSNo = resData[0].AccountSNo;
        //                tempAccountSNo = resData[0].AccountSNo;
        //                AvailableCreditLimit = AccountSNo.split('?')[1];
        //                if (AccountSNo.split('?')[0] == '1') {
        //                    $("#spnRFSChargesBill").find("input[id=chkBillToAgent]").removeAttr("checked");
        //                    ShowMessage("warning", "Warning - Bill To Agent", "Agent details not found, Update truck details for bill to agent.")
        //                }
        //            }
        //        }
        //    });
        //}

        //CheckBillToAgent(tempAccountSNo);
        CheckBillToAgent();

    });

    $(document).on("change", "input[name='chkChargesfinalized']", function () {
        $("#divChargesCalculatedManually").html('');
        if (this.checked) {
            $("#divChargesCalculatedManually").append("<center><table id='tblChargesCalculatedManually' width='100%'><tr><td align='center' colspan='2'><textarea type='text' id='txtChargesCalculatedManuallyRemarks' placeholder='Remarks' ondrop='return false;' onpaste='return false;' style='width:380px;height:200px;text-transform:uppercase;margin:10px;' maxlength='250' /></td></tr></table></center>");

            $("#divChargesCalculatedManually").dialog(
                    {
                        autoResize: true,
                        maxWidth: 800,
                        maxHeight: 400,
                        width: 480,
                        height: 360,
                        modal: true,
                        title: 'Calculated Charges Manually',
                        draggable: true,
                        resizable: true,
                        buttons: {
                            Save: function () {
                                SaveChargesCalculatedManually();
                            },
                            Cancel: function () {
                                $(this).dialog("close");
                                $("#divChargesCalculatedManually").html("");
                                $("#chkChargesfinalized").removeAttr("checked");
                            }
                        },
                        close: function () {
                            $(this).dialog("close");
                            $("#divChargesCalculatedManually").html("");
                            $("#chkChargesfinalized").removeAttr("checked");
                        }
                    });
        }
    });
});


var shipmentType = "";
var totalHandlingCharges = 0;
var totalAmountDO = 0;
var totalServiceCharges = 0;
var MendatoryHandlingCharges = new Array();
var rowId;
var pValue = 0;
var sValue = 0;
var IsPartDo = 0;
var IsHouseDo = 0;
var FOCConsigneeSNo = 0;
var subprocesssno;
var temp = "";
var IsTruckAgentOrVendor;
var PaymentRow = '';
var tempAccountSNo = '';
var AvailableCreditLimit = 0;
var DocAvailableCreditLimit = 0;
var ValDocAvailableCreditLimit = 0;

function LoadRFSDetails() {
    _CURR_PRO_ = "RFSSearch";
    $.ajax({
        url: "Services/RFS/RFSService.svc/GetWebForm/" + _CURR_PRO_ + "/RFS/RFSSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#divContent").html(divContent);
            //$('#searchFlightDate').data("kendoDatePicker").value("");
            $('#FromFlightDate').data("kendoDatePicker").value("");
            $('#ToFlightDate').data("kendoDatePicker").value("");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vwRFSFlightNo", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            var FlightStatusType = [{ Key: "FLTAST", Text: "Pending for Flight Assignment" }, { Key: "MAN", Text: "Pending for Manifest" }, { Key: "DEP", Text: "Pending for Departure" }, { Key: "CHRGS", Text: "Pending for Charges" }, { Key: "CNCL", Text: "Cancelled Flight" }, { Key: "NIL", Text: "NIL Manifested" }];
            cfi.AutoCompleteByDataSource("searchFlightStatus", FlightStatusType);

            $("#Text_searchFlightStatus").css("width", "190px");
            $("#Text_searchFlightStatus").closest("span").css("width", "190px");

            $("#divFooter").html(fotter).show();
            $("#divAction").hide();

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#FromFlightDate").change(function () {
                ValidateDate();
            });

            $("#ToFlightDate").change(function () {
                ValidateDate();
            });

            RFSSearch();
            $("#btnSearch").bind("click", function () {
                ClearDiv();
                RFSSearch();
            });

            var TableRFSTruckDetailsSNo;
            $("#btnNew").bind("click", function () {
                var newBooking = "BindTruckDetails";
                RFSTruckDetailsSNo = '0';
                if (RFSTruckDetailsSNo == '0')
                    $("#btnSave").css("display", "block");
                else
                    $("#btnSave").css("display", "none");
                RFSTruckDetails(newBooking, 0);
            });

            $("#btnCancel").bind("click", function () {
                ClearDiv();
            });

            $(document).on("change", "input[name='TruckSource']", function () {
                TruckSourceChange();
            });

            $(document).on("change", "input[name='TruckDate']", function () {
                $("#TruckNo").val('');
                $("#Text_TruckNo").val('');
            });


            //$(document).on("change", "input[name='chkBillToAgent']", function () {
            //    if (RFSTruckDetailsSNo != undefined || RFSTruckDetailsSNo != "") {
            //        $.ajax({
            //            url: "Services/RFS/RFSService.svc/GetAgentInformation", async: false, type: "POST", dataType: "json", cache: false,
            //            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
            //            contentType: "application/json; charset=utf-8",
            //            success: function (result) {
            //                var Data = jQuery.parseJSON(result);
            //                var resData = Data.Table0;
            //                if (resData.length > 0) {
            //                    var AccountSNo = resData[0].AccountSNo;
            //                    tempAccountSNo = resData[0].AccountSNo;
            //                    AvailableCreditLimit = AccountSNo.split('?')[1];
            //                    if (AccountSNo.split('?')[0] == '1') {
            //                        $("#spnRFSChargesBill").find("input[id=chkBillToAgent]").removeAttr("checked");
            //                        ShowMessage("warning", "Warning - Bill To Agent", "Agent details not found, Update truck details for bill to agent.")
            //                    }
            //                }
            //            }
            //        });
            //    }
            //    CheckBillToAgent(tempAccountSNo);
            //});

            $(document).on("change", "input[name='DockCredit']", function () {
                $("#billToDockingVendor").val("");
                $("#Text_billToDockingVendor").val("");
                GetVendorCreditLimitInformation(($("#billToDockingVendor").val() == "" || $("#billToDockingVendor").val() == undefined) ? 0 : $("#billToDockingVendor").val());
            });

            $("#Text_billToDockingVendor").live('blur', function () {
                if ($("#Text_billToDockingVendor").val() == "")
                    $("#billToDockingVendor").val("");
                GetVendorCreditLimitInformation(($("#billToDockingVendor").val() == "" || $("#billToDockingVendor").val() == undefined) ? 0 : $("#billToDockingVendor").val());
            });


            $("#Text_DriverName").live('blur', function () {
                if ($("#Text_DriverName").val() == "" || $("#DriverName").val() == "0" || $("#DriverName").val() == "") {
                    $("#DriverID").val("");
                    $("#MobileNo").val("");
                    $("#DriverName").val("");
                    $("#Text_DriverName").val("");
                }
            });

            //##############################################################################################################---------------------------------------//
            // Start Save RFS
            //##############################################################################################################---------------------------------------//
            $("#btnSave").unbind("click").bind("click", function () {

                // Save Truck Details
                SaveTruckDetails(RFSTruckDetailsSNo);

                // Save Assign Flight Details
                SaveAssignFlightDetails();

                // Save RFS Manifest
                RFSSaveManifest(RFSTruckDetailsSNo);

                // Save Departure Details
                SaveDepartureDetails();

                // Save RFS Charges Details
                if ($("#divareaTrans_rfs_rfscharges").length > 0)
                    SaveRFSChargesDetails(RFSTruckDetailsSNo, IsTruckAgentOrVendor);

                SaveOtherInfoDetails(RFSTruckDetailsSNo);

            });

            //##############################################################################################################---------------------------------------//
            // End Save RFS
            //##############################################################################################################---------------------------------------//

            $("#ETA,#ETD,#ATD").live("keypress", function (evt) {
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
        }
    });
}

function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}

function IsValidateDecimalNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode
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
    if (caratPos > dotPos && dotPos > -1 && (number[1].length > 1)) {
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

function setshowmsg(ss) {
    var lenCss = 4;
    if (ss.length <= 500)
        lenCss = 4;
    else if (ss.length >= 500 && ss.length <= 750)
        lenCss = 12;
    else if (ss.length >= 750 && ss.length <= 1000)
        lenCss = 16;
    return lenCss;
}

function ValidateDate() {
    var fromDate = $("#FromFlightDate").attr("sqldatevalue");
    var toDate = $("#ToFlightDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $('#FromFlightDate').data("kendoDatePicker").value("");
            $('#ToFlightDate').data("kendoDatePicker").value("");
            $("#FromFlightDate").val("");
            $("#ToFlightDate").val("");
            ShowMessage('warning', 'Warning - RFS', "From date should not be greater than To date.");
        }
    }
}


function onBillToSelect(e) {
    cfi.ResetAutoComplete("BillToSNo");
    $("#Text_BillToSNo").closest('.k-widget').show();
    if ($('#BillType').val() == '0') {

        $('#spnBillToSNo').text('Agent Name');
        var data = GetDataSource("BillToSNo", "Account", "SNo", "Name", ["Name"], null);
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Agent.');
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
        });
    }
    else if ($('#BillType').val() == '1') {

        $('#spnBillToSNo').text('Airline Name');
        var data = GetDataSource("BillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Airline.');

        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
        });
    }
}

function GetVendorCreditLimitInformation(AccountSNo) {
    if ($('input[name="DockCredit"]:checked').val() == 1 && TruckSource == 2) {
        if (RFSTruckDetailsSNo != undefined || RFSTruckDetailsSNo != "") {
            $.ajax({
                url: "Services/RFS/RFSService.svc/GetVendorCreditLimitInformation", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AccountSNo: AccountSNo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    $("span#spnDockAvailableCredit").text("");
                    $("span#spnDockAvailableCreditAmount").text("");
                    if (resData.length > 0) {
                        DocAvailableCreditLimit = "Available Credit Limit: " + resData[0].RemainingCreditLimit;
                        ValDocAvailableCreditLimit = resData[0].RemainingCreditLimit;
                        if (parseFloat(resData[0].RemainingCreditLimit) == 0) {
                            ShowMessage("warning", "Warning - Credit Limit", DocAvailableCreditLimit);
                            $('input[name=DockCredit][value=0]').attr('checked', true);
                            return;
                        }
                        else {
                            $("span#spnDockAvailableCredit").text("Available Credit Limit: ");
                            $("span#spnDockAvailableCreditAmount").text(ValDocAvailableCreditLimit);
                        }
                    }
                }
            });
        }
    }
    else {
        $("span#spnDockAvailableCredit").text("");
        $("span#spnDockAvailableCreditAmount").text("");
    }
}

function RFSSaveManifest(RFSTruckDetailsSNo) {
    if ($("#ulTab").find("li").length > 0) {
        $.ajax({
            url: "Services/RFS/RFSService.svc/RFSSaveManifest", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo, UWS: $("#chkUWS").is(":checked") ? "1" : "0" }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    if (resData[0].Column1.split('?')[0] == "0") {
                        ShowMessage('success', 'Success - RFS Truck Details', "Details Saved Successfully");
                        $("#spnUWS").hide();
                        RFSSearch();
                        return;
                    }
                    else if (resData[0].Column1.split('?')[0] == "100001") {
                        ShowMessage('warning', 'Warning - RFS Truck Details', "Truck is Already Manifested.");
                        return;
                    }
                    else if (resData[0].Column1.split('?')[0] == "100002") {
                        ShowMessage('warning', 'Warning - RFS Manifest', resData[0].Column1.split('?')[1]);
                        $("#cfMessage-container").css("margin-top", setshowmsg(resData[0].Column1.split('?')[1]) + "%");
                        //ShowMessage('warning', 'Warning - RFS Truck Details', "UWS not processed for all shipments planned in Manifest. Kindly check again.");
                        return;
                    }
                }
            }
        });
    }
}

function ClearDiv() {
    $("#tabstrip").html('');
    $("#ulTab").html('');
    $("#truckDetails").html('');
    $("#departureDetails").html('');
    $("#chargesDetails").html('');
    $("#otherInfoDetails").html('');
    $("#assignFlightDetails").html('');
    $("#btnNew").css("display", "block");
    $("#btnSave").css("display", "block");
    $("#divPrintManifest").html("");
    $("#btnRFSPrint").hide();
    RFSTruckDetailsSNo = "0";
}

function ValidationSaveTruckDetails() {
    if ($("#TruckDate").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck Date.");
        return false;
    }
    if ($("#TruckNo").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck No.");
        return false;
    }
    if ($("#OriginAirport").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Origin Airport.");
        return false;
    }
    if ($("#DestinationAirport").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Destination Airport.");
        return false;
    }
    if ($("#ETD").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter ETD.");
        return false;
    }
    if ($("#ETA").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter ETD.");
        return false;
    }

    if ($('#TruckSource:checked').val() == "1" && ($("#Text_Vendor").val() == "" || $("#Text_Vendor").val() == undefined)) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Select SAS Vendor.");
        return false;
    }

    if ($('#TruckSource:checked').val() == "2" && ($("#Text_Vendor").val() == "" || $("#Text_Vendor").val() == undefined)) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Select Airline Vendor.");
        return false;
    }

    if ($('#TruckSource:checked').val() == "1" && $("#Text_Vendor").val() != "" && ($("#HiringCharges").val() == "" || $("#HiringCharges").val() == "0")) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Hiring Charges.");
        return false;
    }

    if ($("#TruckType").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck Type.");
        return false;
    }

    if ($('#TruckSource:checked').val() == "0" && ($("#SASTruckRegistrationNo").val() == "" || $("#SASTruckRegistrationNo").val() == "0")) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Select Truck Registration No.");
        return false;
    }

    if ($("#TruckRegistrationNo").val() == "" && $('#TruckSource:checked').val() != "0") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck Registration No.");
        return false;
    }
    if ($("#TruckCapacity").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck Capacity.");
        return false;
    }

    if ($('#TruckSource:checked').val() == "0" && ($("#SASDriverName").val() == "" || $("#SASDriverName").val() == "0")) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Select Driver Name.");
        return false;
    }

    if ($("#DriverName").val() == "" && $('#TruckSource:checked').val() != "0") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Driver Name.");
        return false;
    }

    if ($("#MobileNo").val().length > 0 && $("#MobileNo").val().length < 7) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter valid Mobile No.");
        return false;
    }

    return true;
}

function ValidationSaveDepartureDetails() {
    if ($("#DateOfDeparture").val() == "" || $("#DateOfDeparture").attr("sqldatevalue") == "") {
        ShowMessage('warning', 'Warning - Departure Details', "Enter Departure Date.");
        return false;
    }
    if ($("#ATD").val() == "") {
        ShowMessage('warning', 'Warning - Departure Details', "Enter ATD.");
        return false;
    }
    if (TruckType != 'EMPTY CONTAINER MOVEMENT') {
        if ($("#SealNo").val() == "") {
            ShowMessage('warning', 'Warning - Departure Details', "Enter Seal No.");
            return false;
        }
        if ($("#IPTANo").val() == "") {
            ShowMessage('warning', 'Warning - Departure Details', "Enter IPTA No.");
            return false;
        }
        if ($("#SealPersonName").val() == "") {
            ShowMessage('warning', 'Warning - Departure Details', "Enter Seal Person Name.");
            return false;
        }
    }
    //if ($("#RFSMovementNo").val() == "") {
    //    ShowMessage('warning', 'Warning - Departure Details', "Enter RFS Movement No.");
    //    return false;
    //}

    if ($("#ATD").val() != "" && $("#DateOfDeparture").attr("sqldatevalue") != "") {
        var departureDateTime = $("#DateOfDeparture").attr("sqldatevalue") + ' ' + $("#ATD").val();
        var truckDateTime = GetDate(CurrentTruckDate).replace(' ', '').replace(' ', '') + ' ' + CurrentETD;

        if (new Date(departureDateTime) > new Date(truckDateTime).setMinutes(new Date(truckDateTime).getMinutes() + 10)) {
            if ($("#DelayRemarks").val() == "") {
                ShowMessage("warning", "Warning - Truck Departure", "Enter Delay Remarks.");
                return false;
            }
        }
    }

    return true;
}

function ValidationOtherInfoDetails() {
    if ($("#InvoiceNo").val() == "") {
        ShowMessage('warning', 'Warning - Other Info Details', "Enter Invoice No.");
        return false;
    }
    if ($("#SealCharges").val() == "" || parseFloat($("#SealCharges").val()) == 0) {
        ShowMessage('warning', 'Warning - Other Info Details', "Enter Seal Charges.");
        return false;
    }
    return true;
}

// Save Truck Details
function SaveTruckDetails(RFSTruckDetailsSNo) {

    if ($("#__tblrfstruckinformation__").length != 0) {

        if (cfi.IsValidSection('__divrfstruckinformation__')) {

            //Validation
            if (!ValidationSaveTruckDetails()) return;

            var TruckDetails = [];
            var truckDetailsData = {
                DailyFlightSNo: $("#TruckNo").val(),
                TruckNo: $("#Text_TruckNo").val(),
                TruckDate: $("#TruckDate").attr("sqldatevalue"),
                OriginAirportSNo: $("#OriginAirport").val(),
                DestinationAirportSNo: $("#DestinationAirport").val(),
                ETD: $("#ETD").val(),
                ETA: $("#ETA").val(),
                TruckSource: $('#TruckSource:checked').val(),
                AccountSNo: $("#Vendor").val(),
                AgendOrVendorName: $("#Text_Vendor").val(),
                HiringCharges: $("#HiringCharges").val() == "" ? 0 : $("#HiringCharges").val(),
                AircraftSNo: $("#TruckType").val(),
                TruckRegistrationNo: $('#TruckSource:checked').val() == '0' ? '' : $("#TruckRegistrationNo").val(),
                SASTruckRegistrationNoSNo: $('#TruckSource:checked').val() == '0' ? ($("#SASTruckRegistrationNo").val() == undefined || $("#SASTruckRegistrationNo").val() == '') ? 0 : $("#SASTruckRegistrationNo").val() : 0,
                SASTruckRegistrationNo: $('#TruckSource:checked').val() == '0' ? ($("#Text_SASTruckRegistrationNo").val() == undefined || $("#Text_SASTruckRegistrationNo").val() == '') ? '' : $("#Text_SASTruckRegistrationNo").val() : '',
                TruckCapacity: $("#TruckCapacity").val(),
                //DriverMasterSNo: $("#DriverName").val(),
                //DriverName: $("#Text_DriverName").val(),

                DriverMasterSNo: $('#TruckSource:checked').val() == '0' ? $("#SASDriverName").val() : '',
                DriverName: $('#TruckSource:checked').val() == '0' ? ($("#Text_SASDriverName").val() == undefined || $("#Text_SASDriverName").val() == '') ? '' : $("#Text_SASDriverName").val() : $("#DriverName").val(),
                DriverID: $("#DriverID").val() == undefined ? "" : $("#DriverID").val(),
                MobileNo: $("#MobileNo").val() == undefined ? "" : $("#MobileNo").val(),
                ScheduleTrip: $('#ScheduleTrip:checked').val() == "0" ? 1 : 0,//$('#ScheduleTrip:checked').val(),
                Location: $("#Text_Location").data("kendoAutoComplete").key()
            }

            //---------
            TruckDetails.push(truckDetailsData);

            $.ajax({
                url: "Services/RFS/RFSService.svc/SaveTruckDetails", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TruckDetails: TruckDetails, AirportCode: userContext.AirportCode, RFSTruckDetailsSNo: (RFSTruckDetailsSNo == "" || RFSTruckDetailsSNo == undefined) ? '0' : RFSTruckDetailsSNo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        RFSSearch();
                        ShowMessage('success', 'Success - RFS Truck Details', "Details Saved Successfully");
                        RFSTruckDetailsSNo = "0";
                        $("#truckDetails").html('');
                        return;
                    }
                    else if (result == "100001") {
                        ShowMessage('warning', 'Warning - RFS Truck Details', "Truck details already exists.");
                        return;
                    }
                    else {
                        ShowMessage('warning', 'Warning - RFS Truck Details', "Unable to save data.");
                        return;
                    }
                },
                error: function () {
                    ShowMessage('warning', 'Warning - RFS Truck Details', "Unable to save data.");
                    return;
                }
            });
        }
        else {
            return false
        }
    }
}

function SuccessRFSGrid() {
    $('#divRFSDetails table tbody tr').each(function (row, tr) {
        if ($(tr).find("td[data-column='Status']").text().toUpperCase() == "NIL Manifested".toUpperCase())
            $(tr).css('background-color', 'rgba(204, 39, 39, 0.219608)');
        else if ($(tr).find("td[data-column='Status']").text().toUpperCase() == "Cancelled".toUpperCase())
            $(tr).css('background-color', 'rgba(204, 39, 39, 0.219608)');
        else
            $(tr).removeAttr("background-color");
    });
}

function GetRFSFreightChargesByPosition(e, objVal) {
    var RateAirlineMasterSNo = ($(e).closest("tr").find("td[data-column='RateAirlineMasterSNo']").text() == "") ? 0 : $(e).closest("tr").find("td[data-column='RateAirlineMasterSNo']").text();
    var ChargeableUnit = ($(e).closest("tr").find("#txtChargeableUnit").val() == "") ? 0 : $(e).closest("tr").find("#txtChargeableUnit").val();
    var txtAmount = ($(e).closest("tr").find("#txtAmount").val() == "") ? 0 : $(e).closest("tr").find("#txtAmount").val();

    //if (RateAirlineMasterSNo == 0) {
    //    $(e).closest("tr").find("#txtTotalAmount").val(txtAmount);
    //    return;
    //}

    $.ajax({
        url: "Services/RFS/RFSService.svc/GetRFSFreightChargesByPosition", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RateAirlineMasterSNo: RateAirlineMasterSNo, ChargeableUnit: ChargeableUnit, ObjVal: objVal, Amount: (objVal == 1) ? 0 : txtAmount }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            $(e).closest("tr").find("#txtAmount").val("");
            $(e).closest("tr").find("#txtAmount").val(resData[0].Amount);
            $(e).closest("tr").find("td[data-column='TaxType']").html('<sapn title="' + resData[0].TaxType + '" style="font-weight:bold;">' + resData[0].TaxType + '</sapn>');
            $(e).closest("tr").find("#txtTaxAmount").val(resData[0].TaxAmount);
            $(e).closest("tr").find("#txtTotalAmount").val(resData[0].TotalAmount);
        }
    });
}

function GetRFSCustomChargesByAmount(e) {
    var RateAirlineMasterSNo = ($(e).closest("tr").find("td[data-column='RateAirlineMasterSNo']").text() == "") ? 0 : $(e).closest("tr").find("td[data-column='RateAirlineMasterSNo']").text();
    var RateAirlineCustomChargesSNo = ($(e).closest("tr").find("td[data-column='RateAirlineCustomChargesSNo']").text() == "") ? 0 : $(e).closest("tr").find("td[data-column='RateAirlineCustomChargesSNo']").text();
    var txtAmount = ($(e).closest("tr").find("#txtCustomAmount").val() == "") ? 0 : $(e).closest("tr").find("#txtCustomAmount").val();

    //if (RateAirlineMasterSNo == 0) {
    //    $(e).closest("tr").find("#txtCustomTotalAmount").val(txtAmount);
    //    return;
    //}

    $.ajax({
        url: "Services/RFS/RFSService.svc/GetRFSCustomChargesByAmount", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RateAirlineMasterSNo: RateAirlineMasterSNo, RateAirlineCustomChargesSNo: RateAirlineCustomChargesSNo, Amount: txtAmount }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            $(e).closest("tr").find("#txtCustomAmount").val("");
            $(e).closest("tr").find("#txtCustomAmount").val(resData[0].Amount);
            $(e).closest("tr").find("td[data-column='TaxType']").html('<sapn title="' + resData[0].TaxType + '" style="font-weight:bold;">' + resData[0].TaxType + '</sapn>');
            $(e).closest("tr").find("#txtCustomTaxAmount").val(resData[0].TaxAmount);
            $(e).closest("tr").find("#txtCustomTotalAmount").val(resData[0].TotalAmount);
        }
    });
}

function OnSelectChargeableUnit(e) {
    var chUnit = $(e).val();
    var chULDCount = $(e).closest("tr").find("span[id^='ULDCount']").text();
    var chMinULDCount = $(e).closest("tr").find("input[id^='MinULDCount']").val();

    if (chUnit != "") {
        if (chUnit == "0" || chUnit == 0) {
            $(e).val("");
            ShowMessage("warning", "Warning - RFS ASSIGN FLIGHT", "Chargeable Unit can not " + chUnit);
            return;
        }
        if (parseFloat(chUnit) < parseFloat(chMinULDCount)) {
            $(e).val("");
            ShowMessage("warning", "Warning - Chargeable Unit", "Chargeable Units can not be less than Nbr of Units.");
            return;
        }

        arrAssignFlightNo = [];
        var arrList = [];

        $(e).closest("table").find("tr[id^='areaTrans_rfs_rfsassignflightinformation']").each(function () {
            if ($(this).closest("tr").find("input[id^='Text_AssignFlightNo']").val() != "" && $(this).closest("tr").find("input[id^='ChargeableUnit']").val() != "") {
                var _AssignFlightNo = $(this).closest("tr").find("input[id^='Text_AssignFlightNo']").val().substring(0, 2);
                var _ChargeableUnit = $(this).closest("tr").find("input[id^='ChargeableUnit']").val();
                arrAssignFlightNo.push(
                   {
                       AssignFlightNo: _AssignFlightNo,
                       ChargeableUnit: _ChargeableUnit
                   });
                if ((arrList.length > 0 && $.inArray(_AssignFlightNo, arrList) == -1) || arrList.length == 0)
                    arrList.push(
                        _AssignFlightNo
                    );
            }
        });

        //var TotalChUnit = 0;
        //if (arrAssignFlightNo != null && arrAssignFlightNo.length > 0) {
        //    for (var k = 0; k < arrList.length; k++) {
        //        {
        //            TotalChUnit = 0;
        //            for (var i = 0; i < arrAssignFlightNo.length; i++) {
        //                if (arrList[k] == arrAssignFlightNo[i]["AssignFlightNo"]) {
        //                    TotalChUnit = TotalChUnit + parseInt(arrAssignFlightNo[i]["ChargeableUnit"]);
        //                }
        //            }
        //            if (TotalChUnit > 16) {
        //                $(e).val("");
        //                ShowMessage("warning", "Warning - Chargeable Unit", "Chargeable Units can not be greater than 16 in one airline.");
        //                return;
        //            }
        //        }
        //    }
        //}
    }
}

// Save Assign Flight Details
function SaveAssignFlightDetails() {
    if ($("#tblrfsassignflightinformation").length != 0) {
        if (cfi.IsValidSection('__divrfsassignflightinformation__')) {

            var AssignFlightDetails = [];

            $("div[id$='divareaTrans_rfs_rfsassignflightinformation']").find("[id^='areaTrans_rfs_rfsassignflightinformation']").each(function () {

                var assignFlightDetailsData = {
                    RFSTruckDetailsSNo: TableRFSTruckDetailsSNo,
                    DailyFlightSNo: $(this).find("input[id^='AssignFlightNo']").val(),
                    AssignFlightNo: $(this).find("input[id^='Text_AssignFlightNo']").val().trim(),
                    AssignFlightDate: $(this).find("input[id^='AssignFlightDate']").attr("sqldatevalue"),
                    CalculatedPosition: $(this).find("input[id^='CalculatedPosition']").val(),
                    ChargeableUnit: $(this).find("input[id^='ChargeableUnit']").val(),
                    ULDCount: $(this).find("span[id^='ULDCount']").text(),
                    MinULDCount: $(this).find("input[id^='MinULDCount']").val(),
                    IsBulkCount: $(this).find("input[id^='IsBulkCount']").val(),
                    IsULDCount: $(this).find("input[id^='IsULDCount']").val(),
                    IsMinBulkCount: $(this).find("input[id^='IsMinBulkCount']").val(),
                    IsMinULDCount: $(this).find("input[id^='IsMinULDCount']").val()
                };

                AssignFlightDetails.push(assignFlightDetailsData);
            });

            $.ajax({
                url: "Services/RFS/RFSService.svc/SaveAssignFlightDetails", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AssignFlightDetails: AssignFlightDetails, AirportCode: userContext.AirportCode, RFSTruckDetailsSNo: TableRFSTruckDetailsSNo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success', "Details Saved Successfully");
                        RFSSearch();
                    }
                    else if (result == "991001") {
                        ShowMessage('warning', 'Warning', "Difference found in number of units. Kindly re-assign the chosen flights.");
                        return;
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
        else { return false; }
    }
}

// Save Departure Details
function SaveDepartureDetails() {
    if ($("#tblrfsdepartureinformation").length != 0) {

        if (cfi.IsValidSection('__divrfsdepartureinformation__')) {

            if (!ValidationSaveDepartureDetails()) return;

            var DepartureDetails = [];
            var departureDetailsData = {
                RFSTruckDetailsSNo: TableRFSTruckDetailsSNo,
                DepartureDate: $("#DateOfDeparture").attr("sqldatevalue"),
                ATD: $("#ATD").val(),
                SealNo: $("#SealNo").val(),
                IPTANo: $("#IPTANo").val(),
                SealPersonName: $("#SealPersonName").val(),
                //RFSMovementNo: $("#RFSMovementNo").val(),
                DRemarks: $("#DRemarks").val() == undefined ? "" : $("#DRemarks").val(),
                DelayRemarks: $("#DelayRemarks").val() == undefined ? "" : $("#DelayRemarks").val()
            }

            //---------
            DepartureDetails.push(departureDetailsData);

            $.ajax({
                url: "Services/RFS/RFSService.svc/SaveDepartureDetails", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ DepartureDetails: DepartureDetails, AirportCode: userContext.AirportCode }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success - RFS Departure Details', "Details Saved Successfully");
                        RFSSearch();
                        return;
                    }
                    else if (result == "100001") {
                        ShowMessage('warning', 'Warning - RFS Departure Details', "Truck already Departed.");
                        return;
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
        else {
            return false
        }
    }
}

function SaveOtherInfoDetails(RFSTruckDetailsSNo) {
    if ($("#tblrfsotherinfoxml").length != 0) {
        if (cfi.IsValidSection('__divrfsotherinfoxml__')) {
            if (!ValidationOtherInfoDetails()) return;
            var InvoiceNo = $("#InvoiceNo").val();
            var SealCharges = $("#SealCharges").val();
            $.ajax({
                url: "Services/RFS/RFSService.svc/SaveOtherInfoDetails", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo, InvoiceNo: InvoiceNo, SealCharges: SealCharges }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {
                        if (resData[0].Column1 == '0') {
                            ShowMessage('success', 'Success - Other Info Details', "Details Saved Successfully");
                            RFSSearch();
                            return;
                        }
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
    }
}

function GetDate(str) {
    var arr = str.split("-");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = ('0' + (months.indexOf(arr[1]) + 1)).slice(-2);
    var final = arr[2] + '-' + month + '-' + arr[0];
    return final;
}

function ClearDepartureDetails() {
    $('#DateOfDeparture').data("kendoDatePicker").value("");
    $('#ATD').val('');
    $('#SealNo').val('');
    $('#IPTANo').val('');
    $('#SealPersonName').val('');
    $('#RFSMovementNo').val('');
}

function RFSSearch() {
    $("#tabstrip").html('');
    $("div#tabstrip").hide();
    $("#otherInfoDetails").html('');
    var SearchFlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val();
    //var SearchFlightDate = "0";
    //SearchFlightDate = $("#searchFlightDate").attr("sqldatevalue") == "" ? "0" : $("#searchFlightDate").attr("sqldatevalue");

    var SearchFromFlightDate = "0";
    var SearchToFlightDate = "0";
    var SearchFlightStatus = $("#searchFlightStatus").val() == "" ? "A~A" : $("#searchFlightStatus").val();
    SearchFromFlightDate = $("#FromFlightDate").attr("sqldatevalue") == "" ? "0" : $("#FromFlightDate").attr("sqldatevalue");
    SearchToFlightDate = $("#ToFlightDate").attr("sqldatevalue") == "" ? "0" : $("#ToFlightDate").attr("sqldatevalue");

    cfi.ShowIndexView("divRFSDetails", "Services/RFS/RFSService.svc/GetGridData/RFS/RFS/RFS/" + SearchFlightNo + "/" + SearchFromFlightDate + "/" + SearchToFlightDate + "/" + SearchFlightStatus);


}

var RFSTruckDetailsSNo;
var DailyFlightSNo;
var CurrentTruckOrigin;
var CurrentTruckDestination;
var CurrentETD;
var CurrentTruckNo;
var CurrentTruckDate;
var IsTruck;
var IsAssignFlight;
var IsManifested;
var IsCharges;
var IsDeparted;
var TruckSource;
var CurrentAccountSNo;
var AgendOrVendorName;
var ChargesCalculatedManually;
var TruckType;
var ChargesRemarks;
var TruckLocation;
var TruckCarrierCode;

function BindEvents(obj, e, isdblclick) {
    var subprocess = $(obj).attr("process").toUpperCase();
    subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    RFSTruckDetailsSNo = closestTr.find("td[data-column='SNo']").text();
    DailyFlightSNo = closestTr.find("td[data-column='DailyFlightSNo']").text();
    CurrentTruckOrigin = closestTr.find("td[data-column='Origin']").text();
    CurrentTruckDestination = closestTr.find("td[data-column='Destination']").text();
    CurrentTruckNo = closestTr.find("td[data-column='TruckNo']").text();
    CurrentTruckDate = closestTr.find("td[data-column='TruckDate']").text();
    CurrentETD = closestTr.find("td[data-column='ETD']").text();
    IsTruck = closestTr.find("td[data-column='IsTruck']").text();
    IsAssignFlight = closestTr.find("td[data-column='IsAssignFlight']").text();
    IsManifested = closestTr.find("td[data-column='IsManifested']").text();
    IsCharges = closestTr.find("td[data-column='IsCharges']").text();
    IsDeparted = closestTr.find("td[data-column='IsDeparted']").text();
    TruckSource = closestTr.find("td[data-column='TruckSource']").text();
    CurrentAccountSNo = closestTr.find("td[data-column='AccountSNo']").text();
    AgendOrVendorName = closestTr.find("td[data-column='AgendOrVendorName'] span").text();
    ChargesCalculatedManually = closestTr.find("td[data-column='ChargesCalculatedManually']").text();
    ChargesRemarks = closestTr.find("td[data-column='ChargesRemarks']").text();
    TruckType = closestTr.find("td[data-column='TruckType']").text();
    TruckLocation = closestTr.find("td[data-column='TruckLocation']").text();
    TruckCarrierCode = CurrentTruckNo.substr(0, CurrentTruckNo.indexOf('-'));

    ShowProcessDetails(obj, RFSTruckDetailsSNo, DailyFlightSNo, subprocess, isdblclick, subprocesssno);

    if (subprocess == "RFSTRUCK") {
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == 2289) {
                if (e.IsView == true) {
                    $("#divFooter").css("display", "none");
                }
                else {
                    $("#divFooter").css("display", "block");
                }
            }
        });
    }
    if (subprocess == "RFSASSIGNFLIGHT") {
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == 2290) {
                if (e.IsView == true) {
                    $("#divFooter").css("display", "none");
                }
                else {
                    $("#divFooter").css("display", "block");
                }
            }
        });
    }
    if (subprocess == "RFSTRUCKMANIFEST") {
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == 2291) {
                if (e.IsView == true) {
                    $("#divFooter").css("display", "none");
                }
                else {
                    $("#divFooter").css("display", "block");
                }
            }
        });
    }
    if (subprocess == "RFSCHARGE") {
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == 2292) {
                if (e.IsView == true) {
                    $("#divFooter").css("display", "none");
                }
                else {
                    $("#divFooter").css("display", "block");
                }
            }
        });
    }
    if (subprocess == "RFSDEPARTURE") {
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == 2293) {
                if (e.IsView == true) {
                    $("#divFooter").css("display", "none");
                }
                else {
                    $("#divFooter").css("display", "block");
                }
            }
        });
    }
}

function FnGetFlightInfo(DailyFlightSNo, divID) {
    cfi.ShowIndexView("divManifestULDDetail_" + divID, "Services/RFS/RFSService.svc/GetFlightTransGridData/RFS/RFS/MANIFESTULD/" + DailyFlightSNo + "/PRE");
    cfi.ShowIndexView("divManifestULDStackDetail_" + divID, "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/ULDSTACK/" + DailyFlightSNo + "/STACK");
}

var arrFlightNo = new Array();
function ShowProcessDetails(obj, RFSTruckDetailsSNo, DailyFlightSNo, subprocess, isdblclick, subprocesssno) {
    $("#btnNew").css("display", "none");
    $("#tabstrip").html('');
    $("#ulTab").html('')
    $("#divPrint").remove();
    $("#divPrintManifest").html("");
    if ($("#tabstrip").length === 0)
        $("#divRFSDetails").after("<div id='tabstrip'></div><div id='truckDetails'></div><div id='departureDetails'></div><div id='assignFlightDetails'></div><div id='chargesDetails'></div><div id='otherInfoDetails'></div>")

    //-------------------------------------------------------------------------------------------------------------------//
    // Truck Details
    //-------------------------------------------------------------------------------------------------------------------//

    if (subprocess.toUpperCase() == "RFSTRUCK") {
        //if (IsManifested == "1") {
        //    $("#btnSave").css("display", "none");
        //}
        //else {
        //    $("#btnSave").css("display", "block");
        //}
        RFSTruckDetails(obj, RFSTruckDetailsSNo);
        $("#btnNew").css("display", "block");
    }

    //-------------------------------------------------------------------------------------------------------------------//
    // Assign Flight
    //-------------------------------------------------------------------------------------------------------------------//
    if (subprocess.toUpperCase() == "RFSASSIGNFLIGHT") {
        $("#truckDetails").html('');
        $("#departureDetails").html('');
        $("#chargesDetails").html('');
        $("#divPrintManifest").html("");
        $("#otherInfoDetails").html('');
        if (IsManifested == "1") {
            $("#btnSave").css("display", "none");
        }
        else {
            $("#btnSave").css("display", "block");
        }

        TableRFSTruckDetailsSNo = (RFSTruckDetailsSNo == "") ? '0' : RFSTruckDetailsSNo;
        $.ajax({
            url: "Services/RFS/RFSService.svc/GetWebForm/RFS/RFS/RFSAssignFlightInformation/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#assignFlightDetails").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                InitializePage("RFSAssignFlightInformation", 'divContent');
            }
        });
    }

    //-------------------//
    // Truck Manifest
    //-------------------//
    if (subprocess.toUpperCase() == "RFSTRUCKMANIFEST") {
        BindTruckManifest();
    }

    //-------------------//
    // Departure
    //-------------------//
    if (subprocess.toUpperCase() == "RFSDEPARTURE") {
        $("#truckDetails").html('');
        $("#assignFlightDetails").html('');
        $("#chargesDetails").html('');
        $("#divPrintManifest").html("");
        $("#otherInfoDetails").html('');
        $("#btnSave").css("display", "block");

        TableRFSTruckDetailsSNo = RFSTruckDetailsSNo;

        if (IsAssignFlight == "0") {
            ShowMessage("warning", "Warning - RFS Charges", "Flight not assigned.");
            return;
        }

        if (IsManifested == "0") {
            ShowMessage("warning", "Warning - RFS Charges", "Manifest is not created, details can not be saved.");
            return;
        }

        $.ajax({
            url: "Services/RFS/RFSService.svc/GetWebForm/RFS/RFS/RFSDepartureInformation/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#departureDetails").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                InitializePage("RFSDepartureInformation", 'divContent');
            }
        });
    }

    //-------------------//
    // Charge
    //-------------------//

    if (subprocess.toUpperCase() == "RFSCHARGE") {
        $("#truckDetails").html('');
        $("#assignFlightDetails").html('');
        $("#departureDetails").html('');
        $("#otherInfoDetails").html('');
        $("#divPrintManifest").html("");
        $("#btnSave").css("display", "block");

        TableRFSTruckDetailsSNo = RFSTruckDetailsSNo;
        $("#chargesDetails").html('');
        IsTruckAgentOrVendor = $(obj).closest("tr").find("td[data-column='IsTruckAgentOrVendor']").text();

        if (IsCharges == "1" && ChargesCalculatedManually == "1") {
            ShowMessage('info', 'Need your kind attention - Charges finalized Manually', ChargesRemarks);
            $("#cfMessage-container").css("top", "100px");
            return;
        }

        BindRFSChargesInformation(RFSTruckDetailsSNo, IsTruckAgentOrVendor);

        if ($("#tblResult").length > 0)
            return;

        if (IsAssignFlight == "0") {
            ShowMessage("warning", "Warning - RFS Charges", "Flight not assigned.");
            return;
        }

        if (IsManifested == "0") {
            ShowMessage("warning", "Warning - RFS Charges", "Manifest is not created, details can not be saved.");
            return;
        }

        $.ajax({
            url: "Services/RFS/RFSService.svc/GetWebForm/RFS/RFS/RFSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#chargesDetails").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");

                var ShipmentDetailArray = [];
                var ShipmentDetailViewModel = {
                    PartNumber: 0,
                    AWBSNo: 0,
                    HAWBSNo: 0,
                    PartSNo: 0,
                    Pieces: 0,
                    GrossWeight: 0,
                    VolumeWeight: 0,
                    IsBUP: 0,
                    SPHCSNo: 0,
                    SPHCTransSNo: 0
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);

                $.ajax({
                    url: "Services/RFS/RFSService.svc/GetRFSMendatoryCharges", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ AWBSNo: RFSTruckDetailsSNo, CityCode: userContext.CityCode, HAWBSNo: 0, ProcessSNo: parseInt(33), SubProcessSNo: parseInt(2297), GrWT: parseFloat(0), ChWt: parseFloat(0), Pieces: parseInt(0), lstShipmentInfo: ShipmentDetailArray }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;

                        /****************Handling Charge Information*************************************/
                        MendatoryHandlingCharges = [];
                        if (resData != []) {
                            $(resData).each(function (row, i) {
                                if (i.IsMandatory == 1) {
                                    MendatoryHandlingCharges.push({ "chargeairline": i.PartSNo, "text_chargeairline": i.PartName, "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis == undefined ? '' : i.PrimaryBasis, "pvalue": i.pValue == undefined ? 0 : i.pValue, "sbasis": i.SecondaryBasis == undefined ? '' : i.SecondaryBasis, "svalue": i.sValue == undefined ? 0 : i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "rate": i.Rate, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, "") });
                                    //totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount);
                                }
                            });
                        }

                        cfi.makeTrans("rfs_rfscharges", null, null, BindChargesItemAutoComplete, ReBindChargesItemAutoComplete, null, MendatoryHandlingCharges);
                        if (MendatoryHandlingCharges.length > 0) {
                            $("div[id$='areaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function (i, row) {
                                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                                $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                            });
                        }

                        $("div[id$='divareaTrans_rfs_rfscharges']").find("[id='areaTrans_rfs_rfscharges']").each(function () {
                            $(this).find("input[id^='ChargeAirline']").each(function () {
                                cfi.AutoComplete($(this).closest("tr").find("input[id^='ChargeAirline']").attr("name"), "AirlineCode,AirlineName", "vGetRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
                            });

                            $(this).find("input[id^='ChargeName']").each(function () {
                                cfi.AutoComplete("ChargeAirline", "AirlineCode,AirlineName", "vGetRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
                                cfi.AutoCompleteForFBLHandlingCharge($(this).closest("tr").find("input[id^='ChargeName']").attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", RFSTruckDetailsSNo, 0, userContext.CityCode, 2, "", "2", "999999999", "No");
                            });

                            $("div[id$='areaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function (i, row) {
                                $(this).find("input[id^='Text_ChargeAirline']").data("kendoAutoComplete").enable(false);
                                $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");

                                /////////////////Added By karan for hide add or delete button/////////////////////////

                                $(this).find("div[id^=transActionDiv").hide();

                            });

                            $(this).find("input[id^='PValue']").each(function () {
                                var currentID = $(this)[0].id;
                                $('#' + currentID).on("keypress", function (event) {
                                    var charCode = (event.which) ? event.which : event.keyCode;
                                    if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                        return false;

                                    if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                        event.preventDefault();
                                    }
                                    return true;
                                });
                            });

                            $(this).find("input[id^='SValue']").each(function () {
                                if ($(this).closest("td").find("span[id^='SBasis']").text() == undefined || $(this).closest("td").find("span[id^='SBasis']").text() == "") {
                                    $(this).closest("span").find("input[id^='SValue']").css("display", "none");
                                    $(this).closest("td").find("span[id^='SBasis']").css("display", "none");
                                }
                                var currentID = $(this)[0].id;
                                $('#' + currentID).on("keypress", function (event) {
                                    var charCode = (event.which) ? event.which : event.keyCode;
                                    if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                        return false;

                                    if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                        event.preventDefault();
                                    }
                                    return true;
                                });
                            });

                            $(this).find("input[id^='ChargeAirline']").closest("td").find("span:eq(1)").css("width", "120px");
                            $(this).find("input[id^='PValue']").attr("class", "transSection k-input");

                        });

                    }
                });

                if ($("#chkCash").length === 0)
                    $("#divareaTrans_rfs_rfscharges tr th:contains('RFS Handling Charges Information')").append('<span id="spnRFSChargesBill" style="float:right;color:#9d331d; font-size:12px; margin-right:40px; margin-bottom:5px;"><input type="checkbox" name="chkChargesfinalized" id="chkChargesfinalized" />Charges finalized Manually&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="spnBillTo" class="transSection">Bill To:</span><input type="radio" id="chkAgent" name="AirlineAgent" value="0" /><span id="spnChkAgent" style="color:#000;"> Agent<span><input type="radio" id="chkAirline" name="AirlineAgent" value="1" checked="true"  /><span id="spnChkAirline" style="color:#000;"> Airline</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="spnAccount" style="color:#9d331d;">Name: </span> <input type="hidden" name="Account" id="Account" recname="Account" value="" class="transSection"><span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-disabled" unselectable="on" style="width: 60px; text-transform: uppercase;"><input type="text" class="transSection k-input" name="Text_Account" id="Text_Account" recname="Text_Account" data-valid="required" data-valid-msg="Select Account" tabindex="0" controltype="autocomplete" value="" placeholder="" data-role="autocomplete" autocomplete="off"  style="width: 100%; text-transform: uppercase;"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#9d331d;"> Payment Mode :</span> <input type="radio" id="chkCash" name="cashCredit" value="0"  /><span id="spnChkCash"> Cash</span><input type="radio" id="chkCredit" name="cashCredit" value="1" checked="true"/><span id="spnChkCredit"> Credit<span><span>');


                $("#divareaTrans_rfs_rfscharges").find("table>tbody").find("tr:eq(2)").find("td:last").hide();
                cfi.AutoComplete("Account", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");

                //if (TruckCarrierCode.toUpperCase() == '5S'.toUpperCase() || TruckCarrierCode.toUpperCase() == '5X'.toUpperCase() || TruckCarrierCode.toUpperCase() == 'R4'.toUpperCase()) {
                //$("#spnRFSChargesBill").find('input[name=AirlineAgent][value=1]').removeAttr('checked');
                //$("#spnRFSChargesBill").find('input[name=AirlineAgent][value=0]').attr('checked', true);
                //if ($("input[name=AirlineAgent]:checked").val() == 0) {
                //    var data = GetDataSource("Account", "vRFSAgent", "SNo", "Name", ["Name"], null);
                //    cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "Name", "contains");
                //}
                //else {
                //    var data = GetDataSource("Account", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
                //    cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "AirlineName", "contains");
                //}
                //$.ajax({
                //    url: "Services/RFS/RFSService.svc/BindByDefaultBillToAgent", async: false, type: "POST", dataType: "json", cache: false,
                //    data: JSON.stringify({ TruckCarrierCode: TruckCarrierCode.toUpperCase() }),
                //    contentType: "application/json; charset=utf-8",
                //    success: function (result) {
                //        var Data = jQuery.parseJSON(result);
                //        var resData = Data.Table0;
                //        if (resData.length > 0) {
                //            $("#Account").val(resData[0].AccountSNo);
                //            $("#Text_Account").val(resData[0].Name);
                //        }
                //    }
                //});
                // }

                $.ajax({
                    url: "Services/RFS/RFSService.svc/BindByDefaultBillToAgent", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ TruckCarrierCode: TruckCarrierCode.toUpperCase() }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;
                        if (resData.length > 0) {
                            $("#spnRFSChargesBill").find('input[name=AirlineAgent][value=1]').removeAttr('checked');
                            $("#spnRFSChargesBill").find('input[name=AirlineAgent][value=0]').attr('checked', true);
                            if ($("input[name=AirlineAgent]:checked").val() == 0) {
                                var data = GetDataSource("Account", "vRFSAgent", "SNo", "Name", ["Name"], null);
                                cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "Name", "contains");
                            }
                            else {
                                var data = GetDataSource("Account", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
                                cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "AirlineName", "contains");
                            }

                            $("#Account").val(resData[0].AccountSNo);
                            $("#Text_Account").val(resData[0].Name);
                        }
                    }
                });

                //if (RFSTruckDetailsSNo != "" || RFSTruckDetailsSNo != "0") {
                //    GetBillingInformation(RFSTruckDetailsSNo);
                //}

                //  if ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == false) {
                if ($("input[name=AirlineAgent]:checked").val() == 1) {
                    $("#chkCash").prop('disabled', true);
                    $("#chkCredit").prop('disabled', true);
                    $("#chkCash").css("cursor", "not-allowed");
                    $("#chkCredit").css("cursor", "not-allowed");
                    $("#chkCredit").attr("checked", "true");
                    $("#Account").val("");
                    $("#Text_Account").val("");
                }
                else {
                    if (TruckSource == "0" && CurrentAccountSNo != "0") {
                        $("#Account").val(CurrentAccountSNo);
                        $("#Text_Account").val(AgendOrVendorName);
                    }
                }

                var boolRFSDockingCharges = true;
                $("div[id$='divareaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function () {
                    if ($(this).find("[id^='Text_ChargeName']").val() == "DOCKING CHARGES-SCHEDULED TRIP [PER TRIP ]" || $(this).find("[id^='Text_ChargeName']").val() == "DOCKING CHARGES-NON SCHEDULED TRIP [PER TRIP ]") {
                        boolRFSDockingCharges = false;
                    }
                });
                //|| (TruckLocation == "FG5" && (TruckSource == "0" || TruckSource == "1"))
                if ((IsTruckAgentOrVendor.toUpperCase() == "AIRLINE-VENDOR" && TruckSource == "2")) {
                    if (boolRFSDockingCharges == true) {
                        $.ajax({
                            url: "Services/RFS/RFSService.svc/GetRFSBulkDockingChargesFlag", async: false, type: "POST", dataType: "json", cache: false,
                            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                if (result == "0") {
                                    $("#divareaTrans_rfs_rfscharges").after("<div id='rfsDockingCharges' style='margin-top:20px;'></div>");
                                    cfi.ShowIndexView("rfsDockingCharges", "Services/RFS/RFSService.svc/GetRFSDockingChargeData/RFSCHARGE/RFS/RFSDOCKING/" + TableRFSTruckDetailsSNo);

                                }
                            }
                        });
                    }
                    //if ((IsTruckAgentOrVendor.toUpperCase() == "AIRLINE-VENDOR" && TruckSource == "2" && TruckLocation != "FG5")) {

                    //}
                    return;
                }



                $("#divareaTrans_rfs_rfscharges").after("<div id='rfsAmountCharges' style='margin-top:20px;'></div><div id='rfscustomCharges' style='margin-top:20px;'></div><br/>");
                cfi.ShowIndexView("rfsAmountCharges", "Services/RFS/RFSService.svc/GetRFSChargesData/RFSCHARGE/RFS/RFS/" + TableRFSTruckDetailsSNo);

                if (TruckType != 'EMPTY CONTAINER MOVEMENT')
                    cfi.ShowIndexView("rfscustomCharges", "Services/RFS/RFSService.svc/GetRFSCustomChargesData/RFSCUSTOMCHARGE/RFS/RFS/" + TableRFSTruckDetailsSNo);
            }
        });

    }

    // RFS Other Info
    if (subprocess.toUpperCase() == "RFSOTHERINFO") {
        $("#truckDetails").html('');
        $("#departureDetails").html('');
        $("#chargesDetails").html('');
        $("#divPrintManifest").html("");
        $("#assignFlightDetails").html('');

        $.ajax({
            url: "Services/RFS/RFSService.svc/GetWebForm/RFS/RFS/RFSOtherInfoXML/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#otherInfoDetails").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                InitializePage("RFSOtherInfoXML", 'divContent');
            }
        });
    }
}
function ConvertIntoLablelTextArea(container, subProcessSNo) {
    var isView = false;
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            isView = e.IsView;
            return;
        }
    });
    if (isView) {
        var delayRemarks = $("#DelayRemarks").val();
        var dRemarks = $("#DRemarks").val();
        $('#' + container).find("textarea[id='FreightRemarks']").replaceWith("<span id='FreightRemarks'></span>");
        if ($("#DelayRemarks").val() == "") {
            $('#' + container).find("textarea[id='DelayRemarks']").replaceWith("<span id='DelayRemarks'>" + "" + "</span>");
        }
        else {
            $('#' + container).find("textarea[id='DelayRemarks']").replaceWith("<span id='DelayRemarks'>" + delayRemarks + "</span>");
        }
        if ($("#DRemarks").val() == "") {
            $('#' + container).find("textarea[id='DRemarks']").replaceWith("<span id='DRemarks'>" + "" + "</span>");
        }
        else {
            $('#' + container).find("textarea[id='DRemarks']").replaceWith("<span id='DRemarks'>" + dRemarks + "</span>");
        }
        //$('#' + container).find("textarea[id='FreightRemarks']").each(function () {
        //    var ctrltype = $("#FreightRemarks").attr("type");
        //    if (ctrltype != "hidden") {
        //        if (ctrltype == "text") {
        //            $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
        //        }
        //    }
        //});
    }
}

function SuccessRFSChargeGrid() {
    if (IsCharges == "0" && IsManifested == "1") {
        $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='Airline']").each(function () {
            UserSubProcessRights("rfsAmountCharges", subprocesssno);
            ConvertIntoLablelTextArea("rfsAmountCharges", subprocesssno);
        });
        if (IsCharges == "1") {
            $("#btnSave").css("display", "none");
        }
        else {
            $("#btnSave").css("display", "block");
        }
    }
}

function SuccessRFSCustomChargeGrid() {
    if (IsCharges == "0" && IsManifested == "1") {
        $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='AirlineSNo']").each(function () {
            UserSubProcessRights("rfscustomCharges", subprocesssno);
        });
        if (IsCharges == "1") {
            $("#btnSave").css("display", "none");
        }
        else {
            $("#btnSave").css("display", "block");
        }
    }
}

function SuccessDockingGrid() {
    if ($("#billToDockingVendor").length === 0)
        $("#divBillToVendor").before('<div><div><input type="hidden" name="billToDockingVendor" id="billToDockingVendor" value=""><input id="Text_billToDockingVendor" name="Text_billToDockingVendor" controltype="autocomplete" placeholder="Vendor" type="text" class="k-input" style="width: 130px; text-transform: uppercase;" data-role="autocomplete" autocomplete="off"></div></div>');
    cfi.AutoComplete("billToDockingVendor", "Name", "vRFSTruckVendorAndAgent", "SNo", "Name", ["Name"], OnSelectBillToDockingVendor, "contains");
    if ($("#spnBillToDocking").length === 0)
        $("#divBillToDocking").before("<div id='spnBillToDocking' style='float: left;margin-top:10px;'>Bill To Vendor <span id='spnDockAvailableCredit' style='margin-left:250px;'></span><span id='spnDockAvailableCreditAmount' style='font-weight:bold;color:#51a351;'></span></div>");
    if ($("#spnVendorHeader").length === 0)
        $("#billToDockingVendor").after("<span id='spnVendorHeader' style='margin-right:5px;'>Bill To:</span>");
    GetVendorCreditLimitInformation(CurrentAccountSNo);

    $("#billToDockingVendor").val(CurrentAccountSNo);
    $("#Text_billToDockingVendor").val(AgendOrVendorName);
}

function OnSelectBillToDockingVendor() {
    GetVendorCreditLimitInformation(($("#billToDockingVendor").val() == "" || $("#billToDockingVendor").val() == undefined) ? 0 : $("#billToDockingVendor").val());
}

function BindTruckManifest() {

    $("#btnNew").css("display", "none");
    $("#tabstrip").html('');
    $("#ulTab").html('')
    $("#divPrint").remove();
    $("#divPrintManifest").html("");
    if ($("#tabstrip").length === 0)
        $("#divRFSDetails").after("<div id='tabstrip'></div><div id='truckDetails'></div><div id='departureDetails'></div><div id='assignFlightDetails'></div><div id='chargesDetails'></div>")

    $("#truckDetails").html('');
    $("#assignFlightDetails").html('');
    $("#departureDetails").html('');
    $("#chargesDetails").html('');
    $("#otherInfoDetails").html('');
    $("#btnSave").css("display", "block");
    $("#divPrintManifest").html("");

    if (IsAssignFlight == "0") {
        ShowMessage("warning", "Warning - RFS Charges", "Flight not assigned.");
        return;
    }

    if (IsDeparted == "1") {
        $("#btnSave").css("display", "none");
    }
    else {
        $("#btnSave").css("display", "block");
    }

    $.ajax({
        url: "Services/RFS/RFSService.svc/BindRFSAssignFlightInformationOnTab", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData1 = Data.Table1;
            var resData2 = Data.Table2;

            var CurrentManifestDailyFlightSNo;
            if (resData.length > 0) {
                var resItem = resData[0];
                arrFlightNo.length = 0;
                var i = 0; var j = 0; var k = 0; var l = 0;
                $('#tabstrip').append('<ul id="ulTab"></ul>');
                for (var key in resData) {
                    i = parseInt(i + 1);
                    var liCount = "Tab-" + i.toString();
                    l = parseInt(l + 1);
                    $('#ulTab').append('<li id="' + liCount + '" ' + (l == 1 ? ' class="k-state-active" ' : ' ') + ' onclick="FnGetFlightInfo(' + resData[key].DailyflightSNo + "," + l + ' )"><a class="k-link"> Flight No : <b style="color:#b66202;">' + resData[key].FlightNo + " , " + '</b>Flight Date : <b style="color:#b66202;">' + resData[key].FlightDate + '</b><span id="spnHdnManifestFlightNo" style="display:none;">' + resData[key].FlightNo + '</span> </li>');
                    arrFlightNo.push(resData[key].DailyflightSNo);
                }
                for (var key in resData) {
                    j = parseInt(j + 1);
                    var RFScount = "divManifestULDDetail_" + j.toString();
                    var RFSStackcount = "divManifestULDStackDetail_" + j.toString();
                    k = parseInt(k + 1);
                    var divCount = "tabstrip-" + k.toString();
                    $("#tabstrip").append('<div id="' + divCount + '"><div id="' + RFScount + '" ></div><div id="' + RFSStackcount + '" ></div></div><br/>');
                }

                $("#tabstrip").kendoTabStrip();
                cfi.ShowIndexView("divManifestULDDetail_1", "Services/RFS/RFSService.svc/GetFlightTransGridData/RFS/RFS/MANIFESTULD/" + resItem.DailyflightSNo + "/PRE");
                cfi.ShowIndexView("divManifestULDStackDetail_1", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/ULDSTACK/" + resItem.DailyflightSNo + "/STACK");

                $("#tabstrip").css("display", "block");
                if ($("#btnRFSPrint").length === 0)
                    $("#tabstrip").before('<div id="divPrint" style="float:right;margin-top: 4px;margin-right: 5px;"><span id="spnUWS" style="font-weight:bold;font-size:14px; margin-right:15px;"><input type="checkbox" id="chkUWS" name="chkUWS"   />Overwrite UWS Process</span><input type="button" id="btnRFSPrint" value="Print"  class="btn btn-block btn-primary"  /></div>');

                if (resData1[0].Column1 == '0') {
                    $("#btnRFSPrint").hide();
                    if (resData2[0].Column1 == '0') {
                        $("#spnUWS").hide();
                        $('input:checkbox[name=chkUWS]').attr('checked', false);
                    }
                    else
                        $("#spnUWS").show();
                }
                else {
                    $("#btnRFSPrint").show();
                    $("#spnUWS").hide();
                    $('input:checkbox[name=chkUWS]').attr('checked', false);
                }

                $("#btnRFSPrint").attr("onclick", "PrintPreManifest(" + RFSTruckDetailsSNo + ")");
            }
        }
    });
}

function GetBillingInformation(RFSTruckDetailsSNo) {
    $.ajax({
        url: "Services/RFS/RFSService.svc/GetBillingInformation", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData[0].Column1 == "1") {
                $("span#spnRFSChargesBill").hide();
            }
            else {
                $("span#spnRFSChargesBill").show();
            }
        }
    });
}

function CheckBillToAgent() {
    if ($("input[name=AirlineAgent]:checked").val() == 1) {
        $("#chkCash").prop('disabled', true);
        $("#chkCredit").prop('disabled', true);
        $("#chkCash").css("cursor", "not-allowed");
        $("#chkCredit").css("cursor", "not-allowed");
        $("#chkCredit").attr("checked", "true");
        $("#Account").val("");
        $("#Text_Account").val("");
    }
    else {
        $("#chkCash").prop('disabled', false);
        $("#chkCredit").prop('disabled', false);
        $("#chkCash").css("cursor", "auto");
        $("#chkCredit").css("cursor", "auto");
        $("#chkCredit").attr("checked", "true");
        if (TruckSource == "0" && CurrentAccountSNo != "0") {
            $("#Account").val(CurrentAccountSNo);
            $("#Text_Account").val(AgendOrVendorName);
        }
    }
}

function BindRFSChargesInformation(RFSTruckDetailsSNo, IsTruckAgentOrVendor) {
    $.ajax({
        url: "Services/RFS/RFSService.svc/BindRFSChargesInformation", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData1 = Data.Table1;
            var resData2 = Data.Table2;
            var resData3 = Data.Table3;

            if (resData.length > 0) {
                $("#chargesDetails").html('');

                $("#chargesDetails").html('<div class="formSection" style="margin-top:10px;">RFS Charge Information<span style="float:right;color:#9d331d; font-size:12px; margin-right:40px;">Bill To Agent : <span id="spnBillToAgent"></span></div><table id="tblResult" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE NO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE DATE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">ACCOUNT TYPE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">NAME</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PAYMENT MODE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PRINT</td></tr></table>');

                for (var i = 0; i < resData.length; i++) {
                    $('#tblResult').append('<tr><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><span class="actionView" style="cursor:pointer;color:Blue;" onclick="GetRFSHandlingDetails(' + RFSTruckDetailsSNo + ',' + resData[i].SNo + ',' + resData[i].InvoiceType + ');">' + resData[i].InvoiceNo + '</span></td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].InvoiceDate + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].AccountType + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;text-transform: uppercase;">' + resData[i].Airline + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resData[i].Amount + " AED" + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].PaymentMode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><a onclick="PrintRFSHandlingDetails(' + resData[i].SNo + ',' + resData[i].InvoiceType + ');" style="cursor:pointer;" ><i class="fa fa-print fa-2x"></i></a></td></tr>');
                }

                $("#btnSave").css("display", "none");

                $("span#spnBillToAgent").text("");
                if (resData3.length > 0) {
                    $("span#spnBillToAgent").text(resData3[0].Name == "" ? "" : resData3[0].Name);
                    $("span#spnBillToAgent").css("color", "black");
                }
                else {
                    $("#spnBillToAgent").closest("span").parent().remove();
                }

                if (IsTruckAgentOrVendor.toUpperCase() == "AIRLINE-VENDOR") {
                    if ($("#divHanHeight").length == 0)
                        $('#tblResult').append("<div id='divHanHeight' style='height:100px'></div>");
                    return;
                }

                $("#tblResult").after('<hr/><center><div id="rfsAmountCharges" style="width:90%;border-radius:25px;padding:10px; border: 2px solid #96876e; height:100%;margin:2px;"></div><br/><div id="rfscustomCharges" style="width: 90%; border-radius:25px;padding:10px; border: 2px solid #96876e; height:100%;  margin:2px;"></div><center>');

                if (resData1.length > 0) {
                    $("#rfsAmountCharges").html('<div class="formSection" style="margin:5px;">RFS Freight Charges</div><table id="tblrfsAmountCharges" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; border-bottom:1px solid #5a7570;border-left:1px solid #5a7570;border-right:1px solid #5a7570;border-top:1px solid #5a7570;background:#96876e;color:#fff;">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">AIRLINE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">NO OF UNITS</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">CHARGEABLE UNIT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">AMOUNT</td><td align="right" style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">TAX</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">TAX AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">TOTAL AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">REMARKS</td></tr></table>');

                    for (var i = 0; i < resData1.length; i++) {
                        $('#tblrfsAmountCharges').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;border-left: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + parseInt(i + 1) + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData1[i].AirlineName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData1[i].NoOfUnits + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData1[i].ChargeableUnit + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData1[i].Amount + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData1[i].TaxType + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData1[i].TotalTax + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData1[i].TotalAmount + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData1[i].FreightRemarks + '</td></tr>');
                    }
                }

                if (resData2.length > 0) {
                    $("#rfscustomCharges").html('<div class="formSection" style="margin:5px;">RFS Custom Charges</div><table id="tblrfscustomCharges" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-left:1px solid #5a7570; border-right: 1px solid black; border-bottom: 1px solid black;">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right: 1px solid black;">AIRLINE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right: 1px solid black;">CHARGE NAME</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right: 1px solid black;" align="right">AMOUNT</td><td align="right" style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">TAX</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">TAX AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">TOTAL AMOUNT</td></tr></table>');


                    for (var i = 0; i < resData2.length; i++) {
                        $('#tblrfscustomCharges').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:12px; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px; border-left: 1px solid black;padding: 2px;">' + parseInt(i + 1) + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData2[i].AirlineName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData2[i].ChargeName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData2[i].Amount + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData2[i].TaxType + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData2[i].TotalTax + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData2[i].TotalAmount + '</td></tr>');
                    }
                }

                if ($("#divtblrfscustomCharges").length == 0)
                    $('#tblrfscustomCharges').append("<div id='divtblrfscustomCharges' style='height:50px'></div>");

                if ($("#divHeight").length == 0)
                    $('#tblrfscustomCharges').append("<div id='divHeight' style='height:100px'></div>");

                if ($("div#rfsAmountCharges").find("table[id='tblrfsAmountCharges']").length == 0) {
                    $("div#rfsAmountCharges").remove();
                }
                if ($("div#rfscustomCharges").find("table[id='tblrfscustomCharges']").length == 0) {
                    $("div#rfscustomCharges").remove();
                }

                return false;
            }
            else {
                return true;
            }
        }
    });

}

function GetRFSHandlingDetails(RFSTruckDetailsSNo, SNo, Type) {
    if ($("#divRFSHandlingCharges").length === 0)
        $("#chargesDetails").append('<div id="divRFSHandlingCharges"></div>');
    $("#divRFSHandlingCharges").html('');
    if (RFSTruckDetailsSNo != 0) {
        $.ajax({
            url: "Services/RFS/RFSService.svc/GetRFSHandlingDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo, SNo: SNo, Type: Type }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resHandlingData = Data.Table0;
                if (resHandlingData.length > 0) {
                    $("#divRFSHandlingCharges").html('<table id="tblRFSHandlingCharges" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">CHARGE NAME</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">P BASIS</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">S BASIS</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">TAX</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570" align="right">TOTAL AMOUNT</td></tr></table>');

                    for (var i = 0; i < resHandlingData.length; i++) {
                        $('#tblRFSHandlingCharges').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resHandlingData[i].TariffHeadName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].pValue + ' ' + resHandlingData[i].pBasis + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].sValue + ' ' + resHandlingData[i].sBasis + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].ChargeAmount + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].TotalTaxAmount + '</td><td align="right" style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;color:blue;margin-left:20px;">' + resHandlingData[i].TotalAmount + " AED" + '</td></tr>');
                    }
                }
            }
        });
    }

    cfi.PopUp("divRFSHandlingCharges", "RFS Handling Charges", 1000, null, null, 1);
    $("#divRFSHandlingCharges").parent("div").css("position", "fixed");
}

function PrintRFSHandlingDetails(SNo, InvoiceType) {
    if (InvoiceType == 0)
        window.open("HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + SNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&OfficeSNo=" + userContext.OfficeSNo);
    else
        window.open("HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + SNo + "&UserSNo=" + userContext.UserSNo + "&RFS=" + 1 + "&OfficeSNo=" + userContext.OfficeSNo);
}

var TotalDockingCharges = 0;
function SaveRFSChargesDetails(RFSTruckDetailsSNo, IsTruckAgentOrVendor) {
    var boolAmtFlg = true;
    var boolChargeFlg = true;
    var boolChRemarksFlg = true;
    var boolAmtRemarksFlg = true;

    var chkChargesfinalized = ($("#spnRFSChargesBill").find("input[id=chkChargesfinalized]").is(":checked") == true) ? "1" : "0";
    if (chkChargesfinalized == "1") {
        return;
    }

    //var chkChargesfinalized = ($("#spnRFSChargesBill").find("input[id=chkChargesfinalized]").is(":checked") == true) ? "1" : "0";

    //if (chkChargesfinalized == "1") {
    //    $.ajax({
    //        url: "Services/RFS/RFSService.svc/SaveRFSChargeFinalized", async: false, type: "POST", dataType: "json", cache: false,
    //        data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo, Chargesfinalized: chkChargesfinalized }),
    //        contentType: "application/json; charset=utf-8",
    //        success: function (result) {
    //            if (result == "0") {
    //                ShowMessage('success', 'Success', "Charges finalized Manually.");
    //                ClearDiv();
    //                RFSSearch();
    //            }
    //        },
    //        error: function () {
    //            ShowMessage('warning', 'Warning', "Unable to save data.");
    //        }
    //    });
    //    return;
    //}

    $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='Airline']").each(function () {
        if (parseInt($(this).closest("tr").find("#txtChargeableUnit").val()) == 0 || $(this).closest("tr").find("#txtChargeableUnit").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Enter Chargeable Unit.");
            $(this).closest("tr").find("#txtChargeableUnit").val("");
            $(this).closest("tr").find("#txtChargeableUnit").focus();
            boolChargeFlg = false;
        }
        return boolChargeFlg;
    });

    if (boolChargeFlg == false) {
        return;
    }

    $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='Airline']").each(function () {
        if (parseInt($(this).closest("tr").find("#txtAmount").val()) == 0 || $(this).closest("tr").find("#txtAmount").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Enter amount.");
            $(this).closest("tr").find("#txtAmount").val("");
            $(this).closest("tr").find("#txtAmount").focus();
            boolAmtFlg = false;
        }
        return boolAmtFlg;
    });

    if (boolAmtFlg == false) {
        return;
    }

    $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='Airline']").each(function () {
        if (($(this).closest("tr").find("td[data-column='HdnChargeableUnit']").text() != $(this).closest("tr").find("input[id=txtChargeableUnit]").val() || $(this).closest("tr").find("td[data-column='HdnAmount']").text() != $(this).closest("tr").find("input[id=txtAmount]").val()) && $(this).closest("tr").find("#FreightRemarks").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Enter Remarks.");
            $(this).closest("tr").find("#FreightRemarks").focus();
            boolChRemarksFlg = false;
        }
        return boolChRemarksFlg;
    });

    if (boolChRemarksFlg == false) {
        return;
    }
    if (boolAmtRemarksFlg == false) {
        return;
    }

    var boolCustFlg = true;
    $("#rfscustomCharges").find(".k-grid-content").find("table tbody > tr").find("td[data-column='AirlineSNo']").each(function () {
        if ($(this).closest("tr").find("#txtCustomAmount").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Enter custom amount.");
            $(this).closest("tr").find("#txtCustomAmount").val("");
            $(this).closest("tr").find("#txtCustomAmount").focus();
            boolCustFlg = false;
        }
        return boolCustFlg;
    });

    if (boolCustFlg == false) {
        return;
    }

    if ($("input[name=AirlineAgent]:checked").val() == 0) {
        if (TruckSource == "0" && CurrentAccountSNo == "0" && $("#Account").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Select Agent.");
            return;
        }
        if (TruckSource == "2" && $("#Account").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Select Agent.");
            return;
        }
    }

    if ($("#rfsDockingCharges").length > 0 && TruckSource == "2" && $("input[name=DockCredit]:checked").val() == "1" && ($("#Text_billToDockingVendor").val() == undefined ? "" : $("#Text_billToDockingVendor").val()) == "") {
        ShowMessage("warning", "Warning - RFS Docking Charges", "Select Bill to Vendor.");
        return;
    }

    if ($("#rfsDockingCharges").length > 0 && TruckSource == "2" && $("input[name=DockCredit]:checked").val() == "1") {
        $("#rfsDockingCharges").find(".k-grid-content").find("table tbody > tr").find("td[data-column='TotalAmount']").each(function () {
            TotalDockingCharges += parseFloat($(this).text());
        });
        //if (!fn_RFSCheckCreditLimit(CurrentAccountSNo, TotalDockingCharges)) return;
        if (!fn_RFSCheckCreditLimit(($("#billToDockingVendor").val() == "" || $("#billToDockingVendor").val() == undefined) ? 0 : $("#billToDockingVendor").val(), TotalDockingCharges)) return;
    }

    var flag = false;
    var HandlingChargeArray = [];
    //var Mode = $("#divDetail2").find("span[id*='spnPaymentType']").text();
    //var ChargeTo = $("#hdnBillTo").val();
    $("div[id$='divareaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "" && $(this).find("[id^='Text_ChargeName']").length != 0) {
            var HandlingChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: 0,
                WaveOff: 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("span[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("span[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("span[id^='TotalAmount']").text(),
                Rate: $(this).find("input[id^='Rate']").val(),
                Min: 1,
                Mode: $('input[name="cashCredit"]:checked').val() == 0 ? 'CASH' : 'CREDIT',
                ChargeTo: $("input[name=AirlineAgent]:checked").val(),// ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true) ? "0" : "1",
                ChargeToSNo: $(this).find("[id^='Text_ChargeAirline']").data("kendoAutoComplete").key(),
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']").val(),
                WaveoffRemarks: ''
            };
            //-------------------------------------
            //--##  RFS Custom Charges Table -- ##
            //-------------------------------------
            HandlingChargeArray.push(HandlingChargeViewModel);
        }
    });

    if (HandlingChargeArray.length == 0) {
        var HandlingChargeViewModel = {
            SNo: 0,
            AWBSNo: 0,
            WaveOff: 0,
            TariffCodeSNo: 0,
            TariffHeadName: "",
            pValue: 0,
            sValue: 0,
            Amount: 0,
            TotalTaxAmount: 0,
            TotalAmount: 0,
            Rate: 0,
            Min: 0,
            Mode: $('input[name="cashCredit"]:checked').val() == 0 ? 'CASH' : 'CREDIT',
            ChargeTo: $("input[name=AirlineAgent]:checked").val(),//($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true) ? "0" : "1",
            ChargeToSNo: 0,
            pBasis: 0,
            sBasis: 0,
            Remarks: "",
            WaveoffRemarks: ""
        };
        HandlingChargeArray.push(HandlingChargeViewModel);
    }

    if (HandlingChargeArray.length > 0) {
        //if ($("#chargesDetails").find(".k-grid-content").find("table tbody > tr").first().find("td[data-column='Airline']").text() != "") {

        var RFSChargesDetails = [];
        var RFSCustomChargesDetails = [];

        if (IsTruckAgentOrVendor.toUpperCase() == 'AIRLINE-VENDOR') {
            var RFSChargesData = {
                AirlineSNo: 0,
                RFSTruckDetailsSNo: RFSTruckDetailsSNo,
                NoOfUnits: 0,
                ChargeableUnit: 0,
                Amount: 0,
                RateAirlineMasterSNo: 0,
                TaxType: 0,
                TaxAmount: 0,
                TotalAmount: 0,
                FreightRemarks: ''
            }
            var RFSCustomChargesData = {
                RFSTruckDetailsSNo: RFSTruckDetailsSNo,
                AirlineSNo: 0,
                RateAirlineCustomChargesSNo: 0,
                Amount: '0',
                RateAirlineMasterSNo: 0,
                TaxType: 0,
                TaxAmount: 0,
                TotalAmount: 0,
                ChargeName: ''
            }

            RFSChargesDetails.push(RFSChargesData);
            RFSCustomChargesDetails.push(RFSCustomChargesData);

        }
        else {
            $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='Airline']").each(function () {
                var ChargesAirlineSNo = $(this).closest("tr").find("td[data-column='AirlineSNo']").text();
                var ChargeRFSTruckDetailsSNo = $(this).closest("tr").find("td[data-column='RFSTruckDetailsSNo']").text();
                var ChargeNoOfUnits = $(this).closest("tr").find("td[data-column='NoOfUnits']").text();
                var ChargeableUnit = $(this).closest("tr").find("input[id='txtChargeableUnit']").val();
                var ChargeAmount = $(this).closest("tr").find("#txtAmount").val();
                var RateAirlineMasterSNo = $(this).closest("tr").find("td[data-column='RateAirlineMasterSNo']").text();
                var TaxType = $(this).closest("tr").find("td[data-column='TaxType']").text();
                var TaxAmount = $(this).closest("tr").find("#txtTaxAmount").val();
                var TotalAmount = $(this).closest("tr").find("#txtTotalAmount").val();
                var FreightRemarks = ($(this).closest("tr").find("#FreightRemarks").val() == "" || $(this).closest("tr").find("#FreightRemarks").val() == undefined) ? "" : $(this).closest("tr").find("#FreightRemarks").val();

                var RFSChargesData = {
                    AirlineSNo: ChargesAirlineSNo, RFSTruckDetailsSNo: ChargeRFSTruckDetailsSNo, NoOfUnits: ChargeNoOfUnits, ChargeableUnit: ChargeableUnit,
                    Amount: ChargeAmount, RateAirlineMasterSNo: RateAirlineMasterSNo, TaxType: TaxType, TaxAmount: TaxAmount, TotalAmount: TotalAmount, FreightRemarks: FreightRemarks
                }
                //-----------------------------------
                //--##  RFS Charges Table -- ##
                //-----------------------------------
                RFSChargesDetails.push(RFSChargesData);

            });

            if (TruckType == 'EMPTY CONTAINER MOVEMENT') {
                var RFSCustomChargesData = {
                    RFSTruckDetailsSNo: RFSTruckDetailsSNo,
                    AirlineSNo: 0,
                    RateAirlineCustomChargesSNo: 0,
                    Amount: '0',
                    RateAirlineMasterSNo: 0,
                    TaxType: 0,
                    TaxAmount: 0,
                    TotalAmount: 0,
                    ChargeName: ''
                }
                RFSCustomChargesDetails.push(RFSCustomChargesData);
            }
            else {
                if ($("#rfscustomCharges").find(".k-grid-content").find("table tbody > tr:first").find("td[data-column='AirlineName']").text() != "") {
                    $("#rfscustomCharges").find(".k-grid-content").find("table tbody > tr").find("td[data-column='AirlineSNo']").each(function () {
                        var CustomRFSTruckDetailsSNo = $(this).closest("tr").find("td[data-column='RFSTruckDetailsSNo']").text();
                        var CustomAirlineSNo = $(this).closest("tr").find("td[data-column='AirlineSNo']").text();
                        var RateAirlineCustomChargesSNo = $(this).closest("tr").find("td[data-column='RateAirlineCustomChargesSNo']").text()
                        var CustomAmount = $(this).closest("tr").find("#txtCustomAmount").val();
                        var RateAirlineMasterSNo = $(this).closest("tr").find("td[data-column='RateAirlineMasterSNo']").text();
                        var TaxType = $(this).closest("tr").find("td[data-column='TaxType']").text();
                        var CustomTaxAmount = $(this).closest("tr").find("#txtCustomTaxAmount").val();
                        var CustomTotalAmount = $(this).closest("tr").find("#txtCustomTotalAmount").val();
                        var ChargeName = $(this).closest("tr").find("td[data-column='ChargeName'] span").text();

                        var RFSCustomChargesData = {
                            RFSTruckDetailsSNo: CustomRFSTruckDetailsSNo,
                            AirlineSNo: CustomAirlineSNo,
                            RateAirlineCustomChargesSNo: RateAirlineCustomChargesSNo,
                            Amount: CustomAmount == undefined ? '0' : CustomAmount,
                            RateAirlineMasterSNo: RateAirlineMasterSNo,
                            TaxType: TaxType,
                            TaxAmount: CustomTaxAmount == undefined ? '0' : CustomTaxAmount,
                            TotalAmount: CustomTotalAmount == undefined ? '0' : CustomTotalAmount,
                            ChargeName: ChargeName == undefined ? '' : ChargeName
                        }
                        //-------------------------------------
                        //--##  RFS Custom Charges Table -- ##
                        //-----------------------------------------
                        RFSCustomChargesDetails.push(RFSCustomChargesData);
                    });
                }
            }
        }

        // var BillTo = ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true) ? "0" : "1";
        var BillTo = $("input[name=AirlineAgent]:checked").val();
        var BillToDockingVendor = ($("#billToDockingVendor").val() == undefined || $("#billToDockingVendor").val() == "") ? 0 : $("#billToDockingVendor").val();

        if (TruckSource == "0" && BillTo == "0") {
            var BillToSno = $("#Account").val() == "" ? CurrentAccountSNo : $("#Account").val();
        }
        else {
            var BillToSno = $("#Account").val() == "" ? "0" : $("#Account").val();
        }

        var PaymentMode = $("input[name=DockCredit]:checked").val() == undefined ? 0 : $("input[name=DockCredit]:checked").val();
        var total = 0;

        if ($("input[name=AirlineAgent]:checked").val() == 0 && $("#spnRFSChargesBill").find("input[id^='chkCredit']").prop('checked') == true) {
            for (var i = 0; i < HandlingChargeArray.length; i++) {
                total += HandlingChargeArray[i].TotalAmount << 0;
            }
            for (var i = 0; i < RFSChargesDetails.length; i++) {
                total += RFSChargesDetails[i].Amount << 0;
            }
            for (var i = 0; i < RFSCustomChargesDetails.length; i++) {
                total += RFSCustomChargesDetails[i].Amount << 0;
            }

            if (!fn_RFSCheckCreditLimit($("#Account").val() == "" ? CurrentAccountSNo : $("#Account").val(), total)) return;

            //if (parseFloat(total) > parseFloat(AvailableCreditLimit)) {
            //    ShowMessage('warning', 'Information!', "Insufficient Credit limit (AED " + AvailableCreditLimit.toString() + ").", "bottom-right");
            //    return;
            //}
        }

        $.ajax({
            url: "Services/RFS/RFSService.svc/SaveRFSChargesDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSChargesDetails: RFSChargesDetails, RFSCustomChargesDetails: RFSCustomChargesDetails, RFSHandlingCharges: HandlingChargeArray, BillTo: BillTo, BillToSno: BillToSno, AirportCode: userContext.AirportCode, PaymentMode: PaymentMode, BillToDockingVendor: BillToDockingVendor }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success', "Details Saved Successfully");
                    BindRFSChargesInformation(RFSTruckDetailsSNo, IsTruckAgentOrVendor);
                    RFSSearch();
                }
                else if (result == "1")
                    ShowMessage('warning', 'Warning-RFS Charges', "Charges already applied.");
                else
                    ShowMessage('warning', 'Warning-RFS Charges', "Unable to save data.");
            },
            error: function () {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        });
    }
    return flag;
}

//--------------------------------------//
// -- New Booking & RFS Truck Details
//--------------------------------------//
function RFSTruckDetails(obj, RFSTruckDetailsSNo) {
    $("#tabstrip").html('');
    $("#ulTab").html('')
    if ($("#tabstrip").length === 0)
        $("#divRFSDetails").after("<div id='tabstrip' data-role='tabstrip' class='k-widget k-header k-tabstrip'></div><div id='truckDetails'></div><div id='departureDetails'></div><div id='assignFlightDetails'></div><div id='chargesDetails'></div>")
    //$("#tabstrip").html(rpl);
    //$("div#tabstrip").show();

    $("#departureDetails").html('');
    $("#assignFlightDetails").html('');
    $("#chargesDetails").html('');
    $("#otherInfoDetails").html('');
    //$("#cashDetails").html('');
    //$("#paymentInfo").html('');
    //$("#spnRFSChargesBill").css("display", "none");

    //$("#Text_TruckRegistrationNo").insertAfter("<span class=\"actionView\" style=\"cursor:pointer;color:Blue;\" onclick=\"AddRegistration(this);\">Add</span>")

    $.ajax({
        url: "Services/RFS/RFSService.svc/GetWebForm/RFS/RFS/RFSTruckInformation/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#truckDetails").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#TruckDate").css("width", "130px");
            $("#TruckDate").closest("span").css("width", "130px");
            $("#Text_TruckType").css("width", "130px");
            $("#Text_TruckType").parent().closest("span").css("width", "130px");
            $("#Text_OriginAirport").css("width", "130px");
            $("#Text_OriginAirport").parent().closest("span").css("width", "130px");
            $("#Text_DestinationAirport").css("width", "130px");
            $("#Text_DestinationAirport").parent().closest("span").css("width", "130px");
            $("#MobileNo").css("width", "150px");
            $("#MobileNo").unbind("keyup").bind("keyup", function () {
                if (this.value != this.value.replace(/[^0-9]/g, '')) {
                    this.value = this.value.replace(/[^0-9]/g, '');
                }
            });

            $('input[name=TruckSource][data-radioval=Vendor]').attr('checked', true);

            cfi.AutoCompleteV2("TruckNo", "FlightNo", "ExportRFS_TruckNo", OnSelectTruckNo, "contains");
            cfi.AutoCompleteV2("OriginAirport", "AirportCode,AirportName", "RFS_OriginAndDestinationAirport", null, "contains");
            cfi.AutoCompleteV2("DestinationAirport", "AirportCode,AirportName", "RFS_OriginAndDestinationAirport", null, "contains");
            cfi.AutoCompleteV2("Vendor", "Name", "RFS_TruckVendorAndAgent", null, "contains");
            cfi.AutoCompleteV2("TruckType", "TruckType", "RFS_TruckType", OnSelectTruckType, "contains");
            cfi.AutoCompleteV2("TruckRegistrationNo", "RegistrationNo", "RFS_TruckRegistrationNo", null, "contains");
            cfi.AutoCompleteV2("Location", "Location,Description", "RFS_TruckLocation", null, "contains");

            //cfi.AutoComplete("OriginAirport", "AirportCode", "vRFSOriginAndDestinationAirport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            //cfi.AutoComplete("DestinationAirport", "AirportCode", "vRFSOriginAndDestinationAirport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            //cfi.AutoComplete("Vendor", "Name", "vRFSTruckVendorAndAgent", "SNo", "Name", ["Name"], null, "contains");
            //cfi.AutoComplete("TruckType", "TruckType", "vRFSTruckType", "SNo", "TruckType", ["TruckType"], OnSelectTruckType, "contains");
            //cfi.AutoComplete("TruckRegistrationNo", "RegistrationNo", "vwRFSTruckRegistrationNo", "SNo", "RegistrationNo", ["RegistrationNo"], null, "contains");
            //cfi.AutoComplete("Location", "Location,Description", "TruckLocation", "SNo", "Location", ["Location", "Description"], null, "contains");

            TruckSourceChange();
            BindSASTruckRegistrationNo();
            BindSASDriverName();

            if (obj != "BindTruckDetails") {
                $.ajax({
                    url: "Services/RFS/RFSService.svc/BindRFSTruckInformation", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;
                        if (resData.length > 0) {
                            var resItem = resData[0];
                            $("#TruckDate").data("kendoDatePicker").value(resItem.TruckDate);
                            $("#TruckNo").val(resItem.DailyFlightSNo);
                            $("#Text_TruckNo").val(resItem.TruckNo);
                            $("#OriginAirport").val(resItem.OriginAirportSNo);
                            $("#Text_OriginAirport").val(resItem.OriginAirportCode);
                            $("#DestinationAirport").val(resItem.DestinationAirPortSNo);
                            $("#Text_DestinationAirport").val(resItem.DestinationAirportCode);
                            $("#ETD").val(resItem.ETD);
                            $("#ETA").val(resItem.ETA);
                            $("#Text_Location").data("kendoAutoComplete").setDefaultValue(resItem.Location, resItem.LocationDetail);

                            if (resItem.TruckSource == "0") {
                                $('input[name=TruckSource][value="0"]').attr('checked', true);
                                $('input[name=TruckSource][value="1"]').removeAttr('checked');
                                $('input[name=TruckSource][value="2"]').removeAttr('checked');
                            }
                            else if (resItem.TruckSource == "1") {
                                $('input[name=TruckSource][value="0"]').removeAttr('checked');
                                $('input[name=TruckSource][value="2"]').removeAttr('checked');
                                $('input[name=TruckSource][value="1"]').attr('checked', true);
                            }
                            else {
                                $('input[name=TruckSource][value="0"]').removeAttr('checked');
                                $('input[name=TruckSource][value="1"]').removeAttr('checked');
                                $('input[name=TruckSource][value="2"]').attr('checked', true);
                            }

                            if (resItem.ScheduleTrip == "1") {
                                $('input[name=ScheduleTrip][data-radioval=YES]').attr('checked', true);
                            }
                            else {
                                $('input[name=ScheduleTrip][data-radioval=NO]').attr('checked', true);
                            }
                            TruckSourceChange();
                            $("#Vendor").val(resItem.AccountSNo);
                            $("#Text_Vendor").val(resItem.AgendOrVendorName);
                            $("#HiringCharges").val(resItem.HiringCharges == 0 ? "" : resItem.HiringCharges);
                            $("#_tempHiringCharges").val(resItem.HiringCharges == 0 ? "" : resItem.HiringCharges);
                            $("#TruckType").val(resItem.AircraftSNo);
                            $("#Text_TruckType").val(resItem.AircraftType);

                            if ($('#TruckSource:checked').val() == "0") {
                                $("#SASTruckRegistrationNo").val(resItem.SASTruckRegistrationNoSNo);
                                $("#Text_SASTruckRegistrationNo").val(resItem.TruckRegistrationNo);
                                $("#SASDriverName").val(resItem.DriverMasterSNo);
                                $("#Text_SASDriverName").val(resItem.DriverName);
                            }
                            else {
                                $("#TruckRegistrationNo").val(resItem.TruckRegistrationNo);
                                $("#DriverName").val(resItem.DriverName);
                            }

                            $("#TruckCapacity").val(resItem.TruckCapacity);
                            $("#_tempTruckCapacity").val(resItem.TruckCapacity);
                            $("#DriverID").val(resItem.DriverID);
                            $("#MobileNo").val(resItem.DriverMobile);
                            $("#_tempMobileNo").val(resItem.DriverMobile);
                            if (IsCharges == "0" && IsManifested == "1") {
                                $("#btnSave").css("display", "block");
                                $("#TruckDate").data("kendoDatePicker").enable(false);
                                $("#Text_TruckNo").data("kendoAutoComplete").enable(false);
                                $("#ETD").attr('disabled', 1);
                                $("#ETA").attr('disabled', 1);
                                $("#Text_TruckType").data("kendoAutoComplete").enable(false);
                                $("#TruckRegistrationNo").attr('disabled', 1);
                                $("#TruckCapacity").attr('disabled', 1);
                                $("#_tempTruckCapacity").attr('disabled', 1);
                                $("#DriverName").attr('disabled', 1);
                                $("#DriverID").attr('disabled', 1);
                                $("#MobileNo").attr('disabled', 1);
                                $("#Text_Location").data("kendoAutoComplete").enable(false);
                                $("[id='ScheduleTrip']").attr('disabled', 1)
                            } else {
                                $("#TruckDate").data("kendoDatePicker").enable(true);
                                $("#ETD").removeAttr('disabled');
                                $("#ETA").removeAttr('disabled');
                                $("#Text_TruckType").data("kendoAutoComplete").enable(true);
                                $("#Text_TruckNo").data("kendoAutoComplete").enable(true);
                                $("#TruckRegistrationNo").removeAttr('disabled');
                                $("#TruckCapacity").removeAttr('disabled');
                                $("#_tempTruckCapacity").removeAttr('disabled');
                                $("#DriverName").removeAttr('disabled');
                                $("#DriverID").removeAttr('disabled');
                                $("#MobileNo").removeAttr('disabled');
                                $("#Text_Location").data("kendoAutoComplete").enable(true);
                                $("[id='ScheduleTrip']").removeAttr('disabled');
                            }
                        }
                    }
                });


            }

            //OnselectVendor();
            $('#truckDetails').append("<div id='divHeightTruck' style='height:100px'></div>");
            $("#Text_OriginAirport").data("kendoAutoComplete").enable(false);
            $("#Text_DestinationAirport").data("kendoAutoComplete").enable(false);
            //$("#Text_TruckRegistrationNo").parent().parent().after('<span id="spnAdd" class="actionView" style="cursor:pointer;color:Blue;margin-left:5px;font-size:11px;" onclick="AddRegistration(this);">New</span>');
            UserSubProcessRights("truckDetails", subprocesssno);
            if (IsCharges == "1" && IsDeparted == "1") {
                $("#btnSave").css("display", "none");
            }
            if (IsManifested == "1" && IsCharges == "1") {
                $("#btnSave").css("display", "none");
            }
            else {
                $("#btnSave").css("display", "block");
            }
        }
    });
}


function BindSASTruckRegistrationNo() {
    if ($('#TruckSource:checked').val() == "0") {
        $("#spnTruckRegistrationNo").closest("td").next().html('<input type="hidden" name="SASTruckRegistrationNo" id="SASTruckRegistrationNo" value=""><span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-default" unselectable="on" style=""><input type="text" class="k-input" name="Text_SASTruckRegistrationNo" id="Text_SASTruckRegistrationNo" tabindex="13" controltype="autocomplete" maxlength="" value="" placeholder="" data-role="autocomplete" autocomplete="off" style="width: 100%; text-transform: uppercase;"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span>');

        $("#Text_SASTruckRegistrationNo").css("width", "135px");
        $("#Text_SASTruckRegistrationNo").parent().closest("span").css("width", "135px");
        cfi.AutoComplete("SASTruckRegistrationNo", "AssignedTruckRegNo", "vwBindSASTruckRegistrationNo", "SNo", "AssignedTruckRegNo", ["AssignedTruckRegNo"], null, "contains");
    }
    else {
        $("#spnTruckRegistrationNo").closest("td").next().html('<input type="text" class="k-input" name="TruckRegistrationNo" id="TruckRegistrationNo" style="width: 155px; text-transform: uppercase;" controltype="alphanumericupper" tabindex="11" maxlength="15" value="" placeholder="Truck Registration No" data-role="alphabettextbox" autocomplete="off">');
    }
}

function BindSASDriverName() {
    if ($('#TruckSource:checked').val() == "0") {
        $("#spnDriverName").closest("td").next().html('<input type="hidden" name="SASDriverName" id="SASDriverName" value="14"><span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-default" unselectable="on" style=""><input type="text" class="k-input" name="Text_SASDriverName" id="Text_SASDriverName" tabindex="13" controltype="autocomplete" maxlength="" value="" placeholder="" data-role="autocomplete" autocomplete="off" style="width: 100%; text-transform: uppercase; ><span class="k-select" unselectable="on" ><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span>');

        $("#Text_SASDriverName").css("width", "130px");
        $("#Text_SASDriverName").parent().closest("span").css("width", "130px");
        cfi.AutoComplete("SASDriverName", "DriverName", "vRFSDriverName", "SNo", "DriverName", ["DriverName", "ID"], OnSelectDriverName, "contains");
    }
    else {
        $("#spnDriverName").closest("td").next().html('<input type="text" class="k-input" name="DriverName" id="DriverName" style="width: 155px; text-transform: uppercase;" controltype="alphanumericupper" tabindex="13" maxlength="30" value="" placeholder="Driver Name" data-role="alphabettextbox" autocomplete="off" >');
        $("#DriverID").removeAttr("disabled");
    }

    $('#Text_SASDriverName').attr("data-valid", "required");
}


function fn_RFSCheckCreditLimit(AccountSNo, TotalAmount) {
    var boolRFSCheck = true;
    try {
        $.ajax({
            url: "Services/RFS/RFSService.svc/RFSCheckCreditLimit", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AccountSNo: AccountSNo, TotalAmount: TotalAmount }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    if (resData[0].Column1.split('?')[0] != '0') {
                        ShowMessage("warning", "Warning - RFS Charges", resData[0].Column1.split('?')[1]);
                        boolRFSCheck = false;
                    }
                }
            }
        });
    } catch (e) {

    }
    return boolRFSCheck;
}

function OnSelectDriverName(e) {
    var DriverMasterSNo = $("#SASDriverName").val();
    $("#DriverID").val("");
    $("#MobileNo").val("");
    if (($("#Text_SASDriverName").val() != "" || $("#Text_SASDriverName").val() != undefined) && ($("#SASDriverName").val() != "" || $("#SASDriverName").val() != "0")) {
        $.ajax({
            url: "Services/RFS/RFSService.svc/GetDriverDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DriverMasterSNo: $("#SASDriverName").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $("#DriverID").val(resData[0].ID);
                    $("#MobileNo").val(resData[0].Mobile);
                    $("#DriverID").attr("disabled", "disabled");
                }
                else {
                    $("#DriverID").removeAttr("disabled");
                }
            }
        });
    }
    else {
        $("#DriverID").val("");
        $("#MobileNo").val("");
        $("#DriverID").removeAttr("disabled");
    }
}

//function OnselectVendor() {
//    if ($('#TruckSource:checked').val() == "1") {
//        if ($("#Text_Vendor").val() != "") {
//            $.ajax({
//                url: "Services/RFS/RFSService.svc/GetVendorApplicableForHiringCharges", async: false, type: "POST", dataType: "json", cache: false,
//                data: JSON.stringify({ AccountSNo: $("#Vendor").val() }),
//                contentType: "application/json; charset=utf-8",
//                success: function (result) {
//                    var Data = jQuery.parseJSON(result);
//                    var resData = Data.Table0;
//                    if (resData.length > 0) {
//                        if (resData[0].IsApplicableForHiringCharges == '1') {
//                            $("#_tempHiringCharges").show();
//                            $("#HiringCharges").closest("td").prev().find("span").show();
//                        }
//                        else {
//                            $("#_tempHiringCharges").hide();
//                            $("#HiringCharges").hide();
//                            $("#HiringCharges").closest("td").prev().find("span").hide();
//                        }
//                    }
//                }
//            });
//        }
//        else {
//            $("#_tempHiringCharges").hide();
//            $("#HiringCharges").hide();
//            $("#HiringCharges").closest("td").prev().find("span").hide();
//        }
//    }
//}

function OnSelectTruckType() {
    //$("#Text_TruckRegistrationNo").val("");
    //$("#TruckRegistrationNo").val("");
}

function GatValueOfAutocomplete(valueId, value, keyId, key) {
    rowId = valueId.split("_")[2];
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if ($("#" + keyId).val() != "") {
            var ShipmentDetailArray = [];
            var ShipmentDetailViewModel = {
                PartNumber: 0, AWBSNo: 0, HAWBSNo: 0, PartSNo: 0, Pieces: 0, GrossWeight: 0, VolumeWeight: 0, IsBUP: 0, SPHCSNo: 0, SPHCTransSNo: 0
            };
            ShipmentDetailArray.push(ShipmentDetailViewModel);
            $.ajax({
                url: "Services/RFS/RFSService.svc/GetChargeValue", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TariffSNo: parseInt(key), AWBSNo: RFSTruckDetailsSNo, CityCode: userContext.CityCode, PValue: 0, SValue: 0, HAWBSNo: 0, ProcessSNo: parseInt(33), SubProcessSNo: parseInt(2297), GrWT: parseFloat(0), ChWt: parseFloat(0), Pieces: parseInt(0), lstShipmentInfo: ShipmentDetailArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {
                        var resItem = resData[0];
                        if (rowId == undefined) {
                            $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : resItem.pValue);
                            $("span[id='PBasis']").text(resItem.PrimaryBasis);
                            $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : resItem.sValue);
                            $("span[id='SBasis']").text(resItem.SecondaryBasis);
                            $("span[id='Amount']").text(resItem.ChargeAmount);
                            $("span[id='TotalTaxAmount']").text(resItem.TotalTaxAmount);
                            $("span[id='TotalAmount']").text(resItem.TotalAmount);
                            $("span[id='Remarks']").text(resItem.ChargeRemarks);
                        }
                        else {
                            $("span[id='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : resItem.pValue);
                            $("span[id='PBasis_" + rowId + "']").text(resItem.PrimaryBasis);
                            $("span[id='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : resItem.sValue);
                            $("span[id='SBasis_" + rowId + "']").text(resItem.SecondaryBasis);
                            $("span[id='Amount_" + rowId + "']").text(resItem.ChargeAmount);
                            $("span[id='TotalTaxAmount_" + rowId + "']").text(resItem.TotalTaxAmount);
                            $("span[id='TotalAmount_" + rowId + "']").text(resItem.TotalAmount);
                            $("span[id='Remarks_" + rowId + "']").text(resItem.ChargeRemarks);
                        }
                    }

                    $("div[id$='areaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                        if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                            $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                            $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                        }
                    });
                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(2));
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");
                //$("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").text("");
                //$("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").html("");
                $("span[id^='Amount_" + rowId + "']").html("");
                $("span[id^='TotalTaxAmount" + rowId + "']").html("");
                $("span[id^='TotalAmount_" + rowId + "']").html("");
                $("span[id^='Remarks" + rowId + "']").html("");
                Flag = false;
            }
        }
    });
    return Flag;
}

function OnSelectTruckNo() {
    var TruckDailyFlightSNo = $("#TruckNo").val();
    var Text_TruckNo = $("#Text_TruckNo").val();
    if (TruckDailyFlightSNo != undefined || TruckDailyFlightSNo != "") {
        $.ajax({
            url: "Services/RFS/RFSService.svc/GetTruckDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DailyFlightSNo: TruckDailyFlightSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    var resItem = resData[0];

                    //if (IsAssignFlight == "1" && CurrentTruckDestination != resItem.DestinationAirportCode) {
                    //    ShowMessage("warning", "Warning", "Flight assigned, Can't change different '" + resItem.DestinationAirportCode + "' destination's Truck Schedule Number. ");
                    //    return;
                    //}

                    if (RFSTruckDetailsSNo != '0') {
                        if (IsAssignFlight == "1" && IsCharges == "0" && IsManifested == "0" && IsDeparted == "0" && CurrentTruckDestination != resItem.DestinationAirportCode) {
                            var r = confirm("Assigned flights would be removed.Do you wish to continue ?");
                            if (r == true) {
                                $.ajax({
                                    url: "Services/RFS/RFSService.svc/RemoveRFSAssignFlightDetails", async: false, type: "POST", dataType: "json", cache: false,
                                    data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) { }
                                });
                            }
                            else {
                                $("#Text_TruckNo").val(CurrentTruckNo);
                                $("#TruckNo").val(DailyFlightSNo);
                                $("#spnOriginAirport").focus();
                                return;
                            }
                        }
                    }

                    $("#OriginAirport").val(resItem.OriginAirportSNo);
                    $("#Text_OriginAirport").val(resItem.OriginAirportCode);
                    $("#DestinationAirport").val(resItem.DestinationAirPortSNo);
                    $("#Text_DestinationAirport").val(resItem.DestinationAirportCode);
                    $("#ETD").val(resItem.ETD);
                    $("#ETA").val(resItem.ETA);
                    $("#TruckCapacity").val(resItem.TruckCapacity);
                    $("#_tempTruckCapacity").val(resItem.TruckCapacity);
                }
            }
        });
    }
}

function BindAssignFlightItemAutoComplete(elem, mainElem) {
    //var ULDCount = 0;
    //$(elem).find("span[id^='ULDCount']").each(function () {
    //    ULDCount = ULDCount + parseInt($(this).text());
    //});

    //if (ULDCount > 4) {
    //    ShowMessage("warning", "Warning - Assign Flight", "ULD Count should be less than & equal to 4.");
    //    return;
    //}
    //else {

    $(elem).find("input[id^='AssignFlightNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "FlightNo", "vwRFSAssignFlightNo", "SNo", "FlightNo", ["FlightNo"], OnSelectAssignFlight, "contains");
    });
    $(elem).find("input[id^='AssignFlightDate']").each(function () {
        $(this).kendoDatePicker();
        $(this).closest("span").css("width", "125px");
        $(this).css("width", "100px");
    });

    var ctrlID = $(elem).closest("tr").find("input[id^='AssignFlightDate']").attr("id");
    $(elem).find("input[id^='AssignFlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { OnSelectAssignFlightDate(ctrlID) });

    //}
}

function ReBindAssignFlightItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='AssignFlightNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "FlightNo", "vwRFSAssignFlightNo", "SNo", "FlightNo", ["FlightNo"], OnSelectAssignFlight, "contains");
    });
    $(elem).find("input[id^='AssignFlightDate']").each(function () {
        $(this).kendoDatePicker();
        $(this).closest("span").css("width", "125px");
        $(this).css("width", "100px");
    });

    var ctrlID = $(elem).closest("tr").find("input[id^='AssignFlightDate']").attr("id");
    $(elem).find("input[id^='AssignFlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { OnSelectAssignFlightDate(ctrlID) });
}

var arr = [];

function OnSelectAssignFlight(e) {
    $("#" + e).closest("tr").find("input[id^='ChargeableUnit']").val("");
    $("#" + e).closest("tr").find("span[id^='ChargeableUnit']").text("");

    arr = [];
    $("div[id$='divareaTrans_rfs_rfsassignflightinformation']").find("input[id^='Text_AssignFlightNo']").closest("tr").each(function () {
        var _flightNo = $(this).find("input[id^='Text_AssignFlightNo']").val();
        var _flightDate = $(this).find("input[id^='AssignFlightDate']").attr("sqldatevalue");
        arr.push(
            {
                FlightNo: _flightNo,
                FlightDate: _flightDate
            });
    });

    if (arr != null && arr.length > 0) {
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            var currentValue = arr[i]["FlightNo"] + '#' + arr[i]["FlightDate"];
            for (var j = 0; j < arr.length; j++) {
                var checkedValue = arr[j]["FlightNo"] + '#' + arr[j]["FlightDate"];
                if (currentValue == checkedValue) {
                    count = count + 1;
                    if (count > 1) {
                        ShowMessage("warning", "Warning - Assign Flight Information", "Flight '" + $("#" + e).val() + "' is already assigned.");
                        $("#" + e).val("");
                        return;
                    }
                }
            }
            if (count > 1)
                return;
            count = 0;
        }
    }

    var objAssignFlightNo = $("#" + e).closest("tr").find("input[id^='AssignFlightNo']").val();
    if (objAssignFlightNo != "") {
        $.ajax({
            url: "Services/RFS/RFSService.svc/GetULDCount", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DailyFlightSNo: objAssignFlightNo, RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                //var CheckForVALandCOU = Data.Table0;
                var uldCountData = Data.Table1;
                var flightData = Data.Table2;
                if (flightData.length > 0) {
                    if (flightData[0].FlightCount == 100001) {
                        var asDate = $("#" + e).closest("tr").find("input[id^='AssignFlightDate']").val();
                        var asFlight = $("#" + e).closest("tr").find("input[id^='Text_AssignFlightNo']").val()
                        ShowMessage("warning", "Warning - Assign Flight", "Flight '" + asFlight + "' of '" + asDate + "' already assigned in another truck.");
                        $("#" + e).closest("tr").find("input[id^='ULDCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='ULDCount']").text("");
                        $("#" + e).closest("tr").find("input[id^='AssignFlightNo']").val("");
                        $("#" + e).closest("tr").find("input[id^='Text_AssignFlightNo']").val("");

                        $("#" + e).closest("tr").find("input[id^='ChargeableUnit']").val("");
                        $("#" + e).closest("tr").find("span[id^='ChargeableUnit']").text("");

                        //$("#" + e).closest("tr").find("input[id^='_tempChargeableUnit']").val("");
                        $("#" + e).closest("tr").find("input[id^='CalculatedPosition']").val("");
                        $("#" + e).closest("tr").find("span[id^='CalculatedPosition']").text("");
                        $("#" + e).closest("tr").find("input[id^='FULDCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='FBulkCount']").text("");
                        $("#" + e).closest("tr").find("input[id^='FBulkCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='FULDCount']").text("");
                        return;
                    }
                }

                //if (CheckForVALandCOU[0].Column1.split('?')[0] == "1") {
                //    $.alerts.okButton = 'Yes';
                //    $.alerts.cancelButton = 'No';
                //    var r = jConfirm(CheckForVALandCOU[0].Column1.split('?')[1], "", function (r) {
                //        if (r == false) {
                //            $("#" + e).closest("tr").find("input[id^='ULDCount']").val("");
                //            $("#" + e).closest("tr").find("span[id^='ULDCount']").text("");
                //            $("#" + e).closest("tr").find("input[id^='AssignFlightNo']").val("");
                //            $("#" + e).closest("tr").find("input[id^='Text_AssignFlightNo']").val("");

                //            $("#" + e).closest("tr").find("input[id^='ChargeableUnit']").val("");
                //            $("#" + e).closest("tr").find("span[id^='ChargeableUnit']").text("");

                //            //$("#" + e).closest("tr").find("input[id^='_tempChargeableUnit']").val("");
                //            $("#" + e).closest("tr").find("input[id^='CalculatedPosition']").val("");
                //            $("#" + e).closest("tr").find("span[id^='CalculatedPosition']").text("");
                //            $("#" + e).closest("tr").find("input[id^='FULDCount']").val("");
                //            $("#" + e).closest("tr").find("span[id^='FBulkCount']").text("");
                //            $("#" + e).closest("tr").find("input[id^='FBulkCount']").val("");
                //            $("#" + e).closest("tr").find("span[id^='FULDCount']").text("");
                //            return;
                //        }
                //    });
                //}

                $("#" + e).closest("tr").find("span[id^='ULDCount']").text("");
                $("#" + e).closest("tr").find("input[id^='ULDCount']").text("");
                $("#" + e).closest("tr").find("span[id^='ULDCount']").text(uldCountData[0].ULDCount);
                $("#" + e).closest("tr").find("input[id^='ULDCount']").val(uldCountData[0].ULDCount);
                //$("#" + e).closest("tr").find("input[id^='_tempChargeableUnit']").val(uldCountData[0].MinULDCount);

                $("#" + e).closest("tr").find("input[id^='ChargeableUnit']").val(uldCountData[0].MinULDCount);
                $("#" + e).closest("tr").find("span[id^='ChargeableUnit']").text(uldCountData[0].MinULDCount);

                $("#" + e).closest("tr").find("input[id^='CalculatedPosition']").val(uldCountData[0].CalculatedPosition);
                $("#" + e).closest("tr").find("span[id^='CalculatedPosition']").text(uldCountData[0].CalculatedPosition);
                $("#" + e).closest("tr").find("input[id^='MinULDCount']").val(uldCountData[0].MinULDCount);
                $("#" + e).closest("tr").find("input[id^='IsBulkCount']").val(uldCountData[0].IsBulkCount);
                $("#" + e).closest("tr").find("input[id^='IsULDCount']").val(uldCountData[0].IsULDCount);
                $("#" + e).closest("tr").find("input[id^='FULDCount']").val(uldCountData[0].FULDCount);
                $("#" + e).closest("tr").find("span[id^='FBulkCount']").text(uldCountData[0].FBulkCount);
                $("#" + e).closest("tr").find("input[id^='FBulkCount']").val(uldCountData[0].FBulkCount);
                $("#" + e).closest("tr").find("span[id^='FULDCount']").text(uldCountData[0].FULDCount);

                $("#" + e).closest("tr").find("input[id^='IsMinBulkCount']").val(uldCountData[0].IsMinBulkCount);
                $("#" + e).closest("tr").find("input[id^='IsMinULDCount']").val(uldCountData[0].IsMinULDCount);



                var TotalMinULDCount = 0;
                var TotalMinBulkCount = 0;
                $("div[id$='divareaTrans_rfs_rfsassignflightinformation']").find("input[id^='MinULDCount']").each(function () {
                    TotalMinULDCount = TotalMinULDCount + parseFloat($(this).closest("tr").find("input[id^='IsMinULDCount']").val());
                    TotalMinBulkCount = TotalMinBulkCount + parseFloat($(this).closest("tr").find("input[id^='IsMinBulkCount']").val());
                });

                var TotalMinULDBulkCount = TotalMinULDCount + (TotalMinBulkCount > 0 ? 1 : 0);
                if (TotalMinULDBulkCount > 6) {
                    ShowMessage("warning", "Warning - Assign Flight", "Max 06 positions allowed.");
                    $("div[id$='divareaTrans_rfs_rfsassignflightinformation']").find("input[id^='MinULDCount']").each(function () {
                        $("#" + e).closest("tr").find("input[id^='ULDCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='ULDCount']").text("");
                        $("#" + e).closest("tr").find("input[id^='AssignFlightNo']").val("");
                        $("#" + e).closest("tr").find("input[id^='Text_AssignFlightNo']").val("");

                        $("#" + e).closest("tr").find("input[id^='ChargeableUnit']").val("");
                        $("#" + e).closest("tr").find("span[id^='ChargeableUnit']").text("");

                        //$("#" + e).closest("tr").find("input[id^='_tempChargeableUnit']").val("");
                        $("#" + e).closest("tr").find("input[id^='CalculatedPosition']").val("");
                        $("#" + e).closest("tr").find("span[id^='CalculatedPosition']").text("");
                        $("#" + e).closest("tr").find("input[id^='FULDCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='FBulkCount']").text("");
                        $("#" + e).closest("tr").find("input[id^='FBulkCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='FULDCount']").text("");
                        $("#" + e).closest("tr").find("span[id^='IsMinBulkCount']").text("");
                        $("#" + e).closest("tr").find("span[id^='IsMinULDCount']").text("");
                    });
                    return;
                }

                var TotalULDCount = 0;
                var TotalBulkCount = 0;
                $("div[id$='divareaTrans_rfs_rfsassignflightinformation']").find("span[id^='ULDCount']").each(function () {
                    TotalULDCount = TotalULDCount + parseInt($(this).closest("tr").find("input[id^='IsULDCount']").val());
                    TotalBulkCount = TotalBulkCount + parseInt($(this).closest("tr").find("input[id^='IsBulkCount']").val());
                });

                var TotalULDBulkCount = TotalULDCount + (TotalBulkCount > 0 ? 1 : 0);
                if (TotalULDBulkCount > 11) {
                    ShowMessage("warning", "Warning - Assign Flight", "No Of Unit can not be greater than 11.");
                    $("div[id$='divareaTrans_rfs_rfsassignflightinformation']").find("span[id^='ULDCount']").each(function () {
                        $("#" + e).closest("tr").find("input[id^='ULDCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='ULDCount']").text("");
                        $("#" + e).closest("tr").find("input[id^='AssignFlightNo']").val("");
                        $("#" + e).closest("tr").find("input[id^='Text_AssignFlightNo']").val("");

                        $("#" + e).closest("tr").find("input[id^='ChargeableUnit']").val("");
                        $("#" + e).closest("tr").find("span[id^='ChargeableUnit']").text("");

                        //$("#" + e).closest("tr").find("input[id^='_tempChargeableUnit']").val("");
                        $("#" + e).closest("tr").find("input[id^='CalculatedPosition']").val("");
                        $("#" + e).closest("tr").find("span[id^='CalculatedPosition']").text("");
                        $("#" + e).closest("tr").find("input[id^='FULDCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='FBulkCount']").text("");
                        $("#" + e).closest("tr").find("input[id^='FBulkCount']").val("");
                        $("#" + e).closest("tr").find("span[id^='FULDCount']").text("");
                        $("#" + e).closest("tr").find("span[id^='IsMinBulkCount']").text("");
                        $("#" + e).closest("tr").find("span[id^='IsMinULDCount']").text("");
                    });
                    return;
                }
            }
        });
    }
}

function BindChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeAirline']").each(function () {
        cfi.AutoComplete($(this).closest("tr").find("input[id^='ChargeAirline']").attr("name"), "AirlineCode,AirlineName", "vGetRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
    });

    $(elem).find("input[id^='ChargeName']").each(function () {
        cfi.AutoCompleteForFBLHandlingCharge($(this).closest("tr").find("input[id^='ChargeName']").attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", RFSTruckDetailsSNo, 0, userContext.CityCode, 2, "", "2", "999999999", "No");
    });
    $(elem).find("input[id^='PValue']").each(function () {
        var currentID = $(this)[0].id;
        $('#' + currentID).on("keypress", function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                return false;

            if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                event.preventDefault();
            }
            return true;
        });
    });

    $(elem).find("input[id^='SValue']").each(function () {
        if ($(this).closest("td").find("span[id^='SBasis']").text() == undefined || $(this).closest("td").find("span[id^='SBasis']").text() == "") {
            $(this).closest("span").find("input[id^='SValue']").css("display", "none");
            $(this).closest("td").find("span[id^='SBasis']").css("display", "none");
        }
        var currentID = $(this)[0].id;
        $('#' + currentID).on("keypress", function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                return false;

            if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                event.preventDefault();
            }
            return true;
        });
    });

    $(elem).find("input[id^='ChargeAirline']").closest("td").find("span:first").css("width", "145px");
}

function ReBindChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeAirline']").each(function () {
        cfi.AutoComplete($(this).closest("tr").find("input[id^='ChargeAirline']").attr("name"), "AirlineCode,AirlineName", "vGetRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
    });

    $(elem).find("input[id^='ChargeName']").each(function () {
        cfi.AutoCompleteForFBLHandlingCharge($(this).closest("tr").find("input[id^='ChargeName']").attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", RFSTruckDetailsSNo, 0, userContext.CityCode, 2, "", "2", "999999999", "No");
    });
    $(elem).find("input[id^='PValue']").each(function () {
        var currentID = $(this)[0].id;
        $('#' + currentID).on("keypress", function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                return false;

            if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                event.preventDefault();
            }
            return true;
        });
    });
    $(elem).find("input[id^='SValue']").each(function () {
        if ($(this).closest("td").find("span[id^='SBasis']").text() == undefined || $(this).closest("td").find("span[id^='SBasis']").text() == "") {
            $(this).closest("span").find("input[id^='SValue']").css("display", "none");
            $(this).closest("td").find("span[id^='SBasis']").css("display", "none");
        }
        var currentID = $(this)[0].id;
        $('#' + currentID).on("keypress", function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                return false;

            if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                event.preventDefault();
            }
            return true;
        });
    });
    $(elem).find("input[id^='ChargeAirline']").closest("td").find("span:first").css("width", "145px");
}

function MarkSelected(obj) {
    var trRow = $(obj).closest("tr");
    trRow.find("input[type='radio']").each(function () {
        $(this).prop('checked', false);
    });
    $(obj).prop('checked', true);
}

function CalculatePayment(obj) {
    if ($(obj).attr("type") == "radio") {
        MarkSelected(obj);
    }
    var totalRFSAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {
                    totalRFSAmount = totalRFSAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else {
                }
            }
        });
    });
    totalRFSAmount = parseFloat(totalRFSAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_rfs_rfscharges").next("table").find("span[id='FBLAmount']").html(totalRFSAmount.toString());
    $("#divareaTrans_rfs_rfscharges").next("table").find("input[id='FBLAmount']").val(totalRFSAmount.toString());
    $("#divareaTrans_rfs_rfscharges").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_rfs_rfscharges").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());
    $("#CashAmount").val(totalRFSAmount);
    $("#_tempCashAmount").val(totalRFSAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
    }
}

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

    cfi.AutoComplete("SearchAirlineCarrierCode", "AirlineCode,AirlineName", "VGetInventoryAirline", "CarrierCode", "AirlineName", null, null, "contains");
    cfi.AutoComplete("SearchBoardingPoint", "AirportCode", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"]);
    $("#Text_SearchAirlineCarrierCode").attr("placeholder", "Airline");
    $("#Text_SearchBoardingPoint").attr("placeholder", "Boarding Point");
}

function TruckSourceChange() {
    $("#Text_Vendor").val("");
    $("#Vendor").val("");
    $("#DriverID").val("");
    $("#MobileNo").val("");
    if ($('#TruckSource:checked').val() == "0" || $('#TruckSource:checked').val() == "2") {
        $("#_tempHiringCharges").hide();
        $("#HiringCharges").closest("td").prev().find("span").hide();
    }
    else {
        $("#_tempHiringCharges").show();
        $("#HiringCharges").closest("td").prev().find("span").show();
    }

    BindSASTruckRegistrationNo();
    BindSASDriverName();
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
}

function AutoCompleteForFBLHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
        $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
            filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
            dataSource: dataSource,
            filterField: basedOn,
            separator: (separator == undefined ? null : separator),
            dataTextField: autoCompleteText,
            dataValueField: autoCompleteKey,
            valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
            template: '<span>#: TemplateColumn #</span>',
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            newAllowed: newAllowed,
            confirmOnAdd: confirmOnAdd
        });
    }
}

var fblurl = 'Services/AutoCompleteService.svc/WMSRFSAutoCompleteDataSource';
function GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? fblurl : serviceurl + newUrl), dataType: "json", type: "POST", contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName, keyColumn: keyColumn, textColumn: textColumn, templateColumn: templateColumn, procedureName: procName, awbSNo: awbSNo,
                    chargeTo: chargeTo, cityCode: cityCode, movementType: movementType, hawbSNo: hawbSNo, loginSNo: loginSNo, chWt: chWt, cityChangeFlag: cityChangeFlag
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    totalAmountDO = 0;
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    //if (obj.id.indexOf("PValue") > -1) {
    //    pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
    //    sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("PValue", "SValue")).val() : 0;
    //}
    //else {
    //    sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
    //    pValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("SValue", "PValue")).val() : 0;
    //}

    pValue = ($(obj).closest("tr").find("input[id^='PValue']").val() == "" || $(obj).closest("tr").find("input[id^='PValue']").val() == undefined) ? 0 : $(obj).closest("tr").find("input[id^='PValue']").val();
    sValue = ($(obj).closest("tr").find("input[id^='SValue']").val() == "" || $(obj).closest("tr").find("input[id^='SValue']").val() == undefined) ? 0 : $(obj).closest("tr").find("input[id^='SValue']").val();

    if (tariffSNo == "" || tariffSNo == undefined) {
        alert("Please select Charges.");
    }
    else {
        totalHandlingCharges = 0;
        totalAmountDO = 0;

        var ShipmentDetailArray = [];
        var ShipmentDetailViewModel = {
            PartNumber: 0,
            AWBSNo: 0,
            HAWBSNo: 0,
            PartSNo: 0,
            Pieces: 0,
            GrossWeight: 0,
            VolumeWeight: 0,
            IsBUP: 0,
            SPHCSNo: 0,
            SPHCTransSNo: 0
        };
        ShipmentDetailArray.push(ShipmentDetailViewModel);
        $.ajax({
            url: "Services/RFS/RFSService.svc/GetChargeValue", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ TariffSNo: parseInt(tariffSNo), AWBSNo: RFSTruckDetailsSNo, CityCode: userContext.CityCode, PValue: +parseInt(pValue == "" ? 0 : pValue), SValue: parseInt(sValue), HAWBSNo: 0, ProcessSNo: parseInt(33), SubProcessSNo: parseInt(2297), GrWT: parseFloat(0), ChWt: parseFloat(0), Pieces: parseInt(0), lstShipmentInfo: ShipmentDetailArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").text(doItem.SecondryBasis);
                        $("span[id='Amount']").text(doItem.ChargeAmount);
                        $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id='Remarks']").text(doItem.ChargeRemarks);
                    }
                    else {
                        $("span[id='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                        $("span[id='SBasis" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis" + rowId + "']").text(doItem.SecondryBasis);
                        $("span[id='Amount" + rowId + "']").text(doItem.ChargeAmount);
                        $("span[id='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
                        $("span[id='TotalAmount" + rowId + "']").text(doItem.TotalAmount);
                        $("span[id='Remarks" + rowId + "']").text(doItem.ChargeRemarks);
                    }
                }
                $("div[id$='areaTrans_rfs_rfscharges']").find("[id^='areaTrans_rfs_rfscharges']").each(function (i, row) {
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        });
    }
}

function DisableFlight() {
    //.completeprocess
    //$("#tabstrip div.k-state-active").find("div[id^='divManifestULDDetail']").find("table").each(function () {
    //    if ($(this).closest("tr").find("td[data-column='IsCTM']").find("input").attr("style") == "background-color:green;") {
    //        $(this).closest("tr").find("td[data-column='IsCTM']").find("input").attr("class", "completeprocess");
    //    }
    //    else {
    //        $(this).closest("tr").find("td[data-column='IsCTM']").find("input").removeAttr("class");
    //    }
    //});

}

function checkProgrss(item, subprocess, displaycaption) {
    //if (item != "0") {
    //    var ProgressStatus = item.split('_');
    //    if ((displaycaption == "T") && (ProgressStatus[0] == 1)) {
    //        return "\"completeprocess\"";
    //    }
    //    if ((displaycaption == "F") && (ProgressStatus[1] == 1)) {
    //        return "\"completeprocess\"";
    //    }
    //    if ((displaycaption == "M") && (ProgressStatus[2] == 1)) {
    //        return "\"completeprocess\"";
    //    }
    //    if ((displaycaption == "C") && (ProgressStatus[3] == 1)) {
    //        return "\"completeprocess\"";
    //    }
    //    if ((displaycaption == "D") && (ProgressStatus[4] == 1)) {
    //        return "\"completeprocess\"";
    //    }

    //    if ((displaycaption == "T") && (ProgressStatus[0] == 0)) {
    //        return "\"incompleteprocess\"";
    //    }
    //    if ((displaycaption == "F") && (ProgressStatus[1] == 0)) {
    //        return "\"incompleteprocess\"";
    //    }
    //    if ((displaycaption == "M") && (ProgressStatus[2] == 0)) {
    //        return "\"incompleteprocess\"";
    //    }
    //    if ((displaycaption == "C") && (ProgressStatus[3] == 0)) {
    //        return "\"incompleteprocess\"";
    //    }
    //    if ((displaycaption == "D") && (ProgressStatus[4] == 0)) {
    //        return "\"incompleteprocess\"";
    //    }
    //}

    if ((item).toUpperCase().indexOf(subprocess.toUpperCase() + "_1_C") >= 0) {
        return "\"completeprocess\"";
    }
    if ((item).toUpperCase().indexOf(subprocess.toUpperCase() + "_0_I") >= 0) {
        return "\"incompleteprocess\"";
    }
}
function PrintPreManifest(RFSTruckDetailsSNo) {
    if ($("#divPrintManifest").length === 0)
        $("#tabstrip").after('<div id="divPrintManifest" tabindex="1"></div>');

    $("#divPrintManifest").html("");
    $(arrFlightNo).each(function (r, i) {
        $.ajax({
            url: "Services/RFS/RFSService.svc/PrintPreManifest?DailyFlightSNo=" + i + "&RFSTruckDetailsSNo=" + RFSTruckDetailsSNo, async: false, type: "get", dataType: "html", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divPrintManifest").append(result);

                if (r == arrFlightNo.length - 1) {
                    $("#btnPrint").unbind("click").bind("click", function () {
                        $("#divPrintManifest").printArea();
                    });
                }
                else {
                    $("#btnPrint").closest('tr').remove();
                    $("#divPrintManifest").append('</br><div class="page-break"></div>');
                }
            },
            error: function (rex) {

            }
        });

    });

    // added by deepak
    if ($("#divPrintManifest").find("table[id='tblReport']").length > 0) {
        var tblLength = $("#divPrintManifest").find("table[id='tblReport']").length;
        for (var i = 1; i <= tblLength; ++i) {
            $("#divPrintManifest").find("table[id='tblReport']").find("span[id='pageNo']").eq(i - 1).text("Page " + i + " of " + tblLength);
        }
    }

    arrFlightNo.length = 0;
    $('#divPrint').remove();
    $("#divPrintManifest").focus();
}

function InitializePage(subprocess, cntrlid, isdblclick) {
    InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "RFSASSIGNFLIGHTINFORMATION") {
        $.ajax({
            url: "Services/RFS/RFSService.svc/BindRFSAssignFlightInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var AssignFlightArray = Data.Table0;
                if (IsManifested == "0") {
                    $("#btnSave").css("display", "block");
                    $("#areaTrans_rfs_rfsassignflightinformation").find("td [id^=transActionDiv]").show();
                }
                else {
                    $("#btnSave").css("display", "none");
                    $("#areaTrans_rfs_rfsassignflightinformation").find("td [id^=transActionDiv]").hide();
                }

                cfi.makeTrans("rfs_rfsassignflightinformation", null, null, BindAssignFlightItemAutoComplete, ReBindAssignFlightItemAutoComplete, null, AssignFlightArray, null);

                $("div[id$='divareaTrans_rfs_rfsassignflightinformation']").find("[id='areaTrans_rfs_rfsassignflightinformation']").each(function () {
                    $(this).find("input[id^='AssignFlightNo']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "FlightNo", "vwRFSAssignFlightNo", "SNo", "FlightNo", ["FlightNo"], OnSelectAssignFlight, "contains");
                    });
                    $(this).closest("tr").find("input[id^='AssignFlightDate']").each(function () {
                        $(this).kendoDatePicker();
                        $(this).css("width", "100px");
                        $(this).closest("span").css("width", "125px");
                        //var ctrlID = $(this).closest("tr").find("input[id^='AssignFlightDate']").attr("id");
                        //$(this).closest("tr").find("input[id^='AssignFlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { OnSelectAssignFlightDate(ctrlID) });
                    });

                    var ctrlID = $(this).closest("tr").find("input[id^='AssignFlightDate']").attr("id");
                    $(this).closest("tr").find("input[id^='AssignFlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { OnSelectAssignFlightDate(ctrlID) });
                });

            }
        });

        $('#assignFlightDetails').append("<div id='divHeightAssign' style='height:100px'></div>");
        if (IsAssignFlight == "0") {
            $('#AssignFlightDate').data("kendoDatePicker").value("");
        }
        UserSubProcessRights("assignFlightDetails", subprocesssno);
        if (IsManifested == "0") {
            $("#btnSave").css("display", "block");
        }
        else {
            $("#btnSave").css("display", "none");
        }
    }

    if (subprocess.toUpperCase() == "RFSDEPARTUREINFORMATION") {
        //var boolChargeRFSDeparture = CheckAssignFlight(RFSTruckDetailsSNo);
        //if (boolChargeRFSDeparture == false) {
        //    return;
        //}

        //var boolManifestFlight = CheckManifestFlight(RFSTruckDetailsSNo);
        //       if (boolManifestFlight == false) {
        //           return;
        //       }

        if (TruckType == 'EMPTY CONTAINER MOVEMENT') {
            $("#spnSealNo").closest("td").html('<font color="red">&nbsp;</font><span id="spnSealNo"> Seal No</span>');
            $("#spnSealPersonName").closest("td").html('<font color="red">&nbsp;</font><span id="spnSealPersonName"> Seal By</span>');
            $("#spnIPTANo").closest("td").html('<font color="red">&nbsp;</font><span id="spnIPTANo"> IPTA No</span>');
        }

        if (IsAssignFlight == "0") {
            ShowMessage("warning", "Warning - RFS Charges", "Flight not assigned.");
            return;
        }

        if (IsManifested == "0") {
            ShowMessage("warning", "Warning - RFS Charges", "Manifest is not created, details can not be saved.");
            return;
        }

        $.ajax({
            url: "Services/RFS/RFSService.svc/BindRFSDepartureInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData2 = Data.Table1;
                if (resData.length > 0) {
                    var resItem = resData[0];
                    TableRFSTruckDetailsSNo = RFSTruckDetailsSNo;
                    $("#DateOfDeparture").data("kendoDatePicker").value(resItem.DateOfDeparture);
                    $("#ATD").val(resItem.ATD);
                    $("#SealNo").val(resItem.SealNo);
                    $("#IPTANo").val(resItem.IPTANo);
                    $("#SealPersonName").val(resItem.SealPersonName);
                    $("#RFSMovementNo").val(resItem.RFSMovementNo);
                    $("span#RFSMovementNo").text(resItem.RFSMovementNo);
                    $("#DRemarks").val(resItem.DRemarks);
                    $("#DelayRemarks").val(resItem.DelayRemarks);
                    $("#DateOfDeparture").css("width", "130px");
                    $("#DateOfDeparture").closest("span").css("width", "155px");

                    if ($("#spnRFSTruckNo").length === 0)
                        $("#__tblrfsdepartureinformation__ tbody tr td:contains('Departure Details')").append('<span id="spnRFSTruckNo" style="float:right;color:#9d331d; font-size:12px; font-weight:bold; margin-right:40px;"></span>');

                    $("span#spnRFSTruckNo").text('Truck No : ' + resItem.TruckNo + ' , Date : ' + resItem.TruckDate);

                    if (resData2[0].Column1 == '1') {
                        $("#divRFSHistory").show();
                    }
                    else {
                        $("#divRFSHistory").hide();
                        return;
                    }

                    $.ajax({
                        url: "Services/RFS/RFSService.svc/GetWebForm/RFS/RFS/RFSHistory/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            if ($("#divRFSHistory").length == 0)
                                $("#departureDetails").append("<div id='divRFSHistory'></div>");
                            $("#divRFSHistory").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");

                            cfi.AutoComplete("HistoryTruckType", "TruckType", "vRFSTruckType", "SNo", "TruckType", ["TruckType"], null, "contains");
                            cfi.AutoComplete("HLocation", "Location,Description", "TruckLocation", "SNo", "Location", ["Location", "Description"], null, "contains");

                            $("#Text_HistoryTruckType").css("width", "178px");
                            $("#Text_HistoryTruckType").parent().closest("span").css("width", "178px");
                            $("#Text_HLocation").css("width", "178px");
                            $("#Text_HLocation").parent().closest("span").css("width", "178px");

                            $("#HMobileNo").unbind("keypress").bind("keypress", function () {
                                ISNumeric(this);
                            });
                            $("#divRFSHistory").append("<div id='divHeightRFSHistory' style='height:50px'></div>");
                            $("#__divrfshistory__").css("border", "1px solid #159e5c");

                            $.ajax({
                                url: "Services/RFS/RFSService.svc/BindRFSHistory", async: false, type: "POST", dataType: "json", cache: false,
                                data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    var Data1 = jQuery.parseJSON(result);
                                    var resData1 = Data1.Table0;
                                    if (resData1.length > 0) {
                                        var resItem1 = resData1[0];
                                        $("#HTruckRegistrationNo").val(resItem1.TruckRegistrationNo);
                                        $("#HDriverName").val(resItem1.DriverName);
                                        $("#HDriverID").val(resItem1.DriverID);
                                        $("#HMobileNo").val(resItem1.DriverMobile);
                                        $("#_tempHMobileNo").val(resItem1.DriverMobile);
                                        $("#Remarks").val(resItem1.Remarks);
                                        $("#HistoryTruckType").val(resItem1.TruckTypeSNo);
                                        $("#Text_HistoryTruckType").val(resItem1.TruckType);
                                        $("#HLocation").val(resItem1.LocationSNo);
                                        $("#Text_HLocation").val(resItem1.Location);
                                        if (IsCharges == "1") {
                                            $("#Text_HistoryTruckType").data("kendoAutoComplete").enable(false);
                                            $("#Text_HLocation").data("kendoAutoComplete").enable(false);
                                        }
                                        else {
                                            $("#Text_HistoryTruckType").data("kendoAutoComplete").enable(true);
                                            $("#Text_HLocation").data("kendoAutoComplete").enable(true);
                                        }

                                        if (resItem1.ScheduleTrip == "1") {
                                            $('input[name=HScheduleTrip][data-radioval=YES]').attr('checked', true);
                                        }
                                        else {
                                            $('input[name=HScheduleTrip][data-radioval=NO]').attr('checked', true);
                                        }

                                        if (IsCharges == "1") {
                                            $('input[name=HScheduleTrip][data-radioval=YES]').attr('disabled', "disabled");
                                            $('input[name=HScheduleTrip][data-radioval=NO]').attr('disabled', "disabled");
                                        }
                                        else {
                                            $('input[name=HScheduleTrip][data-radioval=YES]').removeAttr('disabled');
                                            $('input[name=HScheduleTrip][data-radioval=NO]').removeAttr('disabled');
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });

        $('#departureDetails').append("<div id='divHeightDepart' style='height:30px'></div>");
        UserSubProcessRights("__divrfsdepartureinformation__", subprocesssno);
        $("#departureDetails").find("textarea[id='DelayRemarks']").each(function () {
            ConvertIntoLablelTextArea("__divrfsdepartureinformation__", subprocesssno);
        });
        $("#departureDetails").find("textarea[id='DRemarks']").each(function () {
            ConvertIntoLablelTextArea("__divrfsdepartureinformation__", subprocesssno);
        });
        if ($("span#spnDateOfDeparture").closest("td").next().html() == "<span>Departure Date</span>") {
            $("span#spnDateOfDeparture").closest("td").next().find("span").text("");
        }

    }

    // RFS other info
    if (subprocess.toUpperCase() == "RFSOTHERINFOXML") {
        $.ajax({
            url: "Services/RFS/RFSService.svc/BindRFSOtherInfo", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    var resItem = resData[0];
                    $("#InvoiceNo").val(resItem.InvoiceNo);
                    $("#_tempSealCharges").val(resItem.SealCharges);
                    $("#SealCharges").val(resItem.SealCharges);
                }
            }
        });
        $("#btnSave").css("display", "block");
    }
}

function OnSelectAssignFlightDate(obj) {
    $("#" + obj).closest('tr').find("input[id^='Text_AssignFlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
    //$("#" + obj).closest('tr').find("input[id^='_tempChargeableUnit']").val("");
    $("#" + obj).closest('tr').find("input[id^='ChargeableUnit']").val("");
    $("#" + obj).closest('tr').find("span[id^='ChargeableUnit']").text("");
    $("#" + obj).closest('tr').find("input[id^='ULDCount']").val("");
    $("#" + obj).closest('tr').find("span[id^='ULDCount']").text("");
}

function RFSHistoryUpdate(obj) {
    if ($("#HTruckRegistrationNo").val() == "" || $("#HTruckRegistrationNo").val() == "0" || $("#HTruckRegistrationNo").val() == undefined) {
        ShowMessage("warning", "Warning - RFS History", "Enter truck registration no.");
        return;
    }
    if ($("#HDriverName").val() == "" || $("#HDriverName").val() == "0" || $("#HDriverName").val() == undefined) {
        ShowMessage("warning", "Warning - RFS History", "Enter driver name.");
        return;
    }
    //if ($("#HDriverID").val() == "" || $("#HDriverID").val() == "0" || $("#HDriverID").val() == undefined) {
    //    ShowMessage("warning", "Warning - RFS History", "Enter Driver ID.");
    //    return;
    //}
    //if ($("#HMobileNo").val() == "" || $("#HMobileNo").val() == "0" || $("#HMobileNo").val() == undefined) {
    //    ShowMessage("warning", "Warning - RFS History", "Enter mobile no.");
    //    return;
    //}
    if ($("#Remarks").val() == "" || $("#Remarks").val() == "0" || $("#Remarks").val() == undefined) {
        ShowMessage("warning", "Warning - RFS History", "Enter remarks.");
        return;
    }

    var TruckRFSHistoryDetails = [];
    var truckRFSHistoryDetailsData = {
        DriverID: $("#HDriverID").val() == undefined ? "" : $("#HDriverID").val(),
        DriverName: $("#HDriverName").val(),
        MobileNo: $("#HMobileNo").val() == undefined ? "" : $("#HMobileNo").val(),
        TruckRegistrationNo: $("#HTruckRegistrationNo").val(),
        Remarks: $("#Remarks").val(),
        TruckTypeSNo: $("#HistoryTruckType").val(),
        Location: $("#HLocation").val() == undefined ? "" : $("#HLocation").val(),
        ScheduleTrip: $('#HScheduleTrip:checked').val() == "0" ? 1 : 0,
    }

    TruckRFSHistoryDetails.push(truckRFSHistoryDetailsData);

    $.ajax({
        url: "Services/RFS/RFSService.svc/SaveRFSHistory", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ TruckRFSHistoryDetails: TruckRFSHistoryDetails, RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - RFS Driver Details', "Details updated successfully.");
                RFSSearch();
                return;
            }
        }
    });
}

//---############----CTM Charges---####------------------------------------
var FlightSNo;
function fn_GetCTMChargeDetails(AWBSNo, CTMSNo, input, FromType) {
    $("#divCTM").remove();
    var trHRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var AWBNoIndex = trHRow.find("th[data-field='AWBNo']").index();
    var AWBNo = $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text();
    FlightSNo = $(input).closest('tr').find("td[data-column='DailyFlightSNo']").text();
    $("#dv_FlightManifestPrint").html('<div id="divCTM" style="overflow:auto; display:none;"><table id="tblCTMResult" class="WebFormTable"></table></div>');

    $("#tblCTMResult").before('<B>Applied Charges<B><br/><table id="tblCTMResult1" class="WebFormTable"></table>')

    $("#tblCTMResult").append('<tr><td class="formlabel" style="width:10%; ">AWB No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnAWBNo">' + AWBNo + '</span></td><td class="formlabel" >Flight No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnFlightNo">' + $("#ulTab li.k-state-active").find("span#spnHdnManifestFlightNo").text() + '</span></td></tr>');

    $("#tblCTMResult").append("<tr><td class='formlabel' title='Select Bill Type' ><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillType'> Bill Type</span></td><td class='formInputcolumn' style='text-align:center;'><input type='hidden' name='BillType' id='BillType' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillType' id='Text_BillType' style='width: 100%; text-transform: uppercase;' tabindex='5' controltype='autocomplete' maxlength='' value='' data-valid='required' data-valid-msg='Bill Type can not be blank'  data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td><td class='formlabel' title='Select '><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillToSNo'>Bill To</span></td><td class='formInputcolumn' style='text-align:center;'><input type='hidden' name='BillToSNo' id='BillToSNo' value=''><span class='k-widget k-combobox k-header' style='display: inline-block;'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillToSNo' id='Text_BillToSNo' style='width: 100%; text-transform: uppercase;' tabindex='6' controltype='autocomplete' maxlength='' value=''  data-valid='required' data-valid-msg='Bill To can not be blank'  data-role='autocomplete' autocomplete='off' data-valid='required' data-valid-msg='Bill To.'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td></tr>");

    $("#tblCTMResult").after('<br/><B>CTM Charges<B><br/><table id="tblCTMCharges" class="WebFormTable"></table>')
    cfi.PopUp("divCTM", "CTM", 1200, null, null, null);
    $("#divCTM").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $('.k-window').closest("div:hidden").remove();
    $("#spnAWBNo").after("<input type='hidden' id='AWBNo' name='AWBNo' value=" + AWBSNo + " >");
    $("#spnFlightNo").after("<input type='hidden' id='FlightNo' name='FlightNo' value=" + FlightSNo + " >");
    $("#spnFlightNo").after("<input type='hidden' id='CTMSNo' name='CTMSNo' value=" + CTMSNo + " >");
    GetAWBWeight();
    BindCTMCharges();
    if (IsCTMCharges == "False")
        $("#tblCTMCharges").after("<br/><input type='button' id='SaveCTM' value='Save' class='btn btn-success' onclick='SaveCTMCharges()'>");
}

var flags = 0;
var weight = 0;
var IsCTMCharges = "False";
function popup() {

    $("#divCTM").remove();
    $("#SendMessage").after('<div id="divCTM" style="overflow:auto; display:none;"><table id="tblCTMResult" class="WebFormTable"></table></div>');
    $("#tblCTMResult").append('<tr><td class="formlabel" style="width:10%; text-align:center;">AWB No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnAWBNo"></span></td><td class="formlabel" style="text-align:center;">Flight No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnFlightNo"></span></td><td class="formlabel" style="text-align:center;">CTM</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnCTMSNo"></span></td></tr>');

    $("#tblCTMResult").after('<br/><B>CTM Charges<B><br/><table id="tblCTMCharges" class="WebFormTable"></table>')
    cfi.PopUp("divCTM", "CTM", 1200, null, null, null);
    $("#divCTM").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $('.k-window').closest("div:hidden").remove();
    $("#spnAWBNo").after("<input type='hidden' id='AWBNo' name='AWBNo' value >");
    $("#spnFlightNo").after("<input type='hidden' id='FlightNo' name='FlightNo' value >");
    $("#spnCTMSNo").after("<input type='hidden' id='CTMSNo' name='CTMSNo' value >");
    GetAWBWeight();
    BindCTMCharges()
    $("#tblCTMCharges").after("<br/><input type='button' id='SaveCTM' value='Save' class='btn btn-success' onclick='SaveCTMCharges()'>");
}

function GetAWBWeight() {
    var Sno = $("#AWBNo").val() + ',' + $("#CTMSNo").val();
    if ($("#AWBNo").val() != '') {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/GetAWBWeight",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Sno: Sno }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                weight = FinalData[0].Column1;
                IsCTMCharges = FinalData[0].IsCTMCharge;

            }
        });
    }
}

function SaveChargesCalculatedManually() {
    if ($("#txtChargesCalculatedManuallyRemarks").val() == "") {
        ShowMessage("warning", "Warning - Calculated Charges Manually", "Enter remarks.");
        return;
    }
    var chkChargesfinalized = ($("#spnRFSChargesBill").find("input[id=chkChargesfinalized]").is(":checked") == true) ? "1" : "0";
    if (chkChargesfinalized == "1") {
        $.ajax({
            url: "Services/RFS/RFSService.svc/SaveRFSChargeFinalized", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo, Chargesfinalized: chkChargesfinalized, ChargesRemarks: $("#txtChargesCalculatedManuallyRemarks").val() == undefined ? '' : $("#txtChargesCalculatedManuallyRemarks").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success', "Charges finalized Manually.");
                    ClearDiv();
                    RFSSearch();
                    $("#divChargesCalculatedManually").html("");
                    $("#divChargesCalculatedManually").dialog("close");
                }
            },
            error: function () {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        });
    }
}

function BindCTMCharges() {
    _CURR_PRO_ = "ESS";
    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/ESSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblCTMCharges").html(result);

            $("#tblCTMCharges").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            var AWBSNo = $("#AWBNo").val();
            //var FlightSNo = $("#FlightNo").val();
            var CTMSNo = $("#CTMSNo").val();
            var CityCode = userContext.CityCode;

            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetCTMSMendatoryCharges?AWBSNo=" + AWBSNo + "&FlightSNo=" + FlightSNo + "&CTMSNo=" + CTMSNo + "&CityCode='" + CityCode + "'&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34) + "&ArrivedShipmentSNo=0&RateType=0&GrWt=" + parseFloat(0) + "&ChWt=" + parseFloat(0) + "&Pieces=" + parseInt(0),
                async: false, type: "GET", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;

                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (resData != []) {
                        $(resData).each(function (row, i) {
                            if (i.IsMandatory == 1) {
                                MendatoryHandlingCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.pbasis == undefined ? '' : i.pbasis, "pvalue": i.pValue == undefined ? 0 : i.pValue, "sbasis": i.sbasis == undefined ? '' : i.sbasis, "svalue": i.sValue == undefined ? 0 : i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, "") });
                            }
                        });
                    }

                    cfi.makeTrans("tariff_tariffdohandlingcharge", null, null, BindCTMChargesItemAutoComplete, ReBindCTMChargesItemAutoComplete, null, MendatoryHandlingCharges);

                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            if ((MendatoryHandlingCharges[i].sbasis == undefined || MendatoryHandlingCharges[i].sbasis == "") && (MendatoryHandlingCharges[i].svalue == "" || MendatoryHandlingCharges[i].svalue == undefined || MendatoryHandlingCharges[i].svalue == "0.00")) {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "none");
                                $(this).find("input[id^='PValue']").focus();
                                $(this).find("input[id^='PValue']").blur();
                            }
                            else {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                                $(this).find("input[id^='SValue']").focus();
                                $(this).find("input[id^='SValue']").blur();
                            }
                            $("input[id='Rate']").closest("table").find('tr').find('td').find("span[id='spnRate']").hide();
                            $("input[id^='Rate']").closest("td").find("input").css("display", "none");
                            $(this).find("input[id^='Text_ChargeName']").attr('disabled', 'disabled');

                            $(this).find("div[id^=transActionDiv").hide();
                            $(this).find("input[id^='SValue']").focus();
                            $(this).find("input[id^='SValue']").blur();
                        });
                    }
                    else {
                        $("#tblCTMCharges").parent().parent().hide();
                        $("#tblCTMResult").hide();
                    }
                    $("input[id='Rate']").closest("table").find('tr').find('td').find("span[id='spnRate']").hide();
                    $("input[id^='Rate']").closest("td").find("input").css("display", "none");
                    $("input[id^='PValue']").closest("td").find("input").attr('disabled', 'disabled');
                    $("input[id^='SValue']").closest("td").find("input").attr('disabled', 'disabled');

                    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
                        });

                        $(this).find("input[id^='PValue']").each(function () {
                            var currentID = $(this)[0].id;
                            $('#' + currentID).on("keypress", function (event) {
                                var charCode = (event.which) ? event.which : event.keyCode;
                                if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                    return false;

                                if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                    event.preventDefault();
                                }
                                return true;
                            });
                        });

                        $(this).find("input[id^='SValue']").each(function () {
                            var currentID = $(this)[0].id;
                            $('#' + currentID).on("keypress", function (event) {
                                var charCode = (event.which) ? event.which : event.keyCode;
                                if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                    return false;

                                if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                    event.preventDefault();
                                }
                                return true;
                            });
                        });

                        $('#spnWaveOff').hide();
                        $("#spnRemarks").closest('td').next().next().hide()
                        $(this).find("input[id^='WaveOff']").hide();

                        //$(this).find("input[id^='Text_ChargeName']").attr('disabled', 'disabled')

                    });

                    cfi.AutoCompleteByDataSource("BillType", CTMBillto, onBillToSelect, null);
                    cfi.AutoComplete("BillToSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
                },
                error: function (xhr) {
                    var a = "";
                }
            });

            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetCTMSMendatoryChargesForFC?AWBSNo=" + AWBSNo + "&FlightSNo=" + FlightSNo + "&CTMSNo=" + CTMSNo + "&CityCode='" + CityCode + "'&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34) + "&ArrivedShipmentSNo=0&RateType=0&GrWt=" + parseFloat(0) + "&ChWt=" + parseFloat(0) + "&Pieces=" + parseInt(0),
                async: false, type: "GET", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {
                        $('#tblCTMResult1').append('<tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE NO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE DATE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AIRLINE/AGENT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PAYMENT MODE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PRINT</td></tr>');

                        for (var i = 0; i < resData.length; i++) {
                            $('#tblCTMResult1').append('<tr><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><span class="actionView" style="cursor:pointer;color:Blue;">' +
                                resData[i].InvoiceNo + '</span></td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].InvoiceDate + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].Airline + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resData[i].Amount + " AED" + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].PaymentMode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><a onclick="PrintRFSHandlingDetails(' + resData[i].SNo + ',' + resData[i].InvoiceType + ');" style="cursor:pointer;" ><i class="fa fa-print fa-2x"></i></a></td></tr>');
                        }
                    }
                },
                error: function (xhr) {
                    var a = "";
                }
            });
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

function AutoCompleteForCTMCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForCTMCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });
        }
    }
}

var dourl = 'Services/AutoCompleteService.svc/CTMAutoCompleteDataSource';
function GetDataSourceForCTMCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? dourl : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    chWt: chWt,
                    cityChangeFlag: cityChangeFlag,
                    FlightSNo: FlightSNo,
                    CTMSNo: CTMSNo,
                    ProcessSNo: ProcessSNo,
                    SubProcessSNo: SubProcessSNo
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

function BindCTMChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
    });

    if (flags == 1) {
        $(elem).find("input[id^='PaymentMode']").each(function () {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
            $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
        });
    }
    else {
        $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
            $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 0;
        });
    }
    $('#spnWaveOff').hide();
    $("#spnRemarks").closest('td').next().next().hide()
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='WaveOff']").hide();
}

function ReBindCTMChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SBasis']").each(function (i, row) {
        if ($(elem).find("span[id^='SBasis']").text() == '') {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
        }
        else {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
        }
        $(elem).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
    });
    $('#spnWaveOff').hide();
    $("#spnRemarks").closest('td').next().next().hide()
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='WaveOff']").hide();
}

var pValue = 0;
var sValue = 0;
var type = 'AWB';
function GatCTMValueOfAutocomplete(valueId, value, keyId, key) {
    pValue = 0;
    sValue = 0;
    rowId = valueId.split("_")[2];
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateCTMExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            if ($("input[id^='Text_HAWB']").length > 0) {
                var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
            }
            else
                var hawbSNo = 0;
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CTMGetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(($("#AWBNo").val() == '' ? 0 : $("#AWBNo").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + 2 + "&RateType=" + parseInt(0) + "&Remarks=" + type + "&FlightSNo=" + parseInt($("#FlightNo").val() == '' ? 0 : $("#FlightNo").val()) + "&CTMSNo=" + parseInt($("#CTMSNo").val() == '' ? 0 : $("#CTMSNo").val()) + "&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34),
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                            }
                            else {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").text(doItem.SecondaryBasis);
                            }
                            $("input[id='Rate']").closest("td").find("input").css("display", "none");

                            $("span[id='Amount']").text(doItem.ChargeAmount);
                            $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id='Remarks']").text(doItem.ChargeRemarks);
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(weight);
                            }
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                            }
                            else {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            }
                            $("input[id='Rate_" + rowId + "']").closest("td").find("input").css("display", "none");
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").focus();
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(weight);
                            }
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                        if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                            $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                            $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                        }
                    });
                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function ValidateCTMExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");

                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").text("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").text("");
                $("span[id^='Amount_" + rowId + "']").text("");
                $("span[id^='TotalTaxAmount" + rowId + "']").text("");
                $("span[id^='TotalAmount_" + rowId + "']").text("");
                $("span[id^='Remarks" + rowId + "']").text("");
                Flag = false;
            }
        }
    });
    return Flag;
}

function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    totalAmountDO = 0;
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > -1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? ($("#" + obj.id.replace("PValue", "SValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("PValue", "SValue")).val()) : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("SValue", "PValue")).val() != "" ? ($("#" + obj.id.replace("SValue", "PValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("SValue", "PValue")).val()) : 0;
    }

    if (tariffSNo == "" || tariffSNo == undefined) {
        alert("Please select Charges.");
    }
    else {
        totalHandlingCharges = 0;
        totalAmountDO = 0;
        var hawbSNo = 0;
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CTMGetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(($("#AWBNo").val() == '' ? 0 : $("#AWBNo").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(pValue) + "&SValue=" + parseInt(sValue) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + parseInt(2) + "&RateType=" + parseInt(0) + "&Remarks=" + 'AWB' + "&DOSNo=" + parseInt($("#FlightNo").val() == '' ? 0 : $("#FlightNo").val()) + "&PDSNo=" + parseInt($("#CTMSNo").val() == '' ? 0 : $("#CTMSNo").val()) + "&ProcessSNo=" + 6 + "&SubProcessSNo=" + 34,
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").text(doItem.SecondryBasis);
                        $("span[id='Amount']").text(doItem.ChargeAmount);
                        $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id='Remarks']").text(doItem.ChargeRemarks);
                    }
                    else {
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                        $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                        $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                    }
                }
                $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        });
    }
}

function CheckCreditLimit(obj) {
    if ($("#Text_BillType").val() != 'Airline') {
        var total = 0;
        var value = ($("#" + obj.id + ":checked").attr('data-radioval') == 'CREDIT' ? 1 : 0);
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            if ($(this).find("[id^='PaymentMode']:checked").attr('data-radioval') == 'CREDIT')
                total = parseFloat(total) + parseFloat($(this).find("span[id^='Amount']").text());
        });
        var BillToSNo = $("#BillToSNo").val();
        if (value == 1) {
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    FinalData = dataTableobj.Table0;
                    if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(this).find("[id^='PaymentMode']:checked").attr('data-radioval') == 'CREDIT') {
                                $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                            }
                            flags = 1;
                        });
                        if (FinalData[0].Column2 != '')
                            ShowMessage('warning', '', FinalData[0].Column2);
                    }
                    else {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(obj).closest('tr').index() == (i + 1)) {
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                                flags = 0;
                            }
                        });
                    }
                }
            });
        }
    }
}

function CheckCreditLimitMode(obj) {
    $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(0).attr("checked", 'checked');
    $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
}

function CheckCreditBillToSNo(a, b, c, d) {
    var total = 0;
    var BillToSNo = $("#BillToSNo").val();
    if ($("#BillType").val() != 1) {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        flags = 1;
                    });
                    ShowMessage('warning', '', FinalData[0].Column2);
                }
                else {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                        flags = 0;
                    });
                }
            }
        });
    }
    else {
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 2;
        });
    }
}

function SaveCTMCharges() {
    cfi.ValidateSection("divCTM");
    if (!cfi.IsValidSection($("#divCTM"))) {
        return false;
    }
    if ($("#Text_BillType").val() == "") {
        ShowMessage('warning', 'CTM Charges', 'Select Bill Type');
        return false;
    }
    if ($("#Text_BillToSNo").val() == "") {
        ShowMessage('warning', 'CTM Charges', 'Select Bill To');
        return false;
    }
    var CTMChargeArray = [];
    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var CTMChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: $('#AWBNo').val(),
                WaveOff: 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
                Rate: $(this).find("[id^='Amount']").text(),
                Min: 1,
                Mode: $(this).find('input:radio[id="PaymentMode"]:checked').attr("data-radioval"),
                ChargeTo: $('#BillType').val(),
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']")[1].innerText == undefined ? "" : $(this).find("[id^='Remarks']")[1].innerText.toUpperCase(),
                WaveoffRemarks: ''
            };
            CTMChargeArray.push(CTMChargeViewModel);
        }
    });

    var obj = {
        MomvementType: 2,
        Type: 'AWB',
        TypeValue: $('#AWBNo').val(),
        BillTo: $('#BillToSNo').val(),
        FlightNo: FlightSNo,
        CTMSNo: $('#CTMSNo').val(),
        Process: 6,
        SubProcessSNo: 34,
        LstCTMCharges: CTMChargeArray
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/CreateCTMCharges",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != '' || data != '1') {
                ShowMessage('success', 'Success - CTM Charges', 'CTM Charge Applied Successfully for Invoice ' + data);
                BindTruckManifest();
                $("#divCTM").data("kendoWindow").close();
            } else {
                ShowMessage('warning', 'Warning - CTM Charges', "Record Not Saved Please Try Again ", "bottom-right");
            }

        }
    });
}

//---############----CTM Charges---####-----------------

//function CheckDelayTime() {
//if ($("#ATD").val() != "" && $("#DateOfDeparture").attr("sqldatevalue") != "") {
//    var departureDateTime = $("#DateOfDeparture").attr("sqldatevalue") + ' ' + $("#ATD").val();
//    var truckDateTime = GetDate(CurrentTruckDate).replace(' ', '').replace(' ', '') + ' ' + CurrentETD;

//    if (new Date(departureDateTime) > new Date(truckDateTime).setMinutes(new Date(truckDateTime).getMinutes() + 10)) {
//        if ($("#DelayRemarks").val() == "") {
//            ShowMessage("warning", "Warning - Truck Departure", "Enter Delay Remarks.");
//            return;
//        }
//    }
//}
//}


function GetRFSCancelledRemarks(obj) {
    $.ajax({
        url: "Services/RFS/RFSService.svc/GetRFSCancelledRemarks", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RFSTruckDetailsSNo: $(obj).closest("tr").find("td[data-column='SNo']").text() == undefined ? 0 : $(obj).closest("tr").find("td[data-column='SNo']").text() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            ShowMessage('info', 'Need your kind attention - Cancelled Flight', resData[0].CancelledRemarks);
            $("#cfMessage-container").css("top", "100px");
        }
    });
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    var filterEmbargo1 = cfi.getFilter("OR");

    if (textId == "Text_TruckNo") {
        try {
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#TruckDate").attr("sqldatevalue"));
            //cfi.setFilter(filterEmbargo, "OriginAirportSNo", "eq", userContext.AirportSNo);
            cfi.setFilter(filterEmbargo, "IsNILManifested", "eq", 0);
            cfi.setFilter(filterEmbargo, "IsCancelled", "eq", 0);
            var TruckNoAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return TruckNoAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_AssignFlightNo") {
        try {
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#AssignFlightDate").attr("sqldatevalue"));
            cfi.setFilter(filterEmbargo, "OriginAirportCode", "eq", CurrentTruckOrigin);
            cfi.setFilter(filterEmbargo, "DestinationAirportCode", "eq", CurrentTruckDestination);
            var AssignFlightNoAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return AssignFlightNoAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_AssignFlightNo_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#AssignFlightDate_" + textId.split('_')[2]).val());
            cfi.setFilter(filterEmbargo, "OriginAirportCode", "eq", CurrentTruckOrigin);
            cfi.setFilter(filterEmbargo, "DestinationAirportCode", "eq", CurrentTruckDestination);
            var AssignFlightNoAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return AssignFlightNoAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_TruckRegistrationNo") {
        try {
            cfi.setFilter(filterEmbargo, "AirCraftSNo", "eq", $("#TruckType").val());
            var TruckRegNoAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return TruckRegNoAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_searchFlightNo") {
        try {
            //cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#searchFlightDate").attr("sqldatevalue"));
            cfi.setFilter(filterEmbargo, "FlightDate", "gte", $("#FromFlightDate").attr("sqldatevalue"));
            cfi.setFilter(filterEmbargo, "FlightDate", "lte", $("#ToFlightDate").attr("sqldatevalue"));
            cfi.setFilter(filterEmbargo, "OriginAirportSNo", "eq", userContext.AirportSNo);
            cfi.setFilter(filterEmbargo, "MovementType", "eq", 2);
            var SearchFlightNoAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return SearchFlightNoAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_ChargeAirline") {
        try {
            cfi.setFilter(filterEmbargo, "RFSTruckDetailsSNo", "eq", RFSTruckDetailsSNo);
            var ChargeAirlineAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return ChargeAirlineAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_ChargeAirline_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filterEmbargo, "RFSTruckDetailsSNo", "eq", RFSTruckDetailsSNo);
            var ChargeAirlineAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return ChargeAirlineAutoCompleteFilter;
        }
        catch (exp) { }
    }
}

//------------------------------------------------------------------------------//
// Div content for RFS
//------------------------------------------------------------------------------//
var tempDiv = '<div id="tempDiv"></div>';

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divRFSDetails' style='width:100%'></div></td></tr></table></div><div id='test1'></div><div id='dv_FlightManifestPrint'></div><div id='divChargesCalculatedManually'></div>";

var fotter = "<div id='divFooter'><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-info' style='width:125px;display:block;' id='btnNew'>New Booking</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td>&nbsp;</td>" +
                            "<td>&nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table></div>";