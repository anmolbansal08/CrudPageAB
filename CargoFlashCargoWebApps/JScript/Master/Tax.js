/// <reference path="../../Scripts/references.js" />
var pageType = "";
var gridAddedRowCount = 0;
var length = 0;
var CurrentRowSno = '';
var rowDelete = false;
$(document).ready(function () {

    $("input#MasterDuplicate").hide();
    cfi.ValidateForm();
    cfi.AutoCompleteV2("CountrySNo", "CountryCode,CountryName","Tax_CountryCode", OnSelectCountryCodeChange, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName","Tax_CityName", null, "contains");


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


    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //    debugger
    //    AuditLogSaveNewValue("divbody");
    //}
    var Ownership = [{ Key: "0", Text: "DOMESTIC" }, { Key: "1", Text: "INTERNATIONAL" }];
    cfi.AutoCompleteByDataSource("TaxType", Ownership);
    $("input[name='operation']").click(function () {
       
        SaveTaxDetail();

        //var SKeyValue = "";
        //var FormAction = "";
        //var KeyValue = "";
        //var TerminalSNo = "";
        //var TerminalName = "";
        //var KeyColumn = "TaxCode";
        //FormAction = getQueryStringValue("FormAction").toUpperCase();
        //KeyValue = document.getElementById('__SpanHeader__').innerText;
        //TerminalSNo = userContext.TerminalSNo;
        //TerminalName = userContext.NewTerminalName;
        //Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName);
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        if (cfi.IsValidSubmitSection()) {
          // SaveTaxDetail();
            return true;
        } else {
            return false
        }
       
    });

  




  
    //$("input[name='operation']").unbind('click').click(function () {
    //    debugger
    //    dirtyForm.isDirty = false;//to track the changes
    //    _callBack();
        
       
    //    if (cfi.IsValidSubmitSection())
    //    {
    //        debugger
            
    //        SaveTaxDetail();


    //        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //            debugger
            
    //            AuditLogSaveNewValue("divbody");
    //        }
    //        return true;
            
    //    }
    //    else {
    //        return false
    //    }

    //    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //        debugger
    //        var FormAction = getQueryStringValue("FormAction").toUpperCase()
    //        AuditLogSaveNewValue("divbody", FormAction);
    //    }

    //});
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
                    //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('enabled', false);
                    //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(false);
                    //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(false);
                    $("#tblTaxSlab_Delete_" + lastRowIndex).hide();
                    if (length - gridAddedRowCount > 0)
                    {
                    
                    //if ($("#tblTaxSlab_DomesticFlag_" + lastRowIndex).prop('checked') == true || $("#tblTaxSlab_InternationalFlag_" + lastRowIndex).prop('checked') == true)
                    //    {
                        
                            $("#tblTaxSlab_Delete_" + lastRowIndex).hide();
                            $("#tblTaxSlab_DomesticFlag_" + lastRowIndex).prop("enabled", true);
                            $("#tblTaxSlab_InternationalFlag_" + lastRowIndex).prop("enabled", true);
                            //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('enabled', false);
                            //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(false);
                            //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(false);
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
                if (pageType == 'NEW') {
                    SetDateRangeValue();
                }
                length = $("tr[id^='tblTaxSlab_Row']").length;
                lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];

                //if ($('#tblTaxSlab_ValidFrom_' + lastRowIndex).val())


                if (length > 1) {
                    var secondlastRow = $("tr[id^='tblTaxSlab_Row']:nth-last-child(2)").attr('id').split("_")[2];
                    var d = getDateNext($("#tblTaxSlab_ValidTo_" + (secondlastRow)).val());
                    var cntrlId = 'tblTaxSlab_ValidFrom_' + lastRowIndex;
                    //$("#" + cntrlId).val(d);
                    //var end = $("#" + cntrlId).data("kendoDatePicker");
                    //end.min(d);

                    //var cntrlId = 'tblTaxSlab_ValidTo_' + lastRowIndex;
                    //$("#" + cntrlId).val('');
                    //var end = $("#" + cntrlId).data("kendoDatePicker");
                    //end.min(d);
                    $("#tblTaxSlab_ValidFrom_" + lastRowIndex).val('');
                    $("#tblTaxSlab_ValidTo_" + lastRowIndex).val('');
                }
                else {
                    //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).val('')
                    //$("#tblTaxSlab_ValidTo_" + lastRowIndex).val('');
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
                            //$("#_temptblTaxSlab_Percentage_" + lastRowIndex).prop("disabled", false);
                            //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                            //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                        }
                        else {
                            var ValidFrom = Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                            var ValidTo = Date.parse($("#tblTaxSlab_ValidTo_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                            if (pageType == 'EDIT' && new Date(ValidFrom) > new Date()) {

                                //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                                $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
                            }
                            else if (pageType == 'EDIT' && (new Date(ValidTo) > new Date())) {
                                //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                            }
                        }
                    }
                }
                else {
                    if (pageType == 'NEW') {
                        $("#_temptblTaxSlab_Percentage_" + lastRowIndex).prop("enabled", false);
                        $("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                        $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                        CheckValidity();
                    }
                    else if (pageType == 'EDIT' && length > RowCount) {
                        $("#tblTaxSlab_Delete_" + lastRowIndex).show();
                        //$("#_temptblTaxSlab_Percentage_" + lastRowIndex).prop("disabled", false);
                        //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                        //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                    }
                    else {
                        CheckValidity();
                                if (pageType == 'EDIT')
                                {
                                    
                                    var ValidFrom = Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                                    var ValidTo = Date.parse($("#tblTaxSlab_ValidTo_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                                    if (pageType == 'EDIT' && new Date(ValidFrom) > new Date()) {

                                        //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                        //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                                        //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
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
                    //$('#_temptblTaxSlab_Percentage_'+$(this).attr('id').split("_")[2]).attr('disabled', true);
                    //$("#tblTaxSlab_ValidFrom_" + $(this).attr('id').split("_")[2]).data("kendoDatePicker").enable(false);
                    //$("#tblTaxSlab_ValidTo_" + $(this).attr('id').split("_")[2]).data("kendoDatePicker").enable(false);
                    $("#tblTaxSlab_Delete_" + $(this).attr('id').split("_")[2]).hide();
                });

                lastRowIndex = $("tr[id^='tblTaxSlab_Row']:last").attr('id').split("_")[2];
                var ValidFrom = Date.parse($("#tblTaxSlab_ValidFrom_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                var ValidTo = Date.parse($("#tblTaxSlab_ValidTo_" + lastRowIndex).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '));
                if (pageType == 'EDIT' && new Date(ValidFrom) > new Date()) {

                    //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                    //$("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                    //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                    $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
                }
                    // else if (pageType == 'EDIT' && (new Date(ValidTo) > new Date())) 
                else{
                    $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
                }
                
            }
            CheckValidity();
        }
    });

    //On Grid Load
    if(pageType == "NEW")
    {
        // Adding blank a row in grid on load.
        $('#tblTaxSlab').appendGrid('insertRow', 1, 0);
        $("#tblTaxSlab tbody td").find("[id^='tblTaxSlab_Delete']").hide();        
        $("#tblTaxSlab_ValidTo_" + 1).data("kendoDatePicker").value('');
        $("#tblTaxSlab_ValidFrom_" + 1).data("kendoDatePicker").value('');
    }
    else if (pageType == "EDIT") {
        gridAddedRowCount = $("tr[id^='tblTaxSlab_Row']").length;
        //$("#tblTaxSlab tbody tr input").attr('disabled', true);
        //$("input[controltype='datetype']").each(function () {
        //    $("#" + $(this).attr("id")).data("kendoDatePicker").enable(false);
        //});
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
                //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
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
                //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(true);
                //$("tr[id^='tblTaxSlab_Row_" + lastRowIndex + "']").find('input').attr('disabled', false);
                $("tr[id^='tblTaxSlab_Row']:last").find("[id^='tblTaxSlab_Delete']").show();
            }
            else
                //$("#tblTaxSlab_ValidFrom_" + lastRowIndex).data("kendoDatePicker").enable(false);
           
            $("#tblTaxSlab_ValidTo_" + lastRowIndex).data("kendoDatePicker").enable(true);
        }
        CheckValidity();
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
        CheckValidity();
        return true;
    }
    CheckValidity();
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
  else if (obj.split('_')[1] == "ValidTo") {
      var cntrlId = 'tblTaxSlab_ValidFrom_' + obj.split('_')[2];
      if (new Date(Date.parse($('#' + cntrlId).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 '))) > new Date())
      {
          var end = $("#" + obj).data("kendoDatePicker");
          end.min($('#' + cntrlId).val());          
      }
      else
      {
          //$('#' + obj).val('');
      }
    }
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
    $("#hdnFormData").val(btoa($('#tblTaxSlab').appendGrid('getStringJson')));
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


$(document).on('blur', '[name^=tblTaxSlab_ValidTo_]', function (e) {
    var Today = new Date();
    var currID = e.currentTarget.id;
    var Curr = $('#' + e.currentTarget.id).val();
    var RowNo = parseInt(e.currentTarget.id.split('_')[2])
    var dto = new Date(Date.parse(Curr));
    $("#tblTaxSlab tbody tr td").find('[id*="tblTaxSlab_ValidFrom_"]').each(function () {
        var i = $(this).attr('id').split('_')[2]
        var validFrom = $("#tblTaxSlab_ValidFrom_" + i).val();
        var dfo = new Date(Date.parse(validFrom));
        if (dto >= dfo && parseInt(i) > RowNo) {
            $("#" + currID).data("kendoDatePicker").value('');
          //  $("#tblTaxSlab_ValidFrom_" + i).data("kendoDatePicker").value('');
            alert('Valid to should not be equal/greater than Valid from of next Tax slab');
            return;
        }
        else if (dto < dfo && parseInt(i) == RowNo) {
            $("#" + currID).data("kendoDatePicker").value('');
          //  $("#tblTaxSlab_ValidTo_" + i).data("kendoDatePicker").value('');
            alert('Valid to should be equal/greater than Valid from');
            return;
        }
    });
});

$(document).on('blur', '[name^=tblTaxSlab_ValidFrom_]', function (e) {
    var Today = new Date();
    var RowNo = parseInt(e.currentTarget.id.split('_')[2])
    var currID = e.currentTarget.id;
    var Curr = $('#' + e.currentTarget.id).val();
    var dfo = new Date(Date.parse(Curr));
    if (dfo <= Today) {
        $("#" + currID).data("kendoDatePicker").value('');
        alert('Valid from must be greater than current date');
        return;
    }
    $("#tblTaxSlab tbody tr td").find('[id*="tblTaxSlab_ValidTo_"]').each(function () {
        var i = $(this).attr('id').split('_')[2]
        var validto = $("#tblTaxSlab_ValidTo_" + i).val();
        var ndto = new Date(Date.parse(validto));

        var validfo = $("#tblTaxSlab_ValidFrom_" + i).val();
        var ndfo = new Date(Date.parse(validfo));
        if (dfo <= ndto && parseInt(i) < RowNo) {
            $("#" + currID).data("kendoDatePicker").value('');
           // $("#tblTaxSlab_ValidTo_" + i).data("kendoDatePicker").value('');
            alert('Valid from should be greater than Valid to of previous Tax slab ');
            return;
        }
     
        else if (dfo >= ndfo && parseInt(i) > RowNo) {
            $("#" + currID).data("kendoDatePicker").value('');
               alert('Valid from should be less than Valid from of next Tax slab');
            return;
        }
        else if (dfo<= ndfo && parseInt(i) < RowNo) {
            $("#" + currID).data("kendoDatePicker").value('');
            alert('Valid from should be greater than Valid from of previous Tax slab');
            return;
        }
    })
});




function CheckValidity() {

    pageType1 = $("#hdnPageType").val();
    if (pageType1 == "EDIT") {
        $("#tblTaxSlab tbody tr td").find('[id*="tblTaxSlab_ValidTo_"]').each(function () {
            var i = $(this).attr('id').split('_')[2]
            var dvf = $("#tblTaxSlab_ValidFrom_" + i).data("kendoDatePicker").value()
            var dvft = $("#tblTaxSlab_ValidTo_" + i).data("kendoDatePicker").value()
            var today = new Date()
            if (dvf <= today) {
                $("#tblTaxSlab_Percentage_" + i).attr('disabled', true);
                $("#tblTaxSlab_ValidFrom_" + i).data("kendoDatePicker").enable(false);
            }
            if (dvft <= today) {
                $("#tblTaxSlab_ValidTo_" + i).data("kendoDatePicker").enable(false);
            }
        })
    }
}