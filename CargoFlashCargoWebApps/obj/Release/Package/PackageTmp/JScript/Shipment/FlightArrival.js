var QueryString = "";
//var pageType = $('#hdnPageType').val();
$(function () {
    $("input[type='submit'][name='operation']").attr("onclick", "return ValidateRateAirlineMasterForm();");
    cfi.ValidateForm();
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
     cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineName", null, null, "contains", null, null, null, null, OnSelectAirline);
   
    //$("input[id=ValidTo]").change(function (e) {
    //    var dto = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
    //    var dfrom = new Date(Date.parse($("#ValidFrom").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
    //    if (dfrom > dto)
    //        $(this).val("");
    //})
    //$("input[id=ValidFrom]").change(function (e) {

    //    var dfrom = new Date(Date.parse($(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));

    //    var dto = new Date(Date.parse($("#ValidTo").val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ')));
    //    if (dfrom > dto)
    //        $(this).val("");
    //})
    //QueryString = "rateAirlineMasterSNo=0&originCitySNo=0&originAirportSNo=0";
    //createRateAirlineTrans(QueryString);
    //getRateDueCarrierTrans();


});

//function ValidateRateAirlineMasterForm() {

//    // Assigining Rate Airline Trans data into Hidden Filed tblRateAirlineTrans
//    var originZoneSno = $("#OriginZoneSNo").val() == undefined ? "0" : $("#OriginZoneSNo").val();
//    var destinationZoneSNo = $("#DestinationZoneSNo").val() == undefined ? "0" : $("#DestinationZoneSNo").val();
//    var originCitySNo = $("#OriginCitySNo").val() == undefined ? "0" : $("#OriginCitySNo").val();
//    var destinationCitySNo = $("#DestinationCitySNo").val() == undefined ? "0" : $("#DestinationCitySNo").val();
//    var originAirportSNo = $("#OriginAirportSNo").val() == undefined ? "0" : $("#OriginAirportSNo").val();
//    var destinationAirportSNo = $("#DestinationAirportSNo").val() == undefined ? "0" : $("#DestinationAirportSNo").val();
//    var officeSNo = $("#OfficeSNo").val() == undefined ? "0" : $("#OfficeSNo").val();
//    var accountGroupSNo = $("#AccountGroupSNo").val() == undefined ? "0" : $("#AccountGroupSNo").val();
//    if ((originZoneSno == "" ? "0" : originZoneSno) == "0" && (originCitySNo == "" ? "0" : originCitySNo) == "0" && (originAirportSNo == "" ? "0" : originAirportSNo) == "0") {
//        ShowMessage('error', 'Failed!', "Select atleast one among Zone, City and Airport");
//        return false;
//    }
//    if ((originZoneSno == "" ? "0" : originZoneSno) != "0" && (destinationZoneSNo == "" ? "0" : destinationZoneSNo) == "0") {
//        ShowMessage('error', 'Failed!', "Select Destination Zone or Unselect both");
//        return false;
//    }
//    if ((originZoneSno == "" ? "0" : originZoneSno) == "0" && (destinationZoneSNo == "" ? "0" : destinationZoneSNo) != "0") {
//        ShowMessage('error', 'Failed!', "Select Origin Zone or Unselect both");
//        return false;
//    }
//    if ((originCitySNo == "" ? "0" : originCitySNo) != "0" && (destinationCitySNo == "" ? "0" : destinationCitySNo) == "0") {
//        ShowMessage('error', 'Failed!', "Select Destination City or Unselect both");
//        return false;
//    }
//    if ((originCitySNo == "" ? "0" : originCitySNo) == "0" && (destinationCitySNo == "" ? "0" : destinationCitySNo) != "0") {
//        ShowMessage('error', 'Failed!', "Select Origin City or Unselect both");
//        return false;
//    }
//    if ((originAirportSNo == "" ? "0" : originAirportSNo) != "0" && (destinationAirportSNo == "" ? "0" : destinationAirportSNo) == "0") {
//        ShowMessage('error', 'Failed!', "Select Destination Airport or Unselect both");
//        return false;
//    }
//    if ((originAirportSNo == "" ? "0" : originAirportSNo) == "0" && (destinationAirportSNo == "" ? "0" : destinationAirportSNo) != "0") {
//        ShowMessage('error', 'Failed!', "Select Origin Airport or Unselect both");
//        return false;
//    }
//    var rateTypeVal = $("#RateType:checked").val();
//    switch (rateTypeVal) {

//        case '2':
//            if ((officeSNo == "" ? "0" : officeSNo) != "0") {
//                ShowMessage('error', 'Failed!', "Select Office Name");
//                return false;
//            }
//            break;
//        case '3':
//            if ((accountGroupSNo == "" ? "0" : accountGroupSNo) != "0") {
//                ShowMessage('error', 'Failed!', "Select Account Group Name");
//                return false;
//            }
//            break

//    }

