var PageType;
$(document).ready(function () {



    PageType = getQueryStringValue("FormAction").toUpperCase();

    $("#ReturntoShipperContainer").load("HtmlFiles/Shipment/ReturntoShipperSearch.html", onLoad);


});
$(document).on('keypress keyup blur', '#Text_VolWt', function (event) {
    if (/^(\d+(\.\d{0,3})?)?$/.test($(this).val())) {
        // Input is OK. Remember this value
        $(this).data('prevValue', $(this).val());
    } else {
        // Input is not OK. Restore previous value
        $(this).val($(this).data('prevValue') || '');
    }
});
$(document).on('keypress keyup blur', '#Text_GrWt', function (event) {
    if (/^(\d+(\.\d{0,3})?)?$/.test($(this).val())) {
        // Input is OK. Remember this value
        $(this).data('prevValue', $(this).val());
    } else {
        // Input is not OK. Restore previous value
        $(this).val($(this).data('prevValue') || '');
    }
});

//function CalculateTotalFBLAmount() {
//    //var totalFBLAmount = 0;
//    //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
//    //    $(this).find("input[id^='TotalAmount']").each(function () {
//    //        if (!isNaN(parseFloat($(this).val())))
//    //            totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
//    //    });
//    //});
//    //totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
//    //$("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
//    //$("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());

//    var totalFBLAmount = 0;
//    var TotalCreditAmount = 0;
//    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function (i, row) {
//        if ($(row).find("[id^='chkWaveoff']").prop("checked") == false || $(row).find("[id^='chkWaveoff']").prop("checked") == undefined) {
//            $(row).find("input[id^='TotalAmount']").each(function () {
//                if (!isNaN(parseFloat($(this).val()))) {
//                    if ($(row).find("input[id^='chkCash']").prop('checked') == true) {

//                        totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
//                    }
//                    else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
//                        if ($(row).find("input[id^='Text_BillTo']").data("kendoAutoComplete").key() != "1") {
//                            TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
//                        }

//                    }
//                    else { }

//                }

//            });
//        }
//    });


//    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(0);
//    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(2);
//    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
//    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
//    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
//    $("#divareaTrans_shipment_shipmenthandlingchargeinfo").next("table").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

//    $("#CashAmount").val(totalFBLAmount);
//    $("#_tempCashAmount").val(totalFBLAmount);
//    if (parseFloat($("#CashAmount").val()) <= 0) {
//        $("#CashAmount").removeAttr('data-valid');
//    }
//    var number = Math.round(totalFBLAmount);
//    if (Math.round(number % 10) != 0 && Math.round(number % 10) != 5) {
//        number = number - Math.round(number % 10) + (Math.round(number % 10) < 5 ? 5 : 10);
//    }
//    $("#CashAmount").closest("tr").find("td:last").text(number);
//}
//function ReBindHandlingChargeAutoComplete(elem, mainElem) {
//    $(elem).closest("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
//        var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
//        //$(this).find("input[id^='ChargeName']").each(function () {
//        //    AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
//        //});
//        if ($(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').attr('style') != "display: none;") {
//            $(this).find("input[id^='BillTo']").each(function () {
//                cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
//            });
//        }

//        //$(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');
//        $(elem).find("span[id^='_PrimaryBasis']").removeAttr('style');
//        $(elem).find("span[id^='_SecondaryBasis']").removeAttr('style');
//        if ($(elem).find("input[id^='PrimaryBasis']").val() == "" && $(elem).find("input[id^='_tempPrimaryBasis']").val() != "") {
//            $(elem).find("input[id^='PrimaryBasis']").val($(elem).find("input[id^='_tempPrimaryBasis']").val());
//            $(elem).find("input[id^='_tempPrimaryBasis']").val($(elem).find("input[id^='_tempPrimaryBasis']").val());
//        } else if ($(elem).find("input[id^='PrimaryBasis']").val() != "" && $(elem).find("input[id^='_tempPrimaryBasis']").val() == "") {
//            $(elem).find("input[id^='_tempPrimaryBasis']").val($(elem).find("input[id^='PrimaryBasis']").val());
//            $(elem).find("input[id^='PrimaryBasis']").val($(elem).find("input[id^='PrimaryBasis']").val());
//        }
//        if ($(elem).find("input[id^='SecondaryBasis']").val() == "" && $(elem).find("input[id^='_tempSecondaryBasis']").val() != "") {
//            $(elem).find("input[id^='SecondaryBasis']").val($(elem).find("input[id^='_tempSecondaryBasis']").val());
//            $(elem).find("input[id^='_tempSecondaryBasis']").val($(elem).find("input[id^='_tempSecondaryBasis']").val());
//        } else if ($(elem).find("input[id^='SecondaryBasis']").val() != "" && $(elem).find("input[id^='_tempSecondaryBasis']").val() == "") {
//            $(elem).find("input[id^='_tempSecondaryBasis']").val($(elem).find("input[id^='SecondaryBasis']").val());
//            $(elem).find("input[id^='SecondaryBasis']").val($(elem).find("input[id^='SecondaryBasis']").val());
//        }
//        $(elem).find("input[id^='_tempPrimaryBasis']").css("text-align", "right");
//        $(elem).find("input[id^='_tempSecondaryBasis']").css("text-align", "right");

//        //if ($(elem).find("input[id^='_tempSecondaryBasis']").css('display') == "none") {
//        //    $(elem).find("input[id^='_tempSecondaryBasis']").css("display", "none");
//        //    $(elem).find("span[id^='SecondaryBasis']").css("display", "none");
//        //}

//        var paymentList = paymentData.Table0;
//        if ($(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
//            var NonMendatory = getNonObjects(paymentData.Table0, 'TariffSNo', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key());
//            if (NonMendatory[0].SecondaryBasis == "") {
//                $(elem).find("input[id^='_tempSecondaryBasis']").css("display", "none");
//                $(elem).find("span[id^='_SecondaryBasis']").css("display", "none");
//            } else {
//                $(elem).find("input[id^='_tempSecondaryBasis']").css("display", "inline-block");
//                $(elem).find("span[id^='_SecondaryBasis']").css("display", "inline-block");
//            }
//        }

//        $(this).find("input[id^='Text_BillTo']").closest('span').css('width', '70px');
//        $(this).find("input[id^='Text_ChargeName']").closest('span').css('width', '');
//        $(this).find("input[id^='Amount']").each(function () {
//            $(this).unbind("blur").bind("blur", function () {
//                CalculateFBLAmount(this);
//            });
//        });
//        $(elem).find("input[id^='_tempPrimaryBasis']").attr("class", $(elem).find("input[id^='_tempPrimaryBasis']").attr("class").replace("k-state-disabled", ""));
//        $(elem).find("input[id^='_tempSecondaryBasis']").attr("class", $(elem).find("input[id^='_tempSecondaryBasis']").attr("class").replace("k-state-disabled", ""));
//        $(elem).find("input[id^='_tempAmount']").attr("class", $(elem).find("input[id^='_tempAmount']").attr("class").replace("k-state-disabled", ""));
//        $(elem).find("input[id^='_tempTax']").attr("class", $(elem).find("input[id^='_tempTax']").attr("class").replace("k-state-disabled", ""));
//    });
//    if ($(elem).find("td[id^='tdSNoCol']").html() == MendatoryPaymentCharges.length) {
//        $(elem).find("td[id^=transAction]").find("i[title=Delete]").remove();

//    }

//   // CalculateTotalFBLAmount();
//}

//function BindHandlingChargeAutoComplete(elem, mainElem) {
//    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
//    $(elem).find("input[id^='ChargeName']").each(function () {
//        //AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "WMSFBLHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");       
//        //AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], ResetFBLCharge, null, null, null, null, "getHandlingChargesIE", "", parseInt($("#AWBSNo").val()), 0, origin, 2, "", "2", "999999999", "No");
//    });
//    //$(elem).find("input[id^='BillTo']").each(function () {
//    //    cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
//    //    $("#Text_" + $(this).attr("name")).data("kendoAutoComplete").setDefaultValue(BillTo[0]["Key"], BillTo[0]["Text"]);
//    //});
//    //$(elem).find("input[id^='BillTo']").closest('td').find('span').css("display", "block");
//    $(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');
//    $(elem).find("td:eq(3)").css('width', '100px');
//    $(elem).find("td:eq(4)").css('width', '100px');
//    $(elem).find('td:eq(10)').css("display", "none");
//    $(elem).find('td:eq(11)').css("display", "none");
//    $(elem).find('td:eq(12)').css("display", "none");
//    //$(elem).find('td:eq(9)').css("display", "none");
//    $(elem).find("input[id^='_tempPrimaryBasis']").attr('disabled', true);
//    $(elem).find("input[id^='_tempSecondaryBasis']").attr('disabled', true);
//    $(elem).find("input[id^='_tempTax']").attr('disabled', true);
//    $(elem).find("input[id^='_tempAmount']").attr('disabled', true);


