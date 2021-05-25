$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("SPHCSNo", "Code", "RateSurchargeSPHC_sphc", null, "contains");
    //cfi.AutoCompleteByDataSource("ValueType", ValueType);
    //cfi.AutoComplete("AccountSNo", "Name,SNo", "Account", "SNo", "Name", ["Name"], null, "contains");
    //$("[id$='Website']").watermark("Ex: https://www.xyz.com");
    //$("[id$='Email']").watermark("Ex: email@xyz.com");

    $("input[id=ValidTo]").change(function (e) {
        var dto = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        var dfrom = new Date(Date.parse($("#ValidFrom").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        if (dfrom > dto)
            alert('Valid To must be greater than Valid From.');
            $(this).val("");
            return false;
    })
    $("input[id=ValidFrom]").change(function (e) {

        var dfrom = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));

        var dto = new Date(Date.parse($("#ValidTo").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
        if (dfrom > dto)
            alert('Valid To must be greater than Valid From.');
            $(this).val("");
            return false;
    })

});

$(function () {
    cfi.AutoCompleteByDataSource("ValueType", ValueType);
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $('#StartWeight').attr('onchange', 'checkRange(this);');
    $('#EndWeight').attr('onchange', 'checkRange(this);');
    //$('#StartWeight').val(0);
    //$('#EndWeight').val(0);
});

function checkRange(obj) {
    var StartWeight = parseFloat($('#StartWeight').val());
    var EndWeight = parseFloat($('#EndWeight').val());

    if (StartWeight != "" && EndWeight !="") {
    if (EndWeight < StartWeight)
    {
        alert('End Weight must be greater than Start Weight.');
        $("#"+obj.id).val('');
        $("#_temp" + obj.id).val('')
        return false;
    }

 }
}
