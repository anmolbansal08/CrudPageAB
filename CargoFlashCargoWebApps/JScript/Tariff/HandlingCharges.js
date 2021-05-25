$(document).ready(function ()
{
    GetTabInSequence();
    cfi.ValidateForm();
    cfi.AutoCompleteV2("PrimaryBasisOfCharge", "SNo,BasisOfCharge", "Tariff_Basisofcharge", null, "contains");
    cfi.AutoCompleteV2("SecondaryBasisOfCharge", "SNo,BasisOfCharge", "Tariff_SecondaryBasis", null, "contains");
    cfi.AutoCompleteV2("Country", "CountryCode,CountryName", "Tariff_Country", onSelectCountry, "contains");
    cfi.AutoCompleteV2("City", "CityCode,CityName", "Tariff_City", null, "contains");
    cfi.AutoCompleteV2("Chargetype", "ChargeType", "Tariff_ChargeType", null, "contains");
    cfi.AutoCompleteV2("InvoiceGroup", "Groupcode,GroupName", "Tariff_ChargeGroup", null, "contains");
    $("[id='areaTrans_Tariff_HandlingChargesTrans']").EnableMultiField({ enableRemove: false });
    $("div[id^='transActionDiv']").find("[title='Delete']").hide();
    //GetSLIData();
    if ($("#Text_InvoiceGroup").length > 0) {
        if ($("#Text_InvoiceGroup").data("kendoAutoComplete").value() != "")
            $("#Text_InvoiceGroup").data("kendoAutoComplete").enable(false);
        else
            $("#Text_InvoiceGroup").data("kendoAutoComplete").enable(true);
    }
    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }

    //$("[class$='icon-trans-plus-sign'][title='Add more']").click(function () {
    //    $("[class$='icon-trans-trash'][title='Delete']").hide();
    //});
    //$(document).keydown(function (event) {
    //    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
    //        event.preventDefault();
    //    }
    //});

    //$(document).on("contextmenu", function (e) {
    //    return false;
    //});

    //$(document).on('drop', function () {
    //    return false;
    //});

    $('input[name="operation"]').click(function (e) {

        if (cfi.IsValidSubmitSection()) {
            var HandlingChargesInfo = new Array();
            var HandlingChargesTrans = new Array();
            var a = $('#IsActive:checked').val();
            if (a == 0) {
                a = 1;
            }
            else
                a = 0;
            var ChargeCategory = $('#ChargeCategory:checked').val();
            //if (ChargeCategory == 0) {
            //    ChargeCategory = 1;
            //}
            //else
            //    ChargeCategory = 0;

            HandlingChargesInfo.push({
                SNo: $('#hdnSNo').val(),
                ChargeName: $('#ChargeName').val(),
                IsActive: a,
                Ratetype: $("input:radio[id$='RateType']:checked").val(),
                Chargetype: $("input:hidden[id$='Chargetype']").val(),
                PrimaryBasisOfChargeSNo: $('#PrimaryBasisOfCharge').val(),
                SecondaryBasisOfChargeSNo: $('#SecondaryBasisOfCharge').val(),
                TariffDescription: $('#TariffDescription').val(),
                TariffAccountName: $('#TariffAccountName').val(),
                TerminalSNo: 1,
                Country: $('#Country').val(),
                City: $('#City').val(),
                ChargeCategory: ChargeCategory,
                IsRefundable: 0,
                InvoiceGroup: $('#InvoiceGroup').val()
            });

            $('#divareaTrans_Tariff_HandlingChargesTrans table:last tbody tr[id^="areaTrans_Tariff_HandlingChargesTrans"]').each(function (row, tr) {
                var a = $(tr).find("td").find("input:radio[id^='IsActive']:checked").val();
                if (a == 0) {
                    a = 1;
                }
                else
                    a = 0;


                var ChargeCategory = $(tr).find("td").find("input:radio[id^='ChargeCategory']:checked").val();

                HandlingChargesTrans.push({
                    SNo: $(tr).find("td").find("input:hidden[id^='SNo']").val() == "" ? "0" : $(tr).find("td").find("input:hidden[id^='SNo']").val(),
                    ChargeName: $(tr).find("td").find("input:text[id^='ChargeCode']").val(),
                    PrimaryBasisOfChargeSNo: $('#PrimaryBasisOfCharge').val(),
                    SecondaryBasisOfChargeSNo: $('#SecondaryBasisOfCharge').val(),
                    IsActive: a,
                    Ratetype: $("input:radio[id$='RateType']:checked").val(),
                    Chargetype: $("input:hidden[id$='Chargetype']").val(),
                    TariffDescription: $('#TariffDescription').val(),
                    TariffAccountName: $('#TariffAccountName').val(),
                    TerminalSNo: 1,
                    Country: $('#Country').val(),
                    City: $('#City').val(),
                    ChargeCategory: ChargeCategory,
                    IsRefundable: $(tr).find("input:radio[id^='IsRefundable'][value='0']").is(":checked") ? true : false,
                    InvoiceGroup: $('#InvoiceGroup').val()
                });
            });
            //Clear value because it's return forbidden error : CS on 2017-10-23
            $("#valueareaTrans_Tariff_HandlingChargesTrans").val("");
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
                $.ajax({
                    url: "Services/Tariff/HandlingChargesService.svc/SaveCharges", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ HandlingChargesInfo: HandlingChargesInfo, HandlingChargesTrans: HandlingChargesTrans }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result[0].indexOf("Already Exists") >= 0) {
                            ShowMessage('warning', 'Warning -Charges Already Exists ', result[0].replace("<value>", "").replace("</value>", ""), "bottom-right");
                            e.preventDefault();

                        }
                        else if (result != 'Error') {
                            navigateUrl('Default.cshtml?Module=Tariff&Apps=HandlingCharges&FormAction=INDEXVIEW');
                        }
                        else
                            navigateUrl('Default.cshtml?Module=Tariff&Apps=HandlingCharges&FormAction=INDEXVIEW');

                    },
                    error: function (xhr)
                    {
                        debugger
                    }
                });
            }

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                $.ajax({
                    url: "Services/Tariff/HandlingChargesService.svc/UpdateCharges", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ HandlingChargesInfo: HandlingChargesInfo, HandlingChargesTrans: HandlingChargesTrans }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result[0].indexOf("Already Exists") >= 0) {
                            ShowMessage('warning', 'Warning -Charges Already Exists ', result[0].replace("<value>", "").replace("</value>", ""), "bottom-right");
                            e.preventDefault();


                        }
                        else if (result != 'Error') {

                            //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                            //    AuditLogSaveNewValue("divbody");
                            //}
                            navigateUrl('Default.cshtml?Module=Tariff&Apps=HandlingCharges&FormAction=INDEXVIEW');

                        }
                        else
                            navigateUrl('Default.cshtml?Module=Tariff&Apps=HandlingCharges&FormAction=INDEXVIEW');

                    },
                    error: function (xhr) {
                        debugger
                    }

                });

            }
            if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
                $(".btn-danger").hide();
            }
        }
    });

    $("#Text_TariffCode").on('blur', function () {




    });
});

