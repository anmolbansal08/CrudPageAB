


$(document).ready(function () {
    $('#SearchAWbNo').val('');
    var idx = userContext.AirlineName.indexOf('-') + 1
    var prefix = userContext.AirlineName.slice(0, idx)
    $('#SearchAWbNo').val(prefix)
	//cfi.AutoCompleteV2("AWbNo", "AWBNo", "AWBStockHistoryReport_AWBNo", null, "contains");
});


function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_AWbNo") {

        if (userContext.GroupName == 'FORWARDER') {
            cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
            cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
            cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)

        }
        else if (userContext.GroupName == 'ACCOUNTS') {
            cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
            cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
            cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)

        }
        else if (userContext.GroupName == 'OFFICE') {
            cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
            cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
        }
        else {
            cfi.setFilter(filter, "IsActive", "eq", 1)

        }
        var RT_Filter = cfi.autoCompleteFilter(filter);
        return RT_Filter;
    }
}

var AWbNo = "";

function SearchBlackListAWB() {
	if (cfi.IsValidSection("ApplicationTabs-1")) {
		if (true) {
			//AWbNo = $('#Text_AWbNo').val();
			AWbNo = $('#SearchAWbNo').val();
			$("#BlackListTbl").remove();
			if (AWbNo != "") {
				$.ajax({
					url: 'GetRecordAWBStockHistoryReport',
					async: true,
					type: "POST",
					dataType: "json",
					data: JSON.stringify({ AWbNo: AWbNo }),
					contentType: "application/json; charset=utf-8", cache: false,
					success: function (result) {
					    var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='13' style='height: 30px;'> A-Airline,          O-Office,  I-Agent,     L-BlackList,    B-Booked,    H-Handover,    Y - Stock Current Status ,   X - Stock Previous Status</td></tr><tr><th bgcolor='lightblue'>Status</th><th bgcolor='lightblue'>AWB No</th><th bgcolor='lightblue'>Stock Type</th><th bgcolor='lightblue'>AWB Type</th><th bgcolor='lightblue'>City Name</th><th bgcolor='lightblue'>Office Name </th><th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>Created Date</th><th bgcolor='lightblue'>Issue Date</th><th bgcolor='lightblue'>Stock Status</th><th bgcolor='lightblue'>Lot No</th><th bgcolor='lightblue'>Updated By</th><th bgcolor='lightblue'>Updated On</th></tr></thead>";
						if (result.Data.length > 0) {
							for (var i = 0; i < result.Data.length; i++) {
								str += " <tbody><tr>";
								str += "<td>" + result.Data[i].Status + "</td>";
								str += "<td>" + result.Data[i].AWBNo + "</td>";
								str += "<td>" + result.Data[i].StockType + "</td>";
								str += "<td>" + result.Data[i].AWBType + "</td>";
								str += "<td>" + result.Data[i].CityName + "</td>";
								str += "<td>" + result.Data[i].OfficeName + "</td>";
								str += "<td>" + result.Data[i].AgentName + "</td>";
								str += "<td>" + result.Data[i].Createddate + "</td>";
								str += "<td>" + result.Data[i].IssueDate + "</td>";
								str += "<td>" + result.Data[i].AWBStockStatus + "</td>";
								str += "<td>" + result.Data[i].StockStatus + "</td>";
								str += "<td>" + result.Data[i].UpdatedBy + "</td>";
								str += "<td>" + result.Data[i].UpdatedOn + "</td>";
								str += "</tr></tbody>";
							}
						}
						else {
							str += " <tbody><tr>";
							str += "<td colspan='12'><center><p style='color:red'>No Record Found</p></center></td>";
							str += "</tr></tbody>";
						}
						str += "</table>";

						$('#BindBlakListTable').append(str);
						//}



						$('#BlackList').css('display', 'block');


						return false
					},
					error: function (xhr) {
						var a = "";
					}
				});
			}
		}
	}
}