//    //if (parseInt($(elem).find("td[id^='tdSNoCol']").html() || "0") > MendatoryPaymentCharges.length) {
//    if (parseInt($("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").length || "0") > MendatoryPaymentCharges.length) {
//        $(elem).find("[id^='chkWaveof']").remove();
//        $(elem).find("a[id^='waveofRemark']").remove();
//        $(elem).find("input[id^='hdnremark']").remove();
//    }

//    $(elem).find("input[id^='chkCash']").prop('checked', true)
//    $(elem).find("input[id^='Amount']").each(function () {
//        $(this).unbind("blur").bind("blur", function () {
//            CalculateFBLAmount(this);
//        });
//    });
//    $(elem).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
//        $(elem).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
//    })

//    $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr td:last").css('width', '60px');
//    $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr").find("input[id^='Text_BillTo']").closest('span').css('width', '70px');
//}

//function BindPaymentDetails() {
//    debugger;
//    isFOCSHipment = 0;

//    $("#chkCash").attr('disabled', true);
//    $("#chkCredit").attr('disabled', true);
//    $("#Text_ChargeName").attr('disabled', true);
//    $("#PrimaryBasis").attr('disabled', true);
//    $("#SecondaryBasis").attr('disabled', true);
//    $("#Amount").attr('disabled', true);
//    $("#Tax").attr('disabled', true);
//    $("#Text_BillTo").attr('disabled', true);


//    $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_shipment_shipmenthandlingchargeinfo']:first").show();
//    $.ajax({
//        url: "Services/Shipment/AcceptanceService.svc/GetRecordAtPayment?AWBSNo=" + $("#AWBSNo").val(), async: false, type: "get", dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            var payementData = jQuery.parseJSON(result);
//            var handlingChargeArray = payementData.Table0;
//            var EssChargeArray = payementData.Table5;
//            var BillToData = payementData.Table6;
//            var awbChequeArray = payementData.Table1;

//            //if (PicesArray.length > 0) {
//            //    $("#tdPcs").text(PicesArray[0].AWBTOTALPIECES);
//            //}
//            var awbChequeArray = [];
//            //  $("span[id='AgentName']").text(payementData.Table1[0].AgentName.toUpperCase());
//            // $("input[name='AgentName']").val(payementData.Table1[0].AgentBranchSNo);

//            //_CreditLimt = parseFloat(payementData.Table1[0].RemainingCreditLimit || "0.00");
//            //_AWBAgent = payementData.Table1[0].AgentName.toUpperCase();
//            //if (payementData.Table4.length > 0) {
//            //    _ChecKCreditLimit = payementData.Table4[0].ChecKCreditLimit == 0 ? false : true;
//            //}

//            // Append Row To Display ESS Charge Link
//            // $('<table class="WebFormTable" id="tbtEssDetails"><tbody><tr><td class="formthreelabel" colspan="6"><a href="javascript:void(0);" id="aEssCharge" title="Show ESS" style="text-decoration:none;font-weight: bold"><span class="" id="EssDetails">Show ESS</span></a></td></tr></tbody></table>').insertAfter($("#divareaTrans_shipment_shipmenthandlingchargeinfo"));
//            //if (payementData.Table1[0].AgentName.toUpperCase() != "SAS") {
//            //    $('<td class="formthreeInputcolumn">Bill To&nbsp;&nbsp;<input type="hidden" name="BillToAgent" id="BillToAgent" value=""><input type="text" class="" name="Text_BillToAgent" id="Text_BillToAgent" controltype="autocomplete" maxlength="14" value="" placeholder=""></td>').insertAfter($("input[type='hidden'][id^='AgentName']").closest("td"));
//            //    $("#spnAgentName").closest("tbody").find("tr:first td").attr("colspan", 7);
//            //} else {
//            // $('<td class="formthreeInputcolumn">Bill To&nbsp;&nbsp;<input type="hidden" name="BillToAgent" id="BillToAgent" value=""><input type="text" class="" name="Text_BillToAgent" id="Text_BillToAgent" controltype="autocomplete" maxlength="14" value="" placeholder=""></td><td class="formthreeInputcolumn">Invoice To&nbsp;<input type="text" class="k-input" name="SHIPPER_Name" id="SHIPPER_Name" style="width: 150px; text-transform: uppercase;" controltype="default" maxlength="70" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td>').insertAfter($("input[type='hidden'][id^='AgentName']").closest("td"));
//            // $("#spnAgentName").closest("tbody").find("tr:first td").attr("colspan", 8);
//            //if (_AWBAgent == "SAS" || handlingChargeArray.length > 0) {
//            //    $("#SHIPPER_Name").val(BillToData[0].ShipperName == "" ? payementData.Table1[0].AgentName.toUpperCase() : BillToData[0].ShipperName);
//            //}
//            //}
//            // cfi.AutoComplete("BillToAgent", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], GetBillToCreditLimit, "contains", null, null, null, null, null, null, null, true);
//            // $("#Text_BillToAgent").data("kendoAutoComplete").setDefaultValue(BillToData[0].BillToSNo, BillToData[0].BillToName);

//            //AllowedSpecialChar("SHIPPER_Name");
//            //if (awbChequeArray.length > 0) {
//            //    $('#CashAmount').val(awbChequeArray[0].Amount)
//            //    if (awbChequeArray[0].PaymentMode == "Cash")
//            //        $('#PaymentMode:checked').val("0");
//            //    else
//            //        $('#PaymentMode:checked').val("1");
//            //    printInvoiceSno = payementData.Table1[0].InvoiceSno;
//            //    printorigin = payementData.Table1[0].CityCode;

//            //    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
//            //}

//            var tableHandleCharge = "";
//            var BillAmt = 0.000;
//            var CreditAmt = 0.000;
//            if (handlingChargeArray.length > 0) {
//                $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr:first").find("td:last").hide();
//                $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_shipment_shipmenthandlingchargeinfo']:first").hide();
//                for (var i = 0; i < handlingChargeArray.length; i++) {
//                    var waveof = handlingChargeArray[i].WaveoffRemarks == "" ? "" : '&nbsp;<b><a href="#" id="waveofRemark" style="text-decoration: none;" onclick=ShowRemarks("' + handlingChargeArray[i].WaveoffRemarks + '");return false;>Remarks</a></b>';
//                    tableHandleCharge += "<tr><td>" + (i + 1) + "</td><td>" + handlingChargeArray[i].IsWaveOff + waveof + "</td><td>" + handlingChargeArray[i].Description.toUpperCase() + "</td><td>" + handlingChargeArray[i].pBasis + "</td><td>" + handlingChargeArray[i].sBasis + "</td><td>" + handlingChargeArray[i].ChargeValue + "</td><td>" + handlingChargeArray[i].TotalChargeTaxAmount + "</td><td>" + handlingChargeArray[i].Amount + "</td><td>" + handlingChargeArray[i].PaymentMode + "</td><td>" + handlingChargeArray[i].Remarks + "</td><td>" + handlingChargeArray[i].ChargeTo + "</td></tr>"

//                    if (handlingChargeArray[i].IsWaveOff.toUpperCase() == "NO") {
//                        if (handlingChargeArray[i].PaymentMode == "CASH") {
//                            BillAmt = BillAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
//                        } else {
//                            if (handlingChargeArray[i].ChargeTo != "Airline") {
//                                CreditAmt = CreditAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
//                            }
//                        }
//                    }
//                }
//                //$("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr").each(function () {
//                //    $(this).find("td:contains('Payment')").css("display", "none");
//                //    $(this).find("td:contains('Action')").css("display", "none");
//                //    $(this).find("td:contains('Credit')").text("Mode");

//                //    $(this).find("td:eq(8)").remove();
//                //    $(this).find("td:eq(10)").remove();
//                //    $(this).find("td:eq(10)").remove();
//                //});
//                // $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='FBLAmount']").text(parseFloat(BillAmt).toFixed(0));
//                // $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='FBLAmount']").val(parseFloat(BillAmt).toFixed(0));

//                //// $("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("span[id='CrediAmount']").text(parseFloat(CreditAmt).toFixed(2));
//                //$("div[id='__divpayment__']").find("table[id='__tblpayment__']").find("input[type=hidden][id^='CrediAmount']").val(parseFloat(CreditAmt).toFixed(2));
//                //$("#CashAmount").val(parseFloat(BillAmt).toFixed(2));
//                //$("#_tempCashAmount").val(parseFloat(BillAmt).toFixed(2));

//                //var number = Math.round(BillAmt);
//                //if (Math.round(number % 10) != 0 && Math.round(number % 10) != 5) {
//                //    number = number - Math.round(number % 10) + (Math.round(number % 10) < 4 ? 5 : 10);
//                //}
//                //$("#CashAmount").closest("tr").find("td:last").text(number);

//                //$("#CashAmount").prop('readonly', true);
//                //$("#_tempCashAmount").prop('readonly', true);
//                //$("span[id^='spnCashAmount']").closest('tr').find("td:eq(0)").find("font").remove();

//            }

