var PageType = "";
var DataIsValid = false;
var ExcludeScheduleTransSNo = '';
var ValidFromDate = '';
var ValidToDate = '';
var myOBJButton = '';
var AgentIsInternational = '2';
var AllotmentMaster = [];
var AllotmentValidGrid = [];
$(document).ready(function () {
   
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $('#MasterDuplicate').remove();
    $("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
    $("#AirlineSNo").val(userContext.AirlineSNo);
    PageType = getQueryStringValue("FormAction").toUpperCase();
  
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Allotment_Airline", selectAirline, "contains");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "Allotment_Airport", selectSector, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "Allotment_Airport", selectSector, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Allotment_DailyFlightNo", selectFlight, "contains");
    cfi.AutoCompleteV2("AllotmentType", "AllotmentType", "Allotment_AllotmentType", selectAllotmentType, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "Name", "Allotment_Office", selectOffice, "contains");
    cfi.AutoCompleteV2("AccountSNo", "AccountCode,Name", "Allotment_Agent", null, "contains");
    cfi.AutoCompleteV2("ShipperAccountSNo", "Name", "Allotment_Shipper", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "Allotment_Commodity", null, "contains", ",");
    cfi.AutoCompleteV2("SHC", "code", "Allotment_SHC", null, "contains", ",");
    cfi.AutoCompleteV2("ProductSNo", "ProductName", "Allotment_Product", null, "contains", ",");

    $('#SearchAllotment').parent('td').parent('tr').find('td:eq(1)').html('').html('<div><input type="hidden" name="SHFlightNo" id="SHFlightNo" value=""><span><input type="text" class="k-input" name="Text_SHFlightNo" id="Text_SHFlightNo" style="text-transform: uppercase;" colname="flight no" tabindex="6" controltype="autocomplete" maxlength="" value="" data-role="autocomplete" autocomplete="off"></span></div>');
    cfi.AutoCompleteV2("SHFlightNo", "FlightNo", "Allotment_Flights", null, "contains");
    //$("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
    //$("#AirlineSNo").val(userContext.AirlineSNo);
    if (PageType == "NEW") {
        //$("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
        //$("#AirlineSNo").val(userContext.AirlineSNo);
        $('input[type="button"][value="Back"]').before('<input type="button" name="validate" value="Submit" onclick="ValidateAllotment()" ondblclick="function(){return false}" class="btn btn-success">');
        cfi.BindMultiValue("ProductSNo", $("#Text_ProductSNo").val(), $("#ProductSNo").val());
        cfi.BindMultiValue("Commodity", $("#Text_Commodity").val(), $("#Commodity").val());
        cfi.BindMultiValue("SHC", $("#Text_SHC").val(), $("#SHC").val());

        $('#AllotmentReleaseTimeHr').css('text-align', 'right').after('<span>&nbsp;Hr.&nbsp;&nbsp;</span>');
        $('#AllotmentReleaseTimeMin').css('text-align', 'right').after('<span>&nbsp;Min.&nbsp;&nbsp;</span>');
        $('#GrossWeightVariance_P').before('<span id="GVariance_P">  Variance % </span>').after('<span>(+)</span>').css('text-align', 'right');
        $('#GrossWeightVariance_N').before('<span id="GVariance_N">  Variance % </span>').after('<span>(-)</span>').css('text-align', 'right');
        $('#VolumeVariance_P').before('<span id="VVariance_P">  Variance % </span>').after('<span>(+)</span>').css('text-align', 'right');
        $('#VolumeVariance_N').before('<span id="VVariance_N">  Variance % </span>').after('<span>(-)</span>').css('text-align', 'right');

        cfi.DateType("ValidFrom");
        $("#ValidFrom").data("kendoDatePicker").min(new Date())
        $("#ValidFrom").change(function () {
            $('#ValidFrom').css('width', '150px');
            $('.k-datepicker').css('width', '150px');
            $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
            $("#ValidTo").data("kendoDatePicker").value('');
        });

        cfi.DateType("ValidTo");
        $("#ValidTo").data("kendoDatePicker").min(new Date());
        $("#ValidTo").change(function () {
            $('#ValidTo').css('width', '150px');
            $('.k-datepicker').css('width', '150px');
        });

        $('#ValidFrom').css('width', '150px');       
    }
    $('.k-datepicker').css('width', '150px');
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

    //$('input[type=radio][name=AllotmentBasedOn]').click(function () {

    //    $('input[type=radio][name=IsSector][value=0]').attr('checked', true);
    //    $('input[type=radio][name=IsSector]').removeAttr('disabled');
    //    $('input[type=radio][name=IsSector][value=0]').click();
        
    //    if ($(this).val() == 1)
    //    {
            
    //        $('input[type=radio][name=IsSector]').removeAttr('checked');
    //        $('input[type=radio][name=IsSector]').attr('disabled', true);
            
    //        cfi.ResetAutoComplete("FlightNo");
    //        var dataSource = GetDataSourceV2("Text_FlightNo", "Allotment_DailyFlightNo");
    //        cfi.ChangeAutoCompleteDataSource("FlightNo", dataSource, false, selectFlight, "FlightNo,Vailidity", "contains");
    //    }
    //    else 
    //    {
    //        cfi.ResetAutoComplete("FlightNo");
    //        var dataSource = GetDataSourceV2("Text_FlightNo", "Allotment_FlightNo");
    //        cfi.ChangeAutoCompleteDataSource("FlightNo", dataSource, false, selectFlight, "FlightNo,Vailidity", "contains");
    //    }
    //});

    $('input[type=radio][name=IsSector]').click(function () {
        
        //$('input[type=checkbox][id=Days]').removeAttr('disabled');
        $('input[type=checkbox][id=Days]').attr('checked', false);
        CheckSector();
    });

    //if (PageType != "READ" && PageType != "INDEXVIEW") {        
    //    //$("#ValidFrom").kendoDatePicker({
    //    //    change: function (e) {
    //    //        selectedDate = $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
    //    //        console.warn(selectedDate);
    //    //        $("#ValidTo").data("kendoDatePicker").value('');
    //    //    },
    //    //    format:"dd-MMM-yyyy" ,
    //    //    //parseFormats:["yyyy/MM/dd"]
    //    //});
        
    //}

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

   

    //$('#GrossWeight').blur(function () {


    //    if ($('input[type=radio][name=IsSector][data-radioval=Yes]').is(':checked') == false) {

    //        if ($('#GrossWeight').val() != "" && $('#ReserveGross').val() != "" && (parseFloat($('#ReserveGross').val()) < parseFloat($('#GrossWeight').val()))) {
    //            ShowMessage('warning', 'Warning - Allotment', "Gross Weight should not be greater than Reserve Gross Weight.", "bottom-right");
    //            $('#_tempGrossWeight').val('');
    //            $('#GrossWeight').val('');
    //        }

    //        //if ($('#GrossWeight').val() != '') {
    //        //    var GWT = 0.00;
    //        //    GWT = (parseFloat($('#GrossWeight').val()) / 166.67);
    //        //    $('#_tempVolumeWeight').val(GWT.toFixed(3));
    //        //    $('#VolumeWeight').val(GWT.toFixed(3));
    //        //}
    //    }





    //    //if ($('input[id=GrossWeightType]:checked').val() == 1) {
    //    //    var AllotedVol = 0.00;
    //    //    if ($('span#ReserveGrossUnit').text() == 'LBS') {
    //    //        AllotedVol = parseFloat($('#ReserveGross').val());
    //    //        AllotedVol = AllotedVol / 2.20; // Convert to KG 
    //    //    }
    //    //    else if ($('span#ReserveGrossUnit').text() == 'KG') {
    //    //        AllotedVol = parseFloat($('#ReserveGross').val());
    //    //    }

    //    //    if ($('#GrossWeight').val() != "" && (AllotedVol < parseFloat($('#GrossWeight').val()))) {
    //    //        ShowMessage('warning', 'Warning - Allotment', "Gross Weight should not be greater than Reserve Gross Weight.", "bottom-right");
    //    //        $('#_tempGrossWeight').val('');
    //    //        $('#GrossWeight').val('');
    //    //    }
    //    //}
    //    //else if ($('input[id=GrossWeightType]:checked').val() == 2) {
    //    //    var AllotedVol = 0.00;
    //    //    if ($('span#ReserveGrossUnit').text() == 'KG') {
    //    //        AllotedVol = parseFloat($('#ReserveGross').val());
    //    //        AllotedVol = AllotedVol * 2.20; // Convert to LBS 
    //    //    }
    //    //    else if ($('span#ReserveGrossUnit').text() == 'LBS') {
    //    //        AllotedVol = parseFloat($('#ReserveGross').val());
    //    //    }

    //    //    if ($('#GrossWeight').val() != "" && (AllotedVol < parseFloat($('#GrossWeight').val()))) {
    //    //        ShowMessage('warning', 'Warning - Allotment', "Gross Weight should not be greater than Reserve Gross Weight.", "bottom-right");
    //    //        $('#_tempGrossWeight').val('');
    //    //        $('#GrossWeight').val('');
    //    //    }
    //    //}

    //});

    //$('#VolumeWeight').blur(function () {
    //    if ($('input[type=radio][name=IsSector][data-radioval=Yes]').is(':checked') == false) {
    //        if ($('#VolumeWeight').val() != "" && $('#ReserveVolume').val() != "" && (parseFloat($('#ReserveVolume').val()) < parseFloat($('#VolumeWeight').val()))) {
    //            ShowMessage('warning', 'Warning - Allotment', "Volume should not be greater than Reserve Volume.", "bottom-right");
    //            $('#_tempVolumeWeight').val('');
    //            $('#VolumeWeight').val('');
    //        }
    //    }
    //});


   

    if (PageType == "NEW") {
        //$('#IsSector').attr('checked', true);
        $('input[type=radio][data-radioval=Include]').removeAttr('checked');
       // CheckSector();
        selectAllotmentType();
    }
    //else if (PageType == "EDIT") {
    //    if (new Date($("#ValidFrom").val()) < new Date()) {
    //        $("#ValidFrom").data('kendoDatePicker').enable(false);
    //        $("#ValidFrom").data('kendoDatePicker').min(new Date());
    //    }
    //    else {
    //        $("#ValidFrom").data('kendoDatePicker').min($('#FlightValidFrom').val());
    //        $("#ValidFrom").data('kendoDatePicker').max($('#FlightValidTo').val());
    //    }

    //    if (new Date($("#ValidTo").val()) < new Date()) {
    //        $("#ValidTo").data('kendoDatePicker').enable(false);
    //    }
    //    else {
    //        $("#ValidTo").data('kendoDatePicker').min($('#ValidFrom').val());
    //        $("#ValidTo").data('kendoDatePicker').max($('#FlightValidTo').val());
    //    }

    //    $('span#slash').text('/');

    //   // CheckSector();

    //    if ($('#IsUsed').val() == 'True') {
    //        $('#GrossWeight').attr('disabled', true);
    //        $('#VolumeWeight').attr('disabled', true);
    //        $("#ValidFrom").data('kendoDatePicker').enable(false);
    //        $("#ValidTo").data('kendoDatePicker').enable(false);
    //        $('input[type=checkbox][name=Days]').attr('disabled', true);
    //        $('input[type=radio][name=IsActive]').attr('disabled', true);
    //    }
    //}
    else if (PageType == 'READ' || PageType == 'EDIT') {
            
       // $('#spnSHFlightNo').parent('td').next('td')        
        $("#From").data("kendoDatePicker").min($('#ValidFrom').val());
        $("#To").data("kendoDatePicker").min($('#ValidFrom').val());
        $("#From").data("kendoDatePicker").max($('#ValidTo').val());
        $("#To").data("kendoDatePicker").max($('#ValidTo').val());
        $("#From").data("kendoDatePicker").value($('#ValidFrom').val());
        $("#To").data("kendoDatePicker").value($('#ValidTo').val());
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

    $("#SearchAllotment").on('click', function () {
        AllotmentData();
       // AuditLogBindOldValue("tblAllotmentData");
        //if (getQueryStringValue("Apps").toUpperCase() == "ALLOTMENT") {
        //    var rowcount = $('#tblAllotmentData tbody tr').length;
        //    for (var i = 1; i <= rowcount; i++) {
        //        $("#tblAllotmentData_GrossWeight_" + i).attr("oldvalue", $("#tblAllotmentData_GrossWeight_" + i).val());
        //        $("#tblAllotmentData_Volume_" + i).attr("oldvalue", $("#tblAllotmentData_Volume_" + i).val());
        //        $("#tblAllotmentData_GrossVariancePlus_" + i).attr("oldvalue", $("#tblAllotmentData_GrossVariancePlus_" + i).val());
        //    }
        //}
    });

});

$('input[type=submit][name=operation]').unbind("click").click(function () {

    window.onbeforeunload = function () { };

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
        ShowMessage('warning', 'Warning - Allotment', "Either Office Name or Shipper is allowed for selection.", "bottom-right");
        $('#OfficeSNo').val('');
        $('#Text_OfficeSNo').val('');
        $('#AccountSNo').val('');
        $('#Text_AccountSNo').val('');
        $('#ShipperAccountSNo').val('');
        $('#Text_ShipperAccountSNo').val('');
        return false;
    }

    else if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#AccountSNo').val() != "" && $('#ShipperAccountSNo').val() != "")) {
        ShowMessage('warning', 'Warning - Allotment', "Either Forwarder (Agent) or Shipper is allowed for selection.", "bottom-right");
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
        ShowMessage('warning', 'Warning - Allotment', "Either Commodity,SHC or Product is allowed for selection.", "bottom-right");
        return false;
    }

    if (PageType == 'NEW' && $('#Commodity').val() != "" && $('#SHC').val() != "") {
        ShowMessage('warning', 'Warning - Allotment', "Either Commodity or SHC is allowed for selection.", "bottom-right");
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
    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //    AuditLogSaveNewValue("tbl");
    //}
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


    else if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "IsInterline", "eq", 0), cfi.autoCompleteFilter(textId);
    }

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
    else if (textId == "Text_SHFlightNo") {
        cfi.setFilter(filterEmbargo, "AllotmentSNo", "eq", $('#RecordID').val());
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

    else if( textId.indexOf('tblAllotmentData_SHC_')>=0)
    {
        var Text = textId.replace('SHC', 'HdnSHC');
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $('#' + Text).val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId.indexOf('tblAllotmentData_SHC_') >= 0) {
        var Text = textId.replace('SHC', 'HdnSHC');
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $('#' + Text).val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId.indexOf('tblAllotmentData_Commodity_') >= 0) {
        var Text = textId.replace('Commodity', 'HdnCommodity');
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $('#' + Text).val()), cfi.autoCompleteFilter(textId);
    }
    else if (textId.indexOf('tblAllotmentData_Product_') >= 0) {
        var Text = textId.replace('Product', 'HdnProduct');
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $('#' + Text).val()), cfi.autoCompleteFilter(textId);
    }
}

