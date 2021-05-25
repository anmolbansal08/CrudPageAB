var AWBType1 = [{ Key: "1", Text: "Cargo" }, { Key: "2", Text: "Courier" }];
$(document).ready(function () {
    cfi.ValidateForm();

    $("td[class='form2buttonrow']").hide();
    $("td[class='form2buttontoolbarrow']").hide();
    //var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

        cfi.AutoComplete("AWBPrefix", "AirlineCode", "Airline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains", null, null, null, null, AWBNumber);
        //cfi.AutoComplete("CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains", null, null, null, null, AWBNumber);
        cfi.AutoComplete("IsAutoAWB", "stocktype", "stocktype", "STSNo", "stocktype", ["stocktype"], null, "contains");

        cfi.AutoCompleteByDataSource("AWBType", AWBType1, AWBNumber);

        $("#AWBNumber").removeAttr("disabled");

        $("#lblTotalGeneratedAWBNo").html(0);
        $("#lblTotalCreatedStock").html(0);
        $("#lblExistStock").html(0);
        $("#lblIssueStockOffice").html(0);
        $("#lblIssueStockAgent").html(0);

        cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
        cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");

        $("#Text_City").css("width", "60px")
        $("#IssueAWB").val(1);
        $("#_tempIssueAWB").val(1);

        $("#StockCreated").hide();
        $("#IssueStock").hide();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#btnIssuetoStockAgent").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();
        cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], ResetAutoComplete, "contains");
        cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], GetAvailableStock, "contains");
        $('#Office').closest("td").append('[<span id="CountAlreadyIssuedStock">0</span>]')
        $("#City").val(userContext.CitySNo);
        $("#Text_City").val(userContext.CityCode);
        $('#divAccount').append('[<span id="CountAlreadyIssuedStockAccount">0</span>]');

        /*********Get office*********************/
        $.ajax({
            url: "./Services/Stock/StockManagementService.svc/Getofficelist", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ OfficeSNo: userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#Office').val(resData[0].officeSNo);
                    $('#Text_Office').val(resData[0].officeName);
                }
            }
        });
        /*****************************************/




        //cfi.AutoComplete("AWBType", "SNo", "TypeAWB", "SNo", "AType", ["AType"], null, "contains");
        cfi.AutoComplete("IsAutoAWB", "stocktype", "stocktype", "STSNo", "stocktype", ["stocktype"], null, "contains");
        $("#divAccount").hide();
        $("#trAgentName").hide();
        $("#MasterDuplicate").hide();
        $("input[type='button'][value='Edit']").hide();
        $("input[type='button'][value='Delete']").hide();
        $("#__SpanHeader__").html('Stock Issue to Office');
        // $("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
        $("#Text_IsAutoAWB").data("kendoAutoComplete").enable(false);
        //  $("input[type='input'][id='IsAutoAWB']").attr("disabled", "disabled");
        $("#CreatedOn").attr("disabled", "disabled");
        $("#btnReset").hide();
        cfi.AutoCompleteByDataSource("AWBType", AWBType1);
        $("#Text_AWBType").data("kendoAutoComplete").enable(false);
        var StockSno = $('#hdnSNo').val();
        GetReIssue(StockSno);

        $('#lstTotalCreatedStock').change(function () {
            if ($('#btnIssueStock').is(":visible") == true) {
                $('#IssueAWB').val($('#lstTotalCreatedStock option:selected').length);
                $("#_tempIssueAWB").val($('#lstTotalCreatedStock option:selected').length);
                $('#IssueAWB').attr('readonly', 'readonly')
            }
        });

        $('#lstIssueStockOffice').change(function () {
            if ($('#btnIssueStock').is(":visible") == false) {
                $('#IssueAWB').val($('#lstIssueStockOffice option:selected').length);
                $("#_tempIssueAWB").val($('#lstIssueStockOffice option:selected').length);
                $('#IssueAWB').attr('readonly', 'readonly')
            }
        });

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        debugger;
        $("#btnGenerate").hide();
        $("#btnCreateStock").hide();
        $("#btnIssueStock").hide();
        $("#tdTotalGeneratedAWBNo").hide(); $("#tdlCreatedstock").hide();
        $("#tdExistStock").hide(); $("#tdlExistStock").hide();
        $("#tdTotalCreatedAWB").hide(); $("#tdlstTotalCreatedStock").hide();

        cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], ResetAutoComplete, "contains");
        cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], GetAvailableStock, "contains");
        cfi.AutoComplete("Account", "Name", "Account", "SNo", "Name", ["Name"], GetAvailableStock, "contains");
        //$('#Office').closest("td").append('[<span id="CountAlreadyIssuedStock">0</span>]');
        $('#divAccount').append('[<span id="CountAlreadyIssuedStockAccount">0</span>]');
        //cfi.AutoComplete("AWBType", "SNo", "TypeAWB", "SNo", "AType", ["AType"], null, "contains");
        cfi.AutoComplete("IsAutoAWB", "stocktype", "stocktype", "STSNo", "stocktype", ["stocktype"], null, "contains");

        cfi.AutoCompleteByDataSource("AWBType", AWBType1);
        $("#Text_AWBType").data("kendoAutoComplete").enable(false);

        $("#Text_IsAutoAWB").data("kendoAutoComplete").enable(false);


        $("#MasterDuplicate").hide();
        $("input[type='submit'][value='Update']").hide();
        $("#__SpanHeader__").html('Stock Issue to Forwarder (Agent)');
        //$("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
        // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
        $("#OfficeIssueDate").attr("disabled", "disabled");
        $("#btnReset").hide();
        var StockSno = $('#hdnSNo').val();
        GetIssuedOfficeStock(StockSno);
        $("#City").val(userContext.CitySNo);
        $("#Text_City").val(userContext.CityCode);


        /*********Get office*********************/
        $.ajax({
            url: "./Services/Stock/StockManagementService.svc/Getofficelist", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ OfficeSNo: userContext.OfficeSNo == undefined ? "" : userContext.OfficeSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                debugger;
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#Office').val(resData[0].officeSNo);
                    $('#Text_Office').val(resData[0].officeName);
                }
            }
        });
        /*****************************************/


        $('#lstIssueStockOffice').change(function () {
            if ($('#btnIssueStock').is(":visible") == false) {
                $('#IssueAWB').val($('#lstIssueStockOffice option:selected').length);
                $("#_tempIssueAWB").val($('#lstIssueStockOffice option:selected').length);
                $('#IssueAWB').attr('readonly', 'readonly')
            }
        });

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        $("#AutoRetrievalDate").parent().css('width', '20%');
        $("#AutoRetrievalDate").data("kendoDatePicker").min(new Date());
        //var td = $("#IsAutoAWB").closest("td");
        //if (!(typeof td === "undefined")) {
        //    td.html(td.html().replace("Electronic", "Electronic").replace("Manual", "Manual").replace("CompanyMaterial", "Company Material"));
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

    //$("div[data-role='grid']").find("table:first").find("tr:first").find("th:first").hide();
    //$("div[data-role='grid']").find("table[data-role='selectable']").find("tr").find("td:first-child").hide();
})




