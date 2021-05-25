/// <reference path="../common.js" />

$(document).ready(function () {
    cfi.ValidateForm();
   
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "ManageGroup_City", GetCityData, "contains");

    cfi.AutoCompleteV2("AllowCitySNo", "CityName,CityCode", "Security_AllowCitySNo", RemoveRequired, "contains", ",");

   
   
    cfi.AutoCompleteV2("MobileCountryCode", "MobileCountryCode", "Security_MobileCountryCode",  null, readOnlyfield, "contains");


    cfi.AutoCompleteV2("WareHouseMasterSNo", "WarehouseName", "Security_WarehouseMaster", null, "contains");
    cfi.AutoCompleteV2("AirportSNo", "AirportCode,AirportName", "Security_Airport", ClearWarehouse, "contains");
    cfi.AutoCompleteV2("LanguaugeSNo", "LanguaugeName", "Security_Language", null, "contains");
    cfi.AutoCompleteV2("GroupSNo", "GroupName", "Security_Groups", OnAdminChange, "contains");


    //$('input:input[name=operation]').click(function () {
    //    if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "1" && $("#AllowCitySNo").val() == "") {
    //        ShowMessage('warning', 'Need your Kind Attention!', 'Select Allow City.');
    //        return false;
    //    }
    //});
    $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").each(function () {
        $(this).click(function () {
            if ($(this).val() == "0") {
                var closestTr = $(this).closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTr.find($("#spnAllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).hide();
                closestTr.find($("#divMultiAllowCitySNo")).hide();
                closestTr.find("td:eq(3) span").hide()
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').hide();
                $("#AllowCitySNo").val('');
                $("#Text_AllowCitySNo").val('');
                $("#divMultiAllowCitySNo").find('ul >li').each(function (i) {
                    if (i > 0) {
                        $("#Multi_AllowCitySNo").val('');
                        $('span[id*=FieldKeyValuesAllowCitySNo]')[0].textContent = '';
                        $("#divMultiAllowCitySNo").find('ul >li').eq(1).remove();
                    }
                });
            }
            else {
                var closestTr = $(this).closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
                closestTr.find($("#spnAllowCitySNo")).show();
                closestTr.find($("#Text_AllowCitySNo")).show();
                closestTr.find($("#divMultiAllowCitySNo")).show();
                closestTr.find("td:eq(3) span").show()
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').show();
            }
        });
    });
    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        $('#ShowPassword').css('display', 'none');
    }
    
    //==========================Add By:Pradeep Sharma=============================== 
    OnAdminChange();
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        if ($('#CitySNo').val() != "") {
            var val = $('#Text_CitySNo').val();
            $('span[id*=DCity]')[1].textContent = val;
            //$('span#DCity').text(val);
        }
        $('input:radio[id^=IsCityChangeAllowed]:eq(1)').attr("checked", "checked");
        $('#MobileCountryCode').closest('td').find('.k-combobox ').css('width', '70px');
        if ($('#MobileCountryCode').val() == "")
            $('#Mobile').attr('readOnly', 'readOnly');

        // $('#Phone').attr('onblur', 'checkMobileCountryCode(this.value);');
        $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").each(function () {
            if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "0") {
                var closestTr = $(this).closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTr.find($("#spnAllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).hide();
                closestTr.find($("#divMultiAllowCitySNo")).hide();
                closestTr.find("td:eq(3) span").hide()
                $('input:text[id^=Text_AllowCitySNo]').val('')
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').hide();
            }
            else {
                var closestTr = $(this).closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
                closestTr.find($("#spnAllowCitySNo")).show();
                closestTr.find($("#Text_AllowCitySNo")).show();
                closestTr.find($("#divMultiAllowCitySNo")).show();
                closestTr.find("td:eq(3) span").show()
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').show();
            }
        });

    }
    //=======================================Update Case=======================================================================================
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('#MasterDuplicate').css('display', 'none');
        $('.floatingHeader').css('display', 'none');
    }
    if ((getQueryStringValue("FormAction").toUpperCase() == "READ") || (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")) {

        if ($('#Text_GroupSNo').val() == "ADMIN") {
            $("#spnCompanyName").hide();

        }
        if ($("#CityChangeAllowed").val() == "NO") {
            $("#spnMultipleCity").hide();
        }
        var closestTr = $('input:text[id^=Company]').closest('tr');
        closestTr.find('td').hide();
        $('input:text[id^=Company]').removeAttr('data-valid');
        $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").each(function () {
            if ($(this).val() == "0") {
                var closestTr = $(this).closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');
                closestTr.find($("#spnAllowCitySNo")).hide();
                closestTr.find($("#Text_AllowCitySNo")).hide();
                closestTr.find($("#divMultiAllowCitySNo")).hide();
                // closestTr.find("td:eq(3) span").hide()
                $('input:text[id^=Text_AllowCitySNo]').val('')
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').hide();
            }
            if ($(this).val() == "1") {
                var closestTr = $(this).closest("tr");
                //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
                closestTr.find($("#spnAllowCitySNo")).show();
                closestTr.find($("#Text_AllowCitySNo")).show();
                closestTr.find($("#divMultiAllowCitySNo")).show();
                closestTr.find("td:eq(3) span").show()
                var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
                closestH.find('td font').show();
            }
        });

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")) {
        $('#MobileCountryCode').closest('td').find('.k-combobox ').css('width', '70px');
        if ($('#MobileCountryCode').val() == "")
            $('#Mobile').attr('readOnly', 'readOnly');
        // $('#Phone').attr('onblur', 'checkMobileCountryCode(this.value);');        
        //$("#Password").hide();




        //$('input:radio[name=MLIsCityChangeAllowed]:checked').val()=="0"
        if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "0") {
            var closestTr = $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").closest("tr");
            //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "");
            closestTr.find($("#spnAllowCitySNo")).hide();
            closestTr.find($("#Text_AllowCitySNo")).hide();
            closestTr.find($("#divMultiAllowCitySNo")).hide();
            closestTr.find("td:eq(3) span").hide()
            $('input:text[id^=Text_AllowCitySNo]').val('')
            var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
            closestH.find('td font').hide();

        }
        else {
            var closestTr = $(this).closest("tr");
            //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
            closestTr.find($("#spnAllowCitySNo")).show();
            closestTr.find($("#Text_AllowCitySNo")).show();
            closestTr.find($("#divMultiAllowCitySNo")).show();
            closestTr.find("td:eq(3) span").show()
            var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
            closestH.find('td font').show();

        }

        var SPHCVal = ($('#AllowCitySNo').val());
        var SPHCText = ($('#Text_AllowCitySNo').val());
        $('#Text_AllowCitySNo')[0].defaultValue = '';
        $('#Text_AllowCitySNo')[0].Value = '';
        $('#Text_AllowCitySNo').val('');
        $('#Multi_AllowCitySNo').val(SPHCVal);
        $('#FieldKeyValuesAllowCitySNo')[0].innerHTML = SPHCVal;
        var i = 0;
        if (SPHCVal.split(',').length > 0) {
            while (i < SPHCVal.split(',').length) {
                if (SPHCVal.split(',')[i] != '')
                    $('#divMultiAllowCitySNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SPHCText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SPHCVal.split(',')[i] + "'></span></li>");
                i++;
            }
        } else { $('#divMultiAllowCitySNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SPHCText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SPHCVal.split(',')[i] + "'></span></li>"); }

        //   OnAdminChange();
    }

    $('.k-delete').click(function () {
        $(this).parent().remove();
        if ($("div[id='divMultiAllowCitySNo']").find("span[name^='FieldKeyValuesAllowCitySNo']").text().indexOf($(this)[0].id + ",") > -1) {
            var AllowCitySNoVal = $("div[id='divMultiAllowCitySNo']").find("span[name^='FieldKeyValuesAllowCitySNo']").text().replace($(this)[0].id + ",", '');
            $("div[id='divMultiAllowCitySNo']").find("span[name^='FieldKeyValuesAllowCitySNo']").text(AllowCitySNoVal);
            $('#AllowCitySNo').val(AllowCitySNoVal);
        }
        else {
            var AllowCitySNoValfield = $("div[id='divMultiAllowCitySNo']").find("span[name^='FieldKeyValuesAllowCitySNo']").text().replace($(this)[0].id, '');
            $("div[id='divMultiAllowCitySNo']").find("span[name^='FieldKeyValuesAllowCitySNo']").text(AllowCitySNoValfield);
            $('#AllowCitySNo').val(AllowCitySNoValfield);
        }
        $("div[id='divMultiAllowCitySNo']").find("input:hidden[name^='Multi_AllowCitySNo']").val($("div[id='divMultiAllowCitySNo']").find("span[name^='FieldKeyValuesAllowCitySNo']").text());

    });

    $('#Password').attr('maxlength', '20');
});
function checkMobileCountryCode(val) {
    $('#Mobile').removeAttr('readOnly');


}
function OnAdminChange() {
    var val = $("#Text_GroupSNo").val();
    if (val == "ADMIN") {
        // $('input:text[id^=Company]').attr("data-valid", "");
        $('input:text[id^=Company]').removeAttr('data-valid');
        ///  $('input:text[id^=UserName]').removeAttr('data-valid');

        var closestTr = $('input:text[id^=Company]').closest('tr');
        closestTr.find('td:eq(3) input').hide();
        closestTr.find("td:eq(2) span").hide();
        closestTr.find("td:eq(2) font").hide();
        $('#CompanyName').closest('td').find('.valid_errmsg').css('display', 'none');
    }
    else {

        var closestTr = $('input:text[id^=Company]').closest('tr');
        closestTr.find('td:eq(3) input').show();
        closestTr.find("td:eq(2) span").show();
        closestTr.find("td:eq(2) font").show();

        $('input:text[id^=Company]').attr("data-valid", "required");
        //   $('input:text[id^=UserName]').attr("data-valid", "required");
    }

}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function ExtraCondition(textId) {
    var filterConsolidatorSNo = cfi.getFilter("AND");

    //======================Add By:Pradeep Sharma==================================
    if (textId == "Text_CitySNo") {
        $('#AirportSNo').val('');
        $('#Text_AirportSNo').val('');
        $('#WareHouseMasterSNo').val('');
        $('#Text_WareHouseMasterSNo').val('');
    }

    if (textId == "Text_AllowCitySNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        
        if (textId.indexOf("CitySNo") >= 0)

            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_CitySNo").data("kendoAutoComplete").key());
        // cfi.setFilter(filterConsolidatorSNo, "CitySNo", "notin", $("#" + textId.replace('CitySNo', 'HdnCitySNo')).val());      
    }

    if (textId == "Text_AirportSNo") {
        //$('#WareHouseMasterSNo').val('');
        //$('#Text_WareHouseMasterSNo').val('');
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key());
        //cfi.setFilter(filterConsolidatorSNo, "SNo", "in", lvalue(_SessionAccessibleCitySNo_));
    }

    if (textId == "Text_WareHouseMasterSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "AirportSNo", "eq", $("#Text_AirportSNo").data("kendoAutoComplete").key());
    }
    if (textId == "Text_AllowAirportSNo") {

        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_AllowCitySNo").data("kendoAutoComplete").key() || $("#Text_CitySNo").data("kendoAutoComplete").key());

    }
    if (textId == "Text_AllowWarehouseSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_AllowCitySNo").data("kendoAutoComplete").key() || $("#Text_CitySNo").data("kendoAutoComplete").key());

    }
        //==============================End==============================================
    else if (textId == "Text_GroupSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        
    }
    var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterConsolidatorSNo);
    return RegionAutoCompleteFilter;
}


