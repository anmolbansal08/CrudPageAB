/// <reference path="../../Scripts/references.js" />
var pageType = "";
var gridAddedRowCount = 0;
var length = 0;
var CurrentRowSno = '';
var rowDelete = false;
$(document).ready(function () {
    $("input#MasterDuplicate").hide();
    cfi.ValidateForm();
    cfi.AutoComplete("CountrySNo", "CountryCode,CountryName", "vwcountry", "SNo", "CountryCode", ["CountryCode", "CountryName"], OnSelectCountryCodeChange, "contains");
    cfi.AutoComplete("CitySNo", "CityCode,CityName", "vwcity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#CitySNo").val(userContext.CitySNo);
        $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);
        $('#Text_CitySNo').data("kendoAutoComplete").enable(true);

        /*********Get Country*********************/
        $.ajax({
            url: "Services/Master/TaxService.svc/GetCountry", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ CitySNo: userContext.CitySNo }),
            success: function (result) {
                if (result != "") {
                    $('#Text_CountrySNo').data("kendoAutoComplete").key(result.split('__')[0]);
                    $('#Text_CountrySNo').data("kendoAutoComplete").value(result.split('__')[1]);
                    $('#Text_CountrySNo').data("kendoAutoComplete").enable(true);
                }
            }
        });
        /*****************************************/
    }







    var Ownership = [{ Key: "0", Text: "DOMESTIC" }, { Key: "1", Text: "INTERNATIONAL" }];
    cfi.AutoCompleteByDataSource("TaxType", Ownership);
    $("input[name='operation']").unbind('click').click(function () {
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        
        //if (!validateTableData(tblGrid, rows||cfi.IsValidSubmitSection())) {
        if (cfi.IsValidSubmitSection())
        {
            //var lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];
            //if ($("#tblTaxSlab_DomesticFlag_" + lastRowIndex).prop('checked') == true || $("#tblTaxSlab_InternationalFlag_" + lastRowIndex).prop('checked') == true)
            //{
            SaveTaxDetail();


            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                AuditLogSaveNewValue("divbody");
            }
            return true;
            //}
            //else {

            //    alert("Either Domestic or Inernational is required!!!");
            //    return false;
            //}
        }
        else {
            return false
        }
    });
    $(document).on("contextmenu", function (e) {
        return false;
    });
    $(document).on('drop', function () {
        return false;
    });
});
function onselect(e)
{
    $('#Text_CitySNo').val('');
}
function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_CitySNo") {
        cfi.setFilter(filter, "CountrySNo", "neq", 0);
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_CountrySNo").data("kendoAutoComplete").key())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }
}

pageType = $("#hdnPageType").val();

