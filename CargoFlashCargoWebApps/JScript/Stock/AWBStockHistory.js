$(document).ready(function () {

    cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "AirlineCode", "AirlineName", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("OfficeSNo", "SNo,Name", "Office", "SNo", "Name", null, null, "contains");

    cfi.AutoComplete("AgentSNo", "SNo,Name", "Account", "SNo", "Name", null, "contains");
});



function GetReportData() {

    var AirlineSNo = $("#AirlineSNo").val();

    var OfficeSNo = $("#OfficeSNo").val();
    var AgentSNo = $("#AgentSNo").val();

    if (AirlineSNo != "") {
        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "GetAirlineData",
                        datatype: 'json',
                        method: 'post',
                        data: { AirlineSNo: AirlineSNo, OfficeSNo: OfficeSNo = null ? "" : OfficeSNo, AgentSNo: AgentSNo = null ? "" : AgentSNo }
                    }
                }, parameterMap: function (data, operation) {
                    alert(JSON.stringify(data));
                    return JSON.stringify(data);
                },
                schema: {
                    model: {
                        id: "AirlineSNo",
                        fields: {

                            AirlineName: { type: "string" },
                            StartAWB: { type: "string" },
                            EndAWB: { type: "string" },
                            IssueDate: { type: "string" },
                            OfficeName: { type: "string" },
                            AgentName: { type: "string" },
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
            //detailInit: detailInit,
            //dataBound: function () {
            //    //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
            columns: [
                //{ field: "AWBPrefix" },
                 { field: "AirlineName", title: "Airline Name" },
                { field: "StartAWB", title: "Start AWB" },
                { field: "EndAWB", title: "End AWB" },
                { field: "IssueDate", title: "Issue Date" },
                { field: "OfficeName", title: "Office Name" },
                { field: "AgentName", title: "Agent Name" }
            ]
        });
    }
}
