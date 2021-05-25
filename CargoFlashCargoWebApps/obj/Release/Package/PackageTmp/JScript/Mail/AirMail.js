/// <reference path="../../Services/Mail/AirMailService.svc" />
/// <reference path="../../Scripts/references.js" />

var paymentList = null;
var currentprocess = "";
var CurrentAirMailSNo = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var _IS_DEPEND = false;
var _IS_CustomerKlas = false;
var BillTo = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }, { Key: "2", Text: "Both" }];
var MovementType = "";

$(function () {

    MovementType = getParameterByName("MovementType", ""); //1=> Import, 2=>Export
    AirMailList();

    $('#Text_ShipmentOrigin').on('autocompletechange change', function () {

        $('#Text_IssuingAgent').val('');
        $('#IssuingAgent').val('');
    }).change();

});

function addBtnClass() {
    if ($('#divAirMailDetails').length > 0) {
        $("[title='Airmail Details']").addClass('btn btn-success');

        $("[title='Customer']").addClass('btn btn-success');

        $("[title='CN35']").addClass('btn btn-success');
        $("[title='Airmail Payment']").addClass('btn btn-success');
        $("[title='AirMail Label']").addClass('btn btn-inverse');
    }
}

function CalculatedPieces() {
    var Pieces = ($("#TotalPieces").val() == "" ? 0 : parseFloat($("#TotalPieces").val()));
    if (Pieces > 0) {
        $("#ItineraryPieces").val(Pieces);
        $("#_tempItineraryPieces").val(Pieces);
    }
}
function CalculateShipmentChWt(obj) {

    var grosswt = ($("#GrossWeight").val() == "" ? 0 : parseFloat($("#GrossWeight").val()));

    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.66;
    //if ($(obj).attr('id').toUpperCase() == "AWBCBM") {
    //    $("span[id='AWBVolumeWeight']").text(volwt.toFixed(1) == 0 ? "" : volwt.toFixed(1));

    $("#ItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    $("#_tempItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    //}
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWeight").val(chwt.toFixed(2).toString() == 0 ? "" : chwt.toFixed(2).toString());
    $("#_tempChargeableWeight").val(chwt.toFixed(2).toString() == 0 ? "" : chwt.toFixed(2).toString());
    if (parseFloat(grosswt) > 0) {
        $("#ItineraryGrossWeight").val(grosswt);
        $("#_tempItineraryGrossWeight").val(grosswt);
    }
}
function compareGrossVolValue() {
    var gw = $("#GrossWeight").val();
    var vw = $("#CBM").val();
    var cw = $("#ChargeableWeight").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#ChargeableWeight").val() == "" ? "0" : $("#ChargeableWeight").val()) < chwt) {
        $("#ChargeableWeight").val(chwt == 0 ? "" : chwt);
        $("#_tempChargeableWeight").val(chwt == 0 ? "" : chwt);
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function SearchFlight() {

    if ($('input[type="checkbox"][id="ULD"]').checked) {

        $('#ULDNo').closest('tr').show();
        $('#Text_ULDTypeSNo').closest('tr').show();
        $("#spnULDTypeSNo").closest('td').find('font').text('*');
        $("#Text_ULDTypeSNo").attr('data-valid', 'required');
        //$('#ULDNo').show();
        $('#ULDNo').closest('tr').show();
        $("#spnULDNo").closest('td').find('font').text('*');
        $("#ULDNo").attr('data-valid', 'required');

    }
    else {

        $('#Text_ULDTypeSNo').closest('tr').hide();
        $('#ULDNo').closest('tr').hide();
        $("#spnULDTypeSNo").closest('td').find('font').text('');
        $("#Text_ULDTypeSNo").removeAttr('data-valid');
        $('input[id="ULDTypeSNo"]').closest('td').find('span.k-dropdown-wrap.k-state-default').css('border-color', 'white')

        $("#spnULDNo").closest('td').find('font').text('');
        $("#ULDNo").removeAttr('data-valid');
        $('input[id="ULDTypeSNo"]').closest('td').find('span.k-dropdown-wrap.k-state-default').css('border-color', 'white')

        $('#ULDNo').closest('tr').hide();
        $('#ULDNo').val('');
        $('#OwnerCode').val('');
        $("#Text_ULDTypeSNo").data("kendoAutoComplete").key('');

    }
    if (cfi.IsValidSubmitSection()) {
        var theDivSearch = document.getElementById("divFlightSearchResult");

        theDivSearch.innerHTML = "";


        if ($("#hdnIsItineraryCarrierCodeInterline").val() == "0") {
            if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {

                    SearchFlightMode("SearchFlight");
                }
                else
                    ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
            }
            else
                ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");
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
                                        url: "Services/Mail/AirMailService.svc/GETCitySNofromItinerary",
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
                                    var AWBOriginCitySNo = $("#Text_ShipmentOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();
                                    var AWBDestinationCitySNo = $("#Text_ShipmentDest").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentDest").data("kendoAutoComplete").key();
                                    var AWBPieces = ($("#TotalPieces").val() == "" ? 0 : parseFloat($("#TotalPieces").val()));
                                    var AWBGrossWeight = ($("#GrossWeight").val() == "" ? 0 : parseFloat($("#GrossWeight").val()));
                                    var AWBCBM = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
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
function SelectedAWBOriginDestination(e) {

    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetAirportofSelectedAWBOriginDestination",
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
                    if (e == "Text_ShipmentOrigin") {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                        //$("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue("", "");
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
function ISSecondLegORNot(Origin, Destination) {
    var resultreturn = false;
    var AWBOriginCitySNo = $("#Text_ShipmentOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_ShipmentDest").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentDest").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/Mail/AirMailService.svc/ISSecondLegORNot",
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
function SearchFlightMode(Mode) {
    //  if (cfi.IsValidSubmitSection()) {

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
            var TempItineraryDate = "";
            if (SecondLegORNot == false)
                TempItineraryDate = $("#ItineraryDate").val();
            else
                TempItineraryDate = $("#hdnFlightDate").val();
            $.ajax({
                url: "Services/Mail/AirMailService.svc/SearchFlightResult",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    Origin: SendRouteAaarray[0],
                    Destination: SendRouteAaarray[1],
                    ItineraryDate: TempItineraryDate,
                    ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                    ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                    ItineraryTransit: "",
                    ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                    ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                    Product: 0,
                    Commodity: "",
                    SHCSNo: $('#SPHC').val(),
                    AgentSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
                    OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    OverrideMCT: $("#chkMCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    IsMCT: SecondLegORNot == false ? 0 : 1,
                    ETA: TempItineraryETDTime,
                    SearchCarrierCode: $('#Text_ItineraryCarrierCode').val()
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {

                    //var theDiv = document.getElementById("divFlightSearchResult");
                    //if (theDiv != null)
                    //{
                    //    theDiv.innerHTML = "";
                    //}
                    $('#divFlightSearchResult').innerHTML = "";

                    $('#divFlightSearchResult').remove();
                    //var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Plan Flights : </td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr/Vol</td><td id='AvailableGrVol' class='ui-widget-header'>Available Gr/Vol</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                    var table = "</br><div id='divFlightSearchResult'><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Plan Flights : </td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol</td><td class='ui-widget-header'>Allotment Code</td><td class='ui-widget-header'>Max Gross Per Pcs</td><td class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";

                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            for (var i = 0; i < myData.Table0.length; i++) {
                                if (myData.Table0[i].OverFlightCapacity == "1")
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'></td></tr>";

                                    //     table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label></td><td class='ui-widget-content first'></td></tr>";
                                else
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";

                                //  table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";

                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select  style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "/" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "/" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "/" + myData.Table0[i].Volume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                                //cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
                            }
                            table += "</tbody></table></div><div id='divFinalSelectedroute'></div>";
                            $('#__divairmaildetails__').append(table);
                        }
                        else {
                            var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                            $('#__divairmaildetails__').append(table);
                        }
                        if (myData.Table0.length > 0) {
                            for (var i = 0; i < myData.Table0.length; i++) {

                                cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,AllotmentCode", "DailyFlightAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], null, "contains");
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
            url: "Services/Mail/AirMailService.svc/SearchFlightResult",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                Origin: $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryOrigin").data("kendoAutoComplete").key(),
                Destination: $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryDestination").data("kendoAutoComplete").key(),
                ItineraryDate: TempItineraryDate,
                ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                ItineraryTransit: "",
                ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                Product: 0,
                Commodity: "",
                SHCSNo: $("#SPHC").val(),
                AgentSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
                OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                OverrideMCT: $("#chkOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                IsMCT: SecondLegORNot == false ? 0 : 1,
                ETA: TempItineraryETDTime,
                SearchCarrierCode: $('#Text_ItineraryCarrierCode').val()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                $('#tbodyresult').html('');
                $('#tblFlightSearchResult').innerHTML = '';
                $('#tblheadresultflight').html('');
                $('#tbodyresult').innerHTML = '';

                $('#tblheadresultflight tbody').remove();
                $('#tblheadresultflight thead').remove();
                $('#tblFlightSearchResult tbody').remove();
                $('#tblFlightSearchResult thead').remove();
                var theDiv = "";
                $('#divFlightSearchResult').innerHTML = "";

                $('#divFlightSearchResult').remove();
                var table = "";
                table = "<div id='divFlightSearchResult'><table id='tblheadresultflight' border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Plan Flights :</td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol</td><td class='ui-widget-header'>Allotment Code</td><td class='ui-widget-header'>Max Gross Per Pcs</td><td class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td class='ui-widget-header'>Action</td></tr></thead><tbody id='tbodyresult' class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            if (myData.Table0[i].OverFlightCapacity == "1")
                                table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'></td></tr>";

                                // table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label></td><td class='ui-widget-content first'></td></tr>";
                            else
                                table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";

                            //   table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";

                            //table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD + "/" + myData.Table0[i].ETA + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreesaleGross + "/" + myData.Table0[i].FreesaleVolume + "</td><td class='ui-widget-content first'><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "' name='Text_Allotment_" + myData.Table0[i].DailyflightSNo + "'/></td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td id='AvailableGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGross + "/" + myData.Table0[i].AllocatedVolume + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='16' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\");'><span class='ui-button-text'>Select</span></button></td></tr>";
                            //cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
                        }
                        table += "</tbody></table></div><div id='divFinalSelectedroute'></div>";
                        //  theDiv.innerHTML += table;
                        $('#__divairmaildetails__').append(table);
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        //  theDiv.innerHTML += table;
                        $('#__divairmaildetails__').append(table);
                    }
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            cfi.AutoComplete("Allotment_" + myData.Table0[i].DailyflightSNo, "SNo,AllotmentCode", "DailyFlightAllotment", "SNo", "AllotmentCode", ["AllotmentCode"], null, "contains");
                        }
                    }
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
                $(tr).find("[id^='AvailableGrVol']").css("display", "none");
            });
        }
    }
    $("#hdnFlightDate").val('');
}

function FillDropAllotment(id, DailyflightSNoVal) {
    //$("#" + id).html("");
    if ($("#" + id).find('option').length == 0) {
        $.ajax({
            url: "Services/Mail/AirMailService.svc/BindAllotmentArray",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                DailyFlightSNo: DailyflightSNoVal,
                AccountSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
                ShipperSNo: 0,
                GrossWt: $("#ItineraryGrossWeight").val(),
                Volume: $("#ItineraryVolumeWeight").val(),
                ProductSNo: 0,
                CommoditySNo: 0,
                SHC: $("#Text_SPHC").data("kendoAutoComplete").key()
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

function DeleteRoute(e, DailFlightSNo, Origin, Destination, OriginSNo, DestinationSNo) {

    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
    if (thedivFlightSearchResult == null) {
        // thedivFlightSearchResult.innerHTML = "";

    }

    $(e).closest('tr').remove();
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(OriginSNo, Origin);

    $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(DestinationSNo, Destination);
    var DailyFlightSNoForDelete = 0;
    var AWBPieces = ($("#TotalPieces").val() == "" ? 0 : parseFloat($("#TotalPieces").val()));
    var AWBGrossWeight = ($("#GrossWeight").val() == "" ? 0 : parseFloat($("#GrossWeight").val()));
    var AWBCBM = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    //var ItineraryPieces = ($("#ItineraryPieces").val() == "" ? 0 : parseFloat($("#ItineraryPieces").val()));
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
    if (table != null && table.rows.length == 1) {
        //  $('#divFinalSelectedroute').html('');
        ClearItineraryRoute();
    }
    RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
    RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
    RemainingItineraryVolumeWeight = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryVolumeWeight)).toFixed(3);
    if (SelectedItineraryPieces != 0 && SelectedItineraryPieces < AWBPieces) {
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
    $("#Delete_" + DailyFlightSNoForDelete).css("display", "block");
}
function ClearItineraryRoute() {

    var theDiv = document.getElementById("divFinalSelectedroute");
    if (theDiv != null) {
        theDiv.innerHTML = "";
    }

    var theDiv1 = document.getElementById("divFlightSearchResult");
    if (theDiv1 != null) {
        theDiv1.innerHTML = "";
    }

    cfi.ResetAutoComplete("ItineraryOrigin");
    cfi.ResetAutoComplete("ItineraryDestination");
    $("#hdnETDTime").val('00:00');
    $("#hdnFlightDate").val('');
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true)
    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)
    $("#Text_ShipmentDest").data("kendoAutoComplete").enable(true);


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


    //if (Action.toUpperCase() == "NEW") {



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
    // }
    if (kendo.parseFloat($("#ItineraryPieces").val()) <= 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) <= 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) <= 0 && Action.toUpperCase() != "UPDATE") {
        ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
        return false;
    }
    else {
        if (Check == "1") {
            $.ajax({
                url: "Services/Mail/AirMailService.svc/CheckEmbargoParam",
                async: false,
                type: "GET",
                dataType: "json",
                data: {

                    DailFlightSNo: SelectedRouteID,
                    AgentSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
                    ProductSNo: 0,
                    CommoditySNo: 0,
                    ItineraryPieces: $("#ItineraryPieces").val(),
                    ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                    ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                    PaymentType: 0,
                    SPHC: $('#SPHC').val(),
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {

                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                if (myData.Table0[0].IsSoftEmbargo.toUpperCase() == "TRUE") {
                                    IsConfirmData = confirm(myData.Table0[0].ValidMessage.split('@')[1] + ' Soft Embargo Applied. Do you wish to continue?');
                                    SoftEmbargo = "1";
                                }
                                else {
                                    IsConfirmData = false;
                                    ShowMessage('warning', 'Information!', "Hard Embargo Applied.");
                                    return;
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
        if (IsConfirmData == true) {
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
            else if (Action.toUpperCase() == "UPDATE") {
                AllotmentSNo = AllotSNo;
                AllotmentCode = AllotCode;
                SoftEmbargo = IsSoftEmbargo;
            }
            var IsSoftEmbargoValue = SoftEmbargo == "1" ? "Yes" : "No";
            $("#Text_ShipmentDest").data("kendoAutoComplete").enable(false);
            if (Mode == "SelectedRoute") {
                if (SendRouteAaarray.length > 1) {
                    $.ajax({
                        url: "Services/Mail/AirMailService.svc/SelectdRoute",
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
                                            table += "<tr id='" + myData.Table0[i].DailyflightSNo + "/" + myData.Table0[i].OriginSNo + "/" + myData.Table0[i].DestinationSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>";
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
                $.ajax({
                    url: "Services/Mail/AirMailService.svc/SelectdRoute",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        DailFlightSNo: SelectedRouteID
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {

                        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                        //thedivFlightSearchResult.innerHTML = "";
                        var theDiv = document.getElementById("divFinalSelectedroute");
                        var table = "";
                        if (theDiv.innerHTML == "") {
                            table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Allotment Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                            //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AvailableGrVol' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='AvailableGrVol' class='ui-widget-header'>Flight Capacity Vol</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                            //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr/Vol</td><td id='AvailableGrVol' class='ui-widget-header'>Available Gr/Vol</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                            //table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Free Space Gr/Vol</td><td class='ui-widget-header'>Allotment Code</td><td class='ui-widget-header'>Allocated Gr/Vol</td><td class='ui-widget-header'>Available Gr/Vol</td></tr></thead><tbody class='ui-widget-content'>";
                        }
                        if (result.substring(1, 0) == "{") {
                            var myData = jQuery.parseJSON(result);
                            if (myData.Table0.length > 0) {
                                for (var i = 0; i < myData.Table0.length; i++) {

                                    if (theDiv.innerHTML == "") {
                                        table += "<tr id='" + myData.Table0[i].DailyflightSNo + "/" + myData.Table0[i].OriginSNo + "/" + myData.Table0[i].DestinationSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/></td></tr>";
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

            var IsmatchAWBOriginCity = false;
            var IsmatchAWBDestinationCity = false;
            var AWBOriginCitySNo = $("#Text_ShipmentOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();
            var AWBDestinationCitySNo = $("#Text_ShipmentDest").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentDest").data("kendoAutoComplete").key();
            var AWBPieces = ($("#TotalPieces").val() == "" ? 0 : parseFloat($("#TotalPieces").val()));
            var AWBGrossWeight = ($("#GrossWeight").val() == "" ? 0 : parseFloat($("#GrossWeight").val()));
            var AWBCBM = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
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
                }
                else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                    $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);
                }
                $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)
                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)

                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                $("#ItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
                $("#_tempItineraryVolumeWeight").val(RemainingItineraryVolumeWeight == 0.000 ? AWBCBM : RemainingItineraryVolumeWeight)
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
            //abc

            if (Action.toUpperCase() == "NEW") {
                var tableSelected = document.getElementById("tblSelectdRouteResult");
                if (tableSelected != null && tableSelected.rows.length > 1) {

                    $('#tblSelectdRouteResult  tr').each(function (row, tr) {

                        $(tr).find("[id*='RouteStatus']").css("display", "none");
                        $(tr).find("[id*='Status']").css("display", "none");
                        $(tr).find("[id*='SoftEmbargoApplied']").css("display", "none");
                    });
                    $('#tblSelectdRouteResultbody  tr').each(function (row, tr) {

                        $(tr).find("td")[2].innerText
                    });

                }
            }
        }
    }
}


function ItenaryOthercharges() {
    $('#__divairmaildetails__').append(
        '<table id="tblTaxChargeInformationTab" width="100%"></table>' +
        '<table id="tblOtherchargeInformation" width="100%"></table>');
}


function GetRateInformation() {
    $('#__divairmaildetails__').append(
              '<table id="tblrateinformation" width="100%" class="appendGrid ui-widget">' +
              '<thead class="ui-widget-header"><tr><td class="formSection" colspan="7">Rate Information</td></tr>' +
              '<tr>' +
    '<td class="ui-widget-header">MKT Rate</td><td class="ui-widget-header">MKT Freight</td><td class="ui-widget-header">RefrenceNo</td></tr></thead>' +
    '<tbody class="ui-widget-content">' +
              '<tr id="tblTaxChargeInformationTab_Row_1">' +

                 '<td class="ui-widget-content" colspan="1"><span id="MKTRate" style="width: 90px;"></span></td>' +
                  '<td class="ui-widget-content" colspan="1"><span id="MKTFreight" style="width: 90px;"></span></td>' +
                  '<td class="ui-widget-content" colspan="1"><span id="refrencenumber" style="width: 90px;"></span></td>' +
           '</tr></tbody><tfoot><tr><td colspan="7"><div id="tblTaxChargeInformationTab_divStatusMsg" style="float: right;"></div><input type="hidden" id="tblTaxChargeInformationTab_rowOrder" name="tblTaxChargeInformationTab_rowOrder" value="1"></td></tr></tfoot></table>');
}
function Itinerary_Mail_Update() {

    //cfi.AutoComplete("ItineraryCarrierCode", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
    //cfi.AutoComplete("ItineraryFlightNo", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
    //$('#__divairmaildetails__').html('');
    //abc
    $("#ItineraryDate").attr('readOnly', true);
    $('#__divairmaildetails__').append(

        '<table id="tblItinerary" border="1" cellspacing="0" cellpadding="0" style="width: 100%; margin: 0px; padding: 0px;">' +
                                        '<tr><td class="formSection" colspan="6">Itinerary : </td></tr>' +
    '<tr><td colspan="6"><table width="100%">' +
                '<tr><td><label>Origin Airport :</label><input type="hidden" name="ItineraryOrigin" id="ItineraryOrigin" value=""><input type="text" class="" name="Text_ItineraryOrigin" id="Text_ItineraryOrigin" tabindex="25" controltype="autocomplete" maxlength="50" value="" placeholder="Origin Airport" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                    '</td>' +
                    '<td>' +
                       ' <label>Destination Airport:</label>' +
                       ' <input type="hidden" name="ItineraryDestination" id="ItineraryDestination" value="">' +
                       ' <input type="text" class="" name="Text_ItineraryDestination" id="Text_ItineraryDestination" tabindex="26" controltype="autocomplete" maxlength="50" value="" placeholder="Destination Airport" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                   ' </td>' +


                   ' <td>' +
                    '    <label>Carrier Code :</label>' +
                     '   <input type="hidden" name="ItineraryCarrierCode" id="ItineraryCarrierCode" value="">' +
                     '   <input type="text" class="" name="Text_ItineraryCarrierCode" id="Text_ItineraryCarrierCode" tabindex="27" controltype="autocomplete" maxlength="50" value="" placeholder="Carrier Code" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                    '</td>' +
                   '<td id="tdItineraryFlightNo">' +
                                                            '<label>Flight No. :</label>' +
                                                            '<input type="hidden" name="ItineraryFlightNo" id="ItineraryFlightNo" value="">' +
                                                            '<input type="text" class="" name="Text_ItineraryFlightNo" id="Text_ItineraryFlightNo" tabindex="104" controltype="autocomplete" maxlength="50" value="" placeholder="Flight No" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                                                        '</td>' +
                                                        '<td id="tdItineraryInterlineFlightNo">' +
                                                            '<label>Flight No. :</label>' +
                                                            '<input type="text" class="" name="ItineraryInterlineFlightNo" id="ItineraryInterlineFlightNo" tabindex="104" style="width: 50px; text-transform: uppercase;" controltype="alphanumericupper" onblur="CheckFlightNoLength();" maxlength="4" value="" data-role="alphabettextbox" autocomplete="off">' +
                                                        '</td>' +
    '<td>' +


                       ' <label>Date :</label>' +
                        '<span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 100px;">' +
                          '  <input type="text" class="k-input k-state-default" name="ItineraryDate" id="ItineraryDate" style="color: rgb(0, 0, 0);" tabindex="29" controltype="datetype" value="" data-role="datepicker">' +
                           ' <span unselectable="on" class="k-select">' +
                             '   <span unselectable="on" class="k-icon k-i-calendar">select</span>' +
                           ' </span>' +
                       ' </span>' +

                   ' </td>' +
                   ' <td>' +
                     '   <label>Pieces :</label>' +
                      '  <input type="text" class="" name="ItineraryPieces" id="ItineraryPieces" style="width: 50px;" placeholder="Pieces" controltype="number" data-valid="min[1]" data-valid-msg="Enter Pieces" tabindex="30" maxlength="5" value="" placeholder="" data-role="numerictextbox">' +
                    '</td>' +
                   ' <td>' +
                      '  <label>Gr. Wt. :</label>' +
                      '  <input type="text" class="" name="ItineraryGrossWeight" id="ItineraryGrossWeight" style="width: 50px;" placeholder="Gr. Wt." controltype="decimal2" data-valid="min[1.00]" data-valid-msg="Enter Gross Weight" tabindex="31" maxlength="7" value="" placeholder="" data-role="numerictextbox">&nbsp;' +
                    '</td>' +
    '<td>' +
                     '   <label>Vol.(CBM) :</label>' +
                     '   <input type="text" class="" name="ItineraryVolumeWeight" id="ItineraryVolumeWeight" style="width: 50px;" placeholder="Vol. Wt." controltype="decimal3" data-valid="min[0.001]" data-valid-msg="Enter Volume (CBM)" tabindex="32" maxlength="8" value="" placeholder="" data-role="numerictextbox">' +
    ' </td>' +
                  '<td>' +
                   '<label>Routing Complete:</label>' +
                    '<input type="checkbox" tabindex="109" class="" name="chkIsRoutingComplete" id="chkIsRoutingComplete">' +

                   '</td>' +

                    '<td>' +
     '<label>BCT :</label>' +
     '<input type="checkbox" tabindex="110" class="" name="chkBCTOverrideConnectionTime" id=" chkBCTOverrideConnectionTime">' +
     '<span id="spnBCTOverrideConnectionTime"></span>' +
 '</td>' +
  '<td>' +
                      '  <label>MCT :</label>' +
                      '  <input type="checkbox" tabindex="110" class="" name="chkOverrideConnectionTime" id=" chkOverrideConnectionTime">' +
                      '  <span id="spnOverrideConnectionTime"></span>' +
                    '</td>' +
                '</tr>' +
               ' <tr>' +
                    '<td class="formSection" style="text-align: left; white-space: nowrap;" colspan="12">' +
                       ' <input type="submit" name="ItineraryViewRoute" id="ItineraryViewRoute" tabindex="111" onclick="ViewRoute();" value="View Route" class="btn btn-block btn-primary">' +
                       ' <input type="submit" name="ItinerarySearch" id="ItinerarySearch" tabindex="112" onclick="SearchFlight();" value="Search" class="btn btn-block btn-primary">' +
                       ' <input type="submit" name="btnClearItineraryRoute" id="btnClearItineraryRoute" tabindex="112" onclick="ClearItineraryRoute();" value="Clear Itinerary Route" class="btn btn-block btn-primary">' +

                   ' </td>' +
               ' </tr>' +
            '</table>' +
       ' </td>' +
    '</tr>' +
     '<tr>' +
                                '<td colspan="2">' +
                                    '<div id="divFinalSelectedroute"></div><div id="divFlightSearchResult">' +
                                '</td>' +
                            '</tr>' +
'</table><input type="hidden" name="hdnIsItineraryCarrierCodeInterline" id="hdnIsItineraryCarrierCodeInterline" value="0">'
    );

    $('#__divairmaildetails__').append('<div id="dvid"><input type="hidden" name="hdnFlightDate" id="hdnFlightDate" value=""> <input type="hidden" name="hdnETDTime" id="hdnETDTime" value="00:00"></div>');
}

function Itinerary_Mail() {

    //cfi.AutoComplete("ItineraryCarrierCode", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
    //cfi.AutoComplete("ItineraryFlightNo", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
    //$('#__divairmaildetails__').html('');
    //abc
    $("#ItineraryDate").attr('readOnly', true);
    $('#__divairmaildetails__').append(

        '<table id="tblItinerary" border="1" cellspacing="0" cellpadding="0" style="width: 100%; margin: 0px; padding: 0px;">' +
                                        '<tr><td class="formSection" colspan="6">Itinerary : </td></tr>' +
    '<tr><td colspan="6"><table width="100%">' +
                '<tr><td><label>Origin Airport :</label><input type="hidden" name="ItineraryOrigin" id="ItineraryOrigin" value=""><input type="text" class="" name="Text_ItineraryOrigin" id="Text_ItineraryOrigin" tabindex="25" controltype="autocomplete" maxlength="50" value="" placeholder="Origin Airport" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                    '</td>' +
                    '<td>' +
                       ' <label>Destination Airport:</label>' +
                       ' <input type="hidden" name="ItineraryDestination" id="ItineraryDestination" value="">' +
                       ' <input type="text" class="" name="Text_ItineraryDestination" id="Text_ItineraryDestination" tabindex="26" controltype="autocomplete" maxlength="50" value="" placeholder="Destination Airport" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                   ' </td>' +


                   ' <td>' +
                    '    <label>Carrier Code :</label>' +
                     '   <input type="hidden" name="ItineraryCarrierCode" id="ItineraryCarrierCode" value="">' +
                     '   <input type="text" class="" name="Text_ItineraryCarrierCode" id="Text_ItineraryCarrierCode" tabindex="27" controltype="autocomplete" maxlength="50" value="" placeholder="Carrier Code" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                    '</td>' +
                    '<td id="tdItineraryFlightNo">' +
                                                            '<label>Flight No. :</label>' +
                                                            '<input type="hidden" name="ItineraryFlightNo" id="ItineraryFlightNo" value="">' +
                                                            '<input type="text" class="" name="Text_ItineraryFlightNo" id="Text_ItineraryFlightNo" tabindex="104" controltype="autocomplete" maxlength="50" value="" placeholder="Flight No" data-role="autocomplete" autocomplete="off" style="text-transform: uppercase;">' +
                                                        '</td>' +
                                                        '<td id="tdItineraryInterlineFlightNo">' +
                                                            '<label>Flight No. :</label>' +
                                                            '<input type="text" class="" name="ItineraryInterlineFlightNo" id="ItineraryInterlineFlightNo" tabindex="104" style="width: 50px; text-transform: uppercase;" controltype="alphanumericupper" onblur="CheckFlightNoLength();" maxlength="4" value="" data-role="alphabettextbox" autocomplete="off">' +
                                                        '</td>' +
    '<td>' +


                       ' <label>Date :</label>' +
                        '<span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 100px;">' +
                          '  <input type="text" class="k-input k-state-default" name="ItineraryDate" id="ItineraryDate" style="color: rgb(0, 0, 0);" tabindex="29" controltype="datetype" value="" data-role="datepicker">' +
                           ' <span unselectable="on" class="k-select">' +
                             '   <span unselectable="on" class="k-icon k-i-calendar">select</span>' +
                           ' </span>' +
                       ' </span>' +

                   ' </td>' +
                   ' <td>' +
                     '   <label>Pieces :</label>' +
                      '  <input type="text" class="" name="ItineraryPieces" id="ItineraryPieces" style="width: 50px;" placeholder="Pieces" controltype="number" data-valid="min[1]" data-valid-msg="Enter Pieces" tabindex="30" maxlength="5" value="" placeholder="" data-role="numerictextbox">' +
                    '</td>' +
                   ' <td>' +
                      '  <label>Gr. Wt. :</label>' +
                      '  <input type="text" class="" name="ItineraryGrossWeight" id="ItineraryGrossWeight" style="width: 50px;" placeholder="Gr. Wt." controltype="decimal2" data-valid="min[1.00]" data-valid-msg="Enter Gross Weight" tabindex="31" maxlength="7" value="" placeholder="" data-role="numerictextbox">&nbsp;' +
                    '</td>' +
    '<td>' +
                     '   <label>Vol.(CBM) :</label>' +
                     '   <input type="text" class="" name="ItineraryVolumeWeight" id="ItineraryVolumeWeight" style="width: 50px;" placeholder="Vol. Wt." controltype="decimal3" data-valid="min[0.001]" data-valid-msg="Enter Volume (CBM)" tabindex="32" maxlength="8" value="" placeholder="" data-role="numerictextbox">' +
    ' </td>' +
                  '<td id="ROUTECOM">' +
                   '<label>Routing Complete:</label>' +
                    '<input type="checkbox" tabindex="109" class="" name="chkIsRoutingComplete" id="chkIsRoutingComplete">' +

                   '</td>' +

                    '<td id="tdBCT">' +
     '<label>BCT :</label>' +
     '<input type="checkbox" tabindex="110" class="" name="chkBCTOverrideConnectionTime" id=" chkBCTOverrideConnectionTime">' +
     '<span id="spnBCTOverrideConnectionTime"></span>' +
 '</td>' +
  '<td  id="tdMCT">' +
                      '  <label>MCT :</label>' +
                      '  <input type="checkbox" tabindex="110" class="" name="chkOverrideConnectionTime" id=" chkOverrideConnectionTime">' +
                      '  <span id="spnOverrideConnectionTime"></span>' +
                    '</td>' +
                '</tr>' +
               ' <tr>' +
                    '<td class="formSection" style="text-align: left; white-space: nowrap;" colspan="12">' +
                       ' <input type="submit" name="ItineraryViewRoute" id="ItineraryViewRoute" tabindex="111" onclick="ViewRoute();" value="View Route" class="btn btn-block btn-primary">' +
                       ' <input type="submit" name="ItinerarySearch" id="ItinerarySearch" tabindex="112" onclick="SearchFlight();" value="Search" class="btn btn-block btn-primary">' +
                       ' <input type="submit" name="btnClearItineraryRoute" id="btnClearItineraryRoute" tabindex="112" onclick="ClearItineraryRoute();" value="Clear Itinerary Route" class="btn btn-block btn-primary">' +

                   ' </td>' +
               ' </tr>' +
                  '<td colspan="12">' +
                                    '<div id="divFinalSelectedroute"></div><div id="divFlightSearchResult">' +
                                '</td>' +
            '</table>' +
       ' </td>' +
    '</tr>' +
'</table><input type="hidden" name="hdnIsItineraryCarrierCodeInterline" id="hdnIsItineraryCarrierCodeInterline" value="0">'
    );

    $('#__divairmaildetails__').append('<div id="dvid"><input type="hidden" name="hdnFlightDate" id="hdnFlightDate" value=""> <input type="hidden" name="hdnETDTime" id="hdnETDTime" value="00:00"></div>');
}
function AirMailList() {


    _CURR_PRO_ = "AIRMAIL";
    _CURR_OP_ = "AIR MAIL";
    var module = "Mail";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divAirMailDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/AirMailSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();

            cfi.AutoComplete("searchCN38No", "CN38No", "vPoMailDetails", "CN38No", "CN38No", null, null, "contains");
            //cfi.AutoComplete("searchShipmentOrigin", "SNo,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchShipmentOrigin", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchShipmentDest", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vPoMailFlightSearch", "FlightNo", "FlightNo", null, null, "contains");
            cfi.AutoComplete("searchMailCategory", "MailCategoryCode,MailCategoryName", "MailCategory", "SNo", "MailCategoryName", ["MailCategoryCode", "MailCategoryName"], null, "contains");
            cfi.AutoComplete("searchMailHCCode", "MHCCode,MHCName", "MailHandlingClassCode", "SNo", "AirlineName", ["MHCCode", "MHCName"], null, "contains");
            $("#__divairmailsearch__").find("table:first").find("tr>td:first").text((MovementType == 1) ? "Import Airmail" : "Export Airmail");

            $('#searchFlightDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $('#btnSave').css("display", "none");
            $("#btnSearch").unbind("click").bind("click", function () {
                CleanUI();
                AirMailSearch();
                $('#btnSave').css("display", "none");
                $('#btnCancel').css("display", "none");
                $('#btnNew').css("display", "block");
                $('#btnUpdate').css("display", "none");
                $("[title='Airmail Details']").addClass('btn btn-success');

                $("[title='Customer']").addClass('btn btn-success');

                $("[title='CN35']").addClass('btn btn-success');
                $("[title='Airmail Payment']").addClass('btn btn-success');
                $("[title='AirMail Label']").addClass('btn btn-inverse');
                $('#btnCancel').css("display", "block");

            });
            $('input[type="button"][value="CN"]').live('click').bind('click', function () {

            })


            $("#btnNew").unbind("click").bind("click", function () {


                $("div[data-role^='grid']").css('display', 'none');
                CleanUI();
                CurrentAirMailSNo = 0;
                $.ajax({
                    url: "Services/Mail/AirMailService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/AirMailDetails/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divDetail").html(result);

                        cfi.DateType("FlightDate");

                        cfi.AutoComplete("IssuingAgent", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
                        cfi.AutoComplete("MailCategory", "SNo,MailCategoryName", "MailCategory", "SNo", "MailCategoryName", ["MailCategoryCode", "MailCategoryName"], null, "contains");
                        cfi.AutoComplete("MailHCCode", "SNo,MHCCode", "MailHandlingClassCode", "SNo", "MHCName", ["MHCCode", "MHCName"], null, "contains");
                        cfi.AutoComplete("PostCode", "SNo,Code", "vAirMailPostCode", "SNo", "Code", null, null, "contains");
                        cfi.AutoComplete("PostBranch", "SNo,Code", "vAirMailPostCode", "SNo", "Code", null, null, "contains");
                        cfi.AutoComplete("SPHC", "SNo,Code", "vSPHC", "SNo", "Code", null, null, "contains");
                        // cfi.AutoComplete("SPHC", "SNo,Code", "vSPHC", "SNo", "Code", null, null, "contains");
                        cfi.AutoComplete("ShipmentOrigin", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], SelectedAWBOriginDestination, "contains");
                        cfi.AutoComplete("ShipmentDest", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], SelectedAWBOriginDestination, "contains");
                        var UMSource = [{ Key: "0", Text: "K" }];

                        cfi.AutoCompleteByDataSource("UM", UMSource);

                        $("#Text_UM").val('K');
                        cfi.AutoComplete("BoardPoint", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
                        cfi.AutoComplete("OffPoint", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
                        cfi.AutoComplete("FlightNo", "SNo,FlightNo", "vPoMailFlight", "FlightNo", "FlightNo", null, null, "contains");
                        cfi.AutoComplete("ULDTypeSNo", "ULDName", "vwULDTYpeSLI", "SNo", "ULDName", ["ULDName"], null, "contains");
                        $('#AirportCode').val(userContext.AirportCode).prop('disabled', true);
                        // $("#Text_SPHC").data("kendoAutoComplete").key($("#SPHC").val());
                        //  $("#Text_SPHC").val('MAL');
                        // $("#SPHC").val('MAL');
                        // $("#Text_SPHC").prop('disabled', true);
                        // $("#Text_SPHC").closest("span").find("span[class='k-icon k-i-arrow-s']").remove();
                        Itinerary_Mail();
                        $("#tdItineraryInterlineFlightNo").css("display", "none");
                        $("#spnULDTypeSNo").closest('td').find('font').text('');
                        $("#Text_ULDTypeSNo").removeAttr('data-valid');
                        $("#spnULDNo").closest('td').find('font').text('');
                        $("#ULDNo").removeAttr('data-valid');
                        $("[id*='MKTRate']").css('display', 'none');
                        $("[id*='MKTFreight']").css('display', 'none');
                        $("[id*='refrencenumber']").css('display', 'none');

                        $("#TotalPieces").unbind("blur").bind("blur", function () {

                            CalculatedPieces();
                        });
                        $("#GrossWeight").unbind("blur").bind("blur", function () {
                            CalculateShipmentChWt(this);
                        });
                        $("#CBM").unbind("blur").bind("blur", function () {
                            CalculateShipmentChWt(this);
                        });
                        $("#ChargeableWeight").unbind("blur").bind("blur", function () {
                            compareGrossVolValue();
                        });
                        if (userContext.AgentSNo > 0 || userContext.OfficeSNo > 0) {
                            $("#tdBCT").css("display", "none");
                            $("#tdMCT").css("display", "none");
                            $("#ROUTECOM").css("display", "none");

                        }
                        var UMSource = [{ Key: "0", Text: "CN38" }, { Key: "1", Text: "CN47" }];

                        cfi.AutoCompleteByDataSource("MailNo", UMSource);

                        // cfi.AutoComplete("MailNo", "airlinecode,airlinename", "GetAirline_isinterline", "SNo", "airlinecode", ["airlinecode", "airlinename"], null, "contains");
                        //abc
                        cfi.AutoComplete("ItineraryOrigin", "AIRPORTCODE,CITYNAME", "BuildJoinCityName", "SNO", "CITYNAME", ["AIRPORTCODE", "airportname"], CheckPiecesOnOD, "contains");
                        cfi.AutoComplete("ItineraryDestination", "AIRPORTCODE,CITYNAME", "BuildJoinCityName", "SNO", "CITYNAME", ["AIRPORTCODE", "airportname"], CheckPiecesOnOD, "contains");
                        cfi.AutoComplete("ItineraryCarrierCode", "CarrierCode", "airline", "SNo", "AirlineName", ["CarrierCode"], IsItineraryCarrierCodeInterline, "contains");
                        cfi.AutoComplete("ItineraryFlightNo", "FlightNo", "v_DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
                        cfi.AutoComplete("AirlineCode", "airlinecode,airlinename", "GetAirline_isinterline", "SNo", "airlinecode", ["CarrierCode", "airlinename"], SelectCareercode, "contains");
                        $('#Text_AirlineCode').focus();
                        if (result != undefined || result != "") {
                            InitializePage("AIRMAIL", "divDetail");
                            currentprocess = "AIRMAIL";

                        }

                        $('.k-datepicker').css('width', '150px');

                        $('#FlightDate').change(function () {
                            ResetFlighDetails();
                        });

                        $("#CBM").blur(function () {
                            CalculateWeight();
                        });
                        $("#GrossWeight").blur(function () {
                            CalculateWeight();
                        });

                        if ($('#ULDNo').val() == "") {
                            $('input[type="checkbox"][id="ULD"]').removeAttr("checked");
                            //$('#ULDNo').hide();
                            $('#ULDNo').closest('tr').hide();

                        }
                        else {
                            $('input[type="checkbox"][id="ULD"]').attr("checked", "checked");
                            //$('#ULDNo').show();
                            $('#ULDNo').closest('tr').show();

                        }

                        $('input[type="checkbox"][id="ULD"]').click(function () {
                            if (this.checked) {
                                //abc

                                $("#spnULDTypeSNo").closest('td').find('font').text('*');
                                $("#Text_ULDTypeSNo").attr('data-valid', 'required');
                                //$('#ULDNo').show();
                                $('#ULDNo').closest('tr').show();
                                $("#spnULDNo").closest('td').find('font').text('*');
                                $("#ULDNo").attr('data-valid', 'required');


                            }
                            else {

                                $("#spnULDTypeSNo").closest('td').find('font').text('');
                                $("#Text_ULDTypeSNo").removeAttr('data-valid');
                                $('input[id="ULDTypeSNo"]').closest('td').find('span.k-dropdown-wrap.k-state-default').css('border-color', 'white')

                                $("#spnULDNo").closest('td').find('font').text('');
                                $("#ULDNo").removeAttr('data-valid');
                                $('input[id="ULDTypeSNo"]').closest('td').find('span.k-dropdown-wrap.k-state-default').css('border-color', 'white')
                                /// $("#Text_ULDTypeSNo").css('border-color','white');
                                //  $("span[style^='grid']").find('tbody').find('tr').find("td[data-column^='ProcessedStatus']").css('pointer-events', 'none');


                                //$('#ULDNo').hide();
                                $('#ULDNo').closest('tr').hide();
                                $('#ULDNo').val('');
                                $('#OwnerCode').val('');
                                $("#Text_ULDTypeSNo").data("kendoAutoComplete").key('');
                                $("#Text_ULDTypeSNo").data("kendoAutoComplete").value('');
                            }
                        });
                        $('#btnNew').css("display", "none");
                        $('#btnSave').css("display", "block");
                        $('#btnCancel').css("display", "block");
                        $("#btnCancel").unbind("click").bind("click", function () {
                            $('#__divairmaildetails__').html('');
                            $('#btnNew').css("display", "block");
                            $('#btnSave').css("display", "none");
                        });
                    }
                });

            });


        }
    });

}

function IsItineraryCarrierCodeInterline() {

    if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Mail/AirMailService.svc/IsItineraryCarrierCodeInterline",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ItineraryCarrierCode: $("#Text_ItineraryCarrierCode").val(),
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
                            if (thedivFlightSearchResult == null) {

                            }
                            else {
                                thedivFlightSearchResult.innerHTML = "";
                            }
                        }
                        else {
                            $("#tdItineraryFlightNo").css("display", "block");
                            $("#tdItineraryInterlineFlightNo").css("display", "none");
                            $("#ItineraryInterlineFlightNo").val('');
                            //$("#_tempItineraryInterlineFlightNo").val('');
                            $("#hdnIsItineraryCarrierCodeInterline").val("0");
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            if (thedivFlightSearchResult == null) {

                            }
                            else {
                                thedivFlightSearchResult.innerHTML = "";
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
function SelectCareercode(e) {
    var AWBCode = "";
    if (e != "Text_AirlineCode") {
        AWBCode = e;
    }
    else {
        AWBCode = $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
    }
    if (AWBCode != "") {
        $.ajax({
            url: "Services/Mail/AirMailService.svc/GetItineraryCarrierCode",
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
function CheckPiecesOnOD(e) {
    
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var AWBPieces = ($("#TotalPieces").val() == "" ? 0 : parseFloat($("#TotalPieces").val()));
    var AWBOriginCitySNo = $("#Text_ShipmentOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_ShipmentDest").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentDest").data("kendoAutoComplete").key();
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
function PopUpOnOpen(cntrlId) {
    return false;
}
function PopUpOnClose(cntrlId) {
    return false;
}
function CloseViewRoutepopUp() {
    var window = $("#divViewRoutePopUp");
    window.data("kendoWindow").close();
}
var SendRouteAaarray = [];
var SelectedRouteValueArray = [];
var SelectedRouteValue = "";
function SelectedRoute(ss) {

    var theDiv = document.getElementById("divFinalSelectedroute");
    if (theDiv != null) {
        theDiv.innerHTML = "";
    }

    var theDiv1 = document.getElementById("divFlightSearchResult");
    if (theDiv1 != null) {
        theDiv1.innerHTML = "";
    }


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
function ViewRoute() {

    if (cfi.IsValidSubmitSection()) {

        if (true) {
            if (kendo.parseFloat($("#ShipmentOrigin").val()) > 0 && kendo.parseFloat($("#ShipmentDest").val()) > 0) {
                if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                    if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                        $.ajax({
                            url: "Services/Mail/AirMailService.svc/ViewRoute?ItineraryOrigin=" + $("#ItineraryOrigin").val() + '&ItineraryDestination=' + $("#ItineraryDestination").val(), async: false, type: "get", dataType: "json", cache: false,
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
                                    cfi.PopUp("divViewRoutePopUp", "Available Route", "500", null, null);
                                }
                            }
                        });
                    }
                    else
                        ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for view Route.");
                }
                else {
                    ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for view Route.");
                }
            }
            else {
                ShowMessage('warning', 'Information!', "Select Shipment Origin  and Shipment Destination for view Route.");
            }
        }
    }


}


function ResetFlighDetails() {
    $("#Text_FlightNo").val('');
}
function ShowIndexView1(divId, serviceUrl, jscriptUrl) {
    $.ajax({
        url: serviceUrl, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //if (jscriptUrl != undefined && jscriptUrl != "") {
            //    ngen.loadjscssfile(jscriptUrl, "js");
            //}
            $("#" + divId).html(result);
        },
        error: function (jqXHR, textStatus) {
        }
    });
}
function AirMailSearch() {

    var CN38No = $("#searchCN38No").val() == "" ? "A~A" : $("#searchCN38No").val();
    var FlightNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_searchFlightNo").data("kendoAutoComplete").key();
    var FlightDate = $("#searchFlightDate").val() == "Flight Date" ? "2099-01-01" : $("#searchFlightDate").val();
    var ShipmentOrigin = $("#Text_searchShipmentOrigin").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_searchShipmentOrigin").data("kendoAutoComplete").value().split('-')[0];

    var ShipmentDest = $("#Text_searchShipmentDest").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_searchShipmentDest").data("kendoAutoComplete").value().split('-')[0];
    var MailCategory = $("#Text_searchMailCategory").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchMailCategory").data("kendoAutoComplete").key();
    var MailHCCode = $("#Text_searchMailHCCode").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchMailHCCode").data("kendoAutoComplete").key();
    $("#imgprocessing").show();
    if (_CURR_PRO_ == "AIRMAIL") {

        ShowIndexView1("divAirMailDetails", "Services/Mail/AirMailService.svc/GetAirMailGridData/" + _CURR_PRO_ + "/Mail/AirMail/" + CN38No + "/" + FlightNo.trim() + "/" + FlightDate + "/" + ShipmentOrigin + "/" + ShipmentDest + "/" + MailCategory + "/" + MailHCCode + "/" + MovementType, "Scripts/maketrans.js?" + Math.random());

        //setTimeout(function () {
        //    addBtnClass();
        //    $('input[type="button"][value="CN"]').unbind('click').bind('click', function () {

        //       // $('.k-focusable k-selectable tbody tr td').find('data-column').find('CN38No').css('style', 'pointer-events : none');

        //        //$('.k-focusable k-selectable tbody tr td[data-column="CN38No"]').css('style', 'pointer-events : none');

        //       // document.getElementsByClassName('.k-focusable k-selectable tbody tr td').style.pointerEvents = 'none';
        //    })
        //}, 100);

    }

    $("#imgprocessing").hide();
    // $('.k-focusable k-selectable tbody tr td[data-column="CN38No"]').css('style', 'pointer-events : none');

}


function CleanUI() {
    $("#divXRAY").hide();
    $("#tblairmailpayment").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#tblairmailpayment").hide();
    $("#divAirMailTrans_").hide();
    $("#divNewAirMail").html("");
    $("#ulTab").hide();
}

var counter = 0;
function BindEvents(obj, e, isdblclick) {


    $("#imgprocessing").show();

    $("#divGraph").show();
    $("#btnNew").css("display", "none");
    $("#btnSave").css("display", "none");
    $("#btnUpdate").css("display", "block");
    $('#btnCancel').css("display", "block");
    $("#divXRAY").hide();
    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        ResetDetails();
        $("#btnNew").css("display", "block");
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
    });

    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    var AirMailSNoIndex = 0;
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    AirMailSNoIndex = 0;
    CurrentAirMailSNo = closestTr.find("td:eq(" + AirMailSNoIndex + ")").text();
    ShowProcessDetails(subprocess, isdblclick);

    //$('#valueareaTrans_mail_airmailtransaction').before('&nbsp;&nbsp;<label style="font-weight:bold; font-size:13px">DN No. :</label>&nbsp;&nbsp;&nbsp;<input type="text" class="transSection k-input" id="txtSacnCode" maxlength="29" style="width:200px; height:17px; font-size:12px; text-transform: uppercase; margin-top:5px;" >');
    //$('#txtSacnCode').after('&nbsp;&nbsp;<button id="btnSacnCode" class="btn btn-block btn-success btn-sm" onclick="GetSacnnedCodes()">Scan</button>')

    //----------------------changes by pk-------------------------
    if (counter <= 0 && subprocess == "AIRMAILTRANS") {
        $('#divAirMailTrans').before('&nbsp;&nbsp;<label style="font-weight:bold; font-size:13px">DN No. :</label>&nbsp;&nbsp;&nbsp;<input type="text" class="transSection k-input" id="txtSacnCode" maxlength="29" style="width:200px; height:17px; font-size:12px; text-transform: uppercase; margin-top:5px;" >');
        $('#txtSacnCode').after('&nbsp;&nbsp;<button id="btnSacnCode" class="btn btn-block btn-success btn-sm" onclick="GetSacnnedCodes()">Scan</button>')
        counter++
    }
    //------------------------------------------------------------------
    //oninput="this.value = this.value.replace(/[^a-zA-Z0-9 ]/g,\'\');"
    $('#spnMailSubCategory').attr('onclick', 'ShowMailSubCategory()');
    $('#spnMailSubCategory').css('cursor', 'pointer');
    $('#spnMailSubCategory').css('color', 'blue');
    $('#spnMailSubCategory').css('text-decoration', 'underline');
    $('#txtSacnCode').keypress(function (e) {
        var allowedChars = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (allowedChars.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }).keyup(function () {
        // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
        // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
        var forbiddenChars = new RegExp("[^a-zA-Z0-9]", 'g');
        if (forbiddenChars.test($(this).val())) {
            $(this).val($(this).val().replace(forbiddenChars, ''));
        }
    });
    $("#imgprocessing").hide();
}


function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#tblairmailpayment").hide();
    $("#divNewAirMail").html("");
    $("#btnSave").unbind("click");
}

function ShowProcessDetails(subprocess, isdblclick) {

    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetWebForm/" + _CURR_PRO_ + "/Mail/" + subprocess + "/New/1",
        async: false,
        type: "get",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#divDetail").html(result);

            if (result != undefined || result != "") {
                GetProcessSequence("AIRMAIL");
                InitializePage(subprocess, "divDetail", isdblclick);
                $("#Validate").addClass("btn-info");
                $('.k-focusable k-selectable tbody tr td[data-column="CN38No"]').css('style', 'pointer-events : none');

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

}

function checkProgrss(item, subprocess, displaycaption) {

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
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

function InitializePage(subprocess, cntrlid, isdblclick) {

    $("#tblairmailpayment").show();
    InstantiateControl(cntrlid);
    if (subprocess.toUpperCase() == "AIRMAILCUSTOMER") {
        $("#divAirMailTrans_").hide();
        BindAirMailCustomer();

    }
    else if (subprocess.toUpperCase() == "AIRMAILTRANS") {
        // BindAirMailTrans();
        $("#divAirMailTrans_").show();
        CreateAirMailTransGrid();

    }
    else if (subprocess.toUpperCase() == "AIRMAILPAYMENT") {
        $("#divAirMailTrans_").hide();
        BindAirMailPayment();

    }
    else if (subprocess.toUpperCase() == "AIRMAILDETAILS") {
        $("#divAirMailTrans_").hide();
        BindAirMailDetails();

    }
    $("#btnSave").unbind("click").bind("click", function () {

        if (cfi.IsValidSubmitSection()) {

            if (SaveFormData(subprocess))

                AirMailSearch();
            //setTimeout(function () {
            //    addBtnClass();
            //}, 100);
        }
    });
    $("#btnUpdate").unbind("click").bind("click", function () {

        if (subprocess.toUpperCase() == "AIRMAILDETAILS") {

            var pomailsno = CurrentAirMailSNo;
            $("#Text_ULDTypeSNo").removeAttr('data-valid');
            $("#ULDNo").removeAttr('data-valid');
            //$('input[type="checkbox"][id="ULD"]').click(function () {
            if ($('input[type="checkbox"][id="ULD"]').checked) {

                $('#ULDNo').closest('tr').show();
                $('#Text_ULDTypeSNo').closest('tr').show();
            }
            else {

                //$('#ULDNo').hide();
                $('#Text_ULDTypeSNo').closest('tr').hide();
                $('#ULDNo').closest('tr').hide();
                //$('#ULDNo').val('');
                //$('#OwnerCode').val('');
                //$("#Text_ULDTypeSNo").data("kendoAutoComplete").key('');
                //$("#Text_ULDTypeSNo").data("kendoAutoComplete").value('');
            }
            //  });
            if (cfi.IsValidSubmitSection()) {


                var PoMailItineraryViewModel = [];
                var PomailViewModel = {

                    CN38No: $('#AirportCode').val() + '' + $("#CN38No").val(),
                    AirlineCode: $("#AirlineCode").val(),
                    IssuingAgent: $("#IssuingAgent").val(),
                    SPHC: $("#SPHC").val(),
                    MailCategory: parseInt($("#MailCategory").val().split('-')[0]),
                    MailHCCode: parseInt($("#MailHCCode").val()),
                    Description: $("#Description").val(),
                    ShipmentOrigin: $("#ShipmentOrigin").val().split('-')[0],
                    ShipmentDest: $("#ShipmentDest").val().split('-')[0],

                    PostCode: $("#PostCode").val(),
                    PostBranch: $("#PostBranch").val(),
                    TotalPieces: $("#TotalPieces").val() == "" ? 0 : $("#TotalPieces").val(),
                    GrossWeight: $("#GrossWeight").val(),
                    CBM: $("#CBM").val(),
                    ChargeableWeight: $("#ChargeableWeight").val(),
                    LocationRequired: $("#AssignLocation").prop('checked') == true ? 1 : 0,
                    ULDTypeSNo: $("#ULDTypeSNo").val() == "" ? 0 : $("#ULDTypeSNo").val() == 'null' ? 0 : $("#ULDTypeSNo").val(),
                    ULDNo: $("#ULD").prop('checked') == true ? 1 : 0,
                    Text_MailNo: $('#Text_MailNo').val(),
                    MailNo: $('#MailNo').val()
                }
                var Pieces_ = '';
                var GrossWeight_ = '';
                var VolumeWeight_ = '';
                var origin_ = '';
                var destination_ = '';

                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    var ReservationItineraryInfo = {
                        SNo: "0",
                        ReservationBookingSNo: "0",
                        ReservationBookingRefNo: pomailsno,
                        AWBPieces: $("#TotalPieces").val(),
                        AWBGrossWeight: $("#GrossWeight").val(),
                        AWBVolumeWeight: $("#CBM").val(),

                        DailyFlightSNo: $(tr)[0].id.split('/')[0],
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
                        Allotmentsno: $('[id*="hdnAllotmentSNo_"]').val() == 'undefined' ? 0 : $('[id*="hdnAllotmentSNo_"]').val() == 'null' ? 0 : $('[id*="hdnAllotmentSNo_"]').val(),
                        AllocatedGrossWeight: "",
                        AllocatedVolumeWeight: "",
                        AvailableGrossWeight: "",
                        AvailableVolumeWeight: ""

                    };
                    PoMailItineraryViewModel.push(ReservationItineraryInfo);


                });
                Pieces_ = $('#tblSelectdRouteResult').find(' tbody tr td').eq(3).html();
                GrossWeight_ = $('#tblSelectdRouteResult').find(' tbody tr td').eq(4).html();
                VolumeWeight_ = $('#tblSelectdRouteResult').find(' tbody tr td').eq(5).html();
                origin_ = $('#tblSelectdRouteResult').find("td")[2].innerText.split("/")[0];
                destination_ = $('#tblSelectdRouteResult').find("td")[2].innerText.split("/")[1];

                if (parseInt($('#TotalPieces').val()) != parseInt(Pieces_)) {
                    ShowMessage('warning', 'Search again', "TotalPieces changed,Please flight search again", "bottom-right");
                    flag = false;
                }
                else if (parseFloat($('#GrossWeight').val()) != parseFloat(GrossWeight_)) {
                    ShowMessage('warning', 'Search again', "GrossWeight changed,Please flight search again", "bottom-right");
                    flag = false;
                }
                else if (parseFloat($('#CBM').val()) != parseFloat(VolumeWeight_)) {
                    ShowMessage('warning', 'Search again', "CBM changed,Please flight search again", "bottom-right");
                    flag = false;
                }

                else {

                    $.ajax({
                        url: "Services/Mail/AirMailService.svc/UpdatePomailItenaryInformation", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ BookingRefNo: pomailsno, POMailInformation: PomailViewModel, PoMailItineraryInformation: PoMailItineraryViewModel }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {

                            if (result.split('?')[0] == "0") {
                                ShowMessage('success', 'Success - PO Reservation', "Processed Successfully", "bottom-right");
                                $('#__tblairmaildetails__').html();
                                $('#__divairmaildetails__').remove();
                                $('#btnSave').css('display', 'none');
                                $('#btnUpdate').css('display', 'none');
                                $('#btnCancel').css('display', 'none');
                                AirMailSearch();
                                flag = true;
                            }
                            else if (result.split('?')[0] == "1") {
                                ShowMessage('warning', 'Warning - POReservation', result.split('?')[1], "bottom-right");
                                flag = false;
                            }
                            else if (result.split('?')[0] == "2") {
                                ShowMessage('warning', 'Warning - POReservation', result.split('?')[1], "bottom-right");
                                flag = false;
                            }
                            else if (result.split('?')[0] == "3") {
                                ShowMessage('warning', 'Warning - POReservation', result.split('?')[1], "bottom-right");
                                flag = false;
                            }
                            else {
                                ShowMessage('warning', 'Warning - POReservation', "unable to process.", "bottom-right");
                                flag = false;
                            }
                        },
                        error: function (xhr) {
                            ShowMessage('warning', 'Warning - Customer', " unable to process.", "bottom-right");
                            flag = false;
                        }
                    });
                }
            }
            else {
                ShowMessage('warning', 'Warning - POReservation', " unable to process.", "bottom-right");
                flag = false;
            }
        }
        if (subprocess.toUpperCase() == "AIRMAILCUSTOMER") {
            if (cfi.IsValidSubmitSection()) {

                SaveAirMailCustomerInfo();
            }

        }
        if (subprocess.toUpperCase() == "AIRMAILTRANS") {
            if (cfi.IsValidSubmitSection()) {

                SaveAirMailTransInfo();
            }
        }
        if (subprocess.toUpperCase() == "AIRMAILPAYMENT") {

            var sectionId = "";
            if (parseInt(CurrentAirMailSNo) > 0) {
                sectionId = "divDetail";
            }
            else {
                sectionId = "divNewBooking";
            }
            cfi.ValidateSection(sectionId);

            // $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    SavePaymentInfo();
                }
            }
            else {
                return false
            }
            // });


        }

    });

    //$("#ItinerarySearch").unbind("click").bind("click", function () {
    //    if (cfi.IsValidSubmitSection()) {

    //    }
    //});
}

function BindAirMailDetails() {


    cfi.AutoComplete("AirlineCode", "airlinecode,airlinename", "GetAirline_isinterline", "SNo", "airlinecode", ["CarrierCode", "airlinename"], null, "contains");
    cfi.AutoComplete("IssuingAgent", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
    cfi.AutoComplete("MailCategory", "SNo,MailCategoryName", "MailCategory", "SNo", "MailCategoryName", ["MailCategoryCode", "MailCategoryName"], null, "contains");
    cfi.AutoComplete("MailHCCode", "SNo,MHCCode", "MailHandlingClassCode", "SNo", "MHCName", ["MHCCode", "MHCName"], null, "contains");
    cfi.AutoComplete("PostCode", "SNo,Code", "SPHC", "SNo", "Code", null, null, "contains");
    cfi.AutoComplete("PostBranch", "SNo,Code", "SPHC", "SNo", "Code", null, null, "contains");

    cfi.AutoComplete("SPHC", "SNo,Code", "SPHC", "Code", "Code", null, null, "contains");
    // cfi.AutoComplete("ShipmentOrigin", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], ResetFlighDetails, "contains");
    // cfi.AutoComplete("ShipmentDest", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], ResetFlighDetails, "contains");
    cfi.AutoComplete("ShipmentOrigin", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], SelectedAWBOriginDestination, "contains");
    cfi.AutoComplete("ShipmentDest", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], SelectedAWBOriginDestination, "contains");
    cfi.AutoComplete("BoardPoint", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("OffPoint", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("FlightNo", "SNo,FlightNo", "vPoMailFlight", "FlightNo", "FlightNo", null, null, "contains");
    cfi.AutoComplete("ULDTypeSNo", "ULDName", "vwULDTYpeSLI", "SNo", "ULDName", ["ULDName"], null, "contains");
    var UMSource = [{ Key: "0", Text: "K" }];

    cfi.AutoCompleteByDataSource("UM", UMSource);
    var UMSource = [{ Key: "0", Text: "CN38" }, { Key: "1", Text: "CN47" }];

    cfi.AutoCompleteByDataSource("MailNo", UMSource);
    //cfi.AutoComplete("AirportCode", "AirportCode", "VAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
    GetRateInformation();
    ItenaryOthercharges();



    Itinerary_Mail_Update();
    $("#tdItineraryInterlineFlightNo").css("display", "none");
    $("#TotalPieces").unbind("blur").bind("blur", function () {

        CalculatedPieces();
    });
    $("#GrossWeight").unbind("blur").bind("blur", function () {
        CalculateShipmentChWt(this);
    });
    $("#CBM").unbind("blur").bind("blur", function () {
        CalculateShipmentChWt(this);
    });
    $("#ChargeableWeight").unbind("blur").bind("blur", function () {
        compareGrossVolValue();
    });
    if (userContext.AgentSNo > 0 || userContext.OfficeSNo > 0) {
        $("#tdBCT").css("display", "none");
        $("#tdMCT").css("display", "none");
        $("#ROUTECOM").css("display", "none");

    }

    cfi.AutoComplete("ItineraryOrigin", "AIRPORTCODE,CITYNAME", "BuildJoinCityName", "SNO", "CITYNAME", ["AIRPORTCODE", "airportname"], CheckPiecesOnOD, "contains");
    cfi.AutoComplete("ItineraryDestination", "AIRPORTCODE,CITYNAME", "BuildJoinCityName", "SNO", "CITYNAME", ["AIRPORTCODE", "airportname"], CheckPiecesOnOD, "contains");

    cfi.AutoComplete("ItineraryCarrierCode", "CarrierCode", "airline", "SNo", "AirlineName", ["CarrierCode"], null, "contains");
    cfi.AutoComplete("ItineraryFlightNo", "FlightNo", "v_DailyFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");




    // $('.k-datepicker').css('width', '160px');


    $('#FlightDate').change(function () {
        ResetFlighDetails();
    });

    $("#CBM").blur(function () {
        CalculateWeight();
    });
    $("#GrossWeight").blur(function () {
        CalculateWeight();
    });



    $('input[type="checkbox"][id="ULD"]').click(function () {
        if (this.checked) {

            $('#ULDNo').closest('tr').show();
            $('#Text_ULDTypeSNo').closest('tr').show();
        }
        else {

            //$('#ULDNo').hide();
            $('#Text_ULDTypeSNo').closest('tr').hide();
            $('#ULDNo').closest('tr').hide();
            $('#ULDNo').val('');
            $('#OwnerCode').val('');
            $("#Text_ULDTypeSNo").data("kendoAutoComplete").key('');
            $("#Text_ULDTypeSNo").data("kendoAutoComplete").value('');
        }
    });

    var AirMailSNO = (CurrentAirMailSNo == "" ? 0 : CurrentAirMailSNo);

    //for tax information
    var dbTableName = 'TaxChargeInformationTab';
    var pageType = 'View';
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,TaxCode,TaxValue',
        masterTableSNo: AirMailSNO,
        currentPage: 1, itemsPerPage: 50, whereCondition: (0 == "" ? 0 : parseFloat(0)), sort: '',
        servicePath: 'Services/Mail/AirMailService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Tax Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'BookingSNo', type: 'hidden', value: AirMailSNO },
            { name: 'BookingRefNo', type: 'hidden', value: AirMailSNO },
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
    //***End Taxinformation****//

    //** other charge information *************//
    //var dbTableName_other = 'OtherchargeInformation';
    //var pageType = 'View';
    //$('#tbl' + dbTableName_other).appendGrid({
    //    tableID: 'tbl' + dbTableName_other,
    //    contentEditable: pageType != 'View',
    //    tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
    //    masterTableSNo: AirMailSNO,
    //    currentPage: 1, itemsPerPage: 5, whereCondition: (0 == "" ? 0 : parseFloat(0)), sort: '',
    //    servicePath: 'Services/Mail/AirMailService.svc',
    //    getRecordServiceMethod: 'Get' + dbTableName_other + 'Record',
    //    createUpdateServiceMethod: 'createUpdate' + dbTableName_other,
    //    deleteServiceMethod: 'delete' + dbTableName_other,
    //    caption: 'Due Agent Other Charges Information',
    //    initRows: 1,
    //    isGetRecord: true,
    //    columns: [
    //        { name: 'SNo', type: 'hidden', value: 0 },
    //        { name: 'AWBSNo', type: 'hidden', value: 0 },
    //        { name: 'BookingSNo', type: 'hidden', value: AirMailSNO },
    //        { name: 'BookingRefNo', type: 'hidden', value: AirMailSNO },
    //        { name: 'CountryCode', display: 'Country Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, tableName: 'Country', textColumn: 'CountryCode', keyColumn: 'SNo', templateColumn: ["CountryCode", "CountryName"] },
    //        { name: 'InfoType', display: 'Information Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, tableName: 'InformationTypeOCI', textColumn: 'InformationCode', keyColumn: 'SNo', templateColumn: ["InformationCode", "Description"] },
    //        { name: 'CSControlInfoIdentifire', display: 'Customs, Security', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, tableName: 'CustomsOCI', textColumn: 'CustomsCode', keyColumn: 'SNo', templateColumn: ["CustomsCode", "Description"] },
    //        { name: 'SCSControlInfoIdentifire', display: 'Supplementary Customs', type: 'text', value: '', ctrlAttr: { maxlength: 100, controltype: 'alphanumericupper' }, ctrlCss: { width: '200px' } },
    //        { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
    //        { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
    //    ],
    //    beforeRowRemove: function (caller, rowIndex) {
    //        //CheckDimensionTabRowdata(rowIndex);
    //    },
    //    isPaging: false,
    //    hideButtons: { updateAll: false, insert: true, removeLast: true },
    //});


    //*******end othercharge information******//
    $("#imgprocessing").show();
    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetAirMailDetails?AirMailSNO=" + AirMailSNO, async: true, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            ClearItineraryRoute();
            $('#tblSelectdRouteResultbody').html('');
            var Data = jQuery.parseJSON(result);
            var AirMailData = Data.Table0;
            var AirMailData1 = Data.Table1;
            var AirMailData2 = Data.Table2;
            var AirMailData3 = Data.Table3;
            var AirMailData4 = Data.Table4;
            if (AirMailData.length > 0) {
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='CN38No']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightNo']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightDate']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentOrigin']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentDest']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailCategoryName']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailHCCode']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='TotalPieces']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='GrossWeight']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ProcessedStatus']").css('pointer-events', 'none');
                $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='Status']").css('pointer-events', 'none');
                // $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='SNo']").css('pointer-events', 'none');


                $("#AirportCode").val(AirMailData[0].CN38No.substring(0, 3)).prop('disabled', true);
                $("#CN38No").val(AirMailData[0].CN38No.substring(3, 10));
                $("#CN38No").attr("disabled", true);
                // cfi.AutoComplete("AirlineCode", "airlinecode,airlinename", "GetAirline_isinterline", "SNo", "airlinecode", ["airlinecode", "airlinename"], null, "contains");

                $("#Text_MailNo").data("kendoAutoComplete").setDefaultValue(AirMailData[0].MailSno, AirMailData[0].MAILNUMBER);
                //$("#IssuingAgent").val(AirMailData[0].AgentSno);
                //$("#Text_IssuingAgent").val(AirMailData[0].Agentname);
                $("#Text_AirlineCode").data("kendoAutoComplete").setDefaultValue(AirMailData[0].AIRLINECODE, AirMailData[0].AIRLINECODES);
                $("#Text_IssuingAgent").data("kendoAutoComplete").setDefaultValue(AirMailData[0].AGENTSNO, AirMailData[0].AJENTNAME);
                $("#Text_SPHC").data("kendoAutoComplete").setDefaultValue(AirMailData[0].SPHCSNO, AirMailData[0].SPHC);
                $("#Text_MailCategory").data("kendoAutoComplete").setDefaultValue(AirMailData[0].MAILCATEGORYSNO, AirMailData[0].MAILCATEGORYNAME);
                $("#Text_MailHCCode").data("kendoAutoComplete").setDefaultValue(AirMailData[0].MHCCSNO, AirMailData[0].MHCNAME);
                $("#Description").val(AirMailData[0].Description);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(AirMailData1[0].SHIPMENTORIGIN, AirMailData1[0].SHIPMENTORIGIN);
                $("#Text_ShipmentDest").data("kendoAutoComplete").setDefaultValue(AirMailData2[0].SHIPMENTDEST, AirMailData2[0].SHIPMENTDEST);
                //$("#Text_BoardPoint").data("kendoAutoComplete").setDefaultValue(AirMailData[0].BoardPoint, AirMailData[0].BoardPoint);
                // $("#Text_OffPoint").data("kendoAutoComplete").setDefaultValue(AirMailData[0].OffPoint, AirMailData[0].OffPoint);
                $("#FlightDate").val(AirMailData[0].FLIGHTDATE);

                // $("#Text_FlightNo").data("kendoAutoComplete").setDefaultValue(AirMailData[0].FlighNo, AirMailData[0].FlighNo);
                $("#Text_PostCode").data("kendoAutoComplete").setDefaultValue(AirMailData[0].POSTCODE, AirMailData[0].POSTCODE1);
                $("#Text_PostBranch").data("kendoAutoComplete").setDefaultValue(AirMailData[0].POSTBRANCH, AirMailData[0].POSTBRANCH1);
                if (AirMailData[0].UM == "0") {
                    AirMailData[0].UM = "K";
                    $("#Text_UM").data("kendoAutoComplete").setDefaultValue(AirMailData[0].UM, AirMailData[0].UM);
                }




                $("#TotalPieces").val(AirMailData[0].TOTALPIECES);
                $("#_tempTotalPieces").val(AirMailData[0].TOTALPIECES);
                $("#GrossWeight").val(AirMailData[0].GROSSWEIGHT);
                $("#_tempGrossWeight").val(AirMailData[0].GROSSWEIGHT);
                $("#CBM").val(AirMailData[0].CBM);
                $("#_tempCBM").val(AirMailData[0].CBM);
                $("#ChargeableWeight").val(AirMailData[0].CHARGEABLEWEIGHT);
                $("#_tempChargeableWeight").val(AirMailData[0].CHARGEABLEWEIGHT);
                $("#LocationRequired").val(AirMailData[0].LOCATIONREQUIRED);
                $("#AssignLocation").val(AirMailData[0].ASSIGNLOCATION);
                $("#Text_ULDTypeSNo").data("kendoAutoComplete").setDefaultValue(AirMailData[0].ULDTYPESNO, AirMailData[0].ULDTYPE);
                $("#ULDNo").val(AirMailData[0].ULDNO);
                $("#OwnerCode").val(AirMailData[0].OWNERCODE);
                //$("#ULDNO").val(AirMailData[0].AssignLocation);
                $("#Text_SPHC").prop('disabled', true);
                $("#Text_SPHC").closest("span").find("span[class='k-icon k-i-arrow-s']").remove();
                /* LocationRequired,AssignLocation,ULD,ULDNO     */
                //   $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(AirMailData1[0].ShipmentOrigin, AirMailData1[0].ShipmentOrigin);
                //  $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(AirMailData2[0].ShipmentDest, AirMailData2[0].ShipmentDest);
                //  $("#ItineraryDate").val(AirMailData[0].FLIGHTDATE);
                cfi.DateType("ItineraryDate", true);
                $("#ItineraryPieces").val(AirMailData[0].TOTALPIECES);
                $("#ItineraryGrossWeight").val(AirMailData[0].GROSSWEIGHT);
                $("#ItineraryVolumeWeight").val(AirMailData[0].CBM);
                if (AirMailData[0].ULDNO == "") {
                    $('input[type="checkbox"][id="ULD"]').removeAttr("checked");
                    //$('#ULDNo').hide();
                    $('#ULDNo').closest('tr').hide();
                    $('#Text_ULDTypeSNo').closest('tr').hide();
                }
                else {
                    $('input[type="checkbox"][id="ULD"]').attr("checked", "checked");
                    //$('#ULDNo').show();
                    $('#ULDNo').closest('tr').show();
                    $('#Text_ULDTypeSNo').closest('tr').show();

                }

                $('#divFinalSelectedroute').append("<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Selected Route:</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>ETD/ETA</td><td class='ui-widget-header'>Aircraft Type</td><td class='ui-widget-header'>Allotment Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content' id='tblSelectdRouteResultbody'>");
                var container = $('#tblSelectdRouteResultbody');
                //Create an empty container
                var $trs = $();
                var varindex = 2;
                var i = 2;
                // $('#tblSelectdRouteResult tbody').each(function (varindex) {
                for (var ii = 0; ii < AirMailData3.length; ii++) {
                    //Create TR and append TDs to it

                    if (AirMailData3[ii].RESULT == "F") {
                        var $tr = $("<tr id=" + AirMailData3[ii].DAILYFLIGHTSNO + "/>");
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].FLIGHNO + " </td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].FLIGHTDATE + " </td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].ORIGINAIRPORTCODE + '/' + AirMailData3[ii].DESTINATIONAIRPORTCODE + "</td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].FLIGHTPIECES + " </td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].FLIGHTGRWEIGHT + " </td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].FLIGHTVOLUME + " </td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].ETD.substring(0, AirMailData3[ii].ETD.length - 3) + '/' + AirMailData3[ii].ETA.substring(0, AirMailData3[ii].ETA.length - 3) + "</td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].AIRCRAFTTYPE + " </td>"));
                        $tr.append($("<td class='ui-widget-content first'> " + AirMailData3[ii].ALLOTEMENTCODE + " </td>"));
                        if (AirMailData3[ii].AWBROUTESTATUS == '1') {
                            $tr.append($("<td id='RouteStatus' class='ui-widget-content first'> KK </td>"));
                        }
                        if (AirMailData3[ii].AWBROUTESTATUS == '2') {
                            $tr.append($("<td id='RouteStatus' class='ui-widget-content first'> LL </td>"));
                        }
                        if (AirMailData3[ii].AWBROUTESTATUS == '3') {
                            $tr.append($("<td id='RouteStatus' class='ui-widget-content first'> HQ </td>"));
                        }
                        if (AirMailData3[ii].STATUS == '4') {
                            $tr.append($("<td id='Status' class='ui-widget-content first'> BOOKED </td>"));
                        }
                        if (AirMailData3[ii].STATUS == '5') {
                            $tr.append($("<td  id='Status' class='ui-widget-content first'> EXECUTED </td>"));
                        }
                        if (AirMailData3[ii].STATUS == '0') {
                            $tr.append($("<td  id='Status' class='ui-widget-content first'> BOOKED </td>"));
                        }
                        if (AirMailData3[ii].ISSOFTEMBARGOAPPLY.toString().toUpperCase() == "FALSE") {
                            $tr.append($("<td id='SoftEmbargoApplied' class='ui-widget-content first'> NO </td>"));
                        }
                        if (AirMailData3[ii].ISSOFTEMBARGOAPPLY.toString().toUpperCase() == 'TRUE') {
                            $tr.append($("<td id='SoftEmbargoApplied' class='ui-widget-content first'> YES </td>"));
                        }
                        $tr.append($("<td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + AirMailData3[ii].DAILYFLIGHTSNO + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + AirMailData3[ii].DAILYFLIGHTSNO + "\",\"" + AirMailData3[ii].ORIGIN + "\",\"" + AirMailData3[ii].DESTINATION + "\",\"" + AirMailData3[ii].ORIGINSNO + "\",\"" + AirMailData3[ii].DESTINATIONSNO + "\");'><span class='ui-button-text'>Delete</span></button>" +

                            "<input name='hdnOriginCitySNo_" + AirMailData3[ii].DAILYFLIGHTSNO + "' id='hdnOriginCitySNo_" + AirMailData3[ii].DAILYFLIGHTSNO + "' type='hidden' value='" + AirMailData3[ii].ORIGINCITYSNO + "'/><input name='hdnDestinationCitySNo_" + AirMailData3[ii].DAILYFLIGHTSNO + "' id='hdnDestinationCitySNo_" + AirMailData3[ii].DAILYFLIGHTSNO + "' type='hidden' value='" + AirMailData3[ii].DESINATIONCITYSNO + "'/></td>"));

                        //Add each tr to the container
                        $trs = $trs.add($tr);
                    }
                }
                //  });
                $('#AirlineCode').val(AirMailData[0].AIRLINESNO);
                $("#ShipmentOrigin").val(AirMailData1[0].CITYORIGINSNO);
                $("#ShipmentDest").val(AirMailData2[0].CITYDESTINSNO);
                //Append all TRs to the container.
                container.append($trs);

                $('#divFinalSelectedroute').append('</tbody></table>');

                var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                            $(tr).find("[id^='Delete_']").css("display", "none");
                    });
                }
                $("#imgprocessing").hide();
                $("span[id^=MKTRate]").text(AirMailData4[0].MKTRATE);
                $("span[id^=MKTFreight]").text(AirMailData4[0].MKTFREIGHT);
                $("span[id^=refrencenumber]").text(AirMailData4[0].RATEREFNO);
                $("#tdItineraryInterlineFlightNo").css("display", "none");
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

}

function BindAirMailCustomer() {


    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "vSLIShipperDetails", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "vSLIConsigneeDetails", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");

    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetAirMailCustomerInformation?AirMailSNO=" + CurrentAirMailSNo, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AirMailSNO: CurrentAirMailSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='CN38No']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightNo']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightDate']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentOrigin']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentDest']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailCategoryName']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailHCCode']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='TotalPieces']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='GrossWeight']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ProcessedStatus']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='Status']").css('pointer-events', 'none');
            var Data = jQuery.parseJSON(result);
            var AirMailCustomerData = Data.Table0;
            if (AirMailCustomerData.length > 0) {
                $("#SHIPPER_AccountNo").val(AirMailCustomerData[0].SNo);
                $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ShipperAccountNo, AirMailCustomerData[0].ShipperAccountNo);
                //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ShipperName, AirMailCustomerData[0].ShipperName);
                $("#SHIPPER_Name").val(AirMailCustomerData[0].ShipperName);
                $("#SHIPPER_Street").val(AirMailCustomerData[0].ShipperStreet);
                $("#SHIPPER_TownLocation").val(AirMailCustomerData[0].ShipperLocation);
                $("#SHIPPER_State").val(AirMailCustomerData[0].ShipperState);
                $("#SHIPPER_PostalCode").val(AirMailCustomerData[0].ShipperPostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ShipperCountryCode, AirMailCustomerData[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ShipperCityCode, AirMailCustomerData[0].ShipperCityName);
                $("#SHIPPER_MobileNo").val(AirMailCustomerData[0].ShipperMobileNo);
                $("#SHIPPER_Email").val(AirMailCustomerData[0].ShipperEmail);

                //$("#CONSIGNEE_AccountNoName").val(AirMailCustomerData[0].SNo);
                // $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ConsigneeAccountNo, AirMailCustomerData[0].CustomerNo);
                // $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ConsigneeName, AirMailCustomerData[0].ConsigneeName);
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ConsigneeAccountNo, AirMailCustomerData[0].ConsigneeAccountNo);
                $("#CONSIGNEE_AccountNoName").val(AirMailCustomerData[0].ConsigneeName);
                $("#CONSIGNEE_Street").val(AirMailCustomerData[0].ConsigneeStreet);
                $("#CONSIGNEE_TownLocation").val(AirMailCustomerData[0].ConsigneeLocation);
                $("#CONSIGNEE_State").val(AirMailCustomerData[0].ConsigneeState);
                $("#CONSIGNEE_PostalCode").val(AirMailCustomerData[0].ConsigneePostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ConsigneeCityCode, AirMailCustomerData[0].ConsigneeCityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(AirMailCustomerData[0].ConsigneeCountryCode, AirMailCustomerData[0].ConsigneeCountryName);
                $("#CONSIGNEE_MobileNo").val(AirMailCustomerData[0].ConsigneeMobileNo);
                $("#CONSIGNEE_Email").val(AirMailCustomerData[0].ConsigneeEmail);
            }
        },
        error: {
        }
    });
}

