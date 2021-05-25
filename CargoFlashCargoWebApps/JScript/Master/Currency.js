//// CheckedOut for merge
$(document).ready(function () {
    $('#CurrencyCode').keypress(function (e) {

        if (e.keyCode != 32)
            return true;
        else
            return false;
    })

    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;

    });
    // Add By Sushant 
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        var InDecimal = [{ Key: "0", value: "0", Text: "0" }, { Key: "1", value: "1", Text: "1" }, { Key: "2", value: "2", Text: "2" }, { Key: "3", value: "3", Text: "3" },
        { Key: "4", value: "4", Text: "4" }, { Key: "5", value: "5", Text: "5" }, { Key: "6", value: "6", Text: "6" }];
        cfi.AutoCompleteByDataSource("InDecimal", InDecimal, null, null);
        var InAmount = [{ Key: "0", value: "0", Text: "0" }, { Key: "5", value: "5", Text: "5" }];
        cfi.AutoCompleteByDataSource("InAmount", InAmount, null, null);
        var Basis = [{ Key: "1", value: "1", Text: "Round Up" }, { Key: "2", value: "2", Text: "Round Down" }, { Key: "3", value: "3", Text: "Round Off" }];
        cfi.AutoCompleteByDataSource("Basis", Basis, null, null);
        $("#InDecimal").before('<input type="checkbox" id="chInDecimal" value="1" name="chInDecimal" onclick="chInDecimal(this)" />');
        $("#InAmount").before('<input type="checkbox" id="chInAmount" value="0" name="chInAmount" onclick="chInAmount(this)" />');

        $("#Text_InAmount").data("kendoAutoComplete").enable(false);
        $("#chInAmount").attr("disabled", true)
        $("#Text_InAmount").removeAttr("data-valid")
        $("#Text_InDecimal").data("kendoAutoComplete").enable(true);
        $("#chInDecimal").attr("disabled", false)
        $("#Text_InDecimal").attr("data-valid", "required")
        $("#chInDecimal").attr("checked", true)
        $("#chInAmount").attr("checked", false)
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var InDecimal = [{ Key: "0", value: "0", Text: "0" }, { Key: "1", value: "1", Text: "1" }, { Key: "2", value: "2", Text: "2" }, { Key: "3", value: "3", Text: "3" },
        { Key: "4", value: "4", Text: "4" }, { Key: "5", value: "5", Text: "5" }, { Key: "6", value: "6", Text: "6" }];
        cfi.AutoCompleteByDataSource("InDecimal", InDecimal, null, null);
        var InAmount = [{ Key: "0", value: "0", Text: "0" }, { Key: "5", value: "5", Text: "5" }];
        cfi.AutoCompleteByDataSource("InAmount", InAmount, null, null);
        var Basis = [{ Key: "1", value: "1", Text: "Round Up" }, { Key: "2", value: "2", Text: "Round Down" }, { Key: "3", value: "3", Text: "Round Off" }];
        cfi.AutoCompleteByDataSource("Basis", Basis, null, null);
        $("#InDecimal").before('<input type="checkbox" id="chInDecimal" value="1" name="chInDecimal" onclick="chInDecimal(this)" />');
        $("#InAmount").before('<input type="checkbox" id="chInAmount" value="0" name="chInAmount" onclick="chInAmount(this)" />');

        if ($("#InDecimal").val() == "91") {
            $("#Text_InDecimal").val("")
            $("#InDecimal").val("")
        } else if ($("#InDecimal").val() != "91") {
            $("#chInDecimal").attr("checked", true)
            $("#Text_InAmount").data("kendoAutoComplete").enable(false);
            $("#chInAmount").attr("disabled", true)
            $("#Text_InAmount").removeAttr("data-valid")

        }
        if ($("#InAmount").val() == "91") {

            $("#Text_InAmount").val("")
            $("#InAmount").val("")
        } else if ($("#InAmount").val() != "91") {
            $("#chInAmount").attr("checked", true)
            $("#Text_InDecimal").data("kendoAutoComplete").enable(false);
            $("#chInDecimal").attr("disabled", true)
            $("#Text_InDecimal").removeAttr("data-valid")
        }


    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {

        if ($("span[id^='InDecimal']").text() == "91") {
            $("span[id^='InDecimal']").text("")
        }
        if ($("span[id^='InAmount']").text() == "91") {
            $("span[id^='InAmount']").text("")
        }
        if ($("span[id^='Basis']").text() == "1") {
            $("span[id^='Basis']").text("Round Up")
        } else if ($("span[id^='Basis']").text() == "2") {
            $("span[id^='Basis']").text("Round Down")
        } else if ($("span[id^='Basis']").text() == "3") {
            $("span[id^='Basis']").text("Round Off")
        }
        if ($("span[id^='Basis']").text() == "91") {
            $("span[id^='Basis']").text("")

        }

    }

    //$("#Text_ReceivedBy").data("kendoAutoComplete").enable(false);

});

