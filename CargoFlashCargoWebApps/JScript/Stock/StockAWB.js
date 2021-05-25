var AWBType1 = [{ Key: "1", Text: "Cargo" }, { Key: "2", Text: "Courier" }, { Key: "3", Text: "CBV" }];
var buttonhtml = '<input type="button" value="Export To Excel" text="Export To Excel" title="Export To Excel" class="btn btn-success" onclick="ExportToExcel_CreateStock()" id="btnGenerateExcel" tabindex="9" tooltip="Export To Excel">'
$(document).ready(function () {
    cfi.AutoCompleteByDataSource("AWBType", AWBType1, AWBNumber);
    var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $("#StockCreated").hide();
    $("#OfficeStockCreated").hide();
    $("#IssueStock").hide();
    $("#divGetIssuedOfficeStock").hide();
    $("#AgentStockCreated").hide();
    $("#AgentIssueStock").hide();

    $("input[id^=Date]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    $("input[id^=ExpiryDate]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#ExpiryDate").data("kendoDatePicker").value(getDateNextYear());
        var td = $("#IsAutoAWB").closest("td");
        if (!(typeof td === "undefined")) {
            td.html(td.html().replace("Electronic", "Electronic").replace("Manual", "Manual").replace("CompanyMaterial", "Service AWB"));
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            $("input[name=IsAutoAWB]:first").attr({ checked: "checked" });
        }
        if (userContext.SysSetting.IsDisableDatesOnStock.toUpperCase() == "TRUE") {
            $("#Date").data("kendoDatePicker").enable(false);
            $("#ExpiryDate").data("kendoDatePicker").enable(false);
        }

        //-----------------Convert to V2
        cfi.AutoCompleteV2("AWBPrefix", "CarrierCode,AirlineName", "CreateStock_Airline", AWBNumber, "contains");
        cfi.AutoCompleteV2("IsAutoAWB", "stocktype", "CreateStock_stocktypeStock", AWBNumber, "contains");
        $("#AWBNumber").removeAttr("disabled");

        $("#lblTotalGeneratedAWBNo").html(0);
        $("#lblTotalCreatedStock").html(0);
        $("#lblExistStock").html(0);
        $("#lblIssueStockOffice").html(0);
        $("#lblIssueStockAgent").html(0);




        //--------------------Convert autocomplete to V2

        cfi.AutoCompleteV2("City", "CityCode", "CreateStock_City", ResetAutoComplete, "contains");
        cfi.AutoCompleteV2("Office", "Name", "CreateStock_Office", GetAvailableStock, "contains");
        cfi.AutoCompleteV2("GSACity", "CityCode", "CreateStock_GSACity", Clear, "contains");
        cfi.AutoCompleteV2("GSAOffice", "Name", "CreateStock_GSAOffice", Clear, "contains");
        cfi.AutoCompleteV2("Account", "AccountCode,Name", "Stock_Account", null, "contains");
        cfi.AutoCompleteV2("GSAAWBType", "SNo", "CreateStock_GSAAWBType", null, "contains");
        cfi.AutoCompleteV2("GSAIsAutoAWB", "STsno", "CreateStock_GSAIsAutoAWB", null, "contains", null, null, null, null, null);


        //---------------------- Convert 



        $("#Text_City").css("width", "60px")
        $("#btnResetIssueStock").hide();
        cfi.ValidateSection("ApplicationTabs-1");
        cfi.ValidateSection("IssueStock");
        cfi.ValidateSection("divGetIssuedOfficeStock");
        cfi.ValidateSection("AgentIssueStock");

    }


    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {

        GetReIssue($('#hdnSNo').val());

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        GetIssuedOfficeStock($('#hdnSNo').val());
    }


    $("#btnGenerate").click(function () {
        if (cfi.IsValidSection("ApplicationTabs-1")) { return true; }
        else { return false }
    });
    $("#btnIssueStock").click(function () {
        if (cfi.IsValidSection("IssueStock")) { return true; }
        else { return false }
    });
    $("#btnGetIssueStock").click(function () {
        if (cfi.IsValidSection("divGetIssuedOfficeStock")) {
            $("#AutoRetrievalDate").parent().css('width', '20%');
            return true;
        }
        else { return false }
    });
    $("#btnIssuetoStockAgent").click(function () {
        if (cfi.IsValidSection("AgentIssueStock")) { return true; }
        else { return false }
    });
    $(".k-grid-content").find("input[type='radio']").attr("onclick", "addOnFunction(this)")
    //added for check stock button by anmol
    $('td.form2buttonrow').after("<td><input type='button' name='Checkstock' id='Checkstock' class='btn btn-info' value='Check Stock' onclick='Checkstocka();' ></td>");

    //end
    $('#Checkstock').hide();
})



//added by anmol for check stock
function Checkstocka() {
    // DTR = $(obj).closest("tr");
    $("#divExclude").remove();

    $("#Checkstock").append("<div id='divExclude' style='overflow:auto;'><table class='WebFormTable'><tr><td class='formthreeInputcolumn'>AWB No</td><td class='formthreeInputcolumn'><input type='text' class='k - input k-input' name='Text_AWBPrefix' id='Text_AWBPrefix' style='width: 50px; text-transform: uppercase;' controltype='uppercase' allowchar='0123456789' data-valid='maxlength[3],minlength[3],required' data-valid-msg='AWB Prefix cannot be blank.Minimum 3 Characters required' tabindex='2' maxlength='3' value='' data-role='alphabettextbox' autocomplete='off'><input type='hidden' name='AwbSNo' id='AwbSNo' value=''/> <input type='text' id='Text_AwbNo' name='Text_AwbNo' tabindex='3' controltype='number' data-valid='maxlength[8],minlength[8],required'  style='width: 100px;'  maxlength='8' data-role='numerictextbox' autocomplete='off' class='k-input'></td><td class='formthreeInputcolumn'><input type='button' tabindex='4' class='btn btn-info' name='btnSearchAwbNo' id='btnSearchAwbNo' style='width:90px;' value='Search' onclick='SearchAwbCheckStock();'></td></tr><tr></table></div>");
    $('#Text_AwbNo').keyup(function () {
        if (this.value != this.value.replace(/[^0-9]/g, '')) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    });


    cfi.PopUp("divExclude", "Check Stock", 500, null, null, 80);
    $("#divExclude").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $("#tblMessage tbody tr:nth-child(1) td:nth-child(2)").css("text-align", "left");


};


function SearchAwbCheckStock(AwbNo) {
    var x = $('#Text_AWBPrefix').val();
    var y = $('#Text_AwbNo').val();
    var AwbNo = x + "-" + y;
    if (AwbNo.length != 12) {
        ShowMessage('info', 'Need your Kind Attention!', "Please enter correct AWB No.", "bottom-left");
        return false;
    }
    else
        $.ajax({
            url: "./Services/Stock/StockAWBService.svc/GetCheckStockAwb", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AwbNo: AwbNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                ShowMessage('success', 'Information', "" + result + "", "bottom-right");


            }

        });

}

function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}

$('#liOfficeAirline').click(function () {

    //if ($("#lstOfficeCreatedstock").find("option").length==0){
    //ShowMessage('info', 'Need your Kind Attention!', "Office Commission can be added in Edit/Update mode only.");
    //return;

});
function OpenSecondTab() {
    ////------- Open Second Tab-----------
    $("#ApplicationTabs").find("li[id='lioffice']").removeClass();
    $("#ApplicationTabs").find("li[id='liOfficeAirline']").removeClass();
    $("#ApplicationTabs").find("li[id='lioffice']").addClass("k-item k-state-default");
    $("#ApplicationTabs").find("li[id='liOfficeAirline']").addClass("k-state-active k-item k-tab-on-top k-state-default k-first");
    $("#ApplicationTabs-1").removeClass(); $("#ApplicationTabs-1").addClass('k-content'); $("#ApplicationTabs-1").removeAttr("style");
    $("#ApplicationTabs-2").removeClass(); $("#ApplicationTabs-2").addClass('k-content k-state-active'); $("#ApplicationTabs-2").attr("style", "display: block;");
    $('#btnIssueStock').prev().append("<table style='width:100%'><tr><td colspan='1' class='formlabel'><font color='red'>*</font> No. of AWB</td><td colspan='1' ><input onblur='GetMaxIssueAWB(this)' type='text' class='k-input k-state-default' name='IssueOfficeAWB' id='IssueOfficeAWB' style='width: 30px; text-align: right;' controltype='range' data-valid='required' data-valid-msg='No of AWB can not be blank' tabindex='5' maxlength='3' value='' data-role='numerictextbox'></td></tr></table>");
}
function OpenThiredTab() {
    //------- Open Third Tab-----------
    $("#ApplicationTabs").find("li[id='lioffice']").removeClass();
    $("#ApplicationTabs").find("li[id='liOfficeCommision']").removeClass();
    $("#ApplicationTabs").find("li[id='lioffice']").addClass("k-item k-state-default");
    $("#ApplicationTabs").find("li[id='liOfficeCommision']").addClass("k-state-active k-item k-tab-on-top k-state-default k-first");
    $("#ApplicationTabs-1").removeClass(); $("#ApplicationTabs-1").addClass('k-content'); $("#ApplicationTabs-1").removeAttr("style");
    $("#ApplicationTabs-3").removeClass(); $("#ApplicationTabs-3").addClass('k-content k-state-active'); $("#ApplicationTabs-3").attr("style", "display: block;");

}

