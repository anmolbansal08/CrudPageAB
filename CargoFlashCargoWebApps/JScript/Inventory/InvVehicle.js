$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);

    }
    cfi.AutoCompleteV2("VehicleTypeSNo", "VehicleType", "Inventory_VehicleTypeSNo", null, "contains");
}
);