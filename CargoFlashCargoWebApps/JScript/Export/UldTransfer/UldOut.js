/// <reference path="../../../Scripts/references.js" />
var Default = 0;
var Dynamic = 0;
var TransferBy = "";
var RowIndex = 0;
var SstrData = [];
var CreateUld = [];
var data = "";
var userContextAirlineSNo = "";
var userContextAirlineName = "";

$(function () {

    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/UldOut.html',
        success: function (result) {
            $("body").html(result).append(footer);
            PageLoaded();
            PageRightsCheck()
        }
    });


});
function RentaldaysNumaric(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^0|[1-9]\d*$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}
function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^0|[1-9]\d*$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

//$('#one, #two, #three').bind('keyup', function (e) {

//});

//$(document).on('keyup', '#txt_OwnerCode', function (e) {

//});
$(document).on('keyup', '#txt_OwnerCode', function (e) {
    $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
    if (e.which >= 97 && e.which <= 122) {
        var newKey = e.which - 32;
        e.keyCode = newKey;
        e.charCode = newKey;
    }
    $(this).val(($(this).val()).toUpperCase());
    if ($(this).val().trim().toUpperCase() == userContext.AirlineCarrierCode.split("-")[0].trim().toUpperCase()) {
        ShowMessage('info', 'Need your Kind Attention!', " " + userContext.AirlineCarrierCode.split("-")[0].trim().toUpperCase() + " can not be used as owner code.");
        $("#txt_OwnerCode").val("");
    }
});
$(document).on('keyup', '#Text_UCRCarrierCode', function (e) {
    $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
    if (e.which >= 97 && e.which <= 122) {
        var newKey = e.which - 32;
        e.keyCode = newKey;
        e.charCode = newKey;
    }
});
$(document).on('keyup', '#Text_UCRNumber', function (e) {
    $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
    if (e.which >= 97 && e.which <= 122) {
        var newKey = e.which - 32;
        e.keyCode = newKey;
        e.charCode = newKey;
    }
});
//$(document).on('load', '#Text_IssuedDate', function (e)
//{
//    var dateEntered = $("#Text_IssuedDate").val();

//    var date = dateEntered.substring(0, 2);
//    var month = dateEntered.substring(3, 5);
//    var year = dateEntered.substring(6, 10);

//    var dateToCompare = new Date(year, month - 1, date);
//    var currentDate = new Date();

