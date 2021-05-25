// Created On: 20-March-2017
// Created By: Vipin Kumar

// ----------------------------------------- Document.ready function ------------------------------------------------------------------------------
$(document).ready(function () {
    $("#AWBRateAuditLogSearchpanelbar").hide();
    $("#ulTabFlightDetails").hide();
    var panelBar = $("#AWBRateAuditLogSearchpanelbar").kendoPanelBar().data("kendoPanelBar");
    cfi.AutoComplete("FlightDetailsFlightNo", "FlightNo", "DailyFlight", "FlightNumber", "FlightNo", ["FlightNo"], null, "contains");
    cfi.AutoComplete("FlightDetailsAirport", "OriginAirportSNo", "DailyFlight", "OriginAirportSNo", "OriginAirportCode", ["OriginAirportCode"], null, "contains");
    cfi.DateType("FlightDetailsFlightDate");
    //$(document.body).append('<div id="tblFlightDetails" style="width: 100%" ></div>');
});

////// ------------------------------------- ExtraCondition -----------------------------------------------------------------------------------------
function ExtraCondition(textId) {
    if (textId.indexOf("Text_FlightDetailsAirport") >= 0) {
        var filter1 = cfi.getFilter("AND");
        var flightDate = new Date($("#FlightDetailsFlightDate").val());
        var month = flightDate.getMonth() < 10 ? '0' + (flightDate.getMonth() + 1) : (flightDate.getMonth() + 1);
        var day = flightDate.getDate();
        var year = flightDate.getFullYear();
        flightDate = year + "-" + month + "-" + day;
        cfi.setFilter(filter1, "FlightNumber", "eq", $('#FlightDetailsFlightNo').val());
        cfi.setFilter(filter1, "FlightDate", "eq", flightDate);
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
}
///--------------------------------------------------------------------------------------------------------------------------------------------------

function SearchSpaceControlFlightDetails() {
    $("#aspnetForm").cfValidator();
    if (!$("#aspnetForm").data('cfValidator').validate())
        return false;
    else
        getSpaceControlFlightDetalis();
}

function getSpaceControlFlightDetalis() {
    DailyFlightSNo = $('#FlightDetailsDailyFlightSNo').val();
    var SpaceControlFlightDetailsRequest = { DailyFlightSNo: DailyFlightSNo, FlightNo: $('#FlightDetailsFlightNo').val(), FlightDate: $('#FlightDetailsFlightDate').val(), OriginAirportSNo: $('#FlightDetailsAirport').val() || 0 }
    $.ajax({
        //url: SiteUrl + "SpaceControl/SpaceControlFlightDetails",
        url: "../SpaceControl/SpaceControlFlightDetails",
        async: false,
        type: "get",
        dataType: "json",
        data: SpaceControlFlightDetailsRequest,
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (data) {
            var myData = data;
            if (myData.Table0.length > 0) {
                BindFlightDetail(myData, "FlightDetailsSpaceControlSerachGridDiv");
                document.getElementById("awbrateauditlogserachgriddivinfo").style.display = "block";
                event.currentTarget.className += " active";
            }
            else {
                //ShowMessage('warning', 'Information!', "No Records Found for given parameters.");
                alert('No Records Found for given parameters.');
            }
        }
    });
}

function BindFlightDetail(data, GrdId) {
    $("#AWBRateAuditLogSearchpanelbar").show();
    var theDiv = document.getElementById(GrdId);
    theDiv.innerHTML = "";
    var FlightDetails = data.Table0;
    var FlightSummary = data.Table1;
    $("#ulTabFlightDetails").show();
    $("#AWBRateAuditLogSerachGridDivInfo").empty();
    $("#AWBRateAuditLogSerachGridDivInfo").show();
    FlightNumber = FlightDetails[0].FlightNo;
    if (FlightDetails.length > 0) {
        var strFlightDetails = "<table><tr><td style='width: 30%;'><table class='appendGrid ui-widget' style='width: 100%; height:50px; font-bold : true; top:5px;margin-top:5px;'>"
        strFlightDetails += "<tr style='width: 100%; height:35px;'>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>Flight Number</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>Boarding/Start Point</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>Off/End Point</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>Routing</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>ETD</td>"
                    + "</tr>";
        for (var i = 0; i < FlightDetails.length; i++) {
            strFlightDetails += "<tr style='width: 100%; height:35px;'>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[i].FlightNo + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[i].StartPoint + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[i].EndPoint + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[i].Routing + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[i].ETD + "</td>"
                + "</tr>"
        }
        strFlightDetails += "<tr style='width: 100%; height:35px;'>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>ETA</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>Available Gross</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>Available Volume</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 11px;'>Available CBM</td>"
                    + "<td colspan=4 class='ui-widget-header Center' style='font-size: 11px;'></td>"
                    + "</tr>"
                    + "<tr style='width: 100%; height:35px;'>"
                    + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[0].ETA + "</td>"
                    + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[0].Gross + "</td>"
                    + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[0].Volume + "</td>"
                    + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[0].CBM + "</td>"
                    + "<td class='ui-widget-content first' style='font-size: 11px;'></td>"
                    + "</tr></table></td><td style='width: 2%;'><table class='appendGrid ui-widget' style='width: 100%;height: 145px;; font-bold : true; top:5px;margin-top:4px;'>"
                    + "<tr style='width: 100%; height:35px;'><td colspan ='3' class='ui-widget-header Center' style='font-size: 11px;'>Action</td></tr>"
                    + "<tr style='width: 100%; height:35px;'>"
                    + "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnFlightSummaryDetails()' name='btnFlightSummary' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='Flight Summary'></td>"
                    + "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnUnConfirmedList()' name='btnUnconfirmedList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='UU-Unconfirmed List'></td>"
                     + "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnConfirmedList()' name='btnConfirmedList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='KK-Confirmed List'></td>"
                    + "</tr>"
                    + "<tr style='width: 100%; height:35px;'>"
                    + "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnWaitList()' name='btnWaitList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='LL-Wait List'></td>"
                    + "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnStandByList()' name='btnStandByList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;display: none;' value='Stand By List'></td>"
                    + "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnViewAllocation()' name='btnViewAllocation' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;display: none;' value='View Allocation'></td>"
                    + "</tr>"
                    + "</td>";
        //+ "<tr style='width: 100%; height:35px;'>"
        //+ "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnFlightSummaryDetails(" + FlightNumber + ")' name='btnFlightSummary' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='Flight Summary'></td>"
        //+ "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnUnConfirmedList(" + FlightNumber + ")' name='btnUnconfirmedList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='UU-Unconfirmed List'></td>"//+ "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[i].ETA + "</td>"
        //+ "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnConfirmedList(" + FlightNumber + ")' name='btnConfirmedList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='KK-ConfirmdList'></td></tr>"
        //+ "<tr style='width: 100%; height:35px;'>"
        //+ "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnFlightSummaryDetails(" + FlightNumber + ")' name='btnFlightSummary' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='Flight Summary'></td>"
        //+ "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnUnConfirmedList(" + FlightNumber + ")' name='btnUnconfirmedList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='UU-Unconfirmed List'></td>"//+ "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightDetails[i].ETA + "</td>"
        //+ "<td class='ui-widget-content first'><input type='button' tabindex='4' class='' onclick='fnConfirmedList(" + FlightNumber + ")' name='btnConfirmedList' style='width:120px;height: 20px;font-weight: bold;font-size: 11px;' value='KK-ConfirmdList'></td></tr>"
        //+ "</td></tr>";
        theDiv.innerHTML = strFlightDetails;
    }
    if (FlightSummary.length > 0) {
        var strFlightSummary = "<table class='appendGrid ui-widget' style='width: 100%; height:50px; font-bold : true; top:5px;margin-top:5px;'>"
        strFlightSummary += "<tr style='width: 100%; height:35px;'>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>Sector</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>Shipments</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>Gross Weight</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>Volume Weight</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>CBM</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;color:green;'>Confirmed Gross Weight</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;color:red;'>Un Confirmed Gross Weight</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>Flight Status</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>ETD</td>"
                    + "<td class='ui-widget-header Center' style='font-size: 12px;'>ATD</td>"
                    + "</tr>"
        //Sector,Shipments,VolumeWeight,CBM,ETD,ATD,FlightStatus,Gross,Confirmed,UnConfirmed
        for (var i = 0; i < FlightSummary.length; i++) {
            strFlightSummary += "<tr style='width: 100%; height:35px;'>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].Sector + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].Shipments + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].Gross + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].VolumeWeight + "</td>"
                 + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].CBM + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;color:green;'>" + FlightSummary[i].Confirmed + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;color:red;'>" + FlightSummary[i].UnConfirmed + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].FlightStatus + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].ETD + "</td>"
                + "<td class='ui-widget-content first' style='font-size: 11px;'>" + FlightSummary[i].ATD + "</td>"
                + "</tr>"
        }
        $("#AWBRateAuditLogSerachGridDivInfo").append(strFlightSummary);
    }
    //$("#AWBRateAuditLogSerachGridDivInfo").append('<div id="tblFlightDetails"></div>');
}
///////////////////// fnFlightSummaryDetails //////////////////////////////////////////////////////
function fnFlightSummaryDetails() {
    GetShipmentDetails(1, "Flight Summary", 1);
    cfi.PopUp("tblFlightDetails", "Shipments List", 1300, null, null, null);
    $("#tblFlightDetails").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
}
//////////////////////////// fnConfirmedList ////////////////////////////////////////
function fnConfirmedList() {
    GetShipmentDetails(1, "Confirmed Shipments", 0);
    cfi.PopUp("tblFlightDetails", "Shipments List", 1300, null, null, null);
    $("#tblFlightDetails").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
}

