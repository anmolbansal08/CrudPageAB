//$(function () {
//    MasterIrregularityAWBReport();
//});

var paymentList = null;
var currentprocess = "";
var currentawbsno = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var DGRSPHC = [];
var ItenaryArray = [];
var FlightDateForGetRate = '';
var FlightNoForGetRate = '';
var isSaveAndNext = '';
var TactArray = [];
var Type ='';



//function MasterIrregularityAWBReport() {
//    _CURR_PRO_ = "IrregularityAWBReport";
//    _CURR_OP_ = "Irregularity";
//    $("#licurrentop").html(_CURR_OP_);
//    $("#divSearch").html("");
//    $("#divIrregularityAWBReportDetails").html("");
//    $.ajax({
//        url: "Services/Irregularity/IrregularityAWBReportService.svc/GetWebForm/" + _CURR_PRO_ + "/Irregularity/IrregularityAWBReportSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            $("#divbody").html('').html(result);
//            $("#divContent").html(divContent);
//            $('#__tblirregularityawbreportsearch__ tr:eq(0) td:eq(0)').empty();
//            $('#__tblirregularityawbreportsearch__ tr:eq(0) td:eq(0)').width("5%");
//            $('#__tblirregularityawbreportsearch__ tr:eq(0)').addClass('formSection');
//            $('#__tblirregularityawbreportsearch__ tr:eq(0) td:eq(0)').append("<label><b>TYPE :</b></label>")
//            $("#__divIrregularityAWBReportDetails__ table:first").find("tr>td:first").text("Irregularity Report");
//            cfi.AutoCompleteV2("AWBNo", "AWBNo", "IrregularityAWBReport_AWBNo2", null, "contains");


//            $("input[name^=Type]").live("click", function () {
//                if ($("input[name^=Type]:checked").val() == 1) {
//                    var data = GetDataSourceV2("AWBNo", "IrregularityAWBReport_AWBNo", null);
//                    cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, null, "AWBNo", "contains");
//                    $('#divIrregularityAWBReportDetails').empty();
//                }
//                else {
//                    var data = GetDataSourceV2("AWBNo", "IrregularityAWBReport_AWBNo2", null);
//                    cfi.ChangeAutoCompleteDataSource("AWBNo", data, true, null, "AWBNo", "contains");
//                    $('#divIrregularityAWBReportDetails').empty();
//                }
//            })
//            $("#btnSearch").on("click", function () {
//                if ($('#FromDate').val() != '' && $('#ToDate').val() != '') {

//                    $.ajax({
//                        url: "HtmlFiles/Irregularity/IrregularityReport.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
//                        success: function (result) {
//                              alert('Test')
//                            $("#divContent").html(result);

//                             BindAppendGrid($('#AWBNo').val(), ($("input[name^=Type]:checked").val() == 0 ? 2 : $("input[name^=Type]:checked").val()));
//                            BindAppendGrid($('#FromDate').val(), $('#ToDate').val(), ($("input[name^=Type]:checked").val() == 0 ? 2 : $("input[name^=Type]:checked").val()));
//                        }
//                    });
//                }
//            });
//        }
//    });
//}
//$(document).ready(function () {
//    $(document.body).append('<script type="text/javascript" src="../JScript/Shipment/table2excel.js" ></script>');
//    //cfi.AutoCompleteV2("BranchOffice", "Name", "ClaimReport_Office", null, "contains");
//    cfi.AutoCompleteV2("ComplaintStatusSNo", "Name", "Complaint_ComplaintStatusSNo", null, "contains");
//    $("#Fromdate").kendoDatePicker({

//        format: "dd-MMM-yyyy"
//    });
//    $("#Todate").kendoDatePicker({

//        format: "dd-MMM-yyyy"
//    });
//    $(document).on("change", "#Fromdate", function () {
//        $("#Todate").data("kendoDatePicker").value(" ");
//        var startDate = new Date($('#Fromdate').val());
//        $("#Todate").data("kendoDatePicker").min(startDate);
//    });
//    $("#Fromdate").prop('readonly', true);
//    $("#Todate").prop('readonly', true);

