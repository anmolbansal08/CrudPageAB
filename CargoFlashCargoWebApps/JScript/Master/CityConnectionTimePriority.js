
$(document).ready(function () {


    //HtmlLoad();
    $("#ccaContainer").load("HtmlFiles/CityConnectionTimePriority/CityConnectionTimePriority.html", PageLoaded);
});




function HtmlLoad() {
    var PageHints = 0;
    $.ajax({
        url: 'HtmlFiles/CityConnectionTimePriority/CityConnectionTimePriority.html',
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
        url: "Services/Master/CityConnectionTimePriority.svc/BindDatatable", async: false, type: "GET", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = JSON.parse(result);
            if (Data.Table0.length > 0) {
                $('#tblDetails').html('');
                $('#tblDetails').append("<tr><td><ul id='sortable'>");
                for (var i = 0; i < Data.Table0.length; i++) {
                    $('#sortable').append("<li id=" + Data.Table0[i].SNo + " class='ui-state-default'><span id=" + Data.Table0[i].Priority + " class='ui-icon ui-icon-arrowthick-2-n-s'></span>" + Data.Table0[i].Name + "</li>");
                }
                $('#tblDetails').append("</tr></td></ul>");
                $("#sortable").sortable();
                $("#sortable").disableSelection();
                $("#CreatedBy").text(Data.Table1[0].CreatedBy);
                $("#UpdatedBy").text(Data.Table1[0].UpdatedBy);

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


function UpdateCityConnectionTimePriority() {
    var ArrayList = [];

    var i = 0;
    $('#sortable li').each(function () {
        i++;
        var Array = {
            SNo: $(this).attr('id'),
            Priority: i
        };
        ArrayList.push(Array);
    });

   


    $.ajax({
        url: "Services/Master/CityConnectionTimePriority.svc/UpdateCityConnectionTimePriority", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CityConnectionTimePriority: ArrayList, UpdatedBy: userContext.UserSNo }),
        success: function (result) {

            var GetSucessResult = JSON.parse(result).Table0[0].Column1;
            if (GetSucessResult == 0) {
         

                ShowMessage('success', 'Success - City Connection Time !', "City Connection Time Priority Update Successfully");

                $("#ccaContainer").load("HtmlFiles/CityConnectionTimePriority/CityConnectionTimePriority.html", PageLoaded);
                // HtmlLoad();
            }
            else {
                alert("City Connection Time Priority Reset Failed");
            }
        }
    });
}