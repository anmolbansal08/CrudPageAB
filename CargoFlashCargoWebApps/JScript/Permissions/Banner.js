$(document).ready(function () {
    SelectBannerType();
    $('#tbl tbody').find('.formlabel').closest('td').css('width', '20%');
    $('#tbl tbody').find('.formInputcolumn').closest('td').css('width', '80%');
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    $('#aspnetForm').attr("onsubmit", " return validateImgForm()");
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("input[type='file'][id='UploadDocument']").attr("value", "");
        var type = $("#BannerTypeNo").val();
        if (type == 0) {
            $('input:radio[id=BannerType]').filter('[value="0"]').attr('checked', true);
        }
        if (type == 1) {
            $('input:radio[id=BannerType]').filter('[value="1"]').attr('checked', true);
        }
        var checkedtype = $('input:radio[id=BannerType]:checked').val();
        // $("span[id='UploadDocument']").html(" ");
    }
    //if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
    //    $("span[id='UploadDocument']").html(" ");
    //}
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
});
function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}
function SelectBannerType() {
    var type = $('input:radio[id=BannerType]:checked').val();
    var type1 = $("#BannerTypeNo").val();
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
     if (type == 0) { 
        $('input[id=UploadDocument]').attr("disabled", true)
    }
    else if (type == 1) {
        $('input[id=UploadDocument]').removeAttr("disabled");
    }
        if ((type == 1 || type == 1) && ($("#UploadDocumentFile").val() == "")) {
            $('input[id=UploadDocument]').attr('data-valid', 'required');
            $('input[id=UploadDocument]').attr('data-valid-msg', 'Please Upload Banner Image');
            $("td[title='Banner Image']").html("<span style='color:red'>* </span>Banner Image").css("color", "black");
        }
        else if ((type == 0) && ($("#UploadDocumentFile").val() != "")) {
            $('input[id=UploadDocument]').removeAttr("data-valid");
            $("#UploadDocument").closest("td").prev().html("<span style='color:red'> </span> Banner Image").css("color", "black");
            
        }
        else if ((type == 1 || type1 == 1) && ($("#UploadDocumentFile").val() != "")) {
            $("td[title='Banner Image']").html("<span style='color:red'>* </span>Banner Image").css("color", "black");
        }
        else {
            $('input[id=UploadDocument]').removeAttr("data-valid");
            $("#UploadDocument").closest("td").prev().html("<span style='color:red'> </span> Banner Image").css("color", "black");
        }
        
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        var type = $('input:radio[id=BannerType]:checked').val();
        var type1 = $("#BannerTypeNo").val();
        if (type == 0) {
            $('input[id=UploadDocument]').attr("disabled", true)
        }
        else if (type == 1) {
            $('input[id=UploadDocument]').removeAttr("disabled");
        }
        if (type == 1 || type1 == 1) {
            $('input[id=UploadDocument]').attr('data-valid', 'required');
            $('input[id=UploadDocument]').attr('data-valid-msg', 'Please Upload Banner Image');
            $("td[title='Banner Image']").html("<span style='color:red'>* </span>Banner Image").css("color", "black");
        }
        else {

            $('input[id=UploadDocument]').removeAttr("data-valid");
            $("#UploadDocument").closest("td").prev().html("<span style='color:red'> </span> Banner Image").css("color", "black");
        }
    }

}
function SaveDocument() {
    if ($("#UploadDocumentFile").val() == "" || $("#UploadDocumentFile").val() == undefined || $("#UploadDocumentFile").val() == null) {
        ShowMessage('warning', 'Warning - Information', "No file for Download.");
    }
    else {
        var _url = "BannerImage/" + $("#UploadDocumentFile").val();
        window.open(_url, '_blank');
    }
}

function validateImgForm() {
    var fp = $("input[type='file'][id='UploadDocument']");
    if (fp.length != 0) {
        var lg = fp[0].files.length; // get length
        var items = fp[0].files;
        var name = fp[0].files[0].name;
        if (name.split('.')[0].length > 50) {
            ShowMessage('warning', 'Warning - Information', "File Name can not be longer than 50 character.");
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}


