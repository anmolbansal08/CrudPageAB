var pageType = $('#hdnPageType').val();
var flage = true;
var chekpiec = true;
var AWBUNHOLD = 0;

$(document).ready(function () {
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "HoldShipment_AWBNo", getHoldShptDeta, "contains");
    cfi.AutoCompleteV2("CityCode", "CityCode,CityName", "HoldShipment_City", null, "contains");
    cfi.AutoCompleteV2("Hold_Type", "Hold_Type", "HoldShipment_Hold_Type", null, "contains");
    cfi.AutoCompleteV2("Hold", "Hold_Type", "HoldShipment_Hold_Type", null, "contains");
    cfi.AutoCompleteV2("DeliveryOrderNo", "DeliveryOrderNo", "HoldShipment_DeliveryOrderNo", GetDeliveryPcs, "contains");
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "HoldShipment_FlightNo", GetDeliveryFlightDate, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#Text_DeliveryOrderNo").data("kendoAutoComplete").enable(false);
        $("#Text_FlightNo").data("kendoAutoComplete").enable(false);
    }

    $("#HoldGrossWeight").keypress(function (event) {
        var key = event.which;
        if (!(key >= 46 && key <= 57))
            event.preventDefault();
    });

    $("#HoldPieces").keypress(function (event) {
        var key = event.which;
        if (!(key >= 48 && key <= 57))
            event.preventDefault();
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($('#MomvementType:checked').val() == 1)
            GetDeliveryPcs();
        else
            GetTotalPices();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ") {
        getHoldShptDetail();
        $('input:radio[id^="MomvementType"]').attr('disabled', true);
        MakeNOnEditable();
        var autocomplete = $("#Text_AWBNo").data("kendoAutoComplete");
        autocomplete.enable(false);
        var autocomplete = $("#Text_CityCode").data("kendoAutoComplete");
        autocomplete.enable(false);
        SpceialRights()
    }

    if ($('#UnHold').prop('checked') == true) {
        $("#UnHoldRemarks").prop("readonly", false)
    }
    else {
        $("#UnHoldRemarks").prop("readonly", true)
    }

    var time
    $('#UnHold').change(function () {
        if ($(this).prop('checked') == true) {
            $("#UnHoldRemarks").prop("readonly", false)
        }
        else {
            $("#UnHoldRemarks").val(null)
            $("#UnHoldRemarks").prop("readonly", true)
        }
    })

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#CityCode").val(userContext.CitySNo);
        $("#Text_CityCode").val(userContext.CityCode + '-' + userContext.CityName);
        // getHoldShptDetail();
        if (userContext.IsShowAllData == false)
            $("#Text_CityCode").data("kendoAutoComplete").enable(false);
        else
            $("#Text_CityCode").data("kendoAutoComplete").enable(true);
    }

    var flag = true
    $('input[name="operation"]').unbind("click").click(function (e) {

        if ($('#MomvementType:checked').val() == 1)
            $('#HoldGrossWeight').attr('data-valid', 'required')
        else
            $('#HoldGrossWeight').attr('data-valid', '')

        if ($('#tblHoldShpt tbody tr:eq(0).empty').val() == "") {
            if (!cfi.IsValidSubmitSection()) return false;
            ShowMessage('warning', 'Information!', "Hold shipment cannot be blank", "bottom-right");
            return false;
        }

        $('#tblHoldShpt tbody tr ').each(function () {
            var MyRows = $('table#tblHoldShpt').find('tbody').find('tr');
            for (var i = 0; i < MyRows.length; i++) {

                var MyIndexValue = $(MyRows[i]).find('td:eq(1)').find("input:text[id^='tblHoldShpt_Hold_']").val();

                var MyIndexValueForUnhold = $(MyRows[i]).find('input:checkbox[id^="tblHoldShpt_UnHold_"]').is(":checked") ? 1 : 0;

                for (var j = i + 1; j < MyRows.length; j++) {
                    var MyIndexValueNext = $(MyRows[j]).find('td:eq(1)').find("input:text[id^='tblHoldShpt_Hold_']").val();
                    if (MyIndexValue == MyIndexValueNext && MyIndexValueForUnhold == 0) {

                        ShowMessage('warning', 'Information!', "Duplicate Hold Type not allowed!", "bottom-right");
                        flage = false;
                        return false;

                    }

                }



            }



        });

        if (!flage) {
            flage = true;
            return false;
        }

        $('#tblHoldShpt tbody tr ').each(function () {

            var AWBCheckHoldPices = $('#HoldPieces').val();

            var ChechTotalHoldPieces = 0;
            var MyRowspieces = $('table#tblHoldShpt').find('tbody').find('tr');

            for (var k = 0; k < MyRowspieces.length; k++) {
                var HoldPieces = $(MyRowspieces[k]).find('td:eq(2)').find('input:text[id^="_temptblHoldShpt_HoldPiece_"]').val();
                var Unholdchk = $(MyRowspieces[k]).find('input:checkbox[id^="tblHoldShpt_UnHold_"]').is(":checked") ? 1 : 0;
                if (Unholdchk == 0) {

                    ChechTotalHoldPieces = parseInt(ChechTotalHoldPieces) + parseInt(HoldPieces);

                }

                if (ChechTotalHoldPieces > AWBCheckHoldPices) {
                    ShowMessage('warning', 'Information!', "Hold pieces cannot be greater than AWB Hold pieces!", "bottom-right");
                    chekpiec = false;
                    return false;
                }




            }

        });

        if (!chekpiec) {
            chekpiec = true;
            return false;
        }

        if (!cfi.IsValidSubmitSection()) return false;
        dirtyForm.isDirty = false;//to track the changes
        _callBack();

        var res = $("#tblHoldShpt tr[id^='tblHoldShpt']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        getUpdatedRowIndex(res, 'tblHoldShpt');
        $("#tblHoldShpt tr td input[type='checkbox'][id^='tblHoldShpt_UnHold_']").each(function () {
            var rowNo = $(this).attr('id').split('_')[2]
            if ($(this).attr('checked') == 'checked') {
                $("#tblHoldShpt_UnHoldRemark_" + rowNo).attr('required', 'required')
            }
            else {
                $("#tblHoldShpt_UnHoldRemark_" + rowNo).removeAttr('required')
            }
        })
        if (!validateTableData('tblHoldShpt', res)) {
            return false;
        }

        var AWBHoldPices = $('#HoldPieces').val();
        var ctrl;
        $('#tblHoldShpt tbody tr ').each(function () {
            hp = $(this).find('td').find('input:text[id^="_temptblHoldShpt_HoldPiece_"]').val()
            ctrl = $(this).find('td').find('input:text[id^="_temptblHoldShpt_HoldPiece_"]').attr('id')
            var check = $(this).find('td').find('input:checkbox[id^="tblHoldShpt_UnHold_"]').is(":checked") ? 1 : 0

            if (parseInt(hp) > parseInt(AWBHoldPices)) {
                if (check == 0) {
                    CheckValidation(ctrl);
                    flag = false;
                    return false;
                }
            }
            else {
                flag = true;
            }
        });

        if (flag == true) {
            var HoldShptInfo = new Array();
            var HoldShptGrid = new Array();
            HoldShptInfo.push({
                MomvementType: $('#MomvementType:checked').val(),
                AWBSNo: $('#AWBNo').val(),
                CitySNo: $('#CityCode').val(),
                CityCode: $('#Text_CityCode').val(),
                HoldPieces: $('#HoldPieces').val(),
                HoldGrossWeight: $('#HoldGrossWeight').val() == "" ? "0.00" : $('#HoldGrossWeight').val(),
                DeliveryOrderNo: $('#DeliveryOrderNo').val() == "" ? "0" : $('#DeliveryOrderNo').val(),
                FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
                FlightDate: (getQueryStringValue("FormAction").toUpperCase() == "EDIT") ? $("#FlightDate").closest("td").find("span#FlightDate").text().substring(15, $("#FlightDate").closest("td").find("span#FlightDate").text().length) : $("#FlightDate").closest("td").find("span#FlightDate").text()
            });

            var TotalHoldPices = 0;
            $('#tblHoldShpt tbody tr').each(function () {
                var chk = $(this).find('td').find('input:checkbox[id^="tblHoldShpt_UnHold_"]').is(":checked") ? 1 : 0
                if (chk == 0) {
                    TotalHoldPices = parseInt(TotalHoldPices) + parseInt($(this).find('td').find('input:text[id^="_temptblHoldShpt_HoldPiece_"]').val())
                }

                HoldShptGrid.push({
                    SNo: $(this).find('td').find('input:hidden[id^="tblHoldShpt_SNo_"]').val() == "" ? 0 : $(this).find('td').find('input:hidden[id^="tblHoldShpt_SNo_"]').val(),
                    AWBSNo: $('#AWBNo').val(),
                    HdnHold: $(this).find('td').find('input:hidden[id^="tblHoldShpt_HdnHold_"]').val(),
                    Hold: $(this).find('td').find('input:text[id^="tblHoldShpt_Hold_"]').val(),
                    HoldPices: $(this).find('td').find('input:text[id^="_temptblHoldShpt_HoldPiece_"]').val(),
                    HoldRemarks: $(this).find('td').find('input:text[id^="tblHoldShpt_HoldRemark_"]').val(),
                    UnHold: $(this).find('td').find('input:checkbox[id^="tblHoldShpt_UnHold_"]').is(":checked") ? 1 : 0,
                    UnholdRemarks: $(this).find('td').find('input:text[id^="tblHoldShpt_UnHoldRemark_"]').val()
                });
            });

            if (TotalHoldPices > 0) {
                if (TotalHoldPices < $('#HoldPieces').val()) {
                    ShowMessage('warning', 'Information!', "Hold pieces cannot be less than AWB Hold pieces", "bottom-right");
                    $(this).find('td').find('input:text[id^="_temptblHoldShpt_HoldPiece_"]').focus()
                    return false;
                }
            }

            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $.ajax({
                    url: "./Services/Permissions/HoldShptService.svc/SaveHoldShpt", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ HoldShptInfo: HoldShptInfo, HoldShptGrid: HoldShptGrid,grosswt: grosswt, volwt: volwt, AppRemarks: AppRemarks, FohCheck: FohCheck}),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var resData = jQuery.parseJSON(result);
                        if (resData.Table0[0].movetype == "0") {
                            ShowMessage('warning', 'Information!', resData.Table0[0].Result, "bottom-right");
                            return;
                        }
                        else if (resData.Table0[0].movetype == "1") {
                            ShowMessage('warning', 'Information!', resData.Table0[0].Result, "bottom-right");
                            return;
                        }
                        else {
                            ShowMessage('success', 'Success', resData.Table0[0].Result, "bottom-right");
                            setTimeout(function () {
                                navigateUrl('Default.cshtml?Module=Permissions&Apps=HoldShpt&FormAction=INDEXVIEW');
                            }, 1000);
                        }
                    }
                });
            }
                                 
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                var rownumberUnhold = "";
                $("#tblHoldShpt tr td input[type='checkbox'][id^='tblHoldShpt_UnHold_']").each(function () {

                    var rowNo = $(this).attr('id').split('_')[2]
                    if ($(this).attr('checked') == 'checked' && $('#tblHoldShpt_Hold_' + rowNo).prop('disabled') == false) {
                        rownumberUnhold = rowNo
                    }

                })
                if ($("#tblHoldShpt_Hold_" + rownumberUnhold).val().toUpperCase().trim() == "LATE ACCEPTANCE".toUpperCase().trim()) {

                    if ($("#withpenalitycharges").prop('checked') == false && $("#withoutpenalitycharges").prop('checked') == false) {
                        ShowMessage('warning', 'Information!', "Kindly select at least one option regarding Late Acceptance", "bottom-right");
                        return false;

                    }

                    if ($('input:checkbox[id*="tblHoldShpt_UnHold_"]:checked').val() == undefined) {
                        $("#withpenalitycharges").attr('checked', false)
                        $("#withoutpenalitycharges").attr('checked', false)
                        ShowMessage('warning', 'Information!', "Kindly select Unhold check option", "bottom-right");
                        return false;

                    }

                    var Ispenalitycharge = $("#withpenalitycharges").prop('checked') == true ? 1 : 0

                    $.ajax({
                        url: "./Services/Permissions/HoldShptService.svc/UpdateHoldShptLateAcceptance", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({

                            HoldShptInfo: HoldShptInfo, HoldShptGrid: HoldShptGrid, grosswt: grosswt
                            , volwt: volwt, AppRemarks: AppRemarks, UPenalityAmount: penalityAmount == '' ? 0 : penalityAmount, Ispenalitycharge: Ispenalitycharge
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            if (result != undefined) {
                                ShowMessage('success', 'Success', result, "bottom-right");
                                setTimeout(function () {
                                    navigateUrl('Default.cshtml?Module=Permissions&Apps=HoldShpt&FormAction=INDEXVIEW');
                                }, 1000);

                            }
                        }
                    });
                }
                else {
                    $.ajax({
                        url: "./Services/Permissions/HoldShptService.svc/UpdateHoldShpt", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({
                            HoldShptInfo: HoldShptInfo, HoldShptGrid: HoldShptGrid, grosswt: grosswt, volwt: volwt, AppRemarks: AppRemarks, FohCheck: FohCheck
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var resData = jQuery.parseJSON(result);
                            if (resData.Table0[0].movetype == "0") {
                                ShowMessage('warning', 'Information!', resData.Table0[0].Result, "bottom-right");
                                return;
                            }
                            else if (resData.Table0[0].movetype == "1") {
                                ShowMessage('warning', 'Information!', resData.Table0[0].Result, "bottom-right");
                                return;
                            }
                            else {
                                ShowMessage('success', 'Success', resData.Table0[0].Result, "bottom-right");
                                setTimeout(function () {
                                    navigateUrl('Default.cshtml?Module=Permissions&Apps=HoldShpt&FormAction=INDEXVIEW');
                                }, 1000);
                            }
                        }
                    });
                }
            }
        }
        else {
            return false;
        }
    });

    $('#HoldGrossWeight').blur(function () {
        if ($('#HoldGrossWeight').val() == 0 || $('#HoldGrossWeight').val() == 0.00)
            $('#HoldGrossWeight').val('')
        else
            CheckpicesAndWeight();
    })

    $('#HoldPieces').blur(function () {
        if ($('#HoldPieces').val() == 0)
            $('#HoldPieces').val('')
        else
            CheckpicesAndWeight();
        if ($('#MomvementType:checked').val() == 1) {
            //if ($('#DeliveryOrderNo').val() == "" || $('#DeliveryOrderNo').val() == "0") {
            //    ShowMessage('warning', 'Information!', "Please Select DeliveryOrder No", "bottom-right");
            //    $('#HoldPieces').val('');
            //}
        }
    });

    $('#Text_AWBNo').blur(function () {
        $('#tbl tbody tr:eq(5) td:eq(1)').find('span').remove();
        $('#tbl tbody tr:eq(6) td:eq(1)').find('span').remove();
    });

    function CheckpicesAndWeight() {
        var Sno = $('#Text_AWBNo').val();
        if (Sno == "") {
            ShowMessage('warning', 'Information!', "Please Select AWBNo", "bottom-right");
            $('#Text_AWBNo').focus()
            $('#HoldPieces').val('');
            $('#HoldGrossWeight').val('');
        }
        else {
            var totalpieces = $('#HoldPieces').val();
            var totalGrossWeight = $('#HoldGrossWeight').val();
            var pices = parseInt($('#spnTotalpcs').text());
            totalpieces = parseInt(totalpieces)
            totalGrossWeight = parseFloat(totalGrossWeight)

            if (totalpieces > pices) {
                ShowMessage('warning', 'Information!', "HOLD Pieces cannot be more than AWB Pieces (" + pices + ")", "bottom-right");
                $('#HoldPieces').val('');
            }

            $.ajax({
                url: "./Services/Permissions/HoldShptService.svc/GetHoldPieces?Sno=" + Sno, async: false, type: "GET", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ResultData = jQuery.parseJSON(result);
                    var FinalData = ResultData.Table0;
                    if (FinalData.length > 0) {
                        var pices = parseInt(FinalData[0].TotalPieces)
                        var weight = parseFloat(FinalData[0].TotalGrossWeight)
                        if (totalpieces > pices) {
                            ShowMessage('warning', 'Information!', "HOLD Pieces cannot be more than AWB Pieces (" + FinalData[0].TotalPieces + ")", "bottom-right");
                            $('#HoldPieces').val('');
                        }

                        else if (totalGrossWeight > weight) {
                            ShowMessage('warning', 'Information!', "Gross Weight cannot be more than AWB Gross Weight (" + FinalData[0].TotalGrossWeight + ")", "bottom-right");
                            $('#HoldGrossWeight').val('');
                        }
                    }
                }
            });
        }
    }

    $('input:radio[id^="MomvementType"]').change(function () {
        $('#AWBNo').val('');
        if (!$('#Text_AWBNo').val() == '') {
            getHoldShptDetail();
            SpceialRights()
        }

        $('#Text_AWBNo').val('');
        $('#HoldPieces').val('');
        $('#HoldGrossWeight').val('');
        $('#Text_DeliveryOrderNo').val('');
        $("#FlightNo").val('');
        $("#Text_FlightNo").val('');
        $("#FlightDate").closest("td").find("span#FlightDate").text('');
        $("#DeliveryOrderNo").val('');
        $("#Text_DeliveryOrderNo").val();

        if ($('#MomvementType:checked').val() == 1) {
            var autocomplete = $("#Text_DeliveryOrderNo").data("kendoAutoComplete");
            autocomplete.enable(true);
            $("#Text_FlightNo").data("kendoAutoComplete").enable(true);
            $('#Text_FlightNo').attr('data-valid', 'required');
            $('#Text_FlightNo').attr('data-valid-msg', 'Flight Number can not be blank');
        }
        else {
            var autocomplete = $("#Text_DeliveryOrderNo").data("kendoAutoComplete");
            autocomplete.enable(false);
            $("#Text_FlightNo").data("kendoAutoComplete").enable(false);
            $('#Text_FlightNo').removeAttr('data-valid');
            $('#Text_FlightNo').removeAttr('data-valid-msg');
        }
        $('#spnTotalpcs').text('');
        $('#tbl tbody tr:eq(6) td:eq(1)').find('span').remove();
    });
});

