$(document).ready(function () {
    var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    //cfi.ValidateForm();
    $("input").bind("keyup", function () {
        PutColoninStartRange(this);
    });
    $('input').bind('keypress', function (event) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

});
function PutColoninStartRange(obj) {
    var s = $("#" + obj.id).val().length
    if (s == 3) {
        $("#" + obj.id).val($("#" + obj.id).val() + '-');
    }
}
function MOPProcess() {
    $('#divTrackingTrans').html('');
    var AWBNo = $("#AWB").val();
    if (AWBNo.length != 12) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        $('#divTracking').hide();
        return false;
    }
    if (AWBNo != "") {
        $.ajax({
            url: 'HtmlFiles/EDI/MOP.html',
            success: function (result) {

                $('#divTracking').html(result);
                $('#divTracking').hide();
                BindMOPProcessData();
            }
        });
    }
    else {
        $('#divTracking').hide();
        $("#tblTrans").remove();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }
}
function BindMOPProcessData() {
    
    var AWBNo = $("#AWB").val();
    $.ajax({
        url: "Services/Shipment/TrackingService.svc/GetMOPRecord?AWBNo=" + AWBNo,cache:false,
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            ResultData = jQuery.parseJSON(result)
            AWBData = ResultData.Table0;
            EDIData = ResultData.Table1;
            Routing = ResultData.Table2;
            EDITime = ResultData.Table3;
            if (AWBData.length != 0) {
                CreateMOPProcess(AWBData, EDIData, Routing, EDITime); $('#divTracking').show();
            }
            else {
                ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
            }
        }
    });
}
function CreateMOPProcess(AWBData, EDIData, Routing, EDITime) {

    if (AWBData!=null) {
        $("#spnConsignmentNo").html(AWBData[0].AWBNo);
        $("#spnCarrier").html(AWBData[0].CarrierCode);
        $("#spnFlight").html(AWBData[0].FlightNo);
        $("#spnETD").html(AWBData[0].ETD.substring(0, 6) + " " + AWBData[0].ETD.substring(12, 17) + ' (Local)');
        $("#spnETA").html(AWBData[0].ETA.substring(0, 6) + " " + AWBData[0].ETA.substring(12, 17)  + ' (Local)')
        $("#spnETDGMT").html(AWBData[0].ETDGMT.substring(0, 6) + " " + AWBData[0].ETDGMT.substring(12, 17) + ' (UTC)');
        $("#spnETAGMT").html(AWBData[0].ETAGMT.substring(0, 6) + " " + AWBData[0].ETAGMT.substring(12, 17) + ' (UTC)')
        $("#spnTotalpieces").html(AWBData[0].TotalPieces);
        $("#spnFarwarder").html(AWBData[0].Farwarder.toUpperCase());
        $("#spnPlannedRCSlast").html(AWBData[0].AWBNo);
        
        $("#spnPlannedRCSlast").html(AWBData[0].AWBNo);
        $("#spnTotalWeight").html(AWBData[0].TotalGrossWeight);
        $("#spnRouting").html(Routing[0].Route);
        $("#spnProductCode").html(AWBData[0].ProductName);
        $("#spnBaselineRouting").html(Routing[0].Route.substring(0,7));

        $('#divTracking').show();
         
        $("#spnPieces").html(AWBData[0].TotalPieces);
       // $("#spnOFWB").html(AWBData[0].AWBNo);
        $("#spnOrigin").html(AWBData[0].Origin);
        $("#spnDest").html(AWBData[0].Destination);
        var DEP = 0, MAN = 0, FWB = 0, RCS = 0, RCF = 0, NFD = 0, DLV = 0;
         
        for (var i = 0; i < EDIData.length; i++) {
            ///////////////Outbound////////////////////
            if (EDIData[i].MessageSubType == "FWB" && FWB == 0) {
                $("#spnFWBDate").html(EDIData[i].EventDate.substring(0, 6) + " " + EDIData[i].EventDate.substring(12, 17));
                $("#spnFWBTime").html('(' + EDITime[0].FWBCutofftime + ')');
                $("#tdFWB").css("color", EDITime[0].FWBColor);
                $("#spnFWB").css("background-color", EDITime[0].FWBbackgroundColor);
                FWB = 1;
            }
            if (EDIData[i].MessageSubType == "RCS" && RCS == 0) {
                $("#spnRCSDate").html(EDIData[i].EventDate.substring(0, 6) + " " + EDIData[i].EventDate.substring(12, 17));
                $("#spnRCSTime").html('(' + EDITime[0].RCSCutofftime + ')');
                $("#tdRCS").css("color", EDITime[0].RCSColor);
                $("#spnRCS").css("background-color", EDITime[0].RCSbackgroundColor);
                RCS = 1;
            }
            if (EDIData[i].MessageSubType == "DEP" && DEP == 0) {
                $("#spnDEPDate").html(EDIData[i].EventDate.substring(0, 6) + " " + EDIData[i].EventDate.substring(12, 17));
                $("#spnDEPTime").html('(' + EDITime[0].DEPCutofftime + ')');
                $("#tdDEP").css("color", EDITime[0].DEPColor);
                $("#spnDEP").css("background-color", EDITime[0].DEPbackgroundColor);
                DEP = 1;
            }
            ///////////////Inbound////////////////////
            if (EDIData[i].MessageSubType == "RCF" && RCF== 0) {
                $("#spnRCFDate").html(EDIData[i].EventDate.substring(0, 6) + " " + EDIData[i].EventDate.substring(12, 17));
                $("#spnRCFTime").html('(' + EDITime[0].RCFCutofftime + ')');
                $("#tdRCF").css("color", EDITime[0].RCFColor);
                $("#spnRCF").css("background-color", EDITime[0].RCFbackgroundColor);
                RCF = 1;
            }
            if (EDIData[i].MessageSubType == "NFD" && NFD == 0) {
                $("#spnNFDDate").html(EDIData[i].EventDate.substring(0, 6) + " " + EDIData[i].EventDate.substring(12, 17));
                $("#spnNFDTime").html('(' + EDITime[0].NFDCutofftime + ')');
                $("#tdNFD").css("color", EDITime[0].NFDColor);
                $("#spnNFD").css("background-color", EDITime[0].NFDbackgroundColor);
                NFD = 1;
            }
            if (EDIData[i].MessageSubType == "DLV" && DLV == 0) {
                $("#spnDLVDate").html(EDIData[i].EventDate.substring(0, 6) + " " + EDIData[i].EventDate.substring(12, 17));
                $("#spnDLVTime").html('(' + EDITime[0].DLVCutofftime + ')');
                $("#tdDLV").css("color", EDITime[0].DLVColor);
                $("#spnDLV").css("background-color", EDITime[0].DLVbackgroundColor);
                DLV = 1;
            }
        }
            $("#spnFWBTime").html('(' + EDITime[0].FWBCutofftime + ')');
            $("#spnRCSTime").html('(' + EDITime[0].RCSCutofftime + ')');
            $("#spnDEPTime").html('(' + EDITime[0].DEPCutofftime + ')');
        ////////////////////////change
            $("#spnRCFTime").html('(' + EDITime[0].RCFCutofftime + ')');
            $("#spnNFDTime").html('(' + EDITime[0].NFDCutofftime + ')');
            $("#spnDLVTime").html('(' + EDITime[0].DLVCutofftime + ')');
        for (var i = 0; i < EDIData.length; i++) {
            $("#tblEDI tbody").append("<tr style='border:1px solid black;'><td style='width:10%; padding:7px;'>" + EDIData[i].CityCode + "</td><td style='width:10%; padding:7px;'>" + EDIData[i].MessageSubType + "</td><td style='width:10%; padding:7px;' >" + EDIData[i].EventDate + "</td><td style='width:7%; padding:7px;'>" + EDIData[i].UpdatedAt + "</td><td style='width:12%; padding:7px; '>" + EDIData[i].MessageType + "</td><td style='width:12%; padding:7px;'>" + EDIData[i].NOP + "</td><td style='width:8%; padding:7px;'>" + EDIData[i].GrossWeight + "</td><td style='width:8%; padding:7px;'><span style='display: inline-block;background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#50A7E7), color-stop(100%,#3679CF));background: -moz-linear-gradient(center top, #50A7E7 0%, #3679CF 100%);-webkit-box-shadow: 0px 1px 0px #61b5ff inset, 0px 1px 1px 0px #bdbdbd;-moz-box-shadow: 0px 1px 0px #61b5ff inset, 0px 1px 1px 0px #bdbdbd;box-shadow: 0px 1px 0px #61b5ff inset, 0px 1px 1px 0px #bdbdbd;-webkit-border-radius: 15px;-moz-border-radius: 15px;border-radius: 15px;text-shadow: 0px -1px 0px #004d80;padding: 2px 8px;border-color: #4081AF;border-width: 1px;border-style: solid;font-size: 11px;color: #FFFFFF;font-weight: bold;'>OSI</span></td><td style='width:5%; padding:7px;'> </td></tr>");
        }
    }
    else {
        $('#divTracking').hide();
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }
}