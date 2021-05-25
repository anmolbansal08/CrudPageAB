var dbTableName = 'FlightReOpen';
var pageType = $('#hdnPageType').val();
$('tr').find('td.formbuttonrow').remove();
$("#__SpanHeader__").css("color", "black");
var IsReExecute = false;
$(document).ready(function () {
    $("#Text_AirlineName").val(userContext.AirlineCarrierCode);
    $("#AirlineName").val(userContext.AirlineSNo);
    
    cfi.DateType("FlightDate");
    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Shipment_Origin", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "Shipment_Origin", null, "contains");
    cfi.AutoCompleteV2("AirlineName", "CarrierCode,AirlineName", "Shipment_AirlineName", null, "contains");
    cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "Shipment_FlightNum", null, "contains");
    cfi.AutoCompleteV2("searchFlightStatus", "FlightStatusValue", "Shipment_FlightStatus", null, "contains");
    $(document.body).append('<div id="tblFlightDetails" style="width: 100%"></div>');

    UserPageRights("GROUPBOOKING")
    $("#Origin").val(userContext.AirportSNo);
    $("#Text_Origin").val(userContext.AirportCode + '-' + userContext.AirportName);
    if (userContext.GroupName.toUpperCase() == 'GSA') {
        if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
          

            $('#Text_Origin').data("kendoAutoComplete").enable(false);
        }
    }
    
});
function ExtraCondition(searchFlightNo) {
    var filterAND = cfi.getFilter("AND");
    var filterOR = cfi.getFilter("or");
    //if (searchFlightNo.indexOf("Text_searchFlightStatus") >= 0) {
    //    cfi.setFilter(filterAND, "UserSno", "eq", 0);
    //    cfi.setFilter(filterOR, "UserSno", "eq", userContext.UserSNo);
    //    return cfi.autoCompleteFilter([filterAND, filterOR]);
    //}
    if (searchFlightNo == "Text_DFOrigin") {
        cfi.setFilter(filterAND, "FlightNo", "eq", $('#Text_FlightNo').val().trim());
        cfi.setFilter(filterAND, "FlightDate", "eq", $('#FlightDate').val());
    }
    else if (searchFlightNo == "Text_DFDestination") {
        cfi.setFilter(filterAND, "FlightNo", "eq", $('#Text_FlightNo').val().trim());
        cfi.setFilter(filterAND, "FlightDate", "eq", $('#FlightDate').val());
    }
    else if (searchFlightNo.indexOf("Text_searchFlightNo") >= 0) {
        cfi.setFilter(filterAND, "BoardingPoint", "eq", $('#Text_Origin').val().split('-')[0]);
        cfi.setFilter(filterAND, "EndPoint", "eq", $("#Text_Destination").val().split('-')[0]);
        cfi.setFilter(filterAND, "FlightDate", "eq", cfi.CfiDate("searchFlightDate"));
        if ($('#Text_searchFlightStatus').val() != "")
            cfi.setFilter(filterAND, "FlightStatus", "eq", $('#Text_searchFlightStatus').val());
        //cfi.setFilter(filterAND, "OriginAirportSNo", "eq", $("#Text_Origin").data("kendoAutoComplete").key());
        //cfi.setFilter(filterAND, "DestinationAirPortSNo", "eq", $("#Text_Destination").data("kendoAutoComplete").key());
        //cfi.setFilter(filterAND, "FlightDate", "eq", cfi.CfiDate("searchFlightDate"));       
        //if ($('#Text_searchFlightStatus').val() == "DEP") {
        //    cfi.setFilter(filterAND, "IsDeparted", "eq", "1");
        //    cfi.setFilter(filterAND, "IsNILManifested", "eq", "0");
        //}
        //else if ($('#Text_searchFlightStatus').val() == "MAN") {
        //    cfi.setFilter(filterAND, "IsManifested", "eq", "1");
        //    cfi.setFilter(filterAND, "IsDeparted", "eq", "0");
        //    cfi.setFilter(filterAND, "IsNILManifested", "eq", "0");
        //}
        //else if ($('#Text_searchFlightStatus').val() == "NIL") {
        //    cfi.setFilter(filterAND, "IsNILManifested", "eq", "1");
        //}
        //else if ($('#Text_searchFlightStatus').val() == "NIL ARRIVED") {
        //    cfi.setFilter(filterAND, "IsNilArrived", "eq", "1");
        //}
        //else if ($('#Text_searchFlightStatus').val() == "PRE") {
        //    cfi.setFilter(filterAND, "IsPreManifested", "eq", "1");
        //    cfi.setFilter(filterAND, "IsManifested", "eq", "0");
        //    cfi.setFilter(filterAND, "IsDeparted", "eq", "0");
        //}
        //else if ($('#Text_searchFlightStatus').val() == "ARR") {
        //    cfi.setFilter(filterAND, "IsArrived", "eq", "1");
        //}
    }
    else if (searchFlightNo.indexOf("Origin") >= 0 || searchFlightNo.indexOf("Destination") >= 0) {
        cfi.setFilter(filterAND, "SNo", "neq", $("#" + searchFlightNo.replace("Text_Origin", "Destination").replace("Text_Destination", "Origin")).val());
    }
    else if (searchFlightNo == "Text_AirlineName") {
        cfi.setFilter(filterAND, "IsInterline", "eq", "0");
    }

    else if (searchFlightNo == "Text_FlightNo")
    {
        if ($("#PreviousFlightDate").text().trim() == $("#FlightDate").val().trim())
        cfi.setFilter(filterAND, "FlightNo", "neq", $("#OriginFlightNo").text().trim());
    }
    return cfi.autoCompleteFilter([filterAND, filterOR]);
}

function SearchFlight() {
    if (cfi.IsValidSubmitSection()) {
        BindAppendGrid1();
        var totalRows = $('[id^="btntblFlightOpen_Insert_"]').length;
        for (var i = 1; i <= totalRows; i++) {
            if ($('#tblFlightOpen_FlightStatus_' + i.toString()).text() == 'Open' || $('#tblFlightOpen_FlightStatus_' + i.toString()).text().trim() == 'BUILD UP' || $('#tblFlightOpen_FlightStatus_' + i.toString()).text() == 'CLSD' || $('#tblFlightOpen_FlightStatus_' + i.toString()).text() == 'Cancel' || $('#tblFlightOpen_FlightStatus_' + i.toString()).text() == 'ARR') {
                $('#btntblFlightOpen_Insert_' + i.toString()).hide();
            }
        }
    }
}

