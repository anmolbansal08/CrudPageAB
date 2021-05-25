/*
*****************************************************************************
Javascript Name:	BackLogCargoJS
Purpose:		    This JS used to get autocomplete for BackLogCargo.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    02 FEB 2016
Updated By:
Updated On:
Approved By:
Approved On:
* *****************************************************************************
*/
$(document).ready(function () {
    cfi.ValidateForm();
    //$('#__SpanHeader__').html("Walking Rate:")
    //$('.formbuttonrow').remove();
    var LyingListAutoFillOriginDisable = userContext.SysSetting.LyingListAutoFillOriginDisable.toUpperCase() == "TRUE";   

    $('tr').find('td.formbuttonrow').remove();
    $('tr').find('td.formActiontitle').remove(); 
    var alphabettypes = [{ Key: "0", Text: "Offloaded" }, { Key: "1", Text: "Transit" }, { Key: "2", Text: "Transfer" }, { Key: "3", Text: "RCS Not Departed" }];
    cfi.AutoCompleteByDataSource("Status", alphabettypes);
    cfi.AutoCompleteV2("SHC", "Code", "BackLogCargo_Code", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "BackLogCargo_AWBNo", null, "contains");
    cfi.AutoCompleteV2("Origin", "AirportCode,AirportName", "BackLogCargo_AirportCode", null, "contains");
    cfi.AutoCompleteV2("Range", "Limit", "BackLogCargo_Range", null, "contains");
    cfi.AutoCompleteV2("Range", "Limit", "BackLogCargo_Range", null, "contains");
    $('#Range').val(1);
    $('#Text_Range').val('LAST 10 DAYS');
    //  $("#LyingDate").val('');
    $("#LyingDate").data("kendoDatePicker").value('')

    $("input[id='Search'][name='Search']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Generate Excel' name='GenExcel' id='GenExcel' />");

    $("input[id='GenExcel'][name='GenExcel']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Send Mail' name='SendMail' id='SendMail' />");
    //$("#Text_Origin").data("kendoAutoComplete").setDefaultValue("SHJ", "SHJ-SHARJAH INTERNATIONAL AIRPORT");

    cfi.AutoCompleteV2("Destination", "AirportCode,AirportName", "BackLogCargo_AirportCode", null, "contains");
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "BackLogCargo_Airline", null, "contains");
    cfi.AutoCompleteV2("ULDNo", "ULDName", "BackLogCargo_ULDNo", null, "contains");
    //cfi.AutoComplete("ULDNo", "ULDName,SNo", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");

    $("#Origin").val(userContext.AirportCode || "");
    $("#Text_Origin").val(userContext.AirportCode + "-" + userContext.AirportName || "");
    if (LyingListAutoFillOriginDisable) {
        setTimeout(function () {
            $("#Text_Origin").data("kendoAutoComplete").enable(false);
        }, 100);
    }
    
    $("input[id='Search'][name='Search']").click(function () {
        BackLogCargoGrid();
    });

    $("input[id='SendMail'][name='SendMail']").click(function () {
        //SendData();
        GetGeneratedMail();
    });

    $("input[id='GenExcel'][name='GenExcel']").click(function () {

        SearchData();
    });
    if (!userContext.IsShowAllData && $("#Text_Origin").data("kendoAutoComplete")) {
        $("#Text_Origin").data("kendoAutoComplete").enable(true);
    }

    if (userContext.GroupName.toUpperCase() == 'GSA') {
        if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
            $("#Origin").val(userContext.CityCode);
            $("#Text_Origin").val(userContext.CityCode + '-' + userContext.CityName);
            $('#Text_Origin').data("kendoAutoComplete").enable(false);
        }
     
    }

    $('#loginForm').append();
});


//function CheckAirline()
//{

//  // $("input[id='GenExcel'][name='GenExcel']").after("<input type='button' class='btn btn-success' style='width:100px;' value='Send Mail' name='SendMail' id='SendMail' />");
//}



