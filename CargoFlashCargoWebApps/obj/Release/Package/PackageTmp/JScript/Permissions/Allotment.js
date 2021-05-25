var PageType = "";
var DataIsValid = false;
var ExcludeScheduleTransSNo = '';
var ValidFromDate = '';
var ValidToDate = '';
var myOBJButton = '';
var AgentIsInternational = '2';
$(document).ready(function () {
    $('#MasterDuplicate').remove();
    PageType = getQueryStringValue("FormAction").toUpperCase();
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode", ["CarrierCode", "AirlineName"], selectAirline, "contains");
    cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], selectSector, "contains");
    cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], selectSector, "contains");
    cfi.AutoComplete("FlightNo", "FlightNo", "vw_FlightsFormSchedule", "SNo", "FlightNo", ["FlightNo", 'Vailidity'], selectFlight, "contains");
    cfi.AutoComplete("AllotmentType", "AllotmentType", "AllotmentType", "SNo", "AllotmentType", ["AllotmentType"], selectAllotmentType, "contains");
    cfi.AutoComplete("OfficeSNo", "Name", "vw_Office", "SNo", "Name", ["Name"], selectOffice, "contains");
    cfi.AutoComplete("AccountSNo", "Name", "AllotmentAgents", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("ShipperAccountSNo", "Name", "vw_AccountShipper", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("Commodity", "CommodityCode,CommodityDescription", "Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains", ",");
    cfi.AutoComplete("SHC", "code", "vwSPHC", "SNo", "code", ["code"], null, "contains", ",");
    cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains", ",");

    if (PageType == "NEW") {
        cfi.BindMultiValue("ProductSNo", $("#Text_ProductSNo").val(), $("#ProductSNo").val());
        cfi.BindMultiValue("Commodity", $("#Text_Commodity").val(), $("#Commodity").val());
        cfi.BindMultiValue("SHC", $("#Text_SHC").val(), $("#SHC").val());
    }
    $('input[type=radio][name=VolumeWeightType]').attr('disabled', true);
    $('input[type=radio][name=GrossWeightType]').attr('disabled', true);
    $('input[type=checkbox][id=Days]').click(function () {
        if (this.value == 0 && $('input[type=checkbox][id=Days][value=0]').is(':checked') == true) {
            $('input[type=checkbox][id=Days]').attr('checked', true);
        }
        else if (this.value == 0 && $('input[type=checkbox][id=Days][value=0]').is(':checked') == false) {
            $('input[type=checkbox][id=Days]').attr('checked', false);
        }
        else if ($('input[type=checkbox][id=Days]').not('[value=0]').not(':checked').length - 1 > -1) {
            $('input[type=checkbox][id=Days][value=0]').attr('checked', false);
        }
        else if ($('input[type=checkbox][id=Days]').not('[value=0]').not(':checked').length - 1 == -1) {
            $('input[type=checkbox][id=Days][value=0]').attr('checked', true);
        }
    });

    $('span#TotalGrossUnit,span#ReserveGrossUnit').after('&nbsp; <span id="slash" style="max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;"></span>');

    $('#GrossWeight,#VolumeWeight').after('&nbsp; <span id="pre" style="max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;"></span>');

    $('input[type=radio][name=IsSector]').click(function () {
        
        $('input[type=checkbox][id=Days]').removeAttr('disabled');
        $('input[type=checkbox][id=Days]').attr('checked', false);
        CheckSector();
    });

    if (PageType != "READ") {

        cfi.DateType("ValidFrom");
        $("#ValidFrom").change(function () {
            $('#ValidFrom').css('width', '150px');
            $('.k-datepicker').css('width', '150px');
            $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
                $("#ValidTo").data("kendoDatePicker").value('');
        });

        cfi.DateType("ValidTo");
        $("#ValidTo").change(function () {            
            $('#ValidTo').css('width', '150px');
            $('.k-datepicker').css('width', '150px');           
        });
        //$("#ValidFrom").kendoDatePicker({
        //    change: function (e) {
        //        selectedDate = $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
        //        console.warn(selectedDate);
        //        $("#ValidTo").data("kendoDatePicker").value('');
        //    },
        //    format:"dd-MMM-yyyy" ,
        //    //parseFormats:["yyyy/MM/dd"]
        //});
        $('#AllotmentReleaseTimeHr').css('text-align', 'right').after('<span>&nbsp;Hr.&nbsp;&nbsp;</span>');
        $('#AllotmentReleaseTimeMin').css('text-align', 'right').after('<span>&nbsp;Min.&nbsp;&nbsp;</span>');
        $('#GrossWeightVariance_P').before('<span id="GVariance_P">  Variance % </span>').after('<span>(+)</span>').css('text-align', 'right');
        $('#GrossWeightVariance_N').before('<span id="GVariance_N">  Variance % </span>').after('<span>(-)</span>').css('text-align', 'right');
        $('#VolumeVariance_P').before('<span id="VVariance_P">  Variance % </span>').after('<span>(+)</span>').css('text-align', 'right');
        $('#VolumeVariance_N').before('<span id="VVariance_N">  Variance % </span>').after('<span>(-)</span>').css('text-align', 'right');
    }

    $('#GrossWeightVariance_P, #GrossWeightVariance_N, #VolumeVariance_P, #VolumeVariance_N, #AllotmentReleaseTimeHr,#AllotmentReleaseTimeMin').on('keypress', function (e) {
        if (e.which != 8 && e.which != 0 && e.which != 9 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $('#AllotmentReleaseTimeHr,#AllotmentReleaseTimeMin').on('blur', function () {
        if ($('#AllotmentReleaseTimeMin').val() > 59) {
            ShowMessage('warning', '', "Min. can not be greater than 59.");
            $('#AllotmentReleaseTimeMin').val(0);
        }

        if (this.value == "") {
            this.value = 0;
        }
    });

    $('#ValidFrom').css('width', '150px');
    $('.k-datepicker').css('width', '150px');

    $('#GrossWeight').blur(function () {


        if ($('input[type=radio][name=IsSector][data-radioval=Yes]').is(':checked') == false) {

            if ($('#GrossWeight').val() != "" && $('#ReserveGross').val() != "" && (parseFloat($('#ReserveGross').val()) < parseFloat($('#GrossWeight').val()))) {
                ShowMessage('warning', 'Warning - Allotment', "Gross Weight should not be greater than Reserve Gross Weight.", "bottom-right");
                $('#_tempGrossWeight').val('');
                $('#GrossWeight').val('');
            }

            //if ($('#GrossWeight').val() != '') {
            //    var GWT = 0.00;
            //    GWT = (parseFloat($('#GrossWeight').val()) / 166.67);
            //    $('#_tempVolumeWeight').val(GWT.toFixed(3));
            //    $('#VolumeWeight').val(GWT.toFixed(3));
            //}
        }





        //if ($('input[id=GrossWeightType]:checked').val() == 1) {
        //    var AllotedVol = 0.00;
        //    if ($('span#ReserveGrossUnit').text() == 'LBS') {
        //        AllotedVol = parseFloat($('#ReserveGross').val());
        //        AllotedVol = AllotedVol / 2.20; // Convert to KG 
        //    }
        //    else if ($('span#ReserveGrossUnit').text() == 'KG') {
        //        AllotedVol = parseFloat($('#ReserveGross').val());
        //    }

        //    if ($('#GrossWeight').val() != "" && (AllotedVol < parseFloat($('#GrossWeight').val()))) {
        //        ShowMessage('warning', 'Warning - Allotment', "Gross Weight should not be greater than Reserve Gross Weight.", "bottom-right");
        //        $('#_tempGrossWeight').val('');
        //        $('#GrossWeight').val('');
        //    }
        //}
        //else if ($('input[id=GrossWeightType]:checked').val() == 2) {
        //    var AllotedVol = 0.00;
        //    if ($('span#ReserveGrossUnit').text() == 'KG') {
        //        AllotedVol = parseFloat($('#ReserveGross').val());
        //        AllotedVol = AllotedVol * 2.20; // Convert to LBS 
        //    }
        //    else if ($('span#ReserveGrossUnit').text() == 'LBS') {
        //        AllotedVol = parseFloat($('#ReserveGross').val());
        //    }

        //    if ($('#GrossWeight').val() != "" && (AllotedVol < parseFloat($('#GrossWeight').val()))) {
        //        ShowMessage('warning', 'Warning - Allotment', "Gross Weight should not be greater than Reserve Gross Weight.", "bottom-right");
        //        $('#_tempGrossWeight').val('');
        //        $('#GrossWeight').val('');
        //    }
        //}

    });

    $('#VolumeWeight').blur(function () {
        if ($('input[type=radio][name=IsSector][data-radioval=Yes]').is(':checked') == false) {
            if ($('#VolumeWeight').val() != "" && $('#ReserveVolume').val() != "" && (parseFloat($('#ReserveVolume').val()) < parseFloat($('#VolumeWeight').val()))) {
                ShowMessage('warning', 'Warning - Allotment', "Volume should not be greater than Reserve Volume.", "bottom-right");
                $('#_tempVolumeWeight').val('');
                $('#VolumeWeight').val('');
            }
        }
    });


   

    if (PageType == "NEW") {
        //$('#IsSector').attr('checked', true);
        $('input[type=radio][data-radioval=Include]').removeAttr('checked');
        CheckSector();
        selectAllotmentType();
    }
    else if (PageType == "EDIT") {
        if (new Date($("#ValidFrom").val()) < new Date()) {
            $("#ValidFrom").data('kendoDatePicker').enable(false);
            $("#ValidFrom").data('kendoDatePicker').min(new Date());
        }
        else {
            $("#ValidFrom").data('kendoDatePicker').min($('#FlightValidFrom').val());
            $("#ValidFrom").data('kendoDatePicker').max($('#FlightValidTo').val());
        }

        if (new Date($("#ValidTo").val()) < new Date()) {
            $("#ValidTo").data('kendoDatePicker').enable(false);
        }
        else {
            $("#ValidTo").data('kendoDatePicker').min($('#ValidFrom').val());
            $("#ValidTo").data('kendoDatePicker').max($('#FlightValidTo').val());
        }

        $('span#slash').text('/');

        CheckSector();

        if ($('#IsUsed').val() == 'True') {
            $('#GrossWeight').attr('disabled', true);
            $('#VolumeWeight').attr('disabled', true);
            $("#ValidFrom").data('kendoDatePicker').enable(false);
            $("#ValidTo").data('kendoDatePicker').enable(false);
            $('input[type=checkbox][name=Days]').attr('disabled', true);
            $('input[type=radio][name=IsActive]').attr('disabled', true);
        }
    }
    else if (PageType == 'READ') {
        $('span#slash').text('/');
        $('span#GrossWeightVariance_P').before('<span id="GVariance_P" style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">  Variance % &nbsp;</span>').after('<span style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">&nbsp;(+)</span>').css('text-align', 'right');
        $('span#GrossWeightVariance_N').before('<span id="GVariance_N" style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">  Variance % &nbsp;</span>').after('<span style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">&nbsp;(-)</span>').css('text-align', 'right');
        $('span#VolumeVariance_P').before('<span id="VVariance_P" style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">  Variance % &nbsp;</span>').after('<span style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">&nbsp;(+)</span>').css('text-align', 'right');
        $('span#VolumeVariance_N').before('<span id="VVariance_N" style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">  Variance % &nbsp;</span>').after('<span style = "max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;">&nbsp;(-)</span>').css('text-align', 'right');

    }

    ModeReadCheckSector();


    $('input[type=radio][name=CommodityType]').click(function (e) {
        if ($('#Commodity').val() == "") {
            ShowMessage('warning', 'Warning - Allotment', "Please select Commodity.", "bottom-right");
            e.preventDefault();
        }
    });
    $('input[type=radio][name=SHCType]').click(function (e) {
        if ($('#SHC').val() == "") {
            ShowMessage('warning', 'Warning - Allotment', "Please select SHC.", "bottom-right");
            e.preventDefault();
        }
    });
    $('input[type=radio][name=ProductType]').click(function (e) {
        if ($('#ProductSNo').val() == "") {
            ShowMessage('warning', 'Warning - Allotment', "Please select Product.", "bottom-right");
            e.preventDefault();
        }
    });
});

$('input[type=submit][name=operation]').unbind("click").click(function () {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }

    if ($('#AllotmentReleaseTimeHr').val() == 0 && $('#AllotmentReleaseTimeMin').val() == 0) {
        ShowMessage('warning', '', "Allotment Release Time should be greater than 0.");
        return false;
    }

    if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#OfficeSNo').val() == "" && $('#AccountSNo').val() == "" && $('#ShipperAccountSNo').val() == "")) {
        ShowMessage('warning', 'Warning - Allotment', "Office Name or Forwarder (Agent) or Shipper is required.", "bottom-right");
        return false;
    }

    else if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#OfficeSNo').val() != "" && $('#ShipperAccountSNo').val() != "")) {
        ShowMessage('warning', 'Warning - Allotment', "Either Office Name or Shipper is allowed to fill.", "bottom-right");
        $('#OfficeSNo').val('');
        $('#Text_OfficeSNo').val('');
        $('#AccountSNo').val('');
        $('#Text_AccountSNo').val('');
        $('#ShipperAccountSNo').val('');
        $('#Text_ShipperAccountSNo').val('');
        return false;
    }

    else if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#AccountSNo').val() != "" && $('#ShipperAccountSNo').val() != "")) {
        ShowMessage('warning', 'Warning - Allotment', "Either Forwarder (Agent) or Shipper is allowed to fill.", "bottom-right");
        $('#OfficeSNo').val('');
        $('#Text_OfficeSNo').val('');
        $('#AccountSNo').val('');
        $('#Text_AccountSNo').val('');
        $('#ShipperAccountSNo').val('');
        $('#Text_ShipperAccountSNo').val('');
        return false;
    }


        //else if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#OfficeSNo').val() != "" && $('#AccountSNo').val() != "")) {
        //    ShowMessage('warning', 'Warning - Allotment', "Either Office Name or Forwarder (Agent) is allowd to fill.", "bottom-right");
        //    $('#OfficeSNo').val('');
        //    $('#Text_OfficeSNo').val('');
        //    $('#AccountSNo').val('');
        //    $('#Text_AccountSNo').val('');
        //    $('#ShipperAccountSNo').val('');
        //    $('#Text_ShipperAccountSNo').val('');
        //    return false;
        //}

    else if (PageType == 'NEW' && $('#AllotmentType').val() == 4 && ($('#Commodity').val() == "" && $('#SHC').val() == "" && $('#ProductSNo').val() == "")) {
        ShowMessage('warning', 'Warning - Allotment', "Either Commodity,SHC or Product is required.", "bottom-right");
        return false;
    }

    if (PageType == 'NEW' && $('#Commodity').val() != "" && $('#SHC').val() != "") {
        ShowMessage('warning', 'Warning - Allotment', "Either Commodity or SHC is allowed to fill.", "bottom-right");
        $('#divMultiCommodity span[id]').click();
        $('#divMultiSHC span[id]').click();
        return false;
    }

    if (PageType == 'NEW' && $('#Commodity').val() != "" && $('input[type=radio][name=CommodityType]:checked').length == 0) {
        ShowMessage('warning', 'Warning - Allotment', "Commodity Type is required, if commodity is selected.", "bottom-right");
        return false;
    }
    else if (PageType == 'NEW' && $('#SHC').val() != "" && $('input[type=radio][name=SHCType]:checked').length == 0) {
        ShowMessage('warning', 'Warning - Allotment', "SHC Type is required, if SHC is selected.", "bottom-right");
        return false;
    }
    else if (PageType == 'NEW' && $('#ProductSNo').val() != "" && $('input[type=radio][name=ProductType]:checked').length == 0) {
        ShowMessage('warning', 'Warning - Allotment', "Product Type is required, if Product is selected.", "bottom-right");
        return false;
    }


    if (PageType == 'EDIT' && $('#IsUsed').val() == 'True') {
        ShowMessage('warning', 'Allotment!', 'It is already have been used, can not be allowed to update.');
        // e.preventdefault();
        return false;
    }

    if (DataIsValid == false) {
        ExcludeScheduleTransSNo = '';
        ValidateData(this);
        if (DataIsValid == true)
            return true;
        else
            return false;
    }

    DataIsValid = false;
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        AuditLogSaveNewValue("tbl");
    }
});

