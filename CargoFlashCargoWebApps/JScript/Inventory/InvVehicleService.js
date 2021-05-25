$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);

    }
    cfi.AutoCompleteV2("VehicleSNo", "RegistrationNo", "InvVehicleService_Vehicle", null, "contains");
    cfi.AutoCompleteV2("VehicleServiceTypeSNo", "ServiceType", "InvVehicleService_VehicleServiceType", null, "contains");
}
);