
$(document).ready(function () {
    BindAutoComplete();

    cfi.BindMultiValue("Country", $("#Text_Country").val(), $("#Country").val());
});

function BindAutoComplete() {
    cfi.AutoComplete("Country", "CountryName", "vCountryDetails", "SNo", "CountryName", ["CountryName"], null, "contains", ",", null, null, null, null, true);
}

//function checkCurrency(e) {
//    $("#Text_Country").select(function () {
//        if ($('#RegionType:checked').val() == '1') {
//            var length = $("#divMultiCountry ul li").length;
//            if (length > 2) {
//                var currencyCode = $("#divMultiCountry ul li:eq(1) span")[1].id.split("-")[1];
//                for (i = 2; i < length; i++) {
//                    if (currencyCode != $("#divMultiCountry ul li:eq(" + i + ") span")[1].id.split("-")[1]) {
//                        var li = "#divMultiCountry ul li:eq(" + i + ")";
//                        $(li).remove();
//                        ShowMessage('warning', 'Warning -Region!', "Warning - Country with same currency code can be added");
//                        e.stopPropagation();
//                    }
//                }
//            }
//        }
//    });
//}

$('input[type="radio"][name="RegionType"]').click(function () {
    $("#divMultiCountry").remove();
    $("#Country").val('');
    BindAutoComplete();
});

function ExtraCondition(textId) {
    var filterCountry = cfi.getFilter("AND");
    if (textId == "Text_Country" && $("#Country").val() != "" && $('#RegionType:checked').val() == '1') {
        var currenycode = $("#divMultiCountry ul li:eq(1) span")[1].id.split("-")[1];
        cfi.setFilter(filterCountry, "CurrencyCode", "eq", currenycode);
        var CountryFilter = cfi.autoCompleteFilter(filterCountry);
        return CountryFilter;
    }
}

