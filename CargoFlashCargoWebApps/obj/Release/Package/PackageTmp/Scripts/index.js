/// <reference path="references.js" />
$(document).ready(function ($) {
    if ($.browser.safari) {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
    }
    setInterval(function () {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            url: "Services/CommonService.svc/ShowTickerOnPublish",
            success: function (response) {
                if (response.ShowTickerOnPublishResult != "") {
                    $("#marTicker").text(response.ShowTickerOnPublishResult).show();
                    setInterval(function () {
                        $("#marTicker").toggleClass('MarqueBlue');
                    }, 400);
                    if ($.browser.safari) {
                        if (Notification.permission !== "granted")
                            Notification.requestPermission();
                        else {
                            var notification = new Notification('', {
                                icon: 'http://www.freeiconspng.com/uploads/message-alert-red-icon--message-types-icons--softiconsm-4.png',
                                body: response.ShowTickerOnPublishResult,
                            });
                        }
                    }
                }
            }
        });
    }, 300000);
});
var autoCompleteType = "autocomplete";
var autoCompleteText = "Text";
var autoCompleteKey = "Key";
var attrType = "controltype";
var dateType = "datetype";
var otherType = "OtherType";
var Autourl = "Services/AutoCompleteService.svc/AutoCompleteDataSource";

function cfiAutoComplete(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template) {
    var keyId = textId;
    textId = "Text_" + textId;
    //  if (IsValid(textId, autoCompleteType)) {
    if (keyColumn == null || keyColumn == undefined)
        keyColumn = basedOn;
    if (textColumn == null || textColumn == undefined)
        textColumn = basedOn;
    var dataSource = GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName);
    $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
        filter: (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria),
        dataSource: dataSource,
        select: (onSelect == undefined ? null : onSelect),
        filterField: basedOn,
        rightAlign: (rightAlign == undefined ? false : rightAlign),
        separator: (separator == undefined ? null : separator),
        dataTextField: autoCompleteText,
        dataValueField: autoCompleteKey,
        valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
        template: template == null ? '<span>#: TemplateColumn #</span>' : template,
        addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
        newAllowed: newAllowed,
        confirmOnAdd: confirmOnAdd
    });
    // }
}

function GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: Autourl,
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

var _ExtraCondition = function (textId) {
    if ($.isFunction(window.ExtraCondition)) {
        return ExtraCondition(textId);
    }
}

function GetCityAutocomplete() {
    $("#spnCityCode").hide();
    $("#spnCity").removeAttr("style");
    //if ($("#HdnGroupName").val().toUpperCase() == "CTO")
    //{
    cfiAutoComplete("AirportCode", "AirportCode", "vUser_Airports", "SNo", "AirportCode", ["AirportCode", "CityCode"], onselectAirportCode, "contains");
   // $("#Text_AirportCode").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode);
        
    //}
    //else
    //{
    //    cfiAutoComplete("AirportCode", "AirportCode", "vUser_City", "SNo", "AirportCode", ["AirportCode", "CityCode"], onselectAirportCode, "contains");
    //    //cfiAutoComplete("CityCode", "CityCode", "vUser_City", "SNo", "CityCode", ["CityCode", "CityCode"], onselectAirportCode, "contains");
    //}
    
}


function onselectAirportCode() {
    var AirportSNo = $("#AirportCode").val();
    var AirportCode = $("#Text_AirportCode").val();
    var UserSNo = JSON.parse($("#hdnUserContext").val()).UserSNo;
    var citysno = 0;

    //window.location.href = "LoginService.cs/GetCitySNo?AirportSNo=" + AirportSNo;

    window.location.href = "Index.cshtml?AirportSNo=" + AirportSNo + "&AirportCode=" + AirportCode + "&UserSNo=" + UserSNo;

}

function autoCompleteFilter(filterName) {
    var filter = { logic: "AND", filters: [] };
    if (Object.prototype.toString.call(filterName) === '[object Array]') {
        for (var i = 0; i < filterName.length; i++)
            if (filterName[i] != undefined) {
                filter.filters.push(filterName[i]);
            }
    }
    else {
        if (filterName != undefined) {
            filter.filters.push(filterName);
        }
    }
    return filter;
}
function getFilter(logic) {
    var filter = { logic: (logic == undefined || logic == "" ? "AND" : logic), filters: [] };
    return filter;
}
function setFilter(filterName, field, operator, value) {
    if (filterName != undefined) {
        filterName.filters.push({ field: field, operator: operator, value: value });
    }
}
function ExtraCondition(textId) {
    var filterFlight = getFilter("AND");
    if (textId.indexOf("AirportCode") >= 0) {
        var filterAirport = getFilter("AND");
        setFilter(filterAirport, "UserSNo", "eq", JSON.parse($("#hdnUserContext").val()).UserSNo);
        filterFlight = autoCompleteFilter(filterAirport);
        return filterFlight;
    }
}
var IsValid = function (cntrlId, attrValue) {
    var attr = $("[id='" + cntrlId + "']").attr(attrType);
    // For some browsers, `attr` is undefined; for others,
    // `attr` is false.  Check for both.
    if (typeof attr !== 'undefined' && attr !== false && attr == attrValue) {
        // ...
        return true;
    }
    return false;
}
function PasswordStrength(New_Password) {
   
    $('#result').html(checkStrength(New_Password))
}

