
var PageType;
var flage = true;

$(document).ready(function () {
    PageType = getQueryStringValue("FormAction").toUpperCase();
    $("#EmailAlertContainer").load("HtmlFiles/Manage/EmailAlert.html", onLoad);



});

function onLoad() {

    cfi.AutoCompleteV2("Airline", "SNo,AirlineName", "ULD_ChargeAirlineName", null, "contains");
    cfi.AutoCompleteV2("Process", "AutoCompleteValue,AutoCompleteText", "Permission_AutoCompleteGeneric", null, "contains");
    cfi.AutoCompleteV2("CityCountry", "Sno,CountryCityName", "Permission_EmailAlertsCountryCity", null, "contains");
    var Occurs = [{ Key: "1", Text: "HOURLY" }, { Key: "2", Text: "DAILY" }, { Key: "3", Text: "WEEKLY" }, { Key: "4", Text: "MONTHLY" }];
    cfi.AutoCompleteByDataSource("Occurs", Occurs, OnChange, null);
    var funHours = [{ Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }, { Key: "4", Text: "4" }, { Key: "5", Text: "5" }
    , { Key: "6", Text: "6" }, { Key: "7", Text: "7" }, { Key: "8", Text: "8" }, { Key: "9", Text: "9" }, { Key: "10", Text: "10" }, { Key: "11", Text: "11" }
    , { Key: "12", Text: "12" }, { Key: "13", Text: "13" }, { Key: "14", Text: "14" }, { Key: "15", Text: "15" }, { Key: "16", Text: "16" }, { Key: "17", Text: "17" }
    , { Key: "18", Text: "18" }, { Key: "19", Text: "19" }, { Key: "20", Text: "20" }, { Key: "21", Text: "21" }, { Key: "22", Text: "22" }, { Key: "23", Text: "23" }];
    cfi.AutoCompleteByDataSource("Hours", funHours, null, null);
    var funMonth = [{ Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }, { Key: "4", Text: "4" }, { Key: "5", Text: "5" }
    , { Key: "6", Text: "6" }, { Key: "7", Text: "7" }, { Key: "8", Text: "8" }, { Key: "9", Text: "9" }, { Key: "10", Text: "10" }, { Key: "11", Text: "11" }
    , { Key: "12", Text: "12" }, { Key: "13", Text: "13" }, { Key: "14", Text: "14" }, { Key: "15", Text: "15" }, { Key: "16", Text: "16" }, { Key: "17", Text: "17" }
    , { Key: "18", Text: "18" }, { Key: "19", Text: "19" }, { Key: "20", Text: "20" }, { Key: "21", Text: "21" }, { Key: "22", Text: "22" }, { Key: "23", Text: "23" }
    , { Key: "24", Text: "24" }, { Key: "25", Text: "25" }, { Key: "26", Text: "26" }, { Key: "27", Text: "27" }, { Key: "28", Text: "28" }, { Key: "29", Text: "29" }
    , { Key: "30", Text: "30" }, { Key: "31", Text: "31" }];
    cfi.AutoCompleteByDataSource("Month", funMonth, null, null);
    fnSetEmail()
    FnNotAllowedEnterKey()

}

$(document).on('click', '#chcitycountry', function (e) {
    if ($('.chcitycountry').is(':checked')) {
        $("#lblCityCountry").text("City:");
    } else {
        $("#lblCityCountry").text("Country:");
    }

});

$(document).on('keyup', '.timevlaidate', function (e) {
    if ($('.chcitycountry').is(':checked')) {
        $("#lblCityCountry").text("City:");
    } else {
        $("#lblCityCountry").text("Country:");
    }

});


