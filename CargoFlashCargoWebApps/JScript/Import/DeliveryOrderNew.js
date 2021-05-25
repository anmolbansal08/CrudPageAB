/***************************** FWB ***********************************************************/
var tblhtml;
var DGRSPHC = [];
function BindReservationSection() {
    cfi.AutoCompleteV2("Product", "ProductName", "DeliveryOrderNew_ProductName", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityDescription", "DeliveryOrderNew_Commodity", null, "contains");
    cfi.AutoCompleteV2("ShipmentOrigin", "AirportCode", "DeliveryOrderNew_Airport", null, "contains");
    cfi.AutoCompleteV2("ShipmentDestination", "AirportCode", "DeliveryOrderNew_ShipmentDest", null, "contains");
    cfi.AutoCompleteV2("SpecialHandlingCode", "CODE", "DeliveryOrderNew_SPHC", null, "contains", ",", null, null, null, GetDGRDetails, true);
    cfi.AutoCompleteV2("buptype", "Description", "DeliveryOrderNew_buptype", "", null, "contains");
    cfi.AutoCompleteV2("densitygroup", "GroupName", "DeliveryOrderNew_densitygroup", "", null, "contains");
    cfi.AutoCompleteV2("SubGroupCommodity", "SubGroupName", "DeliveryOrderNew_SubGroupCommodity", "", null, "contains");
    cfi.AutoCompleteV2("CarrierCode", "CarrierCode", "DeliveryOrderNew_CarrierCode", "", null, "contains");
    cfi.BindMultiValue("SpecialHandlingCode", $("#Text_SpecialHandlingCode").val(), $("#SpecialHandlingCode").val());

    $("span[id='spnSubGroupCommodity']").hide();
    $("input[id='SubGroupCommodity']").closest("td").find("span:first").hide();

    $("span[id='spnCommodity']").hide();
    $("input[id='Commodity']").closest("td").find("span:first").hide();

    $('#AWBDate').prop('readonly', true);
    $('#AWBDate').parent().css('width', '100px');
    $('#chkFWBAmmendment').prop('checked', false);
    $("div[id$='divDetail']").append(NogDiv);

    cfi.AutoCompleteV2("NatureofGoods", "CommodityCode", "DeliveryOrderNew_NatureofGoods", ShowOtherNog, "contains");
    $("#Text_NatureofGoods").closest("td").append('</br><input type="text" class="transSection k-input" name="OtherNOG" id="OtherNOG" style="width: 170px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off" tabindex="34">')
    $("#OtherNOG").hide();

    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc'] table >tbody").append('<tr><td></td><td colspan="14"><input type="button" class="btn btn-block btn-success btn-sm" name="btnSaveDGR" id="btnSaveDGR" style="display:block;" value="Save"></td></tr>');

    $("#btnSaveDGR").unbind("click").bind("click", function () {
        SaveDGRDetails();
    });

    if (Number(currentPomailSno) > 0) {
        $("#AWBNo").attr("required", true);
    }

    tblhtml = $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("table").html();
    var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetIFWBInformation?AWBSNo=" + awbSNo + "&POMailSNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var fblData = jQuery.parseJSON(result);
            var resData = fblData.Table0;
            var sphcArray = fblData.Table2;
            var itenData = fblData.Table1;
            var sphcArray2 = fblData.Table3;
            var HasDGRArray = fblData.Table4;
            var NOGData = fblData.Table8;
            var HSData = fblData.Table9;
            var currentawbno = "";
            var currentprfix = "";
            ItenaryArray = itenData;
            IsFWbComplete = fblData.Table5[0].Status == "True" ? true : false;
            IsFWBAmmendment = fblData.Table6[0].IsEnabled == "True" ? true : false;
            IsFlightExist = fblData.Table7[0].FlightExist == "1" ? true : false;
            var resItem;
            if (resData.length > 0) {
                resItem = resData[0];
                IsDOCreated = resItem.IsDOCreated;
                $("#Text_CarrierCode").closest('span').hide();
                $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySNo, resItem.CommodityCode == "" ? "" : resItem.CommodityCode + '-' + resItem.CommodityDescription);
                $("#Text_SubGroupCommodity").data("kendoAutoComplete").setDefaultValue(resItem.CommoditySubGroupSNo, resItem.SubGroupName);
                $("#Pieces").val(resItem.Pieces);
                $("#_tempPieces").val(resItem.Pieces);
                $("#GrossWt").val(resItem.GrossWeight);
                $("#_tempGrossWt").val(resItem.GrossWeight);
                $("#ChargeableWt").val(resItem.ChargeableWeight);
                $("#_tempChargeableWt").val(resItem.ChargeableWeight);
                $("#CBM").val(Number(resItem.CBM) == 0 ? "" : resItem.CBM);
                $("#_tempCBM").val(Number(resItem.CBM) == 0 ? "" : resItem.CBM);
                $("#VolumeWt").val(Number(resItem.VolumeWeight) == 0 ? "" : parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#_tempVolumeWt").val(Number(resItem.VolumeWeight) == 0 ? "" : parseFloat(resItem.VolumeWeight).toFixed(3));
                $("span[id='VolumeWt']").html(Number(resItem.VolumeWeight) == 0 ? "" : parseFloat(resItem.VolumeWeight).toFixed(3));
                $("#AWBNo").val(resItem.AWBNo);
                currentawbno = $("#AWBNo").val();
                currentprfix = currentawbno.split('-');
                if (currentprfix[0].toUpperCase() != 'UNK') {
                    $('#Text_UNKAWBNo').hide();
                }
                else {
                    cfi.AutoCompleteV2("UNKAWBNo", "AWBNo", "DeliveryOrderNew_UNKAWBNo", GetOriginDest, "contains");
                    $("#AWBNo").attr('class', 'k-input');
                    $("#AWBNo").removeAttr('data-valid-msg');
                    $("#AWBNo").removeAttr('data-valid');
                }

                $("#AWBDate").data("kendoDatePicker").value(resItem.AWBDate);
                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(resItem.ProductSNo, resItem.ProductName);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue(resItem.DestinationCity, resItem.DestinationCityName);
                $("#NoofHouse").val(resItem.NoOfHouse);

                //Added _tempNoofHouse By Rahul Kumar Singh To Resolve the hidden value of the HouseNO
                $("#_tempNoofHouse").val(resItem.NoOfHouse);
                $("#FlightDate").data("kendoDatePicker").value(resItem.FlightDate);
                $("#X-RayRequired[value='" + resItem.XRayRequired + "']").prop('checked', true);
                $("#FreightType[value='" + resItem.FreightType + "']").prop('checked', true);

                $("#Text_NatureofGoods").data("kendoAutoComplete").setDefaultValue(resItem.NatureOfGoodsSNo, resItem.NatureOfGoods);
                $("#NatureofGoods").val(resItem.NatureOfGoodsSNo);
                $("#NOGText").val(resItem.NOG);

                if (resItem.Text_NatureOfGoods.toUpperCase() == 'OTHER'.toUpperCase()) {
                    $("#OtherNOG").show();
                    $("#OtherNOG").val(resItem.NatureOfGoods);
                }

                $("#IssuingAgent").val(resItem.AgentName);
                $('#AWBDate').parent().css('width', '100px');
                $("[id^='chkDocReceived']").prop("checked", resItem.IsDocReceived == "" || resItem.IsDocReceived == 1 ? true : false);

                if (resItem.IsBup == "False") {
                    $("#chkisBup").prop('checked', false);
                }
                else {
                    $("#chkisBup").prop('checked', true);
                }

                $("#Text_buptype").data("kendoAutoComplete").setDefaultValue(resItem.BupTypeSNo, resItem.BupType);
                $("#Text_densitygroup").data("kendoAutoComplete").setDefaultValue(resItem.DensityGroupSNo, resItem.DensityGroupName);
                if (resItem.HouseCreated == 1)
                    $("#NoofHouse").attr("disabled", "disabled");
                else
                    $("#NoofHouse").attr("disabled", false);

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

            $("#SpecialHandlingCode").closest("td").find("div").css("overflow-x", "scroll").css("width", "200");
            $("div[id=divareaTrans_importfwb_fwbshipmentclasssphc]").not(':first').remove();

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
            $("div[id$='divareaTrans_importfwb_fwbshipmentclasssphc']").find("[id='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
                $(this).find("input[id^='Quantity']").attr("disabled", "disabled");
                cfi.Numeric($(this).find("input[id^='NetQuantity']").attr("id"), 2);
                $(this).find("input[id^='SPHC']").each(function () {
                    cfi.AutoCompleteByDataSource($(this).attr("name"), DGRSPHC);
                });

                $(this).find("input[id^='UnNo']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "UNNumber", "DeliveryOrderNew_UNNumber", ResetDGROtherDetails, "contains");
                    }
                });

                $(this).find("input[id^='ShippingName']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "ColumnSearch", "DeliveryOrderNew_ColumnSearch", ResetDGROtherDetails, "contains");
                    }
                });

                $(this).find("input[id^='Class']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "DeliveryOrderNew_ClassDivSub", null, "contains");
                    }
                });

                $(this).find("input[id^='SubRisk']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "DGR", "SubRisk", "SubRisk", ["SubRisk"], null, "contains");
                });

                $(this).find("input[id^='PackingGroup']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "DeliveryOrderNew_PackingGroup", null, "contains");
                    }
                });

                $(this).find("input[id^='Unit']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "Unit", "DeliveryOrderNew_Unit", null, "contains");
                    }
                });

                $(this).find("input[id^='PackingInst']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "DeliveryOrderNew_PackingInst", null, "contains");
                    }
                });

                $(this).find("input[id^='ERG']").each(function () {
                    if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                        cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "DeliveryOrderNew_ERGN", null, "contains");
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

            /************** NOG ***************/
            $("div[id='divareaTrans_importfwb_shipmentnog']").find("tr[id^='areaTrans_importfwb_shipmentnog']").each(function (i, row) {
                cfi.AutoCompleteV2($(row).find("input[id^='OtherNatureofGoods']").attr("name"), "CommodityCode", "DeliveryOrderNew_ONFG", EnableOtherNog, "contains");
                $(row).find("input[id^='Text_OtherNatureofGoods']").parent().parent().css('width', '200px');
                $(row).find("input[id^='NOG']").attr('disabled', 1);
                if (NOGData.length > 0) {
                    if (NOGData[i] != undefined) {
                        $("#" + $(row).find("input[id^='Text_OtherNatureofGoods']").attr("id")).data("kendoAutoComplete").setDefaultValue(NOGData[i].OtherNatureofGoods, NOGData[i].Text_OtherNatureofGoods);
                    }
                }
            });

            cfi.makeTrans("importfwb_shipmentnog", null, null, null, null, null, NOGData);// Bind NOG Data
            $("a[id^='ahref_NOGDetails']").unbind("click").bind("click", function () {
                var Pieces = parseInt($("#Pieces").val() || "0");
                var GrsWt = parseFloat($("#GrossWt").val() || "0");
                //var NatureofGd = $("#NatureofGoods").val() || "";
                var NatureofGd = ($("#Text_NatureofGoods").data("kendoAutoComplete").key() || "0");

                if (Pieces == 0 || GrsWt == 0 || parseInt(NatureofGd) <= 0) {
                    jAlert("Enter Pieces, Gross weight and Nature of Goods Details.", "Warning - Nature of Goods Details");
                    return false;
                }

                if ((($("#Text_NatureofGoods").data("kendoAutoComplete").value() || "") == "OTHER") && ($("#OtherNOG").val() == "")) {
                    jAlert("Enter Other Nature of Goods Details.", "Warning - Nature of Goods Details");
                    return false;
                }

                if (!$("#divareaTrans_importfwb_shipmentnog").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_importfwb_shipmentnog", "Nature of Goods Details", 650);
                }
                else {
                    $("#divareaTrans_importfwb_shipmentnog").data("kendoWindow").open();
                }

                var PcsRow = 0, WtRow = 0, NogRow = 0;
                $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id^='areaTrans_importfwb_shipmentnog']").each(function () {
                    if (parseInt(($(this).find("input[id^='Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='_tempPieces']").val() || 0) : ($(this).find("input[id^='Pieces']").val() || 0)) > 0) {
                        PcsRow += 1;
                    }
                    if (parseFloat(($(this).find("input[id^='NogGrossWt']").val() || 0) == 0 ? ($(this).find("input[id^='_tempNogGrossWt']").val() || 0) : ($(this).find("input[id^='NogGrossWt']").val() || 0)) > 0) {
                        WtRow += 1;
                    }
                    if (($(this).find("input[id^='NOG']").val() != "")) {
                        NogRow += 1;
                    }
                });

                var FirstNogRow = $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id='areaTrans_importfwb_shipmentnog']:first");
                if (parseInt(PcsRow) > 0 || parseInt(WtRow) > 0 || parseInt(NogRow) > 0) { } else {
                    FirstNogRow.find("input[id*='Pieces']").val(Pieces);
                    FirstNogRow.find("input[id*='NogGrossWt']").val(GrsWt);
                }

                var NogKey = $("#Text_NatureofGoods").data("kendoAutoComplete").key();
                var NogVal = $("#Text_NatureofGoods").data("kendoAutoComplete").value();
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").setDefaultValue(NogKey, NogVal);
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").enable(false);
                FirstNogRow.find("input[id^='NOG']").val($("#OtherNOG").val());
                FirstNogRow.find("input[id^='NOG']").attr('readonly', true);
            });

            $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id^='areaTrans_importfwb_shipmentnog']").each(function () {
                cfi.Numeric($(this).find("input[id^='Pieces']").attr("id"), 0);
                cfi.Numeric($(this).find("input[id^='NogGrossWt']").attr("id"), 3);
                if ($(this).find("input[id^='NOG_']").val() != "") {
                    $(this).find("input[id^='NOG_']").removeAttr('disabled');
                }
            });
            /************** NOG ***************/
            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                $("ahref_HSCode").show();
                $("a[id^='ahref_HSCode']").unbind("click").bind("click", function () {
                    var theDivHSCodeDetails = document.getElementById("divHSCodePopUp");
                    theDivHSCodeDetails.innerHTML = "";
                    var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><tbody class='ui-widget-content'>";
                    table += "<tr><td class='ui-widget-content first' style='text-align: left;'><table class='appendGrid ui-widget'><tbody class='ui-widget-content'><tr><td><label>HS Code 1: </label><div><input type='hidden' name='HSCode1' id='HSCode1' value=''><input type='text' class='' name='Text_HSCode1' id='Text_HSCode1' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 2: </label><div><input type='hidden' name='HSCode2' id='HSCode2' value=''><input type='text' class='' name='Text_HSCode2' id='Text_HSCode2' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 3: </label><div><input type='hidden' name='HSCode3' id='HSCode3' value=''><input type='text' class='' name='Text_HSCode3' id='Text_HSCode3' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 4: </label><div><input type='hidden' name='HSCode4' id='HSCode4' value=''><input type='text' class='' name='Text_HSCode4' id='Text_HSCode4' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td></tr><tr><td><label>HS Code 5: </label><div><input type='hidden' name='HSCode5' id='HSCode5' value=''><input type='text' class='' name='Text_HSCode5' id='Text_HSCode5' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 6: </label><div><input type='hidden' name='HSCode6' id='HSCode6' value=''><input type='text' class='' name='Text_HSCode6' id='Text_HSCode6' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 7: </label><div><input type='hidden' name='HSCode7' id='HSCode7' value=''><input type='text' class='' name='Text_HSCode7' id='Text_HSCode7' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 8: </label><div><input type='hidden' name='HSCode8' id='HSCode8' value=''><input type='text' class='' name='Text_HSCode8' id='Text_HSCode8' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><tr><td><label>HS Code 9: </label><div><input type='hidden' name='HSCode9' id='HSCode9' value=''><input type='text' class='' name='Text_HSCode9' id='Text_HSCode9' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 10: </label><div><input type='hidden' name='HSCode10' id='HSCode10' value=''><input type='text' class='' name='Text_HSCode10' id='Text_HSCode10' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 11: </label><div><input type='hidden' name='HSCode11' id='HSCode11' value=''><input type='text' class='' name='Text_HSCode11' id='Text_HSCode11' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td>&nbsp;</td></tr></table></td></tr>";
                    //<td><input type='submit' name='btnSavHSCodeData' id='btnSavHSCodeData' tabindex='21' onclick='SaveHSCode();' value='Save' class='btn btn-block btn-success btn-sm'></td></tr></table ></td ></tr > ";
                    table += "</tbody></table>";
                    theDivHSCodeDetails.innerHTML += table;

                    cfi.AutoCompleteV2("HSCode1", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode2", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode3", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode4", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode5", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode6", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode7", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode8", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode9", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode10", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    cfi.AutoCompleteV2("HSCode11", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains");
                    if (HSData.length > 0) {
                        var A = HSData[0]["HSCodeSNo"].split(",");
                        var B = HSData[0]["HSCode"].split(",");
                        for (var i = 0; i < A.length; i++) {
                            if (i <= 10) {
                                $("#Text_HSCode" + (i + 1)).data("kendoAutoComplete").setDefaultValue(A[i], B[i]);
                                $("#Text_HSCode" + (i + 1)).data("kendoAutoComplete").enable(false);
                            }
                        }
                    }
                    cfi.PopUp("divHSCodePopUp", "HS Code");
                });
                $("#ahref_NOGDetails").after("&nbsp;&nbsp;&nbsp;");
            }
            else {
                $("ahref_HSCode").hide();
            }
            cfi.makeTrans("importfwb_fwbshipmentitinerary", null, null, BindItenAutoComplete, ReBindItenAutoComplete, null, itenData);
            $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {
                $(this).find("input[id^='BoardPoint']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "AirportCode", "DeliveryOrderNew_BoardPoint", ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='offPoint']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "AirportCode", "DeliveryOrderNew_offPoint", ResetSelectedFlight, "contains");
                });
                $(this).find("input[id^='FlightNo']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "FlightNo", "DeliveryOrderNew_FlightNo", null, "contains");
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
            });

            $("#ChargeableWt").unbind("blur").bind("blur", function () {
                compareGrossVolValue();
            });

            $("#GrossWt").unbind("blur").bind("blur", function () {
                CalculateShipmentChWt(this);
            });
            $("#CBM").unbind("blur").bind("blur", function () {
                CalculateShipmentChWt(this);
            });

            $("#VolumeWt").unbind("blur").bind("blur", function () {
                CalculateShipmentCBM();
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
            }
            else {
                $("a[id^='ahref_ClassDetails']").hide();
            }

            //For Disable the FWB Info for FWB by rahul on 02-11-2017 for bug id 4607 
            if ($('#AWBNo').val().split('-')[0] == '126') {
                $("#Text_SubGroupCommodity").data("kendoAutoComplete").enable(false);
                $("#Text_ShipmentOrigin").data("kendoAutoComplete").enable(false);
                $("#Text_ShipmentDestination").data("kendoAutoComplete").enable(false);
                $("#Text_Product").data("kendoAutoComplete").enable(false);
                $("#AWBDate").data("kendoDatePicker").enable(false);
                $('#IssuingAgent').attr('disabled', true);
                $('#Pieces').attr('disabled', true);
                $('#GrossWt,#_tempGrossWt').attr('disabled', true);
                $('#_tempCBM').attr('disabled', true);
                $('#_tempChargeableWt').attr('disabled', true);
                $('#_tempVolumeWt').attr('disabled', true);
                $('#_tempVolumeWt').attr('disabled', true);
                $('#chkisBup').attr('disabled', true);
                $("#Text_buptype").data("kendoAutoComplete").enable(false);
                $("#Text_densitygroup").data("kendoAutoComplete").enable(false);
                $('[id^="ShipmentType"]').attr('disabled', true);
                $('[id^="FreightType"]').attr('disabled', true);
            }

            //--------added by rahul date: 2017-11-17 to disable itenary info in FWB-------------------------------------
            $("#BoardPoint").closest('table').find('input').each(function () {
                var id = $(this).attr('id')
                if (id.includes("Text_")) {
                    $("#" + id).data('kendoAutoComplete').enable(false);
                }
                if (id.includes("FlightDate")) {
                    $("#" + id).data('kendoDatePicker').enable(false);
                }
            })
            $(".icon-trans-plus-sign").unbind('click')
            $(".icon-trans-trash").unbind('click')
            //-------------------------------------------------------end-------------------------------------------
        },
        error: {
        }
    });
}