//            ///Chech ESS Details
//            //var tableEss = '';
//            //var EssCash = 0, EssCredit = 0;
//            //if (EssChargeArray.length > 0) {
//            //    $("a[id^='aEssCharge']").css("color", "green");
//            //    $("#divDetail").append('<div id="divareaTrans_shipment_shipmentESSCharge" style="display:none" cfi-aria-trans="trans"><table class="WebFormTable"><tbody><tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Select Charge Name"><span id="spnChargeName"> Charge Names</span></td><td class="formHeaderLabel" title="Primary Basis"><span id="spnPrimaryBasis"> P Basis</span></td><td class="formHeaderLabel" title="Secondary Basis"><span id="spnSecondaryBasis"> S Basis</span></td><td class="formHeaderLabel" title=""><span id="spnAmount"> Amount</span></td><td class="formHeaderLabel" title=""><span id="spnTax"> Tax</span></td><td class="formHeaderLabel" title="Total Amount"><span id="spnTotalAmount"> Total Amount</span></td><td class="formHeaderLabel" title="">Mode</td><td class="formHeaderLabel" title="Enter Remarks">Remarks</td><td class="formHeaderLabel" title="Select"><span id="spnBillTo"> Bill To</span></td></tr></tbody></table></div>');

//            //    for (var i = 0; i < EssChargeArray.length; i++) {
//            //        tableEss += "<tr><td>" + (i + 1) + "</td><td>" + EssChargeArray[i].Description.toUpperCase() + "</td><td>" + EssChargeArray[i].pBasis + "</td><td>" + EssChargeArray[i].sBasis + "</td><td>" + EssChargeArray[i].ChargeValue + "</td><td>" + EssChargeArray[i].TotalChargeTaxAmount + "</td><td>" + EssChargeArray[i].Amount + "</td><td>" + EssChargeArray[i].PaymentMode + "</td><td>" + EssChargeArray[i].Remarks + "</td><td>" + EssChargeArray[i].ChargeTo + "</td></tr>"

//            //        if (EssChargeArray[i].PaymentMode == "CASH") {
//            //            EssCash = EssCash + parseFloat(EssChargeArray[i].ChargeValue == "" ? "0" : EssChargeArray[i].ChargeValue);
//            //        } else {
//            //            if (EssChargeArray[i].ChargeTo != "Airline") {
//            //                EssCredit = EssCredit + parseFloat(EssChargeArray[i].ChargeValue == "" ? "0" : EssChargeArray[i].ChargeValue);
//            //            }
//            //        }
//            //    }

//            //    $("div[id='divareaTrans_shipment_shipmentESSCharge']").find("table:first").append(tableEss);
//            //    $("a[id^='aEssCharge']").unbind("click").bind("click", function () {
//            //        $("div[id=divareaTrans_shipment_shipmentESSCharge]").not(':first').remove();
//            //        if (!$("#divareaTrans_shipment_shipmentESSCharge").data("kendoWindow"))
//            //            cfi.PopUp("divareaTrans_shipment_shipmentESSCharge", "ESS Details", null, null, null);
//            //        else
//            //            $("#divareaTrans_shipment_shipmentESSCharge").data("kendoWindow").open();
//            //    });

//            //}

//            //var PopupTable = $("[id^='__tblpayment__']").last();
//            //$("textarea[id^='WaveOfRemarks']").closest('table').remove();
//            //$("[id^='__tblpayment__']").last().remove();
//            //$("#divDetail").append('<div id="divareaTrans_shipment_shipmentwaveofremark" style="display:none" cfi-aria-trans="trans"></div>');
//            // $(PopupTable).appendTo($("#divareaTrans_shipment_shipmentwaveofremark"));

//            if (handlingChargeArray.length == 0 && awbChequeArray.length == 0) {

//                //cfi.makeTrans("shipment_shipmenthandlingchargeinfo", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, null);

//                // cfi.makeTrans("shipment_shipmentaddcheque", null, null, BindBankAutoComplete, ReBindBankAutoComplete, null, null);
//                //$("div[id$='areaTrans_shipment_shipmentaddcheque']").find("[id='areaTrans_shipment_shipmentaddcheque']").each(function () {
//                //    $(this).find("input[id^='BankName']").each(function () {
//                //        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
//                //    });
//                //});

//                // $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table2[0].CurrencyCode + ')');
//                //var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
//                //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
//                //    $(this).find("input[id^='ChargeName']").each(function () {
//                //        //cfi.AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], null, null, null, null, null, "getHandlingChargesIE", "", $("#AWBSNo").val(), 0, origin, 2, "", "2", "999999999", "No");
//                //    });
//                //    $(this).find("input[id^='BillTo']").each(function () {
//                //        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
//                //    });
//                //    $(this).find("input[id^='Amount']").each(function () {
//                //        $(this).unbind("blur").bind("blur", function () {
//                //            CalculateFBLAmount(this);
//                //        });
//                //    });
//                //    $(this).find("[id^='chkWaveof']").after("<a href='#' id='waveofRemark' style='text-decoration:none;display:none;color:red' maxlength='200' onclick='BindwaveRemarks(this,event);return false;'>Remarks</a><input type='hidden' id='hdnremark' name='hdnremark' value=''>");

//                //});
//                //$("#CashAmount").unbind("keypress").bind("keypress", function () {
//                //    ISNumeric(this);
//                //});
//                // $("#CashAmount").prop('readonly', true);

//                debugger;
//                $.ajax({
//                    url: "Services/Shipment/AcceptanceService.svc/FBLHandlingCharges?AWBSNo=" + $("#AWBSNo").val(), async: false, type: "get", dataType: "json", cache: false,

//                    contentType: "application/json; charset=utf-8",
//                    success: function (result) {
//                        paymentData = jQuery.parseJSON(result);
//                        paymentList = paymentData.Table0;
//                        //Added By Manoj Kumar on 16/9/2015

//                        MendatoryPaymentCharges = [];
//                        var TotalMandatoryAmt = 0;
//                        $(paymentList).each(function (row, i) {
//                            if (i.isMandatory == 1) {
//                                //MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "amount": i.ChargeAmount, "totalamount": parseFloat(parseFloat(i.ChargeAmount) + parseFloat(i.GSTAmount)).toFixed(2), "remarks": i.ChargeRemarks, "list": 1 });
//                                MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "primarybasis": i.pValue, "secondarybasis": i.sValue, "amount": parseFloat(i.ChargeAmount).toFixed(2), "tax": i.TotalTaxAmount, "totalamount": parseFloat(i.TotalAmount).toFixed(2), "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, "min": i.Min, "totaltaxamount": i.TotalTaxAmount, "list": 1, "billto": i.ChargeTo, "text_billto": i.Text_ChargeTo, "punit": i.PrimaryBasis, "sunit": i.SecondaryBasis, "iseditableunit": i.IsEditableUnit });
//                                TotalMandatoryAmt = TotalMandatoryAmt + parseFloat(i.TotalAmount || 0);
//                            }
//                        })
//                        cfi.makeTrans("shipment_shipmenthandlingchargeinfo", null, null, BindHandlingChargeAutoComplete, ReBindHandlingChargeAutoComplete, null, MendatoryPaymentCharges);
//                        ///
//                        //        $("span[id='AgentName']").text(paymentData.Table1[0].AgentName);
//                        //        $("input[name='AgentName']").val(paymentData.Table1[0].AgentBranchSNo);
//                        //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
//                        //Added By Manoj Kumar on 16/9/2015

//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function (row, tr) {
//                            $(tr).find('td:eq(3)').css('width', '100px');
//                            $(tr).find('td:eq(4)').css('width', '100px');
//                            $(tr).find('td:eq(10)').css("display", "none");
//                            $(tr).find('td:eq(11)').css("display", "none");
//                            $(tr).find('td:eq(12)').css("display", "none");
//                            //$(tr).find('td:eq(9)').css("display", "none");
//                            //if (_AWBAgent == "SAS") {
//                            //    $(tr).find("input[id^='chkCash']").prop('checked', true);
//                            //    $(tr).find("input[id^='chkCredit']").prop('checked', false);
//                            //    $(tr).find("input[id^='chkCredit']").attr('disabled', true);
//                            //} else {
//                            //if (_ChecKCreditLimit == true) {
//                            //    if (_CreditLimt < TotalMandatoryAmt) {
//                            //        $(tr).find("input[id^='chkCash']").prop('checked', true);
//                            //        $(tr).find("input[id^='chkCredit']").prop('checked', false);
//                            //    } else {
//                            //        $(tr).find("input[id^='chkCash']").prop('checked', false);
//                            //        $(tr).find("input[id^='chkCredit']").prop('checked', true);
//                            //    }
//                            //} else {
//                            //    $(tr).find("input[id^='chkCash']").prop('checked', false);
//                            //    $(tr).find("input[id^='chkCredit']").prop('checked', true);
//                            //}
//                            //}


//                            //$(tr).find("td:last").remove();
//                            $(tr).find("span[id^='TotalAmount']").attr('title', $(tr).find("input[id^='Remarks']").val());
//                            if (MendatoryPaymentCharges.length > 0) {
//                                $(tr).find("input[id^='PrimaryBasis']").closest('td').append("&nbsp;&nbsp;<span id=_PrimaryBasis_" + row + ">" + MendatoryPaymentCharges[row].punit + "</span>");
//                                $(tr).find("input[id^='SecondaryBasis']").closest('td').append("&nbsp;&nbsp;<span id=_SecondaryBasis_" + row + ">" + MendatoryPaymentCharges[row].sunit + "</span>");
//                                if (MendatoryPaymentCharges[row].sunit == "") {
//                                    $(tr).find("input[id*='SecondaryBasis']").css("display", "none");
//                                    $(tr).find("span[id^='_SecondaryBasis']").css("display", "none");
//                                }
//                            }

