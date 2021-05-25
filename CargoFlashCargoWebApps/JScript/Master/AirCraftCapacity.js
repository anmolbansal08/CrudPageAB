/*
*****************************************************************************
Javascript Name:	AirCraftCapacityJS     
Purpose:		    This JS used to get autocomplete.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    07 May 2014
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
var strData = [];
//var pageTypeStart = "NEW";
$(function () {


    $('#liAirCraftCapacityPassengerCapacity').hide();
   

    //pageTypeStart = $('#hdnPageType').val().toUpperCase();
    //cfi.ValidateForm();
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "AirCraftCapacity_AirlineSNo", null, "contains");
    cfi.AutoCompleteV2("AirCraftSNo", "AircraftType", "AirCraftCapacity_AirCraftSNo", null, "contains");
    cfi.AutoCompleteV2("AirCraftInventorySNo", "RegistrationNo", "AirCraftCapacity_AirCraftInventorySNo", null, "contains");
    cfi.AutoCompleteV2("OriginSNo", "CityCode,CityName", "AirCraftCapacity_OriginSNo", null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "CityCode,CityName", "AirCraftCapacity_DestinationSNo", null, "contains");
    $('#FlyingMinutesStart').closest('tr').hide();
    $('#LeverageVolumeWeight').closest('tr').hide();
    //$("#tblAirCraftCapacitySPHC_btnAppendRow").click(function () { alert('hi'); })
    //tblAirCraftCapacitySPHC_btnAppendRow

    $("input[type='text']:eq(0)").focus();
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    $(document).on('drop', function () {
        return false;
    });
    //$(document).keypress(function (e) {

    //    if (e.keyCode != 32)
    //        return true;
    //    else
    //        return false;
    //})
    
    BindingGridonClick();
    function BindingGridonClick() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liAirCraftDoor").hide();
            //$("#liAirCraftCapacityULD").hide();
            //$("#liAirCraftCapacitySPHC").hide();
            //$("#liAirCraftCapacityPassengerCapacity").hide();
            var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
            tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(3), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(4), false);

        }
    }

});


function AirCraftCapacityULDGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "ULD Information can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'AirCraftCapacityULD';
        var pageType = getQueryStringValue("FormAction").toUpperCase();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'READ',
            tableColumns: 'SNo,AirCraftCapacitySNo,ULDTypeSNo,DeckType,Unit,VolumeWeight,GrossWeight,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftCapacitySNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftCapacityService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'ULD Information',            
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftCapacitySNo', type: 'hidden', value: $('#hdnAirCraftCapacitySNo').val() },
                { name: pageType == 'EDIT' ? 'DeckType' : 'strDeckType', display: 'Load Indicator', type: 'radiolist', ctrlOptions: { 0: 'Lower', 1: 'Upper' }, selectedIndex: 0, onClick: function (evt, rowIndex) { checkContourValidation() } },
                { name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'AirCraftCapacity_ULDTypeSNo', filterField: 'Text_ULD' },//templateColumn: ["ULDName", "ContainerType"],
                { name: 'ContourType', display: 'Contour Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '140px', height: '20px' }, AutoCompleteName: 'AirCraftCapacity_ContourType', filterField: 'AbbrCode' },
                { name: 'Unit', display: 'Unit', type: 'text', ctrlAttr: { maxlength: 5, controltype: 'number' }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlAttr: { maxlength: 15, controltype: "decimal3" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: 'GrossWeight', display: 'Gross Weight', type: 'text', ctrlAttr: { maxlength: 15, controltype: "decimal3" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                checkContourValidation();
            },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                for (var i = 1; i <= addedRowIndex.length; i++) {
                    strData.push(i);
                }
                checkContourValidation();
                //getUpdatedRowIndex(strData.join(','), "tblAirCraftCapacityULD");
            }
        });
        checkContourValidation();
    }
}

function widthsetuld() {
    var RowOrder = $("#tblAirCraftCapacityULD").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacityULD").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftCapacityULD_Unit_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftCapacityULD_Unit_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityULD_VolumeWeight_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftCapacityULD_VolumeWeight_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityULD_GrossWeight_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftCapacityULD_GrossWeight_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetpax() {
    var RowOrder = $("#tblAirCraftCapacityInventoryPaxFactor").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacityInventoryPaxFactor").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftCapacityInventoryPaxFactor_PaxStart_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityInventoryPaxFactor_PaxEnd_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityInventoryPaxFactor_IncreaseFactor_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetdoor() {
    var RowOrder = $("#tblAirCraftCapacitytDoor").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacitytDoor").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftCapacityDoor_Height_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityDoor_Width_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetsphc() {
    var RowOrder = $("#tblAirCraftCapacitySPHC").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftSPHC").appendGrid('getRowOrder').length; out++) {
        $("#__temptblAirCraftCapacitySPHC_AFT_" + RowOrder[out]).css("width", "150px");
        $("#_temptblAirCraftCapacitySPHC_FWD_" + RowOrder[out]).css("width", "150px");
    }
};

function checkContourValidation() {

    $("#tblAirCraftCapacityULD").find("input[id^='tblAirCraftCapacityULD_ContourType']").each(function () {

        $('[id^="tblAirCraftCapacityULD_RbtnDeckType_"][value="0"]').is(':checked')
        if ($("input[name='tblAirCraftCapacityULD_RbtnDeckType_" + this.id.split('_')[2] + "']:checked").val() == 1) {
            $("#tblAirCraftCapacityULD_ContourType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(true);
        }
        else {
            $("#tblAirCraftCapacityULD_ContourType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(false);
            $("#tblAirCraftCapacityULD_ContourType_" + this.id.split('_')[2]).val('');
            $("#tblAirCraftCapacityULD_HdnContourType_" + this.id.split('_')[2]).val('');
        }
    });
    widthsetuld();
}

var RowIndex = 0; var GrossWeight = 0;

function AirCraftCapacitySPHCGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "SHC Information can be added in Edit/Update mode only.");
        return;
    }
    else {
        //if (cfi.IsValidSubmitSection()) {
        var dbTableName = 'AirCraftCapacitySPHC';
        var pageType = getQueryStringValue("FormAction").toUpperCase();
        //cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'READ',
            tableColumns: 'SNo,AirCraftCapacitySNo,SPHCSNo,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftCapacitySNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftCapacityService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            isGetRecord: true,
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'SHC Information',
            columns: [
               { name: 'SNo', type: 'hidden', value: 0 },
               { name: 'AirCraftCapacitySNo', type: 'hidden', value: $('#hdnAirCraftCapacitySNo').val() },

               // { name: 'SPHCSNo', display: 'SHC Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, tableName: 'SPHC', textColumn: 'Code', keyColumn: 'SNo', filterCriteria: "contains", isRequired: false, separator: "," },
                { name: 'SPHCSNo', display: 'SHC Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return Validate(this.id);" }, ctrlCss: { width: '140px', height: '20px' }, isRequired: true, AutoCompleteName: 'AirCraftCapacity_SPHCSNo', filterField: 'Code' },
               {
                   name: pageType == 'EDIT' ? 'IsCompatible' : 'Compatible', display: 'Compatible', type:pageType == 'EDIT' ? 'select':'Label', ctrlAttr: { maxlength: 100, onChange: "return ChangeCompatible(this.id);" },  ctrlOptions: { 0: 'Yes', 1: 'No' }, selectedIndex: 0//,
                       //onChange: function (evt, rowIndex) { },onclick: "return ChangeCompatible(this.id);", onkeydown: "return ChangeCompatible(this.id);"
               },
                { name: 'AFT', display: 'AFT', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 5, onkeypress: "return RemoveZero(this.id);", onkeydown: "return RemoveZero(this.id);", onblur: "return RemoveZero(this.id);" }, ctrlCss: { width: '150px' }, isRequired: false },
                 { name: 'FWD', display: 'FWD', type: 'text', ctrlAttr: { controltype: 'number', maxlength: 5, onkeypress: "return RemoveZero(this.id);", onkeydown: "return RemoveZero(this.id);", onblur: "return RemoveZero(this.id);" }, ctrlCss: { width: '150px' }, isRequired: false },
               { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
               { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],
            isPaging: true,            
                dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                    for (var i = 1; i <= RowIndex; i++) {
                        var ChkId = "tblAirCraftCapacitySPHC_IsCompatible_" + i;
                        if ($("#" + ChkId).val() == "1") {
                            ChangeCompatibleonLoad(i);
                        }

                    }
                },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                //widthsetsphc();
                RowIndex = addedRowIndex.length;
            },

            //hideButtons: { append: false, remove: false, removeLast: true },

            //comment new
            //afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            //    $("#tblAirCraftCapacitySPHC_btnAppendRow").css("display","none");              
            //    for (var i = 1; i <= addedRowIndex.length; i++) {
            //       strData.push(i);                   
            //    }
            //},
            //afterRowRemoved: function (caller, rowIndex) {
            //    // Do something
            //    $("#tblAirCraftCapacitySPHC_btnAppendRow").css("display","block")
            //}     
        });

       
        //{ $("#tblAirCraftCapacitySPHC_btnAppendRow").show() })
       // $("#tblAirCraftCapacitySPHC_Delete_1").click(function () { $("#tblAirCraftCapacitySPHC_btnAppendRow").show()})
        //}
        //else {
        //    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liAirCraft'));
        //    return false;
        //}


        for (var i = 1; i <= RowIndex; i++) {
            var ChkId = "tblAirCraftCapacitySPHC_IsCompatible_" + i;
            if ($("#" + ChkId).val() == "1") {
                ChangeCompatibleonLoad(i);
            }
        }
        GrossWeight = $("#GrossWeight").val();
    }

   

}
//Added new
function ChangeCompatibleonLoad(i) {
 
    $("#tblAirCraftCapacitySPHC_AFT_" + i).attr('readonly', true);  //tblAirCraftCapacitySPHC_AFT_2
    $("#tblAirCraftCapacitySPHC_FWD_" + i).attr('readonly', true);
    $("#tblAirCraftCapacitySPHC_AFT_" + i).val("0");
    $("#tblAirCraftCapacitySPHC_FWD_" + i).val("0");
    //$("#tblAirCraftCapacitySPHC_AFT_" + i).removeAttr("required");
    //$("#tblAirCraftCapacitySPHC_FWD_" + i).removeAttr("required");
}
//Added new
function widthsetsphc() {
    var RowOrder = $("#tblAirCraftCapacitySPHC").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacitySPHC").appendGrid('getRowOrder').length; out++) {
        $("#tblAirCraftCapacitySPHC_AFT_" + RowOrder[out]).css("width", "150px"); //tblAirCraftCapacitySPHC_AFT_1
        $("#_temptblAirCraftCapacitySPHC_FWD_" + RowOrder[out]).css("width", "150px");
    }
};




//Added new
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
//Added new
function Validate(obj) {
   
    var ChkValue = $("#" + obj).val();
}
//Added new
function ChangeCompatible(obj) {
    var ChkValue = $("#" + obj).val();
    if (ChkValue == 0) {
        $("#" + obj).parent().parent().find(" td:eq(3)").find("input").attr("maxlength", "5");
        $("#" + obj).parent().parent().find(" td:eq(4)").find("input").attr("maxlength", "5");
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
//$("#tblAirCraftCapacitySPHC_Delete_1").click(function () { $("#tblAirCraftCapacitySPHC_btnAppendRow").show() })

function AirCraftCapacityDoorTableGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Door Information can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'AirCraftCapacityDoor';
        var pageType = getQueryStringValue("FormAction").toUpperCase();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'READ',
            isGetRecord: true,
            tableColumns: 'SNo,AirCraftCapacitySNo,DoorName,UnitType,Height,Width,IsActive,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnAirCraftCapacitySNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AirCraftCapacityService.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Door Information',           
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'AirCraftCapacitySNo', type: 'hidden', value: $('#hdnAirCraftCapacitySNo').val() },
                { name: 'DoorName', display: 'Door Name', type: 'text', ctrlAttr: { maxlength: 48, controltype: 'alphanumericupper' }, onkeypress: function (evt, rowIndex) { preventCopyPaste(evt) }, ctrlCss: { width: '150px' }, isRequired: true },
                { name: pageType == 'EDIT' ? 'UnitType' : 'strUnitType', display: 'Unit Type', type: 'radiolist', ctrlOptions: { 0: 'INCH', 1: 'CMS' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                { name: 'Height', display: 'Height', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal2" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: 'Width', display: 'Width', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal2" }, ctrlCss: { width: '100px' }, isRequired: true },
                { name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
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

function preventCopyPaste(event) {
   
    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
        event.preventDefault();
    }
}

function ExtraCondition(textId) {
    var filterdaysdiscounting = cfi.getFilter("AND");
    if (textId.indexOf("OriginSNo") >= 0) {
        var destination = textId.replace("Text_OriginSNo", "DestinationSNo");
        cfi.setFilter(filterdaysdiscounting, "IsActive", "eq", "1")

        cfi.setFilter(filterdaysdiscounting, "SNo", "neq", $("#" + destination).val())
        var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
        return OriginCityAutoCompleteFilter;
    }
    if (textId.indexOf("DestinationSNo") >= 0) {
        var origin = textId.replace("Text_DestinationSNo", "OriginSNo");
        cfi.setFilter(filterdaysdiscounting, "IsActive", "eq", "1")

        cfi.setFilter(filterdaysdiscounting, "SNo", "neq", $("#" + origin).val())
        var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
        return OriginCityAutoCompleteFilter;
    }
    if (textId.indexOf("AirCraftInventorySNo") >= 0) {
        var AircraftSNo = $('#AirCraftSNo').val()
        cfi.setFilter(filterdaysdiscounting, "AirCraftSNo", "eq", AircraftSNo)
        //cfi.setFilter(filterdaysdiscounting, "IsActive", "eq", "1")
        var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
        return OriginCityAutoCompleteFilter;
    }


    
    var y = textId.split('_')[2];
    if (textId == "tblAirCraftCapacityULD_ULDTypeSNo_" + y) {
        cfi.setFilter(filterdaysdiscounting, "AirlineSNo", "eq", $("#AirlineSNo").val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterdaysdiscounting);
        return RegionAutoCompleteFilter;
    }
    //if (textId.indexOf("tblAirCraftCapacitySPHC_SPHCSNo") >= 0) {
    //    cfi.setFilter(filterdaysdiscounting, "IsActive", "eq", 1);
    //    cfi.setFilter(filterdaysdiscounting, "SPHCSNo", "in", $('#tblAirCraftCapacitySPHC_SPHCSNo_' + textId.split('_')[2]).val());
    //    var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterdaysdiscounting);
    //        return RegionAutoCompleteFilter;
    //if (textId.indexOf("tblAirCraftCapacitySPHC_SPHCSNo") >= 0) {
    //    var SPHCSNo = $('#SPHCSNo').val()
    //    cfi.setFilter(filterdaysdiscounting, "SPHCSNo", "in", SPHCSNo)
    //    var OriginCityAutoCompleteFilter = cfi.autoCompleteFilter([filterdaysdiscounting]);
    //    return OriginCityAutoCompleteFilter;
    //}
    var f = cfi.getFilter("AND");
    if (textId.indexOf("tblAirCraftCapacitySPHC_SPHCSNo") >= 0) {
        var noOfRows = $('#tblAirCraftCapacitySPHC_rowOrder').val();
        for (var i = 0; i <= noOfRows.split(',').length; i++) {

            if ($('#tblAirCraftCapacitySPHC_HdnSPHCSNo_' + noOfRows.split(',')[i]).val() != undefined &&
                $('#tblAirCraftCapacitySPHC_HdnSPHCSNo_' + noOfRows.split(',')[i]).val() != '' &&
                'tblAirCraftCapacitySPHC_HdnSPHCSNo_' + noOfRows.split(',')[i] != 'tblAirCraftCapacitySPHC_HdnSPHCSNo_' + textId.split('_')[2])
                cfi.setFilter(f, "SNo", "notin", $('#tblAirCraftCapacitySPHC_HdnSPHCSNo_' + noOfRows.split(',')[i]).val());
        }
        var SPHCAutoCompleteFilter = cfi.autoCompleteFilter(f);
        return SPHCAutoCompleteFilter;
    }

    //if (textId.indexOf("tblAirCraftCapacitySPHC_SPHCSNo") >= 0) {
    //    var SPHCSNo = $('#tblAirCraftCapacitySPHC_HdnSPHCSNo_1').val();
    //    return cfi.getFilter("AND"), cfi.setFilter(filterdaysdiscounting, "SNo", "notin", SPHCSNo), cfi.autoCompleteFilter(filterdaysdiscounting);
    //};

    function AirCraftCapacityPassengerCapacity() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            ShowMessage('info', 'Need your Kind Attention!', "Passenger Capacity Information can be added in Edit/Update mode only.");
            return;
        }
        else {
            BindPassengerCapacity();
        }
    }

    function BindPassengerCapacity() {
        var pageType = getQueryStringValue("FormAction").toUpperCase();
        var AirCraftCapacitySNo = $('#hdnAirCraftCapacitySNo').val();
        $.ajax({
            url: "./Services/Master/AirCraftCapacityService.svc/BindPassengerCapacity",
            async: false,
            type: "GET",
            dataType: "json",
            data: { AirCraftCapacitySNo: AirCraftCapacitySNo },
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
                var theDiv = document.getElementById("divAirCraftCapacityPassengerCapacity");

                if (pageType == "READ") {
                    theDiv.innerHTML = "";
                    var table = "<table class='appendGrid ui-widget' id='tblAirCraftCapacityPassengerCapacity'><thead class='ui-widget-header'><tr><td class='formSection' colspan='6'>Passenger Capacity</td></tr></thead><tbody class='ui-widget-content'><tr>";
                    table += "<td title='Enter Passenger Capacity' class='formthreelabel'><span id='spnPassengerCapacity'>Passenger Capacity</span></td><td class='formthreeInputcolumn'><input name='PassengerCapacity' tabindex='9' class='k-input k-state-default' id='PassengerCapacity' style='width: 90px; display: none;' type='text' maxlength='3' placeholder='' value='" + PassengerCapacity + "' data-role='numerictextbox' data-valid-msg='Enter valid Declared Customs Value' data-valid='required' controltype='number' allowchar='0123456789'disabled='disabled' >";
                    table += "<td title='Enter Baggage Weight (Full flight)' class='formthreelabel'><span id='spnBaggageWeight'>Baggage Weight (Full flight)</span></td><td class='formthreeInputcolumn'><input name='BaggageWeight' tabindex='9' class='k-input k-state-default' id='BaggageWeight' style='width: 90px; display: none;' type='text' maxlength='10' placeholder='' value='" + BaggageWeight + "' data-role='numerictextbox' data-valid-msg='Enter valid Declared Customs Value' data-valid='required' controltype='decimal2' allowchar='NO' disabled='disabled'>";
                    table += "<td title='Enter Adult Male' class='formthreelabel'><span id='spnAdultMale'>Adult Male</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='AdultMale' id='AdultMale' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Adult Male.' value='" + AdultMale + "' disabled='disabled'></td></tr>";
                    table += "<tr><td title='Enter Adult Female' class='formthreelabel'><span id='spnAdultFemale'>Adult Female</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='AdultFemale' id='AdultFemale' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3'  data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Adult Female.' value='" + AdultFemale + "' disabled='disabled'></td><td title='Enter Child' class='formthreelabel'><span id='spnChild'>Child</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='Child' id='Child' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Child.' value='" + Child + "' disabled='disabled'></td><td title='Enter Infant' class='formthreelabel'><span id='spnInfant'>Infant</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='Infant' id='Infant' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Infant.' value='" + Infant + "' disabled='disabled'></td></tr>";
                    table += "<tr><td class='formthreelabel'></td><td title='Imperial (F)' class='formthreelabel'><span id='spnImperial'>Imperial (F)</span></td><td title='Business (B)' class='formthreelabel'><span id='spnBusiness'>Business (B)</span></td><td title='Premium Economy (Y)' class='formthreelabel'><span id='spnPremiumEconomy'>Premium Economy (Y)</span></td><td title='Tourist Economy (L)' class='formthreelabel'><span id='spnTouristEconomy'>Tourist Economy (L)</span></td><td title='Total' class='formthreelabel'><span id='spnTotal'>Total</span></td></tr>";
                    table += "<tr><td title='No of Baggage' class='formthreelabel'><span id='spnNoofBaggage'>No of Baggage</span></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageImperial' id='NoofBaggageImperial' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Imperial.'' value='" + NoofBaggageImperial + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageBusiness' id='NoofBaggageBusiness' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Business.'' value='" + NoofBaggageBusiness + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggagePremiumEconomy' id='NoofBaggagePremiumEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Premium Economy.'' value='" + NoofBaggagePremiumEconomy + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageTouristEconomy' id='NoofBaggageTouristEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Tourist Economy.'' value='" + NoofBaggageTouristEconomy + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageTotal' id='NoofBaggageTotal' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Total.'' value='" + NoofBaggageTotal + "' disabled='disabled'></td></tr>";
                    table += "<tr><td title='Baggage Allowance (Per Passenger)' class='formthreelabel'><span id='spnBaggageAllowance'>Baggage Allowance (Per Passenger)</span></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceImperial' id='NoofBaggageAllowanceImperial' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Imperial Baggage Allowance.'' value='" + NoofBaggageAllowanceImperial + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceBusiness' id='NoofBaggageAllowanceBusiness' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Baggage Allowance.'' value='" + NoofBaggageAllowanceBusiness + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowancePremiumEconomy' id='NoofBaggageAllowancePremiumEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Premium Economy.'' value='" + NoofBaggageAllowancePremiumEconomy + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceTouristEconomy' id='NoofBaggageAllowanceTouristEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Tourist Economy.'' value='" + NoofBaggageAllowanceTouristEconomy + "' disabled='disabled'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceTotal' id='NoofBaggageAllowanceTotal' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Total.'' value='" + NoofBaggageAllowanceTotal + "' disabled='disabled'></td></tr>";
                } else {
                    theDiv.innerHTML = "";
                    var table = "<table class='appendGrid ui-widget' id='tblAirCraftCapacityPassengerCapacity'><thead class='ui-widget-header'><tr><td class='formSection' colspan='6'>Passenger Capacity</td></tr></thead><tbody class='ui-widget-content'><tr>";
                    table += "<td title='Enter Passenger Capacity' class='formthreelabel'><span id='spnPassengerCapacity'>Passenger Capacity</span></td><td class='formthreeInputcolumn'><input name='PassengerCapacity' tabindex='9' class='k-input k-state-default' id='PassengerCapacity' style='width: 90px; display: none;' type='text' maxlength='3' placeholder='' value='" + PassengerCapacity + "' data-role='numerictextbox' data-valid-msg='Enter valid Declared Customs Value' data-valid='required' controltype='number' allowchar='0123456789'>";
                    table += "<td title='Enter Baggage Weight (Full flight)' class='formthreelabel'><span id='spnBaggageWeight'>Baggage Weight (Full flight)</span></td><td class='formthreeInputcolumn'><input name='BaggageWeight' tabindex='9' class='k-input k-state-default' id='BaggageWeight' style='width: 90px; display: none;' type='text' maxlength='10' placeholder='' value='" + BaggageWeight + "' data-role='numerictextbox' data-valid-msg='Enter valid Declared Customs Value' data-valid='required' controltype='decimal2' allowchar='NO'>";
                    table += "<td title='Enter Adult Male' class='formthreelabel'><span id='spnAdultMale'>Adult Male</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='AdultMale' id='AdultMale' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Adult Male.' value='" + AdultMale + "'></td></tr>";
                    table += "<tr><td title='Enter Adult Female' class='formthreelabel'><span id='spnAdultFemale'>Adult Female</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='AdultFemale' id='AdultFemale' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3'  data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Adult Female.' value='" + AdultFemale + "'></td><td title='Enter Child' class='formthreelabel'><span id='spnChild'>Child</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='Child' id='Child' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Child.' value='" + Child + "'></td><td title='Enter Infant' class='formthreelabel'><span id='spnInfant'>Infant</span></td><td class='formthreeInputcolumn'><input type='text' class='k-input' name='Infant' id='Infant' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Infant.' value='" + Infant + "'></td></tr>";
                    table += "<tr><td class='formthreelabel'></td><td title='Imperial (F)' class='formthreelabel'><span id='spnImperial'>Imperial (F)</span></td><td title='Business (B)' class='formthreelabel'><span id='spnBusiness'>Business (B)</span></td><td title='Premium Economy (Y)' class='formthreelabel'><span id='spnPremiumEconomy'>Premium Economy (Y)</span></td><td title='Tourist Economy (L)' class='formthreelabel'><span id='spnTouristEconomy'>Tourist Economy (L)</span></td><td title='Total' class='formthreelabel'><span id='spnTotal'>Total</span></td></tr>";
                    table += "<tr><td title='No of Baggage' class='formthreelabel'><span id='spnNoofBaggage'>No of Baggage</span></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageImperial' id='NoofBaggageImperial' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Imperial.'' value='" + NoofBaggageImperial + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageBusiness' id='NoofBaggageBusiness' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Business.'' value='" + NoofBaggageBusiness + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggagePremiumEconomy' id='NoofBaggagePremiumEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Premium Economy.'' value='" + NoofBaggagePremiumEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageTouristEconomy' id='NoofBaggageTouristEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Tourist Economy.'' value='" + NoofBaggageTouristEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageTotal' id='NoofBaggageTotal' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Baggage Total.'' value='" + NoofBaggageTotal + "'></td></tr>";
                    table += "<tr><td title='Baggage Allowance (Per Passenger)' class='formthreelabel'><span id='spnBaggageAllowance'>Baggage Allowance (Per Passenger)</span></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceImperial' id='NoofBaggageAllowanceImperial' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of No of Imperial Baggage Allowance.'' value='" + NoofBaggageAllowanceImperial + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceBusiness' id='NoofBaggageAllowanceBusiness' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Baggage Allowance.'' value='" + NoofBaggageAllowanceBusiness + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowancePremiumEconomy' id='NoofBaggageAllowancePremiumEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Premium Economy.'' value='" + NoofBaggageAllowancePremiumEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceTouristEconomy' id='NoofBaggageAllowanceTouristEconomy' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Tourist Economy.'' value='" + NoofBaggageAllowanceTouristEconomy + "'></td><td class='formthreelabel'><input type='text' class='k-input' name='NoofBaggageAllowanceTotal' id='NoofBaggageAllowanceTotal' style='width: 100px; text-transform: none;' controltype='number' allowchar='0123456789' tabindex='1' maxlength='3' data-role='alphabettextbox' autocomplete='off' data-valid='required' data-valid-msg='Enter No. Of Business Total.'' value='" + NoofBaggageAllowanceTotal + "'></td></tr>";

                }
                if (pageType != 'READ')
                    table += "<tfoot><tr><td colspan='6' class='ui-widget-header'><button aria-disabled='false' role='button' title='Transfer' type='button' id='btnTransfer' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='UpdatePassengerCapacity();'><span class='ui-button-text'>Update</span></button></td></tr></tfoot>";
                table += "</table>";
                theDiv.innerHTML += table;
                InstantiateControl("divAirCraftCapacityPassengerCapacity");
            },
            error: function (xhr) {
                var a = "";
            }
        });

    }

    function UpdatePassengerCapacity() {
        if (cfi.IsValidSubmitSection()) {
            $.ajax({
                url: "./Services/Master/AirCraftCapacityService.svc/UpdatePassengerCapacity",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    AirCraftCapacitySNo: $('#hdnAirCraftCapacitySNo').val(),
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
}



function widthsetuld() {
    var RowOrder = $("#tblAirCraftCapacityULD").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacityULD").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftCapacityULD_Unit_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftCapacityULD_Unit_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityULD_VolumeWeight_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftCapacityULD_VolumeWeight_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityULD_GrossWeight_" + RowOrder[out]).css("width", "100px");
        $("#tblAirCraftCapacityULD_GrossWeight_" + RowOrder[out]).css("width", "100px");
    }
};


function widthsetpax() {
    var RowOrder = $("#tblAirCraftCapacityInventoryPaxFactor").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacityInventoryPaxFactor").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftCapacityInventoryPaxFactor_PaxStart_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityInventoryPaxFactor_PaxEnd_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityInventoryPaxFactor_IncreaseFactor_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetdoor() {
    var RowOrder = $("#tblAirCraftCapacityDoor").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacityDoor").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftCapacityDoor_Height_" + RowOrder[out]).css("width", "100px");
        $("#_temptblAirCraftCapacityDoor_Width_" + RowOrder[out]).css("width", "100px");
    }
};

function widthsetsphc() {
   
    var RowOrder = $("#tblAirCraftCapacitySPHC").appendGrid('getRowOrder');
    for (var out = 0; out < $("#tblAirCraftCapacitySPHC").appendGrid('getRowOrder').length; out++) {
        $("#_temptblAirCraftCapacitySPHC_AFT_" + RowOrder[out]).css("width", "150px");
        $("#_temptblAirCraftCapacitySPHC_FWD_" + RowOrder[out]).css("width", "150px");
    }
};

function  checkContourValidation() {

    $("#tblAirCraftCapacityULD").find("input[id^='tblAirCraftCapacityULD_ContourType']").each(function () {

        $('[id^="tblAirCraftCapacityULD_RbtnDeckType_"][value="0"]').is(':checked')
        if ($("input[name='tblAirCraftCapacityULD_RbtnDeckType_" + this.id.split('_')[2] + "']:checked").val() == 1) {
            $("#tblAirCraftCapacityULD_ContourType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(true);
        }
        else {
            $("#tblAirCraftCapacityULD_ContourType_" + this.id.split('_')[2]).data("kendoAutoComplete").enable(false);
            $("#tblAirCraftCapacityULD_ContourType_" + this.id.split('_')[2]).val('');
            $("#tblAirCraftCapacityULD_HdnContourType_" + this.id.split('_')[2]).val('');
        }
    }); widthsetuld();
    
}

function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}