//    if (dateToCompare > currentDate) {
//        alert("Date Entered is greater than Current Date ");
//    }
//    else {
//        alert("Date Entered is lesser than Current Date");
//    }
//});
$(document).on('click', '#AirlineWiseUld', function () {
    var ULDNumber = $("#ULDNumber").val();

    if ($("#AirlineWiseUld").is(":checked")) {
        $("#AirlineWiseUld").attr("disabled", true)
        if (ULDNumber != "") {
            $("#AirlineWiseUld").attr("checked", false)

        } else {
            $("#AirlineWiseUld").attr("checked", true)
        }
    } else {
        $("#AirlineWiseUld").attr("disabled", false)
        if (ULDNumber != "") {
            $("#AirlineWiseUld").attr("checked", true)


        } else {
            $("#AirlineWiseUld").attr("checked", false)
        }
    }

    if ($("#AirlineWiseUld").is(":checked")) {
        $("#Text_IssuedDate").val("")
        $("#Text_IssuedDate").kendoDatePicker();
        var todaydate = new Date();
        var validTodate = $("#Text_IssuedDate").data("kendoDatePicker");
        validTodate.min(todaydate);
        data = [{ Key: "2", Text: "Airline" },];//,{ Key: "3", Text: "Agent" }
        cfi.AutoCompleteByDataSource("IssuedTo", data, Clear, null);
    } else {
        data = [{ Key: "2", Text: "Airline" }, { Key: "0", Text: "Forwarder" }, { Key: "1", Text: "Shipper" },];//,{ Key: "3", Text: "Agent" }
        cfi.AutoCompleteByDataSource("IssuedTo", data, Clear, null);
        $("#Text_IssuedDate").val("")
        $("#Text_IssuedDate").kendoDatePicker();

    }
});
function validateOwnerCode(evt) {


}
function UldNumberCheck(Ocode, ULDNo, ULDType) {

    $.ajax({
        url: "./Services/Export/UldTransfer/UldOutService.svc/UldNumberCheck?ULDType=" + ULDType + "&Ocode=" + Ocode + "&ULDNumber=" + ULDNo,
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var data = jQuery.parseJSON(response);
            if (data.Table0.length != "0") {
                ShowMessage('info', 'Need your Kind Attention!', "Uld number already Exists!");
                $("#txt_UldNumber").val('')
            }
        }
    });

}
function ChangeUldNumberCheck(thisg) {

    var Uld = $(thisg).val()
    if (Uld.length <= 4) {
        ShowMessage('info', 'ULD Serial No must have minimum 5 characters.');
        $("#txt_UldNumber").val('')
        return
    }
    // UldNumberCheck(Uld)

}
function ChangeOwnerCodeCheck(thish) {
    var ULDNo = $("#txt_UldNumber").val();
    var Ocode = $(thish).val();
    var ULDType = $("#Text_UldType").val();
    UldNumberCheck(Ocode, ULDNo, ULDType);
}
var CheckUldNumber = "";
function btnSubmit() {

    var listlen = $("ul#addlist1 li").length;
    var CheckUld = "";
    var txt_UldNumber = $("#txt_UldNumber").val();
    if (listlen > 0) {
        for (var i = 0; i < listlen; i++) {
            var Id = parseInt(i) + 1
            CheckUld = $("#CreateUld-" + Id).text() == "" ? "" : $("#CreateUld-" + Id).text()
            if (CheckUld != "") {
                var SpiltULD = CheckUld.split("-")
                if (SpiltULD[1] == txt_UldNumber) {
                    ShowMessage('info', 'Need your Kind Attention!', "Uld number already Exists!");
                    $("#txt_UldNumber").val('')
                    return
                }
            }
        }

    }
    if ($("#txt_UldNumber").val() != "" && $("#txt_OwnerCode").val() != "" && $("#Text_UldType").val() != "") {
        var ULDType = $("#Text_UldType").val().split('-');
        var addlen = ULDType[0] + "" + $("#txt_UldNumber").val() + "" + $("#txt_OwnerCode").val();

        var CreateUld = $("#UldType").val() + "-" + $("#txt_UldNumber").val() + "-" + $("#txt_OwnerCode").val();



        //      CheckUldNumber += $("#txt_UldNumber").val() + ",";

        var finalValue = addlen;
        var listlen = $("ul#addlist1 li").length;
        $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;text-transform: uppercase'><span id='listadd'>" + finalValue
            + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span><span style='display:none' id='CreateUld-" + (parseInt(listlen) + 1) + "'>" + CreateUld + " </span></li>");
        $("body").on("click", ".remove", function () {
            $(this).closest("li").remove();
            DefaultAppend(Default, "")
        });
        $("#UldType").val('');
        $("#txt_UldNumber").val('')
        $("#txt_OwnerCode").val('')
        $("#Text_UldType").val('')

        DefaultAppend(Default, "")

    }
}
function PageLoaded() {
    // txt_OwnerCode = txt_OwnerCode.replace(new RegExp("/", "g"), "");
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        async: true,
        url: "./Services/Export/UldTransfer/UldOutService.svc/GetPageGrid",
        success: function (response) {
            $("#divMainGrid").html(response);
            // $(".k-grid").closest("table").find("tr:eq(1)").hide();

        }
    });
    userContextAirlineSNo = userContext.AirlineSNo;
    userContextAirlineName = userContext.AirlineCarrierCode;
}
/// Sushant
function PopUpOnOpen(cntrlId) {
    return false;
}
function PopUpOnClose(cntrlId) {

    AddDamageCondition()
}
function UldAddMore(a, b) {

    if ($('.Process:checked').val() == "0") {
        Dynamic += 1;
        var ULDNumber = $("#Multi_ULDNumber").val();
        DynamicAppend(Dynamic, ULDNumber);
    } else {
        //alert(EditSNo)
        Default += 1;
        var ULDNumber = $("#Multi_ULDNumber").val();
        DefaultAppend(Default, ULDNumber)

    }

    setTimeout(function () {
        AddDamageCondition()
    }, 500)



}
function DynamicAppend(Dynamic, ULDNumber) {


    if (ULDNumber != "" && ULDNumber != undefined) {
        $("#DivAddMultipleUldAdd").append("<div id='DivAddMultipleUldPopup'></div>")
        $("#DivAddMultipleUldPopup").html('<center><table id="tblAddMultipleUldAdd" style="width:95%;"></tr></table><div><input type="button" value="OK" onclick="ClosePopo()"></div><center>');
        AddDamageDescription(ULDNumber)
        if (Dynamic != 0) {
            cfi.PopUp("DivAddMultipleUldAdd", "ULD", 500, null, PopUpOnClose, 10);
            $("#DivAddMultipleUldPopup").show()
        } else {
            $("#DivAddMultipleUldPopup").hide()
        }
    }
}
function DefaultAppend(Default, ULDNumber) {


    if (ULDNumber == "") {
        $("#DivAddMultipleUldAdd").append("<div id='DivAddMultipleUldPopup'></div>")
        $("#DivAddMultipleUldPopup").html('<center><table id="tblAddMultipleUldAdd" style="width:95%;"></tr></table><div><input type="button" value="OK" onclick="ClosePopo()"></div><center>');
        if (Default != "0") {
            cfi.PopUp("DivAddMultipleUldAdd", "ULD", 500, null, PopUpOnClose, 10);
            $("#DivAddMultipleUldPopup").show()
        } else {
            $("#DivAddMultipleUldPopup").hide()
        }
        var Uld = "";
        var CreateUld = "";
        $("ul[id^='addlist1']").each(function (row, li) {
            Uld += $(li).find("span[id^='listadd']").text();
            CreateUld += $(li).find("span[id^='CreateUld']").text();
        });

        var dSplituld = Uld.split(' ');
        var SCreateUld = CreateUld.split(' ')
        var Tbl = "<table class='WebFormTable' id='MenualtblAddDamaged' validateonsubmit='true'> <tr><td class='formthreeInputcolumn'>ULD Number</td><td class='formthreeInputcolumn'>Damaged</td><td class='formthreeInputcolumn'>Remarks</td></tr>"
        for (var I = 0; I < dSplituld.length; I++) {
            if (dSplituld[I] != "") {
                Tbl += "<tr><td class='formthreeInputcolumn'><span rel='span' style='text-transform: uppercase' name='Uldnumber" + I + "' id='Uldnumber" + I + "'>" + dSplituld[I] + "</span><input type='hidden' name='Uldsno" + I + "' value=" + SCreateUld[I] + " id='Uldsno" + I + "'></td>";
                Tbl += "<td class='formthreeInputcolumn'> <input type='checkbox' value='0' name='Damaged" + I + "' onchange='OnchageRemarks(this," + I + ")' id='Damaged" + I + "'></td> ";
                Tbl += "<td class='formthreeInputcolumn'><input type='text' id='Text_DamageCondition" + I + "' onkeyup='OnchageDamageCondition(this," + I + ")' style='width:160px'  data-valid='' data-valid-msg=''  name='Text_DamageCondition" + I + "' /></td></tr>";
            }
        }
        $("#tblAddMultipleUldAdd").append(Tbl)
    } else {
        $("#tblAddMultipleUldAdd").html("")
        AddDamageDescription(ULDNumber)
        if (Default != 0) {
            cfi.PopUp("DivAddMultipleUldAdd", "ULD", 500, null, PopUpOnClose, 10);
            $("#DivAddMultipleUldPopup").show()
        } else {
            $("#DivAddMultipleUldPopup").hide()
        }
    }


}
function ProcessChenges(thisval) {

    Default = 0;
    Dynamic = 0;

    if ($(thisval).val() == "1") {
        $("#trInBound").show()
        $("#trOutBound").hide()
        $("#Text_TransferBy").val("");
        $("#TransferBy").val("");
        $("#Text_ReceivedBy").val(userContextAirlineName);
        $("#Text_ReceivedBy").data("kendoAutoComplete").enable(false);
        $("#Text_TransferBy").data("kendoAutoComplete").enable(true);
        $("#ReceivedBy").val(userContextAirlineSNo);
        $("#Text_ULDNumber").removeAttr("data-valid")
        $('#Text_IssuedBy').html(userContext.UserName)
        $('#Text_IssuedBy').css('text-transform', 'uppercase')
        $("#Text_TransferPoint").text(userContext.AirportCode);
        $("#PText_Location").text(userContext.CityCode);
        $("#capissuedate").html("Received Date")
        $("#capissuetime").html("Received Time")
        $("#capissueto").html("Received From")
        $("#txt_UldNumber").attr("disabled", false)
        $("#txt_OwnerCode").attr("disabled", false)
        $("#DivUCR").html("")
        $("#DivUCR").append('<input type="text" name="Text_UCRCarrierCode" data-valid="maxlength[3],minlength[3],required,Number" controltype="0123456789" style="width:30px;" size="3" maxlength="3" data-valid-msg="Enter Carrier Code.Minimum 3 character" id="Text_UCRCarrierCode"><span style="font-size:large">-</span><input type="text" name="Text_UCRNumber" onkeyup="DupicateCheckUCRNumber(this)" data-valid="maxlength[8],minlength[5],required,Number" style="width:80px;" size="8" maxlength="8" data-valid-msg="Enter UCR Number.Minimum 5 & Maximum 8 character" id="Text_UCRNumber">')
        $("#divucrlbl").css("display", "block")
        //   NewClick(EditSNo, "")

        data = [{ Key: "2", Text: "Airline" },];//,{ Key: "3", Text: "Agent" }
        cfi.AutoCompleteByDataSource("IssuedTo", data, Clear, null);
        $("#OtherAirlineULD").hide()


    } else if ($(thisval).val() == "0") {
        $("#Text_ULDNumber").attr("data-valid", "requird")
        $("#trInBound").hide()
        $("#trOutBound").show()
        $("#Text_ReceivedBy").val("");
        $("#ReceivedBy").val("");
        $("#Text_TransferBy").val(userContextAirlineName);
        $("#Text_TransferBy").data("kendoAutoComplete").enable(false);
        $("#TransferBy").val(userContextAirlineSNo);
        $("#capissuedate").html("Issue Date")
        $("#capissuetime").html("Issue Time")
        $("#capissueto").html("Issue To")
        NewClick(EditSNo, "")
        $("#DivUCR").html("")
        $("#divucrlbl").css("display", "none")
        data = [{ Key: "2", Text: "Airline" }, { Key: "0", Text: "Forwarder" }, { Key: "1", Text: "Shipper" },];//,{ Key: "3", Text: "Agent" }
        cfi.AutoCompleteByDataSource("IssuedTo", data, Clear, null);
        $("#OtherAirlineULD").show()
    }






}
function AddDamageDescription(ULDNumber) {

    var Tbl = ""
    $.ajax({
        url: "./Services/Export/UldTransfer/UldOutService.svc/AddDamageDescription?ULDNumber=" + ULDNumber,
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var data = jQuery.parseJSON(response);

            Tbl1 = "<tr><td class='formthreeInputcolumn'>ULD Number</td><td class='formthreeInputcolumn'>Damaged</td><td class='formthreeInputcolumn'>Remarks</td></tr>"
            if (data.Table0.length > "0") {
                for (var I = 0; I < data.Table0.length; I++) {
                    var item = IsDamaged(data.Table0[I].ULDStockSNo);
                    var checked = ""
                    var remarks = "";
                    var IsDamagedVal = 0;
                    if (item && item.length > 0) {
                        remarks = item[0].uldremarks;
                        IsDamagedVal = 1;
                        checked = "checked='checked'"
                    }

                    Tbl += "<tr><td class='formthreeInputcolumn'><span rel='span' name='Uldnumber" + I + "' id='Uldnumber" + I + "'>" + data.Table0[I].ULDNo + "</span><input type='hidden' name='Uldsno" + I + "' value=" + data.Table0[I].ULDStockSNo + " id='Uldsno" + I + "'></td>";
                    Tbl += "<td class='formthreeInputcolumn'> <input type='checkbox' " + checked + "  onchange='OnchageRemarks(this," + I + ")' name='Damaged" + I + "' id='Damaged" + I + "' value='" + IsDamagedVal + "'></td> ";
                    Tbl += "<td class='formthreeInputcolumn'><input type='text' onkeyup='OnchageDamageCondition(this," + I + ")' value='" + (remarks == "" ? data.Table0[I].DamageCondition : remarks) + "' id='Text_DamageCondition" + I + "' data-valid='' style='width:160px'  data-valid-msg='' value='' name='Text_DamageCondition" + I + "' /></td></tr>";
                }
            }

            $("#tblAddMultipleUldAdd").append("<table class='WebFormTable' id='tblAddDamaged' validateonsubmit='true'>" + Tbl1 + Tbl + "</table>")
            AuditLogBindOldValue("tblAdd");
        }
    });

}
function OnchageRemarks(ths, id) {
    if ($(ths).is(":checked")) {
        $("#Text_DamageCondition" + id).attr("disabled", false)
        $("#Damaged" + id).attr("value", 1)

    } else {
        $("#Damaged" + id).attr("value", 0)
        $("#Text_DamageCondition" + id).attr("disabled", "disabled")
        $("#Text_DamageCondition" + id).val("")
    }


}
function OnchageDamageCondition(ths, id) {

    var DamageCondition = $("#Text_DamageCondition" + id).val();
    if (DamageCondition != "") {
        $("#Damaged" + id).attr("checked", true)
        $("#Damaged" + id).attr("value", 1)
    } else {
        $("#Damaged" + id).attr("checked", false)
        $("#Damaged" + id).attr("value", 0)
    }
}
////
var EditSNo = 0;;
function GridReadAction(obj) {


    EditSNo = $(obj).attr("href").split('=')[1];

    //var IsMsgSent = $(obj).attr("IsMsgSent");//$(obj).closest('tr').find('td[data-column="IsMsgSent"]').html();
    // alert(IsMsgSent)

    $("#Text_IssuedBy").text('')
    $("#Text_TransferPoint").text('')
    $("#Text_Location").text('')
    $("#Text_Status").text('')
    $.ajax({
        type: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "./Services/Export/UldTransfer/UldOutService.svc/EditData/" + EditSNo,
        success: function (r) {


            NewClick(EditSNo, obj);
            //$("#Text_ULDNumber").attr("disabled", "disabled");
            //$("#Text_ULDNumber").next("span").remove()

            for (var key in r) {
                var $content = $('[id="' + key + '"]');
                if ($content.attr("type") == "checkbox") {
                    $content.attr("checked", r.Damaged);
                }
                if ($content) {
                    $content.val(r[key]);
                }

            }

            $(".tool-items").fadeOut();

            $("#Text_IssuedBy").text(r.Text_IssuedBy)
            $("#Text_TransferPoint").text(r.Text_TransferPoint)
            $("#Text_Location").text(r.CurrLocation)
            $("#PText_Location").text(r.CurrLocation);
            $("#Text_Status").text(r.IsAvailable)
            $("#Rentaldays").val(r.Rentaldays)
            //cfi.BindMultiValue("ULDNumber", $("#Text_ULDNumber").val(), $("#ULDNumber").val());

            if (r.IsMsgSent == "1") {
                $("#btnSave").hide();
            } else {
                $("#btnSave").show();
            }
            if (r.IsInboundSno.trim() == "1".trim()) {
                $("#OutBound").attr("checked", false)
                $("#OutBound").attr("disabled", "disabled")
                $("#InBound").attr("checked", "checked")
                $("#trInBound").show()
                $("#trOutBound").hide()
                $("#Text_TransferBy").val(r.Text_TransferBy);
                $("#TransferBy").val(r.TransferBy);
                $("#Text_ReceivedBy").val(userContextAirlineName);
                $("#ReceivedBy").val(userContextAirlineSNo);
                $("#Text_ULDNumber").removeAttr("data-valid")
                $("#Text_ULDNumber").val("")
                $("#ULDNumber").val("")
                $("#OtherAirlineULD").hide()


                var ULDNumber = r.ULDNumber.split(',');
                var Text_ULDNumber = r.Text_ULDNumber.split(',')
                var Tbl = "";
                for (var I = 0; I < ULDNumber.length; I++) {
                    if (Text_ULDNumber[I] != "") {
                        Tbl += "<li class='k-button' style='margin-right:3px;margin-bottom:3px;text-transform: uppercase'><span id='listadd'>" + Text_ULDNumber[I].trim()
                            + " </span><span id='" + I + "' class='k-icon k-delete remove'></span><span style='display:none' id='CreateUld'>" + ULDNumber[I].trim() + " </span></li>";
                    }
                }
                $("ul#addlist1").append(Tbl)
                $("body").on("click", ".remove", function () {
                    $(this).closest("li").remove();
                });
                $("#ULDNumber").val(ULDNumber)
                setTimeout(function () {
                    DynamicAppend(Dynamic, ULDNumber);
                }, 100)
                $("#DivUCR").html("")
                $("#DivUCR").append('<input type="text" name="Text_UCRCarrierCode" data-valid="maxlength[3],minlength[3],required,Number" controltype="0123456789" style="width:30px;" size="3" maxlength="3" data-valid-msg="Enter Carrier Code.Minimum 3 character" id="Text_UCRCarrierCode"><span style="font-size:large">-</span><input type="text" name="Text_UCRNumber" onkeyup="DupicateCheckUCRNumber(this)" data-valid="maxlength[8],minlength[5],required,Number" style="width:80px;" size="8" maxlength="8" data-valid-msg="Enter UCR Number.Minimum 5 & Maximum 8 character" id="Text_UCRNumber">')
                $("#divucrlbl").css("display", "block")
                if (r.LUCInNumber != "0") {
                    var LUCInNumber = r.LUCInNumber.split('-');
                    $("#Text_UCRCarrierCode").val(LUCInNumber[0])
                    $("#Text_UCRNumber").val(LUCInNumber[1])
                    $("#Text_UCRCarrierCode").attr("disabled", "disabled")
                    $("#Text_UCRNumber").attr("disabled", "disabled")
                }


            } else if (r.IsInboundSno.trim() == "0".trim()) {

                $("#OutBound").attr("checked", "checked")
                $("#InBound").attr("checked", false)
                $("#InBound").attr("disabled", "disabled")
                $("#Text_ULDNumber").removeAttr("data-valid")
                $("#trInBound").hide()
                $("#trOutBound").show()
                //$("#Text_ReceivedBy").val("");
                $("#ReceivedBy").val(r.ReceivedBy);
                $("#Text_TransferBy").val(userContextAirlineName);
                $("#TransferBy").val(userContextAirlineSNo);
                $("#OtherAirlineULD").show()
                cfi.BindMultiValue("ULDNumber", $("#Text_ULDNumber").val(), $("#ULDNumber").val());

                setTimeout(function () {
                    var ULDNumber = $("#ULDNumber").val();
                    DynamicAppend(Dynamic, ULDNumber);
                }, 300)
                $("#DivUCR").html("")
            }


            $("#divMultiULDNumber span.k-delete").remove();
            $("#Text_ULDNumber").data("kendoAutoComplete").enable(false);

            $("#addlist1 span.k-delete").remove();
            $("#Text_UldType").data("kendoAutoComplete").enable(false);
            PageRightsCheck()
        }

    });


}

