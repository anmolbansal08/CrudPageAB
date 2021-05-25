$(document).ready(function () {
    cfi.ValidateForm();

    cfi.AutoCompleteV2("CountrySNo", "CountryCode,CountryName", "Master_State_Country", null, "contains");



})
