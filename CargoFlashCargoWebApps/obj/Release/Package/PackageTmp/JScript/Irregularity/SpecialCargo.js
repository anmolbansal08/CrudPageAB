$(function () {
    LoadSpecialCargoDetails();
});

var _CURR_PRO_ = "SpecialCargo";

function LoadSpecialCargoDetails()
{
    $("#divSearch").html("");
    $("#divSpecialCargoDetails").html("");
    $.ajax({
        url: "Services/Irregularity/SpecialCargoService.svc/GetWebForm/" + _CURR_PRO_ + "/Irregularity/SpecialCargoSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            cfi.AutoComplete("SpecialCargoType", "SpecialCargoType", "vwSpecialCargoType", "SpecialCargoType", "SpecialCargoType", ["SpecialCargoType"], onchange, "contains");
            cfi.AutoComplete("SpecialCargoNo", "SpecialCargoNo", "vwSpecialCargoNo", "SpecialCargoNo", "SpecialCargoNo", ["SpecialCargoNo"], null, "contains");
            
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                SpecialCargoSearch();
            });
        }
    });
}
function SpecialCargoSearch() {
    var SpecialCargoType = $("#SpecialCargoType").val() == "" ? "0" : $("#SpecialCargoType").val();
    var SpecialCargoNo = $("#SpecialCargoNo").val() == "" ? "0" : $("#SpecialCargoNo").val();
    cfi.ShowIndexView("divSpecialCargoDetails", "Services/Irregularity/SpecialCargoService.svc/GetGridData/" + _CURR_PRO_ + "/Irregularity/SpecialCargoSearch/" + SpecialCargoType + "/" + SpecialCargoNo);

}
function DownloadDoc(ID, SNo){
    
    window.location.href = "Handler/UploadImage.ashx?SpecialCargoSNo=" + SNo;
}
function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("table[cfi-aria-search='search']").find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
}
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divSpecialCargoDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <div id='divDetail'></div></td></tr></table></div>";

var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};
function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_SpecialCargoNo") {
        cfi.setFilter(filter, "SpecialCargoType", "neq", 0);
        cfi.setFilter(filter, "SpecialCargoType", "eq", $("#Text_SpecialCargoType").data("kendoAutoComplete").key())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }
}

function onchange()
{
    $("#SpecialCargoNo").val('');
    $("#Text_SpecialCargoNo").val('');
}