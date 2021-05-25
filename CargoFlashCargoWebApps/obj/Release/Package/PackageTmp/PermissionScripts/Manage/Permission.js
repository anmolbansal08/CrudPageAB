/// <reference path="../jquery-1.7.2.js" />
$(document).ready(function () {
    $("#vertical").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: true }
        ]
    });
    $("#horizontal").kendoSplitter({
        panes: [
            { collapsible: true, size: "25%" },
            { collapsible: false }
        ]
    });
    var items;
    $.ajax({
        url: "Permission.aspx/GetModulePages", async: false, type: "POST", dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            items = eval(jQuery.parseJSON(result.d));

            $("#treeview-sprites").kendoTreeView({
                dataSource: items,
                dragAndDrop: true,
                select: onSelect
            });
        }
    });
    $("#treeview-sprites").find('ul li.k-item.k-first ul li:nth-child(1) a').removeClass('k-in').addClass('k-in k-state-selected');
    $("#treeview-sprites").on("click", ".k-in", function (e) {
        SetTargetLocation(e);
    });
    $('ul[class="k-group"] li').removeClass('k-last');
    $('ul[class="k-group"]').find('li:last').each(function () { $(this).addClass("k-last"); });
    $("#treeview-sprites").find('ul ul li:last-child').addClass('k-last');
    function onSelect(e) {
        var urltarget = this.urltarget(e.node);
        if (urltarget != undefined && urltarget != null) {
            $("[id$='iframeid']").attr("src", urltarget);
        }
    }
    $(".k-splitbar-draggable-horizontal").removeClass();
});

function SetTargetLocation(obj) {
    var urltarget = $(obj.target.outerHTML).attr("urltarget");
    var targetparm = $(obj).attr("targetparam");
    if (urltarget != undefined && urltarget != null) {
        $("[id$='iframeid']").attr("src", urltarget + (targetparm != undefined && targetparm != null ? "?id=" + targetparm : ""));
    }
}

