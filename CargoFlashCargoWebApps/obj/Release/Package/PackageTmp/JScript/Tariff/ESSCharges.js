var flags = 0;
var MType = '';
var BillTo = '';
var weight = '';
var Mtype = '';
var C = 0;
$(document).ready(function () {
    cfi.ValidateForm();
    var type = [{ Key: "SLI", Text: "SLI" }, { Key: "AWB", Text: "AWB" }, { Key: "ULD", Text: "ULD" }, { Key: "Flight", Text: "Flight" }, { Key: "Others", Text: "Others" }];
    var billto = [{ Key: "Agent", Text: "Agent" }, { Key: "Airline", Text: "Airline" }];
    Mtype = [{ Key: "2", value: "2", Text: "EXPORT" }, { Key: "1", value: "1", Text: "IMPORT" }, { Key: "3", value: "3", Text: "TRANSIT" }];
    var currentType = "";
    $("#AWB").before("<span id='FlightNo'style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>Flight/Truck No </span>");
    $("#FlightNo").on('hover', function () {
        $("#FlightNo").attr('title', 'Select Flight/Truck Number');
    });
    $('#FlightNo').hide();
    // BindIssueInvoice();
    $("#__SpanHeader__").css("color", "black");
    cfi.AutoComplete("BillToSNo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");
    //cfi.AutoCompleteByDataSource("MovementType", Mtype, onselectMtype, null);
    cfi.AutoCompleteByDataSource("MovementType", Mtype, Mblank, null);
    cfi.AutoCompleteByDataSource("Type", type, onselectType, null);
    cfi.AutoCompleteByDataSource("BillTo", billto, onBillToSelect, null);
    cfi.AutoComplete("Process", "ProcessName", "Process", "SNo", "ProcessName", null, null, "contains");
    cfi.AutoComplete("SubProcess", "SubProcessDisplayName", "SubProcess", "SNo", "SubProcessDisplayName", null, null, "contains");

    cfi.AutoComplete("BillToAgentName", "Name", "Account", "SNo", "Name", null, null, "contains");

    cfi.AutoComplete("AWB", "AWBNo", "vgetAWB", "SNO", "AWBNo", null, null, "contains");
    $("#Text_AWB").closest('.k-widget').hide();
    $('.k-datepicker').hide();
    $('#spnTypeValue').text('');
    $('#spnBillToSNo').text('');
    $("#Text_BillToSNo").closest('.k-widget').hide();
    //$("#Text_MovementType").attr("disabled", true);
    $("#ShipperName").css('text-transform', 'uppercase');
    //cfi.AutoComplete("IssuedTo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");
    BindESSCharges();

    //cfi.AutoComplete("IssuableItem", "Sno,Item", "VConsumablesStockItem", "Sno", "Item", null, null, "contains", null, null, null, null, OnSelectIssuableItem);

    $("#MovementType").val(2);
    $("#Text_MovementType").val("EXPORT");



    $('#Text_BillTo').attr('data-valid', 'required');
    $('#Text_BillTo').attr('data-valid-msg', 'Bill To can not be blank');
    $("#spnBillTo").before('<font color="red">*</font>')

    $("input").bind("keyup", function () {
        //if ($('#Type').val() == 'AWB') {
        //    PutColoninStartRange(this);
        //}
    });

    $("#Date").on('change', function () {
        $("#Text_AWB").val('');
    });

    $("input").blur(function () {
        if ($("#Text_MovementType").val() == "") {
            $("#MovementType").val(2);
            $("#Text_MovementType").val("EXPORT");
        }
    });
});


function blank() {
    $('#Text_BillTo').val('');
    $('#Text_BillToSNo').val('');
    $('#ShipperName').val('');
    //CheckWalkIn();
}

function Mblank() {
    $('#Text_BillTo').val('');
    $('#Text_BillToSNo').val('');
    $('#ShipperName').val('');
    $('#Text_AWB').val('');
    //CheckWalkIn();
}

function onselectMtype() {

    //cfi.ResetAutoComplete("Type");
    cfi.ResetAutoComplete("AWB");
    cfi.ResetAutoComplete("BillTo");
    cfi.ResetAutoComplete("BillToSNo");
    cfi.ResetAutoComplete("MovementType");
    //if ($('#MovementType').val() == '1') {
    //    var type = '';
    //    var type = [{ Key: "AWB", Text: "AWB" }, { Key: "ULD", Text: "ULD No" }, { Key: "Flight", Text: "Flight" }];
    //} else {
    //    var type = '';
    //    var type = [{ Key: "SLI", Text: "SLI" }, { Key: "AWB", Text: "AWB" }, { Key: "ULD", Text: "ULD No" }, { Key: "Flight", Text: "Flight" }];
    //}
    //cfi.ChangeAutoCompleteDataSource("Type", type, true, onselectType, "key", "contains");
    //cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, true, Mblank, "key", "contains");
    BindESSCharges();
}

