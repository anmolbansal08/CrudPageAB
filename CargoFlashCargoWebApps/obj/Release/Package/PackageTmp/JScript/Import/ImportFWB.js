function ShowProcessDetailsNew(subprocess, divID, isdblclick, subprocesssno) {
    //if ($("#" + divID).html() != "") {

    //    $("div[id$='divareaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function (row, tr) {
    //        $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
    //    });
    //    $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function (row, tr) {
    //        $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
    //        $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
    //    });

    //    return
    //}
    debugger;
    if (subprocess == "RATE") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divDetailSHC').html('');
                $('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");

                $('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                $('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                $('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");
                $("#divDetailSHC").append(result);
                if (result != undefined || result != "") {

                    //$('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");

                    //$('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                    //$('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                    //$('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");


                    GetProcessSequence("ImportFWB");
                    InitializePage(subprocess, divID, isdblclick, subprocesssno);
                }
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

    else {

        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetWebForm/" + _CURR_PRO_ + "/ImportFWB/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#" + divID).html(result);
                if (result != undefined || result != "") {
                    //GetProcessSequence("ACCEPTANCE");
                    InitializePage(subprocess, divID, isdblclick, subprocesssno);
                }
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
}

function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno) {
    //$("#tblShipmentInfo").show();
    debugger;
    InstantiateControl(cntrlid);
    $("#trAmmendment").hide();

    if (subprocess.toUpperCase() == "CUSTOMER") {
        BindCustomerInfo();
        UserSubProcessRights("divTab3", subprocesssno);
        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
        } else {
            $("#trAmmendment").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(3);
                        ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "RATE") {
        BindDimensionEventsNew();
        BindDimensionEventsNewULD();
        BindAWBOtherCharge();
        BindAWBRate();
        if ($("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").length <= 0) {
            SetAWBDefaultValues();
        }
        CalculateRateTotal();
        UserSubProcessRights("divDetailSHC", subprocesssno);
        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
        } else {
            $("#trAmmendment").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                        ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
        BindAWBSummary(isdblclick);
        UserSubProcessRights("divTab5", subprocesssno);
        $("#btnSaveToNext").hide();
        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
        } else {
            $("#trAmmendment").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
                        ShowProcessDetailsNew("RESERVATION", "divDetail", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        BindHandlingInfoDetails();
        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
        } else {
            $("#trAmmendment").hide();
        }
        $("#btnSave").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(4);
                        ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        return false;

    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        BindReservationSection();
        UserSubProcessRights("divDetail", subprocesssno);
        if (userContext.SpecialRights.FWBA == true && IsFWbComplete) {
            $("#trAmmendment").show();
        } else {
            $("#trAmmendment").hide();
        }

        $("#btnSave").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_importfwb_fwbshipmentitinerary']").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "") {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "0";
                    if (SaveFormData(subprocess)) {
                        ShipmentSearch();
                        CleanUI();
                    }

                } else {
                    return false;
                }
            } else {
                if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                    if (cfi.IsValidSection(cntrlid)) {
                        isSaveAndNext = "0";
                        if (SaveFormData(subprocess)) {
                            ShipmentSearch();
                            CleanUI();
                        }

                    } else {
                        return false;
                    }
                } else {
                    if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                        ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                    else
                        ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
                }
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_importfwb_fwbshipmentitinerary']").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "" > 0) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "1";
                    if (SaveFormData(subprocess)) {
                        //ShipmentSearch();
                        //CleanUI();
                        $('#tabstrip ul:first li:eq(1) a').click();
                    }

                } else {
                    return false;
                }
            } else {
                if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                    if (cfi.IsValidSection(cntrlid)) {
                        isSaveAndNext = "1";
                        if (SaveFormData(subprocess)) {
                            FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                            FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                            $("#divDetailSHC").html("");
                            //ReloadSameGridPage("RATE");
                            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
                            ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
                        }

                    } else {
                        return false;
                    }
                } else {
                    if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                        ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                    else
                        ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
                }
            }

        });
        return false;
    }
}
function getNonObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getNonObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function ResetFBLCharge(textId, textValue, keyId, keyValue) {

    if (ValidateExistingCharges(textId, textValue, keyId, keyValue)) {

        $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function () {

            if (textId == $(this).find("input[id^='Text_ChargeName']").attr("id")) {
                if (keyValue == "") {
                    $(this).find("input[id^='Amount']").val("0");
                    $(this).find("span[id^='TotalAmount']").html("");
                    $(this).find("input[id^='TotalAmount']").val("");
                }
                else {
                    var obj = $(this);
                    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];

                    var paymentList = paymentData.Table0;

                    var NonMendatory = getNonObjects(paymentData.Table0, 'TariffSNo', keyValue);

                    obj.find("input[id^='Amount']").val(NonMendatory[0].ChargeAmount);
                    obj.find("input[id^='_tempAmount']").val(NonMendatory[0].ChargeAmount);
                    var totalAmount = parseFloat(NonMendatory[0].ChargeAmount).toFixed(3);
                    obj.find("span[id^='TotalAmount']").html(totalAmount);
                    obj.find("input[id^='TotalAmount']").val(totalAmount);
                    obj.find("input[id^='Remarks']").val(NonMendatory[0].ChargeRemarks.replace('<Br>', '').replace('<Br>', ''));
                    obj.find("input[id^='rate']").val(NonMendatory[0].Rate);
                    obj.find("input[id^='min']").val(NonMendatory[0].Min);
                    obj.find("input[id^='totaltaxamount']").val(NonMendatory[0].TotalTaxAmount);
                    if (NonMendatory[0].TotalTaxAmount != "2") {
                        obj.closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').css("display", "none");
                    }
                }
            }
        });
    }
    CalculateTotalFBLAmount();
}

function CalculateFBLAmount(obj) {
    var a = "";
    var chargeName = $(obj).closest("tr").find("[id^='ChargeName']");
    var chargeText = $(obj).closest("tr").find("[id^='Text_ChargeName']").attr("id");
    var chargeKey = $("#" + chargeText).data("kendoAutoComplete").key();
    for (var i = 0; i < paymentList.length; i++) {
        if (paymentList[i].TariffSNo == chargeKey) {
            //var gst = parseFloat(paymentList[i].GSTPercentage);
            //var totalAmount = parseFloat($(obj).val()) + (parseFloat($(obj).val()) * gst) / 100;
            var totalAmount = parseFloat($(obj).val());
            if ((isNaN(totalAmount))) {
                totalAmount = '0';
            }
            totalAmount = parseFloat(totalAmount).toFixed(3);
            $(obj).closest("tr").find("span[id^='TotalAmount']").html(totalAmount.toString());
            $(obj).closest("tr").find("input[id^='TotalAmount']").val(totalAmount.toString());

        }
    }
    CalculateTotalFBLAmount();
}

function CalculateTotalFBLAmount() {
    //var totalFBLAmount = 0;
    //$("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function () {
    //    $(this).find("input[id^='TotalAmount']").each(function () {
    //        if (!isNaN(parseFloat($(this).val())))
    //            totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
    //    });
    //});
    //totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    //$("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    //$("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());

    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {

                    totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else { }

            }

        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
    }
}


function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });
    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });
    $(elem).find("input[id^='CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}
function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_fwbshipmentocitrans']").find("[id^='areaTrans_importfwb_fwbshipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}
function BindHandlingInfoDetails() {
    cfi.AutoComplete("CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("InfoType", "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    cfi.AutoComplete("CSControlInfoIdentifire", "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetOSIInfoAndHandlingMessage?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var osiData = jQuery.parseJSON(result);
            var osiInfo = osiData.Table0;
            var handlingArray = osiData.Table1;
            var osiTransInfo = osiData.Table2;
            var ocitransInfo = osiData.Table3;
            cfi.makeTrans("importfwb_fwbshipmentositrans", null, null, null, null, null, osiTransInfo, 2);//added by Manoj Kumar
            cfi.makeTrans("importfwb_fwbshipmentocitrans", null, null, BindCountryCodeAutoComplete, ReBindCountryCodeAutoComplete, null, ocitransInfo);
            if (ocitransInfo.length > 0) {
                $("div[id$='divareaTrans_importfwb_fwbshipmentocitrans']").find("[id='areaTrans_importfwb_fwbshipmentocitrans']").each(function () {
                    $(this).find("input[id^='CountryCode']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
                    });

                    $(this).find("input[id^='InfoType']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
                    });

                    $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
                    });
                });
            }
        },
        error: {

        }
    });
}

function BindCustomerInfo() {

    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("SHIPPER_Name", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "v_ShipperConsignee", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("CONSIGNEE_AccountNoName", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("Notify_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("Notify_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    $("#SHIPPER_MobileNo").css("text-align", "left");
    $("#_tempSHIPPER_MobileNo").css("text-align", "left");
    $("#CONSIGNEE_MobileNo").css("text-align", "left");
    $("#_tempCONSIGNEE_MobileNo").css("text-align", "left");
    $("#Notify_MobileNo").css("text-align", "left");
    $("#_tempNotify_MobileNo").css("text-align", "left");
    $("#Notify_Fax").css("text-align", "left");
    $("#_tempNotify_Fax").css("text-align", "left");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetShipperAndConsigneeInformation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var customerData = jQuery.parseJSON(result);
            var shipperData = customerData.Table0;
            var consigneeData = customerData.Table1;
            var agentData = customerData.Table2;
            var notifyData = customerData.Table3;
            var nominyData = customerData.Table4;

            if (shipperData.length > 0) {
                $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                if (shipperData[0].ShipperAccountNo != "") {
                    // $("#Text_SHIPPER_AccountNo").prop('disabled', true);
                    $("#chkSHIPPER_AccountNo").closest('td').hide();
                }

                //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperName, shipperData[0].ShipperName);
                $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                $("#SHIPPER_State").val(shipperData[0].ShipperState);
                $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);

                $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);

                $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);

                $("#SHipper_Fax").val(shipperData[0].Fax);
                $("#_tempSHipper_Fax").val(shipperData[0].Fax);
            }
            if (consigneeData.length > 0) {
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                if (consigneeData[0].ConsigneeAccountNo != "") {
                    // $("#Text_CONSIGNEE_AccountNo").prop('disabled', true);
                    $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                }

                //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeName, consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
            }
            if (agentData.length > 0) {
                $('#AGENT_AccountNo').val(agentData[0].AccountNo.toUpperCase());
                $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo.toUpperCase());
                $('#AGENT_Participant').val(agentData[0].Participant.toUpperCase());
                $('span[id=AGENT_Participant]').text(agentData[0].Participant.toUpperCase());
                $('#AGENT_IATACODE').val(agentData[0].IATANo.toUpperCase());
                $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo.toUpperCase());
                $('#AGENT_Name').val(agentData[0].AgentName.toUpperCase());
                $('span[id=AGENT_Name]').text(agentData[0].AgentName.toUpperCase());
                $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress.toUpperCase());
                $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress.toUpperCase());
                $('#AGENT_PLACE').val(agentData[0].Location.toUpperCase());
                $('span[id=AGENT_PLACE]').text(agentData[0].Location.toUpperCase());
            }
            if (notifyData.length > 0) {
                $("#Notify_Name").val(notifyData[0].CustomerName),
                $("#Text_Notify_CountryCode").data("kendoAutoComplete").setDefaultValue(notifyData[0].CountrySno, notifyData[0].CountryCode + '-' + notifyData[0].CountryName);
                $("#Text_Notify_City").data("kendoAutoComplete").setDefaultValue(notifyData[0].CitySno, notifyData[0].CityCode + '-' + notifyData[0].CityName);
                $("#Notify_MobileNo").val(notifyData[0].Phone);
                $("#_tempNotify_MobileNo").val(notifyData[0].Phone);
                $("#Notify_Address").val(notifyData[0].Location);
                $("#Notify_State").val(notifyData[0].State);
                $("#Notify_Place").val(notifyData[0].Street);
                $("#Notify_PostalCode").val(notifyData[0].PostalCode);
                $("#Notify_Fax").val(notifyData[0].Fax);
                $("#_tempNotify_Fax").val(notifyData[0].Fax);
            }
            if (nominyData.length > 0) {
                $('#Nominate_Name').val(nominyData[0].NOMName);
                $('#Nominate_Place').val(nominyData[0].NOMPlace);
            }
        },
        error: {

        }
    });

}


function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {

        $.ajax({
            url: "Services/Shipment/FWBService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperName, shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                    }
                    else if (UserTyp == "C") {
                        CONSIGNEE_AccountNoName
                        //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeName, shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        //$("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#SHIPPER_Email").val('');
                    }
                    else if (UserTyp == "C") {
                        //$("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_Email").val('');
                    }
                }

            },
            error: {

            }
        });
    }

}
function CalculatePayment(obj) {
    MarkSelected(obj);

    var totalFBLAmount = 0;
    var TotalCreditAmount = 0;
    $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function (i, row) {
        $(row).find("input[id^='TotalAmount']").each(function () {
            if (!isNaN(parseFloat($(this).val()))) {
                if ($(row).find("input[id^='chkCash']").prop('checked') == true) {
                    totalFBLAmount = totalFBLAmount + parseFloat($(this).val());
                }
                else if ($(row).find("input[id^='chkCredit']").prop('checked') == true) {
                    TotalCreditAmount = TotalCreditAmount + parseFloat($(this).val());
                }
                else {
                }
            }
        });
    });
    totalFBLAmount = parseFloat(totalFBLAmount).toFixed(3);
    TotalCreditAmount = parseFloat(TotalCreditAmount).toFixed(3);
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='FBLAmount']").html(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='FBLAmount']").val(totalFBLAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("span[id='CrediAmount']").html(TotalCreditAmount.toString());
    $("#divareaTrans_importfwb_shipmenthandlingchargeinfo").next("table").find("input[id='CrediAmount']").val(TotalCreditAmount.toString());

    $("#CashAmount").val(totalFBLAmount);
    $("#_tempCashAmount").val(totalFBLAmount);
    if (parseFloat($("#CashAmount").val()) <= 0) {
        $("#CashAmount").removeAttr('data-valid');
    }

}
function BindHandlingChargeAutoComplete(elem, mainElem) {
    var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
    $(elem).find("input[id^='ChargeName']").each(function () {
        //AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "WMSFBLHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");       
        AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
    });
    $(elem).find("input[id^='BillTo']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
        $("#Text_" + $(this).attr("name")).data("kendoAutoComplete").setDefaultValue(BillTo[0]["Key"], BillTo[0]["Text"]);
    });
    //$(elem).find("input[id^='BillTo']").closest('td').find('span').css("display", "block");
    $(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');
    $(elem).find('td:eq(7)').css("display", "none");
    $(elem).find('td:eq(8)').css("display", "none");
    $(elem).find('td:eq(9)').css("display", "none");
    $(elem).find("input[id^='chkCash']").prop('checked', true)
    $(elem).find("input[id^='Amount']").each(function () {
        $(this).unbind("blur").bind("blur", function () {
            CalculateFBLAmount(this);
        });
    });

}


function ReBindHandlingChargeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function () {
        var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
        $(this).find("input[id^='ChargeName']").each(function () {
            AutoCompleteForFBLHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, ResetFBLCharge, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, origin, 2, "", "2", "999999999", "No");
        });
        if ($(this).closest('tr').find("input[id^='BillTo']").closest('td').find('span:first').attr('style') != "display: none;") {
            $(this).find("input[id^='BillTo']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), BillTo, SetChargeValues);
            });
        }

        //$(elem).find("input[id^='BillTo']").closest('td').find('span').removeAttr('style');

        $(this).find("input[id^='Text_BillTo']").closest('span').css('width', '');
        $(this).find("input[id^='Text_ChargeName']").closest('span').css('width', '');
        $(this).find("input[id^='Amount']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                CalculateFBLAmount(this);
            });
        });
    });
    if ($(elem).find("td[id^='tdSNoCol']").html() == MendatoryPaymentCharges.length) {
        $(elem).find("td[id^=transAction]").find("i[title=Delete]").remove();

    }

    CalculateTotalFBLAmount();
}
function SetChargeValues(textId, textValue, keyId, keyValue) {
    var chkCash = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCash]");
    var chkCredit = $('#' + textId).closest('tr').find("input[type=radio][id^=chkCredit]");

    if (keyValue == "0") {
        MarkSelected(chkCash);
        chkCash.attr('disabled', false);
    } else {
        MarkSelected(chkCredit);
        chkCash.attr('disabled', true);
    }
    CalculateTotalFBLAmount();
}
function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_importfwb_shipmenthandlingchargeinfo']").find("[id^='areaTrans_importfwb_shipmenthandlingchargeinfo']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");
                $("#" + textId).closest('tr').find("input[id^='Amount']").val("0");
                $("#" + textId).closest('tr').find("input[id^='_tempAmount']").val("0");
                $("#" + textId).closest('tr').find("span[id^='TotalAmount']").html("");
                $("#" + textId).closest('tr').find("input[id^='TotalAmount']").val("");
                Flag = false;
            }
        }
    });
    return Flag;
}
function BindEDox() {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtAWBEDox?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            var alldocrcvd = edoxData.Table1;

            var docRcvd = false;
            if (alldocrcvd.length > 0) {
                var docItem = alldocrcvd[0];
                docRcvd = docItem.IsAllEDoxRecieved.toLowerCase() == "true" ? true : false;
                // $("#XRay").prop("checked", docRcvd == "true" ? true : false);
                $("#XRay").prop("checked", docRcvd);
                //$("#XRay").val(resItem.XrayRequired);
                $("#Remarks").val(docItem.AllEDoxReceivedRemarks);
            }

            cfi.makeTrans("importfwb_shipmentedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray);
            if (!docRcvd) {
                $("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("[id='areaTrans_importfwb_shipmentedoxinfo']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
                    });
                    $(this).find("input[id^='DocsName']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                    $(this).find("a[id^='ahref_DocName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                });
            }
            else {
                var prevtr = $("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("tr[id='areaTrans_importfwb_shipmentedoxinfo']").prev()
                prevtr.find("td:eq(2)").remove();
                prevtr.find("td:last").remove();
                $("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("tr[id^='areaTrans_importfwb_shipmentedoxinfo']").each(function () {
                    $(this).find("td:eq(2)").remove();
                    $(this).find("td:last").remove();
                })

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
            }
        },
        error: {

        }
    });
}

function BindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='DocType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, null, "contains");
    });
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentedoxinfo']").find("[id^='areaTrans_importfwb_shipmentedoxinfo']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

function UploadEDoxDocument(objId, nexctrlid) {

    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }
    $.ajax({
        url: "Handler/FileUploadHandler.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#eDox#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#eDox#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });

}

function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "Handler/FileUploadHandler.ashx?l=e-Dox&f=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function BindBankAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='BankName']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "BankName", "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"], null, "contains");
    });
}

function ReBindBankAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentaddcheque']").find("[id^='areaTrans_importfwb_shipmentaddcheque']").each(function () {
        $(this).find("input[id^='BankName']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "bankmaster", "SNo", "BankName", ["ShortCode", "BankName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}
var tblhtml;
function BindReservationSection() {
    cfi.AutoComplete("Product", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    cfi.AutoComplete("Commodity", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityCode", "CommodityDescription"], null, "contains");
    cfi.AutoComplete("ShipmentOrigin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("ShipmentDestination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");

    // cfi.AutoComplete("IssuingAgent", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
    cfi.AutoComplete("SpecialHandlingCode", "CODE", "SPHC", "SNO", "CODE@", ["CODE", "Description"], null, "contains", ",", null, null, null, GetDGRDetails, true);
    cfi.AutoComplete("buptype", "Description", "buptype", "SNO", "Description", "", null, "contains");
    cfi.AutoComplete("densitygroup", "GroupName", "CommodityDensityGroup", "SNO", "GroupName", "", null, "contains");
    cfi.AutoComplete("SubGroupCommodity", "SubGroupName", "vw_Commodity_CommoditySubGroup", "SubGroupSNo", "SubGroupName", "", null, "contains");
    cfi.AutoComplete("CarrierCode", "CarrierCode", "airline", "SNo", "CarrierCode", "", null, "contains");

    $("#AWBDate").data("kendoDatePicker").value(new Date());

    $('#AWBDate').prop('readonly', true);
    $('#AWBDate').parent().css('width', '100px');
    $('#chkFWBAmmendMent').prop('checked', false);
    //$("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
    //    cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "SPHC");
    //});
    //$("#NoofHouse").attr('readonly', 'true');
    tblhtml = $("div[id$='areaTrans_shipment_shipmentclasssphc']").find("table").html();
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetIFWBInformation?AWBSNo=" + awbSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            var sphcArray = fblData.Table2;
            var itenData = fblData.Table1;
            var sphcArray2 = fblData.Table3;
            var HasDGRArray = fblData.Table4;
            ItenaryArray = itenData;

            IsFWbComplete = fblData.Table5[0].Status == "True" ? true : false;
            IsFWBAmmendment = fblData.Table6[0].IsEnabled == "True" ? true : false;
            IsFlightExist = fblData.Table7[0].FlightExist == "1" ? true : false;
            var resItem;
            if (resData.length > 0) {
                resItem = resData[0];
                //changes by manish
                $("#Text_CarrierCode").closest('span').hide();
                //                $("#Text_CarrierCode").data("kendoAutoComplete").setDefaultValue(resItem.AirlineSNo, resItem.CarrierCode);
                $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySNo, resItem.CommodityCode == "" ? "" : resItem.CommodityCode + '-' + resItem.CommodityDescription);
                $("#Text_SubGroupCommodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySubGroupSNo, resItem.SubGroupName);
                //$("#Pieces").data("kendoNumericTextBox").value(resItem.Pieces);
                $("#Pieces").val(resItem.Pieces);
                $("#_tempPieces").val(resItem.Pieces);
                $("#ConsigneeMobileNo").val(resItem.ConsigneeMobileNo);

                //$("span[id='TotalPartPieces']").text("/ " + resItem.TotalPartPieces);
                //$("#TotalPartPieces").text("/ " + resItem.TotalPartPieces);
                //$("#GrossWt").data("kendoNumericTextBox").value(resItem.GrossWeight);
                $("#GrossWt").val(resItem.GrossWeight);
                $("#_tempGrossWt").val(resItem.GrossWeight);

                //$("#ChargeableWt").data("kendoNumericTextBox").value(resItem.ChargeableWeight);
                $("#ChargeableWt").val(resItem.ChargeableWeight);
                $("#_tempChargeableWt").val(resItem.ChargeableWeight);
                //$("#CBM").data("kendoNumericTextBox").value(resItem.CBM);
                $("#CBM").val(resItem.CBM);
                $("#_tempCBM").val(resItem.CBM);

                //$("#VolumeWt").data("kendoNumericTextBox").value(parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#VolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#_tempVolumeWt").val(parseFloat(resItem.VolumeWeight || "0").toFixed(3));

                $("span[id='VolumeWt']").html(parseFloat(resItem.VolumeWeight || "0").toFixed(3));
                $("#AWBNo").val(resItem.AWBNo);
                $("#AWBDate").data("kendoDatePicker").value(resItem.AWBDate);
                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(resItem.ProductSNo, resItem.ProductName);
                //$("#Text_IssuingAgent").data("kendoAutoComplete").setDefaultValue(resItem.AgentBranchSNo, resItem.AgentName);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue(resItem.DestinationCity, resItem.DestinationCityName);
                $("#NoofHouse").val(resItem.NoOfHouse);
                $("#FlightDate").data("kendoDatePicker").value(resItem.FlightDate);
                $("#X-RayRequired[value='" + resItem.XRayRequired + "']").prop('checked', true);
                $("#FreightType[value='" + resItem.FreightType + "']").prop('checked', true);
                $("#NatureofGoods").val(resItem.NatureOfGoods);
                $("#IssuingAgent").val(resItem.AgentName);
                $('#AWBDate').parent().css('width', '100px');

                if (resItem.IsBup == "False") {
                    $("#chkisBup").prop('checked', false);
                } else {
                    $("#chkisBup").prop('checked', true);
                }
                $("#Text_buptype").data("kendoAutoComplete").setDefaultValue(resItem.BupTypeSNo, resItem.BupType);
                $("#Text_densitygroup").data("kendoAutoComplete").setDefaultValue(resItem.DensityGroupSNo, resItem.DensityGroupName);

                $("#AWBNo").attr("disabled", "disabled");

                bkdgrwt = resItem.GrossWeight;
                bkdvolwt = resItem.CBM;
                bkdpcs = resItem.Pieces;

                if (sphcArray2.length > 0) {
                    if (sphcArray2[0].sphcsno != "0" && sphcArray2[0].sphcsno != "") {
                        cfi.BindMultiValue("SpecialHandlingCode", sphcArray2[0].text_specialhandlingcode, sphcArray2[0].sphcsno)
                        $("#SpecialHandlingCode").val(sphcArray2[0].sphcsno);
                    }
                }

                $("input[id='GrossWt']").unbind("blur").bind("blur", function () {

                });

                $("input[id='CBM']").unbind("blur").bind("blur", function () {
                    compareVolValue("V", this, accvolwt, resItem.VolumeWeight);
                });

            }

            $("div[id=divareaTrans_importfwb_fwbshipmentclasssphc]").not(':first').remove();
            //-- Add seprate Save Button for DGR Detials
            $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc'] table >tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');
            $("#btnSaveDGR").unbind("click").bind("click", function () {
                SaveDGRDetails();
            });

            // get val for autocomplete from dgr array to bind SPHC autocomp-lete
            if (HasDGRArray.length > 0) {
                DGRSPHC = [];
                for (i = 0; i < HasDGRArray.length; i++) {
                    var info = {
                        Key: HasDGRArray[i].SNo,
                        Text: HasDGRArray[i].Code
                    };
                    DGRSPHC.push(info);
                }
            }

            cfi.makeTrans("importfwb_fwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, sphcArray, 8);
            $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
                $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
                cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
                $(this).find("input[id^='SPHC']").each(function () {
                    cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
                });
                $(this).find("input[id^='UnNo']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
                    }
                });
                $(this).find("input[id^='ShippingName']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
                    }
                });
                $(this).find("input[id^='Class']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
                    }
                });
                $(this).find("input[id^='SubRisk']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
                });
                $(this).find("input[id^='PackingGroup']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
                    }
                });
                $(this).find("input[id^='Unit']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
                    }
                });
                $(this).find("input[id^='PackingInst']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
                    }
                });
                $(this).find("input[id^='ERG']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
                    }
                });

                $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
            });

            if (HasDGRArray.length > 0) {
                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "DGR Details", 1400);
                });
                $("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });
            }

            cfi.makeTrans("importfwb_fwbshipmentitinerary", null, null, BindItenAutoComplete, ReBindItenAutoComplete, null, itenData);
            $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {

                $(this).find("input[id^='BoardPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='offPoint']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='FlightNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], ValidateFlight, "contains");
                });
                var ctrlID = $(this).find("input[id^='FlightDate']").attr("id");
                $(this).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight(ctrlID) });
            });

            $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
            $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
            if (itenData.length <= 0) {
                if (resData.length > 0 && resItem != undefined) {
                    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id='areaTrans_importfwb_fwbshipmentitinerary']").first().find("input[id^=Text_BoardPoint]").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id='areaTrans_importfwb_fwbshipmentitinerary']").first().find("input[id^=Text_offPoint]").data("kendoAutoComplete").setDefaultValue(resItem.RoutingSNo, resItem.RoutingCityCode);
                }
            }
            $("input[id='Pieces']").unbind("blur").bind("blur", function () {
                //comparePcsValue(this);
            });

            $("#ChargeableWt").unbind("blur").bind("blur", function () {
                compareGrossVolValue();
            });

            $("#GrossWt").unbind("blur").bind("blur", function () {
                //if (compareGrossValue(this))
                CalculateShipmentChWt(this);
            });
            $("#CBM").unbind("blur").bind("blur", function () {
                //if (compareVolValue(this))                
                CalculateShipmentChWt(this);
            });

            $("#VolumeWt").unbind("blur").bind("blur", function () {
                //if (compareVolValue(this))
                CalculateShipmentCBM();
            });

            $("#GrossWt").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#VolumeWt").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#ChargeableWt").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CBM").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#AWBNo").unbind("keyup").bind("keyup", function () {
                if ($(this).val().length == 3) {
                    $(this).val($(this).val() + "-");
                }
            });
            $("#Text_CarrierCode").closest('span').css('width', '50px');
            if (resData.length <= 0) {
                $("div[id=divareaTrans_importfwb_fwbshipmentitinerary]").find("tr[id='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='FlightDate']").data("kendoDatePicker").value("");
            }
            if (userContext.SpecialRights.DGR == true) {
                $("a[id^='ahref_ClassDetails']").show();
            } else {
                $("a[id^='ahref_ClassDetails']").hide();
            }
        },
        error: {

        }
    });
}


