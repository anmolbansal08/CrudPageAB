/// <reference path="../../Services/ULD/UldStackService.svc" />
/// <reference path="../../Services/ULD/UldStackService.svc" />
/// <reference path="../../Services/ULD/UldStackService.svc" />
$(document).ready(function () {
    cfi.ValidateForm();
    if (getQueryStringValue("FormAction").toUpperCase() == "READ")
        $(".btn-danger").hide();
    //  cfi.AutoComplete("StackUld", "ULDNo", "vwUldStack", "ULDNo", "ULDNo", ["ULDNo"], null, "contains", ",", null, null, null, BuildStack, true);
    cfi.AutoComplete("StackUld", "ULDNo", "vwULDStockAuto", "ULDNo", "ULDNo", ["ULDNo"], BuildStack, "contains", ",", null, null, null, BuildStackRestriction, true);
    cfi.AutoComplete("ChoosenAirline", "CarrierCode,AirlineName", "Airline", "AirlineCode", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    //cfi.AutoComplete("FlightNo", "ULDNo", "uldStock", "SNo", "ULDNo", ["ULDNo"], BuildStack, "contains", ",");
    //cfi.AutoComplete("Airline", "ULDNo", "uldStock", "SNo", "ULDNo", ["Text_ChoosenAirlineULDNo"], BuildStack, "contains", ",");
    // cfi.AutoComplete("TariffName", "ChargeName", "InvHandlingChargeMaster", "SNo", "ChargeName", ["ChargeName"], SetBasis, "contains");
    //cfi.AutoComplete("TariffCode", "ChargeName", "InvHandlingChargeMaster", "SNo", "ChargeName", ["ChargeName"], null, "contains");
    //cfi.AutoComplete("Tax", "TaxCode", "TaxMaster", "SNo", "TaxCode", ["TaxCode"], null, "contains", ",");
    //cfi.AutoComplete("Currency", "CurrencyCode,CurrencyName", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    //cfi.AutoComplete("SPHC", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains", ",");
    //cfi.AutoComplete("Agent", "Name", "Account", "SNo", "Name", ["Name"], null, "contains", ",");
    //cfi.AutoComplete("Airline", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains", ",");  
    //cfi.BindMultiValue("StackUld", $("#Multi_StackUld").val(), $("#StackUld").val());

    //<span class="k-picker-wrap k-state-default k-widget k-datepicker k-header" style="width: 130px;">

    //    <input type="text" class="k-input k-state-default" name="TruckDate" id="TruckDate" style="width: 130px; color: rgb(0, 0, 0);" data-valid="required" data-valid-msg="Select Truck Date" tabindex="1" controltype="datetype" maxlength="" value="" placeholder="Truck Date" data-role="datepicker" sqldatevalue="2016-10-03" formattedvalue="03-Oct-2016"><span unselectable="on" class="k-select">


    //$("input[type='button'][class='btn btn-danger']").css("visibility","hidden");
    //<span unselectable="on" class="k-icon k-i-calendar">select</span></span></span>

    $("span.k-delete").live("click", function () { Deleterow(this) })
    var tableControl = "<tr><td class='ui-widget-header'>Scale Weight (kg)</td><td class='ui-widget-header'><input type='number' id='txtScaleWeight' sytle='width:40px;' pattern='\d+'></td><td class='ui-widget-header'>Airline</td><td><input type=\"hidden\" name=\"txtAirline\" id=\"txtAirline\" value=\"\"><input type='text' id='Text_txtAirline' name='Text_txtAirline' sytle='width:40px;' controltype=\"autocomplete\" value=\"\"></td></tr> <tr><td class='ui-widget-header'>Flight Date</td><td><input type='text' id='txtFlightDate' sytle='width:40px' controltype='datetype' class='k-input k-state-default' data-role='datepicker'></td><td class='ui-widget-header'>Flight No</td><td><input type=\"hidden\" name=\"txtFlightNo\" id=\"txtFlightNo\" value=\"\"><input type='text' id='Text_txtFlightNo' name='Text_txtFlightNo' sytle='width:40px' controltype=\"autocomplete\" value=\"\"></td></tr><tr id=\"rowOffPoint\"><td class='ui-widget-header'><font color=red></font><span id='spanOffPoint'>OFF Point</span></td><td><input type=\"hidden\" name=\"txtOffPoint\" id=\"txtOffPoint\" value=\"\" ><input type='text' id='Text_txtOffPoint' name='Text_txtOffPoint' sytle='width:40px' controltype=\"autocomplete\" value=\"\" ></td></tr><tr><td><input type='button' id='btnFetchWeight' value='Fetch Weight'></td><td><input type='button' id='btnManual' value='Manual' onclick='resetScalWeight()'></td><td><input type='button' id='btnReWeight' value='Re-Weight' onclick='resetScalWeight()'></td></tr>";
    $("#FlightDetails").attr("align", "center").append(tableControl);
    $('#Text_txtFlightNo').bind('blur', function () {
        if ($("#Text_txtFlightNo").val() == "") {
            $("#Text_txtOffPoint").removeAttr("data-valid", "required");
            $("#Text_txtOffPoint").removeAttr("data-valid-msg", "Off point can not be blank");
            $("#spanOffPoint").closest("td").find("font").html('');
        }
        else {
            $("#Text_txtOffPoint").attr("data-valid", "required");
            $("#Text_txtOffPoint").attr("data-valid-msg", "Off point can not be blank");
            $("#spanOffPoint").closest("td").find("font").html('*');
        }
    });
    $("#Text_BaseUldNumber").attr('maxlength', '11');
    $("#Text_BaseUldNumber").attr('minlength', '9');
    $("#rowOffPoint").hide();
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        $("#Text_ChoosenAirline").data("kendoAutoComplete").enable(false);
        $.ajax({
            url: "Services/Uld/UldStackService.svc/GetULDStackRecordJSONString?recid=" + $("#hdnUldStackSNo").val(),
            type: "GET",
            dataType: "json",
            success: function (result) {
                var tableString = "";
                var resData = jQuery.parseJSON(result);
                var uldstackData = resData.Table0;
                var uldStackDetailsData = resData.Table1;
                var consumablesData = resData.Table2;
                //ULDNo
                //ScaleWeight
                //Airline
                //UldStackFlightDate
                //FlightDate
                //FlightNo
                //ULDStockSNo
                $("#hdnUldSNo").val(uldstackData[0].ULDStockSNo);
                $("#txtScaleWeight").val(uldstackData[0].ScaleWeight);
                $("#Text_txtAirline").val(uldstackData[0].Airline);
                $("#txtAirline").val(uldstackData[0].AirlineSNo);
                //$("#txtFlightDate").data("kendoDatePicker").value(uldstackData[0].FlightDate);
                //$("#txtFlightDate").val(uldstackData[0].FlightDate == "" ? uldstackData[0].UldStackFlightDate : uldstackData[0].FlightDate);

                $("#txtFlightDate").attr("formattedvalue", kendo.toString(kendo.parseDate(uldstackData[0].FlightDate), 'dd-MMM-yyyy') == "01-Jan-1900" ? "" : kendo.toString(kendo.parseDate(uldstackData[0].FlightDate), 'dd-MMM-yyyy'));
                $("#txtFlightDate").attr("sqldatevalue", uldstackData[0].FlightDate == "01-Jan-1900" ? "" : uldstackData[0].FlightDate);
                $("#txtFlightDate").val(getQueryStringValue("FormAction").toUpperCase() == "EDIT" ? kendo.toString(kendo.parseDate(uldstackData[0].FlightDate), 'dd-MMM-yyyy') == "01-Jan-1900" ? "" : kendo.toString(kendo.parseDate(uldstackData[0].FlightDate), 'dd-MMM-yyyy') : kendo.toString(kendo.parseDate(uldstackData[0].FlightDate), 'dd-MMM-yyyy'));
                $("#Text_txtFlightNo").val(uldstackData[0].FlightNo);
                $("#txtFlightNo").val(uldstackData[0].Route);
                $("#txtOffPoint").val(uldstackData[0].OffPoint);
                $("#Text_txtOffPoint").val(uldstackData[0].OffPoint);

                $("#tblUldStack").find("tbody tr").remove();
                $(uldStackDetailsData).each(function (index, value) {
                    tableString += "<tbody><tr align='center' id='" + "tr" + value.ULDNo + "'><td>" + value.ULDNo + "</td><td>" + value.TareWeight + "</td><td>" + value.OwnerCode + "</td></tr></tbody>";
                });
                $("#tblUldStack").append(tableString);
                // $('#tblConsumable').appendGrid('load', consumablesData);
                if ($("#txtFlightNo").val() != "" && $("#txtFlightNo").val() != undefined)
                    GetFlightRoute("1");
            }
        });
        GetAppendGrid();
        $("#tblUldStack").append("<thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD No.</td><td class='ui-widget-header'>Tare Weight (kg)</td><td class='ui-widget-header'>Owner</td></tr></thead>");
        //cfi.BindMultiValue("StackUld", $("#Text_StackUld").val(), $("#StackUld").val());
        //var DataField = ($('#StackUld').val());
        //var DataText = ($('#Text_StackUld').val());
        //$('#Text_StackUld')[0].defaultValue = '';
        //$('#Text_StackUld')[0].Value = '';
        //$('#Text_StackUld').val('');
        //$('#Multi_StackUld').val(DataField);
        //$('#FieldKeyValuesStackUld')[0].innerHTML = DataField;
        //var i = 0;
        //if (DataField.split(',').length > 0) {
        //    while (i < DataField.split(',').length) {
        //        if (DataField.split(',')[i] != '')
        //            $('#divMultiStackUld').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + DataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + DataField.split(',')[i] + "'></span></li>");
        //        i++;
        //    }
        //    $("#divMultiStackUld").css("display", "block");
        //}

        //if (DataField.length > 0) {

        //        cfi.BindMultiValue("StackUld", DataField, DataField)
        //       // $("#StackUld").val(DataField[0].sphcsno);

        //}
    }
    else {
        // $("#tbl").find("tr:eq(4)").hide();
        // $("#tblConsumable").hide();
        $("#FlightDetails").hide();
        // $("input:button[id='BuildStack']").hide()
        $("#tbl").find("tr:eq(5)").hide();
    }
    //    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
    //}




    //$("<div  id=dvUldStackPopUp></div>").appendTo('body');
    //$("#dvUldStackPopUp").append("<div style='text-align=center'><table cellpadding=0 cellspacing=0 width=900 align=\"center\"><tr><td>AirLine</td><td><input id=\"Text_txtAirlinePopUp\" type=text style='width:40px'></td><td>Flight Date</td><td><input type='date' style='width:100px' id=\"txtFlightDt\"></td><td>Flight No</td><td><input type=text style='width:40px' id=\"txtFlightNo\"><td><td><input type=button style='width:60px' value=\"Assign\"  id=\"btnAssign\" ><td></tr></table></div>");
    //$("#dvUldStackPopUp").hide();
    $('input[name="operation"]').click(function (e) {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            var tblUldStack = [];
            var flightDetails = [];
            var strConsumableData = [];

            //getUpdatedRowIndex(strConsumableData.join(','), "tblConsumable");
            //strConsumableData = $('#tblConsumable tbody').appendGrid('getStringJson');


            var tblGrid = "tblConsumable";
            var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
            getUpdatedRowIndex(rows.join(","), tblGrid);
            strConsumableData = JSON.parse($('#tblConsumable').appendGrid('getStringJson'));
            // tblConsumable_ConsumableType_1
            //  tblConsumable_UnitQty_1
            var flag = true;
            $("#tblConsumable tbody tr").each(function (index, element) {
                if ($(this).find("[id^='tblConsumable_UnitQty_']").length == 1 && $(this).find("[id^='tblConsumable_UnitQty_']").val() == "") {
                    // alert("Consumables Unit Qty can not be blank");
                    ShowMessage('warning', 'Warning', "Consumables Unit Qty can not be blank ", "bottom-right");
                    flag = false;
                }
                else if ($(this).find("input[id^='tblConsumable_ConsumableType_']").length == 1 && $(this).find("input[id^='tblConsumable_ConsumableType_']").val() == "") {
                    // alert("Consumables type can not be blank");
                    ShowMessage('warning', 'Warning', "Consumables type can not be blank", "bottom-right");
                    flag = false;
                }
            });

            if (flag == false) return false;

            //if (strConsumableData == "[]" || strConsumableData == false) {
            //    alert("Consumables can not be blank");
            //    return false;
            //}

            /*Validation For OFF Point*/

            if ($("#Text_txtFlightNo").val() != "") {
                if ($("#txtOffPoint").val() != "") {
                    $("#Text_txtOffPoint").removeAttr("data-valid", "required");
                    $("#Text_txtOffPoint").removeAttr("data-valid-msg", "Off point can not be blank");
                }
                else {
                    // alert("Off point can not be blank");
                    ShowMessage('warning', 'Warning', "Off point can not be blank", "bottom-right");
                    return false;
                }

            }
          

            $("#tblUldStack tbody tr").each(function (index, element) {

                tblUldStack.push({
                    UldNo: $(this).find("td")[0].innerHTML,
                    TareWeight: parseFloat($(this).find("td")[1].innerHTML),
                    Owner: $(this).find("td")[2].innerHTML,

                });

            });
            if (tblUldStack == "[]" || tblUldStack == false) {
                // alert("Uld details can not be blank");
                ShowMessage('warning', 'Warning', "Uld details can not be blank", "bottom-right");
                return false;
            }

            //  if ($("#tblUldStack tbody tr").length == 1) return false;
            var uldStackOject = [];
            uldStackOject.push({
                ScaleWeight: $("#txtScaleWeight").val() == "" ? 0.0 : parseFloat($("#txtScaleWeight").val()),
                Airline: $("#Text_txtAirline").val(),
                FlightDate: "\/Date(" + Date.parse($("#txtFlightDate").attr("sqldatevalue") == "" ? "1900-01-01" : $("#txtFlightDate").attr("sqldatevalue")) + ")\/",
                FlightNo: $("#Text_txtFlightNo").val(),
                ULDSNo: $("#hdnUldSNo").val(),
                ConsumableSNo: $("#tblConsumable_HdnConsumableType_1").val(),
                ActionType: getQueryStringValue("FormAction").toUpperCase(),
                UldStackSNo: $("#hdnUldStackSNo").val(),
                ChoosenAirline: $("#ChoosenAirline").val(),
                OffPoint: $("#txtOffPoint").val()
            });

            $.ajax({
                url: "Services/Uld/UldStackService.svc/SaveAndUpdateUldStack",
                async: false,
                type: "POST",
                dataType: "json",
                data: JSON.stringify({ uldStackObj: uldStackOject, objUldStackTareWeight: tblUldStack, objConsumables: strConsumableData }),
                contentType: "application/json; charset=utf-8",
                cache: false,
                success: function (result) {
                    if (result.length != 0) {
                        if (result[0].indexOf("ULD Stack Details Added Successfully") >= 0 || result[0].indexOf("ULD Stack Details Updated Successfully") >= 0) {
                            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

                                AuditLogSaveNewValue("divbody");
                            }
                            navigateUrl('Default.cshtml?Module=ULD&Apps=ULDStack&FormAction=INDEXVIEW');
                        }
                        else {
                            alert(result[0]);
                            // ShowMessage('warning', 'Warning ', result[0], "bottom-right");
                            return false;
                        }
                    }
                },
                error: function (error) {
                    debugger;
                }
            });

        }
        //GetFlightRoute("1");
    });

    $("input:button[id$='ValidateBaseUld']").click(function () {
        if ($("#Text_BaseUldNumber").val().length < 9) {
            ShowMessage('warning', 'Warning', "ULD Nbr length should be between 09 & 11 Characters", "bottom-right");
            return false;
        }
        if ($("#Text_ChoosenAirline").data("kendoAutoComplete").value() == undefined || $("#Text_ChoosenAirline").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Warning', "Kindly select an Airline.", "bottom-right");
            $("#Text_BaseUldNumber").val("");
            $("#Text_BaseUldNumber").focus();
            return false;
        }

        $.ajax({
            url: "Services/Uld/UldStackService.svc/ValidateBaseUld",
            async: false,
            type: "GET",
            dataType: "json",
            data: { UldNo: $("#Text_BaseUldNumber").val(), AirlineCode: $("#ChoosenAirline").val(), CityCode: userContext.CityCode },
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (result) {
                if (JSON.parse(result)[0].ULDType == 0) {
                    ShowMessage('warning', 'Warning', "Base ULD Shall Be Pallet Type Only", "bottom-right");
                    return false;
                } else {
                    if (parseInt(JSON.parse(result)[0].ULDSNo) != 0) {
                        var ParentULDSNo = parseInt(JSON.parse(result)[0].ULDSNo);
                        $.ajax({
                            url: "Services/Uld/UldStackService.svc/BaseUldData",
                            async: false,
                            type: "GET",
                            dataType: "json",
                            data: { lstUldStack: $("#Text_BaseUldNumber").val() },
                            contentType: "application/json; charset=utf-8",
                            cache: false,
                            success: function (result) {
                                var myData = jQuery.parseJSON(result);
                                if (myData.length > 0) {
                                    if ($("#ChoosenAirline").val() != myData[0].AirlineCode)
                                        //  alert("ULD stack does not belong to chosen Airline.")
                                        // ShowMessage('warning', 'Warning', "ULD stack does not belong to chosen Airline. Do you wish to proceed ?", "bottom-right");
                                    {
                                        var r = jConfirm("ULD stack does not belong to chosen Airline. Do you wish to proceed ?", "", function (r) {
                                            if (r == true) {
                                                $("#tbl").find("tr:eq(5)").show();
                                                $("#spnBaseUld").closest("td").next("td").html($("#Text_BaseUldNumber").val())
                                                GetAppendGrid();
                                                $("#Text_BaseUldNumber").attr("disabled", true)
                                                $("#Text_ChoosenAirline").data("kendoAutoComplete").enable(false);
                                                $("#hdnUldSNo").val(ParentULDSNo);
                                                if ($("#tblUldStack:contains(ULD No.)").length == 0) {
                                                    $("#tblUldStack").append("<thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD No.</td><td class='ui-widget-header'>Tare Weight (kg)</td><td class='ui-widget-header'>Owner</td></tr></thead>");
                                                }
                                                $("#tblUldStack").find("tr:contains(" + $("#Text_BaseUldNumber").val().replace(',', '') + ")").remove();

                                                //var lstUldStack = JSON.stringify(lstItem);
                                                $("#tblUldStack").append("<tr id='tr" + $("#Text_BaseUldNumber").val() + "'><td class='ui-widget-content first'>" + myData[0].ULDNo + "</td><td class='ui-widget-content first'>" + myData[0].TareWeight + "</td><td class='ui-widget-content first'>" + myData[0].Owner + "</td></tr>");
                                                $("#txtScaleWeight").val(myData[0].TareWeight);
                                                $("#FlightDetails").show();
                                            }
                                        });
                                    }
                                    else {
                                        $("#tbl").find("tr:eq(5)").show();
                                        $("#spnBaseUld").closest("td").next("td").html($("#Text_BaseUldNumber").val())
                                        GetAppendGrid();
                                        $("#Text_BaseUldNumber").attr("disabled", true)
                                        $("#Text_ChoosenAirline").data("kendoAutoComplete").enable(false);
                                        $("#hdnUldSNo").val(ParentULDSNo);
                                        if ($("#tblUldStack:contains(ULD No.)").length == 0) {
                                            $("#tblUldStack").append("<thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD No.</td><td class='ui-widget-header'>Tare Weight (kg)</td><td class='ui-widget-header'>Owner</td></tr></thead>");
                                        }
                                        $("#tblUldStack").find("tr:contains(" + $("#Text_BaseUldNumber").val().replace(',', '') + ")").remove();

                                        //var lstUldStack = JSON.stringify(lstItem);
                                        $("#tblUldStack").append("<tr id='tr" + $("#Text_BaseUldNumber").val() + "'><td class='ui-widget-content first'>" + myData[0].ULDNo + "</td><td class='ui-widget-content first'>" + myData[0].TareWeight + "</td><td class='ui-widget-content first'>" + myData[0].Owner + "</td></tr>");
                                        $("#txtScaleWeight").val(myData[0].TareWeight);
                                        $("#FlightDetails").show();
                                    }

                                }
                                //if (myData.length > 0) {
                                //    //if (myData.length > 0) {
                                //    //    if (pageType.toUpperCase() == 'EDIT') {
                                //    //        if ($("#txtAirline").val() != myData[0].SNo)
                                //    //            alert("ULD stack does not belong to chosen Airline.")
                                //    //    }
                                //    //    else if (pageType.toUpperCase() == 'NEW') {

                                //    //        if ($("#Airline").val() != myData[0].AirlineCode)
                                //    //            alert("ULD stack does not belong to chosen Airline.")
                                //    //    }
                                //    //}
                                //    $("#tblUldStack").append("<tr id='tr" + $("#Text_BaseUldNumber").val() + "'><td class='ui-widget-content first'>" + myData[0].ULDNo + "</td><td class='ui-widget-content first'>" + myData[0].TareWeight + "</td><td class='ui-widget-content first'>" + myData[0].Owner + "</td></tr>");
                                //    $("#txtScaleWeight").val(myData[0].TareWeight);
                                //}
                            }
                        });
                        // $("#FlightDetails").show();
                    }
                    else {
                        //alert("Incorrect ULD Number Or may be duplicate ULD Number.");
                        ShowMessage('warning', 'Warning', "Incorrect ULD Number Or may be duplicate ULD Number.", "bottom-right");
                        return false;
                    }
                }
            }
        });
        //if (parseInt(JSON.parse(result)[0].ULDSNo) != 0) {
        //    var ParentULDSNo = parseInt(JSON.parse(result)[0].ULDSNo);
        //    $.ajax({
        //        url: "Services/Uld/UldStackService.svc/GetULDType",
        //        async: false,
        //        type: "POST",
        //        dataType: "json",
        //        data: JSON.stringify({ uldstockno: ParentULDSNo }),
        //        contentType: "application/json; charset=utf-8",
        //        cache: false,
        //        success: function (result)
        //        {
        //            if (result.length != 0)
        //            {
        //                if (result[0].indexOf("ULD Stack Details Added Successfully") >= 0 || result[0].indexOf("ULD Stack Details Updated Successfully") >= 0) {
        //                }
        //                else {
        //                    alert(result[0]);
        //                    return false;
        //                }
        //            }
        //        },
        //        error: function (error)
        //        {
        //        }
        //    });
        //}
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        $("#Text_StackUld").attr("disabled", "disabled");
        $("[id^='tblConsumable_ConsumableType']").attr("disabled", "disabled");
        $("#FlightDetails").find("input").attr("disabled", "disabled")
        $("#btnFetchWeight").css("visibility", "hidden");
        $("#btnManual").css("visibility", "hidden");
        $("#btnManual").css("visibility", "hidden");
        $("#btnReWeight").css("visibility", "hidden");
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        cfi.AutoComplete("txtAirline", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], GetFlight, "contains");

        //cfi.AutoComplete("txtAirline", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
        //cfi.AutoComplete("txtAirline", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"]);
        //cfi.AutoComplete("txtAirline", "Airline", "Terminal", "SNo", "TerminalName", ["TerminalName"], null, "contains");
        cfi.AutoComplete("txtFlightNo", "FlightNo", "VDailyFlightNo", "Route", "FlightNo", ["FlightNo"], GetFlightRoute, "contains")
        //cfi.AutoComplete("txtOffPoint", "Route", "vOffPointUldStack", "Route", "Route", ["Route"], null, "contains");
        $("#txtFlightDate").kendoDatePicker();
        $('#txtFlightDate').data("kendoDatePicker").value("");
    }


    $("#divMultiStackUld").click(function () {

    })
});
function isNumber() {
    var txtScaleWeight = $("#txtScaleWeight").attr("id");
    if (!$.isNumeric($('#' + txtScaleWeight).val())) {
        $('#' + txtScaleWeight).val("");
        return false;
    }
}
function Deleterow(obj) {
    var diff = parseInt($("#txtScaleWeight").val()) - parseInt($("tr[id^='" + "tr" + $(obj).attr("id").replace(/ /g, '') + "'] td:eq(1)").text());
    $("#txtScaleWeight").val(diff);
    $("tr[id^='" + "tr" + $(obj).attr("id").replace(/ /g, '') + "']").remove();
}
var pageType = $('#hdnPageType').val();
var Uld = "";
function BuildStack(valueId, value, keyId, key) {


    //if (value == "")
    //    return
    //var BaseUld = $("#tblUldStack tbody tr td").html()
    //if (BaseUld == key) {
    //    ShowMessage('warning', 'Warning', "Duplicate ULD", "bottom-right");
    //    var r = false
    //    setTimeout(function () {
    //        if (r == false) {

    //            var arr = $("#StackUld").val().split(',');
    //            var idx = arr.indexOf(key);
    //            arr.splice(idx, 1);
    //            $("#StackUld").val(arr);
    //            $("#Multi_StackUld").val(arr);
    //            $('span[id="FieldKeyValuesStackUld"]').text(arr);
    //            $('span[id="' + key + '"]').closest('li').remove();
    //        }
    //    }, 100)
    //    return;
    //}

    //Uld += value;
    //var PUldID1 = 0;
    //var CUldID0 = 0;
    //$("#ULDTYPEGEt").val(Uld)
    //var findData = ValudateCheck(Uld);
    //if (findData.length > 0) {
    //    for (var i = 0; i < findData.length; i++) {
    //        if (findData[i].uldtypes == "1") {
    //            PUldID1 += 1;
    //        }
    //        if (findData[i].uldtypes == "0") {
    //            CUldID0 += 1;
    //        }
    //    }
    //}
    //if (CUldID0 > 0) {

    //    if ((PUldID1 == 3 || PUldID1 > 3) || (CUldID0 == 3 || CUldID0 > 3)) {
    //        ShowMessage('warning', 'Warning', "Maximum 2 Container and 2 Pallets for 1 Stack.", "bottom-right");
    //        var r = false
    //        setTimeout(function () {
    //            if (r == false) {

    //                var arr = $("#StackUld").val().split(',');
    //                var idx = arr.indexOf(key);
    //                arr.splice(idx, 1);
    //                $("#StackUld").val(arr);
    //                $("#Multi_StackUld").val(arr);
    //                $('span[id="FieldKeyValuesStackUld"]').text(arr);
    //                $('span[id="' + key + '"]').closest('li').remove();
    //            }
    //        }, 20)
    //        return;
    //    }
    //} else {
    //    if (PUldID1 > 20) {

    //        ShowMessage('warning', 'Warning', "Maximum 20 Pallets", "bottom-right");
    //        var r = false
    //        setTimeout(function () {
    //            if (r == false) {
    //                var arr = $("#StackUld").val().split(',');
    //                var idx = arr.indexOf(key);
    //                arr.splice(idx, 1);
    //                $("#StackUld").val(arr);
    //                $("#Multi_StackUld").val(arr);
    //                $('span[id="FieldKeyValuesStackUld"]').text(arr);
    //                $('span[id="' + key + '"]').closest('li').remove();
    //            }
    //        }, 100)
    //        return;
    //    }
    //}

    //var flag = false;
    //if ($("#tblUldStack:contains(ULD No.)").length == 0) {
    //    $("#tblUldStack").append("<thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD No.</td><td class='ui-widget-header'>Tare Weight (Kgs)</td><td class='ui-widget-header'>Owner</td></tr></thead>");
    //}
    //$("#tblUldStack").find("tr:contains(" + value.replace(',', '') + ")").remove();
    //var lstUldStack = JSON.stringify(lstItem);

}

