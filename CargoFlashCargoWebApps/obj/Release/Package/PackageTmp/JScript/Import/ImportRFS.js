
/// <reference path="../../Scripts/references.js" />

$(function () {
    LoadImportRFSDetails();
    $(document).on("change", "input[name='AirlineAgent']", function () {
        if ($("input[name=AirlineAgent]:checked").val() == 0) {
            var data = GetDataSource("Account", "vRFSAgent", "SNo", "Name", ["Name"], null);
            cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "Name", "contains");
        }
        else {
            var data = GetDataSource("Account", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
            cfi.ChangeAutoCompleteDataSource("Account", data, true, null, "AirlineName", "contains");
        }

        CheckBillToAgent();

    });
});

var RFSTruckDetailsSNo;
var IsTruckAgentOrVendor;
var MendatoryHandlingCharges = new Array();
var rowId;
var pValue = 0;
var sValue = 0;
var AvailableCreditLimit = 0;
function LoadImportRFSDetails() {
    _CURR_PRO_ = "ImportRFSSearch";
    $.ajax({
        url: "Services/Import/ImportRFSService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/ImportRFSSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#divContent").html(divContent);
            $('#searchFlightDate').data("kendoDatePicker").value("");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vwRFSFlightNo", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            $("#divFooter").html(fotter).show();
            $("#divAction").hide();

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            ImportRFSSearch();
            $("#btnSearch").bind("click", function () {
                ClearDiv();
                ImportRFSSearch();
            });

            var TableRFSTruckDetailsSNo;
            //$("#btnNew").bind("click", function () {
            //    var newBooking = "BindTruckDetails";
            //    RFSTruckDetailsSNo = '0';
            //    if (RFSTruckDetailsSNo == '0')
            //        $("#btnSave").css("display", "block");
            //    else
            //        $("#btnSave").css("display", "none");
            //    RFSTruckDetails(newBooking, 0);
            //});

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

            $(document).on("change", "input[name='chkBillToAgent']", function () {
                if (RFSTruckDetailsSNo != undefined || RFSTruckDetailsSNo != "") {
                    $.ajax({
                        url: "Services/Import/ImportRFSService.svc/GetAgentInformation", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var Data = jQuery.parseJSON(result);
                            var resData = Data.Table0;
                            if (resData.length > 0) {
                                var AccountSNo = resData[0].AccountSNo;
                                tempAccountSNo = resData[0].AccountSNo;
                                AvailableCreditLimit = AccountSNo.split('?')[1];
                                if (AccountSNo.split('?')[0] == '1') {
                                    $("#spnRFSChargesBill").find("input[id=chkBillToAgent]").removeAttr("checked");
                                    ShowMessage("warning", "Warning - Bill To Agent", "Agent details not found, Update truck details for bill to agent.")
                                }
                            }
                        }
                    });
                }
                //CheckBillToAgent(tempAccountSNo);
                CheckBillToAgent();
            });

            $(document).on("change", "input[name='DockCredit']", function () {
                if ($('input[name="DockCredit"]:checked').val() == 1 && TruckSource == 1) {
                    if (RFSTruckDetailsSNo != undefined || RFSTruckDetailsSNo != "") {
                        $.ajax({
                            url: "Services/RFS/RFSService.svc/GetVendorCreditLimitInformation", async: false, type: "POST", dataType: "json", cache: false,
                            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                var Data = jQuery.parseJSON(result);
                                var resData = Data.Table0;
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
            });

            //---------------------------------------//
            // Save RFS
            //---------------------------------------//
            $("#btnSave").unbind("click").bind("click", function () {
                // Save Truck Details
                SaveTruckDetails(RFSTruckDetailsSNo);
                if ($("#divareaTrans_import_importrfscharges").length > 0) {
                    SaveRFSChargesDetails(RFSTruckDetailsSNo, IsTruckAgentOrVendor);
                }
            });
            $("[id=ATA]").live("keypress", function (evt) {
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


function ImportRFSSearch() {
    //$("#tabstrip").html('');
    //$("div#tabstrip").hide();
    var SearchFlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val();
    var SearchFlightDate = "0";
    SearchFlightDate = $("#searchFlightDate").attr("sqldatevalue") == "" ? "0" : $("#searchFlightDate").attr("sqldatevalue");
    cfi.ShowIndexView("divImportRFSDetails", "Services/Import/ImportRFSService.svc/GetGridData/ImportRFS/Import/ImportRFS/" + SearchFlightNo + "/" + SearchFlightDate);
}

function ClearDiv() {
    //$("#tabstrip").html('');
    //$("#ulTab").html('');
    $("#truckDetails").html('');
    //$("#departureDetails").html('');
    $("#chargesDetails").html('');
    $("#assignFlightDetails").html('');
    //$("#btnNew").css("display", "block");
    $("#btnSave").css("display", "block");
    //$("#divPrintManifest").html("");
    //$("#btnRFSPrint").hide();
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
    if ($("#ATA").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter ATA.");
        return false;
    }
    if ($('#TruckSource:checked').val() == "1" && ($("#Text_Vendor").val() == "" || $("#Text_Vendor").val() == undefined)) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Select Vendor.");
        return false;
    }
    if ($('#TruckSource:checked').val() == "1" && $("#Text_Vendor").val() != "" && ($("#Text_Vendor").val().substring(0, 3) == "SAS") && ($("#HiringCharges").val() == "" || $("#HiringCharges").val() == "0")) {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Hiring Charges.");
        return false;
    }
    if ($("#TruckType").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck Type.");
        return false;
    }
    if ($("#TruckRegistrationNo").val() == "") {
        ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck Registration No.");
        return false;
    }
    //if ($("#TruckCapacity").val() == "") {
    //    ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Truck Capacity.");
    //    return false;
    //}
    //if ($("#DriverName").val() == "") {
    //    ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Driver Name.");
    //    return false;
    //}
    //if ($("#DriverID").val() == "") {
    //    ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Driver ID.");
    //    return false;
    //}
    //if ($("#MobileNo").val() == "") {
    //    ShowMessage('warning', 'Warning - RFS Truck Details', "Enter Mobile No.");
    //    return false;
    //}
    return true;
}

// Save Truck Details
function SaveTruckDetails(RFSTruckDetailsSNo) {

    if ($("#__tblimportrfstruckinformation__").length != 0) {

        if (cfi.IsValidSection('__divimportrfstruckinformation__')) {

            //Validation
            if (!ValidationSaveTruckDetails()) return;

            if ((/\d/.test($("#TruckRegistrationNo").val()) == false) && $("#TruckRegistrationNo").val() != "") {
                ShowMessage("warning", "Warning", "Kindly provide minimum one Numeric character for Truck Plate No.");
                return;
            }

            var TruckDetails = [];
            var truckDetailsData = {
                DailyFlightSNo: $("#TruckNo").val(),
                TruckNo: $("#Text_TruckNo").val(),
                TruckDate: $("#TruckDate").attr("sqldatevalue"),
                OriginAirportSNo: $("#OriginAirport").val(),
                DestinationAirportSNo: $("#DestinationAirport").val(),
                ATA: $("#ATA").val(),
                TruckSource: $('#TruckSource:checked').val(),
                AccountSNo: $("#Vendor").val(),
                AgendOrVendorName: $("#Text_Vendor").val(),
                HiringCharges: $("#HiringCharges").val() == "" ? 0 : $("#HiringCharges").val(),
                AircraftSNo: $("#TruckType").val(),
                TruckRegistrationNo: $("#TruckRegistrationNo").val(),
                TruckCapacity: $("#TruckCapacity").val() == "" ? 0 : $("#TruckCapacity").val(),
                DriverName: $("#DriverName").val(),
                DriverID: $("#DriverID").val(),
                MobileNo: $("#MobileNo").val(),
                IPTANo: $("#IPTANo").val(),
                CSLNo: $("#CSLNo").val(),
                Remarks: $("#Remarks").val(),
                ScheduleTrip: $('#ScheduleTrip:checked').val() == "0" ? 1 : 0,
                Location: $("#Text_Location").data("kendoAutoComplete").key(),
                ManifestedGrWt: $("span#ManifestedGrWt").text() == "" ? 0 : $("span#ManifestedGrWt").text(),
                ActualManifestedGrWt: $("#ActualManifestedGrWt").val() == "" ? 0 : $("#ActualManifestedGrWt").val(),
            }

            //---------
            TruckDetails.push(truckDetailsData);

            $.ajax({
                url: "Services/Import/ImportRFSService.svc/SaveImportTruckDetails", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TruckDetails: TruckDetails, AirportCode: userContext.AirportCode, RFSTruckDetailsSNo: (RFSTruckDetailsSNo == "" || RFSTruckDetailsSNo == undefined) ? '0' : RFSTruckDetailsSNo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ImportRFSSearch();
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

function checkProgrss(item, subprocess, displaycaption) {
    //if (item != "0") {
    //    var ProgressStatus = item.split('_');
    //    if ((displaycaption == "T") && (ProgressStatus[0] == 1)) {
    //        return "\"completeprocess\"";
    //    }
    //    if ((displaycaption == "T") && (ProgressStatus[0] == 2)) {
    //        return "\"partialprocess\"";
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
    //}
    //if ((displaycaption == "T") && (ProgressStatus[0] == 0)) {
    //    return "\"incompleteprocess\"";
    //}
    //if ((displaycaption == "F") && (ProgressStatus[1] == 0)) {
    //    return "\"incompleteprocess\"";
    //}
    //if ((displaycaption == "M") && (ProgressStatus[2] == 0)) {
    //    return "\"incompleteprocess\"";
    //}
    //if ((displaycaption == "C") && (ProgressStatus[3] == 0)) {
    //    return "\"incompleteprocess\"";
    //}

    if ((item).toUpperCase().indexOf(subprocess.toUpperCase() + "_1_C") >= 0) {
        return "\"completeprocess\"";
    }
    if ((item).toUpperCase().indexOf(subprocess.toUpperCase() + "_0_I") >= 0) {
        return "\"incompleteprocess\"";
    }
    if ((item).toUpperCase().indexOf(subprocess.toUpperCase() + "_2_P") >= 0) {
        return "\"partialprocess\"";
    }

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

//function CheckBillToAgent(tempAccountSNo) {
//    if ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true && tempAccountSNo.split('?')[0] == '3') {
//        $("#chkCash").prop('disabled', true);
//        $("#chkCredit").prop('disabled', true);
//        $("#chkCash").css("cursor", "not-allowed");
//        $("#chkCredit").css("cursor", "not-allowed");
//        $("#chkCash").attr("checked", "true");
//    }
//    else if ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true && tempAccountSNo.split('?')[0] == '0') {
//        $("#chkCash").prop('disabled', false);
//        $("#chkCredit").prop('disabled', false);
//        $("#chkCash").css("cursor", "auto");
//        $("#chkCredit").css("cursor", "auto");
//        $("#chkCredit").attr("checked", "true");
//    }
//    else if ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true && tempAccountSNo.split('?')[0] == '2') {
//        $("#chkCash").prop('disabled', true);
//        $("#chkCredit").prop('disabled', true);
//        $("#chkCash").css("cursor", "not-allowed");
//        $("#chkCredit").css("cursor", "not-allowed");
//        $("#chkCredit").attr("checked", "true");
//    }
//    else {
//        $("#chkCash").prop('disabled', true);
//        $("#chkCredit").prop('disabled', true);
//        $("#chkCash").css("cursor", "not-allowed");
//        $("#chkCredit").css("cursor", "not-allowed");
//        $("#chkCredit").attr("checked", "true");
//    }
//}

var RFSTruckDetailsSNo;
var DailyFlightSNo;
var CurrentTruckOrigin;
var CurrentTruckDestination;
var CurrentETD;
var CurrentTruckDate;
var IsTruck;
var IsAssignFlight;
var IsCharges;
var TruckSource;
var CurrentAccountSNo;
var AgendOrVendorName;
var ChargesCalculatedManually;

function BindEvents(obj, e, isdblclick) {
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    RFSTruckDetailsSNo = closestTr.find("td[data-column='SNo']").text();
    DailyFlightSNo = closestTr.find("td[data-column='DailyFlightSNo']").text();
    CurrentTruckOrigin = closestTr.find("td[data-column='Origin']").text();
    CurrentTruckDestination = closestTr.find("td[data-column='Destination']").text();
    CurrentTruckDate = closestTr.find("td[data-column='TruckDate']").text();
    CurrentETD = closestTr.find("td[data-column='ETD']").text();
    IsTruck = closestTr.find("td[data-column='IsTruck']").text();
    IsAssignFlight = closestTr.find("td[data-column='IsAssignFlight']").text();
    IsCharges = closestTr.find("td[data-column='IsCharges']").text();
    TruckSource = closestTr.find("td[data-column='TruckSource']").text();
    CurrentAccountSNo = closestTr.find("td[data-column='AccountSNo']").text();
    AgendOrVendorName = closestTr.find("td[data-column='AgendOrVendorName']").text();
    ChargesCalculatedManually = closestTr.find("td[data-column='ChargesCalculatedManually']").text();
    ShowProcessDetails(obj, RFSTruckDetailsSNo, DailyFlightSNo, subprocess, isdblclick, subprocesssno);
}

function ShowProcessDetails(obj, RFSTruckDetailsSNo, DailyFlightSNo, subprocess, isdblclick, subprocesssno) {
    //$("#btnNew").css("display", "none");
    $("#tabstrip").html('');
    //$("#ulTab").html('');
    //$("#divPrint").remove();
    //$("#divPrintManifest").html("");
    if ($("#tabstrip").length === 0)
        $("#divImportRFSDetails").after("<div id='tabstrip'></div><div id='truckDetails'></div><div id='departureDetails'></div><div id='assignFlightDetails'></div><div id='chargesDetails'></div>");

    //-------------------//
    // Truck Details
    //-------------------//
    if (subprocess.toUpperCase() == "IMPORTRFSTRUCK") {
        RFSTruckDetails(obj, RFSTruckDetailsSNo);
        //$("#btnNew").css("display", "block");
        if (IsCharges == "0") {
            $("#btnSave").css("display", "block");
        }
        else {
            $("#btnSave").css("display", "none");
        }
        $("#btnCancel").css("display", "block");
    }

    //-------------------//
    // Assign Flight
    //-------------------//
    if (subprocess.toUpperCase() == "IMPORTRFSASSIGNFLIGHT") {
        $("#truckDetails").html('');
        $("#departureDetails").html('');
        $("#chargesDetails").html('');
        $("#divPrintManifest").html("");

        //CheckManifestFlightForTruck(RFSTruckDetailsSNo);
        TableRFSTruckDetailsSNo = (RFSTruckDetailsSNo == "") ? '0' : RFSTruckDetailsSNo;
        $.ajax({
            url: "Services/Import/ImportRFSService.svc/GetWebForm/ImportRFS/Import/ImportRFSAssignFlightInformation/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#assignFlightDetails").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
                InitializePage("ImportRFSAssignFlightInformation", 'divContent');
            }
        });
    }

    if (subprocess.toUpperCase() == "IMPORTRFSCHARGE") {
        $("#truckDetails").html('');
        $("#assignFlightDetails").html('');
        $("#departureDetails").html('');
        $("#divPrintManifest").html("");
        $("#btnSave").css("display", "block");
        $("#btnCancel").css("display", "block");

        TableRFSTruckDetailsSNo = RFSTruckDetailsSNo;
        $("#chargesDetails").html('');
        IsTruckAgentOrVendor = $(obj).closest("tr").find("td[data-column='IsTruckAgentOrVendor']").text();

        if (IsCharges == "1" && ChargesCalculatedManually == "1") {
            ShowMessage('success', 'Success - RFS Charges', "Charges finalized Manually.");
            return;
        }

        BindRFSChargesInformation(RFSTruckDetailsSNo, IsTruckAgentOrVendor);

        if ($("#tblResult").length > 0)
            return;

        if (IsAssignFlight == "0") {
            ShowMessage("warning", "Warning - RFS Charges", "Flight not assigned.");
            return;
        }

        if ((IsTruck == "2" || IsTruck == "0") && IsAssignFlight == "1") {
            ShowMessage("warning", "Warning - RFS Charges", "Update truck details.");
            return;
        }

        $.ajax({
            url: "Services/Import/ImportRFSService.svc/GetWebForm/ImportRFS/Import/ImportRFSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#chargesDetails").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");

                var ShipmentDetailArray = [];
                var ShipmentDetailViewModel = {
                    PartNumber: 0, AWBSNo: 0, HAWBSNo: 0, PartSNo: 0, Pieces: 0, GrossWeight: 0, VolumeWeight: 0, IsBUP: 0, SPHCSNo: 0, SPHCTransSNo: 0
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);

                $.ajax({
                    url: "Services/Import/ImportRFSService.svc/GetRFSMendatoryCharges", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ AWBSNo: RFSTruckDetailsSNo, CityCode: userContext.CityCode, HAWBSNo: 0, ProcessSNo: parseInt(1025), SubProcessSNo: parseInt(2378), GrWT: parseFloat(0), ChWt: parseFloat(0), Pieces: parseInt(0), lstShipmentInfo: ShipmentDetailArray }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;

                        /****************Handling Charge Information*************************************/
                        MendatoryHandlingCharges = [];
                        if (resData != []) {
                            $(resData).each(function (row, i) {
                                if (i.isMandatory == 1) {
                                    MendatoryHandlingCharges.push({ "chargeairline": i.PartSNo, "text_chargeairline": i.PartName, "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis == undefined ? '' : i.PrimaryBasis, "pvalue": i.pValue == undefined ? 0 : i.pValue, "sbasis": i.SecondaryBasis == undefined ? '' : i.SecondaryBasis, "svalue": i.sValue == undefined ? 0 : i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "rate": i.Rate, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, "") });
                                }
                            });
                        }

                        cfi.makeTrans("import_importrfscharges", null, null, BindChargesItemAutoComplete, ReBindChargesItemAutoComplete, null, MendatoryHandlingCharges);
                        if (MendatoryHandlingCharges.length > 0) {
                            $("div[id$='areaTrans_import_importrfscharges']").find("[id^='areaTrans_import_importrfscharges']").each(function (i, row) {
                                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                                $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                            });
                        }

                        $("div[id$='divareaTrans_import_importrfscharges']").find("[id='areaTrans_import_importrfscharges']").each(function () {
                            $(this).find("input[id^='ChargeAirline']").each(function () {
                                cfi.AutoComplete($(this).closest("tr").find("input[id^='ChargeAirline']").attr("name"), "AirlineCode,AirlineName", "vGetImportRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
                            });

                            $(this).find("input[id^='ChargeName']").each(function () {
                                cfi.AutoComplete("ChargeAirline", "AirlineCode,AirlineName", "vGetImportRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
                                cfi.AutoCompleteForFBLHandlingCharge($(this).closest("tr").find("input[id^='ChargeName']").attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", RFSTruckDetailsSNo, 0, userContext.CityCode, 1, "", "2", "999999999", "No");
                            });

                            $("div[id$='areaTrans_import_importrfscharges']").find("[id^='areaTrans_import_importrfscharges']").each(function (i, row) {
                                $(this).find("input[id^='Text_ChargeAirline']").data("kendoAutoComplete").enable(false);
                                $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
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
                    //$("#divareaTrans_import_importrfscharges tr th:contains('RFS Handling Charges Information')").append('<span id="spnRFSChargesBill" style="float:right;color:#9d331d; font-size:12px; margin-right:40px;"><input type="checkbox" name="chkBillToAgent" id="chkBillToAgent" /><span id="spnBillTo">Bill To Agent </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Payment Mode : <input type="radio" id="chkCash" name="cashCredit" value="0"  /><span id="spnChkCash"> Cash</span><input type="radio" id="chkCredit" name="cashCredit" value="1" checked="true"/><span id="spnChkCredit"> Credit<span><span>');

                    $("#divareaTrans_import_importrfscharges tr th:contains('RFS Handling Charges Information')").append('<span id="spnRFSChargesBill" style="float:right;color:#9d331d; font-size:12px; margin-right:40px; margin-bottom:5px;"><input type="checkbox" name="chkChargesfinalized" id="chkChargesfinalized" />Charges finalized Manually&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="spnBillTo" class="transSection">Bill To:</span><input type="radio" id="chkAgent" name="AirlineAgent" value="0" checked="true"/><span id="spnChkAgent" style="color:#000;"> Agent<span><input type="radio" id="chkAirline" name="AirlineAgent" value="1"  /><span id="spnChkAirline" style="color:#000;"> Airline</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="spnAccount" style="color:#9d331d;">Name: </span> <input type="hidden" name="Account" id="Account" recname="Account" value="" class="transSection"><span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-disabled" unselectable="on" style="width: 60px; text-transform: uppercase;"><input type="text" class="transSection k-input" name="Text_Account" id="Text_Account" recname="Text_Account" data-valid="required" data-valid-msg="Select Account" tabindex="0" controltype="autocomplete" value="" placeholder="" data-role="autocomplete" autocomplete="off"  style="width: 100%; text-transform: uppercase;"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#9d331d;"> Payment Mode :</span> <input type="radio" id="chkCash" name="cashCredit" value="0"  /><span id="spnChkCash"> Cash</span><input type="radio" id="chkCredit" name="cashCredit" value="1" checked="true"/><span id="spnChkCredit"> Credit<span><span>');

                $("#divareaTrans_import_importrfscharges").find("table>tbody").find("tr:eq(2)").find("td:last").hide();
                cfi.AutoComplete("Account", "Name", "vRFSAgent", "SNo", "Name", ["Name"], null, "contains");

                //$("#spnBillTo").css("color", "black");
                //$("#spnChkCash").css("color", "black");
                //$("#spnChkCredit").css("color", "black");

                //if (RFSTruckDetailsSNo != "" || RFSTruckDetailsSNo != "0") {
                //    GetBillingInformation(RFSTruckDetailsSNo);
                //}

                //if ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == false) {
                //    $("#chkCash").prop('disabled', true);
                //    $("#chkCredit").prop('disabled', true);
                //    $("#chkCash").css("cursor", "not-allowed");
                //    $("#chkCredit").css("cursor", "not-allowed");
                //    $("#chkCredit").attr("checked", "true");
                //}

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

                //CheckBillToAgent(tempAccountSNo);
                var boolRFSDockingCharges = true;
                $("div[id$='divareaTrans_import_importrfscharges']").find("[id^='areaTrans_import_importrfscharges']").each(function () {
                    if ($(this).find("[id^='Text_ChargeName']").val() == "DOCKING CHARGES-SCHEDULED TRIP [PER TRIP ]" || $(this).find("[id^='Text_ChargeName']").val() == "DOCKING CHARGES-NON SCHEDULED TRIP [PER TRIP ]") {
                        boolRFSDockingCharges = false;
                    }
                });

                if (IsTruckAgentOrVendor.toUpperCase() == "AIRLINE-VENDOR" && TruckSource == "1") {
                    if (boolRFSDockingCharges == true) {
                        $.ajax({
                            url: "Services/RFS/RFSService.svc/GetRFSBulkDockingChargesFlag", async: false, type: "POST", dataType: "json", cache: false,
                            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                if (result == "0") {
                                    $("#divareaTrans_import_importrfscharges").after("<div id='rfsDockingCharges' style='margin-top:20px;'></div>");
                                    cfi.ShowIndexView("rfsDockingCharges", "Services/RFS/RFSService.svc/GetRFSDockingChargeData/RFSCHARGE/RFS/RFSDOCKING/" + TableRFSTruckDetailsSNo);
                                }
                            }
                        });
                    }
                    return;
                }
                $("#divareaTrans_import_importrfscharges").after("<div id='rfsAmountCharges' style='margin-top:20px;'></div><div id='rfscustomCharges' style='margin-top:20px;'></div><br/>");

                cfi.ShowIndexView("rfsAmountCharges", "Services/Import/ImportRFSService.svc/GetRFSChargesData/IMPORTRFSCHARGE/Import/ImportRFS/" + TableRFSTruckDetailsSNo);
                cfi.ShowIndexView("rfscustomCharges", "Services/Import/ImportRFSService.svc/GetRFSCustomChargesData/RFSCUSTOMCHARGE/Import/ImportRFS/" + TableRFSTruckDetailsSNo);
            }
        });
    }
}

function BindChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeAirline']").each(function () {
        cfi.AutoComplete($(this).closest("tr").find("input[id^='ChargeAirline']").attr("name"), "AirlineCode,AirlineName", "vGetImportRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
    });
    $(elem).find("input[id^='ChargeName']").each(function () {
        cfi.AutoCompleteForFBLHandlingCharge($(this).closest("tr").find("input[id^='ChargeName']").attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", RFSTruckDetailsSNo, 0, userContext.CityCode, 1, "", "2", "999999999", "No");
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
        cfi.AutoComplete($(this).closest("tr").find("input[id^='ChargeAirline']").attr("name"), "AirlineCode,AirlineName", "vGetImportRFSChargeAirline", "SNo", "AirlineName", null, null, "contains");
    });

    $(elem).find("input[id^='ChargeName']").each(function () {
        cfi.AutoCompleteForFBLHandlingCharge($(this).closest("tr").find("input[id^='ChargeName']").attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", RFSTruckDetailsSNo, 0, userContext.CityCode, 1, "", "2", "999999999", "No");
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

function GetBillingInformation(RFSTruckDetailsSNo) {
    $.ajax({
        url: "Services/Import/ImportRFSService.svc/GetBillingInformation", async: false, type: "POST", dataType: "json", cache: false,
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

function RFSTruckDetails(obj, RFSTruckDetailsSNo) {
    $("#tabstrip").html('');
    $("#ulTab").html('')
    if ($("#tabstrip").length === 0)
        $("#divImportRFSDetails").after("<div id='tabstrip' data-role='tabstrip' class='k-widget k-header k-tabstrip'></div><div id='truckDetails'></div><div id='departureDetails'></div><div id='assignFlightDetails'></div><div id='chargesDetails'></div>")

    $("#departureDetails").html('');
    $("#assignFlightDetails").html('');
    $("#chargesDetails").html('');

    $.ajax({
        url: "Services/Import/ImportRFSService.svc/GetWebForm/ImportRFS/Import/ImportRFSTruckInformation/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

            cfi.AutoComplete("TruckNo", "FlightNo", "vRFSTruckNo", "SNo", "FlightNo", ["FlightNo"], OnSelectTruckNo, "contains");
            cfi.AutoComplete("OriginAirport", "AirportCode", "vRFSOriginAndDestinationAirport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("DestinationAirport", "AirportCode", "vRFSOriginAndDestinationAirport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("Vendor", "Name", "vImportRFSTruckVendorAndAgent", "SNo", "Name", ["Name"], OnselectVendor, "contains");
            cfi.AutoComplete("TruckType", "TruckType", "vRFSTruckType", "SNo", "TruckType", ["TruckType"], OnSelectTruckType, "contains");
            cfi.AutoComplete("TruckRegistrationNo", "RegistrationNo", "vwRFSTruckRegistrationNo", "SNo", "RegistrationNo", ["RegistrationNo"], null, "contains");
            cfi.AutoComplete("Location", "Location,Description", "TruckLocation", "SNo", "Location", ["Location", "Description"], null, "contains");
            if (obj != "BindTruckDetails") {
                $.ajax({
                    url: "Services/Import/ImportRFSService.svc/BindRFSTruckInformation", async: false, type: "POST", dataType: "json", cache: false,
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
                            $("#ATA").val(resItem.ATA);
                            $("#IPTANo").val(resItem.IPTANo);
                            $("#CSLNo").val(resItem.CSLNo);
                            $("#Remarks").val(resItem.Remarks);
                            $("#Text_Location").data("kendoAutoComplete").setDefaultValue(resItem.Location, resItem.LocationDetail);
                            if (resItem.TruckSource == "1") {
                                $('input[name=TruckSource][data-radioval=Vendor]').attr('checked', true);
                            }
                            else {
                                $('input[name=TruckSource][data-radioval=SAS]').attr('checked', true);
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
                            $("#TruckRegistrationNo").val(resItem.TruckRegistrationNo);
                            $("#TruckCapacity").val(resItem.TruckCapacity);
                            $("#_tempTruckCapacity").val(resItem.TruckCapacity);
                            $("#DriverName").val(resItem.DriverName);
                            $("#DriverID").val(resItem.DriverID);
                            $("#MobileNo").val(resItem.DriverMobile);
                            $("#_tempMobileNo").val(resItem.DriverMobile);
                            $("span#ManifestedGrWt").text(resItem.ManifestedGrWt);
                            $("#_tempActualManifestedGrWt").val(resItem.ActualManifestedGrWt);
                            $("#ActualManifestedGrWt").val(resItem.ActualManifestedGrWt);
                        }
                    }
                });
            }

            OnselectVendor();
            $('#truckDetails').append("<div id='divHeightTruck' style='height:100px'></div>");
            $("#Text_OriginAirport").data("kendoAutoComplete").enable(false);
            $("#Text_DestinationAirport").data("kendoAutoComplete").enable(false);
        }
    });
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
                url: "Services/Import/ImportRFSService.svc/GetChargeValue", async: false, type: "POST", dataType: "json", cache: false,
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

                    $("div[id$='areaTrans_import_importrfscharges']").find("[id^='areaTrans_import_importrfscharges']").each(function (i, row) {
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
    $("div[id$='areaTrans_import_importrfscharges']").find("[id^='areaTrans_import_importrfscharges']").each(function (row, tr) {
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

function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    totalAmountDO = 0;
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
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
            url: "Services/Import/ImportRFSService.svc/GetChargeValue", async: false, type: "POST", dataType: "json", cache: false,
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
                $("div[id$='areaTrans_import_importrfscharges']").find("[id^='areaTrans_import_importrfscharges']").each(function (i, row) {
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        });
    }
}

function OnSelectTruckNo() {
    var TruckDailyFlightSNo = $("#TruckNo").val();
    if (TruckDailyFlightSNo != undefined || TruckDailyFlightSNo != "") {
        $.ajax({
            url: "Services/Import/ImportRFSService.svc/GetTruckDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DailyFlightSNo: TruckDailyFlightSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    var resItem = resData[0];
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

function OnSelectTruckType() {
    //$("#Text_TruckRegistrationNo").val("");
    //$("#TruckRegistrationNo").val("");
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

function OnselectVendor() {
    if ($('#TruckSource:checked').val() == "1") {
        if ($("#Text_Vendor").val() != "" && ($("#Text_Vendor").val().substring(0, 3) == "SAS")) {
            $("#_tempHiringCharges").show();
            $("#HiringCharges").closest("td").prev().find("span").show();
        }
        else {
            $("#_tempHiringCharges").hide();
            $("#HiringCharges").hide();
            $("#HiringCharges").closest("td").prev().find("span").hide();
        }
    }
}

function TruckSourceChange() {
    $("#Text_Vendor").val("");
    $("#Vendor").val("");
    if ($('#TruckSource:checked').val() == "0") {
        $('input[name="TruckSource"]:radio').closest("td").next().html("&nbsp;&nbsp;&nbsp;Forwarder (Agent)");
        $("#_tempHiringCharges").hide();
        $("#HiringCharges").closest("td").prev().find("span").hide();
    }
    else {
        $('input[name="TruckSource"]:radio').closest("td").next().html("&nbsp;&nbsp;&nbsp;Vendor");
        if ($("#Text_Vendor").val() != "" && ($("#Text_Vendor").val().substring(0, 3) == "SAS")) {
            $("#_tempHiringCharges").show();
            $("#HiringCharges").closest("td").prev().find("span").show();
        }
    }
}

function BindRFSChargesInformation(RFSTruckDetailsSNo, IsTruckAgentOrVendor) {
    $.ajax({
        url: "Services/Import/ImportRFSService.svc/BindRFSChargesInformation", async: false, type: "POST", dataType: "json", cache: false,
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
                //$("#chargesDetails").html('<div class="formSection" style="margin-top:10px;">RFS Charge Information<span style="float:right;color:#9d331d; font-size:12px; margin-right:40px;">Bill To Agent : <span id="spnBillToAgent"></span></div><table id="tblResult" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE NO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE DATE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AIRLINE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PAYMENT MODE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PRINT</td></tr></table>');

                $("#chargesDetails").html('<div class="formSection" style="margin-top:10px;">RFS Charge Information<span style="float:right;color:#9d331d; font-size:12px; margin-right:40px;">Bill To Agent : <span id="spnBillToAgent"></span></div><table id="tblResult" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE NO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE DATE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">ACCOUNT TYPE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">NAME</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PAYMENT MODE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PRINT</td></tr></table>');

                for (var i = 0; i < resData.length; i++) {
                    //$('#tblResult').append('<tr><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><span class="actionView" style="cursor:pointer;color:Blue;" onclick="GetRFSHandlingDetails(' + RFSTruckDetailsSNo + ',' + resData[i].SNo + ',' + resData[i].InvoiceType + ');">' + resData[i].InvoiceNo + '</span></td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].InvoiceDate + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].Airline + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resData[i].Amount + " IDR" + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].PaymentMode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><a onclick="PrintRFSHandlingDetails(' + resData[i].SNo + ',' + resData[i].InvoiceType + ');" style="cursor:pointer;" ><i class="fa fa-print fa-2x"></i></a></td></tr>');
                    $('#tblResult').append('<tr><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><span class="actionView" style="cursor:pointer;color:Blue;" onclick="GetRFSHandlingDetails(' + RFSTruckDetailsSNo + ',' + resData[i].SNo + ',' + resData[i].InvoiceType + ');">' + resData[i].InvoiceNo + '</span></td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].InvoiceDate + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].AccountType + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].Airline + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resData[i].Amount + ' ' + userContext.CurrencyCode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].PaymentMode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><a onclick="PrintRFSHandlingDetails(' + resData[i].SNo + ',' + resData[i].InvoiceType + ');" style="cursor:pointer;" ><i class="fa fa-print fa-2x"></i></a></td></tr>');
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

                $("#tblResult").after('<hr/><center><div id="rfsAmountCharges" style="width:90%;border-radius:25px;padding:10px; border: 2px solid #96876e; height:100px;margin:2px;"></div><br/><div id="rfscustomCharges" style="width: 90%; border-radius:25px;padding:10px; border: 2px solid #96876e; height:100%;  margin:2px;"></div><center>');

                if (resData1.length > 0) {
                    $("#rfsAmountCharges").html('<div class="formSection" style="margin:5px;">RFS Freight Charges</div><table id="tblrfsAmountCharges" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; border-bottom:1px solid #5a7570;border-left:1px solid #5a7570;border-right:1px solid #5a7570;border-top:1px solid #5a7570;background:#96876e;color:#fff;">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">AIRLINE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">NO OF UNITS</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;">CHARGEABLE UNIT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right:1px solid #5a7570;" align="right">REMARKS</td></tr></table>');

                    for (var i = 0; i < resData1.length; i++) {
                        $('#tblrfsAmountCharges').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;border-left: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + parseInt(i + 1) + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData1[i].AirlineName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData1[i].NoOfUnits + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData1[i].ChargeableUnit + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData1[i].Amount + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData1[i].FreightRemarks + '</td></tr>');
                    }
                }

                if (resData2.length > 0) {
                    $("#rfscustomCharges").html('<div class="formSection" style="margin:5px;">RFS Custom Charges</div><table id="tblrfscustomCharges" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-left:1px solid #5a7570; border-right: 1px solid black; border-bottom: 1px solid black;">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right: 1px solid black;">AIRLINE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right: 1px solid black;">CHARGE NAME</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; background:#96876e;color:#fff;border-bottom:1px solid #5a7570;border-right: 1px solid black;" align="right">AMOUNT</td></tr></table>');


                    for (var i = 0; i < resData2.length; i++) {
                        $('#tblrfscustomCharges').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:12px; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px; border-left: 1px solid black;padding: 2px;">' + parseInt(i + 1) + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData2[i].AirlineName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;">' + resData2[i].ChargeName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px; border-right: 1px solid black;padding: 2px;border-bottom: 1px solid black;padding: 2px;" align="right">' + resData2[i].Amount + '</td></tr>');
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
            url: "Services/Import/ImportRFSService.svc/GetRFSHandlingDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo, SNo: SNo, Type: Type }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resHandlingData = Data.Table0;
                if (resHandlingData.length > 0) {
                    $("#divRFSHandlingCharges").html('<table id="tblRFSHandlingCharges" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">CHARGE NAME</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">P BASIS</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">S BASIS</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">TAX</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570" align="right">TOTAL AMOUNT</td></tr></table>');

                    for (var i = 0; i < resHandlingData.length; i++) {
                        $('#tblRFSHandlingCharges').append('<tr><td style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resHandlingData[i].TariffHeadName + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].pValue + ' ' + resHandlingData[i].pBasis + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].sValue + ' ' + resHandlingData[i].sBasis + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].ChargeAmount + '</td><td style="padding:5px;font-family:sans-serif;font-size:12px;">' + resHandlingData[i].TotalTaxAmount + '</td><td align="right" style="padding:5px;font-family:sans-serif;font-size:12px;font-weight:bold;color:blue;margin-left:20px;">' + resHandlingData[i].TotalAmount + " " + userContext.CurrencyCode + '</td></tr>');
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
        window.open("HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + SNo + "&InvoiceType=" + 1 + "&UserSNo=" + userContext.UserSNo);
    else
        window.open("HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + SNo + "&UserSNo=" + userContext.UserSNo + "&RFS=" + 1);
}

var TotalDockingCharges = 0;
function SaveRFSChargesDetails(RFSTruckDetailsSNo, IsTruckAgentOrVendor) {
    var boolAmtFlg = true;
    var boolNoOfUnitChargeFlg = true;
    var boolChargeFlg = true;
    var boolChRemarksFlg = true;
    var boolAmtRemarksFlg = true;

    var chkChargesfinalized = ($("#spnRFSChargesBill").find("input[id=chkChargesfinalized]").is(":checked") == true) ? "1" : "0";

    if (chkChargesfinalized == "1") {
        $.ajax({
            url: "Services/RFS/RFSService.svc/SaveRFSChargeFinalized", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo, Chargesfinalized: chkChargesfinalized }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success', "Charges finalized Manually.");
                    ClearDiv();
                    ImportRFSSearch();
                }
            },
            error: function () {
                ShowMessage('warning', 'Warning', "Unable to save data.");
            }
        });

        return;
    }

    $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='Airline']").each(function () {
        if (parseInt($(this).closest("tr").find("#txtNoOfUnits").val()) == 0 || $(this).closest("tr").find("#txtNoOfUnits").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Enter No Of Unit.");
            $(this).closest("tr").find("#txtNoOfUnits").val("");
            $(this).closest("tr").find("#txtNoOfUnits").focus();
            boolNoOfUnitChargeFlg = false;
        }
        return boolNoOfUnitChargeFlg;
    });

    if (boolNoOfUnitChargeFlg == false) {
        return;
    }

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
        if (TruckSource == "1" && $("#Account").val() == "") {
            ShowMessage("warning", "Warning - RFS Charges", "Select Agent.");
            return;
        }
    }

    if ($("#rfsDockingCharges").length > 0 && TruckSource == "1" && $("input[name=DockCredit]:checked").val() == "1") {
        $("#rfsDockingCharges").find(".k-grid-content").find("table tbody > tr").find("td[data-column='TotalAmount']").each(function () {
            TotalDockingCharges += parseFloat($(this).text());
        });
        if (!fn_RFSCheckCreditLimit(CurrentAccountSNo, TotalDockingCharges)) return;
    }

    var flag = false;
    var HandlingChargeArray = [];
    $("div[id$='divareaTrans_import_importrfscharges']").find("[id^='areaTrans_import_importrfscharges']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: 0,
                WaveOff: 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("span[id^='TotalAmount']").text()),
                TotalTaxAmount: $(this).find("span[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("span[id^='Amount']").text(),
                Rate: $(this).find("input[id^='Rate']").val(),
                Min: 1,
                Mode: $('input[name="cashCredit"]:checked').val() == 0 ? 'CASH' : 'CREDIT',
                ChargeTo: ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true) ? "0" : "1",
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
            ChargeTo: ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true) ? "0" : "1",
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
                Amount: 0,
                FreightRemarks: ''
            }
            var RFSCustomChargesData = {
                RFSTruckDetailsSNo: RFSTruckDetailsSNo,
                AirlineSNo: 0,
                RateAirlineCustomChargesSNo: 0,
                Amount: '0'
            }

            RFSChargesDetails.push(RFSChargesData);
            RFSCustomChargesDetails.push(RFSCustomChargesData);

        }
        else {
            $("#chargesDetails").find(".k-grid-content").find("table tbody > tr").find("td[data-column='Airline']").each(function () {
                var ChargesAirlineSNo = $(this).closest("tr").find("td[data-column='AirlineSNo']").text();
                var ChargeRFSTruckDetailsSNo = $(this).closest("tr").find("td[data-column='RFSTruckDetailsSNo']").text();
                var ChargeNoOfUnits = $(this).closest("tr").find("input[id='txtNoOfUnits']").val(); //$(this).closest("tr").find("td[data-column='NoOfUnits']").text();
                var ChargeableUnit = $(this).closest("tr").find("input[id='txtChargeableUnit']").val();
                var ChargeAmount = $(this).closest("tr").find("#txtAmount").val();
                var FreightRemarks = ($(this).closest("tr").find("#FreightRemarks").val() == "" || $(this).closest("tr").find("#FreightRemarks").val() == undefined) ? "" : $(this).closest("tr").find("#FreightRemarks").val();

                var RFSChargesData = {
                    AirlineSNo: ChargesAirlineSNo, RFSTruckDetailsSNo: ChargeRFSTruckDetailsSNo, NoOfUnits: ChargeNoOfUnits, ChargeableUnit: ChargeableUnit,
                    Amount: ChargeAmount, FreightRemarks: FreightRemarks
                }
                //-----------------------------------
                //--##  RFS Charges Table -- ##
                //-----------------------------------
                RFSChargesDetails.push(RFSChargesData);

            });

            if ($("#rfscustomCharges").find(".k-grid-content").find("table tbody > tr:first").find("td[data-column='AirlineName']").text() != "") {

                $("#rfscustomCharges").find(".k-grid-content").find("table tbody > tr").find("td[data-column='AirlineSNo']").each(function () {

                    var CustomRFSTruckDetailsSNo = $(this).closest("tr").find("td[data-column='RFSTruckDetailsSNo']").text();
                    var CustomAirlineSNo = $(this).closest("tr").find("td[data-column='AirlineSNo']").text();
                    var RateAirlineCustomChargesSNo = $(this).closest("tr").find("td[data-column='RateAirlineCustomChargesSNo']").text()
                    var CustomAmount = $(this).closest("tr").find("#txtCustomAmount").val();

                    var RFSCustomChargesData = {
                        RFSTruckDetailsSNo: CustomRFSTruckDetailsSNo,
                        AirlineSNo: CustomAirlineSNo,
                        RateAirlineCustomChargesSNo: RateAirlineCustomChargesSNo,
                        Amount: CustomAmount == undefined ? '0' : CustomAmount
                    }
                    //-------------------------------------
                    //--##  RFS Custom Charges Table -- ##
                    //-----------------------------------------
                    RFSCustomChargesDetails.push(RFSCustomChargesData);
                });
            }
        }

        var BillTo = $("input[name=AirlineAgent]:checked").val();
        if (TruckSource == "0" && BillTo == "0") {
            var BillToSno = $("#Account").val() == "" ? CurrentAccountSNo : $("#Account").val();
        }
        else {
            var BillToSno = $("#Account").val(
                ) == "" ? "0" : $("#Account").val();
        }

        var PaymentMode = $("input[name=DockCredit]:checked").val() == undefined ? 0 : $("input[name=DockCredit]:checked").val();  //$('input[name="DockCredit"]:checked').length > 0 ? $('input[name="DockCredit"]:checked').val() : "0";
        var total = 0;
        //if ($("#spnRFSChargesBill").find("input[id=chkBillToAgent]").is(":checked") == true &&
        //    $("#spnRFSChargesBill").find("input[id^='chkCredit']").prop('checked') == true) {

        if ($("input[name=AirlineAgent]:checked").val() == 0 && $("#spnRFSChargesBill").find("input[id^='chkCredit']").prop('checked') == true) {
            // var total = 0;
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
            //    ShowMessage('warning', 'Information!', "Insufficient Credit limit (IDR " + AvailableCreditLimit.toString() + ").", "bottom-right");
            //    return;
            //}
        }

        $.ajax({
            url: "Services/Import/ImportRFSService.svc/SaveRFSChargesDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSChargesDetails: RFSChargesDetails, RFSCustomChargesDetails: RFSCustomChargesDetails, RFSHandlingCharges: HandlingChargeArray, BillTo: BillTo, BillToSno: BillToSno, AirportCode: userContext.AirportCode, PaymentMode: PaymentMode }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success', "Details Saved Successfully");
                    BindRFSChargesInformation(RFSTruckDetailsSNo, IsTruckAgentOrVendor);
                    ImportRFSSearch();
                }
                else if (result == "1")
                    ShowMessage('warning', 'Warning-RFS Charges', "Charges already applied.");
                else
                    ShowMessage('warning', 'Warning-RFS Charges', "Unable to save data.");
            },
            error: function () {
                ShowMessage('warning', 'Warning-RFS Charges', "Unable to save data.");
            }
        });
    }
    return flag;
}

function InitializePage(subprocess, cntrlid, isdblclick) {
    InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "IMPORTRFSASSIGNFLIGHTINFORMATION") {
        $.ajax({
            url: "Services/Import/ImportRFSService.svc/BindImportRFSAssignFlightInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RFSTruckDetailsSNo: RFSTruckDetailsSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var AssignFlightArray = Data.Table0;
                var AssignFlightManifest = Data.Table1;
                cfi.makeTrans("import_importrfsassignflightinformation", null, null, null, null, null, AssignFlightArray, null);
                $("#btnSave").css("display", "none");
                $("#btnCancel").css("display", "none");
                $("#spnMinULDCount").closest("td").next().text("");
                $("#divareaTrans_import_importrfsassignflightinformation").find("table tr td:last").html("");
            }
        });

        $('#assignFlightDetails').append("<div id='divHeightAssign' style='height:100px'></div>");
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
    $("#Text_searchFlightNo").attr("placeholder", "Flight No.");
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

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    var filterEmbargo1 = cfi.getFilter("OR");

    if (textId == "Text_TruckNo") {
        try {
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#TruckDate").attr("sqldatevalue"))
            cfi.setFilter(filterEmbargo, "DestinationAirPortSNo", "eq", userContext.AirportSNo);
            var TruckNoAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return TruckNoAutoCompleteFilter;
        }
        catch (exp) { }
    }

    if (textId == "Text_Vendor") {
        try {
            if ($('#TruckSource:checked').val() == "1")
                cfi.setFilter(filterEmbargo, "AccountTypeName", "in", ("SASV-TRUCK VENDOR,AIRV-TRUCK VENDOR"));
            else
                cfi.setFilter(filterEmbargo, "AccountTypeName", "eq", "FORWARDER");
            var VendorAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return VendorAutoCompleteFilter;
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

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divImportRFSDetails' style='width:100%'></div></td></tr></table></div><div id='test1'></div>";

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                        //    "<td><button class='btn btn-info' style='width:125px;display:block;' id='btnNew'>New Booking</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td>&nbsp;</td>" +
                            //"<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td>&nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table></div>";