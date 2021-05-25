var dbTableName = 'ViewEditFlight';
var reservedGrossWt = "0.00";
var reservedVolumeWt = "0.00";
var freeSaleGrossWt = "0.00";
var freeSaleVolumeWt = "0.00";
var EditedRecord = 0;
var isPreviousDayRecord = false;
var MinReserveGross = 0.00;
var MinReserveVol = 0.00;
var TotalAllotmentGross = 0.00;
var TotalAllotmentVol = 0.00;
var TotalReleasedGross = 0.00;
var TotalReleasedVol = 0.00;
var isValidAllotment = true;
$(document).ready(function () {
    $('#SearchFlight').removeClass('button').addClass("btn").addClass("btn-success");
    $("#divEditFlight").load("HtmlFiles/Schedule/ViewEditFlight.html", pageLoaded);
});

function pageLoaded(e) {
    cfi.ValidateForm();
    var tabStrip1 = $("#Applicationtabs").kendoTabStrip().data("kendoTabStrip");


    $('#ValidFrom').css('width', '80px');
    $('#ValidTo').css('width', '80px');
    $('tr').find('td.formbuttonrow').remove();
    cfi.AutoCompleteV2("FlightSNo", "SNo,FlightNo", "ViewNEditFlight_FlightNo1", null, "contains");
    cfi.AutoCompleteV2("Origin", "SNo,OriginAirportCode", "ViewNEditFlight_Origin", null, "contains");
    cfi.AutoCompleteV2("Destination", "SNo,DestinationAirportCode", "ViewNEditFlight_Destination", null, "contains");
    cfi.AutoCompleteV2("ckFlightSNo", "SNo,FlightNo", "ViewNEditFlight_FlightNo2", null, "contains");
    cfi.AutoCompleteV2("FlightType", "SNo,FlightTypeName", "ViewNEditFlight_FlightType", null, "contains");
    cfi.AutoCompleteV2("shc", "SNo,Code", "ViewNEditFlight_SHC", null, "contains", ',');
    cfi.AutoCompleteV2("com", "SNo,CommodityDescription", "ViewNEditFlight_Commodity", null, "contains", ',');
    cfi.AutoCompleteV2("product", "SNo,ProductName", "ViewNEditFlight_Product", null, "contains", ',');
    cfi.AutoCompleteV2("AircraftRegistration", "RegistrationNo", "ViewNEditFlight_RegistrationNo", null, "contains");
    cfi.AutoCompleteV2("AircraftType", "SNo,AircraftType", "ViewNEditFlight_AircraftType", BindAircraftWeight, "contains");
    cfi.AutoCompleteV2("AccountSNo", "SNo,Name", "ViewNEditFlight_Account1", null, "contains");
    cfi.AutoCompleteV2("controlCity", "SNo,CityCode", 'ViewNEditFlight_ControlCity', null, "contains");
    

    $("#tblEditFlightwise").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            $(this).css("text-align", "right");
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
    $('#reservedCapGrossWt').on('keyup', function () {
        if (Number($('#reservedCapGrossWt').val()) <= Number($("#txtCargoCapGrossWt").val())) {
            $('#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt').val(parseFloat((isNaN(parseFloat($("#txtCargoCapGrossWt").val())) ? parseFloat(0).toFixed(2) : parseFloat($("#txtCargoCapGrossWt").val()) - (isNaN(parseFloat($('#reservedCapGrossWt').val())) ? parseFloat(0).toFixed(2) : parseFloat($('#reservedCapGrossWt').val())))).toFixed(2));

            $('#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt').val($('#freeSaleCapGrossWt').val() < 0 ? parseFloat(0).toFixed(2) : parseFloat($('#freeSaleCapGrossWt').val()).toFixed(2));
        }
        else {
            alert("Reserved capacity should not be greater than Cargo Capacity.");
            $('#reservedCapGrossWt,#_tempreservedCapGrossWt').val("0.00");
        }

    });
    $('#reservedCapVolueWt').on('keyup', function () {

        if (Number($('#reservedCapVolueWt').val()) <= Number($("#txtCargoCapVolueWt").val())) {

            $('#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt').val(parseFloat((isNaN(parseFloat($("#txtCargoCapVolueWt").val())) ? parseFloat(0).toFixed(3) : parseFloat($("#txtCargoCapVolueWt").val()) - (isNaN(parseFloat($('#reservedCapVolueWt').val())) ? parseFloat(0).toFixed(3) : parseFloat($('#reservedCapVolueWt').val())))).toFixed(2));

            $('#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt').val($('#freeSaleCapVolumeWt').val() < 0 ? parseFloat(0).toFixed(3) : parseFloat($('#freeSaleCapVolumeWt').val()).toFixed(3));
        }
        else {
            alert("Reserved Volume should not be greater than Cargo Capacity Volume.");
            $('#reservedCapVolueWt,#_tempreservedCapVolueWt').val("0.00");
        }
    });


    $('#freeSaleCapGrossWt').on('keyup', function () {
        if (Number($('#freeSaleCapGrossWt').val()) <= Number($("#txtCargoCapGrossWt").val())) {
            $('#reservedCapGrossWt,#_tempreservedCapGrossWt').val(parseFloat((isNaN(parseFloat($("#txtCargoCapGrossWt").val()))
                ? parseFloat(0).toFixed(2) : (parseFloat($("#txtCargoCapGrossWt").val())) - (isNaN(parseFloat($('#freeSaleCapGrossWt').val())) ? parseFloat(0).toFixed(2) : parseFloat($('#freeSaleCapGrossWt').val())))).toFixed(2));


            $('#reservedCapGrossWt,#_tempreservedCapGrossWt').val($('#reservedCapGrossWt').val() < 0 ? parseFloat(0).toFixed(2) : parseFloat($('#reservedCapGrossWt').val()).toFixed(2));

        }
        else {
            alert("Free Sale capacity should not be greater than Cargo Capacity.");
            $('#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt').val("0.00");
        }
    });

    $('#freeSaleCapVolumeWt').on('keyup', function () {
        if (Number($('#freeSaleCapVolumeWt').val()) <= Number($("#txtCargoCapVolueWt").val())) {
            $('#reservedCapVolueWt,#_tempreservedCapVolueWt').val(parseFloat((isNaN(parseFloat($("#txtCargoCapVolueWt").val())) ? parseFloat(0).toFixed(3) : parseFloat($("#txtCargoCapVolueWt").val()) - (isNaN(parseFloat($('#freeSaleCapVolumeWt').val())) ? parseFloat(0).toFixed(3) : parseFloat($('#freeSaleCapVolumeWt').val())))).toFixed(3));

            $('#reservedCapVolueWt,#_tempreservedCapVolueWt').val($('#reservedCapVolueWt').val() < 0 ? parseFloat(0).toFixed(3) : parseFloat($('#reservedCapVolueWt').val()).toFixed(3));

        }
        else {
            alert("Free Sale capacity Volume should not be greater than Cargo Capacity Volume.");
            $('#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt').val("0.00");
        }

    });

    $('#txtCargoCapGrossWt').on('keyup', function () {
        $('#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt').val(parseFloat((isNaN(parseFloat($("#txtCargoCapGrossWt").val())) ? parseFloat(0).toFixed(2) : parseFloat($("#txtCargoCapGrossWt").val()) - (isNaN(parseFloat($('#reservedCapGrossWt').val())) ? parseFloat(0).toFixed(2) : parseFloat($('#reservedCapGrossWt').val())))).toFixed(2));

        $('#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt').val($('#freeSaleCapGrossWt').val() < 0 ? parseFloat(0).toFixed(2) : parseFloat($('#freeSaleCapGrossWt').val()).toFixed(2));
    });

    $('#txtCargoCapVolueWt').on('keyup', function () {
        $('#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt').val(parseFloat((isNaN(parseFloat($("#txtCargoCapVolueWt").val())) ? parseFloat(0).toFixed(3) : parseFloat($("#txtCargoCapVolueWt").val()) - (isNaN(parseFloat($('#reservedCapVolueWt').val())) ? parseFloat(0).toFixed(3) : parseFloat($('#reservedCapVolueWt').val())))).toFixed(3));

        $('#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt').val($('#freeSaleCapVolumeWt').val() < 0 ? parseFloat(0).toFixed(3) : parseFloat($('#freeSaleCapVolumeWt').val()).toFixed(3));
    });

    $('#reservedCapGrossWt,#reservedCapVolueWt,#freeSaleCapGrossWt,#freeSaleCapVolumeWt,#txtCargoCapVolueWt,#txtCargoCapVolueWt').on('blur', function () {
        if (this.value == "") {
            $('#' + this.id).val(parseFloat(0).toFixed(2));
            $('#_temp' + this.id).val(parseFloat(0).toFixed(2));
        }
    });




    $('#MovementNo').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    });
    $("#AllDays").change(function () {
        $("input:checkbox[name='Days']").prop('checked', this.checked);
    });



    $("input[type='checkbox'][name='Days']").change(function () {
        setResetAllDays();
    });
    $('#SearchFlight').click(function () {
        searchFlight();
    });
    $('input:radio[name=IsActive]').change(function () {
        if ($("input[name='IsActive']:checked").val() == '0') {
            ShowMessage('info', 'Need your Kind Attention!', "Flight will be cancelled and all other changes not applicable.");
        }
        else {
            ShowMessage('info', 'Need your Kind Attention!', "Cancelled flight will be active & all other changes will not be applicable.");
        }
    });

    $("#chkCargoCapacityenableDisable").change(function () {
        $("#txtCargoCapGrossWt,#_temptxtCargoCapGrossWt").attr("disabled", !this.checked);
        $("#txtCargoCapVolueWt,#_temptxtCargoCapVolueWt").attr("disabled", !this.checked);
    });
    $("#chkAlertCapacityenableDisable").change(function () {
        $("#alertCapGrossWt,#_tempalertCapGrossWt").attr("disabled", !this.checked);
        $("#alertCapVolueWt,#_tempalertCapVolueWt").attr("disabled", !this.checked);
    });
    $("#chkReservedenableDisable").change(function () {
        $("#reservedCapGrossWt,#_tempreservedCapGrossWt").attr("disabled", !this.checked);
        $("#reservedCapVolueWt,#_tempreservedCapVolueWt").attr("disabled", !this.checked);
    });
    $("#chkFreesaleenableDisable").change(function () {
        $("#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt").attr("disabled", !this.checked);
        $("#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt").attr("disabled", !this.checked);
    });
    $("#chkQueueLimitenableDisable").change(function () {
        $("#QueueLimitGrossWt,#_tempQueueLimitGrossWt").attr("disabled", !this.checked);
        $("#QueueLimitVolumeWt,#_tempQueueLimitVolumeWt").attr("disabled", !this.checked);
    });


    $("#chkOverbookingCapacity").change(function () {
        $("#OverbookingCapacityGrossWt,#_tempOverbookingCapacityGrossWt").attr("disabled", !this.checked);
        $("#OverbookingCapacityVolumeWt,#_tempOverbookingCapacityVolumeWt").attr("disabled", !this.checked);
    });


    //$("#chkshcenableDisable").change(function () {
    //    $("#Text_shc").data('kendoAutoComplete').enable(this.checked);
    //});
    //$("#chkcomenableDisable").change(function () {
    //    $("#Text_com").data("kendoAutoComplete").enable(this.checked);
    //});
    //$("#chkproductenableDisable").change(function () {

    //    $("#Text_product").data("kendoAutoComplete").enable(this.checked);
    //});

    $("input[name='operation']").unbind("click").click(function () {

        if (!cfi.IsValidSubmitSection()) return false;
        UpdateDetail();
    });
    $("input[id^=FlightDateSearch]").blur(function (e) {
        $("input[id^=FlightDateSearch]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
    });
    $("input[id^=ValidTo]").blur(function (e) {
        $("input[id^=ValidTo]").val($("#" + $(this).attr("id")).val().replace(/[^A-Z0-9-/]/ig, ''));
    });

    $('#txtBookingClosureTimeet').closest('tr').hide();
    //$("#" + 'ValidTo').kendoDatePicker({
    //    min: $('span#ValidFrom').text()
    //});
    $("#Text_FlightSNo").on("select", function () {
        $("#Text_Origin").val('');
        $("#Text_Destination").val('');
        //if ($("#Text_FlightSNo").val() != '') {

        //    $("#Text_Origin").removeAttr("data-valid");
        //    $("#Text_Origin").removeAttr("data-valid-msg","Origin can not be blank");
        //    $("#spnOrigin").closest("td").find("font").html('');

        //    $("#Text_Destination").removeAttr("data-valid");
        //    $("#Text_Destination").removeAttr("data-valid-msg", "Destination can not be blank");
        //    $("#spnDestination").closest("td").find("font").html('');


        //}
        //else {
        //    $("#Text_Origin").attr("data-valid", "required");
        //    $("#Text_Origin").attr("data-valid-msg", "Origin can not be blank");
        //    $("#spnOrigin").closest("td").find("font").html('*');
        //    $("#Text_Origin").attr("explicitValid", "1");

        //    $("#Text_Destination").attr("data-valid", "required");
        //    $("#Text_Destination").attr("data-valid-msg", "Destination can not be blank");
        //    $("#spnDestination").closest("td").find("font").html('*');
        //    $("#Text_Destination").attr("explicitValid", "1");
        //}
    });

    $("#txtWhtPerPax,#txtOpenSeat").on("keyup", function () {
        if ((Number($("#txtWhtPerPax").val()) * Number($("#txtOpenSeat").val())) + Number($("#txtCargoCapGrossWt").val()) > Number($("#txtstructuralCapacity").val())) {
            $("#CommercialCapacity,#_tempCommercialCapacity").val(Number($("#txtstructuralCapacity").val()));
        }
        else {
            $("#CommercialCapacity,#_tempCommercialCapacity").val((Number($("#txtWhtPerPax").val()) * Number($("#txtOpenSeat").val())) + Number($("#txtCargoCapGrossWt").val())) > Number($("#txtstructuralCapacity").val());
        }


    });

    //Added By Pankaj Khanna
    $('#ETD,#ETA,#ATA,#ATD').blur(function () {

        var x = $("#" + this.id).val();
        var value = 0;
        for (var i = 0; i < x.length ; i++) {
            var iKeyCode = x.charAt(i);
            if (iKeyCode.toString() == '0' || iKeyCode.toString() == '1' || iKeyCode.toString() == '2' || iKeyCode.toString() == '3' || iKeyCode.toString() == '4' || iKeyCode.toString() == '5' || iKeyCode.toString() == '6' || iKeyCode.toString() == '7' || iKeyCode.toString() == '8' || iKeyCode.toString() == '9')
                value = 0;
            else {
                value = 1;
                break;
            }
        }
        if (x.length != 4) {
            value = 1;
        }
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (firstno >= 4 && (x.charAt(0) != 1 && x.charAt(0) != 0))
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }


        if (value == 1) {
            $("#" + this.id).val('');
            //alert('Please enter correct ' + this.id + ' format');
            ShowMessage('warning', 'Warning!', 'Please enter correct ' + this.id + ' format');
            return false;
        }

        if ((this.id.indexOf('ETD') >= 0 || this.id.indexOf('ETA') >= 0) && $("#slctDayDiff").val() == 0 && parseInt($("#ETD").val()) > parseInt($("#ETA").val())) {
            ShowMessage('warning', 'Warning!', "ETA should be greater than ETD Other wise Automatically Set Arrival Day Diff to 1.");
            $("#slctDayDiff option[value=1]").prop('selected', true);
        }
    });

    $("#slctDayDiff").unbind().bind('change', function (evt) {

        if ($("#slctDayDiff").val() == 0 && parseInt($("#ETD").val()) > parseInt($("#ETA").val())) {

            ShowMessage('warning', 'Warning!', "ETA should be greater than ETD Other wise Automatically Set Arrival Day Diff to 1.");
            //alert("ETA should be greater than ETD Other wise Automatically Set Arrival Day Diff to 1.");
            $("#slctDayDiff option[value=1]").prop('selected', true);
            evt.preventDefault();
        }
        //ShowMessage('warning', 'Warning - User Type Validation!', "Please Enter User Type");
    });

    $("input[type=radio][name=IsCAO]").click(function () {
        $("#AircraftType").val('');
        $("#Text_AircraftType").val('');
    });

    $("input[type=radio][name=IsDelay]").click(function () {

        if ($(this).val() == '1') {
            $("#ValidTo").data("kendoDatePicker").value($('span#ValidFrom').text());
            $('#ValidTo').data("kendoDatePicker").enable(false);
        }
        else { $('#ValidTo').data("kendoDatePicker").enable(true); }

    });

    $('#ATD,#ATA').attr('disabled', true);
}

