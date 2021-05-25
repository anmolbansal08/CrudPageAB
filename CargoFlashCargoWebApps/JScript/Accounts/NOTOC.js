$(function () {
    LoadNOTOCDetails();
});


function LoadNOTOCDetails() {
    _CURR_PRO_ = "NOTOC";
    //  _CURR_OP_ = "Master Acceptance";
    //$("#licurrentop").html(_CURR_OP_);
    //$("#divSearch").html("");
    //$("#divShipmentDetails").html("");
    //CleanUI();
    $.ajax({
        url: "Services/Accounts/NOTOCService.svc/GetWebForm/" + _CURR_PRO_ + "/Accounts/NOTOCSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            //$("#divFooter").html(fotter).show();

            cfi.AutoCompleteV2("SearchBoardingPoint", "AirportCode", "NOTOC_Airport", null, "contains");
         
            cfi.AutoCompleteV2("searchDestinationCity", "CityCode,CityName", "NOTOC_City", null, "contains");
            cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "NOTOC_FlightNo", null, "contains");
            //$("#__tblfblsearch__ tr").append("<td><button class='btn btn-block btn-primary' style='width:90px; height:26px' id='btnInitiateFBR' onclick=FBR();>Initiate FBR</button></td>");
            //$("#__tblfblsearch__ tbody").append("<div id='divInitiateFBR'></div>")
            $("#__tblnotocsearch__").find('input[name^=Text_SearchBoardingPoint]').closest('span').css('width', '130px')
            $("#__tblnotocsearch__").find('input[name^=Text_searchDestinationCity]').closest('span').css('width', '140px')
                
            $('#searchFlightDate').data("kendoDatePicker").value("");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                //CleanUI();
                //ShipmentSearch();
            });
        }
    });
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
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });
}












var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divNOTOCDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <div id='divDetail'></div></td></tr></table></div>";