function selectAirline()
{
    $('#FlightNo').val('');
    $('#Text_FlightNo').val('');
    $('#ShipperAccountSNo').val('');
    $('#Text_ShipperAccountSNo').val('');
    $('#OfficeSNo').val('');
    $('#Text_OfficeSNo').val('');
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');

}
function selectSector()
{
    $('#FlightNo').val('');
    $('#Text_FlightNo').val('');
    CheckAgentInternationalDomestic();
}
function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_Commodity") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Commodity").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_SHC")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#SHC").val()), cfi.autoCompleteFilter(textId);


    else if (textId == "Text_AirlineSNo")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "IsInterline", "notin", 1), cfi.autoCompleteFilter(textId);

    else if (textId == "Text_ProductSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#ProductSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_DestinationSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_OriginSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_FlightNo") {
        cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        cfi.autoCompleteFilter(filterEmbargo);
        cfi.setFilter(filterEmbargo, "OriginAirportSNo", "eq", $("#Text_OriginSNo").data("kendoAutoComplete").key());
        cfi.autoCompleteFilter(filterEmbargo);
        cfi.setFilter(filterEmbargo, "DestinationAirportSNo", "eq", $("#Text_DestinationSNo").data("kendoAutoComplete").key());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }

    else if (textId == "Text_AccountSNo") {
        if ($('#OfficeSNo').val() != '') {
            cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#AirlineSNo").val());
            cfi.setFilter(filterEmbargo, "CustomerType", "in", AgentIsInternational);
            cfi.autoCompleteFilter(filterEmbargo);
            cfi.setFilter(filterEmbargo, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoAutoComplete").key());           
        }
        else {
            cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#AirlineSNo").val());
            cfi.setFilter(filterEmbargo, "CustomerType", "in", AgentIsInternational);
        }
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }

    else if (textId == "Text_ShipperAccountSNo")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "AirlineSNo", "eq", $("#AirlineSNo").val()), cfi.autoCompleteFilter(textId);

    else if (textId == "Text_OfficeSNo")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "AirlineSNo", "eq", $("#AirlineSNo").val()), cfi.autoCompleteFilter(textId);

    else if (textId == "Text_AllotmentType")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "IsActive", "eq", 1), cfi.autoCompleteFilter(textId);
}

