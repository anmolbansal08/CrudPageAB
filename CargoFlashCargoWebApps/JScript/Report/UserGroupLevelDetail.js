var OnBlob = false;
$(document).ready(function () {

    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Report_AirlineName", null, "contains");
    cfi.AutoCompleteV2("GroupSNo", "GroupName", "Report_GroupName", null, "contains");
    cfi.AutoCompleteV2("UserSNo", "UserName", "Report_UserName", null, "contains");
    $("#UserSNo").val(userContext.UserSNo);
    $("#Text_UserSNo_input").val(userContext.UserName);

   // $("#AirlineSNo").val(userContext.AirlineSNo);
   // $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
});

var Model = [];
function GetUserGroupLevelDetail() {
     Model = {
        AirlineSNo: $("#AirlineSNo").val(),
        UserSNo: $("#Text_UserSNo").val() == "" ? 0 : $('#UserSNo').val(),
        GroupSNo: $("#GroupSNo").val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)
         
    }


    if (cfi.IsValidSubmitSection()) {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/UserGroupLevel",
                async: true,
                type: "GET",
                dataType: "json",
                data: Model,
                success: function (result) {
                    var data = result.Table0[0].ErrorMessage.split('~');

                    if (parseInt(data[0]) == 0)
                        ShowMessage('success', 'Reports!', data[1]);
                    else
                        ShowMessage('warning', 'Reports!', data[1]);
                }
            });

        }
        else {
            $.ajax({
                url: "../UserGroupLevelDetail/GetUserGroupLevelDetail",
                async: false,
                type: "GET",
                dataType: "json",

                data:Model ,
               // contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {

                    var Result = result.Table0
                    $('#theadid').html('');
                    $('#tbodyid').html('');


                    var thead_body = "";
                    var thead_row = "";

                    if (Result.length > 0) {

                        for (var i = 0; i < Result.length; i++) {
                            var columnsIn = Result[0];// Coulms Name geting from First Row
                            thead_row += '<tr>'
                            for (var key in columnsIn) { // Printing Columns
                                if (i == 0)
                                    thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";
                                var data = key;
                                if ((key == "Special Permission")  && (Result[i][key] == "YES")) {
                                    thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : "<a href='#' class='name-link' onclick='Special()'>" + Result[i][key] + "</a>") + "</label></td>";
                                    //thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"ok\")'>" + Result[i][key] + "</a>") + "</label></td>";
                                }

                               else if ( (key == "Extra Function") && (Result[i][key] == "YES")) {
                                   thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : "<a href='#' class='name-link' onclick='Extra()'>" + Result[i][key] + "</a>") + "</label></td>";
                                    //thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"ok\")'>" + Result[i][key] + "</a>") + "</label></td>";
                                }
                                else {
                                    thead_row += "<td class='ui-widget-content'  id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : Result[i][key]) + "</label></td>";
                                }
                            }
                            thead_row += '</tr>'
                        }
                    }
                    $('#theadid').append('<tr>' + thead_body + '</tr>');
                    $('#tbodyid').append(thead_row);
                    $(".k-grid-header-wrap").closest('div').attr('style', 'overflow-x: scroll');
                    $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                    $("#Serial").closest('td').attr('style', 'color:#daecf4');
                    $("#Serial").closest('td').text('Seri');
                    if (Result.length==0) {


                        ShowMessage('warning', 'Warning - User Group Level Report', 'No Record Found.', " ", "bottom-right");
                        return false;
                        //$("#exportflight").hide();
                    }
                    //else {
                    //    $("#exportflight").show();
                    //}



                },
                complete: function (data) {


                    //$("#tblUserGroupsLevelDetails tbody tr td").each(function () {
                    //    var i = $(this).closest('tr').index();
                    //    var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
                    //    var col = i % 2 == 0 ? "black" : "green";
                    //    $(this).attr('style', 'background:' + co, 'important');


                    //});
                    $("#btnExportToExcel_UserGroupLevelDetail").show();
                },
                error: function (xhr) {
                    var a = "";
                }
            });

        }

    }
}



function ExportToExcel_UserGroupLevelDetail() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '_' + mm + '_' + yyyy;
    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';
    //----remove hiiden field column-------------------
    //  $("#tblCreditLimitReport tbody tr").find('td:last').remove();
    //   $("#tblCreditLimitReport thead tr td:last").remove();
    // var i = $("#tblCreditLimitReport tbody tr").length;
    //  
    $("#tblUserGroupsLevelDetails tbody tr").each(function () {
        var i = $(this).index();
        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
        $(this).attr('style', 'background-color:' + co);
    });
    //------- end---------------------------------------
    //    $('#tblsearchrateList [id^="Serial"]').hide();
    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblUserGroupsLevelDetails thead tr:eq(0)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblUserGroupsLevelDetails tbody').html() + '</tbody></table></body></html>';
    //var table_html = table_div.replace(/ /g, '%20');
    //a.href = data_type + ', ' + table_html;
    //a.download = 'UserGroupsLevelDetailsReport' + today + '_.xls';
    //a.click();

    var contentType = "application/vnd.ms-excel";
    var byteCharacters = table_div; //e.format(fullTemplate, e.ctx);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: contentType });
    var blobUrl = URL.createObjectURL(blob);
    //FILEDOWNLOADFIX END
    a = document.createElement("a");
    a.download = 'UserGroupsLevelDetailsReport' + today + '_.xls';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}




