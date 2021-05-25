var FormAction = "";
$(document).ready(function () {
    cfi.ValidateForm();
    BindDetails();
    var tabCalendar = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");

    FormAction = getQueryStringValue("FormAction").toUpperCase()

    if (FormAction == "NEW") {
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liCustom'));
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liHolidayDetails'));
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liWeekOffDetails'));
    }


});
function WeekOffDetailsTab() {

    $("#tblAirlineCCTrans").html("");
    $.ajax({
        url: 'HtmlFiles/ULD/WeekOffDetails.html',
        success: function (result) {
            $("#tblAirlineCCTrans").html("<tr><td>" + result + "<td><tr>");
            if (FormAction == "READ") {
                $("#SaveWeekOffDays").hide()
                $("#Savecustom").hide()
                $("#SaveHoliday").hide()
                $("#HAdd").hide()
                $("#CHAdd").hide()
            }
            if (FormAction != "NEW") {
                GetWeek()
            }

        }
    });


}
function HolidayDetailsTab() {

    $("#tblAirlinePartTrans").html("");

    $.ajax({
        url: 'HtmlFiles/ULD/Holidays.html',
        success: function (result) {
            $("#tblAirlinePartTrans").html("<tr><td>" + result + "<td><tr>")
            if (FormAction == "READ") {
                $("#SaveWeekOffDays").hide()
                $("#Savecustom").hide()
                $("#SaveHoliday").hide()
                $("#HAdd").hide()
                $("#CHAdd").hide()
            }
            $("#txtdate").kendoDatePicker();

            if (FormAction != "NEW") {
                ULDCalendarDetail(2)
            }

        }
    });


}
function CustomTab() {
    $("#tblEventMsgTrans").html("");

    $.ajax({
        url: 'HtmlFiles/ULD/CustomHolidays.html',
        success: function (result) {

            $("#tblEventMsgTrans").html("<tr><td>" + result + "<td><tr>");

            if (FormAction == "READ") {
                $("#SaveWeekOffDays").hide()
                $("#Savecustom").hide()
                $("#SaveHoliday").hide()
                $("#HAdd").hide()
                $("#CHAdd").hide()
            }

            $("#htxtdate").kendoDatePicker();
            if (FormAction != "NEW") {
                ULDCalendarDetail(3)
            }


        }
    });
}
function BindDetails() {
    cfi.AutoCompleteV2("countryname", "SNo,CountryName", "ULD_ChargeCountry", null, "contains", null, null, null, null, UnSelctCountry);
    cfi.AutoCompleteV2("Cityname", "SNo,CityName", "ULD_ChargeCityName", null, "contains");
}
function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_Cityname") {
        try {
            var country = $("#countryname").val()
            cfi.setFilter(filterEmbargo, "CountrySno", "eq", country)
            var ULDTypeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return ULDTypeAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
}
function UnSelctCountry() {
    $("#Text_Cityname").val("")
    $("#Cityname").val("")
}
function OnSaveWeekOffDays() {
    CommomSave(1)
}
function OnSaveHoliday(HolidayType) {
    CommomSave(2)
}
function OnSavecustom(HolidayType) {
    CommomSave(3)
}
function CommomSave(HolidayType) {



    if (getQueryStringValue("RecID").toUpperCase() != "") {

        var WeekOffDays = [];
        var ULDCalendarSNo = getQueryStringValue("RecID").toUpperCase()

        if (HolidayType == "1") {
            $("tr[id^='TblWeekOffDays']").each(function (row, tr) {
                var ID = row + 1;

                var ArrWeekOffDays =
                {
                    CalendarDate: $(tr).find("label[id^='TblWeekOffDays_WeekoffDate_']").text(),
                    WeekDayName: $(tr).find("label[id^='TblWeekOffDays_WeekoffDescription_']").text(),
                    IsActive: $("input[name='TblWeekOffDays_customTabActive_" + ID + "']:checked").val()

                }
                WeekOffDays.push(ArrWeekOffDays);
            });
        } else if (HolidayType == "2") {

            $("#TblHolidaysCreate>tbody>tr").each(function () {

                var ArrWeekOffDays =
                {
                    CalendarDate: $(this).find("td").eq(0).html(),
                    WeekDayName: $(this).find("td").eq(1).html(),
                    IsActive: $(this).find("td").eq(3).html()

                }
                WeekOffDays.push(ArrWeekOffDays);
            });
        } else if (HolidayType == "3") {


            $('#TblHolidaysCreateCustom>tbody>tr').each(function () {
                var ArrWeekOffDays =
                {
                    CalendarDate: $(this).find("td").eq(0).html(),
                    WeekDayName: $(this).find("td").eq(1).html(),
                    IsActive: $(this).find("td").eq(3).html()

                }
                WeekOffDays.push(ArrWeekOffDays);
            });

        }

        $.ajax({
            url: "/Services/ULD/ULDSLACalendarService.svc/UpdateWeekOffDays",
            async: false, type: "POST", dataType: "json", cache: false
            , contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ULDCalendarSNo: ULDCalendarSNo, HolidayType: HolidayType, WeekOffDaysList: WeekOffDays }),
            success: function (response) {
                var Table = jQuery.parseJSON(response).Table0[0];
                var abc = response[0];
                if (jQuery.parseJSON(response).Table0[0].ReturnErrorNo == "0") {
                    ShowMessage('success', 'Success!', "Successfully Insert");
                    ULDCalendarDetail(HolidayType)
                }
                else {
                    ShowMessage('info', '', "", "bottom-right");
                }

            },
            error: function (er) {
            }
        });

    }
}
function WeekOffAdd() {
    ULDCalendarDetail(1);
}
/////
function HolidayAdd() {
    var hactive = "";
    var htr = "";





    if ($("#txtdate").val() == "" || $("#txtdate").val() == "") {

        ShowMessage('info', '', "Please enter holiday  date!	", "bottom-right");
        return
    }
    if ($("#HolidayDescription").val() == "" || $("#HolidayDescription").val() == "0") {

        ShowMessage('info', '', "Please enter holiday description	!	", "bottom-right");
        return
    }
    var Alreadyexists = "";
    $('#TblHolidaysCreate>tbody>tr').each(function () {

        var CalendarDate = $(this).find("td").eq(0).html();
        var WeekDayName = $(this).find("td").eq(1).html();
        if (CalendarDate.toUpperCase().trim() == $("#txtdate").val().toUpperCase().trim() && WeekDayName.toUpperCase().trim() == $("#HolidayDescription").val().toUpperCase().trim()) {
            ShowMessage('info', '', "Already exists !", "bottom-right");
            Alreadyexists = "1";
            $("#HolidayDescription").val("")
        }

    });

    hactive = $('input[name=hactive]:checked').val();

    var trid = parseInt($("#TblHolidaysCreate>tbody>tr").length + 1);

    if (Alreadyexists != "1") {
        if (jQuery("#TblHolidaysCreate>tbody>tr").length == "0") {
            htr += '<tr id="Delre_' + trid + '">'
            htr += '<td >' + $("#txtdate").val() + '</td>'
            htr += '<td >' + $("#HolidayDescription").val() + '</td>'
            htr += '<td id="tdHolidays_' + trid + '">'
            if (hactive == 'true') {
                htr += '<input  class="IsActiveHoliday1"  name="hactive_' + trid + '" onclick="IsActiveHCustome(' + trid + ')" checked="checked"  value="true" type="radio" id="hActiv_' + trid + '" /> Yes'
                htr += '<input  class="IsActiveHoliday2" value="false" type="radio" onclick="IsActiveHCustome(' + trid + ')" name="hactive_' + trid + '" id="hActiv_' + trid + '" /> No'
            } else {
                htr += '<input class="IsActiveHoliday1" name="hactive_' + trid + '" onclick="IsActiveHCustome(' + trid + ')" checked="checked" value="true" type="radio" id="hActiv_' + trid + '" /> Yes'
                htr += '<input class="IsActiveHoliday2"  value="false" type="radio" onclick="IsActiveHCustome(' + trid + ')" name="hactive_' + trid + '" id="hActiv_' + trid + '" /> No'
            }
            htr += '</td>'
            htr += '<td id="IsActiveHCustome_' + trid + '" style="display:none">' + hactive + '</td>'
            htr += '<td id="tdHolidays' + trid + '"><input type="button" id="Add" class="btn btn-inverse" value="Delete" onclick="HolidaysDeleteRow(' + trid + ')" /></td></tr>'
            jQuery("#TblHolidaysCreate>tbody").html(htr);
        } else {
            htr += '<tr id="Delre_' + trid + '">'
            htr += '<td >' + $("#txtdate").val() + '</td>'
            htr += '<td >' + $("#HolidayDescription").val() + '</td>'
            htr += '<td id="tdHolidays_' + trid + '">'
            if (hactive == 'true') {
                htr += '<input class="IsActiveHoliday1" name="hactive_' + trid + '" onclick="IsActiveHCustome(' + trid + ')" checked="checked"  value="true" type="radio" id="hActiv_' + trid + '" /> Yes'
                htr += '<input class="IsActiveHoliday2" value="false" type="radio" onclick="IsActiveHCustome(' + trid + ')" name="hactive_' + trid + '" id="hActiv_' + trid + '" /> No'
            } else {
                htr += '<input class="IsActiveHoliday1" name="hactive_' + trid + '"  onclick="IsActiveHCustome(' + trid + ')" value="true" type="radio" id="hActiv_' + trid + '" /> Yes'
                htr += '<input  class="IsActiveHoliday2" value="false" type="radio" onclick="IsActiveHCustome(' + trid + ')" checked="checked" name="hactive_' + trid + '" id="hActiv_' + trid + '" /> No'
            }
            htr += '</td>'
            htr += '<td id="IsActiveHCustome_' + trid + '" style="display:none">' + hactive + '</td>'
            htr += '<td id="tdHolidays' + trid + '"><input type="button" id="Add" class="btn btn-inverse" value="Delete" onclick="HolidaysDeleteRow(' + trid + ')" /></td></tr>'
            jQuery("#TblHolidaysCreate>tbody:last").append(htr);
        }
        $("#HolidayDescription").val("")
    }
}
function CustomHolidayAdd() {

    var hactive = "";
    var htr = "";
    if ($("#htxtdate").val() == "" || $("#htxtdate").val() == "") {
        ShowMessage('info', '', "Please enter Custom holiday  date!	", "bottom-right");
        return
    }
    if ($("#CustomHolidayDescription").val() == "" || $("#CustomHolidayDescription").val() == "0") {

        ShowMessage('info', '', "Please enter Custom holiday description	!	", "bottom-right");
        return
    }
    hactive = $('input[name=chactive]:checked').val();
    var Alreadyexists = "";
    $('#TblHolidaysCreateCustom>tbody>tr').each(function () {

        var CalendarDate = $(this).find("td").eq(0).html();
        var WeekDayName = $(this).find("td").eq(1).html();
        if (CalendarDate.toUpperCase().trim() == $("#htxtdate").val().toUpperCase().trim() && WeekDayName.toUpperCase().trim() == $("#CustomHolidayDescription").val().toUpperCase().trim()) {
            ShowMessage('info', '', "Already exists !", "bottom-right");
            Alreadyexists = "1";
            $("#CustomHolidayDescription").val("")
        }

    });
    if (Alreadyexists != "1") {

        var trid = parseInt($("#TblHolidaysCreateCustom>tbody>tr").length + 1);
        if (jQuery("#TblHolidaysCreateCustom>tbody>tr").length == "0") {
            htr += '<tr id="CDelre_' + trid + '">'
            htr += '<td >' + $("#htxtdate").val() + '</td>'
            htr += '<td >' + $("#CustomHolidayDescription").val() + '</td>'
            htr += '<td id="ctdHolidays_' + trid + '">'
            if (hactive == 'true') {
                htr += '<input class="IsActiveHCustome1" name="chactive_' + trid + '" onclick="IsActiveCustome(' + trid + ')" checked="checked"  value="true" type="radio" id="chActiv_' + trid + '" /> Yes'
                htr += '<input class="IsActiveHCustome2"  value="false" type="radio" onclick="IsActiveCustome(' + trid + ')" name="chactive_' + trid + '" id="chActiv_' + trid + '" /> No'
            } else {
                htr += '<input class="IsActiveHCustome1" name="chactive_' + trid + '"  onclick="IsActiveCustome(' + trid + ')" value="true" type="radio" id="chActiv_' + trid + '" /> Yes'
                htr += '<input class="IsActiveHCustome2"  value="false" checked="checked" onclick="IsActiveCustome(' + trid + ')" type="radio" name="chactive_' + trid + '" id="chActiv_' + trid + '" /> No'
            }
            htr += '</td>'
            htr += '<td id="IsActiveCustome_' + trid + '" style="display:none">' + hactive + '</td>'
            htr += '<td id="ctdHolidays' + trid + '"><input type="button" id="Add" class="btn btn-inverse" value="Delete" onclick="CustomHolidaysDeleteRow(' + trid + ')" /></td></tr>'
            jQuery("#TblHolidaysCreateCustom>tbody").html(htr);
        } else {
            htr += '<tr id="CDelre_' + trid + '">'
            htr += '<td >' + $("#htxtdate").val() + '</td>'
            htr += '<td >' + $("#CustomHolidayDescription").val() + '</td>'
            htr += '<td id="ctdHolidays_' + trid + '">'
            if (hactive == 'true') {
                htr += '<input class="IsActiveHCustome1" name="chactive_' + trid + '" onclick="IsActiveCustome(' + trid + ')" checked="checked"  value="true" type="radio" id="chActiv_' + trid + '" /> Yes'
                htr += '<input  class="IsActiveHCustome2" value="false" type="radio" onclick="IsActiveCustome(' + trid + ')" name="chactive_' + trid + '" id="chActiv_' + trid + '" /> No'
            } else {
                htr += '<input class="IsActiveHCustome1" name="chactive_' + trid + '" onclick="IsActiveCustome(' + trid + ')"  value="true" type="radio" id="chActiv_' + trid + '" /> Yes'
                htr += '<input  class="IsActiveHCustome2" value="false" checked="checked" onclick="IsActiveCustome(' + trid + ')" type="radio" name="chactive_' + trid + '" id="chActiv_' + trid + '" /> No'
            }
            htr += '</td>'
            htr += '<td id="IsActiveCustome_' + trid + '" style="display:none">' + hactive + '</td>'
            htr += '<td id="ctdHolidays' + trid + '"><input type="button" id="Add" class="btn btn-inverse" value="Delete" onclick="CustomHolidaysDeleteRow(' + trid + ')" /></td></tr>'
            jQuery("#TblHolidaysCreateCustom>tbody:last").append(htr);
        }
        $("#CustomHolidayDescription").val("")
    }
}
///

