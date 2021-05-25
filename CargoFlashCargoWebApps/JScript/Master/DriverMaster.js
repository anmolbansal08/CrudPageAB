$(document).ready(function () {
    cfi.ValidateForm();
    //$(document).keydown(function (event) {
    //    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
    //        event.preventDefault();
    //    }
    //});
   
    $("#Mobile").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    cfi.AutoComplete("Nationality", "Nationality", "Country", "SNo", "Nationality", ["Nationality"], null, "contains");


    $("input#ID").on({
        keydown: function (e) {
            if (e.which === 32)
                return false;
        },
        change: function () {
            this.value = this.value.replace(/\s/g, "");
        }
    });

    $("#ID").change(function () {
        if (parseInt($("#ID").val()) == 0) {
            ShowMessage('warning', 'information - Driver Master', "Enter Valid ID No");
            $("#ID").val('');
            return false;
        }
    })

    $("#Mobile").change(function () {      
        if (parseInt($("#Mobile").val()) == 0) {
            ShowMessage('warning', 'information - Driver Master', "Enter Valid Mobile No");
            $("#Mobile").val('');
            return false;
        }

    })
    //$("[id^=ID]").keypress(function (evt) {
    //    var theEvent = evt || window.event;
    //    var key = theEvent.keyCode || theEvent.which;
    //    key = String.fromCharCode(key);
    //    var Charactors = "";    // allow only numbers [0-9] 
    //    var regex = /^[A-Za-z0-9-_]*$/;    // allow only alphanumeric
        
    //    if (Charactors.indexOf(key) < 0 && !regex.test(key)) {
    //        theEvent.returnValue = false;
    //        if (theEvent.preventDefault) theEvent.preventDefault();
    //    }
        
    //});
});