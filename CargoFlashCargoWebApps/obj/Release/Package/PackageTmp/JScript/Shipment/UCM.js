var origincity = "";
var uldname = [];
var content = [];
$(document).ready(function () {
    cfi.ValidateForm();
    $("#MasterDuplicate").hide();


    $('#tbPallet').hide();

    var pageType = getQueryStringValue("FormAction").toUpperCase();
    if (pageType == "NEW") {
        $("#FlightDate").parent('span').before("<span style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>Flight Date: </span>");
        $("#FlightNo").before("<span style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>Flight/Truck No: </span>");
        $("#UCMType").before("<span style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>UCM Type: </span>");
        // $("#MessageType").before("<span style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>Message Type: </span>");
        $("#AirlineSNo").before("<span style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>Airline: </span>");
        $("span#spnSearch").parent("td").css("width", "3%");
        $("#btnSearch").css("width", "8%");


        $("input[name='operation']").parent("td").hide();


    }
    if (pageType == "EDIT") {
        $("input[name='operation']").hide();
        $("input[name='operation']").after("<input type='button' value='Update' class='btn btn-success' onClick='UpdateUCM()' id='btnSave'>");

    }
    // cfi.AutoComplete("AirlineSNo", "AirlineName", "vUCMAirline", "CarrierCode", "CarrierCode", ["AirlineName"], null, "contains");

    //cfi.AutoComplete("AirlineSNo", "AirlineName", "vUCMAirline", "CarrierCode", "AirlineName", ["AirlineName"], null, "contains");

    cfi.AutoComplete("AirlineSNo", "AirlineName", "vUCMAirline", "CarrierCode", "AirlineName", ["AirlineName"], null, "contains");

    $("#FlightDate").find(".flightdatepicker").kendoDatePicker({ format: "yyyy-MMM-dd", value: new Date() });
    cfi.AutoComplete("FlightNo", "FlightNo", "vUCMFlightNo", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");

    var Content = [{ Key: "0", Text: "CARGO" }, { Key: "1", Text: "BAGGAGE" }, { Key: "2", Text: "EMPTY" }, { key: "3", Text: "MAIL" }];
    cfi.AutoCompleteByDataSource("Content", Content, null);

    var UCMType = [{ Key: "0", Text: "OUTBOUND" }, { Key: "1", Text: "INBOUND" }];
    cfi.AutoCompleteByDataSource("UCMType", UCMType, null);

    var MessageType = [{ Key: "S", Text: "Single" }, { Key: "B", Text: "Club" }];
    cfi.AutoCompleteByDataSource("MessageType", MessageType, null);


    $('#tbl').after("<br/><div id='Container'><div id='divUCM' style='height:100px overflow:auto'><table id='tblUCM'></table></div><br/><br/><input type='button' value='ADD' class='btn btn-success' onClick='AddAttachedUld()' id='btnAdd'><br/><div id='divattachedUCM' style='height:100px overflow:auto'><table id='tblattachedUCM'></table></div><br/><br/><div id=divbutton><input type='button' value='Save' class='btn btn-success' onClick='SaveUCM()' id='btnSave'><input type='button' value='Save & New' class='btn btn-success' onClick='SaveNewUCM()' style='margin-left:5px' id='btnSaveNew'></div></div>")

    $("#Container").hide();
    origincity = userContext.AirportSNo;

    //$("#divUCM").append("<br/><span style='font-weight:bold;font-size: 9pt;color: #5A7570;font-family: Verdana;height:25px;text-align:left;vertical-align: middle;background-color:#F7F7F7;padding-left: 7px;' >Add Base Pallet <input type='radio'name='Pallet' id='Pallet' value='2' >Yes <input type='radio'  name='Pallet' id='Pallet' value='1' checked='True'>No</span><hr/><br/><table style='width:100%' border='0' cellpadding='1' cellspacing='1' id='tbPallet' style='display:block'><tr><td width='75px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>ULD Code</b>&nbsp;&nbsp;<input type='hidden' name='ULDType' id='ULDType' value=''/>        <input type='text'  name='Text_ULDType' id='Text_ULDType' tabindex='5' controltype='autocomplete' maxlength='5' /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Serial No</b>&nbsp;&nbsp;<input type='text' maxlength='5' tabindex='6' name='SerialNo' id='SerialNo'  onkeyup='checkInput(this)'  width='30px'/> &nbsp;<b>Owner Code</b> &nbsp;&nbsp;<input type='hidden' name='OwnerCode' id='OwnerCode' value=''/><input type='text'  name='Text_OwnerCode' id='Text_OwnerCode' tabindex='7' controltype='autocomplete' maxlength='5' /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Destination</b> &nbsp;&nbsp;<input type='hidden' name='Destination' id='Destination' value=''/><input type='text'  name='Text_Destination' id='Text_Destination' tabindex='7' controltype='autocomplete' maxlength='5' /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' class='btn btn-block btn-info'  tabindex='8' value='Save Pallet' onclick='SavePallet();' /></td></tr></table><hr/></div>");



    $("#divUCM").append("<br/><span style='font-weight:bold;font-size: 9pt;color: #5A7570;font-family: Verdana;height:25px;text-align:left;vertical-align: middle;background-color:#F7F7F7;padding-left: 7px;' >Add Base Pallet <input type='radio'name='Pallet' id='Pallet' value='2' >Yes     <input type='radio'  name='Pallet' id='Pallet' value='1' checked='True'>No</span><hr/><br/><table style='width:75%' border='0' cellpadding='1' cellspacing='1' id='tbPallet' style='display:block'><tr><td width='300px'><b>ULD Code</b> &nbsp;&nbsp;<input type='hidden' name='ULDType' id='ULDType' value=''/>        <input type='text'  name='Text_ULDType' id='Text_ULDType' tabindex='5' controltype='autocomplete' maxlength='5' /> </td><td><b>Serial No</b>&nbsp;&nbsp;<input type='text' maxlength='5' tabindex='6' name='SerialNo' id='SerialNo'  onBlur='CheckSNo(this)' onkeyup='checkInput(this)'  width='30px'/> </td><td><b>Owner Code</b>&nbsp;&nbsp;<input type='hidden' name='OwnerCode' id='OwnerCode' value=''/><input type='text'  name='Text_OwnerCode' id='Text_OwnerCode' tabindex='7' controltype='autocomplete' maxlength='5' /></td><td><div id='tbdest'><b>Off Point</b> &nbsp;&nbsp;<input type='hidden' name='Destination' id='Destination' value=''/><input type='text'  name='Text_Destination' id='Text_Destination' tabindex='7' controltype='autocomplete' maxlength='5' /></div></td><td><input type='button' class='btn btn-block btn-info'  tabindex='8' value='Save Pallet' onclick='SavePallet();' /></td></tr></table><hr/></div>");


    cfi.AutoComplete("Destination", "DestinationAirportCode", "vwDestinationPallet", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");



    cfi.AutoComplete("OwnerCode", "CarrierCode", "vwcarrier", "CarrierCode", "CarrierCode", ["CarrierCode"], null, "contains");

    cfi.AutoComplete("ULDType", "ULDName", "vuldtypename", "ULDName", "ULDName", ["ULDName"], null, "contains");

    $("#divUCM").append("<br/><span style='font-weight:bold;font-size: 9pt;color: #5A7570;font-family: Verdana;height:25px;text-align:left;vertical-align: middle;background-color:#F7F7F7;padding-left: 7px;'>Overview</span><input type='button' style='float:right;vertical-align:middle;margin-right:150px;' class='btn btn-block btn-info' value='Preview UCM' id='Preview' onclick='GetGeneratedUCM();' /><hr/></div>");

    $("#divUCM").css("display", "none");
    $("#tbl tbody tr:nth-child(4)").hide();

    $("#tbPallet").css("display", "none");

    $("input:radio[name='Pallet']").on("change", function () {
        if ($("input:radio[name='Pallet']:checked").val() == "2") {


            $('#tbPallet').show();
            if ($("#UCMType").val() == 1) {
                $("#tbdest").hide();
            }
            else {

                $("#tbdest").show();
            }

        }

        else if ($("input:radio[name='Pallet']:checked").val() == "1") {


            $('#tbPallet').hide();

        }


    });


    if (pageType == "READ" || pageType == "EDIT" || pageType == "DELETE") {
        $("#Container").show();
        $("#btnAdd").hide();

        $("#divbutton").hide();

        $("#divUCM").css("display", "block");


        //$("#Container").append("<br/><span style='font-weight:bold;font-size: 9pt;color: #5A7570;font-family: Verdana;height:25px;text-align:left;vertical-align: middle;background-color:#F7F7F7;padding-left: 7px;'>Overview</span><input type='button' style='float:right;vertical-align:middle;margin-right:150px;' class='btn btn-block btn-info' value='Preview UCM' id='Preview' onclick='GetGeneratedUCM();' /><hr/></div>");

        getUCMGrid();
        AddAttachedUld();

    }
});

var pageType = getQueryStringValue("FormAction").toUpperCase();
function GoBack() {
    navigateUrl('Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW');
}


function CheckSerialNo(obj) {
    if ($("#tblattachedUCM_ESerialNo_" + $(obj).attr('id').split('_')[2]).val().length < 4) {
        $(obj).val("");
        ShowMessage('warning', 'Need your Kind Attention!', 'Serial No. should be minimum 4 character.');
        return false;
    }

    if (parseInt($("#tblattachedUCM_ESerialNo_" + $(obj).attr('id').split('_')[2]).val()) == 0) {
        ShowMessage('warning', 'Need your Kind Attention!', 'Serial No. should not be ' + $(obj).val());
        $(obj).val("");
        return false;
    }
}

function GetUCMPallet() {
    var AirlineSNo = $("#AirlineSNo").val();
    var FlightDate = $("#FlightDate").val();
    var FlightNo = $("#Text_FlightNo").val();
    var UCMType = $("#UCMType").val();
    if (AirlineSNo != "" && FlightNo != "" && FlightDate != "" && UCMType != "") {


        // getUCMGrid();
        $.ajax({
            url: "./Services/Shipment/UCMService.svc/GetUCMPallet",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AirlineSNo: AirlineSNo, FlightDate: FlightDate, FlightNo: FlightNo, UCMType: UCMType, origincity: origincity }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {


                var dataTableobject = JSON.parse(result);
                if (dataTableobject.Table0 != undefined) {
                    if (dataTableobject.Table0.length > 0) {
                        // $('#tblUCM').appendGrid('load', dataTableobj.Table0);
                        //  $("#divUCM").css("display", "block");

                        $("#pallet").remove();
                        var str = " ";
                        str += "<div id='pallet' style='height:100px;width:780px;border:1px solid #ccc;overflow:auto;font:15px/15px  Serif'><table width='100%' cellpadding='0' cellspacing='1' border='0'><tr><td>&nbsp;<b><u>Added Base ULD No</u></b><br/><br/></td></tr><tr>";
                        for (var j = 0; j < dataTableobject.Table0.length; j++) {
                            str += "<td>" + dataTableobject.Table0[j].ULDNo + "</td>";

                        }
                        str += "</tr></table></div>";


                        $("#divUCM").append(str + "</div>");

                        // $("#tbPallet").after(" <b>Appended text</b>.");

                    }
                    else {
                        $("#btnAdd").hide();
                        // ShowMessage('warning', 'Warning - UCM!', "Record Not Found!");
                    }
                }
                else {// ShowMessage('warning', 'Warning - UCM!', "Record Not Found!"); 
                }

            },
            error: function (err) {
                alert("Generated Error");
            }
        });
    }
    else {
        $("#tblUCM").hide();
        // ShowMessage('warning', 'Warning - UCM!', "All field are mandatory!")
    }


}

function GetGeneratedUCM() {
    $("#addlist1").find("li").remove();
    $("#addlist").find("li").remove();

    if ($("#divGeneratedSCM").length === 0) {

        $("#divUCM").append("<div id='divGeneratedSCM'></div>")
        $("#divGeneratedSCM").html('<center><table id="tblGeneratedSCM" style="width:95%;"><tr><th align="left"></th><td><textarea readonly id="msgSCM" style="height:auto;min-width:94%; min-height:100px; width:auto; height:auto;"></textarea></td></tr><tr><th align="left">SUPPLEMENTARY INFO 1 :</th><td><input id="txtSI1" class="k-input" maxlength="61" type="text" style="width:95%;text-transform:uppercase;" onchange="CheckSI1ANDSI2();" /></td></tr><tr><th align="left">SUPPLEMENTARY INFO 2 :</th><td><input id="txtSI2" class="k-input" maxlength="64" style="width:95%;text-transform:uppercase;" type="text" onchange="CheckSI1ANDSI2();"/></td></tr><tr><th></th><td align="left"><input id="btnGenerateUCM" type="button" style="vertical-align:middle;" class="btn btn-block btn-info" value="Generate UCM" onclick="GenerateANDSaveCIMPMessage();"></td></tr> <tr><th align="left" valign="top">EMAIL<font color="red">*</font> :</th><td><input type="hidden" id="hdnmail" name="hdnmail" /><input id="txtEmail" class="k-input" maxlength="50" style="width:95%;text-transform:uppercase;" type="text"/><br/><span class="k-label">(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span><br/><div id="divmailAdd" style="overflow:auto;"><ul id="addlist1" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div></td></tr><tr><th align="left" valign="top">SITA <font color="red">*</font>:</th><td><input type="hidden" id="hdnadd" name="hdnadd" /><input id="txtSita" class="k-input" maxlength="50" style="width:95%;;text-transform:uppercase;" type="text"/><br/><div id="divsitaAdd" style="overflow:auto;"><ul id="addlist" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div></td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><td align="center" colspan="2"><input type="button" class="btn btn-block btn-info" value="SEND UCM" onclick="InitiateSCM();" />&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUpSCM();" /></td></tr></table><center>');
    }

    CheckSI1ANDSI2();
    GenerateCIMPMessage();


    cfi.PopUp("tblGeneratedSCM", "Send UCM", 830, null, null, 10);
    $("#tblGeneratedSCM").parent("div").css("position", "fixed");

    fnSetSitaAddress();
    fnSetEmail();
    FnNotAllowedEnterKey();

}


function GenerateANDSaveCIMPMessage() {
    var fltno = $("#FlightNo").val();
    var fltdt = $("#FlightDate").val();

    var sub = 0;
    if ($("#UCMType").val() == 1) {
        sub = 0;
    }
    else if ($("#UCMType").val() == "INBOUND")
    { sub = 0; }
    else {
        sub = 1;
    }

    if ($("#txtSI1").val() == "" && $("#txtSI2").val() != "") {
        ShowMessage('warning', 'Kindly enter Supplementary Information 1 before entering Supplementary Information 2');

        UCMBool = false;
        return;
    }

    else {
        if ($("#txtSI1").val() != "") {
            $.ajax({
                url: "./Services/Shipment/UCMService.svc/GenerateANDSaveCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ FlightNo: fltno, FlightDate: fltdt, UCMType: sub, SI1: ($("#txtSI1").val() == "" || $("#txtSI1").val() == undefined) ? "" : $("#txtSI1").val(), SI2: ($("#txtSI2").val() == "" || $("#txtSI2").val() == undefined) ? "" : $("#txtSI2").val() }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {
                        //  for (var key in resData) {
                        //if (resData[key].Column1 == "0") {
                        GenerateCIMPMessage();
                        UCMBool = true;
                        ShowMessage('success', 'Success - UCM Generation', "UCM generated successfully.");
                        // }
                        //}
                    }
                }
            });
        }
    }
}


