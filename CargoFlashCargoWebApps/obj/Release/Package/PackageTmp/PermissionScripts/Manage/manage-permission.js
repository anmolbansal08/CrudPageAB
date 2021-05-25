//Start For Save Data



function SaveForm(formid, datatype, onSuccess) {
    var UserViewModel = {
        SNo: $("#User_SNo").val(),
        IsActive: $("#User_IsActive").is(':checked'),
        IsFound: $("#User_IsFound").is(':checked')
    };
    var UserPageModel = {
        IsCreateSNo: $("#Page_IsCreateSNo").is(':checked'),
        IsEditSNo: $("#Page_IsEditSNo").is(':checked'),
        IsDeleteSNo: $("#Page_IsDeleteSNo").is(':checked'),
        IsReadSNo: $("#Page_IsReadSNo").is(':checked'),
        IsCreate: $("#Page_IsCreate").is(':checked'),
        IsEdit: $("#Page_IsEdit").is(':checked'),
        IsDelete: $("#Page_IsDelete").is(':checked'),
        IsRead: $("#Page_IsRead").is(':checked')
    };
    var groupSNo = $("#hdngroupSNo").val();
    var userSNo = $("#hdnUserSNo").val();

    var PageAccessibilityArray = [];

    $(".k-selectable").find("input[type='checkbox'][id='IsActive']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($(this).attr("SNo") == undefined) {
            if (true) {
                pageObj.SNo = closestTr.find("input[type='hidden'][name$='SNo']").val();
                pageObj.IsActive = closestTr.find("input[type='checkbox'][id='IsActive']").is(":checked");

                if (closestTr.find("input[type='hidden'][name$='IsChildOpen']").val() == 'false') {
                    if (closestTr.find("input[type='hidden'][id$='IsActive_previous']").val() != String(closestTr.find("input[type='checkbox'][id='IsActive']").is(":checked"))) {
                        pageObj.IsFound = true;
                    }
                    else {
                        pageObj.IsFound = false;
                    }
                }
                else {
                    pageObj.IsFound = false;
                }

                //loopsection
                var nextTr = closestTr.next('tr');

                var ChildPageAccessibilityArray = [];
                $(nextTr).find("div.k-grid-content").find("tr").each(function () {
                    var childPageObj = {};

                    if (parseInt(groupSNo) != 0) {
                        childPageObj.IsCreate = $(this).find("input[type='checkbox'][id$='chkCreate']").is(":checked");
                        childPageObj.IsCreateSNo = $(this).find("input[type='hidden'][name$='SNo1']").val();
                        childPageObj.IsEdit = $(this).find("input[type='checkbox'][id$='chkEdit']").is(":checked");
                        childPageObj.IsEditSNo = $(this).find("input[type='hidden'][name$='SNo2']").val();
                        childPageObj.IsDelete = $(this).find("input[type='checkbox'][id$='chkDelete']").is(":checked");
                        childPageObj.IsDeleteSNo = $(this).find("input[type='hidden'][name$='SNo3']").val();
                        childPageObj.IsRead = $(this).find("input[type='checkbox'][id$='chkRead']").is(":checked");
                        childPageObj.IsReadSNo = $(this).find("input[type='hidden'][name$='SNo4']").val();
                    }
                    else {

                        if ($(this).find("input[type='hidden'][id$='chkCreate_previous']").val() != String($(this).find("input[type='checkbox'][id='chkCreate']").is(":checked"))) {

                            childPageObj.IsCreate = $(this).find("input[type='checkbox'][id$='chkCreate']").is(":checked");
                            childPageObj.IsCreateSNo = $(this).find("input[type='hidden'][name$='SNo1']").val();
                        }

                        if ($(this).find("input[type='hidden'][id$='chkEdit_previous']").val() != String($(this).find("input[type='checkbox'][id='chkEdit']").is(":checked"))) {
                            childPageObj.IsEdit = $(this).find("input[type='checkbox'][id$='chkEdit']").is(":checked");
                            childPageObj.IsEditSNo = $(this).find("input[type='hidden'][name$='SNo2']").val();
                        }

                        if ($(this).find("input[type='hidden'][id$='chkDelete_previous']").val() != String($(this).find("input[type='checkbox'][id='chkDelete']").is(":checked"))) {
                            childPageObj.IsDelete = $(this).find("input[type='checkbox'][id$='chkDelete']").is(":checked");
                            childPageObj.IsDeleteSNo = $(this).find("input[type='hidden'][name$='SNo3']").val();
                        }

                        if ($(this).find("input[type='hidden'][id$='chkRead_previous']").val() != String($(this).find("input[type='checkbox'][id='chkRead']").is(":checked"))) {
                            childPageObj.IsRead = $(this).find("input[type='checkbox'][id$='chkRead']").is(":checked");
                            childPageObj.IsReadSNo = $(this).find("input[type='hidden'][name$='SNo4']").val();
                        }
                    }

                    ChildPageAccessibilityArray.push(childPageObj);

                });
                pageObj.ChildPage = ChildPageAccessibilityArray;

                //
                PageAccessibilityArray.push(pageObj);
            }
        }
    });

    if (PageAccessibilityArray.length == 0) {
        ShowMessage('warning', 'Information!', "Define page accessibility");
        return;
    }

    $.ajax({
        url: "Services/Permissions/PermissionService.svc/GetData", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ UserSNo: userSNo, GroupSNo: groupSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (getQueryStringValue("UserSNo").trim() != "") {
                setTimeout(function () { window.location.href = "Users.aspx?Module=Users&Apps=Users&FormAction=INDEXVIEW&MsgKey=2000"; }, .013 * 60 * 1000);
            }
            else {
                setTimeout(function () { window.location.href = "Users.aspx?Module=Users&Apps=Groups&FormAction=INDEXVIEW&MsgKey=2000"; }, .013 * 60 * 1000);
            }
        }
    });
    return false;
}
//End For Save Data

