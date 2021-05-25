//Created by Shivali Thakur To add round Off Currency under Tariff

$(document).ready(function () {
    var decimalv = '';
    var amountv = '';
});
function OnSelectCountry(obj) {
    $(obj).closest("tr").find("input[id^='_temptblRoundOffCurrency_Currency_']").val("");
    $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_Currency_']").val("");
    var CountryCode = $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_HdnCountryCode_']").val();
    CountryCode = CountryCode.split('-');
    var CurrencyCode = CountryCode[1];
    $(obj).closest("tr").find("input[id^='_temptblRoundOffCurrency_Currency_']").val(CurrencyCode);
    $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_Currency_']").val(CurrencyCode);
    $(obj).closest("tr").find("input[id^='_temptblRoundOffCurrency_Currency_']").attr("disabled", "disabled");
    $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_Currency_']").attr("disabled", "disabled");
}

function Selectdecimalval(obj, id) {
    var TableNamerowIndex = id.split('_')[0];
    var rowIndex = id.split('_')[2];
     amountv = $("#tblRoundOffCurrency_InAmount_" + rowIndex).val()
    var checkd = $("#" + id + ':checked').length === 1 ? 'true' : 'false';
    var checkededecimal = $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_DecimalSelect_']:checked").length === 1 ? 'true' : 'false';
    if (checkededecimal == 'true') {
        $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_AmountSelect_']").attr("checked", false);  
        $("select[id^='tblRoundOffCurrency_InAmount_" + rowIndex + "']").removeAttr('required');
        if (amountv != '')
        {
            $("#tblRoundOffCurrency_InAmount_" + rowIndex).val('-1');
            $("#tblRoundOffCurrency_InAmount_" + rowIndex).attr("disabled", "disabled");
            $("#tblRoundOffCurrency_InDecimal_" + rowIndex).attr("disabled", false);
        }      
        $('#tblRoundOffCurrency_Basis_' + rowIndex).val('-1');       
        $('#tblRoundOffCurrency_Basis_' + rowIndex).removeAttr("data-valid");
        $('#_temptblRoundOffCurrency_Basis_' + rowIndex).removeAttr("class");
        $('#_temptblRoundOffCurrency_Basis_' + rowIndex).attr("class", "k-formatted-value k-input transSection k-state-default");
        $("select[id^='tblRoundOffCurrency_InDecimal_" + rowIndex + "']").attr('required', 'required');
        $("select[id^='tblRoundOffCurrency_InDecimal_" + rowIndex + "']").attr('data-valid', 'required');
        $("select[id^='tblRoundOffCurrency_InAmount_" + rowIndex + "']").removeAttr("data-valid", "");
        $("select[id^='tblRoundOffCurrency_InAmount_" + rowIndex + "']").removeAttr('required');
       
       
    }
    else if (checkededecimal == 'false') {
        $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_InDecimal_']").attr("data-valid", "");

        $('#tblRoundOffCurrency_Basis_' + rowIndex).attr("data-valid", "min[1],required");
    }
}
function Selectamountval(obj, id) {
    var TableNamerowIndex = id.split('_')[0];
    var rowIndex = id.split('_')[2];
    decimalv = $("#tblRoundOffCurrency_InDecimal_" + rowIndex).val()
    var checkedamount = $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_AmountSelect_']:checked").length === 1 ? 'true' : 'false';
    if (checkedamount == 'true') {
        $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_DecimalSelect_']").attr("checked", false);
        if (decimalv != '')
        {
            $("#tblRoundOffCurrency_InDecimal_" + rowIndex).val('-1');
            $("#tblRoundOffCurrency_InDecimal_" + rowIndex).attr("disabled", "disabled");
            $("#tblRoundOffCurrency_InAmount_" + rowIndex).attr("disabled", false);       
        }
        $('#tblRoundOffCurrency_Basis_' + rowIndex).attr("data-valid", "min[1],required");
        $("select[id^='tblRoundOffCurrency_InAmount_" + rowIndex + "']").attr('required', 'required');
        $("select[id^='tblRoundOffCurrency_InAmount_" + rowIndex + "']").attr('data-valid', 'required');
        $("select[id^='tblRoundOffCurrency_InDecimal_" + rowIndex + "']").removeAttr("required");
        $("select[id^='tblRoundOffCurrency_InDecimal_" + rowIndex + "']").attr('data-valid', '');
        
    }
    else if (checkedamount == 'false') {       
        $(obj).closest("tr").find("input[id^='_temptblRoundOffCurrency_InAmount_']").attr("data-valid", "");
        $(obj).closest("tr").find("input[id^='tblRoundOffCurrency_InAmount_']").attr("data-valid", "");     
        $('#tblRoundOffCurrency_Basis_' + rowIndex).val('-1');  
        $('#tblRoundOffCurrency_Basis_' + rowIndex).removeAttr("data-valid");
        $('#_temptblRoundOffCurrency_Basis_' + rowIndex).removeAttr("class");
        $('#_temptblRoundOffCurrency_Basis_' + rowIndex).attr("class", "k-formatted-value k-input transSection k-state-default");
    }
}
function CalculatedDecimal(id) {

    var TableNamerowIndex = id.split('_')[0];
    var rowIndex = id.split('_')[2];
    var decimalamount = $('#' + id).val();
    var decimalamount1 = parseFloat(decimalamount).toFixed(0);
     $('#' + id).val(decimalamount1);

}