function getHoldShptDeta() {
    $('#HoldPieces').val('');
    $('#HoldGrossWeight').val('');
    getHoldShptDetail();
    SpceialRights()
    if ($('#MomvementType:checked').val() == 1)
        GetDeliveryPcs();
    else
        GetTotalPices();
    MakeNOnEditable();
    $("#DeliveryOrderNo").val('');
    $("#Text_DeliveryOrderNo").val('');
    $("#FlightNo").val('');
    $("#Text_FlightNo").val('');
    $("#FlightDate").closest("td").find("span#FlightDate").text('');
}


function MakeNOnEditable() {
    $('#tblHoldShpt tbody tr ').each(function () {
        if ($(this).find('td').find('input:checkbox[id^="tblHoldShpt_UnHold_"]').is(":checked")) {
            $(this).find('input').prop('readonly', true)
            $(this).find('td').find('input:text[id^="tblHoldShpt_Hold_"]').data("kendoAutoComplete").enable(false);
        }

        if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
            var check = $(this).find('td').find('label[id^="tblHoldShpt_UnHold_"]').text();
            if (check == 'false')
                $(this).find('td').find('label[id^="tblHoldShpt_UnHold_"]').text('NO');
            else
                $(this).find('td').find('label[id^="tblHoldShpt_UnHold_"]').text('YES');
        }
    })
}

