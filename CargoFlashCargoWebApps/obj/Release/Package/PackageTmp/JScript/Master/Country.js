/*
*****************************************************************************
Javascript Name:	CountryJS     
Purpose:		    This JS used to get autocomplete for Currency and Continent.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    17 feb 2014
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
$(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteByDataSource("IATAAreaCode", IATATYPE);
    // cfi.AutoComplete("CurrencyCode", "CurrencyName", "Currency", "CurrencyCode", "CurrencyCode", ["CurrencyCode", "CurrencyName"]);
    cfi.AutoComplete("CurrencyCode", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    var alphabettypes = [{ Key: "AFRICA", Text: "AFRICA" }, { Key: "ANTARCTICA", Text: "ANTARCTICA" }, { Key: "ASIA", Text: "ASIA" }, { Key: "AUSTRALIA", Text: "AUSTRALIA" }, { Key: "EUROPE", Text: "EUROPE" }, { Key: "NORTH AMERICA", Text: "NORTH AMERICA" }, { Key: "SOUTH AMERICA", Text: "SOUTH AMERICA" }];
    cfi.AutoCompleteByDataSource("Continent", alphabettypes);
    CountryVatGrid();
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
});

/*
*****************************************************************************
Javascript Name:	Country.js   
Purpose:		    This JS used to Add,Update,Delete  CountryVat .
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Amit Kumar Gupta
Created On:		    14 April 2014
Updated By:        
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
var dbTableName = 'CountryVat';
function CountryVatGrid() {

    var pageType = $('#hdnPageType').val();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,CountrySNo,IsDomsticVat,Value,ValidFrom,ValidTo,IsActive',
        masterTableSNo: $('#hdnCountryVatSno').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/Master/' + dbTableName + 'Service.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Country VAT',
        initRows: 1,
        isGetRecord: true,
        columns: [
                  { name: 'SNo', type: 'hidden', value: 0 },
                  { name: 'CountrySNo', type: 'hidden', value: $('#hdnCountryVatSno').val() },
                  {
                      name: pageType == 'EDIT' ? 'IsDomsticVat' : 'DomsticVat', display: 'VAT', type: 'radiolist', ctrlOptions: { 0: 'Domestic ', 1: 'International' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
                  },

                  { name: 'Value', display: 'Value', type: 'text', ctrlAttr: { maxlength: 3, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
                  //{ name: 'Value', display: 'Value', type: 'text', value: '0', isRequired: true, ctrlAttr: { maxlength: 3, onblur: "return checkNumeric(this.id);" }, ctrlCss: { width: '90px' } },

                  {
                      name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' ,readonly: true}, ctrlCss: { width: '90px', height: '20px' }
                  },
                 {
                     name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo', readonly : true }, ctrlCss: { width: '90px', height: '20px' }
                 },
                
                 {
                      name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
                 },
                 {
                     name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val()
                 },
                 {
                       name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val()
                 }


        ],
        isPaging: true,
    });
    
}


function setdaterangevalue(containerid) {
    if (containerid == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlid = $(this).attr("id");
            var start = new date();
            var end = $("#" + cntrlid).data("kendodatepicker");
            end.min(start);
        });
    }
    else {
        $('#tblaccountcommision_row_' + containerid).find("input[controltype='datetype']").each(function () {
            var cntrlid = $(this).attr("id");
            var start = new date();
            var end = $("#" + cntrlid).data("kendodatepicker");
            end.min(start);
        });
    }
}

$('input[type="submit"][name="operation"]').click(function () {
  
    for (var count = 1; count <= $('#tblCountryVat_rowOrder').val().split(',').length; count++) {
        if ($('#tblCountryVat_Value_' + count).val() == "") {
            $('#tblCountryVat_Value_' + count).val('1');
        }
    }

 

});
