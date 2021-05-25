$(document).ready(function () {

    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "MarineInsuranceReport_CityCode", clear, "contains");


    //$("#UserName").keyup(function (e) {

    //    var strCt = $('#UserName').val();
    //    var iKeyCode = (e.which) ? e.which : e.keyCode
    //    if (e.which === 32) {
    //        var strCt = strCt.substring(0, strCt.length - 1);
    //        $('#UserName').val(strCt);
    //        $("#UserName").focus();
    //        return false;

    //    }

    //})

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        $("#LicenceExpiry").val("");
        SetDateRangeValue(undefined, "LicenceExpiry");

        //     //$("#Mobile").attr("data-valid", "required");  //$("#Mobile").attr("data-valid-msg", "Enter Mobile No");

        //  var myDatePicker = $("#LicenceExpiry").kendoDatePicker().data("kendoDatePicker");
        //     var today = new Date();
        //     var day = today.getDate();
        //     var month = today.getMonth();
        //     var year = today.getFullYear();
        //     myDatePicker.min(new Date(year, month, day));
        //     $("#LicenceExpiry").data("kendoDatePicker").value("");



    }
    // if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

    // //  $("#LicenceExpiry").data("kendoDatePicker").min(new Date());
    // var currentdate = new Date();
    // currentdate.setHours(0,0,0,0);
    // //var LicenceExpiry = new Date($('#LicenceExpiry').val());
    // //LicenceExpiry.setDate(LicenceExpiry.getDate() + 1);
    // $("#LicenceExpiry").data("kendoDatePicker").min(currentdate);
    // }




});

$(document).ready(function () {
    $("#Address").removeClass('k-nput');
    $("#Address").addClass('pwdtextbox');
});


function ExtraCondition(textId) {

    var filterCity = cfi.getFilter("AND");



    if (textId == "Text_CitySNo") {

        cfi.setFilter(filterCity, "IsActive", "eq", 1);
        // cfi.setFilter(filterCity, "CitySNo", "in", lvalue(_SessionAccessibleCitySNo_));
        var CityAutoCompleteFilter = cfi.autoCompleteFilter(filterCity);
        return CityAutoCompleteFilter;
    }
    var AssociatedBranchAutoCompleteFilter = cfi.autoCompleteFilter(filterCity);
    return AssociatedBranchAutoCompleteFilter;

}



function clear() {
    cfi.ResetAutoComplete("Name");
}