function startChange() {
    var startDate = start.value(),
    endDate = end.value();

    if (startDate) {
        startDate = new Date(startDate);
        startDate.setDate(startDate.getDate());
        end.min(startDate);
    } else if (endDate) {
        start.max(new Date(endDate));
    } else {
        endDate = new Date();
        start.max(endDate);
        end.min(endDate);
    }
}

function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("FlightSNo") >= 0) {
        var typeval = $('#FlightDateSearch').attr("sqldatevalue");
        cfi.setFilter(f, "FlightDate", "eq", typeval);

    }
    else if (textId.indexOf("AircraftType") >= 0) {
        var typeval = $("#FlightNo").text();
        var arr = $.trim(typeval).split('-');
        cfi.setFilter(f, "CarrierCode", "eq", arr[0]);
        cfi.getFilter("AND"), cfi.setFilter(f, "CargoClassification", "in", ($("input:radio[name=IsCAO]:checked").val() != "0") ? ("1,3,4") : ("2"));
    }
    else if (textId.indexOf("AircraftRegistration") >= 0) {
        cfi.setFilter(f, "AirCraftSNo", "eq", $("#AircraftType").val());
        cfi.setFilter(f, "IsActive", "eq", 1);
    }

    else if (textId == "Text_Destination") {
        cfi.setFilter(f, "DestinationAirportCode", "neq", $("#Text_Origin").val());
    }

    else if (textId == "Text_Origin") {
        cfi.setFilter(f, "OriginAirportCode", "neq", $("#Text_Destination").val());
    }
        //if (textId.indexOf("Text_Origin") >= 0) {
        //    cfi.setFilter(f, "SNo", $('#FlightSNo').val() == "" ? "notin" : "in", $('#FlightSNo').val() == "" ? "0" : $('#FlightSNo').val());
        //}

        //if (textId.indexOf("Text_Destination") >= 0) {
        //    cfi.setFilter(f, "SNo", "notin", $('#FlightSNo').val());

        //}

    else if (textId.indexOf("tblDailyFlightAllotment_AccountSNo_") >= 0) {
        var Rno = textId.split('_')[2];
        if ($("#tblDailyFlightAllotment_HdnOfficeSNo_" + Rno).val() != '') {
            cfi.setFilter(f, "CarrierCode", "eq", $("span#FlightNo").text().split('-')[0]);
            cfi.setFilter(f, "OfficeSNo", "eq", $("#tblDailyFlightAllotment_HdnOfficeSNo_" + Rno).val());
        }
        else {
            cfi.setFilter(f, "CarrierCode", "eq", $("span#FlightNo").text().split('-')[0]);
            //cfi.setFilter(filterEmbargo, "CustomerType", "in", AgentIsInternational);
        }

    }





    else if (textId.indexOf("tblDailyFlightAllotment_SHC_") >= 0) {
        var Rno = textId.split('_')[2];
        cfi.setFilter(f, "SNo", "notin", $("#tblDailyFlightAllotment_HdnSHC_" + Rno).val());
    }

    else if (textId.indexOf("tblDailyFlightAllotment_Commodity_") >= 0) {
        var Rno = textId.split('_')[2];
        cfi.setFilter(f, "SNo", "notin", $("#tblDailyFlightAllotment_HdnCommodity_" + Rno).val());
    }

    else if (textId.indexOf("tblDailyFlightAllotment_Product_") >= 0) {
        var Rno = textId.split('_')[2];
        cfi.setFilter(f, "SNo", "notin", $("#tblDailyFlightAllotment_HdnProduct_" + Rno).val());
    }

    return cfi.autoCompleteFilter([f]);
}

