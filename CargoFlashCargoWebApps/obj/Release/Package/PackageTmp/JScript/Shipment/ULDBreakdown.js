/*
*****************************************************************************
Javascript Name:	ULDBreakdownJS     
Purpose:		    This JS used to get autocomplete for ULD.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    23 Oct 2015
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/

$(function () {
    //$('tr').find('td.formbuttonrow').remove();
    $("input[name='operation']").css("display", "none");
    $("input[class='btn btn-inverse']").css("display", "none");
    cfi.AutoComplete("MainULDNo", "DailyFlightSNo,ULDNo", "VULDBreakdownNo", "DailyFlightSNo", "ULDNo", ["ULDNo"], null, "contains");
    $('input:radio').change(function () {

        var theDiv = document.getElementById("divULDBreakdown");
        theDiv.innerHTML = "";
        var theDiv1 = document.getElementById("divULDBreakdownAction");
        theDiv1.innerHTML = "";
        var theTable = document.getElementById("tblULDBreakdownGrid");
        theTable.innerHTML = "";
        $("#Text_MainULDNo").attr('style', 'width:150px')

        cfi.ResetAutoComplete("MainULDNo");
        if ($('input:radio[name=Type]:checked').val() == 0) {

            // cfi.AutoComplete("MainULDNo", "DailyFlightSNo,ULDNo", "VULDBreakdownNo", "DailyFlightSNo", "ULDNo", ["ULDNo"], null, "contains");

            var data = GetDataSource("MainULDNo", "VULDBreakdownNo", "DailyFlightSNo", "ULDNo", ["ULDNo"], null);
            cfi.ChangeAutoCompleteDataSource("MainULDNo", data, true, null, "ULDNo", "contains");

        }
        else {

            //  cfi.AutoComplete("MainULDNo", "DailyFlightSNo,ULDNo", "VULDBreakdownNoTransit", "DailyFlightSNo", "ULDNo", ["ULDNo"], null, "contains");
            var data = GetDataSource("MainULDNo", "VULDBreakdownNoTransit", "DailyFlightSNo", "ULDNo", ["ULDNo"], null);
            cfi.ChangeAutoCompleteDataSource("MainULDNo", data, true, null, "ULDNo", "contains");
        }
    });

    $("#btnSearch").click(function () {
        if ($("#MainULDNo").val() == "") {
            ShowMessage('warning', 'Warning - ULD Breakdown Search', "Unable to search. ULD No cannot be blank.", "bottom-right");
            return;
        }
        else {
            CreateULDBreakdownTable();
            if ($('input:radio[name=Type]:checked').val() == 0) {
                var alphabettypesExport = [{ Key: "1", Text: "ULD Transfer" }, { Key: "2", Text: "ULD Breakdown (Complete)" }, { Key: "3", Text: "ULD Breakdown (Remove AWB)" }];
                cfi.AutoCompleteByDataSource("Action", alphabettypesExport);
            }
            else {
                var alphabettypesTransit = [{ Key: "1", Text: "RE - BUILD" }, { Key: "2", Text: "RE - CONTOUR" }, { Key: "3", Text: "MIX TO CLEAN LOAD" }];
                cfi.AutoCompleteByDataSource("Action", alphabettypesTransit, test);
            }
            var theDiv = document.getElementById("divULDBreakdownAction");
            theDiv.innerHTML = "";
            var theTable = document.getElementById("tblULDBreakdownGrid");
            theTable.innerHTML = "";
        }
    });
});

function test() {
    var theDiv = document.getElementById("divULDBreakdownAction");
    theDiv.innerHTML = "";
    var theTable = document.getElementById("tblULDBreakdownGrid");
    theTable.innerHTML = "";
}

function CreateULDBreakdownTable() {
    $.ajax({
        url: "Services/Shipment/ULDBreakdownService.svc/CreateULDBreakdownTable",
        async: false,
        type: "GET",
        dataType: "json",
        data: { DailyFlightSNo: $("#MainULDNo").val(), ULDNo: $("#Text_MainULDNo").val(), Type: $('input:radio[name=Type]:checked').val() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var theDiv = document.getElementById("divULDBreakdown");
            theDiv.innerHTML = "";
            var table = "</br></br><table class='appendGrid ui-widget' id='tblULDBreakdown'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD Type</td><td class='ui-widget-header'>ULD Number</td><td class='ui-widget-header'>ULD Location</td><td class='ui-widget-header'>ULD Build Weight</td><td class='ui-widget-header'>Tare Weight</td><td class='ui-widget-header'>Action</td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'><tr id='tblULDBreakdown_Row_1'>";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    $("#hdnULDSNo").val(myData.Table0[0].ULDSNo);
                    table += "<td class='ui-widget-content first'>" + myData.Table0[0].ULDType + "</td><td class='ui-widget-content first'>" + myData.Table0[0].ULDNumber + "</td><td class='ui-widget-content first'>NULL</td><td class='ui-widget-content first'>" + myData.Table0[0].ULDBuildWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[0].TareWeight + "</td><td class='ui-widget-content first'><input name='Action' id='Action' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Action' name='Text_Action'/></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnSubmit' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='Submit();'><span class='ui-button-text'>Submit</span></button></td>";
                    table += "</tr></tbody></table>";
                    theDiv.innerHTML += table;
                }
                else {
                    var table = "<table class='appendGrid ui-widget' id='tblULDBreakdown'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                    theDiv.innerHTML += table;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function Submit() {
    if ($('input:radio[name=Type]:checked').val() == 0) {
        if ($("#Action").val() == "") {
            ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Submit. Action cannot be blank.", "bottom-right");
            return;
        }
        else if ($("#Action").val() == "1") {
            var theDiv = document.getElementById("divULDBreakdownAction");
            theDiv.innerHTML = "";
            var table = "</br></br><table class='appendGrid ui-widget' id='tblULDBreakdownAction'><thead class='ui-widget-header' style='text-align:center'><tr><td>ULD No&nbsp;&nbsp;&nbsp;<input name='ULDNo' id='ULDNo' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_ULDNo' name='Text_ULDNo'/></td><td class='ui-widget-header'>Requested By&nbsp;&nbsp;&nbsp;<input name='RequestedBy' id='RequestedBy' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_RequestedBy' name='Text_RequestedBy'/></td><td class='ui-widget-header'>Billed To&nbsp;&nbsp;&nbsp;<input name='BilledTo' id='BilledTo' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_BilledTo' name='Text_BilledTo'/></td><td class='ui-widget-header'>Reason&nbsp;&nbsp;&nbsp;<input name='Reason' id='Reason' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Reason' name='Text_Reason'/></td><td class='ui-widget-header'>Remark&nbsp;&nbsp;&nbsp;<input name='Remark' id='Remark' type='text' value=''/></td><td class='ui-widget-header'><button aria-disabled='false' role='button' title='Transfer' type='button' id='btnTransfer' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='Transfer();'><span class='ui-button-text'>Transfer</span></button></td></tr></thead></table>";
            theDiv.innerHTML += table;
            cfi.AutoComplete("ULDNo", "DailyFlightSNo,ULDNo", "VULDBreakdownNo", "DailyFlightSNo", "ULDNo", ["ULDNo"], null, "contains");
            cfi.AutoComplete("RequestedBy", "SNo,Name", "RequestedORBilledBy", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("BilledTo", "SNo,Name", "RequestedORBilledBy", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("Reason", "SNo,Remarks", "Remarks", "SNo", "Remarks", ["Remarks"], null, "contains");
            ULDBreakdownGrid();
        }
        else if ($("#Action").val() == "2") {
            var theDiv = document.getElementById("divULDBreakdownAction");
            theDiv.innerHTML = "";
            var table = "</br></br><table class='appendGrid ui-widget' id='tblULDBreakdownAction'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD Location&nbsp;&nbsp;&nbsp;<input name='ULDLocation' id='ULDLocation' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_ULDLocation' name='Text_ULDLocation'/></td><td class='ui-widget-header'>Requested By&nbsp;&nbsp;&nbsp;<input name='RequestedBy' id='RequestedBy' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_RequestedBy' name='Text_RequestedBy'/></td><td class='ui-widget-header'>Billed To&nbsp;&nbsp;&nbsp;<input name='BilledTo' id='BilledTo' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_BilledTo' name='Text_BilledTo'/></td><td class='ui-widget-header'>Reason&nbsp;&nbsp;&nbsp;<input name='Reason' id='Reason' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Reason' name='Text_Reason'/></td><td class='ui-widget-header'>Remark&nbsp;&nbsp;&nbsp;<input name='Remark' id='Remark' type='text' value=''/></td><td class='ui-widget-header'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnTransfer' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='CompleteULDBreakdown();'><span class='ui-button-text'>Submit</span></button></td></tr></thead></table>";
            theDiv.innerHTML += table;
            cfi.AutoComplete("ULDLocation", "SNo,LocationName", "vWHLocationNew", "SNo", "LocationName", ["LocationName"], null, "contains");
            cfi.AutoComplete("RequestedBy", "SNo,Name", "RequestedORBilledBy", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("BilledTo", "SNo,Name", "RequestedORBilledBy", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("Reason", "SNo,Remarks", "Remarks", "SNo", "Remarks", ["Remarks"], null, "contains");
            ULDBreakdownGrid();
        }
        else if ($("#Action").val() == "3") {
            var theDiv = document.getElementById("divULDBreakdownAction");
            theDiv.innerHTML = "";
            var table = "</br></br>";
            theDiv.innerHTML += table;
            ULDBreakdownGrid();
        }
        else {
            ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Submit. Action cannot be blank.", "bottom-right");
            return;
        }
    }
    else {
        if ($("#Action").val() == "") {
            ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Submit. Action cannot be blank.", "bottom-right");
            return;
        }
        else if ($("#Action").val() == "1") {
            var theDiv = document.getElementById("divULDBreakdownAction");
            theDiv.innerHTML = "";
            var table = "</br></br><table class='appendGrid ui-widget' id='tblULDBreakdownAction'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'><button aria-disabled='false' role='button' title='ADD Shipment' type='button' id='btnADDShipment' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='ADDShipment();'><span class='ui-button-text'>ADD Shipment</span></button></td></tr></thead></table>";
            theDiv.innerHTML += table;
            ULDBreakdownTransitGrid();
        }
        else if ($("#Action").val() == "2") {
            var theDiv = document.getElementById("divULDBreakdownAction");
            theDiv.innerHTML = "";
            var table = "</br></br><table class='appendGrid ui-widget' id='tblULDBreakdownAction'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'><button aria-disabled='false' role='button' title='ULD Build Details' type='button' id='btnULDBuildDetails' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='ShowULDDetails();'><span class='ui-button-text'>ULD Build Details</span></button></td></tr></thead></table>";
            theDiv.innerHTML += table;
            ULDBreakdownTransitGrid();
        }
        else if ($("#Action").val() == "3") {
            var theDiv = document.getElementById("divULDBreakdownAction");
            theDiv.innerHTML = "";
            var table = "</br></br><table class='appendGrid ui-widget' id='tblULDBreakdownAction'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'><button aria-disabled='false' role='button' title='ADD Shipment' type='button' id='btnADDShipment' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='ADDShipment();'><span class='ui-button-text'>ADD Shipment</span></button></td></tr></thead></table>";
            theDiv.innerHTML += table;
            var theDiv1 = document.getElementById("tblULDBreakdownGrid");
            theDiv1.innerHTML = "";
            $.ajax({
                url: "Services/Shipment/ULDBreakdownService.svc/GetULDBreakdownTransitRecordMixtoCleanLoad",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    DailyFlightSNo: $("#MainULDNo").val(),
                    ULDNo: $("#Text_MainULDNo").val()
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    var theDiv = document.getElementById("tblULDBreakdownGrid");
                    theDiv.innerHTML = "";
                    var table = "</br></br><table class='appendGrid ui-widget' id='tblULDBreakdown'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>AWB No</td><td class='ui-widget-header'>Tl/Pl Pcs</td><td class='ui-widget-header'>Tl/Pl Gr.wt</td><td class='ui-widget-header'>Tl/Pl Vol.wt</td><td class='ui-widget-header'>Orgin</td><td class='ui-widget-header'>Dest</td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'>";
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            for (var i = 0; i < myData.Table0.length; i++) {
                                table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Piece + '/' + myData.Table0[i].PlannedPieces + "</td><td class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + '/' + myData.Table0[i].PlannedGrossWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[i].VolumeWeight + '/' + myData.Table0[i].PlannedVolumeWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[i].OriginCity + "</td><td class='ui-widget-content first'>" + myData.Table0[i].DestinationCity + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='btnDelete' value=" + myData.Table0[i].OffloadedCargoSNo + " tabindex='16' class='btn btn-danger' style='width:100px;' onclick='Delete(" + myData.Table0[i].OffloadedCargoSNo + ");'><span class='ui-button-text'>Delete</span></button></td></tr>";
                            }
                            table += "</tbody></table>";
                            theDiv.innerHTML += table;
                        }
                        else {
                            var table = "<table class='appendGrid ui-widget' id='tblULDBreakdown'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                            theDiv.innerHTML += table;
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
}

function Delete(OffloadedCargoSNo) {
    if (confirm('Are you sure want to Delete this record ?')) {
        $.ajax({
            url: "Services/Shipment/ULDBreakdownService.svc/DeleteOffloadedCargo",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ OffloadedSNo: OffloadedCargoSNo, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - ULD Breakdown', "Deleted Successfully", "bottom-right");
                    Submit();
                }
                else {
                    ShowMessage('warning', 'Warning - ULD Breakdown', "RE - BUILD unable to process.", "bottom-right");
                }
            }
        });
    }
}

function ULDBreakdownTransitGrid() {
    var Action = $("#Action").val();
    var dbtableName = "ULDBreakdownGrid";
    var ULDNo = $("#MainULDNo").val();
    $('#tbl' + dbtableName).appendGrid({
        tableID: 'tbl' + dbtableName,
        contentEditable: true,
        tableColume: 'SNo,MainULDNo,DailFlightSNo,AWBNo,TotalPieces,PlannedPieces,TotalGRWT,PlannedGRWT,TotalVLWT,PlannedVLWT,Origin,Destination, TransferULDNo,RequestedBY,BilledTo,Remarks',
        masterTableSNo: ULDNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: '' + $("#MainULDNo").val() + '-' + $("#Text_MainULDNo").val() + '', sort: '',
        servicePath: './Services/Shipment/ULDBreakdownService.svc',
        getRecordServiceMethod: 'GetULDBreakdownTransitRecord',
        createUpdateServiceMethod: 'CreateUpdateULDBreakdown',
        deleteServiceMethod: 'DeleteULDBreakdown',
        caption: Action == '1' ? 'RE - BUILD' : Action == '2' ? 'Re - Contour' : 'Mix to Clean Load',
        initRows: 1,
        isGetRecord: true,
        columns: Action == '1' ? [
              { name: 'SNo', type: 'hidden', value: '0' },
              { name: 'MainULDNo', type: 'hidden', value: $("#Text_MainULDNo").val() },
              { name: 'DailFlightSNo', type: 'hidden', value: $("#MainULDNo").val() },
              { name: 'AWBNo', display: 'AWB No', type: 'label' },
              { name: 'TotalandPlannedPcs', display: 'Tl/Pl Pcs', type: 'label' },
              { name: 'TotalandPlannedGrwt', display: 'Tl/Pl Gr.wt', type: 'label' },
              { name: 'TotalandPlannedVolwt', display: 'Tl/Pl Vol.wt', type: 'label' },
              { name: 'Origin', display: 'Orgin', type: 'label' },
              { name: 'Destination', display: 'Dest', type: 'label' }
        ] : Action == '2' ? [
              { name: 'SNo', type: 'hidden', value: '0' },
              { name: 'MainULDNo', type: 'hidden', value: $("#Text_MainULDNo").val() },
              { name: 'DailFlightSNo', type: 'hidden', value: $("#MainULDNo").val() },
              { name: 'AWBNo', display: 'AWB No', type: 'label' },
              { name: 'TotalandPlannedPcs', display: 'Tl/Pl Pcs', type: 'label' },
              { name: 'TotalandPlannedGrwt', display: 'Tl/Pl Gr.wt', type: 'label' },
              { name: 'TotalandPlannedVolwt', display: 'Tl/Pl Vol.wt', type: 'label' },
              { name: 'Origin', display: 'Orgin', type: 'label' },
              { name: 'Destination', display: 'Dest', type: 'label' }
        ] : [
              { name: 'SNo', type: 'hidden', value: '0' },
              { name: 'MainULDNo', type: 'hidden', value: $("#Text_MainULDNo").val() },
              { name: 'DailFlightSNo', type: 'hidden', value: $("#MainULDNo").val() },
              { name: 'AWBNo', display: 'AWB No', type: 'label' },
              { name: 'TotalandPlannedPcs', display: 'Tl/Pl Pcs', type: 'label', },
              { name: 'TotalandPlannedGrwt', display: 'Tl/Pl Gr.wt', type: 'label' },
              { name: 'TotalandPlannedVolwt', display: 'Tl/Pl Vol.wt', type: 'label' },
              { name: 'Origin', display: 'Orgin', type: 'label' },
              { name: 'Destination', display: 'Dest', type: 'label' },
              { name: 'WHLocation', display: 'W/H Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vWHLocationNew', textColumn: 'LocationName', keyColumn: 'SNo' },
              { name: 'RequestedBy', display: 'Requested By', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'RequestedORBilledBy', textColumn: 'Name', keyColumn: 'SNo' },
              { name: 'BilledTo', display: 'Billed To', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'RequestedORBilledBy', textColumn: 'Name', keyColumn: 'SNo' },
              { name: 'Remark', display: 'Remark', type: 'text', ctrlAttr: { controltype: 'alphanumericupper', allowchar: '.,-', maxlength: 100 }, ctrlCss: { width: '150px' }, isRequired: true },
              { name: 'Remove', display: '', type: 'button', ctrlAttr: { value: 'Remove', class: 'btn btn-success' }, ctrlCss: { width: '70px', height: '20px', cursor: 'pointer' }, onClick: function (evt, rowIndex) { RemoveUlDAWB(evt.target.id.split('_')[2]); } }
        ],
        hideButtons: Action == '1' ? { append: true, remove: true, removeLast: true, insert: true, updateAll: true } : Action == '2' ? { append: true, remove: true, removeLast: true, insert: true, updateAll: true } : { append: true, updateAll: true, insert: true, removeLast: true, remove: true },
        isPaging: true,
    });
}

function ULDBreakdownGrid() {
    var Action = $("#Action").val();
    var dbtableName = "ULDBreakdownGrid";
    var ULDNo = $("#MainULDNo").val();
    $('#tbl' + dbtableName).appendGrid({
        tableID: 'tbl' + dbtableName,
        contentEditable: true,
        tableColume: 'SNo,MainULDNo,DailFlightSNo,AWBNo,TotalPieces,PlannedPieces,TotalGRWT,PlannedGRWT,TotalVLWT,PlannedVLWT,Origin,Destination, TransferULDNo,RequestedBY,BilledTo,Remarks',
        masterTableSNo: ULDNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: '' + $("#MainULDNo").val() + '-' + $("#Text_MainULDNo").val() + '', sort: '',
        servicePath: './Services/Shipment/ULDBreakdownService.svc',
        getRecordServiceMethod: 'GetULDBreakdownRecord',
        createUpdateServiceMethod: 'CreateUpdateULDBreakdown',
        deleteServiceMethod: 'DeleteULDBreakdown',
        caption: Action == '1' ? 'ULD Transfer' : Action == '2' ? 'ULD Breakdown (Complete)' : 'ULD Breakdown (Remove AWB)',
        initRows: 1,
        isGetRecord: true,
        columns: Action == '1' ? [
              { name: 'SNo', type: 'hidden', value: '0' },
              { name: 'MainULDNo', type: 'hidden', value: $("#Text_MainULDNo").val() },
              { name: 'DailFlightSNo', type: 'hidden', value: $("#MainULDNo").val() },
              { name: 'AWBNo', display: 'AWB No', type: 'label' },
              { name: 'TotalandPlannedPcs', display: 'Tl/Pl Pcs', type: 'label' },
              { name: 'TotalandPlannedGrwt', display: 'Tl/Pl Gr.wt', type: 'label' },
              { name: 'TotalandPlannedVolwt', display: 'Tl/Pl Vol.wt', type: 'label' },
              { name: 'Origin', display: 'Orgin', type: 'label' },
              { name: 'Destination', display: 'Dest', type: 'label' }
        ] : Action == "2" ? [
              { name: 'SNo', type: 'hidden', value: '0' },
              { name: 'MainULDNo', type: 'hidden', value: $("#Text_MainULDNo").val() },
              { name: 'DailFlightSNo', type: 'hidden', value: $("#MainULDNo").val() },
              { name: 'AWBNo', display: 'AWB No', type: 'label' },
              { name: 'TotalandPlannedPcs', display: 'Tl/Pl Pcs', type: 'label' },
              { name: 'TotalandPlannedGrwt', display: 'Tl/Pl Gr.wt', type: 'label' },
              { name: 'TotalandPlannedVolwt', display: 'Tl/Pl Vol.wt', type: 'label' },
              { name: 'Origin', display: 'Orgin', type: 'label' },
              { name: 'Destination', display: 'Dest', type: 'label' },
              { name: 'WHLocation', display: 'W/H Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vWHLocationNew', textColumn: 'LocationName', keyColumn: 'SNo' }
        ] : [
              { name: 'SNo', type: 'hidden', value: '0' },
              { name: 'MainULDNo', type: 'hidden', value: $("#Text_MainULDNo").val() },
              { name: 'DailFlightSNo', type: 'hidden', value: $("#MainULDNo").val() },
              { name: 'AWBNo', display: 'AWB No', type: 'label' },
              { name: 'TotalandPlannedPcs', display: 'Tl/Pl Pcs', type: 'label', },
              { name: 'TotalandPlannedGrwt', display: 'Tl/Pl Gr.wt', type: 'label' },
              { name: 'TotalandPlannedVolwt', display: 'Tl/Pl Vol.wt', type: 'label' },
              { name: 'Origin', display: 'Orgin', type: 'label' },
              { name: 'Destination', display: 'Dest', type: 'label' },
              { name: 'WHLocation', display: 'W/H Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'vWHLocationNew', textColumn: 'LocationName', keyColumn: 'SNo' },
              { name: 'RequestedBy', display: 'Requested By', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'RequestedORBilledBy', textColumn: 'Name', keyColumn: 'SNo' },
              { name: 'BilledTo', display: 'Billed To', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, tableName: 'RequestedORBilledBy', textColumn: 'Name', keyColumn: 'SNo' },
              { name: 'Remark', display: 'Remark', type: 'text', ctrlAttr: { controltype: 'alphanumericupper', allowchar: '.,-', maxlength: 100 }, ctrlCss: { width: '150px' }, isRequired: true },
              { name: 'Remove', display: '', type: 'button', ctrlAttr: { value: 'Remove', class: 'btn btn-success' }, ctrlCss: { width: '70px', height: '20px', cursor: 'pointer' }, onClick: function (evt, rowIndex) { RemoveUlDAWB(evt.target.id.split('_')[2]); } }
        ],
        hideButtons: Action == '1' ? { append: true, remove: true, removeLast: true, insert: true, updateAll: true } : Action == '2' ? { append: true, remove: true, removeLast: true, insert: true, updateAll: true } : { append: true, updateAll: true, insert: true, removeLast: true, remove: true },
        isPaging: true,
    });
}

//function Test1() {
//    if ($.isArray(updatedRows)) {
//        updatedRows.sort();
//        updatedRows = jQuery.unique(updatedRows);
//    }
//    validateTableData('tblULDBreakdownGrid', updatedRows);
//}

function RemoveUlDAWB(rowID) {
    if (validateTableData('tblULDBreakdownGrid', rowID)) {
        Save(rowID);
    }
}

function Transfer() {
    if ($("#ULDNo").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. ULD No cannot be blank.", "bottom-right");
    }
    else if ($("#RequestedBy").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. Requested By cannot be blank.", "bottom-right");
    }
    else if ($("#BilledTo").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. Billed To cannot be blank.", "bottom-right");
    }
    else if ($("#Reasons").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. Reasons cannot be blank.", "bottom-right");
    }
    else {
        Save(0);
    }
}

function CompleteULDBreakdown() {
    var table = document.getElementById("tblULDBreakdownGrid");
    if ($("#ULDLocation").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. ULD Location cannot be blank.", "bottom-right");
    }
    else if ($("#RequestedBy").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. Requested By cannot be blank.", "bottom-right");
    }
    else if ($("#BilledTo").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. Billed To cannot be blank.", "bottom-right");
    }
    else if ($("#Reasons").val() == "") {
        ShowMessage('warning', 'Warning - ULD Breakdown', "Unable to Transfer. Reasons cannot be blank.", "bottom-right");
    }
    else if (table != null && table.rows.length > 3) {
        //if ($.isArray(updatedRows)) {
        //    updatedRows.sort();
        //    updatedRows = jQuery.unique(updatedRows);
        //}

        //var setting = $('#tblULDBreakdownGrid').data("appendGrid");
        //var data = JSON.parse(tableToJSON(setting.tableID, setting.columns, setting.updatedRows));

        //if (data != false) {
        //    Save(0);
        //}
        Save(0);
    }
    else {
        //Save();
    }
}

function Save(row) {
    var jsonString = "[";
    var table = document.getElementById("tblULDBreakdownGrid");
    var x = document.getElementById("tblULDBreakdownGrid").tBodies.length;
    var y = document.getElementById("tblULDBreakdownGrid").tBodies
    if (cfi.IsValidSubmitSection()) {
        //if ($.isArray(updatedRows)) {
        //    updatedRows.sort();
        //    updatedRows = jQuery.unique(updatedRows);
        //}
        //if (validateTableData(settings.tableID, updatedRows)) {
        //    var strData = tableToJSON(settings.tableID, settings.columns, updatedRows);
        //}
        if (table != null && table.rows.length > 3 && row == 0) {
            var rowCount = table.rows.length;
            for (var i = 3; i < table.rows.length; i++) {
                var rowno = i - 2;
                var AWBNo = document.getElementById("tblULDBreakdownGrid_AWBNo_" + rowno).innerHTML;
                var AWBSNo = $('#tblULDBreakdownGrid_SNo_' + rowno).val();
                var Origin = document.getElementById("tblULDBreakdownGrid_Origin_" + rowno).innerHTML;
                var Destination = document.getElementById("tblULDBreakdownGrid_Destination_" + rowno).innerHTML;
                var WHLocation = $('#tblULDBreakdownGrid_HdnWHLocation_' + rowno).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnWHLocation_' + rowno).val();
                var RequestedBy = $('#tblULDBreakdownGrid_HdnRequestedBy_' + rowno).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnRequestedBy_' + rowno).val();
                var BilledTo = $('#tblULDBreakdownGrid_HdnBilledTo_' + rowno).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnBilledTo_' + rowno).val();
                var Reason = $('#tblULDBreakdownGrid_HdnReason_' + rowno).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnReason_' + rowno).val();
                var Remark = $('#tblULDBreakdownGrid_Remark_' + rowno).val() == undefined ? '' : $('#tblULDBreakdownGrid_Remark_' + rowno).val();
                jsonString += "{'AWBSNo':'" + AWBSNo + "','AWBNo':'" + AWBNo + "','Origin':'" + Origin + "','Destination':'" + Destination + "','WHLocation':'" + WHLocation + "','RequestedBy':'" + RequestedBy + "','BilledTo':'" + BilledTo + "','Reason':'" + Reason + "','Remark':'" + Remark + "'},";
            }

            if (jsonString.substr(jsonString.length - 1, 1) == ',') {
                jsonString = jsonString.substr(0, jsonString.length - 1) + ']';
            }
        }
        else if (table != null && table.rows.length > 3 && row != 0) {
            var AWBNo = document.getElementById("tblULDBreakdownGrid_AWBNo_" + row).innerHTML;
            var AWBSNo = $('#tblULDBreakdownGrid_SNo_' + row).val();
            var Origin = document.getElementById("tblULDBreakdownGrid_Origin_" + row).innerHTML;
            var Destination = document.getElementById("tblULDBreakdownGrid_Destination_" + row).innerHTML;
            var WHLocation = $('#tblULDBreakdownGrid_HdnWHLocation_' + row).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnWHLocation_' + row).val();
            var RequestedBy = $('#tblULDBreakdownGrid_HdnRequestedBy_' + row).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnRequestedBy_' + row).val();
            var BilledTo = $('#tblULDBreakdownGrid_HdnBilledTo_' + row).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnBilledTo_' + row).val();
            var Reason = $('#tblULDBreakdownGrid_HdnReason_' + row).val() == undefined ? 0 : $('#tblULDBreakdownGrid_HdnReason_' + row).val();
            var Remark = $('#tblULDBreakdownGrid_Remark_' + row).val() == undefined ? '' : $('#tblULDBreakdownGrid_Remark_' + row).val();
            jsonString += "{'AWBSNo':'" + AWBSNo + "','AWBNo':'" + AWBNo + "','Origin':'" + Origin + "','Destination':'" + Destination + "','WHLocation':'" + WHLocation + "','RequestedBy':'" + RequestedBy + "','BilledTo':'" + BilledTo + "','Reason':'" + Reason + "','Remark':'" + Remark + "'},";

            if (jsonString.substr(jsonString.length - 1, 1) == ',') {
                jsonString = jsonString.substr(0, jsonString.length - 1) + ']';
            }
        }
        else
            jsonString = "[{'AWBSNo':'','AWBNo':'','Origin':'','Destination':'','WHLocation':'','RequestedBy':'','BilledTo':'','Reason':'','Remark':''}]";
    }

    if (cfi.IsValidSubmitSection()) {
        $.ajax({
            url: "Services/Shipment/ULDBreakdownService.svc/UpdateULDBreakdown",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                Action: $("#Action").val(),
                MainULDNo: $('#Text_MainULDNo').val(),
                DailFlightSNo: $('#MainULDNo').val(),
                TransferULDNo: $('#Text_ULDNo').val() == undefined ? '' : $("#Text_ULDNo").val(),
                TransferDailFlightSNo: $('#ULDNo').val() == undefined ? '' : $("#ULDNo").val(),
                ULDLocation: $("#Text_ULDLocation").val() == undefined ? '' : $("#Text_ULDLocation").val(),
                ULDLocationSNo: $("#ULDLocation").val() == undefined ? '' : $("#ULDLocation").val(),
                RequestedBy: $("#RequestedBy").val(),
                BilledTo: $("#BilledTo").val(),
                Reason: $("#Reason").val(),
                Remark: $("#Remark").val(),
                createdBy: $("#hdncreatedBy").val(),
                DivData: jsonString,
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0[0].Column1 == "2000") {
                        ShowMessage('success', 'Success - ULD Breakdown', "ULD Breakdown Successfully.", "bottom-right");
                        var theDivULDBreakdown = document.getElementById("divULDBreakdown");
                        theDivULDBreakdown.innerHTML = "";
                        var theDivULDBreakdownAction = document.getElementById("divULDBreakdownAction");
                        theDivULDBreakdownAction.innerHTML = "";
                        var theTableULDBreakdownGrid = document.getElementById("tblULDBreakdownGrid");
                        theTableULDBreakdownGrid.innerHTML = "";
                        return false;
                    }
                    else {
                        ShowMessage('warning', 'Warning - ULD Breakdown', "Need your kind attention.  Please contact the website administrator.", "bottom-right");
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    else
        return false;

    return false;
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
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });

    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    });
}

function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
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

    $("#" + containerId).find("textarea").each(function () {
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

    $("#" + containerId).find("span").each(function () {
        var attr = $(this).attr('controltype');
        if (typeof attr !== 'undefined' && attr !== false) {
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });

    SetDateRangeValue();

    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });

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

var processedawb = [];
var savetype = "";
var __uldstocksno = -1;
var uldbuild = [{ Key: "0", Text: "CLEAN LOAD" }, { Key: "1", Text: "THROUGH LOAD" }, { Key: "2", Text: "MIXED LOAD" }];//Clean Load, Mixed Load, Through Load
var OverhangMesUnit = [{ Key: "0", Text: "Inch" }, { Key: "1", Text: "Cms" }, { Key: "2", Text: "Feet" }, { Key: "3", Text: "Meter" }];
var quantity = [{ Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }, { Key: "4", Text: "4" }, { Key: "5", Text: "5" }, { Key: "6", Text: "6" }, { Key: "7", Text: "7" }, { Key: "8", Text: "8" }, { Key: "9", Text: "9" }, { Key: "10", Text: "10" }];
var OverhangDirection = [{ Key: "0", Text: "Left" }, { Key: "1", Text: "Right" }];
var OverhangType = [{ Key: "0", Text: "Overlap" }, { Key: "1", Text: "Innerlap" }];
var OverhangMesUnit = [{ Key: "0", Text: "Inch" }, { Key: "1", Text: "Cms" }, { Key: "2", Text: "Feet" }, { Key: "3", Text: "Meter" }];

function ADDShipment() {
    $.ajax({
        url: "Services/Shipment/ULDBreakdownService.svc/GetWebForm/LyingListSearch/LyingListSearch/LyingListSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divULDBreakdownPopUp").html(result);
            $("#divULDBreakdownPopUp").find("table[cfi-aria-search='search']").find("input[id='LyingFlightDate']").data("kendoDatePicker").value(null);
            $("#divULDBreakdownPopUp").find("table[cfi-aria-search='search']").css("width", "100%");
            $("#divULDBreakdownPopUp").find("table[cfi-aria-search='search']").find("button[id='btnSearch']").each(function () {
                $(this).unbind("click").bind("click", function () {
                    ShowLyingListShipment();
                    $('#aspnetForm').on('submit', function (e) {
                        e.preventDefault();
                    });
                });
            });
            cfi.PopUp("divULDBreakdownPopUp", "Lying List Shipment", 1000, PopUpOnOpen, PopUpOnClose, 100);
        }
    });
}



function AttachLyingListShipment() {
    var vgrid = cfi.GetCFGrid("divULDBreakdownPopUp");
    if (vgrid != undefined) {
        var detaildatasource = vgrid.dataSource;

        $.each(processedawb, function (i, item) {
            if (item && (item.FromTable == 0 || item.FromTable == 2) && item.ULDStockSNo > -1) {
                var offloadfromuld = {
                    AWBSNo: item.AWBSno,
                    AWBNo: item.AwbNo,
                    FlightNo: $("span[id='FlightNo']").text(),
                    FlightDate: $("span[id='FlightDate").text(),
                    OriginCity: $("span[id='Origin']").text(),
                    Pieces: item.Pieces + "/" + item.FromTableTotalPieces,
                    FromTableTotalPieces: item.FromTableTotalPieces,
                    LIPieces: item.FromTableTotalPieces,
                    LoadPieces: item.Pieces,
                    GrossWeight: item.GrossWeight,
                    VolumeWeight: item.VolumeWeight,
                    LoadGrossWeight: item.GrossWeight,
                    LoadVol: item.VolumeWeight,
                    SPHC: item.SPHC,
                    Plan: "",
                    FromTable: item.FromTable,
                    FromTableSNo: item.FromTableSNo,
                    WeightDetail: item.AWBGrossWeight + "/" + item.AWBVolumeWeight,
                    ShipmentDetail: item.ShipmentDetail,
                    LoadDetail: "",
                    AWBPieces: item.AWBPieces,
                    AWBGrossWeight: item.AWBGrossWeight,
                    AWBVolumeWeight: item.AWBVolumeWeight,
                };
                var existinginulddata = $.grep(detaildatasource.data(), function (e, index) {
                    if (item.ULDStockSNo > -1 && e.AWBSNo == item.AWBSno && e.AWBNo == item.AwbNo && e.FromTable == offloadfromuld.FromTable && e.FromTableSNo == item.FromTableSNo) {
                        offloadfromuld.GrossWeight = parseFloat(parseFloat(e.GrossWeight) - parseFloat(offloadfromuld.GrossWeight)).toFixed(2);
                        offloadfromuld.VolumeWeight = parseFloat(parseFloat(e.VolumeWeight) - parseFloat(offloadfromuld.VolumeWeight)).toFixed(2);
                        offloadfromuld.LIPieces = parseInt(offloadfromuld.FromTableTotalPieces);
                        offloadfromuld.Pieces = (parseInt(e.Pieces.split('/')[0]) - parseInt(offloadfromuld.Pieces)).toString() + "/" + parseInt(offloadfromuld.FromTableTotalPieces);
                        offloadfromuld.LoadPieces = parseInt(offloadfromuld.Pieces.split('/')[0]);
                        offloadfromuld.LoadGrossWeight = offloadfromuld.GrossWeight;
                        offloadfromuld.LoadVol = offloadfromuld.VolumeWeight;
                        offloadfromuld.WeightDetail = offloadfromuld.AWBGrossWeight + "/" + offloadfromuld.AWBVolumeWeight;
                        offloadfromuld.Plan = e.Plan;
                        offloadfromuld.FlightNo = e.FlightNo;
                        offloadfromuld.FlightDate = e.FlightDate;
                        offloadfromuld.OriginCity = e.OriginCity;
                        offloadfromuld.ShipmentDetail = e.ShipmentDetail;
                        return e;
                    }
                });
                if (existinginulddata.length == 0) {
                    lyinggriddatasource.insert(offloadfromuld);
                }
                else {
                    detaildatasource.remove(existinginulddata[0]);
                    detaildatasource.insert(offloadfromuld);
                }
            }
        });
    }
}

function ShowLyingListShipment() {
    var org = $("#LyingOriginCity").val();
    var dest = $("#LyingDestinationCity").val();
    var flight = $("#LyingFlightNo").val();
    var awb = $("#LyingAWBNo").val();
    var date = cfi.CfiDate("LyingFlightDate");

    if (org == "")
        org = "A~A";
    if (dest == "")
        dest = "A~A";

    if (flight == "") {
        var flightCntrl = $("#Text_searchFlightNo").data("kendoAutoComplete");
        var FlightNo = "A~A";

        if (flightCntrl != undefined)
            FlightNo = flightCntrl.value() == "" ? "A~A" : flightCntrl.value();
        flight = $.trim(FlightNo);
    }

    if (awb == "")
        awb = "A~A";

    if (date == "")
        date = "0";

    $.ajax({
        url: "Services/Shipment/ULDBreakdownService.svc/GetLyingListGridData/BUILDUP/Buildup/SEARCHLYINGLIST/" + org + "/" + dest + "/" + flight + "/" + date + "/" + awb,
        async: true,
        type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divULDBreakdownPopUp").html(result);
            $("#divULDBreakdownPopUp").append("<button aria-disabled='false' role='button' title='ADD' type='button' id='btnADDdata' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='ADDTransitReBuildData();'><span class='ui-button-text'>ADD</span></button>")
        }
    });
}

function ADDTransitReBuildData() {
    var ULDBreakdownArray = [];
    $('#divULDBreakdownPopUp  div.k-grid-content  table  tbody  tr').each(function (row, tr) {
        if ($(tr).find('input:checkbox[id=chkSelect]')[0].checked == true) {
            var ULDBreakdownInfo = {
                AWBSNo: $(tr).find("td")[0].innerText,
                AWBNo: $(tr).find("td")[2].innerText,
                OffloadedSNo: $(tr).find("td")[15].innerText
            };
            ULDBreakdownArray.push(ULDBreakdownInfo);
        }
    });

    if (ULDBreakdownArray.length == 0) {
        ShowMessage('warning', 'Warning - ULD Build details', "Unable to ADD. Please check atleast one AWB No.", "bottom-right");
        return;
    }
    else {
        $.ajax({
            url: "Services/Shipment/ULDBreakdownService.svc/ADDTransitReBuildData", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ULDBreakdown: ULDBreakdownArray, DailyFlightSNo: $("#MainULDNo").val(), ULDNo: $("#Text_MainULDNo").val(), UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    var message = "";
                    if ($('input:radio[name=Type]:checked').val() == 1) {
                        if ($("#Action").val() == "1")
                            message = "RE - BUILD ";
                        if ($("#Action").val() == "3")
                            message = "MIX TO CLEAN LOAD ";
                    }

                    ShowMessage('success', 'Success - ULD Breakdown', "Added Successfully", "bottom-right");
                    Submit();
                    $("#divULDBreakdownPopUp").html('');
                    $("#divULDBreakdownPopUp").data("kendoWindow").close();
                }
                else {
                    ShowMessage('warning', 'Warning - ULD Breakdown', "unable to process.", "bottom-right");
                }
            }
        });
    }
}

function ShowULDDetails() {
    var dailyFlightSNo = $("#MainULDNo").val();
    var uldNo = $("#Text_MainULDNo").val();
    var uldSNo = $("#hdnULDSNo").val();
    $.ajax({
        url: "Services/BuildUp/BuildUpService.svc/GetWebForm/ULDDETAILS/ULDDETAILS/ULDBuildUpDetails/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            databind = true;
            $("#divULDBreakdownPopUp").html(result);
            InstantiateControl("divULDBreakdownPopUp");

            $('#Height').css("width", "50px");
            $('#Text_LoadCode').width(200);
            $('#Text_LoadIndicator').width(200);
            $('#Text_AbbrCode').width(200);
            $('#Text_ULDLocation').width(150);

            $('#__tbluldbuildupdetails__ tr td:eq(0)').html($('#__tbluldbuildupdetails__ tr td:eq(0)').html() + "<input type='hidden' name='ULDBuildUpLocation' id='ULDBuildUpLocation' value=''/> <input type='text'  name='Text_ULDBuildUpLocation' id='Text_ULDBuildUpLocation' tabindex='1' controltype='autocomplete' maxlength='10' />");
            $('#OtherPallets').after("<input type='hidden' name='_OtherPallets' id='_OtherPallets' value=''/> <input type='text'  name='Text__OtherPallets' id='Text__OtherPallets' tabindex='18' controltype='autocomplete' maxlength='10' />");

            $('#Text_ULDBuildUpLocation').width(200);
            $('#Text__OtherPallets').width(200);
            $('#Ovng_MasterRemarks').hide();
            $('#spnOvng_MasterRemarks').hide();

            $("#Height").on("keypress keyup blur", function (event) {
                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

            $('input[type="text"][id^="OverhangWidth"]').on("keypress keyup blur", function (event) {
                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

            $("#Ovng_MasterCutOffHeight").on("keypress keyup blur", function (event) { // Cut off Height
                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

            $('#AddScaleWeight').blur(function () {
                var TotalULDWeight = GetULDWeight();
                var ScaleWeight = $('#AddScaleWeight').val();
                if (ScaleWeight != "" && parseFloat(ScaleWeight) > 0) {
                    if (parseFloat(TotalULDWeight) > parseFloat(ScaleWeight)) {
                        $('#AddScaleWeight').val('');
                        ShowMessage('warning', 'Information', "Scale weight cannot be less than Gross Weight ( Net Weight + Tare Weight)");
                    }
                }
            });

            $('#Ovng_IsOverhangPallet').click(function () {
                OverhangControl(this.checked);
            });

            var DSBaseULD = [{ Key: uldSNo, Text: uldNo }];

            cfi.AutoComplete("ULDBuildUpLocation", "LocationName", "vwBuildupLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
            cfi.AutoComplete("ULDLocation", "LocationName", "vwBuildupLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
            cfi.AutoComplete("LoadCode", "ULDLoadingCode,Description", "ULDLoadingCodes", "SNo", "ULDLoadingCode", ["ULDLoadingCode", "Description"], null, "contains");
            cfi.AutoComplete("LoadIndicator", "ULDLoadingIndicator,Description", "ULDLoadingIndicator", "SNo", "ULDLoadingIndicator", ["ULDLoadingIndicator", "Description"], null, "contains");
            cfi.AutoComplete("AbbrCode", "AbbrCode,Description", "ULDContour", "SNo", "AbbrCode", ["AbbrCode", "Description"], null, "contains");
            cfi.AutoCompleteByDataSource("ULDBuild", uldbuild, null, null);
            cfi.AutoCompleteByDataSource("MeasurementUnit", OverhangMesUnit, null, null);
            cfi.AutoCompleteByDataSource("UldBasePallet", DSBaseULD, null, null);
            cfi.AutoComplete("_OtherPallets", "ULDNo", "vBuidupOtherPallet", "ULDNo", "ULDNo", ["ULDNo"], null, "contains", ",");
            cfi.AutoComplete("UldBupType", "Description", "buptype", "SNo", "Description", ["Description"], null, "contains");
            cfi.AutoCompleteByDataSource("Ovng_MasterMesUnit", OverhangMesUnit, null, null);
            cfi.AutoCompleteByDataSource("ULD_MesUnit", OverhangMesUnit, null, null);

            $('#Text_UldBupType').blur(function () {
                ValidateBUPType();
            });

            $('#Text_UldBasePallet').blur(function () {
                ValidateBasePallet();
            });

            $.ajax({
                url: "Services/BuildUp/BuildUpProcessService.svc/GetULDBuildUpDetails?ULDStockSNo=" + uldSNo + '&DailyFlightSNo=' + dailyFlightSNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var uldData = jQuery.parseJSON(result);
                    var uldDetailData = uldData.Table0;
                    var listArray = uldData.Table1;
                    var listArrayOverhangMaster = uldData.Table2;
                    var listArrayOverhangTrans = uldData.Table3;

                    if (uldDetailData.length > 0) {
                        var uldDetailItem = uldDetailData[0];
                        var _startTime = uldDetailItem.StartTime == "" ? "+ Add Time" : uldDetailItem.StartTime;
                        var _EndTime = uldDetailItem.EndTime == "" ? "+ Add Time" : uldDetailItem.EndTime;

                        $('span[id="StartTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDStartTime\" onclick=\"AddULDTime(this,'StartTime')\">" + _startTime + "</span>");

                        if (OpenFrom == "Details") {
                            $('span[id="EndTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDEndTime\" onclick=\"AddULDEndTime(this,'EndTime')\">" + _EndTime + "</span>");
                        }
                        else {
                            $('span[id="EndTime"]').after("<span class=\"actionView\" id=\"spnULDEndTime\">" + _EndTime + "</span>");
                        }

                        $("#Text_ULDBuildUpLocation").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDBuildUpLocation, uldDetailItem.Text_ULDBuildUpLocation);
                        $("#Text_ULDLocation").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDLocationSNo, uldDetailItem.Text_ULDLocationSNo);
                        $("#Text_ULDBuild").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDBuild, uldDetailItem.Text_ULDBuildSNo);
                        $("#Text_LoadIndicator").data("kendoAutoComplete").setDefaultValue(uldDetailItem.LoadIndicationSNo, uldDetailItem.Text_LoadIndicator);
                        $("#Text_AbbrCode").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDContourSNo, uldDetailItem.Text_AbbrCode);

                        if (uldDetailItem.BaseULDSNo != "" && uldDetailItem.BaseULDSNo != "0")
                            $("#Text_UldBasePallet").data("kendoAutoComplete").setDefaultValue(uldDetailItem.BaseULDSNo, __uldno.trim());

                        $("#Text_LoadCode").data("kendoAutoComplete").setDefaultValue(uldDetailItem.LoadCodeSNo, uldDetailItem.Text_LoadCode);
                        $("#StartTime").val(uldDetailItem.StartTime);
                        $("#EndTime").val(uldDetailItem.EndTime);
                        $("#AddScaleWeight").val(uldDetailItem.ScaleWeight == "-1.00" ? "" : uldDetailItem.ScaleWeight);
                        $("textarea#Remarks").val(uldDetailItem.Remarks);
                        $("#NotToBeManifested").attr("checked", (uldDetailItem.NotToBeManifest.toString().toLowerCase() == "true"));

                        if (uldDetailItem.IsTeamPersonnel.toString().toLowerCase() == "true") {
                            $('input[name=IsTeamPersonal][value=1]').attr('checked', true);
                        }
                        else {
                            $('input[name=IsTeamPersonal][value=0]').attr('checked', true);
                        }

                        $("#Height").val(uldDetailItem.Height == "-1" ? "" : uldDetailItem.Height);
                        $("#Text_MeasurementUnit").data("kendoAutoComplete").setDefaultValue(uldDetailItem.MeasurementUnit, uldDetailItem.text_MeasurementUnit);
                        $("#Text_UldBupType").data("kendoAutoComplete").setDefaultValue(uldDetailItem.BUPTypeSNo, uldDetailItem.Text_UldBupType);

                        if (uldDetailItem.OtherPallets != "")
                            cfi.BindMultiValue("_OtherPallets", uldDetailItem.OtherPallets, uldDetailItem.OtherPallets);
                        $('#_OtherPallets').val(uldDetailItem.OtherPallets);
                    }
                    else {
                        $('span[id="StartTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDStartTime\" onclick=\"AddULDTime(this,'StartTime')\">+ Add Time</span>");
                        $('span[id="EndTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDEndTime\" onclick=\"AddULDEndTime(this,'EndTime')\">+ Add Time</span>");
                    }

                    if (listArrayOverhangMaster.length > 0) {
                        var ArrayOverhangMaster = uldData.Table2[0];
                        $('#Ovng_MasterCutOffHeight').val(ArrayOverhangMaster.CutOffHeight == "-1" ? "" : ArrayOverhangMaster.CutOffHeight);
                        $('#Ovng_MasterRemarks').val(ArrayOverhangMaster.Remarks);
                        $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").setDefaultValue(ArrayOverhangMaster.CutOffMesUnit, ArrayOverhangMaster.text_CutOffMesUnit);
                        $("#Ovng_IsOverhangPallet").attr("checked", (ArrayOverhangMaster.IsOverhangPallet.toString().toLowerCase() == "true"));
                        OverhangControl($('#Ovng_IsOverhangPallet').is(":checked"));
                    }
                    else {
                        OverhangControl($('#Ovng_IsOverhangPallet').is(":checked"));
                    }

                    cfi.makeTrans("ulddetails_uldconsumables", null, null, BindConsumablesAutoComplete, ReBindConsumablesAutoComplete, null, listArray);

                    /*******************Overhang Autocomplete******************************/
                    cfi.makeTrans("ulddetails_uldoverhangpallet", null, null, BindOverhangAutoComplete, null, null, listArrayOverhangTrans);
                    $("div[id$='divareaTrans_ulddetails_uldoverhangpallet']").find("[id='areaTrans_ulddetails_uldoverhangpallet']").each(function () {
                        $(this).find("input[id^='OverhangDirection']").each(function () {
                            cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangDirection, null, null);
                        });
                        $(this).find("input[id^='OverhangType']").each(function () {
                            cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangType, null, null);
                        });
                        $(this).find("input[id^='OverhangMesUnit']").each(function () {
                            cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangMesUnit, null, null);
                        });
                    });

                    /**********For Already Added Trans Data*********************/
                    $('input[type="text"][id^="OverhangWidth"]').each(function () {
                        var currentID = $(this)[0].id;
                        var currentValue = $(this)[0].value;
                        $('#' + currentID).css("width", "50px");
                    });

                    $("div[id$='divareaTrans_ulddetails_uldconsumables']").find("[id='areaTrans_ulddetails_uldconsumables']").each(function () {
                        $(this).find("input[id^='ConsumablesSNo']").each(function () {
                            cfi.AutoComplete($(this).attr("name"), "Item", "Consumables", "SNo", "Item", ["Item"], null, "contains");
                        });
                        $(this).find("input[id^='Quantity']").each(function () {
                            cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), quantity, null, null);
                        });
                    });
                },
                error: {
                }
            });
            savetype = "ULDDETAILS";
            cfi.PopUp("divULDBreakdownPopUp", "ULD Build Details", 1000, PopUpOnOpen, PopUpOnClose);
        }
    });
}

