///*
//*****************************************************************************
//Javascript Name:	HoldType     
//Company:		    CargoFlash Infotech Pvt Ltd.
//Author:			Arun Kumar Pathak
//Created On:		19-3-2017
//Updated By:         
//Updated On:	        
//Approved By:        
//Approved On:	    
//*****************************************************************************
//*/


$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("ExcludeProduct", "ProductName", "HoldType_ExcludeProduct", null, "contains", ',');
    cfi.AutoCompleteV2("Airline", "AirlineCode,AirlineName", "HoldType_Airline", null, "contains", ',');
  cfi.BindMultiValue("Airline", $("#Text_Airline").val(), $("#Airline").val());
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
    {
        $('input[name="IsRestrictChangeFinalization"]').prop('checked', true);
        $('input[name="IsAutoUnhold"]').prop('checked', true);
           
    }

  

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        BindHoldTypeTrans();
    }
    if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
        BindHoldTypeTrans();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
    {
        cfi.BindMultiValue("ExcludeProduct", $("#Text_ExcludeProduct").val(), $("#ExcludeProduct").val());
       
    }
    $("input[name='operation']").click(function (e) {
   // $("input[name='operation']").unbind("click").click(function () {
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        if (cfi.IsValidSubmitSection())
        {
            GetAppendGridData();
            return true;
        }
        else
        {
            return false
        }
    });
 
});


function GetAppendGridData() {
    var res = $("#tblHoldTypeTrans tr[id^='tblHoldTypeTrans']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblHoldTypeTrans');
    var data = $('#tblHoldTypeTrans').appendGrid('getStringJson');
    $("#hdnFormData").val(btoa(JSON.stringify(JSON.parse(data))));
}

function ExtraCondition(textId)
{
    var controlid = textId.split('_')[1];
    if (controlid == "CitySNo")
    {
    var filterCity = cfi.getFilter("AND");
    if (textId.indexOf("CitySNo") >= 0)
    {
        var CountrySNo = $('#' + textId.replace("CitySNo", "HdnCountrySNo")).val();
        var filterCty = cfi.getFilter("AND");
        cfi.setFilter(filterCty, "CountrySNo", "eq", CountrySNo);
    }
    filterCity = cfi.autoCompleteFilter(filterCty);
    return filterCity;
    }
    if (controlid == "AirportSNo")
    {
        var filterAirport = cfi.getFilter("AND");
        if (textId.indexOf("AirportSNo") >= 0)
        {
            var CitySNo = $('#' + textId.replace("AirportSNo", "HdnCitySNo")).val();
            var filterAir = cfi.getFilter("AND");
            cfi.setFilter(filterAir, "CitySNo", "eq", CitySNo);
        }
        filterAirport = cfi.autoCompleteFilter(filterAir);
        return filterAirport;
    }
    if (controlid == "Text_ExcludeProduct")
    {
        var filterExcludeProduct = cfi.getFilter("AND");
        cfi.setFilter(filterExcludeProduct, "IsActive", "eq", 1)
        var ExcludeProduct = cfi.autoCompleteFilter([filterExcludeProduct]);
        return ExcludeProduct;
    }
}
function ClearCity(obj) {
   
    $(obj).closest('tr').find("input[id^=tblHoldTypeTrans_CitySNo_").val('');

    $(obj).closest('tr').find("input[id^=tblHoldTypeTrans_AirportSNo_").val('');
   
}

function ClearAirport(obj) {

    $(obj).closest('tr').find("input[id^=tblHoldTypeTrans_AirportSNo_").val('');

}


function BindHoldTypeTrans() {
    var HoldTypeTrans = "HoldTypeTrans";
    var GetRecord = "GetHoldTypeGridAppendGrid";
    var controlType = getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "text";
    $('#tbl' + HoldTypeTrans).appendGrid({
        tableID: 'tbl' + HoldTypeTrans,
        contentEditable: true,
        masterTableSNo:$("#hdnEditSno").val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: null,
        servicePath: 'Services/Master/HoldTypeService.svc',
        getRecordServiceMethod: GetRecord,
        createUpdateServiceMethod: '',
        caption: "HoldType",
        initRows: 1,
        isGetRecord: true,
        hideButtons: { updateAll: true, insert: true },

        columns: [{ name: 'SNo', type: 'hidden' },
                { name: "CountrySNo", display: "Country Name", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return ClearCity(this);" }, ctrlCss: { width: "250px" }, isRequired: true, AutoCompleteName: "HoldType_CountrySNo", filterField: "HoldCountryName",  filterCriteria: "contains" },
                  { name: "CitySNo", display: "City Name", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return ClearAirport(this);" }, ctrlCss: { width: "250px" }, AutoCompleteName: "HoldType_CitySNo", filterField: "HoldCityname", filterCriteria: "contains" },
                  { name: "AirportSNo", display: "Airport Name", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "250px" }, AutoCompleteName: "HoldType_AirportSNo", filterField: "HoldAirportName",  filterCriteria: "contains" },
                 
                
                
        ],
    });

 




   
}



