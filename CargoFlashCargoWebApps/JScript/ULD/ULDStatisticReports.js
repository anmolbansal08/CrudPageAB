var retunr = "";

$(document).ready(function () {


    $("#DivULDStatisticService").html("");
    $.ajax({
        url: 'HtmlFiles/ULD/ULDStatisticReports.html',
        success: function (result) {
            $("#DivULDStatisticService").html(result);
            cfi.AutoCompleteV2("Airline", "AirlineCode,AirlineName,AirlineCode", "ULD_ChargeAirlineName", null, "contains");
            cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "ULD_UldStation", null, "contains");
            cfi.AutoCompleteV2("ULDTypeWise", "SNo,Text_ULD", "ULDSTOCK_ULDTYPE", onchangeUld, "contains", ",");
            cfi.AutoCompleteV2("Manufactured", "PurchaseFrom,PurchaseFrom", "PurchasedFrom_vwPurchaseFrom", null, "contains");
            cfi.AutoCompleteV2("UldNumber", "UldStockSno,ULDNo", "ULD_RepairSLAReports", null, "contains", ",");
            cfi.AutoCompleteV2("Yearofwriteofdate", "year", "ULD_year", null, "contains");
            
            //cfi.DateType("Yearofwriteofdate");
            //$("#Yearofwriteofdate").val("")

            $("#StockReportPrint").show();
            $("#ExportPdf").hide();
            $("#ExportExcel").show();

            $("#Airline").val(userContext.AirlineSNo)
            $("#Text_Airline").val(userContext.AirlineCarrierCode)

            $('#Airport').val(userContext.AirportSNo);
            $('#Text_Airport').val(userContext.AirportCode + '-' + userContext.AirportName);

            ULDStatisticReports();

        }


    });
    
    $(document).on('click', '.k-button', function () {
        $("#divMultiUldNumber ul").html("");
    });
    $(document).on('click', '#Search', function () {

        ULDStatisticReports();

    });

    $(document).on('click', '#StockReportPrint', function () {

        var divContents = $("#DivULDStatisticReports").html();
        var printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write('<html><head><title>ULD STATISTIC (ULD UTILIZATION)</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();


    });

    $(document).on('click', '#ExportPdf', function () {
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


        var pdf = new jsPDF('p', 'pt', 'letter');
        pdf.cellInitialize();
        pdf.setFontSize(7);
        $.each($('#PdfExport tr'), function (i, row) {
            $.each($(row).find("td"), function (j, cell) {
                var txt = $(cell).text().trim() || " ";
                // var width = (j == 3) ? 35 : 35; //make 4th column smaller
                pdf.cell(3, 30, 50, 15, txt, i);
            });
        });

        pdf.save('ULD_Stock_Report_Details_' + today + '.pdf');

    });
    $(document).on('click', '#ExportExcel', function () {
        ExportExcelMvc(1);
    });


});

function onchangeUld() {


}

function ExtraCondition(textId) {
    var filterReqTo = cfi.getFilter("AND");
    var filterEmbargo = cfi.getFilter("AND");
    var filterSubcategory = cfi.getFilter("AND");
    var OriginCityAutoCompleteFilter2 = "";
    if ($("#ULDTypeWise").val() != "") {
        if (textId == "Text_UldNumber") {
            try {
                cfi.setFilter(filterEmbargo, "ULDSNo", "in", $("#ULDTypeWise").val())
                OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter2;
            }
            catch (exp) {
            }
        }
    }
    if (textId == "Text_ULDTypeWise") {

        if ($("#ULDTypeWise").val() == "") {
           $("#divMultiUldNumber ul").html("");
           $("#UldNumber").val("");
            $("#Multi_UldNumber").val("");
            $("#FieldKeyValuesUldNumber").val("");
            $("#divMultiUldNumber ul").append('<li class="k-button" style="display:none;margin-bottom:10px !important;"><input type="hidden" id="Multi_UldNumber" name="Multi_UldNumber" value=""><span style="display:none;" id="FieldKeyValuesUldNumber" name="FieldKeyValuesUldNumber"></span></li>');
        }

    }

}



