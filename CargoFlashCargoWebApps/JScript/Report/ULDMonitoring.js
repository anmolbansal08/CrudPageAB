$(document).ready(function () {
    SearchULDMonitoring();
});

function SearchULDMonitoring() {
    _CURR_PRO_ = "ULDMonitoring";
    _CURR_OP_ = "ULD Monitoring";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divULDMonitoringDetails").html("");

    $("#tblAwbULDLocation_btnAppendRow").live("click", function () {
        $("#tblAwbULDLocation_btnRemoveLast").show();
        GetTempreatureControlled();
    });

    $.ajax({
        url: "Services/Report/ULDMonitoringService.svc/GetWebForm/" + _CURR_PRO_ + "/Report/ULDMonitoring/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

          
            //---------------------- Transit Monitoring search ---------------------------//
            $("#btnSearch").bind("click", function () {
                ULDMonitoringSearch();
            });
        }
    });
}

function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });

    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });

    $("table[cfi-aria-search='search']").find("span").each(function () {
        var attr = $(this).attr('controltype');
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });

    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    });

    
    cfi.AutoCompleteV2("ULDNo", "ULDName", "ULDMonitoring_ULDNo", null, "contains");
    
    $("#Text_ULDNo").attr("placeholder", "ULD No");
   
}

//--------------------- Inbound flight search -----------------------//
function ULDMonitoringSearch() {

    $("#divULDMonitoringInformation").html("");
    $("#divULDMonitoringULDInformation").html("");

    var ULDNo = $("#ULDNo").val().trim();

    _CURR_PRO_ = "ULDMonitoringArrival";
    if (_CURR_PRO_ == "ULDMonitoringArrival") {
       
        cfi.ShowIndexView("divULDMonitoringDetails", "Services/Report/ULDMonitoringService.svc/GetULDArrivalShipmentGrid/" + _CURR_PRO_ + "/Report/ULDMontoringShipment/" + ULDNo);
    }
}



function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });

    $("#" + containerId).find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });

    $("#" + containerId).find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);

            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //else {
                    //    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //}
                }
            }
        }
    });

    SetDateRangeValue();

    //$("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    if ($(this).attr("recname") == undefined) {
    //        var controlId = $(this).attr("id");
    //        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //    }
    //});

    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });

    $("input[name='operation']").click(function () {
        _callBack();
    });

    $("[id$='divRemoveRecord']").hide();

    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            StopProgress();
            return true;
        }
        else {
            return false
        }
    });

    _callBack = function () {
        if ($.isFunction(window.MakeTransDetailsData)) {
            return MakeTransDetailsData();
        }
    }

    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }

    $(".removepopup").click(function () {
        $("#divRemovePanel").show();
        cfi.PopUp("divRemoveRecord", "");
    });

    $(".cancelpopup").click(function () {
        $("#divRemovePanel").hide();
        cfi.ClosePopUp("divRemoveRecord");
    });

   
}


var currentawbsno = 0;
var currentdetination = '';
var currArrivedShipmentSNo = 0;
var totalHandlingCharges = 0;
var pValue = 0;
var sValue = 0;
var MendatoryHandlingCharges = new Array();
function GatValueOfAutocomplete(valueId, value, keyId, key) {
    rowId = valueId.split("_")[2];
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            $.ajax({
                url: "Services/Report/DeliveryOrderService.svc/GetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currArrivedShipmentSNo) + "&DestinationCity=" + currentdetination + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0),
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").closest("td").find("input[id^='PValue']").val((sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").text(doItem.SecondryBasis);
                            $("span[id^='Amount']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id^='Remarks']").text(doItem.ChargeRemarks);
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                        }
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(doItem.TotalAmount);
                    }
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > -1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("PValue", "SValue")).val() : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("SValue", "PValue")).val() : 0;
    }
    if (tariffSNo == "" || tariffSNo == undefined) {
        alert("Please select Charges.");
    }
    else {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currArrivedShipmentSNo) + "&DestinationCity=" + currentdetination + "&PValue=" + parseInt(pValue) + "&SValue=" + parseInt(sValue),
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis']").text(doItem.SecondryBasis);
                        $("span[id^='Amount']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id^='Remarks']").text(doItem.ChargeRemarks);
                    }
                    else {
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                        $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                        $("span[id^='Remarks" + rowId + "']").text(doItem.ChargeRemarks);
                    }
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(doItem.TotalAmount);
                }
            }
        });
    }
}

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");

                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").text("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").text("");
                $("span[id^='Amount_" + rowId + "']").text("");
                $("span[id^='TotalTaxAmount" + rowId + "']").text("");
                $("span[id^='TotalAmount_" + rowId + "']").text("");
                $("span[id^='Remarks" + rowId + "']").text("");
                Flag = false;
            }
        }
    });
    return Flag;
}