function CheckIsAWBUsable() {
    if ($('#AWBNo').val() != "") {
        $.ajax({
            url: "Services/Shipment/FWBService.svc/CheckIsAWBUsable?AWBNo=" + $('#AWBNo').val(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = JSON.parse(result);
                var isValid = data.Table;
                if (isValid[0].MSG != "") {
                    jAlert(isValid[0].MSG, "Warning - FWB");
                    $('#AWBNo').val('');
                }

            },
            error: {
            }
        });
    }
}

function GetDGRDetails(e) {
    if ($("#divMultiSpecialHandlingCode").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    } else {
        GetDGRDetailsBySHC(($("#Multi_SpecialHandlingCode").val() == "" ? "" : $("#Multi_SpecialHandlingCode").val() + ",") + this.dataItem(e.item.index()).Key);
    }
}
function GetDGRDetailsAfterDelete(obj) {
    GetDGRDetailsBySHC($("#Multi_SpecialHandlingCode").val());
    var GDRRemainingData = [];

    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {

        //if ($(obj).attr("id") == $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key()) {
        //    $(this).remove();
        //}
        if ($(obj).attr("id") != $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key()) {
            var DGRInfo = {
                sphc: $(this).find("input[type=hidden][id^='SPHC']").val(),
                text_sphc: $(this).find("input[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                unno: $(this).find("input[type=hidden][id^='UnNo']").val(),
                text_unno: $(this).find("input[id^='Text_UnNo']").data("kendoAutoComplete").value(),
                shippingname: $(this).find("input[type=hidden][id^='ShippingName']").val(),
                text_shippingname: $(this).find("input[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                class: $(this).find("input[type=hidden][id^='Class']").val(),
                text_class: $(this).find("input[type=hidden][id^='Class']").val(),
                subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
                text_subrisk: $(this).find("input[type=hidden][id^='SubRisk']").val(),
                packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),
                text_packinggroup: $(this).find("input[type=hidden][id^='PackingGroup']").val(),

                dgrpieces: $(this).find("[id^='DGRPieces']").val(),
                netquantity: $(this).find("[id^='NetQuantity']").val(),
                unit: $(this).find("input[type=hidden][id^='Unit']").val(),
                text_unit: $(this).find("input[type=hidden][id^='Unit']").val(),
                quantity: $(this).find("[id^='Quantity']").val(),

                packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
                text_packinginst: $(this).find("input[type=hidden][id^='PackingInst']").val(),
                ramcat: $(this).find("[id^='RamCat']").val(),

                erg: $(this).find("input[type=hidden][id^='ERG']").val(),
                text_erg: $(this).find("input[type=hidden][id^='ERG']").val(),

            };
            GDRRemainingData.push(DGRInfo);
        }

    });

    $("div[id=divareaTrans_importfwb_fwbshipmentclasssphc]").not(':first').remove();
    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("tbody").remove();
    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").append(tblhtml);

    cfi.makeTrans("importfwb_fwbshipmentclasssphc", null, null, BindSPHCTransAutoComplete, ReBindSPHCTransAutoComplete, null, GDRRemainingData);
    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
        $(this).find("input[id^='SPHC']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
        });
        $(this).find("input[id^='UnNo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='ShippingName']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        });
        $(this).find("input[id^='PackingGroup']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
        });
        $(this).find("input[id^='Unit']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
        });
        $(this).find("input[id^='PackingInst']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        });
        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');

    });
}
function GetDGRDetailsBySHC(SPHCSNos) {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetDGRInfo?SPHCSNo=" + SPHCSNos, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var DGRData = jQuery.parseJSON(result);
            var SPHCDGR = DGRData.Table;

            DGRSPHC = [];
            for (i = 0; i < SPHCDGR.length; i++) {
                var info = {
                    Key: SPHCDGR[i].SNo,
                    Text: SPHCDGR[i].Code
                };
                DGRSPHC.push(info);
            }
            if (DGRSPHC.length > 0) {
                $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
                    $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
                    $(this).find("input[id^='SPHC']").each(function () {
                        cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
                    });
                    $(this).find("input[id^='UnNo']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
                    });
                    $(this).find("input[id^='ShippingName']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
                    });
                    $(this).find("input[id^='Class']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
                    });
                    $(this).find("input[id^='SubRisk']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
                    });
                    $(this).find("input[id^='PackingGroup']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
                    });
                    $(this).find("input[id^='Unit']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
                    });
                    $(this).find("input[id^='PackingInst']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
                    });
                    $(this).find("input[id^='ERG']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
                    });
                    $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')

                });

                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "DGR Details", 1300);
                    // Use this to unbing click event of DGR when delete shc for future
                    $("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });
                });
            } else {
                $("a[id^='ahref_ClassDetails']").unbind("click");
            }

        },
        error: {

        }
    });
}

function GetQty(obj) {
    $(obj).closest('tr').find("input[id^='Quantity']").val((parseInt($(obj).closest('tr').find("input[id^='DGRPieces']").val() || "0") * parseFloat($(obj).closest('tr').find("input[id^='NetQuantity']").val() || "0")).toFixed(2));
}
function ResetDGROtherDetails(e) {
    if ($("#" + e).data("kendoAutoComplete") != undefined && $("#" + e).data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Shipment/AcceptanceService.svc/GetDGRInfoByID?SNo=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var DGRData = jQuery.parseJSON(result);
                var DGRDetail = DGRData.Table;

                if (DGRDetail.length > 0) {
                    var currentRow = $("#" + e).closest('tr');
                    if (e.indexOf("Text_UnNo") >= 0) {
                        currentRow.find("input[id^='Text_ShippingName']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["ColumnSearch"]);
                    } else if (e == "Text_ShippingName") {
                        currentRow.find("input[id^='Text_UnNo']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ID"], DGRDetail[0]["UNNumber"]);
                    }
                    currentRow.find("input[id^='Text_Class']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ClassDivSub"], DGRDetail[0]["ClassDivSub"]);
                    currentRow.find("input[id^='Text_SubRisk']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["SubRisk"], DGRDetail[0]["SubRisk"]);
                    currentRow.find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingGroup"], DGRDetail[0]["PackingGroup"]);
                    currentRow.find("input[id^='Text_Unit']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["Unit"], DGRDetail[0]["Unit"]);
                    currentRow.find("input[id^='Text_PackingInst']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["PackingInst"], DGRDetail[0]["PackingInst"]);
                    currentRow.find("input[id^='Text_ERG']").data("kendoAutoComplete").setDefaultValue(DGRDetail[0]["ERGN"], DGRDetail[0]["ERGN"]);
                }

            },
            error: {

            }
        });
    }
    $("#" + e).closest('tr').find("input:not([id*='_SPHC']").each(function () {
        if ($("#" + e).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key() != "" && $("#" + e).closest('tr').find("input[id^='Text_ShippingName']").data("kendoAutoComplete").key() != "") {
            if ($(this).attr('id').indexOf('UnNo') == -1) {
                $(this).val('');
            }
        }
    });
}

function SaveDGRDetails() {
    var DGRArray = [];
    $("div[id$='divareaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
        if (DGRSPHC.length > 0) {
            var DGRViewModel = {
                SPHCSNo: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").key(),
                SPHCCode: $(this).find("[id^='Text_SPHC']").data("kendoAutoComplete").value(),
                DGRSNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").key(),
                UNNo: $(this).find("[id^='Text_UnNo']").data("kendoAutoComplete").value(),
                DGRShipperSNo: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").key(),
                ProperShippingName: $(this).find("[id^='Text_ShippingName']").data("kendoAutoComplete").value(),
                Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                SubRisk: $(this).find("[id^='Text_SubRisk']").data("kendoAutoComplete").key(),
                PackingGroup: $(this).find("[id^='Text_PackingGroup']").data("kendoAutoComplete").key(),
                Pieces: $(this).find("[id^='DGRPieces']").val(),
                NetQuantity: $(this).find("[id^='NetQuantity']").val(),
                Unit: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                Quantity: $(this).find("[id^='Quantity']").val(),
                PackingInst: $(this).find("[id^='Text_PackingInst']").data("kendoAutoComplete").key(),
                RAMCategory: $(this).find("[id^='RamCat']").val(),
                ERGN: $(this).find("[id^='Text_ERG']").data("kendoAutoComplete").key(),
            };
            DGRArray.push(DGRViewModel);
        }
    });

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/SaveDGRDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, AWBDGRTrans: DGRArray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - DGR', " DGR Details Saved Successfully", "bottom-right");

            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - DGR [' + awbNo + ']', result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DGR', "unable to process.", "bottom-right");

        }
    });

}

function compareGrossVolValue() {
    var gw = $("#GrossWt").val();
    var vw = $("#VolumeWt").val();
    var cw = $("#ChargeableWt").val();
    var chwt = gw > vw ? gw : vw;

    if (parseFloat($("#ChargeableWt").val() == "" ? "0" : $("#ChargeableWt").val()) < chwt) {
        $("#ChargeableWt").val(chwt);
        $("#_tempChargeableWt").val(chwt);
    }
}

function comparePcsValue(obj) {
    var value = $(obj).val();
    if (parseFloat(value) < parseFloat(accpcs)) {
        $(obj).val(bkdpcs);
        ShowMessage('warning', 'Information!', "Entered Pieces cannot be less than Accepted Pieces. Accepted Pieces : " + bkdpcs.toString() + ".", "bottom-right");
    }
}

function compareGrossValue(obj) {
    if (parseFloat(accgrwt) > 0) {
        var flag = false;
        var value = $(obj).val();
        if (parseFloat(value) < parseFloat(accgrwt)) {
            $(obj).val(bkdgrwt);
            ShowMessage('warning', 'Information!', "Entered Gross weight cannot be less than accepted Gross weight. Accepted gross weight : " + bkdgrwt.toString() + ".", "bottom-right");
            flag = true;
        }
        return flag;
    } else
        return true;
}

function compareVolValue(obj) {
    var flag = true;
    var cbm = ($(obj).val() == "" ? 0 : parseFloat($(obj).val()));
    var volwt = cbm * 166.6667;
    if (parseFloat(volwt) < parseFloat(accvolwt)) {
        $(obj).val(bkdvolwt);
        ShowMessage('warning', 'Information!', "Entered Volume weight cannot be less than accepted Volume weight. Accepted volume weight : " + bkdvolwt.toString() + ".", "bottom-right");
        flag = false;
    }
    return flag;
}

function CalculateShipmentChWt(obj) {

    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));

    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.6667;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='VolumeWt']").text(volwt.toFixed(3));// Hmishra
        // $("input[id='VolumeWt']").val(volwt.toFixed(3));// Hmishra
        $("#VolumeWt").val(volwt.toFixed(3));// Hmishra
        $("#_tempVolumeWt").val(volwt.toFixed(3));// Hmishra
    }
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toFixed(3).toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
}


function CalculateShipmentCBM() {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var volwt = ($("#VolumeWt").val() == "" ? 0 : parseFloat($("#VolumeWt").val()));
    var cbm = (volwt / 166.6667).toFixed(3);
    $("#CBM").val(cbm.toString());
    $("#_tempCBM").val(cbm.toString());
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
}

function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}
function ISNumericNew(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 6)) {
        event.preventDefault();
    }
}
function ISNumber(obj) {
    if ($.inArray(event.keyCode, [8, 9, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]) !== -1 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
    } else {
        event.preventDefault();
    }
}

function BindItenAutoComplete(elem, mainElem) {
    var totalRow = $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").length;
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 != totalRow) {
            $(this).find("div[id^='transActionDiv']").hide();
        }

        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], ValidateFlight, "contains");
            }
        });

    });

    $(elem).find("input[id^='BoardPoint']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
        $("input[id^='BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());
        $("input[id^='Text_BoardPoint_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1)) + "']").val($("input[id^='Text_offPoint" + (($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1) == -1 ? "" : "_" + ($(elem).attr('id').substr($(elem).attr('id').length - 1, 1) - 1)) + "']").val());

    });

    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").value("");
    $(elem).find("[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
    // diable previous row controles
    $(elem).prev().find("[id^='Text_BoardPoint']").data("kendoAutoComplete").enable(false);
    $(elem).prev().find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(false);
    $(elem).prev().find("[id^='FlightDate']").data("kendoDatePicker").enable(false);
    $(elem).prev().find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(false);

    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
}

function ResetSelectedFlight(obj) {
    if ($("#" + obj).attr("recname") == "Text_BoardPoint") {
        $("#" + obj).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
    } else if ($("#" + obj).attr("recname") == "Text_offPoint") {
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
    } else {
        $("#" + obj).closest('tr').find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
        if (parseInt($("#" + obj).closest('tr').find("td[id^='tdSNoCol']").text() || "0") > 1) {
            if (Date.parse($("#" + obj).closest('tr').find("input[id^='FlightDate']").attr("sqldatevalue")) < Date.parse($("#" + obj).closest('tr').prev().find("input[id^='FlightDate']").attr("sqldatevalue"))) {
                $("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value("");
            }
        }
        if ($("#" + obj).closest('tr').find("[id^='FlightDate']").data("kendoDatePicker").value() || "" != "") {
            $("#" + obj).closest('tr').find("[id^='Text_FlightNo']").attr("data-valid", "required");
        } else {
            $("#" + obj).closest('tr').find("[id^='Text_FlightNo']").removeAttr("data-valid");
        }
    }
}

function ReBindItenAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {
        //$(this).find("input[id^='BoardPoint']").each(function () {
        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        //});
        //$(this).find("input[id^='offPoint']").each(function () {
        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"]);
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        //});

        //$(this).find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").options.addOnFunction = ResetSelectedFlight;
        //$(this).find("input[id^='Text_offPoint']").data("kendoAutoComplete").options.addOnFunction = ResetSelectedFlight;

        //$(this).find("input[id^='FlightNo']").each(function () {
        //    var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"]);
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        //});
        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoComplete($(this).attr("name"), "FlightNo", "v_DailyFlight", "SNO", "FlightNo", ["FlightNo"], ValidateFlight, "contains");
            }
        });
    });
    $(elem).find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(true);
    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").enable(true);
    $(elem).find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(true);
    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });

    var totalRow = $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").length;
    $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 == totalRow) {
            $(this).find("div[id^='transActionDiv']").show();
        }
    });
}

function BindSPHCAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SpecialHandlingCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], null, "contains");
    });
    $(elem).find("a[id^='ahref_ClassDetails']").each(function () {
        $(this).unbind("click").bind("click", function () {
            cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "SPHC Trans");
        });
    });
}

function ReBindSPHCAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentsphc']").find("[id^='areaTrans_importfwb_shipmentsphc']").each(function () {
        $(this).find("input[id^='SPHC']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "SPHC", "SNO", "CODE", ["CODE", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("a[id^='ahref_ClassDetails']").each(function () {
            $(this).unbind("click").bind("click", function () {
                cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "SPHC Trans");
            });
        });
    });
}

function BindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Quantity']").attr("disabled", "disabled");
    cfi.Numeric($(elem).find("input[id^='NetQuantity']").attr("id"), 2);
    $(elem).find("input[id^='SPHC']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
        }
        else {
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
        }
    });
    $(elem).find("input[id^='UnNo']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
        }
    });
    $(elem).find("input[id^='ShippingName']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
        }
    });
    $(elem).find("input[id^='Class']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        }
    });
    $(elem).find("input[id^='SubRisk']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        }
    });
    $(elem).find("input[id^='PackingGroup']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
        }
    });
    $(elem).find("input[id^='Unit']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
        }
    });
    $(elem).find("input[id^='PackingInst']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
        }
    });
    $(elem).find("input[id^='ERG']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        }
    });
    $(elem).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
}

function ReBindSPHCTransAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
        $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
        cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
        $(this).find("input[id^='SPHC']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
            }
            else {
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), DGRSPHC);
            }
        });
        $(this).find("input[id^='UnNo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "UNNumber", "DGR", "ID", "UNNumber", ["UNNumber"], ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='ShippingName']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ColumnSearch", "DGR", "ID", "ColumnSearch", ["ColumnSearch"], ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ClassDivSub", "DGR", "ClassDivSub", "ClassDivSub", ["ClassDivSub"], null, "contains");
        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
        });
        $(this).find("input[id^='PackingGroup']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingGroup", "DGR", "PackingGroup", "PackingGroup", ["PackingGroup"], null, "contains");
        });
        $(this).find("input[id^='Unit']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Unit", "DGR", "Unit", "Unit", ["Unit"], null, "contains");
        });
        $(this).find("input[id^='PackingInst']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "PackingInst", "DGR", "PackingInst", "PackingInst", ["PackingInst"], null, "contains");
        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "ERGN", "DGR", "ERGN", "ERGN", ["ERGN"], null, "contains");
        });
        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')
    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
    });
}

function removeHandlingMessage(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmenthandlinginfo']").find("[id^='areaTrans_importfwb_shipmenthandlinginfo']").each(function () {
        $(this).find("input[id^='Type']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "HandlingMessageType", "SNo", "MessageType", ["MessageType"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function ValidateFlight(obj) {
    var CurrentRow = $("#" + obj).closest('tr');
    var CurrentRowNo = $("#" + obj).closest('tr').find("td[id^='tdSNoCol']").text();
    var FlightSNo = $("#" + obj).data("kendoAutoComplete").key();
    $.ajax({
        url: "Services/Import/ImportFWBService.svc/ValidateFlight?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var FlightData = Data.Table0;

            if (FlightData.length > 0) {
                if (FlightData[0].FlightStatus == "B") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert("AWB already Build Up. Flight amendment restricted.", "Warning - Flight No.");
                            $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " ");
                        }
                    } else {
                        jAlert("AWB already Build Up. Flight amendment restricted.", "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
                else if (FlightData[0].FlightStatus == "P") {
                    if (ItenaryArray.length > 0) {
                        if (FlightSNo != ItenaryArray[CurrentRowNo - 1].flightno) {
                            jAlert("AWB already planned in Loading Instructions. Kindly contact your supervisor in case you want to amend Flight Details.", "Warning - Flight No.");
                            $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue(ItenaryArray[CurrentRowNo - 1].flightno, ItenaryArray[CurrentRowNo - 1].text_flightno + " ");
                        }
                    } else {
                        jAlert("AWB already planned in Loading Instructions. Kindly contact your supervisor in case you want to amend Flight Details.", "Warning - Flight No.");
                        $(CurrentRow).find("input[id^='Text_FlightNo']").data("kendoAutoComplete").setDefaultValue("", "");
                    }
                }
            }
        }
    });

}

function ValidatePieces(obj) {

    var elem = $("#areaTrans_importfwb_shipmentdimension");
    var Pcs = 0;
    var balancePc = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        balancePc = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });

    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find($(obj).closest("tr")).index() - 1;

    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");
        CalculateVolume(elem);
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = balancePc;
        return false;
    }
    CalculateVolume(elem);
    return true;
}

function CalculateVolume(elem, obj) {
    elem = $("#areaTrans_importfwb_shipmentdimension");
    var divisor = 1;
    if ($("#Unit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;

    //elem.closest("div").find("input[id^='Pieces']").each(function () {
    //    var currentId = $(this).attr("id");
    //    var PieceID = currentId;
    //    var LengthID = currentId.replace("Pieces", "Length");
    //    var WidthID = currentId.replace("Pieces", "Width");
    //    var HeightID = currentId.replace("Pieces", "Height");
    //    var VolumeID = currentId.replace("Pieces", "VolumeWt");
    //    var currentVolume = 0;
    //    if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
    //        currentVolume = parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val()) * parseFloat($("#" + LengthID).val() == "" ? "0" : $("#" + LengthID).val()) * parseFloat($("#" + WidthID).val() == "" ? "0" : $("#" + WidthID).val()) * parseFloat($("#" + HeightID).val() == "" ? "0" : $("#" + HeightID).val());
    //        var volWeight = Math.ceil(currentVolume / divisor);
    //        volWeight = (volWeight < 1 ? 1 : volWeight);
    //        VolumeCalculation = VolumeCalculation + volWeight;
    //        $("span[id='" + VolumeID + "']").html(volWeight);
    //        $("input[id='" + VolumeID + "']").val(volWeight);
    //    }
    //});
    elem.closest("div").find("table > tbody").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function () {
        //var currentId = $(this).attr("id");
        //var PieceID = currentId;

        var Width = $(this).find("input[id^='Width']").val() == "" ? "0" : $(this).find("input[id^='Width']").val();
        var Length = $(this).find("input[id^='Length']").val() == "" ? "0" : $(this).find("input[id^='Length']").val();
        var Height = $(this).find("input[id^='Height']").val() == "" ? "0" : $(this).find("input[id^='Height']").val();
        var Pieces = $(this).find("input[id^='Pieces']").val() == "" ? "0" : $(this).find("input[id^='Pieces']").val();

        var currentVolume = 0;
        if (Pieces != "" && Pieces != undefined) {
            currentVolume = parseFloat(Pieces) * parseFloat(Length) * parseFloat(Width) * parseFloat(Height);
            //var volWeight = Math.ceil(currentVolume / divisor);
            var volWeight = (currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);
            VolumeCalculation = parseFloat(VolumeCalculation) + parseFloat(volWeight.toFixed(3));
            $(this).find("span[id^='VolumeWt']").html(volWeight.toFixed(3));
            $(this).find("input[id^='VolumeWt']").val(volWeight.toFixed(3));
        }
    });

    if (VolumeCalculation != 0) {
        $("span[id='DimVolumeWt']").html(VolumeCalculation.toFixed(3));
        $("input[id='DimVolumeWt']").val(VolumeCalculation.toFixed(3));
    }
    else {
        $("span[id='DimVolumeWt']").html(0);
        $("input[id='DimVolumeWt']").val(0);
    }
}

function checkonRemove(elem) {
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    //if (elem.closest("table").find("[id^='Pieces']").length < 2)
    $('.disablechk').removeAttr('disabled');
    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = false;
    $(elem).find("td[id^=transAction]").find("i[title='Add More']").hide();
    //fn_RemoveRow(elem);
    CalculateVolume(elem);

}

function beforeAddEventCallback(elem) {
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value);
    });
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");

        CalculateVolume(elem);
        return false;
    }

    if (Pcs == parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "Pieces already added.", "bottom-right");
        return false;
    }

    //$(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = true;

    return true;
}


function beforeAddULDEventCallback(elem) {
    var Pcs = 0;
    elem.closest("table").find("[id^='Text_ULDNo']").each(function () {
        Pcs = Pcs + 1;
    });
    var ManualPcs = 0;

    $("#divareaTrans_importfwb_shipmentdimension").find('table:eq(0) > tbody').find("tr[data-popup='false']").each(function (row, i) {
        ManualPcs = $(i).find("td:nth-child(5) input[type=text]").val();
    });
    ManualPcs = ManualPcs == "" ? "0" : ManualPcs;
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='ULDNo']").length - 1;
    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='UldTareWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldPieces']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldGrossWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='ULDPivotWt']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='UldVolWt']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");

        CalculateVolume(elem);
        return false;
    }
    //if (parseInt(Pcs) + 1 == parseInt($("#TotalPieces").val()) && parseInt(ManualPcs) == 0) {
    //    $("#divareaTrans_importfwb_shipmentdimension").find('table:eq(0) > tbody').find("tr[data-popup='false']").each(function (row, i) {
    //        $(i).find("input[type=text]").removeAttr('data-valid');
    //    });
    //}
    if (parseInt(Pcs) + parseInt(ManualPcs) >= parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "Pieces already added.", "bottom-right");
        return false;
    }

    //$(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = true;

    return true;
}


function AfterAddDim() {
    var elem = $("#areaTrans_importfwb_shipmentdimension");
    //if (elem.closest("table").find("[id^='Pieces']").length >= 2)
    //    $('.disablechk').attr('disabled', 'disabled');
    var elem = $("#areaTrans_importfwb_shipmentdimension");
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });
    Pcs = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
    var count = elem.closest("table").find("[id^='Pieces']").length - 2;
    elem.closest("table").find("td[id^=transAction]").find("i[title='Add More']").hide();
}

function ValidateWeighingProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select SLI for processing.", "bottom-right");
        return;
    }

    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;

    $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:590px;'></div>");

    $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    //if (processedpcscount == parseInt($("#TotalPieces").val())) {
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        $("#Piecestobeweighed").val("");
        $("#toPiecestobeweighed").val("")
        return;
    }

    //var totalPcs = parseInt($("#TotalPieces").val());
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);
    var processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());

        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.replace(/\s/g, '').split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    if (!isProcessed) {
        handleAdd($("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentweightdetail", pieceSequence, "ScanPieces", "RemainingPieces");
        var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
        var SLINO = $("#Text_SLINo").val().split("-")[0];
        var HAWBNO = $("#Text_SLINo").val().split("-")[2];

        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("span[id^='SLISNo']").html(SLISNO);

        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("span[id^='SLINo']").html(SLINO);

        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
        $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

    }



}

function ValidateXRayProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select SLI for processing.", "bottom-right");
        return;
    }
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:590px;'></div>");
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs.trim() + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    //if (processedpcscount == parseInt($("#TotalPieces").val())) {
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        return;
    }
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    //var totalPcs = parseInt($("#TotalPieces").val());
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);

    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    handleAdd($("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("td:last"), "areaTrans_importfwb_shipmentxraydetail", pieceSequence, "ScanPieces", "RemainingPieces");

    var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
    var SLINO = $("#Text_SLINo").val().split("-")[0];
    var HAWBNO = $("#Text_SLINo").val().split("-")[2];

    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("span[id^='SLISNo']").html(SLISNO);

    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("span[id^='SLINo']").html(SLINO);

    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
    $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

}

function ValidateLocationProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select SLI for processing.", "bottom-right");
        return;
    }
    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    //--
    var ULDLocationPcs = 0;
    $("div[id='divareaTrans_importfwb_shipmentuldlocation']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentuldlocation']").each(function () {
        ULDLocationPcs += 1;
    });
    //--
    //if (processedpcscount + ULDLocationPcs == parseInt($("#TotalPieces").val())) {
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        $("#Piecestobeweighed").val("");
        $("#toPiecestobeweighed").val("")
        return;
    }
    //var totalPcs = parseInt($("#TotalPieces").val());if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val() == "" ? "0" : $("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val() == "" ? "0" : $("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        //if (startPicesno > totalPcs || (endPicesno + ULDLocationPcs) > totalPcs) {
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace($("#tdAWBNo").html(), "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace($("#tdAWBNo").html(), "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace($("#tdAWBNo").html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        //alert(pieceSequence);
    }
    handleAdd($("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentlocationdetail", pieceSequence, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);

    var SLISNO = $("#Text_SLINo").data("kendoAutoComplete").key();
    var SLINO = $("#Text_SLINo").val().split("-")[0];
    var HAWBNO = $("#Text_SLINo").val().split("-")[2];

    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("span[id^='SLISNo']").html(SLISNO);

    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("span[id^='SLINo']").html(SLINO);

    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
    $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

}

