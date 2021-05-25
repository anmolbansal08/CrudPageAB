var Recid = 0;
var userSNo = 0;
var cashierIDTo = 0;
var BalanceAmount = 0;
var cashierID = 0;
var isactive = 1;
var count = 0;

$(document).ready(function () {
    $(".form2buttonrow").hide();
    cfi.ValidateForm();
    cfi.AutoCompleteV2("PaymentMode", "PaymentMode", "Shipment_PaymentMode", modechange, "contains");
    cfi.AutoCompleteV2("CreditNote", "TransactionNo,BalanceAmount", "Shipment_CreditNote", getcredit, "contains", ",", null, null, null, null);
    $("#PaymentDate").parent().hide();
    $("#PaymentDate").parent().before($("#PaymentDate").val());
    $('#VirtualAccountNo').closest('tr').hide()

    $("input[type='button'][value='Back']").click(function () {
        var obj = JSON.parse(sessionStorage.getItem("SessionInboundFlight"))
        $.ajax({
            url: 'HtmlFiles/Shipment/SearchShipmentInvoice.html',
            async: false,
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });

                $('#tbl').html('');
                $('#aspnetForm').append(result);
                cfi.DateType("ValidTo");

                var todaydate = new Date();
                $("#ValidFrom").kendoDatePicker({
                    format: "dd-MMM-yyyy"
                });

                $("#ValidTo").kendoDatePicker({
                    format: "dd-MMM-yyyy"
                });




                $("#ValidTo").prop('readonly', true);
                $("#ValidFrom").attr('readOnly', true);
                $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
                $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');
                $("#ValidTo,#ValidFrom").closest("span").width(100);

                cfi.AutoCompleteV2("AWBSNo", "AWBNo", "SearcInvoice_AWBSNo_payment", null, "contains");
                cfi.AutoCompleteV2("invoiceNo", "DBNo", "SearchInvoiceNo_Db_payment", null, "contains");
            }
        });

        navigateUrl('Default.cshtml?Module=Shipment&Apps=Payment&FormAction=NEW&Isback=true');
        var InvoiceSearch = {
            processName: "InvoicePayment",
            moduleName: 'Shipment',
            appName: 'InvoicePayment',
            Action: 'INDEXVIEW',
            searchAWBNo: obj.searchAWBNo,
            searchinvoiceno: obj.searchinvoiceno,
            PaymentOption: obj.PaymentOption,
            searchFromDate: obj.searchFromDate,
            searchToDate: obj.searchToDate,
        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" && getQueryStringValue("invoiceno").toUpperCase() == "ESS") {
        var invoiceno = getQueryStringValue("data");
        $.ajax({
            url: 'HtmlFiles/Shipment/SearchShipmentInvoice.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });

                $('#tbl').html('');
                $('#aspnetForm').append(result);
                cfi.DateType("ValidTo");

                var todaydate = new Date();
                $("#ValidFrom").kendoDatePicker({
                    format: "dd-MMM-yyyy"
                });

                $("#ValidTo").kendoDatePicker({
                    format: "dd-MMM-yyyy"
                });

                $("#ValidTo").prop('readonly', true);
                $("#ValidFrom").attr('readOnly', true);
                $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
                $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');
                $("#ValidTo,#ValidFrom").closest("span").width(100);

                cfi.AutoCompleteV2("AWBSNo", "AWBNo", "SearcInvoice_AWBSNo_payment", null, "contains");
                cfi.AutoCompleteV2("invoiceNo", "DBNo", "SearchInvoiceNo_Db_payment", null, "contains");

                var InvoiceSearch = {
                    processName: "InvoicePayment",
                    moduleName: 'Shipment',
                    appName: 'InvoicePayment',
                    Action: 'IndexView',
                    searchAWBNo: "0",
                    searchinvoiceno: invoiceno,
                    PaymentOption: "0",
                    searchFromDate: "0",
                    searchToDate: "0",
                }

                $('#Text_invoiceNo').val(invoiceno);
                cfi.ShowIndexViewV2("divDeliveryOrderDetails", "./Services/Shipment/PaymentService.svc/GetGridData", InvoiceSearch);

                $('input[type="radio"][name="Filter"]').change(function () {
                    var radiocheck = $("input[name='Filter']:checked").val() == null ? "0" : $("input[name='Filter']:checked").val();
                    if (radiocheck == "0") {
                        cfi.ResetAutoComplete("AWBSNo")
                        var dataSource = GetDataSourceV2("AWBSNo", "SearcInvoice_AWBSNo_payment")
                        cfi.ChangeAutoCompleteDataSource("AWBSNo", dataSource, false, null, "AWBNo");
                        cfi.ResetAutoComplete("invoiceNo")
                        var dataSource1 = GetDataSourceV2("invoiceNo", "SearchInvoiceNo_Db_payment")
                        cfi.ChangeAutoCompleteDataSource("invoiceNo", dataSource1, false, null, "DBNo");
                    }
                    else {
                        cfi.ResetAutoComplete("AWBSNo")
                        var dataSource = GetDataSourceV2("AWBSNo", "SearcInvoice_AWBSNo_recipt")
                        cfi.ChangeAutoCompleteDataSource("AWBSNo", dataSource, false, null, "AWBNo");
                        cfi.ResetAutoComplete("invoiceNo")
                        var dataSource1 = GetDataSourceV2("invoiceNo", "SearchInvoiceNo_Db_receipt")
                        cfi.ChangeAutoCompleteDataSource("invoiceNo", dataSource1, false, null, "DBNo");
                    }
                });

                $("#ValidFrom").change(function () {
                    ValidateDate();
                });

                $("#ValidTo").change(function () {
                    ValidateDate();
                });
                $("#btnSearch").bind("click", function () {
                    InvoiceSearch_ESS();
                });
            }
        });
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "NEW" && getQueryStringValue("invoiceno").toUpperCase() != "ESS") {
        $.ajax({
            url: 'HtmlFiles/Shipment/SearchShipmentInvoice.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#tbl').html('');
                $('#aspnetForm').append(result);
                LoadJS();
            }
        });
    }

    if (getQueryStringValue("Isback").toUpperCase() == "TRUE") {
        var obj = JSON.parse(sessionStorage.getItem("SessionInboundFlight"))
        var InvoiceSearch = {
            processName: "InvoicePayment",
            moduleName: 'Shipment',
            appName: 'InvoicePayment',
            Action: 'INDEXVIEW',
            searchAWBNo: obj.searchAWBNo,
            searchinvoiceno: obj.searchinvoiceno,
            PaymentOption: obj.PaymentOption,
            searchFromDate: obj.searchFromDate,
            searchToDate: obj.searchToDate,
        }
        cfi.ShowIndexViewV2("divDeliveryOrderDetails", "./Services/Shipment/PaymentService.svc/GetGridData", InvoiceSearch);

        if (obj) {
            $("#Text_AWBSNo").val(obj.searchAWBNo);
            $("#Text_invoiceNo").val(obj.searchinvoiceno);
            $("#ValidFrom").val(obj.searchFromDate);
            $("#ValidTo").val(obj.searchToDate);
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        BalanceAmount = parseFloat($("span#BalanceReceivable").text());
        $("input[id^=PaymentDate]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("From", "To");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            if (dfrom > dto)
                $(this).val("");
        });

        if (BalanceAmount <= 0) {
            $('input[name=operation]').hide();
        }

        modechange();
        NetPaybleAmount(0, BalanceAmount, 0);
        $('#Text_PaymentMode').blur(function () {
            modechange();
        });

        $('#PaymentAmmount').blur(function () {
            NetPaybleAmount(0, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
        });

        $('#ChequeAmmount').blur(function () {
            NetPaybleAmount(0, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
        });

        $("body").on("click", ".k-delete", function () {
            var CreditNoteAmount = 0.0000;
            if ($("#divMultiCreditNote ul li span").not("span[id]").length != 0) {
                $("#divMultiCreditNote ul li span").not("span[id]").each(function () {
                    var credit = 0.0000;
                    credit = parseFloat($(this).text().split(",")[0].split('_')[1]);
                    CreditNoteAmount = (parseFloat(CreditNoteAmount) + parseFloat(credit));
                });
                checks(CreditNoteAmount, BalanceAmount);
            }
            else {
                $("span#CreditNoteAmount").text(0);
                $("#Text_PaymentMode").data("kendoAutoComplete");
                $("#PaymentMode").val(1);
                $("#Text_PaymentMode").val('CASH');
                $('#PaymentAmmount').removeAttr('disabled');
                $('#_tempPaymentAmmount').removeAttr('disabled');
                $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#ChequeAmmount').val('').after('');
                $('#_tempChequeAmmount').val('').after('');
                modechange();
                NetPaybleAmount(0, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
            }

            if ($("#CreditNote").val() == "") {
                $('#spnPaymentAmmount').closest('td').find('font').text('*');
                $('#_tempPaymentAmmount').css('border-color', '');
                $('#PaymentAmmount').attr('data-valid', 'required');
                $('#spnPaymentMode').closest('td').find('font').text('*');
                $('#Text_PaymentMode').closest('span').css('border-color', '');
                $('#Text_PaymentMode').attr('data-valid', 'required');
            }
            else {
                $('#spnPaymentAmmount').closest('td').find('font').text('');
                $('#_tempPaymentAmmount').css('border-color', '#94c0d2');
                $('#PaymentAmmount').removeAttr('data-valid');
                $('#spnPaymentMode').closest('td').find('font').text('');
                $('#Text_PaymentMode').closest('span').css('border-color', '#94c0d2');
                $('#Text_PaymentMode').removeAttr('data-valid');
            }
        });

        if ($('#PaymentMode').val() == 1) {
            $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
        }

        if ($('#PaymentMode').val() == 2) {
            $('#ChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            $('#_tempChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
        }

        //Added by Shivali Thakur 
        $('input[name=operation]').click(function () {
            if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT')
                var userSNo = userContext.UserSNo;
            $.ajax({
                url: "./Services/Shipment/PaymentService.svc/GetUserAccountStatus",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ SNo: userSNo }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    FinalData = dataTableobj.Table0;
                    if (FinalData[0].IsActive == "False") {
                        $('#VirtualAccountNo').attr("data-valid", "required");
                        //ShowMessage('warning', 'Need your Kind Attention!', "Your account has closed, Please login again and start your shift !!!");
                        ShowMessage('warning', 'Need your Kind Attention!', "Please start your shift before taking payment.");
                        return false;
                    }
                    else {
                        $('#VirtualAccountNo').removeAttr("data-valid");
                        NetPaybleAmount(0, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
                        return true;
                    }
                },
                error: function (err) {
                    alert("Generated Error");
                }
            });
        });
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        var Button = "&nbsp;&nbsp;<input type=button id=print name=Print value=Print onclick=PrintServicePDF(); />";
        $(".formbuttonrow").html(Button);
        Recid = getQueryStringValue('RecID');
        userSNo = getQueryStringValue('UserID')
        PrintService();
    }

    window.onbeforeunload = function () {
        $("input[type=button], input[type=submit]").attr("disabled", "disabled");
    };

    $("#PaymentReceived").blur(function () {
        if ($("#PaymentReceived").val() != "" && $("#PaymentAmmount").val() != "")
            PaymentReceived($("#PaymentReceived").val(), $("#PaymentAmmount").val());
    });

    $("input[id='PaymentReceived']").attr("disabled", "disabled");
    // Add BY Sushant On 02-08-2018
    UserPageRights("Payment")
    if (isCreate == false) { $('input[value="Update"]').hide(); } else { $('input[value="Update"]').show(); }
});

//Added by devendra on 15 sept 2017 for checking amount must be greater than zero
$("#PaymentAmmount").blur(function () {
    checkcashamount();
});

function LoadJS() {
    cfi.DateType("ValidTo");
    var todaydate = new Date();
    $("#ValidFrom").kendoDatePicker({
        format: "dd-MMM-yyyy"
    });

    $("#ValidTo").kendoDatePicker({
        format: "dd-MMM-yyyy"
    });

    $("#ValidTo").prop('readonly', true);

    $('#ValidFrom').blur(function () {
        var expiarydate = new Date($("#ValidFrom").val());
        var today = new Date();
    });

    $("#ValidFrom").attr('readOnly', true);
    $("#ValidTo,#ValidFrom ").addClass('k-input k-state-default');
    $("#ValidTo ,#ValidFrom").closest('span').removeClass(' k-input');
    $("#ValidTo,#ValidFrom").closest("span").width(100);

    cfi.AutoCompleteV2("AWBSNo", "AWBNo", "SearcInvoice_AWBSNo_payment", null, "contains");
    cfi.AutoCompleteV2("invoiceNo", "DBNo", "SearchInvoiceNo_Db_payment", null, "contains");

    $('input[type="radio"][name="Filter"]').change(function () {
        var radiocheck = $("input[name='Filter']:checked").val() == null ? "0" : $("input[name='Filter']:checked").val();
        if (radiocheck == "0") {
            cfi.ResetAutoComplete("AWBSNo")
            var dataSource = GetDataSourceV2("AWBSNo", "SearcInvoice_AWBSNo_payment")
            cfi.ChangeAutoCompleteDataSource("AWBSNo", dataSource, false, null, "AWBNo");
            cfi.ResetAutoComplete("invoiceNo")
            var dataSource1 = GetDataSourceV2("invoiceNo", "SearchInvoiceNo_Db_payment")
            cfi.ChangeAutoCompleteDataSource("invoiceNo", dataSource1, false, null, "DBNo");
        }
        else {
            cfi.ResetAutoComplete("AWBSNo")
            var dataSource = GetDataSourceV2("AWBSNo", "SearcInvoice_AWBSNo_recipt")
            cfi.ChangeAutoCompleteDataSource("AWBSNo", dataSource, false, null, "AWBNo");
            cfi.ResetAutoComplete("invoiceNo")
            var dataSource1 = GetDataSourceV2("invoiceNo", "SearchInvoiceNo_Db_receipt")
            cfi.ChangeAutoCompleteDataSource("invoiceNo", dataSource1, false, null, "DBNo");
        }
    });

    $("#ValidFrom").change(function () {
        ValidateDate();
    });

    $("#ValidTo").change(function () {
        ValidateDate();
    });
    $("#btnSearch").bind("click", function () {

        InvoiceSearch();
    });
};

function ValidateDate() {
    var fromDate = $("#ValidFrom").attr("sqldatevalue");
    var toDate = $("#ValidTo").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $('#ValidFrom').data("kendoDatePicker").value("");
            $('#ValidTo').data("kendoDatePicker").value("");
            $("#ValidFrom").val("");
            $("#ValidTo").val("");
            ShowMessage('warning', 'Warning - Invoice Payment', "From date should not be greater than To date.");
        }
    }
}

