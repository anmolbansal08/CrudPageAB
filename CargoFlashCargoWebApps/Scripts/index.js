/// <reference path="references.js" />
$(document).ready(function ($) {
    var userContext = "";
    $(document).bind("contextmenu", function (e) {
        e.preventDefault();
    });
    if ($.browser.safari) {
        //if (Notification.permission !== "granted")   // Comment by braj notification function not working in safari
        //    Notification.requestPermission();
    }
   // setInterval(function () {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            url: "Services/CommonService.svc/ShowTickerOnPublish",
            success: function (response) {
                if (response.ShowTickerOnPublishResult != "") {
                    $("#marTicker").html(response.ShowTickerOnPublishResult).show();
                    //setInterval(function () {
                    //    $("#marTicker").toggleClass('MarqueBlue');
                    //}, 400);
                    //if ($.browser.safari) {
                    //    if (Notification.permission !== "granted")
                    //        Notification.requestPermission();
                    //    else {
                    //        var notification = new Notification('', {
                    //            icon: 'http://www.freeiconspng.com/uploads/message-alert-red-icon--message-types-icons--softiconsm-4.png',
                    //            body: response.ShowTickerOnPublishResult,
                    //        });
                    //    }
                    //}
                }
            }
        });
  //  }, 300000);
    //cfiAutoComplete("WeighingNameSNo", "MachineName", "WeinghMachineConfig", null, "contains");
   
     BlobReportDownload(1);
});
var autoCompleteType = "autocomplete";
var autoCompleteText = "Text";
var autoCompleteKey = "Key";
var attrType = "controltype";
var dateType = "datetype";
var otherType = "OtherType";
var Autourl = "Services/AutoCompleteService.svc/AutoCompleteDataSourceV2";

function cfiAutoComplete(textId, basedOn, autoCompleteName, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect, rightAlign, template, IsChangeOnBlankValue) {
    var keyId = textId;
    textId = "Text_" + textId;
    $("div[id^='" + textId + "-list']").remove();
    if (IsValid(textId, autoCompleteType)) {
        var dataSource = GetDataSource(textId, autoCompleteName);
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
            confirmOnAdd: confirmOnAdd,
            IsChangeOnBlankValue: (IsChangeOnBlankValue == undefined ? false : IsChangeOnBlankValue)
        });
    }
}


var UCitySNo, UOfficeSNo, UAccountSNo, UDomainUrl;
function GetUserContextData(CitySNo, OfficeSNo, AccountSNo, DomainUrl) {
    UCitySNo = CitySNo;
    UOfficeSNo = OfficeSNo;
    UAccountSNo = AccountSNo;
    UDomainUrl = DomainUrl;
}

function GetDataSource(textId, autoCompleteName) {
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
                data: { autoCompleteName: autoCompleteName }
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


function RefreshPage() {
    window.location.href = "Index.cshtml";
}


function PrintAWB() {

    //str += "<td><input type='hidden' name='AWbNo' id='AWbNo' value=''><input type='text' name='Text_AWbNo' id='Text_AWbNo' /></td>";

    $("#popPrintAWbDialog").remove();
    $('#LogoutPanal').append('<div id="popPrintAWbDialog" style="font-family: Arial; font-size:13px;"></div>');
    $("#popPrintAWbDialog").append('<table id="tblpassword" style="margin: 0px auto; width:80%;"><tr><td>Print AWB :</td><td><input type="hidden" name="AWbNo" id="AWbNo"  value=""><input type="text" name="Text_AWbNo" id="Text_AWbNo" controltype="autocomplete" /></td></tr></table>');
    $("#popPrintAWbDialog").dialog(
    {
        autoResize: true,
        maxWidth: 400,


        width: 400,

        modal: true,
        title: 'Print AWB',
        draggable: false,
        resizable: false,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).dialog("close");
        }
    });
    cfiAutoComplete("AWbNo", "AWBNo", "User_AWBNo", RedirectToAWBPrint, "contains")
    $("#Text_AWbNo").focus();  // added by arman 
}

