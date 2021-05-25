var isAgent = false;
$(document).ready(function () {
    cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("OriginSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("DestinationSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("FlightSNo", "FlightNo", "vwAllotmentReleaseFlights", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    cfi.AutoComplete("AccountSNo", "Name", "AllotmentAgents", "SNo", "Name", ["Name"], selectAgent, "contains");
    cfi.AutoComplete("AllotmentType", "AllotmentType", "AllotmentType", "SNo", "AllotmentType", ["AllotmentType"], selectAgent, "contains");
    cfi.AutoComplete("AllotmentSNo", "AllotmentCode", "vwAllotmentRelease_Allotment", "SNo", "AllotmentCode", ["AllotmentCode"], null, "contains");
    cfi.AutoComplete("ShipperAccountSNo", "Name", "vw_AccountShipper", "SNo", "Name", ["Name"], selectAgent, "contains");
    cfi.AutoComplete("OfficeSNo", "Name", "vw_Office", "SNo", "Name", ["Name"], selectAgent, "contains");
    cfi.DateType("FlightDate");


    if (userContext.GroupName == 'ADMIN') {
        if (userContext.AirlineSNo != 0)
            cfi.SetValueAutoComplete('AirlineSNo', userContext.AirlineSNo);
        //$('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
        //$('#Text_AirlineSNo_input').val(userContext.AirlineName);
        if (userContext.OfficeSNo!=0)
        cfi.SetValueAutoComplete('OfficeSNo', userContext.OfficeSNo);
        //$('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        //$('#Text_OfficeSNo_input').val(userContext.OfficeName);
        
        if (userContext.AgentSNo != 0)
        cfi.SetValueAutoComplete('AccountSNo', userContext.AgentSNo);
        //$('#AccountSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        //$('#Text_AccountSNo_input').val(userContext.AgentName);

    }

    else if (userContext.GroupName == 'AGENT') {
        isAgent = true;
        if (userContext.AirlineSNo != 0)
            cfi.SetValueAutoComplete('AirlineSNo', userContext.AirlineSNo);

        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        //$('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
        //$('#Text_AirlineSNo_input').val(userContext.AirlineName);

        if (userContext.OfficeSNo != 0)
            cfi.SetValueAutoComplete('OfficeSNo', userContext.OfficeSNo);

        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        //$('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        //$('#Text_OfficeSNo_input').val(userContext.OfficeName);
        if (userContext.AgentSNo != 0)
            cfi.SetValueAutoComplete('AccountSNo', userContext.AgentSNo);

        cfi.EnableAutoComplete('AccountSNo', false, false, null);//diasble

        cfi.EnableAutoComplete('ShipperAccountSNo', false, true, null);//diasble
        //$('#AccountSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        //$('#Text_AccountSNo_input').val(userContext.AgentName);
    }


    else if (userContext.GroupName == 'FORWARDER') {
        isAgent = true;
        if (userContext.AirlineSNo != 0)
            cfi.SetValueAutoComplete('AirlineSNo', userContext.AirlineSNo);

        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        //$('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
        //$('#Text_AirlineSNo_input').val(userContext.AirlineName);
        
        if (userContext.OfficeSNo != 0)
            cfi.SetValueAutoComplete('OfficeSNo', userContext.OfficeSNo);

        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        //$('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        //$('#Text_OfficeSNo_input').val(userContext.OfficeName);
        if (userContext.AgentSNo != 0)
            cfi.SetValueAutoComplete('AccountSNo', userContext.AgentSNo);

        cfi.EnableAutoComplete('AccountSNo', false, false, null);//diasble
       
        cfi.EnableAutoComplete('ShipperAccountSNo', false, true, null);//diasble
        //$('#AccountSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        //$('#Text_AccountSNo_input').val(userContext.AgentName);
    }
    else if (userContext.GroupName == 'OFFICE') {
        if (userContext.AirlineSNo != 0)
            cfi.SetValueAutoComplete('AirlineSNo', userContext.AirlineSNo);

        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        //$('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
        //$('#Text_AirlineSNo_input').val(userContext.AirlineName);
        if (userContext.OfficeSNo != 0)
            cfi.SetValueAutoComplete('OfficeSNo', userContext.OfficeSNo);

        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        //$('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        //$('#Text_OfficeSNo_input').val(userContext.OfficeName);
    }
});

function GetGridData() {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    $("#grid").html('');
    var AirlineSNo = $("#AirlineSNo").val();
    var OriginSNo = $("#OriginSNo").val();
    var DestinationSNo = $("#DestinationSNo").val();
    var FlightSNo = $("#Text_FlightSNo_input").val();
    var OfficeSNo = $("#OfficeSNo").val();
   // if (userContext.GroupName == 'FORWARDER') {
   //     var OfficeSNo = $("#OfficeSNo").val();
   // }
   // else if (userContext.GroupName == 'FORWARDER') {
   //     var OfficeSNo = $("#OfficeSNo").val();
   // }
   //else if (userContext.GroupName == 'FORWARDER') {
   //     var OfficeSNo = $("#OfficeSNo").val();
   // }

    var AccountSNo = $("#AccountSNo").val();
    var ShipperAccountSNo = $("#ShipperAccountSNo").val();
    var AllotmentType = $("#AllotmentType").val();
    var AllotmentSNo = $("#AllotmentSNo").val();
    var FlightDate = $('#FlightDate').val();

    $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetFlightData",
                    datatype: 'json',
                    method: 'post',
                    data: { AirlineSNo: AirlineSNo, FlightDate: FlightDate, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo, FlightSNo: FlightSNo, OfficeSNo: OfficeSNo, AccountSNo: AccountSNo, ShipperAccountSNo: ShipperAccountSNo, AllotmentType: AllotmentType, AllotmentSNo: AllotmentSNo }
                }
            }, parameterMap: function (data, operation) {
                alert(JSON.stringify(data));
                return JSON.stringify(data);
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        FlightNo: { type: "string" },
                        FlightDate: { type: "string" },
                        Origin: { type: "string" },
                        Destination: { type: "string" },
                        // DepDate: { type: "string" },
                        ETD_ETA: { type: "string" },
                        TotalGroUsedAvail: { type: "string" },
                        TotalVolUsedAvail: { type: "string" },
                        ReserveGroUsedAvail: { type: "string" },
                        ReserveVolUsedAvail: { type: "string" },
                        AllotmentGroUsedAvail: { type: "string" },
                        AllotmentVolUsedAvail: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: false,
            serverSorting: false
        },
        //filterable: true,
        //sortable: true,
        pageable: true,
        detailInit: GetAgentData,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "FlightNo", title: "Flight No" },
            { field: "FlightDate", title: "Flight Date" },
            { field: "Origin", title: "Origin" },
            { field: "Destination", title: "Destination" },
            { field: "ETD_ETA", title: "ETD/ETA" },
            { title: "Total", columns: [{ field: "TotalGroUsedAvail", title: "Gross/Avail/Used" }, { field: "TotalVolUsedAvail", title: "Volume/Avail/Used" }] },
            //{ field: "TotalGroUsedAvail", title: "Total Gross/Used/Avail" },
            //{ field: "TotalVolUsedAvail", title: "Total Volume/Used/Avail" },
            { title: "Reserve", columns: [{ field: "ReserveGroUsedAvail", title: "Gross/Avail/Used" }, { field: "ReserveVolUsedAvail", title: "Volume/Avail/Used" }] },
            //{ field: "ReserveGroUsedAvail", title: "Reserve Gross/Used/Avail" },
            //{ field: "ReserveVolUsedAvail", title: "Reserve Volume/Used/Avail" },

            { title: "Allotment", columns: [{ field: "AllotmentGroUsedAvail", title: "Gross/Avail/Used" }, { field: "AllotmentVolUsedAvail", title: "Volume/Avail/Used" }] },
            //{ field: "AllotmentGroUsedAvail", title: "Allotment Gross/Used/Avail" },
            //{ field: "AllotmentVolUsedAvail", title: "Allotment Volumne/Used/Avail" }
        ]
    });
}

