var AWBType1 = [{ Key: "1", Text: "Cargo" }, { Key: "2", Text: "Courier" }];
$(document).ready(function () {
    $("#CreatedOn").attr("Disabled", true);
    cfi.ValidateForm();

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('#trAgentName').hide();
        $('#Remarks').closest('td').prev('td').wrapInner('<div></div>').find('*').hide();
        $('#Remarks').closest('td').find('*').hide();

        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#btnIssuetoStockAgent").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();
        cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
        //cfi.AutoComplete("AWBType", "SNo", "TypeAWB", "SNo", "AType", ["AType"], null, "contains");
        cfi.AutoComplete("IsAutoAWB", "stocktype", "stocktype", "STSNo", "stocktype", ["stocktype"], null, "contains");
        $("#divAccount").hide();
        $("#MasterDuplicate").hide();
        $("input[type='button'][value='Edit']").hide();
        $("input[type='button'][value='Delete']").hide();
        $("#__SpanHeader__").html('Return Stock From Office');
        //$("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
        $("#Text_IsAutoAWB").data("kendoAutoComplete").enable(false);
        // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
        $("#OfficeIssueDate").attr("disabled", "disabled");
        $("#lblIssueStockAgent").html(0);

        cfi.AutoCompleteByDataSource("AWBType", AWBType1);
        $("#Text_AWBType").data("kendoAutoComplete").enable(false);

        var StockSno = $('#hdnSNo').val();
        GetIssuedOfficeStock(StockSno);
        //GetIssuedAccountStock(StockSno);
        $('#lstIssueStockOffice').change(function () {
            $('#IssueAWB').val($('#lstIssueStockOffice option:selected').length);
            $("#_tempIssueAWB").val($('#lstIssueStockOffice option:selected').length);
            $('#IssueAWB').attr('readonly', 'readonly')
        });
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
        $("#__SpanHeader__").html('Return stock from Office');//Comment BY Akash
        //$("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
        $("#Text_IsAutoAWB").data("kendoAutoComplete").enable(false);
        // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");

        cfi.AutoCompleteByDataSource("AWBType", AWBType1);
        $("#Text_AWBType").data("kendoAutoComplete").enable(false);
        $("#btnIssueStock").hide();

        $("#OfficeIssueDate").attr("disabled", "disabled");
        $("#lblIssueStockAgent").html(0);

        var StockSno = $('#hdnSNo').val();
        GetIssuedOfficeStock(StockSno);

        $('#lstIssueStockOffice').change(function () {
            $('#IssueAWB').val($('#lstIssueStockOffice option:selected').length);
            $("#_tempIssueAWB").val($('#lstIssueStockOffice option:selected').length);
            $('#IssueAWB').attr('readonly', 'readonly')
        });


        $('#tdTotalIssueAWBtoAgent').html('').append("Issue Stock To Agent [<span id='lblIssueStockAgent'>0</span>]")

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


function ExtraCondition(textId) {
    //$("#Text_Office").val('');
    //$("#Office").val('');
    var f = cfi.getFilter("AND");
   
    if (textId == "Text_Account") {
        try {
            cfi.setFilter(f, "OfficeSNo", "eq", $("#Office").val())
            cfi.setFilter(f, "IsBlacklist", "eq", 0)
            cfi.setFilter(f, "IsActive", "eq", 1)
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
}


var OfficeStockArr = [];
function GetIssuedOfficeStock(StockSNo) {
    debugger;
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
                //$("#trAgentName").hide();

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
                    CreatedAWB = CreatedAWB + ('<option value="' + response[i].AWBNo + '">' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
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
                    ShowMessage('success', 'Success', "Stock Successfully Return from Office !");
                    $("#lstIssueStockAgent").html(CreatedAWB);
                    $("#lblIssueStockAgent").html(response.length);
                    $("#btnIssueStock").hide();


                    var StockSno = $('#hdnSNo').val();
                    GetIssuedOfficeStock(StockSno);


                    setTimeout(function () {
                        navigateUrl('Default.cshtml?Module=Stock&Apps=ReturnToOffice&FormAction=INDEXVIEW');

                    }, 1000);
                }
            }
        });
    }
    else {
        //alert("Please Create stock first !!");
        ShowMessage('info', 'Need your Kind Attention!', "Please Create stock first !");
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
                    ShowMessage('success', 'Success', "Stock Successfully Returned from Forwarder (Agent) !");
                    $("#lstIssueStockAgent").html(CreatedAWB);
                    $("#lblIssueStockAgent").html(response.length);
                    $("#btnIssueStock").hide();

                }
            }
        });
    }
    else {
        // alert("Please Create stock first !!");
        ShowMessage('info', 'Need your Kind Attention!', "Please Create stock first !");
    }
}
function GetMaxIssuetoAgentAWB(e) {
    var TotalCreatedStock = OfficeStockArr.length;
    var TotalIssueStock = e.value;
    if (TotalIssueStock > TotalCreatedStock) {
        // alert("No. of AWB should be less than or equal to total Unused Stock !!");
        ShowMessage('info', 'Need your Kind Attention!', "No. of AWB should be less than or equal to total Unused Stock !");
        $("#IssueAWB").val('');
        $("#_tempIssueAWB").val('')
    }

}