function BindControls() {
    $("#Text_IssuedDate").kendoDatePicker();
    //$("#Text_IssuedTime").kendoTimePicker();
    //Changes by Vipin Kumar
    //cfi.AutoComplete("ULDNumber", "ULDNo,SNo", "vwULDStockULDTransferDropDown", "SNo", "ULDNo", ["ULDNo"], null, "contains", ",", "", "", "", ULDNumberOnSelect);
    cfi.AutoCompleteV2("ULDNumber", "ULDNo,SNo", "ULD_Transfer_ULDNumber", null, "contains", ",", "", "", "", ULDNumberOnSelect);
    // Ends 
    //cfi.AutoComplete("ReceivedBy", "CityName,CityCode", "City", "SNo", "CityName", ["CityCode", "CityName"], ReceivedByOnSelect, "contains");
    // cfi.AutoComplete("StackUld", "ULDNo", "vwULDStockAuto", "ULDNo", "ULDNo", ["ULDNo"], BuildStack, "contains", ",", null, null, null, BuildStackRestriction, true);
    // cfi.AutoComplete("FormotherULDType", "Text_ULD,SNo", "vwULD", "SNo", "Text_ULD", ["Text_ULD"], null, "contains", null, null, null, null, "", true);

    // Changes by Vipin Kumar
    //cfi.AutoComplete("UldType", "Text_ULD,SNo", "vwULD", "SNo", "Text_ULD", ["Text_ULD"], null, "contains");
    cfi.AutoCompleteV2("UldType", "Text_ULD,SNo", "ULD_Transfer_UldType", null, "contains");

    //cfi.AutoComplete("ReceivedBy", "Name", "vwAccountAgentForwarderAirline", "SNo", "Name", ["Name"], null, "contains", null, null, null, null, ReceivedByOnSelect, true);
    cfi.AutoCompleteV2("ReceivedBy", "Name", "ULD_Transfer_ReceivedBy", null, "contains", null, null, null, null, ReceivedByOnSelect, true);

    //cfi.AutoComplete("TransferBy", "Name", "vwAccountAgentForwarderAirline", "SNo", "Name", ["Name"], null, "contains", null, null, null, null, TransferByOnSelect, true);
    cfi.AutoCompleteV2("TransferBy", "Name", "ULD_Transfer_ReceivedBy", null, "contains", null, null, null, null, TransferByOnSelect, true);

    //cfi.AutoComplete("DemurrageCode", "Code", "DamurrageCodes", "SNo", "Code", ["Code"], null, "contains");
    cfi.AutoCompleteV2("DemurrageCode", "Code", "ULD_Transfer_DemurrageCode", null, "contains");

    //cfi.AutoComplete("ODLNCode", "Code,ODLNDesc", "ODLNCodes", "SNo", "Code", ["Code", "ODLNDesc"], null, "contains");
    cfi.AutoCompleteV2("ODLNCode", "Code,ODLNDesc", "ULD_Transfer_ODLNCodes", null, "contains");

    //cfi.AutoComplete("FinalDestination", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoCompleteV2("FinalDestination", "AirportCode,AirportName", "ULD_Transfer_FinalDestination", null, "contains");
    // Ends
    if ($('.Process:checked').val() == "1") {
        data = [{ Key: "2", Text: "Airline" },];//,{ Key: "3", Text: "Agent" }
    } else if ($('.Process:checked').val() == "0") {
        data = [{ Key: "2", Text: "Airline" }, { Key: "0", Text: "Forwarder" }, { Key: "1", Text: "Shipper" },];//,{ Key: "3", Text: "Agent" }
    }
    cfi.AutoCompleteByDataSource("IssuedTo", data, Clear, null);
    //cfi.AutoCompleteByDataSource("IssuedBy", data);
    var dbtableName = "tblConsumables";

    $('#Text_IssuedDate').kendoDatePicker({
        max: new Date()
    });


}
var IsMsgSentHideShow = "0";
function OnSuccessGrid() {
    var TrHeader = $("div[id$='divMainGrid']").find("div[class^='k-grid-header'] thead tr");
    var IsMsgSentIndex = TrHeader.find("th[data-field='IsMsgSent']").index();
    var IsConsumables = TrHeader.find("th[data-field='IsConsumables']").index();
    var IsMage = TrHeader.find("th[data-field='IsMage']").index();
    var IsInbound = TrHeader.find("th[data-field='IsInbound']").index();

    $("div[id$='divMainGrid']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {





        if ($(tr).find("td:eq(" + IsMsgSentIndex + ")").text() == "1") {
            $(tr).find('input[type="button"][value="L"]').prop('disabled', true).prop('class', 'completeprocess');
        }
        else {

            $(tr).find('input[type="button"][value="L"]').prop('disabled', false);

        }
        if ($(tr).find("td:eq(" + IsInbound + ")").text().trim() == "Receive From".trim()) {
            $(tr).find('input[type="button"][value="L"]').css("display", "none")
        }

        if ($(tr).find("td:eq(" + IsConsumables + ")").text() == "1") {
            $(tr).find('input[type="button"][value="C"]').prop('class', 'completeprocess');
            // $(tr).find('input[type="button"][value="C"]').prop('disabled', true).prop('class', 'completeprocess');
        }
        else {
            $(tr).find('input[type="button"][value="C"]').prop('disabled', false);
        }
        if ($(tr).find("td:eq(" + IsMage + ")").text() == "1") {
            $(tr).find('input[type="button"][value="U"]').prop('class', 'completeprocess');
        }
        else {
            $(tr).find('input[type="button"][value="U"]').prop('disabled', false);
        }
        //if ($(tr).find("td:eq(" + IsMage + ")").text() == "1") {
        //    alert($(tr).find("td:eq(" + IsMage + ")").text())
        //    $(tr).find('input[type="button"][value="U"]').prop('class', 'completeprocess');
        //    // $(tr).find('input[type="button"][value="C"]').prop('disabled', true).prop('class', 'completeprocess');
        //}
        //else {
        //    $(tr).find('input[type="button"][value="U"]').prop('disabled', false);
        //}
    });
}
function Clear() {
    var IssuedTo = $("#IssuedTo").val();
    if (IssuedTo == "2") {
        $("#Text_DemurrageCode").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_DemurrageCode").val("")
        $("#DemurrageCode").val("")
        $("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
    }
}
function PutHyphenINTime() {
    var x = $("#Text_IssuedTime").val();
    if (x.length == 2) {
        $("#Text_IssuedTime").val($("#Text_IssuedTime").val() + ":");
    }

}
function CheckTimeFormat() {
    if ($("#Text_IssuedTime").val() != '') {
        var x = $("#Text_IssuedTime").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (x.charAt(0) == 0) {

                }
                else if (firstno >= 4 && x.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        var IssuedTime = $("#Text_IssuedTime").val();
        var Time = IssuedTime.split(":")[1]
        if (parseInt(Time) > 59) {
            $("#Text_IssuedTime").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }
        if (value == 1 || x.length != 5 || $("#Text_IssuedTime").val().search(':') == -1) {
            $("#Text_IssuedTime").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }

    }
}
var data = ""
function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");

    if ($("#AirlineWiseUld").is(":checked")) {
        if (textId.indexOf("Text_ULDNumber") >= 0) {
            var filterText_ULDNumber = cfi.getFilter("AND");
            cfi.setFilter(filterText_ULDNumber, "OwnerCode", "notin", userContext.AirlineCarrierCode.split("-")[0].trim());
            //cfi.setFilter(filterText_ULDNumber, "CurrentAirportSNo", "notin", userContext.AirportSNo);
            f = cfi.autoCompleteFilter(filterText_ULDNumber);
            return f;
        }
    } else {
        if (textId.indexOf("Text_ULDNumber") >= 0) {
            var filterText_ULDNumber1 = cfi.getFilter("AND");
            cfi.setFilter(filterText_ULDNumber1, "OwnerCode", "eq", userContext.AirlineCarrierCode.split("-")[0].trim());
            cfi.setFilter(filterText_ULDNumber1, "CurrentAirportSNo", "eq", userContext.AirportSNo);
            f = cfi.autoCompleteFilter(filterText_ULDNumber1);
            return f;
        }
    }
    //if (textId.indexOf("ReceivedBy") >= 0) {
    //    cfi.setFilter(f, "accounttypename", "eq", $('#IssuedTo').val() == "" ? "-1" : $('#IssuedTo').val());
    //}
    //if (textId.indexOf("TransferBy") >= 0) {
    //    cfi.setFilter(f, "accounttypename", "eq", '2');
    //}
    if (textId.indexOf("Text_ReceivedBy") >= 0) {
        var filterReceivedBy = cfi.getFilter("AND");
        cfi.setFilter(filterReceivedBy, "accounttypename", "eq", $('#IssuedTo').val() == "" ? "-1" : $('#IssuedTo').val());
        cfi.setFilter(filterReceivedBy, "SNo", "notin", $("#Text_TransferBy").data("kendoAutoComplete").key());
        f = cfi.autoCompleteFilter(filterReceivedBy);
        return f;
    }
    if (textId.indexOf("Text_TransferBy") >= 0) {
        var filterTransferBy = cfi.getFilter("AND");
        cfi.setFilter(filterTransferBy, "accounttypename", "eq", $('#IssuedTo').val() == "" ? "-1" : $('#IssuedTo').val());
        cfi.setFilter(filterTransferBy, "SNo", "notin", $("#Text_ReceivedBy").data("kendoAutoComplete").key());
        f = cfi.autoCompleteFilter(filterTransferBy);
        return f;
    }

    //if (textId.indexOf("Text_ULDNumber") >= 0) {
    //    var SpuserContextAirlineName = userContext.AirlineName
    //    var last = SpuserContextAirlineName.split('-')
    //    alert(last[1])
    //    try {
    //        cfi.setFilter(filterEmbargo, "AirlineCode", "eq", last[1]);
    //        var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
    //        return ULDTypeAutoCompleteFilter;
    //    }
    //    catch (exp) { }
    //}


    //if ("TransferBy" == textId)
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Text_TransferBy").val()), filter = cfi.autoCompleteFilter(textId);
    //if ("ReceivedBy" == textId)
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Text_TransferBy").val()), filter = cfi.autoCompleteFilter(textId);

    //if (textId.indexOf("ReceivedBy") >= 0 || textId.indexOf("TransferBy") >= 0) {
    //    cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_ReceivedBy", "TransferBy").replace("Text_TransferBy", "ReceivedBy")).val());
    //}
    if (textId.indexOf("tblConsumables_Consumables") >= 0) {
        var row = textId.split("_");
        if ($("input:radio[name='tblConsumables_RbtnStock_" + row[2] + "']:checked").val() == "0") {
            cfi.setFilter(f, "AirlineSNo", "eq", $("#" + textId.replace('_Consumables_', '_TransferBy_')).val());
            cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
            //cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
            //var filtertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
            //var len = (($("#tblConsumables tbody tr").length) / 2);
            for (var i = 0; i <= 50; i++) {
                if ($('#tblConsumables_Consumables_' + [i]).val() != undefined && $('#tblConsumables_Consumables_' + [i]).val() != '' && 'tblConsumables_Consumables_' + [i] != 'tblConsumables_Consumables_' + textId.split('_')[2])
                    cfi.setFilter(f, "SNo", "notin", $('#tblConsumables_HdnConsumables_' + [i]).val());
            }
            //f = cfi.autoCompleteFilter(filtertblDimensionULDTab_ULDTypeSNo);
            //return f;
        }
        else {
            cfi.setFilter(f, "Owner", "eq", "2");
            cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
        }
    }
    if (textId.indexOf("tblConsumables_ServiceName") >= 0) {
        cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
    }
    if (textId.indexOf("Text_ULDNumber") >= 0) {
        cfi.setFilter(f, "SNo", "notin", $("#Text_ULDNumber").data("kendoAutoComplete").key());
        cfi.setFilter(f, "CurrentCityCode", "eq", userContext.CityCode);
        cfi.setFilter(f, "AirlineSNo", "eq", userContext.AirlineSNo);
        //filterSHC = cfi.autoCompleteFilter(f);
        //return filterSHC;
    }


    return cfi.autoCompleteFilter([f]);
}
function ReceivedByClick(a, b, c, d) {

    var TransferBy = $("#Text_TransferBy").val();
    var IssuedTo = $("#IssuedTo").val();
    if (IssuedTo == "1" || IssuedTo == "0" || IssuedTo == "2") {


        if (TransferBy.trim() == b.trim()) {
            $('input[name="Text_ReceivedBy"]').val("");
            $('input[name="ReceivedBy"]').val("");
        }
    }
    // $("#ReceivedByCode").val(b.split('-')[0]);
}
function TransferByClick(a, b, c, d) {
    var ReceivedBy = $("#Text_ReceivedBy").val();
    var IssuedTo = $("#IssuedTo").val();
    if (IssuedTo == "1" || IssuedTo == "0" || IssuedTo == "2") {
        if (ReceivedBy.trim() == b.trim()) {
            $('input[name="Text_TransferBy"]').val("");
            $('input[name="TransferBy"]').val("");
        }
    }
    // $("#ReceivedByCode").val(b.split('-')[0]);
}
function ULDNumberOnSelect(e) {
    var Data = this.dataItem(e.item.index());

    var MultipleULD = $("#Multi_ULDNumber").val()// == "" ? 0 : 1;

    MultipleULD = MultipleULD.replace(",,", ",");


    var CommoExist = MultipleULD.substr(MultipleULD.length - 1);
    if (CommoExist == ',') {
        MultipleULD = MultipleULD.substring(0, MultipleULD.length - 1);
    }


    MultipleULD = MultipleULD == "" ? 0 : 1;
    if (Data.Key != "") {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json", cache: false,
            url: "./Services/Export/UldTransfer/UldOutService.svc/GetUldDetails/" + Data.Key,
            success: function (response) {
                var data = jQuery.parseJSON(response);

                $('#Text_IssuedBy').html(userContext.UserName)
                $('#Text_IssuedBy').css('text-transform', 'uppercase')
                $("#Text_Status").text(data.Table0[0].IsAvailable);
                $("#PText_Status").text(data.Table0[0].IsAvailable);
                $("#Text_Location").text(data.Table0[0].City);
                $("#PText_Location").text(data.Table0[0].City);
                //if (MultipleULD > 0) {
                //    $("#Text_ULDCode").text('');
                //    $("#lblULDType").text('');
                //}
                //else
                //    $("#Text_ULDCode").text(data.Table0[0].uldtype);
                if (Data.Key != "" && EditSNo == 0) {
                    $("#Text_IssuedTime").val(data.Table0[0].STime)
                }
                $("#Text_TransferredBy").text(userContext.UserName);
                $("#Text_TransferPoint").text(userContext.AirportCode);
                //$("#ULDCode").val(b.split('-')[0]);
                $("#UserSNo").val(userContext.UserSNo);
                $("#AirportSNo").val(userContext.AirportSNo);

                $("#Text_ReceivedBy").val("");
                $("#ReceivedBy").val("");
                $("#Text_TransferBy").val(userContextAirlineName);
                $("#Text_TransferBy").data("kendoAutoComplete").enable(false);
                $("#TransferBy").val(userContextAirlineSNo);

            }
        });
    }
    if (MultipleULD > 0) {
        // if ($("#Multi_ULDNumber").val().indexOf(',') != -1) {
        // $('#Damaged').prop('disabled', true);
        //  $('#Damaged').removeAttr('checked', false);
        //  $('#Text_DamageCondition').removeAttr("data-valid");
        //$('#Text_ODLNCode').removeAttr("data-valid");
        //$('#Text_DemurrageCode').removeAttr("data-valid");
        //  $('#Text_DamageCondition').val('');
        //$('#Text_ODLNCode').val('');
        //$('#ODLNCode').val('');
        //$('#Text_DemurrageCode').val('');
        //$('#DemurrageCode').val('');
        //$("#ODLNCode").attr("enabled", false);
        //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
        //$("#DemurrageCode").attr("enabled", false);
        //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
        //  $("#Text_DamageCondition").prop('disabled', true);
        //}
        // $("#Text_ULDCode").text('');
    }
    setTimeout(function () {
        Default = 0;
        Dynamic = 0;

        DynamicAppend(Dynamic);
    }, 500)


}
function ReceivedByOnSelect(e) {

    //var ReceivedBy = $("#Text_TransferBy").val();
    //var TransferBy = $("#Text_ReceivedBy").val();

    //if (ReceivedBy.trim() == TransferBy.trim()) {

    //    e.preventDefault();
    //    $('input[name="Text_ReceivedBy"]').val("");
    //    $('input[name="ReceivedBy"]').val("");
    //}
}
function TransferByOnSelect(e) {

    //var ReceivedBy = $("#Text_TransferBy").val();
    //var TransferBy = $("#Text_ReceivedBy").val();
    //if (ReceivedBy.trim() == TransferBy.trim()) {
    //    e.preventDefault();
    //    $('input[name="Text_TransferBy"]').val("");
    //    $('input[name="TransferBy"]').val("");


    //}
}
function BindGridData_TransferBy(SNo, TransferBy, IsMsgSent, obj) {
    ProcessClick(SNo, TransferBy, IsMsgSent, obj);
}
function BindGridData(SNo, TransferBy, IsMsgSent, obj) {
    if ($(obj).attr("value") == "C") {
        var closestTr = $(obj).closest("tr");
        var ULDNum = closestTr.find("td[data-column='ULDNumber']").text();
        ProcessClick(SNo, TransferBy, IsMsgSent, obj, ULDNum);
    }
    else if ($(obj).attr("value") == "E") {
        ProcessClick(SNo, TransferBy, IsMsgSent, obj);
    }
    else if ($(obj).attr("value") == "U") {
        BindUploadControl(SNo);
    }
    else if ($(obj).attr("value") == "L") {
        var urlnew = "";
        var closestTr = $(obj).closest("tr");
        var ULDNumber = closestTr.find("td[data-column='ULDNumber']").text();
        var ULDNumberSNo = closestTr.find("td[data-column='Text_ULDNumber']").text();
        var IssuedTo = closestTr.find("td[data-column='IssuedTo']").text();
        if (location.hostname == "localhost")
            urlnew = "//" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUC&FormAction=INDEXVIEW&returnurl=ULDOut&ULDNumber=" + ULDNumber + "&ULDNumberSNo=" + ULDNumberSNo + "&IssuedTo=" + IssuedTo + "";
        else
            urlnew = "//" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUC&FormAction=INDEXVIEW&returnurl=ULDOut&ULDNumber=" + ULDNumber + "&ULDNumberSNo=" + ULDNumberSNo + "&IssuedTo=" + IssuedTo + "";
        window.location.href = urlnew
    }

}
function BindUploadControl(SNo) {
    CancelDetails();
    $('#tblConsumables').html('');
    $('#tblConsumables').addClass("appendGrid ui-widget");
    $('#tblConsumables').html("<form name='form1' method='post' ><table class='WebFormTable'><tr><td class='formSection' colspan='4'>ULD Image Upload</td></tr><tr><td class='formlabel'>Image upload</td><td class='formInputcolumn'> <div><input id='ImgFileUpload' name='ImgFileUpload' type='file' /></div><div><input type='hidden' id='hdnULDSNoImgupload' value='" + SNo + "'/></div></td><td class='formlabel'>Download File</td><td class='formInputcolumn' id='uldimageDownloadLink'></td></tr><tr><td class='formlabel'></td><td class='formInputcolumn'><input type='button'  value='Submit' onClick = 'UploadImage()' /></td><td class='formlabel'></td><td class='formInputcolumn'></td></tr></table></form>");

    $.ajax({
        url: "./Services/Export/UldTransfer/UldOutService.svc/GetULDImageFileName",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ULDSNo: SNo
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            if (result.length > 2) {
                var v = $.parseJSON(result);
                if (v[0].FName != '') {

                    var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DBULDIMAGE&FlagSNo=" + SNo + "'>" + v[0].FName.toString() + "</a>"
                    $("#uldimageDownloadLink").html(str);
                    PageLoaded()
                }
            }
            PageRightsCheck()
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function UploadImage() {
    var fileName = '';
    var nextctrlID = ''
    var fileSelect = document.getElementById('ImgFileUpload');
    var files = fileSelect.files;

    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        var uldsno = $('#hdnULDSNoImgupload').val();
        // data.append(files[i].name, files[i]);
        data.append(files[i].name + '~' + uldsno + '~1', files[i]);
    }
    $.ajax({
        url: "Handler/FileUploadHandler.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result != 2001) {
                ShowMessage('success', '', "File Uploaded Successfully.", "bottom-right");
                var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DBULDIMAGE&FlagSNo=" + result + "'>" + fileName.toString() + "</a>"
                $("#uldimageDownloadLink").html(str);
            }
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload the selected file. Please try again.", "bottom-right");
        }
    });
    PageLoaded()
}
function SaveImage() {
    var filename = String($('#file').val()).toLowerCase();
    if (filename == "") {
        alert('Please select file');
        return false;
    }
    if (filename != "" && (filename.indexOf('.jpg') == -1 && filename.indexOf('.gif') == -1 && filename.indexOf('.jpeg') == -1) && filename.indexOf('.bmp') == -1 && filename.indexOf('.png') == -1) {
        alert('Please upload valid file only');
        return false;
    }

    var form = $('#tblConsumables').get(0);
    AjaxPostwithFile(form, 'html', function (response) {
        if (String(response).indexOf('System.Exception: File size should be less than 1 MB.') == -1) {
            //alert(response);
            $('#divimgupload').html(response);
            hide_Verify();
        }
        else {
            alert('File size should be less than 1 MB.');
            //$('#spMessage').val();
        }
    });
}
function StockChangeClick(evt, rowIndex) {
    var index = rowIndex + 1;
    $("#tblConsumables_Consumables_" + index).val('');
    $("#tblConsumables_HdnConsumables_" + index).val('');
}
function uploadImage() {
    var filename = String($('#file').val()).toLowerCase();
    if (filename == "") {
        alert('Please select file');
        return false;
    }
    if (filename != "" && (filename.indexOf('.jpg') == -1 && filename.indexOf('.gif') == -1 && filename.indexOf('.jpeg') == -1) && filename.indexOf('.pdf') == -1 && filename.indexOf('.png') == -1) {
        alert('Please upload valid file only');
        return false;
    }

    var fileUpload = $("#file").get(0);

    //if (fileUpload.length > 0) {
    //    test.append("UploadedImage", fileUpload[0]);
    //}
    var files = fileUpload.files;
    var test = new FormData();
    for (var i = 0; i < files.length; i++) {
        test.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "./Services/Export/UldTransfer/UldOutService.svc/uploadfile",
        type: "POST",
        contentType: false,
        processData: false,
        data: test,
        // dataType: "json",
        success: function (result) {
            alert(result);
        },
        error: function (err) {
            alert(err.statusText);
        }
    });
}
function ProcessClick(SNo, TransferBy, IsMsgSent, obj, uldnum) {

    RowIndex = 0;
    CancelDetails();
    if ($(obj).attr("value") == "C") {

        sessionStorage.setItem("uldnumber", uldnum);
        var dbtableName = "tblConsumables";
        $("#" + dbtableName).appendGrid({
            tableID: dbtableName,
            contentEditable: true,
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
            servicePath: './Services/Export/UldTransfer/UldOutService.svc',
            getRecordServiceMethod: "GetConsumablesRecord",
            createUpdateServiceMethod: "CreateConsumablesRecord",
            masterTableSNo: SNo,
            deleteServiceMethod: "DeleteConsumablesRecord",
            isGetRecord: true,
            hideButtons: { insert: true },
            caption: "Consumables",
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'TransferBy', type: 'hidden', value: TransferBy },
                { name: 'ULDTransferSNo', type: 'hidden', value: SNo },
                {
                    name: 'Stock', display: 'Stock', type: 'radiolist', ctrlOptions: { 0: 'Airline', 1: 'Self' }, selectedIndex: 0, onClick: function (evt, rowIndex) {
                        { StockChangeClick(evt, rowIndex) }
                    }
                },
                {
                    name: "Consumables", display: "Consumables", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "100px" }
                    , isRequired: true, AutoCompleteName: 'ULD_Transfer', filterField: 'Item', filterCriteria: "contains", onChange: function (evt, rowIndex) {
                        CheckQuantity(rowIndex)
                    },
                },
                {
                    name: 'GrossWt', display: 'Quantity', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7 }
                    , isRequired: true, onChange: function (evt, rowIndex) {
                        CheckQuantity(rowIndex)
                    }
                }
            ],
            hideButtons: { updateAll: IsMsgSent == 1 ? true : false, append: IsMsgSent == 1 ? true : false, insert: true, remove: IsMsgSent == 1 ? true : false, removeLast: true },
            OnUpdateSuccess: function () { PageLoaded(); },
            afterRowRemoved: function (caller, rowIndex) {
                if (rowIndex == "0") {
                    PageLoaded();
                }

            }
            //afterRowRemoved: function (caller, rowIndex) {
            //    RefreshGrid(rowIndex);
            //},
            //    , dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

            //        for (var i = 1; i <= RowIndex; i++) {

            //            $('#tblConsumables_Consumables_' + i).data("kendoAutoComplete").enable(false);
            //            $('#tblConsumables_PrimaryValue_' + i).prop('disabled', true);
            //            $('#tblConsumables_SecondaryValue_' + i).prop('disabled', true);
            //            $('#tblConsumables_RbtnStock_' + i + '_0').prop('disabled', true);
            //            $('#tblConsumables_RbtnStock_' + i + '_1').prop('disabled', true);
            //            $('#tblConsumables_GrossWt_' + i ).prop('disabled', true);


            //        }
            //    },

            //    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            //    RowIndex = addedRowIndex.length;
            //}
        });
        //if(response != '')
        //    $("#" + dbtableName).appendGrid('load', response);
    }
    else {
        var dbtableName = "tblConsumables";
        $("#" + dbtableName).appendGrid({
            tableID: dbtableName,
            contentEditable: true,
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
            servicePath: './Services/Export/UldTransfer/UldOutService.svc',
            getRecordServiceMethod: "GetESSRecord",
            createUpdateServiceMethod: "CreateESSRecord",
            masterTableSNo: SNo,
            deleteServiceMethod: "DeleteESSRecord",
            isGetRecord: true,
            hideButtons: { insert: true },
            caption: "ESS",
            initRows: 1,
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            { name: 'ULDTransferSNo', type: 'hidden', value: SNo },
            {
                name: "ServiceName", display: "Service Name", type: "text", ctrlAttr: { maxlength: 50, controltype: "autocomplete" }, ctrlCss: { width: "150px" }, isRequired: true, addOnFunction: onchangeservicename, AutoCompleteName: 'ULD_Transfers', filterField: 'ChargeName', filterCriteria: "contains"
            },
            {
                name: 'Mode', display: 'Payment Type', type: 'radiolist', ctrlOptions: { 0: 'Cash', 1: 'Credit' }, selectedIndex: 1, isRequired: false, onClick: function (evt, rowIndex) { }
            },
            //{
            //    name: 'PrimaryValue', display: 'Primary Value', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 7, onBlur: "calculateAmount(this)" }, isRequired: true

            //}
            //,
            //{
            //    name: 'SecondaryValue', display: 'Secondary Value', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 7, onBlur: "calculateAmount(this)" }, isRequired: true
            //}
            //,
            {
                name: 'PrimaryValue', display: 'Primary Value', type: 'div', isRequired: false, ctrlCss: { width: '150px' },
                divElements:
                    [
                        {
                            divRowNo: 1, name: "PrimaryValue", display: '', type: "text", ctrlAttr: {
                                maxlength: 10, controltype: "decimal2",
                                onBlur: "calculateAmount(this)"
                            }, ctrlCss: { width: "70px" }, isRequired: true
                        }

                    ]
            },
            {
                name: 'SecondaryValue', display: 'Secondary Value', type: 'div', isRequired: false, ctrlCss: { width: '150px' },
                divElements:
                    [
                        {
                            divRowNo: 1, name: "SecondaryValue", display: '', type: "text", ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "calculateAmount(this)" }, ctrlCss: { width: "70px" }, isRequired: false
                        }
                    ]
            },
            {
                name: 'Charges', display: 'Charges', type: 'label', ctrlCss: { width: '50px', height: '20px' }
            },
            {
                name: 'Charges', display: 'Charges', type: 'hidden', value: ''
            }
            ]
            , hideButtons: { updateAll: IsMsgSent == 1 ? true : false, append: IsMsgSent == 1 ? true : false, insert: true, remove: IsMsgSent == 1 ? true : false, removeLast: true },
            isPageRefresh: true,

            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

                for (var i = 1; i <= RowIndex; i++) {
                    var ChkId = "tblConsumables_SecondaryValue_" + i;
                    if ($("#" + ChkId).val() == "") {
                        $('#tableSecondaryValue' + i).hide();
                    }


                    if ($('#tblConsumables_ServiceName_' + i).val() != '' && $('#tblConsumables_ServiceName_' + i).val() != undefined) {
                        var ChkServiceID = $('#tblConsumables_ServiceName_' + i).val()
                        var serviceName = ChkServiceID.split('[')[1].split(']')[0];
                        if (serviceName.split('-').length > 1) {
                            $('#tblConsumables_lblPrimaryValue_' + i).text(serviceName.split('-')[0]);
                            $('#tblConsumables_lblSecondaryValue_' + i).text(serviceName.split('-')[1]);

                        } else {

                            $('#tblConsumables_lblPrimaryValue_' + i).text(serviceName.split('-')[0])
                        }
                    }
                    $('#tblConsumables_ServiceName_' + i).data("kendoAutoComplete").enable(false);
                    $('#tblConsumables_PrimaryValue_' + i).prop('disabled', true);
                    $('#tblConsumables_SecondaryValue_' + i).prop('disabled', true);
                    $('#tblConsumables_RbtnMode_' + i + '_0').prop('disabled', true);
                    $('#tblConsumables_RbtnMode_' + i + '_1').prop('disabled', true);

                }

            },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                RowIndex = addedRowIndex.length;
            }

        });
        // BindESS();
    }
    PageRightsCheck()
}
function RefreshGrid(rowIndex) {
    alert(rowIndex);
}
function CheckQuantity(rowIndex) {
    var ConsumablesSNo = $("#tblConsumables_HdnConsumables_" + (rowIndex + 1)).val();
    var Quantity = $("#tblConsumables_GrossWt_" + (rowIndex + 1)).val();
    var OwnerSNo = $("input:radio[name='tblConsumables_RbtnStock_" + (rowIndex + 1) + "']:checked").val();
    if (ConsumablesSNo > 0 && parseInt(Quantity) > 0) {
        $.ajax({
            url: "./Services/Export/UldTransfer/UldOutService.svc/GetUsedULDQuantity?ConsumablesSNo=" + ConsumablesSNo + "&Quantity=" + Quantity + "&OwnerSNo=" + OwnerSNo,
            async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = jQuery.parseJSON(response);

                if (data.Table0[0].Result == "0") {
                    $("#tblConsumables_GrossWt_" + (rowIndex + 1)).val('')
                    ShowMessage('warning', 'Warning - ULD Out', "Quantity can not be grater than total available Consumable Stock : " + data.Table0[0].TotalAvailableStock, "bottom-right");
                }
            }
        });
    }
    //alert($("#tblConsumables_HdnConsumables_" + (rowIndex+1)).val());
}
function onchangeservicename(id, val) {

    var index = id.split('_')[2];
    var ss = $('#tblConsumables_ServiceName_1').val();
    if ($('#tblConsumables_ServiceName_' + index).val() != '') {
        var serviceName = val.split('[')[1].split(']')[0];
        if (serviceName.split('-').length > 1) {

            $('#tblConsumables_PrimaryValue_' + index).val('');
            $('#tblConsumables_SecondaryValue_' + index).val('');

            $('#_temptblConsumables_PrimaryValue_' + index).val('');
            $('#_temptblConsumables_SecondaryValue_' + index).val('');

            $('#tblConsumables_lblPrimaryValue_' + index).text('');
            $('#tblConsumables_lblSecondaryValue_' + index).text('');
            $('#tblConsumables_lblPrimaryValue_' + index).text(serviceName.split('-')[0]);
            $('#tblConsumables_lblSecondaryValue_' + index).text(serviceName.split('-')[1]);
            $('#tableSecondaryValue' + index).show();
            $('#tblConsumables_SecondaryValue_' + index).attr("data-valid", "required");
        } else {
            $('#_temptblConsumables_PrimaryValue_' + index).val('');
            $('#_temptblConsumables_SecondaryValue_' + index).val('');
            $('#tblConsumables_PrimaryValue_' + index).val('');
            $('#tblConsumables_SecondaryValue_' + index).val('');

            $('#tblConsumables_lblPrimaryValue_' + index).text('');
            $('#tblConsumables_lblSecondaryValue_' + index).text('');
            $('#tblConsumables_lblPrimaryValue_' + index).text(serviceName.split('-')[0])

            $('#tableSecondaryValue' + index).hide();
            $('#tblConsumables_SecondaryValue_' + index).removeAttr("required")
        }
    }

}
function calculateAmount(id) {
    var idvalIndex = id.id.split('_')[2]
    TariffSNo = $('#tblConsumables_HdnServiceName_' + idvalIndex + '').val(),
        PrimaryValue = $('#tblConsumables_PrimaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblConsumables_PrimaryValue_' + idvalIndex).val(),
        SecondaryValue = $('#tblConsumables_SecondaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblConsumables_SecondaryValue_' + idvalIndex).val();
    if (TariffSNo == "") {
        ShowMessage('warning', 'Warning - ULD Out', "Service Name is required.", "bottom-right");
    }
    else if (PrimaryValue != "0" || SecondaryValue != "0") {
        $.ajax({
            url: "./Services/Export/UldTransfer/UldOutService.svc/GetULDOutESSChargesTotal?TariffSNo=" + TariffSNo + "&PrimaryValue=" + PrimaryValue + "&SecondaryValue=" + SecondaryValue,
            async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#tblConsumables_Charges_' + idvalIndex).text(data);
                $('#tblConsumables_Charges_' + idvalIndex).val(data);
            }
        });
    }
}
function BindESS() {



    var Issueinvoice = "Consumables";
    $('#tbl' + Issueinvoice).appendGrid({
        tableID: 'tbl' + Issueinvoice,
        contentEditable: true,
        // contentEditable: false,
        // tableColumns: 'SNo,CFTNumber,MawbNo,TotalPcs,TotalGrossWt,TotalCBM,NoOfBUP,ShipmentType,ForwarderName,AirlineName,IsSecure,Origin,SPHCSNo,FlightNo,Origin,Destination,FlightNo,CarrierCode',
        isGetRecord: false,
        masterTableSNo: 0,
        currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
        servicePath: './Services/Inventory/ConsumableStockService.svc',
        getRecordServiceMethod: null,
        createUpdateServiceMethod: 'createUpdateConsumableStock',
        deleteServiceMethod: 'deletetblConsumableStock',
        caption: "ESS",
        initRows: 1,
        rowNumColumnName: 'SNo',

        columns: [
            {
                name: 'ServiceName', display: 'Service Name', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, addOnFunction: onchangeservicename, AutoCompleteName: 'ULD_Transfers', filterField: 'ChargeName', filterCriteria: "contains"
            },

            {
                name: 'PaymentType', display: 'Payment Type', type: 'radiolist', ctrlOptions: { 0: 'Cash', 1: 'Credit' }, selectedIndex: 1, isRequired: false, onClick: function (evt, rowIndex) { }
            },

            {
                name: 'PrimaryValue', display: 'Primary Value', type: 'div', isRequired: false, ctrlCss: { width: '150px' },
                divElements:
                    [
                        {
                            divRowNo: 1, name: "PrimaryValue", display: '', type: "text", ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "calculateAmount(this)" }, ctrlCss: { width: "70px" }, isRequired: false
                        }

                    ]
            },
            {
                name: 'SecondaryValue', display: 'Secondary Value', type: 'div', ctrlCss: { width: '150px' },
                divElements:
                    [
                        {
                            divRowNo: 1, name: "SecondaryValue", display: '', type: "text", ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "calculateAmount(this)" }, ctrlCss: { width: "70px" },
                        }
                    ]
            },

            { name: "Amount", display: "Amount", type: "label", ctrlCss: { width: "50px" } },

        ],

        //  hideButtons: { remove: true, removeLast: true },
        //hideButtons: { append: true, remove: true, removeLast: true },
        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: true },
        isPaging: true

    });
}
function NewClick(EditSNo, obj) {

    Default = 0;
    Dynamic = 0;

    $("#HeaderName").html('')
    EditSNo = EditSNo;

    $("#tblConsumables").html('');
    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/UldInformation.html',
        async: false,
        cache: false,
        success: function (result) {
            $("#divULDInformation").html(result);
            $("#btnSave").show();
            BindControls();
            if (EditSNo == undefined) {
                $('#Damaged').change(function () {
                    if ($(this).is(":checked")) {
                        // $('#Text_DamageCondition').attr("data-valid", "required");
                        // $('#Text_DamageCondition').attr("data-valid-msg", "Enter Damage Description");
                        //$('#Text_ODLNCode').attr("data-valid", "required");
                        //$('#Text_ODLNCode').attr("data-valid-msg", "Select ODLN Code");
                        //$('#Text_DemurrageCode').attr("data-valid", "required");
                        //$('#Text_DemurrageCode').attr("data-valid-msg", "Select Demurrage Code");
                        //$("#ODLNCode").attr("enabled", true);
                        //$("#Text_ODLNCode").data("kendoAutoComplete").enable(true);
                        //$("#DemurrageCode").attr("enabled", true);
                        //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(true);
                        //$("#Text_DamageCondition").prop('disabled', false);
                    }
                    else {
                        //  $('#Text_DamageCondition').removeAttr("data-valid");
                        //$('#Text_ODLNCode').removeAttr("data-valid");
                        //$('#Text_DemurrageCode').removeAttr("data-valid");
                        //   $('#Text_DamageCondition').val('');
                        //$('#Text_ODLNCode').val('');
                        //$('#ODLNCode').val('');
                        //$('#Text_DemurrageCode').val('');
                        //$('#DemurrageCode').val('');
                        //$("#ODLNCode").attr("enabled", false);
                        //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
                        //$("#DemurrageCode").attr("enabled", false);
                        //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
                        //$("#Text_DamageCondition").prop('disabled', true);

                    }
                });
                //$("#ODLNCode").attr("enabled", false);
                //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
                //$("#DemurrageCode").attr("enabled", false);
                //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
                //  $("#Text_DamageCondition").prop('disabled', true);
            }
            $("div[id='divMultiULDNumber']").css("width", "30em");
        }
    });

    if (EditSNo == undefined) {
        $('#HeaderName').text('New ULD Information');
        $("#btnNew").show()

    } else {
        $("#HeaderName").text("Edit ULD Information")
        $("#btnNew").hide()
        //$("#UldType").data("kendoAutoComplete").enable(false);
        $("#txt_UldNumber").attr("disabled", "disabled")
        $("#txt_OwnerCode").attr("disabled", "disabled")
    }

    //var IsInbound = $(obj).closest('tr').find('td[data-column="IsInboundSno"]').text();
    //alert(IsInbound)
    //if (IsInbound.trim() == "1".trim()) {
    //    $("#trInBound").show()
    //    $("#trOutBound").hide()
    //    $("#Text_TransferBy").val("");
    //    $("#TransferBy").val("");
    //    $("#Text_ReceivedBy").val("GA-GARUDA AIRLINE");
    //    $("#ReceivedBy").val("1");
    //    $("#Text_ULDNumber").removeAttr("data-valid")


    //} else if (IsInbound.trim() == "0".trim()) {
    //    $("#Text_ULDNumber").attr("data-valid", "requird")
    //    $("#trInBound").hide()
    //    $("#trOutBound").show()
    //    $("#Text_ReceivedBy").val("");
    //    $("#ReceivedBy").val("");
    //    $("#Text_TransferBy").val("GA-GARUDA AIRLINE");
    //    $("#TransferBy").val("1");


    //}
    ///$("#InBound").attr("disabled", "disabled")





}
$("span.k-delete").live("click", function () { RemoveULD(this) });
function RemoveULD(input) {

    //var MultipleULD = $("#Multi_ULDNumber").val().split(',').length;
    var MultipleULD = $("#Multi_ULDNumber").val()// == "" ? 0 : 1;
    MultipleULD = MultipleULD.replace(",,", ",");
    var CommoExist = MultipleULD.substr(MultipleULD.length - 1);
    if (CommoExist == ',') {
        MultipleULD = MultipleULD.substring(0, MultipleULD.length - 1);
    }
    var CommaFirstExist = MultipleULD.substr(0, 1);
    if (CommaFirstExist == ',') {
        MultipleULD = MultipleULD.substring(1, MultipleULD.length);
    }
    MultipleULD = MultipleULD.replace(",,", ",");
    MultipleULD = MultipleULD.replace(",,,", ",");
    if (MultipleULD == "") {
        $("#AirlineWiseUld").attr("disabled", false)
    }
    $("#Multi_ULDNumber").val(MultipleULD);
    $("#ULDNumber").val(MultipleULD);
    MultipleULD = MultipleULD.split(',').length;

    if (MultipleULD == 1) {
        // $('#Damaged').prop('disabled', false);
        $("#lblULDType").text('ULD Type');
    }
}
function SaveDetails() {
    cfi.ValidateSubmitSection("divMainDiv");
    if (!cfi.IsValidSection($("#divMainDiv"))) {
        return false;
    }

    var tble = $("#tblAddDamaged tbody tr").length
    var tble1 = $("#MenualtblAddDamaged tbody tr").length
    var IsServiceable = 0;
    var isAvailable = 0;
    if (EditSNo == "0") {
        if ($('.Process:checked').val() == "0") {
            SstrData = []
            for (var i = 0; i < tble - 1; i++) {

                var Uldsno = $("#Uldsno" + i).val()
                var Damaged = $("#Damaged" + i).val()
                if (Damaged == "1") {
                    IsServiceable = 0;
                } else {
                    IsServiceable = 1;
                }

                var Text_DamageCondition = $("#Text_DamageCondition" + i).val()
                var Data = {
                    UldSno: Uldsno,
                    uldIsdamage: Damaged,
                    IsAvailable: 0,
                    IsServiceable: IsServiceable,
                    uldremarks: Text_DamageCondition,
                    UldType: 0,
                    UldNumber: 0,
                    ULDCode: 0,
                }
                SstrData.push(Data)
            }
        } else if ($('.Process:checked').val() == "1") {
            SstrData = []


            for (var j = 0; j < tble1 - 1; j++) {
                var Uldsno = $("#Uldsno" + j).val()
                var MultiUldtype = Uldsno.split("-")
                var Typ = MultiUldtype[0]
                var num = MultiUldtype[1]
                var code = MultiUldtype[2]
                var Damaged1 = $("#Damaged" + j).val()

                if (Damaged1 == "1") {
                    IsServiceable = 0;
                    isAvailable = 0;
                } else {
                    IsServiceable = 1;
                    isAvailable = 1;
                }

                var Text_DamageCondition2 = $("#Text_DamageCondition" + j).val()
                var MData = {
                    UldSno: 0,
                    uldIsdamage: Damaged1,
                    IsAvailable: isAvailable,
                    IsServiceable: IsServiceable,
                    uldremarks: Text_DamageCondition2,
                    UldType: Typ,
                    UldNumber: num,
                    ULDCode: code,
                }
                SstrData.push(MData)
            }
        }
    } else {

        SstrData = []
        for (var i = 0; i < tble - 1; i++) {

            var Uldsno = $("#Uldsno" + i).val()
            var Damaged = $("#Damaged" + i).val()

            if ($('.Process:checked').val() == "1") {
                if (Damaged == "1") {
                    IsServiceable = 0;
                    isAvailable = 0;
                } else {
                    IsServiceable = 1;
                    isAvailable = 1;
                }
            }

            var Text_DamageCondition = $("#Text_DamageCondition" + i).val()
            var Data = {
                UldSno: Uldsno,
                uldIsdamage: Damaged,
                IsAvailable: isAvailable,
                IsServiceable: IsServiceable,
                uldremarks: Text_DamageCondition,
                UldType: 0,
                UldNumber: 0,
                ULDCode: 0,
            }
            SstrData.push(Data)
        }
    }

    var OneListUldOut = [];
    var UldOutViewModel = {
        ULDNumber: $("#ULDNumber").val() == "" ? 0 : $("#ULDNumber").val(),
        Text_ULDNumber: $("#Text_ULDNumber").val() == "" ? 0 : $("#Text_ULDNumber").val(),
        ULDCode: $("#ULDCode").val() == "" ? 0 : $("#ULDCode").val(),
        IssuedTo: $("#IssuedTo").val() == "" ? userContext.UserSNo : $("#IssuedTo").val(),
        ReceivedBy: $("#ReceivedBy").val() == "" ? 0 : $("#ReceivedBy").val(),
        ReceivedByCode: $("#ReceivedByCode").val() == "" ? 0 : $("#ReceivedByCode").val(),
        AirportSNo: $("#AirportSNo").val() == "" ? userContext.AirportSNo : $("#AirportSNo").val(),
        FinalDestination: $("#FinalDestination").val() == "" ? 0 : $("#FinalDestination").val(),
        DemurrageCode: $("#DemurrageCode").val() == "" ? 0 : $("#DemurrageCode").val(),
        Text_Remarks: $("#Text_Remarks").val() == "" ? 0 : $("#Text_Remarks").val(),
        UserSNo: $("#UserSNo").val() == "" ? userContext.UserSNo : $("#UserSNo").val(),
        TransferBy: $("#TransferBy").val() == "" ? 0 : $("#TransferBy").val(),
        Text_IssuedDate: $("#Text_IssuedDate").val() == "" ? 0 : $("#Text_IssuedDate").val(),
        Text_IssuedTime: $("#Text_IssuedTime").val() == "" ? 0 : $("#Text_IssuedTime").val(),
        IsInbound: $('.Process:checked').val(),
        ODLNCode: $("#ODLNCode").val() == "" ? 0 : $("#ODLNCode").val(),
        Rentaldays: $("#Rentaldays").val() == "" ? 0 : $("#Rentaldays").val(),
        LUCInNumber: $("#Text_UCRCarrierCode").val() + "-" + $("#Text_UCRNumber").val(),
    }
    OneListUldOut.push(UldOutViewModel);


    debugger;

    var action = EditSNo == "0" ? "SaveDetails" : "UpdateDetails/" + EditSNo;
    $("#btnSave").hide();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        url: "./Services/Export/UldTransfer/UldOutService.svc/" + action,
        data: JSON.stringify({ UldOut: OneListUldOut, UldOutType: SstrData, Process: $('.Process:checked').val() }),
        success: function (response) {
            if (response == "2000") {

                //Added By Shivali Thakur
                var checkedReceived = $('#InBound').attr('checked') ? true : false;
                var checkedTransferred = $('#OutBound').attr('checked') ? true : false;
                if (checkedReceived == true) {
                    AuditLogSaveNewValue("tblAdd", true, "", 'ULDNUMBER', $("span[id='listadd']").text() || '', '', 'New', userContext.TerminalSNo, userContext.NewTerminalName);

                    ShowMessage("success", "Success", "ULD Received successfully.");
                }
                else if (checkedTransferred == true) {
                    //$("#Text_ULDNumber").val() || ''
                    AuditLogSaveNewValue("tblAdd", true, "", 'ULDNUMBER', $("#divMultiULDNumber").text().split(' ')[0] || '', '', 'New', userContext.TerminalSNo, userContext.NewTerminalName);

                    ShowMessage("success", "Success", "ULD Transferred successfully.");
                }

                setTimeout(function () { location.reload(); }, 500);
            } else if (response == "2001") {
                AuditLogSaveNewValue("tblAdd", true, "", 'ULDNUMBER', $("#divMultiULDNumber").text().substring(5, 19) || '', $("#ULDNumber").val() || '', 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);

                ShowMessage("success", "Success - ULD Out", "Updated successfully.");
                setTimeout(function () { location.reload(); }, 500);
            } else if (response == "2002") {
                ShowMessage('info', 'Need your Kind Attention!', "Max 62 ULDs can be transferred");
            } else {
                ShowMessage('info', 'Need your Kind Attention!', response);
                return;
            }
        }
    });
}
function CancelDetails() {
    Default = 0;
    Dynamic = 0;


    $("#divULDInformation").html('');
    $("#tblConsumables").html('');
    $("#btnSave").hide();
}
function BackClick() {

    location.reload();
    PageLoaded()
}
function ClosePopo() {

    DefaultStoreDamagecondition()
    $("#DivAddMultipleUldAdd").data("kendoWindow").close();

}