function clicktodownload(e) {


    if (($("#HdnGroupName").val().toUpperCase() == "ADMIN") || ($("#HdnGroupName").val().toUpperCase() == "SUPER ADMIN")) {
        //e.preventDefault();  //stop the browser from following
        window.location.href = 'Docs/ICMS.V1.0. User Manual Reservation.docx';
    }
    else if ($("#HdnGroupName").val().toUpperCase() == "AGENT") {
        window.location.href = 'Docs/Handbook - Agent Portal.docx';
    }
    else {
        window.location.href = 'Docs/ICMS.V1.0. User Manual Reservation.docx';
    }
}



function GetCityAutocomplete() {
    $("#spnCityCode").hide();
    $("#spnCity").removeAttr("style");
    //if ($("#HdnGroupName").val().toUpperCase() == "CTO")
    //{
    cfiAutoComplete("AirportCode", "AirportCode", "User_Airport", onselectAirportCode, "contains");
    // $("#Text_AirportCode").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode);

    //}
    //else
    //{
    //    cfiAutoComplete("AirportCode", "AirportCode", "vUser_City", "SNo", "AirportCode", ["AirportCode", "CityCode"], onselectAirportCode, "contains");
    //    //cfiAutoComplete("CityCode", "CityCode", "vUser_City", "SNo", "CityCode", ["CityCode", "CityCode"], onselectAirportCode, "contains");
    //}

}
function updateFilepath(fPath) {
    // var  uid = userContext.UserSNo;
    //alert($("#filepath").attr('href'));
    //window.location.href = "Services/Permissions/PermissionService.svc/UpdateRateDownload?filepath=C:\\RateExcelFilePath\\RateDownload28032019_111612.xls&UserSNo=" + userContext.UserSNo;
    window.location.href = "Services/Permissions/PermissionService.svc/UpdateRateDownload?filepath="+fPath+"&UserSNo=" + userContext.UserSNo;
    //window.location.href = "../BLOBUploadAndDownload/DownloadFromBlob?filenameOrUrl=" + fPath;
    //$.ajax({
    //    url: "Services/Permissions/PermissionService.svc/UpdateRateDownload",
    //    async: false,
    //    type: "POST",
    //    cache: false,
    //    contentType: "application/json; charset=utf-8",
    //    data: JSON.stringify({FilePath:'C:\\RateExcelFilePath\\RateDownload28032019_111612.xls', UserSNo: userContext.UserSNo}),
    //    success: function (result) {
    //        //alert(AirportCode);
    //    },
    //    error: function (result) {
    //        //$('#mValidateMessage').text("Invaild Attempt !!!");
    //    }
    //});
   

}
//var OnBlob = userContext.SysSetting.GenerateReportOnBlob == "Yes"
function onselectAirportCode() {
    var AirportSNo = $("#AirportCode").val();
    var AirportCode = $("#Text_AirportCode").val();
    var UserSNo = JSON.parse($("#hdnUserContext").val()).UserSNo;
    var citysno = 0;

    //window.location.href = "LoginService.cs/GetCitySNo?AirportSNo=" + AirportSNo;

    //window.location.href = "Index.cshtml?AirportSNo=" + AirportSNo + "&AirportCode=" + AirportCode + "&UserSNo=" + UserSNo;

    $.ajax({
        url: "Services/Permissions/PermissionService.svc/UpdateSession",
        async: false,
        type: "POST",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AirportSNo: AirportSNo, AirportCode: AirportCode, UserSNo: UserSNo }),
        success: function (result) {
            //alert(AirportCode);
        },
        error: function (result) {
            //$('#mValidateMessage').text("Invaild Attempt !!!");
        }
    });
    window.location.href = "Index.cshtml";
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


    var filter = getFilter("AND");
    if (textId == "Text_AWbNo") {
        //if ($("#HdnGroupName").val().toUpperCase() == 'ADMIN') {
        //  //  setFilter(filter, "IsActive", "eq", 1)
        //    //cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)
        //}
        //else
        if (userContext.AccountSNo == 0 && userContext.OfficeSNo == 0 && userContext.AgentSNo == 0) {
        }
        else {
            if (userContext.AgentSNo > 0 && UAccountSNo > 0) {

                // setFilter(filter, "OfficeSNo", "eq", UOfficeSNo)
                setFilter(filter, "AccountSNo", "eq", UAccountSNo)
                // setFilter(filter, "IsActive", "eq", 1)
            }
            //else if ($("#HdnGroupName").val().toUpperCase() == 'ACCOUNTS') {

            //    setFilter(filter, "OfficeSNo", "eq", UOfficeSNo)
            //    setFilter(filter, "AccountSNo", "eq", UAccountSNo)
            //   // setFilter(filter, "IsActive", "eq", 1)
            //}
            else if (userContext.OfficeSNo > 0 && UOfficeSNo > 0) {

                setFilter(filter, "OfficeSNo", "eq", UOfficeSNo)
                //  setFilter(filter, "IsActive", "eq", 1)
            }
        }
        //else {

        //    setFilter(filter, "OfficeSNo", "eq", UOfficeSNo)
        //    setFilter(filter, "AccountSNo", "eq", UAccountSNo)
        //    //setFilter(filter, "IsActive", "eq", 1)
        //}
        var RT_Filter = autoCompleteFilter(filter);
        return RT_Filter;
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
    //else if (JSON.parse($('#hdnUserContext').val()).Password == NewPassword) {
    //    $('#mValidateMessage').text("New Password should be different from Previous Password!!!");
    //    return false;
        //}
    else if (OldPassword == NewPassword) {
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
                            $("#logout").click();

                            //$('a#logout').trigger('click');
                            //// $("#popPasswordDialog").hide();
                            //$('#popPasswordDialog').dialog("close");
                           
                        }
                        else {
                            if (result == 1)
                                $('#mValidateMessage').text("Old Password does not exist !!!");
                            else if (result == 2)
                                $('#mValidateMessage').text("Password should not be same as last 4 password");
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



function RedirectToAWBPrint() {
    //http://localhost:3139/awbprintA4.html?sno=11536&pagename=ReservationBooking
    var tnc =userContext.SysSetting.AWBPRINTTERMSCONDITIONS;
    if ($('#Text_AWbNo').val() != '') {
        if (userContext.SysSetting.AWBPrintofIATAFormat == 'True' && (userContext.SysSetting.ClientEnvironment == 'G8' || userContext.SysSetting.ClientEnvironment == 'UK')) {
            window.open('' + UDomainUrl + '/AwbPrintA4Contract.html?sno=' + btoa($('#AWbNo').val()) + '&pagename=' + btoa('ReservationBooking') + '&tnc=' + btoa(tnc) + "&BookingTypeIndexNo=" + btoa('NA') + "&InternationalORDomestic=" + btoa('NA') + "&AWBPrintofIATAFormat=" + btoa(userContext.SysSetting.AWBPrintofIATAFormat), '_blank');
        } else {
            window.open('' + UDomainUrl + '/awbprintA4.html?sno=' + btoa($('#AWbNo').val()) + '&pagename=' + btoa('ReservationBooking') + '&tnc=' + btoa(tnc), '_blank');
            $('#AWbNo').val()
            $('#Text_AWbNo').val('')
            $('#popPrintAWbDialog').dialog("close");
        }
    }

}







//Start Code by Akash 29 July 2017


//Disable Right Click
$(document).bind("contextmenu", function (e) {
    e.preventDefault();
});



$(document).ready(function () {
    //Disable full page
    //$('body').bind('cut copy paste', function (e) {
    //    e.preventDefault();
    //});

    ////Disable part of page
    //$('#id').bind('cut copy paste', function (e) {
    //    e.preventDefault();
    //});
});

document.onkeydown = function (e) {
    // To Disable F12
    //if (event.keyCode == 123) {
    //    return false;
    //}
    // To Disable Cntrl + SHift + I
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    // To Disable Cntrl + SHift + J
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    // To Disable Cntrl + SHift + C
    //if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
    //    return false;
    //}

    // To Disable Cntrl + U
    //if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
    //    return false;
    //}

    // To Disable Cntrl + S
    if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) {
        return false;
    }

};

//End Start Code by Akash 29 July 2017
function BlobReportDownload(IsOnLoad) {
    // var OnBlob = userContext.SysSetting.GenerateReportOnBlob == "Yes"
    var Download = 'Download';

    $.ajax({
        url: "../Reports/DownloadBlobReports",
        async: false,
        type: "POST",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
                if (result != "Failed" && result != undefined) {
                var dataTableobj = JSON.parse(result);
                var view = '<thead><tr><th class="formSection" colspan="18"><b>Generated Report</b><input style="margin-left:960px" id="txt_name" type="text"       placeholder="RequestedBy"onkeyup="funsearch()" ></th></tr>'
       + '<tr><th class="formtHeaderLabel"colspan="6">No of pending request : </th><th class="formtHeaderLabel"colspan="9"><span style="color:red">' + dataTableobj.Table2[0].SNo + '</span></th></tr>'
       + '<tr><th class="formtHeaderLabel"colspan="6">Estimated Time  : </th><th class="formtHeaderLabel"colspan="9"><span style="color:red">' + dataTableobj.Table2[0].TimeTaken + '  ' +'minutes'+'</span></th></tr>'
       + '<tr><th class="formtHeaderLabel"style="width:14%">Token No.</th>'
       + '<th class="formtHeaderLabel"style="width:14%">Report Name</th>'
       + '<th class="formtHeaderLabel"style="width:14%">Report/Remark</th>'
       + '<th class="formtHeaderLabel"style="width:14%">From Date</th>'
       + '<th class="formtHeaderLabel"style="width:14%">To Date</th>'
       + '<th class="formtHeaderLabel"style="width:14%">Requested On</th>'
       + '<th class="formtHeaderLabel"style="width:14%">Processed On</th>'
       + '<th class="formtHeaderLabel"style="width:14%">Requested Parameters</th>'
       + '<th class="formtHeaderLabel"style="width:14%" id="Request">Requested By</th>'
       + '<th class="formtHeaderLabel"style="width:14%" id="Request">Time Taken (in min.)</th>'
       + '</tr></thead>';
                var check = dataTableobj.Table0[0];
                var Hasdata = false;
                if (check.IsOnBlob == "YES") {
                    $(dataTableobj.Table1).each(function (i, e) {
                        view += "<tbody><tr>";
                        view += "<td class=\"formHeaderTranscolumn\"style=\"width:14%;\">" + e.SNo + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\">" + e.ReportName + "</td>";
                        Hasdata = true;
                        if (e.GeneratedURL != '' && e.GeneratedURL != undefined && e.GeneratedURL.indexOf(' ') < 0) {
                            view += "<td  class=\"Download\">" + '<a href="' + atob(e.GeneratedURL) + '">' + Download + '</a>' + "</td>";

                        }
                        else
                            view += "<td class=\"formHeaderTranscolumn\">" + (e.GeneratedURL != '' && e.GeneratedURL != undefined ? e.GeneratedURL : '') + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\">" + e.FromDate + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\">" + e.ToDate + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\">" + e.RequestedOn + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\">" + e.ProcessedAt + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\" style=\"word-break:break-all;\"title=\" " + e.RequestReportParameters + "\">" + "Parameters" + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\">" + e.Requested_By + "</td>";
                        view += "<td class=\"formHeaderTranscolumn\">" + e.TimeTaken + "</td>";
                        view += "<tr></tbody>";
                    });
                    if (IsOnLoad == 0) {

                        $("head").after('<div id="divLocationWindow" style="overflow:auto"><table class="WebFormTable" id="myinput">' + view + '</table></div>');
                        //Show Popup
                        $("#divLocationWindow").dialog(
                             {
                                 autoResize: true,
                                 maxWidth: 1500,
                                 maxHeight: 800,
                                 width: 1300,
                                 height: 500,
                                 modal: true,
                                 title: 'Download Reports',
                                 draggable: true,
                                 resizable: true,
                                 buttons: {

                                     Cancel: function () {
                                         $(this).dialog("close");
                                     }
                                 },
                                 close: function () {
                                     $(this).dialog("close");
                                 }
                             });
                        $('.Download').click(function (e) {
                            $(this).text('Downloaded');
                        });
                    }
                    else if (Hasdata) {
                        $('#BlobReportPopUp').show();
                    }
                }
            }
            else if (IsOnLoad == 0) {
                alert("List of Reports has error, Please contact to support team.");
            }
        }
    });
};

function funsearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("txt_name");
    filter = input.value.toUpperCase();
    table = document.getElementById("myinput");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[8];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


//Added By Uttam