function BindAirMailTrans() {

    cfi.AutoComplete("OriCountryCode", "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("DestCountryCode", "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");

    cfi.AutoComplete("OriCityCode", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("DestCityCode", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("MailCategory", "SNo,ClassName", "MailClass", "SNo", "ClassName", ["ClassCode", "ClassName"], ValidateMailSubCategory, "contains");
    cfi.AutoComplete("MailSubCategory", "SNo,Code", "MailSubCategory", "SNo", "Code", ["Code"], null, "contains");

    cfi.AutoComplete("OriOEQualifier", "SNo,OEQualifierName", "OEQualifier", "SNo", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"], null, "contains");
    cfi.AutoComplete("DestOEQualifier", "SNo,OEQualifierName", "OEQualifier", "SNo", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"], null, "contains");

    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetAirMailTrans?AirMailSNO=" + CurrentAirMailSNo, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AirMailSNO: CurrentAirMailSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='CN38No']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightNo']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightDate']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentOrigin']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentDest']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailCategoryName']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailHCCode']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='TotalPieces']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='GrossWeight']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ProcessedStatus']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='Status']").css('pointer-events', 'none');

            var Data = jQuery.parseJSON(result);
            var AirMailPieceData = Data.Table0;
            cfi.makeTrans("mail_airmailtransaction", null, null, BindPieceInfoAutoComplete, ReBindPieceInfoAutoComplete, null, AirMailPieceData, 16);
        },
        error: {

        }
    });
    $('input[type="text"][id="DNNo"]').blur(function (index, item) {
        var dispatchNo = addLeadingZeros($('input[type="text"][id="DNNo"]').val(), 4);
        if (dispatchNo != "" && dispatchNo != "0000")
            $('input[type="text"][id="DNNo"]').val(dispatchNo);
    });
    $('input[type="text"][id="DNNo"]').attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");

    $('input[type="text"][id="ReceptacleWeight"]').blur(function (index, item) {
        var ReceptacleWeight = addLeadingZeros($('input[type="text"][id="ReceptacleWeight"]').val(), 4);
        if (ReceptacleWeight != "" && ReceptacleWeight != "0000")
            $('input[type="text"][id="ReceptacleWeight"]').val(ReceptacleWeight);
    });
    $('input[type="text"][id="ReceptacleWeight"]').attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");

    $('input[type="text"][id="ReceptacleNumber"]').blur(function (index, item) {
        var ReceptacleNumber = addLeadingZeros($('input[type="text"][id="ReceptacleNumber"]').val(), 3);
        if (ReceptacleNumber != "" && ReceptacleNumber != "000")
            $('input[type="text"][id="ReceptacleNumber"]').val(ReceptacleNumber);
    });
    $('input[type="text"][id="ReceptacleNumber"]').attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
}
function CreateAirMailTransGrid() {
    //alert(CurrentAirMailSNo);


    var dbtableName = "AirMailTrans";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: CurrentAirMailSNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: CurrentAirMailSNo, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Mail/AirMailService.svc",
        getRecordServiceMethod: "GetAirMailTrans",
        deleteServiceMethod: "",
        caption: "Piece Information",
        initRows: 1,
        columns: [
                { name: "SNo", type: "hidden" },
                { name: 'OriCountryCode', display: 'Ori. Country', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getCountry', textColumn: 'OriCountryCode', keyColumn: 'CountryCode', filterCriteria: "contains" },
                { name: 'OriCityCode', display: 'Ori. City', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getCITY', textColumn: 'OriCityCode', keyColumn: 'CityCode', filterCriteria: "contains" },
                { name: 'OriOEQualifier', display: 'Ori. OE Qualifier', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getOEQualifier', textColumn: 'OriOEQualifier', keyColumn: 'SNo', filterCriteria: "contains" },

                { name: 'DestCountryCode', display: 'Dest. Country', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getCountry', textColumn: 'OriCountryCode', keyColumn: 'CountryCode', filterCriteria: "contains" },
                { name: 'DestCityCode', display: 'Dest. City', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getCITY', textColumn: 'OriCityCode', keyColumn: 'CityCode', filterCriteria: "contains" },
                { name: 'DestOEQualifier', display: 'Dest. OE Qualifier', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getOEQualifier', textColumn: 'OriOEQualifier', keyColumn: 'SNo', filterCriteria: "contains" },

                { name: 'MailCategory', display: 'Mail Category', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getMailClass', textColumn: 'MailCategory', keyColumn: 'SNo', filterCriteria: "contains" },
                { name: 'MailSubCategory', display: 'Mail Sub Category', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vwMail_getMailSubCategory', textColumn: 'MailSubCategory', keyColumn: 'SNo', filterCriteria: "contains" },
                { name: 'YearOfDispatch', display: 'Year of Dispatch', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true, },
                { name: 'DNNo', display: 'Dispatch No.', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 4, onclick: "return CheckValueValidation(this.id);", onblur: "return CheckValueValidation(this.id);" }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
                { name: 'ReceptacleNumber', display: 'Receptacle Number', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 3, minlength: 3 }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
                { name: 'HNRIndicator', display: 'HNR Indicator', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
                { name: 'RIICode', display: 'RII Code', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 1 }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
                { name: 'ReceptacleWeight', display: 'Receptacle Weight', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 4, minlength: 4, onclick: "return CheckValueValidation(this.id);", onblur: "return CheckValueValidation(this.id);" }, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
                //{ name: 'ReceptacleWeight', display: 'Receptacle Weight', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 4, minlength: 4}, ctrlCss: { width: '50px', height: '20px' }, isRequired: true },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblAirMailTrans']").each(function (row, tr) {
                $(tr).find("input[id^='tblAirMailTrans_OriCityCode_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_OriCountryCode_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_OriOEQualifier_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_DestCityCode_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_DestCountryCode_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_DestOEQualifier_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_DNNo_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_HNRIndicator_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_MailCategory_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_MailSubCategory_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_ReceptacleNumber_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_ReceptacleWeight_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_YearOfDispatch_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblAirMailTrans_RIICode_']").attr("data-valid", "required");

            });
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }
    });

    //$("tr[id^='tblAirMailTrans']").each(function (row, tr) {
    //    CheckValueValidation($(tr).find("input[id^='tblAirMailTrans_DNNo_']").attr("id")); _
    //});
}


//function ExtraCondition(textId) {
//    var filter = cfi.getFilter("AND");
//    if (textId == "MailSubCategory") {
//        cfi.setFilter(filter, "hdnMailCategory", "neq", 0);
//        cfi.setFilter(filter, "hdnMailCategory", "eq", $("#MailCategory").data("kendoAutoComplete").key())
//        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
//        return RegionAutoCompleteFilter;
//    }
//}
function CheckValueValidation(input) {
    var CurrentRow = $('#' + input).closest("tr");
    var Type = true;//CurrentRow.find("input[id^='tblAirMailTrans']").val() == '' ? false : true;

    if (Type) {

        var ReceptacleWeight = addLeadingZeros($('input[type="text"][id="' + input + '"]').val(), 4);
        if (ReceptacleWeight != "" && ReceptacleWeight != "0000") {
            $('input[type="text"][id="' + input + '"]').val(ReceptacleWeight);
            //alert($('input[type="text"][id="' + input + '"]'))
        }
        else {
            $('input[type="text"][id="' + input + '"]').val('');
        }

        $('input[type="text"][id=' + input + ']').attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");

    }

}
function ValidateMailSubCategory() {

    var currentID;
    var id = this.addOnFunction.arguments[0];
    var index = id.split('_')[2];
    if (index == undefined) {
        index = "";
        currentID = "Text_MailSubCategory";
    }
    else {
        currentID = "Text_MailSubCategory_" + index;
    }

    $('#' + currentID).data("kendoAutoComplete").value('');
    $('#' + currentID).data("kendoAutoComplete").key('');
}

function BindPieceInfoAutoComplete(elem, mainElem) {

    $(elem).find("input[id^='OriCountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    });

    $(elem).find("input[id^='DestCountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    });
    $(elem).find("input[id^='OriCityCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    });
    $(elem).find("input[id^='DestCityCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    });
    $(elem).find("input[id^='OriOEQualifier']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "SNo,OEQualifierName", "OEQualifier", "SNo", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"], null, "contains");
    });
    $(elem).find("input[id^='DestOEQualifier']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "SNo,OEQualifierName", "OEQualifier", "SNo", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"], null, "contains");
    });
    $(elem).find("input[id^='MailCategory']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "SNo,ClassName", "MailClass", "SNo", "ClassName", ["ClassCode", "ClassName"], ValidateMailSubCategory, "contains");
    });

    $(elem).find("input[id^='MailSubCategory']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "SNo,Code", "MailSubCategory", "SNo", "Code", ["Code"], null, "contains");
    });

    $('input[type="text"][id^="DNNo_"]').blur(function (index, item) {
        var num = this.value;
        var dispatchValue = addLeadingZeros(num, 4);
        if (dispatchValue != "" && dispatchValue != "0000")
            $('#' + this.id).val(dispatchValue);
    });

    $('input[type="text"][id^="DNNo_"]').each(function (index, item) {
        $('#' + this.id).attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
    });

    $('input[type="text"][id^="ReceptacleWeight_"]').blur(function (index, item) {
        var num = this.value;
        var ReceptacleWeight = addLeadingZeros(num, 4);
        if (ReceptacleWeight != "" && ReceptacleWeight != "0000")
            $('#' + this.id).val(ReceptacleWeight);
    });

    $('input[type="text"][id^="ReceptacleWeight_"]').each(function (index, item) {
        $('#' + this.id).attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
    });

    $('input[type="text"][id^="ReceptacleNumber_"]').blur(function (index, item) {
        var num = this.value;
        var ReceptacleNumber = addLeadingZeros(num, 3);
        if (ReceptacleNumber != "" && ReceptacleNumber != "000")
            $('#' + this.id).val(ReceptacleNumber);
    });

    $('input[type="text"][id^="ReceptacleNumber_"]').each(function (index, item) {
        $('#' + this.id).attr("oninput", "this.value = this.value.replace(/[^0-9]/g, '')");
    });

}

function ReBindPieceInfoAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_mail_airmailtransaction']").find("[id^='areaTrans_mail_airmailtransaction']").each(function () {


        $(this).find("input[id^='OriCountryCode']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"]);
            //cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='DestCountryCode']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CountryCode,CountryName", "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"]);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "CountryCode", "CountryName", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='OriCityCode']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"]);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "City", "CityCode", "CityName", ["CityCode", "CityName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='DestCityCode']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"]);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "City", "CityCode", "CityName", ["CityCode", "CityName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='OriOEQualifier']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "OEQualifierCode,OEQualifierName", "OEQualifier", "OEQualifierCode", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"]);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "OEQualifier", "SNo", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='DestOEQualifier']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "OEQualifierCode,OEQualifierName", "OEQualifier", "OEQualifierCode", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"]);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "OEQualifier", "SNo", "OEQualifierName", ["OEQualifierCode", "OEQualifierName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='MailCategory']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SNo,ClassName", "MailClass", "SNo", "ClassName", ["ClassCode", "ClassName"], ValidateMailSubCategory);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "MailClass", "SNo", "ClassName", ["ClassCode", "ClassName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='MailSubCategory']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SNo,Code", "MailSubCategory", "SNo", "Code", ["Code"]);
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "MailSubCategory", "SNo", "Code", ["Code"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

    });
}