//    //$("[id='CustomerType']").click(function () {
//    //    //if ($("#CustomerType:checked").val() == '0') {
//    //    //    parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=IrregularityAWBReport&FormAction=INDEXVIEW')
//    //    //}
//    //    if ($("#CustomerType:checked").val() == '1') {
//    //        parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=IrregularityAWBReport&FormAction=INDEXVIEW')
//    //    }
//    //    if ($("#CustomerType:checked").val() == '2') {
//    //        parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=ClaimReport&FormAction=NEW')
//    //    }
//    //})

//    $('#btnSubmit').click(function () {
//        if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

//            alert('From Date can not be greater than To Date');
//            return false;;
//        }
//        if ($('#FromDate').val() != '' && $('#ToDate').val() != '') {

//            $.ajax({
//                url: "HtmlFiles/Irregularity/IrregularityReport.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
//                success: function (result) {
//                    alert('Test')
//                    $("#divContent").html(result);

//                    //BindAppendGrid($('#AWBNo').val(), ($("input[name^=Type]:checked").val() == 0 ? 2 : $("input[name^=Type]:checked").val()));
//                    BindAppendGrid($('#ComplaintStatusSNo').val(),$('#FromDate').val(), $('#ToDate').val());
//                }
//            });
//        }

//        //if ($("#CustomerType:checked").val() == '0') {
//        //    ComplaintReport();
//        //    //parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=IrregularityAWBReport&FormAction=INDEXVIEW')
//        //}
//        //if ($("#CustomerType:checked").val() == '1') {
//        //    parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=IrregularityAWBReport&FormAction=INDEXVIEW')
//        //}
//        //if ($("#CustomerType:checked").val() == '2') {
//        //    parent.$("#iMasterFrame").attr('src', '../Default.cshtml?Module=Irregularity&Apps=IrregularityAWBReport&FormAction=INDEXVIEW')
//        //}

//    });
//});

