//Javascript file for City Page for binding Autocomplete
var TimeZoneSNo = '';
$(document).ready(function () {
    //$('input[name="operation"]').click(function (e) {
    //    debugger
    //    var SKeyValue = "";
    //    var FormAction = "";
    //    var KeyValue = "";
    //    var TerminalSNo = "";
    //    var TerminalName = "";
    //    var KeyColumn = "CITY";
    //    FormAction = getQueryStringValue("FormAction").toUpperCase();
    //    KeyValue = document.getElementById('__SpanHeader__').innerText;
    //    TerminalSNo = userContext.TerminalSNo;
    //    TerminalName = userContext.NewTerminalName;
    //    Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName);

    //});
    cfi.ValidateForm();
    // cfi.AutoComplete("ZoneSNo", "SNo,ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
    //cfi.AutoComplete("TimeZoneSNo", "SNo,StandardName", "timezonemaster_SVC", "SNo", "StandardName", ["StandardName"], OnSelectProcess, "contains");
    //cfi.AutoComplete("TimeZoneSNo", "SNo,StandardName", "vwtimezone", "SNo", "StandardName", ["StandardName"], OnSelectTimeZoneProcess, "contains");
    cfi.AutoCompleteV2("TimeZoneSNo", "DisplayStandardName", "Master_City_TimeZone", OnSelectTimeZoneProcess, "contains");
    //cfi.AutoComplete("IATAArea", "SNo,IATAAreaName", "CityIataArea", "SNo", "IATAAreaName", ["IATAAreaName"], null, "contains");
    //cfi.AutoComplete("CountrySNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoCompleteV2("CountrySNo", "CountryCode,CountryName", "Master_City_Country", null, "contains");

    //cfi.AutoComplete("ZoneSNo", "SNo,ZoneName", "VZone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
    cfi.AutoCompleteV2("ZoneSNo", "DisplayStandardName", "Master_City_Zone", null, "contains");
    cfi.AutoCompleteByDataSource("IATAArea", IATATYPE);


    //cfi.AutoComplete("SHCSNo", "SNo,Code", "SPHC", "SNo", "Code", ["Code"], null, "contains", ",");
    cfi.AutoCompleteV2("SHCSNo", "DisplayStandardName", "Master_City_SPHC", null, "contains", ",");
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());


    //cfi.AutoComplete("DGClassSNo", "SNo,ClassName", "SPHCClass", "SNo", "ClassName", ["ClassName"], null, "contains", ",");
    cfi.AutoCompleteV2("DGClassSNo", "DisplayStandardName", "Master_City_ClassName", null, "contains", ",");
    cfi.BindMultiValue("DGClassSNo", $("#Text_DGClassSNo").val(), $("#DGClassSNo").val());



    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("input:radio[name='IsDayLightSaving'][value ='1']").prop('checked', true);
        $('#DaylightSaving').attr('readonly', true);
        $("input:radio[name='IsHouse'][value ='1']").prop('checked', true);  // set by default ishouse = no By Arman ali Date : 2017-10-04
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowHideDayLightSaving();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('input[name=PriorApproval][value=1]').attr('checked', true);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('input[name=IsHouse][value=1]').attr('checked', true);
    }

    TimeZoneSNo = $('#TimeZoneSNo').val();


    $('input:radio[name=IsDayLightSaving]').click(function () {
        if ($(this).val() == '0') {
            $('#DaylightSaving').attr('readonly', false);
            //$("#DaylightSaving").show("slow");
            //$('#DaylightSaving').text('Daylight Saving');
            //$("#DaylightSaving").attr("style", "display:none");
            //$('#DaylightSaving').css("display", "block");
        }
        else if ($(this).val() == '1') {
            $('#DaylightSaving').val('');
            $('#DaylightSaving').attr('readonly', true);
        }
    });

    $('#CityCode').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
});
//function Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName) {
//    if (FormAction == "DELETE" || FormAction == "EDIT") {
//        SKeyValue = KeyValue.split(':');
//        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue[1], '', FormAction, TerminalSNo, TerminalName);
//    }
//    else if (FormAction == "NEW") {
//        KeyValue = document.getElementById('CityName').value;
//        SKeyValue = KeyValue.toUpperCase();
//        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue, '', FormAction, TerminalSNo, TerminalName);
//    }
//}

function ShowHideDayLightSaving() {
    if ($('input:radio[name=IsDayLightSaving]:checked').val() == '0') {
        $('#DaylightSaving').attr('readonly', false);
    }
    else if ($('input:radio[name=IsDayLightSaving]:checked').val() == '1') {
        $('#DaylightSaving').attr('readonly', true);
    }
}

function OnSelectTimeZoneProcess(e) {
    TimeZoneSNo = ($("#TimeZoneSNo").val() == "") ? 0 : $("#TimeZoneSNo").val();

    try {
        $.ajax({
            type: "GET",
            url: "./Services/Master/CityService.svc/GetDayLightSavingTime/" + TimeZoneSNo,
            dataType: "json",
            success: function (response) {
                $("#DayLightSaving").val(response.DayLightSaving);
                $("span#DayLightSaving").html(response.DayLightSaving);

                $("#DeltaSeconds").val(response.DeltaSeconds);
                // var a = (response.DeltaSeconds == "0") ? '' : (response.DeltaSeconds + ' Minutes');
                $("span#DeltaSeconds").html(response.DeltaSeconds);
            }
        });
    }
    catch (exp) { }
}