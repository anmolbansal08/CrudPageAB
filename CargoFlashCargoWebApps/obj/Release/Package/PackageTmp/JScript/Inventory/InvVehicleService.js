$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);

    }
    cfi.AutoComplete("VehicleSNo", "RegistrationNo", "vInvVehicleServiceVehicle", "SNo", "RegistrationNo", ["RegistrationNo", "VehicleType", "Manufacturer", "ModelNo", "VehicleName"], null, "contains");
    cfi.AutoComplete("VehicleServiceTypeSNo", "ServiceType", "VehicleServiceType", "SNo", "ServiceType", ["ServiceType"], null, "contains");
}
);