function GetAgentData(e) {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    var AirlineSNo = $("#AirlineSNo").val();
    var OriginSNo = $("#OriginSNo").val();
    var DestinationSNo = $("#DestinationSNo").val();
    var FlightSNo = $("#Text_FlightSNo_input").val();
    var OfficeSNo = $("#OfficeSNo").val();
    var AccountSNo = $("#AccountSNo").val();
    var ShipperAccountSNo = $("#ShipperAccountSNo").val();
    var AllotmentType = $("#AllotmentType").val();
    var AllotmentSNo = $("#AllotmentSNo").val();
    var FlightDate = $('#FlightDate').val();

    //function updateKendoGrid(options) {
    //    $.ajax({
    //        url: "UpdateAgentData", data: {},
    //        success: function (resut) {
    //            options.success();
    //        }
    //    });
    //}

    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetAgentData",
                    datatype: 'json',
                    method: 'post',
                    data: { DailyFlightSNo: e.data.SNo, AirlineSNo: AirlineSNo, FlightDate: FlightDate, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo, FlightSNo: FlightSNo, OfficeSNo: OfficeSNo, AccountSNo: AccountSNo, ShipperAccountSNo: ShipperAccountSNo, AllotmentType: AllotmentType, AllotmentSNo: AllotmentSNo }
                },
                //update: updateKendoGrid
                update: {
                    url: "UpdateAgentData",
                    datatype: 'json',
                    complete: function (data) {
                        var Message = JSON.parse(data.responseText).Errors;
                        confirm(Message)
                        if (Message.toUpperCase().indexOf("UPDATE SUCCESSFULLY.") > 0) { 
                            GetGridData();
                        }
                    }
                }
            }
            ,
            requestEnd: function (e) {
                var response = e.response;
                var type = e.type;
                //alert(type);
                //debugger

            },
            error: function (e) {
                // handle error
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            parameterMap: function (data, operation) {
                alert(JSON.stringify(data));
                return JSON.stringify(data);
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        SNo: { type: "string", editable: false, },
                        DailyFlightAllotmentSNo: { type: "string", editable: false },
                        // Office: { type: "string", editable: false },
                        Agent: { type: "string", editable: false },
                        //Shipper: { type: "string", editable: false },
                        AllotmentType: { type: "string", editable: false },
                        AllotmentCode: { type: "string", editable: false },
                        AvaGross: { type: "number", editable: false },
                        AvaVol: { type: "number", editable: false },
                        Gross: { type: "string", editable: false },
                        Volume: { type: "string", editable: false },
                        TotalReleaseGross: { type: "string", editable: false },
                        TotalReleaseVol: { type: "string", editable: false },
                        //Commodity: { type: "string", editable: false },
                        //Commodity_Type: { type: "string", editable: false },
                        //SHC: { type: "string", editable: false },
                        //SHC_Type: { type: "string", editable: false },
                        //Product: { type: "string", editable: false },
                        //Product_Type: { type: "string", editable: false },
                        RemainingReleaseTime: { type: "string", editable: false },
                        AutoRelease: { type: "string", editable: false },
                        ReleaseGross: {
                            type: "number", validation: { required: true, min: 1, maxlength: 9 }, keypress: function (e) {

                            }
                        },
                        ReleaseVol: { type: "number", validation: { required: true, min: 0.001, maxlength: 9 } },
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; },
            },
            pageSize: 10,
            serverPaging: true,
           // serverFiltering: true,


            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: false,
        sortable: false,
        pageable: true,
        detailInit: GetShipmentData,
        //edit: function (e) {
        //    debugger;
        //},
        save: function (e) {

            if(parseFloat(e.model.AvaGross)<parseFloat(e.model.ReleaseGross))
            {
                
                alert("Available Gross Weight can not be greater than Release Gross Weight.");
               
                e.preventDefault();
                $(e.container).find('.k-grid-cancel').click();
            }
            else if (parseFloat(e.model.AvaVol) < parseFloat(e.model.ReleaseVol))
            {

                alert("Available Volume can not be greater than Release Volume.");
                
                e.preventDefault();
                $(e.container).find('.k-grid-cancel').click();              
            }

            if (parseFloat(e.model.AvaGross) == parseFloat(e.model.ReleaseGross) && parseFloat(e.model.AvaVol) != parseFloat(e.model.ReleaseVol))
            {
                if (confirm("Release Volume will be zero"))
                {
                    e.model.ReleaseVol = parseFloat(e.model.AvaVol).toFixed(3);
                }                
            }
            //else if (parseFloat(e.model.AvaVol) == parseFloat(e.model.ReleaseVol) && parseFloat(e.model.AvaGross) != parseFloat(e.model.ReleaseGross)) {
            //    if (confirm("Release Gross Weight will be zero")) {
            //        e.model.ReleaseGross = parseFloat(e.model.AvaGross).toFixed(2);
            //    }
            //}
            //e.preventDefault();
        },
        dataBound: function (e) {
           // debugger;
            var grid = this;
            grid.table.find('.k-grid-edit').each(function () {
                var btnEdit = $(this);
                var tr = btnEdit.closest('tr');
                var data = grid.dataItem(tr);

                if (data.RemainingReleaseTime == "00:00 (Hr:Min)")
                {
                    tr.find('td:contains("00:00 (Hr:Min)")').wrapInner("<span style='color:red !important;'></span>");
                    btnEdit.hide();
                }
                else if(parseFloat(data.AvaGross)==0.00)
                {
                    btnEdit.hide();
                }
                else if (parseFloat(data.AvaVal) == 0.000) {
                    btnEdit.hide();
                }
                //var date = new Date(); 
                //date.setHours(0, 0, 0, 0); 
                //if( Date.parse(date)>Date.parse($('#FlightDate').val()))
                //{
                //    btnEdit.hide();
                //}
                //btnEdit.hide();

            });

            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            //{ field: "Office", title: "Office " },
            { field: "Agent", title: "Allocated To" },
            //{ field: "Shipper", title: "Shipper" },
            { field: "AllotmentType", title: "Allotment Type" },
            { field: "AllotmentCode", title: "Allotment Code" },
            //{ field: "Gross", title: "Gross Weight" },            
            //{ field: "Volume", title: "Volume" },            
            //{ field: "Commodity", title: "Commodity" },
            //{ field: "Commodity_Type", title: "Commodity Type" },
            //{ field: "SHC", title: "SHC" },
            //{ field: "SHC_Type", title: "SHC Type" },
            //{ field: "Product", title: "Product" },
            //{ field: "Product_Type", title: "Product Type" },
            { title: "Total", columns: [{ field: "Gross", title: "Gross/Avail/Used" }, { field: "Volume", title: "Volume/Avail/Used" }] },
            { title: "Total Released", columns: [{ field: "TotalReleaseGross", title: "Gross Weight" }, { field: "TotalReleaseVol", title: "Volume" }] },
            { field: "RemainingReleaseTime", title: "Remaining Release Time" },
            { field: "AutoRelease", title: "Auto Release" },
            { field: "ReleaseGross", title: "Release Gross Weight" ,format: '{0:0}'},
            { field: "ReleaseVol", title: "Release Volume", format: '{0:0.000}' },
            { command: ["edit"], title: "Action",hidden:isAgent },
        ],
        editable: "inline"
    });
}

