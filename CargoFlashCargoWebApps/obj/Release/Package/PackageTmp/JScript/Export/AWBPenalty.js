$(document).ready(function () {
 
    cfi.AutoComplete("ReferenceNumber", "ReferenceNumber", "vwReferenceNumber", "ReferenceNumber", "ReferenceNumber", null, null, "contains");
    cfi.AutoComplete("AWBNo", "AWBNo", "vwAWBNo", "AWBNo", "AWBNo", null, null, "contains");
    cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWB", "AWBNo", "AWBNo", null, null, "contains");
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






    
    var AccountSno = 0;
    if (userContext.GroupName == 'ADMIN') {
        $("#NoShow").show();
        $("#Void").show();
        $("#Cancelation").show();
        AccountSno = 0;
    }
    else if (userContext.GroupName == 'AGENT')
    {
        debugger;
       $("#NoShow").hide();
        $('label[for*=NoShow]').hide();
        $("#Void").hide();
        $('label[for*=Void]').hide();
       

        $("#Cancelation").show();
     
        AccountSno = userContext.AgentSNo;



    }
    else if (userContext.GroupName == 'AIRLINE')
    {
        $("#NoShow").show();
        $("#Void").show();
        $("#Cancelation").show();
       
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
        var PenaltyType = $("input[name='PenaltyType']:checked").val();
        if (PenaltyType == '1')
        {
            $('label[for=AWbNoCheck]').html('AWB No.');
        }

        if (PenaltyType == '0') {
            $('label[for=AWbNoCheck]').html('AWB No.');
        }
        if (PenaltyType == '3') {
            $('label[for=AWbNoCheck]').html('AWB/Ref No.');
        }
        $('.trRadio').show();
        });

    /////////////////////////////

   
    $('input[type=radio][name=Filter]').change(function () {
        if (this.value == 'A') {
            var PenaltyType = $("input[name='PenaltyType']:checked").val();
            if (PenaltyType == '0') {
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

                cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWBForNoShow", "AWBNo", "AWBNo", null, null, "contains");

            }
            
            if (PenaltyType == '1')
            {
                $('.DateWiseRow').hide();
                $('.AWBNoR').show();
                $('.AWBNoRow').hide();
                $('#btnSearch').show();
                $("#BlackListTbl").remove();

                $('#Text_ReferenceNumber_input').val('')

                $('#Text_ReferenceNumber').val('');
                $('#Text_AWBNo_input').val('');

                $('#Text_AWBNo').val('');
              
                cfi.AutoComplete("AWBNo1", "AWBNo", "vwAWBNoInAWBForVoid", "AWBNo", "AWBNo", null, null, "contains");

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


function ExtraCondition(textId) {
    // var filterEmbargo = cfi.getFilter("AND");
    debugger;
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



 

}


/////////////////////////////
















var ReferenceNumber = "";
var WhereCondition = "";


function SearchAWBPenalty() {
    var AccountSno = userContext.AgentSNo;

    var GroupName = userContext.GroupName;


    if (GroupName == 'ADMIN') {
        AccountSno =0;

    }
   else if (GroupName == 'AIRLINE')
    {
        AccountSno = 0;

    }
    else if (GroupName == 'AGENT') {
        AccountSno = userContext.AgentSNo;

    }
    var uid = $("#uid").val();
    var PenaltyType = $("input[name='PenaltyType']:checked").val();
   // var sValue = '<%=((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo%>';
    if ((PenaltyType != '1') && (PenaltyType != '0') && (PenaltyType != '3'))
    {

        alert("Please Select On of the Penalty");

        return false;
    }
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

        $("#Text_ReferenceNumber").removeAttr('data-valid', 'required');
        $("#Text_ReferenceNumber_input").removeAttr('data-valid', 'required');

        $("#FromDate").attr('data-valid', 'required');
        $("#ToDate").attr('data-valid', 'required');
        ReferenceNumber = "0";
        if(Date.parse(FromDate)>Date.parse(ToDate))
        {
            $("#BlackListTbl").remove();
            alert('From Date can not be greater than To Date');
            return;
        }

    }
    else {

        $("#FromDate").removeAttr('data-valid');
        $("#ToDate").removeAttr('data-valid');

        $("#Text_ReferenceNumber").attr('data-valid', 'required');
        $("#Text_ReferenceNumber_input").attr('data-valid', 'required');
    }

    if ((ReferenceNumber == "") && (AWBNo = "") && AWBNoA != "" && PenaltyType !='1') {
        AWBNo = $('#AWBNo').val();

    }

    if ((PenaltyType != "3") && (Type == "A"))
    {

        AWBNo = $('#Text_AWBNo1').val();
    }

    $("#BlackListTbl").remove();
    if ((ReferenceNumber != "" && AWBNoA != "") || (ReferenceNumber != "" || AWBNoA != "") && ( PenaltyType=="3"))
    {
        $("#BlackListTbl").remove();
        $("#BlackListTbl").html('');
        $('#Text_AWBNo_input').removeAttr('data-valid',"required");
        $('#Text_ReferenceNumber_input').removeAttr('data-valid', "required");

        $.ajax({
            url: 'GetAWBPenalty',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ReferenceNumber: ReferenceNumber, AWBNo: AWBNo, PenaltyType: PenaltyType, BookingFromDate: FromDate, BookingToDate: ToDate, AWBNo: AWBNoA, AccountSno: AccountSno,GroupName:GroupName, WhereCondition: WhereCondition,
            },
          
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='12' style='height: 30px;'></td></tr><tr><th bgcolor='lightblue'> <input type='checkbox' id='allcb' name='allcb'  /> </th>                    <th bgcolor='lightblue'>AWB/RefNumber</th> <th bgcolor='lightblue'>Origin</th> <th bgcolor='lightblue'>Destination</th> <th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>Gr.Weight</th><th bgcolor='lightblue'>Volume</th> <th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Commodity</th> <th bgcolor='lightblue'>Total Penalty Charges</th><th bgcolor='lightblue'>Created DateTime</th><th id='threfid' bgcolor='lightblue'></th></tr></thead>";

                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++)
                     
                    {
                        if ($('#Text_ReferenceNumber').val() != "" && Type == "A")
                        {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";
                        
                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
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
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";

                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td id='refid' style='display:none;'>" + result.Data[i].AWBNo + "</td>";
                            $("#BlackListTbl thead tr:second").find('th').eq(12).remove();
                            $("#BlackListTbl tbody tr").find('td').eq(12).remove();
                      }
                   
                        else  {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";

                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td id='refid' style='display:none;'>" + result.Data[i].AWBNo + "</td>";
                        }
                       str += "</tr></tbody>";
                    }
                    $('.trpSubmit').show();
                    $('#Penalty').css('display', 'block');
                    //$('#Penalty').val(PenaltyType1);
                    
                
                    if ($("input[name='PenaltyType']:checked").val() == "0") {
                        $('#Penalty').val('No Show');
                    }
                    else if ($("input[name='PenaltyType']:checked").val() == "1") {
                        $('#Penalty').val('Void');
                    }
                    else {

                        $('#Penalty').val('Cancellation');
                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='12'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr></tbody>";
                    $('#Penalty').css('display', 'none');
                }
                str += "</table>";

                $('#BindBlakListTable').append(str);

              
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

                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

    if (PenaltyType != "3")
    {
        $("#BlackListTbl").remove();
        $('#Text_AWBNo1_input').removeAttr('data-valid', "required");
      //  $('#Text_ReferenceNumber_input').removeAttr('data-valid', "required");

        $.ajax({
            url: 'GetAWBPenalty',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ReferenceNumber: ReferenceNumber, AWBNo: AWBNo, PenaltyType: PenaltyType, BookingFromDate: FromDate, BookingToDate: ToDate, WhereCondition: WhereCondition,
            },

            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var str = "<table id='BlackListTbl' border='1' style='border : 1px solid black;border-collapse: collapse;width: 100%;height: 25px;font-size: 14px;text-align: center;'> <thead><tr><td colspan='12' style='height: 30px;'></td></tr><tr><th bgcolor='lightblue'> <input type='checkbox' id='allcb' name='allcb'  /> </th>                    <th bgcolor='lightblue'>AWB/RefNumber</th> <th bgcolor='lightblue'>Origin</th> <th bgcolor='lightblue'>Destination</th> <th bgcolor='lightblue'>Agent Name</th><th bgcolor='lightblue'>Pieces</th><th bgcolor='lightblue'>Gr.Weight</th><th bgcolor='lightblue'>Volume</th> <th bgcolor='lightblue'>Product</th><th bgcolor='lightblue'>Commodity</th> <th bgcolor='lightblue'>Total Penalty Charges</th><th bgcolor='lightblue'>Created DateTime</th>                </tr></thead>";
                if (result.Data.length > 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        if ($('#Text_ReferenceNumber').val() != "" && Type == "A") {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";

                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                        }

                        else if ($('#Text_AWBNo').val() != "" && Type == "A") {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].AWBNo + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";

                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                        }

                        else {
                            str += " <tbody><tr>";
                            str += "<td><input type='checkbox' id='cb1' name='cb1' class='test'/></td>"
                            str += "<td>" + result.Data[i].ReferenceNumber + "</td>";
                            str += "<td>" + result.Data[i].Origin + "</td>";
                            str += "<td>" + result.Data[i].Destination + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].AWBPieces + "</td>";
                            str += "<td>" + result.Data[i].GrossWeight + "</td>";
                            str += "<td>" + result.Data[i].Volume + "</td>";
                            str += "<td>" + result.Data[i].ProductName + "</td>";
                            str += "<td>" + result.Data[i].CommodityDescription + "</td>";

                            str += "<td id='GetPenalty'>" + result.Data[i].TotalPenaltyCharges + "</td>";
                            str += "<td>" + result.Data[i].CreatedDate + "</td>";
                        }
                        str += "</tr></tbody>";
                    }
                    $('.trpSubmit').show();
                    $('#Penalty').css('display', 'block');
                    //$('#Penalty').val(PenaltyType1);


                    if ($("input[name='PenaltyType']:checked").val() == "0") {
                        $('#Penalty').val('No Show');
                    }
                    else if ($("input[name='PenaltyType']:checked").val() == "1") {
                        $('#Penalty').val('Void');
                    }
                    else {

                        $('#Penalty').val('Cancellation');
                    }
                }
                else {
                    str += " <tbody><tr>";
                    str += "<td colspan='12'><center><p style='color:red'>No Record Found</p></center></td>";
                    str += "</tr></tbody>";
                    $('#Penalty').css('display', 'none');
                }
                str += "</table>";

                $('#BindBlakListTable').append(str);

              

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

                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

  
     
  
}
function UpdateDataAWBReservationPenalty() {
    debugger;
    var tableControl = document.getElementById('BlackListTbl');
  //  var sValue = '<%= ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo%>';
   
    var arrayOfValues = [];

    $('.test:checkbox:checked', tableControl).map(function () {
        debugger;
        var PenaltyType1 = $("input[name='PenaltyType']:checked").val();
        var Type = $("input[name='Filter']:checked").val();
        var str = $("#Text_AWBNo").val();
        var usersno = userContext.UserSNo;
        var PenalTyMode = 1;
        // 1  this means manual 
        if (str != "") {
            var Array = {
               
                AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode:PenalTyMode
            };
            arrayOfValues.push(Array);
        }
        else if (PenaltyType1 == "3")
        {

            var Array = {
               
                AWBNo: $(this).parent().next().next().next().next().next().next().next().next().next().next().next().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode:PenalTyMode
            };
            arrayOfValues.push(Array);
        }
        else

        {
          
            var Array = {
                AWBNo: $(this).parent().next().text(),
                GetPenalty: $(this).parent().next().next().next().next().next().next().next().next().next().next().text(),
                PenaltyType: PenaltyType1,
                usersno: usersno,
                PenalTyMode: PenalTyMode
            };
            arrayOfValues.push(Array);
        }
       // data: JSON.stringify({ AwbNoList: arrayOfValues, PenaltyType: PenaltyType1 }),
    });


    
    if (arrayOfValues.length > 0)  {
       
        $.ajax({
            url: "UpdateAWBPenalty", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AwbNoList: arrayOfValues }),
            success: function (result) {

                var GetSucessResult = JSON.parse(result).Table0[0].Column1;
                if (GetSucessResult == 0) {

                    var PenaltyType1 = $("input[name='PenaltyType']:checked").val();
                    if (PenaltyType1 == "3")
                    {
                        alert("Cancellation successfully !");
                    }
                    if (PenaltyType1 == "0") {
                        alert("No Show successfully !");
                    }
                    if (PenaltyType1 == "1") {
                        alert("Void successfully !");
                    }
                   // alert(PenaltyType1 + 'successfully');
                   // $('#Text_ReferenceNumber').val('')
                    $('#Text_ReferenceNumber_input').val('')
                    $("#Text_AWBNo_input").val('');
                    $("#Text_AWBNo").val('');
                    $("#Text_AWBNo1_input").val('');
                    $("#Text_AWBNo1").val('');
                    $("#BlackListTbl").remove();
                    $('.trpSubmit').hide();
               }
                else {

                }
            }
        });
    }
    else {
        alert('Please Check atlease One AWB/Reference No')
    }
}