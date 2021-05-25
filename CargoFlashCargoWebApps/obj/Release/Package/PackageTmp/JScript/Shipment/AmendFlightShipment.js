var dbTableName = 'FlightReOpen';
var pageType = $('#hdnPageType').val();
$('tr').find('td.formbuttonrow').remove();
$("#__SpanHeader__").css("color", "black");
$(document).ready(function () {
    cfi.DateType("FlightDate");
    cfi.AutoComplete("Origin", "AirportCode,AirportName", "vAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("Destination", "AirportCode,AirportName", "vAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("AirlineName", "CarrierCode,AirlineName", "airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("searchFlightNo", "FlightNo", "v_AmendFlightDetails", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    // cfi.AutoComplete("searchFlightStatus", "FlightStatusValue", "v_AmendFlightStatus", "FlightStatusValue", "FlightStatusValue");
    cfi.AutoComplete("searchFlightStatus", "FlightStatusValue", "v_AmendFlightStatus", "FlightStatusKey", "FlightStatusValue", ["FlightStatusValue"], null, "contains");
    //cfi.AutoComplete("searchFlightStatus", "FlightStatusValue", "v_AmendFlightStatus", "FlightStatusKey", "FlightStatusValue", ["FlightStatusValue"], null, "contains");
    $(document.body).append('<div id="tblFlightDetails" style="width: 100%" ></div>');
});
function ExtraCondition(searchFlightNo) {
    var filterAgentName = cfi.getFilter("AND");
    var filterOrigin = cfi.getFilter("AND");
    var filterDestination = cfi.getFilter("AND");
    var filterFlightNo = cfi.getFilter("AND");
    var filterFlightStatus = cfi.getFilter("or");
    //if (searchFlightNo.indexOf("Text_searchFlightStatus") >= 0) {
    //    cfi.setFilter(filterAgentName, "UserSno", "eq", 0);
    //    //cfi.setFilter(filterFlightStatus, "UserSno", "eq", userContext.UserSNo);
    //    return cfi.autoCompleteFilter([filterAgentName, filterFlightStatus]);
    //}
    if (searchFlightNo.indexOf("Text_searchFlightStatus") >= 0) {
        cfi.setFilter(filterAgentName, "UserSno", "eq", 0);
        cfi.setFilter(filterFlightStatus, "UserSno", "eq", userContext.UserSNo);
        return cfi.autoCompleteFilter([filterAgentName, filterFlightStatus]);
    }
    //if (searchFlightNo == "Text_FlightNo") {
    //    cfi.setFilter(filterFlightNo, "FlightNo", "notin", FlightNo);
    //    cfi.setFilter(filterFlightNo, "BordingPoint", "eq", BoardPoint);
    //    cfi.setFilter(filterFlightNo, "EndPoint", "eq", EndPoint);
    //    cfi.setFilter(filterFlightNo, "EndPoint", "eq", EndPoint);
    //    //Needs to be open
    //    cfi.setFilter(filterFlightNo, "FlightDate", "eq", $('#FlightDate').val());
    //    $('#Text_DFOrigin').val('');
    //    $('#Text_DFDestination').val('');
    //    return cfi.autoCompleteFilter(filterFlightNo);
    //}
    if (searchFlightNo == "Text_DFOrigin") {
        cfi.setFilter(filterOrigin, "FlightNo", "eq", $('#Text_FlightNo').val().trim());
        //Needs to be open
        cfi.setFilter(filterOrigin, "FlightDate", "eq", $('#FlightDate').val());
        return cfi.autoCompleteFilter(filterOrigin);
    }

    if (searchFlightNo == "Text_DFDestination") {
        cfi.setFilter(filterDestination, "FlightNo", "eq", $('#Text_FlightNo').val().trim());
        //Needs to be open
        cfi.setFilter(filterDestination, "FlightDate", "eq", $('#FlightDate').val());
        return cfi.autoCompleteFilter(filterDestination);
    }
    if (searchFlightNo.indexOf("Text_searchFlightNo") >= 0) {
        cfi.setFilter(filterAgentName, "OriginAirportSNo", "eq", $("#Text_Origin").data("kendoAutoComplete").key());
        cfi.setFilter(filterAgentName, "DestinationAirPortSNo", "eq", $("#Text_Destination").data("kendoAutoComplete").key());
        cfi.setFilter(filterAgentName, "FlightDate", "eq", cfi.CfiDate("searchFlightDate"));
        if ($('#Text_searchFlightStatus').val() == "DEP") {
            cfi.setFilter(filterAgentName, "IsDeparted", "eq", "1");
            cfi.setFilter(filterAgentName, "IsNILManifested", "eq", "0");
        }
        if ($('#Text_searchFlightStatus').val() == "MAN") {
            cfi.setFilter(filterAgentName, "IsManifested", "eq", "1");
            cfi.setFilter(filterAgentName, "IsDeparted", "eq", "0");
            cfi.setFilter(filterAgentName, "IsNILManifested", "eq", "0");
        }
        if ($('#Text_searchFlightStatus').val() == "NIL") {
            cfi.setFilter(filterAgentName, "IsNILManifested", "eq", "1");
        }
        if ($('#Text_searchFlightStatus').val() == "NIL ARRIVED") {
            cfi.setFilter(filterAgentName, "IsNilArrived", "eq", "1");
        }

        if ($('#Text_searchFlightStatus').val() == "PRE") {
            cfi.setFilter(filterAgentName, "IsPreManifested", "eq", "1");
            cfi.setFilter(filterAgentName, "IsManifested", "eq", "0");
            cfi.setFilter(filterAgentName, "IsDeparted", "eq", "0");
        }
    }
    if (searchFlightNo.indexOf("Origin") >= 0 || searchFlightNo.indexOf("Destination") >= 0) {
        cfi.setFilter(filterAgentName, "SNo", "neq", $("#" + searchFlightNo.replace("Text_Origin", "Destination").replace("Text_Destination", "Origin")).val());

    }
    if (searchFlightNo == "Text_AirlineName") {
        cfi.setFilter(filterDestination, "IsInterline", "eq", "0");
        return cfi.autoCompleteFilter(filterDestination);
    }
    return cfi.autoCompleteFilter(filterAgentName);
}

function SearchFlight() {
    if (cfi.IsValidSubmitSection()) {
        BindAppendGrid1();
    }
}

function BindAppendGrid1() {
    var Airline = $('#AirlineName').val().toString();
    var Org = $('#Text_Origin').val().split('-')[0].toString();
    var Dest = $('#Text_Destination').val().split('-')[0].toString();
    var searchFlightNo = $('#searchFlightNo').val();
    var searchFlightStatus = $('#searchFlightStatus').val();
    var dateflight = $('#searchFlightDate').attr("sqldatevalue").toString();
    var passvalue = Org + '~' + Dest + '~' + searchFlightNo + '~' + dateflight + '~' + Airline + '~' + searchFlightStatus;
    var dbTableName = 'FlightOpen';
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        isGetRecord: true,
        tableColumns: 'SNo,AirCraftSNo,DoorName,UnitType,Height,Width,IsActive,CreatedBy,UpdatedBy',
        masterTableSNo: 1,
        currentPage: 1,
        itemsPerPage: 5,
        whereCondition: passvalue.toString(),
        sort: '',
        servicePath: '../Services/Shipment/AmendFlightStatusService.svc',
        getRecordServiceMethod: 'GetFlightControlGridData',
        createUpdateServiceMethod: 'createUpdateAmendFlightStatus',
        deleteServiceMethod: 'deleteAirCraftDoor',
        caption: 'Amend Flight Details',
        initRows: 1,
        columns: [
                { name: 'SNo', type: 'hidden' },
                { name: 'AirlineName', display: 'Airline Name', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'FlightNo', display: 'Flight No', type: 'button', ctrlCss: { width: '80px', height: '21px', color: 'white', 'background-color': 'cornflowerblue' }, isRequired: false },
                { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'BoardingPoint', display: 'Boarding Point', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'EndPoint', display: 'End Point', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'ETD', display: 'ETD', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'ETA', display: 'ETA', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'DAY', display: 'Day Difference', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'ACType', display: 'A/c Type', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'CAO', display: 'CAO', type: 'label', ctrlCss: { width: '90px' }, isRequired: false },
                { name: 'FlightStatus', display: 'Flight Status', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
                { name: 'FlightStatus', type: 'hidden' },
                { name: 'AvilableGrossWeight', display: 'Available Gross', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                { name: 'AvilableVolumeWeight', display: 'Available Volume', type: 'label', ctrlCss: { width: '40px' }, isRequired: false }
        ],
        isPaging: true,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: false,
            append: true,
            update: false,
            updateAll: true
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            for (var i = 1; i <= addedRowIndex.length; i++) {
                $('#tblFlightOpen_Insert_' + i.toString()).attr('title', 'Amend Flight Status');
            }
        }
    });


}

$(document).on('click', '[id^="tblFlightOpen_FlightNo_"]', function () {
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
                //      + "</tr>"
                //str1 += "<tr>"
                          + "<td class='ui-widget-content'><strong>Board Point</strong> </td> "
                          + "<td class='ui-widget-content'>" + BoardPoint + "</td>"
                          + "<td class='ui-widget-content'><strong>End Point</strong> </td> "
                          + "<td class='ui-widget-content'>" + EndPoint + "</td>"
                      + "</tr>"
                str1 += "<tr>"
                         + "<td class='ui-widget-content'><strong>Flight Date</strong> </td> "
                         + "<td class='ui-widget-content'>" + flightDate + "</td>"
                         + "<td class='ui-widget-content'><strong></strong> </td> "
                         + "<td class='ui-widget-content'></td>"
                     + "</tr>"
                str1 += "<tr><td colspan='8' class='ui-widget-content' style='text-align: center;'><b>New Flight Details</b></td><tr>"
                           + "<td class='ui-widget-content'><strong>Flight Date<span style='color:red'>*</span></strong> </td> "
                           + "<td class='ui-widget-content'><input type='text' class='input-md form-control  tt-input k-input k-state-default hasDatepicker' name='FlightDate' id='FlightDate' >"
                           + "</td>"
                           + "<td class='ui-widget-content'><strong>Flight No<span style='color:red'>*</span></strong></td>"
                           + "<td class='ui-widget-content'><select style='width: 130px;' id='Text_FlightNo'><option value='0'>Select Flight</option></select></td> "
                //       + "</tr>"

                //str1 += "<tr>"
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
                // FlightNo,FlightDate,FreeSaleGrossAvailUsed,FreeSaleVolumeAvailUsed
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
                // AllotmentGrossUsedAvail,AllotmentVolumeUsedAvail,GrossWeight,Volume
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
                          + "<td class='ui-widget-content'><strong></strong></td>"
                          + "<td class='ui-widget-content'></td>"
                          + "<td class='ui-widget-content'><strong></strong></td> "
                          + "<td class='ui-widget-content'></td>"
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
                            //+ "<td align=center class='ui-widget-header'> Pieces</td>"
                            + "<td align=center class='ui-widget-header'> Gr. Weight </td>"
                            + "<td align=center class='ui-widget-header'> Volume </td>"
                            + "<td align=center class='ui-widget-header'> Total Pieces </td>"
                            + "<td align=center class='ui-widget-header'>Revenue</td> "
                            + "<td align=center class='ui-widget-header'>Chr. Weight</td> "
                            + "<td align=center class='ui-widget-header'>Yeild</td> "
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
                    str += "<tr>"
                        //+ "<td class='ui-widget-content first'><a href='Default.cshtml?Module=Rate&Apps=TaxRate&FormAction=Read&View=History&UserID=0&RecID=" + myData.Table0[i].TaxRateSNo + "''>" + myData.Table0[i].TaxRateSNo + "</a></td>"
                        + "<td class='ui-widget-content first'><input type='checkbox' class='checkbox'  ID='ChkAction_" + i + "' name='IE1'/><input type='hidden' id='hdnSNo_" + i + "' name='hdnSNo_" + i + "' value=" + myData.Table0[i].SNo + "></td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].BookingType + "</td>"
                        + "<td class='ui-widget-content first'><label id='ReferenceNumber_" + i + "'>" + myData.Table0[i].ReferenceNumber + "</label></td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Agent + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].ProductName + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Origin + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Destination + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].CommodityCode + "</td>"
                        //+ "<td class='ui-widget-content first'><label' id='AwbPcs_" + i + "'/>" + myData.Table0[i].AwbPcs + "</td>"
                        + "<td class='ui-widget-content first'><label' id='GrossWeight_" + i + "'/>" + myData.Table0[i].GrossWeight + "</td>"
                        + "<td class='ui-widget-content first'><label' id='Volume_" + i + "'/>" + myData.Table0[i].Volume + "</td>"
                        //+ "<td class='ui-widget-content first'><input type='textbox' id='AwbPcs_" + i + "' value='" + myData.Table0[i].AwbPcs + "'  name='AwbPcs' style='width:50px'/></td>"
                        //+ "<td class='ui-widget-content first'><input type='textbox' id='GrossWeight_" + i + "' value='" + myData.Table0[i].GrossWeight + "'  name='GrossWeight' style='width:50px'/></td>"
                        //+ "<td class='ui-widget-content first'><input type='textbox' id='Volume_" + i + "' value='" + myData.Table0[i].Volume + "'  name='Volume' style='width:50px'/></td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].FlightPieces + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Revenue + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].ChargeableWeight + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Yeild + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].AWBStatus + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].AWBRouteStatus + "</td>"
                        + "</td></tr>"

                }
                str += "</table>"
                theDiv.innerHTML = str1 + str;

                cfi.AutoComplete("DFOrigin", "OriginCode,DestinationName", "DF_GetFlightODPair", "OriginSNo", "OriginCode", ["OriginCode", "DestinationName"], OnSelectOrigin, "contains");
                cfi.AutoComplete("DFDestination", "AirportCode,AirportName", "DF_GetFlightODPair", "SNo", "AirportCode", ["AirportCode", "AirportName"], OnSelectDestination, "contains");
                //cfi.AutoComplete("FlightNo", "FlightNo", "DF_FlightNo_AmendFlight", "FlightNo", "FlightNo", ["FlightNo"], OnSelectFlight, "contains");
                cfi.DateType("FlightDate");
                var todaydate = new Date();
                var flightdate = $("#FlightDate").data("kendoDatePicker");
                flightdate.min(todaydate);
            }
            else {
                ShowMessage('warning', 'Warning - Amend Flight Status', "No Shipment On This Flight.", "bottom-right");
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
    var ExistingDailyFlightSNo = sno;
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
        ShowMessage('warning', 'Warning - Tax Rate', "Please select Destination", "bottom-right");
        return;
    }
    var TransferRemarks = $("#txtFlightTransferRemarks").val();
    if (TransferRemarks.length == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Please enter remarks for proceeding", "bottom-right");
        return;
    }
    var length = $('[id^="ChkAction_"]:checked').length;
    if (length == 0) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Please select at lease one record to proceed", "bottom-right");
        return;
    }
    var referenceNumber = '';
    var SNo = '';
    var Pieces = '';
    var GrossWeight = '';
    var Volume = '';
    var TotalGrossWeight = 0.00;
    var TotalVolume = 0.00;
    for (var i = 0; i < $('[id^="ChkAction_"]').length ; i++) {
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
    var FlightGrossCapacity = parseFloat($("#tdFlightTransfer_FlightCapacity").text()) + parseFloat($("#tdFlightTransfer_OverBookedGrossCapacityAvailUsed").text().split('/')[0]);
    var FlightVolumeCapacity = parseFloat($("#tdFlightTransfer_Volume").text()) + parseFloat($("#tdFlightTransfer_OverBookedVolumeCapacityAvailUsed").text().split('/')[0]);
    if (FlightGrossCapacity < TotalGrossWeight) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Shipment Gross Weight is greater than Flight Gross Weight", "bottom-right");
        return;
    }
    if (FlightVolumeCapacity < TotalVolume) {
        ShowMessage('warning', 'Warning - Flight Transfer', "Shipment Volume is greater than Flight Volume", "bottom-right");
        return;
    }
    var referenceno = referenceNumber.substring(0, referenceNumber.length - 1);
    var pieces = Pieces.substring(0, Pieces.length - 1);
    var grossweight = GrossWeight.substring(0, GrossWeight.length - 1);
    var volume = Volume.substring(0, Volume.length - 1);
    var OriginFlight = $('#OriginFlightNo').html().trim();

    $.ajax
    ({
        url: "../Services/Shipment/AmendFlightStatusService.svc/UpdateFlightPlan", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ ExistingDailyFlightSNo: ExistingDailyFlightSNo, ReferenceNumber: referenceno, FlightNumber: FlightNo, FlightDate: FlightDate, BoardingPoint: parseInt(Origin), EndPoint: parseInt(Destination), OriginFlightNo: OriginFlight, Pieces: pieces, GrossWeight: grossweight, Volume: volume, TransferRemarks: TransferRemarks }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null && result != "") {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData.length > 0) {
                    if (MsgData[0].MessageNumber == '1' || MsgData[0].MessageNumber == '4') {
                        ShowMessage('warning', 'Warning - Flight Transfer', MsgData[0].Message, "bottom-right");
                        //ShowMessage('success', 'success - Flight Transfer', MsgData[0].Message, "bottom-right");
                    }
                    else if (MsgData[0].MessageNumber == '3') {
                        ShowMessage('success', 'Success - Flight Transfer', MsgData[0].Message, "bottom-right");
                    }
                    else {
                        var length = MsgData.length;
                        var message = '';
                        for (var i = 0; i < length; i++) {
                            message += (i + 1) + ". " + MsgData[i].Message + "\n";
                        }
                        var ar = confirm(message + "\n \n Do You want to proceed ?");
                        if (ar == true) {
                            var referenceNo = '';
                            var oldOriginAirportSNo = '';
                            var oldDestinationAirportSNo = '';
                            var flightDate = '';
                            for (var i = 0; i < length ; i++) {
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
                                    //cfi.ClosePopUp("tblFlightDetails")
                                }
                            });
                        }
                    }
                }
            }
        }
    });
});
$(document).on('click', '#ChkSelectAll', function () {
    var checked = this.checked;
    for (var i = 0; i < $('[id^="ChkAction_"]').length ; i++) {
        $("#ChkAction_" + i).attr('checked', checked);
    }
});

