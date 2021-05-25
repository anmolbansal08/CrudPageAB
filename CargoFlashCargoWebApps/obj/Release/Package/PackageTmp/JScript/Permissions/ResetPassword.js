$(document).ready(function () {
    var ConfirmPassword = "";
    var NewPassword ="";
    var GUID ="";   
    $('#NewPassword').blur(function () {
        NewPassword = $('#NewPassword').val();
        if (NewPassword != "")
        {
            $('#NewPassword').css("border", "1px solid #4CAF50");
        }
    });
    $('#ConfirmPassword').blur(function () {
        ConfirmPassword = $('#ConfirmPassword').val();
        if (ConfirmPassword != "") {
            $('#ConfirmPassword').css("border", "1px solid #4CAF50");
        }
    });
    $('#SavePassword').click(function () {
        ConfirmPassword = $('#ConfirmPassword').val();
        NewPassword = $('#NewPassword').val();
        GUID = getQueryStringValue("GUID");
        if (NewPassword == "" ||ConfirmPassword == "")
        {
            if (NewPassword == "")
                $('#NewPassword').css("border", "1px solid red");
            if (ConfirmPassword == "")
                $('#ConfirmPassword').css("border", "1px solid red");

            return false;
        }
        if (NewPassword.length < 5 || ConfirmPassword < 5)
        {
            alert("Password must have minimum 5 characters");
            return false;
        }
        if (NewPassword != ConfirmPassword) {
            alert("New and Confirm Password do not match !!!");
            return false;
        }
        else {
            if (GUID != "" && GUID.length <=36) {
                $.ajax({
                    url: "Services/Permissions/ChangePasswordService.svc/ResetPassword",
                    async: false,
                    type: "POST",
                    cache: false,
                    data: JSON.stringify({GUID:GUID, NewPassword:NewPassword}),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result == 0) {

                            var path = window.location.href.split('/ResetPassword')[0].split('//')[1];
                            alert("Password has been changed successfully.");
                            location.href = "http://"+path+"/Account/GarudaLogin.cshtml";
                        }
                        else if (result == 2) {
                            alert("New Password should be different from Previous Password!!!");
                        }
                        else if (result == 1) {
                            alert("Link has been expired!!!");
                        }
                        else { alert("Invaild Attempt!!!"); }
                    },
                    error: function (result) { alert("Invaild Attempt!!!"); }
                });
            }
            else {
                alert("Invaild Attempt!!!");
                return false;
            }
        }
    });
     
    $("body").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#SavePassword").click();
        }
    });
});

   
function getQueryStringValue(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}