///////////////////// fnUnConfirmedList //////////////////////////////////////////////////////
function fnUnConfirmedList() {
    GetShipmentDetails(3, "Un Confirmed Shipments ", 0);
    cfi.PopUp("tblFlightDetails", "Shipments List", 1300, null, null, null);
    $("#tblFlightDetails").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
}
//////////////////////////// fnWaitList ////////////////////////////////////////
function fnWaitList() {
    GetShipmentDetails(2, "Waiting Shipments", 0);
    cfi.PopUp("tblFlightDetails", "Shipments List", 1300, null, null, null);
    $("#tblFlightDetails").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
}
//////////////fnStandByList///////////////////////////////////
function fnStandByList(FlightId) {
    //cfi.PopUp("tblFlightDetails", "Stand by Shipments", 1300, null, null, null);
    //$("#tblFlightDetails").closest(".k-window").css({
    //    position: 'fixed',
    //    top: '5%'
    //});
}
///////////////// fnViewAllocation /////////////////////////
function fnViewAllocation(FlightId) {
    //cfi.PopUp("tblFlightDetails", "Flight Transfer");
    //$("#tblFlightDetails").closest(".k-window").css({
    //    position: 'fixed',
    //    top: '5%'
    //});
}
////////////////////////////// fnCloseFinaliseFlight//////////////////////
function fnCloseFinaliseFlight(FlightId) {
    alert('fnCloseFinaliseFlight');
}
/////////////////////////// fnTransferLoad ///////////////////////////
function fnTransferLoad(FlightId) {
    alert('fnTransferLoad');
}
////////////////////////// fnLoadPlan /////////////////////////////////
function fnLoadPlan(FlightId) {
    alert('fnLoadPlan');
}
////////////////////////// fnCNXLFlight //////////////////////////////
function fnCNXLFlight(FlightId) {
    alert('fnCNXLFlight');
}


