$(document).ready(function () {

    $('.btn.btn-info').closest('tr').hide();
    $('#__SpanHeader__').text("Agent Build Up Weighing:");
    $("#tblAgentBuildup tr:eq(0) td").text("Agent Build Up Weighing");

    $("input[type='submit'][name='operation']").after('<input type="button" id="btnSave" name="btnSave" value="Save" class="btn btn-success"><input type="button" id="btnSaveAssignEquipment" name="btnSaveAssignEquipment" value="Save & Assign Equipment" class="btn btn-success">');
    $("input[type='submit'][name='operation']").hide();

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
        cfi.AutoComplete("FlightNo", "FlightNo", "v_DailyFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");
        cfi.AutoComplete("AgentSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
        cfi.AutoComplete("OriginCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode"], null, "contains");

        if ($('#hdnAgentBuildupSNo').val() != "") {
            GetULDDetails();
        }

        $("#btnSave").unbind("click").bind("click", function () {
            SaveAgentBuildUpXRay("S");
        });
        $("#btnSaveAssignEquipment").unbind("click").bind("click", function () {
            SaveAgentBuildUpXRay("SAE");
        });

        if ($('#TareWeight_0').length == 0) {
            $('#btnSave').hide();
            $('#btnSaveAssignEquipment').hide();
        }
        else {
            $('#btnSave').show();
            //$('#btnSaveAssignEquipment').hide();
        }
    }

});