function BindAppendGrid1() {
    //var Airline = $('#AirlineName').val().toString();
    //var Org = $('#Text_Origin').val().split('-')[0].toString();
    //var Dest = $('#Text_Destination').val().split('-')[0].toString();
    //var searchFlightNo = $('#searchFlightNo').val();
    //var searchFlightStatus = $('#searchFlightStatus').val();
    //var dateflight = $('#searchFlightDate').attr("sqldatevalue").toString();
    //var passvalue = Org + '~' + Dest + '~' + searchFlightNo + '~' + dateflight + '~' + Airline + '~' + searchFlightStatus;
    var dbTableName = 'FlightOpen';
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        isGetRecord: true,
        tableColumns: 'SNo,AirCraftSNo,DoorName,UnitType,Height,Width,IsActive,CreatedBy,UpdatedBy',
        masterTableSNo: 1,
        currentPage: 1,
        itemsPerPage: 5,
        //whereCondition: passvalue.toString(),
        model: BindWhereCondition(),
        sort: '',
        servicePath: '../Services/Shipment/AmendFlightStatusService.svc',
        getRecordServiceMethod: 'GetFlightControlGridData',
        createUpdateServiceMethod: '',//'createUpdateAmendFlightStatus',
        caption: 'Group Booking Flight Details',
        initRows: 1,
        columns: [
            { name: 'SNo', type: 'hidden' },
            { name: 'AirlineName', display: 'Airline Name', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
            { name: 'FlightNo', display: 'Flight No', type: 'button', ctrlCss: { width: '80px', height: '21px', color: 'white', 'background-color': 'cornflowerblue' }, isRequired: false },
            { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
            { name: 'BoardingPoint', display: 'Boarding Point', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
            { name: 'EndPoint', display: 'Off Point', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
            { name: 'ETD', display: 'STD', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
            { name: 'ETA', display: 'STA', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
            { name: 'DAY', display: 'Day Difference', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'ACType', display: 'A/C Type', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'CAO', display: 'CAO', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
            { name: 'FlightStatus', display: 'Flight Status', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
            { name: 'FlightStatus', type: 'hidden' },
            { name: 'AvilableGrossWeight', display: 'Available Gross', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            { name: 'AvilableVolumeWeight', display: 'Available Volume', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            //{
            //    name: 'FlightAmendmentRemarks', display: 'Remark', type: 'textarea', ctrlCss: { width: '200px', height: '30px', }, ctrlAttr: { maxlength: 100, rows: 5 }
            //    , isRequired: true,
            //}
        ],
        isPaging: true,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            update: true,
            updateAll: true
        }
        /*,
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            for (var i = 1; i <= addedRowIndex.length; i++) {
                $('#tblFlightOpen_Insert_' + i.toString()).attr('title', 'Group Booking Details');
            }
            $('[id^="tblFlightOpen_Row_"]').each(function () {
                $(this).find('[id^="tblFlightOpen_Insert_"]').hide();
                var id = ($(this).find('[id^="tblFlightOpen_Insert_"]').attr('id'));
                $(this).find('[id^="tblFlightOpen_Insert_"]').before('<input type="button" id="btn' + id + '" onclick="Update(this.id)" title="Amend Flight Status" name="operation" class="insert ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" style="margin-top:0px; width:70px;" value="Amend" />');
                //$("#btn" + id + "").css("background", "#51a351");
                //$("#btn" + id + "").css("border", "#51a351");
            });
            $('#tblFlightOpen tr td[colspan="1"]').css('height', '30px');
            removeValidations();
            //setTimeout(function () {
            //    for (var i = 0; i <= (addedRowIndex.length - 1) ; i++) {
            //        var FlightStatusId = "#" + ($(this).find('[id^="tblFlightOpen_FlightStatus_"]').attr('id'));
            //        if ($('#tblFlightOpen_FlightStatus_' + i.toString()).text() != 'Open') {
            //            $(this).find('[id^="tblFlightOpen_Insert_"]').before('<button id="btn' + i + '" onclick="Update(this.id)" title="Amend Flight Status" name="operation" class="insert ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" style="margin-top:0px; width:50px;"><span class="ui-button-icon-primary ui-icon ui-icon-refresh"></span></button>');
            //        }
            //    }
            //}, 2000);
        }*/
    });
   // $(".ui-widget-header").eq("16").text("Action");
    $('[id^="tblFlightOpen_FlightNo_"]').css("background-color", "cornflowerblue");
}
function removeValidations() {
    $('[id^="tblFlightOpen_FlightAmendmentRemarks_"]').removeAttr('required');
    $('[id^="tblFlightOpen_FlightAmendmentRemarks_"]').css('border', '');
}

function Update(id) {
    removeValidations();
    $('#' + id).closest('tr').each(function () {
        $(this).find('[id^="tblFlightOpen_FlightAmendmentRemarks_"]').attr("required", true);
    });
    var uRows = id.split('_')[2];
    if (!validateTableData('tblFlightOpen', uRows)) {
        return false;
    }
    else {

        var DataArray = [];
        $('#' + id).closest('tr').each(function () {
            var Array = {
                SNo: parseInt($(this).find('[id^="tblFlightOpen_SNo_"]').val() == "" ? 0 : $(this).find("input[id^='tblFlightOpen_SNo_']").val()),
                FlightNo: $(this).find('[id^="tblFlightOpen_FlightNo_"]').val(),
                FlightStatus: $(this).find("[id^='tblFlightOpen_FlightStatus_']").val(),
                FlightAmendmentRemarks: $(this).find("input[id^='tblFlightOpen_FlightAmendmentRemarks_']").val(),

            };
            DataArray.push(Array);
        });
        if (DataArray.length > 0) {
            $.ajax({
                url: "../Services/Shipment/AmendFlightStatusService.svc/createUpdateAmendFlightStatus",
                async: false,
                type: "POST",
                cache: false,
                data: JSON.stringify({ AmendFlightStatus: DataArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "2000") {
                        ShowMessage('success', 'Success - Flight Status', "Flight Status Added Successfully.");
                        //$('#btnGenerate').click();
                    }
                    else if (result == "2001") {
                        ShowMessage('success', 'Success - Flight Status', " Flight Status Updated Successfully.");
                        BindAppendGrid1();
                        var totalRows = $('[id^="btntblFlightOpen_Insert_"]').length;
                        for (var i = 1; i <= totalRows; i++) {
                            if ($('#tblFlightOpen_FlightStatus_' + i.toString()).text() == 'Open' || $('#tblFlightOpen_FlightStatus_' + i.toString()).text().trim() == 'BUILD UP' || $('#tblFlightOpen_FlightStatus_' + i.toString()).text() == 'CLSD') {
                                $('#btntblFlightOpen_Insert_' + i.toString()).hide();
                            }
                        }
                        //$('#btnGenerate').click();
                    }
                    else if (result == "2002") {
                        ShowMessage('warning', 'Warning - Flight Status', "Flight is Open. Not Possible to amend the Flight.");
                        //$('#btnGenerate').click();
                    }

                    else {
                        ShowMessage('warning', 'Warning - Flight Status', "Unable to process.");
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Flight Status', "unable to process.");
                }

            });
        }
        $('[id ^= "tblFlightOpen_FlightNo_"]').css("background-color", "cornflowerblue");
    }
}

$(document).on('click', '[id^="tblFlightOpen_FlightNo_"]', function () {

    $('[id ^= "tblFlightOpen_FlightNo_"]').css('background-color', 'cornflowerblue');
    $(this).css('background-color', '#ff3300');

    sno = "#tblFlightOpen_SNo_" + this.id.split("_")[2];
    var flightDateId = "#tblFlightOpen_FlightDate_" + this.id.split("_")[2];
    var flightDate = $(flightDateId).text();
    var AirlineName = "#tblFlightOpen_AirlineName_" + this.id.split("_")[2];
    FlightNo = "#tblFlightOpen_FlightNo_" + this.id.split("_")[2];
    BoardPoint = "#tblFlightOpen_BoardingPoint_" + this.id.split("_")[2];
    EndPoint = "#tblFlightOpen_EndPoint_" + this.id.split("_")[2];

    sno = $(sno).val();
    AirlineName = $(AirlineName).text()
    FlightNo = $(FlightNo).val()
    BoardPoint = $(BoardPoint).text()
    EndPoint = $(EndPoint).text()
    GetFlightDetails(sno, AirlineName, FlightNo, BoardPoint, EndPoint, flightDate);
});

function GetFlightDetails(sno, AirlineName, FlightNo, BoardPoint, EndPoint, flightDate) {
    $.ajax({
        url: "../Services/Shipment/AmendFlightStatusService.svc/GetFlightDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: { DailyFlightSno: sno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData = jQuery.parseJSON(result);
            if (myData.Table0.length > 0) {
                if (myData.Table0[0].AWBStatus != '1') {
                    cfi.PopUp("tblFlightDetails", "Flight Transfer", 1300, null, null, null);
                    $("#tblFlightDetails").closest(".k-window").css({
                        position: 'fixed',
                        top: '5%'
                    });
                    var theDiv = document.getElementById("tblFlightDetails");
                    theDiv.innerHTML = '';
                    var str1 = "<table class='WebFormTable' style='width: 100%; top:0px;margin-top:0px;' >"
                    str1 += "<tr><td colspan='8' class='ui-widget-content' style='text-align: center;'><b>Existing Flight Details</b></td><tr>"
                        + "<td class='ui-widget-content'><strong>Airline Name</strong> </td> "
                        + "<td class='ui-widget-content'>" + AirlineName + "</td>"
                        + "<td class='ui-widget-content'><strong>Flight No.</strong> </td> "
                        + "<td class='ui-widget-content'><label id='OriginFlightNo'>" + FlightNo + "</label></td>"
                        + "<td class='ui-widget-content'><strong>Board Point</strong> </td> "
                        + "<td class='ui-widget-content'>" + BoardPoint + "</td>"
                        + "<td class='ui-widget-content'><strong>End Point</strong> </td> "
                        + "<td class='ui-widget-content'>" + EndPoint + "</td>"
                        + "</tr>"
                    str1 += "<tr>"
                        + "<td class='ui-widget-content'><strong>Flight Date</strong> </td> "
                        + "<td class='ui-widget-content'><label id='PreviousFlightDate'>" + flightDate + "</label></td>"
                        + "<td class='ui-widget-content'><strong></strong> </td> "
                        + "<td class='ui-widget-content'></td>"
                        + "</tr>"
                    str1 += "<tr><td colspan='8' class='ui-widget-content' style='text-align: center;'><b>New Flight Details</b></td><tr>"
                        + "<td class='ui-widget-content'><strong>Flight Date<span style='color:red'>*</span></strong> </td> "
                        + "<td class='ui-widget-content'><input type='text' class='input-md form-control  tt-input k-input k-state-default hasDatepicker' name='FlightDate' id='FlightDate' >"
                        + "</td>"
                        + "<td class='ui-widget-content'><strong>Flight No<span style='color:red'>*</span></strong></td>"
                        //+ "<td class='ui-widget-content'><select style='width: 130px;' id='Text_FlightNo'><option value='0'>Select Flight</option></select></td> "
                        + "<td class='ui-widget-content'><div><input type='hidden' id='FlightNo' name='FlightNo' tabindex='0' value=''><span><input type='text' id='Text_FlightNo' name='Text_FlightNo' tabindex='0' controltype='autocomplete' data-role='autocomplete' autocomplete='off' class='k-input' style='width: 100%; text-transform: uppercase;'></span></div></td> "
                        + "<td class='ui-widget-content'><strong> Origin<span style='color:red'>*</span></strong> </td> "

                        + "<td class='ui-widget-content'><input type='hidden' id='DFOrigin' name='DFOrigin' tabindex='0' />"
                        + "<input type=text id='Text_DFOrigin' name='Text_DFOrigin' tabindex='0' controltype='autocomplete' /> </td>"
                        + "<td class='ui-widget-content'><strong>Destination<span style='color:red'>*</span></strong> </td> "
                        + "<td class='ui-widget-content'><input type='hidden' id='DFDestination' name='DFDestination' tabindex='0' />"
                        + "<input type=text id='Text_DFDestination' name='Text_DFDestination' tabindex='0' controltype='autocomplete' /></td>"
                        + "</tr>"
                    str1 += "<tr>"
                        + "<td class='ui-widget-content'><strong>Remarks<span style='color:red'>*</span></strong></td>"
                        + "<td class='ui-widget-content'><textarea rows='2' cols='20' id='txtFlightTransferRemarks' name='Remarks'></textarea></td>"
                        + "<td class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'></td>"
                        + "</tr>"
                    str1 += "<tr id='trFlightCapacityDetails' style='display:none'><td colspan='8' class='ui-widget-content'><table style='width: 100%;'>"
                        + "<tr><td colspan='8' style='text-align: center;'><b>Flight Capacity</b></td></tr>"
                        + "<tr>"
                        + "<td class='ui-widget-content'><strong>Flight</strong></td> "
                        + "<td id ='tdFlightTransfer_FlightNo' class='ui-widget-content'>Flight No</td>"
                        + "<td class='ui-widget-content'><strong>Flight Date</strong></td> "
                        + "<td id ='tdFlightTransfer_FlightDate' class='ui-widget-content'>Flight Date</td>"
                        + "<td class='ui-widget-content'><strong>Flight Gross Capacity</td> "
                        + "<td id ='tdFlightTransfer_FlightCapacity' class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'><strong>Flight Volume Capacity</td> "
                        + "<td id ='tdFlightTransfer_Volume' class='ui-widget-content'></td>"
                        + "</tr>"
                    str1 += "<tr>"
                        + "<td class='ui-widget-content'><strong>Allotment Gross/Used/Avail</strong></td> "
                        + "<td id ='tdFlightTransfer_AllotmentGrossUsedAvail' class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'><strong>Allotment Volume/Used/Avail</strong></td> "
                        + "<td id ='tdFlightTransfer_AllotmentVolumeUsedAvail' class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'><strong>Free Sale Gross/Avail/Used</td> "
                        + "<td id ='tdFlightTransfer_FreeSaleGrossAvailUsed' class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'><strong>Free Sale Volume/Avail/Used</td> "
                        + "<td id ='tdFlightTransfer_FreeSaleVolumeAvailUsed' class='ui-widget-content'></td>"
                        + "</tr>"
                    str1 += "<tr>"
                        + "<td class='ui-widget-content'><strong>Over Booked Gross Capacity/Avail/Used</strong></td> "
                        + "<td id ='tdFlightTransfer_OverBookedGrossCapacityAvailUsed' class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'><strong>Over Booked Volume Capacity/Avail/Used</strong></td> "
                        + "<td id='tdFlightTransfer_OverBookedVolumeCapacityAvailUsed' class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'><strong>Reserved Gross Capacity/Avail/Used</strong></td>"
                        + "<td id='tdFlightTransfer_ReservedGrossCapacityAvailUsed' class='ui-widget-content'></td>"
                        + "<td class='ui-widget-content'><strong>Reserved Volume Capacity/Avail/Used</strong></td> "
                        + "<td id='tdFlightTransfer_ReservedVolumeCapacityAvailUsed' class='ui-widget-content'></td>"
                        + "</tr></td></table></tr>"
                    str1 += "<tr>"
                        + "<td align=center colspan='8' class='ui-widget-content'><input type='button' id='btnSaveRateMaster' name='btnSaveRateMaster' value='Save' class='btn btn-success' style='width: 80px;'></td>"
                        + "</tr>"
                    str1 += "</table><br/>";
                    var str = "<table class='appendGrid ui-widget' style='width: 100%; top:0px;margin-top:0px;' >"
                    str += "<tr>"
                        + "<td align=center class='ui-widget-header'><input type='checkbox' class='checkbox' Id='ChkSelectAll' name='ChkSelectAll'/></td> "
                        + "<td align=center class='ui-widget-header'> Booking Type </td>"
                        + "<td align=center class='ui-widget-header'> RF No./AWB No.</td>"
                        + "<td align=center class='ui-widget-header'>Agent</td>"
                        + "<td align=center class='ui-widget-header'>Product</td>"
                        + "<td align=center class='ui-widget-header'>Origin</td>"
                        + "<td align=center class='ui-widget-header'>Destination</td>"
                        + "<td align=center class='ui-widget-header'>Commodity</td>"
                        + "<td align=center class='ui-widget-header'> Gr. Weight </td>"
                        + "<td align=center class='ui-widget-header'> Volume </td>"
                        + "<td align=center class='ui-widget-header'> Total Pieces </td>"
                        + "<td align=center class='ui-widget-header'>Revenue</td> "
                        + "<td align=center class='ui-widget-header'>Chr. Weight</td> "
                        + "<td align=center class='ui-widget-header'>Yield</td> "
                        + "<td align=center class='ui-widget-header'>AWB Status</td> "
                        + "<td align=center class='ui-widget-header'>Status</td>"
                        + "</tr>"
                    AwbPcs = [];
                    GrossWeight = [];
                    Volume = [];
                    for (var i = 0; i < myData.Table0.length; i++) {
                        AwbPcs[i] = myData.Table0[i].AwbPcs;
                        GrossWeight[i] = myData.Table0[i].GrossWeight;
                        Volume[i] = myData.Table0[i].Volume;
                        var x = myData.Table0[i].isPlanned == 1 ? "disabled" : "";
                        str += "<tr>"
                            + "<td class='ui-widget-content first'><input type='checkbox' " + x + " class='checkbox' ID='ChkAction_" + i + "' name='IE1'/><input type='hidden' id='hdnSNo_" + i + "' name='hdnSNo_" + i + "' value=" + myData.Table0[i].SNo + "></td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].BookingType + "</td>"
                            + "<td class='ui-widget-content first'><label id='ReferenceNumber_" + i + "'>" + myData.Table0[i].ReferenceNumber + "</label></td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].Agent + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].ProductName + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].Origin + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].Destination + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].CommodityCode + "</td>"
                            + "<td class='ui-widget-content first'><label' id='GrossWeight_" + i + "'/>" + myData.Table0[i].GrossWeight + "</td>"
                            + "<td class='ui-widget-content first'><label' id='Volume_" + i + "'/>" + myData.Table0[i].Volume + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].FlightPieces + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].Revenue + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].ChargeableWeight + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].Yeild + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].AWBStatus + "</td>"
                            + "<td class='ui-widget-content first'>" + myData.Table0[i].AWBRouteStatus + "</td>"
                            + "</td></tr>"
                    }
                    str += "</table><div id='MessageList'></div>"
                    theDiv.innerHTML = str1 + str;

                    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Shipment_FlightSearch", onSelectFlightSearch, "contains");
                    // Changes by Vipin Kumar
                    //cfi.AutoComplete("DFOrigin", "OriginCode,DestinationName", "DF_GetFlightODPair", "OriginSNo", "OriginCode", ["OriginCode", "DestinationName"], OnSelectOrigin, "contains");
                    cfi.AutoCompleteV2("DFOrigin", "OriginCode,DestinationName", "Shipment_DFOrigin", OnSelectOrigin, "contains");
                    //cfi.AutoComplete("DFDestination", "AirportCode,AirportName", "DF_GetFlightODPair", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
                    cfi.AutoCompleteV2("DFDestination", "AirportCode,AirportName", "Shipment_DFDestination", OnSelectDestination, "contains");
                    // Ends
                    cfi.DateType("FlightDate");
                    var todaydate = new Date();
                    var flightdate = $("#FlightDate").data("kendoDatePicker");
                    flightdate.min(todaydate);
                    
                    if (isCreate == true) {
                        $("#btnSaveRateMaster").show()
                    } else {
                        $("#btnSaveRateMaster").hide()
                    }
                    AuditLogBindOldValue("tblFlightDetails");
                }
                else {
                    //ShowMessage('warning', 'Warning - Amend Flight Status', "No Shipment On " + FlightNo + "Flight.", "bottom-right");
                    ShowMessage('warning', 'Warning - Amend Flight Status', myData.Table0[0].Message, "bottom-right");
                    return;
                }
            }
            else {
                ShowMessage('warning', 'Warning - Group Booking Flight Details', "No Shipment On " + FlightNo + "Flight.", "bottom-right");
                return;
            }
        }
    });
}

$(document).on('blur', '[id^="AwbPcs_"]', function () {
    var id = this.id.split('_')[1];
    if (parseInt(this.value) > parseInt(AwbPcs[id])) {
        ShowMessage('warning', 'Warning - Flight Transfer', "AwbPcs cannot be greater than " + AwbPcs[id]);
        $("#AwbPcs_" + id).val(AwbPcs[id]);
        $("#AwbPcs_" + id).focus();
        return false;
    }
    if (parseInt(this.value) == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "AwbPcs cannot be 0 ");
        $("#AwbPcs_" + id).val(AwbPcs[id]);
        $("#AwbPcs_" + id).focus();
        return false;
    }
});
$(document).on('blur', '[id^="GrossWeight_"]', function () {

    var id = this.id.split('_')[1];
    if (parseFloat(this.value) > parseFloat(GrossWeight[id])) {
        ShowMessage('warning', 'Warning - Flight Transfer', "GrossWeight cannot be greater than " + GrossWeight[id]);
        $('#GrossWeight_' + id).val(GrossWeight[id]);
        $("#GrossWeight_" + id).focus();
        return false;
    }
    if (parseFloat(this.value) == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "GrossWeight cannot be 0 ");
        $('#GrossWeight_' + id).val(GrossWeight[id]);
        $("#GrossWeight_" + id).focus();
        return false;
    }
});
$(document).on('blur', '[id^="Volume_"]', function () {
    var id = this.id.split('_')[1];
    if (parseFloat(this.value) > parseFloat(Volume[id])) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Volume cannot be greater than " + Volume[id]);
        $('#Volume_' + id).val(Volume[id]);
        $("#Volume_" + id).focus();
        return false;
    }
    if (parseFloat(this.value) == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Volume cannot be 0 ");
        $('#Volume_' + id).val(Volume[id]);
        $("#Volume_" + id).focus();
        return false;
    }
})