function BuildStackRestriction(e) {

    var GetHiddenField = $("#StackUld").val();

    var BaseUld = $("#tblUldStack tbody tr td").html()
    if (BaseUld.trim() == e.item[0].innerText.trim()) {
        e.preventDefault();
        ShowMessage('warning', 'Warning', "Selected ULD is Already Used as Base ULD", "bottom-right");
        return;
    }
    var finalValue = $("#StackUld").val() + ',' + e.item[0].innerText

    var myData;
    $.ajax({
        url: "Services/Uld/UldStackService.svc/CheckBaseUldData",
        async: false,
        type: "GET",
        dataType: "json",
        data: { ChklstUldStack: finalValue },
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            myData = jQuery.parseJSON(result)[0].ReturnVal;
            if (myData == "False") {
                e.preventDefault();
                ShowMessage('warning', 'Warning', "" + jQuery.parseJSON(result)[0].msg + "", "bottom-right");
            } else {
                var flag = false;
                if ($("#tblUldStack:contains(ULD No.)").length == 0) {
                    $("#tblUldStack").append("<thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD No.</td><td class='ui-widget-header'>Tare Weight (kg)</td><td class='ui-widget-header'>Owner</td></tr></thead>");
                }
                $.ajax({
                    url: "Services/Uld/UldStackService.svc/BaseUldData",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: { lstUldStack: e.item[0].innerText },
                    contentType: "application/json; charset=utf-8",
                    cache: false,
                    success: function (result) {

                        // ValudateCheck(Uld)
                        var myData = jQuery.parseJSON(result);

                        if (myData.length > 0) {

                            if ($("#ChoosenAirline").val() != myData[0].AirlineCode)
                                // alert("ULD stack does not belong to chosen Airline.")
                                // ShowMessage('warning', 'Warning', "ULD stack does not belong to chosen Airline.", "bottom-right");
                            {
                                var r = jConfirm("ULD stack does not belong to chosen Airline. Do you wish to proceed ?", "", function (r) {
                                    if (r == true) {
                                        $("#tblUldStack").append("<tr id='tr" + e.item[0].innerText + "'><td class='ui-widget-content first'>" + myData[0].ULDNo + "</td><td class='ui-widget-content first'>" + myData[0].TareWeight + "</td><td class='ui-widget-content first'>" + myData[0].Owner
                                            + "<input type='hidden' id='ULDTYPEGEt' /></td></tr>");
                                        $("#txtScaleWeight").val(parseInt($("#txtScaleWeight").val() == "" ? 0 : $("#txtScaleWeight").val()) + parseInt(myData[0].TareWeight));
                                        $("#FlightDetails").show();

                                    }
                                    else {
                                        e.preventDefault();
                                        //var arr = $("#StackUld").val().split(',');
                                        //var idx = arr.indexOf(key);
                                        //arr.splice(idx, 1);
                                        //$("#StackUld").val(arr);
                                        //$("#Multi_StackUld").val(arr);
                                        //$('span[id="FieldKeyValuesStackUld"]').text(arr);
                                        //$('span[id="' + key + '"]').closest('li').remove();
                                    }
                                });
                            }
                            else {

                                $("#tblUldStack").append("<tr id='tr" + e.item[0].innerText + "'><td class='ui-widget-content first'>" + myData[0].ULDNo + "</td><td class='ui-widget-content first'>" + myData[0].TareWeight + "</td><td class='ui-widget-content first'>" + myData[0].Owner + " </td></tr>");
                                $("#txtScaleWeight").val(parseInt($("#txtScaleWeight").val() == "" ? 0 : $("#txtScaleWeight").val()) + parseInt(myData[0].TareWeight));
                                $("#FlightDetails").show();

                            }
                        }
                    }
                });

            }
        }
    });

}


