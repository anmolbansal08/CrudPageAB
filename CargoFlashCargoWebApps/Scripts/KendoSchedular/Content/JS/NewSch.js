/// <reference path="../../../references.js" />
var DutyArea;
var SelectedDate = new Date();
var url;
if (location.hostname == "localhost" || location.hostname.toLowerCase() == "saslive.cargoflash.com")
    url = "";
else
    url = "http://" + location.hostname + "/" + window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');

var autoCompleteType = "autocomplete";
var autoCompleteText = "Text";
var autoCompleteKey = "Key";
var attrType = "controltype";
var dateType = "datetype";
var otherType = "OtherType";
var Autourl = url + "/Services/AutoCompleteService.svc/AutoCompleteDataSource";
var InvokeMsg;

function CallMessageBox(msgType, title, msg, position, fadeInTime, fadeOutTime, timeout) {

    if (fadeInTime == undefined)
        fadeInTime = 200;
    if (fadeOutTime == undefined)
        fadeOutTime = 300;
    if (timeout == undefined)
        timeout = 2600;
    if (position == undefined)
        position = "cfMessage-top-right";
    InvokeMsg.options = {
        "debug": false,
        "positionClass": position,
        "onclick": null,
        "fadeIn": fadeInTime,
        "fadeOut": fadeOutTime,
        "timeOut": timeout

    }
    InvokeMsg[msgType](msg, title)
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
var _ExtraCondition = function (textId) {
    if ($.isFunction(window.ExtraCondition)) {
        return ExtraCondition(textId);
    }
}
var GetDataSource = function (textId, tableName, keyColumn, textColumn, templateColumn, procName) {
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

var AutoComplete = function (textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, onSelect) {
    var keyId = textId;
    textId = "Text_" + textId;
    //if (IsValid(textId, autoCompleteType)) {
    if (keyColumn == null || keyColumn == undefined)
        keyColumn = basedOn;
    if (textColumn == null || textColumn == undefined)
        textColumn = basedOn;

    var dataSource = GetDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName);

    $("#" + textId).kendoComboBox({
        filter: (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria),
        dataSource: dataSource,
        select: (onSelect == undefined ? null : onSelect),
        filterField: basedOn,
        separator: (separator == undefined ? null : separator),
        dataTextField: autoCompleteText,
        dataValueField: autoCompleteKey,
        valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
        template: '<span>#: TemplateColumn #</span>',
        addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
        newAllowed: newAllowed,
        confirmOnAdd: confirmOnAdd
    });

    // }
}
$(function () {

    BindEmployeeAutoComplete();
    AutoComplete("Designation", "SNo,Name", "vGetDesignation", "SNo", "Name", null, null, "contains");
    AutoComplete("StaffStatus", "StatusValue,EmpStatus", "vGetStaffStatus", "StatusValue", "EmpStatus", null, null, "contains");
    AutoComplete("DutyArea", "SNo,AreaName", "DutyArea", "SNo", "AreaName", null, null, "contains");
    GetSchedule();
    var start = $("#StartTime").kendoTimePicker({
        format: "HH:mm",
        change: function () {
            var startTime = start.value();
            if (startTime) {
                startTime = new Date(startTime);
                startTime.setMinutes(startTime.getMinutes() + this.options.interval);
            } else {
                $('#StartTime').val('');
            }
        }
    }).data("kendoTimePicker");

    var end = $("#EndTime").kendoTimePicker({
        format: "HH:mm"
    }).data("kendoTimePicker");

    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $('a[data-modal-id]').click(function (e) {
        e.preventDefault();
        $("body").append(appendthis);
        $(".modal-overlay").fadeTo(500, 0.7);
        var modalBox = $(this).attr('data-modal-id');
        $('#' + modalBox).fadeIn($(this).data());
        GetDutyAreaName();
    });

    $(".js-modal-close, .modal-overlay").click(function () {
        $(".modal-box, .modal-overlay").fadeOut(500, function () {
            $(".modal-overlay").remove();
        });
    });



    $("#divMainContent").find("input[type=text]").change(function () {
        if ($(this).attr("id") != "Text_Employee_input" && $(this).attr("id") != "Text_Employee" && $(this).attr("id") != "StartTime" && $(this).attr("id") != "EndTime") {
            if ($("#Text_Employee").data("kendoComboBox")) {
                $("#Text_Employee").data("kendoComboBox").value('');
                $("#Text_Employee").data("kendoComboBox").destroy();
                $("#Employee").val("");
                BindEmployeeAutoComplete();
            }
        }
        GetSchedule();
    });

    $("#aClearFilter").click(function (e) {
        //$("#Text_StaffStatus").data("kendoComboBox").value('');
        //$("#Text_Designation").data("kendoComboBox").value('');
        //$("#Text_Employee").data("kendoComboBox").value('');
        //$("#Text_DutyArea").data("kendoComboBox").value('');
        //$("#StartTime").data("kendoTimePicker").value('');
        //$("#EndTime").data("kendoTimePicker").value('');
        //$("#divMainContent").find("input[type=text],input[type=hidden]").val("");
        ////SelectedDate = new Date();
        //GetSchedule();
        location.reload();
    });
});
function BindEmployeeAutoComplete() {
    var dt = kendo.toString(SelectedDate, "MM-dd-yyyy");
    var StartDate = dt + " 00:00";
    var EndDate = dt + " 23:59";
    CustomAutoComplete("Employee", "Name", null, "SNo", "Name", null, null, "contains", null, null, null, "spResource_EmployeeCurrentStatus", null, $("#StaffStatus").val(), $("#Designation").val(), $("#DutyArea").val(), StartDate, EndDate);
}
$(window).resize(function () {
    $(".modal-box").css({
        top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
        left: ($(window).width() - $(".modal-box").outerWidth()) / 2
    });
});

$(window).resize();

function GetDutyAreaName() {
    $.ajax({
        url: url + "/Services/Roster/RosterResourceAllocationService.svc/GetDutyAreaName",
        async: false,
        type: "get",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var dutyAreaData = $.parseJSON(data);
            if (dutyAreaData.Table0 != undefined && dutyAreaData.Table0.length > 0) {
                var dutyAreaList = dutyAreaData.Table0;
                $("#divDutyAreaName").html('');
                for (var i = 0; i < dutyAreaList.length; i++) {
                    $("#divDutyAreaName").append("<table><tr><th style='width:20px;'>" + parseInt(i + 1) + ') </th><td style="height:5px;width:80px;background-color:' + dutyAreaList[i].ColorCode + '"/><td>' + dutyAreaList[i].DutyAreaName + '</td>' + "</td></tr></table>");
                }
            }
        }
    });
}

