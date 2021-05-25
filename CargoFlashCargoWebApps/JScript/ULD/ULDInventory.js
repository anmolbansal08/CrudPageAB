/// <reference path="../../Scripts/references.js" />
var CurrentAirlineSNo;
var hdnCityCode = '';
$(document).ready(function () {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        var inventoryDate = new Date();
        if ($("#lblInventoryDate").length === 0)
            $("#Back").after("<label style='margin-left:10px;' id='lblInventoryDate'><b>Date :</b> " + kendo.toString(kendo.parseDate(inventoryDate), 'dd-MMM-yyyy') + "</label>");

        $("input[name='operation']").parent("td").hide();
        $("#SearchULDType").before("<span style='font-weight:bold;font-size:9px;color:#000000;font-family:Verdana;'>ULD Type: </span>");
        $("#SearchULDLocation").before("<span style='font-weight:bold;font-size:9px;color:#000000;font-family:Verdana;'>Location: </span>");
        $("#SearchULDNo").before("<span style='font-weight:bold;font-size:9px;color:#000000;font-family:Verdana;'>ULD No: </span>");
        $("#SearchLoadedStatus").before("<span style='font-weight:bold;font-size:9px;color:#000000;font-family:Verdana;'>Status: </span>");
        $("#SearchFound").before("<span style='font-weight:bold;font-size:9px;color:#000000;font-family:Verdana;'>F/NF: </span>");
        $("#SearchAirport").before("<span style='font-weight:bold;font-size:9px;color:#000000;font-family:Verdana;'>Airport: </span>");
        $("span#spnSearch").parent("td").css("width", "2%");

        cfi.AutoCompleteV2("SearchAirlineSNo", "CarrierCode,AirlineName", "ULDInventory_AirlineInv", OnSelectAirline, "contains");
        cfi.AutoCompleteV2("SearchULDType", "ULDType", "ULDInventory_ULDTypeInv", null, "contains");

        cfi.AutoCompleteV2("AirlineSNo", "AirlineCode,AirlineName", "ULDInventory_Airline", null, "contains");
        cfi.AutoCompleteV2("SearchULDLocation", "SNo,LocationName", "ULDInventory_LocationName", null, "contains");
        cfi.AutoCompleteV2("SearchULDNo", "ULDNo,ULDNo", "ULDInventory_SearchULDNo", null, "contains");
        cfi.AutoCompleteV2("SearchAirport", "AirportCode,AirportName", "Acceptance_Airport", OnSelectAirPort, "contains");










        var SearchLoadedSearchFound = [{ Key: "0", Text: "Found" }, { Key: "1", Text: "Not Found" }];
        cfi.AutoCompleteByDataSource("SearchFound", SearchLoadedSearchFound);


        var SearchLoadedStatus = [{ Key: "0", Text: "Empty" }, { Key: "1", Text: "Loaded" }];
        cfi.AutoCompleteByDataSource("SearchLoadedStatus", SearchLoadedStatus);


        $("#Text_SearchAirlineSNo-list").css("width", "150px");
        $("#Text_SearchULDType-list").css("width", "100px");
        $("#Text_SearchULDLocation-list").css("width", "100px");
        $("#Text_SearchULDType-list").css("width", "100px");
        $("#Text_SearchULDNo-list").css("width", "100px");
        $("#Text_SearchAirport-list").css("width", "100px");
        $("#Text_SearchFound-list").css("width", "100px");
        $("#Text_SearchLoadedStatus-list").css("width", "100px");


        var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
        $("#divOverview").append("<br/><span style='font-weight:bold;font-size: 9pt;color: #5A7570;font-family: Verdana;height:25px;text-align:left;vertical-align: middle;background-color:#F7F7F7;padding-left: 7px;'>Overview</span><input type='button' style='float:right;vertical-align:middle;margin-right:150px;' class='btn btn-block btn-info' value='Preview SCM' onclick='GetGeneratedSCM();' /><hr/><div style='margin-left:30px;margin-right:10px; margin-top:20px;'><div class='k-widget k-content' id='OnHand' style='margin: 10px 0px 0px; padding: 16px; border-radius: 25px; border: 2px solid rgb(8, 121, 192); border-image: none; width: 28%; height: 100%; float: left;background-color: #fff;'><h3 class='formSection'>On hand </h3><div style='height:60px'><table id='tblOnHand'></table></div></div><div class='k-widget k-content' id='InUse' style='margin: 10px 0px 0px; padding:16px; border-radius: 25px; border: 2px solid rgb(8, 121, 192); border-image: none; width: 28%; height: 100%; float: left;background-color: #fff;'><h3 class='formSection'>In use</h3><div style='height:60px'><table id='tblInUse'></table></div></div><div class='k-widget k-content' id='Damage' style='margin: 10px 0px 0px; padding: 16px; border-radius: 25px; border: 2px solid rgb(8, 121, 192); border-image: none; width: 28%; height: 100%; float: left;background-color: #fff;'><h3 class='formSection'>Damage</h3><div style='height:60px'><table id='tblDamage'></table></div></div></div>");
        $("#divOverview").css("display", "none");
        $("#tbl tbody tr:nth-child(4)").hide();

        hdnCityCode = $("#hdnCity").val();

    }
    else {
        // ShowMessage('info', 'Need your Kind Attention!', "Fetching ULD inventory data.");
        return;
    }

    $("#tblULDInventory_btnAppendRow").live("click", function () {

        // var firstRow = $("#tblULDInventory tbody tr:first").find("input:text").attr("id").split('_')[2];
        var lastRow = $("#tblULDInventory tbody tr:last").find("input:text").attr("id").split('_')[2];
        if (lastRow > 0) {
            //$("#tblULDInventory_ULDNo_" + lastRow).removeAttr("disabled"); -- edit by deepak sharma
            //  $("#tblULDInventory_ULDNo_" + lastRow).val("0");
            $("#tblULDInventory_RowSNo_" + lastRow).val(0);
            $("#tblULDInventory_ULDStockSNo_" + lastRow).val(0);
            $("#tblULDInventory_AirlineCode_" + lastRow).val($("#SearchAirlineSNo").val());
            $("#tblULDInventory_AirlineName_" + lastRow).val($("#Text_SearchAirlineSNo").val());
            $("#tblULDInventory_IsFound_" + lastRow).val(1);
            $("#tblULDInventory_IsStatus_" + lastRow).text("NO");
            $("#tblULDInventory_IsServiceable_" + lastRow).val(1);

            $("#tblULDInventory_ULDNo_" + lastRow).css("display", "block");
            $("#tblULDInventory_IsLoadedInSystem_" + lastRow).removeAttr("disabled").closest("td").css("border-right", "2px solid #0879c0");
            $("#tblULDInventory_Insert_" + lastRow).closest("tr td").find("button").removeAttr("class");
            $("#tblULDInventory_Insert_" + lastRow).closest("tr td").find("button>span:first").removeAttr("class").text("Save");
        }
    });
    $("#tblULDInventory_btnRemoveLast").live("click", function () {
        $("#tblULDInventory").find("input[id^='tblULDInventory_AirlineCode']").each(function () {
            if ($('#tblULDInventory tr').index() == 1)
                $("#tblULDInventory_btnRemoveLast").hide();
            else
                $("#tblULDInventory_btnRemoveLast").show();
        });
    });

    if (userContext.SpecialRights.SHOWALLSCM == false) {

        $("#Text_SearchAirport").val(userContext.AirportCode + "-" + userContext.AirportName);
        $("#SearchAirport").val(userContext.AirportSNo);

        $("#Text_SearchAirport").data("kendoAutoComplete").enable(false);

    } else {
        $("#Text_SearchAirport").data("kendoAutoComplete").enable(true);
        $("#Text_SearchAirport").val("");
        $("#SearchAirport").val("");
    }

    if ($("#Text_SearchAirport").val() != "") {
        var str = $("#Text_SearchAirport").val().toLowerCase();
        userContextAirportCode = str.substring(0, 3);
    } else {
        userContextAirportCode = userContext.AirportCode.trim();
    }
    CurrentAirlineSNo = userContext.AirlineSNo;
    $("#SearchAirlineSNo").val(userContext.AirlineName.split('-')[0]);
    $("#Text_SearchAirlineSNo").val(userContext.AirlineCarrierCode);
});
var userContextAirportCode = "";

