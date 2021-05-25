var AWBType1 = [{ Key: "1", Text: "CARGO" }, { Key: "2", Text: "Courier" }];
$(document).ready(function () {
    $("#CreatedOn").attr("Disabled", true);
    cfi.ValidateForm();

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#btnIssuetoStockAgent").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();
        cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
        cfi.AutoComplete("Account", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
        //cfi.AutoComplete("AWBType", "SNo", "TypeAWB", "SNo", "AType", ["AType"], null, "contains");
        cfi.AutoComplete("IsAutoAWB", "stocktype", "stocktype", "STSNo", "stocktype", ["stocktype"], null, "contains");
        //$("#divAccount").hide();
        $("#MasterDuplicate").hide();
        $("input[type='button'][value='Edit']").hide();
        $("input[type='button'][value='Delete']").hide();
        $("#__SpanHeader__").html('Return Stock From Forwarder (Agent)');
        //$("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
        //$("#Text_IsAutoAWB").data("kendoAutoComplete").enable(false);
        // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
        $("#OfficeIssueDate").attr("disabled", "disabled");
        $("#lblIssueStockAgent").html(0);

        var StockSno = $('#hdnSNo').val();
        //GetIssuedOfficeStock(StockSno);
        GetIssuedAccountStock(StockSno);
        GetRecordOnReadOption(StockSno);
        cfi.AutoCompleteByDataSource("AWBType", AWBType1);
        $('#lstIssueStockOffice').attr('disabled', 'disabled');
        $('#lstIssueStockAgent').attr('disabled', 'disabled');
        $('#trAgentName').closest('tr').next('tr').remove();
        $('#btnIssueStock').hide();

        $('#lstIssueStockOffice').change(function () {
            $('#IssueAWB').val($('#lstIssueStockOffice option:selected').length);
            $("#_tempIssueAWB").val($('#lstIssueStockOffice option:selected').length);
            $('#IssueAWB').attr('readonly', 'readonly')
        });
        $("#Text_AWBType").data("kendoAutoComplete").enable(false);
        //$('#lstIssueStockOffice').change(function () {
        //    $('#IssueAWB').val($('#lstIssueStockOffice option:selected').length);
        //    $("#_tempIssueAWB").val($('#lstIssueStockOffice option:selected').length);
        //    $('#IssueAWB').attr('readonly', 'readonly')
        //});
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();
        $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();

        cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
        cfi.AutoComplete("Account", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
        //cfi.AutoComplete("AWBType", "SNo", "TypeAWB", "SNo", "AType", ["AType"], null, "contains");
        cfi.AutoComplete("IsAutoAWB", "stocktype", "stocktype", "STSNo", "stocktype", ["stocktype"], null, "contains");
        $("#MasterDuplicate").hide();
        $("input[type='submit'][value='Update']").hide();
        $("#__SpanHeader__").html('Return Stock From Forwarder (Agent)');
        //$("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
        $("#Text_IsAutoAWB").data("kendoAutoComplete").enable(false);
        // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
        $("#OfficeIssueDate").attr("disabled", "disabled");
        $("#lblIssueStockAgent").html(0);
        cfi.AutoCompleteByDataSource("AWBType", AWBType1);

        var StockSno = $('#hdnSNo').val();
        //GetIssuedOfficeStock(StockSno);
        GetIssuedAccountStock(StockSno);
        $('#lstIssueStockOffice').change(function () {
            $('#IssueAWB').val($('#lstIssueStockOffice option:selected').length);
            $("#_tempIssueAWB").val($('#lstIssueStockOffice option:selected').length);
            $('#IssueAWB').attr('readonly', 'readonly')
        });
        $("#Text_AWBType").data("kendoAutoComplete").enable(false);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        //var td = $("#IsAutoAWB").closest("td");
        //if (!(typeof td === "undefined")) {
        //    td.html(td.html().replace("Yes", "Electronic").replace("No", "Manual"));
        //}
        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //    $("input[name=IsAutoAWB]:first").attr({ checked: "checked" });
        //}
        //var td = $("#AWBType").closest("td");
        //if (!(typeof td === "undefined")) {
        //    td.html(td.html().replace("ISIATA", "IATA AWB").replace("Courier", "Courier").replace("Mail", "Mail"));
        //}
        //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //    $("input[name=AWBType]:first").attr({ checked: "checked" });
        //}
        var td = $("#Date").closest("td");

        if (!(typeof td === "undefined")) {
            var d = new Date();
            td.html(d.toLocaleDateString());
        }
    }

    $("td[class='form2buttonrow']").closest("tr").hide();

})

var OfficeStockArr = [];
function GetIssuedOfficeStock(StockSNo) {
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/ReturnToOfficeService.svc/GetIssuedOfficeStock?StockSNo=" + StockSNo,
        data: { StockSNo: StockSNo },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.length > 0) {
                for (var i = 0; i < (response.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                    OfficeStockArr.push(CreatearrayAWBNo);
                }
                $("#lstIssueStockOffice").html(CreatedAWB);
                $("#lblIssueStockOffice").html(response.length);

                $("#City").val(response[0].CitySNo); $("#Text_City").val(response[0].Text_City);
                $("#Office").val(response[0].OfficeSNo); $("#Text_Office").val(response[0].Text_Office);

                $("#Text_City").attr("disabled", "disabled");
                $("#Text_Office").attr("disabled", "disabled");
                $("span[class='k-icon k-i-arrow-s']").html('');
                $("span[class='k-icon k-i-arrow-s']").removeClass();
                $("#IssueAWB").attr("onblur", "GetMaxIssuetoAgentAWB(this)")
                $("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
                $("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');
                $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();
                $("#trAgentName").hide();

                //$("#trAgentName").hide();



            }
        }
    });


}