function SaveFormData(subprocess) {


    $("#imgprocessing").show();
    var issave = false;

    if (subprocess.toUpperCase() == "AIRMAIL") { // Save New Record

        // issave = SaveAirmail();
        issave = SaveItinerary();
    }
    if (subprocess.toUpperCase() == "AIRMAILCUSTOMER") {
        issave = SaveAirMailCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "AIRMAILTRANS") {
        issave = SaveAirMailTransInfo();
    }
    else if (subprocess.toUpperCase() == "AIRMAILDETAILS") { // Update Po mail details

        issave = SaveAirmail();
    }
    else if (subprocess.toUpperCase() == "AIRMAILPAYMENT") {
        // Harish
        issave = SavePaymentInfo();
    }

    $("#imgprocessing").hide();
    return issave;
}
var PoMailSNumber = '';
function SaveItinerary() {


    var flag = true;
    $("#AirportCode").removeAttr("disabled");
    var _AirMailSNo = (CurrentAirMailSNo == "" ? 0 : CurrentAirMailSNo);
    $("#CBM").val($("#CBM").val() == "" ? 0.00 : $("#CBM").val());
    var _ShipmentInformation = $("#divDetail").serializeToJSON();
    if (_ShipmentInformation.ULDTypeSNo == "") {
        _ShipmentInformation.ULDTypeSNo = 0;
    }

    var result = CheckAndValidateData();
    if (result == true) {
        //flag = SaveAirmail();
        if (flag == true) {

            var PoMailItineraryViewModel = [];
            var PomailViewModel = {
                // SNo: "0",

                CN38No: $('#AirportCode').val() + '' + $("#CN38No").val(),
                AirlineCode: $("#AirlineCode").val(),
                IssuingAgent: $("#IssuingAgent").val(),
                SPHC: $("#SPHC").val(),
                MailCategory: parseInt($("#MailCategory").val().split('-')[0]),
                MailHCCode: $("#MailHCCode").val() == '' ? 0 : $("#MailHCCode").val(),
                Description: $("#Description").val(),
                ShipmentOrigin: $("#ShipmentOrigin").val().split('-')[0],
                ShipmentDest: $("#ShipmentDest").val().split('-')[0],
                //FlightDate: $("#ItineraryDate").val(),
                PostCode: $("#PostCode").val(),
                PostBranch: $("#PostBranch").val(),
                TotalPieces: parseInt($("#TotalPieces").val()),
                GrossWeight: parseFloat($("#GrossWeight").val()),
                CBM: parseFloat($("#CBM").val()),
                ChargeableWeight: parseFloat($("#ChargeableWeight").val()),
                LocationRequired: $("#AssignLocation").prop('checked') == true ? 1 : 0,
                ULDTypeSNo: $("#ULDTypeSNo").val() == '' ? 0 : $("#ULDTypeSNo").val(),
                ULDNo: $("#ULD").prop('checked') == true ? 1 : 0,

            }
            var Pieces_ = '';
            var GrossWeight_ = '';
            var VolumeWeight_ = '';
            var origin_ = '';
            var destination_ = '';

            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {

                var ReservationItineraryInfo = {
                    SNo: "0",
                    ReservationBookingSNo: "0",
                    ReservationBookingRefNo: null,
                    AWBPieces: $("#TotalPieces").val(),
                    AWBGrossWeight: $("#GrossWeight").val(),
                    AWBVolumeWeight: $("#CBM").val(),

                    DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id.split('/')[0],
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
                    SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id.split('/')[0]).val()
                };
                PoMailItineraryViewModel.push(ReservationItineraryInfo);

            });

            $.ajax({
                url: "Services/Mail/AirMailService.svc/SaveItinerary", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AirMailSNo: _AirMailSNo, ShipmentInformation: _ShipmentInformation, MovementType: MovementType, AirlineCode: 0, POMailInformation: PomailViewModel, PoMailItineraryInformation: PoMailItineraryViewModel }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {


                    if (result.split('/')[0] == "RATENOTAVAILABLE") {
                        ShowMessage('warning', 'Warning - Rate', "Rate not available.", "bottom-right");
                        flag = false;

                    }
                    else if (result.split('/')[0] != "RATENOTAVAILABLE" && result.split('/')[0] != "Success") {
                        ShowMessage('warning', 'Warning - Airmail', result.split('/')[0], "bottom-right");
                    }
                        //else  if (result.split('/')[0] == "Mail Type No is already used") {
                        //    ShowMessage('warning', 'Warning - Airmail', "Mail Type No is already used", "bottom-right");
                        //      flag = false;

                        //  }

                    else if (result.split('?')[0].split('/')[1] == "0") {
                        ShowMessage('success', 'Success - PO Reservation', "Processed Successfully", "bottom-right");
                        $('#__tblairmaildetails__').html();
                        $('#__divairmaildetails__').remove();
                        $('#btnSave').css('display', 'none');
                        $('#btnCancel').css('display', 'none');
                        $('#btnNew').css('display', 'block');
                        AirMailSearch();
                        flag = true;
                    }
                    else if (result.split('?')[0].split('/')[1] == "1") {
                        ShowMessage('warning', 'Warning - POReservation', result.split('?')[1], "bottom-right");
                        flag = false;
                    }
                    else if (result.split('?')[0].split('/')[1] == "2") {
                        ShowMessage('warning', 'Warning - POReservation', result.split('?')[1], "bottom-right");
                        flag = false;
                    }
                    else if (result.split('?')[0].split('/')[1] == "3") {
                        ShowMessage('warning', 'Warning - POReservation', result.split('?')[1], "bottom-right");
                        flag = false;
                    }

                    else {
                        ShowMessage('warning', 'Warning - POReservation', "unable to process.", "bottom-right");
                        flag = false;
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Customer', " unable to process.", "bottom-right");
                    flag = false;
                }
            });
        }
        //else {
        //    ShowMessage('warning', 'Warning - Rate', "Rate not available.", "bottom-right");
        //}
    }


    else {
        ShowMessage('warning', 'Warning - Reservation', "Pieces or Gross Weight or Volume not match Origin Destination Pair.", "bottom-right");
    }



}


