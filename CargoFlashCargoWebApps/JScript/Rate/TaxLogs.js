$(document).ready(function () {

   
    cfi.AutoCompleteByDataSource("OriginLevel", Origin, FnGetOriginAC, null);
    cfi.AutoCompleteByDataSource("DestinationLevel", Destination, FnGetDestinationAC, null);
    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "TaxRate_OriginSNo",  OnSelectOrigin, "contains");
    cfi.AutoCompleteV2("DestinationSNo", "AirportCode,AirportName", "TaxRate_OriginSNo",  OnSelectDestination, "contains");


    cfi.AutoCompleteV2("AirlineCode", "AirlineCode", "TaxRate_AirlineCode", null, "contains");
    cfi.AutoCompleteByDataSource("Status", Status, null, null);
    cfi.AutoCompleteByDataSource("TaxType", TaxType, null, null);
    cfi.AutoCompleteByDataSource("Type", Type, null, null);

    $("input[id='Search'][name='Search']").click(function () {
        var AirlineCode = $('#AirlineCode').val();
        var OriginLevel = $('#OriginLevel').val();
        var DestinationLevel = $('#DestinationLevel').val();
        if (AirlineCode == "")
        {
            ShowMessage('warning', 'Information', "Please Select AirlineCode,AirlineCode can not be blank");
            return false;
        }
        if (OriginLevel == "") {
            ShowMessage('warning', 'Information', "Please Select OriginLevel,OriginLevel can not be blank");
            return false;
        }
        if (DestinationLevel == "") {
            ShowMessage('warning', 'Information', "Please Select DestinationLevel,DestinationLevel can not be blank");
            return false;
        }
        var FromDate = document.getElementById('StartDate').value;
        var ToDate = document.getElementById('EndDate').value;
        var eDate = new Date(ToDate);
        var sDate = new Date(FromDate);
        if (FromDate != '' && ToDate != '' && sDate > eDate) {
            ShowMessage('warning', 'Information', "Please ensure that the To Date is greater than or equal to the From Date.");

            return false;
        }
        else {
            Search();
        }


    });

    
    //$("input[id='Search'][name='Search']").click(function () {

    //    Search();
    //})


});