function ULDStatisticReports() {


    var Airport = $("#Airport").val() == "" ? "0" : $("#Airport").val();
    var Multi_ULDTypeWise = $("#Multi_ULDTypeWise").val() == "" ? "0" : $("#Multi_ULDTypeWise").val();
    var Manufactured = $("#Text_Manufactured").val() == "0" ? "" : $("#Text_Manufactured").val();
    var Yearofwriteofdate = $("#Yearofwriteofdate").val() == "" ? "" : $("#Yearofwriteofdate").val();
    var UldNumber = $("#Multi_UldNumber").val() == "" ? "" : $("#Multi_UldNumber").val();
    var Airlinecode = $("#Airline").val();
    var GetVal = Airport + 'G126A' + Multi_ULDTypeWise + 'G126A' + Manufactured + 'G126A' + Yearofwriteofdate + 'G126A' + UldNumber + 'G126A' + Airlinecode;

    $('#divUldDivULDStatisticReports').remove();
    $("#DivULDStatisticReports").append("<div id='divUldDivULDStatisticReports' style='width:100%'><table id='TblDivULDStatisticReports' style='width:100%'></table></div>");
    $("#TblDivULDStatisticReports").appendGrid({
        tableID: "TblDivULDStatisticReports",
        contentEditable: false,
        isGetRecord: true,
        tableColume: "AirportCode,ULDType,ULDNo,FlightNo",
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 20, whereCondition: GetVal, sort: "",
        servicePath: "./Services/ULD/ULDStatisticReportsService.svc",
        getRecordServiceMethod: "GetULDStatisticReports",
        caption: "ULD STATISTIC (ULD UTILIZATION)",
        initRows: 1,
        columns: [
            { name: 'PurchasedFrom', display: 'Manufacturer Name (Purchased From)', type: 'label', ctrlCss: { width: 100 }, },
            { name: 'ULDType', display: 'ULD TYPE', type: 'label', ctrlCss: { width: 100 }, },
            { name: 'ULDID', display: 'ULD No', type: 'label', ctrlCss: {}, },
            { name: 'TotalMovement', display: 'Total Movement', type: 'label', ctrlCss: {}, },
            { name: 'Price', display: 'Price', type: 'label', ctrlCss: {}, },
            { name: 'TotalRepairCost', display: 'Total Repair Cost', type: 'label', ctrlCss: {}, },
            { name: 'PurchasedDate', display: 'Purchased Date', type: 'label', ctrlCss: {}, },
            { name: 'WriteOffDate', display: 'Write Off Date', type: 'label', ctrlCss: {}, },
            { name: 'ULDTypewiseCount', display: 'ULD Typewise Count', type: 'label', ctrlCss: {}, },
            { name: 'AverageLifeDays', display: 'Average Life(Days)', type: 'label', ctrlCss: {}, },

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
function ExportExcelMvc(ExportType) {
    var Airport = $("#Airport").val() == "" ? "0" : $("#Airport").val();
    var Multi_ULDTypeWise = $("#Multi_ULDTypeWise").val() == "" ? "0" : $("#Multi_ULDTypeWise").val();
    var Manufactured = $("#Text_Manufactured").val() == "0" ? "" : $("#Text_Manufactured").val();
    var Yearofwriteofdate = $("#Yearofwriteofdate").val() == "" ? "" : $("#Yearofwriteofdate").val();
    var UldNumber = $("#Multi_UldNumber").val() == "" ? "" : $("#Multi_UldNumber").val();

    var AirlineName = userContext.AirlineCarrierCode;

    window.location.href = "../Master/ULDStatisticExportToExcel?AirportCode=" + Airport + "&ULDId=" + Multi_ULDTypeWise + "&Manufactured=" + Manufactured + "&Yearofwriteofdate=" + Yearofwriteofdate + "&UldNumber=" + UldNumber + "&PageSize=" + 50000;



}

