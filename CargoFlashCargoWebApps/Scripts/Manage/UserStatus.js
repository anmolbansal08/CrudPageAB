/// <reference path="../references.js" />
var UserCitySno = 0;
$(document).ready(function () {    

    cfi.AutoCompleteV2("UserSNo", "UserName", "TerminalRequest_User", null, "contains", null, null, null, null, UserDescription);
    cfi.AutoCompleteV2("NewTerminalSNo", "TerminalName", "TerminalRequest_TerminalName", null, "contains");
    cfi.AutoCompleteV2("WeighingScaleSNo", "SNo,Name", "TerminalRequest_Scale", null, "contains");
    $("input[name='operation']").click(function () {
        if ($("#Text_NewTerminalSNo").val() == "" && $("#Text_WeighingScaleSNo").val() == "") {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select New Terminal OR Weighing Scale.");
            $("#Text_NewTerminalSNo").focus();
            return false; 
        }
        else {


        }
    });
});



function ExtraCondition(textId) {
    if (textId == "Text_UserSNo") {
        try {
            var filterAirline = cfi.getFilter("AND");
            cfi.setFilter(filterAirline, "IsActive", "eq", "1")
            var OriginCityAutoCompleteFilter1 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter1;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_NewTerminalSNo") {
        try {
            var filterAirline1 = cfi.getFilter("AND");
            cfi.setFilter(filterAirline1, "IsActive", "eq", "1")
            cfi.setFilter(filterAirline1, "AirportSNo", "eq", userContext.AirportSNo);
            cfi.setFilter(filterAirline1, "SNo", "notin", $("#hdnCurrentTerminalSNo").val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline1]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }



    }



}




function UserDescription(e) {

    var key = this.dataItem(e.item.index()).Key;
    UserDescription1(key)

    cfi.PopUp("divUserDescription", "Details");

}

function UserDescription1(key) {


    $.ajax({
        url: "./Services/Permissions/UserStatusService.svc/GetUserDescription",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            SNo: key
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData1 = jQuery.parseJSON(result);
            var theDiv = document.getElementById("divUserDescription");
            theDiv.innerHTML = "";
            var table = "<table style='border-left: 1px solid; border-top: 1px solid; border-right: 1px solid; border-bottom: 1px solid; width: 100%;'><tr style='text-align: center;'><td><strong>User Name</strong></td><td><strong>First Name</strong></td><td><strong>Email ID</strong></td><td><strong>Mobile No</strong></td><td><strong>City Code</strong></td><td><strong>Default Terminal Name</strong></td><td><strong>Current Terminal Name</strong></td></tr>";
            var table1 = "<table style='border-left: 1px solid; border-bottom: 1px solid; border-right: 1px solid; width: 100%;'><tr style='text-align: center;'><td><strong>Weighing Scale Name</strong></td><td><strong>Weighing Scale Id</strong></td><td><strong>Weighing Scale IP Address</strong></td></tr>";

            
            //if (myData1.Table0 != "" || myData1.Table1 != "") {
            //Added By Rahul Kr Singh as Manage Permission -Change Terminal Request -unable to fetch data from the drop down and page keep buffering


                if (myData1.Table0.length!=0 ) {

                var GroupSNo = "*";

                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    UserCitySno = myData.Table0[0].CitySNo;

                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            table += "<tr style=border-top:1pt solid black;'><td style='text-align: center;'>"
                                            + myData.Table0[i]["UserName"] + "</td><td style='text-align: center;'>"
                                            + myData.Table0[i]["FirstName"] + "</td><td style='text-align: center;'>"
                                            + myData.Table0[i]["EmailID"] + "</td><td style='text-align: center;'>"
                                            + myData.Table0[i]["Mobile"] + "</td><td style='text-align: center;'>"
                                            + myData.Table0[i]["CityCode"] + "</td><td style='text-align: center;'>"
                                            + myData.Table0[i]["DefaultTerminalName"] + "<input type='hidden' id='hdnOldTerminalSNo' name='hdnOldTerminalSNo' value='"
                                            + myData.Table0[i]["DefaultTerminalSNo"] + "' /></td><td style='text-align: center;'>"
                                            + myData.Table0[i]["CurrentTerminalName"]
                                            + "<input type='hidden' id='hdnCurrentTerminalSNo' name='hdnCurrentTerminalSNo' value='"
                                            + myData.Table0[i]["TerminalSNo"] + "' /></td><td style='text-align: center;'>"

                            table1 += "<tr style=border-top:1pt solid black;><td style='text-align: center;'>"

                                 + myData.Table0[i]["WeighingScaleName"]
                                          + "<input type='hidden' id='hdnWeighingScaleSNo' name='hdnWeighingScaleSNo' value='"
                                           + myData.Table0[i]["WeighingScaleSNo"] + "' /></td><td style='text-align: center;'>"
                                          + myData.Table0[i]["WeighingScaleID"]
                                          + "<input type='hidden' id='hdnWeighingScaleSNo' name='hdnWeighingScaleSNo' value='"
                                          + myData.Table0[i]["WeighingScaleSNo"] + "' /></td><td style='text-align: center;'>"
                                           + myData.Table0[i]["WeighingScaleIPAddress"]
                                          + "<input type='hidden' id='hdnWeighingScaleSNo' name='hdnWeighingScaleSNo' value='"
                                           + myData.Table0[i]["WeighingScaleSNo"] + "' /></td><td style='text-align: center;'>"
                            "' /></td></tr>";
                        }
                        table += "</table>";
                        theDiv.innerHTML += table + table1;
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblAssignTeamData'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }
                }
            }
            else {
                var table = "<table class='appendGrid ui-widget' id='tblAssignTeamData'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                theDiv.innerHTML += table;
            }
            return false;
        }
    });
}



//function UserDescription(valueId, value, keyId, key) {
//    var a = "";
//    $.ajax({
//        type: "POST",
//        url: "./Services/Permissions/UserStatusService.svc/GetUserDescription?recid=" + key,
//        //data: { id: 1 },
//        dataType: "json",
//        success: function (response) {

//            alert(response);
//            //var code = response.Data[0];
//            //divUserDescription.innerHTML = code;
//        }
//    });
//}