function OnSelectAirPort() {

    if ($("#Text_SearchAirport").val() != "") {
        var str = $("#Text_SearchAirport").val();
        userContextAirportCode = str.substring(0, 3).toUpperCase();
    } else {
        userContextAirportCode = userContext.AirportCode.trim().toUpperCase();
    }

}
function OnSelectAirline() {
    $.ajax({
        url: "Services/ULD/ULDInventoryService.svc/GetAirlineSNo", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AirlineCode: ($("#SearchAirlineSNo").val() == "") ? 1 : $("#SearchAirlineSNo").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData.length > 0) {
                CurrentAirlineSNo = resData[0].AirlineSNo;
            }
        }
    });
}

function GoBack() {
    navigateUrl('Default.cshtml?Module=ULD&Apps=ULDInventory&FormAction=INDEXVIEW');
}


function ShowEditAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);

                var currentInvDate = $(this).find("td")[1].innerText;
                if (currentInvDate != "0") {
                    var TodayDate = new Date();
                    var InvDate = TodayDate.getUTCDate() + '-' + ('0' + (parseInt(TodayDate.getUTCMonth() + 1))).slice(-2) + '-' + TodayDate.getUTCFullYear();

                    var arr = currentInvDate.split("-");
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var month = ('0' + (months.indexOf(arr[1]) + 1)).slice(-2);
                    var final = arr[0] + '-' + month + '-' + arr[2];

                    if (final != InvDate) {
                        $(".tool-items").find(".actionSpan").each(function () {

                            if ($(this).text().toUpperCase() == "EDIT") {
                                $(this).closest("a").css("display", "none");
                            }
                        });

                    } else {

                        $(".tool-items").find(".actionSpan").each(function () {

                            if ($(this).text().toUpperCase() == "EDIT") {
                                $(this).closest("a").css("display", "block");

                            }
                        });
                    }
                }
            }
        });
    });
}
function createUpdateRecord(uRows, settings, isSingleRow, obj) {
    try {
        if (!isSingleRow) {
            $("tr[id^='" + settings.tableID + "']").each(function () {
                uRows.push($(this).attr("id").split('_')[2])
            });
        } else {
            uRows = [];
            uRows.push($(obj).attr("id").split('_')[2])
        }
        if ($.isArray(uRows)) {
            uRows.sort();
            uRows = uRows.filter(function (itm, i, a) {
                return i == a.indexOf(itm);
            });
        }

        if (validateTableData(settings.tableID, uRows)) {

            var strData = tableToJSON(settings.tableID, settings.columns, uRows);

            if (strData == '[]') {
                ShowMessage('success', '', 'Record Updated Successfully.');
                //url: settings.servicePath + "/" + settings.createUpdateServiceMethod + "?strData=" + strData,
            }
            else {

                $.ajax({
                    type: "POST",
                    url: settings.servicePath + "/SaveUpdateULDInventory",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: strData,
                    processData: true,
                    success: function (result) {
                        if (result != undefined) {
                            if (result[0].m_Item1 != undefined) {
                                if (result[0].m_Item2 == 0) {
                                    ShowMessage('warning', '', result[0].m_Item1);
                                    return;
                                }
                                else {
                                    AjaxSucceeded(result[0].m_Item1.replace('<value>', '').replace('</value>', ''));
                                }
                            }
                            else if (!isEmpty(result[0]) != '') {
                                AjaxSucceeded(result[0].replace('<value>', '').replace('</value>', ''));
                            }
                            settings.isDataLoad = false;
                            if (settings.currentPage == 1) {
                                getRecord(settings.tableID);
                            }
                            else {
                                showPage(settings.currentPage, settings);
                            }
                        }
                        else {
                            ShowMessage('error', '', "Server error.");
                        }
                    }
                });
            }
        }
        if (settings.isPageRefresh)
            location.reload();
    }
    catch (e) {
    }
}
function CheckULDStaton(ULDNo, ind) {
    $("#DivMessage").html("");
    var resData = "";
    var resData = "";
    $.ajax({
        url: "Services/ULD/ULDInventoryService.svc/CheckULDStaton", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ ULDNo: ULDNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            Data = jQuery.parseJSON(result);

            resData = Data.Table0;

            //Sart by rahul singh on 4 March 2018 as discussed  by Abhishek & CS Sir 


            if (resData.length > 0) {
                if (resData[0].IsAvailable == "False") {
                    $("#tblULDInventory_IsLoadedInSystem_1").attr("disabled", true);

                }


            }

            //end  by rahul singh on 4 March 2018 as discussed  by Abhishek & CS Sir 









            //  
        }
    });

    return resData
}
function InitiateOK(ind) {

    $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr('checked', 'true')
    $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr('value', 'true')
    $("#tblULDInventory_IsFound_" + ind).attr("disabled", false).css("cursor", "auto");
    $("#tblULDInventory_Insert_" + ind).attr("disabled", false).css("cursor", "auto");
    $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
    $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
    if ($("#tblULDInventory_IsFound_" + ind + " option:selected").val() == "0") {
        $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").css("cursor", "not-allowed");
        $("#tblULDInventory_PageULDLocationValue_" + ind).val("");
        $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(false);
        $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
        $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
        // $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
        // $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
        //$("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
        //$("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");

    }
    else {
        $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").attr("disabled", false).css("cursor", "auto");
        $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(true);
        // $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", false).css("cursor", "auto");
        $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", false).css("cursor", "auto");
        $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);

        //$("#tblULDInventory_IsServiceable_" + ind).data("kendoAutoComplete").enable(false);
    }
    $("#tblCheckUld").data("kendoWindow").close();

    $("#DivCheckUldMessage").remove()
    $("#tblCheckUld").remove()
}
function ClosePopUpMesg(ind) {


    $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr('checked', false)
    $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr('value', 'false')
    $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").css("cursor", "not-allowed");
    $("#tblULDInventory_IsFound_" + ind).attr("disabled", true).css("cursor", "not-allowed");
    $("#tblULDInventory_PageULDLocationValue_" + ind).val("");
    $("#tblULDInventory_HdnPageULDLocationValue_" + ind).val("");
    $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(false);
    //$("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
    ///$("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
    $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
    $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
    $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
    $("#tblULDInventory_Insert_" + ind).attr("disabled", true).css("cursor", "not-allowed");
    $("#tblCheckUld").data("kendoWindow").close();
    $("#DivCheckUldMessage").remove()
    $("#tblCheckUld").remove()

}


