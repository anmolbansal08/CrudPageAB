$(function () {
    GetSchedule();
});
//function BindAllocation() {
//    var emp = [
//                           { text: "ZURAIDI", value: 1, color: "#f8a398" },
//                           { text: "KHAIRULZAMAN", value: 2, color: "#f8a398" },
//                           { text: "MD IZHARUDDIN", value: 3, color: "#f8a398" },
//                           { text: "FINARUL", value: 4, color: "#f8a398" },
//                           { text: "ABD RAHMAN", value: 5, color: "#f8a398" },
//                           { text: "IZZAN", value: 6, color: "#f8a398" },
//                           { text: "MOHD. SAIFUL", value: 7, color: "#f8a398" },
//                           { text: "MUHAMAD SYAWAL", value: 8, color: "#f8a398" },
//                           { text: "MOHD. FAZLI", value: 9, color: "#f8a398" },
//                           { text: "MOHD. HANAFI", value: 10, color: "#f8a398" },
//                           { text: "KHAIRUL HADINATA", value: 11, color: "#f8a398" },
//                           { text: "MOHD. SHAHIZAN", value: 12, color: "blue" }
//    ];

//    var getdata = [
//    {
//        "MeetingID": 43,
//        "RoomID": null,
//        "Attendees": [1],
//        "Title": "8:00 to 11:45",
//        "Description": "haider",
//        "StartTimezone": "",
//        "Start":"\/Date(1448928000000)\/",
//        "End":"\/Date(1448929800000)\/",
//        "EndTimezone": "",
//        "RecurrenceRule": "",
//        "RecurrenceID": null,
//        "RecurrenceException": "",
//        "IsAllDay": false
//    }
//    ];

//    $("#scheduler").kendoScheduler({
//        footer: false,
//        date: new Date(),//new Date("2015/11/20"),
//        startTime: new Date("2015/11/24 08:00:00"),
//        //endTime: new Date("2015/11/20 10:00 AM"),
//        eventHeight: 10,
//        majorTick: 60,
//        views: ["timeline", "day"],
//        toolbar: [{ name: "pdf" }],
//        timezone: "Etc/UTC",
//        dataSource: {
//            batch: true,
//            transport: {
//                read: function (e) {
//                    e.success(getdata);
//                },
//                //read: {
//                //    url: "http://demos.telerik.com/kendo-ui/service/meetings",
//                //    dataType: "jsonp"
//                //},
//                //update: {
//                //    url: "http://demos.telerik.com/kendo-ui/service/meetings/update",
//                //    dataType: "jsonp"
//                //},
//                update: function (e) {
//                    // locate item in original datasource and update it
//                    sampleData[0] = e.data;
//                    // on success
//                    e.success();
//                    // on failure
//                    //e.error("XHR response", "status code", "error message");
//                },
//                create: {
//                    url: "http://demos.telerik.com/kendo-ui/service/meetings/create",
//                    dataType: "jsonp"
//                },
//                destroy: {
//                    url: "http://demos.telerik.com/kendo-ui/service/meetings/destroy",
//                    dataType: "jsonp"
//                },
//                parameterMap: function (options, operation) {
//                    if (operation !== "read" && options.models) {
//                        return { models: kendo.stringify(options.models) };
//                    }
//                }
//            },
//            schema: {
//                model: {
//                    id: "meetingID",
//                    fields: {
//                        meetingID: { from: "MeetingID", type: "number" },
//                        title: { from: "Title", defaultValue: "No title", validation: { required: true } },
//                        start: { type: "date", from: "Start" },
//                        end: { type: "date", from: "End" },
//                        startTimezone: { from: "StartTimezone" },
//                        endTimezone: { from: "EndTimezone" },
//                        description: { from: "Description" },
//                        recurrenceId: { from: "RecurrenceID" },
//                        recurrenceRule: { from: "RecurrenceRule" },
//                        recurrenceException: { from: "RecurrenceException" },
//                        roomId: { from: "RoomID", nullable: true },
//                        attendees: { from: "Attendees", nullable: true },
//                        isAllDay: { type: "boolean", from: "IsAllDay" }
//                    }
//                }
//            }
//        },
//        group: {
//            resources: ["Attendees"],
//            orientation: "vertical"
//        },
//        resources: [

//            {
//                field: "attendees",
//                name: "Attendees",
//                dataSource: emp,

//                multiple: true,
//                title: "Attendees"
//            }
//        ]
//    });
//}

function GetSchedule() {
    $("#scheduler").html('');

        var getdata = [
        {
            "MeetingID": 1,
            "RoomID": null,
            "Attendees": [2],
            "Title": "8:00 to 11:45",
            "Description": "haider",
            "StartTimezone": "",
            "Start":"\/Date(1448928000000)\/",
            "End":"\/Date(1448929800000)\/",
            "EndTimezone": "",
            "RecurrenceRule": "",
            "RecurrenceID": null,
            "RecurrenceException": "",
            "IsAllDay": false
        }
        ];

    $("#scheduler").kendoScheduler({
        date: new Date(),//new Date("2015/11/30"),
        startTime: new Date("2015/11/30 00:00:00"),
        eventHeight: 20,
        majorTick: 60,
        views: ["timeline", "day"],
        toolbar: [{ name: "pdf" }],
        timezone: "Etc/UTC",
        footer: false,
        dataSource: {
            batch: true,
            transport: {
                read: function (e) {
                      e.success(getdata);
                },
                //read: {
                //    url: "http://demos.telerik.com/kendo-ui/service/meetings",
                //    dataType: "jsonp"

                //},
                update: {
                    url: "http://demos.telerik.com/kendo-ui/service/meetings/update",
                    dataType: "jsonp"
                },
                create: {
                    url: "http://demos.telerik.com/kendo-ui/service/meetings/create",
                    dataType: "jsonp",
                    success: function (result) {
                        alert('test');
                    },
                },
                destroy: {
                    url: "http://demos.telerik.com/kendo-ui/service/meetings/destroy",
                    dataType: "jsonp"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }
            },
            schema: {
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
                        recurrenceId: { from: "RecurrenceID" },
                        recurrenceRule: { from: "RecurrenceRule" },
                        recurrenceException: { from: "RecurrenceException" },
                        roomId: { from: "RoomID", nullable: true },
                        attendees: { from: "Attendees", nullable: true },
                        isAllDay: { type: "boolean", from: "IsAllDay" }
                    }
                }
            }
        },
        group: {
            resources: ["Rooms", "Attendees"],
            orientation: "vertical"
        },
        resources: [
            //{
            //    field: "roomId",
            //    name: "Rooms",
            //    dataSource: [
            //        { text: "Meeting Room 101", value: 1, color: "#6eb3fa" },
            //        { text: "Meeting Room 201", value: 2, color: "#f58a8a" }
            //    ],
            //    title: "Room"
            //},
            {
                field: "attendees",
                name: "Attendees",
                //dataSource: emp,
                dataSource: {
                    type: "json",
                    transport:
                    {
                        read: {
                            url: "/Services/Roster/RosterResourceAllocationService.svc/GetEmployee",
                            async: false, type: "POST", dataType: "json", cache: false,
                            contentType: "application/json; charset=utf-8",
                            
                        }
                    }
                },
                multiple: true,
                title: "Attendees"
            }
        ]
    });
    //});
}