function ExtraCondition(textId) {

    var filterFlight = cfi.getFilter("AND");

    if (textId.indexOf("txtFlightNoPop") >= 0) {
        var filterFlt = cfi.getFilter("AND");

        cfi.setFilter(filterFlt, "FlightDate", "eq", cfi.CfiDate("txtFlightDt"));
        cfi.setFilter(filterFlt, "OriginCity", "eq", $("#Text_OriginCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterFlt, "CarrierCode", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").value().split('-')[0]);
        cfi.setFilter(filterFlt, "IsDirectFlight", "eq", "1");
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
    if (textId.indexOf("txtFlightNoAssignEquipmentFlightPopUp") >= 0) {
        var filterFlt = cfi.getFilter("AND");

        cfi.setFilter(filterFlt, "FlightDate", "eq", cfi.CfiDate("txtFlightDtAssignEquipmentFlightPopUp"));
        cfi.setFilter(filterFlt, "OriginCity", "eq", $("#Text_OriginCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterFlt, "CarrierCode", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").value().split('-')[0]);
        cfi.setFilter(filterFlt, "IsDirectFlight", "eq", "1");
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
    else if (textId.indexOf("ULDOffPoint") >= 0) { // Shipment Off Point 
        var filterFlt = cfi.getFilter("AND");

        var currentIndex = textId.split('_')[2];
        var groupflightsno = $('#hdnAssignFlightRoute_' + currentIndex).val();
        cfi.setFilter(filterFlt, "GroupFlightSNo", "eq", groupflightsno);
        cfi.setFilter(filterFlt, "OriginAirportCode", "eq", userContext.AirportCode);

        filterFlight = cfi.autoCompleteFilter(filterFlt);

        return filterFlight;
    }
    else if (textId.indexOf("txtOffPointAssignEquipmentFlightPopUp") >= 0) { // Shipment Off Point 
        var filterFlt = cfi.getFilter("AND");
        var groupflightsno = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key().split('-')[1];
        cfi.setFilter(filterFlt, "GroupFlightSNo", "eq", groupflightsno);
        cfi.setFilter(filterFlt, "OriginAirportCode", "eq", userContext.AirportCode);

        filterFlight = cfi.autoCompleteFilter(filterFlt);

        return filterFlight;
    }
    else if (textId.indexOf("txtOffPointPop") >= 0) { // Shipment Off Point 
        var filterFlt = cfi.getFilter("AND");
        var groupflightsno = $("#Text_txtFlightNoPop").data("kendoAutoComplete").key().split('-')[1];
        cfi.setFilter(filterFlt, "GroupFlightSNo", "eq", groupflightsno);
        cfi.setFilter(filterFlt, "OriginAirportCode", "eq", userContext.AirportCode);

        filterFlight = cfi.autoCompleteFilter(filterFlt);

        return filterFlight;
    }
    else if (textId.indexOf("tblAssignEquipmentPopUp_AWBNo_") >= 0) { // AWB for Assign equipment 
        var filterFlt = cfi.getFilter("AND");
        cfi.setFilter(filterFlt, "AgentBuildUpSNo", "eq", parseInt($('#hdnAgentBuildupSNo').val()));
        cfi.setFilter(filterFlt, "UldStockSNo", "eq", 0);
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
    else if (textId.indexOf("tblAssignEquipmentPopUp_EquipmentNo") >= 0) { // AWB for Assign equipment 
        var filterFlt = cfi.getFilter("AND");
        cfi.setFilter(filterFlt, "IsAvailable", "eq", 1);
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
    else if (textId.indexOf("Offpoint_") >= 0) { // AWB for Assign equipment 
        var filterFlt = cfi.getFilter("AND");
        var groupflightsno = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key().split('-')[1];
        cfi.setFilter(filterFlt, "GroupFlightSNo", "eq", groupflightsno);
        cfi.setFilter(filterFlt, "OriginAirportCode", "eq", userContext.AirportCode);

        filterFlight = cfi.autoCompleteFilter(filterFlt);

        return filterFlight;
    }

}

function GetULDDetails() {
    var _AgentBuildupSNo = parseInt($('#hdnAgentBuildupSNo').val());
    $.ajax({
        url: "Services/BuildUp/AgentBuildUpWeighingService.svc/GetULDDetails?AgentBuildUpSNo=" + _AgentBuildupSNo + "&UserSNo=" + userContext.UserSNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ AgentBuildUpSNo: _AgentBuildupSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MasterData = jQuery.parseJSON(result);
            var FlightData = MasterData.Table0;
            var ULDData = MasterData.Table1;
            var XrayCompletedULD = MasterData.Table2;
            var DailyFlightSNo = 0;
            if (FlightData.length > 0) {
                DailyFlightSNo = FlightData[0].DailyFlightSNo;
                BindFlighDetail(FlightData);
            }
            if (ULDData.length > 0) {
                BindULDDetail(ULDData, _AgentBuildupSNo, DailyFlightSNo);
            }
            else {
                $('#dvWeighing').html("");
                $('#btnSave').hide();

            }
            if (XrayCompletedULD.length > 0) {
                BindXrayCompletedULD(XrayCompletedULD);
            }
        }
    });
}

function BindFlighDetail(FlightData) {
    $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue(FlightData[0].AirlineSNo, FlightData[0].CarrierCode + "-" + FlightData[0].AirlineName);
    $('#FlightDate').val(FlightData[0].FlightDate);
    $("#Text_FlightNo").data("kendoAutoComplete").setDefaultValue(FlightData[0].DailyFlightSNo, FlightData[0].FlightNo);
    $("#Text_AgentSNo").data("kendoAutoComplete").setDefaultValue(FlightData[0].AgentSNo, FlightData[0].AgentName);
    $("#Text_OriginCode").data("kendoAutoComplete").setDefaultValue(FlightData[0].OriginCityCode, FlightData[0].OriginCityCode);

    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
    $('#FlightDate').data('kendoDatePicker').enable(false);
    $("#Text_FlightNo").data("kendoAutoComplete").enable(false);
    $("#Text_AgentSNo").data("kendoAutoComplete").enable(false);
    $("#Text_OriginCode").data("kendoAutoComplete").enable(false);


}

function BindULDDetail(ULDData, _AgentBuildupSNo, DailyFlightSNo) {
    var uldhtml = "";
    var totalBuildWT = 0;
    var totalTareWT = 0;
    $('#btnSaveAssignEquipment').hide();
    uldhtml = "<br><table border='1px' class='WebFormTable'><tr><td class='formSection' colspan='11'><div style='float:left;'>Build Up Details</div><div style='float:right; padding-right:10px'>Police Personnel: <input class='k-input' type='text' id='WeighingByUser' name='WeighingByUser' style='width: 150px; text-transform: uppercase;' controltype='alphanumericupper' data-valid='required' data-valid-msg='Enter Police Personnel' maxlength='35' value='' placeholder='' data-role='alphabettextbox' autocomplete='off'/></div> </td></tr>";
    uldhtml = uldhtml + "<tr align='center' style='hight:30px'><td class='formHeaderLabel' style='width:50px'>X-RAY</td><td class='formHeaderLabel' style='width:100px'>ULD No.</td><td class='formHeaderLabel' style='width:100px' >Total Shipment</td><td class='formHeaderLabel' style='width:100px' >Lot No</td><td class='formHeaderLabel' style='width:100px'>Build Up Weight</td><td style='width:100px' class='formHeaderLabel'>Captured Weight</td><td class='formHeaderLabel' style='width:100px'>Tare Weight</td><td style='width:100px' class='formHeaderLabel'>Net Weight</td><td class='formHeaderLabel' style='width:100px'>ULD Contour</td><td class='formHeaderLabel' style='width:120px'>Flight Info</td><td class='formHeaderLabel' style='width:100px'>ULD Off Point</td></tr>";
    $.each(ULDData, function (index, item) {

        var flightno = $("#Text_FlightNo").data("kendoAutoComplete").value();
        if (flightno != "") {
            flightno = flightno + " / " + $('#FlightDate').val();
        }
        else {
            //flightno = "Assign Flight/ Push to Lying List";
            flightno = "Assign Flight";
        }

        var _id = "AssignFlight_" + _AgentBuildupSNo + "_" + item.UldStockSNo;
        var _hdnid = "hdnAssignFlight_" + item.UldStockSNo;
        var _hdnRouteid = "hdnAssignFlightRoute_" + index;
        if (item.ULDNo == "BULK") {
            var _assignLink = "";
            $('#btnSaveAssignEquipment').show();
        }
        else {
            var _assignLink = "<input type='hidden' id=" + _hdnRouteid + " value=" + item.FlightOffPoint + " ><input type='hidden' id=" + _hdnid + " value=" + DailyFlightSNo + " ><a onclick=\"AssignFlight(" + _AgentBuildupSNo + "," + item.UldStockSNo + ",'Weighing'," + index + ")\" id=\"" + _id + "\" style=\"cursor:pointer;color:blue\">" + flightno + "</a>";
        }


        totalBuildWT = totalBuildWT + parseFloat(item.TotalGrossWeight);
        totalTareWT = totalTareWT + parseFloat(item.EmptyWeight);
        //uldhtml = uldhtml + "<tr align='center'></tr>";
        uldhtml = uldhtml + "<tr align='center'><td align='center' style='padding-left:10px' class='formthreeInputcolumn1'><input checked='checked' onclick='ReCalculate(" + index + ",this);' type='checkbox' id='chk_" + item.UldStockSNo + "_" + index + "'></td><td align='center' class='formthreeInputcolumn1'>" + item.ULDNo + "</td><td align='center' class='formthreeInputcolumn1'>" + item.TotalShipment + "</td><td align='center' class='formthreeInputcolumn1'>" + item.LotNo + "</td><td id='tdBuildUpWeight_" + index + "' align='center' class='formthreeInputcolumn1'>" + item.TotalGrossWeight + "</td><td align='center' class='formthreeInputcolumn1'>" + MakeControl(index, 'Weight', "") + "</td><td align='center' class='formthreeInputcolumn1'>" + MakeControl(index, 'TareWeight', item.EmptyWeight) + "</td><td align='center' class='formthreeInputcolumn1'>" + MakeControl(index, 'ActualWeight', "") + "</td><td align='center' class='formthreeInputcolumn1'>" + MakeControl(index, 'ULDContour', "") + "</td><td align='center' class='formthreeInputcolum1n' style='padding-right:10px'>" + _assignLink + " </td><td align='center' class='formthreeInputcolumn1'>" + MakeControl(index, 'ULDOffPoint', item.UldStockSNo) + "</td></tr>";
    });
    uldhtml = uldhtml + "<tr><td class='formHeaderLabel'></td><td class='formHeaderLabel'></td><td class='formHeaderLabel' align='right'>Total:</td><td class='formHeaderLabel'></td><td class='formHeaderLabel' id='tdTotalBuildupWT' align='center'>0</td><td class='formHeaderLabel' align='center' id='tdTotalWT'>0</td><td align='center' class='formHeaderLabel' id='tdTotalTareWT'>0.0</td><td class='formHeaderLabel' align='center'><span style='color:red; font-weight:bold' id='spnEss'></span></td><td class='formHeaderLabel'></td><td class='formHeaderLabel'></td><td class='formHeaderLabel'></td></tr>";
    uldhtml = uldhtml + "</table>";
    $('#dvWeighing').html(uldhtml);

    $('#tdTotalBuildupWT').text(totalBuildWT.toFixed(2));
    //$('#tdTotalWT').text(totalBuildWT.toFixed(2));
    $('#tdTotalWT').text("");
    $('#tdTotalTareWT').text(totalTareWT.toFixed(2));

    $("input[type='text'][id^='ActualWeight_']").attr('disabled', 'disabled');

    $("input[type='text'][id^='Weight_']").bind('blur', function () {
        CalculateWeight("Weight");
    });
    $("input[type='text'][id^='TareWeight_']").bind('blur', function () {
        CalculateWeight("TareWeight");
    });

    $("input[type='text'][id^='Weight_']").on("keypress keyup", function (event) {
        //$(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        //if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        //    event.preventDefault();
        //}
        ISNumeric(this);
    });

    $("input[type='text'][id^='TareWeight_']").on("keypress keyup", function (event) {
        //$(this).val($(this).val().replace(/[^\d].+/, ""));
        //if ((event.which < 48 || event.which > 57)) {
        //    event.preventDefault();
        //}
        ISNumeric(this);
    });


    $("input[id^='ULDContour_']").each(function (index, item) {
        cfi.AutoComplete($(this).attr("name"), "AbbrCode,Description", "ULDContour", "SNo", "AbbrCode", ["AbbrCode", "Description"], null, "contains");

        if ($('#' + this.id).closest('tr').find('[type=checkbox]').closest('td').next('td').text().toLowerCase() == "bulk") {
            $('#Text_' + this.id).data("kendoAutoComplete").enable(false);
        }
    });

    $("input[id^='ULDOffPoint_']").each(function (index, item) {
        //cfi.AutoComplete($(this).attr("name"), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");
        cfi.AutoComplete($(this).attr("name"), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");
    });
}

function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 2)) {
        event.preventDefault();
    }
}

function BindXrayCompletedULD(ULDData) {
    var uldhtml = "";
    uldhtml = "<br><table class='WebFormTable'><tr><td class='formSection' colspan='12'>X-Ray Completed ULD</td></tr>";
    uldhtml = uldhtml + "<tr><td class='formHeaderLabel'>ULD No.</td><td class='formHeaderLabel'>Build Up Weight</td><td class='formHeaderLabel'>Captured Weight</td><td class='formHeaderLabel'>Tare Weight</td><td class='formHeaderLabel'>Net Weight</td><td class='formHeaderLabel'>Lot No.</td><td class='formHeaderLabel'>ULD Contour</td><td class='formHeaderLabel'>Weighing By</td><td class='formHeaderLabel'>Weighing On</td><td class='formHeaderLabel'>Screening By</td><td class='formHeaderLabel'>ULD Off Point</td><td class='formHeaderLabel'>Flight Info</td></tr>";
    $.each(ULDData, function (index, item) {
        var _id = "AssignFlight_" + item.AgentBuildUpSNo + "_" + item.UldStockSNo;
        var _assignLink = "";
        var _assignLinkForBULK = "";
        //if (item.DailyFlightSNo == "-1") {
        //    _assignLink = "Pushed in Lying List";
        //}else

        if (item.FlightNo != "") {
            _assignLink = item.FlightNo;
        }
        else {
            if (item.ULDNo == 'BULK') {
                _assignLink = "<a onclick=\"AssignEquipment(" + item.AgentBuildUpSNo + ")\" id=\"AssignEquipmentLink\" style=\"cursor:pointer;color:blue\">Assign Flight & UWS</a>";

            }
            else {
                _assignLink = "<a onclick=\"AssignFlight(" + item.AgentBuildUpSNo + "," + item.UldStockSNo + ",'XrayCompleted'," + index + ")\" id=\"" + _id + "\" style=\"cursor:pointer;color:blue\">Assign Flight</a>";
            }
        }
        //var _assignLink = item.FlightNo == "" ? "<a onclick=\"AssignFlight(" + item.AgentBuildUpSNo + "," + item.UldStockSNo + ",'XrayCompleted')\" id=\"" + _id + "\" style=\"cursor:pointer;color:blue\">Assign Flight</a>" : item.FlightNo;

        if (item.ULDNo == 'BULK' && item.IsUWS == "True") {
            _assignLinkForBULK = "<a onclick=\"ViewAssignEquipment(" + item.AgentBuildUpSNo + ")\" id=\"ViewAssignEquipmentLink\" style=\"cursor:pointer;color:blue\">" + item.ULDNo + "</a>";
        }
        else {
            _assignLinkForBULK = item.ULDNo;
        }
        uldhtml = uldhtml + "<tr></tr>";
        uldhtml = uldhtml + "<td class='formthreeInputcolumn' style='padding-left:5px'>" + _assignLinkForBULK + "</td><td align='right' class='formthreeInputcolumn'>" + item.BuildUpWeight + "</td><td align='center' class='formthreeInputcolumn'>" + item.GetWeight + "</td><td align='center' class='formthreeInputcolumn'>" + item.TareWeight + "</td><td align='center' class='formthreeInputcolumn'>" + item.ActualWeight + "</td><td align='center' class='formthreeInputcolumn'>" + item.LotNo + "</td><td align='center' class='formthreeInputcolumn'><span style=\"white-space:nowrap\" title=" + item.ULDContour + ">" + item.ULDContourCode + "</span></td><td align='center' class='formthreeInputcolumn'>" + item.WeighingBy + "</td><td align='center' class='formthreeInputcolumn'>" + item.WeighingOn + "</td><td align='center' class='formthreeInputcolumn'>" + item.ScreeningBy + "</td><td align='center' class='formthreeInputcolumn' id='tdOffPoint_" + item.UldStockSNo + "'>" + item.ULDOffPoint + "</td><td align='center' class='formthreeInputcolumn'>" + _assignLink + " </td>";
    });
    uldhtml = uldhtml + "</table>";
    $('#dvWeighingDone').html(uldhtml);
}

function MakeControl(index, name, value) {
    var newID = name + "_" + index;
    var tabindex = "100" + index;
    var control = "";
    if (name == "TareWeight") {
        control = "<input type=\"text\" onblur=\"CheckTareWeight(this,'" + name + "');\" class=\"transSection k-input k-state-default\" name=\"" + name + "\" id=\"" + newID + "\" recname=\"" + name + "\" style=\"width: 50px;\" controltype=\"number\" allowchar=\"0123456789\" data-valid=\"required\" data-valid-msg=\"Enter Build Pieces\" tabindex=\"" + tabindex + "\" maxlength=\"5\" value=\"" + value + "\" placeholder=\"\" data-role=\"numerictextbox\">";
    }
    else if (name == "Weight") {
        control = "<input type=\"text\" onblur=\"CheckTareWeight(this,'" + name + "');\" class=\"transSection k-input k-state-default\" name=\"" + name + "\" id=\"" + newID + "\" recname=\"" + name + "\" style=\"width: 50px;\" controltype=\"number\" allowchar=\"0123456789\" data-valid=\"required\" data-valid-msg=\"Enter Build Pieces\" tabindex=\"" + tabindex + "\" maxlength=\"8\" value=\"" + value + "\" placeholder=\"\" data-role=\"numerictextbox\">";
    }
        //else if (name == "ULDOffPoint") {
        //    control = "<select name=\"" + name + "\" id=\"" + newID + "\" ><option value=\"DEL\">DEL</option></select>";
        //}
    else if (name == "ULDContour") {
        control = "<input type=\"hidden\" name=\"" + newID + "\" id=\"" + newID + "\" value=\"\"><input id=\"Text_" + newID + "\" type=text style=\"width:200px\" name=\"Text_" + newID + "\" controltype=\"autocomplete\" value=\"\" data-role=\"autocomplete\" autocomplete=\"off\">";
    }
    else if (name == "ULDOffPoint") {
        if (value != 0) {
            control = "<input type=\"hidden\" name=\"" + newID + "\" id=\"" + newID + "\" value=\"\"><input id=\"Text_" + newID + "\" type=text style=\"width:50px\" name=\"Text_" + newID + "\" controltype=\"autocomplete\" value=\"\" data-role=\"autocomplete\" autocomplete=\"off\">";
        }

    }
    else {
        control = "<input type=\"text\" class=\"transSection k-input k-state-default\" name=\"" + name + "\" id=\"" + newID + "\" recname=\"" + name + "\" style=\"width: 50px;\" controltype=\"number\" allowchar=\"0123456789\" data-valid=\"required\" data-valid-msg=\"Enter Build Pieces\" tabindex=\"" + tabindex + "\" maxlength=\"5\" value=\"" + value + "\" placeholder=\"\" data-role=\"numerictextbox\">";
    }

    return control;
}

function CalculateWeight(control) {
    var Total = 0;
    if (control == "Weight") {
        $("input[type='text'][id^='Weight_']").each(function (index, item) {
            Total = Total + parseFloat($(this).val() == "" ? "0" : $(this).val());
        });
        $('#tdTotalWT').text(Total.toFixed(2));
    }
    else if (control == "TareWeight") {
        $("input[type='text'][id^='TareWeight_']").each(function (index, item) {
            Total = Total + parseFloat($(this).val() == "" ? "0" : $(this).val());
        });
        $('#tdTotalTareWT').text(Total.toFixed(2));
    }

    for (i = 0; i < $("input[type='text'][id^='TareWeight_']").length; i++) {
        var CurrentWeight = $('#Weight_' + i).val() == "" ? "0" : $('#Weight_' + i).val();
        var CurrentTareWeight = $('#TareWeight_' + i).val() == "" ? "0" : $('#TareWeight_' + i).val();
        var CurrentBuildupWt = $('#tdBuildUpWeight_' + i).text() == "" ? "0" : $('#tdBuildUpWeight_' + i).text();

        if (parseFloat(CurrentWeight) > 0)
            $('#ActualWeight_' + i).val((parseFloat(CurrentWeight) - parseFloat(CurrentTareWeight)).toFixed(2));
        //$('#ActualWeight_' + i).val((parseFloat(CurrentWeight) - parseFloat(CurrentBuildupWt)).toFixed(2));
        //$('#ActualWeight_' + i).val(((parseFloat(CurrentWeight) + parseFloat(CurrentTareWeight)) - parseFloat(CurrentBuildupWt)).toFixed(2));

    }

    CheckEssWeight();
}

function ReCalculate(index, obj) {
    if (obj.checked == false) {

        var CurrentWeight = $('#Weight_' + index).val() == "" ? "0" : $('#Weight_' + index).val();
        var CurrentTareWeight = $('#TareWeight_' + index).val() == "" ? "0" : $('#TareWeight_' + index).val();

        var TotalWeight = $('#tdTotalWT').text() == "" ? "0" : $('#tdTotalWT').text();
        var TotalTareWeight = $('#tdTotalTareWT').text() == "" ? "0" : $('#tdTotalTareWT').text();

        $('#Weight_' + index).val('0');
        $('#TareWeight_' + index).val('0');
        $('#ActualWeight_' + index).val('0');

        $('#tdTotalWT').text((parseFloat(TotalWeight) - parseFloat(CurrentWeight)).toFixed(2));
        $('#tdTotalTareWT').text((parseFloat(TotalTareWeight) - parseFloat(CurrentTareWeight)).toFixed(2));
        var value = $(obj).closest("tr").find("td:eq(1)").text();
        if (value == "BULK") {
            $('#btnSaveAssignEquipment').hide();
        }
        CheckEssWeight();
    }
    else {
        var value = $(obj).closest("tr").find("td:eq(1)").text();
        if (value == "BULK") {
            $('#btnSaveAssignEquipment').show();
        }
    }
}

function SaveAgentBuildUpXRay(obj) {
    var ULDData = [];
    var IsValidCapWt = true;
    var IsValidTarepWt = true;
    var CaptWtMsg = "";
    var TareWtMsg = "";
    var ULDOffPointMsg = "";

    $('input[type="checkbox"][id^="chk_"]:checked').each(function (index, item) {
        var currentid = this.id;
        var _ULDStockSNo = currentid.split('_')[1];
        var SelectedULDIndex = currentid.split('_')[2];

        ULDData.push({
            ULDStockSNo: _ULDStockSNo,
            BuildUpWeight: $('#tdBuildUpWeight_' + SelectedULDIndex).text() == "" ? "0" : $('#tdBuildUpWeight_' + SelectedULDIndex).text(),
            GetWeight: $('#Weight_' + SelectedULDIndex).val() == "" ? "0" : $('#Weight_' + SelectedULDIndex).val(),
            TareWeight: $('#TareWeight_' + SelectedULDIndex).val() == "" ? "0" : $('#TareWeight_' + SelectedULDIndex).val(),
            ActualWeight: $('#ActualWeight_' + SelectedULDIndex).val() == "" ? "0" : $('#ActualWeight_' + SelectedULDIndex).val(),
            ULDNo: $('#' + currentid).closest('td').next('td').text(),
            DailyFlightSNo: $('#hdnAssignFlight_' + _ULDStockSNo).val() == "" ? "0" : $('#hdnAssignFlight_' + _ULDStockSNo).val(),
            ULDContour: $("#Text_ULDContour_" + SelectedULDIndex).data("kendoAutoComplete").key(),
            Equipment: "",
            ULDOffPoint: _ULDStockSNo == 0 ? "" : $("#Text_ULDOffPoint_" + SelectedULDIndex).data("kendoAutoComplete").value(),
        });

        if ($('#Weight_' + SelectedULDIndex).val() == "" || $('#Weight_' + SelectedULDIndex).val() == "0") {
            CaptWtMsg = $('#' + currentid).closest('td').next('td').text() + ", " + CaptWtMsg;
        }
        if (($('#TareWeight_' + SelectedULDIndex).val() == "" || $('#TareWeight_' + SelectedULDIndex).val() == "0")) {
            if ($('#' + currentid).closest('td').next('td').text().toLowerCase() != "bulk")
                TareWtMsg = $('#' + currentid).closest('td').next('td').text() + ", " + TareWtMsg;
        }

        if (_ULDStockSNo != 0 && $("#Text_ULDOffPoint_" + SelectedULDIndex).data("kendoAutoComplete").value() == "") {
            if ($('#' + currentid).closest('td').next('td').text().toLowerCase() != "bulk" && $('#AssignFlight_' + $('#hdnAgentBuildupSNo').val() + '_' + _ULDStockSNo).text().toLowerCase() != "assign flight")
                ULDOffPointMsg = $('#' + currentid).closest('td').next('td').text() + ", " + ULDOffPointMsg;
        }
    });
    if ($('input[type="checkbox"][id^="chk_"]:checked').length == 0) {
        ShowMessage('warning', 'Information', "Please select at least one ULD");
        return;
    }
    if (CaptWtMsg != "") {
        var msg = "";
        if (CaptWtMsg == "BULK, ")
            msg = "Please enter Captured Weight in BULK";
        else
            msg = "Please enter Captured Weight in ULD No./BULK " + RemoveLastComma(CaptWtMsg);
        ShowMessage('warning', 'Information', msg);
        return;
    }
    if (TareWtMsg) {
        var msg = "";
        if (CaptWtMsg == "BULK, ")
            msg = "Please enter Tare Weight in BULK";
        else
            msg = "Please enter Tare Weight in ULD No./BULK " + RemoveLastComma(TareWtMsg);
        ShowMessage('warning', 'Information', msg);
        return;
    }

    if (ULDOffPointMsg) {
        var msg = "";
        if (CaptWtMsg == "BULK, ")
            msg = "Please Select Off Point in BULK";
        else
            msg = "Please Select Off Point For ULD No. " + RemoveLastComma(ULDOffPointMsg);
        ShowMessage('warning', 'Information', msg);
        return;
    }

    var IsvalidCapturedWeight = "";
    if (ULDData.length > 0) {
        $.each(ULDData, function (index, item) {
            if (item.GetWeight != "" && item.TareWeight != "") {
                if (parseFloat(item.TareWeight) > parseFloat(item.GetWeight)) {
                    IsvalidCapturedWeight = "Captured Weight should be greater than Tare Weight for ULD '" + item.ULDNo + "'";
                    return false;
                }
            }
        });
    }

    if (IsvalidCapturedWeight != "") {
        ShowMessage('warning', 'Information', IsvalidCapturedWeight);
        return;
    }

    if ($('#WeighingByUser').val() == "") {
        ShowMessage('warning', 'Information', "Please Enter Police Personnel");
        return;
    }

    /****************Check ESS**********************/
    /*
    var IsEss = true;
    var EssWeight =  parseFloat($('#tdTotalBuildupWT').text()) + parseFloat($('#tdTotalTareWT').text());
    if (parseFloat($('#tdTotalWT').text()) > EssWeight) {
        IsEss = confirm('Do you want to raise ESS of ' + (parseFloat($('#tdTotalWT').text() - (EssWeight)).toFixed(2)) + ' KG (Weight)?');
    }
    if (IsEss == false) {
        return;
    }*/
    /********************************************/
    if (ULDData.length > 0) {
        delete ULDData.ULDNo;
    }

    var dailyflighsno = $("#Text_FlightNo").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/BuildUp/AgentBuildUpWeighingService.svc/SaveAgentBuildUpWeighing", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AgentBuildUpWeighing: ULDData, AgentBuildUpSNo: $('#hdnAgentBuildupSNo').val(), UserSNo: userContext.UserSNo, AirportSNo: userContext.AirportSNo, DailyFlightSNo: dailyflighsno, WeighingBy: $('#WeighingByUser').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (IsJsonString(result)) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].Result == "Success" || MsgData[0].Result == "ESS Applied Successfully") {
                    ShowMessage('success', 'Information', "X-Ray Updated Successfully");

                    if (obj == "SAE") {
                        //if (location.hostname == "localhost") {
                        //    var urlnew = "http://" + location.host + "/" + window.location.pathname + "?Module=BuildUp&Apps=AgentBuildUpWeighing&FormAction=EDIT&UserID=0&RecID=" + parseInt($('#hdnAgentBuildupSNo').val())  + "";
                        //}
                        //else {
                        //    var urlnew = "http://" + location.host + "/" + window.location.pathname + "?Module=BuildUp&Apps=AgentBuildUpWeighing&FormAction=EDIT&UserID=0&RecID=" + parseInt($('#hdnAgentBuildupSNo').val()) + "";
                        //}
                        //window.location.href = urlnew
                        $('#btnSaveAssignEquipment').hide();
                        GetULDDetails();
                        $('#AssignEquipmentLink').click();
                    }
                    else {
                        $("input[type='submit'][name='operation'][value='Update']").click(); // Saved message comming from Management WebUI 
                    }
                }
                else {
                    ShowMessage('warning', 'Information', MsgData[0].Result);

                }
            }
            else {
                ShowMessage('warning', 'Information', "Unable to process");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Information', "Error Occured!!!");

        }
    });
}