function GetTotalPices() {
    //$('#tbl tbody tr:eq(4) td:last').find('span').remove()
    $('#tbl tbody tr:eq(5) td:eq(1)').find('span').remove();
    $('#tbl tbody tr:eq(6) td:eq(1)').find('span').remove();
    $('#HoldPieces').after('&nbsp<span style="font-weight:bold">/</span>&nbsp<span id="spnTotalpcs" style="font-weight:bold"></span>')
    var Sno = $('#Text_AWBNo').val();
    if (Sno != "") {
        $.ajax({
            url: "./Services/Permissions/HoldShptService.svc/GetHoldPieces?Sno=" + Sno, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                var data = ResultData.Table0
                var holddata = ResultData.Table1
                $('#spnTotalpcs').text(data[0].TotalPieces);
                $('#HoldPieces').val(holddata[0].HoldPieces)
                $('#HoldPieces').text(holddata[0].HoldPieces)
            }
        });
    }
}

function getHoldShptDetail() {
    if (getQueryStringValue("FormAction").toUpperCase() != "READ") {
        var hdnawb = $('#AWBNo').val()
        $('#HdnAWBNo').val(hdnawb)
    }


    var dbtableName = 'tblHoldShpt';
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType != 'READ',
        tableColume: 'SNo,AWBSNo,Hold,HoldPiece,HoldRemark,UnHold,UnHoldRemark',
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Permissions/HoldShptService.svc',
        getRecordServiceMethod: "GetHoldAwbDetails",
        deleteServiceMethod: 'DeleteHoldShpt',
        isGetRecord: true,
        masterTableSNo: $('#HdnAWBNo').val(),
        caption: "Hold AWB Details",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden' },
        { name: 'AWBSNo', type: 'hidden', value: $('#AWBNo').val() },
        { name: 'HoldByXray', type: 'hidden' },
        { name: 'IsUnhold', type: 'hidden' },
        {
            name: 'Hold', display: 'Hold Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) { }, isRequired: true, AutoCompleteName: "HoldShipment_Hold_Type", filterField: "Hold_Type", filterCriteria: "contains"
        },
        {
            name: 'HoldPiece', display: 'Hold Piece', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CheckValidation(this.id);" }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'HoldRemark', display: 'Hold Remark', type: 'text', value: '', ctrlCss: { width: '200px', height: '80px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 200, onblur: "", }, isRequired: true, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'UnHold', display: 'Unhold', type: 'checkbox', ctrlAttr: { checked: false, }, isRequired: false, onChange: function (evt, rowIndex) { checkXray(evt, rowIndex); }
        },
        {
            name: 'UnHoldRemark', display: 'Unhold Remark', type: 'text', value: '', ctrlCss: { width: '200px', height: '80px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 200, onblur: "", readonly: true }, isRequired: false, onChange: function (evt, rowIndex) { }
        },
        {
            name: 'IsAutoUnHold', display: 'Unhold Type', type: 'label', ctrlCss: { width: '150px', height: '40px' }
        },
        {
            name: 'UnHoldOn', display: 'Unhold On', type: 'label', ctrlCss: { width: '150px', height: '40px' }
        },
        {
            name: 'UnHoldBy', display: 'Unhold By', type: 'label', ctrlCss: { width: '150px', height: '40px' }
        },
        { name: 'IsApprovedUnhold', type: 'hidden', value: 0 },

        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true, remove: true },
    });
    cfi.AutoCompleteV2("Hold", "Hold_Type", "HoldShipment_Hold_Type", null, "contains");
}

