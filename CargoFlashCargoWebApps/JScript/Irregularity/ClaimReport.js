var OnBlob = false;

$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    //cfi.AutoCompleteV2("BranchOffice", "Name", "ClaimReport_Office", null, "contains");
    cfi.AutoCompleteV2("ClaimStatusSNo", "Name", "Claim_ClaimStatus", null, "contains");

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

    //$("[id='CustomerType']").click(function () {
    //    if ($("#CustomerType:checked").val() == '0') {
    //        parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=ComplainReport&FormAction=NEW')
    //    }
    //    if ($("#CustomerType:checked").val() == '1') {
    //        parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=IrregularityReport&FormAction=NEW')
    //    }
    //    if ($("#CustomerType:checked").val() == '2') {
    //        parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=ComplainReport&FormAction=NEW')
    //    }
    //})
});
var Model = [];
$('#btnSubmit').click(function () {
    Model = {
        Status: $('#ClaimStatusSNo').val(),
        fromdate: $('#Fromdate').val(),
        todate: $('#Todate').val(),
        ClaimType: $('input[type="radio"][name=ClaimType]:checked').val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)


    };

    if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

        alert('From Date can not be greater than To Date');
        return false;;
    }
    var ClaimType = ''
    if ($("#ClaimType:checked").val() == 0) {
        ClaimType = 0
    }
    if ($("#ClaimType:checked").val() == 1) {
        ClaimType = 1
    }
    if (cfi.IsValidSubmitSection()) {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/ClaimReport",
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
                url: "../ClaimReport/GetClaimReport",
                async: false,
                type: "GET",
                dataType: "json",
                data: Model,
                //{
                // Status: Status, fromdate: fromdate, todate: todate, ClaimType: ClaimType
                // },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    $('#grid').show();
                    $('#gridbodys').html('');

                    var Result1 = jQuery.parseJSON(result.Result);
                    var Result = Result1.Table0;

                    var thead_body = "";
                    var thead_row = "";

                    if (Result.length > 1) {
                        $('#exportflight').show();
                        var container = $("#gridbodys");
                        var tr = '';
                        for (var i = 0; i < Result.length; i++) {
                            var count = i + 1;

                            tr += '<tr class="datarow">';
                            var td = '';
                            td += "<td class='ui-widget-content'  id='NO'> <label  maxlength='100' style='width:100px;'>" + count + "</label></td>";
                            td += "<td class='ui-widget-content'  id='REFNO'> <label  maxlength='100' style='width:100px;'>" + Result[i].CaseNumber + "</label></td>";
                            td += "<td class='ui-widget-content'  id='BRANCHOFFICE'> <label  maxlength='100' style='width:100px;'>" + Result[i].BOClaim + "</label></td>";
                            td += "<td class='ui-widget-content'  id='CLAIMANT'> <label  maxlength='100' style='width:100px;'>" + Result[i].Claimant + "</label></td>";
                            td += "<td class='ui-widget-content'  id='AWB'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBN0 + "</label></td>";
                            td += "<td class='ui-widget-content'  id='FLTNO'> <label  maxlength='100' style='width:100px;'>" + Result[i].FlightNo + "</label></td>";

                            td += "<td class='ui-widget-content'  id='FLTDATE'> <label  maxlength='100' style='width:100px;'>" + Result[i].FlightDate + "</label></td>";
                            td += "<td class='ui-widget-content'  id='Origin'> <label  maxlength='100' style='width:100px;'>" + Result[i].Origin + "</label></td>";

                            td += "<td class='ui-widget-content'  id='Transit'> <label  maxlength='100' style='width:100px;'>" + Result[i].Transit + "</label></td>";
                            td += "<td class='ui-widget-content'  id='Destination'> <label  maxlength='100' style='width:100px;'>" + Result[i].Destination + "</label></td>";

                            td += "<td class='ui-widget-content'  id='CLAIMTYPE'> <label  maxlength='100' style='width:100px;'>" + Result[i].TypeofClaim + "</label></td>";
                            td += "<td class='ui-widget-content'  id='PCS'> <label  maxlength='100' style='width:100px;'>" + Result[i].Pieces + "</label></td>";

                            td += "<td class='ui-widget-content'  id='KGS'> <label  maxlength='100' style='width:100px;'>" + Result[i].Weight + "</label></td>";
                            td += "<td class='ui-widget-content'  id='IDR'> <label  maxlength='100' style='width:100px;'>" + Result[i].IDRAmt + "</label></td>";
                            td += "<td class='ui-widget-content'  id='USD'> <label  maxlength='100' style='width:100px;'>" + Result[i].USDAmt + "</label></td>";
                            td += "<td class='ui-widget-content'  id='ROOTCAUSED'> <label  maxlength='100' style='width:100px;'>" + Result[i].Remarks + "</label></td>";
                            td += "<td class='ui-widget-content'  id='IDR'> <label  maxlength='100' style='width:100px;'>" + Result[i].IDRSetAmt + "</label></td>";
                            td += "<td class='ui-widget-content'  id='USD'> <label  maxlength='100' style='width:100px;'>" + Result[i].USDSetAmt + "</label></td>";
                            td += "<td class='ui-widget-content'  id='CLAIMSTATUS'> <label  maxlength='100' style='width:100px;'>" + Result[i].ClaimStatus + "</label></td>";
                            td += "<td class='ui-widget-content'  id='FINALRELEASEDSIGNED'> <label  maxlength='100' style='width:100px;'>" + Result[i].UserName + "</label></td>";

                            //td += "<td class='ui-widget-content'  id='CaseNumber'> <label  maxlength='100' style='width:100px;'>" + Result[i].CaseNumber + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='AWBN0'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBN0 + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='DateTimeOpened'> <label  maxlength='100' style='width:100px;'>" + Result[i].DateTimeOpened + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='DateTimeClosed'> <label  maxlength='100' style='width:100px;'>" + Result[i].DateTimeClosed + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='TypeofClaim'> <label  maxlength='100' style='width:100px;'>" + Result[i].TypeofClaim + "</label></td>";

                            //td += "<td class='ui-widget-content'  id='Claimant'> <label  maxlength='100' style='width:100px;'>" + Result[i].Claimant + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='BOClaim'> <label  maxlength='100' style='width:100px;'>" + Result[i].BOClaim + "</label></td>";

                            //td += "<td class='ui-widget-content'  id='StasiunIregularity'> <label  maxlength='100' style='width:100px;'>" + Result[i].StasiunIregularity + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='AmountofClaim'> <label  maxlength='100' style='width:100px;'>" + Result[i].AmountofClaim + "</label></td>";

                            //td += "<td class='ui-widget-content'  id='SettledPayment'> <label  maxlength='100' style='width:100px;'>" + Result[i].SettledPayment + "</label></td>";
                            //td += "<td class='ui-widget-content'  id='ClaimStatus'> <label  maxlength='100' style='width:100px;'>" + Result[i].ClaimStatus + "</label></td>";

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




function ExportToExcel_ClaimReport() {
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
    a.download = 'ClaimReport' + today + '_.xls';
    a.click();

    return false
}


function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    var filterClaim = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");
    //StatusOfClaim
    //if (textId == "Text_BranchOffice") {

    //    cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
    //    //cfi.setFilter(filterEmbargo, "IsHeadOffice", "eq", 0);
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //    return OriginCityAutoCompleteFilter2;

    //}
    //if (textId.indexOf("Text_ClaimStatusSNo") >= 0) {
    //    cfi.setFilter(filterClaim, "ApplicationSNo", "eq", 6);
    //    cfi.setFilter(filterClaim, "IsActive", "eq", 1);
    //    //if (userContext.CitySNo != 3992) {
    //    //    cfi.setFilter(filterClaim, "SNo", "neq", 41);
    //    //}
    //    var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
    //    return ComplainAutoCompleteFilter;
    //}
    //if (textId == "Text_StatusOfClaim") {

    //    cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
    //    cfi.setFilter(filterEmbargo, "ApplicationSNo", "eq", 6);
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //    return OriginCityAutoCompleteFilter2;

    //}

}