function selectOffice()
{
    $('#AccountSNo').val('');
    $('#Text_AccountSNo').val('');
}

function selectFlight() {
   // var SNo = "";
   // var AllotmentBasedOn = 0;
    //SNo = $('#FlightNo').val();
    //AllotmentBasedOn = $('input[type=radio][name=AllotmentBasedOn]:checked').val();
    $('#_tempGrossWeight').val('');
    $('#GrossWeight').val('');    
    $('#_tempVolumeWeight').val('');
    $('#VolumeWeight').val('');
    //$("#ValidFrom").data("kendoDatePicker").value('');
    //$("#ValidTo").data("kendoDatePicker").value('');
    //if (FlightNo != "") {
    //    $.ajax({
    //        url: "./Services/Permissions/AllotmentService.svc/GetFlightDetails", async: false, type: "POST", dataType: "json", cache: false,
    //        data: JSON.stringify({ SNo: SNo, AllotmentBasedOn: AllotmentBasedOn }),
    //        contentType: "application/json; charset=utf-8",
    //        success: function (result) {
    //            var es = JSON.parse(result);
    //            if (es.Table0 != "") {

    //                $('#TotalGross').val(es.Table0[0].TotalGross);
    //                $('span#TotalGross').text(es.Table0[0].TotalGross);
    //                $('#TotalGrossUnit').val(es.Table0[0].GrossUnit);
    //                $('span#TotalGrossUnit').text(es.Table0[0].GrossUnit);

    //                $('span#slash').text('/');

    //                $('#TotalVolume').val(es.Table0[0].TotalVolume);
    //                $('span#TotalVolume').text(es.Table0[0].TotalVolume);
    //                $('#TotalVolumeUnit').val(es.Table0[0].VolumeUnit);
    //                $('span#TotalVolumeUnit').text(es.Table0[0].VolumeUnit);


    //                $('#ReserveGross').val(es.Table0[0].ReserveGross);
    //                $('span#ReserveGross').text(es.Table0[0].ReserveGross);
    //                $('#ReserveGrossUnit').val(es.Table0[0].GrossUnit);
    //                $('span#ReserveGrossUnit').text(es.Table0[0].GrossUnit);

    //                $('span#slash').text('/');

    //                $('#ReserveVolume').val(es.Table0[0].ReserveVolume);
    //                $('span#ReserveVolume').text(es.Table0[0].ReserveVolume);
    //                $('#ReserveVolumeUnit').val(es.Table0[0].VolumeUnit);
    //                $('span#ReserveVolumeUnit').text(es.Table0[0].VolumeUnit);

    //                $('#FlightDaysOfOps').val(es.Table0[0].FlightDaysOfOps);

    //                ValidFromDate = new Date(es.Table0[0].StartDate) > new Date() ? es.Table0[0].StartDate : new Date();
    //                ValidToDate = es.Table0[0].EndDate;
    //                $("#ValidFrom").data("kendoDatePicker").value('');
    //                $("#ValidTo").data("kendoDatePicker").value('');
    //                $("#ValidFrom").data("kendoDatePicker").min(ValidFromDate);
    //                $("#ValidFrom").data("kendoDatePicker").max(ValidToDate);
    //                $("#ValidTo").data("kendoDatePicker").min(ValidFromDate);
    //                $("#ValidTo").data("kendoDatePicker").max(ValidToDate);

    //                if (AllotmentBasedOn == 1)
    //                {
    //                    $("#ValidFrom").val(es.Table0[0].StartDate);
    //                    $("#ValidTo").val(es.Table0[0].EndDate);
    //                }

    //                if (es.Table0[0].GrossUnit == 'KG') {
    //                    $('input[type=radio][name=GrossWeightType][data-radioval=KG]').removeAttr('disabled');
    //                    $('input[type=radio][name=GrossWeightType][data-radioval=KG]').click();
    //                    $('input[type=radio][name=GrossWeightType][data-radioval=KG]').attr('disabled', true);

    //                }
    //                else if (es.Table0[0].GrossUnit == 'LBS') {
    //                    $('input[type=radio][name=GrossWeightType][data-radioval=LBS]').removeAttr('disabled');
    //                    $('input[type=radio][name=GrossWeightType][data-radioval=LBS]').click();
    //                    $('input[type=radio][name=GrossWeightType][data-radioval=LBS]').attr('disabled', true);
    //                }
    //                if (es.Table0[0].VolumeUnit == 'CBM') {
    //                    $('input[type=radio][name=VolumeWeightType][data-radioval=CBM]').removeAttr('disabled');
    //                    $('input[type=radio][name=VolumeWeightType][data-radioval=CBM]').click();
    //                    $('input[type=radio][name=VolumeWeightType][data-radioval=CBM]').attr('disabled', true);
    //                }
    //                $('input[type=radio][name=VolumeWeightType]').attr('disabled', true);
    //                $('input[type=radio][name=GrossWeightType]').attr('disabled', true);

    //                var Array = [];
    //                Array.push(es.Table0[0].FlightDaysOfOps.split(','));
    //                $('input[name=Days]').removeAttr('disabled');
    //                for (var i = 0; i < Array[0].length; i++) {
    //                    if (Array[0][i] != "") {
    //                        $('input[name=Days][value=' + Array[0][i] + ']').removeAttr('checked').attr('disabled', true);
    //                        $('input[name=Days][value=0]').removeAttr('checked').attr('disabled', true);
    //                    }
    //                }
    //                $('input[type=checkbox][id=Days]:enabled').attr('checked', true);
    //                //$('#AllotedGrossWeight').val(es.Table0[0].GrossWeight);
    //                //$('span#AllotedGrossWeight').text(es.Table0[0].GrossWeight);
    //                //$('#AllotedVolume').val(es.Table0[0].VolumeWeight);
    //                //$('span#AllotedVolume').text(es.Table0[0].VolumeWeight);
    //                //$('span#VolumeType').text(es.Table0[0].VolumeType);
    //                //$('span#GrossType').text(es.Table0[0].GrossType);
    //                //$('#_tempGrossWeight').val('');
    //                //$('#GrossWeight').val('');
    //                //$('#_tempVolumeWeight').val('');
    //                //$('#VolumeWeight').val('');
    //            }
    //        }
    //    });
    //}
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
        //$('#spnTotalGrossVolume').closest('td').closest('tr').hide();
        //$('span#pre').text('%');
       // $('#GrossWeight,#VolumeWeight').attr('maxlength', '2');


        //$('#TotalGross').val('');
        //$('span#TotalGross').text('');
        //$('#TotalGrossUnit').val('');
        //$('span#TotalGrossUnit').text('');

        $('span#slash').text('');

        //$('#TotalVolume').val('');
        //$('span#TotalVolume').text('');
        //$('#TotalVolumeUnit').val('');
        //$('span#TotalVolumeUnit').text('');


        //$('#ReserveGross').val('');
        //$('span#ReserveGross').text('');
        //$('#ReserveGrossUnit').val('');
        //$('span#ReserveGrossUnit').text('');

        //$('#ReserveVolume').val('');
        //$('span#ReserveVolume').text('');
        //$('#ReserveVolumeUnit').val('');
        //$('span#ReserveVolumeUnit').text('');
    }
    else if ($('input[type=radio][name=IsSector][data-radioval=Yes]').is(':checked') == false) {
        $('span#spnFlightNo').closest('td').find('*').show();
        $('#Text_FlightNo').closest('td').find('*').show();
        $('#Text_FlightNo').attr('data-valid', 'required');
        $('span#pre').text('');
        //$('#spnTotalGrossVolume').closest('td').closest('tr').show();
        //$('#GrossWeight').attr('maxlength', '7');
        //$('#VolumeWeight').attr('maxlength', '9');

        //$('#TotalGross').val('');
        //$('span#TotalGross').text('');
        //$('#TotalGrossUnit').val('');
        //$('span#TotalGrossUnit').text('');

        $('span#slash').text('');

        //$('#TotalVolume').val('');
        //$('span#TotalVolume').text('');
        //$('#TotalVolumeUnit').val('');
        //$('span#TotalVolumeUnit').text('');


        //$('#ReserveGross').val('');
        //$('span#ReserveGross').text('');
        //$('#ReserveGrossUnit').val('');
        //$('span#ReserveGrossUnit').text('');

        //$('#ReserveVolume').val('');
        //$('span#ReserveVolume').text('');
        //$('#ReserveVolumeUnit').val('');
        //$('span#ReserveVolumeUnit').text('');
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
    var AllotmentBasedOn = $('input[type=radio][name=AllotmentBasedOn]:checked').val();
    var AirlineSNo = PageType == "EDIT" ? "0" : $('#AirlineSNo').val();
    var AllotmentSNo = $('#RecordID').val() != undefined ? $('#RecordID').val() : "0";
    var IsSector = PageType == "EDIT" ? 0 : ($('input[type=radio][name=IsSector]:checked').val()||null);
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
    var CommotityExclude = PageType == "EDIT" ? "" : $('input[type=radio][name=CommodityType]:checked').val();
    var SHCSNo = PageType == "EDIT" ? "" : $('#SHC').val();
    var SHCExclude = PageType == "EDIT" ? "" : $('input[type=radio][name=SHCType]:checked').val();
    var ProductSNo = PageType == "EDIT" ? "" : $('#ProductSNo').val();
    var ProductExclude = PageType == "EDIT" ? "" : $('input[type=radio][name=ProductType]:checked').val();
    $("#ValidateData").html('');
    $("#ValidateData").append('<table  id="ValidateDataTbl" style="margin: 0px auto; border: 1px solid black; border-collapse: collapse;"></table>');

    var Str = '<tr><th class="ui-widget-header" style="width:5%; border: 1px solid black; "><span>S.No.</span></th><th class="ui-widget-header" style="width:15%;text-align:center; border: 1px solid black; "><span>Flight No</span></th><th class="ui-widget-header" style="width:15%;text-align:center; border: 1px solid black; "><span>Flight Date </span></th><th class="ui-widget-header" style="width:65%; text-align:center; border: 1px solid black; "><span>Message</span></th></tr>';
    $.ajax({
        url: "./Services/Permissions/AllotmentService.svc/ValidateData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({
            AirlineSNo: AirlineSNo, AllotmentBasedOn: AllotmentBasedOn, AllotmentSNo: AllotmentSNo, IsSector: IsSector, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo, ScheduleTransSNo: ScheduleTransSNo,
            GrossWeight: GrossWeight, VolumeWeight: VolumeWeight, ValidFrom: ValidFrom, ValidTo: ValidTo, Days: Days,
            AllotmentTypeSNo: AllotmentTypeSNo, AccountSNo: AccountSNo, ShipperAccountSNo: ShipperAccountSNo, OfficeSNo: OfficeSNo, CommoditySNo: CommoditySNo,
            CommotityExclude:CommotityExclude,
            SHCSNo: SHCSNo, SHCExclude: SHCExclude, ProductSNo: ProductSNo, ProductExclude: ProductExclude
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

function mainDialogBox()
{
    var TopDiv="<div></div>"

}

function selectAll() {
    if ($('#All').is(':checked') == true) {
        $('#recordBody tr td input[type=checkbox]').not(':disabled').attr('checked', true);
    }
    else {
        $('#recordBody tr td input[type=checkbox]').not(':disabled').removeAttr('checked');
    }
};
function selectCheckBox()
{
    if ($('#recordBody tr td input[type=checkbox]').not(':checked').not(':disabled').length > 0)
    {
        $('#All').removeAttr('checked');
    }
    else
    {
        $('#All').attr('checked',true);
    }
}
function ValidateAllotment()
{
    $("input[type=button][value=submit]").attr("disabled", "disabled");
   // window.onbeforeunload = function () { };
    window.onbeforeunload = function () {
        $("input[type=button], input[type=submit]").attr("disabled", "disabled");
    };
    $("#ValidateData").html('');

    if (!cfi.IsValidSubmitSection()) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        return false;
    }

    if ($('#AllotmentReleaseTimeHr').val() == 0 && $('#AllotmentReleaseTimeMin').val() == 0) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', '', "Allotment Release Time should be greater than 0.");
        return false;
    }

    if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#OfficeSNo').val() == "" && $('#AccountSNo').val() == "" && $('#ShipperAccountSNo').val() == "")) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "Office Name or Forwarder (Agent) or Shipper is required.", "bottom-right");
        return false;
    }

    else if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#OfficeSNo').val() != "" && $('#ShipperAccountSNo').val() != "")) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "Either Office Name or Shipper is allowed for selection.", "bottom-right");
        $('#OfficeSNo').val('');
        $('#Text_OfficeSNo').val('');
        $('#AccountSNo').val('');
        $('#Text_AccountSNo').val('');
        $('#ShipperAccountSNo').val('');
        $('#Text_ShipperAccountSNo').val('');
        return false;
    }

    else if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#AccountSNo').val() != "" && $('#ShipperAccountSNo').val() != "")) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "Either Forwarder (Agent) or Shipper is allowed for selection.", "bottom-right");
        $('#OfficeSNo').val('');
        $('#Text_OfficeSNo').val('');
        $('#AccountSNo').val('');
        $('#Text_AccountSNo').val('');
        $('#ShipperAccountSNo').val('');
        $('#Text_ShipperAccountSNo').val('');
        return false;
    }


        //else if (PageType == 'NEW' && $('#AllotmentType').val() != 4 && $('#AllotmentType').val() != "" && ($('#OfficeSNo').val() != "" && $('#AccountSNo').val() != "")) {
        //    ShowMessage('warning', 'Warning - Allotment', "Either Office Name or Forwarder (Agent) is allowed for selection.", "bottom-right");
        //    $('#OfficeSNo').val('');
        //    $('#Text_OfficeSNo').val('');
        //    $('#AccountSNo').val('');
        //    $('#Text_AccountSNo').val('');
        //    $('#ShipperAccountSNo').val('');
        //    $('#Text_ShipperAccountSNo').val('');
        //    return false;
        //}

    else if (PageType == 'NEW' && $('#AllotmentType').val() == 4 && ($('#Commodity').val() == "" && $('#SHC').val() == "" && $('#ProductSNo').val() == "")) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "Either Commodity,SHC or Product is allowed for selection.", "bottom-right");
        return false;
    }

    if (PageType == 'NEW' && $('#Commodity').val() != "" && $('#SHC').val() != "") {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "Either Commodity or SHC is allowed for selection.", "bottom-right");
        $('#divMultiCommodity span[id]').click();
        $('#divMultiSHC span[id]').click();
        return false;
    }

    if (PageType == 'NEW' && $('#Commodity').val() != "" && $('input[type=radio][name=CommodityType]:checked').length == 0) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "Commodity Type is required, if commodity is selected.", "bottom-right");
        return false;
    }
    else if (PageType == 'NEW' && $('#SHC').val() != "" && $('input[type=radio][name=SHCType]:checked').length == 0) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "SHC Type is required, if SHC is selected.", "bottom-right");
        return false;
    }
    else if (PageType == 'NEW' && $('#ProductSNo').val() != "" && $('input[type=radio][name=ProductType]:checked').length == 0) {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Warning - Allotment', "Product Type is required, if Product is selected.", "bottom-right");
        return false;
    }


    if (PageType == 'EDIT' && $('#IsUsed').val() == 'True') {
        ShowMessage('warning', 'Allotment!', 'It is already have been used, can not be allowed to update.');
        // e.preventdefault();
        return false;
    }

    //if (DataIsValid == false) {
    //    ExcludeScheduleTransSNo = '';
    //    ValidateData(this);
    //    if (DataIsValid == true)
    //        return true;
    //    else
    //        return false;
    //}

    //DataIsValid = false;

    BindData();

    var ErrorTable;
    var DataTable;

    $.ajax({
        url: "../Schedule/ValidateAllotment", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AllotmentMaster: AllotmentMaster }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
             ErrorTable = result.Table0;
             DataTable = result.Table1;
        }
    });   
    
    if (DataTable.length > 0) {

        $("#ValidateData").html('<div style="width:100%; font-size:12px;"><div id="topDiv"><table style="padding:5px;width:100%;border:1px solid #4297d7; border-radius:5px;"><tbody><tr><td style="width:15%; text-align:right;"><label id="lblGrossWt" name="lblGrossWt">Gross Wt. (KG)</label></td><td style="width:15%; text-align:right;"><input type="text" class="k-formatted-value k-input" style="width:120px;height:15px;text-align:right;" id="txtGrossWt" name="txtGrossWt" maxlength="7" onkeypress="return IsNumeric(event);" ondrop="return false;" onpaste="return false;"></td><td style="width:10%; text-align:right;"><label id="lblVolWt" name="lblVolWt" value="">Volume (CBM)</label></td><td style="width:15%; text-align:right;"><input type="text" class="k-formatted-value k-input" style="width:120px;height:15px;text-align:right;" id="txtVolWt" name="txtVolWt"  maxlength="7" onkeypress="return IsDecimal(event,3);" onblur="DecimalBoxBlur(event,3)" ondrop="return false;" onpaste="return false;"></td><td style="width:15%; text-align:center;"><input type="button" class="btn btn-success" id="ApplyOnAll" value="Apply" onclick="BtnApply()"><input type="button" class="btn btn-inverse" id="ClearAll" value="Clear" onclick="BtnClearAll()"></td><td style="width:30%; text-align:right;"></td></tr></tbody></table></div><div id="bottomDiv"></div><div style="border:1px solid #42b9d7;margin-top:10px; border-radius:5px;"><table id="recordTable" style="margin:10px;padding:5px; border-collapse: collapse;"><thead id="recordHead"><tr><th style="width:80px; height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;"><input type="checkbox" id="All" name="All" onclick="selectAll()">Select</th><th style="width:100px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;;">Flight No</th><th style="width:100px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;">Flight Date</th><th style="width:50px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;">Ori.</th><th style="width:50px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;">Dest.</th><th style="width:100px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;">Avl. Gross Wt.</th><th style="width:100px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;">Avl. Vol.</th><th style="width:100px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;">Gross Wt.</th><th style="width:100px;height:25px;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#96c6e9;">Vol.</th><th style="width:100px;height:25px;background-color:#96c6e9; border-radius:5px 5px 5px 5px;">Validation</th></tr></thead><tbody id="recordBody"></tbody></table></div></div>')

        for (var i = 0; i < DataTable.length; i++) {
            var AddRow = "";
            if (i % 2 == 0) {
                AddRow = '<tr id="tbl_row_' + i + '">' +
    '<td style="width:80px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><input type="checkbox" id="select_' + i + '" onclick="selectCheckBox()" value="' + DataTable[i].DailyFlightSNo + '" ' + (DataTable[i].IsValidData == "False" ? 'disabled="disabled"' : '') + '></td>' +
    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><label id="FlightNo_' + i + '" name="FlightNo_' + i + '">' + DataTable[i].FlightNo + '</label></td>' +
    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><label id="FlightDate_' + i + '" name="FlightDate_' + i + '">' + DataTable[i].FlightDate + '</label></td>' +
    '<td style="width:50px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><label id="Ori_' + i + '" name="Ori_' + i + '">' + DataTable[i].Ori + '</label></td>' +
    '<td style="width:50px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><label id="Dest_' + i + '" name="Dest_' + i + '">' + DataTable[i].Dest + '</label></td>' +
    '<td style="width:100px;height:25px;text-align:right;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><label id="ResGWT_' + i + '" name="ResGWT_' + i + '" value="' + DataTable[i].AvlReservedGrossWt + '">' + DataTable[i].AvlReservedGrossWt + '</label></td>' +
    '<td style="width:100px;height:25px;text-align:right;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><label id="ResVol_' + i + '" name="ResVol_' + i + '" value="' + DataTable[i].AvlReservedVolWt + '">' + DataTable[i].AvlReservedVolWt + '</label></td>' +
    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><input type="text" class="k-formatted-value k-input" style="width:70px;height:13px;text-align:right;" maxlength="7" onkeypress="return IsNumeric(event);" onblur="MatchGrossVol(this.id,0);" ondrop="return false;" onpaste="return false;" id="GrossWt_' + i + '" name="GrossWt_' + i + '" ' + (DataTable[i].IsValidData == "False" ? 'disabled="disabled"' : '') + '></td>' +
    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><input type="text" class="k-formatted-value k-input" style="width:70px;height:13px;text-align:right;" maxlength="7" onkeypress="return IsDecimal(event,3);" onblur="DecimalBoxBlur(event,3);MatchGrossVol(this.id,1);" ondrop="return false;" onpaste="return false;" id="VolWt_' + i + '" name="VolWt_' + i + '" ' + (DataTable[i].IsValidData == "False" ? 'disabled="disabled"' : '') + '></td>' +
    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;"><input type="button" class="btn btn-inverse" onclick="info(this.id)" id="Info_' + i + '" value="Info"><span style="display:none;">' + DataTable[i].ValidationMSG + '<span><input type="hidden" id="hdnIsValidData_' + i + '" value="' + (DataTable[i].IsValidData == "False" ? 0 : 1) + '"></td></tr>'
            }

            else {
                AddRow = '<tr  id="tbl_row_' + i + '"><td style="width:80px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><input type="checkbox" id="select_' + i + '" onclick="selectCheckBox()" value="' + DataTable[i].DailyFlightSNo + '"  ' + (DataTable[i].IsValidData == "False" ? 'disabled="disabled"' : '') + '></td>' +
                    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><label id="FlightNo_' + i + '" name="FlightNo_' + i + '">' + DataTable[i].FlightNo + '</label></td>' +
                    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><label id="FlightDate_' + i + '" name="FlightDate_' + i + '">' + DataTable[i].FlightDate + '</label></td>' +
                    '<td style="width:50px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><label id="Ori_' + i + '" name="Ori_' + i + '">' + DataTable[i].Ori + '</label></td>' +
                    '<td style="width:50px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><label id="Dest_' + i + '" name="Dest_' + i + '">' + DataTable[i].Dest + '</label></td>' +
                    '<td style="width:100px;height:25px;text-align:right;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><label id="ResGWT_' + i + '" name="ResGWT_' + i + '" value="' + DataTable[i].AvlReservedGrossWt + '">' + DataTable[i].AvlReservedGrossWt + '</label></td>' +
                    '<td style="width:100px;height:25px;text-align:right;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><label id="ResVol_' + i + '" name="ResVol_' + i + '" value="' + DataTable[i].AvlReservedVolWt + '">' + DataTable[i].AvlReservedVolWt + '</label></td>' +
                    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><input type="text" class="k-formatted-value k-input" style="width:70px;height:13px;text-align:right;" maxlength="7" onblur="MatchGrossVol(this.id,0);" onkeypress="return IsNumeric(event);" ondrop="return false;" onpaste="return false;" id="GrossWt_' + i + '" name="GrossWt_' + i + '" ' + (DataTable[i].IsValidData == "False" ? 'disabled="disabled"' : '') + '></td>' +
                    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><input type="text" class="k-formatted-value k-input" style="width:70px;height:13px;text-align:right;" maxlength="7" onkeypress="return IsDecimal(event,3);" onblur="DecimalBoxBlur(event,3);MatchGrossVol(this.id,1);" ondrop="return false;" onpaste="return false;" id="VolWt_' + i + '" name="VolWt_' + i + '" ' + (DataTable[i].IsValidData == "False" ? 'disabled="disabled"' : '') + '></td>' +
                    '<td style="width:100px;height:25px;text-align:center;border-right:1px solid white; border-radius:5px 5px 5px 5px;background-color:#daecf4;"><input type="button" class="btn btn-inverse" onclick="info(this.id)" id="Info_' + i + '" value="Info"><span style="display:none;">' + DataTable[i].ValidationMSG + '<span><input type="hidden" id="hdnIsValidData_' + i + '" value="' + (DataTable[i].IsValidData == "False" ? 0 : 1) + '"></td></tr>'
            }            
            $("#recordBody").append(AddRow);

        }
        OpenDialogBox();
    }
    else if(ErrorTable[0].Error=="")
    {
        SaveAllotment();
    }
}