function BackLogCargoGrid() {
    if (cfi.IsValidSubmitSection()) {
        var SplRt = userContext.SpecialRights.LLD;
        var VAirline = $('#Airline').val();
        var VStatus = $('#Status').val();
        var VOrigin = $('#Origin').val();
        var VDestination = $('#Destination').val();
        var VSHC = $('#SHC').val();
        var VAWBNo = $('#AWBNo').val();
        var dbtableName = "BackLogCargo";
        var Airline = $("#Airline").val();
        var VULD = $("#ULDNo").val();
        var VDate = $("#LyingDate").val();
        var Range = $("#Range").val();
        var obj = [];

        $('#tbl' + dbtableName).appendGrid({
            V2: false,
            tableID: 'tbl' + dbtableName,
            contentEditable: true,
            isGetRecord: true,
            rowUpdateExtraFunction: SplRt == false ? onAppendGridLoad : null,
            tableColume: 'SNo',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 20, whereCondition: '' + VAirline + '*' + VStatus + '*' + VOrigin + '*' + VDestination + '*' + VSHC + '*' + VAWBNo + '*' + VULD +
                '*' + VDate + '*' + Range + '', sort: '',
            servicePath: './Services/Shipment/BackLogCargoService.svc',
            getRecordServiceMethod: 'GetBackLogCargoRecord',
            createUpdateServiceMethod: 'CreateUpdateBackLogCargo',
            deleteServiceMethod: 'DeleteBackLogCargo',
            caption: 'Lying List',
            initRows: 1,
            dataLoaded: true,
            isPaging: true,
            isExtraPaging: true,
            columns: [
                      { name: 'SNo', type: 'hidden',value:'0'},
                       //{ name: 'SNo',display:'Recid', type: 'label', value: 'SNo',  },
                       {
                           name: '', oldvalue: 'SNo', display: 'Action', type: 'button', ctrlCss: { width: '44px', height: '51px' }, value: 'delete', isRequired: false, onClick: function (e, i) {
                               var id = $(e.target).attr("id").split("_")[2];
                               variableset(id)
                               // var val = $("#tblBackLogCargo__" + id).val();
                               // //var tdl = $("#tblBackLogCargo__" + id).parent("td").index();
                               //var username =  userContext.FirstName + ' ' + userContext.LastName + '(' + userContext.UserName + ')'
                               // var offsno = $("#tblBackLogCargo_SNo_" + id).val().trim();
                               // var AWbNo = $("#tblBackLogCargo_AWBNo_" + id).text().trim();
                               // var Remarks = $("#tblBackLogCargo_Remarks_" + id).val().toUpperCase().trim();
                               // var Pieces  =    $("#tblBackLogCargo_TotalPc_" + id).text().trim();
                               // var FlightNo =   $("#tblBackLogCargo_FlightNo_" + id).text().trim();
                               // var FlightDate =   $("#tblBackLogCargo_FlightDate_" + id).text().trim();
                               // var GrossWeight =   $("#tblBackLogCargo_GrossWeight_" + id).text().trim();
                               // obj = [offsno, AWbNo, username, Remarks, Pieces, FlightNo, FlightDate, GrossWeight]
                               //  offsno : 
                               // AWbNo  :
                               //Remarks    :
                               //Pieces     :
                               //FlightNo   :
                               //FlightDate :
                               //GrossWeight:
                               // }
                               //if (Remarks != "") {
                               //    ////  $("#tblBackLogCargo__" + id).parents('tr').hide();
                               //    deletefromoffload(obj);
                               //} else {
                               //    ShowMessage('warning', 'Warning - Remarks is Required.', "Kindly Add Reamrks !");


                               //}
                           }
                       },
                      { name: 'Remarks', display: 'Remarks', type: "textarea", ctrlCss: { width: "160px", height: '43px' }, ctrlAttr: { controltype: "alphanumeric", maxlength: 200, onblur: "return OnBlur(this);", onClick: "return Onclickchange(this);" } },
                      { name: 'Airline', display: 'Airline', type: 'label', },

                      { name: 'Origin', display: 'AWB Org', type: 'label' },
                      { name: 'Destination', display: 'AWB Dest', type: 'label' },
                      { name: 'Station', display: 'Station', type: 'label' },
                      { name: 'FlightNo', display: 'Flight No', type: 'label' },
                      { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: "160px" } },
                      { name: 'AWBNo', display: 'AWB No', type: 'label', ctrlCss: { width: "160px" } },
                      //

                      { name: 'TotalPc', display: 'Total Pcs', type: 'label' },
                      { name: 'GrossWeight', display: 'Gr. Wt', type: 'label' },
                      { name: 'VolumeWeight', display: 'Vol.Wt', type: 'label' },
                     { name: 'NOG', display: 'Nature of Goods', type: 'label', ctrlCss: { width: "50px", height: "20px" } },
                      { name: 'SHC', display: 'SHC', type: 'label' },
                      { name: 'Status', display: 'Status', type: 'label' },
                      { name: 'OffloadFrom', display: 'Offloaded From', type: 'label' },
                       { name: 'ULD', display: 'ULD No', type: 'label' },
                         { name: 'OffloadSince', display: 'Arr/Acc Date Time', type: 'label' },
                           { name: 'Diffdays', display: 'Pending Days', type: 'label' },
                           { name: 'LyingPc', display: 'Lying at ' + userContext.AirportCode + ' -Pcs/Gross Wt', type: 'label' }

            ],

            hideButtons: { append: true, remove: true, removeLast: true, insert: true, updateAll: true },
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
                $('#tblBackLogCargo tbody td').css('white-space', 'normal', 'important');
                $('#tblBackLogCargo_divStatusMsg_0').remove();
                $('#_loading').after('<div id="tblBackLogCargo_divStatusMsg_0" style="float: right; padding-right: 10px;">' + $('#tblBackLogCargo_divStatusMsg').html() + '</div>');
                $('#tblBackLogCargo tfoot tr').show();
                $('input[type="button"][id^="tblBackLogCargo__"]').attr("value", "Delete")
                var perm = userContext.SysSetting.IsLyingListbtnhide;
                if (perm == '0') {
                    $('#tblBackLogCargo tr > td:contains(Action) ').closest("td").remove();
                    $('#tblBackLogCargo tr > td:contains(Remarks) ').closest("td").remove();
                    $('input[type="button"][id^="tblBackLogCargo__"]').removeAttr('value');

                    $('input[type="button"][id^="tblBackLogCargo__"]').parents("td").remove();
                    $('input[type="textarea"][id^="tblBackLogCargo_Remarks_"]').parents("td").remove();

                }
            },
        });
        $('#tblBackLogCargo_divStatusMsg_0').remove();
        $('#_loading').after('<div id="tblBackLogCargo_divStatusMsg_0" style="float: right; padding-right: 10px;">' + $('#tblBackLogCargo_divStatusMsg').html() + '</div>');
    }

}