function GetIssuedAccountStock(StockSNo) {
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/ReturnFromAccountService.svc/GetIssuedAccountStock?StockSNo=" + StockSNo,
        data: { StockSNo: StockSNo },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.length > 0) {
                for (var i = 0; i < (response.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option value="' + response[i].AWBNo + '">' + response[i].AWBPrefix + '-' + response[i].AWBNo + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                    OfficeStockArr.push(CreatearrayAWBNo);
                }
                $("#lstIssueStockOffice").html(CreatedAWB);
                $("#lblIssueStockOffice").html(response.length);

                $("#City").val(response[0].CitySNo); $("#Text_City").val(response[0].Text_City);
                $("#Office").val(response[0].OfficeSNo); $("#Text_Office").val(response[0].Text_Office);
                $("#Account").val(response[0].AccountSNo); $("#Text_Account").val(response[0].Text_Account);

                $("#Text_City").attr("disabled", "disabled");
                $("#Text_Office").attr("disabled", "disabled");
                $("#Text_Account").attr("disabled", "disabled");
                $("span[class='k-icon k-i-arrow-s']").html('');
                $("span[class='k-icon k-i-arrow-s']").removeClass();
                $("#IssueAWB").attr("onblur", "GetMaxIssuetoAgentAWB(this)")
                $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();
                //$("#trAgentName").hide();





            }
        }
    });


}









function ReturnStockFromOffice() {
    var CreatedAWB = "";
    var alradyCreatedStock = "";
    var AWBPrefix = $("#Text_AWBPrefix").val();
    var NoOfAWB = $("#_tempIssueAWB").val();

    if (NoOfAWB == "") {
        ShowMessage('info', 'Need your Kind Attention!', "No. of AWB cannot be blank");
        return false;
    }

    var strData1 = JSON.stringify(OfficeStockArr);
    var strData2 = strData1.replace(/"/g, "@");
    var strData = strData2.replace(/{@AWBNo@:@/g, "A");
    //    var strData = JSON.stringify(OfficeStockArr);
    var selval = [];
    if ($('#lstIssueStockOffice option:selected').length > 0) {
        $.each($('#lstIssueStockOffice option:selected'), function (index, id) {
            selval.push(id.innerHTML.substring(id.innerHTML.indexOf('-'), 20));
        });
        var s = JSON.stringify(selval);
        var sadd = s.replace(/"/g, "@}");
        strData = sadd.replace(/@}-/g, "A");
    }

    if (OfficeStockArr.length > 0) {
        $.ajax({
            type: "POST",
            url: "./Services/Stock/ReturnToOfficeService.svc/ReturnStockFromOffice?strData=" + strData + "&AWBPrefix=" + AWBPrefix + "&NoOfAWB=" + NoOfAWB,
            data: { strData: strData },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                if (response.length > 0) {
                    for (var i = 0; i < (response.length) ; i++) {
                        CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                        //var CreatearrayAWBNo = {};
                        //CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                        //IssueStockToAgentArr.push(CreatearrayAWBNo);
                    }
                    //alert("Stock Successfully Return from Office !!");


                    ShowMessage('success', 'Success', "Stock Successfully Return from Office !!");
                    $("#lstIssueStockAgent").html(CreatedAWB);
                    $("#lblIssueStockAgent").html(response.length);
                    $("#btnIssueStock").hide();

                }
            }
        });
    }
    else {
        //alert("Please Create stock first !!");
        ShowMessage('info', 'Need your Kind Attention!', "Please Create stock first !!");
    }
}

