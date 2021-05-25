$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoComplete("CountrySNo", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "AirlineCode", "Airline", "SNo", "AirlineCode", ["AirlineCode"], null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        var td = $("#IsAutoAWB").closest("td");
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            $("input[name=IsAutoAWB]:first").attr({ checked: "checked" });
        }
        var td = $("#AWBType").closest("td");
        if (!(typeof td === "undefined")) {
            td.html(td.html().replace("ISIATA", "IATA AWB").replace("Courier", "Courier").replace("Mail", "Mail"));
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            $("input[name=AWBType]:first").attr({ checked: "checked" });
        }
        
    }
});