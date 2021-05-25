/// <reference path="../Scripts/common.js" />
$(document).ready(function () {
    cfi.ValidateForm();
    $("#HandOverCutOffTime").closest("td").append("<span id='_spnHANDOVERCUTOFFTIME_'>" + " " + "</span> ");
    cfi.AutoComplete("BucketClassSNo", "Name", "vHandOverBucketClass", "SNo", "Name");
    cfi.AutoComplete("CityCode", "CityCode,CityName", "vCity", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains", ",");
    $("#_tempHandOverCutOffTime0DD").watermark("DD");
    $("#_tempHandOverCutOffTime0HH").watermark("HH");
    $("#_tempHandOverCutOffTime0MM").watermark("MM");

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#ValidTo").val(getDateNextYear());
    }

    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })

    //    if ($('.buttonlink:eq(1)').text() == "Duplicate")
    //        $('.buttonlink:eq(1)').hide()
    //    if ($(".button:eq(1)").val() == "Save & New")
    //        $(".button:eq(1)").hide() 

    //code to bind multiple values

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")) {
        $("#HandOverCutoffTime").text($("#HandOverCutoffTime").text() + " (mins)");
        cfi.BindMultiValue("CityCode", $("#MultipleCityName").val(), $("#MultipleCityCode").val());
        $("#MultipleCityName").closest('tr').hide();
        $("#MultipleCityCode").closest('tr').hide();
    }
    else if ((getQueryStringValue("FormAction").toUpperCase() == "READ") || (getQueryStringValue("FormAction").toUpperCase() == "DELETE")) {
        cfi.BindMultiValueRead("CityCode", $("#MultipleCityName").val());
        $("#MultipleCityName").closest('tr').hide();
        $("span[id=HandOverCutoffTime]").text($("span[id=HandOverCutoffTime]").text() + ' mins')
    }
    // Hifen between multicontrol and 0 while pressing tab 

    $("#_spanHANDOVERCUTOFFTIME0DD_").text("-");
    $("#_spanHANDOVERCUTOFFTIME0HH_").text("-");

    //Appending DD-HH-MM
    $("#_spanHANDOVERCUTOFFTIME0_").text("DD-HH-MM")

    //function to calculate mins

    $("input[id^=HandOverCutOffTime]:text").change(function () {
        var id = $(this).attr("id").toString().replace(/^(\w+)(\d+)(\w+)/, '$1$2');
        var dd = isNaN(parseInt($("#" + id + "DD").val() == "" ? "0" : $("#" + id + "DD").val(), 10)) ? 0 : parseInt($("#" + id + "DD").val() == "" ? "0" : $("#" + id + "DD").val(), 10);
        var hh = isNaN(parseInt($("#" + id + "HH").val() == "" ? "0" : $("#" + id + "HH").val(), 10)) ? 0 : parseInt($("#" + id + "HH").val() == "" ? "0" : $("#" + id + "HH").val(), 10);
        var mm = isNaN(parseInt($("#" + id + "MM").val() == "" ? "0" : $("#" + id + "MM").val(), 10)) ? 0 : parseInt($("#" + id + "MM").val() == "" ? "0" : $("#" + id + "MM").val(), 10);
        var time = dd * 24 * 60 + hh * 60 + mm;
        $("#" + id).val(time.toString())
        $("#HandOverCutoffTime").text($("#" + id).val() + " (mins) ");
        if (($("#" + id + "DD").val() != "") && ($("#" + id + "HH").val() != "") && ($("#" + id + "MM").val() != "")) {
        if(time==0)
           // Dialog.alert("Please enter a valid time(greater then 0 mins)");
            CallMessageBox('info', 'Please enter a valid time(greater then 0 mins)', '')

    }


    });

    // function for showing dialog box when handovercutofftime is '0'
    $("input[name=operation]").click(
        function TotalTime(e) {
            var dd = parseInt($("[id$='HandOverCutOffTime0DD']").val());
            var hh = parseInt($("[id$='HandOverCutOffTime0HH']").val());
            var mm = parseInt($("[id$='HandOverCutOffTime0MM']").val());
            if ($('.button:eq(0)').val() != 'Delete') {
                if ((dd + hh + mm) <= 0) {
                    //Dialog.alert("Please enter a valid time(greater then 0 mins)");
                    CallMessageBox('info', 'Please enter a valid time(greater then 0 mins)', '')
                    e.preventDefault();
                }
            }
        });
     
});

//function to put constraints on multicontrol

function timesetting(obj, type) {
    var id = ($(obj).attr("ID"));
    var id = ($("#" + id).attr("ID"));
    if ($(obj).val() == "")
        $(obj).val("0");

    if (type == "HH") {
        if (parseInt($(obj).val(), 10) > 23) {
            $(obj).val("23").change();
            // Dialog.alert("Hours should be less than 24");
            CallMessageBox('info', 'Hours should be less than 24', '')
        }
    }
    else if (type == "MM") {
        if (parseInt($(obj).val(), 10) > 59) {
            $(obj).val("59").change();
            CallMessageBox('info', 'Mins should be less than 60', '')
           // Dialog.alert("Mins should be less than 60");
        }

    }
    else if (type == "DD") {
        if (parseInt($(obj).val(), 10) > 99) {
            $(obj).val("99").change();
            CallMessageBox('info', 'Days should be less than 99', '');
            //Dialog.alert("Days should be less than 99");
        }
    }
}
   