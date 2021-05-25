$(document).ready(function ()
{
    var ConfirmPassword = "";
    var NewPassword ="";
    var GUID = "";
    var ValidFormat = true;
   
    $('#NewPassword').blur(function ()
    {
        NewPassword = $('#NewPassword').val();        

        if (NewPassword != "")
        {
            re = /[0-9]/;
            if (!re.test(NewPassword))
            {
                $('#mValidateMessage').text("Password must contain at least one number (0-9)!");
                $('#NewPassword').css("border", "1px solid red");
                $('#NewPassword').focus();
                ValidFormat = false;
                return false;
            }
            else ValidFormat = true;
            re = /[a-z]/;
            if (!re.test(NewPassword))
            {
                $('#mValidateMessage').text("Password must contain at least one lowercase letter (a-z)!");
                $('#NewPassword').css("border", "1px solid red");
                $('#NewPassword').focus();
                ValidFormat = false;
                return false;
            }
            else ValidFormat = true;
            re = /[A-Z]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one uppercase letter (A-Z)!");
                $('#NewPassword').css("border", "1px solid red");
                $('#NewPassword').focus();
                ValidFormat = false;
                return false;
            }
            else ValidFormat = true;
            re = /[-@!$%^&*()_+|~=`\\#{}\[\]:";'<>?,.\/]/;
            if (!re.test(NewPassword)) {
                $('#mValidateMessage').text("Password must contain at least one special character!");
                $('#NewPassword').css("border", "1px solid red");
                $('#NewPassword').focus();
                ValidFormat = false;
                return false;
            }
            else ValidFormat = true;

            if (ValidFormat == true) {
                $('#NewPassword').css("border", "1px solid #4CAF50");
                $('#mValidateMessage').text('');
            }

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
        if (NewPassword.length < 8 || ConfirmPassword < 8)
        {
            alert("Password must have minimum 8 characters");
            return false;
        }
        if (NewPassword != ConfirmPassword) {
            alert("New and Confirm Password do not match !!!");
            return false;
        }
        
        if(ValidFormat==false)
        {
            return false;
        }
        else {
            if (GUID != "" && GUID.length <= 36)
            {
                var path = window.location.href.split('/ResetPassword')[0];
                $.ajax({
                    url: "Services/Permissions/ChangePasswordService.svc/ResetPassword",
                    async: false,
                    type: "POST",
                    cache: false,
                    data: JSON.stringify({GUID:GUID, NewPassword:NewPassword}),
                    contentType: "application/json; charset=utf-8",
                    success: function (result)
                    {
                        result = JSON.parse(result);
                        if (result.Status == 0) {

                          //window.location.href.split('/ResetPassword')[0].split('//')[1]
                            alert("Password has been changed successfully.");
                           
                            location.href = path + "/Account/" + result.Url + "";
                        }
                        else if (result.Status == 2) {
                            //alert("New Password should be different from Previous Password!!!");
                            alert("Password should not be same as last 4 password");
                        }
                        else if (result.Status == 1) {
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
     
    $("body").keyup(function (event)
    {
        if (event.keyCode == 13)
        {
            $("#SavePassword").click();
        }
    });
});

   
function getQueryStringValue(name)
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
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