function RebuildProcess(ffmShipmentTransSNo) {
    $.ajax({
        url: "Services/Import/TransitMonitoringService.svc/GetWebForm/TransitMonitoring/Import/ChargeNote/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail2").html(result);

            cfi.PopUp("divDetail2", "Rebuild Charges");
            $.ajax({
                url: "Services/Import/TransitMonitoringService.svc/GetRebuildCharges?ffmShipmentTransSNo=" + ffmShipmentTransSNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var sDetail = resData.Table0;
                    var hcData = resData.Table1;
                    currentawbsno = sDetail[0].AWBSNo;
                    currentdetination = sDetail[0].DestinationCity;
                    currArrivedShipmentSNo = sDetail[0].ArrivedShipmentSNo;
                    $("#divDetail2").append("</br><input id='btnPrint' type='button' value='Save' onclick='SaveRebuildCharges();'> &nbsp; <input id='btnPrint' type='button' value='Cancel' onclick='ClosePopUp();'>");

                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffHeadName, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondryBasis == undefined ? "" : i.SecondryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                                totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                            }
                        });
                    }

                    cfi.makeTrans("divareaTrans_import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                        });

                        $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });
                        });

                        //$("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        //    $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                        //    $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    if (MendatoryHandlingCharges.length - 1 == i) {
                        //        $(this).find("div[id^='transActionDiv']").show();
                        //        if (MendatoryHandlingCharges.length > 1)
                        //            $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                        //    }
                        //});
                    }
                    else {
                        $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffHeadName", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });
                        });

                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='Type']").text("E");
                            $(this).find("input[id^='WaveOff']").hide();
                        });
                    }
                }
            });
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function GatValueOfAutocomplete(valueId, value, keyId, key) {
    rowId = valueId.split("_")[2];
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            if ($("input[id^='Text_HAWB']").length > 0) {
                var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
            }
            else
                var hawbSNo = 0;
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currentArrivedShipmentSNo) + "&DestinationCity=" + currentdetination + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo,
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").text(doItem.SecondryBasis);
                            $("span[id^='Amount']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id^='Remarks']").text(doItem.ChargeRemarks);
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                    });
                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;

    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
        $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
            filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
            dataSource: dataSource,
            filterField: basedOn,
            separator: (separator == undefined ? null : separator),
            dataTextField: autoCompleteText,
            dataValueField: autoCompleteKey,
            valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
            template: '<span>#: TemplateColumn #</span>',
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            newAllowed: newAllowed,
            confirmOnAdd: confirmOnAdd
        });
    }
}

var dourl = 'Services/AutoCompleteService.svc/WMSFBLAutoCompleteDataSource';
function GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? dourl : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    chWt: chWt,
                    cityChangeFlag: cityChangeFlag
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