function InvoiceSearch_ESS() {
    $('#lblerror').html('');
    var searchAWBNo = $("#Text_AWBSNo").val() == "" ? "0" : $("#Text_AWBSNo").val();
    var searchinvoiceno = $("#Text_invoiceNo").val() == "" ? "0" : $("#Text_invoiceNo").val();
    var PaymentOption = $("input[name='Filter']:checked").val() == null ? "0" : $("input[name='Filter']:checked").val();
    var LoggedInCity = userContext.CityCode;
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#ValidFrom").val() != "") {
        searchFromDate = cfi.CfiDate("ValidFrom") == "" ? "0" : cfi.CfiDate("ValidFrom");// "";//month + "-" + day + "-" + year;
    }

    if ($("#ValidTo").val() != "") {
        searchToDate = cfi.CfiDate("ValidTo") == "" ? "0" : cfi.CfiDate("ValidTo");// "";//month + "-" + day + "-" + year;
    }

    var InvoiceSearch = {
        processName: "InvoicePayment",
        moduleName: 'Shipment',
        appName: 'InvoicePayment',
        Action: 'IndexView',
        searchAWBNo: searchAWBNo,
        searchinvoiceno: searchinvoiceno,
        PaymentOption: PaymentOption,
        searchFromDate: searchFromDate,
        searchToDate: searchToDate,
    }
    cfi.ShowIndexViewV2("divDeliveryOrderDetails", "./Services/Shipment/PaymentService.svc/GetGridData", InvoiceSearch);
}

