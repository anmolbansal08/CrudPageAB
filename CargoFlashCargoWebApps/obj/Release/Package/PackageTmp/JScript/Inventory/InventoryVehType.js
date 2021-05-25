$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        // $("input:radio[name='IsDefault'][value ='1']").prop('checked', true);
        
    }
    cfi.AutoComplete("ManufacturerSNo", "SNo,Name", "VehicleManufacturer", "SNo", "Name", ["Name"], null, "contains");
}
);