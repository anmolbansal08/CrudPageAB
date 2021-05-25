$(document).ready(function () {
    $("#menu").kendoMenu();
    var menu = $("#menu").data("kendoMenu");
    $("#menu").find("a").each(function () {
        if ($(this).attr("href") != "#") {
            $(this).unbind("click").bind("click", function () {
                menu.close();
            });
        }
    });
    $(".menu-title").show();
});