function tableToJSON(tableName, colName, uRows) {

    try {
        var noOfRows;
        if (!$.isArray(uRows)) {
            noOfRows = new Array();
            noOfRows[0] = uRows;
        }
        else
            noOfRows = uRows;
        var strJSON = '[';
        for (var row = 0; row < noOfRows.length; row++) {
            strJSON += '{';
            for (var col = 0; col < colName.length; col++) {
                if (colName[col].type == 'div') {
                    for (var d = 0; d < colName[col].divElements.length; d++) {
                        if (colName[col].divElements[d].type != 'label') {
                            strJSON += getJSONDataString(tableName, colName[col].divElements[d], colName[col].divElements[d].type, noOfRows[row]);
                            if (d < (colName[col].divElements.length - 1) && colName[col].type != 'label') {
                                //strJSON += ',';

                            }
                        }
                    }
                }
                else if (colName[col].type != 'label') {
                    strJSON += getJSONDataString(tableName, colName[col], colName[col].type, noOfRows[row]);
                }

                if (col < (colName.length - 2) && colName[col].type != 'label')
                    strJSON += ',';
            }

            strJSON += '}';
            if (row < noOfRows.length - 1)
                strJSON += ',';
        }
        // }
        strJSON += ']';

        return strJSON;
    }
    catch (e) { return '[]'; }
}
function CreateULDInventory() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('#tblULDInventory').appendGrid({
            tableID: 'tblULDInventory',
            contentEditable: true,
            isGetRecord: true,
            tableColume: 'RowSNo,ULDNo,ULDLocation,IsLoadedInSystem,IsPhysicallyAvailable,IsFound,PageULDLocationValue,ULDStatus,IsDamaged,IsServiceable',
            masterTableSNo: CurrentAirlineSNo,
            currentPage: 1, itemsPerPage: 5, whereCondition: phyUldSearchBy, sort: '',
            servicePath: './Services/ULD/ULDInventoryService.svc',
            getRecordServiceMethod: 'GetULDInventoryRecord',
            createUpdateServiceMethod: 'CreateUpdateULDInventory',
            deleteServiceMethod: 'DeleteULDInventory',
            caption: 'Physical ULD Inventory',
            initRows: 1,
            hideButtons: { updateAll: false, append: false, insert: false, remove: true, removeLast: false },
            columns: [{ name: 'RowSNo', type: 'hidden' },
            { name: 'AirlineCode', type: 'hidden' },
            { name: 'AirlineName', type: 'hidden' },
            { name: 'ULDStockSNo', type: 'hidden' },
            { name: 'IsStatus', type: 'hidden' },
            { name: 'CurrentStatus', type: 'hidden' },


            { name: 'ULDNo', display: 'ULD No', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return OnChangeUldGetSno(this);" }, isRequired: true, ctrlCss: { width: '90px', height: '20px' }, AutoCompleteName: 'ULDInventoryAppendGrid_ULDNo', filterField: 'ULDNo' },
            //  { name: 'ULDType', display: 'ULD Code', type: 'label', ctrlAttr: { controltype: 'label' }, isRequired: false, ctrlCss: { width: '90px', height: '20px' }, },

            // { name: 'SerialNo', display: 'Serial No', type: 'label', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric', onBlur: "CheckSerialNo(this)", oninput: "this.value = this.value.replace(/[^0-9.]/g, '');" }, ctrlCss: { width: '90px', 'text-transform': 'uppercase' }, isRequired: false },
            // { name: 'OwnerCode', display: 'Owner Code', type: 'label', ctrlAttr: { maxlength: 3, controltype: 'alphanumericupper', onBlur: "CheckOwnerCode(this)" }, ctrlCss: { width: '90px', 'text-transform': 'uppercase' }, isRequired: false },

            // { name: 'ULDLocation', display: 'ULD Location', type: 'label' },
            //   { name: 'ULDLocation', type: 'hidden' },
            { name: 'IsLoadedInSystem', display: 'Status', type: 'select', ctrlOptions: { 0: 'Empty', 1: 'Loaded' } },
            {
                name: 'IsPhysicallyAvailable', display: 'Physical Check', type: 'checkbox', ctrlAttr: { checked: true }, onChange: function (evt, rowIndex) {
                    var ind = evt.target.id.split('_')[2];

                    if ($("#tblULDInventory_IsPhysicallyAvailable_" + ind).is(":checked")) {

                        $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr('value', 'true')
                        $("#tblULDInventory_IsFound_" + ind).attr("disabled", false).css("cursor", "auto");
                        $("#tblULDInventory_Insert_" + ind).attr("disabled", false).css("cursor", "auto");
                        $("#tblULDInventory_IsLoadedInSystem_" + ind).attr("disabled", false).css("cursor", "auto");
                        $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                        $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        if ($("#tblULDInventory_IsFound_" + ind + " option:selected").val() == "0") {
                            $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").css("cursor", "not-allowed");
                            $("#tblULDInventory_PageULDLocationValue_" + ind).val("");
                            $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(false);
                            $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                            $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");


                            // $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                            // $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                            //$("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                            //$("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");

                        }
                        else {
                            $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").attr("disabled", false).css("cursor", "auto");
                            $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(true);
                            // $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", false).css("cursor", "auto");


                            $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", false).css("cursor", "auto");
                            $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);

                            //$("#tblULDInventory_IsServiceable_" + ind).data("kendoAutoComplete").enable(false);
                        }
                        //Added by Shivali Thakur on 26/04/2018
                        if ($("#tblULDInventory_IsDamaged_" + ind).is(":checked")) {
                            $("#tblULDInventory_IsServiceable_" + ind).val(0);
                            $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true);
                        }

                        var ULDNo = $("#tblULDInventory_HdnULDNo_" + ind).val();
                        var resData = CheckULDStaton(ULDNo, ind)
                        if (resData.length > 0) {
                            if (resData[0].AirPortCode.toUpperCase().trim() != userContextAirportCode.toUpperCase().trim()) {

                                $("#divOverview").append("<div id='DivCheckUldMessage'></div>")
                                $("#DivCheckUldMessage").html('<center><table id="tblCheckUld" style="width:95%;"><tr><td colspan="5">"' + resData[0].ULDno + '" currently available on "' + resData[0].AirPortCode.toUpperCase() + '" airport. Are you sure, you want to move to "' + userContextAirportCode.toUpperCase() + '" airport?</td></tr><tr><td align="center" colspan="2"><input type="button" class="btn btn-block btn-info" value="OK" onclick="InitiateOK(' + ind + ');" />&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUpMesg(' + ind + ');" /></td></tr></table><center>');
                                cfi.PopUp("tblCheckUld", "", 350, null, null, 10);
                                $("#tblCheckUld").parent("div").css("position", "fixed");
                            }
                        }
                    }
                    else {
                        $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr('value', 'false')
                        $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").css("cursor", "not-allowed");
                        $("#tblULDInventory_IsFound_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_PageULDLocationValue_" + ind).val("");
                        $("#tblULDInventory_HdnPageULDLocationValue_" + ind).val("");
                        $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(false);
                        $("#tblULDInventory_IsLoadedInSystem_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        //$("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        ///$("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                        $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                        $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                        $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_Insert_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                    }
                },
            },
            {
                name: 'IsFound', display: 'Found/Not Found', type: 'select', ctrlOptions: { 0: 'Not Found', 1: 'Found' }, onChange: function (evt, rowIndex) {
                    var ind = evt.target.id.split('_')[2];
                    if ($("#" + evt.target.id + " option:selected").val() == 0) {
                        $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").css("cursor", "not-allowed");
                        $("#tblULDInventory_PageULDLocationValue_" + ind).val("");
                        $("#tblULDInventory_HdnPageULDLocationValue_" + ind).val("");
                        $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(false);
                        $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                        $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                        $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                    }
                    else {
                        $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").attr("disabled", false).css("cursor", "auto");
                        $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(true);
                        $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", false).css("cursor", "auto");
                    }
                },
            },
            { name: 'PageULDLocationValue', display: 'ULD Location', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, AutoCompleteName: 'ULDInventoryAppendGrid_LocationName', filterField: 'SNo', filterCriteria: "contains" }, //, isRequired: true
            { name: 'IsDamaged', display: 'Damage', type: 'checkbox', ctrlAttr: { checked: false } },
            {
                name: 'IsServiceable', display: 'Serviceable', type: 'select', ctrlOptions: { 0: 'Non-Serviceable', 1: 'Serviceable' }, onChange: function (evt, rowIndex) {
                    var ind = evt.target.id.split('_')[2];
                    if ($("#" + evt.target.id + " option:selected").val() == 0) {

                        $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_IsDamaged_" + ind).attr("checked", true);
                    }
                    else {
                        $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                    }
                },
            },
            { name: 'IsStatus', display: 'Inventory', type: 'label', ctrlCss: { width: '80px', height: '20px' }, },

            ],
            afterRowAppended: function (tbWhole, parentIndex, addedRows) {
                if (parentIndex == null)
                    $("input[id^=tblULDInventory_ULDNo]").each(function () {
                        var ind = $(this).attr('id').split('_')[2];


                        //alert($("#tblULDInventory_IsServiceable_" + ind + " option:selected").text())
                        //if ($("#tblULDInventory_IsServiceable_" + ind + " option:selected").val() == 0) {
                        //    $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        //    $("#tblULDInventory_IsDamaged_" + ind).attr("checked", true);
                        //}
                        //else {
                        //    $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        //    $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                        //}
                        // $("#tblULDInventory_ULDNo_" + ind).prop('disabled', true);
                        $("#tblULDInventory_IsLoadedInSystem_" + ind).prop('disabled', true);
                        // $("#tblULDInventory_ULDNo_" + ind).removeAttr("required").css("cursor", "not-allowed");
                        $("#tblULDInventory_ULDNo_" + ind).data("kendoAutoComplete").enable(false);
                        // $("#tblULDInventory_ULDNo_" + ind).parent("span").css("visibility", "hidden");

                        // $("#tblULDInventory_HdnULDType_" + ind).css("visibility", "hidden");

                        ////$("#tblULDInventory_SerialNo_" + ind).removeAttr("required").css("cursor", "not-allowed");
                        ////$("#tblULDInventory_SerialNo_" + ind).prop("disabled", true);
                        ////$("#_temptblULDInventory_SerialNo_" + ind).css("visibility", "hidden");
                        ////$("#tblULDInventory_SerialNo_" + ind).css("visibility", "hidden");
                        //$("#tblULDInventory_OwnerCode_" + ind).removeAttr("required").css("cursor", "not-allowed");
                        //$("#tblULDInventory_OwnerCode_" + ind).prop("disabled", true);
                        //$("#tblULDInventory_OwnerCode_" + ind).css("visibility", "hidden");
                        $("#tblULDInventory_IsLoadedInSystem_" + ind).parent("td").css("border-right", "2px solid #0879c0").css("color", "#0879c0");
                        $("#tblULDInventory_Insert_" + ind).closest("tr td").find("button").removeAttr("class");
                        $("#tblULDInventory_Insert_" + ind).closest("tr td").find("button>span:first").removeAttr("class").text("Save");

                        if ($('#tblULDInventory tr').index() == 1)
                            $("#tblULDInventory_btnRemoveLast").hide();
                        else
                            $("#tblULDInventory_btnRemoveLast").show();
                    });
            }, rowUpdateExtraFunction: function (id) {
                $("input[id^=tblULDInventory_ULDNo]").each(function (i, el) {
                    var ind = $(this).attr('id').split('_')[2];

                    if ($("#tblULDInventory_IsPhysicallyAvailable_" + ind).is(":checked")) {
                        $("#tblULDInventory_IsFound_" + ind).attr("disabled", false).css("cursor", "auto");
                        $("#tblULDInventory_Insert_" + ind).attr("disabled", false).css("cursor", "auto");

                        if ($("#tblULDInventory_IsFound_" + ind + " option:selected").val() == "0") {
                            $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").css("cursor", "not-allowed");
                            $("#tblULDInventory_PageULDLocationValue_" + ind).val("");
                            $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(false);
                            $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                            $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                            $("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                            $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        }
                        else {
                            $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").attr("disabled", false).css("cursor", "auto");
                            $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(true);
                            $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", false).css("cursor", "auto");
                            $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", false).css("cursor", "auto");
                        }
                    }
                    else {
                        $('input[id*="tblULDInventory_PageULDLocationValue_' + ind + "]'").css("cursor", "not-allowed");
                        $("#tblULDInventory_IsFound_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_IsLoadedInSystem_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_PageULDLocationValue_" + ind).val("");
                        $("#tblULDInventory_HdnPageULDLocationValue_" + ind).val("");
                        $("#tblULDInventory_PageULDLocationValue_" + ind).data("kendoAutoComplete").enable(false);
                        $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
                        //$("#tblULDInventory_IsServiceable_" + ind + " option:eq(1)").prop('selected', true);
                        $("#tblULDInventory_IsServiceable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblULDInventory_Insert_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                    }
                });
                DamageChecked()
            },
            isPaging: true,
            isExtraPaging: true,
            isPageRefresh: false,
        });

        if ($("#tblULDInventory").length > 0) {
            $("#divOverview").css("display", "block");
            $("input[id^=tblULDInventory_ULDNo]").each(function () {
                var ind = $(this).attr('id').split('_')[2];

                $("#tblULDInventory_IsLoadedInSystem_" + ind).closest("td").css("border-right", "2px solid #0879c0");
                $("#tblULDInventory tr td:contains('Status')").css("border-right", "2px solid #0879c0").css("color", "#0879c0");
                $("#tblULDInventory tr td:contains('ULD No')").css("color", "#0879c0").next().css("color", "#0879c0").next().css("color", "#0879c0").next().css("color", "#0879c0").next().css("color", "#0879c0");
                $("#tblULDInventory_Insert_" + ind).closest("tr td").find("button").removeAttr("class");
                $("#tblULDInventory_Insert_" + ind).closest("tr td").find("button>span:first").removeAttr("class").text("Save");
            });
        }
        else {
            ShowMessage('warning', 'Warning - ULD Inventory!', "ULD Inventory Records not found.");
        }
    }
    else {
        return;
    }
}
function OnChangeUldGetSno(obj) {

    var HdnULDNo = $(obj).closest("tr").find("input[id^='tblULDInventory_HdnULDNo_']").val();
    $(obj).closest("tr").find("input[id^='tblULDInventory_ULDStockSNo_']").val(HdnULDNo);
    $(obj).closest("tr").find("input[id^='tblULDInventory_RowSNo_']").val(HdnULDNo);
    var indd = (obj).closest("tr").attr("id");
    var SpltID = indd.split("_")
    var ind = SpltID[2];
    var resData = CheckULDStaton(HdnULDNo, ind)
    if (resData.length > 0) {
        if (resData[0].AirPortCode.toUpperCase().trim() != userContextAirportCode.toUpperCase().trim()) {

            $("#divOverview").append("<div id='DivCheckUldMessage'></div>")
            $("#DivCheckUldMessage").html('<center><table id="tblCheckUld" style="width:95%;"><tr><td colspan="5">"' + resData[0].ULDno + '" currently available on "' + resData[0].AirPortCode.toUpperCase() + '" airport. Are you sure, you want to move to "' + userContextAirportCode.toUpperCase() + '" airport?</td></tr><tr><td align="center" colspan="2"><input type="button" class="btn btn-block btn-info" value="OK" onclick="InitiateOK(' + ind + ');" />&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUpMesg(' + ind + ');" /></td></tr></table><center>');
            cfi.PopUp("tblCheckUld", "", 350, null, null, 10);
            $("#tblCheckUld").parent("div").css("position", "fixed");
        }
    }

}
function CheckSerialNo(obj) {
    if ($("#tblULDInventory_SerialNo_" + $(obj).attr('id').split('_')[2]).val().length < 4) {
        $(obj).val("");
        ShowMessage('warning', 'Need your Kind Attention!', 'Serial No. should be minimum 4 character.');
    }

    if (parseInt($("#tblULDInventory_SerialNo_" + $(obj).attr('id').split('_')[2]).val()) == 0) {
        ShowMessage('warning', 'Need your Kind Attention!', 'Serial No. should not be ' + $(obj).val());
        $(obj).val("");
    }
}

function CheckOwnerCode(obj) {
    if ($("#tblULDInventory_OwnerCode_" + $(obj).attr('id').split('_')[2]).val().length < 2) {
        $(obj).val("");
        ShowMessage('warning', 'Need your Kind Attention!', 'Owner Code should be minimum 2 character.');
    }
}

function GetGeneratedSCM() {
    $("#addlist1").find("li").remove();
    $("#addlist").find("li").remove();

    if ($("#divGeneratedSCM").length === 0) {
        $("#divOverview").append("<div id='divGeneratedSCM'></div>")
        $("#divGeneratedSCM").html('<center><table id="tblGeneratedSCM" style="width:95%;"><tr><th align="left"></th><td><textarea readonly id="msgSCM" style="height:auto;min-width:94%; min-height:100px; width:auto; height:auto;"></textarea></td></tr><tr><th align="left">SUPPLEMENTARY INFO 1 :</th><td><input id="txtSI1" class="k-input" maxlength="61" type="text" style="width:95%;text-transform:uppercase;" onchange="CheckSI1ANDSI2();" /></td></tr><tr><th align="left">SUPPLEMENTARY INFO 2 :</th><td><input id="txtSI2" class="k-input" maxlength="64" style="width:95%;text-transform:uppercase;" type="text" onchange="CheckSI1ANDSI2();"/></td></tr><tr><th></th><td align="left"><input id="btnGenerateSCM" type="button" style="vertical-align:middle;" class="btn btn-block btn-info" value="Generate SCM" onclick="GenerateANDSaveCIMPMessage();"></td></tr><tr><th align="left" valign="top">EMAIL<font color="red">*</font> :</th><td><input type="hidden" id="hdnmail" name="hdnmail" /><input id="txtEmail" class="k-input" maxlength="50" style="width:95%;text-transform:uppercase;" type="text"/><br/><span class="k-label">(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span><br/><div id="divmailAdd" style="overflow:auto;"><ul id="addlist1" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div></td></tr><tr><th align="left" valign="top">SITA <font color="red">*</font>:</th><td><input type="hidden" id="hdnadd" name="hdnadd" /><input id="txtSita" class="k-input" maxlength="50" style="width:95%;;text-transform:uppercase;" type="text"/><br/><div id="divsitaAdd" style="overflow:auto;"><ul id="addlist" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div></td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><td align="center" colspan="2"><input type="button" class="btn btn-block btn-info" value="SEND SCM" onclick="InitiateSCM();" />&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUpSCM();" /></td></tr></table><center>');
    }
    CheckSI1ANDSI2();

    //$.ajax({
    //    url: "Services/ULD/ULDInventoryService.svc/GetGeneratedSCM", async: false, type: "POST", dataType: "json", cache: false,
    //    data: JSON.stringify({ AirlineCode: phyUldSNo }),
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) 
    //{
    //        var Data = jQuery.parseJSON(result);
    //        var resData = Data.Table0;
    //        if (resData.length > 0) {
    //            if (resData[0].CarrierCode != "" && resData[0].InventoryDate != "")
    //                $.ajax({
    //                    url: "Services/Common/CommonService.svc/GenerateCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
    //                    data: JSON.stringify({ MessageType: "SCM", SerialNo: "", SubType: "", flightNumber: resData[0].CarrierCode, flightDate: resData[0].InventoryDate, OriginAirport: userContextAirportCode, isDoubleSignature: false, version: "", nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: "" }),
    //                    contentType: "application/json; charset=utf-8",
    //                    success: function (result) {
    //                        $("#msgSCM").val(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);
    //                    }
    //                });
    //        }
    //    }
    //});

    GenerateCIMPMessage();


    cfi.PopUp("tblGeneratedSCM", "Send SCM", 830, null, null, 10);
    $("#tblGeneratedSCM").parent("div").css("position", "fixed");

    fnSetSitaAddress();
    fnSetEmail();
    FnNotAllowedEnterKey();
}

var SCMBool = true;

function FnNotAllowedEnterKey() {
    $("body").keydown(function (e) {
        var addlen = $("#txtEmail").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
}

function GenerateANDSaveCIMPMessage() {
    if ($("#txtSI1").val() != "" || $("#txtSI2").val() != "") {
        $.ajax({
            url: "Services/ULD/ULDInventoryService.svc/GenerateANDSaveCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AirlineCode: phyUldSNo, SI1: ($("#txtSI1").val() == "" || $("#txtSI1").val() == undefined) ? "" : $("#txtSI1").val(), SI2: ($("#txtSI2").val() == "" || $("#txtSI2").val() == undefined) ? "" : $("#txtSI2").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    for (var key in resData) {
                        if (resData[key].Column1 == "0") {
                            GenerateCIMPMessage();
                            SCMBool = true;
                            ShowMessage('success', 'Success - SCM Generation', "SCM generated successfully.");
                        }
                    }
                }
            }
        });
    }
}

function GenerateCIMPMessage() {





    $.ajax({
        url: "Services/ULD/ULDInventoryService.svc/GetGeneratedSCM", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AirlineCode: phyUldSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData.length > 0) {
                if (resData[0].CarrierCode != "" && resData[0].InventoryDate != "")
                    $.ajax({
                        url: "Services/Common/CommonService.svc/GenerateCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ MessageType: "SCM", SerialNo: "", SubType: "", flightNumber: resData[0].CarrierCode, flightDate: resData[0].InventoryDate, OriginAirport: userContextAirportCode, isDoubleSignature: false, version: "", nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: "" }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            $("#msgSCM").val(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);
                        }
                    });
            }
        }
    });
}