function CheckSI1ANDSI2() {
    if ($("#txtSI1").val() != "" || $("#txtSI2").val() != "") {

        if ($("#txtSI1").val() == "" && $("#txtSI2").val() != "") {
            ShowMessage('warning', 'Kindly enter Supplementary Information 1 before entering Supplementary Information 2');
            Sup = false;
            UCMBool = false;
            return;
        }
        else {
            $("#btnGenerateUCM").show();
            UCMBool = false;
        }
    }

    else {
        $("#btnGenerateUCM").hide();
        UCMBool = true;
    }
}

function ClosePopUpSCM() {
    $("#tblGeneratedSCM").data("kendoWindow").close();
}

function InitiateSCM() {

    var phyUldSNo = $("#AirlineSNo").val();
    if (phyUldSNo == "") {
        ShowMessage('warning', 'Warning - Initiate UCM', "Airline not found.");
        return;
    }

    if (UCMBool == false && ($("#txtSI1").val() == "" && $("#txtSI2").val() != "")) {
        ShowMessage('warning', 'Warning - Initiate UCM', "Kindly enter Supplementary Information 1 before entering Supplementary Information 2");
        return;
    }

    if (UCMBool == false) {
        ShowMessage('warning', 'Warning - Initiate UCM', "Kindly generate UCM again.");
        return;
    }

    var k = ''; var L = '';
    for (var i = 0; i < $("ul#addlist li span").text().split(' ').length - 1; i++)
    { k = k + $("ul#addlist li span").text().split(' ')[i] + ','; }

    for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
    { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }

    $("#hdnadd").val(k.substring(0, k.length - 1));
    if ($("#addlist li").length > 0)
        $("#txtSita").removeAttr("data-valid");

    $("#hdnmail").val(L.substring(0, L.length - 1));
    if ($("#addlist1 li").length > 0)
        $("#txtEmail").removeAttr("data-valid");

    if ($("#msgSCM").val() == '') {
        ShowMessage('warning', 'Warning - Initiate UCM', "UCM not generated.");
        return;
    }

    if (($("#addlist1 li").length == 0) && ($("#addlist li").length == 0)) {
        ShowMessage('warning', 'Warning - Initiate UCM', "Kindly provide Email address or SITA address.");
        return;
    }

    else if (($("#addlist1 li").length > 0) || ($("#addlist li").length > 0)) {
        $.ajax({
            url: "./Services/Shipment/UCMService.svc/SaveUCM",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SitaAddress: $("#hdnadd").val(), EmailAddress: $("#hdnmail").val(), SCMMessage: $("#msgSCM").val() }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                if (result == 0) {
                    ShowMessage('success', 'Success - Initiate UCM', "UCM initiated successfully.");
                    $("#tblGeneratedSCM").data("kendoWindow").close();
                    //$("#txtSI1").val("");
                    //$("#txtSI2").val("");
                    $("#hdnadd").val("");
                    $("#hdnmail").val("");
                }
                else {
                    ShowMessage('warning', 'Warning - Initiate UCM', "UCM not Initiated.");
                    return;
                }
            }
        });
    }

}