function CheckAndValidateData() {

    var CheckAndValidateDataArray = [];
    var result = false;
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var IsRoutingComplete = $("#chkIsRoutingComplete").prop("checked") ? "1" : "0";
    var AWBPieces = ($("#TotalPieces").val() == "" ? 0 : parseFloat($("#TotalPieces").val()));
    var AWBGrossWeight = ($("#GrossWeight").val() == "" ? 0 : parseFloat($("#GrossWeight").val()));
    var AWBCBM = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var AWBOriginCitySNo = $("#Text_ShipmentOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_ShipmentDest").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ShipmentDest").data("kendoAutoComplete").key();
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
            if (ItemAWBPieces == AWBPieces && ItemAWBGrossWeight == AWBGrossWeight && ItemVolumeWeight == AWBCBM)
                result = true;
            else {
                result = false;
                return false;
            }
        }
    }
    if (IsRoutingComplete == 0) {
        if (IsmatchAWBOriginCity == true && IsmatchAWBDestinationCity == true) {
            result = true;
        }
        else {
            result = false;
            return false;
        }
    }
    else {
        if (IsmatchAWBOriginCity == true) {
            result = true;
        }
        else {
            result = false;
            return false;
        }
    }
    return result;
}

function SaveAirmail() {

    var flag = false;
    $("#AirportCode").removeAttr("disabled");
    var _AirMailSNo = (CurrentAirMailSNo == "" ? 0 : CurrentAirMailSNo);
    $("#CBM").val($("#CBM").val() == "" ? 0.00 : $("#CBM").val());
    var _ShipmentInformation = $("#divDetail").serializeToJSON();
    if (_ShipmentInformation.ULDTypeSNo == "") {
        _ShipmentInformation.ULDTypeSNo = 0;
    }


    $.ajax({
        url: "Services/Mail/AirMailService.svc/SaveAirmail", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AirMailSNo: _AirMailSNo, ShipmentInformation: _ShipmentInformation, MovementType: MovementType, AirlineCode: parseInt($('#Text_AirlineCode').val().split('-')[0]) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            PoMailSNumber = result.split('/')[1];
            if (result.split('/')[0] == "Success") {

                //  ShowMessage('success', 'Success -Airmail', "Processed Successfully", "bottom-right");
                //$("#btnSave").unbind("click");
                //$("#btnSave").unbind("click").bind("click", function () {
                //    SaveAirmail();
                //    SaveItinerary();
                //    AirMailSearch();
                //});
                flag = true;
            }
            else if (result.split('/')[0] == "RATENOTAVAILABLE") {
                ShowMessage('warning', 'Warning - Rate', "Rate not available.", "bottom-right");
                flag = false;

            }
            else
                ShowMessage('warning', 'Warning - Airmail', result, "bottom-right");
        },
        error: function (xhr) {

            ShowMessage('warning', 'Warning - Airmail', "unable to process.", "bottom-right");

        }
    });
    return flag;
}