//Start For Delete User Group
function DeleteUserGroup(formid, datatype, onSuccess) {
    var UserViewModel = {
        GroupSNo: $("#User_GroupSNo").val(),
        UserSNo: $("#User_UserSNo").val()
    };
    var pageSNo = $("#hdnPageSNo").val();
    var PageAccessibilityArray = [];

    $(".k-grid tbody").find("input[type='checkbox'][id='Delete']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($(this).attr("GroupSNo") == undefined) {
            if (this.checked) {
                if (closestTr.find("input[type='hidden'][id='hdnIsGroup']").val() == "true") {
                    pageObj.GroupSNo = closestTr.find("input[type='hidden'][name$='GroupSNo']").val();
                    pageObj.UserSNo = 0;
                }
                else {
                    pageObj.GroupSNo = 0;
                    pageObj.UserSNo = closestTr.find("input[type='hidden'][name$='GroupSNo']").val();
                }
                PageAccessibilityArray.push(pageObj);
            }
        }
    });
    if (PageAccessibilityArray.length == 0) {
        ShowMessage('warning', 'Information!', "Select atleast one item from the list");
        return false;
    }
    $.ajax({
        url: "Services/Permissions/PermissionService.svc/DeletePermission", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ PageSNo: pageSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
        }
    });
}
//End For Delete User Group

//Start For Add Users
function AddUsers() {
    var UserViewModel = {
        UserSNo: $("#User_UserSNo").val()
    };
    var pageSNo = $("#hdnPageSNo").val();
    var PageAccessibilityArray = [];
    $("#tblUser").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if (this.checked) {
            pageObj.UserSNo = closestTr.find("input[type='hidden'][name$='hdncheckSNo']").val();
            PageAccessibilityArray.push(pageObj);
        }
    });
    if (PageAccessibilityArray.length == 0) {
        alert("Select atleast one item from the list.");
        return false;
    }
    $.ajax({
        url: "Services/Permissions/PermissionService.svc/AddUserPermission", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ PageSNo: pageSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            location.href = "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=" + pageSNo + "";
        }
    });
}
//End For Add Users

