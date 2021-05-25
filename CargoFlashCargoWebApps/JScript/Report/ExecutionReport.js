


$(document).ready(function () {


    cfi.AutoCompleteV2("Month", "monthnames,monthid", "ExecutionReport_Months", null, "contains");
    cfi.AutoCompleteV2("Year", "years,id", "ExecutionReport_Years", null, "contains");
   
    //cfi.DateType("FromDate");
    //cfi.DateType("ToDate");

    //$('#FromDate').attr('readonly', true);
    //$('#ToDate').attr('readonly', true);

    //var todaydate = new Date();
    //var validTodate = $("#ToDate").data("kendoDatePicker");
    //validTodate.min(todaydate);

   
    //$("#FromDate").change(function () {

    //    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
    //        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //        $("#ToDate").data("kendoDatePicker").value('');
    //    }
    //    else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
    //        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //    }
    //});


    $('#imgexcel').hide();

   
});



var Model = [];
function SearchExecutionReport() {



    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    Model = {
        
        Month: $('#Month').val(),
        Year: $('#Year').val()
    }
    





    if ( Model.Month != "" && Model.Year != "") {
        $.ajax({
            url: 'GetExecutionRecord',
            async: false,
            type: "POST",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
              //  $('#imgexcel').show();
                var DivID = document.getElementById("BindBlakListTable");
                DivID.innerHTML = "";
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>AWB Count</th><th bgcolor='lightblue'>POMail Count</th></tr></thead>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += " <tbody><tr>";
                        //if (Model.StatusType != '0') {
                        //    str += "<td><input type='button' id=" + result.Data[i].SNo + " value='Print' class='btn btn-success' onclick='RenderPrintCCA(this.id);' /></td>";
                        //}
                        //else {
                        //    str += "<td></td>";
                        //}
                        str += "<td> <a href='#' id='sample' onClick='ExportToExcel_ExecutionReport(0)'>" + result.Data[i].AWBCount + "</a></td>";
                        str += "<td><a href='#' id='sample1'>" + result.Data[i].POMailCount + "</a></td>";
                        //str += "<td>" + result.Data[i].Origin + "</td>";
                        //str += "<td>" + result.Data[i].Destination + "</td>";
                        //str += "<td>" + result.Data[i].flightno + "</td>";
                        //str += "<td>" + result.Data[i].CCAGrossWeight + "</td>";
                        //str += "<td>" + result.Data[i].CCAPieces + "</td>";
                        //str += "<td>" + result.Data[i].CCAVolume + "</td>";
                        //str += "<td>" + result.Data[i].AgentName + "</td>";
                        //str += "<td>" + result.Data[i].Status + "</td>";
                        //str += "<td>" + result.Data[i].CreatedBy + "</td>";
                        //str += "<td>" + result.Data[i].UpdatedUser + "</td>";
                        str += "</tr></tbody>";

                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='2'><center><p style='color:red'>Not Exists</p></center></td>";
                    str += "</tr></tbody>";
                }
                str += "</table>";
                DivID.innerHTML = str;

                $('#BlackList').css('display', 'block');

                return false
            },

        });
    }
}









function ExportToExcel_ExecutionReport(type) {

    var str = "";
    var recordtype = type;
    ExcelModel = {

        Month: $('#Month').val(),
        Year: $('#Year').val(),
        RecordType: recordtype
    }
    if (ExcelModel.FromDate != "" && ExcelModel.ToDate != "") {
        $.ajax({
            url: 'GetExecutionRecordDetail',
            async: false,
            type: "POST",
            method: "POST",
            dataType: "json",
            data: JSON.stringify(ExcelModel),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>AWB No</th><th bgcolor='lightblue'>Origin</th><th bgcolor='lightblue'>Destination</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>GrossWeight</th><th bgcolor='lightblue'>VolumeWeight</th><th bgcolor='lightblue'>CBM</th><th bgcolor='lightblue'>Status</th><th bgcolor='lightblue'>Created By</th></tr></thead>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += " <tbody><tr>";
                        str += "<td>" + result.Data[i].AWBNo + "</td>";
                          str += "<td>" + result.Data[i].Origin + "</td>";
                        str += "<td>" + result.Data[i].Destination + "</td>";
                        str += "<td>" + result.Data[i].Pieces + "</td>";
                        str += "<td>" + result.Data[i].Grossweight + "</td>";
                        str += "<td>" + result.Data[i].Volumeweight + "</td>";
                        str += "<td>" + result.Data[i].Cbm + "</td>";
                        str += "<td>" + result.Data[i].Status + "</td>";
                        str += "<td>" + result.Data[i].CreatedBy + "</td>";
                        str += "</tr></tbody>";

                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='9'><center><p style='color:red'>Not Exists</p></center></td>";
                    str += "</tr></tbody>";
                }
                str += "</table>";




                return false
            },

        });
    }



    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

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
    var table_div = str;
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    a.download = 'ExecutionReport_' + today + '_.xls';
    a.click();
    //}
    return false

}