var pageType = $('#hdnPageType').val();
var flage = true;
var chekpiec = true;


$(document).ready(function () {
    cfi.AutoComplete("AWBNo", "AWBNo", "vGetAwbNo", "SNo", "AWBNo", ["AWBNo"], getHoldShptDeta, "contains");
    cfi.AutoComplete("CityCode", "CityCode,CityName", "vGetCityCode", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("Hold_Type", "SNo,Hold_Type", "GetHoldType", "SNo", "Hold_Type", ["Hold_Type"], null, "contains");
    cfi.AutoComplete("DeliveryOrderNo", "SNo,DeliveryOrderNo", "GetDeliveryOrderNO", "SNo", "DeliveryOrderNo", ["DeliveryOrderNo"], GetDeliveryPcs, "contains");
    cfi.AutoComplete("FlightNo", "SNo,FlightNo", "GetDeliveryFlightNo", "SNo", "FlightNo", ["FlightNo"], GetDeliveryFlightDate, "contains");

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
                    if (MyIndexValue == MyIndexValueNext && MyIndexValueForUnhold==0) {

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
                if (Unholdchk == 0)
                {

                    ChechTotalHoldPieces =parseInt(ChechTotalHoldPieces)+ parseInt(HoldPieces);

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
                $.ajax({
                    url: "./Services/Permissions/HoldShptService.svc/SaveHoldShpt", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ HoldShptInfo: HoldShptInfo, HoldShptGrid: HoldShptGrid }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                    }
                });
            }

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                $.ajax({
                    url: "./Services/Permissions/HoldShptService.svc/UpdateHoldShpt", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ HoldShptInfo: HoldShptInfo, HoldShptGrid: HoldShptGrid }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                    }
                })
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
                $('#spnTotalpcs').text(data[0].TotalPieces);
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
                      name: 'Hold', display: 'Hold Type', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) { }, isRequired: true, tableName: 'GetHoldType', textColumn: 'Hold_type', keyColumn: 'SNo', filterCriteria: "contains"
                  },
                  {
                      name: 'HoldPiece', display: 'Hold Piece', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CheckValidation(this.id);" }, isRequired: true, onChange: function (evt, rowIndex) { }
                  },
                  {
                      name: 'HoldRemark', display: 'Hold Remark', type: 'text', value: '', ctrlCss: { width: '200px', height: '80px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 200, onblur: "", }, isRequired: true, onChange: function (evt, rowIndex) { }
                  },
                  {
                      name: 'UnHold', display: 'UnHold', type: 'checkbox', ctrlAttr: { checked: false, }, isRequired: false, onChange: function (evt, rowIndex) { checkXray(evt, rowIndex); }
                  },
                  {
                      name: 'UnHoldRemark', display: 'UnHold Remark', type: 'text', value: '', ctrlCss: { width: '200px', height: '80px' }, ctrlAttr: { controltype: 'alphanumericupper', maxlength: 200, onblur: "", readonly: true }, isRequired: false, onChange: function (evt, rowIndex) { }
                  },
                  {
                      name: 'IsAutoUnHold', display: 'UnHold Type', type: 'label', ctrlCss: { width: '150px', height: '40px' }
                  },
                  {
                      name: 'UnHoldOn', display: 'UnHold On', type: 'label', ctrlCss: { width: '150px', height: '40px' }
                  },
                  {
                      name: 'UnHoldBy', display: 'UnHold By', type: 'label', ctrlCss: { width: '150px', height: '40px' }
                  }

        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true, remove: true },
    });
}

function checkXray(evt, rowIndex) {
    rowIndex = parseInt(rowIndex) + 1;
    var a = $('#tblHoldShpt_UnHold_' + rowIndex).is(":checked") ? 1 : 0
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