function SavePallet() {

    var ULDType = $("#ULDType").val();
    var SerialNo = $("#SerialNo").val();
    var OwnerCode = $("#OwnerCode").val();
    var Destination = $("#Destination").val();

    if ($("#UCMType").val() == 1) {
        var Destination = "";

    }
    else {
        var Destination = $("#Destination").val();
    }

    if (ULDType == "" && SerialNo == "" && OwnerCode == "") {

        ShowMessage('warning', 'All fields are mandatory to add Base Pallet');
        return;
    }

    if (ULDType == "") {

        ShowMessage('warning', 'ULD Type is mandatory to add Base Pallet');
        return;
    }
    if (SerialNo == "") {

        ShowMessage('warning', 'Serial No is mandatory to add Base Pallet');
        return;
    }
    if (OwnerCode == "") {

        ShowMessage('warning', 'Owner Code is mandatory to add Base Pallet');
        return;
    }
    if ($("#UCMType").val() == 0) {

        if (Destination == "") {

            ShowMessage('warning', 'Destination is mandatory to add Base Pallet');
            return;
        }
    }

    if (pageType == "New") {
        var AirlineSNo = $("#AirlineSNo").val();
    }
    else { var AirlineSNo = $("#Text_FlightNo").val().substring(0, 2); }

    var FlightDate = $("#FlightDate").val();
    var FlightNo = $("#Text_FlightNo").val();
    var UCMType = $("#UCMType").val();

    if (AirlineSNo != "" && FlightNo != "" && FlightDate != "" && UCMType != "" && ULDType != "" && SerialNo != "" && OwnerCode != "") {
        var res = $("#tblUCM tr[id^='tblUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        getUpdatedRowIndex(res, 'tblUCM');
        var dataDetails = JSON.parse(($('#tblUCM').appendGrid('getStringJson')));

        var ULDNO = ULDType + SerialNo + OwnerCode;

        //var res1 = $("#tblattachedUCM tr[id^='tblattachedUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        //for (var i = 0; i < res1.length; i++) {
        //    if (!validateTableData("tblattachedUCM", res1[i])) {
        //        return false;
        //    }
        //}
        //getUpdatedRowIndex(res1, 'tblattachedUCM');
        //var data1 = JSON.parse(($('#tblattachedUCM').appendGrid('getStringJson')));

        var counter = 0;
        for (var i = 1; i < ($("tr[id^='tblattachedUCM']").length) + 1 ; i++) {
            var tutype = "#tblattachedUCM_EULDType_" + i;
            var ts = "#tblattachedUCM_ESerialNo_" + i;
            var to = "#tblattachedUCM_EOwnerCode_" + i;

            if ($(tutype).val() == ULDType.trim() && $(ts).val() == SerialNo && $(to).val() == OwnerCode.trim()) {
                counter = counter + 1;


                //   $(obj).val("");
            }

        }
        if (counter > 0) {
            ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);

            $("#Text_ULDType").val("");
            $("#SerialNo").val("");
            $("#OwnerCode").val("");
            $("#Text_OwnerCode").val("");
            $("#Destination").val("");
            $("#Text_Destination").val("");

            //$(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
            //$(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
            //$(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");
        }

        else {
            $.ajax({
                url: "./Services/Shipment/UCMService.svc/createUCMPallet", async: false, type: "POST", dataType: "json", cache: false,

                //data: JSON.stringify({ AirlineSNo: AirlineSNo, FlightDate: FlightDate, FlightNo: FlightNo, UCMType: UCMType, origincity: origincity, ULDType: ULDType, SerialNo: SerialNo, OwnerCode: OwnerCode, Destination: Destination, dataDetails: dataDetails }),

                data: JSON.stringify({ AirlineSNo: AirlineSNo, FlightDate: FlightDate, FlightNo: FlightNo, UCMType: UCMType, origincity: origincity, ULDType: ULDType, SerialNo: SerialNo, OwnerCode: OwnerCode, Destination: Destination }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result[0] == 1003) {

                        ShowMessage('info', '', "Base Pallet Already Exists");

                        //window.setTimeout(function () {
                        //    window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW';
                        //}, 2500);
                    }
                    if (result[0] == 1001) {

                        ShowMessage('info', '', "Duplicate Entry");

                        //window.setTimeout(function () {
                        //    window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW';
                        //}, 2500);
                    }
                    if (result[0] == 1005) {

                        ShowMessage('info', '', "ULD Stock does not exist");

                        //window.setTimeout(function () {
                        //    window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW';
                        //}, 2500);
                    }

                    if (result[0] == 1007) {

                        ShowMessage('info', '', "ULD Stock must exist in Inventory to be marked as UCM Out");

                        //window.setTimeout(function () {
                        //    window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW';
                        //}, 2500);
                    }
                    if (result[0] == 1008) {

                        //ShowMessage('info', '', "ULD Stock must exist in Inventory and Available");
                        ShowMessage('info', '', "ULD Stock already exists");

                        //window.setTimeout(function () {
                        //    window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW';
                        //}, 2500);
                    }
                    if (result[0] == 0) {

                        ShowMessage('success', '', "Base Pallet added successfully!");
                        $("#Text_ULDType").val("");
                        $("#SerialNo").val("");
                        $("#OwnerCode").val("");
                        $("#Text_OwnerCode").val("");
                        $("#Destination").val("");
                        $("#Text_Destination").val("");
                    }

                }
            });
        }


    }
    GetUCMPallet();
}


function checkInput(ob) {
    var invalidChars = /[^0-9]/gi
    if (invalidChars.test(ob.value)) {
        ob.value = ob.value.replace(invalidChars, "");
    }

}

function CheckSNo(obj) {

    if ($("#SerialNo").val().length < 4) {
        $("#SerialNo").val("");
        ShowMessage('warning', 'Need your Kind Attention!', 'Serial No. should be minimum 4 character.');
        return false;
    }

    if (parseInt($("#SerialNo").val()) == 0) {
        ShowMessage('warning', 'Need your Kind Attention!', 'Serial No. should not be ' + $(obj).val());
        $("#SerialNo").val("");
        return false;
    }
}

