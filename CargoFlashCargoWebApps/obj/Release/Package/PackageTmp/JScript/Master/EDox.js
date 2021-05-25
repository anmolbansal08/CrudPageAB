
var ApplicableInType = [{ Key: "0", Text: "Export" }, { Key: "1", Text: "Import" }, { Key: "3", Text: "Both" }];

$(document).ready(function () {
    cfi.ValidateForm();
    //cfi.AutoComplete("ZoneSNo", "SNo,ZoneName", "Zone", "SNo", "ZoneName", ["ZoneName"], null, "contains");
    cfi.AutoCompleteByDataSource("ApplicableIn", ApplicableInType)
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    $(document).on('drop', function () {
        return false;
    });

});

function checkForEmail(currObject) {
    var emailaddress = $("#" + currObject).val();
    var emailexp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if 
    (!emailexp.test(emailaddress)) {
        alert('Please enter valid email address.');
        $("#" + currObject).focus();
        return false;
    }
}