//                            $(this).find("[id^='chkWaveof']").unbind("click").bind("click", function () {
//                                EnableRemarks(this);
//                                CalculatePayment(this)
//                            });
//                            $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
//                                $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
//                            })

//                        });
//                        //if (_AWBAgent != "SAS") {
//                        //    if ($("input[id^='chkCash']").is(":checked") == true) {
//                        //        $("#SHIPPER_Name").val(_AWBAgent);
//                        //    }
//                        //}

//                        //$("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo'] table tr").each(function (row, tr) {
//                        //    if ($(tr).find("td[id^=tdSNoCol]").text() != "" && $(tr).find("td[id^=tdSNoCol]").text() != undefined) {
//                        //        if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) < MendatoryPaymentCharges.length) {
//                        //            $(tr).find("td[id^=transAction]").remove();
//                        //            if (MendatoryPaymentCharges[$(tr).find("td[id^=tdSNoCol]").text() - 1].iseditableunit != "1") {
//                        //                $(tr).find("input[id^='PrimaryBasis']").attr('disabled', true);
//                        //                $(tr).find("input[id^='_tempPrimaryBasis']").attr('disabled', true);
//                        //                $(tr).find("input[id^='SecondaryBasis']").attr('disabled', true);
//                        //                $(tr).find("input[id^='_tempSecondaryBasis']").attr('disabled', true);
//                        //            } else {
//                        //                $(tr).find("input[id^='PrimaryBasis']").removeAttr('disabled');
//                        //                $(tr).find("input[id^='_tempPrimaryBasis']").removeAttr('disabled');
//                        //                $(tr).find("input[id^='SecondaryBasis']").removeAttr('disabled');
//                        //                $(tr).find("input[id^='_tempSecondaryBasis']").removeAttr('disabled');
//                        //            }
//                        //            $(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
//                        //            $(tr).find("input[id^='Amount']").attr('disabled', true);
//                        //            $(tr).find("input[id^='_tempAmount']").attr('disabled', true);
//                        //            $(tr).find("input[id^='Tax']").attr('disabled', true);
//                        //            $(tr).find("input[id^='_tempTax']").attr('disabled', true);
//                        //        }
//                        //        else if (parseInt($(tr).find("td[id^=tdSNoCol]").text()) == MendatoryPaymentCharges.length) {
//                        //            $(tr).find("td[id^=transAction]").find("i[title=Delete]").remove();
//                        //            $(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
//                        //            if (MendatoryPaymentCharges[$(tr).find("td[id^=tdSNoCol]").text() - 1].iseditableunit != "1") {
//                        //                $(tr).find("input[id^='PrimaryBasis']").attr('disabled', true);
//                        //                $(tr).find("input[id^='_tempPrimaryBasis']").attr('disabled', true);
//                        //                $(tr).find("input[id^='SecondaryBasis']").attr('disabled', true);
//                        //                $(tr).find("input[id^='_tempSecondaryBasis']").attr('disabled', true);
//                        //            } else {
//                        //                $(tr).find("input[id^='PrimaryBasis']").removeAttr('disabled');
//                        //                $(tr).find("input[id^='_tempPrimaryBasis']").removeAttr('disabled');
//                        //                $(tr).find("input[id^='SecondaryBasis']").removeAttr('disabled');
//                        //                $(tr).find("input[id^='_tempSecondaryBasis']").removeAttr('disabled');
//                        //            }
//                        //            $(tr).find("input[id^='Amount']").attr('disabled', true);
//                        //            $(tr).find("input[id^='_tempAmount']").attr('disabled', true);
//                        //            $(tr).find("input[id^='Tax']").attr('disabled', true);
//                        //            $(tr).find("input[id^='_tempTax']").attr('disabled', true);
//                        //        }
//                        //        $(tr).find("input[id*='PrimaryBasis']").each(function () {
//                        //            $(this).unbind("blur").bind("blur", function () {
//                        //                GetChargeRateDetails($(tr), this);
//                        //            });
//                        //        });
//                        //        $(tr).find("input[id*='SecondaryBasis']").each(function () {
//                        //            $(this).unbind("blur").bind("blur", function () {
//                        //                GetChargeRateDetails($(tr), this);
//                        //            });
//                        //        });

//                        //    }

//                        //    //var WavPermission = getNonObjects(userContext.SpecialRights, 'Code', "WAV");
//                        //    $("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='chkWaveof']").attr('disabled', userContext.SpecialRights.WAV == false ? true : false);

//                        //    $(tr).find("input[id^=Text_ChargeName]").each(function () {
//                        //        if (MendatoryPaymentCharges.length > 0) {
//                        //            var NMendatory = getNonObjects(MendatoryPaymentCharges, 'chargename', $(this).data("kendoAutoComplete").key());
//                        //            if (NMendatory[0].billto != "2") {
//                        //                $(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
//                        //            }
//                        //        }
//                        //        else {
//                        //            $(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
//                        //        }

//                        //    });
//                        //    //$(tr).find("input[id^=Text_ChargeName]").data("kendoAutoComplete").key();
//                        //});

//                        //CalculateTotalFBLAmount();
//                        //
//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(3)").css('width', '100px');
//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(4)").css('width', '100px');

//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(10)").css("display", "none");
//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(11)").css("display", "none");
//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr:eq(2)").find("td:eq(12)").css("display", "none");
//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr td:last").css('width', '60px');
//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("tr").find("input[id^='Text_BillTo']").closest('span').css('width', '70px');
//                        $("span[id^='spnCashAmount']").closest('tr').find("td:eq(0)").find("font").remove();

//                    },
//                    error: function (xhr) {

//                    }
//                });

//                if (PicesArray[0].IsFOC == true) {
//                    isFOCSHipment = 1;
//                    if (MendatoryPaymentCharges.length <= 0) {
//                        $("div[id$='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("[id^='areaTrans_shipment_shipmenthandlingchargeinfo']").each(function () {
//                            $(this).find("input[id^='Text_ChargeName']").removeAttr("data-valid");
//                        });
//                    }
//                }
//                //$("span[id='AgentName']").text(paymentData.Table1[0].AgentName);
//                //$("input[name='AgentName']").val(paymentData.Table1[0].AgentBranchSNo);
//                //$("div[id$='areaTrans_shipment_shipmenthandlingchargeinfo']").find("span[id^='spnAmount']").text('Amount (IN ' + payementData.Table3[0].BaseCurrency + ')');
//                //Added By Manoj Kumar on 16/9/2015
//                // CalculateTotalFBLAmount();

//                var sectionId = "";
//                if (parseInt($("#AWBSNo").val()) > 0) {
//                    sectionId = "divDetail";
//                }
//                else {
//                    sectionId = "divNewBooking";
//                }
//                cfi.ValidateSection(sectionId);
//                //SAVE SECTION
//                $("#btnSave").unbind("click").bind("click", function () {
//                    $("#btnSave").css('display', 'none');
//                    $("#btnSaveToNext").css('display', 'none');
//                    $("#btnCancel").css('display', 'none');
//                    if (cfi.IsValidSection(sectionId)) {
//                        if (true) {
//                            if (!SavePaymentInfo()) {
//                                $("#btnSave").css('display', '');
//                                $("#btnSaveToNext").css('display', '');
//                                $("#btnCancel").css('display', '');
//                            }
//                        }
//                    }
//                    else {
//                        $("#btnSave").css('display', '');
//                        $("#btnSaveToNext").css('display', '');
//                        $("#btnCancel").css('display', '');
//                        return false
//                    }
//                });

//                $("#btnSaveToNext").unbind("click").bind("click", function () {
//                    var saveflag = false;
//                    $("#btnSave").css('display', 'none');
//                    $("#btnSaveToNext").css('display', 'none');
//                    $("#btnCancel").css('display', 'none');
//                    if (cfi.IsValidSection(sectionId)) {
//                        if (true) {
//                            saveflag = SavePaymentInfo();
//                            if (saveflag == false) {
//                                $("#btnSave").css('display', '');
//                                $("#btnSaveToNext").css('display', '');
//                                $("#btnCancel").css('display', '');
//                            }
//                        }
//                    }
//                    else {
//                        saveflag = false
//                        $("#btnSave").css('display', '');
//                        $("#btnSaveToNext").css('display', '');
//                        $("#btnCancel").css('display', '');
//                    }
//                    if (saveflag) {
//                        for (var i = 0; i < processList.length; i++) {
//                            if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
//                                if (parseInt($("#AWBSNo").val()) > 0) {
//                                    currentprocess = processList[i + 1].value;
//                                    subprocesssno = processList[i + 1].SNo;
//                                    ShowProcessDetails(currentprocess, processList[i + 1].isoneclick, subprocesssno);
//                                }
//                                else {
//                                    CleanUI();
//                                    cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
//                                }
//                                return;
//                            }
//                        }
//                    }
//                });

