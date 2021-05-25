
$(document).ready(function () {

    cfi.AutoComplete("PageNameSNo", "SNO,PageName", "AuditLogFormConfig", "SNO", "PageName", ["PageName"], null, "contains");

    cfi.AutoComplete("MasterFieldNameSNo", "MasterRecordSNo,MasterFieldName", "AuditLogMaster", "MasterRecordSNo", "MasterFieldName", null, null, "contains");

    //GetReportData();
});



var PageNameSNo = "";
//var AirlineSNo = "";


function GetAuditLog() {
     PageNameSNo = $("#PageNameSNo").val() == null ? "" : $("#PageNameSNo").val();
    var MasterFieldNameSNo = $("#MasterFieldNameSNo").val() == null ? "" : $("#MasterFieldNameSNo").val();

    if (PageNameSNo != "") {
        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "GetAuditLog",
                        datatype: 'json',
                        method: 'post',
                        data: { PageNameSNo: PageNameSNo, MasterFieldNameSNo: MasterFieldNameSNo }
                    }
                }, parameterMap: function (data, operation) {
                    alert(JSON.stringify(data));
                    return JSON.stringify(data);
                },
                schema: {
                    model: {
                        id: "MasterSNo",
                        fields: {
                            AWBPrefix: { type: "number" },
                            PageName: { type: "string" },
                            MasterFieldName: { type: "string" },
                            UpdatedOn: { type: "string" },
                            UpdatedBy: { type: "string" }

                        }
                    }, data: "Data"
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            height: 550,
            filterable: true,
            sortable: true,
            pageable: true,
            detailInit: detailInit,
            dataBound: function () {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [
                //{ field: "AWBPrefix" },
             { field: "PageName", title: "Page Name" },
             { field: "MasterFieldName", title: "Master Field Name" },
             { field: "UpdatedOn", title: "Update On" },
             { field: "UpdatedBy", title: "Updated By" }

            ]
        });

    }
}




function detailInit(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetLogTransData",
                    datatype: 'json',
                    method: 'post',
                    //data: { AWBPrefix: e.data.AWBPrefix }
                    data: { PageNameSNo: PageNameSNo, masterFieldNameSNo: e.data.MasterSNo }
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
                        //OfficeSNo: { type: "number" },
                        FieldName: { type: "string" },
                        OldValue: { type: "string" },
                        NewValue: { type: "string" }
                    }
                },
                data: "Data"
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true

            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: false,
        sortable: true,
        pageable: true,
      
        columns: [
             { field: "FieldName", title: "Field Name" },
             { field: "OldValue", title: "Old Value" },
             { field: "NewValue", title: "New Value" }
        ]
    });   
}












function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_MasterFieldNameSNo") {
        try {
            cfi.setFilter(filterAirline, "AuditLogFormConfigSNo", "eq", $("#Text_PageNameSNo").data("kendoComboBox").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}