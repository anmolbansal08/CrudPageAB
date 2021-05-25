


$(document).ready(function () {



    cfi.AutoCompleteV2("AWBPrefix", "CarrierCode,AirlineName", "BlacklistAWBHistoryReport_Airline", null, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "BlacklistAWBHistoryReport_City", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "Name", "BlacklistAWBHistoryReport_Office", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "Name", "BlacklistAWBHistoryReport_Agent", null, "contains");
    cfi.AutoCompleteV2("AWbNo", "AWBNo", "BlacklistAWBHistoryReport_AWBNo", null, "contains");



    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

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
            $('#Text_AWBPrefix_input').val('');
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
            $('#Text_AWBPrefix_input').val('');
            $("#Text_OfficeSNo_input").val('');
            $("#Text_CitySNo_input").val('');
            $("#Text_AgentSNo_input").val('');
            $('#Text_AWbNo').val('');


            if (userContext.GroupName == "AGENT") {

                $('#AWBPrefix').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
                $('#Text_AWBPrefix_input').val(userContext.AirlineName);

                $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
                $('#Text_OfficeSNo_input').val(userContext.OfficeName);


                $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
                $('#Text_CitySNo_input').val(userContext.CityName);


                $('#AgentSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
                $('#Text_AgentSNo_input').val(userContext.AgentName);



                cfi.EnableAutoComplete('AWBPrefix', false, false, null);//diasble
                cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
                cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
                cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble

            }
            else if (userContext.GroupName == "GSA" || userContext.GroupName == "GSSA") {

                $('#AWBPrefix').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
                $('#Text_AWBPrefix_input').val(userContext.AirlineName);

                $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
                $('#Text_OfficeSNo_input').val(userContext.OfficeName);


                $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
                $('#Text_CitySNo_input').val(userContext.CityName);




                cfi.EnableAutoComplete('AWBPrefix', false, false, null);//diasble
                cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
                cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
                // cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble

            }
            else { }

        }
        else {
            $('.DateWiseRow').hide();
            $('.AWBNoRow').show();
        }
    });


    var todaydate = new Date();
    var validTodate = $("#ToDate").data("kendoDatePicker");
    validTodate.min(todaydate);

    //---------------------------------Group Wise Disabled-----------------------

    //$("#FromDate").change(function () {

    //    $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //    $("#ToDate").data("kendoDatePicker").value('');
    //});

    $("#FromDate").change(function () {

        //if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        //    $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        //    $("#ToDate").data("kendoDatePicker").value('');
        //}
        //else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
        //    $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        //}


        if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }
        else if (Date.parse($("#FromDate").val()) < Date.parse($("#ToDate").val())) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
        else if (isNaN(Date.parse($("#ToDate").val())) == true) {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
            $("#ToDate").data("kendoDatePicker").value('');
        }



    });
});


function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");

    if (textId == "Text_AWBPrefix") {
        cfi.setFilter(filter, "IsInterline", "eq", "0")
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
        return OriginCityAutoCompleteFilter2;

    }

    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filter, "AirlineCode", "eq", $("#Text_AWBPrefix").data("kendoComboBox").key());
        cfi.setFilter(filter, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_AgentSNo") {
        try {
            cfi.setFilter(filter, "AirlineCode", "eq", $("#Text_AWBPrefix").data("kendoComboBox").key());
            cfi.setFilter(filter, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key())
            cfi.setFilter(filter, "IsBlacklist", "eq", 0);
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_AWbNo") {
        try {
            //if (userContext.GroupName == 'ADMIN' || userContext.GroupName == 'SUPER ADMIN')
            if (userContext.GroupName.indexOf('ADMIN') >= 0) {    //Comment By Akash bcz of Super Admin

                cfi.setFilter(filter, "StockStatus", "eq", 14)
            }
            else if (userContext.GroupName == 'FORWARDER') {
                cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)
                cfi.setFilter(filter, "StockStatus", "eq", 14)

            }
            else if (userContext.GroupName == 'ACCOUNTS' || userContext.GroupName == "AGENT") {
                cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)
                cfi.setFilter(filter, "StockStatus", "eq", 14)

            }
            else if (userContext.GroupName == 'OFFICE' || userContext.GroupName == "GSA" || userContext.GroupName == "GSSA") {
                cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                cfi.setFilter(filter, "StockStatus", "eq", 14)
            }
            else {
                //cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                //cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                //cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)
                //cfi.setFilter(filter, "StockStatus", "eq", 14)

            }
            var RT_Filter = cfi.autoCompleteFilter(filter);
            return RT_Filter;
        }
        catch (exp)
        { }
    }









}

