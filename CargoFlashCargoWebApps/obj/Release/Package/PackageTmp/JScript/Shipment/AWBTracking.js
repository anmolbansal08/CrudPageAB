$(document).ready(function () {
  
    $.ajax({
        url: 'HtmlFiles/Shipment/AWBTracking/AWBTracking.html',
        async: false,
        success: function (result) {
            $('#aspnetForm').append(result);
            cfi.AutoComplete("AirlineCode", "AirlineCode", "Airline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains");
            $("#Text_AirlineCode").val('126') ;
            $("#AirlineCode").val('126') ;
        }
    })
});

$(document).on('click', '#SearchAWB', function () {
    if ($("#AWBNo").val() == "") {
        $("#AWBDetails").html('');
        ShowMessage('warning', 'Need Your Kind Attention', "AWB No / Reference Number Is Required");
    }
    else if ($("#AirlineCode").val() == "") {
        $("#AWBDetails").html('');
        ShowMessage('warning', 'Need Your Kind Attention', "Airline Code Is Required");
    }
    else {
        Search();
    }
});

function Search() {
    var BasedOn = parseInt($("input[name='BasedOn']:checked").val());
    var AWBNo = $("#AWBNo").val();
    var CarrierCode = $("#AirlineCode").val();
    var AccountSNo = 0;
    var flag = 0;
    
    var str = "";
    var u = "";
    var str2 = "";
    if (userContext.GroupName.toUpperCase() == "AGENT") {
        AccountSNo = userContext.AgentSNo;
        flag = 1;
    }

    if (BasedOn == 0) { 
        str2 = "<span class='attMed'><strong>AWB No: " + CarrierCode+"-"
    }
    else
    {  
        str2 = "<span class='attMed'><strong>Reference Number: "
    }

    $.ajax({
        url: "Services/Shipment/AWBTrackingService.svc/GetAWBTrackingRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AWBNo: AWBNo, BasedOn: BasedOn , AccountSNo : AccountSNo , flag : flag , CarrierCode : CarrierCode},
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            $("#AWBDetails").html('');
            var count = 0;
            var myData = jQuery.parseJSON(result);
            if (myData.Table0.length > 0) {
                str += "<table width='800px' border='0' align='center' cellpadding='4' cellspacing='0'><tbody><tr><td width='700' align='left' valign='top'>"
                for (var i = 0; i < $("#AWBNo").val().split(',').length; i++) {
                    
                    
                        str += "<table width='800px' border='0' align='center' cellpadding='4' cellspacing='0' class='innerfontsize'><tbody><tr><td colspan='4' align='left' valign='bottom'>"
                        str += str2 + myData.Table0[count].AWBNo + "</strong></span></td></tr><tr><td width='15%' height='25' align='right' valign='middle'>Origin:</td><td width='35%' align='left' valign='middle'><strong>" + myData.Table0[count].Origin + "</strong></td><td width='35%' align='right' valign='middle' >Destination:</td><td width='15%' align='left' valign='middle' ><strong>" + myData.Table0[count].Destination + "</strong></td></tr><tr><td width='10%' height='25' align='right' valign='middle' >Total Pieces:</td><td width='35%' align='left' valign='middle' ><strong>" + myData.Table0[count].TotalPieces + "</strong></td><td width='40%' align='right' valign='middle' >Total Gross Wt.:</td><td width='10%' align='left' valign='middle' ><strong>" + myData.Table0[count].TotalGrossWeight + "</strong></td></tr>"
                        str += "<tr><td width='100%' colspan='4' valign='middle' bgcolor='#87CEFB'  height='25'><strong>&nbsp;AIRWAYBILL DETAILS</strong></td></tr>"
                        str += "<tr><td bgcolor='#daecf4' colspan='4' height='25px'>"
                        str += "<table cellspacing='0' cellpadding='4' border='0' width='800px'><tbody><tr><td width='11%'>Origin</td><td width='11%'>Destination</td><td width='11%' >Pieces</td><td width='16%' >Gross Weight</td><td width='11%'>Volume</td><td width='11%' >Status</td><td width='29%' >Executed At</td></tr>"
                    // <td width='9%'>Flight No</td><td width='9%'>Flight Date</td>
                    //<td width='9%'>" + myData.Table0[j].FlightNo + "</td><td width='9%'>" + myData.Table0[j].FlightDate + "</td>
                    
                    for (var j = 0; j < myData.Table0.length; j++) {
                        
                        if (myData.Table0[j].Unit ==0){ u= 'K'} else { u= 'L'}
                        if (myData.Table0[j].AWBNo == $("#Text_AirlineCode").val() + '-' + $("#AWBNo").val().split(',')[i] || myData.Table0[j].AWBNo == $("#AWBNo").val().split(',')[i]) {
                            count += 1;
                            str += "<tr style='background-color: white;'><td width='11%'>" + myData.Table0[j].Origin + "</td><td width='11%'>" + myData.Table0[j].Destination + "</td><td width='11%' >" + myData.Table0[j].Pieces + "</td><td width='16%' >" + myData.Table0[j].GrossWeight + "</td><td width='11%'>" + myData.Table0[j].cbm + "</td><td width='11%' >" + myData.Table0[j].AWBStatus + "</td><td width='29%' >" + myData.Table0[j].UpdatedUser + "</td></tr>"
                        } 
                    } str += "</tbody></table></td></tr>"
                    str += "<tr><td  colspan='4' >&nbsp;</td></tr>"
                    str += "<tr><td width='100%' colspan='4' valign='middle' bgcolor='#87CEFB'  height='25'><strong>&nbsp;FLIGHT DETAILS</strong></td></tr>"
                    str += "<tr><td bgcolor='#daecf4' colspan='4' height='25px'>"
                    str += "<table cellspacing='0' cellpadding='4' border='0' width='800px'><tbody><tr><td width='9%'>Flight No</td><td width='12%'>Flight Date</td><td width='9%'>Origin</td><td width='9%'>Destination</td><td width='9%' >Pieces</td><td width='10%' >Gross Weight</td><td width='9%'>Volume</td><td width='9%' >Action</td><td width='24%' >Executed At</td></tr>"
                    
                    for (var k = 0; k < myData.Table1.length; k++) {

                        if (myData.Table1[k].Unit == 0) { u = 'K' } else { u = 'L' }
                        if (myData.Table1[k].AWBNo == $("#AWBNo").val().split(',')[i] || myData.Table1[k].ReferenceNumber == $("#AWBNo").val().split(',')[i]) {
                            
                            str += "<tr style='background-color: white;'><td width='9%'>" + myData.Table1[k].FlightNo + "</td><td width='12%'>" + myData.Table1[k].FlightDate + "</td><td width='9%'>" + myData.Table1[k].Origin + "</td><td width='9%'>" + myData.Table1[k].Destination + "</td><td width='9%' >" + myData.Table1[k].Pieces + "</td><td width='10%' >" + myData.Table1[k].Weight + "</td><td width='9%'>" + myData.Table1[k].cbm + "</td><td width='9%' >" + myData.Table1[k].Action + "</td><td width='24%' >" + myData.Table1[k].UpdatedUser + "</td></tr>"
                        }
                    } str += "</tbody></table></td></tr>"
                }
                $("#AWBDetails").append(str);   
               
            }
            else {
                ShowMessage('warning', 'AWB TRACKING', "No Record Found");
            }

        }
    });
}


function ExtraCondition(textId) {

    var filterAWB = cfi.getFilter("AND");
    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAWB, "IsInterline", "eq", 0)
        var AutoCompleteFilter = cfi.autoCompleteFilter([filterAWB]);
        return  AutoCompleteFilter;
    }
}


//</tbody></table></td></tr></tbody></table>