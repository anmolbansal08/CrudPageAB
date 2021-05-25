$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);

    }
   // cfi.AutoComplete("VehicleTypeSNo", "VehicleType", "vInventoryVehType", "SNo", "VehicleType", ["VehicleType", "Text_ManufacturerSNo", "ModelNo", "VehicleName"], null, "contains");
}
);