function onBillToSelect(e) {

    if ($('#BillTo').val() == 'Airline') {
        $("#tblIssueDetail").find("table[id^='tableRbtnPaymentType']").each(function () {
            $(this).find('td:eq(1)').find("input:radio").attr("checked", "checked");
            $(this).find('td:eq(0)').find("input:radio").attr("disabled", "disabled");
        })
        $("#BillToSNo").val('');

    }
    if ($('#BillTo').val() == 'Agent') {

        $("#tblIssueDetail").find("table[id^='tableRbtnPaymentType']").each(function () {
            // $(this).find('td:eq(1)').find("input:radio").attr("checked", "checked");
            $(this).find('td:eq(0)').find("input:radio").attr("disabled", false);
        })
        $("#BillToSNo").val('');
    }



    cfi.ResetAutoComplete("BillToSNo");
    $("#Text_BillToSNo").closest('.k-widget').show();
    if ($('#BillTo').val() == 'Agent') {
        if ($('#MovementType').val() == '2') {

            if ($('#Type').val() == 'AWB') {
                $('#spnBillToSNo').text('Agent Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
                //var data = GetDataSource("BillToSNo", "VAccountForExport", "SNo", "Name", ["Name"], null);
                var data = GetDataSource("BillToSNo", "Account", "SNo", "Name", ["Name"], null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
            } else if ($('#Type').val() == 'SLI') {
                $('#spnBillToSNo').text('Agent Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
                //var data = GetDataSource("BillToSNo", "VAccountForSLIExport", "SNo", "Name", ["Name"], null);
                var data = GetDataSource("BillToSNo", "Account", "SNo", "Name", ["Name"], null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
            }
            else {
                $('#spnBillToSNo').text('Agent Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
                //var data = GetDataSource("BillToSNo", "VAccountForImport", "SNo", "Name", ["Name"], null);            
                var data = GetDataSource("BillToSNo", "Account", "SNo", "Name", ["Name"], null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
            }
        } else {
            $('#spnBillToSNo').text('Agent Name');
            $('#spnBillToSNo').closest('td').attr('title', 'Select Agent Name')
            //var data = GetDataSource("BillToSNo", "VAccountForImport", "SNo", "Name", ["Name"], null);
            var data = GetDataSource("BillToSNo", "Account", "SNo", "Name", ["Name"], null);
            cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
            $('#Text_BillToSNo').attr('data-valid', 'required');
            $('#Text_BillToSNo').attr('data-valid-msg', 'Agent Name can not be blank');
        }
    }
    else if ($('#BillTo').val() == 'Airline') {
        flags = 0;
        if ($('#MovementType').val() == '2') {
            if ($('#Type').val() == 'AWB') {
                $('#spnBillToSNo').text('Airline Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
                //var data = GetDataSource("BillToSNo", "VAirlineForAwb", "SNo", "AirlineName", ["AirlineName"], null);
                var data = GetDataSource("BillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
            } else if ($('#Type').val() == 'SLI') {
                $('#spnBillToSNo').text('Airline Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
                //var data = GetDataSource("BillToSNo", "VAirlineForSli", "SNo", "AirlineName", ["AirlineName"], null);
                var data = GetDataSource("BillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
            }
            else {
                $('#spnBillToSNo').text('Airline Name');
                $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
                //var data = GetDataSource("BillToSNo", "VAirlineForAwbImport", "SNo", "AirlineName", ["AirlineName"], null);
                var data = GetDataSource("BillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
                cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
                $('#Text_BillToSNo').attr('data-valid', 'required');
                $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
            }
        } else {

            $('#spnBillToSNo').text('Airline Name');
            $('#spnBillToSNo').closest('td').attr('title', 'Select Airline Name')
            //var data = GetDataSource("BillToSNo", "VAirlineForAwbImport", "SNo", "AirlineName", ["AirlineName"], null);
            var data = GetDataSource("BillToSNo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
            cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
            $('#Text_BillToSNo').attr('data-valid', 'required');
            $('#Text_BillToSNo').attr('data-valid-msg', 'Airline Name can not be blank');
        }

    }

    var AWBSNo = $('#AWB').val();

    if (AWBSNo != "") {
        // if ($('#Text_BillTo').val() == "Agent") {
        $.ajax({
            url: "./Services/ULD/CityWiseULDAllocationService.svc/GetAgentName", async: false, type: "post", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: AWBSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var basis = JSON.parse(result);
                var res = basis.Table0
                var res1 = basis.Table1;
                var res2 = basis.Table2;
                var res3 = basis.Table3;
                var res4 = basis.Table4;
                if ($('#MovementType').val() == '2') {
                    if ($('#Text_BillTo').val() == "Agent") {
                        if (res.length > 0) {

                            //$('#Text_BillToSNo').val(res[0].Name)

                            //$('#Text_BillToSNo').prop("disabled", true);
                            $('#Text_BillToSNo').prop("disabled", false);
                        }
                        else {
                            if (res1.length > 0) {
                                //$('#Text_BillToSNo').val(res1[0].Name)
                                //$('#Text_BillToSNo').prop("disabled", true);
                                $('#Text_BillToSNo').prop("disabled", false);
                            }
                        }
                    }
                    if ($('#Text_BillTo').val() == "Airline") {
                        if (res2.length > 0) {
                            // $('#Text_BillToSNo').val(res2[0].AirlineName)
                        }
                        else {
                            if (res3.length > 0) {
                                //    $('#Text_BillToSNo').val(res3[0].AirlineName)
                            }
                        }
                    }
                }
                else {
                    if (res4.length > 0) {
                        // $('#Text_BillToSNo').val(res4[0].Name)
                    }

                }
            }
        });
        //}
    }
    BindESSCharges();
}

function 
    onselectType() {

    cfi.ResetAutoComplete("AWB");
    cfi.ResetAutoComplete("BillTo");
    cfi.ResetAutoComplete("BillToSNo");
    cfi.ResetAutoComplete("MovementType");
    $('#ShipperName').val('');
    $('#ShipperName').attr('readonly', false);
    if ($('#Type').val() != "") {
        $("#Text_AWB").closest('.k-widget').show();
        $('#Text_AWB').removeAttr('data-valid');
        $('#Text_AWB').removeAttr('data-valid-msg');
        weight = '';
    }
    if ($('#Type').val() == 'AWB') {
        $('#Text_AWB').show();
        $('#Text_AWB').closest('span').show();
        $('#Text_AWB').val('');
        $('#FlightNo').hide();
        $('.k-datepicker').hide();
        $('#spnTypeValue').text('AWB No.');
        $('#spnTypeValue').closest('td').attr('title', 'Select AWB Number');
        $('#Text_AWB').closest('span').css('width', '175px');
        $('#Text_AWB').attr('data-valid', 'required');
        $('#Text_AWB').attr('data-valid-msg', 'AWB Number can not be blank');
        //$("#Text_MovementType").attr("disabled", false);

        var data = GetDataSource("AWB", "vgetAWB", "SNO", "AWBNo", ["AWBNo"], null);
        cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "AWBNo", "contains");
        //cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, true, Mblank, "key", "contains");
        cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, Mblank, null);
    }
    else if ($('#Type').val() == 'Flight') {
        $('#spnTypeValue').text('Flight/Truck Date');
        $('#spnTypeValue').closest('td').attr('title', 'Select Flight/Truck Date');
        $('.k-datepicker').show();
        $('#FlightNo').show();
        $('#Text_AWB').show();
        $('#Text_AWB').closest('span').show();
        $('#Text_AWB').val('');
        $('#Text_AWB').attr('data-valid', 'required');
        $('#Text_AWB').attr('data-valid-msg', 'Flight/Truck Number can not be blank.');
        $('#Date').closest('span').css('width', '80px')
        $('#Text_AWB').closest('span').css('width', '120px');
        var data = GetDataSource("AWB", "VFlightEss", "SNo", "FlightNo", ["FlightNo"], null);
        cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "FlightNo", "contains");
        cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, Mblank, null);
    }
    else if ($('#Type').val() == 'ULD') {
        $('#Text_AWB').show();
        $('#Text_AWB').closest('span').show();
        $('#Text_AWB').val('');
        $('#spnTypeValue').text('ULD No.');
        $('#spnTypeValue').closest('td').attr('title', 'Select ULD Number');
        $('#FlightNo').hide();
        $('.k-datepicker').hide();
        $('#Text_AWB').attr('data-valid', 'required');
        $('#Text_AWB').attr('data-valid-msg', 'ULD Number can not be blank.');
        $('#Text_AWB').closest('span').css('width', '175px');
        var data = GetDataSource("AWB", "vgetESSULD", "SNO", "ULDNo", ["ULDNo"], null);
        cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "ULDNo", "contains");
        cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, Mblank, null);
    }
    else if ($('#Type').val() == 'SLI') {
        ///  $('#Text_AWB').show();
        $('#Text_AWB').closest('span').show();
        $('#Text_AWB').val('');
        $('#spnTypeValue').text('Lot No.');
        $('#spnTypeValue').closest('td').attr('title', 'Select SLI Number');
        $('#FlightNo').hide();
        $('.k-datepicker').hide();
        $('#Text_AWB').attr('data-valid', 'required');
        $('#Text_AWB').attr('data-valid-msg', 'SLI Number can not be blank.');
        $('#Text_AWB').closest('span').css('width', '175px');
        var data = GetDataSource("AWB", "vSli", "SNO", "SLINo", ["SLINo"], null);
        cfi.ChangeAutoCompleteDataSource("AWB", data, true, blank, "SLINo", "contains");
        var MtypeS = [{ Key: "2", value: "2", Text: "EXPORT" }];
        cfi.ChangeAutoCompleteDataSource("MovementType", MtypeS, Mblank, null);
    }
    else if ($('#Type').val() == 'Others') {
        $('#Text_AWB').closest('span').hide();
        $('#Text_AWB').val('');
        $('#spnTypeValue').text('');
        $('#FlightNo').hide();
        $('.k-datepicker').hide();
        var MtypeO = [{ Key: "1", value: "1", Text: "IMPORT" }];
        cfi.ChangeAutoCompleteDataSource("MovementType", Mtype, Mblank, null);
    }
}

function ExtraCondition(textId) {

}

function BindESSCharges() {
    _CURR_PRO_ = "ESS";
    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/ESSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblIssueDetail").html(result);

            $("#tblIssueDetail").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            cfi.makeTrans("tariff_tariffdohandlingcharge", null, null, BindChargesItemAutoComplete, ReBindChargesItemAutoComplete, null, null);

            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                $(this).find("input[id^='ChargeName']").each(function () {
                    if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                        AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
                    }
                });
                               

                cfi.Numeric($(this).find("input[id^='PValue']").attr("id"), 2);

                cfi.Numeric($(this).find("input[id^='SValue']").attr("id"), 2);

                //cfi.Numeric($(this).find("input[id^='Rate']").attr("id"), 2);

                $('#spnWaveOff').hide();
                $(this).find("input[id^='WaveOff']").hide();
                $(this).find("input[id^='PValue']").attr('data-valid', 'required');
                $(this).find("input[id^='PValue']").attr('data-valid-msg', 'Primary value can not be blank');
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

function BindChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
    });

    cfi.Numeric($(elem).find("input[id^='PValue']").attr("id"), 2);

    //$(elem).find("input[id^='PValue']").each(function () {
    //    var currentID = $(elem)[0].id;
    //    $('#' + currentID).on("keydown", function (event) {
    //        var charCode = (event.which) ? event.which : event.keyCode;
    //        if (charCode == 8) {
    //            // let it happen, don't do anything
    //        }
    //        else {
    //            // Ensure that it is a number and stop the keypress
    //            if (charCode == 110) {
    //                $(elem).find("input[id^='PValue']").val($(elem).find("input[id^='PValue']").val().replace('.', ''));
    //            }
    //        }
    //    });
    //});

    cfi.Numeric($(elem).find("input[id^='SValue']").attr("id"), 2);

    //$(elem).find("input[id^='SValue']").each(function () {
    //    var currentID = $(elem)[0].id;
    //    $('#' + currentID).on("keydown", function (event) {
    //        var charCode = (event.which) ? event.which : event.keyCode;
    //        if (charCode == 8) {
    //            // let it happen, don't do anything
    //        }
    //        else {
    //            // Ensure that it is a number and stop the keypress
    //            if (charCode == 110) {
    //                $(elem).find("input[id^='SValue']").val($(elem).find("input[id^='SValue']").val().replace('.', ''));
    //            }
    //        }
    //    });
    //});

    //cfi.Numeric($(this).find("input[id^='Rate']").attr("id"), 2);


    if (flags == 1) {
        $(elem).find("input[id^='PaymentMode']").each(function () {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
            $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
        });
    }
    else if (flags == 2) {
        $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
            $(elem).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(elem).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(elem).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 2;
        });
    }
    else {
        $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
            $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 0;
        });
    }
    $('#spnWaveOff').hide();
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='PValue']").attr('data-valid', 'required');
    $(elem).find("input[id^='PValue']").attr('data-valid-msg', 'Primary value can not be blank');
}

