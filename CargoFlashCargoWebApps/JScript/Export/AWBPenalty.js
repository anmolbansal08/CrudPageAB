$(document).ready(function () {
    var str = '';
    // Changes by Vipin Kumar
    //cfi.AutoComplete("ReferenceNumber", "ReferenceNumber", "vwReferenceNumber", "ReferenceNumber", "ReferenceNumber", null, null, "contains");
    cfi.AutoCompleteV2("ReferenceNumber", "ReferenceNumber", "AWB_Penalty_ReferenceNumber", null, "contains");

    //cfi.AutoComplete("PenaltyType", "PenaltyType", "vwPenaltytype", "Sno", "PenaltyType", null, null,"contains" );  
    cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeProc", null, "contains");
  //  cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyType1", null, "contains");
    //cfi.AutoComplete("AWBNo", "AWBNo", "vwAWBNo", "AWBNo", "AWBNo", null, null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "AWB_Penalty_AWBNo", null, "contains");
    //cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWB", "AWBNo", "AWBNo", null, null, "contains");
    cfi.AutoCompleteV2("AWBNo1", "AWBNo", "AWB_Penalty_AWBNo1_Proc", null, "contains");
    // Ends
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");
    //var uid = $("#uid").val();
    $('.DateWiseRow').hide();
    $('.AWBNoRow').hide();
    $('.AWBNoR').hide();
    $('.trRadio').hide();
    $('#btnSearch').hide();
    $('#Penalty').css('display', 'none');
    $('.trpSubmit').hide();
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);

    ///////////////////////////
    // this is for admin and agent

    //$('#Text_ReferenceNumber_input').click(function ()

    //{

    // //   alert('Rman');
    //    $("#BlackListTbl").remove();
    //    $("#BlackListTbl").html('');
    //    $('#AWBNo, #Text_AWBNo_input').val('');

    //});


    //$('#Text_AWBNo_input').click(function () {
    //    $("#BlackListTbl").remove();
    //    $("#BlackListTbl").html('');
    //    $('#ReferenceNumber,#Text_ReferenceNumber_input').val('');

    //});


    //var todaydate = new Date();
    //var validfromdate = $("#FromDate").data("kendoDatePicker");
    //validfromdate.min(todaydate);
    //var validTodate = $("#ToDate").data("kendoDatePicker");
    //validTodate.min(todaydate);


    //$("input[id^=ToDate]").change(function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    var validFrom = $(this).attr("id").replace("To", "From");
    //    k = $("#" + FromDate).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));
    //    if (dfrom > dto) {
    //        ShowMessage('warning', 'Warning -Penalty Parameters!', "Valid To Date Should greater or equal To Valid To date");
    //        $(this).val("");
    //    }

    //});

    //$("input[id^=FromDate]").change(function (e) {
    //    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dfrom = new Date(Date.parse(k));
    //    var validFrom = $(this).attr("id").replace("From", "To");
    //    k = $("#" + FromDate).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    //    var dto = new Date(Date.parse(k));
    //    if (dfrom > dto) {
    //        ShowMessage('warning', 'Warning -Penalty Parameters!', "Valid From Date Shouls be lesser or Equal To Valid To date");
    //        $(this).val("");
    //    }


    //});



   // val(userContext.AirlineCarrierCode);

    //$('label[for=AirlinePrefix]').html(userContext.AirlineCarrierCode);
    //$('#tbl td:eq(19)').html(userContext.AirlineCarrierCode);
   
    PageRightsCheckInboundFlight()
    //var Airline = userContext.AirlineCarrierCode.split('-')
    //$('td:contains("Airline Prefix")').next('td').append(Airline[1]);
    var Airline = userContext.AirlineCarrierCode
    $('td:contains("Airline Prefix")').next('td').append(Airline);
    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        $("table tr:eq(10)").find('td:eq(0)').text('')
        $("table tr:eq(10)").find('td:eq(1)').text('')
    }
    var AccountSno = 0;
 if (userContext.GroupName == 'AGENT') {
        
        $("#NoShow").hide();
        $('label[for*=NoShow]').hide();
        $("#Void").hide();
        $('label[for*=Void]').hide();


        $("#Cancelation").show();
    // Changes By Vipin Kumar
    //cfi.AutoComplete("PenaltyType", "PenaltyType", "vwPenaltytypeForAgent", "Sno", "PenaltyType", null, Checkpp);
     //  cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_AGENTPenaltyType", Checkpp);
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeProc", null, "contains");
    // Ends
        AccountSno = userContext.AgentSNo;
    }
 else if (userContext.GroupName == 'ADMIN') {
        $("#NoShow").show();
        $("#Void").show();
        $("#Cancelation").show();
        // Changes By Vipin Kumar
        //cfi.AutoComplete("PenaltyType", "PenaltyType", "vwPenaltytype", "Sno", "PenaltyType", null, null, "contains");
     //    cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyType1", null, "contains");
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeProc", null, "contains");
        //Ends
        AccountSno = 0;

    }
   
    else if (userContext.GroupName == 'AIRLINE') {
        $("#NoShow").show();
        $("#Void").show();
        $("#Cancelation").show();
        // Changes By Vipin Kumar
        //cfi.AutoComplete("PenaltyType", "PenaltyType", "vwPenaltytype", "Sno", "PenaltyType", null, null, "contains");
        // cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyType1", null, "contains");
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeProc", null, "contains");
        // Ends
        AccountSno = 0;
    }

    else {
        $("#NoShow").show();
        $("#Void").show();
        $("#Cancelation").show();
        // Changes By Vipin Kumar
        //cfi.AutoComplete("PenaltyType", "PenaltyType", "vwPenaltytype", "Sno", "PenaltyType", null, null, "contains");
        //  cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyType1", null, "contains");
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeProc", null, "contains");
        // Ends
        AccountSno = 0;
    }



    ////////////////////////////////////////



    $('input[type=radio][name=PenaltyType]').click(function () {
        $('#DateWise').removeAttr('checked', true);
        $('#AWbNoCheck').removeAttr('checked', true);

        $('.DateWiseRow').hide();
        $('.AWBNoRow').hide();
        $('.AWBNoR').hide();
        $('#btnSearch').hide();
        $('.trpSubmit').hide();
        $("#BlackListTbl").remove();
        var PenaltyType = $('#PenaltyType').val(); //$("input[name='PenaltyType']:checked").val();
        if (PenaltyType == '1') {
            $('label[for=AWbNoCheck]').html('AWB No.');
        }

        if ((PenaltyType == '0') || (PenaltyType == '11')) {
            $('label[for=AWbNoCheck]').html('AWB No.');
        }
        if (PenaltyType == '3') {
            $('label[for=AWbNoCheck]').html('AWB/Ref No.');
        }
        if (PenaltyType == '5') {
            $('label[for=AWbNoCheck]').html('AWB No.');
        }
        $('.trRadio').show();
    });

    /////////////////////////////

  
    $('input[type=radio][name=Filter]').change(function () {
        if (this.value == 'A') {
            //  var PenaltyType = $("input[name='PenaltyType']:checked").val();//commented date 07 july 2017

            var PenaltyType = $('#PenaltyType').val();

            if (userContext.SysSetting.ICMSEnvironment == "JT")
            {
                $("#ReferenceNumber").closest('tr').find('td:eq(0)').hide();
                $("#ReferenceNumber").closest('tr').find('td:eq(1)').hide();
            }
            else
            {
                $("#ReferenceNumber").closest('tr').find('td:eq(0)').show();
                $("#ReferenceNumber").closest('tr').find('td:eq(1)').show();
            }
            // var PenaltyType22 = $('#Text_PenaltyType').val();
            if ((PenaltyType == '0') || (PenaltyType == '11')) {
                //$('.DateWiseRow').hide();
                //$('.AWBNoRow').show();
                //$('.AWBNoR').hide();
                //$('#btnSearch').show();
                //$("#BlackListTbl").remove();

                //$('#Text_ReferenceNumber_input').val('')

                //$('#Text_ReferenceNumber').val('');

                //$('#Text_AWBNo_input').val('')

                //$('#Text_AWBNo').val('');

                //$('#Text_AWBNo1_input').val('')

                //$('#Text_AWBNo1').val('');

                $('.DateWiseRow').hide();
                $('.AWBNoR').show();
                $('.AWBNoRow').hide();
                $('#btnSearch').show();
                $("#BlackListTbl").remove();

                $('#Text_ReferenceNumber_input').val('')

                $('#Text_ReferenceNumber').val('');
                $('#Text_AWBNo_input').val('');

                $('#Text_AWBNo').val('');

                // Changes By Vipin Kumar
                //cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWBForNoShow", "AWBNo", "AWBNo", null, null, "contains");
                cfi.AutoCompleteV2("AWBNo1", "AWBNo", "AWB_Penalty_AWBNo1_Proc", null, "contains");
                // Ends
            }

            if (PenaltyType == '1') {
                $('.DateWiseRow').hide();
                $('.AWBNoR').show();
                $('.AWBNoRow').hide();
                $('#btnSearch').show();
                $("#BlackListTbl").remove();

                $('#Text_ReferenceNumber_input').val('')

                $('#Text_ReferenceNumber').val('');
                $('#Text_AWBNo_input').val('');

                $('#Text_AWBNo').val('');
                // Changes By Vipin Kumar
                //cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWBForVoid", "AWBNo", "AWBNo", null, null, "contains");
                cfi.AutoCompleteV2("AWBNo1", "AWBNo", "AWB_Penalty_AWBNo1_Proc", null, "contains");
                // Ends

            }

            if (PenaltyType == '3') {
                $('.DateWiseRow').hide();
                $('.AWBNoRow').show();
                $('.AWBNoR').hide();
                $('#btnSearch').show();
                $("#BlackListTbl").remove();

                $('#Text_ReferenceNumber_input').val('')

                $('#Text_ReferenceNumber').val('');
                $('#Text_AWBNo_input').val('')

                $('#Text_AWBNo').val('');
                $('#Text_AWBNo_input').val('');

                $('#Text_AWBNo').val('');
            }

            if (PenaltyType == '5') {


                $('.DateWiseRow').hide();
                $('.AWBNoR').show();
                $('.AWBNoRow').hide();
                $('#btnSearch').show();
                $("#BlackListTbl").remove();

                $('#Text_ReferenceNumber_input').val('')

                $('#Text_ReferenceNumber').val('');
                $('#Text_AWBNo_input').val('');

                $('#Text_AWBNo').val('');

                // Changes By Vipin Kumar
                //cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWBForEXECVsRCS", "AWBNo", "AWBNo", null, null, "contains");
                cfi.AutoCompleteV2("AWBNo1", "AWBNo", "AWB_Penalty_AWBNo1_Proc", null, "contains");
                // Ends

            }

            if (PenaltyType == '4') {


                $('.DateWiseRow').hide();
                $('.AWBNoR').show();
                $('.AWBNoRow').hide();
                $('#btnSearch').show();
                $("#BlackListTbl").remove();

                $('#Text_ReferenceNumber_input').val('')

                $('#Text_ReferenceNumber').val('');
                $('#Text_AWBNo_input').val('');

                $('#Text_AWBNo').val('');

                // Changes By Vipin Kumar
                //cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWBForBKDVsEXEC", "AWBNo", "AWBNo", null, null, "contains");
                cfi.AutoCompleteV2("AWBNo1", "AWBNo", "AWB_Penalty_AWBNo1_Proc", null, "contains");
                // Ends

            }


        }
        else if (this.value == 'D') {
            $('.DateWiseRow').show();
            $('.AWBNoRow').hide();
            $('#btnSearch').show();
            $('.AWBNoR').hide();

            $('#Text_ReferenceNumber_input').val('')
            $("#BlackListTbl").remove();

            $('#Text_ReferenceNumber').val('');
            $('#Text_AWBNo_input').val('')

            $('#Text_AWBNo').val('');
            $('#Text_AWBNo_input').val('');

            $('#Text_AWBNo').val('');
        }
        else {
            //$('.DateWiseRow').hide();
            //$('.AWBNoRow').show();
        }
    });


});