function GenerateCIMPMessage() {
    var fltno = $("#FlightNo").val();
    var fltdt = $("#FlightDate").val();

    var sub = 0;
    if ($("#UCMType").val() == 1) {
        sub = 0;
    }
    else if ($("#UCMType").val() == "INBOUND")
    { sub = 0; }
    else {
        sub = 1;
    }

    $.ajax({
        url: "./Services/Common/CommonService.svc/GenerateCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MessageType: "UCM", SerialNo: "", SubType: sub, flightNumber: fltno, flightDate: fltdt, OriginAirport: userContext.AirportCode, isDoubleSignature: false, version: "", nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: "" }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#msgSCM").val(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);
        }
    });

}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
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
                    ShowMessage('warning', 'Warning - UCM', "SITA Address already entered");
                    return;
                }
            }

            if ($("ul#addlist li").length < 35) {
                var listlen = $("ul#addlist li").length;
                $("ul#addlist").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;text-transform: uppercase'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
            }
            else {
                ShowMessage('warning', 'Warning - UCM', "Maximum 35 SITA Address allowed.");
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
                    ShowMessage('warning', 'Warning - UCM', "Maximum 3 E-mail Addresses allowed.");
                }
                $("#txtEmail").val('');
            }
            else {
                ShowMessage('warning', 'Warning - UCM', "Enter valid Email address.");
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


function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");
    if (textId.indexOf("Text_FlightNo") >= 0) {
        //var filterFlt = cfi.getFilter("AND");

        cfi.setFilter(filterEmbargo, "FlightDt", "eq", cfi.CfiDate("FlightDate"));
        cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());
        cfi.setFilter(filterEmbargo, "Bound", "eq", $("#Text_UCMType").data("kendoAutoComplete").key());
        var filterULD = cfi.autoCompleteFilter(filterEmbargo);
        return filterULD;
    }






    if (textId.indexOf("Text_OwnerCode") >= 0) {

        try {
            // Text_CarrierCode

            cfi.setFilter(filterEmbargo, "ULDName", "eq", $("#Text_ULDType").val());

            var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return ULDTypeAutoCompleteFilter;


        }
        catch (exp) { }
    }

    if (textId.indexOf("Text_Destination") >= 0) {

        try {
            // Text_CarrierCode
            cfi.setFilter(filterEmbargo, "FlightNo", "eq", $("#Text_FlightNo").val());
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", cfi.CfiDate("FlightDate"));
            cfi.setFilter(filterEmbargo, "DestinationAirportCode", "neq", origincity);
            var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return ULDTypeAutoCompleteFilter;
        }
        catch (exp) { }
    }
   


    //if (textId.indexOf("Text_ULDType") >= 0) {

    //    cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());

    //    var filterULD = cfi.autoCompleteFilter(filterEmbargo);
    //    return filterULD;
    //}



    //autocomplete on gid
    //UCM IN

    if ($("#UCMType").val() == 1) {

        var y = textId.split('_')[2];
        if (textId == "tblattachedUCM_ULDName_" + y) {
            cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", origincity);
            cfi.setFilter(filterEmbargo, "IsAvailable", "eq", 1);
            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
            return RegionAutoCompleteFilter;
        }
    }
    if ($("#UCMType").val() == 1) {

        var y = textId.split('_')[2];
        if (textId == "tblattachedUCM_ULDName_" + y) {
            cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", "");
            var values = ""
            $('input[type="text"][id^="tblattachedUCM_ULDName_"]').each(function () {
                values = values + ',' + $(this).val();
            });
            cfi.setFilter(filterEmbargo, "ULDNo", "notin", values);

            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
            return RegionAutoCompleteFilter;
        }
    }


    //if (textId == "tblattachedUCM_ULDName_" + textId.split('_')[2]) {
    //    var values = ""
    //    $('input[type="text"][id^="tblattachedUCM_ULDName_"]').each(function () {
    //        values = values + ',' + $(this).val();
    //    });
    //    cfi.setFilter(filterEmbargo, "ULDNo", "notin", values);

    //    var HAWBAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
    //    return HAWBAutoCompleteFilter;
    //}

    if ($("#UCMType").val() == "INBOUND") {
        var y = textId.split('_')[2];
        if (textId == "tblattachedUCM_ULDName_" + y) {
            cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", origincity);
            cfi.setFilter(filterEmbargo, "IsAvailable", "eq", 1);
            $('input[type="text"][id^="tblattachedUCM_ULDName_"]').each(function () {
                values = values + ',' + $(this).val();
            });
            cfi.setFilter(filterEmbargo, "ULDNo", "notin", values);

            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
            return RegionAutoCompleteFilter;
        }
    }
    if ($("#UCMType").val() == "INBOUND") {
        alert("ii");
        var y = textId.split('_')[2];
        if (textId == "tblattachedUCM_ULDName_" + y) {
            cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", "");
            $('input[type="text"][id^="tblattachedUCM_ULDName_"]').each(function () {
                values = values + ',' + $(this).val();
            });
            cfi.setFilter(filterEmbargo, "ULDNo", "notin", values);

            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
            return RegionAutoCompleteFilter;
        }
    }
    // UCM OUT
    if ($("#UCMType").val() == 0) {
        var y = textId.split('_')[2];
        if (textId == "tblattachedUCM_ULDName_" + y) {
            cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", origincity);
            cfi.setFilter(filterEmbargo, "IsAvailable", "eq", 1);
            $('input[type="text"][id^="tblattachedUCM_ULDName_"]').each(function () {
                values = values + ',' + $(this).val();
            });
            cfi.setFilter(filterEmbargo, "ULDNo", "notin", values);

            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
            return RegionAutoCompleteFilter;
        }
    }

    if ($("#UCMType").val() == "OUTBOUND") {
        var y = textId.split('_')[2];
        if (textId == "tblattachedUCM_ULDName_" + y) {
            cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", origincity);
            cfi.setFilter(filterEmbargo, "IsAvailable", "eq", 1);
            $('input[type="text"][id^="tblattachedUCM_ULDName_"]').each(function () {
                values = values + ',' + $(this).val();
            });
            cfi.setFilter(filterEmbargo, "ULDNo", "notin", values);

            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
            return RegionAutoCompleteFilter;
        }
    }
    var x = textId.split('_')[2];
    if (textId == "tblattachedUCM_BasePallet_" + x) {
        // cfi.setFilter(filterEmbargo, "OriginAirportCode", "eq", origincity);
        cfi.setFilter(filterEmbargo, "FlightDate", "eq", $("#FlightDate").val());
        cfi.setFilter(filterEmbargo, "FlightNo", "eq", $("#Text_FlightNo").val());
        cfi.setFilter(filterEmbargo, "City", "eq", origincity);
        cfi.setFilter(filterEmbargo, "Bound", "eq", $("#UCMType").val());
        cfi.setFilter
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
    if (textId == "tblattachedUCM_EOwnerCode_" + textId.split('_')[2]) {
        var a = "tblattachedUCM_EULDType_" + textId.split('_')[2];
        try {
            // Text_CarrierCode
            cfi.setFilter(filterEmbargo, "ULDName", "eq", $("#tblattachedUCM_EULDType_" + textId.split('_')[2]).val());
            var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
            return ULDTypeAutoCompleteFilter;
        }
        catch (exp) {
        }
    }

    /*if (textId == "tblattachedUCM_EULDType_" + textId.split('_')[2]) {
        try {
            // Text_CarrierCode
            if (pageType == "NEW") {
                cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());

                var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return ULDTypeAutoCompleteFilter;
            }
            else
            {
                cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#Text_FlightNo").val().substring(0,2));

                var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return ULDTypeAutoCompleteFilter;

            }

        }
        catch (exp) { }
    }

    if (textId == "Text_ULDType") {
        try {
            if (pageType == "NEW") {
                cfi.setFilter(filterEmbargo, "CarrierCode", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());

                var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return ULDTypeAutoCompleteFilter;
            }
            else {

                cfi.setFilter(filterEmbargo, "CarrierCode", "eq",$("#Text_FlightNo").val().substring(0,2));

                var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
                return ULDTypeAutoCompleteFilter;

            }

        }
        catch (exp) { }
    }*/


}