function CheckSI1ANDSI2() {
    if ($("#txtSI1").val() != "") {
        $("#btnGenerateSCM").show();
        SCMBool = false;
    }
    else if ($("#txtSI1").val() == "" && $("#txtSI2").val() != "") {
        $("#btnGenerateSCM").hide();
        ShowMessage("warning", "Warning", "Kindly enter Supplementary Information 1 before entering Supplementary Information 2.");
        SCMBool = true;
    }
    else {
        $("#btnGenerateSCM").hide();
        SCMBool = true;
    }
}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}

function fnSetSitaAddress() {
    $("#txtSita").keyup(function (e) {
        var addlen1 = $("#txtSita").val().toUpperCase();
        addlen1 = addlen1.replace(/[^0-9a-zA-Z]/g, '');
        addlen1 = $("#txtSita").val(addlen1);
        var addlen = addlen1.val().toUpperCase();
        if (addlen.length == 7) {
            var restdata = $("ul#addlist li").text().split(" ");

            for (var i = 0; i < restdata.length; i++) {
                if (addlen == restdata[i]) {
                    $("#txtSita").val('');
                    ShowMessage('warning', 'Warning - SCM', "SITA Address already entered");
                    return;
                }
            }

            if ($("ul#addlist li").length < 35) {
                var listlen = $("ul#addlist li").length;
                $("ul#addlist").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;text-transform: uppercase'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
            }
            else {
                ShowMessage('warning', 'Warning - SCM', "Maximum 35 SITA Address allowed.");
            }
            $("#txtSita").val('');
        }
        else if (addlen.length > 7) {
            $("#txtSita").val('');
        }
        else
            e.preventDefault();

    });

    $("#txtSita").blur(function () {
        $("#txtSita").val('');
    });
    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });
}