function ReturnStockFromAccount() {
    var CreatedAWB = "";
    var alradyCreatedStock = "";
    var AWBPrefix = $("#Text_AWBPrefix").val();
    var NoOfAWB = $("#_tempIssueAWB").val();

    if (NoOfAWB == "") {
        ShowMessage('info', 'Need your Kind Attention!', "No of AWB cannot be blank");
        return false;
    }

    var strData1 = JSON.stringify(OfficeStockArr);
    var strData2 = strData1.replace(/"/g, "@");
    var strData = strData2.replace(/{@AWBNo@:@/g, "A");
    //var strData = JSON.stringify(OfficeStockArr);

    var selval = [];
    if ($('#lstIssueStockOffice option:selected').length > 0) {
        $.each($('#lstIssueStockOffice option:selected'), function (index, id) {
            selval.push(id.innerHTML.substring(id.innerHTML.indexOf('-'), 20));
        });
        var s = JSON.stringify(selval);
        var sadd = s.replace(/"/g, "@}");
        strData = sadd.replace(/@}-/g, "A");
    }


    if (OfficeStockArr.length > 0) {
        $.ajax({
            type: "POST",
            url: "./Services/Stock/ReturnFromAccountService.svc/ReturnStockFromAccount?strData=" + strData + "&AWBPrefix=" + AWBPrefix + "&NoOfAWB=" + NoOfAWB,
            data: { strData: strData },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                if (response.length > 0) {
                    for (var i = 0; i < (response.length) ; i++) {
                        CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                    }
                    // alert("Stock Successfully Return from Agent !!");
                    ShowMessage('success', 'Success', "Stock Successfully Returned from Forwarder (Agent) !!");
                    $("#lstIssueStockAgent").html(CreatedAWB);
                    $("#lblIssueStockAgent").html(response.length);
                    $("#btnIssueStock").hide();
                    setTimeout(function () {
                        navigateUrl('Default.cshtml?Module=Stock&Apps=ReturnFromAccount&FormAction=INDEXVIEW');

                    }, 1000);
                }
            }
        });
    }
    else {
        // alert("Please Create stock first !!");
        ShowMessage('info', 'Need your Kind Attention!', "Please Create stock first !!");
    }
}
function GetMaxIssuetoAgentAWB(e) {
    var TotalCreatedStock = OfficeStockArr.length;
    var TotalIssueStock = e.value;
    if (TotalIssueStock > TotalCreatedStock) {
        // alert("No. of AWB should be less than or equal to total Unused Stock !!");
        ShowMessage('info', 'Need your Kind Attention!', "No. of AWB should be less than or equal to total Unused Stock !!");
        $("#IssueAWB").val('');
        $("#_tempIssueAWB").val('')
    };
}




//------------------------------------------------------GetRecordonReadOption

var OfficeStockArr1 = [];
function GetRecordOnReadOption(StockSNo) {
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/ReturnFromAccountService.svc/GetRecordOnReadOption?StockSNo=" + StockSNo,
        data: { StockSNo: StockSNo },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.length > 0) {
                for (var i = 0; i < (response.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option value="' + response[i].AWBNo + '">' + response[i].AWBPrefix + '-' + response[i].AWBNo + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                    OfficeStockArr1.push(CreatearrayAWBNo);
                }
                $("#lstIssueStockAgent").html(CreatedAWB);
                $("#lblIssueStockAgent").html(response.length);

                //$("#City").val(response[0].CitySNo); $("#Text_City").val(response[0].Text_City);
                //$("#Office").val(response[0].OfficeSNo); $("#Text_Office").val(response[0].Text_Office);
                //$("#Account").val(response[0].AccountSNo); $("#Text_Account").val(response[0].Text_Account);

                //$("#Text_City").attr("disabled", "disabled");
                //$("#Text_Office").attr("disabled", "disabled");
                //$("#Text_Account").attr("disabled", "disabled");
                $("span[class='k-icon k-i-arrow-s']").html('');
                $("span[class='k-icon k-i-arrow-s']").removeClass();
                $("#IssueAWB").attr("onblur", "GetMaxIssuetoAgentAWB(this)")
                $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();
                





            }
        }
    });


}