function selectOffice()
{
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');
}

function selectFlight() {
    var SNo = "";
    SNo = $('#FlightNo').val();    
    $('#_tempGrossWeight').val('');
    $('#GrossWeight').val('');    
    $('#_tempVolumeWeight').val('');
    $('#VolumeWeight').val('');
    $("#ValidFrom").data("kendoDatePicker").value('');
    $("#ValidTo").data("kendoDatePicker").value('');
    if (FlightNo != "") {
        $.ajax({
            url: "./Services/Permissions/AllotmentService.svc/GetFlightDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: SNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var es = JSON.parse(result);
                if (es.Table0 != "") {

                    $('#TotalGross').val(es.Table0[0].TotalGross);
                    $('span#TotalGross').text(es.Table0[0].TotalGross);
                    $('#TotalGrossUnit').val(es.Table0[0].GrossUnit);
                    $('span#TotalGrossUnit').text(es.Table0[0].GrossUnit);

                    $('span#slash').text('/');

                    $('#TotalVolume').val(es.Table0[0].TotalVolume);
                    $('span#TotalVolume').text(es.Table0[0].TotalVolume);
                    $('#TotalVolumeUnit').val(es.Table0[0].VolumeUnit);
                    $('span#TotalVolumeUnit').text(es.Table0[0].VolumeUnit);


                    $('#ReserveGross').val(es.Table0[0].ReserveGross);
                    $('span#ReserveGross').text(es.Table0[0].ReserveGross);
                    $('#ReserveGrossUnit').val(es.Table0[0].GrossUnit);
                    $('span#ReserveGrossUnit').text(es.Table0[0].GrossUnit);

                    $('span#slash').text('/');

                    $('#ReserveVolume').val(es.Table0[0].ReserveVolume);
                    $('span#ReserveVolume').text(es.Table0[0].ReserveVolume);
                    $('#ReserveVolumeUnit').val(es.Table0[0].VolumeUnit);
                    $('span#ReserveVolumeUnit').text(es.Table0[0].VolumeUnit);

                    $('#FlightDaysOfOps').val(es.Table0[0].FlightDaysOfOps);

                    ValidFromDate = new Date(es.Table0[0].StartDate) > new Date() ? es.Table0[0].StartDate : new Date();
                    ValidToDate = es.Table0[0].EndDate;
                    $("#ValidFrom").data("kendoDatePicker").value('');
                    $("#ValidTo").data("kendoDatePicker").value('');
                    $("#ValidFrom").data("kendoDatePicker").min(ValidFromDate);
                    $("#ValidFrom").data("kendoDatePicker").max(ValidToDate);
                    $("#ValidTo").data("kendoDatePicker").min(ValidFromDate);
                    $("#ValidTo").data("kendoDatePicker").max(ValidToDate);

                    if (es.Table0[0].GrossUnit == 'KG') {
                        $('input[type=radio][name=GrossWeightType][data-radioval=KG]').removeAttr('disabled');
                        $('input[type=radio][name=GrossWeightType][data-radioval=KG]').click();
                        $('input[type=radio][name=GrossWeightType][data-radioval=KG]').attr('disabled', true);

                    }
                    else if (es.Table0[0].GrossUnit == 'LBS') {
                        $('input[type=radio][name=GrossWeightType][data-radioval=LBS]').removeAttr('disabled');
                        $('input[type=radio][name=GrossWeightType][data-radioval=LBS]').click();
                        $('input[type=radio][name=GrossWeightType][data-radioval=LBS]').attr('disabled', true);
                    }
                    if (es.Table0[0].VolumeUnit == 'CBM') {
                        $('input[type=radio][name=VolumeWeightType][data-radioval=CBM]').removeAttr('disabled');
                        $('input[type=radio][name=VolumeWeightType][data-radioval=CBM]').click();
                        $('input[type=radio][name=VolumeWeightType][data-radioval=CBM]').attr('disabled', true);
                    }
                    $('input[type=radio][name=VolumeWeightType]').attr('disabled', true);
                    $('input[type=radio][name=GrossWeightType]').attr('disabled', true);

                    var Array = [];
                    Array.push(es.Table0[0].FlightDaysOfOps.split(','));
                    $('input[name=Days]').removeAttr('disabled');
                    for (var i = 0; i < Array[0].length; i++) {
                        if (Array[0][i] != "") {
                            $('input[name=Days][value=' + Array[0][i] + ']').removeAttr('checked').attr('disabled', true);
                            $('input[name=Days][value=0]').removeAttr('checked').attr('disabled', true);
                        }
                    }
                    $('input[type=checkbox][id=Days]:enabled').attr('checked', true);
                    //$('#AllotedGrossWeight').val(es.Table0[0].GrossWeight);
                    //$('span#AllotedGrossWeight').text(es.Table0[0].GrossWeight);
                    //$('#AllotedVolume').val(es.Table0[0].VolumeWeight);
                    //$('span#AllotedVolume').text(es.Table0[0].VolumeWeight);
                    //$('span#VolumeType').text(es.Table0[0].VolumeType);
                    //$('span#GrossType').text(es.Table0[0].GrossType);
                    //$('#_tempGrossWeight').val('');
                    //$('#GrossWeight').val('');
                    //$('#_tempVolumeWeight').val('');
                    //$('#VolumeWeight').val('');
                }
            }
        });
    }
}