//$(document).on('select', '#Text_FlightNo', function () {
//    //($("#FlightNo").val());
//    var FlightNo = $("#FlightNo").val();
//    var FlightDate = $('#FlightDate').val();
//    $.ajax({
//        url: "../Services/Shipment/AmendFlightStatusService.svc/getFlightOrigin", async: false, type: "POST", dataType: "json", cache: false,
//        data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate }),
//        contentType: "application/json; charset=utf-8",
//        success: function (result) {
//            if (result != null && result != "") {
//                var MsgTable = jQuery.parseJSON(result);
//                var MsgData = MsgTable.Table0;
//                if (MsgData.length > 0) {
//                    $("#Text_DFOrigin").val(MsgData[0].OriginAirportCode);
//                    $("#DFOrigin").val(MsgData[0].OriginAirportSNo);
//                    //cfi.ClosePopUp("tblFlightDetails");
//                }
//                else {
//                    $("#Text_DFOrigin").val('');
//                    $("#DFOrigin").val('');
//                }
//            }
//        }
//    });
//});

//$(document).on('change', '#Text_FlightNo', function () {
//    /// Needs to be open 
//    ////($("#FlightNo").val());
//    //var FlightNo = $("#FlightNo").val();
//    //var FlightDate = $('#FlightDate').val();
//    //$.ajax({
//    //    url: "/Services/Shipment/AmendFlightStatusService.svc/getFlightOrigin", async: false, type: "POST", dataType: "json", cache: false,
//    //    data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate }),
//    //    contentType: "application/json; charset=utf-8",
//    //    success: function (result) {
//    //        if (result != null && result != "") {
//    //            var MsgTable = jQuery.parseJSON(result);
//    //            var MsgData = MsgTable.Table0;
//    //            if (MsgData.length > 0) {
//    //                $("#Text_DFOrigin").val(MsgData[0].OriginAirportCode);
//    //                $("#DFOrigin").val(MsgData[0].OriginAirportSNo);
//    //                //cfi.ClosePopUp("tblFlightDetails");
//    //            }
//    //            else {
//    //                $("#Text_DFOrigin").val('');
//    //                $("#DFOrigin").val('');
//    //            }
//    //        }
//    //    }
//    //});
//});