function fnSetEmail() {
    $("#txtEmail").keyup(function (e) {
        var addlen = $("#txtEmail").val();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            var finalValue = addlen.substring(0, addlen.length - 1);
            if (ValidateEMail(finalValue)) {
                if ($("ul#addlist1 li").length < 3) {
                    var listlen = $("ul#addlist1 li").length;
                    $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + finalValue + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                }
                else {
                    ShowMessage('warning', 'Warning - SCM', "Maximum 3 E-mail Addresses allowed.");
                }
                $("#txtEmail").val('');
            }
            else {
                ShowMessage('warning', 'Warning - SCM', "Enter valid Email address.");
                return;
            }
        }
        else
            e.preventDefault();
    });
    $("#txtEmail").blur(function () {
        $("#txtEmail").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });

}

//-------------------------------------
//-- Get Inventory Report
//-------------------------------------
function GetInventoryReport(obj, ULDInventoryMasterSNo) {
    if (ULDInventoryMasterSNo != "")
        $.ajax({
            url: "Services/ULD/ULDInventoryService.svc/GetInventoryReport", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ULDInventoryMasterSNo: ULDInventoryMasterSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;
                if (resData.length > 0) {
                    if ($("#divInventoryReport").length === 0)
                        $("#divbody").append("<div id='divInventoryReport'></div>");
                    $("#divInventoryReport").html('');
                    $("#tblInventoryReport").html('')
                    var inventoryDate = new Date();
                    $("#divInventoryReport").html('<table id="tblInventoryReport"><tr><td></td><td></td><td></td><td colspan="2" align="center">ULD INVENTORY REPORT</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>' + userContext.SysSetting.Heading + '</td><td></td><td></td><td>Inventory Date : </td><td>' + resData[0].InventoryDate + '</td><td></td><td></td><td>Date : </td><td align="left">' + resData1[0].CurrentDate + '</td></tr><tr><td>' + userContext.UserName + '</td><td></td></td><td></td><td>Station : </td><td>' + resData[0].Station + '</td><td></td><td></td><td>Time : </td><td align="left">' + resData1[0].CurrentTime + '</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>SNo</td><td>ULD No</td><td>Airline Name</td><td>Location</td><td>Physically Available</td><td>Loaded In System</td><td>Found</td><td >Damaged</td><td>Serviceable</td></tr></table>');
                    for (var i = 0; i < resData.length; i++) {
                        $('#tblInventoryReport').append('<tr><td align="left">' + parseInt(i + 1) + '</td><td>' + resData[i].ULDNo + '</td><td>' + resData[i].AirlineName + '</td><td>' + resData[i].SystemLocation + '</td><td align="center">' + resData[i].PhysicallyAvailable + '</td><td>' + resData[i].LoadedInSystem + '</td><td>' + resData[i].Found + '</td><td>' + resData[i].Damaged + '</td><td>' + resData[i].Serviceable + '</td></tr>');
                    }

                    $("#divInventoryReport").hide();
                    var tableStr = $('#divInventoryReport').html().replace('id="tblInventoryReport"', "");
                    var data_type = 'data:application/vnd.ms-excel';
                    var a = document.createElement('a');
                    a.href = data_type + ', ' + encodeURIComponent(tableStr);
                    a.download = "ULDInventory_" + new Date() + '.xls';
                    a.click();
                }
                else {
                    ShowMessage("warning", "Warning - ULD Inventory", "Record not found.")
                }
            }
        });
}