function BindData()
{
    AllotmentMaster = [];
    AllotmentValidGrid = [];
    var Days = "";
    $('[name=Days]:checked').each(function () { Days = Days + $(this).val() + ','; });
    Days = Days.substring(0, Days.length - 1);

    AllotmentMaster = [{
        AllotmentSNo: $('#RecordID').val() || 0,
        AirlineSNo: $('#AirlineSNo').val() || 0,
        OriginSNo: $('#OriginSNo').val() || 0,
        DestinationSNo: $('#DestinationSNo').val() || 0,
        IsSector: $('input[type=radio][name=IsSector]:checked').val() == "1",
        FlightNo: $('#FlightNo').val() || "",
        AllotmentType: $('#AllotmentType').val() || 0,
        OfficeSNo: $('#OfficeSNo').val() || 0,
        AccountSNo: $('#AccountSNo').val() || 0,
        ShipperAccountSNo: $('#ShipperAccountSNo').val() || 0,
        GrossWeightType: $("#GrossWeightType:checked").val(),
        GrossWeight: $('#GrossWeight').val() || 0,
        VolumeWeightType: $("#VolumeWeightType:checked").val(),
        VolumeWeight: $('#VolumeWeight').val() || 0,
        GrossWeightVariance_P: $('#GrossWeightVariance_P').val(),
        GrossWeightVariance_N: $('#GrossWeightVariance_N').val(),
        VolumeVariance_P: $('#VolumeVariance_P').val(),
        VolumeVariance_N: $('#VolumeVariance_N').val(),
        ValidFrom: $('#ValidFrom').val(),
        ValidTo: $('#ValidTo').val(),
        Days: Days,
        AllotmentReleaseTime: (parseInt($("#AllotmentReleaseTimeHr").val() || 0) * 60 + parseInt($("#AllotmentReleaseTimeMin").val() || 0)),
        IsActive: $("#IsActive:checked").val() == "0",
        CommoditySNo: $('#Commodity').val() || null,
        IsExcludeCommodity:($('input[type=radio][name=CommodityType]:checked').val()||null)==null ?null: ($('input[type=radio][name=CommodityType]:checked').val()=="1"?true:false) ,
        SHCSNo: $('#SHC').val() || null,
        IsExcludeSHC: ($('input[type=radio][name=SHCType]:checked').val() || null) == null ? null : ($('input[type=radio][name=SHCType]:checked').val()=="1"?true:false),
        ProductSNo: $('#ProductSNo').val() || null,
        IsExcludeProduct: ($('input[type=radio][name=ProductType]:checked').val() || null) == null ? null : ($('input[type=radio][name=ProductType]:checked').val() == "1" ? true : false),
        IsMandatory: $("#IsMandatory:checked").val() == "0",
    }];

    //AllotmentValidGrid  Data
    $('#recordBody tr').each(function () {
        AllotmentValidGrid.push({
            IsAllot: $(this).find('td input[id^="select_"]').is(':checked'),
            DailyFlightSNo: $(this).find('td input[id^="select_"]').val(),
            NewGrossWt: $(this).find('td input[id^="GrossWt_"]').val() || 0,
            NewVolWt: $(this).find('td input[id^="VolWt_"]').val() || 0,
            IsValidationFaild: $(this).find('td input[id^="hdnIsValidData_"]').val()=="1"?true:false,
            IsValidWT: $(this).find('td input[id^="hdnIsValidData"]').val()=="1"?true:false
        })
    });
}

