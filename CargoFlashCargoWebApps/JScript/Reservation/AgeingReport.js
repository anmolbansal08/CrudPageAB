


$(document).ready(function () {
	cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "DailySalesReport_Airline", null, "contains");
	cfi.AutoCompleteV2("AgentName", "Name", "GSACSRReport_Office", null, "contains");
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
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
	}

	if (userContext.GroupName != "ADMIN" && userContext.GroupName != "SUPER ADMIN") {
		$("#Airport").val(userContext.AirportSNo);
		$("#Text_Airport_input").val(userContext.AirportCode + '-' + userContext.AirportName);
		cfi.EnableAutoComplete('Airport', false, true, null);//diasble
	}

    var Report_Type;
    var _field = [];
    var _column = [];
    $('#IsAgeing').attr('checked', true);
    //$('#imgexcel').hide();

    $('input:radio[name=Filter]').change(function () {

        
        var _ReportVal = $("input[name='Filter']:checked").val();
        if (_ReportVal == 0) {
            $('#AirlineCode').closest('tr').hide();
            $('#FromDate').closest('tr').hide();
        }
        else {
            $('#AirlineCode').closest('tr').show();
            $('#FromDate').closest('tr').show();
        }

        $('#tblAgeingDetaiils').hide();
        $('#grid').css('display', 'none');
    });



    $('#exportflight').hide();
    $('#tblAgeingDetaiils').hide();
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../AgeingReport/AgeingReportGetRecord",
                    dataType: "json",
                    global: true,
                    type: 'POST',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data:
                        function GetReportData() {
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
                    id: "SNo"//,
                    //fields: _field
                }, data: function (data) {
                    //$scope.SearchInfoShow = true;
                    if (data) {
                        if (data && data.Table2 && data.Table2.length > 0) {
                            $('#lblGSAName').html(data.Table2[0].GSAName);
                            $('#lblGSACode').html(data.Table2[0].GSACode);
                            $('#lblARCode').html(data.Table2[0].ARCode);
                            $('#lblCurrency').html(data.Table2[0].Currency);
                            $('#lblstmtDt').html(data.Table2[0].StatementDate);
                            $('#lblTotInvAmt').html(data.Table2[0].TotalAmount);
                            $('#lblTotRecAmt').html(data.Table2[0].ReceiptAmount);
                            $('#lblTotOtsdAmt').html(data.Table2[0].TotalOverDue);
                        }
                        else {
                            $('#lblGSAName').html('');
                            $('#lblGSACode').html('');
                            $('#lblARCode').html('');
                            $('#lblCurrency').html('');
                            $('#lblstmtDt').html('');
                            $('#lblTotInvAmt').html('0');
                            $('#lblTotRecAmt').html('0');
                            $('#lblTotOtsdAmt').html('0');
                        }
                        return data.Table0;
                    }
                }, total: function (data) {
                    if (data && data.Table1 && data.Table1.length > 0)
                        return data.Table1[0].Total;
                    else
                        return 0;
                }

                //data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),

        //detailInit: detailInit,
        //filterable: { mode: 'menu' },
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true//,
        //height: 450,
        //columns: _column
    });

});



function ExportToExcel_AgeingReport() {


    var Report_Type;
    var _ReportVal = $("input[name='Filter']:checked").val();
    if (_ReportVal == 0) {
        Report_Type = "AnalysisReport";
    }
    else if (_ReportVal == 1) {
        Report_Type = "PartyWiseReport";
    }
    else {
        Report_Type = "AgeingReport";
    }
        
    $("#AirlineCode").val($('#AirlineCode').val());
    $("#FromDate").val($('#FromDate').val());
    $("#ToDate").val($('#ToDate').val());
    $("#AgentSno").val($('#AgentName').val() == "" ? "0" : $('#AgentName').val());
    $("#ReportType").val(Report_Type);



 }

var Model = [];