function GetUCM() {

    var AirlineSNo = $("#AirlineSNo").val();
    var FlightDate = $("#FlightDate").val();
    var FlightNo = $("#Text_FlightNo").val();
    var UCMType = $("#UCMType").val();
    if (AirlineSNo != "" && FlightNo != "" && FlightDate != "" && UCMType != "") {
        $("#Container").show();
        $("#divbutton").hide();

        cfi.AutoComplete("ULDType", "ULDName", "vuldtypename", "ULDName", "ULDName", ["ULDName"], null, "contains");

        cfi.AutoComplete("OwnerCode", "CarrierCode", "vwcarrier", "CarrierCode", "CarrierCode", ["CarrierCode"], null, "contains");

        cfi.AutoComplete("Destination", "DestinationAirportCode", "vwDestinationPallet", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");
        getUCMGrid();
        $.ajax({
            url: "./Services/Shipment/UCMService.svc/GetUCMDetailRecord",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AirlineSNo: AirlineSNo, FlightDate: FlightDate, FlightNo: FlightNo, UCMType: UCMType, origincity: origincity }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                $("#btnAdd").show();
                $('#tblUCM').appendGrid('load', dataTableobj.Table0);
                $("#divUCM").css("display", "block");
                GetUCMPallet();
                //var dataTableobj = JSON.parse(result);
                //if (dataTableobj.Table1[0].ucmcount > 0)
                //{
                //    ShowMessage('warning', 'Warning - UCM!', "UCM " + dataTableobj.Table1[0].UCMType + " Already Exists")
                //}
                //else
                //{
                //    $('#tblUCM').appendGrid('load', dataTableobj.Table0);
                //    $("#divUCM").css("display", "block");
                //}
                //if (dataTableobj.Table0 != undefined) {
                //    if (dataTableobj.Table0.length > 0) {
                //        $('#tblUCM').appendGrid('load', dataTableobj.Table0);
                //        $("#divUCM").css("display", "block");

                //    }
                //    else {
                //        $("#btnAdd").hide();
                //        ShowMessage('warning', 'Warning - UCM!', "Record Not Found!");
                //    }
                //}
                //else { ShowMessage('warning', 'Warning - UCM!', "Record Not Found!"); }

            },
            error: function (err) {
                alert("Generated Error");
            }
        });
    }
    else {
        $("#tblUCM").hide();
        ShowMessage('warning', 'Warning - UCM!', "All field are mandatory!")
    }
}
function getUCMGrid() {
    if (userContext.SpecialRights.UCM == false) {
        $("#tblUCM").appendGrid({
            tableID: "tblUCM",
            contentEditable: true,
            masterTableSNo: $("#hdnUCMSNo").val(),
            currentPage: 1,
            itemsPerPage: 5,
            whereCondition: null,
            sort: "",
            isGetRecord: true,
            servicePath: "./Services/Shipment/UCMService.svc",
            getRecordServiceMethod: (pageType != "NEW") ? "GetUCMSlabRecord" : "",
            deleteServiceMethod: "DeleteUCMSlabRecord",
            caption: '',
            captionTooltip: 'ULD Attached',
            initRows: 1,
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },

                       { name: 'ULDName', display: 'ULD Name', type: 'hidden', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 } },

                      { name: 'ULDName', display: 'ULD Name', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                      {
                          name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY', 3: 'MAIL' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: false, onChange: function (evt, rowIndex) {
                              ind = evt.target.id.split('_')[2];
                              var indexName = evt.target.id.split('_')[1];
                              var replacedID = (evt.target.id).replace(indexName, 'ULDName');
                              uldname[ind] = $("#" + replacedID).text();
                              content[ind] = $("#" + evt.target.id).val();
                          }
                      },
            ],
            isPaging: false,
            hideButtons: {
                insert: true,
                append: true,
                updateAll: true, remove: true,
                removeLast: true

            },
            //showButtons: {
            //    remove: true,
            //    removeLast: true
            //}
        });
    }

    else {
        $("#tblUCM").appendGrid({
            tableID: "tblUCM",
            contentEditable: true,
            masterTableSNo: $("#hdnUCMSNo").val(),
            currentPage: 1,
            itemsPerPage: 5,
            whereCondition: null,
            sort: "",
            isGetRecord: true,
            servicePath: "./Services/Shipment/UCMService.svc",
            getRecordServiceMethod: (pageType != "NEW") ? "GetUCMSlabRecord" : "",
            deleteServiceMethod: "DeleteUCMSlabRecord",
            caption: '',
            captionTooltip: 'ULD Attached',
            initRows: 1,
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },

                       { name: 'ULDName', display: 'ULD Name', type: 'hidden', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 } },

                      { name: 'ULDName', display: 'ULD Name', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                      {
                          name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY', 3: 'MAIL' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: false, onChange: function (evt, rowIndex) {
                              ind = evt.target.id.split('_')[2]; CARGO
                              var indexName = evt.target.id.split('_')[1];
                              var replacedID = (evt.target.id).replace(indexName, 'ULDName');
                              uldname[ind] = $("#" + replacedID).text();
                              content[ind] = $("#" + evt.target.id).val();
                          }
                      },
            ],
            isPaging: false,
            hideButtons:
            {
                insert: true,
                append: true,
                updateAll: true
            },
            showButtons:
            {
                remove: true,
                removeLast: true
            }
        });
    }


    if (pageType == "READ") {
        var totalrow = $("tr[id^='tblUCM_Row']").length;
        for (var i = 1; i < totalrow + 1; i++) {
            // $("#tblUCM_ContentType_" + i).attr("disabled", true);
        }
    }
}