$(document).on('click', '#btnSaveRateMaster', function () {
    IsReExecute = false;
    UpdateFlightPlan(IsReExecute);
});
$(document).on('click', '#ChkSelectAll', function (e) {

    $('[id^="ChkAction_"][disabled!="disabled"]').prop('checked', this.checked);
    // var checked = this.checked;
    //for (var i = 0; i < $('[id^="ChkAction_"]').length; i++) {
    //    $("#ChkAction_" + i).attr('checked', checked);
    //}
});

$(document).on('change', '#FlightDate', function () {
    //$('#Text_FlightNo').html('');
    //$('#Text_FlightNo').append('<option val="0">Select Flight</option>');
    $('#FlightNo').val('');
    $('#Text_FlightNo').val('');
    $("#Text_DFOrigin").val('');
    $("#DFOrigin").val('');
    $("#Text_DFDestination").val('');
    $("#DFDestination").val('');
    $("#Text_DFOrigin").data("kendoAutoComplete").enable(true);
    $("#Text_DFDestination").data("kendoAutoComplete").enable(true);
    $("#trFlightCapacityDetails").hide();
});
/*
$(document).on('click change', '#Text_FlightNo', function () {
    if ($("#Text_FlightNo option").length == 1) {
        var OriginFlight = $('#OriginFlightNo').html().trim();
        var CarrierCode = $('#OriginFlightNo').html().split('-')[0].trim();
        var FlightDate = $('#FlightDate').val();
        var PreviousFlightDate = $('#PreviousFlightDate').html().trim();
        var Source = BoardPoint;
        var Destination = EndPoint;
        $.ajax({
            url: "../Services/Shipment/AmendFlightStatusService.svc/getFlightDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ FlightNo: OriginFlight, FlightDate: FlightDate, Source: Source, Destination: Destination, CarrierCode: CarrierCode }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != null && result != "") {
                    var MsgTable = jQuery.parseJSON(result);
                    var FlightsData = MsgTable.Table0;
                    if (FlightsData.length > 0) {
                        $('#Text_FlightNo').html('');
                        $('#Text_FlightNo').append('<option val="0">Select Flight</option>');
                        for (var i = 0; i < FlightsData.length; i++) {
                            if (!(FlightsData[i]["FlightNo"] == OriginFlight && FlightsData[i]["FlightDate"] == PreviousFlightDate)) {
                                var listitem = "<option val='" + FlightsData[i]["SNo"] + "'>" + FlightsData[i]["FlightNo"] + "</option>";
                                $('#Text_FlightNo').append(listitem);
                            }
                        }
                        //cfi.ClosePopUp("tblFlightDetails");
                    }
                }
            }
        });
    }
    else {
        var FlightNo = $("#Text_FlightNo").val().trim();
        var FlightDate = $('#FlightDate').val();
        $.ajax({
            url: "../Services/Shipment/AmendFlightStatusService.svc/getFlightOrigin", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != null && result != "") {
                    var MsgTable = jQuery.parseJSON(result);
                    var MsgData = MsgTable.Table0;
                    if (MsgData.length > 0) {
                        $("#trFlightCapacityDetails").hide();
                        $("#Text_DFDestination").val('');
                        $("#DFDestination").val('');
                        $("#Text_DFOrigin").val(MsgData[0].OriginAirportCode);
                        $("#DFOrigin").val(MsgData[0].OriginAirportSNo);
                        //cfi.ClosePopUp("tblFlightDetails");
                    }
                    else {
                        $("#Text_DFOrigin").val('');
                        $("#DFOrigin").val('');
                        $("#Text_DFDestination").val('');
                        $("#DFDestination").val('');
                        $("#trFlightCapacityDetails").hide();
                    }
                }
            }
        });
    }
});

*/
function OnSelectOrigin(input) {
    if ($("#Text_DFOrigin").val() == "") {
        $("#Text_DFDestination").val('');
        $("#DFDestination").val('');
        $("#trFlightCapacityDetails").hide();
    }
}

