﻿$(document).ready(function () {
    cfi.ValidateForm();
   // var DateToUseList = [{ Key: "0", Text: "First Flown" }, { Key: "1", Text: "Sale Date" }, { Key: "2", Text: "AWP Execution Date" }]
    //cfi.AutoCompleteByDataSource("ExecutionOn", DateToUseList);
    cfi.AutoComplete("AirlineSNo", "AirlineName", "Airline", "SNo", "AirlineName");
    cfi.AutoComplete("OriginAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode");
    cfi.AutoComplete("DestinationAirportSNo", "AirportCode", "Airport", "SNo", "AirportCode");
    cfi.AutoComplete("Transit1", "AirportCode", "Airport", "SNo", "AirportCode");
    cfi.AutoComplete("Transit2", "AirportCode", "Airport", "SNo", "AirportCode");
    cfi.AutoComplete("Hub", "AirportCode", "Airport", "SNo", "AirportCode");

  

});


function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    if (($('#OriginAirportSNo').val() == 0 ) && (textId.indexOf("Transit1") >= 0 || textId.indexOf("Transit2") >= 0 || textId.indexOf("Hub") >= 0))
    {
        ShowMessage('warning', 'Need Your Kind Attention - Airline Hub!', "Select Origin Airport First");
        cfi.setFilter(f, "SNo", "eq", "0");
    }
    if (textId.indexOf("OriginAirportSNo") >= 0 || (textId.indexOf("Transit1") >= 0)) {
          cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "Transit1").replace("Text_Transit1", "OriginAirportSNo")).val());
      //  cfi.setFilter(f, "SNo", "neq", $("#OriginAirportSNo").val())
    }
    if (textId.indexOf("OriginAirportSNo") >= 0 || (textId.indexOf("Transit2") >= 0)) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "Transit2").replace("Text_Transit2", "OriginAirportSNo")).val());
    }
    if (textId.indexOf("OriginAirportSNo") >= 0 || (textId.indexOf("Hub") >= 0)) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "Hub").replace("Text_Hub", "OriginAirportSNo")).val());
    }
    if (textId.indexOf("Transit1") >= 0 || (textId.indexOf("Transit2") >= 0)) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_Transit1", "Transit2").replace("Text_Transit2", "Transit1")).val());
    }
    if (textId.indexOf("Transit1") >= 0 || (textId.indexOf("Hub") >= 0)) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_Transit1", "Hub").replace("Text_Hub", "Transit1")).val());
    }
    if (textId.indexOf("Hub") >= 0 || (textId.indexOf("Transit2") >= 0)) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_Hub", "Transit2").replace("Text_Transit2", "Hub")).val());
    }
    if (textId.indexOf("DestinationAirportSNo") >= 0 ) {
        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "DestinationAirportSNo").replace("Text_DestinationAirportSNo", "OriginAirportSNo")).val());
        //  cfi.setFilter(f, "SNo", "neq", $("#OriginAirportSNo").val())
    }
   
    return cfi.autoCompleteFilter([f]);
}

//========================Commented By Arman Ali==================================================================================================

//function ExtraCondition(textId) {
   
//};

//function ExtraCondition(textId) {
//    var f = cfi.getFilter("AND");

//    if (textId.indexOf("OriginAirportSNo") >= 0 || (textId.indexOf("DestinationAirportSNo") >= 0)) {
//        cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_OriginAirportSNo", "DestinationAirportSNo").replace("Text_DestinationAirportSNo", "OriginAirportSNo")).val());
//        cfi.setFilter(f, "SNo", "notin", $("#Leg").val());
//    }
//    else if (textId.indexOf("Leg") >= 0 && ($('#OriginAirportSNo').val() == 0 || $('#DestinationAirportSNo').val() == 0)) {
//        ShowMessage('warning', 'Need Your Kind Attention - Route!', "select origin and destination First");
//        cfi.setFilter(f, "SNo", "eq", "0");
//    }
//    else if (textId.indexOf("Leg") >= -1 && ($('#OriginAirportSNo').val() > 0 && $('#DestinationAirportSNo').val() > 0)) {
//        cfi.setFilter(f, "SNo", "notin", $("#Leg").val());
//        cfi.setFilter(f, "SNo", "neq", $('#DestinationAirportSNo').val());
//        cfi.setFilter(f, "SNo", "neq", $('#OriginAirportSNo').val());

//    }
//    return cfi.autoCompleteFilter([f]);
//}
//==========================================================================End=======================================================================