$(document).ready(function () { 
    cfi.AutoCompleteV2("VehicleTypeSNo", "vehicletype", "VehicleType_VehicleType", null, "contains");

    $("input[type='submit'][name='operation']").click(function (e) {
     
        var strCt = parseFloat($('#Capacity').val());
        if(strCt<10)
        {           
            $('#Capacity').val();
            $('#Capacity').focus();
            ShowMessage('warning', 'Information!', "Please Enter Capacity More Than 10 kg ", "top-right");
            return false;

        }

    });

});


function ExtraCondition(textID) {
    var filterVehicleType = cfi.getFilter("AND");
    if (textID == "Text_VehicleTypeSNo") {
        cfi.setFilter(filterVehicleType, "IsActive", "eq", 1);
        cfi.setFilter(filterVehicleType, "IsDeleted", "eq", 0);
        var VehicleTypeAutoCompleteFilter = cfi.autoCompleteFilter(filterVehicleType);
        return VehicleTypeAutoCompleteFilter;
    }
}