function OnSelectDestination(input) {
    if ($("#Text_DFDestination").val() != "") {
        var FlightNo = $("#Text_FlightNo").val().trim();
        var FlightDate = $('#FlightDate').val();
        var OriginSNo = $('#DFOrigin').val();
        var DestinationSNo = $('#DFDestination').val();
        $.ajax({
            url: "../Services/Shipment/AmendFlightStatusService.svc/getFlightCapacity", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != null && result != "") {
                    var MsgTable = jQuery.parseJSON(result);
                    var MsgData = MsgTable.Table0;
                    if (MsgData.length > 0) {
                        $("#trFlightCapacityDetails").show();
                        $("#tdFlightTransfer_FlightNo").html(MsgData[0]["FlightNo"]);
                        $("#tdFlightTransfer_FlightDate").html(MsgData[0]["FlightDate"]);
                        $("#tdFlightTransfer_FreeSaleGrossAvailUsed").html(MsgData[0]["FreeSaleGrossAvailUsed"]);
                        $("#tdFlightTransfer_FreeSaleVolumeAvailUsed").html(MsgData[0]["FreeSaleVolumeAvailUsed"]);
                        $("#tdFlightTransfer_AllotmentGrossUsedAvail").html(MsgData[0]["AllotmentGrossUsedAvail"]);
                        $("#tdFlightTransfer_AllotmentVolumeUsedAvail").html(MsgData[0]["AllotmentVolumeUsedAvail"]);
                        $("#tdFlightTransfer_FlightCapacity").html(MsgData[0]["FlightCapacity"]);
                        $("#tdFlightTransfer_Volume").html(MsgData[0]["Volume"]);
                        $("#tdFlightTransfer_OverBookedGrossCapacityAvailUsed").html(MsgData[0]["OverBookedGrossCapacityAvailUsed"]);
                        $("#tdFlightTransfer_OverBookedVolumeCapacityAvailUsed").html(MsgData[0]["OverBookedVolumeCapacityAvailUsed"]);
                        $("#tdFlightTransfer_ReservedGrossCapacityAvailUsed").html(MsgData[0]["ReservedGrossCapacityAvailUsed"]);
                        $("#tdFlightTransfer_ReservedVolumeCapacityAvailUsed").html(MsgData[0]["ReservedVolumeCapacityAvailUsed"]);
                    }
                    else {
                        $("#trFlightCapacityDetails").hide();
                    }
                }
            }
        });
    }
    else {
        $("#trFlightCapacityDetails").hide();
    }
}

