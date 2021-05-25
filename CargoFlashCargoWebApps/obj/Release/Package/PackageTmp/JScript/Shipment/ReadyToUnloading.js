var pageType = $('#hdnPageType').val();

$(function () {
    $("#divbody").attr('ValidateOnSubmit', 'true');
    //$("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'><div id='divSli' ValidateOnSubmit><span id='spnSli'><input id='hdnPageType' name='hdnPageType' type='hidden' value='NEW'/><input id='hdnSli' name='hdnSli' type='hidden' value='0'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='NEW'/><table id='tblSli'></table></span></div></form");

    $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'><table width='100%'><tbody><tr><td class='formSection'>Ready to Unload</td></tr></tbody></table><div id='divSli' ValidateOnSubmit><span id='spnSli'><input id='hdnPageType' name='hdnPageType' type='hidden' value='NEW'/><input id='hdnSli' name='hdnSli' type='hidden' value='0'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='NEW'/><table id='tblSli'></table></span></div></form");

    $("#tblSli").before('<div id="SearchControls"><br/><input type="hidden" name="sAWBNo" id="sAWBNo" value=""/><input type="text" class="k-input" name="Text_sAWBNo" id="Text_sAWBNo" tabindex="1" controltype="autocomplete" maxlength="40" style="font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;width:150px;" value="" placeholder="AWB NO" data-role="autocomplete" autocomplete="off"/></div><div><br/></div>');

    cfi.AutoComplete("sAWBNo", "AWBNo", "vwAllAWB", "SNo", "AWBNo", ["AWBNo"], onselectAWB, "contains");

    $('#Text_sAWBNo').closest('span').parent('span').after('<input type="hidden" name="sSLINo" id="sSLINo"/><input type="text" class="k-input" name="Text_sSLINo" id="Text_sSLINo" tabindex="2" controltype="autocomplete" maxlength="40" style="font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;width:150px;" value="" placeholder="Lot No" data-role="autocomplete" autocomplete="off"/><div><br/></div>');

    cfi.AutoComplete("sSLINo", "SLINo", "vwAllSLi", "SNo", "SLINo", ["SLINo"], onselectSLI, "contains");

    $('#Text_sSLINo').closest('span').parent('span').after('&nbsp;&nbsp;&nbsp;<button tabindex="3" onclick="CreateSliGrid()" class="btn btn-block btn-primary" style="margin-top:0px; width:100px; font-size:13px;" id="btnSearch">Search</button>');
    $('#sAWBNo').before('&nbsp;&nbsp;&nbsp;<span id="spnAWBNo" style="font-weight:bold;"> AWB No. : </span>');
    $('#sSLINo').before('&nbsp;&nbsp;&nbsp;<span id="spnSLINo" style="font-weight:bold;"> Lot No. : </span>');
    $("#tblSli").before("<div><br/></div>");
});


function CheckDate(rowIndex) {
    var dbtableName = "Sli";
    var StartDate = $('#tbl' + dbtableName + '_StartDate_' + eval(eval(rowIndex) + 1)).val();
    var EndDate = $('#tbl' + dbtableName + '_EndDate_' + eval(eval(rowIndex) + 1)).val();

    var k = StartDate.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    k = EndDate.replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    if (dfrom > dto) {
        ShowMessage('warning', 'Warning - Ready To Unload', "End date can not be less than Start date.");
        $('#tbl' + dbtableName + '_EndDate_' + eval(eval(rowIndex) + 1)).val("");
    }


}
function CheckTime(rowIndex) {
    debugger;
    var dbtableName = "Sli";
    var StartDate = $('#tbl' + dbtableName + '_StartUTime_' + eval(eval(rowIndex) + 1)).val();
    var EndDate = $('#tbl' + dbtableName + '_EndUTime_' + eval(eval(rowIndex) + 1)).val();
    var startTime = StartDate;
    var endTime = EndDate;
    var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
    if (parseInt(endTime.replace(regExp, "$1$2$3")) < parseInt(startTime.replace(regExp, "$1$2$3"))) {
        ShowMessage('warning', 'Warning - Ready To Unload', "End Time should be greater than Start Time.");
        $('#tbl' + dbtableName + '_EndUTime_' + eval(eval(rowIndex) + 1)).val("");
    }
}

