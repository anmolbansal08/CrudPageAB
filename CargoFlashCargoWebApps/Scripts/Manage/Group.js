//function ShowAction() {
//    $('.k-grid-content').find("tr").each(function () {
//        $(this).unbind("click").bind("click", function () {
//            var recId = $(this).find("input[type='radio']").val();
//            var groupName = $(this).find("td:eq(1)").text().toUpperCase();
//            if (!(recId == undefined || recId == "")) {
//                $(this).find("input[type='radio']").attr("checked", true);
//                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId + "&gname=" + groupName, addOnFunction: addOnFunction });
//            }
//        });
//    });
//}
//function addOnFunction(content, obj) {
//    $("#header-user-options").find("a").css("display", "");
//    var groupName = $(obj).find("td:eq(1)").text().toUpperCase();
//    if (groupName == "ADMIN" || groupName == "B2B" || groupName == "CONSOLIDATOR" || groupName == "DROPBOX" || groupName == "POS" || groupName == "CUSTOMER SERVICE" || groupName == "CUSTOMERSERVICE" || groupName == "AUDIT") {
//        $("#header-user-options").find(".actionSpan").each(function () {
//            if ($(this).text().toUpperCase() == "EDIT" || $(this).text().toUpperCase() == "DELETE") {
//                $(this).closest("a").css("display", "none");
//            }
//        });
//        $(content).find(".actionSpan").each(function (index) {
//            if ($(this).text().toUpperCase() == "EDIT" || $(this).text().toUpperCase() == "DELETE") {
//                $(content).find("a:eq(" + index + ")").css("display", "none");
//            }
//        });
//    }
//}
//$(document).ready(function () {
//    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
//        var groupName = getQueryStringValue("gname").toUpperCase();
//        if (groupName == "ADMIN" || groupName == "B2B" || groupName == "CONSOLIDATOR" || groupName == "DROPBOX" || groupName == "POS" || groupName == "CUSTOMER SERVICE" || groupName == "CUSTOMERSERVICE" || groupName == "AUDIT") {
//            $(".btn.btn-info")[0].style.display = "none";
//            $(".btn.btn-danger").css("display", "none");
//        }
//    }
//});


function ShowAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            var groupName = $(this).find("td:eq(1)").text().toUpperCase();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId + "&gname=" + groupName, addOnFunction: addOnFunction });
            }
        });
    });
}
function addOnFunction(content, obj) {
    $("#header-user-options").find("a").css("display", "");
    var groupName = $(obj).find("td:eq(1)").text().toUpperCase();
    if (groupName == "ADMIN" || groupName == "B2B" || groupName == "CONSOLIDATOR" || groupName == "DROPBOX" || groupName == "POS" || groupName == "CUSTOMER SERVICE" || groupName == "CUSTOMERSERVICE" || groupName == "AUDIT") {
        $("#header-user-options").find(".actionSpan").each(function () {
            if ($(this).text().toUpperCase() == "EDIT" || $(this).text().toUpperCase() == "DELETE") {
                $(this).closest("a").css("display", "none");
            }
        });
        $(content).find(".actionSpan").each(function (index) {
            if ($(this).text().toUpperCase() == "EDIT" || $(this).text().toUpperCase() == "DELETE") {
                $(content).find("a:eq(" + index + ")").css("display", "none");
            }
        });
    }
}
$(document).ready(function () {


    if (getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW")
    {
        if (userContext.GroupName.toUpperCase() != "SUPER ADMIN") {
            $('input[type=button][value=New Group]').hide()
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('input:radio[id=IsMultiCity]:eq(1)').attr('checked', true);
    }
    cfi.AutoCompleteV2("CloneGroupSNo", "GroupName", "Security_Groups", null, "contains");
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        //------------------Start Work By Akash For Give Right  To SuperAdmin  as per Aman Khan Sir---==========   6 July 2017 12:27 PM
        if (userContext.GroupName.toUpperCase() != "SUPER ADMIN") {
            $('input[type=button][value=Edit]').hide();
            $('input[type=button][value=Duplicate]').hide();
            $('input[type=button][value=Delete]').hide();
        }
        //----------------------End Work Of Akash


        var groupName = getQueryStringValue("gname").toUpperCase();
        if (groupName == "ADMIN" || groupName == "B2B" || groupName == "CONSOLIDATOR" || groupName == "DROPBOX" || groupName == "POS" || groupName == "CUSTOMER SERVICE" || groupName == "CUSTOMERSERVICE" || groupName == "AUDIT") {
            $(".btn.btn-info")[0].style.display = "none";
            $(".btn.btn-danger").css("display", "none");
        }
    }

  
});

function ExtraCondition(textId) {
    var SNo = $('#hdnSSNo').val() == "" ? 0 : $('#hdnSSNo').val();
    var filterName = cfi.getFilter("AND");
    if (textId == "Text_CloneGroupSNo") {
        cfi.setFilter(filterName, "SNo", "neq", SNo);
        cfi.setFilter(filterName, "IsActive", "eq", 1);
        var NameAutoCompleteFilter = cfi.autoCompleteFilter(filterName);
        return NameAutoCompleteFilter;
    }
}