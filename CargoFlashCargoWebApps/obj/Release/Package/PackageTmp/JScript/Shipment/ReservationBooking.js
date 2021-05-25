/*
*****************************************************************************
Javascript Name:	ReservationBookingJS     
Purpose:		    This JS used to get autocomplete for Reservation.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    03 Jan 2017
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
var AWBStatusNo = 0;
var BookingRefNo = 0;
var currentprocess = "";
var currentawbsno = 0;
var currentawbno = "";
var currentPrefix = "";
var DimSaved = false;
var AWBReferenceBookingPrimarySNo = 0;
var BookingPrimaryRefNo = "";
var BookingOrigin = "";
var BookingDestination = "";
var AWBStatusDetails = "";
var DGRSPHC = [];
var tblhtml, tblNogHtml;
$(function () {
    // if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) { e.preventDefault(); }
    //var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    //$('#aspnetForm').attr("enctype", "multipart/form-data");
    ReservationBooking();
});

function ReservationBooking() {
    _CURR_PRO_ = "RESERVATIONBOOKING";
    _CURR_OP_ = "Master Reservation";
    $("#divShipmentDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/ReservationBookingSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();

            cfi.AutoComplete("searchOriginCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchDestinationCity", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "v_DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("searchAWBPrefix", "AWBPrefix", "Reservation_vwAWBPrefix", "AWBPrefix", "AWBPrefix", ["AWBPrefix"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNumber", "Reservation_vwAWBNumberSearch", "AWBNumber", "AWBNumber", ["AWBNumber"], null, "contains");
            cfi.AutoComplete("searchReferenceNo", "ReferenceNumber", "AWBReferenceBooking", "ReferenceNumber", "ReferenceNumber", ["ReferenceNumber"], null, "contains");

            $('#searchFlightDate').data("kendoDatePicker").value("");
            $("#searchFlightDate").attr('readOnly', 'readOnly');
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
                CleanUI();
                ShipmentSearch();
                currentawbsno = 0;
                currentawbno = "";
            });
            CleanUI();
            //ShipmentSearch();
            $("#btnNew").unbind("click").bind("click", function () {
                AWBStatusDetails = "";
                FormDataBind('NEW', _CURR_PRO_);
            });
        }
    });
}
function FormDataBind(Action, ProcessNameDetails) {
    if (Action == "NEW" || Action == "COPY")
        AWBStatusNo = 0;
    $.ajax({
        url: 'HtmlFiles/Shipment/ReservationBooking.html',
        success: function (result) {
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#divContent1").remove()
            $('#aspnetForm').append(result);
            $('#aspnetForm').append(NogDiv);
            InstantiateControl("htmldivdetails");
            PageLoaded(Action, ProcessNameDetails);
            $("#AWBChargeableWeight").attr('readOnly', 'readOnly');
            $("#_tempAWBChargeableWeight").attr('readOnly', 'readOnly');
            if (Action == "UPDATE" || Action == "EXECUTE") {
                $('input[type=radio][name=BookingType]').attr('disabled', true);
                $('input[type=radio][name=AWBStock]').attr('disabled', true);
                $("#Text_AWBCode").data("kendoAutoComplete").enable(false);
                $("#AWBNumber").attr('disabled', true);
                $("#_tempAWBNumber").attr('disabled', true);
                $("#Text_ChargeCode").data("kendoAutoComplete").enable(false);
                //$("#NoofHouse").attr('readOnly', 'readOnly');
                //$("#_tempNoofHouse").attr('readOnly', 'readOnly');
                //$("#chkIsBUP").attr('disabled', true);
                //$("#AWBNoofBUP").attr('readOnly', 'readOnly');
                //$("#Text_Product").data("kendoAutoComplete").enable(false);
                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                if (userContext.GroupName == "POS") {
                    $("#NoofHouse").attr('disabled', true);
                    $("#_tempNoofHouse").attr('disabled', true);
                    $("#chkIsBUP").attr('disabled', true);
                }
            }
            InitializePage("RESERVATIONBOOKING", "ApplicationTabs-1", "", "");
            $("#AddDimension").bind("click", function () {
                if ($("#chkIsBUP").prop('checked') == true) {
                    if (kendo.parseFloat($("#AWBNoofBUP").val()) > 0) {
                        DimensionTab("AddDimension");
                    }
                    else {
                        ShowMessage('warning', 'Information!', "Enter No of BUP to add Dimension.");
                        return;
                    }
                }
                else
                    DimensionTab("AddDimension");
            });
            $('input[name=AWBStock]').click(function () {
                if ($(this).val() === '0') {
                    $('#AWBNumber').removeAttr("disabled");
                    $('#_tempAWBNumber').removeAttr("disabled");
                } else if ($(this).val() === '1') {
                    $('#AWBNumber').val('');
                    $('#_tempAWBNumber').val('');
                    $('#AWBNumber').attr('disabled', true);
                    AutoStockAgentOrNot();
                }
            });
            $('input[name=BookingType]').click(function () {
                if (userContext.AgentSNo > 0) {
                    $("#AWBNumber").val('');
                    $("#_tempAWBNumber").val('');
                    $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                    $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(false)
                }
                else {
                    $("#AWBNumber").val('');
                    $("#_tempAWBNumber").val('');
                    cfi.ResetAutoComplete("AWBAgent");
                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                }
                GETProductASPerBookingType($(this).val(), userContext.GroupName);
            });
            $("#ApplicationTabs").kendoTabStrip();
            //$("div[id='divareaTrans_shipment_shipmentnog']").find("tr[id^='areaTrans_shipment_shipmentnog']").each(function (i, row) {
            //    cfi.AutoComplete($(row).find("input[id^='OtherNatureofGoods']").attr("name"), "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], EnableOtherNog, "contains");
            //    $(row).find("input[id^='Text_OtherNatureofGoods']").parent().parent().css('width', '200px');
            //    $(row).find("input[id^='NOG']").attr('disabled', 1);
            //    //if (NOGData.length > 0) {
            //    //    if (NOGData[i] != undefined) {
            //    //        $("#" + $(row).find("input[id^='Text_OtherNatureofGoods']").attr("id")).data("kendoAutoComplete").setDefaultValue(NOGData[i].OtherNatureofGoods, NOGData[i].Text_OtherNatureofGoods);
            //    //    }
            //    //}
            //});
            $("a[id^='ahref_NOGDetails']").unbind("click").bind("click", function () {
                var Pieces = parseInt($("#AWBPieces").val() || "0");
                var GrsWt = parseFloat($("#AWBGrossWeight").val() || "0");
                //var NatureofGd = $("#Commodity").val() || "";
                var NatureofGd = ($("#Text_Commodity").data("kendoAutoComplete").key() || "0");

                if (Pieces == 0 || GrsWt == 0 || parseInt(NatureofGd) <= 0) {
                    //jAlert("Enter Pieces, Gross weight and Commodity Details.", "Warning - Commodity Details");
                    ShowMessage('warning', 'Information!', "Enter Pieces, Gross weight and Commodity Details.");
                    return false;
                }
                if ((($("#Text_Commodity").data("kendoAutoComplete").value() || "") == "OTHER") && ($("#OtherNOG").val() == "")) {
                    ShowMessage('warning', 'Information!', "Enter Other Commodity Details.");
                    //jAlert("Enter Other Commodity Details.", "Warning - Commodity Details");
                    return false;
                }

                if (!$("#divareaTrans_shipment_shipmentnog").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_shipment_shipmentnog", "Commodity Details", 650);
                }
                else {
                    $("#divareaTrans_shipment_shipmentnog").data("kendoWindow").open();
                }
                var PcsRow = 0, WtRow = 0, NogRow = 0;
                $("div[id$='divareaTrans_shipment_shipmentnog']").find("[id^='areaTrans_shipment_shipmentnog']").each(function () {
                    if (parseInt(($(this).find("input[id^='Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='_tempPieces']").val() || 0) : ($(this).find("input[id^='Pieces']").val() || 0)) > 0) {
                        PcsRow += 1;
                    }
                    if (parseFloat(($(this).find("input[id^='NogGrossWt']").val() || 0) == 0 ? ($(this).find("input[id^='_tempNogGrossWt']").val() || 0) : ($(this).find("input[id^='NogGrossWt']").val() || 0)) > 0) {
                        WtRow += 1;
                    }
                    if (($(this).find("input[id^='NOG']").val() != "")) {
                        NogRow += 1;
                    }
                });
                var FirstNogRow = $("div[id$='divareaTrans_shipment_shipmentnog']").find("[id='areaTrans_shipment_shipmentnog']:first");
                if (parseInt(PcsRow) > 0 || parseInt(WtRow) > 0 || parseInt(NogRow) > 0) { } else {
                    FirstNogRow.find("input[id*='Pieces']").val(Pieces);
                    FirstNogRow.find("input[id*='NogGrossWt']").val(GrsWt);
                }
                var NogKey = $("#Text_Commodity").data("kendoAutoComplete").key();
                var NogVal = $("#Text_Commodity").data("kendoAutoComplete").value();
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").setDefaultValue(NogKey, NogVal);
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").enable(false);
                FirstNogRow.find("input[id^='NOG']").val($("#OtherNOG").val());
                FirstNogRow.find("input[id^='NOG']").attr('readonly', true);

            });
            //$("div[id$='divareaTrans_shipment_shipmentnog']").find("[id^='areaTrans_shipment_shipmentnog']").each(function () {
            //    cfi.Numeric($(this).find("input[id^='Pieces']").attr("id"), 0);
            //    cfi.Numeric($(this).find("input[id^='NogGrossWt']").attr("id"), 3);
            //    if ($(this).find("input[id^='NOG_']").val() != "") {
            //        $(this).find("input[id^='NOG_']").removeAttr('disabled');
            //    }
            //});
            $("#btnSave").unbind("click").bind("click", function () {
                if (SaveData(ProcessNameDetails)) {
                    ShipmentSearch();
                    CleanUI();
                }
            });
            $("#btnCancel").unbind("click").bind("click", function () {
                $("#ApplicationTabs-1").html("");
                $("#ApplicationTabs-2").html("");
                $("#ApplicationTabs-3").html("");
                $("#ApplicationTabs-4").html("");
                $("#ApplicationTabs-5").html("");
                $("#ApplicationTabs").hide();
                ResetDetails();
                $("#hdnBookingSNo").val();
                $("#hdnBookingMasterRefNo").val();
                currentawbsno = 0;
                currentawbno = "";
                $("#btnSave").css("display", "none");
                $("#btnUpdate").css("display", "none");
                $("#btnCopyBooking").css("display", "none");
                $("#btnExecute").css("display", "none");
                $("#btnNew").css("display", "block");
                cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
            });
            var todaydate = new Date();
            var ItineraryDate = $("#ItineraryDate").data("kendoDatePicker");
            ItineraryDate.min(todaydate);
            $("input[id^=ItineraryDate]").change(function (e) {
                var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dto = new Date(Date.parse(k));
                var validFrom = $(this).attr("id").replace("To", "From");
                k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dfrom = new Date(Date.parse(k));
                if (dfrom > dto)
                    $(this).val("");
                $("#Text_ItineraryFlightNo").data("kendoAutoComplete").setDefaultValue('', '');
            });
            $("#ItineraryDate").attr('readOnly', 'readOnly');
        }
    });
    if (Action == "NEW") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GenerateAndGetReferenceNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: { BookingRefNo: 'GenerateAndGetReferenceNumber' },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $("#hdnBookingMasterRefNo").val(myData.Table0[0].ReferenceNumber);
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}

function SaveChargeDeclarationsRateData() {
    var ReservationChargeDeclarationsViewModel = {
        CVDCurrencyCode: $("#Text_Currency").data("kendoAutoComplete").key(),
        CVDChargeCode: $("#Text_RateChargeCode").data("kendoAutoComplete").key(),
        CVDWeightValuation: $("#Text_Valuation").data("kendoAutoComplete").key(),
        CVDOtherCharges: $("#Text_OtherCharge").data("kendoAutoComplete").key(),
        CVDDeclareCarriageValue: $("#DeclaredCarriageValue").val(),
        CVDDeclareCustomValue: $("#DeclaredCustomsValue").val(),
        CVDDeclareInsurenceValue: $("#Insurance").val(),
        CVDValuationCharge: $("#ValuationCharge").val(),
        CDCCurrencyCode: $("#Text_CDCCurrencyCode").data("kendoAutoComplete").key(),
        CDCCurrencyConversionRate: $("#CDCConversionRate").val() == "" ? "0" : $("#CDCConversionRate").val(),
        CDCDestinationCurrencyCode: $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").key(),
        CDCChargeAmount: $("#ChargeAmount").val() == "" ? "0" : $("#ChargeAmount").val(),
        CDCTotalChargeAmount: $("#TotalChargeAmount").val() == "" ? "0" : $("#TotalChargeAmount").val()
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/SaveChargeDeclarationsRateData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationChargeDeclarations: ReservationChargeDeclarationsViewModel }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                flag = true;
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                flag = false;
            }
            else if (result.split('?')[0] == "5") {
                ShowMessage('warning', 'Warning - Reservation', "Execution Time Expired.", "bottom-right");
                flag = false;
            }
            else if (result.split('?')[0] == "6") {
                ShowMessage('warning', 'Warning - Reservation', "Shipment can not be executed in LL mode.", "bottom-right");
                flag = false;
            }
            else if (result.split('?')[0] == "10") {
                ShowMessage('warning', 'Warning - Reservation', "AWB Stock not availble.", "bottom-right");
                flag = false;
            }
            else {
                ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
            flag = false;
        }
    });
}
function ExecuteData(ProcessNameDetails) {
    var Dmns = true;
    var flag = false;
    var ULDCheck = true;
    var IsConfirmData = true;
    var AWBRouteStatusResult = true;
    var SoftEmbargo = "0";
    if (ProcessNameDetails.toUpperCase() == "EXECUTERESERVATIONBOOKING") {
        if (cfi.IsValidSection("ApplicationTabs-1")) {
            if (true) {
                var CheckAWBRouteStatusResult = CheckAWBRouteStatus();
                if (CheckAWBRouteStatusResult.split('~')[0] == 'false') {
                    AWBRouteStatusResult = false;
                    if (CheckAWBRouteStatusResult.split('~')[1] != '')
                        ShowMessage('warning', 'Information!', "Shipment does not allowed to be Execute.");
                    else
                        ShowMessage('warning', 'Information!', "First Confirm Itinerary Route Status.");
                }
                if ($("#chkIsBUP").prop('checked') == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsValid != "") {
                                                if (myData.Table0[0].IsValid == "False") {
                                                    var ValidMessage = myData.Table0[0].ValidMessage;
                                                    ULDCheck = false;
                                                    ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                }
                if (ULDCheck == true && AWBRouteStatusResult == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    ItineraryPieces: $(tr).find("td")[3].innerText,
                                    ItineraryGrossWeight: $(tr).find("td")[4].innerText,
                                    ItineraryVolumeWeight: $(tr).find("td")[5].innerText,
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                                if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = false;
                                                    ShowMessage('warning', 'Information!', EmbargoName + ' - ' + 'Hard Embargo Applied.');
                                                    return;
                                                }
                                                else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                    SoftEmbargo = "1";
                                                }
                                                if (IsConfirmData == false) {
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                    if (IsConfirmData == true) {
                        if ($("#chkIsBUP").prop('checked') != true)
                            Dmns = CheckDimensionOnExecution();
                        else
                            Dmns = CheckULDDimensionOnExecution();
                        if (Dmns == true) {
                            var result = CheckAndValidateData();
                            if (result == true) {
                                var ReservationItineraryViewModel = [];
                                var ReservationViewModel = {
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    BookingType: $('input:radio[name=BookingType]:checked').val(),
                                    AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                                    AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                                    AWBNo: $("#AWBNumber").val(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                                    BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : "",
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                                    DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").key(),
                                    AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    AWBPieces: $("#AWBPieces").val(),
                                    GrossWeight: $("#AWBGrossWeight").val(),
                                    VolumeWeight: $("#AWBVolumeWeight").val(),
                                    ChargeableWeight: $("#AWBChargeableWeight").val(),
                                    Volume: $("#AWBCBM").val(),
                                    Priority: $("#Text_Priority").data("kendoAutoComplete").key(),
                                    UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    NOG: $("#NatureOfGoods").val(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                    NoofHouse: $("#NoofHouse").val(),
                                    IsRoutingComplete: $("#chkIsRoutingComplete").prop('checked') == true ? 1 : 0,
                                }

                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                    var ReservationItineraryInfo = {
                                        SNo: "0",
                                        ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                        ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                        AWBPieces: $("#AWBPieces").val(),
                                        AWBGrossWeight: $("#AWBGrossWeight").val(),
                                        AWBVolumeWeight: $("#AWBCBM").val(),
                                        UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                        DailyFlightSNo: $(tr)[0].id,
                                        CarrierCode: $(tr).find("td")[0].innerText.split("-")[0],
                                        FlightNo: $(tr).find("td")[0].innerText,
                                        FlightDate: $(tr).find("td")[1].innerText,
                                        Origin: $(tr).find("td")[2].innerText.split("/")[0],
                                        Destination: $(tr).find("td")[2].innerText.split("/")[1],
                                        Pieces: $(tr).find("td")[3].innerText,
                                        GrossWeight: $(tr).find("td")[4].innerText,
                                        VolumeWeight: $(tr).find("td")[5].innerText,
                                        ETD: $(tr).find("td")[6].innerText.split("/")[0],
                                        ETA: $(tr).find("td")[6].innerText.split("/")[1],
                                        AircraftType: $(tr).find("td")[7].innerText,
                                        FreeSpaceGrossWeight: "",
                                        FreeSpaceVolumeWeight: "",
                                        AllotmentCode: $(tr).find("td")[8].innerText,
                                        AllocatedGrossWeight: "",
                                        AllocatedVolumeWeight: "",
                                        AvailableGrossWeight: "",
                                        AvailableVolumeWeight: "",
                                        SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val()
                                    };
                                    ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                });
                                var ShipperViewModel = {
                                    SNo: $("#hdnShipperSNo").val(),
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
                                    ShipperName: $("#SHIPPER_Name").val(),
                                    ShipperName2: $("#SHIPPER_Name2").val(),
                                    ShipperStreet: $("#SHIPPER_Street").val(),
                                    ShipperStreet2: $("#SHIPPER_Street2").val(),
                                    ShipperLocation: $("#SHIPPER_TownLocation").val(),
                                    ShipperState: $("#SHIPPER_State").val(),
                                    ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
                                    ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
                                    ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
                                    ShipperMobile: $("#SHIPPER_MobileNo").val(),
                                    ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
                                    ShipperEMail: $("#SHIPPER_Email").val(),
                                    ShipperFax: $("#SHipper_Fax").val(),
                                    ShipperGarudaMiles: $("#SHipper_GarudaMiles").val(),
                                };

                                var ConsigneeViewMode = {
                                    SNo: $("#hdnConsigneeSNo").val(),
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
                                    ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
                                    ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
                                    ConsigneeStreet: $("#CONSIGNEE_Street").val(),
                                    ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
                                    ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
                                    ConsigneeState: $("#CONSIGNEE_State").val(),
                                    ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
                                    ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
                                    ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
                                    ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
                                    ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
                                    ConsigneeEMail: $("#CONSIGNEE_Email").val(),
                                    ConsigneeFax: $("#CONSIGNEE_Fax").val(),
                                };
                                var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
                                var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";
                                //var DGRArray = [];
                                //$("div[id$='divareaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
                                //    if (DGRSPHC.length > 0) {
                                //        if ($(this).find("[id^='Text_SPHC']").data("kendoAutoComplete") != undefined) {
                                //            var DGRViewModel = {
                                //                SPHCSNo: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
                                //                SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                                //                DGRSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                                //                UNNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0],
                                //                //DGRShipperSNo: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").key(),
                                //                //ProperShippingName: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                                //                DGRShipperSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                                //                ProperShippingName: "",
                                //                Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                                //                SubRisk: $(this).find("[id^='Text_SubRisk']").data("kendoAutoComplete").key(),
                                //                PackingGroup: $(this).find("[id^='Text_PackingGroup']").data("kendoAutoComplete").key(),
                                //                Pieces: $(this).find("[id^='DGRPieces']").val(),
                                //                NetQuantity: $(this).find("[id^='NetQuantity']").val(),
                                //                Unit: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                                //                Quantity: $(this).find("[id^='Quantity']").val(),
                                //                PackingInst: $(this).find("[id^='Text_PackingInst']").data("kendoAutoComplete").key(),
                                //                RAMCategory: $(this).find("[id^='RamCat']").val(),
                                //                ERGN: $(this).find("[id^='Text_ERG']").data("kendoAutoComplete").key(),
                                //                Commodity: $(this).find("[id^='DGRCommodity']").val(),
                                //            };
                                //        }
                                //        DGRArray.push(DGRViewModel);
                                //    }
                                //});
                                //var SHCSubGroupArray = [];
                                //$("#divareaTrans_shipment_shipmentSHCSubGroup").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup']").each(function (i, row) {
                                //    var SubGroupModel = {
                                //        AWBSNo: currentawbsno,
                                //        SHCSNo: $(row).find("input[id^='SHCSNo_']").val() || 0,
                                //        SubGroupSno: $(row).find("input[id^='Multi_SubGroup_']").val() || 0,
                                //        MandatoryInfo: $(row).find("input[id^='StatementDesc_']").val() || "",
                                //        PackingInst: $(row).find("input[id^='PackingLabel_']").val() || "",
                                //    };
                                //    SHCSubGroupArray.push(SubGroupModel);
                                //});
                                $.ajax({
                                    url: "Services/Shipment/ReservationBookingService.svc/ExecuteBookingShipperandConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
                                    //data: JSON.stringify({ AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, AWBDGRTrans: DGRArray, SHCSubGroupArray: SHCSubGroupArray, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants }),
                                    data: JSON.stringify({ AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants, RateShowOnAWBPrint: $("#hdnRateShowOnAWBPrint").val() == "" ? 0 : $("#hdnRateShowOnAWBPrint").val(), HandlingInformation: $("#hdnHandlingInformation").val() }),
                                    //data: JSON.stringify({ BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val() }),
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        if (result.split('?')[0] == "0") {
                                            cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
                                            ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                                            flag = true;

                                        }
                                        else if (result.split('?')[0] == "1") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "5") {
                                            ShowMessage('warning', 'Warning - Reservation', "Execution Time Expired.", "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "6") {
                                            ShowMessage('warning', 'Warning - Reservation', "Shipment can not be executed in LL mode.", "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "7") {
                                            ShowMessage('warning', 'Warning - Reservation', "Over Booked.", "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "8") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "10") {
                                            ShowMessage('warning', 'Warning - Reservation', "AWB Stock not availble.", "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "11") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else {
                                            ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                                            flag = false;
                                        }
                                    },
                                    error: function (xhr) {
                                        ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
                                        flag = false;
                                    }
                                });
                            }
                            //else {
                            //    ShowMessage('warning', 'Warning - Reservation', "Pieces or Gross Weight or Volume not match Origin Destination Pair.", "bottom-right");
                            //}
                        }
                    }
                }
                return flag;
            }
        }
    }
}
function UpdateData(ProcessNameDetails) {
    var flag = false;
    var ULDCheck = true;
    var IsConfirmData = true;
    var SoftEmbargo = "0";
    if (ProcessNameDetails.toUpperCase() == "UPDATERESERVATIONBOOKING") {
        if (cfi.IsValidSection("ApplicationTabs-1")) {
            if (true) {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsValid != "") {
                                                if (myData.Table0[0].IsValid == "False") {
                                                    var ValidMessage = myData.Table0[0].ValidMessage;
                                                    ULDCheck = false;
                                                    ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                }
                if (ULDCheck == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    ItineraryPieces: $(tr).find("td")[3].innerText,
                                    ItineraryGrossWeight: $(tr).find("td")[4].innerText,
                                    ItineraryVolumeWeight: $(tr).find("td")[5].innerText,
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                                if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = false;
                                                    ShowMessage('warning', 'Information!', EmbargoName + ' - ' + 'Hard Embargo Applied.');
                                                    return;
                                                }
                                                else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                    SoftEmbargo = "1";
                                                }
                                                if (IsConfirmData == false) {
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                    if (IsConfirmData == true) {
                        var result = CheckAndValidateData();
                        if (result == true) {
                            var ReservationItineraryViewModel = [];
                            var ReservationViewModel = {
                                ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                BookingType: $('input:radio[name=BookingType]:checked').val(),
                                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                                AWBNo: $("#AWBNumber").val(),
                                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                                BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : "",
                                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                                DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").key(),
                                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                AWBPieces: $("#AWBPieces").val(),
                                GrossWeight: $("#AWBGrossWeight").val(),
                                VolumeWeight: $("#AWBVolumeWeight").val(),
                                ChargeableWeight: $("#AWBChargeableWeight").val(),
                                Volume: $("#AWBCBM").val(),
                                Priority: $("#Text_Priority").data("kendoAutoComplete").key(),
                                UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                NOG: $("#NatureOfGoods").val(),
                                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                NoofHouse: $("#NoofHouse").val(),
                                IsRoutingComplete: $("#chkIsRoutingComplete").prop('checked') == true ? 1 : 0,
                            }

                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                var ReservationItineraryInfo = {
                                    SNo: "0",
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    AWBPieces: $("#AWBPieces").val(),
                                    AWBGrossWeight: $("#AWBGrossWeight").val(),
                                    AWBVolumeWeight: $("#AWBCBM").val(),
                                    UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                    DailyFlightSNo: $(tr)[0].id,
                                    CarrierCode: $(tr).find("td")[0].innerText.split("-")[0],
                                    FlightNo: $(tr).find("td")[0].innerText,
                                    FlightDate: $(tr).find("td")[1].innerText,
                                    Origin: $(tr).find("td")[2].innerText.split("/")[0],
                                    Destination: $(tr).find("td")[2].innerText.split("/")[1],
                                    Pieces: $(tr).find("td")[3].innerText,
                                    GrossWeight: $(tr).find("td")[4].innerText,
                                    VolumeWeight: $(tr).find("td")[5].innerText,
                                    ETD: $(tr).find("td")[6].innerText.split("/")[0],
                                    ETA: $(tr).find("td")[6].innerText.split("/")[1],
                                    AircraftType: $(tr).find("td")[7].innerText,
                                    FreeSpaceGrossWeight: "",
                                    FreeSpaceVolumeWeight: "",
                                    AllotmentCode: $(tr).find("td")[8].innerText,
                                    AllocatedGrossWeight: "",
                                    AllocatedVolumeWeight: "",
                                    AvailableGrossWeight: "",
                                    AvailableVolumeWeight: "",
                                    SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val()
                                };
                                ReservationItineraryViewModel.push(ReservationItineraryInfo);
                            });
                            var ShipperViewModel = {
                                SNo: $("#hdnShipperSNo").val(),
                                ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
                                ShipperName: $("#SHIPPER_Name").val(),
                                ShipperName2: $("#SHIPPER_Name2").val(),
                                ShipperStreet: $("#SHIPPER_Street").val(),
                                ShipperStreet2: $("#SHIPPER_Street2").val(),
                                ShipperLocation: $("#SHIPPER_TownLocation").val(),
                                ShipperState: $("#SHIPPER_State").val(),
                                ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
                                ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
                                ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
                                ShipperMobile: $("#SHIPPER_MobileNo").val(),
                                ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
                                ShipperEMail: $("#SHIPPER_Email").val(),
                                ShipperFax: $("#SHipper_Fax").val(),
                                ShipperGarudaMiles: $("#SHipper_GarudaMiles").val(),
                            };

                            var ConsigneeViewMode = {
                                SNo: $("#hdnConsigneeSNo").val(),
                                ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
                                ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
                                ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
                                ConsigneeStreet: $("#CONSIGNEE_Street").val(),
                                ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
                                ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
                                ConsigneeState: $("#CONSIGNEE_State").val(),
                                ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
                                ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
                                ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
                                ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
                                ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
                                ConsigneeEMail: $("#CONSIGNEE_Email").val(),
                                ConsigneeFax: $("#CONSIGNEE_Fax").val(),
                            };
                            var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
                            var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/UpdateBookingShipperandConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
                                data: JSON.stringify({ BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants, RateShowOnAWBPrint: $("#hdnRateShowOnAWBPrint").val() == "" ? 0 : $("#hdnRateShowOnAWBPrint").val() }),
                                //data: JSON.stringify({ BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val() }),
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    if (result.split('?')[0] == "0") {
                                        ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                                        flag = true;
                                    }
                                    else if (result.split('?')[0] == "1") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "7") {
                                        ShowMessage('warning', 'Warning - Reservation', "Over Booked.", "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "8") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "11") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                                        flag = false;
                                    }
                                },
                                error: function (xhr) {
                                    ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
                                    flag = false;
                                }
                            });
                        }
                    }
                }
                //else {
                //    ShowMessage('warning', 'Warning - Reservation', "Pieces or Gross Weight or Volume not match Origin Destination Pair.", "bottom-right");
                //}
                return flag;
            }
        }
    }
}
function SaveData(ProcessNameDetails) {
    var flag = false;
    var ULDCheck = true;
    var IsConfirmData = true;
    var SoftEmbargo = "0";
    if (ProcessNameDetails == "RESERVATIONBOOKING") {
        if ($("#AWBNumber").val() != "") {
            ValidateAndCheckValidAWBNumber();
        }
        if (cfi.IsValidSection("ApplicationTabs-1")) {
            if (true) {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsValid != "") {
                                                if (myData.Table0[0].IsValid == "False") {
                                                    var ValidMessage = myData.Table0[0].ValidMessage;
                                                    ULDCheck = false;
                                                    ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                }
                if (ULDCheck == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    ItineraryPieces: $(tr).find("td")[3].innerText,
                                    ItineraryGrossWeight: $(tr).find("td")[4].innerText,
                                    ItineraryVolumeWeight: $(tr).find("td")[5].innerText,
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                                if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = false;
                                                    ShowMessage('warning', 'Information!', EmbargoName + ' - ' + 'Hard Embargo Applied.');
                                                    return;
                                                }
                                                else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                    SoftEmbargo = "1";
                                                }
                                                if (IsConfirmData == false) {
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                    if (IsConfirmData == true) {
                        var result = CheckAndValidateData();
                        if (result == true) {
                            var ReservationItineraryViewModel = [];
                            var ReservationViewModel = {
                                ReservationBookingSNo: "0",
                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                BookingType: $('input:radio[name=BookingType]:checked').val(),
                                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                                AWBNo: $("#AWBNumber").val(),
                                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                                BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : "",
                                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                                DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").key(),
                                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                AWBPieces: $("#AWBPieces").val(),
                                GrossWeight: $("#AWBGrossWeight").val(),
                                VolumeWeight: $("#AWBVolumeWeight").val(),
                                ChargeableWeight: $("#AWBChargeableWeight").val(),
                                Volume: $("#AWBCBM").val(),
                                Priority: $("#Text_Priority").data("kendoAutoComplete").key(),
                                UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                NOG: $("#NatureOfGoods").val(),
                                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                NoofHouse: $("#NoofHouse").val(),
                                IsRoutingComplete: $("#chkIsRoutingComplete").prop('checked') == true ? 1 : 0,
                            }

                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                var ReservationItineraryInfo = {
                                    SNo: "0",
                                    ReservationBookingSNo: "0",
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    AWBPieces: $("#AWBPieces").val(),
                                    AWBGrossWeight: $("#AWBGrossWeight").val(),
                                    AWBVolumeWeight: $("#AWBCBM").val(),
                                    UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                    DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id, //function () { if ($(tr)[0].id.indexOf('_') > 0) return 0; else return $(tr)[0].id; },
                                    CarrierCode: $(tr).find("td")[0].innerText.split("-")[0],
                                    FlightNo: $(tr).find("td")[0].innerText,
                                    FlightDate: $(tr).find("td")[1].innerText,
                                    Origin: $(tr).find("td")[2].innerText.split("/")[0],
                                    Destination: $(tr).find("td")[2].innerText.split("/")[1],
                                    Pieces: $(tr).find("td")[3].innerText,
                                    GrossWeight: $(tr).find("td")[4].innerText,
                                    VolumeWeight: $(tr).find("td")[5].innerText,
                                    ETD: $(tr).find("td")[6].innerText.split("/")[0],
                                    ETA: $(tr).find("td")[6].innerText.split("/")[1],
                                    AircraftType: $(tr).find("td")[7].innerText,
                                    FreeSpaceGrossWeight: "",
                                    FreeSpaceVolumeWeight: "",
                                    AllotmentCode: $(tr).find("td")[8].innerText,
                                    AllocatedGrossWeight: "",
                                    AllocatedVolumeWeight: "",
                                    AvailableGrossWeight: "",
                                    AvailableVolumeWeight: "",
                                    SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val()
                                };
                                ReservationItineraryViewModel.push(ReservationItineraryInfo);
                            });
                            var ShipperViewModel = {
                                SNo: "0",
                                ReservationBookingSNo: "0",
                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
                                ShipperName: $("#SHIPPER_Name").val(),
                                ShipperName2: $("#SHIPPER_Name2").val(),
                                ShipperStreet: $("#SHIPPER_Street").val(),
                                ShipperStreet2: $("#SHIPPER_Street2").val(),
                                ShipperLocation: $("#SHIPPER_TownLocation").val(),
                                ShipperState: $("#SHIPPER_State").val(),
                                ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
                                ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
                                ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
                                ShipperMobile: $("#SHIPPER_MobileNo").val(),
                                ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
                                ShipperEMail: $("#SHIPPER_Email").val(),
                                ShipperFax: $("#SHipper_Fax").val(),
                                ShipperGarudaMiles: $("#SHipper_GarudaMiles").val(),
                            };

                            var ConsigneeViewMode = {
                                SNo: "0",
                                ReservationBookingSNo: "0",
                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
                                ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
                                ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
                                ConsigneeStreet: $("#CONSIGNEE_Street").val(),
                                ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
                                ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
                                ConsigneeState: $("#CONSIGNEE_State").val(),
                                ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
                                ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
                                ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
                                ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
                                ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
                                ConsigneeEMail: $("#CONSIGNEE_Email").val(),
                                ConsigneeFax: $("#CONSIGNEE_Fax").val(),
                            };
                            var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
                            var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/AddBookingShipperandConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
                                data: JSON.stringify({ BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants }),
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    if (result.split('?')[0] == "0") {
                                        ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                                        flag = true;
                                    }
                                    else if (result.split('?')[0] == "1") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "2") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "3") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "7") {
                                        ShowMessage('warning', 'Warning - Reservation', "Over Booked.", "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "8") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "10") {
                                        ShowMessage('warning', 'Warning - Reservation', "AWB Stock not availble.", "bottom-right");
                                        flag = false;
                                    }
                                    else if (result.split('?')[0] == "11") {
                                        ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                        flag = false;
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                                        flag = false;
                                    }
                                },
                                error: function (xhr) {
                                    ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                                    flag = false;
                                }
                            });
                        }
                    }
                }
                //else {
                //    ShowMessage('warning', 'Warning - Reservation', "Pieces or Gross Weight or Volume not match Origin Destination Pair.", "bottom-right");
                //}
                return flag;
            }
        }
    }
}
function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            $(this).css("text-align", "right");
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
            cfi.AlphabetTextBox(controlId, alphabetstyle);
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
function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno) {
    //$("#btnSave").closest("td").css("width", "");
    //InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "RESERVATIONBOOKING") {
        //InstantiateControl(cntrlid);
        cfi.ValidateSection(cntrlid);
        //SAVE SECTION
        $("#btnSave").unbind("click").bind("click", function () {
            cfi.ValidateSubmitSection();
            if (cfi.IsValidSection(cntrlid)) {
                if (true) {
                    //if (SaveFormData(subprocess)) {
                    //    //ShipmentSearch();
                    //    ReloadSameGridPage(subprocess);
                    //}

                }
            }
            else {
                return false
            }
        });
    }
    else if (subprocess.toUpperCase() == "EDOXRESERVATIONBOOKING") {
        InstantiateControl(cntrlid);
        $("#btnSave").css("display", "block");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#btnNew").css("display", "none");
        //$("#divXRAY").show();
        $("#spnShowSlacDetails").html("All Docs Received")
        BindEDox();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveEDoxList()) {
                    ShipmentSearch();
                    CleanUI();
                }
            }
        });
        //UserSubProcessRights("divEDox", subprocesssno);
    }

}

function CopyBooking() {
    cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
    AWBStatusDetails = "";
    FormDataBind('COPY', 'RESERVATIONBOOKING');
}

function ISSecondLegORNot(Origin, Destination) {
    var resultreturn = false;
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/ISSecondLegORNot",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ItineraryOrigin: Origin,
            ItineraryDestination: Destination
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].ItineraryOriginSNo != AWBOriginCitySNo) {
                        resultreturn = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resultreturn;
}
function CheckDimensionOnExecution() {
    var resultreturn = false;
    var Message = "";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var DimensionPieces = 0;
    var DimensionVolumeWeight = 0;
    var DimensionCBM = 0;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckDimensionOnExecution",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ReservationBookingRefNo: $('#hdnBookingMasterRefNo').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Pieces != "" && myData.Table0[0].VolumeWeight != "" && myData.Table0[0].Volume != "") {
                        DimensionPieces = parseFloat(myData.Table0[0].Pieces);
                        DimensionVolumeWeight = parseFloat(myData.Table0[0].VolumeWeight);
                        DimensionCBM = parseFloat(myData.Table0[0].Volume);
                    }
                    else {
                        ShowMessage('warning', 'Information!', "Enter Dimension of all pieces in Execution.");
                        Message = "1";
                        return false;
                    }
                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Dimension of all pieces in Execution.");
                    Message = "1";
                    return false;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    if (Message == "") {
        if (AWBPieces != DimensionPieces) {
            ShowMessage('warning', 'Information!', "Shipment Pieces and Dimension Pieces are Different.");
        }
        else if (AWBVolumeWeight != DimensionVolumeWeight) {
            ShowMessage('warning', 'Information!', "Shipment Volume Weight and Dimension Volume Weight are Different.");
        }
        else if (AWBCBM != DimensionCBM) {
            ShowMessage('warning', 'Information!', "Shipment Volume and Dimension Volume are Different.");
        }
        else {
            resultreturn = true;
        }
    }

    return resultreturn;
}
function CheckULDDimensionOnExecution() {
    var resultreturn = false;
    var Message = "";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBNoofBUP = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var DimensionPieces = 0;
    var DimensionVolumeWeight = 0;
    var DimensionCBM = 0;
    var TotalULDCount = 0;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckULDDimensionOnExecution",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ReservationBookingRefNo: $('#hdnBookingMasterRefNo').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {

                    TotalULDCount = myData.Table0[0].TotalCount;
                    //if (myData.Table0[0].Pieces != "" && myData.Table0[0].VolumeWeight != "" && myData.Table0[0].Volume != "") {
                    //    DimensionPieces = parseFloat(myData.Table0[0].Pieces);
                    //    DimensionVolumeWeight = parseFloat(myData.Table0[0].VolumeWeight);
                    //    DimensionCBM = parseFloat(myData.Table0[0].Volume);
                    //}
                    //else {
                    //    ShowMessage('warning', 'Information!', "Enter Total No of ULD Dimension in Execution.");
                    //    //ShowMessage('warning', 'Information!', "Enter ULD Dimension of all pieces in Execution.");
                    //    Message = "1";
                    //    return false;
                    //}
                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Total No of ULD Dimension in Execution.");
                    //ShowMessage('warning', 'Information!', "Enter ULD Dimension of all pieces in Execution.");
                    Message = "1";
                    return false;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    if (Message == "") {
        //if (AWBVolumeWeight != DimensionVolumeWeight) {
        //    ShowMessage('warning', 'Information!', "Shipment Volume Weight and ULD Dimension Volume Weight are Different.");
        //}
        //else if (AWBCBM != DimensionCBM) {
        //    ShowMessage('warning', 'Information!', "Shipment Volume and ULD Dimension Volume are Different.");
        //}
        if (TotalULDCount != AWBNoofBUP)
            ShowMessage('warning', 'Information!', "Enter Total No of ULD Dimension in Execution.");
        else {
            resultreturn = true;
        }
    }

    return resultreturn;
}
function GETProductASPerBookingType(BookingTypeVal, LoginTypeVal) {
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GETProductASPerBookingType",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingType: BookingTypeVal,
            LoginType: LoginTypeVal
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SNo != "") {
                        if (userContext.GroupName == 'POS') {
                            if (BookingTypeVal == "1") {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(false)
                            }
                            else {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(false)
                            }
                        }
                        else {
                            if (BookingTypeVal == "1") {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(false)
                            }
                            else {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(true)
                            }
                        }
                    }
                    else {
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_Product").data("kendoAutoComplete").enable(true)
                    }
                }
                else {
                    $("#Text_Product").data("kendoAutoComplete").setDefaultValue("", "");
                    $("#Text_Product").data("kendoAutoComplete").enable(true)
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function ApplyRequired() {
    $("#SHIPPER_Name").attr("data-valid", "required");
    $('#SHIPPER_Name').attr('data-valid-msg', 'Enter Shipper Name.');
    $("#SHIPPER_Street").attr("data-valid", "required");
    $('#SHIPPER_Street').attr('data-valid-msg', 'Enter Shipper Street.');
    $("#SHIPPER_TownLocation").attr("data-valid", "required");
    $('#SHIPPER_TownLocation').attr('data-valid-msg', 'Enter Shipper Town/Location.');
    $("#Text_SHIPPER_City").attr("data-valid", "required");
    $('#Text_SHIPPER_City').attr('data-valid-msg', 'Select Shipper City.');
    $("#Text_SHIPPER_CountryCode").attr("data-valid", "required");
    $('#Text_SHIPPER_CountryCode').attr('data-valid-msg', 'Select Shipper Country.');

    $("#CONSIGNEE_AccountNoName").attr("data-valid", "required");
    $('#CONSIGNEE_AccountNoName').attr('data-valid-msg', 'Enter Consignee Name.');
    $("#CONSIGNEE_Street").attr("data-valid", "required");
    $('#CONSIGNEE_Street').attr('data-valid-msg', 'Enter Consignee Street.');
    $("#CONSIGNEE_TownLocation").attr("data-valid", "required");
    $('#CONSIGNEE_TownLocation').attr('data-valid-msg', 'Enter Consignee Town/Location.');
    $("#Text_CONSIGNEE_City").attr("data-valid", "required");
    $('#Text_CONSIGNEE_City').attr('data-valid-msg', 'Select Consignee City.');
    $("#Text_CONSIGNEE_CountryCode").attr("data-valid", "required");
    $('#Text_CONSIGNEE_CountryCode').attr('data-valid-msg', 'Select Consignee Country.');

    $("#NatureOfGoods").attr("data-valid", "required");
    $('#NatureOfGoods').attr('data-valid-msg', 'Enter NOG.');

}
function CheckAndValidateData() {
    var CheckAndValidateDataArray = [];
    var result = false;
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var IsRoutingComplete = $("#chkIsRoutingComplete").prop("checked") ? "1" : "0";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
        var CheckAndValidateDataArrayItems = {
            Origin: $(tr).find("td")[2].innerText.split("/")[0],
            Destination: $(tr).find("td")[2].innerText.split("/")[1],
            Pieces: $(tr).find("td")[3].innerText,
            GrossWeight: $(tr).find("td")[4].innerText,
            VolumeWeight: $(tr).find("td")[5].innerText,
            AWBOriginCitySNo: $(tr).find("input[id^='hdnOriginCitySNo_']").val(),
            AWBDestinationCitySNo: $(tr).find("input[id^='hdnDestinationCitySNo_']").val()
        };
        CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
    });

    if (CheckAndValidateDataArray.length > 0) {
        for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
            var ItemAWBPieces = 0;
            var ItemAWBGrossWeight = 0;
            var ItemVolumeWeight = 0;
            $.map(CheckAndValidateDataArray, function (item) {
                if (item.Origin == CheckAndValidateDataArray[i].Origin) {
                    ItemAWBPieces = parseInt(ItemAWBPieces) + parseInt(item.Pieces);
                    ItemAWBGrossWeight = parseFloat(ItemAWBGrossWeight) + parseFloat(item.GrossWeight);
                    ItemVolumeWeight = parseFloat(ItemVolumeWeight) + parseFloat(item.VolumeWeight);
                }
            });
            if (AWBOriginCitySNo == CheckAndValidateDataArray[i].AWBOriginCitySNo)
                IsmatchAWBOriginCity = true;
            if (AWBDestinationCitySNo == CheckAndValidateDataArray[i].AWBDestinationCitySNo)
                IsmatchAWBDestinationCity = true;
            //if (ItemAWBPieces == AWBPieces && ItemAWBGrossWeight == AWBGrossWeight && ItemVolumeWeight == AWBCBM)
            if (ItemAWBPieces == AWBPieces)
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Pieces does not match to Itinerary Pieces, Please delete Itinerary and Search.");
                return false;
            }
            if (ItemAWBGrossWeight == AWBGrossWeight)
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Gross Weight does not match to Itinerary Weight, Please delete Itinerary and Search.");
                return false;
            }
            if (parseFloat(ItemVolumeWeight).toFixed(3) == AWBCBM)
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Volume does not match to Itinerary Volume, Please delete Itinerary and Search.");
                return false;
            }
        }
    }
    else {
        result = false;
        ShowMessage('warning', 'Information!', "Please Select Itinerary information.");
        return false;
    }

    if (IsRoutingComplete == 0) {
        if (IsmatchAWBOriginCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Origin does not match to Itinerary information.");
            return false;
        }
        if (IsmatchAWBDestinationCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Destination does not match to Itinerary information.");
            return false;
        }
    }
    else {
        if (IsmatchAWBOriginCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Origin does not match to Itinerary information.");
            return false;
        }
    }
    return result;
}
function BackToReservation() {
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(0);
}
function DimensionTab(id) {
    var ResultofChkBUP = true;
    $('#tdlblNoofBups').attr("style", "display:none;");
    $("#lblDimensionTotalPieces").text($("#AWBPieces").val());
    $("#lblDimensionGrossWeight").text($("#AWBGrossWeight").val());
    $("#lblDimensionVolumeWeight").text($("#AWBVolumeWeight").val());
    $("#lblNoofBups").text($("#AWBNoofBUP").val());
    if ($("#chkIsBUP").prop('checked') == true) {
        if ($("#AWBNoofBUP").val() == $("#AWBPieces").val()) {
            ResultofChkBUP = false;
        }
    }

    if (kendo.parseFloat($("#AWBPieces").val()) > 0 && kendo.parseFloat($("#AWBGrossWeight").val()) > 0) {
        //var theDiv = document.getElementById("tblDimensionTab");
        //theDiv.innerHTML = "";
        //var theDiv = document.getElementById("tblDimensionULDTab");
        //theDiv.innerHTML = "";
        var table111 = document.getElementById("tblDimensionTab");
        if (table111 != null && table111.rows.length > 0) {
            table111.innerHTML = "";
        }
        var table222 = document.getElementById("tblDimensionULDTab");
        if (table222 != null && table222.rows.length > 0) {
            table222.innerHTML = "";
        }
        if (ResultofChkBUP == true) {
            //if ($("#chkIsBUP").prop('checked') != true) {
            var dbTableName = 'DimensionTab';
            var pageType = AWBStatusDetails == "Accepted" ? 'View' : $('#hdnPageType').val();
            $('#tbl' + dbTableName).appendGrid({
                tableID: 'tbl' + dbTableName,
                contentEditable: pageType != 'View',
                tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
                servicePath: 'Services/Shipment/ReservationBookingService.svc',
                getRecordServiceMethod: 'Get' + dbTableName + 'Record',
                createUpdateServiceMethod: 'createUpdate' + dbTableName,
                deleteServiceMethod: 'delete' + dbTableName,
                caption: '',
                initRows: 1,
                isGetRecord: true,
                columns: [
                    { name: 'SNo', type: 'hidden', value: 0 },
                    { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
                    { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
                    { name: 'Length', display: 'Length', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Width', display: 'Width', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Height', display: 'Height', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Pieces', display: 'Pieces', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionPieces(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlOptions: { 0: 'INH', 1: 'CMT' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
                    { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
                    { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                ],
                beforeRowRemove: function (caller, rowIndex) {
                    CheckDimensionTabRowdata(rowIndex);
                },
                OnUpdateSuccess: function () {
                    //SetAndCalculateVolumeWeightAndCBM();
                    SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionTab');
                },
                isPaging: false,
                hideButtons: { updateAll: false, insert: true, removeLast: true, append: true },

            });
            //}
        }

        if ($("#chkIsBUP").prop('checked') == true) {
            $('#tdlblNoofBups').attr("style", "display:block;");
            var dbTableName1 = 'DimensionULDTab';
            var pageType = AWBStatusDetails == "Accepted" ? 'View' : $('#hdnPageType').val();
            //cfi.ValidateForm();
            $('#tbl' + dbTableName1).appendGrid({
                tableID: 'tbl' + dbTableName1,
                contentEditable: pageType != 'View',
                tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                currentPage: 1, itemsPerPage: 20, whereCondition: null, sort: '',
                servicePath: 'Services/Shipment/ReservationBookingService.svc',
                getRecordServiceMethod: 'Get' + dbTableName1 + 'Record',
                createUpdateServiceMethod: 'createUpdate' + dbTableName1,
                deleteServiceMethod: 'delete' + dbTableName1,
                caption: 'ULD Information',
                initRows: 1,
                isGetRecord: true,
                columns: [
                    //{ name: 'SNo', type: 'hidden', value: 0 },
                    //{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
                    //{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
                    ////{ name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'vwULDTYpeSLI', textColumn: 'ULDName', keyColumn: 'SNo' },
                    //{ name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'V_ULD_Reservation', textColumn: 'ULDName', keyColumn: 'SNo' },
                    //{ name: 'ULDNo', display: 'ULD No', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric' }, ctrlCss: { width: '90px' }, onClick: function (evt, rowIndex) { SetNumeric(evt.target.id); }, minlength: 4 },
                    //{ name: 'OwnerCode', display: 'OW', type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 2, controltype: 'alphanumericupper' }, ctrlCss: { width: '90px' } },
                    //{ name: 'SLAC', display: 'SLAC', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDSlac(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    //{ name: 'Length', display: 'Length', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    //{ name: 'Width', display: 'Width', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    //{ name: 'Height', display: 'Height', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    //{ name: 'Pieces', display: 'Pieces', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDPieces(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    //{ name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },
                    //{ name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },
                    //{ name: 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlOptions: { 0: 'INH', 1: 'CMT' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
                    ////{ name: 'MesUnit', display: 'Mes. Unit', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'MeasurementUnitCode', textColumn: 'UnitCode', keyColumn: 'SNo' },
                    //{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
                    //{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }


                    { name: 'SNo', type: 'hidden', value: 0 },
                    { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
                    { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
                    //{ name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'vwULDTYpeSLI', textColumn: 'ULDName', keyColumn: 'SNo' },
                    { name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'V_ULD_Reservation', textColumn: 'ULDName', keyColumn: 'SNo' },
                    { name: 'ULDNo', display: 'ULD No', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric' }, ctrlCss: { width: '90px' }, onClick: function (evt, rowIndex) { SetNumeric(evt.target.id); }, minlength: 4 },
                    { name: 'OwnerCode', display: 'OW', type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 2, controltype: 'alphanumericupper' }, ctrlCss: { width: '90px' } },
                    { name: 'SLAC', display: 'SLAC', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDSlac(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                    { name: 'Length', display: 'Length', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                    { name: 'Width', display: 'Width', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                    { name: 'Height', display: 'Height', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                    { name: 'Pieces', display: 'Pieces', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDPieces(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                    { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },
                    { name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },
                    { name: 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlAttr: { disabled: true }, ctrlOptions: { 0: 'INH', 1: 'CMT' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
                    //{ name: 'MesUnit', display: 'Mes. Unit', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'MeasurementUnitCode', textColumn: 'UnitCode', keyColumn: 'SNo' },
                    { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
                    { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                ],
                customFooterButtons: [
                    { uiButton: { label: 'Update All', text: true }, btnAttr: { title: 'Update All' }, click: function (evt) { SaveULDDimensionData(this) }, atTheFront: true },
                ],
                beforeRowRemove: function (caller, rowIndex) {
                    CheckDimensionULDTabRowdata(rowIndex);
                },
                OnUpdateSuccess: function () {
                    //ULDDimensionSetAndCalculateVolumeWeightAndCBM();
                    SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionULDTab');
                },
                afterRowRemoved: function (caller, rowIndex) {
                    //CheckDimensionULDTabRowdata(rowIndex);
                },
                afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                    //if ($("#Text_Destination").text() == $('#ViaRoute').val()) {
                    //    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                    //    $('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).prop('disabled', 'disabled');

                    //}

                    DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex)
                },
                beforeRowAppend: function (caller, parentRowIndex, addedRowIndex) {
                    var GroupBy = {};
                    var CheckAndValidateDataArray = [];
                    var res = true;
                    $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                        var CheckAndValidateDataArrayItems = {
                            ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                            ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                            OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                            SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val()
                        };
                        CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
                    });

                    //if (CheckAndValidateDataArray.length > 0) {
                    //    var groups = {};
                    //    for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
                    //        var groupName = CheckAndValidateDataArray[i].ULDType + ',' + CheckAndValidateDataArray[i].ULDNo + ',' + CheckAndValidateDataArray[i].OwnerCode + ',' + CheckAndValidateDataArray[i].SLAC;
                    //        //var groupName1 = CheckAndValidateDataArray[i].ULDNo;
                    //        if (!groups[groupName]) {
                    //            groups[groupName] = [];
                    //        }
                    //        groups[groupName].push(CheckAndValidateDataArray[i].ULDNo);
                    //        groups[groupName].push(CheckAndValidateDataArray[i].OwnerCode);
                    //        groups[groupName].push(CheckAndValidateDataArray[i].SLAC);
                    //    }
                    //    myArray = [];
                    //    for (var groupName in groups) {
                    //        myArray.push({ ULDType: groupName, ULDNo: groups[groupName] });
                    //    }
                    //    if (myArray.length >= $("#AWBNoofBUP").val()) {
                    //        res = false;
                    //    }
                    //}

                    if (CheckAndValidateDataArray.length > 0) {
                        if (CheckAndValidateDataArray.length == $("#AWBNoofBUP").val())
                            res = false;
                    }

                    return res;
                },
                isPaging: false,
                hideButtons: { updateAll: true, insert: true, removeLast: true }
            });
        }
        else {
            $('#tblDimensionULDTab').empty()
        }
        if (id == "AddDimension") {
            $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(1);
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW") {
            var Dimensionrows = 0;
            var DimensionULDrows = 0;
            $("tr[id^='tblDimensionTab_Row']").each(function (row, tr) {
                Dimensionrows = tr.id.split('_')[2];
            });
            $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                DimensionULDrows = tr.id.split('_')[2];
            });
            if (Dimensionrows == 0) {
                //if ($("#chkIsBUP").prop('checked') != true) {
                $('#tblDimensionTab').appendGrid('insertRow', 1, 0);
                GetAwbDetails(1, 0, 0, "tblDimensionTab", 1);
                //}
            }
            if (DimensionULDrows == 0) {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $('#tblDimensionULDTab').appendGrid('insertRow', 1, 0);
                    GetAwbDetails(1, 0, 0, "tblDimensionULDTab", 1);
                }
            }

        }
    }
    else {
        ShowMessage('warning', 'Information!', "Enter Pieces and Gross Weight to add Dimension.");
        return;
    }

}
function SaveULDDimensionData(obj) {
    var rows = $("tr[id^='tblDimensionULDTab']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblDimensionULDTab");
    var ValidData = $('#tblDimensionULDTab').appendGrid('getStringJson');
    if (ValidData != "[]" && ValidData != false) {
        var res = false;
        var CheckAndValidateDataArray = [];
        //$("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
        //    var CheckAndValidateDataArrayItems = {
        //        ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
        //        ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
        //        OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
        //        SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val()
        //    };
        //    CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
        //});

        //if (CheckAndValidateDataArray.length > 0) {
        //    var groups = {};
        //    for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
        //        var groupName = CheckAndValidateDataArray[i].ULDType + ',' + CheckAndValidateDataArray[i].ULDNo + ',' + CheckAndValidateDataArray[i].OwnerCode + ',' + CheckAndValidateDataArray[i].SLAC;
        //        //var groupName1 = CheckAndValidateDataArray[i].ULDNo;
        //        if (!groups[groupName]) {
        //            groups[groupName] = [];
        //        }
        //        groups[groupName].push(CheckAndValidateDataArray[i].ULDNo);
        //        groups[groupName].push(CheckAndValidateDataArray[i].OwnerCode);
        //        groups[groupName].push(CheckAndValidateDataArray[i].SLAC);
        //    }
        //    myArray = [];
        //    for (var groupName in groups) {
        //        myArray.push({ ULDType: groupName, ULDNo: groups[groupName] });
        //    }
        //    if (myArray.length == $("#AWBNoofBUP").val()) {
        //        res = true;
        //    }
        //}

        $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
            var CheckAndValidateDataArrayItems = {
                ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val(),
                Length: $(tr).find("input[id^='tblDimensionULDTab_Length_']").val(),
                Width: $(tr).find("input[id^='tblDimensionULDTab_Width_']").val(),
                Height: $(tr).find("input[id^='tblDimensionULDTab_Height_']").val(),
                Pieces: $(tr).find("input[id^='tblDimensionULDTab_Pieces_']").val(),
                VolumeWeight: $(tr).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val(),
                Volume: $(tr).find("input[id^='tblDimensionULDTab_Volume_']").val(),
            };
            CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
        });

        if (CheckAndValidateDataArray.length > 0) {
            if (CheckAndValidateDataArray.length == $("#AWBNoofBUP").val())
                res = true;
        }

        if (res == true) {
            $.ajax({
                url: "./Services/Shipment/ReservationBookingService.svc/createUpdateDimensionULDTab?strData=" + ValidData,
                async: false, type: "POST", dataType: "json", cache: false,
                //data: JSON.stringify({ strData: ValidData }),
                //async: false, type: "POST", cache: false,
                //data: JSON.stringify(ValidData),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data == '<value>ULD Added Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Added Successfully.');
                    }
                    else if (data == '<value>ULD Updated Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Updated Successfully.');
                    }
                    else if (data == '<value>ULD Deleted Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Deleted Successfully.');
                    }
                    else {
                        ShowMessage('warning', 'Warning.', null);
                    }
                }
            });
        }
        else {
            ShowMessage('warning', 'Information!', "Enter Total No of BUP.");
            return;
        }

    }
    else {
        return false;
    }
}
function SetNumeric(obj, event) {
    var Piece_ID = obj;
    $('input[type="text"][id="' + Piece_ID + '"]').keypress(function (event) {
        var $this = $(this);
        if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
           ((event.which < 48 || event.which > 57) &&
           (event.which != 0 && event.which != 8))) {
            event.preventDefault();
        }

        var text = $(this).val();
        if ((event.which == 46) && (text.indexOf('.') == -1)) {
            setTimeout(function () {
                if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                    $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                }
            }, 1);
        }

        if ((text.indexOf('.') != -1) &&
            (text.substring(text.indexOf('.')).length > 2) &&
            (event.which != 0 && event.which != 8) &&
            ($(this)[0].selectionStart >= text.length - 2)) {
            event.preventDefault();
        }
    });
}
function CalculatedVolumeCBM(id) {
    var VolumeCBM = 0;
    var VolumeWeight = 0;
    var TableNamerowIndex = id.split('_')[0];
    var rowIndex = id.split('_')[2];
    var IsCMS = $('input:radio[name=' + TableNamerowIndex + '_RbtnIsCMS_' + rowIndex + ']:checked').val();
    var Pieces = parseInt(($('#' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0));
    var Length = parseInt(($('#' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0));
    var Width = parseInt(($('#' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0));
    var Height = parseInt(($('#' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0));
    if (IsCMS == 1) {
        //VolumeCBM = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor).toFixed(3)
        //VolumeWeight = (VolumeCBM * 166.66).toFixed(2)
        VolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor).toFixed(2)
        VolumeCBM = (((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor) / 166.66).toFixed(3)
    }
    else {
        //VolumeCBM = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor).toFixed(3)
        //VolumeWeight = ((VolumeCBM * 135.3147) / 12).toFixed(2)
        VolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor).toFixed(2)
        VolumeCBM = (((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor) / 166.66).toFixed(3)
    }
    $('#_temp' + TableNamerowIndex + '_VolumeWeight_' + rowIndex).val(VolumeWeight);
    $('#' + TableNamerowIndex + '_VolumeWeight_' + rowIndex).val(VolumeWeight);
    $('#_temp' + TableNamerowIndex + '_Volume_' + rowIndex).val(VolumeCBM);
    $('#' + TableNamerowIndex + '_Volume_' + rowIndex).val(VolumeCBM);

    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    //if (TableNamerowIndex == "tblDimensionULDTab") {
    $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
            CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
        if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
            CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
    });
    //}
    //else {
    $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
            CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
        if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
            CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
    });
    //}
    $("#lblDimensionVolumeWeight").text(CalculateVolumeWeight.toFixed(2));
}
function SetAndCalculateVolumeWeightAndCBMNEW(id) {
    if (id == 'tblDimensionTab') {
        var CalculateVolumeWeight = 0;
        var CalculateCBM = 0;
        $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
            if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
                CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
            if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
                CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
        });

        var OtherTable = document.getElementById("tblDimensionULDTab");
        if (OtherTable != null && OtherTable.rows.length > 2) {
            $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
                if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
                    CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
                if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
                    CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
            });
        }

        $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
        $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
        $("#AWBCBM").val(CalculateCBM.toFixed(3));
        $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
        $("#AWBCBM").attr('disabled', true);
        $("#_tempAWBCBM").attr('disabled', true);

        $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
        thedivFlightSearchResult.innerHTML = "";

        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

        var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
        $("#AWBChargeableWeight").val(chwt);
        $("#_tempAWBChargeableWeight").val(chwt);
        //CalculateShipmentChWt('');
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0],
                    Destination: $(tr).find("td")[2].innerText.split("/")[1]
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });

            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    RowCount = 0;
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[5].innerText = CalculateCBM;
                });
            }
        }
    }
    else if (id == 'tblDimensionULDTab') {
        var CalculateVolumeWeight = 0;
        var CalculateCBM = 0;
        $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
            if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
                CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
            if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
                CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
        });

        var OtherTable = document.getElementById("tblDimensionTab");
        if (OtherTable != null && OtherTable.rows.length > 1) {
            $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
                if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
                    CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
                if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
                    CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
            });
        }

        $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
        $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
        $("#AWBCBM").val(CalculateCBM.toFixed(3));
        $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
        $("#AWBCBM").attr('disabled', true);
        $("#_tempAWBCBM").attr('disabled', true);

        $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

        var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
        $("#AWBChargeableWeight").val(chwt);
        $("#_tempAWBChargeableWeight").val(chwt);
        //CalculateShipmentChWt('');
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0],
                    Destination: $(tr).find("td")[2].innerText.split("/")[1]
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });

            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[5].innerText = CalculateCBM;
                });
            }
        }
    }
}
function ULDDimensionSetAndCalculateVolumeWeightAndCBM() {
    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val())
        CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val())
    });
    $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#AWBCBM").val(CalculateCBM.toFixed(3));
    $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

    $("#AWBVolumeWeight").attr('disabled', true);
    $("#_tempAWBVolumeWeight").attr('disabled', true);
    $("#AWBCBM").attr('disabled', true);
    $("#_tempAWBCBM").attr('disabled', true);

    $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
    $("#AWBChargeableWeight").val(chwt);
    $("#_tempAWBChargeableWeight").val(chwt);
    //CalculateShipmentChWt('');
    var result = false;
    var RowCount = 0;
    var SetAndCalculateVolumeArray = [];
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            var SetAndCalculateVolumeArrayItems = {
                Origin: $(tr).find("td")[2].innerText.split("/")[0],
                Destination: $(tr).find("td")[2].innerText.split("/")[1]
            };
            SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
        });

        if (SetAndCalculateVolumeArray.length > 0) {
            for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                $.map(SetAndCalculateVolumeArray, function (item) {
                    if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                        RowCount = parseInt(RowCount) + parseInt(1);
                    }
                });
                if (RowCount > 1) {
                    result = false;
                    return false;
                }
                else {
                    result = true;
                }
            }
        }
        if (result = true) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("td")[5].innerText = CalculateCBM;
            });
        }
    }

}
function SetAndCalculateVolumeWeightAndCBM() {
    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val())
        CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val())
    });
    $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#AWBCBM").val(CalculateCBM.toFixed(3));
    $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

    $("#AWBVolumeWeight").attr('disabled', true);
    $("#_tempAWBVolumeWeight").attr('disabled', true);
    $("#AWBCBM").attr('disabled', true);
    $("#_tempAWBCBM").attr('disabled', true);

    $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
    $("#AWBChargeableWeight").val(chwt);
    $("#_tempAWBChargeableWeight").val(chwt);
    //CalculateShipmentChWt('');
    var result = false;
    var RowCount = 0;
    var SetAndCalculateVolumeArray = [];
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            var SetAndCalculateVolumeArrayItems = {
                Origin: $(tr).find("td")[2].innerText.split("/")[0],
                Destination: $(tr).find("td")[2].innerText.split("/")[1]
            };
            SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
        });

        if (SetAndCalculateVolumeArray.length > 0) {
            for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                RowCount = 0;
                $.map(SetAndCalculateVolumeArray, function (item) {
                    if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                        RowCount = parseInt(RowCount) + parseInt(1);
                    }
                });
                if (RowCount > 1) {
                    result = false;
                    return false;
                }
                else {
                    result = true;
                }
            }
        }
        if (result = true) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("td")[5].innerText = CalculateCBM;
            });
        }
    }

}
function AddNewRowDimensionULDTab() {

    var row = 0;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        //totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];
    });
    $('#tblDimensionULDTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
    //$('#tblDimensionULDTab').appendGrid('insertRow', 1, 0);
    GetAwbDetails(1, 0, 0, "tblDimensionULDTab", 1);
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex) {
    var rows = 0;
    //var ULDTypeDataArray = [];
    var NoOfBUPs = parseInt(($("#AWBNoofBUP").val() || 0) == 0 ? ($("#_tempAWBNoofBUP").val() || 0) : ($("#AWBNoofBUP").val() || 0));
    $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
        rows = tr.id.split('_')[2];

        //var ULDTypeDataArrayItems = {
        //    ULDType: $(tr).find("input[id^='tblDimensionULDTab_ULDTypeSNo']").val()
        //};
        //ULDTypeDataArray.push(ULDTypeDataArrayItems);
        //$(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
        //$(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

        //$(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
        //$(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

        //$(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
        //$(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);

        //$(tr).find("input[id^='_temptblRateBase_EndWt_']").attr("disabled", true);
    });
    //var TotalULDType = 0;
    //if (ULDTypeDataArray.length > 0) {
    //    for (var i = 0; i < ULDTypeDataArray.length; i++) {
    //        $.map(ULDTypeDataArray, function (item) {
    //            if (item.ULDType != ULDTypeDataArray[i].ULDType) {
    //                TotalULDType = parseInt(TotalULDType) + parseInt(1);
    //            }
    //        });
    //    }
    //}
    if (NoOfBUPs == 1)
        $('#tblDimensionULDTab_btnAppendRow').attr("style", "display:none;");

    //$('#tblDimensionULDTab_Delete_' + rows).attr("style", "display:none;");

    //$('#_temptblDimensionULDTab_VolumeWeight_' + rows).val($("#AWBVolumeWeight").val());
    //$('#tblDimensionULDTab_VolumeWeight_' + rows).val($("#AWBVolumeWeight").val());
    //$('#_temptblDimensionULDTab_Volume_' + rows).val($("#AWBCBM").val());
    //$('#tblDimensionULDTab_Volume_' + rows).val($("#AWBCBM").val());
}
function CheckDimensionTabRowdata(rows) {
    var TotalAWBPieces = 0;
    if ($("#chkIsBUP").prop('checked') == true) {
        TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(($("#AWBNoofBUP").val() || 0) == 0 ? ($("#_tempAWBNoofBUP").val() || 0) : ($("#AWBNoofBUP").val() || 0)));
    }
    else
        TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var lastRowPieces = 0;
    var totalPieces = 0;
    var row = 0;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];
    });
    lastRowPieces = $('#tblDimensionTab_Pieces_' + row).val();
    $('#tblDimensionTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(TotalAWBPieces) - parseInt(totalPieces)));
    $('#_temptblDimensionTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(TotalAWBPieces) - parseInt(totalPieces)));
    if (row == 1)
        $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", false);
    if (row == 0) {
        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
        $("#AWBCBM").attr('disabled', true);
        $("#_tempAWBCBM").attr('disabled', true);
    }
    CalculatedVolumeCBM('tblDimensionTab_Pieces_' + row);
}
function CheckDimensionULDTabRowdata(rows) {
    CalculatedVolumeCBM('tblDimensionULDTab_Pieces_' + rows);
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rows).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rows).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rows).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rows).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rows).val();
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var lastRowPieces = 0;
    var totalPieces = 0;
    var row = 0;
    var TotalRow = 0;

    //$("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
    //    //$(tr).find("input[id^='tblRateBase_SlabName_']").attr("disabled", true);
    //    //$(tr).find("input[id^='tblRateBase_SlabName_']").attr("enabled", false);

    //    //$(tr).find("input[id^='tblRateBase_StartWt_']").attr("disabled", true);
    //    //$(tr).find("input[id^='tblRateBase_StartWt_']").attr("enabled", false);

    //    //$(tr).find("input[id^='tblRateBase_EndWt_']").attr("disabled", true);
    //    //$(tr).find("input[id^='tblRateBase_EndWt_']").attr("enabled", false);

    //    //$(tr).find("input[id^='_temptblRateBase_EndWt_']").attr("disabled", true);

    //});


    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo']").val() == HdnULDTypeSNo && $(this).find("input[id^='tblDimensionULDTab_ULDNo']").val() == ULDNo && $(this).find("input[id^='tblDimensionULDTab_OwnerCode']").val() == OwnerCode && $(this).find("input[id^='tblDimensionULDTab_SLAC']").val() == SLAC) {
            totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0));
            row = this.id.split('_')[2];
            TotalRow = parseInt(TotalRow) + parseInt(1);
        }
    });
    lastRowPieces = $('#tblDimensionULDTab_Pieces_' + row).val();
    $('#tblDimensionULDTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(SLAC) - parseInt(totalPieces)));
    $('#_temptblDimensionULDTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(SLAC) - parseInt(totalPieces)));
    if (TotalRow == 1) {
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(row)).data("kendoAutoComplete").enable(true)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(row)).removeAttr("disabled");
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(row)).removeAttr("disabled");
        $('#tblDimensionULDTab_SLAC_' + parseInt(row)).removeAttr("disabled");
        $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(row) + ']').attr("disabled", false);
    }
}
function CalculatedDimensionPieces(id) {
    //CalculatedVolumeCBM(id);
    var TotalAWBPieces = 0;
    if ($("#chkIsBUP").prop('checked') == true) {
        //TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(($("#AWBNoofBUP").val() || 0) == 0 ? ($("#_tempAWBNoofBUP").val() || 0) : ($("#AWBNoofBUP").val() || 0)));
        TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    }
    else
        TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var Pieces = $('#tblDimensionTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var row = 0;
    var lastRow = 0;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];
    });
    if (Pieces > 0) {
        if (TotalAWBPieces != totalPieces) {
            var CurrentPieces = 0;
            if (totalPieces > TotalAWBPieces) {
                CurrentPieces = parseInt(TotalAWBPieces) - (parseInt(totalPieces) - parseInt(Pieces))
                ShowMessage('warning', 'Information!', "Total Pieces Can not be greater than AWB Pieces.");
                $('#tblDimensionTab_Pieces_' + rowIndex).val(CurrentPieces);
                $('#_temptblDimensionTab_Pieces_' + rowIndex).val(CurrentPieces);
                return;
            }
            else {
                CalculatedVolumeCBM(id);
                CurrentPieces = parseInt(TotalAWBPieces) - parseInt(totalPieces);
                if (Length > 0 && Width > 0 && Height > 0) {
                    $('#tblDimensionTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
                    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
                        lastRow = this.id.split('_')[2];
                    });
                    GetAwbDetails(parseInt(lastRow), parseInt(row), CurrentPieces, "tblDimensionTab", 0);
                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Length, Weight and Height for split Pieces.");
                    $('#tblDimensionTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    $('#_temptblDimensionTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    return;
                }
            }
        }
        else
            CalculatedVolumeCBM(id);
    }
    else {
        ShowMessage('warning', 'Information!', "Pieces must be greater than 0.");
        $('#tblDimensionTab_Pieces_' + rowIndex).val(parseInt(TotalAWBPieces) - parseInt(totalPieces));
        $('#_temptblDimensionTab_Pieces_' + rowIndex).val(parseInt(TotalAWBPieces) - parseInt(totalPieces));
        return;
    }
}
function CalculatedDimensionULDSlac(id) {
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rowIndex).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rowIndex).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rowIndex).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rowIndex).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rowIndex).val();
    var Pieces = $('#tblDimensionULDTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionULDTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionULDTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionULDTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var row = 0;
    if (kendo.parseFloat(HdnULDTypeSNo) > 0) {
        if (SLAC > 0) {
            $('#tblDimensionULDTab_Pieces_' + rowIndex).val(SLAC)
            $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(SLAC)
        }
    }
    else {
        $('#tblDimensionULDTab_SLAC_' + rowIndex).val('')
        $('#_temptblDimensionULDTab_SLAC_' + rowIndex).val('')
        ShowMessage('warning', 'Information!', "Enter ULD Type for SLAc.");
        return;
    }
}
function CalculatedDimensionULDPieces(id) {
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rowIndex).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rowIndex).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rowIndex).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rowIndex).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rowIndex).val();
    var Pieces = $('#tblDimensionULDTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionULDTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionULDTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionULDTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var totalSLAC = 0;
    var row = 0;
    var lastRow = 0;
    var TotalRow = 0;
    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo']").val() == HdnULDTypeSNo && $(this).find("input[id^='tblDimensionULDTab_ULDNo']").val() == ULDNo && $(this).find("input[id^='tblDimensionULDTab_OwnerCode']").val() == OwnerCode && $(this).find("input[id^='tblDimensionULDTab_SLAC']").val() == SLAC) {
            totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0));
            row = this.id.split('_')[2];
            TotalRow = parseInt(TotalRow) + parseInt(1);
        }
        lastRow = this.id.split('_')[2];
    });
    if (Pieces > 0 && SLAC > 0 && row > 0) {
        if (SLAC != totalPieces) {
            var CurrentPieces = 0;
            if (totalPieces > SLAC) {
                CurrentPieces = parseInt(SLAC) - (parseInt(totalPieces) - parseInt(Pieces))
                ShowMessage('warning', 'Information!', "Total Pieces Can not be greater than SLAC.");
                $('#tblDimensionULDTab_Pieces_' + rowIndex).val(CurrentPieces);
                $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(CurrentPieces);
                return;
            }
            else {
                CalculatedVolumeCBM(id);
                CurrentPieces = parseInt(SLAC) - parseInt(totalPieces);
                if (Length > 0 && Width > 0 && Height > 0) {
                    $('#tblDimensionULDTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
                    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
                        lastRow = this.id.split('_')[2];
                    });
                    BindULDOwner(parseInt(row), parseInt(lastRow), parseInt(TotalRow), "tblDimensionULDTab");
                    GetAwbDetails(parseInt(lastRow), parseInt(row), CurrentPieces, "tblDimensionULDTab", 0);

                    //var ULDTypeDataArray = [];
                    //var NoOfBUPs = parseInt(($("#AWBNoofBUP").val() || 0) == 0 ? ($("#_tempAWBNoofBUP").val() || 0) : ($("#AWBNoofBUP").val() || 0));
                    //$("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                    //    rows = tr.id.split('_')[2];
                    //    var ULDTypeDataArrayItems = {
                    //        ULDType: $(tr).find("input[id^='tblDimensionULDTab_ULDTypeSNo']").val()
                    //    };
                    //    ULDTypeDataArray.push(ULDTypeDataArrayItems);
                    //});
                    //var TotalULDType = 1;
                    //if (ULDTypeDataArray.length > 0) {
                    //    for (var i = 0; i < ULDTypeDataArray.length; i++) {
                    //        $.map(ULDTypeDataArray, function (item) {
                    //            if (item.ULDType != ULDTypeDataArray[i].ULDType) {
                    //                TotalULDType = parseInt(TotalULDType) + parseInt(1);
                    //            }
                    //        });
                    //    }
                    //}
                    //if (NoOfBUPs == 1)
                    //    $('#tblDimensionULDTab_btnAppendRow').attr("style", "display:none;");
                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Length, Weight and Height for split Pieces.");
                    $('#tblDimensionULDTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    return;
                }
            }
        }
    }
    else {
        ShowMessage('warning', 'Information!', "Pieces must be greater than 0.");
        $('#tblDimensionULDTab_Pieces_' + rowIndex).val('');
        $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val('');
        return;
    }
}
function GetAwbDetails(Lastrow, PreviousRow, CurrentPieces, table, IsDeleted) {
    if (table == "tblDimensionTab") {
        var IsCMS = $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + PreviousRow + ']:checked').val();
        if (Lastrow > 1) {
            $('#_temptblDimensionTab_Pieces_' + Lastrow).val(CurrentPieces);
            $('#tblDimensionTab_Pieces_' + Lastrow).val(CurrentPieces);
            $('#_temptblDimensionTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            $('#tblDimensionTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            $('#_temptblDimensionTab_Volume_' + Lastrow).val($("#AWBCBM").val());
            $('#tblDimensionTab_Volume_' + Lastrow).val($("#AWBCBM").val());

            if (IsCMS == 1)
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']:eq(1)').attr("checked", 1);
            else
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']:eq(0)').attr("checked", 1);
            $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']').attr("disabled", true);
            $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", true);
        }
        else {
            $('#tblDimensionTab_Delete_1').attr("style", "display:none;");
            if ($("#chkIsBUP").prop('checked') == true) {
                //var TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(($("#AWBNoofBUP").val() || 0) == 0 ? ($("#_tempAWBNoofBUP").val() || 0) : ($("#AWBNoofBUP").val() || 0)));
                var TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)));
                $('#_temptblDimensionTab_Pieces_1').val(TotalAWBPieces);
                $('#tblDimensionTab_Pieces_1').val(TotalAWBPieces);
            }
            else {
                $('#_temptblDimensionTab_Pieces_1').val($("#AWBPieces").val());
                $('#tblDimensionTab_Pieces_1').val($("#AWBPieces").val());
            }
            $('#_temptblDimensionTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            $('#tblDimensionTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            $('#_temptblDimensionTab_Volume_1').val($("#AWBCBM").val());
            $('#tblDimensionTab_Volume_1').val($("#AWBCBM").val());
        }
    }
    if (table == "tblDimensionULDTab") {
        if (Lastrow > 1) {
            //$('#_temptblDimensionULDTab_Pieces_' + Lastrow).val(CurrentPieces);
            //$('#tblDimensionULDTab_Pieces_' + Lastrow).val(CurrentPieces);

            //$('#_temptblDimensionULDTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            //$('#tblDimensionULDTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            //$('#_temptblDimensionULDTab_Volume_' + Lastrow).val($("#AWBCBM").val());
            //$('#tblDimensionULDTab_Volume_' + Lastrow).val($("#AWBCBM").val());
        }
        else {
            $('#tblDimensionULDTab_Delete_1').attr("style", "display:none;");
            //$('#_temptblDimensionULDTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            //$('#tblDimensionULDTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            //$('#_temptblDimensionULDTab_Volume_1').val($("#AWBCBM").val());
            //$('#tblDimensionULDTab_Volume_1').val($("#AWBCBM").val());
        }
    }
}
function BindULDOwner(PreviousRow, CurrentRow, TotalRow, Table) {
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + PreviousRow).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + PreviousRow).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + PreviousRow).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + PreviousRow).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + PreviousRow).val();
    var IsCMS = $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + PreviousRow + ']:checked').val();
    //var IsCMS = $("input:radio[name=tblDimensionULDTab_RbtnIsCMS_" + PreviousRow + "]:checked").val(); //$('#tblDimensionULDTab_SLAC_' + PreviousRow).prop('checked');

    //if (kendo.parseFloat(HdnULDTypeSNo) > 0 && kendo.parseFloat(ULDNo) > 0 && OwnerCode != "") {
    if (kendo.parseFloat(HdnULDTypeSNo) > 0) {
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(CurrentRow)).val(ULDTypeSNo)
        $('#tblDimensionULDTab_HdnULDTypeSNo_' + parseInt(CurrentRow)).val(HdnULDTypeSNo)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).val(ULDNo)
        $('#_temptblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).val(ULDNo)
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(CurrentRow)).val(OwnerCode)
        $('#tblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).val(SLAC)
        $('#_temptblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).val(SLAC)
        if (IsCMS == 1)
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']:eq(1)').attr("checked", 1);
        else
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']:eq(0)').attr("checked", 1);


        $('#tblDimensionULDTab_Delete_' + parseInt(PreviousRow)).attr("style", "display:none;");
        $('#tblDimensionULDTab_Delete_' + parseInt(CurrentRow)).attr("style", "display:block;");
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(CurrentRow)).data("kendoAutoComplete").enable(false)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#tblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#_temptblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).attr('disabled', true);
        $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']').attr("disabled", true);
        if (TotalRow == 1) {
            $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(PreviousRow)).data("kendoAutoComplete").enable(false)
            $('#tblDimensionULDTab_ULDNo_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#tblDimensionULDTab_OwnerCode_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#tblDimensionULDTab_SLAC_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#_temptblDimensionULDTab_SLAC_' + parseInt(PreviousRow)).attr('disabled', true);
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(PreviousRow) + ']').attr("disabled", true);
        }
    }
}

function RateTab(id) {
    if (AWBStatusDetails != "Executed")
        $("#btnApplySpotCode").css("display", "none");
    var RateType = "";
    var MarketRate = "";
    var MKTFreight = "";
    var Currency = "";
    var PaymentType = "";
    var RateAirlineMasterSNo = "";
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/RateDetailsTab",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingRefNo: $('#hdnBookingMasterRefNo').val(),
            AWBSNo: currentawbsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var theDiv = document.getElementById("divRateDetailsTab");
            theDiv.innerHTML = "";
            var theDiv1 = document.getElementById("divtblRateTab");
            theDiv1.innerHTML = "";
            var theDiv2 = document.getElementById("divtblTotalAmountTab");
            theDiv2.innerHTML = "";
            var tdColumeSpotCode = "";
            var RateType = "";
            var Rate = "";
            var Freight = "";
            var RateCurrency = "";
            var AgentCurrency = "";
            var PaymentType = "";
            var ReferenceCode = "";
            var ULDRate = "";
            var SpotRate = "";
            var Commissionable = "";
            var RateClassCode = "";
            var AllinRate = "";
            var WeightBreakup = "";
            var DeclaredCarriageValue = "";
            var DeclaredCustomsValue = "";
            var PrepaidWeightCharge = "";
            var PrepaidValuation = "";
            var PrepaidTax = "";
            var PrepaidTotalChargesDueAgent = "";
            var PrepaidTotalChargesDueCarrier = "";
            var PrepaidTotalAmount = "";
            var CollectWeightCharge = "";
            var CollectValuation = "";
            var CollectTax = "";
            var CollectTotalChargesDueAgent = "";
            var CollectTotalChargesDueCarrier = "";
            var CollectTotalAmount = "";
            var table = "<table id='Ratetabtable' validateonsubmit='true'>";
            var table1 = "<table id='Ratetabtable1' validateonsubmit='true'>";
            var table2 = "<table id='Ratetabtable2' validateonsubmit='true'>";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SpotRate.toUpperCase() == "YES")
                        tdColumeSpotCode = "Spot Code :  " + myData.Table0[0].SpotCode + "";
                    RateType = myData.Table0[0].RateTypeName;
                    Rate = myData.Table0[0].MKTRate;
                    Freight = myData.Table0[0].MKTFreight;
                    RateCurrency = myData.Table0[0].RateCurrencyCode;
                    AgentCurrency = myData.Table0[0].AgentCurrencyCode;
                    PaymentType = myData.Table0[0].PaymentType;
                    ReferenceCode = myData.Table0[0].RateRefNo;
                    ULDRate = myData.Table0[0].ULDRating;
                    SpotRate = myData.Table0[0].SpotRate;
                    Commissionable = myData.Table0[0].Commissionable;
                    RateClassCode = myData.Table0[0].RateClassCode;
                    AllinRate = myData.Table0[0].AllINRate;
                    WeightBreakup = myData.Table0[0].WeightBreakupAdvantageYesORNo;
                    DeclaredCarriageValue = myData.Table0[0].DeclaredCarriageValue;
                    DeclaredCustomsValue = myData.Table0[0].DeclaredCustomsValue;
                    if (myData.Table0[0].PaymentType == "Prepaid") {
                        PrepaidWeightCharge = myData.Table0[0].MKTFreight;
                        PrepaidTotalChargesDueCarrier = myData.Table0[0].OtherChargePrepaidDueCarrierTotal;
                        PrepaidTotalChargesDueAgent = myData.Table0[0].OtherChargePrepaidDueAgentTotal;
                        PrepaidTax = myData.Table0[0].TotalTaxAmount;
                        PrepaidValuation = myData.Table0[0].TotalPrepaidValuationsCharges;
                        PrepaidTotalAmount = myData.Table0[0].TotalAmount;
                    }
                    if (myData.Table0[0].PaymentType == "Collect") {
                        CollectWeightCharge = myData.Table0[0].MKTFreight;
                        CollectTotalChargesDueCarrier = myData.Table0[0].OtherChargeCollectDueCarrierTotal;
                        CollectTotalChargesDueAgent = myData.Table0[0].OtherChargeCollectDueAgentTotal;
                        CollectTax = myData.Table0[0].TotalTaxAmount;
                        CollectValuation = myData.Table0[0].TotalCollectValuationsCharges;
                        CollectTotalAmount = myData.Table0[0].TotalAmount;
                    }
                    if (myData.Table0[0].RateShowOnAWBPrint == "1")
                        $("#hdnRateShowOnAWBPrint").val('1');
                    else if (myData.Table0[0].RateShowOnAWBPrint == "2")
                        $("#hdnRateShowOnAWBPrint").val('2');
                    else
                        $("#hdnRateShowOnAWBPrint").val('3');
                }

                //else {
                //    //var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                //    theDiv.innerHTML += "";
                //}

                table += "<table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table += "<tr><td class='ui-widget-header' colspan='7'>Rate Information : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'>Rate Type : " + RateType + "</td><td class='ui-widget-content'>Rate :  " + Rate + "</td><td class='ui-widget-content'>Freight :  " + Freight + "</td><td class='ui-widget-content'>Rate Currency :  " + RateCurrency + "</td><td class='ui-widget-content'>Agent Currency :  " + AgentCurrency + "</td><td class='ui-widget-content'>Payment Type : " + PaymentType + "</td><td class='ui-widget-content'>Reference Code : " + ReferenceCode + "</td></tr>";
                table += "<tr><td class='ui-widget-content'>ULD Rate : " + ULDRate + "</td><td class='ui-widget-content'>Spot Rate :  " + SpotRate + "</td><td class='ui-widget-content'>Commissionable :  " + Commissionable + "</td><td class='ui-widget-content'>Rate Class Code :  " + RateClassCode + "</td><td class='ui-widget-content'>All in Rate :  " + AllinRate + "</td><td class='ui-widget-content'>Weight Break up :  " + WeightBreakup + "</td><td class='ui-widget-content'>" + tdColumeSpotCode + "</td></tr>";
                table += "</tbody></table>";

                table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table += "<tr><td class='ui-widget-header' colspan='3'>Show on AWB Print : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'><input id='chkTactRate' name='chkTactRate' type='checkbox' value='1' onclick='SelectClicked(this);'>Tact Rate</td><td class='ui-widget-content'><input id='chkPubRate' name='chkPubRate' type='checkbox' value='2' onclick='SelectClicked(this);'>Published Rate</td><td class='ui-widget-content'><input id='chkAsAgreed' name='chkAsAgreed' type='checkbox' value='3' onclick='SelectClicked(this);'>As Agreed</td></tr>";
                table += "</tbody></table>";

                table1 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table1 += "<tr><td class='ui-widget-header' colspan='4'>Charge Declarations : </td></tr></thead><tbody class='ui-widget-content'>";
                table1 += "<tr><td class='ui-widget-content'>Currency : <div><input type='hidden' name='Currency' id='Currency' value=''><input type='text' class='' name='Text_Currency' id='Text_Currency' data-valid='required' data-valid-msg='Select Currency' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Charge Code : <div><input type='hidden' name='RateChargeCode' id='RateChargeCode' value=''><input type='text' class='' name='Text_RateChargeCode' id='Text_RateChargeCode' data-valid='required' data-valid-msg='Select Charge Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Weight/Valuation : <div><input type='hidden' name='Valuation' id='Valuation' value=''><input type='text' class='' name='Text_Valuation' id='Text_Valuation' data-valid='required' data-valid-msg='Select Valuation' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Other Charge : <div><input type='hidden' name='OtherCharge' id='OtherCharge' value=''><input type='text' class='' name='Text_OtherCharge' id='Text_OtherCharge' data-valid='required' data-valid-msg='Select Other Charge' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td></tr>";
                table1 += "<tr><td class='ui-widget-content'>Declared Value for Carriage : <div><input type='text' class='' name='DeclaredCarriageValue' id='DeclaredCarriageValue' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='NVD' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Declared Value for Customs : <div><input type='text' class='' name='DeclaredCustomsValue' id='DeclaredCustomsValue' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='NCV' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Insurance :<div><input type='text' class='' name='Insurance' id='Insurance' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='XXX' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Valuation Charge : <div><input type='text' class='' name='ValuationCharge' style='width: 150px;' id='ValuationCharge' controltype='number' maxlength='12' value='' data-role='numerictextbox'></div></td></tr>";
                table1 += "</tbody></table>";

                table1 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table1 += "<tr><td class='ui-widget-header' colspan='5'>CC Charges in Destination Currency : </td></tr></thead><tbody class='ui-widget-content'>";
                table1 += "<tr><td class='ui-widget-content'>Currency Code : <div><input type='hidden' name='CDCCurrencyCode' id='CDCCurrencyCode' value=''><input type='text' data-valid='required' data-valid-msg='Enter Declared Value for Carriage' class='' name='Text_CDCCurrencyCode' id='Text_CDCCurrencyCode' data-valid='required' data-valid-msg='Select Currency Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Conversion Rate : <div><input type='text' class='' name='CDCConversionRate' style='width: 120px;' id='CDCConversionRate' controltype='decimal3' maxlength='12' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Destination Currency Code : <div><input type='hidden' name='CDCDestCurrencyCode' id='CDCDestCurrencyCode' value=''><input type='text' class='' name='Text_CDCDestCurrencyCode' id='Text_CDCDestCurrencyCode' data-valid='required' data-valid-msg='Select Destination Currency Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Charge Amount : <div><input type='text' class='' name='ChargeAmount' style='width: 120px;' id='ChargeAmount' controltype='decimal2' maxlength='12' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Total Charge Amount : <div><input type='text' class='' name='TotalChargeAmount' style='width: 120px;' id='TotalChargeAmount' controltype='decimal2' maxlength='12' value='' data-role='numerictextbox'></div></td></tr>";
                table1 += "</tbody></table>";

                table2 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table2 += "<tr><td class='ui-widget-header' colspan='6'>Prepaid Amount Details : </td></tr></thead><tbody class='ui-widget-content'>";
                table2 += "<tr><td class='ui-widget-content'>Total Weight Charge : " + PrepaidWeightCharge + "</td><td class='ui-widget-content'>Total Due Carrier Charges :  " + PrepaidTotalChargesDueCarrier + "</td><td class='ui-widget-content'>Total Due Agent Charges :  " + PrepaidTotalChargesDueAgent + "</td><td class='ui-widget-content'>Total Tax :  " + PrepaidTax + "</td><td class='ui-widget-content'>Total Valuation :  " + PrepaidValuation + "</td><td class='ui-widget-content'>Total Amount : " + PrepaidTotalAmount + "</td></tr>";
                table2 += "</tbody></table>";

                table2 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table2 += "<tr><td class='ui-widget-header' colspan='6'>Collect Amount Details : </td></tr></thead><tbody class='ui-widget-content'>";
                table2 += "<tr><td class='ui-widget-content'>Total Weight Charge : " + CollectWeightCharge + "</td><td class='ui-widget-content'>Total Due Carrier Charges :  " + CollectTotalChargesDueCarrier + "</td><td class='ui-widget-content'>Total Due Agent Charges :  " + CollectTotalChargesDueAgent + "</td><td class='ui-widget-content'>Total Tax :  " + CollectTax + "</td><td class='ui-widget-content'>Total Valuation :  " + CollectValuation + "</td><td class='ui-widget-content'>Total Amount : " + CollectTotalAmount + "</td></tr>";
                table2 += "</tbody></table>";

                table += "</table></br>";
                table1 += "</table></br>";
                table2 += "</table>";
                theDiv.innerHTML += table;
                theDiv1.innerHTML += table1;
                theDiv2.innerHTML += table2;

                InstantiateControl("DivRateTab");
                //cfi.AutoComplete("Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                //cfi.AutoComplete("ChargeCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                //cfi.AutoComplete("Valuation", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                //cfi.AutoComplete("OtherCharge", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");

                cfi.AutoComplete("Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                cfi.AutoComplete("RateChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", ["AWBChargeCode", "Description"], null, "contains");
                cfi.AutoCompleteByDataSource("Valuation", WeightValuation);
                cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);

                cfi.AutoComplete("CDCCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                cfi.AutoComplete("CDCDestCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
                if ($("#hdnRateShowOnAWBPrint").val() == "1") {
                    $("#chkTactRate").prop("checked", true);
                    $("#chkPubRate").prop("checked", false);
                    $("#chkAsAgreed").prop("checked", false);
                }
                else if ($("#hdnRateShowOnAWBPrint").val() == "2") {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", true);
                    $("#chkAsAgreed").prop("checked", false);
                }
                else if ($("#hdnRateShowOnAWBPrint").val() == "3") {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", false);
                    $("#chkAsAgreed").prop("checked", true);
                }
                else {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", true);
                    $("#chkAsAgreed").prop("checked", false);
                }

                if (myData.Table1.length > 0) {
                    if (myData.Table1[0].CVDCurrencyCode != "")
                        $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDCurrencyCode, myData.Table1[0].CVDCurrencyCode + '-' + myData.Table1[0].CVDCurrencyCodeName);
                    if (myData.Table1[0].CVDChargeCode != "")
                        $("#Text_RateChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDChargeCode, myData.Table1[0].CVDChargeCode + '-' + myData.Table1[0].CVDChargeCodeDescription);
                    if (myData.Table1[0].CVDWeightValuation != "")
                        $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDWeightValuation, myData.Table1[0].CVDWeightValuationDescription);
                    if (myData.Table1[0].CVDOtherCharges != "")
                        $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDOtherCharges, myData.Table1[0].CVDOtherChargesDescription);
                    $("#DeclaredCarriageValue").val(myData.Table1[0].CVDDeclareCarriageValue);
                    $("#DeclaredCustomsValue").val(myData.Table1[0].CVDDeclareCustomValue);
                    $("#Insurance").val(myData.Table1[0].CVDDeclareInsurenceValue);
                    $("#ValuationCharge").val(myData.Table1[0].CVDValuationCharge);
                    $("#_tempValuationCharge").val(myData.Table1[0].CVDValuationCharge);
                    if (myData.Table1[0].CDCCurrencyCode != "")
                        $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CDCCurrencyCode, myData.Table1[0].CDCCurrencyCode + '-' + myData.Table1[0].CDCCurrencyCodeName);
                    $("#CDCConversionRate").val(myData.Table1[0].CDCCurrencyConversionRate);
                    $("#_tempCDCConversionRate").val(myData.Table1[0].CDCCurrencyConversionRate);
                    if (myData.Table1[0].CDCDestinationCurrencyCode != "")
                        $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CDCDestinationCurrencyCode, myData.Table1[0].CDCDestinationCurrencyCode + '-' + myData.Table1[0].CDCDestinationCurrencyCodeName);
                    $("#ChargeAmount").val(myData.Table1[0].CDCChargeAmount);
                    $("#_tempChargeAmount").val(myData.Table1[0].CDCChargeAmount);
                    $("#TotalChargeAmount").val(myData.Table1[0].CDCTotalChargeAmount);
                    $("#_tempTotalChargeAmount").val(myData.Table1[0].CDCTotalChargeAmount);
                }
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });

    var dbTableName = 'DueCarrierOtherChargeTab';
    var pageType = 'View';
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: (currentawbsno == "" ? 0 : parseFloat(currentawbsno)), sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Carrier Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'OtherChargeCode', display: 'Charge Code', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });

    var dbTableName = 'AgentOtherChargeTab';
    var pageType = $('#hdnPageType').val();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: (currentawbsno == "" ? 0 : parseFloat(currentawbsno)), sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Agent Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'Type', display: 'Type', type: 'select', ctrlOptions: { '1': 'PREPAID' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' } },
            { name: 'OtherChargeCode', display: 'Charge Code', type: 'text', value: '', ctrlAttr: { maxlength: 2, controltype: 'uppercase' }, ctrlCss: { width: '100px' }, isRequired: true },
            { name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '200px' } },
            { name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        OnUpdateSuccess: function () {
            $("tr[id^='tblAgentOtherChargeTab_Row']").each(function (row, tr) {
                $(tr).find("select[id^='tblAgentOtherChargeTab_Type_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_OtherchargeDetail_']").attr("disabled", true);
                $(tr).find("input[id^='_temptblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
                //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("disabled", true);
                $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");
            });
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },
    });

    $("tr[id^='tblAgentOtherChargeTab_Row']").each(function (row, tr) {
        $(tr).find("select[id^='tblAgentOtherChargeTab_Type_']").attr("disabled", true);
        $(tr).find("input[id^='tblAgentOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
        $(tr).find("input[id^='tblAgentOtherChargeTab_OtherchargeDetail_']").attr("disabled", true);
        $(tr).find("input[id^='_temptblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
        $(tr).find("input[id^='tblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
        //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("disabled", true);
        $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");
    });

    var dbTableName = 'TaxChargeInformationTab';
    var pageType = 'View';
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,TaxCode,TaxValue',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: (currentawbsno == "" ? 0 : parseFloat(currentawbsno)), sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Tax Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'TaxCode', display: 'Tax Code', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxName', display: 'Tax Name', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxType', display: 'Tax Type', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxApplicable', display: 'Tax Applicable', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxRate', display: 'Tax Rate', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            //{ name: 'TotalTaxAmount', display: 'Total Tax Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxAmount', display: 'Tax Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });
    if (AWBStatusDetails == "Accepted")
        $("#btnSaveRateData").css("display", "none");
}
function SelectClicked(obj) {
    $(obj).closest("tr").find("input[type='checkbox']").attr("Checked", false);
    var messgae = "";
    var Flag = true;
    //if (($(obj).attr("id") == "chkTactRate") && (parseFloat($("#txtTactRate").val() || 0) == 0)) {
    //    messgae = "Kindly click on Get Rate to fetch relevant rate.";
    //    Flag = false;
    //} else if (($(obj).attr("id") == "chkPubRate") && (parseFloat($("#txtPublishRate").val() || 0) == 0)) {
    //    messgae = "Kindly click on Get Rate to fetch relevant rate.";
    //    Flag = false;
    //} else if (($(obj).attr("id") == "chkUserRate") && (parseFloat($("#txtUserRate").val() || 0) == 0)) {
    //    messgae = "Kindly enter charge rate before selection for AWB print.";
    //    Flag = false;
    //}
    //if (Flag == false) {
    //    jAlert(messgae, "Warning - Rate");
    //    $("#chkAsAgreed").prop("checked", true);
    //    return false;
    //}
    //$(obj).attr("Checked", true);

    if (($(obj).attr("id") == "chkTactRate")) {
        $("#hdnRateShowOnAWBPrint").val('1');
    } else if (($(obj).attr("id") == "chkPubRate")) {
        $("#hdnRateShowOnAWBPrint").val('2');
    } else if (($(obj).attr("id") == "chkAsAgreed")) {
        $("#hdnRateShowOnAWBPrint").val('3');
    }
    $(obj).attr("Checked", true);
}

function CustomsTab() {
    if ($("#hdnHandlingInformation").val() != "") {
        var resultHandlingInformation = $("#hdnHandlingInformation").val();
        $("#HandlingInformation").val(resultHandlingInformation);
    }

    $("#HandlingInformation").unbind("blur").bind("blur", function () {
        var HandlingInformation = $("#HandlingInformation").val();
        $("#hdnHandlingInformation").val(HandlingInformation);
    });

    var dbTableName = 'CustomsOtherInformationTab';
    var pageType = AWBStatusDetails == "Accepted" ? 'View' : $('#hdnPageType').val();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,OSI',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: (currentawbsno == "" ? 0 : parseFloat(currentawbsno)), sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Other Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'OSI', display: 'OSI', type: 'text', value: '', ctrlAttr: { maxlength: 65, controltype: 'alphanumericupper' }, ctrlCss: { width: '500px' }, isRequired: true },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            HideOCIAppend();
        },
        afterRowRemoved: function (caller, rowIndex) {
            HideOCIAppend();
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });
    var RowCount = 0;
    $("tr[id^='tblCustomsOtherInformationTab_Row']").each(function (row, tr) {
        RowCount = parseInt(RowCount) + parseInt(1);
    });
    if (RowCount >= 3) {
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:none;");
    }
    HideOCIAppend();
    var dbTableName = 'CustomsOCIInformationTab';
    var pageType = AWBStatusDetails == "Accepted" ? 'View' : $('#hdnPageType').val();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: (currentawbsno == "" ? 0 : parseFloat(currentawbsno)), sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Agent Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'CountryCode', display: 'Country Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, tableName: 'Country', textColumn: 'CountryCode', keyColumn: 'SNo', templateColumn: ["CountryCode", "CountryName"] },
            { name: 'InfoType', display: 'Information Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, tableName: 'InformationTypeOCI', textColumn: 'InformationCode', keyColumn: 'SNo', templateColumn: ["InformationCode", "Description"] },
            { name: 'CSControlInfoIdentifire', display: 'Customs, Security', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, tableName: 'CustomsOCI', textColumn: 'CustomsCode', keyColumn: 'SNo', templateColumn: ["CustomsCode", "Description"] },
            { name: 'SCSControlInfoIdentifire', display: 'Supplementary Customs', type: 'text', value: '', ctrlAttr: { maxlength: 100, controltype: 'alphanumericupper' }, ctrlCss: { width: '200px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },
    });
}
function HideOCIAppend() {
    var RowCount = 0;
    $("tr[id^='tblCustomsOtherInformationTab_Row']").each(function (row, tr) {
        RowCount = parseInt(RowCount) + parseInt(1);
    });
    if (RowCount >= 3)
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:none;");
    else
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:block;");
}

function checkSHCSnoExist(groupSno, Sno) {
    var retval;
    for (var i = 0; i < groupSno.split(',').length ; i++) {
        if (groupSno.split(',')[i] == Sno) {
            retval = 1;
            return retval;
        }
        else { retval = 0; }
    }
    return retval;
}
function BindSHCGroup(valueId, value, keyId, key) {
    var GroupName = value.split(',')[0];
    var GroupSNo = key;
    var shcVal = ($('#SPHCSNo').val());
    var shcText = ($('#Text_SPHCSNo').val());

    if (GroupName != '') {
        $.ajax({
            type: "POST",
            url: "./Services/Reservation/ViewUpdateDoorOpenService.svc/GetSHCGroupDetail?GroupName=" + GroupName + "&GroupSNo=" + GroupSNo,
            //data: { data: 1 },
            dataType: "json",
            success: function (data) {
                if (data != null && data != '') {
                    var ExistGroupVal = $('#divMultiSPHCSNo').find('ul')[0].innerHTML;
                    $('#Text_SPHCSNo')[0].defaultValue = '';
                    $('#Text_SPHCSNo')[0].Value = '';
                    $('#Text_SPHCSNo').val('');

                    var i = 0;

                    var strDivdata = '';

                    if (shcVal.split(',').length > 0) {
                        while (i < shcVal.split(',').length) {
                            if (shcVal.split(',')[i] != '')
                                if (shcText.split(',')[i] != GroupName && shcText.split(',')[i] != '') {
                                    strDivdata += ("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + shcText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + shcVal.split(',')[i] + "'></span></li>");
                                }
                            i++;
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        if (shcVal == GroupSNo) { shcVal = ''; }
                        //if (ExistGroupVal.indexOf(data[i].SNo) == -1) {
                        var checkexixtval = checkSHCSnoExist($('#Multi_SPHCSNo').val(), data[i].SNo);
                        if (checkexixtval == 0) {
                            shcVal += "," + data[i].SNo;
                            shcText += "," + data[i].Code;
                            strDivdata += ("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + data[i].Code + "</span><span class='k-icon k-delete' id='" + data[i].SNo + "'></span></li>");
                        }
                    }

                    //    if (shcVal != '') {
                    $('#divMultiSPHCSNo').find('ul').append(strDivdata);

                    if (ExistGroupVal.indexOf(GroupName) == -1) {
                        $('#Multi_SPHCSNo').val($('#Multi_SPHCSNo').val() + ',' + shcVal);
                        $('#FieldKeyValuesSPHCSNo')[0].innerHTML = $('#FieldKeyValuesSPHCSNo')[0].innerHTML + ',' + shcVal;
                        $('#SPHCSNo').val($('#SPHCSNo').val() + ',' + shcVal);


                    } else {
                        $('#Multi_SPHCSNo').val(removeLastComma($('#Multi_SPHCSNo').val()) + ',' + shcVal);
                        $('#FieldKeyValuesSPHCSNo')[0].innerHTML = removeLastComma($('#FieldKeyValuesSPHCSNo')[0].innerHTML) + ',' + shcVal;
                        $('#SPHCSNo').val(removeLastComma($('#SPHCSNo').val()) + ',' + shcVal);

                    }

                    // }
                    $("#divMultiSPHCSNo ul li:contains('" + GroupName + "')").remove();
                }
            }
            //ViewUpdateDoorOpen();
            //divThroughputRuleProperties.innerHTML = code;
            //}
        });

    }


}

function GetItineraryCarrierCode(e) {
    var AWBCode = "";
    if (e != "Text_AWBCode") {
        AWBCode = e;
    }
    else {
        AWBCode = $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
    }
    if (AWBCode != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetItineraryCarrierCode",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBCode: AWBCode
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CarrierCode, myData.Table0[0].CarrierCode);
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function CheckFlightNoLength() {
    if ($("#ItineraryInterlineFlightNo").val() != "") {
        if ($("#ItineraryInterlineFlightNo").val().length < 4) {
            if ($("#ItineraryInterlineFlightNo").val().length == 1) {
                $("#ItineraryInterlineFlightNo").val('000' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('000' + $("#ItineraryInterlineFlightNo").val());
            }
            else if ($("#ItineraryInterlineFlightNo").val().length == 2) {
                $("#ItineraryInterlineFlightNo").val('00' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('00' + $("#ItineraryInterlineFlightNo").val());
            }
            else {
                $("#ItineraryInterlineFlightNo").val('0' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('0' + $("#ItineraryInterlineFlightNo").val());
            }
        }
    }
}
function IsItineraryCarrierCodeInterline() {
    if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/IsItineraryCarrierCodeInterline",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ItineraryCarrierCode: $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == "1") {
                            $("#tdItineraryFlightNo").css("display", "none");
                            $("#tdItineraryInterlineFlightNo").css("display", "block");
                            $("#Text_ItineraryFlightNo").data("kendoAutoComplete").setDefaultValue("", "");
                            $("#hdnIsItineraryCarrierCodeInterline").val("1");
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            thedivFlightSearchResult.innerHTML = "";
                        }
                        else {
                            $("#tdItineraryFlightNo").css("display", "block");
                            $("#tdItineraryInterlineFlightNo").css("display", "none");
                            $("#ItineraryInterlineFlightNo").val('');
                            //$("#_tempItineraryInterlineFlightNo").val('');
                            $("#hdnIsItineraryCarrierCodeInterline").val("0");
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            thedivFlightSearchResult.innerHTML = "";
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function BindULDAutoComplete(elem, mainElem) {
    // debugger;
    var NewULDSPHCId = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("id");
    $(elem).find("input[id^='ULDSPHCCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SetRequired, "contains", ",", null, null, null, null, true, null
                , true);
        }
        $(this).css("width", "120px");

    });
    $(elem).find("input[id^='ContourCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "ContourCode", "vw_GetSLIContourCodes", "SNO", "ContourCode", ["ContourCode"], GetContour, "contains", null, null, null, null, null, true, null
                , true);
        }
        //$(this).css("width", "100px");

    });


    var getName = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("name");

    //$("#" + NewULDSPHCId + " li").remove();
    $("div[name=" + getName + "][id=" + NewULDSPHCId + "]").remove();


    //$(elem).find("input[id^='ULDPackingTypeSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
    //});

    $(elem).find("input[id^='Unit']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode"], ResetLWH, "contains");
        $(elem).find("input[id^='Text_ULDSPHCCode']").each(function () {
            $(this).css("width", "120px");
        });

        $(elem).find("input[id^='Text_Unit']").each(function () {
            $(this).val("CMT");
            $(this).css("width", "50px");
        });
        $(elem).find("input[id^='Unit']").each(function () {
            $(this).val("2");
        });
    });
    $(elem).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
        fn_RemoveULDRow(this);
    });
    //$(elem).find("input[id^='ULDNoSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    //});
    $(elem).find("input[id^='ULDTypeSNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ULDName", "V_ULD_Reservation", "SNo", "ULDName", ["ULDName"], CheckBULKULDType, "contains");
        $(this).css("width", "60px");

    });
    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });

    //$(elem).find("input[id^=ULDNo]").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this); 
    //});

    $(elem).find("input[id^='ULDNo']").keydown(function (e) {
        IsNumericNewCheck(e);
    });

    $(elem).find("input[id^='SLACPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^='UldPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDLength]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDWidth]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDHeight]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).prev().find("td:last div").append($(elem).prev().prev().find(".icon-trans-plus-sign").clone(true));
    $(elem).find("td[id^='tdSNoCol']").text(parseInt($(elem).prev().find("td[id^='tdSNoCol']").text()) + 1);
    $(elem).find("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
        GetULDDetails(this);
    });
    $(elem).find("a[id^='ahref_ULDGetWeight']").unbind("click").bind("click", function () {
        GetWeigingWeight(this);
    });
    $(elem).find("a[id^='ahref_Equipment']").unbind("click").bind("click", function () {
        Getequipment(this);
    });
    //if ($(elem).find("a[id^=hUldInfo]").val() == undefined) {
    //    var ULDNo = $(elem).find("input[id^='Text_ULDTypeSNo']").val() + $(elem).find("input[id^='ULDNo']").val() + $(elem).find("input[id^='OwnerCode']").val();
    //    $(elem).find("input[id^='UGrossWeight']").after("<a href='#' style='padding-left:5px;' id='hUldInfo' onclick=GetULDDetails('" + ULDNo + "')>ULD Info</a> ");
    //    }
    //if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").length == 1) {
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").each(function () {
    //        $(this).css("display", "none");
    //    });
    //}
    //else {
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").last().find("a[id^='ahref_ULDGetWeight']").css("display", "");
    //    //$(this)
    //}
    //$(elem).find("a[id^='ahref_ULDGetWeight']").css("display", "");
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").last().find("a[id^='ahref_ULDGetWeight']").css("display", "");

    CalculateULDVolume();
    //fn_RemoveRequired();
}
function IsBUPCheckOrNot() {
    //var Pieces = ($("#AWBPieces").val() == "" ? "" : parseFloat($("#AWBPieces").val()));
    if ($("#chkIsBUP").prop('checked') == true) {
        $("#tdAWBNoofBUP").css("display", "block");
        $("#AWBNoofBUP").attr("data-valid", "min[1],required");
        //$("#AWBNoofBUP").val(Pieces);
        //$("#_tempAWBNoofBUP").val(Pieces);
    }
    else {
        $("#AWBNoofBUP").val('');
        $("#_tempAWBNoofBUP").val('');
        $("#tdAWBNoofBUP").css("display", "none");
        $("#AWBNoofBUP").removeAttr("data-valid");
        $("#_tempAWBNoofBUP").removeAttr("class");
        $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");
    }
}
function PageLoaded(Action, ProcessName) {
    cfi.AutoComplete("AWBCode", "AirlineCode", "Airline", "AirlineCode", "AirlineCode", ["AirlineCode"], GetItineraryCarrierCode, "contains");
    cfi.AutoComplete("Product", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    var ChargeCodeSource = [{ Key: "1", Text: "PP" }, { Key: "2", Text: "CC" }];
    cfi.AutoCompleteByDataSource("ChargeCode", ChargeCodeSource);
    cfi.AutoComplete("AWBOrigin", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], SelectedAWBOriginDestination, "contains");
    cfi.AutoComplete("AWBOrigin1", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("AWBDestination", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], SelectedAWBOriginDestination, "contains");
    cfi.AutoComplete("AWBOffice", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("AWBAgent", "Name", "vAccountForAgent_Reservation", "SNo", "Name", ["Name"], CheckValidAWBNumber, "contains");

    var UMSource = [{ Key: "0", Text: "K" }];
    //var AllocationCodeSource = [{ Key: "0", Text: "NA" }, { Key: "1", Text: "NN" }];
    cfi.AutoCompleteByDataSource("UM", UMSource);
    cfi.AutoComplete("Priority", "Code,PriorityName", "Priority", "SNo", "Code", ["Code", "PriorityName"], null, "contains");
    //cfi.AutoComplete("Commodity", "CommodityCode,CommodityDescription", "Commodity", "CommodityCode", "CommodityDescription", ["CommodityCode", "CommodityDescription"], null, "contains");
    //cfi.AutoComplete("Commodity", "CommodityCode", "vw_Commodity_CommoditySubGroup", "CommoditySNo", "CommodityCode", ["CommodityCode"], FillCommoditySHC, "contains");
    cfi.AutoComplete("Commodity", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], FillCommoditySHC, "contains");
    //cfi.AutoComplete("SHC", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains", ",");
    cfi.AutoComplete("SHC", "CODE,Description", "SPHC", "SNO", "CODE@", ["CODE", "Description"], null, "contains", ",", null, null, null, SHCDetails, true);
    cfi.AutoComplete("ItineraryOrigin", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], CheckPiecesOnOD, "contains");
    cfi.AutoComplete("ItineraryDestination", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], CheckPiecesOnOD, "contains");
    cfi.AutoComplete("ItineraryCarrierCode", "CarrierCode", "Airline", "CarrierCode", "CarrierCode", ["CarrierCode"], IsItineraryCarrierCodeInterline, "contains");
    cfi.AutoComplete("ItineraryFlightNo", "FlightNo", "v_DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    cfi.DateType("ItineraryDate", true);
    //cfi.AutoCompleteByDataSource("ItineraryAllocationCode", AllocationCodeSource);
    //cfi.AutoComplete("ItineraryAllocationCode", "CityCode,CityName", "ShipmentStatus", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("ItineraryTransit", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    //$("#Text_ItineraryTransit").data("kendoAutoComplete").enable(false)


    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    //cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "City", "CountrySNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    //cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "City", "CountrySNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liCustoms'));

    $("#AWBNumber").unbind("blur").bind("blur", function () {
        if (Action == "NEW")
            CheckValidAWBNumber();
    });
    $("#AWBPieces").unbind("blur").bind("blur", function () {
        CalculatedPieces();
    });
    $("#AWBNoofBUP").unbind("blur").bind("blur", function () {
        CalculatedBUPPieces();
    });
    $("#AWBChargeableWeight").unbind("blur").bind("blur", function () {
        compareGrossVolValue();
    });
    $("#AWBGrossWeight").unbind("blur").bind("blur", function () {
        CalculateGrossVolumeWeight(this);
    });
    $("#AWBCBM").unbind("blur").bind("blur", function () {
        CalculateShipmentChWt(this);
    });
    $("#AWBVolumeWeight").unbind("blur").bind("blur", function () {
        CalculateShipmentCBM();
    });
    $("#ItineraryPieces").unbind("blur").bind("blur", function () {
        ItineraryPieces();
    });
    $("#ItineraryGrossWeight").unbind("blur").bind("blur", function () {
        ItineraryGrossWeight();
    });
    $("#ItineraryVolumeWeight").unbind("blur").bind("blur", function () {
        ItineraryVolumeWeight();
    });
    $("div[id^='divMultiSHC']").css("overflow", "auto");
    $("div[id^='divMultiSHC']").css("width", "15em");
    $("#btnNew").css("display", "none");
    $("#tdItineraryInterlineFlightNo").css("display", "none");
    if (userContext.AgentSNo > 0 || userContext.OfficeSNo > 0) {
        $("#tdBCT").css("display", "none");
        $("#tdMCT").css("display", "none");
    }
    if (Action == "NEW" || Action == "COPY") {
        $("#btnAWBPrint").css("display", "none");
        $("#btnAWBLabel").css("display", "none");
        $("#btnSave").css("display", "block");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#tdAWBNoofBUP").css("display", "none");
        $('#AWBNumber').attr('disabled', true);
        $('#_tempAWBNumber').attr('disabled', true);
        $("#Text_UM").data("kendoAutoComplete").setDefaultValue("0", "K");
        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
        if (userContext.GroupName == "POS") {
            $('input[type=radio][name=BookingType]').attr('disabled', true);
            $('input[type=radio][name=AWBStock]').attr('disabled', true);
            $("#Text_ChargeCode").data("kendoAutoComplete").enable(false);
            $("#Text_AWBCode").data("kendoAutoComplete").enable(false);
            $("#NoofHouse").attr('disabled', true);
            $("#_tempNoofHouse").attr('disabled', true);
            $("#chkIsBUP").attr('disabled', true);
        }
        if (Action == "NEW") {
            $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
            SelectedAWBOriginDestination('Text_AWBOrigin');
        }
        if (userContext.AgentSNo > 0) {
            $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
            $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
            $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
            $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
            if (Action == "NEW")
                AutoStockAgentOrNot();
        }
        if (Action == "NEW") {
            if (userContext.AirlineName != null && userContext.AirlineName != "") {
                if (userContext.AirlineName.length > 6) {
                    $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(userContext.AirlineName.split('-')[0], userContext.AirlineName.split('-')[0]);
                    GetItineraryCarrierCode(userContext.AirlineName.split('-')[0]);
                }
            }
            GETProductASPerBookingType('0', userContext.GroupName);
        }
    }
    else if (Action == "UPDATE") {
        $("#lblBookingRefNo").text($("#hdnBookingMasterRefNo").val());
        $("#btnSave").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#btnUpdate").css("display", "block");
        $("#btnCopyBooking").css("display", "block");
        $("#btnUpdate").unbind("click").bind("click", function () {
            if (UpdateData(ProcessName)) {
                ShipmentSearch();
                CleanUI();
            }
        });
        $("#btnCopyBooking").unbind("click").bind("click", function () {
            CopyBooking();
        });
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetCompleteReservationData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBReferenceBookingSNo: $("#hdnBookingSNo").val(),
                BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var shipperData = myData.Table1;
                    var consigneeData = myData.Table2;
                    var Itinerary = myData.Table3;

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].BookingType == "1")
                            $("#Text_Product").data("kendoAutoComplete").enable(false);
                        $('input[name=BookingType][value=' + myData.Table0[0].BookingType + ']').attr('checked', true);
                        $('input[name=AWBStock][value=' + myData.Table0[0].AWBStock + ']').attr('checked', true);
                        $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AWBPrefix, myData.Table0[0].AWBPrefix);
                        $("#AWBNumber").val(myData.Table0[0].AWBNo);
                        $("#_tempAWBNumber").val(myData.Table0[0].AWBNo);
                        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PaymentType, myData.Table0[0].PaymentType == 1 ? 'PP' : 'CC');
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].ProductSNo, myData.Table0[0].ProductName);
                        $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].OriginCitySNo, myData.Table0[0].OriginCityCode + '-' + myData.Table0[0].OriginCityName);
                        $("#Text_AWBDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].DestinationCitySNo, myData.Table0[0].DestinationCityCode + '-' + myData.Table0[0].DestinationCityName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo, myData.Table0[0].Text_AccountSNo);
                        $("#Text_UM").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].GrossUnit == 'False' ? 0 : 1, myData.Table0[0].GrossUnit == 'False' ? 'K' : 'L');
                        if (myData.Table0[0].PrioritySNo != "" && myData.Table0[0].PrioritySNo != "0")
                            $("#Text_Priority").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PrioritySNo, myData.Table0[0].PriorityCode + '-' + myData.Table0[0].PriorityName);
                        $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CommoditySNo, myData.Table0[0].CommodityCode + '-' + myData.Table0[0].CommodityDescription);
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC)
                        $("#SHC").val(myData.Table0[0].SHC);
                        $("#NatureOfGoods").val(myData.Table0[0].NatureOfGoods);
                        $("#NoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#_tempNoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#AWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#_tempAWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#AWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#_tempAWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#AWBCBM").val(myData.Table0[0].Volume);
                        $("#_tempAWBCBM").val(myData.Table0[0].Volume);
                        $("#AWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#_tempAWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#hdnHandlingInformation").val(myData.Table0[0].HandlingInformation);
                        if (myData.Table0[0].IsBUP == "True") {
                            $("#chkIsBUP").prop('checked', true);
                            //$("#tdAWBNoofBUP").css("display", "none");
                            $("#tdAWBNoofBUP").css("display", "block");
                            $("#AWBNoofBUP").attr("data-valid", "min[1],required");
                            $("#AWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                            $("#_tempAWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);

                            if (myData.Table0[0].BookingRefULDDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        else {
                            $("#AWBNoofBUP").val('');
                            $("#_tempAWBNoofBUP").val('');
                            $("#tdAWBNoofBUP").css("display", "none");
                            $("#AWBNoofBUP").removeAttr("data-valid");
                            $("#_tempAWBNoofBUP").removeAttr("class");
                            $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");

                            if (myData.Table0[0].BookingRefDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        if (myData.Table0[0].IsRoutingComplete == "True") {
                            $("#chkIsRoutingComplete").prop('checked', true);
                        }

                        var theDiv = document.getElementById("divUserDetails");
                        theDiv.innerHTML = "";
                        var table = "";
                        //table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='2'>User Action Information</td></tr>";
                        //table += "<tr><td style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr></table>";
                        table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr></table>";
                        theDiv.innerHTML = table;
                    }
                    if (shipperData.length > 0) {
                        $("#hdnShipperSNo").val(shipperData[0].SNo);
                        $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                        if (shipperData[0].ShipperAccountNo != "") {
                            $("#chkSHIPPER_AccountNo").closest('td').hide();
                            $("#chkShipper").attr('disabled', true);
                            $("#chkShipper").removeAttr("title");
                        }
                        $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                        $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                        $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity == "" ? "" : shipperData[0].ShipperCity, shipperData[0].ShipperCity == "" ? "" : shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                        $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#_tempSHipper_Fax").val(shipperData[0].Fax);
                    }
                    if (consigneeData.length > 0) {
                        $("#hdnConsigneeSNo").val(consigneeData[0].SNo);
                        $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                        if (consigneeData[0].ConsigneeAccountNo != "") {
                            $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            $("#chkconsignee").attr('disabled', true);
                            $("#chkconsignee").removeAttr("title");
                        }
                        $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                        $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                        $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                        $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
                    }
                    if (Itinerary.length > 0) {
                        for (var i = 0; i < Itinerary.length; i++) {
                            var SoftEmbargo = "0";
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportSNo, Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportCode + '-' + Itinerary[i].OriginAirportName);
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportSNo, Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportCode + '-' + Itinerary[i].DestinationAirportName);
                            $("#ItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#_tempItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#ItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#_tempItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#ItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#_tempItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            if (Itinerary[i].IsSoftEmbargoApply == "True")
                                SoftEmbargo = "1"
                            SelectdRoute(Itinerary[i].DailyFlightSno, 'SearchFlight', 'UPDATE', Itinerary[i].AllotmentSNo, Itinerary[i].AllotementCode, '0', Itinerary[i].RouteStatus, Itinerary[i].Status, SoftEmbargo);
                        }

                    }
                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                        $('#AWBNumber').removeAttr("disabled");
                    } else if ($('input:radio[name=AWBStock]:checked').val() === '1') {
                        $('#AWBNumber').attr('disabled', true);
                    }
                    if (AWBStatusNo > 5) {
                        var table44 = document.getElementById("tblSelectdRouteResult");
                        if (table44 != null && table.rows.length > 1) {
                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                $(tr).find("button[id^='Delete_']").css("display", "none");
                            });
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        if (AWBStatusDetails != "Executed") {
            $("#btnAWBPrint").css("display", "none");
            $("#btnAWBLabel").css("display", "none");
        }
    }
    else if (Action == "EXECUTE") {
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").enable($('#liCustoms'));
        ApplyRequired();
        $("#lblBookingRefNo").text($("#hdnBookingMasterRefNo").val());
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "block");
        $("#btnExecute").css("display", "block");
        $("#btnExecute").unbind("click").bind("click", function () {
            if (ExecuteData(ProcessName)) {
                ShipmentSearch();
                CleanUI();
            }
        });
        $("#btnCopyBooking").unbind("click").bind("click", function () {
            CopyBooking();
        });
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetCompleteReservationData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBReferenceBookingSNo: $("#hdnBookingSNo").val(),
                BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var shipperData = myData.Table1;
                    var consigneeData = myData.Table2;
                    var Itinerary = myData.Table3;

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].BookingType == "1")
                            $("#Text_Product").data("kendoAutoComplete").enable(false);
                        $('input[name=BookingType][value=' + myData.Table0[0].BookingType + ']').attr('checked', true);
                        $('input[name=AWBStock][value=' + myData.Table0[0].AWBStock + ']').attr('checked', true);
                        $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AWBPrefix, myData.Table0[0].AWBPrefix);
                        $("#AWBNumber").val(myData.Table0[0].AWBNo);
                        $("#_tempAWBNumber").val(myData.Table0[0].AWBNo);
                        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PaymentType, myData.Table0[0].PaymentType == 1 ? 'PP' : 'CC');
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].ProductSNo, myData.Table0[0].ProductName);
                        $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].OriginCitySNo, myData.Table0[0].OriginCityCode + '-' + myData.Table0[0].OriginCityName);
                        $("#Text_AWBDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].DestinationCitySNo, myData.Table0[0].DestinationCityCode + '-' + myData.Table0[0].DestinationCityName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo, myData.Table0[0].Text_AccountSNo);
                        $("#Text_UM").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].GrossUnit == 'False' ? 0 : 1, myData.Table0[0].GrossUnit == 'False' ? 'K' : 'L');
                        if (myData.Table0[0].PrioritySNo != "" && myData.Table0[0].PrioritySNo != "0")
                            $("#Text_Priority").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PrioritySNo, myData.Table0[0].PriorityCode + '-' + myData.Table0[0].PriorityName);
                        $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CommoditySNo, myData.Table0[0].CommodityCode + '-' + myData.Table0[0].CommodityDescription);
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC)
                        $("#SHC").val(myData.Table0[0].SHC);
                        $("#NatureOfGoods").val(myData.Table0[0].NatureOfGoods);
                        $("#NoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#_tempNoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#AWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#_tempAWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#AWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#_tempAWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#AWBCBM").val(myData.Table0[0].Volume);
                        $("#_tempAWBCBM").val(myData.Table0[0].Volume);
                        $("#AWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#_tempAWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#hdnHandlingInformation").val(myData.Table0[0].HandlingInformation);
                        if (myData.Table0[0].IsBUP == "True") {
                            $("#chkIsBUP").prop('checked', true);
                            //$("#tdAWBNoofBUP").css("display", "none");
                            $("#tdAWBNoofBUP").css("display", "block");
                            $("#AWBNoofBUP").attr("data-valid", "min[1],required");
                            $("#AWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                            $("#_tempAWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                            if (myData.Table0[0].BookingRefULDDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        else {
                            $("#AWBNoofBUP").val('');
                            $("#_tempAWBNoofBUP").val('');
                            $("#tdAWBNoofBUP").css("display", "none");
                            $("#AWBNoofBUP").removeAttr("data-valid");
                            $("#_tempAWBNoofBUP").removeAttr("class");
                            $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");
                            if (myData.Table0[0].BookingRefDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        if (myData.Table0[0].IsRoutingComplete == "True") {
                            $("#chkIsRoutingComplete").prop('checked', true);
                        }
                        var theDiv = document.getElementById("divUserDetails");
                        theDiv.innerHTML = "";
                        var table = "";
                        table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr><tr><td class='formSection' style='text-align: left;'>Executed By : " + myData.Table0[0].ExecutedUser + "</td><td class='formSection' style='text-align: right;'>RE Executed By : " + myData.Table0[0].ReExecutedUser + "</td></tr></table>";
                        theDiv.innerHTML = table;
                    }
                    if (shipperData.length > 0) {
                        $("#hdnShipperSNo").val(shipperData[0].SNo);
                        $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                        if (shipperData[0].ShipperAccountNo != "") {
                            $("#chkSHIPPER_AccountNo").closest('td').hide();
                            $("#chkShipper").attr('disabled', true);
                            $("#chkShipper").removeAttr("title");
                        }
                        $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                        $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                        $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity == "" ? "" : shipperData[0].ShipperCity, shipperData[0].ShipperCity == "" ? "" : shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                        $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#_tempSHipper_Fax").val(shipperData[0].Fax);
                    }
                    if (consigneeData.length > 0) {
                        $("#hdnConsigneeSNo").val(consigneeData[0].SNo);
                        $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                        if (consigneeData[0].ConsigneeAccountNo != "") {
                            $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            $("#chkconsignee").attr('disabled', true);
                            $("#chkconsignee").removeAttr("title");
                        }
                        $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                        $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                        $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                        $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
                    }
                    if (Itinerary.length > 0) {
                        for (var i = 0; i < Itinerary.length; i++) {
                            var SoftEmbargo = "0";
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportSNo, Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportCode + '-' + Itinerary[i].OriginAirportName);
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportSNo, Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportCode + '-' + Itinerary[i].DestinationAirportName);
                            $("#ItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#_tempItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#ItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#_tempItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#ItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#_tempItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            if (Itinerary[i].IsSoftEmbargoApply == "True")
                                SoftEmbargo = "1"
                            SelectdRoute(Itinerary[i].DailyFlightSno, 'SearchFlight', 'UPDATE', Itinerary[i].AllotmentSNo, Itinerary[i].AllotementCode, '0', Itinerary[i].RouteStatus, Itinerary[i].Status, SoftEmbargo);
                        }

                    }
                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                        $('#AWBNumber').removeAttr("disabled");
                    } else if ($('input:radio[name=AWBStock]:checked').val() === '1') {
                        $('#AWBNumber').attr('disabled', true);
                    }
                    if (AWBStatusNo > 5) {
                        var table44 = document.getElementById("tblSelectdRouteResult");
                        if (table44 != null && table44.rows.length > 1) {
                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                $(tr).find("button[id^='Delete_']").css("display", "none");
                            });
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        if (AWBStatusDetails == "Cancel" || AWBStatusDetails == "Booked") {
            $("#btnAWBPrint").css("display", "none");
            $("#btnAWBLabel").css("display", "none");
        }
    }
    if (Action == "COPY") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetCompleteReservationData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBReferenceBookingSNo: $("#hdnBookingSNo").val(),
                BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var shipperData = myData.Table1;
                    var consigneeData = myData.Table2;
                    var Itinerary = myData.Table3;

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].BookingType == "1")
                            $("#Text_Product").data("kendoAutoComplete").enable(false);
                        $('input[name=BookingType][value=' + myData.Table0[0].BookingType + ']').attr('checked', true);
                        $('input[name=AWBStock][value=' + myData.Table0[0].AWBStock + ']').attr('checked', true);
                        $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AWBPrefix, myData.Table0[0].AWBPrefix);
                        $("#AWBNumber").val('');
                        $("#_tempAWBNumber").val('');
                        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PaymentType, myData.Table0[0].PaymentType == 1 ? 'PP' : 'CC');
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].ProductSNo, myData.Table0[0].ProductName);
                        $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].OriginCitySNo, myData.Table0[0].OriginCityCode + '-' + myData.Table0[0].OriginCityName);
                        $("#Text_AWBDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].DestinationCitySNo, myData.Table0[0].DestinationCityCode + '-' + myData.Table0[0].DestinationCityName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo, myData.Table0[0].Text_AccountSNo);
                        $("#Text_UM").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].GrossUnit == 'False' ? 0 : 1, myData.Table0[0].GrossUnit == 'False' ? 'K' : 'L');
                        if (myData.Table0[0].PrioritySNo != "" && myData.Table0[0].PrioritySNo != "0")
                            $("#Text_Priority").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PrioritySNo, myData.Table0[0].PriorityCode + '-' + myData.Table0[0].PriorityName);
                        $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CommoditySNo, myData.Table0[0].CommodityCode + '-' + myData.Table0[0].CommodityDescription);
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC)
                        $("#SHC").val(myData.Table0[0].SHC);
                        $("#NatureOfGoods").val(myData.Table0[0].NatureOfGoods);
                        $("#NoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#_tempNoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#AWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#_tempAWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#AWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#_tempAWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#AWBCBM").val(myData.Table0[0].Volume);
                        $("#_tempAWBCBM").val(myData.Table0[0].Volume);
                        $("#AWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#_tempAWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#hdnHandlingInformation").val(myData.Table0[0].HandlingInformation);
                        if (myData.Table0[0].IsBUP == "True") {
                            $("#chkIsBUP").prop('checked', true);
                            //$("#tdAWBNoofBUP").css("display", "none");
                            $("#tdAWBNoofBUP").css("display", "block");
                            $("#AWBNoofBUP").attr("data-valid", "min[1],required");
                            $("#AWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                            $("#_tempAWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);

                            if (myData.Table0[0].BookingRefULDDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        else {
                            $("#AWBNoofBUP").val('');
                            $("#_tempAWBNoofBUP").val('');
                            $("#tdAWBNoofBUP").css("display", "none");
                            $("#AWBNoofBUP").removeAttr("data-valid");
                            $("#_tempAWBNoofBUP").removeAttr("class");
                            $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");

                            if (myData.Table0[0].BookingRefDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        if (myData.Table0[0].IsRoutingComplete == "True") {
                            $("#chkIsRoutingComplete").prop('checked', true);
                        }

                        var theDiv = document.getElementById("divUserDetails");
                        theDiv.innerHTML = "";
                        //var table = "";
                        //table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr></table>";
                        //theDiv.innerHTML = table;
                    }
                    if (shipperData.length > 0) {
                        $("#hdnShipperSNo").val(shipperData[0].SNo);
                        $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                        if (shipperData[0].ShipperAccountNo != "") {
                            $("#chkSHIPPER_AccountNo").closest('td').hide();
                            $("#chkShipper").attr('disabled', true);
                            $("#chkShipper").removeAttr("title");
                        }
                        $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                        $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                        $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity == "" ? "" : shipperData[0].ShipperCity, shipperData[0].ShipperCity == "" ? "" : shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                        $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#_tempSHipper_Fax").val(shipperData[0].Fax);
                    }
                    if (consigneeData.length > 0) {
                        $("#hdnConsigneeSNo").val(consigneeData[0].SNo);
                        $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                        if (consigneeData[0].ConsigneeAccountNo != "") {
                            $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            $("#chkconsignee").attr('disabled', true);
                            $("#chkconsignee").removeAttr("title");
                        }
                        $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                        $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                        $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                        $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
                    }
                    if (Itinerary.length > 0) {
                        for (var i = 0; i < Itinerary.length; i++) {
                            var SoftEmbargo = "0";
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportSNo, Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportCode + '-' + Itinerary[i].OriginAirportName);
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportSNo, Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportCode + '-' + Itinerary[i].DestinationAirportName);
                            $("#ItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#_tempItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#ItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#_tempItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#ItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#_tempItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            if (Itinerary[i].IsSoftEmbargoApply == "True")
                                SoftEmbargo = "1"
                            SelectdRoute(Itinerary[i].DailyFlightSno, 'SearchFlight', 'COPY', Itinerary[i].AllotmentSNo, Itinerary[i].AllotementCode, '0', Itinerary[i].RouteStatus, Itinerary[i].Status, SoftEmbargo);
                        }

                    }
                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                        $('#AWBNumber').removeAttr("disabled");
                    } else if ($('input:radio[name=AWBStock]:checked').val() === '1') {
                        $('#AWBNumber').attr('disabled', true);
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        $("#hdnPreviousBookingSNo").val($("#hdnBookingSNo").val());
        $("#hdnPreviousBookingMasterRefNo").val($("#hdnBookingMasterRefNo").val());

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GenerateAndGetReferenceNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: { BookingRefNo: 'GenerateAndGetReferenceNumber' },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $("#hdnBookingMasterRefNo").val(myData.Table0[0].ReferenceNumber);
                        $("#hdnBookingSNo").val('');
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/InsertdataCopyBooking",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingMasterRefNo: $("#hdnBookingMasterRefNo").val(),
                PreviousBookingSNo: $("#hdnPreviousBookingSNo").val(),
                PreviousBookingMasterRefNo: $("#hdnPreviousBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        currentawbsno = 0;
        currentawbno = "";
    }
    if (userContext.GroupName == 'POS') {
        $("#Text_Product").data("kendoAutoComplete").enable(false)
    }
    if (AWBStatusNo > 5) {
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");

        $("#AddDimension").css("display", "none");

        $("#ItineraryViewRoute").css("display", "none");
        $("#ItinerarySearch").css("display", "none");
        $("#btnClearItineraryRoute").css("display", "none");
        $("#tblItinerary").css("display", "none");
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("button[id^='Delete_']").css("display", "none");
            });
        }
    }
    if (userContext.AgentSNo > 0 && AWBStatusDetails != "Booked" && AWBStatusDetails != "" && (Action != "NEW" || Action != "COPY")) {
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "block");
        $("#btnExecute").css("display", "none");

        $("#AddDimension").css("display", "none");

        $("#ItineraryViewRoute").css("display", "none");
        $("#ItinerarySearch").css("display", "none");
        $("#btnClearItineraryRoute").css("display", "none");
        $("#tblItinerary").css("display", "none");
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("button[id^='Delete_']").css("display", "none");
            });
        }
    }
}
function ExtraCondition(textId) {

    var MainfiltertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
    var filterAWBAgent = cfi.getFilter("AND");
    var MainfilterOtherNatureofGoods = cfi.getFilter("AND");
    var SPHCDGRFilter = cfi.getFilter("AND");
    var filterShipperCity = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");
    var ItineraryFlightNoFilter = cfi.getFilter("AND");
    var AllotmentFilter = cfi.getFilter("AND");
    var AWBOriginFilter = cfi.getFilter("AND");
    var AWBDestinationFilter = cfi.getFilter("AND");
    var searchOriginCityFilter = cfi.getFilter("AND");
    var searchDestinationCityFilter = cfi.getFilter("AND");
    var ItineraryOriginFilter = cfi.getFilter("AND");
    var ItineraryDestinationFilter = cfi.getFilter("AND");
    var SPHCFilter = cfi.getFilter("AND");
    var filterUnNo = cfi.getFilter("AND");
    var filterSubRisk = cfi.getFilter("AND");
    var filterSLINo = cfi.getFilter("AND");
    var filterPakagingGroup = cfi.getFilter("AND");
    var filterPackingInst = cfi.getFilter("AND");
    var filterErg = cfi.getFilter("AND");
    var SHCSubGrioupFilter = cfi.getFilter("AND");
    var DocTypeFilter = cfi.getFilter("AND");
    var AWBCodeFilter = cfi.getFilter("AND");
    var ItineraryCarrierCodeFilter = cfi.getFilter("AND");

    var FilterAirlineCode = "";
    if (userContext.AirlineName != null && userContext.AirlineName != "") {
        if (userContext.AirlineName.length > 6) {
            FilterAirlineCode = userContext.AirlineName.split('-')[0];
        }
    }
    if (textId.indexOf("tblDimensionULDTab_ULDTypeSNo") >= 0) {
        var filtertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
        cfi.setFilter(filtertblDimensionULDTab_ULDTypeSNo, "AirlineCode", "eq", FilterAirlineCode);
        //for (var i = 0; i <= 10; i++) {
        //    if ($('#tblDimensionULDTab_ULDTypeSNo_' + [i]).val() != undefined && $('#tblDimensionULDTab_ULDTypeSNo_' + [i]).val() != '' && 'tblDimensionULDTab_ULDTypeSNo_' + [i] != 'tblDimensionULDTab_ULDTypeSNo_' + textId.split('_')[2])
        //        cfi.setFilter(filtertblDimensionULDTab_ULDTypeSNo, "SNo", "notin", $('#tblDimensionULDTab_HdnULDTypeSNo_' + [i]).val());
        //}
        MainfiltertblDimensionULDTab_ULDTypeSNo = cfi.autoCompleteFilter(filtertblDimensionULDTab_ULDTypeSNo);
        return MainfiltertblDimensionULDTab_ULDTypeSNo;
    }
    else if (textId.indexOf("Text_ItineraryFlightNo") >= 0) {
        var filter = cfi.getFilter("AND");
        if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "")
            cfi.setFilter(filter, "CarrierCode", "eq", $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key());
        cfi.setFilter(filter, "FlightDate", "eq", $("#ItineraryDate").val());
        cfi.setFilter(filter, "IsCancelled", "eq", "0");
        ItineraryFlightNoFilter = cfi.autoCompleteFilter(filter);
        return ItineraryFlightNoFilter;
    }
    else if (textId.indexOf("Text_AWBCode") >= 0) {
        var filterAWBCode = cfi.getFilter("AND");
        if (userContext.GroupName == "POS")
            cfi.setFilter(filterAWBCode, "IsInterline", "notin", 1);
        AWBCodeFilter = cfi.autoCompleteFilter(filterAWBCode);
        return AWBCodeFilter;
    }
    else if (textId.indexOf("Text_ItineraryCarrierCode") >= 0) {
        var filterItineraryCarrierCode = cfi.getFilter("AND");
        if (userContext.GroupName == "POS")
            cfi.setFilter(filterItineraryCarrierCode, "IsInterline", "notin", 1);
        ItineraryCarrierCodeFilter = cfi.autoCompleteFilter(filterItineraryCarrierCode);
        return ItineraryCarrierCodeFilter;
    }
    else if (textId.indexOf("Text_AWBOrigin") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        AWBOriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return AWBOriginFilter;
    }
    else if (textId.indexOf("Text_AWBDestination") >= 0) {
        var filterAWBDestination = cfi.getFilter("AND");
        cfi.setFilter(filterAWBDestination, "SNo", "notin", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        AWBDestinationFilter = cfi.autoCompleteFilter(filterAWBDestination);
        return AWBDestinationFilter;
    }
    else if (textId.indexOf("Text_ItineraryOrigin") >= 0) {
        var filterItineraryOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterItineraryOrigin, "SNo", "notin", $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
        ItineraryOriginFilter = cfi.autoCompleteFilter(filterItineraryOrigin);
        return ItineraryOriginFilter;
    }
    else if (textId.indexOf("Text_ItineraryDestination") >= 0) {
        var filterItineraryDestination = cfi.getFilter("AND");
        cfi.setFilter(filterItineraryDestination, "SNo", "notin", $("#Text_ItineraryOrigin").data("kendoAutoComplete").key());
        ItineraryDestinationFilter = cfi.autoCompleteFilter(filterItineraryDestination);
        return ItineraryDestinationFilter;
    }
    else if (textId.indexOf("Text_searchOriginCity") >= 0) {
        var filtersearchOriginCity = cfi.getFilter("AND");
        cfi.setFilter(filtersearchOriginCity, "CityCode", "notin", $("#Text_searchDestinationCity").data("kendoAutoComplete").key());
        searchOriginCityFilter = cfi.autoCompleteFilter(filtersearchOriginCity);
        return searchOriginCityFilter;
    }
    else if (textId.indexOf("Text_searchDestinationCity") >= 0) {
        var filtersearchDestinationCity = cfi.getFilter("AND");
        cfi.setFilter(filtersearchDestinationCity, "CityCode", "notin", $("#Text_searchOriginCity").data("kendoAutoComplete").key());
        searchDestinationCityFilter = cfi.autoCompleteFilter(filtersearchDestinationCity);
        return searchDestinationCityFilter;
    }
    else if (textId.indexOf("Text_Allotment_") >= 0) {
        var result = textId.split('_')[2];
        var filterAllotment = cfi.getFilter("AND");
        cfi.setFilter(filterAllotment, "DailyFlightSNo", "eq", result);
        cfi.setFilter(filterAllotment, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
        AllotmentFilter = cfi.autoCompleteFilter(filterAllotment);
        return AllotmentFilter;
    }
    else if (textId.indexOf("Text_AWBAgent") >= 0) {
        var AWBAgentfilter = cfi.getFilter("AND");
        cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        if (userContext.GroupName == "POS")
            cfi.setFilter(AWBAgentfilter, "AccountTypeName", "eq", "POS");
        else if (userContext.GroupName == "ADMIN") {
            cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        }
        else {
            cfi.setFilter(AWBAgentfilter, "AccountTypeName", "eq", "FORWARDER");
        }
        filterAWBAgent = cfi.autoCompleteFilter(AWBAgentfilter);
        return filterAWBAgent;
    }
    else if (textId.indexOf("Text_OtherNatureofGoods") >= 0) {
        var filterOtherNatureofGoods = cfi.getFilter("AND");
        cfi.setFilter(filterOtherNatureofGoods, "CommoditySNo", "notin", $("#Text_OtherNatureofGoods").data("kendoAutoComplete").key());
        for (var i = 0; i <= 10; i++) {
            if ($('#OtherNatureofGoods_' + [i]).val() != undefined && $('#OtherNatureofGoods_' + [i]).val() != '' && 'OtherNatureofGoods_' + [i] != 'OtherNatureofGoods_' + textId.split('_')[2])
                cfi.setFilter(filterOtherNatureofGoods, "CommoditySNo", "notin", $('#OtherNatureofGoods_' + [i]).val());
        }
        MainfilterOtherNatureofGoods = cfi.autoCompleteFilter(filterOtherNatureofGoods);
        return MainfilterOtherNatureofGoods;
    }
    else if (textId.indexOf("Text_SHC") >= 0) {
        var filterSPHC2 = cfi.getFilter("AND");
        //cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");
        cfi.setFilter(filterSPHC2, "SNo", "notin", $("#SHC").val());
        SPHCDGRFilter = cfi.autoCompleteFilter(filterSPHC2);
        return SPHCDGRFilter;
    }
    else if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");
        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key());
        cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");
        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_SHIPPER_City").data("kendoAutoComplete").key());
        cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    else if (textId.indexOf("Text_SHIPPER_CountryCode") >= 0) {
        var filterSCity = cfi.getFilter("AND");
        cfi.setFilter(filterSCity, "SNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_CountryCode") >= 0) {
        var filterCCity = cfi.getFilter("AND");
        cfi.setFilter(filterCCity, "SNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        var SHIPPER_AccountNo2 = cfi.getFilter("AND");
        cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
        cfi.setFilter(SHIPPER_AccountNo2, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
        return ShipperAccountFilter;
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        var ConsigneeFilter2 = cfi.getFilter("AND");
        cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
        cfi.setFilter(ConsigneeFilter2, "CitySNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
        return ConsigneeFilter;
    }
    else if (textId.indexOf("Text_SPHC") >= 0) {
        var filterSPHC1 = cfi.getFilter("AND");
        cfi.setFilter(filterSPHC1, "IsDGR", "eq", "1");
        SPHCFilter = cfi.autoCompleteFilter(filterSPHC1);
        return SPHCFilter;
    }
    else if (textId.indexOf("Text_UnNo") >= 0) {
        var _filterUnNo = cfi.getFilter("AND");
        cfi.setFilter(_filterUnNo, "UNNumber", "neq", '');
        filterUnNo = cfi.autoCompleteFilter(_filterUnNo);
        return filterUnNo;
    }
    else if (textId.indexOf("Text_SubRisk") >= 0) {
        var _filterSubRisk = cfi.getFilter("AND");
        cfi.setFilter(_filterSubRisk, "SubRisk", "neq", '');
        cfi.setFilter(_filterSubRisk, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSubRisk = cfi.autoCompleteFilter(_filterSubRisk);
        return filterSubRisk;
    }
    else if (textId.indexOf("Text_Class") >= 0) {
        var _filterSLINo = cfi.getFilter("AND");
        cfi.setFilter(_filterSLINo, "ClassDivSub", "neq", '');
        cfi.setFilter(_filterSLINo, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSLINo = cfi.autoCompleteFilter(_filterSLINo);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_PackingGroup") >= 0) {
        var _filterPakagingGroup = cfi.getFilter("AND");
        cfi.setFilter(_filterPakagingGroup, "PackingGroup", "neq", '');
        cfi.setFilter(_filterPakagingGroup, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        filterPakagingGroup = cfi.autoCompleteFilter(_filterPakagingGroup);
        return filterPakagingGroup;
    }
    else if (textId.indexOf("Text_PackingInst") >= 0) {
        var _filterPackingInst = cfi.getFilter("AND");
        cfi.setFilter(_filterPackingInst, "PackingInst", "neq", '');
        cfi.setFilter(_filterPackingInst, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        if (($("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").key() || 0) != 0) {
            cfi.setFilter(_filterPackingInst, "PackingGroup", "eq", $("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").value());
        }
        filterPackingInst = cfi.autoCompleteFilter(_filterPackingInst);
        return filterPackingInst;
    }
    else if (textId.indexOf("Text_ERG") >= 0) {
        var _filterErg = cfi.getFilter("AND");
        cfi.setFilter(_filterErg, "ERGN", "neq", '');
        cfi.setFilter(_filterErg, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterErg = cfi.autoCompleteFilter(_filterErg);
        return filterErg;
    }
    else if (textId.indexOf("Text_SubGroup_") >= 0) {
        var _SHCSubgrpErg = cfi.getFilter("AND");
        cfi.setFilter(_SHCSubgrpErg, "SPHCSNo", "eq", $("#" + textId).closest('tr').find("input[id^='SHCSNo_']").val());
        SHCSubGrioupFilter = cfi.autoCompleteFilter(_SHCSubgrpErg);
        return SHCSubGrioupFilter;
    }
    else if (textId.indexOf("Text_DocType") >= 0) {
        var FilterDocType = cfi.getFilter("AND");
        cfi.setFilter(FilterDocType, "ApplicableIn", "eq", "0");
        DocTypeFilter = cfi.autoCompleteFilter(FilterDocType);
        return DocTypeFilter;
    }

}
function CleanUI() {
    $("#ApplicationTabs-1").html("");
    $("#ApplicationTabs-2").html("");
    $("#ApplicationTabs-3").html("");
    $("#ApplicationTabs-4").html("");
    $("#ApplicationTabs-5").html("");

    $("#btnSave").unbind("click");
    $("#btnUpdate").unbind("click");
    $("#btnCopyBooking").unbind("click");
    $("#btnExecute").unbind("click");
    $("#ulReservation").hide();
    $("#ApplicationTabs").hide();

    $("#btnSave").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnCopyBooking").css("display", "none");
    $("#btnExecute").css("display", "none");
    $("#btnNew").css("display", "block");
    $("#divEDox").html("");

    //$("#divXRAY").hide();
    //$("#tblShipmentInfo").hide();
    //$("#divDetail").html("");
    //$("#divDetail").html("");
    //$("#tblShipmentInfo").hide();
    //$("#divNewBooking").html("");
    //$("#btnSave").unbind("click");

    //$("#divXRAY").hide();

    //$("#ulTab").hide();
    //$("#divDetail_SPHC").html("");
    //$("#divDetailSHC").html("");

    //$("#divTab3").html("");
    //$("#divTab4").html("");
    //$("#divTab5").html("");
    //$("#tabstrip").hide();
}
function ClearItineraryRoute() {
    var theDiv = document.getElementById("divFinalSelectedroute");
    theDiv.innerHTML = "";
    var theDiv1 = document.getElementById("divFlightSearchResult");
    theDiv1.innerHTML = "";
    cfi.ResetAutoComplete("ItineraryOrigin");
    cfi.ResetAutoComplete("ItineraryDestination");
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true);
    $("#Text_AWBDestination").data("kendoAutoComplete").enable(true);
    $("#hdnETDTime").val('00:00');
    $("#hdnFlightDate").val('');
    var AWBPieces = ($("#AWBPieces").val() == "" ? "" : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? "" : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? "" : parseFloat($("#AWBCBM").val()));

    $("#ItineraryPieces").val(AWBPieces);
    $("#_tempItineraryPieces").val(AWBPieces);
    $("#ItineraryGrossWeight").val(AWBGrossWeight);
    $("#_tempItineraryGrossWeight").val(AWBGrossWeight);
    $("#ItineraryVolumeWeight").val(AWBCBM);
    $("#_tempItineraryVolumeWeight").val(AWBCBM);
    SelectedAWBOriginDestinationItineary('Text_AWBOrigin');
    SelectedAWBOriginDestinationItineary('Text_AWBDestination');
}

function RateAvailableOrNotNEW(FlightDate, FlightNo, AllotmentCode) {
    var Result = false;
    if ($("#Text_Product").data("kendoAutoComplete").value().toUpperCase() == "COMAT")
        Result = true;
    else {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/RateAvailableOrNotNEW",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: $('input:radio[name=BookingType]:checked').val(),
                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : 0,
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                OriginCity: $("#Text_AWBOrigin").data("kendoAutoComplete").value().split('-')[0],
                DestinationCity: $("#Text_AWBDestination").data("kendoAutoComplete").value().split('-')[0],
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                AWBPieces: $("#AWBPieces").val(),
                GrossWeight: $("#AWBGrossWeight").val(),
                VolumeWeight: $("#AWBVolumeWeight").val(),
                ChargeableWeight: $("#AWBChargeableWeight").val(),
                Volume: $("#AWBCBM").val(),
                UM: $("#Text_UM").data("kendoAutoComplete").value(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                NOG: $("#NatureOfGoods").val(),
                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                FlightDate: FlightDate,
                FlightNo: FlightNo,
                BookingReferenceNo: $("#hdnBookingMasterRefNo").val(),
                AllotmentCode: AllotmentCode
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].FinalRate != "") {
                            Result = true;
                        }
                        else {
                            Result = false;
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    return Result;
}
function RateAvailableOrNot() {
    var Result = false;
    if ($("#Text_Product").data("kendoAutoComplete").value().toUpperCase() == "COMAT")
        Result = true;
    else {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/RateAvailableOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: $('input:radio[name=BookingType]:checked').val(),
                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : 0,
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                OriginCity: $("#Text_AWBOrigin").data("kendoAutoComplete").value().split('-')[0],
                DestinationCity: $("#Text_AWBDestination").data("kendoAutoComplete").value().split('-')[0],
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                AWBPieces: $("#AWBPieces").val(),
                GrossWeight: $("#AWBGrossWeight").val(),
                VolumeWeight: $("#AWBVolumeWeight").val(),
                ChargeableWeight: $("#AWBChargeableWeight").val(),
                Volume: $("#AWBCBM").val(),
                UM: $("#Text_UM").data("kendoAutoComplete").value(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                NOG: $("#NatureOfGoods").val(),
                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].FinalRate != "") {
                            Result = true;
                        }
                        else {
                            Result = false;
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    return Result;
}
function IsInternationalBookingAgent() {
    var Result = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/IsInternationalBookingAgent",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
            DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key(),
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
            ItineraryOrigin: $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(),
            ItineraryDestination: $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key(),
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result == "1") {
                        Result = true;
                    }
                    else {
                        Result = false;
                        ShowMessage('warning', 'Information!', myData.Table0[0].ResultMessage);
                    }
                }
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return Result;
}

function SaveEDoxList() {
    var EDoxArray = [];
    var SPHCDoxArray = [];
    var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
    var Remarks = $("#Remarks").val();
    var flag = false;
    $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
        if ($(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key() || "0" > 0) {
            var eDoxViewModel = {
                EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
                DocName: $(this).find("span[id^='DocName']").text(),
                AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
                ReferenceNo: $(this).find("input[id^='Reference']").val(),
                Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
            };
            EDoxArray.push(eDoxViewModel);
        }
    });

    $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentsphcedoxinfo']").each(function () {
        var SPHCDoxViewModel = {
            SNo: $(this).find("span[id^='uploaddocsno']").text(),
            AWBSNo: currentawbsno,
            SPHCSNo: $(this).find("span[id^='sphcsno']").text(),
            DocName: $(this).find("span[id^='sphcdocname']").text(),
            AltDocName: $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata"),
            Remarks: $(this).find("textarea[id^='sphcdocremarks']").val()
        };
        SPHCDoxArray.push(SPHCDoxViewModel);
    });

    var isPriorApproval = $("#chkPriorApp").prop('checked') == true ? 1 : 0;
    var IsBOEVerification = $("#chkBoeVerifi").prop('checked') == true ? 1 : 0;
    var BOENo = $("#BOENo").val();
    var BOEDate = $("#BOEDate").val();

    var isFOC = $("#chkFOC").prop('checked') == true ? 1 : 0;
    var FOCTypeSNo = $("input[id^='Text_FOCType']").data("kendoAutoComplete").key();
    var FocRemarks = $("textarea[id^='FOCRemarks']").val();
    var BOEFlag = false;
    if (BOENo == "0") {
        $("#BOENo").val("");
    }
    //if (BOENo == "") {
    //    ShowMessage('warning', 'Information!', "Kindly Enter Custom Reference Number", "bottom-right");
    //    BOEFlag = true;

    //}
    //if (BOEDate == "" && BOEFlag == false) {
    //    ShowMessage('warning', 'Information!', "Kindly Select Custom Reference Date", "bottom-right");
    //    BOEFlag = true;
    //}
    ////if (EDoxArray.length == 0) {
    ////    ShowMessage('warning', 'Warning - Document Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
    ////}
    if (BOEFlag == false) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/SaveAWBEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, AWBEDoxDetail: EDoxArray, SPHCDoxArray: SPHCDoxArray, AllEDoxReceived: AllEDoxReceived, Remarks: Remarks, PriorApproval: isPriorApproval, BOEVerification: IsBOEVerification, UpdatedBy: 2, BOENo: BOENo, BOEDate: BOEDate, isFOC: isFOC, FOCTypeSNo: FOCTypeSNo, FocRemarks: FocRemarks }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - e-Dox Information', "E-Dox Processed Successfully", "bottom-right");
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else
                    ShowMessage('warning', 'Warning - e-Dox Information', "E-Dox unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            },
            complete: function (xhr) {
                $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentsphcedoxinfo']").each(function () {
                    $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata", '');
                });

            }
        });
    }
    return flag;
}
function BindEDox() {
    cfi.AutoComplete("FOCType", "Foc_Type", "FocType", "SNo", "FocTypeCode", ["FocTypeCode", "Foc_Type"], null, "contains");
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetRecordAtAWBEDox?AWBSNo=" + currentawbsno, async: true, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            var alldocrcvd = edoxData.Table1;
            var SPHCDoc = edoxData.Table2;
            var PriorBOEArray = edoxData.Table3;
            var PicesArray = edoxData.Table4;

            var docRcvd = false;
            if (alldocrcvd.length > 0) {
                var docItem = alldocrcvd[0];
                docRcvd = docItem.IsAllEDoxRecieved.toLowerCase() == "true" ? true : false;
                // $("#XRay").prop("checked", docRcvd == "true" ? true : false);
                $("#XRay").prop("checked", docRcvd);
                //$("#XRay").val(resItem.XrayRequired);
                $("#Remarks").val(docItem.AllEDoxReceivedRemarks);
            }
            if (PicesArray.length > 0) {
                $("#tdPcs").text(PicesArray[0].AWBTOTALPIECES);
            }
            CheckContactNo("BOENo");
            cfi.makeTrans("shipment_reservationshipmentedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
            cfi.makeTrans("shipment_reservationshipmentsphcedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, SPHCDoc);
            $("#divareaTrans_shipment_reservationshipmentedoxinfo tr:first").find("font").remove();

            if (!docRcvd) {
                $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
                        if (SPHCDoc.length > 0 || (PriorBOEArray[0].PriorApproval == "True" || PriorBOEArray[0].IsBOEVerification == "True" || PriorBOEArray[0].IsFOC == "True")) {
                            $(this).closest('td').find("input[id^='Text_DocType']").removeAttr("data-valid");
                        }

                    });
                    $(this).find("input[id^='Text_DocType']").unbind("blur").bind("blur", function () {
                        RemoveFileMandatory($(this).closest('td').find("input[id^='Text_DocType']").attr("id"));
                    });

                    $(this).find("input[id^='DocsName']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadEDoxDocument($(this).attr("id"), "DocName");
                            if (SPHCDoc.length > 0 || (PriorBOEArray[0].PriorApproval == "True" || PriorBOEArray[0].IsBOEVerification == "True" || PriorBOEArray[0].IsFOC == "True")) {
                                $(this).removeAttr("data-valid");
                            }
                            WrapSelectedFileName();
                        })
                    });
                    $(this).find("a[id^='ahref_DocName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                    $(this).find("input[type='file']").css('width', '');
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                });



                $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").find("table tr").each(function () {
                    $(this).find("td:eq(1)").css("display", "none");
                    $(this).find("td:eq(2)").css("display", "none");
                    $(this).find("td:eq(3)").css("display", "none");
                    $(this).find("td:eq(4)").css("display", "none");
                    $(this).find("td:last").remove();

                    $(this).find("input[id^='sphcdocsname']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadSPHCDocument($(this).attr("id"), "sphcdocname");
                        })
                    });
                    $(this).find("a[id^='ahref_sphcdocname']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadSPHCDocument($(this).attr("id"), "sphcdocname");
                        })
                    });
                    if ($(this).find("span[id^='IsUploadMandatory']").text().toUpperCase() == "TRUE") {
                        if (($(this).find("span[id^='sphcdocname']").text() || "") == "") {
                            $(this).find("input[id^='sphcdocsname']").attr("data-valid", "required");
                        }
                    }

                    var DocSNo = $(this).find("span[id^='sphcdocumenttransnso']").text() || "0";
                    if (parseInt(DocSNo) > 0) {
                        $(this).find("a[id^='ahref_sampledocname']").each(function () {
                            $(this).unbind("click").bind("click", function () {
                                DownloadEDoxFromDB(DocSNo, "S");    //S== Sample Document Flag
                            })
                        });
                    }
                    else {
                        $(this).find("span[id^='sampledocname']").closest('td').html('');
                    }

                    $(this).find("input[type='file']").css('width', '');
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                });

            }
            else {
                var prevtr = $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("tr[id='areaTrans_shipment_reservationshipmentedoxinfo']").prev()
                prevtr.find("td:eq(2)").remove();
                prevtr.find("td:last").remove();
                $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("tr[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
                    $(this).find("td:eq(2)").remove();
                    $(this).find("td:last").remove();
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                })

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
            }
            $("#BOEDate").data("kendoDatePicker").value("");

            if (SPHCDoc.length <= 0) {
                $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").remove();
            }
            if (PriorBOEArray.length > 0) {
                if (PriorBOEArray[0].PriorApproval == "False") {
                    $("#chkPriorApp").closest('table').hide();
                } else {
                    $("#chkPriorApp").prop('checked', PriorBOEArray[0].isPriorApproval == "False" ? false : true);
                    $("#chkPriorApp").attr('disabled', PriorBOEArray[0].isPriorApproval == "True" ? true : false)

                }
                //$("#chkBoeVerifi").prop('checked', PriorBOEArray[0].IsBOEVerification == "False" ? false : true);
                if (PriorBOEArray[0].IsBOEVerification == "True") {
                    $("#BOENo").val(PriorBOEArray[0].BOENo);
                    $("#BOEDate").data("kendoDatePicker").value(PriorBOEArray[0].BOEDate);
                    $("#chkBoeVerifi").prop('checked', true);
                    // $("#BOENo").prop('disabled', true);
                    //$("#BOEDate").data("kendoDatePicker").enable(false);
                } else {
                    $("#chkBoeVerifi").prop('checked', false);
                    $("#BOENo").val(PriorBOEArray[0].BOENo);
                    if (PriorBOEArray[0].BOEDate != "") {
                        $("#BOEDate").data("kendoDatePicker").value(PriorBOEArray[0].BOEDate);
                        $("#BOEDate").data("kendoDatePicker").enable(false);
                    }
                }
            }
            //FOC Shipment Starst
            if (userContext.SpecialRights.AWBFOC != true) {
                $("input[id='chkFOC']").closest("table").hide();
            } else {
                if (PriorBOEArray[0].IsFOC == "True") {
                    $("#chkFOC").prop('checked', true);
                    $("input[id^='Text_FOCType']").data("kendoAutoComplete").setDefaultValue(PriorBOEArray[0].FocTypeSNo, PriorBOEArray[0].Text_FocType);
                    $("textarea[id^='FOCRemarks']").val(PriorBOEArray[0].FocRemarks);
                } else {
                    $("#chkFOC").prop('checked', false);
                    $("input[id^='Text_FOCType']").data("kendoAutoComplete").enable(false);
                    $("textarea[id^='FOCRemarks']").attr('disabled', true);
                }
            }
            if (PicesArray.length > 0) {
                if (PicesArray[0].FreezFOC == 1) {
                    $("#chkFOC").attr('disabled', true);
                    $("input[id^='Text_FOCType']").data("kendoAutoComplete").enable(false);
                    $("textarea[id^='FOCRemarks']").attr('disabled', true);
                }
            }
        },
        error: {

        }
    });
}
function UploadSPHCDocument(objId, nexctrlid) {
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    //if (files['0'].size > 10240)
    //    alert("Max image size is 10 mb");
    //else {
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "Handler/UploadImage.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
    //}
}
function DownloadSPHCDocument(objId, nexctrlid) {
    if (parseInt($("#" + objId).closest('tr').find("span[id^='uploaddocsno']").text() || "0") > 0) {
        DownloadEDoxFromDB(parseInt($("#" + objId).closest('tr').find("span[id^='uploaddocsno']").text() || "0"), "O")
    }
    else {
        if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
            window.location.href = "Handler/FileUploadHandler.ashx?l=UploadImage&f=" + $("#" + objId).attr("linkdata");
        }
        else {
            ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
        }
    }

}
function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "Handler/FileUploadHandler.ashx?l=e-Dox&f=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }

}
function DownloadEDoxFromDB(DocSNo, DocFlag) {
    if (parseInt(DocSNo) > 0) {
        window.location.href = "Handler/FileUploadHandler.ashx?DocSNo=" + DocSNo + "&DocFlag=" + DocFlag;
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}
function WrapSelectedFileName() {
    $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
        $(this).find("span[id^='DocName']").closest('td').css("white-space", "inherit");
        $(this).find("input[type='file'][id^='DocsName']").css('width', '');
        $(this).find("input[id^='Text_DocType']").parent('span').css('width', '120px');
    });

}
function MakeFileMandatory(e) {
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").attr("data-valid", "required");
    } else {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").removeAttr("data-valid");
    }
}
function RemoveFileMandatory(e) {
    if ($("#" + e).val() == "") {
        $("#" + e).closest('tr').find("[id^='DocsName']").removeAttr("data-valid");
    }
}
function CheckContactNo(ctrlID) {
    $("input[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}
function BindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='DocType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
    });
    //$(elem).closest("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
    //    $(this).find("input[id^='DocType']").each(function () {
    //        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
    //    });
    //});
    $(elem).find("input[type='file']").attr("data-valid-msg", "Attach Document");
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
    WrapSelectedFileName();
}
function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, MakeFileMandatory);
        });
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}
function UploadEDoxDocument(objId, nexctrlid) {

    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    var FileFlag = true;
    for (var i = 0; i < files.length; i++) {
        if (files[i].name.length > 150) {
            FileFlag = false;
        } else {
            fileName = files[i].name;
            data.append(files[i].name, files[i]);
        }
    }
    if (FileFlag == false) {
        ShowMessage('info', 'File Upload!', "Unable to upload selected file. File Name should be less than 150 characters.", "bottom-right");
        return;
    }
    $.ajax({
        url: "Handler/FileUploadHandler.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#eDox#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#eDox#')[1]);
            $("#" + objId).closest("tr").find("input[id^='Text_DocType']").attr("data-valid", "required");
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            $("#" + objId).closest("tr").find("input[id^='Text_DocType']").removeAttr("data-valid");
        }
    });

}


function SHCDetails(e) {
    if ($("#divMultiSHC").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    }
    //else {
    //    GetDGRDetailsBySHC(($("#Multi_SHC").val() == "" ? "" : $("#Multi_SHC").val() + ",") + this.dataItem(e.item.index()).Key);
    //}
}
//function GetDGRDetailsBySHC(SPHCSNos) {

//    $.ajax({
//        url: "Services/Shipment/ReservationBookingService.svc/GetDGRInfo?SPHCSNo=" + SPHCSNos, async: false, type: "get", dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var DGRData = jQuery.parseJSON(result);
//            var SPHCDGR = DGRData.Table;
//            var SubGroup = DGRData.Table1;
//            var DGRPieces = DGRData.Table2;
//            var SHCTemp = DGRData.Table3;
//            // Add Rows for SPHC having Sub Group
//            if (SubGroup.length > 0) {
//                $("a[id^='ahref_SubGroup']").show();
//                var Sno = 0;
//                if ($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").length > 0) {
//                    //Sno = parseInt(($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").val() || "0")) + 1;
//                    var Ctrlid = parseInt($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("id").split('_')[1]) + 1;
//                    var tdSno = $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("td[id^='tdSNoCol']").text();
//                    if (parseInt(Ctrlid) > parseInt(tdSno)) {
//                        Sno = parseInt(Ctrlid);
//                    } else {
//                        Sno = parseInt(tdSno);
//                    }
//                } else {
//                    Sno = 1;
//                }
//                for (i = 0; i < SubGroup.length; i++) {
//                    if ($.inArray(SubGroup[i].Code, $("input[id^='SHC_']").map(function (e, f, g) { return $(f).val() })) < 0) {
//                        var Row = '<tr data-popup="true" id="areaTrans_shipment_shipmentSHCSubGroup_' + Sno + '" <input type="hidden" name="mainSno_' + Sno + '" id="mainSno_' + Sno + '" value=' + Sno + '" class="transSection"><input type="hidden" name="IsDGR_' + Sno + '" id="IsDGR_' + Sno + '" value="' + SubGroup[i].IsDGR + '" class="transSection"><td id="tdSNoCol" class="formSNo snowidth">' + Sno + '</td><td class="formtwoInputcolumn"><input type="hidden" name="SHCSNo_' + SubGroup[i].SNo + '" id="SHCSNo_' + SubGroup[i].SNo + '" value=' + SubGroup[i].SNo + '><input type="text" class="k-input k-state-default transSection" name="SHC_' + Sno + '" id="SHC_' + Sno + '" recname="SHC" disabled="disabled" style="width: 47.7778px;" controltype="alphanumericupper" value="" placeholder="" data-role="alphabettextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="SubGroup_' + Sno + '" id="SubGroup_' + Sno + '" value=""><input type="text" class="" name="Text_SubGroup_' + Sno + '" id="Text_SubGroup_' + Sno + '" controltype="autocomplete" maxlength="20" value="" placeholder=""></td>'
//                        if (SubGroup[i].StatementLabel != "") {
//                            Row += '<td class="formthreelabel"><span id="spnStatLabel_' + Sno + '">' + SubGroup[i].StatementLabel + '</span></td>'
//                            Row += '<td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="StatementDesc_' + Sno + '" id="StatementDesc_' + Sno + '" recname="StatementDesc" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="50" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td>'
//                        }
//                        if (SubGroup[i].PackingLabel != "") {
//                            Row += '<td class="formthreelabel"><span id="spnStatLabel_' + Sno + '" style="width: 150px;">' + SubGroup[i].PackingLabel + '</span></td>'
//                            Row += '<td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="PackingLabel_' + Sno + '" id="PackingLabel_' + Sno + '" recname="PackingLabel" style="width: 100px; text-transform: uppercase;" controltype="uppercase" maxlength="5" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td>'
//                        }
//                        //else {
//                        if (SubGroup[i].StatementLabel == "" || SubGroup[i].PackingLabel == "") {
//                            Row += '<td class="formSNo snowidth" class="transSection"></td><td class="formSNo snowidth" class="transSection"></td>'
//                        }
//                        //}
//                        Row += '</tr>'
//                        //$("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("table > tbody").append('<tr data-popup="true" id="areaTrans_shipment_shipmentSHCSubGroup_' + Sno + '"><td id="tdSNoCol" class="formSNo snowidth">' + Sno + '<input type="hidden" name="mainSno_' + Sno + '" id="mainSno_' + Sno + '" value=' + Sno + '" class="transSection"></td><td class="formtwoInputcolumn"><input type="hidden" name="SHCSNo_' + SubGroup[i].SNo + '" id="SHCSNo_' + SubGroup[i].SNo + '" value=' + SubGroup[i].SNo + '><input type="text" class="k-input k-state-default transSection" name="SHC_' + Sno + '" id="SHC_' + Sno + '" recname="SHC" disabled="disabled" style="width: 47.7778px;" controltype="alphanumericupper" value="" placeholder="" data-role="alphabettextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="SubGroup_' + Sno + '" id="SubGroup_' + Sno + '" value=""><input type="text" class="" name="Text_SubGroup_' + Sno + '" id="Text_SubGroup_' + Sno + '" controltype="autocomplete" maxlength="20" value="" placeholder=""></td></tr>');
//                        $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("table > tbody").append(Row);
//                        AllowedSpecialChar($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='StatementDesc_']").attr("id"));
//                        AllowedSpecialChar($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='PackingLabel_']").attr("id"));
//                        $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").find("input[id^='StatementDesc_']").each(function () {
//                            var NewRow = $(this).closest("tr");
//                            $(this).unbind('keyup').bind('keyup', function (e) {
//                                if ($(NewRow).find("input[id^='IsDGR']").val() == "T") {
//                                    var ctrlid = $(this).attr("id");
//                                    oldVal = $(this).val();
//                                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").find("input[type='hidden'][id^='IsDGR_'][value='T']").closest("tr").find("input[id^='StatementDesc_']").each(function () {
//                                        if (ctrlid != $(this).attr("id")) {
//                                            $(this).val(oldVal);
//                                        }
//                                    });
//                                }
//                            });
//                        });

//                        $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SHC_']").val(SubGroup[i].Code);
//                        cfi.AutoComplete($("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']:last").find("input[id^='SubGroup_']").attr("name"), "SPHCCode", "vSPHCTrans", "SNo", "SPHCCode", "", null, "contains", ",");
//                        Sno += 1;
//                    }
//                }

//                $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").each(function (i, row) {
//                    $(row).find("td[id^='tdSNoCol']").text(parseInt(i) + 1);
//                });
//                $("a[id^='ahref_SubGroup']").unbind("click").bind("click", function () {
//                    $("#divareaTrans_shipment_shipmentSHCSubGroup").find("input[id^='Text_SubGroup_'").parent().removeAttr("style");
//                    $("#divareaTrans_shipment_shipmentSHCSubGroup").find("input[id^='Text_SubGroup_'").parent().parent().css('width', '250px');
//                    if (!$("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow")) {
//                        cfi.PopUp("divareaTrans_shipment_shipmentSHCSubGroup", "SHC Sub Group Details");
//                    }
//                    else {
//                        $("#divareaTrans_shipment_shipmentSHCSubGroup").data("kendoWindow").open();
//                    }
//                });
//            } else {
//                $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").remove();
//                $("a[id^='ahref_SubGroup']").hide();
//            }

//            DGRSPHC = [];
//            for (i = 0; i < SPHCDGR.length; i++) {
//                var info = {
//                    Key: SPHCDGR[i].SNo,
//                    Text: SPHCDGR[i].Code
//                };
//                DGRSPHC.push(info);
//            }
//            if (DGRSPHC.length > 0) {
//                $("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
//                    $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
//                    $(this).find("input[id^='SPHC']").each(function () {

//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
//                        } else {
//                            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
//                        }

//                    });
//                    $(this).find("input[id^='UnNo']").each(function () {
//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//                        }
//                    });
//                    //$(this).find("input[id^='ShippingName']").each(function () {
//                    //    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                    //        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//                    //    }
//                    //});

//                    $(this).find("input[id^='Class']").each(function () {
//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
//                        }
//                    });
//                    $(this).find("input[id^='SubRisk']").each(function () {
//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
//                        }
//                    });
//                    $(this).find("input[id^='PackingGroup']").each(function () {
//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
//                            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
//                        }
//                    });
//                    $(this).find("input[id^='Unit']").each(function () {
//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            //cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
//                            cfi.AutoComplete($(this).attr("name"), "Unit", "v_DGRUnit", "Unit", "Unit", ["Unit"], null, "contains");
//                        }
//                    });
//                    $(this).find("input[id^='PackingInst']").each(function () {
//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
//                            cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
//                        }
//                    });
//                    $(this).find("input[id^='ERG']").each(function () {
//                        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
//                        }
//                    });
//                    $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')
//                    //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
//                    $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
//                });

//                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
//                    cfi.PopUp("divareaTrans_shipment_shipmentclasssphc", "DGR Details");
//                    $("div[id='divareaTrans_shipment_shipmentclasssphc']").find("input[id^='Text_SPHC']").attr("data-valid", "required").attr("data-valid-msg", "Select IMP");
//                    $("div[id='divareaTrans_shipment_shipmentclasssphc']").find("input[id^='Text_UnNo']").attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
//                    // Use this to unbing click event of DGR when delete shc for future
//                    //$("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });
//                });
//            } else {
//                $("a[id^='ahref_ClassDetails']").unbind("click");
//            }

//            if (DGRPieces.length > 0) {
//                if (DGRPieces[0].RequiredDGRPieces == 1) {
//                    $("input[id*='txtDGRPieces']").removeAttr("disabled");
//                    $("input[id^='txtDGRPieces']").attr("data-valid", "min[1],required").attr("data-valid-msg", "Enter DGR Pieces");
//                }
//                else {
//                    $("#txtDGRPieces").val('');
//                    $("#_temptxtDGRPieces").val('');
//                    $("input[id^='txtDGRPieces']").removeAttr("data-valid").removeAttr("data-valid-msg");
//                    $("input[id*='txtDGRPieces']").attr("disabled", 1);
//                }
//            }

//            //-- Check Temp controled  SPHC
//            //if (SHCTemp.length > 0) {
//            //    TempArray = SHCTemp;
//            //    SHCdata = [];
//            //    for (i = 0; i < SHCTemp.length; i++) {
//            //        var info = {
//            //            Key: SHCTemp[i].SNo,
//            //            Text: SHCTemp[i].Code,
//            //        };
//            //        SHCdata.push(info);
//            //    }

//            //    $("a[id^='ahref_TempControl']").show();
//            //    $("#divareaTrans_shipment_fwbshctemp").find("input[id^='Text_TEMPSHCCode'").parent().removeAttr("style");
//            //    //$("#divareaTrans_shipment_fwbshctemp").find("input[id^='Text_TEMPSHCCode'").parent().parent().css('width', '100px');
//            //    $("div[id='divareaTrans_shipment_fwbshctemp']").find("tr[id^='areaTrans_shipment_fwbshctemp']").each(function (i, row) {
//            //        if ($("#" + "Text_" + $(row).find("input[id^='TEMPSHCCode']").attr("id")).data("kendoAutoComplete") == undefined) {
//            //            cfi.AutoCompleteByDataSource($(row).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata, null, ",");
//            //        }
//            //        else {
//            //            cfi.ChangeAutoCompleteDataSource($(row).find("input[id^='TEMPSHCCode']").attr("id"), SHCdata);
//            //        }
//            //    });
//            //} else {
//            //    $("a[id^='ahref_TempControl']").hide();
//            //    TempArray = [];
//            //}


//        },
//        error: {

//        }
//    });

//}
//function ResetDGROtherDetails(e) {
//    if ($("#" + e).data("kendoAutoComplete") != undefined && $("#" + e).data("kendoAutoComplete").key() != "") {

//        $.ajax({
//            url: "Services/Shipment/ReservationBookingService.svc/GetDGRInfoByID?SNo=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                var DGRData = jQuery.parseJSON(result);
//                var DGRDetail = DGRData.Table;

//                if (DGRDetail.length > 0) {
//                    var currentRow = $("#" + e).closest('tr');

//                    //if (e.indexOf("Text_UnNo") >= 0) {
//                    //    currentRow.find("input[id^='Text_ShippingName']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["ColumnSearch"]);
//                    //    currentRow.find("input[type=hidden][id^='ShippingName']").val(DGRDetail[0]["ID"]);
//                    //} else if (e == "Text_ShippingName") {
//                    //    currentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["UNNumber"]);
//                    //    currentRow.find("input[type=hidden][id^='UnNo']").val(DGRDetail[0]["ID"]);
//                    //}
//                    currentRow.find("input[id^='Text_Class']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ClassDivSub"], DGRDetail[0]["ClassDivSub"]);
//                    currentRow.find("input[id^='Text_SubRisk']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["SubRisk"], DGRDetail[0]["SubRisk"]);
//                    //currentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingGroup"], DGRDetail[0]["PackingGroup"]);
//                    currentRow.find("input[id^='Text_Unit']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["Unit"], DGRDetail[0]["Unit"]);
//                    //currentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingInst"], DGRDetail[0]["PackingInst"]);
//                    currentRow.find("input[id^='Text_ERG']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ERGN"], DGRDetail[0]["ERGN"]);
//                }

//            },
//            error: {

//            }
//        });
//    } else {
//        var CurrentRow = $("#" + e).closest('tr');
//        CurrentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").setDefaultValue("", "");
//        //CurrentRow.find("input[id^='Text_ShippingName']").data("kendoAutoComplete").setDefaultValue("", "");
//        CurrentRow.find("textarea[id^='DGRCommodity']").val("");
//        CurrentRow.find("input[id^='Text_Class']").data("kendoAutoComplete").setDefaultValue("", "");
//        CurrentRow.find("input[id^='Text_SubRisk']").data("kendoAutoComplete").setDefaultValue("", "");
//        CurrentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").setDefaultValue("", "");
//        CurrentRow.find("input[id^='DGRPieces']").val("");
//        CurrentRow.find("input[id^='_tempDGRPieces']").val("");
//        CurrentRow.find("input[id^='NetQuantity']").val("");
//        CurrentRow.find("input[id^='_tempNetQuantity']").val("");
//        CurrentRow.find("input[id^='Text_Unit']").data("kendoAutoComplete").setDefaultValue("", "");
//        CurrentRow.find("input[id^='Quantity']").val("");
//        CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue("", "");
//        CurrentRow.find("input[id^='RamCat']").val("");
//        CurrentRow.find("input[id^='Text_ERG']").data("kendoAutoComplete").setDefaultValue("", "");
//    }
//    //$("#" + e).closest('tr').find("input:not([id*='_SPHC']").each(function () {
//    //    if ($("#" + e).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key() != "" && $("#" + e).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key() != "") {
//    //        if ($(this).attr('id').indexOf('UnNo') == -1) {
//    //            $(this).val('');
//    //        }
//    //    }
//    //});
//}
//function GetPackingInst(e) {
//    //if (($("#" + e).data("kendoAutoComplete").key() || "") == "") {
//    var CurrentRow = $("#" + e).closest('tr');
//    CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue("", "");
//    CurrentRow.find("input[id^='NetQuantity']").val("");
//    CurrentRow.find("input[id^='_tempNetQuantity']").val("");
//    CurrentRow.find("input[id^='Quantity']").val("");
//    // }
//}
//function GetMaxQty(e) {
//    var CurrentRow = $("#" + e).closest('tr');
//    var UNNo = CurrentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0];
//    var PackGroup = CurrentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").value();
//    var PackInst = CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").value();

//    if (CurrentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").value() == "F") {
//        CurrentRow.find("input[id*='NetQuantity']").val('');
//        CurrentRow.find("input[id*='DGRPieces']").val('');
//        CurrentRow.find("input[id^='NetQuantity']").attr('disabled', 1);
//        CurrentRow.find("input[id^='DGRPieces']").attr('disabled', 1);
//    } else {
//        CurrentRow.find("input[id^='NetQuantity']").removeAttr('disabled');
//        CurrentRow.find("input[id^='DGRPieces']").removeAttr('disabled');
//    }

//    $.ajax({
//        url: "Services/Shipment/ReservationBookingService.svc/GetMaxQty?UNNo=" + UNNo + "&PackGroup=" + PackGroup + "&PackInst=" + PackInst, async: false, type: "get", dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var DGRData = jQuery.parseJSON(result);
//            var DGRDetail = DGRData.Table;
//            var currentRow = $("#" + e).closest('tr');
//            if (DGRDetail.length > 0) {
//                currentRow.find("input[id^='Quantity']").val(DGRDetail[0]["PCAMaxNetQtyJ"]);
//            } else {
//                currentRow.find("input[id^='Quantity']").val("");
//            }
//        }
//    });

//}
//function AutoCompleteDeleteCallBack(e, div, textboxid) {
//    if (textboxid == "Text_SHC" && div == "divMultiSHC") {
//        var target = e.target; // get current Span.
//        var DivId = div; // get div id.
//        var textboxid = textboxid; // get textbox id.
//        var mid = textboxid.replace('Text', 'Multi');

//        var arr = $("#" + mid).val().split(',');
//        //var idx = arr.indexOf($(this)[0].id);
//        //arr.splice(idx, $(e.target).attr("id"));
//        var idx = arr.indexOf($(e.target).attr("id"));
//        arr.splice(idx, 1);
//        $("#" + mid).val(arr);
//        $("#" + textboxid.replace('Text_', '')).val(arr);

//        GetDGRDetailsAfterDelete(e);
//    }
//}
//function GetDGRDetailsAfterDelete(obj) {
//    GetDGRDetailsBySHC($("#Multi_SHC").val());
//    RemoveSPHCSubGroup($("#Multi_SHC").val());
//    var GDRRemainingData = [];

//    $("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
//        if ($(this).find("[id^='Text_SPHC']").data("kendoAutoComplete") != undefined) {
//            if ($(obj).attr("id") != $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key()) {
//                var DGRInfo = {
//                    sphc: $(this).find("input[type=hidden][id^='SPHC']").val(),
//                    text_sphc: $(this).find("input[id^='Text_SPHC']").data("kendoAutoComplete").value(),
//                    unno: $(this).find("input[type=hidden][id^='UnNo']").val(),
//                    text_unno: $(this).find("input[id^='Text_UnNo']").data("kendoAutoComplete").value(),
//                    //shippingname: $(this).find("input[type=hidden][id^='ShippingName']").val(),
//                    //text_shippingname: $(this).find("input[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
//                    class: $(this).find("input[type=hidden][id^='Class']").val(),
//                    text_class: $(this).find("input[type=hidden][id^='Class']").val(),
//                    subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
//                    text_subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
//                    packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),
//                    text_packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),

//                    dgrpieces: $(this).find("[id^='DGRPieces']").val(),
//                    netquantity: $(this).find("[id^='NetQuantity']").val(),
//                    unit: $(this).find("input[type=hidden][id^='Unit']").val(),
//                    text_unit: $(this).find("input[type=hidden][id^='Unit']").val(),
//                    quantity: $(this).find("[id^='Quantity']").val(),

//                    packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
//                    text_packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
//                    ramcat: $(this).find("[id^='RamCat']").val(),

//                    erg: $(this).find("input[type=hidden][id^='ERG']").val(),
//                    text_erg: $(this).find("input[type=hidden][id^='ERG']").val(),

//                };
//                GDRRemainingData.push(DGRInfo);
//            }
//        }
//    });

//    $("div[id=divareaTrans_shipment_shipmentclasssphc]").not(':first').remove();
//    $("div[id$='areaTrans_shipment_shipmentclasssphc']").find("tbody").remove();
//    $("div[id$='areaTrans_shipment_shipmentclasssphc']").append(tblhtml);
//    $("div[id$='areaTrans_shipment_shipmentclasssphc'] tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" type="submit" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');
//    $("#btnSaveDGR").unbind("click").bind("click", function () {
//        SaveDGRDetails();
//    });
//    cfi.makeTrans("shipment_shipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, GDRRemainingData);

//    $("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
//        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");

//        $(this).find("input[id^='SPHC']").each(function () {
//            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
//            }
//            else {
//                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
//            }
//            //cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
//        });
//        $(this).find("input[id^='UnNo']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//        });
//        //$(this).find("input[id^='ShippingName']").each(function () {
//        //    cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//        //});

//        $(this).find("input[id^='Class']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
//        });
//        $(this).find("input[id^='SubRisk']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
//        });
//        $(this).find("input[id^='PackingGroup']").each(function () {
//            // cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
//        });
//        $(this).find("input[id^='Unit']").each(function () {
//            //cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "Unit", "v_DGRUnit", "Unit", "Unit", ["Unit"], null, "contains");
//        });
//        $(this).find("input[id^='PackingInst']").each(function () {
//            //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
//        });
//        $(this).find("input[id^='ERG']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
//        });
//        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
//        //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
//        $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
//    });
//}
//function RemoveSPHCSubGroup(SHC) {
//    $.ajax({
//        url: "Services/Shipment/ReservationBookingService.svc/GetDGRInfo?SPHCSNo=" + SHC, async: false, type: "get", dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var DGRData = jQuery.parseJSON(result);
//            var SPHCDGR = DGRData.Table;
//            var SubGroup = DGRData.Table1;

//            // Remove SPHC Sub Group Row on Removing SPHC
//            if (SubGroup.length > 0) {
//                var NewSHCString = JSON.stringify(SubGroup);
//                for (i = 0; i < SubGroup.length; i++) {
//                    $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").each(function (i, row) {
//                        if (NewSHCString.indexOf($(row).find("input[id^='SHC_']").val()) < 0) {
//                            $(row).remove();
//                        }
//                    });
//                }
//                $("div[id='divareaTrans_shipment_shipmentSHCSubGroup']").find("tr[id^='areaTrans_shipment_shipmentSHCSubGroup_']").each(function (i, row) {
//                    $(row).find("td[id^='tdSNoCol']").text(parseInt(i) + 1);
//                });
//            } else {
//                $("a[id^='ahref_SubGroup']").hide();
//            }

//        },
//        error: {

//        }
//    });
//}
//function BindSPHCTransAutoComplete(elem, mainElem) {
//    //$(elem).find("input[id^='SPHC']").each(function () {
//    //    cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
//    //});
//    //$(elem).find("input[id^='Class']").each(function () {
//    //    cfi.AutoComplete($(this).attr("name"), "ClassName", "SPHCClass", "SNo", "ClassName", ["ClassName"], null, "contains");
//    //});
//    AllowedSpecialChar($(elem).find("textarea[id^='DGRCommodity']").attr("id"));
//    cfi.Numeric($(elem).find("input[id^='NetQuantity']").attr("id"), 2);
//    $(elem).find("input[id^='Quantity']").attr("disabled", "disabled");
//    $(elem).find("input[id^='SPHC']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
//        }
//        else {
//            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
//        }
//        // 080416 Starts
//        $("#" + "Text_" + $(this).attr("name")).attr("data-valid", "required").attr("data-valid-msg", "Select IMP");
//        // 080416 Ends

//        //cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
//    });
//    $(elem).find("input[id^='UnNo']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//        }
//        // 080416 Starts
//        $("#" + "Text_" + $(this).attr("name")).attr("data-valid", "required").attr("data-valid-msg", "Select UN/ID No");
//        // 080416 Ends
//    });
//    //$(elem).find("input[id^='ShippingName']").each(function () {
//    //    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//    //        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//    //    }
//    //});
//    $(elem).find("input[id^='Class']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
//        }
//    });
//    $(elem).find("input[id^='SubRisk']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
//        }
//    });
//    $(elem).find("input[id^='PackingGroup']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
//        }
//    });
//    $(elem).find("input[id^='Unit']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
//        }
//    });
//    $(elem).find("input[id^='PackingInst']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
//        }
//    });
//    $(elem).find("input[id^='ERG']").each(function () {
//        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
//        }
//    });
//    $(elem).find("input[controltype='autocomplete']").closest('span').css('width', '70px')
//    //$(elem).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
//    $(elem).find("input[id^='Text_UnNo']").parent().removeAttr("style");
//}
//function ReBindSPHCTransAutoComplete(elem, mainElem) {
//    $(elem).closest("div[id$='areaTrans_shipment_shipmentclasssphc']").find("[id^='areaTrans_shipment_shipmentclasssphc']").each(function () {
//        //$(this).find("input[id^='SpecialHandlingCode']").each(function () {
//        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHC", "SNO", "CODE", ["CODE", "Description"]);
//        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
//        //});
//        //$(this).find("input[id^='Class']").each(function () {
//        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHCClass", "SNo", "ClassName", ["ClassName"]);
//        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
//        //});
//        cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
//        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
//        $(this).find("input[id^='SPHC']").each(function () {
//            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
//                cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
//            }
//            else {
//                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
//            }
//            //cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
//        });
//        $(this).find("input[id^='UnNo']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "UNNumber,ColumnSearch", "DGR", "ID", "UNNumber", ["UNNumber", "ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//        });
//        //$(this).find("input[id^='ShippingName']").each(function () {
//        //    cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains", null, null, null, null, null, null, null, true);
//        //});

//        $(this).find("input[id^='Class']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
//        });
//        $(this).find("input[id^='SubRisk']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
//        });
//        $(this).find("input[id^='PackingGroup']").each(function () {
//            //cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], GetPackingInst, "contains", null, null, null, null, null, null, null, true);
//        });
//        $(this).find("input[id^='Unit']").each(function () {
//            //cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "Unit", "v_DGRUnit", "Unit", "Unit", ["Unit"], null, "contains");
//        });
//        $(this).find("input[id^='PackingInst']").each(function () {
//            //cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
//            cfi.AutoComplete($(this).attr("name"), "PackingInst", "v_DGR", "PackingInst", "PackingInst", ["PackingInst"], GetMaxQty, "contains", null, null, null, null, null, null, null, true);
//        });
//        $(this).find("input[id^='ERG']").each(function () {
//            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
//        });

//        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
//        //$(this).find("input[id^='Text_ShippingName']").parent().removeAttr("style");
//        $(this).find("input[id^='Text_UnNo']").parent().removeAttr("style");
//    });
//}


function FillCommoditySHC(e) {
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/FillCommoditySHC",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CommoditySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
            //CommoditySNo: $("#Text_SHC").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_SHC").data("kendoAutoComplete").key()
            //CommoditySNo: e.item[0].innerText.split('-')[0]
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    //$("#Text_SHC").data("kendoAutoComplete").setDefaultValue("", "");
                    //$("#SHC").val('');
                    //$("#Text_SHC").val('');
                    //$("#SHC").val('');
                    //$("div[id='divMultiSHC']").remove();
                    if (myData.Table0[0].SPHCSNo != "") {
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SPHCSNo, myData.Table0[0].SPHCSNo);
                        $("#SHC").val(myData.Table0[0].SPHCSNo);
                        $("div[id^='divMultiSHC']").css("overflow", "auto");
                        $("div[id^='divMultiSHC']").css("width", "15em");
                    }
                    //$("div[id='divMultiSHC']").find("li").each(function (i, row) {
                    //    $(row).find("div[id^='divMultiSHC']").find("li").not("first").remove();
                    //    cfi.BindMultiValue($(row).find("input[id^='SHC']").attr("id"), myData.Table0[0].Text_SPHCSNo, myData.Table0[0].SPHCSNo);
                    //    $(row).find("input[id^='SHC']").val(myData.Table0[0].SPHCSNo);
                    //});
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function AssignAWBNoForInterline() {
    var AWBPrefix = $("#Text_AWBCode").data("kendoAutoComplete").key();
    var AWBNumber = $("#AWBNumber").val();
    var SevenDigitofAWBNumber = AWBNumber.substring(0, 7);
    var LastDigitofAWBNumber = AWBNumber.substring(7, 8);
    var ModOfAWBNumber = (SevenDigitofAWBNumber % 7)
    var usersn0 = userContext.UserSNo;
    if (LastDigitofAWBNumber != ModOfAWBNumber) {
        $("#AWBNumber").val(SevenDigitofAWBNumber + ModOfAWBNumber)
        ShowMessage('warning', 'Information!', "Input AWB No was not valid, New AWB No are " + SevenDigitofAWBNumber + ModOfAWBNumber + " .");
    }

}
function ValidateAndCheckValidAWBNumber(e) {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    if (AWBStock == 0 && $("#AWBNumber").val().length == 8) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/CheckValidAWBNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                AWBNumber: $("#AWBNumber").val(),
                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SNo == 'Interline') {
                            if (myData.Table0[0].AWBNo != '') {
                                ShowMessage('warning', 'Information!', "AWB already Used, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else if (myData.Table0[0].SNo == 'Error') {
                            ShowMessage('warning', 'Information!', myData.Table0[0].ErrorMessage);
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                        }
                    }
                    else {
                        if (myData.Table1.length > 0) {
                            if (myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                ShowMessage('warning', 'Information!', "AWBNo Stock not available, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else {
                            ShowMessage('warning', 'Information!', "AWBNo Stock not available, Please try other AWB.");
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function AutoStockAgentOrNot() {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    if (AWBStock == 1 && $("#Text_AWBAgent").data("kendoAutoComplete").value() != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/AutoStockAgentOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == '0') {
                            ShowMessage('warning', 'Information!', "Auto AWB Stock not available for agent, Please try Mannual AWB Stock.");
                            if (userContext.AgentSNo > 0)
                                $('input[name=AWBStock][value=0]').attr('checked', true);
                            else
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue('', '');
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function CheckValidAWBNumber(e) {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    if (AWBStock == 1 && e == "Text_AWBAgent") {
        AutoStockAgentOrNot();
    }
    if (AWBStock == 0 && $("#AWBNumber").val().length == 8) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/CheckValidAWBNumber",
            async: true,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                AWBNumber: $("#AWBNumber").val(),
                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SNo == 'Interline') {
                            if (myData.Table0[0].AWBNo == '') {
                                AssignAWBNoForInterline();
                                if (userContext.AgentSNo <= 0) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                                }
                            }
                            else {
                                ShowMessage('warning', 'Information!', "AWB already Used, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else if (myData.Table0[0].SNo == 'Error') {
                            ShowMessage('warning', 'Information!', myData.Table0[0].ErrorMessage);
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                        }
                        else {
                            $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].AccountSNo, myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].Name);
                            $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                            $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
                        }
                    }
                    else {
                        if (myData.Table1.length > 0) {
                            if (myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                ShowMessage('warning', 'Information!', "AWBNo Stock not available, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                                if (userContext.AgentSNo <= 0) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                                }
                            }
                        }
                        else {
                            ShowMessage('warning', 'Information!', "AWBNo Stock not available, Please try other AWB.");
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                            if (userContext.AgentSNo <= 0) {
                                $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    else {
        if (e != "Text_AWBAgent") {
            if (userContext.AgentSNo > 0) {
                $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(false)
            }
            else {
                $("#AWBNumber").val('');
                $("#_tempAWBNumber").val('');
                cfi.ResetAutoComplete("AWBAgent");
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
            }
        }
    }
}
function CheckPiecesOnOD(e) {
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
    var ItineraryPieces = ($("#ItineraryPieces").val() == "" ? 0 : parseFloat($("#ItineraryPieces").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin != "" && ItineraryDestination != "") {
                if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1])
                    SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val() && SelectedItineraryPieces == AWBPieces) {
                    IsmatchAWBOriginCity = true;
                }
                if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val() && SelectedItineraryPieces == AWBPieces) {
                    IsmatchAWBDestinationCity = true;
                }
            }
        });
    }
    var CheckAndValidateDataArray = [];
    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
        var CheckAndValidateDataArrayItems = {
            Origin: $(tr).find("td")[2].innerText.split("/")[0],
            Destination: $(tr).find("td")[2].innerText.split("/")[1],
            Pieces: $(tr).find("td")[3].innerText,
            GrossWeight: $(tr).find("td")[4].innerText,
            VolumeWeight: $(tr).find("td")[5].innerText,
            AWBOriginCitySNo: $(tr).find("input[id^='hdnOriginCitySNo_']").val(),
            AWBDestinationCitySNo: $(tr).find("input[id^='hdnDestinationCitySNo_']").val()
        };
        CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
    });

    if (CheckAndValidateDataArray.length > 0) {
        for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
            var ItemAWBPiecesOrigin = 0;
            var ItemAWBGrossWeightOrigin = 0;
            var ItemVolumeWeightOrigin = 0;
            var ItemAWBPiecesDestination = 0;
            var ItemAWBGrossWeightDestination = 0;
            var ItemVolumeWeightDestination = 0;
            $.map(CheckAndValidateDataArray, function (item) {
                if (item.Origin == CheckAndValidateDataArray[i].Origin) {
                    ItemAWBPiecesOrigin = parseInt(ItemAWBPiecesOrigin) + parseInt(item.Pieces);
                    ItemAWBGrossWeightOrigin = parseFloat(ItemAWBGrossWeightOrigin) + parseFloat(item.GrossWeight);
                    ItemVolumeWeightOrigin = parseFloat(ItemVolumeWeightOrigin) + parseFloat(item.VolumeWeight);
                }
                if (item.Destination == CheckAndValidateDataArray[i].Destination) {
                    ItemAWBPiecesDestination = parseInt(ItemAWBPiecesDestination) + parseInt(item.Pieces);
                    ItemAWBGrossWeightDestination = parseFloat(ItemAWBGrossWeightDestination) + parseFloat(item.GrossWeight);
                    ItemVolumeWeightDestination = parseFloat(ItemVolumeWeightDestination) + parseFloat(item.VolumeWeight);
                }
            });
            if (AWBOriginCitySNo == CheckAndValidateDataArray[i].AWBOriginCitySNo && ItemAWBPiecesOrigin == AWBPieces)
                IsmatchAWBOriginCity = true;
            if (AWBDestinationCitySNo == CheckAndValidateDataArray[i].AWBDestinationCitySNo && ItemAWBPiecesDestination == AWBPieces)
                IsmatchAWBDestinationCity = true;
            //if (ItemAWBPiecesOrigin == AWBPieces && ItemAWBGrossWeightOrigin == AWBGrossWeight && ItemVolumeWeightOrigin == AWBCBM)
            //    result = true;
            //else {
            //    result = false;
            //    return false;
            //}
        }
    }
    if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
        ShowMessage('warning', 'Information!', "Route Completed.");
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
        return false;
    }
    if (IsmatchAWBOriginCity = false) {
        if (e == "Text_ItineraryOrigin") {
        }
    }
    ItineraryPieces = parseInt(ItineraryPieces) + parseInt(SelectedItineraryPieces);
    if (AWBPieces == 0 && ItineraryPieces > 0) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Pieces.");
        return false;
    }
    else if (ItineraryPieces > AWBPieces) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        if (e == "Text_ItineraryOrigin") {
            $("#ItineraryOrigin").val('');
            $("#Text_ItineraryOrigin").val('');
        }
        else {
            $("#ItineraryDestination").val('');
            $("#Text_ItineraryDestination").val('');
        }
        ShowMessage('warning', 'Information!', "Itinerary Pieces less than AWB Pieces.");
        return false;
    }
}
function SelectedAWBOriginDestination(e) {
    if (e == "Text_AWBOrigin") {
        cfi.ResetAutoComplete('SHIPPER_CountryCode');
        cfi.ResetAutoComplete('SHIPPER_City');
        cfi.ResetAutoComplete('ItineraryOrigin');
    }
    if (e == "Text_AWBDestination") {
        cfi.ResetAutoComplete('CONSIGNEE_CountryCode');
        cfi.ResetAutoComplete('CONSIGNEE_City');
        cfi.ResetAutoComplete('ItineraryDestination');
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAirportofSelectedAWBOriginDestination",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (e == "Text_AWBOrigin") {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                    else {
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                        if (myData.Table0[0].IsHouse == "True") {
                            $("#NoofHouse").attr("data-valid", "min[1],required");
                        }
                        else
                            $("#NoofHouse").removeAttr("data-valid", "");
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        if (UserTyp == "S") {
            $("#chkShipper").prop('checked', false);
            $("#chkShipper").attr('disabled', true);
            $("#chkShipper").removeAttr("title");
        }
        if (UserTyp == "C") {
            $("#chkconsignee").prop('checked', false);
            $("#chkconsignee").attr('disabled', true);
            $("#chkconsignee").removeAttr("title");
        }

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperConsigneeData[0].Name2);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperConsigneeData[0].Address2);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempSHipper_Fax").val(shipperConsigneeData[0].Fax);
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(shipperConsigneeData[0].Name2);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(shipperConsigneeData[0].Address2);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempCONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Name2").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_Street2").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#_tempSHIPPER_MobileNo").val('');
                        $("#SHIPPER_MobileNo2").val('');
                        $("#SHIPPER_Email").val('');
                        $("#SHipper_Fax").val('');
                        $("#_tempSHipper_Fax").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_AccountNoName2").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_Street2").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#_tempCONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_MobileNo2").val('');
                        $("#CONSIGNEE_Email").val('');
                        $("#CONSIGNEE_Fax").val('');
                        $("#_tempCONSIGNEE_Fax").val('');
                    }
                }

            },
            error: {

            }
        });
    } else {
        if (UserTyp == "S") {
            $("#chkShipper").removeAttr('disabled');
            $("#chkShipper").attr("title", "Select to add in Participant as Shipper");

            $("#SHIPPER_Name").val('');
            $("#SHIPPER_Name2").val('');
            $("#SHIPPER_Street").val('');
            $("#SHIPPER_Street2").val('');
            $("#SHIPPER_TownLocation").val('');
            $("#SHIPPER_State").val('');
            $("#SHIPPER_PostalCode").val('');
            $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#SHIPPER_MobileNo").val('');
            $("#_tempSHIPPER_MobileNo").val('');
            $("#SHIPPER_MobileNo2").val('');
            $("#SHIPPER_Email").val('');
            $("#SHipper_Fax").val('');
            $("#_tempSHipper_Fax").val('');
        } else if (UserTyp == "C") {
            $("#chkconsignee").removeAttr('disabled');
            $("#chkconsignee").attr("title", "Select to add in Participant as Consignee");

            $("#CONSIGNEE_AccountNoName").val('');
            $("#CONSIGNEE_AccountNoName2").val('');
            $("#CONSIGNEE_Street").val('');
            $("#CONSIGNEE_Street2").val('');
            $("#CONSIGNEE_TownLocation").val('');
            $("#CONSIGNEE_State").val('');
            $("#CONSIGNEE_PostalCode").val('');
            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#CONSIGNEE_MobileNo").val('');
            $("#_tempCONSIGNEE_MobileNo").val('');
            $("#CONSIGNEE_MobileNo2").val('');
            $("#CONSIGNEE_Email").val('');
            $("#CONSIGNEE_Fax").val('');
            $("#_tempCONSIGNEE_Fax").val('');
        }
    }

}
function SelectedAWBOriginDestinationItineary(e) {
    if (e == "Text_AWBOrigin") {
        cfi.ResetAutoComplete('ItineraryOrigin');
    }
    if (e == "Text_AWBDestination") {
        cfi.ResetAutoComplete('ItineraryDestination');
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAirportofSelectedAWBOriginDestination",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (e == "Text_AWBOrigin") {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                    }
                    else {
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function CalculatedBUPPieces() {
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    if (Pieces > 0) {
        if ($("#chkIsBUP").prop('checked') == true) {
            if (BUPPieces > Pieces) {
                $("#AWBNoofBUP").val('');
                $("#_tempAWBNoofBUP").val('');
                ShowMessage('warning', 'Information!', "BUP Pieces less than AWB Pieces.");
            }
        }
    }
}
function CalculatedPieces() {
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    if ($("#chkIsBUP").prop('checked') == true) {
        if (Pieces > 0) {
            if (BUPPieces > Pieces) {
                $("#AWBPieces").val('');
                $("#_tempAWBPieces").val('');
                $("#ItineraryPieces").val('');
                $("#_tempItineraryPieces").val('');
                ShowMessage('warning', 'Information!', "AWB Pieces not less than BUP Pieces.");
            }
            else {
                var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                thedivFlightSearchResult.innerHTML = "";
                $("#ItineraryPieces").val(Pieces);
                $("#_tempItineraryPieces").val(Pieces);
            }

            //$("#AWBNoofBUP").val(Pieces);
            //$("#_tempAWBNoofBUP").val(Pieces);
            //$("#ItineraryPieces").val(Pieces);
            //$("#_tempItineraryPieces").val(Pieces);
        }
    }
    else {
        if (Pieces > 0) {
            $("#ItineraryPieces").val(Pieces);
            $("#_tempItineraryPieces").val(Pieces);
            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
            thedivFlightSearchResult.innerHTML = "";
        }
    }
}
function compareGrossVolValue() {
    var gw = $("#AWBGrossWeight").val();
    var vw = $("#AWBVolumeWeight").val();
    var cw = $("#AWBChargeableWeight").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#AWBChargeableWeight").val() == "" ? "0" : $("#AWBChargeableWeight").val()) < chwt) {
        $("#AWBChargeableWeight").val(chwt == 0 ? "" : chwt);
        $("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : chwt);
    }
}
function CalculateGrossVolumeWeight(obj) {

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));


    var chwt = grosswt > AWBVolumeWeight ? grosswt : AWBVolumeWeight;
    $("#AWBChargeableWeight").val(chwt.toFixed(2).toString() == 0 ? "" : chwt.toFixed(2).toString());
    $("#_tempAWBChargeableWeight").val(chwt.toFixed(2).toString() == 0 ? "" : chwt.toFixed(2).toString());
    if (parseFloat(grosswt) > 0) {
        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
        thedivFlightSearchResult.innerHTML = "";
        $("#ItineraryGrossWeight").val(grosswt);
        $("#_tempItineraryGrossWeight").val(grosswt);
    }
}
function CalculateShipmentChWt(obj) {

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var cbm = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var volwt = cbm * 166.66;
    //if ($(obj).attr('id').toUpperCase() == "AWBCBM") {
    //    $("span[id='AWBVolumeWeight']").text(volwt.toFixed(1) == 0 ? "" : volwt.toFixed(1));
    $("#AWBVolumeWeight").val(volwt.toFixed(2) == 0 ? "" : volwt.toFixed(2));
    $("#_tempAWBVolumeWeight").val(volwt.toFixed(2) == 0 ? "" : volwt.toFixed(2));
    $("#ItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    $("#_tempItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    //}
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#AWBChargeableWeight").val(chwt.toFixed(2).toString() == 0 ? "" : chwt.toFixed(2).toString());
    $("#_tempAWBChargeableWeight").val(chwt.toFixed(2).toString() == 0 ? "" : chwt.toFixed(2).toString());
    if (parseFloat(grosswt) > 0) {
        $("#ItineraryGrossWeight").val(grosswt);
        $("#_tempItineraryGrossWeight").val(grosswt);
    }
}
function CalculateShipmentCBM() {
    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var volwt = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var cbm = (volwt / 166.66).toFixed(3);
    $("#AWBCBM").val(cbm.toString() == 0 ? "" : cbm.toString());
    $("#_tempAWBCBM").val(cbm.toString() == 0 ? "" : cbm.toString());
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#AWBChargeableWeight").val(chwt.toString() == 0 ? "" : chwt.toString());
    $("#_tempAWBChargeableWeight").val(chwt.toFixed(2).toString() == 0 ? "" : chwt.toString());
    $("#ItineraryVolumeWeight").val(cbm);
    $("#_tempItineraryVolumeWeight").val(cbm);
    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
    thedivFlightSearchResult.innerHTML = "";
}
function ItineraryPieces() {
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var ItineraryPieces = ($("#ItineraryPieces").val() == "" ? 0 : parseFloat($("#ItineraryPieces").val()));
    var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
    var ItineraryVolumeWeight = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryVolumeWeight = 0;

    var RemainingItineraryGrossWeight = ((parseFloat(ItineraryPieces) * parseFloat(AWBGrossWeight)) / AWBPieces).toFixed(2)
    var RemainingItineraryVolumeWeight = ((parseFloat(ItineraryPieces) * parseFloat(AWBCBM)) / AWBPieces).toFixed(3)

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText);
            }
        });
    }
    ItineraryPieces = parseInt(ItineraryPieces) + parseInt(SelectedItineraryPieces);
    var RemGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
    var RemCBM = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryVolumeWeight)).toFixed(3);
    if (AWBPieces == 0 && ItineraryPieces > 0) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Pieces.");
        return false;
    }
    else if (ItineraryPieces > AWBPieces) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "Itinerary Pieces less than AWB Pieces.");
        return false;
    }

    if (ItineraryPieces == AWBPieces) {
        $("#ItineraryGrossWeight").val(RemGrossWeight);
        $("#_tempItineraryGrossWeight").val(RemGrossWeight);
        $("#ItineraryVolumeWeight").val(RemCBM);
        $("#_tempItineraryVolumeWeight").val(RemCBM);
    }
    else {
        $("#ItineraryGrossWeight").val(parseFloat(RemainingItineraryGrossWeight) < parseFloat(RemGrossWeight) ? parseFloat(RemainingItineraryGrossWeight).toFixed(2) : parseFloat(RemGrossWeight).toFixed(2));
        $("#_tempItineraryGrossWeight").val(parseFloat(RemainingItineraryGrossWeight) < parseFloat(RemGrossWeight) ? parseFloat(RemainingItineraryGrossWeight).toFixed(2) : parseFloat(RemGrossWeight).toFixed(2));
        $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight < RemCBM ? RemainingItineraryVolumeWeight : RemCBM);
        $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight < RemCBM ? RemainingItineraryVolumeWeight : RemCBM);
    }
}
function ItineraryGrossWeight() {
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryVolumeWeight = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText);
            }
        });
    }
    ItineraryGrossWeight = parseFloat(ItineraryGrossWeight) + parseFloat(SelectedItineraryGrossWeight)
    if (AWBGrossWeight == 0 && ItineraryGrossWeight > 0) {
        $("#ItineraryGrossWeight").val('');
        $("#_tempItineraryGrossWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Gross Weight.");
        return false;
    }
    else if (ItineraryGrossWeight > AWBGrossWeight) {
        $("#ItineraryGrossWeight").val('');
        $("#_tempItineraryGrossWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Gross Weight less than AWB Gross Weight.");
        return false;
    }
}
function ItineraryVolumeWeight() {
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var ItineraryVolumeWeight = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryVolumeWeight = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText);
            }
        });
    }
    ItineraryVolumeWeight = parseFloat(ItineraryVolumeWeight) + parseFloat(SelectedItineraryVolumeWeight)
    if (AWBCBM == 0 && ItineraryVolumeWeight > 0) {
        $("#ItineraryVolumeWeight").val('');
        $("#_tempItineraryVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Volume (CBM).");
        return false;
    }
    else if (ItineraryVolumeWeight > AWBCBM) {
        $("#ItineraryVolumeWeight").val('');
        $("#_tempItineraryVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Volume Weight less than AWB Volume (CBM).");
        return false;
    }
}

function ShipmentSearch() {

    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val().trim();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val().trim();
    var FlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";

    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    // Temporary Set values
    //FlightDate = "2015-10-15";
    var ReferenceNo = $("#searchReferenceNo").val() == "" ? "0" : $("#searchReferenceNo").val().trim();
    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CityCode;

    if (_CURR_PRO_ == "RESERVATIONBOOKING") {
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/ReservationBookingService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking/" + OriginCity.trim() + "/" + DestinationCity.trim() + "/" + FlightNo.trim() + "/" + FlightDate.trim() + "/" + AWBPrefix.trim() + "/" + AWBNo.trim() + "/" + LoggedInCity.trim() + "/" + ReferenceNo.trim());
    }

    // Remove extra blank row
    if ($("#divShipmentDetails > table > tbody >tr:eq(1)").attr("align") != "") {
        $("#divShipmentDetails > table > tbody >tr:eq(1)").remove();
    }
    //$("div[class='k-grid-content']").find("table tr").each(function () {
    //    $(this).find("td:eq(4)").css("display", "none");
    //});
    //$('#divShipmentDetails  tbody  tr').each(function (row, tr) {
    //    $(this).find("div[class='k-grid-header']").find('thead tr')
    //});
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

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
}

function BindSubProcess() {
    AutoShipmentSearch(currentprocess);
    $("#divShipmentDetails").find("div[class='k-grid k-widget'] > div.k-grid-header > div > table > thead > tr > th:nth-child(2) > a.k-grid-filter > span").remove();
    HighLightGridButton($(".k-grid").find("table tr").find("td:contains('" + (currentawbsno == 0 ? "~" : currentawbsno) + "')").closest("tr").find("input[process='" + currentprocess.toUpperCase() + "']"));

    var grid = $("#divShipmentDetails div[data-role='grid']").data('kendoGrid');
    var pager = grid.pager;
    pager.unbind('change').bind('change', fn_pagechange);

    function fn_pagechange(e) {
        currentawbsno = 0;
        currentawbno = "";
    }
}

function AutoShipmentSearch(SubProcess) {

    //var gridPage = $(".k-pager-input").find("input").val();
    //var grid = $(".k-grid").data("kendoGrid");
    //grid.dataSource.page(gridPage);
    var a = false;
    $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
        if ($(e).text() != "" && $(e).text() != "0") {
            if ($(e).text() == currentawbsno) {
                //var SubProcess = "WEIGHINGMACHINE";
                //$(e).parent().find("[process=" + SubProcess + "]").click(); return false;
                a = true;
                BindEvents($(e).parent().find("[process=" + SubProcess.toUpperCase() + "]"), event); return false;
            }
        }
    });
    if (a == false) {
        CleanUI();
    }
}

function BindEvents(obj, e, isdblclick) {
    $("#MainDiv").remove()
    $("#ApplicationTabs-1").html('');
    $("#ApplicationTabs-2").html('');
    $("#ApplicationTabs-3").html('');
    $("#ApplicationTabs-4").html('');
    $("#ApplicationTabs-5").html("");
    $("#ApplicationTabs").show();
    //if ($(obj).attr("class") == "dependentprocess")
    //    _IS_DEPEND = true;
    //else
    //    _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        $("#ApplicationTabs-1").html("");
        $("#ApplicationTabs-2").html("");
        $("#ApplicationTabs-3").html("");
        $("#ApplicationTabs-4").html("");
        $("#ApplicationTabs-5").html("");
        $("#ApplicationTabs").hide();
        ResetDetails();
        $("#hdnBookingSNo").val('');
        $("#hdnBookingMasterRefNo").val('');
        currentawbsno = 0;
        currentawbno = "";
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#btnNew").css("display", "block");
        cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
    });
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var AWBStatusNoIndex = 0;
    var AWBSNoIndex = 0;
    var AWBReferenceBookingSNoIndex = 0;
    var BookingRefNoIndex = 0;
    var OriginIndex = 0;
    var DestinationIndex = 0;
    var AWBStatusIndex = 0;
    var AwbnoIndex = 0;
    var PrefixIndex = 0;


    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    AWBStatusNoIndex = trLocked.find("th[data-field='AWBStatusNo']").index();
    AWBSNoIndex = trLocked.find("th[data-field='AWBSNo']").index();
    AWBReferenceBookingSNoIndex = trLocked.find("th[data-field='AWBReferenceBookingSNo']").index();
    AwbnoIndex = trLocked.find("th[data-field='AWBNo']").index();
    PrefixIndex = trLocked.find("th[data-field='AWBPrefix']").index();
    BookingRefNoIndex = trLocked.find("th[data-field='BookingRefNo']").index();
    OriginIndex = trLocked.find("th[data-field='Origin']").index();
    DestinationIndex = trLocked.find("th[data-field='Destination']").index();
    AWBStatusIndex = trLocked.find("th[data-field='AWBStatus']").index();

    currentawbsno = closestTr.find("td:eq(" + AWBSNoIndex + ")").text() == "" ? 0 : closestTr.find("td:eq(" + AWBSNoIndex + ")").text();
    AWBReferenceBookingPrimarySNo = closestTr.find("td:eq(" + AWBReferenceBookingSNoIndex + ")").text();
    currentawbno = closestTr.find("td:eq(" + AwbnoIndex + ")").text();
    currentPrefix = closestTr.find("td:eq(" + PrefixIndex + ")").text();
    BookingPrimaryRefNo = closestTr.find("td:eq(" + BookingRefNoIndex + ")").text();
    BookingOrigin = closestTr.find("td:eq(" + OriginIndex + ")").text();
    BookingDestination = closestTr.find("td:eq(" + DestinationIndex + ")").text();
    AWBStatusDetails = closestTr.find("td:eq(" + AWBStatusIndex + ")").text();
    AWBStatusNo = closestTr.find("td:eq(" + AWBStatusNoIndex + ")").text();

    $("#hdnBookingSNo").val(AWBReferenceBookingPrimarySNo);
    $("#hdnBookingMasterRefNo").val(BookingPrimaryRefNo);


    //if (userContext.AgentSNo > 0 && AWBStatusDetails != "Booked") {
    //    ShowMessage('warning', 'Information!', "Already Executed");
    //}
    //else {
    if (AWBStatusDetails == "Booked" || AWBStatusDetails == "Executed" || AWBStatusNo > 5) {
        var CheckITLResult = true;
        if (AWBStatusDetails == "Booked")
            CheckITLResult = CheckITL();
        if (CheckITLResult == true) {
            if (subprocess.toUpperCase() == "EXECUTERESERVATIONBOOKING") {
                if (AWBStatusDetails == "Booked" || AWBStatusDetails == "Executed") {
                    var CheckAWBRouteStatusResult = CheckAWBRouteStatus();
                    if (userContext.GroupName == "ADMIN" && CheckAWBRouteStatusResult.split('~')[1] == '') {
                        //if (userContext.GroupName == "ADMIN") {
                        ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                    }
                    else {
                        if (CheckAWBRouteStatusResult.split('~')[0] == 'true') {
                            //if (CheckAWBRouteStatusResult == true) {
                            ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                        }
                        else {
                            if (CheckAWBRouteStatusResult.split('~')[1] != '')
                                ShowMessage('warning', 'Information!', "Shipment does not allowed to be Execute.");
                            else
                                ShowMessage('warning', 'Information!', "First Confirm Itinerary Route Status.");
                        }
                    }
                }
                else
                    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
            }
            else if (subprocess.toUpperCase() == "EDOXRESERVATIONBOOKING") {
                if (AWBStatusDetails == "Executed")
                    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                else
                    ShowMessage('warning', 'Information!', "First Execute Shipment than E-Dox Process.");
            }
            else if (subprocess.toUpperCase() == "UPDATERESERVATIONBOOKING") {
                if (AWBStatusNo > 4)
                    ShowMessage('warning', 'Information!', "" + AWBStatusDetails + " shipment View from E button.");
                else if (AWBStatusDetails != "Booked")
                    ShowMessage('warning', 'Information!', "Executed shipment update from E button.");
                else
                    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
            }
            else
                ShowProcessDetails(subprocess, isdblclick, subprocesssno);
        }
        else
            ShowMessage('warning', 'Information!', "ITL Time Expired.");
    }
    else
        ShowMessage('warning', 'Information!', "Shipment " + AWBStatusDetails + "");
    //}

}

function ResetDetails(obj, e) {

    $("#ApplicationTabs-1").html("");
    $("#ApplicationTabs-2").html("");
    $("#ApplicationTabs-3").html("");
    $("#ApplicationTabs-4").html("");
    $("#ApplicationTabs-5").html("");
    $('#ApplicationTabs ul:first li:eq(0) a').hide();
    $('#ApplicationTabs ul:first li:eq(1) a').hide();
    $('#ApplicationTabs ul:first li:eq(2) a').hide();
    $('#ApplicationTabs ul:first li:eq(3) a').hide();
    $('#ApplicationTabs ul:first li:eq(4) a').hide();
    $("#divEDox").html("");
}

function CheckAWBRouteStatus() {
    var CheckAWBRouteStatusResult = true + '~' + '';
    //var CheckAWBRouteStatusResult = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckAWBRouteStatus",
        async: false,
        type: "GET",
        dataType: "json",
        data: { BookingSNo: $("#hdnBookingSNo").val() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result.split('~')[0] == "1") {
                        CheckAWBRouteStatusResult = false + '~' + myData.Table0[0].Result.split('~')[1];
                        //if (myData.Table0[0].Result == "1") {
                        //    CheckAWBRouteStatusResult = false ;
                    }
                    else {
                        CheckAWBRouteStatusResult = true + '~' + '';
                        //CheckAWBRouteStatusResult = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return CheckAWBRouteStatusResult;
}
function CheckITL() {
    var CheckITLResult = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckITL",
        async: false,
        type: "GET",
        dataType: "json",
        data: { BookingSNo: $("#hdnBookingSNo").val() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result == "1") {
                        CheckITLResult = false;
                    }
                    else {
                        CheckITLResult = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return CheckITLResult;
}

function ShowProcessDetails(subprocess, isdblclick, subprocesssno) {
    if (subprocess.toUpperCase() == "UPDATERESERVATIONBOOKING") {
        //var Message = cfi.GetAWBLockedEvent(userContext.UserSNo, currentawbsno, "0", "", "", ""); 
        //if (Message == "") {
        FormDataBind('UPDATE', subprocess);
        //    cfi.SaveUpdateLockedProcess(currentawbsno, 0, "", "", userContext.UserSNo, subprocesssno, subprocess, 1, "");
        //}
        //else
        //{
        //    $("#ApplicationTabs-1").html("");
        //    $("#ApplicationTabs-2").html("");
        //    $("#ApplicationTabs-3").html("");
        //    $("#ApplicationTabs-4").html("");
        //    $("#ApplicationTabs-5").html("");
        //    $("#ApplicationTabs").hide();
        //    ResetDetails();
        //    $("#hdnBookingSNo").val();
        //    $("#hdnBookingMasterRefNo").val();
        //    currentawbsno = 0;
        //    $("#btnSave").css("display", "none");
        //    $("#btnUpdate").css("display", "none");
        //    $("#btnCopyBooking").css("display", "none");
        //    $("#btnExecute").css("display", "none");
        //    $("#btnNew").css("display", "block");
        //    return false;
        //}
    }
    if (subprocess.toUpperCase() == "EXECUTERESERVATIONBOOKING") {
        var Message = cfi.GetAWBLockedEvent(userContext.UserSNo, currentawbsno, "0", "", "", "");
        if (Message == "") {
            FormDataBind('EXECUTE', subprocess);
            cfi.SaveUpdateLockedProcess(currentawbsno, 0, "", "", userContext.UserSNo, subprocesssno, subprocess, 1, "");
        }
        else {
            $("#ApplicationTabs-1").html("");
            $("#ApplicationTabs-2").html("");
            $("#ApplicationTabs-3").html("");
            $("#ApplicationTabs-4").html("");
            $("#ApplicationTabs-5").html("");
            $("#ApplicationTabs").hide();
            ResetDetails();
            $("#hdnBookingSNo").val();
            $("#hdnBookingMasterRefNo").val();
            currentawbsno = 0;
            currentawbno = "";
            $("#btnSave").css("display", "none");
            $("#btnUpdate").css("display", "none");
            $("#btnCopyBooking").css("display", "none");
            $("#btnExecute").css("display", "none");
            $("#btnNew").css("display", "block");
            return false;
        }
    }
    if (subprocess.toUpperCase() == "EDOXRESERVATIONBOOKING") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetWebForm/RESERVATIONBOOKING/Shipment/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divEDox").html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("RESERVATIONBOOKING");
                    InitializePage(subprocess, "divEDox", isdblclick, subprocesssno);
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
        cfi.SaveUpdateLockedProcess(currentawbsno, 0, "", "", userContext.UserSNo, subprocesssno, subprocess, 2, "");
    }
}

function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            if (processdata.Table0 != undefined && processdata.Table0.length > 0) {
                var processlist = processdata.Table0;
                var out = '[';
                $.each(processlist, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '", SNo: "' + item.sno + '"}'
                        }
                        else {
                            out = out + '{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '", SNo: "' + item.sno + '"}'
                        }
                    }
                });
            }
            out = out + ']';
            processList = eval(out);

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

function checkProgrss(item, subprocess, displaycaption) {
    //dependentprocess
    //BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_X" + ",") >= 0) {
        return "\"failureprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_X" + ",") >= 0) {
        return "\"failureprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if (item.toUpperCase().indexOf("," + subprocess.toUpperCase() + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }

}

function EnableOtherNog(e) {
    if (($("#" + e).data("kendoAutoComplete").value() || "") == "OTHER") {
        $("#" + e).closest("tr").find("input[id^='NOG']").removeAttr('disabled');
    } else {
        $("#" + e).closest("tr").find("input[id^='NOG']").val('');
        $("#" + e).closest("tr").find("input[id^='NOG']").attr('disabled', 1);
    }

}
function CalculatePieces(obj) {
    //var CurRow = $(obj).closest("tr");
    //var TotalPieces = parseInt(($("#Pieces").val() || 0) == 0 ? ($("#_tempPieces").val() || 0) : ($("#Pieces").val() || 0));
    //var CurrentPieces = parseInt(($(CurRow).find("input[id^='Pieces']").val() || 0) == 0 ? ($(CurRow).find("input[id^='_tempPieces']").val() || 0) : ($(CurRow).find("input[id^='Pieces']").val() || 0));
    //var TotalGrWeight = ($("#GrossWt").val() || 0) == 0 ? ($("#_tempGrossWt").val() || 0) : ($("#GrossWt").val() || 0);

    //var pc = 0;
    //var wt = 0;

    //$("div[id$='divareaTrans_shipment_shipmentnog']").find("[id^='areaTrans_shipment_shipmentnog']").each(function (i, row) {
    //    if (CurRow.index() != (i + 1)) {
    //        pc = pc + parseInt(($(row).find("input[id^='Pieces']").val() || 0) == 0 ? ($(row).find("input[id^='_tempPieces']").val() || 0) : ($(row).find("input[id^='Pieces']").val() || 0));
    //    }
    //});
    //var RemPcs = TotalPieces - pc;

    //if (($(CurRow).find("td[id^='tdSNoCol']").text() || 0) != 5) {
    //    if (TotalPieces - (CurrentPieces + pc) <= 0)
    //        $(CurRow).find("input[id*='Pieces']").val(TotalPieces - pc);
    //    else
    //        $(CurRow).next().find("input[id*='Pieces']").val(RemPcs);

    //    //else if ((pc + $(obj).val()) > TotalPieces) {

    //    //}
    //}
    //else {
    //    $(CurRow).find("input[id*='Pieces']").val(TotalPieces - pc);
    //}

}

function DimPopup() {
    $('div.k-window-actions a:eq(3)').show();
    $('div.k-window-actions a:eq(1)').show();

    var elem = $("#areaTrans_Shipment_Dimensions");
    if (kendo.parseFloat($("#AWBPieces").val()) > 0 || (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL")) {

        if (elem.closest("div").find("[id^='tblDimUnit']").length == 0) {
            elem.closest("div").prepend("<table class='WebFormTable' id='tblDimUnit' style='border-bottom-width:0px'><tr> <td class='formlabel' style='border-bottom-width: 0px;width:15%;'><font color='red'>* </font><span>Dimensions Unit</span></td><td class='formInputcolumn' style='border-bottom-width: 0px;width:15%'><input name='DimensionUnit' tabindex='23' id='DimensionUnit' type='radio' checked='checked' value='1'  class='disablechk'  />Cms <input name='DimensionUnit' tabindex='23' id='DimensionUnit1' class='disablechk'  type='radio' data-valid='required' data-valid-msg='Select Dimension Unit' value='2' />Inches</td><td class='formlabel' style='border-bottom-width: 0px;width:12%'>Total Pieces</td><td class='formInputcolumn' style='border-bottom-width: 0px;width:10%;'><span id='spanTotalPieces' style='text-align:center'></span></td></tr> </table>");
            //elem.closest("div").prepend("<table class='WebFormTable' id='tblDimUnit' style='border-bottom-width:0px'><tr> <td class='formlabel' style='border-bottom-width: 0px;width:15%;'><font color='red'>* </font><span>Dimensions Unit</span></td><td class='formInputcolumn' style='border-bottom-width: 0px;width:15%'><input name='DimensionUnit' tabindex='23' id='DimensionUnit' type='radio' checked='checked' value='1'  class='disablechk'  />Cms <input name='DimensionUnit' tabindex='23' id='DimensionUnit1' class='disablechk'  type='radio' data-valid='required' data-valid-msg='Select Dimension Unit' value='2' />Inches</td><td class='formlabel' style='border-bottom-width: 0px;width:12%'>Total Pieces</td><td class='formInputcolumn' style='border-bottom-width: 0px;width:10%;'><span id='spanTotalPieces' style='text-align:center'></span></td><td class='formlabel' style='border-bottom-width: 0px;width:15%;'><span>Gross Weight</span></td><td class='formInputcolumn' style='border-bottom-width: 0px;width:10%;'><span id='spanDimGrossWt' style='text-align:center' controltype='number'  subtype='weight'>0</span></td><td class='formlabel' style='border-bottom-width: 0px;width:15%'>Volume Weight</td><td class='formInputcolumn' style='border-bottom-width: 0px;width:10%'><span id='calculatedVolumeWeight' style='text-align:center'   controltype='number' subtype='weight'>0</span></td></tr> </table>");
        }
        if (elem.closest("div").find("[id^='SaveButtonTable']").length == 0) {
            if (!(getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL"))
                elem.closest("div").append("<table class='WebFormTable'  id='SaveButtonTable' style='border-top-width: 0px'><tr><td class='formbuttonrow' style='border-top-width: 0px'><input type='button' id='SaveExitDimension'  class='button' value='Save & Exit' onclick='SaveDimension();' tabindex='141' /></td></tr></table>");

        }

        ConvertControlToCulture("tblDimUnit");


        if ($("#hdnDimensionUnit").val() != "") {
            if ($("#hdnDimensionUnit").val() == "Cms")
                $("#DimensionUnit")[0].checked = 'checked';
            else
                $("#DimensionUnit1")[0].checked = 'checked';
            //AssignCultureValue("calculatedVolumeWeight", $("input[id='VolumeWeight']").val());

        }
        //if ($("input[id='VolumeWeight']").val() != "0")
        //    AssignCultureValue("calculatedVolumeWeight", $("input[id='VolumeWeight']").val());

        if (DimSaved == false && getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW") {
            $("#_tempDimPieces").val($("#AWBPieces").val()); $("#DimPieces").val($("#AWBPieces").val());
        }

        //if ($("input[id='GrossWeight']").val() != "0")
        //    AssignCultureValue("spanDimGrossWt", $("input[id='GrossWeight']").val());
        $("#spanTotalPieces").text(($("#AWBPieces").val() == "" || $("#AWBPieces").val() == undefined) ? $("#AWBPieces").text() : $("#AWBPieces").val());
        if (!(getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL")) {
            //CalculateVolume(elem);
            //CalculateTotalGrossWeight(elem);
        }


        cfi.PopUp("divareaTrans_Shipment_Dimensions", "Add Dimension");
    }
    else {
        ShowMessage('warning', 'Information!', "Enter pieces to add Dimension");
    }

    $("input[name='DimensionUnit']").click(function () {
        CalculateVolume(elem);
        CalculatePPVolumeWeightOnUnitChange(elem);

    });
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL") {
        $('.disablechk').attr('disabled', 'disabled');
    }
}
function CalculateVolume(elem, obj) {
    elem = $("#areaTrans_Shipment_Dimensions");
    var divisor = 1;
    if ($("#DimensionUnit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;

    elem.closest("div").find("input[id^='DimPieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        var LengthID = currentId.replace("DimPieces", "Length");
        var WidthID = currentId.replace("DimPieces", "Width");
        var HeightID = currentId.replace("DimPieces", "Height");
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            VolumeCalculation = VolumeCalculation + parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val()) * parseFloat($("#" + LengthID).val() == "" ? "0" : $("#" + LengthID).val()) * parseFloat($("#" + WidthID).val() == "" ? "0" : $("#" + WidthID).val()) * parseFloat($("#" + HeightID).val() == "" ? "0" : $("#" + HeightID).val());
        }
    });

    if (VolumeCalculation != 0) {
        var Weight = cfi.ceil(VolumeCalculation / divisor);
        Weight = (Weight < 1 ? 1 : Weight);
        //AssignCultureValue("calculatedVolumeWeight", Weight);

        AssignCultureValue("VolumeWeight", Weight);

    }
    else {
        AssignCultureValue("VolumeWeight", 0);
        //AssignCultureValue("calculatedVolumeWeight", 0);
    }


    var chargeable = $("span[id='ChargeableWt']").text() == "" ? "0" : $("span[id='ChargeableWt']").text();
    var GreaterWt = 0;
    var Gross = $("span[id='GrossWeight']").text() == "" ? "0" : $("span[id='GrossWeight']").text();
    var Volume = $("input[id='VolumeWeight']").val() == "" ? "0" : $("input[id='VolumeWeight']").val();
    if (kendo.parseFloat(Gross) > kendo.parseFloat(Volume))
        GreaterWt = kendo.parseFloat(Gross);
    else
        GreaterWt = kendo.parseFloat(Volume);
    if (parseFloat($("input[id='ChargeableWt']").val()) != kendo.parseFloat(GreaterWt)) {
        $("#hdnRateSearch").val("");
        $("#TotalLabelRatePerKG").text("");
        AssignCultureValue("TotalAmount", "0");
    }
    //var closestTable = elem.closest("table");
    //var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    //if ((kendo.parseFloat(GreaterWt) > 400) || (kendo.parseFloat(GreaterWt) > 400 && parseInt($("#Pieces").val()) == 1)) {
    //    $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='DimPerPcGrossWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempDimPerPcGrossWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempLength']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempWidth']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempHeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='DimGrossWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("span[id^='DimGrossWeight']")[currentIndexPos].innerHTML = "0.00 kg";
    //    $(closestTable).find("[id^='DimPerPcVolumeWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("span[id^='DimPerPcVolumeWeight']")[currentIndexPos].innerHTML = "0.00 kg";


    //    if (kendo.parseFloat(GreaterWt) > 400)
    //        ShowMessage('warning', 'Information!', "Weight cann't be greater than 400.", "bottom-right");
    //    else if (kendo.parseFloat(GreaterWt) > 400 && parseInt($("#Pieces").val()) == 1)
    //        ShowMessage('warning', 'Information!', "Weight cann't be greater than 400 for one piece.", "bottom-right");

    //}
    if (kendo.parseFloat(GreaterWt) >= 1) {
        AssignCultureValue("ChargeableWt", GreaterWt);

    }
    else {
        var tempChWt = $("input[id='ChargeableWt']").val();
        if (tempChWt == "" || parseFloat(tempChWt) == 0) {
            AssignCultureValue("ChargeableWt", 1);
        }
    }


}
function CalculateTotalGrossWeight(elem) {
    var GrossCalculation = 0;
    elem.closest("div").find("input[id^='DimPieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        //var GrossWeight = currentId.replace("DimPieces", "DimGrossWeight");
        var GrossWeight = currentId;
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            GrossCalculation = GrossCalculation + parseFloat($("#" + GrossWeight).val() == "" ? "0" : $("#" + GrossWeight).val());
        }
        else {
            GrossCalculation = GrossCalculation + parseFloat($("#" + GrossWeight).val() == "" ? "0" : $("#" + GrossWeight).val());
        }
    });
    //var closestTable = elem.closest("table");
    //var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    //if ((GrossCalculation > 400) || (GrossCalculation > 400 && parseInt($("#Pieces").val()) == 1)) {
    //    $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='DimPerPcGrossWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempDimPerPcGrossWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempLength']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempWidth']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='_tempHeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='DimGrossWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("span[id^='DimGrossWeight']")[currentIndexPos].innerHTML = "0.00 kg";
    //    $(closestTable).find("[id^='DimPerPcVolumeWeight']")[currentIndexPos].value = "";
    //    $(closestTable).find("span[id^='DimPerPcVolumeWeight']")[currentIndexPos].innerHTML = "0.00 kg";
    //    if (GrossCalculation > 400)
    //        ShowMessage('warning', 'Information!', "Weight cann't be greater than 400.", "bottom-right");
    //    else if (GrossCalculation > 400 && parseInt($("#Pieces").val()) == 1)
    //        ShowMessage('warning', 'Information!', "Weight cann't be greater than 400 for one piece.", "bottom-right");

    //}
    //else
    //    AssignCultureValue("spanDimGrossWt", RoundCultureValue(GrossCalculation, null, true));
}
function RoundCultureValue(value, formatType, isRound) {
    if (value < 1)
        return 1;
    if (isRound == undefined || isRound == null || isRound == "")
        isRound = true;
    var format = "n2";
    var decimals = 2;
    if (formatType != undefined && formatType != null) {
        if (formatType.toLowerCase() == "weight") {
            format = "#0.00 kg";
        }
        else if (formatType.toLowerCase() == "currency") {
            format = "c";
        }
    }
    if (isRound)
        return kendo.toString(parseFloat(kendo.ceil(kendo.parseFloat(value, "", format).toFixed(decimals)), format, kendo.getCulture()));
    return kendo.toString(parseFloat(kendo.parseFloat(value, "", format)), format, kendo.getCulture());
};
function AssignCultureValue(controlId, value) {
    var kendoNumericSpan = null;
    that = $("span[id='" + controlId + "']").data("kendoNumericTextBox");
    if (that != undefined && kendoNumericSpan != "") {
        that.element.text(kendo.toString(parseFloat(that._parse(value, that.options.defaultCulture)), that.options.format, that.options.culture));
        $("input[id='" + controlId + "']").val(value);
    }
    else {
        that = $("input[id='" + controlId + "']").data("kendoNumericTextBox");
        if (that != undefined && kendoNumericSpan != "") {
            that._change(kendo.toString(parseFloat(that._parse(value, that.options.defaultCulture)), that.options.format, that.options.culture));
        }
    }
};
function SaveDimension() {

    DimSaved = true;
    var elem = $("#areaTrans_Shipment_Dimensions");
    var Pcs = 0;
    var FlagDim = true;
    elem.closest("table").find("[id^='DimPieces']").each(function () {
        var PcID = this.id;
        var Length = PcID.replace("DimPieces", "Length");
        var Width = PcID.replace("DimPieces", "Width");
        var Height = PcID.replace("DimPieces", "Height");
        //var DimPerPcGrossWeight = PcID.replace("DimPieces", "DimPerPcGrossWeight");
        //var DimGrossWeight = PcID.replace("DimPieces", "DimGrossWeight");
        if ($("#" + Length).val() == "" || $("#" + Width).val() == "" || $("#" + Height).val() == "")
            FlagDim = false;

        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });
    if (FlagDim == false) {
        ShowMessage('warning', 'Information!', "Enter Length, Width and Height for Dimensions", "bottom-right");

        return FlagDim;
    }
    if (Pcs == parseInt($("#AWBPieces").val())) {
        cfi.ClosePopUp("divareaTrans_Shipment_Dimensions");
    }
    else {
        ShowMessage('warning', 'Information!', "Dimension pieces does not match to Total Pieces", "bottom-right");

        return false;
    }
    /////// Update Gross Weight /////////////////////
    var GrossCalculation = 0;
    elem.closest("div").find("input[id^='DimPieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        var GrossWeight = currentId.replace("DimPieces", "DimGrossWeight");
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            GrossCalculation = GrossCalculation + parseFloat($("#" + AWBGrossWeight).val());
        }
        else {
            GrossCalculation = GrossCalculation + parseFloat($("#" + AWBGrossWeight).html());
        }
    });
    if (GrossCalculation != 0) {
        //cfi.AssignCultureValue("spanDimGrossWt", cfi.RoundCultureValue(GrossCalculation, null, true));
        cfi.AssignCultureValue("AWBGrossWeight", cfi.RoundCultureValue(GrossCalculation, null, true));
    }
    else {
        cfi.AssignCultureValue("DimGrossWeight", 0);
        //cfi.AssignCultureValue("spanDimGrossWt", 0);
    }
    if (kendo.parseFloat($("input[id='ChargeableWt']").val()) != kendo.parseFloat(GrossCalculation)) {
        $("#hdnRateSearch").val("");
        $("#TotalLabelRatePerKG").text("");
        cfi.AssignCultureValue("TotalAmount", "0");
        cfi.AssignCultureValue("SumOfChargeANDRate", 0);


        var elem = $("#areaTrans_Shipment_Charge");
        $("#divareaTrans_Shipment_Charge").find("[id^='Text_WaybillChargeMasterSNo']").each(function () {
            if (elem.closest("table").find("[id^='Text_WaybillChargeMasterSNo']").length >= 2)
                elem.closest("table").find("[id^='areaTrans_Shipment_Charge_']").remove();
        });
        $("#txtValue").val('');
        $("#_temptxtValue").val('');
        //$('.hidecharge').hide();
        //$('.hidechargeValue').hide();
        $("#Text_WaybillChargeMasterSNo").val('');
        $("#WaybillChargeMasterSNo").val('');
        $("#Text_WaybillChargeTransSNo").val('');
        $("#WaybillChargeTransSNo").val('');

    }
    CalculateVolume(elem);
}
function CancelDimension() {
    if (!(getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL")) {
        var elem = $("#areaTrans_Shipment_Dimensions");
        var closestTable = elem.closest("table");
        var currentIndex = $(closestTable).find("[id^='Length']").length - 1;
        $(closestTable).find("[id^='Length']")[currentIndex].value = "";
        $(closestTable).find("[id^='Width']")[currentIndex].value = "";
        $(closestTable).find("[id^='Height']")[currentIndex].value = "";
        $(closestTable).find("[id^='DimPieces']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempLength']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempWidth']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempHeight']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempDimPieces']")[currentIndex].value = "";
        CalculateVolume(elem);
    }
    cfi.ClosePopUp("divareaTrans_Shipment_Dimensions");
}
function ConvertControlToCulture(obj) {
    if (obj == undefined) {
        $("#" + formid).find("span").each(function () {
            var attr = $(this).attr('controltype');


            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                if (this.innerHTML.toLowerCase().indexOf("rp") < 0) {
                    var controlId = $(this).attr("id");

                    var decimalPosition = cfi.IsValidSpanNumeric(controlId);
                    if (decimalPosition >= -1) {
                        //            $(this).css("text-align", "right");
                        cfi.Numeric(controlId, decimalPosition, true);
                    }
                }
            }
        });
        $("#" + formid).find("input[type='text']").each(function () {
            var attr = $(this).attr('controltype');


            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                if (this.innerHTML.toLowerCase().indexOf("rp") < 0) {
                    var controlId = $(this).attr("id");

                    var decimalPosition = cfi.IsValidNumeric(controlId);
                    if (decimalPosition >= -1) {
                        //            $(this).css("text-align", "right");
                        cfi.Numeric(controlId, decimalPosition);
                    }
                }
            }
        });
    }
    else {
        $("#" + obj).find("span").each(function () {
            var attr = $(this).attr('controltype');

            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                var controlId = $(this).attr("id");

                var decimalPosition = cfi.IsValidSpanNumeric(controlId);
                if (decimalPosition >= -1) {
                    //            $(this).css("text-align", "right");
                    cfi.Numeric(controlId, decimalPosition, true);
                }
            }
        });
        $("#" + obj).find("input[type='text']").each(function () {
            var attr = $(this).attr('controltype');

            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                var controlId = $(this).attr("id");

                var decimalPosition = cfi.IsValidNumeric(controlId);
                if (decimalPosition >= -1) {
                    //            $(this).css("text-align", "right");
                    cfi.Numeric(controlId, decimalPosition);
                }
            }
        });
    }
}

function SearchFlight() {
    if (cfi.IsValidSection("ApplicationTabs-1")) {
        if (true) {
            var theDivSearch = document.getElementById("divFlightSearchResult");
            theDivSearch.innerHTML = "";
            if ($("#hdnIsItineraryCarrierCodeInterline").val() == "0") {
                var RateAvailable = true; // RateAvailableOrNot();
                if (RateAvailable == true) {
                    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                        var result = IsInternationalBookingAgent();
                        if (result == true) {
                            if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                                SearchFlightMode("SearchFlight");
                            }
                            else
                                ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
                        }
                    }
                    else
                        ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");

                    //else
                    //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
                }
                else
                    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
            }
            else {
                if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                    if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                        if ($("#ItineraryInterlineFlightNo").val() != "") {
                            if ($("#ItineraryCarrierCode").val() != "") {
                                if ($("#ItineraryInterlineFlightNo").val() != "" && $("#hdnIsItineraryCarrierCodeInterline").val() == "1") {
                                    var SearchFlightValid = true;
                                    if ($("#hdnFlightDate").val() != "" && $("#ItineraryDate").val() != "") {
                                        var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

                                        var date = $("#hdnFlightDate").val();
                                        var Selecteddate_components = date.split("-");
                                        var Selectedcurrent_day = Selecteddate_components[0];
                                        var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
                                        var Selectedcurrent_year = Selecteddate_components[2];
                                        SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
                                        var SelectedDate = new Date(SelectedDateValue);

                                        var Date1 = $("#ItineraryDate").val();
                                        var Previousdate_components = Date1.split("-");
                                        var Previouscurrent_day = Previousdate_components[0];
                                        var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
                                        var Previouscurrent_year = Previousdate_components[2];
                                        PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
                                        var ItineraryDate = new Date(PreviousDateValue);

                                        if (ItineraryDate < SelectedDate) {
                                            ShowMessage('warning', 'Information!', "Itinerary Flight Date can not be less than Selected Date .");
                                            SearchFlightValid = false;
                                        }
                                    }
                                    if (SearchFlightValid == true) {

                                        var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                                        var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                                        var ItineraryOriginSNo = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key();
                                        var ItineraryDestinationSNo = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key();
                                        var ItineraryOriginCitySNo = 0;
                                        var ItineraryDestinationCitySNo = 0;
                                        $.ajax({
                                            url: "Services/Shipment/ReservationBookingService.svc/GETCitySNofromItinerary",
                                            async: false,
                                            type: "GET",
                                            dataType: "json",
                                            data: {
                                                ItineraryOriginSNo: ItineraryOriginSNo,
                                                ItineraryDestinationSNo: ItineraryDestinationSNo,
                                            },
                                            contentType: "application/json; charset=utf-8", cache: false,
                                            success: function (result) {
                                                if (result.substring(1, 0) == "{") {
                                                    var myData = jQuery.parseJSON(result);
                                                    if (myData.Table0.length > 0) {
                                                        ItineraryOriginCitySNo = myData.Table0[0].OriginCitySNo;
                                                        ItineraryDestinationCitySNo = myData.Table0[0].DestinationCitySNo;
                                                    }
                                                }
                                            },
                                            error: function (xhr) {
                                                var a = "";
                                            }
                                        });
                                        var theDiv = document.getElementById("divFinalSelectedroute");
                                        var table = "";
                                        if (theDiv.innerHTML == "") {
                                            table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Allotment Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "<tr id='Interline_0'><td class='ui-widget-content first'>" + $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val().toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>00:00/00:00</td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td id='RouteStatus' class='ui-widget-content first'></td><td id='Status' class='ui-widget-content first'></td><td id='SoftEmbargoApplied' class='ui-widget-content first'></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_0' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_0\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_0' id='hdnOriginCitySNo_Interline_0' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_0' id='hdnDestinationCitySNo_Interline_0' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_0' id='hdnSoftEmbargo_Interline_0' type='hidden' value=''/></td></tr>";
                                            $("#hdnETDTime").val('00:00');
                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
                                        }
                                        else {
                                            var tableroute = document.getElementById("tblSelectdRouteResult");
                                            var RowID = tableroute.rows.length - 1;
                                            $('#tblSelectdRouteResult').append("<tr id='Interline_" + RowID + "'><td class='ui-widget-content first'>" + $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val().toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>00:00/00:00</td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td id='RouteStatus' class='ui-widget-content first'></td><td id='Status' class='ui-widget-content first'></td><td id='SoftEmbargoApplied' class='ui-widget-content first'></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_" + RowID + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_" + RowID + "\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_" + RowID + "' id='hdnOriginCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_" + RowID + "' id='hdnDestinationCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_" + RowID + "' id='hdnSoftEmbargo_Interline_" + RowID + "' type='hidden' value=''/></td></tr>");
                                            $("#hdnETDTime").val('00:00');
                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "</tbody></table>";
                                            theDiv.innerHTML += table;
                                        }
                                        var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                        if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                    $(tr).find("[id^='Delete_']").css("display", "none");
                                            });
                                        }



                                        var IsmatchAWBOriginCity = false;
                                        var IsmatchAWBDestinationCity = false;
                                        var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
                                        var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
                                        var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
                                        var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
                                        var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
                                        //var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                                        //var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                                        var SelectedItineraryPieces = 0;
                                        var SelectedItineraryGrossWeight = 0;
                                        var SelectedItineraryVolumeWeight = 0;
                                        var RemainingPieces = 0;
                                        var RemainingItineraryGrossWeight = 0;
                                        var RemainingItineraryVolumeWeight = 0;
                                        var table = document.getElementById("tblSelectdRouteResult");
                                        if (table != null && table.rows.length > 1) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                                                    SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                                                    SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                                                    SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText);
                                                }
                                                if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
                                                    IsmatchAWBOriginCity = true;
                                                }
                                                if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
                                                    IsmatchAWBDestinationCity = true;
                                                }
                                            });
                                        }
                                        RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
                                        RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
                                        RemainingItineraryVolumeWeight = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryVolumeWeight)).toFixed(3);
                                        if (SelectedItineraryPieces < AWBPieces) {
                                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
                                            $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
                                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

                                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                            $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
                                            $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
                                        }
                                        else {
                                            if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

                                                $("#ItineraryPieces").val('')
                                                $("#_tempItineraryPieces").val('')
                                                $("#ItineraryGrossWeight").val('')
                                                $("#_tempItineraryGrossWeight").val('')
                                                $("#ItineraryVolumeWeight").val('')
                                                $("#_tempItineraryVolumeWeight").val('')
                                            }
                                            else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                                                $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                                            }
                                            else {
                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                                                $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                                            }
                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

                                        }


                                        //if (Action.toUpperCase() == "NEW") {
                                        var tableSelected = document.getElementById("tblSelectdRouteResult");
                                        if (tableSelected != null && tableSelected.rows.length > 1) {
                                            $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                                                $(tr).find("[id^='RouteStatus']").css("display", "none");
                                                $(tr).find("[id^='Status']").css("display", "none");
                                                $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
                                            });
                                        }
                                        //}

                                    }
                                }
                            }
                            else
                                ShowMessage('warning', 'Information!', "Enter Carrier Code.");
                        }
                        else
                            ShowMessage('warning', 'Information!', "Enter Flight No.");
                    }
                    else
                        ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
                }
                else
                    ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");
            }
        }
    }

}
function SearchTransitFlight() {
    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
        if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
            SearchFlightMode("TransitFlight");
        }
        else
            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Transit Flight.");
    }
    else {
        ShowMessage('warning', 'Information!', "Select Origin Airport, Transit Airport, Destination Airport and Date for Transit Flight.");
    }
}
function ViewRoute() {
    if (cfi.IsValidSection("ApplicationTabs-1")) {
        if (true) {
            var theDivSearch = document.getElementById("divFlightSearchResult");
            theDivSearch.innerHTML = "";
            var RateAvailable = true; // RateAvailableOrNot();
            if (RateAvailable == true) {
                var result = IsInternationalBookingAgent();
                if (result == true) {
                    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                        if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                            if ($("#AWBPieces").val() == $("#ItineraryPieces").val()) {
                                $.ajax({
                                    url: "Services/Shipment/ReservationBookingService.svc/ViewRoute?ItineraryOrigin=" + $("#ItineraryOrigin").val() + '&ItineraryDestination=' + $("#ItineraryDestination").val() + '&AWBPrefix=' + $("#Text_AWBCode").data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        var ViewRouteData = jQuery.parseJSON(result);
                                        var ViewRouteDetailData = ViewRouteData.Table0;
                                        if (ViewRouteDetailData.length > 0) {
                                            var str = "<table  class='WebFormTable'>";
                                            var no = 0;
                                            for (var i = 0; i < ViewRouteDetailData.length; i++) {
                                                no = (i + 1)
                                                str += "<tr><td>" + no + "</td><td><a href='javascript:void(0);' onClick='SelectedRoute(this);' id=" + ViewRouteDetailData[i].Routing + ">" + ViewRouteDetailData[i].Routing + "</a></td></tr>";
                                            }
                                            no = (no + 1)
                                            str += "<tr><td>" + no + "</td><td><a href='javascript:void(0);'  onClick='SelectedRoute(this);' id='Manual'>Manual</a></td></tr>";
                                            str += "</table>";
                                            $("#divViewRoutePopUp").html(str);
                                            cfi.PopUp("divViewRoutePopUp", "Available Route", 300, PopUpOnOpen, PopUpOnClose);
                                        }
                                    }
                                });
                            }
                            else
                                ShowMessage('warning', 'Information!', "Part Shipment not allow from view Route. Search Manually for Part Booking");
                        }
                        else
                            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for view Route.");
                    }
                    else {
                        ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for view Route.");
                    }
                }
                //else
                //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
            }
            else
                ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
        }
    }
}
var SendRouteAaarray = [];
var SelectedRouteValueArray = [];
var SelectedRouteValue = "";
function SelectedRoute(ss) {
    var theDiv = document.getElementById("divFinalSelectedroute");
    theDiv.innerHTML = "";
    var theDiv1 = document.getElementById("divFlightSearchResult");
    theDiv1.innerHTML = "";

    SelectedRouteValue = ss.id;
    SelectedRouteValueArray = [];
    SendRouteAaarray = [];
    SelectedRouteValueArray = SelectedRouteValue.split("-");
    SendRouteAaarray = SelectedRouteValue.split("-");
    CloseViewRoutepopUp();
    if (SelectedRouteValue == "Manual") {
        //$("#Text_ItineraryTransit").data("kendoAutoComplete").enable(true)
    }
    else {
        //cfi.ResetAutoComplete("ItineraryTransit");
        //$("#Text_ItineraryTransit").data("kendoAutoComplete").enable(false)
        SearchFlightMode("SelectedRoute");
    }
}
function SearchFlightMode(Mode) {
    var Goahead = true;
    if (Mode == "SelectedRoute") {
        var TempItineraryDate = "";
        var TempItineraryETDTime = "00:00";
        if ($("#hdnFlightDate").val() != "") {
            var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

            var date = $("#hdnFlightDate").val();
            var Selecteddate_components = date.split("-");
            var Selectedcurrent_day = Selecteddate_components[0];
            var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
            var Selectedcurrent_year = Selecteddate_components[2];
            SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
            var SelectedDate = new Date(SelectedDateValue);

            var Date1 = $("#ItineraryDate").val();
            var Previousdate_components = Date1.split("-");
            var Previouscurrent_day = Previousdate_components[0];
            var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
            var Previouscurrent_year = Previousdate_components[2];
            PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
            var ItineraryDate = new Date(PreviousDateValue);

            if (ItineraryDate > SelectedDate) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";
            }
            else {
                TempItineraryDate = $("#hdnFlightDate").val();
                TempItineraryETDTime = $("#hdnETDTime").val();
            }
        }
        else {
            TempItineraryDate = $("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val();
            TempItineraryETDTime = $("#hdnETDTime").val();
        }
        if (SendRouteAaarray.length > 1) {
            var SecondLegORNot = ISSecondLegORNot(SendRouteAaarray[0], SendRouteAaarray[1]);

            $.ajax({
                url: "Services/Shipment/ReservationBookingService.svc/SearchFlightResultTest",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    Origin: SendRouteAaarray[0],
                    Destination: SendRouteAaarray[1],
                    ItineraryDate: TempItineraryDate,//$("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val(),
                    ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                    ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                    ItineraryTransit: "",
                    ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                    ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                    Product: $("#Product").val() == "" ? 0 : parseFloat($("#Product").val()),
                    Commodity: $("#Commodity").val(),
                    SHCSNo: $("#SHC").val(), //$("#hdnETDTime").val(), //$("#SHC").val(),
                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                    OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    OverrideMCT: $("#chkMCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    IsMCT: SecondLegORNot == false ? 0 : 1,
                    ETD: TempItineraryETDTime //$("#hdnETDTime").val()
                    , SearchFrom: currentawbsno > 0 ? 'E' : 'B',
                    BookingNo: currentawbsno > 0 ? currentPrefix + '-' + currentawbno : $("#hdnBookingMasterRefNo").val()
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    var theDiv = document.getElementById("divFlightSearchResult");
                    theDiv.innerHTML = "";
                    //var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Plan Flights : </td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr/Vol</td><td id='AvailableGrVol' class='ui-widget-header'>Available Gr/Vol</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                    var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Plan Flights : </td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol</td><td class='ui-widget-header'>Allotment Code</td><td class='ui-widget-header'>Max Gross Per Pcs</td><td class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            for (var i = 0; i < myData.Table0.length; i++) {
                                if (myData.Table0[i].OverFlightCapacity == "1")
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'></td></tr>";
                                else
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";

                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select  style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "/" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "/" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "/" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
                            }
                            table += "</tbody></table>";
                            theDiv.innerHTML += table;
                        }
                        else {
                            var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                            theDiv.innerHTML += table;
                        }
                        //if (myData.Table0.length > 0) {
                        //    for (var i = 0; i < myData.Table0.length; i++) {

                        //        cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,AllotmentCode", "DailyFlightAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], null, "contains");
                        //    }
                        //}
                    }
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        }
    }
    else if (Mode == "SearchFlight") {
        var TempItineraryDate = "";
        var TempItineraryETDTime = "00:00";
        if ($("#hdnFlightDate").val() != "") {
            var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

            var date = $("#hdnFlightDate").val();
            var Selecteddate_components = date.split("-");
            var Selectedcurrent_day = Selecteddate_components[0];
            var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
            var Selectedcurrent_year = Selecteddate_components[2];
            SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
            var SelectedDate = new Date(SelectedDateValue);

            var Date1 = $("#ItineraryDate").val();
            var Previousdate_components = Date1.split("-");
            var Previouscurrent_day = Previousdate_components[0];
            var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
            var Previouscurrent_year = Previousdate_components[2];
            PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
            var ItineraryDate = new Date(PreviousDateValue);

            if (ItineraryDate > SelectedDate) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";
            }
            else {
                TempItineraryDate = $("#hdnFlightDate").val();
                TempItineraryETDTime = $("#hdnETDTime").val();
            }
        }
        else {
            TempItineraryDate = $("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val();
            TempItineraryETDTime = $("#hdnETDTime").val();
        }
        var SecondLegORNot = ISSecondLegORNot($("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0], $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0]);

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/SearchFlightResultTest",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                Origin: $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryOrigin").data("kendoAutoComplete").key(),
                Destination: $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryDestination").data("kendoAutoComplete").key(),
                ItineraryDate: TempItineraryDate,//$("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val(),
                ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                ItineraryTransit: "",
                ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                Product: $("#Product").val() == "" ? 0 : parseFloat($("#Product").val()),
                Commodity: $("#Commodity").val(),
                SHCSNo: $("#SHC").val(), //$("#hdnETDTime").val(), //$("#SHC").val(),
                AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                OverrideMCT: $("#chkMCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                IsMCT: SecondLegORNot == false ? 0 : 1,
                ETD: TempItineraryETDTime //$("#hdnETDTime").val()
                , SearchFrom: currentawbsno > 0 ? 'E' : 'B',
                BookingNo: currentawbsno > 0 ? currentPrefix + '-' + currentawbno : $("#hdnBookingMasterRefNo").val()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var theDiv = document.getElementById("divFlightSearchResult");
                theDiv.innerHTML = "";
                //var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Plan Flights : </td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr/Vol</td><td id='AvailableGrVol' class='ui-widget-header'>Available Gr/Vol</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Plan Flights : </td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol</td><td class='ui-widget-header'>Allotment Code</td><td class='ui-widget-header'>Max Gross Per Pcs</td><td class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            if (myData.Table0[i].OverFlightCapacity == "1")
                                table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'></td></tr>";
                            else
                                table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";

                            //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select  style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                            //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                            //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "/" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "/" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "/" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                            //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                            //cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,AllotmentCode", "DailyFlightAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], null, "contains");
                        }
                        table += "</tbody></table>";
                        theDiv.innerHTML += table;
                        //$('#tblFlightSearchResult tr').mouseenter(function () { var header = "#daecf4 !important"; var weight = "bold"; $(this).css("background-color", header).css("font-weight", weight); });
                        //$('#tblFlightSearchResult tr').mouseleave(function () { $(this).removeAttr("style"); });
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }
                    //if (myData.Table0.length > 0) {
                    //    for (var i = 0; i < myData.Table0.length; i++) {
                    //        cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,AllotmentCode", "DailyFlightAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], null, "contains");
                    //    }
                    //}
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    if (userContext.GroupName != "ADMIN") {
        var table = document.getElementById("tblFlightSearchResult");
        if (table != null && table.rows.length > 1) {
            $('#tblFlightSearchResult  tr').each(function (row, tr) {
                $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
            });
        }
    }
    // $("#hdnFlightDate").val('');
}
function SelectdRoute(SelectedRouteID, Mode, Action, AllotSNo, AllotCode, Check, RouteStatus, Status, IsSoftEmbargo) {
    var IsPerPiecesCheckAllow = true;
    var IsConfirmData = true;
    var ULDCheck = true;
    var SoftEmbargo = "0";
    var ItineraryPieces = $("#ItineraryPieces").val();
    var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
    var ItineraryVolumeWeight = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
    //var ItineraryGrossWeight = $("#ItineraryGrossWeight").val();
    //var ItineraryVolumeWeight = $("#ItineraryVolumeWeight").val();
    var MaxGrossPerPcs = parseFloat($("#lblMaxGrossPerPcs_" + SelectedRouteID).text());
    var MaxVolumePerPcs = parseFloat($("#lblMaxVolumePerPcs_" + SelectedRouteID).text());
    var FlightCapacityGrWt = parseFloat($("#lblFlightCapacityGrWt_" + SelectedRouteID).text());
    var FlightCapacityVol = parseFloat($("#lblFlightCapacityVol_" + SelectedRouteID).text());
    var TotalFlightCapacityGrWt = parseFloat($("#hdnOverbookAVLGross_" + SelectedRouteID).val());
    var TotalFlightCapacityVol = parseFloat($("#hdnOverbookAVLVol_" + SelectedRouteID).val());
    var TotalMaxGrossPerPcs = parseFloat($("#lblMaxGrossPerPcs_" + SelectedRouteID).text()) * parseFloat(ItineraryPieces);
    var TotalMaxVolumePerPcs = parseFloat($("#lblMaxVolumePerPcs_" + SelectedRouteID).text()) * parseFloat(ItineraryPieces);


    if (Action.toUpperCase() == "NEW") {
        if ($("#Text_Commodity").data("kendoAutoComplete").key() != "" || $("#Text_SHC").data("kendoAutoComplete").key() != "") {
            $.ajax({
                url: "Services/Shipment/ReservationBookingService.svc/IsPerPiecesCheckAllow",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Commodity").data("kendoAutoComplete").key(),
                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].Result == "0") {
                                IsPerPiecesCheckAllow = false;
                            }
                        }
                    }
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        }


        if (ItineraryGrossWeight > TotalFlightCapacityGrWt) {
            ShowMessage('warning', 'Information!', "Itinerary Gross Weight can not be greater than Flight Capacity Gr. Wt .");
            return false;
        }
        //if (ItineraryVolumeWeight > FlightCapacityVol) {
        if (ItineraryVolumeWeight > TotalFlightCapacityVol) {
            ShowMessage('warning', 'Information!', "Itinerary Volume can not be greater than Flight Capacity Volume .");
            return false;
        }
        if ((ItineraryGrossWeight > TotalMaxGrossPerPcs) && MaxGrossPerPcs != 0 && $("#chkIsBUP").prop('checked') != true && IsPerPiecesCheckAllow == true) {
            ShowMessage('warning', 'Information!', "Gross Weight Per Piece check applicable on Flight.");
            return false;
        }
        if ((ItineraryVolumeWeight > TotalMaxVolumePerPcs) && MaxVolumePerPcs != 0 && $("#chkIsBUP").prop('checked') != true && IsPerPiecesCheckAllow == true) {
            ShowMessage('warning', 'Information!', "Volume Per Piece check applicable on Flight.");
            return false;
        }
    }
    if (kendo.parseFloat($("#ItineraryPieces").val()) <= 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) <= 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) <= 0 && Action.toUpperCase() != "UPDATE") {
        ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
        return false;
    }
    else {
        if (Check == "1") {
            if ($("#chkIsBUP").prop('checked') == true) {
                $.ajax({
                    url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        DailFlightSNo: SelectedRouteID,
                        BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        if (result.substring(1, 0) == "{") {
                            var myData = jQuery.parseJSON(result);
                            if (myData.Table0.length > 0) {
                                if (myData.Table0[0].IsValid != "") {
                                    if (myData.Table0[0].IsValid == "False") {
                                        var ValidMessage = myData.Table0[0].ValidMessage;
                                        ULDCheck = false;
                                        ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                                        return;
                                    }
                                }
                            }
                        }
                    },
                    error: function (xhr) {
                        var a = "";
                    }
                });
            }
            if (ULDCheck == true) {
                $.ajax({
                    url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        DailFlightSNo: SelectedRouteID,
                        AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                        ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                        CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                        ItineraryPieces: $("#ItineraryPieces").val(),
                        ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                        ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                        PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                        SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        if (result.substring(1, 0) == "{") {
                            var myData = jQuery.parseJSON(result);
                            if (myData.Table0.length > 0) {
                                if (myData.Table0[0].IsSoftEmbargo != "") {
                                    if (myData.Table0[0].IsSoftEmbargo != "True") {
                                        var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                        IsConfirmData = false;
                                        ShowMessage('warning', 'Information!', EmbargoName + ' - ' + 'Hard Embargo Applied.');
                                        return;
                                    }
                                    else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                        var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                        IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                        SoftEmbargo = "1";
                                    }
                                    if (IsConfirmData == false) {
                                        return;
                                    }
                                }
                            }
                        }
                    },
                    error: function (xhr) {
                        var a = "";
                    }
                });
            }
        }
        if (IsConfirmData == true && ULDCheck == true) {
            var FlightSearch = true;
            var Selectedflag = false;
            var AllotmentSNo = "";
            var AllotmentCode = "";
            if (Action.toUpperCase() == "NEW") {
                //AllotmentSNo = $("#Text_Allotment_" + SelectedRouteID).data("kendoAutoComplete").key();
                //AllotmentCode = $("#Text_Allotment_" + SelectedRouteID).data("kendoAutoComplete").value();
                AllotmentSNo = $("#DropAllotment_" + SelectedRouteID).val();
                if ($("#DropAllotment_" + SelectedRouteID).val() != '' && $("#DropAllotment_" + SelectedRouteID).val() != null)
                    AllotmentCode = $("#DropAllotment_" + SelectedRouteID).children("option").filter(":selected")[0].innerHTML;
                else
                    AllotmentCode = "";
            }
            else if (Action.toUpperCase() == "UPDATE" || Action.toUpperCase() == "EXECUTE" || Action.toUpperCase() == "COPY") {
                AllotmentSNo = AllotSNo;
                AllotmentCode = AllotCode;
                SoftEmbargo = IsSoftEmbargo;
            }
            var IsSoftEmbargoValue = SoftEmbargo == "1" ? "Yes" : "No";
            if (Mode == "SelectedRoute") {
                if (SendRouteAaarray.length > 1) {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/SelectdRoute",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            DailFlightSNo: SelectedRouteID
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            thedivFlightSearchResult.innerHTML = "";
                            var theDiv = document.getElementById("divFinalSelectedroute");
                            var table = "";
                            if (theDiv.innerHTML == "") {
                                if (Action.toUpperCase() == "COPY")
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                                else
                                    $("#Text_AWBDestination").data("kendoAutoComplete").enable(false);
                                table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Allotment Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                                //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AvailableGrVol' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='AvailableGrVol' class='ui-widget-header'>Flight Capacity Vol</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                                //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr/Vol</td><td id='AvailableGrVol' class='ui-widget-header'>Available Gr/Vol</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                                //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td class='ui-widget-header'>Allocated Gr/Vol</td><td class='ui-widget-header'>Available Gr/Vol</td></tr></thead><tbody class='ui-widget-content'>";
                            }
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    for (var i = 0; i < myData.Table0.length; i++) {
                                        if (theDiv.innerHTML == "") {
                                            table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>";
                                            //table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>";
                                            //table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>";
                                            $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                        }
                                        else {
                                            var tblSelectdRouteResult = document.getElementById("tblSelectdRouteResult");
                                            if (tblSelectdRouteResult != null && tblSelectdRouteResult.rows.length > 1) {
                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    if ($(tr)[0].id == myData.Table0[i].DailyflightSNo) {
                                                        if ($(tr).find("td")[8].innerText == "") {
                                                            $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText) + parseInt($("#ItineraryPieces").val());
                                                            $(tr).find("td")[4].innerText = parseInt($(tr).find("td")[4].innerText) + parseInt($("#ItineraryGrossWeight").val());
                                                            $(tr).find("td")[5].innerText = parseInt($(tr).find("td")[5].innerText) + parseInt($("#ItineraryVolumeWeight").val());
                                                            $(tr).find("td")[8].innerText = AllotmentCode;
                                                            $("#hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "").val(AllotmentSNo);
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                        else if ($(tr).find("td")[8].innerText == AllotmentCode) {
                                                            $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText) + parseInt($("#ItineraryPieces").val());
                                                            $(tr).find("td")[4].innerText = parseInt($(tr).find("td")[4].innerText) + parseInt($("#ItineraryGrossWeight").val());
                                                            $(tr).find("td")[5].innerText = parseInt($(tr).find("td")[5].innerText) + parseInt($("#ItineraryVolumeWeight").val());
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                        else {
                                                            Selectedflag = true;
                                                            FlightSearch = false;
                                                            ShowMessage('warning', 'Information!', "Different Allotment Code can not be use in same Flight.");
                                                            return false;
                                                        }
                                                    }
                                                });
                                                if (Selectedflag == false) {
                                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        if ($(tr).find("td")[2].innerText.split("/")[0] == myData.Table0[i].Origin) {
                                                            $(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>")
                                                            //$(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>")
                                                            //$(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD + "/" + myData.Table0[i].ETA + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>")
                                                            $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                    });
                                                    if (Selectedflag == false) {
                                                        $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>");
                                                        //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                        //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                        $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                        $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                    }
                                                }
                                            }
                                            else {
                                                if (Selectedflag == false) {
                                                    $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>");
                                                    //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                    //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                    $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                    $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                }
                                            }
                                            if (FlightSearch == true)
                                                thedivFlightSearchResult.innerHTML = "";
                                        }
                                    }
                                    if (theDiv.innerHTML == "") {
                                        table += "</tbody></table>";
                                        theDiv.innerHTML += table;
                                    }
                                    var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                    if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                $(tr).find("[id^='Delete_']").css("display", "none");
                                        });
                                    }
                                    SendRouteAaarray.shift();
                                    SearchFlightMode("SelectedRoute");
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
                }
            }
            else {
                SelectedRouteValue = "";
                $.ajax({
                    url: "Services/Shipment/ReservationBookingService.svc/SelectdRoute",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        DailFlightSNo: SelectedRouteID
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        //var CheckAndValidateDataArray = [];
                        //$('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        //    var CheckAndValidateDataArrayItems = {
                        //        ID: $(tr)[0].id,
                        //        Date: $(tr).find("td")[1].innerText,
                        //        Origin: $(tr).find("td")[2].innerText.split("/")[0],
                        //        Destination: $(tr).find("td")[2].innerText.split("/")[1],
                        //        ETD: $(tr).find("td")[6].innerText.split("/")[0],
                        //        ETA: $(tr).find("td")[6].innerText.split("/")[1]
                        //    };
                        //    CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
                        //});
                        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                        //thedivFlightSearchResult.innerHTML = "";
                        var theDiv = document.getElementById("divFinalSelectedroute");
                        var table = "";
                        if (theDiv.innerHTML == "") {
                            if (Action.toUpperCase() == "COPY")
                                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                            else
                                $("#Text_AWBDestination").data("kendoAutoComplete").enable(false);
                            table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Allotment Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                            //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AvailableGrVol' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='AvailableGrVol' class='ui-widget-header'>Flight Capacity Vol</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                            //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr/Vol</td><td id='AvailableGrVol' class='ui-widget-header'>Available Gr/Vol</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                            //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td class='ui-widget-header'>Allocated Gr/Vol</td><td class='ui-widget-header'>Available Gr/Vol</td></tr></thead><tbody class='ui-widget-content'>";
                        }
                        if (result.substring(1, 0) == "{") {
                            var myData = jQuery.parseJSON(result);
                            if (myData.Table0.length > 0) {
                                //if (CheckAndValidateDataArray.length > 0) {
                                //    for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
                                //        if (myData.Table0[i].Destination == CheckAndValidateDataArray[i].Origin) {
                                //            var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

                                //            var Selecteddate_components = myData.Table0[i].FlightDate.split("-");
                                //            var Selectedcurrent_year = Selecteddate_components[0];
                                //            var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
                                //            var Selectedcurrent_day = Selecteddate_components[2];
                                //            SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day + "  " + myData.Table0[i].ETA;
                                //            var SelectedDate = new Date(SelectedDateValue);

                                //            var Previousdate_components = CheckAndValidateDataArray[i].Date.split("-");
                                //            var Previouscurrent_year = Previousdate_components[0];
                                //            var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
                                //            var Previouscurrent_day = Previousdate_components[2];
                                //            PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day + "  " + CheckAndValidateDataArray[i].ETA;
                                //            var PreviousDate = new Date(PreviousDateValue);

                                //            if (SelectedDate >= PreviousDate) {
                                //                alert("End time should exceed the start time");
                                //            }
                                //        }
                                //    }
                                //}
                                for (var i = 0; i < myData.Table0.length; i++) {
                                    if (theDiv.innerHTML == "") {
                                        table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>";
                                        //table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>";
                                        //table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>";
                                        $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                        $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                    }
                                    else {
                                        var tblSelectdRouteResult = document.getElementById("tblSelectdRouteResult");
                                        if (tblSelectdRouteResult != null && tblSelectdRouteResult.rows.length > 1) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if ($(tr)[0].id == myData.Table0[i].DailyflightSNo) {
                                                    if ($(tr).find("td")[8].innerText == "") {
                                                        $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText) + parseInt($("#ItineraryPieces").val());
                                                        $(tr).find("td")[4].innerText = parseInt($(tr).find("td")[4].innerText) + parseInt($("#ItineraryGrossWeight").val());
                                                        $(tr).find("td")[5].innerText = parseInt($(tr).find("td")[5].innerText) + parseInt($("#ItineraryVolumeWeight").val());
                                                        $(tr).find("td")[8].innerText = AllotmentCode;
                                                        $("#hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "").val(AllotmentSNo);
                                                        Selectedflag = true;
                                                        return false;
                                                    }
                                                    else if ($(tr).find("td")[8].innerText == AllotmentCode) {
                                                        $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText) + parseInt($("#ItineraryPieces").val());
                                                        $(tr).find("td")[4].innerText = parseInt($(tr).find("td")[4].innerText) + parseInt($("#ItineraryGrossWeight").val());
                                                        $(tr).find("td")[5].innerText = parseInt($(tr).find("td")[5].innerText) + parseInt($("#ItineraryVolumeWeight").val());
                                                        Selectedflag = true;
                                                        return false;
                                                    }
                                                    else {
                                                        Selectedflag = true;
                                                        FlightSearch = false;
                                                        ShowMessage('warning', 'Information!', "Different Allotment Code can not be use in same Flight.");
                                                        return false;
                                                    }
                                                }
                                            });
                                            if (Selectedflag == false) {
                                                var rowcountforOrigin = 0;
                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    if (rowcountforOrigin == 0) {
                                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                            if ($(tr).find("td")[2].innerText.split("/")[0] == myData.Table0[i].Origin) {
                                                                rowcountforOrigin = parseInt(rowcountforOrigin) + parseInt(1);
                                                            }
                                                        });
                                                    }
                                                    if ($(tr).find("td")[2].innerText.split("/")[0] == myData.Table0[i].Origin) {
                                                        if (row == parseInt(rowcountforOrigin)) {
                                                            $(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>")
                                                            //$(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>")
                                                            //$(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD + "/" + myData.Table0[i].ETA + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>")
                                                            $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                    }
                                                });
                                                if (Selectedflag == false) {
                                                    $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>");
                                                    //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                    //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                    $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                    $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                }
                                            }
                                        }
                                        else {
                                            if (Selectedflag == false) {
                                                $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>");
                                                //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                //$('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/></td></tr>");
                                                $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                            }
                                        }
                                        if (FlightSearch == true)
                                            thedivFlightSearchResult.innerHTML = "";
                                    }
                                }
                                if (theDiv.innerHTML == "") {
                                    table += "</tbody></table>";
                                    theDiv.innerHTML += table;
                                    thedivFlightSearchResult.innerHTML = "";
                                }
                                var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                        if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                            $(tr).find("[id^='Delete_']").css("display", "none");
                                    });
                                }
                            }
                        }
                    },
                    error: function (xhr) {
                        var a = "";
                    }
                });
            }
            if (Action.toUpperCase() == "NEW") {
                var IsmatchAWBOriginCity = false;
                var IsmatchAWBDestinationCity = false;
                var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
                var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
                var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
                var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
                var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
                var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                var SelectedItineraryPieces = 0;
                var SelectedItineraryGrossWeight = 0;
                var SelectedItineraryVolumeWeight = 0;
                var RemainingPieces = 0;
                var RemainingItineraryGrossWeight = 0;
                var RemainingItineraryVolumeWeight = 0;
                var table = document.getElementById("tblSelectdRouteResult");
                if (table != null && table.rows.length > 1) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                            SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                            SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                            SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText);
                        }
                        if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
                            IsmatchAWBOriginCity = true;
                        }
                        if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
                            IsmatchAWBDestinationCity = true;
                        }
                    });
                }
                RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
                RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
                RemainingItineraryVolumeWeight = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryVolumeWeight)).toFixed(3);
                if (SelectedItineraryPieces < AWBPieces) {
                    $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
                    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
                    $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
                    $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

                    $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                    $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                    $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
                    $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
                }
                else {
                    if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

                        $("#ItineraryPieces").val('')
                        $("#_tempItineraryPieces").val('')
                        $("#ItineraryGrossWeight").val('')
                        $("#_tempItineraryGrossWeight").val('')
                        $("#ItineraryVolumeWeight").val('')
                        $("#_tempItineraryVolumeWeight").val('')

                        var FlightDateForRateSearch = "";
                        var FlightNoForRateSearch = "";
                        var AllotmentCODEForRateSearch = "";


                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                            if (row == 0)
                                FlightDateForRateSearch = $(tr).find("td")[1].innerText;
                            FlightNoForRateSearch += $(tr).find("td")[0].innerText + ',';
                        });
                        if (FlightNoForRateSearch != "")
                            FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
                        var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, '');
                        if (RateAvailableNEW != true) {
                            ClearItineraryRoute();
                            ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
                        }


                        //$('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        //    if (row == 0)
                        //        FlightDateForRateSearch = $(tr).find("td")[1].innerText;
                        //    FlightNoForRateSearch += $(tr).find("td")[0].innerText + ',';
                        //    if ($(tr).find("td")[8].innerText != '')
                        //        AllotmentCODEForRateSearch += $(tr).find("td")[0].innerText + '~' + $(tr).find("td")[8].innerText + ',';
                        //});
                        //if (FlightNoForRateSearch != "")
                        //    FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
                        //if (AllotmentCODEForRateSearch != "")
                        //    AllotmentCODEForRateSearch = AllotmentCODEForRateSearch.substring(0, AllotmentCODEForRateSearch.length - 1);
                        //var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, AllotmentCODEForRateSearch);
                        //if (RateAvailableNEW != true) {
                        //    ClearItineraryRoute();
                        //    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
                        //}
                    }
                    else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

                        $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                        $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                        $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                    }
                    else {
                        $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                        $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                        $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                    }
                    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

                }
                //if (userContext.GroupName != "ADMIN") {
                //    var tableSelected = document.getElementById("tblSelectdRouteResult");
                //    if (tableSelected != null && tableSelected.rows.length > 1) {
                //        $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                //            $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                //            $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                //            $(tr).find("[id^='AvailableGrVol']").css("display", "none");
                //        });
                //    }
                //}

            }
            if (Action.toUpperCase() == "NEW" || Action.toUpperCase() == "COPY") {
                var tableSelected = document.getElementById("tblSelectdRouteResult");
                if (tableSelected != null && tableSelected.rows.length > 1) {
                    $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                        $(tr).find("[id^='RouteStatus']").css("display", "none");
                        $(tr).find("[id^='Status']").css("display", "none");
                        $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
                    });
                }
            }
            if (Action.toUpperCase() != "NEW") {
                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                $("#ItineraryPieces").val('')
                $("#_tempItineraryPieces").val('')
                $("#ItineraryGrossWeight").val('')
                $("#_tempItineraryGrossWeight").val('')
                $("#ItineraryVolumeWeight").val('')
                $("#_tempItineraryVolumeWeight").val('')
            }
        }
    }
}
function DeleteRoute(e, DailFlightSNo, Origin, Destination, OriginSNo, DestinationSNo) {
    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
    thedivFlightSearchResult.innerHTML = "";
    $(e).closest('tr').remove();
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(OriginSNo, Origin);

    $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(DestinationSNo, Destination);
    var DailyFlightSNoForDelete = 0;
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryVolumeWeight = 0;
    var RemainingPieces = 0;
    var RemainingItineraryGrossWeight = 0;
    var RemainingItineraryVolumeWeight = 0;
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            DailyFlightSNoForDelete = $(tr)[0].id;
            $("#hdnETDTime").val($(tr).find("td")[6].innerText.split("/")[1]);
            $("#hdnFlightDate").val($(tr).find("td")[1].innerText);
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText);
            }
        });
    }
    RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
    RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
    RemainingItineraryVolumeWeight = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryVolumeWeight)).toFixed(3);
    if (SelectedItineraryPieces < AWBPieces) {
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
        $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
    }
    else {
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true)
        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)
        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
        $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? '' : RemainingItineraryVolumeWeight)
    }
    if (table != null && table.rows.length == 1) {
        //var theDiv = document.getElementById("divFinalSelectedroute");
        //theDiv.innerHTML = "";
        //$("#hdnETDTime").val('00:00');
        //$("#hdnFlightDate").val('');
        ClearItineraryRoute();
    }
    $("#Delete_" + DailyFlightSNoForDelete).css("display", "block");
}

function FillDropAllotment(id, DailyflightSNoVal) {
    //$("#" + id).html("");
    if ($("#" + id).find('option').length == 0) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                DailyFlightSNo: DailyflightSNoVal,
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                ShipperSNo: 0,
                GrossWt: $("#ItineraryGrossWeight").val(),
                Volume: $("#ItineraryVolumeWeight").val(),
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                SHC: $("#Text_SHC").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    //$("#" + id).html("");
                    //$('select[id^="' + id + '"]').append($("<option></option>").html(' '))
                    //$('select[id^="' + id + '"]').append($("<option></option>").val(0).html('--Select--'))
                    if (myData.Table0.length > 0) {
                        for (i = 0; i < myData.Table0.length; i++) {
                            $('select[id^="' + id + '"]').append($("<option id='Allot'></option>").val(myData.Table0[i].AllotmentSNo).html(myData.Table0[i].AllotmentCode))
                            //$('select[id^="' + id + '"]').append($("<option></option>").attr("value", myData.Table0[i].AllotmentSNo).text(myData.Table0[i].AllotmentCode));
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
//var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
//cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, MakeFileMandatory);
function BindAllotmentArray(DailyflightSNoVal) {
    var BindAllotmentArrayViewModel = [];
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: DailyflightSNoVal,
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
            ShipperSNo: 0,
            GrossWt: $("#ItineraryGrossWeight").val(),
            Volume: $("#ItineraryVolumeWeight").val(),
            ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
            SHC: $("#Text_SHC").data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    for (i = 0; i < myData.Table0.length; i++) {
                        var BindAllotmentArrayInfo = {
                            SNo: myData.Table0[i].DailyflightSNo,
                            AllotmentCode: myData.Table0[i].DailyflightSNo
                        };
                        BindAllotmentArrayViewModel.push(BindAllotmentArrayInfo);
                    }
                }
                cfi.AutoCompleteByDataSource("Allotment_" + DailyflightSNoVal, BindAllotmentArrayViewModel);
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });





    //var Arr = FlightDestination.split('-');
    //var FRoute = new Array();
    //var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    //$(Arr).each(function (row, tr) {
    //    if (row > LoginCityIndex)
    //        FRoute.push({ Key: tr, Text: tr })
    //});
    //return FRoute;
}
function BindLocationAutoCompleteForULD(elem, mainElem) {
    var StartTemp = ($(elem).find("input[id^='ULDLocStartTemp']").val() || "0") == 0 ? ($(elem).find("input[id^='_tempULDLocStartTemp']").val() || "0") : ($(elem).find("input[id^='ULDLocStartTemp']").val() || "0");
    var EndTemp = ($(elem).find("input[id^='ULDLocEndTemp']").val() || "0") == 0 ? ($(elem).find("input[id^='_tempULDLocEndTemp']").val() || "0") : ($(elem).find("input[id^='ULDLocEndTemp']").val() || "0");

    var StartTemp2 = ($(mainElem).find("input[id^='ULDLocStartTemp']").val() || "0") == 0 ? ($(mainElem).find("input[id^='_tempULDLocStartTemp']").val() || "0") : ($(mainElem).find("input[id^='ULDLocStartTemp']").val() || "0");
    var EndTemp2 = ($(mainElem).find("input[id^='ULDLocEndTemp']").val() || "0") == 0 ? ($(mainElem).find("input[id^='_tempULDLocEndTemp']").val() || "0") : ($(mainElem).find("input[id^='ULDLocEndTemp']").val() || "0");

    $(elem).find("input[id^='ULDLocation']").each(function () {
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], DisableOther, "contains", null, null, null, "spReservation_GetLocation", null, StartTemp, EndTemp);
    });

    $(mainElem).find("input[id^='ULDLocation']").each(function () {
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], DisableOther, "contains", null, null, null, "spReservation_GetLocation", null, StartTemp2, EndTemp2);
    });
    $(elem).find("input[id^='Text_ULDLocation']").each(function () {
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], DisableOther, "contains", null, null, null, "spReservation_GetLocation", null, StartTemp, EndTemp);
    });
}
var Locationurl = 'Services/AutoCompleteService.svc/AutoCompleteDataSourcebyAWB';
function LocationAutoComplete(currentawbsno, textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, StartTemp, EndTemp) {
    var keyId = textId;
    textId = "Text_" + textId;
    $("div[id^='" + textId + "-list']").remove();

    //if (IsValid(textId, autoCompleteType)) {
    if (keyColumn == null || keyColumn == undefined)
        keyColumn = basedOn;
    if (textColumn == null || textColumn == undefined)
        textColumn = basedOn;
    var dataSource = GetLocationAutoCompleteDataSource(currentawbsno, textId, tableName, keyColumn, textColumn, templateColumn, procName, Locationurl, StartTemp, EndTemp);
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
    //}
}
function GetLocationAutoCompleteDataSource(currentawbsno, textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, StartTemp, EndTemp) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? url : newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    currentawbsno: currentawbsno,
                    StartTemp: StartTemp,
                    EndTemp: EndTemp
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

function AWBPrint() {
    if (currentawbsno > 0)
        window.open("awbprintA4.html?sno=" + currentawbsno + "&pagename=ReservationBooking");
    else
        jAlert("AWB not generated");
}
function AWBLabel() {
    if (currentawbsno > 0)
        window.open("HtmlFiles\\Shipment\\Label.html?Sno=" + currentawbsno);
    else
        jAlert("Enter AIR WAYBILL Details to print AWB label.", "Warning - AWB Label");
}

function CloseViewRoutepopUp() {
    var window = $("#divViewRoutePopUp");
    window.data("kendoWindow").close();
}
function PopUpOnOpen(cntrlId) {
    return false;
}
function PopUpOnClose(cntrlId) {
    return false;
}
var NogDiv = '<div id="divareaTrans_shipment_shipmentnog" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Commodity"><span id="spnNOG"> Commodity</span></td><td class="formHeaderLabel" title="Other Commodity"><span id="spnOtherNOG">Other</span></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods" id="OtherNatureofGoods" value=""><input type="text" class="" name="Text_OtherNatureofGoods" id="Text_OtherNatureofGoods" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_0" id="OtherNatureofGoods_0" value=""><input type="text" class="" name="Text_OtherNatureofGoods_0" id="Text_OtherNatureofGoods_0" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_1" id="OtherNatureofGoods_1" value=""><input type="text" class="" name="Text_OtherNatureofGoods_1" id="Text_OtherNatureofGoods_1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_2" id="OtherNatureofGoods_2" value=""><input type="text" class="" name="Text_OtherNatureofGoods_2" id="Text_OtherNatureofGoods_2" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_3" id="OtherNatureofGoods_3" value=""><input type="text" class="" name="Text_OtherNatureofGoods_3" id="Text_OtherNatureofGoods_3" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_4"><td id="tdSNoCol_4" class="formSNo snowidth" style="" name="_4">6</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_4"  onblur="CalculatePieces(this);" id="Pieces_4" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_4" id="NogGrossWt_4" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_4" id="OtherNatureofGoods_4" value=""><input type="text" class="" name="Text_OtherNatureofGoods_4" id="Text_OtherNatureofGoods_4" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_4" id="NOG_4" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_5"><td id="tdSNoCol_5" class="formSNo snowidth" style="" name="_5">7</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_5"  onblur="CalculatePieces(this);" id="Pieces_5" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_5" id="NogGrossWt_5" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_5" id="OtherNatureofGoods_5" value=""><input type="text" class="" name="Text_OtherNatureofGoods_5" id="Text_OtherNatureofGoods_5" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_5" id="NOG_5" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_6"><td id="tdSNoCol_6" class="formSNo snowidth" style="" name="_6">8</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_6"  onblur="CalculatePieces(this);" id="Pieces_6" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_6" id="NogGrossWt_6" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_6" id="OtherNatureofGoods_6" value=""><input type="text" class="" name="Text_OtherNatureofGoods_6" id="Text_OtherNatureofGoods_6" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_6" id="NOG_6" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_7"><td id="tdSNoCol_7" class="formSNo snowidth" style="" name="_7">9</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_7"  onblur="CalculatePieces(this);" id="Pieces_7" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_7" id="NogGrossWt_7" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_7" id="OtherNatureofGoods_7" value=""><input type="text" class="" name="Text_OtherNatureofGoods_7" id="Text_OtherNatureofGoods_7" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_7" id="NOG_7" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_8"><td id="tdSNoCol_8" class="formSNo snowidth" style="" name="_8">10</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_8"  onblur="CalculatePieces(this);" id="Pieces_8" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_8" id="NogGrossWt_8" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_8" id="OtherNatureofGoods_8" value=""><input type="text" class="" name="Text_OtherNatureofGoods_8" id="Text_OtherNatureofGoods_8" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_8" id="NOG_8" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_9"><td id="tdSNoCol_9" class="formSNo snowidth" style="" name="_9">11</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_9"  onblur="CalculatePieces(this);" id="Pieces_9" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_9" id="NogGrossWt_9" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_9" id="OtherNatureofGoods_9" value=""><input type="text" class="" name="Text_OtherNatureofGoods_9" id="Text_OtherNatureofGoods_9" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_9" id="NOG_9" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '</tbody></table>'
    + '</div>'
var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px' id='btnNew'>New Booking</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSave'>Save</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnUpdate'>Update</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnExecute'>Execute</button></td>" +
                            "<td> <button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnCopyBooking'>Copy</button></td>" +
                            //"<td><button class='btn btn-block btn-success btn-sm' onclick='AWBPrint()'  id='btnAWBPrint'>AWB Print</button></td>" +
                            //"<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +

                        "</tr></tbody></table> </div>";

var divContent = "<div class='rows'> <table style='width:100%'><input type='hidden' id='hdnBookingMasterRefNo'/><input type='hidden' id='hdnBookingSNo'/><input type='hidden' id='hdnPreviousBookingMasterRefNo'/><input type='hidden' id='hdnPreviousBookingSNo'/><input type='hidden' id='hdnShipperSNo'/><input type='hidden' id='hdnConsigneeSNo'/> <tr> <td valign='top' class='td100Padding'><div id='divViewRoutePopUp' style='width:100%'></div><div id='divShipmentDetails' style='width:100%'></div><div id='pWindow'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div><div id='divEDox' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td colspan='3'></td></tr><tr> <td id='IdAWBPrint' colspan='3' class='tdInnerPadding'>Print &nbsp;&nbsp;&nbsp;&nbsp;<select id='sprint' ><option value='AWB' selected>AWB</option><option value='CSD'  selected>eCSD</option><option value='AWBLabel'>AWB Label</option><option value='AcceptanceNote'>Acceptance Note</option><option value='PReceipt'>Payment Receipt</option><option value='Checklist'>Check List</option></select>&nbsp;<button name='button' onclick='bprint();' value='OK type='button'>Print</button></td></tr><tr id='trAmmendment'> <td>FWB Amendment</td><td>:</td><td><input type='checkbox' name='chkFWBAmmendMent' id='chkFWBAmmendMent'  onclick='ToggleCharge(this)'></td></tr><tr id='trAmmendmentCharge'> <td>Levy Amendment Charges</td><td>:</td><td><input type='checkbox' name='chkAmmendMentCharge' id='chkAmmendMentCharge' disabled></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";//<option value='EDI'>EDI Messages</option>
var rpl = "<ul id='ulReservation' style='display:none;'> <li class='k-state-active'> Reservation </li><li> Dimension </li><li>Rate</li><li>Message</li></ul> <div> <div id='ApplicationTabs-1'></div></div><div> <div id='ApplicationTabs-2'> </div></div><div><div id='ApplicationTabs-3'></div></div><div><div id='ApplicationTabs-4'></div></div>";
var SubGroupDiv = '<div id="divareaTrans_shipment_shipmentSHCSubGroup" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="SubGroupSNo" name="SubGroupSNo">SNo</td><td class="formHeaderLabel" title="SHC"><span id="spnSHC"> SHC</span></td><td class="formHeaderLabel" title="Sub Group"><span id="spnSubGriup"> Sub Group</span></td>  <td class="formHeaderLabel" title=""><span id="spnLabel"></span></td><td class="formHeaderLabel" title="Mandatory Info"><span id="spnStatement"> Mandatory Info</span></td><td class="formHeaderLabel" title=""><span id="spnpackLabel" style="width: 150px;"></span></td> <td class="formHeaderLabel" title="Packing Instruction"><span id="spnPacking">Packing Instruction</span></td>   </tr>'
    + '</tbody></table>'
    + '</div>'




//=======================================-------------------Applied  Spot Code Start From Here By AKAsh --------------------------------------

var AWBInformation = "<div id='Window' style='height: 400px;'><fieldset> " +
  "<legend>AWB Information :</legend><table id='AWBInformationwindow' style='Margin-top: 10px;Margin-bottom: 10px;    height: auto;' class='appendGrid ui-widget'> " +
    "<tr><th>AWB No</th><th style='width: 100px;'><label id='lblAWBNo'></th>" +
     "<th>Origin</th><th style='width: 100px;'><label id='lblOrigin'></th>" +
    "<th>Destination</th><th style='width: 100px;'><label id='lblDestination'></th>" +
    "<th>Pieces</th><th style='width: 100px;'><label id='lblPieces'></th>" +
    "</tr><tr>" +
    "<th>Gr. Weight</th><th style='width: 100px;'><label id='lblGrossWeight'></th>" +
    "<th>Volume</th><th style='width: 100px;'><label id='lblVolume'></th>" +
    "<th>Ch. Weight</th><th style='width: 100px;'><label id='lblChargableWeight'></th>" +
    "<th>Product</th><th style='width: 100px;'><label id='lblProduct'></th>" +
    "</tr><tr>" +
    "<th>Commodity</th><th style='width: 100px;'><label id='lblCommodity'></th>" +

    "<th>Nature Of Goods</th><th><label id='lblNatureOfGoods'></th>" +
     "<th></th><th style='width: 100px;'><label id=''></th>" +
      "<th></th><th style='width: 100px;'><label id=''></th></tr>" +
    "</table></fieldset> " +

  "<fieldset><legend>Rate Information :</legend><table id='RateInformationwindow' style='Margin-top: 10px;Margin-bottom: 10px;height: auto;' class='appendGrid ui-widget'> " +
    "<tr><th style='width: 200px;'>Rate</th><th style='width: 200px;'><label id='lblRate'></th>" +
    "<th style='width: 200px;'>Freight Amount</th><th style='width: 200px;'><label id='lblFreightAmount'></th></tr>" +
    "</table></fieldset> " +

  "<fieldset><legend>Code Information :</legend>" +
  "<input type='radio' name='CodeInformation' onchange='BindSpotCode(this.id)'  id='SpotCode' value='0'>Spot Code <input type='radio' name='CodeInformation' onchange='BindCampaignCode(this.id)' id='CampaignCode' value='1'>Campaign Code </input>" +

  "<div id='BindSpotCode' style='float: right;width: 500px;'></div></fieldset>" +

  "<div style='Margin-top: 10px;Margin-bottom: 10px;height: auto;'><input type='button' class='btn btn-success' id='BtnAppliedCode' onclick='SpotCodeApplied()'   style='width:120px;' value='Apply Code' /><input type='hidden'  name='hdnOriginCitySNo' id='hdnOriginCitySNo' /><input type='hidden'  name='hdnDestinationCitySNo' id='hdnDestinationCitySNo' /></div></div>";


function ApplySpotCode() {

    $('#Window').remove();

    $('#SectorRate ,#RequestedRate').removeAttr('data-valid');
    $('#_tempRequestedRate ,#_tempSectorRate').removeClass("valid_invalid", "bVErrMsgContainer");

    $('#tblApplySpotCode').append(AWBInformation);
    $('#Window th').addClass('ui-widget-header');
    $('#Window td').addClass('ui-widget-content');
    $('#Window td').css("text-align", "center");
    var AWBCode = $('#Text_AWBCode').val() || 0
    var AWBnumber = $('#AWBNumber').val() || 0
    var Modeldata = {
        AWBNo: AWBCode + '-' + AWBnumber
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAWbForSpotRate",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ spotRate: Modeldata }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {



            if (result != undefined) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $('#lblAWBNo').text(myData.Table0[0].AWBNo);
                        $('#lblOrigin').text(myData.Table0[0].Text_OriginCitySNo);
                        $('#lblDestination').text(myData.Table0[0].Text_DestinationCitySNo);
                        $('#lblPieces').text(myData.Table0[0].TotalPieces);

                        $('#lblGrossWeight').text(myData.Table0[0].TotalGrossWeight);
                        $('#lblVolume').text(myData.Table0[0].TotalCBM);
                        $('#lblChargableWeight').text(myData.Table0[0].TotalChargeableWeight);
                        $('#lblProduct').text(myData.Table0[0].ProductName);

                        $('#lblCommodity').text(myData.Table0[0].CommodityCode);
                        $('#lblNatureOfGoods').text(myData.Table0[0].NatureOfGoods);


                        $('#lblRate').text(myData.Table0[0].MKTRate);
                        $('#lblFreightAmount').text(myData.Table0[0].MKTFreight);
                        $('#hdnOriginCitySNo').val(myData.Table0[0].OriginCitySNo)

                        $('#hdnDestinationCitySNo').val(myData.Table0[0].DestinationCitySNo)
                    }
                }

                cfi.PopUp("Window", "View Spot Details");
                //$('div.k-window').css('width', '950px');
                //$('div.k-window').css('margin-left', '80.611px ! important');
            }
        }
    });

}



function BindSpotCode(Elem) {
    if (document.getElementById(Elem).value == 0) {
        //$('#BindSpotCode').remove(SpotCode);
        $('#InnerBindSpotCode').remove();
        $('#BindSpotCode').append('<div id="InnerBindSpotCode"></div>');

        //$('#InnerBindSpotCode').append("<input type='hidden'  name='SpotCodeSNo' id='SpotCodeSNo'><input type='text' name='Text_SpotCodeSNo'  id='Text_SpotCodeSNo' style='text-transform: uppercase;width:190px;' controltype='autocomplete' data-role='autocomplete' autocomplete='off'>");        
        //cfi.AutoComplete("SpotCodeSNo", "SpotCode", "RateAirlineAdhocRequest", "SNo", "SpotCode", null, null, "contains");

        $('#InnerBindSpotCode').append("<select style='width:200px'  id='Text_SpotCodeSNo'></select><input name='SpotCodeSNo' id='SpotCodeSNo' type='hidden' value=''/>");
        FillSpotCode();

    } else {


    }
}
function BindCampaignCode(Elem) {
    if (document.getElementById(Elem).value == 1) {
        //$('#BindSpotCode').remove(SpotCode);
        $('#InnerBindSpotCode').remove();
        $('#BindSpotCode').append('<div id="InnerBindSpotCode"></div>');


        $('#InnerBindSpotCode').append("<input type='text' name='Text_CampaignCode' class='k-input' autofocus= 'autofocus' id='Text_CampaignCode' style='text-transform: uppercase;width:190px;'/> ");

    } else {
        //$('#ccTopp').removeAttr("disabled");
        //alert('againclick');

    }
}


//-------------------------- Click On Applied Code

function SpotCodeApplied() {

    var CodeType = $('input[type=radio][name="CodeInformation"]:checked').val();

    //CodeType == 0 //Spot Code 
    //CodeType == 1 //Campaign Code

    var Modeldata = {
        AWbSNo: currentawbsno || 0,
        OriginSno: $('#hdnOriginCitySNo').val() || 0,
        DestinationCitySno: $('#hdnDestinationCitySNo').val() || 0,
        Pieces: $('#lblPieces').text() || 0,
        GrossWeight: $('#lblGrossWeight').text() || 0,
        Volume: $('#lblVolume').text() || 0,
        ChargeableWeight: $('#lblChargableWeight').text() || 0,
        SpotCode: $("#Text_SpotCodeSNo option:selected").text(),
        SpotSno: $("#Text_SpotCodeSNo").val() || 0,
        UpdatedBy: userContext.UserSNo,
        CodeType: CodeType,
        CampaignCode: $('#Text_CampaignCode').val() || 0,
        AccountSNo: $('#AWBAgent').val() || 0

    }
    if ($('input[type=radio][name="CodeInformation"]:checked').val() != undefined) {

        if (CodeType == 0 && $('#Text_SpotCodeSNo').val() == "") {
            ShowMessage('warning', 'Warning - Apply Spot Code!', "Select Spot Code !.");
            return false;
        }
        if (CodeType == 1 && $('#Text_CampaignCode').val() == "") {

            ShowMessage('warning', 'Warning - Apply Spot Code!', "Please Enter Campaign Code !.");
            return false;
        }


        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/SpotCodeApplied",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ spotCodeApplied: Modeldata }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result != undefined) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            var Result = myData.Table0[0].Result;
                            //

                            if (Result == 'Single Code Applied Successfully.' || Result == 'Campaign Code Applied Successfully. !' || Result == 'Spot Code Applied Successfully.') {
                                ShowMessage('success', 'Success - Reservation', Result, "bottom-right");
                                CloseSpotCodeAppliedPopup();
                            }
                            else {
                                ShowMessage('warning', 'warning - Reservation', Result, "bottom-right");
                            }

                            //alert(myData.Table0[0].Result);
                        }
                    }
                }
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Apply Spot Code!', "Please select Either  Spot code or  campaign code .");
    }
}

function CloseSpotCodeAppliedPopup() {
    var window = $("#Window");
    window.data("kendoWindow").close();
}





//else if (textId.indexOf("Text_SpotCodeSNo") >= 0) {
//    var ConsigneeFilter2 = cfi.getFilter("AND");      


//    cfi.setFilter(ConsigneeFilter2, "AccountSNo", "eq", userContext.AgentSNo);
//    cfi.setFilter(ConsigneeFilter2, "OriginCitySNo", "eq", userContext.CitySNo);
//    cfi.setFilter(ConsigneeFilter2, "DestinationCitySNo", "eq", $('#AWBDestination').val());
//    cfi.setFilter(ConsigneeFilter2, "IsApplied", "eq", 0);
//    cfi.setFilter(cfi.getFilter("OR"), "AWBSNo", "eq", currentawbsno);

//    ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
//    return ConsigneeFilter;
//}

function FillSpotCode() {


    if ($("#Text_SpotCodeSNo").find('option').length == 0) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/BindSpotCode",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AccountSNo: $('#AWBAgent').val(),
                OriginCitySNo: $('#AWBOrigin').val(),
                DestinationCitySNo: $('#AWBDestination').val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $("#Text_SpotCodeSNo").append("<option value='0'>Select Spot Code</option>");
                        for (i = 0; i < myData.Table0.length; i++) {
                            $('select[id^="Text_SpotCodeSNo"]').append($("<option id='SpotCodeBind'></option>").val(myData.Table0[i].SNo).html(myData.Table0[i].SpotCode))
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

}