function CreateSliGrid() {
    var dbtableName = "Sli";
    CityAWBSLI = userContext.CitySNo + '-' + $('#sAWBNo').val() + '-' + $('#sSLINo').val();
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: "EDIT",
        masterTableSNo: "1",
        currentPage: 1, itemsPerPage: 10, whereCondition: CityAWBSLI, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Shipment/ReadyToUnloadService.svc",
        getRecordServiceMethod: "GetReadyToUnloadingRecord",
        //createUpdateServiceMethod: "UpdateReadyToUnloading",
        caption: "Ready To Unloading Information",
        columns: [{ name: "SNo", type: "hidden", value: 0 },
                 { name: "Sli", display: "SLI", type: "hidden" },
                 { name: "AWBNo", display: "AWB No", type: "label", ctrlCss: { width: "100px" } },
                 { name: "SLINo", display: "Lot No", type: "label", ctrlCss: { width: "100px" } },
                 { name: "AgentName", display: "Agent Name", type: "label", ctrlCss: { width: "100px" } },
                 //{ name: "Pieces", display: "Pieces", type: "label", ctrlCss: { width: "100px" } },
                 { name: "Verified", display: "Verified", type: "label", ctrlCss: { width: "100px" } },
                 { name: "Location", display: "Location", type: "label", ctrlCss: { width: "200px" } },
                 { name: "TruckNo", display: "Truck No", type: "text", ctrlAttr: { maxlength: 15, controltype: "alphanumericupper", isRequired: true }, ctrlCss: { width: "150px" } },
                 { name: "ManPower", display: "Man Power", type: "text", ctrlAttr: { maxlength: 4, controltype: "number", isRequired: true }, ctrlCss: { width: "150px" } },
                 //{ name: "BuildEquipment", display: "Build Equipment", type: "text", ctrlAttr: { controltype: "autocomplete" }, isRequired: true, tableName: "Consumables", textColumn: "Item", keyColumn: "SNo" }, 
                   { name: 'StartDate', display: 'Start Date', type: 'text', ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { CheckDate(rowIndex) }, isRequired: true },
                 { name: "StartUTime", display: "Start Time", type: "text", ctrlCss: { width: "80px", height: "18px" }, ctrlAttr: { maxlength: 5 }, isRequired: true },
                   { name: 'EndDate', display: 'End Date', type: 'text', ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { CheckDate(rowIndex) }, isRequired: true },
                 {
                     name: "EndUTime", display: "End Time", type: "text", ctrlCss: { width: "80px", height: "18px" }, ctrlAttr: { maxlength: 5 }, isRequired: true
                 },
                 { name: "Update", display: "Action", type: "label", value: "Update", ctrlCss: { width: "50px" } }
        ],
        isPaging: true,
        isExtraPaging: true,
        afterRowAppended: function (tbWhole, parentIndex, addedRows) {
            //$('[id^="tblSli_StartDate_"]').kendoTimePicker({
            //    format: "dd-mm-yyyy", interval: 1
            //});
            //$('[id^="tblSli_EndDate_"]').kendoTimePicker({
            //    format: "dd-mm-yyyy", interval: 1
            //});
            $('[id^="tblSli_StartUTime_"]').kendoTimePicker({
                format: "HH:mm", interval: 1
            });
            $('[id^="tblSli_EndUTime_"]').kendoTimePicker({
                format: "HH:mm", interval: 1
            });
            //$('[id^="tblSli_EndUTime_"]').bind('keyup', function (e, rowIndex) {
            //    CheckDate(rowIndex);
            //});
            $('[id*="UTime_"]').bind('keyup', function (e) {
                this.value = this.value.replace(/[^0-9:]/g, '');
            });
            $('[id*="UTime_"]').bind('blur', function (e) {
                var validTime = $(this).val().match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
                if (!validTime) {
                    $(this).val('');
                }
            });
            $('[id^="tblSli_Row_"]').each(function () {
                var id = ($(this).find('[id^="tblSli_Update_"]').attr('id'));
                $(this).find('[id^="tblSli_Update_"]').before('<button id="btn' + id + '" onclick="Update(this.id)" class="btn btn-info" style="margin-top:0px; width:50px;">Update</button>');
            });
            $('#tblSli tr td[colspan="1"]').css('height', '30px');
            removeValidations();
        },
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: true }
    });
    $('#tblSli_btnAppendRow').hide();


}