function GetAvailableStock() {
    //alert($('#Office').val());


    var StockSNo = $('#hdnSNo').val();
    var IsAutoAWB = $('#IsAutoAWB').val();
    var AWBType = $('#AWBType').val();
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

function ResetAutoComplete() {


    //  cfi.ResetAutoComplete("Office");


    try {
        $.ajax({
            url: "./Services/Stock/StockManagementService.svc/GetCityofficeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CitySNo: $("#City").val() == undefined ? "" : $("#City").val() }),

            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $('#Office').val(resData[0].officeSNo);
                    $('#Text_Office').val(resData[0].OfficeName);
                }
                else {
                    $('#Office').val("");
                    $('#Text_Office').val("");
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
    if (textId == "Text_Office") {
        try {
            cfi.setFilter(f, "CityCode", "eq", $("#Text_City").val())
            cfi.setFilter(f, "OfficeType", "neq", 2)
            cfi.setFilter(f, "IsActive", "eq", 1)
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
    if (textId == "Text_Account") {
        try {
            cfi.setFilter(f, "OfficeSNo", "eq", $("#Office").val())
            cfi.setFilter(f, "IsActive", "eq", 1)
            cfi.setFilter(f, "IsBlacklist", "eq", 0)
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
}

function SetAWB(e) {
    if (e.value == "0") {
        $("#AWBNumber").attr("disabled", "disabled");
    }
    else {
        $("#AWBNumber").removeAttr("disabled");
    }
    AWBNumber();
}

function AWBNumber(e) {

    $("#btnCreateStock").hide();
    var Data = "";
    var intRegex = /^\d+$/;
    //var AWBType = $("#AWBType:checked").val();
    var AWBType = $('#AWBType').val();
    var AutoAWB = $("#IsAutoAWB").val();
    var CountryCode = $("#Text_CountryCode").val();
    var ExpiryDate = $("#ExpiryDate").val();
    var AWBPrefix = $("#AWBPrefix").val();
    if (e == undefined) { Data = $("#Text_AWBPrefix").val() == "" ? "0" : $("#Text_AWBPrefix").val(); }
    else Data = (this.dataItem(e.item.index())).Text;

    //var checkdata = (this.dataItem(e.item.index())).Text;
    if (intRegex.test(Data)) { AWBPrefix = Data; } else { CountryCode = Data; }

    if (AWBPrefix != "0" && AWBPrefix != "") {
        $.ajax({
            type: "POST",
            url: "./Services/Stock/StockManagementService.svc/GetMaxAWBNumber?AWBPrefix=" + AWBPrefix + "&AWBType=" + AWBType + "&IsAutoAWB=" + AutoAWB + "&CountryCode=" + 0 + "&ExpiryDate=" + ExpiryDate,
            data: { id: 1 },
            dataType: "json",
            success: function (response) {
                var SNo = response.Data[0];
                $("#AWBNumber").val(SNo);
                $("#_tempAWBNumber").val(SNo);
            }
        });
    }
    $("#lstCreatedstock").html('');
    $("#lblTotalGeneratedAWBNo").html(0);
    $("#lstExistStock").html('');
    $("#lblExistStock").html(0);

}

function CheckAWB(e) {
    var intRegex = /^\d+$/;
    var Data = $("#AWBNumber").val();
    var a = parseInt(Data);
    if (Data != "") {
        if (!intRegex.test(Data)) { //alert("AWB No. Must be Numeric"); 
            ShowMessage('info', 'Need your Kind Attention!', "AWB No. Must be Numeric");
            $("#AWBNumber").val('');
        }
        else if (Data.length < 7) { //alert("AWB No. Lenght Must be Seven Character"); 
            ShowMessage('info', 'Need your Kind Attention!', "AWB No. Lenght Must be Seven Character");
            $("#AWBNumber").val('');
        }
        else if (a == 0) { //alert("AWB No. can not be Zero"); 
            ShowMessage('info', 'Need your Kind Attention!', "AWB No. can not be Zero");
            $("#AWBNumber").val('');
        }

    }
}
function AWBNumber1(e) {

    var AWBPrefix = isNaN($("#AWBPrefix").val()) ? $("#hdnAWBPrefix").val() : $("#AWBPrefix").val();
    if (AWBPrefix == "") {
        $("#AWBNumber").val('');
    }
    var Data = this.dataItem(e.item.index());
    $.ajax({
        type: "POST",
        url: "./Services/Stock/StockManagementService.svc/GetCity?recid=" + AWBPrefix,
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            var SNo = response.Data[0];
            var code = response.Data[1];

            $("#CommoditySNo").val(SNo);
            $("#Text_CommoditySNo").val(code);
        }
    });


}

var StockArr = [];
var CreateStockArr = [];
function GenerateStock() {
    CreateStockArr = [];
    $("#lstCreatedstock").html('');
    $("#lblTotalGeneratedAWBNo").html(0);

    var AirlineCode = $("#Text_AWBPrefix").val();
    var val = $("#AWBNumber").val();
    var No = $("#NOOFAWB").val();
    var AWB = "";
    if (parseInt(val) > 0 && parseInt(No) > 0) {
        for (var i = 0; i < parseInt(No) ; i++) {
            var AWBNo = val.toString() + (parseInt(val) % 7).toString();
            //if (pad(AWBNo, 8).length == 8)
            //{
            var arrayAWBNo = {};
            arrayAWBNo.AWBNo = AirlineCode + '-' + pad(AWBNo, 8);;
            StockArr.push(arrayAWBNo);

            var CreatearrayAWBNo = {};
            CreatearrayAWBNo.AWBNo = pad(AWBNo, 8);
            CreateStockArr.push(CreatearrayAWBNo);

            val++;
            AWB = AWB + ('<option>' + arrayAWBNo.AWBNo + '</option>');
            //}
        }
        $("#lstCreatedstock").html(AWB);
        $("#lblTotalGeneratedAWBNo").html(CreateStockArr.length);
        $("#StockCreated").show();

        $("#lstExistStock").html('');
        $("#lblExistStock").html(0);
        $("#btnCreateStock").show();

        //$("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
        //$("#Text_AWBType").data("kendoAutoComplete").enable(false);
        // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
        $("#AWBNumber").attr("disabled", "disabled");
        $("#Text_AWBPrefix").attr("disabled", "disabled");
        $("#NOOFAWB").attr("disabled", "disabled");
        $("span[class='k-icon k-i-arrow-s']").html('');
        $("span[class='k-icon k-i-arrow-s']").removeClass();
        $("#ExpiryDate").attr("disabled", "disabled");
        $("span[class='k-icon k-i-calendar']").html('');
        $("span[class='k-icon k-i-calendar']").removeClass();
        $("#Text_AWBPrefix").attr("disabled", "disabled");
        //$("#IssueStock").show();
        $("span[class='k-icon k-i-calendar k-i-arrow-s']").html('');
        $("span[class='k-icon k-i-calendar k-i-arrow-s']").removeClass();

    }
    function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }

}
var LeftStockArr = [];
function CreateStock() {
    var CreatedAWB = "";
    var alradyCreatedStock = "";
    var AWBPrefix = $("#Text_AWBPrefix").val();
    var AWBType = $("#AWBType:checked").val();
    var IsAutoAWB = $("#IsAutoAWB:checked").val();
    var CountryCode = 0; // = $("#CountryCode").val();
    var ExpiryDate = $("#ExpiryDate").val();

    var strData1 = JSON.stringify(CreateStockArr);
    var strData2 = strData1.replace(/"/g, "@");
    var strData = strData2.replace(/{@AWBNo@:@/g, "A");
    $.ajax({
        type: "POST",
        url: "./Services/Stock/StockManagementService.svc/CreateStock?strData=" + strData + "&AWBPrefix=" + AWBPrefix + "&AWBType=" + AWBType + "&IsAutoAWB=" + IsAutoAWB + "&CountryCode=" + CountryCode + "&ExpiryDate=" + ExpiryDate,
        data: { strData: strData },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response[0].leftStock.length > 0) {
                for (var i = 0; i < (response[0].leftStock.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[0].leftStock[i].AWBNo + '</option>');

                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[0].leftStock[i].AWBNo);
                    LeftStockArr.push(CreatearrayAWBNo);
                }
                $("#lstTotalCreatedStock").html(CreatedAWB);
                $("#lblTotalCreatedStock").html(response[0].leftStock.length);
                $("#_tempIssueAWB").val(response[0].leftStock.length);
                $("#IssueAWB").val(response[0].leftStock.length);
                //$("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
                //$("#Text_AWBType").data("kendoAutoComplete").enable(false);
                //$("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
                $("#AWBNumber").attr("disabled", "disabled");
                $("#Text_AWBPrefix").attr("disabled", "disabled");
                $("#NOOFAWB").attr("disabled", "disabled");
                $("span[class='k-icon k-i-arrow-s']").html('');
                $("span[class='k-icon k-i-arrow-s']").removeClass();
                $("#btnGenerate").hide();
                $("#trIssueStock").hide();
                $("#btnReset").hide();
                $("#btnCreateStock").hide();
                $("#btnGenerate").hide();
                $("#Text_AWBPrefix").attr("disabled", "disabled");
                $("#IssueStock").show();
                cfi.AutoComplete("City", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
                cfi.AutoComplete("Office", "Name", "Office", "SNo", "Name", ["Name"], null, "contains");
                cfi.AutoComplete("Account", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");
                $("#Remarks").css("height", "20px");
                $("#divAccount").hide(); $("#trAgentName").hide();
                $("#btnIssuetoStockAgent").hide();
            }
            if (response[0].alradyCreatedStock.length > 0) {
                for (var i = 0; i < (response[0].alradyCreatedStock.length) ; i++) {
                    alradyCreatedStock = alradyCreatedStock + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[0].alradyCreatedStock[i].AWBNo + '</option>');
                }
                $("#lstExistStock").html(alradyCreatedStock);
                $("#lblExistStock").html(response[0].alradyCreatedStock.length);
            }




        }
    });
}

function MaxNoOfAWB(e) {
    var Data = e.value;

    if (Data > 1000) {
        //alert("Enter Max 1000 only");
        ShowMessage('info', 'Need your Kind Attention!', "Enter Max 1000 only");
        $("#NOOFAWB").val('');
    }
    //alert(Data);
}


function GetMaxIssueAWB(e) {
    var TotalCreatedStock = LeftStockArr.length;
    var TotalIssueStock = e.value;
    if (TotalIssueStock > TotalCreatedStock) {
        //alert("No. of AWB should be less than or equal to total Created Stock !!");
        ShowMessage('info', 'Need your Kind Attention!', "No. of AWB should be less than or equal to total Available Stock !");
        $("#IssueAWB").val('');
        $("#_tempIssueAWB").val('')
    }

}
function checkAgentStatus() {
    return true;
}
function GetMaxIssuetoAgentAWB(e) {
    var TotalCreatedStock = IssueStockToAgentArr.length;
    var TotalIssueStock = e.value;
    if (TotalIssueStock > TotalCreatedStock) {
        ShowMessage('info', 'Need your Kind Attention!', "No. of AWB should be less than or equal to total Issue Office Stock !");
        //alert("No. of AWB should be less than or equal to total Issue Office Stock !");
        $("#IssueAWB").val('');
        $("#_tempIssueAWB").val('')
    }

}

var IssueStockToAgentArr = [];
function IssueStock() {
    if ($('#City').val() == '')
    { ShowMessage('info', 'Need your Kind Attention!', "Please Select City"); return false; }
    if ($('#Office').val() == '')
    { ShowMessage('info', 'Need your Kind Attention!', "Please Select Office"); return false; }
    if ($('#IssueAWB').val() == '')
    { ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No"); return false; }
    else {
        var CreatedAWB = "";
        var alradyCreatedStock = "";
        var AWBPrefix = $("#Text_AWBPrefix").val();
        var CitySNo = $("#City").val();
        var OfficeSNo = $("#Office").val();
        var Remark = $("#Remarks").val();
        var NoOfAWB = $("#_tempIssueAWB").val();
        var AutoRetrievalDate = $("#AutoRetrievalDate").val();
        var strData1 = JSON.stringify(LeftStockArr);
        var strData2 = strData1.replace(/"/g, "@");
        var strData = strData2.replace(/{@AWBNo@:@/g, "A");
        //    var strData = JSON.stringify(LeftStockArr);
        var selval = [];


        if ($('#lstTotalCreatedStock option:selected').length > 0) {
            $.each($('#lstTotalCreatedStock option:selected'), function (index, id) {
                selval.push(id.innerHTML.substring(id.innerHTML.indexOf('-'), 20));
            });
            var s = JSON.stringify(selval);
            var sadd = s.replace(/"/g, "@}");
            strData = sadd.replace(/@}-/g, "A");
        }



        if (LeftStockArr.length > 0) {
            $.ajax({
                type: "POST",
                url: "./Services/Stock/StockManagementService.svc/IssueStock?strData=" + strData + "&AWBPrefix=" + AWBPrefix + "&CitySNo=" + CitySNo + "&OfficeSNo=" + OfficeSNo + "&Remark=" + Remark + "&NoOfAWB=" + NoOfAWB + "&AutoRetrievalDate=" + AutoRetrievalDate,
                data: { strData: strData },
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.length > 0) {
                        for (var i = 0; i < (response.length) ; i++) {
                            CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                            var CreatearrayAWBNo = {};
                            CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                            IssueStockToAgentArr.push(CreatearrayAWBNo);
                        }
                        //alert("Stock Successfully Issue to Office !!");

                        $("#IssueAWB").prop('readonly', false);
                        ShowMessage('success', 'Success!', NoOfAWB + " Stock Successfully Issued to Office " + $("#Text_Office").val());
                        $("#lstIssueStockOffice").html(CreatedAWB);
                        $("#lblIssueStockOffice").html(response.length)
                        $("#btnIssueStock").hide();


                        $('#lstTotalCreatedStock').attr('disabled', 'disabled');
                        $('#_tempIssueAWB').val('');
                        $('#IssueAWB').val('');

                        $("#Text_City").attr("disabled", "disabled");
                        $("#Text_Office").attr("disabled", "disabled");
                        $("span[class='k-icon k-i-arrow-s']").html('');
                        $("span[class='k-icon k-i-arrow-s']").removeClass();
                        $("#IssueAWB").attr("onblur", "GetMaxIssuetoAgentAWB(this)")

                        $("#divAccount").show(); $("#trAgentName").show();
                        $("#btnIssuetoStockAgent").show();
                        $("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
                        $("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');
                        cfi.AutoComplete("Account", "Name", "Account", "SNo", "Name", ["Name"], GetAvailableStock, "contains");
                        $("#trAgentName").show();
                        var StockSno = $('#hdnSNo').val(); // added by jitendra kumar,29-04-2017

                        GetReIssue(StockSno);
                        //GetIssuedOfficeStock(StockSno);


                    }
                }
            });
        }
        else {
            //alert("Please Create stock first !!");
            ShowMessage('info', 'Need your Kind Attention!', "Please Create stock first !");

        }

    }
}

function IssueStocktoAgent() {
    if ($('#Account').val() == '') {
        ShowMessage('info', 'Need your Kind Attention!', "Please Select Forwarder (Agent) Name"); return false;
    }
    var NoOfAWB1 = $("#_tempIssueAWB").val();

    if (NoOfAWB1 == "") {
        ShowMessage('info', 'Need your Kind Attention!', "No. of AWB cannot be blank");
        return false;
    }
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

        if (IssueStockToAgentArr.length > 0) {
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
                        var StockSno = $('#hdnSNo').val(); // added by jitendra kumar,29-04-2017
                        //GetIssuedOfficeStock(StockSno);

                        setTimeout(function () {
                            navigateUrl('Default.cshtml?Module=Stock&Apps=StockManagement&FormAction=INDEXVIEW');

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

function GetReIssue(StockSNo) {
    debugger;
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/StockManagementService.svc/GetReIssue?StockSNo=" + StockSNo,
        data: { StockSNo: StockSNo },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.length > 0) {
                for (var i = 0; i < (response.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                    LeftStockArr.push(CreatearrayAWBNo);
                }
                $("#lstTotalCreatedStock").html(CreatedAWB);
                $("#lblTotalCreatedStock").html(response.length)
                $("#trAgentName").hide();

                if ($('#lstIssueStockOffice option').length > 0 && $('#lstIssueStockOffice option').length != undefined && $('#lstIssueStockOffice option').length != "") {
                    $("#trAgentName").show();
                }

            }
        }
    });


}

function GetIssuedOfficeStock(StockSNo) {
    debugger;
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/StockManagementService.svc/GetIssuedOfficeStock?StockSNo=" + StockSNo,
        data: { StockSNo: StockSNo },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            debugger;
            if (response.length > 0) {
                for (var i = 0; i < (response.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                    IssueStockToAgentArr.push(CreatearrayAWBNo);
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

                $("#trAgentName").show();



            }
        }
    });


}

function ResetStock() {

    $("Span[class='k-picker-wrap k-state-default k-widget k-datepicker k-header']").find("Span[class='k-select']").find("Span").addClass("k-icon k-i-calendar")
    $("Span[class='k-picker-wrap k-state-default k-widget k-datepicker k-header']").find("Span[class='k-select']").find("Span").html('select');

    $("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
    $("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');

    //$("input[type='radio'][id='AWBType']").removeAttr("disabled")
    $("#Text_AWBType").data("kendoAutoComplete").enable(true);
    $("input[type='radio'][id='IsAutoAWB']").removeAttr("disabled")

    $("#lstCreatedstock").html('');
    $("#lblTotalGeneratedAWBNo").html(0);
    $("#lstExistStock").html('');
    $("#lblExistStock").html(0);
    $("#btnCreateStock").hide();

    $("#NOOFAWB").removeAttr("disabled")
    $("#AWBNumber").removeAttr("disabled")
    $("#NOOFAWB").val(''); $("#_tempNOOFAWB").val('');
    $("#Text_AWBPrefix").val('');
    $("#AWBNumber").val(''); $("#_tempAWBNumber").val('');
    $("#StockCreated").hide();

}