function ShowOtherNog(e) {
    if (($("#" + e).data("kendoAutoComplete").value() || "") == "OTHER") {
        $("#OtherNOG").show();
        //setTimeout(function () { $("#OtherNOG").focus() }, 200);
        $("#OtherNOG").attr("data-valid", "required").attr("data-valid-msg", "Enter Other Nature of Goods");
    } else {
        $("#OtherNOG").hide();
        $("#OtherNOG").val('');
        $("#OtherNOG").removeAttr("data-valid", "data-valid-msg");
    }
}

function CheckAWBStock(obj) {
    if (currentPomailSno == 0) {
        var AWBNo = $("#" + obj.id).val();
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetOriginDestAWBStock?AWBNo=" + AWBNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var fblData = jQuery.parseJSON(result);
                var resData = fblData.Table0;
                var resData1 = fblData.Table1;
                var resItem;
                if (resData.length > 0) {
                    resItem = resData[0];
                    resData1 = resData1[0]
                    if (resItem.ErrorNo == "1") {
                        ShowMessage('warning', 'Information!', "AWBNo not exist.", "bottom-right");
                        return false;
                    }
                    else {
                        $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resData1.OriginAirportSNo, resData1.OriginCityName);
                        $("#ShipmentOrigin").val(resData1.OriginAirportSNo);
                        $("#Text_ShipmentDestination").data("kendoAutoComplete").enable(true);
                        $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue('', '');
                        $("#Text_UNKAWBNo").data("kendoAutoComplete").setDefaultValue('', '');
                        $("#UNKAWBNo").val('');
                    }
                }
            }
        });
    }
}

function GetOriginDest() {
    var attahawbsno = $('#UNKAWBNo').val();
    if (attahawbsno != "") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetOriginDest?AttachAWBSNo=" + attahawbsno, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var fblData = jQuery.parseJSON(result);
                var resData = fblData.Table0;
                var resItem;
                if (resData.length > 0) {
                    resItem = resData[0];
                    $("#Text_ShipmentOrigin").data("kendoAutoComplete").enable(false);
                    $("#Text_ShipmentDestination").data("kendoAutoComplete").enable(false);
                    $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue(resItem.OriginCity, resItem.OriginCityName);
                    $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue(resItem.DestinationCity, resItem.DestinationCityName);
                    $("#Text_NatureofGoods").data("kendoAutoComplete").setDefaultValue(resItem.NatureOfGoodsSNo, resItem.NatureOfGoods);
                    $("#NatureofGoods").val(resItem.NatureOfGoodsSNo);
                    $("#NOGText").val(resItem.NOG);
                }
            }
        });
    }
}

function EnableOtherNog(e) {
    if (($("#" + e).data("kendoAutoComplete").value() || "") == "OTHER") {
        $("#" + e).closest("tr").find("input[id^='NOG']").removeAttr('disabled');
    } else {
        $("#" + e).closest("tr").find("input[id^='NOG']").val('');
        $("#" + e).closest("tr").find("input[id^='NOG']").attr('disabled', 1);
    }
}

function CalculateShipmentCBM() {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var volwt = ($("#VolumeWt").val() == "" ? 0 : parseFloat($("#VolumeWt").val()));
    var cbm = (volwt / 166.6667).toFixed(3);
    $("#CBM").val(Number(cbm) > 0 ? cbm.toString() : "");
    $("#_tempCBM").val(Number(cbm) > 0 ? cbm.toString() : "");
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
}

