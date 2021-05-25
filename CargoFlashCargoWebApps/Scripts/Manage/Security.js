/// <reference path="../common.js" />
function HideRows() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#tbl tr:gt(5)").each(function (index) {
//            if (index < 4)
//                $(this).hide(); // skip heading  
        });
        $("input[id$='CustomerSNo']").val("");
        $("input[id$='CustomerSNo']").removeAttr('data-valid', 'required');
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#tbl tr:gt(5)").each(function (index) {
//            if (index < 4)
//                $(this).hide(); // skip heading  
        });
        var v = $("#GroupSNo").val();
        if (v == 6) {
            $("#tbl tr:eq(7)").show();
            $("input[id$='POSSNo']").val("");
            $("input[id$='DropBoxSNo']").val("");
            $("input[id$='B2BSNo']").val("");
        }
        $("input[id$='CustomerSNo']").removeAttr('data-valid', 'required');
    }

}
$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("CityCode", "CityName,CityCode", "Security_AllowCitySNo", GetCityData, "contains");
    cfi.AutoCompleteV2("GroupSNo", "GroupName", "Security_Groups", GetData, "contains");
    cfi.AutoCompleteV2("CustomerSNo", "CustomerName", "Security_CustomerName",  null, "contains");
    $("#Text_GroupSNo").bind("blur change", function () {
        if ($("#Text_GroupSNo").val() == "CUSTOMER") {
            cfi.EnableAutoComplete("CustomerSNo", true, true, "transparent");
            $("#CustomerSNo").closest("tr").show();
        }
        else {
            cfi.EnableAutoComplete("CustomerSNo", false, true, "transparent");
            $("#CustomerSNo").closest("tr").hide();
        }
    });
    HideRows();
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        var v = $("#Text_GroupSNo").val();
        var vSNo = $("#GroupSNo").val();
        if (vSNo >= 5)
            $("#spnName").text(v + " Name");
        else
            $("#spnName").text("");
        $("#tbl tr:eq(10)").hide();
    }

});


function ExtraCondition(textId) {
    var filterCustomerSNo = cfi.getFilter("AND");

    if (textId == "Text_CustomerSNo") {
        cfi.setFilter(filterCustomerSNo, "City", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key());
    }
    var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterCustomerSNo);
    return RegionAutoCompleteFilter;
}

function GetData(textID, textValue, keyID, keyValue) {
    HideRows();
    if (keyValue == 6) {
        $("#tbl tr:eq(7)").show();
        $("input[id$='CustomerSNo']").attr('data-valid', 'required');
    }
    else
        HideRows();
}

function GetCityData(textID, textValue, keyID, keyValue) {
    if (keyValue == "") {
        $("input[id$='CustomerSNo']").val("");
    }
}

$(document).ready(function () {
    $("#Password").addClass('pwdtextbox');
    $("#Address").removeClass('k-nput');
    $("#Address").addClass('pwdtextbox');
});