/////////////////////////////////////

function Checkpp(e) {


    $(".trRadio").show();


}
function Showid() {
    alert('sdsd');
}
//if (userContext.GroupName == 'ADMIN') {
//    $("#Text_Account").prop("disabled", false);
//    $("#Text_Account").val();
//    $("#Origin").val();
//    $("#Text_Origin_input").val();
//    $("#Text_Origin_input").prop("disabled", false);

//    $("#Airline").val();
//    $("#Text_Airline").val();
//    $("#Text_Airline").prop("disabled", true);
//}
//else if (userContext.GroupName == 'AGENT') {
//    debugger;
//    $("#Account").val(userContext.AgentSNo);
//    $("#Text_Account").val(userContext.AgentName);
//    $("#Text_Account").prop("disabled", true);

//    $("#Origin").val(userContext.CitySNo);
//    $("#Text_Origin").val(userContext.CityCode + '-' + userContext.CityName);
//    $("#Text_Origin").prop("disabled", true);

//    $("#Airline").val(userContext.AirlineSNo);
//    $("#Text_Airline").val(userContext.AirlineName);
//    $("#Text_Airline").prop("disabled", true);



//}

////////////////////////

function ExtraParameters(id) {
    var param = [];
    if (id == "Text_ReferenceNumber") {
        var UserSNo = userContext.UserSNo;
        var AirlineSNo = userContext.AirlineSNo;
        param.push({ ParameterName: "AirlineSNo", ParameterValue: AirlineSNo }),
       param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });

        return param;
    }
    if (id == "Text_AWBNo") {
        var UserSNo = userContext.UserSNo;
        var AirlineSNo = userContext.AirlineSNo;
        param.push({ ParameterName: "AirlineSNo", ParameterValue: AirlineSNo }),
       param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });

        return param;
    }
    if (id == "Text_PenaltyType") {
        var UserSNo = userContext.UserSNo;
        var AirlineSNo = userContext.AirlineSNo;
        param.push({ ParameterName: "AirlineSNo", ParameterValue: AirlineSNo }),
       param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });

        return param;
    }
    if (id == "Text_AWBNo1") {
        var UserSNo = userContext.UserSNo;
        var AirlineSNo = userContext.AirlineSNo;
        param.push({ ParameterName: "PenaltyType", ParameterValue: $('#PenaltyType').val() }),
       param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });

        return param;
    }
}
function ExtraCondition(textId) {
    // var filterEmbargo = cfi.getFilter("AND");
    
    var filterForwarderCode = cfi.getFilter("AND");
    var filterForwarderName = cfi.getFilter("AND");

    if (textId == "Text_ReferenceNumber") {
        if (userContext.GroupName == "AGENT") {
            cfi.setFilter(filterForwarderCode, "AccountSNo", "eq", userContext.AgentSNo);
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);

            //    cfi.AutoComplete("AWBNo", "AWBNo", "vwAWBNo", "AWBNo", "AWBNo", null, null, "contains");
            $("#Text_AWBNo_input").val('');
            $("#Text_AWBNo").val('');
            $('#AWBNo').val('');
            //$("#BlackListTbl").remove();
            //$("#BlackListTbl").html('');
            return ForwarderFilter;
        }
        else {
            cfi.setFilter(filterForwarderCode, "OriginCitySno", "eq", userContext.CitySNo);
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);

            //    cfi.AutoComplete("AWBNo", "AWBNo", "vwAWBNo", "AWBNo", "AWBNo", null, null, "contains");
            $("#Text_AWBNo_input").val('');
            $("#Text_AWBNo").val('');
            $('#AWBNo').val('');
            //$("#BlackListTbl").remove();
            //$("#BlackListTbl").html('');
            return ForwarderFilter;

        }

        //if (userContext.GroupName == "AIRLINE") {
        //    cfi.setFilter(filterForwarderCode, "SNo", "eq", userContext.AirlineSNo);
        //    var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);


        //    $("#Text_AWBNo_input").val('');
        //    $("#Text_AWBNo").val('');
        //    $('#AWBNo').val('');

        //    return ForwarderFilter;
        //}

    }
    if (textId == "Text_AWBNo") {
        if (userContext.GroupName == "AGENT") {
            cfi.setFilter(filterForwarderCode, "AccountSNo", "eq", userContext.AgentSNo);
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            $("#Text_ReferenceNumber_input").val('');
            //  cfi.AutoComplete("ReferenceNumber", "ReferenceNumber", "vwReferenceNumber", "ReferenceNumber", "ReferenceNumber", null, null, "contains");
            $("#Text_ReferenceNumber_input").val('');
            $("#Text_ReferenceNumber").val('');
            //$("#BlackListTbl").remove();
            //$("#BlackListTbl").html('');
            $('#ReferenceNumber').val('');

            return ForwarderFilter;
        }

        else {

            cfi.setFilter(filterForwarderCode, "OriginCitySno", "eq", userContext.CitySNo);
            var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
            $("#Text_ReferenceNumber_input").val('');
            //  cfi.AutoComplete("ReferenceNumber", "ReferenceNumber", "vwReferenceNumber", "ReferenceNumber", "ReferenceNumber", null, null, "contains");
            $("#Text_ReferenceNumber_input").val('');
            $("#Text_ReferenceNumber").val('');
            //$("#BlackListTbl").remove();
            //$("#BlackListTbl").html('');
            $('#ReferenceNumber').val('');

            return ForwarderFilter;
        }

        //if (userContext.GroupName == "AIRLINE") {
        //    cfi.setFilter(filterForwarderCode, "SNo", "eq", userContext.AirlineSNo);
        //    var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
        //    $("#Text_ReferenceNumber_input").val('');
        //    //  cfi.AutoComplete("ReferenceNumber", "ReferenceNumber", "vwReferenceNumber", "ReferenceNumber", "ReferenceNumber", null, null, "contains");
        //    $("#Text_ReferenceNumber_input").val('');
        //    $("#Text_ReferenceNumber").val('');
        //    //$("#BlackListTbl").remove();
        //    //$("#BlackListTbl").html('');
        //    $('#ReferenceNumber').val('');

        //    return ForwarderFilter;
        //}

    }
    if (textId == "Text_PenaltyType") {
        //  $(".trRadio").show();
        ///
        cfi.setFilter(filterForwarderCode, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
     
      var   filterCitySNo = cfi.autoCompleteFilter([filterForwarderCode]);
        return filterCitySNo;
        ///



        $('#DateWise').removeAttr('checked', true);
        $('#AWbNoCheck').removeAttr('checked', true);

        $('.DateWiseRow').hide();
        $('.AWBNoRow').hide();
        $('.AWBNoR').hide();
        $('#btnSearch').hide();
        $('.trpSubmit').hide();
        $("#BlackListTbl").remove();
        var PenaltyType = $('#PenaltyType').val(); //$("input[name='PenaltyType']:checked").val();
        if (PenaltyType == '1') {
            $('label[for=AWbNoCheck]').html('AWB No.');

        }

        if ((PenaltyType == '0') ||(PenaltyType == '0')) {
            $('label[for=AWbNoCheck]').html('AWB No.');

        }
        if (PenaltyType == '3') {
            $('label[for=AWbNoCheck]').html('AWB/Ref No.');
        }
        if (PenaltyType == '5') {
            $('label[for=AWbNoCheck]').html('AWB No.');

        }

        $('.trRadio').show();
    }

    if (textId == "Text_AWBNo1") {
        //  $('label[for=AWbNoCheck]').html('AWB No.');
        cfi.setFilter(filterForwarderCode, "OriginCitySno", "eq", userContext.CitySNo);
        var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
        return ForwarderFilter;
    }




}


