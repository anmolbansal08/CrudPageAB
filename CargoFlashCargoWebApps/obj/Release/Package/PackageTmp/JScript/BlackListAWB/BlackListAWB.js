


$(document).ready(function () {

    //cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "AirlineCode", "CarrierCode", ["CarrierCode", "AirlineName"], null, "contains");

    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("OfficeSNo", "SNo,Name", "vw_Office", "SNo", "Name", null, null, "contains");

    cfi.AutoComplete("AgentSNo", "SNo,Name", "AllotmentAgents", "SNo", "Name", null, "contains");

    cfi.AutoComplete("AWbNo", "AWBNo", "vwAWBStock_getAwbNoForBlacklist", "SNo", "AWBNo", ["AWBNo"], null, "contains");

    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    $('#BlackList').css('display', 'none');
    $('.DateWiseRow').hide();
    $('.AWBNoRow').hide();
    $('#btnSearch').hide();
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    $('input[type=radio][name=Filter]').change(function () {
        if (this.value == 'A') {
            $('.DateWiseRow').hide();
            $('.AWBNoRow').show();
            $('#btnSearch').show();
            $("#BlackListTbl").remove();

            $('#Text_AWbNo_input').val('')
            $('#Text_AirlineSNo_input').val('');
            $("#Text_OfficeSNo_input").val('');
            $("#Text_CitySNo_input").val('');
            $("#Text_AgentSNo_input").val('');
            $('#Text_AWbNo').val('');
        }
        else if (this.value == 'D') {
            $('.DateWiseRow').show();
            $('.AWBNoRow').hide();
            $('#btnSearch').show();

            $('#Text_AWbNo_input').val('')
            $("#BlackListTbl").remove();
            $('#Text_AirlineSNo_input').val('');
            $("#Text_OfficeSNo_input").val('');
            $("#Text_CitySNo_input").val('');
            $("#Text_AgentSNo_input").val('');
            $('#Text_AWbNo').val('');
        }
        else {
            $('.DateWiseRow').hide();
            $('.AWBNoRow').show();
        }
    });



    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);
    //var validfromdate = $("#FromDate").data("kendoDatePicker");
    //validfromdate.min(todaydate);



});


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0")
        cfi.setFilter(filterAirline, "IsActive", "eq", "1")
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;

    }

    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        // Is Active Coming From View
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_AgentSNo") {
        try {
            cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
            cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key())
            cfi.setFilter(filterAirline, "IsBlacklist", "eq", 0);
            // Is Active Coming From View
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_AWbNo") {
        try {
            //cfi.setFilter(filterAirline, "StockStatus", "lt", 4)
            //cfi.setFilter(filterAirline, "IsUsed", "eq", 0)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}


function SearchBlackListAWB() {

    var Type = $("input[name='Filter']:checked").val();
    if (Type == "D") {

        //$("#Text_AWbNo").attr('data-valid', 'required');
        $("#Text_AWbNo").removeAttr('data-valid');
        $("#Text_AWbNo_input").removeAttr('data-valid');

        $("#Text_AirlineSNo").attr('data-valid', 'required');
        $("#Text_AirlineSNo_input").attr('data-valid', 'required');
        $("#FromDate").attr('data-valid', 'required');
        $("#ToDate").attr('data-valid', 'required');
    }
    else {
        $("#Text_AirlineSNo").removeAttr('data-valid');
        $("#Text_AirlineSNo_input").removeAttr('data-valid');
        $("#FromDate").removeAttr('data-valid');
        $("#ToDate").removeAttr('data-valid');

        $("#Text_AWbNo").attr('data-valid', 'required');
        $("#Text_AWbNo_input").attr('data-valid', 'required');
    }
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    var AirlineSNo = $('#AirlineSNo').val();
    var OfficeSNo = $("#OfficeSNo").val() == null ? "" : $("#OfficeSNo").val();
    var CitySNo = $("#CitySNo").val() == null ? "" : $("#CitySNo").val();
    var AccountSNo = $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val();
    var StockType = $("input[name='StockType']:checked").val();
    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();
    var AWbNo = $('#Text_AWbNo').val();
    var WhereCondition = "";
    var OrderBy = "";

    if (AWbNo != "") {

        if (AWbNo.length < 12) {
            //  alert("Start Range Lenght Must be Seven Character");
            alert(" AWB Length is in Invalid Format.");

            return false;
        }
        else if ((AWbNo.split('-')[1].substring(0, 7) % 7) != AWbNo.split('-')[1].substring(7, 8)) {
            alert("AWB No is  Invalid.");
            $("#Text_AWbNo").val('');
            return false;
        }
    }

    if (Type == "A") {
        AirlineSNo = "";
        OfficeSNo = "";
        CitySNo = "";
        AccountSNo = "";
    }
    else {
        $('#Text_AWbNo').val('');
    }


    $("#BlackListTbl").remove();

    if (AirlineSNo != "" || AWbNo != "") {
        $.ajax({
            url: 'GetRecordBlackListAWB',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AirlineSNo: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AccountSNo: AccountSNo, StockType: StockType, FromDate: FromDate, ToDate: ToDate, AWbNo: AWbNo, WhereCondition: WhereCondition, OrderBy: OrderBy, Type: Type
            },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var DivID = document.getElementById("BindBlakListTable");
                DivID.innerHTML = "";
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'><input type='checkbox' id='allcb' name='allcb'  /></th><th bgcolor='lightblue'>AWBNo</th><th bgcolor='lightblue'>Stock Type</th><th bgcolor='lightblue'>AWB Type</th><th bgcolor='lightblue'>City Name</th><th bgcolor='lightblue'>Office Name </th><th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>Created Date</th><th bgcolor='lightblue'>Issue Date</th><th bgcolor='lightblue'>Stock Status</th><th bgcolor='lightblue'><span><font color='red'>*</font></span>Remarks</th></tr></thead>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += " <tbody><tr>";
                        str += "<td><input type='checkbox' id='cb1_" + i + "'name='cb1' class='test'/></td>"
                        str += "<td><label id='AWBNo_" + i + "'>" + result.Data[i].AWBNo + "</label></td>"
                        str += "<td>" + result.Data[i].StockType + "</td>";
                        str += "<td>" + result.Data[i].AWBType + "</td>";
                        str += "<td>" + result.Data[i].CityName + "</td>";
                        str += "<td>" + result.Data[i].OfficeName + "</td>";

                        str += "<td>" + result.Data[i].AgentName + "</td>";
                        str += "<td>" + result.Data[i].Createddate + "</td>";
                        str += "<td>" + result.Data[i].IssueDate + "</td>";
                        str += "<td>" + result.Data[i].StockStatus + "</td>";
                        str += "<td><textarea type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300'  ></textarea></td>";
                        str += "</tr></tbody>";
                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='11'><center><p style='color:red'>Not Exists</p></center></td>";
                    str += "</tr></tbody>";
                }
                str += "</table>";
                DivID.innerHTML = str;
                // $('#BindBlakListTable').append(str);


                $('#allcb').change(function () {

                    if ($(this).prop('checked')) {

                        $('tbody tr td input[type="checkbox"]').each(function () {
                            $(this).prop('checked', true);
                        });
                    } else {
                        $('tbody tr td input[type="checkbox"]').each(function () {
                            $(this).prop('checked', false);
                        });
                    }
                });

                $('#BlackList').css('display', 'block');



                //$('#Text_AirlineSNo_input').val('');
                //$("#Text_OfficeSNo_input").val('');
                //$("#Text_CitySNo_input").val('');
                //$("#Text_AgentSNo_input").val('');

                //$('#Text_AWbNo').val('');


                return false
            },
            //error: function (xhr) {
            //    var a = "";
            //}
        });
    }
}