var table1 = "VattachedULD";
var column1 = "ULDNo";
function AddAttachedUld() {
    if (uldname == '') {
        var totalrow = $("tr[id^='tblUCM_Row']").length
        for (var i = 1; i < totalrow + 1; i++) {
            uldname[i] = $("#tblUCM_ULDName_" + i).val().trim();
            content[i] = $("#tblUCM_ContentType_" + i).val();
        }
    }


    var totalrow = $("tr[id^='tblUCM_Row']").length;
    for (var i = 1; i < totalrow + 1; i++) {
        // $("#tblUCM_ContentType_" + i).attr("disabled", true);
    }

    if ($('#tblattachedUCM tr'))
        $("#btnAdd").hide();
    $("#divbutton").hide();
    if ($("#UCMType").val() == 1) {
        if (userContext.SpecialRights.UCM == false) {
            $('#tblattachedUCM').appendGrid({

                tableID: "tblattachedUCM",
                contentEditable: true,
                masterTableSNo: $("#hdnUCMSNo").val(),
                currentPage: 1,
                itemsPerPage: 5,
                whereCondition: null,
                sort: "",
                isGetRecord: true,
                servicePath: "./Services/Shipment/UCMService.svc",
                getRecordServiceMethod: (pageType != "NEW") ? "GetUCMattachdSlabRecord" : "",
                deleteServiceMethod: "DeleteUCMattachdRecord",
                caption: '',
                captionTooltip: 'ULD Attached',
                initRows: 1,
                columns: [{ name: 'SNo', type: 'hidden', value: 0 },

                          //{ name: 'ULDName', display: 'ULD Name', type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: table1, textColumn: column1, keyColumn: 'SNo', filterCriteria: "contains" },


                {
                    name: 'Options', display: 'ULD', type: 'div', isRequired: true, ctrlCss: { width: '30px' },
                    divElements:
                    [
                        {
                            divRowNo: 1,
                            name: 'ULDName', type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label', onSelect: "return CheckULDName(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: table1, textColumn: column1, keyColumn: 'SNo', filterCriteria: "contains"
                        },
                    {
                        divRowNo: 1, name: 'EULDType', display: 'ULD Code', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckEULDType(this);" }, ctrlCss: { width: '50px', height: '20px' }, tableName: 'vuldtypename', textColumn: 'ULDName', templateColumn: ["ULDName"], keyColumn: 'ULDName'
                    },

                     {
                         divRowNo: 1, name: 'ESerialNo', display: 'Serial No', type: 'text', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric', onBlur: "CheckSerialNo(this);CheckESerialNo(this);", onkeyup: "CheckESerialNo(this);", oninput: "this.value = this.value.replace(/[^0-9.]/g, '');" }, ctrlCss: { width: '60px', 'text-transform': 'uppercase' }
                     },

                      {
                          //divRowNo: 1, name: 'EOwnerCode', display: 'Owner Code', type: 'text', ctrlAttr: { maxlength: 3, controltype: 'alphanumericupper', onBlur: "CheckEOwnerCode(this);" }, ctrlCss: { width: '50px', 'text-transform': 'uppercase' }

                          divRowNo: 1, name: 'EOwnerCode', display: 'Owner Code', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckEOwnerCode(this);" }, ctrlCss: { width: '50px', height: '20px' }, tableName: 'vwcarrier', textColumn: 'CarrierCode', templateColumn: ["CarrierCode"], keyColumn: 'CarrierCode'

                      },
                    ]
                },
                        {
                            name: "BUPType", display: "BUP Type", type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'Connected', 1: 'Sandwich', 2: 'Stack' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false)
                        },
                        {
                            name: "BasePallet", display: "Base Pallet", type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label', onSelect: "return CheckBase(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: 'vULDPallet', textColumn: 'ULDNo', keyColumn: 'ULDNo', filterCriteria: "contains", addOnFunction: function (id, text, hdnid, key) {
                                var ind = $("#" + id).attr("id").split('_')[2];
                                var indexName = $("#" + id).attr("id").split('_')[1];
                                var replacedID = $("#" + id).attr("id").replace(indexName, 'ContentType');
                                var Base = text.trim();

                                var pos = getPosition(uldname, Base, ind);
                                $("#tblattachedUCM_ContentType_" + ind).val(content[pos]);
                            }
                        },
                        { name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY', 3: 'MAIL' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: false },
                         //{ name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY' }, ctrlCss: { width: '100px', height: '20px', disable: 'true' }, isRequired: false },

                ],
                afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                    var i = $("tr[id^='tblattachedUCM_Row']:last").attr('id').split("_")[2];
                    // $("#tblattachedUCM_ContentType_" + i).attr("disabled", true);
                    //  CheckNEWULD(this);
                },
                isPaging: false,
                hideButtons: {
                    remove: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                    removeLast: true,
                    insert: true,
                    append: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                    updateAll: true
                }

            });
        }
        else {
            $('#tblattachedUCM').appendGrid({

                tableID: "tblattachedUCM",
                contentEditable: true,
                masterTableSNo: $("#hdnUCMSNo").val(),
                currentPage: 1,
                itemsPerPage: 5,
                whereCondition: null,
                sort: "",
                isGetRecord: true,
                servicePath: "./Services/Shipment/UCMService.svc",
                getRecordServiceMethod: (pageType != "NEW") ? "GetUCMattachdSlabRecord" : "",
                deleteServiceMethod: "DeleteUCMattachdRecord",
                caption: '',
                captionTooltip: 'ULD Attached',
                initRows: 1,
                columns: [{ name: 'SNo', type: 'hidden', value: 0 },

                          //{ name: 'ULDName', display: 'ULD Name', type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: table1, textColumn: column1, keyColumn: 'SNo', filterCriteria: "contains" },


                {
                    name: 'Options', display: 'ULD', type: 'div', isRequired: true, ctrlCss: { width: '30px' },
                    divElements:
                    [
                        {
                            divRowNo: 1,
                            name: 'ULDName', type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label', onSelect: "return CheckULDName(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, tableName: table1, textColumn: column1, keyColumn: 'SNo', filterCriteria: "contains"
                        },



                    {
                        divRowNo: 1, name: 'EULDType', display: 'ULD Code', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckEULDType(this);" }, ctrlCss: { width: '50px', height: '20px' }, tableName: 'vuldtypename', textColumn: 'ULDName', templateColumn: ["ULDName"], keyColumn: 'ULDName'
                    },

                     {
                         divRowNo: 1, name: 'ESerialNo', display: 'Serial No', type: 'text', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric', onBlur: "CheckSerialNo(this);CheckESerialNo(this);", oninput: "this.value = this.value.replace(/[^0-9.]/g, '');" }, ctrlCss: { width: '60px', 'text-transform': 'uppercase' }
                     },

                      {
                          //divRowNo: 1, name: 'EOwnerCode', display: 'Owner Code', type: 'text', ctrlAttr: { maxlength: 3, controltype: 'alphanumericupper', onBlur: "CheckEOwnerCode(this);" }, ctrlCss: { width: '50px', 'text-transform': 'uppercase' }

                          divRowNo: 1, name: 'EOwnerCode', display: 'Owner Code', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckEOwnerCode(this);" }, ctrlCss: { width: '50px', height: '20px' }, tableName: 'vwcarrier', textColumn: 'CarrierCode', templateColumn: ["CarrierCode"], keyColumn: 'CarrierCode'

                      },
                    ]
                },


                        {
                            name: "BUPType", display: "BUP Type", type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'Connected', 1: 'Sandwich', 2: 'Stack' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false)

                        },
                        {


                            name: "BasePallet", display: "Base Pallet", type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label', onSelect: "return CheckBase(this);" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: 'vULDPallet', textColumn: 'ULDNo', keyColumn: 'ULDStockSNo', filterCriteria: "contains", addOnFunction: function (id, text, hdnid, key) {

                                var ind = $("#" + id).attr("id").split('_')[2];
                                var indexName = $("#" + id).attr("id").split('_')[1];
                                var replacedID = $("#" + id).attr("id").replace(indexName, 'ContentType');
                                var Base = text.trim();

                                var pos = getPosition(uldname, Base, ind);
                                $("#tblattachedUCM_ContentType_" + ind).val(content[pos]);
                            }
                        },
                        { name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY', 3: 'MAIL' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: false },
                         //{ name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY' }, ctrlCss: { width: '100px', height: '20px', disable: 'true' }, isRequired: false },
                ],
                afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                    var i = $("tr[id^='tblattachedUCM_Row']:last").attr('id').split("_")[2];
                    // $("#tblattachedUCM_ContentType_" + i).attr("disabled", true);
                    //  CheckNEWULD(this);
                },
                isPaging: false,
                hideButtons:
                    {
                        // remove: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                        //removeLast: true,
                        insert: true,
                        append: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                        updateAll: true
                    }
            });
        }
    }
    else {
        if (userContext.SpecialRights.UCM == false) {

            $('#tblattachedUCM').appendGrid({

                tableID: "tblattachedUCM",
                contentEditable: true,
                masterTableSNo: $("#hdnUCMSNo").val(),
                currentPage: 1,
                itemsPerPage: 5,
                whereCondition: null,
                sort: "",
                isGetRecord: true,
                servicePath: "./Services/Shipment/UCMService.svc",
                getRecordServiceMethod: (pageType != "NEW") ? "GetUCMattachdSlabRecord" : "",
                //getRecordServiceMethod: "GetUCMattachdSlabRecord",
                deleteServiceMethod: "DeleteUCMattachdRecord",
                caption: '',
                captionTooltip: 'ULD Attached',
                initRows: 1,
                columns: [{ name: 'SNo', type: 'hidden', value: 0 },

                          { name: 'ULDName', display: 'ULD Name', type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: 'vwuldstock', textColumn: 'ULDNo', keyColumn: 'ULDStockSNo', filterCriteria: "contains" },

                        {
                            name: "BUPType", display: "BUP Type", type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'Connected', 1: 'Sandwich', 2: 'Stack' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false)

                        },
                        {
                            name: "BasePallet", display: "Base Pallet", type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: 'vULDPallet', textColumn: 'ULDNo', keyColumn: 'ULDStockSNo', filterCriteria: "contains", addOnFunction: function (id, text, hdnid, key) {

                                var ind = $("#" + id).attr("id").split('_')[2];
                                var indexName = $("#" + id).attr("id").split('_')[1];
                                var replacedID = $("#" + id).attr("id").replace(indexName, 'ContentType');
                                var Base = text.trim();
                                var pos = getPosition(uldname, Base, ind);
                                $("#tblattachedUCM_ContentType_" + ind).val(content[pos]);
                            }
                        },
                        { name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY', 3: 'MAIL' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: false },
                         //{ name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY' }, ctrlCss: { width: '100px', height: '20px', disable: 'true' }, isRequired: false },
                ],
                afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                    var i = $("tr[id^='tblattachedUCM_Row']:last").attr('id').split("_")[2];
                    // $("#tblattachedUCM_ContentType_" + i).attr("disabled", true);
                },
                isPaging: false,
                hideButtons: {
                    remove: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                    removeLast: true,
                    insert: true,
                    append: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                    updateAll: true
                }

            });
        }
        else {

            $('#tblattachedUCM').appendGrid({

                tableID: "tblattachedUCM",
                contentEditable: true,
                masterTableSNo: $("#hdnUCMSNo").val(),
                currentPage: 1,
                itemsPerPage: 5,
                whereCondition: null,
                sort: "",
                isGetRecord: true,
                servicePath: "./Services/Shipment/UCMService.svc",
                getRecordServiceMethod: (pageType != "NEW") ? "GetUCMattachdSlabRecord" : "",
                deleteServiceMethod: "DeleteUCMattachdRecord",
                caption: '',
                captionTooltip: 'ULD Attached',
                initRows: 1,
                columns: [{ name: 'SNo', type: 'hidden', value: 0 },

                          { name: 'ULDName', display: 'ULD Name', type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: table1, textColumn: column1, keyColumn: 'SNo', filterCriteria: "contains" },

                          {
                              name: "BUPType", display: "BUP Type", type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'Connected', 1: 'Sandwich', 2: 'Stack' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false)
                          },
                        {
                            name: "BasePallet", display: "Base Pallet", type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: 'vULDPallet', textColumn: 'ULDNo', keyColumn: 'ULDStockSNo', filterCriteria: "contains", addOnFunction: function (id, text, hdnid, key) {

                                var ind = $("#" + id).attr("id").split('_')[2];
                                var indexName = $("#" + id).attr("id").split('_')[1];
                                var replacedID = $("#" + id).attr("id").replace(indexName, 'ContentType');
                                var Base = text.trim();

                                var pos = getPosition(uldname, Base, ind);
                                $("#tblattachedUCM_ContentType_" + ind).val(content[pos]);

                            }
                        },


                        { name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY', 3: 'MAIL' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: false },
                         //{ name: 'ContentType', display: 'Content', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'CARGO', 1: 'BAGGAGE', 2: 'EMPTY' }, ctrlCss: { width: '100px', height: '20px', disable: 'true' }, isRequired: false },
                ],
                afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                    var i = $("tr[id^='tblattachedUCM_Row']:last").attr('id').split("_")[2];
                    // $("#tblattachedUCM_ContentType_" + i).attr("disabled", true);
                },
                isPaging: false,
                hideButtons:
                {
                    // remove: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                    //removeLast: true,
                    insert: true,
                    append: (pageType == "NEW" || pageType == "EDIT" ? false : true),
                    updateAll: true
                }
            });
        }
    }
    $("#divbutton").show();
    if (pageType == "READ" || pageType == "DELETE") {
        var totalrow = $("tr[id^='tblattachedUCM_Row']").length;
        for (var i = 1; i < totalrow + 1; i++) {
            $("#tblattachedUCM_BUPType_" + i).attr("disabled", true);
        }
        $("#divbutton").hide();
    }
    if (pageType == "EDIT")
        $("#divbutton").hide();
}