var Model = [];
function SearchBlackListAWB() {




    if (Date.parse($("#FromDate").val()) > Date.parse($("#ToDate").val())) {
        ShowMessage('warning', 'warning - Black List AWB', "From Date can not be greater than To Date !");
        //alert('From Date can not be greater than To Date');
        return false;;
    }
    Model = {
        AWBPrefix: $("#AWBPrefix").val() == "" ? 0 : $("#AWBPrefix").val() == undefined ? 0 : $("#AWBPrefix").val(),
        OfficeSNo: $("#OfficeSNo").val() == "" ? 0 : $("#OfficeSNo").val() == undefined ? 0 : $("#OfficeSNo").val(),
        CitySNo: $("#CitySNo").val() == "" ? 0 : $("#CitySNo").val() == undefined ? 0 : $("#CitySNo").val(),
        AgentSNo: $("#AgentSNo").val() == "" ? 0 : $("#AgentSNo").val() == undefined ? 0 : $("#AgentSNo").val(),
        StockType: $("input[name='StockType']:checked").val(),
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        AWBNo: $('#Text_AWbNo').val() == "" ? "0" : $("#Text_AWbNo").val() == undefined ? "0" : $("#Text_AWbNo").val(),
        Type: $("input[name='Filter']:checked").val()
    };

    if (Model.Type == "D") {
        $("#Text_AWbNo").removeAttr('data-valid');
        $("#Text_AWbNo_input").removeAttr('data-valid');
        $("#Text_AWBPrefix").attr('data-valid', 'required');
        $("#Text_AWBPrefix_input").attr('data-valid', 'required');
        $("#FromDate").attr('data-valid', 'required');
        $("#ToDate").attr('data-valid', 'required');


        if (userContext.GroupName == 'ACCOUNTS') {
            $("#Text_AWBPrefix").removeAttr('data-valid');
            $("#Text_AWBPrefix_input").removeAttr('data-valid');
            $("#FromDate").removeAttr('data-valid');
            $("#ToDate").removeAttr('data-valid');
        }
        else if (userContext.GroupName == 'OFFICE') {
            $("#Text_AWBPrefix").removeAttr('data-valid');
            $("#Text_AWBPrefix_input").removeAttr('data-valid');
            $("#FromDate").removeAttr('data-valid');
            $("#ToDate").removeAttr('data-valid');
        }


    }
    else {
        $("#Text_AWBPrefix").removeAttr('data-valid');
        $("#Text_AWBPrefix_input").removeAttr('data-valid');
        $("#FromDate").removeAttr('data-valid');
        $("#ToDate").removeAttr('data-valid');

        $("#Text_AWbNo").attr('data-valid', 'required');
        $("#Text_AWbNo_input").attr('data-valid', 'required');
    }
    if (!cfi.IsValidSubmitSection()) {
        return false;
    }
    if (Model.AWBNo != "" && Model.AWBNo != "0") {

        if (Model.AWBNo.length < 12) {
            //  alert("Start Range Lenght Must be Seven Character");
            alert("AWB Length is in Invalid Format.");

            return false;
        }
        else if ((Model.AWBNo.split('-')[1].substring(0, 7) % 7) != Model.AWBNo.split('-')[1].substring(7, 8)) {
            alert("AWB No is  Invalid.");
            $("#Text_AWbNo").val('');
            return false;
        }
    }

    if (Model.Type == "A") {
        Model.AWBPrefix = "0";
        Model.OfficeSNo = "";
        Model.CitySNo = "";
        Model.AccountSNo = "";

    }
    else {
        $('#Text_AWbNo').val('');
    }


    $("#BlackListTbl").remove();

    if (Model.AWBPrefix != "" || Model.AWBNo != "") {
        $.ajax({
            url: 'GetRecordBlackListAWBHistory',
            async: true,
            type: "POST",
            method: 'POST',
            dataType: "json",
            data: JSON.stringify(Model),
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var DivID = document.getElementById("BindBlakListTable");
                DivID.innerHTML = "";
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><th bgcolor='lightblue'>AWB No</th><th bgcolor='lightblue'>Stock Type</th><th bgcolor='lightblue'>AWB Type</th><th bgcolor='lightblue'>City Name</th><th bgcolor='lightblue'>Office Name </th><th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>Created Date</th><th bgcolor='lightblue'>Issue Date</th><th bgcolor='lightblue'>Stock Status</th><th bgcolor='lightblue'>Updated By</th><th bgcolor='lightblue'>Remarks</th></tr></thead>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        str += " <tbody><tr>";

                        str += "<td>" + result.Data[i].AWBNo + "</td>";
                        str += "<td>" + result.Data[i].StockType + "</td>";
                        str += "<td>" + result.Data[i].AWBType + "</td>";
                        str += "<td>" + result.Data[i].CityName + "</td>";
                        str += "<td>" + result.Data[i].OfficeName + "</td>";

                        str += "<td>" + result.Data[i].AgentName + "</td>";
                        str += "<td>" + result.Data[i].Createddate + "</td>";
                        str += "<td>" + result.Data[i].IssueDate + "</td>";
                        str += "<td>" + result.Data[i].StockStatus + "</td>";
                        str += "<td>" + result.Data[i].UpdatedBy + "</td>";
                        str += "<td>" + result.Data[i].Remarks + "</td>";
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
                //$('#BindBlakListTable').append(str);




                $('#BlackList').css('display', 'block');




                return false
            },
            //error: function (xhr) {
            //    var a = "";
            //}
        });
    }
}