function OpenSubprocessDialog(pageSNo) {
    var userSNo = $("#hdnUserSNo").val();
    var groupSNo = $('#hdngroupSNo').val();
    $.ajax({
        url: "services/permissions/pagesservice.svc/GetProcessPermission",
        async: false,
        type: "POST",
        dataType: "JSON",
        cache: false,
        data: JSON.stringify({ UserSNo: userSNo, GroupSNo: groupSNo, PageSNo: pageSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (result.value.length > 0) {

                var iB = true, iV = true, iE = true;
                for (var i = 0; i < result.value.length; i++) {
                    if (result.value[i].IsBlocked == false)
                        iB = false;
                    if (result.value[i].IsView == false)
                        iV = false;
                    if (result.value[i].IsEdit == false)
                        iE = false;
                }

                var tbl = "<fieldset><legend>Sub Process Permission:</legend><table class='appendGrid ui-widget' id='tblPermission'>";
                tbl += "<thead class='ui-widget-header' style='text-align:center'><tr>";
                tbl += "<td>Sub Process Name</td>";
                tbl += "<td><input id=\"chkIsBlocked\" class=\"checkbox\" name=\"chkAllPer1\" type=\"checkbox\" " + (iB == true ? checked = 'checked' : '') + " onclick=\"selectAllchk(this.id)\"  />Blocked</td>";
                tbl += "<td><input id=\"chkIsView\" class=\"checkbox\" name=\"chkAllPer2\" type=\"checkbox\" " + (iV == true ? checked = 'checked' : '') + " onclick=\"selectAllchk(this.id)\"  />View</td>";
                tbl += "<td><input id=\"chkIsEdit\" class=\"checkbox\" name=\"chkAllPer3\" type=\"checkbox\" " + (iE == true ? checked = 'checked' : '') + " onclick=\"selectAllchk(this.id)\"  />Edit</td>";
                tbl += "</tr></thead>";
                tbl += "<tbody class='ui-widget-content' style='text-align:center'>";
                $(result.value).each(function (index, e) {
                    tbl += "<tr>";
                    tbl += "<td class='ui-widget-content' style='text-align:left; padding-left:10px;'><input type=\"hidden\" id=\"hdnSno_" + index + "\" value=\"" + e.SNo + "\" /> <input type=\"hidden\" id=\"hdnSubProcessSNo_" + index + "\" value=\"" + e.SubProcessSNo + "\" />" + e.SubProcessDisplayName + "</td>";
                    tbl += "<td class='ui-widget-content'><input id=\"chkIsBlocked_" + index + "\" class=\"checkbox\" name=\"chkPermission1\" type=\"checkbox\" " + (e.IsBlocked == true ? checked = 'checked' : '') + " onclick=\"allowonly(this.id)\"  /></td>";
                    tbl += "<td class='ui-widget-content'><input id=\"chkIsView_" + index + "\" class=\"checkbox\" name=\"chkPermission2\" type=\"checkbox\" " + (e.IsView == true ? checked = 'checked' : '') + " onclick=\"allowonly(this.id)\"  /></td>";
                    tbl += "<td class='ui-widget-content'><input id=\"chkIsEdit_" + index + "\" class=\"checkbox\" name=\"chkPermission3\" type=\"checkbox\" " + (e.IsEdit == true ? checked = 'checked' : '') + " onclick=\"allowonly(this.id)\" /></td>";
                    tbl += "</tr>";
                });
                tbl += "</tbody></table></fieldset>";
                $("#divSpecialRights").html(tbl);
            }
            else {
                $("#divSpecialRights").html("<div>No Record Found.</div>");
            }
        }
    });

    $("#divSpecialRights").dialog({
        title: "Sub Process Rights",
        show: {
            effect: "blind",
            duration: 800
        },
        hide: {
            effect: "clip",
            duration: 800
        },
        width: 800,
        height: 400,
        modal: true,
        buttons: {
            Save: function () {
                SavePermissions(userSNo, groupSNo);
                $(this).dialog('close');
            },
            Close: function () {
                $(this).dialog('close');
            }
        }
    });
}

function SavePermissions(userSNo, groupSNo) {
    var arr = [];
    $("#tblPermission").find("input[id^='hdnSno']").each(function () {
        var i = $(this).attr("id").split('_')[1];
        var ProcessPermissionList = {
            SNo: $(this).val(),
            UserSNo: 0,
            SubProcessSNo: $("#hdnSubProcessSNo_" + i).val(),
            SubProcessDisplayName: "",
            IsBlocked: $("#chkIsBlocked_" + i).is(":checked"),
            IsView: $("#chkIsView_" + i).is(":checked"),
            IsEdit: $("#chkIsEdit_" + i).is(":checked"),
        };
        arr.push(ProcessPermissionList);
    });
    //var j = JSON.stringify({ arr: arr, UserSNo: userSNo, GroupSNo: groupSNo });

    if (arr.length > 0) {
        $.ajax({
            url: "services/permissions/pagesservice.svc/SaveProcessPermission",
            async: false,
            type: "POST",
            dataType: "JSON",
            cache: false,
            data: JSON.stringify({ arr: arr, UserSNo: userSNo, GroupSNo: groupSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage("success","","Sub Process Permissions saved successfully");

                }
                else {
                    ShowMessage("error", "", result);
                }
            }
        });
    }
    else {
        ShowMessage("error", "", 'No record found to Save!!!');
    }
}

function allowonly(currentID) {
    var replaceby = currentID.split('_')[0];
    var chkBlockedID = currentID.replace(replaceby, 'chkIsBlocked');
    var chkViewID = currentID.replace(replaceby, 'chkIsView');
    var chkEditID = currentID.replace(replaceby, 'chkIsEdit');

    if (!$("#" + chkBlockedID).is(":checked") && !$("#" + chkViewID).is(":checked") && !$("#" + chkEditID).is(":checked"))
    {
        ShowMessage("warning", "Permission", "Select at least one permission.");
        $("#"+currentID).attr("checked", true);
        return;
    }

    if ($("#" + currentID).is(":checked") == false) {
        //it is for select all checkbox
        $("#" + replaceby).removeAttr("checked");
    }

    if (replaceby == "chkIsBlocked" && $("#" + chkBlockedID).is(":checked") == true) {
        $("#" + chkViewID).removeAttr("checked");
        $("#" + chkEditID).removeAttr("checked");
    }

    else if (replaceby == "chkIsView" && $("#" + chkViewID).is(":checked") == true) {
        $("#" + chkBlockedID).removeAttr('checked');
        $("#" + chkEditID).removeAttr("checked");
    }
    else if (replaceby == "chkIsEdit" && $("#" + chkEditID).is(":checked") == true) {
        $("#" + chkBlockedID).removeAttr('checked');
        $("#" + chkViewID).removeAttr("checked");
    }

}

function selectAllchk(currentID) {
    if (!$("#chkIsBlocked").is(":checked") && !$("#chkIsView").is(":checked") && !$("#chkIsEdit").is(":checked")) {
        ShowMessage("warning", "Permission", "Select at least one permission.");
        $("#" + currentID).attr("checked", true);
        return;
    }

    if (currentID == "chkIsBlocked") {
        if ($("#" + currentID).is(":checked") == true) {
            $('#' + currentID).closest('tr').find("input[id^='chkIsView']").removeAttr('checked');
            $('#' + currentID).closest('tr').find("input[id^='chkIsEdit']").removeAttr('checked');

            $("#tblPermission").find("input[id^='chkIsBlocked_']").each(function () {
                $(this).attr('checked', true);
                $(this).closest('tr').find("input[id^='chkIsView_']").removeAttr('checked');
                $(this).closest('tr').find("input[id^='chkIsEdit_']").removeAttr('checked');
            });

        }
        else {
            $("#tblPermission").find("input[id^='chkIsBlocked_']").each(function () {
                $(this).removeAttr('checked');
            });
        }
    }
    else if (currentID == "chkIsView") {
        if ($("#" + currentID).is(":checked") == true) {
            $('#' + currentID).closest('tr').find("input[id^='chkIsBlocked']").removeAttr('checked');
            $('#' + currentID).closest('tr').find("input[id^='chkIsEdit']").removeAttr('checked');
            $("#tblPermission").find("input[id^='chkIsView_']").each(function () {
                $(this).attr('checked', true);
                $(this).closest('tr').find("input[id^='chkIsBlocked_']").removeAttr('checked');
                $(this).closest('tr').find("input[id^='chkIsEdit_']").removeAttr('checked');
            });

        }
        else {
            $("#tblPermission").find("input[id^='chkIsView_']").each(function () {
                $(this).removeAttr('checked');
            });
        }
    }
    else if (currentID == "chkIsEdit") {
        if ($("#" + currentID).is(":checked") == true) {
            $('#' + currentID).closest('tr').find("input[id^='chkIsBlocked']").removeAttr('checked');
            $('#' + currentID).closest('tr').find("input[id^='chkIsView']").removeAttr('checked');
            $("#tblPermission").find("input[id^='chkIsEdit_']").each(function () {
                $(this).attr('checked', true);
                $(this).closest('tr').find("input[id^='chkIsBlocked_']").removeAttr('checked');
                $(this).closest('tr').find("input[id^='chkIsView_']").removeAttr('checked');
            });

        }
        else {
            $("#tblPermission").find("input[id^='chkIsEdit_']").each(function () {
                $(this).removeAttr('checked');
            });
        }
    }


}

function OpenSpecialPermissionDialog(UserSNo) {

    $.ajax({
        url: "services/permissions/pagesservice.svc/GetSpecialPermission",
        async: false,
        type: "POST",
        dataType: "JSON",
        cache: false,
        data: JSON.stringify({ UserSNo: UserSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (result.value.length > 0) {

                var iE = true;
                for (var i = 0; i < result.value.length; i++) {
                    if (result.value[i].IsEnabled == false)
                        iE = false;
                }

                var tbl = "<fieldset><legend>Special Permissions:</legend><table class='appendGrid ui-widget' id='tblSplPermission'>";
                tbl += "<thead class='ui-widget-header' style='text-align:center'><tr>";
                tbl += "<td>Page Name</td>";
                tbl += "<td>Code</td>";
                tbl += "<td>Description</td>";
                tbl += "<td><input id=\"chkIsEnabled\" class=\"checkbox\" name=\"chkAllPer1\" type=\"checkbox\" " + (iE == true ? checked = 'checked' : '') + " onclick=\"selectAllSpecialPermissionchk(this.id)\"  />Enabled</td>";
                tbl += "</tr></thead>";
                tbl += "<tbody class='ui-widget-content' style='text-align:center'>";
                $(result.value).each(function (index, e) {
                    tbl += "<tr>";
                    tbl += "<td class='ui-widget-content' style='text-align:left; padding-left:10px;'><input type=\"hidden\" id=\"hdnSNo_" + index + "\" value=\"" + e.SNo + "\" /> " + e.PageName + "</td>";
                    tbl += "<td class='ui-widget-content' style='text-align:left; padding-left:10px;'>" + e.Code + "</td>";
                    tbl += "<td class='ui-widget-content' style='text-align:left; padding-left:10px;'>" + e.Description + "</td>";
                    tbl += "<td class='ui-widget-content'><input id=\"chkIsEnabled_" + index + "\" class=\"checkbox\" name=\"chkPermission4\" type=\"checkbox\" " + (e.IsEnabled == true ? checked = 'checked' : '') + " /></td>";
                    tbl += "</tr>";
                });
                tbl += "</tbody></table></fieldset>";
                $("#divSpecialPermission").html(tbl);
            }
            else {
                $("#divSpecialPermission").html("<div>No Record Found.</div>");
            }
        }
    });

    $("#divSpecialPermission").dialog({
        title: "Special Permissions",
        show: {
            effect: "blind",
            duration: 800
        },
        hide: {
            effect: "clip",
            duration: 800
        },
        width: 800,
        height: 400,
        modal: true,
        buttons: {
            Save: function () {
                SaveSpecialPermissions(UserSNo);
                $(this).dialog('close');
            },
            Close: function () {
                $(this).dialog('close');
            }
        }
    });
}

function selectAllSpecialPermissionchk(currentID)
{
    if (currentID == "chkIsEnabled") {
    if ($("#" + currentID).is(":checked") == true) {
        $("#tblSplPermission").find("input[id^='chkIsEnabled_']").each(function () {
            $(this).attr('checked', true);
        });

    }
    else {
        $("#tblSplPermission").find("input[id^='chkIsEnabled_']").each(function () {
            $(this).removeAttr('checked');
        });
    }

}
}

function SaveSpecialPermissions(UserSNo) {
    var arry = [];
    $("#tblSplPermission").find("input[id^='hdnSNo']").each(function () {
        var i = $(this).attr("id").split('_')[1];
        var SpecialPermissionList = {
            SNo: $(this).val(),
            PageName: "",
            Code: "",
            Description: "",
            IsEnabled: $("#chkIsEnabled_" + i).is(":checked")
        };
        arry.push(SpecialPermissionList);
    });
    if (arry.length > 0) {
        $.ajax({
            url: "services/permissions/pagesservice.svc/SaveSpecialPermission",
            async: false,
            type: "POST",
            dataType: "JSON",
            cache: false,
            data: JSON.stringify({ arry: arry, UserSNo: UserSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage("success", "", "Special Permissions saved successfully");
                }
                else {
                    ShowMessage("error", "", result);
                }
            }
        });
    }
    else {
        alert('No record found to Save!!!');
    }
}


function CheckAllDocument(obj) {
    var self = $(obj);
    if (self.attr('checked')) {
        self.closest('tr').next('tr').find('.k-grid :checkbox').attr('checked', true);
    }
    else {
        self.closest('tr').next('tr').find('.k-grid :checkbox').attr('checked', false);
    }
}

function NestedCheckAll(obj) {
    var self = $(obj);
    if (self.attr('checked')) {
        self.closest('table').closest('tr').find(':checkbox').attr('checked', true);
    }
    else {
        self.closest('table').closest('tr').find(':checkbox').attr('checked', false);
    }
}

function CheckPermission(obj) {
    var self = $(obj);
    if (self.attr('checked')) {
        self.closest('tr').find(':checkbox').attr('checked', true);
    } else {
        self.closest('tr').find(':checkbox').attr('checked', false);
    }
}

function TOPNestedCheckAll(obj) {
    var self = $(obj);
    if (self.attr('checked')) {
        self.closest('tr').next('tr').find(':checkbox').attr('checked', true);
    }
    else {
        self.closest('tr').next('tr').find(':checkbox').attr('checked', false);
    }
}

function OpenStatusAccessibilityDialog(pageSNo) {
    var userSNo = $("#hdnUserSNo").val();
    var groupSNo = $('#hdngroupSNo').val();
    $.ajax({
        url: "services/permissions/pagesservice.svc/GetPageStatusAccessibility",
        async: false,
        type: "POST",
        dataType: "JSON",
        cache: false,
        data: JSON.stringify({ GroupSNo: groupSNo, PageSNo: pageSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (result.length > 0) {

                var iB = true;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].IsAllow == false) {
                        iB = false;
                    }
                }

                var tbl = "<fieldset><legend>Status Accessibility:</legend><table class='appendGrid ui-widget' id='tblStatusAccessibility'>";
                tbl += "<thead class='ui-widget-header' style='text-align:center'><tr>";
                tbl += "<td>Status Code</td>";
                tbl += "<td><input id=\"chkIsAllow\" class=\"checkbox\" name=\"chkIsAllowAll\" type=\"checkbox\" " + (iB == true ? checked = 'checked' : '') + " onclick=\"selectAllchkStatus(this)\"  />Allow</td>";
               tbl += "</tr></thead>";
                tbl += "<tbody class='ui-widget-content' style='text-align:center'>";
                $(result).each(function (index, e) {
                    tbl += "<tr>";
                    tbl += "<td class='ui-widget-content' style='text-align:left; padding-left:10px;'><input type=\"hidden\" id=\"hdnSno_" + index + "\" value=\"" + e.SNo + "\" /> " + e.StatusCode + "</td>";
                    tbl += "<td class='ui-widget-content'><input id=\"chkIsAllow_" + index + "\" class=\"checkbox\" name=\"chkPermission1\" type=\"checkbox\" " + (e.IsAllow == true ? checked = 'checked' : '') + "  /></td>";
                    tbl += "</tr>";
                });
                tbl += "</tbody></table></fieldset>";
                $("#divSpecialRights").html(tbl);
            }
            else {
                $("#divSpecialRights").html("<div>No Record Found.</div>");
            }
        }
    });

    $("#divSpecialRights").dialog({
        title: "Status Accessibility",
        show: {
            effect: "blind",
            duration: 800
        },
        hide: {
            effect: "clip",
            duration: 800
        },
        width: 800,
        height: 400,
        modal: true,
        buttons: {
            Save: function () {
                SaveStatusAccessibility(groupSNo);
                $(this).dialog('close');
            },
            Close: function () {
                $(this).dialog('close');
            }
        }
    });
}


