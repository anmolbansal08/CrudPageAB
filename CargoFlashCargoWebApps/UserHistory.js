$(document).ready(function ()
{
    cfi.AutoCompleteV2("UserName", "UserName", "UserHistory_UserName", null, "contains");
    setTimeout(function ()
    {
        $("#Text_UserName_input").val("");
        $("#UserName").val("");
    }, 200)
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
            transport: {
                read: {
                    url: "../UserHistory/UserHistoryGetRecord",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    //data: function GetReportData() {
                    data: function () {
                        // Changes By Vipin Kumar
                        //UserSNo = parseInt($('#UserName').val());
                        //Email = $('#Text_Email').val();
                        //objHistory: objHistory;
                        //return { UserSNo: UserSNo, Mail: Mail };
                        return { UserSNo: parseInt($('#UserName').val()), Email: $('#Text_Email').val() };
                        // Ends
                    }
                }, parameterMap: function (options) {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        SNo: { type: "number" },
                        Airline: { type: "string" },
                        UserName: { type: "string" },
                        UserId: { type: "string" },
                        GroupName: { type: "string" },
                        EmailAddress: { type: "string" },
                        CityCode: { type: "string" },
                        NoOfBadAttemps: { type: "string" },
                        LastLoggedOn: { type: "string" },
                        Active: { type: "string" },
                        Blocked: { type: "string" },
                        Created: { type: "string" },
                        Modified: { type: "string" },
                        Deleted: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },
        }),
        detailInit: detailInit,
        //filterable: { mode: 'menu' },
        sortable: true, filterable: true,
        pageable: { refresh: false, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        columns: [

            { field: "Airline", title: "Airline", },
            { field: "UserName", title: "User Name" },
            { field: "UserId", title: "User Id" },
            { field: "GroupName", title: "Group Name" },
            //{ field: "EmailAddress", title: "Email Address" },
            { field: "CityCode", title: "City Code" },
            { field: "NoOfBadAttemps", title: "No Of Bad Attemps" },
            { field: "LastLoggedOn", title: "Last Updated On" },
            { field: "Active", title: "Active" },
            { field: "Blocked", title: "Blocked" },
            { field: "Created", title: "Created" },
            { field: "Modified", title: "Modified" },
            { field: "Deleted", title: "Deleted" }
        ]
    });


});
var UserSNo = "";
var Mail = "";
var WhereCondition = "";
function SearchBlackListAWB() {

    UserSNo = $('#UserName').val();
    Mail = $('#Text_Email').val();

    // $("#BlackListTbl").remove();
    if (UserSNo != "") {
        $('#grid').css('display', 'block')
        $("#grid").data('kendoGrid').dataSource.page(1);
        //$("#grid").data('kendoGrid').dataSource.pageSize(20);
        //$("#grid").data('kendoGrid').dataSource.read();
    }
}
function detailInit(e) {

    $("<div/>").appendTo(e.detailCell).kendoGrid({

        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
            transport: {
                read: {
                    url: "../UserHistory/GetUserHistoryDescription",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: { SNo: e.data.SNo }
                }, parameterMap: function (options) {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    id: "UsersHistorySNo",
                    fields: {
                        CityCode: { type: "string" },
                        CityName: { type: "string" },
                        AirlineName: { type: "string" },
                        IsDefaultCity: { type: "string" },
                        Active: { type: "string" },
                        Created: { type: "string" },
                        Modified: { type: "string" }
                    }
                },
                data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        filterable: { mode: 'menu' },
        sortable: true, filterable: true,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        columns:
        [
            { field: "CityCode", title: "City Code" },
            { field: "CityName", title: "City Name" },
            { field: "AirlineName", title: "Airline Name" },
            { field: "IsDefaultCity", title: "IsDefaultCity" },
            { field: "Active", title: "Active" }
            // { field: "Created", title: "Created" },
            //{ field: "Modified", title: "Modified" }
        ]
    });
}