function CalculateShipmentChWt(obj) {
    var grosswt = ($("#GrossWt").val() == "" ? 0 : parseFloat($("#GrossWt").val()));
    var cbm = ($("#CBM").val() == "" ? 0 : parseFloat($("#CBM").val()));
    var volwt = cbm * 166.6667;
    if ($(obj).attr('id').toUpperCase() == "CBM") {
        $("span[id='VolumeWt']").text(Number(volwt) > 0 ? volwt.toFixed(3) : "");
        $("#VolumeWt").val(Number(volwt) > 0 ? volwt.toFixed(3) : "");
        $("#_tempVolumeWt").val(Number(volwt) > 0 ? volwt.toFixed(3) : "");
    }
    var chwt = grosswt > volwt ? grosswt : volwt;
    $("#ChargeableWt").val(chwt.toFixed(3).toString());
    $("#_tempChargeableWt").val(chwt.toFixed(3).toString());
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
            cfi.AutoCompleteV2($(this).attr("name"), "UNNumber", "DeliveryOrderNew_UnNo", ResetDGROtherDetails, "contains");
        }
    });

    $(elem).find("input[id^='ShippingName']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "ColumnSearch", "DeliveryOrderNew_ShippingName", ResetDGROtherDetails, "contains");
        }
    });

    $(elem).find("input[id^='Class']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "DeliveryOrderNew_Class", null, "contains");
        }
    });

    $(elem).find("input[id^='SubRisk']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "DeliveryOrderNew_SubRisk1", null, "contains");
        }
    });

    $(elem).find("input[id^='PackingGroup']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "DeliveryOrderNew_PackingGroup1", null, "contains");
        }
    });

    $(elem).find("input[id^='Unit']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "Unit", "DeliveryOrderNew_Unit1", null, "contains");
        }
    });

    $(elem).find("input[id^='PackingInst']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "DeliveryOrderNew_PackingInst1", null, "contains");
        }
    });

    $(elem).find("input[id^='ERG']").each(function () {
        if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "DeliveryOrderNew_ERGN1", null, "contains");
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
            cfi.AutoCompleteV2($(this).attr("name"), "UNNumber", "DeliveryOrderNew_UNNumber", ResetDGROtherDetails, "contains");
        });

        $(this).find("input[id^='ShippingName']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ColumnSearch", "DeliveryOrderNew_ShippingName", ResetDGROtherDetails, "contains");
        });

        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "DeliveryOrderNew_Class", null, "contains");
        });

        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "DeliveryOrderNew_SubRisk", null, "contains");
        });

        $(this).find("input[id^='PackingGroup']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "DeliveryOrderNew_PackingGroup", null, "contains");
        });

        $(this).find("input[id^='Unit']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "Unit", "DeliveryOrderNew_Unit", null, "contains");
        });

        $(this).find("input[id^='PackingInst']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "DeliveryOrderNew_PackingInst", null, "contains");
        });

        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "DeliveryOrderNew_ERGN", null, "contains");
        });

        $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px')
    });
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

function GetDGRDetails(e) {
    if ($("#divMultiSpecialHandlingCode").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    } else {
        GetDGRDetailsBySHC(($("#Multi_SpecialHandlingCode").val() == "" ? "" : $("#Multi_SpecialHandlingCode").val() + ",") + this.dataItem(e.item.index()).Key);
    }
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
                    }
                    else if (e == "Text_ShippingName") {
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
                NetQuantity: $(this).find("[id^='NetQuantity']").val().replace(".00", ""),
                Unit: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                Quantity: $(this).find("[id^='Quantity']").val().replace(".00", ""),
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

function GetDGRDetailsAfterDelete(obj) {
    GetDGRDetailsBySHC($("#Multi_SpecialHandlingCode").val());
    var GDRRemainingData = [];

    $("div[id$='areaTrans_importfwb_fwbshipmentclasssphc']").find("[id^='areaTrans_importfwb_fwbshipmentclasssphc']").each(function () {
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
                text_erg: $(this).find("input[type=hidden][id^='ERG']").val()
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
            cfi.AutoCompleteV2($(this).attr("name"), "UNNumber", "DeliveryOrderNew_UNNumber", ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='ShippingName']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ColumnSearch", "DeliveryOrderNew_ShippingName", ResetDGROtherDetails, "contains");
        });
        $(this).find("input[id^='Class']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "DeliveryOrderNew_Class", null, "contains");
        });
        $(this).find("input[id^='SubRisk']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "DeliveryOrderNew_SubRisk", null, "contains");
        });
        $(this).find("input[id^='PackingGroup']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "DeliveryOrderNew_PackingGroup", null, "contains");
        });
        $(this).find("input[id^='Unit']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "Unit", "DeliveryOrderNew_Unit", null, "contains");
        });
        $(this).find("input[id^='PackingInst']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "DeliveryOrderNew_PackingInst", null, "contains");
        });
        $(this).find("input[id^='ERG']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "DeliveryOrderNew_ERGN", null, "contains");
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
                        cfi.AutoCompleteV2($(this).attr("name"), "UNNumber", "DeliveryOrderNew_UNNumber", ResetDGROtherDetails, "contains");
                    });

                    $(this).find("input[id^='ShippingName']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "ColumnSearch", "DeliveryOrderNew_ShippingName", ResetDGROtherDetails, "contains");
                    });

                    $(this).find("input[id^='Class']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "ClassDivSub", "DeliveryOrderNew_Class", null, "contains");
                    });

                    $(this).find("input[id^='SubRisk']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "SubRisk", "DeliveryOrderNew_SubRisk", null, "contains");
                    });

                    $(this).find("input[id^='PackingGroup']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "PackingGroup", "DeliveryOrderNew_PackingGroup", null, "contains");
                    });

                    $(this).find("input[id^='Unit']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "Unit", "DeliveryOrderNew_Unit", null, "contains");
                    });

                    $(this).find("input[id^='PackingInst']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "PackingInst", "DeliveryOrderNew_PackingInst", null, "contains");
                    });

                    $(this).find("input[id^='ERG']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "ERGN", "DeliveryOrderNew_ERGN", null, "contains");
                    });

                    $(this).find("input[controltype='autocomplete']").closest('span').css('width', '70px');
                });

                $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("divareaTrans_importfwb_fwbshipmentclasssphc", "DGR Details", 1400);

                    // Use this to unbing click event of DGR when delete shc for future
                    $("span.k-delete").live("click", function () { GetDGRDetailsAfterDelete(this) });
                });
            }
            else {
                $("a[id^='ahref_ClassDetails']").unbind("click");
            }
        },
        error: {
        }
    });
}

function BindItenAutoComplete(elem, mainElem) {
    var totalRow = $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").length;
    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 != totalRow) {
            $(this).find("div[id^='transActionDiv']").hide();
        }

        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode", "DeliveryOrderNew_BoardPoint", ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode", "DeliveryOrderNew_offPoint", ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "FlightNo", "DeliveryOrderNew_FlightNo", null, "contains");
            }
        });
    });

    $(elem).find("input[id^='BoardPoint']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "AirportCode", "DeliveryOrderNew_BoardPoint", ResetSelectedFlight, "contains");
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
    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_BoardPoint']").closest('span').css('width', '');
    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_offPoint']").closest('span').css('width', '');
    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").find("input[id^='Text_FlightNo']").closest('span').css('width', '');
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
    $(elem).closest("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {
        $(this).find("input[id^='BoardPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode", "DeliveryOrderNew_BoardPoint", ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='offPoint']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "AirportCode", "DeliveryOrderNew_offPoint", ResetSelectedFlight, "contains");
            }
        });
        $(this).find("input[id^='FlightNo']").each(function () {
            if ($("#" + "Text_" + $(this).attr("name")).data("kendoAutoComplete") == undefined) {
                cfi.AutoCompleteV2($(this).attr("name"), "FlightNo", "DeliveryOrderNew_FlightNo", ValidateFlight, "contains");
            }
        });
    });
    $(elem).find("[id^='Text_offPoint']").data("kendoAutoComplete").enable(true);
    $(elem).find("[id^='FlightDate']").data("kendoDatePicker").enable(true);
    $(elem).find("[id^='Text_FlightNo']").data("kendoAutoComplete").enable(true);
    $(elem).find("input[id^='FlightDate']").data('kendoDatePicker').unbind("change").bind('change', function () { ResetSelectedFlight($(elem).find("input[id^='FlightDate']").attr("id")) });

    var totalRow = $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").length;
    $("div[id$='divareaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function (i, row) {
        if (i + 1 == totalRow) {
            $(this).find("div[id^='transActionDiv']").show();
        }
    });
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
            name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: 0, AutoCompleteName: 'DeliveryOrderNew_RateClass', filterField: 'RateClassCode'
        },
        {
            name: 'SLAC', display: 'SLAC', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
        },
        {
            name: "ULD", display: "ULD Type", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "50px" }, isRequired: true, AutoCompleteName: 'DeliveryOrderNew_RateClass', filterField: 'ULDName'
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
            name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, AutoCompleteName: 'DeliveryOrderNew_Country', filterField: 'CountryCode'
        },
        {
            name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: true
        }],
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
            name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "150px" }, isRequired: true, AutoCompleteName: 'DeliveryOrderNew_OtherCharge', filterField: 'OtherChargeCode'
        },
        {
            name: pageType == 'EDIT' ? 'DueType' : 'DueType', display: 'Due Carrier/Forwarder(Agent)', type: 'select', ctrlOptions: { 'A': 'Agent', 'C': 'Carrier' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
        },
        {
            name: 'Amount', display: 'Amount', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CalculateRateTotal();", }, isRequired: true, value: 0
        }],
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

function BindAWBRate() {
    cfi.AutoCompleteV2("AWBCurrency", "CurrencyCode", "DeliveryOrderNew_AWBCurrency", null, "contains");
    cfi.AutoCompleteV2("Currency", "CurrencyCode", "DeliveryOrderNew_Currency", null, "contains");
    cfi.AutoCompleteV2("ChargeCode", "AWBChargeCode", "DeliveryOrderNew_ChargeCode", null, "contains");
    cfi.AutoCompleteByDataSource("Valuation", WeightValuation, EnableDisableChargeField);
    cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);
    cfi.AutoCompleteV2("CDCCurrencyCode", "CurrencyCode", "DeliveryOrderNew_CDCCurrencyCode", CalculateConversionAmount, "contains");
    cfi.AutoCompleteV2("CDCDestCurrencyCode", "CurrencyCode", "DeliveryOrderNew_CDCDestCurrencyCode", CalculateConversionAmount, "contains");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetAWBRateDetails?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var RateArray = Data.Table0;
            var TACTRateArray = Data.Table1;
            if (RateArray.length > 0) {
                $("#Text_AWBCurrency").data("kendoAutoComplete").setDefaultValue(RateArray[0].AWBCurrencySNo, RateArray[0].CurrencyCode);
                $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDCurrencyCode, RateArray[0].CVDCurrencyCode);
                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDChargeCode, RateArray[0].CVDChargeCode);
                $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(RateArray[0].FreightType, RateArray[0].txtFreightType);
                $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(RateArray[0].CVDOtherCharges, RateArray[0].CVDOtherChargestext);
                $("#DecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(2));
                $("#_tempDecCarriageVal").val(RateArray[0].CVDDeclareCarriageValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCarriageValue).toFixed(2));
                $("#DecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(2));
                $("#_tempDecCustomsVal").val(RateArray[0].CVDDeclareCustomValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareCustomValue).toFixed(2));
                $("#Insurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(2));
                $("#_tempInsurance").val(RateArray[0].CVDDeclareInsurenceValue == "" ? "" : parseFloat(RateArray[0].CVDDeclareInsurenceValue).toFixed(2));
                $("#ValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(2));
                $("#_tempValuationCharge").val(RateArray[0].CVDValuationCharge == "" ? "" : parseFloat(RateArray[0].CVDValuationCharge).toFixed(2));
                $("#CVDTax").val(RateArray[0].CVDTax == "" ? "" : parseFloat(RateArray[0].CVDTax).toFixed(3));
                $("#_tempCVDTax").val(RateArray[0].CVDTax == "" ? "" : parseFloat(RateArray[0].CVDTax).toFixed(2));
                $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCCurrencyCode, RateArray[0].CDCCurrencyCode);
                $("#CDCConversionRate").val(RateArray[0].CDCCurrencyConversionRate == "" ? "" : parseFloat(RateArray[0].CDCCurrencyConversionRate).toFixed(6));
                $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(RateArray[0].CDCDestinationCurrencyCode, RateArray[0].CDCDestinationCurrencyCode);
                $("#CDCChargeAmount").val(RateArray[0].TotalCollectAmount == "" ? "" : parseFloat(RateArray[0].TotalCollectAmount).toFixed(2));
                $("#_tempCDCChargeAmount").val(RateArray[0].TotalCollectAmount == "" ? "" : parseFloat(RateArray[0].TotalCollectAmount).toFixed(2));
                $("#CDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(2));
                $("#_tempCDCTotalCharAmount").val(RateArray[0].CDCTotalChargeAmount == "" ? "" : parseFloat(RateArray[0].CDCTotalChargeAmount).toFixed(2));
                $("#TotalFreight").val(RateArray[0].TotalPrepaidAmount);
                $("#_tempTotalFreight").val(RateArray[0].TotalPrepaidAmount);
                $("#TotalAmount").val(RateArray[0].TotalCollectAmount);
                $("#_tempTotalAmount").val(RateArray[0].TotalCollectAmount);

                if ($("#Text_Valuation").data("kendoAutoComplete").key() == "CC") {
                    $('#CDCChargeAmount').removeAttr('disabled');
                    $('#CDCTotalCharAmount').removeAttr('disabled');
                    $('#Text_CDCCurrencyCode').removeAttr('disabled');
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
                ISNumeric(this);
            });
        },
        error: {
        }
    });
}