function SaveAllotment()
{
    BindData();
    var Text = '';
    $.ajax({
        url: "../Schedule/SaveAllotment", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AllotmentMaster: AllotmentMaster, AllotmentValidGrid: AllotmentValidGrid }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            Text=result.Table0[0].TextMsg;
        }
    });

    dirtyForm.isDirty = false;//to track the changes
    _callBack();

    if (Text.toUpperCase().indexOf('SUCCESSFULLY') >= 0) {
        ShowMessage('success', 'Allotment!', Text);
    }
    else {
        $("input[type=button][value=submit]").removeAttr("disabled");
        ShowMessage('warning', 'Allotment!', Text);
    }

    window.onbeforeunload = function () { };
    setTimeout(function () { navigateUrl('Default.cshtml?Module=Permissions&Apps=Allotment&FormAction=INDEXVIEW'); }, 4000);

}

function info(obj)
{
    ShowMessage('warning', 'Information!', $('#' + obj).next('span').text());
}

function OpenDialogBox() {

    $("#ValidateData").dialog(
    {
        autoResize: true,
        maxWidth: 900,
        maxHeight: 500,
        width: 900,
        height: 470,
        modal: true,
        title: 'In-Valid Records',
        draggable: true,
        resizable: false,
        buttons: {
            "Submit": function () {
                var SelectedRowCount = $('#recordBody tr td input[type=checkbox][id^="select"]:checked').length;
                var SubVal = true;
                if (SelectedRowCount > 0) {
                    $('#recordBody tr td input[type=checkbox][id^="select"]:checked').closest('tr').each(function () {
                        var GWT_ID = $(this).find('[id^="GrossWt_"]');
                        var VolWT_ID = $(this).find('[id^="VolWt_"]');
                        if (parseInt(GWT_ID.val() || 0) < 1) {
                            ShowMessage('warning', 'Information!', 'In selected row Gross Wt. can not be blank and minimum value should be 1.');
                            SubVal = false;
                            return false;
                        }
                        else if (parseFloat(VolWT_ID.val() || 0) < 0.001) {
                           ShowMessage('warning', 'Information!', 'In selected row Volume can not be blank and minimum value should be 0.001.');
                           SubVal = false;
                           return false;
                        }
                    });
                }
                if (SubVal) {
                    SaveAllotment();
                    $("#ValidateData").html('');
                    $(this).dialog("close");
                }
                return true;
            },
            Cancel: function () {
                $("input[type=button][value=submit]").removeAttr("disabled");
                $("#ValidateData").html('');
                $(this).dialog("close");
                DataIsValid = false;
                return false;
            }
        },
        close: function () {
            $("input[type=button][value=submit]").removeAttr("disabled");
            $("#ValidateData").html('');
            DataIsValid = false;
            $(this).dialog("close");
            return false;
        }
    });
}

