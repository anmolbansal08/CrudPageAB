


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
                    url: "../PointOfSales/DistinctPointOfSalesGetRecord",
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
        sortable: true, filterable: false,
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
                ]
            },
            { field: "UserId", title: "UserId", width: 90 },
             { field: "IssueDate", title: "Issue Date", width: 90 },
            { field: "PaymentDate", title: "Payment Date", width: 90 },
            { field: "Remarks", title: "Remarks", width: 130 },
              { field: "PaymentStatus", title: "PaymentStatus", width: 130 },
              { field: "Tax", title: "Tax", width: 130 }

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
                    url: "../PointOfSales/DistinctPointOfSalesGetRecordForSummary",
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
        PaymentStatus: 2
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
            url: '../PointOfSales/DistinctExportToExcel',
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'>" +
                "<thead role='rowgroup' ><tr role='row' style='background-color: #daecf4'>" +
                "<th role='columnheader' data-field='RowNo' rowspan='2' data-title='Row No' data-index='0'  data-role='columnsorter'>No</th>" +
                "<th role='columnheader' data-field='PosCode' rowspan='2' data-title='Pos Code' data-index='1'  data-role='columnsorter'>Pos Code</th>" +
                "<th role='columnheader' data-field='PosName' rowspan='2' data-title='Pos Name' data-index='2'  data-role='columnsorter'>Pos Name</th>" +
                "<th role='columnheader' data-field='AWBNo' rowspan='2' data-title='AWB No' data-index='3'  data-role='columnsorter'>AWB No</th>" +
                "<th role='columnheader' data-field='MOP' rowspan='2' data-title='MOP' data-index='4'  data-role='columnsorter'>MOP</th>" +
                "<th role='columnheader' data-field='Org' rowspan='2' data-title='Org' data-index='5' data-role='columnsorter'>Org</th>" +
                "<th role='columnheader' data-field='Dest' rowspan='2' data-title='Dest' data-index='6'  data-role='columnsorter'>Dest</th>" +
                "<th role='columnheader' data-field='CCANo' rowspan='2' data-title='CCA No' data-index='7'  data-role='columnsorter'>CCANo</th>" +
                "<th role='columnheader' data-field='ChWt' rowspan='2' data-title='ChWt' data-index='8'  data-role='columnsorter'>Chargeable Wt(Kgs)</th>" +
                "<th role='columnheader' data-field='Commodity' rowspan='2' data-title='Commodity' data-index='9'  data-role='columnsorter'>Commodity</th>" +
                "<th role='columnheader' data-field='FrtCharges' rowspan='2' data-title='Frt Charges' data-index='10'  data-role='columnsorter'>Frt + Val</th>" +
                "<th role='columnheader' data-field='Comm' rowspan='2' data-title='Comm' data-index='11'  data-role='columnsorter'>Comm</th>" +
                "<th role='columnheader' data-field='Disc' rowspan='2' data-title='Disc' data-index='12'  data-role='columnsorter'>Disc</th>" +
                "<th role='columnheader' data-field='TotalOtherCharges' rowspan='2' data-title='Total Other Charges' data-index='13'  data-role='columnsorter'>Total Other Charges</th>" +
                "<th role='columnheader' data-field='TotalNet' rowspan='2' data-title='Total Net' data-index='14'  data-role='columnsorter'>Total Net</th>" +
                "<th role='columnheader' data-field='RefundFee' rowspan='2' data-title='Refund Fee' data-index='15'  data-role='columnsorter'>Refund Fee</th>" +
                "<th role='columnheader' data-field='Curr' rowspan='2' data-title='Curr' data-index='16'  data-role='columnsorter'>Curr</th>" +
                "<th role='columnheader' data-field='RecieptNo' rowspan='2' data-title='Reciept No' data-index='17'  data-role='columnsorter'>Reciept No</th>" +
                "<th role='columnheader' colspan='5' data-colspan='5' ><div style='text-align: center;color: blue;font-weight: bold'>Payment Details</div></th>" +
                "<th role='columnheader' data-field='UserId' rowspan='2' data-title='UserId' data-index='23'  data-role='columnsorter'>UserId</th>" +
                "<th role='columnheader' data-field='Remarks' rowspan='2' data-title='Remarks' data-index='24'  data-role='columnsorter'>Remarks</th>" +
                "<th role='columnheader' data-field='IssueDate' rowspan='2' data-title='IssueDate' data-index='25'  data-role='columnsorter'>IssueDate</th>" +
                 "<th role='columnheader' data-field='PaymentStatus' rowspan='2' data-title='PaymentStatus' data-index='26'  data-role='columnsorter'>IssueDate</th>" +
                   "<th role='columnheader' data-field='Tax' rowspan='2' data-title='Tax' data-index='27'  data-role='columnsorter'>IssueDate</th>" +
                "<th role='columnheader' data-field='PaymentDate' rowspan='2' data-title='PaymentDate' data-index='28'  data-role='columnsorter'>PaymentDate</th></tr>" +
                "<tr role='row' style='background-color: #daecf4'>" +
                "<th role='columnheader' data-field='PaymentDetailsFormOfPayment' data-index='18' class='k-header k-first' data-role='columnsorter'>" +
                "<span style='color: blue;font-weight: bold'>Form Of Payment</span></th>" +
                "<th role='columnheader' data-field='PaymentDetailsAmount' data-index='19'  data-role='columnsorter'><span style='color: blue;font-weight: bold'>Amount</span></th>" +
                "<th role='columnheader' data-field='PaymentDetailsBankName' data-index='20'  data-role='columnsorter'><span style='color: blue;font-weight: bold'>Bank Name</span></th>" +
                "<th role='columnheader' data-field='PaymentDetailsCardType' data-index='21'  data-role='columnsorter'><span style='color: blue;font-weight: bold'>Card Type</span></th>" +
                "<th role='columnheader' data-field='PaymentDetailsCardNo' data-index='22'  data-role='columnsorter'><span style='color: blue;font-weight: bold'>Card No</span></th>" + "</tr></thead>";
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
                        str += "<td>" + result.Data[i].TotalNet + "</td>";
                        str += "<td>" + result.Data[i].RefundFee + "</td>";
                        str += "<td>" + result.Data[i].Curr + "</td>";
                        str += "<td>" + result.Data[i].RecieptNo + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsFormOfPayment + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsAmount + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsBankName + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsCardType + "</td>";
                        str += "<td>" + result.Data[i].PaymentDetailsCardNo + "</td>";
                        str += "<td>" + result.Data[i].UserId + "</td>";
                        str += "<td>" + result.Data[i].Remarks + "</td>";
                        str += "<td>" + result.Data[i].IssueDate + "</td>";
                        str += "<td>" + result.Data[i].PaymentStatus + "</td>";
                        str += "<td>" + result.Data[i].Tax + "</td>";
                        str += "<td>" + result.Data[i].PaymentDate + "</td>";
                        str += "</tr>";
                    }
                }
                else {
                    str += " <tr>";
                    str += "<td colspan='25'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr>";
                }
                str += "</table>";
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
                a.download = 'SalesReport_POS_' + today + '.xls';
                a.click();
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
            url: '../PointOfSales/DistinctExportToExcelForSummary',
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {


                var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'>" +
              "<thead role='rowgroup' ><tr role='row' style='background-color: #daecf4'>" +


              //"<th role='columnheader' data-field='Curr' rowspan='2' data-title='Curr' data-index='0'  data-role='columnsorter'>Curr</th>" +
              //"<th role='columnheader' data-field='TotalFreightCharges' rowspan='2' data-title='TotalFreightCharges' data-index='1'  data-role='columnsorter'>Total Freight Charges</th>" +
              //"<th role='columnheader' data-field='TotalValuationCharges' rowspan='2' data-title='TotalValuationCharges' data-index='2' data-role='columnsorter'>Total Valuation Charges</th>" +
              //"<th role='columnheader' data-field='TotalOtherCharges' rowspan='2' data-title='TotalOtherCharges' data-index='3'  data-role='columnsorter'>Total Other Charges</th>" +
              //"<th role='columnheader' data-field='TotalAWBRefundFee' rowspan='2' data-title='TotalAWBRefundFee' data-index='4'  data-role='columnsorter'>TotalAWBRefundFee</th>" +
              //"<th role='columnheader' data-field='TotalCash' rowspan='2' data-title='TotalCash' data-index='5'  data-role='columnsorter'>Total Cash</th>" +
              //"<th role='columnheader' data-field='TotalCredit' rowspan='2' data-title='TotalCredit' data-index='6'  data-role='columnsorter'>Total Credit</th>" +
              //"<th role='columnheader' data-field='TotalAutodebet' rowspan='2' data-title='TotalAutodebet' data-index='7'  data-role='columnsorter'>Total Auto debet</th>" +
              //"<th role='columnheader' data-field='TotalSettlement' rowspan='2' data-title='TotalSettlement' data-index='7'  data-role='columnsorter'>Total Settlement</th>" +
              //"<th role='columnheader' data-field='Difference' rowspan='2' data-title='Difference' data-index='7'  data-role='columnsorter'>Difference</th>" +
              '<th role="columnheader" data-field="Curr" rowspan="1" data-title="Curr" data-index="0" class="k-header" data-role="columnsorter">Curr</th><th role="columnheader" data-field="TotalFreightCharges" rowspan="1" data-title="Total Frt+Val Amount" data-index="1" class="k-header" data-role="columnsorter">Total Frt+Val Amount</th><th role="columnheader" data-field="TotalOtherCharges" rowspan="1" data-title="Total Other Charges" data-index="3" class="k-header" data-role="columnsorter">Total Other Charges</th><th role="columnheader" data-field="TotalAWBRefundFee" rowspan="1" data-title="Total AWB Refund Fee" data-index="4" class="k-header" data-role="columnsorter">Total AWB Refund Fee</th><th role="columnheader" data-field="TotalCash" rowspan="1" data-title="Total Cash" data-index="5" class="k-header" data-role="columnsorter">Total Cash</th><th role="columnheader" data-field="TotalCredit" rowspan="1" data-title="Total Credit" data-index="6" class="k-header" data-role="columnsorter">Total Credit</th><th role="columnheader" data-field="TotalAutodebet" rowspan="1" data-title="Total Auto debet" data-index="7" class="k-header" data-role="columnsorter">Total Auto debet</th><th role="columnheader" data-field="TotalSettlement" rowspan="1" data-title="Total Settlement" data-index="8" class="k-header" data-role="columnsorter">Total Settlement</th><th role="columnheader" data-field="Difference" rowspan="1" data-title="Difference" data-index="9" class="k-header" data-role="columnsorter">Difference</th>' +

               "</tr></thead>";
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
                str += "</table>";
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
                a.download = 'DailySalesReport_POS_' + today + '.xls';
                a.click();
                //}
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}