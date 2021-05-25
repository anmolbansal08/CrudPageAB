
$(document).ready(function () {
   

    //HtmlLoad();
    $("#ccaContainer").load("HtmlFiles/RateTypePriority/RateTypePriority.html", PageLoaded);
});




function HtmlLoad()
{
    var PageHints = 0;
    $.ajax({
        url: 'HtmlFiles/RateTypePriority/RateTypePriority.html',
        success: function (result) {
            $("body").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'></form");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            //added end pagehints 
            if (PageHints == 0) {
                $('#aspnetForm').append(result);
                PageLoaded();
            }
            else {

            }
        }
    });//

}
function PageLoaded() {

    $.ajax({
        url: "Services/Master/RateTypePriorityService.svc/BindDatatable", async: false, type: "GET", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = JSON.parse(result);
            if (Data.Table0.length > 0) {
                $('#tblDetails').html('');
                $('#tblDetails').append("<tr><td><ul id='sortable'>");
                for (var i = 0; i < Data.Table0.length; i++) {
                    $('#sortable').append("<li id=" + Data.Table0[i].SNo + " class='ui-state-default'><span id=" + Data.Table0[i].RatePriority + " class='ui-icon ui-icon-arrowthick-2-n-s'></span>" + Data.Table0[i].RateTypeName + "</li>");
                }
                $('#tblDetails').append("</tr></td></ul>");
                $("#sortable").sortable();
                $("#sortable").disableSelection();
                $("#CreatedBy").text(Data.Table1[0].CreatedBy);
                $("#UpdatedBy").text(Data.Table1[0].UpdatedBy);
                PagerightsCheckRateTypePriority()
            }
        }
    });
}


$(function () {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
});




function ServiceFailed(result) {
    alert('Service call failed: ' + result.status + '' + result.statusText);
    Type = null; varUrl = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
}


function UpdateRateTypePriority() {
    var ArrayList=[];
        
    var i = 0;
    $('#sortable li').each(function () {
        i++;
        var Array = {
            SNo: $(this).attr('id'),
            RatePriority: i
            };
        ArrayList.push(Array);
    });

    //var RateTypePriority = [{ RatePriority: "2", SNo: "1" }]


    $.ajax({
        url: "Services/Master/RateTypePriorityService.svc/UpdateRateTypePriority", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ RateTypePriority: ArrayList, UpdatedBy: userContext.UserSNo }),
        success: function (result) {

            var GetSucessResult = JSON.parse(result).Table0[0].Column1;
            if (GetSucessResult == 0) {
                // alert("Rate Type Priority Reset Sucessfully");


                ShowMessage('success', 'Success - Rate Type priority !', "Rate Type priority Update Successfully");

                $("#ccaContainer").load("HtmlFiles/RateTypePriority/RateTypePriority.html", PageLoaded);
               // HtmlLoad();
            }
            else
            {
                alert("Rate Type Priority Reset Failed");
            }
        }
    });
}
var RightsCheck = false;
function PagerightsCheckRateTypePriority() {

    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.Apps.toString().toUpperCase() == "RATETYPEPRIORITY") {
            if (i.Apps.toString().toUpperCase() == "RATETYPEPRIORITY" && i.PageRight != "Delete") {
                if (i.Apps.toString().toUpperCase() == "RATETYPEPRIORITY" && i.PageRight == "New") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "RATETYPEPRIORITY" && i.PageRight == "Edit") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "RATETYPEPRIORITY" && i.PageRight == "Delete") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read"){
                    RightsCheck = true;
                    return
                }
            }
        }
    });
    if (RightsCheck) {

        $("#btnSave").hide()


    }

}