function selectAllotmentType() {
    if ($('#AllotmentType').val() == 4) {
        $('#OfficeSNo').val('');
        $('#Text_OfficeSNo').val('');
        $("#Text_OfficeSNo").data("kendoAutoComplete").enable(false);
        $('#AccountSNo').val('');
        $('#Text_AccountSNo').val('');
        $('#Text_AccountSNo').data("kendoAutoComplete").enable(false);
        $('#ShipperAccountSNo').val('');
        $('#Text_ShipperAccountSNo').val('');
        $('#Text_ShipperAccountSNo').data("kendoAutoComplete").enable(false);
    }
    else {
        $("#Text_OfficeSNo").data("kendoAutoComplete").enable(true);
        $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
        $('#Text_ShipperAccountSNo').data("kendoAutoComplete").enable(true);
    }
}

function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);

        });
    }
    else {

        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}

function CheckSector() {
    if ($('input[type=radio][name=IsSector][data-radioval=Yes]').is(':checked') == true) {

        $('#_tempGrossWeight').val('');
        $('#GrossWeight').val('');
        $('#VolumeWeight').val('');
        $('#_tempVolumeWeight').val('');

        $('span#spnFlightNo').closest('td').find('*').hide();
        $('#Text_FlightNo').closest('td').find('*').hide();
        $('#Text_FlightNo').removeAttr('data-valid');
        $('#spnTotalGrossVolume').closest('td').closest('tr').hide();
        $('span#pre').text('%');
        $('#GrossWeight,#VolumeWeight').attr('maxlength', '2');


        $('#TotalGross').val('');
        $('span#TotalGross').text('');
        $('#TotalGrossUnit').val('');
        $('span#TotalGrossUnit').text('');

        $('span#slash').text('');

        $('#TotalVolume').val('');
        $('span#TotalVolume').text('');
        $('#TotalVolumeUnit').val('');
        $('span#TotalVolumeUnit').text('');


        $('#ReserveGross').val('');
        $('span#ReserveGross').text('');
        $('#ReserveGrossUnit').val('');
        $('span#ReserveGrossUnit').text('');

        $('#ReserveVolume').val('');
        $('span#ReserveVolume').text('');
        $('#ReserveVolumeUnit').val('');
        $('span#ReserveVolumeUnit').text('');

        var OriginAirportSNo = "";
        var DestinationAirportSNo = "";
        OriginAirportSNo = $('#OriginSNo').val();
        DestinationAirportSNo = $('#DestinationSNo').val();
        if (OriginAirportSNo != "" && DestinationAirportSNo != "") {
            $.ajax({
                url: "./Services/Permissions/AllotmentService.svc/GetSectorDetails", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ OriginAirportSNo: OriginAirportSNo, DestinationAirportSNo: DestinationAirportSNo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var es = JSON.parse(result);
                    if (es.Table0 != "") {
                        ValidFromDate = new Date(es.Table0[0].StartDate) > new Date() ? es.Table0[0].StartDate : new Date();
                        ValidToDate = es.Table0[0].EndDate;
                        $("#ValidFrom").data("kendoDatePicker").value('');
                        $("#ValidTo").data("kendoDatePicker").value('');
                        $("#ValidFrom").data("kendoDatePicker").min(ValidFromDate);
                        $("#ValidFrom").data("kendoDatePicker").max(ValidToDate);
                        $("#ValidTo").data("kendoDatePicker").min(ValidFromDate);
                        $("#ValidTo").data("kendoDatePicker").max(ValidToDate);
                    }
                }
            });
        }


    }
    else if ($('input[type=radio][name=IsSector][data-radioval=Yes]').is(':checked') == false) {
        $('span#spnFlightNo').closest('td').find('*').show();
        $('#Text_FlightNo').closest('td').find('*').show();
        $('#Text_FlightNo').attr('data-valid', 'required');
        $('span#pre').text('');
        $('#spnTotalGrossVolume').closest('td').closest('tr').show();
        $('#GrossWeight').attr('maxlength', '7');
        $('#VolumeWeight').attr('maxlength', '9');
        //$('span#spnOriginSNo').closest('td').hide();
        //$('#Text_OriginSNo').closest('td').hide();
        //$('span#spnDestinationSNo').closest('td').hide();
        //$('#Text_DestinationSNo').closest('td').hide();        
        //$('#Text_OriginSNo').removeAttr('data-valid');
        //$('#Text_DestinationSNo').removeAttr('data-valid');
    }

    if (PageType != 'EDIT') {
        $('#Text_FlightNo').val('');
        $('#FlightNo').val('');
        //$('#Text_OriginSNo').val('');
        //$('#OriginSNo').val('');
        //$('#Text_DestinationSNo').val('');
        //$('#DestinationSNo').val('');
    }

}