function CheckNEWULD(obj) {

    var ULDType = $('input[type="text"][id^="tblattachedUCM_tblattachedUCM_EULDType_"]').val();
    var Serial = $('input[type="text"][id^="tblattachedUCM_tblattachedUCM_ESerialNo_"]').val();
    var Owner = $('input[type="text"][id^="tblattachedUCM_tblattachedUCM_EOwner_"]').val();

    $.ajax({
        url: "./Services/Shipment/UCMService.svc/CheckULDNo",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ ULDType: ULDType, Serial: Serial, Owner: Owner }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            if (result[0] > 0) {
                ShowMessage('warning', '', "ULD Already Exists");
            }
        },
        error: function (err) {
        }
    });

}



function CheckEULDType(obj) {
    var fltno = $("#FlightNo").val();
    var fltdt = $("#FlightDate").val();

    var sub = 1;
    if ($("#UCMType").val() == 1) {
        sub = 1;
    }
    else if ($("#UCMType").val() == "INBOUND")
    { sub = 0; }
    else {
        sub = 0;
    }

    if ($(obj).val() != "") {

        $(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").val("");
        $(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").removeAttr("required").css("cursor", "auto");


        $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").attr("required", "required").css("cursor", "auto");
        // $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").focus();
        $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").attr("required", "required").css("cursor", "auto");


        var ULDType = $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val();
        var Serial = $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val() == "" ? 0 : $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val();
        var Owner = $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val();
        var ULDNO = ULDType + Serial + Owner;
        //var explode = function () {
        //    ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);
        //};

        $.ajax({
            url: "./Services/Shipment/UCMService.svc/CheckULDNo",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ULDType: ULDType, Serial: Serial, Owner: Owner, UCMtype: sub, FlightNo: fltno, flightdate: fltdt, origincity: origincity }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                if (result[0] > 0) {
                    ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);

                    //setTimeout("ShowMessage('warning', '', 'ULD Already Exists - ' + ULDNO);",1000);
                    // setTimeout(explode, 5000);

                    $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
                    $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
                    $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");


                }
            },
            error: function (err) {

            }
        });
        //CheckPrevULD(ULDNO);

        var counter = 0;
        for (var i = 1; i < ($("tr[id^='tblattachedUCM']").length) + 1 ; i++) {
            var tutype = "#tblattachedUCM_EULDType_" + i;
            var ts = "#tblattachedUCM_ESerialNo_" + i;
            var to = "#tblattachedUCM_EOwnerCode_" + i;
            var uld = "#tblattachedUCM_ULDName_" + i;
            if ($(uld).val().trim() == ULDNO) {
                counter = counter + 1;
            }
            else {
                if ($(tutype).val() == ULDType.trim() && $(ts).val() == Serial && $(to).val() == Owner.trim()) {

                    counter = counter + 1;


                    //   $(obj).val("");
                }
            }

        }
        if (counter > 1) {
            ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);

            $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
            $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
            $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");
        }



    }
}


function CheckESerialNo(obj) {

    var fltno = $("#FlightNo").val();
    var fltdt = $("#FlightDate").val();

    var sub = 1;
    if ($("#UCMType").val() == 1) {
        sub = 1;
    }
    else if ($("#UCMType").val() == "INBOUND")
    { sub = 0; }
    else {
        sub = 0;
    }


    if ($(obj).val() != "") {

        $(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").val("");
        $(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").removeAttr("required").css("cursor", "auto");

        $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").attr("required", "required").css("cursor", "auto");
        // $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").focus();
        $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").attr("required", "required").css("cursor", "auto");


        var ULDType = $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val();
        var Serial = $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val() == "" ? 0 : $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val();
        var Owner = $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val();
        var ULDNO = ULDType + Serial + Owner;
        //var explode = function () {
        //    ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);
        //};

        $.ajax({
            url: "./Services/Shipment/UCMService.svc/CheckULDNo",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ULDType: ULDType, Serial: Serial, Owner: Owner, UCMtype: sub, FlightNo: fltno, flightdate: fltdt, origincity: origincity }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                if (result[0] > 0) {

                    ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);

                    //setTimeout("ShowMessage('warning', '', 'ULD Already Exists - ' + ULDNO);",1000);
                    // setTimeout(explode, 5000);

                    $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
                    $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
                    $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");


                }
            },
            error: function (err) {

            }
        });
        //CheckPrevULD(ULDNO);

        var counter = 0;
        for (var i = 1; i < ($("tr[id^='tblattachedUCM']").length) + 1 ; i++) {
            var tutype = "#tblattachedUCM_EULDType_" + i;
            var ts = "#tblattachedUCM_ESerialNo_" + i;
            var to = "#tblattachedUCM_EOwnerCode_" + i;
            var uld = "#tblattachedUCM_ULDName_" + i;
            if ($(uld).val().trim() == ULDNO) {
                counter = counter + 1;
            }
            else {
                if ($(tutype).val() == ULDType.trim() && $(ts).val() == Serial && $(to).val() == Owner.trim()) {

                    counter = counter + 1;


                    //   $(obj).val("");
                }
            }

        }
        if (counter > 1) {
            ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);

            $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
            $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
            $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");
        }



    }
}



function CheckBase(obj) {
    if ($(obj).val() != "") {
        if ($(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").val() == $(obj).val()) {
            ShowMessage('warning', 'Entered ULD or Base pallet cannot be same');
            $(obj).val("");
        }
    }

}





function CheckEOwnerCode(obj) {
    var fltno = $("#FlightNo").val();
    var fltdt = $("#FlightDate").val();

    var sub = 1;
    if ($("#UCMType").val() == 1) {
        sub = 1;
    }
    else if ($("#UCMType").val() == "INBOUND")
    { sub = 0; }
    else {
        sub = 0;
    }


    if ($(obj).val() != "") {

        $(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").val("");
        $(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").removeAttr("required").css("cursor", "auto");



        $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").attr("required", "required").css("cursor", "auto");
        //  $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").focus();
        $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").attr("required", "required").css("cursor", "auto");



        var ULDType = $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val();
        var Serial = $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val() == "" ? 0 : $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val();
        var Owner = $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val();
        var ULDNO = ULDType + Serial + Owner;
        //var explode = function () {
        //    ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);
        //};

        $.ajax({
            url: "./Services/Shipment/UCMService.svc/CheckULDNo",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ULDType: ULDType, Serial: Serial, Owner: Owner, UCMtype: sub, FlightNo: fltno, flightdate: fltdt, origincity: origincity }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                if (result[0] > 0) {


                    ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);


                    //setTimeout("ShowMessage('warning', '', 'ULD Already Exists - ' + ULDNO);",1000);
                    // setTimeout(explode, 5000);

                    $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
                    $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
                    $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");


                }
            },
            error: function (err) {

            }
        });
        //CheckPrevULD(ULDNO);

        var counter = 0;
        for (var i = 1; i < ($("tr[id^='tblattachedUCM']").length) + 1 ; i++) {
            var tutype = "#tblattachedUCM_EULDType_" + i;
            var ts = "#tblattachedUCM_ESerialNo_" + i;
            var to = "#tblattachedUCM_EOwnerCode_" + i;
            var uld = "#tblattachedUCM_ULDName_" + i;
            if ($(uld).val().trim() == ULDNO) {
                counter = counter + 1;
            }
            else {
                if ($(tutype).val() == ULDType.trim() && $(ts).val() == Serial && $(to).val() == Owner.trim()) {

                    counter = counter + 1;


                    //   $(obj).val("");
                }
            }

        }
        if (counter > 1) {
            ShowMessage('warning', '', "ULD Already Exists - " + ULDNO);

            $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
            $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
            $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");
        }



    }

}

