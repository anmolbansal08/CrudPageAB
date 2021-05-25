$(document).ready(function () {
    cfi.ValidateForm();
    SetAuction();
    cfi.AutoCompleteV2("CurrencyCode", "CurrencyName,CurrencyCode", "Master_CustomerBid_CurrencyCode", null, "contains");
    cfi.AutoCompleteV2("AuctionSNo", "AuctionName", "AirlineAuction", "SNo", "AuctionName");
    cfi.AutoCompleteV2("CustomerSNo", "CustomerName", "Master_CustomerBid_CustomerName");
    $("#Text_AuctionSNo").change(function () {
        SetAuction();
    })
})
function SetAuction() {
    var flightNo = "";
    var origin = "";
    var destination = "";
    var td = $("#AuctionSNo").closest("td");
    if (td.length > 0) {
        if (td.find("span[id=spanData]").length == 0) {
            var span = $("<span/>").attr({ id: 'spanData' });
            td.append(span);
        }
        $.ajax({
            type: "POST",
            url: "./Services/Master/CustomerBidService.svc/GetAuctionRecord?id=" + $("#AuctionSNo").val(),
            data: { id: 1 },
            dataType: "json",
            success: function (response) {
                $("#spanData").html("");
                if (response.Data.length > 0) {
                    flightNo = response.Data[2];
                    origin = response.Data[0];
                    destination = response.Data[1];
                    $("#spanData").append("<span> <b>Flight No</b> : " + flightNo + "</span>");
                    $("#spanData").append("<span> <b>Origin</b> : " + origin + "</span>");
                    $("#spanData").append("<span> <b>Destination</b> : " + destination + "</span>");
                }
                else {
                    $("#spanData").append("");
                    $("#spanData").append("");
                    $("#spanData").append("");
                }
            }
        });
    }
}