function SpecialPermissionPopup() {
    var tblMsg ='<tr><td class="formtHeaderLabel">PageName</td>'
        + '<td class="formtHeaderLabel">Code</td>'
        + '<td class="formtHeaderLabel">Description</td>'
        + '</tr>';
    var Modeldata1 = {
        AirlineSNo: $("#AirlineSNo").val(),
        UserSNo: $("#UserSNo").val(),
        GroupSNo: $("#GroupSNo").val(),

    };

    $.ajax({
        url: "../UserGroupLevelDetail/GetSpecialPermission",
        dataType: "json",
        global: false,
        type: 'GET',
        // contentType: "application/json; charset=utf-8",
        data: Modeldata1,
        success: function (result) {
            if (result != undefined) {


                //Hold Type
                for (var i = 0; i < result.Data.length; i++) {

                    tblMsg += "<tr>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + result.Data[i].PageName + "</td>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + result.Data[i].Code + "</td>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + result.Data[i].Description + "</td>";
                    tblMsg += "<tr>";


                    //Add Popup Div
                 
                }
                $("head").after('<div id="divMsgWindow"><table class="WebFormTable">' + tblMsg + '</table></div>');
                $("head").after('<div id="divMsgWindow"><table class="WebFormTable">' + tblMsg + '</table></div>');
                //Show Popup
                $("#divMsgWindow").remove();
                    $("#divMsgWindow").dialog(
                         {
                             autoResize: true,
                             maxWidth: 1300,
                             maxHeight: 800,
                             width: 800,
                             height: 500,
                             modal: true,
                             title: 'Special Permission',
                             draggable: true,
                             resizable: true,
                             buttons: {
                                 Cancel: function () {
                                     $(this).dialog("close");
                                    // $(elementId).closest("tr").children('td, th').css('background', '#fff');
                                 }
                             },
                             close: function () {
                                 $(this).dialog("close");
                                // $(elementId).closest("tr").children('td, th').css('background', '#fff');
                             }
                         });
                
            }
        }
    });
}











function Special() {
   
    SpecialPermissionPopup();

}

function Extra()
{
    ExtraPagePopup();
}

function ExtraPagePopup() {
    var tblMsg = '<tr><td class="formtHeaderLabel">PageName</td>'
              + '<td class="formtHeaderLabel">Description</td>'
        + '</tr>';
    var Modeldata1 = {
        AirlineSNo: $("#AirlineSNo").val(),
        UserSNo: $("#UserSNo").val(),
        GroupSNo: $("#GroupSNo").val(),

    };

    $.ajax({
        url: "../UserGroupLevelDetail/ExtraFunctionPermission",
        dataType: "json",
        global: false,
        type: 'GET',
        // contentType: "application/json; charset=utf-8",
        data: Modeldata1,
        success: function (result) {
            if (result != undefined) {


                //Hold Type
                for (var i = 0; i < result.Data.length; i++) {

                    tblMsg += "<tr>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + result.Data[i].PageName + "</td>";
                    tblMsg += "<td class=\"formHeaderTranscolumn\">" + result.Data[i].Description + "</td>";
                    tblMsg += "<tr>";


                    //Add Popup Div

                }
                $("head").after('<div id="divMsgWindow"><table class="WebFormTable">' + tblMsg + '</table></div>');
                $("head").after('<div id="divMsgWindow"><table class="WebFormTable">' + tblMsg + '</table></div>');
                //Show Popup
                $("#divMsgWindow").remove();
                $("#divMsgWindow").dialog(
                     {
                         autoResize: true,
                         maxWidth: 1300,
                         maxHeight: 800,
                         width: 800,
                         height: 500,
                         modal: true,
                         title: 'Extra Function',
                         draggable: true,
                         resizable: true,
                         buttons: {
                             Cancel: function () {
                                 $(this).dialog("close");
                                 // $(elementId).closest("tr").children('td, th').css('background', '#fff');
                             }
                         },
                         close: function () {
                             $(this).dialog("close");
                             // $(elementId).closest("tr").children('td, th').css('background', '#fff');
                         }
                     });

            }
        }
    });
}







