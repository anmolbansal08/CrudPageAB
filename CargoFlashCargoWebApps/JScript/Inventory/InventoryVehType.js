$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
        
    }
    cfi.AutoCompleteV2("ManufacturerSNo", "SNo,Name", "Inventory_ManufacturerSNo", null, "contains");
}
);