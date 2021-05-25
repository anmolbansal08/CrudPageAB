var CreateUld = [];
var Dynamic = 0;
var EditSNo = 0;
$(document).ready(function () {
    cfi.ValidateForm();

    BindDetails();


    var todaydate = new Date();
    var validTodate = $("#endDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#SDate").change(function () {
            $("#endDate").data("kendoDatePicker").min($("#SDate").val());
            $("#endDate").data("kendoDatePicker").value('');
        });

        $("#AirlineName").val(userContext.AirlineSNo);
        $("#Text_AirlineName").val(userContext.AirlineCarrierCode);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#Text_ULDType").data("kendoAutoComplete").enable(false);
        $("#Text_Owner").data("kendoAutoComplete").enable(false);

        $("#SDate").change(function () {
            $("#endDate").data("kendoDatePicker").min($("#SDate").val());
            $("#endDate").data("kendoDatePicker").value('');
        });

        if ($("#TarriffTo").val() == "1") {
            $("#Text_AgentName").data("kendoAutoComplete").enable(false);
            $("#Text_AirlineName").data("kendoAutoComplete").enable(true);
        } else if ($("#TarriffTo").val() == "2") {
            $("#Text_AgentName").data("kendoAutoComplete").enable(true);
            $("#Text_AirlineName").data("kendoAutoComplete").enable(false);
        }
    }

});
function OnlyNumeric(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^0|[1-9]\d*$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}
function BindDetails() {
    $("#SDate").kendoDatePicker();
    $("#endDate").kendoDatePicker();
    cfi.AutoCompleteV2("ULDType", "SNo,ULDName", "ULD_Charge", null, "contains", ',');
    cfi.BindMultiValue("Text_ULDType", $("#Text_Uldtype").val(), $("#ULDType").val());
    cfi.AutoCompleteV2("country", "SNo,CountryName", "ULD_ChargeCountry", null, "contains", null, null, null, null, UnSelctCountry);
    cfi.AutoCompleteV2("City", "SNo,CityName", "ULD_ChargeCityName", null, "contains");
    cfi.AutoCompleteV2("Owner", "CarrierCode,AirlineName", "ULD_ChargeAirline", null, "contains");
    cfi.AutoCompleteV2("AirlineName", "SNo,AirlineName", "ULD_ChargeAirlineName", onselect, "contains");
    cfi.AutoCompleteV2("Currency", "sno,currencycode", "ULD_ChargeCurrency", null, "contains");
    cfi.AutoCompleteV2("AgentName", "SNo,Name", "ULD_ChargeAgentName", onselectagent, "contains");
    var Detail = [{ Key: "1", Text: "Airline" }, { Key: "2", Text: "Agent" }];
    cfi.AutoCompleteByDataSource("TarriffTo", Detail, OnChangeTarriffTo, null);
    var Type = [{ Key: "0", Text: "DAYS" }, { Key: "1", Text: "TIME" }];
    cfi.AutoCompleteByDataSource("FreeType", Type, OnChange, null);
   
}
function onselect()
{
    if ($("#Text_AirlineName").val() != "") {
        $("#Text_AgentName").data("kendoAutoComplete").enable(false);
        $("#Text_AgentName").val("");
    }
    else {
        $("#Text_AgentName").data("kendoAutoComplete").enable(true);
       
    }
}
function onselectagent() {
    if ($("#Text_AgentName").val() != "") {
        $("#Text_AirlineName").data("kendoAutoComplete").enable(false);
        $("#Text_AirlineName").val("");
    }
    else {
        $("#Text_AirlineName").data("kendoAutoComplete").enable(true);
    }
}
function OnChangeTarriffTo() {
    if ($("#TarriffTo").val() == "1") {
        $("#Text_AgentName").data("kendoAutoComplete").enable(false);
        $("#Text_AgentName").text("")
        $("#AgentName").val("0")
        $("#Text_AirlineName").data("kendoAutoComplete").enable(true);
    } else if ($("#TarriffTo").val() == "2") {
        $("#Text_AgentName").data("kendoAutoComplete").enable(true);
        $("#Text_AirlineName").data("kendoAutoComplete").enable(false);
        $("#Text_AirlineName").text("")
        $("#AirlineName").val("0")
    }
}

function OnChange() {
    if ($('#FreeType').val() == 1) {
        $('#spnfreeperiod').html('Hours');
    }
    if ($('#FreeType').val() == 0) {
        $('#spnfreeperiod').html('');
    }
}
function Clear() {
    var TarriffTo = $("#TarriffTo").val();

    if (TarriffTo == "1") {
        $("#Text_AgentName").data("kendoAutoComplete").enable(false);
        $("#Text_AirlineName").data("kendoAutoComplete").enable(true);
        $("#Text_AgentName").val('');
    }
    if (TarriffTo == "2") {
        $("#Text_AgentName").data("kendoAutoComplete").enable(false);
        $("#Text_AirlineName").data("kendoAutoComplete").enable(true);
        $("#Text_AirlineName").val('');
    }
}
function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_ULDType") {
        try {
            var Owner = $("#Owner").val()
            cfi.setFilter(filterEmbargo, "AirlineSno", "eq", Owner)
            var ULDTypeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return ULDTypeAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }

    if (textId == "Text_City") {
        try {
            var country = $("#country").val()
            cfi.setFilter(filterEmbargo, "CountrySno", "eq", country)
            var ULDTypeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return ULDTypeAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
    if (textId == "Text_Currency") {
        try {
            var country = $("#country").val()
            cfi.setFilter(filterEmbargo, "CountrySno", "eq", country)
            var ULDTypeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return ULDTypeAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }

    if (textId == "Text_AgentName") {
        try {
            var country = $("#country").val()
            var City = $("#City").val()
            if (City != "") {
                cfi.setFilter(filterEmbargo, "CountrySno", "eq", country)
                cfi.setFilter(filterEmbargo, "CitySno", "eq", City)
                var ULDTypeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            } else if(country != "")  {
                cfi.setFilter(filterEmbargo, "CountrySno", "eq", country)
                var ULDTypeAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            }
            return ULDTypeAutoCompleteFilter2;


        }
        catch (exp) {
        }
    }


}
function UnSelctCountry() {
    $("#Text_Currency").val("")
    $("#Currency").val("")
    $("#Text_City").val("")
    $("#City").val("")
    $("#Text_AgentName").val("")
    $("#AgentName").val("")
}

$(document).on('blur', '#FreePeriod', function () {

    $("#NonReturnDays").val("")
    $("#_tempNonReturnDays").val("")


});



$(document).on('change', '#NonReturnDays', function () {

    if ($("#FreePeriod").val() != "") {
        if (parseInt($("#FreePeriod").val()) > parseInt($(this).val())) {
            if ($(this).val() == "0") {
                $(this).val("0")
            } else {
                ShowMessage('warning', 'Information', "Non return days should be greater than free period.");
                $(this).val("")
            }
        }
    }
});