function DefaultStoreDamagecondition() {

    var tble = $("#tblAddDamaged tbody tr").length
    var tble1 = $("#MenualtblAddDamaged tbody tr").length
    if (EditSNo == "0") {
        if ($('.Process:checked').val() == "0") {
            SstrData = []
            for (var i = 0; i < tble - 1; i++) {

                var Uldsno = $("#Uldsno" + i).val()
                var Damaged = $("#Damaged" + i).val()

                var Text_DamageCondition = $("#Text_DamageCondition" + i).val()
                var Data = {
                    UldSno: Uldsno,
                    uldIsdamage: Damaged,
                    uldremarks: Text_DamageCondition,
                }
                SstrData.push(Data)
            }
        } else if ($('.Process:checked').val() == "1") {
            SstrData = []

            for (var j = 0; j < tble1 - 1; j++) {
                var Uldsno = $("#Uldsno" + j).val()
                var MultiUldtype = Uldsno.split("-")
                var num = MultiUldtype[1]
                var Damaged1 = $("#Damaged" + j).val()
                var Text_DamageCondition2 = $("#Text_DamageCondition" + j).val()
                var MData = {
                    UldSno: num,
                    uldIsdamage: Damaged1,
                    uldremarks: Text_DamageCondition2,
                }
                SstrData.push(MData)
            }
        }
    } else {

        SstrData = []
        for (var i = 0; i < tble - 1; i++) {

            var Uldsno = $("#Uldsno" + i).val()
            var Damaged = $("#Damaged" + i).val()

            var Text_DamageCondition = $("#Text_DamageCondition" + i).val()
            var Data = {
                UldSno: Uldsno,
                uldIsdamage: Damaged,
                uldremarks: Text_DamageCondition,
            }
            SstrData.push(Data)
        }
    }
}

