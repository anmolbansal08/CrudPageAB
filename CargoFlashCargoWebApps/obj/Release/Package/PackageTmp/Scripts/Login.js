$(document).ready(function () {
    var HdnPasswordExpire = $("#HdnPasswordExpire").val();
    if (HdnPasswordExpire != '' && HdnPasswordExpire != undefined) {
        PopChangePassword();
        $("#HdnPasswordExpire").val('');
        //$('#mValidateMessage').text("Password Expired , Please Change Password");
    }

    $("#email").val($("#HdnUName").val());
    $("#password").val($("#HdnPass").val());
    if ($("#email").val() != "" && $("#password").val() != "")
        $("#rememberMe").attr("checked", "true");
});
//Added By Amit Yadav
var iFramed = (window.location != window.parent.location) ? true : false;
if (iFramed == true) {
    window.parent.location.href = "GarudaLogin.cshtml";
}

// Added by Parvez Khan
function RefreshCaptcha() {
    var img = document.getElementById("imgCaptcha");
    img.src = "../Handler/CaptchaHandler.ashx?query=" + Math.random();
}
function PopChangePassword() {
    $("#PopChangePassword").remove();
    $("#LogInBtn").after('<div id="PopChangePassword" title="Forget Password" style="font-family: Arial; font-size:10px;"></div>');
    $("#PopChangePassword").append('<div style="color:mediumvioletred;font-size: 11px;text-align: center;">Your password has expired and must be changed.</div><table id="tblpassword" style="margin: 0px auto; width:60%;"><tr><td></td></tr><tr><td><label style="margin-top: 5%;" name="OldPassword">Old Password</label></td></tr><tr><td><input type="password" autocomplete="off" style="width:100%;margin-bottom: 2%;padding: 6px 10px; box-sizing: border-box;border: 1px solid #4CAF50;border-radius: 4px;" id="OldPassword" maxlength="20" onblur="requiredfn(this.id)" /></td></tr><tr><td><label name="NewPassword" >New Password</label></td></tr><tr><td><input type="password" onkeyup="PasswordStrength(this.value)"  id="NewPassword" maxlength="20" autocomplete="off" style="width:100%;margin-bottom: 2%;padding: 6px 10px;box-sizing: border-box;border: 1px solid #4CAF50;border-radius: 4px;"onblur="requiredfn(this.id)" /><div id="divresult"></div><div id="result"></div><span id="password_strength"></span></td></tr><tr><td><label name="ConfirmPassword">Confirm Password</label></td></tr><tr><td><input type="password"  id="ConfirmPassword" maxlength="20" autocomplete="off" style="width:100%;margin-bottom: 2%;padding: 6px 10px;box-sizing: border-box;border: 1px solid #4CAF50;border-radius: 4px;"onblur="requiredfn(this.id)" /></td></tr><tr><td><label id="mValidateMessage" style="color:red;"></label></td></tr></table>');
    $("#PopChangePassword").dialog(
    {
        autoResize: true,
        maxWidth: 400,
        maxHeight: 325,
        style: 'font-size:20px;',
        width: 400,
        height: 350,
        modal: true,
        dialogClass: 'no-close success-dialog',
        title: 'Change Password',
        draggable: false,
        resizable: false,
        buttons: {
            "Save": function () {
                var UserEmail = $('#HdnUserEmail').val();
                var OldPassword = $('#OldPassword').val();
                var NewPassword = $('#NewPassword').val();
                var ConfirmPassword = $('#ConfirmPassword').val();
                ChangePassword(UserEmail,OldPassword, NewPassword, ConfirmPassword);
                //$(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).dialog("close");
        }
    });
}
function ChangePassword(UserEmail,OldPassword, NewPassword, ConfirmPassword) {

    if (UserEmail == "" || OldPassword == "" || NewPassword == "" || ConfirmPassword == "") {
        if (OldPassword == "")
            $('#OldPassword').css("border", "1px solid red");
        if (NewPassword == "")
            $('#NewPassword').css("border", "1px solid red");
        if (ConfirmPassword == "")
            $('#ConfirmPassword').css("border", "1px solid red");

        $('#mValidateMessage').text("Passwords are mandatory !!!");
        return false;
    }
    else if (NewPassword.length <= 7) {//OldPassword.length < 5 || 
        $('#mValidateMessage').text("Password must have minimum 8 characters !!!");
        return false;
    }
    else if (OldPassword == NewPassword) {
        $('#mValidateMessage').text("New Password should be different from Previous Password!!!");
        return false;
    }
    else if (NewPassword != ConfirmPassword) {
        $('#mValidateMessage').text("New and Confirm Password do not match !!!");
        return false;
    }

    else if (NewPassword != "") {
        if (NewPassword != "") {
            re = /[0-9]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one number (0-9)!");
                $('#NewPassword').focus();
                return false;
            }
            re = /[a-z]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one lowercase letter (a-z)!");
                $('#NewPassword').focus();
                return false;
            }
            re = /[A-Z]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one uppercase letter (A-Z)!");
                $('#NewPassword').focus();
                return false;
            }
            re = /[-@!$%^&*()_+|~=`\\#{}\[\]:";'<>?,.\/]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one special character!");
                $('#NewPassword').focus();
                return false;
            }

            else {
                //alert("success");
                $('#mValidateMessage').text('');
                $.ajax({
                    url: "../Services/Permissions/ChangePasswordService.svc/UpdateChangePassword",
                    async: false,
                    type: "POST",
                    cache: false,
                    data: JSON.stringify({ UserEmail: UserEmail, OldPassword: OldPassword, NewPassword: NewPassword }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result == 0) {
                            alert("Password has been changed successfully.");
                            $('#PopChangePassword').dialog('close');
                        }
                        else {
                            if (result == 1)
                                $('#mValidateMessage').text("Old Password does not exist !!!");
                            else if (result == 2)
                                $('#mValidateMessage').text("Password should not be same as last 5 password.");
                            else
                                $('#mValidateMessage').text("Error !!!");
                        }
                    },
                    error: function (result) {
                        $('#mValidateMessage').text("Invaild Attempt !!!");
                    }
                });
            }

        }
    }


}
function PasswordStrength(New_Password) {    
    $('#result').html(checkStrength(New_Password))
}
function checkStrength(password) {
    var strength = 0

    if (password.length == 0) {
        $('#result').removeClass()
        $('#divresult').removeClass()
        return "";
    }

    if (password.length > 7) strength += 1
    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/[a-z]/) || password.match(/[A-Z]/)) strength += 1
    // If it has numbers and characters, increase strength value.
    //if (password.match(/[A-Z]/)) strength += 1
    if (password.match(/[0-9]/)) strength += 1
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // If it has two special characters, increase strength value.
    //if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // Calculated strength value, we can return messages
    // If value is less than 2
    if (strength == 1) {
        $('#result').removeClass()
        $('#result').addClass('short')
        $('#divresult').removeClass()
        $('#divresult').addClass('divshort')
        return 'Weak'
    }
    if (strength == 2) {
        $('#result').removeClass()
        $('#result').addClass('weak')
        $('#divresult').removeClass()
        $('#divresult').addClass('divweak')
        return 'Good'
    } else if (strength == 3) {
        $('#result').removeClass()
        $('#result').addClass('good')
        $('#divresult').removeClass()
        $('#divresult').addClass('divgood')
        return 'Strong'
    } else {
        $('#result').removeClass()
        $('#result').addClass('strong')
        $('#divresult').removeClass()
        $('#divresult').addClass('divstrong')
        return 'Very Strong'
    }
}
//added by Pankaj
function ForgetPassword() {
    $("#popForgetPassword").remove();
    $("#LogInBtn").after('<div id="popForgetPassword" title="Forget Password" style="font-family: Arial; font-size:10px;"></div>');
    $("#popForgetPassword").append('<table style="margin: 0px auto;"><tr><td><label style="margin-top: 5%;" name="mUserName">User ID</label></td></tr><tr><td><input type="text" style="margin-bottom: 2%;    padding: 6px 10px;    box-sizing: border-box;    border: 1px solid #4CAF50;  border-radius: 4px;" id="UserName" maxlength="30" onblur="requiredfn(this.id)" /></td></tr><tr><td><label name="mEmailID">Email Address</label></td></tr><tr><td><input type="text" style="margin-bottom: 2%;    padding: 6px 10px;    box-sizing: border-box;    border: 1px solid #4CAF50;  border-radius: 4px;" id="EmailID" maxlength="75" onblur="requiredfn(this.id)" /></tr></td><tr><td><label id="mValidateMessage" style="color:red;"></label></td></tr></table>');
    $("#popForgetPassword").dialog(
    {
        autoResize: true,
        maxWidth: 350,
        maxHeight: 275,

        width: 350,
        height: 275,
        modal: true,
        title: 'Forgot my Password',
        draggable: false,
        resizable: false,
        buttons: {
            "Reset": function () {
                var userName = $('#UserName').val();
                var EmailID = $('#EmailID').val();
                resetPassword(userName, EmailID);
                //$(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).dialog("close");
        }
    });
}
function requiredfn(id) {
    var value = $('#' + id).val();
    if (value != "") {
        $('#' + id).css("border", "1px solid #4CAF50");
    }
}
function resetPassword(UserName, EmailID) {

    if (UserName == "" || EmailID == "") {
        if (UserName == "")
            $('#UserName').css("border", "1px solid red");
        if (EmailID == "")
            $('#EmailID').css("border", "1px solid red");

        $('#mValidateMessage').text("User ID and Email Address are mandatory !!!");
        return false;
    }
    else {
        if (ValidateEMail(EmailID)) {
            var path = window.location.href.split('/Account')[0].split('//')[1];
            $.ajax({
                url: "../Services/Permissions/ChangePasswordService.svc/ForgetPassword",
                async: false,
                type: "POST",
                cache: false,
                data: JSON.stringify({ UserName: UserName, EmailID: EmailID, Path: path }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == 0) {
                        alert("Password reset link has been sent on the respective E-mail Address.");
                        location.href = "http://" + path + "/Account/GarudaLogin.cshtml";
                    }
                    else {
                        if (result == 1)
                            $('#mValidateMessage').text("User profile does not exist !!!");
                        else
                            $('#mValidateMessage').text("Error !!!");
                    }
                },
                error: function (result) {
                    $('#mValidateMessage').text("Invaild Attempt !!!");
                }
            });
        }
        else {
            $('#mValidateMessage').text("Please enter valid email address !!!");
        }
    }

}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return regex.test(email);
}