function SaveRebuildCharges() {
    var flag = false;
    var HandlingChargeArray = [];
    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentawbsno,
                WaveOff: $(this).find("[id^='WaveOff']").prop('checked') == true ? 1 : 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("[id^='Amount']").val() == "" ? 0 : $(this).find("[id^='Amount']").val()),
                TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("[id^='TotalAmount']").text(),
                Rate: $(this).find("[id^='Amount']").text(),
                Min: 1,
                Mode: $("[id^='CustomerType']").prop('checked') == true ? "CASH" : "CREDIT",
                //  ChargeTo: $("#Text_BillTo").data("kendoAutoComplete").key(),
                ChargeTo: 0,
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']").val()
            };
            HandlingChargeArray.push(HandlingChargeViewModel);
        }
    });

    if (HandlingChargeArray.length > 0) {
        $.ajax({
            url: "Services/Import/TransitMonitoringService.svc/SaveRebuildProcess", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DestCity: currentdetination, lstHandlingCharges: HandlingChargeArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "") {
                    //InvoiceNo = result;
                    //ShowMessage('success', 'Success - Charge Note', "DO No. [" + curDO + "] -  Processed Successfully", "bottom-right");
                    ShowMessage('success', 'Success - Rebuild Process', "Processed Successfully", "bottom-right");
                    //$("#btnSave").unbind("click");
                    //$(".ui-dialog-buttonset").find("button")[1].disabled = false;
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning', "Please correct value(s) for :- " + result + ".", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Rebuild Process', "unable to process.", "bottom-right");
            }
        });
    }
    else {
        alert("Select Charges First");
    }
    return flag;
}

function ClosePopUp() { }