function checkXray(evt, rowIndex) {
    rowIndex = parseInt(rowIndex) + 1;
    var a = $('#tblHoldShpt_UnHold_' + rowIndex).is(":checked") ? 1 : 0

    var isapprovedunhold = $('#tblHoldShpt_IsApprovedUnhold_' + rowIndex).val();

    if ($('#tblHoldShpt_IsUnhold_' + rowIndex).val() == "true") {
        $('#tblHoldShpt_UnHold_' + rowIndex).prop('checked', true)
        return false;
    }
    else if ($('#tblHoldShpt_HoldByXray_' + rowIndex).val() == "True") {
        ShowMessage('warning', 'Information!', "Shipment cannot be unhold because of Xray failure.", "bottom-right");
        $('#tblHoldShpt_UnHold_' + rowIndex).prop('checked', false)
        return false;
    }
    else if (a == 1) {
        $('#tblHoldShpt_UnHoldRemark_' + rowIndex).attr('readonly', false);
        $('#tblHoldShpt_UnHoldRemark_' + rowIndex).attr('required', "required");
    }
    else {
        $('#tblHoldShpt_UnHoldRemark_' + rowIndex).attr('readonly', true);
        $('#tblHoldShpt_UnHoldRemark_' + rowIndex).val('');
        $('#tblHoldShpt_UnHoldRemark_' + rowIndex).removeAttr('required');
    }

    if (a == "1") {
        if ($("#tblHoldShpt_Hold_" + rowIndex).val().toUpperCase().trim() == "FWB FOH WEIGHT VARIANCE".toUpperCase().trim()) {
            var lengthholdshpt = $('input[type="text"][id*=tblHoldShpt_Hold_]').length;
            for (var i = 1; i <= lengthholdshpt; i++) {
                if ($('#tblHoldShpt_Hold_' + i).val().toUpperCase().trim() == "LATE ACCEPTANCE".toUpperCase().trim() && $('#tblHoldShpt_UnHold_' + i).is(":checked") == 0) {
                    ShowMessage('warning', "FWB FOH Weight Variance can not be unhold due to Late Acceptance hold", " ", "bottom-right");
                    $('#tblHoldShpt_UnHold_' + rowIndex).prop('checked', false)
                    $('#tblHoldShpt_UnHold_' + i).prop('checked', false)
                    return false;

                }
                else if ($('#tblHoldShpt_Hold_' + i).val().toUpperCase().trim() == "LATE ACCEPTANCE".toUpperCase().trim() && $('#tblHoldShpt_UnHold_' + i).is(":checked") == 1 && $('#tblHoldShpt_IsAutoUnHold_' + i).text() == '') {
                    ShowMessage('warning', "FWB FOH Weight Variance can not be unhold due to Late Acceptance hold", " ", "bottom-right");
                    $('#tblHoldShpt_UnHold_' + i).prop('checked', false)
                    $('#tblHoldShpt_UnHold_' + rowIndex).prop('checked', false)
                    return false;
                }
            }
            HoldPopup();
            setTimeout(function () {
                GetHWBFOHWeight();
            }, 100)

        }
        if ($("#tblHoldShpt_Hold_" + rowIndex).val().toUpperCase().trim() == "LATE ACCEPTANCE".toUpperCase().trim()) {
            var lengthholdshpt = $('input[type="text"][id*=tblHoldShpt_Hold_]').length;
            for (var i = 1; i <= lengthholdshpt; i++) {
                if ($('#tblHoldShpt_Hold_' + i).val().toUpperCase().trim() == "FWB FOH WEIGHT VARIANCE".toUpperCase().trim() && $('#tblHoldShpt_UnHold_' + i).is(":checked") == 1) {
                    $('#tblHoldShpt_UnHold_' + i).prop('checked', false)
                    $('#tblHoldShpt_UnHold_' + rowIndex).prop('checked', false)
                    //  ShowMessage('warning', "FWB FOH Weight Variance can not be unhold due to Late Acceptance hold", " ", "bottom-right");

                    //return false;

                }
            }

            if ($('#tblHoldShpt_IsApprovedUnhold_' + rowIndex).val() == "1") {
                HoldPopupPaymentIssue();
            }
            else {
                ShowMessage('warning', "Request for Approval has not been received. Cannot Unhold AWB", " ", "bottom-right");
                $('#tblHoldShpt_UnHold_' + rowIndex).prop('checked', false)
                return false;
            }

            //setTimeout(function () {
            //    GetHWBFOHWeight();
            //}, 100)

        }
    }
    else if (a == "0") {
        if ($("#tblHoldShpt_Hold_" + rowIndex).val().toUpperCase().trim() == "LATE ACCEPTANCE".toUpperCase().trim()) {
            var lengthholdshpt = $('input[type="text"][id*=tblHoldShpt_Hold_]').length;
            for (var i = 1; i <= lengthholdshpt; i++) {
                if ($('#tblHoldShpt_Hold_' + i).val().toUpperCase().trim() == "FWB FOH WEIGHT VARIANCE".toUpperCase().trim() && $('#tblHoldShpt_UnHold_' + i).is(":checked") == 1) {
                    $('#tblHoldShpt_UnHold_' + i).prop('checked', false)
                    // ShowMessage('warning', "FWB FOH Weight Variance can not be unhold due to Late Acceptance hold", " ", "bottom-right");

                    return false;

                }
            }

            //if ($('#tblHoldShpt_IsApprovedUnhold_' + rowIndex).val() == "1") {
            //    HoldPopupPaymentIssue();
            //}
            //else {
            //    ShowMessage('warning', "Request for Approval has not been received. Cannot Unhold AWB", " ", "bottom-right");
            //    return false;
            //}

            //setTimeout(function () {
            //    GetHWBFOHWeight();
            //}, 100)

        }

    }

}

