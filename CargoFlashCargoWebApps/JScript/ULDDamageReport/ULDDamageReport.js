$(document).ready(function () {

    cfi.AutoCompleteV2("ULDTypeSNo", "ULDType", "ULDInventory_ULDType_damage", onSelectType, "contains");
    cfi.AutoCompleteV2("ULDSNo", "ULDNo", "ULDInventory_ULDNumber_damage", null, "contains", ",");
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "ULD_UldStation", null, "contains");
    cfi.AutoCompleteV2("MaintenanceType", "MaintenanceType,SNo", "ULD_RepairMaintenanceType", null, "contains");
    cfi.AutoCompleteV2("AdditionalMaintenanceType", "MaintenanceType,SNo", "ULD_RepairAdditionalMaintenanceType", null, "contains", ",");

    ////cfi.AutoCompleteV2("ConAWBPrefix", "AirlineCode", "History_Airline", null, "contains");
    //cfi.AutoCompleteV2("KeyValueNameSNo", "SNO,KeyValue", "AuditLog_KeyValue", null, "contains");
    //cfi.AutoCompleteV2("PageNameSNo", "PageName", "AuditLog_PageName", selectKeyk, "contains")
    //cfi.AutoCompleteV2("AWBSNo", "AWBNo", "AuditLog_AWBNo", null, "contains");
    //var form = [{ Key: "1", Text: "New" }, { Key: "2", Text: "Edit" }, { Key: "3", Text: "Delete" }, ];
    //cfi.AutoCompleteByDataSource("FormActionNameSNo", form, onchange);
    //cfi.DateType("Text_StartDate");
    //cfi.DateType("Text_EndDate");

    $('#OriginSNo').val(userContext.AirportSNo);
    $('#Text_OriginSNo').val(userContext.AirportCode + '-' + userContext.AirportName);

    cfi.DateType("Text_StartDate");
    //$('#Text_StartDate').attr('readonly', true);
    var Ownership = [{ Key: "0", Text: "AIRLINE" }, { Key: "1", Text: "HIRED" }];
    cfi.AutoCompleteByDataSource("OwnershipSNo", Ownership, onchange);
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../ULDDamageReport/GetDamageRecordSearch",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
                        return { Model: Model };
                    }

                }, parameterMap: function (options) {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        ULDNo: { type: "string" },
                        ULDType: { type: "string" },
                        MaintenanceType: { type: "string" },
                        AMaintenanceType: { type: "string" },
                        Ownership: { type: "string" },
                        DamageDate: { type: "string" },
                        Station: { type: "string" },
                        MaintenanceStatus: { type: "string" },
                        MaintenanceDate: { type: "string" },
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },
        }),
        sortable: false, filterable: false,
       pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [

                { field: "ULDNo", title: "ULD No.", width: 90 },
                { field: "ULDType", title: "ULD Type", width: 90 },
                 { field: "MaintenanceType", title: "Maintenance Type", width: 90 },
                { field: "AMaintenanceType", title: "Additional Maintenance Type", width: 90 },
                 { field: "Ownership", title: "Ownership", width: 90 },
                 { field: "DamageDate", title: "Date of Damage", width: 90 },
                  { field: "Station", title: "Station", width: 90 },
                  { field: "MaintenanceStatus", title: "Maintenance Status", width: 90 },
                   { field: "MaintenanceDate", title: "Maintenance Date", width: 90 },


        ]
    });

});
function onSelectType() {

    if ($("#Text_ULDTypeSNo").val() == "") {
        $("#divMultiULDSNo ul").html("");
        $("#ULDSNo").val("");
        $("#Multi_ULDSNo").val("");
        $("#FieldKeyValuesULDSNo").val("");
        $("#divMultiULDSNo ul").append('<li class="k-button" style="display:none;margin-bottom:10px !important;"><input type="hidden" id="Multi_ULDSNo" name="Multi_ULDSNo" value=""><span style="display:none;" id="FieldKeyValuesULDSNo" name="FieldKeyValuesULDSNo"></span></li>');
    }
}
function Search() {
    Model =
      {
          ULDNo: $("#Multi_ULDSNo").val(),
          ULDType: $("#ULDTypeSNo").val(),
          Station: $("#OriginSNo").val(),
          DamageDate: $("#Text_StartDate").val(),
          Ownership: $("#OwnershipSNo").val(),
          MaintenanceType: $("#MaintenanceType").val(),
          AMaintenanceType: $("#AdditionalMaintenanceType").val()

          
      };

    $('#grid').css('display', '')
    $("#grid").data('kendoGrid').dataSource.page(1);
    $('#exportflight').show();

}
function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_ULDSNo") {
        cfi.setFilter(filter, "ULDType", "eq", $("#Text_ULDTypeSNo").val())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }
}

