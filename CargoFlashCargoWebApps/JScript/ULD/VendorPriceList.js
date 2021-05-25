//var ExcelResult = '';
//$(document).ready(function () {

//    cfi.AutoComplete("CustomerSNo", "Name", "GetULDVendor", "SNo", "Name");
//    var Ownership = [{ Key: "1", Text: "EA" }, { Key: "2", Text: "LB" }, { Key: "3", Text: "L" }, ];
//    cfi.AutoCompleteByDataSource("UOM", Ownership, onchange);

//});

$(document).ready(function () {
    // cfi.AutoComplete("CustomerSNo", "Vendor", "VwULDVendorList", "SNoAgreementNo", "Vendor", ["Vendor"], null, "contains", null, null, null, null, onSelectVendor);
    cfi.AutoCompleteV2("CustomerSNo", "Vendor", "ULDSLA_VendorListName", SelectVendor, "contains");
    var Ownership = [{ Key: "1", Text: "EA" }, { Key: "2", Text: "LB" }, { Key: "3", Text: "L" }, { Key: "4", Text: "SH" }, ];
    cfi.AutoCompleteByDataSource("UOM", Ownership, onchange);
    //if ($('#Name').length > 0) {
    //    var ano = $('#Name').data('kendoAutoComplete').key();
    //    setAgreementNo(ano);
    // }
    //$('#_tempPrice').after('<label>(IDR)</lable>');
    $('#Price').after('<span>(IDR)</span>');

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        
        var Customer = $("#Text_CustomerSNo").data("kendoAutoComplete").key();
        $('#price').after('<label>(' + userContext.CurrencyCode +')</lable>');


        SelectVendor(Customer)
    }
})

//function setAgreementNo(val) {
//    var agreementNo = "";
//    if (val != undefined && val.length > 0) {
//        var ANo = val.split('-');
//        if (ANo.length > 1)
//            agreementNo = ANo[1];
//    }
//    $('#Agreement').val(agreementNo)
//}
function SelectVendor(e) {
    
    CustomerSNo = ($("#CustomerSNo").val() == "") ? 0 : $("#CustomerSNo").val();
    $.ajax({
        type: "GET",
        url: "./Services/ULD/ULDVendorPriceListService.svc/SelectVendor/" + CustomerSNo,
        dataType: "json",
        success: function (response) {
            $('#Agreement').val(response.Agreement);
        }
    });
}
//function onSelectVendor(e) {
//    ;
//    var data = this.dataItem(e.item.index());
//    setAgreementNo(data.Key);
//}