function InvoiceSearch() {
    $('#lblerror').html('');
    var searchAWBNo = $("#Text_AWBSNo").val() == "" ? "0" : $("#Text_AWBSNo").val();
    var searchinvoiceno = $("#Text_invoiceNo").val() == "" ? "0" : $("#Text_invoiceNo").val();
    var PaymentOption = $("input[name='Filter']:checked").val() == null ? "0" : $("input[name='Filter']:checked").val();
    var LoggedInCity = userContext.CityCode;
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#ValidFrom").val() != "") {
        searchFromDate = cfi.CfiDate("ValidFrom") == "" ? "0" : cfi.CfiDate("ValidFrom");// "";//month + "-" + day + "-" + year;
    }

    if ($("#ValidTo").val() != "") {
        searchToDate = cfi.CfiDate("ValidTo") == "" ? "0" : cfi.CfiDate("ValidTo");// "";//month + "-" + day + "-" + year;
    }

    var InvoiceSearch = {
        processName: "InvoicePayment",
        moduleName: 'Shipment',
        appName: 'InvoicePayment',
        Action: 'IndexView',
        searchAWBNo: searchAWBNo,
        searchinvoiceno: searchinvoiceno,
        PaymentOption: PaymentOption,
        searchFromDate: searchFromDate,
        searchToDate: searchToDate,
    }
    cfi.ShowIndexViewV2("divDeliveryOrderDetails", "./Services/Shipment/PaymentService.svc/GetGridData", InvoiceSearch);
    sessionStorage.setItem("SessionInboundFlight", JSON.stringify(InvoiceSearch));
}