function GetData(textID, textValue, keyID, keyValue) {
    // HideRows();
    var actingKeyValue = keyValue;
    var sNo = keyValue;
    var groupName = textValue;
    var allowMultiCity = false;
    var actingGroupSNo = keyValue;
    var actingGroupName = textValue;
    $.ajax({
        url: "Services/Permissions/GroupsService.svc/GetGroupDetails?GroupSNo=" + keyValue,
        async: false, type: "GET", dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            sNo = eval(result)[0].SNo;
            sNo = eval(result)[0].GroupName;
            allowMultiCity = eval(result)[0].MultiCity == "YES";
            actingGroupSNo = eval(result)[0].ActingGroupSNo;
            actingGroupName = eval(result)[0].ActingGroupName;
        },
        error: function (xhr) {
            ShowMessage('info', lApplicationMessage, xhr);
        }
    });

}

function GetCityDefult(textID, textValue, keyID, keyValue) {
    if (textValue != null || textValue != "") {
        $("input[id$='Text_CitySNo']").val(textValue);
    }

}
function ClearWarehouse() {
    cfi.ResetAutoComplete("WareHouseMasterSNo");
    $.ajax({
        url: "index.aspx/setAirportWarehouseName",
        async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ citySno: $('#CitySNo').val(), airportSNo: ($("#AirportSNo").val() == '' ? '0' : $("#AirportSNo").val()) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.d != "") {
                $('#WareHouseMasterSNo').val(result.d.split('~')[2]);
                $('#Text_WareHouseMasterSNo').val(result.d.split('~')[3]);
            }
        },
        error: function (xhr) {
            alert($(xhr.responseText).find("p:eq(1)").html());
        }
    });
}
function GetCityData(textID, textValue, keyID, keyValue) {
    var val = textValue;
    $('span#DCity').text(val);
    cfi.ResetAutoComplete("AirportSNo");
    cfi.ResetAutoComplete("WareHouseMasterSNo");
    $.ajax({
        url: "index.aspx/setAirportWarehouseName",
        async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ citySno: keyValue, airportSNo: '0' }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.d != "") {
                if (result.d.split('~').length >= 4) {
                    $('#AirportSNo').val(result.d.split('~')[0]);
                    $('#Text_AirportSNo').val(result.d.split('~')[1]);
                    $('#WareHouseMasterSNo').val(result.d.split('~')[2]);
                    $('#Text_WareHouseMasterSNo').val(result.d.split('~')[3]);
                }
            }
        },
        error: function (xhr) {
            alert($(xhr.responseText).find("p:eq(1)").html());
        }
    });

}