function OverhangControl(status) {
    if (!status) {
        $('#Ovng_MasterCutOffHeight').attr("disabled", true);
        $('#Text_Ovng_MasterMesUnit').attr("disabled", true);
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="text"]').attr("disabled", true);

        $('#Ovng_MasterCutOffHeight').val('');
        $('#Ovng_MasterMesUnit').val('');
        $('#Text_Ovng_MasterMesUnit').val('');
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="text"]').val('');
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="hidden"]').val('');
    }
    else {
        $('#Ovng_MasterCutOffHeight').attr("disabled", false);
        $('#Text_Ovng_MasterMesUnit').attr("disabled", false);
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="text"]').attr("disabled", false);
    }
}

function BindConsumablesAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ConsumablesSNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Item", "Consumables", "SNo", "Item", ["Item"], null, "contains");
    });
    $(elem).find("input[id^='Quantity']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), quantity, null, null);
    });
}

function ReBindConsumablesAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_ulddetails_uldconsumables']").find("[id^='areaTrans_ulddetails_uldconsumables']").each(function () {
        $(this).find("input[id^='ConsumablesSNo']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Consumables", "SNo", "Item", ["Item"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='Quantity']").each(function () {
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), quantity, false);
        });
    });
}

function BindOverhangAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='OverhangDirection']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangDirection, null, null);
    });

    $(elem).find("input[id^='OverhangMesUnit']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangMesUnit, null, null);
    });

    $(elem).find("input[id^='OverhangType']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangType, null, null);
    });

    $('span.k-widget.k-numerictextbox.transSection').width(55);
}

