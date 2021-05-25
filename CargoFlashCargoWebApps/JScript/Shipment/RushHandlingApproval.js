

var PageType = "";
var AwbSno = "";
var Approve = "";
var Request = "";
var LoginType = "";



$(function () {


    if (window.opener) {
        userContext = window.opener.parent.userContext;
    }

    PageType = getQueryStringValue("FormAction").toUpperCase();
    

   

   if (PageType == "READ") {


        $.ajax({
            url: 'HtmlFiles/Shipment/RushHandlingApproval.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                GetRushHandlingRecord();
            }
        });
    }




});




function GetRushHandlingRecord() {
    var SNo;
    var PageType = getQueryStringValue("FormAction").toUpperCase();
    if (PageType == "READ" ) {
        SNo = getQueryStringValue("RecID").toUpperCase()
       
    }
    //else {

    //    if (SNo == "") {
    //        ShowMessage('info', 'Need your Kind Attention!', "Please enter AWB NO.", "bottom-left");
    //        return false;
    //    }
    //}



    if (SNo != "") {
        $.ajax({
            url: "Services/Shipment/RushHandlingApprovalService.svc/GetRushHandlingApprovalRecord", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SNo: SNo }),
            success: function (result) {

                var GetSucessResult = JSON.parse(result);

                if (GetSucessResult != undefined) {

                    if (GetSucessResult.Table0.length > 0) {
                        $('#hdnAWBSNo').val(GetSucessResult.Table0[0].Sno)
                        $("span#AWB").text(GetSucessResult.Table0[0].AWBNo);
                        $("#spnawb").text(GetSucessResult.Table0[0].AWBNo);
                        
                        $("span#Origin").text(GetSucessResult.Table0[0].OriginAirportcode);
                        $("span#Destination").text(GetSucessResult.Table0[0].DestinationAirportcode);
                        $("span#Pieces").text(GetSucessResult.Table0[0].TotalPieces);
                        $("span#FlightNo").text(GetSucessResult.Table0[0].FlightNo);
                        $("span#FlightDate").text(GetSucessResult.Table0[0].FlightDate );
                        $('span#GrosssWeight').text(GetSucessResult.Table0[0].TotalGrossWeight);

                        $("span#VolumeWeight").text(GetSucessResult.Table0[0].TotalVolumeWeight);
                        $("span#AgentName").text(GetSucessResult.Table0[0].Name);
                        $('#hdnOriginSNo').val(GetSucessResult.Table0[0].OriginSno);
                        $('#hdnDestinationSNo').val(GetSucessResult.Table0[0].DestinationSno);
                        $('#hdnAccountSNo').val(GetSucessResult.Table0[0].AccountSno);
                        if (GetSucessResult.Table0[0].Approval == "True")
                            $('#ApproveType').prop('checked', true);
                        else
                            $('#ApproveType1').prop('checked', true);
                        $('#Text_RemarksApproved').val(GetSucessResult.Table0[0].Remarks);

                    }

                }
            }
        });
    }
}


function SaveRush() {


   


    var Approve = $('input[type="radio"][name=Group]:checked').val();
    if (Approve == 'Yes') {
        Approve = '1'
    }
    else if (Approve == 'No') {
        Approve = '0'
    }
 
    var InList = [];
    var Array = {
        AWBSNo: $("#hdnAWBSNo").val(),
        AWBNo: $("#AWB").html(),
        Origin: $("#hdnOriginSNo").val(),
        Destination: $("#hdnDestinationSNo").val(),
        Account: $("#hdnAccountSNo").val() == '' ? '0' : $("#hdnAccountSNo").val(),
        Pieces: $("#Pieces").html() == '' ? '0' : $("#Pieces").html(),
        GrossWeight: $("#GrosssWeight").html() == '' ? '0' : $("#GrosssWeight").html(),
        VolumeWeight: $("#VolumeWeight").html() == '' ? '0' : $("#VolumeWeight").html(),
      
       
        FlightNo: $("#FlightNo").html() == '' ? '0' : $("#FlightNo").html(),
        FlightDate: $("#FlightDate").html() == '' ? '0' : $("#FlightDate").html(),
        ApproveStatus: Approve,
        Remarks: $("#Text_RemarksApproved").val() == '' ? '' : $("#Text_RemarksApproved").val()
        
    };

    InList.push(Array);


    var ActionType = getQueryStringValue("FormAction").toUpperCase()
    var ApproveType = Approve;
    AwbSno = $("#hdnAWBSNo").val();
    if (AwbSno != "") {

        $.ajax({
            url: "Services/Shipment/RushHandlingApprovalService.svc/UpdateRushHandlingApproval", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SNo: AwbSno, SaveRush: InList }),
            success: function (result) {


                //var GetSucessResult = JSON.parse(result).Table0[0].Column1;

               
                    if (JSON.parse(result).Table[0].Column1 == 0) {
                        setTimeout(function () {
                            navigateUrl('Default.cshtml?Module=Shipment&Apps=RushHandlingApproval&FormAction=INDEXVIEW');

                        }, 2000);
                        ShowMessage('success', 'Success - RushHandlingApproval', "Record updated successfully !");

                    }
                   
               
            }
        });
    }

}