function IsNumeric(e) {
    var specialKeys = new Array();
    specialKeys.push(8); //Backspace
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
    //document.getElementById("error").style.display = ret ? "none" : "inline";
    return ret;
}

function IsDecimal(evt, FractionalCount) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    var inputValue = $("#" + evt.currentTarget.id).val();
    if (charCode == 46) {
        if (inputValue.indexOf('.') < 1 && (inputValue.split(".").length - 1) < 1) {

            if ($("#" + evt.currentTarget.id).val() == "")
            { $("#" + evt.currentTarget.id).val(0) }
            return true;
        }
        return false;
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    //if (inputValue.indexOf('.') >= 0 && inputValue.split(".")[1].length >= FractionalCount) {
    //    return false;
    //}
    return true;
}

function DecimalBoxBlur(evt, FractionalCount) {
    var Arr = ["", "0", "00", "000", "0000", "00000", "000000"];
    var inputValue = $("#" + evt.currentTarget.id).val();
    if (inputValue == "") {
        $("#" + evt.currentTarget.id).val("0." + Arr[FractionalCount]);
    }
    else if (inputValue != "" && inputValue.indexOf('.') < 0)
    {
        $("#" + evt.currentTarget.id).val(inputValue+'.'+ Arr[FractionalCount]);
    }
    else if (inputValue != "" && inputValue.indexOf('.') >= 0 && inputValue.split(".")[1].length > FractionalCount - 1) {
        $("#" + evt.currentTarget.id).val((inputValue.split('.')[0] == "" ? "0" : inputValue.split('.')[0]) + '.' +
        inputValue.split('.')[1].substring(0, FractionalCount));
    }
    else if (inputValue != "" && inputValue.indexOf('.') >= 0 && inputValue.split(".")[1].length <= FractionalCount - 1) {
        $("#" + evt.currentTarget.id).val((inputValue.split('.')[0] == "" ? "0" : inputValue.split('.')[0]) + '.' +
        (inputValue.split('.')[1] == "" ? Arr[FractionalCount] : inputValue.split('.')[1] + Arr[FractionalCount - inputValue.split('.')[1].length]));
    }
}

function BtnApply()
{
    var SelectedRowCount = $('#recordBody tr td input[type=checkbox][id^="select"]:checked').length;
    var A_GrossWT=$('#txtGrossWt');
    var A_VolWT = $('#txtVolWt');
    var grossVal = parseInt(A_GrossWT.val());
    var volVal = parseFloat(A_VolWT.val());
    if(SelectedRowCount==0)
    {
        ShowMessage('info', 'Information!', "Kindly, select at least one row.");
    }
    else if (A_GrossWT.val() == "" && A_VolWT.val()=="")
    {
        ShowMessage('info', 'Information!', "Gross Wt. and Volume field should be filled.");
    }
    else if (parseInt(A_GrossWT.val()) == 0 || parseFloat(A_VolWT.val()) == 0) {
        ShowMessage('info', 'Information!', "Gross Wt. should be min. 1 and Volume should be min. 0.001");
    }
    else if (A_GrossWT.val() != "" && A_VolWT.val() != "" && parseInt(A_GrossWT.val()) > 0 && parseFloat(A_VolWT.val()) > 0) {
        
        $('#recordBody tr td input[type=checkbox][id^="select"]:checked').closest('tr').each(function () {
            var GWT_ID = $(this).find('[id^="GrossWt_"]');
            var VolWT_ID = $(this).find('[id^="VolWt_"]');
            var AvlGWT = $(this).find('[id^="ResGWT_"]');
            var AvlVolWT = $(this).find('[id^="ResVol_"]');
            if (parseInt(AvlGWT.text()) >= grossVal && parseInt(AvlVolWT.text()) >= volVal)
            {
                GWT_ID.val(grossVal);
                VolWT_ID.val(volVal.toFixed(3));
            }
        });
    }
    

}
function BtnClearAll()
{
    var SelectedRowCount = $('#recordBody tr td input[type=checkbox][id^="select"]:checked').length;
    var A_GrossWT = $('#txtGrossWt');
    var A_VolWT = $('#txtVolWt');
    if (SelectedRowCount == 0) {
        ShowMessage('info', 'Information!', "Kindly, select at least one row.");
    }
    else
    {
        $('#txtGrossWt').val("");
        $('#txtVolWt').val("");
        $('#recordBody input[type=checkbox][id^="select"]:checked').closest('tr').find('[id^="GrossWt_"]').val("");
        $('#recordBody input[type=checkbox][id^="select"]:checked').closest('tr').find('[id^="VolWt_"]').val("");
    }

}