//function AutoCompleteDeleteCallBack(e, div, textboxid) {
//    if (textboxid == "Text_SpecialHandlingCode" && div == "divMultiSpecialHandlingCode") {
//        var target = e.target; // get current Span.
//        var DivId = div; // get div id.
//        var textboxid = textboxid; // get textbox id.
//        var mid = textboxid.replace('Text', 'Multi');

//var arr = $("#" + mid).val().split(',');
////var idx = arr.indexOf($(this)[0].id);
////arr.splice(idx, $(e.target).attr("id"));
//var idx = arr.indexOf($(e.target).attr("id"));
//arr.splice(idx, 1);
//$("#" + mid).val(arr);
//$("#" + textboxid.replace('Text_', '')).val(arr);

//        GetDGRDetailsAfterDelete(e);
//    }
//}


////////////////////////

function GetAppendGrid() {
    $('#tblConsumable').appendGrid({
        tableID: 'tblConsumable',
        caption: 'Consumables',
        contentEditable: true,
        masterTableSNo: $("#hdnUldStackSNo").val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Uld/UldStackService.svc",
        getRecordServiceMethod: "GetUldStackConsumblesRecord",
        //deleteServiceMethod: "DeleteManageTariffSlab",
        initRows: 1,
        columns: [
         {
             name: 'StockType', display: 'Stock Type', type: 'radiolist', ctrlOptions: { 0: 'Airline', 1: 'Self' }, selectedIndex: 0, onClick: function (evt, rowIndex) {
                 //alert(rowIndex);
                 ClearConsumable("tblConsumable_ConsumableType_" + (rowIndex + 1));
             }
         },

         { name: "ConsumableType", display: "Consumable Type", type: "text", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? "autocomplete" : "text" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false, tableName: "VUldStackConsumables", textColumn: "Item", keyColumn: "SNo" },

        {
            name: 'UnitQty', display: 'Unit / Qty', type: pageType == "NEW" || pageType == "EDIT" ? "text" : "label", ctrlCss: { width: '90px' }, onChange: function (evt, rowIndex) {
                var ind = evt.target.id.split('_')[2];
                if (evt.target.value == "0") {
                    $("#tblConsumable_UnitQty_" + ind).attr("value", "");
                   // $("#tblConsumable_UnitQty_" + rowIndex + 1).val('')
                }
               
            }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false
        },
        { name: 'consumableSNo', type: 'hidden', id: 'consumableSNo' },

        ],
        maxRowsAllowed: 0,

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            //if ($("#tblConsumable tbody tr").length > 20) {
            //    $("#tblConsumable_btnAppendRow").hide();
            //}

        }
        ,
        beforeRowRemove: function (caller, rowIndex) {
            if (pageType == "EDIT") {
                return confirm('Are you sure to remove this row?');
                if ($("#tblConsumable tbody tr").length < 20) {
                    $("#tblConsumable_btnAppendRow").hide();
                }
            }
        },

        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });
    $("#tblConsumable thead tr:nth-child(2) td:first-child").hide();

    $("#tblConsumable_btnAppendRow").click(function () {

        $("tr[id^=tblConsumable_Row]").each(function () {
            var id = $(this).attr("id");

            $("tr#" + id + " td:first").hide();
        })
    })


    $("tr[id^=tblConsumable_Row]").each(function () {
        var id = $(this).attr("id");
        $("tr#" + id + " td:first").hide();
    });

}
function ClearConsumable(id) {
    $('#' + id).data("kendoAutoComplete").value('');
    $('#' + id).data("kendoAutoComplete").key('');
}
function resetScalWeight() {
    $("#txtScaleWeight").val("");
}
function showChildUldStack(obj) {
    $("#dvChildUldStackPopUp").remove();
    $("#tblChildUldStack").remove();
    var uldStackSNo = $(obj).closest("tr").find("td:eq(1)").text();
    //$("#dvUldStackPopUp").show();
    //$("<div  id=dvUldStackPopUp></div>").appendTo('body');
    $("<div  id=dvChildUldStackPopUp></div>").appendTo('body');
    $("#dvChildUldStackPopUp").append("<div style='text-align=center'><table cellpadding=0 cellspacing=0 width=900 align=\"center\" id=\"tblChildUldStack\"><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD No.</td><td class='ui-widget-header'>Tare Weight (kg)</td><td class='ui-widget-header'>Owner</td></tr></thead><tbody></tbody></table></div>");
    $.ajax({
        url: "Services/Uld/UldStackService.svc/GetChildULDStackRecord?recid=" + uldStackSNo,
        type: "GET",
        dataType: "json",
        success: function (result) {
            var tableString = "";
            var resData = jQuery.parseJSON(result);
            // var uldstackData = resData.Table0;
            var uldStackDetailsData = resData.Table0;
            //var consumablesData = resData.Table2;
            //ULDNo
            //ScaleWeight
            //Airline
            //UldStackFlightDate
            //FlightDate
            //FlightNo
            ////ULDStockSNo
            //$("#hdnUldSNo").val(uldstackData[0].ULDStockSNo);
            //$("#txtScaleWeight").val(uldstackData[0].ScaleWeight);
            //$("#Text_txtAirline").val(uldstackData[0].Airline);
            //$("#txtFlightDate").val(uldstackData[0].FlightDate);
            //$("#Text_txtFlightNo").val(uldstackData[0].FlightNo);


            $(uldStackDetailsData).each(function (index, value) {
                tableString += "<tbody><tr align='center' id='" + "tr" + value.ULDNo + "'><td>" + value.ULDNo + "</td><td>" + value.TareWeight + "</td><td>" + value.ownercode + "</td></tr></tbody>";
            });
            $("#tblChildUldStack").append(tableString);
            // $('#tblConsumable').appendGrid('load', consumablesData);
        }


    });

    cfi.PopUp("dvChildUldStackPopUp", "ULD Stack Details", "1000", null, null, 150);
}