$(document).ready(function () {
    $(document.body).append('<script type="text/javascript" src="../JScript/Shipment/table2excel.js" ></script>');
    //cfi.AutoCompleteV2("BranchOffice", "Name", "ClaimReport_Office", null, "contains");
    cfi.AutoCompleteV2("IrregularityStatusSNo", "Status", "Irregularity_IrregularityStatusSNo", null, "contains");
    //$("#IrregularityStatusSNo").kendoAutoComplete({
    //    dataTextField: "Status",
    //    dataSource: [
    //      { id: 0, Status: "All" }]
    //});
   
    //function addNew(IrregularityStatusSNo, ALL) {
    //    var widget = $("#" + widgetId).getKendoAutoComplete();
    //    var dataSource = widget.dataSource;

    //    if (confirm("Are you sure?")) {
    //        dataSource.add({
    //            SNo: 0,
    //            Status: value
    //        });

    //        dataSource.one("sync", function () {
    //            widget.close();
    //        });

    //        dataSource.sync();
    //    }
    //};
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


    $('#btnSubmit').click(function () {
        if (Date.parse($("#Fromdate").val()) > Date.parse($("#Todate").val())) {

            alert('From Date can not be greater than To Date');
            return false;;
        }

        if (cfi.IsValidSubmitSection()) {
            //var BranchOffice = $('#BranchOffice').val();
            var Status = $('#IrregularityStatusSNo').val();
            var fromdate = $('#Fromdate').val();
            var todate = $('#Todate').val();
            $.ajax({
                                url: "../HtmlFiles/Irregularity/IrregularityReport.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    //var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divIrregularityAWBReportDetails' style='width:100%'></div></td></tr></table></div>";
                                    $("#btnSubmit").html('');
                                    $("#divIrr").html('');
                                    $("#btnSubmit").closest('table').after(result);
                                   // $("#divIrregularityAWBReportDetails").html(result);

                                    //BindAppendGrid($('#AWBNo').val(), ($("input[name^=Type]:checked").val() == 0 ? 2 : $("input[name^=Type]:checked").val()));
                                    BindAppendGrid($('#IrregularityStatusSNo').val(), $('#Fromdate').val(), $('#Todate').val());
                                }
                            });
            //$.ajax({
            //    url: "../ComplainReport/GetComplainReport",
            //    async: false,
            //    type: "GET",
            //    dataType: "json",
            //    data: {
            //        Status: Status, fromdate: fromdate, todate: todate
            //    },
            //    contentType: "application/json; charset=utf-8", cache: false,
            //    success: function (result) {
            //        $('#grid').show();
            //        $('#gridbodys').html('');

            //        var Result1 = jQuery.parseJSON(result.Result);
            //        var Result = Result1.Table0;

            //        var thead_body = "";
            //        var thead_row = "";

            //        if (Result.length > 0) {
            //            $('#exportflight').show();
            //            var container = $("#gridbodys");
            //            var tr = '';
            //            for (var i = 0; i < Result.length; i++) {
            //                var count = i + 1;
            //                tr += '<tr class="datarow">';
            //                var td = '';
            //                td += "<td class='ui-widget-content'  id='No'> <span  maxlength='100' style='width:100px;'>" + count + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='ComplainNo'> <span  maxlength='100' style='width:100px;'>" + Result[i].CaseNumber + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='ComplainSource'> <span  maxlength='100' style='width:100px;'>" + Result[i].ComplaintSource + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='DTClosed'> <span  maxlength='100' style='width:100px;'>" + Result[i].DateTimeClosed + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='DTopen'> <span  maxlength='100' style='width:100px;'>" + Result[i].DateTimeOpened + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='ComplainSubject'> <span  maxlength='100' style='width:100px;'>" + Result[i].SubjectofComplain + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='CUSTOMER'> <span  maxlength='100' style='width:100px;'>" + Result[i].CUSTOMER + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='AWB'> <span  maxlength='100' style='width:100px;'>" + Result[i].AWBNO + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='FLTNO'> <span  maxlength='100' style='width:100px;'>" + Result[i].FlightNo + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='FLTDATE'> <span  maxlength='100' style='width:100px;'>" + Result[i].FlightDate + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='Origin'> <span  maxlength='100' style='width:100px;'>" + Result[i].Origin + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='Destination'> <span  maxlength='100' style='width:100px;'>" + Result[i].Destination + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='Commodity'> <span  maxlength='100' style='width:100px;'>" + Result[i].Commodity + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='PCS'> <span  maxlength='100' style='width:100px;'>" + Result[i].TotalPieces + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='KGS'> <span  maxlength='100' style='width:100px;'>" + Result[i].TotalGrossWeight + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='13 DAYS'> <span  maxlength='100' style='width:100px;'>" + Result[i].LessThenthree + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='46 DAYS'> <span  maxlength='100' style='width:100px;'>" + Result[i].FourToSix + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='7DAYS'> <span  maxlength='100' style='width:100px;'>" + Result[i].GreaterThenSeven + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='ComplainStatus'> <span  maxlength='100' style='width:100px;'>" + Result[i].ComplainStatus + "</span></td>";
            //                td += "<td class='ui-widget-content'  id='NOTICE'> <span  maxlength='100' style='width:100px;'></span></td>";
            //                //td += "<td class='ui-widget-content'  id='CaseNumber'> <label  maxlength='100' style='width:100px;'>" + Result[i].CaseNumber + "</label></td>";
            //                //td += "<td class='ui-widget-content'  id='AWBNO'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBNO + "</label></td>";
            //                //td += "<td class='ui-widget-content'  id='DateTimeOpened'> <label  maxlength='100' style='width:100px;'>" + Result[i].DateTimeOpened + "</label></td>";
            //                //td += "<td class='ui-widget-content'  id='DateTimeClosed'> <label  maxlength='100' style='width:100px;'>" + Result[i].DateTimeClosed + "</label></td>";
            //                //td += "<td class='ui-widget-content'  id='SubjectofComplain'> <label  maxlength='100' style='width:100px;'>" + Result[i].SubjectofComplain + "</label></td>";

            //                //td += "<td class='ui-widget-content'  id='AccountName'> <label  maxlength='100' style='width:100px;'>" + Result[i].AccountName + "</label></td>";
            //                //td += "<td class='ui-widget-content'  id='ComplainStatus'> <label  maxlength='100' style='width:100px;'>" + Result[i].ComplainStatus + "</label></td>";

            //                //td += "<td class='ui-widget-content'  id='ComplainImportancy'> <label  maxlength='100' style='width:100px;'>" + Result[i].ComplainImportancy + "</label></td>";
            //                //td += "<td class='ui-widget-content'  id='Remarks'> <label  maxlength='100' style='width:100px;'>" + Result[i].Remarks + "</label></td>";



            //                tr += td + "</tr>";
            //            }
            //            container.append(tr);

            //        }
            //        else {
            //            $("#gridbodys").append('<tr><td colspan="20" align="center">NO RECORD FOUND</td></tr>')
            //        }



            //    },
            //    error: function (xhr) {
            //        var a = "";
            //    }

            //});
        }
    });
});
function BindAppendGrid(Status,FromDate,ToDate) {
    Type = Type
    $('#divIrregularityAWBReportDetails').empty();
    $("#divIrregularityAWBReportDetails").append("<table id='tblIrregularityAWBReportAppendGrid' style='width:100%'></table>");
    $.ajax({
        url: "../IrregularityReport/GetIrregularityReport?Status=" + Status + "&FromDate=" + FromDate + "&ToDate=" + ToDate , async: false, type: "get", datatype: "json", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
           
            
            var ResultData = jQuery.parseJSON(result.Result);
            var FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                $('#exportflight').show();
                //$(FinalData).each(function (row, tr) {
                for (var i = 0; i < FinalData.length; i++) {
                    var count = i + 1;
                    $("#tbodyIrrData").append("<tr id='trIrrData" + count + "'>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdNo" + count + "'>" + count + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdIrregNo" + count + "'>" + FinalData[i].IrregularityReferenceCode + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdIncidentCategory" + count + "'>" + FinalData[i].IncidentCategory + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdReportingStation" + count + "'>" + FinalData[i].ReportingStation + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdAWBNO" + count + "'>" + FinalData[i].AWBNo + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdFLTNo" + count + "'>" + FinalData[i].FlightNo + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdFltDate" + count + "'>" + FinalData[i].FlightDate + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdOrigin" + count + "'>" + FinalData[i].OriginAirportCode + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdTransit" + count + "'>" + '' + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdDestination" + count + "'>" + FinalData[i].DestinationAirportCode + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdCommodity" + count + "'>" + FinalData[i].Commodities + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdPieces" + count + "'>" + FinalData[i].TotalPieces + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdGrWt" + count + "'>" + FinalData[i].TotalGrossWeight + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdStatus" + count + "'>" + FinalData[i].IrregularityStatus + "</span></td>")
                    $("#tbodyIrrData").append("<td class='ui-widget-content first'><span id='tdPIC" + count + "'>" + FinalData[i].CreatedUser + "</span></td>")

                    $("#tbodyIrrData").append("</tr>")
                }
            }
            else
            {
                $("#tbodyIrrData").append("<tr id='trIrrData0'><td class='ui-widget-content first' colspan='16' align='center'><span id='tdGrWt0'>No Record Found</span></td></tr>")
            }
            //});
        }

    })
    //$("#tblIrregularityAWBReportAppendGrid").appendGrid({
    //    V2:true,
    //    tableID: "tblIrregularityAWBReportAppendGrid",
    //    //contentEditable: pageType,
    //    isGetRecord: true,
    //    tableColume: "SNo,IncidentCategory,ReportingStation,AWBNo,IrregularityStatus,UpdatedUser,CreatedUser,FlightNo,FlightDate,OriginAirportCode,DestinationAirportCode,Commodities,TotalPieces,TotalGrossWeight",
    //    masterTableSNo: AwbSNo,
    //    currentPage: 1, itemsPerPage: 5, model: BindAppendWhereCondition(), sort: "",
    //    servicePath: "./Services/Irregularity/IrregularityAWBReportService.svc",
    //    getRecordServiceMethod: "GetIrregularityAWBReportRecord",
    //    caption: "Irregularity Report",
    //    initRows: 1,
    //    columns: [{ name: "SNo", type: "hidden", value: 0 },
    //             { name: "IrregularityReferenceCode", display: "Irreg No", type: "label", ctrlCss: { width: "60px" }, value: 0 },
    //             { name: "IncidentCategory", display: "Incident Cat.", type: "label", ctrlCss: { width: "60px" }, value: 0 },
    //             { name: "ReportingStation", display: "Reporting St.", type: "label", ctrlCss: { width: "100px" }, value: 0 },
    //             { name: "AWBNo", display: "AWB No.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "FlightNo", display: "Flt.No.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "FlightDate", display: "Flt.Dt.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             //{ name: "UpdatedUser", display: "Updated By", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "OriginAirportCode", display: "Org. Airport Code", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "DestinationAirportCode", display: "Dest. Airport Code", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "Commodities", display: "Commodities", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "TotalPieces", display: "Irr. Pcs.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "TotalGrossWeight", display: "Irr. Gr.Wt.", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "IrregularityStatus", display: "Irregularity Status", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //             { name: "CreatedUser", display: "PIC", type: "label", ctrlCss: { width: "242px" }, value: 0 },
    //    ],
    //    isPaging: true,
    //    hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true }
    //});
}