function ReleaseHistory(SNo)
{
    alert('HI');
}


function GetShipmentData(e) {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    var AirlineSNo = $("#AirlineSNo").val();
    var OriginSNo = $("#OriginSNo").val();
    var DestinationSNo = $("#DestinationSNo").val();
    var FlightSNo = $("#Text_FlightSNo_input").val();
    var OfficeSNo = $("#OfficeSNo").val();
    var AccountSNo = $("#AccountSNo").val();
    var ShipperAccountSNo = $("#ShipperAccountSNo").val();
    var AllotmentType = $("#AllotmentType").val();
    var AllotmentSNo = $("#AllotmentSNo").val();
    var FlightDate = $('#FlightDate').val();
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetShipmentData",
                    datatype: 'json',
                    method: 'post',
                    data: { DailyFlightSNo: e.data.SNo, AirlineSNo: AirlineSNo, FlightDate: FlightDate, OriginSNo: OriginSNo, DestinationSNo: DestinationSNo, FlightSNo: FlightSNo, OfficeSNo: OfficeSNo, AccountSNo: AccountSNo, ShipperAccountSNo: ShipperAccountSNo, AllotmentType: AllotmentType, AllotmentSNo: AllotmentSNo }
                }
            },
            parameterMap: function (data, operation) {
                alert(JSON.stringify(data));
                return JSON.stringify(data);
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        AWBNo: { type: "string" },
                        Origin: { type: "string" },
                        Destination: { type: "string" },
                        //FlightNo: { type: "string" },
                        //FlightDate: { type: "string" },
                        //ETD_ETA: { type: "string" },
                        Pieces: { type: "string" },
                        Gross: { type: "string" },
                        Volume: { type: "string" },
                        Product: { type: "string" },
                        Commodity: { type: "string" },
                      //  AircraftType: { type: "string" },
                        AllotmentCode: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; },
            },
            pageSize: 20,
            serverPaging: true,
           // serverFiltering: true
        },
        pageable: true,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "AWBNo", title: "Ref. No./AWB No." },
              { field: "Origin", title: "Origin" },
            { field: "Destination", title: "Destination" },
            //{ field: "FlightNo", title: "Flight No" },
            //{ field: "FlightDate", title: "Flight Date" },
            //{ field: "ETD_ETA", title: "ETD/ETA" },
              { field: "Pieces", title: "Pieces" },
            { field: "Gross", title: "Gross Weight" },
            { field: "Volume", title: "Volume" },
            { field: "Product", title: "Product" },
            { field: "Commodity", title: "Commodity" },
           // { field: "AircraftType", title: "Aircraft Type" },
            { field: "AllotmentCode", title: "Allotment Code" }
        ]
    });

}