function BindWhereCondition() {
    return {
        Airline: $('#AirlineName').val().toString(),
        Org: $('#Text_Origin').val().split('-')[0].toString(),
        Dest: $('#Text_Destination').val().split('-')[0].toString(),
        SearchFlightNo: $('#searchFlightNo').val(),
        SearchFlightStatus: $('#searchFlightStatus').val(),
        DateFlight: $('#searchFlightDate').attr("sqldatevalue").toString(),
    }

    //whereCondition: '' + FDate +
    //        '*' + TDate + '*' + Issue + '*' + ULD +'*'+UCR +'*'+Recd + '', sort: ''
}

function ResetSearch()
{
    IsReExecute = false;
    $('.k-i-close').click();
    $("div .k-overlay").remove();
    SearchFlight();
}

// Amit
function ExtraParameters(id) {
    var param = [];
    if (id == "Text_FlightNo") {
        var BoardPoint = $("#tblFlightOpen_BoardingPoint_1").text()
        var FlightDate = $('#FlightDate').val();
        var CarrierCode = $('#OriginFlightNo').html().split('-')[0].trim();
        var EndPoint = $("#tblFlightOpen_EndPoint_1").text();
        param.push({ ParameterName: "FlightDate", ParameterValue: FlightDate });
        param.push({ ParameterName: "Origin", ParameterValue: BoardPoint });
        param.push({ ParameterName: "Destination", ParameterValue: EndPoint });
        param.push({ ParameterName: "SearchCarrierCode", ParameterValue: CarrierCode });
        return param;
    }
    else if (id == "Text_AirlineName") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}