function CalculateConversionAmount(valueId, value, keyId, key) {
    var total = $("#TotalAmount").val() == "" ? 0 : $("#TotalAmount").val();
    var FromCurrency = $("#Text_CDCCurrencyCode").data("kendoAutoComplete").key();
    var ToCurrency = $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetExchangeRate", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FromCurrency: FromCurrency, ToCurrency: ToCurrency }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var conversionRate = resData.Table0[0].Rate;
            var totalAmount = parseFloat(total) * parseFloat(conversionRate);
            $("#CDCConversionRate").val(conversionRate);
            $("#CDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
            $("#_tempCDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
        },
        error: function (xhr) {
            var ex = xhr;
        }
    });
}

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
        {//, disabled: 1
            name: 'NoOfPieces', display: 'Pieces', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 5 }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'GrossWeight', display: 'Gr. Wt.', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: pageType == 'EDIT' ? 'WeightCode' : 'WeightCode', display: 'Wt. Code', type: 'select', ctrlOptions: { 'K': 'Kg', 'L': 'L' }, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
        },
        {
            name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, AutoCompleteName: 'DeliveryOrderNew_RateClassCode', filterField: 'RateClassCode'
        },
        {
            name: 'CommodityItemNumber', display: 'Com. Item No.', type: 'text', value: 0, ctrlCss: { width: '100px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, }, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'ChargeableWeight', display: 'Ch. Wt.', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: false, value: 0
        },
        {
            name: 'Charge', display: 'Rate', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, }, isRequired: false, value: 0
        },
        {
            name: 'ChargeAmount', display: 'Freight Amt.', type: 'decimal3', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, }, isRequired: false, value: 0
        },
        {
            name: 'HarmonisedCommodityCode', display: 'H S Code', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 18, onBlur: "CheckLength(this)", onkeypress: "ISNumeric(this);", }, isRequired: false, value: 0
        },
        {
            name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: false, AutoCompleteName: 'DeliveryOrderNew_Country', filterField: 'CountryCode'
        },
        {
            name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }
        },
        {
            name: 'ConsolDesc', display: 'Consol Desc.', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: false
        },
        {
            name: 'hdnChildData', type: 'hidden', value: 0
        },
        {
            name: 'Dimension', display: 'Dimension', type: 'custom',
            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
                var ctrl = document.createElement('span');
                $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_btnDimension', value: 'Dimension', onclick: ' PopupDiv(this)' }).css('width', '75px').appendTo(ctrl).button();
                return ctrl;
            }
        }],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            if (addedRowIndex == 0) {
                var Pieces = $("#Pieces").val();
                var GrossWt = $("#GrossWt").val();
                if ($("#tblAWBRateDesription_NoOfPieces_" + addedRowIndex).val() != 0) {
                    $(caller).appendGrid('setCtrlValue', 'NoOfPieces', addedRowIndex, Pieces);
                }
                if ($("#tblAWBRateDesription_GrossWeight_" + addedRowIndex).val() != 0) {
                    $(caller).appendGrid('setCtrlValue', 'NoOfPieces', addedRowIndex, Pieces);
                    $(caller).appendGrid('setCtrlValue', 'GrossWeight', addedRowIndex, GrossWt);
                }
            }
        },
        customFooterButtons: [
            { uiButton: { label: 'Get Rate', text: true }, btnAttr: { title: 'Get Rate' }, click: function (evt) { SearchData(this) }, atTheFront: true },
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true }
    });
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
            name: "RateClassCode", display: "Rate Class", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: 0, AutoCompleteName: 'DeliveryOrderNew_RateClassCode', filterField: 'RateClassCode'
        },
        {
            name: 'SLAC', display: 'SLAC', type: 'text', value: 0, ctrlCss: { width: '40px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, }, onChange: function (evt, rowIndex) { }
        },
        {
            name: "ULD", display: "ULD Type", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "50px" }, isRequired: true, AutoCompleteName: 'DeliveryOrderNew_ULD', filterField: 'ULDName'
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
            name: "Country", display: "Country", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: false, AutoCompleteName: 'DeliveryOrderNew_Country', filterField: 'CountryCode'
        },
        {
            name: 'NatureOfGoods', display: 'Nature Of Goods', type: 'text', ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { Controltype: 'alphanumericupper', maxlength: 20 }, isRequired: true
        }],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }
    });
}

function SearchData(obj) {
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");
    var testData = $('#tblAWBRateDesription').appendGrid('getStringJson');
    if (testData == "[]" || testData == false) {
        ShowMessage('warning', 'Information!', "Rate Not Found");
        return false;
    }

    if ($('#tdFlightDate').text().trim() == "" && FlightDateForGetRate == "") {
        jAlert("Please provide Flight Date & Flight No. to proceed.", "Get Rate");
        return false;
    }

    var flightdt = $('#tdFlightDate').text().trim() == "" ? FlightDateForGetRate : $('#tdFlightDate').text();
    var m = "0" + parseInt(months.indexOf(flightdt.split('-')[1].toLowerCase()) + parseInt(1));
    var d = "0" + flightdt.split('-')[0].trim();
    var AirlinePrefix = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[1].trim() || "514" : $('#tdFlightNo').text().split('-')[0].trim() || "514";
    var CarCode = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[0].trim() || "G9" : $('#Text_FlightNo').val().split('-')[0] || "G9";
    var FlightNo = $('#tdFlightNo').text() == "" ? FlightNoForGetRate.split('-')[1].trim() || "G9" : $('#tdFlightNo').text().split('-')[1].trim() || "";

    PushArray = [];
    if ($("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").length > 0) {
        $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function (i, row) {
            var dd = {
                "lNOP": $(row).find("[id^='tblAWBRateDesription_NoOfPieces_']").val(),
                "lWeight": $(row).find("[id^='tblAWBRateDesription_GrossWeight_']").val(),
                "lWeightCode": $(row).find("[id^='tblAWBRateDesription_WeightCode_']").val(),
                "lNOG": $(row).find("[id^='tblAWBRateDesription_NatureOfGoods_']").val() || "General",
                "lOrigin": $("#tdOD").text().split('-')[0].trim(),
                "lDestination": $("#tdOD").text().split('-')[1].trim(),
                "lAirlinePrefix": AirlinePrefix,
                "lCarrierCode": CarCode,
                "lFlightNumber": FlightNo,
                "lFlightdate": d.substring(d.length - 2, d.length) + '/' + m.substring(m.length - 2, m.length) + '/' + flightdt.split('-')[2],
                "lFlightCarrierCode": $('#Text_FlightNo').val().split('-')[0] || "GA",
                "lCurrencyCode": userContext.CurrencyCode,
                "lRateType": "BOTH"
            };
            PushArray.push(dd);
        });
    }

    var req = { "lText": JSON.stringify(PushArray) }
    $.ajax({
        type: "POST",
        cache: false,
        url: userContext.SysSetting.CRAServiceURL + 'WebServiceGetRates.asmx/GetMultipleRTDRates',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(req),
        success: function (data) {
            //alert(JSON.stringify(data));
            var ChargeArray = JSON.parse(data.d).Airwaybill_ChargeLines;
            var OtherData = JSON.parse(data.d).Airwaybill_Other_Charges;
            var OtherCharge = [];
            if (ChargeArray != undefined && ChargeArray.length > 0) {
                $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function (i, row) {
                    $(row).find("input[id^='_temptblAWBRateDesription_ChargeableWeight_']").val(ChargeArray[i]["Display_ChargeableWeight"]);
                    $(row).find("input[id^='tblAWBRateDesription_ChargeableWeight_']").val(ChargeArray[i]["Display_ChargeableWeight"]);
                    $(row).find("input[id^='_temptblAWBRateDesription_Charge_']").val(ChargeArray[i]["Display_RateOrCharge"]);
                    $(row).find("input[id^='tblAWBRateDesription_Charge_']").val(ChargeArray[i]["Display_RateOrCharge"]);
                    $(row).find("input[id^='_temptblAWBRateDesription_ChargeAmount_']").val(ChargeArray[i]["Display_TotalChargeAmount"]);
                    $(row).find("input[id^='tblAWBRateDesription_ChargeAmount_']").val(ChargeArray[i]["Display_TotalChargeAmount"]);

                    $(row).find("input[id^='tblAWBRateDesription_RateClassCode_']").data("kendoAutoComplete").setDefaultValue(ChargeArray[i].Display_RateClassShortCode, ChargeArray[i].Display_RateClassShortCode);
                    $(row).find("button[id^='tblAWBRateDesription_Delete_']").remove();
                });
            }

            if (ChargeArray.length > 1) {
                var tactdata = {
                    AWBSNo: currentawbsno,
                    BaseOn: ChargeArray[1].Based_On,
                    ChargeableWeight: ChargeArray[1].Display_ChargeableWeight,
                    CommodityItemNumber: ChargeArray[1].Display_CommodityItemNumber,
                    GrossWeight: ChargeArray[1].Display_GrossWeight,
                    NatureOfGoods: ChargeArray[1].Display_NOGDIMS,
                    NoOfPieces: ChargeArray[1].Display_NOPRCP,
                    RateClassCode: ChargeArray[1].Display_RateClassShortCode,
                    Charge: ChargeArray[1].Display_RateOrCharge,
                    ChargeAmount: ChargeArray[1].Display_TotalChargeAmount,
                    WeightCode: ChargeArray[1].Display_UnitOfGrossWeight,
                }
                TactArray.push(tactdata);

                if ($("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").length > 0) {
                    $("#tblAWBRateDesription > tfoot > tr > td ").find("span[id^='spanTactRate']").text("TACT Rate: " + ChargeArray[1].Display_RateOrCharge);
                } else {
                    $("#tblAWBRateDesription > tfoot > tr > td > button:nth-child(1)").after("<span class='ui-button-text' id='spanTactRate' id='spanTactRate'>TACT Rate: " + ChargeArray[1].Display_RateOrCharge + "</span>");
                }
            }

            if (OtherData != undefined && OtherData.length > 0) {
                for (i = 0; i < OtherData.length; i++) {
                    var otherinfo = {
                        Type: OtherData[i]["PC_Indicator"],
                        OtherCharge: OtherData[i]["Code"],
                        DueType: OtherData[i]["Entitlement_Code"],
                        Amount: OtherData[i]["Charge_Amount"]
                    };
                    OtherCharge.push(otherinfo);
                }
                $("#tblAWBRateOtherCharge").appendGrid('load', OtherCharge);
                $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function (i, row) {
                    $(row).find("input[id^='_temptblAWBRateOtherCharge_Amount_']").val(OtherCharge[i]["Amount"]);
                    $(row).find("button[id^='tblAWBRateOtherCharge_Delete_']").remove();
                });
            }
            CalculateRateTotal();
        },
        error: function (a, b) {
            ShowMessage('warning', 'Information!', "Rate Not Found");
        }
    });
}

function CleaeCity(valueId, value, keyId, key) {
    if (valueId.indexOf("SHIPPER") > -1) {
        $("#Text_SHIPPER_City").val('');
    }
    if (valueId.indexOf("CONSIGNEE") > -1) {
        $("#Text_CONSIGNEE_City").val('');
    }
    if (valueId.indexOf("Notify") > -1) {
        $("#Text_Notify_City").val('');
    }
}