function ReBindChargesItemAutoComplete(elem, mainElem) {
    //$(elem).find("input[id^='ChargeName']").each(function () {
    //    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, "contains", null, null, null, "getHandlingChargesIE", "", $("#AWB").val(), ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0), userContext.CityCode, $("#MovementType").val(), "", "2", "999999999", "No");
    //});


    //if (flags == 1) {
    //    $(elem).find("input[id^='PaymentMode']").each(function () {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
    //        $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
    //    });
    //}
    //else if (flags == 2) {
    //    $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
    //        $(elem).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
    //        $(elem).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
    //        $(elem).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //        flags = 2;
    //    });
    //}
    //else {
    //    $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //        $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //        flags = 0;
    //    });
    //}


    $(elem).find("input[id^='SBasis']").each(function (i, row) {
        if ($(elem).find("span[id^='SBasis']").text() == '') {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
        }
        else {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
        }
        $(elem).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
    });
    $('#spnWaveOff').hide();
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='PValue']").attr('data-valid', 'required');
    $(elem).find("input[id^='PValue']").attr('data-valid-msg', 'Primary value can not be blank');
}

function calculateAmount(id) {

    var idvalIndex = id.id.split('_')[2]
    //var lstItem = [];
    //    var r = {

    //        TariffSNo: $('#tblIssueDetail_HdnServiceName_' + idvalIndex + '').val(),
    //        PaymentType: $('input:radio[name=tblIssueDetail_RbtnPaymentType_' + idvalIndex + ']:checked').val(),
    //        PrimaryValue: $('#tblIssueDetail_PrimaryValue_' + idvalIndex ).val() == '' ? '0' : $('#tblIssueDetail_PrimaryValue_' + idvalIndex ).val(),
    //        SecondaryValue: $('#tblIssueDetail_SecondaryValue_' + idvalIndex ).val() == '' ? '0' : $('#tblIssueDetail_SecondaryValue_' + idvalIndex ).val()
    //    }
    //    lstItem.push(r);


    var obj = {
        MomvementType: $('#MovementType').val(),
        Type: $('#Type').val(),
        TypeValue: $('#AWB').val(),
        BillTo: $("#BillTo").val() == '' ? '0' : $('#BillTo').val(),
        BillToSNo: $('#BillToSNo').val() == '' ? '0' : $('#BillToSNo').val(),
        FlightDate: $('#Date').val(),
        TariffSNo: $('#tblIssueDetail_HdnServiceName_' + idvalIndex + '').val(),
        PrimaryValue: $('#tblIssueDetail_PrimaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblIssueDetail_PrimaryValue_' + idvalIndex).val(),
        SecondaryValue: $('#tblIssueDetail_SecondaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblIssueDetail_SecondaryValue_' + idvalIndex).val()
        // LstESSCharges: lstItem
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetESSChargesTotal",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data > 1) {
                $('#tblIssueDetail_Amount_' + idvalIndex).text(data);

                $('#tblIssueDetail_hdnAmount_' + idvalIndex).val(data);
            }
            else {
                $('#tblIssueDetail_Amount_' + idvalIndex).text('0');

                $('#tblIssueDetail_hdnAmount_' + idvalIndex).val('0');
            }

        }
    });
    calculateTotalCash();
}
function onchangeservicename(id, val) {

    var index = id.split('_')[2];
    var ss = $('#tblIssueDetail_ServiceName_1').val();
    if ($('#tblIssueDetail_ServiceName_' + index).val() != '') {
        var serviceName = val.split('[')[1].split(']')[0];
        if (serviceName.split('-').length > 1) {

            $('#tblIssueDetail_PrimaryValue_' + index).val('');
            $('#tblIssueDetail_SecondaryValue_' + index).val('');

            $('#_temptblIssueDetail_PrimaryValue_' + index).val('');
            $('#_temptblIssueDetail_SecondaryValue_' + index).val('');

            $('#tblIssueDetail_lblPrimaryValue_' + index).text('');
            $('#tblIssueDetail_lblSecondaryValue_' + index).text('');
            $('#tblIssueDetail_lblPrimaryValue_' + index).text(serviceName.split('-')[0]);
            $('#tblIssueDetail_lblSecondaryValue_' + index).text(serviceName.split('-')[1]);
            $('#tableSecondaryValue' + index).show();
        } else {
            $('#_temptblIssueDetail_PrimaryValue_' + index).val('');
            $('#_temptblIssueDetail_SecondaryValue_' + index).val('');
            $('#tblIssueDetail_PrimaryValue_' + index).val('');
            $('#tblIssueDetail_SecondaryValue_' + index).val('');

            $('#tblIssueDetail_lblPrimaryValue_' + index).text('');
            $('#tblIssueDetail_lblSecondaryValue_' + index).text('');
            $('#tblIssueDetail_lblPrimaryValue_' + index).text(serviceName.split('-')[0])

            $('#tableSecondaryValue' + index).hide();
        }
    }

}