function OnChange() {

    if ($("#Text_Occurs").val().trim().toUpperCase() == "HOURLY".trim().toUpperCase()) {
        $("#lblOccurs").text("Hourly:")
        $("#DivHours").css("display", "block")
        $("#DivDaily").css("display", "none")
        $("#DivWeeks").css("display", "none")
        $("#DivMonth").css("display", "none")

    } else if ($("#Text_Occurs").val().trim().toUpperCase() == "DAILY".trim().toUpperCase()) {
        $("#lblOccurs").text("Daily:")
        $("#DivHours").css("display", "none")
        $("#DivDaily").css("display", "block")
        $("#DivWeeks").css("display", "none")
        $("#DivMonth").css("display", "none")
    } else if ($("#Text_Occurs").val().trim().toUpperCase() == "WEEKLY".trim().toUpperCase()) {
        $("#lblOccurs").text("Weekly:")
        $("#DivHours").css("display", "none")
        $("#DivDaily").css("display", "none")
        $("#DivWeeks").css("display", "block")
        $("#DivMonth").css("display", "none")

    } else if ($("#Text_Occurs").val().trim().toUpperCase() == "MONTHLY".trim().toUpperCase()) {
        $("#lblOccurs").text("Monthly:")
        $("#DivHours").css("display", "none")
        $("#DivDaily").css("display", "none")
        $("#DivWeeks").css("display", "none")
        $("#DivMonth").css("display", "block")
    }

}
function FnNotAllowedEnterKey() {
    $("body").keydown(function (e) {
        var addlen = $("#txtEmail").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
}
function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}
function fnSetEmail() {
    $("#txtEmail").keyup(function (e) {
        var addlen = $("#txtEmail").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            var finalValue = addlen.substring(0, addlen.length - 1);
            if (ValidateEMail(finalValue)) {
                if ($("ul#addlist1 li").length < 3) {
                    var listlen = $("ul#addlist1 li").length;
                    $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + finalValue + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                }
                else {
                    ShowMessage('warning', 'Warning - SCM', "Maximum 3 E-mail Addresses allowed.");
                }
                $("#txtEmail").val('');
            }
            else {
                ShowMessage('warning', 'Warning - SCM', "Enter valid Email address.");
                return;
            }
        }
        else
            e.preventDefault();
    });
    $("#txtEmail").blur(function () {
        $("#txtEmail").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });

}
function ExtraCondition(textId) {

    var filter = cfi.getFilter("AND");
    if (textId == "Text_CityCountry") {

        if ($('.chcitycountry').is(':checked')) {
            cfi.setFilter(filter, "ctype", "eq", 1)
        } else {
            cfi.setFilter(filter, "ctype", "eq", 0)
        }
        var CityCountry = cfi.autoCompleteFilter([filter]);
        return CityCountry;
    }

    if (textId == "Text_Process") {


        cfi.setFilter(filter, "Module", "eq", 'EmailAlerts')
        var Process = cfi.autoCompleteFilter([filter]);
        return Process;
    }
}

