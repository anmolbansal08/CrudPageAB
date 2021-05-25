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

    //    $("#treeview-sprites").kendoTreeView({
    //        dataSource: [{
    //            text: "Permission", imageUrl: "images/permission.png", expanded: true, items: [
    //                            { text: "Group", target: "Users.aspx?Module=Users&Apps=Groups&FormAction=INDEXVIEW", imageUrl: "images/usergroup.png" },
    //                            { text: "User", target: "Users.aspx?Module=Users&Apps=Users&FormAction=INDEXVIEW&ulist=ulist", imageUrl: "images/user.png"}]
    //                    },
    //                            { text: "Application", imageUrl: "images/application.png", expanded: true, items: [
    //                                    { text: "Master", imageUrl: "images/master.png", items: [
    //                                        { text: "Location", target: "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=5", imageUrl: "images/createcountry.png" },
    //                                        { text: "ZipCode", target: "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=6", imageUrl: "images/createcountry.png" },
    //                                        { text: "ZipCode2", target: "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=6", imageUrl: "images/createcountry.png" },
    //                                        ]
    //                                    },
    //                                    { text: "Accounts", imageUrl: "images/master.png", items: [
    //                                        { text: "Payment Request", target: "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=46", imageUrl: "images/createcountry.png" },
    //                                        { text: "Payment Verification", target: "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=47", imageUrl: "images/createcountry.png" },
    //                                        { text: "Payment2", target: "Users.aspx?Module=Users&Apps=UserGroup&FormAction=INDEXVIEW&PageSNo=47", imageUrl: "images/createcountry.png" }
    //                                        ]
    //                                    }
    //                            ]
    //                                            }],
    //        dragAndDrop: true,
    //        select: onSelect
    //    });

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

});

function SetTargetLocation(obj) {
    var urltarget = $(obj.target.outerHTML).attr("urltarget");
    var targetparm = $(obj).attr("targetparam");
    if (urltarget != undefined && urltarget != null) {
        $("[id$='iframeid']").attr("src", urltarget + (targetparm != undefined && targetparm != null ? "?id=" + targetparm : ""));
    }
}