function MatchGrossVol(obj, M) {
    if (M == 0) {
        var AvlGWT_ID = obj.replace('GrossWt', 'ResGWT');
        var AvlGrossWT = $('#' + AvlGWT_ID).text();
        var grossVal = $('#' + obj).val();
        if (grossVal == "" || grossVal <= 0) {
            ShowMessage('info', 'Information!', "Gross Wt. can not be blank and min. 1 should be required.");
        }
        else if (parseInt(grossVal) > parseInt(AvlGrossWT)) {
            $('#' + obj).val("");
            ShowMessage('info', 'Information!', "Gross Wt. can not be greater than " + AvlGrossWT + "");
        }
    }
    else if (M == 1) {
        var AvlVol_ID = obj.replace('VolWt', 'ResVol');
        var AvlVolWT = $('#' + AvlVol_ID).text();
        var volVal = $('#' + obj).val();
        if (volVal == "" || volVal <= 0) {
            ShowMessage('info', 'Information!', "Volume can not be blank and min. 0.001 should be required.");
        }
        else if (parseInt(volVal) > parseInt(AvlVolWT)) {
            $('#' + obj).val("");
            ShowMessage('info', 'Information!', "Volume can not be greater than " + AvlVolWT + "");
        }
    }
}

function SearchAllotment()
{
    alert('HI');
    return true;
}

function AllotmentData() {
    var dbTableName = 'AllotmentData';
    $('#tbl' + dbTableName).html('');
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var model = {
        AllotmentSNo: $('#RecordID').val() || 0,
        From: $('#From').val(),
        To: $('#To').val(),
        FlightNo: $('#SHFlightNo').val(),
    }

      $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable:pageType!='READ'? true:false,
        tableColumns: 'SNo,AllotmentSNo,AllotmentCode,AgentCode,GrossWeight,Volume',
        masterTableSNo: $('#RecordID').val() || 0,
        currentPage: 1, itemsPerPage: 10, model: model, sort: '',
        isGetRecord: true,
        servicePath: './Services/Permissions/AllotmentService.svc',
        getRecordServiceMethod: 'GetAllotmentAllRecord',
        //createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'DeleteAllotment',
        initRows: 1,
        caption: 'Flight Allotment Information',
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'IsUsed', type: 'hidden', value: 0 },
            { name: 'ETD', type: 'hidden', value: 0 },
            { name: 'OriginAirportCurrentTime', type: 'hidden', value: 0 },
            { name: 'AllowToSubmit', type: 'hidden', value: 0 },
            { name: 'DailyFlightSNo', type: 'hidden', value: 0 },
            { name: 'AllotmentSNo', type: 'hidden', value: 0},
            { name: 'AllotmentCode', display: 'Allotment Code', type: 'label', ctrlAttr: { controltype: 'label' }},
            { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlAttr: { controltype: 'label' }},
            { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlAttr: { controltype: 'label' }},
            { name: 'Ori', display: 'Ori.', type: 'label', ctrlAttr: { controltype: 'label' } },
            { name: 'Dest', display: 'Dest.', type: 'label', ctrlAttr: { controltype: 'label' } },
            { name: 'UsedGrossWT', display: 'Used Gross Wt.', type: 'label', ctrlAttr: { controltype: 'label' } },
            { name: 'UsedVolWT', display: 'Used Vol.', type: 'label', ctrlAttr: { controltype: 'label' } },
            { name: 'ReleaseGross', display: 'Released Gross Wt.', type: 'label', ctrlAttr: { controltype: 'label' } },
            { name: 'ReleaseVolume', display: 'Released Vol.', type: 'label', ctrlAttr: { controltype: 'label' } },
            //{
            //    name: 'AllotmentTypeSNo', display: 'Allotment Type', type: pageType!="READ"?'text':'label', ctrlAttr: { maxlength: 48, controltype: pageType!="READ"?'autocomplete':'label', onSelect: "return AllotmentTypeChange(this)" }, onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '100px' }, isRequired:  pageType!="READ"?true:false,
            //    AutoCompleteName: 'ViewEditFlight_AllotmentType', filterField: 'AllotmentType', filterCriteria: "contains",
            //},

            //{
            //    name: 'OfficeSNo', display: 'Office Name', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 48, controltype: pageType != "READ" ? 'autocomplete' : 'label' }, isRequired: false,
            //    AutoCompleteName: 'ViewEditFlight_Office', filterField: 'Name', filterCriteria: "contains",
            //    onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '100px' }
            //},
            //{
            //    name: 'AccountSNo', display: 'Agent Name', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 48, controltype: pageType != "READ" ? 'autocomplete' : 'label' }, onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '100px' }, isRequired: false,
            //    AutoCompleteName: 'ViewEditFlight_Agent', filterField: 'Name', filterCriteria: "contains",
            //},
            { name: 'GrossWeight', display: 'Gross WT.', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 7, min: 1, controltype: pageType != "READ" ? "number" : 'label' },  isRequired: pageType != "READ" ? true : false, value: 0.01 },
            { name: 'Volume', display: 'Volume', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 7, min: 0.001, controltype: pageType != "READ" ? "decimal3" : 'label' },  isRequired: pageType != "READ" ? true : false, value: 0.001, },
            
            {
                name: 'divGrossVariance', display: 'Gross Variance', type: 'div', isRequired: false,
                divElements: [
                    { divRowNo: 1, name: 'GrossVariancePlus', display: '(+)%', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 2, controltype: pageType != "READ" ? "decimal2" : 'label', onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '30px' }, isRequired: false, value: 0, },
                    { divRowNo: 1, name: 'GrossVarianceMinus', display: '(-)%', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 2, controltype: pageType != "READ" ? "decimal2" : 'label', onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '30px' }, value: 0, isRequired: false }
                ]
            },

            {
                name: 'divVolumeVariance', display: 'Volume Variance', type: 'div', isRequired: false,
                divElements: [
                     { divRowNo: 1, name: 'VolumeVariancePlus', display: '(+)%', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 2, controltype: pageType != "READ" ? "decimal2" : 'label', onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '30px' }, value: 0, isRequired: false },
                     { divRowNo: 1, name: 'VolumeVarianceMinus', display: '(-)%', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 2, controltype: pageType != "READ" ? "decimal2" : 'label', onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '30px' }, value: 0, isRequired: false }
                ]
            },
                 {
                     name: 'SHC', display: 'SHC', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { controltype: pageType != "READ" ? 'autocomplete' : 'label' }, ctrlCss: { width: '60px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ViewEditFlight_SHC', filterField: 'Code', filterCriteria: "contains", separator: ","
                 },
                 { name: pageType != "READ" ? 'IsExcludeSHC' : 'ExcludeSHC', display: "SHC Type", type: pageType != "READ" ? 'radiolist' : 'label', ctrlOptions: { 0: 'Include', 1: 'Exclude' }, selectedIndex: 0 },
                {
                    name: 'Commodity', display: 'Commodity', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { controltype: pageType != "READ" ? 'autocomplete' : 'label' }, ctrlCss: { width: '60px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false,
                    AutoCompleteName: 'ViewEditFlight_Commodity', filterField: 'CommodityDescription', filterCriteria: "contains", separator: ",",
                },
                 { name: pageType != "READ" ? 'IsExcludeCommodity' : 'ExcludeCommodity', display: 'Commodity Type', type: pageType != "READ" ? 'radiolist' : 'label', ctrlOptions: { 0: 'Include', 1: 'Exclude' }, selectedIndex: 0 },


                 {
                     name: 'Product', display: 'Product', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { controltype: pageType != "READ" ? 'autocomplete' : 'label' }, ctrlCss: { width: '60px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ViewEditFlight_Product', filterField: 'ProductName', filterCriteria: "contains", separator: ","
                 },
                 { name: pageType != "READ" ? 'IsExcludeProduct' : 'ExcludeProduct', display: 'Product Type', type: pageType != "READ" ? 'radiolist' : 'label', ctrlOptions: { 0: 'Include', 1: 'Exclude' }, selectedIndex: 0 },

                 {
                     name: 'divReleaseTime', display: 'Release Time', type: 'div', isRequired: false,
                     divElements: [
                          { divRowNo: 1, name: 'ReleaseTimeHr', display: 'Hr', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 3, controltype: pageType != "READ" ? "number" : 'label', onblur: "return ReleaseTimeBlur(this)" }, ctrlCss: { width: '35px' }, value: 0, isRequired: false },
                          { divRowNo: 1, name: 'ReleaseTimeMin', display: 'Min', type: pageType != "READ" ? 'text' : 'label', ctrlAttr: { maxlength: 2, controltype: pageType != "READ" ? "number" : 'label', onblur: "return ReleaseTimeBlur(this)" }, ctrlCss: { width: '35px' }, value: 0, isRequired: false }
                     ]
                 },
                 { name: pageType != "READ" ? 'IsMandatory' : 'Mandatory', display: 'Mandatory', type: pageType != "READ" ? 'radiolist' : 'label', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 0 },
                { name: pageType != "READ" ? 'IsActive' : 'Active', display: 'Active', type: pageType != "READ" ? 'radiolist' : 'label', ctrlOptions: { 0: 'Yes', 1: 'No' }, selectedIndex: 0 },
        ],
        //customRowButtons: [
        //        { uiButton: { icon: 'ui-icon-print', label: 'Update' }, click: setFavorite, btnCss: { 'min-width': '30px' }, click: function (evtObj, uniqueIndex, rowData) { alert('You clicked the print button!'); }, btnAttr: { title: 'Update' }, atTheFront: true },
        //],
        isPaging: true,
        isExtraPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType != "READ" ? false : true, append: true, removeLast: true },
        customRowButtons: [
                 {
                     uiButton: { icon: 'ui-icon-print', id: 'Update', label: 'Update' }, click: fnUpdate, btnClass: 'print', atTheFront: true
                 }
        ],
        //afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {


        //    var DailyFlightSNo = 201934;
        //    $("[id^='tblAllotmentData_DailyFlightSNo']").val(DailyFlightSNo);

        //    var length = $("tr[id^='tblAllotmentData_Row']").length;

        //    if (length > 0) {
        //        $('#ValidTo').val($('span#ValidFrom').text());
        //        $('#ValidTo').data("kendoDatePicker").enable(false);
        //    }
        //},
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

            $("tr[id^='tblAllotmentData_Row']").each(function () {
                if ($(this).find("[id^='tblAllotmentData_IsUsed']").val() == '1' || $(this).find("[id^='tblAllotmentData_AllowToSubmit']").val() == "0") {
                    $(this).find("[id^='tblAllotmentData_Delete']").remove();   
                    $(this).find("[id^='tblAllotmentData_SHC_']").data("kendoAutoComplete").enable(false);
                    $(this).find("[id^='tblAllotmentData_Commodity_']").data("kendoAutoComplete").enable(false);
                    $(this).find("[id^='tblAllotmentData_Product_']").data("kendoAutoComplete").enable(false);
                    $(this).find('input[type=radio]').not('[id^=tblAllotmentData_RbtnIsActive]').attr('disabled', true);

                    //if($(this).find("[id^='tblAllotmentData_AllowToSubmit']").val() == "0")
                    //{
                        //$(this).find("[id^='tblAllotmentData_GrossWeight_']").enable(false);
                        //$(this).find("[id^='tblAllotmentData_Volume_']").attr('disabled', true);
                        //$(this).find("[id^='tblAllotmentData_GrossVariancePlus_']").attr('disabled', true);
                        //$(this).find("[id^='tblAllotmentData_VolumeVariancePlus_']").attr('disabled', true);
                        //$(this).find("[id^='tblAllotmentData_GrossVarianceMinus_']").attr('disabled', true);
                        //$(this).find("[id^='tblAllotmentData_VolumeVarianceMinus_']").attr('disabled', true);
                        //$(this).find("[id^='tblAllotmentData_ReleaseTimeHr_']").attr('disabled', true);
                        //$(this).find("[id^='tblAllotmentData_ReleaseTimeMin_']").attr('disabled', true);
                        $(this).find("[id^='_temptblAllotmentData_GrossWeight_']").attr('disabled', true);
                        $(this).find("[id^='_temptblAllotmentData_Volume_']").attr('disabled', true);
                        $(this).find("[id^='_temptblAllotmentData_GrossVariancePlus_']").attr('disabled', true);
                        $(this).find("[id^='_temptblAllotmentData_VolumeVariancePlus_']").attr('disabled', true);
                        $(this).find("[id^='_temptblAllotmentData_GrossVarianceMinus_']").attr('disabled', true);
                        $(this).find("[id^='_temptblAllotmentData_VolumeVarianceMinus_']").attr('disabled', true);
                        $(this).find('input[type=radio][id^=tblAllotmentData_RbtnIsActive]').attr('disabled', true);
                    //if($(this).find("[id^='tblAllotmentData_AllowToSubmit']").val() == "0")
                    //{
                       
                        if ($(this).find("[id^='tblAllotmentData_ETD']").val() < $(this).find("[id^='tblAllotmentData_OriginAirportCurrentTime']").val()) {
                            $(this).find("[id^='_temptblAllotmentData_ReleaseTimeHr_']").attr('disabled', true);
                            $(this).find("[id^='_temptblAllotmentData_ReleaseTimeMin_']").attr('disabled', true);
                            $(this).find('button').remove();
                        }
                        
                    //}
                }                
            });
            
        },
        //afterRowRemoved: function (tbWhole, rowIndex) {
        //    var length = $("tr[id^='tblAllotmentData_Row']").length;
        //    if (length > 0) {
        //        $('#ValidTo').val($('span#ValidFrom').text());
        //        $('#ValidTo').data("kendoDatePicker").enable(false);
        //    }
        //    else {
        //        $('#ValidTo').val($('span#ValidFrom').text());
        //        $('#ValidTo').data("kendoDatePicker").enable(true);
        //    }
        //},
        //beforeRowAppend: function (tableID, uniqueIndex) {

        //    validateGridData();
        //    if (!isValidAllotment) {
        //        return false;
        //    }
        //    else
        //        return true;
        //}

      });
      
          var rowcount = $('#tblAllotmentData tbody tr').length;
          for (var i = 1; i <= rowcount; i++) {
              var shcval = $("input[name^=tblAllotmentData_RbtnIsExcludeSHC_" + i + "]:checked").val();
              var shctext = $("#tblAllotmentData_LblIsExcludeSHC_" + i + "_" + shcval).text();
              $("#tblAllotmentData_LblIsExcludeSHC_" + i + "_" + shcval).attr("oldvalue", shctext);

              var commodityval = $("input[name^=tblAllotmentData_RbtnIsExcludeCommodity_" + i + "]:checked").val();
              var commoditytext = $("#tblAllotmentData_LblIsExcludeCommodity_" + i + "_" + commodityval).text();
              $("#tblAllotmentData_LblIsExcludeCommodity_" + i + "_" + commodityval).attr("newvalue", commoditytext);

              var productval = $("input[name^=tblAllotmentData_RbtnIsExcludeProduct_" + i + "]:checked").val();
              var producttext = $("#tblAllotmentData_LblIsExcludeProduct_" + i + "_" + productval).text();
              $("#tblAllotmentData_LblIsExcludeProduct_" + i + "_" + productval).attr("newvalue", producttext);


              $("#tblAllotmentData_GrossWeight_" + i).attr("oldvalue", $("#tblAllotmentData_GrossWeight_" + i).val());
              $("#tblAllotmentData_Volume_" + i).attr("oldvalue", $("#tblAllotmentData_Volume_" + i).val());
              $("#tblAllotmentData_GrossVariancePlus_" + i).attr("oldvalue", $("#tblAllotmentData_GrossVariancePlus_" + i).val());
              $("#tblAllotmentData_GrossVarianceMinus_" + i).attr("oldvalue", $("#tblAllotmentData_GrossVarianceMinus_" + i).val());
              $("#tblAllotmentData_VolumeVariancePlus_" + i).attr("oldvalue", $("#tblAllotmentData_VolumeVariancePlus_" + i).val());
              $("#tblAllotmentData_VolumeVarianceMinus_" + i).attr("oldvalue", $("#tblAllotmentData_VolumeVarianceMinus_" + i).val());
              $("#divMultitblAllotmentData_SHC_" + i).attr("oldvalue", $("#divMultitblAllotmentData_SHC_" + i + " " + "ul").find("span").text());
              //$("#tblAllotmentData_RbtnIsExcludeSHC_" + i).attr("oldvalue", $("input[name^=tblAllotmentData_RbtnIsExcludeSHC_" + i + "]:checked").val());
              $("#divMultitblAllotmentData_Commodity_" + i).attr("oldvalue", $("#divMultitblAllotmentData_Commodity_" + i + " " + "ul").find("span").text());
              $("#tblAllotmentData_RbtnIsExcludeCommodity_" + i).attr("oldvalue", $("input[name^=tblAllotmentData_RbtnIsExcludeCommodity_" + i + "]:checked").val());
              $("#divMultitblAllotmentData_Product_" + i).attr("oldvalue", $("#divMultitblAllotmentData_Product_" + i + " " + "ul").find("span").text());
              $("#tblAllotmentData_RbtnIsExcludeProduct_" + i).attr("oldvalue", $("input[name^=tblAllotmentData_RbtnIsExcludeProduct_" + i + "]:checked").val());
              $("#tblAllotmentData_ReleaseTimeHr_" + i).attr("oldvalue", $("#tblAllotmentData_ReleaseTimeHr_" + i).val());
              $("#tblAllotmentData_ReleaseTimeMin_" + i).attr("oldvalue", $("#tblAllotmentData_ReleaseTimeMin_" + i).val());
              $("#tblAllotmentData_RbtnIsActive_" + i).attr("oldvalue", $("input[name^=tblAllotmentData_RbtnIsActive_" + i + "]:checked").val());
          }
     
}

