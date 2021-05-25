var AWBType1 = [{ Key: "1", Text: "CARGO" }, { Key: "2", Text: "Courier" }];
var buttonhtml = '<input type="button" value="Export To Excel" text="Export To Exce" title="Export To Excel" class="btn btn-success" onclick="ExportToExcel_StockOffice()" id="btnGenerateExcelOffice" tabindex="9" tooltip="Export To Excel">'
var buttonhtml2 = '<input type="button" value="Export To Excel" text="Export To Exce" title="Export To Excel" class="btn btn-success" onclick="ExportToExcel_StockAgent()" id="btnGenerateExcelAgent" tabindex="9" tooltip="Export To Excel">'
$(document).ready(function () {
    $("#CreatedOn").attr("Disabled", true);
    cfi.ValidateForm();

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#btnIssuetoStockAgent").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();


       

        cfi.AutoCompleteV2("City", "CityCode", "ReturnFromAccount_CityCode", Clear, "contains");
        cfi.AutoCompleteV2("Office", "Name", "ReturnFromAccount_Name", Clear, "contains");
        cfi.AutoCompleteV2("Account", "Name", "ReturnFromAccount_AccountName", null, "contains");
        cfi.AutoCompleteV2("IsAutoAWB", "stocktype", "ReturnFromAccount_stocktype", null, "contains");





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

        


        //cfi.AutoCompleteV2("City", "CityCode", "ReturnFromAccount_EditCity", null, "contains");
        //cfi.AutoCompleteV2("Office", "Name", "ReturnFromAccount_EditOfficeName", null, "contains");
        //cfi.AutoCompleteV2("Account", "Name", "ReturnFromAccount_EditAccountName", null, "contains");
        //cfi.AutoCompleteV2("IsAutoAWB", "stocktype", "ReturnFromAccount_Editstocktype", null, "contains");

        cfi.AutoCompleteV2("City", "CityCode", "CreateStock_City", Clear, "contains");
        cfi.AutoCompleteV2("Office", "Name", "CreateStock_Office", Clear, "contains");
        cfi.AutoCompleteV2("Account", "Name", "CreateStock_AccountStock", null, "contains");
        cfi.AutoCompleteV2("IsAutoAWB", "stocktype", "ReturnFromAccount_Editstocktype", null, "contains");


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

                if($("#Text_IsAutoAWB").data("kendoAutoComplete").value()!="CASS")
                {
                    $("#Text_City").attr("disabled", "disabled");
                    $("#Text_Office").attr("disabled", "disabled");
                    $("span[class='k-icon k-i-arrow-s']").html('');
                    $("span[class='k-icon k-i-arrow-s']").removeClass();
                }

                //$("#Text_City").attr("disabled", "disabled");
                //$("#Text_Office").attr("disabled", "disabled");
                //$("span[class='k-icon k-i-arrow-s']").html('');
                //$("span[class='k-icon k-i-arrow-s']").removeClass();
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
        //data: { StockSNo: StockSNo },
        //dataType: "json",
        //contentType: "application/json; charset=utf-8",
        success: function (response) {
            var dataTableobj = JSON.parse(response);
            var dttable = dataTableobj.Table0;
            var dttable1 = dataTableobj.Table1;
            if (response.length > 0) {
                for (var i = 0; i < dttable.length ; i++) {
                    CreatedAWB = CreatedAWB + ('<option value="' + dttable[i]["AWBNumber"] + '">' + dttable[i]["AWBPrefix"] + '-' + dttable[i]["AWBNumber"] + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (dttable[i]["AWBNumber"]);
                    OfficeStockArr.push(CreatearrayAWBNo);
                }
                $("#lstIssueStockOffice").html(CreatedAWB);
                $("#lblIssueStockOffice").html(dttable.length);

                $("#City").val(dttable[0].CitySNo); $("#Text_City").val(dttable[0].Text_City);
                $("#Office").val(dttable[0].OfficeSNo); $("#Text_Office").val(dttable[0].Text_Office);
                $("#Account").val(dttable[0].AccountSNo); $("#Text_Account").val(dttable[0].Text_Account);

                if ($("#Text_IsAutoAWB").data("kendoAutoComplete").value() != "CASS") {
                    $("#Text_City").attr("disabled", "disabled");
                    $("#Text_Office").attr("disabled", "disabled");
                    $("#Text_Account").attr("disabled", "disabled");
                    $("span[class='k-icon k-i-arrow-s']").html('');
                    $("span[class='k-icon k-i-arrow-s']").removeClass();
                }
                
                $("#IssueAWB").attr("onblur", "GetMaxIssuetoAgentAWB(this)")
                $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();
                //$("#trAgentName").hide();
                if (dttable1[0]["RESULT"] == "1") {
                    $("#btnIssueStock").attr("disabled", true);
                    $("input[type='radio'][name='Type']").attr("disabled", "disabled");
                }
                else if (dttable1[0]["RESULT"] == "0") {
                    $("#btnIssueStock").attr("disabled", false);
                    $("input[type='radio'][name='Type']").attr("enabled", "enabled");
                }




            }
            //Added by Nehal
            if (userContext.GroupName.toUpperCase() == 'GSA') {
                $("#btnIssueStock").removeAttr('disabled');
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
                    $("#btnIssueStock").closest('td').append(buttonhtml);

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
    var StockType = $("#Text_IsAutoAWB").data("kendoAutoComplete").value();
    var CitySNo = $("#Text_City").data("kendoAutoComplete").key();
    var OfficeSNo = $("#Text_Office").data("kendoAutoComplete").key();
    var Type = $("input[name='Type']:checked").val();
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
            url: "./Services/Stock/ReturnFromAccountService.svc/ReturnStockFromAccount",
            //data: { strData: strData },
            data: JSON.stringify({ strData: btoa(strData), AWBPrefix: AWBPrefix, NoOfAWB: NoOfAWB, StockType: StockType, CitySNo: CitySNo, OfficeSNo: OfficeSNo, Type: Type }),
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
                    $("#lstIssueStockAgent").closest('td').append(buttonhtml2);
                    //setTimeout(function () {
                    //    navigateUrl('Default.cshtml?Module=Stock&Apps=ReturnFromAccount&FormAction=INDEXVIEW');

                    //}, 1000);
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


function Clear(object) {
    if (object == "Text_City") {
        $("#Text_Office").val('');
        $("#Office").val('');
    }

    if (object == "Text_Office") {
        $("#Text_Account").val('');
        $("#Account").val('');
        $("#Text_Account").data("kendoAutoComplete").enable(false);
    }
}

function ExtraCondition(textId) {
    if (textId == "Text_Office") {
        try {
            cfi.setFilter(f, "CitySNo", "eq", $("#City").val())
           // cfi.setFilter(f, "AirlineCode", "eq", $("#AWBPrefix").val())
            //cfi.setFilter(f, "OfficeType", "neq", 2)
            //cfi.setFilter(f, "IsActive", "eq", 1)
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
}


//------------------------------------------------------GetRecordonReadOption

var OfficeStockArr1 = [];
function GetRecordOnReadOption(StockSNo) {
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/ReturnFromAccountService.svc/GetRecordOnReadOption",
        data: JSON.stringify({ StockSNo: StockSNo }),
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
function ExportToExcel_StockAgent() {
    var d = new Date();
    var dd = d.getDate();
    var month = d.getMonth() + 1;
    var yrs = d.getFullYear();
    var yyyy = d.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (month < 10) {
        month = '0' + month;
    }
    var today = dd + '_' + month + '_' + yrs;
    var AgentName = $('#Text_Account').val();
    var AgentCity = $('#Text_City').val();
    AgentName = (AgentName.indexOf('-') == 0) ? AgentName.substring(1) : AgentName;
    var str = "";
     str = "<html><table border=\"1px\">";
     str += "<tr ><td><strong>AWB Number</strong></td> <td><strong>Agent Name</strong></td><td><strong>Agent City</strong></td></tr>"
    var Totalitems = $("#lstIssueStockAgent").find('option').length;
    $("#lstIssueStockAgent option").each(function (i, e) {
            var AWBNO = $("#lstIssueStockAgent ").find('option').eq(i).text()
            str += "<tr><td>" + AWBNO + "</td><td>" + AgentName + "</td><td>" + AgentCity + "</td></tr>"
    });

    str += "</table></html>";
    var filename = 'Return Stock from Agent_' + today
    exportToExcelNew(str, filename)

};


function ExportToExcel_StockOffice() {
    var d = new Date();
    var dd = d.getDate();
    var month = d.getMonth() + 1;
    var yrs = d.getFullYear();
    var yyyy = d.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (month < 10) {
        month = '0' + month;
    }
    var today = dd + '_' + month + '_' + yrs;
    var OfficeName = $('#Text_Office').val();
    OfficeName = (OfficeName.indexOf('-') == 0) ? OfficeName.substring(1) : OfficeName;
    var str = "";
    str = "<html><table border=\"1px\">";
    str += "<tr ><td><strong>AWB Number</strong></td> <td><strong>Office Name</strong></td></tr>"
    var Totalitems = $("#lstIssueStockAgent").find('option').length;
    $("#lstIssueStockAgent option").each(function (i, e) {
        var AWBNO = $("#lstIssueStockAgent ").find('option').eq(i).text()
        str += "<tr><td>" + AWBNO + "</td><td>" + OfficeName + "</td></tr>"
    });

    str += "</table></html>";
    var filename = 'Return Stock from Office_' + today
    exportToExcelNew(str, filename)

};