function ResetAutoComplete() {
    try {
        $.ajax({
            url: "./Services/Stock/StockAWBService.svc/GetCityofficeInformation", async: false, type: "POST", dataType: "json", cache: false,
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




function Clear(object) {
    if (object == "Text_City") {
        $("#Text_Office").val('');
        $("#Office").val('');
    }
    if (object == "Text_GSACity") {
        $("#Text_GSAOffice").val('');
        $("#GSAOffice").val('');
        $("#Text_Account").val('');
        $("#Account").val('');
    }
    if (object == "Text_GSAOffice") {
        $("#Text_Account").val('');
        $("#Account").val('');
    }
}
function ExtraCondition(textId) {

    var f = cfi.getFilter("AND");


    if (textId == "Text_AWBPrefix") {
        try {


            cfi.setFilter(f, "IsInterline", "eq", "0")
            //cfi.setFilter(f, "IsActive", "eq", "0")

            return cfi.autoCompleteFilter([f]);

        }
        catch (exp)
        { }
    }

    if (textId == "Text_AWBType") {
        try {
            cfi.setFilter(f, "IsAirline", "eq", "0")
            //cfi.setFilter(f, "IsActive", "eq", "0")

            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
    if (textId == "Text_GSAAWBType") {
        try {
            cfi.setFilter(f, "IsAirline", "eq", "0")
            //cfi.setFilter(f, "IsActive", "eq", "0")

            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
    if (textId == "Text_Office") {
        try {
            cfi.setFilter(f, "CitySNo", "eq", $("#City").val())
            cfi.setFilter(f, "AirlineCode", "eq", $("#AWBPrefix").val())
            //cfi.setFilter(f, "OfficeType", "neq", 2)
            //cfi.setFilter(f, "IsActive", "eq", 1)
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
    if (textId == "Text_GSAOffice") {
        try {
            cfi.setFilter(f, "CityCode", "eq", $("#Text_GSACity").val())
            return cfi.autoCompleteFilter([f]);
        }
        catch (exp)
        { }
    }
    if (textId == "Text_Account") {
        try {

            if ($("#Text_GSAIsAutoAWB").data("kendoAutoComplete").value() == "CASS") {

                var g = cfi.getFilter("AND");

                var or = cfi.getFilter("OR");

                cfi.setFilter(or, "OfficeSNo", "eq", $("#GSAOffice").val());
                cfi.setFilter(or, "OfficeParentID", "eq", $("#GSAOffice").val());

                //cfi.setFilter(g, "ParentID", "eq", $("#GSAOffice").val());

                //cfi.setFilter(f, "OfficeSNo", "eq", $("#GSAOffice").val())                
                cfi.setFilter(f, "IsBlacklist", "eq", 0)
                cfi.setFilter(f, "IsActive", "eq", 1)
                //cfi.setFilter(f, "TransactionType", "eq", 1)


                g = cfi.autoCompleteFilter([or, f], "OR");

                return g;

                //var orlogic = cfi.getFilter('OR');
                //orlogic.filters.push(f);
                //orlogic.filters.push(g);
                //return orlogic;
                ////return cfi.autoCompleteFilter([f, g, f, f, f]);

            }
            else {
                cfi.setFilter(f, "OfficeSNo", "eq", $("#GSAOffice").val())
                cfi.setFilter(f, "IsBlacklist", "eq", 0)
                cfi.setFilter(f, "IsActive", "eq", 1)
                return cfi.autoCompleteFilter([f]);
            }

        }
        catch (exp)
        { }
    }
}

function SetAWB(e) {

    AWBNumber();
}

function AWBNumber(e) {

    if ($("#Text_IsAutoAWB").val() != "" && $("#Text_AWBType").val() != "" && $("#Text_AWBPrefix").val() != "") {
        $("#btnCreateStock").hide();
        var Data = "";
        var intRegex = /^\d+$/;
        var AWBType = $("#AWBType").val();

        var AutoAWB = $('#IsAutoAWB').val();
        var CountryCode = $("#Text_CountryCode").val();
        var ExpiryDate = $("#ExpiryDate").val();
        var AWBPrefix = $("#AWBPrefix").val();
        $("#EndRange").val('');
        $("#NOOFAWB").val('');
        $("#_tempEndRange").val('');
        $("#_tempNOOFAWB").val('');
        if (ExpiryDate == "")
            ExpiryDate = '1900-01-01'

        if (intRegex.test(Data)) { AWBPrefix = Data; } else { CountryCode = Data; }

        if (AWBPrefix != "0" && AWBPrefix != "") {
            $.ajax({
                type: "POST",
                url: "./Services/Stock/StockAWBService.svc/GetMaxAWBNumber?AWBPrefix=" + AWBPrefix + "&AWBType=" + AWBType + "&IsAutoAWB=" + AutoAWB + "&CountryCode=" + 0 + "&ExpiryDate=" + ExpiryDate,
                data: JSON.stringify({ id: 1 }),
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
    else {
        //ShowMessage('info', '', "Please Select Stock Type & AWB Type First");
        $("#AWBNumber").val('');
        $("#_tempAWBNumber").val('');
    }
}

function CheckAWB(e) {
    var intRegex = /^\d+$/;
    var Data = $("#AWBNumber").val();
    var a = parseInt(Data);
    if (Data != "") {
        if (!intRegex.test(Data)) {
            ShowMessage('info', '', "AWB No. Must be Numeric");//alert("AWB No. Must be Numeric"); 
            $("#AWBNumber").val('');
        }
        else if (Data.length < 7) {
            ShowMessage('info', '', "AWB No. Lenght Must be Seven Character");//alert("AWB No. Lenght Must be Seven Character"); 
            $("#AWBNumber").val('');
        }
        else if (a == 0) {
            ShowMessage('info', '', "AWB No. can not be Zero");//alert("AWB No. can not be Zero");
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
        url: "./Services/Stock/StockAWBService.svc/GetCity?recid=" + AWBPrefix,
        data: JSON.stringify({ id: 1 }),
        dataType: "json",
        success: function (response) {
            var SNo = response.Data[0];
            var code = response.Data[1];

            $("#CommoditySNo").val(SNo);
            $("#Text_CommoditySNo").val(code);
        }
    });


}
function StartRangeClear(e) {
    var Data = e.value;
    if (Data != "") {
        $("#EndRange").val("");
        $("#_tempEndRange").val("");
        $("#NOOFAWB").val("");
        $("#_tempNOOFAWB").val("");
        $("#AWBNumber").val(pad(Data, "7"));
        $("#_tempAWBNumber").val(pad(Data, "7"));
    }
}
function EndRangeCount(e) {
    var Data = e.value;

    var StartRange = $("#AWBNumber").val()
    if (StartRange == "") {
        //alert("Please Enter Start Range");
        ShowMessage('info', '', "Start Range can not be blank");
        $("#EndRange").val("");
    }
    StartRange = StartRange - 1;
    var Difference = parseInt(Data) - parseInt(StartRange);
    
    if (Difference > 1000000) {
        if (userContext.SysSetting.ClientEnvironment != 'UK') {
            ShowMessage('info', '', "Enter Max 1000000 only");//alert("Enter Max 1000 only");
            $("#EndRange").val('');
        }
    }
    else if (Difference < 0) {
        // alert("End Range Should be greater than Start Range");
        ShowMessage('info', '', "End Range Should be greater than Start Range.");
        $("#EndRange").val('');
    }
    else if (Data == 0) {
        $("#EndRange").val('');
    }
    else if (Data > 0 && $("#AWBNumber").val() > 0) {
        var Count = parseInt(Data) - parseInt(StartRange);
        $("#NOOFAWB").val(Count);
        $("#_tempNOOFAWB").val(Count);
        $("#_tempEndRange").val('');
        $("#EndRange").val(pad(Data, "7"));
        $("#_tempEndRange").val(pad(Data, "7"));
    }
}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

var SecondtRevArr = [];

function ForwardStock() {
    var FirstArr = []; var SecondtArr = []; var SecondAWB = "";

    var ListAWB2 = "";
    var ListAWB1 = "";

    $('#lstIssue-To-Office option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstOfficeCreatedstock :selected').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblIssue-To-Office").html(0);
    $("#lblIssue-To-Office").html((FirstArr.length) - 1);

    $("#lstIssue-To-Office").html(ListAWB1);

    $('#lstOfficeCreatedstock :not(:selected)').each(function (i, selectedElement) {
        //var CreatearrayAWBNo = {};
        //CreatearrayAWBNo.AWBNo = pad($(selectedElement).val().substring(4,12), 8);
        //SecondtArr.push(CreatearrayAWBNo);
        SecondAWB = SecondAWB + ('<option>' + $(selectedElement).val() + '</option>');
    });

    SecondtArr = SecondAWB.split('</option>');
    $("#lblOfficeCreatedStock").html(0);
    $("#lblOfficeCreatedStock").html((SecondtArr.length) - 1);

    $("#lstOfficeCreatedstock").html('');
    $("#lstOfficeCreatedstock").html(SecondAWB);

    if ($("#lstIssue-To-Office option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', true);
    }
    else if ($("#lstOfficeCreatedstock option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', false);
    }

}
function ForwardAllStock() {
    var FirstArr = []; var SecondtArr = [];
    var ListAWB2 = "";
    var ListAWB1 = "";

    $('#lstIssue-To-Office option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstOfficeCreatedstock option').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblIssue-To-Office").html(0);
    $("#lblIssue-To-Office").html((FirstArr.length) - 1);

    $("#lstIssue-To-Office").html(ListAWB1);
    $("#lblOfficeCreatedStock").html(0);
    $("#lstOfficeCreatedstock").html('');

    if ($("#lstIssue-To-Office option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', true);
    }
    else if ($("#lstOfficeCreatedstock option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', false);
    }

}
function ReverseStock() {
    var SecondRevAWB = ""; var SecondAWB = "";
    var FirstArr = []; var SecondtArr = [];
    var ListAWB2 = "";
    var ListAWB1 = "";

    $('#lstOfficeCreatedstock option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstIssue-To-Office :selected').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblOfficeCreatedStock").html(0);
    $("#lblOfficeCreatedStock").html((FirstArr.length) - 1);
    $("#lstOfficeCreatedstock").html(ListAWB1);


    $('#lstIssue-To-Office :not(:selected)').each(function (i, selectedElement) {
        SecondRevAWB = SecondRevAWB + ('<option>' + $(selectedElement).val() + '</option>');
    });

    SecondtArr = SecondRevAWB.split('</option>');
    $("#lblIssue-To-Office").html(0);
    $("#lblIssue-To-Office").html((SecondtArr.length) - 1);

    $("#lstIssue-To-Office").html('');
    $("#lstIssue-To-Office").html(SecondRevAWB);
    if ($("#lstIssue-To-Office option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', true);
    }
    else if ($("#lstOfficeCreatedstock option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', false);
    }

}
function ReverseAllStock() {
    var ListAWB2 = "";
    var ListAWB1 = "";
    var FirstArr = []; var SecondtArr = [];
    $('#lstOfficeCreatedstock option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstIssue-To-Office option').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblOfficeCreatedStock").html(0);
    $("#lblOfficeCreatedStock").html((FirstArr.length) - 1);

    $("#lstOfficeCreatedstock").html(ListAWB1);
    $("#lstIssue-To-Office").html('');
    $("#lblIssue-To-Office").html(0);

    if ($("#lstIssue-To-Office option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', true);
    }
    else if ($("#lstOfficeCreatedstock option").length > 0) {
        $('#IssueOfficeAWB').attr('disabled', false);
    }
}



function GetStockList(ListId) {
    var GetStockListArr = [];
    $('#' + ListId + ' option').each(function (i, selectedElement) {
        var CreatearrayAWBNo = {};
        CreatearrayAWBNo.AWBNo = pad($(selectedElement).val().substring(4, 12), 8);
        GetStockListArr.push(CreatearrayAWBNo);
    });
    return GetStockListArr;
}


var StockArr = [];
var CreateStockArr = [];
function GenerateStock() {

    //if (!cfi.ValidateForm()) return false;;
    var fromDate = $("#Date").attr("sqldatevalue");
    var toDate = $("#ExpiryDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $("#Date").val("");
            $("#Date").attr("sqldatevalue", "");
            $("#ExpiryDate").val("");
            $("#ExpiryDate").attr("sqldatevalue", "");
           
            ShowMessage('warning', 'Warning - Stock!', "Issue date should not be greater than Expiry date !");
            return false;
        }
    }
    CreateStockArr = [];
    var AirlineCode = $("#AWBPrefix").val();
    var val = $("#AWBNumber").val();
    var No = $("#NOOFAWB").val();
    var AWB = "";
    //if (($('#ExpiryDate').val() == "") || ($('#ExpiryDate').val() == undefined) || ($('#Date').val() == "") || ($('#Date').val() == undefined)) {
    //    ShowMessage('info', 'Need your Kind Attention!', "Date can not be blank "); return false;
    //}
    if (AirlineCode == "")
        return false;
    else if ($('#AWBType').val() == '')
        return false;
    else if ($('#IsAutoAWB').val() == '')
        return false;
    //else if (fromDate == '')
    //    return false;
    //else if (toDate == '')
    //    return false;
    else if (No == '')
        return false;
    else {
        $("#lstCreatedstock").html(''); // Bind html
        $("#lblTotalGeneratedAWBNo").html(0); // Bind html

        if (parseInt(val) > 0 && parseInt(No) > 0) {
            for (var i = 0; i < parseInt(No) ; i++) {
                var AWBNo = val.toString() + (parseInt(val) % 7).toString();
                if (AWBNo.length > 8) {
                    ShowMessage('warning', 'Warning!', "AWB Stock has breached the maximum limit. Cannot create AWB Stock !");
                    return;
                }
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

            // $("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
            $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
            $("#AWBNumber").attr("disabled", "disabled");
            $("#EndRange").attr("disabled", "disabled");
            $("#Text_AWBPrefix").attr("disabled", "disabled");
            $("#Text_IsAutoAWB").attr("disabled", "disabled");
            $("#Text_AWBType").attr("disabled", "disabled");
            $("#NOOFAWB").attr("disabled", "disabled");
            $("span[class='k-icon k-i-arrow-s']").html('');
            $("span[class='k-icon k-i-arrow-s']").removeClass();

            $("#Date").data("kendoDatePicker").enable(false);
            $("#ExpiryDate").data("kendoDatePicker").enable(false);
            $("#Text_AWBPrefix").attr("disabled", "disabled");
            //$("#IssueStock").show();
            $("span[class='k-icon k-i-calendar k-i-arrow-s']").html('');
            $("span[class='k-icon k-i-calendar k-i-arrow-s']").removeClass();

            if ($('#btnGenerateExcel').length > 0) {
                $("#lstTotalCreatedStock").closest('td').find($('#btnGenerateExcel')).remove()
            }
            
        }
    }
}
function CreateStock() {

    var AWBPrefix = $("#AWBPrefix").val();
    var AWBType = $("#AWBType").val();
    var IsAutoAWB = $('#IsAutoAWB').val(); //$("#IsAutoAWB:checked").val();
    var CountryCode = parseInt(0);// = $("#CountryCode").val();
    var ExpiryDate = $("#ExpiryDate").val();

    //if (($('#ExpiryDate').val() == "") || ($('#ExpiryDate').val() == undefined) || ($('#Date').val() == "") || ($('#Date').val() == undefined)) {
    //    ShowMessage('info', 'Need your Kind Attention!', "Date can not be blank "); return false;
    //}

    var strData = [];
    var CreatedAWB = "";
    var alradyCreatedStock = "";
    for (var i = 0; i < CreateStockArr.length ; i++) {
        var Array = {
            AWBNo: CreateStockArr[i].AWBNo
        };
        strData.push(Array);
    }

    //alert(strData);
    $.ajax({
        url: "./Services/Stock/StockAWBService.svc/CreateStock", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AwbList: strData, AWBPrefix: AWBPrefix, AWBType: AWBType, IsAutoAWB: IsAutoAWB, CountryCode: CountryCode, ExpiryDate: ExpiryDate }),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response[0].leftStock.length > 0) {
                var count = 0;
                for (var i = 0; i < response.length ; i++) {
                    if (response[i].leftStock.length > 0) {
                        for (var j = 0; j < response[i].leftStock.length; j++) {
                            CreatedAWB = CreatedAWB + ('<option>' + $("#AWBPrefix").val() + '-' + response[i].leftStock[j].AWBNo + '</option>');
                            var CreatearrayAWBNo = {};
                            CreatearrayAWBNo.AWBNo = (response[i].leftStock[j].AWBNo);
                            LeftStockArr.push(CreatearrayAWBNo);
                            TotalCreatedStockAWB = response[i].leftStock.length;
                            count++;
                        }
                    }
                }

                $("#OfficeStockCreated").show();
                $("#IssueStock").show();
                $("#lstTotalCreatedStock").html(CreatedAWB);
                $("#lblTotalCreatedStock").html(count);
                $("#lstOfficeCreatedstock").html(CreatedAWB);
                $("#lblOfficeCreatedStock").html(count);

                $("#_tempIssueAWB").val(count);
                $("#IssueAWB").val(count);
                // $("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
                // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
                $("#AWBNumber").attr("disabled", "disabled");
                $("#Text_AWBPrefix").attr("disabled", "disabled");
                $("#NOOFAWB").attr("disabled", "disabled");
                $("#IssueStock").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
                $("#IssueStock").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');
                $("#btnGenerate").hide();
                $("#trIssueStock").hide();
                $("#btnReset").hide();
                $("#btnCreateStock").hide();
                $("#btnGenerate").hide();
                $("#Text_AWBPrefix").attr("disabled", "disabled");
                $("#IssueStock").show();
                $("#Remarks").css("height", "20px");
                // ShowMessage('info', 'Need your Kind Attention!', "Stock Created Successfully.");
                ShowMessage('success', 'Success!', "Stock Created Successfully.");
                if ($('#Text_IsAutoAWB').val() != 'AUTO') {
                    OpenSecondTab();
                }
                else {
                    var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
                    tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);
                    tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
                }
                //alert("Stock Created Successfully >> Go To Next Tab For Issue Stock To Office.");

            }
            var count = 0;
            if (response.length > 0) {
                var count = 0;
                for (var i = 0; i < response.length ; i++) {
                    if (response[i].alradyCreatedStock.length > 0) {
                        for (var j = 0; j < response[i].alradyCreatedStock.length; j++) {
                            alradyCreatedStock = alradyCreatedStock + ('<option>' + response[i].alradyCreatedStock[j].AWBNo + '</option>');
                            count++;
                        }
                    }
                }

                $("#lstExistStock").html(alradyCreatedStock);
                $("#lblExistStock").html(count);
                if ($("#lstExistStock option").length > 0) {
                    $('#btnCreateStock').hide();
                }
                $("#lstTotalCreatedStock").closest('td').append(buttonhtml);
            }

        }
    });
}
var LeftStockArr = [];

function CreateStock1() {
    var CreatedAWB = "";
    var alradyCreatedStock = "";
    var AWBPrefix = $("#AWBPrefix").val();
    var AWBType = $("#AWBType").val();
    var IsAutoAWB = $('#IsAutoAWB').val(); //$("#IsAutoAWB:checked").val();
    var CountryCode = 0; // = $("#CountryCode").val();
    var ExpiryDate = $("#ExpiryDate").val();
    var GroupSNo = $("#hdnGroupSNo").val();
    var strData1 = JSON.stringify(CreateStockArr);
    var strData2 = strData1.replace(/"/g, "@");
    var strData = strData2.replace(/{@AWBNo@:@/g, "A");
    $.ajax({
        type: "POST",
        url: "./Services/Stock/StockAWBService.svc/CreateStock?AWBPrefix=" + AWBPrefix + "&AWBType=" + AWBType + "&IsAutoAWB=" + IsAutoAWB + "&CountryCode=" + CountryCode + "&ExpiryDate=" + ExpiryDate,
        data: JSON.stringify({ strData: btoa(strData) }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            // if (response[0].leftStock.length > 0 && GroupSNo != 57) { // Commented by purushottam kumar discuss with manish sir 
            if (response[0].leftStock.length > 0) {
                for (var i = 0; i < (response[0].leftStock.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].leftStock[i].AWBNo + '</option>');

                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[0].leftStock[i].AWBNo);
                    LeftStockArr.push(CreatearrayAWBNo);
                    TotalCreatedStockAWB = response[0].leftStock.length;
                }

                $("#OfficeStockCreated").show();
                $("#IssueStock").show();
                $("#lstTotalCreatedStock").html(CreatedAWB);
                $("#lblTotalCreatedStock").html(response[0].leftStock.length);
                $("#lstOfficeCreatedstock").html(CreatedAWB);
                $("#lblOfficeCreatedStock").html(response[0].leftStock.length);

                $("#_tempIssueAWB").val(response[0].leftStock.length);
                $("#IssueAWB").val(response[0].leftStock.length);
                // $("input[type='radio'][id='AWBType']").attr("disabled", "disabled");
                // $("input[type='radio'][id='IsAutoAWB']").attr("disabled", "disabled");
                $("#AWBNumber").attr("disabled", "disabled");
                $("#Text_AWBPrefix").attr("disabled", "disabled");
                $("#NOOFAWB").attr("disabled", "disabled");
                $("#IssueStock").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
                $("#IssueStock").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');
                $("#btnGenerate").hide();
                $("#trIssueStock").hide();
                $("#btnReset").hide();
                $("#btnCreateStock").hide();
                $("#btnGenerate").hide();
                $("#Text_AWBPrefix").attr("disabled", "disabled");
                $("#IssueStock").show();
                $("#Remarks").css("height", "20px");
                // ShowMessage('info', 'Need your Kind Attention!', "Stock Created Successfully.");
                ShowMessage('success', 'Success!', "Stock Created Successfully.");
                OpenSecondTab();
                //alert("Stock Created Successfully >> Go To Next Tab For Issue Stock To Office.");

            }
            if (response[0].alradyCreatedStock.length > 0) {
                for (var i = 0; i < (response[0].alradyCreatedStock.length) ; i++) {
                    alradyCreatedStock = alradyCreatedStock + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].alradyCreatedStock[i].AWBNo + '</option>');
                }
                $("#lstExistStock").html(alradyCreatedStock);
                $("#lblExistStock").html(response[0].alradyCreatedStock.length);
            }


        }
    });
}


function GetStockListOnNoofAWB(ListId) {
    var GetStockListArr = [];
    //$('#' + ListId + ' option').each(function (i, selectedElement) {
    //    var CreatearrayAWBNo = {};
    //    CreatearrayAWBNo.AWBNo = pad($(selectedElement).val().substring(4, 12), 8);
    //    GetStockListArr.push(CreatearrayAWBNo);
    //});

    if ($('#' + ListId + ' option').length > 0) {
        for (var i = 0; i < NoOfAWB; i++) {
            var Element = $('#' + ListId + ' option:eq(' + i + ')').val();
            var CreatearrayAWBNo = {};
            CreatearrayAWBNo.AWBNo = Element.substring(4, 12);
            GetStockListArr.push(CreatearrayAWBNo);
        }
    }

    return GetStockListArr;
}
var IssuedOfficeStock = "";
var IssuedOfficeStockLength = 0;
var NoOfAWB = "";
function IssueStock() {





    if ($('#City').val() == '' || $('#Office').val() == '') {
        ShowMessage('info', '', "City code or Office Name can not be blank");
        return false;
    }

    if ($("#lstIssue-To-Office option").length > 0) {

        NoOfAWB = 0;
    } else if ($("#lstOfficeCreatedstock option").length > 0) {
        NoOfAWB = $("#IssueOfficeAWB").val();
        if (NoOfAWB == '' || NoOfAWB == '0') {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No"); return false;
        }
    }


    //if ($("#lstOfficeCreatedstock option").length > 0) {
    //    if (NoOfAWB != '') {
    //        ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No"); return false;
    //    }
    //}




    var CreatedAWB = "";
    var LeftCreatedStock = "";
    var alradyCreatedStock = "";
    var OfficeStockArr = [];
    var AWBPrefix = $("#AWBPrefix").val();
    var CitySNo = $("#City").val();
    var OfficeSNo = $("#Office").val();
    var Remark = $("#Remarks").val();



    //var strData1 = JSON.stringify(LeftStockArr);
    OfficeStockArr = GetStockList("lstIssue-To-Office");

    if (OfficeStockArr.length == 0) {
        if (NoOfAWB != "" || NoOfAWB != "0") {
            OfficeStockArr = GetStockListOnNoofAWB("lstOfficeCreatedstock");
            var strData1 = JSON.stringify(GetStockListOnNoofAWB("lstOfficeCreatedstock"));
            var strData2 = strData1.replace(/"/g, "@");
            var strData = strData2.replace(/{@AWBNo@:@/g, "A");
        }
    }
    else if (OfficeStockArr.length > 0) {

        var strData1 = JSON.stringify(GetStockList("lstIssue-To-Office"));
        var strData2 = strData1.replace(/"/g, "@");
        var strData = strData2.replace(/{@AWBNo@:@/g, "A");
    }
    //    var strData = JSON.stringify(LeftStockArr);

    $("#lstIssueStockOffice").html('');
    $("#lblIssueStockOffice").html(0);
    //$("#lstOfficeExistStock").html('');
    //$("#lblOfficeExistStock").html(0);

    // if ($('#lstIssueStockOffice option:selected').length == 0) {
    //        if (NoOfAWB != "" && NoOfAWB != "0") {
    //            for (var i = 0; i < NoOfAWB; i++) {
    //                var Id = $('#lstIssueStockOffice option:eq(' + i + ')').val();
    //                selval.push(Id.substring(Id.indexOf('-'), 20));
    //            }
    //            var s = JSON.stringify(selval);
    //            var sadd = s.replace(/"/g, "@}");
    //            strData = sadd.replace(/@}-/g, "A");
    //        }
    //        else if (NoOfAWB == "" || NoOfAWB == "0") {
    //            ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No");
    //            return false;
    //        }
    //    }


    if (OfficeStockArr.length > 0) {
        $.ajax({
            type: "POST",
            url: "./Services/Stock/StockAWBService.svc/IssueStock",
            data: JSON.stringify({ strData: btoa(strData), AWBPrefix: AWBPrefix, CitySNo: CitySNo, OfficeSNo: OfficeSNo, Remark: Remark, NoOfAWB: NoOfAWB }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                $("#lstIssue-To-Office").html('');
                $("#lblIssue-To-Office").html(0);

                if (response[0].leftStock.length > 0) {
                    for (var i = 0; i < (response[0].leftStock.length) ; i++) {
                        IssuedOfficeStock = IssuedOfficeStock + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].leftStock[i].AWBNo + '</option>');
                        CreatedAWB = CreatedAWB + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].leftStock[i].AWBNo + '</option>');

                        var CreatearrayAWBNo = {};
                        CreatearrayAWBNo.AWBNo = (response[0].leftStock[i].AWBNo);
                        IssueStockToAgentArr.push(CreatearrayAWBNo);
                    }
                    //IssuedOfficeStockLength = parseInt(IssuedOfficeStockLength) + parseInt(response[0].leftStock.length);
                    //ShowMessage('info', 'Need your Kind Attention!', "Stock Successfully Issue to Office"); //commented by purushottam kumar
                    ShowMessage('success', 'Success!', "Stock Successfully Issued To Office");
                    $("#AgentStockCreated").show();
                    $("#AgentIssueStock").show();
                    $("#lstIssueStockOffice").html(CreatedAWB);
                    $("#lblIssueStockOffice").html(response[0].leftStock.length)

                    $("#ApplicationTabs").find("li[id='liOfficeAirline']").removeClass();
                    $("#ApplicationTabs").find("li[id='liOfficeCommision']").removeClass();
                    $("#ApplicationTabs").find("li[id='liOfficeAirline']").addClass("k-item k-state-default");
                    $("#ApplicationTabs").find("li[id='liOfficeCommision']").addClass("k-state-active k-item k-tab-on-top k-state-default k-first");
                    $("#ApplicationTabs-2").removeClass(); $("#ApplicationTabs-2").addClass('k-content'); $("#ApplicationTabs-2").removeAttr("style");
                    $("#ApplicationTabs-3").removeClass(); $("#ApplicationTabs-3").addClass('k-content k-state-active'); $("#ApplicationTabs-3").attr("style", "display: block;");

                    //-------------------- Autocomplete convert to v2

                    cfi.AutoCompleteV2("GSACity", "CityCode", "CreateStock_GSACityStock", Clear, "contains");
                    cfi.AutoCompleteV2("GSAOffice", "Name", "CreateStock_GSAOfficeStock", Clear, "contains");
                    cfi.AutoCompleteV2("Account", "AccountCode,Name", "Stock_Account", GetAvailableStockForAccount, "contains");


                    $("#Text_GSACity").val($("#Text_City").val());
                    $("#GSACity").val($("#City").val());
                    $("#Text_GSAOffice").val($("#Text_Office").val());
                    $("#GSAOffice").val($("#Office").val());
                    $("#Text_GSAIsAutoAWB").val($('#Text_IsAutoAWB').val());
                    $("#GSAIsAutoAWB").val($('#IsAutoAWB').val());

                    $("#Text_GSACity").attr("disabled", "disabled");
                    $("#Text_GSAOffice").attr("disabled", "disabled");
                    $("#Text_GSAIsAutoAWB").attr("disabled", "disabled");

                    $("#divGetIssuedOfficeStock").find("span[class='k-icon k-i-arrow-s']").html('');
                    $("#divGetIssuedOfficeStock").find("span[class='k-icon k-i-arrow-s']").removeClass();
                }
                if (response[0].leftAWBStock.length > 0) {
                    for (var i = 0; i < (response[0].leftAWBStock.length) ; i++) {
                        //IssuedOfficeStock = IssuedOfficeStock + ('<option>' + $("#Text_AWBPrefix").val() + '-' + response[0].leftAWBStock[i].AWBNo + '</option>');
                        LeftCreatedStock = LeftCreatedStock + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].leftAWBStock[i].AWBNo + '</option>');

                    }
                    $("#lstIssue-To-Office").html(LeftCreatedStock);
                    $("#lblIssue-To-Office").html(response[0].leftAWBStock.length)
                    TotalCreatedStockAWB = response[0].leftAWBStock.length;
                    $("#_tempIssueAWB").val(response[0].leftAWBStock.length);
                    $("#IssueAWB").val(response[0].leftAWBStock.length);

                }

                //if (response[0].alradyCreatedStock.length > 0) {
                //    for (var i = 0; i < (response[0].alradyCreatedStock.length) ; i++) {
                //        alradyCreatedStock = alradyCreatedStock + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].alradyCreatedStock[i].AWBNo + '</option>');
                //    }
                //    $("#lstOfficeExistStock").html(alradyCreatedStock);
                //    $("#lblOfficeExistStock").html(response[0].alradyCreatedStock.length);
                //}


                $("#divGetIssuedOfficeStock").show();
                $("#AgentStockCreated").hide();
                $("#AgentIssueStock").hide();
                $("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
                $("#divAccount").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');
                //$("#divGetIssuedOfficeStock").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s");
                //$("#divGetIssuedOfficeStock").find("span[class='k-select']").find("span").addClass("k-icon k-i-arrow-s").html('select');
                $('#tdTotalIssueAWBtoAgent').closest('table').append("<tr><td colspan='1' class='formlabel'><font color='red'>*</font> No. of AWB</td><td colspan='1' ><input onblur='GetMaxIssueAWB(this)' type='text' class='k-input k-state-default' name='IssueAgentStockAWB' id='IssueAgentStockAWB' style='width: 30px; text-align: right;' controltype='range' data-valid='required' data-valid-msg='No of AWB can not be blank' tabindex='5' maxlength='3' value='' data-role='numerictextbox'></td></tr>")
            }
        });
    }
    else {
        //alert("Please add stock first !!");
        ShowMessage('info', '', "Add stock first !!");

    }

}



function GetAvailableStock() {
    var alradyCreatedStock = "";
    $("#lstOfficeExistStock").html('');
    $("#lblOfficeExistStock").html(0);

    var AWBPrefix = $('#AWBPrefix').val();
    var IsAutoAWB = $('#IsAutoAWB').val();
    var AWBType = $('#AWBType').val();
    var CitySNo = $('#City').val();
    var OfficeSNo = $('#Office').val();
    var AccountSNo = $('#Account').val();
    var WhereCondition = "";

    try {
        $.ajax({
            url: "./Services/Stock/StockAWBService.svc/CountAlreadyIssuedStock", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBPrefix: AWBPrefix, IsAutoAWB: IsAutoAWB, AWBType: AWBType, CitySNo: CitySNo, OfficeSNo: OfficeSNo, AccountSNo: AccountSNo, WhereCondition: WhereCondition }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                //var resData = Data.Table0;
                if (Data.Table0.length > 0) {
                    for (var i = 0; i < (Data.Table0.length) ; i++) {
                        alradyCreatedStock = alradyCreatedStock + ('<option>' + Data.Table0[i].AWBNo + '</option>');
                    }
                    $("#lstOfficeExistStock").html(alradyCreatedStock);
                    $("#lblOfficeExistStock").html(Data.Table1[0].Count);

                }
                else {

                }
            }
        });
    }
    catch (exp) { }
}


function GetAvailableStockForAccount() {
    var alradyCreatedStock = "";
    $("#lstAgentExistStock").html('');
    $("#lblAgentExistStock").html(0);

    var AWBPrefix = $('#AWBPrefix').val();
    var IsAutoAWB = $('#IsAutoAWB').val();
    var AWBType = $('#AWBType').val();
    var CitySNo = $('#City').val();
    var OfficeSNo = $('#Office').val();
    var AccountSNo = $('#Account').val();
    var WhereCondition = "";

    try {
        $.ajax({
            url: "./Services/Stock/StockAWBService.svc/CountAlreadyIssuedStockForAccount", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBPrefix: AWBPrefix, IsAutoAWB: IsAutoAWB, AWBType: AWBType, CitySNo: CitySNo, OfficeSNo: OfficeSNo, AccountSNo: AccountSNo, WhereCondition: WhereCondition }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                //var resData = Data.Table0;
                if (Data.Table0.length > 0) {
                    for (var i = 0; i < (Data.Table0.length) ; i++) {
                        alradyCreatedStock = alradyCreatedStock + ('<option>' + Data.Table0[i].AWBNo + '</option>');
                    }
                    $("#lstAgentExistStock").html(alradyCreatedStock);
                    $("#lblAgentExistStock").html(Data.Table1[0].Count);

                }
                else {

                }
            }
        });
    }
    catch (exp) { }
}


function ForwardStockAgent() {
    var FirstArr = []; var SecondtArr = []; var SecondAWB = "";

    var ListAWB2 = "";
    var ListAWB1 = "";

    $('#lstIssue-To-Agent option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstIssuedOfficeStock :selected').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblIssue-To-Agent").html(0);
    $("#lblIssue-To-Agent").html((FirstArr.length) - 1);

    $("#lstIssue-To-Agent").html(ListAWB1);

    $('#lstIssuedOfficeStock :not(:selected)').each(function (i, selectedElement) {
        //var CreatearrayAWBNo = {};
        //CreatearrayAWBNo.AWBNo = pad($(selectedElement).val().substring(4,12), 8);
        //SecondtArr.push(CreatearrayAWBNo);
        SecondAWB = SecondAWB + ('<option>' + $(selectedElement).val() + '</option>');
    });

    SecondtArr = SecondAWB.split('</option>');
    $("#lblIssuedOfficeStock").html(0);
    $("#lblIssuedOfficeStock").html((SecondtArr.length) - 1);

    $("#lstIssuedOfficeStock").html('');
    $("#lstIssuedOfficeStock").html(SecondAWB);
    if ($("#lstIssue-To-Agent option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', true);
    }
    else if ($("#lstIssuedOfficeStock option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', false);
    }
}
function ForwardAllStockAgent() {
    var FirstArr = []; var SecondtArr = [];
    var ListAWB2 = "";
    var ListAWB1 = "";

    $('#lstIssue-To-Agent option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstIssuedOfficeStock option').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblIssue-To-Agent").html(0);
    $("#lblIssue-To-Agent").html((FirstArr.length) - 1);

    $("#lstIssue-To-Agent").html(ListAWB1);
    $("#lblIssuedOfficeStock").html(0);
    $("#lstIssuedOfficeStock").html('');

    if ($("#lstIssue-To-Agent option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', true);
    }
    else if ($("#lstIssuedOfficeStock option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', false);
    }
}
function ReverseStockAgent() {
    var SecondRevAWB = ""; var SecondAWB = "";
    var FirstArr = []; var SecondtArr = [];
    var ListAWB2 = "";
    var ListAWB1 = "";

    $('#lstIssuedOfficeStock option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstIssue-To-Agent :selected').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblIssuedOfficeStock").html(0);
    $("#lblIssuedOfficeStock").html((FirstArr.length) - 1);
    $("#lstIssuedOfficeStock").html(ListAWB1);


    $('#lstIssue-To-Agent :not(:selected)').each(function (i, selectedElement) {
        SecondRevAWB = SecondRevAWB + ('<option>' + $(selectedElement).val() + '</option>');
    });

    SecondtArr = SecondRevAWB.split('</option>');
    $("#lblIssue-To-Agent").html(0);
    $("#lblIssue-To-Agent").html((SecondtArr.length) - 1);

    $("#lstIssue-To-Agent").html('');
    $("#lstIssue-To-Agent").html(SecondRevAWB);

    if ($("#lstIssue-To-Agent option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', true);
    }
    else if ($("#lstIssuedOfficeStock option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', false);
    }
}
function ReverseAllStockAgent() {
    var ListAWB2 = "";
    var ListAWB1 = "";
    var FirstArr = []; var SecondtArr = [];
    $('#lstIssuedOfficeStock option').each(function (i, selectedElement) {
        ListAWB2 = ListAWB2 + ('<option>' + $(selectedElement).val() + '</option>');
    });

    $('#lstIssue-To-Agent option').each(function (i, selectedElement) {
        ListAWB1 = ListAWB1 + ('<option>' + $(selectedElement).val() + '</option>');
    });
    ListAWB1 = ListAWB1 + ListAWB2;

    FirstArr = ListAWB1.split('</option>');
    $("#lblIssuedOfficeStock").html(0);
    $("#lblIssuedOfficeStock").html((FirstArr.length) - 1);

    $("#lstIssuedOfficeStock").html(ListAWB1);
    $("#lstIssue-To-Agent").html('');
    $("#lblIssue-To-Agent").html(0);

    if ($("#lstIssue-To-Agent option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', true);
    }
    else if ($("#lstIssuedOfficeStock option").length > 0) {
        $('#IssueAgentStockAWB').attr('disabled', false);
    }
}

var IssuedOfficeStockArr = [];
function GetIssueStock() {
    IssuedOfficeStockArr = [];
    var CreatedAWB = "";
    $("#lstIssuedOfficeStock").html('');
    $("#lblIssuedOfficeStock").html(0)
    var CitySNo = $("#GSACity").val();
    var OfficeSNo = $("#GSAOffice").val();
    var AWBPrefix = $("#AWBPrefix").val();
    var AWBType = $("#AWBType").val();
    var IsAutoAWB = $("#GSAIsAutoAWB").val();
    if (CitySNo == "") {
        ShowMessage('info', '', "City Code can not be blank!!"); return false;
    }
    else if (OfficeSNo == "") {
        ShowMessage('info', '', "Office Name can not be blank!!"); return false;
    }
        //else if (AWBType == "") {
        //    ShowMessage('info', '', "AWB Type can not be blank !!"); return false;
        //}
    else if (IsAutoAWB == "") {
        ShowMessage('info', '', "Stock Type can not be blank!!"); return false;
    }
    else {

        $.ajax({
            type: "POST",
            url: "./Services/Stock/StockAWBService.svc/GetIssueStock?AWBType=" + AWBType + "&IsAutoAWB=" + IsAutoAWB + "&CitySNo=" + CitySNo + "&OfficeSNo=" + OfficeSNo,
            data: JSON.stringify({ AWBPrefix: AWBPrefix }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                if (response.length > 0) {
                    for (var i = 0; i < (response.length) ; i++) {
                        CreatedAWB = CreatedAWB + ('<option>' + $("#AWBPrefix").val() + '-' + response[i].AWBNo + '</option>');
                        var CreatearrayAWBNo = {};
                        CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                        IssuedOfficeStockArr.push(CreatearrayAWBNo);
                    }
                    $("#lstIssuedOfficeStock").html(CreatedAWB);
                    $("#lblIssuedOfficeStock").html(response.length);
                    $("#IssueAgentAWB").val(response.length);
                    $("#_tempIssueAgentAWB").val(response.length);
                    IssuedOfficeStockLength = response.length;
                    $("#IssueAgentAWB").attr("onblur", "GetMaxIssuetoAgentAWB(this)")
                    $("#AgentStockCreated").show();
                    $("#AgentIssueStock").show();

                    $("#btnResetIssueStock").show();
                    $("#btnGetIssueStock").hide();
                    $("#divGetIssuedOfficeStock").find("span[class='k-icon k-i-arrow-s']").html('');
                    $("#divGetIssuedOfficeStock").find("span[class='k-icon k-i-arrow-s']").removeClass();

                    $("#Text_GSACity").attr("disabled", "disabled");
                    $("#Text_GSAOffice").attr("disabled", "disabled");
                    $("#Text_GSAIsAutoAWB").attr("disabled", "disabled");
                    //$("#AgentIssueStock").find("input[type='text']").attr('data-valid', 'required');
                    //$("#AgentIssueStock").find("input[type='text']").attr('data-valid-msg', 'Required')
                }
                else {
                    ShowMessage('info', '', "No Stock found");// alert("No Stock found"); }
                }
            }
        });
    }
}

function IssueStocktoAgent() {
    if ($('#Account').val() == '')
    { ShowMessage('info', '', "Forwarder (Agent) Name can not be blank"); return false; }




    if ($("#lstIssue-To-Agent option").length > 0) {
        NoOfAWB = 0;
    } else if ($("#lstIssuedOfficeStock option").length > 0) {
        NoOfAWB = $("#IssueAgentStockAWB").val();
        if (NoOfAWB == '') {
            ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No"); return false;
        }
    }



    //if ($("#lstIssuedOfficeStock option").length > 0) {
    //    if ($('#IssueAgentStockAWB').val() == '') {
    //        ShowMessage('info', 'Need your Kind Attention!', "Please Select AWB No"); return false;
    //    }
    //}



    var CreatedAWB = "";
    var LeftCreatedStock = "";
    var alradyCreatedStock = "";
    var AgentStockArr = [];
    var AWBPrefix = $("#AWBPrefix").val();
    var AccountSNo = $("#Account").val();
    var OfficeSNo = $("#GSAOffice").val();
    var Remark = $("#AgentRemarks").val();


    //NoOfAWB = $("#IssueAgentStockAWB").val();


    var AutoRetrievalDate = $("#AutoRetrievalDate").val();

    $("#lstIssueStockAgent").html('');
    $("#lblIssueStockAgent").html(0);
    //$("#lstAgentExistStock").html('');
    //$("#lblAgentExistStock").html(0);

    AgentStockArr = GetStockList("lstIssue-To-Agent");
    //var strData1 = JSON.stringify(IssuedOfficeStockArr);
    //AgentStockArr = GetStockList("lstIssue-To-Agent");
    //var strData1 = JSON.stringify(GetStockList("lstIssue-To-Agent"));
    //var strData2 = strData1.replace(/"/g, "@");
    //var strData = strData2.replace(/{@AWBNo@:@/g, "A");
    //var strData = JSON.stringify(IssueStockToAgentArr);


    if (AgentStockArr.length == 0) {
        if (NoOfAWB != "" && NoOfAWB != "0") {
            AgentStockArr = GetStockListOnNoofAWB("lstIssuedOfficeStock");
            var strData1 = JSON.stringify(GetStockListOnNoofAWB("lstIssuedOfficeStock"));
            var strData2 = strData1.replace(/"/g, "@");
            var strData = strData2.replace(/{@AWBNo@:@/g, "A");
        }
    }
    else if (AgentStockArr.length > 0) {

        var strData1 = JSON.stringify(GetStockList("lstIssue-To-Agent"));
        var strData2 = strData1.replace(/"/g, "@");
        var strData = strData2.replace(/{@AWBNo@:@/g, "A");
    }


    if (AgentStockArr.length > 0) {
        $.ajax({
            type: "POST",
            url: "./Services/Stock/StockAWBService.svc/IssueStocktoAgent?AWBPrefix=" + AWBPrefix + "&AccountSNo=" + AccountSNo + "&OfficeSNo=" + OfficeSNo + "&Remark=" + Remark + "&NoOfAWB=" + NoOfAWB + "&AutoRetrievalDate=" + AutoRetrievalDate,
            data: JSON.stringify({ strData: btoa(strData) }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                $("#lstIssue-To-Agent").html('');
                $("#lblIssue-To-Agent").html(0);

                if (response[0].leftStock.length > 0) {
                    for (var i = 0; i < (response[0].leftStock.length) ; i++) {
                        CreatedAWB = CreatedAWB + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].leftStock[i].AWBNo + '</option>');
                    }
                    //ShowMessage('info', 'Need your Kind Attention!', "Stock Successfully Issue to Agent."); // commented by purushottam kumar 
                    ShowMessage('success', 'Success!', "Stock Successfully Issued to Forwarder (Agent).");

                    $("#lstIssueStockAgent").html(CreatedAWB);
                    $("#lblIssueStockAgent").html(response[0].leftStock.length)

                    $('#btnIssuetoStockAgent').hide();
                    //setTimeout(function () {
                    //    navigateUrl('Default.cshtml?Module=Stock&Apps=StockAWB&FormAction=INDEXVIEW');

                    //}, 1000);
                }
                if (response[0].leftAWBStock.length > 0) {
                    for (var i = 0; i < (response[0].leftAWBStock.length) ; i++) {
                        LeftCreatedStock = LeftCreatedStock + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].leftAWBStock[i].AWBNo + '</option>');
                    }
                    $("#lstlstIssue-To-Agent").html(LeftCreatedStock);
                    $("#lbllstIssue-To-Agent").html(response[0].leftAWBStock.length)
                    IssuedOfficeStockLength = response[0].leftAWBStock.length;
                    $("#IssueAgentAWB").val(response[0].leftAWBStock.length);
                    $("#_tempIssueAgentAWB").val(response[0].leftAWBStock.length);

                }
                //if (response[0].alradyCreatedStock.length > 0) {
                //    for (var i = 0; i < (response[0].alradyCreatedStock.length) ; i++) {
                //        alradyCreatedStock = alradyCreatedStock + ('<option>' + $("#AWBPrefix").val() + '-' + response[0].alradyCreatedStock[i].AWBNo + '</option>');
                //    }
                //    $("#lstAgentExistStock").html(alradyCreatedStock);
                //    $("#lblAgentExistStock").html(response[0].alradyCreatedStock.length);
                //}

            }
        });
    }
    else {
        ShowMessage('info', '', "Select AWB Stock for Forwarder (Agent) before Issuance.");
        //alert("Please Issue stock to Office first !!");
        //return false;
    }

}

function MaxNoOfAWB(e) {
    //var Data = e.value;

    //if (Data > 1000) {
    //    alert("Enter Max 1000 only");
    //    $("#NOOFAWB").val('');
    //}
    var Data = e.value;
    var StartRange = $("#AWBNumber").val()
    if (StartRange == "") {
        //alert("Please Enter Start Range");
        ShowMessage('info', '', "Start Range can not be blank");
        $("#NOOFAWB").val('');
        $("#EndRange").val('');
        $("#_tempEndRange").val('');
    }
    StartRange = StartRange - 1;
    if (Data == 0) {
        $("#NOOFAWB").val('');
        $("#EndRange").val('');
        $("#_tempEndRange").val('');

    }
    if (Data > 1000000) {
        //alert("Enter Max 1000 only");
        ShowMessage('info', '', "Enter Max 1000000 only.");
        $("#NOOFAWB").val('');
    }
    if (Data > 0 && Data <= 1000000 && $("#AWBNumber").val() > 0) {

        var EndRange = parseInt(StartRange) + parseInt(Data);
        $("#EndRange").val("");
        $("#EndRange").val(pad(EndRange, "7"));
        $("#_tempEndRange").val(pad(EndRange, "7"));
        $("#NOOFAWB").val(pad(Data, "7"));
        $("#_tempNOOFAWB").val(pad(Data, "7"));
    }
}

var TotalCreatedStockAWB = "";
function GetMaxIssueAWB(e) {

    var CheckZero = e.value;
    if (CheckZero == '0' || CheckZero == '') {
        $('#IssueOfficeAWB').val('');
        $('#IssueAgentStockAWB').val('');
        ShowMessage('info', '', "No. of AWB Not be Blank or Zero !!");
        return false;
    }

    var TotalCreatedStock = TotalCreatedStockAWB;

    if ($('#lstIssuedOfficeStock option').length > 0) {
        TotalCreatedStock = $('#lstIssuedOfficeStock option').length;
    }
    var TotalIssueStock = e.value;
    if (TotalIssueStock > TotalCreatedStock) {
        //alert("No. of AWB should be less than or equal to total Available Stock !!");
        ShowMessage('info', '', "No. of AWB should be less than or equal to total Available Stock !!");
        $("#IssueAWB").val('');
        $("#_tempIssueAWB").val('');
        $("#IssueOfficeAWB").val('');
        $("#btnIssueStocktoAgent").val()
    }
}
var TotalIssuedOfficeStockAWB = "";
function GetMaxIssuetoAgentAWB(e) {
    var TotalCreatedStock = IssuedOfficeStockLength;
    var TotalIssueStock = e.value;
    if (TotalIssueStock > TotalCreatedStock) {
        // alert("No. of AWB should be less than or equal to total Available Office Stock !!");
        ShowMessage('info', '', "No. of AWB should be less than or equal to total Available Office Stock !!");
        $("#_tempIssueAgentAWB").val('');
        $("#IssueAgentAWB").val('');
    }

}

var IssueStockToAgentArr = [];

function GetReIssue(StockSNo) {
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/StockAWBService.svc/GetReIssue?StockSNo=" + StockSNo,
        data: JSON.stringify({ StockSNo: StockSNo }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.length > 0) {
                for (var i = 0; i < (response.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + response[i].AWBPrefix + '-' + response[i].AWBNo + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                    LeftStockArr.push(CreatearrayAWBNo);
                }
                $("#Text_AWBPrefix").val(response[0].AWBPrefix);
                $("#lstOfficeCreatedstock").html(CreatedAWB);
                $("#lblOfficeCreatedStock").html(response.length)

                OpenSecondTab();
                $("#IssueStock").hide(); $("#tbl").hide(); $("#btnGenerate").hide(); $("#btnReset").hide(); $("#IssueStock").show(); $("#OfficeStockCreated").show();//$("#AgentIssueStock").hide(); $("#AgentStockCreated").hide();


                //-----------------------Autocomplete to V2
                cfi.AutoCompleteV2("City", "CityCode", "CreateStock_CityStock", null, "contains");
                cfi.AutoCompleteV2("Office", "Name", "CreateStock_OfficeStock", null, "contains");
            }
            else {
                $(".WebFormTable").hide();
                ShowMessage('info', '', "Create stock first for this GSA");//alert("Please create stock first for this GSA");
                var loc = [];
                var pathname = (window.location.href);
                loc = pathname.split('?')
                window.location.href = loc[0] + "?Module=Stock&Apps=StockAWB&FormAction=INDEXVIEW";
                ShowMessage('info', '', "Create stock first for this GSA");
            }
        }
    });


}

function GetIssuedOfficeStock(StockSNo) {
    var CreatedAWB = "";
    var alradyCreatedStock = "";

    $.ajax({
        type: "POST",
        url: "./Services/Stock/StockAWBService.svc/GetIssuedOfficeStock?StockSNo=" + StockSNo,
        data: JSON.stringify({ StockSNo: StockSNo }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.length > 0) {
                for (var i = 0; i < (response.length) ; i++) {
                    CreatedAWB = CreatedAWB + ('<option>' + response[i].AWBPrefix + '-' + response[i].AWBNo + '</option>');
                    var CreatearrayAWBNo = {};
                    CreatearrayAWBNo.AWBNo = (response[i].AWBNo);
                    IssueStockToAgentArr.push(CreatearrayAWBNo);
                }
                $("#Text_AWBPrefix").val(response[0].AWBPrefix);
                $("#lstIssuedOfficeStock").html(CreatedAWB);
                $("#lblIssuedOfficeStock").html(response.length);

                $("#GSACity").val(response[0].CitySNo); $("#Text_GSACity").val(response[0].Text_City);
                $("#GSAOffice").val(response[0].OfficeSNo); $("#Text_GSAOffice").val(response[0].Text_Office);

                $("#Text_GSACity").attr("disabled", "disabled");
                $("#Text_GSAOffice").attr("disabled", "disabled");
                $("#divGetIssuedOfficeStock").find("span[class='k-icon k-i-arrow-s']").html('');
                $("#divGetIssuedOfficeStock").find("span[class='k-icon k-i-arrow-s']").removeClass();

                OpenThiredTab();
                $("#IssueStock").hide(); $("#IssueStock").show(); $("#OfficeStockCreated").show(); $("#AgentIssueStock").show(); $("#AgentStockCreated").show();


                //--------------------Autocomplete convert to V2
                cfi.AutoCompleteV2("GSACity", "CityCode", "CreateStock_GSACityCode", Clear, "contains");
                cfi.AutoCompleteV2("GSAOffice", "Name", "CreateStock_GSAOfficeCode", Clear, "contains");
                cfi.AutoCompleteV2("Account", "AccountCode,Name", "Stock_Account", null, "contains");

                $("#IssueStock").hide(); $("#tbl").hide(); $("#btnGenerate").hide(); $("#btnReset").hide(); $("#IssueStock").hide(); $("#OfficeStockCreated").hide();
                $("#OfficeStockCreated").hide(); $("#divGetIssuedOfficeStock").hide(); //$("#btnGetIssueStock").hide(); $("#btnResetIssueStock").hide();

            }
            else {
                $(".WebFormTable").hide();
                ShowMessage('info', '', "Issue stock first for this Forwarder (Agent)");//alert("Please issue stock first for this Agent");
                var loc = [];
                var pathname = (window.location.href);
                loc = pathname.split('?')
                window.location.href = loc[0] + "?Module=Stock&Apps=StockAWB&FormAction=INDEXVIEW";

                //ShowMessage('info', 'Need your Kind Attention!', "Please issue stock first for this Agent");
                //return false;
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
    //$("input[type='radio'][id='IsAutoAWB']").removeAttr("disabled")

    $("#lstCreatedstock").html('');
    $("#lblTotalGeneratedAWBNo").html(0);
    $("#lstExistStock").html('');
    $("#lblExistStock").html(0);
    $("#btnCreateStock").hide();

    $("#NOOFAWB").removeAttr("disabled")
    $("#Text_AWBPrefix").removeAttr("disabled")
    $("#Text_IsAutoAWB").removeAttr("disabled")
    $("#Text_IsAutoAWB").val('');
    //Text_AWBType
    $("#AWBNumber").removeAttr("disabled");
    $("#EndRange").removeAttr("disabled");
    $("#EndRange").val('');
    $("#_tempEndRange").val('');
    //$("#ExpiryDate").removeAttr("disabled");
    //$("#Date").removeAttr("disabled");
    $("#NOOFAWB").val(''); $("#_tempNOOFAWB").val('');
    $("#Text_AWBPrefix").val('');
    $("#AWBNumber").val(''); $("#_tempAWBNumber").val('');
    $("#StockCreated").hide();
    $("#Text_AWBType").removeAttr("disabled");
    $("#Text_AWBType").val('');
    if (userContext.SysSetting.IsDisableDatesOnStock.toUpperCase()!= "TRUE") {
        $("#Date").data("kendoDatePicker").enable(true);
        $("#ExpiryDate").data("kendoDatePicker").enable(true);
        $("#Date").val('');
        $("#ExpiryDate").val('');
    }
}
function ResetIssueStock() {

    $("#btnResetIssueStock").hide();
    $("#btnGetIssueStock").show();
    $("#lstIssueStockAgent").html('');
    $("#lblIssueStockAgent").html(0);
    $("#lstAgentExistStock").html('');
    $("#lblAgentExistStock").html(0);
    $("#lstIssuedOfficeStock").html('');
    $("#lblIssuedOfficeStock").html(0);
    $("#_tempIssueAgentAWB").val('');
    $("#IssueAgentAWB").val('');
    $("#AgentStockCreated").hide();
    $("#AgentIssueStock").hide();
    $("#lstIssue-To-Agent").html('');
    $("#lblIssue-To-Agent").html(0);
}

function ExportToExcel_CreateStock() {
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

    var AirlineName = $('#Text_AWBPrefix').val();
    AirlineName = (AirlineName.indexOf('-') == 0) ? AirlineName.substring(1) : AirlineName
    var str = "";
    str = "<html><table border=\"1px\">";
    str += "<tr ><td><strong>AWB Number</strong></td><td><strong>Airline Name</strong></td></tr>"
    var Totalitems = $("#lstTotalCreatedStock").find('option').length;
    $("#lstTotalCreatedStock option").each(function (i) {

        var AWBNO = $("#lstTotalCreatedStock ").find('option').eq(i).text()
        str += "<tr><td>" + AWBNO + "</td><td>" + AirlineName + "</td></tr>"

    });

    str += "</table></html>";
    var filename = 'Stock Creation_' + today
    exportToExcelNew(str, filename)

};

