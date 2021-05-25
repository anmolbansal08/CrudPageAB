$(document).ready(function () {




    cfi.AutoCompleteV2("VehicleTypeSNo", "vehicletype", "VehicleType_VehicleType", null, "contains");
    cfi.AutoCompleteV2("VehicleMakeSNo", "vehiclemake", "VehicleMake_VehicleMake", GetCapacityTransvehicle, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "MarineInsuranceReport_CityCode", null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() != "EDIT") {
        $("#tbl").find("tr:eq(4)").hide();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#ExpiryDate").val("");
        $("#Capacity").attr("readonly", true);
    }
    SetDateRangeValue(undefined, "ExpiryDate");


    $("input[type='submit'][name='operation']").click(function (e) {

        var strCt = parseFloat($('#Capacity').val());
        if (strCt < 10) {
            $('#Capacity').val();
            $('#Capacity').focus();
            ShowMessage('warning', 'Information!', "Please Enter Capacity More Than 10 kg ", "top-right");
            return false;

        }

    });


    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        $('input:radio[name="ISOwner"][value="0"]').prop('checked', true);

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#Capacity").attr("readonly", true);

        var type = $("#ISOwnerTypeNo").val();
        if (type == 0) {
            $('input:radio[id=ISOwner]').filter('[value="0"]').attr('checked', true);
        }
        if (type == 1) {
            $('input:radio[id=ISOwner]').filter('[value="1"]').attr('checked', true);
        }
        $("#tbl").find("tr:eq(3)").hide();
    }
    //  $("#ExpiryDate").data("kendoDatePicker").min(new Date());
});



function ExtraCondition(textId) {
    var filterCity = cfi.getFilter("AND");
    if (textId == "Text_CitySNo") {
        cfi.setFilter(filterCity, "IsActive", "eq", 1);
        // cfi.setFilter(filterCity, "SNo", "in", lvalue(_SessionAccessibleCitySNo_));
    }
    else if (textId == "Text_VehicleTypeSNo") {
        cfi.setFilter(filterCity, "IsDeleted", "eq", 0);
        cfi.setFilter(filterCity, "IsActive", "eq", 1);
    }

    else if (textId == "Text_VehicleMakeSNo") {
        if ($("#Text_VehicleTypeSNo").val() != "" && $("#Text_VehicleTypeSNo").val() != "undefined") {

            cfi.setFilter(filterCity, "VehicleTypeSNo", "eq", $("#VehicleTypeSNo").val());
        }
        cfi.setFilter(filterCity, "IsDeleted", "eq", 0);
        cfi.setFilter(filterCity, "IsActive", "eq", 1);
        var VehiclemakeAutoCompleteFilter = cfi.autoCompleteFilter(filterCity);
        return VehiclemakeAutoCompleteFilter;
    }
    var CityAutoCompleteFilter = cfi.autoCompleteFilter(filterCity);
    return CityAutoCompleteFilter;
}


function GetCapacityTransvehicle() {
    var VehicleTypeSNo = $("#VehicleTypeSNo").val();
    var VehicleMakeSNo = $("#VehicleMakeSNo").val();

    $.ajax({
        url: "Services/Master/VehicleService.svc/GetCapacityTransvehicle?VehicleTypeSNo=" + VehicleTypeSNo + "&VehicleMakeSNo=" + VehicleMakeSNo,
        async: false, type: "GET", dataType: "json",
        // data: JSON.stringify({ VehicleTypeSNo: VehicleTypeSNo }),
        contentType: "application/text; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(result);
                $("input[id='_tempCapacity']").val(myData[0].Capacity);
                $("input[id='Capacity']").val(myData[0].Capacity);
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}



function clear() {
    cfi.ResetAutoComplete("VehicleMakeSNo");
    $("#_tempCapacity").val('');
}









