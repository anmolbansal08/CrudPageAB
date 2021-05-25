var AWBType1 = [{ Key: "1", Text: "Cargo" }, { Key: "2", Text: "Courier" }];
var buttonhtml = '<input type="button" value="Export To Excel" text="Export To Exce" title="Export To Excel" class="btn btn-success" onclick="ExportToExcel_StockOffice()" id="btnGenerateExcelOffice" tabindex="9" tooltip="Export To Excel">'
var flag = 0;
//var buttonhtml2 = '<input type="button" value="Export To Excel" text="Export To Exce" title="Export To Excel" class="btn btn-success" onclick="ExportToExcel_ReturnStockOffice()" id="btnGenerateExcelAgent" tabindex="9" tooltip="Export To Excel">'

$(document).ready(function () {
    $("#CreatedOn").attr("Disabled", true);
    cfi.ValidateForm();

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('#trAgentName').hide();
        $('#Remarks').closest('td').prev('td').wrapInner('<div></div>').find('*').hide();
        $('#Remarks').closest('td').find('*').hide();

        $("input[type='radio']").closest('td').html();


        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#btnIssuetoStockAgent").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();

        cfi.AutoCompleteV2("City", "CityCode", "ReturnToOffice_City", clearfield, "contains");
        cfi.AutoCompleteV2("Office", "Name", "ReturnToOffice_Office",null , "contains");
        cfi.AutoCompleteV2("IsAutoAWB", "stocktype", "ReturnToOffice_stocktype", null, "contains");


        $("#divAccount").hide();
        $("#MasterDuplicate").hide();
        $("input[type='button'][value='Edit']").hide();
        $("input[type='button'][value='Delete']").hide();
        $("#__SpanHeader__").html('Issue Stock to Sub Branch/Agent');
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
            //$('#IssueAWB').attr('readonly', 'readonly')
        });
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("input[type='radio']").closest('td').html('')
        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();
        $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();



        cfi.AutoCompleteV2("City", "CityCode", "ReturnToOffice_EditCity", clearfield, "contains");
        cfi.AutoCompleteV2("Office", "Name", "ReturnToOffice_EditOffice", null, "contains");
        cfi.AutoCompleteV2("Account", "AccountCode,Name", "ReturnToOffice_EditAccount", GetAvailableStock, "contains");
        cfi.AutoCompleteV2("IsAutoAWB", "stocktype", "ReturnToOffice_Editstocktype", null, "contains");



        $('#divAccount').append('[<span id="CountAlreadyIssuedStockAccount">0</span>]');
        $("#MasterDuplicate").hide();
        $("input[type='submit'][value='Update']").hide();
        $("#__SpanHeader__").html('Issue Stock to Sub Branch/Agent');//Comment BY Akash
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
            //$('#IssueAWB').attr('readonly', 'readonly')
        });


        $('#tdTotalIssueAWBtoAgent').html('').append("Issue Stock To Agent [<span id='lblIssueStockAgent'>0</span>]");


        $('#AutoRetrievalDate').closest('td').contents().hide();
        $('#AutoRetrievalDate').closest('td').prev('td').text('');


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


function GetAvailableStock() {
    //alert($('#Office').val());


    var StockSNo = $('#hdnSNo').val();
    var IsAutoAWB = $('#IsAutoAWB').val();
    var AWBType = $('#AWBType').val() == "Cargo" ? "1" : $('#AWBType').val() == "COURIER" ? "2" : "1";
    var CitySNo = $('#City').val();
    var OfficeSNo = $('#Office').val();
    var AccountSNo = $('#Account').val();
    var WhereCondition = "";

    try {
        $.ajax({
            url: "./Services/Stock/StockManagementService.svc/CountAlreadyIssuedStock", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ StockSNo: StockSNo, IsAutoAWB: IsAutoAWB, AWBType: AWBType, CitySNo: CitySNo, OfficeSNo: OfficeSNo, AccountSNo: AccountSNo, WhereCondition: WhereCondition }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                        $('#CountAlreadyIssuedStockAccount').text(resData[0].IssueStock);

                    }
                    else {
                        $('#CountAlreadyIssuedStock').text(resData[0].IssueStock);
                        if (AccountSNo != "") {
                            $('#CountAlreadyIssuedStock').text('0')
                            $('#CountAlreadyIssuedStockAccount').text(resData[0].IssueStock);
                        }
                    }
                }
                else {
                    //$('#Office').val("");
                    //$('#Text_Office').val("");
                }
            }
        });
    }
    catch (exp) { }


}