function CheckULDName(obj) {
    if ($(obj).val() != "") {

        $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").val("");
        $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").val("");
        $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").val("");



        $(obj).closest("tr").find("input[id^='tblattachedUCM_EULDType']").removeAttr("required").css("cursor", "auto");
        $(obj).closest("tr").find("input[id^='tblattachedUCM_ESerialNo']").removeAttr("required").css("cursor", "auto");
        $(obj).closest("tr").find("input[id^='tblattachedUCM_EOwner']").removeAttr("required").css("cursor", "auto");


        //$(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnMovableLocation']").val("0");

        //if ($(obj).val() == "" && $(obj).closest("tr").find("input[id^='tblFAULDLocation_MovableLocation']").val() == "") {
        //    $(obj).closest("tr").find("input[id^='tblFAULDLocation_HdnLocation']").attr("required", "required").css("cursor", "auto");
        //    $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").attr("required", "required").css("cursor", "auto");
        //    $(obj).closest("tr").find("input[id^='tblFAULDLocation_Location']").focus();


    }
    else {
        $(obj).closest("tr").find("input[id^='tblattachedUCM_ULDName']").removeAttr("required").css("cursor", "auto");



    }
}


function getPosition(arrayName, arrayItem, index) {
    for (var i = 0; i < arrayName.length; i++) {
        if (arrayName[i] == arrayItem) {
            $("#tblattachedUCM_ContentType_" + index).val(content[i]);
            return i;
        }
    }
}

function SaveUCM() {

    var rows = $("tr[id^='tblattachedUCM']").map(function () { return $(this).attr("id").split('_')[2]; }).get();

    getUpdatedRowIndex(rows.join(","), "tblattachedUCM");
    if (!validateTableData("tblattachedUCM", rows)) {
        return false;
    }
    var AirlineSNo = $("#AirlineSNo").val();
    var FlightDate = $("#FlightDate").val();
    var FlightNo = $("#Text_FlightNo").val();
    var UCMType = $("#UCMType").val();
    if (AirlineSNo != "" && FlightNo != "" && FlightDate != "" && UCMType != "") {
        var res = $("#tblUCM tr[id^='tblUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        getUpdatedRowIndex(res, 'tblUCM');
        var dataDetails = JSON.parse(($('#tblUCM').appendGrid('getStringJson')));


        var res1 = $("#tblattachedUCM tr[id^='tblattachedUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        for (var i = 0; i < res1.length; i++) {
            if (!validateTableData("tblattachedUCM", res1[i])) {
                return false;
            }
        }
        getUpdatedRowIndex(res1, 'tblattachedUCM');
        var data1 = JSON.parse(($('#tblattachedUCM').appendGrid('getStringJson')));

        //var dataDetails = [];
        //dataDetails.push(data);

        //if (dataDetails != false || data1 != false) {
        $.ajax({
            url: "./Services/Shipment/UCMService.svc/createUCM", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify(dataDetails),
            data: JSON.stringify({ AirlineSNo: AirlineSNo, FlightDate: FlightDate, FlightNo: FlightNo, UCMType: UCMType, origincity: origincity, dataDetails: dataDetails, data1: data1 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result[0] == 0) {

                    ShowMessage('success', '', "UCM Saved Successfully");
                    //   navigateUrl('Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW');
                    window.setTimeout(function () {
                        window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW';
                    }, 2500);
                }

                else if (result[0] == 1001) {
                    ShowMessage('warning', '', "Duplicate Entry");
                    window.setTimeout(function () {
                        window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=NEW';
                    }, 2500);
                }
                else if (result[0] == 1003) {
                    ShowMessage('warning', '', "ULD Already Exists");
                    //window.setTimeout(function () {
                    //    window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=NEW';
                    //}, 2500);
                }


                else {
                    ShowMessage('warning', '', result[1]);
                    window.setTimeout(function () {
                        window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=NEW';
                    }, 2500);
                    return;
                }
            }
        });
        //     }
    }
}

var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};

function SaveNewUCM() {
    var AirlineSNo = $("#AirlineSNo").val();
    var FlightDate = $("#FlightDate").val();
    var FlightNo = $("#Text_FlightNo").val();
    var UCMType = $("#UCMType").val();
    if (AirlineSNo != "" && FlightNo != "" && FlightDate != "" && UCMType != "") {

        var res = $("#tblUCM tr[id^='tblUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        getUpdatedRowIndex(res, 'tblUCM');
        var dataDetails = JSON.parse(($('#tblUCM').appendGrid('getStringJson')));


        var res1 = $("#tblattachedUCM tr[id^='tblattachedUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        for (var i = 0; i < res1.length; i++) {
            if (!validateTableData("tblattachedUCM", res1[i])) {
                return false;
            }
        }
        getUpdatedRowIndex(res1, 'tblattachedUCM');
        var data1 = JSON.parse(($('#tblattachedUCM').appendGrid('getStringJson')));



        if (dataDetails != false || data1 != false) {
            $.ajax({
                url: "./Services/Shipment/UCMService.svc/createUCM", async: false, type: "POST", dataType: "json", cache: false,
                //data: JSON.stringify(dataDetails),
                data: JSON.stringify({ AirlineSNo: AirlineSNo, FlightDate: FlightDate, FlightNo: FlightNo, UCMType: UCMType, origincity: origincity, dataDetails: dataDetails, data1: data1 }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result[0] == 0) {

                        ShowMessage('success', '', "UCM Saved Successfully");
                        // navigateUrl('Default.cshtml?Module=Shipment&Apps=UCM&FormAction=NEW');
                        window.setTimeout(function () {
                            window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=NEW';
                        }, 2500);
                    }
                    else if (result[0] == 1001) {
                        ShowMessage('warning', '', "Duplicate Entry");
                        window.setTimeout(function () {
                            window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=NEW';
                        }, 2500);
                    }
                    else {
                        ShowMessage('warning', '', result[1]);
                        window.setTimeout(function () {
                            window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=NEW';
                        }, 2500);
                        return;
                    }
                }
            });
        }
    }

}

function UpdateUCM() {
    var rows = $("tr[id^='tblattachedUCM']").map(function () { return $(this).attr("id").split('_')[2]; }).get();

    getUpdatedRowIndex(rows.join(","), "tblattachedUCM");
    if (!validateTableData("tblattachedUCM", rows)) {
        return false;
    }
    if (cfi.IsValidSubmitSection()) {
        var AirlineSNo = $("#AirlineSNo").val();
        var FlightDate = $("#FlightDate").val();
        var FlightNo = $("#Text_FlightNo").val();
        var UCMType = $("#UCMType").val();
        if (AirlineSNo != "" && FlightNo != "" && FlightDate != "" && UCMType != "") {
            var res = $("#tblUCM tr[id^='tblUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
            getUpdatedRowIndex(res, 'tblUCM');
            var dataDetails = JSON.parse(($('#tblUCM').appendGrid('getStringJson')));


            var res1 = $("#tblattachedUCM tr[id^='tblattachedUCM']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
            getUpdatedRowIndex(res1, 'tblattachedUCM');
            var data1 = JSON.parse(($('#tblattachedUCM').appendGrid('getStringJson')));

            //var dataDetails = [];
            //dataDetails.push(data);

            if (dataDetails != false || data1 != false) {
                $.ajax({
                    url: "./Services/Shipment/UCMService.svc/UpdateUCM", async: false, type: "POST", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ SNo: $("#hdnUCMSNo").val(), AirlineSNo: AirlineSNo, FlightDate: FlightDate, FlightNo: FlightNo, UCMType: UCMType, origincity: origincity, dataDetails: dataDetails, data1: data1 }),
                    success: function (result) {
                        if (result == 0) {

                            ShowMessage('success', '', "UCM updated Successfully");
                            window.setTimeout(function () {
                                window.location.href = 'Default.cshtml?Module=Shipment&Apps=UCM&FormAction=INDEXVIEW';
                            }, 500);
                        }
                        else {
                            return;
                        }
                    }
                });
            }
        }
    }
}