//Start For Add Groups
function AddGroupUser() {
    var UserViewModel = {
        UserSNo: $("#User_UserSNo").val()
    };
    var groupSNo = $("#hdnGroupSNo").val();
    var PageAccessibilityArray = [];
    $("#tblUsers").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if (this.checked) {
            pageObj.UserSNo = closestTr.find("input[type='hidden'][name$='hdncheckSNo']").val();
            PageAccessibilityArray.push(pageObj);
        }
    });
    if (PageAccessibilityArray.length == 0) {
        alert("Select atleast one item from the list.");
        return false;
    }
    $.ajax({
        url: "Services/Permissions/PermissionService.svc/AddGroupUser", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ GroupSNo: groupSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            location.href = document.URL;
        }
    });
    return true;
}
//End For Add Groups

//Start For Add Groups
function DeleteGroupUser() {
    var UserViewModel = {
        UserSNo: $("#User_UserSNo").val()
    };
    var groupSNo = $("#hdnGroupSNo").val();
    var PageAccessibilityArray = [];
    $("#dvGroupUsers").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if (this.checked) {
            pageObj.UserSNo = closestTr.find("input[type='hidden'][name$='hdncheckSNo']").val();
            PageAccessibilityArray.push(pageObj);
        }
    });
    if (PageAccessibilityArray.length == 0) {
        alert("Select atleast one item from the list.");
        return false;
    }
    $.ajax({
        url: "Services/Permissions/PermissionService.svc/DeleteGroupUser", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ GroupSNo: groupSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            location.href = document.URL;
        }
    });
    return true;
}
//End For Add Groups

//Start For Add Groups
function AddUserGroup() {
    var UserViewModel = {
        GroupSNo: $("#User_GroupSNo").val()
    };
    var userSNo = $("#hdnUserSNo").val();
    var PageAccessibilityArray = [];
    $("#tblGroups").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if (this.checked) {
            pageObj.GroupSNo = closestTr.find("input[type='hidden'][name$='hdncheckSNo']").val();
            PageAccessibilityArray.push(pageObj);
        }
    });
    if (PageAccessibilityArray.length == 0) {
        alert("Select atleast one item from the list.");
        return false;
    }
    $.ajax({
        url: "Services/Permissions/PermissionService.svc/AddUserGroup", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ UserSNo: userSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            location.href = document.URL;      
        }
    });
    return true;
}
//End For Add Groups

//Start For Add Groups
function DeleteUserGroup2() {
    var UserViewModel = {
        GroupSNo: $("#User_GroupSNo").val()
    };
    var userSNo = $("#hdnUserSNo").val();
    var PageAccessibilityArray = [];
    $("#dvUsersGroup").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if (this.checked) {
            pageObj.GroupSNo = closestTr.find("input[type='hidden'][name$='hdncheckSNo']").val();
            PageAccessibilityArray.push(pageObj);
        }
    });
    if (PageAccessibilityArray.length == 0) {
        alert("Define page accessibility.");
        return false;
    }
    $.ajax({
        url: "Services/Permissions/PermissionService.svc/DeleteUserGroup", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ UserSNo: userSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            location.href = document.URL;
        }
    });
    return true;
}
//End For Add Groups

//Start For Show User Popup
function showUserPopup() {
    cfi.PopUp("light1", "Add User");
    $("#light1").parent().css({ "position": "fixed" });
    $("#light1").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    var pageSNo = $("#hdnPageSNo").val();
    $("#tdUser").html($("#hdnUserAdd").val());
    $("#tblUser").html("");
    $("#tdNotFound").hide();
    $("#tdSubmitUser").show();
    $.ajax({
        url: "Permission.aspx/GetListPageUsers", async: true, type: "POST", dataType: "json",
        data: JSON.stringify({ PageSNo: pageSNo }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            $("#tblUser").html(result.d);
        }
    });       
    return false;
}
//End For Show User Popup

function SuccessGrid(total) {
    $("#tblUser").show();    
    $("#tblGroup").show();
    $("#tblGroups").show();
    $("#tblUsers").show();
    $("#tdNotFound").hide();
    $("#tdNotFoundGroup").hide();
    $("#tdNotFoundGroup2").hide();
    $("#tdNotFound2").hide();
}

