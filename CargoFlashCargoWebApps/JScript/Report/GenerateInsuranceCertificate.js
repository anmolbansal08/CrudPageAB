$(document).ready(function () {
    cfi.AutoCompleteV2("AWBSNo", "AWBNo", "GeneratedCertificateAWBNo", null, "contains");
    $('#grid').css('display', 'none')

    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 10,
            transport: {
                read: {
                    url: "../GenerateInsuranceCertificate/GetInsuranceCertificateDetail",
                    dataType: "json",
                    global: false,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetReportData() {
                        return {
                            AWBSNo: AWBSNo//, AWBNo: $("#Text_AWBSNo").val()
                        };
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
                        SNo: { type: "number" },
                        NoofCertificate: { type: "string" },
                        cargo_owner: { type: "string" },
                        consignee: { type: "string" },
                        comodity: { type: "string" },
                        number_of_pieces: { type: "string" },
                        weight: { type: "string" },
                        currency: { type: "string" },
                        interest_insured_value: { type: "string" },
                        awb: { type: "string" },
                        origin_country: { type: "string" },
                        origin_city: { type: "string" },
                        destination_country: { type: "string" },
                        destination_city: { type: "string" },
                        flight_number: { type: "string" },
                        flight_date: { type: "string" },
                        issue_date: { type: "string" },
                        Status: { type: "string" },
                        Message: { type: "string" },
                        Certificate: { type: "string" }
                    }
                }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },
        }),
        sortable: true, filterable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false, },
        scrollable: true,
        columns: [
            { field: "Status", title: "Status", width: 70 },
            { field: "Message", title: "Message", width: 70 },
            { field: "Certificate", title: "Download", width: 500, template: "<a href='\\\#' class='name-link' onclick='DownloadCertificate(\"#=Certificate#\")'>#= Certificate #</a>" },
            { field: "NoofCertificate", title: "No of Certificate", width: 130 },
            { field: "cargo_owner", title: "Cargo Owner", width: 110 },
            { field: "consignee", title: "Consignee", width: 110 },
            { field: "comodity", title: "Commodity", width: 110 },
            { field: "number_of_pieces", title: "Number of Pieces", width: 110 },
            { field: "weight", title: "Weight", width: 110 },
            { field: "currency", title: "Currency", width: 110 },
            { field: "interest_insured_value", title: "Interest Insured Value", width: 150 },
            { field: "awb", title: "Awb", width: 110 },
            { field: "origin_country", title: "Origin Country", width: 110 },
            { field: "origin_city", title: "Origin City", width: 110 },
            { field: "destination_country", title: "Destination Country", width: 110 },
            { field: "destination_city", title: "Destination City", width: 110 },
            { field: "flight_number", title: "Flight No", width: 110 },
            { field: "flight_date", title: "Flight Date", width: 110 },
            { field: "issue_date", title: "Issue Date", width: 110 },
        ]
    });
});

function DownloadCertificate(CertificateLink) {
    var win = window.open(CertificateLink, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }
}

var AWBSNo = "";
function GenerateInsuranceCertificate() {
    AWBSNo = $('#AWBSNo').val();
    if (AWBSNo != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.page(1);
    }
}