/// <reference path="../../Services/EDI/TelexTypeService.svc" />

$(document).ready(function () {

    $("#tbl tbody tr:nth-child(5) td:nth-child(3)").css({ "background-color": "#ffffff", "border-right": "none", "border-bottom": "none" });
    $("#tbl tbody tr:nth-child(5) td:nth-child(4)").css({ "border-bottom": "none" });
    $("#tbl tbody tr:nth-child(6) td:nth-child(3)").css({ "background-color": "#ffffff", "border-right": "none" });
    $("#tbl tbody tr:nth-child(7) td:nth-child(3)").css({ "background-color": "#ffffff", "border-right": "none" });
    $("#tbl tbody tr:nth-child(5) td:nth-child(1)").css("text-align", "left");
    $("#tbl tbody tr:nth-child(6) td:nth-child(1)").css("text-align", "left");
    $("#tbl tbody tr:nth-child(7) td:nth-child(1)").css("text-align", "left");
    //$("#MasterSaveAndNew").hide();
    //$("input[name='operation']").hide();
    $('#TeleTextMessage').css("text-transform", "uppercase");
    divadd = $("<div id='divsitaAdd' style='overflow:auto;'><ul id='addlist' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    $("#Text_SitaAddress").after(divadd);
    $("#Text_SitaAddress").css("text-transform", "uppercase");
    SetSitaAddress();

    divmail = $("<div id='divmailAdd' style='overflow:auto;'><ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    $("#Text_EmailAddress").after(divmail);
    SetEMail();

    spnlbl = $("<span class='k-label'>(Press enter key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
    $("#Text_EmailAddress").after(spnlbl);

    add = $("<input type='hidden' id='hdnadd' name='hdnadd' value >");
    email = $("<input type='hidden' id='hdnmail' name='hdnmail' value >");
    $("#Text_SitaAddress").after(add);
    $("#Text_EmailAddress").after(email);


    $("#SendMessage").click(function () {

        var k = ''; var L = '';
        for (var i = 0; i < $("ul#addlist li span").text().split(' ').length - 1; i++)
        { k = k + $("ul#addlist li span").text().split(' ')[i] + ','; }

        for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
        { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }

        //   $("#Text_SitaAddress").val(k.substring(0, k.length - 1));        //remove last comma   

        $("#hdnadd").val(k.substring(0, k.length - 1));
        if ($("#addlist li").length > 0)
            $("#Text_SitaAddress").removeAttr("data-valid");


        //$("#Text_EmailAddress").val(L.substring(0, L.length - 1));

        $("#hdnmail").val(L.substring(0, L.length - 1));
        if ($("#addlist1 li").length > 0)
            $("#Text_EmailAddress").removeAttr("data-valid");

        //for save
        if ($("#TeleTextMessage").val() == '') {
            ShowMessage('warning', 'Warning - Telex Type', "Free text field is Mendatory.");
            $("#TeleTextMessage").focus();
        }
        else if (($("#addlist1 li").length > 0) || ($("#addlist li").length > 0)) {
            $.ajax({
                url: "Services/EDI/TelexTypeService.svc/SaveTelexType",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ SitaAddress: $("#hdnadd").val(), EmailAddress: $("#hdnmail").val(), TeleTextMessage: btoa($("#TeleTextMessage").val()) }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    if (result == 0) {
                        ShowMessage('success', '', "Message sent successfully");
                    }
                    else
                        alert("Some Error!!");
                },
                error: {
                }
            });
            $("#TeleTextMessage").val("");
            $("#Text_SitaAddress").val("");
            $("#Text_EmailAddress").val("");
            $("ul#addlist li").remove();
            $("ul#addlist1 li").remove();
        }
        else {
            ShowMessage('warning', 'Warning - Telex Type', "Either SITA Address or E-mail Address is required to process message");
        }
    });


    var maxLength = 65;
    var y = 0;
    $('#TeleTextMessage').on('keyup', function () {
        var text = $(this).val();
        var lines = text.split(/(\r\n|\n|\r)/gm);
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length > maxLength) {
                lines[i] = lines[i].substring(0, maxLength);
                lines[i] = lines[i] + "\r";
            }
        }
        $(this).val(lines.join(''));
    });

    //    var count = 1;
    //$('#TeleTextMessage').on('input focus keydown keyup', function () {
    //    var text = $(this).val().toUpperCase();
    //    var lines = text.split(/(\r\n|\n|\r)/gm);
    //    var len=text.replace(/(\r\n|\n|\r)/gm,"").length;
    //    if (parseInt(len / count) == maxLength){            
    //            $(this).val(text + '\n');
    //            count++;
    //        }     
    //});
    //$('#TeleTextMessage').bind("cut paste", function (e) {
    //    e.preventDefault();
    //});
});
function SetSitaAddress() {

    $("#Text_SitaAddress").keyup(function (e) {

        //if (e.keyCode == 32) {

        //    e.preventDefault();
        //}

        var addlen1 = $("#Text_SitaAddress").val().toUpperCase();
        // addlen1 = addlen1.replace(/\s/g,'');
        addlen1 = addlen1.replace(/[^0-9a-zA-Z]/g, '');
        addlen1 = $("#Text_SitaAddress").val(addlen1);
        var addlen = addlen1.val().toUpperCase();
        if (addlen.length == 7) {
            var restdata = $("ul#addlist li").text().split(" ");

            for (var i = 0; i < restdata.length; i++) {
                if (addlen == restdata[i]) {
                    $("#Text_SitaAddress").val('');
                    ShowMessage('warning', 'Warning - Telex Type', "SITA Address already entered");
                    return;
                }
            }


            if ($("ul#addlist li").length < 35) {
                var listlen = $("ul#addlist li").length;
                $("ul#addlist").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;text-transform: uppercase'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                // $("ul#addlist").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span id='" + listlen + "' class='k-icon k-delete remove'>" + addlen +"</span></li>");
            }
            else {
                ShowMessage('warning', 'Warning - Telex Type', "Maximum 35 Sita Address allowed.");
            }
            $("#Text_SitaAddress").val('');
        }
        else if (addlen.length > 7) {
            $("#Text_SitaAddress").val('');
        }
        else
            e.preventDefault();

    });

    $("#Text_SitaAddress").blur(function () {
        $("#Text_SitaAddress").val('');
    });
    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });

}

function SetEMail() {
    $("#Text_EmailAddress").keyup(function (e) {
        var addlen = $("#Text_EmailAddress").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 13) {
            //var email = $("#Text_EmailAddress").val();
            if (ValidateEMail(addlen)) {
                if ($("ul#addlist1 li").length < 10) {
                    var listlen = $("ul#addlist1 li").length;
                    $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");

                }
                else {
                    ShowMessage('warning', 'Warning - Telex Type', "Maximum 10 E-mail Addresses allowed.");
                }
                $("#Text_EmailAddress").val('');
            }
            else {
                alert("Please Enter valid Email address");
            }
        }
        else
            e.preventDefault();
    });
    $("#Text_EmailAddress").blur(function () {
        $("#Text_EmailAddress").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });
}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}