$(document).ready(function () {
    $("#Password").addClass('pwdtextbox');
    $("#Address").removeClass('k-nput');
    $("#Address").addClass('pwdtextbox');
});
function ShowAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            var block = $(this).closest("tr").find("td:last").html();
            var groupName = $(this).find("td:eq(3)").text().toUpperCase();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId + "&gname=" + groupName, addOnFunction: addOnFunction, addOnParmeter: recId });
            }
        });
    });
}
function addOnFunction(content, obj, recId) {
    $("#header-user-options").find("a").css("display", "");
    //var loginType = lvalue(_SessionLoginType_);
    var loginType = _SessionLoginType_;
    if (loginType.toUpperCase() == "ADMIN") {
        if ($(obj).find("td:last").text().toUpperCase() == "NO") {
            $("#header-user-options").find(".actionSpan").each(function () {
                if ($(this).text().toUpperCase() == "UNBLOCK" || $(this).text().toUpperCase() == "BLOCK") {
                    $(this).text("BLOCK");
                    $(this).closest("a").unbind("click").bind("click", function () {
                        BlockUser(recId);
                    });
                }
            });
            $(content).find(".actionSpan").each(function (index) {
                if ($(this).text().toUpperCase() == "UNBLOCK") {
                    $(this).text("BLOCK");
                    $(content).find("a:eq(" + index + ")").unbind("click").bind("click", function () {
                        BlockUser(recId);
                    });
                }
            });
        }
        else {
            $("#header-user-options").find(".actionSpan").each(function () {
                if ($(this).text().toUpperCase() == "UNBLOCK" || $(this).text().toUpperCase() == "BLOCK") {
                    $(this).text("UNBLOCK");
                    $(this).closest("a").unbind("click").bind("click", function () {
                        UnblockUser(recId);
                    });
                }
            });
            $(content).find(".actionSpan").each(function (index) {
                if ($(this).text().toUpperCase() == "UNBLOCK") {
                    $(content).find("a:eq(" + index + ")").unbind("click").bind("click", function () {
                        UnblockUser(recId);
                    });
                }
            });
        }
    }
    else {
        $("#header-user-options").find(".actionSpan").each(function () {
            if ($(this).text().toUpperCase() == "UNBLOCK") {
                $(this).closest("a").css("display", "none");
            }
        });
        $(content).find(".actionSpan").each(function (index) {
            if ($(this).text().toUpperCase() == "UNBLOCK") {
                $(content).find("a:eq(" + index + ")").remove();
            }
        });
    }
}

