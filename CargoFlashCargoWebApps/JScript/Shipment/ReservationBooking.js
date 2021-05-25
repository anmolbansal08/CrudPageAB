/*
*****************************************************************************
Javascript Name:	ReservationBookingJS     
Purpose:		    This JS used to get autocomplete for Reservation.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    03 Jan 2017
Updated By:    
Updated On:	
Approved By:    
Approved On:	

******************************************************************************
*/
var Viewflag = 1;
var NoofReplanNo = 0;
var NoOfREExecutedNo = 0;
var AccountNoofReplanNo
var TPieces = 0;
var TotalPremAmount = 0;
var IsApproveCancelShipment = '';
var ExecutionCompleteforLion = 0;
var HideActionButtonforLion = 0;
var BookingTypeIndexNo = "";
var IsAsAgreedAgent = 0;
var OverRideAsAgreed = 0;
var DimensionMandatoryOrNotInEcecutionAtCity = 1;
var IsCCAllowedAirline = "";
var PrefixAirlineName = "";
var ReplanCompleteIndexNo = 0;
var AWBStatusNo = 0;
var BookingRefNo = 0;
var currentprocess = "";
var currentawbsno = 0;
var currentawbno = "";
var currentPrefix = "";
var DimSaved = false;
var AWBReferenceBookingPrimarySNo = 0;
var BookingPrimaryRefNo = "";
var BookingOrigin = "";
var BookingDestination = "";
var AWBStatusDetails = "";
var DGRSPHC = [];
var tblhtml, tblNogHtml;
var AWBFillCarrierCode = "";
var array = [];
var sno = [];
var org = "";
var ArrSelectedDateValue = "";
var ArrSelectedDate = "";
var ArrETATime = "";
var etd, date;
var AWBSPieces = 0;
var AWBSGrossWeight = 0;
var AWBSVolume = 0;
var AWBStock = "";
var SplitLoaded = "";
var IsSplitShipmentAllowed = false;
var resulawbprinttreturn = "0";
var FlightDate = "";
var ETDTime = "";
var IsChargeableWt = 0;
var MinimumChWt = 0;
var status = "";
var IsRouteComplete = 0;
var IsViewRateTab = 0;
var topUpAgentLogin = 0;
var NoOfREExecuted = 0;
var ACReplanCount = 0; 
$(function () {

    $(document).keydown(function (e) {
        var id = $(e.target).attr("id");

        if (e.keyCode == 13) {
            if (id == "tblDimensionTab_btnUpdateAll" || id == "tblDimensionTab_btnUpdateText" || id == "ItineraryViewRoute" || id == "ItinerarySearch" || id == "btnClearItineraryRoute" || $(e.target).attr("class") == "k-textbox") return;
            if (id == "AddDimension") {
                $("#AddDimension").trigger("click");
            }
            e.preventDefault();
        }
        if (id == "searchAWBNo") {
            //Changed by Braj on behalf of Gulashan for Copy Past AWB No
            setTimeout(function () { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }, 10);
            //$('input[type="text"][id="' + id + '"]').keypress(function (event) {
            // e.target.value = $(this).val().replace(/[^0-9]/g, '');

            //var $this = $(this);
            //if ((e.keyCode != 46 || $this.val().indexOf('.') != -1) &&
            //	((e.keyCode < 48 || e.keyCode > 57) &&
            //		(e.keyCode != 0 && e.keyCode != 8))) {
            //	e.preventDefault();
            //}

            //var text = $(this).val();
            //if ((e.keyCode == 46) && (text.indexOf('.') == -1)) {
            //	setTimeout(function () {
            //		if ($this.val().substring($this.val().indexOf('.')).length > 3) {
            //			$this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
            //		}
            //	}, 1);
            //}

            //if ((text.indexOf('.') != -1) &&
            //	(text.substring(text.indexOf('.')).length > 2) &&
            //	(e.keyCode != 0 && e.keyCode != 8) &&
            //	($(this)[0].selectionStart >= text.length - 2)) {
            //	e.preventDefault();
            //}
            //});
        }
    });





    $(document).on("keypress", "input[id^='tblCustomsOCIInformationTab_SCSControlInfoIdentifire']", function (e) {

        setTimeout(function () { e.target.value = e.target.value.replace(/[^-.a-zA-Z0-9]/g, ''); }, 10);
    });



    ReservationBooking();
    PagerightsCheckReservation(0);
});

function BindInsuranceCategory(id) {
    //alert('dd');
    var rowNo = id.attr('id').split('_')[2];
    if ($('#tblInsurance_HdnCommoditySNo_' + rowNo).val() != "") {

        var ComSNo = $('#tblInsurance_HdnCommoditySNo_' + rowNo).val()

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/BindInsuranceCategory",
            async: false,
            type: "GET",
            dataType: "json",
            data: { CommoditySNo: ComSNo },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].InsuranceCategory == 'Premium') {
                            $('#tblInsurance_Declvalueforcarraige_' + rowNo).val('');
                            $('#_temptblInsurance_Declvalueforcarraige_' + rowNo).val('');
                            $('#tblInsurance_Declvalueforcarraige_' + rowNo).attr("disabled", "disabled");
                            $('#_temptblInsurance_Declvalueforcarraige_' + rowNo).attr("disabled", "disabled");
                            $('#tblInsurance_PremiumRate_' + rowNo).val(myData.Table0[0].InsuranceValue);
                            $('#_temptblInsurance_PremiumRate_' + rowNo).val(myData.Table0[0].InsuranceValue);
                            $('#tblInsurance_PremiumRate_' + rowNo).attr("disabled", "disabled");
                            $('#_temptblInsurance_PremiumRate_' + rowNo).attr("disabled", "disabled");
                            $('#tblInsurance_Category_' + rowNo).text(myData.Table0[0].InsuranceCategory);
                            $('#_temptblInsurance_Category_' + rowNo).text(myData.Table0[0].InsuranceCategory);
                            if ($('#tblInsurance_Category_' + rowNo).text().toUpperCase() == "GENERAL") {
                                $('#tblInsurance_Declvalueforcarraige_' + rowNo).attr('required', 'required');
                            }
                            else {
                                $('#tblInsurance_Declvalueforcarraige_' + rowNo).removeAttr('required', false);
                            }
                            if (myData.Table0[0].InsuranceValue < 7000) {
                                var Chargevalue = 7000;
                                $('#tblInsurance_PremiumAmount_' + rowNo).val(Chargevalue);
                                $('#_temptblInsurance_PremiumAmount_' + rowNo).val(Chargevalue);
                            }
                            else {
                                $('#tblInsurance_PremiumAmount_' + rowNo).val(myData.Table0[0].InsuranceValue);
                                $('#_temptblInsurance_PremiumAmount_' + rowNo).val(myData.Table0[0].InsuranceValue);
                            }
                        }
                        else {
                            $('#tblInsurance_Declvalueforcarraige_' + rowNo).removeAttr("disabled");
                            $('#_temptblInsurance_Declvalueforcarraige_' + rowNo).removeAttr("disabled");

                            $('#tblInsurance_Category_' + rowNo).text(myData.Table0[0].InsuranceCategory);
                            $('#tblInsurance_PremiumRate_' + rowNo).val(myData.Table0[0].InsuranceValue);
                            $('#_temptblInsurance_Category_' + rowNo).text(myData.Table0[0].InsuranceCategory);
                            $('#_temptblInsurance_PremiumRate_' + rowNo).val(myData.Table0[0].InsuranceValue);
                            $('#tblInsurance_PremiumRate_' + rowNo).attr("disabled", "disabled"); //added by preeti 
                            $('#_temptblInsurance_PremiumRate_' + rowNo).attr("disabled", "disabled"); //added by preeti 
                            $('#tblInsurance_PremiumAmount_' + rowNo).val('');
                            $('#_temptblInsurance_PremiumAmount_' + rowNo).val('');
                            if ($('#tblInsurance_Category_' + rowNo).text().toUpperCase() == "GENERAL") {
                                $('#tblInsurance_Declvalueforcarraige_' + rowNo).attr('required', 'required');
                            }
                            else {
                                $('#tblInsurance_Declvalueforcarraige_' + rowNo).removeAttr('required', false);
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function SetPaymentType() {

    var bookingType = $('input:radio[name=BookingType]:checked').val();
    if (bookingType == "2") {
        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
        $("#Text_ChargeCode").data("kendoAutoComplete").enable(false);
    }
    else {

        $("#Text_ChargeCode").data("kendoAutoComplete").enable(true);

    }
}


function InsuranceTab() {
    $("#InsuranceCertificate").val('1');
    $("#InsuranceCertificate").attr("disabled", "disabled");
    TotalPremAmount = 0;
    var dbTableName = 'Insurance';
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 5,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBReferenceBookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val(), ctrlCss: { width: '40px' } },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'NoofCertificate', type: 'hidden' },
            { name: 'Pieces', display: 'Pieces', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedInsurancePieces(this.id);" }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'Weight', display: 'Weight', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2', onblur: "return CalculateInsuranceWeight(this.id);" }, ctrlCss: { width: '60px' }, isRequired: true },
            { name: 'NOG', display: 'NOG', type: 'text', value: '', ctrlAttr: { maxlength: 500 }, ctrlCss: { width: '100px' } },
            { name: 'CommoditySNo', display: 'Commodity', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return BindInsuranceCategory(this.id);" }, isRequired: true, AutoCompleteName: 'Commodity_MarineInsurance', filterField: "CommodityCode,CommodityDescription", filterCriteria: "contains" },
            { name: 'Category', display: 'Category', type: 'label', ctrlAttr: {} },
            { name: 'Declvalueforcarraige', display: 'DC Value', type: 'text', value: '', ctrlAttr: { maxlength: 10, onblur: 'CalculatePremiumAmount(this.id);', controltype: 'number' }, ctrlCss: { width: '90px' } },
            { name: 'HAWBNo', display: 'HAWB No.', type: 'text', value: '', ctrlCss: { width: '90px' } },
            { name: 'PremiumRate', display: 'Premium Rate.', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number' }, ctrlCss: { width: '90px' } },
            { name: 'PremiumAmount', display: 'Premium Amount.', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number' }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'HdnInsuranceType', type: 'hidden', value: $('input:radio[name=InsuranceType]:checked').val() },
            { name: 'CountOfCertificate', type: 'hidden', isRequired: true }
        ],
        customFooterButtons: [
            { uiButton: { label: 'Update All', text: true }, btnAttr: { title: 'Update All' }, click: function (evt) { SaveMarineData(this) }, atTheFront: true },],
        beforeRowRemove: function (caller, rowIndex) {
            TPieces = 0;
            $("tr[id^='tblInsurance_Row']").each(function (row, tr) {
                TPieces = (parseInt(TPieces || 0) + parseInt($(tr).find("input[id^='tblInsurance_Pieces_']").val() || 0));
                checkMarinPiece();
            });
        },
        OnUpdateSuccess: function () {
            {
                $("tr[id^='tblInsurance_Row']").each(function (row, tr) {

                    $(tr).find("input[id^='tblInsurance_Pieces_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_Weight_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_NOG_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_CommoditySNo_']").data("kendoAutoComplete").enable(false);
                    $(tr).find("select[id^='tblInsurance_Category_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_Declvalueforcarraige_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_HAWBNo_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_PremiumRate_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_PremiumAmount_']").attr("disabled", true);
                    $(tr).find("input[id^='tblInsurance_PremiumAmount_']").attr("disabled", true);
                });
            }
        },
        afterRowRemoved: function (caller, rowIndex) {
            ShowTotalPreAmount();
            $('[id^="tblInsurance_HdnInsuranceType_"]').val($("#InsuranceType:checked").val());
            TPieces = 0;

            $("tr[id^='tblInsurance_Row']").each(function (row, tr) {
                TPieces = (parseInt(TPieces || 0) + parseInt($(tr).find("input[id^='tblInsurance_Pieces_']").val() || 0));
                checkMarinPiece();
            });
            if ($("tr[id^='tblInsurance_Row']").length == "0") {
                $('#tblInsurance_btnAppendRow').show();
            }

        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            if ($("tr[id^='tblInsurance_Row']").length == "0") {
                if ($("#InsuranceCertificate").val() == "") {
                    $('[id^=tblInsurance_CountOfCertificate_]').attr('required', 'required')
                    alert('add value of certificate');
                    $('#InsuranceCertificate').focus();
                }
            }
            else {
                $('[id^=tblInsurance_CountOfCertificate_]').removeAttr('required');
                // alert('add value of certificate')
            }
            ShowTotalPreAmount();
            $('[id^="tblInsurance_HdnInsuranceType_"]').val($("#InsuranceType:checked").val());
            TPieces = 0;
            $("tr[id^='tblInsurance_Row']").each(function (row, tr) {
                TPieces = (parseInt(TPieces || 0) + parseInt($(tr).find("input[id^='tblInsurance_Pieces_']").val() || 0));
                checkMarinPiece();
            });

            $('[id^="tblInsurance_CountOfCertificate_"]').val($('#InsuranceCertificate').val());
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            ShowTotalPreAmount();

            var check = $('[id^="tblInsurance_NoofCertificate_"]').val();
            var newVal = $('#hdnInsuranceType').val(check)
            if (check == "1")
                $("#InsuranceCertificate").removeAttr("disabled");
            if ($("#tblInsurance_CountOfCertificate_1").length > 0)
                $("#InsuranceCertificate").val($("#tblInsurance_CountOfCertificate_1").val())

            $("[id='InsuranceType'][value='" + check + "']").prop('checked', true);
            TPieces = 0;
            $("tr[id^='tblInsurance_Row']").each(function (row, tr) {
                TPieces = (parseInt(TPieces || 0) + parseInt($(tr).find("input[id^='tblInsurance_Pieces_']").val() || 0));
                checkMarinPiece();
            });
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: false },
    });
    TPieces = 0;
    $("tr[id^='tblInsurance_Row']").each(function (row, tr) {
        $(tr).find("input[id^='tblInsurance_Pieces_']").attr("disabled", true);
        $(tr).find("input[id^='tblInsurance_Weight_']").attr("disabled", true);
        $(tr).find("input[id^='tblInsurance_NOG_']").attr("disabled", true);
        $(tr).find("input[id^='tblInsurance_CommoditySNo_']").data("kendoAutoComplete").enable(false);
        $(tr).find("select[id^='tblInsurance_Category_']").attr("disabled", true);
        $(tr).find("input[id^='tblInsurance_Declvalueforcarraige_']").attr("disabled", true);
        $(tr).find("input[id^='tblInsurance_HAWBNo_']").attr("disabled", true);
        $(tr).find("input[id^='tblInsurance_PremiumRate_']").attr("disabled", true);
        $(tr).find("input[id^='tblInsurance_PremiumAmount_']").attr("disabled", true);

        TPieces = (parseInt(TPieces || 0) + parseInt($(tr).find("input[id^='tblInsurance_Pieces_']").val() || 0));
        checkMarinPiece();
    });

    ShowTotalPreAmount();
    $('[id^="tblInsurance_HdnInsuranceType_"]').val($("#InsuranceType:checked").val());
    $("#InsuranceCertificate").keyup(function () {
        var value = $(this).val()
        $('[type="hidden"][id^="tblInsurance_CountOfCertificate_"]').val(value);
        $("#tblInsurance_btnUpdateAll").attr('disabled', false)
    });
}


function SaveMarineData(obj) {
    if ($('#InsuranceCertificate').val() == "") {
        ShowMessage('warning', 'warning', 'Kindly Enter No Of Certificate.');
        $('#InsuranceCertificate').focus();
        return false;
    }
    var rows = $("tr[id^='tblInsurance']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblInsurance");
    var ValidData = $('#tblInsurance').appendGrid('getStringJson');
    if (ValidData != "[]" && ValidData != false) {
        $.ajax({
            url: "./Services/Shipment/ReservationBookingService.svc/createUpdateInsurance",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ strData: btoa(ValidData) }),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data == '<value>Marin Insurance Detail Added Successfully.</value>') {
                    ShowMessage('success', 'Success!', 'Marin Insurance Detail Added Successfully.');
                    InsuranceTab();
                }
                else if (data == '<value>Marin Insurance Detail Updated Successfully.</value>') {
                    ShowMessage('success', 'Success!', 'Marin Insurance Detail Updated Successfully.');
                    InsuranceTab();
                }
                else if (data == '<value>Marin Insurance Premium Amount Null.</value>') {
                    ShowMessage('warning', 'Warning!', 'Please Enter DC value.');

                }
                else {
                    ShowMessage('warning', 'warning.', null);
                }
            }
        });
    }

}

function CheckCertificate() {

    $('#InsuranceCertificate').keydown(function (e) {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                e.preventDefault();
            }
        }
    });
    $("#tblInsurance_btnUpdateAll").attr('disabled', false);
    var CheckInsuranceType = $('input[name=InsuranceType]:checked').val();
    var Nofcertificate = $("#InsuranceCertificate").val();
    if (CheckInsuranceType == "0" && Nofcertificate > 1) {
        ShowMessage('warning', 'Information!', "Kindly Enter Valid No Of Certificate");
        $("#InsuranceCertificate").val('1');
        return;
    }
}
function checkMarinPiece() {
    if (TPieces == parseInt($('#lbliece').text())) {
        $('#tblInsurance_btnAppendRow').hide();
    }
    else {
        $('#tblInsurance_btnAppendRow').show();
    }
}
function ShowTotalPreAmount() {
    $("#TotalPreAmount").remove();
    //----------------
    var amount = 0;
    if ($("#tblInsurance tbody tr[class !='empty'] ").length > 0) {
        $("#tblInsurance tbody tr").each(function () {
            var rowNo = $(this).attr('id').split('_')[2]
            amount = parseFloat(amount) + parseFloat($('#tblInsurance_PremiumAmount_' + rowNo).val() == "" ? 0 : $('#tblInsurance_PremiumAmount_' + rowNo).val());
        })
    }
    TotalPreAmount = amount
    //-------------------------------------------
    $("#tblInsurance").after('<span id = "TotalPreAmount" style="float: right;margin-top: -19px;font-size: initial;color: blue;">Total Premium Value (IN) : IDR ' + parseFloat(TotalPreAmount || 0) + '</span>')
    if (parseFloat(TotalPreAmount) == parseFloat(0)) {
        $("#TotalPreAmount").remove();
    }
}
function SetInsuranceType() {
    var CheckInsuranceType = $('input[name=InsuranceType]:checked').val();
    if (CheckInsuranceType == "1") {
        $("#InsuranceCertificate").css("display", "");
        $("#InsuranceCertificate").removeAttr("disabled");
    }
    else {
        $("#InsuranceCertificate").val('1');
        $("#InsuranceCertificate").attr("disabled", "disabled");
    }
    if ($("#tblInsurance tbody tr[class !='empty'] ").length > 0) {
        $("#tblInsurance tbody tr").each(function () {
            var rowNo = $(this).attr('id').split('_')[2]
            $('#tblInsurance_HdnInsuranceType_' + rowNo).val($('input[name=InsuranceType]:checked').val());
        });
    }
    $('[type="hidden"][id^="tblInsurance_CountOfCertificate_"]').val($("#InsuranceCertificate").val());
}
function IschkInsuranceYesNo() {
    if ($('#chkInsurance').prop('checked')) {
        $("#liInsurance").css("display", "");
        $("#lbliece").text(parseInt($("#AWBPieces").val() || "0"));
        $("#lblweight").text(parseFloat($("#AWBGrossWeight").val() || "0"));
    }
    else {

        $("#liInsurance").css("display", "none");
    }
}
function DownloadExcel() {
    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val().trim();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val().trim();
    var FlightNo = $("#searchFlightNo").val() == "" ? "0" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    var ReferenceNo = $("#searchReferenceNo").val() == "" ? "0" : $("#searchReferenceNo").val().trim();
    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "0" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CityCode;
    var OriginAirport = $("#searchOriginAirport").val() == "" ? "0" : $("#searchOriginAirport").val().trim();
    var DestinationAirport = $("#searchDestinationAirport").val() == "" ? "0" : $("#searchDestinationAirport").val().trim();
    var AWBStatusSearch = $("#searchAWBStatus").val() == "" ? "0" : $("#searchAWBStatus").val().trim();
    var DownloadExcelData = {
        OriginCity: OriginCity.trim(),
        DestinationCity: DestinationCity.trim(),
        FlightNo: FlightNo.trim(),
        FlightDate: FlightDate.trim(),
        AWBPrefix: AWBPrefix.trim(),
        AWBNo: AWBNo.trim(),
        LoggedInCity: LoggedInCity.trim(),
        ReferenceNo: ReferenceNo.trim(),
        OriginAirport: OriginAirport.trim(),
        DestinationAirport: DestinationAirport.trim(),
        AWBStatusSearch: AWBStatusSearch.trim(),
    }
    //if (FlightNo != "0") {
    if (FlightDate != "0") {
        window.location.href = "./Master/DownloadExcel?OriginCity=" + OriginCity + "&DestinationCity=" + DestinationCity + "&FlightNo=" + FlightNo + "&FlightDate=" + FlightDate + "&AWBPrefix=" + AWBPrefix + "&AWBNo=" + AWBNo + "&LoggedInCity=" + LoggedInCity + "&ReferenceNo=" + ReferenceNo + "&OriginAirport=" + OriginAirport + "&DestinationAirport=" + DestinationAirport + "&AWBStatusSearch=" + AWBStatusSearch;
        //$.ajax({
        //    type: "POST",
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    url: "./Services/Shipment/ReservationBookingService.svc/DownloadData",
        //    data: JSON.stringify(DownloadExcelData),
        //    success: function (response) {
        //        if (response.length > 0) {
        //            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        //                var str = "<html><table border=\"1px\">";
        //                str += "<tr ><td>Booking Ref No</td><td>Prefix</td><td>AWB No</td><td>Booking Type</td><td>Org</td> <td>Dest</td><td>Org Airport</td><td>Dest Airport</td><td>Booking Date</td><td>Agent Name</td><td>Pcs</td><td>Gr. Wt.</td><td>Volume</td><td>AWB Status</td><td>Type</td><td>CCA</td> <td>Flight No</td><td>Flight Date</td><td>Split Plan</td><td>Shipment Status</td><td>ACT</td> </tr>"

        //                for (var i = 0; i < response.length; i++) {
        //                    str += "<tr><td>'" + response[i].BookingRefNo + "'</td><td>" + response[i].AWBPrefix + "</td><td>'" + response[i].AWBNo
        //+ "'</td><td>" + response[i].BookingType + "</td><td>" + response[i].Origin
        //+ "</td><td>" + response[i].Destination + "</td><td>" + response[i].OrgAirportCode
        //+ "</td><td>" + response[i].DesAirportCode + "</td><td>'" + response[i].BookingDateString
        //+ "'</td><td>" + response[i].AgentName + "</td><td>" + response[i].AWBPieces
        //+ "</td><td>" + response[i].GrossWeight + "</td><td>" + response[i].Volume + "</td><td>" + response[i].AWBStatus
        //+ "</td><td>" + response[i].InternationalORDomestic + "</td><td>" + response[i].IsCCA
        //+ "</td><td>" + response[i].FlightNo + "</td><td>'" + response[i].FlightDateString
        //+ "'</td><td>" + response[i].SplitLoaded + "</td><td>" + response[i].ShipmentStatus
        //+ "</td><td>" + response[i].AcceptanceCutOffTime
        //+ "</td></tr>"
        //                }
        //                str += "</table></html>";
        //            }
        //            else {
        //                var str = "<html><table border=\"1px\">";
        //                str += "<tr ><td>Booking Ref No</td><td>Prefix</td><td>AWB No</td><td>Booking Type</td><td>Org</td> <td>Dest</td><td>Booking Date</td><td>Agent Name</td><td>Pcs</td><td>Gr. Wt.</td><td>Volume</td><td>AWB Status</td><td>Type</td><td>CCA</td> <td>Flight No</td><td>Flight Date</td><td>Split Plan</td><td>Shipment Status</td> </tr>"

        //                for (var i = 0; i < response.length; i++) {
        //                    str += "<tr><td>'" + response[i].BookingRefNo + "'</td><td>" + response[i].AWBPrefix + "</td><td>'" + response[i].AWBNo
        //+ "'</td><td>" + response[i].BookingType + "</td><td>" + response[i].Origin
        //+ "</td><td>" + response[i].Destination + "</td><td>'" + response[i].BookingDateString
        //+ "'</td><td>" + response[i].AgentName + "</td><td>" + response[i].AWBPieces
        //+ "</td><td>" + response[i].GrossWeight + "</td><td>" + response[i].Volume + "</td><td>" + response[i].AWBStatus
        //+ "</td><td>" + response[i].InternationalORDomestic + "</td><td>" + response[i].IsCCA
        //+ "</td><td>" + response[i].FlightNo + "</td><td>'" + response[i].FlightDateString
        //+ "'</td><td>" + response[i].SplitLoaded + "</td><td>" + response[i].ShipmentStatus
        //+ "</td></tr>"
        //                }
        //                str += "</table></html>";
        //            }

        //            var a = document.createElement('a');
        //            var data_type = 'data:application/vnd.ms-excel';
        //            var table_div = str;
        //            var table_html = table_div.replace(/ /g, '%20');
        //            a.href = data_type + ', ' + table_html;
        //            a.download = 'ReservationBooking.xls';
        //            a.click();
        //            return false
        //        }
        //        else {
        //            ShowMessage("info", "", "No Data Found...");
        //        }
        //    }
        //});
    }
    else {
        ShowMessage('warning', 'Information!', "Select Flight Date.");
        return;
    }
    //}
    //else {
    //	ShowMessage('warning', 'Information!', "Select Flight No.");
    //	return;
    //}
}
function ReservationBooking() {

    _CURR_PRO_ = "RESERVATIONBOOKING";
    _CURR_OP_ = "Master Reservation";
    $("#divShipmentDetails").html("");
    CleanUI();
    var ReservationGetWebForm = {
        processName: _CURR_PRO_,
        moduleName: 'Shipment',
        appName: 'ReservationBookingSearch',
        Action: 'Search',
        IsSubModule: '1'
    }
    $.ajax({

        url: "Services/Shipment/ReservationBookingService.svc/GetWebForm",
        async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: ReservationGetWebForm }),
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            var ShipmentStatus = [{ Key: "4", Text: "Booked" }, { Key: "5", Text: "Executed" }, { Key: "6", Text: "Accepted" }
                ,
            { Key: "7", Text: "Loading Instruction" }, { Key: "8", Text: "Manifested" }, { Key: "9", Text: "Departed" },
            { Key: "10", Text: "Arrived" }, { Key: "11", Text: "Delivered" }, { Key: "12", Text: "Void" },
            { Key: "13", Text: "Expire" }, { Key: "14", Text: "Blacklisted" }, { Key: "15", Text: "No Show" }, { Key: "16", Text: "Cancel" }
            ];
            cfi.AutoCompleteV2("searchOriginCity", "CityCode,CityName", "Reservation_Origin", null, "contains");
            cfi.AutoCompleteV2("searchDestinationCity", "CityCode,CityName", "Reservation_Origin", null, "contains");
            cfi.AutoCompleteV2("searchOriginAirport", "AirportCode,AirportName", "GatePass_AirportNameGatePass", null, "contains");
            cfi.AutoCompleteV2("searchDestinationAirport", "AirportCode,AirportName", "GatePass_AirportNameGatePass", null, "contains");

            cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "Reservation_searchFlightNo", null, "contains");
            cfi.AutoCompleteV2("searchAWBPrefix", "AWBPrefix", "Reservation_searchAWBPrefix", null, "contains");
            //cfi.AutoCompleteV2("searchAWBNo", "AWBNumber", "Reservation_searchAWBNo", null, "contains");
            cfi.AutoCompleteV2("searchReferenceNo", "ReferenceNumber", "Reservation_searchReferenceNo", null, "contains");

            cfi.AutoCompleteByDataSource("searchAWBStatus", ShipmentStatus);
            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                $('#Text_searchOriginCity').closest('td').hide();
                $('#Text_searchDestinationCity').closest('td').hide();
                $('#Text_searchReferenceNo').closest('td').hide();
                $('#Text_searchOriginAirport').closest('td').show();
                $('#Text_searchDestinationAirport').closest('td').show();
                $('#Text_searchAWBStatus').closest('td').show();
            }
            else {
                $('#Text_searchOriginCity').closest('td').show();
                $('#Text_searchDestinationCity').closest('td').show();
                $('#Text_searchReferenceNo').closest('td').show();
                $('#Text_searchOriginAirport').closest('td').hide();
                $('#Text_searchDestinationAirport').closest('td').hide();
                $('#Text_searchAWBStatus').closest('td').hide();
            }

            $("button[id='btnSearch']").after("<input type='button' class='btn btn-success' style='width:100px;' onclick='DownloadExcel();' value='Download Excel' name='DownloadExcel' id='DownloadExcel' />");
            $('#searchFlightDate').data("kendoDatePicker").value("");
            //$("#searchFlightDate").attr('readOnly', 'readOnly');
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            if (userContext.SysSetting.ClientEnvironment == 'TH') {
                $("#DownloadExcel").css("display", "none");

                //$("#ahref_HSCode").css("display", "none");
            }
            else
                $("#DownloadExcel").css("display", "inherit");
            $("#btnSearch").bind("click", function () {
                cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
                CleanUI();
                ShipmentSearch();
                currentawbsno = 0;
                currentawbno = "";
                HideTooltipSpanStyleInfo();

            });
            $("#DownloadExcel").bind("click", function () {
                DownloadExcel();
            });
            CleanUI();
            if (userContext.SysSetting.IsEnableReservationBookingGridAuto == 'True') {
                ShipmentSearch();
            }
            //ShipmentSearch();
            $("#btnNew").unbind("click").bind("click", function () {
                if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                    $("#divShipmentDetails").html("");
                    CleanUI();
                }
                AWBStatusDetails = "";
                IsChargeableWt = 0;
                MinimumChWt = 0;
                FormDataBind('NEW', _CURR_PRO_);
            });

            // AuditLogBindOldValue("tblApplySpotCode");
            GetAgentMultiOriginPermission();
            PagerightsCheckReservation(0)
            //var isCreate = false;
            //$(userContext.PageRights).each(function (e, i) {
            //    if (i.Apps == "ReservationBooking" && i.PageRight == "New") {
            //        isCreate = true;
            //    }
            //});

            //if (!isCreate) {
            //    $("#btnNew").hide();
            //    $("#btnCancel").hide();  
            //}




        }
    });
}



var ServiceableProduct = [];
var IsGarudaMilesShownOn = [];
var LoginGroupType = "";
var HSCode = "";
var Text_HSCode = "";
function SaveHSCode() {
    var HSCodeArray = [];
    if ($("#Text_HSCode1").data("kendoAutoComplete").key() != "" && $("#Text_HSCode1").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject1 = {
            HSCodeSNo: $("#Text_HSCode1").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode1").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject1);
    }
    if ($("#Text_HSCode2").data("kendoAutoComplete").key() != "" && $("#Text_HSCode2").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject2 = {
            HSCodeSNo: $("#Text_HSCode2").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode2").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject2);
    }
    if ($("#Text_HSCode3").data("kendoAutoComplete").key() != "" && $("#Text_HSCode3").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject3 = {
            HSCodeSNo: $("#Text_HSCode3").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode3").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject3);
    }
    if ($("#Text_HSCode4").data("kendoAutoComplete").key() != "" && $("#Text_HSCode4").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject4 = {
            HSCodeSNo: $("#Text_HSCode4").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode4").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject4);
    }
    if ($("#Text_HSCode5").data("kendoAutoComplete").key() != "" && $("#Text_HSCode5").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject5 = {
            HSCodeSNo: $("#Text_HSCode5").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode5").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject5);
    }
    if ($("#Text_HSCode6").data("kendoAutoComplete").key() != "" && $("#Text_HSCode6").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject6 = {
            HSCodeSNo: $("#Text_HSCode6").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode6").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject6);
    }
    if ($("#Text_HSCode7").data("kendoAutoComplete").key() != "" && $("#Text_HSCode7").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject7 = {
            HSCodeSNo: $("#Text_HSCode7").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode7").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject7);
    }
    if ($("#Text_HSCode8").data("kendoAutoComplete").key() != "" && $("#Text_HSCode8").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject8 = {
            HSCodeSNo: $("#Text_HSCode8").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode8").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject8);
    }
    if ($("#Text_HSCode9").data("kendoAutoComplete").key() != "" && $("#Text_HSCode9").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject9 = {
            HSCodeSNo: $("#Text_HSCode9").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode9").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject9);
    }
    if ($("#Text_HSCode10").data("kendoAutoComplete").key() != "" && $("#Text_HSCode10").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject10 = {
            HSCodeSNo: $("#Text_HSCode10").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode10").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject10);
    }
    if ($("#Text_HSCode11").data("kendoAutoComplete").key() != "" && $("#Text_HSCode11").data("kendoAutoComplete").key() != undefined) {
        var ServiceableProductobject11 = {
            HSCodeSNo: $("#Text_HSCode11").data("kendoAutoComplete").key(),
            Text_HSCode: $("#Text_HSCode11").data("kendoAutoComplete").value()
        }
        HSCodeArray.push(ServiceableProductobject11);
    }
    HSCode = "";
    Text_HSCode = "";
    for (var i = 0; i < HSCodeArray.length; i++) {
        if (i == 0) {
            HSCode = HSCodeArray[i].HSCodeSNo;
            Text_HSCode = HSCodeArray[i].Text_HSCode;
        }
        else {
            HSCode += "," + HSCodeArray[i].HSCodeSNo;
            Text_HSCode += "," + HSCodeArray[i].Text_HSCode;
        }
    }
    ShowMessage('success', 'Success - HS Code', "Saved Successfully", "bottom-right");
    var window = $("#divHSCodePopUp");
    window.data("kendoWindow").close();
}
function BindHSCode() {
    if (HSCode != "" && Text_HSCode != "") {
        var A = HSCode.split(",");
        var B = Text_HSCode.split(",");
        for (var i = 0; i < A.length; i++) {
            if (i <= 10) {
                $("#Text_HSCode" + (i + 1)).data("kendoAutoComplete").setDefaultValue(A[i], B[i]);
            }
        }
    }
}
function FormDataBind(Action, ProcessNameDetails) {
    HideActionButtonforLion = 0;
    if (Action == "NEW" || Action == "COPY")
        AWBStatusNo = 0;
    $.ajax({
        url: 'HtmlFiles/Shipment/ReservationBooking.html', cache: false,
        success: function (result) {
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#divContent1").remove()
            $('#aspnetForm').append(result);
            $('#aspnetForm').append(NogDiv);
            InstantiateControl("htmldivdetails");
            PageLoaded(Action, ProcessNameDetails);
            //$("#AWBChargeableWeight").attr('readOnly', 'readOnly');
            //$("#_tempAWBChargeableWeight").attr('readOnly', 'readOnly');
            if (userContext.SpecialRights.RESCHARGEABLE != true) {
                $("#AWBChargeableWeight").attr('disabled', true);
                $("#_tempAWBChargeableWeight").attr('disabled', true);
            }
            if (userContext.SysSetting.IsGarudaMilesShownOn != "" && userContext.SysSetting.IsGarudaMilesShownOn != undefined) {
                var GarudaMilesobject = userContext.SysSetting.IsGarudaMilesShownOn.split(',');
                IsGarudaMilesShownOn.push(GarudaMilesobject);
            }
            if (userContext.SysSetting.ServiceableProduct != "" && userContext.SysSetting.ServiceableProduct != undefined) {
                var ServiceableProductobject = userContext.SysSetting.ServiceableProduct.split(',');
                ServiceableProduct.push(ServiceableProductobject);
            }


            //Added for tax id by akhtar
            if (userContext.SysSetting.IsTaxIdShownOn == "0" || userContext.SysSetting.IsTaxIdShownOn == undefined) {
                $("#tdShipperTaxid").hide();
                $("#tdConsigneeTaxid").hide();
                $("#chkShippertaxid").hide();
                $("#chkconsigneetaxid").hide();
            }
            else {
                $("#tdShipperTaxid").show();
                $("#tdConsigneeTaxid").show();
                $("#chkShippertaxid").show();
                $("#chkconsigneetaxid").show();
            }
            LoginGroupType = userContext.GroupName.toUpperCase();
            if ($.inArray(LoginGroupType, IsGarudaMilesShownOn[0]) != '-1') {
                $("#tdGarudaMiles").css("display", "block");
            }
            else
                $("#tdGarudaMiles").css("display", "none");


            if (Action == "UPDATE" || Action == "EXECUTE") {
                $('input[type=radio][name=BookingType]').attr('disabled', true);
                $('input[type=radio][name=AWBStock]').attr('disabled', true);
                $("#Text_AWBCode").data("kendoAutoComplete").enable(false);
                $("#AWBNumber").attr('disabled', true);
                $("#_tempAWBNumber").attr('disabled', true);
                $("#Text_ChargeCode").data("kendoAutoComplete").enable(false);

                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
                    //$("#NoofHouse").attr('disabled', true);
                    //$("#_tempNoofHouse").attr('disabled', true);
                    $("#chkIsBUP").attr('disabled', true);
                }
                if (Action == "EXECUTE" && userContext.SysSetting.ICMSEnvironment == 'JT') {
                    var AgentReExecutedLimitforJT = 0;
                    var TotalNoofReplanandExecuted = 0;
                    TotalNoofReplanandExecuted = parseInt(NoofReplanNo) + parseInt(NoOfREExecutedNo);
                    if (userContext.SysSetting.AgentReExecutedLimitforJT != "" && userContext.SysSetting.AgentReExecutedLimitforJT != undefined)
                        AgentReExecutedLimitforJT = userContext.SysSetting.AgentReExecutedLimitforJT;
                    if (AgentReExecutedLimitforJT > 0) {
                        if (parseInt(TotalNoofReplanandExecuted) == (parseInt(AgentReExecutedLimitforJT) - 1))
                            ShowMessage('warning', 'Information!', "Balance 01 free update/replan of AWB is now remaining.");
                    }
                }
                if (Action == "EXECUTE" && ReplanCompleteIndexNo == 1 && userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo < 6) {
                    if (AWBStatusNo != 15 && AWBStatusNo != 16) {
                        var FinalReplanReservationResult = "0";
                        FinalReplanReservationResult = GetCountNoOfReplan(0, currentawbsno);
                        if (FinalReplanReservationResult == "1") { }
                        else if (FinalReplanReservationResult == "2") {
                            var msg = "This update will be on chargeable basis. Do you wish to continue?";
                            $.alerts.okButton = 'Yes';
                            $.alerts.cancelButton = 'No';
                            var r = jConfirm(msg, "", function (r) {
                                if (r == true) {
                                    HideActionButtonforLion = 0;
                                } else {
                                    HideActionButtonforLion = 1;
                                    $("#btnSave").css("display", "none");
                                    $("#btnUpdate").css("display", "none");
                                    $("#btnExecute").css("display", "none");
                                    $("#AddDimension").css("display", "none");
                                    $("#ItineraryViewRoute").css("display", "none");
                                    $("#ItinerarySearch").css("display", "none");
                                    $("#btnClearItineraryRoute").css("display", "none");
                                    $("#tblItinerary").css("display", "none");
                                    var table = document.getElementById("tblSelectdRouteResult");
                                    if (table != null && table.rows.length > 1) {
                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            $(tr).find("button[id^='Delete_']").css("display", "none");
                                        });
                                    }
                                }
                            });
                            ExecutionCompleteforLion = 0;
                        }
                        else
                            ShowMessage('warning', 'Information!', "Count of Execute/Update AWB already exhausted for shipment.");
                    }

                    //if (ExecutionCompleteforLion == 1) {
                    //    HideActionButtonforLion = 1;
                    //    //$("#btnSave").css("display", "none");
                    //    //$("#btnUpdate").css("display", "none");
                    //    //$("#btnExecute").css("display", "none");
                    //    //$("#AddDimension").css("display", "none");
                    //    //$("#ItineraryViewRoute").css("display", "none");
                    //    //$("#ItinerarySearch").css("display", "none");
                    //    //$("#btnClearItineraryRoute").css("display", "none");
                    //    //$("#tblItinerary").css("display", "none");
                    //    //var table = document.getElementById("tblSelectdRouteResult");
                    //    //if (table != null && table.rows.length > 1) {
                    //    //    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    //    //        $(tr).find("button[id^='Delete_']").css("display", "none");
                    //    //    });
                    //    //}
                    //    //ShowMessage('warning', 'Information!', "This was the last free update of AWB.");
                    //} else {
                    //    var msg = "This update will be on chargeable basis. Do you wish to continue?";
                    //    $.alerts.okButton = 'Yes';
                    //    $.alerts.cancelButton = 'No';
                    //    var r = jConfirm(msg, "", function (r) {
                    //        if (r == true) {
                    //            HideActionButtonforLion = 0;
                    //        } else {
                    //            HideActionButtonforLion = 1;
                    //            $("#btnSave").css("display", "none");
                    //            $("#btnUpdate").css("display", "none");
                    //            $("#btnExecute").css("display", "none");
                    //            $("#AddDimension").css("display", "none");
                    //            $("#ItineraryViewRoute").css("display", "none");
                    //            $("#ItinerarySearch").css("display", "none");
                    //            $("#btnClearItineraryRoute").css("display", "none");
                    //            $("#tblItinerary").css("display", "none");
                    //            var table = document.getElementById("tblSelectdRouteResult");
                    //            if (table != null && table.rows.length > 1) {
                    //                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    //                    $(tr).find("button[id^='Delete_']").css("display", "none");
                    //                });
                    //            }
                    //        }
                    //    });
                    //}
                    //ExecutionCompleteforLion = 0;
                }
            }
            InitializePage("RESERVATIONBOOKING", "ApplicationTabs-1", "", "", Action);
            $("#AddDimension").bind("click", function () {
                if ($("#chkIsBUP").prop('checked') == true) {
                    if (kendo.parseFloat($("#AWBNoofBUP").val()) > 0 || kendo.parseFloat($("#AWBNoofBUPIntact").val()) > 0) {
                        DimensionTab("AddDimension");
                    }
                    else {
                        ShowMessage('warning', 'Information!', "Enter No of BUP to add Dimension.");
                        return;
                    }
                }
                else
                    DimensionTab("AddDimension");
            });
            $('input[name=AWBStock]').click(function () {
                if ($(this).val() === '0') {
                    $('#AWBNumber').removeAttr("disabled");
                    $('#_tempAWBNumber').removeAttr("disabled");
                    ManualStockAgentOrNot();
                } else if ($(this).val() === '1') {
                    $('#AWBNumber').val('');
                    $('#_tempAWBNumber').val('');
                    $('#AWBNumber').attr('disabled', true);
                    AutoStockAgentOrNot();
                }
            });
            $('input[name=BookingType]').click(function () {
                if (userContext.AgentSNo > 0) {
                    $("#AWBNumber").val('');
                    $("#_tempAWBNumber").val('');
                    $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                    $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                    //$("#Text_AWBOrigin").data("kendoAutoComplete").enable(false) 
                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(false)
                    //tarun
                }
                else {
                    $("#AWBNumber").val('');
                    $("#_tempAWBNumber").val('');
                    if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                        if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
                            $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                        }
                        else {
                            cfi.ResetAutoComplete("AWBAgent");
                            $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                        }
                    }
                    else {
                        cfi.ResetAutoComplete("AWBAgent");
                        $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                    }
                    //cfi.ResetAutoComplete("AWBAgent");
                    //$("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                }
                //GETProductASPerBookingType($(this).val(), userContext.GroupName);
            });

            $("#ApplicationTabs").kendoTabStrip();
            $("a[id^='ahref_CBVHandlingInformation']").unbind("click").bind("click", function () {
                var theDivCBVHandlingInformationPopUp = document.getElementById("divCBVHandlingInformationPopUp");
                theDivCBVHandlingInformationPopUp.innerHTML = "";
                var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><tbody class='ui-widget-content'>";

                table += "<tr><td class='ui-widget-content first' style='text-align: left;'>Passenger Name: <input type='text' class='' name='PassengerName' id='PassengerName' tabindex='21' style='width: 150px; text-transform: uppercase;' controltype='alphanumericupper'  placeholder='' data-role='alphabettextbox'  autocomplete='off' ></td><td class='ui-widget-content first' style='text-align: left;'>PNR Number: <input type='text' class='' name='pnrnumber' id='pnrnumber' tabindex='21' style='width: 150px; text-transform: uppercase;' controltype='alphanumericupper'   placeholder='' data-role='alphabettextbox' autocomplete='off'></td><td><input type='submit' name='btnSaveCBVHandlingInformationData' id='btnSaveCallerInformatiCBVHandlingInformationData' tabindex='21' onclick='SaveCBVHandlingInformationData();' value='Save' class='btn btn-block btn-success btn-sm'></td></tr>";

                table += "</tbody></table>";

                theDivCBVHandlingInformationPopUp.innerHTML += table;
                $("#PassengerName").val($("#hdnPassengerName").val());
                $("#pnrnumber").val($("#hdnPNRNumber").val());
                cfi.PopUp("divCBVHandlingInformationPopUp", "CBV Handling Information");
            });
            
            //$("#ApplicationTabs").kendoTabStrip();
            $("a[id^='ahref_BillingAddress']").unbind("click").bind("click",function(){
                $.ajax({
                    url: "Services/Shipment/ReservationBookingService.svc/BillingDetails",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        BookingRefNo: $('#hdnBookingMasterRefNo').val(),
                        AWBSNo: currentawbsno
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {


                var theDivBillingAddressDetails = document.getElementById("divBillingAddressPopUp");
                theDivBillingAddressDetails.innerHTML = "";
                var Billingheadertext = "Billing Address";
               
                var table = "<table id='Billingaddresstab' validateonsubmit='true'>";
                table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                //table += "<tr><td class='ui-widget-header' colspan='4'>Billing Address: </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'>Name : <div><input type='text' class='' name='CustomerBilling_Name' id='CustomerBilling_Name' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off' ></div></td><td class='ui-widget-content'>Address: <div><input type='text' class='' name='CustomerBilling_Address' id='CustomerBilling_Address' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='100' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Contact Number : <div><input type='number' class='' name='CustomerBilling_MobileNo' style='width: 150px;' id='CustomerBilling_MobileNo' controltype='number' maxlength='25' value='' data-role='numerictextbox' pattern='[0 - 9] * '></div></td></tr>";
                table += "<tr><td class='ui-widget-content'>Town : <div><input type='text' class='' name='CustomerBilling_Town' id='CustomerBilling_Town' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>State : <div><input type='text' class='' name='CustomerBilling_State' id='CustomerBilling_State' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Postal Code :<div><input type='text' class='' name='CustomerBilling_PostalCode' id='CustomerBilling_PostalCode' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='10' data-role='numerictextbox' autocomplete='off'></div></td></tr>";
                table += "<tr><td class='ui-widget-content'>Country : <div><input type='hidden' name='CustomerBilling_CountryCode' id='CustomerBilling_CountryCode' value=''><input type='text' class='' name='Text_CustomerBilling_CountryCode' id='Text_CustomerBilling_CountryCode' data-valid='required' data-valid-msg='Select Country' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>City : <div><input type='hidden' name='CustomerBilling_City' id='CustomerBilling_City' value=''><input type='text' class='' name='Text_CustomerBilling_City' id='Text_CustomerBilling_City' data-valid='required' data-valid-msg='Select City' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'><input type='submit' name='btnSaveBillingAddressData' id='btnSaveBillingAddressData' tabindex='21' onclick='SaveBillingAddressData();' value='Save' class='btn btn-block btn-success btn-sm'></td></tr>";




                table += "</tbody></table>";
                
                theDivBillingAddressDetails.innerHTML += table;
                cfi.AutoCompleteV2("CustomerBilling_CountryCode", "CountryCode,CountryName", "Reservation_Country", null, "contains");
                cfi.AutoCompleteV2("CustomerBilling_City", "CityCode,CityName", "Reservation_City", null, "contains");
                cfi.PopUp("divBillingAddressPopUp", Billingheadertext);
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var billingData = myData.Table0;
                  
                    
                    if (billingData.length > 0) {
                        $("#CustomerBilling_Name").val(billingData[0].CustomerName);
                       
                        if (billingData[0].CountrySno > 0) {
                            $("#Text_CustomerBilling_CountryCode").data("kendoAutoComplete").setDefaultValue(billingData[0].CountrySno, billingData[0].CountryCode + '-' + billingData[0].CountryName);
                        }
                        if (billingData[0].CitySno > 0) {
                            $("#Text_CustomerBilling_City").data("kendoAutoComplete").setDefaultValue(billingData[0].CitySno, billingData[0].CityCode + '-' + billingData[0].CityName);
                        }
                        $("#CustomerBilling_MobileNo").val(billingData[0].Phone);
                       
                       ;
                        $("#CustomerBilling_Address").val(billingData[0].BillingAddress);
                        $("#CustomerBilling_Town").val(billingData[0].Location);
                      
                        $("#CustomerBilling_State").val(billingData[0].State);
                        
                        $("#CustomerBilling_PostalCode").val(billingData[0].PostalCode);
                        

                       
                    }
                   

                }
                    },
                    error: function (xhr) {
                        var a = "";
                    }
                });
            });
            $("a[id^='ahref_CallerCode']").unbind("click").bind("click", function () {
                var theDivCallerCodeDetails = document.getElementById("divCallerCodePopUp");
                theDivCallerCodeDetails.innerHTML = "";
                var callertext = "Caller Information";

                //    callertext = "Caller Information";
                if (userContext.SysSetting.IsShowEmailOnEWBLink == 'True')
                    callertext = "EWB/GST/Email Id"
                else
                    callertext = "Caller Information";
                var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><tbody class='ui-widget-content'>";
                //table += "<tr><td class='ui-widget-content first' style='text-align: left;'>Caller Information: <input type='textarea' class='' name='CallerCodeName' id='CallerCodeName' onblur='AddCallerDetails(this.id);' tabindex='21' style='width: 300px; text-transform: uppercase;' controltype='alphanumericupper' maxlength='99' value='" + $("#hdnCallerCode").val() + "' placeholder='' data-role='alphabettextbox' autocomplete='off'></td></tr>";
                //table += "<tr><td class='ui-widget-content first' style='text-align: left;'>" + callertext + ": <textarea name='CallerCodeName' tabindex='21' class='transSection k-input' id='CallerCodeName' style='width: 250px; text-transform: uppercase;' maxlength='99' autocomplete='off' data-role='alphabettextbox' controltype='alphanumericupper'></textarea></td><td><input type='submit' name='btnSaveCallerInformationData' id='btnSaveCallerInformationData' tabindex='21' onclick='SaveCallerInformationData();' value='Save' class='btn btn-block btn-success btn-sm'></td></tr>";
                var ewbtd = userContext.SysSetting.IsShowEmailOnEWBLink == 'True' ? "<td class='ui-widget-content first' style='text-align: left;'><BR><BR><BR>Email : <input type='text' class='transSection k-input' name='Text_EmailAddress' id='Text_EmailAddress' style='width:300px;' data-valid='required' data-valid-msg='Email can not be blank' colname='email:' tabindex='5' controltype='autocomplete' maxlength='198' value=''></td>" : "";
                var gsttd = userContext.SysSetting.IsShowEmailOnEWBLink == 'True' ? "<input type='radio'  checked='True'  name='EWBGST' id='Ewb' value='0'   onclick='EWBGSTchange()'>EWB <input type='radio'   name='EWBGST' id='Gst' value='1' onclick='EWBGSTchange()'>GST" : "";

                table += "<tr><td class='ui-widget-content first' style='text-align: left;'>" + gsttd + "<br><br>  <span id='caller'></span>" + ":<textarea name='CallerCodeName' tabindex='21' class='transSection k-input' id='CallerCodeName' style='width: 250px; text-transform: uppercase;' maxlength='99' autocomplete='off' data-role='alphabettextbox' controltype='alphanumericupper'></textarea></td>" + ewbtd + "<td><input type='submit' name='btnSaveCallerInformationData' id='btnSaveCallerInformationData' tabindex='21' onclick='SaveCallerInformationData();' value='Save' class='btn btn-block btn-success btn-sm'></td></tr>";
                table += "</tbody></table>";

                theDivCallerCodeDetails.innerHTML += table;
                $("#CallerCodeName").val($("#hdnCallerCode").val());
                cfi.PopUp("divCallerCodePopUp", callertext);
                if (userContext.SysSetting.IsShowEmailOnEWBLink == 'True') {

                    if ($("#hdnCallerType").val() == "0") {
                        $("#caller").text('EWB ');
                        $("#Ewb").prop('checked', true);
                    }
                    else if ($("#hdnCallerType").val() == "1") {
                        $("#caller").text('GST ');
                        $("#Gst").prop('checked', true);
                    }
                    else
                        $("#caller").text('EWB ');

                }

                else
                    $("#caller").text('Caller Information ');
                divmail = $("<div id='divmailAdd' style='overflow:auto;'><ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
                $("#Text_EmailAddress").after(divmail);
                SetEMail();




                spnlbl = $("<span ><p style='text-align: center;'>(Press enter key to capture E-mail Address)</p></span>");
                $("#Text_EmailAddress").after(spnlbl);
                email = $("<input type='hidden' id='hdnmail' name='hdnmail' value >");
                $("#Text_EmailAddress").after(email);
                PagerightsCheckReservation(0)
            });




            function SetEMail() {
                $("#Text_EmailAddress").keyup(function (e) {
                    var addlen = $("#Text_EmailAddress").val();
                    var iKeyCode = (e.which) ? e.which : e.keyCode
                    if (iKeyCode == 13) {
                        //var email = $("#Text_EmailAddress").val();
                        if (ValidateEMail(addlen)) {
                            if ($("ul#addlist1 li").length < 10) {
                                var listlen = $("ul#addlist1 li").length;
                                $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");

                            }
                            else {
                                ShowMessage('warning', 'Warning - Booking', "Maximum 10 E-mail Addresses allowed.");
                            }
                            $("#Text_EmailAddress").val('');
                        }
                        else {
                            ShowMessage('warning', 'Warning - Booking', "Please Enter valid Email address.");
                            //alert("Please Enter valid Email address");
                        }
                    }
                    else
                        e.preventDefault();
                });
                $("#Text_EmailAddress").blur(function () {
                    $("#Text_EmailAddress").val('');
                });

                $("body").on("click", ".remove", function () {
                    $(this).closest("li").remove();
                });
                len = $("#hdnEWBEmail").val().split(',').length;
                if ($("#hdnEWBEmail").val() != "") {
                    for (var jk = 0; jk < len; jk++) {
                        $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + $("#hdnEWBEmail").val().split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                    }
                    //$("#Email").val("");
                    // $("#Email").removeAttr('data-valid');
                }
            }

            function ValidateEMail(email) {
                var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
                return regex.test(email);
            }



            $("a[id^='ahref_HSCode']").unbind("click").bind("click", function () {
                var theDivHSCodeDetails = document.getElementById("divHSCodePopUp");
                theDivHSCodeDetails.innerHTML = "";
                var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content first' style='text-align: left;'><table class='appendGrid ui-widget'><tbody class='ui-widget-content'><tr><td><label>HS Code 1: </label><div><input type='hidden' name='HSCode1' id='HSCode1' value=''><input type='text' class='' name='Text_HSCode1' id='Text_HSCode1' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 2: </label><div><input type='hidden' name='HSCode2' id='HSCode2' value=''><input type='text' class='' name='Text_HSCode2' id='Text_HSCode2' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 3: </label><div><input type='hidden' name='HSCode3' id='HSCode3' value=''><input type='text' class='' name='Text_HSCode3' id='Text_HSCode3' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 4: </label><div><input type='hidden' name='HSCode4' id='HSCode4' value=''><input type='text' class='' name='Text_HSCode4' id='Text_HSCode4' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td></tr><tr><td><label>HS Code 5: </label><div><input type='hidden' name='HSCode5' id='HSCode5' value=''><input type='text' class='' name='Text_HSCode5' id='Text_HSCode5' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 6: </label><div><input type='hidden' name='HSCode6' id='HSCode6' value=''><input type='text' class='' name='Text_HSCode6' id='Text_HSCode6' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 7: </label><div><input type='hidden' name='HSCode7' id='HSCode7' value=''><input type='text' class='' name='Text_HSCode7' id='Text_HSCode7' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 8: </label><div><input type='hidden' name='HSCode8' id='HSCode8' value=''><input type='text' class='' name='Text_HSCode8' id='Text_HSCode8' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><tr><td><label>HS Code 9: </label><div><input type='hidden' name='HSCode9' id='HSCode9' value=''><input type='text' class='' name='Text_HSCode9' id='Text_HSCode9' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 10: </label><div><input type='hidden' name='HSCode10' id='HSCode10' value=''><input type='text' class='' name='Text_HSCode10' id='Text_HSCode10' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><label>HS Code 11: </label><div><input type='hidden' name='HSCode11' id='HSCode11' value=''><input type='text' class='' name='Text_HSCode11' id='Text_HSCode11' controltype='autocomplete' maxlength='50' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td><input type='submit' name='btnSavHSCodeData' id='btnSavHSCodeData' tabindex='21' onclick='SaveHSCode();' value='Save' class='btn btn-block btn-success btn-sm'></td></tr></table></td></tr>";
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
                if (HSCode != "" && Text_HSCode != "")
                    BindHSCode();
                cfi.PopUp("divHSCodePopUp", "HS Code");
            });

            $("a[id^='ahref_NOGDetails']").unbind("click").bind("click", function () {
                var Pieces = parseInt($("#AWBPieces").val() || "0");
                var GrsWt = parseFloat($("#AWBGrossWeight").val() || "0");
                var NatureofGd = ($("#Text_Commodity").data("kendoAutoComplete").key() || "0");

                if (Pieces == 0 || GrsWt == 0 || parseInt(NatureofGd) <= 0) {
                    ShowMessage('warning', 'Information!', "Enter Pieces, Gross weight and Commodity Details.");
                    return false;
                }
                if ((($("#Text_Commodity").data("kendoAutoComplete").value() || "") == "OTHER") && ($("#OtherNOG").val() == "")) {
                    ShowMessage('warning', 'Information!', "Enter Other Commodity Details.");
                    return false;
                }

                if (!$("#divareaTrans_shipment_shipmentnog").data("kendoWindow")) {
                    cfi.PopUp("divareaTrans_shipment_shipmentnog", "Commodity Details", 650);
                }
                else {
                    $("#divareaTrans_shipment_shipmentnog").data("kendoWindow").open();
                }
                var PcsRow = 0, WtRow = 0, NogRow = 0;
                $("div[id$='divareaTrans_shipment_shipmentnog']").find("[id^='areaTrans_shipment_shipmentnog']").each(function () {
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
                var FirstNogRow = $("div[id$='divareaTrans_shipment_shipmentnog']").find("[id='areaTrans_shipment_shipmentnog']:first");
                if (parseInt(PcsRow) > 0 || parseInt(WtRow) > 0 || parseInt(NogRow) > 0) { } else {
                    FirstNogRow.find("input[id*='Pieces']").val(Pieces);
                    FirstNogRow.find("input[id*='NogGrossWt']").val(GrsWt);
                }
                var NogKey = $("#Text_Commodity").data("kendoAutoComplete").key();
                var NogVal = $("#Text_Commodity").data("kendoAutoComplete").value();
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").setDefaultValue(NogKey, NogVal);
                FirstNogRow.find("input[id^='Text_OtherNatureofGoods']").data("kendoAutoComplete").enable(false);
                FirstNogRow.find("input[id^='NOG']").val($("#OtherNOG").val());
                FirstNogRow.find("input[id^='NOG']").attr('readonly', true);

            });

            $("#btnSave").unbind("click").bind("click", function () {
                if (SaveData(ProcessNameDetails)) {
                    ShipmentSearch();
                    CleanUI();
                }
            });
            $("#btnCancel").unbind("click").bind("click", function () {
                $("#ApplicationTabs-1").html("");
                $("#ApplicationTabs-2").html("");
                $("#ApplicationTabs-3").html("");
                $("#ApplicationTabs-4").html("");
                $("#ApplicationTabs-5").html("");
                $("#ApplicationTabs").hide();
                ResetDetails();
                $("#hdnBookingSNo").val();
                $("#hdnBookingMasterRefNo").val();
                currentawbsno = 0;
                currentawbno = "";
                HSCode = "";
                Text_HSCode = "";
                $("#btnSave").css("display", "none");
                $("#btnUpdate").css("display", "none");
                $("#btnCopyBooking").css("display", "none");
                $("#btnExecute").css("display", "none");
                $("#btnNew").css("display", "block");
                cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
            });
            var todaydate = new Date();
            var ItineraryDate = $("#ItineraryDate").data("kendoDatePicker");
            ItineraryDate.min(todaydate);
            $("input[id^=ItineraryDate]").change(function (e) {
                var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dto = new Date(Date.parse(k));
                var validFrom = $(this).attr("id").replace("To", "From");
                k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dfrom = new Date(Date.parse(k));
                if (dfrom > dto)
                    $(this).val("");
                $("#Text_ItineraryFlightNo").data("kendoAutoComplete").setDefaultValue('', '');
            });
            $("#ItineraryDate").attr('readOnly', 'readOnly');

            $("#ItineraryVolumeWeight").attr('disabled', true);
            $("#_tempItineraryVolumeWeight").attr('disabled', true);
            $("#ItineraryMainVolumeWeight").attr('disabled', true);
            $("#_tempItineraryMainVolumeWeight").attr('disabled', true);
            if (Action == "NEW") {
                $("#Text_AWBDestination").focus();
            }
        }
    });
    if (Action == "NEW") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GenerateAndGetReferenceNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: { BookingRefNo: 'GenerateAndGetReferenceNumber' },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $("#hdnBookingMasterRefNo").val(myData.Table0[0].ReferenceNumber);
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        GetProductAsPerAgent();
    }

}

function SaveCBVHandlingInformationData() {

    if ($("#PassengerName").val() == "" || $("#pnrnumber").val() == "") {
        ShowMessage('warning', 'warning - CBV Handling information', "Kindly Enter Passenger Name AND PNR Number", "bottom-right");
    }

    else {
        $("#hdnPassengerName").val($("#PassengerName").val());
        $("#hdnPNRNumber").val($("#pnrnumber").val());

        ShowMessage('success', 'Success - CBV Handling information', "Saved Successfully", "bottom-right");
        CloseCBVHandlingInformationPopUp();
    }
}
function CloseCBVHandlingInformationPopUp() {
    var window = $("#divCBVHandlingInformationPopUp");
    window.data("kendoWindow").close();
}

function SaveCallerInformationData() {
    $("#hdnCallerCode").val($("#CallerCodeName").val());
    $("#hdnCallerType").val($("input[name='EWBGST']:checked").val());
    var L = '';
    for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++) { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }
    $("#hdnEWBEmail").val(L.substring(0, L.length - 1));
    //  alert(L.substring(0, L.length - 1));
    ShowMessage('success', 'Success - Caller information', "Saved Successfully", "bottom-right");
    CloseCallerInformationpopUp();
}



function SaveBillingAddressData() {

    if ($('#CustomerBilling_Name').val() == "") {
        ShowMessage('warning', 'Information!', "Kindly Enter Customer Name.");
        return;
    }
    else if ($('#CustomerBilling_Address').val() == "") {
        ShowMessage('warning', 'Information!', "Kindly Enter Billing Addess.");
        return;
    }

    else if ($('#CustomerBilling_PostalCode').val() == "") {
        ShowMessage('warning', 'Information!', "Kindly Enter PostalCode.");
        return;
    }

    var BillingAddressModel = {
        CustomerBillingName: $("#CustomerBilling_Name").val(),
        
        CustomerBillingCountryCode: $("#Text_CustomerBilling_CountryCode").data("kendoAutoComplete").key(),
        CustomerBillingCityCode: $("#Text_CustomerBilling_City").data("kendoAutoComplete").key(),
        CustomerBillingMobileNo: $("#CustomerBilling_MobileNo").val(),
        
        CustomerBillingAddress: $("#CustomerBilling_Address").val(),
        CustomerBilling_Town: $("#CustomerBilling_Town").val(),
        CustomerBillingState: $("#CustomerBilling_State").val(),
        CustomerBillingPostalCode: $("#CustomerBilling_PostalCode").val()
       
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/SaveBillingAddressData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno || 0, BillingAddressModel: BillingAddressModel,  ReferenceNumber: $('#hdnBookingMasterRefNo').val(), AwbReferenceBookingSNo: $('#hdnBookingSNo').val() || "0" }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Billing Information', "Processed Successfully", "bottom-right");
            }
            
            else {
                ShowMessage('warning', 'Warning - Billing Information', "unable to process.", "bottom-right");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Billing Information', "unable to process.", "bottom-right");
        }
    });

   // $("#hdnBillingaddress").val($("#CustomerBilling_Name").val());
  
    //ShowMessage('success', 'Success - Billing information', "Saved Successfully", "bottom-right");
    CloseBillingInformationpopUp();
}
function CloseBillingInformationpopUp() {
    var window = $("#divBillingAddressPopUp");
    window.data("kendoWindow").close();
}

function CloseCallerInformationpopUp() {
    var window = $("#divCallerCodePopUp");
    window.data("kendoWindow").close();
}
function AddCallerDetails(e) {
    $("#hdnCallerCode").val($("#CallerCodeName").val());
}
function SaveChargeDeclarationsRateData() {


    if (userContext.SysSetting.ICMSEnvironment == 'JT' && $("#Text_Product").data("kendoAutoComplete").value().toUpperCase() == "GO SHOW") {
        var transtype = $('input:radio[name=transactionby]:checked').val();

        if (transtype == "1") {
            if ($("#transactonamount").val() == "") {
                ShowMessage('warning', 'Warning - Reservation', "Kindly Enter Amount.", "bottom-right");
                return;
            }
        }
        else if (transtype == "2") {
            if ($("#transactonamount").val() == "" || $("#transactionno").val() == "") {
                ShowMessage('warning', 'Warning - Reservation', "Kindly Enter Amount and Transaction No.", "bottom-right");
                return;
            }
        }
    }
    var ReservationChargeDeclarationsViewModel = {
        CVDCurrencyCode: $("#Text_Currency").data("kendoAutoComplete").key(),
        CVDChargeCode: $("#Text_RateChargeCode").data("kendoAutoComplete").key(),
        CVDWeightValuation: $("#Text_Valuation").data("kendoAutoComplete").key(),
        CVDOtherCharges: $("#Text_OtherCharge").data("kendoAutoComplete").key(),
        CVDDeclareCarriageValue: $("#DeclaredCarriageValue").val(),
        CVDDeclareCustomValue: $("#DeclaredCustomsValue").val(),
        CVDDeclareInsurenceValue: $("#Insurance").val(),
        CVDValuationCharge: $("#ValuationCharge").val(),
        CDCCurrencyCode: $("#Text_CDCCurrencyCode").data("kendoAutoComplete").key(),
        CDCCurrencyConversionRate: $("#CDCConversionRate").val() == "" ? "0" : $("#CDCConversionRate").val(),
        CDCDestinationCurrencyCode: $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").key(),
        CDCChargeAmount: $("#ChargeAmount").val() == "" ? "0" : $("#ChargeAmount").val(),
        CDCTotalChargeAmount: $("#TotalChargeAmount").val() == "" ? "0" : $("#TotalChargeAmount").val()
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/SaveChargeDeclarationsRateData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationChargeDeclarations: ReservationChargeDeclarationsViewModel, TransactionType: transtype, TransactionAmount: $("#transactonamount").val() || "0", TransactionNo: $("#transactionno").val() || "" }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                flag = true;
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                flag = false;
            }
            else if (result.split('?')[0] == "5") {
                ShowMessage('warning', 'Warning - Reservation', "Execution Time Expired.", "bottom-right");
                flag = false;
            }
            else if (result.split('?')[0] == "6") {
                ShowMessage('warning', 'Warning - Reservation', "Shipment can not be executed in LL mode.", "bottom-right");
                flag = false;
            }
            else if (result.split('?')[0] == "10") {
                ShowMessage('warning', 'Warning - Reservation', "AWB Stock not available.", "bottom-right");
                flag = false;
            }
            else {
                ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
            flag = false;
        }
    });
}
function ExecuteData(ProcessNameDetails) {
    var Dmns = true;
    var flag = false;
    var ULDCheck = true;
    var IsConfirmData = true;
    var AWBRouteStatusResult = true;
    var SoftEmbargo = "0";
    if (ProcessNameDetails.toUpperCase() == "EXECUTERESERVATIONBOOKING") {
        if (cfi.IsValidSection("ApplicationTabs-1")) {
            if (true) {
                if (BookingTypeIndexNo == "CBV") {
                    if ($("#hdnPassengerName").val() == "" || $("#hdnPNRNumber").val() == "") {
                        ShowMessage('warning', 'Information!', "Kindly Enter Passenger Name and PNR Number");
                        return;
                    }
                }
                var CheckAWBRouteStatusResult = CheckAWBRouteStatus();

                if (CheckAWBRouteStatusResult.split('~')[0] == 'false') {
                    AWBRouteStatusResult = false;
                    $("#tblSelectdRouteResult tbody tr td").each(function () {
                        var RouteStatus = $(this).closest('tr').find('td:eq(9)').text();
                        if ((RouteStatus == 'LL' || RouteStatus == 'HQ' || RouteStatus == 'UU' || AWBRouteStatusResult != true) && RouteStatus != '') {
                            AWBRouteStatusResult = false;
                            return false;
                        }
                        else
                            AWBRouteStatusResult = true;
                    });
                    if (AWBRouteStatusResult != true) {
                        if (CheckAWBRouteStatusResult.split('~')[1] != '')
                            ShowMessage('warning', 'Information!', "Shipment does not allowed to be Execute.");
                        else
                            ShowMessage('warning', 'Information!', "First Confirm Itinerary Route Status.");
                    }
                }
                if ($("#chkIsBUP").prop('checked') == true) {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/IsPerPiecesCheckAllow",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Commodity").data("kendoAutoComplete").key(),
                            SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    if (myData.Table0[0].Result == "0") {
                                        ULDCheck = false;
                                        ShowMessage('warning', 'Information!', 'Human should not be allowed in bup shipment');
                                        return;
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });

                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsValid != "") {
                                                if (myData.Table0[0].IsValid == "False") {
                                                    var ValidMessage = myData.Table0[0].ValidMessage;
                                                    ULDCheck = false;
                                                    ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                }
                if (ULDCheck == true && AWBRouteStatusResult == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        var Agentresult = IsInternationalBookingAgent($(tr).find("input[id^='hdnOriginAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnOriginAirportSNo_']").val(), $(tr).find("input[id^='hdnDestinationAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnDestinationAirportSNo_']").val());
                        if (Agentresult != true) {
                            IsConfirmData = false;
                            return;
                        }
                        /*	//Start Commented By Tarun for New Embargo Work
                    else {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    ItineraryPieces: $(tr).find("td")[3].innerText.trim(),
                                    ItineraryGrossWeight: $(tr).find("td")[4].innerText.trim(),
                                    ItineraryVolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                                if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                                    IsConfirmData = false;
                                                    ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                    return;
                                                }
                                                else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                    SoftEmbargo = "1";
                                                }
                                                if (IsConfirmData == false) {
                                                    return;
                                                }
                                                else if (IsConfirmData == true) {
                                                    $("#hdnSoftEmbargo_" + $(tr)[0].id).val("1");
                                                }
                                            }
                                            else
                                                $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                                        }
                                        else
                                            $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    }
                    //End Commented By Tarun for New Embargo Work	*/
                    });


                    /*	//Start Commented By Tarun for New Embargo Work
                    // Added for Check Embargo On OD
                    var OrgAirSNo = 0;
                    var DesAirSNo = 0;
                    if (IsConfirmData == true) {
                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                            if (row == 0)
                                OrgAirSNo = $(tr).find("input[id^='hdnOriginAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnOriginAirportSNo_']").val();
                            DesAirSNo = $(tr).find("input[id^='hdnDestinationAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnDestinationAirportSNo_']").val();
                        });
                        $.ajax({
                            url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParamOnOD",
                            async: false,
                            type: "GET",
                            dataType: "json",
                            data: {
                                DailFlightSNo: 0,
                                AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                ItineraryPieces: 0,
                                ItineraryGrossWeight: 0,
                                ItineraryVolumeWeight: 0,
                                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                IsAWBWise: 1,
                                OriginAirportSNo: OrgAirSNo,
                                DestinationAirportSNo: DesAirSNo,
                                AWBGrossWeight: $("#AWBGrossWeight").val(),
                                AWBPieces: $("#AWBPieces").val(),
                                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                            },
                            contentType: "application/json; charset=utf-8", cache: false,
                            success: function (result) {
                                if (result.substring(1, 0) == "{") {
                                    var myData = jQuery.parseJSON(result);
                                    if (myData.Table0.length > 0) {
                                        if (myData.Table0[0].IsSoftEmbargo != "") {
                                            if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                                IsConfirmData = false;
                                                ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                return;
                                            }
                                            else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                SoftEmbargo = "1";
                                            }
                                            if (IsConfirmData == false) {
                                                return;
                                            }
                                            else if (IsConfirmData == true) {
                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    $(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                            error: function (xhr) {
                                var a = "";
                            }
                        });
                    }
                    // END Added for Check Embargo On OD
					//End Commented By Tarun for New Embargo Work	*/


                    if (IsConfirmData == true) {




                        if ($("#chkIsBUP").prop('checked') != true) {
                            if (DimensionMandatoryOrNotInEcecutionAtCity == 0)
                                Dmns = true;
                            else
                                Dmns = CheckDimensionOnExecution();
                        }
                        else
                            Dmns = CheckULDDimensionOnExecution();
                        if (Dmns == true) {
                            var result = CheckAndValidateData();
                            if (result == true) {
                                var ReservationItinerarySNo = 0;
                                var ReservationItineraryViewModel = [];
                                var ReservationViewModel = {
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    BookingType: $('input:radio[name=BookingType]:checked').val(),
                                    AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                                    AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                                    AWBNo: $("#AWBNumber").val(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                                    BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : "",
                                    BupIntactPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUPIntact").val() : "",
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                                    DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").key(),
                                    AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    AWBPieces: $("#AWBPieces").val(),
                                    GrossWeight: $("#AWBGrossWeight").val(),
                                    VolumeWeight: $("#AWBVolumeWeight").val(),
                                    ChargeableWeight: $("#AWBChargeableWeight").val(),
                                    Volume: $("#AWBCBM").val(),
                                    Priority: $("#Text_Priority").data("kendoAutoComplete").key(),
                                    UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    NOG: $("#NatureOfGoods").val(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                    NoofHouse: $("#NoofHouse").val(),
                                    IsRoutingComplete: $("#chkIsRoutingComplete").prop('checked') == true ? 1 : 0,
                                }

                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                    ReservationItinerarySNo = parseInt(ReservationItinerarySNo) + parseInt(1);
                                    var ReservationItineraryInfo = {
                                        SNo: ReservationItinerarySNo,
                                        ReservationBookingSNo: $("#hdnBookingSNo").val().trim(),
                                        ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val().trim(),
                                        AWBPieces: $("#AWBPieces").val().trim(),
                                        AWBGrossWeight: $("#AWBGrossWeight").val().trim(),
                                        AWBVolumeWeight: $("#AWBCBM").val().trim(),
                                        UM: $("#Text_UM").data("kendoAutoComplete").key().trim(),
                                        DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id,  //$(tr)[0].id,
                                        CarrierCode: $(tr).find("td")[0].innerText.split("-")[0].trim(),
                                        FlightNo: $(tr).find("td")[0].innerText.trim(),
                                        FlightDate: $(tr).find("td")[1].innerText.trim(),
                                        Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                                        Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
                                        Pieces: $(tr).find("td")[3].innerText.trim(),
                                        GrossWeight: $(tr).find("td")[4].innerText.trim(),
                                        VolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                        ETD: $(tr).find("td")[6].innerText.split("/")[0].trim(),
                                        ETA: $(tr).find("td")[6].innerText.split("/")[1].trim(),
                                        AircraftType: $(tr).find("td")[7].innerText.trim(),
                                        FreeSpaceGrossWeight: "",
                                        FreeSpaceVolumeWeight: "",
                                        AllotmentCode: $(tr).find("td")[8].innerText.trim(),
                                        AllocatedGrossWeight: "",
                                        AllocatedVolumeWeight: "",
                                        AvailableGrossWeight: "",
                                        AvailableVolumeWeight: "",
                                        SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val().trim(),
                                        FlightVolumeWeight: $("#hdnItineraryMainVolumeWeight_" + $(tr)[0].id).val().trim(),
                                        OriginAirportSNo: $("#hdnOriginAirportSNo_" + $(tr)[0].id).val().trim(),
                                        DestinationAirportSNo: $("#hdnDestinationAirportSNo_" + $(tr)[0].id).val().trim(),
                                        IsBCT: $(tr).find("td")[12].innerText.trim().toUpperCase() == "YES" ? 1 : 0,
                                        IsMCT: $(tr).find("td")[13].innerText.trim().toUpperCase() == "YES" ? 1 : 0
                                    };
                                    ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                });
                                var ShipperViewModel = {
                                    SNo: $("#hdnShipperSNo").val(),
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
                                    ShipperName: $("#SHIPPER_Name").val(),
                                    ShipperName2: $("#SHIPPER_Name2").val(),
                                    ShipperStreet: $("#SHIPPER_Street").val(),
                                    ShipperStreet2: $("#SHIPPER_Street2").val(),
                                    ShipperLocation: $("#SHIPPER_TownLocation").val(),
                                    ShipperState: $("#SHIPPER_State").val(),
                                    ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
                                    ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
                                    ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
                                    ShipperMobile: $("#SHIPPER_MobileNo").val(),
                                    ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
                                    ShipperEMail: $("#SHIPPER_Email").val(),
                                    ShipperFax: $("#SHipper_Fax").val(),
                                    ShipperGarudaMiles: $("#SHipper_GarudaMiles").val(),

                                };

                                var ConsigneeViewMode = {
                                    SNo: $("#hdnConsigneeSNo").val(),
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
                                    ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
                                    ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
                                    ConsigneeStreet: $("#CONSIGNEE_Street").val(),
                                    ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
                                    ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
                                    ConsigneeState: $("#CONSIGNEE_State").val(),
                                    ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
                                    ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
                                    ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
                                    ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
                                    ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
                                    ConsigneeEMail: $("#CONSIGNEE_Email").val(),
                                    ConsigneeFax: $("#CONSIGNEE_Fax").val(),

                                };
                                var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
                                var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";
                                var CreateShipperTaxParticipants = $("#chkShippertaxid").prop("checked") ? "1" : "0";
                                var CreateConsigneerTaxParticipants = $("#chkconsigneetaxid").prop("checked") ? "1" : "0";
                                var CreateShipperTaxId = $("#SHipper_Taxid").val();
                                var CreateConsigneerTaxId = $("#Consignee_Taxid").val();
                                var ChkWb = $("#ChkWb").prop("checked") ? "1" : "0";
                                var EmbargoCheckResult = true;
                                $.ajax({
                                    url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoAll",
                                    async: false,
                                    type: "POST",
                                    //type: "GET",
                                    dataType: "json",
                                    data: JSON.stringify({ POMailSNo: "0", AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel }),
                                    //data: { ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel },
                                    contentType: "application/json; charset=utf-8", cache: false,
                                    success: function (result) {
                                        if (result.substring(1, 0) == "{") {
                                            var myData = jQuery.parseJSON(result);
                                            if (myData.Table0.length > 0) {
                                                for (var i = 0; i < myData.Table0.length; i++) {
                                                    if (myData.Table0[i].IsSoftEmbargo == "False") {
                                                        //var msg = myData.Table0[i].EmbMessage;
                                                        //$.alerts.cancelButton = 'Ok';
                                                        //var r = jConfirm('Embargo Levied' + ' - ' + msg, "", function (r) {
                                                        //	EmbargoCheckResult = false;
                                                        //	return;
                                                        //});

                                                        var EmbargoName = myData.Table0[i].EmbMessage;
                                                        EmbargoCheckResult = false;
                                                        ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                        return;
                                                    }
                                                }
                                                for (var j = 0; j < myData.Table0.length; j++) {
                                                    if (myData.Table0[j].IsSoftEmbargo != "") {
                                                        //var msg = myData.Table0[j].EmbMessage;
                                                        //SoftEmbargo = "1";
                                                        //$.alerts.okButton = 'Yes';
                                                        //$.alerts.cancelButton = 'No';
                                                        //var r = jConfirm(msg + ' - ' + 'Soft Embargo Applied. Do you wish to continue?', "", function (r) {
                                                        //	if (r == true) {
                                                        //		EmbargoCheckResult = true;
                                                        //		$('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        //			if ($(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id == myData.Table0[j].DailyFlightSNo)
                                                        //				$(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                        //		});
                                                        //	} else if (r == false) {
                                                        //		EmbargoCheckResult = false;
                                                        //		return;
                                                        //	}
                                                        //});

                                                        var EmbargoName = myData.Table0[j].EmbMessage;
                                                        EmbargoCheckResult = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                        SoftEmbargo = "1";
                                                        if (EmbargoCheckResult == true) {
                                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                                if ($(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id == myData.Table0[j].DailyFlightSNo)
                                                                    $(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                            });
                                                        }
                                                        else if (EmbargoCheckResult == false) {
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    error: function (xhr) {
                                        var a = "";
                                    }
                                });

                                if (EmbargoCheckResult == true) {
                                    GetRateReferenceCode($("#hdnBookingSNo").val())
                                    if (SoftEmbargo == "1") {
                                        ReservationItineraryViewModel = [];
                                        ReservationItinerarySNo = 0;
                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            ReservationItinerarySNo = parseInt(ReservationItinerarySNo) + parseInt(1);
                                            var ReservationItineraryInfo = {
                                                SNo: ReservationItinerarySNo,
                                                ReservationBookingSNo: $("#hdnBookingSNo").val().trim(),
                                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val().trim(),
                                                AWBPieces: $("#AWBPieces").val().trim(),
                                                AWBGrossWeight: $("#AWBGrossWeight").val().trim(),
                                                AWBVolumeWeight: $("#AWBCBM").val().trim(),
                                                UM: $("#Text_UM").data("kendoAutoComplete").key().trim(),
                                                DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id,  //$(tr)[0].id,
                                                CarrierCode: $(tr).find("td")[0].innerText.split("-")[0].trim(),
                                                FlightNo: $(tr).find("td")[0].innerText.trim(),
                                                FlightDate: $(tr).find("td")[1].innerText.trim(),
                                                Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                                                Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
                                                Pieces: $(tr).find("td")[3].innerText.trim(),
                                                GrossWeight: $(tr).find("td")[4].innerText.trim(),
                                                VolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                                ETD: $(tr).find("td")[6].innerText.split("/")[0].trim(),
                                                ETA: $(tr).find("td")[6].innerText.split("/")[1].trim(),
                                                AircraftType: $(tr).find("td")[7].innerText.trim(),
                                                FreeSpaceGrossWeight: "",
                                                FreeSpaceVolumeWeight: "",
                                                AllotmentCode: $(tr).find("td")[8].innerText.trim(),
                                                AllocatedGrossWeight: "",
                                                AllocatedVolumeWeight: "",
                                                AvailableGrossWeight: "",
                                                AvailableVolumeWeight: "",
                                                SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val().trim(),
                                                FlightVolumeWeight: $("#hdnItineraryMainVolumeWeight_" + $(tr)[0].id).val().trim(),
                                                OriginAirportSNo: $("#hdnOriginAirportSNo_" + $(tr)[0].id).val().trim(),
                                                DestinationAirportSNo: $("#hdnDestinationAirportSNo_" + $(tr)[0].id).val().trim(),
                                                IsBCT: $(tr).find("td")[12].innerText.toUpperCase() == "YES" ? 1 : 0,
                                                IsMCT: $(tr).find("td")[13].innerText.toUpperCase() == "YES" ? 1 : 0
                                            };
                                            ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                        });
                                    }
                                    $.ajax({
                                        url: "Services/Shipment/ReservationBookingService.svc/ExecuteBookingShipperandConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,

                                        data: JSON.stringify({ AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants, RateShowOnAWBPrint: $("#hdnRateShowOnAWBPrint").val() == "" ? 0 : $("#hdnRateShowOnAWBPrint").val(), HandlingInformation: $("#hdnHandlingInformation").val(), CallerCode: $("#hdnCallerCode").val() || "", PassengerName: $("#hdnPassengerName").val() || "", PNRNumber: $("#hdnPNRNumber").val() || "", HSCode: HSCode || "", CreateShipperTaxParticipants: CreateShipperTaxParticipants, CreateConsigneerTaxParticipants: CreateConsigneerTaxParticipants, CreateShipperTaxId: CreateShipperTaxId, CreateConsigneerTaxId: CreateConsigneerTaxId, EWBEmail: $("#hdnEWBEmail").val() || "", CallerType: $("#hdnCallerType").val() == "" ? "0" : $("#hdnCallerType").val(), ChkWb: ChkWb }),
                                        //data: JSON.stringify({ AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants, RateShowOnAWBPrint: $("#hdnRateShowOnAWBPrint").val() == "" ? 0 : $("#hdnRateShowOnAWBPrint").val(), HandlingInformation: $("#hdnHandlingInformation").val(), CallerCode: $("#hdnCallerCode").val() || "", PassengerName: "", PNRNumber: "" }),

                                        contentType: "application/json; charset=utf-8",
                                        success: function (result) {
                                            if (result.split('?')[0] == "0") {
                                                cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
                                                AuditLogSaveNewValue("ApplicationTabs-1", true, ProcessNameDetails, "AWB", currentawbsno > 0 ? currentPrefix + '-' + currentawbno : '', $("#hdnBookingSNo").val(), 'Execute', userContext.TerminalSNo, userContext.NewTerminalName);
                                                ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                                                refereshCreditLimit();
                                                HideTooltipSpanStyleInfo();
                                                //Added by Shivali Thakur
                                                if (sessionStorage.getItem("auditlog") != null) {
                                                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                                                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                                                }
                                                flag = true;

                                            }
                                            else if (result.split('?')[0] == "1") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "5") {
                                                ShowMessage('warning', 'Warning - Reservation', "Execution Time Expired.", "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "6") {
                                                ShowMessage('warning', 'Warning - Reservation', "Shipment going in LL mode, So it can not be executed.", "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "7") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "8") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "10") {
                                                ShowMessage('warning', 'Warning - Reservation', "AWB Stock not available.", "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "11") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else {
                                                ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                                                flag = false;
                                            }
                                        },
                                        error: function (xhr) {
                                            ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
                                            flag = false;
                                        }
                                    });
                                }
                            }

                        }
                    }
                }
                return flag;
            }
        }
    }
}
function UpdateData(ProcessNameDetails) {
    var Dmns = true;
    var flag = false;
    var ULDCheck = true;
    var IsConfirmData = true;
    var SoftEmbargo = "0";
    if (ProcessNameDetails.toUpperCase() == "UPDATERESERVATIONBOOKING") {
        if (cfi.IsValidSection("ApplicationTabs-1")) {
            if (true) {
                var CheckAWBRouteStatusResult = CheckAWBRouteStatus();
                //if (AWBStatusDetails == "Cancel" && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA') { }
                //else {
                //    if (CheckAWBRouteStatusResult.split('~')[0] == 'false') {
                //        AWBRouteStatusResult = false;
                //        $("#tblSelectdRouteResult tbody tr td").each(function () {
                //            var RouteStatus = $(this).closest('tr').find('td:eq(9)').text();
                //            if (RouteStatus == 'LL' || RouteStatus == 'HQ' || RouteStatus == 'UU') {
                //                AWBRouteStatusResult = false;
                //                return false;
                //            }
                //            else
                //                AWBRouteStatusResult = true;
                //        });
                //        if (AWBRouteStatusResult != true) {
                //            if (CheckAWBRouteStatusResult.split('~')[1] != '') {
                //                ShowMessage('warning', 'Information!', "Shipment does not allowed to be Update.");
                //                return false;
                //            }
                //            else
                //                ShowMessage('warning', 'Information!', "First Confirm Itinerary Route Status.");
                //            return false;
                //        }
                //    }
                //}
                if ($("#chkIsBUP").prop('checked') == true) {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/IsPerPiecesCheckAllow",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Commodity").data("kendoAutoComplete").key(),
                            SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    if (myData.Table0[0].Result == "0") {
                                        ULDCheck = false;
                                        ShowMessage('warning', 'Information!', 'Human should not be allowed in bup shipment');
                                        return;
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });

                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsValid != "") {
                                                if (myData.Table0[0].IsValid == "False") {
                                                    var ValidMessage = myData.Table0[0].ValidMessage;
                                                    ULDCheck = false;
                                                    ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                }
                if (ULDCheck == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        var Agentresult = IsInternationalBookingAgent($(tr).find("input[id^='hdnOriginAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnOriginAirportSNo_']").val(), $(tr).find("input[id^='hdnDestinationAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnDestinationAirportSNo_']").val());
                        if (Agentresult != true) {
                            IsConfirmData = false;
                            return;
                        }
                        /*	//Start Commented By Tarun for New Embargo Work
                    else {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    ItineraryPieces: $(tr).find("td")[3].innerText.trim(),
                                    ItineraryGrossWeight: $(tr).find("td")[4].innerText.trim(),
                                    ItineraryVolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                                if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                                    IsConfirmData = false;
                                                    ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                    return;
                                                }
                                                else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                    SoftEmbargo = "1";
                                                }
                                                if (IsConfirmData == false) {
                                                    return;
                                                }
                                                else if (IsConfirmData == true) {
                                                    $("#hdnSoftEmbargo_" + $(tr)[0].id).val("1");
                                                }
                                            }
                                            else
                                                $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                                        }
                                        else
                                            $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    }
                    //End Commented By Tarun for New Embargo Work	*/
                    });
                    /*	//Start Commented By Tarun for New Embargo Work
                    // Added for Check Embargo On OD
                    var OrgAirSNo = 0;
                    var DesAirSNo = 0;
                    if (IsConfirmData == true) {
                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                            if (row == 0)
                                OrgAirSNo = $(tr).find("input[id^='hdnOriginAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnOriginAirportSNo_']").val();
                            DesAirSNo = $(tr).find("input[id^='hdnDestinationAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnDestinationAirportSNo_']").val();
                        });
                        $.ajax({
                            url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParamOnOD",
                            async: false,
                            type: "GET",
                            dataType: "json",
                            data: {
                                DailFlightSNo: 0,
                                AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                ItineraryPieces: 0,
                                ItineraryGrossWeight: 0,
                                ItineraryVolumeWeight: 0,
                                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                IsAWBWise: 1,
                                OriginAirportSNo: OrgAirSNo,
                                DestinationAirportSNo: DesAirSNo,
                                AWBGrossWeight: $("#AWBGrossWeight").val(),
                                AWBPieces: $("#AWBPieces").val(),
                                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                            },
                            contentType: "application/json; charset=utf-8", cache: false,
                            success: function (result) {
                                if (result.substring(1, 0) == "{") {
                                    var myData = jQuery.parseJSON(result);
                                    if (myData.Table0.length > 0) {
                                        if (myData.Table0[0].IsSoftEmbargo != "") {
                                            if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                                IsConfirmData = false;
                                                ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                return;
                                            }
                                            else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                SoftEmbargo = "1";
                                            }
                                            if (IsConfirmData == false) {
                                                return;
                                            }
                                            else if (IsConfirmData == true) {
                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    $(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                            error: function (xhr) {
                                var a = "";
                            }
                        });
                    }
                    // END Added for Check Embargo On OD
					//End Commented By Tarun for New Embargo Work	*/
                    if (IsConfirmData == true) {
                        if ($("#chkIsBUP").prop('checked') != true)
                            Dmns = CheckDimensionOnSaveAndUpdate();
                        else
                            Dmns = CheckULDDimensionOnSaveAndUpdate();

                        if (userContext.SysSetting.ExecutionByPass == '1' && Dmns == true) {
                            if ($("#chkIsBUP").prop('checked') != true)
                                Dmns = CheckDimensionOnExecution();
                            else
                                Dmns = CheckULDDimensionOnExecution();
                        }
                        if (Dmns == true) {
                            var result = CheckAndValidateData();
                            if (result == true) {
                                var ReservationItinerarySNo = 0;
                                var ReservationItineraryViewModel = [];
                                var ReservationViewModel = {
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    BookingType: $('input:radio[name=BookingType]:checked').val(),
                                    AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                                    AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                                    AWBNo: $("#AWBNumber").val(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                                    BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : "",
                                    BupIntactPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUPIntact").val() : "",
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                                    DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").key(),
                                    AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    AWBPieces: $("#AWBPieces").val(),
                                    GrossWeight: $("#AWBGrossWeight").val(),
                                    VolumeWeight: $("#AWBVolumeWeight").val(),
                                    ChargeableWeight: $("#AWBChargeableWeight").val(),
                                    Volume: $("#AWBCBM").val(),
                                    Priority: $("#Text_Priority").data("kendoAutoComplete").key(),
                                    UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    NOG: $("#NatureOfGoods").val(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                    NoofHouse: $("#NoofHouse").val(),
                                    IsRoutingComplete: $("#chkIsRoutingComplete").prop('checked') == true ? 1 : 0



                                }

                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                    ReservationItinerarySNo = parseInt(ReservationItinerarySNo) + parseInt(1);
                                    var ReservationItineraryInfo = {
                                        SNo: ReservationItinerarySNo,
                                        ReservationBookingSNo: $("#hdnBookingSNo").val().trim(),
                                        ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val().trim(),
                                        AWBPieces: $("#AWBPieces").val().trim(),
                                        AWBGrossWeight: $("#AWBGrossWeight").val().trim(),
                                        AWBVolumeWeight: $("#AWBCBM").val().trim(),
                                        UM: $("#Text_UM").data("kendoAutoComplete").key().trim(),
                                        DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id,  //$(tr)[0].id,
                                        CarrierCode: $(tr).find("td")[0].innerText.split("-")[0].trim(),
                                        FlightNo: $(tr).find("td")[0].innerText.trim(),
                                        FlightDate: $(tr).find("td")[1].innerText.trim(),
                                        Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                                        Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
                                        Pieces: $(tr).find("td")[3].innerText.trim(),
                                        GrossWeight: $(tr).find("td")[4].innerText.trim(),
                                        VolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                        ETD: $(tr).find("td")[6].innerText.split("/")[0].trim(),
                                        ETA: $(tr).find("td")[6].innerText.split("/")[1].trim(),
                                        AircraftType: $(tr).find("td")[7].innerText.trim(),
                                        FreeSpaceGrossWeight: "",
                                        FreeSpaceVolumeWeight: "",
                                        AllotmentCode: $(tr).find("td")[8].innerText.trim(),
                                        AllocatedGrossWeight: "",
                                        AllocatedVolumeWeight: "",
                                        AvailableGrossWeight: "",
                                        AvailableVolumeWeight: "",
                                        SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val().trim(),
                                        FlightVolumeWeight: $("#hdnItineraryMainVolumeWeight_" + $(tr)[0].id).val().trim(),
                                        OriginAirportSNo: $("#hdnOriginAirportSNo_" + $(tr)[0].id).val().trim(),
                                        DestinationAirportSNo: $("#hdnDestinationAirportSNo_" + $(tr)[0].id).val().trim(),
                                        IsBCT: $(tr).find("td")[12].innerText.trim().toUpperCase() == "YES" ? 1 : 0,
                                        IsMCT: $(tr).find("td")[13].innerText.trim().toUpperCase() == "YES" ? 1 : 0
                                    };
                                    ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                });
                                var ShipperViewModel = {
                                    SNo: $("#hdnShipperSNo").val(),
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
                                    ShipperName: $("#SHIPPER_Name").val(),
                                    ShipperName2: $("#SHIPPER_Name2").val(),
                                    ShipperStreet: $("#SHIPPER_Street").val(),
                                    ShipperStreet2: $("#SHIPPER_Street2").val(),
                                    ShipperLocation: $("#SHIPPER_TownLocation").val(),
                                    ShipperState: $("#SHIPPER_State").val(),
                                    ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
                                    ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
                                    ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
                                    ShipperMobile: $("#SHIPPER_MobileNo").val(),
                                    ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
                                    ShipperEMail: $("#SHIPPER_Email").val(),
                                    ShipperFax: $("#SHipper_Fax").val(),
                                    ShipperGarudaMiles: $("#SHipper_GarudaMiles").val(),

                                };

                                var ConsigneeViewMode = {
                                    SNo: $("#hdnConsigneeSNo").val(),
                                    ReservationBookingSNo: $("#hdnBookingSNo").val(),
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
                                    ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
                                    ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
                                    ConsigneeStreet: $("#CONSIGNEE_Street").val(),
                                    ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
                                    ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
                                    ConsigneeState: $("#CONSIGNEE_State").val(),
                                    ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
                                    ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
                                    ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
                                    ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
                                    ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
                                    ConsigneeEMail: $("#CONSIGNEE_Email").val(),
                                    ConsigneeFax: $("#CONSIGNEE_Fax").val(),

                                };
                                var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
                                var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";
                                var CreateShipperTaxParticipants = $("#chkShippertaxid").prop("checked") ? "1" : "0";
                                var CreateConsigneerTaxParticipants = $("#chkconsigneetaxid").prop("checked") ? "1" : "0";
                                var CreateShipperTaxId = $("#SHipper_Taxid").val();
                                var CreateConsigneerTaxId = $("#Consignee_Taxid").val();

                                var EmbargoCheckResult = true;
                                $.ajax({
                                    url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoAll",
                                    async: false,
                                    type: "POST",
                                    //type: "GET",
                                    dataType: "json",
                                    data: JSON.stringify({ POMailSNo: "0", AWBSNo: currentawbsno, BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel }),
                                    //data: { ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel },
                                    contentType: "application/json; charset=utf-8", cache: false,
                                    success: function (result) {
                                        if (result.substring(1, 0) == "{") {
                                            var myData = jQuery.parseJSON(result);
                                            if (myData.Table0.length > 0) {
                                                for (var i = 0; i < myData.Table0.length; i++) {
                                                    if (myData.Table0[i].IsSoftEmbargo == "False") {
                                                        //var msg = myData.Table0[i].EmbMessage;
                                                        //$.alerts.cancelButton = 'Ok';
                                                        //var r = jConfirm('Embargo Levied' + ' - ' + msg, "", function (r) {
                                                        //	EmbargoCheckResult = false;
                                                        //	return;
                                                        //});

                                                        var EmbargoName = myData.Table0[i].EmbMessage;
                                                        EmbargoCheckResult = false;
                                                        ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                        return;
                                                    }
                                                }
                                                for (var j = 0; j < myData.Table0.length; j++) {
                                                    if (myData.Table0[j].IsSoftEmbargo != "") {
                                                        //var msg = myData.Table0[j].EmbMessage;
                                                        //SoftEmbargo = "1";
                                                        //$.alerts.okButton = 'Yes';
                                                        //$.alerts.cancelButton = 'No';
                                                        //var r = jConfirm(msg + ' - ' + 'Soft Embargo Applied. Do you wish to continue?', "", function (r) {
                                                        //	if (r == true) {
                                                        //		EmbargoCheckResult = true;
                                                        //		$('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        //			if ($(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id == myData.Table0[j].DailyFlightSNo)
                                                        //				$(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                        //		});
                                                        //	} else if (r == false) {
                                                        //		EmbargoCheckResult = false;
                                                        //		return;
                                                        //	}
                                                        //});


                                                        var EmbargoName = myData.Table0[j].EmbMessage;
                                                        EmbargoCheckResult = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                        SoftEmbargo = "1";
                                                        if (EmbargoCheckResult == true) {
                                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                                if ($(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id == myData.Table0[j].DailyFlightSNo)
                                                                    $(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                            });
                                                        }
                                                        else if (EmbargoCheckResult == false) {
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    error: function (xhr) {
                                        var a = "";
                                    }
                                });

                                if (EmbargoCheckResult == true) {
                                    GetRateReferenceCode($("#hdnBookingSNo").val())
                                    if (SoftEmbargo == "1") {
                                        ReservationItineraryViewModel = [];
                                        ReservationItinerarySNo = 0;
                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            ReservationItinerarySNo = parseInt(ReservationItinerarySNo) + parseInt(1);
                                            var ReservationItineraryInfo = {
                                                SNo: ReservationItinerarySNo,
                                                ReservationBookingSNo: $("#hdnBookingSNo").val().trim(),
                                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val().trim(),
                                                AWBPieces: $("#AWBPieces").val().trim(),
                                                AWBGrossWeight: $("#AWBGrossWeight").val().trim(),
                                                AWBVolumeWeight: $("#AWBCBM").val().trim(),
                                                UM: $("#Text_UM").data("kendoAutoComplete").key().trim(),
                                                DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id,  //$(tr)[0].id,
                                                CarrierCode: $(tr).find("td")[0].innerText.split("-")[0].trim(),
                                                FlightNo: $(tr).find("td")[0].innerText.trim(),
                                                FlightDate: $(tr).find("td")[1].innerText.trim(),
                                                Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                                                Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
                                                Pieces: $(tr).find("td")[3].innerText.trim(),
                                                GrossWeight: $(tr).find("td")[4].innerText.trim(),
                                                VolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                                ETD: $(tr).find("td")[6].innerText.split("/")[0].trim(),
                                                ETA: $(tr).find("td")[6].innerText.split("/")[1].trim(),
                                                AircraftType: $(tr).find("td")[7].innerText.trim(),
                                                FreeSpaceGrossWeight: "",
                                                FreeSpaceVolumeWeight: "",
                                                AllotmentCode: $(tr).find("td")[8].innerText.trim(),
                                                AllocatedGrossWeight: "",
                                                AllocatedVolumeWeight: "",
                                                AvailableGrossWeight: "",
                                                AvailableVolumeWeight: "",
                                                SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val().trim(),
                                                FlightVolumeWeight: $("#hdnItineraryMainVolumeWeight_" + $(tr)[0].id).val().trim(),
                                                OriginAirportSNo: $("#hdnOriginAirportSNo_" + $(tr)[0].id).val().trim(),
                                                DestinationAirportSNo: $("#hdnDestinationAirportSNo_" + $(tr)[0].id).val().trim(),
                                                IsBCT: $(tr).find("td")[12].innerText.trim().toUpperCase() == "YES" ? 1 : 0,
                                                IsMCT: $(tr).find("td")[13].innerText.trim().toUpperCase() == "YES" ? 1 : 0
                                            };
                                            ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                        });
                                    }
                                    $.ajax({
                                        url: "Services/Shipment/ReservationBookingService.svc/UpdateBookingShipperandConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
                                        data: JSON.stringify({ BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants, RateShowOnAWBPrint: $("#hdnRateShowOnAWBPrint").val() == "" ? 0 : $("#hdnRateShowOnAWBPrint").val(), CallerCode: $("#hdnCallerCode").val() || "", HSCode: HSCode || "", CreateShipperTaxParticipants: CreateShipperTaxParticipants, CreateConsigneerTaxParticipants: CreateConsigneerTaxParticipants, CreateShipperTaxId: CreateShipperTaxId, CreateConsigneerTaxId: CreateConsigneerTaxId, EWBEmail: $("#hdnEWBEmail").val() || "", CallerType: $("#hdnCallerType").val() == "" ? "0" : $("#hdnCallerType").val(), ChkWb: $("#ChkWb").prop('checked') == true ? 1 : 0 }),
                                        //data: JSON.stringify({ BookingSNo: $("#hdnBookingSNo").val(), BookingRefNo: $("#hdnBookingMasterRefNo").val() }),
                                        contentType: "application/json; charset=utf-8",
                                        success: function (result) {
                                            if (result.split('?')[0] == "0") {
                                                ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                                                refereshCreditLimit()
                                                HideTooltipSpanStyleInfo();

                                                AuditLogSaveNewValue("tblApplySpotCode", true, ProcessNameDetails, "REFERENCENUMBER", $("#hdnBookingMasterRefNo").val(), $("#hdnBookingSNo").val(), 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);
                                                //Added by Shivali Thakur
                                                if (sessionStorage.getItem("auditlog") != null) {
                                                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                                                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                                                }
                                                // AuditLogSaveNewValue("ApplicationTabs-1", true, ProcessNameDetails, "REFERENCENUMBER", $("#hdnBookingMasterRefNo").val(), $("#hdnBookingSNo").val());
                                                flag = true;
                                            }
                                            else if (result.split('?')[0] == "1") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "7") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "8") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "10") {
                                                ShowMessage('warning', 'Warning - Reservation', "AWB Stock not available.", "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "11") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else {
                                                ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                                                flag = false;
                                            }
                                        },
                                        error: function (xhr) {
                                            ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
                                            flag = false;
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                //else {
                //    ShowMessage('warning', 'Warning - Reservation', "Pieces or Gross Weight or Volume not match Origin Destination Pair.", "bottom-right");
                //}
                return flag;
            }
        }
    }
}
//Added By Shivali Thakur
function GetRateReferenceCode(Keysno) {
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/Common/CommonService.svc/GetRateReferenceCode?Keysno=" + Keysno,
        success: function (result) {
            //var Data = jQuery.parseJSON(result);
            //if (Data.Table0.length > 0) {

            // var RateRefrenceNoforAuditLog = Data.Table0[0]["RateRefNo"];
            var oldrefcode = sessionStorage.setItem("OldRateRefCode", result)  // getItem("OldRateRefCode");
            //var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: subprocess, ColumnName: "Rate Reference Code", OldValue: oldrefcode, NewValue: RateRefrenceNoforAuditLog };
            //arrVal.push(a);
            // }
        }
    });
}

function SaveData(ProcessNameDetails) {
    var Dmns = true;
    var flag = false;
    var ULDCheck = true;
    var IsConfirmData = true;
    var SoftEmbargo = "0";
    if (ProcessNameDetails == "RESERVATIONBOOKING") {
        if ($("#AWBNumber").val() != "") {
            ValidateAndCheckValidAWBNumber();
        }
        if (cfi.IsValidSection("ApplicationTabs-1")) {
            if (true) {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/IsPerPiecesCheckAllow",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Commodity").data("kendoAutoComplete").key(),
                            SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    if (myData.Table0[0].Result == "0") {
                                        ULDCheck = false;
                                        ShowMessage('warning', 'Information!', 'Human should not be allowed in bup shipment');
                                        return;
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });

                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsValid != "") {
                                                if (myData.Table0[0].IsValid == "False") {
                                                    var ValidMessage = myData.Table0[0].ValidMessage;
                                                    ULDCheck = false;
                                                    ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    });
                }
                if (ULDCheck == true) {
                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                        var Agentresult = IsInternationalBookingAgent($(tr).find("input[id^='hdnOriginAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnOriginAirportSNo_']").val(), $(tr).find("input[id^='hdnDestinationAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnDestinationAirportSNo_']").val());
                        if (Agentresult != true) {
                            IsConfirmData = false;
                            return;
                        }
                        /*	//Start Commented By Tarun for New Embargo Work
                    else {
                        if ($(tr)[0].id.indexOf('_') > 0) {
                        }
                        else {
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    DailFlightSNo: $(tr)[0].id,
                                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    ItineraryPieces: $(tr).find("td")[3].innerText.trim(),
                                    ItineraryGrossWeight: $(tr).find("td")[4].innerText.trim(),
                                    ItineraryVolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsSoftEmbargo != "") {
                                                if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                                    IsConfirmData = false;
                                                    ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                    return;
                                                }
                                                else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                    IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                    SoftEmbargo = "1";
                                                }
                                                if (IsConfirmData == false) {
                                                    return;
                                                }
                                                else if (IsConfirmData == true) {
                                                    $("#hdnSoftEmbargo_" + $(tr)[0].id).val("1");
                                                }
                                            }
                                            else
                                                $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                                        }
                                        else
                                            $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                                    }
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    }
                    //End Commented By Tarun for New Embargo Work	*/
                    });
                    /*	//Start Commented By Tarun for New Embargo Work
                    // Added for Check Embargo On OD
                    var OrgAirSNo = 0;
                    var DesAirSNo = 0;
                    if (IsConfirmData == true) {
                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                            if (row == 0)
                                OrgAirSNo = $(tr).find("input[id^='hdnOriginAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnOriginAirportSNo_']").val();
                            DesAirSNo = $(tr).find("input[id^='hdnDestinationAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnDestinationAirportSNo_']").val();
                        });
                        $.ajax({
                            url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParamOnOD",
                            async: false,
                            type: "GET",
                            dataType: "json",
                            data: {
                                DailFlightSNo: 0,
                                AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                ItineraryPieces: 0,
                                ItineraryGrossWeight: 0,
                                ItineraryVolumeWeight: 0,
                                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                IsAWBWise: 1,
                                OriginAirportSNo: OrgAirSNo,
                                DestinationAirportSNo: DesAirSNo,
                                AWBGrossWeight: $("#AWBGrossWeight").val(),
                                AWBPieces: $("#AWBPieces").val(),
                                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                            },
                            contentType: "application/json; charset=utf-8", cache: false,
                            success: function (result) {
                                if (result.substring(1, 0) == "{") {
                                    var myData = jQuery.parseJSON(result);
                                    if (myData.Table0.length > 0) {
                                        if (myData.Table0[0].IsSoftEmbargo != "") {
                                            if (myData.Table0[0].IsSoftEmbargo != "True") {
                                                var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                                IsConfirmData = false;
                                                ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                return;
                                            }
                                            else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                                var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                                IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                SoftEmbargo = "1";
                                            }
                                            if (IsConfirmData == false) {
                                                return;
                                            }
                                            else if (IsConfirmData == true) {
                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    $(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                            error: function (xhr) {
                                var a = "";
                            }
                        });
                    }
                    // END Added for Check Embargo On OD
					//End Commented By Tarun for New Embargo Work	*/
                    if (IsConfirmData == true) {
                        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                            if ($('#chkterms').prop('checked') != true) {
                                ShowMessage('warning', 'Warning - Reservation', "Kindly accept Terms & Conditions to proceed with Booking.", "bottom-right");
                                $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#litermsandcondtion'));
                                //setTimeout(function () { window.scrollTo(0, document.body.scrollHeight) }, 500);
                                termsandcondtionTab();
                                Dmns = false;
                                return false;
                            }
                        }
                        if ($("#chkIsBUP").prop('checked') != true)
                            Dmns = CheckDimensionOnSaveAndUpdate();
                        else
                            Dmns = CheckULDDimensionOnSaveAndUpdate();

                        if (userContext.SysSetting.ExecutionByPass == '1' && Dmns == true && DimensionMandatoryOrNotInEcecutionAtCity == 1) {
                            if ($("#chkIsBUP").prop('checked') != true)
                                Dmns = CheckDimensionOnExecution();
                            else
                                Dmns = CheckULDDimensionOnExecution();
                        }
                        if (Dmns == true) {
                            var result = CheckAndValidateData();
                            if (result == true) {
                                var ReservationItinerarySNo = 0;
                                var ReservationItineraryViewModel = [];
                                var ReservationViewModel = {
                                    ReservationBookingSNo: "0",
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    BookingType: $('input:radio[name=BookingType]:checked').val(),
                                    AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                                    AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                                    AWBNo: $("#AWBNumber").val(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                                    BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : "",
                                    BupIntactPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUPIntact").val() : "",
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                                    DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").key(),
                                    AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    AWBPieces: $("#AWBPieces").val(),
                                    GrossWeight: $("#AWBGrossWeight").val(),
                                    VolumeWeight: $("#AWBVolumeWeight").val(),
                                    ChargeableWeight: $("#AWBChargeableWeight").val(),
                                    Volume: $("#AWBCBM").val(),
                                    Priority: $("#Text_Priority").data("kendoAutoComplete").key(),
                                    UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    NOG: $("#NatureOfGoods").val(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                    NoofHouse: $("#NoofHouse").val(),
                                    IsRoutingComplete: $("#chkIsRoutingComplete").prop('checked') == true ? 1 : 0,
                                }

                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                    ReservationItinerarySNo = parseInt(ReservationItinerarySNo) + parseInt(1);
                                    var ReservationItineraryInfo = {
                                        SNo: ReservationItinerarySNo,
                                        ReservationBookingSNo: "0",
                                        ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val().trim(),
                                        AWBPieces: $("#AWBPieces").val().trim(),
                                        AWBGrossWeight: $("#AWBGrossWeight").val().trim(),
                                        AWBVolumeWeight: $("#AWBCBM").val().trim(),
                                        UM: $("#Text_UM").data("kendoAutoComplete").key().trim(),
                                        DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id, //function () { if ($(tr)[0].id.indexOf('_') > 0) return 0; else return $(tr)[0].id; },
                                        CarrierCode: $(tr).find("td")[0].innerText.split("-")[0].trim(),
                                        FlightNo: $(tr).find("td")[0].innerText.trim(),
                                        FlightDate: $(tr).find("td")[1].innerText.trim(),
                                        Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                                        Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
                                        Pieces: $(tr).find("td")[3].innerText.trim().trim(),
                                        GrossWeight: $(tr).find("td")[4].innerText.trim(),
                                        VolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                        ETD: $(tr).find("td")[6].innerText.split("/")[0].trim(),
                                        ETA: $(tr).find("td")[6].innerText.split("/")[1].trim(),
                                        AircraftType: $(tr).find("td")[7].innerText.trim(),
                                        FreeSpaceGrossWeight: "",
                                        FreeSpaceVolumeWeight: "",
                                        AllotmentCode: $(tr).find("td")[8].innerText.trim(),
                                        AllocatedGrossWeight: "",
                                        AllocatedVolumeWeight: "",
                                        AvailableGrossWeight: "",
                                        AvailableVolumeWeight: "",
                                        SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val().trim(),
                                        FlightVolumeWeight: $("#hdnItineraryMainVolumeWeight_" + $(tr)[0].id).val().trim(),
                                        OriginAirportSNo: $("#hdnOriginAirportSNo_" + $(tr)[0].id).val().trim(),
                                        DestinationAirportSNo: $("#hdnDestinationAirportSNo_" + $(tr)[0].id).val().trim(),
                                        IsBCT: $(tr).find("td")[12].innerText.trim().toUpperCase() == "YES" ? 1 : 0,
                                        IsMCT: $(tr).find("td")[13].innerText.trim().toUpperCase() == "YES" ? 1 : 0
                                    };
                                    ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                });
                                var ShipperViewModel = {
                                    SNo: "0",
                                    ReservationBookingSNo: "0",
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
                                    ShipperName: $("#SHIPPER_Name").val(),
                                    ShipperName2: $("#SHIPPER_Name2").val(),
                                    ShipperStreet: $("#SHIPPER_Street").val(),
                                    ShipperStreet2: $("#SHIPPER_Street2").val(),
                                    ShipperLocation: $("#SHIPPER_TownLocation").val(),
                                    ShipperState: $("#SHIPPER_State").val(),
                                    ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
                                    ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
                                    ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
                                    ShipperMobile: $("#SHIPPER_MobileNo").val(),
                                    ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
                                    ShipperEMail: $("#SHIPPER_Email").val(),
                                    ShipperFax: $("#SHipper_Fax").val(),
                                    ShipperGarudaMiles: $("#SHipper_GarudaMiles").val(),

                                };

                                var ConsigneeViewMode = {
                                    SNo: "0",
                                    ReservationBookingSNo: "0",
                                    ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val(),
                                    ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
                                    ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
                                    ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
                                    ConsigneeStreet: $("#CONSIGNEE_Street").val(),
                                    ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
                                    ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
                                    ConsigneeState: $("#CONSIGNEE_State").val(),
                                    ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
                                    ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
                                    ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
                                    ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
                                    ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
                                    ConsigneeEMail: $("#CONSIGNEE_Email").val(),
                                    ConsigneeFax: $("#CONSIGNEE_Fax").val(),

                                };
                                var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
                                var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";
                                var CreateShipperTaxParticipants = $("#chkShippertaxid").prop("checked") ? "1" : "0";
                                var CreateConsigneerTaxParticipants = $("#chkconsigneetaxid").prop("checked") ? "1" : "0";
                                var CreateShipperTaxId = $("#SHipper_Taxid").val();
                                var CreateConsigneerTaxId = $("#Consignee_Taxid").val();
                                var ChkWb = $("#ChkWb").prop("checked") ? "1" : "0";
                                var EmbargoCheckResult = true;
                                $.ajax({
                                    url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoAll",
                                    async: false,
                                    type: "POST",
                                    //type: "GET",
                                    dataType: "json",
                                    data: JSON.stringify({ POMailSNo: "0", AWBSNo: "0", BookingSNo: "0", BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel }),
                                    //data: { ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel },
                                    contentType: "application/json; charset=utf-8", cache: false,
                                    success: function (result) {
                                        if (result.substring(1, 0) == "{") {
                                            var myData = jQuery.parseJSON(result);
                                            if (myData.Table0.length > 0) {
                                                for (var i = 0; i < myData.Table0.length; i++) {
                                                    if (myData.Table0[i].IsSoftEmbargo == "False") {
                                                        //var msg = myData.Table0[i].EmbMessage;
                                                        //$.alerts.cancelButton = 'Ok';
                                                        //var r = jConfirm('Embargo Levied' + ' - ' + msg, "", function (r) {
                                                        //	EmbargoCheckResult = false;
                                                        //	return;
                                                        //});

                                                        var EmbargoName = myData.Table0[i].EmbMessage;
                                                        EmbargoCheckResult = false;
                                                        ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                                                        return;
                                                    }
                                                }
                                                for (var j = 0; j < myData.Table0.length; j++) {
                                                    if (myData.Table0[j].IsSoftEmbargo != "") {
                                                        //var msg = myData.Table0[j].EmbMessage;
                                                        //SoftEmbargo = "1";
                                                        //$.alerts.okButton = 'Yes';
                                                        //$.alerts.cancelButton = 'No';
                                                        //var r = jConfirm(msg + ' - ' + 'Soft Embargo Applied. Do you wish to continue?', "", function (r) {
                                                        //	if (r == true) {
                                                        //		EmbargoCheckResult = true;
                                                        //		$('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        //			if ($(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id == myData.Table0[j].DailyFlightSNo)
                                                        //				$(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                        //		});
                                                        //	} else if (r == false) {
                                                        //		EmbargoCheckResult = false;
                                                        //		return;
                                                        //	}
                                                        //});

                                                        var EmbargoName = myData.Table0[j].EmbMessage;
                                                        EmbargoCheckResult = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                                        SoftEmbargo = "1";
                                                        if (EmbargoCheckResult == true) {
                                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                                if ($(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id == myData.Table0[j].DailyFlightSNo)
                                                                    $(tr).find("input[id^='hdnSoftEmbargo_']").val("1");
                                                            });
                                                        }
                                                        else if (EmbargoCheckResult == false) {
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    error: function (xhr) {
                                        var a = "";
                                    }
                                });

                                if (EmbargoCheckResult == true) {
                                    if (SoftEmbargo == "1") {
                                        ReservationItineraryViewModel = [];
                                        ReservationItinerarySNo = 0;
                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            ReservationItinerarySNo = parseInt(ReservationItinerarySNo) + parseInt(1);
                                            var ReservationItineraryInfo = {
                                                SNo: ReservationItinerarySNo,
                                                ReservationBookingSNo: "0",
                                                ReservationBookingRefNo: $("#hdnBookingMasterRefNo").val().trim(),
                                                AWBPieces: $("#AWBPieces").val().trim(),
                                                AWBGrossWeight: $("#AWBGrossWeight").val().trim(),
                                                AWBVolumeWeight: $("#AWBCBM").val().trim(),
                                                UM: $("#Text_UM").data("kendoAutoComplete").key().trim(),
                                                DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id, //function () { if ($(tr)[0].id.indexOf('_') > 0) return 0; else return $(tr)[0].id; },
                                                CarrierCode: $(tr).find("td")[0].innerText.split("-")[0].trim(),
                                                FlightNo: $(tr).find("td")[0].innerText.trim(),
                                                FlightDate: $(tr).find("td")[1].innerText.trim(),
                                                Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                                                Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
                                                Pieces: $(tr).find("td")[3].innerText.trim(),
                                                GrossWeight: $(tr).find("td")[4].innerText.trim(),
                                                VolumeWeight: $(tr).find("td")[5].innerText.trim(),
                                                ETD: $(tr).find("td")[6].innerText.split("/")[0].trim(),
                                                ETA: $(tr).find("td")[6].innerText.split("/")[1].trim(),
                                                AircraftType: $(tr).find("td")[7].innerText.trim(),
                                                FreeSpaceGrossWeight: "",
                                                FreeSpaceVolumeWeight: "",
                                                AllotmentCode: $(tr).find("td")[8].innerText.trim(),
                                                AllocatedGrossWeight: "",
                                                AllocatedVolumeWeight: "",
                                                AvailableGrossWeight: "",
                                                AvailableVolumeWeight: "",
                                                SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val().trim(),
                                                FlightVolumeWeight: $("#hdnItineraryMainVolumeWeight_" + $(tr)[0].id).val().trim(),
                                                OriginAirportSNo: $("#hdnOriginAirportSNo_" + $(tr)[0].id).val().trim(),
                                                DestinationAirportSNo: $("#hdnDestinationAirportSNo_" + $(tr)[0].id).val().trim(),
                                                IsBCT: $(tr).find("td")[12].innerText.trim().toUpperCase() == "YES" ? 1 : 0,
                                                IsMCT: $(tr).find("td")[13].innerText.trim().toUpperCase() == "YES" ? 1 : 0
                                            };
                                            ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                        });
                                    }
                                    $.ajax({
                                        url: "Services/Shipment/ReservationBookingService.svc/AddBookingShipperandConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
                                        data: JSON.stringify({ BookingRefNo: $("#hdnBookingMasterRefNo").val(), ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants, CallerCode: $("#hdnCallerCode").val() || "", HSCode: HSCode || "", CreateShipperTaxParticipants: CreateShipperTaxParticipants, CreateConsigneerTaxParticipants: CreateConsigneerTaxParticipants, CreateShipperTaxId: CreateShipperTaxId, CreateConsigneerTaxId: CreateConsigneerTaxId, EWBEmail: $("#hdnEWBEmail").val() || "", CallerType: $("#hdnCallerType").val() == "" ? "0" : $("#hdnCallerType").val(), ChkWb: ChkWb }),
                                        contentType: "application/json; charset=utf-8",
                                        success: function (result) {
                                            if (result.split('?')[0] == "0") {
                                                ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                                                refereshCreditLimit();
                                                HideTooltipSpanStyleInfo();
                                                //AuditLogSaveNewValue("ApplicationTabs-1", true, ProcessNameDetails, "REFERENCENUMBER", $("#hdnBookingMasterRefNo").val(), 0, 'New', userContext.TerminalSNo, userContext.NewTerminalName);
                                                ////Added by Shivali Thakur
                                                //if (sessionStorage.getItem("auditlog") != null) {
                                                //    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                                                //    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                                                //}
                                                flag = true;
                                            }
                                            else if (result.split('?')[0] == "1") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "2") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = true;
                                            }
                                            else if (result.split('?')[0] == "3") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "7") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "8") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "10") {
                                                ShowMessage('warning', 'Warning - Reservation', "AWB Stock not available.", "bottom-right");
                                                flag = false;
                                            }
                                            else if (result.split('?')[0] == "11") {
                                                ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                                flag = false;
                                            }
                                            else {
                                                ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                                                flag = false;
                                            }
                                        },
                                        error: function (xhr) {
                                            ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                                            flag = false;
                                        }
                                    });
                                }
                            }
                        }
                    }
                }

                //else {
                //    ShowMessage('warning', 'Warning - Reservation', "Pieces or Gross Weight or Volume not match Origin Destination Pair.", "bottom-right");
                //}
                return flag;
            }
        }
    }
}
function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
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
    $("#" + containerId).find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            cfi.AlphabetTextBox(controlId, alphabetstyle);
        }
    });
    SetDateRangeValue();

    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });
    $("input[name='operation']").click(function () {
        _callBack();
    });
    $("[id$='divRemoveRecord']").hide();
    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            StopProgress();
            return true;
        }
        else {
            return false
        }
    });
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
function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno, Action) {

    if (subprocess.toUpperCase() == "RESERVATIONBOOKING") {
        //InstantiateControl(cntrlid);
        cfi.ValidateSection(cntrlid);
        //SAVE SECTION
        $("#btnSave").unbind("click").bind("click", function () {
            cfi.ValidateSubmitSection();
            if (cfi.IsValidSection(cntrlid)) {
                if (true) {
                    //if (SaveFormData(subprocess)) {
                    //    //ShipmentSearch();
                    //    ReloadSameGridPage(subprocess);
                    //}

                }
            }
            else {
                return false
            }
        });
        if (Action == "UPDATE") {
            UserSubProcessRights("ApplicationTabs", 2391);
            PagerightsCheckReservation(2391)
        }
        else if (Action == "EXECUTE") {
            UserSubProcessRights("ApplicationTabs", 2500);
            PagerightsCheckReservation(2500)

        } else if (Action == "COPY") {
            UserSubProcessRights("ApplicationTabs", 5356);
            $("#btnAWBLabel").css("display", "none");
            $("#btnAWBPrint").css("display", "none");
            $("#btnUpdate").css("display", "none");
            $("#btnCopyBooking").css("display", "none");
            $("#btnExecute").css("display", "none");
            $("#btnNew").css("display", "none");
            $("#ItineraryViewRoute").attr("style", "");
            $("#ItinerarySearch").attr("style", "");
            $("#btnClearItineraryRoute").attr("style", "");
            PagerightsCheckReservation(5356)
        }
    }
    else if (subprocess.toUpperCase() == "EDOXRESERVATIONBOOKING") {
        InstantiateControl(cntrlid);
        $("#btnSave").css("display", "block");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#btnNew").css("display", "none");
        //$("#divXRAY").show();
        $("#spnShowSlacDetails").html("All Docs Received")
        BindEDox();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveEDoxList()) {
                    ShipmentSearch();
                    CleanUI();
                }
            }
        });
        UserSubProcessRights("divEDox", 2513);
        PagerightsCheckReservation(0)
    }
    //$("#DownloadExcel").show();
    $("#btnSearch").show();
    $("#btnCancel").show();



}

function CopyBooking() {
    cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
    AWBStatusDetails = "";
    FormDataBind('COPY', 'RESERVATIONBOOKING');
}

function ISSecondLegORNot(Origin, Destination) {
    var resultreturn = false;
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/ISSecondLegORNot",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ItineraryOrigin: Origin,
            ItineraryDestination: Destination
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].ItineraryOriginSNo != AWBOriginCitySNo) {
                        resultreturn = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resultreturn;
}
function CheckDimensionOnSaveAndUpdate() {
    var resultreturn = false;
    var Message = "";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var DimensionPieces = 0;
    var DimensionVolumeWeight = 0;
    var DimensionCBM = 0;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckDimensionOnExecution",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ReservationBookingRefNo: $('#hdnBookingMasterRefNo').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Pieces != AWBPieces && myData.Table0[0].Pieces != '') {
                        ShowMessage('warning', 'Information!', "AWB Pieces do not match with those mentioned in Dimensions. Kindly correct to proceed.");
                        resultreturn = false;
                    }
                    else
                        resultreturn = true;
                }
                else
                    resultreturn = true;
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resultreturn;
}
function CheckULDDimensionOnSaveAndUpdate() {
    var resultreturn = false;
    var Message = "";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    var BUPORIntactAWBPieces = 0;
    if (BUPPieces > 0) {
        BUPORIntactPieces = BUPPieces;
        BUPORIntactAWBPieces = AWBPieces;
    }
    else if (AWBNoofBUPIntact > 0) {
        BUPORIntactPieces = AWBNoofBUPIntact;
        BUPORIntactAWBPieces = (parseInt(AWBPieces) - parseInt(AWBNoofBUPIntact));
    }


    var DimensionPieces = 0;
    var DimensionVolumeWeight = 0;
    var DimensionCBM = 0;
    var TotalULDCount = 0;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckULDDimensionOnExecution",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ReservationBookingRefNo: $('#hdnBookingMasterRefNo').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].TotalCount > BUPORIntactPieces) {
                        ShowMessage('warning', 'Information!', "Total No of ULD Dimension can not be grater than BUP Pieces.");
                        resultreturn = false;
                    }
                    else
                        resultreturn = true;
                }
                else
                    resultreturn = true;
                if (myData.Table1.length > 0) {
                    if (myData.Table1[0].Pieces > BUPORIntactAWBPieces) {
                        ShowMessage('warning', 'Information!', "AWB Pieces do not match with those mentioned in Dimensions. Kindly correct to proceed.");
                        resultreturn = false;
                    }
                    else
                        resultreturn = true;
                }
                else
                    resultreturn = true;
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resultreturn;
}
function CheckDimensionOnExecution() {
    var resultreturn = false;
    var Message = "";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var DimensionPieces = 0;
    var DimensionVolumeWeight = 0;
    var DimensionCBM = 0;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckDimensionOnExecution",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ReservationBookingRefNo: $('#hdnBookingMasterRefNo').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Pieces != "" && myData.Table0[0].VolumeWeight != "" && myData.Table0[0].Volume != "") {
                        DimensionPieces = parseFloat(myData.Table0[0].Pieces);
                        DimensionVolumeWeight = parseFloat(myData.Table0[0].VolumeWeight);
                        DimensionCBM = parseFloat(myData.Table0[0].Volume);
                    }
                    else {
                        ShowMessage('warning', 'Information!', "Enter Dimension of all pieces.");
                        Message = "1";
                        return false;
                    }
                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Dimension of all pieces.");
                    Message = "1";
                    return false;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    if (Message == "") {
        if (AWBPieces != DimensionPieces) {
            ShowMessage('warning', 'Information!', "AWB Pieces do not match with those mentioned in Dimensions. Kindly correct to proceed.");
        }
        else if (AWBVolumeWeight != DimensionVolumeWeight) {
            ShowMessage('warning', 'Information!', "Shipment Volume Weight and Dimension Volume Weight are Different.");
        }
        else if (AWBCBM != DimensionCBM) {
            ShowMessage('warning', 'Information!', "Shipment Volume and Dimension Volume are Different.");
        }
        else {
            resultreturn = true;
        }
    }

    return resultreturn;
}
function CheckULDDimensionOnExecution() {
    var resultreturn = false;
    var Message = "";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    if (BUPPieces > 0)
        BUPORIntactPieces = BUPPieces;
    else if (AWBNoofBUPIntact > 0)
        BUPORIntactPieces = AWBNoofBUPIntact;


    var DimensionPieces = 0;
    var DimensionVolumeWeight = 0;
    var DimensionCBM = 0;
    var TotalULDCount = 0;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckULDDimensionOnExecution",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ReservationBookingRefNo: $('#hdnBookingMasterRefNo').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {

                    TotalULDCount = myData.Table0[0].TotalCount;

                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Total No of ULD Dimension in Execution.");
                    Message = "1";
                    return false;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    if (Message == "") {

        if (TotalULDCount != BUPORIntactPieces)
            ShowMessage('warning', 'Information!', "Enter Total No of ULD Dimension in Execution.");
        else {
            resultreturn = true;
        }
    }

    return resultreturn;
}
function GETProductASPerBookingType(BookingTypeVal, LoginTypeVal) {
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GETProductASPerBookingType",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingType: BookingTypeVal,
            LoginType: LoginTypeVal
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SNo != "") {
                        if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
                            if (BookingTypeVal == "1") {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(false)
                            }
                            else {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(false)
                            }
                        }
                        else {
                            if (BookingTypeVal == "1") {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(false)
                            }
                            else {
                                $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                                $("#Text_Product").data("kendoAutoComplete").enable(true)
                            }
                        }
                    }
                    else {
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_Product").data("kendoAutoComplete").enable(true)
                    }
                }
                else {
                    $("#Text_Product").data("kendoAutoComplete").setDefaultValue("", "");
                    $("#Text_Product").data("kendoAutoComplete").enable(true)
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function ApplyRequired() {
    $("#SHIPPER_Name").attr("data-valid", "required");
    $('#SHIPPER_Name').attr('data-valid-msg', 'Enter Shipper Name.');
    $("#SHIPPER_Street").attr("data-valid", "required");
    $('#SHIPPER_Street').attr('data-valid-msg', 'Enter Shipper Street.');
    $("#SHIPPER_TownLocation").attr("data-valid", "required");
    $('#SHIPPER_TownLocation').attr('data-valid-msg', 'Enter Shipper Town/Location.');
    $("#Text_SHIPPER_City").attr("data-valid", "required");
    $('#Text_SHIPPER_City').attr('data-valid-msg', 'Select Shipper City.');
    $("#Text_SHIPPER_CountryCode").attr("data-valid", "required");
    $('#Text_SHIPPER_CountryCode').attr('data-valid-msg', 'Select Shipper Country.');

    $("#CONSIGNEE_AccountNoName").attr("data-valid", "required");
    $('#CONSIGNEE_AccountNoName').attr('data-valid-msg', 'Enter Consignee Name.');
    $("#CONSIGNEE_Street").attr("data-valid", "required");
    $('#CONSIGNEE_Street').attr('data-valid-msg', 'Enter Consignee Street.');
    $("#CONSIGNEE_TownLocation").attr("data-valid", "required");
    $('#CONSIGNEE_TownLocation').attr('data-valid-msg', 'Enter Consignee Town/Location.');
    $("#Text_CONSIGNEE_City").attr("data-valid", "required");
    $('#Text_CONSIGNEE_City').attr('data-valid-msg', 'Select Consignee City.');
    $("#Text_CONSIGNEE_CountryCode").attr("data-valid", "required");
    $('#Text_CONSIGNEE_CountryCode').attr('data-valid-msg', 'Select Consignee Country.');

    $("#NatureOfGoods").attr("data-valid", "required");
    $('#NatureOfGoods').attr('data-valid-msg', 'Enter NOG.');
    //added by akhtar-tfs-13281
    if (userContext.SysSetting.IsRequiredEmailandContactOnBooking == 'True') {
        $("#SHIPPER_Email").attr("data-valid", "email,required");
        $('#SHIPPER_Email').attr('data-valid-msg', 'Enter valid Email Address.');
        $("#SHIPPER_MobileNo").attr("data-valid", "required");
        $('#SHIPPER_MobileNo').attr('data-valid-msg', 'Enter Shipper Contact No.');

        $("#CONSIGNEE_Email").attr("data-valid", "email,required");
        $('#CONSIGNEE_Email').attr('data-valid-msg', 'Enter valid Email Address.');
        $("#CONSIGNEE_MobileNo").attr("data-valid", "required");
        $('#CONSIGNEE_MobileNo').attr('data-valid-msg', 'Enter Consignee Contact No.');
    }
}
function CheckAndValidateData() {
    var CheckAndValidateDataArray = [];
    var result = false;
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var IsRoutingComplete = $("#chkIsRoutingComplete").prop("checked") ? "1" : "0";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
        var CheckAndValidateDataArrayItems = {
            Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
            Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
            Pieces: $(tr).find("td")[3].innerText.trim(),
            GrossWeight: $(tr).find("td")[4].innerText.trim(),
            CBM: $(tr).find("td")[5].innerText.trim(),
            AWBOriginCitySNo: $(tr).find("input[id^='hdnOriginCitySNo_']").val(),
            AWBDestinationCitySNo: $(tr).find("input[id^='hdnDestinationCitySNo_']").val()
        };
        CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
    });

    if (CheckAndValidateDataArray.length > 0) {
        for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
            var ItemAWBPieces = 0;
            var ItemAWBGrossWeight = 0.00;
            var ItemCBM = 0.000;
            $.map(CheckAndValidateDataArray, function (item) {
                if (item.Origin == CheckAndValidateDataArray[i].Origin) {
                    ItemAWBPieces = parseInt(ItemAWBPieces) + parseInt(item.Pieces);

                    ItemAWBGrossWeight = parseFloat(ItemAWBGrossWeight) + parseFloat(item.GrossWeight) || 0.00;
                    ItemCBM = parseFloat(ItemCBM) + parseFloat(item.CBM) || 0.000;
                }
            });
            if (AWBOriginCitySNo == CheckAndValidateDataArray[i].AWBOriginCitySNo)
                IsmatchAWBOriginCity = true;
            if (AWBDestinationCitySNo == CheckAndValidateDataArray[i].AWBDestinationCitySNo)
                IsmatchAWBDestinationCity = true;
            //if (ItemAWBPieces == AWBPieces && ItemAWBGrossWeight == AWBGrossWeight && ItemCBM == AWBCBM)
            if (ItemAWBPieces == AWBPieces)
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Pieces does not match to Itinerary Pieces, Please delete Itinerary and Search.");
                return false;
            }
            //if (parseFloat(ItemAWBGrossWeight).toFixed(2) == AWBGrossWeight)
            if (parseFloat(ItemAWBGrossWeight).toFixed(2) == parseFloat(AWBGrossWeight).toFixed(2))
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Itinerary Gross Weight does not match with AWB Gross Weight. Kindly make corrections to proceed further.");
                return false;
            }
            if (parseFloat(ItemCBM).toFixed(3) == AWBCBM)
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Itinerary Volume does not match with AWB Volume. Kindly make corrections to proceed further.");
                return false;
            }
        }
    }
    else {
        result = false;
        ShowMessage('warning', 'Information!', "Please Select Itinerary information.");
        return false;
    }

    if (IsRoutingComplete == 0) {
        if (IsmatchAWBOriginCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Incomplete itinerary for the selected Route. Kindly complete route to proceed.");
            return false;
        }
        if (IsmatchAWBDestinationCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Incomplete itinerary for the selected Route. Kindly complete route to proceed.");
            return false;
        }
    }
    else {
        if (IsmatchAWBOriginCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Incomplete itinerary for the selected Route. Kindly complete route to proceed.");
            return false;
        }
    }
    return result;
}
function BackToReservation() {
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(0);
}
function DimensionTab(id) {

    var ResultofChkBUP = true;
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    $('#tdlblNoofBups').attr("style", "display:none;");
    $("#lblDimensionTotalPieces").text($("#AWBPieces").val());
    $("#lblDimensionGrossWeight").text($("#AWBGrossWeight").val());
    $("#lblDimensionVolumeWeight").text($("#AWBVolumeWeight").val());

    if ($("#chkIsBUP").prop('checked') == true) {
        if (BUPPieces > 0)
            BUPORIntactPieces = BUPPieces;
        else if (AWBNoofBUPIntact > 0)
            BUPORIntactPieces = AWBNoofBUPIntact;
        $("#lblNoofBups").text(BUPORIntactPieces);
        if (BUPORIntactPieces == $("#AWBPieces").val()) {
            ResultofChkBUP = false;
            if (BUPPieces > 0) {
                if (BUPPieces == $("#AWBPieces").val())
                    ResultofChkBUP = true;
            }
        }
    }

    if (kendo.parseFloat($("#AWBPieces").val()) > 0 && kendo.parseFloat($("#AWBGrossWeight").val()) > 0) {

        var table111 = document.getElementById("tblDimensionTab");
        if (table111 != null && table111.rows.length > 0) {
            table111.innerHTML = "";
        }
        var table222 = document.getElementById("tblDimensionULDTab");
        if (table222 != null && table222.rows.length > 0) {
            table222.innerHTML = "";
        }
        if (ResultofChkBUP == true) {
            //if ($("#chkIsBUP").prop('checked') != true) {
            var dbTableName = 'DimensionTab';
            var pageType = 'View';
            if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
                pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
            else {
                if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
                else
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
            }
            // var flag =  '1'
            $('#tbl' + dbTableName).appendGrid({
                tableID: 'tbl' + dbTableName,
                //contentEditable: Viewflag == "0" ? false : true,//pageType != 'View',
                contentEditable: pageType == 'View' ? false : Viewflag == "0" ? false : true,
                //  contentEditable: pageType != 'View',
                tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
                servicePath: 'Services/Shipment/ReservationBookingService.svc',

                getRecordServiceMethod: 'Get' + dbTableName + 'Record',
                createUpdateServiceMethod: 'createUpdate' + dbTableName,
                deleteServiceMethod: 'delete' + dbTableName,
                caption: '',
                initRows: 1,
                isGetRecord: true,
                columns: [
                    { name: 'SNo', type: 'hidden', value: 0 },
                    { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
                    { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
                    { name: 'Length', display: 'Length', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Width', display: 'Width', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Height', display: 'Height', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Pieces', display: 'Pieces', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionPieces(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },
                    { name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },

                    { name: pageType == 'View' ? 'CMS' : 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlOptions: { 0: 'Inc', 1: 'Cm' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
                    { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
                    { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                ],
                beforeRowRemove: function (caller, rowIndex) {
                    CheckDimensionTabRowdata(rowIndex);
                },
                OnUpdateSuccess: function () {
                    //SetAndCalculateVolumeWeightAndCBM();
                    SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionTab');

                },
                isPaging: false,
                hideButtons: { updateAll: false, insert: false, removeLast: true, append: true },
                i18n: { customValidationMessage: "Kindly enter respective dimensions." },
                dataLoaded: function () {
                    setTimeout(function () {
                        if ($("#_temptbl" + dbTableName + "_Length_1")) {
                            $("#_temptbl" + dbTableName + "_Length_1").focus();
                            $("#tblDimensionTab_btnUpdateText").detach().appendTo($("#tblDimensionTab tfoot tr td:eq(0)"));
                        }
                    }, 500);
                },
                customFooterButtons: [
                    {
                        uiButton: { label: 'Update & Back to Reservation', text: true }, btnAttr: { title: 'Update & Back to Reservation', tabindex: '', id: 'tblDimensionTab_btnUpdateText' }, click: function (evt) {
                            if (validateTableData('tbl' + dbTableName, [], $('#tbl' + dbTableName).data('appendGrid'))) {
                                $("#tblDimensionTab_btnUpdateAll").trigger("click");
                                setTimeout(function () { BackToReservation(); }, 1000);
                                setTimeout(function () { $("#Text_Commodity").focus(); $("#Text_Priority").focus(); }, 1500);
                            }
                        }, atTheFront: true
                    },
                ],
            });
            //}
        }

        if ($("#chkIsBUP").prop('checked') == true) {
            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
            $('#tdlblNoofBups').attr("style", "display:block;");
            var dbTableName1 = 'DimensionULDTab';
            var pageType = 'View';
            if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
                pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
            else {
                if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
                else
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
            }
            //cfi.ValidateForm();
            if (BUPPieces > 0) {
                $('#tbl' + dbTableName1).appendGrid({
                    tableID: 'tbl' + dbTableName1,
                    contentEditable: pageType != 'View',
                    tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                    masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                    currentPage: 1, itemsPerPage: 20, whereCondition: null, sort: '',
                    servicePath: 'Services/Shipment/ReservationBookingService.svc',
                    getRecordServiceMethod: 'Get' + dbTableName1 + 'Record',
                    createUpdateServiceMethod: 'createUpdate' + dbTableName1,
                    deleteServiceMethod: 'delete' + dbTableName1,
                    caption: 'ULD Information',
                    initRows: 1,
                    isGetRecord: true,
                    columns: [



                        { name: 'SNo', type: 'hidden', value: 0 },
                        { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
                        { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },

                        { name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, AutoCompleteName: 'Reservation_ULDType', filterField: 'ULDName' },
                        { name: 'ULDNo', display: 'ULD No', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric' }, ctrlCss: { width: '90px' }, onClick: function (evt, rowIndex) { SetNumeric(evt.target.id); }, minlength: 4 },
                        { name: 'OwnerCode', display: 'OW', type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 2, controltype: 'alphanumericupper' }, ctrlCss: { width: '90px' } },
                        { name: 'SLAC', display: 'SLAC', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDSlac(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Length', display: 'Length', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Width', display: 'Width', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Height', display: 'Height', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Pieces', display: 'Pieces', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDPieces(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },

                        { name: pageType == 'View' ? 'CMS' : 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlAttr: { disabled: true }, ctrlOptions: { 0: 'Inc', 1: 'Cm' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
                        { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
                        { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                    ],
                    customFooterButtons: [
                        { uiButton: { label: 'Update All', text: true }, btnAttr: { title: 'Update All' }, click: function (evt) { SaveULDDimensionData(this) }, atTheFront: true },
                    ],
                    beforeRowRemove: function (caller, rowIndex) {
                        CheckDimensionULDTabRowdata(rowIndex);
                    },
                    OnUpdateSuccess: function () {
                        //ULDDimensionSetAndCalculateVolumeWeightAndCBM();
                        SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionULDTab');
                    },
                    afterRowRemoved: function (caller, rowIndex) {
                        //CheckDimensionULDTabRowdata(rowIndex);
                    },
                    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                        //if ($("#Text_Destination").text() == $('#ViaRoute').val()) {
                        //    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                        //    $('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).prop('disabled', 'disabled');

                        //}

                        DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex)
                    },
                    beforeRowAppend: function (caller, parentRowIndex, addedRowIndex) {
                        var GroupBy = {};
                        var CheckAndValidateDataArray = [];
                        var res = true;
                        $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                            var CheckAndValidateDataArrayItems = {
                                ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                                ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                                OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                                SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val()
                            };
                            CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
                        });



                        if (CheckAndValidateDataArray.length > 0) {
                            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
                            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
                            var BUPORIntactPieces = 0;
                            if (BUPPieces > 0)
                                BUPORIntactPieces = BUPPieces;
                            else if (AWBNoofBUPIntact > 0)
                                BUPORIntactPieces = AWBNoofBUPIntact;

                            if (CheckAndValidateDataArray.length >= parseInt(BUPORIntactPieces))
                                res = false;
                        }

                        return res;
                    },
                    isPaging: false,
                    hideButtons: { updateAll: true, insert: true, removeLast: true }
                });
            }
            else if (AWBNoofBUPIntact > 0) {
                $('#tbl' + dbTableName1).appendGrid({
                    tableID: 'tbl' + dbTableName1,
                    contentEditable: pageType != 'View',
                    tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                    masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                    currentPage: 1, itemsPerPage: 20, whereCondition: null, sort: '',
                    servicePath: 'Services/Shipment/ReservationBookingService.svc',
                    getRecordServiceMethod: 'Get' + dbTableName1 + 'Record',
                    createUpdateServiceMethod: 'createUpdate' + dbTableName1,
                    deleteServiceMethod: 'delete' + dbTableName1,
                    caption: 'ULD Information',
                    initRows: 1,
                    isGetRecord: true,
                    columns: [
                        { name: 'SNo', type: 'hidden', value: 0 },
                        { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
                        { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },

                        { name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, AutoCompleteName: 'Reservation_ULDType', filterField: 'ULDName' },
                        { name: 'ULDNo', display: 'ULD No', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric' }, ctrlCss: { width: '90px' }, isRequired: true, onClick: function (evt, rowIndex) { SetNumeric(evt.target.id); }, minlength: 4 },
                        { name: 'OwnerCode', display: 'OW', type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 2, controltype: 'alphanumericupper' }, isRequired: true, ctrlCss: { width: '90px' } },
                        { name: 'SLAC', display: 'SLAC', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDSlac(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Length', display: 'Length', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Width', display: 'Width', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Height', display: 'Height', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Pieces', display: 'Pieces', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDPieces(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },
                        { name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },

                        { name: pageType == 'View' ? 'CMS' : 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlAttr: { disabled: true }, ctrlOptions: { 0: 'Inc', 1: 'Cm' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
                        { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
                        { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                    ],
                    customFooterButtons: [
                        { uiButton: { label: 'Update All', text: true }, btnAttr: { title: 'Update All' }, click: function (evt) { SaveULDDimensionData(this) }, atTheFront: true },
                    ],
                    beforeRowRemove: function (caller, rowIndex) {
                        CheckDimensionULDTabRowdata(rowIndex);
                    },
                    OnUpdateSuccess: function () {
                        SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionULDTab');
                    },
                    afterRowRemoved: function (caller, rowIndex) {
                        //CheckDimensionULDTabRowdata(rowIndex);
                    },
                    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                        DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex)
                    },
                    beforeRowAppend: function (caller, parentRowIndex, addedRowIndex) {
                        var GroupBy = {};
                        var CheckAndValidateDataArray = [];
                        var res = true;
                        $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                            var CheckAndValidateDataArrayItems = {
                                ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                                ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                                OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                                SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val()
                            };
                            CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
                        });

                        if (CheckAndValidateDataArray.length > 0) {
                            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
                            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
                            var BUPORIntactPieces = 0;
                            if (BUPPieces > 0)
                                BUPORIntactPieces = BUPPieces;
                            else if (AWBNoofBUPIntact > 0)
                                BUPORIntactPieces = AWBNoofBUPIntact;

                            if (CheckAndValidateDataArray.length >= parseInt(BUPORIntactPieces))
                                res = false;
                        }

                        return res;
                    },
                    isPaging: false,
                    hideButtons: { updateAll: true, insert: true, removeLast: true }
                });
            }
            else
                $('#tblDimensionULDTab').empty()
        }
        else {
            $('#tblDimensionULDTab').empty()
        }
        if (id == "AddDimension") {
            $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(1);
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW") {
            var Dimensionrows = 0;
            var DimensionULDrows = 0;
            $("tr[id^='tblDimensionTab_Row']").each(function (row, tr) {
                Dimensionrows = tr.id.split('_')[2];
            });
            $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                DimensionULDrows = tr.id.split('_')[2];
            });
            if (Dimensionrows == 0) {
                //if ($("#chkIsBUP").prop('checked') != true) {
                $('#tblDimensionTab').appendGrid('insertRow', 1, 0);
                GetAwbDetails(1, 0, 0, "tblDimensionTab", 1);
                //}
            }
            if (DimensionULDrows == 0) {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $('#tblDimensionULDTab').appendGrid('insertRow', 1, 0);
                    GetAwbDetails(1, 0, 0, "tblDimensionULDTab", 1);
                }
            }

        }
    }
    else {
        ShowMessage('warning', 'Information!', "Enter Pieces and Gross Weight to add Dimension.");
        return;
    }
    PagerightsCheckReservation(0)
}
function SaveULDDimensionData(obj) {
    var rows = $("tr[id^='tblDimensionULDTab']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblDimensionULDTab");
    var ValidData = $('#tblDimensionULDTab').appendGrid('getStringJson');
    if (ValidData != "[]" && ValidData != false) {
        var res = false;
        var CheckAndValidateDataArray = [];

        $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
            var CheckAndValidateDataArrayItems = {
                ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val(),
                Length: $(tr).find("input[id^='tblDimensionULDTab_Length_']").val(),
                Width: $(tr).find("input[id^='tblDimensionULDTab_Width_']").val(),
                Height: $(tr).find("input[id^='tblDimensionULDTab_Height_']").val(),
                Pieces: $(tr).find("input[id^='tblDimensionULDTab_Pieces_']").val(),
                VolumeWeight: $(tr).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val(),
                Volume: $(tr).find("input[id^='tblDimensionULDTab_Volume_']").val(),
            };
            CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
        });

        if (CheckAndValidateDataArray.length > 0) {
            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
            var BUPORIntactPieces = 0;
            if (BUPPieces > 0)
                BUPORIntactPieces = BUPPieces;
            else if (AWBNoofBUPIntact > 0)
                BUPORIntactPieces = AWBNoofBUPIntact;
            if (CheckAndValidateDataArray.length == parseInt(BUPORIntactPieces))
                res = true;
        }

        if (res == true) {
            $.ajax({
                //url: "./Services/Shipment/ReservationBookingService.svc/createUpdateDimensionULDTab?strData=" + ValidData,
                url: "./Services/Shipment/ReservationBookingService.svc/createUpdateDimensionULDTab",
                async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ strData: btoa(ValidData) }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data == '<value>ULD Added Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Added Successfully.');
                        DimensionTab("AddDimension");
                    }
                    else if (data == '<value>ULD Updated Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Updated Successfully.');
                        DimensionTab("AddDimension");
                    }
                    else if (data == '<value>ULD Deleted Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Deleted Successfully.');
                        DimensionTab("AddDimension");
                    }
                    else {
                        ShowMessage('warning', 'Warning.', null);
                    }
                }
            });
        }
        else {
            ShowMessage('warning', 'Information!', "Enter Total No of BUP.");
            return;
        }

    }
    else {
        return false;
    }
}
function SetNumeric(obj, event) {
    var Piece_ID = obj;
    $('input[type="text"][id="' + Piece_ID + '"]').keypress(function (event) {
        var $this = $(this);
        if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
            ((event.which < 48 || event.which > 57) &&
                (event.which != 0 && event.which != 8))) {
            event.preventDefault();
        }

        var text = $(this).val();
        if ((event.which == 46) && (text.indexOf('.') == -1)) {
            setTimeout(function () {
                if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                    $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                }
            }, 1);
        }

        if ((text.indexOf('.') != -1) &&
            (text.substring(text.indexOf('.')).length > 2) &&
            (event.which != 0 && event.which != 8) &&
            ($(this)[0].selectionStart >= text.length - 2)) {
            event.preventDefault();
        }
    });
}
function GetroundValue(numbervalue, precision) {
    var multiplier = Math.pow(10, precision || 0);
    if (userContext.SysSetting.IsRoundValue == "1") {
        if (parseFloat(numbervalue) > 0 && parseFloat(numbervalue) < 1)
            return 1;
        else
            return Math.round(parseFloat(parseFloat(numbervalue).toFixed(0)) * multiplier) / multiplier;
    }
    else {
        var Decimalnumbervalue = numbervalue.toString().split('.')[1] || 0;
        var Returnnumbervalue = "";
        Decimalnumbervalue = '.' + Decimalnumbervalue;
        if (parseFloat(Decimalnumbervalue) > .5)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 1
        else if (parseFloat(Decimalnumbervalue) == .0)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 0
        else
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + .5


        return Math.round(parseFloat(Returnnumbervalue) * multiplier) / multiplier;
    }
}
function CalculatedVolumeCBM(id) {
    var VolumeCBM = 0;
    var DummyVolumeWeight = 0;
    var VolumeWeight = 0;
    var TableNamerowIndex = id.split('_')[0];
    var rowIndex = id.split('_')[2];
    var IsCMS = $('input:radio[name=' + TableNamerowIndex + '_RbtnIsCMS_' + rowIndex + ']:checked').val();
    var Pieces = parseInt(($('#' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0));
    var Length = parseInt(($('#' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0));
    var Width = parseInt(($('#' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0));
    var Height = parseInt(($('#' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0));
    if (IsCMS == 1) {
        //VolumeCBM = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor).toFixed(3)
        //VolumeWeight = (VolumeCBM * 166.66).toFixed(2)
        DummyVolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor)
        //VolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor).toFixed(0)        //Decimal By Tarun
        VolumeWeight = GetroundValue(((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor), 1)
        VolumeCBM = (((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor) / 166.66).toFixed(3)
        if (VolumeCBM == '0.000')
            VolumeCBM = 0.001
        //VolumeWeight = (VolumeCBM * 166.66).toFixed(2)
    }
    else {
        //VolumeCBM = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor).toFixed(3)
        //VolumeWeight = ((VolumeCBM * 135.3147) / 12).toFixed(2)
        DummyVolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor)
        //VolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor).toFixed(0)       //Decimal By Tarun
        VolumeWeight = GetroundValue(((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor), 1)
        VolumeCBM = (((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor) / 166.66).toFixed(3)
        if (VolumeCBM == '0.000')
            VolumeCBM = 0.001
        //VolumeWeight = (VolumeCBM * 166.66).toFixed(2)
    }
    //if (DummyVolumeWeight > 0 && DummyVolumeWeight < 1)    //Decimal By Tarun
    //    VolumeWeight = 1;
    $('#_temp' + TableNamerowIndex + '_VolumeWeight_' + rowIndex).val(VolumeWeight);
    $('#' + TableNamerowIndex + '_VolumeWeight_' + rowIndex).val(VolumeWeight);
    $('#_temp' + TableNamerowIndex + '_Volume_' + rowIndex).val(VolumeCBM);
    $('#' + TableNamerowIndex + '_Volume_' + rowIndex).val(VolumeCBM);

    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    //if (TableNamerowIndex == "tblDimensionULDTab") {
    $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
            CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
        if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
            CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
    });
    //}
    //else {
    $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
            CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
        if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
            CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
    });
    //}
    //$("#lblDimensionVolumeWeight").text(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
    $("#lblDimensionVolumeWeight").text(GetroundValue(CalculateVolumeWeight, 1));
}
function SetAndCalculateVolumeWeightAndCBMNEW(id) {
    if (id == 'tblDimensionTab') {
        var CalculateVolumeWeight = 0;
        var CalculateCBM = 0;
        $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
            if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
                CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
            if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
                CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
        });

        var OtherTable = document.getElementById("tblDimensionULDTab");
        if (OtherTable != null && OtherTable.rows.length > 2) {
            $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
                if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
                    CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
                if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
                    CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
            });
        }

        //$("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#AWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempAWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#AWBCBM").val(CalculateCBM.toFixed(3));
        $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
        $("#AWBCBM").attr('disabled', true);
        $("#_tempAWBCBM").attr('disabled', true);

        $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        //$("#ItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#ItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));

        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
        thedivFlightSearchResult.innerHTML = "";

        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
        var volwt = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

        var chwt = grosswt > volwt ? GetroundValue(grosswt, 1) : GetroundValue(volwt, 1);

        $("#AWBChargeableWeight").val(chwt);
        $("#_tempAWBChargeableWeight").val(chwt);
        //CalculateShipmentChWt('');
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                    Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });

            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    RowCount = 0;
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[5].innerText = CalculateCBM.toFixed(3);
                    $(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val(volwt);
                });
            }
        }
    }
    else if (id == 'tblDimensionULDTab') {
        var CalculateVolumeWeight = 0;
        var CalculateCBM = 0;
        $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
            if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
                CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
            if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
                CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
        });

        var OtherTable = document.getElementById("tblDimensionTab");
        if (OtherTable != null && OtherTable.rows.length > 1) {
            $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
                if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
                    CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
                if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
                    CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
            });
        }

        //$("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#AWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempAWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#AWBCBM").val(CalculateCBM.toFixed(3));
        $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
        $("#AWBCBM").attr('disabled', true);
        $("#_tempAWBCBM").attr('disabled', true);

        $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        //$("#ItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#ItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));

        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
        var volwt = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

        var chwt = grosswt > volwt ? GetroundValue(grosswt, 1) : GetroundValue(volwt, 1);
        $("#AWBChargeableWeight").val(chwt);
        $("#_tempAWBChargeableWeight").val(chwt);
        //CalculateShipmentChWt('');
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                    Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });

            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[5].innerText = CalculateCBM.toFixed(3);
                    $(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val(volwt);
                });
            }
        }
    }
    else if (id == 'GrossWeight') {
        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                    Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });
            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    RowCount = 0;
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[4].innerText = grosswt;
                });
            }
        }
    }
    else if (id == 'Pieces') {
        var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
        var result = false;
        var RowCount = 0;
        var SetAndCalculatePiecesArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculatePiecesArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                    Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
                };
                SetAndCalculatePiecesArray.push(SetAndCalculatePiecesArrayItems);
            });
            if (SetAndCalculatePiecesArray.length > 0) {
                for (var i = 0; i < SetAndCalculatePiecesArray.length; i++) {
                    RowCount = 0;
                    $.map(SetAndCalculatePiecesArray, function (item) {
                        if (item.Origin == SetAndCalculatePiecesArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[3].innerText = Pieces;
                });
            }
        }
    }

}
function ULDDimensionSetAndCalculateVolumeWeightAndCBM() {
    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val())
        CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val())
    });
    $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#AWBCBM").val(CalculateCBM.toFixed(3));
    $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

    $("#AWBVolumeWeight").attr('disabled', true);
    $("#_tempAWBVolumeWeight").attr('disabled', true);
    $("#AWBCBM").attr('disabled', true);
    $("#_tempAWBCBM").attr('disabled', true);

    $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
    $("#AWBChargeableWeight").val(chwt);
    $("#_tempAWBChargeableWeight").val(chwt);
    //CalculateShipmentChWt('');
    var result = false;
    var RowCount = 0;
    var SetAndCalculateVolumeArray = [];
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            var SetAndCalculateVolumeArrayItems = {
                Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
            };
            SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
        });

        if (SetAndCalculateVolumeArray.length > 0) {
            for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                $.map(SetAndCalculateVolumeArray, function (item) {
                    if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                        RowCount = parseInt(RowCount) + parseInt(1);
                    }
                });
                if (RowCount > 1) {
                    result = false;
                    return false;
                }
                else {
                    result = true;
                }
            }
        }
        if (result = true) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("td")[5].innerText = CalculateCBM;
            });
        }
    }

}
function SetAndCalculateVolumeWeightAndCBM() {
    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val())
        CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val())
    });
    $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#AWBCBM").val(CalculateCBM.toFixed(3));
    $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

    $("#AWBVolumeWeight").attr('disabled', true);
    $("#_tempAWBVolumeWeight").attr('disabled', true);
    $("#AWBCBM").attr('disabled', true);
    $("#_tempAWBCBM").attr('disabled', true);

    $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
    $("#AWBChargeableWeight").val(chwt);
    $("#_tempAWBChargeableWeight").val(chwt);
    //CalculateShipmentChWt('');
    var result = false;
    var RowCount = 0;
    var SetAndCalculateVolumeArray = [];
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            var SetAndCalculateVolumeArrayItems = {
                Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
            };
            SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
        });

        if (SetAndCalculateVolumeArray.length > 0) {
            for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                RowCount = 0;
                $.map(SetAndCalculateVolumeArray, function (item) {
                    if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                        RowCount = parseInt(RowCount) + parseInt(1);
                    }
                });
                if (RowCount > 1) {
                    result = false;
                    return false;
                }
                else {
                    result = true;
                }
            }
        }
        if (result = true) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("td")[5].innerText = CalculateCBM;
            });
        }
    }

}
function AddNewRowDimensionULDTab() {

    var row = 0;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        //totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];
    });
    $('#tblDimensionULDTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
    //$('#tblDimensionULDTab').appendGrid('insertRow', 1, 0);
    GetAwbDetails(1, 0, 0, "tblDimensionULDTab", 1);
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex) {
    var rows = 0;
    //var ULDTypeDataArray = [];
    var BUPPieces = parseInt(($("#AWBNoofBUP").val() || 0) == 0 ? ($("#_tempAWBNoofBUP").val() || 0) : ($("#AWBNoofBUP").val() || 0));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    if (BUPPieces > 0)
        BUPORIntactPieces = BUPPieces;
    else if (AWBNoofBUPIntact > 0)
        BUPORIntactPieces = AWBNoofBUPIntact;
    $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
        rows = tr.id.split('_')[2];


    });

    if (BUPORIntactPieces == 1)
        $('#tblDimensionULDTab_btnAppendRow').attr("style", "display:none;");


}
function CheckDimensionTabRowdata(rows) {
    var TotalAWBPieces = 0;
    if ($("#chkIsBUP").prop('checked') == true) {
        var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
        var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
        if (BUPPieces > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)));
        else if (AWBNoofBUPIntact > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(AWBNoofBUPIntact));


    }
    else
        TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var lastRowPieces = 0;
    var totalPieces = 0;
    var row = 0;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];
    });
    lastRowPieces = $('#tblDimensionTab_Pieces_' + row).val();
    $('#tblDimensionTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(TotalAWBPieces) - parseInt(totalPieces)));
    $('#_temptblDimensionTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(TotalAWBPieces) - parseInt(totalPieces)));
    if (row == 1)
        $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", false);
    if (row == 0) {
        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
        $("#AWBCBM").attr('disabled', true);
        $("#_tempAWBCBM").attr('disabled', true);
    }
    CalculatedVolumeCBM('tblDimensionTab_Pieces_' + row);
}
function CheckDimensionULDTabRowdata(rows) {
    CalculatedVolumeCBM('tblDimensionULDTab_Pieces_' + rows);
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rows).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rows).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rows).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rows).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rows).val();
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var lastRowPieces = 0;
    var totalPieces = 0;
    var row = 0;
    var TotalRow = 0;




    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo']").val() == HdnULDTypeSNo && $(this).find("input[id^='tblDimensionULDTab_ULDNo']").val() == ULDNo && $(this).find("input[id^='tblDimensionULDTab_OwnerCode']").val() == OwnerCode && $(this).find("input[id^='tblDimensionULDTab_SLAC']").val() == SLAC) {
            totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0));
            row = this.id.split('_')[2];
            TotalRow = parseInt(TotalRow) + parseInt(1);
        }
    });
    lastRowPieces = $('#tblDimensionULDTab_Pieces_' + row).val();
    $('#tblDimensionULDTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(SLAC) - parseInt(totalPieces)));
    $('#_temptblDimensionULDTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(SLAC) - parseInt(totalPieces)));
    if (TotalRow == 1) {
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(row)).data("kendoAutoComplete").enable(true)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(row)).removeAttr("disabled");
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(row)).removeAttr("disabled");
        $('#tblDimensionULDTab_SLAC_' + parseInt(row)).removeAttr("disabled");
        $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(row) + ']').attr("disabled", false);
    }
}
function CalculatedDimensionPieces(id) {
    //CalculatedVolumeCBM(id);
    var TotalAWBPieces = 0;
    if ($("#chkIsBUP").prop('checked') == true) {
        var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
        var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
        if (BUPPieces > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)));
        else if (AWBNoofBUPIntact > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(AWBNoofBUPIntact));


    }
    else
        TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var Pieces = $('#tblDimensionTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var row = 0;
    var lastRow = 0;
    var ValidateAllCondition = 1;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];

        var Pieces1 = $(this).find("input[id^='tblDimensionTab_Pieces_']").val() || 0;
        var Length1 = $(this).find("input[id^='tblDimensionTab_Length_']").val() || 0;
        var Width1 = $(this).find("input[id^='tblDimensionTab_Width_']").val() || 0;
        var Height1 = $(this).find("input[id^='tblDimensionTab_Height_']").val() || 0;
        if (Length1 == 0 || Width1 == 0 || Height1 == 0) {
            ValidateAllCondition = 0;
            return false;
        }
    });
    if (Pieces > 0) {
        if (TotalAWBPieces != totalPieces) {
            var CurrentPieces = 0;
            if (totalPieces > TotalAWBPieces) {
                CurrentPieces = parseInt(TotalAWBPieces) - (parseInt(totalPieces) - parseInt(Pieces))
                ShowMessage('warning', 'Information!', "Pieces cannot be greater than Total AWB Pieces.");
                $('#tblDimensionTab_Pieces_' + rowIndex).val(CurrentPieces);
                $('#_temptblDimensionTab_Pieces_' + rowIndex).val(CurrentPieces);
                CalculatedVolumeCBM(id);
                return;
            }
            else {
                CalculatedVolumeCBM(id);
                CurrentPieces = parseInt(TotalAWBPieces) - parseInt(totalPieces);
                if (Length > 0 && Width > 0 && Height > 0 && ValidateAllCondition == 1) {
                    $('#tblDimensionTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
                    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
                        lastRow = this.id.split('_')[2];
                    });
                    $("#_temptblDimensionTab_Length_" + lastRow).focus();
                    GetAwbDetails(parseInt(lastRow), parseInt(row), CurrentPieces, "tblDimensionTab", 0);
                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Length, Weight and Height for split Pieces.");
                    $('#tblDimensionTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    $('#_temptblDimensionTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    return;
                }
            }
        }
        else
            CalculatedVolumeCBM(id);
    }
    else {
        ShowMessage('warning', 'Information!', "Pieces must be greater than 0.");
        $('#tblDimensionTab_Pieces_' + rowIndex).val(parseInt(TotalAWBPieces) - parseInt(totalPieces));
        $('#_temptblDimensionTab_Pieces_' + rowIndex).val(parseInt(TotalAWBPieces) - parseInt(totalPieces));
        return;
    }

}
function CalculatedDimensionULDSlac(id) {
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rowIndex).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rowIndex).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rowIndex).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rowIndex).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rowIndex).val();
    var Pieces = $('#tblDimensionULDTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionULDTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionULDTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionULDTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var row = 0;
    if (kendo.parseFloat(HdnULDTypeSNo) > 0) {
        if (SLAC > 0) {
            $('#tblDimensionULDTab_Pieces_' + rowIndex).val(SLAC)
            $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(SLAC)
        }
    }
    else {
        $('#tblDimensionULDTab_SLAC_' + rowIndex).val('')
        $('#_temptblDimensionULDTab_SLAC_' + rowIndex).val('')
        ShowMessage('warning', 'Information!', "Enter ULD Type for SLAc.");
        return;
    }
}
function CalculatedDimensionULDPieces(id) {
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rowIndex).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rowIndex).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rowIndex).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rowIndex).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rowIndex).val();
    var Pieces = $('#tblDimensionULDTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionULDTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionULDTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionULDTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var totalSLAC = 0;
    var row = 0;
    var lastRow = 0;
    var TotalRow = 0;
    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo']").val() == HdnULDTypeSNo && $(this).find("input[id^='tblDimensionULDTab_ULDNo']").val() == ULDNo && $(this).find("input[id^='tblDimensionULDTab_OwnerCode']").val() == OwnerCode && $(this).find("input[id^='tblDimensionULDTab_SLAC']").val() == SLAC) {
            totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0));
            row = this.id.split('_')[2];
            TotalRow = parseInt(TotalRow) + parseInt(1);
        }
        lastRow = this.id.split('_')[2];
    });
    if (Pieces > 0 && SLAC > 0 && row > 0) {
        if (SLAC != totalPieces) {
            var CurrentPieces = 0;
            if (totalPieces > SLAC) {
                CurrentPieces = parseInt(SLAC) - (parseInt(totalPieces) - parseInt(Pieces))
                ShowMessage('warning', 'Information!', "Total Pieces Can not be greater than SLAC.");
                $('#tblDimensionULDTab_Pieces_' + rowIndex).val(CurrentPieces);
                $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(CurrentPieces);
                return;
            }
            else {
                CalculatedVolumeCBM(id);
                CurrentPieces = parseInt(SLAC) - parseInt(totalPieces);
                if (Length > 0 && Width > 0 && Height > 0) {
                    $('#tblDimensionULDTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
                    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
                        lastRow = this.id.split('_')[2];
                    });
                    BindULDOwner(parseInt(row), parseInt(lastRow), parseInt(TotalRow), "tblDimensionULDTab");
                    GetAwbDetails(parseInt(lastRow), parseInt(row), CurrentPieces, "tblDimensionULDTab", 0);


                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Length, Weight and Height for split Pieces.");
                    $('#tblDimensionULDTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    return;
                }
            }
        }
    }
    else {
        ShowMessage('warning', 'Information!', "Pieces must be greater than 0.");
        $('#tblDimensionULDTab_Pieces_' + rowIndex).val('');
        $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val('');
        return;
    }
}
function GetAwbDetails(Lastrow, PreviousRow, CurrentPieces, table, IsDeleted) {
    if (table == "tblDimensionTab") {
        var IsCMS = $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + PreviousRow + ']:checked').val();
        if (Lastrow > 1) {
            $('#_temptblDimensionTab_Pieces_' + Lastrow).val(CurrentPieces);
            $('#tblDimensionTab_Pieces_' + Lastrow).val(CurrentPieces);
            $('#_temptblDimensionTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            $('#tblDimensionTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            $('#_temptblDimensionTab_Volume_' + Lastrow).val($("#AWBCBM").val());
            $('#tblDimensionTab_Volume_' + Lastrow).val($("#AWBCBM").val());

            if (IsCMS == 1)
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']:eq(1)').attr("checked", 1);
            else
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']:eq(0)').attr("checked", 1);
            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                // $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']').attr("disabled", true);
                // $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", true);
            }
            else {
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']').attr("disabled", true);
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", true);
            }
        }
        else {
            $('#tblDimensionTab_Delete_1').attr("style", "display:none;");
            if ($("#chkIsBUP").prop('checked') == true) {
                var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
                var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
                var TotalAWBPieces = 0;
                if (BUPPieces > 0)
                    TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)));
                else if (AWBNoofBUPIntact > 0)
                    TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(AWBNoofBUPIntact));



                $('#_temptblDimensionTab_Pieces_1').val(TotalAWBPieces);
                $('#tblDimensionTab_Pieces_1').val(TotalAWBPieces);
            }
            else {
                $('#_temptblDimensionTab_Pieces_1').val($("#AWBPieces").val());
                $('#tblDimensionTab_Pieces_1').val($("#AWBPieces").val());
            }
            $('#_temptblDimensionTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            $('#tblDimensionTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            $('#_temptblDimensionTab_Volume_1').val($("#AWBCBM").val());
            $('#tblDimensionTab_Volume_1').val($("#AWBCBM").val());
        }
    }
    if (table == "tblDimensionULDTab") {
        if (Lastrow > 1) {

        }
        else {
            $('#tblDimensionULDTab_Delete_1').attr("style", "display:none;");

        }
    }
}
function BindULDOwner(PreviousRow, CurrentRow, TotalRow, Table) {
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + PreviousRow).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + PreviousRow).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + PreviousRow).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + PreviousRow).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + PreviousRow).val();
    var IsCMS = $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + PreviousRow + ']:checked').val();

    if (kendo.parseFloat(HdnULDTypeSNo) > 0) {
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(CurrentRow)).val(ULDTypeSNo)
        $('#tblDimensionULDTab_HdnULDTypeSNo_' + parseInt(CurrentRow)).val(HdnULDTypeSNo)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).val(ULDNo)
        $('#_temptblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).val(ULDNo)
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(CurrentRow)).val(OwnerCode)
        $('#tblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).val(SLAC)
        $('#_temptblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).val(SLAC)
        if (IsCMS == 1)
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']:eq(1)').attr("checked", 1);
        else
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']:eq(0)').attr("checked", 1);


        $('#tblDimensionULDTab_Delete_' + parseInt(PreviousRow)).attr("style", "display:none;");
        $('#tblDimensionULDTab_Delete_' + parseInt(CurrentRow)).attr("style", "display:block;");
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(CurrentRow)).data("kendoAutoComplete").enable(false)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#tblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#_temptblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).attr('disabled', true);
        $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']').attr("disabled", true);
        if (TotalRow == 1) {
            $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(PreviousRow)).data("kendoAutoComplete").enable(false)
            $('#tblDimensionULDTab_ULDNo_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#tblDimensionULDTab_OwnerCode_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#tblDimensionULDTab_SLAC_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#_temptblDimensionULDTab_SLAC_' + parseInt(PreviousRow)).attr('disabled', true);
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(PreviousRow) + ']').attr("disabled", true);
        }
    }
}

function RateTab(id) {


    if (userContext.GroupName == "AGENT" && userContext.SysSetting.ICMSEnvironment == 'JT' && Viewflag == "0") {
        $('#btnSaveRateData').hide();
    }
    else
        $('#btnSaveRateData').show();
    if (AWBStatusDetails == "Cancel" || AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD")
        $("#btnApplySpotCode").css("display", "none");
    //if (AWBStatusDetails != "Executed" && AWBStatusDetails != "RCS")
    //    $("#btnApplySpotCode").css("display", "none");
    var RateType = "";
    var MarketRate = "";
    var MKTFreight = "";
    var Currency = "";
    var PaymentType = "";
    var RateAirlineMasterSNo = "";
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/RateDetailsTab",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingRefNo: $('#hdnBookingMasterRefNo').val(),
            AWBSNo: currentawbsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var theDivULDDetails = document.getElementById("DivULDDetails");
            var theDivConstructRateDetails = document.getElementById("DivConstructRateDetails");
            theDivULDDetails.innerHTML = "";
            theDivConstructRateDetails.innerHTML = "";
            var theDiv = document.getElementById("divRateDetailsTab");
            theDiv.innerHTML = "";
            var theDiv1 = document.getElementById("divtblRateTab");
            theDiv1.innerHTML = "";
            var theDiv2 = document.getElementById("divtblTotalAmountTab");
            theDiv2.innerHTML = "";
            var trDiscount = "";
            var tdColumeSpotCode = "";
            var RateType = "";
            var Rate = "";
            var Freight = "";
            var RateCurrency = "";
            var AgentCurrency = "";
            var PaymentType = "";
            var ReferenceCode = "";
            var ULDRate = "";
            var SpotRate = "";
            var Commissionable = "";
            var RateClassCode = "";
            var AllinRate = "";
            var WeightBreakup = "";
            var DeclaredCarriageValue = "";
            var DeclaredCustomsValue = "";
            var PrepaidWeightCharge = "";
            var PrepaidValuation = "";
            var PrepaidTax = "";
            var PrepaidTotalChargesDueAgent = "";
            var PrepaidTotalChargesDueCarrier = "";
            var PrepaidTotalAmount = "";
            var CollectWeightCharge = "";
            var CollectValuation = "";
            var CollectTax = "";
            var CollectTotalChargesDueAgent = "";
            var CollectTotalChargesDueCarrier = "";
            var CollectTotalAmount = "";
            var trCommissionable = "";
            var ClassRateName = "";
            var RateAirlineClassRate = "";
            var RateAirlineClassRateAmount = "";
            var ClassRateRefNo = "";
            var DiscountedRate = "";
            var DiscountedFreight = "";
            var DiscountedTotalAmount = "";
            var TotalAmountAfterCommission = "";
            var table = "<table id='Ratetabtable' validateonsubmit='true'>";
            var table1 = "<table id='Ratetabtable1' validateonsubmit='true'>";
            var table2 = "<table id='Ratetabtable2' validateonsubmit='true'>";
            var ULDLink = "";
            var ConstructLink = "";
            var IsRepriced = "";
            var NoOfReprice = "0";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SpotRate.toUpperCase() == "YES")
                        tdColumeSpotCode = "Spot Code :  " + myData.Table0[0].SpotCode + "";
                    if (userContext.SysSetting.DiscountApplicableOnBooking == "1")
                        trDiscount = "Discount :  " + myData.Table0[0].DiscountAmount + " ";//"<tr><td class='ui-widget-content'>Discount :  " + myData.Table0[0].DiscountAmount + "</td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td></tr>"

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Commissionable.toUpperCase() == "YES") {
                            trCommissionable = "<td class='ui-widget-content'>Commission:  " + myData.Table0[0].Commission + "</td><td class='ui-widget-content'>Commission Amount :  " + myData.Table0[0].CommissionAmount + "</td><td class='ui-widget-content'>Reference Code  :  " + myData.Table0[0].CommissionRefNo + "</td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td>"
                        }
                        else {
                            trCommissionable = "<td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td>"
                        }
                    }
                    RateType = myData.Table0[0].RateTypeName;
                    Rate = myData.Table0[0].MKTRate;
                    Freight = myData.Table0[0].MKTFreight;
                    RateCurrency = myData.Table0[0].RateCurrencyCode;
                    AgentCurrency = myData.Table0[0].AgentCurrencyCode;
                    PaymentType = myData.Table0[0].PaymentType;
                    ReferenceCode = myData.Table0[0].RateRefNo;
                    ULDRate = myData.Table0[0].ULDRating;
                    SpotRate = myData.Table0[0].SpotRate;
                    Commissionable = myData.Table0[0].Commissionable;
                    RateClassCode = myData.Table0[0].RateClassCode;
                    AllinRate = myData.Table0[0].AllINRate;
                    WeightBreakup = myData.Table0[0].WeightBreakupAdvantageYesORNo;
                    DeclaredCarriageValue = myData.Table0[0].DeclaredCarriageValue;
                    DeclaredCustomsValue = myData.Table0[0].DeclaredCustomsValue;
                    ClassRateName = myData.Table0[0].ClassRateName;
                    RateAirlineClassRate = myData.Table0[0].RateAirlineClassRate;
                    RateAirlineClassRateAmount = myData.Table0[0].RateAirlineClassRateAmount;
                    ClassRateRefNo = myData.Table0[0].ClassRateRefNo;
                    DiscountedRate = myData.Table0[0].DiscountedRate;
                    DiscountedFreight = myData.Table0[0].DiscountedFreight;
                    DiscountedTotalAmount = myData.Table0[0].DiscountedTotalAmount;
                    IsRepriced = myData.Table0[0].IsRateProceeFromBackend == "undefined" ? "" : myData.Table0[0].IsRateProceeFromBackend;
                    NoOfReprice = myData.Table0[0].NumberOfReprice == "undefined" ? "0" : myData.Table0[0].NumberOfReprice;
                    if (myData.Table0[0].PaymentType == "Prepaid") {
                        PrepaidWeightCharge = myData.Table0[0].MKTFreight;
                        PrepaidTotalChargesDueCarrier = myData.Table0[0].OtherChargePrepaidDueCarrierTotal;
                        PrepaidTotalChargesDueAgent = myData.Table0[0].OtherChargePrepaidDueAgentTotal;
                        PrepaidTax = myData.Table0[0].TotalTaxAmount;
                        PrepaidValuation = myData.Table0[0].TotalPrepaidValuationsCharges;
                        PrepaidTotalAmount = myData.Table0[0].TotalAmount;
                        TotalAmountAfterCommission = (myData.Table0[0].TotalAmount - myData.Table0[0].CommissionAmount)
                    }
                    if (myData.Table0[0].PaymentType == "Collect") {
                        CollectWeightCharge = myData.Table0[0].MKTFreight;
                        CollectTotalChargesDueCarrier = myData.Table0[0].OtherChargeCollectDueCarrierTotal;
                        CollectTotalChargesDueAgent = myData.Table0[0].OtherChargeCollectDueAgentTotal;
                        CollectTax = myData.Table0[0].TotalTaxAmount;
                        CollectValuation = myData.Table0[0].TotalCollectValuationsCharges;
                        CollectTotalAmount = myData.Table0[0].TotalAmount;
                        //added by tarun
                        PrepaidWeightCharge = myData.Table0[0].MKTFreight;
                        PrepaidTotalChargesDueCarrier = myData.Table0[0].OtherChargePrepaidDueCarrierTotal;
                        PrepaidTotalChargesDueAgent = myData.Table0[0].OtherChargePrepaidDueAgentTotal;
                        PrepaidTax = myData.Table0[0].TotalTaxAmount;
                        PrepaidValuation = myData.Table0[0].TotalPrepaidValuationsCharges;
                        PrepaidTotalAmount = myData.Table0[0].TotalAmount;
                        TotalAmountAfterCommission = (myData.Table0[0].TotalAmount - myData.Table0[0].CommissionAmount)
                        //ends
                    }
                    if (myData.Table0[0].RateShowOnAWBPrint == "1")
                        $("#hdnRateShowOnAWBPrint").val('1');
                    else if (myData.Table0[0].RateShowOnAWBPrint == "2")
                        $("#hdnRateShowOnAWBPrint").val('2');
                    else
                        $("#hdnRateShowOnAWBPrint").val('3');
                    if (ULDRate.toUpperCase() == "YES") {
                        ULDLink = '<a title="ULD Rate Details" style="color: blue;" id="ahref_ULDDetails" href="javascript:void(0);"><span id="ULDDetails">ULD Rate Details</span></a>';
                    }
                }


                table += "<table class='appendGrid ui-widget'><thead class='ui-widget-header'>";

                var IsConstructRateValue = userContext.SysSetting.IsConstructRateApplicable;
                var IsConstructRate = '';
                if (IsConstructRateValue == "FALSE") {
                    IsConstructRate = "No";
                }
                else {
                    IsConstructRate = "Yes";
                    ConstructLink = '<a title="Construct Rate Details" style="color: blue;" id="ahref_ConstructRateDetails" href="javascript:void(0);"><span id="ConstructRateDetails">Construction Rate Details</span></a>';
                }
                // table += "<tr><td class='ui-widget-content'>Construct Rate : " + IsConstructRate + '&nbsp;&nbsp;&nbsp;&nbsp;' + ConstructLink + "</td></tr>";

                table += "<tr><td class='ui-widget-header' colspan='7'>Rate Information : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'>Rate Type : " + RateType + " &nbsp;&nbsp; " + ConstructLink + "</td><td class='ui-widget-content'>Rate :  " + Rate + "</td><td class='ui-widget-content'>Freight :  " + Freight + "</td><td class='ui-widget-content'>Rate Currency :  " + RateCurrency + "</td><td class='ui-widget-content'>Agent Currency :  " + AgentCurrency + "</td><td class='ui-widget-content'>Payment Type : " + PaymentType + "</td><td class='ui-widget-content'>Reference Code : " + ReferenceCode + "</td></tr>";
                table += "<tr><td class='ui-widget-content'>ULD Rate : " + ULDRate + '&nbsp;&nbsp;&nbsp;&nbsp;' + ULDLink + "</td><td class='ui-widget-content'>Spot Rate :  " + SpotRate + "</td><td class='ui-widget-content'>Rate Class Code :  " + RateClassCode + "</td><td class='ui-widget-content'>All in Rate :  " + AllinRate + "</td><td class='ui-widget-content'>Weight Break up :  " + WeightBreakup + "</td> <td class='ui-widget-content'>" + trDiscount + "</td> <td class='ui-widget-content'>" + tdColumeSpotCode + "</td></tr>";
                table += "<tr><td class='ui-widget-content' colspan='7' height='15'></td></tr>";
                //---------------added by nehal
                if (userContext.SysSetting.ShowPublishRateOnRateTab.toUpperCase() == "TRUE") {
                    table += "<tr><td class='ui-widget-content'>Rate Type : Publish Rate: &nbsp;&nbsp; " + ConstructLink + "</td><td class='ui-widget-content'>Rate :  " + myData.Table5[0].PublishRate + "</td><td class='ui-widget-content'>Rate Currency :  " + myData.Table5[0].Currency + "</td><td class='ui-widget-content'>Publish Rate Reference Code : " + myData.Table5[0].PublishRateReferenceCode + "</td></tr>";

                }
                table += "<tr><td class='ui-widget-content'>Class Name: " + ClassRateName + "</td><td class='ui-widget-content'>Class Rate :  " + RateAirlineClassRate + "</td><td class='ui-widget-content'>Class Amount :  " + RateAirlineClassRateAmount + "</td><td class='ui-widget-content'>Class Reference Code :  " + ClassRateRefNo + "</td><td class='ui-widget-content'>Re-Priced: " + IsRepriced + "</td><td class='ui-widget-content'>Number Of Reprice: " + NoOfReprice + "</td><td class='ui-widget-content'></td></tr>";




                // table += "" + trDiscount + "";

                table += "<tr><td class='ui-widget-content' colspan='7' height='15'></td></tr>";
                table += "<tr><td class='ui-widget-content'>Commissionable :  " + Commissionable + "</td>" + trCommissionable + "</tr>";// Added by Akaram Ali  on 11 Dec 2017 for Commission Type AND Commission Amount and trDiscount is commented 

                table += "<tr><td class='ui-widget-content' colspan='7' height='15'></td></tr>";

                table += "<tr><td class='ui-widget-content'>Discounted Rate(%) :  " + DiscountedRate + "</td><td class='ui-widget-content'>Discounted Freight :  " + DiscountedFreight + "</td><td class='ui-widget-content'>Discounted Total Amount :  " + DiscountedTotalAmount + "</td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td></tr>";

                table += "</tbody></table>";

                table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table += "<tr><td class='ui-widget-header' colspan='3'>Show on AWB Print : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'><input id='chkTactRate' name='chkTactRate' type='checkbox' value='1' onclick='SelectClicked(this);'>TACT Rate</td><td class='ui-widget-content'><input id='chkPubRate' name='chkPubRate' type='checkbox' value='2' onclick='SelectClicked(this);'>Published Rate</td><td class='ui-widget-content'><input id='chkAsAgreed' name='chkAsAgreed' type='checkbox' value='3' onclick='SelectClicked(this);'>As Agreed</td></tr>";
                table += "</tbody></table>";

                table1 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table1 += "<tr><td class='ui-widget-header' colspan='4'>Charge Declarations : </td></tr></thead><tbody class='ui-widget-content'>";
                table1 += "<tr><td class='ui-widget-content'>Currency : <div><input type='hidden' name='Currency' id='Currency' value=''><input type='text' class='' name='Text_Currency' id='Text_Currency' data-valid='required' data-valid-msg='Select Currency' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Charge Code : <div><input type='hidden' name='RateChargeCode' id='RateChargeCode' value=''><input type='text' class='' name='Text_RateChargeCode' id='Text_RateChargeCode' data-valid='required' data-valid-msg='Select Charge Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Weight/Valuation : <div><input type='hidden' name='Valuation' id='Valuation' value=''><input type='text' class='' name='Text_Valuation' id='Text_Valuation' data-valid='required' data-valid-msg='Select Valuation' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Other Charge : <div><input type='hidden' name='OtherCharge' id='OtherCharge' value=''><input type='text' class='' name='Text_OtherCharge' id='Text_OtherCharge' data-valid='required' data-valid-msg='Select Other Charge' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td></tr>";
                table1 += "<tr><td class='ui-widget-content'>Declared Value for Carriage : <div><input type='text' class='' name='DeclaredCarriageValue' id='DeclaredCarriageValue' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='NVD' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Declared Value for Customs : <div><input type='text' class='' name='DeclaredCustomsValue' id='DeclaredCustomsValue' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='NCV' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Insurance :<div><input type='text' class='' name='Insurance' id='Insurance' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='XXX' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Valuation Charge : <div><input type='text' class='' name='ValuationCharge' style='width: 150px;' id='ValuationCharge' controltype='number' maxlength='12' value='' data-role='numerictextbox'></div></td></tr>";
                table1 += "</tbody></table>";

                table1 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table1 += "<tr><td class='ui-widget-header' colspan='5'>CC Charges in Destination Currency : </td></tr></thead><tbody class='ui-widget-content'>";
                table1 += "<tr><td class='ui-widget-content'>Currency Code : <div><input type='hidden' name='CDCCurrencyCode' id='CDCCurrencyCode' value=''><input type='text' data-valid='required' data-valid-msg='Enter Declared Value for Carriage' class='' name='Text_CDCCurrencyCode' id='Text_CDCCurrencyCode' data-valid='required' data-valid-msg='Select Currency Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Conversion Rate : <div><input type='text' class='' name='CDCConversionRate' style='width: 120px;' id='CDCConversionRate' controltype='decimal3' maxlength='12' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Destination Currency Code : <div><input type='hidden' name='CDCDestCurrencyCode' id='CDCDestCurrencyCode' value=''><input type='text' class='' name='Text_CDCDestCurrencyCode' id='Text_CDCDestCurrencyCode' data-valid='required' data-valid-msg='Select Destination Currency Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Charge Amount : <div><input type='text' class='' name='ChargeAmount' style='width: 120px;' id='ChargeAmount' controltype='decimal2' maxlength='12' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Total Charge Amount : <div><input type='text' class='' name='TotalChargeAmount' style='width: 120px;' id='TotalChargeAmount' controltype='decimal2' maxlength='12' value='' data-role='numerictextbox'></div></td></tr>";
                table1 += "</tbody></table>";

                if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                    table1 += "</br><table class='appendGrid ui-widget' id='tblhandling'><thead class='ui-widget-header'>";
                    table1 += "<tr><td class='ui-widget-header' colspan='5'>Handling Information: </td></tr></thead><tbody class='ui-widget-content'>";
                    table1 += "<tr><td class='ui-widget-content first' style='text-align: left;'>Transaction By:<input type='radio' name='transactionby' value='1'  checked> Cash<input type='radio' name='transactionby' value='2'> Debit card</td><td class='ui-widget-content'>Transaction Amount:<input type='text' class='k-input k-state-default' name='transactonamount' style='width: 120px; text-align: right; display: none;' id='transactonamount' controltype='decimal2' maxlength='15' value='' data-role='numerictextbox'></td><td class='ui-widget-content'>Transaction No.:<input type='text' class='k-input' name='transactionno' id='transactionno' style='text-transform: uppercase; width: 150px;' controltype='alphanumericupper' maxlength='16' value='' data-role='alphabettextbox' autocomplete='off'></td></tr>";
                    table1 += "</tbody></table>";

                }
                table2 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table2 += "<tr><td class='ui-widget-header' colspan='6'>Prepaid Amount Details : </td></tr></thead><tbody class='ui-widget-content'>";
                table2 += "<tr><td class='ui-widget-content'>Total Weight Charge : " + PrepaidWeightCharge + "</td><td class='ui-widget-content'>Total Due Carrier Charges :  " + PrepaidTotalChargesDueCarrier + "</td><td class='ui-widget-content'>Total Due Agent Charges :  " + PrepaidTotalChargesDueAgent + "</td><td class='ui-widget-content'>Total Tax :  " + PrepaidTax + "</td><td style='display: none;' class='ui-widget-content'>Total Valuation :  " + PrepaidValuation + "</td><td class='ui-widget-content'>Total Amount : " + PrepaidTotalAmount + "</td></tr>";
                table2 += "<tr><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td style='display: none;' class='ui-widget-content'></td><td class='ui-widget-content'>Total Amount After Commission : " + TotalAmountAfterCommission + "</td></tr>";
                table2 += "</tbody></table>";

                table2 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table2 += "<tr><td class='ui-widget-header' colspan='6'>Collect Amount Details : </td></tr></thead><tbody class='ui-widget-content'>";
                table2 += "<tr><td class='ui-widget-content'>Total Weight Charge : " + CollectWeightCharge + "</td><td class='ui-widget-content'>Total Due Carrier Charges :  " + CollectTotalChargesDueCarrier + "</td><td class='ui-widget-content'>Total Due Agent Charges :  " + CollectTotalChargesDueAgent + "</td><td class='ui-widget-content'>Total Tax :  " + CollectTax + "</td><td  style='display: none;' class='ui-widget-content'>Total Valuation :  " + CollectValuation + "</td><td class='ui-widget-content'>Total Amount : " + CollectTotalAmount + "</td></tr>";
                table2 += "</tbody></table>";

                table += "</table></br>";
                table1 += "</table></br>";
                table2 += "</table>";
                theDiv.innerHTML += table;
                theDiv1.innerHTML += table1;
                theDiv2.innerHTML += table2;

                InstantiateControl("DivRateTab");


                cfi.AutoCompleteV2("Currency", "CurrencyCode", "Reservation_Currency", null, "contains");
                cfi.AutoCompleteV2("RateChargeCode", "AWBChargeCode", "Reservation_RateChargeCode", null, "contains");
                cfi.AutoCompleteByDataSource("Valuation", WeightValuation);
                cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);
                cfi.AutoCompleteV2("CDCCurrencyCode", "CurrencyCode", "Reservation_Currency", null, "contains");
                cfi.AutoCompleteV2("CDCDestCurrencyCode", "CurrencyCode", "Reservation_Currency", null, "contains");
                if ($("#hdnRateShowOnAWBPrint").val() == "1") {
                    $("#chkTactRate").prop("checked", true);
                    $("#chkPubRate").prop("checked", false);
                    $("#chkAsAgreed").prop("checked", false);
                }
                else if ($("#hdnRateShowOnAWBPrint").val() == "2") {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", true);
                    $("#chkAsAgreed").prop("checked", false);
                }
                else if ($("#hdnRateShowOnAWBPrint").val() == "3") {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", false);
                    $("#chkAsAgreed").prop("checked", true);
                }
                else {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", true);
                    $("#chkAsAgreed").prop("checked", false);
                }

                if (myData.Table1.length > 0) {
                    if (myData.Table1[0].CVDCurrencyCode != "")
                        $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDCurrencyCode, myData.Table1[0].CVDCurrencyCode + '-' + myData.Table1[0].CVDCurrencyCodeName);
                    if (myData.Table1[0].CVDChargeCode != "")
                        $("#Text_RateChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDChargeCode, myData.Table1[0].CVDChargeCode + '-' + myData.Table1[0].CVDChargeCodeDescription);
                    if (myData.Table1[0].CVDWeightValuation != "")
                        $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDWeightValuation, myData.Table1[0].CVDWeightValuationDescription);
                    if (myData.Table1[0].CVDOtherCharges != "")
                        $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDOtherCharges, myData.Table1[0].CVDOtherChargesDescription);
                    $("#DeclaredCarriageValue").val(myData.Table1[0].CVDDeclareCarriageValue);
                    $("#DeclaredCustomsValue").val(myData.Table1[0].CVDDeclareCustomValue);
                    $("#Insurance").val(myData.Table1[0].CVDDeclareInsurenceValue);
                    $("#ValuationCharge").val(myData.Table1[0].CVDValuationCharge);
                    $("#_tempValuationCharge").val(myData.Table1[0].CVDValuationCharge);
                    if (myData.Table1[0].CDCCurrencyCode != "")
                        $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CDCCurrencyCode, myData.Table1[0].CDCCurrencyCode + '-' + myData.Table1[0].CDCCurrencyCodeName);
                    $("#CDCConversionRate").val(myData.Table1[0].CDCCurrencyConversionRate);
                    $("#_tempCDCConversionRate").val(myData.Table1[0].CDCCurrencyConversionRate);
                    if (myData.Table1[0].CDCDestinationCurrencyCode != "")
                        $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CDCDestinationCurrencyCode, myData.Table1[0].CDCDestinationCurrencyCode + '-' + myData.Table1[0].CDCDestinationCurrencyCodeName);
                    $("#ChargeAmount").val(myData.Table1[0].CDCChargeAmount);
                    $("#_tempChargeAmount").val(myData.Table1[0].CDCChargeAmount);
                    $("#TotalChargeAmount").val(myData.Table1[0].CDCTotalChargeAmount);
                    $("#_tempTotalChargeAmount").val(myData.Table1[0].CDCTotalChargeAmount);
                }

                if (myData.Table2.length > 0) {
                    var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD Name</td><td class='ui-widget-header'>Pivot Wt.</td><td class='ui-widget-header'>Pivot Rate</td><td class='ui-widget-header'>Over Pivot Rate</td><td class='ui-widget-header'>Freight</td><td class='ui-widget-header'>Rate Ref No.</td></tr></thead><tbody class='ui-widget-content'>";
                    for (var i = 0; i < myData.Table2.length; i++) {
                        table += "<tr><td class='ui-widget-content first'>" + myData.Table2[i].ULDName + "</td><td class='ui-widget-content first'>" + myData.Table2[i].PivotWt + "</td><td class='ui-widget-content first'>" + myData.Table2[i].PivotRate + "</td><td class='ui-widget-content first'>" + myData.Table2[i].OverPivotRate + "</td><td class='ui-widget-content first'>" + myData.Table2[i].MKTFreight + "</td><td class='ui-widget-content first'>" + myData.Table2[i].RateRefNo + "</td></tr>";
                    }
                    table += "</tbody></table>";
                    theDivULDDetails.innerHTML += table;
                }

                if (myData.Table3.length > 0) {
                    $('input:radio[name=transactionby][value="' + myData.Table3[0].TransactionBy + '"]').prop('checked', true);
                    $('#transactonamount').val(myData.Table3[0].TransactionAmount);
                    $('#_temptransactonamount').val(myData.Table3[0].TransactionAmount);
                    $("#transactionno").val(myData.Table3[0].TransactionNo);
                }
                if (myData.Table4.length > 0) {
                    var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>RateType Name</td><td class='ui-widget-header'>Rate</td><td class='ui-widget-header'>Freight</td><td class='ui-widget-header'>Rate Currency</td><td class='ui-widget-header'>Rate Ref No.</td></tr></thead><tbody class='ui-widget-content'>";
                    for (var i = 0; i < myData.Table4.length; i++) {
                        table += "<tr><td class='ui-widget-content first'>" + myData.Table4[i].RateTypeName + "</td><td class='ui-widget-content first'>" + myData.Table4[i].MKTRate + "</td><td class='ui-widget-content first'>" + myData.Table4[i].MKTFreight + "</td><td class='ui-widget-content first'>" + myData.Table4[i].CurrencyCode + "</td><td class='ui-widget-content first'>" + myData.Table4[i].RateRaferenceNumber + "</td></tr>";
                    }
                    table += "</tbody></table>";
                    theDivConstructRateDetails.innerHTML += table;
                }

                $("a[id^='ahref_ULDDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("DivULDDetails", "ULD Rate Details");
                });
                $("a[id^='ahref_ConstructRateDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("DivConstructRateDetails", "Construction Rate Details");
                });
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
    if (userContext.SysSetting.ClientEnvironment == 'UK') {
        $('#DeclaredCustomsValue').attr('disabled', true);
        $('#Insurance').attr('disabled', true);

    }
    else {
        $('#DeclaredCustomsValue').attr('disabled', false);
        $('#Insurance').attr('disabled', false);
    }
    var dbTableName = 'DueCarrierOtherChargeTab';
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else if (userContext.UserTypeName.toUpperCase() == "AIRLINE" && userContext.SysSetting.ClientEnvironment == 'TH' && AWBStatusNo >= 5) {
            pageType = "Edit";
        }
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Carrier Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'Type', display: 'Payment Type', type: 'select', ctrlOptions: { '1': 'PREPAID', '2': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'OtherChargeCode', display: 'Charge Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_DueCarrier', filterField: "Code", filterCriteria: "contains" },
            { name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            //{ name: 'OtherchargeCurrency', display: 'Other Charges Currency', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'OtherchargeCurrency', display: 'Other Charge Currency', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckExchangeRate(this.id );" }, onChange: "return CheckExchangeRate(this.id);", ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_AgentOtherChargeCurrency', filterField: "CurrencyCode", filterCriteria: "contains" },

            { name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
            { name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ReferenceNumber', display: 'Reference Number', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ChargeType', display: 'Mode of Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }

        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        OnUpdateSuccess: function () {
            RateTab();
        }, rowUpdateExtraFunction: function (id) {

            hidetblDueCarrierOtherChargeTab()
        },
        afterRowRemoved: function (caller, rowIndex) {

            RateTab();
        },

        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });
    if (pageType == 'View') {
        $("[ id^='tblDueCarrierOtherChargeTab_Type_']").each(function () {
            $(this).text($(this).text() == '1' ? 'PREPAID' : 'COLLECT')
        })
    }
    if (userContext.UserTypeName.toUpperCase() == "AIRLINE" && userContext.SysSetting.ClientEnvironment == 'TH' && AWBStatusNo > 5)
        $("#tblDueCarrierOtherChargeTab_btnAppendRow").attr("style", "display:none;");
    var dbTableName = 'AgentOtherChargeTab';
    //var pageType = $('#hdnPageType').val();
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True') {
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();

    }
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else if (userContext.UserTypeName.toUpperCase() == "AIRLINE" && userContext.SysSetting.ClientEnvironment == 'TH' && AWBStatusNo >= 5) {
            pageType = "Edit";
        }
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 5,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Agent Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'Type', display: 'Payment Type', type: 'select', ctrlOptions: { '1': 'PREPAID', '2': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '90px' } },
            { name: 'OtherChargeType', display: 'Charge Type', type: 'hidden', ctrlOptions: { '1': 'DUE CARRIER', '2': 'DUE AGENT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '100px' } },
            { name: 'OtherChargeCode', display: 'Charge Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_DueCarrier', filterField: "Code", filterCriteria: "contains" },
            { name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '150px' } },
            { name: 'AgentOtherchargeCurrency', display: 'Other Charge Currency', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckExchangeRate(this.id );" }, onChange: "return CheckExchangeRate(this.id );", ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_AgentOtherChargeCurrency', filterField: "CurrencyCode", filterCriteria: "contains" },
            { name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
            { name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ReferenceNumber', display: 'Reference Number', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ChargeType', display: 'Mode of Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        OnUpdateSuccess: function () {
            $("tr[id^='tblAgentOtherChargeTab_Row']").each(function (row, tr) {
                $(tr).find("select[id^='tblAgentOtherChargeTab_Type_']").attr("disabled", true);
                $(tr).find("select[id^='tblAgentOtherChargeTab_OtherChargeType_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_OtherchargeDetail_']").attr("disabled", true);
                $(tr).find("input[id^='_temptblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
                //$(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").data("kendoAutoComplete").enable(false);
                $(tr).find("input[id^='tblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);

                //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("disabled", true);
                //  $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");
            });
            RateTab();
        },
        rowUpdateExtraFunction: function (id) {

            hidetblAgentOtherChargeTab();
        },
        afterRowRemoved: function (caller, rowIndex) {

            RateTab();
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },
    });
    var refcode = $("#divRateDetailsTab table td:contains(Reference Code :)").text().split(':')[1]
    if (pageType == 'View') {
        $("[ id^='tblAgentOtherChargeTab_Type_']").each(function () {
            $(this).text($(this).text() == '1' ? 'PREPAID' : 'COLLECT')
        })
    }
    if (refcode == " ")
        $("#tblAgentOtherChargeTab_btnAppendRow").hide();
    else if (userContext.UserTypeName.toUpperCase() == "AIRLINE" && userContext.SysSetting.ClientEnvironment == 'TH' && AWBStatusNo > 5)
        $("#tblAgentOtherChargeTab_btnAppendRow").attr("style", "display:none;");
    else
        $("#tblAgentOtherChargeTab_btnAppendRow").show();
    $("tr[id^='tblAgentOtherChargeTab_Row']").each(function (row, tr) {
        $(tr).find("select[id^='tblAgentOtherChargeTab_Type_']").attr("disabled", true);
        $(tr).find("select[id^='tblAgentOtherChargeTab_OtherChargeType_']").attr("disabled", true);
        $(tr).find("input[id^='tblAgentOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
        $(tr).find("input[id^='tblAgentOtherChargeTab_OtherchargeDetail_']").attr("disabled", true);
        $(tr).find("input[id^='_temptblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
        if (pageType != 'View') {
            if ($(tr).find("input[id^='tblAgentOtherChargeTab_HdnAgentOtherchargeCurrency_']").val() != "")
                $(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").data("kendoAutoComplete").enable(false);
            else
                $(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").attr("disabled", true);
        }
        $(tr).find("input[id^='tblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);

        //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("disabled", true);
        //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");

    });

    var dbTableName = 'TaxChargeInformationTab';
    var pageType = 'View';
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,TaxCode,TaxValue',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Tax Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'TaxCode', display: 'Tax Code', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxName', display: 'Tax Name', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxType', display: 'Tax Type', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxApplicable', display: 'Tax Applicable', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxRate', display: 'Tax Rate', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            //{ name: 'TotalTaxAmount', display: 'Total Tax Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'TaxCurrency', display: 'Tax Currency', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'TaxAmount', display: 'Tax Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
            { name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },

            { name: 'ReferenceNumber', display: 'Reference Number', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });

    if (AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "FOH" || AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD") {
        if (HideActionButtonforLion == 1)
            $("#btnSaveRateData").css("display", "none");
    }
    else {
        if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True') { }
        else
            $("#btnSaveRateData").css("display", "none");
    }

    PagerightsCheckReservation(0)
}
function SelectClicked(obj) {
    $(obj).closest("tr").find("input[type='checkbox']").attr("Checked", false);
    var messgae = "";
    var Flag = true;


    if (($(obj).attr("id") == "chkTactRate")) {
        $("#hdnRateShowOnAWBPrint").val('1');
    } else if (($(obj).attr("id") == "chkPubRate")) {
        $("#hdnRateShowOnAWBPrint").val('2');
    } else if (($(obj).attr("id") == "chkAsAgreed")) {
        $("#hdnRateShowOnAWBPrint").val('3');
    }
    $(obj).attr("Checked", true);
}



function CustomsTab() {
    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        $('#btnSaveHandlingInformation').hide();
    }
    else
        $('#btnSaveHandlingInformation').show();
    if (userContext.GroupName == "AGENT" && userContext.SysSetting.ICMSEnvironment == 'JT' && Viewflag == "0") {
        $('#btnSaveNotifyData').hide();
    }
    else
        $('#btnSaveNotifyData').show();
    if ($("#hdnHandlingInformation").val() != "") {
        var resultHandlingInformation = $("#hdnHandlingInformation").val();
        $("#HandlingInformation").val(resultHandlingInformation);
    }

    $("#HandlingInformation").unbind("blur").bind("blur", function () {
        var HandlingInformation = $("#HandlingInformation").val();
        $("#hdnHandlingInformation").val(HandlingInformation);
    });

    var dbTableName = 'CustomsOtherInformationTab';
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,OSI',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Other Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
            { name: 'OSI', display: 'OSI', type: 'text', value: '', ctrlAttr: { maxlength: 65, controltype: 'alphanumericupper' }, ctrlCss: { width: '500px' }, isRequired: true },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            HideOCIAppend();
        },
        afterRowRemoved: function (caller, rowIndex) {
            HideOCIAppend();
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });
    var RowCount = 0;
    $("tr[id^='tblCustomsOtherInformationTab_Row']").each(function (row, tr) {
        RowCount = parseInt(RowCount) + parseInt(1);
    });
    if (RowCount >= 3) {
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:none;");
    }
    HideOCIAppend();
    var dbTableName = 'CustomsOCIInformationTab';
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 5,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Other Customs, Security & Regulatory Control Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            { name: 'AWBSNo', type: 'hidden', value: currentawbsno },
            { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
            { name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },

            { name: 'CountryCode', display: 'Country Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, AutoCompleteName: 'Reservation_AppendGrid_Country', filterField: 'CountryCode' },
            { name: 'InfoType', display: 'Information Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, AutoCompleteName: 'Reservation_AppendGrid_InfoType', filterField: 'InformationCode' },
            { name: 'CSControlInfoIdentifire', display: 'Customs, Security', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, AutoCompleteName: 'Reservation_AppendGrid_CSControlInfoIdentifire', filterField: 'CustomsCode' },
            { name: 'SCSControlInfoIdentifire', display: 'Supplementary Customs', type: 'text', value: '', ctrlAttr: { maxlength: 35, controltype: 'default' }, ctrlCss: { width: '200px' }, isRequired: true },
            { name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
            { name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        beforeRowInserted: function (caller, rowIndex) {
            checkoc(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },
    });

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/NotifyDetailsTab",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingRefNo: $('#hdnBookingMasterRefNo').val(),
            AWBSNo: currentawbsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var thedivtblNotifyDetails = document.getElementById("divtblNotify");
            thedivtblNotifyDetails.innerHTML = "";
            if (userContext.SysSetting.ICMSEnvironment != 'JT') {
                var table = "<table id='GroupBookingRemarkstabtable' validateonsubmit='true'>";
                table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table += "<tr><td class='ui-widget-header' colspan='4'>Group Booking Remarks : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'>Remarks :</td><td> <div><label id='lblremarks'></label></div></td></tr>";
                table += "</tbody></table>";
                thedivtblNotifyDetails.innerHTML += table;
            }
            var table = "<table id='Notifytabtable' validateonsubmit='true'>";
            table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
            table += "<tr><td class='ui-widget-header' colspan='4'>Notify Party Details : </td></tr></thead><tbody class='ui-widget-content'>";
            table += "<tr><td class='ui-widget-content'>Name 1 : <div><input type='text' class='' name='Notify_Name' id='Notify_Name' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Name 2 : <div><input type='text' class='' name='Notify_Name2' id='Notify_Name2' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Country : <div><input type='hidden' name='Notify_CountryCode' id='Notify_CountryCode' value=''><input type='text' class='' name='Text_Notify_CountryCode' id='Text_Notify_CountryCode' data-valid='required' data-valid-msg='Select Country' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>City : <div><input type='hidden' name='Notify_City' id='Notify_City' value=''><input type='text' class='' name='Text_Notify_City' id='Text_Notify_City' data-valid='required' data-valid-msg='Select City' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td></tr>";
            table += "<tr><td class='ui-widget-content'>Contact Number : <div><input type='text' class='' name='Notify_MobileNo' style='width: 150px;' id='Notify_MobileNo' controltype='number' maxlength='25' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Telex : <div><input type='text' class='' name='Notify_MobileNo2' style='width: 150px;' id='Notify_MobileNo2' controltype='number' maxlength='25' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Address 1 : <div><input type='text' class='' name='Notify_Address' id='Notify_Address' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Address 2 : <div><input type='text' class='' name='Notify_Address2' id='Notify_Address2' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td></tr>";
            table += "<tr><td class='ui-widget-content'>State : <div><input type='text' class='' name='Notify_State' id='Notify_State' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Place : <div><input type='text' class='' name='Notify_Place' id='Notify_Place' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='20' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Postal Code :<div><input type='text' class='' name='Notify_PostalCode' id='Notify_PostalCode' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Fax :<div><input type='text' class='' name='Notify_Fax' id='Notify_Fax' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td></tr>";
            table += "</tbody></table>";
            table += "<table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
            table += "<tr><td class='ui-widget-header' colspan='4'>Nominated Handling Party : </td></tr></thead><tbody class='ui-widget-content'>";
            table += "<tr><td class='ui-widget-content'>Name : <div><input type='text' class='' name='Nominate_Name' id='Nominate_Name' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Place : <div><input type='text' class='' name='Nominate_Place' id='Nominate_Place' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='20' data-role='alphabettextbox' autocomplete='off'></div></td></tr>";
            table += "</tbody></table>";
            thedivtblNotifyDetails.innerHTML += table;

            InstantiateControl("DivNotifyTab");


            cfi.AutoCompleteV2("Notify_CountryCode", "CountryCode,CountryName", "Reservation_Country", null, "contains");
            cfi.AutoCompleteV2("Notify_City", "CityCode,CityName", "Reservation_City", null, "contains");


            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                var notifyData = myData.Table0;
                var nominyData = myData.Table1;
                var gpbData = myData.Table2;

                if (notifyData.length > 0) {
                    $("#Notify_Name").val(notifyData[0].CustomerName);
                    $("#Notify_Name2").val(notifyData[0].CustomerName2);
                    if (notifyData[0].CountrySno > 0) {
                        $("#Text_Notify_CountryCode").data("kendoAutoComplete").setDefaultValue(notifyData[0].CountrySno, notifyData[0].CountryCode + '-' + notifyData[0].CountryName);
                    }
                    if (notifyData[0].CitySno > 0) {
                        $("#Text_Notify_City").data("kendoAutoComplete").setDefaultValue(notifyData[0].CitySno, notifyData[0].CityCode + '-' + notifyData[0].CityName);
                    }
                    $("#Notify_MobileNo").val(notifyData[0].Phone);
                    $("#_tempNotify_MobileNo").val(notifyData[0].Phone);
                    $("#Notify_MobileNo2").val(notifyData[0].Phone2);
                    $("#_tempNotify_MobileNo2").val(notifyData[0].Phone2);
                    $("#Notify_Address").val(notifyData[0].Street);
                    $("#Notify_Address2").val(notifyData[0].Street2);
                    $("#Notify_State").val(notifyData[0].State);
                    $("#Notify_Place").val(notifyData[0].Location);
                    $("#Notify_PostalCode").val(notifyData[0].PostalCode);
                    $("#Notify_Fax").val(notifyData[0].Fax);

                    if ($("#hdnHandlingInformation").val() != "") {
                        var resultHandlingInformation = $("#hdnHandlingInformation").val();
                        $("#HandlingInformation").val(resultHandlingInformation);
                    }
                    if (notifyData[0].HandlingInformation != "") {
                        $("#HandlingInformation").val(notifyData[0].HandlingInformation);
                        $("#hdnHandlingInformation").val(notifyData[0].HandlingInformation);
                    }
                }
                if (nominyData.length > 0) {
                    $('#Nominate_Name').val(nominyData[0].NOMName);
                    $('#Nominate_Place').val(nominyData[0].NOMPlace);
                }
                if (gpbData.length > 0 && userContext.SysSetting.ICMSEnvironment != 'JT') {
                    $('#lblremarks').text(gpbData[0].Remarks);
                }


            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
    PagerightsCheckReservation(0)
}


function SaveNotifyData() {
    //if (currentawbsno > 0) {
    var NotifyModel = {
        NotifyName: $("#Notify_Name").val(),
        NotifyName2: $("#Notify_Name2").val(),
        NotifyCountryCode: $("#Text_Notify_CountryCode").data("kendoAutoComplete").key(),
        NotifyCityCode: $("#Text_Notify_City").data("kendoAutoComplete").key(),
        NotifyMobile: $("#Notify_MobileNo").val(),
        NotifyMobile2: $("#Notify_MobileNo2").val(),
        NotifyAddress: $("#Notify_Address").val(),
        NotifyAddress2: $("#Notify_Address2").val(),
        NotifyState: $("#Notify_State").val(),
        NotifyPlace: $("#Notify_Place").val(),
        NotifyPostalCode: $("#Notify_PostalCode").val(),
        NotifyFax: $("#Notify_Fax").val(),
    }
    var NominyModel = {
        NominyName: $("#Nominate_Name").val(),
        NominyAddress: $("#Nominate_Place").val(),
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/SaveNotifyData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno || 0, NotifyModel: NotifyModel, NominyModel: NominyModel, ReferenceNumber: $('#hdnBookingMasterRefNo').val(), AwbReferenceBookingSNo: $('#hdnBookingSNo').val() || "0", HandlingInformation: $('#HandlingInformation').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Handling & Customs Information', "Processed Successfully", "bottom-right");
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Handling & Customs Information', result.split('?')[1], "bottom-right");
            }
            else {
                ShowMessage('warning', 'Warning - Handling & Customs Information', "unable to process.", "bottom-right");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Handling & Customs Information', "unable to process.", "bottom-right");
        }
    });
    //}
    //else
    //    ShowMessage('warning', 'Information!', "First Execute Shipment than Notify Process.");
}
function HideOCIAppend() {
    var RowCount = 0;
    $("tr[id^='tblCustomsOtherInformationTab_Row']").each(function (row, tr) {
        RowCount = parseInt(RowCount) + parseInt(1);
    });
    if (RowCount >= 3)
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:none;");
    else
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:block;");
}

function checkSHCSnoExist(groupSno, Sno) {
    var retval;
    for (var i = 0; i < groupSno.split(',').length; i++) {
        if (groupSno.split(',')[i] == Sno) {
            retval = 1;
            return retval;
        }
        else { retval = 0; }
    }
    return retval;
}
function BindSHCGroup(valueId, value, keyId, key) {
    var GroupName = value.split(',')[0];
    var GroupSNo = key;
    var shcVal = ($('#SPHCSNo').val());
    var shcText = ($('#Text_SPHCSNo').val());

    if (GroupName != '') {
        $.ajax({
            type: "POST",
            url: "./Services/Reservation/ViewUpdateDoorOpenService.svc/GetSHCGroupDetail?GroupName=" + GroupName + "&GroupSNo=" + GroupSNo,
            //data: { data: 1 },
            dataType: "json",
            success: function (data) {
                if (data != null && data != '') {
                    var ExistGroupVal = $('#divMultiSPHCSNo').find('ul')[0].innerHTML;
                    $('#Text_SPHCSNo')[0].defaultValue = '';
                    $('#Text_SPHCSNo')[0].Value = '';
                    $('#Text_SPHCSNo').val('');

                    var i = 0;

                    var strDivdata = '';

                    if (shcVal.split(',').length > 0) {
                        while (i < shcVal.split(',').length) {
                            if (shcVal.split(',')[i] != '')
                                if (shcText.split(',')[i] != GroupName && shcText.split(',')[i] != '') {
                                    strDivdata += ("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + shcText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + shcVal.split(',')[i] + "'></span></li>");
                                }
                            i++;
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        if (shcVal == GroupSNo) { shcVal = ''; }
                        //if (ExistGroupVal.indexOf(data[i].SNo) == -1) {
                        var checkexixtval = checkSHCSnoExist($('#Multi_SPHCSNo').val(), data[i].SNo);
                        if (checkexixtval == 0) {
                            shcVal += "," + data[i].SNo;
                            shcText += "," + data[i].Code;
                            strDivdata += ("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + data[i].Code + "</span><span class='k-icon k-delete' id='" + data[i].SNo + "'></span></li>");
                        }
                    }

                    //    if (shcVal != '') {
                    $('#divMultiSPHCSNo').find('ul').append(strDivdata);

                    if (ExistGroupVal.indexOf(GroupName) == -1) {
                        $('#Multi_SPHCSNo').val($('#Multi_SPHCSNo').val() + ',' + shcVal);
                        $('#FieldKeyValuesSPHCSNo')[0].innerHTML = $('#FieldKeyValuesSPHCSNo')[0].innerHTML + ',' + shcVal;
                        $('#SPHCSNo').val($('#SPHCSNo').val() + ',' + shcVal);


                    } else {
                        $('#Multi_SPHCSNo').val(removeLastComma($('#Multi_SPHCSNo').val()) + ',' + shcVal);
                        $('#FieldKeyValuesSPHCSNo')[0].innerHTML = removeLastComma($('#FieldKeyValuesSPHCSNo')[0].innerHTML) + ',' + shcVal;
                        $('#SPHCSNo').val(removeLastComma($('#SPHCSNo').val()) + ',' + shcVal);

                    }

                    // }
                    $("#divMultiSPHCSNo ul li:contains('" + GroupName + "')").remove();
                }
            }
            //ViewUpdateDoorOpen();
            //divThroughputRuleProperties.innerHTML = code;
            //}
        });

    }


}

function GetItineraryCarrierCode(e) {
    var AWBCode = "";
    if (e != "Text_AWBCode") {
        AWBCode = e;
    }
    else {
        AWBCode = $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
    }
    if (AWBCode != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetItineraryCarrierCode",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBCode: AWBCode
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        AWBFillCarrierCode = myData.Table0[0].CarrierCode;
                        PrefixAirlineName = myData.Table0[0].AirlineName;
                        IsCCAllowedAirline = myData.Table0[0].IsCCAllowed;
                        if (IsCCAllowedAirline == "False") {
                            if ($("#Text_ChargeCode").data("kendoAutoComplete").key() == 2) {
                                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
                                ShowMessage('warning', 'Information!', "Collect Shipment booking not allowed for " + PrefixAirlineName + ".");
                            }
                        }
                        if (userContext.SysSetting.ICMSEnvironment != 'JT')
                            $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CarrierCode, myData.Table0[0].CarrierCode);
                        IsItineraryCarrierCodeInterline();
                        if (myData.Table0[0].IsInterline == "True") {
                            $('input[name=AWBStock][value=0]').attr('checked', true);
                            $('input[name=AWBStock][value=0]').click();
                            $('#AWBNumber').removeAttr("disabled");
                            $('#_tempAWBNumber').removeAttr("disabled");
                            $('input[type=radio][name=AWBStock]').attr('disabled', true);
                            if (userContext.AgentSNo > 0) { }
                            else {
                                if (userContext.SysSetting.InterlineAgentName != "" && userContext.SysSetting.InterlineAgentName != undefined) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.SysSetting.InterlineAgentSNo, userContext.SysSetting.InterlineAgentName);
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                                }
                            }
                        }
                        else {
                            if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue("", "");

                                }
                            }
                            if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
                            }
                            else {
                                $('input[name=AWBStock][value=1]').attr('checked', true);
                                $('#AWBNumber').val('');
                                $('#_tempAWBNumber').val('');

                                $('#AWBNumber').attr('disabled', true);
                                $('input[type=radio][name=AWBStock]').attr('disabled', false);
                                AutoStockAgentOrNot();
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function CheckFlightNoLength() {
    if ($("#ItineraryInterlineFlightNo").val() != "") {
        if ($("#ItineraryInterlineFlightNo").val().length < 4) {
            if ($("#ItineraryInterlineFlightNo").val().length == 1) {
                $("#ItineraryInterlineFlightNo").val('000' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('000' + $("#ItineraryInterlineFlightNo").val());
            }
            else if ($("#ItineraryInterlineFlightNo").val().length == 2) {
                $("#ItineraryInterlineFlightNo").val('00' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('00' + $("#ItineraryInterlineFlightNo").val());
            }
            else {
                $("#ItineraryInterlineFlightNo").val('0' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('0' + $("#ItineraryInterlineFlightNo").val());
            }
        }
    }
}
function IsItineraryCarrierCodeInterline() {
    if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/IsItineraryCarrierCodeInterline",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ItineraryCarrierCode: $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == "1") {
                            $("#tdItineraryFlightNo").css("display", "none");
                            $("#tdItineraryInterlineFlightNo").css("display", "block");
                            $("#Text_ItineraryFlightNo").data("kendoAutoComplete").setDefaultValue("", "");
                            $("#hdnIsItineraryCarrierCodeInterline").val("1");
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            thedivFlightSearchResult.innerHTML = "";
                        }
                        else {
                            $("#tdItineraryFlightNo").css("display", "block");
                            $("#tdItineraryInterlineFlightNo").css("display", "none");
                            $("#ItineraryInterlineFlightNo").val('');
                            //$("#_tempItineraryInterlineFlightNo").val('');
                            $("#hdnIsItineraryCarrierCodeInterline").val("0");
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            thedivFlightSearchResult.innerHTML = "";
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function BindULDAutoComplete(elem, mainElem) {
    var NewULDSPHCId = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("id");
    $(elem).find("input[id^='ULDSPHCCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            //cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SetRequired, "contains", ",", null, null, null, null, true, null, true);
            cfi.AutoCompleteV2($(this).attr("name"), "CODE", "Reservation_SPHC", SetRequired, "contains", ",", null, null, null, null, true, null, true);
        }
        $(this).css("width", "120px");

    });
    $(elem).find("input[id^='ContourCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            //cfi.AutoComplete($(this).attr("name"), "ContourCode", "vw_GetSLIContourCodes", "SNO", "ContourCode", ["ContourCode"], GetContour, "contains", null, null, null, null, null, true, null, true);
            cfi.AutoCompleteV2($(this).attr("name"), "ContourCode", "Reservation_ContourCode", GetContour, "contains", null, null, null, null, null, true, null, true);
        }
        //$(this).css("width", "100px");

    });


    var getName = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("name");

    //$("#" + NewULDSPHCId + " li").remove();
    $("div[name=" + getName + "][id=" + NewULDSPHCId + "]").remove();


    //$(elem).find("input[id^='ULDPackingTypeSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
    //});

    $(elem).find("input[id^='Unit']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode"], ResetLWH, "contains");
        cfi.AutoCompleteV2($(this).attr("name"), "UnitCode", "Reservation_Unit", ResetLWH, "contains");
        $(elem).find("input[id^='Text_ULDSPHCCode']").each(function () {
            $(this).css("width", "120px");
        });

        $(elem).find("input[id^='Text_Unit']").each(function () {
            $(this).val("CMT");
            $(this).css("width", "50px");
        });
        $(elem).find("input[id^='Unit']").each(function () {
            $(this).val("2");
        });
    });
    $(elem).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
        fn_RemoveULDRow(this);
    });
    //$(elem).find("input[id^='ULDNoSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    //});
    $(elem).find("input[id^='ULDTypeSNo']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "ULDName", "V_ULD_Reservation", "SNo", "ULDName", ["ULDName"], CheckBULKULDType, "contains");
        cfi.AutoCompleteV2($(this).attr("name"), "ULDName", "Reservation_ULDTypeSNo", CheckBULKULDType, "contains");
        $(this).css("width", "60px");

    });
    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });

    //$(elem).find("input[id^=ULDNo]").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this); 
    //});

    $(elem).find("input[id^='ULDNo']").keydown(function (e) {
        IsNumericNewCheck(e);
    });

    $(elem).find("input[id^='SLACPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^='UldPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDLength]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDWidth]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDHeight]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).prev().find("td:last div").append($(elem).prev().prev().find(".icon-trans-plus-sign").clone(true));
    $(elem).find("td[id^='tdSNoCol']").text(parseInt($(elem).prev().find("td[id^='tdSNoCol']").text()) + 1);
    $(elem).find("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
        GetULDDetails(this);
    });
    $(elem).find("a[id^='ahref_ULDGetWeight']").unbind("click").bind("click", function () {
        GetWeigingWeight(this);
    });
    $(elem).find("a[id^='ahref_Equipment']").unbind("click").bind("click", function () {
        Getequipment(this);
    });


    CalculateULDVolume();
    //fn_RemoveRequired();
}
function IsBUPCheckOrNot() {
    //var Pieces = ($("#AWBPieces").val() == "" ? "" : parseFloat($("#AWBPieces").val()));
    if ($("#chkIsBUP").prop('checked') == true) {
        $("#tdAWBNoofBUP").css("display", "block");
        $("#AWBNoofBUP").attr("data-valid", "min[1],required");
        //$("#AWBNoofBUP").val(Pieces);
        //$("#_tempAWBNoofBUP").val(Pieces);


        $("#AWBNoofBUP").val('');
        $("#_tempAWBNoofBUP").val('');
        $("#AWBNoofBUPIntact").val('');
        $("#_tempAWBNoofBUPIntact").val('');
        $("#AWBNoofBUP").attr('disabled', false);
        $("#_tempAWBNoofBUP").attr('disabled', false);
        $("#AWBNoofBUPIntact").attr('disabled', false);
        $("#_tempAWBNoofBUPIntact").attr('disabled', false);
    }
    else {
        $("#AWBNoofBUP").val('');
        $("#_tempAWBNoofBUP").val('');
        $("#AWBNoofBUP").removeAttr("data-valid");
        $("#_tempAWBNoofBUP").removeAttr("class");
        $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");
        $("#AWBNoofBUPIntact").val('');
        $("#_tempAWBNoofBUPIntact").val('');
        $("#tdAWBNoofBUP").css("display", "none");
        $("#AWBNoofBUPIntact").removeAttr("data-valid");
        $("#_tempAWBNoofBUPIntact").removeAttr("class");
        $("#_tempAWBNoofBUPIntact").attr("class", "k-formatted-value k-input transSection k-state-default");
    }
}
function CheckIsCCAllowed() {
    if (IsCCAllowedAirline == "False") {
        if ($("#Text_ChargeCode").data("kendoAutoComplete").key() == 2) {
            $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
            ShowMessage('warning', 'Information!', "Collect Shipment booking not allowed for " + PrefixAirlineName + ".");
        }
    }
}

function ClearPriority() {
    if (userContext.SysSetting.PriorityBasedOnProduct == "True")
        $('#Text_Priority').val('');
    ClearItineraryRoute();
}

function PageLoaded(Action, ProcessName) {


    cfi.AutoCompleteV2("AWBCode", "AirlineCode", "Reservation_Airline", GetItineraryCarrierCode, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "Reservation_Product", ClearPriority, "contains");
    var ChargeCodeSource = [{ Key: "1", Text: "PP" }, { Key: "2", Text: "CC" }];
    cfi.AutoCompleteByDataSource("ChargeCode", ChargeCodeSource, CheckIsCCAllowed, null);
    cfi.AutoCompleteV2("AWBOrigin", "CityCode,CityName", "Reservation_City1", SelectedAWBOriginDestination, "contains");
    cfi.AutoCompleteV2("AWBOrigin1", "CityCode,CityName", "Reservation_City1", null, "contains");
    cfi.AutoCompleteV2("AWBDestination", "CityCode,CityName", "Reservation_City1", SelectedAWBOriginDestination, "contains");
    cfi.AutoCompleteV2("AWBOffice", "Name", "Reservation_Office", null, "contains");
    cfi.AutoCompleteV2("AWBAgent", "Name", "Reservation_Agent", CheckValidAWBNumber, "contains");
    var UMSource = [{ Key: "0", Text: "K" }, { Key: "1", Text: "L" }];
    cfi.AutoCompleteByDataSource("UM", UMSource);
    if (userContext.SysSetting.ICMSEnvironment == 'JT')
        cfi.AutoCompleteV2("Priority", "Code,PriorityName", "Reservation_vwPriority", null, "contains");
    else
        cfi.AutoCompleteV2("Priority", "Code,PriorityName", "Reservation_Priority", null, "contains");

    //cfi.AutoCompleteV2("HSCode", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains", ",", null, null, null, HSCodeDetails, true);
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "Reservation_Commodity", FillCommoditySHC, "contains");
    cfi.AutoCompleteV2("SHC", "CODE,Description", "Reservation_SPHC1", null, "contains", ",", null, null, null, SHCDetails, true);
    cfi.AutoCompleteV2("ItineraryOrigin", "AirportCode,AirportName", "Reservation_Airport", CheckPiecesOnOD, "contains");
    cfi.AutoCompleteV2("ItineraryDestination", "AirportCode,AirportName", "Reservation_Airport", CheckPiecesOnOD, "contains");
    cfi.AutoCompleteV2("ItineraryCarrierCode", "CarrierCode", "Reservation_Airline1", IsItineraryCarrierCodeInterline, "contains");
    cfi.AutoCompleteV2("ItineraryFlightNo", "FlightNo", "Reservation_searchFlightNo", null, "contains");
    cfi.DateType("ItineraryDate", true);
    cfi.AutoCompleteV2("ItineraryTransit", "AirportCode,AirportName", "Reservation_Airport", null, "contains");
    cfi.AutoCompleteV2("SHIPPER_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("SHIPPER_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("SHIPPER_City", "CityCode,CityName", "Reservation_City", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_City", "CityCode,CityName", "Reservation_City", null, "contains");




    if (userContext.SysSetting.ICMSEnvironment != 'JT')
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#litermsandcondtion'));
    //if(userContext.SysSetting.ExecutionByPass == '1')
    //	$("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").enable($('#liCustoms'));
    //else
    //$("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liCustoms'));
    if (userContext.SysSetting.IsNOGLengthIncreaseOnReservation.toUpperCase() == 'TRUE') {
        // if (userContext.SysSetting.ClientEnvironment == 'UK')
        $("#NatureOfGoods").attr('maxlength', '240');
    }
    else { $("#NatureOfGoods").attr('maxlength', '20'); }

    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        $('a#ahref_CallerCode').remove();
        $('#lblbupintact').remove();
        $('#chkIsBUP').remove();
        if (userContext.UserTypeName.toUpperCase() == "AGENT") {
            $('#ItineraryPieces').attr("disabled", "disabled");
            $('#_tempItineraryPieces').attr("disabled", "disabled");
            $('#ItineraryGrossWeight').attr("disabled", "disabled");
            $('#_tempItineraryGrossWeight').attr("disabled", "disabled");

        }
    }
    if (userContext.SysSetting.IsBillingAddess.toUpperCase() == 'TRUE') {
        $('#BillingAddress').show();
      
    } else
        $('#BillingAddress').hide();


    if (userContext.SysSetting.IsShowEmailOnEWBLink.toUpperCase() == 'TRUE') {
        $('#CallerCode').text('EWB/GST/Email Id');
        $('#CallerCode').attr("title", 'EWB/GST/Email Id');
    } else
        $('#CallerCode').text('Caller Information');
    //if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo >= 5) {
    //    $("#liPti").css("display", "");
    //}
    if (userContext.SpecialRights.CWBA ==true) {
          $("#lblchbwb").css("display", "block");
       }

    else {
        $("#lblchbwb").css("display", "none");
        }
    if (userContext.SysSetting.ClientEnvironment == 'TH') {
        //$("#DownloadExcel").css("display", "none");
        $("#ahref_HSCode").css("display", "none");
    }
    else
        $("#ahref_HSCode").css("display", "block");
    $('#AWBNoofBUPIntact').remove();
    $('#_tempAWBNoofBUPIntact').remove();
    $("#AWBNumber").unbind("blur").bind("blur", function () {
        if (Action == "NEW" || Action == "COPY")
            CheckValidAWBNumber();
    });
    $("#AWBPieces").unbind("blur").bind("blur", function () {
        CalculatedPieces();
    });
    $("#NoofHouse").unbind("blur").bind("blur", function () {
        NoofHousePieces();
    });
    $("#AWBNoofBUP").unbind("blur").bind("blur", function () {
        CalculatedBUPPieces('AWBNoofBUP');
    });
    $("#AWBNoofBUPIntact").unbind("blur").bind("blur", function () {
        CalculatedBUPPieces('AWBNoofBUPIntact');
    });
    $("#AWBChargeableWeight").bind("blur", function () {
        compareGrossVolValue();
    });
    $("#AWBGrossWeight").bind("blur", function () {
        if ($("#Text_Commodity").data("kendoAutoComplete").key() != "") {
            BindMinimumChWt();
        }
        CalculateGrossVolumeWeight(this);
    });
    $("#AWBCBM").bind("blur", function () {
        CalculateShipmentChWt(this);
    });
    $("#AWBVolumeWeight").bind("blur", function () {
        CalculateShipmentCBM();
    });
    $("#ItineraryPieces").unbind("blur").bind("blur", function () {
        ItineraryPieces();
    });
    $("#ItineraryGrossWeight").bind("blur", function () {
        ItineraryGrossWeight();
    });
    $("#ItineraryVolumeWeight").bind("blur", function () {
        ItineraryCBM();
    });
    $("#ItineraryMainVolumeWeight").bind("blur", function () {
        ItineraryMainVolumeWeight();
    });
    $("div[id^='divMultiSHC']").css("overflow", "auto");
    $("div[id^='divMultiSHC']").css("width", "15em");
    $("#btnNew").css("display", "none");
    $("#tdItineraryInterlineFlightNo").css("display", "none");
    if (userContext.AgentSNo > 0 || userContext.OfficeSNo > 0) {
        if (userContext.GroupName != "POS-OPS" && userContext.GroupName != "POS-KSO" && userContext.GroupName != "POS-CSC") {
            $("#tdBCT").css("display", "none");
            $("#tdMCT").css("display", "none");
        }
    }
    if (Action == "NEW" || Action == "COPY") {
        if (userContext.SysSetting.ExecutionByPass == '1') {
            ApplyRequired();
        }
        $("#btnAWBPrint").css("display", "none");
        $("#btnAWBLabel").css("display", "none");
        $("#btnSave").css("display", "block");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#tdAWBNoofBUP").css("display", "none");
        //$('#AWBNumber').attr('disabled', true);
        //$('#_tempAWBNumber').attr('disabled', true);
        $("#Text_UM").data("kendoAutoComplete").setDefaultValue("0", "K");
        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
        if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
            $('input[type=radio][name=BookingType]').attr('disabled', true);
            //$('input[type=radio][name=AWBStock]').attr('disabled', true);
            //  $("#Text_ChargeCode").data("kendoAutoComplete").enable(false);
            //$("#Text_AWBCode").data("kendoAutoComplete").enable(false);
            //$("#NoofHouse").attr('disabled', true);
            //$("#_tempNoofHouse").attr('disabled', true);
            $("#chkIsBUP").attr('disabled', true);
        }
        if (Action == "NEW") {
            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
            }
            else {
                $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                SelectedAWBOriginDestination('Text_AWBOrigin');
            }
            //if ((userContext.GroupName != "ADMIN" && userContext.GroupName != "SUPER ADMIN" && userContext.AgentSNo < 1)) {
            //    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
            //}
        }
        if (userContext.AgentSNo > 0) {
            $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
            $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
            //$("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
            $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
            if (Action == "NEW") {
                AutoStockAgentOrNot();
                //FillProductForAgent('');
            }
        } else {
            $('#_tempAWBNumber').attr('disabled', true);
            $('#AWBNumber').attr('disabled', true);
        }
        if (Action == "NEW") {
            if (userContext.AirlineName != null && userContext.AirlineName != "") {
                if (userContext.AirlineName.length > 6) {
                    $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(userContext.AirlineName.split('-')[0], userContext.AirlineName.split('-')[0]);
                    GetItineraryCarrierCode(userContext.AirlineName.split('-')[0]);
                }
            }
            //if (userContext.AgentSNo <= 0)
            //    GETProductASPerBookingType('0', userContext.GroupName);
        }
    }
    else if (Action == "UPDATE") {
        if (userContext.SysSetting.ExecutionByPass == '1') {
            ApplyRequired();
        }
        $("#lblBookingRefNo").text($("#hdnBookingMasterRefNo").val());
        $("#btnSave").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#btnUpdate").css("display", "block");
        $("#btnCopyBooking").css("display", "none");
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $("#btnCopyBooking").css("display", "none");
        }
        $("#btnUpdate").unbind("click").bind("click", function () {

            if (UpdateData(ProcessName)) {

                ShipmentSearch();
                CleanUI();
            }
        });
        $("#btnCopyBooking").unbind("click").bind("click", function () {
            CopyBooking();
        });
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetCompleteReservationData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBReferenceBookingSNo: $("#hdnBookingSNo").val(),
                BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var shipperData = myData.Table1;
                    var consigneeData = myData.Table2;
                    var Itinerary = myData.Table3;

                    if (myData.Table0.length > 0) {
                        if (userContext.SysSetting.ICMSEnvironment == 'JT' && myData.Table0[0].AsAgreed == "True") {
                            if (myData.Table5[0].OverRideAsAgreed == '1') { }
                            else
                                $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liRate'));
                        }
                        if (myData.Table0[0].BookingType == "1")
                            $("#Text_Product").data("kendoAutoComplete").enable(false);
                        $('input[name=BookingType][value=' + myData.Table0[0].BookingType + ']').attr('checked', true);
                        $('input[name=AWBStock][value=' + myData.Table0[0].AWBStock + ']').attr('checked', true);
                        $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AWBPrefix, myData.Table0[0].AWBPrefix);
                        $("#AWBNumber").val(myData.Table0[0].AWBNo);
                        $("#_tempAWBNumber").val(myData.Table0[0].AWBNo);
                        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PaymentType, myData.Table0[0].PaymentType == 1 ? 'PP' : 'CC');
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].ProductSNo, myData.Table0[0].ProductName);
                        $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].OriginCitySNo, myData.Table0[0].OriginCityCode + '-' + myData.Table0[0].OriginCityName);
                        $("#Text_AWBDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].DestinationCitySNo, myData.Table0[0].DestinationCityCode + '-' + myData.Table0[0].DestinationCityName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo, myData.Table0[0].Text_AccountSNo);
                        $("#Text_UM").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].GrossUnit == 'False' ? 0 : 1, myData.Table0[0].GrossUnit == 'False' ? 'K' : 'L');
                        if (myData.Table0[0].PrioritySNo != "" && myData.Table0[0].PrioritySNo != "0")
                            $("#Text_Priority").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PrioritySNo, myData.Table0[0].PriorityCode + '-' + myData.Table0[0].PriorityName);
                        $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CommoditySNo, myData.Table0[0].CommodityCode + '-' + myData.Table0[0].CommodityDescription);
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC)
                        $("#SHC").val(myData.Table0[0].SHC);
                        $("#NatureOfGoods").val(myData.Table0[0].NatureOfGoods);
                        $("#NoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#_tempNoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#AWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#_tempAWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#AWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#_tempAWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#AWBCBM").val(myData.Table0[0].Volume);
                        $("#_tempAWBCBM").val(myData.Table0[0].Volume);
                        $("#AWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#_tempAWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#hdnHandlingInformation").val(myData.Table0[0].HandlingInformation);
                        DimensionMandatoryOrNotInEcecutionAtCity = myData.Table0[0].IsDimensioMandatoryAtCity == 'False' ? 0 : 1;
                        IsAsAgreedAgent = myData.Table0[0].AsAgreed == 'True' ? 1 : 0;
                        OverRideAsAgreed = myData.Table5[0].OverRideAsAgreed == '1' ? 1 : 0;
                        topUpAgentLogin = myData.Table6[0].topUpAgentLogin;
                        NoOfREExecuted = myData.Table6[0].NoOfREExecuted;
                        ACReplanCount = myData.Table6[0].ACReplanCount;
                        if (myData.Table0[0].IsBUP == "True") {
                            $("#chkIsBUP").prop('checked', true);
                            //$("#tdAWBNoofBUP").css("display", "none");
                            $("#tdAWBNoofBUP").css("display", "block");

                            if (myData.Table0[0].BupPieces > 0) {
                                $("#AWBNoofBUP").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#_tempAWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', true);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', true);
                            }
                            else if (myData.Table0[0].BupIntactPieces > 0) {
                                $("#AWBNoofBUPIntact").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#_tempAWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', true);
                                $("#_tempAWBNoofBUP").attr('disabled', true);
                            }
                            else {
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', false);
                                $("#_tempAWBNoofBUP").attr('disabled', false);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', false);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                            }

                            if (myData.Table0[0].BookingRefULDDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        else {
                            $("#AWBNoofBUP").val('');
                            $("#_tempAWBNoofBUP").val('');
                            $("#tdAWBNoofBUP").css("display", "none");
                            $("#AWBNoofBUP").removeAttr("data-valid");
                            $("#_tempAWBNoofBUP").removeAttr("class");
                            $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");

                            $("#AWBNoofBUPIntact").val('');
                            $("#_tempAWBNoofBUPIntact").val('');
                            $("#AWBNoofBUPIntact").removeAttr("data-valid");
                            $("#_tempAWBNoofBUPIntact").removeAttr("class");
                            $("#_tempAWBNoofBUPIntact").attr("class", "k-formatted-value k-input transSection k-state-default");

                            if (myData.Table0[0].BookingRefDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        if (myData.Table0[0].IsRoutingComplete == "True") {
                            $("#chkIsRoutingComplete").prop('checked', true);
                        }
                        $("#hdnCallerType").val(myData.Table0[0].CallerType);
                        if (myData.Table0[0].CallerType == 0) {
                            $("#hdnCallerCode").val(myData.Table0[0].CallerCode);

                            $("#Ewb").prop('checked', true);
                        }
                        else {
                            $("#hdnCallerCode").val(myData.Table0[0].GSTValue);
                            $("#Gst").prop('checked', true);
                        }
                        $("#hdnEWBEmail").val(myData.Table0[0].EWBEmail);
                        if (myData.Table0[0].IsMarineInsurance == "1") {
                            $("#chkInsurance").prop('checked', true);
                            $("#liInsurance").css("display", "");
                            $("#lbliece").text(myData.Table0[0].AWBPieces);
                            $("#lblweight").text(myData.Table0[0].GrossWeight);
                            $("#InsuranceCertificate").css("display", "");
                        }
                        if (myData.Table0[0].IsWeightBreak == "True") {
                            $("#ChkWb").prop('checked', true);

                        }
                        var theDiv = document.getElementById("divUserDetails");
                        theDiv.innerHTML = "";
                        var table = "";
                        //table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='2'>User Action Information</td></tr>";
                        //table += "<tr><td style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr></table>";
                        table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr></table>";
                        theDiv.innerHTML = table;
                    }
                    
                        

               
                    if (shipperData.length > 0) {
                        $("#hdnShipperSNo").val(shipperData[0].SNo);
                        $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                        if (shipperData[0].ShipperAccountNo != "") {
                            $("#chkSHIPPER_AccountNo").closest('td').hide();
                            $("#chkShipper").attr('disabled', true);
                            $("#chkShipper").removeAttr("title");
                        }
                        $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                        $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                        $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity == "" ? "" : shipperData[0].ShipperCity, shipperData[0].ShipperCity == "" ? "" : shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                        $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#_tempSHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_Taxid").val(shipperData[0].TaxID);
                        $("#_tempSHipper_Taxid").val(shipperData[0].TaxID);

                    }
                    if (consigneeData.length > 0) {
                        $("#hdnConsigneeSNo").val(consigneeData[0].SNo);
                        $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                        if (consigneeData[0].ConsigneeAccountNo != "") {
                            $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            $("#chkconsignee").attr('disabled', true);
                            $("#chkconsignee").removeAttr("title");
                        }
                        $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                        $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                        $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                        $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#Consignee_Taxid").val(consigneeData[0].TaxID);
                        $("#_tempConsignee_Taxid").val(consigneeData[0].TaxID);
                    }
                    if (Itinerary.length > 0) {
                        for (var i = 0; i < Itinerary.length; i++) {
                            var SoftEmbargo = "0";
                            var IsRouteComplete = "0";

                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportSNo, Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportCode + '-' + Itinerary[i].OriginAirportName);
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportSNo, Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportCode + '-' + Itinerary[i].DestinationAirportName);
                            $("#ItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#_tempItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#ItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#_tempItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#ItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#_tempItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#ItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            if (Itinerary[i].IsSoftEmbargoApply == "True")
                                SoftEmbargo = "1"
                            if (Itinerary[i].IsRouteComplete == "True") {
                                IsRouteComplete = "1"

                            }



                            SelectdRoute(Itinerary[i].DailyFlightSNo, 'SearchFlight', 'UPDATE', Itinerary[i].AllotmentSNo, Itinerary[i].AllotementCode, '0', Itinerary[i].RouteStatus, Itinerary[i].Status, SoftEmbargo, IsRouteComplete, Itinerary[i].OverrideBCT, Itinerary[i].OverrideMCT);
                        }

                    }
                    if (myData.Table0[0].HSCode != "" && myData.Table0[0].Text_HSCode != "") {
                        HSCode = myData.Table0[0].HSCode;
                        Text_HSCode = myData.Table0[0].Text_HSCode;
                    }
                    if (userContext.SysSetting.IsAWBReservationMarineInsurance == '1' && AWBStatusNo >= 4)
                        $("#lblinsurance").css("display", "");
                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                        $('#AWBNumber').removeAttr("disabled");
                    } else if ($('input:radio[name=AWBStock]:checked').val() === '1') {
                        $('#AWBNumber').attr('disabled', true);
                    }
                    if (AWBStatusNo > 5 && AWBStatusNo != 15) {       //No Show Work Commented
                        //if (AWBStatusNo > 5) {
                        var table44 = document.getElementById("tblSelectdRouteResult");
                        if (table44 != null && table44.rows.length > 1) {
                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                $(tr).find("button[id^='Delete_']").css("display", "none");
                            });
                        }
                    }

                    if (Action == "UPDATE" && AWBStatusDetails == "Cancel" && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA') {
                        var table123 = document.getElementById("tblSelectdRouteResult");
                        if (table123 != null && table123.rows.length > 1) {
                            ClearItineraryRoute();
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        if (IsAsAgreedAgent == 1) {
            if (OverRideAsAgreed == 1) { }
            else
                $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liRate'));
        }
        if (AWBStatusDetails != "Executed" && AWBStatusDetails != "EXE") {
            $("#btnAWBPrint").css("display", "none");
            $("#btnAWBLabel").css("display", "none");
        }

        //Added by Shivali Thakur
        AuditLogBindOldValue("tblApplySpotCode");
    }
    else if (Action == "EXECUTE") {
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").enable($('#liCustoms'));
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $('#chkterms').prop("checked", true);
        }
        ApplyRequired();
        $("#lblBookingRefNo").text($("#hdnBookingMasterRefNo").val());
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        if (userContext.SysSetting.ICMSEnvironment == 'JT')
            $("#btnCopyBooking").css("display", "block");
        else
            $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "block");
        if (AWBStatusNo == 5 && userContext.SysSetting.ICMSEnvironment == 'JT') {
            $('#btnExecute').html('Update');
        }
        $("#btnExecute").unbind("click").bind("click", function () {
            if (ExecuteData(ProcessName)) {
                ExecutionCompleteforLion = 1;
                ShipmentSearch();
                CleanUI();
            }
        });
        $("#btnCopyBooking").unbind("click").bind("click", function () {
            CopyBooking();
        });
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetCompleteReservationData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBReferenceBookingSNo: $("#hdnBookingSNo").val(),
                BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var shipperData = myData.Table1;
                    var consigneeData = myData.Table2;
                    var Itinerary = myData.Table3;
                    if (myData.Table0.length > 0) {

                        if (myData.Table0[0].IsEDoxUploaded == '1') {
                            $('(input[value="D"]').css({ 'background-color': 'green', 'color': 'white', 'border-color': 'green' });
                        }
                        if (myData.Table0[0].BookingType == "2")
                            $("#ahref_CBVHandlingInformation").css("display", "");
                        if (userContext.SysSetting.ICMSEnvironment == 'JT' && myData.Table0[0].AsAgreed == "True") {
                            if (myData.Table5[0].OverRideAsAgreed == '1') { }
                            else
                                $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liRate'));
                        }
                        if (myData.Table0[0].BookingType == "1")
                            $("#Text_Product").data("kendoAutoComplete").enable(false);
                        $('input[name=BookingType][value=' + myData.Table0[0].BookingType + ']').attr('checked', true);
                        $('input[name=AWBStock][value=' + myData.Table0[0].AWBStock + ']').attr('checked', true);
                        $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AWBPrefix, myData.Table0[0].AWBPrefix);
                        $("#AWBNumber").val(myData.Table0[0].AWBNo);
                        $("#_tempAWBNumber").val(myData.Table0[0].AWBNo);
                        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PaymentType, myData.Table0[0].PaymentType == 1 ? 'PP' : 'CC');
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].ProductSNo, myData.Table0[0].ProductName);
                        $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].OriginCitySNo, myData.Table0[0].OriginCityCode + '-' + myData.Table0[0].OriginCityName);
                        $("#Text_AWBDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].DestinationCitySNo, myData.Table0[0].DestinationCityCode + '-' + myData.Table0[0].DestinationCityName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo, myData.Table0[0].Text_AccountSNo);
                        $("#Text_UM").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].GrossUnit == 'False' ? 0 : 1, myData.Table0[0].GrossUnit == 'False' ? 'K' : 'L');
                        if (myData.Table0[0].PrioritySNo != "" && myData.Table0[0].PrioritySNo != "0")
                            $("#Text_Priority").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PrioritySNo, myData.Table0[0].PriorityCode + '-' + myData.Table0[0].PriorityName);
                        $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CommoditySNo, myData.Table0[0].CommodityCode + '-' + myData.Table0[0].CommodityDescription);
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC)
                        $("#SHC").val(myData.Table0[0].SHC);
                        $("#NatureOfGoods").val(myData.Table0[0].NatureOfGoods);
                        $("#NoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#_tempNoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#AWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#_tempAWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#AWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#_tempAWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#AWBCBM").val(myData.Table0[0].Volume);
                        $("#_tempAWBCBM").val(myData.Table0[0].Volume);
                        $("#AWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#_tempAWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#hdnHandlingInformation").val(myData.Table0[0].HandlingInformation);
                        DimensionMandatoryOrNotInEcecutionAtCity = myData.Table0[0].IsDimensioMandatoryAtCity == 'False' ? 0 : 1;
                        IsAsAgreedAgent = myData.Table0[0].AsAgreed == 'True' ? 1 : 0;
                        OverRideAsAgreed = myData.Table5[0].OverRideAsAgreed == '1' ? 1 : 0;
                        topUpAgentLogin = myData.Table6[0].topUpAgentLogin;
                        NoOfREExecuted = myData.Table6[0].NoOfREExecuted;
                        ACReplanCount = myData.Table6[0].ACReplanCount;
                        if (myData.Table0[0].IsWeightBreak == "True") {
                            $("#ChkWb").prop('checked', true);

                        }
                        if (myData.Table0[0].IsBUP == "True") {
                            $("#chkIsBUP").prop('checked', true);
                            //$("#tdAWBNoofBUP").css("display", "none");
                            $("#tdAWBNoofBUP").css("display", "block");

                            if (myData.Table0[0].BupPieces > 0) {
                                $("#AWBNoofBUP").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#_tempAWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', true);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', true);
                            }
                            else if (myData.Table0[0].BupIntactPieces > 0) {
                                $("#AWBNoofBUPIntact").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#_tempAWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', true);
                                $("#_tempAWBNoofBUP").attr('disabled', true);
                            }
                            else {
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', false);
                                $("#_tempAWBNoofBUP").attr('disabled', false);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', false);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                            }

                            if (myData.Table0[0].BookingRefULDDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        else {
                            $("#AWBNoofBUP").val('');
                            $("#_tempAWBNoofBUP").val('');
                            $("#tdAWBNoofBUP").css("display", "none");
                            $("#AWBNoofBUP").removeAttr("data-valid");
                            $("#_tempAWBNoofBUP").removeAttr("class");
                            $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");

                            $("#AWBNoofBUPIntact").val('');
                            $("#_tempAWBNoofBUPIntact").val('');
                            $("#AWBNoofBUPIntact").removeAttr("data-valid");
                            $("#_tempAWBNoofBUPIntact").removeAttr("class");
                            $("#_tempAWBNoofBUPIntact").attr("class", "k-formatted-value k-input transSection k-state-default");

                            if (myData.Table0[0].BookingRefDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        if (myData.Table0[0].IsRoutingComplete == "True") {
                            $("#chkIsRoutingComplete").prop('checked', true);
                        }

                        //  $("#hdnCallerCode").val(myData.Table0[0].CallerCode);
                        $("#hdnCallerType").val(myData.Table0[0].CallerType);
                        if (myData.Table0[0].CallerType == 0) {
                            $("#hdnCallerCode").val(myData.Table0[0].CallerCode);

                            $("#Ewb").prop('checked', true);
                        }
                        else {
                            $("#hdnCallerCode").val(myData.Table0[0].GSTValue);
                            $("#Gst").prop('checked', true);
                        }
                        $("#hdnEWBEmail").val(myData.Table0[0].EWBEmail);
                        $("#hdnPassengerName").val(myData.Table0[0].PassengerName);
                        $("#PassengerName").val(myData.Table0[0].PassengerName);
                        $("#hdnPNRNumber").val(myData.Table0[0].PNRNumber);
                        $("#pnrnumber").val(myData.Table0[0].PNRNumber);
                        if (myData.Table0[0].IsMarineInsurance == "1") {
                            $("#chkInsurance").prop('checked', true);
                            $("#liInsurance").css("display", "");
                            $("#lbliece").text(myData.Table0[0].AWBPieces);
                            $("#lblweight").text(myData.Table0[0].GrossWeight);
                            $("#InsuranceCertificate").css("display", "");
                        }
                        var theDiv = document.getElementById("divUserDetails");
                        theDiv.innerHTML = "";
                        var table = "";
                        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                            table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr><tr><td class='formSection' style='text-align: left;'>Executed By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>RE Executed By : " + myData.Table0[0].ReExecutedUser + "</td></tr></table>";
                            theDiv.innerHTML = table;
                        }
                        else {
                            table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr><tr><td class='formSection' style='text-align: left;'>Executed By : " + myData.Table0[0].ExecutedUser + "</td><td class='formSection' style='text-align: right;'>RE Executed By : " + myData.Table0[0].ReExecutedUser + "</td></tr></table>";
                            theDiv.innerHTML = table;
                        }
                    }
                    if (shipperData.length > 0) {
                        $("#hdnShipperSNo").val(shipperData[0].SNo);
                        $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                        if (shipperData[0].ShipperAccountNo != "") {
                            $("#chkSHIPPER_AccountNo").closest('td').hide();
                            $("#chkShipper").attr('disabled', true);
                            $("#chkShipper").removeAttr("title");
                        }
                        $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                        $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                        $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity == "" ? "" : shipperData[0].ShipperCity, shipperData[0].ShipperCity == "" ? "" : shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                        $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#_tempSHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_Taxid").val(shipperData[0].TaxID);
                        $("#_tempSHipper_Taxid").val(shipperData[0].TaxID);
                    }
                    if (consigneeData.length > 0) {
                        $("#hdnConsigneeSNo").val(consigneeData[0].SNo);
                        $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                        if (consigneeData[0].ConsigneeAccountNo != "") {
                            $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            $("#chkconsignee").attr('disabled', true);
                            $("#chkconsignee").removeAttr("title");
                        }
                        $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                        $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                        $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                        $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#Consignee_Taxid").val(consigneeData[0].TaxID);
                        $("#_tempConsignee_Taxid").val(consigneeData[0].TaxID);
                    }
                    if (Itinerary.length > 0) {
                        for (var i = 0; i < Itinerary.length; i++) {
                            var SoftEmbargo = "0";
                            var IsRouteComplete = "0";
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportSNo, Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportCode + '-' + Itinerary[i].OriginAirportName);
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportSNo, Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportCode + '-' + Itinerary[i].DestinationAirportName);
                            $("#ItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#_tempItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#ItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#_tempItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#ItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#_tempItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#ItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            if (Itinerary[i].IsSoftEmbargoApply == "True")
                                SoftEmbargo = "1"
                            if (Itinerary[i].IsRouteComplete == "True") {
                                IsRouteComplete = "1"
                            }



                            SelectdRoute(Itinerary[i].DailyFlightSNo, 'SearchFlight', 'UPDATE', Itinerary[i].AllotmentSNo, Itinerary[i].AllotementCode, '0', Itinerary[i].RouteStatus, Itinerary[i].Status, SoftEmbargo, IsRouteComplete, Itinerary[i].OverrideBCT, Itinerary[i].OverrideMCT);
                        }

                    }
                    if (myData.Table0[0].HSCode != "" && myData.Table0[0].Text_HSCode != "") {
                        HSCode = myData.Table0[0].HSCode;
                        Text_HSCode = myData.Table0[0].Text_HSCode;
                    }
                    if (userContext.SysSetting.IsAWBReservationMarineInsurance == '1' && AWBStatusNo >= 4)
                        $("#lblinsurance").css("display", "");
                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                        $('#AWBNumber').removeAttr("disabled");
                    } else if ($('input:radio[name=AWBStock]:checked').val() === '1') {
                        $('#AWBNumber').attr('disabled', true);
                    }
                    if (AWBStatusNo > 5 && AWBStatusNo != 15) {       //No Show Work Commented
                        //if (AWBStatusNo > 5) {
                        if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True') { }
                        else {
                            var table44 = document.getElementById("tblSelectdRouteResult");
                            if (table44 != null && table44.rows.length > 1) {
                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                    $(tr).find("button[id^='Delete_']").css("display", "none");
                                });
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        if (IsAsAgreedAgent == 1) {
            if (OverRideAsAgreed == 1) { }
            else
                $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liRate'));
        }
        if (AWBStatusDetails == "Cancel" || AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD") {
            $("#btnAWBPrint").css("display", "none");
            $("#btnAWBLabel").css("display", "none");
        }
        if (AWBStatusNo > 5)
            GetOperationalDetail();
        if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") {
            SplitShipmentAllowed();
        }



        //Added by Shivali Thakur
        AuditLogBindOldValue("tblApplySpotCode");
    }
    if (Action == "COPY") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetCompleteReservationData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBReferenceBookingSNo: $("#hdnBookingSNo").val(),
                BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var shipperData = myData.Table1;
                    var consigneeData = myData.Table2;
                    var Itinerary = myData.Table3;

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].BookingType == "2")
                            $("#Text_ChargeCode").data("kendoAutoComplete").enable(false);
                        if (myData.Table0[0].BookingType == "1")
                            $("#Text_Product").data("kendoAutoComplete").enable(false);
                        $('input[name=BookingType][value=' + myData.Table0[0].BookingType + ']').attr('checked', true);
                        $('input[name=AWBStock][value=' + myData.Table0[0].AWBStock + ']').attr('checked', true);
                        $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AWBPrefix, myData.Table0[0].AWBPrefix);
                        $("#AWBNumber").val('');
                        $("#_tempAWBNumber").val('');
                        if (myData.Table0[0].AWBStock == "1") {
                            $('#_tempAWBNumber').attr('disabled', true);
                            $('#AWBNumber').attr('disabled', true);
                        }
                        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PaymentType, myData.Table0[0].PaymentType == 1 ? 'PP' : 'CC');
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].ProductSNo, myData.Table0[0].ProductName);
                        $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].OriginCitySNo, myData.Table0[0].OriginCityCode + '-' + myData.Table0[0].OriginCityName);
                        $("#Text_AWBDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].DestinationCitySNo, myData.Table0[0].DestinationCityCode + '-' + myData.Table0[0].DestinationCityName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo, myData.Table0[0].Text_AccountSNo);
                        $("#Text_UM").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].GrossUnit == 'False' ? 0 : 1, myData.Table0[0].GrossUnit == 'False' ? 'K' : 'L');
                        if (myData.Table0[0].PrioritySNo != "" && myData.Table0[0].PrioritySNo != "0")
                            $("#Text_Priority").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PrioritySNo, myData.Table0[0].PriorityCode + '-' + myData.Table0[0].PriorityName);
                        $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CommoditySNo, myData.Table0[0].CommodityCode + '-' + myData.Table0[0].CommodityDescription);
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC)
                        $("#SHC").val(myData.Table0[0].SHC);
                        $("#NatureOfGoods").val(myData.Table0[0].NatureOfGoods);
                        $("#NoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#_tempNoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#AWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#_tempAWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#AWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#_tempAWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#AWBCBM").val(myData.Table0[0].Volume);
                        $("#_tempAWBCBM").val(myData.Table0[0].Volume);
                        $("#AWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#_tempAWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                            $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                            $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                            //  $("#AWBChargeableWeight").val(parseFloat(myData.Table0[0].GrossWeight) > parseFloat(myData.Table0[0].VolumeWeight) ? myData.Table0[0].GrossWeight : myData.Table0[0].VolumeWeight);
                            //  $("#_tempAWBChargeableWeight").val(parseFloat(myData.Table0[0].GrossWeight) > parseFloat(myData.Table0[0].VolumeWeight) ? myData.Table0[0].GrossWeight : myData.Table0[0].VolumeWeight);
                        }
                        else {
                            $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                            $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        }
                        $("#hdnHandlingInformation").val(myData.Table0[0].HandlingInformation);
                        IsAsAgreedAgent = myData.Table0[0].AsAgreed == 'True' ? 1 : 0;
                        OverRideAsAgreed = myData.Table5[0].OverRideAsAgreed == '1' ? 1 : 0;
                        topUpAgentLogin = myData.Table6[0].topUpAgentLogin;
                        NoOfREExecuted = myData.Table6[0].NoOfREExecuted;
                        ACReplanCount = myData.Table6[0].ACReplanCount;
                        if (myData.Table0[0].IsBUP == "True") {
                            $("#chkIsBUP").prop('checked', true);
                            //$("#tdAWBNoofBUP").css("display", "none");
                            $("#tdAWBNoofBUP").css("display", "block");

                            if (myData.Table0[0].BupPieces > 0) {
                                $("#AWBNoofBUP").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#_tempAWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', true);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', true);
                            }
                            else if (myData.Table0[0].BupIntactPieces > 0) {
                                $("#AWBNoofBUPIntact").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#_tempAWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', true);
                                $("#_tempAWBNoofBUP").attr('disabled', true);
                            }
                            else {
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', false);
                                $("#_tempAWBNoofBUP").attr('disabled', false);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', false);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                            }

                            if (myData.Table0[0].BookingRefULDDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        else {
                            $("#AWBNoofBUP").val('');
                            $("#_tempAWBNoofBUP").val('');
                            $("#tdAWBNoofBUP").css("display", "none");
                            $("#AWBNoofBUP").removeAttr("data-valid");
                            $("#_tempAWBNoofBUP").removeAttr("class");
                            $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");

                            $("#AWBNoofBUPIntact").val('');
                            $("#_tempAWBNoofBUPIntact").val('');
                            $("#AWBNoofBUPIntact").removeAttr("data-valid");
                            $("#_tempAWBNoofBUPIntact").removeAttr("class");
                            $("#_tempAWBNoofBUPIntact").attr("class", "k-formatted-value k-input transSection k-state-default");

                            if (myData.Table0[0].BookingRefDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                                $("#AWBCBM").attr('disabled', true);
                                $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        if (myData.Table0[0].IsRoutingComplete == "True") {
                            $("#chkIsRoutingComplete").prop('checked', true);
                        }
                        $("#hdnCallerCode").val(myData.Table0[0].CallerCode);
                        var theDiv = document.getElementById("divUserDetails");
                        theDiv.innerHTML = "";

                    }
                    if (shipperData.length > 0 && shipperData[0].IsActive == "True") {
                        $("#hdnShipperSNo").val(shipperData[0].SNo);
                        $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                        if (shipperData[0].ShipperAccountNo != "") {
                            $("#chkSHIPPER_AccountNo").closest('td').hide();
                            $("#chkShipper").attr('disabled', true);
                            $("#chkShipper").removeAttr("title");
                        }
                        $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                        $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                        $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity == "" ? "" : shipperData[0].ShipperCity, shipperData[0].ShipperCity == "" ? "" : shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                        $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#_tempSHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_Taxid").val(shipperData[0].TaxID);
                        $("#_tempSHipper_Taxid").val(shipperData[0].TaxID);
                    }
                    if (consigneeData.length > 0 && consigneeData[0].IsActive == "True") {
                        $("#hdnConsigneeSNo").val(consigneeData[0].SNo);
                        $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                        if (consigneeData[0].ConsigneeAccountNo != "") {
                            $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            $("#chkconsignee").attr('disabled', true);
                            $("#chkconsignee").removeAttr("title");
                        }
                        $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                        $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                        $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                        $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#Consignee_Taxid").val(consigneeData[0].TaxID);
                        $("#_tempConsignee_Taxid").val(consigneeData[0].TaxID);
                    }
                    if (Itinerary.length > 0) {
                        for (var i = 0; i < Itinerary.length; i++) {
                            var SoftEmbargo = "0";
                            var IsRouteComplete = "0";
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportSNo, Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportCode + '-' + Itinerary[i].OriginAirportName);
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportSNo, Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportCode + '-' + Itinerary[i].DestinationAirportName);
                            $("#ItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#_tempItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#ItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#_tempItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#ItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#_tempItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#ItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            if (Itinerary[i].IsSoftEmbargoApply == "True")
                                SoftEmbargo = "1"
                            if (Itinerary[i].IsRouteComplete == "True")
                                IsRouteComplete = "1"


                            SelectdRoute(Itinerary[i].DailyFlightSNo, 'SearchFlight', 'COPY', Itinerary[i].AllotmentSNo, Itinerary[i].AllotementCode, '0', Itinerary[i].RouteStatus, Itinerary[i].Status, SoftEmbargo, IsRouteComplete, Itinerary[i].OverrideBCT, Itinerary[i].OverrideMCT);
                        }

                        var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };
                        var monthFormet = { 1: "01", 2: "02", 3: "03", 4: "04", 5: "05", 6: "06", 7: "07", 8: "08", 9: "09", 10: "10", 11: "11", 12: "12" };
                        var tableSelected = document.getElementById("tblSelectdRouteResult");
                        var CopyDailyFlightSNo = "";
                        if (tableSelected != null && tableSelected.rows.length > 1) {
                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                var date = $(tr).find("td")[1].innerText.trim();
                                var Selecteddate_components = date.split("-");
                                var Selectedcurrent_day = Selecteddate_components[0];
                                var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
                                var Selectedcurrent_year = Selecteddate_components[2];
                                SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
                                var SelectedDate = new Date(SelectedDateValue);


                                var CurrentDate = new Date();
                                var Previouscurrent_day = CurrentDate.getDate();
                                var Previouscurrent_month = monthFormet[CurrentDate.getMonth() + 1];
                                var Previouscurrent_year = CurrentDate.getFullYear();
                                PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
                                var TodayDate = new Date(PreviousDateValue);

                                if (SelectedDate < TodayDate) {
                                    ClearItineraryRoute();
                                    ShowMessage('warning', 'Warning - Reservation', 'Older date Itinerary has been removed. Kindly again plan flights for AWB.', "bottom-right");
                                    //if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                                    //    $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                                    //    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
                                    //}
                                    return false;
                                }
                                else {
                                    CopyDailyFlightSNo += $(tr)[0].id + ",";

                                }
                            });
                            $.ajax({
                                url: "Services/Shipment/ReservationBookingService.svc/CheckAndValidateCopyFlightData",
                                async: false,
                                type: "GET",
                                dataType: "json",
                                data: { DailyFlightSNo: CopyDailyFlightSNo },
                                contentType: "application/json; charset=utf-8", cache: false,
                                success: function (result) {
                                    if (result.substring(1, 0) == "{") {
                                        var myData = jQuery.parseJSON(result);
                                        if (myData.Table0.length > 0) {
                                            if (myData.Table0[0].IsValid == "0") {
                                                ClearItineraryRoute();
                                                ShowMessage('warning', 'Warning - Reservation', 'Itinerary ETD/ETA are not valid.', "bottom-right");
                                                return false;
                                            }
                                        }
                                    }
                                    return false
                                },
                                error: function (xhr) {
                                    var a = "";
                                }
                            });
                        }
                    }
                    if (myData.Table0[0].HSCode != "" && myData.Table0[0].Text_HSCode != "") {
                        HSCode = myData.Table0[0].HSCode;
                        Text_HSCode = myData.Table0[0].Text_HSCode;
                    }
                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                        //$('#AWBNumber').removeAttr("disabled");
                        $("#AWBNumber").attr('disabled', false);
                        $("#_tempAWBNumber").attr('disabled', false);
                    } else if ($('input:radio[name=AWBStock]:checked').val() === '1') {
                        $('#AWBNumber').attr('disabled', true);
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        if (IsAsAgreedAgent == 1) {
            if (OverRideAsAgreed == 1) { }
            else
                $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liRate'));
        }
        $("#hdnPreviousBookingSNo").val($("#hdnBookingSNo").val());
        $("#hdnPreviousBookingMasterRefNo").val($("#hdnBookingMasterRefNo").val());

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GenerateAndGetReferenceNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: { BookingRefNo: 'GenerateAndGetReferenceNumber' },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $("#hdnBookingMasterRefNo").val(myData.Table0[0].ReferenceNumber);
                        $("#hdnBookingSNo").val('');
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/InsertdataCopyBooking",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingMasterRefNo: $("#hdnBookingMasterRefNo").val(),
                PreviousBookingSNo: $("#hdnPreviousBookingSNo").val(),
                PreviousBookingMasterRefNo: $("#hdnPreviousBookingMasterRefNo").val(),
                AWBSNo: currentawbsno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        currentawbsno = 0;
        currentawbno = "";

        SelectedAWBOriginDestination('Copy');
        GetItineraryCarrierCode($("#Text_AWBCode").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBCode").data("kendoAutoComplete").key());
        if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") {
            SplitShipmentAllowed();
            if (SplitLoaded.toUpperCase() == "YES" && IsSplitShipmentAllowed == false)
                ClearItineraryRoute();
        }

    }
    //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
    //$("#Text_Product").data("kendoAutoComplete").enable(false)
    //}
    if (AWBStatusNo > 5 && AWBStatusNo != 15) {       //No Show Work Commented
        if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True') { }

        else if (userContext.SysSetting.IsExecuteCancelShipment.toUpperCase()== 'TRUE' && AWBStatusNo == 16) { }
        else if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16) {
            $("#btnSave").css("display", "none");
            $("#btnUpdate").css("display", "none");
            //$("#btnCopyBooking").css("display", "none");
            $("#btnExecute").css("display", "none");

            $("#AddDimension").css("display", "none");

            $("#ItineraryViewRoute").css("display", "none");
            $("#ItinerarySearch").css("display", "none");
            $("#btnClearItineraryRoute").css("display", "none");
            $("#tblItinerary").css("display", "none");
            var table = document.getElementById("tblSelectdRouteResult");
            if (table != null && table.rows.length > 1) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("button[id^='Delete_']").css("display", "none");
                });
            }
            ShowMessage('warning', 'Information!', "Air Waybill is already marked as Cancelled. Cannot be executed again.");
        }
        else {
            $("#btnSave").css("display", "none");

            //$("#btnCopyBooking").css("display", "none");
            $("#btnExecute").css("display", "none");

            if (Action == "UPDATE" && AWBStatusDetails == "Cancel" && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA') { }
            else {
                $("#btnUpdate").css("display", "none");
                $("#AddDimension").css("display", "none");
                $("#tblItinerary").css("display", "none");
                $("#ItineraryViewRoute").css("display", "none");
                $("#ItinerarySearch").css("display", "none");
                $("#btnClearItineraryRoute").css("display", "none");
            }
            var table = document.getElementById("tblSelectdRouteResult");
            if (table != null && table.rows.length > 1) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("button[id^='Delete_']").css("display", "none");
                });
            }
        }
    }
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 15) {
        if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 15 && IsApproveCancelShipment == 'True') { }
        else {
            $("#btnSave").css("display", "none");
            $("#btnUpdate").css("display", "none");
            //$("#btnCopyBooking").css("display", "none");
            $("#btnExecute").css("display", "none");

            $("#AddDimension").css("display", "none");

            $("#ItineraryViewRoute").css("display", "none");
            $("#ItinerarySearch").css("display", "none");
            $("#btnClearItineraryRoute").css("display", "none");
            $("#tblItinerary").css("display", "none");
            var table = document.getElementById("tblSelectdRouteResult");
            if (table != null && table.rows.length > 1) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("button[id^='Delete_']").css("display", "none");
                });
            }
            ShowMessage('warning', 'Information!', "Air Waybill is already marked as NO SHOW. Cannot be executed again.");
        }
    }
    //if (AWBStatusNo == 15)       //No Show Work Commented
    //    ClearItineraryRoute();
    if (userContext.AgentSNo > 0 && AWBStatusDetails != "Booked" && AWBStatusDetails != "BKD" && AWBStatusDetails != "" && (Action != "NEW" || Action != "COPY")) {
        if (topUpAgentLogin > 0 && userContext.SysSetting.ClientEnvironment.toUpperCase() == 'GA') {
            if (NoOfREExecuted >= ACReplanCount) {
            $("#btnSave").css("display", "none");
            $("#btnUpdate").css("display", "none");
            $("#btnCopyBooking").css("display", "block");
            $("#btnExecute").css("display", "none");
            $("#AddDimension").css("display", "none");
            $("#ItineraryViewRoute").css("display", "none");
            $("#ItinerarySearch").css("display", "none");
            $("#btnClearItineraryRoute").css("display", "none");
            $("#tblItinerary").css("display", "none");
            var tab = document.getElementById("tblSelectdRouteResult");
            if (tab != null && tab.rows.length > 1) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("button[id^='Delete_']").css("display", "none");
                });
            }
          }
        }
        else{
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "block");
        if (userContext.SysSetting.ICMSEnvironment != 'JT') {
            $("#btnExecute").css("display", "none");
            $("#AddDimension").css("display", "none");

            $("#ItineraryViewRoute").css("display", "none");
            $("#ItinerarySearch").css("display", "none");
            $("#btnClearItineraryRoute").css("display", "none");
            $("#tblItinerary").css("display", "none");
            var table = document.getElementById("tblSelectdRouteResult");
            if (table != null && table.rows.length > 1) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("button[id^='Delete_']").css("display", "none");
                });
            }
        }
    }
    }
    //if (userContext.AgentSNo > 0)
    GetAgentMultiOriginPermission();
}
var ProductAsPerAgent = '';
var AgentMultiOriginPermission = '';
var OtherAirlineAccess = '';
var AccountAirlineTransDetails = '';
function GetAgentMultiOriginPermission() {
    AgentMultiOriginPermission = '';
    //if (userContext.AgentSNo > 0) {
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAgentMultiOriginPermission",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AgentSNo: userContext.AgentSNo },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    AgentMultiOriginPermission = myData.Table0[0].OriginSNo;
                    OtherAirlineAccess = myData.Table0[0].OtherAirlineAccess;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    //}
}
function GetProductAsPerAgent() {
    ProductAsPerAgent = '';
    if ($("#Text_AWBAgent").val() != "" && $("#Text_AWBAgent").val() != undefined) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetProductAsPerAgent",
            async: false,
            type: "GET",
            dataType: "json",
            data: { AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key() },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    //if (myData.Table0.length > 0) {
                    ProductAsPerAgent = myData.Table0[0].ProductSNo;
                    IsAsAgreedAgent = myData.Table0[0].IsAsAgreedAgent;
                    OverRideAsAgreed = myData.Table0[0].OverRideAsAgreed;
                    if (userContext.SysSetting.PriorityBasedOnProduct == "True" && myData.Table0[0].IsVisibilityofPriority == "0") {
                        $("#Text_Priority").data("kendoAutoComplete").enable(false);

                    }
                    else {
                        $("#Text_Priority").data("kendoAutoComplete").enable(true);
                    }
                    //}
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function GetAccountAirlineTransDetails() {
    AccountAirlineTransDetails = '';
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAccountAirlineTransDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].AirlineAWBPrefix != '')
                        AccountAirlineTransDetails = myData.Table0[0].AirlineAWBPrefix;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function ExtraCondition(textId) {
    if (textId.indexOf("Text_Product") >= 0 && textId.indexOf("Text_Product") < 2) {
        GetProductAsPerAgent();
    }
    if (userContext.AgentSNo > 0) {
        if (textId.indexOf("Text_AWBAgent") >= 0 && textId.indexOf("Text_AWBAgent") < 2) {
            GetAccountAirlineTransDetails();
        }
    }
    var MainfiltertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
    var filterAWBAgent = cfi.getFilter("AND");
    var MainfilterOtherNatureofGoods = cfi.getFilter("AND");
    var SPHCDGRFilter = cfi.getFilter("AND");
    var filterShipperCity = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");
    var ItineraryFlightNoFilter = cfi.getFilter("AND");
    var AllotmentFilter = cfi.getFilter("AND");
    var AWBOriginFilter = cfi.getFilter("AND");
    var AWBDestinationFilter = cfi.getFilter("AND");
    var searchOriginCityFilter = cfi.getFilter("AND");
    var searchDestinationCityFilter = cfi.getFilter("AND");
    var ItineraryOriginFilter = cfi.getFilter("AND");
    var ItineraryDestinationFilter = cfi.getFilter("AND");
    var SPHCFilter = cfi.getFilter("AND");
    var filterUnNo = cfi.getFilter("AND");
    var filterSubRisk = cfi.getFilter("AND");
    var filterSLINo = cfi.getFilter("AND");
    var filterPakagingGroup = cfi.getFilter("AND");
    var filterPackingInst = cfi.getFilter("AND");
    var filterErg = cfi.getFilter("AND");
    var SHCSubGrioupFilter = cfi.getFilter("AND");
    var DocTypeFilter = cfi.getFilter("AND");
    var AWBCodeFilter = cfi.getFilter("AND");
    var ItineraryCarrierCodeFilter = cfi.getFilter("AND");
    var searchReferenceNoFilter = cfi.getFilter("AND");
    var searchAWBNoFilter = cfi.getFilter("AND");
    var ProductFilter = cfi.getFilter("AND");
    var filterNotifyCity = cfi.getFilter("AND");
    var filterMCommoditiy = cfi.getFilter("AND");
    var filterPriority = cfi.getFilter("AND");
    var filterDueCarrierCode = cfi.getFilter("AND");
    var searchHSCode = cfi.getFilter("AND");
    var searchOriginAirportFilter = cfi.getFilter("AND");
    var searchDestinationAirportFilter = cfi.getFilter("AND");
    var filterCustomerBillingCity = cfi.getFilter("AND");
    if (textId.indexOf("tblDimensionULDTab_ULDTypeSNo") >= 0) {
        var FilterAirlineCode = "";
        if ($("#Text_AWBCode").data("kendoAutoComplete").key() != "" && $("#Text_AWBCode").data("kendoAutoComplete").key() != undefined) {
            FilterAirlineCode = $("#Text_AWBCode").data("kendoAutoComplete").key();
        }
        else if (userContext.AirlineName != null && userContext.AirlineName != "") {
            if (userContext.AirlineName.length > 6) {
                FilterAirlineCode = userContext.AirlineName.split('-')[0];
            }
        }

        //var filtertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
        //cfi.setFilter(filtertblDimensionULDTab_ULDTypeSNo, "AirlineCode", "eq", FilterAirlineCode);

        //MainfiltertblDimensionULDTab_ULDTypeSNo = cfi.autoCompleteFilter(filtertblDimensionULDTab_ULDTypeSNo);
        //return MainfiltertblDimensionULDTab_ULDTypeSNo;
    }
    else if (textId.indexOf("Text_Notify_City") >= 0) {
        var filterNCity = cfi.getFilter("AND");
        cfi.setFilter(filterNCity, "CountrySNo", "eq", $("#Text_Notify_CountryCode").data("kendoAutoComplete").key());
        filterNotifyCity = cfi.autoCompleteFilter(filterNCity);
        return filterNotifyCity;
    }

    else if (textId.indexOf("Text_CustomerBilling_City") >= 0) {
        var filterNCity = cfi.getFilter("AND");
        cfi.setFilter(filterNCity, "CountrySNo", "eq", $("#Text_CustomerBilling_CountryCode").data("kendoAutoComplete").key());
        filterCustomerBillingCity = cfi.autoCompleteFilter(filterNCity);
        return filterCustomerBillingCity;
    }
    else if (textId.indexOf("Text_Product") >= 0) {
        //var BookingType = $('input:radio[name=BookingType]:checked').val();
        //if (BookingType == 1) {

        //}
        if (ProductAsPerAgent != "" && ProductAsPerAgent != "0") {
            var filterProduct = cfi.getFilter("AND");
            cfi.setFilter(filterProduct, "SNo", "in", ProductAsPerAgent);
            ProductFilter = cfi.autoCompleteFilter(filterProduct);
            return ProductFilter;
        }
    }
    else if (textId.indexOf("Text_ItineraryFlightNo") >= 0) {
        var filter = cfi.getFilter("AND");
        if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "")
            cfi.setFilter(filter, "CarrierCode", "eq", $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key());
        cfi.setFilter(filter, "FlightDate", "eq", $("#ItineraryDate").val());
        cfi.setFilter(filter, "IsCancelled", "eq", "0");
        ItineraryFlightNoFilter = cfi.autoCompleteFilter(filter);
        return ItineraryFlightNoFilter;
    }
    else if (textId.indexOf("Text_AWBCode") >= 0) {
        var filterAWBCode = cfi.getFilter("AND");
        //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC")
        //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC" || userContext.AgentSNo > 0)
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            if (userContext.AgentSNo > 0) {
                if (OtherAirlineAccess != "1" && OtherAirlineAccess != "" && OtherAirlineAccess != undefined)
                    cfi.setFilter(filterAWBCode, "SNo", "in", OtherAirlineAccess);
            }
            AWBCodeFilter = cfi.autoCompleteFilter(filterAWBCode);
            return AWBCodeFilter;
        }
    }
    else if (textId.indexOf("Text_ItineraryCarrierCode") >= 0) {
        var filterItineraryCarrierCode = cfi.getFilter("AND");
        //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC")
        //	cfi.setFilter(filterItineraryCarrierCode, "IsInterline", "notin", 1);
        ItineraryCarrierCodeFilter = cfi.autoCompleteFilter(filterItineraryCarrierCode);
        return ItineraryCarrierCodeFilter;
    }
    else if (textId.indexOf("Text_AWBOrigin") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        if (userContext.SysSetting.ICMSEnvironment != 'GA') {
            if (AgentMultiOriginPermission != "1")
                cfi.setFilter(filterAWBOrigin, "SNo", "in", AgentMultiOriginPermission);
            //if (userContext.AgentSNo > 0)
            //    cfi.setFilter(filterAWBOrigin, "SNo", "in", AgentMultiOriginPermission);
        }
        AWBOriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return AWBOriginFilter;
    }
    else if (textId.indexOf("Text_AWBDestination") >= 0) {
        var filterAWBDestination = cfi.getFilter("AND");
        cfi.setFilter(filterAWBDestination, "SNo", "notin", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        AWBDestinationFilter = cfi.autoCompleteFilter(filterAWBDestination);
        return AWBDestinationFilter;

    }
    else if (textId.indexOf("Text_ItineraryOrigin") >= 0) {
        var filterItineraryOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterItineraryOrigin, "SNo", "notin", $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
        ItineraryOriginFilter = cfi.autoCompleteFilter(filterItineraryOrigin);
        return ItineraryOriginFilter;
    }
    else if (textId.indexOf("Text_ItineraryDestination") >= 0) {
        var filterItineraryDestination = cfi.getFilter("AND");
        cfi.setFilter(filterItineraryDestination, "SNo", "notin", $("#Text_ItineraryOrigin").data("kendoAutoComplete").key());
        ItineraryDestinationFilter = cfi.autoCompleteFilter(filterItineraryDestination);
        return ItineraryDestinationFilter;
    }
    else if (textId.indexOf("Text_searchReferenceNo") >= 0) {
        var filtersearchReferenceNo = cfi.getFilter("AND");
        //cfi.setFilter(filtersearchReferenceNo, "OriginCitySNo", "eq", userContext.CitySNo);
        if (AgentMultiOriginPermission != "1")
            cfi.setFilter(filtersearchReferenceNo, "OriginCitySNo", "in", AgentMultiOriginPermission);
        searchReferenceNoFilter = cfi.autoCompleteFilter(filtersearchReferenceNo);
        return searchReferenceNoFilter;
    }
    else if (textId.indexOf("Text_searchAWBNo") >= 0) {
        var filtersearchAWBNo = cfi.getFilter("AND");
        //cfi.setFilter(filtersearchAWBNo, "OriginCitySNo", "eq", userContext.CitySNo);
        if (AgentMultiOriginPermission != "1")
            cfi.setFilter(filtersearchAWBNo, "OriginCitySNo", "in", AgentMultiOriginPermission);
        searchAWBNoFilter = cfi.autoCompleteFilter(filtersearchAWBNo);
        return searchAWBNoFilter;
    }
    else if (textId.indexOf("Text_searchOriginCity") >= 0) {
        var filtersearchOriginCity = cfi.getFilter("AND");
        cfi.setFilter(filtersearchOriginCity, "CityCode", "notin", $("#Text_searchDestinationCity").data("kendoAutoComplete").key());
        searchOriginCityFilter = cfi.autoCompleteFilter(filtersearchOriginCity);
        return searchOriginCityFilter;
    }
    else if (textId.indexOf("Text_searchDestinationCity") >= 0) {
        var filtersearchDestinationCity = cfi.getFilter("AND");
        cfi.setFilter(filtersearchDestinationCity, "CityCode", "notin", $("#Text_searchOriginCity").data("kendoAutoComplete").key());
        searchDestinationCityFilter = cfi.autoCompleteFilter(filtersearchDestinationCity);
        return searchDestinationCityFilter;
    }
    else if (textId.indexOf("Text_Allotment_") >= 0) {
        var result = textId.split('_')[2];
        var filterAllotment = cfi.getFilter("AND");
        cfi.setFilter(filterAllotment, "DailyFlightSNo", "eq", result);
        cfi.setFilter(filterAllotment, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
        AllotmentFilter = cfi.autoCompleteFilter(filterAllotment);
        return AllotmentFilter;
    }
    else if (textId.indexOf("Text_AWBAgent") >= 0) {
        var FilterAirlineCode = "";
        if (userContext.AirlineName != null && userContext.AirlineName != "") {
            if (userContext.AirlineName.length > 6) {
                FilterAirlineCode = userContext.AirlineName.split('-')[0];
            }
        }
        var AWBAgentfilter = cfi.getFilter("AND");
        var AWBAgentfilterOR = cfi.getFilter("OR");
        if (userContext.SysSetting.InterlineAgentSNo != "" && userContext.SysSetting.InterlineAgentSNo != undefined)
            cfi.setFilter(AWBAgentfilter, "SNo", "notin", userContext.SysSetting.InterlineAgentSNo);
        if (userContext.SysSetting.ICMSEnvironment == 'GA') {
            //cfi.setFilter(AWBAgentfilter, "CitySNo", "in", "" + $("#Text_AWBOrigin").data("kendoAutoComplete").key() + ',' + userContext.CitySNo + "");
            cfi.setFilter(AWBAgentfilter, "CitySNo", "in", "" + userContext.CitySNo + "");
        }
        else
            cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());

        // cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", FilterAirlineCode);
        //cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());//agent was not comming of othere ailine due to userContext.AirlineName condition
        if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
            //cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "POS,SUB AGENT,CORPORATE");
            cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            if (userContext.OfficeSNo > 0) {
                cfi.setFilter(AWBAgentfilter, "AccountTypeName", "neq", "FORWARDER");
                if (userContext.GroupName == "POS-CSC")
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "SUB AGENT,CORPORATE,POST OFFICE");
                else
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "SUB AGENT,CORPORATE");
                cfi.setFilter(AWBAgentfilterOR, "OfficeSNo", "eq", userContext.OfficeSNo);
            }
            else {
                if (userContext.GroupName == "POS-CSC")
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "POS,SUB AGENT,CORPORATE,POST OFFICE");
                else
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "POS,SUB AGENT,CORPORATE");
            }
        }
        else if (userContext.GroupName == "OUTLET") {
            cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "OUTLET");
        }
        else if (userContext.GroupName == "ADMIN" || userContext.GroupName == "SUPER ADMIN") {
            cfi.setFilter(AWBAgentfilter, "TransAirlineCode", "contains", $("#Text_AWBCode").data("kendoAutoComplete").key());

            //cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            ////cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        }

        else if (userContext.UserTypeName == "GSA" || userContext.UserTypeName == "CSA" || userContext.UserTypeName == "GSSA") {
            cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            cfi.setFilter(AWBAgentfilter, "OfficeSNo", "eq", userContext.OfficeSNo);
        }
        else {
            if (userContext.AgentSNo > 0) {
                if (AccountAirlineTransDetails != '')
                    cfi.setFilter(AWBAgentfilter, "AirlineCode", "in", AccountAirlineTransDetails);
                else
                    cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
                cfi.setFilter(AWBAgentfilter, "AccountTypeName", "eq", "FORWARDER");
            }
            else {
                cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
                //cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
            }
        }
        if ($('input:radio[name=BookingType]:checked').val() == "2")
            cfi.setFilter(AWBAgentfilter, "AccountTypeName", "eq", "GO BAGGAGE");
        if ((userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") && userContext.OfficeSNo > 0) {
            filterAWBAgent = cfi.autoCompleteFilter([AWBAgentfilter, AWBAgentfilterOR], "OR");
        }
        else {
            filterAWBAgent = cfi.autoCompleteFilter(AWBAgentfilter);
        }

        ////filterAWBAgent = cfi.autoCompleteFilter(AWBAgentfilter);
        //filterAWBAgent = cfi.autoCompleteFilter([AWBAgentfilter, AWBAgentfilterOR], "OR");
        return filterAWBAgent;
    }
    else if (textId.indexOf("Text_OtherNatureofGoods") >= 0) {
        var filterOtherNatureofGoods = cfi.getFilter("AND");
        cfi.setFilter(filterOtherNatureofGoods, "CommoditySNo", "notin", $("#Text_OtherNatureofGoods").data("kendoAutoComplete").key());
        for (var i = 0; i <= 10; i++) {
            if ($('#OtherNatureofGoods_' + [i]).val() != undefined && $('#OtherNatureofGoods_' + [i]).val() != '' && 'OtherNatureofGoods_' + [i] != 'OtherNatureofGoods_' + textId.split('_')[2])
                cfi.setFilter(filterOtherNatureofGoods, "CommoditySNo", "notin", $('#OtherNatureofGoods_' + [i]).val());
        }
        MainfilterOtherNatureofGoods = cfi.autoCompleteFilter(filterOtherNatureofGoods);
        return MainfilterOtherNatureofGoods;
    }
    else if (textId.indexOf("Text_SHC") >= 0) {
        var filterSPHC2 = cfi.getFilter("AND");
        //cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");
        cfi.setFilter(filterSPHC2, "SNo", "notin", $("#SHC").val());
        SPHCDGRFilter = cfi.autoCompleteFilter(filterSPHC2);
        return SPHCDGRFilter;
    }
    else if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");
        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key());
        cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");
        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_SHIPPER_City").data("kendoAutoComplete").key());
        cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    //else if (textId.indexOf("Text_SHIPPER_CountryCode") >= 0) {
    //    var filterSCity = cfi.getFilter("AND");
    //    cfi.setFilter(filterSCity, "SNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
    //    filterShipperCity = cfi.autoCompleteFilter(filterSCity);
    //    return filterShipperCity;
    //}
    //else if (textId.indexOf("Text_CONSIGNEE_CountryCode") >= 0) {
    //    var filterCCity = cfi.getFilter("AND");
    //    cfi.setFilter(filterCCity, "SNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
    //    filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
    //    return filterConsigneeCity;
    //}

    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        var SHIPPER_AccountNo2 = cfi.getFilter("AND");
        if (userContext.SysSetting.IsShowShipperConsigneeOnAgent == "True" && userContext.AgentSNo > 0) {
            cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
            cfi.setFilter(SHIPPER_AccountNo2, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
            cfi.setFilter(SHIPPER_AccountNo2, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
            ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
            return ShipperAccountFilter;
        }
        else {
            cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
            cfi.setFilter(SHIPPER_AccountNo2, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
            ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
            return ShipperAccountFilter;
        }
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        var ConsigneeFilter2 = cfi.getFilter("AND");
        if (userContext.SysSetting.IsShowShipperConsigneeOnAgent == "True" && userContext.AgentSNo > 0) {
            cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
            cfi.setFilter(ConsigneeFilter2, "CitySNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
            cfi.setFilter(ConsigneeFilter2, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
            ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
            return ConsigneeFilter;
        }
        else {
            cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
            cfi.setFilter(ConsigneeFilter2, "CitySNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
            ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
            return ConsigneeFilter;
        }
    }
    else if (textId.indexOf("Text_SPHC") >= 0) {
        var filterSPHC1 = cfi.getFilter("AND");
        cfi.setFilter(filterSPHC1, "IsDGR", "eq", "1");
        SPHCFilter = cfi.autoCompleteFilter(filterSPHC1);
        return SPHCFilter;
    }
    else if (textId.indexOf("Text_UnNo") >= 0) {
        var _filterUnNo = cfi.getFilter("AND");
        cfi.setFilter(_filterUnNo, "UNNumber", "neq", '');
        filterUnNo = cfi.autoCompleteFilter(_filterUnNo);
        return filterUnNo;
    }
    else if (textId.indexOf("Text_SubRisk") >= 0) {
        var _filterSubRisk = cfi.getFilter("AND");
        cfi.setFilter(_filterSubRisk, "SubRisk", "neq", '');
        cfi.setFilter(_filterSubRisk, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSubRisk = cfi.autoCompleteFilter(_filterSubRisk);
        return filterSubRisk;
    }
    else if (textId.indexOf("Text_Class") >= 0) {
        var _filterSLINo = cfi.getFilter("AND");
        cfi.setFilter(_filterSLINo, "ClassDivSub", "neq", '');
        cfi.setFilter(_filterSLINo, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSLINo = cfi.autoCompleteFilter(_filterSLINo);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_PackingGroup") >= 0) {
        var _filterPakagingGroup = cfi.getFilter("AND");
        cfi.setFilter(_filterPakagingGroup, "PackingGroup", "neq", '');
        cfi.setFilter(_filterPakagingGroup, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        filterPakagingGroup = cfi.autoCompleteFilter(_filterPakagingGroup);
        return filterPakagingGroup;
    }
    else if (textId.indexOf("Text_PackingInst") >= 0) {
        var _filterPackingInst = cfi.getFilter("AND");
        cfi.setFilter(_filterPackingInst, "PackingInst", "neq", '');
        cfi.setFilter(_filterPackingInst, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        if (($("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").key() || 0) != 0) {
            cfi.setFilter(_filterPackingInst, "PackingGroup", "eq", $("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").value());
        }
        filterPackingInst = cfi.autoCompleteFilter(_filterPackingInst);
        return filterPackingInst;
    }
    else if (textId.indexOf("Text_ERG") >= 0) {
        var _filterErg = cfi.getFilter("AND");
        cfi.setFilter(_filterErg, "ERGN", "neq", '');
        cfi.setFilter(_filterErg, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterErg = cfi.autoCompleteFilter(_filterErg);
        return filterErg;
    }
    else if (textId.indexOf("Text_SubGroup_") >= 0) {
        var _SHCSubgrpErg = cfi.getFilter("AND");
        cfi.setFilter(_SHCSubgrpErg, "SPHCSNo", "eq", $("#" + textId).closest('tr').find("input[id^='SHCSNo_']").val());
        SHCSubGrioupFilter = cfi.autoCompleteFilter(_SHCSubgrpErg);
        return SHCSubGrioupFilter;
    }
    else if (textId.indexOf("Text_DocType") >= 0) {
        var FilterDocType = cfi.getFilter("AND");
        cfi.setFilter(FilterDocType, "ApplicableIn", "in", "0,3");
        DocTypeFilter = cfi.autoCompleteFilter(FilterDocType);
        return DocTypeFilter;
    }
    else if (textId.indexOf("tblInsurance_CommoditySNo_") >= 0) {
        var filterMcom = cfi.getFilter("AND");
        cfi.setFilter(filterMcom, "AirlineSNo", "eq", userContext.AirlineSNo);
        filterMCommoditiy = cfi.autoCompleteFilter(filterMcom);
        return filterMCommoditiy;
    }

    else if (textId.indexOf("Text_Priority") >= 0 && userContext.SysSetting.PriorityBasedOnProduct == "True") {
        var filterPrt = cfi.getFilter("AND");
        cfi.setFilter(filterPrt, "ProductSNo", "eq", $("#Text_Product").data("kendoAutoComplete").key());
        filterPriority = cfi.autoCompleteFilter(filterPrt);
        return filterPriority;
    }
    else if (textId.indexOf("tblAgentOtherChargeTab_OtherChargeCode_") >= 0) {
        var filterDuecrcode = cfi.getFilter("AND");
        //  cfi.setFilter(filterDuecrcode, "IsCarrier", "eq", 0); 
        cfi.setFilter(filterDuecrcode, "IsActive", "eq", 1);

        filterDueCarrierCode = cfi.autoCompleteFilter(filterDuecrcode);
        return filterDueCarrierCode;
    }
    else if (textId.indexOf("tblDueCarrierOtherChargeTab_OtherChargeCode_") >= 0) {
        var filterDuecrcode = cfi.getFilter("AND");
        //   cfi.setFilter(filterDuecrcode, "IsCarrier", "eq", 1);
        cfi.setFilter(filterDuecrcode, "IsActive", "eq", 1);
        filterDueCarrierCode = cfi.autoCompleteFilter(filterDuecrcode);
        return filterDueCarrierCode;
    }
    else if (textId.indexOf("Text_HSCode10") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode11") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode1") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode2") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode3") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode4") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode5") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode6") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode7") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode8") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode9") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_searchOriginAirport") >= 0) {
        var filtersearchOriginAirport = cfi.getFilter("AND");
        cfi.setFilter(filtersearchOriginAirport, "AirportCode", "notin", $("#Text_searchDestinationAirport").data("kendoAutoComplete").key());
        searchOriginAirportFilter = cfi.autoCompleteFilter(filtersearchOriginAirport);
        return searchOriginAirportFilter;
    }
    else if (textId.indexOf("Text_searchDestinationAirport") >= 0) {
        var filtersearchDestinationAirport = cfi.getFilter("AND");
        cfi.setFilter(filtersearchDestinationAirport, "AirportCode", "notin", $("#Text_searchOriginAirport").data("kendoAutoComplete").key());
        searchDestinationAirportFilter = cfi.autoCompleteFilter(filtersearchDestinationAirport);
        return searchDestinationAirportFilter;
    }
}
function CleanUI() {
    $("#ApplicationTabs-1").html("");
    $("#ApplicationTabs-2").html("");
    $("#ApplicationTabs-3").html("");
    $("#ApplicationTabs-4").html("");
    $("#ApplicationTabs-5").html("");

    $("#btnSave").unbind("click");
    $("#btnUpdate").unbind("click");
    $("#btnCopyBooking").unbind("click");
    $("#btnExecute").unbind("click");
    $("#ulReservation").hide();
    $("#ApplicationTabs").hide();

    $("#btnSave").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnCopyBooking").css("display", "none");
    $("#btnExecute").css("display", "none");
    $("#btnNew").css("display", "block");
    $("#divEDox").html("");
    //$("#divXRAY").hide();
    //$("#tblShipmentInfo").hide();
    //$("#divDetail").html("");
    //$("#divDetail").html("");
    //$("#tblShipmentInfo").hide();
    //$("#divNewBooking").html("");
    //$("#btnSave").unbind("click");

    //$("#divXRAY").hide();

    //$("#ulTab").hide();
    //$("#divDetail_SPHC").html("");
    //$("#divDetailSHC").html("");

    //$("#divTab3").html("");
    //$("#divTab4").html("");
    //$("#divTab5").html("");
    //$("#tabstrip").hide();
}
function ClearItineraryRoute(obj) {
    var theDiv = document.getElementById("divFinalSelectedroute");
    theDiv.innerHTML = "";
    var theDiv1 = document.getElementById("divFlightSearchResult");
    theDiv1.innerHTML = "";
    cfi.ResetAutoComplete("ItineraryOrigin");
    cfi.ResetAutoComplete("ItineraryDestination");
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true);
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.GroupName == "AGENT" && IsApproveCancelShipment == "True" && (AWBStatusDetails == "No Show" || AWBStatusDetails == "Cancel" || AWBStatusDetails == "EXE")) { }
    else
        $("#Text_AWBDestination").data("kendoAutoComplete").enable(true);
    $("#hdnETDTime").val('00:00');
    $("#hdnFlightDate").val('');
    $("#hdnArrFlightDate").val('');
    var AWBPieces = ($("#AWBPieces").val() == "" ? "" : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? "" : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? "" : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? "" : parseFloat($("#AWBVolumeWeight").val()));
    //$("#ItinerarySearch").attr('disabled', false);
    $("#ItineraryPieces").val(AWBPieces);
    $("#_tempItineraryPieces").val(AWBPieces);
    $("#ItineraryGrossWeight").val(AWBGrossWeight);
    $("#_tempItineraryGrossWeight").val(AWBGrossWeight);
    $("#ItineraryVolumeWeight").val(AWBCBM);
    $("#_tempItineraryVolumeWeight").val(AWBCBM);
    $("#ItineraryMainVolumeWeight").val(AWBVolumeWeight)
    $("#_tempItineraryMainVolumeWeight").val(AWBVolumeWeight)
    //if (userContext.SysSetting.ICMSEnvironment == 'JT') {
    //    $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
    //    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
    //    SelectedAWBOriginDestinationItineary('Text_AWBDestination');
    //}
    //else
    //{
    SelectedAWBOriginDestinationItineary('Text_AWBOrigin');
    SelectedAWBOriginDestinationItineary('Text_AWBDestination');
    //}
    if (!obj)
        window.scrollTo(0, 0);
}
function termsandcondtionTab(obj) {
    if ($("#litermsandcondtion.k-state-disabled").length == 0) {
        if ($("#Text_AWBDestination").data("kendoAutoComplete").value() == "") {
            $("#DivIndonesianTermCondition").hide();
            $("#DivEnglishTermCondition").show();
        }
        else {
            if ($("#Text_AWBCode").data("kendoAutoComplete").value() == "990" || $("#Text_AWBCode").data("kendoAutoComplete").value() == "513" || $("#Text_AWBCode").data("kendoAutoComplete").value() == "938") {
                if ($("#Text_AWBOrigin").data("kendoAutoComplete").value() != "" && $("#Text_AWBDestination").data("kendoAutoComplete").value() != "") {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/GetTermsandcondtion",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            AWBOriginSNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key() || 0,
                            AWBDestinationSNo: $("#Text_AWBDestination").data("kendoAutoComplete").key() || 0
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0[0].Result == "1") {
                                    $("#DivIndonesianTermCondition").show();
                                    $("#DivEnglishTermCondition").hide();
                                }
                                else {
                                    $("#DivIndonesianTermCondition").hide();
                                    $("#DivEnglishTermCondition").show();
                                }
                            } else {
                                $("#DivIndonesianTermCondition").hide();
                                $("#DivEnglishTermCondition").show();
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
                }
                else {
                    $("#DivIndonesianTermCondition").hide();
                    $("#DivEnglishTermCondition").show();
                }
            }
            else {
                $("#DivIndonesianTermCondition").hide();
                $("#DivEnglishTermCondition").show();
            }
        }
        setTimeout(function () { window.scrollTo(0, document.body.scrollHeight) }, 500);
    }
}
function RateAvailableOrNotNEW(FlightDate, FlightNo, AllotmentCode) {
    var Result = false;
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    if (BUPPieces > 0)
        BUPORIntactPieces = BUPPieces;
    else if (AWBNoofBUPIntact > 0)
        BUPORIntactPieces = AWBNoofBUPIntact;
    var Product = $("#Text_Product").data("kendoAutoComplete").value().toUpperCase();
    if (ServiceableProduct.length > 0) {
        if ($.inArray(Product, ServiceableProduct[0]) != '-1')
            Result = true;
    }

    //if ($("#Text_Product").data("kendoAutoComplete").value().toUpperCase() == "COMET")
    //    Result = true;
    //else {
    if (Result == false) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/RateAvailableOrNotNEW",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: $('input:radio[name=BookingType]:checked').val(),
                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                //BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : 0,
                BupPieces: $("#chkIsBUP").prop('checked') == true ? BUPORIntactPieces : 0,
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                OriginCity: $("#Text_AWBOrigin").data("kendoAutoComplete").value().split('-')[0],
                DestinationCity: $("#Text_AWBDestination").data("kendoAutoComplete").value().split('-')[0],
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                AWBPieces: $("#AWBPieces").val(),
                GrossWeight: $("#AWBGrossWeight").val(),
                VolumeWeight: $("#AWBVolumeWeight").val(),
                ChargeableWeight: $("#AWBChargeableWeight").val(),
                Volume: $("#AWBCBM").val(),
                UM: $("#Text_UM").data("kendoAutoComplete").value(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                NOG: $("#NatureOfGoods").val(),
                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                FlightDate: FlightDate,
                FlightNo: FlightNo,
                BookingReferenceNo: $("#hdnBookingMasterRefNo").val(),
                AllotmentCode: AllotmentCode
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].FinalRate != "") {
                            Result = true;
                        }
                        else {
                            Result = false;
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    return Result;
}
function RateAvailableOrNot() {
    var Result = false;
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    if (BUPPieces > 0)
        BUPORIntactPieces = BUPPieces;
    else if (AWBNoofBUPIntact > 0)
        BUPORIntactPieces = AWBNoofBUPIntact;
    var Product = $("#Text_Product").data("kendoAutoComplete").value().toUpperCase();
    if (ServiceableProduct.length > 0) {
        if ($.inArray(Product, ServiceableProduct[0]) != '-1')
            Result = true;
    }

    //if ($("#Text_Product").data("kendoAutoComplete").value().toUpperCase() == "COMET")
    //    Result = true;
    //else {
    if (Result == false) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/RateAvailableOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: $('input:radio[name=BookingType]:checked').val(),
                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                //BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : 0,
                BupPieces: $("#chkIsBUP").prop('checked') == true ? BUPORIntactPieces : 0,
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                OriginCity: $("#Text_AWBOrigin").data("kendoAutoComplete").value().split('-')[0],
                DestinationCity: $("#Text_AWBDestination").data("kendoAutoComplete").value().split('-')[0],
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                AWBPieces: $("#AWBPieces").val(),
                GrossWeight: $("#AWBGrossWeight").val(),
                VolumeWeight: $("#AWBVolumeWeight").val(),
                ChargeableWeight: $("#AWBChargeableWeight").val(),
                Volume: $("#AWBCBM").val(),
                UM: $("#Text_UM").data("kendoAutoComplete").value(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                NOG: $("#NatureOfGoods").val(),
                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].FinalRate != "") {
                            Result = true;
                        }
                        else {
                            Result = false;
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    return Result;
}
function IsInternationalBookingAgent(ItineraryAirportOrigin, ItineraryAirportDestination) {
    var Result = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/IsInternationalBookingAgent",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
            DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key(),
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
            ItineraryOrigin: ItineraryAirportOrigin,//$("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(),
            ItineraryDestination: ItineraryAirportDestination,//$("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key(),
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result == "1") {
                        Result = true;
                    }
                    else {
                        Result = false;
                        ShowMessage('warning', 'Information!', myData.Table0[0].ResultMessage);
                    }
                }
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return Result;
}

function SaveEDoxList() {
    var EDoxArray = [];
    var SPHCDoxArray = [];
    var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
    var Remarks = $("#Remarks").val();
    var flag = false;
    $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
        if ($(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key() || "0" > 0) {
            var eDoxViewModel = {
                EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
                DocName: $(this).find("span[id^='DocName']").text(),
                AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
                ReferenceNo: $(this).find("input[id^='Reference']").val(),
                Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
            };
            EDoxArray.push(eDoxViewModel);
        }
    });

    $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentsphcedoxinfo']").each(function () {
        var SPHCDoxViewModel = {
            SNo: $(this).find("span[id^='uploaddocsno']").text(),
            AWBSNo: currentawbsno,
            SPHCSNo: $(this).find("span[id^='sphcsno']").text(),
            DocName: $(this).find("span[id^='sphcdocname']").text(),
            AltDocName: $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata"),
            Remarks: $(this).find("textarea[id^='sphcdocremarks']").val()
        };
        SPHCDoxArray.push(SPHCDoxViewModel);
    });

    var isPriorApproval = $("#chkPriorApp").prop('checked') == true ? 1 : 0;
    var IsBOEVerification = $("#chkBoeVerifi").prop('checked') == true ? 1 : 0;
    var BOENo = $("#BOENo").val();
    var BOEDate = $("#BOEDate").val();

    var isFOC = $("#chkFOC").prop('checked') == true ? 1 : 0;
    var FOCTypeSNo = $("input[id^='Text_FOCType']").data("kendoAutoComplete").key();
    var FocRemarks = $("textarea[id^='FOCRemarks']").val();
    var BOEFlag = false;
    if (BOENo == "0") {
        $("#BOENo").val("");
    }

    if (BOEFlag == false) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/SaveAWBEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, AWBEDoxDetail: EDoxArray, SPHCDoxArray: SPHCDoxArray, AllEDoxReceived: AllEDoxReceived, Remarks: Remarks, PriorApproval: isPriorApproval, BOEVerification: IsBOEVerification, UpdatedBy: 2, BOENo: BOENo, BOEDate: BOEDate, isFOC: isFOC, FOCTypeSNo: FOCTypeSNo, FocRemarks: FocRemarks }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - e-Dox Information', "E-Dox Processed Successfully", "bottom-right");
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else
                    ShowMessage('warning', 'Warning - e-Dox Information', "E-Dox unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - e-Dox Information', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            },
            complete: function (xhr) {
                $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentsphcedoxinfo']").each(function () {
                    $(this).find("a[id^='ahref_sphcdocname']").attr("linkdata", '');
                });

            }
        });
    }
    return flag;
}
function BindEDox() {
    //cfi.AutoComplete("FOCType", "Foc_Type", "FocType", "SNo", "FocTypeCode", ["FocTypeCode", "Foc_Type"], null, "contains");
    cfi.AutoCompleteV2("FOCType", "Foc_Type", "Reservation_FOCType", null, "contains");
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetRecordAtAWBEDox?AWBSNo=" + currentawbsno, async: true, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            var alldocrcvd = edoxData.Table1;
            var SPHCDoc = edoxData.Table2;
            var PriorBOEArray = edoxData.Table3;
            var PicesArray = edoxData.Table4;

            var docRcvd = false;
            if (alldocrcvd.length > 0) {
                var docItem = alldocrcvd[0];
                docRcvd = docItem.IsAllEDoxRecieved.toLowerCase() == "true" ? true : false;
                // $("#XRay").prop("checked", docRcvd == "true" ? true : false);
                $("#XRay").prop("checked", docRcvd);
                //$("#XRay").val(resItem.XrayRequired);
                $("#Remarks").val(docItem.AllEDoxReceivedRemarks);
            }
            if (PicesArray.length > 0) {
                $("#tdPcs").text(PicesArray[0].AWBTOTALPIECES);
            }
            CheckContactNo("BOENo");
            cfi.makeTrans("shipment_reservationshipmentedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
            cfi.makeTrans("shipment_reservationshipmentsphcedoxinfo", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, SPHCDoc);
            $("#divareaTrans_shipment_reservationshipmentedoxinfo tr:first").find("font").remove();

            if (!docRcvd) {
                $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        //cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
                        cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Reservation_DocType", MakeFileMandatory, "contains");
                        if (SPHCDoc.length > 0 || (PriorBOEArray[0].PriorApproval == "True" || PriorBOEArray[0].IsBOEVerification == "True" || PriorBOEArray[0].IsFOC == "True")) {
                            $(this).closest('td').find("input[id^='Text_DocType']").removeAttr("data-valid");
                        }

                    });
                    $(this).find("input[id^='Text_DocType']").unbind("blur").bind("blur", function () {
                        RemoveFileMandatory($(this).closest('td').find("input[id^='Text_DocType']").attr("id"));
                    });

                    $(this).find("input[id^='DocsName']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadEDoxDocument($(this).attr("id"), "DocName");
                            if (SPHCDoc.length > 0 || (PriorBOEArray[0].PriorApproval == "True" || PriorBOEArray[0].IsBOEVerification == "True" || PriorBOEArray[0].IsFOC == "True")) {
                                $(this).removeAttr("data-valid");
                            }
                            WrapSelectedFileName();
                        })
                    });
                    $(this).find("a[id^='ahref_DocName']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadEDoxDocument($(this).attr("id"), "DocName");
                        })
                    });
                    $(this).find("input[type='file']").css('width', '');
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                });



                $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").find("table tr").each(function () {
                    $(this).find("td:eq(1)").css("display", "none");
                    $(this).find("td:eq(2)").css("display", "none");
                    $(this).find("td:eq(3)").css("display", "none");
                    $(this).find("td:eq(4)").css("display", "none");
                    $(this).find("td:last").remove();

                    $(this).find("input[id^='sphcdocsname']").each(function () {
                        $(this).unbind("change").bind("change", function () {
                            UploadSPHCDocument($(this).attr("id"), "sphcdocname");
                        })
                    });
                    $(this).find("a[id^='ahref_sphcdocname']").each(function () {
                        $(this).unbind("click").bind("click", function () {
                            DownloadSPHCDocument($(this).attr("id"), "sphcdocname");
                        })
                    });
                    if ($(this).find("span[id^='IsUploadMandatory']").text().toUpperCase() == "TRUE") {
                        if (($(this).find("span[id^='sphcdocname']").text() || "") == "") {
                            $(this).find("input[id^='sphcdocsname']").attr("data-valid", "required");
                        }
                    }

                    var DocSNo = $(this).find("span[id^='sphcdocumenttransnso']").text() || "0";
                    if (parseInt(DocSNo) > 0) {
                        $(this).find("a[id^='ahref_sampledocname']").each(function () {
                            $(this).unbind("click").bind("click", function () {
                                DownloadEDoxFromDB(DocSNo, "S");    //S== Sample Document Flag
                            })
                        });
                    }
                    else {
                        $(this).find("span[id^='sampledocname']").closest('td').html('');
                    }

                    $(this).find("input[type='file']").css('width', '');
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                });

            }
            else {
                var prevtr = $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("tr[id='areaTrans_shipment_reservationshipmentedoxinfo']").prev()
                prevtr.find("td:eq(2)").remove();
                prevtr.find("td:last").remove();
                $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("tr[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
                    $(this).find("td:eq(2)").remove();
                    $(this).find("td:last").remove();
                    $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
                })

                $("#btnSave").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
                $("#btnSaveToNext").unbind("click").bind("click", function () {
                    ShowMessage('info', 'E-Doc', "All document received.", "bottom-right");
                })
            }
            $("#BOEDate").data("kendoDatePicker").value("");

            if (SPHCDoc.length <= 0) {
                $("div[id$='areaTrans_shipment_reservationshipmentsphcedoxinfo']").remove();
            }
            if (PriorBOEArray.length > 0) {
                if (PriorBOEArray[0].PriorApproval == "False") {
                    $("#chkPriorApp").closest('table').hide();
                } else {
                    $("#chkPriorApp").prop('checked', PriorBOEArray[0].isPriorApproval == "False" ? false : true);
                    $("#chkPriorApp").attr('disabled', PriorBOEArray[0].isPriorApproval == "True" ? true : false)

                }
                //$("#chkBoeVerifi").prop('checked', PriorBOEArray[0].IsBOEVerification == "False" ? false : true);
                if (PriorBOEArray[0].IsBOEVerification == "True") {
                    $("#BOENo").val(PriorBOEArray[0].BOENo);
                    $("#BOEDate").data("kendoDatePicker").value(PriorBOEArray[0].BOEDate);
                    $("#chkBoeVerifi").prop('checked', true);
                    // $("#BOENo").prop('disabled', true);
                    //$("#BOEDate").data("kendoDatePicker").enable(false);
                } else {
                    $("#chkBoeVerifi").prop('checked', false);
                    $("#BOENo").val(PriorBOEArray[0].BOENo);
                    if (PriorBOEArray[0].BOEDate != "") {
                        $("#BOEDate").data("kendoDatePicker").value(PriorBOEArray[0].BOEDate);
                        $("#BOEDate").data("kendoDatePicker").enable(false);
                    }
                }
            }
            $("#chkBoeVerifi").closest('table').hide();
            //FOC Shipment Starst
            if (userContext.SpecialRights.AWBFOC != true) {
                $("input[id='chkFOC']").closest("table").hide();
            } else {
                if (PriorBOEArray[0].IsFOC == "True") {
                    $("#chkFOC").prop('checked', true);
                    $("input[id^='Text_FOCType']").data("kendoAutoComplete").setDefaultValue(PriorBOEArray[0].FocTypeSNo, PriorBOEArray[0].Text_FocType);
                    $("textarea[id^='FOCRemarks']").val(PriorBOEArray[0].FocRemarks);
                } else {
                    $("#chkFOC").prop('checked', false);
                    $("input[id^='Text_FOCType']").data("kendoAutoComplete").enable(false);
                    $("textarea[id^='FOCRemarks']").attr('disabled', true);
                }
            }
            if (PicesArray.length > 0) {
                if (PicesArray[0].FreezFOC == 1) {
                    $("#chkFOC").attr('disabled', true);
                    $("input[id^='Text_FOCType']").data("kendoAutoComplete").enable(false);
                    $("textarea[id^='FOCRemarks']").attr('disabled', true);
                }
            }
        },
        error: {

        }
    });
}
function UploadSPHCDocument(objId, nexctrlid) {
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    //if (files['0'].size > 10240)
    //    alert("Max image size is 10 mb");
    //else {
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "Handler/UploadImage.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
    //}
}
function DownloadSPHCDocument(objId, nexctrlid) {
    if (parseInt($("#" + objId).closest('tr').find("span[id^='uploaddocsno']").text() || "0") > 0) {
        DownloadEDoxFromDB(parseInt($("#" + objId).closest('tr').find("span[id^='uploaddocsno']").text() || "0"), "O")
    }
    else {
        if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
            window.location.href = "Handler/FileUploadHandler.ashx?l=UploadImage&f=" + $("#" + objId).attr("linkdata");
        }
        else {
            ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
        }
    }

}
function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + $("#" + objId).attr("linkdata");

    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}
function DownloadEDoxFromDB(DocSNo, DocFlag) {
    if (parseInt(DocSNo) > 0) {
        window.location.href = "Handler/FileUploadHandler.ashx?DocSNo=" + DocSNo + "&DocFlag=" + DocFlag;
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}
function WrapSelectedFileName() {
    $("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
        $(this).find("span[id^='DocName']").closest('td').css("white-space", "inherit");
        $(this).find("input[type='file'][id^='DocsName']").css('width', '');
        $(this).find("input[id^='Text_DocType']").parent('span').css('width', '120px');
    });

}
function MakeFileMandatory(e) {
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").attr("data-valid", "required");
    } else {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").removeAttr("data-valid");
    }
}
function RemoveFileMandatory(e) {
    if ($("#" + e).val() == "") {
        $("#" + e).closest('tr').find("[id^='DocsName']").removeAttr("data-valid");
    }
}
function CheckContactNo(ctrlID) {
    $("input[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}
function BindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='DocType']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
        cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Reservation_DocType", MakeFileMandatory, "contains");
    });
    //$(elem).closest("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
    //    $(this).find("input[id^='DocType']").each(function () {
    //        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
    //    });
    //});
    $(elem).find("input[type='file']").attr("data-valid-msg", "Attach Document");
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
    WrapSelectedFileName();
}
function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_reservationshipmentedoxinfo']").find("[id^='areaTrans_shipment_reservationshipmentedoxinfo']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "Reservation_DocType");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, MakeFileMandatory);
        });
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

var BackEndFileExtension = [];
var extension = '';
function UploadEDoxDocument(objId, nexctrlid) {

    var userobject = userContext.SysSetting.AllowedUploadFileExtension.toUpperCase().split(',');
    BackEndFileExtension.push(userobject);
    // var extension = file.substr((file.lastIndexOf('.') + 1));
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;

    var fileName1 = files.item(0).name;

    extension = (fileName1.toUpperCase().substr((fileName1.toUpperCase().lastIndexOf('.') + 1)));
    var fileName = "";


    if ($.inArray(extension, BackEndFileExtension[0]) != '-1') {
        // alert(extension + ' is in the array!');
    }
    else {
        alert('Please Select only ' + BackEndFileExtension[0] + ' Extension(s)');
        return;
    }


    var fsize = files.item(0).size;
    // alert(fsize);
    var sizeInMB = fsize / 1048576;
    // alert(parseFloat(sizeInMB).toFixed(2));
    if (parseFloat(sizeInMB).toFixed(2) > 3) {
        alert('Please upload either 3 MB and Less than 3 MB ');
        return;
    }



    var d = new Date();
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = d.toGMTString().substr(6, 19).replace(/ /g, "_") + '_' + userContext.UserSNo + '__' + files[i].name;
        data.append(fileName, files[i]);

        // var fsize = files.item(i).size;
    }
    if ((fileName.length) - (('.' + fileName.split('.').pop()).length) > 150) {
        ShowMessage('info', 'File Upload!', "Unable to upload selected file. File Name should be less than 150 characters.", "bottom-right");
        return;
    }
    $.ajax({
        url: "/BLOBUploadAndDownload/UploadToBlob/",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(files[0].name);
            $("#" + objId).closest("tr").find("input[id^='Text_DocType']").attr("data-valid", "required");
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            $("#" + objId).closest("tr").find("input[id^='Text_DocType']").removeAttr("data-valid");
        }
    });

}


function SHCDetails(e) {
    if ($("#divMultiSHC").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    }
    //else {
    //    GetDGRDetailsBySHC(($("#Multi_SHC").val() == "" ? "" : $("#Multi_SHC").val() + ",") + this.dataItem(e.item.index()).Key);
    //}
}
function HSCodeDetails(e) {
    if ($("#divMultiHSCode").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    }
}


function FillCommoditySHC(e) {
    if (userContext.SysSetting.ClientEnvironment == 'UK') {
        if ($('#Text_Commodity').val().split('-')[1].toUpperCase() == 'LITHIUM ION BATTERIES 966')
            $('#NatureOfGoods').val('Lithium Batteries PI 966 Section II - lithium ion batteries, in compliance with Section II of PI 966');
        else if ($('#Text_Commodity').val().split('-')[1].toUpperCase() == 'LITHIUM ION BATTERIES 967')
            $('#NatureOfGoods').val('Lithium Batteries PI 967 Section II - Lithium ion batteries in compliance with Section II of PI 967');
        else if ($('#Text_Commodity').val().split('-')[1].toUpperCase().indexOf(('LITHIUM BATTER')) == -1)
            $('#NatureOfGoods').val('');
    }
    $("#divMultiSHC").find('span[class="k-icon k-delete"][style="display: none;"]').click() // remove pre selected shc
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/FillCommoditySHC",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CommoditySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()

        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SPHCSNo != "") {
                        if (!$("#SHC").val().includes(myData.Table0[0].SPHCSNo)) {
                            var shc = myData.Table0[0].SPHCSNo.split(",");
                            for (var i in shc) {
                                $("span#" + shc[i]).click();
                            }
                            cfi.BindMultiValue("SHC", myData.Table0[0].Text_SPHCSNo, myData.Table0[0].SPHCSNo);
                            $("#SHC").val(myData.Table0[0].SPHCSNo);
                            $("div[id^='divMultiSHC']").css("overflow", "auto");
                            $("div[id^='divMultiSHC']").css("width", "15em");

                            for (var i in shc) {
                                $("span#" + shc[i]).hide();
                            }
                        }
                    }

                }
                if (myData.Table1.length > 0) {
                    if (myData.Table1[0].ChWt != 0) {
                        var valwt = $("#AWBVolumeWeight").val() || 0;
                        if (valwt == 0) {
                            if (parseFloat($("#AWBGrossWeight").val()) > (parseFloat(myData.Table1[0].ChWt))) {
                                $("#AWBGrossWeight").blur();
                                IsChargeableWt = 0;
                            }
                            else {
                                $("#_tempAWBChargeableWeight").val(myData.Table1[0].ChWt);
                                $("#AWBChargeableWeight").val(myData.Table1[0].ChWt);
                                IsChargeableWt = 1;
                                MinimumChWt = $("#AWBChargeableWeight").val();
                            }
                        }
                        else if (valwt != 0) {
                            if (parseFloat($("#AWBGrossWeight").val()) > (parseFloat((myData.Table1[0].ChWt))) || parseFloat($("#AWBVolumeWeight").val()) > parseFloat((myData.Table1[0].ChWt))) {
                                $("#AWBGrossWeight").blur();
                                IsChargeableWt = 0;
                            }
                            else {
                                $("#_tempAWBChargeableWeight").val(myData.Table1[0].ChWt);
                                $("#AWBChargeableWeight").val(myData.Table1[0].ChWt);
                                IsChargeableWt = 1;
                                MinimumChWt = $("#AWBChargeableWeight").val();
                            }
                        }
                        else {
                            $("#_tempAWBChargeableWeight").val(myData.Table1[0].ChWt);
                            $("#AWBChargeableWeight").val(myData.Table1[0].ChWt);
                            IsChargeableWt = 1;
                            MinimumChWt = $("#AWBChargeableWeight").val();
                        }
                    }
                    else {
                        $("#_tempAWBChargeableWeight").val('');
                        $("#AWBChargeableWeight").val('');
                        $("#AWBGrossWeight").blur();
                        IsChargeableWt = 0;
                        MinimumChWt = $("#AWBChargeableWeight").val();
                    }

                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function AssignAWBNoForInterline() {
    var AWBPrefix = $("#Text_AWBCode").data("kendoAutoComplete").key();
    var AWBNumber = $("#AWBNumber").val();
    var SevenDigitofAWBNumber = AWBNumber.substring(0, 7);
    var LastDigitofAWBNumber = AWBNumber.substring(7, 8);
    var ModOfAWBNumber = (SevenDigitofAWBNumber % 7)
    var usersn0 = userContext.UserSNo;
    if (LastDigitofAWBNumber != ModOfAWBNumber) {
        $("#AWBNumber").val(SevenDigitofAWBNumber + ModOfAWBNumber)
        ShowMessage('warning', 'Information!', "Invalid AWB number. Valid AWB Number has been updated in respective field. Kindly validate & proceed.");
    }

}
function ValidateAndCheckValidAWBNumber(e) {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    if (AWBStock == 0 && $("#AWBNumber").val().trim().length == 8) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/CheckValidAWBNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                AWBNumber: $("#AWBNumber").val(),
                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SNo == 'Interline') {
                            if (myData.Table0[0].AWBNo != '') {
                                ShowMessage('warning', 'Information!', "AWB already Used, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else if (myData.Table0[0].SNo == 'Error') {
                            ShowMessage('warning', 'Information!', myData.Table0[0].ErrorMessage);
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                        }
                    }
                    else {
                        if (myData.Table1.length > 0) {
                            if (myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else {
                            ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function AutoStockAgentOrNot() {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();

    if (AWBStock == 1 && $("#Text_AWBAgent").data("kendoAutoComplete").value() != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/AutoStockAgentOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == '0') {
                            ShowMessage('warning', 'Information!', "Auto AWB Stock not available for agent, Please try Manual AWB Stock.");
                            if (userContext.AgentSNo > 0) {
                                $('input[name=AWBStock][value=0]').attr('checked', true);
                                $('input[name=AWBStock][value=0]').click();
                                $('#AWBNumber').removeAttr("disabled");
                                $('#_tempAWBNumber').removeAttr("disabled");
                            }
                            else
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue('', '');
                        }
                        else if (myData.Table0[0].Result == '1') {
                            $("#_tempAWBNumber").attr('disabled', true);
                            $('#AWBNumber').attr('disabled', true);
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function ManualStockAgentOrNot() {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();

    if (AWBStock == 0 && $("#Text_AWBAgent").data("kendoAutoComplete").value() != "") {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/ManualStockAgentOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
                , AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBCode").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == '0') {
                            ShowMessage('warning', 'Information!', "Manual AWB Stock not available for agent, Please try Auto AWB Stock.");
                            if (userContext.AgentSNo > 0) {
                                $('input[name=AWBStock][value=1]').attr('checked', true);
                                $('input[name=AWBStock][value=1]').click();
                            }
                            else
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue('', '');
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function CheckValidAWBNumber(e) {
    if (e == "Text_AWBAgent") {
        GetProductAsPerAgent();
        ClearItineraryRoute();
    }
    if ($("#Text_Product").prop('disabled') == false && e == "Text_AWBAgent") {
        cfi.ResetAutoComplete("Product");
    }
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    if (AWBStock == 1 && e == "Text_AWBAgent") {
        AutoStockAgentOrNot();
    }
    else if (AWBStock == 0 && e == "Text_AWBAgent") {
        ManualStockAgentOrNot();
    }
    //if (e == "Text_AWBAgent" && BookingType == 0) {
    //FillProductForAgent('POSTOFFICE');
    //}
    if (AWBStock == 0 && $("#AWBNumber").val().trim().length == 8) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/CheckValidAWBNumber",
            async: true,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                AWBNumber: $("#AWBNumber").val(),
                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SNo == 'Interline') {
                            if (myData.Table0[0].AWBNo == '') {
                                AssignAWBNoForInterline();
                                if (userContext.AgentSNo <= 0) {
                                    if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                        if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
                                            $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                                        }
                                        else
                                            $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    }
                                    else
                                        $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                                }
                            }
                            else {
                                ShowMessage('warning', 'Information!', "AWB already Used, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else {
                            if (myData.Table1.length > 0 && myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].AccountSNo, myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].Name);
                                IsAsAgreedAgent = myData.Table0[0].AsAgreed == 'True' ? 1 : 0;
                                OverRideAsAgreed = myData.Table0[0].OverRideAsAgreed = '1' ? 1 : 0;
                                if (myData.Table0[0].AccountSNo > 0) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
                                }
                            }
                        }
                    }
                    else {
                        if (myData.Table1.length > 0) {
                            if (myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                                if (userContext.AgentSNo <= 0) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                                }
                            }
                        }
                        else {
                            ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                            if (userContext.AgentSNo <= 0) {
                                $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    else {
        if (e != "Text_AWBAgent") {
            if (userContext.AgentSNo > 0) {
                $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                //$("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(false)
            }
            else {
                $("#AWBNumber").val('');
                $("#_tempAWBNumber").val('');
                cfi.ResetAutoComplete("AWBAgent");
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
            }
        }
    }
}
function CheckPiecesOnOD(e) {
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
    var ItineraryPieces = ($("#ItineraryPieces").val() == "" ? 0 : parseFloat($("#ItineraryPieces").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin != "" && ItineraryDestination != "") {
                if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim())
                    SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val() && SelectedItineraryPieces == AWBPieces) {
                    IsmatchAWBOriginCity = true;
                }
                if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val() && SelectedItineraryPieces == AWBPieces) {
                    IsmatchAWBDestinationCity = true;
                }
            }
        });
    }
    var CheckAndValidateDataArray = [];
    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
        var CheckAndValidateDataArrayItems = {
            Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
            Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
            Pieces: $(tr).find("td")[3].innerText.trim(),
            GrossWeight: $(tr).find("td")[4].innerText.trim(),
            VolumeWeight: $(tr).find("td")[5].innerText.trim(),
            AWBOriginCitySNo: $(tr).find("input[id^='hdnOriginCitySNo_']").val(),
            AWBDestinationCitySNo: $(tr).find("input[id^='hdnDestinationCitySNo_']").val()
        };
        CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
    });

    if (CheckAndValidateDataArray.length > 0) {
        for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
            var ItemAWBPiecesOrigin = 0;
            var ItemAWBGrossWeightOrigin = 0;
            var ItemVolumeWeightOrigin = 0;
            var ItemAWBPiecesDestination = 0;
            var ItemAWBGrossWeightDestination = 0;
            var ItemVolumeWeightDestination = 0;
            $.map(CheckAndValidateDataArray, function (item) {
                if (item.Origin == CheckAndValidateDataArray[i].Origin) {
                    ItemAWBPiecesOrigin = parseInt(ItemAWBPiecesOrigin) + parseInt(item.Pieces);
                    ItemAWBGrossWeightOrigin = parseFloat(ItemAWBGrossWeightOrigin) + parseFloat(item.GrossWeight);
                    ItemVolumeWeightOrigin = parseFloat(ItemVolumeWeightOrigin) + parseFloat(item.VolumeWeight);
                }
                if (item.Destination == CheckAndValidateDataArray[i].Destination) {
                    ItemAWBPiecesDestination = parseInt(ItemAWBPiecesDestination) + parseInt(item.Pieces);
                    ItemAWBGrossWeightDestination = parseFloat(ItemAWBGrossWeightDestination) + parseFloat(item.GrossWeight);
                    ItemVolumeWeightDestination = parseFloat(ItemVolumeWeightDestination) + parseFloat(item.VolumeWeight);
                }
            });
            if (AWBOriginCitySNo == CheckAndValidateDataArray[i].AWBOriginCitySNo && ItemAWBPiecesOrigin == AWBPieces)
                IsmatchAWBOriginCity = true;
            if (AWBDestinationCitySNo == CheckAndValidateDataArray[i].AWBDestinationCitySNo && ItemAWBPiecesDestination == AWBPieces)
                IsmatchAWBDestinationCity = true;

        }
    }
    if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
        ShowMessage('warning', 'Information!', "Route Completed.");
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
        return false;
    }
    if (IsmatchAWBOriginCity = false) {
        if (e == "Text_ItineraryOrigin") {
        }
    }
    ItineraryPieces = parseInt(ItineraryPieces) + parseInt(SelectedItineraryPieces);
    if (AWBPieces == 0 && ItineraryPieces > 0) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Pieces.");
        return false;
    }
    else if (ItineraryPieces > AWBPieces) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        if (e == "Text_ItineraryOrigin") {
            $("#ItineraryOrigin").val('');
            $("#Text_ItineraryOrigin").val('');
        }
        else {
            $("#ItineraryDestination").val('');
            $("#Text_ItineraryDestination").val('');
        }
        ShowMessage('warning', 'Information!', "Itinerary Pieces less than AWB Pieces.");
        return false;
    }
    if (e == "Text_ItineraryDestination" && userContext.SysSetting.ICMSEnvironment == 'JT') {
        cfi.ResetAutoComplete("ItineraryFlightNo");
    }
}
function SelectedAWBOriginDestination(e) {
    if (e == "Text_AWBOrigin") {
        cfi.ResetAutoComplete('SHIPPER_CountryCode');
        cfi.ResetAutoComplete('SHIPPER_City');
        cfi.ResetAutoComplete('ItineraryOrigin');
    }
    if (e == "Text_AWBDestination") {
        cfi.ResetAutoComplete('CONSIGNEE_CountryCode');
        cfi.ResetAutoComplete('CONSIGNEE_City');
        cfi.ResetAutoComplete('ItineraryDestination');

        if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") {
            if ($("#Text_AWBDestination").data("kendoAutoComplete").key() != "")
                SplitShipmentAllowed();
        }
    }
    if (e == "Copy")
        e = "Text_AWBDestination";
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAirportofSelectedAWBOriginDestination",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (e == "Text_AWBOrigin") {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                        DimensionMandatoryOrNotInEcecutionAtCity = myData.Table0[0].IsDimensioMandatoryAtCity == 'False' ? 0 : 1;
                        if (userContext.AgentSNo > 0) { }
                        else {
                            if ($("#Text_AWBAgent").data("kendoAutoComplete").key() != userContext.SysSetting.InterlineAgentSNo) {
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue("", "");
                            }
                        }
                    }
                    else {
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                        if (myData.Table0[0].IsHouse == "True") {
                            $("#NoofHouse").attr("data-valid", "min[1],required");
                        }
                        else
                            $("#NoofHouse").removeAttr("data-valid", "");
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });

}
function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        if (UserTyp == "S") {
            $("#chkShipper").prop('checked', false);
            $("#chkShipper").attr('disabled', true);
            $("#chkShipper").removeAttr("title");
        }
        if (UserTyp == "C") {
            $("#chkconsignee").prop('checked', false);
            $("#chkconsignee").attr('disabled', true);
            $("#chkconsignee").removeAttr("title");
        }

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperConsigneeData[0].Name2);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperConsigneeData[0].Address2);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempSHipper_Fax").val(shipperConsigneeData[0].Fax);
                        $("#SHipper_Taxid").val(shipperConsigneeData[0].TaxID);
                        $("#_tempSHipper_Taxid").val(shipperConsigneeData[0].TaxID);
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(shipperConsigneeData[0].Name2);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(shipperConsigneeData[0].Address2);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempCONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                        $("#Consignee_Taxid").val(shipperConsigneeData[0].TaxID);
                        $("#_tempConsignee_Taxid").val(shipperConsigneeData[0].TaxID);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Name2").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_Street2").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#_tempSHIPPER_MobileNo").val('');
                        $("#SHIPPER_MobileNo2").val('');
                        $("#SHIPPER_Email").val('');
                        $("#SHipper_Fax").val('');
                        $("#_tempSHipper_Fax").val('');
                        $("#SHipper_Taxid").val('');
                        $("#_tempSHipper_Taxid").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_AccountNoName2").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_Street2").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#_tempCONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_MobileNo2").val('');
                        $("#CONSIGNEE_Email").val('');
                        $("#CONSIGNEE_Fax").val('');
                        $("#_tempCONSIGNEE_Fax").val('');
                        $("#CONSIGNEE_Fax").val('');
                        $("#_tempCONSIGNEE_Fax").val('');
                        $("#Consignee_Taxid").val('');
                        $("#_tempConsignee_Taxid").val('');
                    }
                }

            },
            error: {

            }
        });
    } else {
        if (UserTyp == "S") {
            $("#chkShipper").removeAttr('disabled');
            $("#chkShipper").attr("title", "Select to add in Participant as Shipper");

            $("#SHIPPER_Name").val('');
            $("#SHIPPER_Name2").val('');
            $("#SHIPPER_Street").val('');
            $("#SHIPPER_Street2").val('');
            $("#SHIPPER_TownLocation").val('');
            $("#SHIPPER_State").val('');
            $("#SHIPPER_PostalCode").val('');
            $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#SHIPPER_MobileNo").val('');
            $("#_tempSHIPPER_MobileNo").val('');
            $("#SHIPPER_MobileNo2").val('');
            $("#SHIPPER_Email").val('');
            $("#SHipper_Fax").val('');
            $("#_tempSHipper_Fax").val('');
            $("#SHipper_Taxid").val('');
            $("#_tempSHipper_Taxid").val('');
        } else if (UserTyp == "C") {
            $("#chkconsignee").removeAttr('disabled');
            $("#chkconsignee").attr("title", "Select to add in Participant as Consignee");

            $("#CONSIGNEE_AccountNoName").val('');
            $("#CONSIGNEE_AccountNoName2").val('');
            $("#CONSIGNEE_Street").val('');
            $("#CONSIGNEE_Street2").val('');
            $("#CONSIGNEE_TownLocation").val('');
            $("#CONSIGNEE_State").val('');
            $("#CONSIGNEE_PostalCode").val('');
            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#CONSIGNEE_MobileNo").val('');
            $("#_tempCONSIGNEE_MobileNo").val('');
            $("#CONSIGNEE_MobileNo2").val('');
            $("#CONSIGNEE_Email").val('');
            $("#CONSIGNEE_Fax").val('');
            $("#_tempCONSIGNEE_Fax").val('');
            $("#Consignee_Taxid").val('');
            $("#_tempConsignee_Taxid").val('');
        }
    }

}
//taxid
function GetShipperConsigneeDetails_tax(usertype) {
    var CreateShipperTaxParticipants = $("#chkShippertaxid").prop("checked") ? "1" : "0";
    var CreateConsigneerTaxParticipants = $("#chkconsigneetaxid").prop("checked") ? "1" : "0";
    var customersno = '';
    var UserTyp = usertype;
    var checkTaxIdResult = true;
    var IsGetRecords = "1";
    var TaxId = UserTyp == "C" ? $("#Consignee_Taxid").val().trim() : $("#SHipper_Taxid").val().trim();
    if (UserTyp == "C") {
        $("#SHIPPER_AccountNo").val()
        if (CreateConsigneerTaxParticipants == "1" && TaxId != "")//&& $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key()==""
        {
            customersno = $("#CONSIGNEE_AccountNo").val() == "" ? "0" : $("#CONSIGNEE_AccountNo").val();
            checkTaxIdResult = CheckTaxId(TaxId, 'C', '0', customersno);
            IsGetRecords = "0";
        }
        else
            IsGetRecords = "1";

    }
    else if (UserTyp == "S") {
        if (CreateShipperTaxParticipants == "1" && TaxId != "")//&& $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key()==""
        {
            customersno = $("#SHIPPER_AccountNo").val() == "" ? "0" : $("#SHIPPER_AccountNo").val();
            checkTaxIdResult = CheckTaxId(TaxId, 'S', '0', customersno);
            IsGetRecords = "0";
        }
        else
            IsGetRecords = "1";
    }

    if (checkTaxIdResult == true) {
        if (TaxId != "" && IsGetRecords == "1") {
            $.ajax({
                url: "Services/Shipment/ReservationBookingService.svc/GetShipperConsigneeDetails_TaxID?UserType=" + UserTyp + "&TaxId=" + TaxId, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var shipperConsigneeData = Data.Table0;

                    if (shipperConsigneeData.length > 0) {
                        if (UserTyp == "S") {
                            $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                            $("#SHIPPER_Name2").val(shipperConsigneeData[0].Name2);
                            $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                            $("#SHIPPER_Street2").val(shipperConsigneeData[0].Address2);
                            $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                            $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                            $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                            $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                            $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                            $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                            $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                            $("#SHIPPER_MobileNo2").val(shipperConsigneeData[0].Telex);
                            $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                            $("#SHipper_Fax").val(shipperConsigneeData[0].Fax);
                            $("#_tempSHipper_Fax").val(shipperConsigneeData[0].Fax);
                            $("#SHipper_Taxid").val(shipperConsigneeData[0].TaxID);
                            $("#_tempSHipper_Taxid").val(shipperConsigneeData[0].TaxID);
                            $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].SNo, shipperConsigneeData[0].CustomerNo);
                        }
                        else if (UserTyp == "C") {
                            $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                            $("#CONSIGNEE_AccountNoName2").val(shipperConsigneeData[0].Name2);
                            $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                            $("#CONSIGNEE_Street2").val(shipperConsigneeData[0].Address2);
                            $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                            $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                            $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                            $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                            $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                            $("#CONSIGNEE_MobileNo2").val(shipperConsigneeData[0].Telex);
                            $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                            $("#CONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                            $("#_tempCONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                            $("#Consignee_Taxid").val(shipperConsigneeData[0].TaxID);
                            $("#_tempConsignee_Taxid").val(shipperConsigneeData[0].TaxID);
                            $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].SNo, shipperConsigneeData[0].CustomerNo);
                        }

                    }
                    else {
                        if (UserTyp == "S") {
                            ShowMessage('warning', 'Information!', " TAX ID is not associated with any participant.");
                            $("#SHipper_Taxid").val('');
                            $("#_tempSHipper_Taxid").val('');


                        }
                        else if (UserTyp == "C") {
                            ShowMessage('warning', 'Information!', " TAX ID is not associated with any participant.");
                            $("#Consignee_Taxid").val('');
                            $("#_tempConsignee_Taxid").val('');

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
            $("#SHipper_Taxid").val('');
            $("#_tempSHipper_Taxid").val('');
        }
        else {
            ShowMessage('warning', 'Information!', "Already used TAX ID");
            $("#Consignee_Taxid").val('');
            $("#_tempConsignee_Taxid").val('');
        }
    }
}
//taxid end

function SelectedAWBOriginDestinationItineary(e) {
    if (e == "Text_AWBOrigin") {
        cfi.ResetAutoComplete('ItineraryOrigin');
    }
    if (e == "Text_AWBDestination") {
        cfi.ResetAutoComplete('ItineraryDestination');
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAirportofSelectedAWBOriginDestination",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (e == "Text_AWBOrigin") {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                    }
                    else {
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function FillProductForAgent(Type) {
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/FillProductForAgent",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                    $("#Text_Product").data("kendoAutoComplete").enable(false);
                }
                else {
                    $("#Text_Product").data("kendoAutoComplete").enable(true);
                    if (Type == '') {
                        GETProductASPerBookingType('0', userContext.GroupName);
                    }
                }
            }
            else {
                if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
                }
                else {
                    $("#Text_Product").data("kendoAutoComplete").enable(true);
                }
                if (Type == '') {
                    GETProductASPerBookingType('0', userContext.GroupName);
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function NoofHousePieces() {
    var NoofHouse = ($("#NoofHouse").val() == "" ? 0 : parseFloat($("#NoofHouse").val()));
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    if (Pieces > 0) {
        if (NoofHouse > 0) {
            if (NoofHouse > Pieces) {
                $("#NoofHouse").val('');
                $("#_tempNoofHouse").val('');
                ShowMessage('warning', 'Information!', "AWB Pieces cannot be less than count of HAWB.");

            }
        }
    }
}
function CalculatedBUPPieces(id) {
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    if (id == 'AWBNoofBUP') {
        var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
        if (Pieces > 0) {
            if ($("#chkIsBUP").prop('checked') == true) {
                if (BUPPieces > Pieces) {
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUPIntact").attr('disabled', false);
                    $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                    ShowMessage('warning', 'Information!', "BUP Pieces less than AWB Pieces.");
                }
                else if (BUPPieces > 0) {
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUPIntact").attr('disabled', true);
                    $("#_tempAWBNoofBUPIntact").attr('disabled', true);
                }
                else {
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUPIntact").attr('disabled', false);
                    $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                }
            }
        }
        else if (BUPPieces > 0) {
            $("#AWBNoofBUPIntact").val('');
            $("#_tempAWBNoofBUPIntact").val('');
            $("#AWBNoofBUPIntact").attr('disabled', true);
            $("#_tempAWBNoofBUPIntact").attr('disabled', true);
        }
        else {
            $("#AWBNoofBUPIntact").val('');
            $("#_tempAWBNoofBUPIntact").val('');
            $("#AWBNoofBUPIntact").attr('disabled', false);
            $("#_tempAWBNoofBUPIntact").attr('disabled', false);
        }
    }
    else if (id == 'AWBNoofBUPIntact') {
        var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
        if (Pieces > 0) {
            if ($("#chkIsBUP").prop('checked') == true) {
                if (AWBNoofBUPIntact > Pieces) {
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUP").attr('disabled', false);
                    $("#_tempAWBNoofBUP").attr('disabled', false);
                    ShowMessage('warning', 'Information!', "BUP Pieces less than AWB Pieces.");
                }
                else if (AWBNoofBUPIntact > 0) {
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUP").attr('disabled', true);
                    $("#_tempAWBNoofBUP").attr('disabled', true);
                }
                else {
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUP").attr('disabled', false);
                    $("#_tempAWBNoofBUP").attr('disabled', false);
                }
            }
        }
        else if (AWBNoofBUPIntact > 0) {
            $("#AWBNoofBUP").val('');
            $("#_tempAWBNoofBUP").val('');
            $("#AWBNoofBUP").attr('disabled', true);
            $("#_tempAWBNoofBUP").attr('disabled', true);
        }
        else {
            $("#AWBNoofBUP").val('');
            $("#_tempAWBNoofBUP").val('');
            $("#AWBNoofBUP").attr('disabled', false);
            $("#_tempAWBNoofBUP").attr('disabled', false);
        }
    }
}
function CalculatedPieces() {
    var NoofHouse = ($("#NoofHouse").val() == "" ? 0 : parseFloat($("#NoofHouse").val()));
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    if (Pieces > 0) {
        if (NoofHouse > 0) {
            if (NoofHouse > Pieces) {
                $("#AWBPieces").val('');
                $("#_tempAWBPieces").val('');
                ShowMessage('warning', 'Information!', "AWB Pieces cannot be less than count of HAWB.");
                return false;
            }
        }
    }
    if ($("#chkIsBUP").prop('checked') == true) {
        if (Pieces > 0) {
            if (BUPPieces > 0) {
                if (BUPPieces > Pieces) {
                    $("#AWBPieces").val('');
                    $("#_tempAWBPieces").val('');
                    $("#ItineraryPieces").val('');
                    $("#_tempItineraryPieces").val('');
                    ShowMessage('warning', 'Information!', "AWB Pieces not less than BUP Pieces.");
                }
                else {
                    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                    thedivFlightSearchResult.innerHTML = "";
                    $("#ItineraryPieces").val(Pieces);
                    $("#_tempItineraryPieces").val(Pieces);
                }
            }
            else if (AWBNoofBUPIntact > 0) {
                if (AWBNoofBUPIntact > Pieces) {
                    $("#AWBPieces").val('');
                    $("#_tempAWBPieces").val('');
                    $("#ItineraryPieces").val('');
                    $("#_tempItineraryPieces").val('');
                    ShowMessage('warning', 'Information!', "AWB Pieces not less than BUP Pieces.");
                }
                else {
                    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                    thedivFlightSearchResult.innerHTML = "";
                    $("#ItineraryPieces").val(Pieces);
                    $("#_tempItineraryPieces").val(Pieces);
                }
            }
            //$("#AWBNoofBUP").val(Pieces);
            //$("#_tempAWBNoofBUP").val(Pieces);
            //$("#ItineraryPieces").val(Pieces);
            //$("#_tempItineraryPieces").val(Pieces);
        }
    }
    else {
        if (Pieces > 0) {
            $("#ItineraryPieces").val(Pieces);
            $("#_tempItineraryPieces").val(Pieces);
            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
            thedivFlightSearchResult.innerHTML = "";
        }
    }

    if (Pieces > 0) {
        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));   //Per Piece SHC Work Commented
        var PerPicesgrossWt = 0;
        var PerPiecesCheckWeightforSHC = 0;
        var AWBPrefix = $("#AWBCode").val();
        if (AWBPrefix == '126') {
            if (userContext.SysSetting.GAPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.GAPerPiecesCheckWeightforSHC != undefined)
                PerPiecesCheckWeightforSHC = userContext.SysSetting.GAPerPiecesCheckWeightforSHC;
        }
        else if (AWBPrefix == '888') {
            if (userContext.SysSetting.QGPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.QGPerPiecesCheckWeightforSHC != undefined)
                PerPiecesCheckWeightforSHC = userContext.SysSetting.QGPerPiecesCheckWeightforSHC;
        }
        PerPicesgrossWt = grosswt / Pieces;
        if (parseFloat(PerPicesgrossWt) >= parseFloat(PerPiecesCheckWeightforSHC) && parseFloat(PerPiecesCheckWeightforSHC) > 0)
            SHCForPerPiecesGrossWt('');
        else
            SHCForPerPiecesGrossWt('1');

    }
    SetAndCalculateVolumeWeightAndCBMNEW('Pieces');
}
function SHCForPerPiecesGrossWt(HEASPHC) {
    var SPHC = $("#Text_SHC").data("kendoAutoComplete").key() || 0;
    if (HEASPHC == '1') {
        if (SPHC != '' && SPHC != 0) {
            $.ajax({
                url: "Services/Shipment/ReservationBookingService.svc/GetSHCForPerPiecesGrossWt",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    SPHC: SPHC,
                    HEASPHC: HEASPHC
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].SHC != "" && myData.Table0[0].Text_SHC != "") {
                                $("div[id='divMultiSHC']").find("li").each(function (i, row) {
                                    if (i > 0) {
                                        $(this).remove();
                                    }
                                });
                                cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC);
                                //var a = myData.Table0[0].SHC;
                                //$("span[id=" + a + "][class='k-icon k-delete']").remove();
                                $("#SHC").val(myData.Table0[0].SHC);
                            }
                            else {
                                $("div[id='divMultiSHC']").find("li").each(function (i, row) {
                                    if (i > 0) {
                                        $(this).remove();
                                    }
                                    else {
                                        $(row).find("input[id^='Multi_SHC']").val('')
                                        $(row).find("span[id='FieldKeyValuesSHC']").text('');
                                        $("#SHC").val('');
                                    }
                                });
                            }
                        }
                    }
                    return false
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        }
    }
    else {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetSHCForPerPiecesGrossWt",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                SPHC: SPHC,
                HEASPHC: HEASPHC
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SHC != "" && myData.Table0[0].Text_SHC != "") {
                            $("div[id='divMultiSHC']").find("li").each(function (i, row) {
                                if (i > 0) {
                                    $(this).remove();
                                }
                            });
                            cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC);
                            $("#SHC").val(myData.Table0[0].SHC);
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function compareGrossVolValue() {
    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var cw = ($("#AWBChargeableWeight").val() == "" ? 0 : parseFloat($("#AWBChargeableWeight").val()));
    var chwt = parseFloat(grosswt) > parseFloat(AWBVolumeWeight) ? grosswt : AWBVolumeWeight;
    if (cw > 0) {
        if (userContext.SpecialRights.RESCHARGEABLE == true) {
            if (parseFloat(cw) > parseFloat(chwt)) {
                var chwt1 = $("#AWBChargeableWeight").val();
                $("#AWBChargeableWeight").val(chwt1 == 0 ? "" : GetroundValue(chwt1, 1));
                $("#_tempAWBChargeableWeight").val(chwt1 == 0 ? "" : GetroundValue(chwt1, 1));
            }
            else {
                $("#AWBChargeableWeight").val(chwt == 0 ? "" : chwt);
                $("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : chwt);
            }
        }
        else {
            $("#AWBChargeableWeight").val(chwt == 0 ? "" : chwt);
            $("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : chwt);
        }
    }
    else {
        $("#AWBChargeableWeight").val(chwt == 0 ? "" : chwt);
        $("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : chwt);
    }
}
function CalculateGrossVolumeWeight(obj) {

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));

    var chwt = parseFloat(grosswt) > parseFloat(AWBVolumeWeight) ? grosswt : AWBVolumeWeight;
    //$("#AWBChargeableWeight").val(chwt.toFixed(0).toString() == 0 ? "" : chwt.toFixed(0).toString());       //Decimal By Tarun
    //$("#_tempAWBChargeableWeight").val(chwt.toFixed(0).toString() == 0 ? "" : chwt.toFixed(0).toString());       //Decimal By Tarun
    $("#AWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#_tempAWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    if (parseFloat(grosswt) > 0) {
        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
        thedivFlightSearchResult.innerHTML = "";
        $("#ItineraryGrossWeight").val(grosswt);
        $("#_tempItineraryGrossWeight").val(grosswt);
        if (AWBPieces > 0) {    //Per Piece SHC Work Commented
            var PerPicesgrossWt = 0;
            var PerPiecesCheckWeightforSHC = 0;
            var AWBPrefix = $("#AWBCode").val();
            if (AWBPrefix == '126') {
                if (userContext.SysSetting.GAPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.GAPerPiecesCheckWeightforSHC != undefined)
                    PerPiecesCheckWeightforSHC = userContext.SysSetting.GAPerPiecesCheckWeightforSHC;
            }
            else if (AWBPrefix == '888') {
                if (userContext.SysSetting.QGPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.QGPerPiecesCheckWeightforSHC != undefined)
                    PerPiecesCheckWeightforSHC = userContext.SysSetting.QGPerPiecesCheckWeightforSHC;
            }
            PerPicesgrossWt = grosswt / AWBPieces;
            if (parseFloat(PerPicesgrossWt) >= parseFloat(PerPiecesCheckWeightforSHC) && parseFloat(PerPiecesCheckWeightforSHC) > 0)
                SHCForPerPiecesGrossWt('');
            else
                SHCForPerPiecesGrossWt('1');

        }
        SetAndCalculateVolumeWeightAndCBMNEW('GrossWeight');
    }
}
function CalculateShipmentChWt(obj) {

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var cbm = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var volwt = cbm * 166.66;
    //if ($(obj).attr('id').toUpperCase() == "AWBCBM") {
    //    $("span[id='AWBVolumeWeight']").text(volwt.toFixed(1) == 0 ? "" : volwt.toFixed(1));
    //$("#AWBVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempAWBVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    //$("#ItineraryMainVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempItineraryMainVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    $("#AWBVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#_tempAWBVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#ItineraryMainVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#_tempItineraryMainVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#ItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    $("#_tempItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    //}
    var chwt = parseFloat(grosswt) > parseFloat(volwt) ? grosswt : volwt;
    //$("#AWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempAWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    $("#AWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#_tempAWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    if (parseFloat(grosswt) > 0) {
        $("#ItineraryGrossWeight").val(grosswt);
        $("#_tempItineraryGrossWeight").val(grosswt);
    }
}
function CalculateShipmentCBM() {
    if ($("#AWBVolumeWeight").val() != "") {        //Decimal By Tarun
        $("#AWBVolumeWeight").val(GetroundValue($("#AWBVolumeWeight").val(), 1));
        $("#_tempAWBVolumeWeight").val(GetroundValue($("#AWBVolumeWeight").val(), 1));
    }
    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var volwt = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var cbm = volwt / 166.66;
    $("#AWBCBM").val(cbm.toFixed(3) == 0 ? "" : cbm.toFixed(3));
    $("#_tempAWBCBM").val(cbm.toFixed(3) == 0 ? "" : cbm.toFixed(3));
    var chwt = parseFloat(grosswt) > parseFloat(volwt) ? grosswt : volwt;
    //$("#AWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempAWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    $("#AWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#_tempAWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#ItineraryVolumeWeight").val(cbm.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(cbm.toFixed(3));
    $("#ItineraryMainVolumeWeight").val(volwt);
    $("#_tempItineraryMainVolumeWeight").val(volwt);
    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
    thedivFlightSearchResult.innerHTML = "";
}
function ItineraryPieces() {
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var ItineraryPieces = ($("#ItineraryPieces").val() == "" ? 0 : parseFloat($("#ItineraryPieces").val()));
    var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
    var ItineraryCBM = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
    var ItineraryMainVolumeWeight = ($("#ItineraryMainVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryMainVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryCBM = 0;
    var SelectedItineraryMainVolumeWeight = 0;

    var RemainingItineraryGrossWeight = ((parseFloat(ItineraryPieces) * parseFloat(AWBGrossWeight)) / AWBPieces).toFixed(2)
    var RemainingItineraryCBM = ((parseFloat(ItineraryPieces) * parseFloat(AWBCBM)) / AWBPieces).toFixed(3)
    var RemainingItineraryMainVolumeWeight = ((parseFloat(ItineraryPieces) * parseFloat(AWBVolumeWeight)) / AWBPieces).toFixed(2)

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
            }
        });
    }
    ItineraryPieces = parseInt(ItineraryPieces) + parseInt(SelectedItineraryPieces);
    var RemGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
    var RemCBM = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryCBM)).toFixed(3);
    var RemItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
    if (AWBPieces == 0 && ItineraryPieces > 0) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Pieces.");
        return false;
    }
    else if (ItineraryPieces > AWBPieces) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "Itinerary Pieces less than AWB Pieces.");
        return false;
    }

    if (ItineraryPieces == AWBPieces) {
        $("#ItineraryGrossWeight").val(RemGrossWeight);
        $("#_tempItineraryGrossWeight").val(RemGrossWeight);
        $("#ItineraryVolumeWeight").val(RemCBM);
        $("#_tempItineraryVolumeWeight").val(RemCBM);
        $("#ItineraryMainVolumeWeight").val(RemItineraryMainVolumeWeight);
        $("#_tempItineraryMainVolumeWeight").val(RemItineraryMainVolumeWeight);
    }
    else {
        $("#ItineraryGrossWeight").val(parseFloat(RemainingItineraryGrossWeight) < parseFloat(RemGrossWeight) ? parseFloat(RemainingItineraryGrossWeight).toFixed(2) : parseFloat(RemGrossWeight).toFixed(2));
        $("#_tempItineraryGrossWeight").val(parseFloat(RemainingItineraryGrossWeight) < parseFloat(RemGrossWeight) ? parseFloat(RemainingItineraryGrossWeight).toFixed(2) : parseFloat(RemGrossWeight).toFixed(2));
        $("#ItineraryVolumeWeight").val(parseFloat(RemainingItineraryCBM) < parseFloat(RemCBM) ? RemainingItineraryCBM : RemCBM);
        $("#_tempItineraryVolumeWeight").val(parseFloat(RemainingItineraryCBM) < parseFloat(RemCBM) ? RemainingItineraryCBM : RemCBM);
        $("#ItineraryMainVolumeWeight").val(parseFloat(RemainingItineraryMainVolumeWeight) < parseFloat(RemItineraryMainVolumeWeight) ? parseFloat(RemainingItineraryMainVolumeWeight) : parseFloat(RemItineraryMainVolumeWeight));
        $("#_tempItineraryMainVolumeWeight").val(parseFloat(RemainingItineraryMainVolumeWeight) < parseFloat(RemItineraryMainVolumeWeight) ? parseFloat(RemainingItineraryMainVolumeWeight) : parseFloat(RemItineraryMainVolumeWeight));
    }
}
function ItineraryGrossWeight() {
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryCBM = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
            }
        });
    }
    ItineraryGrossWeight = parseFloat(ItineraryGrossWeight) + parseFloat(SelectedItineraryGrossWeight)
    if (AWBGrossWeight == 0 && ItineraryGrossWeight > 0) {
        $("#ItineraryGrossWeight").val('');
        $("#_tempItineraryGrossWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Gross Weight.");
        return false;
    }
    else if (ItineraryGrossWeight > AWBGrossWeight) {
        $("#ItineraryGrossWeight").val('');
        $("#_tempItineraryGrossWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Gross Weight less than AWB Gross Weight.");
        return false;
    }
}
function ItineraryCBM() {
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var ItineraryVolumeWeight = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryVolumeWeight = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText.trim());
            }
        });
    }
    ItineraryVolumeWeight = parseFloat(ItineraryVolumeWeight) + parseFloat(SelectedItineraryVolumeWeight)
    if (AWBCBM == 0 && ItineraryVolumeWeight > 0) {
        $("#ItineraryVolumeWeight").val('');
        $("#_tempItineraryVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Volume (CBM).");
        return false;
    }
    else if (ItineraryVolumeWeight > AWBCBM) {
        $("#ItineraryVolumeWeight").val('');
        $("#_tempItineraryVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Volume Weight less than AWB Volume (CBM).");
        return false;
    }
}

function ItineraryMainVolumeWeight() {
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var ItineraryMainVolumeWeight = ($("#ItineraryMainVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryMainVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryMainVolumeWeight = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
            }
        });
    }
    ItineraryMainVolumeWeight = parseFloat(parseFloat(ItineraryMainVolumeWeight) + parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2)
    if (AWBVolumeWeight == 0 && ItineraryMainVolumeWeight > 0) {
        $("#ItineraryMainVolumeWeight").val('');
        $("#_tempItineraryMainVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Volume Weight.");
        return false;
    }
    else if (ItineraryMainVolumeWeight > AWBVolumeWeight) {
        $("#ItineraryMainVolumeWeight").val('');
        $("#_tempItineraryMainVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Volume Weight less than AWB Volume Weight.");
        return false;
    }
}

function ShipmentSearch() {

    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val().trim();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val().trim();
    var FlightNo = $("#searchFlightNo").val() == "" ? "0" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";

    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    // Temporary Set values
    //FlightDate = "2015-10-15";
    var ReferenceNo = $("#searchReferenceNo").val() == "" ? "0" : $("#searchReferenceNo").val().trim();
    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "0" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CityCode;
    var OriginAirport = $("#searchOriginAirport").val() == "" ? "0" : $("#searchOriginAirport").val().trim();
    var DestinationAirport = $("#searchDestinationAirport").val() == "" ? "0" : $("#searchDestinationAirport").val().trim();
    var AWBStatusSearch = $("#searchAWBStatus").val() == "" ? "0" : $("#searchAWBStatus").val().trim();
    var ReservationGetGridData = {
        processName: _CURR_PRO_,
        moduleName: 'Shipment',
        appName: 'Booking',
        Action: 'IndexView',
        OriginCity: OriginCity.trim(),
        DestinationCity: DestinationCity.trim(),
        FlightNo: FlightNo.trim(),
        FlightDate: FlightDate.trim(),
        AWBPrefix: AWBPrefix.trim(),
        AWBNo: AWBNo.trim(),
        LoggedInCity: LoggedInCity.trim(),
        ReferenceNo: ReferenceNo.trim(),
        OriginAirport: OriginAirport.trim(),
        DestinationAirport: DestinationAirport.trim(),
        AWBStatus: AWBStatusSearch.trim()
    }
    if (_CURR_PRO_ == "RESERVATIONBOOKING") {
        //cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/ReservationBookingService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking/" + OriginCity.trim() + "/" + DestinationCity.trim() + "/" + FlightNo.trim() + "/" + FlightDate.trim() + "/" + AWBPrefix.trim() + "/" + AWBNo.trim() + "/" + LoggedInCity.trim() + "/" + ReferenceNo.trim());
        cfi.ShowIndexViewV2("divShipmentDetails", "Services/Shipment/ReservationBookingService.svc/GetGridData", ReservationGetGridData);

        $("[data-field='AWBPrefix']").closest('tr').find('th').each(function () {
            $(this).attr('title', $(this).attr('data-title'))





        });
    }

    // Remove extra blank row
    if ($("#divShipmentDetails > table > tbody >tr:eq(1)").attr("align") != "") {
        $("#divShipmentDetails > table > tbody >tr:eq(1)").remove();
    }
    //$("div[class='k-grid-content']").find("table tr").each(function () {
    //    $(this).find("td:eq(4)").css("display", "none");
    //});
    //$('#divShipmentDetails  tbody  tr').each(function (row, tr) {
    //    $(this).find("div[class='k-grid-header']").find('thead tr')
    //});
    //  CheckActionButtonPermission();
}

function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
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
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
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
    $("table[cfi-aria-search='search']").find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
}

function BindSubProcess() {
    AutoShipmentSearch(currentprocess);
    $("#divShipmentDetails").find("div[class='k-grid k-widget'] > div.k-grid-header > div > table > thead > tr > th:nth-child(2) > a.k-grid-filter > span").remove();
    HighLightGridButton($(".k-grid").find("table tr").find("td:contains('" + (currentawbsno == 0 ? "~" : currentawbsno) + "')").closest("tr").find("input[process='" + currentprocess.toUpperCase() + "']"));

    var grid = $("#divShipmentDetails div[data-role='grid']").data('kendoGrid');
    var pager = grid.pager;
    pager.unbind('change').bind('change', fn_pagechange);

    function fn_pagechange(e) {
        currentawbsno = 0;
        currentawbno = "";
    }
    $('div[class="k-toolbar k-grid-toolbar"]').hide();

    //if (RightsCheck == "READ") {
    //    // $("#divFooter").css("display", "none")
    //    $("div[id$='divShipmentDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
    //        // $(tr).find('input[type="button"]').css("display", "none")
    //        $(tr).find('input[type="button"][value="C"]').css("display", "none")
    //    });
    //}




}

function AutoShipmentSearch(SubProcess) {

    //var gridPage = $(".k-pager-input").find("input").val();
    //var grid = $(".k-grid").data("kendoGrid");
    //grid.dataSource.page(gridPage);
    if (SubProcess != "ACCEPTRESERVATIONBOOKING") {
        var a = false;
        $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
            if ($(e).text() != "" && $(e).text() != "0") {
                if ($(e).text() == currentawbsno) {
                    //var SubProcess = "WEIGHINGMACHINE";
                    //$(e).parent().find("[process=" + SubProcess + "]").click(); return false;
                    a = true;
                    BindEvents($(e).parent().find("[process=" + SubProcess.toUpperCase() + "]"), event); return false;
                }
            }
        });
        if (a == false) {
            CleanUI();
        }
    }
}

function BindEvents(obj, e, isdblclick) {
    $("#MainDiv").remove()
    $("#ApplicationTabs-1").html('');
    $("#ApplicationTabs-2").html('');
    $("#ApplicationTabs-3").html('');
    $("#ApplicationTabs-4").html('');
    $("#ApplicationTabs-5").html("");
    $("#ApplicationTabs").show();

    //if ($(obj).attr("class") == "dependentprocess")
    //    _IS_DEPEND = true;
    //else
    //    _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        $("#ApplicationTabs-1").html("");
        $("#ApplicationTabs-2").html("");
        $("#ApplicationTabs-3").html("");
        $("#ApplicationTabs-4").html("");
        $("#ApplicationTabs-5").html("");
        $("#ApplicationTabs").hide();
        ResetDetails();
        $("#hdnBookingSNo").val('');
        $("#hdnBookingMasterRefNo").val('');
        currentawbsno = 0;
        currentawbno = "";
        HSCode = "";
        Text_HSCode = "";
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");
        $("#btnNew").css("display", "block");
        cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
    });
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var AWBStatusNoIndex = 0;
    var AWBSNoIndex = 0;
    var AWBReferenceBookingSNoIndex = 0;
    var BookingRefNoIndex = 0;
    var OriginIndex = 0;
    var DestinationIndex = 0;
    var AWBStatusIndex = 0;
    var AwbnoIndex = 0;
    var PrefixIndex = 0;
    var ReplanCompleteIndex = 0;
    var BookingTypeIndex = 0;
    var ApproveCancelShipmentIndex = 0;
    var NoofReplan = 0;
    var NoOfREExecuted = 0;
    var AccountNoofReplan = 0;
    var AWBPiecesIndex = 0;
    var AWBGrossWeightIndex = 0;
    var AWBVolumeIndex = 0;
    var AWBStockIndex = 0;
    var SplitLoadedIndex = 0;
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    var CargoType = 0;

    CargoType = trLocked.find("th[data-field='InternationalORDomestic']").index();
    AWBStatusNoIndex = trLocked.find("th[data-field='AWBStatusNo']").index();
    AWBSNoIndex = trLocked.find("th[data-field='AWBSNo']").index();
    AWBReferenceBookingSNoIndex = trLocked.find("th[data-field='AWBReferenceBookingSNo']").index();
    AwbnoIndex = trLocked.find("th[data-field='AWBNo']").index();
    PrefixIndex = trLocked.find("th[data-field='AWBPrefix']").index();
    BookingRefNoIndex = trLocked.find("th[data-field='BookingRefNo']").index();
    OriginIndex = trLocked.find("th[data-field='Origin']").index();
    DestinationIndex = trLocked.find("th[data-field='Destination']").index();
    AWBStatusIndex = trLocked.find("th[data-field='AWBStatus']").index();
    ReplanCompleteIndex = trLocked.find("th[data-field='ReplanComplete']").index();
    BookingTypeIndex = trLocked.find("th[data-field='BookingType']").index();
    ApproveCancelShipmentIndex = trLocked.find("th[data-field='ApproveCancelShipment']").index();
    NoofReplan = trLocked.find("th[data-field='NoofReplan']").index();
    NoOfREExecuted = trLocked.find("th[data-field='NoOfREExecuted']").index();
    AccountNoofReplan = trLocked.find("th[data-field='AccountNoofReplan']").index();
    var AWBPiecesIndex = trLocked.find("th[data-field='AWBPieces']").index();
    var AWBGrossWeightIndex = trLocked.find("th[data-field='GrossWeight']").index();
    var AWBVolumeIndex = trLocked.find("th[data-field='Volume']").index();
    AWBStockIndex = trLocked.find("th[data-field='AWBStockType']").index();
    SplitLoadedIndex = trLocked.find("th[data-field='SplitLoaded']").index();
    currentawbsno = closestTr.find("td:eq(" + AWBSNoIndex + ")").text() == "" ? 0 : closestTr.find("td:eq(" + AWBSNoIndex + ")").text();
    AWBReferenceBookingPrimarySNo = closestTr.find("td:eq(" + AWBReferenceBookingSNoIndex + ")").text();
    currentawbno = closestTr.find("td:eq(" + AwbnoIndex + ")").text();
    currentPrefix = closestTr.find("td:eq(" + PrefixIndex + ")").text();
    BookingPrimaryRefNo = closestTr.find("td:eq(" + BookingRefNoIndex + ")").text();
    BookingOrigin = closestTr.find("td:eq(" + OriginIndex + ")").text();
    BookingDestination = closestTr.find("td:eq(" + DestinationIndex + ")").text();
    AWBStatusDetails = closestTr.find("td:eq(" + AWBStatusIndex + ")").text();
    AWBStatusNo = closestTr.find("td:eq(" + AWBStatusNoIndex + ")").text();
    ReplanCompleteIndexNo = closestTr.find("td:eq(" + ReplanCompleteIndex + ")").text();
    BookingTypeIndexNo = closestTr.find("td:eq(" + BookingTypeIndex + ")").text();
    IsApproveCancelShipment = closestTr.find("td:eq(" + ApproveCancelShipmentIndex + ")").text();

    NoofReplanNo = closestTr.find("td:eq(" + NoofReplan + ")").text() == "" ? 0 : closestTr.find("td:eq(" + NoofReplan + ")").text();
    NoOfREExecutedNo = closestTr.find("td:eq(" + NoOfREExecuted + ")").text() == "" ? 0 : closestTr.find("td:eq(" + NoOfREExecuted + ")").text();
    AccountNoofReplanNo = closestTr.find("td:eq(" + AccountNoofReplan + ")").text() == "" ? 0 : closestTr.find("td:eq(" + AccountNoofReplan + ")").text();
    AWBSPieces = closestTr.find("td:eq(" + AWBPiecesIndex + ")").text();;
    AWBSGrossWeight = closestTr.find("td:eq(" + AWBGrossWeightIndex + ")").text();;
    AWBSVolume = closestTr.find("td:eq(" + AWBVolumeIndex + ")").text();
    AWBStock = closestTr.find("td:eq(" + AWBStockIndex + ")").text();
    SplitLoaded = closestTr.find("td:eq(" + SplitLoadedIndex + ")").text();
    $("#hdnBookingSNo").val(AWBReferenceBookingPrimarySNo);
    $("#hdnBookingMasterRefNo").val(BookingPrimaryRefNo);
    status = closestTr.find("td:eq(13)").text();
    var InternationalORDomestic = closestTr.find("td:eq(" + CargoType + ")").text();
    //if (userContext.AgentSNo > 0 && AWBStatusDetails != "Booked") {
    //    ShowMessage('warning', 'Information!', "Already Executed");
    //}
    //else {
    if (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "FOH" || AWBStatusNo > 5) {
        var CheckITLResult = true;
        var CheckSurpassedBCT = "0";
        if (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD")
            CheckITLResult = CheckITL();
        if (CheckITLResult == true) {
            if (subprocess.toUpperCase() == "EXECUTERESERVATIONBOOKING") {
                var IsChargeableWt = 0;
                var MinimumChWt = 0;
                if (userContext.GroupName == "AGENT" && userContext.SysSetting.ICMSEnvironment == 'JT') {
                    CheckSurpassedBCT = CheckSurpassedBCTTime(currentawbsno);

                    if (CheckSurpassedBCT == "1") {
                        ShowMessage('warning', 'Information!', "Booking Closure Time has surpassed. Cannot Update AWB.");
                        return false;
                    }
                    if ((IsApproveCancelShipment == "True" || NoofReplanNo > 0) && (AWBStatusDetails == "No Show" || AWBStatusDetails == "Cancel")) {
                        ShowMessage('warning', 'Information!', "Approved AWB cannot be updated/edited again. Kindly Replan AWB to proceed further.");
                        return false;
                    }
                    Viewflag = GetCountNoOfReplan(0, currentawbsno);
                }
                if (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "No Show") {         //No Show Work Commented
                    //if (AWBStatusDetails == "Booked" || AWBStatusDetails == "Executed") {
                    var CheckAWBRouteStatusResult = CheckAWBRouteStatus();
                    if ((userContext.GroupName == "ADMIN" || userContext.GroupName == "SUPER ADMIN") && CheckAWBRouteStatusResult.split('~')[1] == '') {
                        //if (userContext.GroupName == "ADMIN") {
                        ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                    }
                    else {
                        if (CheckAWBRouteStatusResult.split('~')[0] == 'true') {
                            //if (CheckAWBRouteStatusResult == true) {
                            ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                        }
                        else {
                            ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                            //if (CheckAWBRouteStatusResult.split('~')[1] != '')
                            //    ShowMessage('warning', 'Information!', "Shipment does not allowed to be Execute.");
                            //else
                            //    ShowMessage('warning', 'Information!', "First Confirm Itinerary Route Status.");
                        }
                    }
                }
                else
                    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
            }
            else if (subprocess.toUpperCase() == "EDOXRESERVATIONBOOKING") {
                if (AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "FOH")
                    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                else
                    ShowMessage('warning', 'Information!', "Shipment is already marked as " + AWBStatusDetails + ", Can not proceed with E-Dox.");
            }
            else if (subprocess.toUpperCase() == "UPDATERESERVATIONBOOKING") {
                IsChargeableWt = 0;
                MinimumChWt = 0;
                AWBStock = userContext.SysSetting.UpdateCancelledShipment.toUpperCase() == 'YES' ? 'YES' : AWBStock // Added by Arman 27 nov 2019
                if (AWBStatusNo == 16 && AWBStock == 'YES') {
                    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                }
                else {
                    if (AWBStatusNo == 16 && AWBStock != 'YES') {
                        ShowMessage('warning', 'Information!', "Shipment is already marked as Cancel. Can not proceed with this Way Bill.");
                    }
                    else {
                        if (AWBStatusNo > 4 && AWBStatusNo != 15)
                            ShowMessage('warning', 'Information!', "Shipment is already executed. Click on E (Execute) button to view shipment details.");
                        else if (AWBStatusDetails != "Booked" && AWBStatusDetails != "No Show" && AWBStatusDetails != "BKD")
                            ShowMessage('warning', 'Information!', "Shipment is already executed. Click on E (Execute) button to view shipment details.");
                        else
                            ShowProcessDetails(subprocess, isdblclick, subprocesssno);
                    }
                }
            }
            else if (subprocess.toUpperCase() == "COPYAWBRESERVATION") {
                CopyBooking();
            }

            else if (subprocess.toUpperCase() == "LABELPRINTRESERVATION") {
                if ((userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") && (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE")) {
                    CheckPirntTime(currentawbsno, 1)
                    if (resulawbprinttreturn == '1') {
                        AWBLabel();
                    }
                    else if (resulawbprinttreturn == '0') {
                        ShowMessage('warning', 'Information!', "Label Print is allowed after '" + FlightDate + "'");
                        return;
                    }
                }
                else {
                    AWBLabel();
                }
            }
            else if (subprocess.toUpperCase() == "THERMALLABELPRINTRESERVATION") {
                if ((userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") && (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE")) {
                    CheckPirntTime(currentawbsno, 1)
                    if (resulawbprinttreturn == '1') {
                        ThermalAWBLabel();
                    }
                    else if (resulawbprinttreturn == '0') {
                        ShowMessage('warning', 'Information!', "Label Print is allowed after '" + FlightDate + "'");
                        return;
                    }
                }
                else {
                    ThermalAWBLabel();
                }
            }
            else if (subprocess.toUpperCase() == "AWBPRINTRESERVATION") {
                if ((userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") && (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE")) {
                    CheckPirntTime(currentawbsno, 0)
                    if (resulawbprinttreturn == '1') {
                        // AWBPrint(BookingTypeIndexNo);
                        AWBPrint(BookingTypeIndexNo, InternationalORDomestic);
                    }
                    else if (resulawbprinttreturn == '0') {
                        ShowMessage('warning', 'Information!', "AWB Print is allowed after '" + FlightDate + "'");
                        return;
                    }
                }
                else {
                    // AWBPrint(BookingTypeIndexNo);
                    AWBPrint(BookingTypeIndexNo, InternationalORDomestic);
                }
            }

            //Added by Akaram Ali on 27 Dec 2017
            else if (subprocess.toUpperCase() == "REPLANRESERVATIONBOOKING") {
                //added by tks for lock event on replan
                var Message = cfi.GetAWBLockedEvent(userContext.UserSNo, currentawbsno, "0", "", "", "");
                if (Message != "") {
                    return;
                }
                else {
                    cfi.SaveUpdateLockedProcess(currentawbsno, 0, "", "", userContext.UserSNo, subprocesssno, subprocess, 1, "");
                }
                if (userContext.GroupName == "AGENT" && userContext.SysSetting.ICMSEnvironment == 'JT') {
                    CheckSurpassedBCT = CheckSurpassedBCTTime(currentawbsno);
                    if (CheckSurpassedBCT == "1") {
                        ShowMessage('warning', 'Information!', "Booking Closure Time has surpassed. Cannot Replan AWB.");
                        return;
                    }
                }
                var ReplanReservationResult = "0";
                if (AWBStatusNo > 4)
                    ReplanReservationResult = GetCountNoOfReplan(0, currentawbsno);
                else
                    ReplanReservationResult = GetCountNoOfReplan(AWBReferenceBookingPrimarySNo, 0);
                if (AWBStatusNo != 15 && AWBStatusNo != 16) {
                    if (ReplanReservationResult == "1") {
                        window.location.href = "../spacecontrol/SpaceControlSearch?AWBSNo=" + AWBReferenceBookingPrimarySNo + "&Status=" + AWBStatusNo;

                        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                            var AgentReExecutedLimitforJT = 0;
                            var TotalNoofReplanandExecuted = 0;
                            TotalNoofReplanandExecuted = parseInt(NoofReplanNo) + parseInt(NoOfREExecutedNo);
                            if (userContext.SysSetting.AgentReExecutedLimitforJT != "" && userContext.SysSetting.AgentReExecutedLimitforJT != undefined)
                                AgentReExecutedLimitforJT = userContext.SysSetting.AgentReExecutedLimitforJT;
                            if (AgentReExecutedLimitforJT > 0) {
                                if (parseInt(TotalNoofReplanandExecuted) == (parseInt(AgentReExecutedLimitforJT) - 1))
                                    ShowMessage('warning', 'Information!', "Balance 01 free update/replan of AWB is now remaining.");
                            }
                        }
                    }
                    else if (ReplanReservationResult == "2" && AWBStatusNo < 6) {
                        var msg = "This update will be on chargeable basis. Do you wish to continue?";
                        $.alerts.okButton = 'Yes';
                        $.alerts.cancelButton = 'No';
                        var r = jConfirm(msg, "", function (r) {
                            if (r == true) {
                                window.location.href = "../spacecontrol/SpaceControlSearch?AWBSNo=" + AWBReferenceBookingPrimarySNo + "&Status=" + AWBStatusNo;

                            } else {
                            }
                        });
                    }
                    else
                        ShowMessage('warning', 'Information!', "Count of Replan AWB already exhausted for shipment.");
                }
                else {
                    if (IsApproveCancelShipment == "True") {
                        if (ReplanReservationResult == "1") {
                            window.location.href = "../spacecontrol/SpaceControlSearch?AWBSNo=" + AWBReferenceBookingPrimarySNo + "&Status=" + AWBStatusNo;

                            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                                var AgentReExecutedLimitforJT = 0;
                                var TotalNoofReplanandExecuted = 0;
                                TotalNoofReplanandExecuted = parseInt(NoofReplanNo) + parseInt(NoOfREExecutedNo);
                                if (userContext.SysSetting.AgentReExecutedLimitforJT != "" && userContext.SysSetting.AgentReExecutedLimitforJT != undefined)
                                    AgentReExecutedLimitforJT = userContext.SysSetting.AgentReExecutedLimitforJT;
                                if (AgentReExecutedLimitforJT > 0) {
                                    if (parseInt(TotalNoofReplanandExecuted) == (parseInt(AgentReExecutedLimitforJT) - 1))
                                        ShowMessage('warning', 'Information!', "Balance 01 free update/replan of AWB is now remaining.");
                                }
                            }
                        }
                        else if (ReplanReservationResult == "2") {
                            var msg = "This update will be on chargeable basis. Do you wish to continue?";
                            $.alerts.okButton = 'Yes';
                            $.alerts.cancelButton = 'No';
                            var r = jConfirm(msg, "", function (r) {
                                if (r == true) {
                                    window.location.href = "../spacecontrol/SpaceControlSearch?AWBSNo=" + AWBReferenceBookingPrimarySNo + "&Status=" + AWBStatusNo;

                                } else {
                                }
                            });
                        }
                        else
                            ShowMessage('warning', 'Information!', "Count of Replan AWB already exhausted for shipment.");
                    }
                }

            }

            else if (subprocess.toUpperCase() == "ACCEPTRESERVATIONBOOKING") {
                //window.location.href = "Default.cshtml?Module=Shipment&Apps=ShortAcceptance&FormAction=INDEXVIEW&AWBSNo=" + currentawbsno;               
                var acptmsg = "Do you wish to proceed with Direct Acceptance ?";
                $.alerts.okButton = 'Yes';
                $.alerts.cancelButton = 'No';
                var r = jConfirm(acptmsg, "", function (r) {
                    if (r == true) {
                        SaveAcceptanceData(currentawbsno, AWBSPieces, AWBSGrossWeight, AWBSVolume);
                        //window.location.href = "../spacecontrol/SpaceControlSearch?AWBSNo=" + AWBReferenceBookingPrimarySNo + "&Status=" + AWBStatusNo;
                    }
                    else {

                    }
                });
            }
            else
                ShowProcessDetails(subprocess, isdblclick, subprocesssno);
        }
        else
            ShowMessage('warning', 'Information!', "ITL Time Expired.");
    }
    else
        ShowMessage('warning', 'Information!', "Shipment " + AWBStatusDetails + "");
    //}

}

function ThermalAWBLabel() {
    if ((userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") && (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "Void")) {
        CheckPirntTime(currentawbsno, 1)
        if (resulawbprinttreturn == '1') {
            if (currentawbsno > 0 && AWBStatusDetails != "Void")
                window.open("HtmlFiles\\Shipment\\ThermalLabel.html?Sno=" + btoa(currentawbsno));
            else
                ShowMessage('warning', 'Information!', "AWB marked as VOID. AWB Label Print is restricted");
        }
        else if (resulawbprinttreturn == '0') {
            ShowMessage('warning', 'Information!', "Label Print is allowed after '" + FlightDate + "'");
            return;
        }
    }
    else {
        if (currentawbsno > 0)
            window.open("HtmlFiles\\Shipment\\ThermalLabel.html?Sno=" + btoa(currentawbsno));
        else
            jAlert("Enter AIR WAYBILL Details to print AWB label.", "Warning - AWB Label");
        return;
    }
}
function SaveAcceptanceData(AWBSNo, AWBPieces, GrossWeight, Volume) {
    var CheckedShortAcceptanceDataArray = [];
    var CheckedShortAcceptanceDataArrayItems = {
        AWBSNo: currentawbsno,
        AWBPieces: AWBPieces,
        GrossWeight: GrossWeight,
        Volume: Volume
    };
    CheckedShortAcceptanceDataArray.push(CheckedShortAcceptanceDataArrayItems);
    if (CheckedShortAcceptanceDataArray.length > 0) {
        $.ajax({
            url: "Services/Shipment/ShortAcceptanceService.svc/SaveShortAcceptance", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ShortAcceptanceDataArray: CheckedShortAcceptanceDataArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Short Acceptance', "Processed Successfully", "bottom-right");
                    ShipmentSearch();
                    CleanUI();
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Short Acceptance', result.split('?')[1], "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Short Acceptance', "unable to process.", "bottom-right");
            }
        });
    }
}
function GetCountNoOfReplan(BookingSNo, AWBSNo) {
    var resultreturn = "0";
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetCountNoOfReplan",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingSNo: BookingSNo,
            AWBSNo: AWBSNo
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].ReplanCount == '1') {
                        resultreturn = "1";
                    }
                    else if (myData.Table0[0].ReplanCount == '2') {
                        resultreturn = "2";
                    }
                }
            }
            return resultreturn
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resultreturn;
}

function onGridDataBound(e) {
    var grid = this;
    grid.table.find('tr').each(function (i) {
        var model = grid.dataItem(this);
        if (userContext.SpecialRights.RESA == true && model.AWBStatusNo == 5 && model.AWBStatus != "FOH") {
            $(this).find('td input[value="A"]').show();
        }
        else if (userContext.SpecialRights.RESA != true && model.IsGoShowAccountType == "0" && model.IsGoShowProduct == "0") {
            $(this).find('td input[value="A"]').hide();
        }
        else if (userContext.SpecialRights.RESA != true && model.IsGoShowAccountType == "1" && model.IsGoShowProduct == "1" && model.AWBStatusNo == 5 && model.AWBStatus != "FOH") {
            $(this).find('td input[value="A"]').show();
        }
        else {
            $(this).find('td input[value="A"]').hide();
        }
        if (model.IsEDoxUploaded == "1") {
            $(this).find('td input[value="D"]').css({ 'background-color': 'green', 'color': 'white', 'border-color': 'green' });
        }
        //if (model.ReplanComplete == "1" && userContext.AgentSNo > 0)
        //    $(this).find('td input[value="R"]').css("color", "red").css("backgrond-color", "white");
        //else if (userContext.AgentSNo > 0) {
        //    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        //        var AgentReExecutedLimitforJT = 0;
        //        var TotalNoofReplanandExecuted = 0;
        //        var TotalAgentReExecutedandReplan = 0;
        //        TotalNoofReplanandExecuted = parseInt(NoofReplanNo) + parseInt(NoOfREExecutedNo);
        //        if (userContext.SysSetting.AgentReExecutedLimitforJT != "" && userContext.SysSetting.AgentReExecutedLimitforJT != undefined)
        //            AgentReExecutedLimitforJT = userContext.SysSetting.AgentReExecutedLimitforJT;
        //        if (AgentReExecutedLimitforJT > 0) {
        //            TotalAgentReExecutedandReplan = parseInt(AccountNoofReplanNo) + parseInt(AgentReExecutedLimitforJT);
        //            if (TotalNoofReplanandExecuted >= AgentReExecutedLimitforJT)
        //                $(this).find('td input[value="R"]').css("color", "red").css("backgrond-color", "white");
        //        }
        //    }
        //}
        if (Number(model.AWBStatusNo) > 6)
            $(this).find('td input[value="R"]').hide();
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            if (model.ApproveCancelShipment == "True" && model.BookingStatus == "No Show") {

                $(this).find('td input[value="R"]').show();
            }
            else if (model.ApproveCancelShipment == "True" && model.BookingStatus == "Cancel") {

                $(this).find('td input[value="R"]').show();
            }
            else if (model.ApproveCancelShipment == "True" && Number(model.AWBStatusNo) == 5) {
                $(this).find('td input[value="R"]').show();
            }

            if (model.BookingStatus != "EXE" && model.BookingStatus != "No Show" && model.BookingStatus != "Cancel" && userContext.AgentSNo > 0) {
                $(this).find('td input[value="E"]').hide();
                $(this).find('td input[value="R"]').hide();
            }
        }

    });




    if (grid) {
        if ($(grid.tbody).find("td[data-column=AWBNo]").length > 0) {
            var isAWBHistory = isMailBox = isTracking = false;

            if (userContext.PageRights.filter((f) => { if (f.PageName == 'AWB History') return true; }).length > 0)
                isAWBHistory = true;

            if (userContext.PageRights.filter((f) => { if (f.PageName == 'AWB Tracking') return true; }).length > 0)
                isMailBox = true;

            if (userContext.PageRights.filter((f) => { if (f.PageName == 'EDI Mailbox' || f.PageName == 'EDI Inbound / Outbound') return true; }).length > 0)
                isTracking = true;

            if (userContext.SysSetting.ClientEnvironment != 'GA') {
                $(grid.tbody).find("td[data-column=AWBNo]").unbind("click").bind("click", function (e) {
                    var awbno = ($(this).find('span') != null) ? $(this).find('span').attr('awbno') : this.textContent;
                    var urlHistory = `/Default.cshtml?Module=Shipment&Apps=Tracking&FormAction=INDEXVIEW&AWBNo=${awbno}`;
                    var urlMailBox = `/Default.cshtml?Module=Master&Apps=EdiInboundAndOutbound&FormAction=NEW&AWBNo=${awbno}`;
                    var urlTracking = `/Tracking/AWB/${awbno}`;
                    var content = `<div style="display: none;" id="content1">`
                    if (isAWBHistory)
                        content += `<a url="${urlHistory}">AWB History</a>`;

                    if (isMailBox)
                        content += `<a url="${urlTracking}">AWB Tracking</a>`;

                    if (isTracking)
                        content += `<a url="${urlMailBox}">EDI Mailbox</a>`;
                    content += '</div>';

                    $(this).parent().toolbar({
                        content: content, position: 'top', recId: "", noHref: true, clickOnItem: (_this) => {

                            var awbWind = window.open("/");
                            if (awbWind) {
                                awbWind[awbWind.addEventListener ? 'addEventListener' : 'attachEvent'](
                                    (awbWind.attachEvent ? 'on' : '') + 'load', function () {
                                        awbWind.document.getElementById('iMasterFrame').src = _this.getAttribute('url')
                                    }, false
                                );
                            }

                        }
                    });
                    if (userContext.SysSetting.ICMSEnvironment != 'JT') {

                        if (isAWBHistory + isMailBox + isTracking == 3) {
                            $('.tool-container').css('left', '90px');
                        }
                        else if (isAWBHistory + isTracking + isMailBox == 2) {
                            $('.tool-container').css('left', '130px');
                            //$(this).css('left', '80px');
                        }
                        else {
                            $('.tool-container').css('left', '170px');
                        }
                    }



                });
            }
        }

    }

}
function ResetDetails(obj, e) {
    HSCode = "";
    Text_HSCode = "";
    $("#ApplicationTabs-1").html("");
    $("#ApplicationTabs-2").html("");
    $("#ApplicationTabs-3").html("");
    $("#ApplicationTabs-4").html("");
    $("#ApplicationTabs-5").html("");
    $('#ApplicationTabs ul:first li:eq(0) a').hide();
    $('#ApplicationTabs ul:first li:eq(1) a').hide();
    $('#ApplicationTabs ul:first li:eq(2) a').hide();
    $('#ApplicationTabs ul:first li:eq(3) a').hide();
    $('#ApplicationTabs ul:first li:eq(4) a').hide();
    $("#divEDox").html("");
}

function CheckAWBRouteStatus() {
    var CheckAWBRouteStatusResult = true + '~' + '';
    //var CheckAWBRouteStatusResult = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckAWBRouteStatus",
        async: false,
        type: "GET",
        dataType: "json",
        data: { BookingSNo: $("#hdnBookingSNo").val() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result.split('~')[0] == "1") {
                        CheckAWBRouteStatusResult = false + '~' + myData.Table0[0].Result.split('~')[1];
                        //if (myData.Table0[0].Result == "1") {
                        //    CheckAWBRouteStatusResult = false ;
                    }
                    else {
                        CheckAWBRouteStatusResult = true + '~' + '';
                        //CheckAWBRouteStatusResult = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return CheckAWBRouteStatusResult;
}

//get airline parameter value
function GetAirlineParameterValue(Airlinesno, Airlineparameter) {
    var ParameterValue = 'NO';
    //var CheckAWBRouteStatusResult = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAirlineParameterValue",
        async: false,
        type: "GET",
        dataType: "json",
        data: { Airlinesno: Airlinesno, Airlineparameter: Airlineparameter },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {

                    ParameterValue = myData.Table0[0].Result;

                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return ParameterValue;
}





function CheckITL() {
    var CheckITLResult = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckITL",
        async: false,
        type: "GET",
        dataType: "json",
        data: { BookingSNo: $("#hdnBookingSNo").val() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result == "1") {
                        CheckITLResult = false;
                    }
                    else {
                        CheckITLResult = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return CheckITLResult;
}

function ShowProcessDetails(subprocess, isdblclick, subprocesssno) {
    if (subprocess.toUpperCase() == "UPDATERESERVATIONBOOKING") {
        //var Message = cfi.GetAWBLockedEvent(userContext.UserSNo, currentawbsno, "0", "", "", ""); 
        //if (Message == "") {
        FormDataBind('UPDATE', subprocess);

        //    cfi.SaveUpdateLockedProcess(currentawbsno, 0, "", "", userContext.UserSNo, subprocesssno, subprocess, 1, "");
        //}
        //else
        //{
        //    $("#ApplicationTabs-1").html("");
        //    $("#ApplicationTabs-2").html("");
        //    $("#ApplicationTabs-3").html("");
        //    $("#ApplicationTabs-4").html("");
        //    $("#ApplicationTabs-5").html("");
        //    $("#ApplicationTabs").hide();
        //    ResetDetails();
        //    $("#hdnBookingSNo").val();
        //    $("#hdnBookingMasterRefNo").val();
        //    currentawbsno = 0;
        //    $("#btnSave").css("display", "none");
        //    $("#btnUpdate").css("display", "none");
        //    $("#btnCopyBooking").css("display", "none");
        //    $("#btnExecute").css("display", "none");
        //    $("#btnNew").css("display", "block");
        //    return false;
        //}
    }
    if (subprocess.toUpperCase() == "EXECUTERESERVATIONBOOKING") {
        var Message = cfi.GetAWBLockedEvent(userContext.UserSNo, currentawbsno, "0", "", "", "");
        if (Message == "") {
            FormDataBind('EXECUTE', subprocess);

            cfi.SaveUpdateLockedProcess(currentawbsno, 0, "", "", userContext.UserSNo, subprocesssno, subprocess, 1, "");


        }
        else {
            $("#ApplicationTabs-1").html("");
            $("#ApplicationTabs-2").html("");
            $("#ApplicationTabs-3").html("");
            $("#ApplicationTabs-4").html("");
            $("#ApplicationTabs-5").html("");
            $("#ApplicationTabs").hide();
            ResetDetails();
            $("#hdnBookingSNo").val();
            $("#hdnBookingMasterRefNo").val();
            currentawbsno = 0;
            currentawbno = "";
            $("#btnSave").css("display", "none");
            $("#btnUpdate").css("display", "none");
            $("#btnCopyBooking").css("display", "none");
            $("#btnExecute").css("display", "none");
            $("#btnNew").css("display", "block");
            return false;
        }
    }
    if (subprocess.toUpperCase() == "EDOXRESERVATIONBOOKING") {
        var ReservationGetWebForm = {
            processName: 'RESERVATIONBOOKING',
            moduleName: 'Shipment',
            appName: subprocess,
            Action: 'New',
            IsSubModule: '1'
        }
        $.ajax({
            //url: "Services/Shipment/ReservationBookingService.svc/GetWebForm/RESERVATIONBOOKING/Shipment/" + subprocess + "/New/1",
            url: "Services/Shipment/ReservationBookingService.svc/GetWebForm",
            async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: ReservationGetWebForm }),
            success: function (result) {
                $("#divEDox").html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("RESERVATIONBOOKING");
                    InitializePage(subprocess, "divEDox", isdblclick, subprocesssno, "");
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
        cfi.SaveUpdateLockedProcess(currentawbsno, 0, "", "", userContext.UserSNo, subprocesssno, subprocess, 2, "");
    }
}

function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            if (processdata.Table0 != undefined && processdata.Table0.length > 0) {
                var processlist = processdata.Table0;
                var out = '[';
                $.each(processlist, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '", SNo: "' + item.sno + '"}'
                        }
                        else {
                            out = out + '{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '", SNo: "' + item.sno + '"}'
                        }
                    }
                });
            }
            out = out + ']';
            processList = eval(out);

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

function checkProgrss(item, subprocess, displaycaption) {
    //dependentprocess
    //BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_X" + ",") >= 0) {
        return "\"failureprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_X" + ",") >= 0) {
        return "\"failureprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if (item.toUpperCase().indexOf("," + subprocess.toUpperCase() + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
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
function CalculatePieces(obj) {
    //var CurRow = $(obj).closest("tr");
    //var TotalPieces = parseInt(($("#Pieces").val() || 0) == 0 ? ($("#_tempPieces").val() || 0) : ($("#Pieces").val() || 0));
    //var CurrentPieces = parseInt(($(CurRow).find("input[id^='Pieces']").val() || 0) == 0 ? ($(CurRow).find("input[id^='_tempPieces']").val() || 0) : ($(CurRow).find("input[id^='Pieces']").val() || 0));
    //var TotalGrWeight = ($("#GrossWt").val() || 0) == 0 ? ($("#_tempGrossWt").val() || 0) : ($("#GrossWt").val() || 0);

    //var pc = 0;
    //var wt = 0;

    //$("div[id$='divareaTrans_shipment_shipmentnog']").find("[id^='areaTrans_shipment_shipmentnog']").each(function (i, row) {
    //    if (CurRow.index() != (i + 1)) {
    //        pc = pc + parseInt(($(row).find("input[id^='Pieces']").val() || 0) == 0 ? ($(row).find("input[id^='_tempPieces']").val() || 0) : ($(row).find("input[id^='Pieces']").val() || 0));
    //    }
    //});
    //var RemPcs = TotalPieces - pc;

    //if (($(CurRow).find("td[id^='tdSNoCol']").text() || 0) != 5) {
    //    if (TotalPieces - (CurrentPieces + pc) <= 0)
    //        $(CurRow).find("input[id*='Pieces']").val(TotalPieces - pc);
    //    else
    //        $(CurRow).next().find("input[id*='Pieces']").val(RemPcs);

    //    //else if ((pc + $(obj).val()) > TotalPieces) {

    //    //}
    //}
    //else {
    //    $(CurRow).find("input[id*='Pieces']").val(TotalPieces - pc);
    //}

}

function DimPopup() {
    $('div.k-window-actions a:eq(3)').show();
    $('div.k-window-actions a:eq(1)').show();

    var elem = $("#areaTrans_Shipment_Dimensions");
    if (kendo.parseFloat($("#AWBPieces").val()) > 0 || (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL")) {

        if (elem.closest("div").find("[id^='tblDimUnit']").length == 0) {
            elem.closest("div").prepend("<table class='WebFormTable' id='tblDimUnit' style='border-bottom-width:0px'><tr> <td class='formlabel' style='border-bottom-width: 0px;width:15%;'><font color='red'>* </font><span>Dimensions Unit</span></td><td class='formInputcolumn' style='border-bottom-width: 0px;width:15%'><input name='DimensionUnit' tabindex='23' id='DimensionUnit' type='radio' checked='checked' value='1'  class='disablechk'  />Cms <input name='DimensionUnit' tabindex='23' id='DimensionUnit1' class='disablechk'  type='radio' data-valid='required' data-valid-msg='Select Dimension Unit' value='2' />Inches</td><td class='formlabel' style='border-bottom-width: 0px;width:12%'>Total Pieces</td><td class='formInputcolumn' style='border-bottom-width: 0px;width:10%;'><span id='spanTotalPieces' style='text-align:center'></span></td></tr> </table>");

        }
        if (elem.closest("div").find("[id^='SaveButtonTable']").length == 0) {
            if (!(getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL"))
                elem.closest("div").append("<table class='WebFormTable'  id='SaveButtonTable' style='border-top-width: 0px'><tr><td class='formbuttonrow' style='border-top-width: 0px'><input type='button' id='SaveExitDimension'  class='button' value='Save & Exit' onclick='SaveDimension();' tabindex='141' /></td></tr></table>");

        }

        ConvertControlToCulture("tblDimUnit");


        if ($("#hdnDimensionUnit").val() != "") {
            if ($("#hdnDimensionUnit").val() == "Cms")
                $("#DimensionUnit")[0].checked = 'checked';
            else
                $("#DimensionUnit1")[0].checked = 'checked';
            //AssignCultureValue("calculatedVolumeWeight", $("input[id='VolumeWeight']").val());

        }
        //if ($("input[id='VolumeWeight']").val() != "0")
        //    AssignCultureValue("calculatedVolumeWeight", $("input[id='VolumeWeight']").val());

        if (DimSaved == false && getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW") {
            $("#_tempDimPieces").val($("#AWBPieces").val()); $("#DimPieces").val($("#AWBPieces").val());
        }

        //if ($("input[id='GrossWeight']").val() != "0")
        //    AssignCultureValue("spanDimGrossWt", $("input[id='GrossWeight']").val());
        $("#spanTotalPieces").text(($("#AWBPieces").val() == "" || $("#AWBPieces").val() == undefined) ? $("#AWBPieces").text() : $("#AWBPieces").val());
        if (!(getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL")) {
            //CalculateVolume(elem);
            //CalculateTotalGrossWeight(elem);
        }


        cfi.PopUp("divareaTrans_Shipment_Dimensions", "Add Dimension");
    }
    else {
        ShowMessage('warning', 'Information!', "Enter pieces to add Dimension");
    }

    $("input[name='DimensionUnit']").click(function () {
        CalculateVolume(elem);
        CalculatePPVolumeWeightOnUnitChange(elem);

    });
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL") {
        $('.disablechk').attr('disabled', 'disabled');
    }
}
function CalculateVolume(elem, obj) {
    elem = $("#areaTrans_Shipment_Dimensions");
    var divisor = 1;
    if ($("#DimensionUnit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;

    elem.closest("div").find("input[id^='DimPieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        var LengthID = currentId.replace("DimPieces", "Length");
        var WidthID = currentId.replace("DimPieces", "Width");
        var HeightID = currentId.replace("DimPieces", "Height");
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            VolumeCalculation = VolumeCalculation + parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val()) * parseFloat($("#" + LengthID).val() == "" ? "0" : $("#" + LengthID).val()) * parseFloat($("#" + WidthID).val() == "" ? "0" : $("#" + WidthID).val()) * parseFloat($("#" + HeightID).val() == "" ? "0" : $("#" + HeightID).val());
        }
    });

    if (VolumeCalculation != 0) {
        var Weight = cfi.ceil(VolumeCalculation / divisor);
        Weight = (Weight < 1 ? 1 : Weight);
        //AssignCultureValue("calculatedVolumeWeight", Weight);

        AssignCultureValue("VolumeWeight", Weight);

    }
    else {
        AssignCultureValue("VolumeWeight", 0);
        //AssignCultureValue("calculatedVolumeWeight", 0);
    }


    var chargeable = $("span[id='ChargeableWt']").text() == "" ? "0" : $("span[id='ChargeableWt']").text();
    var GreaterWt = 0;
    var Gross = $("span[id='GrossWeight']").text() == "" ? "0" : $("span[id='GrossWeight']").text();
    var Volume = $("input[id='VolumeWeight']").val() == "" ? "0" : $("input[id='VolumeWeight']").val();
    if (kendo.parseFloat(Gross) > kendo.parseFloat(Volume))
        GreaterWt = kendo.parseFloat(Gross);
    else
        GreaterWt = kendo.parseFloat(Volume);
    if (parseFloat($("input[id='ChargeableWt']").val()) != kendo.parseFloat(GreaterWt)) {
        $("#hdnRateSearch").val("");
        $("#TotalLabelRatePerKG").text("");
        AssignCultureValue("TotalAmount", "0");
    }

    if (kendo.parseFloat(GreaterWt) >= 1) {
        AssignCultureValue("ChargeableWt", GreaterWt);

    }
    else {
        var tempChWt = $("input[id='ChargeableWt']").val();
        if (tempChWt == "" || parseFloat(tempChWt) == 0) {
            AssignCultureValue("ChargeableWt", 1);
        }
    }


}
function CalculateTotalGrossWeight(elem) {
    var GrossCalculation = 0;
    elem.closest("div").find("input[id^='DimPieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        //var GrossWeight = currentId.replace("DimPieces", "DimGrossWeight");
        var GrossWeight = currentId;
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            GrossCalculation = GrossCalculation + parseFloat($("#" + GrossWeight).val() == "" ? "0" : $("#" + GrossWeight).val());
        }
        else {
            GrossCalculation = GrossCalculation + parseFloat($("#" + GrossWeight).val() == "" ? "0" : $("#" + GrossWeight).val());
        }
    });

}
function RoundCultureValue(value, formatType, isRound) {
    if (value < 1)
        return 1;
    if (isRound == undefined || isRound == null || isRound == "")
        isRound = true;
    var format = "n2";
    var decimals = 2;
    if (formatType != undefined && formatType != null) {
        if (formatType.toLowerCase() == "weight") {
            format = "#0.00 kg";
        }
        else if (formatType.toLowerCase() == "currency") {
            format = "c";
        }
    }
    if (isRound)
        return kendo.toString(parseFloat(kendo.ceil(kendo.parseFloat(value, "", format).toFixed(decimals)), format, kendo.getCulture()));
    return kendo.toString(parseFloat(kendo.parseFloat(value, "", format)), format, kendo.getCulture());
};
function AssignCultureValue(controlId, value) {
    var kendoNumericSpan = null;
    that = $("span[id='" + controlId + "']").data("kendoNumericTextBox");
    if (that != undefined && kendoNumericSpan != "") {
        that.element.text(kendo.toString(parseFloat(that._parse(value, that.options.defaultCulture)), that.options.format, that.options.culture));
        $("input[id='" + controlId + "']").val(value);
    }
    else {
        that = $("input[id='" + controlId + "']").data("kendoNumericTextBox");
        if (that != undefined && kendoNumericSpan != "") {
            that._change(kendo.toString(parseFloat(that._parse(value, that.options.defaultCulture)), that.options.format, that.options.culture));
        }
    }
};
function SaveDimension() {

    DimSaved = true;
    var elem = $("#areaTrans_Shipment_Dimensions");
    var Pcs = 0;
    var FlagDim = true;
    elem.closest("table").find("[id^='DimPieces']").each(function () {
        var PcID = this.id;
        var Length = PcID.replace("DimPieces", "Length");
        var Width = PcID.replace("DimPieces", "Width");
        var Height = PcID.replace("DimPieces", "Height");
        //var DimPerPcGrossWeight = PcID.replace("DimPieces", "DimPerPcGrossWeight");
        //var DimGrossWeight = PcID.replace("DimPieces", "DimGrossWeight");
        if ($("#" + Length).val() == "" || $("#" + Width).val() == "" || $("#" + Height).val() == "")
            FlagDim = false;

        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });
    if (FlagDim == false) {
        ShowMessage('warning', 'Information!', "Enter Length, Width and Height for Dimensions", "bottom-right");

        return FlagDim;
    }
    if (Pcs == parseInt($("#AWBPieces").val())) {
        cfi.ClosePopUp("divareaTrans_Shipment_Dimensions");
    }
    else {
        ShowMessage('warning', 'Information!', "Dimension pieces does not match to Total Pieces", "bottom-right");

        return false;
    }
    /////// Update Gross Weight /////////////////////
    var GrossCalculation = 0;
    elem.closest("div").find("input[id^='DimPieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        var GrossWeight = currentId.replace("DimPieces", "DimGrossWeight");
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            GrossCalculation = GrossCalculation + parseFloat($("#" + AWBGrossWeight).val());
        }
        else {
            GrossCalculation = GrossCalculation + parseFloat($("#" + AWBGrossWeight).html());
        }
    });
    if (GrossCalculation != 0) {
        //cfi.AssignCultureValue("spanDimGrossWt", cfi.RoundCultureValue(GrossCalculation, null, true));
        cfi.AssignCultureValue("AWBGrossWeight", cfi.RoundCultureValue(GrossCalculation, null, true));
    }
    else {
        cfi.AssignCultureValue("DimGrossWeight", 0);
        //cfi.AssignCultureValue("spanDimGrossWt", 0);
    }
    if (kendo.parseFloat($("input[id='ChargeableWt']").val()) != kendo.parseFloat(GrossCalculation)) {
        $("#hdnRateSearch").val("");
        $("#TotalLabelRatePerKG").text("");
        cfi.AssignCultureValue("TotalAmount", "0");
        cfi.AssignCultureValue("SumOfChargeANDRate", 0);


        var elem = $("#areaTrans_Shipment_Charge");
        $("#divareaTrans_Shipment_Charge").find("[id^='Text_WaybillChargeMasterSNo']").each(function () {
            if (elem.closest("table").find("[id^='Text_WaybillChargeMasterSNo']").length >= 2)
                elem.closest("table").find("[id^='areaTrans_Shipment_Charge_']").remove();
        });
        $("#txtValue").val('');
        $("#_temptxtValue").val('');
        //$('.hidecharge').hide();
        //$('.hidechargeValue').hide();
        $("#Text_WaybillChargeMasterSNo").val('');
        $("#WaybillChargeMasterSNo").val('');
        $("#Text_WaybillChargeTransSNo").val('');
        $("#WaybillChargeTransSNo").val('');

    }
    CalculateVolume(elem);
}
function CancelDimension() {
    if (!(getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "BOOKING CANCEL")) {
        var elem = $("#areaTrans_Shipment_Dimensions");
        var closestTable = elem.closest("table");
        var currentIndex = $(closestTable).find("[id^='Length']").length - 1;
        $(closestTable).find("[id^='Length']")[currentIndex].value = "";
        $(closestTable).find("[id^='Width']")[currentIndex].value = "";
        $(closestTable).find("[id^='Height']")[currentIndex].value = "";
        $(closestTable).find("[id^='DimPieces']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempLength']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempWidth']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempHeight']")[currentIndex].value = "";
        $(closestTable).find("[id^='_tempDimPieces']")[currentIndex].value = "";
        CalculateVolume(elem);
    }
    cfi.ClosePopUp("divareaTrans_Shipment_Dimensions");
}
function ConvertControlToCulture(obj) {
    if (obj == undefined) {
        $("#" + formid).find("span").each(function () {
            var attr = $(this).attr('controltype');


            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                if (this.innerHTML.toLowerCase().indexOf("rp") < 0) {
                    var controlId = $(this).attr("id");

                    var decimalPosition = cfi.IsValidSpanNumeric(controlId);
                    if (decimalPosition >= -1) {
                        //            $(this).css("text-align", "right");
                        cfi.Numeric(controlId, decimalPosition, true);
                    }
                }
            }
        });
        $("#" + formid).find("input[type='text']").each(function () {
            var attr = $(this).attr('controltype');


            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                if (this.innerHTML.toLowerCase().indexOf("rp") < 0) {
                    var controlId = $(this).attr("id");

                    var decimalPosition = cfi.IsValidNumeric(controlId);
                    if (decimalPosition >= -1) {
                        //            $(this).css("text-align", "right");
                        cfi.Numeric(controlId, decimalPosition);
                    }
                }
            }
        });
    }
    else {
        $("#" + obj).find("span").each(function () {
            var attr = $(this).attr('controltype');

            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                var controlId = $(this).attr("id");

                var decimalPosition = cfi.IsValidSpanNumeric(controlId);
                if (decimalPosition >= -1) {
                    //            $(this).css("text-align", "right");
                    cfi.Numeric(controlId, decimalPosition, true);
                }
            }
        });
        $("#" + obj).find("input[type='text']").each(function () {
            var attr = $(this).attr('controltype');

            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr !== 'undefined' && attr !== false) {
                // ...
                var controlId = $(this).attr("id");

                var decimalPosition = cfi.IsValidNumeric(controlId);
                if (decimalPosition >= -1) {
                    //            $(this).css("text-align", "right");
                    cfi.Numeric(controlId, decimalPosition);
                }
            }
        });
    }
}

function SearchFlight() {
    if (cfi.IsValidSection("ApplicationTabs-1")) {
        if (true) {
            $("#divbody").width('fit-content');
            var theDivSearch = document.getElementById("divFlightSearchResult");
            theDivSearch.innerHTML = "";
            if ($("#hdnIsItineraryCarrierCodeInterline").val() == "0") {
                var RateAvailable = true; // RateAvailableOrNot();
                if (RateAvailable == true) {
                    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                        var result = IsInternationalBookingAgent($("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
                        if (result == true) {
                            if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {

                                SearchFlightMode("SearchFlight");
                            }
                            else
                                ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
                        }
                    }
                    else
                        ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");

                    //else
                    //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
                }
                else
                    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
            }
            else {
                if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                    if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                        if ($("#ItineraryInterlineFlightNo").val() != "") {
                            if ($("#ItineraryCarrierCode").val() != "") {
                                if ($("#ItineraryInterlineFlightNo").val() != "" && $("#hdnIsItineraryCarrierCodeInterline").val() == "1") {
                                    var SearchFlightValid = true;
                                    if ($("#hdnFlightDate").val() != "" && $("#ItineraryDate").val() != "") {
                                        var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

                                        var date = $("#hdnFlightDate").val();
                                        var Selecteddate_components = date.split("-");
                                        var Selectedcurrent_day = Selecteddate_components[0];
                                        var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
                                        var Selectedcurrent_year = Selecteddate_components[2];
                                        SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
                                        var SelectedDate = new Date(SelectedDateValue);

                                        var Date1 = $("#ItineraryDate").val();
                                        var Previousdate_components = Date1.split("-");
                                        var Previouscurrent_day = Previousdate_components[0];
                                        var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
                                        var Previouscurrent_year = Previousdate_components[2];
                                        PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
                                        var ItineraryDate = new Date(PreviousDateValue);

                                        if (ItineraryDate < SelectedDate) {
                                            ShowMessage('warning', 'Information!', "Itinerary Flight Date can not be less than Selected Date .");
                                            SearchFlightValid = false;
                                        }
                                    }
                                    if (SearchFlightValid == true) {

                                        var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                                        var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                                        var ItineraryOriginSNo = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key();
                                        var ItineraryDestinationSNo = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key();
                                        var ItineraryOriginCitySNo = 0;
                                        var ItineraryDestinationCitySNo = 0;
                                        $.ajax({
                                            url: "Services/Shipment/ReservationBookingService.svc/GETCitySNofromItinerary",
                                            async: false,
                                            type: "GET",
                                            dataType: "json",
                                            data: {
                                                ItineraryOriginSNo: ItineraryOriginSNo,
                                                ItineraryDestinationSNo: ItineraryDestinationSNo,
                                            },
                                            contentType: "application/json; charset=utf-8", cache: false,
                                            success: function (result) {
                                                if (result.substring(1, 0) == "{") {
                                                    var myData = jQuery.parseJSON(result);
                                                    if (myData.Table0.length > 0) {
                                                        ItineraryOriginCitySNo = myData.Table0[0].OriginCitySNo;
                                                        ItineraryDestinationCitySNo = myData.Table0[0].DestinationCitySNo;
                                                    }
                                                }
                                            },
                                            error: function (xhr) {
                                                var a = "";
                                            }
                                        });
                                        var theDiv = document.getElementById("divFinalSelectedroute");
                                        var table = "";
                                        if (theDiv.innerHTML == "") {
                                            table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td class='ui-widget-header'>ALOT Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td id='bct' class='ui-widget-header'>BCT</td><td id='mct' class='ui-widget-header'>MCT</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "<tr id='Interline_0'><td class='ui-widget-content first'>" + $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val().toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_0' id='hdnOriginAirportSNo_Interline_0' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_0' id='hdnDestinationAirportSNo_Interline_0' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>00:00/00:00</td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td id='RouteStatus' class='ui-widget-content first'></td><td id='Status' class='ui-widget-content first'></td><td id='SoftEmbargoApplied' class='ui-widget-content first'></td><td id='bct' class='ui-widget-content first'>NO</td><td id='mct' class='ui-widget-content first'>NO</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_0' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_0\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_0' id='hdnOriginCitySNo_Interline_0' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_0' id='hdnDestinationCitySNo_Interline_0' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_0' id='hdnSoftEmbargo_Interline_0' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_0' id='hdnItineraryMainVolumeWeight_Interline_0' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_0' id='hdnArrFlightDate_Interline_0' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>";
                                            $("#hdnETDTime").val('00:00');
                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
                                            $("#hdnArrFlightDate").val($("#ItineraryDate").val());
                                        }
                                        else {
                                            var tableroute = document.getElementById("tblSelectdRouteResult");
                                            var RowID = tableroute.rows.length - 1;
                                            $('#tblSelectdRouteResult').append("<tr id='Interline_" + RowID + "'><td class='ui-widget-content first'>" + $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val().toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_" + RowID + "' id='hdnOriginAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_" + RowID + "' id='hdnDestinationAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>00:00/00:00</td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td id='RouteStatus' class='ui-widget-content first'></td><td id='Status' class='ui-widget-content first'></td><td id='SoftEmbargoApplied' class='ui-widget-content first'></td><td id='bct' class='ui-widget-content first'>NO</td><td id='mct' class='ui-widget-content first'>NO</td><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_" + RowID + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_" + RowID + "\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_" + RowID + "' id='hdnOriginCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_" + RowID + "' id='hdnDestinationCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_" + RowID + "' id='hdnSoftEmbargo_Interline_" + RowID + "' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' id='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_" + RowID + "' id='hdnArrFlightDate_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>");
                                            $("#hdnETDTime").val('00:00');
                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
                                            $("#hdnArrFlightDate").val($("#ItineraryDate").val());
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "</tbody></table>";
                                            theDiv.innerHTML += table;
                                        }
                                        var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                        if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                    $(tr).find("[id^='Delete_']").css("display", "none");
                                            });
                                        }



                                        var IsmatchAWBOriginCity = false;
                                        var IsmatchAWBDestinationCity = false;
                                        var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
                                        var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
                                        var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
                                        var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
                                        var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
                                        var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

                                        var SelectedItineraryPieces = 0;
                                        var SelectedItineraryGrossWeight = 0;
                                        var SelectedCBM = 0;
                                        var SelectedItineraryMainVolumeWeight = 0;
                                        var RemainingPieces = 0;
                                        var RemainingItineraryGrossWeight = 0;
                                        var RemainingCBM = 0;
                                        var RemainingItineraryMainVolumeWeight = 0;
                                        var table = document.getElementById("tblSelectdRouteResult");
                                        if (table != null && table.rows.length > 1) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                                                    SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                                                    SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                                                    SelectedCBM = parseFloat(SelectedCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
                                                    SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
                                                }
                                                if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
                                                    IsmatchAWBOriginCity = true;
                                                }
                                                if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
                                                    IsmatchAWBDestinationCity = true;
                                                }
                                            });
                                        }
                                        RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
                                        RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
                                        RemainingCBM = (parseFloat(AWBCBM) - parseFloat(SelectedCBM)).toFixed(3);
                                        RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
                                        if (SelectedItineraryPieces < AWBPieces) {
                                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
                                            $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
                                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

                                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                            $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
                                            $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
                                            $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                                            $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                                        }
                                        else {
                                            if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

                                                $("#ItineraryPieces").val('');
                                                $("#_tempItineraryPieces").val('');
                                                $("#ItineraryGrossWeight").val('');
                                                $("#_tempItineraryGrossWeight").val('');
                                                $("#ItineraryVolumeWeight").val('');
                                                $("#_tempItineraryVolumeWeight").val('');
                                                $("#ItineraryMainVolumeWeight").val('');
                                                $("#_tempItineraryMainVolumeWeight").val('');


                                                var FlightDateForRateSearch = "";
                                                var FlightNoForRateSearch = "";
                                                var AllotmentCODEForRateSearch = "";


                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    if (row == 0)
                                                        FlightDateForRateSearch = $(tr).find("td")[1].innerText.trim();
                                                    FlightNoForRateSearch += $(tr).find("td")[0].innerText.trim() + ',';
                                                    if ($(tr).find("td")[8].innerText.trim() != '')
                                                        AllotmentCODEForRateSearch += $(tr).find("td")[0].innerText.trim() + '~' + $(tr).find("td")[8].innerText.trim() + '~' + $(tr)[0].id.trim() + ',';
                                                });
                                                if (FlightNoForRateSearch != "")
                                                    FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
                                                if (AllotmentCODEForRateSearch != "")
                                                    AllotmentCODEForRateSearch = AllotmentCODEForRateSearch.substring(0, AllotmentCODEForRateSearch.length - 1);
                                                var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, AllotmentCODEForRateSearch);
                                                if (RateAvailableNEW != true) {
                                                    ClearItineraryRoute();
                                                    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
                                                }
                                            }
                                            else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                                $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                            }
                                            else {
                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                                $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                                $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                                $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                            }
                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

                                        }


                                        //if (Action.toUpperCase() == "NEW") {
                                        var tableSelected = document.getElementById("tblSelectdRouteResult");
                                        if (tableSelected != null && tableSelected.rows.length > 1) {
                                            $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                                                $(tr).find("[id^='RouteStatus']").css("display", "none");
                                                $(tr).find("[id^='Status']").css("display", "none");
                                                $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
                                            });
                                        }
                                        //}

                                    }
                                }
                            }
                            else
                                ShowMessage('warning', 'Information!', "Enter Carrier Code.");
                        }
                        else
                            ShowMessage('warning', 'Information!', "Enter Flight No.");
                    }
                    else
                        ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
                }
                else
                    ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");
            }
        }
    }

}
function SearchTransitFlight() {
    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
        if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
            SearchFlightMode("TransitFlight");
        }
        else
            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Transit Flight.");
    }
    else {
        ShowMessage('warning', 'Information!', "Select Origin Airport, Transit Airport, Destination Airport and Date for Transit Flight.");
    }
}
function ViewRoute() {
    if (cfi.IsValidSection("ApplicationTabs-1")) {
        if (true) {
            var theDivSearch = document.getElementById("divFlightSearchResult");
            theDivSearch.innerHTML = "";
            var RateAvailable = true; // RateAvailableOrNot();
            if (RateAvailable == true) {
                var result = IsInternationalBookingAgent($("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
                if (result == true) {
                    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                        if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                            if ($("#AWBPieces").val() == $("#ItineraryPieces").val()) {
                                $.ajax({
                                    url: "Services/Shipment/ReservationBookingService.svc/ViewRoute?ItineraryOrigin=" + $("#ItineraryOrigin").val() + '&ItineraryDestination=' + $("#ItineraryDestination").val() + '&AWBPrefix=' + $("#Text_AWBCode").data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        var ViewRouteData = jQuery.parseJSON(result);
                                        var ViewRouteDetailData = ViewRouteData.Table0;
                                        if (ViewRouteDetailData.length > 0) {
                                            var str = "<table  class='WebFormTable'>";
                                            var no = 0;
                                            for (var i = 0; i < ViewRouteDetailData.length; i++) {
                                                no = (i + 1)
                                                str += "<tr><td>" + no + "</td><td><a href='javascript:void(0);' onClick='SelectedRoute(this);' id=" + ViewRouteDetailData[i].Routing + ">" + ViewRouteDetailData[i].Routing + "</a></td></tr>";
                                            }
                                            no = (no + 1)
                                            str += "<tr><td>" + no + "</td><td><a href='javascript:void(0);'  onClick='SelectedRoute(this);' id='Manual'>Manual</a></td></tr>";
                                            str += "</table>";
                                            $("#divViewRoutePopUp").html(str);
                                            cfi.PopUp("divViewRoutePopUp", "Available Route", 300, PopUpOnOpen, PopUpOnClose);
                                        }
                                    }
                                });
                            }
                            else
                                ShowMessage('warning', 'Information!', "Part shipment planning is not allowed from View Route option. Kindly search flights or manually enter flights for part shipment planning.");
                        }
                        else
                            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for view Route.");
                    }
                    else {
                        ShowMessage('warning', 'Information!', "Select Origin & Destination airports with Date to View Route.");
                    }
                }
                //else
                //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
            }
            else
                ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
        }
    }
}
var SendRouteAaarray = [];
var SelectedRouteValueArray = [];
var SelectedRouteValue = "";
function SelectedRoute(ss) {
    var theDiv = document.getElementById("divFinalSelectedroute");
    theDiv.innerHTML = "";
    var theDiv1 = document.getElementById("divFlightSearchResult");
    theDiv1.innerHTML = "";

    SelectedRouteValue = ss.id;
    SelectedRouteValueArray = [];
    SendRouteAaarray = [];
    SelectedRouteValueArray = SelectedRouteValue.split("-");
    SendRouteAaarray = SelectedRouteValue.split("-");
    CloseViewRoutepopUp();
    if (SelectedRouteValue == "Manual") {
        //$("#Text_ItineraryTransit").data("kendoAutoComplete").enable(true)
    }
    else {
        //cfi.ResetAutoComplete("ItineraryTransit");
        //$("#Text_ItineraryTransit").data("kendoAutoComplete").enable(false)
        SearchFlightMode("SelectedRoute");
    }
}
function SearchFlightMode(Mode) {
    var OriginSNo = $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var DestSNo = $("#Text_AWBDestination").data("kendoAutoComplete").key();
    var Pcs = $("#AWBPieces").val();
    var Gwt = $("#AWBGrossWeight").val();
    var Vol = $("#AWBVolumeWeight").val();
    var Cbm = $("#AWBCBM").val();
    var Chwt = $("#AWBChargeableWeight").val();
    var productSNo = $("#Text_Product").data("kendoAutoComplete").key();
    var CommoSNo = $("#Text_Commodity").data("kendoAutoComplete").key();
    var SHCSNo = $("#SHC").val() == "" ? 0 : $("#SHC").val();
    var AgentSNo = $("#Text_AWBAgent").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key();
    var pom = $("#Text_ChargeCode").data("kendoAutoComplete").key();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    var NOH = $("#NoofHouse").val() == "" ? 0 : $("#NoofHouse").val();
    var OriginAirportSNo = $("#Text_ItineraryOrigin").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key();
    var DestAirportSNo = $("#Text_ItineraryDestination").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key();
    var XCTFlightDate = "";
    IsViewRateTab = GetAirlineParameterValue('126', 'IsViewRateTab');
    var Goahead = true;
    if (Mode == "SelectedRoute") {
        var TempItineraryDate = "";
        var TempItineraryETDTime = "00:00";
        if ($("#hdnFlightDate").val() != "") {
            var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

            var date = $("#hdnFlightDate").val();
            var Selecteddate_components = date.split("-");
            var Selectedcurrent_day = Selecteddate_components[0];
            var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
            var Selectedcurrent_year = Selecteddate_components[2];
            SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
            var SelectedDate = new Date(SelectedDateValue);

            var Date1 = $("#ItineraryDate").val();
            var Previousdate_components = Date1.split("-");
            var Previouscurrent_day = Previousdate_components[0];
            var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
            var Previouscurrent_year = Previousdate_components[2];
            PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
            var ItineraryDate = new Date(PreviousDateValue);


            if (ItineraryDate > SelectedDate) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";
            }
            else {
                TempItineraryDate = $("#hdnFlightDate").val();
                TempItineraryETDTime = $("#hdnETDTime").val();
            }
        }
        else {
            TempItineraryDate = $("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val();
            TempItineraryETDTime = $("#hdnETDTime").val();
        }
        if (SendRouteAaarray.length > 1) {



            var SecondLegORNot = ISSecondLegORNot(SendRouteAaarray[0], SendRouteAaarray[1]);
            if (SecondLegORNot == true) {


                org = $("#Text_ItineraryOrigin").val().split('-')[0]
                var PrevXCTFlightDate = "";
                //sno = [];
                $("#tblSelectdRouteResult tbody tr td").each(function () {

                    if ($(this).index() == 2) {
                        //alert($(this).text());
                        if ($(this).text().split('/')[1] == SendRouteAaarray[0]) {
                            PrevXCTFlightDate = XCTFlightDate;
                            etd = $(this).closest('tr').find('td:eq(6)').text().split('/')[1]  // hdnArrFlightDate_15199298
                            date = $(this).closest('tr').find('input[type="hidden"][id^="hdnArrFlightDate_"]').val()
                            array.push(date + ' ' + etd)
                            sno.push($(this).closest('tr').attr('id') + '/' + date + ' ' + etd)

                            XCTFlightDate = date;

                            if (PrevXCTFlightDate != "") {
                                if (XCTFlightDate < PrevXCTFlightDate)
                                    XCTFlightDate = PrevXCTFlightDate
                            }
                        }
                    }
                });
                sno.sort(function (x, y) {
                    return Date.parse(y.split('/')[1]) - Date.parse(x.split('/')[1]);
                })

                ArrSelectedDateValue = sno[0].split('/')[1];
                ArrSelectedDate = ArrSelectedDateValue.split(' ')[0];
                ArrETATime = ArrSelectedDateValue.split(' ')[1];

                if (Date.parse(($("#ItineraryDate").val()) > Date.parse(ArrSelectedDate))) {
                    TempItineraryDate = $("#ItineraryDate").val();
                    TempItineraryETDTime = "00:00";
                    XCTFlightDate = TempItineraryDate;
                }
                else {
                    TempItineraryDate = ArrSelectedDate;
                    TempItineraryETDTime = ArrETATime;
                    XCTFlightDate = TempItineraryDate;
                }

            }
            XCTFlightDate = TempItineraryDate;
            ShowLoader(true);
            $.ajax({
                url: "Services/Shipment/ReservationBookingService.svc/SearchFlightResult",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    Origin: SendRouteAaarray[0],
                    Destination: SendRouteAaarray[1],
                    ItineraryDate: TempItineraryDate,//$("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val(),
                    ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                    ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                    ItineraryTransit: "",
                    ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                    ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                    Product: $("#Product").val() == "" ? 0 : parseFloat($("#Product").val()),
                    Commodity: $("#Commodity").val(),
                    SHCSNo: $("#SHC").val(), //$("#hdnETDTime").val(), //$("#SHC").val(),
                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                    OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    OverrideMCT: $("#chkMCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    IsMCT: SecondLegORNot == false ? 0 : 1,
                    ETD: TempItineraryETDTime //$("#hdnETDTime").val()
                    , SearchFrom: currentawbsno > 0 ? 'E' : 'B',
                    BookingNo: currentawbsno > 0 ? currentPrefix + '-' + currentawbno : $("#hdnBookingMasterRefNo").val(),
                    XCTFlightDate: XCTFlightDate
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    ShowLoader(false);
                    var theDiv = document.getElementById("divFlightSearchResult");
                    theDiv.innerHTML = "";

                    var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary :</td></tr><tr><td class='formSection' colspan='8'><span style='color: black;font-size: 9pt;'>*</span><span>(Created/Available/Utilised)</span></td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td id='flightRoute' class='ui-widget-header'>Flight Route</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.*</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol*</td><td class='ui-widget-header'>ALOT Code</td><td id='MaxGrossPer' class='ui-widget-header'>Max Gross Per Pcs</td><td id='MaxVolPer' class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td id='FlightType' class='ui-widget-header'>Flight Type</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        var Isdisplay1 = "inline-block";
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].ErrorMassage == undefined || myData.Table0[0].ErrorMassage == '') {
                                for (var i = 0; i < myData.Table0.length; i++) {
                                    Isdisplay1 = "inline-block";// myData.Table0[i].IsViewRate == 1 ? "inline-block":"none";
                                    if (myData.Table0[i].OverFlightCapacity == "1")
                                        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td></td><td class='ui-widget-content first'></td></tr>";
                                    else
                                        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='MaxGrossPer' class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td id='MaxVolPer' class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'>" + myData.Table0[i].FlightType + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='View Rate' type='button' id='View_" + myData.Table0[i].DailyflightSNo + "' value='View_" + myData.Table0[i].DailyflightSNo + "' tabindex='16' class='btn btn-success' style='width:60px;display:" + IsDisplay1 + "' onclick='ViewFlightDetail(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + OriginSNo + "\",\"" + DestSNo + "\",\"" + Pcs + "\",\"" + Gwt + "\",\"" + Vol + "\",\"" + Cbm + "\",\"" + Chwt + "\",\"" + productSNo + "\",\"" + CommoSNo + "\",\"" + SHCSNo + "\",\"" + AgentSNo + "\",\"" + pom + "\",\"" + BookingType + "\",\"" + NOH + "\",\"" + myData.Table0[i].FlightDate + "\",\"" + myData.Table0[i].FlightNo + "\",\"" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "\",\"" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "\",\"" + $('#Allotment_').text() + "\",\"" + myData.Table0[i].FlightType + "\",\"" + myData.Table0[i].FlightNo.split("-")[0] + "\",\"" + OriginAirportSNo + "\",\"" + DestAirportSNo + "\");'><span class='ui-button-text'>View Rate</span></button><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='17' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\",\"\",\"" + myData.Table0[i].OverrideBCT + "\",\"" + myData.Table0[i].OverrideMCT + "\");'><span class='ui-button-text'>Select</span></button></td></tr>";


                                }
                                table += "</tbody></table>";
                                theDiv.innerHTML += table;

                                $('#tblFlightSearchResult tr').mouseenter(function () {
                                    $(this).find("td").each(function () {
                                        $(this).removeClass('ui-widget-content first');
                                        $(this).addClass('highlightReservation');
                                    });
                                });
                                $('#tblFlightSearchResult tr').mouseleave(function () {
                                    $(this).find("td").each(function () {
                                        $(this).addClass('ui-widget-content first');
                                        $(this).removeClass('highlightReservation');
                                    });
                                });

                                if ((userContext.GroupName != "ADMIN" && userContext.GroupName != "SUPER ADMIN")) {
                                    var table = document.getElementById("tblFlightSearchResult");
                                    if (table != null && table.rows.length > 1) {
                                        if (userContext.SysSetting.IsMaxGrossMaxVolPerPcs == "True") {
                                            $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                                // $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                                $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                                $(tr).find("[id^='MaxGrossPer']").css("display", "none");
                                                $(tr).find("[id^='MaxVolPer']").css("display", "none");
                                            });
                                        }
                                        else {
                                            $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                                $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                                $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                                $(tr).find("[id^='flightRoute']").css("display", "none");
                                            });
                                        }
                                    }
                                }
                                $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                    if (userContext.SysSetting.ICMSEnvironment != 'JT') {
                                        if (IsViewRateTab == "NO")
                                            $(tr).find("[id^='View_']").css("display", "none");
                                    }
                                    else {
                                        if (IsAsAgreedAgent == 1) {
                                            if (myData.Table0[0].OverRideAsAgreed == '1') { }
                                            else
                                                $(tr).find("[id^='View_']").css("display", "none");
                                        }
                                    }
                                });

                            }
                            else {
                                var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>" + myData.Table0[0].ErrorMassage + "</td></tr></thead></table";
                                theDiv.innerHTML += table;
                            }
                        }
                        else {
                            var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight not found on '" + SendRouteAaarray[0] + "-" + SendRouteAaarray[1] + "' sector to complete route. Please select an alternate route.</td></tr></thead></table";
                            theDiv.innerHTML += table;

                        }

                    }
                },
                error: function (xhr) {
                    ShowLoader(false);
                    var a = "";
                }
            });
        }
    }
    else if (Mode == "SearchFlight") {
        var TempItineraryDate = "";
        var TempItineraryETDTime = "00:00";
        if ($("#hdnFlightDate").val() != "") {
            var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

            var date = $("#hdnFlightDate").val();
            var Selecteddate_components = date.split("-");
            var Selectedcurrent_day = Selecteddate_components[0];
            var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
            var Selectedcurrent_year = Selecteddate_components[2];
            SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
            var SelectedDate = new Date(SelectedDateValue);

            var Date1 = $("#ItineraryDate").val();
            var Previousdate_components = Date1.split("-");
            var Previouscurrent_day = Previousdate_components[0];
            var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
            var Previouscurrent_year = Previousdate_components[2];
            PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
            var ItineraryDate = new Date(PreviousDateValue);
            var XCTFlightDate = "";


            if (ItineraryDate > SelectedDate) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";
            }
            else {
                TempItineraryDate = $("#hdnFlightDate").val();
                TempItineraryETDTime = $("#hdnETDTime").val();
            }
        }
        else {
            TempItineraryDate = $("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val();
            TempItineraryETDTime = $("#hdnETDTime").val();
        }


        var SecondLegORNot = ISSecondLegORNot($("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0], $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0]);

        if (SecondLegORNot == true) {
            org = $("#Text_ItineraryOrigin").val().split('-')[0]
            sno = [];
            var dest = [];
            var PrevXCTFlightDate = "";
            $("#tblSelectdRouteResult tbody tr td").each(function () {

                if ($(this).index() == 2) {
                    //alert($(this).text());
                    if ($(this).text().split('/')[1] == org) {
                        PrevXCTFlightDate = XCTFlightDate;
                        etd = $(this).closest('tr').find('td:eq(6)').text().split('/')[1]  // hdnArrFlightDate_15199298
                        date = $(this).closest('tr').find('input[type="hidden"][id^="hdnArrFlightDate_"]').val()
                        array.push(date + ' ' + etd)
                        sno.push($(this).closest('tr').attr('id') + '/' + date + ' ' + etd)
                        XCTFlightDate = date;

                        if (PrevXCTFlightDate != "") {
                            if (XCTFlightDate < PrevXCTFlightDate)
                                XCTFlightDate = PrevXCTFlightDate
                        }

                    }
                }
            });
            sno.sort(function (x, y) {
                return Date.parse(y.split('/')[1]) - Date.parse(x.split('/')[1]);
            })

            ArrSelectedDateValue = sno[0].split('/')[1];
            ArrSelectedDate = ArrSelectedDateValue.split(' ')[0];
            ArrETATime = ArrSelectedDateValue.split(' ')[1];

            if (Date.parse($("#ItineraryDate").val()) > Date.parse(ArrSelectedDate)) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";

            }
            else {
                TempItineraryDate = ArrSelectedDate;

                TempItineraryETDTime = ArrETATime;
            }
        }

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/SearchFlightResult",
            async: true,
            type: "GET",
            dataType: "json",
            data: {
                Origin: $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryOrigin").data("kendoAutoComplete").key(),
                Destination: $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryDestination").data("kendoAutoComplete").key(),
                ItineraryDate: TempItineraryDate,//$("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val(),
                ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                ItineraryTransit: "",
                ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                Product: $("#Product").val() == "" ? 0 : parseFloat($("#Product").val()),
                Commodity: $("#Commodity").val(),
                SHCSNo: $("#SHC").val(), //$("#hdnETDTime").val(), //$("#SHC").val(),
                AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                OverrideMCT: $("#chkMCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                IsMCT: SecondLegORNot == false ? 0 : 1,
                ETD: TempItineraryETDTime //$("#hdnETDTime").val()
                , SearchFrom: currentawbsno > 0 ? 'E' : 'B',
                BookingNo: currentawbsno > 0 ? currentPrefix + '-' + currentawbno : $("#hdnBookingMasterRefNo").val(),
                XCTFlightDate: XCTFlightDate
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var theDiv = document.getElementById("divFlightSearchResult");
                theDiv.innerHTML = "";

                var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary :</td></tr><tr><td class='formSection' colspan='8'><span style='color: black;font-size: 9pt;'>*</span><span>(Created/Available/Utilised)</span></td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header' >Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td id='flightRoute' class='ui-widget-header' >Flight Route</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.*</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol*</td><td class='ui-widget-header'>ALOT Code</td><td id='MaxGrossPer' class='ui-widget-header'>Max Gross Per Pcs</td><td id='MaxVolPer' class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td id='FlightType' class='ui-widget-header'>Flight Type</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var isdisplay = "block";
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].ErrorMassage == undefined || myData.Table0[0].ErrorMassage == '') {
                            for (var i = 0; i < myData.Table0.length; i++) {
                                isdisplay = "inline-block";// myData.Table0[i].IsViewRate == 1 ? "inline-block" : "none";
                                if (myData.Table0[i].OverFlightCapacity == "1")
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='MaxGrossPer' class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td id='MaxVolPer' class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'></td></tr>";
                                else
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='MaxGrossPer' class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td id='MaxVolPer' class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'>" + myData.Table0[i].FlightType + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='View Rate' type='button' id='View_" + myData.Table0[i].DailyflightSNo + "' value='View_" + myData.Table0[i].DailyflightSNo + "' tabindex='16' class='btn btn-success' style='display:" + isdisplay + ";width:60px;' onclick='ViewFlightDetail(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + OriginSNo + "\",\"" + DestSNo + "\",\"" + Pcs + "\",\"" + Gwt + "\",\"" + Vol + "\",\"" + Cbm + "\",\"" + Chwt + "\",\"" + productSNo + "\",\"" + CommoSNo + "\",\"" + SHCSNo + "\",\"" + AgentSNo + "\",\"" + pom + "\",\"" + BookingType + "\",\"" + NOH + "\",\"" + myData.Table0[i].FlightDate + "\",\"" + myData.Table0[i].FlightNo + "\",\"" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "\",\"" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "\",\"" + $('#Allotment_').text() + "\",\"" + myData.Table0[i].FlightType + "\",\"" + myData.Table0[i].FlightNo.split("-")[0] + "\",\"" + OriginAirportSNo + "\",\"" + DestAirportSNo + "\");'><span class='ui-button-text'>View Rate</span></button><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='17' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\",\"\",\"" + myData.Table0[i].OverrideBCT + "\",\"" + myData.Table0[i].OverrideMCT + "\");'><span class='ui-button-text'>Select</span></button></td></tr>";


                            }
                            table += "</tbody></table>";
                            theDiv.innerHTML += table;
                            $('#tblFlightSearchResult tr').mouseenter(function () {
                                $(this).find("td").each(function () {
                                    $(this).removeClass('ui-widget-content first');
                                    $(this).addClass('highlightReservation');
                                });
                            });
                            $('#tblFlightSearchResult tr').mouseleave(function () {
                                $(this).find("td").each(function () {
                                    $(this).addClass('ui-widget-content first');
                                    $(this).removeClass('highlightReservation');
                                });
                            });

                            if ((userContext.GroupName != "ADMIN" && userContext.GroupName != "SUPER ADMIN")) {
                                var table = document.getElementById("tblFlightSearchResult");
                                if (table != null && table.rows.length > 1) {
                                    if (userContext.SysSetting.IsMaxGrossMaxVolPerPcs == "True") {
                                        $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                            //  $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                            $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                            $(tr).find("[id^='MaxGrossPer']").css("display", "none");
                                            $(tr).find("[id^='MaxVolPer']").css("display", "none");
                                        });
                                    }
                                    else {
                                        $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                            $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                            $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                            $(tr).find("[id^='flightRoute']").css("display", "none");
                                        });
                                    }
                                }
                            }
                            $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                if (userContext.SysSetting.ICMSEnvironment != 'JT') {

                                    if (IsViewRateTab == "NO")
                                        $(tr).find("[id^='View_']").css("display", "none");


                                }
                                else {
                                    if (IsAsAgreedAgent == 1) {
                                        if (myData.Table0[0].OverRideAsAgreed == '1') { }
                                        else
                                            $(tr).find("[id^='View_']").css("display", "none");
                                    }
                                }
                            });
                        }
                        else {
                            var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>" + myData.Table0[0].ErrorMassage + "</td></tr></thead></table";
                            theDiv.innerHTML += table;
                        }
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight not found on '" + $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0] + "-" + $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0] + "' sector to complete route. Please select an alternate route.</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }

                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

}

function ViewFlightDetail(DailyFlightSNo, OriginSNo, DestSNo, Pcs, Gwt, Vol, Cbm, Chwt, productSNo, CommoSNo, SHCSNo, AgentSNo, pom, BookingType, NOH, FlightDate, FlightNo, ETD, ETA, AllotmentCode, FlightType, CarrierCode, OriginAirportSNo, DestAirportSNo) {

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/ViewFlightDetail",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: DailyFlightSNo, OriginSNo: OriginSNo, DestSNo: DestSNo, Pcs: Pcs, Gwt: Gwt, Vol: Vol, Chwt: Chwt, productSNo: productSNo, CommoSNo: CommoSNo, SHCSNo: SHCSNo, AgentSNo: AgentSNo, pom: pom, NOH: NOH, FlightDate: FlightDate, FlightNo: FlightNo, ETD: ETD, ETA: ETA, AllotmentCode: AllotmentCode, FlightType: FlightType, CarrierCode: CarrierCode, OriginAirportSNo: OriginAirportSNo, DestAirportSNo: DestAirportSNo,
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            //var myData = jQuery.parseJSON(result);
           


            if (result.substring(1, 0) == "{") {
                
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                   
                    var IsTariffRate = "Tariff Rate";
                    var IsTariffAmount = "Tariff Amount";
                    if (userContext.SysSetting.ClientEnvironment != 'JT') {
                        if (IsViewRateTab == "YES") {

                            IsTariffRate = "RSP Rate";
                            IsTariffAmount = "RSP Amount";
                        }
                        else {

                            IsTariffRate = "Tariff Rate";
                            IsTariffAmount = "Tariff Amount";
                        }
                    }


                    var table = "<table class='appendGrid ui-widget' id='tblFlightDetail' style='height:100px;'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>" + IsTariffRate + "</td><td class='ui-widget-header'>" + IsTariffAmount + "</td><td class='ui-widget-header'>Due Carrier</td><td class='ui-widget-header'>Tax Amount</td><td class='ui-widget-header'>Replan Charges (If applicable)</td><td class='ui-widget-header'>Surcharge</td><td class='ui-widget-header'>Total Freight</td><td class='ui-widget-header' id='IsNTA'>NTA</td></tr></thead><tbody class='ui-widget-content'>";
                    //if (myData.Table0[0].ErrorMassage == undefined || myData.Table0[0].ErrorMassage == '') {
                    //    for (var i = 0; i < myData.Table0.length; i++) {
                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[0].TariffRate
                        + "</td><td class='ui-widget-content first'>" + myData.Table0[0].TariffAmount + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].AdminFee + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].TaxAmount + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].ReplanCharges + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].SurchargeAmount + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].TotalFreight + "</td><td  class='ui-widget-content first' id='IsNTA'>" + myData.Table0[0].NTA + "</td></tr>"; table += "</tbody></table>";
                    $("#divViewFlightDetailPopUp").html(table);
                    if (userContext.SysSetting.ClientEnvironment != 'JT') {
                        if (IsViewRateTab == "YES")
                            $('#IsNTA', $("#tblFlightDetail").find('tr')).hide();


                        else
                            $('#IsNTA', $("#tblFlightDetail").find('tr')).show();


                    }

                    cfi.PopUp("divViewFlightDetailPopUp", "Flight Information", 800, PopUpOnOpen, PopUpOnClose);
                }
            }
            else {
                if (userContext.SysSetting.IsShowViewRatePromptOnReservation.toUpperCase() == 'TRUE') {
                    var table = "<table class='appendGrid ui-widget'><tr><td style='color:red;text-align:center;font-size: medium;' ><b >Rate not Found </b></td></tr></table>";


                    $("#divViewFlightDetailPopUp").html(table);
                    cfi.PopUp("divViewFlightDetailPopUp", "Flight Information", 800, PopUpOnOpen, PopUpOnClose);
                }
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function SelectdRoute(SelectedRouteID, Mode, Action, AllotSNo, AllotCode, Check, RouteStatus, Status, IsSoftEmbargo, IsRouteComplete, OverrideBCT, OverrideMCT) {
    getFlightNo(SelectedRouteID, "1")
    var ValidationResult = true;
    if (Action.toUpperCase() != "UPDATE") {
        ValidationResult = cfi.IsValidSection("ApplicationTabs-1");
        if (ValidationResult == true) {
            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                var CheckFillDropAllotmentR = true;
                CheckFillDropAllotmentR = CheckFillDropAllotment(SelectedRouteID);
                if (CheckFillDropAllotmentR == false) {
                    ValidationResult = false;
                    ShowMessage('warning', 'Information!', "First Select Allotment code.");
                    return false;
                }
            }
        }
    }
    if (ValidationResult == true) {
        var IsPerPiecesCheckAllow = true;
        var IsConfirmData = true;
        var ULDCheck = true;
        var SoftEmbargo = "0";
        var ItineraryPieces = $("#ItineraryPieces").val();
        var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
        var ItineraryVolumeWeight = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
        //var ItineraryGrossWeight = $("#ItineraryGrossWeight").val();
        //var ItineraryVolumeWeight = $("#ItineraryVolumeWeight").val();
        var MaxGrossPerPcs = parseFloat($("#lblMaxGrossPerPcs_" + SelectedRouteID).text());
        var MaxVolumePerPcs = parseFloat($("#lblMaxVolumePerPcs_" + SelectedRouteID).text());
        var FlightCapacityGrWt = parseFloat($("#lblFlightCapacityGrWt_" + SelectedRouteID).text());
        var FlightCapacityVol = parseFloat($("#lblFlightCapacityVol_" + SelectedRouteID).text());
        var TotalFlightCapacityGrWt = parseFloat($("#hdnOverbookAVLGross_" + SelectedRouteID).val());
        var TotalFlightCapacityVol = parseFloat($("#hdnOverbookAVLVol_" + SelectedRouteID).val());
        var TotalMaxGrossPerPcs = parseFloat($("#lblMaxGrossPerPcs_" + SelectedRouteID).text()) * parseFloat(ItineraryPieces);
        var TotalMaxVolumePerPcs = parseFloat($("#lblMaxVolumePerPcs_" + SelectedRouteID).text()) * parseFloat(ItineraryPieces);
        var OverrideBCT = OverrideBCT;
        var OverrideMCT = OverrideMCT;
        if (Action.toUpperCase() == "NEW") {
            if ($("#Text_Commodity").data("kendoAutoComplete").key() != "" || $("#Text_SHC").data("kendoAutoComplete").key() != "") {
                $.ajax({
                    url: "Services/Shipment/ReservationBookingService.svc/IsPerPiecesCheckAllow",
                    async: false,
                    type: "GET",
                    dataType: "json",
                    data: {
                        CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Commodity").data("kendoAutoComplete").key(),
                        SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                    },
                    contentType: "application/json; charset=utf-8", cache: false,
                    success: function (result) {
                        if (result.substring(1, 0) == "{") {
                            var myData = jQuery.parseJSON(result);
                            if (myData.Table0.length > 0) {
                                if (myData.Table0[0].Result == "0") {
                                    IsPerPiecesCheckAllow = false;
                                }
                            }
                        }
                    },
                    error: function (xhr) {
                        var a = "";
                    }
                });
            }


            if (ItineraryGrossWeight > TotalFlightCapacityGrWt) {
                ShowMessage('warning', 'Information!', "Itinerary Gross Weight can not be greater than Flight Capacity Gr. Wt .");
                return false;
            }
            //if (ItineraryVolumeWeight > FlightCapacityVol) {
            if (ItineraryVolumeWeight > TotalFlightCapacityVol) {
                ShowMessage('warning', 'Information!', "Itinerary Volume can not be greater than Flight Capacity Volume .");
                return false;
            }
            if ((ItineraryGrossWeight > TotalMaxGrossPerPcs) && MaxGrossPerPcs != 0 && $("#chkIsBUP").prop('checked') != true && IsPerPiecesCheckAllow == true) {
                ShowMessage('warning', 'Information!', "Single Piece Gross Weight limit exceeds on chosen flight. Cannot proceed.");
                return false;
            }
            if ((ItineraryVolumeWeight > TotalMaxVolumePerPcs) && MaxVolumePerPcs != 0 && $("#chkIsBUP").prop('checked') != true && IsPerPiecesCheckAllow == true) {
                ShowMessage('warning', 'Information!', "Volume Per Piece check applicable on Flight.");
                return false;
            }
        }

        if ((kendo.parseFloat($("#ItineraryPieces").val()) <= 0 || kendo.parseFloat($("#ItineraryGrossWeight").val()) <= 0 || kendo.parseFloat($("#ItineraryVolumeWeight").val()) <= 0) && Action.toUpperCase() != "UPDATE") {
            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
            return false;
        }
        else {
            if (Check == "1") {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/ULDCheck",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            DailFlightSNo: SelectedRouteID,
                            BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    if (myData.Table0[0].IsValid != "") {
                                        if (myData.Table0[0].IsValid == "False") {
                                            var ValidMessage = myData.Table0[0].ValidMessage;
                                            ULDCheck = false;
                                            ShowMessage('warning', 'Information!', ValidMessage);
                                            return;
                                        }
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
                }
                /*	//Start Commented By Tarun for New Embargo Work
                if (ULDCheck == true) {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            DailFlightSNo: SelectedRouteID,
                            AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                            ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                            ItineraryPieces: $("#ItineraryPieces").val(),
                            ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                            ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                            PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                            SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    if (myData.Table0[0].IsSoftEmbargo != "") {
                                        if (myData.Table0[0].IsSoftEmbargo != "True") {
                                            var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                            IsConfirmData = false;
                                            //ShowMessage('warning', 'Information!', EmbargoName + ' - ' + 'Hard Embargo Applied.');
                                            ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);

                                            return;
                                        }
                                        else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                            var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                            IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                            SoftEmbargo = "1";
                                        }
                                        if (IsConfirmData == false) {
                                            return;
                                        }
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
				}
				//End Commented By Tarun for New Embargo Work	*/
            }
            if (IsConfirmData == true && ULDCheck == true) {
                var FlightSearch = true;
                var Selectedflag = false;
                var AllotmentSNo = "";
                var AllotmentCode = "";
                if (Action.toUpperCase() == "NEW") {
                    //AllotmentSNo = $("#Text_Allotment_" + SelectedRouteID).data("kendoAutoComplete").key();
                    //AllotmentCode = $("#Text_Allotment_" + SelectedRouteID).data("kendoAutoComplete").value();
                    AllotmentSNo = $("#DropAllotment_" + SelectedRouteID).val();
                    if ($("#DropAllotment_" + SelectedRouteID).val() != '' && $("#DropAllotment_" + SelectedRouteID).val() != null)
                        AllotmentCode = $("#DropAllotment_" + SelectedRouteID).children("option").filter(":selected")[0].innerHTML;
                    else
                        AllotmentCode = "";
                }
                // else if (Action.toUpperCase() == "UPDATE" || Action.toUpperCase() == "EXECUTE" || Action.toUpperCase() == "COPY") {
                else if (Action.toUpperCase() == "UPDATE" || Action.toUpperCase() == "EXECUTE") {
                    AllotmentSNo = AllotSNo;
                    AllotmentCode = AllotCode;
                    SoftEmbargo = IsSoftEmbargo;
                }
                var IsSoftEmbargoValue = SoftEmbargo == "1" ? "Yes" : "No";
                var IsRouteComplete = IsRouteComplete == "1" ? "Yes" : "No";
                if (Mode == "SelectedRoute") {
                    if (SendRouteAaarray.length > 1) {
                        $.ajax({
                            url: "Services/Shipment/ReservationBookingService.svc/SelectdRoute",
                            async: false,
                            type: "GET",
                            dataType: "json",
                            data: {
                                DailFlightSNo: SelectedRouteID
                            },
                            contentType: "application/json; charset=utf-8", cache: false,
                            success: function (result) {
                                var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                                thedivFlightSearchResult.innerHTML = "";
                                var theDiv = document.getElementById("divFinalSelectedroute");
                                var table = "";
                                if (theDiv.innerHTML == "") {
                                    if (Action.toUpperCase() == "COPY")
                                        $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                                    else
                                        $("#Text_AWBDestination").data("kendoAutoComplete").enable(false);
                                    table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td class='ui-widget-header'>ALOT Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td id='IsRouteComplete' class='ui-widget-header'>Route Complete</td><td id='bct' class='ui-widget-header'>BCT</td><td id='mct' class='ui-widget-header'>MCT</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";

                                }
                                if (result.substring(1, 0) == "{") {
                                    var myData = jQuery.parseJSON(result);
                                    if (myData.Table0.length > 0) {
                                        for (var i = 0; i < myData.Table0.length; i++) {
                                            if (theDiv.innerHTML == "") {
                                                if (userContext.SysSetting.ICMSEnvironment == 'JT' && Action.toUpperCase() != "COPY" && Action.toUpperCase() != "UPDATE") {
                                                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                                                        if (AWBFillCarrierCode != myData.Table0[i].FlightNo.split('-')[0] && myData.Table0[i].IsInterline == 0) {
                                                            if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                                                if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) { }
                                                                else if (userContext.AgentSNo > 0 && ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.AgentSNo)) { }
                                                                else {
                                                                    ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                                    return false;
                                                                }
                                                            }
                                                            else {
                                                                ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                }
                                                table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>";

                                                $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                            }
                                            else {
                                                var tblSelectdRouteResult = document.getElementById("tblSelectdRouteResult");
                                                if (tblSelectdRouteResult != null && tblSelectdRouteResult.rows.length > 1) {
                                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        if ($(tr)[0].id == myData.Table0[i].DailyflightSNo) {
                                                            if ($(tr).find("td")[8].innerText.trim() == "") {
                                                                $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                                $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                                $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                                $(tr).find("td")[8].innerText = AllotmentCode;
                                                                $("#hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "").val(AllotmentSNo);
                                                                $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val() + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                            else if ($(tr).find("td")[8].innerText.trim() == AllotmentCode) {
                                                                $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                                $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                                $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                                $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val() + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                            else {
                                                                Selectedflag = true;
                                                                FlightSearch = false;
                                                                ShowMessage('warning', 'Information!', "Different Allotment Code can not be use in same Flight.");
                                                                return false;
                                                            }
                                                        }
                                                    });
                                                    if (Selectedflag == false) {
                                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                            if ($(tr).find("td")[2].innerText.split("/")[0].trim() == myData.Table0[i].Origin) {
                                                                $(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>")

                                                                $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                                $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                                $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                        });
                                                        if (Selectedflag == false) {
                                                            $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                            $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                            $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (Selectedflag == false) {
                                                        $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                        $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                        $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                        $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                    }
                                                }
                                                if (FlightSearch == true)
                                                    thedivFlightSearchResult.innerHTML = "";
                                            }
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "</tbody></table>";
                                            theDiv.innerHTML += table;
                                        }
                                        window.scrollTo(0, 0);
                                        var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                        if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                    $(tr).find("[id^='Delete_']").css("display", "none");
                                            });
                                        }
                                        SendRouteAaarray.shift();
                                        SearchFlightMode("SelectedRoute");
                                    }
                                }
                            },
                            error: function (xhr) {
                                var a = "";
                            }
                        });
                    }
                }
                else {
                    SelectedRouteValue = "";
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/SelectdRoute",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            DailFlightSNo: SelectedRouteID
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {

                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            //thedivFlightSearchResult.innerHTML = "";
                            var theDiv = document.getElementById("divFinalSelectedroute");
                            var table = "";
                            if (theDiv.innerHTML == "") {
                                if (Action.toUpperCase() == "COPY")
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                                else
                                    $("#Text_AWBDestination").data("kendoAutoComplete").enable(false);
                                table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td class='ui-widget-header'>ALOT Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td id='IsRouteComplete'  class='ui-widget-header'>Route Complete</td><td id='bct' class='ui-widget-header'>BCT</td><td id='mct' class='ui-widget-header'>MCT</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";

                            }
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {

                                    for (var i = 0; i < myData.Table0.length; i++) {
                                        if (theDiv.innerHTML == "") {
                                            if (userContext.SysSetting.ICMSEnvironment == 'JT' && Action.toUpperCase() != "COPY" && Action.toUpperCase() != "UPDATE") {
                                                if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                                                    if (AWBFillCarrierCode != myData.Table0[i].FlightNo.split('-')[0] && myData.Table0[i].IsInterline == 0) {
                                                        if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                                            if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) { }
                                                            else if (userContext.AgentSNo > 0 && ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.AgentSNo)) { }
                                                            else {
                                                                ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                                return false;
                                                            }
                                                        }
                                                        else {
                                                            ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                            return false;
                                                        }
                                                    }
                                                }
                                            }
                                            table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>";

                                            $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                            $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                        }
                                        else {
                                            var tblSelectdRouteResult = document.getElementById("tblSelectdRouteResult");
                                            if (tblSelectdRouteResult != null && tblSelectdRouteResult.rows.length > 1) {
                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    if ($(tr)[0].id == myData.Table0[i].DailyflightSNo) {
                                                        if ($(tr).find("td")[8].innerText.trim() == "") {
                                                            $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                            $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                            $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                            $(tr).find("td")[8].innerText = AllotmentCode;
                                                            $("#hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "").val(AllotmentSNo);
                                                            $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val() + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                        else if ($(tr).find("td")[8].innerText.trim() == AllotmentCode) {
                                                            $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                            $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                            $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                            $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val()) + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                        else {
                                                            Selectedflag = true;
                                                            FlightSearch = false;
                                                            ShowMessage('warning', 'Information!', "Different Allotment Code can not be use in same Flight.");
                                                            return false;
                                                        }
                                                    }
                                                });
                                                if (Selectedflag == false) {
                                                    var rowcountforOrigin = 0;
                                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        if (rowcountforOrigin == 0) {
                                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                                if ($(tr).find("td")[2].innerText.split("/")[0].trim() == myData.Table0[i].Origin) {
                                                                    rowcountforOrigin = parseInt(rowcountforOrigin) + parseInt(1);
                                                                }
                                                            });
                                                        }
                                                        if ($(tr).find("td")[2].innerText.split("/")[0].trim() == myData.Table0[i].Origin) {
                                                            if (row == parseInt(rowcountforOrigin)) {
                                                                $(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>")

                                                                $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                                $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                                $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                        }
                                                    });
                                                    if (Selectedflag == false) {
                                                        $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                        $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                        $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                        $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                    }
                                                }
                                            }
                                            else {
                                                if (Selectedflag == false) {
                                                    $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='IsRouteComplete' class='ui-widget-content first'>" + IsRouteComplete + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                    $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                    $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                    $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                }
                                            }
                                            if (FlightSearch == true)
                                                thedivFlightSearchResult.innerHTML = "";
                                        }
                                    }
                                    if (theDiv.innerHTML == "") {
                                        table += "</tbody></table>";
                                        theDiv.innerHTML += table;
                                        thedivFlightSearchResult.innerHTML = "";
                                    }
                                    window.scrollTo(0, 0);
                                    var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                    //if (AWBStatusNo > 5)
                                    //if (userContext.SysSetting.IsShowRouteComplete == 'True') {
                                    //        $('#IsRouteComplete', $("#tblSelectdRouteResult").find('tr')).show();
                                    //}
                                    //else{
                                    //    $('#IsRouteComplete', $("#tblSelectdRouteResult").find('tr')).hide();
                                    //  }
                                    if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                $(tr).find("[id^='Delete_']").css("display", "none");


                                        });
                                    }

                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
                }
                if (Action.toUpperCase() == "NEW") {
                    var IsmatchAWBOriginCity = false;
                    var IsmatchAWBDestinationCity = false;
                    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
                    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
                    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
                    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
                    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
                    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
                    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                    var SelectedItineraryPieces = 0;
                    var SelectedItineraryGrossWeight = 0;
                    var SelectedItineraryCBM = 0;
                    var SelectedItineraryMainVolumeWeight = 0;
                    var RemainingPieces = 0;
                    var RemainingItineraryGrossWeight = 0;
                    var RemainingItineraryCBM = 0;
                    var RemainingItineraryMainVolumeWeight = 0;
                    var table = document.getElementById("tblSelectdRouteResult");
                    if (table != null && table.rows.length > 1) {
                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
                                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
                            }
                            if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
                                IsmatchAWBOriginCity = true;
                            }
                            if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
                                IsmatchAWBDestinationCity = true;
                            }
                        });
                    }
                    RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
                    RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
                    RemainingItineraryCBM = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryCBM)).toFixed(3);
                    RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
                    if (SelectedItineraryPieces < AWBPieces) {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
                        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
                        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

                        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                        $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
                        $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
                        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                    }
                    else {
                        if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

                            $("#ItineraryPieces").val('')
                            $("#_tempItineraryPieces").val('')
                            $("#ItineraryGrossWeight").val('')
                            $("#_tempItineraryGrossWeight").val('')
                            $("#ItineraryVolumeWeight").val('')
                            $("#_tempItineraryVolumeWeight").val('')
                            $("#ItineraryMainVolumeWeight").val('')
                            $("#_tempItineraryMainVolumeWeight").val('')

                            var FlightDateForRateSearch = "";
                            var FlightNoForRateSearch = "";
                            var AllotmentCODEForRateSearch = "";





                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                if (row == 0)
                                    FlightDateForRateSearch = $(tr).find("td")[1].innerText.trim();
                                FlightNoForRateSearch += $(tr).find("td")[0].innerText.trim() + ',';
                                if ($(tr).find("td")[8].innerText.trim() != '')
                                    AllotmentCODEForRateSearch += $(tr).find("td")[0].innerText.trim() + '~' + $(tr).find("td")[8].innerText.trim() + '~' + $(tr)[0].id.trim() + ',';
                            });
                            if (FlightNoForRateSearch != "")
                                FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
                            if (AllotmentCODEForRateSearch != "")
                                AllotmentCODEForRateSearch = AllotmentCODEForRateSearch.substring(0, AllotmentCODEForRateSearch.length - 1);
                            var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, AllotmentCODEForRateSearch);
                            if (RateAvailableNEW != true) {
                                ClearItineraryRoute();
                                ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
                            }
                        }
                        else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

                            $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                        }
                        else {
                            $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                        }
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

                    }


                }
                if (Action.toUpperCase() == "NEW" || Action.toUpperCase() == "COPY") {
                    var tableSelected = document.getElementById("tblSelectdRouteResult");
                    if (tableSelected != null && tableSelected.rows.length > 1) {
                        $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                            $(tr).find("[id^='RouteStatus']").css("display", "none");
                            $(tr).find("[id^='Status']").css("display", "none");
                            $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
                            $(tr).find("[id^='IsRouteComplete']").css("display", "none");



                        });
                    }
                }
                if (Action.toUpperCase() != "NEW") {
                    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#ItineraryPieces").val('')
                    $("#_tempItineraryPieces").val('')
                    $("#ItineraryGrossWeight").val('')
                    $("#_tempItineraryGrossWeight").val('')
                    $("#ItineraryVolumeWeight").val('')
                    $("#_tempItineraryVolumeWeight").val('')
                    $("#ItineraryMainVolumeWeight").val('')
                    $("#_tempItineraryMainVolumeWeight").val('')
                }
            }
        }
    }
}
var OldFlightNo = "";
var NewFlightNo = "";
function getFlightNo(FlightSNo, i) {
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/Common/CommonService.svc/GetFlightNo?FlightSNo=" + FlightSNo,
        success: function (result) {
            if (i == "0") {

                // OldFlightNo += "/" + result;
                sessionStorage.setItem("OldFlightNo", result)  // getItem("OldRateRefCode");
            }
            else {


                // NewFlightNo += "/" + result;
                sessionStorage.setItem("NewFlightNo", result)
            }

        }
    });
}
function DeleteRoute(e, DailFlightSNo, Origin, Destination, OriginSNo, DestinationSNo) {
    if (DailFlightSNo > 0)
        getFlightNo(DailFlightSNo, "0");
    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
    thedivFlightSearchResult.innerHTML = "";
    $(e).closest('tr').remove();
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(OriginSNo, Origin);

    $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(DestinationSNo, Destination);
    var DailyFlightSNoForDelete = 0;
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryCBM = 0;
    var SelectedItineraryMainVolumeWeight = 0;
    var RemainingPieces = 0;
    var RemainingItineraryGrossWeight = 0;
    var RemainingItineraryCBM = 0;
    var RemainingItineraryMainVolumeWeight = 0;
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            DailyFlightSNoForDelete = $(tr)[0].id;
            $("#hdnETDTime").val($(tr).find("td")[6].innerText.split("/")[1].trim());
            $("#hdnFlightDate").val($(tr).find("td")[1].innerText.trim());
            $("#hdnArrFlightDate").val($(tr).find("input[id^='hdnArrFlightDate_']").val());
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
            }
        });
    }
    RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
    RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
    RemainingItineraryCBM = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryCBM)).toFixed(3);
    RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
    if (SelectedItineraryPieces < AWBPieces) {
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
    }
    else {
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true)
        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)
        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
    }
    if (table != null && table.rows.length == 1) {

        ClearItineraryRoute();
    }
    $("#Delete_" + DailyFlightSNoForDelete).css("display", "block");
}
function CheckFillDropAllotment(DailyflightSNoVal) {
    var CheckFillDropAllotmentResult = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: DailyflightSNoVal,
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
            ShipperSNo: 0,
            GrossWt: $("#ItineraryGrossWeight").val(),
            Volume: $("#ItineraryVolumeWeight").val(),
            ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
            SHC: $("#Text_SHC").data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if ($("#DropAllotment_" + DailyflightSNoVal).val() == '' || $("#DropAllotment_" + DailyflightSNoVal).val() == null)
                        CheckFillDropAllotmentResult = false;
                    //for (i = 0; i < myData.Table0.length; i++) {
                    //	$('select[id^="' + id + '"]').append($("<option id='Allot'></option>").val(myData.Table0[i].AllotmentSNo).html(myData.Table0[i].AllotmentCode))

                    //}
                }
            }
            return CheckFillDropAllotmentResult
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return CheckFillDropAllotmentResult;
}
function FillDropAllotment(id, DailyflightSNoVal) {
    //$("#" + id).html("");
    if ($("#" + id).find('option').length == 0) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                DailyFlightSNo: DailyflightSNoVal,
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                ShipperSNo: 0,
                GrossWt: $("#ItineraryGrossWeight").val(),
                Volume: $("#ItineraryVolumeWeight").val(),
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                SHC: $("#Text_SHC").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);

                    if (myData.Table0.length > 0) {
                        for (i = 0; i < myData.Table0.length; i++) {
                            $('select[id^="' + id + '"]').append($("<option id='Allot'></option>").val(myData.Table0[i].AllotmentSNo).html(myData.Table0[i].AllotmentCode))

                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
//var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
//cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, MakeFileMandatory);
function BindAllotmentArray(DailyflightSNoVal) {
    var BindAllotmentArrayViewModel = [];
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/BindAllotmentArray",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: DailyflightSNoVal,
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
            ShipperSNo: 0,
            GrossWt: $("#ItineraryGrossWeight").val(),
            Volume: $("#ItineraryVolumeWeight").val(),
            ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
            SHC: $("#Text_SHC").data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    for (i = 0; i < myData.Table0.length; i++) {
                        var BindAllotmentArrayInfo = {
                            SNo: myData.Table0[i].DailyflightSNo,
                            AllotmentCode: myData.Table0[i].DailyflightSNo
                        };
                        BindAllotmentArrayViewModel.push(BindAllotmentArrayInfo);
                    }
                }
                cfi.AutoCompleteByDataSource("Allotment_" + DailyflightSNoVal, BindAllotmentArrayViewModel);
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });






}
function BindLocationAutoCompleteForULD(elem, mainElem) {
    var StartTemp = ($(elem).find("input[id^='ULDLocStartTemp']").val() || "0") == 0 ? ($(elem).find("input[id^='_tempULDLocStartTemp']").val() || "0") : ($(elem).find("input[id^='ULDLocStartTemp']").val() || "0");
    var EndTemp = ($(elem).find("input[id^='ULDLocEndTemp']").val() || "0") == 0 ? ($(elem).find("input[id^='_tempULDLocEndTemp']").val() || "0") : ($(elem).find("input[id^='ULDLocEndTemp']").val() || "0");

    var StartTemp2 = ($(mainElem).find("input[id^='ULDLocStartTemp']").val() || "0") == 0 ? ($(mainElem).find("input[id^='_tempULDLocStartTemp']").val() || "0") : ($(mainElem).find("input[id^='ULDLocStartTemp']").val() || "0");
    var EndTemp2 = ($(mainElem).find("input[id^='ULDLocEndTemp']").val() || "0") == 0 ? ($(mainElem).find("input[id^='_tempULDLocEndTemp']").val() || "0") : ($(mainElem).find("input[id^='ULDLocEndTemp']").val() || "0");

    $(elem).find("input[id^='ULDLocation']").each(function () {
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], DisableOther, "contains", null, null, null, "spReservation_GetLocation", null, StartTemp, EndTemp);
    });

    $(mainElem).find("input[id^='ULDLocation']").each(function () {
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], DisableOther, "contains", null, null, null, "spReservation_GetLocation", null, StartTemp2, EndTemp2);
    });
    $(elem).find("input[id^='Text_ULDLocation']").each(function () {
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], DisableOther, "contains", null, null, null, "spReservation_GetLocation", null, StartTemp, EndTemp);
    });
}
var Locationurl = 'Services/AutoCompleteService.svc/AutoCompleteDataSourcebyAWB';
function LocationAutoComplete(currentawbsno, textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, StartTemp, EndTemp) {
    var keyId = textId;
    textId = "Text_" + textId;
    $("div[id^='" + textId + "-list']").remove();

    //if (IsValid(textId, autoCompleteType)) {
    if (keyColumn == null || keyColumn == undefined)
        keyColumn = basedOn;
    if (textColumn == null || textColumn == undefined)
        textColumn = basedOn;
    var dataSource = GetLocationAutoCompleteDataSource(currentawbsno, textId, tableName, keyColumn, textColumn, templateColumn, procName, Locationurl, StartTemp, EndTemp);
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
    //}
}
function GetLocationAutoCompleteDataSource(currentawbsno, textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, StartTemp, EndTemp) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? url : newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    currentawbsno: currentawbsno,
                    StartTemp: StartTemp,
                    EndTemp: EndTemp
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


function AWBPrePrint() {
    var tnc = userContext.SysSetting.AWBPRINTTERMSCONDITIONS;
    if (currentawbsno > 0)
        // window.open("awbprintA4.html?sno=" + currentawbsno + "&pagename=ReservationBooking");
        window.open("awbprintA4.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre'));
    else
        ShowMessage('warning', 'Information!', "AWB marked as VOID. AWB Print is restricted");
    return;
}

//function AWBPrint(BookingTypeIndexNo) {
function AWBPrint(BookingTypeIndexNo, InternationalORDomestic) {
    var tnc = userContext.SysSetting.AWBPRINTTERMSCONDITIONS;
    if ((userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") && (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "Void")) {
        CheckPirntTime(currentawbsno, 0)
        if (resulawbprinttreturn == '1' && AWBStatusDetails != 'Void') {
            $("#PrintTypeAWbDialog").remove();
            $('#divbody').append('<div id="PrintTypeAWbDialog" style="font-family: Arial; font-size:13px;"></div>');
            $("#PrintTypeAWbDialog").append('<table id="tblpassword" style="margin: 0px auto; width:80%;"><tr><td>Select Print Type :</td></tr><tr><td><input type="hidden" name="AWbNo" id="AWbNo"  value=""><p><input type="radio" id="AWBPrint" value="AWBPrint" name="PrintType" checked = "checked" /><label for="AWBPrint" > AWB Print</label>&nbsp;&nbsp;&nbsp;&nbsp; <input type="radio" id="AWBPrePrint" value="AWBPrePrint" name="PrintType" /> <label for="AWBPrePrint">AWB Pre Print</label></p></td></tr></table>');
            $("#PrintTypeAWbDialog").dialog(
                {
                    autoResize: true,
                    maxWidth: 400,
                    width: 400,
                    modal: true,
                    title: 'Print Type AWB',
                    draggable: false,
                    resizable: false,
                    buttons: {
                        Print: function () {

                            var rbtnValue = $('input[name=PrintType]:checked').val();
                            if (currentawbsno > 0) {
                                if (rbtnValue != undefined && rbtnValue == 'AWBPrint') {

                                    window.open("awbprintA4.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo));
                                }
                                else if (rbtnValue != undefined && rbtnValue == 'AWBPrePrint') {
                                    window.open("awbprintA4.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre') + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo));
                                }
                                else {
                                    jAlert("Print not generated");
                                }
                            }
                            else {
                                jAlert("Print not generated");
                            }
                            $(this).dialog("close");
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    },
                    close: function () {
                        $(this).dialog("close");
                    }
                });
        }
        else if (resulawbprinttreturn == '0') {
            ShowMessage('warning', 'Information!', "AWB Print is allowed after '" + FlightDate + "'");
            return;
        }
        else if (AWBStatusDetails == 'Void') {
            ShowMessage('warning', 'Information!', "AWB marked as VOID. AWB Print is restricted");
            return;
        }
    }
    else {
        $("#PrintTypeAWbDialog").remove();
        $('#divbody').append('<div id="PrintTypeAWbDialog" style="font-family: Arial; font-size:13px;"></div>');
        $("#PrintTypeAWbDialog").append('<table id="tblpassword" style="margin: 0px auto; width:80%;"><tr><td>Select Print Type :</td></tr><tr><td><input type="hidden" name="AWbNo" id="AWbNo"  value=""><p><input type="radio" id="AWBPrint" value="AWBPrint" name="PrintType" checked="checked" /><label for="AWBPrint" > AWB Print</label>&nbsp;&nbsp;&nbsp;&nbsp; <input type="radio" id="AWBPrePrint" value="AWBPrePrint" name="PrintType" /> <label for="AWBPrePrint">AWB Pre Print</label></p></td></tr></table>');
        $("#PrintTypeAWbDialog").dialog(
            {
                autoResize: true,
                maxWidth: 400,
                width: 400,
                modal: true,
                title: 'Print Type AWB',
                draggable: false,
                resizable: false,
                buttons: {
                    Print: function () {
                        var rbtnValue = $('input[name=PrintType]:checked').val();
                        if (userContext.SysSetting.IsGenerateAWBNoForDomesticBooking != undefined && currentawbsno == 0 && userContext.SysSetting.IsGenerateAWBNoForDomesticBooking == '1') {
                            if (userContext.SysSetting.AWBPrintofIATAFormat == 'True' && (userContext.SysSetting.ClientEnvironment == 'G8' || userContext.SysSetting.ClientEnvironment == 'UK')) {

                                if (rbtnValue != undefined && rbtnValue == 'AWBPrint') {
                                    window.open("AwbPrintA4Contract.html?sno=" + btoa(AWBReferenceBookingPrimarySNo) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo) + "&InternationalORDomestic=" + btoa(InternationalORDomestic) + "&AWBPrintofIATAFormat=" + btoa(userContext.SysSetting.AWBPrintofIATAFormat));
                                }
                                else if (rbtnValue != undefined && rbtnValue == 'AWBPrePrint') {
                                    window.open("AwbPrintA4Contract.html?sno=" + btoa(AWBReferenceBookingPrimarySNo) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre') + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo) + "&InternationalORDomestic=" + btoa(InternationalORDomestic) + "&AWBPrintofIATAFormat=" + btoa(userContext.SysSetting.AWBPrintofIATAFormat));
                                }
                                else {
                                    jAlert("Print not generated");
                                }

                            }
                            else {
                                if (rbtnValue != undefined && rbtnValue == 'AWBPrint') {
                                    window.open("awbprintA4.html?sno=" + btoa(AWBReferenceBookingPrimarySNo) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo));
                                }
                                else if (rbtnValue != undefined && rbtnValue == 'AWBPrePrint') {
                                    window.open("awbprintA4.html?sno=" + btoa(AWBReferenceBookingPrimarySNo) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre') + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo));
                                }
                                else {
                                    jAlert("Print not generated");
                                }

                            }
                        }
                        else if (currentawbsno > 0) {
                            if (userContext.SysSetting.AWBPrintofIATAFormat == 'True' && (userContext.SysSetting.ClientEnvironment == 'G8' || userContext.SysSetting.ClientEnvironment == 'UK')) {
                                if (rbtnValue != undefined && rbtnValue == 'AWBPrint') {
                                    window.open("AwbPrintA4Contract.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo) + "&InternationalORDomestic=" + btoa(InternationalORDomestic) + "&AWBPrintofIATAFormat=" + btoa(userContext.SysSetting.AWBPrintofIATAFormat));
                                }
                                else if (rbtnValue != undefined && rbtnValue == 'AWBPrePrint') {
                                    window.open("AwbPrintA4Contract.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre') + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo) + "&InternationalORDomestic=" + btoa(InternationalORDomestic) + "&AWBPrintofIATAFormat=" + btoa(userContext.SysSetting.AWBPrintofIATAFormat));
                                }
                                else {
                                    jAlert("Print not generated");
                                }
                            } else {
                                if (rbtnValue != undefined && rbtnValue == 'AWBPrint') {
                                    window.open("awbprintA4.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo));
                                }
                                else if (rbtnValue != undefined && rbtnValue == 'AWBPrePrint') {
                                    window.open("awbprintA4.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('ReservationBooking') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre') + "&BookingTypeIndexNo=" + btoa(BookingTypeIndexNo));
                                }
                                else {
                                    jAlert("Print not generated");
                                }
                            }
                        }
                        else {
                            jAlert("Print not generated");
                        }
                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                },
                close: function () {
                    $(this).dialog("close");
                }
            });
    }
}
function AWBLabel() {
    if ((userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") && (AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD" || AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "Void")) {
        CheckPirntTime(currentawbsno, 1)
        if (resulawbprinttreturn == '1') {
            if (currentawbsno > 0 && AWBStatusDetails != "Void")
                window.open("HtmlFiles\\Shipment\\Label.html?Sno=" + btoa(currentawbsno));
            else
                ShowMessage('warning', 'Information!', "AWB marked as VOID. AWB Label Print is restricted");
        }
        else if (resulawbprinttreturn == '0') {
            ShowMessage('warning', 'Information!', "Label Print is allowed after '" + FlightDate + "'");
            return;
        }
    }
    else {
        if (currentawbsno > 0)
            window.open("HtmlFiles\\Shipment\\Label.html?Sno=" + btoa(currentawbsno));
        else
            jAlert("Enter AIR WAYBILL Details to print AWB label.", "Warning - AWB Label");
        return;
    }
}

function CloseViewFlightDetailPopUp() {
    var window = $("#divViewFlightDetailPopUp");
    window.data("kendoWindow").close();
}

function CloseViewRoutepopUp() {
    var window = $("#divViewRoutePopUp");
    window.data("kendoWindow").close();
}
function PopUpOnOpen(cntrlId) {
    return false;
}
function PopUpOnClose(cntrlId) {
    return false;
}
var NogDiv = '<div id="divareaTrans_shipment_shipmentnog" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Commodity"><span id="spnNOG"> Commodity</span></td><td class="formHeaderLabel" title="Other Commodity"><span id="spnOtherNOG">Other</span></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods" id="OtherNatureofGoods" value=""><input type="text" class="" name="Text_OtherNatureofGoods" id="Text_OtherNatureofGoods" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_0" id="OtherNatureofGoods_0" value=""><input type="text" class="" name="Text_OtherNatureofGoods_0" id="Text_OtherNatureofGoods_0" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_1" id="OtherNatureofGoods_1" value=""><input type="text" class="" name="Text_OtherNatureofGoods_1" id="Text_OtherNatureofGoods_1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_2" id="OtherNatureofGoods_2" value=""><input type="text" class="" name="Text_OtherNatureofGoods_2" id="Text_OtherNatureofGoods_2" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_3" id="OtherNatureofGoods_3" value=""><input type="text" class="" name="Text_OtherNatureofGoods_3" id="Text_OtherNatureofGoods_3" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_4"><td id="tdSNoCol_4" class="formSNo snowidth" style="" name="_4">6</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_4"  onblur="CalculatePieces(this);" id="Pieces_4" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_4" id="NogGrossWt_4" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_4" id="OtherNatureofGoods_4" value=""><input type="text" class="" name="Text_OtherNatureofGoods_4" id="Text_OtherNatureofGoods_4" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_4" id="NOG_4" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_5"><td id="tdSNoCol_5" class="formSNo snowidth" style="" name="_5">7</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_5"  onblur="CalculatePieces(this);" id="Pieces_5" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_5" id="NogGrossWt_5" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_5" id="OtherNatureofGoods_5" value=""><input type="text" class="" name="Text_OtherNatureofGoods_5" id="Text_OtherNatureofGoods_5" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_5" id="NOG_5" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_6"><td id="tdSNoCol_6" class="formSNo snowidth" style="" name="_6">8</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_6"  onblur="CalculatePieces(this);" id="Pieces_6" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_6" id="NogGrossWt_6" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_6" id="OtherNatureofGoods_6" value=""><input type="text" class="" name="Text_OtherNatureofGoods_6" id="Text_OtherNatureofGoods_6" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_6" id="NOG_6" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_7"><td id="tdSNoCol_7" class="formSNo snowidth" style="" name="_7">9</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_7"  onblur="CalculatePieces(this);" id="Pieces_7" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_7" id="NogGrossWt_7" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_7" id="OtherNatureofGoods_7" value=""><input type="text" class="" name="Text_OtherNatureofGoods_7" id="Text_OtherNatureofGoods_7" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_7" id="NOG_7" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_8"><td id="tdSNoCol_8" class="formSNo snowidth" style="" name="_8">10</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_8"  onblur="CalculatePieces(this);" id="Pieces_8" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_8" id="NogGrossWt_8" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_8" id="OtherNatureofGoods_8" value=""><input type="text" class="" name="Text_OtherNatureofGoods_8" id="Text_OtherNatureofGoods_8" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_8" id="NOG_8" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_9"><td id="tdSNoCol_9" class="formSNo snowidth" style="" name="_9">11</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_9"  onblur="CalculatePieces(this);" id="Pieces_9" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_9" id="NogGrossWt_9" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_9" id="OtherNatureofGoods_9" value=""><input type="text" class="" name="Text_OtherNatureofGoods_9" id="Text_OtherNatureofGoods_9" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_9" id="NOG_9" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
    + '</tbody></table>'
    + '</div>'
var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-primary btn-sm' style='width:125px' id='btnNew'>New Booking</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSave'>Save</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnUpdate'>Update</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnExecute'>Execute</button></td>" +
    "<td> <button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnCopyBooking'>Copy</button></td>" +
    //"<td><button class='btn btn-block btn-success btn-sm' onclick='AWBPrint()'  id='btnAWBPrint'>AWB Print</button></td>" +
    //"<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSaveToNext'>Save &amp; Next</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +

    "</tr></tbody></table> </div>";

var divContent = "<div class='rows'> <table style='width:100%'><input type='hidden' id='hdnBookingMasterRefNo'/><input type='hidden' id='hdnBookingSNo'/><input type='hidden' id='hdnPreviousBookingMasterRefNo'/><input type='hidden' id='hdnPreviousBookingSNo'/><input type='hidden' id='hdnShipperSNo'/><input type='hidden' id='hdnConsigneeSNo'/> <tr> <td valign='top' class='td100Padding'><div id='divViewRoutePopUp' style='width:100%'></div><div id='divViewFlightDetailPopUp' style='width:100%'></div><div id='divCBVHandlingInformationPopUp' style='width:100%'></div><div id='divCallerCodePopUp' style='width:100%'></div><div id='divBillingAddressPopUp' style='width:100% ;height:100%'></div><div id='divHSCodePopUp' style='width:100%'></div><div id='divShipmentDetails' style='width:100%'></div><div id='pWindow'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div><div id='divEDox' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td colspan='3'></td></tr><tr> <td id='IdAWBPrint' colspan='3' class='tdInnerPadding'>Print &nbsp;&nbsp;&nbsp;&nbsp;<select id='sprint' ><option value='AWB' selected>AWB</option><option value='CSD'  selected>eCSD</option><option value='AWBLabel'>AWB Label</option><option value='AcceptanceNote'>Acceptance Note</option><option value='PReceipt'>Payment Receipt</option><option value='Checklist'>Check List</option></select>&nbsp;<button name='button' onclick='bprint();' value='OK type='button'>Print</button></td></tr><tr id='trAmmendment'> <td>FWB Amendment</td><td>:</td><td><input type='checkbox' name='chkFWBAmmendMent' id='chkFWBAmmendMent'  onclick='ToggleCharge(this)'></td></tr><tr id='trAmmendmentCharge'> <td>Levy Amendment Charges</td><td>:</td><td><input type='checkbox' name='chkAmmendMentCharge' id='chkAmmendMentCharge' disabled></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> General </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";//<option value='EDI'>EDI Messages</option>
var rpl = "<ul id='ulReservation' style='display:none;'> <li class='k-state-active'> Reservation </li><li> Dimension </li><li>Rate</li><li>Message</li></ul> <div> <div id='ApplicationTabs-1'></div></div><div> <div id='ApplicationTabs-2'> </div></div><div><div id='ApplicationTabs-3'></div></div><div><div id='ApplicationTabs-4'></div></div>";
var SubGroupDiv = '<div id="divareaTrans_shipment_shipmentSHCSubGroup" style="display:none" cfi-aria-trans="trans">'
    + '<table class="WebFormTable"><tbody>'
    + '<tr><td class="formHeaderLabel snowidth" id="SubGroupSNo" name="SubGroupSNo">SNo</td><td class="formHeaderLabel" title="SHC"><span id="spnSHC"> SHC</span></td><td class="formHeaderLabel" title="Sub Group"><span id="spnSubGriup"> Sub Group</span></td>  <td class="formHeaderLabel" title=""><span id="spnLabel"></span></td><td class="formHeaderLabel" title="Mandatory Info"><span id="spnStatement"> Mandatory Info</span></td><td class="formHeaderLabel" title=""><span id="spnpackLabel" style="width: 150px;"></span></td> <td class="formHeaderLabel" title="Packing Instruction"><span id="spnPacking">Packing Instruction</span></td>   </tr>'
    + '</tbody></table>'
    + '</div>'

//------------------------For Hiding Span Style on Tooltip----------------------------------------------
function HideTooltipSpanStyleInfo() {
    setTimeout(function () {
        //---------- grid column-----
        $("[data-field='AWBPrefix']").closest('tr').find('th').each(function () {
            $(this).attr('title', $(this).attr('data-title'))

        })
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").find('.k-link').text('Acceptance Cut Off Time');
            $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").attr('Title', 'Acceptance Cut Off Time');


            $("[data-field='AWBPrefix']").closest('tr').find('th').each(function () {
                $(this).attr('title', $(this).attr('data-title'))

            })
        }
    }, 200);
    setTimeout(function () {
        $('.k-grid-content table tbody tr td').find('span:eq(1)').each(function () {
            var color = $(this).attr('style');
            $(this).closest('td').find('span:eq(0)').attr('style', color);
            $(this).closest('td').find('span:eq(0)').attr('title', $(this).text());

        });
        $(".k-pager-info").closest('span').on('DOMSubtreeModified', function () {
            $('.k-grid-content table tbody tr td').find('span:eq(1)').each(function () {
                var color = $(this).attr('style');
                $(this).closest('td').find('span:eq(0)').attr('style', color);
                $(this).closest('td').find('span:eq(0)').attr('title', $(this).text());
                //---------- grid column-----
                if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                    $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").find('.k-link').text('Acceptance Cut Off Time');
                    $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").attr('Title', 'Acceptance Cut Off Time');

                }
            });
        });

    }, 3000);
}
//----------------------------------------------------------------------------------------------------------------------------------------

//=======================================-------------------Applied  Spot Code Start From Here By AKAsh --------------------------------------




var AWBInformation = "<div id='Window' style='height: 400px;'><fieldset> " +
    "<legend>AWB Information :</legend><table id='AWBInformationwindow' style='Margin-top: 10px;Margin-bottom: 10px;    height: auto;' class='appendGrid ui-widget'> " +
    "<tr><th>AWB No</th><th style='width: 100px;'><label id='lblAWBNo'></th>" +
    "<th>Origin</th><th style='width: 100px;'><label id='lblOrigin'></th>" +
    "<th>Destination</th><th style='width: 100px;'><label id='lblDestination'></th>" +
    "<th>Pieces</th><th style='width: 100px;'><label id='lblPieces'></th>" +
    "</tr><tr>" +
    "<th>Gr. Weight</th><th style='width: 100px;'><label id='lblGrossWeight'></th>" +
    "<th>Volume</th><th style='width: 100px;'><label id='lblVolume'></th>" +
    "<th>Ch. Weight</th><th style='width: 100px;'><label id='lblChargableWeight'></th>" +
    "<th>Product</th><th style='width: 100px;'><label id='lblProduct'></th>" +
    "</tr><tr>" +
    "<th>Commodity</th><th style='width: 100px;'><label id='lblCommodity'></th>" +

    "<th>Nature Of Goods</th><th><label id='lblNatureOfGoods'></th>" +
    "<th></th><th style='width: 100px;'><label id=''></th>" +
    "<th></th><th style='width: 100px;'><label id=''></th></tr>" +
    "</table></fieldset> " +

    "<div id='Rate'><fieldset><legend>Rate Information :</legend><table id='RateInformationwindow' style='Margin-top: 10px;Margin-bottom: 10px;height: auto;' class='appendGrid ui-widget'> " +
    "<tr><th style='width: 200px;'>Rate</th><th style='width: 200px;'><label id='lblRate'></th>" +
    "<th style='width: 200px;'>Freight Amount</th><th style='width: 200px;'><label id='lblFreightAmount'></th></tr>" +
    "</table></fieldset></div>" +

    "<fieldset><legend>Code Information :</legend>" +
    "<input type='radio' name='CodeInformation' onchange='BindSpotCode(this.id)'  id='SpotCode' value='0'>Spot Code <input type='radio' name='CodeInformation' onchange='BindCampaignCode(this.id)' id='CampaignCode' value='1'>Campaign Code </input>" +

    "<div id='BindSpotCode' style='float: right;width: 500px;'></div></fieldset>" +

    "<div style='Margin-top: 10px;Margin-bottom: 10px;height: auto;'><input type='button' class='btn btn-success' id='BtnAppliedCode' onclick='SpotCodeApplied()'   style='width:120px;' value='Apply Code' /><input type='hidden'  name='hdnOriginCitySNo' id='hdnOriginCitySNo' /><input type='hidden'  name='hdnDestinationCitySNo' id='hdnDestinationCitySNo' /></div></div>";







function ApplySpotCode() {

    $('#Window').remove();

    $('#SectorRate ,#RequestedRate').removeAttr('data-valid');
    $('#_tempRequestedRate ,#_tempSectorRate').removeClass("valid_invalid", "bVErrMsgContainer");

    $('#tblApplySpotCode').append(AWBInformation);
    $('#Window th').addClass('ui-widget-header');
    $('#Window td').addClass('ui-widget-content');
    $('#Window td').css("text-align", "center");
    var AWBCode = $('#Text_AWBCode').val() || 0
    var AWBnumber = $('#AWBNumber').val() || 0


    var Modeldata = {
        AWBNo: AWBCode + '-' + AWBnumber


    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetAWbForSpotRate",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ spotRate: Modeldata }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {



            if (result != undefined) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $('#lblAWBNo').text(myData.Table0[0].AWBNo);
                        $('#lblOrigin').text(myData.Table0[0].Text_OriginCitySNo);
                        $('#lblDestination').text(myData.Table0[0].Text_DestinationCitySNo);
                        $('#lblPieces').text(myData.Table0[0].TotalPieces);

                        $('#lblGrossWeight').text(myData.Table0[0].TotalGrossWeight);
                        $('#lblVolume').text(myData.Table0[0].TotalCBM);
                        $('#lblChargableWeight').text(myData.Table0[0].TotalChargeableWeight);
                        $('#lblProduct').text(myData.Table0[0].ProductName);

                        $('#lblCommodity').text(myData.Table0[0].CommodityCode);
                        $('#lblNatureOfGoods').text(myData.Table0[0].NatureOfGoods);


                        $('#lblRate').text(myData.Table0[0].MKTRate);
                        $('#lblFreightAmount').text(myData.Table0[0].MKTFreight);
                        $('#hdnOriginCitySNo').val(myData.Table0[0].OriginCitySNo);
                        $('#hdnDestinationCitySNo').val(myData.Table0[0].DestinationCitySNo);

                    }
                }

                cfi.PopUp("Window", "View Spot Details");
                //$('div.k-window').css('width', '950px');
                //$('div.k-window').css('margin-left', '80.611px ! important');
            }
        }
    });

}



function BindSpotCode(Elem) {
    if (document.getElementById(Elem).value == 0) {
        //$('#BindSpotCode').remove(SpotCode);
        $('#InnerBindSpotCode').remove();
        $('#BindSpotCode').append('<div id="InnerBindSpotCode"></div>');

        //$('#InnerBindSpotCode').append("<input type='hidden'  name='SpotCodeSNo' id='SpotCodeSNo'><input type='text' name='Text_SpotCodeSNo'  id='Text_SpotCodeSNo' style='text-transform: uppercase;width:190px;' controltype='autocomplete' data-role='autocomplete' autocomplete='off'>");        
        //cfi.AutoComplete("SpotCodeSNo", "SpotCode", "RateAirlineAdhocRequest", "SNo", "SpotCode", null, null, "contains");

        $('#InnerBindSpotCode').append("<select style='width:200px'  id='Text_SpotCodeSNo'></select><input name='SpotCodeSNo' id='SpotCodeSNo' type='hidden' value=''/>");
        FillSpotCode();
        var SpotCode = SpotCodeValue || '';
        var AWBNumber = $('#AWBNumber').val() || 0;
        var CodeTypeValue = $('input[type=radio][name="CodeInformation"]:checked').val();
        var Modeldata = {
            AWBNumber,
            SpotCode,
            CodeTypeValue

        }

        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/GetApprovalRateInformation",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ SpotRate: Modeldata }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {



                if (result != undefined) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {

                            $('#Rate').append("<div id='ApprovalRate'><fieldset><legend>Approved Rate Information :</legend><table id='ApprovalRatewindow' style='Margin-top: 5px;Margin-bottom: 10px;height: auto;border-collapse: collapse;' class='appendGrid ui-widget'> " +
                                "<tr><th style='width: 200px;background: #daecf4;border: 1px solid #4297d7;'>Approved Rate</th><th style='width: 200px;background: #daecf4;border: 1px solid #4297d7;'><label id='lblApprovalRate'>" + myData.Table0[0].ApprovedRate + "</th>" +
                                "<th style='width: 200px;background: #daecf4;border: 1px solid #4297d7;'>Approved Freight</th><th style='width: 200px;background: #daecf4;border: 1px solid #4297d7;'><label id='lblApprovalFreight'>" + myData.Table0[0].ApprovedFreight + "</th></tr>" +
                                "</table></fieldset></div>")

                            if ($('input[type=radio][name="CodeInformation"]:checked').val() == 1) {
                                $('#ApprovalRate').hide()
                            }
                            else {
                                $('#ApprovalRate').show()
                            }


                        }
                    }


                }
            }
        });

    } else {


    }
}

function BindCampaignCode(Elem) {
    $('#ApprovalRate').remove()
    if (document.getElementById(Elem).value == 1) {
        //$('#BindSpotCode').remove(SpotCode);
        $('#InnerBindSpotCode').remove();
        $('#BindSpotCode').append('<div id="InnerBindSpotCode"></div>');


        $('#InnerBindSpotCode').append("<input type='text' name='Text_CampaignCode' class='k-input' autofocus= 'autofocus' id='Text_CampaignCode' style='text-transform: uppercase;width:190px;'/> ");


    } else {
        //$('#ccTopp').removeAttr("disabled");
        //alert('againclick');

    }
}


//-------------------------- Click On Applied Code

function SpotCodeApplied() {

    var CodeType = $('input[type=radio][name="CodeInformation"]:checked').val();

    //CodeType == 0 //Spot Code 
    //CodeType == 1 //Campaign Code

    var Modeldata = {
        AWbSNo: currentawbsno || 0,
        OriginSno: $('#hdnOriginCitySNo').val() || 0,
        DestinationCitySno: $('#hdnDestinationCitySNo').val() || 0,
        Pieces: $('#lblPieces').text() || 0,
        GrossWeight: $('#lblGrossWeight').text() || 0,
        Volume: $('#lblVolume').text() || 0,
        ChargeableWeight: $('#lblChargableWeight').text() || 0,
        SpotCode: $("#Text_SpotCodeSNo option:selected").text(),
        SpotSno: $("#Text_SpotCodeSNo").val() || 0,
        UpdatedBy: userContext.UserSNo,
        CodeType: CodeType,
        CampaignCode: $('#Text_CampaignCode').val() || 0,
        AccountSNo: $('#AWBAgent').val() || 0

    }
    if ($('input[type=radio][name="CodeInformation"]:checked').val() != undefined) {

        //if (CodeType == 0 && $('#Text_SpotCodeSNo').val() == "") {
        //    ShowMessage('warning', 'Warning - Apply Spot Code!', "Select Spot Code !.");
        //    return false;
        //}

        // This code is added by Umar for select spot code message on 03-Jul-2019
        if (CodeType == 0 && ($('#Text_SpotCodeSNo').val() == null || $('#Text_SpotCodeSNo').val() == undefined || $('#Text_SpotCodeSNo').val() == "0" || $('#Text_SpotCodeSNo').val() == "")) {
            ShowMessage('warning', 'Warning - Apply Spot Code!', "Select Spot Code !.");
            return false;
        }
        if (CodeType == 1 && $('#Text_CampaignCode').val() == "") {

            ShowMessage('warning', 'Warning - Apply Spot Code!', "Please Enter Campaign Code !.");
            return false;
        }


        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/SpotCodeApplied",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ spotCodeApplied: Modeldata }),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result != undefined) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            var Result = myData.Table0[0].Result;
                            //

                            if (Result == 'Single Code Applied Successfully.' || Result == 'Campaign Code Applied Successfully. !' || Result == 'Spot Code Applied Successfully.') {
                                ShowMessage('success', 'Success - Reservation', Result, "bottom-right");
                                CloseSpotCodeAppliedPopup();
                                cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
                                CleanUI();
                                ShipmentSearch();
                                currentawbsno = 0;
                                currentawbno = "";
                                HideTooltipSpanStyleInfo();
                            }
                            else {
                                ShowMessage('warning', 'Warning - Reservation', Result, "bottom-right");
                            }

                            //alert(myData.Table0[0].Result);
                        }
                    }
                }
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Apply Spot Code!', "Please select Either  Spot code or  campaign code .");
    }
}

function CloseSpotCodeAppliedPopup() {
    var window = $("#Window");
    window.data("kendoWindow").close();
}

// Added by AKARAM Ali on 31 Oct 2017
function GetOperationalDetail() {
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetOperationalDetail",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBSNo: currentawbsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData = jQuery.parseJSON(result);
            var IsresultFound = false;
            var tbl = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Operational Itinerary Details :</td></tr></table><table class='appendGrid ui-widget' id='tblOperationalDetails'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Flight Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol. Wt.</td><td id='Status' class='ui-widget-header'>Status</td></tr></thead><tbody class='ui-widget-content'>";
            if (myData.Table6.length > 0) {
                var Airport = "";
                for (var j = 0; j < myData.Table6.length; j++) {
                    Airport = myData.Table6[j].AirportCode;
                    if (myData.Table0.length > 0) {
                        IsresultFound = true;
                        for (var i = 0; i < myData.Table0.length; i++) {
                            if (Airport == myData.Table0[i].OrgAirportCode) {
                                tbl += "<tr id='" + myData.Table0[i].FlightNo + "'>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table0[i].OrgAirportCode + "/" + myData.Table0[i].DesAirportCode + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table0[i].Pieces + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table0[i].VolumeWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table0[i].Status + "</td>"
                                tbl += "</tr>";
                            }
                        }
                    }
                    if (myData.Table1.length > 0) {
                        IsresultFound = true;
                        for (var i = 0; i < myData.Table1.length; i++) {
                            if (Airport == myData.Table1[i].OrgAirportCode) {
                                tbl += "<tr id='" + myData.Table1[i].FlightNo + "'>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table1[i].FlightNo + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table1[i].FlightDate + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table1[i].OrgAirportCode + "/" + myData.Table1[i].DesAirportCode + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table1[i].Pieces + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table1[i].GrossWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table1[i].VolumeWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table1[i].Status + "</td>"
                                tbl += "</tr>";
                            }
                        }
                    }
                    if (myData.Table2.length > 0) {
                        IsresultFound = true;
                        for (var i = 0; i < myData.Table2.length; i++) {
                            if (Airport == myData.Table2[i].OrgAirportCode) {
                                tbl += "<tr id='" + myData.Table2[i].FlightNo + "'>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table2[i].FlightNo + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table2[i].FlightDate + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table2[i].OrgAirportCode + "/" + myData.Table2[i].DesAirportCode + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table2[i].Pieces + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table2[i].GrossWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table2[i].VolumeWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table2[i].Status + "</td>"
                                tbl += "</tr>";
                            }
                        }
                    }
                    if (myData.Table3.length > 0) {
                        IsresultFound = true;
                        for (var i = 0; i < myData.Table3.length; i++) {
                            if (Airport == myData.Table3[i].OrgAirportCode) {
                                tbl += "<tr id='" + myData.Table3[i].FlightNo + "'>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table3[i].FlightNo + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table3[i].FlightDate + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table3[i].OrgAirportCode + "/" + myData.Table3[i].DesAirportCode + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table3[i].Pieces + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table3[i].GrossWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table3[i].VolumeWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table3[i].Status + "</td>"
                                tbl += "</tr>";
                            }
                        }
                    }
                    if (myData.Table7.length > 0) {
                        IsresultFound = true;
                        for (var i = 0; i < myData.Table7.length; i++) {
                            if (Airport == myData.Table7[i].OrgAirportCode) {
                                tbl += "<tr id='" + myData.Table7[i].FlightNo + "'>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table7[i].FlightNo + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table7[i].FlightDate + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table7[i].OrgAirportCode + "/" + myData.Table7[i].DesAirportCode + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table7[i].Pieces + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table7[i].GrossWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table7[i].VolumeWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table7[i].Status + "</td>"
                                tbl += "</tr>";
                            }
                        }
                    }

                    if (myData.Table4.length > 0) {
                        IsresultFound = true;
                        for (var i = 0; i < myData.Table4.length; i++) {
                            if (Airport == myData.Table4[i].OrgAirportCode) {
                                tbl += "<tr id='" + myData.Table4[i].FlightNo + "'>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table4[i].FlightNo + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table4[i].FlightDate + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table4[i].OrgAirportCode + "/" + myData.Table4[i].DesAirportCode + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table4[i].Pieces + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table4[i].GrossWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table4[i].VolumeWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table4[i].Status + "</td>"
                                tbl += "</tr>";
                            }
                        }
                    }
                    if (myData.Table5.length > 0) {
                        IsresultFound = true;
                        for (var i = 0; i < myData.Table5.length; i++) {
                            if (Airport == myData.Table5[i].OrgAirportCode) {
                                tbl += "<tr id='" + myData.Table5[i].FlightNo + "'>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table5[i].FlightNo + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table5[i].FlightDate + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table5[i].OrgAirportCode + "/" + myData.Table5[i].DesAirportCode + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table5[i].Pieces + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table5[i].GrossWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table5[i].VolumeWeight + "</td>"
                                tbl += "<td class='ui-widget-content first'>" + myData.Table5[i].Status + "</td>"
                                tbl += "</tr>";
                            }
                        }
                    }


                }
            }
            if (IsresultFound == false)
                tbl = "";
            $("#divOperationalDetails").html('')
            $("#divOperationalDetails").append(tbl);

        },
        error: function (xhr) {
            var a = "";
        }
    });

}
function EWBGSTchange() {


    //  $('input:radio[name=EWBGST]:checked').change(function () {
    if ($("input[name='EWBGST']:checked").val() == '0') {

        $("#caller").text('EWB ');
    }
    else {

        $("#caller").text('GST ');
    }
    //   });

}
var SpotCodeValue;
function FillSpotCode() {

    // Last Updated by Umar on 06-Feb-2019 for data parameter || (0)
    if ($("#Text_SpotCodeSNo").find('option').length == 0) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/BindSpotCode",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AccountSNo: $('#AWBAgent').val() || 0,
                OriginCitySNo: $('#AWBOrigin').val() || 0,
                DestinationCitySNo: $('#AWBDestination').val() || 0,
                AWBSNo: currentawbsno || 0
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        $("#Text_SpotCodeSNo").append("<option value='0'>Select Spot Code</option>");
                        for (i = 0; i < myData.Table0.length; i++) {
                            $('select[id^="Text_SpotCodeSNo"]').append($("<option id='SpotCodeBind'></option>").val(myData.Table0[i].SNo).html(myData.Table0[i].SpotCode))

                            SpotCodeValue = myData.Table0[i].SpotCode;
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

}





function CalculatedInsurancePieces(id) {
    var TotalAWBPieces = 0;
    TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var Pieces = $('#tblInsurance_Pieces_' + rowIndex).val();
    var totalPieces = 0;
    var row = 0;
    var lastRow = 0;
    if (Pieces == 0) {

        if ($('#tblInsurance_Pieces_' + rowIndex).val() == 0) {
            $('#tblInsurance_Pieces_' + rowIndex).val('');
        }
        ShowMessage('warning', 'Information!', "Pieces cannot be zero.");
        return;
    }
    $("#tblInsurance").find("tr[id^='tblInsurance_Row_']").each(function () {
        totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblInsurance_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblInsurance_Pieces']").val() || 0) : ($(this).find("input[id^='tblInsurance_Pieces']").val() || 0));
    });
    if (Pieces > 0) {
        if (TotalAWBPieces != totalPieces) {
            var CurrentPieces = 0;
            if (totalPieces > TotalAWBPieces) {
                CurrentPieces = parseInt(TotalAWBPieces) - (parseInt(totalPieces) - parseInt(Pieces))
                ShowMessage('warning', 'Information!', "Pieces cannot be greater than Total AWB Pieces.");
                $('#tblInsurance_Pieces_' + rowIndex).val(CurrentPieces == 0 ? '' : CurrentPieces);
                $('#_temptblInsurance_Pieces_' + rowIndex).val(CurrentPieces == 0 ? '' : CurrentPieces);
                return;
            }

        }
    }
}


function CalculateInsuranceWeight(id) {
    var TotalAWBGrWt = 0;
    TotalAWBGrWt = parseFloat(($("#AWBGrossWeight").val() || 0) == 0 ? ($("#_tempAWBGrossWeight").val() || 0) : ($("#AWBGrossWeight").val() || 0));
    var rowIndex = id.split('_')[2];
    var Wt = $('#tblInsurance_Weight_' + rowIndex).val();
    var totalGrWt = 0;
    var row = 0;
    var lastRow = 0;
    if (Wt == 0) {
        if ($('#tblInsurance_Weight_' + rowIndex).val() == 0) {
            $('#tblInsurance_Weight_' + rowIndex).val('');
            ShowMessage('warning', 'Information!', "Weight cannot be zero.");
        }
        return;
    }
    $("#tblInsurance").find("tr[id^='tblInsurance_Row_']").each(function () {
        totalGrWt = totalGrWt + parseFloat(($(this).find("input[id^='tblInsurance_Weight']").val() || 0) == 0 ? ($(this).find("input[id^='tblInsurance_Weight']").val() || 0) : ($(this).find("input[id^='tblInsurance_Weight']").val() || 0));
    });
    if (Wt > 0) {
        if (TotalAWBGrWt != totalGrWt) {
            var CurrentGrWt = 0;
            if (totalGrWt > TotalAWBGrWt) {
                CurrentGrWt = parseFloat(TotalAWBGrWt) - (parseFloat(totalGrWt) - parseFloat(Wt))
                ShowMessage('warning', 'Information!', "Weight cannot be greater than Total Weight.");
                $('#tblInsurance_Weight_' + rowIndex).val(CurrentGrWt == 0 ? '' : CurrentGrWt);
                $('#_temptblInsurance_Weight_' + rowIndex).val(CurrentGrWt == 0 ? '' : CurrentGrWt);
                return;
            }

        }
    }


}

function CalculatePremiumAmount(id) {
    var rowIndex = id.split('_')[2];
    var DecValue = $('#tblInsurance_Declvalueforcarraige_' + rowIndex).val();
    var PremRate = $('#tblInsurance_PremiumRate_' + rowIndex).val();
    var TotalPremAmount = (parseFloat(DecValue || 0) * parseFloat(PremRate || 0) / 100)
    if (TotalPremAmount < 7000) {
        TotalPremAmount = 7000;
    }
    $('#tblInsurance_PremiumAmount_' + rowIndex).val(TotalPremAmount);
    $('#_temptblInsurance_PremiumAmount_' + rowIndex).val(TotalPremAmount);

}

//-------------Added By Arman For Changing amount on agentlogin
function refereshCreditLimit() {
    if (parseInt(userContext.AgentSNo) > 0) {
        var AccountSNo = $("#Text_AWBAgent").data("kendoAutoComplete").key()
        $.ajax({
            url: "../Services/Accounts/CreditLimitReportService.svc/refereshCreditLimit",
            data: { AccountSNo: AccountSNo },
            async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined && result.length > 0) {
                    var data = JSON.parse(result)
                    var str = data.Table0[0].RemainingCreditLimit
                    window.parent.top.$("#spnCreditLimit").text(str);

                }

            },
            error: function () {
                alert("Error in Data");
            }

        });


    }

}

function CheckSurpassedBCTTime(AWBSNo) {
    var resultreturn = "0";
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckSurpassedBCTTime",
        async: false,
        type: "GET",
        dataType: "json",
        data: {

            AWBSNo: AWBSNo
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SurpassedBCTTime == '1') {
                        resultreturn = "1";
                    }
                    else if (myData.Table0[0].SurpassedBCTTime == '2') {
                        resultreturn = "2";
                    }
                }
            }
            return resultreturn
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resultreturn;
}

function hidetblDueCarrierOtherChargeTab() {
    setTimeout(function () {
        $("tr[id^='tblDueCarrierOtherChargeTab_Row']").each(function (row, tr) {
            var ReferenceNumber = $(tr).find("label[id^='tblDueCarrierOtherChargeTab_ReferenceNumber_']").text();
            if (ReferenceNumber == "") {
                $(tr).find("button[id^='tblDueCarrierOtherChargeTab_Insert_']").attr("style", "display:none;");
                $(tr).find("input[id^='_temptblDueCarrierOtherChargeTab_ChargeValue_']").css("border", "solid 0px #DDEEEE")
                $(tr).find("input[id^='_temptblDueCarrierOtherChargeTab_ChargeValue_']").attr("readonly", "readonly");
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_ChargeValue_']").css("border", "solid 0px #DDEEEE")
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_ChargeValue_']").attr("readonly", "readonly");
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherchargeDetail_']").css("border", "solid 0px #DDEEEE")
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherchargeDetail_']").attr("readonly", "readonly");
                $(tr).find("select[id^='tblDueCarrierOtherChargeTab_Type_']").attr("disabled", true);
                $(tr).find("select[id^='tblDueCarrierOtherChargeTab_Type_']").css("k-input");
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherchargeCurrency_']").attr("disabled", true);
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
            } else {
                $(tr).find("input[id^='_temptblDueCarrierOtherChargeTab_ChargeValue_']").css("border", "solid 0px #DDEEEE")
                $(tr).find("input[id^='_temptblDueCarrierOtherChargeTab_ChargeValue_']").attr("readonly", "readonly");
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_ChargeValue_']").css("border", "solid 0px #DDEEEE")
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_ChargeValue_']").attr("readonly", "readonly");
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherchargeDetail_']").css("border", "solid 0px #DDEEEE")
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherchargeDetail_']").attr("readonly", "readonly");
                $(tr).find("select[id^='tblDueCarrierOtherChargeTab_Type_']").attr("disabled", true);
                $(tr).find("select[id^='tblDueCarrierOtherChargeTab_Type_']").css("k-input");
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherchargeCurrency_']").attr("disabled", true);
                $(tr).find("input[id^='tblDueCarrierOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
                if (userContext.SysSetting.ICMSEnvironment == 'GA') {
                    if (userContext.UserTypeName.toUpperCase() == "Agent" && AWBStatusNo == 4)
                        $(tr).find("button[id^='tblDueCarrierOtherChargeTab_Delete_']").attr("style", "display:block;");
                    else if (userContext.UserTypeName.toUpperCase() == "AIRLINE" && userContext.SysSetting.ClientEnvironment == 'TH' && AWBStatusNo > 5) {
                        $("#tblDueCarrierOtherChargeTab_btnAppendRow").attr("style", "display:none;");
                        $(tr).find("button[id^='tblDueCarrierOtherChargeTab_Delete_']").attr("style", "display:block;");

                    }
                    else if (userContext.UserTypeName.toUpperCase() != "Agent" && AWBStatusNo == 5)
                        $(tr).find("button[id^='tblDueCarrierOtherChargeTab_Delete_']").attr("style", "display:block;");
                    else
                        $(tr).find("button[id^='tblDueCarrierOtherChargeTab_Delete_']").attr("style", "display:none;");
                }
                else
                    $(tr).find("button[id^='tblDueCarrierOtherChargeTab_Delete_']").attr("style", "display:none;");
            }

        });

    }, 300)
}
function hidetblAgentOtherChargeTab() {

    setTimeout(function () {
        $("tr[id^='tblAgentOtherChargeTab_Row']").each(function (row, tr) {
            var RefNum = $(tr).find("label[id^='tblAgentOtherChargeTab_ReferenceNumber_']").text();
            if (RefNum != "") {
                if (userContext.SysSetting.ICMSEnvironment == 'GA') {
                    if (userContext.UserTypeName.toUpperCase() == "Agent" && AWBStatusNo == 4) {
                        $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:block;");
                    }
                    else if (userContext.UserTypeName.toUpperCase() == "AIRLINE" && userContext.SysSetting.ClientEnvironment == 'TH' && AWBStatusNo > 5) {
                        $("#tblAgentOtherChargeTab_btnAppendRow").attr("style", "display:none;");
                        $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:block;");
                    }
                    else if (userContext.UserTypeName.toUpperCase() != "Agent" && AWBStatusNo == 5) {
                        $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:block;");
                    }

                    else
                        $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");
                }
                else
                    $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");
            }
        });

    }, 300)


}
var RightsCheck = false, pendingProcessCheck = 0;
function PagerightsCheckReservation(subProcessSNo) {

    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.Apps.toString().toUpperCase() == "RESERVATIONBOOKING") {
            if (i.Apps.toString().toUpperCase() == "RESERVATIONBOOKING" && i.PageRight != "Delete") {
                if (i.Apps.toString().toUpperCase() == "RESERVATIONBOOKING" && i.PageRight == "New") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "RESERVATIONBOOKING" && i.PageRight == "Edit") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "RESERVATIONBOOKING" && i.PageRight == "Delete") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                    RightsCheck = true;
                    return
                }
            }
        }
    });
    if (RightsCheck) {

        $("#DownloadExcel").hide();
        $("#btnSaveCallerInformationData").hide();
        $("#ahref_HSCode").hide();
        $("#AddDimension").hide();
        $("#btnApplySpotCode").hide();
        $("#ItineraryViewRoute").hide();
        $("#ItinerarySearch").hide();
        $("#btnClearItineraryRoute").hide();
        $("#tblDimensionTab_btnUpdateAll").hide();
        $("#tblDimensionTab_btnUpdateText").hide();
        $("#btnSaveRateData").hide();
        $("#btnSaveHandlingInformation").hide();
        $("#btnSaveNotifyData").hide();
        $("#btnBackToReservationRateCustom").hide();
        $("#btnBackToReservationRate").hide();
        $("#btnBackToReservation").hide();
        $('#divFinalSelectedroute').find('button').hide();
        $('#tblCustomsOtherInformationTab').find('button').hide();
        $('#tblCustomsOCIInformationTab').find('button').hide();
        $('#divDimensionTab').find('button').hide();
        $('#tblDimensionTab').find('button').hide();
        $('#tblDueCarrierOtherChargeTab').find('button').hide();
        $('#tblAgentOtherChargeTab').find('button').hide();
        $("#divFooter").hide()


    }
    if (subProcessSNo != 0) {
        var isView = false, IsBlocked = false;
        //get the subprocess view permission
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == subProcessSNo) {
                isView = e.IsView;
                return;
            }
        });
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == subProcessSNo) {
                IsBlocked = e.IsBlocked;
                return;
            }
        });
        if (IsBlocked) {
            pendingProcessCheck = 1;
            $("#DownloadExcel").hide();
            $("#btnSaveCallerInformationData").hide();
            $("#ahref_HSCode").hide();
            $("#AddDimension").hide();
            $("#btnApplySpotCode").hide();
            $("#ItineraryViewRoute").hide();
            $("#ItinerarySearch").hide();
            $("#btnClearItineraryRoute").hide();
            $("#tblDimensionTab_btnUpdateAll").hide();
            $("#tblDimensionTab_btnUpdateText").hide();
            $("#btnSaveRateData").hide();
            $("#btnSaveHandlingInformation").hide();
            $("#btnSaveNotifyData").hide();
            $("#btnBackToReservationRateCustom").hide();
            $("#btnBackToReservationRate").hide();
            $("#btnBackToReservation").hide();
            $('#divFinalSelectedroute').find('button').hide();
            $('#tblCustomsOtherInformationTab').find('button').hide();
            $('#tblCustomsOCIInformationTab').find('button').hide();
            $('#divDimensionTab').find('button').hide();
            $('#tblDimensionTab').find('button').hide();
            $('#tblDueCarrierOtherChargeTab').find('button').hide();
            $('#tblAgentOtherChargeTab').find('button').hide();
            $("#divFooter").hide()
        } else {
            //if view permission is true
            if (isView) {
                pendingProcessCheck = 1;
                $("#DownloadExcel").hide();
                $("#btnSaveCallerInformationData").hide();
                $("#ahref_HSCode").hide();
                $("#AddDimension").hide();
                $("#btnApplySpotCode").hide();
                $("#ItineraryViewRoute").hide();
                $("#ItinerarySearch").hide();
                $("#btnClearItineraryRoute").hide();
                $("#tblDimensionTab_btnUpdateAll").hide();
                $("#tblDimensionTab_btnUpdateText").hide();
                $("#btnSaveRateData").hide();
                $("#btnSaveHandlingInformation").hide();
                $("#btnSaveNotifyData").hide();
                $("#btnBackToReservationRateCustom").hide();
                $("#btnBackToReservationRate").hide();
                $("#btnBackToReservation").hide();
                $('#divFinalSelectedroute').find('button').hide();
                $('#tblCustomsOtherInformationTab').find('button').hide();
                $('#tblCustomsOCIInformationTab').find('button').hide();
                $('#divDimensionTab').find('button').hide();
                $('#tblDimensionTab').find('button').hide();
                $('#tblDueCarrierOtherChargeTab').find('button').hide();
                $('#tblAgentOtherChargeTab').find('button').hide();
                $("#divFooter").hide()
            }
        }
    }
    if (pendingProcessCheck == 1) {
        $("#btnSaveCallerInformationData").hide();
    }
    //Page Right And Suprocess Checkwed 


}

function SplitShipmentAllowed() {
    var OrgCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var DestCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").key();
    var AcntSNo = $("#Text_AWBAgent").data("kendoAutoComplete").key();
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/SplitShipmentAllowed",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ OriginCitySNo: OrgCitySNo, DestinationCitySNo: DestCitySNo, AccountSNo: AcntSNo }),
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result == "1") {
                        $('#ItineraryPieces').removeAttr("disabled");
                        $('#_tempItineraryPieces').removeAttr("disabled");
                        $('#ItineraryGrossWeight').removeAttr("disabled");
                        $('#_tempItineraryGrossWeight').removeAttr("disabled");
                        IsSplitShipmentAllowed = true;
                    }
                    else {
                        $('#ItineraryPieces').attr("disabled", "disabled");
                        $('#_tempItineraryPieces').attr("disabled", "disabled");
                        $('#ItineraryGrossWeight').attr("disabled", "disabled");
                        $('#_tempItineraryGrossWeight').attr("disabled", "disabled");
                    }
                }

            }
        },
        error: function (xhr) {
            var a = "";
        }
    });

}
function SaveHandlingInformation() {
    if ($('#HandlingInformation').val() == "") {
        ShowMessage('warning', 'Information!', "Kindly Enter Handling Information.");
        return;
    }
    if (currentawbsno > 0) {
        $.ajax({
            url: "Services/Shipment/ReservationBookingService.svc/SaveHandlingInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, HandlingInfo: $('#HandlingInformation').val(), ReferenceNumber: $('#hdnBookingMasterRefNo').val(), AwbReferenceBookingSNo: $('#hdnBookingSNo').val() || "0" }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    ShowMessage('success', 'Success - Handling Information', "Processed Successfully", "bottom-right");
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Warning - Handling Information', result.split('?')[1], "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - Handling Information', "unable to process.", "bottom-right");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
            }
        });
    }
    else
        ShowMessage('warning', 'Information!', "First Execute Shipment than Handling Information Process.");
}

function CheckPirntTime(AWBSNo, IsLabel) {
    resulawbprinttreturn = "0";
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckPirntTime",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBSNo: AWBSNo,
            IsLabel: IsLabel
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    FlightDate = myData.Table0[0].FlightDate;
                    ETDTime = myData.Table0[0].ETD;
                    if (myData.Table0[0].Result == '1') {
                        resulawbprinttreturn = "1";
                    }
                }
            }
            return resulawbprinttreturn
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resulawbprinttreturn;
}

function BindPTIData() {

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/GetPTIData",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBSNo: currentawbsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                var shipperData = myData.Table0;
                var consigneeData = myData.Table1;
                var ptidata = myData.Table2;

                if (myData.Table0.length > 0) {
                    $("#PtiShipperName").val(myData.Table0[0].ShipperName);
                    $("#PtiAddress").val(myData.Table0[0].ShipperAddress);
                    $("#PtiPhoneNumber").val(myData.Table0[0].ShipperPhone);
                }
                if (myData.Table1.length > 0) {
                    $("#PtiConsigneeName").val(myData.Table1[0].ConsigneeName);
                    $("#PticonAddress").val(myData.Table1[0].ConsigneeAddress);
                    $("#PticonPhoneNumber").val(myData.Table1[0].ConsigneePhone);
                    $("#PtiAWBNo").val(myData.Table1[0].AWBNo);
                }
                if (myData.Table2.length > 0) {
                    $("#_tempPtiPieces").val(myData.Table2[0].Piece);
                    $("#PtiPieces").val(myData.Table2[0].Piece);
                    $("#_tempPtiGrossWeight").val(myData.Table2[0].GrossWeight);
                    $("#PtiGrossWeight").val(myData.Table2[0].GrossWeight);
                    $("#Ptieoc").val(myData.Table2[0].ExplanationofContents);
                    $("#PtiOtherIdentity").val(myData.Table2[0].IDcard);
                }
                Disablecontrols();
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function Disablecontrols() {
    $("#PtiShipperName").prop('readonly', true);
    $("#PtiAddress").prop('readonly', true);
    $("#PtiPhoneNumber").prop('readonly', true);
    $("#PtiConsigneeName").prop('readonly', true);
    $("#PticonAddress").prop('readonly', true);
    $("#PticonPhoneNumber").prop('readonly', true);
    $("#PtiAWBNo").prop('readonly', true);
}

function ValidatePTIPieces() {
    if (parseInt($('#PtiPieces').val()) == 0) {
        ShowMessage('warning', 'Warning - PTI', "Kindly Enter No of Pieces.", "bottom-right");
        $('#PtiPieces').val('');
        return;
    }
    if ($('#PtiPieces').val() > $('#AWBPieces').val()) {
        ShowMessage('warning', 'Warning - PTI', "Pieces can not be greater than Total AWB Pieces.", "bottom-right");
        $('#PtiPieces').val('');
        return;
    }
}

function ValidatePTIGrossWt() {
    if (parseInt($('#PtiGrossWeight').val()) == 0) {
        ShowMessage('warning', 'Warning - PTI', "Kindly Enter Gross Weight.", "bottom-right");
        $('#PtiGrossWeight').val('');
        return;
    }
    if ($('#PtiGrossWeight').val() > $('#AWBChargeableWeight').val()) {
        ShowMessage('warning', 'Warning - PTI', "Gross Weight can not be greater than Total AWB Gross Weight.", "bottom-right");
        $('#PtiGrossWeight').val('');
        return;
    }
}
function SavePITDatails() {
    if ($('#PtiPieces').val() == "" || parseInt($('#PtiPieces').val()) == 0) {
        ShowMessage('warning', 'Warning - PTI', "Kindly Enter Pieces.", "bottom-right");
        return;
    }
    if ($('#PtiGrossWeight').val() == "" || parseFloat($('#PtiGrossWeight').val()) == 0) {
        ShowMessage('warning', 'Warning - PTI', "Kindly Enter Gross Weight.", "bottom-right");
        return;
    }

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/SavePITDatails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno, OtherIdentity: $('#PtiOtherIdentity').val(), Pieces: $('#PtiPieces').val(), GrossWeight: $('#PtiGrossWeight').val(), EOC: $('#Ptieoc').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
            }
            else {
                ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function AWBPrintPTI() {
    window.open("AwbPrintPTI.html?sno=" + btoa(currentawbsno));
}
function BindMinimumChWt() {

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/BindMinimumChWt",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0 && myData.Table0[0].ChWt > 0) {
                    IsChargeableWt = 1;
                    MinimumChWt = myData.Table0[0].ChWt;
                }
                else {
                    IsChargeableWt = 0;
                    MinimumChWt = 0;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

$(document).on('keyup', '[name^=tblInsurance_NOG_]', function () {
    var yourInput = $(this).val();
    re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    var isSplChar = re.test(yourInput);
    if (isSplChar) {
        var no_spl_char = yourInput.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        $(this).val(no_spl_char);
    }
});


function CheckTaxId(id, UType, CountrySno, CustomerSno) {
    var CheckTaxIdResult = true;
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/CheckTaxID",
        async: false,
        type: "GET",
        dataType: "json",
        data: { TaxId: id, UserType: UType, CountrySno: CountrySno, CustomerSno: CustomerSno },
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

function checkoc(result) {
    alert(result);
}

function CheckExchangeRate(obj) {
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT') {
        var RowNo = $(obj).attr('id').split('_')[2]
        var mode = $(obj).attr('id').split('_')[0]

        var currency = ""
        if (mode == 'tblDueCarrierOtherChargeTab')
            currency = $("#tblDueCarrierOtherChargeTab_HdnOtherchargeCurrency_" + RowNo).val();
        else
            currency = $("#tblAgentOtherChargeTab_HdnAgentOtherchargeCurrency_" + RowNo).val();
        var AirlineSNo = userContext.AirlineSNo
        if (currency != "") {
            tblDueCarrierOtherChargeTab
            $.ajax({
                url: "../Services/Accounts/DirectPaymentService.svc/GetExchangeRate", async: false, type: "GET", dataType: "json", cache: false,
                data: {
                    currency: currency, Mode: 3, AirlineSNo: $("#AWBCode").val() || 0, AccountSNo: 0
                },   // 1 for direct payment
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != undefined && result.length > 0) {
                        var ResultData = jQuery.parseJSON(result);
                        var FromCurrency = ResultData.Table0[0]["FromCurrency"]
                        var ToCurrency = ResultData.Table0[0]["ToCurrency"]
                        if (ResultData.Table0[0]["Error"] == "2") {
                            ShowMessage('warning', 'Warning', "Exchange Rate Not Available for: " + FromCurrency + " To " + ToCurrency + "");
                            if (mode == 'tblDueCarrierOtherChargeTab') {
                                $("#tblDueCarrierOtherChargeTab_HdnOtherchargeCurrency_" + RowNo).val('');
                                $("#tblDueCarrierOtherChargeTab_OtherchargeCurrency_" + RowNo).val('');
                            }
                            else {
                                $("#tblAgentOtherChargeTab_HdnAgentOtherchargeCurrency_" + RowNo).val('');
                                $("#tblAgentOtherChargeTab_AgentOtherchargeCurrency_" + RowNo).val('');
                            }
                        }


                    }
                }
            });
        }
    }
}

function getAWBNoInfo(url) {

    var awbWind = window.open("/");
    if (awbWind) {
        awbWind[awbWind.addEventListener ? 'addEventListener' : 'attachEvent'](
            (awbWind.attachEvent ? 'on' : '') + 'load', function () {
                awbWind.document.getElementById('iMasterFrame').src = url
            }, false
        );
    }
}


//function abc()
//{

//   // window.location.replace("https://www.tutorialrepublic.com/");


//    var jk = document.getElementById("iMasterFrame").src = "Default.cshtml?Module=Shipment&Apps=AWBTracking&FormAction=New";

//    window.open(jk, 'name');
//}
//function ExtraParameters(id) {
//    var param = [];
//    if (id == "Text_AWBCode") {
//        var UserSNo = userContext.UserSNo;
//        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
//        return param;
//    }
//    else if (id == "Text_ItineraryCarrierCode") {
//        var UserSNo = userContext.UserSNo;
//        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
//        return param;
//    }

//}


