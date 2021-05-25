var retunr = "";

$(document).ready(function () {


    $("#DivULDStockReportDetailsService").html("");
    $.ajax({
        url: 'HtmlFiles/ULD/ULDStockReportDetails.html',
        success: function (result) {
            $("#DivULDStockReportDetailsService").html(result);
            cfi.AutoCompleteV2("Airline", "AirlineCode,AirlineName,AirlineCode", "ULD_ChargeAirlineName", null, "contains");
            cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "ULD_UldStation", null, "contains");
            cfi.AutoCompleteV2("ULDId", "ULDNo,ULDNo", "ULD_RepairSLAReports", null, "contains", ",");
            var IdleDays = [{ Key: "1", Text: ">=" }, { Key: "2", Text: "<=" }];
            cfi.AutoCompleteByDataSource("IdleDays", IdleDays);

            var Lost = [{ Key: "Yes", Text: "Yes" }, { Key: "No", Text: "No" }];
            cfi.AutoCompleteByDataSource("Lost", Lost);

            var OwnershipType = [{ Key: "0", Text: "Airline" }, { Key: "1", Text: "Hired" }, { Key: "2", Text: "Both" }];
            cfi.AutoCompleteByDataSource("Ownership", OwnershipType);

            $("#Airline").val(userContext.AirlineSNo)
            $("#Text_Airline").val(userContext.AirlineCarrierCode)

            $("#Airport").val(userContext.AirportSNo)
            $("#Text_Airport").val(userContext.AirportCode + "-" + userContext.AirportName)

            $("#Ownership").val(0)
            $("#Text_Ownership").val('Airline')
            //$("#tblULDStockReportDetailsService").hide();
            $("#StockReportPrint").attr("disabled", true);
            $("#ExportPdf").hide();

            $("#tblULDStockReportDetailsService").css("border-collapse", "collapse")
            $("#tblULDStockReportDetailsService").css("width", "100%")
            $("#tblULDStockReportDetailsService").css("border", "1px solid black")
            //  $("#tblULDStockReportDetailsService").css("", "")

            ULDStockReportDetails();
            TblULDStockReportPrintPdf();
        }


    });

    $(document).on('click', '#Search', function () {

        ULDStockReportDetails();
        TblULDStockReportPrintPdf();
    });

    $(document).on('click', '#StockReportPrint', function () {

        var divContents = $("#DivPrint").html();
        var printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write('<html><head><title>ULD STOCK REPORT</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();


    });

    $(document).on('click', '#ExportPdf', function () {

        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
      
        doc.fromHTML($('#DivPrint').html(), 15, 15, {
                'width': 100,
                'elementHandlers': specialElementHandlers
            });
            doc.save('file.pdf');
       

        //var today = new Date();
        //var dd = today.getDate();
        //var mm = today.getMonth() + 1; //January is 0!
        //var yyyy = today.getFullYear();
        //if (dd < 10) {
        //    dd = '0' + dd;
        //}
        //if (mm < 10) {
        //    mm = '0' + mm;
        //}
        //var today = dd + '_' + mm + '_' + yyyy;


        //var pdf = new jsPDF('p', 'pt', 'letter');
        //pdf.cellInitialize();
        //pdf.setFontSize(7);
        //$.each($('#PdfExport tr'), function (i, row) {
        //    $.each($(row).find("td"), function (j, cell) {
        //        var txt = $(cell).text().trim() || " ";
        //        // var width = (j == 3) ? 35 : 35; //make 4th column smaller
        //        pdf.cell(3, 30, 50, 15, txt, i);
        //    });
        //});

        //pdf.save('ULD_Stock_Report_Details_' + today + '.pdf');

    });
    $(document).on('click', '#ExportExcel', function () {
        ExportExcelMvc(1);
    });


});
$(document).on('keypress keyup blur', '#numberIdleDays', function (event) {

    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }


});



