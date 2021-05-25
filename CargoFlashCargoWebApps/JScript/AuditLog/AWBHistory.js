$(document).ready(function () {


   
    $("[type='radio'][name='Filter'][value='A']").attr("checked", true);
    $("#Text_AWBPrefix_input").closest("tr").contents().show();
    $("#Text_RefNo_input").closest("tr").contents().hide();
    $("#Text_RefNo_input").removeAttr("data-valid");
    $('#Text_RefNo').closest('span').width(160);
});

$('input[type=radio][name=Filter]').change(function () {
    if (this.value == 'A') {
        $("#Text_AWBPrefix_input").closest("tr").contents().show();
        $("#Text_RefNo_input").closest("tr").contents().hide();
        $("#Text_RefNo_input").removeAttr("data-valid");
        $("#Text_AWBPrefix_input").attr("data-valid", 'required')
        $("#Text_AWBNO_input").attr("data-valid", 'required')
        $("#Text_RefNo_input").val("");
        $("#RefNo").val("");
    }
    else if (this.value == 'R') {
        $("#Text_RefNo_input").closest("tr").contents().show();
        $("#Text_AWBPrefix_input").closest("tr").contents().hide();
        $("#Text_AWBPrefix_input").removeAttr("data-valid");
        $("#Text_AWBNO_input").removeAttr("data-valid");
        $("#Text_RefNo_input").attr("data-valid", 'required');
        $("#Text_AWBNO_input").val("");
        $("#Text_AWBPrefix_input").val("");
        $("#AWBPrefix").val("");
        $("#AWBNO").val("");

    }
});

function BindAWBHistory() {
    var AWbNo = "";
    var AWBPrefix = "";
    var Act = "";
    var a = "";
    var b = "";
    if ($("input[name='Filter']:checked").val() == "A") {
        AWbNo = $("#AWBNO").val();
        AWBPrefix = $("#AWBPrefix").val();
        Act = "AWB"
        a = "AWB"
        b="AWB"
    }
    else if ($("input[name='Filter']:checked").val() == "R") {
        AWbNo = $("#RefNo").val();
        AWBPrefix = 1;
        Act = "REF"
        a = "Booking"
        b = "Reference";

    }
    debugger;
    // AWbNo = $('#Text_AWbNo').val();
    $("#AWBHistoryTbl").remove();
    $("#awbBaseTbl").remove();
    if (AWbNo != "") {
        $.ajax({
            url: 'GeTAWBHistory',
         //   async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWbNo: AWbNo,
                AWBPrefix: AWBPrefix,
                Act: Act,
            },

            contentType: "application/json; charset=utf-8",
            success: function (result) {
             //  var mydata= jQuery.parseJSON(result)
                debugger;
                var str = "<table id='AWBHistoryTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th  style='height: 30px;'  bgcolor='lightblue'>AWB No</th><th bgcolor='lightblue'>Origin</th><th bgcolor='lightblue'>Destination</th><th bgcolor='lightblue'>Gross Weight</th> <th bgcolor='lightblue'>Volume</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>Flight No</th><th bgcolor='lightblue'>Flight date</th><th bgcolor='lightblue'>Action</th> <th bgcolor='lightblue'>Created By</th> <th bgcolor='lightblue'>Updated By</th></tr></thead>";
                if (result.Table0.length > 0) {
                    for (var i = 0; i < result.Table0.length; i++) {
                        str += " <tbody><tr>";
                        str += "<td>" + result.Table0[i].AWBSNo + "</td>";
                        str += "<td>" + result.Table0[i].Origin + "</td>";
                        str += "<td>" + result.Table0[i].Destination + "</td>";
                        str += "<td>" + result.Table0[i].GrossWeight + "</td>";
                        str += "<td>" + result.Table0[i].FlightVolume + "</td>";
                       
                        str += "<td>" + result.Table0[i].Pieces + "</td>";
                        str += "<td>" + result.Table0[i].FlightNo + "</td>";
                        str += "<td>" + result.Table0[i].FlightDate + "</td>";
                        str += "<td>" + result.Table0[i].ACTION + "</td>";
                        str += "<td>" + result.Table0[i].CreatedUser + "</td>";
                        str += "<td>" + result.Table0[i].UpdatedUser + "</td>";

                     
                        str += "</tr></tbody>";
                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='12'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr></tbody>";
                }
                str += "</table>";
              
                $('#BindAWBHistoryTable').append(str);
                if (Act == "REF")
                    $("table tr>th:first").html("Reference No");
                else if (Act == "AWB")
                    $("table tr>th:first").html("AWB No");
             //   var baseDetails = "<table id='awbBaseTbl' border='0' style='border-collapse: collapse;width: 80%;height: 25px;font-size: 14px;text-align: center;'>"
             ////  baseDetails="<table id='basic' >"
             //   if(result.Table1.length> 0){
             //       for (var j = 0; j <1; j++) {
             //           //   baseDetails+= "<tr><td>Origin : " + result.Table1[j].Origin +"</td> "
             //           baseDetails += "<tr style='text-align: left;'><td style='width:30%'><b>" + b + " Number</b> : " + result.Table1[j].Number + "  </td><td style='width:30%'><b>Gross Weight :</b> " + result.Table1[j].GrossWeight + " </td><td style='width:30%'><b> Pieces  : </b>" + result.Table1[j].Pieces + "</td></tr>";

             //           baseDetails += "<tr style='text-align: left;'><td style='width:30%'><b>Origin</b> : " + result.Table1[j].Origin + "  </td><td style='width:30%'><b>Destination :</b> " + result.Table1[j].Destination + " </td><td style='width:30%'><b>" + a + " Date  : </b>" + result.Table1[j].Date + "</td></tr>";
             //           baseDetails += "<tr style='text-align: left;'><td style='width:30%'><b>Agent :</b> " + result.Table1[j].Agent + "</td><td style='width:30%'><b>Commodity:</b> " + result.Table1[j].CommodityCode + "</td><td style='width:30%'><b> Product: </b>" + result.Table1[j].Product + "</td></tr>";

             //       }
             //   }
             //   baseDetails += "</table>";
             //   $('#baseDetalis').append(baseDetails);
                
               
               
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

}

function ExtraCondition(textId) {
    var filterConsolidatorSNo = cfi.getFilter("AND");
   // var filterConsolidatorSNo1 = cfi.getFilter("OR");
    if (textId == "Text_RefNo") {
        if (userContext.GroupName == "AGENT") {
            cfi.setFilter(filterConsolidatorSNo, "AccountSNo", "in", userContext.AgentSNo)
            var reffilter = cfi.autoCompleteFilter(filterConsolidatorSNo)
            return reffilter
        }

    }
    if (textId == "Text_AWBNO") {
        if (userContext.GroupName == "AGENT") {
            cfi.setFilter(filterConsolidatorSNo, "AccountSNo", "in", userContext.AgentSNo)
        }

        cfi.setFilter(filterConsolidatorSNo, "AWBPrefix", "in", $("#AWBPrefix").val())
        var AWBfilter = cfi.autoCompleteFilter(filterConsolidatorSNo)
            return AWBfilter
    }

    
    
}