function Onclickchange(_this) {
     $(_this).css("background-color", "#FFBFFF");
}
function OnBlur(_this) {
    $(_this).css("background-color", "#ffffff");
}
//$('input[type="button"][id^="tblBackLogCargo__"]').click(function (e) {
function variableset(id) {
    var obj = [];
    //var id = $(e.target).attr("id").split("_")[2];
    //var id = $(e.target).attr("id").split("_")[2];
    var Username = userContext.FirstName + ' ' + userContext.LastName + '(' + userContext.UserName + ')';
    var Remarks = $("#tblBackLogCargo_Remarks_" + id).val().toUpperCase().trim();
    var val = $("#tblBackLogCargo__" + id).val();
    //var tdl = $("#tblBackLogCargo__" + id).parent("td").index();
    var offload = {
        username: Username,
        offsno: $("#tblBackLogCargo_SNo_" + id).val().trim().toString(),
        AWbNo: $("#tblBackLogCargo_AWBNo_" + id).text().trim().toString(),
        Remarks: Remarks,
        Pieces: $("#tblBackLogCargo_TotalPc_" + id).text().trim().toString(),
        FlightNo: $("#tblBackLogCargo_FlightNo_" + id).text().trim(),
        FlightDate: $("#tblBackLogCargo_FlightDate_" + id).text().trim(),
        GrossWeight: $("#tblBackLogCargo_GrossWeight_" + id).text().trim(),
        //obj = [offsno, AWbNo, username, Remarks, Pieces, FlightNo, FlightDate, GrossWeight]
    };
    obj.push(offload);
    if (Remarks != "") {
        ////  $("#tblBackLogCargo__" + id).parents('tr').hide();
        deletefromoffload(obj);
        $("#tblBackLogCargo_Remarks_" + id).parents('tr').remove();
    } else {
        ShowMessage('warning', 'Warning - Remarks is Required.', "Kindly Add Remarks !");
        return;

    }

};

function deletefromoffload(obj) {
    $.ajax({
        url: "./Services/Shipment/BackLogCargoService.svc/deletefromoffload",
        async: false,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({ obj }),
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (result) {
            var ResultStatus = result;
         
            if (ResultStatus == "0") {
              
                ShowMessage('success', 'Success - Lying List !', "Pieces deleted  Successfully");
                
                // navigateUrl('Default.cshtml?Module=Shipment&Apps=UldStack&FormAction=INDEXVIEW');
            }
            else if (ResultStatus == "1001") {
                ShowMessage('warning', 'Warning - Lying List !', ' Cannot delete  Pieces');
            }
            else {
                ShowMessage('info', 'Info - Lying List !',' Related Information Not Found.');
            }
        }
    });
    return true;

}