function PopUpOnOpen(cntrlId) {
    savetype = "ULDDETAILS";
    return false;
}

function PopUpOnClose(cntrlId) {
    savetype = "";
    __uldstocksno = -1;
    __uldno = "";
    return false;
}

function SaveBuildUpPlan() {
    if (savetype == "") {
        processeduld = [];
        processeduldshipment = [];
        var vgrid = cfi.GetCFGrid("divUldShipmentSection");
        var trHeader = $("div#divUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
        var uldstocksnoindex = -1;
        var totalshipmentindex = -1;

        uldstocksnoindex = trHeader.find("th[data-field='ULDStockSNo']").index();
        totalshipmentindex = trHeader.find("th[data-field='Shipments']").index();

        $("#divUldShipmentSection").find("tr.k-master-row").each(function () {
            var uldStockSNo = $(this).find("td:eq(" + uldstocksnoindex + ")").text();
            var isprocessed = 0;
            var detailgrid = cfi.GetNestedCFGrid("div__" + uldStockSNo.toString());
            if (detailgrid != undefined) {
                isprocessed = 1;
                var detaildatasource = detailgrid.dataSource;
                var detaildata = detaildatasource.data();
                $.each(detaildata, function (i, item) {
                    if (item) {
                        var UldModel = {
                            ULDStockSNo: uldStockSNo,
                            AWBSNo: item.AWBSno,
                            Pieces: item.Pieces,
                            GrossWeight: item.GrossWeight,
                            VolumeWeight: item.VolumeWeight
                        }
                        processeduldshipment.push(UldModel);
                    }
                });
            }
            processeduld.push({
                ULDStockSNo: uldStockSNo,
                OffloadPoint: $(this).find("input[type='hidden']").val(),
                TotalShipment: $(this).find("td:eq(" + totalshipmentindex + ")").text(),
                IsProcessed: isprocessed
            });
        });

        var processedFlightInfo = {
            DailyFlightSNo: $("input[type='hidden'][id='FlightNo").val(),
            RegistrationNo: $("#RegistrationNo").val()
        }

        if (processedawb.length == 0) {
            processedawb.push({
                AWBSno: "0",
                AwbNo: "",
                Pieces: "0",
                GrossWeight: "0",
                VolumeWeight: "0",
                SPHC: "",
                ULDStockSNo: -2,
                FromTable: "-1",
                FromTableSNo: "0"
            });
        }

        if (processeduldshipment.length == 0) {
            processeduldshipment.push({
                ULDStockSNo: -1,
                AWBSNo: -1
            });
        }

        var GroupFlightSNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key();
        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/SaveBuildUpPlan", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ProcessedULDInfo: processeduld, ProcessedULDShipment: processeduldshipment, ProcessedAWB: processedawb, ProcessedFlightInfo: processedFlightInfo, UpdatedBy: _LoginSNo_, RemovedULD: RemovedULDStockSNo, GroupFlightSNo: GroupFlightSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "] -  Processed Successfully", "bottom-right");
                    ResetSearchByFlight();
                }
                else
                    ShowMessage('warning', 'Warning - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "] -  " + result, "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "]  -  unable to process.", "bottom-right");
            }
        });
    }
    else if (savetype == "ULDDETAILS") {
        var uldConsumables = [];
        var uldDetails = {
            ULDStockSNo: __uldstocksno,
            ULDBuildUpLocation: $("#Text_ULDBuildUpLocation").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_ULDBuildUpLocation").data("kendoAutoComplete").key(),
            StartTime: $("#StartTime").val(),
            EndTime: $("#EndTime").val(),
            NotToBeManifested: $("#NotToBeManifested").is(":checked"),
            LocationSNo: $("#Text_ULDLocation").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_ULDLocation").data("kendoAutoComplete").key(),
            BuildSNo: $("input[type='text'][id='Text_ULDBuild']").data("kendoAutoComplete").key() == '' ? 0 : $("input[type='text'][id='Text_ULDBuild']").data("kendoAutoComplete").key(),
            ScaleWeight: $("input[type='text'][id='AddScaleWeight']").val() == '' ? 0 : $("input[type='text'][id='AddScaleWeight']").val(),
            IsTeamPersonnel: $("input[type='radio'][name='IsTeamPersonal']:checked").val(),
            Height: $("#Height").val() == '' ? null : $("#Height").val(),
            MeasurementUnit: $("#Text_MeasurementUnit").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_MeasurementUnit").data("kendoAutoComplete").key(),
            Remarks: $("textarea#Remarks").val(),
            LoadCodeSNo: $("#Text_LoadCode").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_LoadCode").data("kendoAutoComplete").key(),
            LoadIndicationSNo: $("#Text_LoadIndicator").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_LoadIndicator").data("kendoAutoComplete").key(),
            ULDContourSNo: $("#Text_AbbrCode").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_AbbrCode").data("kendoAutoComplete").key(),
            BUPTypeSNo: $("#Text_UldBupType").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_UldBupType").data("kendoAutoComplete").key(),
            BaseULDSNo: $("#Text_UldBasePallet").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_UldBasePallet").data("kendoAutoComplete").key(),
            OtherPallets: $("#ULDOtherPallets").val()
        }

        $("div[id$='areaTrans_ulddetails_uldconsumables']").find("[id^='areaTrans_ulddetails_uldconsumables']").each(function () {
            var uldConsumablesViewModel = {
                ULDStockSNo: __uldstocksno,
                ConsumablesSNo: $(this).find("[id^='Text_ConsumablesSNo']").data("kendoAutoComplete").key(),
                Quantity: $(this).find("[id^='Text_Quantity']").data("kendoAutoComplete").key()
            };
            uldConsumables.push(uldConsumablesViewModel);
        });

        if (uldConsumables.length == 0) {
            var uldConsumablesViewModel = {
                ConsumablesSNo: "",
                Quantity: ""
            };
            uldConsumables.push(uldConsumablesViewModel);
        }

        /*****************Overhang Model**************************/
        var ULDBuildUpOverhangTrans = [];

        var Model_ULDBuildUpOverhangPallet = {
            SNo: 0,
            ULDStockDetailsSNo: 0,
            IsOverhangPallet: $("#Ovng_IsOverhangPallet").is(":checked"),
            CutOffHeight: $("#Ovng_MasterCutOffHeight").val() == '' ? 0 : $("#Ovng_MasterCutOffHeight").val(),
            CutOffMesUnit: $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").key(),
            Remarks: $("#Ovng_MasterRemarks").val()
        };

        $("div[id$='areaTrans_ulddetails_uldoverhangpallet']").find("[id^='areaTrans_ulddetails_uldoverhangpallet']").each(function () {
            var Model_ULDBuildUpOverhangTrans = {
                SNo: 0,
                OverhangPalletSNo: 0,
                OverhangDirection: $(this).find("[id^='Text_OverhangDirection']").data("kendoAutoComplete").key() == '' ? 0 : $(this).find("[id^='Text_OverhangDirection']").data("kendoAutoComplete").key(),
                Width: $(this).find("[id^='OverhangWidth']").val() == '' ? 0 : $(this).find("[id^='OverhangWidth']").val(),
                WidthMesUnit: $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").key() == '' ? 0 : $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").key(),
                OverhangType: $(this).find("[id^='Text_OverhangType']").data("kendoAutoComplete").key() == '' ? 0 : $(this).find("[id^='Text_OverhangType']").data("kendoAutoComplete").key(),
                OtherInfo: $(this).find("[id^='OverhangOtherInfo']").val(),
            };
            ULDBuildUpOverhangTrans.push(Model_ULDBuildUpOverhangTrans);
        });
        /********************************************************/

        $.ajax({
            url: "Services/Shipment/ULDBreakdownService.svc/SaveULDDetails", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ULDDetails: uldDetails, ULDConsumables: uldConsumables, ULDStockSNo: __uldstocksno, DailyFlightSNo: $("input[type='hidden'][id='FlightNo").val(), UpdatedBy: 2, ULDBuildUpOverhangPallet: Model_ULDBuildUpOverhangPallet, ULDBuildUpOverhangTrans: ULDBuildUpOverhangTrans }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - ULD Details', "ULD No. [" + __uldno + "] -  processed successfully", "bottom-right");
                    cfi.ClosePopUp("divNewBooking");
                    savetype = "";
                    __uldno = "";
                    __uldstocksno = -1;
                }
                else
                    ShowMessage('warning', 'Warning - ULD Details', "ULD No. [" + __uldno + "] -  unable to process", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - ULD Details', "ULD No. [" + __uldno + "]  -  unable to process.", "bottom-right");
            }
        });
    }
}