function SaveStatusAccessibility(groupSNo) {
    var arry = [];
    $("#tblStatusAccessibility").find("input[id^='hdnSno']").each(function () {
        var i = $(this).attr("id").split('_')[1];
        var ProcessPermissionList = {
            SNo: $(this).val(),
            StatusSNo: 0,
            PageSNo:0,
            StatusCode: "",
            IsAllow: $("#chkIsAllow_" + i).is(":checked")
        };
        arry.push(ProcessPermissionList);
    });
    //var j = JSON.stringify({ arr: arr, UserSNo: userSNo, GroupSNo: groupSNo });

    if (arry.length > 0) {
        $.ajax({
            url: "services/permissions/pagesservice.svc/SaveStatusAccessibility",
            async: false,
            type: "POST",
            dataType: "JSON",
            cache: false,
            data: JSON.stringify({ arry: arry, GroupSNo: groupSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage("success", "", "Status Accessibility saved successfully");

                }
                else {
                    ShowMessage("error", "", result);
                }
            }
        });
    }
    else {
        ShowMessage("error", "", "No record found to Save!!!");
    }
}

function selectAllchkStatus(obj) {
    if ($(obj).is(":checked") == true) {
        $(obj).closest("tr").parent().parent().find("input[id^=chkIsAllow]").attr("checked", true);
    }
    else {
        $(obj).closest("tr").parent().parent().find("input[id^=chkIsAllow]").attr("checked", false);
    }
}