function ClosePopUpSCM() {
    $("#tblGeneratedSCM").data("kendoWindow").close();
}


function InitiateSCM() {
    if (phyUldSNo == "") {
        ShowMessage('warning', 'Warning - Initiate SCM', "Airline not found.");
        return;
    }

    if (SCMBool == false) {
        ShowMessage('warning', 'Warning - Initiate SCM', "Kindly generate SCM again.");
        return;
    }

    if ($("#txtSI1").val() == "" && $("#txtSI2").val() != "") {
        ShowMessage("warning", "Warning", "Kindly enter Supplementary Information 1 before entering Supplementary Information 2.");
        return;
    }

    var k = ''; var L = '';
    for (var i = 0; i < $("ul#addlist li span").text().split(' ').length - 1; i++) { k = k + $("ul#addlist li span").text().split(' ')[i] + ','; }

    for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++) { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }

    $("#hdnadd").val(k.substring(0, k.length - 1));
    if ($("#addlist li").length > 0)
        $("#txtSita").removeAttr("data-valid");

    $("#hdnmail").val(L.substring(0, L.length - 1));
    if ($("#addlist1 li").length > 0)
        $("#txtEmail").removeAttr("data-valid");

    if ($("#msgSCM").val() == '') {
        ShowMessage('warning', 'Warning - Initiate SCM', "SCM not generated.");
        return;
    }

    if (($("#addlist1 li").length == 0) && ($("#addlist li").length == 0)) {
        ShowMessage('warning', 'Warning - Initiate SCM', "Kindly provide Email address or SITA address.");
        return;
    }


    else if (($("#addlist1 li").length > 0) || ($("#addlist li").length > 0)) {

        var ObjSCM = {
            SitaAddress: btoa($("#hdnadd").val()),
            EmailAddress: btoa($("#hdnmail").val()),
            SCMMessage: btoa($("#msgSCM").val()),
        }

        $.ajax({
            url: "Services/ULD/ULDInventoryService.svc/SaveSCM",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ObjSCM }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                if (result == 0) {
                    ShowMessage('success', 'Success - Initiate SCM', "SCM initiated successfully.");
                    $("#tblGeneratedSCM").data("kendoWindow").close();
                    $("#txtSI1").val("");
                    $("#txtSI2").val("");
                    $("#hdnadd").val("");
                    $("#hdnmail").val("");
                }
                else {
                    ShowMessage('warning', 'Warning - Initiate SCM', "SCM not Initiated.");
                    return;
                }
            }
        });
    }

    //else {
    //    $.ajax({
    //        url: "./Services/ULD/ULDInventoryService.svc/InitiateSCM",
    //        contentType: "application/json; charset=utf-8",
    //        data: JSON.stringify({ AirlineCode: phyUldSNo, SI1: ($("#txtSI1").val() == "" || $("#txtSI1").val() == undefined) ? "" : $("#txtSI1").val(), SI2: ($("#txtSI2").val() == "" || $("#txtSI2").val() == undefined) ? "" : $("#txtSI2").val() }),
    //        async: false,
    //        type: 'post',
    //        cache: false,
    //        success: function (result) {
    //            var Data = jQuery.parseJSON(result);
    //            var resData = Data.Table0;
    //            if (resData.length > 0) {
    //                for (var key in resData) {
    //                    if (resData[key].Column1 == "0") {
    //                        ShowMessage('success', 'Success - Initiate SCM', "SCM initiated successfully.");
    //                        $("#tblGeneratedSCM").data("kendoWindow").close();
    //                        $("#txtSI1").val("");
    //                        $("#txtSI2").val("");
    //                    }
    //                    else {
    //                        ShowMessage('warning', 'Warning - Initiate SCM', "SCM not Initiated.");
    //                        return;
    //                    }
    //                }
    //            }
    //        }
    //    });
    //}
}