function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_AllotmentSNo") {

        if( $('#AllotmentType').val()!="")
        {
            cfi.setFilter(filterEmbargo, "AllotmentTypeSNo", "eq", $('#AllotmentType').val());
        }

        if ($('#AccountSNo').val() != "") {

            cfi.setFilter(filterEmbargo, "AccountSNo", "eq", $('#AccountSNo').val());
        }
        else if ($('#ShipperAccountSNo').val() != "") {
            cfi.setFilter(filterEmbargo, "ShipperAccountSNo", "eq", $('#ShipperAccountSNo').val());
        }
        else if ($('#OfficeSNo').val() != "") {
            cfi.setFilter(filterEmbargo, "OfficeSNo", "eq", $('#OfficeSNo').val());
        }
        else {
            cfi.setFilter(filterEmbargo, "SNo", "neq", 0);
        }
        var RT_Filter = cfi.autoCompleteFilter(filterEmbargo);
        return RT_Filter;
    }

    else if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $('#AirlineSNo').val());
        var RT_Filter = cfi.autoCompleteFilter(filterEmbargo);
        return RT_Filter;
    }

    else if (textId == "Text_AccountSNo") {
        if ($('#OfficeSNo').val() != '') {
            cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#AirlineSNo").val());
            cfi.autoCompleteFilter(filterEmbargo);
            cfi.setFilter(filterEmbargo, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoAutoComplete").key());
        }
        else {
            cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#AirlineSNo").val());
        }
        var RT_Filter = cfi.autoCompleteFilter(filterEmbargo);
        return RT_Filter;
    }

    else if (textId == "Text_ShipperAccountSNo")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "AirlineSNo", "eq", $("#AirlineSNo").val()), cfi.autoCompleteFilter(textId);

    else if (textId == "Text_AllotmentType")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "neq", 4), cfi.autoCompleteFilter(textId);

    else if (textId == "Text_DestinationSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#OriginSNo").val()), cfi.autoCompleteFilter(textId);
    }

    else if (textId == "Text_OriginSNo") {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.autoCompleteFilter(filterEmbargo);
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#DestinationSNo").val()), cfi.autoCompleteFilter(textId);
    }


    else if (textId == "Text_FlightSNo") {
        if ($('#OriginSNo').val()!='')
            cfi.setFilter(filterEmbargo, "OriginAirportSNo", "eq", $("#OriginSNo").val());
        if ($('#DestinationSNo').val() != '')
            cfi.setFilter(filterEmbargo, "DestinationAirportSNo", "eq", $("#DestinationSNo").val());

       cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#AirlineSNo").val());
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);

        var RT_Filter = cfi.autoCompleteFilter(filterEmbargo);
        return RT_Filter;
    }
}

function selectAgent() {
    $('#AllotmentSNo').val('');
    $('#Text_AllotmentSNo').val('');
}