function ULDCalendarDetail(Type) {
    var GetVal = "";

    var ULDCalendarSNo = getQueryStringValue("RecID").toUpperCase();
    if (ULDCalendarSNo == "") {
        return;
    }

    if (Type == "1") {
        var Dayes = $('.WeekOff:checked').map(function () { return this.value; }).get().join(',')
        if (Dayes == "") {
            ShowMessage('warning', 'Warning', "Select Week Off Days");
            return;
        }
        GetVal = ULDCalendarSNo + '-' + Dayes + '-' + Type;


        $("#TblWeekOffDays").appendGrid({
            tableID: "TblWeekOffDays",
            contentEditable: true,
            isGetRecord: true,
            tableColume: "AirportCode,ULDType,ULDNo,FlightNo",
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 5, whereCondition: GetVal, sort: "",
            servicePath: "./Services/ULD/ULDSLACalendarService.svc",
            getRecordServiceMethod: "GetULDSLACalendarInfomationWeekOff",
            caption: "Week off details",
            initRows: 1,
            columns: [
                {
                    name: 'TabActive', display: 'Active', type: 'hidden', ctrlCss: {},
                },
                  { name: 'WeekoffDate', display: 'Week off Date', type: 'label', ctrlCss: {}, },
                  { name: 'WeekoffDescription', display: 'Week off Description ', type: 'label', ctrlCss: {}, },

                    {
                        name: 'customTabActive', display: 'Active', type: 'custom', ctrlCss: { checked: true }, onChange: function (evt, rowIndex) {



                        },

                        customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                            // Prepare the control ID/name by using idPrefix, column name and uniqueIndex
                            var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;


                            // Create a span as a container
                            var ctrl = document.createElement('span');
                            // Set the ID and name to container and append it to parent control which is a table cell
                            $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                            // Create extra controls and add to container
                            $('<input>', { type: 'radio', id: ctrlId + '_Yes', name: ctrlId }).appendTo(ctrl);
                            $('<input>', { type: 'radio', id: ctrlId + '_No', name: ctrlId }).appendTo(ctrl);
                            $("#" + ctrlId + '_Yes' + "").before("Yes")
                            $("#" + ctrlId + '_No' + "").before("No")
                            // Finally, return the container control
                            return ctrl;
                        },
                    },

            ],
            isPaging: true,
            isExtraPaging: true,
            isPageRefresh: false,
            hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            }, rowUpdateExtraFunction: function (id) {
                ActiveCheckWeekOff()
            },
        });

    } else if (Type == "2") {
        jQuery("#TblHolidaysCreate>tbody").html("");

        $.ajax({
            url: "/Services/ULD/ULDSLACalendarService.svc/GetULDSLACalendarInfomationHoliDays",
            async: false,
            type: "GET",
            dataType: "json",
            data: { ULDCalendarSNo: ULDCalendarSNo, HolidayType: Type },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                var FinalData = ResultData.Table0;
                var htr = "";
                var capsChange = "";
                if (FinalData.length > 0) {
                    for (var i = 0; i < FinalData.length; i++) {
                        var IsActive = FinalData[i].IsActive
                        var trid = i + 1;
                        htr += '<tr id="Delre_' + trid + '">'
                        htr += '<td >' + FinalData[i].HolidayDate + '</td>'
                        htr += '<td >' + FinalData[i].HolidayWeekDay + '</td>'
                        htr += '<td id="tdHolidays_' + trid + '">'
                        if (IsActive == 'True') {
                            capsChange = "true"
                            htr += '<input class="IsActiveHoliday1" name="hactive_' + trid + '" onclick="IsActiveHCustome(' + trid + ')" checked="checked"  value="true" type="radio" id="hActiv_' + trid + '" /> Yes'
                            htr += '<input class="IsActiveHoliday2"  value="false" type="radio" onclick="IsActiveHCustome(' + trid + ')" name="hactive_' + trid + '" id="hActiv_' + trid + '" /> No'
                        } else if (IsActive == 'False') {
                            htr += '<input class="IsActiveHoliday1" name="hactive_' + trid + '" onclick="IsActiveHCustome(' + trid + ')"  value="true" type="radio" id="hActiv_' + trid + '" /> Yes'
                            htr += '<input class="IsActiveHoliday2" value="false" checked="checked" onclick="IsActiveHCustome(' + trid + ')" type="radio" name="hactive_' + trid + '" id="hActiv_' + trid + '" /> No'
                            capsChange = "false"
                        }
                        htr += '<td id="IsActiveHCustome_' + trid + '" style="display:none">' + capsChange + '</td>'
                        // htr += '<td id="tdHolidays' + trid + '"><input type="button" id="Add" class="btn btn-inverse" value="Delete" onclick="HolidaysDeleteRow(' + trid + ')" /></td>
                        htr += ' </tr>'

                    }
                    jQuery("#TblHolidaysCreate>tbody").html(htr);
                }

            }
        });


    } else if (Type == "3") {
        jQuery("#TblHolidaysCreateCustom>tbody").html("");
        $.ajax({
            url: "/Services/ULD/ULDSLACalendarService.svc/GetULDSLACalendarInfomationHoliDays",
            async: false,
            type: "GET",
            dataType: "json",
            data: { ULDCalendarSNo: ULDCalendarSNo, HolidayType: Type },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                var FinalData = ResultData.Table0;
                var htr = "";
                var capsChange = "";
                if (FinalData.length > 0) {
                    for (var i = 0; i < FinalData.length; i++) {
                        var IsActive = FinalData[i].IsActive
                        var trid = i + 1;
                        htr += '<tr id="CDelre_' + trid + '">'
                        htr += '<td >' + FinalData[i].HolidayDate + '</td>'
                        htr += '<td >' + FinalData[i].HolidayWeekDay + '</td>'
                        htr += '<td id="ctdHolidays_' + trid + '">'
                        if (IsActive == 'True') {
                            capsChange = "true"
                            htr += '<input class="IsActiveHCustome1" name="chactive_' + trid + '" onclick="IsActiveCustome(' + trid + ')" checked="checked"  value="true" type="radio" id="chActiv_' + trid + '" /> Yes'
                            htr += '<input class="IsActiveHCustome2" value="false" type="radio" onclick="IsActiveCustome(' + trid + ')" name="chactive_' + trid + '" id="chActiv_' + trid + '" /> No'
                        } else if (IsActive == 'False') {
                            htr += '<input class="IsActiveHCustome1" name="chactive_' + trid + '" onclick="IsActiveCustome(' + trid + ')"  value="true" type="radio" id="chActiv_' + trid + '" /> Yes'
                            htr += '<input class="IsActiveHCustome2" value="false" checked="checked" onclick="IsActiveCustome(' + trid + ')" type="radio" name="chactive_' + trid + '" id="hActiv_' + trid + '" /> No'
                            capsChange = "false"
                        }
                        htr += '</td>'
                        htr += '<td id="IsActiveCustome_' + trid + '" style="display:none">' + capsChange + '</td>'
                        // htr += '<td id="tdHolidays' + trid + '"><input type="button" id="Add" class="btn btn-inverse" value="Delete" onclick="HolidaysDeleteRow(' + trid + ')" /></td>
                        htr += ' </tr>'

                    }
                    jQuery("#TblHolidaysCreateCustom>tbody").html(htr);
                }
            }


        });
    }

}
function IsActiveCustome(id) {

    $("#IsActiveCustome_" + id).html($('input[name=chactive_' + id + ']:checked').val())

}
function IsActiveHCustome() {
    $("#IsActiveHCustome_" + id).html($('input[name=hactive_' + id + ']:checked').val())
}
// Delete Method 
function HolidaysDeleteRow(id) {

    $("#Delre_" + id).remove();
}
function CustomHolidaysDeleteRow(id) {
    $("#CDelre_" + id).remove();


}
function ActiveCheckWeekOff() {



    setTimeout(function () {
        $("input[id^=TblWeekOffDays_TabActive]").each(function () {

            var ind = $(this).attr('id').split('_')[2];
            var Sno = $("#TblWeekOffDays_TabActive_" + ind).val()
            if ($("#TblWeekOffDays_TabActive_" + ind).val() == "true") {
                $("#TblWeekOffDays_customTabActive_" + ind + "_Yes").attr("checked", true);
                $("#TblWeekOffDays_customTabActive_" + ind + "_Yes").attr("value", 'true');
                $("#TblWeekOffDays_customTabActive_" + ind + "_No").attr("value", 'false');
            }
            else {
                $("#TblWeekOffDays_customTabActive_" + ind + "_No").attr("checked", true);
                $("#TblWeekOffDays_customTabActive_" + ind + "_No").attr("value", 'false');
                $("#TblWeekOffDays_customTabActive_" + ind + "_Yes").attr("value", 'true');
            }
        });


    }, 300)
}