function UpdateDetail() {
    //if (cfi.IsValidSubmitSection()) {
    if ($("#ValidTo").val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Valid To is required.");
        return false;
    }
    if (false == $("#Mon").prop("checked") && false == $("#Tue").prop("checked") && false == $("#Wed").prop("checked") && false == $("#Thu").prop("checked") && false == $("#Fri").prop("checked") && false == $("#Sat").prop("checked") && false == $("#Sun").prop("checked")) {
        ShowMessage('info', 'Need your Kind Attention!', "Check at least one day");
        return false;
    }
    if ($("#AircraftType").val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Please select AircraftType");
        return false;
    }
    if ($("#GrossWt").val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter Gross Weight");
        return false;
    }
    if ($("#VolueWt").val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter Volume Weight");
        return false;
    }
    if ($("#ETD").val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter STD");
        return false;
    }
    else if ($("#ETD").val() != '') {
        var x = $("#ETD").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (firstno >= 4 && (x.charAt(0) != 1 && x.charAt(0) != 0))
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        if (value == 1) {
            $("#ETD").val('');
            alert('Please enter correct format STD');
            return false;
        }

    }
    if ($("#ETD").val().length < 4) {
        alert('Please enter correct format STD');
    }
    if ($("#ETA").val().length < 4) {
        alert('Please enter correct format STA');
    }
    if ($("#ETA").val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter STA");
        return false;
    }
    else if ($("#ETA").val() != '') {
        var x = $("#ETA").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (firstno >= 4 && (x.charAt(0) != 1 && x.charAt(0) != 0))
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        if (value == 1) {
            $("#ETA").val('');
            alert('Please enter correct format STA');
            return false;
        }

    }
    if ($('#Remarks').val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter Remarks");
        return false;
    }
    var rows = $("tr[id^='tblDailyFlightAllotment']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    for (var i = 0; i < rows.length; i++) {
        if (!validateTableData("tblDailyFlightAllotment", rows[i])) {
            return false;
        }
    }
    //if (!cfi.IsValidSection())
    //{
    //    return false;
    //}

    CalculateAllotment();

    if (parseFloat($('#reservedCapGrossWt').val()) + TotalReleasedGross < MinReserveGross) {
        ShowMessage('warning', 'Need your Kind Attention!', "Released Gross Weight should be minimum " + MinReserveGross);
        return false;
    }
    else if (parseFloat($('#reservedCapVolueWt').val()) + TotalReleasedVol < MinReserveVol) {
        ShowMessage('warning', 'Need your Kind Attention!', "Released Volume should be minimum " + MinReserveVol);
        return false;
    }

    else if (parseFloat($('#reservedCapGrossWt').val()) + TotalReleasedGross < TotalAllotmentGross) {
        ShowMessage('warning', 'Need your Kind Attention!', "Allotment Gross Weight should not exceed the limit of reserved Gross Weight.");
        return false;
    }
    else if (parseFloat($('#reservedCapVolueWt').val()) + TotalReleasedVol < TotalAllotmentVol) {
        ShowMessage('warning', 'Need your Kind Attention!', "Allotment Volume should not exceed the limit of reserved volume.");
        return false;
    }

    validateGridData();


    if (!isValidAllotment) {
        return false;
    }


    var res = $("tr[id^='tblDailyFlightAllotment']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(res.join(","), "tblDailyFlightAllotment");
    var strData = JSON.stringify(JSON.parse($("#tblDailyFlightAllotment").appendGrid('getStringJson')));


    var dailyFlightDetails = [];
    dailyFlightDetails.push({
        FlightNo: $("#FlightNo").html(),
        FlightDate: $("span#ValidFrom").text(), //"\/Date(" + Date.parse($("#FlightDateSearch").attr("sqldatevalue")) + ")\/",
        orgsno: $("#orgsno").val(),
        destsno: $("#destsno").val(),
        ValidFrom: $("span#ValidFrom").text(),// "\/Date(" + Date.parse($("#FlightDateSearch").attr("sqldatevalue")) + ")\/",
        ValidTo: $("#ValidTo").val(), //"\/Date(" + Date.parse($("#ValidTo").attr("sqldatevalue")) + ")\/",
        Mon: $("#Mon").prop("checked"),
        Tue: $("#Tue").prop("checked"),
        Wed: $("#Wed").prop("checked"),
        Thu: $("#Thu").prop("checked"),
        Fri: $("#Fri").prop("checked"),
        Sat: $("#Sat").prop("checked"),
        Sun: $("#Sun").prop("checked"),
        FlightType: $("#FlightType").val(),
        AircraftType: $("#AircraftType").val(),
        RegistrationNo: $("#AircraftRegistration").val(),
        GrossWt: $("#txtCargoCapGrossWt").val() == "" ? 0.00 : $("#txtCargoCapGrossWt").val(),
        VolumeWt: $("#txtCargoCapVolueWt").val() == "" ? 0.00 : $("#txtCargoCapVolueWt").val(),
        ReservedCapGrossWt: $("#reservedCapGrossWt").val() == "" ? 0.00 : $("#reservedCapGrossWt").val(),
        ReservedCapVolumeWt: $("#reservedCapVolueWt").val() == "" ? 0.00 : $("#reservedCapVolueWt").val(),
        FreeSaleGrossWt: $("#freeSaleCapGrossWt").val() == "" ? 0.00 : $("#freeSaleCapGrossWt").val(),
        FreeSaleVolumeWt: $("#freeSaleCapVolumeWt").val() == "" ? 0.00 : $("#freeSaleCapVolumeWt").val(),

        OverBookingGrossWt: $("#OverbookingCapacityGrossWt").val() == "" ? 0.00 : $("#OverbookingCapacityGrossWt").val(),
        OverBookingVolumeWt: $("#OverbookingCapacityVolumeWt").val() == "" ? 0.00 : $("#OverbookingCapacityVolumeWt").val(),
        CommercialCapacity: $("#CommercialCapacity").val() == "" ? 0.00 : $("#CommercialCapacity").val(),
        WeightPerPax: Number($("#txtWhtPerPax").val()),
        OpenSeats: Number($("#txtOpenSeat").val()),


        ETD: $("#ETD").val(),
        ETA: $("#ETA").val(),
        DFSNo: $("#DFSNo").val(),
        Reason: $('#Remarks').val(),
        Active: $('input[name=IsActive]:checked').val(),
        DDiff: 0,
        IsCAO: $('input[name=IsCAO]:checked').val(),
        IsBookingClosed: $('input:radio[name="rdbBooking"]:checked').val(),
        IsCancelled: $('input:radio[name=rdbCancelFlight]:checked').val(),
        Forwarder: $("#AccountSNo").val(),
        MovementNo: $("#MovementNo").val(),
        UserSNo: userContext.UserSNo,
        IsLoadedCancellation: $('input[name=IsLoadedCancellation]:checked').val(),
        IsRFS: $('input[name=IsRFS]:checked').val(),
        strData: btoa(strData),
        IsDelay: $('input:radio[name=IsDelay]:checked').val(),
        ATD: $("#ATD").val(),
        ATA: $("#ATA").val() 
        //,
        //SHC: $("#shc").val(),
        //Commodity: $("#com").val(),
        //Product: $("#product").val(),

    });

    $.ajax({
        url: "Services/Schedule/ViewEditFlightService.svc/UpdateFlightDetail",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ dailyFlightDetails: dailyFlightDetails }),
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            if (result.length > 0) {
                ShowMessage('success', 'Success!', "Flight Updated Successfully.");
                //$('#divEditFlight').css("display", "none");
                //$('#Text_FlightSNo').val('');
                //$('#FlightSNo').val('');
                BindRecord(EditedRecord);
                DailyFlightAllotment();



            }
            else
                ShowMessage('info', 'Need your Kind Attention!', "Flight Not Updated.");
        },
        error: function (xhr) {
            var a = "";
        }
    });
    //}
    //else
    //    return false;
}