function Search() {
    var AirlineCode = parseInt($("#AirlineCode").val()) || 0
    var TaxType = $("#TaxType").val() || 10
    var Type = $("#Type").val() || 2
   
    var Status = $("#Status").val() || 10
    var StartDate = $("#StartDate").val() || null
    var EndDate = $("#EndDate").val() || null
    var OriginLevel = parseInt($("#OriginLevel").val()) || 0
    var OriginSNo = parseInt($("#OriginSNo").val()) || 0
    var DestinationLevel = parseInt($("#DestinationLevel").val()) || 0
    var DestinationSNo = parseInt($("#DestinationSNo").val()) || 0
    var ReferenceNo = $("#REFNo").val() || ''
    $.ajax({
        url: "Services/Rate/TaxLogsService.svc/TaxLogsTable",
        async: false,
        type: "GET",
        dataType: "json",
        //data: { AirlineSNo: $("#AirlineCode").val(), ULDNo: $("#Text_MainULDNo").val(), Type: $('input:radio[name=Type]:checked').val() },
        data: { AirlineSNo: AirlineCode, Type: Type, TaxType: TaxType, Status: Status, StartDate: StartDate, EndDate: EndDate, OriginLevel: OriginLevel, OriginSNo: OriginSNo, DestinationLevel: DestinationLevel, DestinationSNo: DestinationSNo, ReferenceNo: ReferenceNo },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData = jQuery.parseJSON(result);
            if (result.length > 0) {
                var theDiv = document.getElementById("divTaxLogs");
                theDiv.innerHTML = "";

              //var str = "<table style='width:90%;'  border=\"1px\">";
                var str = "<table class='appendGrid ui-widget' style='width: 100%; top:0px;margin-top:0px;' >"
                //if ($("#Type").val() == 0) {
                str += "<tr>"
                            //+ "<td class='ui-widget-header'> Action </td> "
                            + "<td class='ui-widget-header'> TaxRateSNo </td>"
                             + "<td class='ui-widget-header'> Airline</td>"
                            + "<td class='ui-widget-header'> Tax Type </td> <td class='ui-widget-header'>Tax Code </td>"
                            + "<td class='ui-widget-header'>Tax Name</td><td class='ui-widget-header'>Tax Defination</td> "
                            + " <td class='ui-widget-header'>Reference No</td><td  class='ui-widget-header'>Start Date</td>"
                            + " <td class='ui-widget-header'>End Date</td><td class='ui-widget-header'>Origin Level</td>"
                            + "<td class='ui-widget-header'>Origin Name</td><td class='ui-widget-header'>Destination Level</td>"
                            + "<td class='ui-widget-header'>Destination Name</td><td class='ui-widget-header'>Currency Code </td>"
                            + "<td class='ui-widget-header'>Tax Applicable At</td><td class='ui-widget-header'>Tax(%) </td>"
                            + "<td class='ui-widget-header'>Minimum Charges(%)</td><td class='ui-widget-header'>Tax Applicable On</td>"
                            + "<td class='ui-widget-header'>Status</td><td class='ui-widget-header'>Remarks</td>"
                            + "<td class='ui-widget-header'>Origin City Code</td><td class='ui-widget-header'>Origin Country Code</td>"
                            + "<td class='ui-widget-header'>Destination City Code</td><td class='ui-widget-header'>Destination Country Code</td>"
                            + "<td class='ui-widget-header'>Agent</td><td class='ui-widget-header'>Shipper</td>"
                            + "<td class='ui-widget-header'>Product</td><td class='ui-widget-header'>Commodity Code</td>"
                            + "<td class='ui-widget-header'>OtherCharge Code</td><td class='ui-widget-header'>Issue Airline Carrier Code</td>"
                        +"</tr>"
                
                for (var i = 0; i < myData.Table0.length; i++) {
                    str += "<tr>"
                        + "<td class='ui-widget-content first'><a href='Default.cshtml?Module=Rate&Apps=TaxRate&FormAction=Read&View=History&UserID=0&RecID=" + myData.Table0[i].TaxRateSNo + "''>" + myData.Table0[i].TaxRateSNo + "</a></td>"
                        //+ "<td class='ui-widget-content first'>" + myData.Table0[i].TaxRateSNo + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].AirlineCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].TaxType + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].TaxCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].TaxName + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].TaxDefination + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].ReferenceNo + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].StartDate + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].EndDate + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].OriginLevel + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].OriginSNo + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].DestinationLevel + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].DestinationSNo + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].CurrencySNo + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].TaxApplicableAt + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Tax + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Minimum + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].TaxApplicable + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Status + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].Remarks + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].CityTransCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].CountryTransCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].DestinationCityTransCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].DestinationCountryTransCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].AgentTransText + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].AgentShipperTransText + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].ProductTransText + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].CommodityTransCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].OtherChargeCodeTransCode + "</td>"
                        + "<td class='ui-widget-content first'>" + myData.Table0[i].IssueAirlineCarrierTransCode + "</td>"

                        + "</td></tr>"
               
                }
    

                str += "</table>";
               
                theDiv.innerHTML = str;
                $("#divTaxLogs").attr('style', 'overflow-x: scroll');
                // var data_type = 'data:application/vnd.ms-excel'

                // //var postfix = "Commodity Wise";
                // var a = document.createElement('a');
                // a.href = data_type + ' , ' + encodeURIComponent(str);
                //// a.download = 'Cargo Ranking ' + postfix + '.xls';
                // a.click();
            }

        }
    });
}


var Type = [{ Key: "0", Text: "DueAgent" }, { Key: "1", Text: "DueCarrier" }];

var Status = [{ Key: "1", Text: "Active" }, { Key: "2", Text: "Draft" }, { Key: "3", Text: "In Active" }, { Key: "4", Text: "Expired" }];
var TaxType = [{ Key: "0", Text: "Domestic" }, { Key: "1", Text: "International" }, { Key: "2", Text: "Both" }];
var Origin = [{ Key: "1", Text: "CITY" }, { Key: "2", Text: "COUNTRY" }, { Key: "3", Text: "REGION" }];
var Destination = [{ Key: "1", Text: "CITY" }, { Key: "2", Text: "COUNTRY" }, { Key: "3", Text: "REGION" }];

function OnSelectOrigin(input) {
    var Origin = $("#Text_OriginLevel").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {

        if (Origin == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Tax Rate', "Origin City can not be same as Destination City.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }
        }

    }



}
function OnSelectDestination(input) {
    var Destination = $("#Text_DestinationLevel").val().toUpperCase();
    var Text_OriginSNo = $("#Text_OriginSNo").val().toUpperCase();
    var Text_DestinationSNo = $("#Text_DestinationSNo").val().toUpperCase();
    if (Text_OriginSNo != "" && Text_DestinationSNo != "") {

        if (Destination == "CITY") {
            if (Text_OriginSNo == Text_DestinationSNo) {
                ShowMessage('warning', 'Warning - Tax Rate', "Destination City can not be same as Origin City.", "bottom-right");
                $("#Text_DestinationSNo").val("");
                $("#DestinationSNo").val("");

            }

        }

    }


}

function FnGetOriginAC(input) {
    var Origin = $("#Text_OriginLevel").val().toUpperCase();

    if (Origin == "CITY") {

        var dataSource = GetDataSourceV2("OriginSNo", "TaxRate_OriginSNo_City")
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CityCode");

        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }

    else if (Origin == "COUNTRY") {
        var dataSource = GetDataSourceV2("OriginSNo", "TaxRate_OriginSNo_COUNTRY")
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "CountryCode");

        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }
    else if (Origin == "REGION") {
        var dataSource = GetDataSourceV2("OriginSNo", "TaxRate_OriginSNo_REGION")
        cfi.ChangeAutoCompleteDataSource("OriginSNo", dataSource, false, OnSelectOrigin, "RegionName");

        $("#Text_OriginSNo").val("");
        $("#OriginSNo").val("");
    }


}