function resetGrid(total) {
    if ($("#tblUser") != null || $("#tblUser") != undefined) {
        //$("#tblUser").hide();
        $("#tdSubmitUser").hide();
        //$("#tdNotFound").show();
        //$("#tdNotFound").html("<table><tr><td><span style='margin-left: 300px; font-size: 8Pe; color: Red;'>No more user found</span></td></tr></table>");
    }

    if ($("#tblGroup") != null || $("#tblGroup") != undefined) {
        //$("#tblGroup").hide();
        $("#tdSubmitGroup").hide();
        //$("#tdNotFoundGroup").show();
        //$("#tdNotFoundGroup").html("<table><tr><td><span style='margin-left: 300px; font-size: 8Pe; color: Red;'>No more group found</span></td></tr></table>");
    }

    if ($("#tblGroups") != null || $("#tblGroups") != undefined) {
        //$("#tblGroups").hide();
        $("#tdSubmitGroup2").hide();
        //$("#tdNotFoundGroup2").show();
        //$("#tdNotFoundGroup2").html("<table><tr><td><span style='margin-left: 300px; font-size: 8Pe; color: Red;'>No more group found</span></td></tr></table>");
    }

    if ($("#tblUsers") != null || $("#tblUsers") != undefined) {
        //$("#tblUsers").hide();
        $("#tdSubmitUser2").hide();
        //$("#tdNotFound2").show();
        //$("#tdNotFound2").html("<table><tr><td><span style='margin-left: 300px; font-size: 8Pe; color: Red;'>No more user found</span></td></tr></table>");
    }
}

//Start For All User List
function AllUserList() {
    $("#tblUser").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($("#chkAllUserList").is(':checked')) {
            this.checked = true;
        }
        else {
            this.checked = false;
        }
    });
}
//End For All User List

//Start For Show Group Popup
function showGroupPopup() {
    cfi.PopUp("light2", "Add Group");
    $("#light2").parent().css({ "position": "fixed" });
    $("#light2").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    var pageSNo = $("#hdnPageSNo").val();
    $("#tdGroup").html($("#hdnUserAdd").val());
    $("#tblGroup").html("");
    $("#tdNotFoundGroup").hide();
    $("#tdSubmitGroup").show();
    $.ajax({
        url: "Permission.aspx/GetGridPageData", async: true, type: "POST", dataType: "json",
        data: JSON.stringify({ PageSNo: pageSNo }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            $("#tblGroup").html(result.d);
        }
    });    
    return false;
}
//End For Show Group Popup

//Start For Add Groups
function AddGroups() {
    var UserViewModel = {
        GroupSNo: $("#User_GroupSNo").val()
    };
    var pageSNo = $("#hdnPageSNo").val();
    var PageAccessibilityArray = [];
    $("#tblGroup").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if (this.checked) {
            pageObj.GroupSNo = closestTr.find("input[type='hidden'][name$='hdncheckGroupSNo']").val();
            PageAccessibilityArray.push(pageObj);
        }
    });
    if (PageAccessibilityArray.length == 0) {
        alert("Select atleast one item from the list.");
        return false;
    }
    $.ajax({
        url: "Permission.aspx/AddGroupPermission", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ PageSNo: pageSNo, PageAccessibilityList: PageAccessibilityArray }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            location.href = "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=" + pageSNo + "";
        }
    });
    return true;
}
//End For Add Groups

//Start For All Group List
function AllGroupList() {
    $("#tblGroup").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($("#chkAllGroupList").is(':checked')) {
            this.checked = true;
        }
        else {
            this.checked = false;
        }
    });
}
//End For All Group List