$(document).on('click change', '#Text_FlightNo', function () {
    ///$('#Text_FlightNo').append('<option val="2">THREE</option>');
    //($("#FlightNo").val());
    //alert($("#Text_FlightNo option").length);
    if ($("#Text_FlightNo option").length == 1) {
        var OriginFlight = $('#OriginFlightNo').html().trim();
        var CarrierCode = $('#OriginFlightNo').html().split('-')[0].trim();
        var FlightDate = $('#FlightDate').val();
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
                            var listitem = "<option val='" + FlightsData[i]["SNo"] + "'>" + FlightsData[i]["FlightNo"] + "</option>";
                            $('#Text_FlightNo').append(listitem);
                        }
                        //cfi.ClosePopUp("tblFlightDetails");
                    }
                }
            }
        });
    }
    else {
        //if ($("#Text_FlightNo").val() != "Select Flight") {
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
        //}
        //else {
        //    alert(3);
        //    $("#Text_DFOrigin").val('');
        //    $("#DFOrigin").val('');
        //    $("#Text_DFDestination").val('');
        //    $("#DFDestination").val('');
        //    $("#trFlightCapacityDetails").hide();
        //}
    }
});


//function OnSelectFlight(input) {
//    if ($("#Text_FlightNo").val() == "") {
//        $("#Text_DFOrigin").val('');
//        $("#DFOrigin").val('');
//        $("#Text_DFDestination").val('');
//        $("#DFDestination").val('');
//        $("#trFlightCapacityDetails").hide();
//    }
//}

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
                        //FlightNo,FlightDate,FreeSaleGrossAvailUsed,FreeSaleVolumeAvailUsed,AllotmentGrossUsedAvail,AllotmentVolumeUsedAvail,GrossWeight,Volume
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