//                //$("#btnSave").unbind("click").bind("click", function () {
//                //    SavePaymentInfo();
//                //});
//            }
//            else {
//                $("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").append(tableHandleCharge);
//                $("#btnSave").unbind("click").bind("click", function () {
//                    ShowMessage('warning', 'Warning - Payment', "Payment already Processed", "bottom-right");
//                });
//                $("#btnSaveToNext").unbind("click").bind("click", function () {
//                    ShowMessage('warning', 'Warning - Payment', "Payment already Processed", "bottom-right");
//                });
//                //$("#Text_BillToAgent").data("kendoAutoComplete").enable(false);
//                //if (payementData.Table1[0].AgentName.toUpperCase() != "SAS") {
//                //    $("#SHIPPER_Name").attr('disabled', true);
//                //}

//            }
//            $("div[id$='areaTrans_shipment_shipmentaddcheque']").hide();
//        }
//    });
//}

var NoOfHouse = 0, AcTotalPieces = 0;
function CalculateCharge() {

    var finalamount = 0.00;
    var checkvalue = 0.00;

    var defaultamount = $('#Text_TotalCharges').val();

    $("input:checked[id^='chkWaveoff']").each(function (index, item) {
        var totalamount = $("#trTotalAmount" + (index + 1)).text();
        finalamount = finalamount + parseFloat(totalamount)
        //var SalesOrderNo = $("#tblULDGridDetails_SalesOrderNo_" + (index + 1)).val();
        //var ULDRepairSNo = $("#tblULDGridDetails_ULDRepairSNo_" + (index + 1)).val();
        //var AgreementNumber = $("#tblULDGridDetails_AgreementNumber_" + (index + 1)).val();

        //ULDInvoice.push({
        //    NPPANo: NPPANo,
        //    SalesOrderNo: SalesOrderNo,
        //    ParticipientSNo: $('#VendorSNo').val(),
        //    ULDRepairSNo: ULDRepairSNo,
        //    AgreementNumber: AgreementNumber.toString(),
        //});

    });



    if ($("input:checked[id^='chkWaveoff']").length == 0) {
        $('#Text_TotalCharges').val($('#TotalCharges').val());


    }
    else {
        $('#Text_TotalCharges').val(parseFloat($('#TotalCharges').val()) - parseFloat(finalamount));
    }

}

function BindPaymentDetails() {
    $('#Text_TotalCharges').val('');
    var totalchargevlue = 0.00;
    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetRecordAtPayment?AWBSNo=" + parseInt($("#AWBSNo").val()), async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var payementData = jQuery.parseJSON(result);
            var handlingChargeArray = payementData.Table0;
            var EssChargeArray = payementData.Table5;
            var BillToData = payementData.Table6;
            var awbChequeArray = payementData.Table1;


            var awbChequeArray = [];
            var tbl = "";
            $('#DivChargeDetails').html('');

            tbl += "<table width='100%' style='border-spacing: 0;' id='tblcharge' >"


            tbl += "<tr>"
            tbl += "<td class='formHeaderLabel snowidth' id='transSNo' name='transSNo'>SNo</td>"
            tbl += "<td class='formHeaderLabel'>Waive off</td>"
            tbl += "<td class='formHeaderLabel'> Charge Names</td>"
            tbl += "<td class='formHeaderLabel'> P Basis</span></td>"
            tbl += "<td class='formHeaderLabel' > S Basis</span></td>"
            tbl += "<td class='formHeaderLabel'> Amount</span></td>"
            tbl += "<td class='formHeaderLabel'>Tax</td>"
            tbl += "<td class='formHeaderLabel'> Total Amount</span></td>"
            tbl += "<td class='formHeaderLabel' title=''>Payment Mode</td>"
            tbl += "<td class='formHeaderLabel' title='Enter Remarks'>Remarks</td>"
            //<td class='formHeaderLabel' title=''></td>"
            //tbl+="<td class='formHeaderLabel' title=''></td>"
            //tbl+="<td class='formHeaderLabel' title='Select'><span id='spnBillTo'> Bill To</span></td>"
            tbl += "</tr>"














            if (handlingChargeArray.length > 0) {
                //$("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr:first").find("td:last").hide();
                //$("div[id='divareaTrans_shipment_shipmenthandlingchargeinfo']").find("table:first").find("tr[id='areaTrans_shipment_shipmenthandlingchargeinfo']:first").hide();
                for (var i = 0; i < handlingChargeArray.length; i++) {
                    //var waveof = handlingChargeArray[i].WaveoffRemarks == "" ? "" : '&nbsp;<b><a href="#" id="waveofRemark" style="text-decoration: none;" onclick=ShowRemarks("' + handlingChargeArray[i].WaveoffRemarks + '");return false;>Remarks</a></b>';
                    //tableHandleCharge += "<tr><td>" + (i + 1) + "</td><td>" + handlingChargeArray[i].IsWaveOff + waveof + "</td><td>" + handlingChargeArray[i].Description.toUpperCase() + "</td><td>" + handlingChargeArray[i].pBasis + "</td><td>" + handlingChargeArray[i].sBasis + "</td><td>" + handlingChargeArray[i].ChargeValue + "</td><td>" + handlingChargeArray[i].TotalChargeTaxAmount + "</td><td>" + handlingChargeArray[i].Amount + "</td><td>" + handlingChargeArray[i].PaymentMode + "</td><td>" + handlingChargeArray[i].Remarks + "</td><td>" + handlingChargeArray[i].ChargeTo + "</td></tr>"

                    //if (handlingChargeArray[i].IsWaveOff.toUpperCase() == "NO") {
                    //    if (handlingChargeArray[i].PaymentMode == "CASH") {
                    //        BillAmt = BillAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
                    //    } else {
                    //        if (handlingChargeArray[i].ChargeTo != "Airline") {
                    //            CreditAmt = CreditAmt + parseFloat(handlingChargeArray[i].ChargeValue == "" ? "0" : handlingChargeArray[i].ChargeValue);
                    //        }
                    //    }
                    //}



                    tbl += "<tr>"
                    tbl += "<td id='tdSNoCol' class='formSNo'>" + parseInt(i + 1) + "</td>"
                    tbl += "<td class='formfourInputcolumn'>"
                    tbl += "<input type='checkbox' tabindex=19 class='' name='chkWaveoff' id='chkWaveoff' onclick='CalculateCharge()' /></td>"
                    tbl += "<td class='formfourInputcolumn' id='trchargename'>"
                    // tbl+= "<input type='hidden' name='ChargeName' id='ChargeName' recname='ChargeName' value='' />"
                    tbl += "" + handlingChargeArray[i].Description.toUpperCase() + "</td>"
                    tbl += "<td class='formfourInputcolumn' id='trPrimaryBasis'>"
                    tbl += "" + handlingChargeArray[i].pBasis + "</td>"
                    tbl += "<td class='formfourInputcolumn' id='trSecondaryBasis'>" + handlingChargeArray[i].sBasis + "</td>"
                    tbl += "<td class='formfourInputcolumn' id='trAmount'>" + handlingChargeArray[i].ChargeValue + "</td>"
                    tbl += "<td class='formfourInputcolumn' id='trAmount'>" + handlingChargeArray[i].TotalChargeTaxAmount + "</td>"

                    tbl += "<td class='formfourInputcolumn' id='trTotalAmount" + parseInt(i + 1) + "'>" + handlingChargeArray[i].Amount + "</td><td class='formfourInputcolumn' id='trPaymentMode'>"
                    tbl += "" + handlingChargeArray[i].PaymentMode + "</td>"
                    tbl += "<td class='formfourInputcolumn' id='trRemarks'>"
                    tbl += "" + handlingChargeArray[i].Remarks + "</td>"

                    tbl += "</tr>"
                    totalchargevlue = parseFloat(totalchargevlue) + parseFloat(handlingChargeArray[i].Amount);
                }
                $('#Text_TotalCharges').val(totalchargevlue);
                $('#TotalCharges').val(totalchargevlue);

            }
            else {
                $.ajax({
                    url: "Services/Shipment/AcceptanceService.svc/FBLHandlingCharges?AWBSNo=" + $("#AWBSNo").val(), async: false, type: "get", dataType: "json", cache: false,

                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        paymentData = jQuery.parseJSON(result);
                        var paymentList = paymentData.Table0;


                        MendatoryPaymentCharges = [];
                        var TotalMandatoryAmt = 0;
                        //$(paymentList).each(function (row, i) {
                        //    if (i.isMandatory == 1) {
                        //        MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "amount": i.ChargeAmount, "totalamount": parseFloat(parseFloat(i.ChargeAmount) + parseFloat(i.GSTAmount)).toFixed(2), "remarks": i.ChargeRemarks, "list": 1 });
                        //        /                               MendatoryPaymentCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "primarybasis": i.pValue, "secondarybasis": i.sValue, "amount": parseFloat(i.ChargeAmount).toFixed(2), "tax": i.TotalTaxAmount, "totalamount": parseFloat(i.TotalAmount).toFixed(2), "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, "min": i.Min, "totaltaxamount": i.TotalTaxAmount, "list": 1, "billto": i.ChargeTo, "text_billto": i.Text_ChargeTo, "punit": i.PrimaryBasis, "sunit": i.SecondaryBasis, "iseditableunit": i.IsEditableUnit });
                        //    TotalMandatoryAmt = TotalMandatoryAmt + parseFloat(i.TotalAmount || 0);

                        //$(paymentList).each(function (row, j) {

                        for (var j = 0; j < paymentList.length; j++) {
                            if (paymentList[j].isMandatory) {
                                tbl += "<tr>"
                                tbl += "<td id='tdSNoCol' class='formSNo'>" + parseInt(j + 1) + "</td>"
                                tbl += "<td class='formfourInputcolumn'>"
                                tbl += "<input type='checkbox' tabindex=19 class='' name='chkWaveoff' id='chkWaveoff' onclick='CalculateCharge()'  recname='chkWaveoff' /></td>"
                                tbl += "<td class='formfourInputcolumn' id='trchargename'>"

                                tbl += "" + paymentList[j].TariffHeadName + "</td>"
                                tbl += "<td class='formfourInputcolumn' id='trPrimaryBasis'>"
                                tbl += "" + paymentList[j].pValue + "</td>"
                                tbl += "<td class='formfourInputcolumn' id='trSecondaryBasis'>" + paymentList[j].sValue + "</td>"
                                tbl += "<td class='formfourInputcolumn' id='trAmount'>" + paymentList[j].ChargeAmount + "</td>"
                                tbl += "<td class='formfourInputcolumn' id='trAmount'>" + paymentList[j].TotalTaxAmount + "</td>"

                                tbl += "<td class='formfourInputcolumn' id='trTotalAmount" + parseInt(j + 1) + "'>" + paymentList[j].TotalAmount + "</td><td class='formfourInputcolumn' id='trPaymentMode'>"
                                tbl += "" + paymentList[j].PaymentMode + "</td>"
                                tbl += "<td class='formfourInputcolumn' id='trRemarks'>"
                                tbl += "" + paymentList[j].ChargeRemarks + "</td>"

                                tbl += "</tr>"
                                totalchargevlue = parseFloat(totalchargevlue) + parseFloat(paymentList[j].TotalAmount);


                            }
                            $('#Text_TotalCharges').val(totalchargevlue);
                            $('#TotalCharges').val(totalchargevlue);

                        }


                    }

                });
            }
            tbl += "</table>"

            $('#DivChargeDetails').append(tbl);
            tbl = "";
        }
    });

}
function onLoad() {
    $("input[name='operation']").unbind("click").click(function () {
        cfi.ValidateSubmitSection("tbl");
        dirtyForm.isDirty = false;//to track the changes
        if (!cfi.IsValidSubmitSection()) return false;

        if (PageType == "NEW") {
            SaveReturntoShipper();

            return false;

        }
    });

    if (PageType == "READ") {
        cfi.AutoCompleteV2("AWBSNo", "sno,awbno", "Shipment_Returntoshipper_AWB", null, "contains");
        cfi.AutoCompleteV2("HAWBSNo", "sno,HAWBNo", "HouseIndex_FlightNo", null, "contains");
        $("#__SpanHeader__").hide();
        GetReturntoShipperData();
    }
    else if (PageType == "NEW") {
        cfi.AutoCompleteV2("AWBSNo", "sno,awbno", "Shipment_Returntoshipper_AWB", Onchangeawb, "contains");
        cfi.AutoCompleteV2("HAWBSNo", "sno,HAWBNo", "HouseIndex_FlightNo", OnchangeHawb, "contains");
        $("#__SpanHeader__").hide();
        ExtraCondition("Text_AWBSNo");
    }

}

