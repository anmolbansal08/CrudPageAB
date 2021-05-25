var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    $(document.body).append('<script type="text/javascript" src="../JScript/Shipment/table2excel.js" ></script>');
    //cfi.AutoCompleteV2("BranchOffice", "Name", "ClaimReport_Office", null, "contains");
    cfi.AutoCompleteV2("ComplaintStatusSNo", "Name", "Complaint_ComplaintStatus", null, "contains");
    cfi.AutoCompleteV2("ComplaintSourceSNo", "Name", "Complaint_ComplaintSource", null, "contains");
    $("#Fromdate").kendoDatePicker({

        format: "dd-MMM-yyyy"
    });
    $("#Todate").kendoDatePicker({

        format: "dd-MMM-yyyy"
    });
    $(document).on("change", "#Fromdate", function () {
        $("#Todate").data("kendoDatePicker").value(" ");
        var startDate = new Date($('#Fromdate').val());
        $("#Todate").data("kendoDatePicker").min(startDate);
    });
    $("#Fromdate").prop('readonly', true);
    $("#Todate").prop('readonly', true);
});

    $('#btnSubmit').click(function () {
        if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

            alert('From Date can not be greater than To Date');
            return false;;
        }
        var Model = [];
        if (cfi.IsValidSubmitSection()) {
            //var BranchOffice = $('#BranchOffice').val();
            Model = {
                Status: $('#ComplaintStatusSNo').val(),
                fromdate: $('#Fromdate').val(),
                todate: $('#Todate').val(),
                ComplaintSource: $('#ComplaintSourceSNo').val(),
                IsAutoProcess: (OnBlob == true ? 0 : 1)
            };
            if (OnBlob) {
                $.ajax({
                    url: "../Reports/ComplainReport",
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
                    url: "../ComplainReport/GetComplainReport",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data:Model,
                        //{
                      //  Status: Status, fromdate: fromdate, todate: todate, ComplaintSource: ComplaintSource
                   // },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        $('#grid').show();
                        $('#gridbodys').html('');

                        var Result1 = jQuery.parseJSON(result.Result);
                        var Result = Result1.Table0;

                        var thead_body = "";
                        var thead_row = "";

                        if (Result.length > 0) {
                            $('#exportflight').show();
                            var container = $("#gridbodys");
                            var tr = '';
                            for (var i = 0; i < Result.length; i++) {
                                var count = i+1;
                                tr += '<tr class="datarow">';
                                var td = '';
                                td += "<td class='ui-widget-content'  id='No'> <span  maxlength='100' style='width:100px;'>" + count + "</span></td>";
                                td += "<td class='ui-widget-content'  id='ComplainNo'> <span  maxlength='100' style='width:100px;'>" + Result[i].CaseNumber + "</span></td>";
                                td += "<td class='ui-widget-content'  id='ComplainSource'> <span  maxlength='100' style='width:100px;'>" + Result[i].ComplaintSource + "</span></td>";
                                td += "<td class='ui-widget-content'  id='DTClosed'> <span  maxlength='100' style='width:100px;'>" + Result[i].DateTimeClosed + "</span></td>";
                                td += "<td class='ui-widget-content'  id='DTopen'> <span  maxlength='100' style='width:100px;'>" + Result[i].DateTimeOpened + "</span></td>";
                                td += "<td class='ui-widget-content'  id='ComplainSubject'> <span  maxlength='100' style='width:100px;'>" + Result[i].SubjectofComplain + "</span></td>";
                                td += "<td class='ui-widget-content'  id='CUSTOMER'> <span  maxlength='100' style='width:100px;'>" + Result[i].CUSTOMER + "</span></td>";
                                td += "<td class='ui-widget-content'  id='AWB'> <span  maxlength='100' style='width:100px;'>" + Result[i].AWBNO + "</span></td>";
                                td += "<td class='ui-widget-content'  id='FLTNO'> <span  maxlength='100' style='width:100px;'>" + Result[i].FlightNo + "</span></td>";
                                td += "<td class='ui-widget-content'  id='FLTDATE'> <span  maxlength='100' style='width:100px;'>" + Result[i].FlightDate + "</span></td>";
                                td += "<td class='ui-widget-content'  id='Origin'> <span  maxlength='100' style='width:100px;'>" + Result[i].Origin + "</span></td>";
                                td += "<td class='ui-widget-content'  id='Destination'> <span  maxlength='100' style='width:100px;'>" + Result[i].Destination + "</span></td>";
                                td += "<td class='ui-widget-content'  id='Commodity'> <span  maxlength='100' style='width:100px;'>" + Result[i].Commodity + "</span></td>";
                                td += "<td class='ui-widget-content'  id='PCS'> <span  maxlength='100' style='width:100px;'>" + Result[i].TotalPieces + "</span></td>";
                                td += "<td class='ui-widget-content'  id='KGS'> <span  maxlength='100' style='width:100px;'>" + Result[i].TotalGrossWeight + "</span></td>";
                                td += "<td class='ui-widget-content'  id='13 DAYS'> <span  maxlength='100' style='width:100px;'>" + Result[i].LessThenthree + "</span></td>";
                                td += "<td class='ui-widget-content'  id='46 DAYS'> <span  maxlength='100' style='width:100px;'>" + Result[i].FourToSix + "</span></td>";
                                td += "<td class='ui-widget-content'  id='7DAYS'> <span  maxlength='100' style='width:100px;'>" + Result[i].GreaterThenSeven + "</span></td>";
                                td += "<td class='ui-widget-content'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'>" + Result[i].ComplainStatus + "</span></td>";
                                td += "<td class='ui-widget-content'  id='NOTICE'> <span  maxlength='100' style='width:100px;'></span></td>";
                                //td += "<td class='ui-widget-content'  id='CaseNumber'> <label  maxlength='100' style='width:100px;'>" + Result[i].CaseNumber + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='AWBNO'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBNO + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='DateTimeOpened'> <label  maxlength='100' style='width:100px;'>" + Result[i].DateTimeOpened + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='DateTimeClosed'> <label  maxlength='100' style='width:100px;'>" + Result[i].DateTimeClosed + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='SubjectofComplain'> <label  maxlength='100' style='width:100px;'>" + Result[i].SubjectofComplain + "</label></td>";

                                //td += "<td class='ui-widget-content'  id='AccountName'> <label  maxlength='100' style='width:100px;'>" + Result[i].AccountName + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='ComplainStatus'> <label  maxlength='100' style='width:100px;'>" + Result[i].ComplainStatus + "</label></td>";

                                //td += "<td class='ui-widget-content'  id='ComplainImportancy'> <label  maxlength='100' style='width:100px;'>" + Result[i].ComplainImportancy + "</label></td>";
                                //td += "<td class='ui-widget-content'  id='Remarks'> <label  maxlength='100' style='width:100px;'>" + Result[i].Remarks + "</label></td>";



                                tr += td + "</tr>";
                            }
                            container.append(tr);

                        }
                        else {
                            $("#gridbodys").append('<tr><td colspan="20" align="center">NO RECORD FOUND</td></tr>')
                        }



                    },
                    error: function (xhr) {
                        var a = "";
                    }

                });
            }
        }
    });




function ExportToExcel_ComplainReport() {
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

    var table_div = '<table>' + $('#tblgrid').html() + '</table>';
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    //a.download = 'AllotmentReport_Flight' + today + '_.xls';
    a.download = 'ComplainReport' + today + '_.xls';
    a.click();

    return false
    //$("#tblgrid").table2excel({
    //    // exclude CSS class
    //    exclude: "",
    //    name: "ComplainReport.xls",
    //    filename: "ComplainReport.xls" //do not include extension
    //});
}


function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    var filterComplain = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");
    //StatusOfClaim
    //if (textId == "Text_BranchOffice") {

    //    cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
    //    //cfi.setFilter(filterEmbargo, "IsHeadOffice", "eq", 0);
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //    return OriginCityAutoCompleteFilter2;

    //}
    if (textId.indexOf("Text_ComplaintSourceSNo") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 1);
        //cfi.setFilter(filterComplain, "Name", "notin", "CLOSED");
        //if (userContext.CitySNo != 3992) {
        //    cfi.setFilter(filterComplain, "SNo", "neq", 13);
        //}
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId == "Text_StatusOfClaim") {

        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.setFilter(filterEmbargo, "ApplicationSNo", "eq", 6);
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }

}