//Added By Shivali Thakur
function IsDamaged(uldstockSNo) {

    if (SstrData && SstrData.length > 0) {
        return $.map(SstrData, function (i) {
            if (i.UldSno == uldstockSNo && i.uldIsdamage == "1") {
                return i;
            }
        });
    } else
        return null;
}

function AddDamageCondition() {

    //if (SstrData.length != 0) {
    //    for (var k = 0; k < SstrData.length; k++) {
    //        var UldSno = SstrData[k].UldSno;
    //        var uldIsdamage = SstrData[k].uldIsdamage;
    //        var uldremarks = SstrData[k].uldremarks;
    //        var Uldsno0 = $("#Uldsno" + k).val();
    //        if (Uldsno0.length > 5) {
    //            var Uldsno0 = Uldsno0.split("-")
    //            Uldsno0 = Uldsno0[1]
    //        }
    //        if (UldSno == Uldsno0) {
    //            if (uldIsdamage == 1) {
    //                $("#Damaged" + k).attr("checked", "checked")
    //                $("#Text_DamageCondition" + k).val(uldremarks);
    //            }
    //        }
    //    }
    //}

}
function DupicateCheckUCRNumber(thisv) {

    DupicateCheckUCRUHFNumber($(thisv).val(), 1)
}
function DupicateCheckUCRUHFNumber(UCRNumber, Type) {
    $.ajax({
        url: "Services/Export/UldTransfer/UldOutService.svc/DupicateCheckUCRUHFNumber",
        async: false, type: "GET"
        , dataType: "json",
        data: { UCRNumber: UCRNumber, Type: Type }
        , contentType: "application/json;charset=utf-8", cache: false, success: function (result) {
            var resData = jQuery.parseJSON(result);
            var Data = resData.Table0;
            if (Data[0].LUCINNUMBEr != "0") {
                debugger;
                ShowMessage('info', 'Need your Kind Attention!', "Already Exists")
                $("#Text_UCRNumber").val("")
                return false;
            }


        },
        error: function (xhr) {

        }
    });
}
var footer = '<div id="divFooter" class="divFooter" style="height: 0px; padding-bottom: 30px; display: block;"><div><table style="margin-left:20px;"><tbody><tr><td> &nbsp; &nbsp;</td><td><input type="button" value="New" id="btnNew" onclick="NewClick()" class="btn btn-info"></td><td> &nbsp; &nbsp;</td><td><input type="button" style="float:right;display:none;" onclick="SaveDetails(0)" id="btnSave"  value="Save" class="btn btn-success"></td><td> &nbsp; &nbsp;</td><td><button class="btn btn-block btn-danger btn-sm" id="btnCancel" onclick="CancelDetails()">Cancel</button></td><td><input type="button" value="Back" id="btnBack" onclick="BackClick()" class="btn btn-info"></td></tr></tbody></table> </div></div><form method="post" name="aspnetForm" id="aspnetForm"><div id="DivAddMultipleUldAdd"></div></form>';

var YesReady = false;
function PageRightsCheck() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Apps.toString().toUpperCase() == "ULDOUT") {
            if (i.Apps.toString().toUpperCase() == "ULDOUT" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "ULDOUT" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "ULDOUT" && i.PageRight == "Delete") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                YesReady = true;             
                return
            }

        }
    });

    if (YesReady) {
        $('input[value="Submit"]').hide();
        $("#tblConsumables_btnUpdateAll").hide()
        $("#tblConsumables_btnAppendRow").hide()
        $('#btnNew').hide();
        $('#btnSave').hide();
        $('#btnCancel').hide();
        $('#btnBack').hide();

    }
}