var IssueStockToAgentArr = [];

function IssueStocktoAgent() {
    if ($('#Account').val() == '')
    { ShowMessage('info', 'Need your Kind Attention!', "Please Select Forwarder (Agent) Name"); return false; }
    //if ($('#Office').val() == '')
    //{ ShowMessage('info', 'Need your Kind Attention!', "Please Select Office"); return false; }
    if ($('#IssueAWB').val() == '')
    { ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No"); return false; }
    else {
        var CreatedAWB = "";
        var alradyCreatedStock = "";
        var AWBPrefix = $("#Text_AWBPrefix").val();
        var AccountSNo = $("#Account").val();
        var OfficeSNo = $("#Office").val();
        var Remark = $("#Remarks").val();
        var NoOfAWB = $("#_tempIssueAWB").val();
        var AutoRetrievalDate = $("#AutoRetrievalDate").val();
        var strData1 = JSON.stringify(IssueStockToAgentArr);
        var strData2 = strData1.replace(/"/g, "@");
        var strData = strData2.replace(/{@AWBNo@:@/g, "A");
        //var strData = JSON.stringify(IssueStockToAgentArr);

        var selval = [];


        if ($('#lstIssueStockOffice option:selected').length > 0) {
            $.each($('#lstIssueStockOffice option:selected'), function (index, id) {
                selval.push(id.innerHTML.substring(id.innerHTML.indexOf('-'), 20));
            });
            var s = JSON.stringify(selval);
            var sadd = s.replace(/"/g, "@}");
            strData = sadd.replace(/@}-/g, "A");
        }

        if (OfficeSNo != '' ) {
            $.ajax({
                type: "POST",
                url: "./Services/Stock/StockManagementService.svc/IssueStocktoAgent?strData=" + strData + "&AWBPrefix=" + AWBPrefix + "&AccountSNo=" + AccountSNo + "&OfficeSNo=" + OfficeSNo + "&Remark=" + Remark + "&NoOfAWB=" + NoOfAWB + "&AutoRetrievalDate=" + AutoRetrievalDate,
                data: { strData: strData },
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.length > 0) {
                        for (var i = 0; i < (response.length) ; i++) {
                            CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                        }
                        //alert("Stock Successfully Issue to Agent !!");
                        ShowMessage('success', 'Success!', NoOfAWB + " Stock Successfully Issued to Forwarder (Agent) " + $('#Text_Account').val());
                      
                        $("#lstIssueStockAgent").html(CreatedAWB);
                        $("#lblIssueStockAgent").html(response.length)
                        $("#btnIssuetoStockAgent").hide();
                        setTimeout(function () {
                            navigateUrl('Default.cshtml?Module=Stock&Apps=ReturnToOffice&FormAction=INDEXVIEW');

                        }, 1000);
                    }
                }
            });
        }
        else {
            //alert("Please Issue stock to Office first !!");
            ShowMessage('info', 'Need your Kind Attention!', "Please Issue stock to Office first !");
        }
    }
}