function PutHyphenINTimeDail() {
    var x = $("#Text_Daily").val();
    if (x.length == 2) {
        $("#Text_Daily").val($("#Text_Daily").val() + ":");
    }

}
function CheckTimeFormatDail() {
    if ($("#Text_Daily").val() != '') {
        var x = $("#Text_Daily").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (x.charAt(0) == 0) {

                }
                else if (firstno >= 4 && x.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        var Text_Daily = $("#Text_Daily").val();
        var Time = Text_Daily.split(":")[1]
        if (parseInt(Time) > 59) {
            $("#Text_Daily").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }
        if (value == 1 || x.length != 5 || $("#Text_Daily").val().search(':') == -1) {
            $("#Text_Daily").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }

    }
}

function PutHyphenINTimeWeeks() {
    var x = $("#Text_Weeks").val();
    if (x.length == 2) {
        $("#Text_Weeks").val($("#Text_Weeks").val() + ":");
    }

}
function CheckTimeFormatWeeks() {
    if ($("#Text_Weeks").val() != '') {
        var x = $("#Text_Weeks").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (x.charAt(0) == 0) {

                }
                else if (firstno >= 4 && x.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        var Text_Daily = $("#Text_Weeks").val();
        var Time = Text_Daily.split(":")[1]
        if (parseInt(Time) > 59) {
            $("#Text_Weeks").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }
        if (value == 1 || x.length != 5 || $("#Text_Weeks").val().search(':') == -1) {
            $("#Text_Weeks").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }

    }
}

function PutHyphenINTimeMonthTime() {
    var x = $("#Text_MonthTime").val();
    if (x.length == 2) {
        $("#Text_MonthTime").val($("#Text_MonthTime").val() + ":");
    }

}
function CheckTimeFormatMonthTime() {
    if ($("#Text_MonthTime").val() != '') {
        var x = $("#Text_MonthTime").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (x.charAt(0) == 0) {

                }
                else if (firstno >= 4 && x.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        var Text_Daily = $("#Text_MonthTime").val();
        var Time = Text_Daily.split(":")[1]
        if (parseInt(Time) > 59) {
            $("#Text_MonthTime").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }
        if (value == 1 || x.length != 5 || $("#Text_MonthTime").val().search(':') == -1) {
            $("#Text_MonthTime").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }

    }
}
function SaveEmailAlerts() {

    var final = '';
    if ($('#Airline').val() == '' || $('#Airline').val() == "0") {
        ShowMessage('warning', 'Warning', "Please Select Airline!", "bottom-right");
        return false;
    }
    if ($('#Process').val() == '' || $('#Process').val() == "0") {
        ShowMessage('warning', 'Warning', "Please Select Process!", "bottom-right");
        return false;
    }
    var CityCountryType = "";
    if ($('.chcitycountry').is(':checked')) {
        CityCountryType = "0";
        if ($('#CityCountry').val() == '' || $('#CityCountry').val() == "0") {
            ShowMessage('warning', 'Warning', "Please Select City !", "bottom-right");
            return false;
        }
    } else {
        CityCountryType = "1";
        if ($('#CityCountry').val() == '' || $('#CityCountry').val() == "0") {
            ShowMessage('warning', 'Warning', "Please Select Country!", "bottom-right");
            return false;
        }
    }
    if ($('#Occurs').val() == '' || $('#Occurs').val() == "0") {
        ShowMessage('warning', 'Warning', "Please Select Occurs!", "bottom-right");
        return false;
    }
    if ($('#Text_Occurs').val() == 'WEEKLY') {


        $('.multichech:checked').each(function () {
            var values = $(this).val();
            final += values + ',';
        });

        if (final == '' || final == "0") {
            ShowMessage('warning', 'Warning', "Please Select Weeks !", "bottom-right");
            return false;
        }

        if ($('#Text_Weeks').val() == '' || $('#Text_Weeks').val() == "0") {
            ShowMessage('warning', 'Warning', "Please enter time !", "bottom-right");
            return false;
        }
    } else if ($('#Text_Occurs').val() == 'HOURLY') {
        if ($('#Hours').val() == '' || $('#Hours').val() == "0") {
            ShowMessage('warning', 'Warning', "Please Select Hours !", "bottom-right");
            return false;
        }
    } else if ($('#Text_Occurs').val() == 'DAILY') {
        if ($('#Text_Daily').val() == '' || $('#Text_Daily').val() == "0") {
            ShowMessage('warning', 'Warning', "Please enter time !", "bottom-right");
            return false;
        }
    } else if ($('#Text_Occurs').val() == 'MONTHLY') {
        if ($('#Month').val() == '' || $('#Month').val() == "0") {
            ShowMessage('warning', 'Warning', "Please Select Month !", "bottom-right");
            return false;
        }
        if ($('#Text_MonthTime').val() == '' || $('#Text_MonthTime').val() == "0") {
            ShowMessage('warning', 'Warning', "Please enter time!", "bottom-right");
            return false;
        }
    }
    var k = ''; var L = '';

    for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
    { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }


    $("#hdnmail").val(L.substring(0, L.length - 1));

    if ($('#hdnmail').val() == '' || $('#hdnmail').val() == "0") {
        ShowMessage('warning', 'Warning', "Please enter email address!", "bottom-right");
        return false;
    }
    var obj = {
        Airline: $('#Airline').val(),
        Process: $('#Process').val(),
        CityCountryType: CityCountryType,
        CityCountry: $('#CityCountry').val(),
        Occurs: $("#Occurs").val(),
        Hours: $('#Hours').val(),
        DailyTime: $('#Text_Daily').val(),
        Weekly: final,
        WeeklyTime: $("#Text_Weeks").val(),
        Month: $("#Month").val(),
        MonthTime: $("#Text_MonthTime").val(),
        EmailAddress: $('#hdnmail').val()
    }
    $.ajax({
        url: "Services/Permissions/EmailAlertService.svc/SaveEmailAlert",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            ShowMessage('success', 'Success!', "Successfully!");
        }
    });
}
function UpdatedEmailAlerts() {
}

