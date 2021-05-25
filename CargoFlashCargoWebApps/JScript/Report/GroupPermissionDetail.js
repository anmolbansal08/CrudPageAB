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
    cfi.AutoCompleteV2("GroupName", "GroupName", "Report_GroupName", null, "contains");
    cfi.AutoCompleteV2("PageName", "PageName", "Report_PageName", null, "contains");
    cfi.AutoCompleteV2("ModuleName", "PageName", "Report_ModuleName", null, "contains");
    $("#btnExportToExcelgrouppermissiondetail").prop("style").display = "none"

});


var Model = [];
function GetGroupPermissionDetail() {

    Model = {
        AirlineSNo: $("#AirlineSNo").val(),
        GroupName: $("#Text_GroupName").val(),
        ModuleName: $("#Text_ModuleName").val(),
        PageName: $("#Text_PageName").val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)
    }


    if (cfi.IsValidSubmitSection()) {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/GroupPermission",
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
                url: "../GroupPermissionDetail/GetGroupPermissionDetail",
                async: true,
                type: "GET",
                dataType: "json",

                data: Model,
                //contentType: "application/json; charset=utf-8", cache: false,
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
                                var str1 = key == "Module" || key == "Description" ? "" : "text-align: center;"
                                thead_row += "<td class='ui-widget-content' style= '" + str1 + "' id=" + key + i + "> <label  maxlength='100' style='width:100px;'>" + (Result[i][key] == '' ? '-' : Result[i][key]) + "</label></td>";
                            }
                            thead_row += '</tr>'
                        }
                    }

                    var str = '<tr><th class="ui-widget-header" colspan="2" style=" font-size:large;color: blue">Role/Transaction Code Matrix</th>' + '<th class="ui-widget-header" style=" font-size:large;color: blue" colspan="' + (colspan - 2) + '">Assignment</th></tr>'
                    $('#theadid').append(str + '<tr>' + thead_body + '</tr>');
                    $('#tbodyid').append(thead_row);
                    $(".k-grid-header-wrap").closest('div').attr('style', 'overflow-x: scroll');
                    $('tbody [id^= "Serial"]').attr('style', 'text-align : center');
                    $("#Serial").closest('td').attr('style', 'color:#daecf4');
                    $("#Serial").closest('td').text('Seri');
                    if (Result.length == 0) {


                        ShowMessage('warning', 'Warning - Group Permission  Report', 'No Record Found.', " ", "bottom-right");
                        return false;
                        //$("#exportflight").hide();
                    }



                },
                complete: function (data) {
                    $("#tbcedr").remove();
                    $("#tblgrouppermissionDetail").before('<table id= "tbcedr" style="text-align: center; width: 140px;font-size: larger;" cellspacing=0 border="1px" ><tbody><tr><td>C</td><td>Create</td></tr><tr><td>E</td><td>Edit</td></tr><tr><td>D</td><td>Delete</td></tr><tr><td>R</td><td>Read</td></tr></tbody></table>')

                    $("#btnExportToExcelgrouppermissiondetail").show();


                },
                error: function (xhr) {
                    var a = "";
                }
            });

        }

    }
}



function ExportToExcel_GroupPermissionDetail() {

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
    $("#tblgrouppermissionDetail tbody tr").each(function () {
        var i = $(this).index();
        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
        $(this).attr('style', 'background-color:' + co);
    });
    //------- end---------------------------------------
    //    $('#tblsearchrateList [id^="Serial"]').hide();
    var table_div = '<html><body><table>' + $("#tbcedr").html() + '</table><table width="100%" cellspacing=0 border="1px"><thead><tr bgcolor="#7bd2f6">' + $('#tblgrouppermissionDetail thead tr:eq(0)').html() + '</tr><tr  bgcolor="#7bd2f6">' + $('#tblgrouppermissionDetail thead tr:eq(1)').html() + '</tr></thead><tbody class="ui-widget-content">' + $('#tblgrouppermissionDetail tbody').html() + '</tbody></table></body></html>';

    //var table_html = table_div.replace(/ /g, '%20');
    //a.href = data_type + ', ' + table_html;
    //a.download = 'UserGroupDetailReport' + today + '_.xls';
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
    a.download = 'UserGroupDetailReport' + today + '_.xls';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

function ExtraCondition(textId) {


    var filterAirlineSNo = cfi.getFilter("AND");

    if (textId.indexOf("Text_PageName") >= 0) {
        var filter1 = cfi.getFilter("AND");
        // cfi.setFilter(filter1, "SNO", "notin", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        if ($("#ModuleName").val() != "" && $("#ModuleName").val() != undefined && $("#ModuleName").val() != 0) {
            cfi.setFilter(filter1, "MenuSNo", "eq", $("#ModuleName").val());
        }
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
}