function assignFlightdateNFlightNo(obj) {
    $("#dvUldStackPopUp").remove();

    var uldStackSNo = $(obj).closest("tr").find("td:eq(1)").text();
    var airLine = $(obj).closest("tr").find("td:eq(6)").text();
    var flightNo = $(obj).closest("tr").find("td:eq(8)").text();
    var flightDate = $(obj).closest("tr").find("td:eq(9)").text();
    var airlineSNo = $(obj).closest("tr").find("td:eq(10)").text();
    var flightStatus = $(obj).closest("tr").find("td:eq(7)").text();
    var Route = $(obj).closest("tr").find("td:eq(11)").text();
    var OffPoint = $(obj).closest("tr").find("td:eq(12)").text();

    //$("#dvUldStackPopUp").show();
    //$("<div  id=dvUldStackPopUp></div>").appendTo('body');
    $("<div  id=dvUldStackPopUp style=\"width:1100px\"></div>").appendTo('body');
    $("#dvUldStackPopUp").append("<table cellpadding='0' cellspacing='0' width=\"1000px\" align=\"center\"><tr><td>Airline</td><td> <input width=\"10px\" type=\"hidden\" name=\"txtAirlinePopUp\" id=\"txtAirlinePopUp\" value=\"\"><input id=\"Text_txtAirlinePopUp\" type=text style=\"width:100px\" name=\"Text_txtAirlinePopUp\" controltype=\"autocomplete\" value=\"\"></td><td>Flight Date</td><td><input type=\"text\" style='width:100px' id=\"txtFlightDt\"></td><td>Flight No</td><td><input type=\"hidden\" name=\"txtFlightNoPop\" id=\"txtFlightNoPop\" value=\"\"><input type=\"text\" id=\"Text_txtFlightNoPop\" name=\"Text_txtFlightNoPop\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td><td><table id=\"tblOffPointPopUp\"><tr> <td><font color=red></font><span id='spanOffPointPopUp'>OFF Point</span></td><td><input type=\"hidden\" name=\"txtOffpointPopUp\" id=\"txtOffpointPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtOffpointPopUp\" name=\"Text_txtOffpointPopUp\" controltype=\"autocomplete\" value=\"\" ></td></tr></table></td><td><input type=\"button\" value=\"Assign\" class=\"btn btn-info\" id=\"btnAssign\" onclick=\"return assignFlightNo_FlightDate(" + uldStackSNo + ",'Y'" + ");\"></td><td><input id=\"btnOffload\" type=\"button\" value=\"Offload\" class=\"btn btn-info\" onclick=\"return assignFlightNo_FlightDate(" + uldStackSNo + ",'N'" + ");\"></td></tr></table>");

    $("#tblOffPointPopUp").hide();

    $('#Text_txtFlightNoPop').bind('blur', function () {
        if ($("#Text_txtFlightNoPop").val() == "") {

            $("#Text_txtOffpointPopUp").removeAttr("data-valid", "required");
            $("#Text_txtOffpointPopUp").removeAttr("data-valid-msg", "Off point can not be blank");
            $("#spanOffPointPopUp").closest("td").find("font").html('');
        }
        else {
            $("#Text_txtOffpointPopUp").attr("data-valid", "required");
            $("#Text_txtOffpointPopUp").attr("data-valid-msg", "Off point can not be blank");
            $("#spanOffPointPopUp").closest("td").find("font").html('*');
        }


    });

    if ((flightStatus.toUpperCase() == 'DEP' || flightStatus.toUpperCase() == 'ARR') || (flightNo.toUpperCase() == 'ASSIGN' && flightDate.toUpperCase() == 'ASSIGN'))
        $("#btnOffload").css("display", "none");
    else
        $("#btnOffload").css("display", "block");

    $("#txtFlightDt").kendoDatePicker();
    $('#txtFlightDt').data("kendoDatePicker").value("");
    if (flightNo.toUpperCase() != 'ASSIGN' || flightDate.toUpperCase() != 'ASSIGN' || airLine != "") {
        $("#Text_txtAirlinePopUp").val(airLine);
        $("#txtAirlinePopUp").val(airlineSNo);
        $("#txtFlightNoPop").val(Route);
        $("#Text_txtFlightNoPop").val(flightNo.toUpperCase() == 'ASSIGN' ? '' : flightNo);
        $("#txtFlightDt").val(flightDate.toUpperCase() == 'ASSIGN' ? "" : flightDate);
        $("#txtOffpointPopUp").val(OffPoint);
        $("#Text_txtOffpointPopUp").val(OffPoint);

    }
    //cfi.AutoComplete("txtAirlinePopUp", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"]);
    cfi.AutoComplete("txtAirlinePopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], GetFlightpopUp, "contains");
    cfi.AutoComplete("txtFlightNoPop", "CarrierCode,FlightNumber", "VDailyFlightNo", "Route", "FlightNumber", ["CarrierCode", "FlightNumber"], GetFlightRoutePopUp, "contains");
    // cfi.AutoComplete("txtOffpointPopUp", "Route", "vOffPointUldStack", "Route", "Route", ["Route"], null, "contains");
    if (flightNo.toUpperCase() != 'ASSIGN')
        GetFlightRoutePopUp('1');

    $("div[id='Text_txtAirlinePopUp-list']").css({ "width": "120px" });
    //$('input[name="btnAssign"]').bind('click',function(){
    //    assignFlightNo_FlightDate(uldStackSNo);
    //});
    $("span[class='k-window-title']").css({ "height": "15px" });

    if (flightStatus.toUpperCase() == 'DEP' || flightStatus.toUpperCase() == 'ARR') {
        if (userContext.SpecialRights.UldStack == true) {
            $("#dvUldStackPopUp").show();
            cfi.PopUp("dvUldStackPopUp", "Assign Flight Date / Flight No", "1100", null, null, 150);
        }
        else {
            //alert("Flight Already Departed");
            ShowMessage('warning', 'Warning', "Flight Already Departed", "bottom-right");
            $("#dvUldStackPopUp").hide();
            return false;
        }
    }
    else {
        $("#dvUldStackPopUp").show();
        cfi.PopUp("dvUldStackPopUp", "Assign Flight Date / Flight No", "1100", null, null, 150);
    }

}
//$('input[name="btnAssign"]').click(function (e) {
//    assignFlightNo_FlightDate(obj)


//});
function assignFlightNo_FlightDate(uldStackSNo, IsassignOrOffload) {
    if ($("#Text_txtFlightNoPop").val() != "") {
        if ($("#txtOffpointPopUp").val() != "") {
            $("#Text_txtOffpointPopUp").removeAttr("data-valid", "required");
            $("#Text_txtOffpointPopUp").removeAttr("data-valid-msg", "Off point can not be blank");
        }
        else {
            // alert("Off point can not be blank");
            ShowMessage('warning', 'Warning', "Off point can not be blank", "bottom-right");
            return false;
        }

    }

    $.ajax({
        url: "Services/Uld/UldStackService.svc/assignFlightNo_FlightDate",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ Airline: $("#Text_txtAirlinePopUp").val(), FlightNo: $("#Text_txtFlightNoPop").val(), FlightDate: $("#txtFlightDt").val(), UldStackSNo: uldStackSNo, IsassignOrOffload: IsassignOrOffload, OffPoint: $("#txtOffpointPopUp").val() }),
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultStatus = result.split('?')[0];
            var ResultValue = result.split('?')[1];
            if (ResultStatus == "1") {
                // alert($("#Text_txtFlightNoPop").val() + " assigned successfully.");
                ShowMessage('success', 'Success', $("#Text_txtFlightNoPop").val() + " assigned successfully.", "bottom-right");
                navigateUrl('Default.cshtml?Module=ULD&Apps=UldStack&FormAction=INDEXVIEW');
            }
            else {
                ShowMessage('warning', 'Warning', ResultValue, "bottom-right");
            }
        }
    });
    return true;

}