function SearchData() {
    var obj = {
        Airline: $("#Airline").val(),
        Status: $("#Status").val(),
        Origin: $("#Origin").val(),
        Destination: $("#Destination").val(),
        SHC: $("#SHC").val(),
        AWBNo: $("#AWBNo").val(),
        ULD: $("#ULDNo").val(),
        FlightDate: $("#LyingDate").val(),
        Range: $("#Range").val()
    }
    var whereCondition = obj.Airline + '*' + obj.Status + '*' + obj.Origin + '*' + obj.Destination + '*' + obj.SHC + '*' + obj.AWBNo + '*' + obj.ULD + '*' + obj.FlightDate + '*' + obj.Range;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "./Services/Shipment/BackLogCargoService.svc/GetBackLogCargoRecord?recid="+1+"&pageNo="+1+"&pageSize="+10000+"&whereCondition="+whereCondition+"&sort="+"",
        //data: JSON.stringify(obj),
        success: function (response) {
            var dt = response.value;
            if (response.key > 0) {

                var str = "<html><table border=\"1px\">";
                str += "<tr ><td>Airline</td><td>AWBOrigin </td><td>AWBDestination</td><td>Station</td><td>Flight No</td> <td>Flight Date</td><td>AWB No</td><td>Total Pieces</td><td>GrossWeight</td><td>VolumeWeight</td><td>Nature of Goods</td><td>SHC</td><td>Status</td><td>Offloaded From</td> <td>ULD</td><td>Arr/Acc Date Time</td><td>Pending Days</td><td>Lying at " + $('#Origin').val() + "- PCs/Gross Wt</td> </tr>"

                for (var i = 0; i < dt.length; i++) {
                    str += "<tr><td>" + dt[i].Airline + "</td><td>" + dt[i].Origin + "</td><td>" + dt[i].Destination + "</td><td>" + dt[i].Station + "</td><td>" + dt[i].FlightNo
                        + "</td><td>'" + dt[i].FlightDate + "</td><td>" + dt[i].AWBNo
                        //+ "</td><td>" + response[i].SLI
                        + "</td><td>" + dt[i].TotalPc + "</td><td>" + dt[i].GrossWeight
                       
                         + "</td><td>" + dt[i].VolumeWeight + "</td><td>" + dt[i].NOG + "</td><td>" + dt[i].SHC
                          + "</td><td>" + dt[i].Status + "</td><td>" + dt[i].OffloadFrom
                          + "</td><td>" + dt[i].ULD
                           + "</td><td>'" + dt[i].OffloadSince + "</td><td>" + dt[i].Diffdays + "</td><td>" + dt[i].LyingPc
                        + "</td></tr>"
                }
                str += "</table></html>";
                var data_type = 'data:application/vnd.ms-excel';

                var postfix = "";

                var a = document.createElement('a');
                a.href = data_type + ' , ' + encodeURIComponent(str);
                a.download = 'Lying List.xls';

                a.click();


            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}


function InitiateMail() {


    var L = '';
    for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
    { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }
    $("#ccmail").val(L.substring(0, L.length - 1));
    if ($("#addlist1 li").length > 0)
        $("#txtEmail").removeAttr("data-valid");



    var MailTo = $("#mailto").val().toUpperCase();

    if (MailTo == "") {
        ShowMessage('info', 'Info - Recipient Email Is Required !', "Email Address not found.");
        return;
    }


    //$("#mailto").blur(function () {
    if (ValidateEMail(MailTo)) {
    }
    else {
        ShowMessage('warning', 'Warning - Lying List !', "Please Add Valid Email Address.");
        $("#mailto").val('');
        return false;
    }
   // });
   



    var CC = $("#ccmail").val().toUpperCase();


    var Subject = $("#subjmail").val().toUpperCase();
    if (Subject == "") {
        ShowMessage('info', 'Info - Subject Is Required!!', "Kindly Write Subject of Mail.");
        return;
    }

    var Content = $("#msgContent").val().toUpperCase();
    if (Content == "") {
        ShowMessage('info', 'Info - Content Is Required', "Kindly Add Content of Mail.");
        return;

    }
    

    var obj = {
        Airline: $("#Airline").val(),
        Status: $("#Status").val(),
        Origin: $("#Origin").val(),
        Destination: $("#Destination").val(),
        SHC: $("#SHC").val(),
        AWBNo: $("#AWBNo").val(),
        ULD: $("#ULDNo").val(),
        FlightDate: $("#LyingDate").val(),
       
    }

    var objRequest={
        MailTo: $("#mailto").val().toUpperCase(),
        CC: $("#ccmail").val().toUpperCase(),
        Subject: $("#subjmail").val().toUpperCase(),
        Content: $("#msgContent").val().toUpperCase(),
        BackLogCargo:obj
    };

    if ($("#Airline").val() != "") {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            url: "./Services/Shipment/BackLogCargoService.svc/SendData",
            data: JSON.stringify(objRequest),
            success: function (response) {
                if (response.length > 0) {
                    ShowMessage("success", "", "Mail Sent Successfully !!");
                    $("#mailto").val(""),
                     $("#divmailAdd").empty(""),
                     $("#subjmail").val(""),
                     $("#msgContent").val(""),
                    $("#Text_Origin").val(""),
                   $("#Text_Airline").val("")
                    ClosePopUpSCM();
                }
                else {
                    ShowMessage("info", "", "No Data Found...");
                }
            }

        });
    }
    else {
        ShowMessage("info", "", "Please Select Airline");
    }
}


