$(document).ready(function () {
     $("[name=ISGROUP]").click(function () {
        if ($('input[type="radio"]:checked').val() == "0")
        {
            cfi.ResetAutoComplete("SPHCGroup");
            $("#Text_Code").data("kendoAutoComplete").enable(true);
            $("#Text_SPHCGroup").data("kendoAutoComplete").enable(false);
        }
        else
        {
            cfi.ResetAutoComplete("Code");
            $("#Text_Code").data("kendoAutoComplete").enable(false);
            $("#Text_SPHCGroup").data("kendoAutoComplete").enable(true);
        }
    });

    cfi.AutoComplete("AirlineName", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineName", null, null, "contains", null, null, null, null, null);
    cfi.AutoComplete("CheckListType", "Name", "CheckListType", "SNo", "Name", null, CheckItem, "contains");
    cfi.AutoComplete("Code", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains");
    cfi.AutoComplete("SPHCGroup", "Name", "SPHCGroup", "SNo", "Name", null, null, "contains");

    if ($('input[type="radio"]:checked').val() == "0")
        $("#Text_SPHCGroup").data("kendoAutoComplete").enable(false);
    else
        $("#Text_Code").data("kendoAutoComplete").enable(false);
});

function CheckItem() {
    $.ajax({
        type: "POST",
        url: "./Services/Master/AirlineCheckListService.svc/ItemValue?ItmVal=" + $("#CheckListType").val(),
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            $("#ISType").text('');
            $("#_spanDASHTYPE_").text(response.Data[0]);
        }
    });
}