function handleAdd(elem, strid, pcsseq, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");

    var closestDiv = $(self).closest("div");

    addEventCallback = (addEventCallback == undefined ? null : addEventCallback);
    beforeAddEventCallback = (beforeAddEventCallback == undefined ? null : beforeAddEventCallback);
    removeEventCallback = (removeEventCallback == undefined ? null : removeEventCallback);

    var idCount = 0;
    var lastTable = $(closestDiv).find("[id^='areaTrans']:last");
    var lastAction = $(lastTable).find("[id^='transAction']");
    var myClone = $(self).clone(false);
    var linkText = 'Add more',
    linkClass = 'icon-trans-plus-sign',
    resetLinkText = 'Reset',
    resetLinkClass = 'icon-trans-refresh',
    enableRemove = true,
    removeLinkText = 'Delete',
    removeLinkClass = 'icon-trans-trash',
    confirmOnRemove = true,
    confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
    convertToControl = ConvertToControl,
    maxItemsAllowedToAdd = null,
    maxItemReachedCallback = null,
    searchType = false,
    isReset = false,
    data = [],
    isAdd = false,
    afterConvertMultiField = null;
    if (beforeAddEventCallback !== null) {
        var retVal = beforeAddEventCallback(elem.closest("[id^='areaTrans_']"));
        if (!retVal) {
            return false;
        }
    }

    var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
    var fieldCount = parseInt($(self).attr("FieldCount"), 10);
    if (maxItemsAllowedToAdd === null || totalCount < maxItemsAllowedToAdd) {
        var newElem = myClone.clone(true);
        $(newElem).attr("id", $(newElem).attr("id") + "_" + totalCount).show();

        var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) - pcsseq.split(',').length).toString();
        $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
        $("span[id='" + remailpcsctrlid + "']").html(remainPcs);

        $(newElem).find("*[id!=''][name!='']").each(function () {
            if ($(this).attr("id")) {
                var strid = $(this).attr("id");
                var strname = "";
                var type = $(this).attr("type");

                $(this).closest("tr").find("td[id^='tdSNoCol']").text((totalCount + 1).toString());

                if ($(this).attr("name")) {
                    strname = $(this).attr("name");
                }
                if ($(this).attr("controltype") == "datetype") {
                    if ($(this).attr("endcontrol") != undefined) {
                        $(this).attr("endcontrol", $(this).attr("endcontrol") + "_" + totalCount)
                    }
                    if ($(this).attr("startcontrol") != undefined) {
                        $(this).attr("startcontrol", $(this).attr("startcontrol") + "_" + totalCount)
                    }
                }

                $(this).attr("id", strid + "_" + totalCount);
                if (strname != undefined)
                    $(this).attr("name", strname + "_" + totalCount);
                if (type != "radio" && type != "checkbox")
                    $(this).val("");
                if (type == "checkbox")
                    $(this).attr("validatename", strid + "_" + totalCount + "[]");
            }
        });

        $(newElem).closest("tr").find("span[id^='" + pcscontrolid + "']").text(pcsseq);
        $(newElem).closest("tr").find("input[id^='" + pcscontrolid + "']").val(pcsseq);
        totalCount++;
        fieldCount++;

        $(self).attr("TotalFieldsAdded", totalCount);
        $(self).attr("FieldCount", fieldCount);

        $(newElem).removeAttr("uniqueId");

        if (enableRemove && $(self).attr("uniqueId") != $(elem).closest("[id^='areaTrans']").attr("uniqueId")) {
            if ($(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).length === 0) {
                $(elem).closest("[id^='areaTrans']").find("#transAction").append(" <input type='button' class='" + removeLinkClass + "'value='" + removeLinkText + "'/>");
            }
            $(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(newElem).attr("uniqueId", linkClass + Math.random());
        //$(elem).parent().after(newElem);
        $(elem).closest("[id^='areaTrans']").after(newElem);

        $(elem).closest("[id^='areaTrans']").find("." + linkClass).remove();

        $(newElem).find("." + resetLinkClass).remove();
        $(newElem).find("." + linkClass).remove();
        $(newElem).find("." + removeLinkClass).remove();

        if (enableRemove) {
            if ($(newElem).find("." + removeLinkClass).length === 0) {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
            }
            $(newElem).find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(self).attr("maxCountReached", "false");
        if (isAdd) {
            if (linkClass != "scheduletransradiocss") {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                newElem.find("." + linkClass).unbind("click").click(function () {
                    if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                        return handleAdd($(this));
                    }
                });
            }
            else {
                $(newElem).find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                    if ($(this).val() == "1") {
                        if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                        else {
                            $(newElem).find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                $(this).removeAttr("checked");
                                if ($(this).val() == "0") {
                                    $(this).attr("checked", true);
                                }
                            });
                        }
                    }
                });
            }
        }
        if (convertToControl !== null) {
            convertToControl($(newElem), self);
        }
        if (addEventCallback !== null) {
            addEventCallback($(newElem), self);
        }
    }

    if (maxItemsAllowedToAdd !== null && totalCount >= maxItemsAllowedToAdd) {
        newElem.find("." + linkClass).hide();

        if (maxItemReachedCallback !== null) {
            maxItemReachedCallback($(newElem), self);
        }
    }
    return true;
}

function handleRemove(elem, strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var cnt = true;

    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");
    var linkText = 'Add more',
    linkClass = 'icon-trans-plus-sign',
    resetLinkText = 'Reset',
    resetLinkClass = 'icon-trans-refresh',
    enableRemove = true,
    removeLinkText = 'Delete',
    removeLinkClass = 'icon-trans-trash',
    confirmOnRemove = true,
    confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
    convertToControl = ConvertToControl,
    maxItemsAllowedToAdd = null,
    maxItemReachedCallback = null,
    searchType = false,
    isReset = false,
    data = [],
    isAdd = false,
    afterConvertMultiField = null;
    if (confirmOnRemove) {
        cnt = confirm(confirmationMsgOnRemove);
    }
    if (cnt) {
        var prevParent = $(elem).closest("[id^='areaTrans']").prev();

        var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
        totalCount--;

        $(self).attr("TotalFieldsAdded", totalCount);

        if ($(elem).closest("[id^='areaTrans']").find("." + linkClass).length >= 0) {
            if (enableRemove && $(self).attr("uniqueId") != $(prevParent).attr("uniqueId")) {
                if ($(prevParent).find("." + removeLinkClass).length === 0) {
                    $(prevParent).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
                }

                $(prevParent).find("." + removeLinkClass).unbind("click").click(function () {
                    return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid);
                });
            }
            var pieceSequence = $(elem).closest("tr").find("input[id^='" + pcscontrolid + "']").val();
            if (pieceSequence != undefined && pieceSequence != "") {
                var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) + pieceSequence.split(',').length).toString();
                $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
                $("span[id='" + remailpcsctrlid + "']").html(remainPcs);
            }
            $(elem).closest("[id^='areaTrans']").remove();
            $(prevParent).closest("div").find("." + linkClass).remove();
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                }
            }
            var idCount = 0;
            var parentID = $(prevParent).closest("div").find("[id^='areaTrans']:eq(0)").attr("id");
            $(prevParent).closest("div").find("[id^='areaTrans']:gt(0)").each(function () {
                $(this).attr("id", parentID + "_" + idCount);
                $(this).find("*[id!=''][name!='']").each(function () {
                    if ($(this).attr("id")) {
                        var strid = $(this).attr("id");
                        var strname = "";
                        $(this).closest("tr").find("td[id^='tdSNoCol']").text((idCount + 1).toString());
                        if ($(this).attr("name")) {
                            strname = $(this).attr("name");
                        }

                        if ($(this).attr("controltype") == "datetype") {
                            var EndControl = $(this).attr("endcontrol");

                            var StartControl = $(this).attr("startcontrol");
                            if (EndControl != undefined) {
                                $(this).attr("endcontrol", EndControl.substr(0, EndControl.lastIndexOf('_')) + "_" + idCount)
                            }
                            if (StartControl != undefined) {
                                $(this).attr("startcontrol", StartControl.substr(0, StartControl.lastIndexOf('_')) + "_" + idCount)
                            }
                        }
                        $(this).attr("id", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                        if (strname != undefined)
                            $(this).attr("name", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                    }
                });
                idCount++;
            });
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("." + linkClass).unbind("click").click(function () {
                        if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                    });
                }
                else {
                    $(prevParent).closest("div").find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                        if ($(this).val() == "1") {
                            if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                                return handleAdd($(this));
                            }
                            else {
                                $(prevParent).closest("div").find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                    $(this).removeAttr("checked");
                                    if ($(this).val() == "0") {
                                        $(this).attr("checked", true);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }

        if (maxItemsAllowedToAdd !== null && totalCount < maxItemsAllowedToAdd) {
            $(self).siblings().find("." + linkClass).show();
        }

        if (convertToControl !== null) {
            convertToControl($(prevParent), self);
        }
        if (removeEventCallback !== null) {
            removeEventCallback($(prevParent), self);
        }

    }
    return true;
}

function SwitchScanType(val, obj) {
    var closesttable = $(obj).closest("table");
    var closesttrindex = $(obj).closest("tr").index();
    closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").hide();
    if (val == "0") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    else if (val == "1") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    SetTotalPcs();
}

function BindWeighingMachineEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
        if (typevalue == "1") {
            $('#AWBNo').focus();
        }
    });
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtWeighing?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var weighingData = jQuery.parseJSON(result);
            var weighingArray = weighingData.Table0;
            var arr = weighingData.Table1;
            var ULDDimArray = weighingData.Table2;
            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();
            $("div[id$='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentweightdetail']:first").hide();
            if (weighingArray.length > 0) {
                for (var i = 0; i < weighingArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentweightdetail", weighingArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");
                    var row = $("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last");
                    row.find("[id^='GrossWt_']").val(weighingArray[i].GrossWt);
                    row.find("[id^='Remarks_']").val(weighingArray[i].Remarks);
                    row.find("input[type=hidden][id^='SLISNo']").val(weighingArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(weighingArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(weighingArray[i].SLINO);
                    row.find("span[id^='SLINo']").html(weighingArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(weighingArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(weighingArray[i].HAWBNo);

                }

            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentweightdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentweightdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentweightdetail", dblscan, "ScanPieces", "RemainingPieces");
            }
            cfi.makeTrans("importfwb_shipmentweightulddetail", null, null, null, null, null, ULDDimArray);
            if (ULDDimArray.length <= 0) {
                $("div[id$='areaTrans_importfwb_shipmentweightulddetail']").find("[id='areaTrans_importfwb_shipmentweightulddetail']:first").hide();
            } else {
                $("input[id='RemainingPieces']").val(parseInt($("input[id='RemainingPieces']").val()) - parseInt($("div[id$='areaTrans_importfwb_shipmentweightulddetail']").find("tr[id^='areaTrans_importfwb_shipmentweightulddetail']").length));
                $("span[id='RemainingPieces']").text($("input[id='RemainingPieces']").val());
            }

            $('#divareaTrans_importfwb_shipmentweightulddetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find('td:eq(10)').css("display", "none");
                $(tr).find("input[id^='CapturedWt']").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='CapturedWt']").attr("data-valid", "required");
                $(tr).find("input[id^='TareWt']").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='GrossWt']").attr('readonly', true);
            });

            $('#divareaTrans_importfwb_shipmentweightdetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");

            });

            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}

function fn_ValidateULDWt(obj) {
    var CurrentRow = $(obj).closest('tr');
    if (parseFloat(CurrentRow.find("input[id^='CapturedWt']").val() == "" ? "0" : CurrentRow.find("input[id^='CapturedWt']").val()) < parseFloat(CurrentRow.find("input[id^='TareWt']").val() == "" ? "0" : CurrentRow.find("input[id^='TareWt']").val())) {
        if ($(obj).attr('recname') == "CapturedWt") {
            ShowMessage('warning', 'Warning - Weighing Machine', "Captured Weight can't be less than Tare Weight.", "bottom-right");
            CurrentRow.find("input[id^='CapturedWt']").val('');
            CurrentRow.find("input[id^='GrossWt']").val('');
        } else {
            ShowMessage('warning', 'Warning - Weighing Machine', "Tare Weight can't be greater than Captured Weight.", "bottom-right");
            CurrentRow.find("input[id^='CapturedWt']").val('');
            CurrentRow.find("input[id^='GrossWt']").val('');
        }
    } else {
        CurrentRow.find("input[id^='GrossWt']").val((parseFloat(CurrentRow.find("input[id^='CapturedWt']").val() == "" ? "0" : CurrentRow.find("input[id^='CapturedWt']").val()) - parseFloat(CurrentRow.find("input[id^='TareWt']").val() == "" ? "0" : CurrentRow.find("input[id^='TareWt']").val())).toFixed(3));
    }

}
function ResetPieces() {
    $("#Piecestobeweighed").val("");
    $("#_tempPiecestobeweighed").val("");
    $("#toPiecestobeweighed").val("")
    $("#_temptoPiecestobeweighed").val("")
}
function BindULDAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ULDNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    });
}


function BindDimensionEvents() {
    SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetDimemsionsAndULD?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var dimArray = dimuldData.Table0;
            var uldArray = dimuldData.Table1;
            var totaldim = dimuldData.Table2;
            var awbInfo = dimuldData.Table3;

            var arr = dimuldData.Table4;
            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();

            //cfi.makeTrans("importfwb_shipmentuld", null, null, BindULDAutoComplete, null, beforeAddULDEventCallback, uldArray);
            //if (uldArray.length <= 0) {
            //    $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id='areaTrans_importfwb_shipmentuld']:first").hide();
            //}
            cfi.makeTrans("importfwb_shipmentdimension", null, null, AfterAddDim, checkonRemove, beforeAddEventCallback, dimArray);

            if (totaldim.length > 0) {
                $("#Unit[value='" + totaldim[0].Unit + "']").prop('checked', true);
                $("input[id='DimVolumeWt']").val(totaldim[0].DimVolumeWt);
                $("span[id='DimVolumeWt']").html(totaldim[0].DimVolumeWt);
            }
            else if (awbInfo.length > 0) {
                $("input[id='DimVolumeWt']").val(awbInfo[0].VOLUMEWEIGHT);
                $("span[id='DimVolumeWt']").html(awbInfo[0].VOLUMEWEIGHT);
            }
            $("[id='Unit']").unbind("click").bind("click", function (e) {
                var typevalue = $(this).attr("value");
                CalculateVolume();
            });


            //$("div[id$='areaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function () {
            //    $(this).find('td:eq(1)').css("display", "none");
            //    $(this).find("input[id^='ULDNo']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            //    });
            //    $(this).find("input[id^='Text_ULDNo']").closest('span').css('width', '100%');
            //});
            $("div[id$='divareaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                //$(tr).find('td:eq(7)').prepend("<label for='Pieces'>" + $(tr).find("input[id^='Pieces']").val().toString() + " /</label>");
                $(tr).find('td:eq(7)').append("<label for='Pieces'>/" + dimArray[row]['totalpieces'].toString() + "</label>");

                $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
                $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    fn_RemoveRow(this);
                });
                $(tr).find("input[id^=Length]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=Width]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=Height]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
            });
            $("div[id$='divareaTrans_importfwb_shipmentdimension'] table tr:first").find('td:eq(1)').css("display", "none");
            //$("div[id$='areaTrans_importfwb_shipmentuld'] table tr:eq(2)").find('td:eq(1)').css("display", "none");

        },
        error: {

        }
    });
}
function fn_AddNewRow(input) {
    fn_CalculateSplitTotalPcs(input);
    var TotalPlanPcs = 0;
    var CurrentTotalPcs = 0;
    var CurrentSLISNo = 0;
    if ($(input).parent().find("label").text() != undefined && $(input).parent().find("label").text() != "") {
        CurrentTotalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
    }
    CurrentSLISNo = $(input).parent().parent().find("span[id^='SLISNo']").text();

    $(input).parent().parent().parent().find('tr').each(function (row, tr) {
        if ($(tr).find("span[id^='SLISNo']").text() == CurrentSLISNo) {
            TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find("input[id^='Pieces']").val());
        }
    });

    if (TotalPlanPcs > CurrentTotalPcs) {
        $(input).val('');
        return false;
    }
    if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
        var trClone = $(input).parent().parent().clone(false);
        if ($(trClone).find("i[title='Delete']").length <= 0) {
            $(trClone).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-trash' title='Delete'></i>");
        }
        trClone.find("input[id^='Pieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
        //trClone.find("input[id^='Length']").val('');
        //trClone.find("input[id^='Width']").val('');
        //trClone.find("input[id^='Height']").val('');
        //trClone.find("input[id^='VolumeWt']").val('');
        //trClone.find("VolumeWt[id^='VolumeWt']").text('');

        trClone.find("input[id*='Length']").attr('readonly', false);
        trClone.find("input[id*='Width']").attr('readonly', false);
        trClone.find("input[id*='Height']").attr('readonly', false);

        $(input).parent().parent().after(trClone);
        $("div[id$='divareaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function (row, tr) {
            $(tr).find('td:eq(0)').text(row + 1);
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").remove();
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveRow(this);
            });
            $(tr).find("input[id^=Length]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=Width]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=Height]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });

            $(tr).find("input[id^='Length']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });
            $(tr).find("input[id^='Width']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });
            $(tr).find("input[id^='Height']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    ValidatePieces(this);
                });
            });


        });
    }
    CalculateVolume();
}
function fn_RemoveRow(input) {
    var tr = $(input).closest('tr');
    if (tr.find("span[id^='SLISNo']").text() == tr.prev().find("span[id^='SLISNo']").text()) {
        if (confirm('Are you sure, you wish to remove selected row?')) {
            tr.prev().find("input[id*='Pieces']").val(parseInt(tr.prev().find("input[id^='Pieces']").val()) + parseInt(tr.find("input[id^='Pieces']").val()));
            $(input).closest('tr').remove();
        }
    }
    $("div[id$='divareaTrans_importfwb_shipmentdimension']").find("[id^='areaTrans_importfwb_shipmentdimension']").each(function (row, tr) {
        $(tr).find('td:eq(0)').text(row + 1);;
    });
    CalculateVolume(input);
}