_ExtraCondition = function (textId) {
    if ($.isFunction(window.ExtraCondition)) {
        return ExtraCondition(textId);
    }
}

function CheckValidation(obj) {
    var rowNo = obj.split("_")[2];
    var check = $('#tblHoldShpt_UnHold_' + rowNo).is(':checked') ? 1 : 0
    if (check == 0) {
        var HoldPieces = $('#HoldPieces').val()
        var GridHoldPieces = $('#' + obj).val();
        GridHoldPieces = parseInt(GridHoldPieces)

        if (HoldPieces == '' || HoldPieces == 0) {
            ShowMessage('warning', "Please enter Hold Pieces ", " ", "bottom-right");
            $('#HoldPieces').focus();
        }
        else if (GridHoldPieces > HoldPieces) {
            ShowMessage('warning', "Hold Pieces cannot be more than Total AWB Hold Pieces (" + HoldPieces + ")", " ", "bottom-right");
        }
    }
}

function ExtraCondition(textId) {
    var filterFlight = cfi.getFilter("AND");
    if (textId.indexOf("AWBNo") >= 0) {
        var filterFlt = cfi.getFilter("AND");
        if (userContext.IsShowAllData == false) {
            cfi.setFilter(filterFlt, "AirportSNo", "eq", userContext.AirportSNo);
        }


        if ($("input[id=MomvementType]:checked").val() == '0') {
            cfi.setFilter(filterFlt, "AWBType", "eq", "0");
        }
        else if ($("input[id=MomvementType]:checked").val() == '1') {
            cfi.setFilter(filterFlt, "AWBType", "eq", "1");
        }
        else if ($("input[id=MomvementType]:checked").val() == '2') {
            cfi.setFilter(filterFlt, "AWBType", "eq", "2");
        }
        else { cfi.setFilter(filterFlt, "AWBType", "eq", "3"); }
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }

    if (textId.indexOf("DeliveryOrderNo") >= 0) {
        var filterFlt = cfi.getFilter("AND");
        cfi.setFilter(filterFlt, "AWBSNo", "eq", $('#AWBNo').val());
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }

    if (textId.indexOf("FlightNo") >= 0) {
        var filterFlt = cfi.getFilter("AND");
        cfi.setFilter(filterFlt, "AWBNo", "eq", $('#Text_AWBNo').val());
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
}

function GetDeliveryPcs() {
    //$('#tbl tbody tr:eq(4) td:last').find('span').remove()
    $('#tbl tbody tr:eq(5) td:eq(1)').find('span').remove();
    $('#tbl tbody tr:eq(6) td:eq(1)').find('span').remove();
    $('#HoldPieces').after('&nbsp<span style="font-weight:bold">/</span>&nbsp<span id="spnTotalpcs" style="font-weight:bold"></span>')
    var SNo = $('#DeliveryOrderNo').val();
    var AwbSno = $('#HdnAWBNo').val();
    if (SNo != "" && SNo != "0" || AwbSno != "" && AwbSno != "0") {
        $.ajax({
            url: "./Services/Permissions/HoldShptService.svc/GetDeliveryPcs?Sno=" + SNo + "&AwbSno=" + AwbSno, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#HoldGrossWeight').next("span").remove();
                var ResultData = jQuery.parseJSON(result);
                if (ResultData.Table0.length > 0) {
                    var data = ResultData.Table0
                    $('#spnTotalpcs').text(data[0].Pieces);
                    $('#HoldGrossWeight').after('<span id="spnGrossWeight" style="font-weight:bold"> /' + data[0].GrossWeight + '</span>');
                }
            }
        });
    }
}