function SaveAirMailCustomerInfo() {
    var flag = false;
    var _AirMailSNo = (CurrentAirMailSNo == "" ? 0 : CurrentAirMailSNo);
    var _AirmailCustomer = $("#divDetail").serializeToJSON();

    $.ajax({
        url: "Services/Mail/AirMailService.svc/SaveAirmailCustomer", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AirMailSNo: _AirMailSNo, Customer: _AirmailCustomer, SHIPPER_AccountNo: $('#Text_SHIPPER_AccountNo').val(), CONSIGNEE_AccountNo: $('#Text_CONSIGNEE_AccountNo').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "Success") {
                ShowMessage('success', 'Success -Airmail', " Customer Info Processed Successfully", "bottom-right");
                $("#btnSave").unbind("click");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Airmail', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Airmail', "unable to process.", "bottom-right");

        }
    });

    return flag;
}

function SaveAirMailTransInfo() {

    var flag = false;
    var _AirMailSNo = (CurrentAirMailSNo == "" ? 0 : CurrentAirMailSNo);
    //var lstPiece = $("#divDetail").serializeToJSON();
    var arrPiece = [];

    //if (lstPiece != null && lstPiece.airmailtransaction.length > 0) {
    //    $.each(lstPiece.airmailtransaction, function (i) {
    //        var PieceModel = {
    //            OriCityCode: lstPiece.airmailtransaction[i].OriCityCode,
    //            OriCountryCode: lstPiece.airmailtransaction[i].OriCountryCode,
    //            OriOEQualifier: lstPiece.airmailtransaction[i].OriOEQualifier,
    //            DestCityCode: lstPiece.airmailtransaction[i].DestCityCode,
    //            DestCountryCode: lstPiece.airmailtransaction[i].DestCountryCode,
    //            DestOEQualifier: lstPiece.airmailtransaction[i].DestOEQualifier,
    //            DNNo: lstPiece.airmailtransaction[i].DNNo,
    //            HNRIndicator: lstPiece.airmailtransaction[i].HNRIndicator,
    //            MailCategory: lstPiece.airmailtransaction[i].MailCategory,
    //            MailSubCategory: lstPiece.airmailtransaction[i].MailSubCategory,
    //            ReceptacleNumber: lstPiece.airmailtransaction[i].ReceptacleNumber,
    //            ReceptacleWeight: lstPiece.airmailtransaction[i].ReceptacleWeight,
    //            RIICode: lstPiece.airmailtransaction[i].RIICode,
    //            YearOfDispatch: lstPiece.airmailtransaction[i].YearOfDispatch,
    //        };
    //        arrPiece.push(PieceModel);
    //    });
    $("tr[id^='tblAirMailTrans_Row']").each(function (row, tr) {
        var PieceModel = {
            OriCityCode: $(tr).find("input[id^='tblAirMailTrans_HdnOriCityCode_']").val(),
            OriCountryCode: $(tr).find("input[id^='tblAirMailTrans_HdnOriCountryCode_']").val(),
            OriOEQualifier: $(tr).find("input[id^='tblAirMailTrans_HdnOriOEQualifier_']").val(),
            DestCityCode: $(tr).find("input[id^='tblAirMailTrans_HdnDestCityCode_']").val(),
            DestCountryCode: $(tr).find("input[id^='tblAirMailTrans_HdnDestCountryCode_']").val(),
            DestOEQualifier: $(tr).find("input[id^='tblAirMailTrans_HdnDestOEQualifier_']").val(),
            DNNo: $(tr).find("input[id^='tblAirMailTrans_DNNo_']").val(),
            HNRIndicator: $(tr).find("input[id^='tblAirMailTrans_HNRIndicator_']").val(),
            MailCategory: $(tr).find("input[id^='tblAirMailTrans_HdnMailCategory_']").val(),
            MailSubCategory: $(tr).find("input[id^='tblAirMailTrans_HdnMailSubCategory_']").val(),
            ReceptacleNumber: $(tr).find("input[id^='tblAirMailTrans_ReceptacleNumber_']").val(),
            ReceptacleWeight: $(tr).find("input[id^='tblAirMailTrans_ReceptacleWeight_']").val(),
            RIICode: $(tr).find("input[id^='tblAirMailTrans_RIICode_']").val(),
            YearOfDispatch: $(tr).find("input[id^='tblAirMailTrans_YearOfDispatch_']").val(),

        }
        arrPiece.push(PieceModel);

    });
    if (arrPiece != null && arrPiece.length > 0) {
        $.ajax({
            url: "Services/Mail/AirMailService.svc/SaveAirmailTrans", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AirMailSNo: _AirMailSNo, LstPieceTrans: arrPiece }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "Success") {
                    ShowMessage('success', 'Success -Airmail', "Processed Successfully", "bottom-right");
                    //$("#btnSave").unbind("click");

                    $("#btnSave").unbind("click").bind("click", function () {

                        SaveAirMailTransInfo();
                        AirMailSearch();

                    });

                    AirMailSearch();
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - Airmail', "Please correct value(s) for :- " + result + ".", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Airmail', "unable to process.", "bottom-right");

            }
        });
    }
    //}
    counter = 0;
    return flag;
}