function GetGeneratedMail() {
    $("#addlist1").find("li").remove();
   
    if ($("#divGeneratedSCM").length === 0) {

        $("#loginForm").append("<div id='divGeneratedSCM'></div>")
        $("#divGeneratedSCM").html('<center><table id="tblGeneratedSCM" style="width:100%;"> <tr><th align="left"  style="width:20%;">MAIL TO<font color="red">*</font> :</th><td><input id="mailto" class="k-input" maxlength="61" type="text" style="width:95%;text-transform:uppercase;" /></td></tr><tr><th align="left" valign="top">CC<font color="red"></font> :</th><td><input type="hidden" id="ccmail" name="ccmail" /><input id="txtEmail" class="k-input" maxlength="50" style="width:95%;text-transform:uppercase;" type="text"/><br/><span class="k-label"><strong>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</strong></span><br/><div id="divmailAdd" style="overflow:auto;"><ul id="addlist1" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div></td></tr> <tr><th align="left" valign="top">SUBJECT <font color="red">*</font>:</th><td><input type="hidden" id="subniil" name="subniil" /><input id="subjmail" class="k-input" maxlength="50" style="width:95%;;text-transform:uppercase;" type="text"/><br/><div id="divsitaAdd" style="overflow:auto;"><ul id="addlist" style="padding:3px 2px 2px 0px;margin-top:0px;"></ul></div></td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><th align="left">Content<font color="red">*</font>:</th><td><textarea  id="msgContent" style="height:auto;min-width:94%; min-height:100px; width:auto; height:auto;"></textarea></td></tr><tr><td align="center" colspan="2"><input type="button" class="btn btn-block btn-info" value="SEND MAIL" onclick="InitiateMail();" />&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUpSCM();" /></td></tr></table><center>');
    }

   

    cfi.PopUp("tblGeneratedSCM", "Send Mail", 830, null, null, 10);
    $("#tblGeneratedSCM").parent("div").css("position", "fixed");

    
    fnSetEmail();
    FnNotAllowedEnterKey();
    

}
function ClosePopUpSCM() {
    $("#tblGeneratedSCM").data("kendoWindow").close();
}

    function ValidateEMail(email) {
        var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
        return regex.test(email);
    }

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

 
    function fnSetEmail() {
        $("#txtEmail").keyup(function (e) {
            var addlen = $("#txtEmail").val().toUpperCase();
            var iKeyCode = (e.which) ? e.which : e.keyCode
            if (iKeyCode == 32) {
                addlen = addlen.slice(0, -1);
                if (addlen != "") {
                    if (ValidateEMail(addlen)) {
                        if ($("ul#addlist1 li").length < 10) {
                            var listlen = $("ul#addlist1 li").length;
                            $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");

                        }
                        else {
                            ShowMessage('info', 'Info - Lying List', "Maximum 10 E-mail Addresses allowed.");
                        }
                        $("#txtEmail").val('');
                    }
                    else {
                        alert("Please enter valid Email Address");
                    }
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
        var currentcity = userContext.CitySNo;
       
        var filter1 = cfi.getFilter("AND");
       
        if (textId == "Text_AWBNo") {
            var filter1 = cfi.getFilter("AND");
            cfi.setFilter(filter1, "OriginCitySNo", "eq", currentcity);
          
            //cfi.setFilter(filter1, "AWBNo", "notin", $("#AWBNo").val());
            filterCitySNo = cfi.autoCompleteFilter([filter1]);
            return filterCitySNo;
        }
          
        
   
    }

    function onAppendGridLoad() {
        //$('#tblBackLogCargo thead tr td:eq(2)').closest('td').hide();
        //$('#tblBackLogCargo thead tr td:eq(3)').closest('td').hide();
        $('#tblBackLogCargo tbody').find('[id^=tblBackLogCargo__]').closest('td').hide();
        $('#tblBackLogCargo tbody').find('[id^=tblBackLogCargo_Remarks_]').closest('td').hide();

    }