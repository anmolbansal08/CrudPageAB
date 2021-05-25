var pageType;
$(document).ready(function ()
{
    pageType = getQueryStringValue("FormAction").toUpperCase();
    if (pageType == 'EDIT')
    {
        var tab = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    }
});

function ServiceConfig()
{
    pageType = getQueryStringValue("FormAction").toUpperCase();
    alert(pageType);
    $.ajax({
        url: "Services/Permissions/SystemSettingService.svc/GetSystemSettingRecord",
        async: false,
        type: "get",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result)
        {
            var data = JSON.parse(result);
            var isValid = data.Table;
        },
        error:
        {
        }
    });
}
function LoginSecurity()
{
}
function DefaultParameter()
{
}