function GetWeek() {
    setTimeout(function () {
        var RecID = getQueryStringValue("RecID")
        if (RecID != "0") {
            $.ajax({
                url: "/Services/ULD/ULDSLACalendarService.svc/GetWeek",
                async: false,
                type: "GET",
                dataType: "json",
                data: { SNo: RecID },
                contentType: "application/json; charset=utf-8",
                cache: false,
                success: function (result) {
                    var ResultData = jQuery.parseJSON(result);
                    var FinalData = ResultData.Table0;
                    if (FinalData.length > 0) {

                        for (var i = 0; i < FinalData.length; i++) {
                            if (FinalData[i].HolidayWeekDay == "SUNDAY") {
                                $("#chsun").attr("checked", true)
                            }
                            if (FinalData[i].HolidayWeekDay == "MONDAY") {
                                $("#chMon").attr("checked", true)

                            } if (FinalData[i].HolidayWeekDay == "TUESDAY") {
                                $("#chTue").attr("checked", true)

                            } if (FinalData[i].HolidayWeekDay == "WEDNESDAY") {
                                $("#chWed").attr("checked", true)

                            } if (FinalData[i].HolidayWeekDay == "THURSDAY") {
                                $("#chThu").attr("checked", true)

                            } if (FinalData[i].HolidayWeekDay == "FRIDAY") {
                                $("#chFri").attr("checked", true)

                            } if (FinalData[i].HolidayWeekDay == "SATURDAY") {
                                $("#chSat").attr("checked", true)

                            }
                        }
                        ULDCalendarDetail(1)
                    }

                }
            });
        }
    }, 200)
}

