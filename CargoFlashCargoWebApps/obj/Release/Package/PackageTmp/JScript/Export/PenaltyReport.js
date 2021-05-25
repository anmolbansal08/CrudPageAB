$(document).ready(function () 


{
    cfi.AutoComplete("AirLineName", "AirLineName", "vwAirLineName", "SNo", "AirLineName", null, null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $('.DateWiseRow').show();
    $('.AWBNoRow').show();
    $('.formSection').show();
  
    $('#btnSearch').show();
    $("#BlackListTbl").remove();

    $('#btnExportToExcel').hide();

    var AccountSno = 0;
    if (userContext.GroupName == 'ADMIN') {
        $("#NoShow").show();
        $("#Void").show();
        $("#Cancelation").show();
        AccountSNo = 0;
    }
    else if (userContext.GroupName == 'AGENT') {
        debugger;
        $("#NoShow").hide();
        $('label[for*=NoShow]').hide();
        $("#Void").hide();
        $('label[for*=Void]').hide();


        $("#Cancelation").show();

        AccountSNo = userContext.AgentSNo;



    }

    if (userContext.GroupName == 'AIRLINE') {
        $("#NoShow").show();
        $("#Void").show();
        $("#Cancelation").show();
        AccountSNo = 0;

      
    }

});


//function ExtraCondition(textId) {
//    if (userContext.GroupName == "AIRLINE") {
//        if (textId == "Text_AirLineName") {
//            var filterForwarderCode = cfi.getFilter("AND");
//            var filterForwarderName = cfi.getFilter("AND");
//            cfi.setFilter(filterForwarderCode, "SNo", "eq", userContext.AirlineSNo);
//            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
//            return ForwarderFilter;

//        }
//    }
//}


function SearchVoidData() {
    $("#BlackListTbl").remove();
    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();
    var AirLineSno = $('#AirLineName').val();

    var PenaltyType = $("input[name='PenaltyType']:checked").val();
    if ((PenaltyType != '1') && (PenaltyType != '0') && (PenaltyType != '3')) {

        alert("Please Select One of the Penalty");

        return false;
    }
    
    

    var WhereCondition = "";
    if (AirLineSno != "")
    {

        if (Date.parse(FromDate) > Date.parse(ToDate)) {

            alert('From Date can not be greater than To Date');
            return;
        }
        $.ajax({
            url: 'GetVoidData',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                PenaltyType: PenaltyType, AirLineSNo: AirLineSno, BookingFromDate: FromDate, BookingToDate: ToDate,AccountSNo:AccountSNo, WhereCondition: WhereCondition,
            },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='13' style='height: 30px;'></td></tr><tr> <th bgcolor='lightblue'>AWB/Reference Number</th> <th bgcolor='lightblue'>Booking Date</th>  <th bgcolor='lightblue'>Origin</th> <th bgcolor='lightblue'>Destination</th> <th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>Gr.Weight</th><th bgcolor='lightblue'>Volume</th> <th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Commodity</th> <th bgcolor='lightblue'>Total Penalty Charges</th><th bgcolor='lightblue'>Mode Of Penalty</th><th bgcolor='lightblue'>Executed By</th> <th id='threfid' bgcolor='lightblue'></th></tr></thead>";

                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {

                        str += " <tbody><tr>";
                        // str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                        //str += "<td>" + result.Data[i].AirLineName + "</td>";
                        str += "<td>" + result.Data[i].AWBNumber + "</td>";
                        str += "<td>" + result.Data[i].AWBDate + "</td>";

                        str += "<td>" + result.Data[i].Origin + "</td>";
                        str += "<td>" + result.Data[i].Destination + "</td>";
                        str += "<td>" + result.Data[i].AjentName + "</td>";
                        str += "<td>" + result.Data[i].PCS + "</td>";
                        str += "<td>" + result.Data[i].GrossWeight + "</td>";
                        str += "<td>" + result.Data[i].Volume + "</td>";
                        str += "<td>" + result.Data[i].ProductName + "</td>";
                        str += "<td>" + result.Data[i].Commidity + "</td>";

                        str += "<td id='GetPenalty'>" + result.Data[i].PenaltyCharges + "</td>";
                        str += "<td>" + result.Data[i].ModeOfPenalty + "</td>";
                        str += "<td>" + result.Data[i].UserName + "</td>";
                       
                    }
                    $('#btnExportToExcel').show();
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='13'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr></tbody>";
                    $('#Penalty').css('display', 'none');
                    $('#btnExportToExcel').hide();


                }
                str += "</table>";

                $('#BindBlakListTable').append(str);


                //////////////////////


                //var today = new Date();
                //var dd = today.getDate();
                //var mm = today.getMonth() + 1; 

                //var yyyy = today.getFullYear();
                //if (dd < 10) {
                //    dd = '0' + dd;
                //}
                //if (mm < 10) {
                //    mm = '0' + mm;
                //}
                //var today = dd + '_' + mm + '_' + yyyy;


                //var a = document.createElement('a');
                //var data_type = 'data:application/vnd.ms-excel';
                //var table_div = str;
                //var table_html = table_div.replace(/ /g, '%20');
                //a.href = data_type + ', ' + table_html;
                //a.download = 'PenaltyReport_' + today + '_.xls';
                //a.click();
                
                //return false


                /////////////////////////////
            }
        });
    }
}