function onSelectCountry() {
    if ($("#Text_City").val() != "")
        $("#Text_City").val("");
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("Text_SecondaryBasisOfCharge") >= 0) {
        for (var i = 0; i < $("#Text_PrimaryBasisOfCharge").data("kendoAutoComplete").key().split(',').length; i++) {
            cfi.setFilter(filterEmbargo, "SNo", "neq", $("#Text_PrimaryBasisOfCharge").data("kendoAutoComplete").key().split(',')[i]);
        }
        return cfi.autoCompleteFilter(filterEmbargo);
    }

    if (textId.indexOf("Text_PrimaryBasisOfCharge") >= 0) {
        for (var i = 0; i < $("#Text_SecondaryBasisOfCharge").data("kendoAutoComplete").key().split(',').length; i++) {
            cfi.setFilter(filterEmbargo, "SNo", "neq", $("#Text_SecondaryBasisOfCharge").data("kendoAutoComplete").key().split(',')[i]);
        }
        return cfi.autoCompleteFilter(filterEmbargo);
    }
    if (textId.indexOf("Text_City") >= 0) {
        cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#Text_Country").data("kendoAutoComplete").key());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
}

function GetSLIData() {
    var AwbNo = '222-22222222';
    var FinalData;
    var FinalData1;
    //    var FinalData2;
    //    var Finaldata3

    $.ajax({
        type: "POST",
        data: JSON.stringify({ AwbNo: AwbNo }),
        url: "Services/Tariff/HandlingChargesService.svc/GetAWBPrintData", async: false, type: "POST", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //alert(data); // this is Json data object
            var ResultData = jQuery.parseJSON(data);
            FinalData = ResultData.Table0;
            FinalData1 = ResultData.Table1;
        },
        error: function () {
            alert('failure');
        }
    });
}

$('body').on('keydown', function (e)
{
    var jqTarget = $(e.target); if (e.keyCode == 9)
    {
        var jqVisibleInputs = $(':input:visible'); var jqFirst = jqVisibleInputs.first();
        var jqLast = jqVisibleInputs.last(); if (!e.shiftKey && jqTarget.is(jqLast)) { e.preventDefault(); jqFirst.focus(); }
        else if (e.shiftKey && jqTarget.is(jqFirst)) { e.preventDefault(); jqLast.focus(); }
    }
});

// Added By Pankaj Kumar Ishwar on 30-01-2018 for tabindex
function GetTabInSequence()
{
    $('input[type=radio][id^="RateType"][value=0]').attr('tabindex', '1');
    $('input[type=radio][id^="RateType"][value=1]').attr('tabindex', '2');
    $('#Chargetype').attr('tabindex', '3');
    $('#Text_Chargetype').attr('tabindex', '3');
}