function UpdateBlackListAwbNo() {
    var tableControl = document.getElementById('BlackListTbl');
    var arrayOfValues = [];
    for (var i = 0; i < $('[id^="cb1_"]').length ; i++) {
        if ($("#cb1_" + i).is(':checked')) {
            //AWBNo = AWBNo + $("#AWBNo_" + i).text() + ",";
            //Remaks = Remaks + $("#txtRemarks_" + i).text() + ",";
            if ($("#txtRemarks_" + i).val() == "") {
                ShowMessage('warning', 'warning - BlackList AWB', "Remarks Cannot be blank !");
                $("#txtRemarks_" + i).focus();
                return false;
            }
            var Array = {
                AWBNo: $("#AWBNo_" + i).text(),
                Remarks: $("#txtRemarks_" + i).val()
            }

            arrayOfValues.push(Array);
        };
    }

    //$('.test:checkbox:checked', tableControl).map(function () {
    //    alert($(this));
    //    var Array = {
    //        AWBNo: $(this).parent().next().text()
    //    };
    //    arrayOfValues.push(Array);
    //});


    if (arrayOfValues.length > 0) {

        $.ajax({
            url: "UpdateGetRecordBlackListAWB", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AwbNoList: arrayOfValues }),
            success: function (result) {

                var GetSucessResult = JSON.parse(result).Table0[0].Column1;
                if (GetSucessResult == 0) {
                    //alert("AWB BlackListed Sucessfully !");
                    $('#Text_AWbNo').val('')
                    $("#BlackListTbl").remove();
                    ShowMessage('success', 'Success - BlackList AWB !', "AWB BlackListed Sucessfully  !!");


                    // HtmlLoad();
                }
                else {

                }
            }
        });
    }
    else {
        //alert('Please Check atlease One AWB No')
        ShowMessage('warning', 'warning - Black List AWB', "Please Check atlease One AWB No !");
    }
}