var phyUldSNo = 0;
var currentAirport = 0;
var phyUldSearchBy = '';

var s = '';

$("#btnSearch").click(function () {
    if ($("#SearchAirlineSNo").val() == "" && $("#SearchULDLocation").val() == "") {
        ShowMessage('warning', 'Warning - Physical ULD Inventory Search', "Unable to search, Select Airline.", "bottom-right");
        return;
    }
    if ($("#SearchULDLocation").val() != "" && $("#SearchAirlineSNo").val() == "") {
        ShowMessage('warning', 'Warning - Physical ULD Inventory Search', "Select Airline.", "bottom-right");
        return;
    }
    if ($("#SearchULDNo").val() != "" && $("#SearchAirlineSNo").val() == "") {
        ShowMessage('warning', 'Warning - Physical ULD Inventory Search', "Select Airline.", "bottom-right");
        return;
    }
    if ($("#SearchLoadedStatus").val() != "" && $("#SearchAirlineSNo").val() == "") {
        ShowMessage('warning', 'Warning - Physical ULD Inventory Search', "Select Airline.", "bottom-right");
        return;
    }

    else {
        var airlineCode = ($("#SearchAirlineSNo").val() == "") ? 1 : $("#SearchAirlineSNo").val();
        var uldLocationSNo = ($("#SearchULDLocation").val() == "") ? "A~A" : $("#SearchULDLocation").val();
        var searchULDNo = ($("#SearchULDNo").val() == "") ? "A~A" : $("#SearchULDNo").val();
        var searchLoadedStatus = ($("#SearchLoadedStatus").val() == "") ? "A~A" : $("#SearchLoadedStatus").val();
        var searchULDType = ($("#SearchULDType").val() == "") ? "A~A" : $("#SearchULDType").val();
        var SearchAirport = ($("#SearchAirport").val() == "") ? "0" : $("#SearchAirport").val();
        var SearchFound = ($("#Text_SearchFound").val() == "") ? "A~A" : $("#Text_SearchFound").val();

        phyUldSNo = airlineCode;
        currentAirport = SearchAirport;
        phyUldSearchBy = uldLocationSNo + '-' + searchULDNo + '-' + searchLoadedStatus + '-' + searchULDType + '-' + SearchAirport + '-' + SearchFound;

        //$.ajax({
        //    url: "Services/ULD/ULDInventoryService.svc/GetAirlineSNo", async: false, type: "POST", dataType: "json", cache: false,
        //    data: JSON.stringify({ AirlineCode: phyUldSNo }),
        //    contentType: "application/json; charset=utf-8",
        //    success: function (result) {
        //        var Data = jQuery.parseJSON(result);
        //        var resData = Data.Table0;
        //        if (resData.length > 0) {
        //            CurrentAirlineSNo = resData[0].AirlineSNo;
        //        }
        //    }
        //});
    }

    CreateULDInventory();
    DamageChecked();
    $('#tblOnHand').html('');
    $('#tblInUse').html('');
    $('#tblDamage').html('')
    $.ajax({
        url: "./Services/ULD/ULDInventoryService.svc/GetULDInventoryOverview",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AirlineCode: phyUldSNo, SearchAirport: currentAirport, UldLocationSNo: phyUldSearchBy.split("-")[0], CityCode: hdnCityCode }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData1 = Data.Table1;
            var resData2 = Data.Table2;
            if (resData.length > 0) {
                for (var key in resData) {
                    $('#tblOnHand').html('').append('<tr><td>' + resData[key].OnHand + '</td></tr>');
                }
            }
            if (resData1.length > 0) {
                for (var key1 in resData1) {
                    $('#tblInUse').html('').append('<tr><td>' + resData1[key1].InUse + '</td></tr>');
                }
            }
            if (resData2.length > 0) {
                for (var key2 in resData2) {
                    $('#tblDamage').html('').append('<tr><td>' + resData2[key2].Damage + '</td></tr>');
                }
            }
        }
    });

    if ($("#tblULDInventory tbody").find("tr").find("td").text() == "This Grid Is Empty") {
        $('#tblOnHand').html('');
        $('#tblInUse').html('');
        $('#tblDamage').html('');
        $('#tblULDInventory').html('');
        $("#divOverview").css("display", "none");
    }
});