function onSelectFlightSearch()
{
    $("#Text_DFOrigin").val($('#FlightNo').val().split('/')[1]);
    $("#DFOrigin").val($('#FlightNo').val().split('/')[2]);
    $("#Text_DFOrigin").data("kendoAutoComplete").enable(false);
    $("#Text_DFDestination").val($('#FlightNo').val().split('/')[3]);
    $("#DFDestination").val($('#FlightNo').val().split('/')[4]);
    $("#Text_DFDestination").data("kendoAutoComplete").enable(false);
    OnSelectDestination();
}

var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;

function UserPageRights(apps) {

    $(userContext.PageRights).each(function (i, e) {
        if (e.Apps.toUpperCase() == apps.toUpperCase()) {
            if (e.PageRight.toUpperCase() == 'New'.toUpperCase()) {
                isCreate = true;
            }
            if (e.PageRight.toUpperCase() == 'Edit'.toUpperCase()) {
                IsEdit = true;
            }
            if (e.PageRight.toUpperCase() == 'Delete'.toUpperCase()) {
                IsDelete = true;
            }
            if (e.PageRight.toUpperCase() == 'Read'.toUpperCase()) {
                IsRead = true;
            }
        }
    });

}

function UpdateFlightPlan(IsReExecute) {

    var ExistingDailyFlightSNo = sno;
    var TransferDailyFlightSNo = $("#FlightNo").val().split('/')[0];
    var FlightDate = $('#FlightDate').val();
    if (FlightDate == "") {
        ShowMessage('warning', 'Warning - Flight Transfer', "Please select Flight Date", "bottom-right");
        return;
    }
    var FlightNo = $('#Text_FlightNo').val().trim();
    if (FlightNo == "0") {
        ShowMessage('warning', 'Warning - Flight Transfer', "Please select Flight", "bottom-right");
        return;
    }
    var Origin = $('#DFOrigin').val();
    if (Origin == "" || Origin == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Please select Origin", "bottom-right");
        return;
    }
    var Destination = $('#DFDestination').val();
    if (Destination == "" || Destination == 0) {
        ShowMessage('warning', 'Warning - Group Booking', "Please select Destination", "bottom-right");
        return;
    }
    var TransferRemarks = $("#txtFlightTransferRemarks").val();
    if (TransferRemarks.length == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Please enter remarks for proceeding", "bottom-right");
        return;
    }
    var length = $('[id^="ChkAction_"]:checked').length;
    if (length == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Please select atleast one record to proceed", "bottom-right");
        return;
    }
    var referenceNumber = '';
    var SNo = '';
    var Pieces = '';
    var GrossWeight = '';
    var Volume = '';
    var TotalGrossWeight = 0.00;
    var TotalVolume = 0.00;
    for (var i = 0; i < $('[id^="ChkAction_"]').length; i++) {
        if ($("#ChkAction_" + i).is(':checked')) {
            SNo = SNo + $("#hdnSNo_" + i).val() + ",";
            referenceNumber = referenceNumber + $("#ReferenceNumber_" + i).text() + ",";
            Pieces = Pieces + $("#AwbPcs_" + i).text() + ",";
            GrossWeight = GrossWeight + $("#GrossWeight_" + i).text() + ",";
            TotalGrossWeight = TotalGrossWeight + parseFloat($("#GrossWeight_" + i).text());
            Volume = Volume + $("#Volume_" + i).text() + ",";
            TotalVolume = TotalVolume + parseFloat($("#Volume_" + i).text());
        }
    }
    var FlightGrossCapacity = parseFloat($("#tdFlightTransfer_FlightCapacity").text()); // + parseFloat($("#tdFlightTransfer_OverBookedGrossCapacityAvailUsed").text().split('/')[1]);
    var FlightVolumeCapacity = parseFloat($("#tdFlightTransfer_Volume").text()); // + parseFloat($("#tdFlightTransfer_OverBookedVolumeCapacityAvailUsed").text().split('/')[1]);
    var FlightRemainingGrossWeight = parseFloat($("#tdFlightTransfer_FreeSaleGrossAvailUsed").text().split('/')[1]) + parseFloat($("#tdFlightTransfer_OverBookedGrossCapacityAvailUsed").text().split('/')[1]) + parseFloat($("#tdFlightTransfer_ReservedGrossCapacityAvailUsed").text().split('/')[1]);
    var FlightRemainingVolume = parseFloat($("#tdFlightTransfer_FreeSaleVolumeAvailUsed").text().split('/')[1]) + parseFloat($("#tdFlightTransfer_OverBookedVolumeCapacityAvailUsed").text().split('/')[1]) + parseFloat($("#tdFlightTransfer_ReservedVolumeCapacityAvailUsed").text().split('/')[1]);
    if (FlightGrossCapacity < TotalGrossWeight) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Shipment Gross Weight is greater than Flight Gross Weight", "bottom-right");
        return;
    }
    if (FlightVolumeCapacity < TotalVolume) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Shipment Volume is greater than Flight Volume", "bottom-right");
        return;
    }
    if (FlightRemainingGrossWeight < TotalGrossWeight) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Shipment Gross Weight is greater than Flight Remaining Gross Weight", "bottom-right");
        return;
    }
    if (FlightRemainingVolume < TotalVolume) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Shipment Volume is greater than Flight Remaining Volume", "bottom-right");
        return;
    }
    var referenceno = referenceNumber.substring(0, referenceNumber.length - 1);
    var pieces = Pieces.substring(0, Pieces.length - 1);
    var grossweight = GrossWeight.substring(0, GrossWeight.length - 1);
    var volume = Volume.substring(0, Volume.length - 1);
    var OriginFlight = $('#OriginFlightNo').html().trim();
    var arrVal = [];

    $.ajax
       ({
           url: "../Services/Shipment/AmendFlightStatusService.svc/UpdateFlightPlan", async: false, type: "POST", dataType: "json", cache: false,
           data: JSON.stringify({ ExistingDailyFlightSNo: ExistingDailyFlightSNo, ReferenceNumber: referenceno, FlightNumber: FlightNo, FlightDate: FlightDate, BoardingPoint: parseInt(Origin), EndPoint: parseInt(Destination), OriginFlightNo: OriginFlight, Pieces: pieces, GrossWeight: grossweight, Volume: volume, TransferRemarks: TransferRemarks, IsReExecute: IsReExecute, TransferDailyFlightSNo: TransferDailyFlightSNo }),
           contentType: "application/json; charset=utf-8",
           success: function (result) {
               if (result != null && result != "") {
                   var MsgTable = jQuery.parseJSON(result);
                   var MsgData = MsgTable.Table0;
                   if (MsgData.length > 0) {
                       if (MsgData[0].MessageNumber == '1' || MsgData[0].MessageNumber == '4') {
                           
                           ShowMessage('warning', 'Warning - Flight Transfer', MsgData[0].Message, "bottom-right");
                       }
                       else if (MsgData[0].MessageNumber == '3') {
                           ShowMessage('success', 'Success - Flight Transfer', MsgData[0].Message, "bottom-right");
                           //Started Code:Added By Shivali Thakur
                           $("#Text_FlightNo").attr("newvalue", $("#Text_FlightNo").text())
                           $("#FlightDate").attr("newvalue", $("#FlightDate").val())
                           $("#txtFlightTransferRemarks").attr("newvalue", $("#txtFlightTransferRemarks").val())

                           var flightno = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "GroupBooking", ColumnName: 'Flight-No.', OldValue: $("#OriginFlightNo").attr("oldvalue"), NewValue: FlightNo };
                           var flightdate = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "GroupBooking", ColumnName: 'Flight-Date', OldValue: $("#FlightDate").attr("oldvalue"), NewValue: $("#FlightDate").attr("newvalue") };
                           var remarks = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "GroupBooking", ColumnName: 'Remarks', OldValue: "", NewValue: $("#txtFlightTransferRemarks").attr("newvalue") };

                           arrVal.push(flightno);
                           arrVal.push(flightdate);
                           arrVal.push(remarks);

                           SaveAppendGridAuditLog("AWBNo.", referenceNumber, "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                           //Ended Code:Added By Shivali Thakur
                           ResetSearch();
                       }
                       else {
                           var length = MsgData.length;
                           var message = '';

                           var MsgDiv = $("MessageList").html('');

                           var str1 = "<table class='WebFormTable' style='width: 100%; top:0px;margin-top:0px;' >";
                           str1 += "<tr>"
                               + "<td class='ui-widget-content'><strong>S.No.</strong> </td> "
                               + "<td class='ui-widget-content'><strong>Reference No / AWB No</strong> </td> "
                               + "<td class='ui-widget-content'><strong>Message Type</strong> </td>"
                               + "<td class='ui-widget-content'><strong>Failure Reasons</strong> </td>"
                               + "</tr>"
                           var canProcess = false;
                           for (var i = 0; i < length; i++) {
                               // message += (i + 1) + ". " + MsgData[i].Message + "\n";
                               str1 += "<tr>"
                               + "<td class='ui-widget-content'>" + (i + 1) + "</td> "
                               + "<td class='ui-widget-content'>" + MsgData[i].Reference + "</td> "
                                + "<td class='ui-widget-content'>" + MsgData[i].MessageType + "</td>"
                               + "<td class='ui-widget-content'>" + MsgData[i].Message + "</td>"
                               + "</tr>"
                               if (MsgData[i].IsMCTFaild == 'True' && MsgData[i].IsProcess == 'True') {
                                   canProcess = true
                               }
                           }
                           if (canProcess) {
                               str1 += "</table><div align=right class='ui-widget-content'><input type='button' onclick='DeLinkFlights(0)' id='btnSaveDeLink' name='btnSaveDeLink' value='Save' class='btn btn-success' style='width: 80px;'></div><div id='ConfirmMSG'></div>";
                           }
                           else {
                               str1 += "</table>";
                           }

                           $("#MessageList").html(str1);
                           cfi.PopUp("MessageList", "AWB Errors", 900, null, null, null);
                           //var ar = confirm(message + "\n \n Do You want to proceed ?");

                           //MessageList
                           /*
                           if (ar == true) {
                               var referenceNo = '';
                               var oldOriginAirportSNo = '';
                               var oldDestinationAirportSNo = '';
                               var flightDate = '';
                               for (var i = 0; i < length; i++) {
                                   referenceNo = referenceNo + MsgData[i].Reference + ",";
                                   oldOriginAirportSNo = oldOriginAirportSNo + MsgData[i].OldOriginAirportSNo + ",";
                                   oldDestinationAirportSNo = oldDestinationAirportSNo + MsgData[i].OldDestinationAirportSNo + ",";
                                   flightDate = flightDate + MsgData[i].FlightDate + ",";
                               }
                               referenceNo = referenceNo.substring(0, referenceNo.length - 1);
                               oldOriginAirportSNo = oldOriginAirportSNo.substring(0, oldOriginAirportSNo.length - 1);
                               oldDestinationAirportSNo = oldDestinationAirportSNo.substring(0, oldDestinationAirportSNo.length - 1);
                               flightDate = flightDate.substring(0, flightDate.length - 1);
                               $.ajax 
                                   ({
                                       url: "Services/Shipment/AmendFlightStatusService.svc/BreachFlightStatusUpdate", async: false, type: "POST", dataType: "json", cache: false,
                                       data: JSON.stringify({ ReferenceNo: referenceNo, OldOriginAirportSNo: oldOriginAirportSNo, OldDestinationAirportSNo: oldDestinationAirportSNo, FlightDate: flightDate, TransferRemarks: TransferRemarks }),
                                       contentType: "application/json; charset=utf-8",
                                       success: function (result) {
                                           ShowMessage('success', 'Success - Flight Transfer', JSON.parse(result).Table0[0].Message, "bottom-right");


                                        
                                           ResetSearch();
                                           //cfi.ClosePopUp("tblFlightDetails")
                                       }
                                   });
                           } */
                       }
                   }
               }
           }
       });
   

}