$(".btn-success").click(function () {

    if (!cfi.IsValidForm()) {
        return false;
    }

    if ($('#tblIssueDetail_rowOrder').val() == '' || $('#tblIssueDetail_rowOrder').val() == 0) {
        ShowMessage('warning', 'Warning ', "Select at least one ESS .", "bottom-right");
        return false;
    }



    var HandlingChargeArray = [];
    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: $('#AWB').val(),
                WaveOff: 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
                Rate: $(this).find("[id^='Amount']").text(),
                Min: 1,
                Mode: $(this).find("[id^='PaymentMode']:checked").val(),
                ChargeTo: $("#Text_BillToSNo").data("kendoAutoComplete").key(),
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']")[1].innerText == undefined ? "" : $(this).find("[id^='Remarks']")[1].innerText.toUpperCase(),
                WaveoffRemarks: ''
            };
            if ($(this).find("[id^='PaymentMode']:checked").val() == 0) {
                C = 1;
            }
            HandlingChargeArray.push(HandlingChargeViewModel);

        }

    });



    var obj = {
        MomvementType: $('#MovementType').val(),
        Type: $('#Type').val(),
        TypeValue: $('#AWB').val(),
        BillTo: $("#BillTo").val() == '' ? '0' : $('#BillTo').val(),
        BillToSNo: $('#BillToSNo').val() == '' ? '0' : $('#BillToSNo').val(),
        FlightDate: $('#Date').val(),
        BillToAgentName: $("#BillToAgentName").val(),
        ShipperName: $("#ShipperName").val(),
        Process: $("#Process").val(),
        SubProcess: $("#SubProcess").val(),
        LstDOHandlingCharges: HandlingChargeArray
    }



    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/CreateESSCharges",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != '' || data != '1') {
                alert('ESS Charge Applied Successfully for Invoice ' + data);
                $("input[name='operation']").prop('type', 'button');
                if (C == 1)
                    navigateUrl('Default.cshtml?Module=Shipment&Apps=Payment&FormAction=INDEXVIEW');
                else
                    navigateUrl('Default.cshtml?Module=Report&Apps=WorkOrder&FormAction=INDEXVIEW');
            } else {
                ShowMessage('warning', 'Warning - ESS Charges', "Record Not Saved Please Try Again ", "bottom-right");
            }

        }
    });


});