function Setroundval(evt, rid) {   
}
pageType = $("#hdnPageType").val();
$(function () {
    debugger
    // Initialize appendGrid
    $('#tblRoundOffCurrency').appendGrid({
        tableID: "tblRoundOffCurrency",
        contentEditable: true,
        masterTableSNo: $("#hdnRoundOffCurrencySNo").val(),
        isGetRecord: true,
        servicePath: "./Services/Tariff/RoundOffCurrencyService.svc",
        getRecordServiceMethod: "GetRoundOffCurrencySlabRecord",
        deleteServiceMethod: "DeleteRoundOffCurrencySlabRecord",
        caption: "Round Off Currency Slab Information",
        columns: [{ name: 'SNo', type: 'hidden' },
        {
            name: 'CountryCode', display: 'Country Code/Name', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return OnSelectCountry(this);" }, ctrlCss: { width: '120px', height: '20px' }, isRequired: true, AutoCompleteName: 'CountryCode_Name', filterField: 'CurrencyCode', filterCriteria: "contains"
        },
        { name: 'Currency', display: 'Currency', type: "text", ctrlAttr: { controltype: 'text' }, ctrlCss: { width: '120px', height: '20px' }, isRequired: false },
          { name: 'DecimalSelect', display: '', type: 'checkbox', ctrlAttr: { controltype: 'checkbox', onclick: "return Selectdecimalval(this,this.id);" }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
       // { name: 'InDecimal', display: 'In Decimal', type: (pageType == "READ") ? "label" : "text", ctrlAttr: { controltype: pageType == "READ" ? "" : "decimal2", maxlength: 3, allowchar: '-100!100', title: "test message", onblur: "return CalculatedDecimal(this.id);" }, ctrlCss: { width: "120px" }, dblclick: "return false", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false" },
          { name: 'InDecimal', display: 'In Decimal', type: 'select', ctrlOptions: { '-1': ' ', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6' }, ctrlCss: { width: '120px', height: '20px' }, isRequired: true },
          { name: 'AmountSelect', display: '', type: 'checkbox', ctrlAttr: { controltype: 'checkbox', onclick: "return Selectamountval(this,this.id);" }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
          { name: 'InAmount', display: 'In Amount', type: 'select', ctrlOptions: { '-1': ' ', '1': '1', '5': '5' }, ctrlCss: { width: '120px', height: '20px' }, isRequired: true },
        // { name: 'InAmount', display: 'In Amount', type: (pageType == "READ") ? "label" : "text", ctrlAttr: { controltype: pageType == "READ" ? "" : "decimal2", maxlength: 8, allowchar: '-100!100', title: "test message" }, ctrlCss: { width: "120px" }, dblclick: "return false", onpaste: "return false", ondrop: "return false", oncontextmenu: "return false" },
        { name: 'Basis', display: 'Basis', type: 'select', onChange: function (evt, rowIndex) { Setroundval(evt, rowIndex) }, ctrlOptions: { '-1': ' ', '1': 'Round Up', '2': 'Round Near' }, ctrlCss: { width: '120px', height: '20px' }, isRequired: true }

        ],
        // isRequired: pageType == "READ" ? false : true,
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            $("tr[id^='tblRoundOffCurrency']").each(function (row, tr) {
                $(tr).find("input[id^='tblRoundOffCurrency_CountryCode_']").attr("data-valid", "required");
                $(tr).find("input[id^='tblRoundOffCurrency_InDecimal_']").attr("data-valid", "");
                $(tr).find("input[id^='tblRoundOffCurrency_InAmount_']").attr("data-valid", "");
                $(tr).find("input[id^='tblRoundOffCurrency_Basis_']").attr("data-valid", "");


            });
        },
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, removeLast: true },

        // hideButtons: { updateAll: false, insert: false, removeLast: false, append: true },

    });
    if (pageType == "READ" || pageType == "EDIT") {
        $("#tblRoundOffCurrency_btnAppendRow").hide();
        var v = $("#_temptblRoundOffCurrency_InDecimal_1").val();
        var v1 = $("#tblRoundOffCurrency_InAmount_1").val();
        if (v == undefined) {
            //$("#tblRoundOffCurrency_DecimalSelect_1").attr("disabled", "disabled");
            $("#tblRoundOffCurrency_InDecimal_1").attr("disabled", "disabled");
            $("#tblRoundOffCurrency_InDecimal_1" + rowIndex).attr("data-valid", "required");
        }
        if (v1 == undefined) {
            //$("#tblRoundOffCurrency_AmountSelect_1").attr("disabled", "disabled");
            $("#tblRoundOffCurrency_InAmount_1").attr("disabled", "disabled");
            $("#tblRoundOffCurrency_InAmount_1").attr("data-valid", "required");
        }
    }
    if (pageType=="DELETE") {
        $("#tblRoundOffCurrency_btnAppendRow").hide();       
    }

});


$("input[name='operation']").click(function () {



        SaveRoundOffCurrencyDetail();
   
});
function SaveRoundOffCurrencyDetail() {
    var arrVal = [];
    var tblGrid = "tblRoundOffCurrency";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    $("#hdnFormData").val(btoa($('#tblRoundOffCurrency').appendGrid('getStringJson')));
    //Added By Shivali Thakur
    var rowcount = $('#tblRoundOffCurrency tbody tr').length;
    for (var i = 1; i <= rowcount; i++) {
        $("#tblRoundOffCurrency_CountryCode_" + i).attr("newvalue", $("#tblRoundOffCurrency_CountryCode_"+i).val())
        $("#tblRoundOffCurrency_Currency_" + i).attr("newvalue", $("#tblRoundOffCurrency_Currency_" + i).val())
        $("#tblRoundOffCurrency_InDecimal_" + i).attr("newvalue", $("#tblRoundOffCurrency_InDecimal_" + i).val())
        $("#tblRoundOffCurrency_InAmount_" + i).attr("newvalue", $("#tblRoundOffCurrency_InAmount_" + i).val())
        $("#tblRoundOffCurrency_Basis_" + i).attr("newvalue", $("#tblRoundOffCurrency_Basis_" + i+" "+"option:selected").text())


        var oldval = $("#tblRoundOffCurrency_CountryCode_" + i).attr("oldvalue") + "/"+$("#tblRoundOffCurrency_Currency_" + i).attr("oldvalue")+"/"+$("#tblRoundOffCurrency_InDecimal_" + i).attr("oldvalue")+"/"+$("#tblRoundOffCurrency_InAmount_" + i).attr("oldvalue")+"/"+ $("#tblRoundOffCurrency_Basis_" + i).attr("oldvalue");
        var newval = $("#tblRoundOffCurrency_CountryCode_" + i).attr("newvalue") + "/" + $("#tblRoundOffCurrency_Currency_" + i).attr("newvalue") + "/" + $("#tblRoundOffCurrency_InDecimal_" + i).attr("newvalue") + "/" + $("#tblRoundOffCurrency_InAmount_" + i).attr("newvalue") + "/" + $("#tblRoundOffCurrency_Basis_" + i).attr("newvalue");
        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "RoundOffCurrency", ColumnName: $("#tblRoundOffCurrency_Currency_1").val(), OldValue: oldval, NewValue: newval };
        arrVal.push(a);
    }
    SaveAppendGridAuditLog("Country Code", $("#tblRoundOffCurrency_Currency_1").val(), "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

}

function ExtraCondition(textId) {

    var filterCountryCode = cfi.getFilter("AND");
    if (textId.indexOf("tblRoundOffCurrency_CountryCode") >= 0) {
        var filtertblRoundOffCurrency_CountryCode = cfi.getFilter("AND");
        for (var i = 0; i <= 20; i++) {
            if ($('#tblRoundOffCurrency_CountryCode_' + [i]).val() != undefined && $('#tblRoundOffCurrency_CountryCode_' + [i]).val() != '' && 'tblRoundOffCurrency_CountryCode_' + [i] != 'tblRoundOffCurrency_CountryCode_' + textId.split('_')[2])
                cfi.setFilter(filtertblRoundOffCurrency_CountryCode, "SNo", "notin", $('#tblRoundOffCurrency_HdnCountryCode_' + [i]).val().split('-')[0]);
        }
        filterCountryCode = cfi.autoCompleteFilter(filtertblRoundOffCurrency_CountryCode);
        return filterCountryCode;
    }
}