function DeLinkFlights( val )
{
    if (val == 0) {
        $("#ConfirmMSG").html("");
        var str = "<table class='WebFormTable' style='width: 100%; top:0px;margin-top:0px;' >";
        str += "<tr><td class='ui-widget-content' style='padding:15px;'><span>Connecting Flight Plan would be removed of Shipments which would breach Minimum Connection Time on processing of Group Booking</span></td></tr>"
        str += "<tr><td class='ui-widget-content' align='right'> <input type='button' onclick='DeLinkFlights(1)' id='btnSaveDeLink' name='Ok' value='Ok' class='btn btn-success' style='width: 80px;'><input type='button' onclick='DeLinkFlights(2)' id='btnSaveDeLink' name='Cancel' value='Cancel' class='btn btn-inverse' style='width: 80px;'></td></tr>"
        str += "</table>"
        $("#ConfirmMSG").html(str);

        cfi.PopUp("ConfirmMSG", "Pleasse Confirm", 400, null, null, null);
    }

    else if( val==1)
    {
       // if (confirm("Connecting Flight Plan would be removed of Shipments which would breach Minimum Connection Time on processing of Group Booking")) {
            IsReExecute = true;
            UpdateFlightPlan(IsReExecute);
            ResetSearch();
       // }
    }
    else if(val==2)
    {
        $('#ConfirmMSG').parent().find('.k-i-close').click();
    }
    
}