function OpenTab(evt, TabName, Mode) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(TabName).style.display = "block";
    evt.currentTarget.className += " active";
    SearchSpaceControlFlightDetails();
}

$("li").click(function (e) {
    e.preventDefault();
    $("li").removeClass("selected");
    $(this).addClass("selected");
});
 
function GetShipmentDetails(status, ShipmentType, IsFlightDetails) {
    var FlightNo = $('#FlightDetailsFlightNo').val();
    var FlightDate = $('#FlightDetailsFlightDate').val();
    var OriginAirportSNo = $('#FlightDetailsAirport').val() == "" ? 0 : $('#FlightDetailsAirport').val();
    $.ajax({
        //url: SiteUrl + "SpaceControl/SpaceControlGetLists",
        url: "../SpaceControl/SpaceControlGetLists",
        async: false,
        type: "get",
        dataType: "json",
        data: { DailyFlightSNo: DailyFlightSNo,FlightNo: FlightNo, FlightDate: FlightDate, OriginAirportSNo: OriginAirportSNo, status: status, IsFlightDetails: IsFlightDetails },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (data) {
            var myData = data.Table0;
            if (myData.length > 0) {
                var dvFlightDetails = $("#tblFlightDetails");
                dvFlightDetails.empty();
                //var str = "<table style='width:90%;'  border=\"1px\">";
                var strFlightSummary = "<table class='WebFormTable' style='width: 100%; top:0px;margin-top:0px;'><tr style='width: 100%; height:35px;'><td colspan ='10' class='ui-widget-header Center' style='font-size: 12px;'>" + ShipmentType + "</tr>"
                strFlightSummary += "<tr style='width: 100%; height:35px;'>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>ReferenceNumber/AWB Number</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>Origin</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>Destination</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>Agent</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>AWBPieces</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>Volume Weight</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>CBM</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>Gross Weight</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>Revenue</td>"
                        + "<td class='ui-widget-header Center' style='font-size: 12px;'>Yield</td>"
                        + "</tr>";

                for (var i = 0; i < myData.length; i++) {
                    strFlightSummary += "<tr style='width: 100%; height:35px;'>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].ReferenceNumber + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].Origin + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].Destination + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].Agent + "</td>"
                         + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].AWBPieces + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].VolumeWeight + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].CBM + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].GrossWeight + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].Revenue + "</td>"
                        + "<td class='ui-widget-content first' style='font-size: 11px;text-align: center'>" + myData[i].Yield + "</td>"
                        + "</tr>"
                }
                strFlightSummary += '</table>';
                dvFlightDetails.append(strFlightSummary);
            }
            else {
                $("#tblFlightDetails").empty();
                $("#tblFlightDetails").append('No Records Found');
            }
        }
    });
}