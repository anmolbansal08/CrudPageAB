

$(document).ready(function () {
    cfi.AutoCompleteV2("AirportSNo", "AirportCode,AirportName", "WarehouseUtilization_Airport", null, "contains");
    cfi.AutoCompleteV2("TerminalSNo", "TerminalName", "WarehouseUtilization_Terminal", null, "contains");
    cfi.AutoCompleteV2("WarehouseSNo", "Warehouse", "WarehouseUtilization_Warehouse", null, "contains");
    cfi.AutoCompleteV2("StorageAreaSNo", "SubAreaName", "WarehouseUtilization_StorageArea", null, "contains");
});

function GetGridData() {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    $("#grid").html('');

    $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetWarehouseUtilizationData",
                    datatype: 'json',
                    method: 'post',
                    data: {
                        Location: "",
                        Warehouse: $('#WarehouseSNo').val() || "",
                        SubArea: $('#StorageAreaSNo').val() || "",
                        Airport: $('#AirportSNo').val()||"",
                        Terminal: $('#TerminalSNo').val() || "",
                        GridType: 0
                    }
                }
            }, parameterMap: function (options) {
                if (options.filter == undefined) options.filter = null; if (options.sort == undefined) options.sort = null; return JSON.stringify(options);
            },

            schema: {
                model: {
                    id: "SNo",
                    fields: {                        
                        Airport: { type: "string" },
                        Warehouse: { type: "string" },
                        Type: { type: "string" },
                        Terminal: { type: "string" },
                        TotalGross: { type: "string" },                        
                        TotalVol: { type: "string" },
                        AWBs: { type: "string" },
                        TotalGrossUsed: { type: "string" },
                        TotalVolUsed: { type: "string" },
                        TotalGrossAvail: { type: "string" },
                        TotalVolAvail: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; },
            },
            filterable: {
                mode: "menu"
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
        },
        filterable: false,
        sortable: false,
        pageable: {
            refresh: true, pageSizes: true, previousNext: true,
            numeric: true, buttonCount: 5, totalinfo: false,
        },
        detailInit: GetSubAreaData,
        dataBound: onGridDataBound,
        columns: [
            {
                field: "Airport", title: "Airport", filterable: true, sortable: true
            },
            {
                field: "Warehouse", title: "Warehouse", filterable: true, sortable: true
            },
            {
                field: "Type", title: "Type", filterable: true, sortable: true
            },
            {
                field: "Terminal", title: "Terminal", filterable: true, sortable: true
            },
            {
                title: "Total Capacity",
                columns:
                    [{ field: "TotalGross", title: "Gross (KG)", filterable: false, sortable: false }, { field: "TotalVol", title: "Volume(CBM)", filterable: false, sortable: false }]
            },
            {
                title: "Utilised",
                columns: [{ field: "AWBs", title: "AWBs", filterable: false, sortable: false }, { field: "TotalGrossUsed", title: "Gross (KG)", filterable: false }, { field: "TotalVolUsed", title: "Volume(CBM)", filterable: false, sortable: false }]
            },
            {
                title: "Remaining",
                columns: [{ field: "TotalGrossAvail", title: "Gross (KG)", filterable: false, sortable: false }, { field: "TotalVolAvail", title: "Volume(CBM)", filterable: false, sortable: false }]
            }
        ]
    });
}