var pValue = 0;
var sValue = 0;
function GatValueOfAutocomplete(valueId, value, keyId, key) {
    pValue = 0;
    sValue = 0;
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

            if ($("#Text_MovementType").val() == "") {
                ShowMessage('warning', '', "Select Movement Type");
                $("#"+valueId).val('');
                return false;
            }

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/ESSGetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(($("#AWB").val() == '' ? 0 : $("#AWB").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + $("#MovementType").val() + "&RateType=" + ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0) + "&Remarks=" + ($("#Type").val() == '' ? 'AWB' : $("#Type").val()),
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").val(0);
                            }
                            else {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").text(doItem.SecondaryBasis);
                            }
                            //if (doItem.Rate != undefined || doItem.Rate != "" || doItem.Rate != 0.00) {
                            //    $("input[id='Rate']").closest("td").find("input[id^='_tempRate']").val(doItem.Rate);
                            //    $("input[id='Rate']").closest("td").find("input[id^='Rate']").val(doItem.Rate);
                            //    $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                            //}
                            //else {
                            //    $("input[id='Rate']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                            //}
                            $("span[id='Amount']").text(doItem.ChargeAmount);
                            $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id='Remarks']").text(doItem.ChargeRemarks);
                            if (doItem.PrimaryBasis == 'KG' && (doItem.pValue == '' || doItem.pValue == 0.00)) {
                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(weight);
                                $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").focus();
                            }
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").val(0);
                            }
                            else {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            }
                            //if (doItem.Rate != undefined || doItem.Rate != "" || doItem.Rate != 0.00) {
                            //    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='_tempRate']").val(doItem.Rate);
                            //    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").val(doItem.Rate);
                            //    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', true);
                            //}
                            //else {
                            //    $("input[id='Rate_" + rowId + "']").closest("td").find("input[id^='Rate']").attr('readonly', false);
                            //}
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(weight);
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").focus();
                            }
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").focus();
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                        if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                            $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                            $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                        }
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
    if (rowId == undefined) {
        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").focus();
        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").blur();
    }
    else {
        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").focus();
        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").blur();
    }
}

