/*
*****************************************************************************
Javascript Name:	SLAJS     
Purpose:		    This JS used to get autocomplete for SLA.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    25 Jan 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
var dbTableName = 'SLATrans';
$(function () {
    cfi.ValidateForm();


    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineCode", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("MessageType", "MessageType", "vwMessageTypeMaster", "SNo", "MessageType", "MessageType", null, "contains");

    cfi.AutoComplete("TerminalSNo", "TerminalName", "Terminal", "SNo", "TerminalName", null, null, "contains");
    cfi.AutoComplete("EventSNo", "ProcessName,SubProcessDisplayName", "V_Process_Subprocess", "SNo", "ProcessName", ["ProcessName", "SubProcessDisplayName"], null, "contains");
    cfi.AutoComplete("AircraftSNo", "AircraftType", "Aircraft", "SNo", "AircraftType", null, null, "contains", ",");
    cfi.AutoComplete("SHCSNo", "Code", "SPHC", "SNo", "Code", null, null, "contains", ",");
    cfi.AutoComplete("SLAAirlineSno", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineCode", ["CarrierCode", "AirlineName"], null, "contains", ",");
    var alphabettypes = [{ Key: "E", Text: "Export" }, { Key: "I", Text: "Import" }, { Key: "T", Text: "Transit" }, { Key: "B", Text: "Both (Export/Import)" }];
    cfi.AutoCompleteByDataSource("MovementType", alphabettypes);
    cfi.BindMultiValue("AircraftSNo", $("#Text_AircraftSNo").val(), $("#AircraftSNo").val());
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    cfi.BindMultiValue("SLAAirlineSno", $("#Text_SLAAirlineSno").val(), $("#SLAAirlineSno").val());


    cfi.AutoComplete("MessageTypeSNo", "MessageType", "vwMessageTypeMaster", "SNo", "MovementType", ["MessageType"], null, "contains");


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        $("#AirportSNo").val(userContext.AirportSNo);
        $("#Text_AirportSNo").val(userContext.AirportCode + '-' + userContext.AirportName);

    }

         if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('#MasterDuplicate').remove();
        $(this).find("input[type='hidden'][id^='SLAType']").each(function () {
            if ($(this).val().toUpperCase() == "SELF") {
                var closestTr = $(this).closest("tr");
                closestTr.find($("#spnAirlineSNo")).hide();
                closestTr.find($("#Text_AirlineSNo")).hide();
                closestTr.find("td:eq(3) span").hide()
                var closestH = $('input:text[id^=Text_AirlineSNo]').closest('tr');
                closestH.find('td font').hide();
                $("#AirlineSNo").val('');
                $("#Text_AirlineSNo").val('');
            }
            else {
                var closestTr = $(this).closest("tr");
                closestTr.find($("#spnAirlineSNo")).show();
                closestTr.find($("#Text_AirlineSNo")).show();
                closestTr.find("td:eq(3) span").show()
                var closestH = $('input:text[id^=Text_AirlineSNo]').closest('tr');
                closestH.find('td font').show();
                $("span#spnSLAAirlineSno").hide();
            }
        });
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($("input[name='SLAType']").val() == "SELF") {
            var closestTr = $(this).find("input[name='SLAType']").closest("tr");
            //var closestTr = $(this).closest("tr");
            closestTr.find($("#spnAirlineSNo")).hide();
            closestTr.find($("#Text_AirlineSNo")).hide();
            closestTr.find("td:eq(3) span").hide()
            var closestH = $('input:text[id^=Text_AirlineSNo]').closest('tr');
            closestH.find('td font').hide();
            $('#AirlineSNo').removeClass('valid_invalid');
            $('#AirlineSNo').removeAttr('data-valid');
            $('#AirlineSNo').removeAttr('data-valid-msg');
            $('#AirlineSNo').closest('td').find('.valid_errmsg').css('display', 'none');
            $('#Text_AirlineSNo').removeClass('valid_invalid');
            $('#Text_AirlineSNo').removeAttr('data-valid');
            $('#Text_AirlineSNo').removeAttr('data-valid-msg');
            $('#Text_AirlineSNo').closest('td').find('.valid_errmsg').css('display', 'none');
            $("#AirlineSNo").val('');
            $("#Text_AirlineSNo").val('');

            $('#tbl tr:eq(11) td:eq(3)').each(function () {
                $('#tbl tr:eq(11) td:eq(3)').find('font').show();
                $('#tbl tr:eq(11) td:eq(3)').find($("#divMultiSLAAirlineSno")).show();
                $("span#spnSLAAirlineSno").show();
                $('#Text_SLAAirlineSno').show();
                $('#SLAAirlineSno').show();
                $('#tbl tr:eq(11) td:eq(3)').find('span').show();
                //$('#SLAAirlineSno').attr('data-valid', 'required');
                //$('#SLAAirlineSno').attr('data-valid-msg', 'Airline can not be blank.');
                //$('#Text_SLAAirlineSno').attr('data-valid', 'required');
                //$('#Text_SLAAirlineSno').attr('data-valid-msg', 'Airline can not be blank.');
            });
        }
        else {
            var closestTr = $(this).closest("tr");
            closestTr.find($("#spnAirlineSNo")).show();
            closestTr.find($("#Text_AirlineSNo")).show();
            closestTr.find("td:eq(3) span").show()
            var closestH = $('input:text[id^=Text_AirlineSNo]').closest('tr');
            closestH.find('td font').show();
            $('#AirlineSNo').attr('data-valid', 'required');
            $('#AirlineSNo').attr('data-valid-msg', 'Airline can not be blank.');
            $('#Text_AirlineSNo').attr('data-valid', 'required');
            $('#Text_AirlineSNo').attr('data-valid-msg', 'Airline can not be blank.');


            $('#tbl tr:eq(11) td:eq(3)').each(function () {
                $('#tbl tr:eq(11) td:eq(3)').find('font').hide();
                $('#tbl tr:eq(11) td:eq(3)').find($("#divMultiSLAAirlineSno")).hide();
                $("span#spnSLAAirlineSno").hide();
                $('#Text_SLAAirlineSno').hide();
                $('#SLAAirlineSno').hide();
                $('#tbl tr:eq(11) td:eq(3)').find('span').hide();
                //$('#SLAAirlineSno').removeClass('valid_invalid');
                //$('#SLAAirlineSno').removeAttr('data-valid');
                //$('#SLAAirlineSno').removeAttr('data-valid-msg');
                //$('#SLAAirlineSno').find('.valid_errmsg').css('display', 'none');

                //$('#Text_SLAAirlineSno').removeClass('valid_invalid');
                //$('#Text_SLAAirlineSno').removeAttr('data-valid');
                //$('#Text_SLAAirlineSno').removeAttr('data-valid-msg');
                //$('#Text_SLAAirlineSno').find('.valid_errmsg').css('display', 'none');

                $("#SLAAirlineSno").val('');
                $("#Text_SLAAirlineSno").val('');
            });
        }
    }


    if ($("input[checked='true'][id^='SLAType']").val() == "0") {
        $('#tbl tr:eq(11) td:eq(3)').each(function () {
            $('#tbl tr:eq(11) td:eq(3)').find($("#divMultiSLAAirlineSno")).hide();
            $("span#spnSLAAirlineSno").hide();
            $('#Text_SLAAirlineSno').hide();
            $('#SLAAirlineSno').hide();
            $('#tbl tr:eq(11) td:eq(3)').find('span').hide();

            //$('#SLAAirlineSno').removeClass('valid_invalid');
            //$('#SLAAirlineSno').removeAttr('data-valid');
            //$('#SLAAirlineSno').removeAttr('data-valid-msg');
            //$('#SLAAirlineSno').find('.valid_errmsg').css('display', 'none');

            //$('#Text_SLAAirlineSno').removeClass('valid_invalid');
            //$('#Text_SLAAirlineSno').removeAttr('data-valid');
            //$('#Text_SLAAirlineSno').removeAttr('data-valid-msg');
            //$('#Text_SLAAirlineSno').find('.valid_errmsg').css('display', 'none');

            $("#SLAAirlineSno").val('');
            $("#Text_SLAAirlineSno").val('');
        });
    }



    $(this).find("input[type='radio'][id^='SLAType']").each(function () {
        $(this).click(function () {
            if ($(this).val() == "1") {
                var closestTr = $(this).closest("tr");
                closestTr.find($("#spnAirlineSNo")).hide();
                closestTr.find($("#Text_AirlineSNo")).hide();
                closestTr.find("td:eq(3) span").hide()
                var closestH = $('input:text[id^=Text_AirlineSNo]').closest('tr');
                closestH.find('td font').hide();
                $('#AirlineSNo').removeClass('valid_invalid');
                $('#AirlineSNo').removeAttr('data-valid');
                $('#AirlineSNo').removeAttr('data-valid-msg');
                $('#AirlineSNo').closest('td').find('.valid_errmsg').css('display', 'none');
                $('#Text_AirlineSNo').removeClass('valid_invalid');
                $('#Text_AirlineSNo').removeAttr('data-valid');
                $('#Text_AirlineSNo').removeAttr('data-valid-msg');
                $('#Text_AirlineSNo').closest('td').find('.valid_errmsg').css('display', 'none');
                $("#AirlineSNo").val('');
                $("#Text_AirlineSNo").val('');

                $('#tbl tr:eq(11) td:eq(3)').each(function () {
                    $('#tbl tr:eq(11) td:eq(3)').find('font').show();
                    $('#tbl tr:eq(11) td:eq(3)').find($("#divMultiSLAAirlineSno")).show();
                    $("span#spnSLAAirlineSno").show();
                    $('#Text_SLAAirlineSno').show();
                    $('#SLAAirlineSno').show();
                    $('#tbl tr:eq(11) td:eq(3)').find('span').show();
                    //$('#SLAAirlineSno').attr('data-valid', 'required');
                    //$('#SLAAirlineSno').attr('data-valid-msg', 'Airline can not be blank.');
                    //$('#Text_SLAAirlineSno').attr('data-valid', 'required');
                    //$('#Text_SLAAirlineSno').attr('data-valid-msg', 'Airline can not be blank.');
                });


            }
            else {
                var closestTr = $(this).closest("tr");
                closestTr.find($("#spnAirlineSNo")).show();
                closestTr.find($("#Text_AirlineSNo")).show();
                closestTr.find("td:eq(3) span").show()
                var closestH = $('input:text[id^=Text_AirlineSNo]').closest('tr');
                closestH.find('td font').show();
                $('#AirlineSNo').attr('data-valid', 'required');
                $('#AirlineSNo').attr('data-valid-msg', 'Airline can not be blank.');
                $('#Text_AirlineSNo').attr('data-valid', 'required');
                $('#Text_AirlineSNo').attr('data-valid-msg', 'Airline can not be blank.');


                $('#tbl tr:eq(11) td:eq(3)').each(function () {
                    $('#tbl tr:eq(11) td:eq(3)').find('font').hide();
                    $('#tbl tr:eq(11) td:eq(3)').find($("#divMultiSLAAirlineSno")).hide();
                    $("span#spnSLAAirlineSno").hide();
                    $('#Text_SLAAirlineSno').hide();
                    $('#SLAAirlineSno').hide();
                    $('#tbl tr:eq(11) td:eq(3)').find('span').hide();
                    //$('#SLAAirlineSno').removeClass('valid_invalid');
                    //$('#SLAAirlineSno').removeAttr('data-valid');
                    //$('#SLAAirlineSno').removeAttr('data-valid-msg');
                    //$('#SLAAirlineSno').find('.valid_errmsg').css('display', 'none');

                    //$('#Text_SLAAirlineSno').removeClass('valid_invalid');
                    //$('#Text_SLAAirlineSno').removeAttr('data-valid');
                    //$('#Text_SLAAirlineSno').removeAttr('data-valid-msg');
                    //$('#Text_SLAAirlineSno').find('.valid_errmsg').css('display', 'none');

                    $("#SLAAirlineSno").val('');
                    $("#Text_SLAAirlineSno").val('');
                });



            }
        });
    });
    SLATransGrid();
    DisableData();
    //$(document).keydown(function (event) {
    //    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
    //        event.preventDefault();
    //    }
    //});
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});
    //$(document).on('drop', function () {
    //    return false;
    //});


    //$(".btn-danger").click(function (e) {
    //    if (getQueryStringValue("FormAction").toUpperCase() == 'DELETE') {
    //        $.ajax({
    //            url: "./Services/Master/SLAService.svc/DeleteSLA",
    //            async: false, type: "POST", dataType: "json", cache: false,
    //            data: JSON.stringify({ consumableStockSno: $('#hdnCStockSno').val() }),
    //            contentType: "application/json; charset=utf-8",
    //            success: function (response) {
    //                navigateUrl('Default.cshtml?Module=Master&Apps=SLA&FormAction=INDEXVIEW');
    //            },
    //            error: function (er) {
    //                //debugger
    //            }
    //        });
    //    }
    //    cfi.ValidateForm();
    //});
    var lstItem = [];
    $(".btn-success").click(function (e) {
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW' || getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            if (!cfi.IsValidSubmitSection()) {
                return false;
            }
            //if (!cfi.IsValidForm()) {
            //    return false;
            //}

            //if ($.isArray(updatedRows)) {
            //    updatedRows.sort();
            //    updatedRows = jQuery.unique(updatedRows);
            //}
            //if (validateTableData(settings.tableID, updatedRows)) {
            //var strData = tableToJSON(settings.tableID, settings.columns, updatedRows);
            //}

            //var SLAType = $('input:radio[name=SLAType]:checked').val();
            //var AirportSNo = $('#AirportSNo').val();
            //var TerminalSNo = $('#TerminalSNo').val();
            //var AirlineSNo = $('#AirlineSNo').val();
            //var StandardName = $('#StandardName').val();
            //var MovementType = $('#MovementType').val();
            //var Basis = $('input:radio[name=Basis]:checked').val();
            //var EventSNo = $('#EventSNo').val();
            //var DisplayOrder = $('#DisplayOrder').val();
            //var MinimumCutOffMins = $('#MinimumCutOffMins').val();
            //var SHCSNo = $('#SHCSNo').val();
            //var UpdatedBy = $('#hdnUpdatedBy').val();
            //var SLAAirlineSno = $("#SLAAirlineSno").val();
            //var MessageType = $('#MessageTypeSNo').val();

            //var TargetPercentage = $("#TargetPercentage").val();

            var SLAType = $('input:radio[name=SLAType]:checked').val();
            var AirportSNo = $('#AirportSNo').val();
            var TerminalSNo = $('#TerminalSNo').val();
            var AirlineSNo = $('#AirlineSNo').val();
            var MessageType = $('#MessageTypeSNo').val();
            var StandardName = $('#StandardName').val();
            var MovementType = $('#MovementType').val();
            var Basis = $('input:radio[name=Basis]:checked').val();
            var EventSNo = $('#EventSNo').val();
            var DisplayOrder = $('#DisplayOrder').val();
            var MinimumCutOffMins = $('#MinimumCutOffMins').val();
            var AircraftSNo = $('#AircraftSNo').val();
            var SHCSNo = $('#SHCSNo').val();
            var UpdatedBy = $('#hdnUpdatedBy').val();
            var SLAAirlineSno = $("#SLAAirlineSno").val();
            var TargetPercentage = $("#TargetPercentage").val();



            var table = document.getElementById("tblSLATrans");
            if (table != null && table.rows.length > 3) {
                var rowCount = table.rows.length;
                for (var i = 3; i < table.rows.length; i++) {
                    var rowno = i - 2;
                    if ($('#tblSLATrans_SlabName_' + rowno).val() != undefined) {
                        var r = {
                            SNo: 0,
                            SLASNo: 0,
                            SlabName: $('#tblSLATrans_SlabName_' + rowno).val() == undefined ? '' : $('#tblSLATrans_SlabName_' + rowno).val(),
                            HdnAircraftBodyType: $('#hdntblSLATrans_HdnAircraftBodyType_' + rowno).val(),
                            AircraftBodyType: $('#tblSLATrans_AircraftBodyType_' + rowno).val() == undefined ? '' : $('#tblSLATrans_AircraftBodyType_' + rowno).val(),
                            Type: $('input:radio[name=tblSLATrans_RbtnType_' + rowno + ']:checked').val() == undefined ? 0 : $('input:radio[name=tblSLATrans_RbtnType_' + rowno + ']:checked').val(),
                            StartWeight: $('#tblSLATrans_StartWeight_' + rowno).val() == '' ? "0" : $('#tblSLATrans_StartWeight_' + rowno).val(),
                            EndWeight: $('#tblSLATrans_EndWeight_' + rowno).val() == '' ? "0" : $('#tblSLATrans_EndWeight_' + rowno).val(),
                            StartPercentage: $('#tblSLATrans_StartPercentage_' + rowno).val() == '' ? "0" : $('#tblSLATrans_StartPercentage_' + rowno).val(),
                            EndPercentage: $('#tblSLATrans_EndPercentage_' + rowno).val() == '' ? "0" : $('#tblSLATrans_EndPercentage_' + rowno).val(),
                            CutOffMins: $('#tblSLATrans_CutOffMins_' + rowno).val() == '' ? 0 : $('#tblSLATrans_CutOffMins_' + rowno).val(),
                            UpdatedBy: $('#hdnUpdatedBy').val()
                        }
                        lstItem.push(r);
                    }
                }
            }



            //$("#tblSLATrans tbody tr").each(function (i, k) {
            //    //if ($(k).find("td input[type=radio]").is(":checked")) {
            //    //    var r = {
            //    //        SNo:0,
            //    //        ConsumablePrefix: $(k).find('td')[1].innerText,
            //    //        ConsumableType: $(k).find('td')[2].innerText,
            //    //        ConsumableNo: $(k).find('td')[3].innerText,
            //    //        IsActive: "1"
            //    //    }
            //    //} else {
            //    var r = {
            //        SNo: 0,
            //        ConsumablePrefix: $(k).find('td')[1].innerText,
            //        ConsumableType: $(k).find('td')[2].innerText,
            //        ConsumableNo: $(k).find('td')[3].innerText,
            //        IsActive: "0"
            //    }
            //    //}

            //    lstItem.push(r);


            //});
        }
        var url = "";
        var itemlist = "";
        if (lstItem.length > 0) {
            itemlist = JSON.stringify(lstItem);
        } else {
            ShowMessage('error', 'Need your Kind Attention!', 'Add SLA Trans Data.');
            return false;
            //var r = {
            //    SNo: '',
            //    SLASNo: '',
            //    SlabName: '',
            //    Type: '',
            //    StartWeight: '',
            //    EndWeight: '',
            //    StartPercentage: '',
            //    EndPercentage: '',
            //    CutOffMins: '',
            //    UpdatedBy: '',
            //}
            //lstItem.push(r);
            //itemlist = JSON.stringify(lstItem);
        }


        //if ($('#ConsumableName').val().split('-')[1] == "1") {
        //    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
        //        var res = $("#tblItemDetail tr[id^='tblItemDetail']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        //        getUpdatedRowIndex(res, 'tblItemDetail');
        //    }
        //    var data = $('#tblItemDetail').appendGrid('getStringJson');
        //} else {
        //var data = itemlist;
        //}
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
            $.ajax({
                url: "./Services/Master/SLAService.svc/SaveSLAData",
                async: false, type: "GET", dataType: "json", cache: false,
                //data: JSON.stringify({ ItemList: JSON.parse(data), SLAType: SLAType, AirportSNo: AirportSNo, TerminalSNo: TerminalSNo, AirlineSNo: AirlineSNo, StandardName: StandardName, MovementType: MovementType, Basis: Basis, EventSNo: EventSNo, DisplayOrder: DisplayOrder, MinimumCutOffMins: MinimumCutOffMins, AircraftSNo: AircraftSNo, SHCSNo: SHCSNo, UpdatedBy: UpdatedBy }),
                data: { ItemList: itemlist, SLAType: SLAType, AirportSNo: AirportSNo, TerminalSNo: TerminalSNo, AirlineSNo: AirlineSNo, StandardName: StandardName, MovementType: MovementType, Basis: Basis, EventSNo: EventSNo, DisplayOrder: DisplayOrder, MinimumCutOffMins: MinimumCutOffMins, AircraftSNo: AircraftSNo, SHCSNo: SHCSNo, UpdatedBy: UpdatedBy, SLAAirlineSno: SLAAirlineSno, MessageType: MessageType, TargetPercentage: TargetPercentage },
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;

                    if (resData.length > 0) {
                        if (resData[0].Column1 == 0) {
                            navigateUrl('Default.cshtml?Module=Master&Apps=SLA&FormAction=INDEXVIEW');
                        }
                        if (resData[0].Column1 == 2001) {
                            alert("Name is already exists!!!");
                        }
                    }
                    else {
                        ShowMessage('error', 'Need your Kind Attention!', 'SLA Error.');
                    }
                },
                error: function (ex) {

                }
            });
        }
        else if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {
            $.ajax({
                url: "./Services/Master/SLAService.svc/UpdateSLAData",
                async: false, type: "GET", dataType: "json", cache: false,
                //data: JSON.stringify({ ItemList: JSON.parse(data), consumableStockSno: $('#hdnCStockSno').val(), NoOfItems: noofitem }),
                data: { ItemList: itemlist, SLASNo: $('#hdnSNo').val(), SLAType: SLAType, AirportSNo: AirportSNo, TerminalSNo: TerminalSNo, AirlineSNo: AirlineSNo, StandardName: StandardName, MovementType: MovementType, Basis: Basis, EventSNo: EventSNo, DisplayOrder: DisplayOrder, MinimumCutOffMins: MinimumCutOffMins, AircraftSNo: AircraftSNo, SHCSNo: SHCSNo, UpdatedBy: UpdatedBy, SLAAirlineSno: SLAAirlineSno, MessageType: MessageType, TargetPercentage: TargetPercentage },
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {
                        if (resData[0].Column1 == 0) {
                            // window.location = 'Default.cshtml?Module=Inventory&Apps=ConsumableStock&FormAction=INDEXVIEW';
                            navigateUrl('Default.cshtml?Module=Master&Apps=SLA&FormAction=INDEXVIEW');
                        }
                        if (resData[0].Column1 == 2001) {
                            alert("Name is already exists!!!");
                        }
                    }
                    else {
                        ShowMessage('error', 'Need your Kind Attention!', 'SLA Error.');

                    }
                },
                error: function (ex) {
                    alert(ex);
                }
            });

        }



    });
});
function SLATransGrid() {

    var pageType = $('#hdnPageType').val();
    $('#tbl' + dbTableName).appendGrid({
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,SLASNo,SlabName,AircraftBodyType,Type,StartWeight,EndWeight,StartPercentage,EndPercentage,CutOffMins,UpdatedBy',
        masterTableSNo: $('#hdnSNo').val(),
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: '',
        servicePath: './Services/Master/SLAService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'SLA',
        initRows: 1,
        isGetRecord: true,
        columns: [
                  { name: 'SNo', type: 'hidden', value: 0 },
                  { name: 'SLASNo', type: 'hidden', value: $('#hdnSNo').val() },
                 // { name: 'SlabName', display: 'Slab Name', type: 'text', ctrlAttr: { maxlength: 48, controltype: 'alphanumericupper', allowchar: '.' }, ctrlCss: { width: '150px' }, isRequired: true },
                  {
                      name: 'Options', display: 'Slab Name', type: 'div', isRequired: true, ctrlCss: { width: '50px' },
                      divElements:
                      [
                      {
                          divRowNo: 1, name: "SlabName", type: "text", ctrlAttr: { maxlength: 48, controltype: 'alphanumericupper', allowchar: '.', onBlur: "SlabName(this)" }, ctrlCss: { width: "150px" }, isRequired: true
                      },

                      {
                          divRowNo: 1, name: "AircraftBodyType", type: 'text', ctrlAttr: { maxlength: 48, controltype: 'autocomplete', onSelect: "return CheckAircraftType(this);" }, ctrlCss: { width: "150px" }, tableName: 'SLAAircraftType', textColumn: 'AircraftBodyType', keyColumn: 'AircraftBodyType', isRequired: false
                      },

                      ]
                  },

                  { name: pageType == 'View' ? 'TypeTxt' : 'Type', display: 'Type', type: 'radiolist', ctrlOptions: { 0: 'Weight ', 1: 'Percentage' }, selectedIndex: 0, onClick: function (evt, rowIndex) { EnableData(rowIndex + 1) } },
                  { name: 'StartWeight', display: 'Start Weight', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal2" }, ctrlCss: { width: '100px' } },
                  { name: 'EndWeight', display: 'End Weight', type: 'text', ctrlAttr: { maxlength: 8, controltype: "decimal2" }, ctrlCss: { width: '100px' } },
                  { name: 'StartPercentage', display: 'Start Percentage', type: 'text', ctrlAttr: { maxlength: 3, controltype: "number", disabled: "disabled" }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) { checkNumeric('tbl' + dbTableName + '_StartPercentage_' + eval(rowIndex + 1)); } },
                  { name: 'EndPercentage', display: 'End Percentage', type: 'text', ctrlAttr: { maxlength: 3, controltype: "number", disabled: "disabled" }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) { checkNumeric('tbl' + dbTableName + '_EndPercentage_' + eval(rowIndex + 1)); } },
                  { name: 'CutOffMins', display: 'Cut Off Mins', type: 'text', ctrlAttr: { maxlength: 4, controltype: "number" }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) { checkNumeric('tbl' + dbTableName + '_CutOffMins_' + eval(rowIndex + 1)); }, isRequired: true },
                  { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true },
    });

}
function EnableData(e) {
    var chkvalue = $('input:radio[name=tblSLATrans_RbtnType_' + e + ']:checked').val();
    if (chkvalue == 1) {
        $('#tblSLATrans_StartWeight_' + e + '').attr('disabled', 'disabled');
        $('#tblSLATrans_EndWeight_' + e + '').attr('disabled', 'disabled');
        $('#tblSLATrans_StartPercentage_' + e + '').removeAttr('disabled');
        $('#tblSLATrans_EndPercentage_' + e + '').removeAttr('disabled');

        $('#_temptblSLATrans_StartPercentage_' + e + '').removeAttr('disabled');
        $('#_temptblSLATrans_EndPercentage_' + e + '').removeAttr('disabled');

        $('#tblSLATrans_StartWeight_' + e + '').val('');
        $('#tblSLATrans_EndWeight_' + e + '').val('');
        $('#_temptblSLATrans_StartWeight_' + e + '').val('');
        $('#_temptblSLATrans_EndWeight_' + e + '').val('');
    }
    else {
        $('#tblSLATrans_StartPercentage_' + e + '').attr('disabled', 'disabled');
        $('#tblSLATrans_EndPercentage_' + e + '').attr('disabled', 'disabled');
        $('#tblSLATrans_StartWeight_' + e + '').removeAttr('disabled');
        $('#tblSLATrans_EndWeight_' + e + '').removeAttr('disabled');
        $('#tblSLATrans_StartPercentage_' + e + '').val('');
        $('#tblSLATrans_EndPercentage_' + e + '').val('');
        $('#_temptblSLATrans_StartPercentage_' + e + '').val('');
        $('#_temptblSLATrans_EndPercentage_' + e + '').val('');
    }
    //alert(test);
}
function DisableData() {
    var table = document.getElementById("tblSLATrans");
    if (table != null && table.rows.length > 3) {
        var rowCount = table.rows.length;
        for (var i = 3; i < table.rows.length; i++) {
            var e = i - 2;
            if ($('#tblSLATrans_SlabName_' + e).val() != undefined) {
                var chkvalue = $('input:radio[name=tblSLATrans_RbtnType_' + e + ']:checked').val();
                if (chkvalue == 1) {
                    $('#tblSLATrans_StartWeight_' + e + '').attr('disabled', 'disabled');
                    $('#tblSLATrans_EndWeight_' + e + '').attr('disabled', 'disabled');
                    $('#tblSLATrans_StartPercentage_' + e + '').removeAttr('disabled');
                    $('#tblSLATrans_EndPercentage_' + e + '').removeAttr('disabled');
                    $('#tblSLATrans_StartWeight_' + e + '').val('');
                    $('#tblSLATrans_EndWeight_' + e + '').val('');
                    $('#_temptblSLATrans_StartWeight_' + e + '').val('');
                    $('#_temptblSLATrans_EndWeight_' + e + '').val('');
                }
                else {
                    $('#tblSLATrans_StartPercentage_' + e + '').attr('disabled', 'disabled');
                    $('#tblSLATrans_EndPercentage_' + e + '').attr('disabled', 'disabled');
                    $('#tblSLATrans_StartWeight_' + e + '').removeAttr('disabled');
                    $('#tblSLATrans_EndWeight_' + e + '').removeAttr('disabled');
                    $('#tblSLATrans_StartPercentage_' + e + '').val('');
                    $('#tblSLATrans_EndPercentage_' + e + '').val('');
                    $('#_temptblSLATrans_StartPercentage_' + e + '').val('');
                    $('#_temptblSLATrans_EndPercentage_' + e + '').val('');
                }
            }
        }
    }

}
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
        $('#tblAccountCommision_Row_' + containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}

function ExtraCondition(textId) {
    var filterMovementType = cfi.getFilter("AND");
    if (textId.indexOf("Text_SLAAirlineSno") >= 0) {
        var filterSPHCC = cfi.getFilter("AND");
        cfi.setFilter(filterSPHCC, "SNo", "notin", $("#Text_SLAAirlineSno").data("kendoAutoComplete").key());
        filterSPHCCode = cfi.autoCompleteFilter(filterSPHCC);
        return filterSPHCCode;
    }
    else if (textId.indexOf("Text_SHCSNo") >= 0) {
        var filterSPHCC = cfi.getFilter("AND");
        cfi.setFilter(filterSPHCC, "SNo", "notin", $("#Text_SHCSNo").data("kendoAutoComplete").key());
        filterSPHCCode = cfi.autoCompleteFilter(filterSPHCC);
        return filterSPHCCode;
    }
    else if (textId.indexOf("Text_AircraftSNo") >= 0) {
        var filterSPHCC = cfi.getFilter("AND");
        cfi.setFilter(filterSPHCC, "SNo", "notin", $("#Text_AircraftSNo").data("kendoAutoComplete").key());
        filterSPHCCode = cfi.autoCompleteFilter(filterSPHCC);
        return filterSPHCCode;
    }

    if (textId == "Text_MessageTypeSNo") {

        cfi.setFilter(filterMovementType, "MovementType", "eq", $("#Text_MovementType").data("kendoAutoComplete").key() == "" ? -1 : $("#Text_MovementType").data("kendoAutoComplete").key())
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterMovementType]);
        return OriginCityAutoCompleteFilter2;
    }
}

function SlabName(obj) {
    if ($(obj).val() != "") {
        $(obj).closest("tr").find("input[id^='tblSLATrans_AircraftBodyType_']").val("");
        $(obj).closest("tr").find("input[id^='tblSLATrans_AircraftBodyType_']").removeAttr("required").css("cursor", "auto");
        $(obj).closest("tr").find("input[input[id^='tblSLATrans_SlabName_']").attr("required", "required").css("cursor", "auto");
    }
}


function CheckAircraftType(obj) {
    if ($(obj).val() != "") {
        $(obj).closest("tr").find("input[id^='tblSLATrans_SlabName_']").val("");
        $(obj).closest("tr").find("input[id^='tblSLATrans_SlabName_']").removeAttr("required").css("cursor", "auto");
        $(obj).closest("tr").find("input[id^='tblSLATrans_AircraftBodyType_']").attr("required", "required").css("cursor", "auto");

    }
        //$(obj).closest("tr").find("input[id^='tblAwbULDLocation_Location']").focus();
}