function GetManifestReportData(FlightSNo, Type) {
    $('#tblHoldShpt').after('<div id="divDetail"></div>')
    $("#divDetail").html("");
    var FlightSNoArray = FlightSNo.split(',');
    $(FlightSNoArray).each(function (r, i) {
        if (r < (FlightSNoArray.length - 1)) {
            $.ajax({
                url: "Services/Permissions/HoldShptService.svc/GetManifestReport?DailyFlightSNo=" + i + "&Type=" + Type, async: false, type: "get", dataType: "html", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    $('#SecondTab').hide();
                    $('#OSCTab').hide();
                    $('#FlightStopOverDetailTab').hide();
                    if (result.split('?')[0] == '1') {
                        ShowMessage('warning', 'Warning -Shipment ', result.split('?')[1], "bottom-right");
                    }
                    else {
                        $("#divDetail").append(result);
                        if (r == FlightSNoArray.length - 2) {
                            $("#btnPrint").unbind("click").bind("click", function () {
                                $("#divDetailPrint #divDetail").printArea();
                            });
                        }
                        else {
                            $("#btnPrint").closest('tr').remove();
                            $("#divDetail").append('</br><div class="page-break"></div>');
                        }
                    }
                },
                error: {
                }
            });
        }
    });
}

function GetDeliveryFlightDate(id, text, hdnid, key) {
    AWBNo = $("#Text_AWBNo").val();
    FlightNo = key;
    if ($("#Text_AWBNo").val() != "") {
        $.ajax({
            url: "./Services/Permissions/HoldShptService.svc/GetDeliveryFlightDate?AWBNo=" + AWBNo + "&FlightNo=" + FlightNo, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                if (ResultData.Table0.length > 0) {
                    var data = ResultData.Table0
                    $("#FlightDate").closest("td").find("span#FlightDate").text(data[0].FlightDate);
                }
            }
        });
    }
}