//    var rateAirlineUpdatedRows = new Array();
//    $("#tblRateAirlineTrans tr").each(function () {
//        var rateAirlineSlabId = $(this).find("input[type='text'][id*='Value']").attr("Id");
//        var rateAirlineSlabIdArray = new Array();
//        var rateAirlineSlabValue = $(this).find("input[type='text'][id*='Value']").val();
//        if (rateAirlineSlabValue != undefined && parseFloat(rateAirlineSlabValue) <= 0) {
//            ShowMessage('error', 'Failed!', "Enter Value in Slab Information");
//            return false;
//        }
//        if (rateAirlineSlabId != undefined && parseFloat(rateAirlineSlabValue) > 0) {
//            rateAirlineSlabIdArray = rateAirlineSlabId.split('_');
//            if (rateAirlineSlabIdArray.length > 0)
//                rateAirlineUpdatedRows.push(rateAirlineSlabIdArray[rateAirlineSlabIdArray.length - 1]);
//        }
//    });
//    var strData = staticTableToJSON("tblRateAirlineTrans", "SNo,SlabName,StartWeight,EndWeight,Value", "hidden,label,label,label,text", rateAirlineUpdatedRows);
//    $("#hdnRateAirlineTrans").val(strData);
//    rateAirlineUpdatedRows = [];
//    $("#tblRateDueCarrierTrans tr").each(function () {
//        var rateAirlineSlabId = $(this).find("input[type='text'][id*='Value']").attr("Id");
//        var rateAirlineSlabIdArray = new Array();
//        var rateAirlineSlabValue = $(this).find("input[type='text'][id*='Value']").val();
//        if (rateAirlineSlabValue != undefined && parseFloat(rateAirlineSlabValue) <= 0)
//            ShowMessage('error', 'Failed!', "Enter Value in Slab Information");
//        if (rateAirlineSlabId != undefined && parseFloat(rateAirlineSlabValue) > 0) {
//            rateAirlineSlabIdArray = rateAirlineSlabId.split('_');
//            if (rateAirlineSlabIdArray.length > 0)
//                rateAirlineUpdatedRows.push(rateAirlineSlabIdArray[rateAirlineSlabIdArray.length - 1]);
//        }
//    });
//    strData = staticTableToJSON("tblRateDueCarrierTrans", "HdnName,IsChargeableWeight,Value,MinimumValue,ValidFrom,ValidTo", "hidden,radiolist,text,text,text,text", rateAirlineUpdatedRows);
//    $("#hdnRateDueCarrierTrans").val(strData);
//}
function GetUnique(inputArray) {
    var outputArray = [];
    for (var i = 0; i < inputArray.length; i++) {


        if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
            outputArray.push(inputArray[i]);
        }
    }
    return outputArray;
}




function ExtraCondition(textId) {
    //$("#Text_CommoditySNo").val('');
    //$("#CommoditySNo").val('');
    var f = cfi.getFilter("AND");

    if (textId == "Text_CommoditySNo") {
        try {
            cfi.setFilter(f, "SNo", "neq", $("#OriginZoneSNo").val())
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
    if (textId == "Text_OriginZoneSNo") {
        cfi.ResetAutoComplete("OriginCitySNo");
        cfi.ResetAutoComplete("OriginAirportSNo");
    }
    if (textId == "Text_OriginCitySNo") {
        try {
            cfi.ResetAutoComplete("OriginAirportSNo");
            if ($("#Text_OriginZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#OriginZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }
    if (textId == "Text_OriginAirportSNo") {
        try {
            if ($("#Text_OriginCitySNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "CitySNo", "eq", $("#OriginCitySNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
        try {
            if ($("#Text_OriginZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#OriginZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }
    if (textId == "Text_DestinationZoneSNo") {
        cfi.ResetAutoComplete("DestinationCitySNo");
        cfi.ResetAutoComplete("DestinationAirportSNo");
    }
    if (textId == "Text_DestinationCitySNo") {
        try {
            cfi.ResetAutoComplete("DestinationAirportSNo");
            if ($("#Text_DestinationZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#DestinationZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }

  
    if (textId == "Text_DestinationAirportSNo") {
        try {
            if ($("#Text_DestinationCitySNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "CitySNo", "eq", $("#DestinationCitySNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
        try {
            if ($("#Text_DestinationZoneSNo").data("kendoAutoComplete").value() != '') {
                cfi.setFilter(f, "ZoneSNo", "eq", $("#DestinationZoneSNo").val())
                return cfi.autoCompleteFilter([f]);
            }
        }
        catch (exp)
        { }
    }
    //if (textId == "Text_DestinationCitySNo") {
    //    try {
    //        cfi.setFilter(f, "SNo", "neq", $("#OriginCitySNo").val())
    //        return cfi.autoCompleteFilter([f]);
    //    }
    //    catch (exp)
    //    { }
    //}
    if (textId == "Text_DestinationAirportSNo") {
        try {
            cfi.setFilter(f, "SNo", "neq", $("#OriginAirportSNo").val())
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }

}


function OnSelectAirline(e) {
    var Data = this.dataItem(e.item.index());
    var QueryString = "rateAirlineMasterSNo=" + Data.Key + "&originCitySNo=" + ($("#OriginCitySNo").val() == "" ? "0" : $("#OriginCitySNo").val()) + "&originAirportSNo=" + ($("#OriginAirportSNo").val() == "" ? "0" : $("#OriginAirportSNo").val()) + "";
    createRateAirlineTrans(QueryString);
}
