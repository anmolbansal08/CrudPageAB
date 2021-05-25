


$(document).ready(function () {


    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "IndividualSalesReport_Airline", null, "contains");
    cfi.AutoCompleteV2("POSCode", "AccountCode", "IndividualSalesReport_Code", null, "contains");
    cfi.AutoCompleteV2("POSNameSNo", "AccountCode,Name", "IndividualSalesReport_AccountCode", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CityCode,CityName", "IndividualSalesReport_City", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "IndividualSalesReport_City", null, "contains");

    var PaymentStatuskey = [{ Key: "1", Text: "PAID" }, { Key: "2", Text: "UNPAID" }, { Key: "3", Text: "REFUND" }, { Key: "4", Text: "CANCEL" }, { Key: "5", Text: "ALL" }];
    cfi.AutoCompleteByDataSource("PaymentStatus", PaymentStatuskey);
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("#FromDate").change(function () {

        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
    });


    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineSNo").val(userContext.AirlineSNo);
        $("#Text_AirlineSNo_input").val(userContext.AirlineCarrierCode);
    }

    if (userContext.CitySNo != "" && userContext.CityCode != "" && userContext.CityName != "") {
        $("#OriginSNo").val(userContext.CitySNo);
        $("#Text_OriginSNo_input").val(userContext.CityCode + '-' + userContext.CityName);
    }

    $('#imgexcel').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({

        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../PointOfSales/PointOfSalesGetRecord",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {

                        return { Model: Model };
                    }

                }, parameterMap: function (options) {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        RowNo: { type: "string" },
                        POSCode: { type: "string" },
                        POSName: { type: "string" },
                        AWBNo: { type: "string" },
                        MOP: { type: "string" },
                        Org: { type: "string" },
                        Dest: { type: "string" },
                        CCANo: { type: "string" },
                        ChWt: { type: "string" },
                        Commodity: { type: "string" },
                        FrtCharges: { type: "string" },
                        Comm: { type: "string" },
                        Disc: { type: "string" },
                        TotalOtherCharges: { type: "string" },
                        TotalNet: { type: "string" },
                        RefundFee: { type: "string" },
                        Curr: { type: "string" },
                        RecieptNo: { type: "string" },
                        PaymentDetailsFormOfPayment: { type: "string" },
                        PaymentDetailsAmount: { type: "string" },
                        PaymentDetailsBankName: { type: "string" },
                        PaymentDetailsCardType: { type: "string" },
                        PaymentDetailsCardNo: { type: "string" },
                        UserId: { type: "string" },
                        IssueDate: { type: "string" },
                        PaymentDate: { type: "string" },
                        Remarks: { type: "string" },
                        PaymentStatus: { type: "string" },
                        Tax: { type: "string" },
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),

        //detailInit: detailInit,
        //filterable: { mode: 'menu' },
        sortable: false, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        //height: 450,
        columns: [
            { field: "RowNo", title: "No.", width: 40 },
            { field: "POSCode", title: "POS Code", width: 130 },
            { field: "POSName", title: "POS Name", width: 130 },
            { field: "AWBNo", title: "AWB No", width: 90 },
            { field: "MOP", title: "MOP", width: 70 },
            { field: "Org", title: "Org", width: 70 },
            { field: "Dest", title: "Dest", width: 70 },
             { field: "CCANo", title: "CCA No", width: 130 },
            { field: "ChWt", title: "Chargeable Wt(Kgs)", width: 130 },
            { field: "Commodity", title: "Commodity", width: 70 },
            { field: "FrtCharges", title: "Frt + Val", width: 90 },
            { field: "Comm", title: "Comm", width: 70 },
            { field: "Disc", title: "Disc", width: 70 },
            { field: "TotalOtherCharges", title: "Total Other Charges", width: 130 },
            { field: "Tax", title: "Tax", width: 130 },
            { field: "TotalNet", title: "Total Net", width: 90 },
            { field: "RefundFee", title: "Refund Fee", width: 90 },
            { field: "Curr", title: "Curr", width: 70 },
            { field: "RecieptNo", title: "Reciept No", width: 90 },
            {
                headerTemplate: "<div style='text-align: center;color: blue;font-weight: bold'>Payment Details</div>",
                columns: [
                   { field: "PaymentDetailsFormOfPayment", headerTemplate: "<span style='color: blue;font-weight: bold'>Form Of Payment</span>", width: 130 },
                   { field: "PaymentDetailsAmount", headerTemplate: "<span style='color: blue;font-weight: bold'>Amount</span>", width: 90 },
                   { field: "PaymentDetailsBankName", headerTemplate: "<span style='color: blue;font-weight: bold'>Bank Name</span>", width: 130 },
                   { field: "PaymentDetailsCardType", headerTemplate: "<span style='color: blue;font-weight: bold'>Card Type</span>", width: 130 },
                   { field: "PaymentDetailsCardNo", headerTemplate: "<span style='color: blue;font-weight: bold'>Card No</span>", width: 130 },
                   { field: "PaymentDate", headerTemplate: "<span style='color: blue;font-weight: bold'>Payment Date</span>", width: 90 },
                   { field: "PaymentStatus", headerTemplate: "<span style='color: blue;font-weight: bold'>Payment Status</span>", width: 130 }
                ]
            },
            { field: "UserId", title: "UserId", width: 90 },
             { field: "IssueDate", title: "Issue Date", width: 90 },
             { field: "AWBStatus", title: "AWB Status", width: 130 },
            { field: "Remarks", title: "Remarks", width: 130 }

        ]
    });



    //---------------------------------------------------------------------------------Summary------------------

    $('#gridSummary').css('display', 'none')
    $("#gridSummary").kendoGrid({

        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../PointOfSales/PointOfSalesGetRecordForSummary",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {

                        return { Model: Model };
                    }

                }, parameterMap: function (options) {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        Curr: { type: "string" },
                        TotalFreightCharges: { type: "string" },
                        TotalOtherCharges: { type: "string" },
                        TotalAWBRefundFee: { type: "string" },
                        TotalCash: { type: "string" },
                        TotalCredit: { type: "string" },
                        TotalAutodebet: { type: "string" },
                        TotalSettlement: { type: "string" },
                        Difference: { type: "string" },

                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),

        //detailInit: detailInit,
        //filterable: { mode: 'menu' },
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        //height: 450,
        columns: [
            { field: "Curr", title: "Curr" },
            { field: "TotalFreightCharges", title: "Total Frt+Val Amount" },
            { field: "TotalOtherCharges", title: "Total Other Charges" },
            { field: "TotalAWBRefundFee", title: "Total AWB Refund Fee" },
            { field: "TotalCash", title: "Total Cash" },
            { field: "TotalCredit", title: "Total Credit" },
            { field: "TotalAutodebet", title: "Total Auto debet" },
            { field: "TotalSettlement", title: "Total Settlement" },
            { field: "Difference", title: "Difference" }

        ]
    });
});



