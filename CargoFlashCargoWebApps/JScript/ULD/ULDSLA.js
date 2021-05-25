/*
*****************************************************************************
Javascript Name:	 ULDSLAJS     
Purpose:		     This JS used to get Grid Data for ULDSLA and its tab function.
Company:		     CargoFlash Infotech Pvt Ltd.
Author:			     devendra singh 
Created On:		     28/06/2017   
Updated By:         DEVENDRA SINGH  for changing auto complete name
Updated On:	         28/09/2017     
Approved By:        
Approved On:	    
*****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("CustomerSNo", "Vendor", "ULDSLA_Vendor", null, "contains", null, null, null, null, onSelectVendor);
    cfi.AutoCompleteV2("EventSNo", "Autocompletetext", "ULDSLA_Event", null, "contains", null, null, null, null, onSelectEvent);
    cfi.AutoCompleteV2("BasisSNo", "Autocompletetext", "ULDSLA_Basis", null, "contains", null, null, null, null, onSelectBasis);

    cfi.AutoCompleteV2("MaintenanceTypeSNo", "MaintenanceType", "ULDSLA_MaintenanceType", null, "contains");
    if ($('#Text_CustomerSNo').length > 0) {
        var ano = $('#Text_CustomerSNo').data('kendoAutoComplete').key();
        setAgreementNo(ano);
    }

})


function setAgreementNo(val) {
    var agreementNo = "";
    if (val != undefined && val.length > 0) {
        //var ANo = val.split('-');
        var ANo = val.slice(val.indexOf('-') + 1, val.length);
        if (ANo.length > 1)
            //agreementNo = ANo[1];
            agreementNo = ANo;
    }
    $('span#AgreementNumber').text(agreementNo)
 
}
function onSelectEvent(e) {
    var data = this.dataItem(e.item.index());
    if (data.Text.trim() == "COST APPROVAL".trim()) {
        // $("#BasisSNo").val('4')
        //  $("#Text_BasisSNo").val("REPAIR REQUEST")
        $("#Text_MaintenanceTypeSNo").data("kendoAutoComplete").enable(false);
    }
    if (data.Text.trim() == "INVOICE GENERATION".trim()) {
        //$("#BasisSNo").val('5')
        //  $("#Text_BasisSNo").val("ULD RETURN")
        $("#Text_MaintenanceTypeSNo").data("kendoAutoComplete").enable(false);
    }
    if (data.Text.trim() == "ULD RETURN".trim()) {
        // $("#BasisSNo").val('6')
        // $("#Text_BasisSNo").val("MAINTENANCE TYPE")
        $("#Text_MaintenanceTypeSNo").data("kendoAutoComplete").enable(true);
    }
}
function onSelectBasis(e) {
   
    var data = this.dataItem(e.item.index());
    if (data.Text == "MAINTENANCE TYPE") {
        $('#Text_MaintenanceTypeSNo').attr("data-valid", "required");
        $('#Text_MaintenanceTypeSNo').attr('data-valid-msg', 'Enter Maintenance Type.');
    } else
        $('#Text_MaintenanceTypeSNo').removeAttr("data-valid");
}

function onSelectVendor(e) {
 
    var data = this.dataItem(e.item.index());
    setAgreementNo(data.Key);
}


function ExtraCondition(textId) {
    var filterexchangerate = cfi.getFilter("AND");
    var CurrencyAutoCompleteFilter = "";

    if (textId == "Text_EventSNo") {
        cfi.setFilter(filterexchangerate, "AutocompleteName", "eq", "Event")
        CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);
        return CurrencyAutoCompleteFilter;
    }
    if (textId == "Text_BasisSNo") {

        var data = $("#Text_EventSNo").val();
        if (data.trim() == "COST APPROVAL".trim()) {

            cfi.setFilter(filterexchangerate, "AutocompleteName", "eq", "Basis")
            cfi.setFilter(filterexchangerate, "AutoCompleteText", "eq", "Repair Request")
            CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);


        }
        if (data.trim() == "INVOICE GENERATION".trim()) {

            cfi.setFilter(filterexchangerate, "AutocompleteName", "eq", "Basis")
            cfi.setFilter(filterexchangerate, "AutoCompleteText", "eq", "ULD Return")
            CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);


        }
        if (data.trim() == "ULD RETURN".trim()) {

            cfi.setFilter(filterexchangerate, "AutocompleteName", "eq", "Basis")
            cfi.setFilter(filterexchangerate, "AutoCompleteText", "eq", "Maintenance Type")
            CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);

        }
        return CurrencyAutoCompleteFilter;
    }

    //if (textId == "Text_MaintenanceTypeSNo") {
    //    cfi.setFilter(filterexchangerate, "AutocompleteName", "eq", "MaintenanceType")
    //    var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterexchangerate]);
    //    return CurrencyAutoCompleteFilter;
    //}
}