// clear entries on row change - deepak sharma
function onRowChange(arg) {
    $("#divDetail").html("");
    $("#tblairmailpayment").hide();
    $("#divNewAirMail").html("");
    $("#btnSave").unbind("click");
}

function ClearShipperConsigneeUI(Utype) {
    if (Utype == "S") {
        // $("#Text_SHIPPER_Name").data("kendoAutoComplete").key("");
        $("#Text_SHIPPER_Name").val("");
        $("#SHIPPER_Name").val("");
        $("#SHIPPER_Street").val("");
        $("#SHIPPER_TownLocation").val("");
        $("#SHIPPER_State").val("");
        $("#SHIPPER_PostalCode").val("");
        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key("");
        $("#Text_SHIPPER_City").data("kendoAutoComplete").key("");
        $("#Text_SHIPPER_CountryCode").val("");
        $("#Text_SHIPPER_City").val("");
        $("#SHIPPER_MobileNo").val("");
        $("#SHIPPER_Email").val("");
    }
    else if (Utype == "C") {
        // $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").key("");
        $("#Text_CONSIGNEE_AccountNoName").val("");
        $("#CONSIGNEE_AccountNoName").val("");
        $("#CONSIGNEE_Street").val("");
        $("#CONSIGNEE_TownLocation").val("");
        $("#CONSIGNEE_State").val("");
        $("#CONSIGNEE_PostalCode").val("");
        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key("");
        $("#Text_CONSIGNEE_City").val("");
        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key("");
        $("#Text_CONSIGNEE_CountryCode").val("");
        $("#CONSIGNEE_MobileNo").val("");
        $("#CONSIGNEE_Email").val("");
    }
}

function InstantiateControl(containerId) {

    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
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
    SetDateRangeValue();

    //$("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    if ($(this).attr("recname") == undefined) {
    //        var controlId = $(this).attr("id");
    //        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //    }
    //});
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
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //   ChangeAllControlToLable("aspnetForm");
}

function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
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
    //cfi.AutoComplete("searchOriginCity", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    //cfi.AutoComplete("searchDestinationCity", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
}

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New Airmail</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnUpdate'>Update</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext' style='display:none;'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divAirMailDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewAirMail' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div></div></td></tr></table> </td></tr></table></div><div id='divViewRoutePopUp' style='width:100%'></div>";

function CalculateWeight() {
    var grWt = parseFloat($('#GrossWeight').val() == "" ? "0" : $('#GrossWeight').val());
    var volWt = parseFloat($('#CBM').val() == "" ? "0" : $('#CBM').val() * 166.66);
    $('#ChargeableWeight').val((grWt > volWt ? grWt : volWt).toFixed(2));
    $('#_tempChargeableWeight').val((grWt > volWt ? grWt : volWt).toFixed(2));
}

// binding dropdown list data from Klas Database
function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
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

var fblurl = 'Services/AutoCompleteService.svc/POMailAutoCompleteDataSource';
function GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? fblurl : serviceurl + newUrl),
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
                    cityChangeFlag: cityChangeFlag
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


//Start - > Air Mail Payment Section
function BindAirMailPayment() {

    var AirMailSNO = (CurrentAirMailSNo == "" ? 0 : CurrentAirMailSNo);

    $("div[id='divareaTrans_mail_airmailpayment']").find("table:first").find("tr[id='divareaTrans_mail_airmailpayment']:first").show();

    $.ajax({
        // change to do -harish
        //url: "Services/Shipment/AcceptanceService.svc/GetRecordAtPayment?AWBSNo=" + CurrentAirMailSNo, async: false, type: "get", dataType: "json", cache: false,
        url: "Services/Mail/AirMailService.svc/GetRecordAtPayment?AirMailSNo=" + CurrentAirMailSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='CN38No']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightNo']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='FlightDate']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentOrigin']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ShipmentDest']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailCategoryName']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='MailHCCode']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='TotalPieces']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='GrossWeight']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='ProcessedStatus']").css('pointer-events', 'none');
            $("div[data-role^='grid']").find('tbody').find('tr').find("td[data-column^='Status']").css('pointer-events', 'none');
            var payementData = jQuery.parseJSON(result);
            var handlingChargeArray = payementData.Table0;
            //var awbChequeArray = payementData.Table1;
            var PicesArray = payementData.Table3;
            if (PicesArray.length > 0) {
                $("#tdPcs").text(PicesArray[0].AWBTOTALPIECES);
            }
            var awbChequeArray = [];
            if (payementData.Table1.length > 0) {
                $("span[id='AgentName']").text(payementData.Table1[0].AgentName.toUpperCase());
                $("input[name='AgentName']").val(payementData.Table1[0].AgentBranchSNo);
            }
            else {
                $("span[id='AgentName']").text('');
                $("input[name='AgentName']").val('');

            }


            //if (awbChequeArray.length > 0) {
            //    $('#CashAmount').val(awbChequeArray[0].Amount)
            //    if (awbChequeArray[0].PaymentMode == "Cash")
            //        $('#PaymentMode:checked').val("0");
            //    else
            //        $('#PaymentMode:checked').val("1");
            //    printInvoiceSno = payementData.Table1[0].InvoiceSno;
            //    printorigin = payementData.Table1[0].CityCode;

            //    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
            //}

            var tableHandleCharge = "";
            var BillAmt = 0.000;
            var CreditAmt = 0.000;

            if (handlingChargeArray.length > 0) {
                $("div[id='divareaTrans_mail_airmailpayment']").find("table:first").find("tr:first").find("td:last").hide();
                $("div[id='divareaTrans_mail_airmailpayment']").find("table:first").find("tr[id='areaTrans_mail_airmailpayment']:first").hide();
                for (var i = 0; i < handlingChargeArray.length; i++) {
                    tableHandleCharge += "<tr><td>" + (i + 1) + "</td><td>" + handlingChargeArray[i].IsWaveOff + "</td><td>" + handlingChargeArray[i].Description.toUpperCase() + "</td><td>" + handlingChargeArray[i].pBasis + "</td><td>" + handlingChargeArray[i].sBasis + "</td><td>" + handlingChargeArray[i].ChargeValue + "</td><td>" + handlingChargeArray[i].TotalChargeTaxAmount + "</td><td>" + handlingChargeArray[i].Amount + "</td><td>" + handlingChargeArray[i].PaymentMode + "</td><td>" + handlingChargeArray[i].Remarks + "</td><td>" + handlingChargeArray[i].ChargeTo + "</td></tr>"

                    if (handlingChargeArray[i].IsWaveOff.toUpperCase() == "NO") {
                        if (handlingChargeArray[i].PaymentMode == "CASH") {

                            BillAmt = BillAmt + parseFloat(handlingChargeArray[i].Amount == "" ? "0" : handlingChargeArray[i].Amount);
                        } else {
                            CreditAmt = CreditAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
                        }
                    }
                }
                $("div[id='divareaTrans_mail_airmailpayment']").find("table:first").find("tr").each(function () {
                    $(this).find("td:contains('Payment')").css("display", "none");
                    $(this).find("td:contains('Action')").css("display", "none");
                    $(this).find("td:contains('Credit')").text("Mode");

                    $(this).find("td:eq(8)").remove(); // hide rate
                    $(this).find("td:eq(10)").remove(); // Hide Min
                    $(this).find("td:eq(10)").remove(); // Hide totaltaxamount
                });

                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='FBLAmount']").text(parseFloat(BillAmt).toFixed(3));
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='FBLAmount']").val(parseFloat(BillAmt).toFixed(3));
                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='CrediAmount']").text(parseFloat(CreditAmt).toFixed(3));

                $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='CrediAmount']").val(parseFloat(CreditAmt).toFixed(3));
                $("#CashAmount").val(parseFloat(BillAmt).toFixed(3));
                $("#_tempCashAmount").val(parseFloat(BillAmt).toFixed(3));
                $("#CashAmount").prop('readonly', true);
                $("#_tempCashAmount").prop('readonly', true);
                $("span[id^='spnCashAmount']").closest('tr').find("td:eq(0)").find("font").remove();

            }

            if (handlingChargeArray.length == 0 && awbChequeArray.length == 0) {
                cfi.makeTrans("mail_airmailpayment", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, null);
                cfi.makeTrans("mail_airmailpaymentaddcheque", null, null, BindBankAutoComplete, ReBindBankAutoComplete, null, null);

                $("div[id$='areaTrans_mail_airmailpaymentaddcheque']").find("[id='areaTrans_mail_airmailpaymentaddcheque']").each(function () {
                    $(this).find("input[id^='BankName']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
                    });
                });
                $("div[id$='areaTrans_mail_airmailpayment']").find("span[id^='spnAmount']").text('Amount');

                //$("div[id$='areaTrans_mail_airmailpayment']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table2[0].CurrencyCode + ')');
                // charge Name
                var origin = $('#tblairmailpayment tr:nth-child(4)>td:eq(2)').text().split('-')[0];
                origin = 'KUL';
                $("div[id$='divareaTrans_mail_airmailpayment']").find("[id='areaTrans_mail_airmailpayment']").each(function () {
                    $(this).find("input[id^='ChargeName']").each(function () {

                        cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", CurrentAirMailSNo, 0, origin, 0, "", "2", "999999999", "No");

                        //cfi.AutoComplete($(this).attr("name"), "SNo,ChargeName", null, "SNo", "ChargeName", null, null, "contains"); //invhandlingChargemaster
                    });
                    $(this).find("input[id^='BillTo']").each(function () {
                        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
                    });
                    $(this).find("input[id^='Amount']").each(function () {
                        $(this).unbind("blur").bind("blur", function () {
                            CalculateFBLAmount(this);
                        });
                    });

                });
                $("#CashAmount").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });

                var origin = $('#tblairmailpayment tr:nth-child(4)>td:eq(2)').text().split('-')[0];
                origin = 'KUL';
                $.ajax({
                    //url: "Services/Shipment/AcceptanceService.svc/FBLHandlingCharges?AWBSNo=" + CurrentAirMailSNo + "&CityCode=" + origin, async: false, type: "get", dataType: "json", cache: false,
                    url: "Services/Mail/AirMailService.svc/FBLHandlingCharges?AirMailSNo=" + CurrentAirMailSNo + "&CityCode=" + origin, async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {

                        paymentData = jQuery.parseJSON(result);
                        paymentList = paymentData.Table0;
                        //Added By Manoj Kumar on 16/9/2015

                        // Binding Manadatory Payment Charges
                        MendatoryPaymentCharges = [];
                        $(paymentList).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                //MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "amount": i.ChargeAmount, "totalamount": parseFloat(parseFloat(i.ChargeAmount) + parseFloat(i.GSTAmount)).toFixed(2), "remarks": i.ChargeRemarks, "list": 1 });
                                MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "primarybasis": i.pValue, "secondarybasis": i.sValue, "amount": i.ChargeAmount, "tax": i.TotalTaxAmount, "totalamount": parseFloat(i.TotalAmount), "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, "min": i.Min, "totaltaxamount": i.TotalTaxAmount, "list": 1, "billto": i.ChargeTo, "text_billto": i.Text_ChargeTo, "punit": i.PrimaryBasis, "sunit": i.SecondaryBasis });
                            }
                        })

                        cfi.makeTrans("mail_airmailpayment", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, MendatoryPaymentCharges);
                        ///
                        //$("span[id='AgentName']").text(paymentData.Table1[0].AgentName);
                        //$("input[name='AgentName']").val(paymentData.Table1[0].AgentBranchSNo);
                        //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
                        //Added By Manoj Kumar on 16/9/2015
                        if (MendatoryPaymentCharges.length > 0) {
                            $("div[id$='divareaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function (row, tr) {
                                $(tr).find('td:eq(3)').css('width', '100px');
                                $(tr).find('td:eq(4)').css('width', '100px');
                                $(tr).find('td:eq(10)').css("display", "none");
                                $(tr).find('td:eq(11)').css("display", "none");
                                $(tr).find('td:eq(12)').css("display", "none");
                                $(tr).find("input[id^='chkCash']").prop('checked', false);
                                $(tr).find("input[id^='chkCredit']").prop('checked', true);
                                //$(tr).find("td:last").remove();
                                $(tr).find("span[id^='TotalAmount']").attr('title', $(tr).find("input[id^='Remarks']").val());
                                $(tr).find("input[id^='PrimaryBasis']").closest('td').append("&nbsp;&nbsp;<span id=PrimaryBasis_" + row + ">" + MendatoryPaymentCharges[row].punit + "</span>");
                                $(tr).find("input[id^='SecondaryBasis']").closest('td').append("&nbsp;&nbsp;<span id=SecondaryBasis_" + row + ">" + MendatoryPaymentCharges[row].sunit + "</span>");
                                if (MendatoryPaymentCharges[row].sunit == "") {
                                    $(tr).find("input[id*='SecondaryBasis']").css("display", "none");
                                    $(tr).find("span[id^='SecondaryBasis']").css("display", "none");
                                }
                            });
                        }

                        $("div[id='divareaTrans_mail_airmailpayment'] table tr").each(function (row, tr) {
                            if ($(tr).find("td[id^=tdSNoCol]").text() != "" && $(tr).find("td[id^=tdSNoCol]").text() != undefined) {
                                if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) < MendatoryPaymentCharges.length) {
                                    $(tr).find("td[id^=transAction]").remove();
                                    $(tr).find("input[id^='PrimaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempPrimaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='SecondaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempSecondaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                    $(tr).find("input[id^='Amount']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempAmount']").attr('disabled', true);
                                    $(tr).find("input[id^='Tax']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempTax']").attr('disabled', true);
                                    //$(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                    //$(tr).find("input[id^='Amount']").attr('disabled', true);
                                    //$(tr).find("input[id^='_tempAmount']").attr('disabled', true);
                                }
                                else if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) == MendatoryPaymentCharges.length) {
                                    $(tr).find("td[id^=transAction]").find("i[title=Delete]").remove();
                                    $(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                    $(tr).find("input[id^='PrimaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempPrimaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='SecondaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempSecondaryBasis']").attr('disabled', true);
                                    $(tr).find("input[id^='Amount']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempAmount']").attr('disabled', true);
                                    $(tr).find("input[id^='Tax']").attr('disabled', true);
                                    $(tr).find("input[id^='_tempTax']").attr('disabled', true);
                                    //$(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                    //$(tr).find("input[id^='Amount']").attr('disabled', true);
                                    //$(tr).find("input[id^='_tempAmount']").attr('disabled', true);
                                }
                            }

                            $("div[id$='divareaTrans_mail_airmailpayment']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='chkWaveof']").attr('disabled', userContext.SpecialRights.WAV == false ? true : false);

                            $(tr).find("input[id^=Text_ChargeName]").each(function () {
                                if (MendatoryPaymentCharges.length > 0) {
                                    var NMendatory = getNonObjects(MendatoryPaymentCharges, 'chargename', $(this).data("kendoAutoComplete").key());
                                    //if (NMendatory.length > 0) { // harish
                                    if (NMendatory[0].billto != "2") {
                                        $(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                                    }
                                    //}
                                }

                                else {
                                    $(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                                }

                            });
                            //$(tr).find("input[id^=Text_ChargeName]").data("kendoAutoComplete").key();
                        });

                        CalculateTotalFBLAmount();
                        //
                        $("div[id$='divareaTrans_mail_airmailpayment']").find("tr:eq(2)").find("td:eq(3)").css('width', '100px');
                        $("div[id$='divareaTrans_mail_airmailpayment']").find("tr:eq(2)").find("td:eq(4)").css('width', '100px');

                        $("div[id$='divareaTrans_mail_airmailpayment']").find("tr:eq(2)").find("td:eq(10)").css("display", "none");
                        $("div[id$='divareaTrans_mail_airmailpayment']").find("tr:eq(2)").find("td:eq(11)").css("display", "none");
                        $("div[id$='divareaTrans_mail_airmailpayment']").find("tr:eq(2)").find("td:eq(12)").css("display", "none");
                        $("div[id$='divareaTrans_mail_airmailpayment']").find("tr td:last").css('width', '60px');
                        $("div[id$='divareaTrans_mail_airmailpayment']").find("tr").find("input[id^='Text_BillTo']").closest('span').css('width', '70px');
                        $("span[id^='spnCashAmount']").closest('tr').find("td:eq(0)").find("font").remove();

                    },
                    error: function (xhr) {

                    }
                });

                //$("span[id='AgentName']").text(paymentData.Table1[0].AgentName);
                //$("input[name='AgentName']").val(paymentData.Table1[0].AgentBranchSNo);
                //$("div[id$='divareaTrans_mail_airmailpayment']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
                //Added By Manoj Kumar on 16/9/2015
                CalculateTotalFBLAmount();

                var sectionId = "";
                if (parseInt(CurrentAirMailSNo) > 0) {
                    sectionId = "divDetail";
                }
                else {
                    sectionId = "divNewBooking";
                }
                cfi.ValidateSection(sectionId);

                $("#btnSave").unbind("click").bind("click", function () {
                    if (cfi.IsValidSection(sectionId)) {
                        if (true) {
                            SavePaymentInfo();
                        }
                    }
                    else {
                        return false
                    }
                });

                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    var saveflag = false;
                    if (cfi.IsValidSection(sectionId)) {
                        if (true) {
                            saveflag = SavePaymentInfo();
                        }
                    }
                    else {
                        saveflag = false
                    }
                    if (saveflag) {
                        for (var i = 0; i < processList.length; i++) {
                            if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                                if (CurrentAirMailSNo > 0) {
                                    currentprocess = processList[i + 1].value;
                                    ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);
                                }
                                else {
                                    CleanUI();
                                    //cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                                }
                                return;
                            }
                        }
                    }
                });

                //$("#btnSave").unbind("click").bind("click", function () {
                //    SavePaymentInfo();
                //});
            }
            else {
                $("div[id='divareaTrans_mail_airmailpayment']").find("table:first").append(tableHandleCharge);

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('warning', 'Warning - Payment', "Payment already Processed", "bottom-right");
                });
            }
            $("div[id$='areaTrans_mail_mailpaymentaddcheque']").hide();
        }
    });
    $("#divLoading").hide();
}
function getNonObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getNonObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}
function CalculateFBLAmount(obj) {
    var a = "";
    var chargeName = $(obj).closest("tr").find("[id^='ChargeName']");
    var chargeText = $(obj).closest("tr").find("[id^='Text_ChargeName']").attr("id");
    var chargeKey = $("#" + chargeText).data("kendoAutoComplete").key();
    for (var i = 0; i < paymentList.length; i++) {
        if (paymentList[i].TariffSNo == chargeKey) {
            //var gst = parseFloat(paymentList[i].GSTPercentage);
            //var totalAmount = parseFloat($(obj).val()) + (parseFloat($(obj).val()) * gst) / 100;
            var totalAmount = parseFloat($(obj).val());
            if ((isNaN(totalAmount))) {
                totalAmount = '0';
            }
            totalAmount = parseFloat(totalAmount).toFixed(3);
            $(obj).closest("tr").find("span[id^='TotalAmount']").html(totalAmount.toString());
            $(obj).closest("tr").find("input[id^='TotalAmount']").val(totalAmount.toString());

        }
    }
    CalculateTotalFBLAmount();
}