function BindCustomerInfo() {
    cfi.AutoCompleteV2("SHIPPER_AccountNo", "CustomerNo", "DeliveryOrderNew_SHIPPER_AccountNo", GetShipperConsigneeDetails, "contains");
    cfi.AutoCompleteV2("SHIPPER_CountryCode", "CountryCode,CountryName", "DeliveryOrderNew_SHIPPER_CountryCode", CleaeCity, "contains");
    cfi.AutoCompleteV2("SHIPPER_City", "CityCode,CityName", "DeliveryOrderNew_SHIPPER_City", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_AccountNo", "CustomerNo", "DeliveryOrderNew_CONSIGNEE_AccountNo", GetShipperConsigneeDetails, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_CountryCode", "CountryCode,CountryName", "DeliveryOrderNew_CONSIGNEE_CountryCode", CleaeCity, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_City", "CityCode,CityName", "DeliveryOrderNew_CONSIGNEE_City", null, "contains");
    cfi.AutoCompleteV2("Notify_CountryCode", "CountryCode,CountryName", "DeliveryOrderNew_Notify_CountryCode", CleaeCity, "contains");
    cfi.AutoCompleteV2("Notify_City", "CityCode,CityName", "DeliveryOrderNew_Notify_City", null, "contains");

    $("#SHIPPER_MobileNo").css("text-align", "left");
    $("#_tempSHIPPER_MobileNo").css("text-align", "left");
    $("#CONSIGNEE_MobileNo").css("text-align", "left");
    $("#_tempCONSIGNEE_MobileNo").css("text-align", "left");
    $("#Notify_MobileNo").css("text-align", "left");
    $("#_tempNotify_MobileNo").css("text-align", "left");
    $("#Notify_Fax").css("text-align", "left");
    $("#_tempNotify_Fax").css("text-align", "left");

    $("#SHIPPER_MobileNo").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#CONSIGNEE_MobileNo").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#SHipper_Fax").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#CONSIGNEE_Fax").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });

    $("#Notify_Fax").unbind("keypress").bind("keypress", function () {
        ISNumeric(this);
    });
    //Added for tax id by akhtar
    if (userContext.SysSetting.IsTaxIdShownOn == "0" || userContext.SysSetting.IsTaxIdShownOn == undefined) {
        $("#spnShipperTaxId").hide();
        $("#spnCosigneeTaxid").hide();
        $("#SHP_TaxId").hide();
        $("#CON_TaxId").hide();
        $("#chkshippertaxid").hide();
        $("#chkconsigneetaxid").hide();
    }
    else {
        $("#spnShipperTaxId").show();
        $("#spnCosigneeTaxid").show();
        $("#SHP_TaxId").show();
        $("#CON_TaxId").show();
        $("#chkshippertaxid").show();
        $("#chkconsigneetaxid").show();
    }
    AllowedSpecialChar("CONSIGNEE_AccountNoName");
    AllowedSpecialChar("CONSIGNEE_Street");
    AllowedSpecialChar("CONSIGNEE_TownLocation");
    AllowedSpecialChar("CONSIGNEE_State");

    AllowedSpecialChar("SHIPPER_Name");
    AllowedSpecialChar("SHIPPER_Street");
    AllowedSpecialChar("SHIPPER_TownLocation");
    AllowedSpecialChar("SHIPPER_State");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetShipperAndConsigneeInformation?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
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
                    $("#chkSHIPPER_AccountNo").closest('td').hide();
                }

                $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                $("#_tempSHIPPER_Name").val(shipperData[0].ShipperName);
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
                $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                $("#_tempSHIPPER_Name2").val(shipperData[0].ShipperName2);
                $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                $("#SHP_TaxId").val(shipperData[0].TaxID);
                $("#_tempSHP_TaxId").val(shipperData[0].TaxID);
            }

            if (consigneeData.length > 0) {
                //$("[id^='FWB_Consignee']").prop("checked", consigneeData[0].IsConsignee == 0 ? false : true);
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                if (consigneeData[0].ConsigneeAccountNo != "") {
                    $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                }

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
                $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                $("#_tempCONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                $("#CON_TaxId").val(consigneeData[0].TaxID);
                $("#_tempCON_TaxId").val(consigneeData[0].TaxID);
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
                $("#Notify_Name2").val(notifyData[0].CustomerName2),
                    $("#_tempNotify_MobileNo").val(notifyData[0].Phone);
                $("#Notify_Address").val(notifyData[0].Location);
                $("#Notify_Address2").val(notifyData[0].Street2);
                $("#Notify_State").val(notifyData[0].State);
                $("#Notify_Place").val(notifyData[0].Street);
                $("#Notify_PostalCode").val(notifyData[0].PostalCode);
                $("#Notify_Fax").val(notifyData[0].Fax);
                $("#_tempNotify_Fax").val(notifyData[0].Fax);
                $("#Notify_MobileNo2").val(notifyData[0].Telex);
                $("#_tempNotify_MobileNo2").val(notifyData[0].Telex);
            }

            if (nominyData.length > 0) {
                $('#Nominate_Name').val(nominyData[0].NOMName);
                $('#Nominate_Place').val(nominyData[0].NOMPlace);
            }

            if (userContext.SpecialRights.DOS == true) {
                $("input[id='FWBShipper']").show();
                $("span[id='spnFWBShipper']").show();
            }
            else {
                $("input[id='FWBShipper']").hide();
                $("span[id='spnFWBShipper']").hide();
            }

            if (userContext.SpecialRights.DOC == true) {
                $("input[id='FWB_Consignee']").show();
                $("span[id='spnFWB_Consignee']").show();
            }
            else {
                $("input[id='FWB_Consignee']").hide();
                $("span[id='spnFWB_Consignee']").hide();
            }
            ///Nayak 30-08-2019
            $("input[id='FWB_Consignee']").attr('title', 'Click to Create/Update Consignee Master');
            $("input[id='spnFWB_Consignee']").attr('title', 'Click to Create/Update Consignee Master');
            $("input[id='FWBShipper']").attr('title', 'Click to Create/Update Shipper Master');
            $("input[id='spnFWBShipper']").attr('title', 'Click to Create/Update Shipper Master');
            $("input[id='chkshippertaxid']").attr('title', 'Click to Create/Update Tax Id of Customer');
            $("input[id='chkconsigneetaxid']").attr('title', 'Click to Create/Update Tax Id of Customer');

            //Added By Rahul to handle Tabbing in FWB Customer Info on 23 Jan 2018
            $('#btnSave').attr('tabindex', '74');
            $('#btnSaveToNext').attr('tabindex', '75');
            $('#btnCancel').attr('tabindex', '76');
        },
        error: {
        }
    });
}
///added by akhtar
function GetShipperConsigneeDetails_tax(usertype) {
    //alert(usertype);
    var CreateShipperTaxParticipants = $("#chkshippertaxid").prop("checked") ? "1" : "0";
    var CreateConsigneerTaxParticipants = $("#chkconsigneetaxid").prop("checked") ? "1" : "0";
    var UserTyp = usertype;
    var checkTaxIdResult = true;
    var consigneecountry = $("#CONSIGNEE_CountryCode").val() == "" ? "0" : $("#CONSIGNEE_CountryCode").val();
    var shippercountry = $("#SHIPPER_CountryCode").val() == "" ? "0" : $("#SHIPPER_CountryCode").val();
    var IsGetRecords = "1";
    var TaxId = UserTyp == "C" ? ($("#CON_TaxId").val()) : ($("#SHP_TaxId").val());
    if (UserTyp == "C") {
        if (CreateConsigneerTaxParticipants == "1" && TaxId != "")//&& $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key()==""
        {
            checkTaxIdResult = CheckTaxId(TaxId, 'C', consigneecountry);
            IsGetRecords = "0";
        }
        else
            IsGetRecords = "1";

    }
    else if (UserTyp == "S") {
        if (CreateShipperTaxParticipants == "1" && TaxId != "")//&& $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key()==""
        {
            checkTaxIdResult = CheckTaxId(TaxId, 'S', shippercountry);
            IsGetRecords = "0";
        }
        else
            IsGetRecords = "1";
    }

    if (checkTaxIdResult == true) {
        if (TaxId != "" && IsGetRecords == "1") {
            $.ajax({
                url: "Services/Import/ImportFWBService.svc/GetShipperAndConsigneeInformation_TaxId?AWBSNo=" + currentawbsno + "&UserType=" + UserTyp + "&TaxId=" + TaxId, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var shipperData = Data.Table0;

                    if (shipperData.length > 0) {
                        if (UserTyp == "S") {
                            $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                            if (shipperData[0].ShipperAccountNo != "") {
                                $("#chkSHIPPER_AccountNo").closest('td').hide();
                            }

                            $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                            $("#_tempSHIPPER_Name").val(shipperData[0].ShipperName);
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
                            $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                            $("#_tempSHIPPER_Name2").val(shipperData[0].ShipperName2);
                            $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                            $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                            $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                            $("#SHP_TaxId").val(shipperData[0].TaxID);
                            $("#_tempSHP_TaxId").val(shipperData[0].TaxID);
                        }
                        else if (UserTyp == "C") {
                            $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ConsigneeAccountNo, shipperData[0].CustomerNo);
                            if (shipperData[0].ConsigneeAccountNo != "") {
                                $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            }

                            $("#CONSIGNEE_AccountNoName").val(shipperData[0].ConsigneeName);
                            $("#CONSIGNEE_Street").val(shipperData[0].ConsigneeStreet);
                            $("#CONSIGNEE_TownLocation").val(shipperData[0].ConsigneeLocation);
                            $("#CONSIGNEE_State").val(shipperData[0].ConsigneeState);
                            $("#CONSIGNEE_PostalCode").val(shipperData[0].ConsigneePostalCode);
                            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ConsigneeCity, shipperData[0].CityCode + '-' + shipperData[0].ConsigneeCityName);
                            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ConsigneeCountryCode, shipperData[0].CountryCode + '-' + shipperData[0].ConsigneeCountryName);
                            $("#CONSIGNEE_MobileNo").val(shipperData[0].ConsigneeMobile);
                            $("#_tempCONSIGNEE_MobileNo").val(shipperData[0].ConsigneeMobile);
                            $("#CONSIGNEE_Email").val(shipperData[0].ConsigneeEMail);
                            $("#CONSIGNEE_Fax").val(shipperData[0].Fax);
                            $("#_tempCONSIGNEE_Fax").val(shipperData[0].Fax);
                            $("#CONSIGNEE_AccountNoName2").val(shipperData[0].ConsigneeName2);
                            $("#CONSIGNEE_Street2").val(shipperData[0].ConsigneeStreet2);
                            $("#CONSIGNEE_MobileNo2").val(shipperData[0].ConsigneeMobile2);
                            $("#_tempCONSIGNEE_MobileNo2").val(shipperData[0].ConsigneeMobile2);
                            $("#CON_TaxId").val(shipperData[0].TaxID);
                            $("#_tempCON_TaxId").val(shipperData[0].TaxID);
                        }

                    }
                    else {
                        if (UserTyp == "S") {
                            ShowMessage('warning', 'Information!', " TAX ID is not associated with any participant.");
                            $("#SHP_TaxId").val('');
                            $("#_tempSHP_TaxId").val('');


                        }
                        else if (UserTyp == "C") {
                            ShowMessage('warning', 'Information!', " TAX ID is not associated with any participant.");
                            $("#CON_TaxId").val('');
                            $("#_tempCON_TaxId").val('');

                        }
                    }

                },
                error: {

                }
            });
        }

    }
    else {
        if (UserTyp == "S") {
            ShowMessage('warning', 'Information!', "Already used TAX ID");
            $("#SHP_TaxId").val('');
            $("#_tempSHP_TaxId").val('');
        }
        else {
            ShowMessage('warning', 'Information!', "Already used TAX ID");
            $("#CON_TaxId").val('');
            $("#_tempCON_TaxId").val('');
        }
    }
}


