var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("BranchOffice", "Name", "CargoClaimReport_BranchOffice", null, "contains");
    $("#MonthofClaim").kendoDatePicker({
        format: "yyyy",

    });
    $("#MonthofClaim").attr('required', true);
    cfi.AutoCompleteV2("StatusOfClaim", "Name", "CargoClaimReport_StatusOfClaim", null, "contains");
});

var model = [];
$('#btnSubmit').click(function () {

    if (cfi.IsValidSubmitSection()) {


        Model = {
            BranchOffice: $('#BranchOffice').val(),
            // Month: $('#MonthofClaim').val() == "" ? "0" : $('#MonthofClaim').val(),
            MonthofClaim: $('#MonthofClaim').val() == "" ? "0" : $('#MonthofClaim').val(),
            YearofClaim: $('#MonthofClaim').val() == "" ? "0" : $('#MonthofClaim').val(),
            StatusOfClaim: $('#StatusOfClaim').val(),
            IsAutoProcess: (OnBlob == true ? 0 : 1),

            PageSize: 10
        };

        if (OnBlob) {
            $.ajax({
                url: "../Reports/CargoClaimReport",
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
                url: "../CargoClaimReport/GetCargoClaimReport",
                async: false,
                type: "GET",
                dataType: "json",
                data: Model,
                //{
                // BranchOffice: BranchOffice, MonthofClaim: MonthofClaim, YearofClaim: YearofClaim, StatusOfClaim: StatusOfClaim,IsAutoProcess:IsAutoProcess
                //},
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
                            tr += '<tr class="datarow">';
                            var td = '';
                            td += "<td class='ui-widget-content'  id='BranchOffice'> <label  maxlength='100' style='width:100px;'>" + Result[i].BranchOffice + "</label></td>";
                            td += "<td class='ui-widget-content'  id='ClaimantName'> <label  maxlength='100' style='width:100px;'>" + Result[i].ClaimantName + "</label></td>";
                            td += "<td class='ui-widget-content'  id='AWBNO'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBNO + "</label></td>";
                            td += "<td class='ui-widget-content'  id='ExFlight'> <label  maxlength='100' style='width:100px;'>" + Result[i].ExFlight + "</label></td>";
                            td += "<td class='ui-widget-content'  id='Date'> <label  maxlength='100' style='width:100px;'>" + Result[i].Date + "</label></td>";

                            td += "<td class='ui-widget-content'  id='ROUTE'> <label  maxlength='100' style='width:100px;'>" + Result[i].ROUTE + "</label></td>";
                            td += "<td class='ui-widget-content'  id='AmountOfClaim'> <label  maxlength='100' style='width:100px;'>" + Result[i].AmountOfClaim + "</label></td>";

                            td += "<td class='ui-widget-content'  id='PaidByInsurance'> <label  maxlength='100' style='width:100px;'>" + Result[i].PaidByInsurance + "</label></td>";
                            td += "<td class='ui-widget-content'  id='PaidByGaruda'> <label  maxlength='100' style='width:100px;'>" + Result[i].PaidByGaruda + "</label></td>";

                            td += "<td class='ui-widget-content'  id='StationOfIrreg'> <label  maxlength='100' style='width:100px;'>" + Result[i].StationOfIrreg + "</label></td>";
                            td += "<td class='ui-widget-content'  id='DateClaimLetter'> <label  maxlength='100' style='width:100px;'>" + Result[i].DateClaimLetter + "</label></td>";

                            td += "<td class='ui-widget-content'  id='PCS'> <label  maxlength='100' style='width:100px;'>" + Result[i].PCS + "</label></td>";
                            td += "<td class='ui-widget-content'  id='KG'> <label  maxlength='100' style='width:100px;'>" + Result[i].KG + "</label></td>";

                            td += "<td class='ui-widget-content'  id='ReasonOfClaim'> <label  maxlength='100' style='width:100px;'>" + Result[i].ReasonOfClaim + "</label> </td>";

                            td += "<td class='ui-widget-content'  id='ClaimStatus'> <label  maxlength='100' style='width:100px;'>" + Result[i].ClaimStatus + "</label> </td>";

                            td += "<td class='ui-widget-content'  id='ClosedDateFinalRelease'> <label  maxlength='100' style='width:100px;'>" + Result[i].ClosedDateFinalRelease + "</label> </td>";

                            td += "<td class='ui-widget-content'  id='Remark'> <label  maxlength='100' style='width:100px;'>" + Result[i].Remark + "</label> </td>";

                            tr += td + "</tr>";
                        }
                        container.append(tr);

                    }
                    else {
                        $("#gridbodys").append('<tr><td colspan="17" align="center">NO RECORD FOUND</td></tr>')
                    }



                },
                error: function (xhr) {
                    var a = "";
                }

            });
        }
    }
});

function ExportToExcel_CargoClaimReport() {
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

    var table_div = '<table style=border:1px solid black;>' + $('#tblgrid').html() + '</table>';
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    //a.download = 'AllotmentReport_Flight' + today + '_.xls';
    a.download = 'CargoClaimReport' + today + '_.xls';
    a.click();

    return false
}

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    //var filterEmbargo1 = cfi.getFilter("OR");
    //StatusOfClaim
    if (textId == "Text_BranchOffice") {

        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        //cfi.setFilter(filterEmbargo, "IsHeadOffice", "eq", 0);
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }

    if (textId == "Text_StatusOfClaim") {

        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.setFilter(filterEmbargo, "ApplicationSNo", "eq", 6);
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }

}


