var url = function () { return SiteUrl + "Services/AutoCompleteService.svc/AutoCompleteDataSource"; }

function SearchAWBRateAuditLog(Mode) {
    $("#SearchAWBRateAuditLogSearchForm").cfValidator();
    if (!$("#SearchAWBRateAuditLogSearchForm").data('cfValidator').validate()) {

        var SearchBy = $('input[type="radio"][name="SearchBy"]:checked').val();
        if (SearchBy == "1") {
            $("#Text_ReferenceNumber").attr("data_valid_msg", "Reference Number");
            theMessage = "Required Message 1";
        }
        else {
            $("#Text_ReferenceNumber").attr("data_valid_msg", "AWB Number");
            theMessage = "Required Message 2";

            // dynamically change the message
            messages: {
                    required: theMessage

            }
        }
        return false;
    } else {
        var SearchByOption;
        var SearchBy = $('input[type="radio"][name="SearchBy"]:checked').val();
        var ReferenceNumber = $('#SearchAWBRateAuditLogSearchForm input[id=ReferenceNumber]').val();
        if (SearchBy == "1")
        { SearchByOption = 1; }
        else { SearchByOption = 2; }

        $.ajax({
            url: "../AWBRateAuditLog/GetData",
            async: false,
            type: "GET",
            dataType: "json",
            data: { AwbReferenceSNo: ReferenceNumber, Mode: Mode, SearchByOption: SearchByOption },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (data) {
                var myData = data;

                if (Mode == 1) {
                    var obj1 = myData.Table0;
                    var obj2 = myData.Table1;
                    var obj3 = myData.Table2;
                    var obj4 = myData.Table3;

                    BindReferenceDetail(obj1, "AWBRateAuditLogSerachGridDiv");
                    BindRateMasterDetail(obj2, "AWBRateAuditLogSerachGridDivRate");
                    BindOtherChargesDetail(obj3, "AWBRateAuditLogSerachGridDivOtherCharges");
                    BindTaxRateDetail(obj4, "AWBRateAuditLogSerachGridDivTaxRate");
                    document.getElementById("AWBRateAuditLogSerachGridDivInfo").style.display = "block";
                    event.currentTarget.className += " active";
                }
                else if (Mode == 2) {
                    var obj = myData.Table0;
                    BindRateMasterDetail(obj, "AWBRateAuditLogSerachGridDivRateLogHistory");
                }
                else if (Mode == 3) {
                    var obj = myData.Table0;
                    BindOtherChargesDetail(obj, "AWBRateAuditLogSerachGridDivOtherChargesHistory");
                }
                else if (Mode == 4) {
                    var obj = myData.Table0;
                    BindTaxRateDetail(obj, "AWBRateAuditLogSerachGridDivTaxRateHistory");
                }
            }

        });
    }

    // ------------------------------------------------------------------
    //Commented Part is working

    //    $("#AWBRateAuditLogSerachGridDiv").kendoGrid({    
    //    //dataSource: {
    //    //    type: "json",
    //    //    transport: {
    //    //        read: {
    //    //            url: "/AWBRateAuditLog/GetData",
    //    //            dataType: "json",
    //    //            type: "get",
    //    //            global: false,
    //    //            data: searchRequest
    //    //        },
    //    //        pageSize: 10
    //    //    },
    //    //    schema: {
    //    //        model: {
    //    //            id: "ReferenceNumber", fields: {
    //    //                ReferenceNumber: { type: "string" }
    //    //            }
    //    //        },
    //    //        data: function (data)
    //    //        { return data.Table0; },
    //    //        //total: function (data)
    //    //        //{ return data.Total; },
    //    //    }
    //    //},
    //    height: 500,
    //    pageable: true,
    //    columns: [{
    //        title: "AWB Reservation Detail",
    //        columns: [{ field: "ReferenceNumber", title: "Reference Number", width: 100 },
    //                  { field: "OriginCityName", title: "Origin City Name", width: 100 },
    //                   { field: "DestinationCityName", title: "Destination City Name", width: 100 },
    //                   { field: "ProductName", title: "Product Name", width: 100 },
    //                   { field: "AccountName", title: "Account Name", width: 100 },
    //                   { field: "AWBPieces", title: "AWB Pieces", width: 100 },
    //                   { field: "GrossWeight", title: "Gross Weight", width: 100 },
    //                   { field: "ChargeableWeight", title: "Chargeable Weight", width: 100 },
    //        ]
    //    },
    //    ]

    //});
    //var searchRequest = function () {
    //    return {
    //        ReferenceNumber: $('#SearchAWBRateAuditLogSearchForm input[id=ReferenceNumber]').val()
    //    };
    //}
    //---------------
}