function ModeReadCheckSector() {
    if (PageType == 'READ') {
        if ($('span#Sector').text() == "YES") {
            $('span#spnFlightNo').closest('td').find('*').hide();
            $('#Text_FlightNo').closest('td').find('*').hide();

            //$('span#spnOriginSNo').closest('td').show();
            //$('#Text_OriginSNo').closest('td').show();
            //$('span#spnDestinationSNo').closest('td').show();
            //$('#Text_DestinationSNo').closest('td').show();
        }
        else if ($('span#Sector').text() == "NO") {
            $('span#spnFlightNo').closest('td').find('*').show();
            $('#Text_FlightNo').closest('td').find('*').show();

            //$('span#spnOriginSNo').closest('td').hide();
            //$('#Text_OriginSNo').closest('td').hide();
            //$('span#spnDestinationSNo').closest('td').hide();
            //$('#Text_DestinationSNo').closest('td').hide();

        }
    }

}


function ValidateData(obj) {
    var AirlineSNo = PageType == "EDIT" ? "0" : $('#AirlineSNo').val();
    var AllotmentSNo = $('#RecordID').val() != undefined ? $('#RecordID').val() : "0";
    var IsSector = PageType == "EDIT" ? 0 : $('input[type=radio][name=IsSector]:checked').val();
    var OriginSNo = PageType == "EDIT" ? "0" : $('#OriginSNo').val();
    var DestinationSNo = PageType == "EDIT" ? "0" : $('#DestinationSNo').val();
    var ScheduleTransSNo = PageType == "EDIT" ? "0" : $('#FlightNo').val();
    var GrossWeight = $('#GrossWeight').val();
    var VolumeWeight = $('#VolumeWeight').val();
    var ValidFrom = $('#ValidFrom').val();
    var ValidTo = $('#ValidTo').val();
    var Days = ""; $('[name=Days]:checked').each(function () { Days = Days + $(this).val() + ','; }); Days = Days.substring(0, Days.length - 1);
    var AllotmentTypeSNo = PageType == "EDIT" ? "0" : $('#AllotmentType').val();
    var AccountSNo = PageType == "EDIT" || $('#AccountSNo').val()=="" ? "0" : $('#AccountSNo').val();
    var ShipperAccountSNo = PageType == "EDIT" || $('#ShipperAccountSNo').val()=="" ? "0" : $('#ShipperAccountSNo').val();
    var OfficeSNo = PageType == "EDIT" || $('#OfficeSNo').val()=="" ? "0" : $('#OfficeSNo').val();
    var CommoditySNo = PageType == "EDIT" ? "" : $('#Commodity').val();
    var SHCSNo = PageType == "EDIT" ? "" : $('#SHC').val();
    var ProductSNo = PageType == "EDIT" ? "" : $('#ProductSNo').val();
    $("#ValidateData").html('');
    $("#ValidateData").append('<table  id="ValidateDataTbl" style="margin: 0px auto; border: 1px solid black; border-collapse: collapse;"></table>');

    var Str = '<tr><th class="ui-widget-header" style="width:5%; border: 1px solid black; "><span>S.No.</span></th><th class="ui-widget-header" style="width:15%;text-align:center; border: 1px solid black; "><span>Flight No</span></th><th class="ui-widget-header" style="width:15%;text-align:center; border: 1px solid black; "><span>Flight Date </span></th><th class="ui-widget-header" style="width:65%; text-align:center; border: 1px solid black; "><span>Message</span></th></tr>';
    $.ajax({
        url: "./Services/Permissions/AllotmentService.svc/ValidateData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({
            AirlineSNo: AirlineSNo, AllotmentSNo: AllotmentSNo, IsSector: IsSector, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo, ScheduleTransSNo: ScheduleTransSNo,
            GrossWeight: GrossWeight, VolumeWeight: VolumeWeight, ValidFrom: ValidFrom, ValidTo: ValidTo, Days: Days,
            AllotmentTypeSNo: AllotmentTypeSNo, AccountSNo: AccountSNo, ShipperAccountSNo: ShipperAccountSNo, OfficeSNo: OfficeSNo, CommoditySNo: CommoditySNo,
            SHCSNo: SHCSNo, ProductSNo: ProductSNo
        }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var es = JSON.parse(result);
            if (es.Table0 != "") {
                for (var i = 0; i < es.Table0.length; i++) {
                    if (es.Table0[i].isValid == "0") {
                        ExcludeScheduleTransSNo = ExcludeScheduleTransSNo + es.Table0[i].ScheduleTransSNo + ',';

                    }
                }
                if (ExcludeScheduleTransSNo != "") {
                    ExcludeScheduleTransSNo.substring(0, ExcludeScheduleTransSNo.length - 1);
                    $('#ExcludeScheduleTransSNo').val(ExcludeScheduleTransSNo);
                }
            }

            if (es.Table1 != "") {

                for (var i = 0; i < es.Table1.length; i++) {
                    Str += '<tr> <td  style="width:5%; border: 1px solid black;text-align:center; ">' + es.Table1[i].RSNo + '</td> <td style="width:15%; border: 1px solid black; text-align:center; ">' + es.Table1[i].FlightNo + '</td> <td style="width:15%; border: 1px solid black; text-align:center; color:red; ">' + es.Table1[i].AllotmentDate + '</td> <td style="width:65%; border: 1px solid black; text-align:left; color:red; ">' + es.Table1[i].ErrorMessage + '</td> </tr>';
                }
                $('#ValidateDataTbl').append(Str);

                if (IsSector == true)
                    DialogBoxForSecorWise(obj);
                else
                    DialogBoxForFlight();

            }
            else {
                DataIsValid = true;
                return true;
            }
        }
    });
}

