var OnBlob = userContext.SysSetting.GenerateReportOnBlob == "Yes"

$(document).ready(function () {
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Report_AirlineName", null, "contains");
    cfi.AutoCompleteV2("GroupSNo", "GroupName", "Report_GroupName", null, "contains");
    cfi.AutoCompleteV2("UserSNo", "UserName", "Report_UserName", null, "contains");


});



var Model = [];

function UserSpecialPermissionDetail() {

    Model = {
        AirlineSNo: $("#AirlineSNo").val(),
        UserSNo: $("#UserSNo").val(),
        GroupSNo: $("#GroupSNo").val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)

    };

    if (cfi.IsValidSubmitSection()) {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/UserSpecialPermission",
                async: true,
                type: "GET",
                dataType: "json",
                data: Model,
                success: function (result) {
                    ShowMessage('warning', 'Reports!', result.Table0[0].ErrorMessage);
                }
            });
        }

        else {
            $.ajax({
                url: "../UserSpecialPermission/UserSpecialPermissionDetail",
                async: false,
                type: "GET",
                dataType: "json",

                data: Model



                ,
                //   contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {

                    var Result = result.Table0
                    $('#theadid').html('');
                    $('#tbodyid').html('');


                    var thead_body = "";
                    var thead_row = "";
                    var colspan = 0;

                    if (Result.length > 0) {

                        for (var i = 0; i < Result.length; i++) {
                            var columnsIn = Result[0];// Coulms Name geting from First Row
                            thead_row += '<tr>'
                            for (var key in columnsIn) { // Printing Columns
                                if (i == 0) {
                                    colspan = colspan + 1
                                    thead_body += "<td class='ui-widget-header' id=" + key + "> " + key + " </td>";
                                }
                                var str1 = key == "User Name" || key == "Group Name" ? "" : "text-align: center;"
                                thead_row += "<td class='ui-widget-content' style= '" + str1 + "' id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? 'No' : Result[i][key]) + "</label></td>";
                            }
                            thead_row += '</tr>'
                        }
                    }

                    var str = '<tr><th class="ui-widget-header" colspan="2" style=" font-size:large;color: blue">User Details</th>' + '<th class="ui-widget-header" style=" font-size:large;color: blue" colspan="' + (colspan - 2) + '">Special Permission</th></tr>'
                    $('#theadid').append(str + '<tr>' + thead_body + '</tr>');
                    $('#tbodyid').append(thead_row);
                    $(".k-grid-header-wrap").closest('div').attr('style', 'overflow-x: scroll');
                    $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                    $("#Serial").closest('td').attr('style', 'color:#daecf4');
                    $("#Serial").closest('td').text('Seri');
                    if (Result.length == 0) {


                        ShowMessage('warning', 'Warning - User Special Permission Report', 'No Record Found.', " ", "bottom-right");
                        return false;
                        //$("#exportflight").hide();
                    }



                },
                complete: function (data) {

                    //$("#tblUserSpecialPermissionDetails tbody tr td").each(function () {
                    //    var i = $(this).closest('tr').index();
                    //    var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
                    //    var col = i % 2 == 0 ? "black" : "green";
                    //    $(this).attr('style', 'background:' + co, 'important');


                    //});
                    $("#btnExportToExcel_UserSpecialPermission").show();
                },
                error: function (xhr) {
                    var a = "";
                    ShowMessage('warning', 'Warning - User Special Permission Report', 'No Record Found.', " ", "bottom-right");

                }
            });


        }
    }
}



function ExportToExcel_UserSpecialPermission() {

    //  window.location.href = "../SearchSchedule/ExportToExcel?fromorigin=" + ddlorigin + "&todestination=" + ddldestination + "&flightdate=" + date + "&accountsno=" + ddl_hidenn_Text_Account + "&airlinecode=" + ddlairline + "&commoditycode=" + ddl_hiidenCommodity + "&productname=" + ddlhidenn_Text_Product + "&flightNumber=" + ddl_hidenn_Text_flightname + "&rateType=" + rate + "&RateRefNumber=" + RateRefNumber + "&SHCSNo=" + SHCSNo;
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
    $("#tblUserSpecialPermissionDetails tbody tr").each(function () {
        var i = $(this).index();
        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
        $(this).attr('style', 'background-color:' + co);
    });
    //------- end---------------------------------------
    //    $('#tblsearchrateList [id^="Serial"]').hide();
    //var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblUserSpecialPermissionDetails thead tr:eq(0)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblUserSpecialPermissionDetails tbody').html() + '</tbody></table></body></html>';


    //
    var table_div = '<html><body><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' +
    $('#tblUserSpecialPermissionDetails thead tr:eq(0)').html() + '</tr><tr  bgcolor="#7bd2f6">' + $('#tblUserSpecialPermissionDetails thead tr:eq(1)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblUserSpecialPermissionDetails tbody').html() + '</tbody></table></body></html>';


    //var table_html = table_div.replace(/ /g, '%20');
    //a.href = data_type + ', ' + table_html;
    //a.download = 'UserSpecialPermissionReport' + today + '_.xls';
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
    a.download = 'UserSpecialPermissionReport' + today + '_.xls';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

