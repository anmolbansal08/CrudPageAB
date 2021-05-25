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

     cfi.AutoCompleteV2("AirlineName", "AirlineCode,AirlineName", "AirlineChecklist_Airline", null, "contains", null, null, null, null, null);
     cfi.AutoCompleteV2("CheckListType", "Name", "AirlineChecklist_CheckListType", CheckItem, "contains");
     cfi.AutoCompleteV2("Code", "Code", "AirlineChecklist_SPHC", null, "contains");
     cfi.AutoCompleteV2("SPHCGroup", "Name", "AirlineChecklist_SPHCGroup", null, "contains");

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