//function AutoCompleteForFBLHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
//    var keyId = textId;
//    textId = "Text_" + textId;

//    if (IsValid(textId, autoCompleteType)) {
//        if (keyColumn == null || keyColumn == undefined)
//            keyColumn = basedOn;
//        if (textColumn == null || textColumn == undefined)
//            textColumn = basedOn;
//        var dataSource = GetDataSourceForFBLHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
//        $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
//            filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
//            dataSource: dataSource,
//            filterField: basedOn,
//            separator: (separator == undefined ? null : separator),
//            dataTextField: autoCompleteText,
//            dataValueField: autoCompleteKey,
//            valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
//            template: '<span>#: TemplateColumn #</span>',
//            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
//            newAllowed: newAllowed,
//            confirmOnAdd: confirmOnAdd
//        });
//    }
//}
function checkAlphaNumeric() {
}
$("input:text[id$='Text_BaseUldNumber']").keyup(function () {
    this.value = this.value.replace(/[^A-Za-z0-9\.]/g, '').toUpperCase();


});
function AutoCompleteDeleteCallBack(e, div, textboxid) {
    if (textboxid == "Text_StackUld") {

        var mid = textboxid.replace('Text', 'Multi');

        var arr = $("#" + mid).val().split(',');

        var idx = arr.indexOf($(e.target).attr("id"));
        arr.splice(idx, 1);
        $("#" + mid).val(arr);
        $("#" + textboxid.replace('Text_', '')).val(arr);
    }
}
function ExtraCondition(textId) {
    var Filter = cfi.getFilter("AND");
    //var filter = cfi.getFilter("AND");
    //if (textId == "Text_TariffName") {
    //    cfi.setFilter(filter, "ULDNo", "notin", $("#StackUld").val());
    //    cfi.setFilter(filter, "ULDNo", "notin", $("#StackUld").val());
    //    var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
    //    return RegionAutoCompleteFilter;
    //}
    if (textId.indexOf("Text_StackUld") >= 0) {
        var filters = cfi.getFilter("AND");
        cfi.setFilter(filters, "ULDNo", "notin", $("#StackUld").val());
        Filter = cfi.autoCompleteFilter(filters);
        return Filter;
        //var arr = new Array($("#StackUld").val().slice(0, 1));
        //if (arr == 'A') {
        //    if (arr == 'P') {
        //    }
        //    else if (arr == 'A') {
        //        cfi.setFilter(filters, "ULDNo", "notin", $("#StackUld").val());
        //        Filter = cfi.autoCompleteFilter(filters);
        //        return Filter;
        //    }
        //}
        //else if (arr == 'P') {
        //    if (arr == 'A') {
        //        cfi.setFilter(filters, "ULDNo", "notin", $("#StackUld").val());
        //        Filter = cfi.autoCompleteFilter(filters);
        //        return Filter;
        //    }
        //    else (arr == 'P')
        //    {
        //        cfi.setFilter(filters, "ULDNo", "notin", $("#StackUld").val());
        //        Filter = cfi.autoCompleteFilter(filters);
        //        return Filter;
        //    }
        //}
    }

        //else if ("Text_StackUld" == textId)
        //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "ULDNo", "notin", pageType == "EDIT" ? $("#BaseUld").val() : $("#Text_BaseUldNumber").val())
        //        , cfi.getFilter("AND"),
        //        //cfi.setFilter(textId, "ULDNo", "notin", $("#StackUld").val()),
        //         cfi.getFilter("AND"),
        //        cfi.setFilter(textId, "CurrentCityCode", "eq", userContext.AirportCode),
        //        filter = cfi.autoCompleteFilter(textId);
    else if ("Text_txtFlightNo" == textId)
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "FlightDate", "eq", $("#txtFlightDate").data("kendoDatePicker").element[0].value), cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "eq", $("#txtAirline").val()), filter = cfi.autoCompleteFilter(textId);

    ///, cfi.getFilter("AND"), cfi.setFilter(textId, "Originairportcode", "eq", userContext.CityCode)

    if ("Text_txtAirline" == textId)
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#txtAirline").val()), filter = cfi.autoCompleteFilter(textId);

        //if ("Text_txtAirlinePopUp" == textId)
        //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#txtAirlinePopUp").val()), filter = cfi.autoCompleteFilter(textId);


    else if ("Text_txtFlightNoPop" == textId)
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "FlightDate", "eq", $("#txtFlightDt").data("kendoDatePicker").element[0].value), cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "eq", $("#txtAirlinePopUp").val()), cfi.getFilter("AND"), cfi.setFilter(textId, "OriginAirportCode", "eq", userContext.AirportCode), filter = cfi.autoCompleteFilter(textId);
    //if ("Text_txtFlightNoPop" == textId)
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#txtFlightNoPop").val()), filter = cfi.autoCompleteFilter(textId);

    //if ("Text_txtOffpointPopUp" == textId) {

    //,cfi.getFilter("AND"), cfi.setFilter(textId, "Originairportcode", "eq", userContext.CityCode)

    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "FlightDate", "eq", $("#txtFlightDt").data("kendoDatePicker").element[0].value), cfi.getFilter("AND"), cfi.setFilter(textId, "FlightNo", "eq", $("#Text_txtFlightNoPop").val()), filter = cfi.autoCompleteFilter(textId);
    //}

    if (textId.indexOf("tblConsumable_ConsumableType") != -1) {
        var row = textId.split("_");
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "Owner", "eq", ($("input:radio[name='tblConsumable_RbtnStockType_" + row[2] + "']:checked").val() == "0" ? "1" : "2")), cfi.getFilter("AND"), cfi.setFilter(textId, "CitySno", "eq", userContext.CitySNo), filter = cfi.autoCompleteFilter(textId);
    }
}