function checkcashamount() {
    var amountCash = parseFloat($("#PaymentAmmount").val())
    if (amountCash <= 0.000 || amountCash <= 0 || amountCash == undefined) {
        ShowMessage('warning', 'Invoice Payment', "Cash Amount Must be greater than Zero for Payment! ", "bottom-right");
        $("#PaymentAmmount").val('');
        $("#_tempPaymentAmmount").val('');
        return false;
    }
}
//***** End Here************\\

function paymentcardDetails() {
    var trRow = $('#PaymentMode').closest('tr').index()
    $('#tbl > tbody > tr').eq(trRow).after('<tr id="trcardtype"><td class=" formlabel" title="Select Card Type"><font color="red">*</font><span id="spnCardTyoe">Card Type</span></td><td class="formInputcolumn"> <input type="radio" tabindex="1" data-radioval="Debit Card" class="" name="IsCard" checked="True" id="IsCard" value="0">Debit Card <input type="radio" tabindex="1" data-radioval="Credit Card" class="" name="IsCard" id="IsCard" value="1">Credit Card</td><td class="formlabel" title="Enter Bank Name"><font color="red">*</font>Bank Name</td><td class="formInputcolumn"><input type="text" class="k-input" name="BankNameCard" id="BankNameCard" style="width: 175px; text-transform: uppercase;" controltype="uppercase" data-valid="required" data-valid-msg="Enter Bank Name" tabindex="11" maxlength="20" value="" data-role="alphabettextbox" autocomplete="off"></td></tr><tr id="trcardNumber"><td class="formlabel" title="Enter Card Number"><font color="red">*</font>Card No.</td><td class="formInputcolumn"><input type="text" class="k-input" name="CardNumberCard" id="CardNumberCard" style="width: 250px; text-transform: uppercase;" controltype="alphanumericupper" data-valid-msg="Card No cannot be blank" tabindex="17" maxlength="19" value="" data-role="alphabettextbox" autocomplete="off" oldvalue="" newvalue="" data-valid="required"></td></tr>');
}

