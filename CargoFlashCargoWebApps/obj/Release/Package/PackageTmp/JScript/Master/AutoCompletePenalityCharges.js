$(document).ready(function () {
    cfi.AutoComplete("AirlineCode", "AirlineCode,AirlineName", "Airline", "AirlineCode", "CurrencyName", ["CurrencyCode", "CurrencyName"], null,"contains");
    cfi.AutoComplete("Currency", "CurrencyCode,CurrencyName", "Currency", "CurrencyCode", "CurrencyName", ["CurrencyCode", "CurrencyName"], null,"contains");
});