$(document).ready(function () {
    $('tr').find('td.formbuttonrow').remove();
    cfi.AutoComplete("Origin", "AirportCode,AirportName", "vAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("Destination", "AirportCode,AirportName", "vAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("Commodity", "CommodityCode", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains");
    cfi.AutoComplete("Product", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    cfi.AutoComplete("SHC", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains");
});

function FlightOpen() {
    var SearchCriteria = { "lNOP": "12", "lWeight": "77", "lWeightCode": "K", "lNOG": "SPARE PARTS", "lOrigin": "BOM", "lDestination": "HYD", "lAirlinePrefix": "589", "lCarrierCode": "9W", "lFlightNumber": "111", "lFlightdate": "06/16/2015", "lFlightCarrierCode": "9W" };
    $.ajax({
        type: "POST",
        cache: false,
        url: userContext.SysSetting.CRAServiceURL + 'WebServiceGetRates.asmx/GetRates',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(SearchCriteria),
        success: function (data) {
            //$(obj).closest('tr').find("input[id^=_temptblAWBRateDesription_Charge_").val(JSON.parse(data.d).Airwaybill_ChargeLines[0][6]);
            //$(obj).closest('tr').find("input[id^=_temptblAWBRateDesription_ChargeAmount_").val(JSON.parse(data.d).Airwaybill_ChargeLines[0][7]);
        },
        error: function (a, b) {
        }
    });
}