var SpaceControlSearchGrid;
$(document).ready(function () {
    var panelBarReservationInfo = $("#AWBRateAuditLogSearchpanelbar").kendoPanelBar().data("kendoPanelBar");
    var panelBarRateHistory = $("#AWBRateAuditLogSearchpanelbarRateHistory").kendoPanelBar().data("kendoPanelBar");
    var panelBarOtherChargesHistory = $("#AWBRateAuditLogSearchpanelbarOtherChargesHistory").kendoPanelBar().data("kendoPanelBar");
    var panelBarTaxRateLogHistory = $("#AWBRateAuditLogSearchpanelbTaxRateHistoryTab").kendoPanelBar().data("kendoPanelBar");
    cfi.AutoComplete("ReferenceNumber", "ReferenceNumber", "AWBReferenceBooking", "sno", "ReferenceNumber", ["ReferenceNumber"], null, "contains");
    cfi.AutoComplete("AirlineCode", "AirlineCode", "airline", "sno", "AirlineCode", ["AirlineCode"], null, "contains");
    document.getElementById("AWBRateAuditLogSerachGridDivInfo").style.display = "block";
    event.currentTarget.className += " active";
});
function BindReferenceDetail(obj1, GrdId) {
    debugger;
    //var theDiv = document.getElementById("AWBRateAuditLogSerachGridDiv");
    var theDiv = document.getElementById(GrdId);
    theDiv.innerHTML = "";
    var str = "<table class='appendGrid ui-widget' style='width: 100%; top:0px;margin-top:0px;' >"
    str += "<tr>"
                + "<td class='ui-widget-header Center'> AWB/ReferenceNumber </td>"
                 + "<td class='ui-widget-header Center'> Origin</td>"
                + "<td class='ui-widget-header Center'> Destination</td>"
                + "<td class='ui-widget-header Center'>Agent</td>"
                + "<td class='ui-widget-header Center'>Pieces</td> "
                + " <td class='ui-widget-header Center'>Gr.Weight</td>"
                + "</tr>"

    for (var i = 0; i < obj1.length; i++) {
        str += "<tr>"
           + "<td class='ui-widget-content first'>" + obj1[i].ReferenceNumber + "</td>"
            + "<td class='ui-widget-content first'>" + obj1[i].OriginCityName + "</td>"
            + "<td class='ui-widget-content first'>" + obj1[i].DestinationCityName + "</td>"
            + "<td class='ui-widget-content first'>" + obj1[i].AccountName + "</td>"
            + "<td class='ui-widget-content first'>" + obj1[i].AWBPieces + "</td>"
            + "<td class='ui-widget-content first'>" + obj1[i].GrossWeight + "</td>"
            + "</tr>"
    }
    str += "<tr>"
     + "<td  class='ui-widget-header Center'>Chargeable Weight</td>"
     + "<td  class='ui-widget-header Center'>Product</td>"
     + "<td  class='ui-widget-header Center'>Commodity Code</td>"
     + "<td  class='ui-widget-header Center'>Booking Date</td>"
     + "<td  class='ui-widget-header Center'>Booking Type</td>"
     + "<td  class='ui-widget-header Center'>Nature Of Goods</td>"
+ "</tr>"


    for (var i = 0; i < obj1.length; i++) {
        str += "<tr>"
           + "<td class='ui-widget-content first'>" + obj1[i].ChargeableWeight + "</td>"
           + "<td class='ui-widget-content first'>" + obj1[i].ProductName + "</td>"
           + "<td class='ui-widget-content first'>" + obj1[i].CommodityCode + "</td>"
           + "<td class='ui-widget-content first'>" + obj1[i].BookingDate + "</td>"
           + "<td class='ui-widget-content first'>" + obj1[i].BookingType + "</td>"
           + "<td class='ui-widget-content first'>" + obj1[i].NatureOfGoods + "</td>"
         + "</tr>"
    }
    str += "</table>";
    theDiv.innerHTML = str;
}
function BindRateMasterDetail(obj2, GrdId) {
    var theDiv = document.getElementById(GrdId);
    debugger;
    theDiv.innerHTML = "";
    var str = "<table class='appendGrid ui-widget' style='width: 100%; top:0px;margin-top:0px;' >"
    str += "<tr>"
               + " <td class='ui-widget-header Center'>Rate Type</td>"
                 + " <td class='ui-widget-header Center'>Reference Number</td>"
                + "<td class='ui-widget-header Center'>Rate</td>"
                + "<td class='ui-widget-header Center'>Freight</td>"
                 + " <td class='ui-widget-header Center'>Currency</td>"
                 + " <td class='ui-widget-header Center'>Total Amount</td>"
                  + " <td class='ui-widget-header Center'>Commission</td>"
                 + "</tr>"

    for (var i = 0; i < obj2.length; i++) {
        str += "<tr>"
        + "<td class='ui-widget-content first'>" + obj2[i].RateTypeName + "</td>"
                    + "<td class='ui-widget-content first'>" + obj2[i].RefrenceNo + "</td>"
                  + "<td class='ui-widget-content first'>" + obj2[i].MKTRate + "</td>"
                   + "<td class='ui-widget-content first'>" + obj2[i].MKTFreight + "</td>"
                   + "<td class='ui-widget-content first'>" + obj2[i].CurrencyCode + "</td>"
                   + "<td class='ui-widget-content first'>" + obj2[i].TotalAmount + "</td>"
                   + "<td class='ui-widget-content first'>" + obj2[i].Commission + "</td>"
          + "</tr>"
    } 
    str += "<tr>"
        + " <td class='ui-widget-header Center'>Commissionable</td>"
            + " <td class='ui-widget-header Center'>Weight Breakup Advantage</td>"
              + " <td class='ui-widget-header Center'>Declared Carriage Value</td>"
                + "<td class='ui-widget-header Center'>Uld Rating</td> "
                 + " <td class='ui-widget-header Center'>Spot Code</td>"
                  + " <td class='ui-widget-header Center'>Updated By</td>"
                   + " <td class='ui-widget-header Center'>Updated On</td>"
    + "</tr>"
    for (var i = 0; i < obj2.length; i++) {
        str += "<tr>"
             + "<td class='ui-widget-content first'>" + obj2[i].IsCommissionable + "</td>"
            + "<td class='ui-widget-content first'>" + obj2[i].WeightBreakupAdvantage + "</td>"
            + "<td class='ui-widget-content first'>" + obj2[i].DeclaredCarriageValue + "</td>"
              + "<td class='ui-widget-content first'>" + obj2[i].UldRating + "</td>"
             + "<td class='ui-widget-content first'>" + obj2[i].SpotCode + "</td>"
            + "<td class='ui-widget-content first'>" + obj2[i].UpdatedBy + "</td>"
            + "<td class='ui-widget-content first'>" + obj2[i].updatedon + "</td>"
            + "</tr>"
    }
    str += "</table>";
    theDiv.innerHTML = str;
}
function BindOtherChargesDetail(obj3, GrdId) {
    debugger;
    var theDiv = document.getElementById(GrdId);
    theDiv.innerHTML = "";
    var str = "<table class='appendGrid ui-widget' style='width: 100%; top:0px;margin-top:0px;' >"
    str += "<tr>"
              //  + "<td class='ui-widget-header'> ReferenceNumber </td>"
                + "<td class='ui-widget-header Center'>Charge Type</td>"
                 + "<td class='ui-widget-header Center'> Charge Code/Name</td>"
                + "<td class='ui-widget-header Center'>Charge Value </td>"
                 + " <td class='ui-widget-header Center'>Updated By</td>"
               + " <td class='ui-widget-header Center'>Updated On</td>"
            + "</tr>"
    for (var i = 0; i < obj3.length; i++) {
        str += "<tr>"
          //   + "<td class='ui-widget-content first'>" + myData.Table2[i].ReferenceNumber + "</td>"
            + "<td class='ui-widget-content first'>" + obj3[i].OtherChargeType + "</td>"
            + "<td class='ui-widget-content first'>" + obj3[i].OtherchargeDetail + "</td>"
            + "<td class='ui-widget-content first'>" + obj3[i].OtherChargeValue + "</td>"
              + "<td class='ui-widget-content first'>" + obj3[i].UpdatedBy + "</td>"
            + "<td class='ui-widget-content first'>" + obj3[i].updatedon + "</td>"
            + "</td></tr>"
    }
    str += "</table>";
    theDiv.innerHTML = str;
}
function BindTaxRateDetail(obj4, GrdId) {
    debugger;
    var theDiv = document.getElementById(GrdId);
    theDiv.innerHTML = "";
    var str = "<table class='appendGrid ui-widget' style='width: 100%; top:0px;margin-top:0px;' >"
    str += "<tr>"
               + "<td class='ui-widget-header Center'>Code/Name </td>"
               + "<td class='ui-widget-header Center'>Applicable </td> "
               + " <td class='ui-widget-header Center'>Applied At</td>"
               + "<td class='ui-widget-header Center'>Tax</td> "
               + "<td class='ui-widget-header Center'>Amount</td>"
               + "</tr>"
    for (var i = 0; i < obj4.length; i++) {
        str += "<tr>"
        + "<td class='ui-widget-content first'>" + obj4[i].TaxName + "</td>"
           + "<td class='ui-widget-content first'>" + obj4[i].TaxApplicable + "</td>"
           + "<td class='ui-widget-content first'>" + obj4[i].TaxAppliedAt + "</td>"
           + "<td class='ui-widget-content first'>" + obj4[i].TaxRate + "</td>"
           + "<td class='ui-widget-content first'>" + obj4[i].TaxAmount + "</td>"
    }
    str += "<tr>"
                + " <td class='ui-widget-header Center'>Minimum Charges</td>"
                + " <td class='ui-widget-header Center'>Reference Number</td>"
                + " <td class='ui-widget-header Center'>Updated By</td>"
                + " <td class='ui-widget-header Center'>Updated On</td>"
                  + " <td class='ui-widget-header Center'></td>"
            + "</tr>"
    /// by arman ali 
    if (obj4.length > 0) {


        for (var i = 0; i < 1; i++) {
            debugger;
            str += "<tr>"
                + "<td class='ui-widget-content first'>" + obj4[i].MinimumCharges + "</td>"
                 + "<td class='ui-widget-content first'>" + obj4[i].ReferenceNo + "</td>"
                 + "<td class='ui-widget-content first'>" + obj4[i].UpdatedBy + "</td>"
                  + "<td class='ui-widget-content first'>" + obj4[i].updatedon + "</td>"
                + "</td></tr>"
        }
    }
    str += "</table>";
    theDiv.innerHTML = str;
}