function fn_CalculateSplitTotalPcs(input) {
    var flag = false;
    var CurrentSLISNo = 0;
    var trRow = $(input).closest('tr');
    CurrentSLISNo = $(input).parent().parent().find("span[id^='SLISNo']").text();

    if ($(input).val() != "") {
        var totalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();

        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find("span[id^='SLISNo']").text() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='Pieces']").val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='Pieces']").val());
            }
        });
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                alert("Pieces should be less than Total Pieces");
                ShowMessage('warning', 'Warning -Pieces should be less than Total Pieces', "", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', "", "bottom-right");
            $(input).val(totalPcs);
            flag = false;

        }
    }
    return flag;
}

function BindULDDimensionInfo() {
    // SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetULDDimensionInfo?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var uldArray = dimuldData.Table0;

            cfi.makeTrans("importfwb_shipmentuld", null, null, BindULDAutoComplete, null, null, uldArray);
            if (uldArray.length <= 0) {
                $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id='areaTrans_importfwb_shipmentuld']:first").hide();
            }

            $("div[id$='areaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
                $(tr).find("input[id^='Unit']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode", "UnitName"], CalculateULDVolume, "contains");
                });
                $(tr).find('td:eq(6)').append("<label for='Pieces' style='display:none'>/" + uldArray[row]['totalpieces'].toString() + "</label>");
                $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
                $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    fn_RemoveULDRow(this);
                });
                $(tr).find("input[id^=SLACPieces]").unbind("keydown").bind("keydown", function () {
                    ISNumber(this);
                });
                $(tr).find("input[id^=UldPieces]").unbind("keydown").bind("keydown", function () {
                    ISNumber(this);
                });
                $(tr).find("input[id^=ULDLength]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=ULDWidth]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^=ULDHeight]").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
                $(tr).find("span[id^='SLISNo']").css("display", "none");
                if (row > 0) {
                    if ($(tr).find("span[id^='ULDNo']").text() == $(tr).prev().find("span[id^='ULDNo']").text()) {
                        $(tr).find("span[id^='SLINo']").css("display", "none");
                        $(tr).find("span[id^='HAWBNo']").css("display", "none");
                        $(tr).find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
                        $(tr).find("input[id*='SLACPieces']").css("display", "none");
                    }
                }
            });

            $("div[id$='areaTrans_importfwb_shipmentuld'] table tr:eq(2)").find('td:eq(1)').css("display", "none");
            //$("div[id$='areaTrans_importfwb_shipmentuld'] table tr:eq(2)").find('td:eq(12)').css("display", "none");

        },
        error: {

        }
    });
}
function fn_AddNewULDRow(input) {
    fn_CalculateSplitTotalULDPcs(input);
    var TotalPlanPcs = 0;
    var CurrentTotalPcs = 0;
    var CurrentSLISNo = 0;
    var SLACPcs = 0;
    if ($(input).parent().find("label").text() != undefined && $(input).parent().find("label").text() != "") {
        CurrentTotalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
    }
    SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() == "" ? "0" : $(input).parent().parent().find("input[id*='SLACPieces']").val();
    CurrentTotalPcs = parseInt(SLACPcs) > parseInt(CurrentTotalPcs) ? SLACPcs : CurrentTotalPcs;

    CurrentSLISNo = $(input).parent().parent().find("span[id^='ULDNo']").text();

    $(input).parent().parent().parent().find('tr').each(function (row, tr) {
        if ($(tr).find("span[id^='ULDNo']").text() == CurrentSLISNo) {
            TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
        }
    });

    if (TotalPlanPcs > CurrentTotalPcs) {
        $(input).val('');
        return false;
    }
    if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
        var trClone = $(input).parent().parent().clone(false);
        if ($(trClone).find("i[title='Delete']").length <= 0) {
            $(trClone).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-trash' title='Delete'></i>");
        }
        trClone.find("input[id^='UldPieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);

        $(input).parent().parent().find("input[id*='SLACPieces']").attr('disabled', true);
        trClone.find("span[id^='SLINo']").css("display", "none");
        trClone.find("span[id^='HAWBNo']").css("display", "none");
        trClone.find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
        trClone.find("input[id*='SLACPieces']").css("display", "none");

        trClone.find("input[id^='ULDLength']").attr('readonly', false);
        trClone.find("input[id^='ULDWidth']").attr('readonly', false);
        trClone.find("input[id^='ULDHeight']").attr('readonly', false);


        $(input).parent().parent().after(trClone);

        $("div[id$='divareaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function (row, tr) {
            $(tr).find("[id^='Unit']").attr('id', 'Unit' + row)
            $(tr).find("[id^='Unit']").attr('name', 'Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('id', 'Text_Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('name', 'Text_Unit' + row)

            $(tr).find('td:eq(0)').text(row + 1);
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").remove();
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveULDRow(this);
            });
            //$(tr).find("input[id^='ULDNo']").each(function () {
            //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            //});

            $(tr).find("input[id^='Unit']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode", "UnitName"], CalculateULDVolume, "contains");
            });

            $(tr).find("input[id^=UldPieces]").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $(tr).find("input[id^=ULDLength]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=ULDWidth]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $(tr).find("input[id^=ULDHeight]").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });


            $(tr).find("input[id^='ULDLength']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDWidth']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDHeight']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });


        });
        $("div[id$='divareaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").find("input[id*='Text_Unit']").closest('span').css('width', '')
    }
    CalculateULDVolume();
}
function fn_RemoveULDRow(input) {
    var tr = $(input).closest('tr');
    if (tr.find("span[id^='ULDNo']").text() == tr.prev().find("span[id^='ULDNo']").text()) {
        if (confirm('Are you sure, you wish to remove selected row?')) {
            tr.prev().find("input[id*='UldPieces']").val(parseInt(tr.prev().find("input[id^='UldPieces']").val()) + parseInt(tr.find("input[id^='UldPieces']").val()));
            $(input).closest('tr').remove();
        }
    }
    $("div[id$='divareaTrans_importfwb_shipmentuld']").find("[id^='areaTrans_importfwb_shipmentuld']").each(function (row, tr) {
        $(tr).find('td:eq(0)').text(row + 1);;
    });
    CalculateULDVolume(input);
}
function fn_ValidateSLACPCS(input) {
    var tr = $(input).closest('tr');
    var SLACPcs, PCS;
    SLACPcs = $(input).val() == "" ? "0" : $(input).val();
    PCS = $(input).closest('tr').find("label[for='Pieces']").text().replace("/", "") == "" ? "0" : $(input).closest('tr').find("label[for='Pieces']").text().replace("/", "");
    if (parseInt(SLACPcs) < parseInt(PCS)) {
        alert("SLAC Pieces should not be less than ULD Pieces");
        $(input).val(PCS);
    }
}
function fn_CalculateSplitTotalULDPcs(input) {
    var flag = false;
    var CurrentSLISNo = 0;
    var trRow = $(input).closest('tr');
    CurrentSLISNo = $(input).parent().parent().find("span[id^='ULDNo']").text();

    if ($(input).val() != "") {
        var totalPcs = parseInt($(input).parent().find("label").text().replace("/", ""));
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();
        ///18
        SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() == "" ? "0" : $(input).parent().parent().find("input[id*='SLACPieces']").val();
        totalPcs = parseInt(SLACPcs) > parseInt(totalPcs) ? SLACPcs : totalPcs;
        ////18
        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find("span[id^='ULDNo']").text() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
            }
        });
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                alert("Pieces should be less than Total Pieces");
                ShowMessage('warning', 'Warning -Pieces should be less than Total Pieces', "", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', "", "bottom-right");
            $(input).val(totalPcs);
            flag = false;

        }
    }
    return flag;
}
function CalculateULDVolume(elem, obj) {
    elem = $("#areaTrans_importfwb_shipmentuld");

    var VolumeCalculation = 0;


    elem.closest("div").find("table > tbody").find("[id^='areaTrans_importfwb_shipmentuld']").each(function () {

        var Width = $(this).find("input[id^='ULDWidth']").val() == "" ? "0" : $(this).find("input[id^='ULDWidth']").val();
        var Length = $(this).find("input[id^='ULDLength']").val() == "" ? "0" : $(this).find("input[id^='ULDLength']").val();
        var Height = $(this).find("input[id^='ULDHeight']").val() == "" ? "0" : $(this).find("input[id^='ULDHeight']").val();
        var Pieces = $(this).find("input[id^='UldPieces']").val() == "" ? "0" : $(this).find("input[id^='UldPieces']").val();
        var divisor = 1;
        divisor = $(this).find("input[id^='Text_Unit'").data("kendoAutoComplete").value().split('-')[0] == "CMT" ? 6000 : 366;
        var currentVolume = 0;
        if (Pieces != "" && Pieces != undefined) {
            currentVolume = parseFloat(Pieces) * parseFloat(Length) * parseFloat(Width) * parseFloat(Height);
            var volWeight = (currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);

            $(this).find("span[id^='UldVolWt']").html(volWeight.toFixed(3) + "(" + (volWeight.toFixed(3) / 166.6667).toFixed(3) + ")");
            $(this).find("input[id^='UldVolWt']").val(volWeight.toFixed(3));
        }
    });
}

function BindULDDimensionDetails() {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetULDDimensionDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var dimuldData = jQuery.parseJSON(result);
            var uldArray = dimuldData.Table0;

            //cfi.makeTrans("importfwb_shipmentuld", null, null, BindULDAutoComplete, null, beforeAddULDEventCallback, uldArray);
            cfi.makeTrans("importfwb_shipmentulddetails", null, null, BindULDAutoComplete, null, null, uldArray);
            if (uldArray.length <= 0) {
                $("div[id$='divareaTrans_importfwb_shipmentulddetails']").find("[id='areaTrans_importfwb_shipmentulddetails']:first").hide();
            }


            $("div[id$='areaTrans_importfwb_shipmentulddetails']").find("[id^='areaTrans_importfwb_shipmentulddetails']").each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
                $(tr).find("input[id^='UldLoadingCode']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDLoadingCode", "ULDLoadingCodes", "SNo", "ULDLoadingCode", ["ULDLoadingCode", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldLoadingIndicators']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDLoadingIndicator", "ULDLoadingIndicator", "SNo", "ULDLoadingIndicator", ["ULDLoadingIndicator", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldContourCode']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "AbbrCode", "ULDContour", "SNo", "AbbrCode", ["AbbrCode", "Description"], null, "contains");
                });
                $(tr).find("input[id^='UldBupType']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "Description", "buptype", "SNo", "Description", ["Description"], null, "contains");
                });
                $(tr).find("input[id^='UldBasePallet']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });

                $(tr).find("td[id^=transAction]").hide();
                $(tr).find("input[id^='Text_ULDNo']").closest('span').css('width', '');
            });
            $("div[id$='areaTrans_importfwb_shipmentulddetails'] table tr:eq(2)").find('td:eq(1)').css("display", "none");
            $("div[id$='areaTrans_importfwb_shipmentulddetails'] table tr:eq(2)").find('td:last').css("display", "none");

        },
        error: {

        }
    });
}

