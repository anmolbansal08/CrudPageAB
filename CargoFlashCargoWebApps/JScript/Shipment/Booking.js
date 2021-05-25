/*
*****************************************************************************
Javascript Name:	Booking  
Purpose:		    
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Anand
Created On:		   12 May 2014
Updated By:         Anand
Updated On:	        13 May 2014
Approved By:        
Approved On:	    
*****************************************************************************
*/
var cityHtml='';
var pageType = $('#hdnPageType').val();
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    //cfi.AutoComplete("City", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
    cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("Account", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("Origin", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
    cfi.AutoComplete("Destination", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
    cfi.AutoComplete("Product", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    // by default city shows and awb number is hide
    $('#Text_City').width('75px');
    $('#Text_City').show();
    $('#_tempAWBNumber').hide();
    // for multi grid
    var tableSetting = null;
    // set divdimension effects
    $("#divDimension").dialog({
        width:'520px',
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        closeOnEscape: true,
        open: function (event, ui) {
            $('#divBack').show();
            // for multi grid
            if (!isEmpty(settings)) tableSetting = settings;
            createDimensionTable();
        },
        close: function (event, ui) {
            $('#divBack').hide();
            // for multi grid
            if (!isEmpty(settings)) settings = tableSetting;
        }
    });
    createBookingPieceWiseDetailTable();
   // $('#AWBNumber').attr('onkeyup', 'setDash(this);');
});
// set booking source city or awb number
$('[name="BookingSource"]').click(function () {
    //var x = $('#_tempAWBNumber').position();
    var cbox = this;
        $('.k-combobox').each(function () {
            if (this.innerHTML == '' && $(cbox).val() == '0') {
                this.innerHTML = cityHtml;
                cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains"); $('#Text_City').width('75px');
                $('#_tempAWBNumber').hide();
            }
            else if (this.innerHTML.indexOf('Text_City') > 0) {
                cityHtml = this.innerHTML;
                this.innerHTML = '';
                $('#_tempAWBNumber').show();
            }
        });
});
//function setDash(id) {
//    if ($(id).val().length == 3)
//        $(id).val($(id).val() + '-');
//    $('#_tempAWBNumber').val($(id).val());
//}
$('#liBooking').click(function () {
    createBookingPieceWiseDetailTable();
});
$('#liShipperConsignee').click(function () {
    //// Shipper / Consignee
    cfi.AlphabetTextBox('Shipper_AccountNo', 'alphanumericupper');
    cfi.AlphabetTextBox('Consignee_AccountNo', 'alphanumericupper');
    cfi.AlphabetTextBox('Shipper_Name', 'uppercase');
    cfi.AlphabetTextBox('Consignee_Name', 'uppercase');
    cfi.AlphabetTextBox('Shipper_Address', 'alphanumericupper');
    cfi.AlphabetTextBox('Consignee_Address', 'alphanumericupper');
    cfi.AlphabetTextBox('Shipper_City', 'uppercase');
    cfi.AlphabetTextBox('Consignee_City', 'uppercase');
    cfi.AlphabetTextBox('Shipper_State', 'uppercase');
    cfi.AlphabetTextBox('Consignee_State', 'uppercase');
    cfi.AlphabetTextBox('Shipper_Country', 'uppercase');
    cfi.AlphabetTextBox('Consignee_Country', 'uppercase');
    cfi.Numeric('Shipper_PostalCode', -1, 'number');
    cfi.Numeric('Consignee_PostalCode', -1, 'number');
    cfi.Numeric('Shipper_PhoneNo', -1, 'number');
    cfi.Numeric('Consignee_PhoneNo', -1, 'number');
    cfi.Numeric('Shipper_Fax', -1, 'number');
    cfi.Numeric('Consignee_Fax', -1, 'number');
    cfi.AlphabetTextBox('Shipper_Email', 'alphanumericlower');
    cfi.AlphabetTextBox('Consignee_Email', 'alphanumericlower');
    //cfi.GridAutoComplete("Shipper_AccountNo", "CustomerNo", "Customer", "SNo", "CustomerNo", ["CustomerNo"], null, "contains");
    //cfi.GridAutoComplete("Consignee_AccountNo", "CustomerNo", "Customer", "SNo", "CustomerNo", ["CustomerNo"], null, "contains");
    //cfi.GridAutoComplete("Shipper_Name", "Name", "Customer", "SNo", "Name", ["Name"], null, "contains");
    //cfi.GridAutoComplete("Consignee_Name", "Name", "Customer", "SNo", "Name", ["Name"], null, "contains");
    //cfi.GridAutoComplete("Shipper_City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
    //cfi.GridAutoComplete("Consignee_City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
}); 
$('#liSPHC').click(function () {
    createSPHCTable();
});
function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    // set office blank on city change.
    if (textId.indexOf("City") >= 0) {
        $("#Text_Office").val('');
        $("#Office").val('');
    }
    // office filter condition and set account blank on office change.
    else if (textId.indexOf("Office") >= 0) {
        cfi.setFilter(f, "CitySNo", "eq", $("#City").val());
        $("#Text_Account").val('');
        $("#Account").val('');
    }
   // agent filter condition
    else if (textId.indexOf("Account") >= 0) {
        cfi.setFilter(f, "OfficeSNo", "eq", $("#Office").val());
    }
    // origin destination filter conditions
    else if (textId.indexOf("Origin") >= 0 || textId.indexOf("Destination") >= 0) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_Origin", "Destination").replace("Text_Destination", "Origin")).val());
    }
    // SPHC Charges
    else if (textId.indexOf("SPHC") >= 0) {
        $('input:[id*="tblBookingSPHC_SPHC"]').each(function () {
            if (this.id != textId) {
                cfi.setFilter(f, "SNo", "neq", $("#" + this.id.replace("_SPHC_", "_HdnSPHC_")).val());
            }
        });
    }
    return cfi.autoCompleteFilter([f]);
}
// show hide divdimension
$('#Dimension').click(function () {$("#divDimension").dialog('open');});
//$('.ui-dialog-titlebar-close').click(function () {
   