function OnSuccessGrid() {
    $("table[class='k-focusable k-selectable'] tbody tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            if ($(this).find("td:eq(7)").text().toUpperCase() == 'MAN') {
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "none");
                    }
                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "block");
                    }

                });
            }
            else if ($(this).find("td:eq(7)").text().toUpperCase() == 'DEP' || $(this).find("td:eq(7)").text().toUpperCase() == 'ARR') {
                $(".tool-items").find(".actionSpan").each(function () {
                    if (userContext.SpecialRights.UldStack == true) {
                        if ($(this).text().toUpperCase() == "DELETE") {
                            $(this).closest("a").css("display", "block");
                        }
                    }
                    else {
                        if ($(this).text().toUpperCase() == "DELETE") {
                            $(this).closest("a").css("display", "none");
                        }
                    }
                    if ($(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "none");
                    }
                });
            }
            else {
                $(".tool-items").find(".actionSpan").each(function () {
                    if ($(this).text().toUpperCase() == "EDIT") {
                        $(this).closest("a").css("display", "block");
                    }
                    if ($(this).text().toUpperCase() == "DELETE") {
                        $(this).closest("a").css("display", "block");
                    }
                });
            }


        });
    });

}
function GetFlightRoutePopUp(isEdit) {
    if (isEdit != "1") {
        $("#Text_txtOffpointPopUp").val("");
        $("#txtOffpointPopUp").val("");
    }
    $("#tblOffPointPopUp").show();
    cfi.AutoCompleteByDataSource("txtOffpointPopUp", GetFlightRouteArrayPopUp($("#txtFlightNoPop").val()));
    document.getElementById("btnAssign").focus();
    if ($("#Text_txtFlightNoPop").val() != "" && $("#Text_txtFlightNoPop").val() != undefined) {
        $("#Text_txtOffpointPopUp").attr("data-valid", "required");
        $("#Text_txtOffpointPopUp").attr("data-valid-msg", "Off point can not be blank");
        $("#spanOffPointPopUp").closest("td").find("font").html('*');
    }
    else {
        $("#Text_txtOffpointPopUp").removeAttr("data-valid", "required");
        $("#Text_txtOffpointPopUp").removeAttr("data-valid-msg", "Off point can not be blank");
        $("#spanOffPointPopUp").closest("td").find("font").html('');
    }
}
function GetFlightRouteArrayPopUp(FlightRoute) {
    var Arr = FlightRoute.split('-');
    var FRoute = new Array();
    var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    $(Arr).each(function (row, tr) {
        if (row > LoginCityIndex)
            FRoute.push({ Key: tr, Text: tr })
    });
    return FRoute;
}