function BindRecord(sno) {
    EditedRecord = sno
    var dayDiff = ['0', '1', '2', '3', '4', '5', '6', '7'];
    $("#slctDayDiff option").remove()
    $.each(dayDiff, function (key, value) {
        $("#slctDayDiff").append($("<option></option>").attr("value", key).text(value));
    });
    $.ajax({
        url: "Services/Schedule/ViewEditFlightService.svc/GetEditFlightDetail",
        async: false,
        type: "GET",
        dataType: "json",
        data: { SNo: sno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {

                $("#CommercialCapacity,#_tempCommercialCapacity").attr("disabled", true);
                $("#txtCargoCapGrossWt,#_temptxtCargoCapGrossWt").attr("disabled", true);
                $("#txtCargoCapVolueWt,#_temptxtCargoCapVolueWt").attr("disabled", true);

                $("#alertCapGrossWt,#_tempalertCapGrossWt").attr("disabled", true);
                $("#alertCapVolueWt,#_tempalertCapVolueWt").attr("disabled", true);

                $("#reservedCapGrossWt,#_tempreservedCapGrossWt").attr("disabled", true);
                $("#reservedCapVolueWt,#_tempreservedCapVolueWt").attr("disabled", true);

                $("#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt").attr("disabled", true);
                $("#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt").attr("disabled", true);

                $("#QueueLimitGrossWt,#_tempQueueLimitGrossWt").attr("disabled", true);
                $("#QueueLimitVolumeWt,#_tempQueueLimitVolumeWt").attr("disabled", true);

                $("#OverbookingCapacityGrossWt,#_tempOverbookingCapacityGrossWt").attr("disabled", true);
                $("#OverbookingCapacityVolumeWt,#_tempOverbookingCapacityVolumeWt").attr("disabled", true);

                $("#txtstructuralCapacity,#_temptxtstructuralCapacity").attr("disabled", true);


                $("#txtdaydiff").attr("disabled", true);
                //$("#Text_shc").data("kendoAutoComplete").enable(false);
                //$("#Text_com").data("kendoAutoComplete").enable(false);
                //$("#Text_product").data("kendoAutoComplete").enable(false);



                $('#divViewFlight').css("display", "none");
                $('#divEditFlight').css("display", "block");
                $('#divappendgrid').css("display", "block");
                var v = $.parseJSON(result);
                $("#FlightNo").html(v[0].FlightNo)
                $("#FlightDate").html(v[0].FlightDate);

                $("#orgsno").val(v[0].OriginAirportSNo);
                $("#destsno").val(v[0].DestinationAirPortSNo);
                $("#org").html(v[0].OriginAirportCode);
                $("#Dest").html(v[0].DestinationAirportCode);
                $("#ValidFrom").html(v[0].FlightDate);
                // $("#ValidTo").val(v[0].FlightDate);
                $("#ValidTo").kendoDatePicker();
                $("#ValidTo").data("kendoDatePicker").value(v[0].FlightDate);
                $("#ValidTo").data("kendoDatePicker").min(v[0].FlightDate)
                $("#Mon").prop("checked", v[0].Day2 == '0' ? false : true);
                $("#Tue").prop("checked", v[0].Day3 == '0' ? false : true);
                $("#Wed").prop("checked", v[0].Day4 == '0' ? false : true);
                $("#Thu").prop("checked", v[0].Day5 == '0' ? false : true);
                $("#Fri").prop("checked", v[0].Day6 == '0' ? false : true);
                $("#Sat").prop("checked", v[0].Day7 == '0' ? false : true);
                $("#Sun").prop("checked", v[0].Day1 == '0' ? false : true);
                $("#FlightType").val(v[0].FlightTypeSNo);
                $("#Text_FlightType").val(v[0].FlightTypeName);
                $("#AircraftType").val(v[0].AircraftSNo);
                $("#AircraftRegistration").val(v[0].REGISTRATIONNO);
                $("#Text_AircraftRegistration").val(v[0].REGISTRATIONNO);
                $("#Text_AircraftType").val(v[0].AircraftType);
                $('#AccountSNo').val(v[0].Forwarder);
                $('#Text_AccountSNo').val(v[0].ForwarderName);
                $("#txtCargoCapGrossWt,#_temptxtCargoCapGrossWt").val(v[0].GrossWeight);
                $("#txtCargoCapVolueWt,#_temptxtCargoCapVolueWt").val(v[0].VolumeWeight);
                reservedGrossWt = v[0].ReservedGrossWt;
                reservedVolumeWt = v[0].ReservedVolumeWt;
                $("#reservedCapGrossWt,#_tempreservedCapGrossWt").val(v[0].ReservedGrossWt);
                $("#reservedCapVolueWt,#_tempreservedCapVolueWt").val(v[0].ReservedVolumeWt);

                $("#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt").val(v[0].FreeSaleGrossWt);
                $("#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt").val(v[0].FreeSaleVolumeWt);


                freeSaleGrossWt = v[0].FreeSaleGrossWt;
                freeSaleVolumeWt = v[0].FreeSaleVolumeWt;

                $("#CommercialCapacity,#_tempCommercialCapacity").val(v[0].CommercialCapacity);
                $("#txtstructuralCapacity,#_temptxtstructuralCapacity").val(v[0].StructuralCapacity);

                $("#OverbookingCapacityGrossWt,#_tempOverbookingCapacityGrossWt").val(v[0].OverBookingCapacity);
                $("#OverbookingCapacityVolumeWt,#_tempOverbookingCapacityVolumeWt").val(v[0].OverBookingCapacityVolume);

                $("#ETD").val(v[0].ETD);
                $("#ETA").val(v[0].ETA);
                $("#ATD").val(v[0].ATD);
                $("#ATA").val(v[0].ATA);
                // arman
                // $("#lblETD").text(v[0].ETD);
                $("#lblETD").text(v[0].STD) //v[0].ETD+"  - " + v[0].ETDGMT + ('  (GMT)')
                $("#lblETA").text(v[0].STA); //v[0].ETA+"  -  " + v[0].ETAGMT + ('  (GMT)')
                //$("#lblETA").closest('td').html('').append("  -  " + v[0].ETAGMT + ('  (GMT)'))
                // end
                $("#spnETDGMT").text(v[0].ETDGMT);

                $("#spnETAGMT").text(v[0].ETAGMT);
                $("#spnATDGMT").text(v[0].ATDGMT);

                $("#spnATAGMT").text(v[0].ATAGMT);

                $("#DFSNo").val(v[0].SNo);
                $('#Remarks').val(v[0].Remarks);
                $('#MovementNo').val(v[0].MovementNo);

                $('#txtPassengerLoad').text(v[0].PassengerLoad);
                $('#txtBaggageload').text(v[0].BaggageLoad);
                $('#txtNoOfmale').text(v[0].NoOfMale);
                $('#txtNoOfFemale').text(v[0].NoOfFemale);
                $('#txtNoOfChild').text(v[0].NoOfChild);
                $("#txtOpenSeat,#_temptxtOpenSeat").val(v[0].OpenSeats);
                $("#txtWhtPerPax,#_temptxtWhtPerPax").val(v[0].WeightPerPax == "" ? 90.00 : v[0].WeightPerPax);





                //if (v[0].IsActive == "Yes")
                //    $("#IsActiveNo").prop("checked", true);
                //else
                //    $("#IsActiveYes").prop("checked", true);

                if (v[0].IsBookingClosed == "Open")
                    $("#rdbBookingOpen").prop("checked", true);
                else
                    $("#rdbBookingClosed").prop("checked", true);

                if (v[0].IsCancelled == "Yes")
                    $("#rdbCancelFlightYes").prop("checked", true);
                else
                    $("#rdbCancelFlightNo").prop("checked", true);



                if (v[0].IsCAO == "True")
                    $("[name=IsCAO][value=1]").prop("checked", true);
                else
                    $("[name=IsCAO][value=0]").prop("checked", true);


                if (v[0].IsLoadedCancellation == "True")
                    $("#IsLoadedCancellationNo").prop("checked", true);
                else
                    $("#IsLoadedCancellationYes").prop("checked", true);


                if (v[0].IsRFS == "True")
                    $("#IsRFSYES").prop("checked", true);
                else
                    $("#IsRFSNO").prop("checked", true);


                $('#ETA').keypress(function (e) {
                    var iKeyCode = (e.which) ? e.which : e.keyCode
                    if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                        return false;

                });

                $('#ETD').keypress(function (e) {
                    var iKeyCode = (e.which) ? e.which : e.keyCode
                    if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                        return false;

                });
                if (v[0].IsManifested == "True") {
                    $('[name="IsRFS"]').prop("disabled", true);
                }
                else {
                    $('[name="IsRFS"]').prop("disabled", false);
                }

                $("#ValidTo").closest("span").css("width", "100px");
                setResetAllDays();

                var date = new Date();
                date.setHours(0, 0, 0, 0);
                if (Date.parse(date) > Date.parse(v[0].FlightDate) || v[0].IsDeparted == 'True') {
                    isPreviousDayRecord = true;
                    $("input[name='operation']").hide();
                    $('#ValidTo').data("kendoDatePicker").enable(false);
                }
                else {
                    isPreviousDayRecord = false;
                    $("input[name='operation']").show();
                    $('#ValidTo').data("kendoDatePicker").enable(true);
                }

                if (v[0].IsDelay == "True") {
                    $("[name=IsDelay][value=1]").prop("checked", true);
                    $('#ValidTo').data("kendoDatePicker").enable(false);
                    $("[name=IsDelay]").attr('disabled', true);
                }
                else {
                    $("[name=IsDelay][value=0]").prop("checked", true);
                    $("[name=IsDelay]").attr('disabled', false);
                }
            }
            DailyFlightAllotment();
            $("input[type='radio'][name='tblDailyFlightAllotment_RbtnActive_1']").on('change', function () {
                switch ($(this).val()) {
                    case "0":
                        alert("Inactive");
                        break;
                    case "1":
                        alert("active");
                        break;

                }

            });
            setReservedFreesaleGrossWt();

        },
        error: function (xhr) {
            var a = "";
        }
    });
}