//$('input[type=radio][name="Filter"]').click(function () {
//    if (this.value == "1") {
//        cfi.EnableAutoComplete('UserSNo', false, false, null);//diasble
//        $('#UserSNo').val('');
//        $('#Text_UserSNo_input').val('');
//    }
//    else {
//        cfi.EnableAutoComplete('UserSNo', true, true, null);//diasble

//    }
//});


var Model = [];
var FilterModel=[];
function SearchDailySalesReportPOS() {
    Model = {
        AirlineSNo: $('#AirlineSNo').val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),
        OriginSNo: $("#OriginSNo").val(),
        DestinationSNo: $("#DestinationSNo").val() == "" ? "0" : $("#DestinationSNo").val(),
        Type: $('input[type="radio"][name=Filter]:checked').val(),
        AccountSNo: $('#POSNameSNo').val() == "" ? "0" : $('#POSNameSNo').val(),
        POSCode: $('#POSCode').val() == undefined ? "0" : $('#POSCode').val() == "" ? "0" : $('#POSCode').val(),
        PaymentStatus : $('#PaymentStatus').val()
    }

    FilterModel = {
        Airline: $('#Text_AirlineSNo_input').val(), 
        PaymentStatus : $('#Text_PaymentStatus_input').val(),
        Origin: $("#Text_OriginSNo_input").val(),
        Destination: $("#Text_DestinationSNo_input").val(),
        FromDate: $("#FromDate").val(),
        ToDate: $("#ToDate").val(),     
        POSCode: $('#Text_POSCode_input').val(),
        Type: $('input[type="radio"][name=Filter]:checked').val()=='0'?'Individual':'Summary',
        POSName: $('#Text_POSNameSNo_input').val()
    }

    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Post Flight Report', "From Date can not be greater than To Date !");
        //alert('From Date can not be greater than To Date');
        return false;;
    }

    if (Model.AirlineSNo != "" && Model.OriginSNo != "" && Model.FromDate != "" && Model.ToDate != "") {

        if (Model.Type == "0") {
            $('#gridSummary').hide();
            $('#grid').css('display', '')
            $("#grid").data('kendoGrid').dataSource.page(1);
            $('#imgexcel').show();
        } else if (Model.Type == "1") {
            $('#grid').hide();
            $('#gridSummary').css('display', '')
            $("#gridSummary").data('kendoGrid').dataSource.page(1);
            $('#imgexcel').show();
        }
    }
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");



    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_DestinationSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_OriginSNo") {
        //cfi.setFilter(filterAirline, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterAirline);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_POSNameSNo") {
        if ($('#OriginSNo').val() != "" && $('#OriginSNo').val() != undefined && $('#OriginSNo').val() != "0") {
            cfi.setFilter(filterAirline, "CitySNo", "eq", $('#OriginSNo').val());
        }
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
    else if (textId == "Text_POSCode") {
        if ($('#OriginSNo').val() != "" && $('#OriginSNo').val() != undefined && $('#OriginSNo').val() != "0") {
            cfi.setFilter(filterAirline, "CitySNo", "eq", $('#OriginSNo').val());
        }
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

}