function FnGetDestinationAC(input) {
    var Destination = $("#Text_DestinationLevel").val().toUpperCase();
    if (Destination == "CITY") {
        var dataSource = GetDataSourceV2("DestinationSNo", "TaxRate_OriginSNo_City")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CityCode");

        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
    }

    else if (Destination == "COUNTRY") {
        var dataSource = GetDataSourceV2("DestinationSNo", "TaxRate_OriginSNo_COUNTRY")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "CountryCode");
        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
    }
    else if (Destination == "REGION") {
        var dataSource = GetDataSourceV2("DestinationSNo", "TaxRate_OriginSNo_REGION")
        cfi.ChangeAutoCompleteDataSource("DestinationSNo", dataSource, false, OnSelectDestination, "RegionName");

        $("#Text_DestinationSNo").val("");
        $("#DestinationSNo").val("");
    }


}
//$("#btnSearch").click(function () {
//    //if ($("#MainULDNo").val() == "") {
//    //    ShowMessage('warning', 'Warning - ULD Breakdown Search', "Unable to search. ULD No cannot be blank.", "bottom-right");
//    //    return;
//    //}
//    //else {
//    //    CreateULDBreakdownTable();
//    //    if ($('input:radio[name=Type]:checked').val() == 0) {
//    //        var alphabettypesExport = [{ Key: "1", Text: "ULD Transfer" }, { Key: "2", Text: "ULD Breakdown (Complete)" }, { Key: "3", Text: "ULD Breakdown (Remove AWB)" }];
//    //        cfi.AutoCompleteByDataSource("Action", alphabettypesExport);
//    //    }
//    //    else {
//    //        var alphabettypesTransit = [{ Key: "1", Text: "RE - BUILD" }, { Key: "2", Text: "RE - CONTOUR" }, { Key: "3", Text: "MIX TO CLEAN LOAD" }];
//    //        cfi.AutoCompleteByDataSource("Action", alphabettypesTransit, test);
//    //    }
//    CreateULDBreakdownTable();
//    var theDiv = document.getElementById("divTaxLogsAction");
//    theDiv.innerHTML = "";
//    var theTable = document.getElementById("tblTaxLogsGrid");
//    theTable.innerHTML = "";
//    //}
//});
//function CreateULDBreakdownTable() {
//    $.ajax({
//        url: "Services/Rate/TaxLogsService.svc/TaxLogsTable",
//        async: false,
//        type: "GET",
//        dataType: "json",
//        // data: { AirlineSNo: $("#AirlineCode").val(), ULDNo: $("#Text_MainULDNo").val(), Type: $('input:radio[name=Type]:checked').val() },
//        data: { AirlineSNo: $("#AirlineCode").val()},
//        contentType: "application/json; charset=utf-8", cache: false,
//        success: function (result) {
//            var theDiv = document.getElementById("divTaxLogs");
//            theDiv.innerHTML = "";
//            var table = "</br></br><table class='appendGrid ui-widget' id='tblTaxLogs'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Airline</td><td class='ui-widget-header'>Type</td><td class='ui-widget-header'>TaxType</td><td class='ui-widget-header'>StartDate</td><td class='ui-widget-header'>EndDate</td><td class='ui-widget-header'>Status</td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'><tr id='tblTaxLogs_Row_1'>";
//            if (result.substring(1, 0) == "{") {
//                var myData = jQuery.parseJSON(result);
//                if (myData.Table0.length > 0) {
//                    $("#hdnTaxLogsSNo").val(myData.Table0[0].TaxRateSNo);
//                    table += "<td class='ui-widget-content first'>" + myData.Table0[0].TaxRateSNo + "</td><td class='ui-widget-content first'>" + myData.Table0[0].AirlineCodeSNo + "</td><td class='ui-widget-content first'>NULL</td>"
//                        //<td class='ui-widget-content first'>" + myData.Table0[0].ULDBuildWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[0].TareWeight + "</td><td class='ui-widget-content first'><input name='Action' id='Action' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Action' name='Text_Action'/></td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Submit' type='button' id='btnSubmit' value='1' tabindex='16' class='btn btn-success' style='width:100px;' onclick='Submit();'><span class='ui-button-text'>Submit</span></button></td>";
//                    table += "</tr></tbody></table>";
//                    theDiv.innerHTML += table;
//                }
//                else {
//                    var table = "<table class='appendGrid ui-widget' id='tblTaxLogs'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
//                    theDiv.innerHTML += table;
//                }
//            }
//            return false
//        },
//        error: function (xhr) {
//            var a = "";
//        }
//    });
//}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineCode") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}