function CheckEssWeight() {
    var BuidUpWeight = parseFloat($('#tdTotalBuildupWT').text());
    var GetWeight = parseFloat($('#tdTotalWT').text());
    var TareWeight = parseFloat($('#tdTotalTareWT').text());

    if (GetWeight > (BuidUpWeight + TareWeight)) {
        var essWT = GetWeight - (BuidUpWeight + TareWeight)
        $('#spnEss').text('Weight Variance: ' + essWT.toFixed(2));
    }
    else {
        $('#spnEss').text('');
    }
}

function CheckTareWeight(obj, controlName) {
    var CurrentULD = $('#' + obj.id).closest('tr').find('[type=checkbox]').closest('td').next('td').text();

    if (CurrentULD.toLowerCase() != "bulk" && controlName == "TareWeight" && obj.value != "" && parseInt(obj.value) <= 0) {
        ShowMessage('warning', 'Information', "Tare weight should be greater than zero.");
        obj.value = "";
    }
    else if (controlName == "Weight" && obj.value != "" && parseInt(obj.value) <= 0) {
        ShowMessage('warning', 'Information', "Captured weight should be greater than zero.");
        obj.value = "";
    }
    else if (controlName == "Weight" && obj.value != "" && parseInt(obj.value) > 0) {
        var _TareWt = $('#' + obj.id.replace('Weight', 'TareWeight')).val();
        if (_TareWt != "" && parseInt(_TareWt) > parseInt(obj.value)) {
            ShowMessage('warning', 'Information', "Captured weight should be greater than Tare Weight.");
            obj.value = "";
        }
    }
}