function CalculateTotalFBLAmount() {
    //var totalFBLAmount = 0;
    //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
    //    $(this).find("input[id^='TotalAmount']").each(function () {
    //        if (!isNaN(parseFloat($(this).val())))
    //            totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
    //    });
    //});
    //totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    //$("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    //$("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());

    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {

                    totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else { }
            }
        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_mail_airmailpayment").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_mail_airmailpayment").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_mail_airmailpayment").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_mail_airmailpayment").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
    }
}

function SetChargeValues(textId, textValue, keyId, keyValue) {
    var chkCash = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCash]");
    var chkCredit = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCredit]");

    if (keyValue == "0") {
        MarkSelected(chkCash);
        chkCash.attr('disabled', false);
    } else {
        MarkSelected(chkCredit);
        chkCash.attr('disabled', true);
    }
    CalculateTotalFBLAmount();
}
function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");
                $("#" + textId).closest('tr').find("input[id^='Amount']").val("0");
                $("#" + textId).closest('tr').find("input[id^='_tempAmount']").val("0");
                $("#" + textId).closest('tr').find("span[id^='TotalAmount']").html("");
                $("#" + textId).closest('tr').find("input[id^='TotalAmount']").val("");
                Flag = false;
            }
        }
    });
    return Flag;
}
function CalculatePayment(obj) {
    if ($(obj).attr("type") == "radio") {
        MarkSelected(obj);
    }

    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function (i, row) {
        if ($(row).find("[id^='chkWaveoff']").prop("checked") == false) {
            $(row).find("input[id^='TotalAmount']").each(function () {
                if (!isNaN(parseFloat($(this).val()))) {
                    if ($(row).find("input[id^='chkCash']").prop('checked') == true) {
                        totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                    }
                    else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                        TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                    }
                    else {
                    }
                }
            });
        }

    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_mail_airmailpayment").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_mail_airmailpayment").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_mail_airmailpayment").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_mail_airmailpayment").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);

    if (parseFloat(totalFBLAmount) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
        $("span[id^='spnCashAmount']").closest('tr').find("td:eq(0)").find("font").remove();
    } else {
        $("#CashAmount").attr("data-valid", "min[0.01],required");
        if ($("span[id^='spnCashAmount']").closest('tr').find("td:eq(0)").find("font").length == 0) {
            $("span[id^='spnCashAmount']").prepend("<font color='red'>*</font>");
        }

    }
}

function MarkSelected(obj) {
    var trRow = $(obj).closest("tr");
    trRow.find("input[type='radio']").each(function () {
        $(this).prop('checked', false);
    });
    $(obj).prop('checked', true);
}
function ResetFBLCharge(textId, textValue, keyId, keyValue) {

    if (ValidateExistingCharges(textId, textValue, keyId, keyValue)) {

        //$("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function () {

        //    if (textId == $(this).find("input[id^='Text_ChargeName']").attr("id")) {
        //        if (keyValue == "") {
        //            $(this).find("input[id^='Amount']").val("0");
        //            $(this).find("span[id^='TotalAmount']").html("");
        //            $(this).find("input[id^='TotalAmount']").val("");
        //        }
        //        else {
        //            var obj = $(this);
        //            var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];

        //            var paymentList = paymentData.Table0;

        //            var NonMendatory = getNonObjects(paymentData.Table0, 'TariffSNo', keyValue);

        //            obj.find("input[id^='Amount']").val(NonMendatory[0].ChargeAmount);
        //            obj.find("input[id^='_tempAmount']").val(NonMendatory[0].ChargeAmount);
        //            var totalAmount = parseFloat(NonMendatory[0].ChargeAmount).toFixed(3);
        //            obj.find("span[id^='TotalAmount']").html(totalAmount);
        //            obj.find("input[id^='TotalAmount']").val(totalAmount);
        //            obj.find("input[id^='Remarks']").val(NonMendatory[0].ChargeRemarks.replace('<Br>', '').replace('<Br>', ''));
        //            obj.find("input[id^='rate']").val(NonMendatory[0].Rate);
        //            obj.find("input[id^='min']").val(NonMendatory[0].Min);
        //            obj.find("input[id^='totaltaxamount']").val(NonMendatory[0].TotalTaxAmount);
        //            if (NonMendatory[0].TotalTaxAmount != "2") {
        //                obj.closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
        //            }
        //        }
        //    }
        //});


        $("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function () {

            if (textId == $(this).find("input[id^='Text_ChargeName']").attr("id")) {
                if (keyValue == "") {
                    $(this).find("input[id^='Amount']").val("0");
                    $(this).find("span[id^='TotalAmount']").html("");
                    $(this).find("input[id^='TotalAmount']").val("");
                }
                else {
                    var obj = $(this);
                    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];

                    var paymentList = paymentData.Table0;
                    var NonMendatory = getNonObjects(paymentData.Table0, 'TariffSNo', keyValue);

                    obj.find("input[id^='PrimaryBasis']").val(NonMendatory[0].pValue);
                    obj.find("input[id^='_tempPrimaryBasis']").val(NonMendatory[0].pValue);
                    if (obj.find("input[id^='PrimaryBasis']").closest('td').find("span[id^='PrimaryBasis']").length != 0) {
                        obj.find("input[id^='PrimaryBasis']").closest('td').find("span[id^='PrimaryBasis']").remove();
                        obj.find("input[id^='PrimaryBasis']").closest('td').append("<span id=PrimaryBasis_" + obj.find("td[id^='tdSNoCol']").text() + ">" + NonMendatory[0].PrimaryBasis + "</span>");
                    } else {
                        obj.find("input[id^='PrimaryBasis']").closest('td').append("&nbsp;&nbsp;<span id=PrimaryBasis_" + obj.find("td[id^='tdSNoCol']").text() + ">" + NonMendatory[0].PrimaryBasis + "</span>");
                    }

                    obj.find("input[id^='SecondaryBasis']").val(NonMendatory[0].sValue);
                    obj.find("input[id^='_tempSecondaryBasis']").val(NonMendatory[0].sValue);

                    if (obj.find("input[id^='SecondaryBasis']").closest('td').find("span[id^='SecondaryBasis']").length != 0) {
                        obj.find("input[id^='SecondaryBasis']").closest('td').find("span[id^='SecondaryBasis']").remove();
                        obj.find("input[id^='SecondaryBasis']").closest('td').append("<span id=SecondaryBasis_" + obj.find("td[id^='tdSNoCol']").text() + ">" + NonMendatory[0].SecondaryBasis + "</span>");
                    } else {
                        obj.find("input[id^='SecondaryBasis']").closest('td').append("&nbsp;&nbsp;<span id=SecondaryBasis_" + obj.find("td[id^='tdSNoCol']").text() + ">" + NonMendatory[0].SecondaryBasis + "</span>");
                    }
                    if (NonMendatory[0].SecondaryBasis == "") {
                        obj.find("input[id^='_tempSecondaryBasis']").css("display", "none");
                        obj.find("span[id^='SecondaryBasis']").css("display", "none");
                    } else {
                        obj.find("input[id^='_tempSecondaryBasis']").css("display", "inline-block");
                        obj.find("span[id^='SecondaryBasis']").css("display", "inline-block");
                    }

                    obj.find("input[id^='Amount']").val(NonMendatory[0].ChargeAmount);
                    obj.find("input[id^='_tempAmount']").val(NonMendatory[0].ChargeAmount);
                    obj.find("input[id*='Amount']").prop('readonly', true);

                    obj.find("input[id^='Tax']").val(NonMendatory[0].TotalTaxAmount);
                    obj.find("input[id^='_tempTax']").val(NonMendatory[0].TotalTaxAmount);
                    obj.find("input[id*='Tax']").prop('readonly', true);

                    obj.find("input[id^='_tempPrimaryBasis']").attr('disabled', false);
                    obj.find("input[id^='_tempSecondaryBasis']").attr('disabled', false);
                    obj.find("input[id^='_tempPrimaryBasis']").prop('readonly', false);
                    obj.find("input[id^='_tempSecondaryBasis']").prop('readonly', false);

                    var totalAmount = parseFloat(NonMendatory[0].ChargeAmount).toFixed(3);
                    obj.find("span[id^='TotalAmount']").html(totalAmount);
                    obj.find("input[id^='TotalAmount']").val(totalAmount);
                    obj.find("span[id^='TotalAmount']").attr('title', NonMendatory[0].ChargeRemarks.toUpperCase().replace(/<BR>/g, ""));
                    obj.find("input[id^='Remarks']").val(NonMendatory[0].ChargeRemarks.toUpperCase().replace(/<BR>/g, ""));
                    obj.find("input[id^='rate']").val(NonMendatory[0].Rate);
                    obj.find("input[id^='min']").val(NonMendatory[0].Min);

                    obj.find("input[id^='totaltaxamount']").val(NonMendatory[0].TotalTaxAmount);
                    if (NonMendatory[0].ChargeTo != "2") {
                        obj.closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                        obj.find("input[id^='chkCash']").attr('disabled', false);
                    } else {
                        obj.closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "");
                        //obj.find("input[id^='chkCash']").attr('disabled', true);
                    }
                    obj.find("input[id^='Amount']").attr('disabled', true);
                    obj.find("input[id^='_tempAmount']").attr('disabled', true);
                    obj.find("input[id^='Tax']").attr('disabled', true);
                    obj.find("input[id^='_tempTax']").attr('disabled', true);

                    obj.find("input[id*='PrimaryBasis']").each(function () {
                        $(this).unbind("blur").bind("blur", function () {
                            GetChargeRateDetails(obj, this);
                        });
                    });
                    obj.find("input[id*='SecondaryBasis']").each(function () {
                        $(this).unbind("blur").bind("blur", function () {
                            GetChargeRateDetails(obj, this);
                        });
                    });

                }
            }
        });
    }
    CalculateTotalFBLAmount();
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

function BindHandlingChargeAutoComplete(elem, mainElem) {
    var origin = $('#tblairmailpayment tr:nth-child(4)>td:eq(2)').text().split('-')[0];
    origin = 'KUL';
    $(elem).find("input[id^='ChargeName']").each(function () {
        cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", CurrentAirMailSNo, 1, origin, 0, "", "2", "999999999", "No");
    });
    $(elem).find("input[id^='BillTo']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
        $("#Text_" + $(this).attr("name")).data("kendoAutoComplete").setDefaultValue(BillTo[0]["Key"], BillTo[0]["Text"]);
    });
    //$(elem).find("input[id^='BillTo']").closest('td').find('span').css("display", "block");
    $(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');
    $(elem).find("td:eq(3)").css('width', '100px');
    $(elem).find("td:eq(4)").css('width', '100px');
    $(elem).find('td:eq(10)').css("display", "none");
    $(elem).find('td:eq(11)').css("display", "none");
    $(elem).find('td:eq(12)').css("display", "none");

    $(elem).find("input[id^='_tempPrimaryBasis']").attr('disabled', true);
    $(elem).find("input[id^='_tempSecondaryBasis']").attr('disabled', true);
    $(elem).find("input[id^='_tempTax']").attr('disabled', true);
    $(elem).find("input[id^='_tempAmount']").attr('disabled', true);

    if (parseInt($(elem).find("td[id^='tdSNoCol']").html() || "0") > MendatoryPaymentCharges.length) {
        $(elem).find("[id^='chkWaveof']").remove();
    }

    $(elem).find("input[id^='chkCash']").prop('checked', true)
    $(elem).find("input[id^='Amount']").each(function () {
        $(this).unbind("blur").bind("blur", function () {
            CalculateFBLAmount(this);
        });
    });

    $("div[id$='divareaTrans_mail_airmailpayment']").find("tr td:last").css('width', '60px');
    $("div[id$='divareaTrans_mail_airmailpayment']").find("tr").find("input[id^='Text_BillTo']").closest('span').css('width', '70px');
}

function ReBindHandlingChargeAutoComplete(elem, mainElem) {
    //$(elem).closest("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function () {
    //    var origin = $('#tblairmailpayment tr:nth-child(4)>td:eq(2)').text().split('-')[0];
    //    origin = 'KUL';
    //    $(this).find("input[id^='ChargeName']").each(function () {

    //        cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", CurrentAirMailSNo, 0, origin, 2, "", "2", "999999999", "No");

    //    });
    //    if ($(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').attr('style') != "display: none;") {
    //        $(this).find("input[id^='BillTo']").each(function () {
    //            cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
    //        });
    //    }

    //    //$(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');

    //    $(this).find("input[id^='Text_BillTo']").closest('span').css('width', '');
    //    $(this).find("input[id^='Text_ChargeName']").closest('span').css('width', '');
    //    $(this).find("input[id^='Amount']").each(function () {
    //        $(this).unbind("blur").bind("blur", function () {
    //            CalculateFBLAmount(this);
    //        });
    //    });
    //});
    //if ($(elem).find("td[id^='tdSNoCol']").html() == MendatoryPaymentCharges.length) {
    //    $(elem).find("td[id^=transAction]").find("i[title=Delete]").remove();

    //}
    $(elem).closest("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function () {
        var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
        $(this).find("input[id^='ChargeName']").each(function () {
            AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, origin, 0, "", "2", "999999999", "No");
        });
        if ($(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').attr('style') != "display: none;") {
            $(this).find("input[id^='BillTo']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
            });
        }

        //$(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');
        $(elem).find("span[id^='PrimaryBasis']").removeAttr('style');
        $(elem).find("span[id^='SecondaryBasis']").removeAttr('style');
        if ($(elem).find("input[id^='PrimaryBasis']").val() == "" && $(elem).find("input[id^='_tempPrimaryBasis']").val() != "") {
            $(elem).find("input[id^='PrimaryBasis']").val($(elem).find("input[id^='_tempPrimaryBasis']").val());
            $(elem).find("input[id^='_tempPrimaryBasis']").val($(elem).find("input[id^='_tempPrimaryBasis']").val());
        } else if ($(elem).find("input[id^='PrimaryBasis']").val() != "" && $(elem).find("input[id^='_tempPrimaryBasis']").val() == "") {
            $(elem).find("input[id^='_tempPrimaryBasis']").val($(elem).find("input[id^='PrimaryBasis']").val());
            $(elem).find("input[id^='PrimaryBasis']").val($(elem).find("input[id^='PrimaryBasis']").val());
        }
        if ($(elem).find("input[id^='SecondaryBasis']").val() == "" && $(elem).find("input[id^='_tempSecondaryBasis']").val() != "") {
            $(elem).find("input[id^='SecondaryBasis']").val($(elem).find("input[id^='_tempSecondaryBasis']").val());
            $(elem).find("input[id^='_tempSecondaryBasis']").val($(elem).find("input[id^='_tempSecondaryBasis']").val());
        } else if ($(elem).find("input[id^='SecondaryBasis']").val() != "" && $(elem).find("input[id^='_tempSecondaryBasis']").val() == "") {
            $(elem).find("input[id^='_tempSecondaryBasis']").val($(elem).find("input[id^='SecondaryBasis']").val());
            $(elem).find("input[id^='SecondaryBasis']").val($(elem).find("input[id^='SecondaryBasis']").val());
        }
        $(elem).find("input[id^='_tempPrimaryBasis']").css("text-align", "right");
        $(elem).find("input[id^='_tempSecondaryBasis']").css("text-align", "right");

        //if ($(elem).find("input[id^='_tempSecondaryBasis']").css('display') == "none") {
        //    $(elem).find("input[id^='_tempSecondaryBasis']").css("display", "none");
        //    $(elem).find("span[id^='SecondaryBasis']").css("display", "none");
        //}

        var paymentList = paymentData.Table0;
        if ($(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var NonMendatory = getNonObjects(paymentData.Table0, 'TariffSNo', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key());
            if (NonMendatory[0].SecondaryBasis == "") {
                $(elem).find("input[id^='_tempSecondaryBasis']").css("display", "none");
                $(elem).find("span[id^='SecondaryBasis']").css("display", "none");
            } else {
                $(elem).find("input[id^='_tempSecondaryBasis']").css("display", "inline-block");
                $(elem).find("span[id^='SecondaryBasis']").css("display", "inline-block");
            }
        }

        $(this).find("input[id^='Text_BillTo']").closest('span').css('width', '70px');
        $(this).find("input[id^='Text_ChargeName']").closest('span').css('width', '');
        $(this).find("input[id^='Amount']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                CalculateFBLAmount(this);
            });
        });
    });
    if ($(elem).find("td[id^='tdSNoCol']").html() == MendatoryPaymentCharges.length) {
        $(elem).find("td[id^=transAction]").find("i[title=Delete]").remove();

    }
    CalculateTotalFBLAmount();
}

function BindBankAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='BankName']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
    });
}

function ReBindBankAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='divareaTrans_mail_airmailpaymentaddcheque']").find("[id^='areaTrans_mail_airmailpaymentaddcheque']").each(function () {
        $(this).find("input[id^='BankName']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}


function SavePaymentInfo() {

    var flag = false;
    var HandlingChargeArray = [];
    //var totalChargeAmt = 0;

    var TotalCash = 0;
    var TotalCredit = 0;
    TotalCash = $("#FBLAmount").val();
    TotalCredit = $("#CrediAmount").val();
    $("div[id$='areaTrans_mail_airmailpayment']").find("[id^='areaTrans_mail_airmailpayment']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingCharge = {
                //SNo: $(this).find("td[id^='tdSNoCol']").html(),
                //AWBSNo: CurrentAirMailSNo,
                //TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(), //3
                //TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),//'TERMINAL CHARGES',
                //Value: parseFloat($(this).find("[id^='TotalAmount']").text()).toFixed(3),//80.00
                //Remarks: $(this).find("[id^='Remarks']").val(), // '<Br><Br> Rate : 375.00 [Weight] * 0.2000 [Slab Value] = 75.000000~<asp:HiddenField ID="hdnFromDate" value="187" runat="server" />',
                //Rate: $(this).find("[id^='rate']").val(),
                //Min: $(this).find("[id^='min']").val(),
                //TotalTaxAmount: $(this).find("[id^='totaltaxamount']").val(),
                //Mode: $(this).find("[id^='chkCash']").prop('checked') == true ? "CASH" : "CREDIT",
                //Basis: 'PER KG',
                //OnWt: 'ChWt',
                //ChargeTo: $(this).find("[id^='Text_BillTo']").data("kendoAutoComplete").key(),
                //WaveOff: $(this).find("[id^='chkWaveoff']").prop('checked') == true ? 1 : 0,
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: CurrentAirMailSNo,
                WaveOff: $(this).find("input[id^='chkWaveoff']") == undefined ? 0 : $(this).find("input[id^='chkWaveoff']").prop('checked') == true ? 1 : 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(), //3
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),//'TERMINAL CHARGES',
                pValue: $(this).find("[id^='PrimaryBasis']").val() || "0.00",
                sValue: $(this).find("[id^='SecondaryBasis']").val() || "0.00",
                Amount: parseFloat($(this).find("[id^='Amount']").val() || "0.00").toFixed(3),
                Tax: $(this).find("[id^='Tax']").val() || "0.00",
                TotalAmount: $(this).find("span[id^='TotalAmount']").text() || "0.00",
                Rate: $(this).find("[id^='rate']").val() || "0.00",
                Min: $(this).find("[id^='min']").val() || "0.00",
                Mode: $(this).find("[id^='chkCash']").prop('checked') == true ? "CASH" : "CREDIT",
                ChargeTo: $(this).find("[id^='Text_BillTo']").data("kendoAutoComplete").key(),
                pBasis: $(this).find("span[id^='PrimaryBasis']").text(),
                sBasis: $(this).find("span[id^='SecondaryBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']").val(),
                WaveoffRemarks: "",
            }
            //totalChargeAmt = totalChargeAmt + parseFloat($(this).find("[id^='TotalAmount']").text());
            HandlingChargeArray.push(HandlingCharge);
        }

    });

    //multiple
    //var AgentBranchArray = [];
    ////$("div[id$='areaTrans_shipment_shipmentaddcheque']").find("[id^='areaTrans_shipment_shipmentaddcheque']").each(function () {
    //var AgentBranchCheque = {
    //    SNo: 0,// $(this).find("td[id^='tdSNoCol']").html(),
    //    AgentBranchSNo: 0,// $("input[name='AgentName']").val(),
    //    BankSNo: 0,// $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key(),
    //    BankName: "",// $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").value(),
    //    BankBranch: "",// $(this).find("[id^='Branch']").val(),
    //    ChequeNo: 0,// $(this).find("[id^='ChequeNo']").val(),
    //    ChequeDate: '2015/06/23',
    //    ChequeLimit: 0,// $(this).find("[id^='ChequeLimit']").val(),
    //    Availablelimit: 0,// $(this).find("[id^='ChequeLimit']").val(),
    //    ChequeFreuency: 1

    //}
    //AgentBranchArray.push(AgentBranchCheque);
    //})


    //single Row

    //var AWBCheque = {
    //    SNo: 1,
    //    AWBSNo: CurrentAirMailSNo,
    //    AgentBranchSNo: $("input[name='AgentName']").val(),
    //    Amount: parseFloat($('#CashAmount').val()).toFixed(2),
    //    PaymentMode: $('#PaymentMode:checked').val() == "0" ? "Cash" : "Credit",
    //    InvoiceSNo: 0,
    //    InvoiceNo: ''
    //}
    //AWBChequeArray.push(AWBCheque);

    var AWBChequeArray = [];
    $("div[id$='divareaTrans_mail_airmailpaymentaddcheque']").find("[id^='areaTrans_mail_airmailpaymentaddcheque']").each(function () {
        if ($(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key() != "") {
            var AWBCheque = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: CurrentAirMailSNo,
                BankSNo: $(this).find("[id^='Text_BankName']").data("kendoAutoComplete").key(),
                Branch: $(this).find("[id^='Branch']").val(),
                ChequeNo: $(this).find("[id^='ChequeNo']").val(),
                ChequeLimit: $(this).find("[id^='ChequeLimit']").val()
            }
            AWBChequeArray.push(AWBCheque);
        }
    });


    $.ajax({
        url: "Services/Mail/AirMailService.svc/SaveAtPayment", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: CurrentAirMailSNo, TotalCash: TotalCash, TotalCredit: TotalCredit, lstHandlingCharge: HandlingChargeArray, lstAWBCheque: AWBChequeArray, CityCode: 'DEL', UpdatedBy: 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "") {
                ShowMessage('success', 'Success - Payment', "Payment Processed Successfully", "bottom-right");
                AirMailSearch();;
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - Payment', "Unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Payment', "Unable to process.", "bottom-right");

        }
    });
    return flag;
}

// Fill Handling charges form klas
AutoCompleteHandlingCharge = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetDataSourceHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
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

// Get Data for Handling charges form klas
var url1 = 'Services/AutoCompleteService.svc/HandlingChargesAutoCompleteDataSource';
GetDataSourceHandlingCharge = function (textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? url1 : serviceurl + newUrl),
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
                    cityChangeFlag: cityChangeFlag
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

    //var res_tblAirMailTrans_MailCategory_ = textId.substring(0, textId.length - 1);
    var res_textId_ = textId.replace(/[0-9]/g, '');
    var suffix = textId.match(/\d+/);
    var filterEmbargo = cfi.getFilter("AND");
    var ItineraryFlightNoFilter = cfi.getFilter("AND");
    if (textId == "Text_FlightNo") {
        /*
        if ($("#FlightDate").attr("sqldatevalue") != "" && $("#BoardPoint").val() != "" && $("#OffPoint").val() != "") {
            try {
                cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#FlightDate").attr("sqldatevalue"));
                cfi.setFilter(filterEmbargo, "OriginCity", "eq", $("#BoardPoint").val());
                cfi.setFilter(filterEmbargo, "DestinationCity", "eq", $("#OffPoint").val());
                var FlightNoAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return FlightNoAutoCompleteFilter;
            }
            catch (exp) { }
        }*/


        var filterFlt = cfi.getFilter("AND");

        var ShipmentOrigin, ShipmentDestination, FlightDate;
        ShipmentOrigin = $("#Text_ShipmentOrigin").data("kendoAutoComplete").key();

        ShipmentDestination = $("#Text_ShipmentDest").data("kendoAutoComplete").key();

        cfi.setFilter(filterFlt, "OriginCity", "eq", ShipmentOrigin);
        cfi.setFilter(filterFlt, "DestinationCity", "eq", ShipmentDestination);
        cfi.setFilter(filterFlt, "FlightDate", "eq", cfi.CfiDate("FlightDate"));

        filterEmbargo = cfi.autoCompleteFilter(filterFlt);
        return filterEmbargo;
    }
        //else if (textId.indexOf("MailSubCategory") >= 0) {
        //    var currentID = textId.split('_')[2];
        //    if (currentID == undefined) {
        //        currentID = "";
        //    }
        //    currentID = currentID == "" ? "" : "_" + currentID;
        //    var filterCondition = cfi.getFilter("AND");
        //    cfi.setFilter(filterCondition, "MailClassSNo", "eq", $("#Text_MailCategory" + currentID).data("kendoAutoComplete").key());
        //    filterEmbargo = cfi.autoCompleteFilter(filterCondition);
        //    return filterEmbargo;
        //}
    else if (textId == "Text_IssuingAgent") {

        cfi.setFilter(filterEmbargo, "AirlineSNo", "in", $("#AirlineCode").val())
        cfi.setFilter(filterEmbargo, "CitySno", "in", $("#ShipmentOrigin").val())
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_AirlineCode") {

        $('#Text_IssuingAgent').val('');
        $('#IssuingAgent').val('');
    }
    else if (textId == "Text_ItineraryFlightNo") {

        var filter = cfi.getFilter("AND");
        if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "")
            cfi.setFilter(filter, "CarrierCode", "eq", $("#Text_ItineraryCarrierCode").val());
        cfi.setFilter(filter, "FlightDate", "eq", $("#ItineraryDate").val());
        cfi.setFilter(filter, "IsCancelled", "eq", "0");
        ItineraryFlightNoFilter = cfi.autoCompleteFilter(filter);
        return ItineraryFlightNoFilter;
    }
    else if (textId == "Text_ShipmentOrigin") {

        $('#Text_IssuingAgent').val('');
        $('#IssuingAgent').val('');
    }
    else if (textId == "Text_ShipmentDest") {

        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#ShipmentOrigin").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_ItineraryDestination") {

        cfi.setFilter(filterEmbargo, "SNO", "notin", $("#ItineraryOrigin").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_searchShipmentDest") {

        cfi.setFilter(filterEmbargo, "CityCode", "notin", $("#searchShipmentOrigin").val())

        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }

    else if (res_textId_ == "tblAirMailTrans_MailSubCategory_") {


        var HdnMailCategory = $('#tblAirMailTrans_HdnMailCategory_' + suffix[0] + '').val();
        cfi.setFilter(filterEmbargo, "MailClassSNo", "eq", HdnMailCategory);
        var ForwarderFilter = cfi.autoCompleteFilter(filterEmbargo);
        return ForwarderFilter;

    }
    else if (res_textId_ == "tblAirMailTrans_OriCityCode_") {


        var HdnOriCountryCode = $('#tblAirMailTrans_HdnOriCountryCode_' + suffix[0] + '').val();
        cfi.setFilter(filterEmbargo, "CountryCode", "in", HdnOriCountryCode);
        var ForwarderFilter = cfi.autoCompleteFilter(filterEmbargo);
        return ForwarderFilter;

    }
    else if (res_textId_ == "tblAirMailTrans_DestCityCode_") {


        var HdndescCountryCode = $('#tblAirMailTrans_HdnDestCountryCode_' + suffix[0] + '').val();
        cfi.setFilter(filterEmbargo, "CountryCode", "in", HdndescCountryCode);
        var ForwarderFilter = cfi.autoCompleteFilter(filterEmbargo);
        return ForwarderFilter;

    }

}





function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetProcessSequence?ProcessName=" + processName,
        async: true,
        type: "get",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            if (processdata.Table0 != undefined && processdata.Table0.length > 0) {
                var processlist = processdata.Table0;
                var out = '[';
                $.each(processlist, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                        else {
                            out = out + '{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
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


function GetShipperConsigneeDetails(e) {


    var UserTyp = (e == "Text_SHIPPER_AccountNo") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_AccountNo" || e == "Text_CONSIGNEE_AccountNo") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Mail/AirMailService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;
                ClearShipperConsigneeUI(UserTyp);
                if (shipperConsigneeData.length == 1) {
                    if (UserTyp == "S") {
                        //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue($("#" + e).data("kendoAutoComplete").key(), $("#" + e).data("kendoAutoComplete").key());
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName),
                        // $("#Text_SHIPPER_Name").val(shipperConsigneeData[0].ShipperName),
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                        //$("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CountryCode, shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CityCode, shipperConsigneeData[0].ShipperCityName);
                        //$("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCityCode == "" ? "" : shipperConsigneeData[0].ShipperCityCode, shipperConsigneeData[0].ShipperCityCode == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                    }
                    else {
                        //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue($("#" + e).data("kendoAutoComplete").key(), $("#" + e).data("kendoAutoComplete").key());
                        //  $("#Text_CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        // $("#CONSIGNEE_AccountNoName").val('AccountNoName');
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CityCode, shipperConsigneeData[0].ConsigneeCityCode);
                        //$("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CountryCode, shipperConsigneeData[0].ConsigneeCountryName);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCityCode == "" ? "" : shipperConsigneeData[0].ConsigneeCityCode, shipperConsigneeData[0].ConsigneeCityCode == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                    }
                }
            },
            error: {

            }
        });
    }

}

// End -> Air Mail Payment Section
function CheckDuplicateULd() {
    var ULDType = $("#Text_ULDTypeSNo").val();
    var ULDNo = $("#ULDNo").val();
    var OwnerCode = $("#OwnerCode").val();
    //alert(ULDTypeSNo+ULDNo+OwnerCode);
    //if (ULDType != "" && ULDNo != "" && OwnerCode != "") {
    //    $.ajax({
    //        url: "Services/Shipment/SLInfoService.svc/ValidateULD", async: false, type: "get", dataType: "json", cache: false,
    //        data: { ULDType: ULDType, ULDNo: ULDNo, OwnerCode: OwnerCode, SLISNo: currentslisno },
    //        contentType: "application/json; charset=utf-8",
    //        success: function (result) {
    //            var Res = JSON.parse(result);
    //            if (Res.Table0[0].Column1 == "0") {
    //                $(Currenttr).find("input[id^='OwnerCode']").val("");
    //                $(Currenttr).find("input[id^='ULDNo']").val("");
    //                ShowMessage('warning', 'Warning - ULD Details', "ULD No does not exist/Not Available.", "bottom-right");
    //            }
    //            else if (Res.Table0[0].Column1 == "2") {
    //                $(Currenttr).find("input[id^='OwnerCode']").val("");
    //                $(Currenttr).find("input[id^='ULDNo']").val("");
    //                ShowMessage('warning', 'Warning - ULD Details', "ULD No is Non-Serviceable", "bottom-right");
    //            }
    //            else {
    //                // ShowMessage('success', 'success - ULD Details', "ULD No exists.", "bottom-right");
    //            }
    //        }
    //    });
    //}
}

function addLeadingZeros(n, length) {
    var str = (n > 0 ? n : -n) + "";
    var zeros = "";
    for (var i = length - str.length; i > 0; i--)
        zeros += "0";
    zeros += str;
    return n >= 0 ? zeros : "-" + zeros;
}

function ShowMailSubCategory() {
    $('#divShowMailSubCategory').remove();
    $('#__divairmailtrans__').append('<div id="divShowMailSubCategory"></div>');
    var strTr = "";
    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetMailSubCategory",
        async: false,
        type: "GET",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result).Table0;
            strTr = "<table id='tblShowMailSubCategory'><tr><th style='text-align:center;width:50px'>S.No.</th><th style='text-align:center;width:100px'>Code</th><th align='left'>Description</th></tr>"
            if (Data.length > 0) {
                for (var num = 0; num < Data.length; num++) {
                    strTr = strTr + "<tr><td style='text-align:center;'>" + (num + 1) + "</td><td style='text-align:center'>" + Data[num].Code + "</td><td>" + Data[num].Description + "</td></tr>";
                }
                strTr = strTr + "</table>";
            }
        }
    });
    $('#divShowMailSubCategory').html(strTr);
    cfi.PopUp("divShowMailSubCategory", "Mail Sub Category", null, null, null, 10);
}

function GetSacnnedCodes() {
    var StrData = $('#txtSacnCode').val();
    if (StrData.length < 29) {
        $('#txtSacnCode').css('border-color', 'red');
        ShowMessage('warning', 'Warning - Airmail', "Invalid DN No. Scanned.");
        return false;
    }
    else if ($.isNumeric(StrData.substring(15, 16)) == false) {
        ShowMessage('warning', 'Warning - Airmail', "Invalid Year of Dispatch.");
        return false;
    }
    else if ($.isNumeric(StrData.substring(16, 20)) == false) {
        ShowMessage('warning', 'Warning - Airmail', "Invalid Dispatch No.");
        return false;
    }
    else if ($.isNumeric(StrData.substring(20, 23)) == false) {
        ShowMessage('warning', 'Warning - Airmail', "Invalid Receptacle Number.");
        return false;
    }
    else if ($.isNumeric(StrData.substring(23, 24)) == false) {
        ShowMessage('warning', 'Warning - Airmail', "Invalid  HNR Indicator.");
        return false;
    }
    else if ($.isNumeric(StrData.substring(24, 25)) == false) {
        ShowMessage('warning', 'Warning - Airmail', "Invalid RII Code.");
        return false;
    }
    else if ($.isNumeric(StrData.substring(25, 29)) == false) {
        ShowMessage('warning', 'Warning - Airmail', "Invalid Receptacle Weight.");
        return false;
    }
    var DNNo = StrData.substring(16, 20);
    var ReceptacleNumber = StrData.substring(20, 23);
    var DNAdded = false;

    $("[id^='areaTrans_mail_airmailtransaction']").each(function () {
        if ((DNNo + ReceptacleNumber) == ($(this).find('[id^="DNNo"]').val() + $(this).find('[id^="ReceptacleNumber"]').val())) {
            ShowMessage('warning', 'Warning - Airmail', "DN No. already added.");
            DNAdded = true;
            return false;
        }
    });
    if (DNAdded == true) {
        return;
    }
    $('#txtSacnCode').css('border-color', '#94c0d2');
    $.ajax({
        url: "Services/Mail/AirMailService.svc/GetScannedDN?StrData=" + StrData,
        async: false,
        type: "GET",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result).Table0;
            if (Data.length > 0) {
                $('[id^="transActionDiv"] i[title="Add More"]').click();
                var lastRow = $("[id^='areaTrans_mail_airmailtransaction']:last");
                $(lastRow).find('[id^="OriCountryCode"]').val(Data[0].oricountrycode);
                $(lastRow).find('[id^="Text_OriCountryCode"]').val(Data[0].text_oricountrycode);

                $(lastRow).find('[id^="OriCityCode"]').val(Data[0].oricitycode);
                $(lastRow).find('[id^="Text_OriCityCode"]').val(Data[0].text_oricitycode);

                $(lastRow).find('[id^="OriOEQualifier"]').val(Data[0].orioequalifier);
                $(lastRow).find('[id^="Text_OriOEQualifier"]').val(Data[0].text_orioequalifier);

                $(lastRow).find('[id^="DestCountryCode"]').val(Data[0].destcountrycode);
                $(lastRow).find('[id^="Text_DestCountryCode"]').val(Data[0].text_destcountrycode);

                $(lastRow).find('[id^="DestCityCode"]').val(Data[0].destcitycode);
                $(lastRow).find('[id^="Text_DestCityCode"]').val(Data[0].text_destcitycode);

                $(lastRow).find('[id^="DestOEQualifier"]').val(Data[0].destoequalifier);
                $(lastRow).find('[id^="Text_DestOEQualifier"]').val(Data[0].text_destoequalifier);

                $(lastRow).find('[id^="MailCategory"]').val(Data[0].mailcategory);
                $(lastRow).find('[id^="Text_MailCategory"]').val(Data[0].text_mailcategory);

                $(lastRow).find('[id^="MailSubCategory"]').val(Data[0].mailsubcategory);
                $(lastRow).find('[id^="Text_MailSubCategory"]').val(Data[0].text_mailsubcategory);

                $(lastRow).find('[id^="_tempYearOfDispatch"]').val(Data[0].yearofdispatch);
                $(lastRow).find('[id^="YearOfDispatch"]').val(Data[0].yearofdispatch);

                $(lastRow).find('[id^="DNNo"]').val(Data[0].dnno);
                $(lastRow).find('[id^="ReceptacleNumber"]').val(Data[0].receptaclenumber);
                $(lastRow).find('[id^="_tempHNRIndicator"]').val(Data[0].hnrindicator);
                $(lastRow).find('[id^="HNRIndicator"]').val(Data[0].hnrindicator);
                $(lastRow).find('[id^="_tempRIICode"]').val(Data[0].riicode);
                $(lastRow).find('[id^="RIICode"]').val(Data[0].riicode);
                $(lastRow).find('[id^="ReceptacleWeight"]').val(Data[0].receptacleweight);
            }
            else {
                ShowMessage('warning', 'Warning - Airmail', "Record does not exsits for scanned DN No. " + StrData.toUpperCase());
            };
            $('#txtSacnCode').val('');
        }
    });

}



