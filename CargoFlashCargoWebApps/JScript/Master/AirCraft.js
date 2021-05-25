/*
*****************************************************************************
Javascript Name:	AirCraftJS     
Purpose:		    This JS used to get Grid Data for AirCraft and its tab function.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			   Krishan Kant Agarwal
Created On:		   
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/



var strData = [];
var holdtypelist = [{ Key: "0", Text: "Max FWD" }, { Key: "1", Text: "Long FWD" }, { Key: "2", Text: "Max AFT" }, { Key: "3", Text: "Long AFT" }]
$(document).ready(function () {

    cfi.ValidateForm();
    //$("[id$='GrossWeightType']").val("KG");
    //$('#GrossWeightType').attr('readonly', 'true');
    //$('#GrossWeightType').attr('checked', true);
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    //if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
    var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    //}

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "AircraftMaster_AirlineSNo", null, "contains");
    cfi.AutoCompleteV2("ABBRCodeSNo", "AbbrCode,Description", "AircraftMaster_ABBRCodeSNo", null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() != "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        AirCraftInventoryGrid();
        AuditLogBindOldValue('tblAirCraftInventory');
        //Updated by Akash for Audit Log on 6 Nov 2017
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        ShowHideAircraftPallet();
    }
    cfi.ResetAutoComplete("tblAirCraftULD_ContourType_");


    $('input:radio[name=CargoClassification]').click(function () {
        if ($(this).val() == '4') {
            $('#LowerDeckPalletQty').val('');
            $('#UpperDeckPalletQty').val('');
            $('#LowerDeckContainerQty').val('');
            $('#_tempLowerDeckPalletQty').val('');
            $('#_tempUpperDeckPalletQty').val('');
            $('#_tempLowerDeckContainerQty').val('');
            //$("input:radio[name='IsActive'][value ='1']").prop('checked', true);
            $('#LowerDeckPalletQty').attr('readonly', true);
            $('#UpperDeckPalletQty').attr('readonly', true);
            $('#LowerDeckContainerQty').attr('readonly', true);
            $('#Position').attr('readonly', false);
            $('#Position').show();
            $("#_tempPosition").closest('td').prev().text('No of Positions');
            //$('#IsActive').attr('disabled', true);
            //jQuery('#IsActive').attr('disabled', 'disabled');
        }
        else {
            //$("input:radio[name='IsActive'][value ='0']").prop('checked', true);
            $('#LowerDeckPalletQty').attr('readonly', false);
            $('#UpperDeckPalletQty').attr('readonly', false);
            $('#LowerDeckContainerQty').attr('readonly', false);
            //$('#IsActive').attr('disabled', false);
            $('#Position').val('');
            $('#_tempPosition').val('');
            $('#Position').attr('readonly', true);
            $('#Position').hide();
            $("#_tempPosition").hide();
            $("#_tempPosition").closest('td').prev().text('');
        }

    });


    $("input[type='text']:eq(0)").focus();

    BindingGridonClick();
    function BindingGridonClick() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liAirCraftInventoryPaxFactor").hide();
            //$("#liAirCraftDoor").hide();
            //$("#liAirCraftULD").hide();
            //$("#liAirCraftSPHC").hide();
            //$("#liAirCraftPassengerCapacity").hide();
            var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
            tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(3), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(4), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(5), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(6), false);
        }
    }

    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    $(document).on('drop', function () {
        return false;
    });
    $("#AircraftVersion").keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })
    //if ("Text_AgentForwarder" == a)
    //    return cfi.setFilter(a, "SNo", "notin", $("#AgentForwarder").val()), filter= cfi.autoCompleteFilter(a);
});

$('#Position,#_tempPosition').unbind('load').bind('load', function () {


})

function ShowHideAircraftPallet() {
    if ($('input:radio[name=CargoClassification]:checked').val() == '4') {
        //$("input:radio[name='IsActive'][value ='1']").prop('checked', true);
        $('#LowerDeckPalletQty').attr('readonly', true);
        $('#UpperDeckPalletQty').attr('readonly', true);
        $('#LowerDeckContainerQty').attr('readonly', true);
        //$('#IsActive').attr('disabled', true);
        $('#Position').attr('readonly', false);
        $('#_tempPosition').hide()
        $('#Position').show();
        $("#Position").closest('td').prev().text('No of Positions');
    }
    else {
        //$("input:radio[name='IsActive'][value ='0']").prop('checked', true);
        $('#LowerDeckPalletQty').attr('readonly', false);
        $('#UpperDeckPalletQty').attr('readonly', false);
        $('#LowerDeckContainerQty').attr('readonly', false);
        //$('#IsActive').attr('disabled', false);
        $('#Position').attr('readonly', true);
        $('#Position').hide();
        $("#_tempPosition").hide()
        $("#Position").closest('td').prev().text('');
    }
}
var RowIndex = 0; var GrossWeight = 0;
function AirCraftSPHCGrid() {
    var theDiv = document.getElementById("divAircraftDimensionMatrix");
    theDiv.innerHTML = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "SHC Information  can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'AirCraftSPHC';
        var pageType = getQueryStringValue("FormAction").toUpperCase();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'READ',
            tableColumns: 'SNo,AirCraftSNo,SPHCSNo,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'SHC Information',
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftSNo', type: 'hidden', value: $('#hdnAirCraftSNo').val() },

                 { name: 'SPHCSNo', display: 'SHC Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return Validate(this.id);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'AircraftMaster_SPHCSNo', filterField: 'Code', filterCriteria: "contains" },
                {
                    name: pageType == 'EDIT' ? 'IsCompatible' : 'Compatible', display: 'Compatible', type: pageType == 'EDIT' ? 'select' : 'Label', ctrlAttr: { maxlength: 100, onChange: "return ChangeCompatible(this.id);" }, ctrlOptions: { 0: 'Yes', 1: 'No' }, selectedIndex: 0//,
                    // onChange: function (evt, rowIndex) { },onblur: "return ChangeCompatible(this.id);", onclick: "return ChangeCompatible(this.id);", 
                },
                 { name: 'AFT', display: 'AFT', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 5, }, ctrlCss: { width: '150px' }, isRequired: false },
                 //onkeypress: "return RemoveZero(this.id);", onkeydown: "return RemoveZero(this.id);", onblur: "return RemoveZero(this.id);"
                  { name: 'FWD', display: 'FWD', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 5, }, ctrlCss: { width: '150px' }, isRequired: false },
                  //onkeypress: "return RemoveZero(this.id);", onkeydown: "return RemoveZero(this.id);", onblur: "return RemoveZero(this.id);" 
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],

            //hideButtons: { append: true, remove: true, removeLast: true },
            isPaging: true,
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                for (var i = 1; i <= RowIndex; i++) {
                    var ChkId = "tblAirCraftSPHC_IsCompatible_" + i;
                    if ($("#" + ChkId).val() == "1") {
                        ChangeCompatibleonLoad(i);
                    }

                }
            },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                //widthsetsphc();
                RowIndex = addedRowIndex.length;
            },
        });
        for (var i = 1; i <= RowIndex; i++) {
            var ChkId = "tblAirCraftSPHC_IsCompatible_" + i;
            if ($("#" + ChkId).val() == "1") {
                ChangeCompatibleonLoad(i);
            }

        }
        GrossWeight = $("#GrossWeight").val();

    }
    //$("#tblAirCraftSPHC_btnAppendRow").click(function () { $("#tblAirCraftSPHC_btnAppendRow").hide(); })
    //function ExtraCondition(a) {

    //    var id = a; tblAirCraftCapacitySPHC_SPHCSNo_
    //    if (a.split('_')[0] == "tblAirCraftCapacitySPHC")
    //        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#tblAirCraftCapacitySPHC_SPHCSNo_" + id.split('_')[2]).val()), filter = cfi.autoCompleteFilter(a);
    //    //if (a.split('_')[0] == "tblAirlinePartTrans")
    //    //    return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#tblAirlinePartTrans_HdnCitySNo_" + id.split('_')[2]).val()), filter = cfi.autoCompleteFilter(a);
    //}
}

function RemoveZero(obj) {
    var Value = parseInt($("#" + obj).val());
    var numb = obj.match(/\d/g);
    var Compatible = $("#tblAirCraftSPHC_Compatible_" + numb[0]).val();
    if (Compatible == "0") {
        if (Value > parseInt(GrossWeight)) {
            alert("Value ( Cumulative) should not exceed acceptable Gross Wt of Aircraft Type");
            $("#" + obj).val("");
            return false;
        }

        if (Compatible == "0") {
            if (Value == 0 && Value != "") {
                alert("AFT/FWD Value can not be null or zero.");
                $("#" + obj).val("");
                return false;
            }

        }


    }


}

function Validate(obj) {
    var ChkValue = $('#' + obj).val();
}

function ChangeCompatibleonLoad(i) {

    $("#tblAirCraftSPHC_AFT_" + i).attr('readonly', true);
    $("#tblAirCraftSPHC_FWD_" + i).attr('readonly', true);
    $("#tblAirCraftSPHC_AFT_" + i).val("0");
    $("#tblAirCraftSPHC_FWD_" + i).val("0");
    //$("#tblAirCraftSPHC_AFT_" + i).removeAttr("required");
    //$("#tblAirCraftSPHC_FWD_" + i).removeAttr("required");
}

function ChangeCompatible(obj) {
    var ChkValue = $("#" + obj).val();
    if (ChkValue == 0) {
        //$("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr("maxlength", "5");
        //$("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr("maxlength", "5");
        //$("#" + obj).parent().parent().find(" td:eq(3)").find("input").removeAttr("required");
        //$("#" + obj).parent().parent().find(" td:eq(4)").find("input").removeAttr("required");
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr('readonly', false);
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr('readonly', false);
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").val("");
    }
    else if (ChkValue == 1) {
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr('readonly', true);
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr('readonly', true);
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").val("");
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").val("");
        //$("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr("required", "required");
        //$("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr("required", "required");
    }
}

function AirCraftInventoryGrid() {
    var theDiv = document.getElementById("divAircraftDimensionMatrix");
    //theDiv.innerHTML = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    }
    else {
        var dbTableName = 'AirCraftInventory';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,AirCraftSNo,RegistrationNo,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Aircraft Inventory',
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftSNo', type: 'hidden', value: $('#hdnAirCraftSNo').val() },
                { name: 'RegistrationNo', display: 'Registration No', type: 'text', ctrlAttr: { maxlength: 10, controltype: 'alphanumericupper', allowchar: '-' }, ctrlCss: { width: '150px' }, isRequired: false },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
        });


    }
}

function AirCraftInventoryPaxFactorGrid() {
    var theDiv = document.getElementById("divAircraftDimensionMatrix");
    theDiv.innerHTML = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Pax Factor Information  can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'AirCraftInventoryPaxFactor';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({

            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,AirCraftInventorySNo,PaxStart,PaxEnd,IncreaseFactor,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Pax Factor Information',
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftInventorySNo', display: 'Registration No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onclick: "return ChangeAircraft(this.id);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'Aircraft_GridRegistrationNo', filterField: 'RegistrationNo', filterCriteria: "contains" },
                { name: 'PaxStart', display: 'Total Pax Load', type: 'text', ctrlAttr: { maxlength: 3, controltype: "number" }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) { checkNumeric('tbl' + dbTableName + '_PaxStart_' + eval(rowIndex + 1)); $('#tbl' + dbTableName + '_PaxEnd_' + eval(rowIndex + 1)).val($('#tbl' + dbTableName + '_PaxStart_' + eval(rowIndex + 1)).val()); }, isRequired: true },
                { name: 'PaxEnd', display: 'Occupied Pax Load', type: 'text', ctrlAttr: { maxlength: 3, controltype: "number" }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) { checkNumeric('tbl' + dbTableName + '_PaxEnd_' + eval(rowIndex + 1)); checkRange(rowIndex + 1); }, isRequired: true },
                { name: 'IncreaseFactor', display: 'Increase Factor', type: 'text', ctrlAttr: { maxlength: 3, controltype: "decimal2" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                for (var i = 1; i < addedRowIndex.length; i++) {
                    strData.push(i);
                }
                getUpdatedRowIndex(strData.join(','), "tblAirCraftInventoryPaxFactor");

                // widthsetpax();
            }
        });
    }
}

function ChangeAircraft(obj) {
    var currValue = $("");
    $("tr[id^='tblTariffSlab_Row']").each(function () {
        var value
    });
}

function CheckDuplicate(ID) {
    //cuurRowNo = $('#tblBayLoadingTypeTrans_rowOrder').val().split(',')[(eval(ID.split('_')[2])-1)];
    var pType = '', bOn = '', minWt = 0, maxWt = 0, tp = '', tm = 0, act = 0;
    var currPType = '', currBOn = '', currMinWt = 0, currMaxWt = 0, currTp = '', currTm = 0, currAct = 0;
    //if (ID.split('_')[1].toUpperCase() == 'PCSTYPE')
    if ($('#tblBayLoadingTypeTrans_PcsType_' + ID.split('_')[2]).val() == 'BUP') {

        $('#tblBayLoadingTypeTrans_BasedOn_' + ID.split('_')[2]).val('0');
        $('#tblBayLoadingTypeTrans_BasedOn_' + ID.split('_')[2]).attr('disabled', 'disabled');
        $('#_temptblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).val('0');
        $('#tblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).val('0');
        $('#tblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).attr('readOnly', 'readOnly');
        $('#_temptblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).val('0');
        $('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).val('0');
        $('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).attr('readOnly', 'readOnly');
        $('#tblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).removeAttr('required');
        $('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).removeAttr('required');
    }
    else {
        $('#tblBayLoadingTypeTrans_BasedOn_' + ID.split('_')[2]).removeAttr('disabled');
        $('#tblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).removeAttr('readOnly');
        $('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).removeAttr('readOnly');
        $('#tblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).attr('required', 'required');
        $('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).attr('required', 'required');
        if (ID.split('_')[1].toUpperCase() == 'PCSTYPE') {
            //Changes By Karan.

            //$('#_temptblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).val('');
            //$('#tblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).val('');
            //$('#_temptblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).val('');
            //$('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).val('');
        }
    }
    currPType = $('#tblBayLoadingTypeTrans_PcsType_' + ID.split('_')[2]).val();
    currBOn = $('#tblBayLoadingTypeTrans_BasedOn_' + ID.split('_')[2]).val();
    currMinWt = $('#tblBayLoadingTypeTrans_MinPieceWeight_' + ID.split('_')[2]).val();
    currMaxWt = $('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).val();
    currMinWt = eval(currMinWt == '' ? 0 : currMinWt);
    currMaxWt = eval(currMaxWt == '' ? 0 : currMaxWt);
    currTp = $('#tblBayLoadingTypeTrans_IsLoading_' + ID.split('_')[2]).val();
    currTm = $('#tblBayLoadingTypeTrans_TimePerUnit_' + ID.split('_')[2]).val();
    currAct = $('#tblBayLoadingTypeTrans_IsActive_' + ID.split('_')[2]).val();
    var count = 0;
    var seen = {};
    var msgpkpp = 0;
    //var currMinWt = 0, currMaxWt = 0, minWt = 0, maxWt = 0;
    //var pcsType, bOn,minWt,maxWt,tp,act;
    var txtMinPicWt = $("#tblBayLoadingTypeTrans").find("input[id^='tblBayLoadingTypeTrans_MinPieceWeight']");
    var txtMaxPicWt = $("#tblBayLoadingTypeTrans").find("input[id^='tblBayLoadingTypeTrans_MaxPieceWeight']");
    //var txtUnit = $("#tblBayLoadingTypeTrans").find("input[id^='tblBayLoadingTypeTrans_Unit']");
    var txtpcsType = $("#tblBayLoadingTypeTrans").find("input[id^='tblBayLoadingTypeTrans_HdnPcsType']");
    var txtpcsTypeText = $("#tblBayLoadingTypeTrans").find("input[id^='tblBayLoadingTypeTrans_PcsType']");
    var txtbasedon = $("#tblBayLoadingTypeTrans").find("select[id^='tblBayLoadingTypeTrans_BasedOn']");
    var txtType = $("#tblBayLoadingTypeTrans").find("select[id^='tblBayLoadingTypeTrans_IsLoading']");
    var txtTime = $("#tblBayLoadingTypeTrans").find("input[id^='tblBayLoadingTypeTrans_TimePerUnit']");
    var txtActive = $("#tblBayLoadingTypeTrans").find("select[id^='tblBayLoadingTypeTrans_IsActive']");
    var rowNo = Math.max.apply(Math, $('#tblBayLoadingTypeTrans_rowOrder').val().split(',')) + 1;
    while (rowNo > count) {
        //var txt = txtbasedon[count].value + ' ' + txtType[count].value + ' ' + txtMaxPicWt[count].value + ' ' + txtUnit[count].value + ' ' + txtpcsType[count].value;
        //var txt = txtpcsType[count].value + ' ' + txtbasedon[count].value + ' ' + txtUnit[count].value + ' ' + txtMaxPicWt[count].value + ' ' + txtType[count].value + ' ' + txtTime[count].value + ' ' + txtActive[count].value;
        //pcsType=txtpcsType[count].value;
        //bOn=txtbasedon[count].value;
        //tp=txtType[count].value;
        //act=txtActive[count].value;
        var txt = txtpcsType[count].value + ' ' + txtbasedon[count].value + ' ' + txtType[count].value + ' ' + txtMinPicWt[count].value + ' ' + txtMaxPicWt[count].value + ' ' + currTm + ' ' + txtActive[count].value;
        pType = txtpcsTypeText[count].value;
        bOn = txtbasedon[count].value;
        minWt = txtMinPicWt[count].value;
        maxWt = txtMaxPicWt[count].value;
        minWt = eval(minWt == '' ? 0 : minWt);
        maxWt = eval(maxWt == '' ? 0 : maxWt);
        tp = txtType[count].value;
        tm = txtTime[count].value;
        act = txtActive[count].value;
        //$('#tblBayLoadingTypeTrans_rowOrder').val().split(',')[count]
        if (seen[txt]) {
            showValidationMsg(ID, 1)
            //ShowMessage('warning', 'Need your Kind Attention!', 'Please do not enter duplicate value.');
            //$('#' + ID).val('');
            //if (ID.split('_')[1].toUpperCase() == 'PCSTYPE')
            //    $('#tblBayLoadingTypeTrans_HdnPcsType_' + +ID.split('_')[2]).val('');
            return false;
        }
        else if (eval($('#tblBayLoadingTypeTrans_rowOrder').val().split(',')[count]) != eval(ID.split('_')[2]) && ((currMinWt >= minWt && currMinWt <= maxWt) || (currMaxWt >= minWt && currMaxWt <= maxWt) || (currMinWt < minWt && currMaxWt > maxWt)) && $('#tblBayLoadingTypeTrans_PcsType_' + ID.split('_')[2]).val().toUpperCase() == 'LOOSE' && txtpcsTypeText[count].value.toUpperCase() == 'LOOSE' && $('#tblBayLoadingTypeTrans_BasedOn_' + ID.split('_')[2]).val().toUpperCase() == txtbasedon[count].value.toUpperCase() && $('#tblBayLoadingTypeTrans_IsLoading_' + ID.split('_')[2]).val().toUpperCase() == txtType[count].value.toUpperCase()) {
            showValidationMsg(ID, 1)
            //ShowMessage('warning', 'Need your Kind Attention!', 'Please do not enter duplicate value.');
            //$('#' + ID).val('');
            return false;
        }
        else if (currMinWt > currMaxWt && $('#tblBayLoadingTypeTrans_PcsType_' + ID.split('_')[2]).val().toUpperCase() == 'LOOSE' && $('#tblBayLoadingTypeTrans_MaxPieceWeight_' + ID.split('_')[2]).val() != '' && $('#tblBayLoadingTypeTrans_BasedOn_' + ID.split('_')[2]).val().toUpperCase() == txtbasedon[count].value.toUpperCase() && $('#tblBayLoadingTypeTrans_IsLoading_' + ID.split('_')[2]).val().toUpperCase() == txtType[count].value.toUpperCase()) {
            showValidationMsg(ID, 2)
            //ShowMessage('warning', 'Need your Kind Attention!', 'Max weight is always greater than Min weight.');
            //$('#' + ID).val('');
            return false;
        }
            //else
            //    msgpkpp = 0;
            //if (seen[txt]) {
            //    msgpkpp = 1;
            //    ShowMessage('warning', 'Need your Kind Attention!', 'Please do not enter duplicate value.');
            //    return false;
            //}
        else {
            seen[txt] = true;
        }

        count++;

    }
    //if (msgpkpp == 1)
    //    ShowMessage('warning', 'Need your Kind Attention!', 'Please do not enter duplicate value.');
    //else if (msgpkpp == 2)
    //    ShowMessage('warning', 'Need your Kind Attention!', 'Max weight is always greater than Min weight.');
    //if (msgpkpp > 0) {
    //    $('#' + ID).val('');
    //    if (ID.split('_')[1].toUpperCase() == 'PCSTYPE')
    //        $('#tblBayLoadingTypeTrans_HdnPcsType_' + +ID.split('_')[2]).val('');
    //}
}

function AirCraftDoorTableGrid() {
    var theDiv = document.getElementById("divAircraftDimensionMatrix");
    theDiv.innerHTML = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Door Information  can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'AirCraftDoor';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,AirCraftSNo,DoorName,UnitType,Height,Width,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Door Information',
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftSNo', type: 'hidden', value: $('#hdnAirCraftSNo').val() },
                { name: 'DoorName', display: 'Door Name', type: 'text', ctrlAttr: { maxlength: 48, controltype: 'alphanumericupper' }, ctrlCss: { width: '150px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'UnitType' : 'strUnitType', display: 'Unit Type', type: 'radiolist', ctrlOptions: { 0: 'INCH', 1: 'CMS' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'Height', display: 'Height', type: 'text', ctrlAttr: { maxlength: 3, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: 'Width', display: 'Width', type: 'text', ctrlAttr: { maxlength: 3, controltype: "number" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() },
               // { name: "Length", type: "hidden", value: 1 }, // by arman date : 18-05-2017  for length which is  given in tabletype (_Aircraftdoor)
            ],
            isPaging: true,
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                // widthsetdoor();
            },
        });

    }
}

// ***************** Created By Laxmikanta(For Adding New Tab FWD/AFT) **********************

function createDimensionField() {
    var divelement, fldElement, lgndElemnet, tableElement, rowElement, colElement1, input, input1;
    var colElement2, colElement3, colElement4;
    var holdtypelist = [{ Key: "0", Text: "MaxFWD" }, { Key: "1", Text: "LongFWD" }, { Key: "2", Text: "MaxAFT" }, { Key: "3", Text: "LongAFT" }]

    divelement = document.createElement('div');
    divelement.id = 'divmatrix';
    fldElement = document.createElement('fieldset')
    fldElement.id = 'fldmatrix';
    lgndElemnet = document.createElement('legend');
    fldElement.appendChild(lgndElemnet);
    //divelement.appendChild(fldElement);
    tableElement = document.createElement('table');
    tableElement.id = 'tblmatrix';
    tableElement.align = "center";
    rowElement = document.createElement('tr');
    colElement1 = document.createElement('td');
    input = document.createElement('input');
    input.type = "text";
    input.name = "Hold Type : ";
    input.id = "lblholdtype";
    input.readOnly = true;
    input.style.width = '50px';
    colElement1.appendChild(input);

    colElement2 = document.createElement('td');
    input = document.createElement('input');
    input.type = "text";
    colElement2
    input.style.width = '50px';
    colElement2.appendChild(input);

    rowElement.appendChild(colElement1);
    rowElement.appendChild(colElement2);
    tableElement.appendChild(rowElement);
    fldElement.appendChild(tableElement);
    divelement.appendChild(fldElement);
    //$('#MainDiv').appendChild(divelement);
    document.body.appendChild(divelement);

}

function AircraftFWD_AFT() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "READ") {
        ShowMessage('info', 'Need your Kind Attention!', "Aircraft Dimension Information  can be Shown in Edit/Update mode only.");
        return;
    }
    else {
        var divelement, fldElement, lgndElemnet, tableElement, rowElement, colElement, input;
        var dbTableName = 'AircraftDimensionMatrix';
        var pageType = getQueryStringValue("FormAction").toUpperCase();
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        //createDimensionField();
        var theDiv = document.getElementById("divAircraftDimensionMatrix");
        //var table = "<table class='appendGrid ui-widget' id='tblAirCraftPassengerCapacity'><thead class='ui-widget-header'><tr><td class='formSection' colspan='6'>Passenger Capacity</td></tr></thead><tbody class='ui-widget-content'><tr>";
        theDiv.innerHTML = "";
        var table = "<table class='appendGrid ui-widget' id='tblAircraftDimensionMatrix'><tr><td class='formSection'>Aircraft Dimension Matrix Information</td></tr><tbody class='ui-widget-content'><tr>";
        table += "<tr><td><table align='center' style='width:60%;'><tr><td class='formlabel'><font color='red'>*</font><label>HoldType :</label></td><td align='left'><input type='hidden' name='HoldType' id='HoldType' value='' /><input type='text' class='' name='Text_HoldType' id='Text_HoldType' style='width:150px; Height:20px;' controltype='autocomplete' value=''></td><td class='formlabel'><label>Unit :</label></td><td align='left'><input type='radio' tabindex='1' data-radioval='Inch' class='' name='Unit' checked='True' id='Inch' value='0'>Inch<input type='radio' tabindex='1' data-radioval='CM' class='' name='Unit' id='CM' value='1'>CM</td><td><input type='button' style='font-size: 10px;' id='btnview' value='View' name='View' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover'></td></tr></table></td></tr>";
        table += "</table>";
        theDiv.innerHTML += table;
        InstantiateControl("divAircraftDimensionMatrix");

        //theDiv.innerHTML = "<tr><td><label>HoldType :</label></td><td><input type='hidden' name='HoldType' id='HoldType' value=''><input type='text' class='' name='Text_HoldType' id='Text_HoldType' tabindex='2' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></td><td><label>Unit :</label></td><td><input type='radio' tabindex='1' data-radioval='Inch' class='' name='Unit' checked='True' id='Inch' value='0'>Inch<input type='radio' tabindex='1' data-radioval='CM' class='' name='Unit' id='CM' value='1'>CM</td><td><input type='button' id='btnview' value='View' name='View'></td></tr>";

        cfi.AutoCompleteByDataSource("HoldType", holdtypelist);

        //$('#tbl' + dbTableName).appendGrid({
        //    tableID: 'tbl' + dbTableName,
        //    contentEditable: pageType != 'View',
        //    isGetRecord: true,
        //    tableColumns: '',
        //    masterTableSNo: $('#hdnAirCraftSNo').val(),
        //    currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        //    servicePath: './Services/Master/AirCraftService.svc',
        //    getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        //    isGetRecord: true,
        //    createUpdateServiceMethod: 'createUpdate' + dbTableName,
        //    deleteServiceMethod: 'delete' + dbTableName,
        //    caption: 'Aircraft Dimension Information',
        //    columns: [
        //        { name: 'SNo', type: 'hidden', value: 0 },
        //        { name: 'AirCraftSNo', type: 'hidden', value: $('#hdnAirCraftSNo').val() },
        //        { name: 'HoldType', display: 'Hold Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true,},//templateColumn: ["ULDName", "ContainerType"],
        //        //{ name: 'ContourType', display: 'Contour Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, tableName: 'vwULDContour', textColumn: 'AbbrCode', keyColumn: 'SNo' },

        //        { name: pageType == 'Edit' ? 'DIMENSIONUNIT' : 'Unit', display: 'Unit', type: 'radiolist', ctrlOptions: { 0: 'Inch', 1: 'CM' }, selectedIndex: 0, onClick: function (evt, rowIndex) { } },
        //        //{ name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
        //        //{ name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() },
        //    ],
        //    columns: [],
        //    isPaging: true,



        //    dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
        //        checkContourValidation();
        //    },

        //    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        //        // widthsetuld();
        //        checkContourValidation();
        //    },
        //});
        //checkContourValidation();
    }
}

$(document).on("click", "#btnview", function () {
    //alert('hi...');
    var recid = $('#hdnAircraftSNo').val();
    var userid = userContext.UserSNo;
    var rowcount, columncount;
    var i = 0;
    var holdtype = $("#Text_HoldType").data("kendoAutoComplete").key();
    var unit = $("input[name='Unit']:checked").val();
    $.ajax({
        url: "./Services/Master/AirCraftService.svc/BindDimensionMatrix?RecordID=" + recid + "&UserSNo= " + userid + "&HoldType= " + holdtype + "&Unit= " + unit, type: "get", async: false, dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MsgTable = jQuery.parseJSON(result);
            var BasicData = MsgTable.Table0;
            var MatrixData = MsgTable.Table1;
            //if (BasicData[0].Result == "Success") {
            if (BasicData[0].Column1 == 22) {
                //alert("Hi");
                // Added by arman ali
                ShowMessage('warning', 'warning - Information', "Record does not Exit..", "bottom-right");
                //rowcount = BasicData[0].ColumnCountDimension;
                //columncount = BasicData[0].RowCountDimension;
            }
            else if (BasicData[0].Column1 == 25) {
                if ($('#tbReadlmatrix').length) {
                    $('#tbReadlmatrix').remove();
                    $('#divReadmatrix').remove();
                    $('#fldReadmatrix').remove();
                }
                // Added by arman ali
                ShowMessage('warning', 'warning - Information', "Dimesion of Record does not Exit..", "bottom-right");
                //end
            }
            else {
                rowcount = BasicData[0].ColumnCountDimension;
                columncount = BasicData[0].RowCountDimension;
                if ($('#tbReadlmatrix').length) {
                    $('#tbReadlmatrix').remove();
                    $('#divReadmatrix').remove();
                    $('#fldReadmatrix').remove();
                    CreateReadMatrix(rowcount, columncount);
                }
                else {
                    CreateReadMatrix(rowcount, columncount);
                }
                //CreateReadMatrix(rowcount, columncount);
                for (var p = 0; p < rowcount; p++) {
                    for (var q = 0; q < columncount; q++) {
                        //$('#txt' + p + q).text(MatrixData);
                        if (q == 0 && p == 0) {
                            $('#txt' + p + q).val("Height");
                        }
                        else {
                            i++;
                            $('#txt' + p + q).val(MatrixData[i].CellValue);
                        }
                    }
                }
            }
            //if (MatrixData.length > 0) {
            //    //rowcount = BasicData[0].ColumnCountDimension;
            //    //columncount = BasicData[0].RowCountDimension;
            //    //CreateReadMatrix(rowcount, columncount);
            //    //for (var p = 0; p < rowcount; p++) {
            //    //    for (var q = 0; q < columncount; q++) {
            //    //        //$('#txt' + p + q).text(MatrixData);
            //    //        if (q == 0 && p == 0) {
            //    //            $('#txt' + p + q).val("Height");
            //    //        }
            //    //        else {
            //    //            i++;
            //    //            $('#txt' + p + q).val(MatrixData[i].CellValue);
            //    //        }
            //    //    }
            //    //}

            //}
        }

    });
});

function CreateReadMatrix(x, y) {
    var divelement, fldElement, lgndElemnet, tableElement, rowElement, colElement;
    //a = document.getElementById($('#Rows'));
    //b = document.getElementById($('#Cols'));

    //if (x == "" || y == "") {
    //    alert("Please Enter Some Numeric Values");
    //}
    //else {
    divelement = document.createElement('div');
    divelement.id = 'divReadmatrix';
    fldElement = document.createElement('fieldset')
    fldElement.id = 'fldReadmatrix';
    lgndElemnet = document.createElement('legend');
    fldElement.appendChild(lgndElemnet);
    //divelement.appendChild(fldElement);
    tableElement = document.createElement('table');
    tableElement.id = 'tbReadlmatrix';
    tableElement.align = "center";
    for (var i = 0; i < x; i++) {
        rowElement = document.createElement('tr');

        for (var j = 0; j < y; j++) {
            colElement = document.createElement('td');
            var input = document.createElement('input');
            input.type = "text";
            input.style.width = '50px';
            input.id = 'txt' + i + j;
            input.readOnly = true;
            colElement.appendChild(input);
            //colElement.appendChild(document.createTextNode(j + 1));
            rowElement.appendChild(colElement);
        }

        tableElement.appendChild(rowElement);
        fldElement.appendChild(tableElement);
        divelement.appendChild(fldElement);
    }

    document.body.appendChild(divelement);
    //}
}

// ***************** End Of Adding New Tab FWD/AFT **********************

function AirCraftULDGrid() {
    var theDiv = document.getElementById("divAircraftDimensionMatrix");
    theDiv.innerHTML = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "ULD Information  can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'AirCraftULD';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,AirCraftSNo,ULDTypeSNo,DeckType,Unit,VolumeWeight,GrossWeight,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'ULD Information',
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftSNo', type: 'hidden', value: $('#hdnAirCraftSNo').val() },
                { name: pageType == 'Edit' ? 'DeckType' : 'strDeckType', display: 'Load Indicator', type: 'radiolist', ctrlOptions: { 0: 'Lower', 1: 'Upper' }, selectedIndex: 0, onClick: function (evt, rowIndex) { checkContourValidation() } },
                { name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'AircraftMaster_ULDTypeSNo', filterField: 'Text_ULD' },//templateColumn: ["ULDName", "ContainerType"],
                { name: 'ContourType', display: 'Contour Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, AutoCompleteName: 'AircraftMaster_ContourType', filterField: 'AbbrCode' },
                { name: 'Unit', display: 'Unit', type: 'text', ctrlAttr: { maxlength: 5, controltype: 'number' }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlAttr: { maxlength: 15, controltype: "decimal2" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: 'GrossWeight', display: 'Gross Weight', type: 'text', ctrlAttr: { maxlength: 15, controltype: "decimal2" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() },
            ],
            isPaging: true,



            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                checkContourValidation();
            },

            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                // widthsetuld();
                checkContourValidation();
            },
        });
        checkContourValidation();
    }
}

function widthsetuld() {
    var RowOrder = $("#tblAirCraftULD").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftULD").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftULD_Unit_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftULD_Unit_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftULD_VolumeWeight_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftULD_VolumeWeight_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftULD_GrossWeight_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftULD_GrossWeight_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetpax() {
    var RowOrder = $("#tblAirCraftInventoryPaxFactor").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftInventoryPaxFactor").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftInventoryPaxFactor_PaxStart_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftInventoryPaxFactor_PaxEnd_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftInventoryPaxFactor_IncreaseFactor_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetdoor() {
    var RowOrder = $("#tblAirCraftDoor").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftDoor").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftDoor_Height_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftDoor_Width_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetsphc() {
    var RowOrder = $("#tblAirCraftSPHC").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftSPHC").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftSPHC_AFT_" + RowOrder[out]).css("width", "150px");
        $("#_temptblAirCraftSPHC_FWD_" + RowOrder[out]).css("width", "150px");
    }
};

function checkContourValidation() {

    $("#tblAirCraftULD").find("input[id^='tblAirCraftULD_ContourType']").each(function () {

        $('[id^="tblAirCraftULD_RbtnDeckType_"][value="0"]').is(':checked')
        if ($("input[name='tblAirCraftULD_RbtnDeckType_" + this.id.split('_')[2] + "']:checked").val() == 1) {
            $("#tblAirCraftULD_ContourType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(true);
        }
        else {
            $("#tblAirCraftULD_ContourType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(false);
            $("#tblAirCraftULD_ContourType_" + this.id.split('_')[2]).val('');
            $("#tblAirCraftULD_HdnContourType_" + this.id.split('_')[2]).val('');
        }
    });
    widthsetuld();
}

function StartEnd(a) {
    //if (eval($('#AirCraftInventoryPaxFactorPaxStart').val()) > eval($('#AirCraftInventoryPaxFactorPaxEnd').val())) {
    if (eval($('#AirCraftInventoryPaxFactorPaxEnd').val()) > eval($('#AirCraftInventoryPaxFactorPaxStart').val())) {
        ShowMessage('info', 'Need your Kind Attention!', "Occupied Pax Load must be less than Total Pax Load.");
        //alert('Occupied Pax Load must be less than Total Pax Load.');
        //$("#" + "AirCraftInventoryPaxFactorPaxEnd").focus();
        //document.getElementById('AirCraftInventoryPaxFactorPaxEnd').focus();
        //$('#AirCraftInventoryPaxFactorPaxEnd').attr('focus', true);
        //$("#AirCraftInventoryPaxFactorPaxEnd").focus();
        return false;
    }
    else {
        return true;
    }
}

function checkRange(rowNo) {
    var dbTableName = 'AirCraftInventoryPaxFactor';
    //if (eval($(rowNo > 0 ? '#tbl' + dbTableName + '_PaxStart_' + rowNo : '#PaxStart').val()) > eval($(rowNo > 0 ? '#tbl' + dbTableName + '_PaxEnd_' + rowNo : '#PaxEnd').val())) {
    if (eval($(rowNo > 0 ? '#tbl' + dbTableName + '_PaxEnd_' + rowNo : '#PaxEnd').val()) > eval($(rowNo > 0 ? '#tbl' + dbTableName + '_PaxStart_' + rowNo : '#PaxStart').val())) {
        $(rowNo > 0 ? '#tbl' + dbTableName + '_PaxEnd_' + rowNo : '#PaxEnd').val('');
        ShowMessage('info', 'Need your Kind Attention!', "Occupied Pax Load must be less than Total Pax Load.");
        //alert('Occupied Pax Load must be less than Total Pax Load.');
        $(rowNo > 0 ? '#tbl' + dbTableName + '_PaxEnd_' + rowNo : '#PaxEnd').css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        return false;
    }
    else {
        $(rowNo > 0 ? '#tbl' + dbTableName + '_PaxEnd_' + rowNo : '#PaxEnd').css({
            "border": "",
            "background": ""
        });
        return true;
    }
}

function ExtraCondition(textId) {
    var dbTableName = 'AirCraftInventoryPaxFactor';
    var f = cfi.getFilter("AND");
    var AirlineSNoFilter = cfi.getFilter("AND");
    if ($('#tbl' + dbTableName).appendGrid('getRowCount') > 0 && textId.split('_').length == 3) {
        if (textId.split('_')[2] > 0 && textId.split('_')[0] == 'tblAirCraftInventoryPaxFactor') {
            cfi.setFilter(f, "AirCraftSNo", "eq", $('#hdnAirCraftSNo').val());
            cfi.setFilter(f, "IsActive", "eq", 1)
        }
    }
    var y = textId.split('_')[2];
    if (textId == "tblAirCraftULD_ULDTypeSNo_" + y) {
        cfi.setFilter(f, "AirlineSNo", "eq", $("#AirlineSNo").val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(f);
        return RegionAutoCompleteFilter;
    }
    $('input[name*=tblAirCraftInventoryPaxFactor_AirCraftInventorySNo]').each(function () {
        cfi.setFilter(f, "SNo", "notin", $("input:hidden[id^='" + this.id.split('_')[0] + "_Hdn" + this.id.split('_')[1] + "_" + this.id.split('_')[2] + "']").val());
    });

    //$('input[name*=tblAirCraftSPHC_SPHCSNo]').each(function () {
    //    cfi.setFilter(f, "SNo", "notin", $("input:hidden[id^='" + this.id.split('_')[0] + "_Hdn" + this.id.split('_')[1] + "_" + this.id.split('_')[2] + "']").val());
    //});
    //return cfi.autoCompleteFilter([f]);

    //$ (textId.split('_')[0] == "tblAirCraftSPHC_SPHCSNo")
    //     return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#tblAirCraftSPHC_SPHCSNo_" + id.split('_')[2]).val()), filter = cfi.autoCompleteFilter(textId);  

    if (textId.indexOf("tblAirCraftSPHC_SPHCSNo") >= 0) {
        var noOfRows = $('#tblAirCraftSPHC_rowOrder').val();
        for (var i = 0; i <= noOfRows.split(',').length; i++) {

            if ($('#tblAirCraftSPHC_HdnSPHCSNo_' + noOfRows.split(',')[i]).val() != undefined &&
                $('#tblAirCraftSPHC_HdnSPHCSNo_' + noOfRows.split(',')[i]).val() != '' &&
                'tblAirCraftSPHC_HdnSPHCSNo_' + noOfRows.split(',')[i] != 'tblAirCraftSPHC_HdnSPHCSNo_' + textId.split('_')[2])
                cfi.setFilter(f, "SNo", "notin", $('#tblAirCraftSPHC_HdnSPHCSNo_' + noOfRows.split(',')[i]).val());
        }
        var SPHCAutoCompleteFilter = cfi.autoCompleteFilter(f);
        return SPHCAutoCompleteFilter;
    }

    else if (textId.indexOf("tblAirCraftInventoryPaxFactor_AirCraftInventorySNo") >= 0) {
        var noOfRows = $('#tblAirCraftInventoryPaxFactor_rowOrder').val();
        for (var i = 0; i <= noOfRows.split(',').length; i++) {

            if ($('#tblAirCraftInventoryPaxFactor_HdnAirCraftInventorySNo_' + noOfRows.split(',')[i]).val() != undefined &&
                $('#tblAirCraftInventoryPaxFactor_HdnAirCraftInventorySNo_' + noOfRows.split(',')[i]).val() != '' &&
                'tblAirCraftInventoryPaxFactor_HdnAirCraftInventorySNo_' + noOfRows.split(',')[i] != 'tblAirCraftInventoryPaxFactor_HdnAirCraftInventorySNo_' + textId.split('_')[2])
                cfi.setFilter(f, "SNo", "notin", $('#tblAirCraftInventoryPaxFactor_HdnAirCraftInventorySNo_' + noOfRows.split(',')[i]).val());
        }
        var SPHCAutoCompleteFilter = cfi.autoCompleteFilter(f);
        return SPHCAutoCompleteFilter;
    }
    else if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter = cfi.getFilter("AND");
        //cfi.setFilter(filter, "IsInterline", "eq", "0");
        cfi.setFilter(filter, "IsActive", "eq", "1");
        AirlineSNoFilter = cfi.autoCompleteFilter(filter);
        return AirlineSNoFilter;
    }

    else if(textId.indexOf('tblAircraftSectorWiseCapacity_Origin_')>=0)
    {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace('_Origin_', '_HdnDestination_')).val());
        cfi.setFilter(f, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(f);
        return RegionAutoCompleteFilter;
    }
    else if (textId.indexOf('tblAircraftSectorWiseCapacity_Destination_') >= 0)
    {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace('_Destination_', '_HdnOrigin_')).val());
        cfi.setFilter(f, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(f);
        return RegionAutoCompleteFilter;
    }
}

function AirCraftPassengerCapacity() {
    var theDiv = document.getElementById("divAircraftDimensionMatrix");
    theDiv.innerHTML = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Passenger Capacity Information  can be added in Edit/Update mode only.");
        return;
    }
    else {
        BindPassengerCapacity();
    }
}

function BindPassengerCapacity() {
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var AirCraftSNo = $('#hdnAirCraftSNo').val();
    $.ajax({
        url: "./Services/Master/AirCraftService.svc/BindPassengerCapacity",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AirCraftSNo: AirCraftSNo },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData = jQuery.parseJSON(result);
            var PassengerCapacity = "";
            var BaggageWeight = "";
            var AdultMale = "";
            var AdultFemale = "";
            var Child = "";
            var Infant = "";
            var NoofBaggageImperial = "";
            var NoofBaggageBusiness = "";
            var NoofBaggagePremiumEconomy = "";
            var NoofBaggageTouristEconomy = "";
            var NoofBaggageTotal = "";
            var NoofBaggageAllowanceImperial = "";
            var NoofBaggageAllowanceBusiness = "";
            var NoofBaggageAllowancePremiumEconomy = "";
            var NoofBaggageAllowanceTouristEconomy = "";
            var NoofBaggageAllowanceTotal = "";
            if (myData.Table0.length > 0) {
                PassengerCapacity = myData.Table0[0].PassengerCapacity;
                BaggageWeight = myData.Table0[0].BaggageWeight;
                AdultMale = myData.Table0[0].AdultMale;
                AdultFemale = myData.Table0[0].AdultFemale;
                Child = myData.Table0[0].Child;
                Infant = myData.Table0[0].Infant;
                NoofBaggageImperial = myData.Table0[0].BaggageImperial;
                NoofBaggageBusiness = myData.Table0[0].BaggageBusiness;
                NoofBaggagePremiumEconomy = myData.Table0[0].BaggagePremium;
                NoofBaggageTouristEconomy = myData.Table0[0].BaggageTourist;
                NoofBaggageTotal = myData.Table0[0].BaggageTotal;
                NoofBaggageAllowanceImperial = myData.Table0[0].BaggageAllowanceImperial;
                NoofBaggageAllowanceBusiness = myData.Table0[0].BaggageAllowanceBusiness;
                NoofBaggageAllowancePremiumEconomy = myData.Table0[0].BaggageAllowancePremium;
                NoofBaggageAllowanceTouristEconomy = myData.Table0[0].BaggageAllowanceTourist;
                NoofBaggageAllowanceTotal = myData.Table0[0].BaggageAllowanceTotal;
            }
            var theDiv = document.getElementById("divAirCraftPassengerCapacity");

            theDiv.innerHTML = "";
            var table = "<table class='appendGrid ui-widget' id='tblAirCraftPassengerCapacity'><thead class='ui-widget-header'><tr><td class='formSection' colspan='6'>Passenger Capacity</td></tr></thead><tbody class='ui-widget-content'><tr>";
            if (pageType != 'READ') {
                table += "<td title='Enter Passenger Capacity' class='formthreelabel'><span id='spnPassengerCapacity'>Passenger Capacity</span></td><td class='formthreeInputcolumn'><input name='PassengerCapacity' tabindex='9' class='k-input k-state-default' id='PassengerCapacity' style='width: 90px; display: none;' type='text' maxlength='3' placeholder='' value='" + PassengerCapacity + "' data-role='numerictextbox' data-valid-msg='Enter valid Declared Customs Value' data-valid='required' controltype='number' allowchar='0123456789'>";
                table += "<td title='Enter Baggage Weight (Full flight)' class='formthreelabel'><span id='spnBaggageWeight'>Baggage Weight (Full flight)</span></td><td class='formthreeInputcolumn'><input name='BaggageWeight' tabindex='9' class='k-input k-state-default' id='BaggageWeight' style='width: 90px; display: none;' type='text' maxlength='10' placeholder='' value='" + BaggageWeight + "' data-role='numerictextbox' data-valid-msg='Enter valid Declared Customs Value' data-valid='required' controltype='decimal2' allowchar='NO'>";
                table += "<td title='Enter Adult Male' class='formthreelabel'><span id='spnAdultMale'>Adult Male</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='AdultMale' id='AdultMale' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Adult Male.' value='" + AdultMale + "'></td></tr>";
                table += "<tr><td title='Enter Adult Female' class='formthreelabel'><span id='spnAdultFemale'>Adult Female</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='AdultFemale' id='AdultFemale' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3'  data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Adult Female.' value='" + AdultFemale + "'></td><td title='Enter Child' class='formthreelabel'><span id='spnChild'>Child</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='Child' id='Child' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Child.' value='" + Child + "'></td><td title='Enter Infant' class='formthreelabel'><span id='spnInfant'>Infant</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='Infant' id='Infant' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Infant.' value='" + Infant + "'></td></tr>";
                table += "<tr><td class='formthreelabel'></td><td title='Imperial (F)' class='formthreelabel'><span id='spnImperial'>Imperial (F)</span></td><td title='Business (B)' class='formthreelabel'><span id='spnBusiness'>Business (B)</span></td><td title='Premium Economy (Y)' class='formthreelabel'><span id='spnPremiumEconomy'>Premium Economy (Y)</span></td><td title='Tourist Economy (L)' class='formthreelabel'><span id='spnTouristEconomy'>Tourist Economy (L)</span></td><td title='Total' class='formthreelabel'><span id='spnTotal'>Total</span></td></tr>";
                table += "<tr><td title='No of Baggage' class='formthreelabel'><span id='spnNoofBaggage'>No of Baggage</span></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageImperial' id='NoofBaggageImperial' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Imperial.'' value='" + NoofBaggageImperial + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageBusiness' id='NoofBaggageBusiness' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Business.'' value='" + NoofBaggageBusiness + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggagePremiumEconomy' id='NoofBaggagePremiumEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Premium Economy.'' value='" + NoofBaggagePremiumEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageTouristEconomy' id='NoofBaggageTouristEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Tourist Economy.'' value='" + NoofBaggageTouristEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageTotal' id='NoofBaggageTotal' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Total.'' value='" + NoofBaggageTotal + "'></td></tr>";
                table += "<tr><td title='Baggage Allowance (Per Passenger)' class='formthreelabel'><span id='spnBaggageAllowance'>Baggage Allowance (Per Passenger)</span></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceImperial' id='NoofBaggageAllowanceImperial' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Imperial Baggage Allowance.'' value='" + NoofBaggageAllowanceImperial + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceBusiness' id='NoofBaggageAllowanceBusiness' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Baggage Allowance.'' value='" + NoofBaggageAllowanceBusiness + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowancePremiumEconomy' id='NoofBaggageAllowancePremiumEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Premium Economy.'' value='" + NoofBaggageAllowancePremiumEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceTouristEconomy' id='NoofBaggageAllowanceTouristEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Tourist Economy.'' value='" + NoofBaggageAllowanceTouristEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceTotal' id='NoofBaggageAllowanceTotal' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Total.'' value='" + NoofBaggageAllowanceTotal + "'></td></tr>";
                table += "<tfoot><tr><td colspan='6' class='ui-widget-header'><button aria-disabled='false' role='button' title='Transfer' type='button' id='btnTransfer' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='UpdatePassengerCapacity();'><span class='ui-button-text'>Update</span></button></td></tr></tfoot>";
            }
            else {
                table += "<td title='Enter Passenger Capacity' class='formthreelabel'><span id='spnPassengerCapacity'>Passenger Capacity</span></td><td class='formthreeInputcolumn'><span>" + PassengerCapacity + "</span>";
                table += "<td title='Enter Baggage Weight (Full flight)' class='formthreelabel'><span id='spnBaggageWeight'>Baggage Weight (Full flight)</span></td><td class='formthreeInputcolumn'><span>" + BaggageWeight + "</span>";
                table += "<td title='Enter Adult Male' class='formthreelabel'><span id='spnAdultMale'>Adult Male</span></td><td class='formthreeInputcolumn'><span>" + AdultMale + "</span></td></tr>";
                table += "<tr><td title='Enter Adult Female' class='formthreelabel'><span id='spnAdultFemale'>Adult Female</span></td><td class='formthreeInputcolumn'><span>" + AdultFemale + "</span></td><td title='Enter Child' class='formthreelabel'><span id='spnChild'>Child</span></td><td class='formthreeInputcolumn'><span>" + Child + "</span></td><td title='Enter Infant' class='formthreelabel'><span id='spnInfant'>Infant</span></td><td class='formthreeInputcolumn'><span>" + Infant + "</span></td></tr>";
                table += "<tr><td class='formthreelabel'></td><td title='Imperial (F)' class='formthreelabel'><span id='spnImperial'>Imperial (F)</span></td><td title='Business (B)' class='formthreelabel'><span id='spnBusiness'>Business (B)</span></td><td title='Premium Economy (Y)' class='formthreelabel'><span id='spnPremiumEconomy'>Premium Economy (Y)</span></td><td title='Tourist Economy (L)' class='formthreelabel'><span id='spnTouristEconomy'>Tourist Economy (L)</span></td><td title='Total' class='formthreelabel'><span id='spnTotal'>Total</span></td></tr>";
                table += "<tr><td title='No of Baggage' class='formthreelabel'><span id='spnNoofBaggage'>No of Baggage</span></td><td class='formthreelabel'><span>" + NoofBaggageImperial + "</span></td><td class='formthreelabel'><span>" + NoofBaggageBusiness + "</span></td><td class='formthreelabel'><span>" + NoofBaggagePremiumEconomy + "</span></td><td class='formthreelabel'><span>" + NoofBaggageTouristEconomy + "</span></td><td class='formthreelabel'><span>" + NoofBaggageTotal + "</span></td></tr>";
                table += "<tr><td title='Baggage Allowance (Per Passenger)' class='formthreelabel'><span id='spnBaggageAllowance'>Baggage Allowance (Per Passenger)</span></td><td class='formthreelabel'><span>" + NoofBaggageAllowanceImperial + "</span></td><td class='formthreelabel'><span>" + NoofBaggageAllowanceBusiness + "</span></td><td class='formthreelabel'><span>" + NoofBaggageAllowancePremiumEconomy + "</span></td><td class='formthreelabel'><span>" + NoofBaggageAllowanceTouristEconomy + "</span></td><td class='formthreelabel'><span>" + NoofBaggageAllowanceTotal + "</span></td></tr>";
            }
            table += "</table>";
            theDiv.innerHTML += table;
            InstantiateControl("divAirCraftPassengerCapacity");
            $("#_tempAdultMale").attr('tabindex', '11');

        },
        error: function (xhr) {
            var a = "";
        }
    });

}

function UpdatePassengerCapacity() {
    if (cfi.IsValidSubmitSection()) {
        $.ajax({
            url: "./Services/Master/AirCraftService.svc/UpdatePassengerCapacity",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AirCraftSNo: $('#hdnAirCraftSNo').val(),
                PassengerCapacity: $('#PassengerCapacity').val() == "" ? "0" : $('#PassengerCapacity').val(),
                BaggageWeight: $('#BaggageWeight').val() == "" ? "0" : $('#BaggageWeight').val(),
                AdultMale: $('#AdultMale').val() == "" ? "0" : $('#AdultMale').val(),
                AdultFemale: $('#AdultFemale').val() == "" ? "0" : $('#AdultFemale').val(),
                Child: $("#Child").val() == "" ? "0" : $('#Child').val(),
                Infant: $("#Infant").val() == "" ? "0" : $('#Infant').val(),
                NoofBaggageImperial: $("#NoofBaggageImperial").val() == "" ? "0" : $('#NoofBaggageImperial').val(),
                NoofBaggageBusiness: $("#NoofBaggageBusiness").val() == "" ? "0" : $('#NoofBaggageBusiness').val(),
                NoofBaggagePremiumEconomy: $("#NoofBaggagePremiumEconomy").val() == "" ? "0" : $('#NoofBaggagePremiumEconomy').val(),
                NoofBaggageTouristEconomy: $("#NoofBaggageTouristEconomy").val() == "" ? "0" : $('#NoofBaggageTouristEconomy').val(),
                NoofBaggageTotal: $("#NoofBaggageTotal").val() == "" ? "0" : $('#NoofBaggageTotal').val(),
                NoofBaggageAllowanceImperial: $("#NoofBaggageAllowanceImperial").val() == "" ? "0" : $('#NoofBaggageAllowanceImperial').val(),
                NoofBaggageAllowanceBusiness: $("#NoofBaggageAllowanceBusiness").val() == "" ? "0" : $('#NoofBaggageAllowanceBusiness').val(),
                NoofBaggageAllowancePremiumEconomy: $("#NoofBaggageAllowancePremiumEconomy").val() == "" ? "0" : $('#NoofBaggageAllowancePremiumEconomy').val(),
                NoofBaggageAllowanceTouristEconomy: $("#NoofBaggageAllowanceTouristEconomy").val() == "" ? "0" : $('#NoofBaggageAllowanceTouristEconomy').val(),
                NoofBaggageAllowanceTotal: $("#NoofBaggageAllowanceTotal").val() == "" ? "0" : $('#NoofBaggageAllowanceTotal').val(),
                CreatedBy: $('#hdnCreatedBy').val(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0[0].Column1 == "2000") {
                        ShowMessage('success', 'Success - Passenger Capacity', "Passenger Capacity Added Successfully.", "bottom-right");
                        return false;
                    }
                    else if (myData.Table0[0].Column1 == "2001") {
                        ShowMessage('success', 'Success - Passenger Capacity', "Passenger Capacity Updated Successfully.", "bottom-right");
                        return false;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Passenger Capacity', "Need your kind attention.  Please contact the website administrator.", "bottom-right");
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
}

function InstantiateControl(containerId) {

    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
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
                }
            }
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
            //StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            //StopProgress();

            //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

            //    AuditLogSaveNewValue("divbody");
            //}
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

}


$('#GrossWeight').blur(function () {
    if (parseFloat($("#GrossWeight").val()||0) < 1) {
        ShowMessage('warning', 'Need your Kind Attention!', "Gross Weight Cannot be Zero.");
        $("#GrossWeight").val("");
        $("#_tempGrossWeight").val("");
    }
    else if (parseFloat($('#StructuralCapacity').val()||0) < parseFloat($("#GrossWeight").val()||0))
    {
        ShowMessage('warning', 'Need your Kind Attention!', "Gross Weight should not be greater than Structural Capacity.");
        $("#GrossWeight").val("");
        $("#_tempGrossWeight").val("");
    }
    if (parseFloat($('#GrossWeight').val()||0) < parseFloat($("#MaxGrossWtPiece").val()||0)) {
        ShowMessage('warning', 'Need your Kind Attention!', "Max Weight per piece should not greater than Gross Weight.");
        $("#MaxGrossWtPiece").val("");
        $("#_tempMaxGrossWtPiece").val("");
    }
});

$('#VolumeWeight').blur(function () {
    if (parseFloat($("#VolumeWeight").val()||0) < 1) {
        ShowMessage('warning', 'Need your Kind Attention!', "Volume Cannot be Zero.");
        $("#VolumeWeight").val("");
        $("#_tempVolumeWeight").val("");
    }
    else if (parseFloat($('#StructuralCapacity').val()||0) < parseFloat($("#VolumeWeight").val()||0)*166.66) {
        ShowMessage('warning', 'Need your Kind Attention!', "Volume should not be greater than Structural Capacity.");
        $("#VolumeWeight").val("");
        $("#_tempVolumeWeight").val("");
    }
    if (parseFloat($('#VolumeWeight').val() || 0) < parseFloat($("#MaxVolumePiece").val() || 0)) {
        ShowMessage('warning', 'Need your Kind Attention!', "Max Volume per piece  should not greater than Volume.");
        $("#MaxVolumePiece").val("");
        $("#_tempMaxVolumePiece").val("");
    }
});

$('#MaxGrossWtPiece').blur(function () {

    if (parseFloat($("#MaxGrossWtPiece").val()||0) < 1) {
        ShowMessage('warning', 'Need your Kind Attention!', "Maximum Gr Wt per piece should be greater than 0");
        $("#MaxGrossWtPiece").val("");
        $("#_tempMaxGrossWtPiece").val("");
    }
    else if (parseFloat($('#GrossWeight').val()||0) < parseFloat($("#MaxGrossWtPiece").val()||0)) {
        ShowMessage('warning', 'Need your Kind Attention!', "Max Weight should not greater than Gross Weight.");
        $("#MaxGrossWtPiece").val("");
        $("#_tempMaxGrossWtPiece").val("");
    }
});

$('#MaxVolumePiece').blur(function () {

    if (parseFloat($("#MaxVolumePiece").val()||0) < 0.001) {
        ShowMessage('warning', 'Need your Kind Attention!', "Maximum Volume per piece should be greater than or equals to 0.001");
        $("#MaxVolumePiece").val("");
        $("#_tempMaxVolumePiece").val("");
    }
    else if (parseFloat($('#VolumeWeight').val() || 0) < parseFloat($("#MaxVolumePiece").val() || 0)) {
        ShowMessage('warning', 'Need your Kind Attention!', "Max Volume should not greater than Volume.");
        $("#MaxVolumePiece").val("");
        $("#_tempMaxVolumePiece").val("");
    }
});

$('#StructuralCapacity').blur(function () {
    if (parseFloat($("#StructuralCapacity").val()||0) < 1) {
        ShowMessage('warning', 'Need your Kind Attention!', "Structural Capacity Cannot be Zero.");
        $("#StructuralCapacity").val("");
        $("#_tempStructuralCapacity").val("");
        $("#GrossWeight").val("");
        $("#_tempGrossWeight").val("");
        $("#VolumeWeight").val("");
        $("#_tempVolumeWeight").val("");
    }
    if (parseFloat($('#StructuralCapacity').val()||0) < parseFloat($("#GrossWeight").val()||0)) {
        ShowMessage('warning', 'Need your Kind Attention!', "Gross Weight should not be greater than Structural Capacity.");
        $("#GrossWeight").val("");
        $("#_tempGrossWeight").val("");
    }

    if (parseFloat($('#StructuralCapacity').val() || 0) < parseFloat($("#VolumeWeight").val() || 0) * 166.66) {
            ShowMessage('warning', 'Need your Kind Attention!', "Volume should not be greater than Structural Capacity.");
            $("#VolumeWeight").val("");
            $("#_tempVolumeWeight").val("");
        }
});

function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}


function AircraftSectorWiseCapacity() {
    var theDiv = document.getElementById("divAircraftSectorWiseCapacity");
    theDiv.innerHTML = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Aircraft Sector Wise Capacity can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'AircraftSectorWiseCapacity';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,AirCraftSNo,Origin,Destination,StructuralCapacity,GrossUnit,GrossWeight,VolumeUnit,Volume,MaxGrossWeightPerPiece,MaxVolumePerPiece,IsActive',
            masterTableSNo: $('#hdnAirCraftSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Aircraft Sector Wise Capacity',
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftSNo', type: 'hidden', value: $('#hdnAirCraftSNo').val() },
                        { name: 'Origin', display: 'Origin', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'AirCraftSectorWise_OriginDest', filterField: 'AirportCode,AirportName', filterCriteria: "contains" },
                    { name: 'Destination', display: 'Destination', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'AirCraftSectorWise_OriginDest', filterField: 'AirportCode,AirportName', filterCriteria: "contains" },
                { name: 'StructuralCapacity', display: 'Structural Capacity', type: 'text', ctrlAttr: { maxlength: 18, controltype: "number", onblur: "return CheckValue(this.id);" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'GrossWeightUnit' : 'Text_GrossWeightUnit', display: 'Gross Unit', type: 'radiolist', ctrlOptions: { 0: 'KG ', 1: 'LBS' }, selectedIndex: 0, isRequired: true },
                { name: 'GrossWeight', display: 'Gross Weight', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal3", onblur: "return CheckValue(this.id);" }, ctrlCss: { width: '100px' }, isRequired: true },
                //{ name: pageType == 'Edit' ? '' : 'Text_VolumeWeightUnit', display: 'Volume Unit', type: 'radiolist', ctrlOptions: { 2: 'CBM' }, selectedIndex: 0, isRequired: true },
                { name: 'VolumeWeight', display: ' Volume (cbm)', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal3", onblur: "return CheckValue(this.id);" }, ctrlCss: { width: '100px' }, isRequired: true },

                  { name: 'MaxGrossWtPiece', display: ' Max Gross Weight Per Piece	', type: 'text', ctrlAttr: { maxlength: 18, controltype: "number", onblur: "return CheckValue(this.id);" }, ctrlCss: { width: '100px' }, isRequired: true },

                    { name: 'MaxVolumePerPiece', display: ' Max Volume Per Piece', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal3", onblur: "return CheckValue(this.id);" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: pageType == 'Edit' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                // widthsetdoor();
            },
        });

    }
}


function CheckValue(obj) {
    var Value = $('#' + obj).val();
    if (Value <= 0) {
        $('#' + obj).val('');
        $('#_temp' + obj).val('');
        ShowMessage('info', 'Need your Kind Attention!', "Value should be greater than Zero ");
        return true;
    }

    else if(obj.indexOf('_StructuralCapacity_') > 0)
    {
            
        if (parseFloat($('#StructuralCapacity').val() || 0) < parseFloat(Value || 0))
        {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            $('#' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val('');
            $('#_temp' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val('');
            $('#' + obj.replace('_StructuralCapacity_', '_MaxGrossWtPiece_')).val('');
            $('#_temp' + obj.replace('_StructuralCapacity_', '_MaxGrossWtPiece_')).val('');
            $('#' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val('');
            $('#_temp' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val('');
            $('#' + obj.replace('_StructuralCapacity_', '_MaxVolumePerPiece_')).val('');
            $('#_temp' + obj.replace('_StructuralCapacity_', '_MaxVolumePerPiece_')).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Structural Capacity should not be greater than Defined Structural Capacity");
    }
    else if (parseFloat($('#' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val() || 0) > parseFloat(Value || 0) && parseFloat(($('#' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val() || 0) * 166.66) > parseFloat(Value || 0)) {

        $('#' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val('');
        $('#' + obj.replace('_StructuralCapacity_', '_MaxGrossWtPiece_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_MaxGrossWtPiece_')).val('');
        $('#' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val('');
        $('#' + obj.replace('_StructuralCapacity_', '_MaxVolumePerPiece_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_MaxVolumePerPiece_')).val('');
        ShowMessage('info', 'Need your Kind Attention!', "Gross Weight and Volume(CBM) should not be greater than Structural Capacity");
    }
    else if ( parseFloat($('#' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val() || 0) > parseFloat(Value || 0)) {

        $('#' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_GrossWeight_')).val('');
        $('#' + obj.replace('_StructuralCapacity_', '_MaxGrossWtPiece_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_MaxGrossWtPiece_')).val('');
        ShowMessage('info', 'Need your Kind Attention!', "Gross Weight should not be greater than Structural Capacity");
    }
    else if ( parseFloat(($('#' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val() || 0) * 166.66) > parseFloat(Value || 0)) {
        $('#' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_VolumeWeight_')).val('');
        $('#' + obj.replace('_StructuralCapacity_', '_MaxVolumePerPiece_')).val('');
        $('#_temp' + obj.replace('_StructuralCapacity_', '_MaxVolumePerPiece_')).val('');
        ShowMessage('info', 'Need your Kind Attention!', "Volume(CBM) should not be greater than Structural Capacity");
    }
    }
    else if (obj.indexOf('_GrossWeight_') > 0)
    {
        if (($('#' + obj.replace('_GrossWeight_', '_StructuralCapacity_')).val() || 0)<=0)
        {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            $('#' + obj.replace('_GrossWeight_', '_MaxGrossWtPiece_')).val('');
            $('#_temp' + obj.replace('_GrossWeight_', '_MaxGrossWtPiece_')).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Structural Capacity should be greater than zero.");
        }
       else if (parseFloat($('#' + obj.replace('_GrossWeight_', '_StructuralCapacity_')).val() || 0) < parseFloat(Value || 0)) {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            $('#' + obj.replace('_GrossWeight_', '_MaxGrossWtPiece_')).val('');
            $('#_temp' + obj.replace('_GrossWeight_', '_MaxGrossWtPiece_')).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Gross Weight should not be greater than Structural Capacity");
        }

       else if (parseFloat($('#' + obj.replace('_GrossWeight_', '_MaxGrossWtPiece_')).val() || 0) > parseFloat(Value || 0)) {
           $('#' + obj.replace('_GrossWeight_', '_MaxGrossWtPiece_')).val('');
           $('#_temp' + obj.replace('_GrossWeight_', '_MaxGrossWtPiece_')).val('');
           ShowMessage('info', 'Need your Kind Attention!', "Max Gross Per Piece should not be greater than Gross Weight");
       }
    }

    else if (obj.indexOf('_VolumeWeight_') > 0) {
        if (($('#' + obj.replace('_VolumeWeight_', '_StructuralCapacity_')).val() || 0) <= 0)
        {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            $('#' + obj.replace('_VolumeWeight_', '_MaxVolumePerPiece_')).val('');
            $('#_temp' + obj.replace('_VolumeWeight_', '_MaxVolumePerPiece_')).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Structural Capacity should be greater than zero.");
        }

        else if (parseFloat(($('#' + obj.replace('_VolumeWeight_', '_StructuralCapacity_')).val() || 0)) < parseFloat(Value || 0) * 166.66) {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            $('#' + obj.replace('_VolumeWeight_', '_MaxVolumePerPiece_')).val('');
            $('#_temp' + obj.replace('_VolumeWeight_', '_MaxVolumePerPiece_')).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Volume(CBM) should not be greater than Structural Capacity");
        }

        else if (parseFloat($('#' + obj.replace('_VolumeWeight_', '_MaxVolumePerPiece_')).val() || 0) > parseFloat(Value || 0)) {
            $('#' + obj.replace('_VolumeWeight_', '_MaxGrossWtPiece_')).val('');
            $('#_temp' + obj.replace('_VolumeWeight_', '_MaxGrossWtPiece_')).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Max Volume Per Piece should not be greater than Volume(CBM)");
        }
    }

    else if (obj.indexOf('_MaxGrossWtPiece_') > 0)
    {
        if (($('#' + obj.replace('_MaxGrossWtPiece_', '_StructuralCapacity_')).val() || 0) <= 0) {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Structural Capacity should be greater than zero.");
        }
        else if (($('#' + obj.replace('_MaxGrossWtPiece_', '_GrossWeight_')).val() || 0) <= 0) {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Gross Weight should be greater than zero.");
        }
    
     else if ( parseFloat($('#' + obj.replace('_MaxGrossWtPiece_', '_GrossWeight_')).val() || 0) < parseFloat(Value || 0)) {
        $('#' + obj).val('');
        $('#_temp' + obj).val('');
        ShowMessage('info', 'Need your Kind Attention!', "Max Gross Per Piece should not be greater than Gross Weight");
        }
    }

    else if (obj.indexOf('_MaxVolumePerPiece_') > 0) {
        if (($('#' + obj.replace('_MaxVolumePerPiece_', '_StructuralCapacity_')).val() || 0) <= 0) {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Structural Capacity should be greater than zero.");
        }
        else if (($('#' + obj.replace('_MaxVolumePerPiece_', '_VolumeWeight_')).val() || 0) <= 0) {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Volume(CBM) should be greater than zero.");
        }
        else if ( parseFloat($('#' + obj.replace('_MaxVolumePerPiece_', '_VolumeWeight_')).val() || 0) < parseFloat(Value || 0)) {
            $('#' + obj).val('');
            $('#_temp' + obj).val('');
            ShowMessage('info', 'Need your Kind Attention!', "Max Volume Per Piece should not be greater than Volume(CBM)");
        }
    }
}