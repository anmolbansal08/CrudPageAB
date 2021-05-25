$(document).ready(function ()
{
    $('input[type="button"][value="Back"]').after('<input type="button" value="Clear " id="ClearAll" class="btn btn-inverse">');
    cfi.AutoCompleteV2("ULDTypeSno", "ULDName,ULDName", "ULD_DemurrageFreePeriod", null, "contains", ",");
    cfi.AutoCompleteV2("AirlineSNo", "AirlineName,AirlineName", "ULD_DemurrageFreeAirline", AirlineSNoclick, "contains", ",");
    cfi.AutoCompleteV2("AgentSNo", "Name,Name", "ULD_DemurrageFreeName", AgentSNoclick, "contains", ",");
    cfi.AutoCompleteV2("ShipperSNo", "Name,Name", "ULD_DemurrageCustomerName", ShipperSNoclick, "contains", ",");
    cfi.BindMultiValue("ULDTypeSno", $("#Text_ULDTypeSno").val(), $("#ULDTypeSno").val());
    cfi.BindMultiValue("AirlineSNo", $("#Text_AirlineSNo").val(), $("#AirlineSNo").val());
    cfi.BindMultiValue("AgentSNo", $("#Text_AgentSNo").val(), $("#AgentSNo").val());
    cfi.BindMultiValue("ShipperSNo", $("#Text_ShipperSNo").val(), $("#ShipperSNo").val());
    var Type = [{ Key: "0", Text: "DAYS" }, { Key: "1", Text: "HOURS" }];
    cfi.AutoCompleteByDataSource("TypeSNo", Type, onchange);

    if ((getQueryStringValue("FormAction").toUpperCase() == "READ") || (getQueryStringValue("FormAction").toUpperCase() == "DELETE"))
    {
        $('#ClearAll').hide();
    }

    $('#ClearAll').on('click', function ()
    {
        ClearAll();
    });
    if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT"))
    {
        $('#FreeDaysSNo').closest('tr').nextAll().hide();

        if ($('#AirlineSNo').val() != "")
        {
            $("#Text_AgentSNo").data("kendoAutoComplete").enable(false);
            $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
        }
        else if ($('#AgentSNo').val() != "")
        {
            $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
            $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
        }
        else if ($('#ShipperSNo').val() != "")
        {
            $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
            $("#Text_AgentSNo").data("kendoAutoComplete").enable(false);    
        }
    }
})
$("input[name='operation'][value=Save]").click(function ()
{
    SaveDetails();
}); 

$('#MasterSaveAndNew').on('click', function ()
{
    SaveDetails();
});
function ClearAll()
{
    $("#divMultiAirlineSNo").remove();
    $("#divMultiAgentSNo").remove();
    $("#divMultiShipperSNo").remove();
    $("#AgentSNo").val('');
    $("#Text_AgentSNo").val('');
    $("#Text_ShipperSNo").val('');
    $("#Text_AirlineSNo").val('');
    $("#ShipperSNo").val('');
    $("#AirlineSNo").val('');
    cfi.BindMultiValue("AirlineSNo", "", "");
    cfi.BindMultiValue("AgentSNo", "", "");
    cfi.BindMultiValue("ShipperSNo", "", "");

    
    cfi.AutoCompleteV2("AirlineSNo", "AirlineName,AirlineName", "ULD_DemurrageFreeAirline", AirlineSNoclick, "contains", ",");
    cfi.AutoCompleteV2("AgentSNo", "Name,Name", "ULD_DemurrageFreeName", AgentSNoclick, "contains", ",");
    cfi.AutoCompleteV2("ShipperSNo", "Name,Name", "ULD_DemurrageCustomerName", ShipperSNoclick, "contains", ",");
   
    $("#Text_AgentSNo").data("kendoAutoComplete").enable(true);
    $("#Text_ShipperSNo").data("kendoAutoComplete").enable(true);
    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(true);
}

function AirlineSNoclick()
{
    $("#Text_AgentSNo").data("kendoAutoComplete").enable(false);
    $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
}

function AgentSNoclick()
{
    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
    $("#Text_ShipperSNo").data("kendoAutoComplete").enable(false);
}

function ShipperSNoclick()
{
    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
    $("#Text_AgentSNo").data("kendoAutoComplete").enable(false);
}
function ExtraCondition(textId)
{
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_ULDTypeSno")
    {
        try
        {
            cfi.setFilter(filterAirline, "ULDName", "notin", $("#Text_ULDTypeSno").val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        {
        }
    }
    if (textId == "Text_AirlineSNo")
    {
        try
        {
            cfi.setFilter(filterAirline, "AirlineName", "notin", $("#Text_AirlineSNo").val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        {
        }
    }
    if (textId == "Text_AgentSNo")
    {
        try
        {
            cfi.setFilter(filterAirline, "Name", "notin", $("#Text_AgentSNo").val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        {
        }
    }
    if (textId == "Text_ShipperSNo")
    {
        try
        {
            cfi.setFilter(filterAirline, "Name", "notin", $("#Text_ShipperSNo").val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        {
        }
    }
}
var value = $('#text').val();
if (value == "")
{
   
    // hide the submit button..so that he will not send the form to server
    $('#submit').hide();
}
else
{
    $('#submit').show();
}

function SaveDetails()
{
    if ($('#ULDTypeSno').val() == '' || $('#FreeDaysSNo').val() == '')
    {
        ShowMessage("warning", "warning - Demurrage Free period !", "Mandatory Fields Can't be blank !...");
        return false;
    }
    var res =
    {
        ULDTypeSno: $("#ULDTypeSno").val(),
        AirlineSNo: $("#AirlineSNo").val(),
        AgentSNo: $("#AgentSNo").val(),
        ShipperSNo: $("#ShipperSNo").val(),
        TypeSNo: $("#TypeSNo").val(),
        FreeDaysSNo: $("#FreeDaysSNo").val()  
    };

    var action = "SaveDetails";
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/ULD/DemurrageFreePeriodService.svc/" + action,
        data: JSON.stringify(res),
        success: function (response)
        {
            ShowMessage("success", "", "Saved successfully...");
            window.location.reload(true);
        }
    });
}