function ExportToExcel_IrregularityReport() {
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

    var table_div = '<table>' + $('#tblBody').html() + '</table>';
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    //a.download = 'AllotmentReport_Flight' + today + '_.xls';
    a.download = 'IrregularityReport' + today + '_.xls';
    a.click();

    return false
}

//function InstantiateSearchControl(cntrlId) {
//    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
//        var controlId = $(this).attr("id");
//        var decimalPosition = cfi.IsValidNumeric(controlId);
//        if (decimalPosition >= -1) {
//            cfi.Numeric(controlId, decimalPosition);
//        }
//        else {
//            var alphabetstyle = cfi.IsValidAlphabet(controlId);
//            if (alphabetstyle != "") {
//                if (alphabetstyle == "datetype") {
//                    cfi.DateType(controlId);
//                }
//                else {
//                    cfi.AlphabetTextBox(controlId, alphabetstyle);
//                }
//            }
//        }
//    });
//    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
//        var controlId = $(this).attr("id");
//        var alphabetstyle = cfi.IsValidAlphabet(controlId);
//        if (alphabetstyle != "") {
//            if (alphabetstyle == "editor") {
//                cfi.Editor(controlId);
//            }
//            else {
//                cfi.AlphabetTextBox(controlId, alphabetstyle);
//            }
//        }
//    });
//    $("table[cfi-aria-search='search']").find("span").each(function () {
//        var attr = $(this).attr('controltype');

//        // For some browsers, `attr` is undefined; for others,
//        // `attr` is false.  Check for both.
//        if (typeof attr !== 'undefined' && attr !== false) {
//            // ...
//            var controlId = $(this).attr("id");

//            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
//            if (decimalPosition >= -1) {
//                //            $(this).css("text-align", "right");
//                cfi.Numeric(controlId, decimalPosition, true);
//            }

//            else {
//                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
//                if (alphabetstyle != "") {
//                    if (alphabetstyle == "datetype") {
//                        cfi.DateType(controlId, true);
//                    }
//                    //                                else {
//                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
//                    //                                }
//                }
//            }
//        }
//    });

//    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
//    //    var controlId = $(this).attr("id");
//    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
//    //});
//}



//function BindAppendWhereCondition() {
//    return {
//        Type:Type
//    };
//}
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
    if (textId.indexOf("Text_ComplaintStatusSNo") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 3);
        //cfi.setFilter(filterComplain, "Name", "notin", "CLOSED");
        //if (userContext.CitySNo != 3992) {
        //    cfi.setFilter(filterComplain, "SNo", "neq", 13);
        //}
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    

}