function BindAircraftWeight(id) {
    
    $("#AircraftRegistration").val('');
    $("#Text_AircraftRegistration").val('');
    alert("Aircraft capacity has been changed for  " + $("#Text_AircraftType").val());
    $.ajax({
        url: "Services/Schedule/ScheduleService.svc/GetAirCraftWeight",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AirCraftSno: $("#AircraftType").val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 2) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData[0].grossWeight.length > 0 && myData[0].Volumeweight.length > 0 && myData[0].maxGrossWtPiece.length > 0) {

                    $('#txtOpenSeat,#_temptxtOpenSeat').val('');
                    $('#CommercialCapacity,#_tempCommercialCapacity').val(Number(myData[0].grossWeight) > Number(myData[0].StructuralCapacity) ? Number(myData[0].StructuralCapacity) : Number(myData[0].grossWeight));
                    $('#txtstructuralCapacity,#_temptxtstructuralCapacity').val(Number(myData[0].StructuralCapacity));


                    $('#txtCargoCapGrossWt,#_temptxtCargoCapGrossWt').val(Number(myData[0].grossWeight).toFixed(2));
                    $('#txtCargoCapVolueWt,#_temptxtCargoCapVolueWt').val(Number(myData[0].Volumeweight).toFixed(2));

                    $('#OverbookingCapacityGrossWt,#_tempOverbookingCapacityGrossWt').val(Number(myData[0].OverBookingCapacity).toFixed(2));
                    $('#OverbookingCapacityVolueWt,#_tempOverbookingCapacityVolueWt').val(Number(myData[0].OverBookingCapacityVol).toFixed(2));
                    $('#freeSaleCapGrossWt,#_tempfreeSaleCapGrossWt').val(Number(myData[0].FreeSaleCapacity).toFixed(2));
                    $('#freeSaleCapVolumeWt,#_tempfreeSaleCapVolumeWt').val(Number(myData[0].FreeSaleCapacityVol).toFixed(2));

                    $('#reservedCapGrossWt,#_tempreservedCapGrossWt').val(Number(Number(myData[0].grossWeight) - Number(myData[0].FreeSaleCapacity)).toFixed(2));
                    $('#reservedCapVolueWt,#_tempreservedCapVolueWt').val(Number(Number(myData[0].Volumeweight) - Number(myData[0].FreeSaleCapacityVol)).toFixed(2));


                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function DailyFlightAllotment() {
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    //    ShowMessage('info', 'Need your Kind Attention!', "Door Information can be added in Edit/Update mode only.");
    //    return;
    //}
    //else {
    var dbTableName = 'DailyFlightAllotment';
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    cfi.ValidateForm();

    var model =  {
        FlightNo: $("#DFSNo").val()||0
    }

    $('#tbl' + dbTableName).appendGrid({
        V2:true,
        tableID: 'tbl' + dbTableName,
        contentEditable: true,
        tableColumns: 'SNo,AllotmentSNo,AllotmentCode,AgentCode,GrossWeight,Volume',
        masterTableSNo: $("#DFSNo").val()||0,
        pageNo: 1, pageSize: 5, model: model, sort: '',
        isGetRecord: true,
        servicePath: './Services/Schedule/ViewEditFlightService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        //createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        initRows: 1,
        caption: 'Flight Allotment Information',
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'IsUsed', type: 'hidden', value: 0 },
            { name: 'DailyFlightSNo', type: 'hidden', value: 0 },
            { name: 'AllotmentSNo', type: 'hidden', value: 0, ctrlCss: { width: '100px' } },
            { name: 'AllotmentCode', display: 'Allotment Code', type: 'label', ctrlAttr: { controltype: 'label' }, onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '100px' } },

            {
                name: 'AllotmentTypeSNo', display: 'Allotment Type', type: 'text', ctrlAttr: { maxlength: 48, controltype: 'autocomplete', onSelect: "return AllotmentTypeChange(this)" }, onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '100px' }, isRequired: true,
                AutoCompleteName: 'ViewEditFlight_AllotmentType', filterField: 'AllotmentType', filterCriteria: "contains", 
            },//tblDailyFlightAllotment  onChange: function (evt, rowIndex) { alert('hi'); }

            {
                name: 'OfficeSNo', display: 'Office Name', type: 'text', ctrlAttr: { maxlength: 48, controltype: 'autocomplete' }, isRequired: false,
                AutoCompleteName: 'ViewEditFlight_Office', filterField: 'Name', filterCriteria: "contains",
                onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '100px' }
            },
            {
                name: 'AccountSNo', display: 'Agent Name', type: 'text', ctrlAttr: { maxlength: 48, controltype: 'autocomplete' }, onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '100px' }, isRequired: false,
                AutoCompleteName: 'ViewEditFlight_Agent', filterField: 'Name', filterCriteria: "contains",
            },
            { name: 'GrossWeight', display: 'Gross Weight', type: 'text', ctrlAttr: { maxlength: 11, min: 0.01, controltype: "decimal2" }, ctrlCss: { width: '85px' }, isRequired: true, value: 0.01 },
            { name: 'Volume', display: 'Volume', type: 'text', ctrlAttr: { maxlength: 9, min: 0.001, controltype: "decimal3" }, ctrlCss: { width: '80px' }, isRequired: true, value: 0.001, },
            { name: 'ReleaseGross', type: 'hidden', value: 0 },
            { name: 'ReleaseVolume', type: 'hidden', value: 0 },
            {
                name: 'divGrossVariance', display: 'Gross Variance', type: 'div', isRequired: false,
                divElements: [
                    { divRowNo: 1, name: 'GrossVariancePlus', display: '(+)', type: 'text', ctrlAttr: { maxlength: 11, controltype: "decimal2", onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '80px' }, isRequired: false, value: 0, },
                    { divRowNo: 2, name: 'GrossVarianceMinus', display: '(-)', type: 'text', ctrlAttr: { maxlength: 9, controltype: "decimal2", onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '80px' }, value: 0, isRequired: false }
                ]
            },

            {
                name: 'divVolumeVariance', display: 'Volume Variance', type: 'div', isRequired: false,
                divElements: [
                     { divRowNo: 1, name: 'VolumeVariancePlus', display: '(+)', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal3", onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '80px' }, value: 0, isRequired: false },
                     { divRowNo: 2, name: 'VolumeVarianceMinus', display: '(-)', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal3", onblur: "return GrossVolumeVarienceBlur(this)" }, ctrlCss: { width: '80px' }, value: 0, isRequired: false }
                ]
            },

            //{ name: 'Commodity', display: 'Commodity Allotment', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, tableName: 'vCommodity', textColumn: 'CommodityDescription', keyColumn: 'SNo', filterCriteria: "contains", separator: "," },
            //{ name: 'Product', display: 'Product Allotment', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, tableName: 'vProduct', textColumn: 'ProductName', keyColumn: 'SNo', filterCriteria: "contains", separator: "," },

        // {
             //name: 'divSHC', display: 'SHC', type: 'div', isRequired: false,
             //divElements: [
                 {
                     name: 'SHC', display: 'SHC', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '60px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ViewEditFlight_SHC', filterField: 'Code', filterCriteria: "contains", separator: ","
                     //tableName: 'vSHC', textColumn: 'Code', keyColumn: 'SNo',
                 },
                 { name: 'IsExcludeSHC', display: "Include SHC", type: 'radiolist', ctrlOptions: { 0: 'Yes', 1: 'No' }, selectedIndex: 0 },
         //    ]
         //},


        //{
        //    name: 'divCommodity', display: 'Commodity', type: 'div', isRequired: false,
        //    divElements: [
                {
                    name: 'Commodity', display: 'Commodity', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '60px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false,
                    AutoCompleteName: 'ViewEditFlight_Commodity', filterField: 'CommodityDescription', filterCriteria: "contains", separator: ",",//tableName: 'vCommodity', textColumn: 'CommodityDescription', keyColumn: 'SNo', 
                },
                 { name: 'IsExcludeCommodity', display: 'Include Commodity', type: 'radiolist', ctrlOptions: { 0: 'Yes', 1: 'No' }, selectedIndex: 0 },


                 {
                     name: 'Product', display: 'Product', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '60px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, AutoCompleteName: 'ViewEditFlight_Product', filterField: 'ProductName', filterCriteria: "contains", separator: ","
                     //tableName: 'vProduct', textColumn: 'ProductName', keyColumn: 'SNo', 
                 },
                 { name: 'IsExcludeProduct', display: 'Include Product', type: 'radiolist', ctrlOptions: { 0: 'Yes', 1: 'No' }, selectedIndex: 0 },

                 {
                     name: 'divReleaseTime', display: 'Release Time', type: 'div', isRequired: false,
                     divElements: [
                          { divRowNo: 1, name: 'ReleaseTimeHr', display: 'Hr', type: 'text', ctrlAttr: { maxlength: 3, controltype: "number", onblur: "return ReleaseTimeBlur(this)" }, ctrlCss: { width: '35px' }, value: 0, isRequired: false },
                          { divRowNo: 2, name: 'ReleaseTimeMin', display: 'Min', type: 'text', ctrlAttr: { maxlength: 2, controltype: "number", onblur: "return ReleaseTimeBlur(this)" }, ctrlCss: { width: '35px' }, value: 0, isRequired: false }
                     ]
                 },

                { name: 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'Yes', 1: 'No' }, selectedIndex: 0 },



//        ]
//},

//{
//    name: 'divProduct', display: 'Product', type: 'div', isRequired: false,
//    divElements: [
                //{ name: 'Product', display: 'Product', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '60px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, tableName: 'vProduct', textColumn: 'ProductName', keyColumn: 'SNo', filterCriteria: "contains", separator: "," },
                // { name: 'Active', display: null, type: 'radiolist', ctrlOptions: { 0: 'Include', 1: 'Exlude' }, selectedIndex: 1 },
//]
//        }


        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: false, append: isPreviousDayRecord == true ? true : false, removeLast: true },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {


            var DailyFlightSNo = $("#DFSNo").val();
            $("[id^='tblDailyFlightAllotment_DailyFlightSNo']").val(DailyFlightSNo);

            var length = $("tr[id^='tblDailyFlightAllotment_Row']").length;

            if (length > 0) {
                $('#ValidTo').val($('span#ValidFrom').text());
                $('#ValidTo').data("kendoDatePicker").enable(false);
            }
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

            $("tr[id^='tblDailyFlightAllotment_Row']").each(function () {
                if ($(this).find("[id^='tblDailyFlightAllotment_IsUsed']").val() == 1 || isPreviousDayRecord == true) {
                    $(this).find("[id^='tblDailyFlightAllotment_Delete']").remove();

                    $(this).find("[id^='tblDailyFlightAllotment_GrossWeight_']").attr('disabled', true);
                    $(this).find("[id^='tblDailyFlightAllotment_Volume_']").attr('disabled', true);
                    $(this).find("[id^='tblDailyFlightAllotment_GrossVariancePlus_']").attr('disabled', true);
                    $(this).find("[id^='tblDailyFlightAllotment_VolumeVariancePlus_']").attr('disabled', true);
                    $(this).find("[id^='tblDailyFlightAllotment_GrossVarianceMinus_']").attr('disabled', true);
                    $(this).find("[id^='tblDailyFlightAllotment_VolumeVarianceMinus_']").attr('disabled', true);

                    $(this).find("[id^='tblDailyFlightAllotment_ReleaseTimeHr_']").attr('disabled', true);
                    $(this).find("[id^='tblDailyFlightAllotment_ReleaseTimeMin_']").attr('disabled', true);


                    $(this).find("[id^='tblDailyFlightAllotment_AllotmentTypeSNo']").data("kendoAutoComplete").enable(false);
                    $(this).find("[id^='tblDailyFlightAllotment_AccountSNo']").data("kendoAutoComplete").enable(false);
                    $(this).find("[id^='tblDailyFlightAllotment_OfficeSNo']").data("kendoAutoComplete").enable(false);

                    $(this).find("[id^='tblDailyFlightAllotment_SHC_']").data("kendoAutoComplete").enable(false);
                    $(this).find("[id^='tblDailyFlightAllotment_Commodity_']").data("kendoAutoComplete").enable(false);
                    $(this).find("[id^='tblDailyFlightAllotment_Product_']").data("kendoAutoComplete").enable(false);

                    $(this).find('input[type=radio]').attr('disabled', true);
                }

                if ($(this).find("[id^='tblDailyFlightAllotment_AllotmentTypeSNo']").val() == "OPEN") {
                    $(this).find("[id^='tblDailyFlightAllotment_OfficeSNo']").val('');
                    $(this).find("[id^='tblDailyFlightAllotment_HdnOfficeSNo']").val('');
                    $(this).find("[id^='tblDailyFlightAllotment_AccountSNo']").val('');
                    $(this).find("[id^='tblDailyFlightAllotment_HdnAccountSNo']").val('');
                    $(this).find("[id^='tblDailyFlightAllotment_OfficeSNo']").data("kendoAutoComplete").enable(false);
                    $(this).find("[id^='tblDailyFlightAllotment_AccountSNo']").data("kendoAutoComplete").enable(false);
                }
            });

            //length = $("tr[id^='tblDailyFlightAllotment_Row']").length;   
            //if (length > 1) {
            //    lastRowIndex = $("tr[id^='tblDailyFlightAllotment_Row']:last").attr('id').split("_")[2];

            //    if ($('#tblDailyFlightAllotment_IsUsed_ '+lastRowIndex ).val() == 1)
            //        $('#tblDailyFlightAllotment_Delete_1'
            //    var secondlastRow = $("tr[id^='tblDailyFlightAllotment_Row']:nth-last-child(2)").attr('id').split("_")[2];


            //}
        },
        afterRowRemoved: function (tbWhole, rowIndex) {
            var length = $("tr[id^='tblDailyFlightAllotment_Row']").length;
            if (length > 0) {
                $('#ValidTo').val($('span#ValidFrom').text());
                $('#ValidTo').data("kendoDatePicker").enable(false);
            }
            else {
                $('#ValidTo').val($('span#ValidFrom').text());
                $('#ValidTo').data("kendoDatePicker").enable(true);
            }
        },
        beforeRowAppend: function (tableID, uniqueIndex) {

            validateGridData();
            if (!isValidAllotment) {
                return false;
            }
            else
                return true;
        }

    });

    //$("div[id$='divappendgrid']").find("[id^='tblDailyFlightAllotment']").find("[id^='tabledivCommodity'] tr").each(function (row, tr) {

    //// $("div[id$='divappendgrid']").find("[id^='tblDailyFlightAllotment']").each(function () {
    //var id = $(tr).find("input[id^='tblDailyFlightAllotment_SHC_']").attr("id");
    //var txt = $(tr).find("input[id^='tblDailyFlightAllotment_SHC_']").val();
    //var val = $(tr).find("input[id^='tblDailyFlightAllotment_HdnSHC_']").val();
    //cfi.BindMultiValue(id, txt, val);

    // });

    //$("div[id$='divappendgrid']").find("[id^='tblDailyFlightAllotment']").each(function () {
    //var id = $(tr).find("input[id^='tblDailyFlightAllotment_Text_Commodity_']").attr("id");
    //var txt = $(tr).find("input[id^='tblDailyFlightAllotment_Text_Commodity_']").val();
    //var val = $(tr).find("input[id^='tblDailyFlightAllotment_HdnText_Commodity_']").val();
    //cfi.BindMultiValue(id, txt, val);

    //});

    //  $("div[id$='divappendgrid']").find("[id^='tblDailyFlightAllotment']").each(function () {
    //var id = $(tr).find("input[id^='tblDailyFlightAllotment_Product_']").attr("id");
    //var txt = $(tr).find("input[id^='tblDailyFlightAllotment_Product_']").val();
    //var val = $(tr).find("input[id^='tblDailyFlightAllotment_HdnProduct_']").val();
    //cfi.BindMultiValue(id, txt, val);

    //});

    //debugger;
    ////tblDailyFlightAllotment_SHC_1
    //var id = $(this).find("input[id^='tblDailyFlightAllotment_SHC_']").attr("id").replace('Text_', '');
    //var txt = $(this).find("input[id^='tblDailyFlightAllotment_SHC_']").val();
    //var val = $(this).find("input[id^='tblDailyFlightAllotment_HdnSHC_']").val();
    //cfi.BindMultiValue(id, txt, val);
    //$(tr).find("input[id^='tblDailyFlightAllotment_SHC_']").
    //$(tr).find("input[id^='tblDailyFlightAllotment_SHC_']").attr("enabled", false);
    //});



}
function searchFlight() {

    if (!cfi.IsValidSubmitSection()) { return false; }
    $('#tblViewFlight').html('');
    $('#tblViewFlight').html("<tr></tr>");
    $('#divEditFlight').css("display", "none");
    $('#divappendgrid').css("display", "none");

    var Model = { Date: $('#FlightDateSearch').attr("sqldatevalue"), 
        FlightNo: $('#Text_FlightSNo').val(), 
        Origin: $('#Text_Origin').val(), 
        Destination: $('#Text_Destination').val() };


    $.ajax({
        url: "Services/Schedule/ViewEditFlightService.svc/GetFlightDetail",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({model:Model}),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                var strBuilder = "";//<th rowspan=2>Action</th>
                strBuilder += "<table border='1' style='border-collapse:collapse;width:100%; white-space: nowrap;' cellpadding='12' cellspacing='0' ><thead class='k-header'><tr><th rowspan=2 >Flight No.</th><th rowspan=2>Flight Date</th><th rowspan=2>Origin</br>Airport</th><th rowspan=2>Destination</br>Airport</th><th rowspan=2>ETD</th><th rowspan=2>ETA</th><th rowspan=2>STD</th><th rowspan=2>STA</th><th rowspan=2>ATD</th><th rowspan=2>ATA</th><th rowspan=2>Aircraft Type</th><th rowspan=2>Registration No</th> <th colspan=2>Actual Capacity</th> <th colspan=2>Free Sale Capacity</th><th colspan=2>Used Free Sale Capacity</th><th colspan=2>Remaining Free Sale Capacity</th> <th colspan=2>Reserved Capacity</th>  <th colspan=2>Over Booked Capacity</th> <th rowspan=2>Commercial Capacity</th><th colspan=2>Used Capacity</th><th colspan=2>Allocated Weight</th> <th colspan=2>Released Weight</th> <th rowspan=2>Flight Status</th><th rowspan=2>Cancelled</th></tr><tr> <th>Gross Wt.</th> <th>Volume (CBM)</th> <th>Gross Wt.</th><th>Volume (CBM)</th> <th>Gross Wt.</th><th>Volume (CBM)</th><th>Gross Wt.</th><th>Volume (CBM)</th>  <th>Gross Wt.</th>   <th> Volume (CBM)</th>  <th>Gross Wt.</th>   <th> Volume (CBM)</th><th> Gross Wt.</th>   <th>Volume (CBM)</th> <th> Gross Wt.</th>   <th>Volume (CBM)</th>  <th> Gross Wt.</th>   <th>Volume (CBM)</th> </tr></thead><tbody>";
                for (var i = 0 ; i < v.length; i++) {
                    strBuilder += '<tr >';
                   // strBuilder += "<td><input type='hidden' id='hdnDailyFlightSNo' value='" + v[i].SNo + "'><input type='button' style='color: #fff; background-color: #428bca; border-color: #357ebd; width: auto !important; text-align: left; cursor: pointer;' value='Delete' onclick=DeleteRecord('" + v[i].SNo + "');></td>";//BindRecord('" + v[i].SNo + "');

                    strBuilder += "<td>" + v[i].FlightNo + '</td>';
                    //strBuilder += "<td  style='color:blue;width='150px'>" + v[i].Days + '</td>';
                    strBuilder += '<td>' + v[i].FlightDate + '</td>';
                    strBuilder += '<td>' + v[i].OriginAirportCode + '</td>';
                    strBuilder += '<td>' + v[i].DestinationAirportCode + '</td>';
                    strBuilder += '<td>' + v[i].ETD + '</td>';
                    strBuilder += '<td>' + v[i].ETA + '</td>';
                    strBuilder += '<td>' + v[i].STD + '</td>';
                    strBuilder += '<td>' + v[i].STA + '</td>';
                    strBuilder += '<td>' + v[i].ATD + '</td>';
                    strBuilder += '<td>' + v[i].ATA + '</td>';
                    strBuilder += "<td >" + v[i].AircraftType.toUpperCase() + '</td>';
                    strBuilder += "<td >" + v[i].REGISTRATIONNO.toUpperCase() + '</td>';
                    strBuilder += '<td>' + v[i].GrossWeight + '</td>';
                    strBuilder += '<td>' + v[i].VolumeWeight + '</td>';
                    strBuilder += '<td>' + v[i].FreeSaleCapacity + '</td>';
                    strBuilder += '<td>' + v[i].FreeSaleCapacityVolume + '</td>';

                    strBuilder += '<td>' + v[i].FreesaleUsedGross + '</td>';
                    strBuilder += '<td>' + v[i].FreesaleUsedVolume + '</td>';

                    strBuilder += '<td>' + v[i].AvlFreesaleGross + '</td>';
                    strBuilder += '<td>' + v[i].AvlFreeSaleVolume + '</td>';

                    strBuilder += '<td>' + v[i].ReservedCapacityGrosswt + '</td>';
                    strBuilder += '<td>' + v[i].ReservedCapacityVolwt + '</td>';

                    strBuilder += '<td>' + v[i].OverBookingCapacity + '</td>';
                    strBuilder += '<td>' + v[i].OverBookingCapacityVolume + '</td>';







                    // strBuilder += "<td >GMT</td>";

                    // strBuilder += '</tr>';

                    // strBuilder += '<tr>';

                    //strBuilder += "<td >" + v[i].FlightTypeName + '</td>';
                    strBuilder += "<td>" + v[i].CommercialCapacity + '</td>';

                    //used capacity
                    strBuilder += "<td>" + v[i].UsedGrossWeight + '</td>';
                    strBuilder += "<td>" + v[i].UsedVolume + '</td>';

                    strBuilder += "<td>" + v[i].AllocatedGross + '</td>';
                    strBuilder += "<td>" + v[i].AllocatedVolume + '</td>';

                    //strBuilder += "<td>" + v[i].FlightStatus + '</td>';

                    strBuilder += '<td>' + v[i].ReleasedGrossWt + '</td>';
                    strBuilder += '<td>' + v[i].ReleasedVolumeWt + '</td>';

                    strBuilder += "<td >" + v[i].IsBookingClosed + '</td>';
                    strBuilder += "<td>" + v[i].IsCancelled + '</td>';

                    strBuilder += '</tr>';

                    //strBuilder += '<tr>';
                    //strBuilder += "<td colspan='6' align='right'></td>";
                    //strBuilder += '</tr>';
                    // strBuilder += "<tbody></table>";
                    //strBuilder += "<div style='height:30px'/>";

                }
                strBuilder += "<tbody></table>";
                strBuilder += "<div style='height:30px'/>";
                $('#divViewFlight').css("display", "block");
                $('#tblViewFlight tr:last').after(strBuilder);

            }
            else alert("Record not found.");
        },
        error: function (xhr) {
            var a = "";
        }
    });

}
function CancelDetail() {
    $('#divEditFlight').hide();
    $('#divappendgrid').hide();
    searchFlight();
}
function setReservedFreesaleGrossWt() {
    $("[id^='tblDailyFlightAllotment_GrossWt_']").on('keyup', function () {
        $('#tblDailyFlightAllotment tbody tr').each(function (index, row) {


            if ($(this).find("[id^='tblDailyFlightAllotment_GrossWt_']").val() != undefined) {
                if (Number($(this).find("[id^='tblDailyFlightAllotment_GrossWt_']").val()) > Number($("#reservedCapGrossWt").val())) {
                    alert("Allotment Gross Wt should not greater that Reserved Capacity.");
                    $("#reservedCapGrossWt").val(Number($("#txtCargoCapGrossWt").val()) - Number($("#freeSaleCapGrossWt").val()));
                    $(this).find("[id^='tblDailyFlightAllotment_GrossWt_']").val("0.00");
                    $("#reservedCapGrossWt").val(reservedGrossWt);
                    $("#freeSaleCapGrossWt").val(freeSaleGrossWt);


                    return false;
                }
                else {


                    $('#reservedCapGrossWt').val(Number(Number(reservedGrossWt) - Number($(this).find('[id^="tblDailyFlightAllotment_GrossWt_' + parseInt(index + 1) + '"]').val())).toFixed(2));

                    $('#freeSaleCapGrossWt').val(Number(Number(freeSaleGrossWt) + Number($(this).find('[id^="tblDailyFlightAllotment_GrossWt_' + parseInt(index + 1) + '"]').val())).toFixed(2));

                }
            }


        });
    });
}
function setResetAllDays() {

    var a = [];
    a = $("input[type='checkbox'][name='Days']:checked").map(function () {
        return $(this).val()

    }).get().join(',').split(',');
    if (a.length < 7)
        $("input:checkbox[id='AllDays']").prop('checked', false);
    else
        $("input:checkbox[id='AllDays']").prop('checked', true);


}

