


$(document).ready(function () {

    //cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");


    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "AirlineCode", "CarrierCode", ["CarrierCode", "AirlineName"], null, "contains");


    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("OfficeSNo", "SNo,Name", "vw_Office", "SNo", "Name", null, null, "contains");

    cfi.AutoComplete("AgentSNo", "SNo,Name", "AllotmentAgents", "SNo", "Name", null, "contains");

    cfi.AutoComplete("AWbNo", "AWBNo", "AWBStock", "SNo", "AWBNo", ["AWBNo"], null, "contains");

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

            if (userContext.GroupName == 'ADMIN') {

            }
            else {
                $('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
                $('#Text_AirlineSNo_input').val(userContext.AirlineName);

                $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
                $('#Text_OfficeSNo_input').val(userContext.OfficeName);


                $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
                $('#Text_CitySNo_input').val(userContext.CityName);


                $('#AgentSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
                $('#Text_AgentSNo_input').val(userContext.AgentName);



                cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
                cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
                cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
                cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble


                //$("#Text_AirlineSNo_input").data("kendoAutoComplete").enable(false);
                //$("#Text_OfficeSNo_input").data("kendoAutoComplete").enable(false);
                //$("#Text_CitySNo_input").data("kendoAutoComplete").enable(false);
                //$("#Text_AgentSNo_input").data("kendoAutoComplete").enable(false);
                //$('#Text_AirlineSNo_input').attr('Disabled', true);
                //$('#Text_OfficeSNo_input').attr('Disabled', true);
                //$('#Text_CitySNo_input').attr('Disabled', true);
                //$('#Text_AgentSNo_input').attr('Disabled', true);
            }

        }
        else {
            $('.DateWiseRow').hide();
            $('.AWBNoRow').show();
        }
    });




    //---------------------------------Group Wise Disabled-----------------------


});


function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filter, "IsInterline", "eq", "0")
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
        return OriginCityAutoCompleteFilter2;

    }

    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filter, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        cfi.setFilter(filter, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_AgentSNo") {
        try {
            cfi.setFilter(filter, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
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
            if (userContext.GroupName == 'ADMIN') {
                cfi.setFilter(filter, "StockStatus", "eq", 14)
            }
            else if (userContext.GroupName == 'FORWARDER') {
                cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)
                cfi.setFilter(filter, "StockStatus", "eq", 14)

            }
            else if (userContext.GroupName == 'ACCOUNTS') {
                cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)
                cfi.setFilter(filter, "StockStatus", "eq", 14)

            }
            else if (userContext.GroupName == 'OFFICE') {
                cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                cfi.setFilter(filter, "StockStatus", "eq", 14)
            }
            else {
                cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
                cfi.setFilter(filter, "OfficeSNo", "eq", userContext.OfficeSNo)
                cfi.setFilter(filter, "AccountSNo", "eq", userContext.AgentSNo)
                cfi.setFilter(filter, "StockStatus", "eq", 14)

            }
            var RT_Filter = cfi.autoCompleteFilter(filter);
            return RT_Filter;
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


        if (userContext.GroupName == 'ACCOUNTS') {
            $("#Text_AirlineSNo").removeAttr('data-valid');
            $("#Text_AirlineSNo_input").removeAttr('data-valid');
            $("#FromDate").removeAttr('data-valid');
            $("#ToDate").removeAttr('data-valid');
        }
        else if (userContext.GroupName == 'OFFICE') {
            $("#Text_AirlineSNo").removeAttr('data-valid');
            $("#Text_AirlineSNo_input").removeAttr('data-valid');
            $("#FromDate").removeAttr('data-valid');
            $("#ToDate").removeAttr('data-valid');
        }


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
    //AirlineSNo = $('#Text_AirlineSNo_input').val().substring(0, 3);
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
            url: 'GetRecordBlackListAWBHistory',
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

