$(document).ready(function () {
    cfi.ValidateForm();
});

    
$('#HSCode').focusout(function () {
    if ($('#HSCode').val().length >= 6 || $('#HSCode').val() == '') {
        return true;
    }
    else if ($('#HSCode').val().length <= 6) {
        ShowMessage('warning', 'Need your Kind Attention!', "HSCode must have minimum 6 digits.");
        $('#HSCode').val('');
    }
});