var pageType = $('#hdnPageType').val();
function BindDimensionEventsNew() {
    var dbtableName = "AWBRateDesription";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
        getRecordServiceMethod: "GetFDimemsionsAndULDNew",
        masterTableSNo: currentawbsno,
        caption: "Rating",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: 'NoOfPieces', display: 'Pieces', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 5, disabled: 1 }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                {
                    name: 'GrossWeight', display: 'Gr. Wt.', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, onChange: function (evt, rowIndex) { }
                },
                 {
                     name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
                 },
                {
                    name: 'CommodityItemNumber', display: 'Com. Item No.', type: 'text', value: 0, ctrlCss: { width: '100px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, }, onChange: function (evt, rowIndex) { }
                },
                {
                    name: 'ChargeableWeight', display: 'Ch. Wt.', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: false, value: 0
                },
                {
                    name: 'Charge', display: 'Charge', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: false, value: 0
                },
                 {
                     name: 'ChargeAmount', display: 'Charge Amt.', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: false, value: 0
                 },
                  {
                      name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 18, onBlur: "CheckLength(this)", onkeypress: "ISNumeric(this);", }, isRequired: false, value: 0
                  },
               {
                   name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, tableName: "Country", textColumn: "CountryCode", templateColumn: ["CountryCode", "CountryName"], keyColumn: "SNo"
               },
                 {
                     name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20, disabled: 1 }, isRequired: true
                 },
                  {
                      name: 'ConsolDesc', display: 'Consol Desc.', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: false
                  },
                {
                    name: 'hdnChildData', type: 'hidden', value: 0
                },


                //{
                //    name: 'GetRate', display: 'Rate', type: 'custom',
                //    customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                //        var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                //        var ctrl = document.createElement('span');
                //        $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                //        $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_GetRate', value: 'Get Rate', onclick: 'SearchData(this)' }).css('width', '75px').appendTo(ctrl).button();
                //        return ctrl;
                //    }
                //}
                //,
        {
            name: 'Dimension', display: 'Dimension', type: 'custom',
            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                var ctrl = document.createElement('span');
                $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_btnDimension', value: 'Dimension', onclick: ' PopupDiv(this)' }).css('width', '75px').appendTo(ctrl).button();
                return ctrl;
            }
        }
        ],

        customFooterButtons: [
            { uiButton: { label: 'Get Rate', text: true }, btnAttr: { title: 'Get Rate' }, click: function (evt) { SearchData(this) }, atTheFront: true },
        ],

        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true, append: true }

    });
}
function CalculateVol(obj) {
    if ($(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_HdnMeasurementUnitCode_").val() == "") {
        ShowMessage('warning', 'Information!', "Select Mes. Unit.", "bottom-right");
        $(obj).val('');
        return false;
    }
    var Pcs, Len, Width, Height;
    Pcs = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Pieces_").val();
    Len = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Length_").val();
    Width = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Width_").val();
    Height = $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_Height_").val();

    if ($(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_HdnMeasurementUnitCode_").val() == "CMP")
        divisor = 6000;
    else
        divisor = 366;


    var currentVolume = 0;
    if (Pcs != "" && Pcs != undefined) {
        currentVolume = parseFloat(Pcs == "" ? "0" : Pcs) * parseFloat(Len == "" ? "0" : Len) * parseFloat(Width == "" ? "0" : Width) * parseFloat(Height == "" ? "0" : Height);
        var volWeight = Math.ceil(currentVolume / divisor);
        volWeight = (volWeight < 1 ? 1 : volWeight);
        $(obj).closest('tr').find("input[id^=_temptblAWBRateDesriptionChild_VolumeWeight_").val(volWeight);
        $(obj).closest('tr').find("input[id^=tblAWBRateDesriptionChild_VolumeWeight_").val(volWeight);
    }

}
function BindDimensionEventsNewULD() {
    var dbtableName = "AWBRateDesriptionULD";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
        getRecordServiceMethod: "GetFDimemsionsAndULDRate",
        masterTableSNo: currentawbsno,
        isGetRecord: true,
        caption: "ULD Rating",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: 0, tableName: "RateClass", textColumn: "RateClassCode", templateColumn: ["RateClassCode", "Description"], keyColumn: "RateClassCode"
                 },
                     {
                         name: 'SLAC', display: 'SLAC', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                     },
                 {
                     name: "ULD", display: "ULD Type", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "50px" }, isRequired: true, tableName: "ULD", textColumn: "ULDName", templateColumn: "", keyColumn: "SNo"
                 },
                {
                    name: 'ULDNo', display: 'ULD No.', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 8, }, isRequired: true, onChange: function (evt, rowIndex) { }
                },

                 {
                     name: 'Charge', display: 'Charge', type: 'decimal3', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: 0, value: 0
                 },
                 {
                     name: 'ChargeAmount', display: 'Charge Amt.', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: 0, value: 0
                 },
                    {
                        name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 10, onBlur: "CheckLength(this)", onkeypress: "ISNumeric(this);", }, isRequired: false, value: 0
                    },
               {
                   name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, tableName: "Country", textColumn: "CountryCode", templateColumn: ["CountryCode", "CountryName"], keyColumn: "SNo"
               },
                  {
                      name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: true
                  }

        ],

        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function BindAWBOtherCharge() {
    var dbtableName = "AWBRateOtherCharge";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
        getRecordServiceMethod: "GetAWBOtherChargeData",
        masterTableSNo: currentawbsno,
        caption: "Other Charges",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: pageType == 'EDIT' ? 'Type' : 'Type', display: 'Type', type: 'select', ctrlOptions: { 'P': 'PREPAID', 'C': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { CalculateRateTotal(); }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, tableName: "AWBOtherChargeCode", textColumn: "OtherChargeCode", keyColumn: "OtherChargeCode", templateColumn: ["OtherChargeCode", "Description"],
                 },
                 {
                     name: pageType == 'EDIT' ? 'DueType' : 'DueType', display: 'Due Carrier/Agent', type: 'select', ctrlOptions: { 'A': 'Agent', 'C': 'Carrier' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: 'Amount', display: 'Amount', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: true, value: 0
                 }
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}

function SetAWBDefaultValues() {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetAWBRateDefaultValues?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            if (RateArray.length > 0) {
                for (i = 0; i < RateArray.length; i++) {
                    $('#tblAWBRateDesription').appendGrid('appendRow', [
                     {
                         NoOfPieces: RateArray[0]["TotalPieces"],
                         GrossWeight: RateArray[0]["TotalGrossWeight"],
                         WeightCode: "K",
                         RateClassCode: "",
                         CommodityItemNumber: "",
                         ChargeableWeight: "",
                         Charge: "",
                         ChargeAmount: "",
                         NatureOfGoods: RateArray[0]["NatureOfGoods"]
                     }
                    ]);
                }
            }

        },
        error: {

        }
    });


}

function BindAWBRate() {

    cfi.AutoComplete("AWBCurrency", "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("Currency", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("ChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", "AWBChargeCode", ["AWBChargeCode", "Description"], null, "contains");
    cfi.AutoCompleteByDataSource("Valuation", WeightValuation, EnableDisableChargeField);
    cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);

    cfi.AutoComplete("CDCCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("CDCDestCurrencyCode", "CurrencyCode", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetAWBRateDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            var TACTRateArray = Data.Table1;
            if (RateArray.length > 0) {

                $("#Text_AWBCurrency").data("kendoAutoComplete").setDefaultValue(RateArray[0].AWBCurrencySNo, RateArray[0].CurrencyCode);
                //$("#TotalFreight").val();
                //$("#TotalAmount").val();
                //--CVD
                $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDCurrencyCode, RateArray[0].CVDCurrencyCode);
                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDChargeCode, RateArray[0].CVDChargeCode);
                $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(RateArray[0].FreightType, RateArray[0].txtFreightType);
                $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDOtherCharges, RateArray[0].CVDOtherChargestext);


                $("#DecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(3));
                $("#_tempDecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(3));

                $("#DecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(3));
                $("#_tempDecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(3));

                $("#Insurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(3));
                $("#_tempInsurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(3));

                $("#ValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(3));
                $("#_tempValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(3));
                //-- CCD
                $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCCurrencyCode, RateArray[0].CDCCurrencyCode);
                $("#CDCConversionRate").val(RateArray[0].CDCCurrencyConversionRate == "" ? "" : parseFloat(RateArray[0].CDCCurrencyConversionRate).toFixed(6));
                $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCDestinationCurrencyCode, RateArray[0].CDCDestinationCurrencyCode);
                $("#CDCChargeAmount").val(RateArray[0].CDCChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCChargeAmount).toFixed(3));
                // $("#CDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));

                $("#CDCTotalCharAmount").data("kendoNumericTextBox").value(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(3));
                $("#TotalFreight").val(RateArray[0].TotalPrepaidAmount);
                $("#_tempTotalFreight").val(RateArray[0].TotalPrepaidAmount);

                $("#TotalAmount").val(RateArray[0].TotalCollectAmount);
                $("#_tempTotalAmount").val(RateArray[0].TotalCollectAmount);


                if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
                    $('#CDCChargeAmount').removeAttr('disabled');
                    $('#CDCTotalCharAmount').removeAttr('disabled');
                    //$('#Text_CDCCurrencyCode').removeAttr('disabled');
                    $('#Text_CDCCurrencyCode').data("kendoAutoComplete").enable(true);
                    $('#CDCConversionRate').removeAttr('disabled');
                    $('#Text_CDCDestCurrencyCode').data("kendoAutoComplete").enable(true);
                } else {
                    $('#CDCChargeAmount').val('');
                    $('#_tempCDCChargeAmount').val('');
                    $('#CDCTotalCharAmount').val('');
                    $('#_tempCDCTotalCharAmount').val('');
                    $('#CDCConversionRate').val('');
                    $('#CDCChargeAmount').attr("disabled", "disabled");
                    $('#CDCTotalCharAmount').attr("disabled", "disabled");
                    $('#Text_CDCCurrencyCode').data("kendoAutoComplete").enable(false);
                    $('#CDCConversionRate').attr("disabled", "disabled");
                    $('#Text_CDCDestCurrencyCode').data("kendoAutoComplete").enable(false);
                    $('#Text_CDCCurrencyCode').val('');

                }
            }
            if (TACTRateArray.length > 0) {
                TactArray = [];
                var tactdata = {
                    AWBSNo: TACTRateArray[0].AWBSNo,
                    BaseOn: TACTRateArray[0].BaseOn,
                    ChargeableWeight: TACTRateArray[0].ChargeableWeight,
                    CommodityItemNumber: TACTRateArray[0].CommodityItemNumber,
                    GrossWeight: TACTRateArray[0].GrossWeight,
                    NatureOfGoods: TACTRateArray[0].NatureOfGoods,
                    NoOfPieces: TACTRateArray[0].NoOfPieces,
                    RateClassCode: TACTRateArray[0].RateClassCode,
                    Charge: TACTRateArray[0].Charge,
                    ChargeAmount: TACTRateArray[0].ChargeAmount,
                    WeightCode: TACTRateArray[0].WeightCode,
                }
                TactArray.push(tactdata);
                $("#tblAWBRateDesription > tfoot > tr > td > button:nth-child(1)").after("<span class='ui-button-text' id='spanTactRate'>TACT Rate: " + TACTRateArray[0].Charge + "</span>");
            }
            if ($("#DecCarriageVal").val() == "")
                $("#_tempDecCarriageVal").val("NVD");
            $("#DecCarriageVal").val("NVD");
            if ($("#DecCustomsVal").val() == "")
                $("#_tempDecCustomsVal").val("NCV");
            $("#DecCustomsVal").val("NCV");
            if ($("#Insurance").val() == "")
                $("#_tempInsurance").val("XXX");
            $("#Insurance").val("XXX");
            $("#DecCarriageVal").bind("blur", function () {
                if ($("#DecCarriageVal").val() == "") {
                    $("#DecCarriageVal").val("NVD");
                    $("#_tempDecCarriageVal").val("NVD");
                }
            });

            $("#DecCustomsVal").bind("blur", function () {
                if ($("#DecCustomsVal").val() == "") {
                    $("#DecCustomsVal").val("NCV");
                    $("#_tempDecCustomsVal").val("NCV");
                }
            });

            $("#Insurance").bind("blur", function () {
                if ($("#Insurance").val() == "") {
                    $("#Insurance").val("XXX");
                    $("#_tempInsurance").val("XXX");
                }
            });

            $("#CDCTotalCharAmount").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CDCChargeAmount").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#CDCConversionRate").unbind("keypress").bind("keypress", function () {
                ISNumericNew(this);
            });

        },
        error: {

        }
    });
}

function EnableDisableChargeField() {
    if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
        $('#CDCChargeAmount').removeAttr('disabled');
        $('#CDCTotalCharAmount').removeAttr('disabled');
        $('#Text_CDCCurrencyCode').removeAttr('disabled');
        $('#CDCConversionRate').removeAttr('disabled');
        $('#Text_CDCDestCurrencyCode').removeAttr('disabled');
    } else {
        $('#CDCChargeAmount').val('');
        $('#_tempCDCChargeAmount').val('');
        $('#CDCTotalCharAmount').val('');
        $('#_tempCDCTotalCharAmount').val('');
        $('#CDCConversionRate').val('');
        $('#CDCChargeAmount').attr("disabled", "disabled");
        $('#CDCTotalCharAmount').attr("disabled", "disabled");
        $('#Text_CDCCurrencyCode').attr("disabled", "disabled");
        $('#CDCConversionRate').attr("disabled", "disabled");
        $('#Text_CDCDestCurrencyCode').attr("disabled", "disabled");
        $('#Text_CDCCurrencyCode').val('');
    }
    // calculate Total of rates fetched from Get Rate 
    CalculateRateTotal();
}

var CurrentRow;
function PopupDiv(obj) {
    CurrentRow = obj;
    var HidDataVal = $(obj).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val();
    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    if (HidDataVal != 0 && HidDataVal != "undefined") {
        $("#tblAWBRateDesriptionChild").appendGrid('load', JSON.parse(HidDataVal));
    }
    //else {
    //    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    //}

    $("div[id=ChildGrid]").not(':first').remove();
    if (!$("#ChildGrid").data("kendoWindow"))
        cfi.PopUp("ChildGrid", "", null, null, ShowAlert);
    else
        $("#ChildGrid").data("kendoWindow").open();
    //cfi.PopUp("ChildGrid", "", null, null, ShowAlert);

}
function ShowAlert(e) {
    //var strData;
    //var rows = $("tr[id^='tblAWBRateDesriptionChild']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    //getUpdatedRowIndex(rows.join(","), "tblAWBRateDesriptionChild");
    //strData = $('#tblAWBRateDesriptionChild').appendGrid('getStringJson');
    var childdata = [];
    $("#tblAWBRateDesriptionChild").find("tr[id^='tblAWBRateDesriptionChild_Row_']").each(function (i, row) {
        var dimInfo = {
            SNo: i + 1,
            AWBSNo: currentawbsno,
            Length: $(row).find("[id^=tblAWBRateDesriptionChild_Length_]").val() || "0",
            Width: $(row).find("[id^=tblAWBRateDesriptionChild_Width_]").val() || "0",
            Height: $(row).find("[id^=tblAWBRateDesriptionChild_Height_]").val() || "0",
            MeasurementUnitCode: $(row).find("[id^=tblAWBRateDesriptionChild_MeasurementUnitCode_]").val() || "0",
            Pieces: $(row).find("[id^=tblAWBRateDesriptionChild_Pieces_]").val() || "0",
            VolumeWeight: $(row).find("[id^=tblAWBRateDesriptionChild_VolumeWeight_]").val() || "0",
            VolumeUnit: $(row).find("[id^=tblAWBRateDesriptionChild_VolumeUnit_]").val() || "0",
            AWBRateDescriptionSNo: "0"
        }
        childdata.push(dimInfo);
    });

    $(CurrentRow).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val(JSON.stringify(childdata));
}
function BindDimensionChildGrid(tableid) {
    var dbtableName = tableid;
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Import/ImportFWBService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDChild",
        isGetRecord: false,
        masterTableSNo: 10,
        caption: "Dimension Information",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: "MeasurementUnitCode", display: "Mes. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CalculateVol(this);" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "MeasurementUnitCode", textColumn: "UnitCode", templateColumn: "", keyColumn: "UnitCode", templateColumn: ["UnitCode", "UnitName"]
                 },
                 {
                     name: 'Length', display: 'Length', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                {
                    name: 'Width', display: 'Width', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
                },
                 {
                     name: 'Height', display: 'Height', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
                 },

                {
                    name: 'Pieces', display: 'Pieces', type: 'text', value: 0, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
                },
                  {
                      name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: 0
                  },
                     {
                         name: "VolumeUnit", display: "Vol. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "VolumeCode", textColumn: "VolumeCode", templateColumn: ["VolumeCode", "Description"], keyColumn: "VolumeCode"
                     },

        { name: 'AWBRateDescriptionSNo', type: 'hidden', value: 0 },

        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }

    });
}