var dourl = 'Services/AutoCompleteService.svc/ESSAutoCompleteDataSource';
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

function PutColoninStartRange(obj) {
    var s = $("#" + obj.id).val().length
    if (s == 3) {
        if (obj.id == "Text_AWB")
            $("#" + obj.id).val($("#" + obj.id).val() + '-');
    }
}

function calculateTotalCash() {
    var strData;
    var cash = 0, credit = 0;
    var res = $("#tblIssueDetail tr[id^='tblIssueDetail']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblIssueDetail');

    var data = JSON.parse(($('#tblIssueDetail').appendGrid('getStringJson')));


    for (var num = 0; num < data.length; num++) {
        if (data[num].PaymentType == 0) {
            cash = parseFloat(cash) + parseFloat(data[num].hdnAmount);
        } else if (data[num].PaymentType == 1) {
            credit = parseFloat(credit) + parseFloat(data[num].hdnAmount);
        }
    }

    $('#spntotalcredit').text(credit);
    $('#spntotalcash').text(cash);


}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "AWB") {
        try {



            if ($('#Type').val() == 'AWB') {
                //cfi.setFilter(filterEmbargo, "DestinationAirport", "eq", userContext.CityCode)
                //cfi.setFilter(filter, "AWBTYPE", "eq", $("#MovementType").val())
                cfi.setFilter(filter, "MovementTypeSNo", "eq", $("#MovementType").val())
                cfi.setFilter(filter, "AirportCode", "eq", userContext.CityCode)

            }
            else if ($('#Type').val() == 'Flight') {
                if ($("#MovementType").val() == 1)
                    var city = "DestinationAirportCode";
                else
                    var city = "OriginAirportCode";
                cfi.setFilter(filter, city, "eq", userContext.CityCode)
                cfi.setFilter(filter, "FlightDate", "eq", $("#Date").val())
            }
                //else if ($('#Type').val() == 'ULD') {
                //    cfi.setFilter(filter, "CurrentCityCode", "eq", userContext.CityCode)
                //}
            else if ($('#Type').val() == 'SLI') {
                cfi.setFilter(filter, "AirportCode", "eq", userContext.CityCode)

            }

            var fileterAWB = cfi.autoCompleteFilter([filter]);
            return fileterAWB;
        }
        catch (exp)
        { }



    }

    if (textId == 'BillToSNo') {
        try {
            if ($('#MovementType').val() == '2') {

                //if ($('#Type').val() == 'AWB') {
                //    cfi.setFilter(filter, "AWBSNo", "eq", $("#AWB").val())

                //} else if ($('#Type').val() == 'SLI') {
                //    cfi.setFilter(filter, "SLISNo", "eq", $("#AWB").val())
                //}
            }
            else {
                //$('#spnBillToSNo').text('Agent Name');
                ////var data = GetDataSource("BillToSNo", "VAccountForImport", "SNo", "Name", ["Name"], null);            
                //var data = GetDataSource("BillToSNo", "vAccountForAgent", "SNo", "Name", ["Name"], null);
                //cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, null, "Name", "contains");
                //$('#Text_BillToSNo').attr('data-valid', 'required');
                //$('#Text_BillToSNo').attr('data-valid-msg', 'Enter Agent.');
            }
            var fileterAWB = cfi.autoCompleteFilter([filter]);
            return fileterAWB;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_SubProcess") {

        try {

            cfi.setFilter(filter, "ProcessSno", "eq", $("#Process").val())
            var fileterAWB = cfi.autoCompleteFilter([filter]);
            return fileterAWB;
        }
        catch (exp)
        { }
    }


    var x = textId.split('_')[2];
    if (x != undefined) {
        if (textId == 'Text_ChargeName_' + x) {
            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {

                if (x != i - 1) {
                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;
        }
    }
    else {
        if (textId == 'Text_ChargeName') {
            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {
                if (i != 0) {
                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;
        }
    }

}

function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
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
    SetDateRangeValue();
    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });
    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });
    $("input[name='operation']").click(function () {
        _callBack();
    });
    $("[id$='divRemoveRecord']").hide();
    //$("input[name='operation']").click(function () {
    //    if (cfi.IsValidSubmitSection()) {
    //      //  StartProgress();
    //        if ($(this).hasClass("removeop")) {
    //            $("#" + formid).trigger("submit");
    //        }
    //     //   StopProgress();
    //        return true;
    //    }
    //    else {
    //        return false
    //    }
    //});
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
    $("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
        var transid = this.id.replace("divareaTrans_", "");
        cfi.makeTrans(transid, null, null, null, null, null, null);
    });
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

