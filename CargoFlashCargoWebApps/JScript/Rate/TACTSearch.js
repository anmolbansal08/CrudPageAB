
$(document).ready(function () {

    cfi.AutoCompleteV2("OriginSNo", "AirportCode,AirportName", "ULD_UldStation", null, "contains");
    cfi.AutoCompleteV2("DestnationSNo", "AirportCode,AirportName", "ULD_UldStation", null, "contains");
    cfi.AutoCompleteV2("OriginCitySNo", "CityCode,CityName", "Reservation_City1", null, "contains");
    cfi.AutoCompleteV2("DestinationCitySNo", "CityCode,CityName", "Reservation_City1", null, "contains");
    cfi.AutoCompleteV2("OriginCountry", "CountryCode,CountryName", "Airline_CountryName", null, "contains");
    cfi.AutoCompleteV2("DestinationCountry", "CountryCode,CountryName", "Airline_CountryName", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "Reservation_Commodity", null, "contains");
    cfi.AutoCompleteV2("CarrierCode", "CarrierCode", "Reservation_Airline1", null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#OriginSNo').val(userContext.AirportSNo);
    $('#Text_OriginSNo_input').val(userContext.AirportCode + '-' + userContext.AirportName);


    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

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

});
function SearchTACT() {
    debugger;

    $.ajax({
        url: "http://ngenres.cargoflash.com/api/api/GetRates",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({
            "Origin": $("#Text_OriginSNo_input").val().split('-')[0],
            "Destination": $("#Text_DestnationSNo_input").val().split('-')[0],
            "OriginCity": $("#Text_OriginCitySNo_input").val().split('-')[0],
            "DestinationCity": $("#Text_DestinationCitySNo_input").val().split('-')[0],
            "OriginCountry": $("#Text_OriginCountry_input").val().split('-')[0],
            "DestinationCountry": $("#Text_DestinationCountry_input").val().split('-')[0],
            "Commodity": $("#Text_Commodity_input").val().split('-')[0],
            "Carrier": $("#Text_CarrierCode_input").val(),
            "ValidFrom": $("#FromDate").val(),
            "ValidTo": $("#ToDate").val()
        }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //    $("#grid").text(JSON.stringify(result.Rates))
            if (result.Rates != undefined && result.Rates != null && result.Rates.length > 0)
            {
                var rate, stdCharge,stdwtbrk,commodityChg,comwtbrk;
                var tblstr = '<table id="tbltact"><thead><tr><td>Effective Date</td><td>Rate Type</td><td>Origin</td><td>Destination</td><td>Currency Code</td><td>Standard Charge</td><td>Commodity Charges</td></tr></thead><tbody>';
                for (var i = 0; i < result.Rates.length;i++) 
                {
                    rate = result.Rates[i];
                    tblstr += '<tr><td>' + rate.EffectiveDate + '</td><td>' + rate.RateType + '</td><td>' + rate.Origin + '</td><td>' + rate.Destination + '</td><td>' + rate.CurrencyCode + '</td>'
                    stdCharge = rate.StandardCharge;
                    tblstr += '<td><table><thead><tr><td>Minimum Charge</td><td>Normal Charge</td><td>Weight Break</td></tr></thead><tbody>'
                    tblstr += '<tr><td>' + stdCharge.MinimumCharge + '</td><td>' + stdCharge.NormalCharge + '</td>'
                    if (stdCharge.WeightBreak.length > 0)
                    {
                        tblstr += '<td><table><thead><tr><td>Charge</td><td>Weight Measure</td></tr></thead><tbody>'
                        for (var j = 0; j < stdCharge.WeightBreak.length; j++)
                        {
                            stdwtbrk = stdCharge.WeightBreak[j];
                            tblstr += '<tr><td>' + stdwtbrk.WeightMeasure + '</td><td>' + stdwtbrk.Charge + '</td></tr>';
                            
                        }
                        tblstr += '</tbody></table></td>';
                    }
                    else
                    {
                        tblstr +='<td>&nbsp;</td>'
                    }
                    tblstr += '</tr></tbody></table></td>';
                    if (rate.CommodityCharges.length > 0) {
                        tblstr += '<td><table><thead><tr><td>Commodity</td><td>Weight Charge</td><td>Weight Break</td></tr></thead><tbody>'
                        for (var k = 0; k < rate.CommodityCharges.length; k++)
                            {
                            commodityChg = rate.CommodityCharges[k];
                            tblstr += '<tr><td>' + commodityChg.Commodity + '</td><td>' + commodityChg.WeightCharge + '</td>'
                            if (commodityChg.WeightBreak.length > 0) {
                                tblstr += '<td><table><thead><tr><td>Charge</td><td>Weight Measure</td></tr></thead><tbody>'
                                for (var l = 0; l < commodityChg.WeightBreak.length; l++) {
                                    comwtbrk = commodityChg.WeightBreak[l]
                                    tblstr += '<tr><td>' + comwtbrk.WeightMeasure + '</td><td>' + comwtbrk.Charge + '</td></tr>';
                                }
                                tblstr += '</tbody></table></td>'
                            }
                            else {
                                tblstr += '<td>&nbsp;</td>'
                            }
                            tblstr += '</tr>';
                            }
                                               
                        tblstr += '</tbody></table></td>';
                    }
                    else {
                        tblstr += '<td>&nbsp;</td>'
                    }
                    tblstr += '</tr>'
                }
                tblstr += '</tbody></table>';
                $("#grid").html(tblstr);
            }
            else
            {
                ShowMessage('warning', 'Warning - TACT Rates', 'No Rates found');
            }
            
        },
        error: function (xhr) {

        },
        complete: function (xhr) {


        }
    });

}


function ExtraCondition(textId) {
    var OriginFilter = cfi.getFilter("AND");
    if (textId.indexOf("Text_OriginSNo") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#DestnationSNo").val());
        OriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return OriginFilter;
    }
    if (textId.indexOf("Text_DestnationSNo") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#OriginSNo").val());
        OriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return OriginFilter;
    }
    if (textId.indexOf("Text_OriginCitySNo") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#DestinationCitySNo").val());
        OriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return OriginFilter;
    }
    if (textId.indexOf("Text_DestinationCitySNo") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#OriginCitySNo").val());
        OriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return OriginFilter;
    }
    if (textId.indexOf("Text_OriginCountry") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#DestinationCountry").val());
        OriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return OriginFilter;
    }
    if (textId.indexOf("Text_DestinationCountry") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#OriginCountry").val());
        OriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return OriginFilter;
    }

}