$(function () {
    // Initialize appendGrid
    $('#tblTaxSlab').appendGrid({
        tableID: "tblTaxSlab",
        contentEditable: true,
        masterTableSNo: $("#hdnTaxSNo").val(),
        //currentPage: 1,
        //itemsPerPage: 500,
        //whereCondition: null,
        //sort: "",
        isGetRecord: true,
        servicePath: "./Services/Master/TaxService.svc",
        getRecordServiceMethod: "GetTaxSlabRecord",
        deleteServiceMethod: "DeleteTaxSlabRecord",
        caption: "Tax Slab Information",
         columns: [{ name: 'SNo', type: 'hidden'},
        { name: 'Percentage', display: 'Percentage', type: (pageType == "READ") ? "label" : "text", ctrlAttr: { controltype: pageType == "READ" ? "" : "decimal2", maxlength: 4, allowchar: '-100!100', title: "test message" }, ctrlCss: { width: "50px" }, isRequired: pageType == "READ" ? false : true, dblclick: "return false", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false" },
        { name: 'ValidFrom', display: 'Valid From', isRequired: pageType == "READ" ? false : true, type: (pageType == "READ") ? "label" : "text", ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: pageType == "READ" ? '' : 'datetype', dblclick: "return false", onchange: "return datepick(this.id)", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false", onclick: "return false;" }, },
        { name: 'ValidTo', display: 'Valid To', ctrlCss: { width: '80px', height: '20px' }, type: (pageType == "READ") ? "label" : "text", ctrlAttr: { controltype: pageType == "READ" ? '' : 'datetype', dblclick: "return false", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false", onchange: "return datepick(this.id)" }, },
        ],
        //isPaging: false,
        beforeRowAppend: function (tableID, uniqueIndex) {
           
            if(pageType=='NEW' || pageType=='EDIT')
            {
                length = $("tr[id^='tblTaxSlab_Row']").length;
                var lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];
                if ($("#tblTaxSlab_ValidTo_" + lastRowIndex).val() != '')
                {
                    $("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', true);
                    $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(false);
                    $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(false);
                    $("#tblTaxSlab_Delete_" + lastRowIndex).hide();
                    if (length - gridAddedRowCount > 0)
                    {
                    
                    //if ($("#tblTaxSlab_DomesticFlag_" + lastRowIndex).prop('checked') == true || $("#tblTaxSlab_InternationalFlag_" + lastRowIndex).prop('checked') == true)
                    //    {
                        
                            $("#tblTaxSlab_Delete_" + lastRowIndex).hide();
                            //$("#tblTaxSlab_DomesticFlag_" + lastRowIndex).prop("disabled", true);
                            //$("#tblTaxSlab_InternationalFlag_" + lastRowIndex).prop("disabled", true);
                            $("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', true);
                            $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(false);
                            $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(false);
                            return true;
                       
                    //    }
                    //else {

                    //    alert("Either Domestic or Inernational is required!!!");
                    //    return false;
                    //    }
                   
                    }
                    else { return true; }
                }
                else
                {
                    alert("Valid to date is required!!!");
                    return false;
                }
                
            }
            else
            { return true;}
        },

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            CurrentRowSno = '';
            if (pageType == 'NEW' || pageType == 'EDIT') {
                SetDateRangeValue();
                length = $("tr[id^='tblTaxSlab_Row']").length;
                lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];

                //if ($('#tblTaxSlab_ValidFrom_' + lastRowIndex).val())


                if (length > 1) {
                    var secondlastRow = $("tr[id^='tblTaxSlab_Row']:nth-last-child(2)").attr('id').split("_")[2];
                    var d = getDateNext($("#tblTaxSlab_ValidTo_" + (secondlastRow)).val());
                    var cntrlId = 'tblTaxSlab_ValidFrom_' + lastRowIndex;
                    $("#" + cntrlId).val(d);
                    var end = $("#" + cntrlId).data("kendoDatePicker");
                    end.min(d);

                    //var cntrlId = 'tblTaxSlab_ValidTo_' + lastRowIndex;
                    //$("#" + cntrlId).val('');
                    //var end = $("#" + cntrlId).data("kendoDatePicker");
                    //end.min(d);
                    $("#tblTaxSlab_ValidFrom_" + lastRowIndex).val('');
                    $("#tblTaxSlab_ValidTo_" + lastRowIndex).val('');
                }
                else {
                    $("#tblTaxSlab_ValidFrom_" + lastRowIndex).val('')
                    $("#tblTaxSlab_ValidTo_" + lastRowIndex).val('');
                }
            }
            else
                return true;
           
        },

        beforeRowRemove: function (caller, rowIndex) {
            rowDelete = true;
            CurrentRowSno = '';
            CurrentRowSno = $("tr[id^='tblTaxSlab_Row']:last").find('input[id^="tblTaxSlab_SNo_"]').val();
        },
        afterRowRemoved: function (tbWhole, rowIndex) {
            rowDelete = true;
            var RowCount = 0;
            $("[id^='tblTaxSlab_SNo']").each(function () {
                
                if($(this).val()!='')
                {
                    RowCount = RowCount + 1;
                }
            });
            
            CurrentRowSno = '';
            length = $("tr[id^='tblTaxSlab_Row']").length;
            if (pageType == 'NEW' || pageType == 'EDIT') 
            {
                var lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];
               
                if (length - RowCount > 1) {
                    if (lastRowIndex > 0) {
                        var DataSno = $("tr[id^='tblTaxSlab_Row']:last").find('input[id^="tblTaxSlab_SNo_"]').val();
                        if (DataSno == '') {
                            $("#tblTaxSlab_Delete_" + lastRowIndex).show();
                            $("#_temptblTaxSlab_Percentage_" + lastRowIndex).prop("disabled", false);
                            $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                            $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                        }
                        else {
                            var ValidFrom = Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                            var ValidTo = Date.parse($("#tblTaxSlab_ValidTo_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                            if (pageType == 'EDIT' && new Date(ValidFrom) > new Date()) {

                                $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                $("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                                $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
                            }
                            else if (pageType == 'EDIT' && (new Date(ValidTo) > new Date())) {
                                $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                            }
                        }
                    }
                }
                else {
                    if (pageType == 'NEW') {
                        $("#_temptblTaxSlab_Percentage_" + lastRowIndex).prop("disabled", false);
                        $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                        $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                    }
                    else if (pageType == 'EDIT' && length > RowCount) {
                        $("#tblTaxSlab_Delete_" + lastRowIndex).show();
                        $("#_temptblTaxSlab_Percentage_" + lastRowIndex).prop("disabled", false);
                        $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                        $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                    }
                    else {
                                if (pageType == 'EDIT')
                                {
                                    var ValidFrom = Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                                    var ValidTo = Date.parse($("#tblTaxSlab_ValidTo_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                                    if (pageType == 'EDIT' && new Date(ValidFrom) > new Date()) {

                                        $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                        $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                        $("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                                        $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
                                    }
                                    else{
                                        $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                    }
                                    // if (pageType == 'EDIT' && (new Date(ValidTo) > new Date()))
                                }
                                else {
                                    return false;
                                }
                            }
                     }
            }
        },
        hideButtons: { updateAll: true, insert: true, remove: pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            length = $("tr[id^='tblTaxSlab_Row']").length;            
            if (pageType == 'EDIT')
            {                
                if (length > 1) {
                    lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];
                    var secondlastRow = $("tr[id^='tblTaxSlab_Row']:nth-last-child(2)").attr('id').split("_")[2];

                    var ValidTo = Date.parse($("#tblTaxSlab_ValidTo_" + secondlastRow).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                    if (new Date(ValidTo) >= new Date())
                    {
                    var d = getDateNext($("#tblTaxSlab_ValidTo_" + (secondlastRow)).val());
                    var cntrlId = 'tblTaxSlab_ValidFrom_' + lastRowIndex;
                    $("#" + cntrlId).val(d);
                    var end = $("#" + cntrlId).data("kendoDatePicker");
                    end.min(d);

                    var cntrlId1 = 'tblTaxSlab_ValidTo_' + lastRowIndex;                    
                    var end = $("#" + cntrlId1).data("kendoDatePicker");
                    end.min(d); 
                    }
                    
                }
           }



            if (pageType == 'EDIT' && rowDelete==true) {
                $("tr[id^='tblTaxSlab_Row']").each(function ()
                {
                    $('#_temptblTaxSlab_Percentage_'+$(this).attr('id').split("_")[2]).attr('disabled', true);
                    $("#tblTaxSlab_ValidFrom_" + $(this).attr('id').split("_")[2]).data("kendoDatePicker").enable(false);
                    $("#tblTaxSlab_ValidTo_" + $(this).attr('id').split("_")[2]).data("kendoDatePicker").enable(false);
                    $("#tblTaxSlab_Delete_" + $(this).attr('id').split("_")[2]).hide();
                });

                lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];
                var ValidFrom = Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                var ValidTo = Date.parse($("#tblTaxSlab_ValidTo_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                if (pageType == 'EDIT' && new Date(ValidFrom) > new Date()) {

                    $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                    $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                    $("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                    $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
                }
                    // else if (pageType == 'EDIT' && (new Date(ValidTo) > new Date())) 
                else{
                    $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                }
                
            }            
        }
    });

    //On Grid Load
    if(pageType == "NEW")
    {
        // Adding blank a row in grid on load.
        $('#tblTaxSlab').appendGrid('insertRow', 1, 0);
        $("#tblTaxSlab tbody td").find("[id^='tblTaxSlab_Delete']").hide();        
        
    }
    else if (pageType == "EDIT") {
        gridAddedRowCount = $("tr[id^='tblTaxSlab_Row']").length;
        $("#tblTaxSlab tbody tr input").attr('disabled', true);
        $("input[controltype='datetype']").each(function () {
            $("#" + $(this).attr("id")).data("kendoDatePicker").enable(false);
        });
        var lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];

        
        //if ($("#tblTaxSlab_ValidTo_" + lastRowIndex).val()=='')
        //    {
        //    $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
        //    }
        $("#tblTaxSlab tbody td").find("[id^='tblTaxSlab_Delete']").hide();

        if ($("tr[id^='tblTaxSlab_Row']").length>1)
        {
            //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
            if (new Date(Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) > new Date()) {
                $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                $("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
            }
            else
                $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(false);

        $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
        }

        if(gridAddedRowCount==1)
        {
            //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
            if (new Date(Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) > new Date()) {
                $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                $("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
            }
            else
                $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(false);
           
            $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
        }
    }
    //else if (pageType == "READ") {
    //    // $("#tblTaxSlab td input").attr('disabled', true);

    //    gridAddedRowCount = $("tr[id^='tblTaxSlab_Row']").length;
    //    $("#tblTaxSlab tbody tr input").attr('disabled', true);
    //    $("input[controltype='datetype']").each(function () {
    //        $("#" + $(this).attr("id")).data("kendoDatePicker").enable(false);
    //    });
    //    var lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];
    //    if ($("#tblTaxSlab_ValidTo_" + lastRowIndex).val() == '') {
    //        $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
    //    }
    //    $("#tblTaxSlab tbody td").find("[id^='tblTaxSlab_Delete']").hide();
    //}
    else
    {
        return true;
    }
    
});
function datepick(obj) {

    if (obj.split('_')[1] == "ValidFrom") {
        var cntrlId = 'tblTaxSlab_ValidTo_' + obj.split('_')[2];
        var lastValue = $("#" + cntrlId).val();
        $("#" + cntrlId).val('');
        var end = $("#" + cntrlId).data("kendoDatePicker");
        end.min($('#' + obj).val());
        if (new Date(Date.parse($('#' + obj).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) <= new Date(Date.parse(lastValue.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')))) {
            $("#" + cntrlId).val(lastValue);
        }
  }
  //else if (obj.split('_')[1] == "ValidTo") {
  //    var cntrlId = 'tblTaxSlab_ValidFrom_' + obj.split('_')[2];
  //    if (new Date(Date.parse($('#' + cntrlId).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) > new Date())
  //    {
  //        var end = $("#" + obj).data("kendoDatePicker");
  //        end.min($('#' + cntrlId).val());          
  //    }
  //    else
  //    {
  //        $('#' + obj).val('');
  //    }
  //  }
}
function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);

        });
    }
    else {

        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}

function SaveTaxDetail() {
    var tblGrid = "tblTaxSlab";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    $("#hdnFormData").val($('#tblTaxSlab').appendGrid('getStringJson'));
}


function OnSelectCountryCodeChange() {
    try {


        $.ajax({
            url: "Services/Master/TaxService.svc/GetCityInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CountrySNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#CitySNo').val(resData[0].SNo);
                    $('#Text_CitySNo').val(resData[0].CityName);
                }
            }
        });
    }
    catch (exp) { }

}