function AssignFlight(AgentBuildUpSNo, UldStockSNo, FlightAssignFrom, index) {
    if ($("#dvAssignFlightPopUp").length > 0)
        $("#dvAssignFlightPopUp").remove();

    $("<div id=dvAssignFlightPopUp></div>").appendTo('body');
    $("#dvAssignFlightPopUp").append("<table border=\"0\" cellpadding='0' cellspacing='0' align=\"center\"><tr style=\"height:25px; font-weight:bold\"><td>Airline</td><td style=\"padding-left:10px\">Flight Date</td><td style=\"padding-left:10px\">Flight No</td><td style=\"padding-left:10px\">ULD Off Point</td></tr><tr><td> <input type=\"hidden\" name=\"txtAirlinePopUp\" id=\"txtAirlinePopUp\" value=\"\"><input id=\"Text_txtAirlinePopUp\" type=text style=\"width:150px\" name=\"Text_txtAirlinePopUp\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px\"><input type=\"text\" style='width:100px' id=\"txtFlightDt\"></td><td style=\"padding-left:10px\"><input type=\"hidden\" name=\"txtFlightNoPop\" id=\"txtFlightNoPop\" value=\"\"><input type=\"text\" id=\"Text_txtFlightNoPop\" name=\"Text_txtFlightNoPop\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px\"><input type=\"hidden\" name=\"txtOffPointPop\" id=\"txtOffPointPop\" value=\"\"><input type=\"text\" id=\"Text_txtOffPointPop\" name=\"Text_txtOffPointPop\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td></tr><tr align='center'  style=\"height:50px; text-align:bottom\"><td colspan='6'><input type=\"button\" value=\"Assign Flight\" class=\"btn btn-info\" id=\"btnAssign\" onclick=\"SaveAssignFlight(" + AgentBuildUpSNo + ", " + UldStockSNo + ",'" + FlightAssignFrom + "'," + index + ");\"><input type=\"button\" value=\"Unassign Flight\" class=\"btn btn-info\" id=\"btnUnAssign\" onclick=\"SaveUnAssignFlight(" + AgentBuildUpSNo + ", " + UldStockSNo + ",'" + FlightAssignFrom + "'," + index + ");\"><input type=\"button\" value=\"Push To Lying List\" style='display:none' class=\"btn btn-info\" id=\"btnPushToLyingList\" onclick=\"SavePushToLyingList(" + AgentBuildUpSNo + ", " + UldStockSNo + ",'" + FlightAssignFrom + "');\"></td></td></tr></table>");

    cfi.AutoComplete("txtAirlinePopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetSearch, "contains");
    cfi.AutoComplete("txtFlightNoPop", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], GetOffPoint, "contains");
    cfi.AutoComplete("txtOffPointPop", "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");

    $("#txtFlightDt").kendoDatePicker();
    $("#txtFlightDt").closest("span.k-datepicker").width(100);

    $("#txtFlightDt").kendoDatePicker({
        change: function () {
            ResetSearch();
        }
    });

    $("#dvAssignFlightPopUp").show();
    cfi.PopUp("dvAssignFlightPopUp", "Flight - Assign/Unassign", "800", null, null, 150);

    $("#Text_txtAirlinePopUp").data("kendoAutoComplete").setDefaultValue($("#Text_AirlineSNo").data("kendoAutoComplete").key(), $("#Text_AirlineSNo").data("kendoAutoComplete").value());
    $("#Text_txtAirlinePopUp").data("kendoAutoComplete").enable(false);

    if (FlightAssignFrom == "Weighing") {
        var _id = "AssignFlight_" + AgentBuildUpSNo + "_" + UldStockSNo;
        var flightnoDate = $('#' + _id).text();

        if (flightnoDate != "" && flightnoDate != "Assign Flight" && flightnoDate != "Push To Lying List") {
            var routing = "0-" + $('#hdnAssignFlightRoute_' + index).val(); // DailyFlightSNo-GroupFlightSNo;
            $("#Text_txtFlightNoPop").data("kendoAutoComplete").setDefaultValue(routing, $.trim(flightnoDate.split('/')[0]));
            $("#txtFlightDt").val($.trim(flightnoDate.split('/')[1]));

            var selectedOffPoint = $("#Text_ULDOffPoint_" + index).data("kendoAutoComplete").value();

            $("#Text_txtOffPointPop").data("kendoAutoComplete").setDefaultValue(selectedOffPoint, selectedOffPoint);
        }
        //else
        //    $("#txtFlightDt").val("");
    }

}
function getAssignEquipmentGrid() {
    $("#tblAssignEquipmentPopUp").appendGrid({
        tableID: "tblAssignEquipmentPopUp",
        contentEditable: true,
        masterTableSNo: parseInt($('#hdnAgentBuildupSNo').val()),
        currentPage: 1,
        itemsPerPage: 5,
        whereCondition: null,
        sort: "",
        servicePath: "./Services/Buildup/AgentBuildUpWeighingService.svc",
        getRecordServiceMethod: "GetBulkRecordForAssignEquipment",
        deleteServiceMethod: "",
        isGetRecord: true,
        caption: '',
        captionTooltip: 'Assign Equipment For BULK',
        initRows: 1,
        caption: '',
        captionTooltip: 'Assign Equipment',
        columns: [
                  { name: 'SNo', type: 'hidden', value: 0 },

                  { name: 'AgentBuildUpSNo', type: 'hidden', value: parseInt($('#hdnAgentBuildupSNo').val()) },

                  {
                      name: 'AWBNo', display: 'AWB No', type: 'text', ctrlAttr: { controltype: 'autocomplete', onChange: "return ChangeAWBNoAssignEquipment(this)" }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'AgentBuildUpTrans', textColumn: 'AWBNo', keyColumn: 'AWBSNo', isRequired: true
                  },

                  {
                      name: 'Pieces', display: 'Pieces', type: 'Text', ctrlCss: { width: '100px' }, ctrlAttr: {
                          maxlength: 14, controltype: "number"
                      }, isRequired: true
                  },
                   {
                       name: 'TotalPieces', type: 'hidden'
                   },
                   //{
                   //    name: 'EndPiece', display: 'End Piece', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: {
                   //        maxlength: 14, controltype: "decimal2"
                   //    }, isRequired: true
                   //},
                    {
                        name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, tableName: 'vwAllEquipment', textColumn: 'EquipmentNo', keyColumn: 'EquipmentSNo', isRequired: true
                    },

                   //{
                   //    name: 'ScaleWeight', display: 'Scale Weight', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: {
                   //        maxlength: 14, controltype: "decimal2"
                   //    }, isRequired: true
                   //},

        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: false,
            insert: true,
            append: false,
            updateAll: true
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            RowIndex = addedRowIndex.length;

            $('input[id^="tblAssignEquipmentPopUp_EquipmentNo"]').bind("keyup", function () {
                PutHyphenInEquipmentAssignEquipment($(this));
            });
        }
    });
    // $("#tblAssignEquipmentPopUp_tfoot").before('<div id="Button"><input type="button" value="Save" class="btn btn-success" id="btnGenerate" onclick="SaveReceiveStatus()"><input type="button" value="Validate" class="btn btn-success" id="btnGenerate" onclick="SaveReceiveStatus()"></div>')
    $("#tblAssignEquipmentPopUp_btnRemoveLast").after('<div id="Button" align="right"><input type="hidden" id=\"IsValidated\" value=\"0\"><input type="button" value="Validate" class="btn btn-success" id="btnValidateBulkRecordForAssignEquipment" onclick="ValidateBulkRecordForAssignEquipment()"><input type="button" value="Save" class="btn btn-success" id="btnSaveBulkRecordForAssignEquipment" onclick="SaveBulkRecordForAssignEquipment()"></div>')

    $('input[id^="tblAssignEquipmentPopUp_EquipmentNo"]').bind("keyup", function () {
        PutHyphenInEquipmentAssignEquipment($(this));
    });

}
function PutHyphenInEquipmentAssignEquipment(obj) {

    var EquipmentLength = $(obj).val().length;
    var firstchar = $(obj).val().charAt(0);
    if (firstchar != "" && $.isNumeric(firstchar) == false) {
        if (EquipmentLength == 3 || EquipmentLength == 7) {
            $(obj).val($(obj).val() + "-");
        }
    }
}
function ChangeAWBNoAssignEquipment(obj) {
    var index = obj.id.replace('tblAssignEquipmentPopUp_AWBNo_', '');
    $("#tblAssignEquipmentPopUp_Pieces_" + index).val('');
    $("#_temptblAssignEquipmentPopUp_Pieces_" + index).val('');
}
function getViewAssignEquipmentGrid() {
    $("#tblAssignEquipmentPopUp").appendGrid({
        tableID: "tblAssignEquipmentPopUp",
        contentEditable: true,
        masterTableSNo: parseInt($('#hdnAgentBuildupSNo').val()),
        currentPage: 1,
        itemsPerPage: 5,
        whereCondition: null,
        sort: "",
        servicePath: "./Services/Buildup/AgentBuildUpWeighingService.svc",
        getRecordServiceMethod: "GetViewBulkRecordForAssignEquipment",
        deleteServiceMethod: "",
        isGetRecord: true,
        caption: '',
        captionTooltip: 'Assign Equipment For BULK',
        initRows: 1,
        caption: '',
        captionTooltip: 'Assign Equipment',
        columns: [
                  { name: 'SNo', type: 'hidden', value: 0 },

                  { name: 'AgentBuildUpSNo', type: 'hidden', value: parseInt($('#hdnAgentBuildupSNo').val()) },

                  {
                      name: 'AWBNo', display: 'AWB No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'AgentBuildUpTrans', textColumn: 'AWBNo', keyColumn: 'AWBSNo'
                  },

                  {
                      name: 'Pieces', display: 'Pieces', type: 'Text', ctrlCss: { width: '100px' }, ctrlAttr: {
                          maxlength: 14, controltype: "number"
                      }
                  },
                   {
                       name: 'FlightDate', type: 'hidden'
                   },
                    {
                        name: 'FlightNo', type: 'hidden'
                    },
                      {
                          name: 'ScaleWeight', type: 'hidden'
                      },
                        {
                            name: 'OffPoint', type: 'hidden'
                        },

                    {
                        name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, tableName: 'vwAllEquipment', textColumn: 'EquipmentNo', keyColumn: 'EquipmentSNo'
                    },

        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: false,
            insert: true,
            append: false,
            updateAll: true
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            RowIndex = addedRowIndex.length;
        }
    });
}
function AssignEquipment(AgentBuildUpSNo, index) {
    if ($("#dvAssignEquipmentPopUp").length > 0)
        $("#dvAssignEquipmentPopUp").remove();
    if ($("#dvAssignEquipmentFlightPopUp").length > 0)
        $("#dvAssignEquipmentFlightPopUp").remove();
    $("<div id=dvAssignEquipmentPopUp><table id=\"tblAssignEquipmentPopUp\"></table></div>").appendTo('body');
    getAssignEquipmentGrid();
    cfi.PopUp("tblAssignEquipmentPopUp", "Assign Flight and UWS for BULK", 900, null, null, null);
    $("#tblAssignEquipmentPopUp").before('<div id="dvAssignEquipmentFlightPopUp"></div>');
    $("#dvAssignEquipmentFlightPopUp").append("<table border=\"0\" cellpadding='0' cellspacing='0' align=\"center\"><tr style=\"height:25px; font-weight:bold\"><td>Airline</td><td style=\"padding-left:10px\">Flight Date</td><td style=\"padding-left:10px\">Flight No</td><td style=\"padding-left:10px;display:none\">ULD Off Point</td></tr><tr><td> <input type=\"hidden\" name=\"txtAirlineAssignEquipmentFlightPopUp\" id=\"txtAirlineAssignEquipmentFlightPopUp\" value=\"\"><input id=\"Text_txtAirlineAssignEquipmentFlightPopUp\" type=text style=\"width:150px\" name=\"Text_txtAirlineAssignEquipmentFlightPopUp\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px\"><input type=\"text\" style='width:100px' id=\"txtFlightDtAssignEquipmentFlightPopUp\"></td><td style=\"padding-left:10px\"><input type=\"hidden\" name=\"txtFlightNoAssignEquipmentFlightPopUp\" id=\"txtFlightNoAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" name=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px;display:none\"><input type=\"hidden\" name=\"txtOffPointAssignEquipmentFlightPopUp\" id=\"txtOffPointAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtOffPointAssignEquipmentFlightPopUp\" name=\"Text_txtOffPointAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td></tr><tr align='center'  style=\"height:20px; text-align:bottom\"><td colspan='6'></td></td></tr></table>");

    cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetAssignEquipmentFlightSearch, "contains");
    cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], GetOffPointAssignEquipmentFlightPopUp, "contains");
    cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");

    $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker();
    $("#txtFlightDtAssignEquipmentFlightPopUp").closest("span.k-datepicker").width(100);
    $("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue($("#Text_AirlineSNo").data("kendoAutoComplete").key(), $("#Text_AirlineSNo").data("kendoAutoComplete").value());
    $("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").enable(false);

    $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker({
        change: function () {
            ResetAssignEquipmentFlightSearch();
        }
    });

    $("#tblAssignEquipmentPopUp").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });

}
function ViewAssignEquipment(AgentBuildUpSNo, index) {
    if ($("#dvAssignEquipmentPopUp").length > 0)
        $("#dvAssignEquipmentPopUp").remove();
    if ($("#dvAssignEquipmentFlightPopUp").length > 0)
        $("#dvAssignEquipmentFlightPopUp").remove();
    $("<div id=dvAssignEquipmentPopUp><table id=\"tblAssignEquipmentPopUp\"></table></div>").appendTo('body');
    getViewAssignEquipmentGrid();
    cfi.PopUp("tblAssignEquipmentPopUp", "Assign Flight and UWS for BULK", 900, null, null, null);
    $("#tblAssignEquipmentPopUp").before('<div id="dvAssignEquipmentFlightPopUp"></div>');
    $("#dvAssignEquipmentFlightPopUp").append("<table border=\"0\" cellpadding='0' cellspacing='0' align=\"center\"><tr style=\"height:25px; font-weight:bold\"><td>Airline</td><td style=\"padding-left:10px\">Flight Date</td><td style=\"padding-left:10px\">Flight No</td><td style=\"padding-left:10px;display:none\">ULD Off Point</td></tr><tr><td> <input type=\"hidden\" name=\"txtAirlineAssignEquipmentFlightPopUp\" id=\"txtAirlineAssignEquipmentFlightPopUp\" value=\"\"><input id=\"Text_txtAirlineAssignEquipmentFlightPopUp\" type=text style=\"width:150px\" name=\"Text_txtAirlineAssignEquipmentFlightPopUp\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px\"><input type=\"text\" style='width:100px' id=\"txtFlightDtAssignEquipmentFlightPopUp\"></td><td style=\"padding-left:10px\"><input type=\"hidden\" name=\"txtFlightNoAssignEquipmentFlightPopUp\" id=\"txtFlightNoAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" name=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px;display:none\"><input type=\"hidden\" name=\"txtOffPointAssignEquipmentFlightPopUp\" id=\"txtOffPointAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtOffPointAssignEquipmentFlightPopUp\" name=\"Text_txtOffPointAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td></tr><tr align='center'  style=\"height:20px; text-align:bottom\"><td colspan='6'></td></td></tr></table>");

    cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetAssignEquipmentFlightSearch, "contains");
    cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], GetOffPointAssignEquipmentFlightPopUp, "contains");
    cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");

    $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker();
    $("#txtFlightDtAssignEquipmentFlightPopUp").closest("span.k-datepicker").width(100);
    $("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue($("#Text_AirlineSNo").data("kendoAutoComplete").key(), $("#Text_AirlineSNo").data("kendoAutoComplete").value());
    $("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").enable(false);

    $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker({
        change: function () {
            ResetAssignEquipmentFlightSearch();
        }
    });

    $("#tblAssignEquipmentPopUp").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    ////////////////////hide/////////////////////
    $("#tblAssignEquipmentPopUp_btnAppendRow").hide();
    $("#tblAssignEquipmentPopUp_btnRemoveLast").hide();
    $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue($("#tblAssignEquipmentPopUp_FlightNo_1").val(), $("#tblAssignEquipmentPopUp_FlightNo_1").val());
    $("#txtFlightDtAssignEquipmentFlightPopUp").val($("#tblAssignEquipmentPopUp_FlightDate_1").val());
    var tempAssignedEquipment = []

    $('#tblAssignEquipmentPopUp >tbody >tr').each(function (i, e) {

        tempAssignedEquipment.push({
            "EquipmentNo": $("#tblAssignEquipmentPopUp_EquipmentNo_" + parseInt(i + 1)).val(),
            "ScaleWeight": $("#tblAssignEquipmentPopUp_ScaleWeight_" + parseInt(i + 1)).val(),
            "OffPoint": $("#tblAssignEquipmentPopUp_OffPoint_" + parseInt(i + 1)).val(),
        });
    });

    var html = "";
    var uniquetempAssignedEquipment = RemoveDuplicates(tempAssignedEquipment, "EquipmentNo");
    for (var i = 0; i < uniquetempAssignedEquipment.length; i++) {
        html = html + '<tr><td class=ui-widget-content>Equipment No :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].EquipmentNo + '</td><td class=ui-widget-content>Scale Weight :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].ScaleWeight + '</td><td class=ui-widget-content>Off Point :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].OffPoint + '</td></tr>'
    }
    $("#tblAssignEquipmentPopUp_btnRemoveLast").after("<table  id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + html + "</table>");
}
function RemoveDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
function ValidateBulkRecordForAssignEquipment() {

    var res = $("#tblAssignEquipmentPopUp tr[id^='tblAssignEquipmentPopUp']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAssignEquipmentPopUp');
    var dataDetails = JSON.parse(($('#tblAssignEquipmentPopUp').appendGrid('getStringJson')));
    var FlightNoAssignEquipmentFlightPopUp = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").val();

    if (dataDetails != false) {
        if (FlightNoAssignEquipmentFlightPopUp == "") {
            ShowMessage('warning', 'Warning', "Please Enter Flight No.");
        }
        else {
            $.ajax({
                url: "./Services/Buildup/AgentBuildUpWeighingService.svc/ValidateBulkRecordForAssignEquipment", async: false, type: "POST", dataType: "json", cache: false,

                data: JSON.stringify({ dataDetails: dataDetails }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var MsgTable = jQuery.parseJSON(result);
                    var MsgData = MsgTable.Table0;
                    if (MsgData[0].IsValidate == 1) {

                        if ($("#tblScaleWeightPopUp").length > 0) {
                            $("#tblScaleWeightPopUp").remove();
                        }
                        $("#IsValidated").val("1");
                        var OffPoint = $("#txtOffPointAssignEquipmentFlightPopUp").val();
                        $("#btnSaveBulkRecordForAssignEquipment").after("<table  id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                        $('#tblAssignEquipmentPopUp >tbody >tr').each(function (i, e) {
                            $("#" + $(this).find("input[id^='tblAssignEquipmentPopUp_EquipmentNo_']").attr("id")).data("kendoAutoComplete").enable(false);
                        });

                        var EDataLen = $('#tblScaleWeightPopUp tr').length;
                        for (var i = 1; i <= EDataLen; i++) {
                            cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");
                            if (OffPoint != "") {
                                $("#Text_Offpoint_" + i).val(OffPoint);
                                $("#Offpoint_" + i).val(OffPoint);
                            }

                        }
                        $("input[type='text'][id^='ScaleWeight_']").on("keypress keyup", function (event) {
                            ISNumeric(this);
                        });

                        //$('#tblScaleWeightPopUp tr').each(function (i, e) {
                        //    cfi.AutoComplete($(this).find("input[id^='Offpoint_']").attr("id"), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");
                        //})
                        //ShowMessage('success', 'Success!', "Amount Transferred Successfully");
                        //$("#tblAssignEquipmentPopUp").data("kendoWindow").close();
                    }
                    else if (MsgData[0].IsValidate == 0) {
                        if ($("#tblScaleWeightPopUp").length > 0) {
                            $("#tblScaleWeightPopUp").remove();
                        }
                        $("#IsValidated").val("0");
                        $("#btnSaveBulkRecordForAssignEquipment").after("<table    id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                        // ShowMessage('warning', '', "Contact Admin!");
                        //$("#tblAssignEquipmentPopUp").data("kendoWindow").close();

                    }
                    else
                        return;
                }
            });
        }
    }
}
function CheckEquipmentTareWeight(obj) {
    ISNumeric("#" + obj.id);
    var index = obj.id.replace('ScaleWeight_', '');
    if (parseFloat($("#" + obj.id).val()) < parseFloat($("#hdnNewTareWeight_" + index).val())) {
        ShowMessage('warning', 'Warning!', "Scale Weight should be greater than Tare Weight");
        $("#" + obj.id).val("");
    }

}
function SaveBulkRecordForAssignEquipment() {
    var UserSNo = userContext.UserSNo;
    var AirportSNo = userContext.AirportSNo;

    var EData = [];
    var ValidateEquipment = [];
    var EDataLen = $('#tblScaleWeightPopUp tr').length;
    var _DailyFlightSNo;
    _DailyFlightSNo = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key().split('-')[0];
    var IsEnterScaleWeight = 1;
    var IsEnterOffPoint = 1;
    for (var i = 1; i <= EDataLen; i++) {
        var EquipmentSNo = $("#hdnNewEquipmentSNo_" + i).val();
        var ScaleWeight = parseFloat($("#ScaleWeight_" + i).val());
        var OffPoint = $("#Offpoint_" + i).val();
        if (!(EquipmentSNo > 0 && ScaleWeight > 0)) {
            IsEnterScaleWeight = 0;
        }
        if (OffPoint == "") {
            IsEnterOffPoint = 0;
        }

        EData.push({
            "EquipmentSNo": EquipmentSNo,
            "ScaleWeight": ScaleWeight,
            "OffPoint": OffPoint
        });
    }
    if (_DailyFlightSNo == 0) {
        ShowMessage('warning', 'Warning!', "Please Enter Flight No.");
    }
    else if ($("#IsValidated").val() == "0") {
        ShowMessage('warning', 'Warning!', "Kindly Validate first");
    }
    else if (IsEnterScaleWeight == 0) {
        ShowMessage('warning', 'Warning!', "Please Enter Scale Weight");
    }
    else if (IsEnterOffPoint == 0) {
        ShowMessage('warning', 'Warning!', "Please Select Off Point");
    }
    else {
        var res = $("#tblAssignEquipmentPopUp tr[id^='tblAssignEquipmentPopUp']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        getUpdatedRowIndex(res, 'tblAssignEquipmentPopUp');
        var dataDetails = JSON.parse(($('#tblAssignEquipmentPopUp').appendGrid('getStringJson')));

        $.each(dataDetails, function (index, item) {
            ValidateEquipment.push({
                AWBNo: item.AWBNo,
                EquipmentSNo: item.HdnEquipmentNo,
                OffPoint: ""
            });
        });

        $.each(EData, function (index, item) {
            var currentEqp = item.EquipmentSNo;
            for (var i = 0; i < ValidateEquipment.length; i++) {
                if (ValidateEquipment[i]["EquipmentSNo"] == currentEqp) {
                    ValidateEquipment[i]["OffPoint"] = item.OffPoint;
                }
            }
        });

        var Msg = "";

        $.each(ValidateEquipment, function (index, item) {
            var currentAWB = item.AWBNo;
            var currentAWBOffPoint = item.OffPoint;
            if (!(Msg.indexOf(currentAWB) >= 0)) {
                for (var i = 0; i < ValidateEquipment.length; i++) {
                    if (ValidateEquipment[i]["AWBNo"] == currentAWB && ValidateEquipment[i]["OffPoint"] != currentAWBOffPoint) {
                        Msg = currentAWB + ',' + Msg;
                        break;
                    }
                }
            }

        });
        if (Msg != "") {
            jQuery.alerts.okButton = 'Yes';
            jQuery.alerts.cancelButton = 'No';
            var promptmsg = "AWB No " + Msg.substring(0, Msg.length - 1) + " assigned in multiple equipments with different Off-Point.\n Do you wish to continue?";
            var r = jConfirm(promptmsg, "", function (r) {
                if (r == true) {
                    if (dataDetails != false) {
                        $.ajax({
                            url: "./Services/Buildup/AgentBuildUpWeighingService.svc/SaveBulkRecordForAssignEquipment", async: false, type: "POST", dataType: "json", cache: false,

                            data: JSON.stringify({ dataDetails: dataDetails, ScaleWeightData: EData, dailyFlightSNo: _DailyFlightSNo, AirportSNo: AirportSNo, UserSNo: UserSNo }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                var MsgTable = jQuery.parseJSON(result);
                                var MsgData = MsgTable.Table0;
                                if (MsgData[0].IsValidate == 1) {
                                    ShowMessage('success', 'Success!', "Equipment Assigned Successfully");
                                    var HDNAgentBuildupAgentSNo = $('input[id^=tblAssignEquipmentPopUp_AgentBuildUpSNo_]').val();
                                    $('#AssignEquipmentLink').closest('tr').find("td:eq(0)").html("<a onclick=\"ViewAssignEquipment(" + HDNAgentBuildupAgentSNo + ")\" id=\"ViewAssignEquipmentLink\" style=\"cursor:pointer;color:blue\">" + 'BULK' + "</a>");
                                    var $link = $('#AssignEquipmentLink');
                                    var $span = $('<span>');
                                    var flight = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").value() + " / " + $("#txtFlightDtAssignEquipmentFlightPopUp").val();

                                    $link.after($span.html(flight)).remove();

                                    $("#tblAssignEquipmentPopUp").data("kendoWindow").close();
                                    //$("a#AssignEquipmentLink").replaceWith($("a#AssignEquipmentLink").text());

                                }
                                if (MsgData[0].IsValidate == 0) {
                                    if ($("#tblScaleWeightPopUp").length > 0) {
                                        $("#tblScaleWeightPopUp").remove();
                                    }
                                    $("#IsValidated").val("0");
                                    $("#btnSaveBulkRecordForAssignEquipment").after("<table    id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                                    //ShowMessage('warning', '', "Contact Admin!");

                                }
                                else
                                    return;
                            }
                        });
                    }
                }

            });
        }
        else {
            if (dataDetails != false) {
                $.ajax({
                    url: "./Services/Buildup/AgentBuildUpWeighingService.svc/SaveBulkRecordForAssignEquipment", async: false, type: "POST", dataType: "json", cache: false,

                    data: JSON.stringify({ dataDetails: dataDetails, ScaleWeightData: EData, dailyFlightSNo: _DailyFlightSNo, AirportSNo: AirportSNo, UserSNo: UserSNo }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var MsgTable = jQuery.parseJSON(result);
                        var MsgData = MsgTable.Table0;
                        if (MsgData[0].IsValidate == 1) {
                            ShowMessage('success', 'Success!', "Equipment Assigned Successfully");
                            var HDNAgentBuildupAgentSNo = $('input[id^=tblAssignEquipmentPopUp_AgentBuildUpSNo_]').val();
                            $('#AssignEquipmentLink').closest('tr').find("td:eq(0)").html("<a onclick=\"ViewAssignEquipment(" + HDNAgentBuildupAgentSNo + ")\" id=\"ViewAssignEquipmentLink\" style=\"cursor:pointer;color:blue\">" + 'BULK' + "</a>");
                            var $link = $('#AssignEquipmentLink');
                            var $span = $('<span>');
                            var flight = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").value() + " / " + $("#txtFlightDtAssignEquipmentFlightPopUp").val();

                            $link.after($span.html(flight)).remove();

                            $("#tblAssignEquipmentPopUp").data("kendoWindow").close();
                            //$("a#AssignEquipmentLink").replaceWith($("a#AssignEquipmentLink").text());

                        }
                        if (MsgData[0].IsValidate == 0) {
                            if ($("#tblScaleWeightPopUp").length > 0) {
                                $("#tblScaleWeightPopUp").remove();
                            }
                            $("#IsValidated").val("0");
                            $("#btnSaveBulkRecordForAssignEquipment").after("<table    id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                            //ShowMessage('warning', '', "Contact Admin!");

                        }
                        else
                            return;
                    }
                });
            }
        }

    }

}

function ResetSearch() {
    $("#Text_txtFlightNoPop").data("kendoAutoComplete").value("");
    $("#Text_txtFlightNoPop").data("kendoAutoComplete").key("");
    $("#Text_txtOffPointPop").data("kendoAutoComplete").setDefaultValue("", "");
}
function ResetAssignEquipmentFlightSearch() {
    $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").value("");
    $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key("");
    var EDataLen = $('#tblScaleWeightPopUp tr').length;
    for (var i = 1; i <= EDataLen; i++) {
        cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");
        $("#Text_Offpoint_" + i).data("kendoAutoComplete").setDefaultValue("", "");
    }

}
function SaveAssignFlight(_AgentBuildUpSNo, _UldStockSNo, AssignFrom, index) {

    if (AssignFrom == "XrayCompleted") {
        if ($("#Text_txtFlightNoPop").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Warning - Assign Flight', "Please Select Flight No.");
            return;
        }

        if ($('#txtFlightNoPop').val() == "") {
            ShowMessage('warning', 'Warning - Assign Flight', "Please Select Flight Date");
            return;
        }

        if ($("#Text_txtOffPointPop").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Warning - Assign Flight', "Please Select ULD Off Point");
            return;
        }

        var _DailyFlightSNo;
        _DailyFlightSNo = $("#Text_txtFlightNoPop").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_txtFlightNoPop").data("kendoAutoComplete").key().split('-')[0];

        var _ULDOffPoint = $("#Text_txtOffPointPop").data("kendoAutoComplete").value();


        $.ajax({
            url: "Services/BuildUp/AgentBuildUpWeighingService.svc/SaveAssignFlight", async: true, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AgentBuildUpSNo: _AgentBuildUpSNo, UldStockSNo: _UldStockSNo, DailyFlightSNo: _DailyFlightSNo, UserSNo: userContext.UserSNo, AirportSNo: userContext.AirportSNo, ULDOffPoint: _ULDOffPoint }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].Result == "Success") {

                    ShowMessage('success', 'ULD - Flight Assigned', "Flight Assigned Successfully", "bottom-right");

                    var $link = $('#AssignFlight_' + _AgentBuildUpSNo + "_" + _UldStockSNo);
                    var $span = $('<span>');
                    var flight = $("#Text_txtFlightNoPop").data("kendoAutoComplete").value() + " / " + $("#txtFlightDt").val();

                    $link.after($span.html(flight)).remove();

                    $('#tdOffPoint_' + _UldStockSNo).text(_ULDOffPoint);

                    var window = $("#dvAssignFlightPopUp");
                    window.data("kendoWindow").close();
                    return false;
                }
                else {
                    ShowMessage('warning', 'Warning', MsgData[0].Result);
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Information', "Error Occured!!!");

            }
        });

    }
    else if (AssignFrom == "Weighing") {

        if ($("#Text_txtFlightNoPop").data("kendoAutoComplete").value() == "" && $('#txtFlightDt').val() != "") {
            ShowMessage('warning', 'Warning - Assign Flight', "Please Select Flight No.");
            return;
        }

        if ($('#txtFlightDt').val() == "" && $("#Text_txtFlightNoPop").data("kendoAutoComplete").value() != "") {
            ShowMessage('warning', 'Warning - Assign Flight', "Please Select Flight Date");
            return;
        }

        if ($("#Text_txtOffPointPop").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Warning - Assign Flight', "Please Select ULD Off Point");
            return;
        }

        $('#hdnAssignFlight_' + _UldStockSNo).val($("#Text_txtFlightNoPop").data("kendoAutoComplete").key().split('-')[0]);

        if ($("#Text_txtFlightNoPop").data("kendoAutoComplete").value() != "")
            $("#AssignFlight_" + _AgentBuildUpSNo + "_" + _UldStockSNo).text($("#Text_txtFlightNoPop").data("kendoAutoComplete").value() + " / " + $("#txtFlightDt").val());
        else
            $("#AssignFlight_" + _AgentBuildUpSNo + "_" + _UldStockSNo).text("Assign Flight");

        $('#hdnAssignFlightRoute_' + index).val($("#Text_txtFlightNoPop").data("kendoAutoComplete").key().split('-')[1]);

        var SelectedOffPoint = $("#Text_txtOffPointPop").data("kendoAutoComplete").value();

        $("#Text_ULDOffPoint_" + index).data("kendoAutoComplete").setDefaultValue(SelectedOffPoint, SelectedOffPoint);


        var window = $("#dvAssignFlightPopUp");
        window.data("kendoWindow").close();
        return false;
    }
}

function IsJsonString(str) {
    try {
        jQuery.parseJSON(str);
    } catch (e) {
        return false;
    }
    return true;
}

function SaveUnAssignFlight(AgentBuildUpSNo, UldStockSNo, FlightAssignFrom, index) {
    $('#hdnAssignFlight_' + UldStockSNo).val("0");
    $("#AssignFlight_" + AgentBuildUpSNo + "_" + UldStockSNo).text("Assign Flight");

    if (FlightAssignFrom == "Weighing") {
        $("#Text_ULDOffPoint_" + index).data("kendoAutoComplete").setDefaultValue("", "");
        $('#hdnAssignFlightRoute_' + index).val("");
    }

    var window = $("#dvAssignFlightPopUp");
    window.data("kendoWindow").close();
    return false;
}

function SavePushToLyingList(AgentBuildUpSNo, UldStockSNo, FlightAssignFrom) {
    if (FlightAssignFrom == "Weighing") {
        $('#hdnAssignFlight_' + UldStockSNo).val("-1");
        $("#AssignFlight_" + AgentBuildUpSNo + "_" + UldStockSNo).text("Push To Lying List");
        var window = $("#dvAssignFlightPopUp");
        window.data("kendoWindow").close();
        return false;
    }
    else if (FlightAssignFrom == "XrayCompleted") {

        var _DailyFlightSNo;
        _DailyFlightSNo = -1;


        $.ajax({
            url: "Services/BuildUp/AgentBuildUpWeighingService.svc/SaveAssignFlight", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AgentBuildUpSNo: AgentBuildUpSNo, UldStockSNo: UldStockSNo, DailyFlightSNo: _DailyFlightSNo, UserSNo: userContext.UserSNo, AirportSNo: userContext.AirportSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (IsJsonString(result)) {
                    var MsgTable = jQuery.parseJSON(result);
                    var MsgData = MsgTable.Table0;
                    if (MsgData[0].Result == "Success") {

                        ShowMessage('success', 'ULD - Flight Assigned', "ULD Pushed Successfully in Lying List", "bottom-right");

                        var $link = $('#AssignFlight_' + AgentBuildUpSNo + "_" + UldStockSNo);
                        var $span = $('<span>');

                        $link.after($span.html("Pushed in Lying List")).remove();

                        var window = $("#dvAssignFlightPopUp");
                        window.data("kendoWindow").close();
                        return false;
                    }
                    else {
                        ShowMessage('warning', 'Warning', MsgData[0].Result);
                    }
                }
                else {
                    ShowMessage('warning', 'Information', "Error Occured!!!");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Information', "Error Occured!!!");

            }
        });
    }
}

function showChildAgentBuildUpULD(obj) {
    $("#dvChildAgentBuildUpPopUp").remove();
    $("#tblChildAgentBuildUp").remove();
    var AgentBuildUpSNo = $(obj).closest("tr").find("td[data-column='SNo']").text();
    //$("#dvUldStackPopUp").show();
    //$("<div  id=dvUldStackPopUp></div>").appendTo('body');
    $("<div id='dvChildAgentBuildUpPopUp'></div>").appendTo('body');
    $("#dvChildAgentBuildUpPopUp").append("<table align='center' id='tblChildAgentBuildUp' border=\"1\" class='WebFormTable1' style=\"border-collapse: collapse;\"><tr><td align='center' style=\"width:200px; height:25px;font-weight: bold;font-size: 9pt;color: #5A7570;font-family: Verdana;background-color: #F7F7F7\" class='formSection1'>ULD No</td><td align='center' style=\"width:200px; height:25px;font-weight: bold;font-size: 9pt;color: #5A7570;font-family: Verdana;background-color: #F7F7F7\" class='formSection1'>Weighing</td></tr>");
    if (AgentBuildUpSNo != "" || AgentBuildUpSNo != undefined) {
        $.ajax({
            url: "Services/BuildUp/AgentBuildUpWeighingService.svc/GetChildULDAgentBuildUpRecord",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AgentBuildUpSNo: AgentBuildUpSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var tableString = "";
                var resData = jQuery.parseJSON(result);

                var AgentBuildUpULDDetailsData = resData.Table0;


                $(AgentBuildUpULDDetailsData).each(function (index, value) {
                    tableString += "<tr><td align='center' class='formthreeInputcolumn1' style=\" height:25px\">" + value.ULDNo + "</td><td align='center' class='formthreeInputcolumn1' style=\" height:25px\">" + value.Weighing + "</td></tr>";
                });
                tableString += "</table>";
                $("#tblChildAgentBuildUp").append(tableString);
                // $('#tblConsumable').appendGrid('load', consumablesData);
            },
            error: function (error) {
                alert(error)
            }
        });
    }


    cfi.PopUp("dvChildAgentBuildUpPopUp", "Agent Build Up Weighing-ULD", "500", null, null, 50);
}