function CheckTaxId(id, UType, CountrySno) {
    var CheckTaxIdResult = true;
    $.ajax({
        url: "Services/Import/ImportFWBService.svc/CheckTaxID",
        async: false,
        type: "GET",
        dataType: "json",
        data: { TaxId: id, UserType: UType, CountrySno: CountrySno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result == "1") {
                        CheckTaxIdResult = false;
                    }
                    else {
                        CheckTaxIdResult = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return CheckTaxIdResult;
}
///end/////
function BindAWBSummary(isdblclick) {
    cfi.AutoCompleteV2("OPIAirportCity", "AirportCode", "DeliveryOrderNew_OPIAirportCity", null, "contains");
    cfi.AutoCompleteV2("OPIOfficeDesignator", "Code", "DeliveryOrderNew_OPIOfficeDesignator", "", null, "contains");
    cfi.AutoCompleteV2("OPIOtherAirportCity", "AirportCode", "DeliveryOrderNew_OPIOtherAirportCity", null, "contains");
    cfi.AutoCompleteV2("REFOthAirportCityCode", "AirportCode", "DeliveryOrderNew_REFOthAirportCityCode", null, "contains");
    cfi.AutoCompleteV2("ISUPlace", "CityCode", "DeliveryOrderNew_ISUPlace", null, "contains");

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
                $("#_tempOPIParticipantCode").val(SummaryArray[0].OPIParticipantCode);
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
                $("#_tempREFParticipantCode").val(SummaryArray[0].REFParticipantCode);
                $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").setDefaultValue(SummaryArray[0].REFOtherAirportCityCode, SummaryArray[0].REFOtherAirportCityCode);
                $("#CORCustomsOriginCode").val(SummaryArray[0].CORCustomsOriginCode);
            }

            if (SenderRefArray.length > 0) {
                if ($("#Text_REFAirportCityCode").data("kendoAutoComplete").key() == "") {
                    $("#Text_REFAirportCityCode").data("kendoAutoComplete").setDefaultValue(AirportCityData[0]["Key"], AirportCityData[0]["Key"]);
                }

                if ($("#Text_REFOfficeDesignator").data("kendoAutoComplete").key() == "") {
                    $("#Text_REFOfficeDesignator").data("kendoAutoComplete").setDefaultValue(OfficeDesignatorData[0]["Key"], OfficeDesignatorData[0]["Key"]);
                }

                if ($("#Text_REFCompDesignator").data("kendoAutoComplete").key() == "") {
                    $("#Text_REFCompDesignator").data("kendoAutoComplete").setDefaultValue(CompanyDesignatorData[0]["Key"], CompanyDesignatorData[0]["Key"]);
                }
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
                        $("#SHP_TaxId").val(shipperConsigneeData[0].TaxID);
                        $("#_tempSHP_TaxId").val(shipperConsigneeData[0].TaxID);
                    }
                    else if (UserTyp == "C") {
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
                        $("#CON_TaxId").val(shipperConsigneeData[0].TaxID);
                        $("#_tempCON_TaxId").val(shipperConsigneeData[0].TaxID);
                    }
                }
                else {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#SHIPPER_Email").val('');
                        $("#SHP_TaxId").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_Email").val('');
                        $("#CON_TaxId").val('');
                    }
                }
            },
            error: {

            }
        });
    }
}

function BindHandlingInfoDetails() {
    cfi.AutoCompleteV2("CountryCode", "CountryCode,CountryName", "DeliveryOrderNew_CountryCode", null, "contains");
    cfi.AutoCompleteV2("InfoType", "InformationCode,Description", "DeliveryOrderNew_InfoType", null, "contains");
    cfi.AutoCompleteV2("CSControlInfoIdentifire", "CustomsCode,Description", "DeliveryOrderNew_CSControlInfoIdentifire", null, "contains");

    $.ajax({
        url: "Services/Import/ImportFWBService.svc/GetOSIInfoAndHandlingMessage?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
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
                        cfi.AutoCompleteV2($(this).attr("name"), "CountryCode,CountryName", "DeliveryOrderNew_CountryCode", null, "contains");
                    });

                    $(this).find("input[id^='InfoType']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "InformationCode,Description", "DeliveryOrderNew_InfoType", null, "contains");
                    });

                    $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "CustomsCode,Description", "DeliveryOrderNew_CustomsOCIe", null, "contains");
                    });
                });

                $("div[id$='divareaTrans_importfwb_fwbshipmentocitrans']").find("[id^='areaTrans_importfwb_fwbshipmentocitrans']").find("span[class^='k-dropdown-wrap']").removeAttr("style")
            }
        },
        error: {

        }
    });
}

function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CountryCode,CountryName", "DeliveryOrderNew_CountryCode", null, "contains");
        $(this).closest("tr").find("span[class='k-dropdown-wrap k-state-default']").prop("width", "100px");
    });
    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "InformationCode,Description", "DeliveryOrderNew_InfoType", null, "contains");
    });
    $(elem).find("input[id^='CSControlInfoIdentifire']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CustomsCode,Description", "DeliveryOrderNew_CSControlInfoIdentifire", null, "contains");
    });
}

function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_importfwb_fwbshipmentocitrans']").find("[id^='areaTrans_importfwb_fwbshipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwb_CountryCode");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwb_InfoType");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwb_CSControlInfoIdentifire");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function CalculateRateTotal() {
    CalculateChargeAmt();
    var FrieghtType = "";
    var TotalPrepaid = 0;
    var TotalCollect = 0;
    if ($("#Text_Valuation").data("kendoAutoComplete").key() == "") {
        $.ajax({
            url: "Services/Import/ImportFWB.svc/GetFieldsFromTable?Fields=IsFreightPrepaid&Table=AWB&AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Frieghtdata = jQuery.parseJSON(result);
                FrieghtType = Frieghtdata.Table[0]["IsFreightPrepaid"] = true ? "PP" : "CC";
                if (FrieghtType = "PP") {
                    $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue("PP", "Prepaid");
                } else {
                    $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue("CC", "Collect");
                }
            },
            error: {

            }
        });
    }
    else {
        FrieghtType = $("#Text_Valuation").data("kendoAutoComplete").key();
    }

    var _rateAmt = 0;
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        _rateAmt += parseFloat($(this).find("[id^='tblAWBRateDesription_ChargeAmount_']").val() || "0");
    });

    if (FrieghtType == "PP") {
        TotalPrepaid = _rateAmt;
    } else {
        TotalCollect = _rateAmt;
    }

    $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function () {
        if ($(this).find("[id^='tblAWBRateOtherCharge_Type_']").val() == "P") {
            TotalPrepaid += parseFloat($(this).find("[id^='tblAWBRateOtherCharge_Amount_']").val() || "0");
        } else if ($(this).find("[id^='tblAWBRateOtherCharge_Type_']").val() == "C") {
            TotalCollect += parseFloat($(this).find("[id^='tblAWBRateOtherCharge_Amount_']").val() || "0");
        }
    });
    CalculateTotalAmount();
}

function CalculateTotalAmount() {
    var total = $("#TotalAmount").val() == "" ? 0 : $("#TotalAmount").val();
    var conversionRate = $("#CDCConversionRate").val() == "" ? 0 : $("#CDCConversionRate").val();
    var totalAmount = parseFloat(total) * parseFloat(conversionRate);

    $("#CDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
    $("#_tempCDCTotalCharAmount").val(totalAmount.toFixed(2).toString());
}

function CalculateChargeAmt() {
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        if ($(this).find("[type='button'][id*='tblAWBRateDesription_Delete']").length > 0) {
            var CharWt = ($(this).find("input[id^='tblAWBRateDesription_ChargeableWeight']").val() || "0") == "0" ? ($(this).find("input[id^='_temptblAWBRateDesription_ChargeableWeight']").val() || "0") : ($(this).find("input[id^='tblAWBRateDesription_ChargeableWeight']").val() || "0");
            var Charge = ($(this).find("input[id^='tblAWBRateDesription_Charge_']").val() || "0") == "0" ? ($(this).find("input[id^='_temptblAWBRateDesription_Charge_']").val() || "0") : ($(this).find("input[id^='tblAWBRateDesription_Charge_']").val() || "0");
            $(this).find("input[id*='tblAWBRateDesription_ChargeAmount']").val((parseFloat(CharWt) * parseFloat(Charge)).toFixed(2));
        }
    });

    var freightAmount = 0;
    $("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").each(function () {
        freightAmount = Number(freightAmount) + Number($(this).find("input[id*='tblAWBRateDesription_ChargeAmount']").val());
    });
    $("#CDCChargeAmount").val(freightAmount);
    $("#_tempCDCChargeAmount").val(freightAmount);
    CalculateTotalAmount();
}

function GetProcessSequence() { }