function fnUpdate(evtObj, uniqueIndex, rowData)
{
    var arrVal = [];
    window.onbeforeunload = function () { };

    if (parseInt($('#tblAllotmentData_GrossWeight_' + uniqueIndex).val() || 0) <= 0)
    {
        ShowMessage('warning', 'Information!', 'Gross Weight can not be blank and should be greater than 0 .');
        return false;
    }
    else if (parseFloat($('#tblAllotmentData_GrossWeight_' + uniqueIndex).val() || 0) <= 0.000) {
        ShowMessage('warning', 'Information!', 'Volume can not be blank and should be greater than 0.000 .');
        return false;
    }
    else if (parseInt($('#tblAllotmentData_ReleaseTimeHr_' + uniqueIndex).val() || 0) * 60 + parseInt($('#tblAllotmentData_ReleaseTimeMin_' + uniqueIndex).val() || 0) <= 0) {
        ShowMessage('warning', 'Information!', 'Release Time can not be blank and should be greater than 0 .');
        return false;
    }

    model = [
         {
             SNo: rowData.SNo,
             IsUsed: rowData.IsUsed,
             AllowToSubmit: rowData.AllowToSubmit,
             DailyFlightSNo: rowData.DailyFlightSNo,
             AllotmentSNo: rowData.AllotmentSNo,
             AllotmentCode: "",
             FlightNo: "",
             FlightDate: "",
             Ori: "",
             Dest: "",
             AllotmentTypeSNo: "",
             HdnAllotmentTypeSNo: "",
             OfficeSNo: "",
             HdnOfficeSNo: "",
             AccountSNo: "",
             HdnAccountSNo: "",
             GrossWeight: parseFloat(rowData.GrossWeight || 0),
             Volume: parseFloat(rowData.Volume || 0),
             UsedGrossWT: 0,
             UsedVolWT: 0,
             ReleaseGross: 0,
             ReleaseVolume: 0,
             GrossVariancePlus: parseFloat(rowData.GrossVariancePlus || 0),
             GrossVarianceMinus: parseFloat(rowData.GrossVarianceMinus || 0),
             VolumeVariancePlus: parseFloat(rowData.VolumeVariancePlus || 0),
             VolumeVarianceMinus: parseFloat(rowData.VolumeVarianceMinus || 0),
             SHC: "",
             HdnSHC: $('#tblAllotmentData_HdnSHC_' + uniqueIndex).val(),
             Commodity: "",
             HdnCommodity: $('#tblAllotmentData_HdnCommodity_' + uniqueIndex).val(),
             Product: "",
             HdnProduct: $('#tblAllotmentData_HdnProduct_' + uniqueIndex).val(),
             IsExcludeSHC: (rowData.IsExcludeSHC || null) == null ? null : rowData.IsExcludeSHC == "1",
             ExcludeSHC: "",
             IsExcludeCommodity: (rowData.IsExcludeCommodity || null) == null ? null : rowData.IsExcludeCommodity == "1",
             ExcludeCommodity: "",
             IsExcludeProduct: (rowData.IsExcludeProduct || null) == null ? null : rowData.IsExcludeProduct == "1",
             ExcludeProduct: "",
             ReleaseTimeHr: parseInt(rowData.ReleaseTimeHr || 0),
             ReleaseTimeMin: parseInt(rowData.ReleaseTimeMin || 0),
             IsActive: rowData.IsActive == "0",
             Active: "",
             IsMandatory: rowData.IsMandatory == "1",
             Mandatory: ""
         }
    ];
    if (model.length > 0) {
        $.ajax({
            url: "./Services/Permissions/AllotmentService.svc/UpdateAllotment", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ model: model }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var TextNo = JSON.parse(result).Table0[0].TextNo;
                var TextMSG = JSON.parse(result).Table0[0].TextMsg;
                if (TextNo == "2001") {

                    //Started:Added By Shivali Thakur for Audit Log//
                    var shcval = $("input[name^=tblAllotmentData_RbtnIsExcludeSHC_" + uniqueIndex + "]:checked").val();
                    var shctext = $("#tblAllotmentData_LblIsExcludeSHC_" + uniqueIndex + "_" + shcval).text();
                    $("#tblAllotmentData_LblIsExcludeSHC_" + uniqueIndex + "_" + shcval).attr("newvalue", shctext);

                    var commodityval = $("input[name^=tblAllotmentData_RbtnIsExcludeCommodity_" + uniqueIndex + "]:checked").val();
                    var commoditytext = $("#tblAllotmentData_LblIsExcludeCommodity_" + uniqueIndex + "_" + commodityval).text();
                    $("#tblAllotmentData_LblIsExcludeCommodity_" + uniqueIndex + "_" + commodityval).attr("newvalue", commoditytext);

                    var productval = $("input[name^=tblAllotmentData_RbtnIsExcludeProduct_" + uniqueIndex + "]:checked").val();
                    var producttext = $("#tblAllotmentData_LblIsExcludeProduct_" + uniqueIndex + "_" + productval).text();
                    $("#tblAllotmentData_LblIsExcludeProduct_" + uniqueIndex + "_" + productval).attr("newvalue", producttext);




                    $("#tblAllotmentData_GrossWeight_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_GrossWeight_" + uniqueIndex).val());
                    $("#tblAllotmentData_Volume_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_Volume_" + uniqueIndex).val());
                    $("#tblAllotmentData_GrossVariancePlus_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_GrossVariancePlus_" + uniqueIndex).val());
                    $("#tblAllotmentData_GrossVarianceMinus_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_GrossVarianceMinus_" + uniqueIndex).val());
                    $("#tblAllotmentData_VolumeVariancePlus_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_VolumeVariancePlus_" + uniqueIndex).val());
                    $("#tblAllotmentData_VolumeVarianceMinus_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_VolumeVarianceMinus_" + uniqueIndex).val());
                    $("#divMultitblAllotmentData_SHC_" + uniqueIndex).attr("newvalue", $("#divMultitblAllotmentData_SHC_" + uniqueIndex + " " + "ul").find("span").text());

                    //$("#tblAllotmentData_RbtnIsExcludeSHC_" + uniqueIndex).attr("newvalue", $("input[name^=tblAllotmentData_RbtnIsExcludeSHC_" + uniqueIndex + "]:checked").val());
                    $("#divMultitblAllotmentData_Commodity_" + uniqueIndex).attr("newvalue", $("#divMultitblAllotmentData_Commodity_" + uniqueIndex + " " + "ul").find("span").text());
                    //  $("#tblAllotmentData_RbtnIsExcludeCommodity_" + uniqueIndex).attr("newvalue", $("input[name^=tblAllotmentData_RbtnIsExcludeCommodity_" + uniqueIndex + "]:checked").val());
                    $("#divMultitblAllotmentData_Product_" + uniqueIndex).attr("newvalue", $("#divMultitblAllotmentData_Product_" + uniqueIndex + " " + "ul").find("span").text());

                    $("#tblAllotmentData_RbtnIsExcludeProduct_" + uniqueIndex).attr("newvalue", $("input[name^=tblAllotmentData_RbtnIsExcludeProduct_" + uniqueIndex + "]:checked").val());
                    $("#tblAllotmentData_ReleaseTimeHr_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_ReleaseTimeHr_" + uniqueIndex).val());
                    $("#tblAllotmentData_ReleaseTimeMin_" + uniqueIndex).attr("newvalue", $("#tblAllotmentData_ReleaseTimeMin_" + uniqueIndex).val());
                    $("#tblAllotmentData_RbtnIsActive_" + uniqueIndex).attr("newvalue", $("input[name^=tblAllotmentData_RbtnIsActive_" + uniqueIndex + "]:checked").val());

                    var oldval = (($("#tblAllotmentData_GrossWeight_" + uniqueIndex).attr("oldvalue")||'')+'(G.W.)') + "/" + (($("#tblAllotmentData_Volume_" + uniqueIndex).attr("oldvalue")||'')+'(V)') + "/" +(( $("#tblAllotmentData_GrossVariancePlus_" + uniqueIndex).attr("oldvalue")||'')+'(G.V.)') + "/" + (($("#tblAllotmentData_GrossVarianceMinus_" + uniqueIndex).attr("oldvalue")||'')+'G.V.') + "/" + (($("#tblAllotmentData_VolumeVariancePlus_" + uniqueIndex).attr("oldvalue")||'')+'(V.V)') + "/" + (($("#tblAllotmentData_VolumeVarianceMinus_" + uniqueIndex).attr("oldvalue")||'')+'(V.V)') + "/" +(($("#divMultitblAllotmentData_SHC_" + uniqueIndex).attr("oldvalue")||'')+'(SHC)') + "/" + (($("#tblAllotmentData_LblIsExcludeSHC_" + uniqueIndex + "_" + shcval).attr("oldvalue")||'')+'(S.Type)') + "/" + (($("#divMultitblAllotmentData_Commodity_" + uniqueIndex).attr("oldvalue")||'')+'(Comm)') + "/" + ($("#tblAllotmentData_LblIsExcludeCommodity_" + uniqueIndex + "_" + commodityval).attr("oldvalue")||'')+'(C.Type)' + "/" + (($("#divMultitblAllotmentData_Product_" + uniqueIndex).attr("oldvalue")||'')+'(Pro)') + "/" + (($("#tblAllotmentData_LblIsExcludeProduct_" + uniqueIndex + "_" + productval).attr("oldvalue")||'')+'(P.Type)') + "/" + (($("#tblAllotmentData_ReleaseTimeHr_" + uniqueIndex).attr("oldvalue") + ":" + $("#tblAllotmentData_ReleaseTimeMin_" + uniqueIndex).attr("oldvalue")||'')+'(R.Time)');
                    var newval = (($("#tblAllotmentData_GrossWeight_" + uniqueIndex).attr("newvalue") || '') + '(G.W.)') + "/" + (($("#tblAllotmentData_Volume_" + uniqueIndex).attr("newvalue") || '') + '(V)') + "/" + (($("#tblAllotmentData_GrossVariancePlus_" + uniqueIndex).attr("newvalue") || '') + '(G.V.)') + "/" + (($("#tblAllotmentData_GrossVarianceMinus_" + uniqueIndex).attr("newvalue") || '') + 'G.V.') + "/" + (($("#tblAllotmentData_VolumeVariancePlus_" + uniqueIndex).attr("newvalue") || '') + '(V.V)') + "/" + (($("#tblAllotmentData_VolumeVarianceMinus_" + uniqueIndex).attr("newvalue") || '') + '(V.V)') + "/" + (($("#divMultitblAllotmentData_SHC_" + uniqueIndex).attr("newvalue") || '') + '(SHC)') + "/" + (($("#tblAllotmentData_LblIsExcludeSHC_" + uniqueIndex + "_" + shcval).attr("newvalue") || '') + '(S.Type)') + "/" + (($("#divMultitblAllotmentData_Commodity_" + uniqueIndex).attr("newvalue") || '') + '(Comm)') + "/" + ($("#tblAllotmentData_LblIsExcludeCommodity_" + uniqueIndex + "_" + commodityval).attr("newvalue") || '') + '(C.Type)' + "/" + (($("#divMultitblAllotmentData_Product_" + uniqueIndex).attr("newvalue") || '') + '(Pro)') + "/" + (($("#tblAllotmentData_LblIsExcludeProduct_" + uniqueIndex + "_" + productval).attr("newvalue") || '') + '(P.Type)') + "/" + (($("#tblAllotmentData_ReleaseTimeHr_" + uniqueIndex).attr("newvalue") + ":" + $("#tblAllotmentData_ReleaseTimeMin_" + uniqueIndex).attr("newvalue") || '') + '(R.Time)');
                    var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "Allotment", ColumnName: 'Allotment Flight Information slab-' + uniqueIndex, OldValue: oldval, NewValue: newval };
                    arrVal.push(a);
                        
                    SaveAppendGridAuditLog("Allotment Code", $("#tblAllotmentData_AllotmentCode_" + uniqueIndex).text(), "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                    //Added By Shivali Thakur for Audit Log//
                    ShowMessage('success', 'Allotment!', TextMSG);
                }
                else {
                    ShowMessage('warning', 'Allotment!', TextMSG);
                }
            },
            error: function () {
                ShowMessage('warning', 'Allotment!', 'Error...');
            }
        });
    }
    else
    {
        ShowMessage('warning', 'Allotment!', 'There is no row to update.');
    }
}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}