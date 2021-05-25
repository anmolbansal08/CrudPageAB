//Javascript file for Manage Tariff Page for binding Autocomplete
/// <reference path="../../Scripts/common.js" />
var containerId = "tbl";
var SPHC = "";
var Text_SPHC = "";
var Text_SPHCDuplicate = "";

$(document).ready(function () {
    //$('#loginForm').find('input[id="Domestic"]').parent().contents().eq(6).remove()
    //$('#loginForm').find('input[id="Domestic"]').parent().contents().eq(5).remove()
    cfi.ValidateForm();

    //$('#aspnetForm').attr("enctype", "multipart/form-data");
    cfi.AutoCompleteV2("WHLocationTypeSNo", "LocationType", "Tariff_LocationType", null, "contains", ",");
    cfi.AutoCompleteV2("TariffName", "ChargeName", "Tariff_ChargeName", SetBasis, "contains");
    cfi.AutoCompleteV2("TariffCode", "ChargeName", "Tariff_ChargeName", SetRateType, "contains");
    cfi.AutoCompleteV2("Tax", "TaxCode", "Tariff_TaxCode", null, "contains", ",");
    cfi.AutoCompleteV2("Currency", "CurrencyCode,CurrencyName", "Tariff_CurrencyName", null, "contains");
    cfi.AutoCompleteV2("SPHC", "Code", "Tariff_Code", OnSelectSHCSNo, "contains", ",");
    cfi.AutoCompleteV2("Agent", "Name", "Tariff_Name", null, "contains", ",");
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Tariff_AirlineName", null, "contains", ",");
    cfi.AutoCompleteV2("Inventory", "item", "Tariff_item", null, "contains", ",");
    cfi.AutoCompleteV2("Process", "ProcessName", "Tariff_ProcessName", null, "contains");
    cfi.AutoCompleteV2("SubProcess", "SubProcessName", "Tariff_SubProcessName", null, "contains");
    cfi.AutoCompleteV2("SHCGroup", "Name", "Tariff_NameA", OnSelectSPHCGroupSNo, "contains", ",");
    cfi.AutoCompleteV2("Location", "CountryCode,CountryName", "Tariff_CountryCode", null, "contains");
    cfi.AutoCompleteV2("LocationMulti", "TerminalName", "Tariff_TerminalName", null, "contains", ",");
    cfi.AutoCompleteV2("TruckDestination", "CityCode,CityName", "Tariff_CityCode", null, "contains");

    ///// Sushant
    cfi.AutoCompleteV2("ULDType", "ULDName", "Tariff_ULDName", null, "contains", ",");
    cfi.AutoCompleteV2("Accounttype", "Autocompletetext", "Tariff_Autocompletetext", null, "contains");

    $('#TariffIdName').bind('copy', function (e) {
        e.preventDefault();
    });


    $('#TariffIdName').bind('paste', function (e) {
        e.preventDefault();
    });

    if ($("span[id='Ratetype']").text().toUpperCase() == 'INVENTORY') {
        $(":hidden[name$='Inventory'][id$='Inventory']").closest('td').css("visibility", "visible");
        $("#spnInventory").closest("td[title$='Inventory']").css("visibility", "visible");
        $("#Text_Inventory").attr("data-valid", "required");
        $("#Text_Inventory").attr("data-valid-msg", "Inventory can not be blank");

        if ($("#spnInventory").closest("td").find("font").length == 0 || $("#spnInventory").closest("td").find("font").text() == '') {
            $("<font color=red>*</font>").insertBefore("[id='spnInventory']");
        }
        $("#Inventory").attr("explicitValid", "1");
    }
    else {
        $(":hidden[name$='Inventory'][id$='Inventory']").closest('td').css("visibility", "hidden");
        $("#spnInventory").closest("td[title$='Inventory']").css("visibility", "hidden");
        $("#Text_Inventory").removeAttr("data-valid");
        $("#spnInventory").closest("td").find("font").html('');
        $("#Text_Inventory").removeAttr("data-valid-msg", "Inventory can not be blank");
    }

    cfi.BindMultiValue("Inventory", $("#Text_Inventory").val(), $("#Inventory").val());
    Text_SPHCDuplicate = $("#Text_SHCGroup").val();
    cfi.BindMultiValue("SHCGroup", $("#Text_SHCGroup").val(), $("#SHCGroup").val());

    //InstantiateControl(containerId);
    $('input:radio[name=ApplicableFor]').change(function () {
        CheckImportCollect();
    })

    function OnSelectSHCSNo() {
        $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
        $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
        $("div#divMultiSHCGroup ul li:last-child").find('span').text('');
        $("#Text_SPHCGroup").closest('td').find("[id='SPHCGroup']").val('');
        $("#Text_SHCGroup").removeAttr("data-valid");
        $("#spnSHCGroup").closest("td").find("font").html('');
        $("#Text_SPHC").attr("data-valid", "required");
        $("#spnSPHC").closest("td").find("font").html('*');
        $("#SPHC").attr("explicitValid", "1");
        $("#SHCGroup").val("");
    }

    function OnSelectSPHCGroupSNo() {
        $("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
        $("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
        $("div#divMultiSPHC ul li:last-child").find('span').text('');
        $("#Text_SPHC").closest('td').find("[id='SPHC']").val('');
        $("#Text_SPHC").removeAttr("data-valid");
        $("#spnSPHC").closest("td").find("font").html('');
        $("#Text_SHCGroup").attr("data-valid", "required");
        $("#spnSHCGroup").closest("td").find("font").html('*');
        $("#SHCGroup").attr("explicitValid", "1");
        $("#SPHC").val("");
    }

    $('input:radio[name=BasedOn]').change(function () {
        CheckImportCollect();
    })

    $('input:radio[name=FreightType]').change(function () {
        CheckImportCollect();
    })


    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });

    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })

    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        $('[name="RushHandling"][value="1"]').attr('checked', true)
        $("input:radio[name='Warehousefacility'][value='2']").attr("checked", true);
        $("input:radio[name='EditableUnit'][value='1']").attr("checked", true);
        $("input:radio[name='SlideScale'][value='1']").attr("checked", true);
        $("input:radio[name='AccountTypeId'][value='0']").attr("checked", true);
        $("input:radio[name='IsESS'][value='1']").attr("checked", true);
        $('input:radio[name="TariffFor"][value="2"]').attr('checked', true);
        $("#Text_Location").val(userContext.AirportCode + "-" + userContext.AirportName);
        $("#Location").val(userContext.AirportSNo);
        $("#ValidFrom").val("");
        $("#ValidTo").val("");
        $("input[id$='FreightType'][value=2]").attr("checked", true);
        $("input[id$='BuildUpType'][value=2]").attr("checked", true);

        if ($("input:radio[name='IsMandatory']:checked").val() == "0") {
            $("input:radio[name='IsESS'][value='1']").attr("checked", true);
            $("input:radio[name='IsESS']").attr("disabled", "disabled");
        }

        $(".Days").prop('checked', false)
        $("input[type='checkbox'][id^='Days']").each(function () {
            $(this).click(function () {
                if ($(this).val() == "0") {
                    $("input[type='checkbox'][id^='" + $(this).attr("id") + "']").attr("checked", $(this).is(":checked"));
                }
                else {
                    if (!$(this).is(":checked")) {
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", $(this).is(":checked"));
                    }
                    else {
                        var checked = true;
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:gt(0)").each(function () {
                            if (checked)
                                checked = $(this).is(":checked");

                            if (!checked)
                                return false;
                        });

                        if (checked) {
                            $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", checked);
                        }
                    }
                }
            });
        });
    }

    $("input:radio[name='IsMandatory']").on("change", function () {
        if ($("input:radio[name='IsMandatory']:checked").val() == "0") {
            $("input:radio[name='IsESS'][value='1']").attr("checked", true);
            $("input:radio[name='IsESS']").attr("disabled", "disabled");
        }
        else {
            $("input:radio[name='IsESS'][value='0']").attr("checked", true);
            $("input:radio[name='IsESS']").attr("disabled", false);
        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        cfi.AutoCompleteV2("Location", "CountryCode,CountryName", "Tariff_CountryCode", null, "contains");
        $(".btn-danger").hide();
        if ($("span[id='Ratetype']").text().toUpperCase() == 'INVENTORY') {
            $("td[title='Inventory']").html('Inventory');
        }
        else {
            $("td[title='Inventory']").html('');
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT')  // change by parvez khan , 8 FEB 2018,discuss with CS Sharma
    {   //added by jk,
        var d = new Date($("input[id^='ValidTo']").val());
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = d.getFullYear() + '/' +
            (('' + month).length < 2 ? '0' : '') + month + '/' +
            (('' + day).length < 2 ? '0' : '') + day;

        var dfrom = new Date($("input[id^='ValidFrom']").val());

        var monthfrom = dfrom.getMonth() + 1;
        var dayfrom = dfrom.getDate();

        var outputFrom = dfrom.getFullYear() + '/' +
            (('' + monthfrom).length < 2 ? '0' : '') + monthfrom + '/' +
            (('' + dayfrom).length < 2 ? '0' : '') + dayfrom;

        var d1 = new Date();
        var month1 = d1.getMonth() + 1;
        var day1 = d1.getDate();

        var output1 = d1.getFullYear() + '/' +
            (('' + month1).length < 2 ? '0' : '') + month1 + '/' +
            (('' + day1).length < 2 ? '0' : '') + day1;

        if (output >= output1) {
            $("input[id^='ValidFrom']").data("kendoDatePicker").enable(true);
            $("input[id^='ValidTo']").data("kendoDatePicker").enable(true);
        }
        else if (outputFrom >= output1) {
            $("input[id^='ValidFrom']").data("kendoDatePicker").enable(true);
            $("input[id^='ValidTo']").data("kendoDatePicker").enable(true);
        }
        else {
            $("input[id^='ValidFrom']").data("kendoDatePicker").enable(false);
            $("input[id^='ValidTo']").data("kendoDatePicker").enable(false);
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
        if ($("span[id='Ratetype']").text().toUpperCase() == 'INVENTORY') {
            $(":hidden[name$='Inventory'][id$='Inventory']").closest('td').css("visibility", "visible");
            $("#spnInventory").closest("td[title$='Inventory']").css("visibility", "visible");
        }
        else {
            $(":hidden[name$='Inventory'][id$='Inventory']").closest('td').css("visibility", "hidden");
            $("#spnInventory").closest("td[title$='Inventory']").css("visibility", "hidden");
        }

        $("input[type='checkbox'][id^='Days']").each(function () {
            $(this).click(function () {
                if ($(this).val() == "0") {
                    $("input[type='checkbox'][id^='" + $(this).attr("id") + "']").attr("checked", $(this).is(":checked"));
                }
                else {
                    if (!$(this).is(":checked")) {
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", $(this).is(":checked"));
                    }
                    else {
                        var checked = true;
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:gt(0)").each(function () {
                            if (checked)
                                checked = $(this).is(":checked");
                            if (!checked)
                                return false;
                        });
                        if (checked) {
                            $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", checked);
                        }
                    }
                }
            });
        });
    }

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        CheckImportCollect();
    }

    if ($("input[name='ApplicableFor']:checked").val() == 1 && $("input[name='BasedOn']:checked").val() == 3 && $("input[name='FreightType']:checked").val() == 1) {
        $("#FreightPercentValue").attr("disabled", false);
    }
    else {
        $("#FreightPercentValue").attr("disabled", "disabled");
    }

    CreateSlabGrid();
    CreateRevenueSharingSlabGrid();

    /*  added radio button in revenue sharing by jk **/
    $("#tblRevenueSharingSlab").find("thead tr:first").remove();
    $('#tblRevenueSharingSlab thead tr').before('<tr><td class="formSection" colspan="2">Revenue Sharing Slab Information</td><td class="formSection" colspan="0">'
        + '<input type="radio" id="Revenuepercent" name="RevenueAmount" value="Rpercent" checked > Revenue Percent</td><td class="formSection" colspan="0">'
        + '<input type="radio" id="RevenueAmount" name="RevenueAmount" value="RAmount" > Revenue Amount</td><td class="formSection" colspan="0"></td></tr>')
    /******/

    if ($('input[type=radio][name=Revenuepercent]:checked').val() == 'Rpercent' && ($("[id*='tblRevenueSharingSlab_RevenueSharing_']").val() > 0)) {
        $("#Revenuepercent").attr("disabled", true);
        $("#RevenueAmount").attr("disabled", false);
        $('input[type=radio][id^=Revenuepercent]:checked').attr('checked', true)
        $('input[type=radio][id^=RevenueAmount]:checked').attr('checked', false)
        $("#Revenuepercent").prop("checked", true);
        $("#RevenueAmount").prop("checked", false);
    }
    else if ($('input[type=radio][name=Revenuepercent]:checked').val() == 'undefined' && (parseFloat($("[id*='tblRevenueSharingSlab_RevenueSharing_']").val()) > 0)) {
        $('input[type=radio][id^=Revenuepercent]:checked').attr('checked', true)
        $('input[type=radio][id^=RevenueAmount]:checked').attr('checked', false)
        $("#Revenuepercent").prop("checked", true);
        $("#RevenueAmount").prop("checked", false);
    }
    else if ($('input[type=text][id*=tblRevenueSharingSlab_RevenueSharing_]').length == 0 && $('input[type=text][id*=tblRevenueSharingSlab_RevenueAmount_]').length == 0) {
        $('input[type=radio][id^=Revenuepercent]:checked').attr('checked', true)
        $('input[type=radio][id^=RevenueAmount]:checked').attr('checked', false)
        $("#Revenuepercent").prop("checked", true);
        $("#RevenueAmount").prop("checked", false);
    }
    else if ($('input[type=text][id*=tblRevenueSharingSlab_RevenueSharing_]').length > 0 && parseFloat($("[id*='tblRevenueSharingSlab_RevenueSharing_']").val()) > 0) {
        $('input[type=radio][id^=Revenuepercent]:checked').attr('checked', true)
        $('input[type=radio][id^=RevenueAmount]:checked').attr('checked', false)
        $("#Revenuepercent").prop("checked", true);
        $("#RevenueAmount").prop("checked", false);
        $("[id*='tblRevenueSharingSlab_RevenueAmount_']").val('');
        $("[id*='tblRevenueSharingSlab_RevenueAmount_']").attr('disabled', 'disabled')
    }
    else if ($('input[type=text][id*=tblRevenueSharingSlab_RevenueAmount_]').length > 0 && parseFloat($("[id*='tblRevenueSharingSlab_RevenueAmount_']").val()) > 0) {
        $('input[type=radio][id^=Revenuepercent]:checked').attr('checked', false)
        $('input[type=radio][id^=RevenueAmount]:checked').attr('checked', true)
        $("#Revenuepercent").prop("checked", false);
        $("#RevenueAmount").prop("checked", true);
        $("[id*='tblRevenueSharingSlab_RevenueSharing_']").val('');
        $("[id*='tblRevenueSharingSlab_RevenueSharing_']").attr('disabled', 'disabled')
    }
    else {
        $('input[type=radio][id^=Revenuepercent]:checked').attr('checked', false)
        $('input[type=radio][id^=RevenueAmount]:checked').attr('checked', true)
        $("#Revenuepercent").prop("checked", false);
        $("#RevenueAmount").prop("checked", true);
        $("[id*='tblRevenueSharingSlab_RevenueSharing_']").attr('disabled', 'disabled')
        $("[id*='tblRevenueSharingSlab_RevenueSharing_']").val('');
        $("[id*='tblRevenueSharingSlab_RevenueSharing_']").removeAttr('required');
    }

    $('#tblTariffSlab_SlabType_1').change(function () {
        $("#Revenuepercent").attr("disabled", false);
        $("#RevenueAmount").attr("disabled", "disabled");
    });

    $('input[type=radio][name=RevenueAmount]').change(function () {
        if (this.value == 'Rpercent') {
            if ($("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 0 || $("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 2) {
                $("[id*='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", true);
                $("[id*='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", true);
                $("[id*='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", 'disabled');
                $("[id*='tblRevenueSharingSlab_RevenueAmount_']").val('');
                $("[id*='tblRevenueSharingSlab_RevenueAmount_']").text('');
                $("[id*='_temptblRevenueSharingSlab_RevenueAmount_']").val('');
                $("[id*='_temptblRevenueSharingSlab_RevenueAmount_']").prop("disabled", true);
                $("[id*='tblRevenueSharingSlab_RevenueSharing_']").prop("disabled", false);
                $("[id*='tblRevenueSharingSlab_RevenueSharing_']").val('');
                $("[id*='tblRevenueSharingSlab_RevenueSharing_']").text('');
                $("[id*='_temptblRevenueSharingSlab_RevenueSharing_']").val('');
                $("[id*='_temptblRevenueSharingSlab_RevenueSharing_']").prop("disabled", false);
            }
        }
        else if (this.value == 'RAmount') {
            if ($("[id^='tblTariffSlab_SlabType_']").length > 1) {
                if ($("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 0 || $("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 2) {
                    $("[id*='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", 'disabled');
                    $("#Revenuepercent").prop("checked", true);
                    $("#RevenueAmount").prop("checked", false);
                    alert("Multiple Slab is not allowd, please select revanue sharing in % to add Tariff slab");
                }
            }
            else if ($("[id^='tblTariffSlab_SlabType_']").length = 1) {
                if ($("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 0 || $("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 2) {
                    $("[id*='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", false);
                    $("[id*='tblRevenueSharingSlab_RevenueSharing_']").prop("disabled", 'disabled');
                    $("[id*='tblRevenueSharingSlab_RevenueSharing_']").val('');
                    $("[id*='tblRevenueSharingSlab_RevenueSharing_']").text('');
                    $("[id*='_temptblRevenueSharingSlab_RevenueSharing_']").val('');
                    $("[id*='_temptblRevenueSharingSlab_RevenueSharing_']").prop("disabled", false);
                }
            }
        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ") {
        /*Added By Brajendra*/
        $("input[type='checkbox'][id$='MON']").closest("td").find("input[type='checkbox']").each(function (index, value) {
            var str;
            str = value.name.replace("Is", "").toLowerCase().replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
            });
            $(this).before(str);;
        });

        $("input[id='Value']").hide();
        $("span[id='Value']").hide();

        $("input[name$='Surcharge']").closest('td:contains("Surcharge")').append('&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" class="k-input" name="Value1" id="Value1" style="width: 100px; text-transform: none; display: none;" tabindex="26" min="0" maxlength="3" value="0" data-role="alphabettextbox" autocomplete="off" placeholder="Value In %"> <span id="percentage">%</span>')

        if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
            $("input[type='text'][id='Value1']").attr("disabled", "disabled");
            if ($("#TariffForValue").text().toUpperCase() == "TERMINAL") {
                $("span#Text_LocationMulti").show();
                $("span#Text_Location").hide();
            }
            else {
                $("span#Text_LocationMulti").hide();
                $("span#Text_Location").show();
            }
        }

        document.getElementById("Value1").onkeyup = function () {
            var input = parseInt(this.value);
            if (input < 0 || input > 999) {
                alert("Value should be between 0 - 999");
                document.getElementById("Value1").value = 0;
                return false;
            }
            return true;
        }

        $("input[id='Value1']").hide();
        $("span[id='percentage']").hide();

        $("input[name$='Surcharge']:radio").change(function () {
            if ($("input[name$='Surcharge']:checked").val() == 1) {
                $("input[id='Value1']").show();
                $("span[id='percentage']").show();
                $("input[id='Value1']").val($("#Value").val());
            }
            else {
                $("input[id='Value1']").hide();
                $("span[id='percentage']").hide();
            }
        });

        if ($("input[name$='Surcharge']:checked").val() == 1) {
            $("input[id='Value1']").show();
            $("span[id='percentage']").show();
            $("input[id='Value1']").val($("#Value").val());
        }
        else {
            $("input[id='Value1']").hide();
            $("span[id='percentage']").hide();
        }

        if ($("#Text_IsSurcharge").text().toUpperCase() == "SURCHARGE") {
            $("input[id='Value1']").show();
            $("span[id='percentage']").show();
            $("input[id='Value1']").val($("#Value").val());
        }
    /*Ended By Brajendra*/

        var TaxDataField = ($('#Tax').val());
        var TaxDataText = ($('#Text_Tax').val());
        $('#Text_Tax')[0].defaultValue = '';
        $('#Text_Tax')[0].Value = '';
        $('#Text_Tax').val('');
        $('#Multi_Tax').val(TaxDataField);
        $('#FieldKeyValuesTax')[0].innerHTML = TaxDataField;
        var i = 0;
        if (TaxDataField.split(',').length > 0) {
            while (i < TaxDataField.split(',').length) {
                if (TaxDataField.split(',')[i] != '')
                    $('#divMultiTax').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + TaxDataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + TaxDataField.split(',')[i] + "'></span></li>");
                i++;
            }
            $("#divMultiTax").css("display", "block");
        }

        ////-----------pk--------------------

        cfi.BindMultiValue("WHLocationTypeSNo", $("#Text_WHLocationTypeSNo").val(), $("#WHLocationTypeSNo").val());

        /*For sphc*/
        var SPHCDataField = ($('#SPHC').val());
        var SPHCDataText = ($('#Text_SPHC').val());
        $('#Text_SPHC')[0].defaultValue = '';
        $('#Text_SPHC')[0].Value = '';
        $('#Text_SPHC').val('');
        $('#Multi_SPHC').val(SPHCDataField);
        $('#FieldKeyValuesSPHC')[0].innerHTML = SPHCDataField;
        var j = 0;
        if (SPHCDataField.split(',').length > 0) {
            while (j < SPHCDataField.split(',').length) {
                if (SPHCDataField.split(',')[j] != '')
                    $('#divMultiSPHC').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SPHCDataText.split(',')[j] + "</span><span class='k-icon k-delete' id='" + SPHCDataField.split(',')[j] + "'></span></li>");
                j++;
            }
            $("#divMultiSPHC").css("display", "block");
        }

        /*For agent*/
        var AgentDataField = ($('#Agent').val());
        var AgentDataText = ($('#Text_Agent').val());
        $('#Text_Agent')[0].defaultValue = '';
        $('#Text_Agent')[0].Value = '';
        $('#Text_Agent').val('');
        $('#Multi_Agent').val(AgentDataField);
        $('#FieldKeyValuesAgent')[0].innerHTML = AgentDataField;
        var k = 0;
        if (AgentDataField.split(',').length > 0) {
            while (k < AgentDataField.split(',').length) {
                if (AgentDataField.split(',')[k] != '')
                    $('#divMultiAgent').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + AgentDataText.split(',')[k] + "</span><span class='k-icon k-delete' id='" + AgentDataField.split(',')[k] + "'></span></li>");
                k++;
            }
            $("#divMultiAgent").css("display", "block");
        }

        /*For airline*/
        cfi.BindMultiValue("Airline", $("#Text_Airline").val(), $("#Airline").val());
        cfi.BindMultiValue("ULDType", $("#Text_ULDType").val(), $("#ULDType").val());

        $("input[type='checkbox'][id^='Days']").each(function () {

            $(this).click(function () {
                if ($(this).val() == "0") {
                    $("input[type='checkbox'][id^='" + $(this).attr("id") + "']").attr("checked", $(this).is(":checked"));
                }
                else {
                    if (!$(this).is(":checked")) {
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", $(this).is(":checked"));
                    }
                    else {
                        var checked = true;
                        $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:gt(0)").each(function () {
                            if (checked)
                                checked = $(this).is(":checked");
                            if (!checked)
                                return false;
                        });
                        if (checked) {
                            $("input[type='checkbox'][id^='" + $(this).attr("id") + "']:eq(0)").attr("checked", checked);
                        }
                    }
                }
            });
        });

    }

    $('.k-delete').click(function () {

        //------------------------------------------pk--------------------
        if ($(this).parent().closest("tr").find("td").find("span")[0].id == "spnWHLocationTypeSNo") {
            $(this).parent().remove();


            if ($("div[id='divMultiWHLocationTypeSNo']").find("span[name^='FieldKeyValuesWHLocationTypeSNo']").text().indexOf($(this)[0].id + ",") > -1) {
                var WHLocationTypeSNoVal = $("div[id='divMultiWHLocationTypeSNo']").find("span[name^='FieldKeyValuesWHLocationTypeSNo']").text().replace($(this)[0].id + ",", '');
                $("div[id='divMultiWHLocationTypeSNo']").find("span[name^='FieldKeyValuesWHLocationTypeSNo']").text(WHLocationTypeSNoVal);
                $('#WHLocationTypeSNo').val(WHLocationTypeSNoVal);
            }
            else {
                var WHLocationTypeSNoValfield = $("div[id='divMultiWHLocationTypeSNo']").find("span[name^='FieldKeyValuesWHLocationTypeSNo']").text().replace($(this)[0].id, '');
                $("div[id='divMultiWHLocationTypeSNo']").find("span[name^='FieldKeyValuesWHLocationTypeSNo']").text(WHLocationTypeSNoValfield);
                $('#WHLocationTypeSNo').val(WHLocationTypeSNoValfield);
            }
            $("div[id='divMultiWHLocationTypeSNo']").find("input:hidden[name^='Multi_WHLocationTypeSNo']").val($("div[id='divMultiWHLocationTypeSNo']").find("span[name^='FieldKeyValuesWHLocationTypeSNo']").text());
        }
        //-----------------------------------------------------------
        if ($(this).parent().closest("tr").find("td").find("span")[0].id == "spnTax") {
            $(this).parent().remove();
            if ($("div[id='divMultiTax']").find("span[name^='FieldKeyValuesTax']").text().indexOf($(this)[0].id + ",") > -1) {
                var TaxVal = $("div[id='divMultiTax']").find("span[name^='FieldKeyValuesTax']").text().replace($(this)[0].id + ",", '');
                $("div[id='divMultiTax']").find("span[name^='FieldKeyValuesTax']").text(TaxVal);
                $('#Tax').val(TaxVal);
            }
            else {
                var TaxValfield = $("div[id='divMultiTax']").find("span[name^='FieldKeyValuesTax']").text().replace($(this)[0].id, '');
                $("div[id='divMultiTax']").find("span[name^='FieldKeyValuesTax']").text(TaxValfield);
                $('#Tax').val(TaxValfield);
            }
            $("div[id='divMultiTax']").find("input:hidden[name^='Multi_Tax']").val($("div[id='divMultiTax']").find("span[name^='FieldKeyValuesTax']").text());
        }
        if ($(this).parent().closest("tr").find("td").find("span")[0].id == "spnSPHC") {
            $(this).parent().remove();
            if ($("div[id='divMultiSPHC']").find("span[name^='FieldKeyValuesSPHC']").text().indexOf($(this)[0].id + ",") > -1) {
                var SPHCVal = $("div[id='divMultiSPHC']").find("span[name^='FieldKeyValuesSPHC']").text().replace($(this)[0].id + ",", '');
                $("div[id='divMultiSPHC']").find("span[name^='FieldKeyValuesSPHC']").text(SPHCVal);
                $('#SPHC').val(SPHCVal);
            }
            else {
                var SPHCValfield = $("div[id='divMultiSPHC']").find("span[name^='FieldKeyValuesSPHC']").text().replace($(this)[0].id, '');
                $("div[id='divMultiSPHC']").find("span[name^='FieldKeyValuesSPHC']").text(SPHCValfield);
                $('#SPHC').val(SPHCValfield);
            }
            $("div[id='divMultiSPHC']").find("input:hidden[name^='Multi_SPHC']").val($("div[id='divMultiSPHC']").find("span[name^='FieldKeyValuesSPHC']").text());
        }
        if ($(this).parent().closest("tr").find("td").find("span")[0].id == "spnAgent") {
            $(this).parent().remove();
            if ($("div[id='divMultiAgent']").find("span[name^='FieldKeyValuesAgent']").text().indexOf($(this)[0].id + ",") > -1) {
                var AgentVal = $("div[id='divMultiAgent']").find("span[name^='FieldKeyValuesAgent']").text().replace($(this)[0].id + ",", '');
                $("div[id='divMultiAgent']").find("span[name^='FieldKeyValuesAgent']").text(AgentVal);
                $('#Agent').val(AgentVal);
            }
            else {
                var AgentValfield = $("div[id='divMultiAgent']").find("span[name^='FieldKeyValuesAgent']").text().replace($(this)[0].id, '');
                $("div[id='divMultiAgent']").find("span[name^='FieldKeyValuesAgent']").text(AgentValfield);
                $('#Agent').val(AgentValfield);
            }
            $("div[id='divMultiAgent']").find("input:hidden[name^='Multi_Agent']").val($("div[id='divMultiAgent']").find("span[name^='FieldKeyValuesAgent']").text());
        }
        if ($(this).parent().closest("tr").find("td").find("span")[1].id == "spnAirline") {
            $(this).parent().remove();
            if ($("div[id='divMultiAirline']").find("span[name^='FieldKeyValuesAirline']").text().indexOf($(this)[0].id + ",") > -1) {
                var AirlineVal = $("div[id='divMultiAirline']").find("span[name^='FieldKeyValuesAirline']").text().replace($(this)[0].id + ",", '');
                $("div[id='divMultiAirline']").find("span[name^='FieldKeyValuesAirline']").text(AirlineVal);
                $('#Airline').val(AirlineVal);
            }
            else {
                var AirlineValfield = $("div[id='divMultiAirline']").find("span[name^='FieldKeyValuesAirline']").text().replace($(this)[0].id, '');
                $("div[id='divMultiAirline']").find("span[name^='FieldKeyValuesAirline']").text(AirlineValfield);
                $('#Airline').val(AirlineValfield);
            }
            $("div[id='divMultiAirline']").find("input:hidden[name^='Multi_Airline']").val($("div[id='divMultiAirline']").find("span[name^='FieldKeyValuesAirline']").text());
        }

    });

    $("input[name='operation']").click(function (e) {
        //$('input[name="operation"]').unbind("click").click(function (e) {
        if ($('#ValidFrom').val() == "" || $('#ValidTo').val() == "") {
            ShowMessage('warning', 'Information-Tariff', "From Date or To Date can not be blank !!");
            return false;
        }
        else if (cfi.IsValidSubmitSection()) {
            if ($("input[name='ShipmentType']:checked").val() == "3") {
                if ($("#SPHC").val() == "" && $("#SHCGroup").val() == "") {
                    if (!confirm("SHC not selected for Special Cargo, this charge will be applied if charge not defined for specific SHC.")) {
                        return false;
                    }
                }
            }
            var selectedDays = 0;

            $("input[type='checkbox'][id$='Days']").closest("td").find("input[type='checkbox']").each(function (index, value) {
                if ($(this).is(":checked") == true) {
                    if (index != 0) {
                        selectedDays += selectedDays == 0 ? index : (',' + (index));
                    }

                }
            });
            if (selectedDays != "0") {
                $(".Days").removeAttr("data-valid");
            }

            $("input[name='IsFreeSurcharge']:checked").val();
            $("input[id='Value']").val()

            var arrManageTariff = new Array();

            var checkSlab = false;
            if ($("input[name='ApplicableFor']:checked").val() != 1 || $("input[name='BasedOn']:checked").val() != 3 || $("input[name='FreightType']:checked").val() != 1)
                checkSlab = true;
            else
                checkSlab = false;
            if (checkSlab == true) {
                var res = $("#tblTariffSlab tr[id^='tblTariffSlab']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
                getUpdatedRowIndex(res, 'tblTariffSlab');
                strData = JSON.parse(($('#tblTariffSlab').appendGrid('getStringJson')));
                strData = JSON.stringify(strData);

                var strRevenueData = [];
                var isRevenueSharingAmount = "";
                if ($("input:radio[name='RevenueAmount']:checked").val() == 'RAmount') {

                    $("tr[id^='tblRevenueSharingSlab_Row']").each(function (row, tr) {
                        var RevenueData = {
                            SNo: $(tr).find("input[id^='tblRevenueSharingSlab_SNo_']").val(),
                            Customer: $(tr).find("input[id^='tblRevenueSharingSlab_HdnRevenueSharingCustomer_']").val(),
                            RevenueSharing: $(tr).find("input[id^='tblRevenueSharingSlab_RevenueAmount_']").val(),
                            isRevenueSharingAmount: 1
                        }
                        strRevenueData.push(RevenueData);
                    });
                    var ReturnSahreamount = ValidateTotalSharingAmount();
                    if (ReturnSahreamount == false) {
                        return false;
                    }
                }
                else {

                    $("tr[id^='tblRevenueSharingSlab_Row']").each(function (row, tr) {
                        var RevenueData = {
                            SNo: $(tr).find("input[id^='tblRevenueSharingSlab_SNo_']").val(),
                            Customer: $(tr).find("input[id^='tblRevenueSharingSlab_HdnRevenueSharingCustomer_']").val(),
                            RevenueSharing: $(tr).find("input[id^='tblRevenueSharingSlab_RevenueSharing_']").val(),
                            isRevenueSharingAmount: 0
                        }
                        strRevenueData.push(RevenueData);
                    });
                    var Returnresult = ValidateTotalSharingPerc();
                    if (Returnresult == false) {
                        return false;
                    }
                }

                strRevenueData = JSON.stringify(strRevenueData);
                if (strData == "[]" || strData == false || strData == undefined) {
                    alert("Tariff slab can not be blank");
                    return false;
                }
                else {
                    arrManageTariff.push({
                        SNo: parseInt(getQueryStringValue("FormAction").toUpperCase() == 'EDIT' ? $("#hdnTariffSNo").val() : 0),
                        TariffFor: parseInt($("input[name='TariffFor']:checked").val()),
                        FreightType: $("input[id$='FreightType']:checked").val() == undefined ? null : parseInt($("input[id$='FreightType']:checked").val()),
                        BuildUpType: $("input[id$='BuildUpType']:checked").val() == undefined ? null : parseInt($("input[id$='BuildUpType']:checked").val()),
                        Location: parseInt($("input[name='TariffFor']:checked").val()) == 3 ? "" : parseInt($("#Location").val()),
                        TariffName: parseInt($("#TariffName").val()),
                        TariffCode: parseInt($("#TariffCode").val()),
                        ShipmentType: parseInt($("input[name='ShipmentType']:checked").val()),
                        ApplicableFor: parseInt($("input[name='ApplicableFor']:checked").val()),
                        ChargeTo: parseInt($("input[name='ChargeTo']:checked").val()),
                        ValidFrom: $("#ValidFrom").val(),
                        ValidTo: $("#ValidTo").val() == "" ? "1900-01-01" : $("#ValidTo").val(),
                        Minimum: parseInt($("#Minimum").val()),
                        BasedOn: parseInt($("input[name='BasedOn']:checked").val()),
                        IsMandatory: ($("input[name='IsMandatory']:checked").val() == 0 ? true : false),
                        IsESS: ($("input[name='IsESS']:checked").val() == 0 ? true : false),
                        FreightPercentValue: ($('#FreightPercentValue').val() == "" ? null : $('#FreightPercentValue').val()),
                        Currency: parseInt($("#Currency").val()),
                        Remarks: $("#Remarks").val(),
                        Tax: $("#Tax").val(),
                        SPHC: $("#SPHC").val(),
                        Agent: $("#Agent").val(),
                        Airline: $("#Airline").val(),
                        strData: (strData == "[]" || strData == false) ? "" : btoa(strData),
                        strRevenueData: (strRevenueData == "[]" || strRevenueData == false) ? "" : btoa(strRevenueData),
                        ActionType: getQueryStringValue("FormAction").toUpperCase(),
                        Inventory: $("input:hidden[id='Inventory']").val(),
                        Ratetype: $("span[id='Ratetype']").text(),
                        Chargetype: $("span[id='Chargetype']").text(),
                        Process: $("input:hidden[id='Process']").val(),
                        SubProcess: $("input:hidden[id='SubProcess']").val(),
                        IsFlatRate: ($("input[name='FlatRate']:checked").val() == 0 ? 1 : 0),
                        IsSurcharge: $("input[name='IsSurcharge']:checked").val(),
                        Days: selectedDays,
                        Value: $("input[name='IsSurcharge']:checked").val() == 0 ? 0 : $("input[id='Value1']").val(),
                        SHCGroup: $("input:hidden[id='SHCGroup']").val(),
                        LocationMulti: $("#LocationMulti").val(),
                        TruckDestination: parseInt($("#TruckDestination").val() == "" ? 0 : $("#TruckDestination").val()),
                        TariffIdName: $("input[id='TariffIdName']").val(),
                        Warehousefacility: $("input:radio[name='Warehousefacility']:checked").val(),
                        AccountTypeId: $("input:radio[name='AccountTypeId']:checked").val(),
                        IsSlideScale: ($("input:radio[name='SlideScale']:checked").val() == 0 ? 1 : 0),
                        IsEditableUnit: ($("input:radio[name='EditableUnit']:checked").val() == 0 ? 1 : 0),

                        IsDomestic: ($("input:radio[name='Domestic']:checked").val()),
                        IsRushHandling: ($("input:radio[name='RushHandling']:checked").val() == 0 ? 1 : 0),
                        WHLocationTypeSNo: $("#WHLocationTypeSNo").val(),
                        TotalCost: ($("#DemurrageCast").val() == "" ? "0.00" : $("#DemurrageCast").val()),
                        ULDType: ($("#ULDType").val()),
                        Accounttype: parseInt($("#Accounttype").val()),                     
                        IsActive: ($("input:radio[name='Active']:checked").val()==0 ? true:false),

                    })

                    $.ajax({
                        url: "./Services/Tariff/ManageTariffService.svc/SaveAndUpdateManageTariff", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ ManageTariff: arrManageTariff }),
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            if (response.length > 0) {
                                if (response[0].indexOf("Tariff already exists.") == 0) {

                                    ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value>", ""), "bottom-right");
                                    e.preventDefault();
                                }
                                else if (response == "Error") {
                                    ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value> Occured", ""), "bottom-right");
                                    e.preventDefault();

                                }
                                else {
                                    navigateUrl('Default.cshtml?Module=Tariff&Apps=ManageTariff&FormAction=INDEXVIEW');
                                }
                            }
                            else
                                ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value> Occured", ""), "bottom-right");

                        },
                        error: function (er) {

                        }
                    });
                }
            }
            else {
                arrManageTariff.push({
                    SNo: parseInt(getQueryStringValue("FormAction").toUpperCase() == 'EDIT' ? $("#hdnTariffSNo").val() : 0),
                    TariffFor: parseInt($("input[name='TariffFor']:checked").val()),
                    FreightType: $("input[id$='FreightType']:checked").val() == undefined ? null : parseInt($("input[id$='FreightType']:checked").val()),
                    BuildUpType: $("input[id$='BuildUpType']:checked").val() == undefined ? null : parseInt($("input[id$='BuildUpType']:checked").val()),
                    Location: parseInt($("input[name='TariffFor']:checked").val()) == 3 ? "" : parseInt($("#Location").val()),
                    TariffName: parseInt($("#TariffName").val()),
                    TariffCode: parseInt($("#TariffCode").val()),
                    ShipmentType: parseInt($("input[name='ShipmentType']:checked").val()),
                    ApplicableFor: parseInt($("input[name='ApplicableFor']:checked").val()),
                    ChargeTo: parseInt($("input[name='ChargeTo']:checked").val()),
                    ValidFrom: $("#ValidFrom").val(),
                    ValidTo: $("#ValidTo").val() == "" ? "1900-01-01" : $("#ValidTo").val(),
                    Minimum: parseInt($("#Minimum").val()),
                    BasedOn: parseInt($("input[name='BasedOn']:checked").val()),
                    IsMandatory: ($("input[name='IsMandatory']:checked").val() == 0 ? true : false),
                    IsESS: ($("input[name='IsESS']:checked").val() == 0 ? true : false),
                    FreightPercentValue: ($('#FreightPercentValue').val() == "" ? null : $('#FreightPercentValue').val()),
                    Currency: parseInt($("#Currency").val()),
                    Remarks: $("#Remarks").val(),
                    Tax: $("#Tax").val(),
                    SPHC: $("#SPHC").val(),
                    Agent: $("#Agent").val(),
                    Airline: $("#Airline").val(),
                    strData: (strData == "[]" || strData == false) ? "" : btoa(strData),
                    strRevenueData: (strRevenueData == "[]" || strRevenueData == false) ? "" : btoa(strRevenueData),
                    ActionType: getQueryStringValue("FormAction").toUpperCase(),
                    Inventory: $("input:hidden[id='Inventory']").val(),
                    Ratetype: $("span[id='Ratetype']").text(),
                    Chargetype: $("span[id='Chargetype']").text(),
                    Process: $("input:hidden[id='Process']").val() == "" ? 0 : $("input:hidden[id='Process']").val(),
                    SubProcess: $("input:hidden[id='SubProcess']").val() == "" ? 0 : $("input:hidden[id='SubProcess']").val(),
                    IsFlatRate: ($("input[name='FlatRate']:checked").val() == 0 ? 1 : 0),
                    IsSurcharge: $("input[name='IsSurcharge']:checked").val(),
                    Days: selectedDays,
                    Value: $("input[name='IsSurcharge']:checked").val() == 0 ? 0 : $("input[id='Value1']").val(),
                    SHCGroup: $("input:hidden[id='SHCGroup']").val(),
                    LocationMulti: $("#LocationMulti").val(),
                    TruckDestination: parseInt($("#TruckDestination").val() == "" ? 0 : $("#TruckDestination").val()),
                    TariffIdName: $("input[id='TariffIdName']").val(),
                    Warehousefacility: $("input:radio[name='Warehousefacility']:checked").val(),
                    AccountTypeId: $("input:radio[name='AccountTypeId']:checked").val(),
                    IsSlideScale: ($("input:radio[name='SlideScale']:checked").val() == 0 ? 1 : 0),
                    IsEditableUnit: ($("input:radio[name='EditableUnit']:checked").val() == 0 ? 1 : 0),
                    IsDomestic: ($("input:radio[name='Domestic']:checked").val() ),
                    IsRushHandling: ($("input:radio[name='RushHandling']:checked").val() == 0 ? 1 : 0),
                    TotalCost: ($("#DemurrageCast").val() == null ? "0.00" : $("#DemurrageCast").val()),
                    ULDType: ($("#ULDType").val()),
                    Accounttype: parseInt($("#Accounttype").val()),
                    IsActive: ($("input:radio[name='Active']:checked").val() == 0 ? true : false),           //added by ankit kumar
                })

                $.ajax({
                    url: "./Services/Tariff/ManageTariffService.svc/SaveAndUpdateManageTariff", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ ManageTariff: arrManageTariff }),
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        if (response.length > 0) {
                            if (response[0].indexOf("Tariff already exists.") == 0) {

                                ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value>", ""), "bottom-right");
                                e.preventDefault();
                            }
                            else if (response == "Error") {
                                ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value> Occured", ""), "bottom-right");
                                e.preventDefault();

                            }
                            else {
                                navigateUrl('Default.cshtml?Module=Tariff&Apps=ManageTariff&FormAction=INDEXVIEW');

                            }
                        }
                        else
                            ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value> Occured", ""), "bottom-right");
                    },
                    error: function (er) {

                    }
                });


            }
        }
    })

    function SetRateType(valueId, value, keyId, key) {
        if (key == "") return false;
        $.ajax({
            type: "GET",
            url: "./Services/Tariff/ManageTariffService.svc/GetRateType/" + key,
            dataType: "json",
            success: function (response) {
                var table = jQuery.parseJSON(response);
                $("span[id='Ratetype']").text(table.Table0[0].RateType);
                $("span[id='Chargetype']").text(table.Table0[0].ChargeType);
                if ($("span[id='Ratetype']").text().toUpperCase() == 'INVENTORY') {
                    $(":hidden[name$='Inventory'][id$='Inventory']").closest('td').css("visibility", "visible");
                    $("#spnInventory").closest("td[title$='Inventory']").css("visibility", "visible");

                    $("#Text_Inventory").attr("data-valid", "required");
                    $("#Text_Inventory").attr("data-valid-msg", "Inventory can not be blank");
                    if ($("#spnInventory").closest("td").find("font").length == 0 || $("#spnInventory").closest("td").find("font").text() == '') {
                        $("<font color=red>*</font>").insertBefore("[id='spnInventory']");
                    }
                    $("#Inventory").attr("explicitValid", "1");
                    //$("#spnInventory").closest("td").find("font").html('*');
                    $("#Inventory").val('');
                    $("div#divMultiInventory ul li").find("span[class$='k-delete']").closest('li').remove();
                    $("div#divMultiInventory ul li:last-child").find('input[type="hidden"]').val('');
                    $("div#divMultiInventory ul li:last-child").find('span').text('');
                }
                else {
                    $(":hidden[name$='Inventory'][id$='Inventory']").closest('td').css("visibility", "hidden");
                    $("#spnInventory").closest("td[title$='Inventory']").css("visibility", "hidden");

                    $("#Text_Inventory").removeAttr("data-valid");
                    $("#spnInventory").closest("td").find("font").html('');
                    $("#Text_Inventory").removeAttr("data-valid-msg", "Inventory can not be blank");

                    $("#Inventory").val('');
                    $("div#divMultiInventory ul li").find("span[class$='k-delete']").closest('li').remove();
                    $("div#divMultiInventory ul li:last-child").find('input[type="hidden"]').val('');
                    $("div#divMultiInventory ul li:last-child").find('span').text('');

                }

            },
            error: function (er) {

            }
        });

        //});
    }


    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {

        $("#ValidFrom").data("kendoDatePicker").value("");
        $("#ValidTo").data("kendoDatePicker").value("");

        $("#Text_SPHC").data("kendoAutoComplete").enable(false);
        $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);
        $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
        $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
        $("div#divMultiSHCGroup ul li:last-child").find('span').text('');

        if ($("input[name='TariffFor']:checked").val() == 3) {
            $("#Text_Location").removeAttr("data-valid");
            $("#Text_LocationMulti").attr("data-valid");


        }
        else {
            $("#Text_Location").attr("data-valid", "required");
            $("#Text_LocationMulti").removeAttr("data-valid");

        }

        $("#Text_LocationMulti").hide();
        $("#Text_Location").show();
        $("#Text_Location").closest("span").show()
        $("#Text_LocationMulti").closest("span").hide();
        $("div#divMultiLocationMulti").remove();




    }





    function GetSHCForShipmentType(SHCValue) {
        $.ajax({
            url: "Services/Tariff/ManageTariffService.svc/GetSHCForShipmentType", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SHCValue: SHCValue }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    var resItem = resData[0];
                    SPHC = resItem.SHCValue;
                    Text_SPHC = resItem.Text_SHCValue;
                }
            }
        });

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        //Worked for minimum in invtariffslab

        $(":hidden[id^='tblTariffSlab_SNo_']").val(0);


        //Worked for shipment type

        /*Truck destination*/
        $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
        $("#TruckDestination").val("");
        $("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
        $("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
        $("div#divMultiTruckDestination ul li:last-child").find('span').text('');

        $("#Text_TruckDestination").removeAttr("data-valid");
        $('#Text_SPHC').removeAttr("data-valid-msg");
        $("#spnTruckDestination").closest("td").find("font").html('');
        /*Truck destination*/


        if ($("input[name='TariffFor']:checked").val() == 2) {
            $("#Text_LocationMulti").hide();
            $("#Text_LocationMulti").closest("span").hide();
            $("#Text_Location").show();
            $("#Text_Location").closest("span").show();
            $("#Text_Location").attr("data-valid", "required");
            $("#Text_LocationMulti").removeAttr("data-valid");
            $("div#divMultiLocationMulti").remove();
            $("#LocationMulti").val('');
            var LocationSNo = $('#Location').val();
            var LocationValue = $('#Text_Location').val();
            var data = GetDataSourceV2("Location", "Tariff_AirportCode", null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "AirportCode,AirportName", "contains");
            $('#Location').val(LocationSNo);
            $('#Text_Location').val(LocationValue);
            $("#Text_Location").closest("span").css("text-transform", "");
        }



        if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            if ($("input[name='ShipmentType']:checked").val() == "3") {
                $("#Text_SPHC").data("kendoAutoComplete").enable(true);
                $("#Text_SHCGroup").data("kendoAutoComplete").enable(true);
            }
            if ($("input[name='ShipmentType']:checked").val() == "5") {
                /*Truck destination*/
                $("#Text_TruckDestination").data("kendoAutoComplete").enable(true);
                $("#Text_TruckDestination").attr("data-valid", "required");
                $('#Text_SPHC').attr("data-valid-msg", "Truck Destination can not be blank");
                $("#spnTruckDestination").closest("td").find("font").html('*');
                /*Truck destination*/

                $("#Text_SPHC").data("kendoAutoComplete").enable(true);
                $("#Text_SHCGroup").data("kendoAutoComplete").enable(true);

            }
            if ($("input[name='ShipmentType']:checked").val() == "1" || $("input[name='ShipmentType']:checked").val() == "2") {
                $("#divMultiSPHC").find("ul>li").find("span.k-icon.k-delete").css("display", "none");
            }


        }

    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        if ($("input:radio[name='IsMandatory']:checked").val() == "0") {
            $("input:radio[name='IsESS'][value='1']").attr("checked", true);
            $("input:radio[name='IsESS']").attr("disabled", "disabled");
        }

        //Worked for tariff

        if ($("input[name='TariffFor']:checked").val() == 0) {
            $("#Text_LocationMulti").hide();
            $("#Text_LocationMulti").closest("span").hide();
            $("#Text_Location").show();
            $("#Text_Location").closest("span").show();
            $("#Text_Location").attr("data-valid", "required");
            $("#Text_LocationMulti").removeAttr("data-valid");

            $("div#divMultiLocationMulti").remove();
            $("#LocationMulti").val('');
            var LocationSNo = $('#Location').val();
            var LocationValue = $('#Text_Location').val();
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CountryCode,CountryName", "contains");
            cfi.AutoCompleteV2("Location", "CountryCode,CountryName", "Tariff_CountryCode", null, "contains");
            $('#Location').val(LocationSNo);
            $('#Text_Location').val(LocationValue);
            $("#Text_Location").closest("span").css("text-transform", "");
        }
        else if ($("input[name='TariffFor']:checked").val() == 1) {
            $("#Text_LocationMulti").hide();
            $("#Text_LocationMulti").closest("span").hide();
            $("#Text_Location").show();
            $("#Text_Location").closest("span").show();
            $("#Text_Location").attr("data-valid", "required");
            $("#Text_LocationMulti").removeAttr("data-valid");
            $("div#divMultiLocationMulti").remove();
            $("#LocationMulti").val('');
            var LocationSNo = $('#Location').val();
            var LocationValue = $('#Text_Location').val();
            var data = GetDataSourceV2("Location", "Tariff_CityName", null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CityCode,CityName", "contains");
            $('#Location').val(LocationSNo);
            $('#Text_Location').val(LocationValue);
            $("#Text_Location").closest("span").css("text-transform", "");
        }
        else if ($("input[name='TariffFor']:checked").val() == 2) {
            $("#Text_LocationMulti").hide();
            $("#Text_LocationMulti").closest("span").hide();
            $("#Text_Location").show();
            $("#Text_Location").closest("span").show();
            $("#Text_Location").attr("data-valid", "required");
            $("#Text_LocationMulti").removeAttr("data-valid");
            $("div#divMultiLocationMulti").remove();
            $("#LocationMulti").val('');
            var LocationSNo = $('#Location').val();
            var LocationValue = $('#Text_Location').val();
            var data = GetDataSourceV2("Location", "Tariff_AirportCode", null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "AirportCode,AirportName", "contains");
            $('#Location').val(LocationSNo);
            $('#Text_Location').val(LocationValue);
            $("#Text_Location").closest("span").css("text-transform", "");
        }
        else if ($("input[name='TariffFor']:checked").val() == 3) {
            $("#Text_Location").hide();
            $("#Text_Location").closest("span").parent().hide();
            $("#Text_LocationMulti").show();
            $("#Text_Location").hide();
            $("#Text_Location").removeAttr("data-valid");
            $("#Text_LocationMulti").attr("data-valid", "required");
            $("#Text_LocationMulti").attr("data-valid-msg", "Terminal can not be blank");
            $("#Text_Location").closest("span").hide();
            $("#Location").val('');
            $("#LocationMulti").attr("explicitValid", "1")
        }


        //Worked for shipment type
        switch ($("input[name='ShipmentType']:checked").val()) {
            case "5":
                {
                    /*Truck destination*/
                    $("#Text_TruckDestination").data("kendoAutoComplete").enable(true);
                    $("#Text_TruckDestination").attr("data-valid", "required");
                    $('#Text_SPHC').attr("data-valid-msg", "Truck Destination can not be blank");
                    $("#spnTruckDestination").closest("td").find("font").html('*');
                    /*Truck destination*/


                    $("#Text_SPHC").data("kendoAutoComplete").enable(true);
                    $("#Text_SHCGroup").data("kendoAutoComplete").enable(true);

                    break;
                }

            case "3":
                cfi.BindMultiValue("SPHC", $("#Text_SPHC").val(), $("#SPHC").val());

                //if ($("#SPHC").val() == "" && $('#SHCGroup').val() == "") {
                //    $("#Text_SPHC").attr("data-valid", "required");
                //    $('#Text_SPHC').attr("data-valid-msg", "SHC can not be blank");
                //    $("<font color=red>*</font>").insertBefore("[id='spnSPHC']");
                //    $("#Text_SHCGroup").attr("data-valid", "required");
                //    $('#Text_SHCGroup').attr("data-valid-msg", "SHC Group can not be blank");
                //    $("<font color=red>*</font>").insertBefore("[id='spnSHCGroup']");

                //}

                /*Truck destination*/
                $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                $("#TruckDestination").val("");
                $("#Text_TruckDestination").val("");
                //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');

                $("#Text_TruckDestination").removeAttr("data-valid");
                $('#Text_SPHC').removeAttr("data-valid-msg");
                $("#spnTruckDestination").closest("td").find("font").html('');
                /*Truck destination*/




                break;
            case "1":
            case "2":
                $("#Text_SPHC").data("kendoAutoComplete").enable(false);
                $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);
                //$("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
                //$("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
                //$("div#divMultiSPHC ul li:last-child").find('span').text('');
                $("#divMultiSPHC").find("ul>li").find("span.k-icon.k-delete").css("display", "none");
                /*Truck destination*/
                $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                $("#TruckDestination").val("");
                $("#Text_TruckDestination").val("");
                //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');

                $("#Text_TruckDestination").removeAttr("data-valid");
                $('#Text_SPHC').removeAttr("data-valid-msg");
                $("#spnTruckDestination").closest("td").find("font").html('');
                /*Truck destination*/


                //$("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                //$("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                //$("div#divMultiSHCGroup ul li:last-child").find('span').text('');
                //GetSHCForShipmentType("MAL");
                //cfi.BindMultiValue("SPHC", Text_SPHC, SPHC);
                //$("#SPHC").val($("#divMultiSPHC").find(":hidden[id='Multi_SPHC']").val());

                break;
                //case "2":
                //    $("#Text_SPHC").data("kendoAutoComplete").enable(false);
                //    $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);
                //    //$("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
                //    //$("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
                //    //$("div#divMultiSPHC ul li:last-child").find('span').text('');


                //    //$("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                //    //$("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                //    //$("div#divMultiSHCGroup ul li:last-child").find('span').text('');
                //    //GetSHCForShipmentType("COU");
                //    //cfi.BindMultiValue("SPHC", Text_SPHC, SPHC);
                //    //$("#SPHC").val($("#divMultiSPHC").find(":hidden[id='Multi_SPHC']").val());
                //    break;
            default:
                $("#Text_SPHC").data("kendoAutoComplete").enable(false);
                $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);
                /*Truck destination*/
                $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                $("#TruckDestination").val("");
                $("#Text_TruckDestination").val("");
                //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');

                $("#Text_TruckDestination").removeAttr("data-valid");
                $('#Text_SPHC').removeAttr("data-valid-msg");
                $("#spnTruckDestination").closest("td").find("font").html('');
                /*Truck destination*/
                break;

        }





    }

    // Shipment Type change

    //FnShipmentType();
    $('input:radio[name=ShipmentType]').change(function () {
        FnShipmentType();
    });

    function FnChargeTo() {
        switch ($("input[name='ChargeTo']:checked").val()) {
            case "0":
                $("#Text_Airline").data("kendoAutoComplete").enable(false);
                $("#Text_Agent").data("kendoAutoComplete").enable(true);


                break;
            case "1":
                $("#Text_Airline").data("kendoAutoComplete").enable(true);
                $("#Text_Agent").data("kendoAutoComplete").enable(false);
                break;
            default:
                {
                    $("#Text_Airline").data("kendoAutoComplete").enable(true);
                    $("#Text_Agent").data("kendoAutoComplete").enable(true);
                }
        }
    }
    // FnChargeTo();
    $('input:radio[name=ChargeTo]').change(function () {
        //  FnChargeTo();
    });


    function FnShipmentType() {
        switch ($("input[name='ShipmentType']:checked").val()) {
            case "5": {
                /*Truck destination*/
                $("#Text_TruckDestination").data("kendoAutoComplete").enable(true);
                $("#Text_TruckDestination").attr("data-valid", "required");
                $('#Text_SPHC').attr("data-valid-msg", "Truck Destination can not be blank");
                $("#spnTruckDestination").closest("td").find("font").html('*');
                /*Truck destination*/


                $("#Text_SPHC").data("kendoAutoComplete").enable(true);
                $("#Text_SHCGroup").data("kendoAutoComplete").enable(true);

                GetSHCForShipmentType("COU");
                cfi.BindMultiValue("SPHC", Text_SPHC, SPHC);
                $("#SPHC").val($("#divMultiSPHC").find(":hidden[id='Multi_SPHC']").val());
                //$("#divMultiSPHC").find("ul>li").find("span.k-icon.k-delete").css("display", "none");



                $("#SPHC").val("");
                $("#SHCGroup").val("");
                $("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
                $("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
                $("div#divMultiSPHC ul li:last-child").find('span').text('');


                $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                $("div#divMultiSHCGroup ul li:last-child").find('span').text('');
                //$("#spnSPHC").closest("td").find("font").html('');
                //$("#spnSHCGroup").closest("td").find("font").html('');
                $("#spnSPHC").closest("td").find("font").remove();
                $("#spnSHCGroup").closest("td").find("font").remove();
                break;
            }
            case "0":
            case "4":
                {
                    /*Truck destination*/
                    $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                    $("#TruckDestination").val("");
                    $("#Text_TruckDestination").val("");

                    //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                    //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                    //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');

                    $("#Text_TruckDestination").removeAttr("data-valid");
                    $('#Text_SPHC').removeAttr("data-valid-msg");
                    $("#spnTruckDestination").closest("td").find("font").html('');

                    /*Truck destination*/


                    $("#Text_SPHC").data("kendoAutoComplete").enable(false);
                    $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);

                    $("#SPHC").val("");
                    $("#SHCGroup").val("");
                    $("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
                    $("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
                    $("div#divMultiSPHC ul li:last-child").find('span').text('');


                    $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                    $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                    $("div#divMultiSHCGroup ul li:last-child").find('span').text('');
                    //$("#spnSPHC").closest("td").find("font").html('');
                    //$("#spnSHCGroup").closest("td").find("font").html('');
                    $("#spnSPHC").closest("td").find("font").remove();
                    $("#spnSHCGroup").closest("td").find("font").remove();
                    break;
                }
            case "1": {

                /*Truck destination*/
                $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                $("#TruckDestination").val("");
                $("#Text_TruckDestination").val("");
                //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');

                $("#Text_TruckDestination").removeAttr("data-valid");
                $('#Text_SPHC').removeAttr("data-valid-msg");
                $("#spnTruckDestination").closest("td").find("font").html('');
                /*Truck destination*/

                $("#Text_SPHC").data("kendoAutoComplete").enable(false);
                $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);

                $("#SPHC").val("");
                $("#SHCGroup").val("");

                $("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
                $("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
                $("div#divMultiSPHC ul li:last-child").find('span').text('');

                $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                $("div#divMultiSHCGroup ul li:last-child").find('span').text('');

                GetSHCForShipmentType("MAL");
                cfi.BindMultiValue("SPHC", Text_SPHC, SPHC);
                $("#SPHC").val($("#divMultiSPHC").find(":hidden[id='Multi_SPHC']").val());
                $("#divMultiSPHC").find("ul>li").find("span.k-icon.k-delete").css("display", "none");
                $("#Text_SPHC").removeAttr("data-valid");
                $("#Text_SHCGroup").removeAttr("data-valid");;

                $('#Text_SPHC').removeAttr("data-valid-msg");
                $('#Text_SHCGroup').removeAttr("data-valid-msg");
                $("#spnSPHC").closest("td").find("font").remove();
                $("#spnSHCGroup").closest("td").find("font").remove();

                //$("#spnSPHC").closest("td").find("font").html('');
                //$("#spnSHCGroup").closest("td").find("font").html('');
                break;
            }
            case "2": {
                /*Truck destination*/
                $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                $("#TruckDestination").val("");
                $("#Text_TruckDestination").val("");
                //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');

                $("#Text_TruckDestination").removeAttr("data-valid");
                $('#Text_SPHC').removeAttr("data-valid-msg");
                $("#spnTruckDestination").closest("td").find("font").html('');
                /*Truck destination*/

                $("#Text_SPHC").data("kendoAutoComplete").enable(false);
                $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);

                $("#SPHC").val("");
                $("#SHCGroup").val("");

                $("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
                $("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
                $("div#divMultiSPHC ul li:last-child").find('span').text('');

                $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                $("div#divMultiSHCGroup ul li:last-child").find('span').text('');

                GetSHCForShipmentType("COU");
                cfi.BindMultiValue("SPHC", Text_SPHC, SPHC);
                $("#SPHC").val($("#divMultiSPHC").find(":hidden[id='Multi_SPHC']").val());
                $("#divMultiSPHC").find("ul>li").find("span.k-icon.k-delete").css("display", "none");

                $("#Text_SPHC").removeAttr("data-valid");
                $("#Text_SHCGroup").removeAttr("data-valid");;

                $('#Text_SPHC').removeAttr("data-valid-msg");
                $('#Text_SHCGroup').removeAttr("data-valid-msg");

                $("#spnSPHC").closest("td").find("font").remove();
                $("#spnSHCGroup").closest("td").find("font").remove();

                //$("#spnSPHC").closest("td").find("font").html('');
                //$("#spnSHCGroup").closest("td").find("font").html('');

                break;
            }
            case "3":

                // case "5":
                {
                    /*Truck destination*/
                    $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                    $("#TruckDestination").val("");
                    $("#Text_TruckDestination").val("");
                    //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                    //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                    //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');
                    $("#Text_TruckDestination").removeAttr("data-valid");
                    $('#Text_SPHC').removeAttr("data-valid-msg");
                    $("#spnTruckDestination").closest("td").find("font").html('');


                    /*Truck destination*/

                    $("#Text_SPHC").data("kendoAutoComplete").enable(true);
                    $("#Text_SHCGroup").data("kendoAutoComplete").enable(true);
                    $("#SPHC").val("");
                    $("#SHCGroup").val("");
                    $("div#divMultiSPHC ul li").find("span[class$='k-delete']").closest('li').remove();
                    $("div#divMultiSPHC ul li:last-child").find('input[type="hidden"]').val('');
                    $("div#divMultiSPHC ul li:last-child").find('span').text('');

                    $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                    $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                    $("div#divMultiSHCGroup ul li:last-child").find('span').text('');


                    //$("#Text_SPHC").attr("data-valid", "required");
                    //$("#Text_SHCGroup").attr("data-valid", "required");

                    //$('#Text_SPHC').attr("data-valid-msg", "SHC can not be blank");
                    //$('#Text_SHCGroup').attr("data-valid-msg", "SHC Group can not be blank");
                    $("#Text_SPHC").removeAttr("data-valid");
                    $("#Text_SHCGroup").removeAttr("data-valid");;

                    $('#Text_SPHC').removeAttr("data-valid-msg");
                    $('#Text_SHCGroup').removeAttr("data-valid-msg");



                    //if ($("#spnSHCGroup").closest("td").find("font").length == 0) {
                    //    $("<font color=red>*</font>").insertBefore("[id='spnSPHC']");
                    //    $("<font color=red>*</font>").insertBefore("[id='spnSHCGroup']");
                    //}
                    $("#spnSPHC").closest("td").find("font").remove();
                    $("#spnSHCGroup").closest("td").find("font").remove();
                    break;
                }
            default:
                {
                    /*Truck destination*/
                    $("#Text_TruckDestination").data("kendoAutoComplete").enable(false);
                    $("#TruckDestination").val("");
                    $("#Text_TruckDestination").val("");
                    //$("div#divMultiTruckDestination ul li").find("span[class$='k-delete']").closest('li').remove();
                    //$("div#divMultiTruckDestination ul li:last-child").find('input[type="hidden"]').val('');
                    //$("div#divMultiTruckDestination ul li:last-child").find('span').text('');

                    $("#Text_TruckDestination").removeAttr("data-valid");
                    $('#Text_SPHC').removeAttr("data-valid-msg");
                    $("#spnTruckDestination").closest("td").find("font").html('');
                    /*Truck destination*/

                    $("#Text_SPHC").data("kendoAutoComplete").enable(false);
                    $("#Text_SHCGroup").data("kendoAutoComplete").enable(false);
                    $("#SPHC").val("");
                    $("#SHCGroup").val("");
                    $("div#divMultiSHCGroup ul li").find("span[class$='k-delete']").closest('li').remove();
                    $("div#divMultiSHCGroup ul li:last-child").find('input[type="hidden"]').val('');
                    $("div#divMultiSHCGroup ul li:last-child").find('span').text('');
                    $("#Text_SPHC").removeAttr("data-valid");
                    $("#Text_SHCGroup").removeAttr("data-valid");;

                    $('#Text_SPHC').removeAttr("data-valid-msg");
                    $('#Text_SHCGroup').removeAttr("data-valid-msg");

                    //$("#spnSPHC").closest("td").find("font").html('');
                    //$("#spnSHCGroup").closest("td").find("font").html('');
                    $("#spnSPHC").closest("td").find("font").remove();
                    $("#spnSHCGroup").closest("td").find("font").remove();
                    break;
                }
                break;
        }
    }


    cfi.BindMultiValue("LocationMulti", $("#Text_LocationMulti").val(), $("#LocationMulti").val());
    $('input:radio[name=TariffFor]').change(function (e) {

        if ($("input[name='TariffFor']:checked").val() == 0) {

            //$("div#divMultiLocationMulti ul li").find("span[class$='k-delete']").closest('li').remove();
            //$("div#divMultiLocationMulti ul li:last-child").find('input[type="hidden"]').val('');
            //$("div#divMultiLocationMulti ul li:last-child").find('span').text('');
            //$("#Text_LocationMulti").closest('td').find("[id='LocationMulti']").val('');
            $("div#divMultiLocationMulti").remove();
            $("#LocationMulti").val('');

            $("#Text_Location").show();
            $("#Text_Location").closest("span").parent().show();
            $("#Text_Location").closest("span").show();

            $("#Text_Location").attr("data-valid", "required");
            $('#Text_Location').attr("data-valid-msg", "Location can not be blank");
            $("#Text_LocationMulti").removeAttr("data-valid");
            $("#Text_LocationMulti").hide();
            $("#Text_Location").show();

            $("#Text_LocationMulti").closest("span").hide();

            var data = GetDataSourceV2("Location", "Tariff_CountryCode", null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CountryCode,CountryName", "contains");
            $("#Text_Location").closest("span").css("text-transform", "");
        }
        else if ($("input[name='TariffFor']:checked").val() == 1) {
            //$("div#divMultiLocationMulti ul li").find("span[class$='k-delete']").closest('li').remove();
            //$("div#divMultiLocationMulti ul li:last-child").find('input[type="hidden"]').val('');
            //$("div#divMultiLocationMulti ul li:last-child").find('span').text('');
            //$("#Text_LocationMulti").closest('td').find("[id='LocationMulti']").val('');
            $("div#divMultiLocationMulti").remove();
            $("#LocationMulti").val('');

            $("#Text_Location").show();
            $("#Text_Location").closest("span").parent().show();

            $("#Text_Location").attr("data-valid", "required");
            $('#Text_Location').attr("data-valid-msg", "Location can not be blank");
            $("#Text_LocationMulti").removeAttr("data-valid");
            $("#Text_LocationMulti").hide();
            $("#Text_Location").show();
            $("#Text_Location").closest("span").show();
            $("#Text_LocationMulti").closest("span").hide();

            var data = GetDataSourceV2("Location", "Tariff_CityName", null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CityCode,CityName", "contains");
            $("#Text_Location").closest("span").css("text-transform", "");



        }
        else if ($("input[name='TariffFor']:checked").val() == 2) {
            //$("div#divMultiLocationMulti ul li").find("span[class$='k-delete']").closest('li').remove();
            //$("div#divMultiLocationMulti ul li:last-child").find('input[type="hidden"]').val('');
            //$("div#divMultiLocationMulti ul li:last-child").find('span').text('');
            //$("#Text_LocationMulti").closest('td').find("[id='LocationMulti']").val('');
            $("div#divMultiLocationMulti").remove();
            $("#LocationMulti").val('');

            $("#Text_Location").show();
            $("#Text_Location").closest("span").parent().show();
            //$("#Text_Location").closest("span").show();
            $("#Text_Location").attr("data-valid", "required");
            $('#Text_Location').attr("data-valid-msg", "Location can not be blank");
            $("#Text_LocationMulti").removeAttr("data-valid");
            $("#Text_LocationMulti").hide();
            $("#Text_Location").show();
            $("#Text_Location").closest("span").show();
            $("#Text_LocationMulti").closest("span").hide();
            var data = GetDataSourceV2("Location", "Tariff_AirportCode", null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "AirportCode,AirportName", "contains");
            $("#Text_Location").closest("span").css("text-transform", "");
        }
        else if ($("input[name='TariffFor']:checked").val() == 3) {



            $("#Text_Location").closest("span").parent().hide();



            $("#Text_Location").hide();
            $("#Text_LocationMulti").show();
            $("#Text_LocationMulti").closest("span").show();

            $("#Text_Location").closest("span").hide();
            $("#Location").val('');
            $("#Text_LocationMulti").attr("data-valid", "required");
            $('#Text_LocationMulti').attr("data-valid-msg", "Terminal can not be blank");
            $("#Text_Location").removeAttr("data-valid");
            cfi.AutoCompleteV2("LocationMulti", "TerminalName", "Tariff_TerminalName", null, "contains", ",");
            $("#Text_LocationMulti").closest("span").css("text-transform", "");
        }
    });

    //InstantiateControl(containerId);


    if (getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {
        cfi.BindMultiValue("SHCGroup", Text_SPHCDuplicate, $("#SHCGroup").val());
    }


    $("[id^='tblTariffSlab_IsFlatRate_']").click(function () {
        var rowIndex = $(this).attr("id").split('_')[2];

        if ($(this).is(":checked")) {
            $("#tblTariffSlab_MinimumSlab_" + rowIndex).attr("disabled", "disabled");
            $("#_temptblTariffSlab_MinimumSlab_" + rowIndex).val('0.000');
            $("#tblTariffSlab_MinimumSlab_" + rowIndex).val('0.000');
        }
        else {
            $("#tblTariffSlab_MinimumSlab_" + rowIndex).attr("disabled", false);
        }


    });

    // Sushant

    var HallDays = $("#HallDays").val();
    if (HallDays !== undefined) {
        var Sval = HallDays.split(',');
        if (Sval[0] != "" && Sval[1] != "" && Sval[2] != "" && Sval[3] != "" && Sval[4] != "" && Sval[5] != "" && Sval[6] != "") {
            $('.Days').attr('checked', true);
        }
        //Commented by jk,27 july 2018
        //$('.Days:checkbox').each(function () {
        //    for (var i = 0; i < Sval.length; i++) {
        //        var GetVal = Sval[i]

        //        if (GetVal == $(this).val()) {
        //            $(this).attr('checked', true);
        //        }

        //    }
        //});
        //added by jk 27 july 2018
        var lengthdays = $('.Days:checkbox').length;
        var j = 0
        for (var i = 1; i <= lengthdays - 1; i++) {
          
            var GetVal = Sval[j]

            if (GetVal != "" && GetVal != undefined) {
                $("input[type='checkbox'][value^=" + i + "]").attr('checked', true);
                j++;
            }
            else {
                $("input[type='checkbox'][value^=" + i + "]").attr('checked', false);
                j++;
            }
           
        }


    }


    //if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
    //    var val = $("[type='hidden'][id='Domestic']").val().toUpperCase();
    //    if (val == "BOTH") {
    //        $("[type='hidden'][id='Domestic']").val("2");
    //    }
    //    else if (val = "DOMESTIC")
    //        $("[type='hidden'][id='Domestic']").val("1");
    //    else
    //        $("[type='hidden'][id='Domestic']").val("0");
    //}
});

function CheckImportCollect() {
    if ($("input[name='ApplicableFor']:checked").val() == 1 && $("input[name='BasedOn']:checked").val() == 3 && $("input[name='FreightType']:checked").val() == 1) {
        $("#FreightPercentValue").attr("disabled", false);
        $('#divTariffSlab').hide();
        strData = "[]"
    }
    else {
        $("#FreightPercentValue").attr("disabled", true);
        $('#divTariffSlab').show();
    }
}

function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(new Date(start.setDate(start.getDate())));
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(new Date(start.setDate(start.getDate())));
        });
    }
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    // var filterSHC = cfi.getFilter("AND");

    if (textId == "Text_TariffName") {
        cfi.setFilter(filter, "ParentSNo", "eq", 0);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }
    if (textId == "Text_TariffCode") {
        try {
            cfi.setFilter(filter, "ParentSNo", "neq", 0);
            cfi.setFilter(filter, "ParentSNo", "eq", $("#Text_TariffName").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }

    if (textId == "Text_SPHC") {
        return cfi.getFilter("AND"), cfi.setFilter(filter, "SNo", "notin", $("#SPHC").val()), cfi.getFilter("AND"), ($("input[name='ShipmentType']:checked").val() != "5" ? cfi.setFilter(filter, "SNo", "notin", "24,73") : cfi.setFilter(filter, "SNo", "notin", "73")), cfi.autoCompleteFilter(filter);
    }

    if (textId == "Text_LocationMulti") {
        ////cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");
        //cfi.setFilter(filterSPHC2, "SNo", "notin", $("#LocationMulti").val());
        //SPHCDGRFilter = cfi.autoCompleteFilter(filterSPHC2);
        //return cfi.getFilter("AND"), cfi.setFilter(filter, "CityCode", "in", userContext.CityCode), cfi.autoCompleteFilter(filter);

        //return SPHCDGRFilter;

        var filterTerminal = cfi.getFilter("AND");
        cfi.setFilter(filterTerminal, "CityCode", "in", userContext.CityCode)
        cfi.setFilter(filterTerminal, "SNo", "notin", $("#LocationMulti").val());
        var filterTerminalAutoCompleteFilter = cfi.autoCompleteFilter([filterTerminal]);
        return filterTerminalAutoCompleteFilter;
    }

    if (textId == "Text_Agent") {
        return cfi.getFilter("AND"), cfi.setFilter(filter, "iswarehouse", "in", $("input:radio[name='Warehousefacility']:checked").val() == "2" ? "0,1" : $("input:radio[name='Warehousefacility']:checked").val() == "0" ? "1" : "0"), cfi.autoCompleteFilter(filter);
    }
    if (textId == "Text_Inventory") {

        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "CitySno", "eq", userContext.CitySNo), filter = cfi.autoCompleteFilter(textId);
    }
    if (textId == "Text_Airline") {
        var filterTerminal = cfi.getFilter("AND");
        cfi.setFilter(filterTerminal, "SNo", "notin", $("#Airline").val());
        var filterTerminalAutoCompleteFilter = cfi.autoCompleteFilter([filterTerminal]);
        return filterTerminalAutoCompleteFilter;
    }

    if (textId.indexOf("tblRevenueSharingSlab_RevenueSharingCustomer_") >= 0) {
        var RevenueSharing = 0;
        $("tr[id^='tblRevenueSharingSlab_Row_']").each(function (row, tr) {
            RevenueSharing = RevenueSharing + ',' + $(tr).find("input[id^='tblRevenueSharingSlab_HdnRevenueSharingCustomer']").val();
        });
        var RevenueSharingFilter = cfi.getFilter("AND");
        cfi.setFilter(RevenueSharingFilter, "SNo", "notin", RevenueSharing);

        filterRevenueSharing = cfi.autoCompleteFilter(RevenueSharingFilter);
        return filterRevenueSharing;
    }
    if (textId == "Text_Accounttype") {

        var filterTerminal = cfi.getFilter("AND");
        cfi.setFilter(filterTerminal, "AutoCompleteName", "eq", "Accounttype");
        var filterTerminalAutoCompleteFilter = cfi.autoCompleteFilter([filterTerminal]);
        return filterTerminalAutoCompleteFilter;
    }

}

function SetBasis(valueId, value, keyId, key) {
    $("#Text_TariffCode").val('');
    $("span[id='Ratetype']").text('');
    $("span[id='Chargetype']").text('');
    if (key != "") {
        $.ajax({
            type: "GET",
            url: "./Services/Tariff/ManageTariffService.svc/GetTariffBasis/" + key,
            dataType: "html",
            success: function (response) {
                var basis = JSON.parse(response);
                basis = basis.replace('[', '').replace(']', '').replace('{', '').replace('}', '').split(':')[1].replace('"', '').replace('"', '');
                $("span[id=TariffBasis]").html(basis);
            },
            error: function (er) {

            }
        });
    }
    else
        $("span[id=TariffBasis]").html("");
}

var strData = [];
var pageType = $('#hdnPageType').val();
function CreateSlabGrid() {
    var dbtableName = "TariffSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnTariffSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Tariff/ManageTariffService.svc",
        getRecordServiceMethod: "GetTariffSlabRecord",
        deleteServiceMethod: "DeleteManageTariffSlab",
        caption: "Tariff Slab Information",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
                 { name: "SlabType", display: "Slab Type", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 0: "WEIGHT", 1: "TIME", 2: "UNIT" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 { name: "StartValue", display: "Start Range", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 { name: "EndValue", display: "End Range", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, onblur: "return CheckValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "number" : "" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 { name: "SlabValue", display: "Value", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { onBlur: "return CheckValueValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 11 }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
                 { name: "IsFlatRate", display: "Flat Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "checkbox" : "checkbox", ctrlCss: { width: "50px" }, isRequired: false, ctrlAttr: { validatename: "" } },
                 { name: "MinimumSlab", display: "Minimum", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlCss: { width: "70px" }, isRequired: false, ctrlAttr: { controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 10, title: "Enter Amount", value: "0.000" } }
        ]
        ,
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex, obj) {

            //addedRowIndex = $('tr', $("#tblTariffSlab").find('tbody')).length;
            if ($("[id^='tblTariffSlab_SlabType_'] option:selected").val() != 1) {


                if ($("[id^='tblTariffSlab_SlabType_']").length > 1) {

                    if ($("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 0 || $("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 2) {

                        var index = $(caller).find('tbody tr:last').attr('id').split('_')[2]
                        $('#tblTariffSlab_Delete_' + index).css('display', 'block');
                        $('#tblTariffSlab_btnAppendRow').css('display', 'block');

                        if ($("input:radio[name='RevenueAmount']:checked").val() == 'RAmount') {
                            alert('adding Slab is not allowd, please select revanue sharing in % to add Tariff slab ');

                            $('#tblTariffSlab_Row_' + index).remove();

                        }
                    }

                }
            }
            //else {
            //    $("[id*='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", true);

            //    $("#Revenuepercent").attr("disabled", false);
            //    $("#RevenueAmount").attr("disabled", "disabled");

            //}
            if (addedRowIndex > 0) {

                var endValue = $(caller).appendGrid('getCtrlValue', 'EndValue', parentRowIndex);
                if ($("#tblTariffSlab_SlabType_" + addedRowIndex).val() != 0)
                    endValue = parseInt(endValue);
                $(caller).appendGrid('setCtrlValue', 'StartValue', addedRowIndex, endValue);
                //$("#" + $(caller)[0].id).find("tr:eq(" + $("#" + settings.tableID + " tr[id^='" + settings.tableID + "']:last").attr("id").split('_')[2] + ")").find(':input').prop("disabled", true);

                //$("#tblTariffSlab_StartValue_" + (parseInt(addedRowIndex) + 1)).prop("disabled", true);
                //$("[id*='" + "tblTariffSlab_StartValue" + "']").prop("disabled", true);

                $("#tblTariffSlab_StartValue_" + (parseInt(addedRowIndex) + 1)).prop("disabled", false);
                $("[id*='" + "tblTariffSlab_StartValue" + "']").prop("disabled", false);

                $("#" + $(caller)[0].id).find("tr:eq(" + $("#" + settings.tableID + " tr[id^='" + settings.tableID + "']:last").attr("id").split('_')[2] + ")").find('button').hide();
                var ChkValue = "";
                $("tr[id^='tblTariffSlab_Row']").each(function () {
                    ChkValue = (ChkValue == "" ? $("#" + $(this).attr("id") + " option:checked").val() : ChkValue);
                    $(this).find("select").attr("disabled", true);
                    $(this).find("select").val(ChkValue);
                });
            }
            //if (pageType == "EDIT") {
            //    $("#tblTariffSlab_StartValue_" + (parseInt(addedRowIndex) + 1)).prop("disabled", true);
            //    $("[id*='" + "tblTariffSlab_StartValue" + "']").prop("disabled", true);
            //}

            $("tr[id^='tblTariffSlab_Row']").each(function () {
                $("#" + $(this).attr("id") + " td:eq(2)").find("StartValue");
            });
            /*** added by jk 16 may 2018 ***/

            /****end by jk Revenue **/
            if (pageType == "NEW") {
                $("tr[id^='tblTariffSlab_Row']").each(function () {
                    var ChkValue = $("#" + $(this).attr("id") + " option:checked").val();
                    if (ChkValue == 0) {
                        if ($("#" + $(this).attr("id") + " td:eq(2)").text().indexOf("KG") < 0) {
                            $("#" + $(this).attr("id") + " td:eq(2)").append("<span id='spnUnit'>KG</span>");
                            $("#" + $(this).attr("id") + " td:eq(3)").append("<span id='spnUnit'>KG</span>");
                            //$("#" + $(this).attr("id") + " td:eq(2)").find("input").attr("maxlength", "8"); // Commented  due to 3283:
                            //$("#" + $(this).attr("id") + " td:eq(3)").find("input").attr("maxlength", "9");
                        }
                    }
                    else if (ChkValue == 1) {
                        if ($("#" + $(this).attr("id") + " td:eq(2)").text().indexOf("HOUR") < 0) {
                            $("#" + $(this).attr("id") + " td:eq(2)").append("<span id='spnUnit'>HOUR</span>");
                            $("#" + $(this).attr("id") + " td:eq(3)").append("<span id='spnUnit'>HOUR</span>");
                            //$("#" + $(this).attr("id") + " td:eq(2)").find("input").attr("maxlength", "7");
                            //$("#" + $(this).attr("id") + " td:eq(3)").find("input").attr("maxlength", "7");
                        }
                    }
                    else {
                        $("#" + $(this).attr("id") + " td:eq(2)").append("<span id='spnUnit'></span>");
                        $("#" + $(this).attr("id") + " td:eq(3)").append("<span id='spnUnit'></span>");
                        //$("#" + $(this).attr("id") + " td:eq(2)").find("input").attr("maxlength", "7");
                        //$("#" + $(this).attr("id") + " td:eq(3)").find("input").attr("maxlength", "7");
                    }
                });
            }

            var length = $("tr[id^='tblTariffSlab_Row']").find("select")[$("tr[id^='tblTariffSlab_Row']").find("select").length - 1].id.split("_")[2];

            for (var i = 1; i <= length; i++) {
                if (pageType == "READ" || pageType == "DELETE") {
                    $("#tblTariffSlab_Delete_" + i).hide();
                    $("#tblTariffSlab_SlabType_" + i).prop("disabled", true);
                }
                else {
                    if (length > 1)
                        $("#tblTariffSlab_SlabType_" + i).prop("disabled", true);
                    strData.push(i);
                    if (i < length) {
                        $("#tblTariffSlab_Delete_" + i).hide();
                        $("#tblTariffSlab_SlabType_" + i).prop("disabled", true);
                        //  $("#tblTariffSlab_StartValue_" + i).prop("disabled", true);
                        $("#tblTariffSlab_EndValue_" + i).prop("disabled", true);
                    }

                    //if (i == 1)
                    //    $("#tblTariffSlab_Delete_" + i).hide();
                }
            }

            $('#tblTariffSlab_Delete_' + index).css('display', 'block');

            $('#tblTariffSlab_btnAppendRow').css('display', 'block');

        },

        beforeRowRemove: function (caller, rowIndex) {
            if (pageType == "EDIT") {
                return confirm('Are you sure to remove this row?');
            }
            //$("tr[id^='tblTariffSlab_Row']").each(function () {
            //    if ($(this).find("[id^='tblTariffSlab_StartValue']").val() == "" || $(this).find("[id^='tblTariffSlab_StartValue']").val() == undefined) {
            //        $(this).find("[id*='tblTariffSlab_StartValue']").prop("required", true);
            //    }
            //    else
            //        $(this).find("[id*='tblTariffSlab_StartValue']").removeAttr("required");
            //});

        },
        afterRowRemoved: function (tbWhole, rowIndex) {
            /*** added by jk 16 may 2018 ***/
            //if ($("[id^='tblTariffSlab_SlabType_']").length = 1) {

            //    if ($("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 0 || $("[id^='tblTariffSlab_SlabType_'] option:selected").val() == 2) {
            //        if ($("[id^='tblRevenueSharingSlab_RevenueAmount_']").length > 0) {
            //            $("[id^='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", false);
            //        }
            //    }

            //}
            /****end by jk Revenue **/

            $("#" + $(tbWhole)[0].id).find("tr:eq(" + (rowIndex + 1) + ")").find(':input').prop("disabled", false);
            if (rowIndex != 1)
                $("#" + $(tbWhole)[0].id).find("tr:eq(" + (rowIndex + 1) + ")").find('button').show();
            if (pageType == "EDIT") {
                var rowCount = rowIndex.length == undefined ? rowIndex : rowIndex.length;
                for (var i = 1; i <= rowCount; i++) {
                    if (i < rowCount)
                        $("#tblTariffSlab_Delete_" + i).hide();
                    if (rowCount > 1)
                        $("#tblTariffSlab_SlabType_" + i).prop("disabled", true);
                    strData.push(i);
                    if (rowCount == 1)
                        $("#tblTariffSlab_Delete_" + i).hide();
                }
            }
            $("tr[id^='tblTariffSlab_Row']").each(function () {
                if ($("tr[id^='tblTariffSlab_Row']").length != 1)
                    $(this).find("select").attr("disabled", true);
            });
            //if ($("[id^='tblTariffSlab_SlabType_'] option:selected").val() != 1) {
            var index = rowIndex + 1;
            $('#tblTariffSlab_Row_' + index).remove();
            $('#tblTariffSlab_btnAppendRow').css('display', 'block');
            //}
        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });

    if (pageType != "NEW") {
        $("tr[id^='tblTariffSlab_Row']").each(function () {
            var ChkValue = $("#" + $(this).attr("id") + " option:checked").val();
            if (ChkValue == 0) {
                if ($("#" + $(this).attr("id") + " td:eq(2)").text().indexOf("KG") < 0) {
                    $("#" + $(this).attr("id") + " td:eq(2)").append("<span id='spnUnit'>KG</span>");
                    $("#" + $(this).attr("id") + " td:eq(3)").append("<span id='spnUnit'>KG</span>");
                    //$("#" + $(this).attr("id") + " td:eq(2)").find("input").attr("maxlength", "8");
                    //$("#" + $(this).attr("id") + " td:eq(3)").find("input").attr("maxlength", "9");
                }
            }
            else if (ChkValue == 1) {
                if ($("#" + $(this).attr("id") + " td:eq(2)").text().indexOf("HOUR") < 0) {
                    $("#" + $(this).attr("id") + " td:eq(2)").append("<span id='spnUnit'>HOUR</span>");
                    $("#" + $(this).attr("id") + " td:eq(3)").append("<span id='spnUnit'>HOUR</span>");
                    //$("#" + $(this).attr("id") + " td:eq(2)").find("input").attr("maxlength", "7");
                    //$("#" + $(this).attr("id") + " td:eq(3)").find("input").attr("maxlength", "7");
                }
            }
            else {
                $("#" + $(this).attr("id") + " td:eq(2)").append("<span id='spnUnit'></span>");
                $("#" + $(this).attr("id") + " td:eq(3)").append("<span id='spnUnit'></span>");
                //$("#" + $(this).attr("id") + " td:eq(2)").find("input").attr("maxlength", "7");
                //$("#" + $(this).attr("id") + " td:eq(3)").find("input").attr("maxlength", "9");
            }
        });
    }
}

var strData = [];
var pageType = $('#hdnPageType').val();
function CreateRevenueSharingSlabGrid() {
    var dbtableName = "RevenueSharingSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnTariffSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Tariff/ManageTariffService.svc",
        getRecordServiceMethod: "GetRevenueSharingSlabRecord",
        deleteServiceMethod: "DeleteRevenueSharingSlab",
        caption: "Revenue Sharing Slab Information",
        initRows: 1,
        columns: [
                { name: "SNo", type: "hidden" },
                // { name: "Customer", display: "Customer", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 1: "Poslog", 2: "Gapura", 3: "Angkasa Pura" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                { name: 'RevenueSharingCustomer', display: 'Revenue Sharing Customer', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '110px', height: '20px' }, isRequired: true, AutoCompleteName: 'Tariff_RevenueSharingCustomer', filterField: 'RevenueSharingCustomer', filterCriteria: "contains" },
                { name: "RevenueSharing", display: "Revenue Sharing (In % )", ctrlAttr: { onchange: "", onclick: "" }, type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 5, onblur: "return funTotalRevenuepercentAmount(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal2" : "" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                  { name: "RevenueAmount", display: "Revenue AMount", ctrlAttr: { onchange: "", onclick: "" }, type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 5, onblur: "return functionCheckSharePercent(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal2" : "" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
               //{ name: "RevenueSharing", display: "Revenue Sharing (In % )", ctrlAttr: { onchange: "return ValidateTotalSharingPerc(this.id);", onclick: "" }, type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 2, onblur: "return CheckValidation(this.id);", controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "number" : "" }, ctrlCss: { width: "50px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },

        ]
        ,
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            //$(tr).find("input[id^='tblRevenueSharingSlab_SNo_']").val()
            //var length = $("tr[id^='tblRevenueSharingSlab_Row']").find("input[id^='tblRevenueSharingSlab_SNo_']").length.id.split("_")[2];

            //for (var i = 1; i <= length; i++) {
            //if (pageType == "READ") {
            //    $("tr[id^='tblRevenueSharingSlab_Row']").each(function (row, tr) {
            //        $("#tblRevenueSharingSlab_Delete_" + i).hide();
            //        $("#tblRevenueSharingSlab_Customer_" + i).prop("disabled", true);
            //    });
            //}
            //else {
            //    $("tr[id^='tblRevenueSharingSlab_Row']").each(function (row, tr) {
            //        $("#tblRevenueSharingSlab_Customer_" + i).prop("disabled", false);
            //    });
            //}

            //}
            /** added by jk 16 may 2018 **/
            //if ($("[id^='tblTariffSlab_SlabType_']").length > 1) {
            //    alert("you ");
            //    $("[id^='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", true);
            //    $("[id^='tblRevenueSharingSlab_RevenueAmount_']").text('');

            //}
            /** added by jk 16 may 2018 **/
            if ($("input:radio[name='RevenueAmount']:checked").val() == "Rpercent") {
                $("[id*='tblRevenueSharingSlab_RevenueAmount_']").prop("disabled", 'disabled');
                $("[id*='tblRevenueSharingSlab_RevenueAmount_']").text('');

            }
            if ($("input:radio[name='RevenueAmount']:checked").val() == "RAmount") {
                $("[id*='tblRevenueSharingSlab_RevenueSharing_']").prop("disabled", 'disabled');
                $("[id*='tblRevenueSharingSlab_RevenueSharing_']").text('');
                $("[id*='_temptblRevenueSharingSlab_RevenueSharing_']").val('');



            }
            /** end added by jk 16 may 2018 **/

        },
        beforeRowRemove: function (caller, rowIndex) {
            if (pageType == "EDIT") {
                return confirm('Are you sure to remove this row?');
            }

        },
        afterRowRemoved: function (tbWhole, rowIndex) {



        },
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });


}

function functionCheckSharePercent(obj) {

    if (!$("#" + obj).val()) {
        $("#" + obj).attr("required", "required");
        $("#_temp" + obj).attr("required", "required");
    }
    else {
        $("#" + obj).removeAttr("required");
        $("#_temp" + obj).removeAttr("required");

    }
    if ($("input:radio[name='RevenueAmount']:checked").val() == "RAmount") {
        $("[id*='tblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").val();
        $("[id*='tblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").text();
        $("[id*='tblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").attr('disabled', 'disabled')
        $("[id*='tblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").css('display', 'block')
        $("[id*='_temptblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").css('display', 'none')
        $("[id*='tblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").removeAttr("required");
        $("[id*='_temptblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").removeAttr("required");


    }
}

function funTotalRevenuepercentAmount(obj) {


    if (!$("#" + obj).val()) {
        $("#" + obj).attr("required", "required");
        $("#_temp" + obj).attr("required", "required");
    }
    else {
        $("#" + obj).removeAttr("required");
        $("#_temp" + obj).removeAttr("required");

    }
    //if (parseFloat(startValue) > parseFloat(endValue)) {
    //    alert("Start Range can not be greater than End Range.");
    //    $("#" + obj).val("");
    //    $("#" + obj).attr("required", "required");
    //}

    if ($("input:radio[name='RevenueAmount']:checked").val() == "Rpercent") {
        $("[id*='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").val();
        $("[id*='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").text();
        $("[id*='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").attr('disabled', 'disabled')
        $("[id*='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").css('display', 'block')
        $("[id*='_temptblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").css('display', 'none')
        $("[id*='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").removeAttr("required");
        $("[id*='_temptblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").removeAttr("required");


    }
    //if ($("[id^='tblTariffSlab_SlabValue_']").length == 1) {
    //    alert("4");

    //    var totalShareAmount = $("[id^='tblTariffSlab_SlabValue_']").val();
    //    var sharepercentRevenue = $("[id^='tblRevenueSharingSlab_RevenueSharing_" + obj.split('_')[2] + "']").val();
    //    var RevenueSlabamount = (totalShareAmount * sharepercentRevenue) / 100
    //    $("[id^='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").val();
    //    $("[id^='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").text();
    //    $("[id^='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").css('display', 'block')
    //    $("[id^='_temptblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").css('display', 'none')
    //    $("[id^='tblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").removeAttr("");
    //    $("[id^='_temptblRevenueSharingSlab_RevenueAmount_" + obj.split('_')[2] + "']").removeAttr("");


    //}
}

/*** added by jk 17 may 2018 ***/
function ValidateTotalSharingAmount() {
    var TotalRevenueSharingAmount = 0.0;
    var RevenueSharingAmount = 0.0
    var TotalRevenueSharingAmount = 0.0
    var TotaltariffAmountslab = 0.0
    var tariffslabvalue = 0.0
    if ($("tr[id^='tblRevenueSharingSlab_Row_']").length > 0) {
        $("tr[id^='tblRevenueSharingSlab_Row_']").each(function (row, tr) {

            RevenueSharingAmount = $(tr).find("input[id^='tblRevenueSharingSlab_RevenueAmount_']").val();


            TotalRevenueSharingAmount = TotalRevenueSharingAmount + parseFloat(RevenueSharingAmount);

        });
    }
    if ($("tr[id^='tblTariffSlab_Row_']").length > 0) {
        $("tr[id^='tblTariffSlab_Row_']").each(function (row, tr) {

            tariffslabvalue = $(tr).find("input[id^='tblTariffSlab_SlabValue_']").val();


            TotaltariffAmountslab = TotaltariffAmountslab + parseFloat(tariffslabvalue);

        });
    }
    if (parseFloat(TotalRevenueSharingAmount) != parseFloat(TotaltariffAmountslab)) {
        ShowMessage('warning', 'Warning - Tariff', "Total Sum of Customer Revenue Amount Must be Equal to Tariff Slab Value.", "bottom-right");
        return false;
    }
    else {
        return true;
    }
    //    if (TotalRevenueSharing != 100) {
    //        if (TotalRevenueSharing > 100) {
    //            ShowMessage('warning', 'Warning - Tariff', "Total Sum of Customer Revenue Sharing Can not be greater than 100%", "bottom-right");
    //            return false;
    //        } else {


    //            if (TotalRevenueSharing < 100)
    //                ShowMessage('warning', 'Warning - Tariff', "Total Sum of Customer Revenue Sharing Can not be Less than 100%", "bottom-right");
    //            return false;
    //        }
    //    } else {
    //        return true;
    //    }
    //}
    //else {
    //    return true;


}

function ValidateTotalSharingPerc() {
    var TotalRevenueSharing = 0.0;

    if ($("tr[id^='tblRevenueSharingSlab_Row_']").length > 0) {
        $("tr[id^='tblRevenueSharingSlab_Row_']").each(function (row, tr) {

            RevenueSharingCustomer = $(tr).find("input[id^='tblRevenueSharingSlab_HdnRevenueSharingCustomer_']").val();
            RevenueSharing = $(tr).find("input[id^='tblRevenueSharingSlab_RevenueSharing_']").val();

            if (RevenueSharingCustomer != 3) {
                TotalRevenueSharing = TotalRevenueSharing + parseFloat(RevenueSharing);
            }
        });
        if (TotalRevenueSharing != 100) {
            if (TotalRevenueSharing > 100) {
                ShowMessage('warning', 'Warning - Tariff', "Total Sum of Customer Revenue Sharing Can not be greater than 100%", "bottom-right");
                return false;
            } else {


                if (TotalRevenueSharing < 100)
                    ShowMessage('warning', 'Warning - Tariff', "Total Sum of Customer Revenue Sharing Can not be Less than 100%", "bottom-right");
                return false;
            }
        } else {
            return true;
        }
    }
    else {
        return true;
    }

}

function ChangeUnitType(obj) {
    var ChkValue = $("#" + obj).val();
    var startValue = obj.replace("SlabType", "StartValue");
    var endValue = obj.replace("SlabType", "EndValue");
    if (ChkValue == 0) {
        $("span[id=spnUnit]").html("")
        $("span[id=spnUnit]").html("KG")
        //$("#" + startValue).removeAttr("controltype").attr("decimal2");
        //$("#" + endValue).removeAttr("controltype").attr("decimal2");
        //$("#" + obj).parent().parent().find(" td:eq(2)").find("input").attr("maxlength", "8");
        //$("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr("maxlength", "9");
        $("#" + obj).parent().parent().find(" td:eq(2)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").val("");


    }
    else if (ChkValue == 1) {
        $("span[id=spnUnit]").html("")
        $("span[id=spnUnit]").html("HOUR")
        //$("#" + startValue).removeAttr("controltype").attr("number");
        //$("#" + endValue).removeAttr("controltype").attr("number");
        //$("#" + obj).parent().parent().find(" td:eq(2)").find("input").attr("maxlength", "7");
        //$("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr("maxlength", "7");
        $("#" + obj).parent().parent().find(" td:eq(2)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").val("");
        //  $("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr("controltype", "number");
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").val("");
    }
    else if (ChkValue == 3) {
        $("span[id=spnUnit]").html("")
        $("span[id=spnUnit]").html("DAY")
        //$("#" + startValue).removeAttr("controltype").attr("number");
        //$("#" + endValue).removeAttr("controltype").attr("number");
        //$("#" + obj).parent().parent().find(" td:eq(2)").find("input").attr("maxlength", "7");
        //$("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr("maxlength", "7");
        $("#" + obj).parent().parent().find(" td:eq(2)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").val("");
        //  $("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr("controltype", "number");
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").val("");
    }
    else {
        $("span[id=spnUnit]").html("")
        //$("#" + startValue).removeAttr("controltype").attr("number");
        //$("#" + startValue).removeAttr("controltype").attr("number");
        //$("#" + obj).parent().parent().find(" td:eq(2)").find("input").attr("maxlength", "7");
        //$("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr("maxlength", "9");
        $("#" + obj).parent().parent().find(" td:eq(2)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").val("");
        // $("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr("controltype", "number");
    }
}

function CheckValueValidation(obj) {
    var value = $("#" + obj).val();
    if (value.indexOf('.') == -1) {
        if (value.length > 7) {
            alert("Numeric value should be 7");
            $("#" + obj).val('');
            return false;
        }
    }
    //else
    //{
    //    if (value.length >= 11) {
    //        alert("decimal value length is 11 including 3 decimal points");
    //        $("#" + obj).val('');
    //        return false;
    //    }
    //}
}

function CheckValidation(obj) {
    var startValue = 0;
    var endValue = 0;

    if (!$("#" + obj).val()) {
        $("#" + obj).attr("required", "required");
        $("#_temp" + obj).attr("required", "required");
    }
    else {
        $("#" + obj).removeAttr("required");
        $("#_temp" + obj).removeAttr("required");
        $("#" + obj).removeAttr("required");
    }

    if (obj.indexOf("Start") >= 0) {
        startValue = $("#" + obj).val();
        endValue = $("#" + obj.replace("Start", "End")).val();
        previousEndValue = $("#" + obj.replace("Start", "End").replace(obj.split("_")[2], obj.split("_")[2] - 1)).val();
    }
    else {
        endValue = $("#" + obj).val();
        startValue = $("#" + obj.replace("End", "Start")).val();
    }

    if (parseFloat(startValue) > parseFloat(endValue)) {
        alert("Start Range can not be greater than End Range.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }
}

function valid(obj) {
    var startValue = 0;
    var endValue = 0;
}

//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};

function GetMonthName(monthNumber) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1];
}

function GetMonthNumber(monthName) {
    var months =
        {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
    return months.monthName;
}

function OnSuccessGrid() {


    $("table[class='k-focusable k-selectable'] tbody tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var tmpDate = new Date();
            var date = tmpDate.getDate();
            var month = tmpDate.getMonth();
            var year = tmpDate.getFullYear();
            var currentDate = new Date(year, month, date);

            var validFrom = new Date($(this).find("td:eq(7)").text());
            if (validFrom > currentDate) {

                $(".tool-items").find(".actionSpan").each(function () {

                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "block");
                    }

                });
            }
            else {
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "none");
                    }
                });
            }

        });
    });

}