function ShowProcessDetailsNew(subprocess, divID, isdblclick, subprocesssno) {
    if (subprocess == "RATE") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetWebForm/ImportFWB/ImportFWB/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divDetailSHC').html('');
                $('#divDetailSHC').append("<span id='spnAcceptenceTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='0'/><input id='hdnAcceptenceSNo' name='hdnAcceptenceSNo' type='hidden' value='2'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='New'/><table id='tblAWBRateDesription'></table></span>");

                $('#divDetailSHC').append("<span id='spnAcceptenceTransULD'><input id='hdnPageTypeULD' name='hdnPageTypeULD' type='hidden' value='0'/><input id='hdnAcceptenceSNoULD' name='hdnAcceptenceSNoULD' type='hidden' value='2'/><input id='hdnPageSizeULD' name='hdnPageSizeULD' type='hidden' value='New'/><table id='tblAWBRateDesriptionULD'></table></span>");

                $('#divDetailSHC').append("<div id='OtherCharge'><span id='spnOtherCharge'><input id='hdnPageTypeOtherCharge' name='hdnPageTypeOtherCharge' type='hidden' value='0'/><input id='hdnSNoOtherCharge' name='hdnSNoOtherCharge' type='hidden' value='2'/><input id='hdnPageSize3' name='hdnPageSize3' type='hidden' value='New'/><table id='tblAWBRateOtherCharge'></table></span></div>");

                $('#divDetailSHC').append("<div id='ChildGrid'><span id='spnAcceptenceTransChild'><input id='hdnPageType2' name='hdnPageType2' type='hidden' value='0'/><input id='hdnAcceptenceSNoChild' name='hdnAcceptenceSNoChild' type='hidden' value='2'/><input id='hdnPageSize2' name='hdnPageSize2' type='hidden' value='New'/><table id='tblAWBRateDesriptionChild'></table></span></div>");
                $("#divDetailSHC").append(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("Import");
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
            url: "Services/Import/ImportFWBService.svc/GetWebForm/ImportFWB/ImportFWB/" + subprocess + "/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#" + divID).html(result);
                if (result != undefined || result != "") {
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

function SaveReservationInfo() {
    var flag = true;
    var NogFlag = true;
    var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
    var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
    var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;

    var FWBPieces = parseInt(($("#Pieces").val() || 0) == 0 ? ($("#_tempPieces").val() || 0) : ($("#Pieces").val() || 0));
    var FWBGrossWeight = ($("#GrossWt").val() || 0) == 0 ? ($("#_tempGrossWt").val() || 0) : ($("#GrossWt").val() || 0);

    if (CurrentAWBNo.trim().toUpperCase() != $("#AWBNo").val().trim().toUpperCase()) {
        flag = false;
        ShowMessage('warning', 'Information!', 'Please Enter Valid AWB No.', "bottom-right");
        return false;
    }
    //if ($("#AWBNo").val().length < 12 || $("#AWBNo").val() > 12) {
    //    flag = false;
    //    ShowMessage('warning', 'Information!', 'Please Enter Valid AWB No.', "bottom-right");
    //    return false;
    //}

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetAndCheckCompleteShipment",
        async: false, type: "get", dataType: "json", cache: false,
        data: { AWBSNo: currentawbsno },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var ArrivedPieces = 0,
                ULDPieces = 0,
                TotalPieces = 0,
                GrossWeight = 0,
                ULDGrossWeight = 0,
                TotalGrossWeight = 0,
                ShipmentType = "";

            if (resData.length > 0) {
                ArrivedPieces = resData[0].ArrivedPieces;
                ULDPieces = resData[0].ULDPieces;
                TotalPieces = resData[0].TotalPieces;
                GrossWeight = resData[0].GrossWeight;
                ULDGrossWeight = resData[0].ULDGrossWeight;
                TotalGrossWeight = resData[0].TotalGrossWeight;
                ShipmentType = resData[0].ShipmentType;

                if ((ShipmentType == "T" || ShipmentType == "S") && Number(FWBPieces) != Number(ArrivedPieces)) {
                    ShowMessage('warning', 'Warning', "FWB pieces must be same as arrived pieces.", "bottom-right");
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(FWBPieces) < Number(ArrivedPieces)) {
                    ShowMessage('warning', 'Warning', "FWB pieces must be same as arrived pieces.", "bottom-right");
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(FWBPieces) == Number(ArrivedPieces) && Number(FWBGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "FWB gross weight must be same as gross weight.", "bottom-right");
                }
            }
        }
    });

    if ($("#Text_NatureofGoods").data("kendoAutoComplete").value() == "OTHER" && $("#OtherNOG").val() == "") {
        flag = false;
        ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', "Kindly Enter Nature of Goods", "bottom-right");
        return false;
    }

    var NogPcs = 0;
    var NogWt = 0;
    var NogMessage = '';
    $("div[id$='divareaTrans_importfwb_shipmentnog']").find("[id^='areaTrans_importfwb_shipmentnog']").each(function () {
        NogPcs += parseInt(($(this).find("input[id^='Pieces']").val() || 0));
        NogWt += parseFloat(($(this).find("input[id^='NogGrossWt']").val() || 0));
    });

    if (flag == true) {
        var awbSNo = (currentawbsno == "" ? 0 : currentawbsno);
        var awbNo = $("#AWBNo").val();
        var IsCourier = ($("[id='ShipmentType']:checked").val() == 1),
            ShowSlacDetails = false,
            AWBNo = $("#AWBNo").val(),
            AgentBranchSNo = 0;
        AWBTotalPieces = $("#Pieces").val(),
            CommoditySNo = $("#Text_Commodity").data("kendoAutoComplete").key(),
            GrossWeight = $("#GrossWt").val(),
            VolumeWeight = $("#VolumeWt").val(),
            ChargeableWeight = $("#ChargeableWt").val(),
            Pieces = $("#Pieces").val()
        var ShipmentInfo = {
            IsCourier: ($("[id='ShipmentType']:checked").val() == 0 ? 1 : 2),
            ShowSlacDetails: false,
            AWBNo: $("#AWBNo").val(),
            AgentBranchSNo: 0,
            AWBTotalPieces: $("#Pieces").val(),
            CommoditySNo: $("#NatureofGoods").val(),
            GrossWeight: $("#GrossWt").val(),
            VolumeWeight: $("#VolumeWt").val() == "" ? "0.00" : $("#VolumeWt").val(),
            ChargeableWeight: $("#ChargeableWt").val(),
            Pieces: $("#Pieces").val(),
            ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
            IsPrepaid: ($("[id='FreightType']:checked").val() == 0),
            OriginCity: $("#Text_ShipmentOrigin").data("kendoAutoComplete").key(),
            DestinationCity: $("#Text_ShipmentDestination").data("kendoAutoComplete").key(),
            XRayRequired: ($("[id='X-RayRequired']:checked").val() == 0),
            NoOfHouse: ($("#NoofHouse").val() == "" ? 0 : $("#NoofHouse").val()),
            HouseFeededBy: "",
            AWBDate: cfi.CfiDate("AWBDate"),
            NatureOfGoods: $("#Text_NatureofGoods").data("kendoAutoComplete").value() == "OTHER" ? $("#OtherNOG").val() : $("#Text_NatureofGoods").data("kendoAutoComplete").value(),
            IsBup: $("#chkisBup").prop('checked') == false ? 0 : 1,
            buptypeSNo: $("#Text_buptype").data("kendoAutoComplete").key(),
            DensityGroupSNo: $("#Text_densitygroup").data("kendoAutoComplete").key(),
            AirlineSNo: 0,
            CBM: $("#CBM").val() == "" ? "0.00" : $("#CBM").val(),
            AgentName: $("#IssuingAgent").val(),
            ConsigneeMobileNo: 0
        };

        var ShipmentSPHCArray = [];
        if ($("#Multi_SpecialHandlingCode").val() != "") {
            var sphcarr = $("#Multi_SpecialHandlingCode").val().split(",")
            for (i = 0; i < sphcarr.length; i++) {
                var ShipmentSPHCInfo = {
                    AWBSNo: awbSNo,
                    AWBNo: $("#AWBNo").val(),
                    SPHCCode: sphcarr[i]
                };
                ShipmentSPHCArray.push(ShipmentSPHCInfo);
            }
        }

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

        var NOGArray = [];
        $("#divareaTrans_importfwb_shipmentnog").find("tr[id^='areaTrans_importfwb_shipmentnog']").each(function () {
            var pcs = $(this).find("input[id^='Pieces']").val() || 0;
            var grwt = $(this).find("input[id^='NogGrossWt']").val() || 0;
            var Nog = $(this).find("input[id^='NOG']").val();
            var NogSNo = $(this).find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").key() || "0";
            if (parseInt(pcs) > 0 || parseFloat(grwt) > 0 || Nog != "" || parseInt(NogSNo) > 0) {
                var NOGModel = {
                    AWBSNo: currentawbsno,
                    NogPieces: $(this).find("input[id^='Pieces']").val() || 0,
                    NogGrossWt: $(this).find("input[id^='NogGrossWt']").val() || 0,
                    NogSNo: $(this).find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").key() || "0",
                    NOG: $("#NOGText").val()
                };
                NOGArray.push(NOGModel);
            }
        });

        var FlightArray = [];
        $("div[id$='areaTrans_importfwb_fwbshipmentitinerary']").find("[id^='areaTrans_importfwb_fwbshipmentitinerary']").each(function () {
            var FlightViewModel = {
                DailyFlightSNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").key(),
                BoardPoint: $(this).find("[id^='Text_BoardPoint']").data("kendoAutoComplete").key(),
                OffPoint: $(this).find("[id^='Text_offPoint']").data("kendoAutoComplete").key(),
                FlightDate: cfi.CfiDate($(this).find("[id^='FlightDate']").attr("id")),
                FlightNo: $(this).find("[id^='Text_FlightNo']").data("kendoAutoComplete").value()
            };
            FlightArray.push(FlightViewModel);
        });

        var currentawbno = "";
        var currentprfix = "";
        var Attachawbno = "";
        var Attachawbsno = 0;
        Attachawbno = $('#Text_UNKAWBNo').val();
        Attachawbsno = $('#UNKAWBNo').val();

        if (Attachawbsno == "") {
            Attachawbsno = 0;
        }
        currentawbno = $("#AWBNo").val();
        currentprfix = currentawbno.split('-');
        if (currentprfix[0].toString().toUpperCase() == 'UNK' && Attachawbno == "") {
            ShowMessage('warning', 'Information!', 'Please Enter Valid AWB No.', "bottom-right");
            return false;
        }

        $.ajax({
            url: "Services/Import/ImportFWBService.svc/SaveFWB", type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBNo: $("#AWBNo").val(),
                AWBSNo: awbSNo,
                ShipmentInformation: ShipmentInfo,
                lstAWBSPHC: ShipmentSPHCArray,
                listItineraryInformation: FlightArray,
                AWBDGRTrans: DGRArray,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges,
                IsDocReceived: IsDocReceived,
                IsLateAccepTance: 0,
                ArrivedShimentSNo: currentArrivedShipmentSNo,
                NOGArray: NOGArray,
                Attachawbno: Attachawbno,
                Attachawbsno: Attachawbsno
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - ' + (userContext.SysSetting.ClientEnvironment.toUpperCase() == "TH" ? 'AWB' : 'FWB') + ' Saved Successfully', "AWB No. [" + awbNo + "] -  Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    DeliveryOrderSearch();
                    if (isSaveAndNext == "1") {
                        FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                        FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight No value after save and next
                    }
                    else {
                        DeliveryOrderSearch();
                        CleanUI();
                    }
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    DeliveryOrderSearch();
                }
                else if (result.split('?')[0] == "2") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    DeliveryOrderSearch();
                }
                else
                    ShowMessage('warning', 'Warning - FWB [' + awbNo + ']', result + ".", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - FWB', "AWB No. [" + awbNo + "] -  unable to process.", "bottom-right");
            }
        });
    }
    return false;
}

function SaveCustomerInfo() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
        var IsShipperEnable = 0;
        var IsConsigneeEnable = 0;
        IsShipperEnable = $("#FWBShipper").is(":checked") == true ? 1 : 0;
        IsConsigneeEnable = $("#FWB_Consignee").is(":checked") == true ? 1 : 0;

        var ShipperViewModel = {
            ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
            ShipperName: $("#SHIPPER_Name").val(),
            ShipperStreet: $("#SHIPPER_Street").val(),
            ShipperLocation: $("#SHIPPER_TownLocation").val(),
            ShipperState: $("#SHIPPER_State").val(),
            ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
            ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
            ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
            ShipperMobile: $("#SHIPPER_MobileNo").val(),
            ShipperEMail: $("#SHIPPER_Email").val(),
            ShipperFax: $("#SHipper_Fax").val(),
            ShipperName2: $("#SHIPPER_Name2").val(),
            ShipperStreet2: $("#SHIPPER_Street2").val(),
            ShipperMobile2: $("#SHIPPER_MobileNo2").val()
        };

        var ConsigneeViewMode = {
            ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
            ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
            ConsigneeStreet: $("#CONSIGNEE_Street").val(),
            ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
            ConsigneeState: $("#CONSIGNEE_State").val(),
            ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
            ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
            ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
            ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
            ConsigneeEMail: $("#CONSIGNEE_Email").val(),
            ConsigneeFax: $("#CONSIGNEE_Fax").val(),
            ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
            ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
            ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val()
        };

        var NotifyModel = {
            NotifyName: $("#Notify_Name").val(),
            NotifyCountryCode: $("#Text_Notify_CountryCode").data("kendoAutoComplete").key(),
            NotifyCityCode: $("#Text_Notify_City").data("kendoAutoComplete").key(),
            NotifyMobile: $("#Notify_MobileNo").val(),
            NotifyAddress: $("#Notify_Address").val(),
            NotifyState: $("#Notify_State").val(),
            NotifyPlace: $("#Notify_Place").val(),
            NotifyPostalCode: $("#Notify_PostalCode").val(),
            NotifyFax: $("#Notify_Fax").val(),
            NotifyName2: $("#Notify_Name2").val(),
            NotifyAddress2: $("#Notify_Address2").val(),
            NotifyMobile2: $("#Notify_MobileNo2").val()
        }

        var NominyModel = {
            NominyName: $("#Nominate_Name").val(),
            NominyAddress: $("#Nominate_Place").val(),
        }
        var CreateShipperTaxParticipants = $("#chkshippertaxid").prop("checked") ? "1" : "0";
        var CreateConsigneeTaxParticipants = $("#chkconsigneetaxid").prop("checked") ? "1" : "0";
        var CreateShipperTaxId = $("#SHP_TaxId").val();
        var CreateConsigneeTaxId = $("#CON_TaxId").val();
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateShipperAndConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                ShipperInformation: ShipperViewModel,
                ConsigneeInformation: ConsigneeViewMode,
                NotifyModel: NotifyModel,
                NominyModel: NominyModel,
                ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0",
                IsShipperEnable: IsShipperEnable,
                IsConsigneeEnable: IsConsigneeEnable,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges,
                CreateShipperTaxParticipants: CreateShipperTaxParticipants,
                CreateConsigneeTaxParticipants: CreateConsigneeTaxParticipants,
                CreateShipperTaxId: CreateShipperTaxId,
                CreateConsigneeTaxId: CreateConsigneeTaxId
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Customer', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Customer', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Customer', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customer', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        });
    }
    return flag;
}

function SaveAWBSummary() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
        var SummaryArray = [];

        var SaveData = {
            SSRDesc1: $("#SSRDescription").val(),
            SSRDesc2: $("#SSRDescription2").val(),
            SSRDesc3: $("#SSRDescription3").val(),
            ARDFileRef: $("#ARDFileRefrence").val(),
            OPIName: $("#OPIName").val(),
            OPIAirport: $("#Text_OPIAirportCity").data("kendoAutoComplete").key(),
            OfficeDesignator: $("#Text_OPIOfficeDesignator").data("kendoAutoComplete").key(),
            OPICompDesignator: $("#OPICompDesignator").val(),
            OPIOtherFileRef: $("#OPIOtherFileReference").val(),
            OPIParticipantCode: $("#OPIParticipantCode").val(),
            OPIOthAirport: $("#Text_OPIOtherAirportCity").data("kendoAutoComplete").key(),
            SRIRefNumber: $("#SRIRefNumber").val(),
            SRISupInfo1: $("#SRISupInfo1").val(),
            SRISupInfo2: $("#SRISupInfo2").val(),
            CERSignature: $("#CERSignature").val(),
            ISUDate: cfi.CfiDate("CEDate"),
            ISUPlace: $("#Text_ISUPlace").data("kendoAutoComplete").key(),
            ISUSignature: $("#ISUSignature").val(),
            REFAirportCity: $("#Text_REFAirportCityCode").data("kendoAutoComplete").key(),
            REFOfficeDesignator: $("#Text_REFOfficeDesignator").data("kendoAutoComplete").key(),
            REFCompDesignator: $("#REFCompDesignator").val(),
            REFOthPartOfficeFileRef: $("#REFOthPartOfficeFileRef").val(),
            REFParticipantCode: $("#REFParticipantCode").val(),
            REFOthAirportCity: $("#Text_REFOthAirportCityCode").data("kendoAutoComplete").key(),
            TCORCustomsOrigin: $("#CORCustomsOriginCode").val()
        }
        SummaryArray.push(SaveData);

        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateAWBSummary", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                Summary: SummaryArray,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Other Info', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Other Info', "Volume weight deviation occurs in AWB No. [" + CurrentAWBNo + "] .  Processed Successfully", "bottom-right");
                        flag = true;
                    }
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Other Info', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Other Info', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Other Info', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
            }
        });
    }
    return flag;
}