function SearchAgeingReport() {


    var Report_Type;
    var _ReportVal = $("input[name='Filter']:checked").val();
    if (_ReportVal == 0) {
        Report_Type = "AnalysisReport";
    }
    else if (_ReportVal == 1) {
        Report_Type = "PartyWiseReport";
    }
    else {
        Report_Type = "AgeingReport";
    }
    
    Model =
        {
            AirlineCode: $('#AirlineCode').val(),
            AgentSno: $('#AgentName').val() == "" ? "0" : $('#AgentName').val(),
            FromDate: $("#FromDate").val(),
            ToDate: $("#ToDate").val(),
            ReportType: Report_Type 
			
        };

    

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning - Daily Report', "From Date can not be greater than To Date !");
        return false;;
    }

    if ((Model.AirlineCode != "" && Model.AgentSno != "0" && Model.ToDate != "" && Model.FromDate != "") || Report_Type == "AnalysisReport" ) {

        GridColumnView();

        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);

        $('#exportflight').show();

        $('#tblAgeingDetaiils').show();
        if (Report_Type == "AnalysisReport") {
            $('#lblReportHeader').html("AGEING ANALYSIS REPORT (DEBTORS)");
            $('#lblGSAName').closest('tr').hide();
            $('#lblGSACode').closest('tr').hide();
        }
        else {
            $('#lblReportHeader').html("AGEING DETAILS (DEBTORS)");
            $('#lblGSAName').closest('tr').show();
            $('#lblGSACode').closest('tr').show();
        }

        

        $('#df #AirlineCode').val(Model.AirlineCode);
        $('#df #FromDate').val(Model.FromDate);
        $('#df #ToDate').val(Model.ToDate);
        $('#df #AgentName').val(Model.AgentSno);
    }
}


function GridColumnView() {
    var Report_Type;
    var _field = [];
    var _column = [];
    
        var _ReportVal = $("input[name='Filter']:checked").val();
        if (_ReportVal == 0) {
            Report_Type = "AnalysisReport";
        }
        else if (_ReportVal == 1) {
            Report_Type = "PartyWiseReport";
        }
        else {
            Report_Type = "AgeingReport";
        }

            
        if (Report_Type == "AnalysisReport") {

            _field = {
                GSACODE: { type: "string" },
                GSAARCODE: { type: "string" },
                GSANAME: { type: "string" },
                InvoiceAmount: { type: "string" },
                ReceiptAmount: { type: "string" },
                OverDue: { type: "string" }

            };

            _column = [
                { field: "GSACODE", title: "GSACODE" },
                { field: "GSAARCODE ", title: "GSAARCODE" },
                { field: "GSANAME", title: "GSANAME" },
                { field: "InvoiceAmount", title: "Invoice Amount" },
                { field: "ReceiptAmount", title: "Receipt Amount" },
                { field: "OverDue", title: "OverDue" }
            ];
        }
        else if (Report_Type == "PartyWiseReport") {
            _field = {
                InvoiceNo: { type: "string" },
                InvoiceDate: { type: "string" },
                InvoiceAmount: { type: "string" },
                ReceiptNo: { type: "string" },
                ReceiptDate: { type: "string" },
                ReceiptAmount: { type: "string" },
                FinalOverDue: { type: "string" }

            };

            _column = [
                //{ field: "InvoiceNo", title: "Invoice No", template: '<a href="InvoiceNo">#=InvoiceNo#</a>' },
                { field: "InvoiceNo", title: "Invoice No", template: '<u><a style="text-underline-position:auto; color:blue;" onclick="GetInvoiceByInvoiceNo(\'#=InvoiceNo#\')">#=InvoiceNo#</a></u>' },
                { field: "InvoiceDate ", title: "Invoice Date" },
                { field: "InvoiceAmount", title: "Invoice Amount" },
                { field: "ReceiptNo", title: "Receipt No" },
                { field: "ReceiptDate", title: "Receipt Date" },
                { field: "ReceiptAmount", title: "Receipt Amount" },
                { field: "FinalOverDue", title: "Final OverDue" }
            ];
        }
        else {
            _field = {
                InvoiceNo: { type: "string" },
                InvoiceDate: { type: "string" },
                TotalAmlount: { type: "string" },
                ReceiptNo: { type: "string" },
                ReceiptDate: { type: "string" },
                ReceiptAmount: { type: "string" },
                Days_01_30: { type: "string" },
                Days_31_60: { type: "string" },
                Days_61_90: { type: "string" },
                Days_91_180: { type: "string" },
                Days_181_360: { type: "string" },
                Days_360: { type: "string" },
                FinalOverDue: { type: "string" }

            };

            _column = [
                //{ field: "InvoiceNo", title: "Invoice No", template: '<a href="InvoiceNo">#=InvoiceNo#</a>' },
                { field: "InvoiceNo", title: "Invoice No", template: '<u><a style="text-underline-position:auto; color:blue;" onclick="GetInvoiceByInvoiceNo(\'#=InvoiceNo#\')">#=InvoiceNo#</a></u>'},
                { field: "InvoiceDate ", title: "Invoice Date" },
                { field: "TotalAmount", title: "Total Amount" },
                { field: "ReceiptNo", title: "Receipt No" },
                { field: "ReceiptDate", title: "Receipt Date" },
                { field: "ReceiptAmount", title: "Receipt Amount" },
                { field: "Days_01_30", title: "01-30 Days" },
                { field: "Days_31_60", title: "31-60 Days" },
                { field: "Days_61_90", title: "61-90 Days" },
                { field: "Days_91_180", title: "91-180 Days" },
                { field: "Days_181_360", title: "181-360 Days" },
                { field: "Days_360", title: "> 360 Days" },
                { field: "FinalOverDue", title: "Final Over Due" },
            ];

    }

    $('#tblAgeingDetaiils').hide();
    var grid = $("#grid").data("kendoGrid");
    var options = grid.getOptions();
    //options.columns[0].title = "new title";
    options.columns = _column;
    grid.setOptions(options);
}

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
}


