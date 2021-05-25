
function ShowScheduleAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).find("input[type='radio']").attr("onclick", "addOnFunction(this)");
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
               
                //$(".k-grid-content").find("input[type='radio']").attr("onclick", "addOnFunction()")
                $(this).toolbar({ content: '#user-options', position: 'top', recId: recId, addOnFunction: addOnFunction });
            }
        });
    });
}

function addOnFunction(content, obj) {
   
    $("#header-user-options").find("a").css("display", "");
    var Rvalue = content.defaultValue;
    if ($("input[type='radio'][value='" + Rvalue + "']").parent().parent().find("td:eq(3)").html() == "0") {
        $("#header-user-options").find(".actionSpan").each(function () {
            if ($("input[type='radio'][value='" + Rvalue + "']").parent().find("div").find("a:eq(0)").find(".actionSpan").html() == "OFFICE") {
                $("input[type='radio'][value='" + Rvalue + "']").parent().find("div").find("a:eq(0)").css("display", "none");
                $("input[type='radio']").parent().find("div").find("a:eq(0)").hide();
            }
        });
    }
    else { $("input[type='radio']").parent().find("div").find("a:eq(0)").show(); }

    if ($("input[type='radio'][value='" + Rvalue + "']").parent().parent().find("td:eq(4)").html() == "0") {
        $("#header-user-options").find(".actionSpan").each(function () {
            if ($("input[type='radio'][value='" + Rvalue + "']").parent().find("div").find("a:eq(1)").find(".actionSpan").html() == "AGENT") {
                $("input[type='radio'][value='" + Rvalue + "']").parent().find("div").find("a:eq(1)").css("display", "none");
                $("input[type='radio']").parent().find("div").find("a:eq(1)").hide();
            }
        });
    }
    else { $("input[type='radio']").parent().find("div").find("a:eq(1)").show(); }
    //if ($(obj).find("td:last").text().toUpperCase() == "YES") {
    //    $("#header-user-options").find(".actionSpan").each(function () {
    //        if ($(this).text().toUpperCase() == "DELETE") {
    //            $(this).closest("a").css("display", "none");
    //        }
    //    });
    //    $(content).find(".actionSpan").each(function (index) {
    //        if ($(this).text().toUpperCase() == "DELETE") {
    //            $(content).find("a:eq(" + index + ")").remove();
    //        }
    //    });
    //}
}