//});
// create dimension table
function createDimensionTable() {
    $('#tblDimension').appendGrid({
        tableID: 'tblDimension',
        contentEditable: pageType != 'VIEW',
        masterTableSNo: $('#hdnBookingSno').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Shipment/BookingService.svc',
        getRecordServiceMethod: 'GetDimensionRecord',
        createUpdateServiceMethod: 'createUpdateDimension',
        deleteServiceMethod: 'deleteDimension',
        caption: 'Dimension Detail',
        initRows: 1,
        // column for edit
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                  { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSno').val() },
                  { name: 'Length', display: 'Length', type: 'text', ctrlAttr: { controltype: 'number' },ctrlCss: { width: '100px' }, isRequired: true },
                  { name: 'Width', display: 'Width', type: 'text', ctrlAttr: { controltype: 'number' }, ctrlCss: { width: '100px'}, isRequired: true },
                  { name: 'Height', display: 'Height', type: 'text', ctrlAttr: { controltype: 'number' }, ctrlCss: { width: '100px' }, isRequired: true },
                  { name: 'Pieces', display: 'Pieces', type: 'text', ctrlAttr: { controltype: 'number' }, ctrlCss: { width: '100px' }, isRequired: true }
        ],

        isPaging: false
    });
    // load data
    

}
// create Booking Piece wise detail table
function createBookingPieceWiseDetailTable() {
    $('#tblBookingPieceWiseDetail').appendGrid({
        tableID: 'tblBookingPieceWiseDetail',
        contentEditable: pageType != 'VIEW',
        masterTableSNo: $('#hdnBookingSno').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Shipment/BookingService.svc',
        getRecordServiceMethod: 'GetBookingPieceWiseDetailRecord',
        createUpdateServiceMethod: 'createUpdateBookingPieceWiseDetail',
        deleteServiceMethod: 'deleteBookingPieceWiseDetail',
        caption: 'Piece Wise Detail',
        initRows: 1,
        // column for edit
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                  { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSno').val() },
                  { name: 'Commodity', display: 'Commodity', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'commodity', textColumn: 'CommodityCode', keyColumn: 'SNo', filterCriteria: "contains" },
                  { name: 'Pieces', display: 'Pieces', type: 'text', ctrlAttr: { controltype: 'number' }, ctrlCss: { width: '100px' }, isRequired: true },
                  { name: 'GrossWeight', display: 'Gross Weight', type: 'text', ctrlAttr: { controltype: 'decimal3' }, ctrlCss: { width: '100px' }, isRequired: true },
                  { name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlAttr: { controltype: 'decimal3' }, ctrlCss: { width: '100px' }, isRequired: true },
        { name: 'ChargeableWeight', display: 'Chargeable Weight', type: 'text', ctrlAttr: { controltype: 'decimal3' }, ctrlCss: { width: '100px' }, isRequired: true }
        ],

        isPaging: false
    });
    // load data
    

}
// create SPHC table
function createSPHCTable() {
    $('#tblBookingSPHC').appendGrid({
        tableID: 'tblBookingSPHC',
        contentEditable: pageType != 'VIEW',
        masterTableSNo: $('#hdnBookingSno').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Shipment/BookingService.svc',
        getRecordServiceMethod: 'GetBookingSPHCRecord',
        createUpdateServiceMethod: 'createUpdateBookingSPHC',
        deleteServiceMethod: 'deleteBookingSPHC',
        caption: 'SPHC Detail',
        initRows: 1,
        // column for edit
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                  { name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSno').val() },
                  { name: 'SPHC', display: 'SHC', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: 'SPHC', textColumn: 'Code', keyColumn: 'SNo', filterCriteria: "contains" },
                  { name: 'UNNo', display: 'UN Number', type: 'text', ctrlAttr: { controltype: 'number' }, ctrlCss: { width: '100px' }, isRequired: true }
        ],

        isPaging: false
    });
    // load data
    

}
