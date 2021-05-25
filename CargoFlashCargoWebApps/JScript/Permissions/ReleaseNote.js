$(document).ready(function ()
{
    $(window).on('beforeunload', function () {
        //$("input[type=submit], input[type=button]").prop("disabled", "disabled");
        $('input[name="operation"]').prop("disabled", "disabled");
    });
});
var Model = [];
if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
{
    $('input[value="Save"]').hide();
    $("#MasterSaveAndNew").hide();
    $('input[value="Save"]').closest('td').append('<input name="operation" style="width:60px;" value="Save" class="btn btn-success" onclick="callHandler()">')
    $('input[value="Save"]').closest('td').append('<input name="operation" style="width:60px;" value="Back" class="btn btn-danger" onclick="CallBackFile()">')
    $("#RMajor").attr("placeholder", "MAJOR");
    $("#RMinor").attr("placeholder", "MINOR");
    $("#RBuild").attr("placeholder", "BUILD");
    //var version = '';
    //$("span[id=Version]").text('  -  ' + version);
    //$('.k-grid-content tbody tr td:eq(2)').each(function ()
    //{
    //    var text = $(this).text();
    //    alert(text);
    //});
}

if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
{
    $('input[value="Update"]').hide();
    $('input[value="Update"]').closest('td').append('<input name="operation" style="width:60px;" value="Update" class="btn btn-success" onclick="UpdateReleaseNote()">')
    $('input[value="Update"]').closest('td').append('<input name="operation" style="width:60px;" value="Back" class="btn btn-danger" onclick="CallBackFile()">')
    $('#RMajor').attr("disabled", true);
    $("#RMinor").attr("disabled", true);
    $("#RBuild").attr("disabled", true);
    var SNo = getQueryStringValue("RecID");
    BindExcelFileDetails(SNo);
}
function CallBackFile()
{
    $('#Author').removeAttr('data-valid');
    navigateUrl('Default.cshtml?Module=Permissions&Apps=ReleaseNote&FormAction=INDEXVIEW');
}
function callHandler() {
    if ($("#Author").val() == "")
    {
        return false;
    }
    else {
        var fileSelect = document.getElementById("Fileupload");
        var files = fileSelect.files;
        var validExts = new Array("xlsx", "xls");
        var ext = '';
        var fileName = '';
        var UserSNo = userContext.UserSNo;
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            fileName = files[i].name;
            ext = fileName.split('.').pop();
            if ($.inArray(ext, validExts) == -1)
            {
                ShowMessage('warning', 'Upload File!', 'Invalid File Selection');
                return false;
            }
            else
            {
                data.append(files[i].name, files[i]);
            }
        }
        if (fileName != 'ReleaseNotes.xlsx' || fileName == '' || fileName == undefined)
        {
            ShowMessage('warning', 'Upload File!', 'Choose File To Upload.');
            return false;
        }
        else
        {
            Model =
             {
                 Author: $("#Author").val(),
                 Major: $("#RMajor").val() == '' ? 0 : $("#RMajor").val(),
                 Minor: $("#RMinor").val() == '' ? 0 : $("#RMinor").val(),
                 Build: $("#RBuild").val() == '' ? 0 : $("#RBuild").val(),
                 ReleaseDate: $("#ReleaseDate").val(),
                 Description: $("#Description").val() == "" ? "" : $("#Description").val(),
             }
            $.ajax({
                url: '../DataSetToExcel/SaveReleaseNote',
                async: false,
                type: "POST",
                dataType: "json",
                data: JSON.stringify({ Model: Model }),
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    CallHandlerFile();
                },
                error: function (xhr) {
                    ShowMessage('warning', 'warning', "Some error.", "bottom-right");
                }
            });
        }
    }
}
function CallHandlerFile()
{
    var fileSelect = document.getElementById("Fileupload");
    var files = fileSelect.files;
    var validExts = new Array("xlsx", "xls");
    var ext = '';
    var fileName = '';
    var UserSNo = userContext.UserSNo;
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        ext = fileName.split('.').pop();
        if ($.inArray(ext, validExts) == -1) {
            ShowMessage('warning', 'Upload File!', 'Invalid File Selection');
            return false;
        }
        else {
            data.append(files[i].name, files[i]);
        }
    }
    if (fileName != 'ReleaseNotes.xlsx' || fileName == '' || fileName == undefined) {
        ShowMessage('warning', 'Upload File!', 'Choose File To Upload.');
        return false;
    }
    var tableString;
    var flag = true;
    $.ajax({
        url: "Handler/ReleaseNoteHandler.ashx?UserSNo=" + UserSNo,
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result)
        {
            ExcelResult = result;
                if (result.items.length > 0)
                {
                  navigateUrl('Default.cshtml?Module=Permissions&Apps=ReleaseNote&FormAction=INDEXVIEW');
                  ShowMessage('success', 'Success', "Release Note Save Successfully.", "bottom-right");
                }
        },
        error: function (err)
        {
            ShowMessage('warning', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
}
$("#RMinor").keypress(function (e)
{
    var iKeyCode = (e.which) ? e.which : e.keyCode
    if (((iKeyCode <= 96 && iKeyCode >= 105) || (iKeyCode >= 48 && iKeyCode <= 57)))
        return true;
    else if (iKeyCode == 16 || iKeyCode == 17 || iKeyCode == 18)
    {
        return false;
    }
    else
        return false;
});
$("#RBuild").keypress(function (e)
{
    var iKeyCode = (e.which) ? e.which : e.keyCode
    if (((iKeyCode <= 96 && iKeyCode >= 105) || (iKeyCode >= 48 && iKeyCode <= 57)))
        return true;
    else if (iKeyCode == 16 || iKeyCode == 17 || iKeyCode == 18)
    {
        return false;
    }
    else
        return false;
});
function BindExcelFileDetails(SNo)
{
    $("#tblReleaseNote").appendGrid({
        tableID: "tblReleaseNote",
        contentEditable: true,
        masterTableSNo: SNo,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "Services/Permissions/ReleaseNoteService.svc",
        getRecordServiceMethod: "GetReleaseNoteRecords",
        deleteServiceMethod: "DeleteReleaseNoteTrans",
        caption: "Release Note Details",
        initRows: 1,
        columns: [
            { name: "transSNo", type: "hidden" },
            { name: 'Module', display: 'Module', type: "text", ctrlCss: { width: '150px' ,height: '40px' }, isRequired: true },
            { name: "ModuleDescription", display: "Module Description", type: "text", ctrlCss: { width: "300px", height: '40px' }, isRequired: true },
            { name: "TFSId", display: "TFS Id", type: "text", ctrlCss: { width: "150px", height: '40px' }, isRequired: false },
            { name: "ModuleOwner", display: "Module Owner", type: "text", ctrlCss: { width: "150px", height: '40px' }, isRequired: true },
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: false, append: false, removeLast: false }
        
    });
    $("#tblReleaseNote_btnRemoveLast").remove();
}
function UpdateReleaseNote()
{
    var ReleaseNote = [];
    Model =
          {
              Author: $("#Author").val(),
              Major: $("#RMajor").val(),
              Minor: $("#RMinor").val(),
              Build: $("#RBuild").val(),
              ReleaseDate: $("#ReleaseDate").val(),
              Description: $("#Description").val() == "" ? "" : $("#Description").val(),
          }
    $("tr[id^='tblReleaseNote']").each(function (row, tr)
    {
        var ReleaseNoteModel =
        {
            SNo: SNo,
            Module: $(tr).find("input[id^='tblReleaseNote_Module_']").val(),
            ModuleDescription: $(tr).find("input[id^='tblReleaseNote_ModuleDescription_']").val(),
            TFSId: $(tr).find("input[id^='tblReleaseNote_TFSId_']").val(),
            ModuleOwner: $(tr).find("input[id^='tblReleaseNote_ModuleOwner_']").val(),
        }
        ReleaseNote.push(ReleaseNoteModel);
    });
    $.ajax({
        url: "../DataSetToExcel/UpdateReleaseNote", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Model:Model,ReleaseNote: ReleaseNote }),
        success: function (response)
        {
            var result = response[0];
            if (result > 0)
            {
                navigateUrl('Default.cshtml?Module=Permissions&Apps=ReleaseNote&FormAction=INDEXVIEW');
                ShowMessage('success', 'Success!', 'Updated Successfully', "bottom-right");
            }
        },
        error: function (er)
        {
            debugger
        }
    });
}