/////////////////////////////


















var ReferenceNumber = "";
var WhereCondition = "";


function SearchAWBPenalty() {
    var AccountSno = userContext.AgentSNo;

    var GroupName = userContext.GroupName;

    var environment = userContext.SysSetting.ICMSEnvironment;
    var hidetd = environment == 'JT' ? 'none' : 'display';
    if (GroupName == 'ADMIN') {
        AccountSno = 0;

    }
    else if (GroupName == 'AIRLINE') {
        AccountSno = 0;

    }
    else if (GroupName == 'AGENT') {
        AccountSno = userContext.AgentSNo;

    }
    var uid = $("#uid").val();
    var PenaltyType = $('#PenaltyType').val();// $("input[name='PenaltyType']:checked").val();
    // var sValue = '<%=((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo%>';

    // commented on 7 july 2017
    //if ((PenaltyType != '1') && (PenaltyType != '0') && (PenaltyType != '3'))
    //{

    //    alert("Please Select On of the Penalty");

    //    return false;
    //}
    var Type = $("input[name='Filter']:checked").val();
    ReferenceNumber = $('#Text_ReferenceNumber').val();
    
    var AWBNoA = $('#AWBNo').val();

    var FromDate = $('#FromDate').val();
    var ToDate = $('#ToDate').val();


    var AWBNo = $('#Text_AWBNo1').val();



    if (Type == "A") {
        FromDate = "";
        ToDate = "";

    }
    else {
        $('#Text_ReferenceNumber').val('');
        $('#Text_AWBNo').val('');
    }

    if (Type == "D") {
        $('#Text_AWBNo1').val('');
        $("#Text_AWBNo").val('');
        $('#AWBNo').val('');
        $("#Text_ReferenceNumber").removeAttr('data-valid', 'required');
        $("#Text_ReferenceNumber_input").removeAttr('data-valid', 'required');

        $("#FromDate").attr('data-valid', 'required');
        $("#ToDate").attr('data-valid', 'required');
        ReferenceNumber = "0";
        if (Date.parse(FromDate) > Date.parse(ToDate)) {
            $("#BlackListTbl").remove();
            ShowMessage('warning', 'Warning - AWB Penalty', "From Date can not be greater than To Date !");
            //alert('From Date can not be greater than To Date');
            return;
        }

    }
    else {

        $("#FromDate").removeAttr('data-valid');
        $("#ToDate").removeAttr('data-valid');
        if (userContext.SysSetting.ICMSEnvironment == 'GA') {
            $("#Text_ReferenceNumber").attr('data-valid', 'required');
            $("#Text_ReferenceNumber_input").attr('data-valid', 'required');
        }
        else 
        {
           
            $("#Text_AWBNo").attr('data-valid', 'required');
            $("#Text_AWBNo_input").attr('data-valid', 'required');
          
            $("#Text_ReferenceNumber").removeAttr('data-valid', 'required');
            $("#Text_ReferenceNumber_input").removeAttr('data-valid', 'required');
        }
       
    }

    if ((ReferenceNumber == "") && (AWBNo = "") && AWBNoA != "" && PenaltyType != '1') {
        AWBNo = $('#AWBNo').val();

    }

    if ((PenaltyType != "3") && (Type == "A") && ($('#Text_AWBNo1').val()!="")) 
        {
            AWBNo = $('#Text_AWBNo1').val();
        }
    if ((PenaltyType != "3") && (Type == "A") && ($('#Text_AWBNo1').val() == "")) {
        $("#Text_AWBNo1").attr('data-valid', 'required');
        $("#Text_AWBNo1_input").attr('data-valid', 'required');
           // ShowMessage('warning', 'Warning - AWB Penalty', "AWBNo can not be blank !");
            return;
        }
    

    $("#BlackListTbl").remove();
    if ((ReferenceNumber != "" && AWBNoA != "") || (ReferenceNumber != "" || AWBNoA != "") && (PenaltyType == "3")) {
        $("#BlackListTbl").remove();
        $("#BlackListTbl").html('');
        $('#Text_AWBNo_input').removeAttr('data-valid', "required");
        $('#Text_ReferenceNumber_input').removeAttr('data-valid', "required");

        $.ajax({
            url: 'GetAWBPenalty',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ReferenceNumber: ReferenceNumber, AWBNo: AWBNo, PenaltyType: PenaltyType, BookingFromDate: FromDate, BookingToDate: ToDate, AWBNo: AWBNoA, AccountSno: AccountSno, GroupName: GroupName, WhereCondition: WhereCondition,
            },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                //<th bgcolor='lightblue'>Volume</th>
               
                str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='19' style='height: 30px;'></td></tr><tr><th bgcolor='lightblue'> <input type='checkbox' id='allcb' name='allcb'  /> </th><th bgcolor='lightblue'>AWB/Ref No</th> <th bgcolor='lightblue'>Org</th> <th bgcolor='lightblue'>Dest</th> <th bgcolor='lightblue'> Booked Date</th>  <th bgcolor='lightblue'>Flight No</th> <th bgcolor='lightblue'>Flight Date</th> <th bgcolor='lightblue'>Pcs</th><th bgcolor='lightblue'>Gr.Wt.</th> <th bgcolor='lightblue'>Agent Name</th> <th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Commodity</th><th bgcolor='lightblue'> Penalty Currency</th><th bgcolor='lightblue'> Penalty Amount</th>";
             
                str += "<th bgcolor='lightblue' style='display:" + hidetd + ";'>Tax on Penalty</th> <th bgcolor='lightblue'style='display:" + hidetd + ";'>Total Amount</th>";
       
                str+="<th bgcolor='lightblue'>Status</th><th bgcolor='lightblue'>Penalty Ref No</th><th bgcolor='lightblue'>Remarks</th> <th id='threfid' bgcolor='lightblue'></th></tr></thead>";

                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        if ($('#Text_ReferenceNumber').val() != "" && Type == "A") {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td >" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" + result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                        
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                           
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                            str += "<td id='refid' style='display:none;'>" + result.Data[i].AWBNo + "</td>";

                        }

                        else if ($('#Text_AWBNo').val() != "" && Type == "A") {
                            // debugger;
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            //  str += "<td>" + result.Data[i].AWBNo + "</td>";
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" + result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                          
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                          
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                            str += "<td id='refid' style='display:none;'>" + result.Data[i].AWBNo + "</td>";
                            $("#BlackListTbl thead tr:second").find('th').eq(12).remove();
                            $("#BlackListTbl tbody tr").find('td').eq(12).remove();
                        }

                        else {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" + result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                          
                                //str += "<td>" + result.Data[i].TaxOnPenalty + "</td>";
                                //str += "<td>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                            str += "<td id='refid' style='display:none;'>" + result.Data[i].AWBNo + "</td>";

                        }
                        str += "</tr></tbody>";
                    }
                    $('.trpSubmit').show();
                    $('#Penalty').css('display', 'block');
                    //$('#Penalty').val(PenaltyType1);


                    //if ($("input[name='PenaltyType']:checked").val() == "0")


                    if ($('#PenaltyType').val() == "0") {
                        $('#Penalty').val('No Show');
                    }
                    else if ($('#PenaltyType').val() == "1") {
                        $('#Penalty').val('Void');
                    }
                    else if ($('#PenaltyType').val() == "7") {
                        $('#Penalty').val('EXEC>RCS');
                    }
                    else if ($('#PenaltyType').val() == "8") {
                        $('#Penalty').val('EXEC<RCS');
                    }
                    else if ($('#PenaltyType').val() == "11") {
                        $('#Penalty').val('Auto No Show');
                    }
                    else {

                        $('#Penalty').val('Cancellation');
                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='20'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr></tbody>";
                    $('#Penalty').css('display', 'none');
                }
                str += "</table>";

                
                $('#BindBlakListTable').append(str);
                if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (userContext.GroupName == 'AGENT'))
                {
                    $("#allcb").attr("disabled", true);

                }
                else
                {
                    $("#allcb").attr("disabled", false);
                }
                $("#allcb").attr("disabled", true);
                ////////////////
                //$('#cb1').change(function () {
                //    if ($(this).prop('checked')) {
                //        var ids = $(this).parent().parent().html();
                //        var awb = $(this).parent().next().text();
                //        alert(awb);
                //    }
                //});

               




               if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (userContext.GroupName == 'AGENT'))
               {
                    $('input[type=checkbox][name=cb1]').change(function () {
                        var awb = $(this).parent().next().text();
                        var ref = $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text();
                        var arrayOfValuesForMessage = [];
                        var usersno = userContext.UserSNo;
                        var Array = {

                            //AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                            AWBNo: $(this).parent().next().text(),
                            PenaltyType: $('#PenaltyType').val(),
                            usersno: usersno,
                            PenalTyMode: 1,
                           
                        };
                        arrayOfValuesForMessage.push(Array);
                        if (arrayOfValuesForMessage.length > 0) {

                            $.ajax({
                                url: "GetMessageForAgentIn2ndTimeCancel", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({ AwbNoList: arrayOfValuesForMessage }),
                                success: function (result) {

                                    var GetSucessResult = JSON.parse(result).Table0[0].Column1;
                                    var GetMessage = JSON.parse(result).Table0[0].Column2;
                                    var AWBNo = JSON.parse(result).Table0[0].Column3;
                                    if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (userContext.GroupName == 'AGENT') && (GetSucessResult == 1001))
                                    {
                                        $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').removeAttr("checked");
                                        ShowMessage('warning', 'Warning - AWB Penalty', JSON.parse(result).Table0[0].Column2);
                                        $('#Penalty').css('display', 'none');
                                        return;

                                    }
                                    else
                                    {
                                        $('#Penalty').css('display', 'block');

                                    }
                                }
                            });
                        }

                        //alert(awb);
                        //alert(ref);
                    });
               }
                ////////////////////
                    var arrayOfValuesForMessage = [];
                $('#allcb').change(function () {

                    if ($(this).prop('checked')) {

                        $('tbody tr td input[type="checkbox"]').each(function () {
                            $(this).prop('checked', true);
                            /// New Changes on dated 12 june 2018
                           
                            var usersno = userContext.UserSNo;
                            var Array = {

                                //AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                                AWBNo: $(this).parent().next().text(),
                                PenaltyType: $('#PenaltyType').val(),
                                usersno: usersno,
                                PenalTyMode: 1,

                            };
                            arrayOfValuesForMessage.push(Array);

                            /////////////////////////////////
                            //alert($(this).parent().next().text());
                        });
                        /////////////////
                        if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (userContext.GroupName == 'AGENT')) {
                            if (arrayOfValuesForMessage.length > 0) {

                                $.ajax({
                                    url: "GetMessageForAgentIn2ndTimeCancel", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify({ AwbNoList: arrayOfValuesForMessage }),
                                    success: function (result) {

                                        var GetSucessResult = JSON.parse(result).Table0[0].Column1;
                                        var GetMessage = JSON.parse(result).Table0[0].Column2;
                                        var AWBNo = JSON.parse(result).Table0[0].Column3;

                                        if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (userContext.GroupName == 'AGENT') && (GetSucessResult == 1001)) {
                                            $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').removeAttr("checked");
                                            ShowMessage('warning', 'Warning - AWB Penalty', JSON.parse(result).Table0[0].Column2);
                                            $('#Penalty').css('display', 'none');
                                            return;


                                        }
                                        else {

                                            $('#Penalty').css('display', 'block');
                                        }
                                    }
                                });
                            }
                        } /// Agent Close 
                        /////////////////////

                    } else {
                        $('tbody tr td input[type="checkbox"]').each(function () {
                            $(this).prop('checked', false);
                            if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (userContext.GroupName == 'AGENT')) {
                                arrayOfValuesForMessage = [];
                            }
                        });
                    }
                });

                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

    if ((PenaltyType != "3") && (PenaltyType != "")) {
        $("#BlackListTbl").remove();
        $('#Text_AWBNo1_input').removeAttr('data-valid', "required");
        //  $('#Text_ReferenceNumber_input').removeAttr('data-valid', "required");

        $.ajax({
            url: 'GetAWBPenalty',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ReferenceNumber: ReferenceNumber, AWBNo: AWBNo, PenaltyType: PenaltyType, AccountSno: AccountSno, GroupName: GroupName, BookingFromDate: FromDate, BookingToDate: ToDate, WhereCondition: WhereCondition,
            },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {

                if ((PenaltyType == 0) || (PenaltyType == 1) || (PenaltyType == 11)) {
                    str = '';
                    str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='19' style='height: 30px;'></td></tr><tr><th bgcolor='lightblue'> <input type='checkbox' id='allcb' name='allcb'  /> </th>                    <th bgcolor='lightblue'>AWB/Ref No</th> <th bgcolor='lightblue'>Org</th> <th bgcolor='lightblue'>Dest</th> <th bgcolor='lightblue'> Booked Date</th><th bgcolor='lightblue'>Flight No</th> <th bgcolor='lightblue'>Flight Date</th><th bgcolor='lightblue'>Pcs</th><th bgcolor='lightblue'>Gr.Wt.</th>  <th bgcolor='lightblue'>Agent Name</th> <th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Commodity</th><th bgcolor='lightblue'> Penalty Currency</th> <th bgcolor='lightblue'> Penalty Amount</th>";
                    str += "<th bgcolor='lightblue' style='display:" + hidetd + ";'>Tax on Penalty</th> <th bgcolor='lightblue' style='display:" + hidetd  + ";'>Total Amount</th>";
                     str+="   <th bgcolor='lightblue'>Status</th><th bgcolor='lightblue'>Penalty Ref No</th> <th bgcolor='lightblue'>Remarks</th>              </tr></thead>";
                }
                else {
                    str = '';
                    str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='20' style='height: 30px;'></td></tr><tr><th bgcolor='lightblue'> <input type='checkbox' id='allcb' name='allcb'  /> </th>                    <th bgcolor='lightblue'>AWB/Ref No</th> <th bgcolor='lightblue'>Org</th> <th bgcolor='lightblue'>Dest</th> <th bgcolor='lightblue'> Booked Date</th> <th bgcolor='lightblue'>Flight No</th> <th bgcolor='lightblue'>Flight Date</th> <th bgcolor='lightblue'>Pcs</th><th bgcolor='lightblue'>Gr.Wt.</th><th bgcolor='lightblue'>Exec.Weight</th>  <th bgcolor='lightblue'>Agent Name</th> <th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Commodity</th> <th bgcolor='lightblue'> Penalty Currency</th> <th bgcolor='lightblue'> Penalty Amount</th> <th bgcolor='lightblue'>Tax on Penalty</th> <th bgcolor='lightblue'>Total Amount</th><th bgcolor='lightblue'>Status</th> <th bgcolor='lightblue'>Penalty Refe No</th>  <th bgcolor='lightblue'>Remarks</th>             </tr></thead>";

                }
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        if ($('#Text_ReferenceNumber').val() != "" && Type == "A") {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" + result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            //str += "<td>" + result.Data[i].TaxOnPenalty + "</td>";
                            //str += "<td>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                        }

                        else if ($('#Text_AWBNo1').val() != "" && Type == "A" && (PenaltyType == 4 || PenaltyType == 5 || PenaltyType == 7 || PenaltyType == 8 || PenaltyType == 9 || PenaltyType == 10)) {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].AWBNo + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].ExecutedGrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" +result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            //str += "<td>" + result.Data[i].TaxOnPenalty + "</td>";
                            //str += "<td>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                            str += "<td id='refid' style='display:none;'>" + result.Data[i].ReferenceNumber + "</td>";

                        }
                        else if (Type == "D" && (PenaltyType == 4 || PenaltyType == 5 || PenaltyType == 7 || PenaltyType == 8 || PenaltyType == 9 || PenaltyType == 10)) {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].AWBNo + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].ExecutedGrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" + result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            //str += "<td>" + result.Data[i].TaxOnPenalty + "</td>";
                            //str += "<td>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                            str += "<td id='refid' style='display:none;'>" + result.Data[i].ReferenceNumber + "</td>";

                        }

                        else if ($('#Text_AWBNo').val() != "" && Type == "A") {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].AWBNo + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" + result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                            //str += "<td>" + result.Data[i].TaxOnPenalty + "</td>";
                            //str += "<td>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                        }

                        else {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].FlightNo + "</td>";
                            str += "<td>" + result.Data[i].FlightDate + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            //str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                            str += "<td>" + result.Data[i].PenaltyCurrency + "</td>";
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TaxOnPenalty + "</td>";
                            str += "<td style='display:" + hidetd + ";'>" + result.Data[i].TotalPenalty + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].ReferencePenaltyParameter + "</td>";
                            str += "<td><input type='text' id='txtRemarks_" + i + "' name='txtRemarks' maxlenght='300' style='height: 23px;'/></td>";
                        }
                        str += "</tr></tbody>";
                    }
                    $('.trpSubmit').show();
                    $('#Penalty').css('display', 'block');
                    //$('#Penalty').val(PenaltyType1);
                    //---------------------------Added By Preeti Deep for disable Penalty Type DropDown for avoiding Cancellation after exe-------------------------------
                    if (userContext.SysSetting.ICMSEnvironment != 'JT') {
                       
                        cfi.EnableAutoComplete("PenaltyType",false)
                     }
                    //--------------------------------------------------END(23-oct-2019)------------------------------------------------------------------------------------


                    // if ($("input[name='PenaltyType']:checked").val() == "0")
                    if ($('#PenaltyType').val() == "0") {

                        $('#Penalty').val('No Show');
                    }
                    else if ($('#PenaltyType').val() == "1") {
                        $('#Penalty').val('Void');
                    }
                    else if ($('#PenaltyType').val() == "3") {

                        $('#Penalty').val('Cancellation');
                    }
                    else if ($('#PenaltyType').val() == "4") {

                        $('#Penalty').val('BKD Vs EXEC');
                    }
                    else if ($('#PenaltyType').val() == "5") {

                        $('#Penalty').val('EXEC Vs RCS');
                    }
                    else if ($('#PenaltyType').val() == "7") {
                        $('#Penalty').val('EXEC>RCS');
                    }
                    else if ($('#PenaltyType').val() == "8") {
                        $('#Penalty').val('EXEC<RCS');
                    }
                    else if ($('#PenaltyType').val() == "9") {
                        $('#Penalty').val('EXEC GREATER THAN BKD');
                    }
                    else if ($('#PenaltyType').val() == "10") {
                        $('#Penalty').val('EXEC LESS THAN BKD');
                    }
                    else if ($('#PenaltyType').val() == "11") {
                        $('#Penalty').val('Auto No Show');
                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='20'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr></tbody>";
                    $('#Penalty').css('display', 'none');
                }
                str += "</table>";

                $('#BindBlakListTable').append(str);
                $("#allcb").attr("disabled", true);

                /// This message for EXE ,BKD and No SHOW can not be void in Lion Env.
                //if ((userContext.SysSetting.ICMSEnvironment == 'JT') && ($('#PenaltyType').val() == '1')) {
                //$('input[type=checkbox][name=cb1]').change(function () {
                //   // alert($(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text());
                //    var AWBStatus = $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text();
                //    var AWBNo = $(this).parent().next().text();
                //    if((AWBStatus=='EXE')||(AWBStatus=='BKD')||(AWBStatus=='NO SHOW'))
                //    {
                //        $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').prop("checked", false);
                //        ShowMessage('warning', 'Warning - AWB Penalty', "AWB is not yet Accepted, cannot be marked as VOID ");
                //        return;

                //    }
                //    // alert('AWB is not yet Accepted, cannot be marked as VOID');
                //});
                //};

                //// This Message for Buildup and Li Validation 
                if ($('#PenaltyType').val() == '1') {
                    $('input[type=checkbox][name=cb1]').change(function () {
                        // alert($(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text());
                     var arrayOfValuesForMessage = [];
                        var AWBNo = $(this).parent().next().text();
                        var FlightNo=$(this).parent().next().next().next().next().next().text();
                        var FlightDate = $(this).parent().next().next().next().next().next().next().text();


                        var Array = {

                            //AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                            AWBNo: AWBNo,
                            FlightNo: FlightNo,
                            FlightDate: FlightDate,
                          
                           
                        };
                        arrayOfValuesForMessage.push(Array);
                        if (arrayOfValuesForMessage.length > 0) {

                            $.ajax({
                                url: "GetMessageForBuildUP", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({ AwbNoList: arrayOfValuesForMessage }),
                                success: function (result) {

                                    var GetSucessResult = result.Data[0].ReturnError;
                                    var GetMessage = result.Data[0].Message;
                                    var AWBNo = result.Data[0].AWBNo;
                                    var AWBStatus = result.Data[0].Status;
                                    // var AWBNo = JSON.parse(result).Table0[0].Column3;

                                    if (GetSucessResult=='1001')
                                    {
                                        $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').prop("checked", false);
                                        ShowMessage('warning', 'Warning - AWB Penalty', GetMessage);
                                           return;
                                    }

                                    else
                                    {
                                        if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (AWBStatus.toUpperCase() == 'EXE') || (AWBStatus.toUpperCase() == 'BKD') || (AWBStatus.toUpperCase() == 'NO SHOW'))
                                        {
                                            $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').prop("checked", false);
                                            ShowMessage('warning', 'Warning - AWB Penalty', "AWB is not yet Accepted, cannot be marked as VOID ");
                                            return;
                                        }
                                      

                                    }
                                }
                            });
                        }

                    });
                };


                /////////////////////////////////
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
            
                ///////////////////////// New Code ////////////
                //if ((userContext.SysSetting.ICMSEnvironment == 'JT') && ($('#PenaltyType').val() == '1')) {
                //    $('#allcb').change(function () {

                //        if ($(this).prop('checked')) {

                //            $('tbody tr td input[type="checkbox"]').each(function () {
                //                var AWBNo = $(this).parent().next().text();
                //                var AWBStatus = $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text();

                //                if ((AWBStatus == 'EXE') || (AWBStatus == 'BKD') || (AWBStatus == 'NO SHOW')) {
                //                    $(this).prop('checked', false);
                //                }
                //                else {
                //                    $(this).prop('checked', true);

                //                }
                //            });
                //        } else {
                //            $('tbody tr td input[type="checkbox"]').each(function () {
                //                $(this).prop('checked', false);
                //            });
                //        }
                //    });
                //}
                ///////////////////////////////

                ///////////////// New Changes for Buildup and lyinglist Check All Message///// On Dated 31 July 2018 //////////////////

                if (($('#PenaltyType').val() == '1')) {
                  
                    $('#allcb').change(function () {
                       var arrayOfValuesForMessage = [];
                        if ($(this).prop('checked')) {

                            $('tbody tr td input[type="checkbox"]').each(function () {
                            
                                var AWBNo = $(this).parent().next().text();
                                var FlightNo = $(this).parent().next().next().next().next().next().text();
                                var FlightDate = $(this).parent().next().next().next().next().next().next().text();

                                var Array = {

                                    //AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                                    AWBNo: AWBNo,
                                    FlightNo: FlightNo,
                                    FlightDate: FlightDate,


                                };
                                arrayOfValuesForMessage.push(Array);
                              
                            });

                            if (arrayOfValuesForMessage.length > 0) {
                                $.ajax({
                                    url: "GetMessageForBuildUP", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify({ AwbNoList: arrayOfValuesForMessage }),
                                    success: function (result) {

                                        if (result.Data.length > 0) {
                                            for (var i = 0; i < result.Data.length; i++) {

                                                var GetSucessResult = result.Data[i].ReturnError;
                                                var GetMessage = result.Data[i].Message;
                                                var AWBNo = result.Data[i].AWBNo;
                                                var AWBStatus = result.Data[i].Status;
                                              //  alert(AWBNo);
                                                if (GetSucessResult == '1001') {
                                                    $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').prop("checked", false);
                                               
                                                   // ShowMessage('warning', 'Warning - AWB Penalty', result.Data[i].Message);
                                                   // return;
                                                }
                                                else {
                                                    if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (AWBStatus == 'EXE') || (AWBStatus == 'BKD') || (AWBStatus == 'NO SHOW'))
                                                    {
                                                        $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').prop("checked", false);
                                                    }
                                                    else 
                                                    {
                                                        $('#BlackListTbl tr td:contains(' + AWBNo + ')').parent().find('td input[type="checkbox"]').prop("checked", true);
                                                    }
                                                }
                                            } // For loop Close 
                                        } // result If Close
                                    }
                                });
                            }
                        }


                        else {
                            $('tbody tr td input[type="checkbox"]').each(function () {
                                $(this).prop('checked', false);
                            });
                        }

                     

                    });


                }

        

                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }


    setTimeout(function () { PageRightsCheckInboundFlight()},500)

}