function ExportToExcel() {
    $("#BlackListTbl").remove();
    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();
    var AirLineSno = $('#AirLineName').val();

    var PenaltyType = $("input[name='PenaltyType']:checked").val();
    if ((PenaltyType != '1') && (PenaltyType != '0') && (PenaltyType != '3')) {

        alert("Please Select One of the Penalty");

        return false;
    }



    var WhereCondition = "";
    if (AirLineSno != "") {

        if (Date.parse(FromDate) > Date.parse(ToDate)) {

            alert('From Date can not be greater than To Date');
            return;
        }
        $.ajax({
            url: 'GetVoidData',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                PenaltyType: PenaltyType, AirLineSNo: AirLineSno, BookingFromDate: FromDate, BookingToDate: ToDate, AccountSNo: AccountSNo, WhereCondition: WhereCondition,
            },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='13' style='height: 30px;'></td></tr><tr> <th bgcolor='lightblue'>AWB/Reference Number</th> <th bgcolor='lightblue'>Booking Date</th>  <th bgcolor='lightblue'>Origin</th> <th bgcolor='lightblue'>Destination</th> <th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>Gr.Weight</th><th bgcolor='lightblue'>Volume</th> <th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Commodity</th> <th bgcolor='lightblue'>Total Penalty Charges</th><th bgcolor='lightblue'>Mode Of Penalty</th><th bgcolor='lightblue'>Executed By</th> <th id='threfid' bgcolor='lightblue'></th></tr></thead>";

                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {

                        str += " <tbody><tr>";
                        // str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                        //str += "<td>" + result.Data[i].AirLineName + "</td>";
                        str += "<td>" + result.Data[i].AWBNumber + "</td>";
                        str += "<td>" + result.Data[i].AWBDate + "</td>";

                        str += "<td>" + result.Data[i].Origin + "</td>";
                        str += "<td>" + result.Data[i].Destination + "</td>";
                        str += "<td>" + result.Data[i].AjentName + "</td>";
                        str += "<td>" + result.Data[i].PCS + "</td>";
                        str += "<td>" + result.Data[i].GrossWeight + "</td>";
                        str += "<td>" + result.Data[i].Volume + "</td>";
                        str += "<td>" + result.Data[i].ProductName + "</td>";
                        str += "<td>" + result.Data[i].Commidity + "</td>";

                        str += "<td id='GetPenalty'>" + result.Data[i].PenaltyCharges + "</td>";
                        str += "<td>" + result.Data[i].ModeOfPenalty + "</td>";
                        str += "<td>" + result.Data[i].UserName + "</td>";

                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='13'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr></tbody>";
                    $('#Penalty').css('display', 'none');
                }
                str += "</table>";

                $('#BindBlakListTable').append(str);


                //////////////////////


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
                var table_div = str;
                var table_html = table_div.replace(/ /g, '%20');
                a.href = data_type + ', ' + table_html;
                a.download = 'PenaltyReport_' + today + '_.xls';
                a.click();

                return false


                /////////////////////////////
            }
        });
    }
}



//function ExportToExcel()
//{

//    var today = new Date();
//    var dd = today.getDate();
//    var mm = today.getMonth() + 1;

//    var yyyy = today.getFullYear();
//    if (dd < 10) {
//        dd = '0' + dd;
//    }
//    if (mm < 10) {
//        mm = '0' + mm;
//    }
//    var today = dd + '_' + mm + '_' + yyyy;


//    var a = document.createElement('a');
//    var data_type = 'data:application/vnd.ms-excel';
//    var table_div = str;
//    var table_html = table_div.replace(/ /g, '%20');
//    a.href = data_type + ', ' + table_html;
//    a.download = 'PenaltyReport_' + today + '_.xls';
//    a.click();
//    //}
//    return false
//}