function DialogBoxForSecorWise(Myobj) {


    myOBJButton = "input[type=" + Myobj.type + "][name=" + Myobj.name + "][value=" + Myobj.value + "]";
    $("#ValidateData").dialog(
    {
        autoResize: true,
        maxWidth: 650,
        maxHeight: 550,
        width: 650,
        height: 350,
        modal: true,
        title: 'In-Valid Records',
        draggable: true,
        resizable: false,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
                DataIsValid = true;
                $("" + myOBJButton + "").click();
                return true;
            },
            Cancel: function () {
                $(this).dialog("close");
                DataIsValid = false;
                return false;
            }
        },
        close: function () {
            DataIsValid = false;
            $(this).dialog("close");
            return false;
        }
    });
}


function DialogBoxForFlight() {

    $("#ValidateData").dialog(
    {
        autoResize: true,
        maxWidth: 650,
        maxHeight: 550,
        width: 650,
        height: 350,
        modal: true,
        title: 'In-Valid Records',
        draggable: true,
        resizable: false,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
                DataIsValid = false;
                return false;
            }
        },
        close: function () {
            DataIsValid = false;
            $(this).dialog("close");
            return false;
        }
    });
}


function CheckAgentInternationalDomestic()
{
    var OriginAirportSNo=$('#OriginSNo').val();
    var DestinationAirportSNo=$('#DestinationSNo').val();
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');
    if(OriginAirportSNo!="" && DestinationAirportSNo!="")
    {
        $.ajax({
            url: "./Services/Permissions/AllotmentService.svc/CheckAgentInternationalDomestic", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ OriginAirportSNo: OriginAirportSNo, DestinationAirportSNo: DestinationAirportSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined && result != '') {
                    AgentIsInternational = '2,'+result;
                }
                else 
                    AgentIsInternational = '2';
            },
            error:function (orb) {
                AgentIsInternational = '2';
            }
        });
    }
    else
        AgentIsInternational = '2';

}