//add by jk,10 may 2018
var HandlingChargeArray = [];
var penalityAmount = '';
function GetpenalityAmount() {
    var awbsno = $('#AWBNo').val();
    var HoldtypeSno = $('#tblHoldShpt_HdnHold_1').val();
    $.ajax({
        url: "./Services/Permissions/HoldShptService.svc/GetpenalityAmount?AWBNo=" + awbsno + "&HoldtypeSno=" + HoldtypeSno, async: false, type: "GET", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            //  if (ResultData.Table0.length > 0) {
            var data = ResultData.Table0

            penalityAmount = ResultData.Table0[0].Amount

            $("#msgpenality").attr("style", "display:block;");
            $('span[id="msgpenality"]').text("Penalty Amount " + penalityAmount)



            // }
        }
    });

}
// Add By Sushant Kumar nayak On 02-05-2018

var ValumeWeightCheck = "0";
function GetHWBFOHWeight() {
    AWBNo = $("#Text_AWBNo").val();
    var MovementType = $("#MomvementType").val()
    if ($("#Text_AWBNo").val() != "") {
        $.ajax({
            url: "./Services/Permissions/HoldShptService.svc/GetHWBFOHWeight?AWBNo=" + AWBNo + "&MovementType=" + MovementType, async: false, type: "GET", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                if (ResultData.Table0.length > 0) {
                    var data = ResultData.Table0

                    //  $('span[id="msg"]').text("User would need to update Dimensions against the shipment so as to match " + data[0].FOH_FWB + " Variance.")
                    // $('span[id="Percentage"]').text(data[0].FOH_FWB)
                    //$('span[id="valPercentage"]').text(data[0].FOH_FWB)
                    $('span[id="PercentageHike"]').text(data[0].FohPer)
                    $('span[id="ValPercentageHike"]').text(data[0].ValFohPer)
                    // $('span[id="Grwaight"]').text(data[0].ExecutedGrossWeight)
                    //  $('span[id="GrVol"]').text(data[0].ExecutedVolumeWeight)
                    $('span[id="FohGrwaight"]').text(data[0].FOHGrossWeight)
                    $('span[id="FohGrVol"]').text(data[0].FOHVolumeWeight)

                    if (data[0].ExecutedVolumeWeight == data[0].FOHVolumeWeight) {
                        ValumeWeightCheck = "1";
                    }


                }
            }
        });
    }
}

var volwt = 0.00, grosswt = 0.00, FohCheck = "0", AppRemarks = "";
function HoldPopupPaymentIssue() {
    $("#DivGetdivHoldShipmentPaymentissue").dialog({
        modal: true,
        draggable: true,
        resizable: true,
        position: ['center', 'top'],
        show: 'blind',
        hide: 'blind',
        width: 500,
        title: "",
        dialogClass: 'ui-dialog-osx',
        buttons: {

            "Ok": function () {

                $('.withpenalitycharges:checked').each(function () {
                    FohCheck = $(this).val()
                });
                if (FohCheck == "1") {

                    $(this).dialog("close");
                } else if (FohCheck == "2") {

                    $(this).dialog("close");
                } else if (FohCheck == "0") {
                    ShowMessage('warning', 'Information!', "Kindly select at least one option", "bottom-right");
                    return false;
                }


            },
            "Cancel": function () {
                $("#withpenalitycharges").attr("checked", false)
                $("#withpenalitycharges").attr("checked", false)
                $("#msgpenality").attr("style", "display:none;");
                $("tr[id^='tblHoldShpt']").each(function (row, tr) {

                    $(tr).find("input[id^='tblHoldShpt_UnHold_']").attr("checked", false)
                });

                $(this).dialog("close");
            }

        }
    });

}

function HoldPopup() {
    $("#DivGetdivHoldShipment").dialog({
        modal: true,
        draggable: true,
        resizable: true,
        position: ['center', 'top'],
        show: 'blind',
        hide: 'blind',
        width: 500,
        title: "",
        dialogClass: 'ui-dialog-osx',
        buttons: {
            "Cancel": function () {
                $("#FohCheck").attr("checked", false)
                $("#EmpFohChec").attr("checked", false)

                $("tr[id^='tblHoldShpt']").each(function (row, tr) {
                    var id = $(tr).attr('id').split('_')[2]
                    $(tr).find("input[id^='tblHoldShpt_UnHold_" + id + "']").attr("checked", false)
                    return false;
                });

                $(this).dialog("close");
            },
            "Ok": function () {


                $('.FohCheck:checked').each(function () {
                    FohCheck = $(this).val()
                });
                if (FohCheck == "1") {
                    grosswt = 0.00
                    volwt = 0.00
                    AppRemarks = "Approve Manual Entry"
                    $(this).dialog("close");
                } else if (FohCheck == "2") {
                    grosswt = $('span[id="FohGrwaight"]').text()
                    volwt = $('span[id="FohGrVol"]').text()
                    AppRemarks = "Approved FOH weight"
                    $(this).dialog("close");
                } else if (FohCheck == "0") {
                    ShowMessage('warning', 'Information!', "Kindly select at least one option", "bottom-right");
                    return false;
                }


            }
        }
    });

}

$("#divFooter").append("<div id='divHoldShipment'></div>")
$("#divHoldShipment").html("<center><div style='display:none;' id='DivGetdivHoldShipment'></div><div style='display:none;' id='DivGetdivHoldShipmentPaymentissue'></div><center>");

