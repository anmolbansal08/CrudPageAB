$(document).ready(function () {

  
    cfi.ValidateForm();
    cfi.AutoComplete("DepartmentSNo", "Name", "VWDepartment", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "VWAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("DesignationSNo", "Name", "vwDesignationMaster", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("TeamIDSNo", "Name", "vwTeamID", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("SkillSNo", "Name", "vwSkillMaster", "SNo", "Name", ["Name"], null, "contains", ",");
    cfi.BindMultiValue("SkillSNo", $("#Text_SkillSNo").val(), $("#SkillSNo").val());

    cfi.AutoComplete("EmployeeTypeSNo", "EmployeeType", "EmployeeType", "SNo", "EmployeeType", ["EmployeeType"], null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $('#CityCode').val(userContext.CityCode);
        $("#JoiningDate").val("");
        $("#ResignDate").val("");
        $("#LWorkingDate").val("");
        $('input[type="radio"][data-radioval="Blue Collar"]').removeAttr('checked');
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        if ($('span#ResignDate').text() == "01-Jan-1900") {
            $('#ResignDate').val('');
            $('span#ResignDate').closest('span').html('');
        }
        if ($('span#JoiningDate').text() == "01-Jan-1900") {
            $('#JoiningDate').val('');
            $('span#JoiningDate').closest('span').html('');
        }
        if ($('span#LWorkingDate').text() == "01-Jan-1900") {
            $('#LWorkingDate').val('');
            $('span#LWorkingDate').html('');
        }
    }
    //if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
    //    
    //}


    $('#CityCode').attr('readonly', 'readonly');
});

    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ") {
    
    //    var SkillDataField = ($('#SkillSNo').val());
    //    var SkillDataText = ($('#Text_SkillSNo').val());
    //    $('#Text_SkillSNo')[0].defaultValue = '';
    //    $('#Text_SkillSNo')[0].Value = '';
    //    $('#Text_SkillSNo').val('');
    //    $('#Multi_SkillSNo').val(SkillDataField);
    //    $('#FieldKeyValuesSkillSNo')[0].innerHTML = SkillDataField;
    //    var i = 0;


        //if (TruckTypeVal != "" && TruckTypeText == "") {
        //    TruckTypeVal = TruckTypeVal.replace(",,", ",");
        //    $.ajax({
        //        type: "POST",
        //        url: "./Services/Master/BayMasterService.svc/GetTruckTypeText?recid=" + TruckTypeVal,
        //        data: { id: 1 },
        //        dataType: "json",
        //        success: function (response) {
        //            if (response != null && response != '') {
        //                TruckTypeText = response.Data[0];
        //                TruckTypeVal = response.Data[1];
        //                if (TruckTypeVal.split(',').length > 0) {
        //                    while (i < TruckTypeVal.split(',').length) {
        //                        if (TruckTypeVal.split(',')[i] != '')
        //                            $('#divMultiSkillSNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + TruckTypeText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + TruckTypeVal.split(',')[i] + "'></span></li>");
        //                        i++;
        //                    }
        //                    $('.k-delete').click(function () {
        //                        $(this).parent().remove();
        //                        if ($("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text().indexOf($(this)[0].id + ",") > -1) {
        //                            var SkillSNoVal = $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text().replace($(this)[0].id + ",", '');
        //                            $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text(SkillSNoVal);
        //                            $('#SkillSNo').val(SkillSNoVal);
        //                        }
        //                        else {
        //                            var SkillSNoValfield = $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text().replace($(this)[0].id, '');
        //                            $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text(SkillSNoValfield);
        //                            $('#SkillSNo').val(SkillSNoValfield);
        //                        }
        //                        $("div[id='divMultiSkillSNo']").find("input:hidden[name^='Multi_SkillSNo']").val($("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text());

        //                    });
        //                }
        //            }
        //        }
        //    });
        //}
    //else {


//        if (SkillDataField.split(',').length > 0) {
//            while (i < SkillDataField.split(',').length) {
//                if (SkillDataField.split(',')[i] != '')
//                    $('#divMultiSkillSNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SkillDataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SkillDataField.split(',')[i] + "'></span></li>");
//                    i++;
//                }
//            }
//        //}
//    }
//    $('.k-delete').click(function () {
//        $(this).parent().remove();
//        if ($("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text().indexOf($(this)[0].id + ",") > -1) {
//            var SkillSNoVal = $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text().replace($(this)[0].id + ",", '');
//            $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text(SkillSNoVal);
//            $('#SkillSNo').val(SkillSNoVal);
//        }
//        else {
//            var SkillSNoValfield = $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text().replace($(this)[0].id, '');
//            $("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text(SkillSNoValfield);
//            $('#SkillSNo').val(SkillSNoValfield);
//        }
//        $("div[id='divMultiSkillSNo']").find("input:hidden[name^='Multi_SkillSNo']").val($("div[id='divMultiSkillSNo']").find("span[name^='FieldKeyValuesSkillSNo']").text());

//    });

//});

function ExtraCondition(textId) {
    var filtertextId = cfi.getFilter("AND");
    if (textId == "Text_DesignationSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_DepartmentSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_AirlineSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_SkillSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_TeamIDSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
}