function OnchangeHawb() {
    GetReturntoShipperData()
}
function Onchangeawb() {

    $("#HAWBSNo").val("");
    $("#Text_HAWBSNo").val("");
    $("#Text_Pieces").val("");
    $("#Text_GrWt").val("");
    $("#Text_CBM").val("");
    $("#Text_VolWt").val("");
}
function GetReturntoClear() {
}
function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_AWBSNo") {
        try {
            cfi.setFilter(filter, "OriginAirportSNo", "eq", userContext.AirportSNo)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }
    if (textId == "Text_HAWBSNo") {
        try {
            cfi.setFilter(filter, "AWBSNo", "eq", $("#AWBSNo").val())
            var HAWBSNoAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return HAWBSNoAutoCompleteFilter2;
        }
        catch (exp) { }
    }

}


function validate(evt) {
    if (evt.ctrlKey == true && (evt.which == '118' || evt.which == '86' || evt.which == 17 || evt.which == 2)) {
        evt.preventDefault();
    }
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./g;

    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }



}



var Text_Pieces, Text_GrWt, Text_CBM, Text_VolWt


function ChangePieces(evt) {
    if ($("#Text_Pieces").val() == "" || $("#Text_Pieces").val() == 0) {
        $("#Text_Pieces").val(Text_Pieces)
    }
    if (parseInt($("#Text_Pieces").val()) > parseInt(Text_Pieces)) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + $("#Text_AWBSNo").val() + "] -  Unable to process. Check planned piece.", "bottom-right");
        $("#Text_Pieces").val(Text_Pieces)
        $("#Text_GrWt").val(Text_GrWt)
        $("#Text_VolWt").val(Text_VolWt)
        $("#Text_CBM").val((Text_VolWt / 166.66).toFixed(3))

    } else if (parseInt($("#Text_Pieces").val()) == parseInt(Text_Pieces)) {
        $("#Text_GrWt").val(Text_GrWt)
        $("#Text_VolWt").val(Text_VolWt)
        $("#Text_CBM").val((Text_VolWt / 166.66).toFixed(3))
    } else {
        var gwt = (parseFloat(($("#Text_GrWt").val() / parseInt(Text_Pieces))) * parseInt($("#Text_Pieces").val())).toFixed(2);
        var Vwt = (parseFloat(($("#Text_VolWt").val()) / parseInt(Text_Pieces)) * parseInt($("#Text_Pieces").val())).toFixed(2);
        $("#Text_GrWt").val(gwt)
        $("#Text_VolWt").val(Vwt)
        $("#Text_CBM").val(($("#Text_VolWt").val() / 166.66).toFixed(3))


    }
};
function ChangeGrWt(evt) {
    if ($("#Text_GrWt").val() > Text_GrWt) {
        $("#Text_GrWt").val(Text_GrWt)
    } else if ($("#Text_GrWt").val() == 0) {
        $("#Text_GrWt").val(Text_GrWt)
    }
};
function ChangeVolWt(evt) {
    if ($("#Text_VolWt").val() > Text_VolWt) {
        $("#Text_VolWt").val(Text_VolWt)
    } else if ($("#Text_VolWt").val() == 0) {
        $("#Text_VolWt").val(Text_VolWt)
    }
};


function abc() {


    if (!$("#DivpiecesDetails").data("kendoWindow")) {
        cfi.PopUp("DivpiecesDetails", "Pieces Details", 620);
    }
    else {
        $("#DivpiecesDetails").data("kendoWindow").open();
    }




}

function CalculateShipmentChWt(obj) {

    var grosswt = ($("#Text_GrWt").val() == "" ? 0 : parseFloat($("#Text_GrWt").val()));

    var cbm = ($("#Text_CBM").val() == "" ? 0 : parseFloat($("#Text_CBM").val()));
    var volwt = cbm * 166.66;

    $("span[id='Text_VolWt']").text(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));

    $("#Text_VolWt").val(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));
    $("#hdnVolWt").val(volwt.toFixed(3) == 0 ? "" : volwt.toFixed(3));

    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#Text_ChWt").val(chwt.toFixed(3).toString() == 0 ? "" : chwt.toFixed(3).toString());
    $("#hdnChWt").val(chwt.toFixed(3).toString() == 0 ? "" : chwt.toFixed(3).toString());
}



function compareGrossVolValue() {
    var gw = $("#Text_GrWt").val();
    var vw = $("#Text_VolWt").val();
    var cw = $("#Text_ChWt").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#Text_ChWt").val() == "" ? "0" : $("#Text_ChWt").val()) < chwt) {
        $("#Text_ChWt").val(chwt == 0 ? "" : chwt);
        $("#hdnChWt").val(chwt == 0 ? "" : chwt);
    }
}



function CalculateShipmentCBM() {
    var grosswt = ($("#Text_GrWt").val() == "" ? 0 : parseFloat($("#Text_GrWt").val()));
    var volwt = ($("#Text_VolWt").val() == "" ? 0 : parseFloat($("#Text_VolWt").val()));
    var cbm = (volwt / 166.66).toFixed(3);
    // cbm = cbm < 0.01 ? 0.01 : cbm;
    $("#Text_CBM").val(cbm.toString() == 0 ? "" : cbm.toString());
    $("#hdnCBM").val(cbm.toString() == 0 ? "" : cbm.toString());
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#Text_ChWt").val(chwt.toString() == 0 ? "" : chwt.toString());
    $("#hdnChWt").val(chwt.toFixed(3).toString() == 0 ? "" : chwt.toString());
}