function DamageChecked() {
    setTimeout(function () {
        $("input[id^=tblULDInventory_ULDNo]").each(function () {
            var ind = $(this).attr('id').split('_')[2];
            var Sno = $("#tblULDInventory_ULDStockSNo_" + ind).val()
            $("#tblULDInventory_HdnULDNo_" + ind).val(Sno)

            if ($("#tblULDInventory_IsServiceable_" + ind + " option:selected").val() == 0) {
                $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                $("#tblULDInventory_IsDamaged_" + ind).attr("checked", true);
            }
            else {
                $("#tblULDInventory_IsDamaged_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                $("#tblULDInventory_IsDamaged_" + ind).attr("checked", false);
            }

            var CurrentStatus = $("#tblULDInventory_CurrentStatus_" + ind).val()
            if (CurrentStatus.trim().toUpperCase() == "DEP" || CurrentStatus.trim().toUpperCase() == "IN-TRANSIT") {
                $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr("disabled", true).css("cursor", "not-allowed");
                $("#tblULDInventory_IsPhysicallyAvailable_" + ind).attr("title", 'IN-TRANSIT');
            }
            if (CurrentStatus.trim().toUpperCase() == "NOT FOUND") {
                $("#tblULDInventory_IsFound_" + ind + " option:eq(0)").prop('selected', true);
            }
        });




    }, 800)


}
function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_SearchAirlineSNo") {
        try {
            //$("#Text_SearchULDNo").val("");
            //$("#SearchULDNo").val("");
            //cfi.setFilter(filterEmbargo, "OfficeSNo", "eq", userContext.OfficeSNo);
            //var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            //return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }

    if (textId == "Text_SearchULDLocation") {
        try {
            cfi.setFilter(filterEmbargo, "CityCode", "eq", hdnCityCode);
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) { }
    }

    if (textId == "Text_SearchULDNo") {
        try {
            cfi.setFilter(filterEmbargo, "CurrentCityCode", "eq", hdnCityCode);
            if ($("#SearchAirlineSNo").val() != "")
                cfi.setFilter(filterEmbargo, "AirlineCode", "eq", $("#SearchAirlineSNo").val());

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }

    var ULDTypeAutoCompleteFilter = cfi.getFilter("AND");
    if (textId.indexOf("tblULDInventory_ULDNo_") >= 0) {
        var ULDNo = 0;
        $("input[id^=tblULDInventory_ULDNo_]").each(function () {
            var ind = $(this).attr('id').split('_')[2];

            ULDNo = ULDNo + ',' + $("#tblULDInventory_HdnULDNo_" + ind).val();

        });

        var Fliter = cfi.getFilter("AND");
        cfi.setFilter(Fliter, "ULDStockSNo", "notin", ULDNo);
        cfi.setFilter(Fliter, "CurrentAirportSNo", "notin", CurrentAirlineSNo);
        ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter(Fliter);
        return ULDTypeAutoCompleteFilter;
    }

    //if (textId == "tblULDInventory_ULDNo_" + textId.split('_')[2]) {
    //    try {
    //        cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "notin", CurrentAirlineSNo);
    //        var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
    //        return ULDTypeAutoCompleteFilter;
    //    }
    //    catch (exp)
    //    { }
    //}

    //if (textId == "tblULDInventory_ULDType_" + textId.split('_')[2]) {
    //    try {
    //        cfi.setFilter(filterEmbargo, "AirlineCode", "eq", $("#SearchAirlineSNo").val());
    //        var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
    //        return ULDTypeAutoCompleteFilter;
    //    }
    //    catch (exp) { }
    //}
}
//Sushant
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {
};

function Scmmessage(id, IvId) {

    if (IvId != "0") {
        $.ajax({
            url: "Services/ULD/ULDInventoryService.svc/GetScmMessage", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ID: IvId }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                Data = jQuery.parseJSON(result);
                resData = Data.Table0;
                // SCMMsg
                $("#ScmMessage").val("");
                if (resData.length > 0) {
                    $("#ScmMessage").val(resData[0].SCMMsg);
                    $("#DivGetScmMessage").dialog({
                        modal: true,
                        draggable: true,
                        resizable: true,
                        position: ['center', 'top'],
                        show: 'blind',
                        hide: 'blind',
                        width: 300,
                        title: "SCM MESSAGE",
                        dialogClass: 'ui-dialog-osx',
                        buttons: {
                            "Cancel": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
            }
        });
    }
}
$("#divFooter").append("<div id='divGeneratedSCMMessage'></div>")
$("#divGeneratedSCMMessage").html("<center><div style='display:none;' id='DivGetScmMessage'><textarea id='ScmMessage' style='height:150px;width:249px;border-radius: 10px;border: 3px solid #ccc;'></textarea></div><center>");