function ExportToExcel_PointOfSalesReport() {

    
    if (Model.AirlineSNo != "" && Model.OriginSNo != "" && Model.FromDate != "" && Model.ToDate != "") {

        if (Model.Type == "0") {
            GetExcel()
        }
        else if (Model.Type == "1") {
            GetExcelForSummary()
        }
    }
    
}


function GetExcel() {

    if (Model.AirlineSNo != "" && Model.OriginSNo != "" && Model.FromDate != "" && Model.ToDate != "") {        
        $.ajax({
            url: '../PointOfSales/ExportToExcel',
            async: true,
            type: "POST",
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                var str = "<html><body><table border='1' style='border : 1px solid black;border-collapse: collapse;'>" +
                "<thead>" +
                "<tr><th colspan='30'><table border='1' style='border : 1px solid black;border-collapse: collapse;'><tbody><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Airline :</td><td style='width:50%; text-align:left;' >" + FilterModel.Airline + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Payment Status :</td><td style='width:50%; text-align:left;'>" + FilterModel.PaymentStatus + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Origin :</td><td style='width:50%; text-align:left;'>" + FilterModel.Origin + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >Destination :</td><td style='width:50%; text-align:left;'>" + FilterModel.Destination + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >POS Code :</td><td style='width:50%; text-align:left;'>" + FilterModel.POSCode + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >POS Name :</td><td style='width:50%; text-align:left;'>" + FilterModel.POSName + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >From Date :</td><td style='width:50%; text-align:left;'>" + FilterModel.FromDate + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>End Date :</td><td style='width:50%; text-align:left;'>" + FilterModel.ToDate + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Report Type :</td><td style='width:50%; text-align:left;'>" + FilterModel.Type + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '></td><td style='width:50%; text-align:left;'></td></tr></tbody></table></th></tr>" +
                "<tr><th colspan='30' style='height:40px;'>Daily Sales Report - POS</th></tr>" +
                "<tr style='background-color: #daecf4'>" +
                "<th rowspan='2'>No</th>" +
                "<th rowspan='2'>Pos Code</th>" +
                "<th rowspan='2'>Pos Name</th>" +
                "<th rowspan='2' >AWB No</th>" +
                "<th rowspan='2'>MOP</th>" +
                "<th rowspan='2'>Org</th>" +
                "<th rowspan='2'>Dest</th>" +
                "<th rowspan='2'>CCA No</th>" +
                "<th rowspan='2'>Chargeable Wt(Kgs)</th>" +
                "<th rowspan='2'>Commodity</th>" +
                "<th rowspan='2'>Frt + Val</th>" +
                "<th rowspan='2'>Comm</th>" +
                "<th rowspan='2'>Disc</th>" +
                "<th rowspan='2'>Total Other Charges</th>" +
                "<th rowspan='2'>Tax</th>" +
                "<th rowspan='2'>Total Net</th>" +
                "<th rowspan='2'>Refund Fee</th>" +
                "<th rowspan='2'>Curr</th>" +
                "<th rowspan='2'>Reciept No</th>" +
                "<th colspan='7'><div style='text-align: center;color: blue;font-weight: bold'>Payment Details</div></th>" +
                "<th rowspan='2'>User Id</th>" +
                "<th rowspan='2'>Issue Date</th>" +
                "<th rowspan='2'>AWB Status</th>" +
                "<th rowspan='2'>Remarks</th>" +                
                "<tr style='background-color: #daecf4'>" +                
                "<th><span style='color: blue;font-weight: bold'>Form Of Payment</span></th>" +
                "<th><span style='color: blue;font-weight: bold'>Amount</span></th>" +
                "<th><span style='color: blue;font-weight: bold'>Bank Name</span></th>" +
                "<th><span style='color: blue;font-weight: bold'>Card Type</span></th>" +
                "<th><span style='color: blue;font-weight: bold'>Card No</span></th>" +
                "<th><span style='color: blue;font-weight: bold'>Payment Date</span></th>" +
                "<th><span style='color: blue;font-weight: bold'>Payment Status</span></th></tr>" +
                "</tr></thead><tbody>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += "<tr>";
                        str += "<td>" + result.Data[i].RowNo + "</td>";
                        str += "<td>" + result.Data[i].POSCode + "</td>";
                        str += "<td>" + result.Data[i].POSName + "</td>";
                        str += "<td>" + result.Data[i].AWBNo + "</td>";
                        str += "<td>" + result.Data[i].MOP + "</td>";
                        str += "<td>" + result.Data[i].Org + "</td>";
                        str += "<td>" + result.Data[i].Dest + "</td>";
                        str += "<td>" + result.Data[i].CCANo + "</td>";
                        str += "<td>" + result.Data[i].ChWt + "</td>";
                        str += "<td>" + result.Data[i].Commodity + "</td>";
                        str += "<td>" + result.Data[i].FrtCharges + "</td>";
                        str += "<td>" + result.Data[i].Comm + "</td>";
                        str += "<td>" + result.Data[i].Disc + "</td>";
                        str += "<td>" + result.Data[i].TotalOtherCharges + "</td>";
                        str += "<td>" + result.Data[i].Tax + "</td>";
                        str += "<td>" + result.Data[i].TotalNet + "</td>";
                        str += "<td>" + result.Data[i].RefundFee + "</td>";
                        str += "<td>" + result.Data[i].Curr + "</td>";
                        str += "<td>" + result.Data[i].RecieptNo + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsFormOfPayment + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsAmount + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsBankName + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsCardType + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsCardNo + "</td>";
                        str += "<td>" + result.Data[i].PaymentStatus + "</td>";
                        str += "<td>" + result.Data[i].PaymentDate + "</td>";
                        str += "<td>" + result.Data[i].UserId + "</td>";                        
                        str += "<td>" + result.Data[i].IssueDate + "</td>";
                        str += "<td>" + result.Data[i].AWBStatus + "</td>";
                        str += "<td>" + result.Data[i].Remarks + "</td>";                       
                        str += "</tr>";
                    }
                }
                else {
                    str += " <tr>";
                    str += "<td colspan='30'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr>";
                }
                str += "</tbody></table></body></html>";
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


                //var a = document.createElement('a');
                //var data_type = 'data:application/vnd.ms-excel';
                //var table_div = str;
                //var table_html = table_div.replace(/ /g, '%20');
                //a.href = data_type + ', ' + table_html;
                //a.download = 'SalesReport_POS_' + today + '.xls';
                //a.click();



                var contentType = "application/vnd.ms-excel";
                var byteCharacters = str; //e.format(fullTemplate, e.ctx);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], { type: contentType });
                var blobUrl = URL.createObjectURL(blob);
                //FILEDOWNLOADFIX END
                a = document.createElement("a");
                a.download = 'SalesReport_POS_' + today + '_.xls';
                a.href = blobUrl;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                //}
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}


function GetExcelForSummary() {
    if (Model.AirlineSNo != "" && Model.OriginSNo != "" && Model.FromDate != "" && Model.ToDate != "") {        
        $.ajax({
            url: '../PointOfSales/ExportToExcelForSummary',
            async: true,
            type: "POST",
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var str = "<html><body><table border='1' style='border : 1px solid black;border-collapse: collapse;'>" +
              "<thead>" +
               "<tr><th colspan='9'><table border='1' style='border : 1px solid black;border-collapse: collapse;'><tbody><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Airline :</td><td style='width:50%; text-align:left;' >" + FilterModel.Airline + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Payment Status :</td><td style='width:50%; text-align:left;'>" + FilterModel.PaymentStatus + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Origin :</td><td style='width:50%; text-align:left;'>" + FilterModel.Origin + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >Destination :</td><td style='width:50%; text-align:left;'>" + FilterModel.Destination + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >POS Code :</td><td style='width:50%; text-align:left;'>" + FilterModel.POSCode + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >POS Name :</td><td style='width:50%; text-align:left;'>" + FilterModel.POSName + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold;' >From Date :</td><td style='width:50%; text-align:left;'>" + FilterModel.FromDate + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>End Date :</td><td style='width:50%; text-align:left;'>" + FilterModel.ToDate + "</td></tr><tr><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '>Report Type :</td><td style='width:50%; text-align:left;'>" + FilterModel.Type + "</td><td style='background-color: #daecf4; width:50%; text-align:right; font-weight:bold; '></td><td style='width:50%; text-align:left;'></td></tr></tbody></table></th></tr>" +
                "<tr><th colspan='9' style='height:40px;'>Daily Sales Report - POS</th></tr>"+              
                "<tr style='background-color: #daecf4'><th>Curr</th><th>Total Frt+Val Amount</th><th>Total Other Charges</th><th>Total AWB Refund Fee</th><th >Total Cash</th><th >Total Credit</th><th>Total Auto debet</th><th>Total Settlement</th><th>Difference</th>" + "</tr></thead><tbody>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += "<tr>";
                        str += "<td>" + result.Data[i].Curr + "</td>";
                        str += "<td>" + result.Data[i].TotalFreightCharges + "</td>";
                        //str += "<td>" + result.Data[i].TotalValuationCharges + "</td>";
                        str += "<td>" + result.Data[i].TotalOtherCharges + "</td>";
                        str += "<td>" + result.Data[i].TotalAWBRefundFee + "</td>";
                        str += "<td>" + result.Data[i].TotalCash + "</td>";
                        str += "<td>" + result.Data[i].TotalCredit + "</td>";

                        str += "<td>" + result.Data[i].TotalAutodebet + "</td>";
                        str += "<td>" + result.Data[i].TotalSettlement + "</td>";
                        str += "<td>" + result.Data[i].Difference + "</td>";
                        str += "</tr>";
                    }
                }
                else {
                    str += " <tr>";
                    str += "<td colspan='9'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr>";
                }
                str += "</tbody></table></body></html>";
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


                //var a = document.createElement('a');
                //var data_type = 'data:application/vnd.ms-excel';
                //var table_div = str;
                //var table_html = table_div.replace(/ /g, '%20');
                //a.href = data_type + ', ' + table_html;
                //a.download = 'DailySalesReport_POS_' + today + '.xls';
                //a.click();
                ////}

                var contentType = "application/vnd.ms-excel";
                var byteCharacters = str; //e.format(fullTemplate, e.ctx);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], { type: contentType });
                var blobUrl = URL.createObjectURL(blob);
                //FILEDOWNLOADFIX END
                a = document.createElement("a");
                a.download = 'DailySalesReport_POS_' + today + '_.xls';
                a.href = blobUrl;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}