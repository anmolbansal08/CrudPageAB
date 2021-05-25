$(document).ready(function () {
    cfi.ValidateForm();
    $("input").bind("keyup", function () {
        PutColoninStartRange(this);
    });
    $('#StartRange').bind('keypress', function (event) {
        if ($('#StartRange').val().length > 3) {
            ISNumeric($('#StartRange').val());
        }
        else {
         

            var regex = new RegExp("^[a-zA-Z0-9]+$");
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        }
    });

    $('#EndRange').bind('keypress', function (event) {
        if ($('#EndRange').val().length > 3) {

            ISNumeric($('#EndRange').val());
        }
        else {
           
           
            var regex = new RegExp("^[a-zA-Z0-9]+$");
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        }
    });

})

function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }
}


function CheckAWB(e) {
    var intRegex = /^\d+$/;
    var Data = $("#AWBNumber").val();
    var a = parseInt(Data);
    if (Data != "") {
        if (!intRegex.test(Data)) { alert("AWB No. Must be Numeric"); $("#AWBNumber").val(''); }
        else if (Data.length < 7) { alert("AWB No. Lenght Must be Seven Character"); $("#AWBNumber").val(''); }
        else if (a == 0) { alert("AWB No. can not be Zero"); $("#AWBNumber").val(''); }
    }
}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function StartRangeClear(e) {
    var intRegex = /^\d+$/;
    var Data = $("#StartRange").val();
    var EndRange = $("#EndRange").val();
    var SD = $("#StartRange").val().split('-');
    var ED = $("#EndRange").val().split('-');
    if (Data != "") {
        //var sd = $("#StartRange").val().split('-');
        if ($("#StartRange").val().length == 12) {
            //$("#EndRange").val(SD[0] + '-');
            //$("#EndRange").focus();
        }

        if (Data.length < 12) {
            //  alert("Start Range Lenght Must be Seven Character");
            ShowMessage('info', 'Need your Kind Attention!', "Start AWB Length is in Invalid Format.");
            $("#StartRange").val('');
        }
        else if ((Data.split('-')[1].substring(0, 7) % 7) != Data.split('-')[1].substring(7, 8)) {
            ShowMessage('info', 'Need your Kind Attention!', "Start AWB No is  Invalid.");
            $("#StartRange").val('');
        }

        else if (parseInt(ED[1]) < parseInt(SD[1]) && ED[1] != "") {
            // alert("Start Range should be less than  End Range");
            ShowMessage('info', 'Need your Kind Attention!', "Start AWB No should be less than End Range.");
            $("#StartRange").val('');
        }
        //else if ($("#EndRange").val().split('-')[0] != $("#StartRange").val().split('-')[0]) {
        //    //alert("AWB Prefix must be same");

        //    ShowMessage('info', 'Need your Kind Attention!', "AWB Prefix must be same.");
        //    $("#StartRange").val('');
        //}


    }

}
function EndRangeCount(e) {
    var intRegex = /^\d+$/;
    var Data = $("#EndRange").val();
    var StartRange = $("#StartRange").val();
    //var a = parseInt(Data);
    var SD = $("#StartRange").val().split('-');
    var ED = $("#EndRange").val().split('-');
    if (Data != "") {

        if (Data.length < 12) {
            // alert("End Range Lenght Must be Seven Character");
            ShowMessage('info', 'Need your Kind Attention!', "End AWB Length is in Invalid Format.");
            $("#EndRange").val('');
        }
        else if ((Data.split('-')[1].substring(0, 7) % 7) != Data.split('-')[1].substring(7, 8)) {
            ShowMessage('info', 'Need your Kind Attention!', "End AWB No is  Invalid.");
            $("#EndRange").val('');
        }
        else if (parseInt(SD[1]) > parseInt(ED[1]) && SD[1] != "") {
            //alert("End Range should be greater than Start Range");
            ShowMessage('info', 'Need your Kind Attention!', "End AWB No should be greater than Start Range.");
            $("#EndRange").val('');
        }
        else if ($("#EndRange").val().split('-')[0] != $("#StartRange").val().split('-')[0]) {
            // alert("AWB Prefix must be same");
            //var sd = $("#EndRange").val().split('-');
            if ($("#StartRange").val().length != 12) {
                $("#StartRange").val(SD[0] + '-');
            }
            ShowMessage('info', 'Need your Kind Attention!', "AWB Prefix must be same.");
            $("#EndRange").val('');
        }
        else {
            var sd = $("#EndRange").val().split('-');
            if ($("#StartRange").val().length != 12) {
                $("#StartRange").val(sd[0] + '-');
            }
        }


    }
}
function PutColoninStartRange(obj) {
    var s = $("#" + obj.id).val().length
    if (s == 3) {
        $("#" + obj.id).val($("#" + obj.id).val() + '-');
    }
}