function checkStrength(password) {
    var strength = 0

    if (password.length == 0) {
        $('#result').removeClass()
        $('#divresult').removeClass()
        return "";
    }
   
    if (password.length > 7) strength += 1
    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/[a-z]/) || password.match(/[A-Z]/)) strength += 1
    // If it has numbers and characters, increase strength value.
    //if (password.match(/[A-Z]/)) strength += 1
    if (password.match(/[0-9]/)) strength += 1
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // If it has two special characters, increase strength value.
    //if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // Calculated strength value, we can return messages
    // If value is less than 2
        if (strength == 1) {
            $('#result').removeClass()
            $('#result').addClass('short')
            $('#divresult').removeClass()
            $('#divresult').addClass('divshort')
            return 'Weak'
        }
        if (strength == 2) {
            $('#result').removeClass()
            $('#result').addClass('weak')
            $('#divresult').removeClass()
            $('#divresult').addClass('divweak')
            return 'Good'
        } else if (strength == 3) {
            $('#result').removeClass()
            $('#result').addClass('good')
            $('#divresult').removeClass()
            $('#divresult').addClass('divgood')
            return 'Strong'
        } else {
            $('#result').removeClass()
            $('#result').addClass('strong')
            $('#divresult').removeClass()
            $('#divresult').addClass('divstrong')
            return 'Very Strong'
        }

}

function PopChangePassword() {
    $("#popPasswordDialog").remove();
    $('#LogoutPanal').append('<div id="popPasswordDialog" style="font-family: Arial; font-size:13px;"></div>');
    $("#popPasswordDialog").append('<table id="tblpassword" style="margin: 0px auto; width:60%;"><tr><td><label style="margin-top: 5%;" name="OldPassword">Old Password</label></td></tr><tr><td><input type="password" autocomplete="off" style="width:100%;margin-bottom: 2%;padding: 6px 10px; box-sizing: border-box;border: 1px solid #4CAF50;border-radius: 4px;" id="OldPassword" maxlength="20" onblur="requiredfn(this.id)" /></td></tr><tr><td><label name="NewPassword" >New Password</label></td></tr><tr><td><input type="password" onkeyup="PasswordStrength(this.value)"  id="NewPassword" maxlength="20" autocomplete="off" style="width:100%;margin-bottom: 2%;padding: 6px 10px;box-sizing: border-box;border: 1px solid #4CAF50;border-radius: 4px;"onblur="requiredfn(this.id)" /><div id="divresult"></div><div id="result"></div><span id="password_strength"></span></td></tr><tr><td><label name="ConfirmPassword">Confirm Password</label></td></tr><tr><td><input type="password"  id="ConfirmPassword" maxlength="20" autocomplete="off" style="width:100%;margin-bottom: 2%;padding: 6px 10px;box-sizing: border-box;border: 1px solid #4CAF50;border-radius: 4px;"onblur="requiredfn(this.id)" /></td></tr><tr><td><label id="mValidateMessage" style="color:red;"></label></td></tr></table>');
    $("#popPasswordDialog").dialog(
    {
        autoResize: true,
        maxWidth: 400,
        maxHeight: 325,

        width: 400,
        height: 325,
        modal: true,
        title: 'Change Password',
        draggable: false,
        resizable: false,
        buttons: {
            "Save": function () {
                var OldPassword = $('#OldPassword').val();
                var NewPassword = $('#NewPassword').val();
                var ConfirmPassword = $('#ConfirmPassword').val();
                ChangePassword(OldPassword, NewPassword, ConfirmPassword);
                //$(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).dialog("close");
        }
    });
}
function ChangePassword(OldPassword, NewPassword, ConfirmPassword) {

    if (OldPassword == "" || NewPassword == "" || ConfirmPassword == "") {
        if (OldPassword == "")
            $('#OldPassword').css("border", "1px solid red");
        if (NewPassword == "")
            $('#NewPassword').css("border", "1px solid red");
        if (ConfirmPassword == "")
            $('#ConfirmPassword').css("border", "1px solid red");

        $('#mValidateMessage').text("Passwords are mandatory !!!");
        return false;
    }
    else if (NewPassword.length <= 7) {//OldPassword.length < 5 || 
        $('#mValidateMessage').text("Password must have minimum 8 characters !!!");
        return false;
    }
    else if (JSON.parse($('#hdnUserContext').val()).Password == NewPassword) {
        $('#mValidateMessage').text("New Password should be different from Previous Password!!!");
        return false;
    }
    else if (NewPassword != ConfirmPassword) {
        $('#mValidateMessage').text("New and Confirm Password do not match !!!");
        return false;
    }

    else if (NewPassword != "") {
        if (NewPassword != "") {
            re = /[0-9]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one number (0-9)!");
                $('#NewPassword').focus();
                return false;
            }
            re = /[a-z]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one lowercase letter (a-z)!");
                $('#NewPassword').focus();
                return false;
            }
            re = /[A-Z]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one uppercase letter (A-Z)!");
                $('#NewPassword').focus();
                return false;
            }
            re = /[-@!$%^&*()_+|~=`\\#{}\[\]:";'<>?,.\/]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one special character!");
                $('#NewPassword').focus();
                return false;
            }

            else {
                //alert("success");
                $('#mValidateMessage').text('');
                $.ajax({
                    url: "Services/Permissions/ChangePasswordService.svc/SaveChangePassword",
                    async: false,
                    type: "POST",
                    cache: false,
                    data: JSON.stringify({ SNo: JSON.parse($('#hdnUserContext').val()).UserSNo, OldPassword: OldPassword, NewPassword: NewPassword }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result == 0) {
                            alert("Password has been changed successfully.");
                            $('a#logout').trigger('click');
                        }
                        else {
                            if (result == 1)
                                $('#mValidateMessage').text("Old Password does not exist !!!");
                            else
                                $('#mValidateMessage').text("Error !!!");
                        }
                    },
                    error: function (result) {
                        $('#mValidateMessage').text("Invaild Attempt !!!");
                    }
                });
            }

        }
    }


}