$(document).on('click', '.AllHoliDaysactive', function () {

    if ($(this).val() == "1") {
        $(".IsActiveHoliday1").attr('checked', true)
    } if ($(this).val() == "0") {
        $(".IsActiveHoliday2").attr('checked', true)
    }

});

$(document).on('click', '.AllHoliCustDaysactive', function () {

    if ($(this).val() == "1") {
        $(".IsActiveHCustome1").attr('checked', true)
    } if ($(this).val() == "0") {
        $(".IsActiveHCustome2").attr('checked', true)
    }
});

$(document).on('click', '.AllHoliWeekOffDays', function () {

    if ($(this).val() == "1") {
        $("input[id^=TblWeekOffDays_TabActive]").each(function () {

            var ind = $(this).attr('id').split('_')[2];

            $("#TblWeekOffDays_customTabActive_" + ind + "_Yes").attr("checked", true);
            $("#TblWeekOffDays_customTabActive_" + ind + "_Yes").attr("value", 'true');
            $("#TblWeekOffDays_customTabActive_" + ind + "_No").attr("value", 'false');

        });
    } if ($(this).val() == "0") {
        $("input[id^=TblWeekOffDays_TabActive]").each(function () {

            var ind = $(this).attr('id').split('_')[2];
            $("#TblWeekOffDays_customTabActive_" + ind + "_No").attr("checked", true);
            $("#TblWeekOffDays_customTabActive_" + ind + "_Yes").attr("value", 'true');
            $("#TblWeekOffDays_customTabActive_" + ind + "_No").attr("value", 'false');

        });
    }
});

