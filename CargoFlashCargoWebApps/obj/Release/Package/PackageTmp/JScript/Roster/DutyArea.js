$(document).ready(function () {
    var hashColorCodeSno = ''; var hasTerminalSNo = '';
    cfi.ValidateForm();
    cfi.AutoComplete("TerminalSno", "SNo,TerminalName", "vwTerminal", "SNo", "TerminalName",null, OnSelectTerminal, "contains");
    cfi.AutoComplete("HashColorCodeSno", "HashColorName", "vwColor", "SNo", "HashColorName", null, OnSelectHashColorCode, "contains");
});

hashColorCodeSno = $("#HashColorCodeSno").val();

function OnSelectHashColorCode() {
    hashColorCodeSno = ($("#HashColorCodeSno").val() == "") ? "0" : $("#HashColorCodeSno").val();
    try {
        $.ajax({
            type: "GET",
            url: "./Services/Roster/DutyAreaService.svc/GetColorName/" + hashColorCodeSno,
            dataType: "json",
            success: function (response) {
                $("#ColorName").val(response.ColorName);
                $("span#ColorName").html(response.ColorName);
            }
        });
    }
    catch (exp) { }
}

function BindDutyAreaName() {

    var TypeCheck =$('#IsExport:checked').val();
    var Type = (TypeCheck == "0") ? "IMPORT" : "EXPORT";
    var TerminalName = $("#Text_TerminalSno").val();
    var areaName = $('#AreaName').val().toUpperCase();
    if (areaName == "" || TerminalName == "") {
        $("#DutyAreaName").val('');
        $("span#DutyAreaName").html('');
    }
    else {
        $("#DutyAreaName").val(TerminalName + ' - ' + Type + ' - ' + areaName);
        $("span#DutyAreaName").html(TerminalName + ' - ' + Type + ' - ' + areaName);
    }
}

function OnSelectTerminal() {
    BindDutyAreaName();
}

$("#AreaName").bind("change", OnSelectTerminal);

$('input[name="IsExport"]:radio').change(function () {
    BindDutyAreaName();
});