function scheduler_remove(e) {
    if ((e.event.punchOutTime == "" || e.event.punchOutTime == null) && e.event.punchInTime == "" || e.event.punchInTime == null) {
        CallMessageBox("success", "", "Day's shift has been successfully deleted.");
        return false;
    }
    else {
        CallMessageBox("info", "", "Day's shift can not be deleted.");
        return true;
    }
}
function addMinutes(time, minsToAdd) {
    function z(n) {
        return (n < 10 ? '0' : '') + n;
    }
    var bits = time.split(':');
    var mins = bits[0] * 60 + (+bits[1]) + (+minsToAdd);

    return z(mins % (24 * 60) / 60 | 0) + ':' + z(mins % 60);
}

function GetSchedule() {
    $("#spnCount").text('');

    var start = ($("#StartTime").val() == "") ? '00:00' : $("#StartTime").val();
    var end = ($("#EndTime").val() == "") ? '23:59' : $("#EndTime").val();
    if (start.indexOf(':30') != -1) {
        start = addMinutes(start, -30)
    }
    if (end.indexOf(':30') != -1) {
        end = addMinutes(end, 30)
    }
    if ($("#scheduler").data("kendoScheduler"))
        $("#scheduler").data("kendoScheduler").destroy();
    var startdate = kendo.toString(SelectedDate, "MM-dd-yyyy");

    var obj = {
        Employee: $("#Employee").val() || "",
        DutyArea: $("#DutyArea").val() || "",
        Designation: $("#Designation").val() || "",
        StartDate: startdate + " " + start,
        EndDate: startdate + " " + end,
        StaffStatus: $("#StaffStatus").val() || ""
    }
    DutyArea = new kendo.data.DataSource({
        transport: {
            read: {
                url: url + "/Services/Roster/RosterResourceAllocationService.svc/GetDutyArea",
                async: false, type: "POST", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
            }
        }
    });

    $("#scheduler").html('').kendoScheduler({
        dateHeaderTemplate: kendo.template("<strong>#=kendo.toString(date, 'dd-MMM-yyyy')#</strong>"),
        selectedDateFormat: "{0:dd-MMM-yyyy} - {1:dd-MMM-yyyy}",
        date: SelectedDate,
        startTime: new Date("2015/11/30 " + start + ":00"),
        endTime: new Date("2015/11/30 " + end + ":00"),
        editable: {
            template: $("#schedulerTemplate").html(),
            confirmation: "Are you sure you want to delete this Shift ?"
        },
        type: "odata",
        navigate: function (f) {
            if (f.action == 'changeDate' || f.action == "previous" || f.action == "next") {
                SelectedDate = f.date;
                if ($("#Text_Employee").data("kendoComboBox")) {
                    $("#Text_Employee").data("kendoComboBox").value('');
                    $("#Text_Employee").data("kendoComboBox").destroy();
                    $("#Employee").val("");
                    BindEmployeeAutoComplete();
                }
                GetSchedule();
            }
        },
        eventHeight: 20,
        majorTick: 60,
        height: "455",
        views: [{ type: "timeline", eventHeight: 30, columnWidth: 20, majorTick: 60, minorTickCount: 2 }, { type: "timelineWeek", eventHeight: 30, columnWidth: 22 }, { type: "timelineMonth", eventHeight: 60, columnWidth: 50 }, "day", "week", "month", { type: "month", eventHeight: 40 }],
        footer: false,
        messages: {
            editor: {
                editorTitle: "Resource Allocation"
            }
        },
        remove: scheduler_remove,
        dataBound: function () {
            var view = this.view();
            var events = this.dataSource.view();
            var eventElement;
            var event;
            for (var idx = 0, length = events.length; idx < length; idx++) {
                event = events[idx];
                //get event element
                eventElement = view.element.find("[data-uid=" + event.uid + "]");
                eventElement.css("background-color", event.Color);
                var name = $("ul.k-scheduler-views").find(".k-state-selected").attr("data-name");
                //Added by Amit Yadav
                if (name == 'timeline' || name == 'timelineWeek' || name == 'timelineMonth')
                    eventElement.css("height", $(".k-scheduler-content").find("table tr:eq(0)").height() - 3 + "px").css("min-width", "20px");

                if (name == 'week' || name == 'day')
                    eventElement.css("width", $(".k-scheduler-content").find(".k-scheduler-table tr td:eq(0)").width() + 8 + "px");
                if (name == 'month')
                    eventElement.css("height", $(".k-scheduler-content").find(".k-scheduler-table tr td:eq(0)").height() - 11 + "px");

            }
            //if ($("Text_StaffStatus_input").val() && $("Text_Designation_input").val() && $("Text_Employee_input").val() && $("Text_DutyArea_input").val() && $("StartTime").val() && $("EndTime").val()) {
            //    $("#spnCount").text("Resources Count : " + $("div[role='gridcell']").length);

            //} else {
            //    $("#spnCount").text("Resources Count : " + $(".k-event-delete").length);

            //}
            $("#spnCount").text("Resources Count : " + $(".k-event-delete").length);
        },
        dataSource: {
            batch: true,
            sync: function () {
                this.read();
            },
            transport: {
                read: {
                    url: url + "/Services/Roster/RosterResourceAllocationService.svc/GetAllocatedDuty?employee=" + obj.Employee + "&designation=" + obj.Designation +
                                "&dutyArea=" + obj.DutyArea + "&start=" + obj.StartDate + "&end=" + obj.EndDate + "&staffStatus=" + obj.StaffStatus,
                    async: true, type: "POST", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                },
                update: {
                    url: url + "/Services/Roster/RosterResourceAllocationService.svc/SaveAllocation",
                    async: false,
                    type: "POST", dataType: "json",
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                },
                create: {
                    url: url + "/Services/Roster/RosterResourceAllocationService.svc/SaveAllocation",
                    async: false,
                    type: "POST", dataType: "json",
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                },
                destroy: {
                    url: url + "/Services/Roster/RosterResourceAllocationService.svc/DeleteAllocation",
                    async: false,
                    type: "POST", dataType: "json",
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options) {
                        var index = options.models.length;
                        index = index - 1;
                        var taskModel = options.models[index];
                        var SchedulerModel = {
                            MeetingID: taskModel.MeetingID,
                            Attendees: taskModel.Attendees,
                            Description: taskModel.Description,
                            Start: dateToWcfFormat(taskModel.Start),
                            End: dateToWcfFormat(taskModel.End),
                            IsAllDay: taskModel.IsAllDay,
                            ReportingShiftTime: $("input[name='rd']:checked").val() == "false" ? 0 : 1,
                            DutyAreaSNo: taskModel.DutyArea.SNo,
                        }
                        if (operation !== "read" && options.models) {
                            return JSON.stringify({ models: SchedulerModel });
                        }
                    }
                }
            },
            schema: {
                errors: function (response) {
                    if (response.length > 0) {
                        if (response[0].Error) {
                            CallMessageBox("warning", "", response[0].Error);
                        }
                        if (response[0].Status == "Save1" && response[0].Result == "Success") {
                            return response[0].Result;
                        }
                    }
                },
                model: {
                    id: "meetingID",
                    fields: {
                        meetingID: { from: "MeetingID", type: "number" },
                        title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                        start: { type: "date", from: "Start" },
                        end: { type: "date", from: "End" },
                        startTimezone: { from: "StartTimezone" },
                        endTimezone: { from: "EndTimezone" },
                        description: { from: "Description" },
                        punchInTime: { type: "date", from: "PunchInTime", nullable: true },
                        punchOutTime: { type: "date", from: "PunchOutTime", nullable: true },
                        isdisabled: { type: "boolean", from: "isdisabled" },
                        attendees: { from: "Attendees", nullable: true },
                        isAllDay: { type: "boolean", from: "IsAllDay" },
                        reportingShiftTime: { type: "boolean", from: "ReportingShiftTime" }
                    }
                }
            },

            error: function (e) {
                CallMessageBox("error", "", e.errorThrown);
                e.preventDefault();
            }
        },
        group: {
            resources: ["Attendees"],
            orientation: "vertical"
        },
        resources: [
            {
                field: "attendees",
                name: "Attendees",
                dataSource: {
                    type: "json",
                    transport:
                    {
                        read: {
                            url: url + "/Services/Roster/RosterResourceAllocationService.svc/GetEmployee?employee=" + obj.Employee + "&designation=" + obj.Designation +
                                "&dutyArea=" + obj.DutyArea + "&start=" + obj.StartDate + "&end=" + obj.EndDate + "&staffStatus=" + obj.StaffStatus,
                            async: true, type: "POST", dataType: "json", cache: false,
                            contentType: "application/json; charset=utf-8",
                        }
                    }
                },
                multiple: true,
                title: "Attendees"
            }
        ]
    });
    $('li.k-view-month').hide();

}