function GetFlightRoute(isEdit) {
    if (isEdit != "1") {
        $("#Text_txtOffPoint").val("");
        $("#txtOffPoint").val("");
    }

    $("#rowOffPoint").show();
    cfi.AutoCompleteByDataSource("txtOffPoint", GetFlightRouteArray($("#txtFlightNo").val()), null, null);
    document.getElementById("btnFetchWeight").focus();
    if ($("#Text_txtFlightNo").val() != "" && $("#Text_txtFlightNo").val() != undefined) {
        $("#Text_txtOffPoint").attr("data-valid", "required");
        $("#Text_txtOffPoint").attr("data-valid-msg", "Off point can not be blank");
        $("#spanOffPoint").closest("td").find("font").html('*');
    }
    else {
        $("#Text_txtOffPoint").removeAttr("data-valid", "required");
        $("#Text_txtOffPoint").removeAttr("data-valid-msg", "Off point can not be blank");
        $("#spanOffPoint").closest("td").find("font").html('');
    }



}
function GetFlightRouteArray(FlightRoute) {
    var Arr = FlightRoute.split('-');
    var FRoute = [];
    var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    $(Arr).each(function (row, tr) {
        if (row > LoginCityIndex)
            FRoute.push({ Key: tr, Text: tr })
    });
    return FRoute;
}

function GetFlight() {
    $("#Text_txtFlightNo").val("");
    $("#txtFlightNo").val("");
}
function GetFlightpopUp() {
    $("#Text_txtFlightNoPop").val("");
    $("#txtFlightNoPop").val("");
}