function ULDStockReportDetails() {



    var AirLine = $("#Airline").val() == "" ? "0" : $("#Airline").val();

    if (AirLine == "" || AirLine == "0") {
        ShowMessage('info', '', "Please Select Airline", "bottom-right");
        return
    }
    if ($("#Ownership").val() == "") {
        ShowMessage('info', '', "Please Select Ownership", "bottom-right");
        return
    }
    if ($("#IdleDays").val() != "" && $("#numberIdleDays").val() == "") {
        ShowMessage('info', '', "Please Enter Idle Days", "bottom-right");
        return

    }
    var Airport = $("#Airport").val() == "" ? "0" : $("#Airport").val();
    var Multi_ULDId = $("#Multi_ULDId").val() == "" ? "0" : $("#Multi_ULDId").val();
    var IdleDays = $("#IdleDays").val() == "" ? "0" : $("#IdleDays").val();
    var IdleDaysval = $("#numberIdleDays").val() == "" ? "0" : $("#numberIdleDays").val();
    var Ownership = $("#Ownership").val() == "" ? "0" : $("#Ownership").val();
    var Lost = $("#Lost").val() == "" ? "" : $("#Lost").val();

    var GetVal = AirLine + '-' + Airport + '-' + Ownership + '-' + Multi_ULDId + '-' + IdleDays + '-' + IdleDaysval + '-' + Lost;

    $('#divUldDivGetULDStockReportDetailsService').remove();
    $("#DivGetULDStockReportDetailsService").append("<div id='divUldDivGetULDStockReportDetailsService' style='width:100%'><table id='TblDivGetULDStockReportDetailsService' style='width:100%'></table></div>");
    $("#TblDivGetULDStockReportDetailsService").appendGrid({
        tableID: "TblDivGetULDStockReportDetailsService",
        contentEditable: false,
        isGetRecord: true,
        tableColume: "AirportCode,ULDType,ULDNo,FlightNo",
        masterTableSNo: AirLine,
        currentPage: 1, itemsPerPage: 20, whereCondition: GetVal, sort: "",
        servicePath: "./Services/ULD/ULDStockReportDetailsService.svc",
        getRecordServiceMethod: "GetULDStockReportDetailsService",
        caption: "ULD Stock Report",
        initRows: 1,
        columns: [
            { name: 'AirportCode', display: 'Station', type: 'label', ctrlCss: {}, },
            { name: 'ULDType', display: 'ULD Type', type: 'label', ctrlCss: {}, },
            { name: 'ULDCategory', display: 'ULD Category', type: 'label', ctrlCss: {}, },
            { name: 'ULDNo', display: 'ULD No', type: 'label', ctrlCss: {}, },
            { name: 'LostRemarks', display: 'Lost', type: 'label', ctrlCss: {}, },
            { name: 'FlightNo', display: 'Last Flight No', type: 'label', ctrlCss: {}, },
            { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: {}, },
            { name: 'Status', display: 'Status', type: 'label', ctrlCss: {}, },
            { name: 'Condition', display: 'Condition', type: 'label', ctrlCss: {}, },
            { name: 'Idledays', display: 'Idle days', type: 'label', ctrlCss: {}, },
            { name: 'AddOncount', display: 'Add On count', type: 'label', ctrlCss: {}, },
            { name: 'TypeCount', display: 'Type Count', type: 'label', ctrlCss: {}, },
            { name: 'TotalULD', display: 'Total ULD', type: 'label', ctrlCss: {}, },
        ],
        isPaging: true,
        isExtraPaging: true,
        isPageRefresh: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        }, rowUpdateExtraFunction: function (id) {
            //CountGrid()
        },
    });



}
function TblULDStockReportPrintPdf() {

    var AirLine = $("#Airline").val() == "" ? "0" : $("#Airline").val();

    //if (AirLine == "" || AirLine == "0") {
    //    ShowMessage('info', '', "Please Select Airline", "bottom-right");
    //    return
    //}
    //if ($("#Ownership").val() == "") {
    //    ShowMessage('info', '', "Please Select Ownership", "bottom-right");
    //    return
    //}
    //if ($("#IdleDays").val() != "" && $("#numberIdleDays").val() == "") {
    //    ShowMessage('info', '', "Please Enter Idle Days", "bottom-right");
    //    return
    //}
    var Airport = $("#Airport").val() == "" ? "0" : $("#Airport").val();
    var Multi_ULDId = $("#Multi_ULDId").val() == "" ? "0" : $("#Multi_ULDId").val();
    var IdleDays = $("#IdleDays").val() == "" ? "0" : $("#IdleDays").val();
    var IdleDaysval = $("#numberIdleDays").val() == "" ? "0" : $("#numberIdleDays").val();
    var Ownership = $("#Ownership").val() == "" ? "0" : $("#Ownership").val();
    var LostRemarks = $("#Lost").val() == "" ? "" : $("#Lost").val();

    var obj = {

        AirLine: AirLine,
        AirportCode: Airport,
        Ownership: Ownership,
        ULDId: Multi_ULDId,
        IdleDays: IdleDays,
        IdleDaysval: IdleDaysval,
        LostRemarks: LostRemarks
    }
    var AirlineName = userContext.AirlineCarrierCode;

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/Services/ULD/ULDStockReportDetailsService.svc/ExportExcelPdf",
        data: JSON.stringify(obj),
        success: function (response) {
            $("#PdfExport").html("")
            if (response.length > 0) {

                var str = "";
                str += "<thead><tr ><td>Station</td><td>ULD Type </td><td>ULD Category</td><td>ULD ID</td><td>Last Flight No</td><td>Flight Date</td><td>Status</td><td>Condition</td><td>Idle days</td><td>Add On count</td><td>Type Count</td><td>Total ULD</td></tr></thead>"
                for (var i = 0; i < response.length; i++) {
                    str += "<tbody><tr><td>" + response[i].AirportCode + "</td><td>" + response[i].ULDType + "</td><td>" + response[i].ULDCategory
                        + "</td><td>" + response[i].ULDNo
                        + "</td><td>" + response[i].FlightNo
                        + "</td><td>" + response[i].FlightDate
                        + "</td><td>" + response[i].Status
                        + "</td><td>" + response[i].Condition
                        + "</td><td>" + response[i].Idledays
                        + "</td><td>" + response[i].AddOncount
                        + "</td><td>" + response[i].TypeCount
                        + "</td><td>" + response[i].TotalULD
                        + "</td></tr></tbody>"
                }
                // str += "</table>";
                $('#PdfExport').append(str);
                $("#StockReportPrint").attr("disabled", false);
                $("#ExportPdf").hide()
                $("#AirlineLogo").attr("src", userContext.SysSetting.LogoURL)
            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });


}
function ExportExcelMvc(ExportType) {
    var AirLine = $("#Airline").val() == "" ? "0" : $("#Airline").val();

    if (AirLine == "" || AirLine == "0") {
        ShowMessage('info', '', "Please Select Airline", "bottom-right");
        return
    }
    if ($("#Ownership").val() == "") {
        ShowMessage('info', '', "Please Select Ownership", "bottom-right");
        return
    }
    if ($("#IdleDays").val() != "" && $("#numberIdleDays").val() == "") {
        ShowMessage('info', '', "Please Enter Idle Days", "bottom-right");
        return

    }
    var Airport = $("#Airport").val() == "" ? "0" : $("#Airport").val();
    var Multi_ULDId = $("#Multi_ULDId").val() == "" ? "" : $("#Multi_ULDId").val();
    var IdleDays = $("#IdleDays").val() == "" ? "0" : $("#IdleDays").val();
    var IdleDaysval = $("#numberIdleDays").val() == "" ? "0" : $("#numberIdleDays").val();
    var Ownership = $("#Ownership").val() == "" ? "0" : $("#Ownership").val();
    var LostRemarks = $("#Lost").val() == "" ? "" : $("#Lost").val();


    var AirlineName = userContext.AirlineCarrierCode;
    window.location.href = "../Master/UldStockExportToExcel?AirLine=" + AirLine + "&AirportCode="
        + Airport + "&Ownership=" + Ownership + "&ExportType=" + ExportType + "&ULDId=" + Multi_ULDId + "&IdleDays=" + IdleDays + "&IdleDaysval=" + IdleDaysval + "&LostRemarks=" + LostRemarks;



}


function ExtraCondition(textId) {
    var filterReqTo = cfi.getFilter("AND");
    var filterEmbargo = cfi.getFilter("AND");
    var filterSubcategory = cfi.getFilter("AND");
    var OriginCityAutoCompleteFilter2 = "";
    if ($("#Airport").val() != "") {
        if (textId == "Text_ULDId") {
            try {
                cfi.setFilter(filterEmbargo, "Isdamage", "neq", 1);
                cfi.setFilter(filterEmbargo, "Airlinesno", "eq", $("#Airline").val());
                cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", $("#Airport").val())
                OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter2;
            }
            catch (exp) {
            }
        }
    }
    else if (textId == "Text_ULDId") {
        try {
            cfi.setFilter(filterEmbargo, "Isdamage", "neq", 1);
            cfi.setFilter(filterEmbargo, "Airlinesno", "eq", $("#Airline").val());
            OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
}