//Start for show Group User Popup
function showGroupUserPopup() {
    cfi.PopUp("light3", "Add User");
    $("#light3").parent().css({ "position": "fixed" });
    $("#light3").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    var groupSNo = $("#hdnGroupSNo").val();
    $("#tdGroup").html($("#hdnGroupName").val());
    $("#tblUsers").html("");
    $("#tdNotFound2").hide();
    $("#tdSubmitUser2").show();
    $.ajax({
        url: "Permission.aspx/GetListGroupUsers", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ GroupSNo: groupSNo }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            $("#tblUsers").html(result.d);
        }
    });    
    return false;
}
//End for show Group User Popup

//Start for Bind Group User Popup
$(document).ready(function () {
    if ($("#hdnGroupSNo").val() != "" && $("#hdnGroupSNo").val() !=undefined) {
        var groupSNo = $("#hdnGroupSNo").val();
        $.ajax({
            url: "Permission.aspx/GetListGroupUsers2", async: false, type: "POST", dataType: "json",
            data: JSON.stringify({ GroupSNo: groupSNo }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                $("#dvGroupUsers").html(result.d);
            }
        });
    }
    return false;
});
//End for Bind Group User Popup

//Start For All Group Users List
function AllGroupUserList() {
    $("#dvGroupUsers").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($("#chkAllGroupUserList").is(':checked')) {
            this.checked = true;
        }
        else {
            this.checked = false;
        }
    });
}
//End For All Group Users List

//Start For All Group Users List
function AllGroupUsersList() {
    $("#tblUsers").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($("#chkAllGroupUsersList").is(':checked')) {
            this.checked = true;
        }
        else {
            this.checked = false;
        }
    });
}
//End For All Group Users List

//Start for show Group User Popup
function showUserGroupPopup() {
    cfi.PopUp("light4", "Add Group");
    $("#light4").parent().css({ "position": "fixed" });
    $("#light4").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    var userSNo = $("#hdnUserSNo").val();
    $("#tdUser").html($("#hdnUserName").val());
    $("#tblGroups").html("");
    $("#tdNotFoundGroup2").hide();
    $("#tdSubmitGroup2").show();
    $.ajax({
        url: "Permission.aspx/GetListUserGroups", async: false, type: "POST", dataType: "json",
        data: JSON.stringify({ UserSNo: userSNo }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            $("#tblGroups").html(result.d);
        }
    });
    return false;
}
//End for show Group User Popup

//Start for Bind Group User Popup
$(document).ready(function () {
    if ($("#hdnUserSNo").val() != "" && $("#hdnUserSNo").val() != undefined) {
        var userSNo = $("#hdnUserSNo").val();
        $.ajax({
            url: "Permission.aspx/GetListUserGroups2", async: false, type: "POST", dataType: "json",
            data: JSON.stringify({ UserSNo: userSNo }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                $("#dvUsersGroup").html(result.d);
            }
        });
    }
    return false;
});
//End for Bind Group User Popup

//Start For All Group Users List
function AllUserGroupList() {
    $("#dvUsersGroup").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($("#chkAllUserGroupList").is(':checked')) {
            this.checked = true;
        }
        else {
            this.checked = false;
        }
    });
}
//End For All Group Users List

//Start For All Group Users List
function AllUserGroupsList() {
    $("#tblGroups").find("input[type='checkbox']").each(function (index, element) {
        var pageObj = {};
        var closestTr = $(this).closest("tr");
        if ($("#chkAllUserGroupsList").is(':checked')) {
            this.checked = true;
        }
        else {
            this.checked = false;
        }
    });
}
//End For All Group Users List

//Start Method for use select check box for column wise
function CreateCheckAll(obj) {
    var lControlType = obj.name.replace('id', '');
    var self = $(obj);
    //$(obj).click(
    //function () {
        // if check all is checked, all checkboxes are checked
        // if check all is unchecked, all checkboxes are cleared
        if ($(obj).is(':checked')) {
            self.closest('table').closest('tr').find("input:checkbox[id$='" + lControlType + "']").each(
                function () {
                    $(this).attr('checked', 'checked');
                });
        }
        else {
            self.closest('table').closest('tr').find("input:checkbox[id$='" + lControlType + "']").each(
                function () {
                    $(this).removeAttr('checked');
                });
        }
    //});
}
//End Method for use select check box for column wise


