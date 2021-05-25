$(function () {
    $.ajax({
        url: 'HtmlFiles/SLA/SLA.html',
        success: function (result) {
            $('#aspnetForm').on('submit', function (e) {
               // e.preventDefault();
            });
            $('#aspnetForm').append(result);
            PageLoaded();
        }
    });
});

function PageLoaded() {
    cfi.AutoCompleteV2("FlightNumber_Search", "FlightNo", "SLAPageLoad", null, "contains");
    //cfi.AutoComplete("Airline_Search", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineCode", "AirlineName"], null, "contains");
    //cfi.AutoComplete("Airport_Search", "AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoCompleteV2("Airline_Search", "AirlineCode,AirlineName", "SLAPageLoad_AirlineCode", null, "contains");
    cfi.AutoCompleteV2("Airport_Search", "AirportCode,AirportName", "SLAPageLoad_Airport", null, "contains");

    var ModeDataSource = [{ Key: "0", Text: "EXPORT" }, { Key: "1", Text: "IMPORT" }];
    cfi.AutoCompleteByDataSource("Mode_Search", ModeDataSource);
    $("#Text_Mode_Search").data("kendoAutoComplete").setDefaultValue("0", "Export");

    cfi.DateType("StartDate", true);
    cfi.DateType("EndDate", true);
    $("#Search").bind("click", function () {
        SearchData();
    });

    AuditLogBindOldValue('tblSLAReportTable');
    //Updated by Akash for Audit Log on 6 Nov 2017
}

function BindSearchGrid(data) {
    var dbtableName = "tblResult";

    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
        //isPaging:true,
        isGetRecord: false,
        //hideRowNumColumn:true,

        hideButtons: { updateAll: true, insert: true, append: true, remove: true, removeLast: true },
        caption: "Search Result",
        initRows: 1,
        columns: [
            {
                name: 'FlightNo', display: 'Flight No', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'Origin', display: 'Origin', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'Destination', display: 'Dest', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'Tonnage', display: 'Tonnage', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'STD', display: 'STD', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'ATD', display: 'ATD', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'BuildUpSelfSLA', display: 'BuildUp Self SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'BuildUpAirlineSLA', display: 'BuildUp Airline SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'BuildUpActual', display: 'BuildUp Actual', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'BuildUpSelfSLAAchieved', display: 'BuildUp Self SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'BuildUpAirlineSLAAchieved', display: 'BuildUp Airline SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'UWSSelfSLA', display: 'UWS Self SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'UWSAirlineSLA', display: 'UWS Airline SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'UWSActual', display: 'UWS Actual', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'UWSSelfSLAAchieved', display: 'UWS Self SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'UWSAirlineSLAAchieved', display: 'UWS Airline SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'DEPSelfSLA', display: 'DEP Self SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'DEPAirlineSLA', display: 'DEP Airline SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'DEPActual', display: 'DEP Actual', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'DEPSelfSLAAchieved', display: 'DEP Self SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'DEPAirlineSLAAchieved', display: 'DEP Airline SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'FFMSelfSLA', display: 'FFM Self SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'FFMAirlineSLA', display: 'FFM Airline SLA', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'FFMActual', display: 'FFM Actual', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'FFMSelfSLAAchieved', display: 'FFM Self SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'FFMAirlineSLAAchieved', display: 'FFM Airline SLA Achieved', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'SelfSLAAchieved', display: 'Self SLA Achieved %', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'AirlineSLAAchieved', display: 'Airline SLA Achieved %', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            }
        ]
    });
    $("#" + dbtableName).appendGrid('load', data);
}

function SearchData() {
    debugger;
    var obj = {
        FlightNo: $("#FlightNumber_Search").val(),
        AirlineSNo: $("#Airline_Search").val() || "0",
        AirportSNo: $("#Airport_Search").val() || "0",
        Mode: $("#Mode_Search").val() == "0" ? false : true,
        StartDate: $("#StartDate").val(),
        EndDate: $("#EndDate").val()
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Report/SLAService.svc/GetSLAReport",
        data: JSON.stringify(obj),
        success: function (response) {
            var data = JSON.parse(response)
            if (data.Table0.length > 0) {
                BindSearchGrid(data.Table0);
            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}
function ExtraParameters(id) {
    var param = [];
    if (id == "Text_Airline_Search") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }

}