$(document).on('keypress keyup blur', '#CalendarDesc', function (evt) {
    var keyCode = event.keyCode || event.which
    // Don't validate the input if below arrow, delete and backspace keys were pressed 

    if (keyCode == 8 || keyCode == 44 || keyCode == 40 || keyCode == 47 || keyCode == 61 || keyCode == 34 || keyCode == 41 || keyCode == 32 || keyCode == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        return;
    }
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});

$(document).on('keypress keyup blur', '#HolidayDescription', function (evt) {
    var keyCode = event.keyCode || event.which
    // Don't validate the input if below arrow, delete and backspace keys were pressed 

    if (keyCode == 8 || keyCode == 44 || keyCode == 40 || keyCode == 47 || keyCode == 61 || keyCode == 34 || keyCode == 41 || keyCode == 32 || keyCode == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        return;
    }

    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});

$(document).on('keypress keyup blur', '#CustomHolidayDescription', function (evt) {
    var keyCode = event.keyCode || event.which
    // Don't validate the input if below arrow, delete and backspace keys were pressed 

    if (keyCode == 8 || keyCode == 44 || keyCode == 40 || keyCode == 47 || keyCode == 61 || keyCode == 34 || keyCode == 41 || keyCode == 32 || keyCode == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        return;
    }
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});