function ExtraCondition(textId) {
    //$("#Text_Office").val('');
    //$("#Office").val('');
    var f = cfi.getFilter("AND");

    if (textId == "Text_Account") {
        try {
            if (userContext.UserType != "1")
            cfi.setFilter(f, "OfficeSNo", "eq", $("#Office").val())
            cfi.setFilter(f, "IsBlacklist", "eq", 0)
            cfi.setFilter(f, "IsActive", "eq", 1)
            if (userContext.UserType == "1")
            {
               
                cfi.setFilter(f, "CitySNo", "eq", $("#City").val())
                cfi.setFilter(f, "ParentId", "eq", userContext.AgentSNo == undefined ? "" : userContext.AgentSNo);
            }
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }

    if (textId == "Text_Office") {
        try {
            var g = cfi.getFilter("AND");
            var or = cfi.getFilter("OR");
            
            if (userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo != "" ) {
                cfi.setFilter(or, "SNo", "eq", userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo);
                if (userContext.UserType == "2")
                {// cfi.setFilter(f, "IsHeadOffice", "eq", 0) 
               
                cfi.setFilter(or, "ParentId", "eq", userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo);
                    //cfi.setFilter(f, "ParentId", "eq", userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo)
                }
              
              

            }
            
           
            cfi.setFilter(f, "CitySNo", "eq", $("#City").val())
            cfi.setFilter(f, "IsActive", "eq", 1)
            g = cfi.autoCompleteFilter([or, f], "OR");
            return g;// cfi.autoCompleteFilter([f]);
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
        url: "./Services/Stock/IssueDistributedStocktoSubBranchService.svc/GetIssuedOfficeStock?StockSNo=" + StockSNo,
        //data: { StockSNo: StockSNo },
        //dataType: "json",
        //contentType: "application/json; charset=utf-8",
        success: function (response) {
            var dataTableobj = JSON.parse(response);
            var dttable = dataTableobj.Table0;
            var dttable1 = dataTableobj.Table1;
            if (response.length > 0) {
                for (var i = 0; i < dttable.length ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + dttable[i].AWBNumber + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (dttable[i].AWBNumber);
                    OfficeStockArr.push(CreatearrayAWBNo);
                }
                $("#lstIssueStockOffice").html(CreatedAWB);
                $("#lblIssueStockOffice").html(dttable.length);

               // $("#City").val(dttable[0].CitySNo); $("#Text_City").val(dttable[0].Text_City);
               // if (userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo == "") {
             //   $("#Office").val(dttable[0].OfficeSNo); $("#Text_Office").val(dttable[0].Text_Office);
              //  }
               

              // $("#Text_City").attr("disabled", "disabled");
              // $("#Text_Office").attr("disabled", "disabled");
                //$("span[class='k-icon k-i-arrow-s']").html('');
                //$("span[class='k-icon k-i-arrow-s']").removeClass();
                $("#IssueAWB").attr("onblur", "GetMaxIssuetoAgentAWB(this)")
                //$("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
                //$("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');
                $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();
                //$("#trAgentName").hide();

                //$("#trAgentName").hide();
                if (getQueryStringValue("FormAction").toUpperCase() == "READ")
                {

                    $("#tbl").find('td span:first').text("Return Stock to Sub-Branch/Agent");                 
                }
                else
                    {
                    $("#tbl").find('td span:first').text("Issue Stock to Sub-Branch/Agent");
                }
                if (dttable1[0]["RESULT"] == "1") {
                    $("#btnIssueStock").attr("disabled", true);
                    $("input[type='radio'][name='Type']").attr("disabled", "disabled");
                }
                else if (dttable1[0]["RESULT"] == "0") {
                    $("#btnIssueStock").attr("disabled", false);
                    $("input[type='radio'][name='Type']").attr("enabled", "enabled");
                }


            }
        }
    });


}

function GetIssuedAccountStock(StockSNo) {
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/IssueDistributedStocktoSubBranchService.svc/GetIssuedAccountStock?StockSNo=" + StockSNo,
        //data: { StockSNo: StockSNo },
        //dataType: "json",
        //contentType: "application/json; charset=utf-8",
        success: function (response) {
            var dataTableobj = JSON.parse(response);
            var dttable = dataTableobj.Table0;
            var dttable1 = dataTableobj.Table1;
            if (response.length > 0) {
                for (var i = 0; i < dttable.length; i++) {
                    CreatedAWB = CreatedAWB + ('<option value="' + dttable[i]["AWBNumber"] + '">' + $("#Text_AWBPrefix").val() + '-' + dttable[i]["AWBNumber"] + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (dttable[0]["AWBNumber"]);
                    OfficeStockArr.push(CreatearrayAWBNo);
                }
                $("#lstIssueStockOffice").html(CreatedAWB);
                $("#lblIssueStockOffice").html(dttable.length);

                $("#City").val(dttable[0].CitySNo); $("#Text_City").val(dttable[0].Text_City);
                $("#Office").val(dttable[0].OfficeSNo); $("#Text_Office").val(dttable[0].Text_Office);
                $("#Account").val(dttable[0].AccountSNo); $("#Text_Account").val(dttable[0].Text_Account);

               //$("#Text_City").attr("disabled", "disabled");
                //$("#Text_Office").attr("disabled", "disabled");
                //$("#Text_Account").attr("disabled", "disabled");
                //$("span[class='k-icon k-i-arrow-s']").html('');
                $("span[class='k-icon k-i-arrow-s']").removeClass();
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
    else if ($('#lstIssueStockOffice option:selected').length == 0) {
        if (NoOfAWB != "" && NoOfAWB != "0") {
            for (var i = 0; i < NoOfAWB; i++) {
                var Id = $('#lstIssueStockOffice option:eq(' + i + ')').val();
                selval.push(Id.substring(Id.indexOf('-'), 20));
            }
            var s = JSON.stringify(selval);
            var sadd = s.replace(/"/g, "@}");
            strData = sadd.replace(/@}-/g, "A");
        }
        else if (NoOfAWB == "" || NoOfAWB == "0") {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No");
            return false;
        }
    }

    if (OfficeStockArr.length > 0) {
        $.ajax({
            type: "POST",
            url: "./Services/Stock/IssueDistributedStocktoSubBranchService.svc/ReturnStockFromOffice",
            //data: { strData: strData },
            data: JSON.stringify({ strData: btoa(strData), AWBPrefix: AWBPrefix, NoOfAWB: NoOfAWB, Type: $("input[name='Type']:checked").val() }),
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
                    ShowMessage('success', 'Success', "Stock Successfully Return from Sub Branch  !");
                    $("#lstIssueStockAgent").html(CreatedAWB);
                    $("#lblIssueStockAgent").html(response.length);
                    $("#btnIssueStock").hide();
                    //$("#lstIssueStockAgent").closest('td').append(buttonhtml);

                    var StockSno = $('#hdnSNo').val();
                    GetIssuedOfficeStock(StockSno);


                    setTimeout(function () {
                        navigateUrl('Default.cshtml?Module=Stock&Apps=IssueDistributedStocktoSubBranch&FormAction=INDEXVIEW');
                                   
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
                    ShowMessage('success', 'Success', "Stock Successfully Returned from Sub Branch !");
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

    var CheckZero = e.value;
    if (CheckZero == '0' || CheckZero == '') {
        $('#IssueAWB').val('');
        $('#_tempIssueAWB').val('');
        ShowMessage('info', '', "No. of AWB Not be Blank or Zero !!");
        return false;
    }

    var TotalCreatedStock = OfficeStockArr.length;
    var TotalIssueStock = e.value;
    if (TotalIssueStock > TotalCreatedStock) {
        // alert("No. of AWB should be less than or equal to total Unused Stock !!");
        ShowMessage('info', 'Need your Kind Attention!', "No. of AWB should be less than or equal to total Unused Stock !");
        $("#IssueAWB").val('');
        $("#_tempIssueAWB").val('');
    }

}







var IssueStockToAgentArr = [];

function IssueStocktoAgent() {
    //if ($('#Account').val() == '')
    //{ ShowMessage('info', 'Need your Kind Attention!', "Please Select Forwarder (Agent) Name"); return false; }
    //if ($('#Office').val() == '')
    //{ ShowMessage('info', 'Need your Kind Attention!', "Please Select Office"); return false; }
    if ($('#IssueAWB').val() == '')
    { ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No"); return false; }
    else {
        var CreatedAWB = "";
        var alradyCreatedStock = "";
        var AWBPrefix = $("#Text_AWBPrefix").val();
        var OfficeSNo = $("#Office").val();
        var Remark = $("#Remarks").val();
        var NoOfAWB = $("#_tempIssueAWB").val();
        var AutoRetrievalDate = $("#AutoRetrievalDate").val();
        var strData1 = JSON.stringify(IssueStockToAgentArr);
        var strData2 = strData1.replace(/"/g, "@");
        var strData = strData2.replace(/{@AWBNo@:@/g, "A");
        var CitySNo = $("#City").val();
       // var AccountSNo = $("#Account").val();
        var AccountSNo = $("#Account").val() == "" ? "0" : $("#Account").val();
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
        else if ($('#lstIssueStockOffice option:selected').length == 0) {
            if (NoOfAWB != "" && NoOfAWB != "0") {
                for (var i = 0; i < NoOfAWB; i++) {
                    var Id = $('#lstIssueStockOffice option:eq(' + i + ')').val();
                    selval.push(Id.substring(Id.indexOf('-'), 20));
                }
                var s = JSON.stringify(selval);
                var sadd = s.replace(/"/g, "@}");
                strData = sadd.replace(/@}-/g, "A");
            }
            else if (NoOfAWB == "" || NoOfAWB == "0") {
                ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No");
                return false;
            }
        }

        if (OfficeSNo != '') {
            $.ajax({
                type: "POST",
                url: "./Services/Stock/IssueDistributedStocktoSubBranchService.svc/IssueStocktoSubbranch?strData=" + strData + "&AWBPrefix=" + AWBPrefix + "&AccountSNo=" + parseInt(AccountSNo) + "&OfficeSNo=" + OfficeSNo + "&CitySNo=" + CitySNo + "&Remark=" + Remark + "&NoOfAWB=" + NoOfAWB + "&AutoRetrievalDate=" + AutoRetrievalDate,
                data: JSON.stringify({ strData: btoa(strData) }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.length > 0) {
                        for (var i = 0; i < (response.length) ; i++) {
                            CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                        }
                        //alert("Stock Successfully Issue to Agent !!");
                        ShowMessage('success', 'Success!', NoOfAWB + " Stock Successfully Issued to Sub Branch" );

                        $("#lstIssueStockAgent").html(CreatedAWB);
                        $("#lblIssueStockAgent").html(response.length)

                        var StockSno = $('#hdnSNo').val();
                        GetIssuedOfficeStock(StockSno);
                        flag++;
                        if(flag==1){
                        $("#lstIssueStockAgent").closest('td').append(buttonhtml);
                    }
                      //  $("#btnIssuetoStockAgent").hide();
                        //setTimeout(function () {
                        //    navigateUrl('Default.cshtml?Module=Stock&Apps=IssueDistributedStocktoSubBranch&FormAction=INDEXVIEW');

                        //}, 1000);
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

function clearfield() {
    if (userContext.UserType != "1")
        {
    $('#Text_Office').val('');
    $('#Office').val('');
    }
    else
    {
        $('#Text_Account').val('');
        $('#Account').val('');
    }
}
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
    str += "<tr ><td><strong>AWB Number</strong></td></tr>"
    var Totalitems = $("#lstIssueStockAgent").find('option').length;
    $("#lstIssueStockAgent option").each(function (i, e) {
       
        var AWBNO = $("#lstIssueStockAgent ").find('option').eq(i).text()
            str += "<tr><td>" + AWBNO + "</td></tr>"

     
    });

    str += "</table></html>";
    var filename = 'Stock Issue to Branch Office_' + today
    exportToExcelNew(str, filename)

};

function ExportToExcel_ReturnStockOffice() {

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
    str += "<tr ><td><strong>AWB Number</strong></td></tr>"
    var Totalitems = $("#lstIssueStockOffice").find('option').length;
    $("#lstIssueStockOffice option").each(function (i, e) {

        var AWBNO = $("#lstIssueStockOffice ").find('option').eq(i).text()
        str += "<tr><td>" + AWBNO + "</td></tr>"


    });

    str += "</table></html>";
    var filename = 'Stock return to Branch Office_' + today
    exportToExcelNew(str, filename)

};

//check DirtyFields Inside the Page
var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};