function UpdateDataAWBReservationPenalty() {

    var tableControl = document.getElementById('BlackListTbl');
    //  var sValue = '<%= ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo%>';

    var arrayOfValues = [];
    var PenaltyType1 = '0';
    var RemarksBlanks = '0';
    $('.test:checkbox:checked', tableControl).map(function () {
        
        PenaltyType1 = $('#PenaltyType').val(); //$("input[name='PenaltyType']:checked").val();
        var Type = $("input[name='Filter']:checked").val();
        var str = $("#Text_AWBNo").val();
        var usersno = userContext.UserSNo;
        var PenalTyMode = 1;
        // 1  this means manual 


        //Add remarks work by akash on 25 Aug 2017

        var VoidRemarks = $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().find('input').val();
        
        if (PenaltyType1 == '1' && VoidRemarks == '') {
            RemarksBlanks = '1';
            //ShowMessage('warning', 'warning - AWB Penalty', "Please Enter Remarks !");
            //return;
        }



        if (str != "") {
          
            var Array = {
               
                //AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode: PenalTyMode,
                Remarks: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().find('input').val(),
                TaxOnPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                TotalPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyReferenceNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text()
            };
            arrayOfValues.push(Array);
        }
        else if (PenaltyType1 == "3") {
           
            var Array = {

                //AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode: PenalTyMode,
                Remarks: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().find('input').val(),
                TaxOnPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                TotalPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyReferenceNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text()
            };
            arrayOfValues.push(Array);
        }

        else if (PenaltyType1 == "4") {
          
            var Array = {

                AWBNo: $(this).parent().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode: PenalTyMode,
                Remarks: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().find('input').val(),
                TaxOnPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                TotalPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyReferenceNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text()
            };
            arrayOfValues.push(Array);
        }
        else if ((PenaltyType1 == "5") || (PenaltyType1 == "7") || (PenaltyType1 == "8")) {

            var Array = {
               
                AWBNo: $(this).parent().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode: PenalTyMode,
                Remarks: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().find('input').val(),
                TaxOnPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                TotalPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyReferenceNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text()
            };
            arrayOfValues.push(Array);
        }
        else {
          
            var Array = {
                AWBNo: $(this).parent().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode: PenalTyMode,
                Remarks: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().find('input').next().val(),
                TaxOnPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                TotalPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyReferenceNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().next().text()
            };
            arrayOfValues.push(Array);
        }
        // data: JSON.stringify({ AwbNoList: arrayOfValues, PenaltyType: PenaltyType1 }),
    });

    if ((PenaltyType1 == '1') && (RemarksBlanks == '1') ) 
    {
        ShowMessage('warning', 'Warning - AWB Penalty', "Please Enter Remarks ");
        return;
    }
    else
    {
        if (arrayOfValues.length > 0) {

            $.ajax({
                url: "UpdateAWBPenalty", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AwbNoList: arrayOfValues }),
                success: function (result) {

                    var GetSucessResult = JSON.parse(result).Table0[0].Column1;
                    var GetMessage = JSON.parse(result).Table0[0].Column2;

                    if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (GetSucessResult == 1001))
                    {
                        ShowMessage('warning', 'Warning - AWB Penalty', JSON.parse(result).Table0[0].Column2);
                        return;

                    }
                    if (GetSucessResult == 0) {
                       

                        var PenaltyType1 = $('#PenaltyType').val();// $("input[name='PenaltyType']:checked").val();
                        if (PenaltyType1 == "3") {
                            // ShowMessage('warning', 'warning - AWB Penalty', "Cancellation successfully !");
                            ShowMessage('success', 'Success - AWB Penalty', "Cancellation Penalty levied successfully !", "bottom-right");
                            // ShowMessage('success', 'Success - ULD Breakdown', "Deleted Successfully", "bottom-right");
                            //alert("Cancellation successfully !");
                        }
                        else if (PenaltyType1 == "0") {
                            ShowMessage('success', 'Success - AWB Penalty', "No Show Penalty levied successfully  !", "bottom-right");


                        }
                        else if (PenaltyType1 == "1") {
                            ShowMessage('success', 'Success - AWB Penalty', "Void Penalty levied successfully  !", "bottom-right");


                        }
                        else if (PenaltyType1 == "4") {
                            ShowMessage('success', 'Success - AWB Penalty', "BKD Vs EXEC Penalty levied successfully  !", "bottom-right");


                        }
                        else if (PenaltyType1 == "11") {
                            ShowMessage('success', 'Success - AWB Penalty', "AUTO No SHOW Penalty levied successfully  !", "bottom-right");


                        }
                            //else if (PenaltyType1 == "5")
                        else {
                            ShowMessage('success', 'Success - AWB Penalty', "EXEC Vs RCS Penalty levied successfully  !", "bottom-right");


                        }
                        // alert(PenaltyType1 + 'successfully');
                        // $('#Text_ReferenceNumber').val('')
                        $('#Text_ReferenceNumber_input').val('')
                        $("#Text_AWBNo_input").val('');
                        $("#Text_AWBNo").val('');
                        $("#Text_AWBNo1_input").val('');
                        $("#Text_AWBNo1").val('');
                        $('#AWBNo').val('');
                        $("#BlackListTbl").remove();
                        $('.trpSubmit').hide();
                    }
                    else {

                    }
                }
            });
        }
        else {



            ShowMessage('warning', 'Warning - AWB Penalty', "Please Check atleast One AWB/Reference No  !");
            //alert('Please Check atleast One AWB/Reference No')
        }
    }
}

var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;

var YesReady = false;
function PageRightsCheckInboundFlight() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Hyperlink.toString().toUpperCase() == "AWBPENALTY/INDEX") {

            if (i.Hyperlink.toString().toUpperCase() == "AWBPENALTY/INDEX" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Hyperlink.toString().toUpperCase() == "AWBPENALTY/INDEX" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Hyperlink.toString().toUpperCase() == "AWBPENALTY/INDEX" && i.PageRight == "Delete") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                YesReady = true;
                CheckIsFalse = 1;
                return
            }

        }
    });

    if (YesReady) {
        $('#Penalty').hide();
       
    }
}