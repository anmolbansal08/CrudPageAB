$(document).ready(function () {
    cfi.ValidateForm();
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");

    $("input[id^=ExpiryDate]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
    {
        debugger;
        cfi.AutoCompleteByDataSource("IsAutoAWB", AWBStockType, SetAWB);
        cfi.AutoCompleteByDataSource("AWBType", AWBType, SetAWB);
        cfi.AutoComplete("AWBPrefix", "AirlineCode", "Airline", "AirlineCode", "AirlineCode", ["AirlineCode"], null, "contains", null, null, null, null, AWBNumber);
        cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "AirlineCode", "AirlineName", ["AirlineName", "AirlineCode"], null, "contains", null, null, null, null, AWBNumber);
        //$("#AWBNumber").removeAttr("disabled");
    }
})
function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
    else
    {
        $(containerId).find("input[controltype='datetype']").each(function ()
        {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}

var AWBStockType = [{ Key: "1", Text: "Electonic Air Waybill" }, { Key: "0", Text: "Manual Air Waybill" }];
var AWBType = [{ Key: "7", Text: "International Stock" }, { Key: "8", Text: "Domestic Stock" }, { Key: "9", Text: "Service Stock" }, { Key: "10", Text: "Express Shipment Stock" }];



function SetAWB(e)
{
    //if (e.value == "0")
    //{ $("#AWBNumber").attr("disabled", "disabled"); }
    //else { $("#AWBNumber").removeAttr("disabled"); }
    AWBNumber();
}

function AWBNumber(e) {

    $("#btnCreateStock").show();
    var Data = "";
    var intRegex = /^\d+$/;
    var AWBType = $("#AWBType").val();
    var AutoAWB = $("#IsAutoAWB").val();
    //var CountryCode = $("#Text_CountryCode").val();
    var ExpiryDate = "26-Oct-2015";
    if (e == undefined)
        var AWBPrefix = $("#AirlineSNo").val();
    else
        var AWBPrefix = (this.dataItem(e.item.index())).Key;

    if (e == undefined) { Data = $("#Text_AirlineSNo").val() == "" ? "0" : $("#Text_AirlineSNo").val(); }
    else Data = (this.dataItem(e.item.index())).Text;

    //var checkdata = (this.dataItem(e.item.index())).Text;
    if (intRegex.test(Data)) { AWBPrefix = Data; } else { CountryCode = Data; }

    if (AWBPrefix != "0" && AWBPrefix != "") {
        $.ajax({
            type: "POST",
            url: "./Services/Stock/AWBStockService.svc/GetMaxAWBNumber?AWBPrefix=" + AWBPrefix + "&AWBType=" + AWBType + "&IsAutoAWB=" + AutoAWB + "&CountryCode=" + "0" + "&ExpiryDate=" + ExpiryDate,
            data: { id: 1 },
            dataType: "json",
            success: function (response) {
                var SNo = response.Data[0];
                $("#StartRange").val(SNo);
                $("#_tempStartRange").val(SNo);
                $("#_tempAWBNumber").val(SNo);
                $("#EndRange").val("");
                $("#_tempEndRange").val("");
                $("#NOOFAWB").val("");
                $("#_tempNOOFAWB").val("");

            }
        });
    }
}

function CheckAWB(e) {
    var intRegex = /^\d+$/;
    var Data = $("#AWBNumber").val();
    var a = parseInt(Data);
    if (Data != "") {
        if (!intRegex.test(Data)) { alert("AWB No. Must be Numeric"); $("#AWBNumber").val(''); }
        else if (Data.length < 7) { alert("AWB No. Lenght Must be Seven Character"); $("#AWBNumber").val(''); }
        else if (a == 0) { alert("AWB No. can not be Zero"); $("#AWBNumber").val(''); }

    }
}


function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

//function CreateStock() {
//    var CreatedAWB = "";
//    var alradyCreatedStock = "";
//    var AWBPrefix = $("#AirlineSNo").val();//$("#Text_AWBPrefix").val();
//    var AWBType = $("#AWBType").val();//$("#AWBType:checked").val();
//    var IsAutoAWB = $("#IsAutoAWB").val();//$("#IsAutoAWB:checked").val();
//    var CountryCode = 0; // = $("#CountryCode").val();
//    var ExpiryDate = "26-Oct-2015";
//    var NoOfAWB = $("#NOOFAWB").val();
//    var skj = $("#_tempNOOFAWB").val();
//    var StartRange = $("#StartRange").val();
//    var EndRange = $("#EndRange").val();
//    //var strData1 = JSON.stringify(CreateStockArr);
//    //var strData2 = strData1.replace(/"/g, "@");
//    //var strData = strData2.replace(/{@AWBNo@:@/g, "A");
//    if (!cfi.IsValidForm()) {
//        return false;
//    }
//    if (NoOfAWB == 0 || EndRange == 0) {
//        //alert("No Of AWB Or End Range can not be blank");
//        ShowMessage('info', 'Need your Kind Attention!', "No Of AWB Or End Range can not be blank.");
//    }
//    $.ajax({
//        type: "POST",
//        url: "./Services/Stock/AWBStockService.svc/CreateStock?NoOfAWB=" + NoOfAWB + "&StartRange=" + StartRange + "&AWBPrefix=" + AWBPrefix + "&AWBType=" + AWBType + "&IsAutoAWB=" + IsAutoAWB,
//        data: { id: 1 },
//        dataType: "json",
//        contentType: "application/json; charset=utf-8",
//        success: function (response) {
//            if ($(response)[0].indexOf("AWB Stock already exists") != -1) {
//                ShowMessage('info', 'Need your Kind Attention!', "AWB Stock already exists.");

//            }
//            else {
                
//                navigateUrl('Default.cshtml?Module=Stock&Apps=AWBStock&FormAction=INDEXVIEW');
//                ShowMessage('info', 'Need your Kind Attention!', "AWB Stock Created Successfully");
//            }

//        }
//    });
//}

function MaxNoOfAWB(e) {
    var Data = e.value;
    var StartRange = $("#StartRange").val()
    if (StartRange == "") {
        //alert("Please Enter Start Range");
        ShowMessage('info', 'Need your Kind Attention!', "Please Enter Start Range.");
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
    if (Data > 1000) {
        //alert("Enter Max 1000 only");
        ShowMessage('info', 'Need your Kind Attention!', "Please Enter Max 1000 only.");
        $("#NOOFAWB").val('');
    }
    if (Data > 0 && Data < 1000 && $("#StartRange").val() > 0) {

        var EndRange = parseInt(StartRange) + parseInt(Data);
        $("#EndRange").val("");
        $("#EndRange").val(pad(EndRange, "7"));
        $("#_tempEndRange").val(pad(EndRange, "7"));
        $("#NOOFAWB").val(pad(Data, "7"));
        $("#_tempNOOFAWB").val(pad(Data, "7"));
    }
}
function StartRangeClear(e) {
    var Data = e.value;
    if (Data != "") {
        $("#EndRange").val("");
        $("#_tempEndRange").val("");
        $("#NOOFAWB").val("");
        $("#_tempNOOFAWB").val("");
        $("#StartRange").val(pad(Data, "7"));
        $("#_tempStartRange").val(pad(Data, "7"));
    }
}
function EndRangeCount(e) {
    var Data = e.value;

    var StartRange = $("#StartRange").val()
    if (StartRange == "") {
        //alert("Please Enter Start Range");
        ShowMessage('info', 'Need your Kind Attention!', "Please Enter Start Range.");
        $("#EndRange").val("");
    }
    StartRange = StartRange - 1;
    var Difference = parseInt(Data) - parseInt(StartRange);
    if (Difference > 1000) {
        alert("Enter Max 1000 only");
        $("#EndRange").val('');
    }
    else if (Difference < 0) {
        // alert("End Range Should be greater than Start Range");
        ShowMessage('info', 'Need your Kind Attention!', "End Range Should be greater than Start Range.");
        $("#EndRange").val('');
    }
    else if (Data == 0) {
        $("#EndRange").val('');
    }
    else if (Data > 0 && $("#StartRange").val() > 0) {
        var Count = parseInt(Data) - parseInt(StartRange);
        $("#NOOFAWB").val(Count);
        $("#_tempNOOFAWB").val(Count);
        $("#_tempEndRange").val('');
        $("#EndRange").val(pad(Data, "7"));
        $("#_tempEndRange").val(pad(Data, "7"));
    }
}

function ResetStock() {
    $("#NOOFAWB").val(''); $("#_tempNOOFAWB").val('');
    $("#StartRange").val(''); $("#_tempStartRange").val('');
    $("#EndRange").val(''); $("#_tempEndRange").val('');
    $("#Text_AWBType").val('');
    $("#AWBType").val('');
    $("#Text_IsAutoAWB").val('');
    $("#IsAutoAWB").val('');
    $("#Text_AirlineSNo").val('');
    $("#AirlineSNo").val('');
    $("#AWBNumber").val(''); $("#_tempAWBNumber").val('');
}