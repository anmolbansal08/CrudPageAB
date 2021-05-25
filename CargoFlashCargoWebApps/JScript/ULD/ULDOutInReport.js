
$(document).ready(function () {

    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "ULD_UldStation", null, "contains");
    cfi.AutoCompleteV2("ULDType", "SNo,Text_ULD", "ULDSTOCK_ULDTYPE", null, "contains");
    cfi.AutoCompleteV2("ULDCategory", "ULDCategory,ULDCategory", "Temp_ULDCategory", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $("#Text_OriginSNo_input").css("text-transform", "uppercase");
    $("#Text_ULDCategory_input").css("text-transform", "uppercase");
    $("#Text_ULDType_input").css("text-transform", "uppercase");

    $('#OriginSNo').val(userContext.AirportSNo);
    $('#Text_OriginSNo_input').val(userContext.AirportCode + '-' + userContext.AirportName);



    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);


    $("#ReportDate").text($("#FromDate").val())

    $("#FromDate").change(function () {

        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }

    });


    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../ULDOutInReport/GetULDOutInReport",
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
                        ULDType: { type: "string" },
                        ULDCategory: { type: "string" },
                        ContentIndicator: { type: "string" },
                        NoOfReceipts: { type: "string" },
                        NoOfIssues: { type: "string" },
                        ULDsReceived: { type: "string" },
                        ULDsIssued: { type: "string" },
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),

        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [



                { field: "ULDType", title: "ULD TYPE", width: 90 },
                { field: "ULDCategory", title: "ULD Category", width: 90 },
                { field: "ContentIndicator", title: "Content Indicator", width: 90 },
                { field: "NoOfReceipts", title: "No. Of Receipts", width: 90 },
                { field: "NoOfIssues", title: "No. Of Issues", width: 90 },
                { field: "ULDsReceived", title: "Type wise Total of ULDs Received", width: 90 },
                { field: "ULDsIssued", title: "Type wise Total of ULDs Issued", width: 130 },

        ]
    });



});


var Model = [];


function SearchFPRReport() {

    var OriginSNo = $('#Text_OriginSNo_input').val()
    var SOriginSNo = OriginSNo.split("-")
    if (SOriginSNo == "") {
        ShowMessage('warning', 'warning', "Please select Station!");
        return false;
    }


    Model =
        {
            OriginAirPort: SOriginSNo[0] == "" ? "" : SOriginSNo[0],
            fromdate: $("#FromDate").val(),
            todate: $("#ToDate").val(),
            ULDType: $("#Text_ULDType_input").val() == "0" ? "" : $("#Text_ULDType_input").val(),
            ULDCategory: $("#Text_ULDCategory_input").val() == "0" ? "" : $("#Text_ULDCategory_input").val(),
        };

    if (Date.parse($(Model.FromDate).val()) > Date.parse($(Model.ToDate).val())) {
        ShowMessage('warning', 'warning', "From Date can not be greater than To Date !");
        return false;;
    }

    $('#grid').css('display', '')
    $("#grid").data('kendoGrid').dataSource.page(1);
    $('#exportflight').show();
}



function ExtraCondition(textId) {

}



function ExportExcelHoldType() {

    var OriginSNo = $('#Text_OriginSNo_input').val()
    var SOriginSNo = OriginSNo.split("-")

    if (SOriginSNo == "") {
        ShowMessage('warning', 'warning', "Please select Station!");
        return false;
    }
    var Text_OriginSNo = SOriginSNo[0] == "" ? "" : SOriginSNo[0];
    var fromdate = $("#FromDate").val();
    var todate = $("#ToDate").val();

    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning', "From Date can not be greater than To Date !");
        return false;; t
    }

    var ULDType = $("#Text_ULDType_input").val() == "0" ? "" : $("#Text_ULDType_input").val();
    var ULDCategory = $("#Text_ULDCategory_input").val() == "0" ? "" : $("#Text_ULDCategory_input").val();


    window.location.href = "../ULDOutInReport/ExportToExcel?OriginAirPort=" + Text_OriginSNo + "&fromdate=" + fromdate + "&todate=" + todate + "&ULDType=" + ULDType + "&ULDCategory=" + ULDCategory;
}

