//Javascript file for Manage Tariff Page for binding Autocomplete
/// <reference path="../../Scripts/common.js" />
var containerId = "tbl";
var SPHC = "";
var Text_SPHC = "";
var Text_SPHCDuplicate = "";

$(document).ready(function () {





    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    cfi.AutoComplete("WHLocationTypeSNo", "LocationType", "WHLocationType", "SNo", "LocationType", ["LocationType"], null, "contains", ",");
    cfi.AutoComplete("TariffName", "ChargeName", "InvHandlingChargeMaster", "SNo", "ChargeName", ["ChargeName"], SetBasis, "contains");
    cfi.AutoComplete("TariffCode", "ChargeName", "InvHandlingChargeMaster", "SNo", "ChargeName", ["ChargeName"], SetRateType, "contains");
    cfi.AutoComplete("Tax", "TaxCode", "TaxMaster", "SNo", "TaxCode", ["TaxCode"], null, "contains", ",");
    cfi.AutoComplete("Currency", "CurrencyCode,CurrencyName", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("SPHC", "Code", "vwManageTariffSPHC", "SNo", "Code", ["Code"], OnSelectSHCSNo, "contains", ",");
    cfi.AutoComplete("Agent", "Name", "vUldStackAccount", "SNo", "Name", ["Name"], null, "contains", ",");
    cfi.AutoComplete("Airline", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains", ",");
    cfi.AutoComplete("Inventory", "item", "VtariffConsumables", "SNo", "item", ["item"], null, "contains", ",");
    cfi.AutoComplete("Process", "ProcessName", "Process", "SNo", "ProcessName", ["ProcessName"], null, "contains");
    cfi.AutoComplete("SubProcess", "SubProcessName", "SubProcess", "SNo", "SubProcessName", ["SubProcessName"], null, "contains");
    cfi.AutoComplete("SHCGroup", "Name", "vSphcGroup", "SNo", "Name@", ["Name"], OnSelectSPHCGroupSNo, "contains", ",");
    //cfi.AutoComplete("LocationMulti", "TerminalName", "vTerminal", "SNo", "TerminalName", ["TerminalName"], null, "contains", ",");   
    cfi.AutoComplete("Location", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("LocationMulti", "TerminalName", "vTerminal", "SNo", "TerminalName", ["TerminalName"], null, "contains", ",");
    cfi.AutoComplete("TruckDestination", "CityCode,CityName", "vwuldtypetarrif", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    ///// Sushant
    cfi.AutoComplete("ULDType", "ULDName", "vwuldtypetarrif", "ULDName", "ULDName", ["ULDName"], null, "contains", ",");
    //var data = GetDataSource("Location", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null);
    //cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CountryCode,CountryName", "contains");

    // $("#spnFlatRate").closest('td').css("visibility", "hidden").next('td').css("visibility", "hidden");
    //$("#Text_Location").closest("td").append("<table><tr><td><input type='hidden' name='Location1' id='Location1' /><input type='text' class='k-input' name='Text_Location1' id='Text_Location1'  tabindex='2' controltype='autocomplete' /></td></tr></table>");
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

        //$("#spnInventory").closest("td").find("font").html('*');
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
        // alert($(this).val());
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
        // alert($(this).val());
        CheckImportCollect();
    })

    $('input:radio[name=FreightType]').change(function () {
        //alert($(this).val());
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
        //var newValidFrom = dfrom.setDate(dfrom.getDate() + 1);
        //dfrom =$("#ValidFrom").val(dfrom.getDate() + "-" + GetMonthName(dfrom.getMonth()) + "-" + dfrom.getFullYear());
        if (dfrom > dto)
            $(this).val("");

    })
    //var today = new Date();
    //$("#ValidFrom").kendoDatePicker({
    //    min: new Date(today.setDate(today.getDate() + 1))
    //});
    // $('#ValidFrom').css('width', '160px');

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
        // cfi.AutoComplete("Location", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
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
            // debugger;
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
        cfi.AutoComplete("Location", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
        $(".btn-danger").hide();
        if ($("span[id='Ratetype']").text().toUpperCase() == 'INVENTORY') {
            $("td[title='Inventory']").html('Inventory');
        }
        else {
            $("td[title='Inventory']").html('');
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
            // debugger;
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

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ") {


        /*For tax*/
        // $("span[id='Value']").hide();
        //$("<span>Value In %  </span>").insertBefore("span[id='Value']");

        /*Added By Brajendra*/
        $("input[type='checkbox'][id$='MON']").closest("td").find("input[type='checkbox']").each(function (index, value) {
            var str;
            str = value.name.replace("Is", "").toLowerCase().replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
            });
            $(this).before(str);;
        });
        //$("input[type='checkbox'][id='MON']").closest("td").find("input[type='checkbox']").each(function (index, value) {
        //    var str;
        //    str = value.name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        //        return letter.toUpperCase();
        //    });
        //    $(this).before(str);;
        //});

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
                //$("<span id='spnValue'>Value In %</span>").insertBefore("[id='Value']");
                // $("input[id='Value1']").attr("placeholder", "Value In %");
                $("input[id='Value1']").show();
                $("span[id='percentage']").show();
                $("input[id='Value1']").val($("#Value").val());
            }
            else {

                //$("span[id='spnValue']").remove();
                // $("input[id='Value1']").removeAttr("placeholder", "Value In %");
                $("input[id='Value1']").hide();
                $("span[id='percentage']").hide();
            }


        });

        if ($("input[name$='Surcharge']:checked").val() == 1) {
            //$("<span id='spnValue'>Value In %</span>").insertBefore("[id='Value']");
            // $("input[id='Value1']").attr("placeholder", "Value In %");
            $("input[id='Value1']").show();
            $("span[id='percentage']").show();
            $("input[id='Value1']").val($("#Value").val());
        }
        else {

            //$("span[id='spnValue']").remove();
            // $("input[id='Value1']").removeAttr("placeholder", "Value In %");
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
        //var WHLocationTypeSNoDataField = ($('#WHLocationTypeSNo').val());
        //var WHLocationTypeSNoDataText = ($('#Text_WHLocationTypeSNo').val());
        //$('#Text_WHLocationTypeSNo')[0].defaultValue = '';
        //$('#Text_WHLocationTypeSNo')[0].Value = '';
        //$('#Text_WHLocationTypeSNo').val('');
        //$('#Multi_WHLocationTypeSNo').val(WHLocationTypeSNoDataField);
        //$('#FieldKeyValuesWHLocationTypeSNo')[0].innerHTML = WHLocationTypeSNoDataField;
        //var j = 0;
        //if (WHLocationTypeSNoDataField.split(',').length > 0) {
        //    while (j < WHLocationTypeSNoDataField.split(',').length) {
        //        if (WHLocationTypeSNoDataField.split(',')[j] != '')
        //            $('#divMultiWHLocationTypeSNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + WHLocationTypeSNoDataText.split(',')[j] + "</span><span class='k-icon k-delete' id='" + WHLocationTypeSNoDataText.split(',')[j] + "'></span></li>");
        //        j++;
        //    }
        //    $("#divMultiWHLocationTypeSNo").css("display", "block");
        //}

        ////-------------------------------------------

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
        //var AirlineDataField = ($('#Airline').val());
        //var AirlineDataText = ($('#Text_Airline').val());
        //$('#Text_Airline')[0].defaultValue = '';
        //$('#Text_Airline')[0].Value = '';
        //$('#Text_Airline').val('');
        //$('#Multi_Airline').val(AirlineDataField);
        //$('#FieldKeyValuesAirline')[0].innerHTML = AirlineDataField;
        //var l = 0;
        //if (AirlineDataField.split(',').length > 0) {
        //    while (l < AirlineDataField.split(',').length) {
        //        if (AirlineDataField.split(',')[l] != '')
        //            $('#divMultiAirline').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + AirlineDataText.split(',')[l] + "</span><span class='k-icon k-delete' id='" + AirlineDataField.split(',')[l] + "'></span></li>");
        //        l++;
        //    }
        //    $("#divMultiAirline").css("display", "block");
        //}
        $("input[type='checkbox'][id^='Days']").each(function () {
            // debugger;
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
    //function AutoCompleteDeleteCallBack(e, div, textboxid) {
    //    //debugger;
    //    var target = e.target; // get current Span.
    //    var DivId = div; // get div id.
    //    var textboxid = textboxid; // get textbox id.
    //    var mid = textboxid.replace('Text', 'Multi');
    //    var arr = $("#" + mid).val().split(',');
    //    var idx = arr.indexOf($(this)[0].id);
    //    arr.splice(idx, $(e.target).attr("id"));
    //    $("#" + mid).val(arr);
    //    $("#" + textboxid.replace('Text_', '')).val(arr);
    //    $(target).closest("li").remove();
    //}
    $('.k-delete').click(function () {
        debugger;
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


    $('input[name="operation"]').unbind("click").click(function (e) {


        //if ($("input[name='ShipmentType']:checked").val() == "3")
        //    if ($("#SPHC").val() == "" && $("#SHCGroup").val() == "") {
        //        $("#Text_SPHC").attr("data-valid", "required");
        //        $('#Text_SPHC').attr("data-valid-msg", "SHC can not be blank");
        //        $("<font color=red>*</font>").insertBefore("[id='spnSPHC']");
        //        $("#Text_SHCGroup").attr("data-valid", "required");
        //        $('#Text_SHCGroup').attr("data-valid-msg", "SHC Group can not be blank");
        //        $("<font color=red>*</font>").insertBefore("[id='spnSPHCGroup']");
        //    }       

        //ShowMessage('warning', 'Warning - Tariff', "SHC not selected for Special Cargo, this charge will be applied if charge not defined for specific SHC.", "bottom-right");

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
            //
            $(".Days").removeAttr("data-valid");
        }

        if (!cfi.IsValidSubmitSection()) return false;







        //$('.Days:checkbox:checked').each(function () {

        //    if ($(this).is(":checked") == true) {
        //        if ($(this).val() != 0) {                 
        //            selectedDays += (',' + ($(this).val()));
        //            alert(selectedDays)
        //        }
        //    }           
        //});




        $("input[name='IsFreeSurcharge']:checked").val();
        $("input[id='Value']").val()

        var arrManageTariff = new Array();
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT")

            //if (!cfi.IsValidForm()) {

            //    return false;
            //}
            //if ($("input[name='ApplicableFor']:checked").val() != 1 || $("input[name='BasedOn']:checked").val() != 4 || $("input[name='FreightType']:checked").val() != 1) {
            //    getUpdatedRowIndex(strData.join(','), "tblTariffSlab");
            //    strData = $('#tblTariffSlab').appendGrid('getStringJson');
            //}
            //if (strData == "[]" || strData == false) {
            //    alert("Tariff slab can not be blank");
            //    return false;
            //}
            var checkSlab = false;
        if ($("input[name='ApplicableFor']:checked").val() != 1 || $("input[name='BasedOn']:checked").val() != 3 || $("input[name='FreightType']:checked").val() != 1)
            checkSlab = true;
        else
            checkSlab = false;
        if (checkSlab == true) {
            //strData == "[]" ? [] : getUpdatedRowIndex(strData.join(','), "tblTariffSlab");
            var res = $("#tblTariffSlab tr[id^='tblTariffSlab']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
            //getUpdatedRowIndex(strData.join(','), "tblTariffSlab")
            getUpdatedRowIndex(res, 'tblTariffSlab');
            strData = JSON.parse(($('#tblTariffSlab').appendGrid('getStringJson')));
            strData = JSON.stringify(strData);
            //if (strData == "[]" || strData == false) {\
            if (strData == "[]" || strData == false || strData == undefined) {
                alert("Tariff slab can not be blank");
                return false;
            }
            else {
                debugger;
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
                    //ValidFrom: "\/Date(" + Date.parse($("#ValidFrom").val()) + ")\/",
                    //ValidTo: "\/Date("+Date.parse($("#ValidTo").val())+")\/",

                    ValidFrom: "\/Date(" + Date.parse($("#ValidFrom").attr("sqldatevalue")) + ")\/",
                    ValidTo: "\/Date(" + Date.parse($("#ValidTo").attr("sqldatevalue") == "" ? "1900-01-01" : $("#ValidTo").attr("sqldatevalue")) + ")\/",
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
                    strData: (strData == "[]" || strData == false) ? "" : strData,
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

                    IsDomestic: ($("input:radio[name='Domestic']:checked").val() == 0 ? 0 : 1),
                    IsRushHandling: ($("input:radio[name='RushHandling']:checked").val() == 0 ? 1 : 0),
                    WHLocationTypeSNo: $("#WHLocationTypeSNo").val(),
                    TotalCost: ($("#DemurrageCast").val() == "" ? "0.00" : $("#DemurrageCast").val()),
                    ULDType: ($("#ULDType").val())
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

                                if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                                    AuditLogSaveNewValue("divbody");
                                }

                                navigateUrl('Default.cshtml?Module=Tariff&Apps=ManageTariff&FormAction=INDEXVIEW');

                            }
                        }
                        else
                            ShowMessage('warning', 'Warning - Tariff', response[0].replace("<value>", "").replace("</value> Occured", ""), "bottom-right");

                    },
                    error: function (er) {
                        debugger
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
                //ValidFrom: "\/Date(" + Date.parse($("#ValidFrom").val()) + ")\/",
                //ValidTo: "\/Date(" + Date.parse($("#ValidTo").val()) + ")\/",
                ValidFrom: "\/Date(" + Date.parse($("#ValidFrom").attr("sqldatevalue")) + ")\/",
                ValidTo: "\/Date(" + Date.parse($("#ValidTo").attr("sqldatevalue") == "" ? "1900-01-01" : $("#ValidTo").attr("sqldatevalue")) + ")\/",
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
                strData: (strData == "[]" || strData == false) ? "" : strData,
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
                IsDomestic: ($("input:radio[name='Domestic']:checked").val() == 0 ? 0 : 1),
                IsRushHandling: ($("input:radio[name='RushHandling']:checked").val() == 0 ? 1 : 0),
                TotalCost: ($("#DemurrageCast").val() == "" ? "0.00" : $("#DemurrageCast").val()),
                ULDType: ($("#ULDType").val())
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
                    debugger
                }
            });


        }
    })

    // $('input[name="Text_TariffCode"]').on('change mouseup blur input', function () {
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
                debugger
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

        //cfi.AutoComplete("Location", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
        //cfi.AutoComplete("LocationMulti", "TerminalName", "vTerminal", "SNo", "TerminalName", ["TerminalName"], null, "contains", ",");
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
            var data = GetDataSource("Location", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "AirportCode,AirportName", "contains");
            //  cfi.AutoComplete("Location", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
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
            //var data = GetDataSource("Location", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null);
            var LocationSNo = $('#Location').val();
            var LocationValue = $('#Text_Location').val();
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CountryCode,CountryName", "contains");
            cfi.AutoComplete("Location", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
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
            var data = GetDataSource("Location", "City", "SNo", "CityCode", ["CityCode", "CityName"], null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CityCode,CityName", "contains");
            $('#Location').val(LocationSNo);
            $('#Text_Location').val(LocationValue);
            // cfi.AutoComplete("Location", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
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
            var data = GetDataSource("Location", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "AirportCode,AirportName", "contains");
            //  cfi.AutoComplete("Location", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
            $('#Location').val(LocationSNo);
            $('#Text_Location').val(LocationValue);
            $("#Text_Location").closest("span").css("text-transform", "");
        }
        else if ($("input[name='TariffFor']:checked").val() == 3) {
            // cfi.AutoComplete("Location1", "TerminalName", "vTerminal", "SNo", "TerminalName", ["TerminalName"], null, "contains");             
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

            var data = GetDataSource("Location", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null);
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

            var data = GetDataSource("Location", "City", "SNo", "CityCode", ["CityCode", "CityName"], null);
            cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CityCode,CityName", "contains");
            $("#Text_Location").closest("span").css("text-transform", "");

            //var data = GetDataSource("Location", "City", "SNo", "CityCode", ["CityCode", "CityName"], null);
            //cfi.ChangeAutoCompleteDataSource("Location", data, true, null, "CityCode,CityName", "contains");

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
            var data = GetDataSource("Location", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null);
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
            cfi.AutoComplete("LocationMulti", "TerminalName", "vTerminal", "SNo", "TerminalName", ["TerminalName"], null, "contains", ",");
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
    var Sval = HallDays.split(',');
    if (Sval[0] != "" && Sval[1] != "" && Sval[2] != "" && Sval[3] != "" && Sval[4] != "" && Sval[5] != "" && Sval[6] != "") {
        $('.Days').attr('checked', true);
    }
    $('.Days:checkbox').each(function () {
        for (var i = 0; i < Sval.length; i++) {
            var GetVal = Sval[i]

            if (GetVal == $(this).val()) {
                $(this).attr('checked', true);
            }

        }
    });

});


//function InstantiateControl(containerId) {

//    $("#" + containerId).find("input[type='text']").each(function () {
//        var controlId = $(this).attr("id");
//        var decimalPosition = cfi.IsValidNumeric(controlId);
//        if (decimalPosition >= -1) {
//            //            $(this).css("text-align", "right");
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
//    $("#" + containerId).find("textarea").each(function () {
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
//    $("#" + containerId).find("span").each(function () {
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
//    SetDateRangeValue();

//    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
//        if ($(this).attr("recname") == undefined) {
//            var controlId = $(this).attr("id");
//            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
//        }
//    });
//    cfi.ValidateSubmitSection();
//    $("div[id^='__appTab_").each(function () {
//        $(this).kendoTabStrip().data("kendoTabStrip");
//    });
//    $("input[name='operation']").click(function () {
//        _callBack();
//    });
//    $("[id$='divRemoveRecord']").hide();
//    $("input[name='operation']").click(function () {
//        if (cfi.IsValidSubmitSection()) {
//            StartProgress();
//            if ($(this).hasClass("removeop")) {
//                $("#" + formid).trigger("submit");
//            }
//            StopProgress();
//            return true;
//        }
//        else {
//            return false
//        }
//    });
//    _callBack = function () {
//        if ($.isFunction(window.MakeTransDetailsData)) {
//            return MakeTransDetailsData();
//        }
//    }

//    _ExtraCondition = function (textId) {
//        if ($.isFunction(window.ExtraCondition)) {
//            return ExtraCondition(textId);
//        }
//    }
//    $(".removepopup").click(function () {
//        $("#divRemovePanel").show();
//        cfi.PopUp("divRemoveRecord", "");
//    });
//    $(".cancelpopup").click(function () {
//        $("#divRemovePanel").hide();
//        cfi.ClosePopUp("divRemoveRecord");
//    });
//    $("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
//        var transid = this.id.replace("divareaTrans_", "");
//        cfi.makeTrans(transid, null, null, null, null, null, null);
//    });
//    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
//    //    ChangeAllControlToLable("aspnetForm");

//}


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
                debugger
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
                 { name: "IsFlatRate", display: "Flat Rate", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "checkbox" : "checkbox", ctrlCss: { width: "50px" }, isRequired: false },
                 { name: "MinimumSlab", display: "Minimum", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlCss: { width: "70px" }, isRequired: false, ctrlAttr: { controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "decimal3" : "", maxlength: 10, title: "Enter Amount", value: "0.000" } }
        ]
        ,
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            //addedRowIndex = $('tr', $("#tblTariffSlab").find('tbody')).length;

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

                    if (i == 1)
                        $("#tblTariffSlab_Delete_" + i).hide();
                }
            }
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