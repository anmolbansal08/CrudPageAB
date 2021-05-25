/*
*****************************************************************************
Javascript Name:	Booking  
Purpose:		    
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Karan
Created On:		   24 DEC 2015
Updated By:         KARAN
Updated On:	       
Approved By:        
Approved On:	    
*****************************************************************************
*/
var cityHtml = '';
var pageType = $('#hdnPageType').val();
$(document).ready(function () {
    cfi.ValidateForm();
    //$('#__SpanHeader__').html("Walking Rate:")

    //$('.formbuttonrow').remove();
    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove();

    cfi.AutoCompleteV2("Commodity", "CommodityCode", "Shipment_Walking_CommodityCode",  null, "contains");
    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "Shipment_Walking_AirportCode", null, "contains");
    cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "Shipment_Walking_AirportCode",null, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "Shipment_Walking_ProductName", null, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Shipment_Walking_FlightNo", null, "contains");
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Shipment_Walking_AirlineCode", null, "contains");
    // $('#AWBNumber').attr('onkeyup', 'setDash(this);');
    $("input[id='Search'][name='Search']").click(function () {
        SearchData();
    });
});

function SearchData() {
    if (cfi.IsValidSubmitSection()) {  

    var dt = new Date($("#FlightDate").attr("sqldatevalue"));
    var m = "0"+(dt.getMonth() + 1);
    var d = "0"+dt.getDate();
    var dd = [{
        "lNOP": "1",
        "lWeight": $('#GrossWt').val(),
        "lWeightCode": "K",
        "lNOG": $('#Text_Commodity').val() || "General",
        "lOrigin": $('#Text_Origin').val(),
        "lDestination": $('#Text_Destination').val(),
        "lAirlinePrefix": $('#Text_Airline').val().split('-')[0] || "514",
        "lCarrierCode": $('#Text_FlightNo').val().split('-')[0] || "G9",
        "lFlightNumber": $('#Text_FlightNo').val().split('-')[1] || "",
        "lFlightdate": d.substring(d.length - 2, d.length) + '/' + m.substring(m.length - 2, m.length) + '/' + dt.getFullYear(),
        "lFlightCarrierCode": $('#Text_FlightNo').val().split('-')[0] || "GA",
        "lCurrencyCode": userContext.CurrencyCode,
        "lRateType": $("input[name=RateType]:checked").val() == "0" ? "TACT" : "PUBLISHED",
        "lSHCCode": ""
    }];

    var req = { "lText": JSON.stringify(dd) }

    $.ajax({
        type: "POST",
        cache: false,
        url: userContext.SysSetting.CRAServiceURL + 'WebServiceGetRates.asmx/GetMultipleRTDRates',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(req),
        success: function (data) {
            var q = JSON.parse(data.d);

            if (q.Airwaybill_ChargeLines == undefined || q.Airwaybill_ChargeLines == "")
            {
                ShowMessage('warning', 'Warning - Walk-In Rate Search!', "Rate Not Found For Specified Search Criteria!");
                $("#divWalkingRate").html('');
                return false;
            }
            
            //Airwaybill_ChargeLines
            var tbl = "<fieldset><legend>Charge Line:</legend><table class='appendGrid ui-widget' id='tblRateSearch'>";
            tbl += "<thead class='ui-widget-header' style='text-align:center'><tr>";
            tbl += "<td>Based On</td>";
            tbl += "<td>Chbl. Wt.</td>";
            tbl += "<td>Comm. Itm. Nbr.</td>";
            tbl += "<td>Gr. Wt.</td>";
            //tbl += "<td>NOGDIMS</td>";
            //tbl += "<td>NOPRCP</td>";
            tbl += "<td>Rate Class</td>";
            tbl += "<td>Rate</td>";
            tbl += "<td>Total Ch. Amt.</td>";
            tbl += "<td>Unit</td></tr></thead>";
            tbl += "<tbody class='ui-widget-content' style='text-align:center'>";
            $(q.Airwaybill_ChargeLines).each(function (index, e) {
                tbl += "<tr>";
                tbl += "<td class='ui-widget-content'>" + e.Based_On + "</td>";
                tbl += "<td class='ui-widget-content'>" + e.Display_ChargeableWeight + "</td>";
                tbl += "<td class='ui-widget-content'>" + (e.Display_CommodityItemNumber ||  "") + "</td>";
                tbl += "<td class='ui-widget-content'>" + e.Display_GrossWeight + "</td>";
                //tbl += "<td class='ui-widget-content'>" + e.Display_NOGDIMS + "</td>";
                //tbl += "<td class='ui-widget-content'>" + e.Display_NOPRCP + "</td>";
                tbl += "<td class='ui-widget-content'>" + e.Display_RateClassShortCode + "</td>";
                tbl += "<td class='ui-widget-content'>" + e.Display_RateOrCharge + "</td>";
                tbl += "<td class='ui-widget-content'>" + e.Display_TotalChargeAmount + "</td>";
                tbl += "<td class='ui-widget-content'>" + e.Display_UnitOfGrossWeight + "</td>";
                tbl += "</tr>";
            });
            tbl += "</tbody></table></fieldset>";

            //Airwaybill_Other_Charges
            if (q.Airwaybill_Other_Charges != undefined || q.Airwaybill_Other_Charges.length > 0) {
                tbl += "<fieldset><legend>Other Charges:</legend><table class='appendGrid ui-widget' id='tblOtherCharges'>";
                tbl += "<thead class='ui-widget-header' style='text-align:center'><tr>";
                tbl += "<td>Indicator</td>";
                tbl += "<td>Code</td>";
                tbl += "<td>Entitlement Code</td>";
                tbl += "<td>Charge Amount</td>";
                tbl += "<td>Reference Number</td>";
                tbl += "</tr></thead>";
                tbl += "<tbody class='ui-widget-content' style='text-align:center'>";
                $(q.Airwaybill_Other_Charges).each(function (index, e) {
                    tbl += "<tr>";
                    tbl += "<td class='ui-widget-content'>" + e.PC_Indicator + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Code + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Entitlement_Code + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Charge_Amount + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.ReferenceNumber + "</td>";
                    tbl += "</tr>";
                });
                tbl += "</tbody></table></fieldset>";
            }

            //Airwaybill_Tax
            if (q.Airwaybill_Tax != undefined || q.Airwaybill_Tax.length > 0) {
                tbl += "<fieldset><legend>Tax:</legend><table class='appendGrid ui-widget' id='tblTax'>";
                tbl += "<thead class='ui-widget-header' style='text-align:center'><tr>";
                tbl += "<td>Indicator</td>";
                tbl += "<td>Tax Code</td>";
                tbl += "<td>Entitlement Code</td>";
                tbl += "<td>Tax Name</td>";
                tbl += "<td>Tax Amount</td>";
                tbl += "<td>Tax Percentage</td>";
                tbl += "<td>Reference Number</td>";
                tbl += "<td>TAX Based For</td>";
                tbl += "</tr></thead>";
                tbl += "<tbody class='ui-widget-content' style='text-align:center'>";
                $(q.Airwaybill_Tax).each(function (index, e) {
                    tbl += "<tr>";
                    tbl += "<td class='ui-widget-content'>" + e.PC_Indicator + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Tax_Code + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Entitlement_Code + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Tax_Name + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Tax_Amount + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Tax_Percentage + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.ReferenceNumber + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.TAX_Based_For + "</td>";
                    tbl += "</tr>";
                });
                tbl += "</tbody></table></fieldset>";
            }

            //Airwaybill_ValuationCharges
            if (q.Airwaybill_ValuationCharges != undefined || q.Airwaybill_ValuationCharges.length > 0) {
                tbl += "<fieldset><legend>Valuation Charges:</legend><table class='appendGrid ui-widget' id='tblTax'>";
                tbl += "<thead class='ui-widget-header' style='text-align:center'><tr>";
                tbl += "<td>Value for Carriage</td>";
                tbl += "<td>Reference</td>";
                tbl += "</tr></thead>";
                tbl += "<tbody class='ui-widget-content' style='text-align:center'>";
                $(q.Airwaybill_ValuationCharges).each(function (index, e) {
                    tbl += "<tr>";
                    tbl += "<td class='ui-widget-content'>" + e.Display_Value_for_Carriage + "</td>";
                    tbl += "<td class='ui-widget-content'>" + e.Reference + "</td>";
                    tbl += "</tr>";
                });
                tbl += "</tbody></table></fieldset>";
            }

            $("#divWalkingRate").html(tbl);
            $("#divWalkingRate").dialog({
                title: "Walk-In Rate Search",
                show: {
                    effect: "blind",
                    duration: 800
                },
                hide: {
                    effect: "clip",
                    duration: 800
                },
                width: 1300,
                height: 560,
                modal: true,
                buttons: {
                    Close: function () {
                        $(this).dialog('close');
                    }
                }
            });
        }
    });
    }
}