function PrintSlip(InvoiceSNo, InvoiceType) {
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'TH') {
        window.open("HtmlFiles/Shipment/Payment/RayaDeliveryBillPrint.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
    else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'UK') {
        window.open("Client/UK/Invoice/DeliveryBillPrint.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
    else {
        window.open("HtmlFiles/Shipment/Payment/DeliveryBillPrint.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
}

function Print(DOSNo, InvoiceSNo) {
    var Type = "DO";
    if (typeof InvoiceSNo === "undefined") {
        InvoiceSNo = 0;
    }

    if (Type == "DO")
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'TH') 
            window.open("Client/TH/DOPrintRaya.html?DOSNo=" + (DOSNo == "" ? 0 : DOSNo) + "&Type=" + Type + "&InvoiceSNo=" + InvoiceSNo);  //added by ankit kumar(15667)
else
        window.open("HtmlFiles/DeliveryOrder/DeliveryOrder.html?DOSNo=" + (DOSNo == "" ? 0 : DOSNo) + "&Type=" + Type + "&InvoiceSNo=" + InvoiceSNo);

    
   }

function PrintServicePDF() {
    $("#tbl").hide();
    window.PrintServicePDF();
}

function ReadAllData() {
}

function PrintService() {
    $("#tbl").hide();
    ReadAllData();
    $.ajax({
        url: "./Services/Shipment/PaymentService.svc/GetChargeNotePrintRecord", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ SNo: Recid }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var es = JSON.parse(result);
            if (es.Table0 != "") {
                var tbl = "";
                tbl += "<div id='printPayment' align='center' style='padding:5px;'><table> <tr>"
                    + "<th colspan='3' rowspan='2' style='display:none;'><center><img alt='LOGO' src='logo/gaurdacms%20logo.jpg' style='width: 139px; height: 56px' /></center>"
                    + "</th><th colspan='3' style='display:none'>RE-PRINT</th></tr>"
                    + "<tr><th colspan='8' align='center'>CHARGE NOTE - CARGO</th></tr>"
                    + "<tr><td colspan='6' id='spnReciptNumber '></td><td align='right'>Date:</td><td>" + es.Table0[0].Date.toUpperCase() + "</td></tr>"
                    + "<tr><td colspan='6'></td><td align='right' id='spnPage'>Page:</td><td id='spnPage'>1</td></tr>"
                    + "<tr><td colspan='6'></td><td align='right' id='spnTime'>Time:</td><td id='spnTime'>" + es.Table0[0].Time + "</td></tr>"
                    + "<tr><td>Payment</td><td>:</td><td id='spnPayment' colspan='2'>" + es.Table0[0].PaymentMode + "</td><td colspan='2'>&nbsp;</td><td>Doc No:</td>"
                    + "<td id='spnDocNo'>" + es.Table0[0].InvoiceNo + " </td></tr>"
                    + "<tr><td>Airline</td><td>:</td><td colspan='2'>**</td><td colspan='2'>&nbsp;</td><td>&nbsp;</td> <td id='spnAirline'>" + es.Table0[0].AirlineName + "</td></tr>"
                    + "<tr><td>Flight No</td><td>:</td><td colspan='2' id='spnFlightNo'>" + es.Table0[0].FlightNo + "</td><td colspan='2'></td><td>Doc Date:</td> "
                    + "<td id='spnDocDate'>" + es.Table0[0].InvoiceDate + "</td></tr>"
                    + "<tr><td>Party</td><td>:</td><td colspan='2' id='spnParty'>&nbsp;" + es.Table0[0].Name + "</td><td colspan='2'>&nbsp;</td><td>Mvmt No:</td> "
                    + "<td id='spnMvmtNo'>" + es.Table0[0].AWBNo + "</td></tr>"
                    + " <tr> <th colspan='8' id='error'> <table width='100%'> <tr><td colspan='6'><hr size='1' /></td></tr><tr> <th align='left'>Chg</th><th align='left'>Description</th>"
                    + "<th align='left'>Qty</th><th align='left'>Disc.</th> <th align='left'> Chg. Amt.</th><th align='left'>Amt Remarks</th> </tr>"
                    + "<tr><td colspan='6'><hr size='1' /></td></tr><tr> <td>AWB:</td><td id='spnAwbNo'>" + es.Table0[0].AWBNo + "</td>"
                    + "<td id='spnAwbQtyPcs'>Pcs/Wt:" + es.Table0[0].TotalPieces + "/" + es.Table0[0].TotalGrossWeight + "</td><td id='spnAwbDisChgAmt'>" + es.Table0[0].CommodityCode + "</td>"
                    + "<td id='spnAWBAmountRemarks'>" + es.Table0[0].TotalAmount + "</td>"
                    + "<td id='spnSLINo'>" + es.Table0[0].SLINo + "</td></tr>";

                for (var i = 0; i < es.Table0.length; i++) {
                    tbl += "<tr>" +
                        + "<td>" + es.Table0[i].TariffCode + "</td>"
                        + "<td>" + es.Table0[i].TariffName + "</td>"
                        + "<td id='spnAccQty'>" + es.Table0[i].TotalPieces + "</td>"
                        + "<td></td>"
                        + "<td></td>"
                        + "<td id='spnAccAmountRemarks'>" + es.Table0[i].ChargeValue + "</td>"
                        + "</tr>"
                }
                +"</th>"
                    + "</table>"
                    + "</div> ";

                tbl += "<tr><td colspan='6'><hr size='1' /></td></tr>"
                    + " <tr><td></td><td></td><td>Total Amount:</td> <td></td><td align='right' id='spnTotalAmount'>" + es.Table0[0].TotalAmount + "</td>"
                    + "  <td align='right' id='spnPaymentNew'>(" + es.Table0[0].PaymentMode + ")</td> </tr>"
                    + " <tr><td colspan='6'><hr size='1' /></td></tr> </table></td></tr>"
                    + "<tr><td colspan='8'>Note :</td></tr>"
                    + " <tr><td colspan='8'>* Total Amount rounded up/off next Dhs.</td></tr>"
                    + " <tr><td colspan='5'>Service</td> <td colspan='3' align='right' id='spnPreparedBy'>" + es.Table0[0].ReceivedBy + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='5'>Received By</td>"
                    + "<td colspan='3' align='right'>Prepared By___________</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'>Receipt Done By:</td>"
                    + " <td id='spnReciptDoneBy'>" + es.Table0[0].CreatedBy + "</td>"
                    + " <td>on:</td>"
                    + "<td id='spnReciptDoneOn'>" + es.Table0[0].CreatedOn + "</td>"
                    + "</tr>"
                    + "<tr><td colspan='8'><div style='height:120px;'></div></td></tr>"
                    + "<tr><td colspan='8'><hr size='1' color='black' /></td></tr>"
                    + "<tr><td colspan='8'><center>"
                    + "<font size='2'>Garuda Indonesia<br />"
                    + "Cheques to be made in favour of : Garuda Indonesia</font></center></td></tr>"
                    + " <tr><td colspan='8'><hr size='1' color='black' /></td></tr>"
                $("#ApplicationTabs").append(tbl);
            }
            else {
                ShowMessage('warning', 'Warning - Payment Receipt Print', "No Record Found For Print.", "bottom-right");
                return true;
            }
        }
    })
}

function ChangeActionName() {
    $('#FirstGrid').find('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);

                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "PAYMENT" || $(this).text().toUpperCase() == "EDIT") {
                        $(this).text('Payment');
                        $(this).closest("a").css("display", "block");
                    }

                    if ($(this).text().toUpperCase() == "READ" || $(this).text().toUpperCase() == "RECEIPT") {
                        $(this).text('RECEIPT');
                        $(this).closest("a").css("display", "none");
                    }
                });

                if (isactive == 0) {
                    $(".tool-items").find(".actionSpan").each(function () {
                        if ($(this).text().toUpperCase() == "EDIT" || $(this).text().toUpperCase() == "PAYMENT") {
                            $(this).closest("a").css("display", "none");
                        }
                    });
                }
                else {
                    $(".tool-items").find(".actionSpan").each(function () {
                        if ($(this).text().toUpperCase() == "EDIT") {
                            $(this).closest("a").css("display", "block");
                        }
                    });
                }
            }
        });
    });
}

