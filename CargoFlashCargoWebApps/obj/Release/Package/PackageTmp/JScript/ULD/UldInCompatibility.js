$(document).ready(function () {
    cfi.ValidateForm();
    
    cfi.AutoComplete("UldTypeName", "Text_ULD", "vwULD", "SNo", "Text_ULD", ["Text_ULD"], null, "contains");
    //cfi.AutoComplete("UldTypeName", "SNo,ULDName", "vULD", "SNo", "ULDName", ["ULDName"], null, "contains");
   
    //$('#Text_UldTypeName').attr("autoFocus", "true")
    //$("#UldTypeName").data("kendoAutoComplete").attr("autoFocus", "true");
    // $("#UldTypeName").focus();

    //$('input:radio[name="faction"]').change(function () {
    //    alert('abc');
    //    alert($(this).val());

    //});
    $("[id='areaTrans_ULD_ULDInCompatibilityTrans']").EnableMultiField({
        addEventCallback: BindAutoCompleteFor,
        removeEventCallback: BindAutoCompleteForremove,
    });

    // if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    $("tr[id^='areaTrans_ULD_ULDInCompatibilityTrans']").find("input[id^='SPHC']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "SNo,Code", "vSPHCCode", "SNo", "Code", ["Code"], null, "contains", ",");
        ////if ($.inArray(36, $('#' + $(this).attr("name")).val()) && $.inArray(37, $('#' + $(this).attr("name")).val())) {
        ////    //$('#'+ $(this).attr("name")).parent().find('span').ca
    });
    // }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        PopulateMakeTransMultiSelect("ULD_ULDInCompatibilityTrans");
        $('#')
    }

    $('input[name="operation"]').click(function (e) {
        var ULDInCompatibilityInfo = new Array();
        if (cfi.IsValidSubmitSection()) {
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                SaveULD();
            }
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                UpdateULD();
            }
        }
    });

    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }
    $("#Text_UldTypeName").focus();
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var autocomplete = $("#Text_UldTypeName").data("kendoAutoComplete");
        autocomplete.enable(false);
    }
});

function BindAutoCompleteFor(elem, mainElem) {
    $(elem).find("input[id^='SPHC']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Code", "vSPHCCode", "SNo", "Code", ["Code"], null, "contains", ",");

    });
}
function BindAutoCompleteForremove(elem, mainElem) {
    $(elem).last().find("input[id^='SPHC']").attr("readonly", false);
}
function SaveULD() {
    var ULDInCompatibilityInfo = new Array();
    $('#divareaTrans_ULD_ULDInCompatibilityTrans table:last tbody tr[id^="areaTrans_ULD_ULDInCompatibilityTrans"]').each(function (row, tr) {
        ULDInCompatibilityInfo.push({
            UldTypeName: $('#UldTypeName').val(),
            Text_UldTypeName: $('#Text_UldTypeName').val(),
            SPHC1: $(tr).find("td").find("input:hidden[id^='SPHC1']").val(),
            SPHC2: $(tr).find("td").find("input:hidden[id^='SPHC2']").val(),
            IsActive: true
        });

    });
    $.ajax({
        url: "Services/ULD/ULDInCompatibilityService.svc/SaveSPHC", async: false, type: "POST", dataType: "json", cache: false,

        data: JSON.stringify({ ULDInCompatibilityInfo: ULDInCompatibilityInfo }),

        contentType: "application/json; charset=utf-8",
        success: function (result) {
            navigateUrl('Default.cshtml?Module=ULD&Apps=ULDInCompatibility&FormAction=INDEXVIEW');
        },
        error: function (xhr) {
            debugger

        }
    });
}

function UpdateULD() {
    var ULDInCompatibilityInfo = new Array();
    $('#divareaTrans_ULD_ULDInCompatibilityTrans table:last tbody tr[id^="areaTrans_ULD_ULDInCompatibilityTrans"]').each(function (row, tr) {
        var a = $(tr).find("td").find("input:radio[id^='IsActive']:checked").val();
        if (a == 0) {
            a = 1;
        }
        else
            a = 0;
        ULDInCompatibilityInfo.push({
            UldTypeName: $('#UldTypeName').val(),
            Text_UldTypeName: $('#Text_UldTypeName').val(),
            SPHC1: $(tr).find("td").find("input:hidden[id^='SPHC1']").val(),
            SPHC2: $(tr).find("td").find("input:hidden[id^='SPHC2']").val(),
            IsActive: a
        });
    });

    $.ajax({
        url: "Services/ULD/ULDInCompatibilityService.svc/UpdateSPHC", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ ULDInCompatibilityInfo: ULDInCompatibilityInfo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            navigateUrl('Default.cshtml?Module=ULD&Apps=ULDInCompatibility&FormAction=INDEXVIEW');
        },
        error: function (xhr) {
            debugger

        }
    });
}
function ExtraCondition(textId) {
    debugger;
    var AviSNo = $("[id^='divMultiSPHC'] ul li span:contains('AVI')").next('span').attr('id');
    var filterSPHC = cfi.getFilter("AND");
    var colNo = eval(textId.replace('Text_SPHC', '').split('_')[0]);
    var rowNo = (textId.replace('Text_SPHC', '').split('_')[1] == undefined ? '' : (textId.replace('Text_SPHC', '').split('_')[1]));
    if (textId.split('_')[1].indexOf('SPHC' + colNo) >= 0) {

        var a = $("input:hidden[id^='SPHC" + (colNo == 1 ? '2' : '1') + (rowNo != '' ? '_' + rowNo : '') + "']").val().replace(AviSNo, '');
        var b = $("input:hidden[id^='SPHC" + (colNo == 1 ? '1' : '2') + (rowNo != '' ? '_' + rowNo : '') + "']").val().replace(AviSNo, '');
  

        //cfi.setFilter(filterSPHC, "SNo", "notin", $("input:hidden[id^='SPHC" + (colNo == 1 ? '2' : '1') + (rowNo != '' ? '_' + rowNo : '') + "']").val());
       
        //cfi.setFilter(filterSPHC, "SNo", "notin", $("input:hidden[id^='SPHC" + (colNo == 1 ? '1' : '2') + (rowNo != '' ? '_' + rowNo : '') + "']").val());

  cfi.setFilter(filterSPHC, "SNo", "notin", a);
  cfi.setFilter(filterSPHC, "SNo", "notin", b);

    }
    //$('input[name*=SPHC1]').each(function () {
    //    cfi.setFilter(filterSPHC, "SNo", "notin", $("input:hidden[id^='SPHC1']").val());
    //});
    //$('input[name*=SPHC2]').each(function () {
    //    cfi.setFilter(filterSPHC, "SNo", "notin", $("input:hidden[id^='SPHC2']").val());
    //});

     
    //$('input[controltype=autocomplete]').each(function () {
    //    if (this.id != 'Text_UldTypeName') {
    //        var rowNo = eval(textId.replace('Text_SPHC', ''));
    //        cfi.setFilter(filterSPHC, "SNo", "notin", $("input:hidden[id^='" + this.id.replace('Text_', '') + "']").val());
    //    }

    //});
    return cfi.autoCompleteFilter(filterSPHC);
}