function BindFlightPreviousRecord() {
    $.ajax({
        url: "Services/Schedule/ViewEditFlightService.svc/FlightPreviousRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            SNo: $("#DFSNo").val(),
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var Result = JSON.parse(result).Table0;
            var Columns = "";
            var Rows = "";
            $('#FlightDetails').html('');
            if (Result.length > 0) {

                for (var i = 0; i < Result.length; i++) {
                    var columnsIn = Result[0];// Coulms Name geting from First Row
                    Rows += '<tr>'
                    var SNo = 0;
                    for (var key in columnsIn) { // Printing Columns
                        if (i == 0 && key != 'SNo')
                            Columns += "<td class='ui-widget-header'> " + key + " </td>";
                        Rows += "<td class='ui-widget-content'> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                    }
                    Rows += '</tr>'
                }

                $('#FlightDetails').append('<table id="tblFlightDetails" class="appendGrid ui-widget" style="margin-bottom:10px;"><thead class="ui-widget-header" style="text-align:center" id="theadid_F"></thead> <tbody id="tbodyid_F" class="ui-widget-content"></tbody></table>');

                $('#theadid_F').append('<tr>' + Columns + '</tr>');

                $('#tbodyid_F').append(Rows);
            }
            openDialogBox('FlightDetails');
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function BindFlightSIRemarks() {
    $.ajax({
        url: "Services/Schedule/ViewEditFlightService.svc/spGetFlightSIRemarks",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            SNo: $("#DFSNo").val(),
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var Result = JSON.parse(result).Table0;
            var Columns = "";
            var Rows = "";
            $('#FlightSIRemarks').html('');
            if (Result.length > 0) {

                for (var i = 0; i < Result.length; i++) {
                    var columnsIn = Result[0];// Coulms Name geting from First Row
                    Rows += '<tr>'
                    var SNo = 0;
                    for (var key in columnsIn) { // Printing Columns
                        if (i == 0 && key != 'SNo')
                            Columns += "<td class='ui-widget-header'> " + key + " </td>";
                        Rows += "<td class='ui-widget-content'> <label  maxlength='100' style='width:100px;'>" + Result[i][key] + "</label></td>";
                    }
                    Rows += '</tr>'
                }

                $('#FlightSIRemarks').append('<table id="tblFlightSIRemarks" class="appendGrid ui-widget" style="margin-bottom:10px;"><thead class="ui-widget-header" style="text-align:center" id="theadid_FSI"></thead> <tbody id="tbodyid_FSI" class="ui-widget-content"></tbody></table>');

                $('#theadid_FSI').append('<tr>' + Columns + '</tr>');

                $('#tbodyid_FSI').append(Rows);
            }
            openDialogBox('FlightSIRemarks');
        },
        error: function (xhr) {
            var a = "";
        }
    });
}


function openDialogBox(DivID) {
    if ($("#" + DivID).html() == "")
        $("#" + DivID).append('<div style="color:red; width: 100%; text-align:center;">No Record found!!<div>');

    $("#" + DivID).show();

    $("#" + DivID).dialog(
   {
       autoResize: true,
       maxWidth: 800,
       maxHeight: 400,
       style: 'font-size:20px;',
       width: 800,
       height: 400,
       modal: true,
       dialogClass: 'no-close success-dialog',
       title: DivID == 'FlightSIRemarks' ? 'Flight SI Details' : 'Previous Aircrafts',
       draggable: true,
       resizable: false,
       buttons: {
           "OK": function () {
               $(this).dialog("close");
           },
       },
       close: function () {
           $(this).dialog("close");
       }
   });
}

function AllotmentTypeChange(ID) {
    var RNO = $(ID).attr('id').split('_')[2];
    if ($('#' + ID.id).val() != 'OPEN') {
        $('#tblDailyFlightAllotment_OfficeSNo_' + RNO).data("kendoAutoComplete").enable(true);
        $('#tblDailyFlightAllotment_AccountSNo_' + RNO).data("kendoAutoComplete").enable(true);
    }
    else {
        $('#tblDailyFlightAllotment_OfficeSNo_' + RNO).val('');
        $('#tblDailyFlightAllotment_HdnOfficeSNo_' + RNO).val('');
        $('#tblDailyFlightAllotment_AccountSNo_' + RNO).val('');
        $('#tblDailyFlightAllotment_HdnAccountSNo_' + RNO).val('');
        $('#tblDailyFlightAllotment_OfficeSNo_' + RNO).data("kendoAutoComplete").enable(false);
        $('#tblDailyFlightAllotment_AccountSNo_' + RNO).data("kendoAutoComplete").enable(false);
    }
}

function GrossVolumeVarienceBlur(ID) {
    var RNO = ID.id.split('_')[2];
    if ($('#' + ID.id).val() == "") {
        $('#' + ID.id).val(0.00);
        $('#_temp' + ID.id).val(0.00);
    }
    //else if($('#' + ID.id).val() >= $('#' + ID.id).val())
    //{
    //    $('#' + ID.id).val(0.00);
    //    $('#_temp' + ID.id).val(0.00);
    //    ShowMessage('warning','','');
    //}
}

function ReleaseTimeBlur(ID) {
    var RNO = ID.id.split('_')[2];
    if ($('#' + ID.id).val() == "") {
        $('#' + ID.id).val(0.00);
        $('#_temp' + ID.id).val(0.00);
    }
}
function CalculateAllotment() {
    TotalAllotmentGross = 0.00;
    TotalAllotmentVol = 0.00;
    TotalReleasedGross = 0.00;
    TotalReleasedVol = 0.00;
    MinReserveGross = 0.00;
    MinReserveVol = 0.00;
    $("#tblDailyFlightAllotment tr[id^='tblDailyFlightAllotment_Row']").each(function () {
        TotalAllotmentGross = TotalAllotmentGross + parseFloat($(this).find("[id^='tblDailyFlightAllotment_GrossWeight_']").val());
        TotalAllotmentVol = TotalAllotmentVol + parseFloat($(this).find("[id^='tblDailyFlightAllotment_Volume_']").val());
        TotalReleasedGross = TotalReleasedGross + parseFloat($(this).find("[id^='tblDailyFlightAllotment_ReleaseGross_']").val());
        TotalReleasedVol = TotalReleasedVol + parseFloat($(this).find("[id^='tblDailyFlightAllotment_ReleaseVolume_']").val());
        if ($(this).find("[id^='tblDailyFlightAllotment_IsUsed']").val() == 1) {
            MinReserveGross = MinReserveGross + parseFloat($(this).find("[id^='tblDailyFlightAllotment_GrossWeight_']").val());
            MinReserveVol = MinReserveVol + parseFloat($(this).find("[id^='tblDailyFlightAllotment_Volume_']").val());
        }
    });
}


function validateGridData() {

    $("#tblDailyFlightAllotment tr[id^='tblDailyFlightAllotment_Row']").each(function () {
        var RNo = this.id.split('_')[2];
        var RSeq = $(this).find('td:first').text();

        if (parseFloat($(this).find("[id^='tblDailyFlightAllotment_GrossWeight_']").val()).toFixed(2) <= 0.00) {
            ShowMessage('warning', 'Warning - Allotment', "Row No " + RSeq + " Allotment Gross Weight should be greater than 0.01");
            isValidAllotment = false;
        }
        else if (parseFloat($(this).find("[id^='tblDailyFlightAllotment_Volume_']").val()).toFixed(3) <= 0.000) {
            ShowMessage('warning', 'Warning - Allotment', "Row No " + RSeq + " Allotment Gross Weight should be greater than 0.001");
            isValidAllotment = false;
        }
        else if (parseInt($(this).find("[id^='tblDailyFlightAllotment_ReleaseTimeHr_']").val()) * 60 + parseInt($(this).find("[id^='tblDailyFlightAllotment_ReleaseTimeMin_']").val()) <= 0) {
            ShowMessage('warning', 'Warning - Allotment', "Row No " + RSeq + " Allotment Release Time should be greater than 0");
            isValidAllotment = false;
        }

        else if ($(this).find("[id^='tblDailyFlightAllotment_AllotmentTypeSNo_']").val() != "OPEN" && $(this).find("[id^='tblDailyFlightAllotment_AllotmentTypeSNo_']").val() != "" && ($(this).find("[id^='tblDailyFlightAllotment_HdnOfficeSNo_']").val() == "" && $(this).find("[id^='tblDailyFlightAllotment_HdnAccountSNo_']").val() == "")) {
            ShowMessage('warning', 'Warning - Allotment', "Row No " + RSeq + " Office Name or Forwarder (Agent) is required.", "bottom-right");
            isValidAllotment = false;
        }

        else if ($(this).find("[id^='tblDailyFlightAllotment_AllotmentTypeSNo_']").val() == "OPEN" && ($(this).find("[id^='tblDailyFlightAllotment_HdnSHC_']").val() == "" && $(this).find("[id^='tblDailyFlightAllotment_HdnCommodity_']").val() == "" && $(this).find("[id^='tblDailyFlightAllotment_HdnProduct_']").val() == "")) {
            ShowMessage('warning', 'Warning - Allotment', "Row No " + RSeq + " Either Commodity,SHC or Product is required.", "bottom-right");
            isValidAllotment = false;
        }

        else if ($(this).find("[id^='tblDailyFlightAllotment_HdnCommodity_']").val() != "" && $(this).find("[id^='tblDailyFlightAllotment_HdnSHC_']").val() != "") {
            ShowMessage('warning', 'Warning - Allotment', "Row No " + RSeq + " Either Commodity or SHC is allowed to fill.", "bottom-right");
            $('#divMultitblDailyFlightAllotment_Commodity_' + RNo).find('span[id]').click();
            $('#divMultitblDailyFlightAllotment_SHC_' + RNo).find('span[id]').click();
            isValidAllotment = false;
        }
        else {
            isValidAllotment = true;
        }
    });
}


function DeleteRecord(DailyFlightSNo)
{
    return true;
}