function ChangeActionName1() {
    $('#SecondGrid').find('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "PAYMENT" || $(this).text().toUpperCase() == "EDIT" || $(this).text().toUpperCase() == "PRINT") {
                    }
                    if ($(this).text().toUpperCase() == "READ" || $(this).text().toUpperCase() == "RECEIPT") {
                        $(this).closest("a").css("display", "none");
                    }
                });
            }
        });
    });

    $('#SecondGrid').find('.k-grid-content').find("tr").each(function () {
        $(this).find(".tool-items").find(".actionSpan").each(function () {
            $(this).closest("a").css("display", "none");
            if ($(this).text().toUpperCase() == "PAYMENT" || $(this).text().toUpperCase() == "EDIT") {
                $(this).closest("a").css("display", "none");
            }
        });

        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if ((recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(".tool-items").find(".actionSpan").each(function () {
                    $(this).closest("a").css("display", "none");
                    if ($(this).text().toUpperCase() == "PAYMENT" || $(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "none");
                    }
                });
            }
        });
    });
}

function PrintData() {
    alert('a');
    return false;
}

$("#ChequeNo").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
});

var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {
};

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
}

//added by pankaj khanna
//remove confirmation box
function modechange() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        // added by Sushant 
        if ($('#OfficeName').val() == "") {
            $('#spnOfficeName').hide()
        }

        if ($("#Text_PaymentMode").val().trim().toUpperCase() == "TOP UP".trim().toUpperCase()) {
            CheckPaymentMode($("#Text_PaymentMode").val().trim().toUpperCase());
            $('#VirtualAccountNo').attr("data-valid", "required")
        } else {
            $('#VirtualAccountNo').closest('tr').hide()
            $('#VirtualAccountNo').removeAttr("data-valid")
        }

        if ($('#AccountSNo').val() == 0) {
            $('#AccountName').closest('tr').find('td[title="Account Name"]').text('Airline Name');
            $('#AccountName').closest('tr').find('td[title="Account Name"]').attr('title', 'Airline Name');
        }

        if ($('#PaymentMode').val() == 3) {
            $('#trcardtype').html('');
            $('#trcardNumber').html('');
            paymentcardDetails();

            $("#CardNumberCard").keypress(function (e) {
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            });
        }

        if ($('#PaymentMode').val() == 2) {

            $('#tbl .formSection').each(function () {
                if ($(this).html().toUpperCase() == "CHEQUE INFORMATION") {
                    $(this).closest('tr').show()
                }
            });
            $("#spnChequeNo").closest('tr').show()
            $("#spnChequeAmmount").closest('tr').show()
            $("#spnChequeAccountName").closest('tr').show()
            $("#spnChequeDate").closest('tr').show()
            $("#spnBankName").closest('tr').show()
            $("#spnBranchName").closest('tr').show()

            $('#trcardNumber').hide();
            $('#trcardtype').hide();
            $('#trcardtype').attr('data-valid', '');
            $('#trcardNumber').attr('data-valid', '');

            $('#ChequeNo').removeAttr('disabled');
            $('#ChequeAmmount').removeAttr('disabled');
            $('#ChequeAccountName').removeAttr('disabled');
            $('#ChequeDate').data("kendoDatePicker");
            $('#BankName').removeAttr('disabled');
            $('#BranchName').removeAttr('disabled');

            $("#spnChequeNo").closest('td').find('font').text('*');
            $("#spnChequeAmmount").closest('td').find('font').text('*');
            $("#spnChequeAccountName").closest('td').find('font').text('*');
            $("#spnChequeDate").closest('td').find('font').text('*');
            $("#spnBankName").closest('td').find('font').text('*');
            $("#spnBranchName").closest('td').find('font').text('*');

            $('#ChequeNo').css('border-color', '');
            $('#_tempChequeAmmount').css('border-color', '');
            $('#ChequeAccountName').css('border-color', '');
            $('#ChequeDate').closest('span').css('border-color', '');
            $('#BankName').css('border-color', '');
            $('#BranchName').css('border-color', '');

            $('#ChequeNo').attr('data-valid', 'required');
            $('#ChequeAmmount').attr('data-valid', 'required');
            $('#ChequeAccountName').attr('data-valid', 'required');
            $('#ChequeDate').attr('data-valid', 'required');
            $('#BankName').attr('data-valid', 'required');
            $('#BranchName').attr('data-valid', 'required');

            $('#PaymentAmmount').attr('disabled', true);
            $('#spnPaymentAmmount').closest('td').find('font').text('');
            $('#_tempPaymentAmmount').css('border-color', '#94c0d2');
            $('#PaymentAmmount').removeAttr('data-valid');
            $('#_tempPaymentAmmount').val('');
            $('#PaymentAmmount').val('');

            if ($('#PaymentMode').val() == 2) {
                var TotalReceivable = $('#TotalReceivable').val();
                var currency = TotalReceivable.replace(/[0-9]./g, '');
                $('#ChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#_tempChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            }
            NetPaybleAmount(0, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
        }
        else {
            if ($('#PaymentMode').val() == 1 || $('#CreditNote').val() == undefined) {
                if ($('#PaymentMode').val() == 1) {
                    $('#trcardNumber').hide();
                    $('#trcardtype').hide();
                    $('#trcardtype').attr('data-valid', '');
                    $('#trcardNumber').attr('data-valid', '');
                }

                $('#PaymentAmmount').removeAttr('disabled');
                $('#spnPaymentAmmount').closest('td').find('font').text('*');
                $('#_tempPaymentAmmount').css('border-color', '');
                $('#PaymentAmmount').attr('data-valid', 'required');
                if ($('#PaymentAmmount').val() == 1)
                    $('#PaymentAmmount').removeAttr('disabled');
            }
            else {
                $('#PaymentAmmount').attr('disabled', true);
                $('#spnPaymentAmmount').closest('td').find('font').text('');
                $('#_tempPaymentAmmount').css('border-color', '#94c0d2');
                $('#PaymentAmmount').removeAttr('data-valid');
                $('#_tempPaymentAmmount').val('');
                $('#PaymentAmmount').val('');
            }

            $('#ChequeNo').attr('disabled', true);
            $('#ChequeAmmount').attr('disabled', true);
            $('#ChequeAccountName').attr('disabled', true);
            $('#ChequeDate').data("kendoDatePicker");
            $('#BankName').attr('disabled', true);
            $('#BranchName').attr('disabled', true);

            $('#ChequeNo').css('border-color', '#94c0d2');
            $('#_tempChequeAmmount').css('border-color', '#94c0d2');
            $('#ChequeAccountName').css('border-color', '#94c0d2');
            $('#ChequeDate').closest('span').css('border-color', '#94c0d2');
            $('#BankName').css('border-color', '#94c0d2');
            $('#BranchName').css('border-color', '#94c0d2');


            $('#tbl .formSection').each(function () {
                if ($(this).html().toUpperCase() == "CHEQUE INFORMATION") {
                    $(this).closest('tr').hide()
                }
            });
            $("#spnChequeNo").closest('tr').hide()
            $("#spnChequeAmmount").closest('tr').hide()
            $("#spnChequeAccountName").closest('tr').hide()
            $("#spnChequeDate").closest('tr').hide()
            $("#spnBankName").closest('tr').hide()
            $("#spnBranchName").closest('tr').hide()


            $('#ChequeNo').removeAttr('data-valid');
            $('#ChequeAmmount').removeAttr('data-valid');
            $('#ChequeAccountName').removeAttr('data-valid');
            $('#ChequeDate').removeAttr('data-valid');
            $('#BankName').removeAttr('data-valid');
            $('#BranchName').removeAttr('data-valid');

            $('#ChequeNo').val('');
            $('#ChequeAccountName').val('');
            $('#BankName').val('');
            $('#BranchName').val('');
            $('#ChequeDate').data("kendoDatePicker").value('');
            $('#_tempChequeAmmount').val('').after('');
            $('#ChequeAmmount').val('').after('');

            if ($('#PaymentMode').val() == 1) {
                $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            }
            NetPaybleAmount(0, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
        }
    }
}

function getcredit(id, text, hdnid, key) {
    var credit = 0.0000;
    var CreditNoteAmount = 0.0000;
    credit = parseFloat(text.split(",")[0].split('_')[1]);
    if (credit >= 0) {
        CreditNoteAmount = (parseFloat(CreditNoteAmount) + parseFloat(credit) + parseFloat($("span#CreditNoteAmount").text() == "" ? 0 : $("span#CreditNoteAmount").text()));
        checks(CreditNoteAmount, BalanceAmount);
        $('#spnPaymentAmmount').closest('td').find('font').text('');
        $('#_tempPaymentAmmount').css('border-color', '#94c0d2');
        $('#PaymentAmmount').removeAttr('data-valid');
        $('#spnPaymentMode').closest('td').find('font').text('');
        $('#Text_PaymentMode').closest('span').css('border-color', '#94c0d2');
        $('#Text_PaymentMode').removeAttr('data-valid');
    }
}

function checks(CreditNoteAmount, BalanceAmount) {
    if (CreditNoteAmount > BalanceAmount) {
        $("span#CreditNoteAmount").text(BalanceAmount.toFixed(2));
        $("#Text_PaymentMode").val('');
        $("#PaymentMode").val('');
        $("#PaymentAmmount").val('');
        $("#_tempPaymentAmmount").val('');
        $("#ChequeNo").val('');
        $("#_tempChequeAmmount").val('').after('');
        $("#ChequeAmmount").val('').after('');
        $("#ChequeAccountName").val('');
        $("#ChequeDate").val('');
        $("#BranchName").val('');
        $("#BankName").val('');
        $("#Text_PaymentMode").data("kendoAutoComplete");
        $('#PaymentAmmount').attr('disabled', true);
        $('#_tempPaymentAmmount').attr('disabled', true);
        modechange();
        NetPaybleAmount(BalanceAmount, 0, 0)
    }
    else {
        $("span#CreditNoteAmount").text(CreditNoteAmount.toFixed(2));
        $("#Text_PaymentMode").data("kendoAutoComplete");
        $('#_tempPaymentAmmount').removeAttr('disabled');
        $('#PaymentAmmount').removeAttr('disabled');

        if ($('#PaymentMode').val() == 1) {
            $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
        }
        if ($('#PaymentMode').val() == 2) {
            $('#ChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text())).after('');
            $('#_tempChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text())).after('');
        }
        modechange();
        NetPaybleAmount(CreditNoteAmount, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val())
    }
}

function NetPaybleAmount(CreditNoteAmount, CashAmount, ChequeAmmount) {
    var total = parseFloat(CreditNoteAmount) + parseFloat(CashAmount) + parseFloat(ChequeAmmount);
    $("#NetPayableAmount").val(total.toFixed());
    $("span#NetPayableAmount").text(total.toFixed(2));

    var cash = parseFloat($('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val());
    var chq = parseFloat($('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
    var transtotal = cash + chq;
    if (total <= BalanceAmount && BalanceAmount > 0) {
        return true;
    }
    else {
        ShowMessage('warning', 'Need your Kind Attention!', "Total Amount  of " + total.toFixed(2) + " should be less than or equal to " + BalanceAmount.toFixed(2));
        $('#_tempChequeAmmount').val('').after('');
        $('#ChequeAmmount').val('').after('');
        $('#_tempPaymentAmmount').val('');
        $('#PaymentAmmount').val('');
        return false;
    }
}

function PaymentReceiptPrintSlip(SNo) {
    window.open("HtmlFiles/Shipment/Payment/ReceiptNotePaymentPrint.html?ReceiptSNo=" + SNo + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL + "&FooterHTML=" + userContext.SysSetting.FooterHTML);
}

function PaymentReceived(ReceivedAmount, CashAmount) {
    var Amount = 0.00;
    if (parseFloat(ReceivedAmount) > parseFloat(CashAmount)) {
        Amount = parseFloat(ReceivedAmount).toFixed(2) - parseFloat(CashAmount).toFixed(2);
        $("#AmountCalculateDiv").html('');

        $("#AmountCalculateDiv").append('<table style="width:100%; border-collapse: collapse;border: 1px solid black;"><tr><td style="width:50%; border: 1px solid black;">Cash Received</td><td style="width:50%; border: 1px solid black;text-align:right;">' + parseFloat(ReceivedAmount).toFixed(2) + '</td></tr><tr><td style=" width:50%; border: 1px solid black;">Payable Amount</td><td style="width:50%; border: 1px solid black;text-align:right;">' + parseFloat(CashAmount).toFixed(2) + '</td></tr><tr><td style="width:50%; color:red;border: 1px solid black;">Cash to be return</td><td style="width:50%; color:red; border: 1px solid black; text-align:right;">' + parseFloat(Amount).toFixed(2) + '</td></tr></table>')

        $("#AmountCalculateDiv").dialog(
            {
                autoResize: true,
                maxWidth: 350,
                maxHeight: 200,

                width: 350,
                height: 200,
                modal: true,
                title: 'Payment Received',
                draggable: true,
                resizable: false,
                buttons: {
                    "Ok": function () { $(this).dialog("close"); },
                    //Cancel: function () {
                    //    $(this).dialog("close");
                    //}
                },
                close: function () {
                    $(this).dialog("close");
                }
            });
    }
}

function PrintInvoice(InvoiceSNo, InvoiceType) {
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'UK') {
        window.open("Client/UK/Invoice/GenrateAndViewInvoice.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
    else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'G8') {
        window.open("Client/G8/Invoice/GenrateAndViewInvoice.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
    else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'TH') {
        //if (InvoiceType == 0 || InvoiceType == 2) {
            window.open("Client/TH/Invoice/GenerateAndViewInvoice.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
        //}
        //else {
        //    window.open("HtmlFiles/Shipment/Payment/ExportInvoiceReceipt.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
        //}
    }
    else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'G9')
    {
        window.open("Client/G9/Reports/Invoice/GenrateAndViewInvoice.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
    else if (InvoiceType == 8) {
        window.open("HtmlFiles/Shipment/Payment/ExportInvoicePenalityReceipt.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
    else {
        window.open("HtmlFiles/Shipment/Payment/ExportInvoiceReceipt.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
    }
}

//// Add BY Sushant
function CheckPaymentMode(Payment) {
    $.ajax({
        url: "./Services/Shipment/PaymentService.svc/CheckPaymentMode", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ PaymentSNo: Payment, AccountSno: $("#AccountSNo").val(), Type: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var PaymentAmmount = $("#PaymentAmmount").val();
            if (jQuery.parseJSON(result).Table0 != "") {
                if (parseFloat(PaymentAmmount) >= parseFloat(jQuery.parseJSON(result).Table0[0].creditlimit)) {
                    ShowMessage('info', 'Invoice Payment', "Available balance not suficiente for Paymnet! ", "bottom-right");
                    $('#VirtualAccountNo').closest('tr').hide()
                    $("#PaymentMode").val("1")
                    $("#Text_PaymentMode").val("Cash")
                } else {
                    $("#VirtualAccountNo").val(jQuery.parseJSON(result).Table0[0].VAccountNo)
                    $("#_tempVirtualAccountNo").val(jQuery.parseJSON(result).Table0[0].VAccountNo)
                    $('#VirtualAccountNo').closest('tr').show()
                }
            } else {
                ShowMessage('info', 'Invoice Payment', "This Agent  Name does not have top up ", "bottom-right");
                $('#VirtualAccountNo').closest('tr').hide()
                $("#PaymentMode").val("1")
                $("#Text_PaymentMode").val("Cash")
            }
        }
    });
}

$(document).on('change', '#VirtualAccountNo', function () {
    $.ajax({
        url: "./Services/Shipment/PaymentService.svc/CheckPaymentMode", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ PaymentSNo: 1, AccountSno: 1, Type: $("#VirtualAccountNo").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var PaymentAmmount = $("#PaymentAmmount").val();
            if (jQuery.parseJSON(result).Table0 != "") {
                if (parseFloat(PaymentAmmount) >= parseFloat(jQuery.parseJSON(result).Table0[0].creditlimit)) {
                    ShowMessage('info', 'Invoice Payment', "Available balance not suficiente for Paymnet! ", "bottom-right");
                    $("#VirtualAccountNo").val("")
                    $("#_tempVirtualAccountNo").val("")
                } else {
                    $("#VirtualAccountNo").val(jQuery.parseJSON(result).Table0[0].VAccountNo)
                    $("#_tempVirtualAccountNo").val(jQuery.parseJSON(result).Table0[0].VAccountNo)
                    $('#VirtualAccountNo').closest('tr').show()
                }
            } else {
                ShowMessage('info', 'Invoice Payment', "This Virtual Account No does not Exist!", "bottom-right");
            }
        }
    });
});

// Add By Sushant Kumar nayak On 02-08-2018
var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;
function UserPageRights(apps) {
    $(userContext.PageRights).each(function (i, e) {
        if (e.Apps.toUpperCase() == apps.toUpperCase() && e.PageName.toUpperCase().trim() == "Invoice Payment".toUpperCase().trim()) {
            if (e.PageRight.toUpperCase() == 'New'.toUpperCase()) {
                isCreate = true;
            }

            if (e.PageRight.toUpperCase() == 'Edit'.toUpperCase()) {
                IsEdit = true;
            }

            if (e.PageRight.toUpperCase() == 'Delete'.toUpperCase()) {
                IsDelete = true;
            }

            if (e.PageRight.toUpperCase() == 'Read'.toUpperCase()) {
                IsRead = true;
            }
        }
    });
}