function dateToWcfFormat(dateString) {
    var date = new Date(dateString);
    var parsedDate = '\/Date(' + date.getTime() + '-0000)\/';
    return parsedDate;
}
(function ($, kendo) {
    //Extending the Grid build in validator
    $.extend(true, kendo.ui.validator, {
        rules: {
            // Add custom validation rule to validate
            //description field
            datevalid: function (input, params) {
                if (input.is("[name='start']")) {
                    var start = new Date($("#start").val());
                    var end = new Date($("#end").val());
                    if (end <= start) {
                        return false;
                    } else {
                        return true;
                    }
                }
                //check for the rule attribute 
                return true;
            }
        },
        messages: { //custom rules messages
            datevalid: function (input) {
                // return the message text
                return "End date time should be greater than start date time";
            }
        }
    });
})(jQuery, kendo);


var Locationurl = url + "/Services/AutoCompleteService.svc/AutoCompleteResourceEmployee";

function CustomAutoComplete(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, staffStatus, degination, dutyarea, start, end, onSelect) {
    var keyId = textId;
    textId = "Text_" + textId;
    $("div[id^='" + textId + "-list']").remove();

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetLocationAutoCompleteDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName, Locationurl, staffStatus, degination, dutyarea, start, end, onSelect);

        $("input[type='text'][name='" + textId + "']").kendoComboBox({
            filter: (filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria),
            dataSource: dataSource,
            select: (onSelect == undefined ? null : onSelect),
            filterField: basedOn,
            separator: (separator == undefined ? null : separator),
            dataTextField: autoCompleteText,
            dataValueField: autoCompleteKey,
            valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
            template: '<span>#: TemplateColumn #</span>',
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            newAllowed: newAllowed,
            confirmOnAdd: confirmOnAdd
        });
    }
}

function GetLocationAutoCompleteDataSource(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, staffStatus, degination, dutyarea, start, end) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? url : newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    employee: "",
                    staffStatus: staffStatus,
                    degination: degination,
                    dutyarea: dutyarea,
                    start: start,
                    end: end
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