$(document).on('change', '#chInDecimal', function () {


    if ($(this).is(':checked')) {
        $("#Text_InAmount").data("kendoAutoComplete").enable(false);
        $("#chInAmount").attr("disabled", true)
        $("#Text_InAmount").removeAttr("data-valid")
        $("#Text_InDecimal").data("kendoAutoComplete").enable(true);
        $("#chInDecimal").attr("disabled", false)
        $("#Text_InDecimal").attr("data-valid", "required")
        $("#chInDecimal").attr("checked", true)
        $("#chInAmount").attr("checked", false)
        $("#Text_InAmount").val("")
        $("#InAmount").val("")
        $("#Text_InDecimal").val("")
        $("#InDecimal").val("")
        $("#Text_Basis").val("")
        $("#Basis").val("")

        var Basis = [{ Key: "1", value: "1", Text: "Round Up" }, { Key: "2", value: "2", Text: "Round Down" }, { Key: "3", value: "3", Text: "Round Off" }];
        cfi.AutoCompleteByDataSource("Basis", Basis, null, null);

    } else {
        $("#Text_InAmount").data("kendoAutoComplete").enable(true);
        $("#chInAmount").attr("disabled", false)
        $("#Text_InAmount").attr("data-valid", "required")
        $("#Text_InDecimal").data("kendoAutoComplete").enable(false);
        $("#chInDecimal").attr("disabled", true)
        $("#chInDecimal").attr("checked", false)
        $("#chInAmount").attr("checked", true)
        $("#Text_InDecimal").removeAttr("data-valid")
        var Basis = [{ Key: "1", value: "1", Text: "Round Up" }, { Key: "2", value: "2", Text: "Round Down" }, { Key: "3", value: "3", Text: "Round Off" }];
        cfi.AutoCompleteByDataSource("Basis", Basis, null, null);
        $("#Text_InAmount").val("")
        $("#InAmount").val("")
        $("#Text_InDecimal").val("")
        $("#InDecimal").val("")
        $("#Text_Basis").val("")
        $("#Basis").val("")
    }

});






$(document).on('change', '#chInAmount', function () {

    if ($(this).is(':checked')) {
        $("#Text_InAmount").data("kendoAutoComplete").enable(true);
        $("#chInAmount").attr("disabled", false)
        $("#Text_InAmount").attr("data-valid", "required")
        $("#Text_InDecimal").data("kendoAutoComplete").enable(false);
        $("#chInDecimal").attr("disabled", true)
        $("#Text_InDecimal").removeAttr("data-valid")
        $("#chInDecimal").attr("checked", false)
        $("#chInAmount").attr("checked", true)
        var Basis = [{ Key: "1", value: "1", Text: "Round Up" }, { Key: "2", value: "2", Text: "Round Down" }, { Key: "3", value: "3", Text: "Round Off" }];
        cfi.AutoCompleteByDataSource("Basis", Basis, null, null);
        $("#Text_InAmount").val("")
        $("#InAmount").val("")
        $("#Text_InDecimal").val("")
        $("#InDecimal").val("")
        $("#Text_Basis").val("")
        $("#Basis").val("")

    } else {
        $("#Text_InAmount").data("kendoAutoComplete").enable(false);
        $("#chInAmount").attr("disabled", true)
        $("#Text_InAmount").removeAttr("data-valid")
        $("#Text_InDecimal").data("kendoAutoComplete").enable(true);
        $("#chInDecimal").attr("disabled", false)
        $("#Text_InDecimal").attr("data-valid", "required")
        $("#chInDecimal").attr("checked", true)
        $("#chInAmount").attr("checked", false)
        var Basis = [{ Key: "1", value: "1", Text: "Round Up" }, { Key: "2", value: "2", Text: "Round Down" }, {key:"3",value:"3",Text:"Roudn Off"}];
        cfi.AutoCompleteByDataSource("Basis", Basis, null, null);
        $("#Text_InAmount").val("")
        $("#InAmount").val("")
        //$("#Text_InDecimal").val("")
        //$("#InDecimal").val("")
        //$("#Text_Basis").val("")
        //$("#Basis").val("")
    }

});