function BindAWBSummary(isdblclick) {
    cfi.AutoComplete("OPIAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("OPIOfficeDesignator", "Code", "OfficeFunctionDesignator", "Code", "Code", "", null, "contains");
    cfi.AutoComplete("OPIOtherAirportCity", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    //cfi.AutoComplete("REFAirportCityCode", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    //cfi.AutoComplete("REFOfficeDesignator", "Code", "OfficeFunctionDesignator", "Code", "Code", "", null, "contains");
    cfi.AutoComplete("REFOthAirportCityCode", "AirportCode", "Airport", "AirportCode", "AirportCode", ["AirportCode", "AirportName"], null, "contains");

    //cfi.AutoComplete("CORCustomsOriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("ISUPlace", "CityCode", "City", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetAWBSummary?AWBSNo=" + currentawbsno + "&OfficeSNo=" + userContext.OfficeSNo || "0", async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var SummaryArray = Data.Table0;
            var SenderRefArray = Data.Table1;

            var AirportCityData = [];
            var OfficeDesignatorData = [];
            var CompanyDesignatorData = [];

            if (SenderRefArray.length > 0) {
                for (i = 0; i < SenderRefArray.length; i++) {
                    var AirportCityinfo = {
                        Key: SenderRefArray[i]["AirportCity"],
                        Text: SenderRefArray[i]["AirportCity"]
                    };
                    var OfficeDesignatorinfo = {
                        Key: SenderRefArray[i]["OfficeDesignator"],
                        Text: SenderRefArray[i]["OfficeDesignator"]
                    };
                    var CompanyDesignatorinfo = {
                        Key: SenderRefArray[i]["CompanyDesignator"],
                        Text: SenderRefArray[i]["CompanyDesignator"]
                    };

                    AirportCityData.push(AirportCityinfo);
                    OfficeDesignatorData.push(OfficeDesignatorinfo);
                    CompanyDesignatorData.push(CompanyDesignatorinfo);
                }
            }
            cfi.AutoCompleteByDataSource("REFAirportCityCode", AirportCityData);
            cfi.AutoCompleteByDataSource("REFOfficeDesignator", OfficeDesignatorData);
            cfi.AutoCompleteByDataSource("REFCompDesignator", CompanyDesignatorData);


            if (SummaryArray.length > 0) {
                $('#CEDate').parent().css('width', '100px');
                //-- SSR (Special Service Request)
                $("#SSRDescription").val(SummaryArray[0].SpecialServiceRequest1);
                $("#SSRDescription2").val(SummaryArray[0].SpecialServiceRequest2);
                $("#SSRDescription3").val(SummaryArray[0].SpecialServiceRequest3);

                // ARD (Agent Reference Data)
                $("#ARDFileRefrence").val(SummaryArray[0].ARDFileRefrence);

                // OPI (Other Participant Information)
                $("#OPIName").val(SummaryArray[0].ARDFileRefrence);
                $("#Text_OPIAirportCity").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIAirportCityCode, SummaryArray[0].OPIAirportCityCode);
                $("#Text_OPIOfficeDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIOfficeFunctionDesignator, SummaryArray[0].OPIOfficeFunctionDesignator);
                $("#OPICompDesignator").val(SummaryArray[0].OPICompanyDesignator);
                $("#OPIOtherFileReference").val(SummaryArray[0].OPIOtherParticipantOfficeFileReference);
                $("#OPIParticipantCode").val(SummaryArray[0].OPIParticipantCode);
                $("#Text_OPIOtherAirportCity").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].OPIOtherAirportCityCode, SummaryArray[0].OPIOtherAirportCityCode);

                // SRI (Shipment Reference Information)
                $("#SRIRefNumber").val(SummaryArray[0].SRIReferenceNumber);
                $("#SRISupInfo1").val(SummaryArray[0].SRISupplementaryShipmentInformation1);
                $("#SRISupInfo2").val(SummaryArray[0].SRISupplementaryShipmentInformation2);

                // SI (Shipper's Certification)
                $("#CERSignature").val(SummaryArray[0].CERSignature);

                // Carrier's Execution
                $("#CEDate").data("kendoDatePicker").value(SummaryArray[0].ISUDate);
                $("#Text_ISUPlace").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].ISUPlace, SummaryArray[0].ISUPlace);
                $("#ISUSignature").val(SummaryArray[0].ISUSignature);

                // Sender Reference
                $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFAirportCityCode, SummaryArray[0].REFAirportCityCode);
                $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOfficeFunctionDesignator, SummaryArray[0].REFOfficeFunctionDesignator);
                $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFCompanyDesignator, SummaryArray[0].REFCompanyDesignator);

                $("#REFCompDesignator").val(SummaryArray[0].REFCompanyDesignator);
                $("#REFOthPartOfficeFileRef").val(SummaryArray[0].REFOtherParticipantOfficeFileReference);
                $("#REFParticipantCode").val(SummaryArray[0].REFParticipantCode);
                $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOtherAirportCityCode, SummaryArray[0].REFOtherAirportCityCode);
                //$("#Text_CORCustomsOriginCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].CORCustomsOriginCode, SummaryArray[0].CORCustomsOriginCode);
                $("#CORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
                //$("#_tempCORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
            }
            if ($("#Text_REFAirportCityCode").data("kendoAutoComplete").key() == "") {
                $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(AirportCityData[0]["Key"], AirportCityData[0]["Key"]);
            }
            if ($("#Text_REFOfficeDesignator").data("kendoAutoComplete").key() == "") {
                $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(OfficeDesignatorData[0]["Key"], OfficeDesignatorData[0]["Key"]);
            }
            if ($("#Text_REFCompDesignator").data("kendoAutoComplete").key() == "") {
                $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(CompanyDesignatorData[0]["Key"], CompanyDesignatorData[0]["Key"]);
            }
        },
        error: {

        }
    });
}
function BindXRayEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");

    cfi.AutoComplete("SecurityStatus", "Description", "SecurityCodes", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("SecurityIssuanc", "Description", "securityissuance", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("ScreeningMethod", "Description", "ScreeningMethods", "SNo", "Code", ["Code", "Description"], null, "contains");
    cfi.AutoComplete("ScreeningExemption", "Description", "ScreeningExemptions", "SNo", "Code", ["Code", "Description"], null, "contains");
    $("#Time").kendoTimePicker({
        format: "HH:mm"
    });

    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });

    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtXray?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var xrayData = jQuery.parseJSON(result);
            var xrayArray = xrayData.Table0;
            var arr = xrayData.Table1;
            var UldArray = xrayData.Table2;
            var OtherDetailsArray = xrayData.Table3;

            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();

            $("div[id$='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentxraydetail']:first").hide();

            if (xrayArray.length > 0) {
                for (var i = 0; i < xrayArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("td:last"), "areaTrans_importfwb_shipmentxraydetail", xrayArray[i].ScannedPieces, "ScanPieces", "RemainingPieces");

                    var row = $("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last");

                    row.find("input[type=hidden][id^='SLISNo']").val(xrayArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(xrayArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(xrayArray[i].SLINo);
                    row.find("span[id^='SLINo']").html(xrayArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(xrayArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(xrayArray[i].HAWBNo);
                }

            }
            else if ((isdblclick == undefined ? "FALSE" : isdblclick.toUpperCase()) == "TRUE") {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentxraydetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentxraydetail']:last").find("td:last"), "areaTrans_importfwb_shipmentxraydetail", dblscan, "ScanPieces", "RemainingPieces");
            }

            cfi.makeTrans("importfwb_shipmentxrayulddetail", null, null, null, null, null, UldArray);
            if (UldArray.length <= 0) {
                $("div[id$='areaTrans_importfwb_shipmentxrayulddetail']").find("[id='areaTrans_importfwb_shipmentxrayulddetail']:first").hide();
            }
            $('#divareaTrans_importfwb_shipmentxrayulddetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find('td:eq(6)').css("display", "none");
                if (row > 2) {
                    $(tr).find("span[id^='XrayStatus']").remove();
                    var checked = $(tr).find("input[id^='XrayStatus']").val() == "True" ? "checked='true'" : "";
                    $(tr).find('td:eq(5)').append("<input type='checkbox' name='chXray" + $(tr).find('td:eq(0)').text() + "' id='chXray" + $(tr).find('td:eq(0)').text() + "' " + checked + "'>");
                }
            });

            if (OtherDetailsArray.length > 0) {
                $("#Text_SecurityStatus").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].SecurityStatusSNo, OtherDetailsArray[0].Text_SecurityStatusSNo);
                $("#Text_SecurityIssuanc").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].SecurityIssuanceSNo, OtherDetailsArray[0].Text_SecurityIssuanceSNo);
                $("#Text_ScreeningMethod").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].ScreerningMethodSNo, OtherDetailsArray[0].Text_ScreerningMethodSNo);
                $("#Text_ScreeningExemption").data("kendoAutoComplete").setDefaultValue(OtherDetailsArray[0].ExemptionSNo, OtherDetailsArray[0].Text_ExemptionSNo);
                $("#OthScreeningMthd").val(OtherDetailsArray[0].OtherScreening);
                $("#AdditionalSecurity").val(OtherDetailsArray[0].AdditionalSecurity);
                $("#Name").val(OtherDetailsArray[0].IssuedBy);
                $("#Date").val(OtherDetailsArray[0].IssueDate);
                $("#Time").val(OtherDetailsArray[0].IssueTime);
            }


            $('#divareaTrans_importfwb_shipmentxraydetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
            });
            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}
function BindLocationEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI", "SLISNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetRecordAtLocation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var locationData = jQuery.parseJSON(result);
            var locationArray = locationData.Table0;
            var uldArray = locationData.Table1;

            if (uldArray.length > 0) {
                id = "areaTrans_importfwb_shipmentuldlocation"
                cfi.makeTrans("importfwb_shipmentuldlocation", null, null, BindLocationAutoCompleteForULD, ReBindLocationAutoCompleteForULD, null, uldArray)
                $('#divareaTrans_importfwb_shipmentuldlocation table tr td:last').remove();
                $('#divareaTrans_importfwb_shipmentuldlocation table tr[id!="areaTrans_importfwb_shipmentuldlocation"] td:eq(9)').remove();
            }



            cfi.makeTrans("importfwb_shipmentlocationdetail", null, null, BindLocationAutoComplete, ReBindLocationAutoComplete, null, null);

            $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentlocationdetail']:first").hide();
            $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id='areaTrans_importfwb_shipmentlocationdetail']:first").find("input[id^='Text_Location']").removeAttr("data-valid");
            if (uldArray.length > 0) {
                $("div[id$='divareaTrans_importfwb_shipmentuldlocation']").find("[id='areaTrans_importfwb_shipmentuldlocation']").each(function () {
                    $(this).find("input[id^='ULDLocation']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
                    });
                });
            }
            if (locationArray.length > 0) {
                for (var i = 0; i < locationArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentlocationdetail", locationArray[i].ScannedPieces, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
                    var row = $("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last");
                    row.find("[id^='Text_Location_']").data("kendoAutoComplete").setDefaultValue(locationArray[i].LocationSNo, locationArray[i].LocationName);

                    row.find("input[type=hidden][id^='SLISNo']").val(locationArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(locationArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(locationArray[i].SLINo);
                    row.find("span[id^='SLINo']").html(locationArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(locationArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(locationArray[i].HAWBNo);
                }

            }
            if (uldArray.length > 0) {
                //$("div[id='divareaTrans_importfwb_shipmentuldlocation']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentuldlocation']").each(function (row, tr) {
                //$(tr).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").setDefaultValue(uldArray[row].warehouselocationsno, uldArray[row].location);
                //});
                var RemainingPieces;
                RemainingPieces = $("input[id='RemainingPieces']").val();
                $("input[id='RemainingPieces']").val(RemainingPieces - uldArray.length);
                $("span[id='RemainingPieces']").html(RemainingPieces - uldArray.length);
            }
            else if (isdblclick) {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                for (var i = 1; i <= totalPcs; i++) {
                    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                }
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_importfwb_shipmentlocationdetail']").find("table:first").find("tr[id^='areaTrans_importfwb_shipmentlocationdetail']:last").find("td:last"), "areaTrans_importfwb_shipmentlocationdetail", dblscan, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
            }

            $('#divareaTrans_importfwb_shipmentuldlocation table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("td[id^=transAction]").hide();
                $(tr).find("input[id^='Text_ULDLocation']").closest('span').css('width', '');
            });
            if (uldArray.length == 0) {
                $('#divareaTrans_importfwb_shipmentuldlocation table tr[id^="areaTrans_importfwb_shipmentuldlocation"]').remove();
            }


            $('#divareaTrans_importfwb_shipmentlocationdetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
            });
            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                ISNumber(this);
            });
        },
        error: {

        }
    });
}
function BindLocationAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Location']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
    $(elem).find("input[id^='Text_Location']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        $(this).attr("data-valid", "required");
    });
}

function ReBindLocationAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentlocationdetail']").find("[id^='areaTrans_importfwb_shipmentlocationdetail']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).find("input[id^='ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });

    $(mainElem).find("input[id^='ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
    });
    $(elem).find("input[id^='Text_ULDLocation']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        //$(this).attr("data-valid", "required");
    });
}

function ReBindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_shipmentuldlocation']").find("[id^='areaTrans_importfwb_shipmentuldlocation']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function SetTotalPcs() {
    var totalPcs = parseInt($("#tdPcs").html());
    var addedPcs = 0;
    var remainingPcs = totalPcs - addedPcs;
    $("input[id='RemainingPieces']").val(remainingPcs);
    $("span[id='RemainingPieces']").html(remainingPcs);

    $("input[id='Added']").val(addedPcs);
    $("span[id='Added").html(addedPcs);

    $("input[id='TotalPieces']").val(totalPcs);
    $("span[id='TotalPieces']").html(totalPcs);

}

function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");

    $("#divDetailSHC").html("");
    $("#divTab3").html("");
    $("#divTab4").html("");
    $("#divTab5").html("");
    $('#tabstrip ul:first li:eq(0) a').hide();
    $('#tabstrip ul:first li:eq(1) a').hide();
    $('#tabstrip ul:first li:eq(2) a').hide();
    $('#tabstrip ul:first li:eq(3) a').hide();
    $('#tabstrip ul:first li:eq(4) a').hide();

}