function GetSubAreaData(e) {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetSubAreaData",
                    datatype: 'json',
                    method: 'post',
                    data: {
                        Location: "",
                        Warehouse: e.data.SNo || "",
                        SubArea: $('#StorageAreaSNo').val() || "",
                        Airport: $('#AirportSNo').val() || "",
                        Terminal: $('#TerminalSNo').val() || "",
                        GridType: 1
                    }
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
                        StorageArea: { type: "string"},
                        Airline: { type: "string" },
                        SHC: { type: "string" },
                        DestCountry: { type: "string" },
                        DestCity: { type: "string" },
                        Agent: { type: "string" },
                        Type: { type: "string" },
                        SubLocationType: { type: "string" },
                        TotalGross: { type: "string" },
                        TotalVol: { type: "string" },
                        AWBs: { type: "string" },
                        TotalGrossUsed: { type: "string" },
                        TotalVolUsed: { type: "string" },
                        TotalGrossAvail: { type: "string" },
                        TotalVolAvail: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: true,
        filterable: false,
        sortable: false,
        pageable: true,
        detailInit: GetRackData,        
        dataBound: function (e) {
            
        },
        columns: [
            {
                field: "StorageArea", title: "Storage Area", filterable: true
            },
            {
                field: "Airline", title: "Airline", filterable: true
            },
            {
                field: "SHC", title: "SHC", filterable: true
            },
            {
                field: "DestCountry", title: "Dest Country", filterable: true
            },
            {
                field: "DestCity", title: "Dest City", filterable: true
            },
            {
                field: "Agent", title: "Agent", filterable: true
            },
            {
                field: "Type", title: "Type", filterable: true
            },
            {
                field: "SubLocationType", title: "Sub Location Type", filterable: true
            },
            {
                title: "Total Capacity",
                columns:
                    [{ field: "TotalGross", title: "Gross (KG)", filterable: false }, { field: "TotalVol", title: "Volume(CBM)", filterable: false }]
            },
            {
                title: "Utilised",
                columns: [{ field: "AWBs", title: "AWBs", filterable: false }, { field: "TotalGrossUsed", title: "Gross (KG)", filterable: false }, { field: "TotalVolUsed", title: "Volume(CBM)", filterable: false }]
            },
            {
                title: "Remaining",
                columns: [{ field: "TotalGrossAvail", title: "Gross (KG)", filterable: false }, { field: "TotalVolAvail", title: "Volume(CBM)", filterable: false }]
            }
        ]
    });
}
function GetRackData(e) {
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }

    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetRackData",
                    datatype: 'json',
                    method: 'post',
                    data: {
                        Location: "",
                        Warehouse: $('#WarehouseSNo').val() || "",
                        SubArea: e.data.SNo || "",
                        Airport: $('#AirportSNo').val() || "",
                        Terminal: $('#TerminalSNo').val() || "",
                        GridType: 2
                    }
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
                        RackNumber: { type: "string" },
                        SlabNumber: { type: "string" },
                        Name: { type: "string" },
                        TotalGross: { type: "string" },
                        TotalVol: { type: "string" },
                        AWBs: { type: "string" },
                        TotalGrossUsed: { type: "string" },
                        TotalVolUsed: { type: "string" },
                        TotalGrossAvail: { type: "string" },
                        TotalVolAvail: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: true,
        pageable: true,
        filterable: false,
        sortable: false,
        dataBound: function (e) {},
        columns: [
            {
                field: "RackNumber", title: "Rack Number", filterable: true
            },
            {
                field: "SlabNumber", title: "Slab Number", filterable: true
            },
            {
                field: "Name", title: "Name", filterable: true
            },
           
            {
                title: "Total Capacity",
                columns:
                    [{ field: "TotalGross", title: "Gross (KG)", filterable: false }, { field: "TotalVol", title: "Volume(CBM)", filterable: false }]
            },
            {
                title: "Utilised",
                columns: [{ field: "AWBs", title: "AWBs", filterable: false }, { field: "TotalGrossUsed", title: "Gross (KG)", filterable: false }, { field: "TotalVolUsed", title: "Volume(CBM)", filterable: false }]
            },
            {
                title: "Remaining",
                columns: [{ field: "TotalGrossAvail", title: "Gross (KG)", filterable: false }, { field: "TotalVolAvail", title: "Volume(CBM)", filterable: false }]
            }
        ]
    });
}

function ExtraCondition(textId) {

    var filter = cfi.getFilter("AND");
    if (textId == "Text_AirportSNo")
    {
        cfi.setFilter(filter, "IsActive", 'eq', 1);
        return cfi.autoCompleteFilter(filter);
    }
    else if (textId == "Text_TerminalSNo")
    {
        cfi.setFilter(filter, "AirportSNo", "eq", $('#AirportSNo').val());
        return cfi.autoCompleteFilter(filter);
    }
    else if (textId == "Text_WarehouseSNo")
    {
        cfi.setFilter(filter, "AirportSNo", "eq", $('#AirportSNo').val());
        cfi.setFilter(filter, "TerminalSNo", "eq", $('#TerminalSNo').val());
        return cfi.autoCompleteFilter(filter);
    }
    else if (textId == "Text_StorageAreaSNo")
    {
        cfi.setFilter(filter, "WHSNo", "eq", $('#WarehouseSNo').val());
        return cfi.autoCompleteFilter(filter);
    }    
    
}

function ExtraParameters(id) {
    //var param = [];
    //if (id == "Text_AirlineSNo") {
    //    var UserSNo = userContext.UserSNo;
    //    param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
    //    return param;
    //}

}