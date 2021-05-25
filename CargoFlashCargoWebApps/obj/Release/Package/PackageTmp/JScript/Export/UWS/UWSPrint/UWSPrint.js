/// <reference path="../../../../Services/Export/UWS/UWSPrint/UWSPrintService.svc" />
var Tpcs = 0.000;
var Tgwt = 0.000;
var Tnwt = 0.000;
var len = 0;
$(document).ready(function () {
    GetUWSprintData();
    $('#Save_Print').click(function () {
        $('#Save_Print').hide();

        var UWSModel = [];

        for (var i = 0; i < len; i++) {
            $('#pry' + i).after('<span id="spnPry" ' + i + '>' + $('#pry' + i).val() + '</span>');
            $('#remark' + i).after('<span id="spnPry"' + i + '>' + $('#remark' + i).val() + '</span>');

            var Model_UWSModel = {
                SNo: $('#hdnSNoList').val().split(',')[i],
                Priority: $('#pry' + i).val(),
                Remarks: $('#remark' + i).val()
            };
            UWSModel.push(Model_UWSModel);

            $('#pry' + i).hide();
            $('#remark' + i).hide();
        }

        $.ajax({
            url: "../../../../Services/Export/UWS/UWSPrint/UWSPrintService.svc/SaveUWSPrintDetails",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ UWSModel: UWSModel }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result== 0) {
                    alert("Saved Successfully!! Press OK to Print...");
                    window.print();
                }
                else
                    alert("UWS data has not been saved!!");
            },
            error: function (xhr) {
                alert('warning', "Error!!!", "bottom-right");

            }
        });
        
    });

});

function GetUWSprintData() {
    var FlightNo = 'sh - 1001';
    var FlightDate = '2016-03-11 04:45:12.873';
    var UserSNo = 1;
    $.ajax({
        url: "../../../../Services/Export/UWS/UWSPrint/UWSPrintService.svc/GetUWSPrintData",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, UserSNo: UserSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var TableData = ResultData.Table1;
            len = TableData.length;

            if (FinalData.length > 0 && TableData.length > 0) {
                $("span#spnDateTime").text(FinalData[0].FlightDateTime);
                $("span#spnAirline").text(FinalData[0].AirlineName);
                $("span#spnFlight").text(FinalData[0].FlightNo);
                $("span#spnSector").text(FinalData[0].Sector);
                $("span#spnExp").text('');
                $("span#spnDes").text(FinalData[0].Destination);
                $("span#spnACFT").text(FinalData[0].RegNo);
                $("span#spnAgent").text(FinalData[0].AirlineName);
                $("span#spnEmpData").text(FinalData[0].UserName);
                $("span#spnType").text(FinalData[0].AircraftType);
                //$("span#spnACFT").text(FinalData[0].RegNo);
                var SNo = '';
                for (var i = 0; i < TableData.length; i++) {
                    $('tr#spDes').after("<tr style='border:1px solid black;'><td style='width:12%; padding:7px;'>" + TableData[i].EquipmentNumber + "</td><td style='width:14%; padding:7px;' colspan='2'>" + TableData[i].ULDNo + "</td><td style='width:7%; padding:7px; text-align:right;'>" + TableData[i].Pieces + "</td><td style='width:12%; padding:7px; text-align:right;' colspan='2'>" + TableData[i].GrossWt + "</td><td style='width:12%; padding:7px; text-align:right;'>" + TableData[i].NetWeight + "</td><td style='width:8%; padding:7px;' colspan='2'>" + "</td><td style='width:5%; padding:7px;'>" + "</td><td style='width:5%; padding:7px; text-align:right;'><input type='number' min='1' id='pry" + i + "' value='" + TableData[i].Priority + "' style='width:100%;text-align:right; font-size:10px;'>" + "</input></td><td style='width:22%; padding:7px; text-align:left;' colspan='2'>" + "<input type='text' id='remark" + i + "' value='" + TableData[i].Remarks + "' maxlength='50' style='width:100%; text-align:right; font-size:10px;'></td></tr>")
                    SNo = SNo + TableData[i].SNo + ',';
                    Tpcs = parseFloat(Tpcs) + parseFloat(TableData[i].Pieces);
                    Tgwt = parseFloat(Tgwt) + parseFloat(TableData[i].GrossWt.split(' ')[0]);
                    Tnwt = parseFloat(Tnwt) + parseFloat(TableData[i].NetWeight);
                }
                // SNo = SNo.slice(0, SNo.length - 1);
                $('#hdnSNoList').val(SNo);
                $("span#spnTpcs").text(Tpcs);
                $("span#spnTGwt").text(Tgwt.toFixed(2));
                $("span#spnTNwt").text(Tnwt.toFixed(2));
                $("span#spnMainTGwt").text(Tgwt.toFixed(3));
                $("span#spnMainTNwt").text(Tnwt.toFixed(3));
            }
            else {
                $('#Save_Print').hide();
                alert('Data not found for this flight and Date!!');
            }
        },
        error: function (err) {
            alert("Generated Error!");
        }
    });
}
function SaveUWSPrintDetail() {
    var tblGrid = "tblTaxSlab";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    $("#hdnFormData").val($('#tblTaxSlab').appendGrid('getStringJson'));
}