function UnblockUser(recId) {
    var url = getAbsolutePath();
    $.ajax({
        url: "Services/Permissions/UsersService.svc/UnblockUser?RecordId=" + recId + "&Url=" + url, async: false,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (response) {
            if (response.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(response);
                ShowMessage('success', 'Success', "[" + myData[0].UserName + "]- " + myData[0].UnblockMessage + " Please reload your page.");
            }
            else {
                ShowMessage('error', 'Error', "Unable to process request.");
            }
        },
        error: function (xhr) {
            ShowMessage('error', 'Error', "Unable to process request!");
        }
    });
}

function BlockUser(recId) {
    var url = getAbsolutePath();
    $.ajax({
        url: "Services/Permissions/UsersService.svc/BlockUser?RecordId=" + recId + "&Url=" + url, async: false,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (response) {
            if (response.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(response);
                ShowMessage('success', 'Success', "[" + myData[0].UserName + "]- " + myData[0].BlockMessage + " Please reload your page.");
            }
            else {
                ShowMessage('error', 'Error', "Unable to process request.");
            }
        },
        error: function (xhr) {
            ShowMessage('error', 'Error', "Unable to process request!");
        }
    });
}
function ShowHidePassword() {
    if ($("#Password").val() != "") {
        if ($('#ShowPassword').val().toLowerCase() == "hide password") {
            $('span#TempPassword').text("");
            $('#ShowPassword').val("Show Password");
        }
        else {
            $('span#TempPassword').text('(Entered Password - ' + $("#Password").val() + ')');
            $('#ShowPassword').val("Hide Password");
        }
    }
    else {
        ShowMessage('info', 'Information', "Enter Password");
    }
}
function UserStatusChange() {
}
$(document).ready(function () {
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        var groupName = getQueryStringValue("gname").toUpperCase();
        if (groupName == "ADMIN") {
            $(".btn.btn-info")[0].style.display = "none";
            $(".btn.btn-danger").css("display", "none");
        }
    }
});