function RemoveLastComma(_item) {
    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 2, _item.length);
        if (iscomma == ", ") {
            var _item = _item.substring(0, _item.length - 2);
        }
    }
    return _item;
}

function GetOffPoint() {
    if ($("#Text_txtFlightNoPop").data("kendoAutoComplete").key() != "") {
        var str = $("#Text_txtFlightNoPop").data("kendoAutoComplete").key();
        var offPoint = str.split('-');
        if (offPoint.length > 2 && offPoint[2] != "") {
            $("#Text_txtOffPointPop").data("kendoAutoComplete").setDefaultValue(offPoint[2], offPoint[2]);
        }
        else {
            $("#Text_txtOffPointPop").data("kendoAutoComplete").setDefaultValue("", "");
        }
    }
}
function GetOffPointAssignEquipmentFlightPopUp() {
    if ($("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key() != "") {
        var str = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key();
        var offPoint = str.split('-');
        if (offPoint.length > 2 && offPoint[2] != "") {
            $("#Text_txtOffPointAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue(offPoint[2], offPoint[2]);
        }
        else {
            $("#Text_txtOffPointAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue("", "");
        }
    }
    var EDataLen = $('#tblScaleWeightPopUp tr').length;
    if (EDataLen > 0) {
        var str = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key();
        var offPoint = str.split('-');
        if (offPoint.length > 2 && offPoint[2] != "") {
            // $("#Text_txtOffPointAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue(offPoint[2], offPoint[2]);
            for (var i = 1; i <= EDataLen; i++) {
                $("#Text_Offpoint_" + i).data("kendoAutoComplete").setDefaultValue(offPoint[2], offPoint[2]);
            }
        }
        else {

            for (var i = 1; i <= EDataLen; i++) {
                $("#Text_Offpoint_" + i).data("kendoAutoComplete").setDefaultValue("", "");
            }
        }

    }
}