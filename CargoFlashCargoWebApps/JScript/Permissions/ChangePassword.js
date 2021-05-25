$(document).ready(function () {   
    $('#MasterSaveAndNew').hide();
    $("input[name='operation'][value='Save']").click(function () {
        if ($('#OldPassword').val()!="" && $('#ConfirmPassword').val() != "" && $('#NewPassword').val() != "") {
            if ($('#NewPassword').val() != $('#ConfirmPassword').val()) {
                ShowMessage('warning', 'Warning - Change Password', "Passwords do not match!!!");
                return false;
            }
        }
    });
});