function GetChargeValue(obj) {


    rowId = obj.id.split("_")[1];
    totalAmountDO = 0;
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > -1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? ($("#" + obj.id.replace("PValue", "SValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("PValue", "SValue")).val()) : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("SValue", "PValue")).val() != "" ? ($("#" + obj.id.replace("SValue", "PValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("SValue", "PValue")).val()) : 0;
    }

    if (tariffSNo == "" || tariffSNo == undefined) {
        alert("Please select Charges.");
    }
    else {
        totalHandlingCharges = 0;
        totalAmountDO = 0;
        //var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
        var hawbSNo = 0;
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/ESSGetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(($("#AWB").val() == '' ? 0 : $("#AWB").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseFloat(pValue) + "&SValue=" + parseFloat(sValue) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + $("#MovementType").val() + "&RateType=" + ($("#BillTo").val().toUpperCase() == "AIRLINE" ? 1 : 0) + "&Remarks=" + ($("#Type").val() == '' ? 'AWB' : $("#Type").val()),
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").text(doItem.SecondryBasis);
                        $("span[id='Amount']").text(doItem.ChargeAmount);
                        $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id='Remarks']").text(doItem.ChargeRemarks);
                    }
                    else {
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                        $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                        $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                    }
                }
                $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        });
    }

    //CheckCreditLimitMode(obj)
}