function OpenTab(evt, TabName, Mode) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(TabName).style.display = "block";
    evt.currentTarget.className += " active";
    SearchAWBRateAuditLog(Mode);
}

$('input[type="radio"][name="SearchBy"]').click(function () {
    if (this.value == 1) {
        $("#refNo").html('Reference Number');
        $("#Text_ReferenceNumber").attr("placeholder", "Reference Number");
        cfi.ResetAutoComplete("ReferenceNumber");
        cfi.AutoComplete("ReferenceNumber", "ReferenceNumber", "AWBReferenceBooking", "sno", "ReferenceNumber", ["ReferenceNumber"], null, "contains");
        GridBlank();
    }
    else {
        $("#refNo").html('AWB Number');
        $("#Text_ReferenceNumber").attr("placeholder", "AWB Number");
        cfi.ResetAutoComplete("ReferenceNumber");
        cfi.AutoComplete("ReferenceNumber", "AWBNo", "awb", "sno", "AWBNo", ["AWBNo"], null, "contains");
        GridBlank();
    }
});

$("li").click(function (e) {
    e.preventDefault();
    $("li").removeClass("selected");
    $(this).addClass("selected");
});

function ExtraCondition(textId) {
    var dd= $('input[type="radio"][name="SearchBy"]:checked').val();
    if (textId.indexOf("Text_AirlineCode") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "isinterline", "eq",0);
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        FilterAirlineCode = cfi.autoCompleteFilter(filter1);
        return FilterAirlineCode;
    }
    else if (textId.indexOf("Text_ReferenceNumber") >= 0 && dd==2)
    {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "AWBPrefix", "eq", $("#Text_AirlineCode").val()||0);
        FilterAirlineCode = cfi.autoCompleteFilter(filter1);
        return FilterAirlineCode;
    }
}
function GridBlank()
{
    var theDiv = document.getElementById("AWBRateAuditLogSerachGridDiv");
    var theDiv1 = document.getElementById("AWBRateAuditLogSerachGridDivRate");
    var theDiv2 = document.getElementById("AWBRateAuditLogSerachGridDivOtherCharges");
    var theDiv3 = document.getElementById("AWBRateAuditLogSerachGridDivTaxRate");
    theDiv.innerHTML = "";
    theDiv1.innerHTML = "";
    theDiv2.innerHTML = "";
    theDiv3.innerHTML = "";
    }