function IsMultiCityAllowed(gSNo) {
    $.ajax({
        url: "Services/Permissions/UsersService.svc/IsMultiCityAllowed?SNo=" + gSNo,
        async: false, type: "GET", dataType: "json",
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var res = jQuery.parseJSON(result)[0];
                if (res.IsMultiCity == 'False')
                    $("#AccessibleCitySNo").closest("tr").hide();
                else
                    $("#AccessibleCitySNo").closest("tr").show();

            }
        }
        // error: function (xhr) {
        //  var a = "";
        //}
    });
}

function RemoveRequired() {
    //var closestTr = $(this).closest("tr");
    //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).removeAttr('data-valid');

    $('#Text_AllowCitySNo').removeAttr('data-valid');

}

function readOnlyfield(valueId, value, keyId, key) {
    if (value == "") {
        $('#Mobile').attr('readOnly', 'readOnly');
        $('#Mobile').val('');
        $('#Mobile').removeClass('valid_invalid');
    }
    else
        $('#Mobile').removeAttr('readOnly');
}
function RadioMLIsCityChangeAllowed() {
    if ($('input:radio[name=MLIsCityChangeAllowed]:checked').val() == "0") {


        var closestTr = $(this).find("input[type='radio'][id^='MLIsCityChangeAllowed']").closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "");
        closestTr.find($("#spnAllowCitySNo")).hide();
        closestTr.find($("#Text_AllowCitySNo")).hide();
        closestTr.find($("#divMultiAllowCitySNo")).hide();
        closestTr.find("td:eq(3) span").hide()
        $('input:text[id^=Text_AllowCitySNo]').val('')
        var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
        closestH.find('td font').hide();
    }
    else {
        var closestTr = $(this).closest("tr");
        //closestTr.find($('input:text[id^=Text_AllowCitySNo]')).attr("data-valid", "required");
        closestTr.find($("#spnAllowCitySNo")).show();
        closestTr.find($("#Text_AllowCitySNo")).show();
        closestTr.find($("#divMultiAllowCitySNo")).show();
        closestTr.find("td:eq(3) span").show()
        var closestH = $('input:text[id^=Text_AllowCitySNo]').closest('tr');
        closestH.find('td font').show();
    }
}