/// <reference path="../../Services/Import/FreightarrivalnotifactionService.svc" />
$(document).ready(function () {
    GetColdRoomShipmentDetails();
});

function GetColdRoomShipmentDetails() {
    var awbSNo = "37064"; //37064
    $.ajax({
        url: "../../Services/Warehouse/ColdRoomShipmentDetailsService.svc/GetColdRoomShipmentRecord",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({awbSNo: awbSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                $("#spnFlightNo").text(FinalData[0].FlightNo);
                $("#spnAWBNo").text(FinalData[0].AWBNo);
                $("#spnDate").text(FinalData[0].AWBDate);
                $('#spnOrigin').text(FinalData[0].Origin);
                $("#spnDestination").text(FinalData[0].Destination);
                $("#spnTotalPieces").text(FinalData[0].TotalPieces);
                $('#spnULDNo').text(FinalData[0].ULDNo);
                $('#spnIMPCode').text(FinalData[0].ImpCode);
                $('#spnWeight').text(FinalData[0].Weight);
                $("#spnRequiredTemp").text(FinalData[0].RequiredTemperature);
                $("#spnLocation").text(FinalData[0].LocationName);
                $("#spnHoldReason").text(FinalData[0].HoldRemarks);
            }
        },
        error: function (err) {
            alert("Generated error");
        }
    });
}