function CheckCreditLimit(obj) {
    if ($("#BillTo").val() != 'Airline') {
        var total = 0;
        var value = ($("#" + obj.id + ":checked").val() == undefined ? ($("#" + obj.id).closest('tr').find('[id^=PaymentMode]:checked').val()) : $("#" + obj.id + ":checked").val());
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            if ($(this).find("[id^='PaymentMode']:checked").val() == 1)
                total = parseFloat(total) + parseFloat($(this).find("span[id^='Amount']").text());
        });
        //var total = $("#" + obj.id).closest('td').prev().prev().text();
        var BillToSNo = $("#BillToSNo").val();
        if (value == 1) {
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    FinalData = dataTableobj.Table0;
                    if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                        //$("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        //    if ($(this).find("[id^='PaymentMode']:checked").val() == 1) {
                        //        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        //        //$(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        //    }
                        //    flags = 0;
                        //});

                        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(0).attr("checked", 'checked');
                        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
                        flags = 0;
                        if (FinalData[0].Column2 != '')
                            ShowMessage('warning', '', FinalData[0].Column2);
                    }
                    else {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(obj).closest('tr').index() == (i + 1)) {
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                                flags = 0;
                            }
                        });
                    }
                }
            });
        }
    }
}

function CheckCreditLimitMode(obj) {
    //$("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
    //    $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //    $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //});
    if ($("#BillTo").val() != 'Airline') {
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(0).attr("checked", 'checked');
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
    }
    else {
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).attr("checked", 'checked');
        $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
    }
}


function CheckCreditBillToSNo(a, b, c, d) {
    var total = 0;
    var BillToSNo = $("#BillToSNo").val();
    if ($("#BillTo").val() != 'Airline') {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        flags = 1;
                    });
                    ShowMessage('warning', '', FinalData[0].Column2);
                }
                else {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                        flags = 0;
                    });
                }
            }
        });
    }
    else {
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 2;
        });
    }
    if ($("#BillToSNo").val()=='')
    CheckWalkIn();
}

function CheckWalkIn() {
    var Sno = $("#AWB").val();
    var type = $("#Type").val();
    if ($("#AWB").val() != '') {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckWalkIn",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Sno: Sno, type: type }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                weight = FinalData[0].Column2;
                if (FinalData[0].Column4 == 'SAS') {
                    if ($("#Text_BillTo").val().toUpperCase() == 'AGENT') {
                        $("#ShipperName").val(FinalData[0].Column5);
                        $('#ShipperName').attr('readonly', false);

                        $("#Text_BillToSNo").val(FinalData[0].Column1);
                        $("#BillToSNo").val(FinalData[0].Column3);

                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                            $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                            //$(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                            //flags = 1;

                            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                            flags = 0;

                        });
                    }
                    else if ($("#Text_BillTo").val().toUpperCase() == 'AIRLINE') {
                        $("#ShipperName").val('');
                        $('#ShipperName').attr('readonly', false);
                        $("#Text_BillToSNo").val('');
                        $("#BillToSNo").val('');
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            //$(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                            //$(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                            //$(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                            //flags = 0;
                            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
                            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                            flags = 2;
                        });

                    }

                }
                else {
                    $('#ShipperName').attr('readonly', false);
                    $("#ShipperName").val(FinalData[0].Column1);
                }
            }
        });
    }

}

//function GetTotalAmount(obj) {
//    var total = 0;
//    if ($("#" + obj.id).val() == '' || $("#" + obj.id).val() == undefined || $("#" + obj.id).val() == '0' || $("#" + obj.id).val() == '0.00') {
//        var r = $("#" + obj.id).val();
//        var p = $("#" + obj.id.replace("Rate", "PValue")).val();
//        var s = $("#" + obj.id.replace("Rate", "SValue")).val();
//        if (s != "0.00") {
//            total = r * p * s;
//        }
//        else {
//            total = r * p;
//        }

//        var remark = "Tariff SNo " + $("#" + obj.id.replace("Rate", "ChargeName")).val() + " ---- Charge : " + p + " " + $("#" + obj.id.replace("Rate", "PBasis")).closest('td').find("span[id^='PBasis']").text() + ((s == "" || s == undefined || s == "0.00") ? "" : (" * " + s + " " + $("#" + obj.id.replace("Rate", "SBasis")).closest('td').find("span[id^='SBasis']").text())) + " * " + r + " [Rate] =" + total + " (Manual Rate)";
//        $("#" + obj.id.replace("Rate", "TotalAmount")).closest('td').find("span[id^='TotalAmount']").text(total);
//        $("#" + obj.id.replace("Rate", "Remarks")).closest('td').find("span[id^='Remarks']").text(remark);
//    }

//}