function SaveHandlingInfo() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var osi = '';
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;
        var OSIInfoModel = new Array();
        var OCIInfoModel = new Array();

        $("#divareaTrans_importfwb_fwbshipmentositrans table tr[data-popup='false']").each(function (row, i) {
            if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
                OSIInfoModel.push({ AWBSNo: currentawbsno, OSI: $(i).find('td:nth-child(2) input[type=text]').val() });
            }
        });

        $("#divareaTrans_importfwb_fwbshipmentocitrans table tr[data-popup='false']").each(function (row, i) {
            if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
                OCIInfoModel.push({
                    AWBSNo: currentawbsno,
                    CountryCode: $(i).find("td:eq(1) > [id^='CountryCode']").val(),
                    InfoType: $(i).find("td:eq(2) > [id^='InfoType']").val(),
                    CSControlInfoIdentifire: $(i).find("td:eq(3) > [id^='CSControlInfoIdentifire']").val(),
                    SCSControlInfoIdentifire: $(i).find('td:eq(4) textarea').val()
                });
            }
        });

        var osiViewModel;
        var HandlingInfoArray = [];
        $("div[id$='areaTrans_importfwb_fwbshipmenthandlinginfo']").find("[id^='areaTrans_importfwb_fwbshipmenthandlinginfo']").each(function () {
            var type = $(this).find("[id^='Text_Type']").data("kendoAutoComplete").key();
            var message = $(this).find("[id^='Message']").val();
            var HandlingInfoViewModel = {
                AWBSNo: currentawbsno,
                HandlingMessageTypeSNo: type,
                Message: message
            };
            HandlingInfoArray.push(HandlingInfoViewModel);
        });

        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateOSIInfoAndHandlingMessage", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                OSIInformation: osiViewModel,
                AWBHandlingMessage: HandlingInfoArray,
                AWBOSIModel: OSIInfoModel,
                AWBOCIModel: OCIInfoModel,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Customs', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                    $("#divDetail").html("");
                    $("#tblShipmentInfo").hide();
                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Customs', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - Customs', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customs', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
            }
        });
    }
    return flag;
}

function SaveDimensionInfoNew() {
    var flag = true;
    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
        alert("Please Check FWB amendment.", "bottom-right");
        flag = false;
    }

    if (flag == true) {
        var isAmmendment = $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == true ? 1 : 0;
        var isAmmendmentCharges = $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").is(":hidden") == true ? 1 : $("#tabstrip").find("ul:eq(0)").find("table").find("input[id='chkAmendmentCharges']").is(":checked") == true ? 0 : 1;

        var strData, strData2;
        var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");

        var rows2 = $("tr[id^='tblAWBRateDesriptionULD']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        getUpdatedRowIndex(rows.join(","), "tblAWBRateDesriptionULD");

        var rows3 = $("tr[id^='tblAWBRateOtherCharge']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        getUpdatedRowIndex(rows.join(","), "tblAWBRateOtherCharge");

        strData = $('#tblAWBRateDesription').appendGrid('getStringJson');
        strData2 = $('#tblAWBRateDesriptionULD').appendGrid('getStringJson');
        strData3 = $('#tblAWBRateOtherCharge').appendGrid('getStringJson');

        if (strData == false || strData2 == false || strData3 == false) { return false; }
        var DimArray = [];
        var ULDDimArray = [];
        var OtherCharge = [];
        var AWBRateArray = [];
        if ($('input:radio[id="FreightType"]:checked').val() == 1 && ($("#CDCTotalCharAmount").val() == undefined || $("#CDCTotalCharAmount").val() == "" || Number($("#CDCTotalCharAmount").val()) == 0)) {
            ShowMessage('warning', 'Warning - Rate', "Rate are mandatory for CC shipment", "bottom-right");
            flag = false;
            return false
        }

        if (strData != "[]") {
            $("#tblAWBRateDesription tbody tr").each(function (index, row) {
                var DimData = {
                    AWBSNo: currentawbsno,
                    Charge: $(row).find("[id^=tblAWBRateDesription_Charge_]").val() || "0",
                    ChargeAmount: $(row).find("[id^=tblAWBRateDesription_ChargeAmount_]").val() || "0",
                    ChargeableWeight: $(row).find("[id^=tblAWBRateDesription_ChargeableWeight_]").val() || "0",
                    CommodityItemNumber: $(row).find("[id^=tblAWBRateDesription_CommodityItemNumber_]").val(),
                    GrossWeight: $(row).find("[id^=tblAWBRateDesription_GrossWeight_]").val(),
                    NatureOfGoods: $(row).find("[id^=tblAWBRateDesription_NatureOfGoods_]").val(),
                    NoOfPieces: $(row).find("[id^=tblAWBRateDesription_NoOfPieces_]").val(),
                    RateClassCode: $(row).find("[id^=tblAWBRateDesription_HdnRateClassCode_]").val(),
                    SNo: index + 1,
                    WeightCode: $(row).find("[id^=tblAWBRateDesription_WeightCode_]").val(),
                    hdnChildData: $(row).find("[id^=tblAWBRateDesription_hdnChildData_]").val(),
                    HarmonisedCommodityCode: $(row).find("[id^=tblAWBRateDesription_HarmonisedCommodityCode_]").val(),
                    CountrySNo: $(row).find("[id^=tblAWBRateDesription_HdnCountry_]").val(),
                    CountryCode: $(row).find("[id^=tblAWBRateDesription_Country_]").val().split('-')[0],
                    ConsolDesc: $(row).find("[id^=tblAWBRateDesription_ConsolDesc_]").val()
                }
                DimArray.push(DimData);
            });
        }
        else
            DimArray = null;

        if (strData2 != "[]") {
            $("#tblAWBRateDesriptionULD").find("tr[id^='tblAWBRateDesriptionULD_Row_']").each(function (index, row) {
                var ULDDimData = {
                    AWBSNo: currentawbsno,
                    ChargeLineCount: index + 1,
                    WeightCode: $(row).find("[id^=tblAWBRateDesriptionULD_WeightCode_]").val(),
                    RateClassCode: $(row).find("[id^=tblAWBRateDesriptionULD_RateClassCode_]").val().trim(),
                    SLAC: $(row).find("[id^=tblAWBRateDesriptionULD_SLAC_]").val(),
                    ULDTypeSNo: $(row).find("[id^=tblAWBRateDesriptionULD_HdnULD_]").val(),
                    ULDTypeCode: $(row).find("[id^=tblAWBRateDesriptionULD_ULD_]").val(),
                    ULDNo: $(row).find("[id^=tblAWBRateDesriptionULD_ULDNo_]").val(),// ULD No
                    Charge: $(row).find("[id^=tblAWBRateDesriptionULD_Charge_]").val(),
                    ChargeAmount: $(row).find("[id^=tblAWBRateDesriptionULD_ChargeAmount_]").val(),
                    HarmonisedCommodityCode: $(row).find("[id^=tblAWBRateDesriptionULD_HarmonisedCommodityCode_]").val(),
                    CountrySNo: $(row).find("[id^=tblAWBRateDesriptionULD_HdnCountry_]").val(),
                    CountryCode: $(row).find("[id^=tblAWBRateDesriptionULD_Country_]").val().split('-')[0],
                    NatureOfGoods: $(row).find("[id^=tblAWBRateDesriptionULD_NatureOfGoods_]").val()
                }
                ULDDimArray.push(ULDDimData);
            });
        }
        else
            ULDDimArray = null;

        if (strData3 != "[]") {
            $("#tblAWBRateOtherCharge").find("tr[id^='tblAWBRateOtherCharge_Row_']").each(function (index, row) {
                var OtherChargeData = {
                    AWBSNo: currentawbsno,
                    Type: $(row).find("[id^=tblAWBRateOtherCharge_Type_]").val(),
                    OtherChargeCode: $(row).find("[id^=tblAWBRateOtherCharge_OtherCharge_]").val(),
                    DueType: $(row).find("[id^=tblAWBRateOtherCharge_DueType_]").val(),
                    ChargeAmount: $(row).find("[id^=tblAWBRateOtherCharge_Amount_]").val(),
                }
                OtherCharge.push(OtherChargeData);
            });
        }
        else
            OtherCharge = null;

        var AWBRate = {
            AWBCurrencySNo: $("#Text_AWBCurrency").data("kendoAutoComplete").key(),
            TotalPrepaid: $("#TotalFreight").val() == "" ? 0 : $("#TotalFreight").val(),
            TotalCollect: $("#TotalAmount").val() == "" ? 0 : $("#TotalAmount").val(),
            CVDCurrency: $("#Text_Currency").data("kendoAutoComplete").key(),
            CVDChargeCode: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
            CVDWeightValuation: $("#Text_Valuation").data("kendoAutoComplete").key(),
            CVDOtherCharges: $("#Text_OtherCharge").data("kendoAutoComplete").key(),
            CVDDCarriageValue: $("#DecCarriageVal").val(),
            CVDCustomValue: $("#DecCustomsVal").val(),
            CVDInsurence: $("#Insurance").val(),
            CVDValuationCharge: $("#ValuationCharge").val(),
            CDCCurrency: $("#Text_CDCCurrencyCode").data("kendoAutoComplete").key(),
            CDCConversionRate: $("#CDCConversionRate").val() == "" ? "0" : $("#CDCConversionRate").val(),
            CDCDestCurrency: $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").key(),
            CDCChargeAmount: $("#CDCChargeAmount").val() == "" ? "0" : $("#CDCChargeAmount").val(),
            CDCTotalCharAmount: $("#CDCTotalCharAmount").val() == "" ? "0" : $("#CDCTotalCharAmount").val(),
            CVDTax: $("#CVDTax").val() == "" ? "0" : $("#CVDTax").val()
        }
        AWBRateArray.push(AWBRate);
        TactArray = null;

        var isAmmendment = $("#chkFWBAmmendment").prop("checked") ? "1" : "0";
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/UpdateRateDimemsionsAndULD", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                Dimensions: DimArray,
                ULDDimension: ULDDimArray,
                OtherCharge: OtherCharge,
                RateArray: AWBRateArray,
                TactRateArray: TactArray,
                isAmmendment: isAmmendment,
                isAmmendmentCharges: isAmmendmentCharges
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Rate', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Rate', "Volume weight deviation occurs in AWB No. [" + CurrentAWBNo + "] .  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;
                    }
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Rate', result.split('?')[1], "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - Rate', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Rate', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
            }
        });
    }
    return flag;
}

var NogDiv = '<div id="divareaTrans_importfwb_shipmentnog" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Nature of Good"><span id="spnNOG"> Nature of Goods</span></td><td class="formHeaderLabel" title="Other Nature of Good"><span id="spnOtherNOG">Other</span></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods" id="OtherNatureofGoods" value=""><input type="text" class="" name="Text_OtherNatureofGoods" id="Text_OtherNatureofGoods" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_0" id="OtherNatureofGoods_0" value=""><input type="text" class="" name="Text_OtherNatureofGoods_0" id="Text_OtherNatureofGoods_0" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_1" id="OtherNatureofGoods_1" value=""><input type="text" class="" name="Text_OtherNatureofGoods_1" id="Text_OtherNatureofGoods_1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_2" id="OtherNatureofGoods_2" value=""><input type="text" class="" name="Text_OtherNatureofGoods_2" id="Text_OtherNatureofGoods_2" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_importfwb_shipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_3" id="OtherNatureofGoods_3" value=""><input type="text" class="" name="Text_OtherNatureofGoods_3" id="Text_OtherNatureofGoods_3" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr></tbody></table>'
    + '</div><div id="divHSCodePopUp" style="width: 100 %"></div>'