$(document).on('change', '#EmpFohChec', function () {

    var empfoh = $("#EmpFohChec").prop('checked');
    if (empfoh == true) {
        if (ValumeWeightCheck != "1") {
            $("#msg").removeAttr("style");
        }
    }
    if (empfoh == false) {
        $("#msg").attr("style", "display:none;");
    }
    $("#FohCheck").attr("checked", false)
});

$(document).on('change', '#FohCheck', function () {
    $("#EmpFohChec").attr("checked", false)
    $("#msg").attr("style", "display:none;");
});

$(document).on('change', '#withpenalitycharges', function () {

    var empfoh = $("#withpenalitycharges").prop('checked');
    if (empfoh == true) {
        //GetpenalityAmount();
    }
    if (empfoh == false) {
        $("#msgpenality").attr("style", "display:none;");
        HandlingChargeArray = [];
    }
    $("#withoutpenalitycharges").attr("checked", false)
});

$(document).on('change', '#withoutpenalitycharges', function () {
    $("#withpenalitycharges").attr("checked", false)
    $("#msgpenality").attr("style", "display:none;");
    penalityAmount = 0
});

////Add By Sushant ///////////
function SpceialRights() {
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.SpecialRights.AWBUNHOLD == true) {
        $("#tblHoldShpt").find("input[id^='tblHoldShpt_UnHold_']").attr("disabled", false);
        $("#tblHoldShpt").find("input[id^='tblHoldShpt_UnHoldRemark_']").attr("disabled", false);
    } else if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.SpecialRights.AWBUNHOLD == false) {
        $("#tblHoldShpt").find("input[id^='tblHoldShpt_UnHold_']").attr("disabled", true);
        $("#tblHoldShpt").find("input[id^='tblHoldShpt_UnHoldRemark_']").attr("disabled", true);
    } else {
        $("#tblHoldShpt").find("input[id^='tblHoldShpt_UnHold_']").attr("disabled", false);
        $("#tblHoldShpt").find("input[id^='tblHoldShpt_UnHoldRemark_']").attr("disabled", false);
    }

}

var table = '';
table += '<table class="zui-table">'
table += '<thead>'
table += '  <tr>'
table += '     <th style="text-align:center" colspan=4>'
table += '  Approve Weight'
table += ' </th>'
table += '   </tr>'
table += '      <tr>'
table += '        <th></th>'
table += '           <th></th>'
table += '          <th>FOH Gross Weight</th>'
table += '         <th>FOH Volume Weight</th>'

table += '      </tr>'
table += '   </thead>'
table += '   <tbody>'
table += '      <tr>'
table += '         <td ><span id="Percentage"></span></td>'
table += '         <td><span id="valPercentage"></span></td>'
table += '         <td><span id="PercentageHike"></span></td>'
table += '         <td><span id="ValPercentageHike"></span></td>'
table += '       </tr>'
table += '       <tr>'
table += '           <td><span id="Grwaight"></span></td>'
table += '           <td><span id="GrVol"></span></td>'
table += '           <td ><span id="FohGrwaight"></span></td>'
table += '          <td > <span id="FohGrVol"></span></td>'
table += '       </tr>'
table += ' <tr>'
//<span id="msg" style="display:none;"></span>
table += '            <td colspan=2 ><input type="checkbox" class="FohCheck" id="EmpFohChec" name="FohCheck" value="1">Approve Manual Entry </td>'
table += '             <td colspan=2><input type="checkbox" class="FohCheck"  id="FohCheck" name="FohCheck" value="2">Approve FOH Weight </td>'
table += '        </tr>'
table += '   </tbody>'
table += ' </table>'
$("#DivGetdivHoldShipment").append('')
$("#DivGetdivHoldShipment").append(table)

/*  holdpayment issue  added by jk**/
var table = '';
table += '<table class="zui-table">'
table += '<thead>'

table += '  <tr>'
table += '     <th style="text-align:center" colspan=4>'
table += '  Late Acceptance Payment'
table += ' </th>'
table += '   </thead>'
table += '   <tbody>'
table += ' <tr>'
table += '            <td colspan=2 ><input type="checkbox" class="withpenalitycharges" id="withpenalitycharges" name="withpenalitycharges" value="1">With Penalty Charge</td>'
table += '             <td colspan=2><input type="checkbox" class="withpenalitycharges"  id="withoutpenalitycharges" name="withpenalitycharges" value="2">Without Penalty Charge</td>'
table += '        </tr>'
table += ' <tr>'

//table += '             <td colspan=2><span id="msgpenality" style="display:block;"></span></td>'
table += '        </tr>'


table += '   </tbody>'
table += ' </table>'
$("#DivGetdivHoldShipmentPaymentissue").append('')
$("#DivGetdivHoldShipmentPaymentissue").append(table)

/* end holdpayment issue  added by jk**/

var Css = "";
Css += '.zui-table {'
Css += '      border: solid 1px #DDEEEE;'
Css += '    border-collapse: collapse;'
Css += '   border-spacing: 0;'
Css += '    font: normal 13px Arial, sans-serif;'
Css += '}'
Css += '    .zui-table thead th {'
Css += '        background-color: #daecf4;'
Css += '       border: solid 1px #DDEEEE;'
Css += '       color: #336B6B;'
Css += '       padding: 10px;'
Css += '       text-align: left;'
Css += '       text-shadow: 1px 1px 1px #fff;'
Css += '  }'
Css += '  .zui-table tbody td {'
Css += '        border: solid 1px #DDEEEE;'
Css += '       color: #333;'
Css += '        padding: 10px;'
Css += '        text-shadow: 1px 1px 1px #fff;'
Css += '    }'
$("#divHoldShipment").append('')
$("#divHoldShipment").append("<style>" + Css + "</style>")