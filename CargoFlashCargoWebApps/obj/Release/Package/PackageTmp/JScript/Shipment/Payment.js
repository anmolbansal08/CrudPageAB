var Recid = 0;
var userSNo = 0;
var cashierIDTo = 0;
var BalanceAmount = 0;
var cashierID = 0;
var isactive = 1;
var count = 0;
$(document).ready(function () {

    $('#FirstGrid').prepend("</br><a href='Default.cshtml?Module=Tariff&Apps=ESSCharges&FormAction=NEW' data-role='button' ><b>Apply ESS</b></a>");
    //&emsp;<input type='button' id='Create' value='Create Handover' class='btn btn-success' onclick='popup(" + '"Create",""' + ")'>&emsp;<input type='button' class='btn btn-success' id='CashDeposit' value='Cash Deposit' onclick='getCashHtml()'>");
    $(".form2buttonrow").hide();
    cfi.ValidateForm();


    //$('#PaymentAmmount').keypress(function (e) {
    //    var iKeyCode = (e.which) ? e.which : e.keyCode
    //    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
    //        return false;
    //});

    cfi.AutoComplete("PaymentMode", "PaymentMode", "PaymentMode", "SNo", "PaymentMode", ["PaymentMode"], modechange, "contains");
    cfi.AutoComplete("CreditNote", "TransactionNo,BalanceAmount", "vw_CreditDebitNote", "SNo", "Text_BalanceAmount", ["Text_BalanceAmount"], getcredit, "contains", ",", null, null, null, null);
    cfi.BindMultiValue("CreditNote", $("#Text_CreditNote").val(), $("#CreditNote").val());

    //Changed the Missing Currency TO IDR By Rahul Singh (05-04-2017)
    //alert(userContext.CurrencyCode)  NetPayableAmount
    $("span[id=TotalReceivable]").append(" " + userContext.CurrencyCode)
    $("span[id=BalanceReceivable]").append(" " + userContext.CurrencyCode)
    $("span[id=CreditNoteAmount]").after(" " + userContext.CurrencyCode);
    $("#ChequeAmmount").after(" " + userContext.CurrencyCode);
    $("#PaymentReceived").after(" " + userContext.CurrencyCode);
    $("span[id=NetPayableAmount]").after(" " + userContext.CurrencyCode);



    $("#PaymentDate").parent().hide();
    $("#PaymentDate").parent().before($("#PaymentDate").val());

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
            NetPaybleAmount($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text(), $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
        });
        $('#ChequeAmmount').blur(function () {
            NetPaybleAmount($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text(), $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
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
                $("#Text_PaymentMode").data("kendoAutoComplete").enable(true);
                $("#PaymentMode").val(1);
                $("#Text_PaymentMode").val('CASH');
                $('#PaymentAmmount').removeAttr('disabled');
                $('#_tempPaymentAmmount').removeAttr('disabled');
                $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#ChequeAmmount').val('');
                $('#_tempChequeAmmount').val('');
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

        if ($("#PaymentMode").val() != 1 || $('#PaymentAmmount').val() == 0) {
            $('#_tempPaymentAmmount').val('');
            $('#PaymentAmmount').val('');
        }
        if ($('#PaymentMode').val() == 1) {
            $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
        }
        if ($('#PaymentMode').val() == 2) {
            $('#ChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            $('#_tempChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
        }
        $('input[name=operation]').click(function () {
            NetPaybleAmount($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text(), $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
        });

        $("#PaymentAmmount").after(" " + userContext.CurrencyCode);
    }

    //var Button = "<input type=button id=print name=Print value=Print/>";
    //$(".formbuttonrow").append(Button);



    // $("#PaymentDate").data("kendoDatePicker").value(getDateNextYear());

    //$(document).keydown(function (event) {
    //    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
    //        event.preventDefault();
    //    }
    //});

    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    //$(document).on('drop', function () {
    //    return false;
    //});
    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        var Button = "&nbsp;&nbsp;<input type=button id=print name=Print value=Print onclick=PrintServicePDF(); />";
        // $(".formbuttonrow").append(Button);
        $(".formbuttonrow").html(Button);
        Recid = getQueryStringValue('RecID');
        userSNo = getQueryStringValue('UserID')
        PrintService();

    }
    //cashierID = userContext.UserSNo;
    //IdentifyHandover(cashierID);
    //if (count == 0) {
    //    CheckHandover(cashierID);
    //    count = count + 1;
    //}
    window.onbeforeunload = function () {
        $("input[type=button], input[type=submit]").attr("disabled", "disabled");
    };

    $("#PaymentReceived").blur(function () {
        if ($("#PaymentReceived").val() != "" && $("#PaymentAmmount").val() != "")
            PaymentReceived($("#PaymentReceived").val(), $("#PaymentAmmount").val());
    });
});

function PrintSlip(InvoiceSNo, InvoiceType) {
    //window.open("HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL + "&FooterHTML=" + userContext.SysSetting.FooterHTML);

    window.open("HtmlFiles/Shipment/Payment/DeliveryBillPrint.html?InvoiceSNo=" + InvoiceSNo + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
}






function Print(DOSNo) {
    var Type = "DO";
    if (Type == "DO")
        window.open("HtmlFiles/DeliveryOrder/DeliveryOrder.html?DOSNo=" + (DOSNo == "" ? 0 : DOSNo) + "&Type=" + Type);
}


function PrintServicePDF() {
    $("#tbl").hide();
    //Windows.print();
    window.PrintServicePDF();
}

function ReadAllData() {
    //$.ajax({
    //    url: 'HtmlFiles/Shipment/Payment/ChargeNotePrint.html',
    //    success: function (result) {
    //        $("#ApplicationTabs").html(result);
    //    }
    //});
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
                 + "<th colspan='3' rowspan='2' style='display:none;'><center><img alt='LOGO' src='Logo/LOGO_Cgarge.png' style='width: 139px; height: 56px' /></center>"
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
                    + "<font size='2'>Sharjah Aviation Services PO Box 70888,Sharjah, United Arab Emirates, Tel: +971 6 5141206, Fax +971 6 5580565<br />"
                    + "Cheques to be made in favour of : SHARJAH AVIATION COMPANY L.L.C</font></center></td></tr>"
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
                        //var Button = "<input type=button id=print name=Print/>";
                        //$(".formbuttonrow").append(Button);

                    }



                });
                if (isactive == 0) {
                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "EDIT" || $(this).text().toUpperCase() == "PAYMENT") {
                            $(this).closest("a").css("display", "none");
                        }
                    });

                } else {

                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "EDIT") {
                            $(this).closest("a").css("display", "block");

                        }
                    });
                }

                //  }
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
                        //$(this).text('Payment');
                        //$(this).closest("a").css("display", "block");
                    }
                    if ($(this).text().toUpperCase() == "READ" || $(this).text().toUpperCase() == "RECEIPT") {
                        //$(this).text('RECEIPT');
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
                //$(this).closest("a").css("display", "none");

                //$(this).text('Print');
                $(this).closest("a").css("display", "none");
            }
            //if ($(this).text().toUpperCase() == "READ" || $(this).text().toUpperCase() == "RECEIPT") {
            //    $(this).text('Receipt');
            //    $(this).closest("a").css("display", "block");
            //}

        });
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if ((recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
                $(".tool-items").find(".actionSpan").each(function () {
                    $(this).closest("a").css("display", "none");
                    if ($(this).text().toUpperCase() == "PAYMENT" || $(this).text().toUpperCase() == "EDIT") {
                        //$(this).closest("a").css("display", "none");

                        //$(this).text('Print');
                        $(this).closest("a").css("display", "none");
                    }
                    //if ($(this).text().toUpperCase() == "READ" || $(this).text().toUpperCase() == "RECEIPT") {
                    //    $(this).text('Receipt');
                    //    $(this).closest("a").css("display", "block");
                    //}

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
    if (textId == "Text_CreditNote") {

        if ($("span#CreditNoteAmount").text() == BalanceAmount) {
            cfi.setFilter(filterEmbargo, "SNo", "eq", 0);
        }
        else {
            cfi.setFilter(filterEmbargo, "SNo", "notin", $("#CreditNote").val());
            if ($("#AccountSNo").val() > 0)
                cfi.setFilter(filterEmbargo, "AccountSNo", "eq", $("#AccountSNo").val());
            if ($("#AirlineSNo").val() > 0)
                cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#AirlineSNo").val());
        }
        //cfi.setFilter
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }

    //if (textId == "Text_CashierID")
    //{
    //    var cashierID = userContext.UserSNo;

    //}

    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#CreditNote").val()), cfi.autoCompleteFilter(textId);
}

//function popup(type, cashierIDTo) {
//    handoverhtml(type, cashierIDTo);
//    $("CashierID").val('');
//    $("#spnCashierName").text('');
//    $("#spnMobileNo").text('');
//    $("#spnEmail").text('');
//    $("#spnBalance").text('');
//    $("#ReceiveCash").val('');
//    $("#Text_CashierTo").val('');
//  //  $("CashierID1").val();
//  //  $("#spnCashierName1").text('');
//  //  $("#spnMobileNo1").text('');
//  //  $("#spnEmail1").text('');
//   // $("#ReceiveCash1").val('');
//    $("#Remark").val('');
//    $("Text_CashierID").val('');
//}


//function handoverhtml(type, cashierIDTo) {
//    if (type == "Create") {
//        if ($("#divWindow").length === 0)
//            $("#Create").html('<div id="divWindow"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel" colspan=4></td></tr><tr><td class="formlabel"><font color="red">*</font>CashierID</td><td class="formInputcolumn"><input type="hidden" id="CashierID" name="CashierID"><input type="text" name="Text_CashierID" id="Text_CashierID" data-role="autocomplete" controltype="autocomplete" data-valid="required" data-valid-msg="CashierID can not be blank"></td><td class="formlabel"><b>Cashier Name</b></td><td class="formInputcolumn"><span id="spnCashierName"></span></td></tr><tr><td class="formlabel"><b>Mobile Number</b></td><td class="formInputcolumn"><span id="spnMobileNo"></span></td><td class="formlabel"><b>E-Mail</b></td><td class="formInputcolumn"><span id="spnEmail"></span></td></tr><tr><td class="formlabel"><b>Balance Carried Forward</b></td><td class="formInputcolumn"><span id="spnBalance"></span></td><td class="formlabel"></td><td class="formInputcolumn"></td></tr><tr><td class="formlabel" colspan=4><center><input type="button" value="Save" id="SaveHandOver" onclick="SaveHandover()"></center></td></tr></table></div>');
//        cfi.PopUp("divWindow", "Create Handover", 900, null, null, null);
//        $("#divWindow").closest(".k-window").css({
//            position: 'fixed',
//            top: '5%'
//        });
//        $("Text_CashierID").val('');
//        $("CashierID").val('');
//    }
//    else if(type == "Receive"){
//        if ($("#divWindow1").length === 0)
//            $("#Create").html('<div id="divWindow1"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel" colspan=4></td></tr><tr><td class="formlabel"><font color="red">*</font><b>Cashier ID</b></td><td class="formInputcolumn"><input type="Text" id="CashierID1" onblur="getToCashierDetail()" data-valid="required" data-valid-msg="CashierID can not be blank"></td><td class="formlabel"><b>Cashier Name</b></td><td class="formInputcolumn"><span id="spnCashierName1"></span></td></tr><tr><td class="formlabel"><b>Mobile Number</b></td><td class="formInputcolumn"><span id="spnMobileNo1"></span></td><td class="formlabel"><b>E-Mail</b></td><td class="formInputcolumn"><span id="spnEmail1"></span></td></tr><tr><td class="formlabel"><b>Received Cash Amount</b></td><td class="formInputcolumn"><span id="spnReceiveCash1"></span></td><td class="formlabel"><b>Type</b></td><td class="formInputcolumn"><input type="radio" id="Accept" name="Type" value="Accept" onclick="getradioval()">Accept &emsp;<input type="radio" id="Reject" name="Type" value="Reject" onclick="getradioval()">Reject</td></tr><tr><td class="formlabel" colspan=3 align="right" class="formlabel"><font color="red">*</font><b>Remark</b></td><td class="formInputcolumn"><input type="Text" cols="40" rows="3" style="width:200px; height:50px;" id="Remark" data-valid="required" data-valid-msg="Remark can not be blank"></td></tr><tr><td class="formlabel" colspan=4><center><input type="button" value="Save" id="getHandOver" onclick="ReceiveHandover()"></center></td></tr></table></div>');
//        cfi.PopUp("divWindow1", "Receive Handover", 900, null, null, null);
//        $("#divWindow1").closest(".k-window").css({
//            position: 'fixed',
//            top: '5%'
//        });
//        $("#CashierID1").val(cashierIDTo);
//        getToCashierDetail();

//    }
//    cfi.AutoComplete("CashierID", "Name", "vcashier", "SNo", "Name", ["Name"], getCashierDetail, "contains");
//}

//function getCashierDetail()
//{
//    var cashierID = $("#CashierID").val();

//        $.ajax({
//            url: "./Services/Shipment/PaymentService.svc/GetCashierDetail", async: false, type: "POST", dataType: "json", cache: false,
//            data: JSON.stringify({ cashierID: cashierID }),
//            contentType: "application/json; charset=utf-8",       
//            success: function (result) {
//                var dataTableobj = JSON.parse(result);
//                var data = dataTableobj.Table0;
//                if (data.length > 0) {
//                    $("#spnCashierName").text(data[0].Name);
//                    if (data[0].MobileNo == '')
//                        $("#spnMobileNo").text('NA');
//                    else
//                        $("#spnMobileNo").text(data[0].MobileNo);
//                    $("#spnEmail").text(data[0].Email);
//                    $("#spnBalance").text(data[0].BalanceCarriedForward);

//                }
//                else {
//                    ShowMessage('warning', '', "Enter valid Cashier ID");
//                }
//            },
//                error: function (err) {
//                    ShowMessage('info', '', "Some Error!!");
//                }
//        });   
//}

//function getToCashierDetail() {
//    var fromcashierID = $("#CashierID1").val();
//    var cashierID = userContext.UserSNo;
//    $.ajax({
//        url: "./Services/Shipment/PaymentService.svc/GetToCashierDetail", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ cashierID: cashierID, fromcashierID: fromcashierID }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var dataTableobj = JSON.parse(result);
//            var data = dataTableobj.Table0;
//            if (data.length > 0) {
//                $("#spnCashierName1").text(data[0].Name);                
//                if (data[0].MobileNo == '')
//                    $("#spnMobileNo1").text('NA');
//                else
//                    $("#spnMobileNo1").text(data[0].MobileNo);
//                $("#spnEmail1").text(data[0].Email);
//                $("#spnReceiveCash1").text(data[0].ReceivedCash);
//            }
//            else {
//                ShowMessage('warning', '', "Enter valid Cashier ID");
//            }
//        },
//        error: function (err) {
//            ShowMessage('info', '', "Some Error!!");
//        }
//    });

//}

//function getradioval()
//{
//    if (($('input:radio[name=Type]')[0].checked) == true) {
//        $("#Remark").removeAttr("data-valid");
//        $("#Remark").closest('tr').find('font').hide()
//        $("#Remark").removeAttr("class");
//    }
//    else {
//        $("#Remark").attr("data-valid", "required");
//        $("#Remark").closest('tr').find('font').show();
//        $("#Remark").attr("class", "valid_invalid");
//    }
//}

//function SaveHandover() {
//    cfi.ValidateSubmitSection("divWindow");
//    if (!cfi.IsValidSection($("#divWindow"))) {
//        return false;
//    }
//    var cashierID = userContext.UserSNo;
//    var receiveCash = $("#spnBalance").text();
//    var cashierIDTo = $("#CashierID").val();
//    $.ajax({
//        url: "./Services/Shipment/PaymentService.svc/SaveHandover", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ cashierID: cashierID, receiveCash: receiveCash, cashierIDTo: cashierIDTo }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var resultData = result.split(",")
//            if (resultData[0] == 0) {
//                type = "Receive";
//                cashierIDTo = resultData[1];
//                ShowMessage('success', '', "Ready for Handover");                
//                $("#divWindow").data("kendoWindow").close();
//               // popup(type, cashierIDTo);
//            }
//            else
//                ShowMessage('info', '', "Check your entries.");
//        },
//        error: function (err) {
//           ShowMessage('info', '', "Generated Error!!");
//        }
//    });

//}

//function ReceiveHandover()
//{
//    cfi.ValidateSubmitSection("divWindow1");
//    if (!cfi.IsValidSection($("#divWindow1"))) {
//        return false;
//    }
//    var FromcashierID = $("#CashierID1").val();
//    var IsActive = $('input:radio[name=Type]')[0].checked ? "1" : "0";
//    var remarks = $("#Remark").val();
//    var cashierID = userContext.UserSNo
//    $.ajax({
//        url: "./Services/Shipment/PaymentService.svc/ReceiveHandover", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ cashierID: cashierID, IsActive: IsActive, remarks: remarks, FromcashierID: FromcashierID }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var resultData = result.split(",")
//            if (resultData[0] == 0 && resultData[1]==1) {
//                ShowMessage('success', '', "Handover done successfully");
//                $("#divWindow1").data("kendoWindow").close();
//                $("#Create").show();
//                $("#CashDeposit").show();
//                isactive = resultData[1];
//                ChangeActionName()
//            }
//            else if (resultData[0] == 0 && resultData[1] == 0) {
//                $("#Create").hide();
//                $("#CashDeposit").hide();
//                ShowMessage('success', '', "Handover not done");
//                $("#divWindow1").data("kendoWindow").close();
//                isactive = resultData[1];

//                ChangeActionName()

//                //window.setTimeout(function () {
//                //    window.location.href = 'Default.cshtml?Module=Shipment';
//                //}, 500);
//            }
//            else
//                ShowMessage('info', '', "Some Error!!");
//        },
//        error: function (err) {
//            ShowMessage('info', '', "Generated Error!!");
//        }
//    });
//}

//function IdentifyHandover(cashierID)
//{
//    $.ajax({
//        url: "./Services/Shipment/PaymentService.svc/IdentifyHandover", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ cashierID: cashierID }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var resultData = result.split(",")
//            if (resultData[0] == 0 && resultData[1] != 0) {
//                type = "Receive";
//                FromcashierID = resultData[1];
//                popup(type, FromcashierID)
//            }            
//            else
//                return;
//        },
//        error: function (err) {
//            ShowMessage('info', '', "Generated Error!!");
//        }
//    });
//}

//function checkdecimal(obj)
//{
//    var id = $(obj).attr('id');
//    var data=$("#" + id).val();
//    var data = data.replace(/[^0-9.]/g, "");    
//    $("#" + id).val(data);    
//}

//function getval(obj)
//{
//    var id = $(obj).attr('id');
//    var data = $("#" + id).val();
//    data = parseFloat(data).toFixed(2)
//    $("#" + id).val(data);
//}

//function CheckHandover(cashierID)
//{
//    $.ajax({
//        url: "./Services/Shipment/PaymentService.svc/CheckHandover", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ cashierID: cashierID }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var resultData = result.split(",")
//            if (resultData[0] == 0 && resultData[1] != 0 && resultData[2] == 0) {
//                ShowMessage('success', '', "Accept handover for full access or contect Admin");
//                FromcashierID = resultData[1];
//                $("#Create").hide();
//                $("#CashDeposit").hide();
//                isactive = resultData[2];
//                ChangeActionName()

//            }
//            else if (resultData[0] == 0 && resultData[1] != 0 && resultData[2] == 1 || resultData[2] == "") {
//                FromcashierID = resultData[1];
//                isactive = resultData[2];
//                ChangeActionName()
//            }
//            else {

//                FromcashierID = resultData[1];
//                isactive = resultData[2];
//                ChangeActionName()
//                if (isactive == 0) {
//                    ShowMessage('success', '', "Contact admin to assign handover");
//                    $("#Create").hide();
//                    $("#CashDeposit").hide();
//                }
//                else {
//                    $("#Create").show();
//                    $("#CashDeposit").show();
//                }
//            }
//        },
//        error: function (err) {
//            ShowMessage('info', '', "Generated Error!!");
//        }
//    });
//}

//function getCashHtml() {
//    if ($("#divWindow3").length === 0) {
//        $("#CashDeposit").html('');
//        $("#CashDeposit").html('<div id="divWindow3"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel" colspan=4></td></tr><tr><td class="formlabel"><font color="red">*</font><b>Cashier ID</b></td><td class="formInputcolumn"><input type="Text" id="CashierID2" onblur="getCashierDetail()" data-valid="required" data-valid-msg="CashierID can not be blank"></td><td class="formlabel"><b>Cashier Name</b></td><td class="formInputcolumn"><span id="spnCashierName2"></span></td></tr><tr><td class="formlabel"><b>Mobile Number</b></td><td class="formInputcolumn"><span id="spnMobileNo2"></span></td><td class="formlabel"><b>E-Mail</b></td><td class="formInputcolumn"><span id="spnEmail2"></span></td></tr><tr><td class="formlabel"><font color="red">*</font><b>Total Amount Deposited</b></td><td class="formInputcolumn"><input type="Text" id="CashDeposited" data-valid="required" data-valid-msg="Total Amount can not be blank"></td><td class="formlabel"><font color="red">*</font><b>Deposited To</b></td><td class="formInputcolumn"><input type="Text" id="DepositedTo" data-valid="required" data-valid-msg="Deposited To can not be blank"></td><tr><td class="formlabel"><font color="red">*</font><b>Deposited To Name</b></td><td class="formInputcolumn"><input type="Text" id="DepositedToName" data-valid="required" data-valid-msg="DepositedTo Name can not be blank"></td><td class="formlabel"><font color="red">*</font><b>Bank Account No.</b></td><td class="formInputcolumn"><input type="Text" id="AccountNo" data-valid="required" data-valid-msg="Account No. can not be blank"></td></tr><tr><td class="formlabel" colspan=4><center><input type="button" value="Save" id="SaveCash" onclick="DepositeCash()"></center></td></tr></table></div>');
//    }
//    cfi.PopUp("divWindow3", "Create Handover", 900, null, null, null);
//    $("#divWindow3").closest(".k-window").css({
//        position: 'fixed',
//        top: '5%'
//    });
//    cashierID = userContext.UserSNo;
//    $("#CashierID2").val(cashierID);
//    getCashiersDetail();
//}

//function getCashiersDetail() {
//    var cashierID = $("#CashierID2").val();

//    $.ajax({
//        url: "./Services/Shipment/PaymentService.svc/GetCashierDetail", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ cashierID: cashierID }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var dataTableobj = JSON.parse(result);
//            var data = dataTableobj.Table0;
//            if (data.length > 0) {
//                $("#spnCashierName2").text(data[0].Name);
//                if (data[0].MobileNo == '')
//                    $("#spnMobileNo2").text('NA');
//                else
//                    $("#spnMobileNo2").text(data[0].MobileNo);
//                $("#spnEmail2").text(data[0].Email);

//            }
//            else {
//                ShowMessage('warning', '', "Enter valid Cashier ID");
//            }
//        },
//        error: function (err) {
//            ShowMessage('info', '', "Some Error!!");
//        }
//    });
//}

//function DepositeCash()
//{
//    cfi.ValidateSubmitSection("divWindow3");
//    if (!cfi.IsValidSection($("#divWindow3"))) {
//        return false;
//    }
//    var CashierID = $("#CashierID").val();
//    var CashDeposited = $("#CashDeposited").val();
//    var DepositedTo = $("#DepositedTo").val();
//    var Name = $("#DepositedToName").val();
//    var AccountNo = $("#AccountNo").val();
//    $.ajax({
//        url: "./Services/Shipment/PaymentService.svc/DepositeCash", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ cashierID: cashierID, CashDeposited: CashDeposited, DepositedTo: DepositedTo, Name: Name, AccountNo: AccountNo }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {           
//            if (result == 0) {
//                ShowMessage('success', '', "Amount deposited successfully");
//                $("#divWindow3").data("kendoWindow").close();                
//            }
//            else
//                ShowMessage('info', '', "Check your amount");
//        },
//        error: function (err) {
//            ShowMessage('info', '', "Generated Error!!");
//        }
//    });
//}

//added by pankaj khanna
function modechange() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($('#AccountSNo').val() == 0) {
            $('#AccountName').closest('tr').find('td[title="Account Name"]').text('Airline Name');
            $('#AccountName').closest('tr').find('td[title="Account Name"]').attr('title', 'Airline Name');
            //$('span#AccountName').text('Airline Name');
        }
        if ($('#PaymentMode').val() == 2) {
            $('#ChequeNo').removeAttr('disabled');
            $('#ChequeAmmount').removeAttr('disabled');
            //$('#_tempChequeAmmount').removeAttr('disabled');
            $('#ChequeAccountName').removeAttr('disabled');
            $('#ChequeDate').data("kendoDatePicker").enable(true);
            $('#BankName').removeAttr('disabled');
            $('#BranchName').removeAttr('disabled');

            $("#spnChequeNo").closest('td').find('font').text('*');
            $("#spnChequeAmmount").closest('td').find('font').text('*');
            $("#spnChequeAccountName").closest('td').find('font').text('*');
            $("#spnChequeDate").closest('td').find('font').text('*');
            $("#spnBankName").closest('td').find('font').text('*');
            $("#spnBranchName").closest('td').find('font').text('*');

            $('#ChequeNo').css('border-color', '');
            //$('#ChequeAmmount').css('border-color', '');
            $('#_tempChequeAmmount').css('border-color', '');
            $('#ChequeAccountName').css('border-color', '');
            $('#ChequeDate').closest('span').css('border-color', '');
            $('#BankName').css('border-color', '');
            $('#BranchName').css('border-color', '');

            $('#ChequeNo').attr('data-valid', 'required');
            $('#ChequeAmmount').attr('data-valid', 'required');
            //$('#_tempChequeAmmount').attr('data-valid', 'required');
            $('#ChequeAccountName').attr('data-valid', 'required');
            $('#ChequeDate').attr('data-valid', 'required');
            $('#BankName').attr('data-valid', 'required');
            $('#BranchName').attr('data-valid', 'required');

            //$('#ChequeDate').val('');


            $('#PaymentAmmount').attr('disabled', true);
            $('#spnPaymentAmmount').closest('td').find('font').text('');
            $('#_tempPaymentAmmount').css('border-color', '#94c0d2');
            $('#PaymentAmmount').removeAttr('data-valid');
            $('#_tempPaymentAmmount').val('');
            $('#PaymentAmmount').val('');
            if ($('#PaymentMode').val() == 2) {
                $('#ChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#_tempChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            }
            NetPaybleAmount($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text(), $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
        }
        else {

            if ($('#PaymentMode').val() == 1 || $('#CreditNote').val() == "") {
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
            if ($('#PaymentMode').val() == "undefined" || $('#PaymentMode').val() == 0) {
                $('#_tempPaymentAmmount').val('');
                $('#PaymentAmmount').val('');
                $('#PaymentAmmount').attr('disabled', true);
            }
            $('#ChequeNo').attr('disabled', true);
            $('#ChequeAmmount').attr('disabled', true);
            //$('#_tempChequeAmmount').attr('disabled', true);
            $('#ChequeAccountName').attr('disabled', true);
            $('#ChequeDate').data("kendoDatePicker").enable(false);
            $('#BankName').attr('disabled', true);
            $('#BranchName').attr('disabled', true);

            $('#ChequeNo').css('border-color', '#94c0d2');
            //$('#ChequeAmmount').css('border-color', '#94c0d2');
            $('#_tempChequeAmmount').css('border-color', '#94c0d2');
            $('#ChequeAccountName').css('border-color', '#94c0d2');
            $('#ChequeDate').closest('span').css('border-color', '#94c0d2');
            $('#BankName').css('border-color', '#94c0d2');
            $('#BranchName').css('border-color', '#94c0d2');

            $("#spnChequeNo").closest('td').find('font').text('');
            $("#spnChequeAmmount").closest('td').find('font').text('');
            $("#spnChequeAccountName").closest('td').find('font').text('');
            $("#spnChequeDate").closest('td').find('font').text('');
            $("#spnBankName").closest('td').find('font').text('');
            $("#spnBranchName").closest('td').find('font').text('');

            $('#ChequeNo').removeAttr('data-valid');
            $('#ChequeAmmount').removeAttr('data-valid');
            //$('#_tempChequeAmmount').removeAttr('data-valid');
            $('#ChequeAccountName').removeAttr('data-valid');
            $('#ChequeDate').removeAttr('data-valid');
            $('#BankName').removeAttr('data-valid');
            $('#BranchName').removeAttr('data-valid');

            $('#ChequeNo').val('');
            $('#ChequeAccountName').val('');
            $('#BankName').val('');
            $('#BranchName').val('');
            $('#ChequeDate').data("kendoDatePicker").value('');
            $('#_tempChequeAmmount').val('');
            $('#ChequeAmmount').val('');

            if ($('#PaymentMode').val() == 1) {
                $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
                $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            }
            NetPaybleAmount($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text(), $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
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
        $("#_tempChequeAmmount").val('');
        $("#ChequeAmmount").val('');
        $("#ChequeAccountName").val('');
        $("#ChequeDate").val('');
        $("#BranchName").val('');
        $("#BankName").val('');
        $("#Text_PaymentMode").data("kendoAutoComplete").enable(false);
        $('#PaymentAmmount').attr('disabled', true);
        $('#_tempPaymentAmmount').attr('disabled', true);
        modechange();
        NetPaybleAmount(BalanceAmount, 0, 0)
    }
    else {
        $("span#CreditNoteAmount").text(CreditNoteAmount.toFixed(2));
        $("#Text_PaymentMode").data("kendoAutoComplete").enable(true);
        $('#_tempPaymentAmmount').removeAttr('disabled');
        $('#PaymentAmmount').removeAttr('disabled');
        if ($('#PaymentMode').val() == "undefined" || $('#PaymentMode').val() == 0) {
            $('#_tempPaymentAmmount').val('');
            $('#PaymentAmmount').val('');
            $('#PaymentAmmount').attr('disabled', true);
        }

        if ($('#PaymentMode').val() == 1) {
            $('#PaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            $('#_tempPaymentAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
        }
        if ($('#PaymentMode').val() == 2) {
            $('#ChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
            $('#_tempChequeAmmount').val(BalanceAmount - ($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text()));
        }
        modechange();
        NetPaybleAmount(CreditNoteAmount, $('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val(), $('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val())
    }
}
function NetPaybleAmount(CreditNoteAmount, CashAmount, ChequeAmmount) {
    var total = parseFloat(CreditNoteAmount) + parseFloat(CashAmount) + parseFloat(ChequeAmmount);
    $("#NetPayableAmount").val(total.toFixed(2));
    $("span#NetPayableAmount").text(total.toFixed(2));
    var cash = parseFloat($('#PaymentAmmount').val() == "" ? 0 : $('#PaymentAmmount').val());
    var chq = parseFloat($('#ChequeAmmount').val() == "" ? 0 : $('#ChequeAmmount').val());
    var transtotal = cash + chq;
    if (total > BalanceAmount && BalanceAmount > 0) {

        if (total > BalanceAmount && BalanceAmount > 0) {
            return true;
        }
        else {
            ShowMessage('warning', 'Need your Kind Attention!', "Total Amount  of " + total.toFixed(2) + " should be less than or equal to " + BalanceAmount.toFixed(2));
            $('#_tempChequeAmmount').val('');
            $('#ChequeAmmount').val('');
            $('#_tempPaymentAmmount').val('');
            $('#PaymentAmmount').val('');
            NetPaybleAmount($('span#CreditNoteAmount').text() == "" ? 0 : $('span#CreditNoteAmount').text(), 0, 0)
            return false;
        }
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


