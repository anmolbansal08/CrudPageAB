$(function () {
    $('tr').find('td.form2buttonrow').remove();
    //$('tr').find('td.formActiontitle').remove();

    $('#FromDate').data().kendoDatePicker;
    $('#ToDate').data().kendoDatePicker;
 //   $('#FromDate').val('');
    $('#FromDate').focus();

  //  $('#ToDate').val('');
    $('#ToDate').focus();

    cfi.AutoCompleteV2("AgentAirline", "Name", "WorkOrder_Account", null, "contains");
    cfi.AutoCompleteV2("AWB", "AWBNo", "WorkOrder_AWBNo", null, "contains");//AWB
    cfi.AutoCompleteV2("ULD", "ULDNo", "WorkOrder_ULD", null, "contains"); // Vuldnameuld
    cfi.AutoCompleteV2("SLI", "SLINo", "WorkOrder_SLINo", null, "contains");//SLIAWB
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "WorkOrder_FlightNo", null, "contains");//VDailyFlightNo
    $('#FlightDate').data("kendoDatePicker").value(null);
    $("input[name=Type]:radio").click(function () {
        if ($(this).attr("value") == "0") {
            cfi.ResetAutoComplete("AgentAirline");
            //var dataSource = new kendo.data.DataSource({
            //    data: []
            //});
            //var autocomplete = $("#Text_AgentAirline").data("kendoAutoComplete");
            //autocomplete.setDataSource(dataSource);
            //cfi.AutoComplete("AgentAirline", "Name", "Account", "SNo", "Name", null, null, "contains");
            var data = GetDataSourceV2("AgentAirline", "WorkOrder_Account", null);
            cfi.ChangeAutoCompleteDataSource("AgentAirline", data, true, null, "Name", "contains");
            $('span#spnAgentAirline').text('Forwarder(Agent)');
        }
        else {
            cfi.ResetAutoComplete("AgentAirline");
            //var dataSource = new kendo.data.DataSource({
            //    data: []
            //});
            //var autocomplete = $("#Text_AgentAirline").data("kendoAutoComplete");
            //autocomplete.setDataSource(dataSource);
            //cfi.AutoComplete("AgentAirline", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            var data = GetDataSourceV2("AgentAirline", "WorkOrder_Airline", null);
            cfi.ChangeAutoCompleteDataSource("AgentAirline", data, true, null, "CarrierCode,AirlineName", "contains");
            $('span#spnAgentAirline').text('Airline');
        }
    });
    $('input:button[id=Search]').click(function () {

        SearchIndexView();
    });

    $("input[name=AWBType]:radio").click(function () {
        $('#AWB').val('');
        $('#Text_AWB').val('');
    });

    if (getParameterByName("Type", "") == "0") {
        $('input[type="radio"][data-radioval="Agent"]').attr('checked', true);
        $('input[type="radio"][data-radioval="Airline"]').removeAttr('checked');
        cfi.ResetAutoComplete("AgentAirline");
        var data = GetDataSourceV2("AgentAirline", "WorkOrder_Account", null);
        cfi.ChangeAutoCompleteDataSource("AgentAirline", data, true, null, "Name", "contains");
        $('span#spnAgentAirline').text('Forwarder(Agent)');
    }
    else if (getParameterByName("Type", "") == "1") {
        $('input[type="radio"][data-radioval="Agent"]').removeAttr('checked');
        $('input[type="radio"][data-radioval="Airline"]').attr('checked', true);
        cfi.ResetAutoComplete("AgentAirline");
        var data = GetDataSourceV2("AgentAirline", "WorkOrder_Airline", null);
        cfi.ChangeAutoCompleteDataSource("AgentAirline", data, true, null, "CarrierCode,AirlineName", "contains");
        $('span#spnAgentAirline').text('Airline');
    }

    if (getParameterByName("AWBType", "") == "0") {
        $('input[type="radio"][data-radioval="Export"]').attr('checked', true);
        $('input[type="radio"][data-radioval="Import"]').removeAttr('checked');
    }
    else if (getParameterByName("AWBType", "") == "1") {
        $('input[type="radio"][data-radioval="Export"]').removeAttr('checked');
        $('input[type="radio"][data-radioval="Import"]').attr('checked', true);
    }

    $("#AgentAirline").val(getParameterByName("AgentAirline", ""));
    $("#Text_AgentAirline").val(getParameterByName("AgentAirlineName", ""));

    $("#FlightNo").val(getParameterByName("FlightNo", ""));
    $("#Text_FlightNo").val(getParameterByName("FlightNo", ""));

    $("#FlightDate").val(getParameterByName("FlightDate", ""));
    $("#Text_FlightDate").val(getParameterByName("FlightDate", ""));

    $("#AWB").val(getParameterByName("AWB", ""));
    $("#Text_AWB").val(getParameterByName("AWBNo", ""));

    $("#ULD").val(getParameterByName("ULD", ""));
    $("#Text_ULD").val(getParameterByName("ULDNo", ""));

    $("#SLI").val(getParameterByName("SLI", ""));
    $("#Text_SLI").val(getParameterByName("SLINo", ""));
});
function GetData(Id, SNo) {
    PopUpData(SNo);
    cfi.PopUp("divpopUp", "Work Order Charges");
}
function SearchIndexView() {
    var AWBType = 0;
    var Type = "";
    if ($('input[type="radio"][data-radioval="Export"]').is(':checked') == true)
        AWBType = 0;
    else if ($('input[type="radio"][data-radioval="Import"]').is(':checked') == true)
        AWBType = 1;

    if ($("input[name='Type']:checked").val() == "" || $("input[name='Type']:checked").val() == "0")
        Type = "0";
    else
        Type = "1";

    navigateUrl('Default.cshtml?Module=Report&Apps=WorkOrder&FormAction=INDEXVIEW&Type=' + Type + '&AgentAirline=' + $("#AgentAirline").val() + '&FlightNo=' + $("#FlightNo").val() + '&FlightDate=' + $("#FlightDate").val() + '&AWB=' + $("#AWB").val() + '&AWBType=' + AWBType + '&ULD=' + $("#ULD").val() + '&SLI=' + $("#SLI").val() + '&AgentAirlineName=' + $("#Text_AgentAirline").val() + '&AWBNo=' + $("#Text_AWB").val() + '&ULDNo=' + $("#Text_ULD").val() + '&SLINo=' + $("#Text_SLI").val() + '&FromDate=' + $("#FromDate").val() + '&ToDate=' + $("#ToDate").val());
}
function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_AWB") {
        var AWBType
        if ($('input[type="radio"][data-radioval="Export"]').is(':checked') == true)
            AWBType = 0;
        else if ($('input[type="radio"][data-radioval="Import"]').is(':checked') == true)
            AWBType = 1;

        cfi.setFilter(filter, "SNo", "neq", 0);
        cfi.setFilter(filter, "AWBType", "eq", AWBType)
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }
}
function PopUpData(SNos) {
    var SNo = SNos;
    $.ajax({
        url: "Services/Report/WorkOrderService.svc/WorkOrderTable",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            SNo: SNo
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData1 = jQuery.parseJSON(result)
            var GroupSNo = "*";
            var theDiv = document.getElementById("divpopUp");
            theDiv.innerHTML = "";
            var table = "<table class='appendGrid ui-widget' id='tblWorkOrderData'><thead class='ui-widget-header' style='text-align:center'>";
            table += "<tr><td class='ui-widget-header'>Charge Value</td><td class='ui-widget-header'>Rate</td><td class='ui-widget-header'>Amount</td><td class='ui-widget-header'>Description</td><td class='ui-widget-header'>Remarks</td></tr></thead><tbody class='ui-widget-content'>";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    for (var i = 0; i < myData.Table0.length; i++) {
                        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].ChargeValue + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Rate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Amount + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Description + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Remarks + "</td></tr>";
                    }
                    table += "</tbody></table>";
                    theDiv.innerHTML += table;
                }
                else {
                    var table = "<table class='appendGrid ui-widget' id='tblWorkOrderData'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                    theDiv.innerHTML += table;
                }
            }
            return false
        }
    });
}
function PrintSlip(SNo) {
    window.open("HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + SNo + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function Print(InvoiceSNo, DOSNo) {
    var Type = "DO";
    if (Type == "DO")
        window.open("HtmlFiles/DeliveryOrder/DeliveryOrder.html?DOSNo=" + (DOSNo == "" ? 0 : DOSNo) + "&Type=" + Type + "&InvoiceSNo=" + InvoiceSNo);
}