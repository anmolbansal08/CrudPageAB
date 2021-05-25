var pageType = $('#hdnPageType').val();
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");

    cfi.AutoComplete("AircraftSNo", "SNo,AircraftType", "Aircraft", "SNo", "AircraftType", null, null, "contains");
    cfi.AutoComplete("OriginAirportSNo", "SNo,AirportName", "Airport", "SNo", "AirportName", null, null, "contains");
    cfi.AutoComplete("DestinationAirportSNo", "SNo,AirportName", "Airport", "SNo", "AirportName", null, null, "contains");
    cfi.AutoComplete("CarrierCode", "CarrierCode,CarrierCode", "Airline", "CarrierCode", "CarrierCode", null, null, "contains");
    cfi.AutoComplete("UldTypeSNo", "SNo,ULDName", "ULDType", "SNo", "ULDName", null, null, "contains");

    $("input[id=EndDate]").change(function (e) {
        var dto = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        var dfrom = new Date(Date.parse($("#StartDate").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        if (dfrom >= dto)
            $(this).val("");
    })
    $("input[id=StartDate]").change(function (e) {

        var dfrom = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));

        var dto = new Date(Date.parse($("#EndDate").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        if (dfrom >= dto)
            $(this).val("");
    })

    if (pageType != "NEW") {
        var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    }

    if(pageType == "Edit")
    {
        checkAllocationcode();
    }
})


function checkAllocationcode()
{
    $.ajax({
        type: "POST",
        url: "./Services/spacecontrol/allocationService.svc/GetAllocationCode?recid=" + $("#AllocationCode").val(),
        data: { id: $("#AllocationCode").val() },
        dataType: "json",
        success: function (response) {
            if (response.Data[0] == "1") {
                $('#AllocationCode').attr('readonly', 'true');
                return false;
            }
        }
    });
}


function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("OriginAirportSNo") >= 0 || textId.indexOf("DestinationAirportSNo") >= 0) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "DestinationAirportSNo").replace("Text_DestinationAirportSNo", "OriginAirportSNo")).val());
    }
    return cfi.autoCompleteFilter([f]);
}



function AllocationTransGrid() {
    var dbTableName = 'AllocationTrans';
    var pageType = $('#hdnPageType').val();
    cfi.ValidateForm();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        masterTableSNo: $('#hdnAllocationSNo').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/SpaceControl/' + dbTableName + 'Service.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Allocation Details',
        isGetRecord: true,
        initRows: 1,
        columns: [
            { name: 'sno', type: 'hidden', value: 0 },
           
            { name: 'AllocationSNo', type: 'hidden', value: $('#hdnAllocationSNo').val() },
            { name: 'AllocationAirportSNo', display: 'Airport', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'Airport', textColumn: 'AirportCode', keyColumn: 'SNo' },
           {
               name: 'divDays', display: 'Days of Operation in Week', type: 'div', isRequired: false,
               divElements: [{
                   divRowNo: 1, name: pageType != 'View' ? 'AllDays' : 'AllDay', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                       $('input:checkbox[id*="_' + (rowIndex + 1) + '"]').each(function () {
                           if (this.id != 'tbl' + dbTableName + '_IsActive_' + (rowIndex + 1) && this.id != 'tbl' + dbTableName + '_UTIsActive_' + (rowIndex + 1))
                               this.checked = $('input[id*="AllDays_' + (rowIndex + 1) + '"]:checked').val() != undefined;
                       });
                   }
               },
                   {
                       divRowNo: 1, name: pageType != 'View' ? 'Day1' : 'Sun', display: null, type: 'checkbox', onClick: function (evt, rowIndex) {
                           if ($('input[id*="tbl' + dbTableName + '_Day1_' + (rowIndex + 1) + '"]:checked').val() == undefined)
                               $('input[id*="AllDays_' + (rowIndex + 1) + '"]:checked').val('off');
                       }
                   },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day2' : 'Mon', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day3' : 'Tue', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day4' : 'Wed', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day5' : 'Thu', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day6' : 'Fri', display: null, type: 'checkbox' },
                   { divRowNo: 1, name: pageType != 'View' ? 'Day7' : 'Sat', display: null, type: 'checkbox' },
                   { divRowNo: 2, name: 'lblAllDays', value: 'Days', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay1', value: 'Sun', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay2', value: 'Mon', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay3', value: 'Tue', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay4', value: 'Wed', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay5', value: 'Thu', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay6', value: 'Fri', type: 'label', ctrlCss: { 'font-weight': 'bold' } },
                   { divRowNo: 2, name: 'lblDay7', value: 'Sat', type: 'label', ctrlCss: { 'font-weight': 'bold' } }]
           }, 
            //{ name: 'Day1', display: 'Mon', type: 'checkbox', ctrlCss: { width: '10px' }, isRequired: false },
            //{ name: 'Day2', display: 'Tue', type: 'checkbox', ctrlCss: { width: '10px' }, isRequired: false },
            //{ name: 'Day3', display: 'Wed', type: 'checkbox', ctrlCss: { width: '10px' }, isRequired: false },
            //{ name: 'Day4', display: 'Thu', type: 'checkbox', ctrlCss: { width: '10px' }, isRequired: false },
            //{ name: 'Day5', display: 'Fri', type: 'checkbox', ctrlCss: { width: '10px' }, isRequired: false },
            //{ name: 'Day6', display: 'Sat', type: 'checkbox', ctrlCss: { width: '10px' }, isRequired: false },
            //{ name: 'Day7', display: 'Sun', type: 'checkbox', ctrlCss: { width: '10px' }, isRequired: false },
            { name: 'StartDate', display: 'From Date', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', startControl: 'StartDate', endControl: 'EndDate' } },
            { name: 'EndDate', display: 'To Date', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', startControl: 'StartDate', endControl: 'EndDate' } },
            { name: 'GrossWeight', display: 'G. Wt.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'VolumeWeight', display: 'V. Wt.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '40px' }, isRequired: true },
            { name: 'ReleaseTime', display: 'Release', type: 'text', ctrlAttr: { maxlength: 18, controltype: "number" }, ctrlCss: { width: '35px' }, isRequired: true },
            { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
            { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() },
            { name: 'IsActive', display: 'Active', type: 'checkbox', ctrlCss: { width: '50px' }, isRequired: true },

            //AllocationTransULD
            { name: 'UldTypeSNo', display: 'ULDType', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'ULDType', textColumn: 'ULDName', keyColumn: 'SNo' },
            { name: 'Unit', display: 'Unit', type: 'text', ctrlAttr: { maxlength: 10, controltype: "number" }, ctrlCss: { width: '30px' }, isRequired: true },
            { name: 'GWeight', display: 'ULD G Wt.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '50px' }, isRequired: true },
            { name: 'VWeight', display: 'ULD V Wt.', type: 'text', ctrlAttr: { maxlength: 18, controltype: "decimal2" }, ctrlCss: { width: '50px' }, isRequired: true },
            { name: 'UTIsActive', display: 'Active', type: 'checkbox', ctrlCss: { width: '18px' }, isRequired: true },
             { name: 'ATUSNo', type: 'hidden', value: 0 },

        ],
        isPaging: true,
    });
    
}