function ULDAppendProcess(dbTableName, transSNO) {
    var dbCaption = '';
    var columnsValue = '';
    var tableColumnsValue = '';
    if ($("#tbl" + dbTableName).length === 0)
        $("#divAfterContent").html("<table id='tbl" + dbTableName + "'></table>");
    if (dbTableName == 'FAULDLocation') {
        dbCaption = 'ULD Location';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: true,
            tableColumns: 'SNo,ULDNo,BUP,ReturnTo,Location,Airline',
            masterTableSNo: transSNO,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: dbCaption,
            initRows: 1,
            columns: [
               { name: 'SNo', type: 'hidden', value: 0 },
               { name: 'FFMFlightMasterSNo', type: 'hidden' },
               { name: 'FFMShipmentTransSNo', type: 'hidden' },
               { name: 'ULDNo', type: 'hidden' },
               { name: 'ULDNo', display: 'ULD No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
               { name: 'BUP', type: 'hidden' },
               { name: 'BUP', display: 'BUP', type: 'label' },
               {
                   name: 'ReturnTo', display: 'Return To', type: 'select', ctrlOptions: { 'Airline': 'Airline', 'SAS': 'SAS' }, onChange: function (evt, rowIndex) {
                       if ($("#tblFAULDLocation_ReturnTo_1 option:selected").val() == 'SAS') {
                           $("input[id*='tblFAULDLocation_Airline_1']").removeAttr("required").css("cursor", "not-allowed");
                           $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(false);
                       }
                       else {
                           $("input[id*='tblFAULDLocation_Airline_1']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                           $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(true);
                           $("#tblFAULDLocation_Airline_1").focus();
                       }
                   }, ctrlCss: { width: '100px' }, isRequired: true
               },
               { name: 'Location', display: 'Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ULD_Location', filterField: 'LocationName' },
                { name: 'Airline', display: 'Select Airline', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ULD_Location_Airline', filterField: 'AirlineName' }
            ],
            rowUpdateExtraFunction: function (id) {
                $("select[id^='tblFAULDLocation_ReturnTo_1']").each(function (i, el) {
                    if ($("#tblFAULDLocation_ReturnTo_1 option:selected").val() == 'SAS') {
                        $("input[id*='tblFAULDLocation_Airline_1']").removeAttr("required").css("cursor", "not-allowed");
                        $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(false);
                    }
                    else {
                        $("input[id*='tblFAULDLocation_Airline_1']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                        $("#tblFAULDLocation_Airline_1").data("kendoAutoComplete").enable(true);
                        $("#tblFAULDLocation_Airline_1").focus();
                    }
                });
            },
            hideButtons: { updateAll: false, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });
    }
    else if (dbTableName == 'ULDXray') {
        dbCaption = 'X-ray';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,StartPieces,EndPieces',
            masterTableSNo: transSNO,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'GetULDXrayRecord',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdateULDXray',
            deleteServiceMethod: 'deleteULDXray',
            caption: dbCaption,
            initRows: 1,
            columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'ULDNo', type: 'hidden' },
            { name: 'ULDNo', display: 'ULD No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
            { name: 'Pieces', display: 'Total Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true },
            { name: 'GrossWT', display: 'Total Gr. WT', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal2" }, ctrlCss: { width: '90px' }, isRequired: true },
            { name: 'VolumeWT', display: 'Total Vol. WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true }
            ],
            hideButtons: { updateAll: false, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });
    }
    else if (dbTableName == 'ReBuild') {
        //dbCaption = 'Service Charges Information';
        //$('#tbl' + dbTableName).appendGrid({
        //    tableID: 'tbl' + dbTableName,
        //    contentEditable: true,
        //    tableColumns: 'SNo,AWBNo,StartPieces,EndPieces',
        //    masterTableSNo: transSNO,
        //    currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        //    servicePath: './Services/Import/TransitMonitoringService.svc',
        //    getRecordServiceMethod: 'GetReBuildRecord',
        //    isGetRecord: true,
        //    createUpdateServiceMethod: 'createUpdateReBuild',
        //    deleteServiceMethod: 'deleteReBuild',
        //    caption: dbCaption,
        //    initRows: 1,
        //    columns: [
        //    { name: 'SNo', type: 'hidden', value: 0 },
        //    { name: 'ServiceName', display: 'Service Name', type: 'text', ctrlCss: { 'text-transform': 'uppercase', width: '120px' }, ctrlAttr: { maxlength: 10, Controltype: 'alphanumericupper' }, isRequired: true },
        //    { name: 'PrimaryValue', display: 'Primary Value', type: 'text', ctrlCss: { 'text-transform': 'uppercase', width: '120px' }, ctrlAttr: { maxlength: 10, Controltype: 'alphanumericupper' }, isRequired: true },
        //    { name: 'SecondaryValue', display: 'Secondary Value', type: 'text', ctrlCss: { 'text-transform': 'uppercase', width: '120px' }, ctrlAttr: { maxlength: 10, Controltype: 'alphanumericupper' }, isRequired: true },
        //    ],
        //    hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: true },
        //    isPaging: true
        //});
    }
    else {
        dbCaption = '';
        tableColumnsValue = '';
        columnsValue = '';
    }

    cfi.PopUp("tbl" + dbTableName, dbCaption, 800, null, null, 100);
    if ($("#tblReBuildRecord").length === 0) {
        $("#tblReBuild").before("<div><table id='tblReBuildRecord' style='width:100%;'><tr><td colspan='5' class='formSection'>Re-Build</<td></tr><tr><td >ULD No: <span style='font-weight:bold;'>AKE12345PC</span></td><td>Total Pieces: <span style='font-weight:bold;'>5</span></td><td>Total Gr. WT: <span style='font-weight:bold;'>5</span></td></td><td>Total Vol. WT: <span style='font-weight:bold;'>5</span></td></td></tr></table></div>");
    }
}

//------------- AWB Locaton -------------------//
function GetAWBULDLocation(awbSNo, obj) {
    var arvShipmentSNo = $(obj).closest("tr").find("td:eq(5)").text();
    var dbAwbTableName = 'AwbULDLocation';
    if (arvShipmentSNo == '0' || awbSNo == '0') {
        ShowMessage('warning', 'Warning - ULD Location', "Shipment not arrived.");
        return;
    }
    AWBAppendProcess(dbAwbTableName, arvShipmentSNo, awbSNo);
    //GetTempreatureControlled();
    $("#tblAwbULDLocation_AssignLocation_1").focus();
    if ($('#tblAwbULDLocation tr').index() == 1)
        $("#tblAwbULDLocation_btnRemoveLast").hide();
    else
        $("#tblAwbULDLocation_btnRemoveLast").show();
}

//------------- AWB XRay process -------------------//
function GetAWBXray(awbSNo, obj) {
    var dbAwbTableName = 'AWBXray';
    AWBAppendProcess(dbAwbTableName, 0, awbSNo);
}

function GetTerminate(awbSNo, obj) {
    var dbTableName = 'Terminate';
    AWBAppendProcess(dbTableName, 0, awbSNo);
}

function CheckMovableLocation(obj) {
    if ($(obj).val() != "") {
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val("0");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").focus();
    }
}

//------------- AWB Locaton and Damage process -------------------//
function AWBAppendProcess(dbAwbTableName, arrivedShipmentSNo, awbSNo) {
    var dbAWBCaption = '';
    var columnsAWBValue = '';
    var tableAWBColumnsValue = '';
    $("#tbl" + dbAwbTableName).remove();
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divAfterContent").html("<table id='tbl" + dbAwbTableName + "'></table>");
    }
    if (dbAwbTableName == 'AwbULDLocation') {
        dbAWBCaption = 'AWB Location';
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,RcvdPieces,RcvdGrossWeight,StartPieces,EndPieces,MovableLocation,AssignLocation,TempControlled,StartTemperature,EndTemperature',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbAwbTableName,
            deleteServiceMethod: 'delete' + dbAwbTableName,
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: false },
            columns: [
               { name: 'SNo', type: 'hidden', value: 0 },
               { name: 'AWBSNo', type: 'hidden' },
               { name: 'ArrivedShipmentSNo', type: 'hidden' },
               { name: 'HdnAWBNo', type: 'hidden' },
               { name: 'HdnRcvdPieces', type: 'hidden' },
               { name: 'HdnRcvdGrossWeight', type: 'hidden' },
               { name: 'AWBNo', display: 'AWB No', type: 'label' },
               { name: 'RcvdPieces', display: 'Rcvd Pieces', type: 'label' },
               { name: 'RcvdGrossWeight', display: 'Rcvd Gr.WT', type: 'label' },
               { name: 'StartPieces', display: 'Start Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '100px' }, isRequired: true },
               { name: 'EndPieces', display: 'End Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '100px' }, isRequired: true },
               { name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '140px', height: '20px' }, AutoCompleteName: 'ULD_MovableLocation', filterField: 'ConsumablesName' },
               { name: 'AssignLocation', display: 'Assign Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'ULD_LocationName', filterField: 'LocationName' },
                {
                    name: 'TempControlled', display: 'Temp Controlled', type: 'text', value: "1", type: 'select', onChange: function (evt, rowIndex) {
                        //var ind = evt.target.id.split('_')[2];
                        if ($("#" + evt.target.id + " option:checked").val() == 1) {
                            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        }
                        else {
                            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
                            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
                        }

                    }, ctrlOptions: { '0': 'Yes', '1': 'No' }, ctrlCss: { width: '50px', height: '20px' }
                },
               { divRowNo: 1, name: 'StartTemperature', display: 'Start Temp.', type: 'text', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true },
               {
                   divRowNo: 1, name: 'EndTemperature', display: 'End Temp.', type: 'text', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
               }
            ],
            rowUpdateExtraFunction: function (id) {
                $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                    var ind = $(this).attr('id').split('_')[2];
                    $("#tblAwbULDLocation_StartTemperature_" + ind).closest("table").find("td").removeClass("ui-widget-content");
                    if ($("#tblAwbULDLocation_TempControlled_" + ind + " option:checked").val() == 1) {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    } else {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");;
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_StartTemperature_" + ind).val());
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_EndTemperature_" + ind).val());
                    }
                });
            },
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {
                $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
                    $(this).closest("table").find("td").removeClass("ui-widget-content");
                });
            }
        });
    }
    else if (dbAwbTableName == 'AWBXray') {
        dbAWBCaption = "X-ray";
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,ArrivedShipmentSNo,AWBNo,Pieces,GrossWT,VolumeWT',
            masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'GetAWBXrayRecord',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdateAWBXray',
            deleteServiceMethod: 'deleteAWBXray',
            caption: dbAWBCaption,
            initRows: 1,
            hideButtons: { updateAll: false, append: false, insert: true, remove: true, removeLast: false },
            columns: [
                       { name: 'SNo', type: 'hidden', value: 0 },
                       { name: 'AWBSNo', type: 'hidden' },
                       { name: 'ArrivedShipmentSNo', type: 'hidden' },
                       { name: 'AWBNo', display: 'AWB No', type: 'label' },
                       { name: 'AWBNo', type: 'hidden' },
                       { name: 'Pieces', display: 'Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true },
                       { name: 'GrossWT', display: 'Gr. WT', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal2" }, ctrlCss: { width: '90px' }, isRequired: true },
                       { name: 'VolumeWT', display: 'Vol. WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true }
            ],
            isPaging: true,
        });
    }
    else if (dbAwbTableName == 'Terminate') {
        dbAWBCaption = 'Terminate';
        $('#tbl' + dbAwbTableName).appendGrid({
            tableID: 'tbl' + dbAwbTableName,
            contentEditable: true,
            tableColumns: 'SNo,AWBNo,Origin,Destination,Routing,Pieces,GrossWT,VolumeWT,FlightNo,FlightDate,ConnFlightNo,ConnFlightDate,TerminateAt',
            masterTableSNo: awbSNo,
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Import/TransitMonitoringService.svc',
            getRecordServiceMethod: 'GetReBuildRecord',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdateReBuild',
            deleteServiceMethod: 'deleteReBuild',
            caption: dbAWBCaption,
            initRows: 1,
            columns: [
                    { name: 'SNo', type: 'hidden', value: 0 },
                    { name: 'AWBNo', type: 'hidden' },
                    { name: 'AWBNo', display: 'AWB No', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                    { name: 'Origin', display: 'Origin', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                    { name: 'Destination', display: 'Destination', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                    { name: 'Routing', display: 'Routing', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                    { name: 'Pieces', display: 'Total Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true },
                    { name: 'GrossWT', display: 'Total Gr. WT', type: 'text', ctrlAttr: { maxlength: 10, controltype: "decimal2" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'VolumeWT', display: 'Total Vol. WT', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true },
                    { name: 'FlightNo', display: 'FlightNo', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                    { name: 'FlightDate', display: 'FlightDate', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                    { name: 'ConnFlightNo', display: 'ConnFlightNo', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
                    { name: 'TerminateAt', display: 'TerminateAt', type: 'label', ctrlCss: { 'text-transform': 'uppercase' } },
            ],
            hideButtons: { updateAll: false, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });
    }
    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, 1200, null, null, 100);
}

function GetTempreatureControlled() {
    $("#tblAwbULDLocation").find("input[id^='tblAwbULDLocation_AssignLocation']").each(function () {
        var ind = this.id.split('_')[2];
        $("#tblAwbULDLocation_AWBNo_" + ind).text($("#tblAwbULDLocation_AWBNo_1").text());
        $("#tblAwbULDLocation_RcvdPieces_" + ind).text($("#tblAwbULDLocation_RcvdPieces_1").text());
        $("#tblAwbULDLocation_RcvdGrossWeight_" + ind).text($("#tblAwbULDLocation_RcvdGrossWeight_1").text());
        $("#tblAwbULDLocation_ArrivedShipmentSNo_" + ind).val($("#tblAwbULDLocation_ArrivedShipmentSNo_1").val());
        $("#tblAwbULDLocation_AWBSNo_" + ind).val($("#tblAwbULDLocation_AWBSNo_1").val());

        $("#tblAwbULDLocation_HdnAWBNo_" + ind).val($("#tblAwbULDLocation_AWBNo_1").text());
        $("#tblAwbULDLocation_HdnRcvdPieces_" + ind).val($("#tblAwbULDLocation_RcvdPieces_1").text());
        $("#tblAwbULDLocation_HdnRcvdGrossWeight_" + ind).val($("#tblAwbULDLocation_RcvdGrossWeight_1").text());

        if ($("#tblAwbULDLocation_TempControlled_" + ind + " option:checked").val() == 1) {
            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
        }
        else {
            $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
            $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
            $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
            $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
        }
    });
}

function CheckFAStartEndPieces(obj) {
    var cValue = $(obj).val();
    var startPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val());
    var endPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val());

    if (startPieces > endPieces) {
        $(obj).val('');
        ShowMessage("warning", "", "Start Pieces can not be greater than End Pieces");
    }
}

function CheckFATempratureStartEnd(obj) {
    var startVal = parseInt($(obj).closest("table").find("input[id^='tblAwbULDLocation_StartTemperature']").val());
    var endVal = parseInt($(obj).closest("table").find("input[id^='tblAwbULDLocation_EndTemperature']").val());
    if (startVal > endVal) {
        $(obj).val('');
        ShowMessage("warning", "", "End temperature should be greater than start temperature.");
    }
}

//-------------- Div content for Transit Monitoring --------------------------//
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divTransitMonitoringDetails' style='width:100%'></div><div id='divDetail2'></div></td></tr></table></div>";