function GetInvoiceByInvoiceNo(InvoiceNo) {

    $.ajax({
        url: "../ViewInvoiceAndReceipt/GetInvoiceByInvoiceNo?InvoiceNo=" + InvoiceNo + "", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        //data: JSON.parse({ AirlineSNo: $('#Airline').val(), OfficeSNo: $('#Office').val(), month: $('#Month').val(), year: $('#Year').val(), Fortnight: $('#Fortnight').val() }),
        success: function (result) {
            var DivID = 'grid1';
            $('#' + DivID).html('');


            $(result.Data).each(function (row, tr) {
                $.ajax({
                    url: "../Client/" + userContext.SysSetting.ICMSEnvironment + "/Reports/Invoice/GenrateAndViewInvoice.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#' + DivID).append(result);
                        $('#' + DivID).find('#divrViewInvoice').attr('id', 'divrViewInvoice_' + row);
                        var HtmlData = $('#' + DivID).find('div[id="divrViewInvoice_' + row + '"]');
                        var Data = tr;
                        $(HtmlData).find('#AirlineLogo').attr('src', userContext.SysSetting.LogoURL);
                        $(HtmlData).find("#tdAirlineAddress").text(Data.AirlineAddress);
                        $(HtmlData).find("#tdDate").text(Data.InvoiceDate);
                        $(HtmlData).find("#tdGSA_CSA_Airline").text(Data.GSA_CSA_AirlineName);
                        $(HtmlData).find("#tdInvoiceNo").text(Data.InvoiceNo);
                        $(HtmlData).find("#tdAddress").text(Data.GSA_CSA_Address);
                        $(HtmlData).find("#tdPeriod").text(Data.InvoicePeriod);
                        $(HtmlData).find("#tdBillingCurrency").text(Data.InvoiceCurrency);
                        $(HtmlData).find("#tdCountry").text(Data.GSA_CSA_Country);
                        $(HtmlData).find("#tdARCode").text(Data.InvoiceARCode);
                        $(HtmlData).find("#tdAttention").text(Data.Attention);
                        $(HtmlData).find("#tdDueDate").text(Data.InvoiceDueDate);
                        $(HtmlData).find("#brRemarks").text(Data.Remarks);
                        $(HtmlData).find("#brAmount").text(Data.TotalAmlount);
                        $(HtmlData).find("#tdAccountName").text(Data.AccountName);
                        $(HtmlData).find("#tdAccountNo").text(Data.AccountNo);
                        $(HtmlData).find("#tdIBAN").text(Data.IBAN);
                        $(HtmlData).find("#tdBank").text(Data.BankName);
                        $(HtmlData).find("#tdBankAddress").text(Data.BankAddress);
                        $(HtmlData).find("#tdSwift").text(Data.Swift);
                        $(HtmlData).find("#divValueInWords").text(inWords(Data.TotalAmlount));
                        $(HtmlData).find("#tdValueInNumber").text(Data.TotalAmlount);
                        //$("#grid1").append('</br><div class="page-break"></div>');
                        //$("#grid1").append();
                        //$('#grid1').show();
                        
                        $("#grid1").dialog({
                            modal: true,
                            draggable: true,
                            resizable: true,
                            position: ['center', 'top'],
                            show: 'blind',
                            hide: 'blind',
                            width: 800,
                            title: "Invoice Detail",
                            dialogClass: 'ui-dialog-osx',

                        });

                    },
                    beforeSend: function (jqXHR, settings) {
                    },
                    complete: function (jqXHR, textStatus) {
                    },
                    error: function (xhr) {
                        // var a = "";
                    }
                });
            });

           

            //if (result.Data.length > 0) {
            //    $('#btnPrint').show();
            //    $("#imgexcel").show();
            //    $("#imgpdf").show();
            //}
            //else {
            //    $('#btnPrint').hide();
            //}
        }

    });
}

var Model = [];
var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : ' ';
    return str;
}
