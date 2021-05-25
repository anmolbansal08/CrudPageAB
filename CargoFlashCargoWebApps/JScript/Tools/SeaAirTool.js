

$(document).ready(function () {

    $('tr').find('td.formbuttonrow').remove();
    // $('tr').find('td.formActiontitle').remove();
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "SeaAirTool_AWBNo", GetSeaAirData, "contains");

    var type = [{ Key: "1", value: "1", Text: "SEA-AIR" }, { Key: "2", value: "2", Text: "RE-EXPORT" }, { Key: "3", value: "3", Text: "LOCAL" }, { Key: "4", value: "4", Text: "FREE-ZONE" }];
    cfi.AutoCompleteByDataSource("BookingType", type, onselectType, null);
    var date = new Date();
    date = (date.toLocaleDateString("en-au", { year: "numeric", month: "short", day: "numeric" }).replace(/\s/g, '-')).replace('.', '');
    $('#BOEDate').val('');
    $('#BOEDate').focus();
    function onselectType() {

    }
});

//$("#BOENo").keypress(function (e) {
//    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
//        return false;
//    }
//});

function GetSeaAirData() {
    if ($('#Text_AWBNo').val() != "") {
        awbsno = $('#AWBNo').val();
        $.ajax({
            url: "./Services/Tools/SeaAirToolService.svc/GetSeaAirToolRecord?SNo=" + awbsno, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#BOEDate').val(FinalData[0].BOEDate);
                    $('#_tempBOENo').val(FinalData[0].BOENo);
                    $('#BOENo').val(FinalData[0].BOENo);
                    // $('#Text_BookingType').val(FinalData[0].BookingType);
                }

            }
        });
    }
}

$('#UpdateSeaAirTool').bind("click", function () {

    //if ($('#AWBNo').val() == '') {
    //    ShowMessage('warning', '', "AWB No Can Not be Blank");
    //    return false;
    //}
    //if ($('#BookingType').val() == '') {
    //    ShowMessage('warning', '', "Booking Type Can Not be Blank");
    //    return false;
    //}
    //cfi.IsValidSubmitSection();
    UpdateSeaAir();

});

function UpdateSeaAir() {
    if ($('#AWBNo').val() == '') {
        ShowMessage('warning', '', "AWB No Can Not be Blank");
        return false;
    }
    if ($('#BookingType').val() == '') {
        ShowMessage('warning', '', "Booking Type Can Not be Blank");
        return false;
    }
    var AWBNo = $("#AWBNo").val();
    var BOEDate = $("#BOEDate").val();
    var BOENo = $("#BOENo").val();
    var BookingType = $("#BookingType").val();
    var UpdatedBy = userContext.UserSNo;

    $.ajax({
        url: "./Services/Tools/SeaAirToolService.svc/UpdateSeaAirTool",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AWBNo: AWBNo, BookingType: BookingType, BOENo: BOENo, BOEDate: BOEDate, UpdatedBy: UpdatedBy }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {


            var dataTableobj = JSON.parse(result);
            ShowMessage('success', 'Success - Sea Air', "Updated Successfully", "bottom-right");

            $('#Text_AWBNo').val('');
            $('#AWBNo').val('');
            $('#BOEDate').val('');
            $('#BOENo').val('');
            $('#_tempBOENo').val('');
            $('#Text_BookingType').val('');
            $('#BookingType').val('');

            return;

        },

        //error: function (err) {
        //    //alert("Generated Error");
        //}
    });
}