function onDataBound(e) {
    var view = this.dataSource.view();
    for (var i = 0; i < view.length; i++) {
        if (checkedIds[view[i].id]) {
            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
              .addClass("k-state-selected")
              .find(".checkbox")
              .attr("checked", "checked");
        }
    }
}



function ShowMessage(msgType, title, htmlText, position, width, logout) {

    if (htmlText != "") {
        CallMessageBox(msgType, title, htmlText, position, undefined, undefined, undefined, width, logout);
    }
}
function CallMessageBox(msgType, title, msg, position, fadeInTime, fadeOutTime, timeout, width, logout) {

    if (fadeInTime == undefined)
        fadeInTime = 300;
    if (fadeOutTime == undefined)
        fadeOutTime = 1000;
    if (timeout == undefined)
        timeout = 6000;
    if (width == undefined)
        width = "300px";
    if (position == undefined)
        position = "cfMessage-top-right";
    else
        position = "cfMessage-" + position.toLowerCase();
    InvokeMsg.options = {
        "debug": false,
        "positionClass": position,
        "onclick": null,
        "fadeIn": fadeInTime,
        "fadeOut": fadeOutTime,
        "timeOut": timeout,
        "width": width,
        "logout": logout

    }
    InvokeMsg[msgType](msg, title)

}


















///*--------------------------To check Dates ---------------------------------------------- */
//$("input[id^=FromDate]").change(function (e) {
//    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
//    var dfrom = new Date(Date.parse(k));
//    var validFrom = $(this).attr("id").replace("From", "To");
//    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
//    var dto = new Date(Date.parse(k));
//    if (dfrom > dto) {
//        var todaydate = new Date();
//        //validTodate.min(todaydate);
//        //validTodate.max(dto);
//    }
//    else {
//        var todaydate = new Date();
//        var validTodate = $("#ToDate").data("kendoDatePicker");
//        validTodate.min(dfrom);
//    }


//});
//$("input[id^=ToDate]").change(function (e) {
//    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
//    var dto = new Date(Date.parse(k));
//    var validFrom = $(this).attr("id").replace("To", "From");
//    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
//    var dfrom = new Date(Date.parse(k));
//    if (dfrom > dto) {
//        var todaydate = new Date();
//        var validTodate = $("#ToDate").data("kendoDatePicker");
//        validTodate.min(validFrom);
//        validTodate.max(dfrom);
//    }
//    else {
//        var todaydate = new Date();
//        var validTodate = $("#FromDate").data("kendoDatePicker");
//        validTodate.min(todaydate);
//        validTodate.max(dto);
//    }

//});
///*--------------------------To Check Dates---------------------------------------------- */