function Update(id) {
    removeValidations();
    $('#' + id).closest('tr').each(function () {
        $(this).find('[id^="tblSli_BuildEquipment_"]').attr("required", true);
        $(this).find('[id^="tblSli_EndUTime_"]').attr("required", true);
        $(this).find('[id^="tblSli_StartUTime_"]').attr("required", true);
        $(this).find('[id^="tblSli_EndDate_"]').attr("required", true);
        $(this).find('[id^="tblSli_StartDate_"]').attr("required", true);

        //data-valid="required"
        //ta-valid-msg="Select Airline"
    });
    var uRows = id.split('_')[2];
    if (!validateTableData('tblSli', uRows)) {
        return false;
    }
    else {

        var DataArray = [];
        $('#' + id).closest('tr').each(function () {
            var Array = {
                SNo: parseInt($(this).find('[id^="tblSli_SNo_"]').val() == "" ? 0 : $(this).find("input[id^='tblSli_SNo_']").val()),
                SLISNo: parseInt($(this).find('[id^="tblSli_Sli_"]').val() == "" ? 0 : $(this).find("input[id^='tblSli_Sli_']").val()),
                TruckNo: $(this).find("input[id^='tblSli_TruckNo_']").val(),
                ManPower: $(this).find("input[id^='tblSli_ManPower_']").val(),
                BuildEquipment: "",//$(this).find("input[id^='tblSli_HdnBuildEquipment_']").val(),
                StartDate: $(this).find("input[id^='tblSli_StartDate_']").val(),
                EndDate: $(this).find("input[id^='tblSli_EndDate_']").val(),
                StartUTime: $(this).find("input[id^='tblSli_StartDate_']").val() + ' ' + $(this).find("input[id^='tblSli_StartUTime_']").val(),
                EndUTime: $(this).find("input[id^='tblSli_EndDate_']").val() + ' ' + $(this).find("input[id^='tblSli_EndUTime_']").val()

            };
            DataArray.push(Array);
        });

        if (DataArray.length > 0) {
            $.ajax({
                url: "./Services/Shipment/ReadyToUnloadService.svc/UpdateReadyToUnloading", 
                async: false,
                type: "POST",
                cache: false,
                data: JSON.stringify({ ReadyToUnloading: DataArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "2000") {
                        ShowMessage('success', 'Success - Ready To Unload', "Updated Successfully");
                        $('#btnSearch').click();
                    }
                    else if (result == "2001") {
                        ShowMessage('warning', 'Warning - Ready To Unload', "End Time should be greater than Start Time.");
                    }
                    else {
                        ShowMessage('warning', 'Warning - Ready To Unload', "Unable to process.");
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Ready To Unload', "unable to process.");
                }

            });
        }
    }
}


function removeValidations() {
    //$('[id^="tblSli_BuildEquipment_"]').removeAttr('required');
    $('[id^="tblSli_EndUTime_"]').removeAttr('required');
    $('[id^="tblSli_StartUTime_"]').removeAttr('required');
    //$('[id^="tblSli_BuildEquipment_"]').css('border', '');
    $('[id^="tblSli_EndUTime_"]').css('border', '');
    $('[id^="tblSli_StartUTime_"]').css('border', '');

    $('[id^="tblSli_EndDate_"]').removeAttr('required');
    $('[id^="tblSli_StartDate_"]').removeAttr('required');
    $('[id^="tblSli_EndDate_"]').css('border', '');
    $('[id^="tblSli_StartDate_"]').css('border', '');

}

function validateTableData(id, uRows) {
    var upRows;
    if (!$.isArray(uRows)) {
        upRows = new Array();
        upRows[0] = uRows;
    }
    else
        upRows = uRows;
    var isValid = true;
    $('#' + id + (upRows.length != 1 ? ' tr input[id*="' + id + '_"]' : ' input[id*="_' + upRows[0] + '"]')).each(function () {
        if (this.dataset.role == 'autocomplete' && this.type != 'hidden' && this.required) {
            var inputID = this.id;
            if (inputID.split('_').length == 3)
                inputID = inputID.split('_')[0] + '_Hdn' + inputID.split('_')[1] + '_' + inputID.split('_')[2];
            if ($.trim($('#' + inputID).val()) == '') {
                isValid = false;
                $(this).css({ "border": "1px solid red" });
            }
            else $(this).css({ "border": "" });
        }//'alphanumericupper'
        else if ((this.dataset.role == 'numerictextbox' || this.dataset.role == 'decimal1' || this.dataset.role == 'decimal2' || this.dataset.role == 'decimal3' || this.dataset.role == 'decimal4' || this.dataset.role == 'decimal5') && this.required) {
            if (eval($.trim($('#_temp' + this.id).val())) == 0 || $.trim($('#_temp' + this.id).val()) == '') {
                isValid = false;
                $('#_temp' + this.id).css({ "border": "1px solid red" });
            } else $('#_temp' + this.id).css({ "border": "" });
        }
        else if (this.type == 'radio' && this.required) {
            if ($("input:radio[name=" + this.id.split('_')[0] + '_' + this.id.split('_')[1] + '_' + this.id.split('_')[2] + "]:checked").val() == undefined) {
                isValid = false;
                $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({ "border": "1px solid red" });
            }
            else $('#table' + this.id.split('_')[1] + this.id.split('_')[2]).css({ "border": "" });
        }
            //else if (($.trim($(this).val()) == '' || ($(this).attr('minlength') != undefined ? $.trim($(this).val()).length != eval($(this).attr('minlength')) : 0 != 0)) && this.type != 'hidden' && this.required) {
        else if (($.trim($(this).val()) == '' || ($(this).attr('minlength') != undefined ? $.trim($(this).val()).length < eval($(this).attr('minlength')) : 0 != 0)) && this.type != 'hidden' && this.required) {
            isValid = false;
            $(this).css({ "border": "1px solid red" });
        }
        else if (this.id.split('_')[1].toUpperCase() == 'MAWBNO') {
            if (CheckAWBNumberFormat(this.id, "0")) {
                $('#' + id).css({
                    "border": ""

                });
            }
            else if (this.required) {
                isValid = false;
                $('#' + id).css({
                    "border": "1px solid red"
                });
            }
        }
        else $(this).css({ "border": "" });
    });
    return isValid;
}

function onselectAWB() {
    $('#sSLINo').val('');
    $('#Text_sSLINo').val('');
}
function onselectSLI() {
    $('#sAWBNo').val('');
    $('#Text_sAWBNo').val('');
}