function SaveReturntoShipper() {

    if ($("#Text_Pieces").val() == "0" || $("#Text_Pieces").val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', "Enter Pieces ", "bottom-left");
        return;
    }
    if ($("#Text_GrWt").val() == "0" || $("#Text_GrWt").val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', "Enter Gross Weight ", "bottom-left");
        return;
    }
    if ($("#Text_VolWt").val() == "0" || $("#Text_VolWt").val() == "") {
        ShowMessage('info', 'Need your Kind Attention!', "Enter Volume Weight", "bottom-left");
        return;
    }


    var ReturnList = [];
    var check = true;
    var TotalChargesvalue = 0.00;
    if ($("#Text_TotalCharges").val() != "") {
        TotalChargesvalue = $("#Text_TotalCharges").val();
    }
    var checkawbsno = $("#AWBSNo").val();

    var Array = {
        AWBSNo: $("#AWBSNo").val(),
        Pieces: $("#Text_Pieces").val(),
        GrossWeight: $("#Text_GrWt").val(),
        VolumeWeight: $("#Text_VolWt").val(),
        Volume: $("#Text_CBM").val(),
        CustomRefNo: $("#Text_CustomRefNo").val(),
        NOCRefNo: $("#Text_NOCRefNo").val(),
        Reason: $("#Text_Reason").val(),



        TotalCharges: TotalChargesvalue,



    };
    ReturnList.push(Array);

    //start
    if (parseInt(AcTotalPieces) == parseInt($("#Text_Pieces").val())) {
        if (checkawbsno != "") {
            $.ajax({
                url: "Services/Shipment/ReturntoShipperService.svc/GetReturntoShipperData", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AwbSno: checkawbsno, UpdatedBy: userContext.UserSNo, hawbno: $("#HAWBSNo").val() }),
                success: function (result) {

                    var GetSucessResult = JSON.parse(result);
                    if (GetSucessResult != undefined) {
                        $("#InfoDiv").show();
                        if (GetSucessResult.Table0.length > 0) {



                            if (GetSucessResult.Table0[0].massage != "") {
                                ShowMessage('info', 'Need your Kind Attention!', GetSucessResult.Table0[0].massage, "bottom-left");
                                check = false;
                            }

                            if (GetSucessResult.Table0[0].Allavilablepcsmsg != "") {
                                ShowMessage('info', 'Need your Kind Attention!', GetSucessResult.Table0[0].Allavilablepcsmsg, "bottom-left");
                                check = false;
                            }
                            if (GetSucessResult.Table0[0].Pcsmassage != "") {
                                ShowMessage('info', 'Need your Kind Attention!', GetSucessResult.Table0[0].Pcsmassage, "bottom-left");
                                check = false;
                            }


                        }

                    }


                }
            });
        }
        //End
        if (!check) {
            return false;
        }
    }






    if (AWBSNo != "") {
        $.ajax({
            url: "Services/Shipment/ReturntoShipperService.svc/SaveReturnShipment", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SaveReturnShipment: ReturnList, Hawb: $("#HAWBSNo").val() }),
            success: function (result) {

                var RtsData = jQuery.parseJSON(result);
                RtsData.Table1;
                if (RtsData.Table1[0].ReturnErrorNo == 0) {



                    ShowMessage('success', 'Success - Return to Shipper', "Return to Shipper saved successfully");

                    setTimeout(function () {
                        navigateUrl('Default.cshtml?Module=Shipment&Apps=ReturntoShipper&FormAction=INDEXVIEW');
                    }, 1000);

                }
                else if (RtsData.Table1[0].ReturnErrorNo == 1001) {

                    ShowMessage('warning', 'Warning - Return to Shipment !', "Record exist");


                }
                else {
                    ShowMessage('error', 'Error -Return to Shipment !', "Record Not Saved");

                }
            }

        });

    }

}

function BindEvents(input, e) {

    var subprocess = $(input).attr("process").toUpperCase();
    var AWBSNo = $(input).closest('tr').find("td[data-column=AWBSNo]").text()
    if (subprocess == 'PRINT') {
        var win = window.open('../HtmlFiles/Shipment/ReturnShipmentPrint.html?AWBSNo=' + AWBSNo, '_blank');
    }

}

function printDiv() {



    var win = window.open('../HtmlFiles/Shipment/ReturnShipmentPrint.html?AWBSNo=' + getQueryStringValue("RecID").toUpperCase(), '_blank');


}



function GetReturntoShipperData() {


    var AwbSno;
    var tbl = "";
    var NopiecesDiv = "";
    $("#ItineryInfo").html("");
    $("#DivpiecesDetails").html("");
    var PageType = getQueryStringValue("FormAction").toUpperCase();
    if (PageType == "NEW") {
        AwbSno = $("#AWBSNo").val();
        $("#trprint").hide();
        $("#trawbinread").hide();


        if (AwbSno != "") {
            $.ajax({
                url: "Services/Shipment/ReturntoShipperService.svc/GetReturntoShipperData", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AwbSno: AwbSno, UpdatedBy: userContext.UserSNo, hawbno: $("#HAWBSNo").val() }),
                success: function (result) {

                    var GetSucessResult = JSON.parse(result);
                    if (GetSucessResult != undefined) {
                        $("#InfoDiv").show();
                        if (GetSucessResult.Table0.length > 0) {

                            NoOfHouse = GetSucessResult.Table0[0].NoOfHouse
                            AcTotalPieces = GetSucessResult.Table0[0].AcTotalPieces
                            if (NoOfHouse != 0) {
                                if ($("#HAWBSNo").val() == "") {
                                    ShowMessage('info', 'Need your Kind Attention!', "please select HAWB No.", "bottom-left");
                                    return
                                }
                            }
                            if (GetSucessResult.Table0[0].massage != "") {
                                ShowMessage('info', 'Need your Kind Attention!', GetSucessResult.Table0[0].massage, "bottom-left");
                            }
                            if (GetSucessResult.Table0[0].Allavilablepcsmsg != "") {
                                ShowMessage('info', 'Need your Kind Attention!', GetSucessResult.Table0[0].Allavilablepcsmsg, "bottom-left");
                            }
                            if (GetSucessResult.Table0[0].Pcsmassage != "") {
                                ShowMessage('info', 'Need your Kind Attention!', GetSucessResult.Table0[0].Pcsmassage, "bottom-left");
                            }


                            $("span#Origin").text(GetSucessResult.Table0[0].OriginCityName);
                            $("span#Destination").text(GetSucessResult.Table0[0].DestinationCityName);

                            $("span#Product").text(GetSucessResult.Table0[0].ProductName.toUpperCase());
                            $("span#Agent").text(GetSucessResult.Table0[0].Name.toUpperCase());

                            if (GetSucessResult.Table0[0].TotalPieces == GetSucessResult.Table2[0].PlnPcs) {
                                $("#Text_Pieces").val(GetSucessResult.Table0[0].TotalPieces);
                                Text_Pieces = GetSucessResult.Table0[0].TotalPieces;
                                $("#Text_GrWt").val(GetSucessResult.Table0[0].FOHGrossWeight);
                                Text_GrWt = GetSucessResult.Table0[0].FOHGrossWeight;
                                $("#Text_CBM").val(GetSucessResult.Table0[0].FOHCBM);
                                Text_CBM = GetSucessResult.Table0[0].FOHCBM;
                                $("#Text_VolWt").val(GetSucessResult.Table0[0].FOHVolumeWeight);
                                Text_VolWt = GetSucessResult.Table0[0].FOHVolumeWeight;
                            } else {
                                $("#Text_Pieces").val(GetSucessResult.Table2[0].PlnPcs);
                                Text_Pieces = GetSucessResult.Table2[0].PlnPcs;
                                $("#Text_GrWt").val(GetSucessResult.Table2[0].Avlgwt);
                                Text_GrWt = GetSucessResult.Table2[0].Avlgwt;
                                $("#Text_CBM").val(GetSucessResult.Table2[0].AvlCbm);
                                Text_CBM = GetSucessResult.Table2[0].AvlCbm;
                                $("#Text_VolWt").val(GetSucessResult.Table2[0].AvlVwt);
                                Text_VolWt = GetSucessResult.Table0[0].AvlVwt;
                            }



                            $("#Text_CustomRefNo").val(GetSucessResult.Table0[0].BOENo.toUpperCase());

                            $("span#NatureofGoods").text(GetSucessResult.Table0[0].CommodityDescription.toUpperCase());
                            $("span#SHC").text(GetSucessResult.Table0[0].SHC);

                            $("a#avipieces").text(GetSucessResult.Table0[0].TotalPiecesvalue);





                            if (GetSucessResult.Table1.length > 0) {


                                tbl += "<table  style='border-collapse:collapse;width:100%' border='1'  class='WebFormTable' >"
                                tbl += "<tr><td class='formSection' colspan='4'>Itinerary Information</td></tr>"
                                tbl += " <tr>"
                                tbl += "<td align='left' ><b>Board Point</b></td>"
                                tbl += "<td align='left' ><b>Off Point</b></td>"
                                tbl += "<td align='left'><b>Flight Date</b></td>"
                                tbl += "<td align='left'><b>Flight No.</b></td>"

                                tbl += "</tr>"


                                for (var i = 1; i <= GetSucessResult.Table1.length; i++) {



                                    tbl += "<tr>"
                                    tbl += "<td class='bc' >" + GetSucessResult.Table1[i - 1].OriginAirportName + "</td>"
                                    tbl += "<td class='bc'>" + GetSucessResult.Table1[i - 1].DestinationAirportName + "</td>"
                                    tbl += "<td class='bc'>" + GetSucessResult.Table1[i - 1].FlightDate + "</td>"
                                    tbl += "<td class='bc'>" + GetSucessResult.Table1[i - 1].FlightNo + "</td>"
                                    tbl += "</tr>"






                                }
                                tbl += "</table>"

                                $("#ItineryInfo").append(tbl);
                                tbl = "";





                                if (GetSucessResult.Table2.length > 0) {
                                    NopiecesDiv += '<table class="WebFormTable" border="0"><tbody>'
                                        + '<tr><td class="formHeaderLabel snowidth" id="trawbsno" name="trawbsno">AWBNo</td><td class="formHeaderLabel snowidth" id="trtotalpieces" name="trtotalpieces">Total Pieces</td><td class="formHeaderLabel snowidth" id="trli" name="trli">LI Piece</td><td class="formHeaderLabel snowidth" id="trbuildup" name="trbuildup">Buildup Piece</td><td class="formHeaderLabel snowidth" id="trpremanifest" name="trpermanifest">Pre Manifest Piece</td><td class="formHeaderLabel snowidth" id="trmanifest" name="trmanifest">Manifest Piece</td><td class="formHeaderLabel snowidth" id="trdepartpiece" name="trdepartpiece">Depart Piece</td><td class="formHeaderLabel snowidth" id="troffloaded" name="trOffloaded">Offloaded Piece</td></tr>'
                                    for (var i = 1; i <= GetSucessResult.Table2.length; i++) {
                                        NopiecesDiv += '<tr><td class="formHeaderLabel snowidth" id="trawbsno" name="trawbsno">' + $("#Text_AWBSNo").val() + '</td><td class="formHeaderLabel snowidth" id="trtotalpieces" name="trtotalpieces">' + GetSucessResult.Table2[i - 1].FOHPcs + '</td><td class="formHeaderLabel snowidth" id="trli" name="trli">' + GetSucessResult.Table2[i - 1].LIPcs + '</td><td class="formHeaderLabel snowidth" id="trbuildup" name="trbuildup">' + GetSucessResult.Table2[i - 1].BuildUpPcs + '</td><td class="formHeaderLabel snowidth" id="trpremanifest" name="trpermanifest">' + GetSucessResult.Table2[i - 1].PrePcs + '</td><td class="formHeaderLabel snowidth" id="trmanifest" name="trmanifest">' + GetSucessResult.Table2[i - 1].ManifestPcs + '</td><td class="formHeaderLabel snowidth" id="trdepartpiece" name="trdepartpiece">' + GetSucessResult.Table2[i - 1].DepPcs + '</td><td class="formHeaderLabel snowidth" id="troffloaded" name="trOffloaded">' + GetSucessResult.Table2[i - 1].OffloadPcs + '</td></tr>'
                                    }
                                    NopiecesDiv += '</tbody></table>'
                                    $("#DivpiecesDetails").append(NopiecesDiv);
                                    NopiecesDiv = "";
                                }




                            }




                        }
                        else {
                            ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                        }
                    }

                    else {
                        ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                    }
                }
            });
            //BindPaymentDetails();



        }
        else {
            $("#InfoDiv").hide();
        }

    }


    if (PageType == "READ") {
        AwbSno = getQueryStringValue("RecID").toUpperCase();
        $("#trsearch").hide();

        $(".btn-success").hide();
        $("span#Char").hide();
        $("#avipieces").hide();
        $("#trprint").show();
        $("#trawbinread").show();


        if (AwbSno != "") {
            $.ajax({
                url: "Services/Shipment/ReturntoShipperService.svc/GetReturntoShipperDataFormReturnShipper", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AwbSno: AwbSno }),
                success: function (result) {

                    var GetSucessResult = JSON.parse(result);
                    if (GetSucessResult != undefined) {
                        $("#InfoDiv").show();
                        if (GetSucessResult.Table0.length > 0) {

                            $("span#spnAwbread").text(GetSucessResult.Table0[0].AWBNo);
                            $("span#Origin").text(GetSucessResult.Table0[0].OriginCityName);
                            $("span#Destination").text(GetSucessResult.Table0[0].DestinationCityName);

                            $("span#Product").text(GetSucessResult.Table0[0].ProductName.toUpperCase());
                            $("span#Agent").text(GetSucessResult.Table0[0].Name.toUpperCase());
                            $("#Text_Pieces").val(GetSucessResult.Table0[0].Pieces);
                            $("#Text_GrWt").val(GetSucessResult.Table0[0].FOHGrossWeight);
                            $("#Text_CBM").val(GetSucessResult.Table0[0].FOHCBM);
                            $("#Text_VolWt").val(GetSucessResult.Table0[0].FOHVolumeWeight);

                            $("span#NatureofGoods").text(GetSucessResult.Table0[0].CommodityDescription.toUpperCase());
                            $("span#SHC").text(GetSucessResult.Table0[0].SHC);

                            $("a#avipieces").text(GetSucessResult.Table0[0].TotalPieces);



                            $("#Text_CustomRefNo").val(GetSucessResult.Table0[0].CustomRefNo.toUpperCase());
                            $("#Text_CustomRefNo").attr("disabled", "disabled");
                            $("#Text_NOCRefNo").val(GetSucessResult.Table0[0].NOCRefNo.toUpperCase());
                            $("#Text_NOCRefNo").attr("disabled", "disabled");
                            $("#Text_Reason").val(GetSucessResult.Table0[0].Reason.toUpperCase());
                            $("#Text_Reason").attr("disabled", "disabled");
                            $("#Text_TotalCharges").val(GetSucessResult.Table0[0].TotalCharges);
                            $("#Text_TotalCharges").attr("disabled", "disabled");



                            if (GetSucessResult.Table1.length > 0) {


                                tbl += "<table  style='border-collapse:collapse;width:100%' border='1'  class='WebFormTable' >"
                                tbl += "<tr><td class='formSection' colspan='4'>Itinerary Information</td></tr>"
                                tbl += " <tr>"
                                tbl += "<td align='left' ><b>Board Point</b></td>"
                                tbl += "<td align='left' ><b>Off Point</b></td>"
                                tbl += "<td align='left'><b>Flight Date</b></td>"
                                tbl += "<td align='left'><b>Flight No.</b></td>"

                                tbl += "</tr>"


                                for (var i = 1; i <= GetSucessResult.Table1.length; i++) {



                                    tbl += "<tr>"
                                    tbl += "<td class='bc' >" + GetSucessResult.Table1[i - 1].OriginAirportName + "</td>"
                                    tbl += "<td class='bc'>" + GetSucessResult.Table1[i - 1].DestinationAirportName + "</td>"
                                    tbl += "<td class='bc'>" + GetSucessResult.Table1[i - 1].FlightDate + "</td>"
                                    tbl += "<td class='bc'>" + GetSucessResult.Table1[i - 1].FlightNo + "</td>"
                                    tbl += "</tr>"






                                }
                                tbl += "</table>"

                                $("#ItineryInfo").append(tbl);
                                tbl = "";

                            }




                        }
                        else {
                            ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                        }
                    }

                    else {
                        ShowMessage('info', 'Need your Kind Attention!', "Data Not Found.", "bottom-left");
                    }
                }
            });
        }
        else {
            $("#InfoDiv").hide();
        }


    }



}


function FillGridData() {
    var $iframe = $('#iMasterFrame');
    if ($iframe.length) {
        $iframe.attr('src', 'Default.cshtml?Module=Shipment&Apps=ReturntoShipper&FormAction=INDEXVIEW');
        return false;
    }



}






$('#Text_AWBSNo').attr('tabindex', '1');
$('#btnSearch').attr('tabindex', '2');
$('#Text_Pieces').attr('tabindex', '3');
$('#Text_GrWt').attr('tabindex', '4');
$('#Text_VolWt').attr('tabindex', '5');
$('#Text_CustomRefNo').attr('tabindex', '6');
$('#Text_NOCRefNo').attr('tabindex', '7');
$('#Text_Reason').attr('tabindex', '8');
$(".btn btn-success").attr('tabindex', '9');
$('#btnBack').attr('tabindex', '10');

/*************************Added by devendra 10 JAN 2018************************************/
$('body').on('keydown', function (e) {
    var jqTarget = $(e.target); if (e.keyCode == 9) {
        var jqVisibleInputs = $(':input:visible'); var jqFirst = jqVisibleInputs.first();
        var jqLast = jqVisibleInputs.last(); if (!e.shiftKey && jqTarget.is(jqLast)) { e.preventDefault(); jqFirst.focus(); }
        else if (e.shiftKey && jqTarget.is(jqFirst)) { e.preventDefault(); jqLast.focus(); }
    }
});
