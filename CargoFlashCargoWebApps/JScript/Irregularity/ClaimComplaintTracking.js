$(document).ready(function () {

   

    cfi.AutoCompleteV2("ClaimComplaintNo", "ClaimComplaintNo", "ClaimComplaintTracking_ComplaintNo", null, "contains");

    $('#btnSubmit').click(function () {
        var str = "";
       
        var claimcomplaint;
        
        if (cfi.IsValidSubmitSection()) {
            var ClaimComplaintNo = $('#ClaimComplaintNo').val();
            var BasedOn = parseInt($("input[name='BasedOn']:checked").val());

            if (BasedOn == 0)
            {
                claimcomplaint ="Claim";
                
            }
            else
            {
                claimcomplaint ="Complaint";

            }
          

            $.ajax({
                url: "../ClaimComplaintTracking/GetClaimComplaintTracking",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    BasedOn: BasedOn, ClaimComplaintNo: ClaimComplaintNo
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    $("#ClaimComplaintracking").html('');
                    var countmain = 0;
                    var count = 0;
                    var countforbkd = 0; var countforexe = 0; var countforrcs = 0; var countnexttd = 0;
                    var action = ""; var station = "";
                    var myData = jQuery.parseJSON(result.Result);
                    if (myData == null || myData == '') {
                        ShowMessage('warning', 'Claim/Complaint TRACKING', "Some Error Occured");
                        return;
                    }
                    if (myData.Table0.length > 0) {

                        str = '<ul id="AWBOuterSearchPanelBar">';
                        for (var i = 0; i < $.trim($("#Text_ClaimComplaintNo").val()).split(',').length; i++) {
                            var divmain = "divmain" + i;
                            var divsummary = "divsummmary" + i;
                            var divmile = "divmilestone" + i;
                            var divinfo = "divinfo" + i;
                            var divhistory = "divstatushistory" + i;
                            var divassignhistory = "divassignhistory" + i;
                            countmain = 0;
                            countnexttd = 0;
                            // create table for summary and awb details
                            for (var j = 0; j < myData.Table0.length; j++) {
                        
                                if (myData.Table0[j].ClaimComplaintNo == $.trim($("#Text_ClaimComplaintNo").val()).split(',')[i] || myData.Table0[j].ClaimComplaintNo == $.trim($("#Text_ClaimComplaintNo").text()).split(',')[i]) {
                                    if (countmain == 0) {
                                        str += '<li class="k-state-active"><b>' + claimcomplaint +' No:&nbsp<span id="AWBNoInput">' + myData.Table0[j].ClaimComplaintNo + '</strong></span></span></b><div id="' + divmain + '" style="width: 98%; margin-left: 15px;"><ul id="AWBInnerSearchpanelbar"' + count + '>';
                                        str += '<li class="k-state-active"><span><b>' + claimcomplaint +  ' Summary</b></span><div id="' + divsummary + '" style="width: 98%; margin-left: 15px;">'
                                
                                        for (var m = 0; m < myData.Table1.length;m++) {
                                            //if (myData.Table1[m].ClaimComplaintNo == myData.Table0[j].ClaimComplaintNo )
                                            //{
                                                //latest event
                                            str += '<table cellpadding="12"><tr><td><span style="color:red;"><strong>LATEST EVENT: <span style="color:blue;">' + myData.Table1[m].ClaimStatus + ' </span></strong></span><span><b>Your ' +claimcomplaint+ ' '
                                            var action = myData.Table1[m].ClaimStatus;
                                            if (BasedOn == 0) {
                                                switch (action) {
                                                    case ('APPROVED'):
                                                        str += 'has been Approved at ';
                                                        break;
                                                    case ('CLOSED'):
                                                        str += 'has been Closed at ';
                                                        break;
                                                    case ('INITIATED'):
                                                        str += 'has been Initiated at ';
                                                        break;
                                                    case ('INSURED'):
                                                        str += 'has been Insured at ';
                                                        break;
                                                    case ('OPEN'):
                                                        str += 'has Open at ';
                                                        break;
                                                    case ('REJECTED'):
                                                        str += 'has been Rejected at ';
                                                        break;
                                                    case ('SETTLED'):
                                                        str += 'has been Settled from ';
                                                        break;

                                                    default:
                                                        str += '';
                                                        break;

                                                }
                                            }

                                            else
                                            {

                                                switch (action) {

                                                    case ('RAISED'):
                                                        str += 'has been Raised at ';
                                                        break;
                                                 
                                                    case ('OPEN'): 
                                                        str += 'has been Open at ';
                                                        break;
                                                    case ('CLAIM RAISED'):
                                                        str += 'has been Claim Raised at ';
                                                        break;
                                                    case ('ASSIGNED'):
                                                        str += 'has been Assigned at ';
                                                        break;
                                                    case ('ACTION/IN PROGRESS'):
                                                        str += 'has Action/In Progress at ';
                                                        break;
                                                    case ('APPROVED'):
                                                        str += 'has been Approved at ';
                                                        break;
                                                    case ('CLOSED'):
                                                        str += 'has been Closed at ';
                                                        break;
                                                    case ('INITIATED'):
                                                        str += 'has been Initiated at ';
                                                        break;
                                                    case ('INSURED'):
                                                        str += 'has been Insured at ';
                                                        break;
                                                    
                                                    case ('REJECTED'):
                                                        str += 'has been Rejected at ';
                                                        break;
                                                    case ('SETTLED'):
                                                        str += 'has been Settled from ';
                                                        break;
                                                   

                                                    default:
                                                        str += '';
                                                        break;

                                                }

                                            }
                                                str +=  myData.Table1[m].ActionDate + '</b></span></td></tr></table>';
                                            //}
                                        }
                                       
                                    }
                                    
                                }
                            } str += "</tbody></table>"

                            str += '</div></li>';
                            countmain = 0;
                            countAPPROVED = 0; countCLOSED = 0; countINITIATED = 0; countINSURED = 0; countOPEN = 0; countREJECTED = 0; countSETTLED = 0; countCLAIMRAISED = 0;
                            countASSIGNED = 0; countACTIONINPROGRESS = 0; countRAISED = 0;
                            // create table for milestone plan
                            for (var l = 0; l < myData.Table2.length; l++) {
                       

                                //if (myData.Table2[l].AWBNo == $.trim($("#ClaimComplaintNo").text()).split(',')[i] ) {
                                    if (countmain == 0) {
                                        //milestone plan table only 1st iteration
                                        str += '<li class="k-state-active"><span><b>Milestone Plan</b></span><div id="' + divmile + '" style="width: 98%; margin-left: 15px;">'
                                        str += '<div id="milestoneinner" style = "text-align: -webkit-center;">'
                                        str += '<table ><tr >'
                                
                                    }

                                    if (BasedOn == 0) {

                                        if (countAPPROVED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'APPROVED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countAPPROVED = 1;
                                        }
                                        if (countCLOSED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'CLOSED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countCLOSED = 1;
                                        }
                                        if (countINITIATED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'INITIATED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countINITIATED = 1;
                                        }
                                        if (countINSURED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'INSURED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countINSURED = 1;
                                        }
                                        if (countOPEN == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'OPEN') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countOPEN = 1;
                                        }

                                        if (countREJECTED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'REJECTED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countREJECTED = 1;
                                        }

                                        if (countSETTLED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'SETTLED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countSETTLED = 1;
                                        }
                                       


                                    }

                                    else
                                    {
                                        if (countRAISED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'RAISED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countRAISED = 1;
                                        }

                                        if (countOPEN == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'OPEN')
                                        {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countOPEN = 1;
                                        }
                                        if (countCLAIMRAISED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'CLAIM RAISED') {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countCLAIMRAISED = 1;
                                        }
                                        if (countASSIGNED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'ASSIGNED')
                                          {
                                            action = myData.Table2[l].ClaimStatus.toUpperCase();
                                            //station = myData.Table2[l].Station;
                                            countASSIGNED = 1;
                                        }
                                        if (countACTIONINPROGRESS == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'ACTION/IN PROGRESS')
                                          {
                                              action ="ACTIONINPROGRESS";
                                            //station = myData.Table2[l].Station;
                                              countACTIONINPROGRESS = 1;
                                          }

                                        if (countAPPROVED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'APPROVED') {
                                              action = myData.Table2[l].ClaimStatus.toUpperCase();
                                              //station = myData.Table2[l].Station;
                                              countAPPROVED = 1;
                                          }
                                        if (countCLOSED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'CLOSED') {
                                              action = myData.Table2[l].ClaimStatus.toUpperCase();
                                              //station = myData.Table2[l].Station;
                                              countCLOSED = 1;
                                          }
                                        if (countINITIATED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'INITIATED') {
                                              action = myData.Table2[l].ClaimStatus.toUpperCase();
                                              //station = myData.Table2[l].Station;
                                              countINITIATED = 1;
                                          }
                                        if (countINSURED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'INSURED') {
                                              action = myData.Table2[l].ClaimStatus.toUpperCase();
                                              //station = myData.Table2[l].Station;
                                              countINSURED = 1;
                                          }

                                        if (countREJECTED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'REJECTED') {
                                              action = myData.Table2[l].ClaimStatus.toUpperCase();
                                              //station = myData.Table2[l].Station;
                                              countREJECTED = 1;
                                          }

                                        if (countSETTLED == 0 && myData.Table2[l].ClaimStatus.toUpperCase() == 'SETTLED') {
                                              action = myData.Table2[l].ClaimStatus.toUpperCase();
                                              //station = myData.Table2[l].Station;
                                              countSETTLED = 1;
                                          }

                                    }
                                    //if (myData.Table2[l].ClaimStatus.toUpperCase() == action)
                                    //{
                                    //    myData.Table2[l].ClaimStatus = action;
                                     
                                
                                    //    continue;
                                    //}
                                    // to not get the arrow image first time
                                    if (countmain != 0 ) {
                                        str += '<td style="text-align:center;padding:2px;"><img style="width:80px;"  src="../images/arrowtrack.png" alt=""></td>'
                                    }
                                    countmain = 1;
                                    if (countnexttd % 9 == 0 && countnexttd>0) {
                                        str += '</tr><tr>'
                                    }
                                    if (BasedOn == 0) {
                                        str += '<td style="text-align:center;padding:2px;"><p ><b>' + myData.Table2[l].Station + '</b></p><div style="position: relative;width:100%; "><img style="width:80px;height:60px;"   src="../images/Claim/' + myData.Table2[l].ClaimStatus.toUpperCase() + ".png" + '" alt=""></div>'
                                        str += '<p ><b>' + myData.Table2[l].ClaimStatus.toUpperCase() + '</b></p><p ><b>' + myData.Table2[l].ActionDate + '</b></p><p><b>' + myData.Table2[l].Piecesweight + ' Pcs/Wt.' + '</b></p></td>'
                                    }
                                   
                                    else

                                    {
                                        str += '<td style="text-align:center;padding:2px;"><p ><b>' + myData.Table2[l].Station + '</b></p><div style="position: relative;width:100%; "><img style="width:80px;height:60px;"   src="../images/Complaint/' + action + ".png" + '" alt=""></div>'
                                        str += '<p ><b>' + myData.Table2[l].ClaimStatus.toUpperCase() + '</b></p><p ><b>' + myData.Table2[l].ActionDate + '</b></p></td>'
                                    }
                                    countnexttd += 1;
                           
                                //}
                                    //if (BasedOn == 0) {
                                    //    str += '<td style="text-align:center;padding:2px;"><p ><b>' + myData.Table2[l].Station + '</b></p><div style="position: relative;width:100%; "><img style="width:120px;height:100px;"   src="../images/Claim/' + myData.Table2[l].ClaimStatus.toUpperCase() + ".png" + '" alt="confirm order"><h2 style="position: absolute;top: 25px; float:left; margin-left:0px;width: 100%;font-size:10px;font-weight:bold;color: white; ">' + myData.Table2[l].ClaimStatus.toUpperCase() + '</h2></div>'
                                    //    str += '<p ><b>' + myData.Table2[l].ActionDate + '</b></p><p><b>' + myData.Table2[l].Piecesweight + ' Pcs/Wt.' + '</b></p></td>'
                                    //}
                            } str += '</tr></table></div></ul></div></li>';
                            //countmain = 0;
                            //// create table for  flight details
                            //for (var k = 0; k < myData.Table2.length; k++) {
                                
                            //    //flight details table only 1st iteration
                            //    if (BasedOn==0)
                            //    {
                            //        if (countmain == 0) {
                            //            str += '<li class="k-state-active"><span><b>' + claimcomplaint + ' Action Details</b></span><div id="' + divhistory + '" style="width: 98%; margin-left: 15px; ">'
                            //            str += "<table id='tblstatus' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='11%' ><strong><b>Claim Action</b></strong></td><td align='center' width='11%' ><strong><b>Action Date</b></strong></td><td align='center' width='11%'><strong><b>Description</b></strong></td><td align='center' width='12%'><strong><b>EmailId</b></strong></td><td align='center' width='11%'><strong><b>Status</b></strong></td><td align='center' width='11%'><strong><b>ClaimAmount</b></strong></td><td align='center' width='11%' ><strong><b>MaximumLiability</b></strong></td><td align='center' width='11%' ><strong><b>ApprovedAmount</b></strong></td><td align='center' width='11%'><strong><b>Raised By</b></strong></td></tr>"
                            //            countmain += 1;
                            //        }

                            //        str += "<tr style='background-color: #eae7e7;'><td align='center' width='11%' >" + myData.Table2[k].ClaimActionName + "</td><td align='center' width='11%'>" + myData.Table2[k].ActionDate + "</td><td align='center' width='11%'>" + myData.Table2[k].ActionDescription + "</td><td align='center' width='12%'>" + myData.Table2[k].EmailID + "</td><td align='center' width='11%'>" + myData.Table2[k].ClaimStatus + "</td><td align='center' width='11%'>" + myData.Table2[k].ClaimAmount + "</td><td align='center' width='11%' >" + myData.Table2[k].MaxLiability + "</td><td align='center' width='11%' >" + myData.Table2[k].ApprovedAmount + "</td><td align='center' width='11%'>" + myData.Table2[k].RaisedBy + "</td></tr>"
                            //    }
                            //    else
                            //    {



                            //        if (countmain == 0) {
                            //            str += '<li class="k-state-active"><span><b>' + claimcomplaint + ' Action Details</b></span><div id="' + divhistory + '" style="width: 98%; margin-left: 15px; ">'
                            //            str += "<table id='tblstatus' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='11%' ><strong><b>Complaint Action</b></strong></td><td align='center' width='11%' ><strong><b>Action Date</b></strong></td><td align='center' width='11%'><strong><b>Description</b></strong></td><td align='center' width='12%'><strong><b>ComplaintStatus</b></strong></td><td align='center' width='11%'><strong><b>Notify Email</b></strong></td><td align='center' width='11%'><strong><b>Raised By</b></strong></td></tr>"
                            //            countmain += 1;
                            //        }

                            //        str += "<tr style='background-color: #eae7e7;'><td align='center' width='11%' >" + myData.Table2[k].ComplaintActionName + "</td><td align='center' width='11%'>" + myData.Table2[k].ActionDate + "</td><td align='center' width='11%'>" + myData.Table2[k].ActionDescription + "</td><td align='center' width='12%'>" + myData.Table2[k].ClaimStatus + "</td><td align='center' width='11%'>" + myData.Table2[k].EmailId + "</td><td align='center' width='11%'>" + myData.Table2[k].RaisedBy + "</td></tr>"




                            //    }
                            //}
                            //str += "</tbody></table>"

                            //str += '</div></li>';
                            //countmain = 0;
                            //// create table for  claim complaint assign details
                            //for (var k = 0; k < myData.Table3.length; k++) {

                            //    //flight details table only 1st iteration
                            //    if (BasedOn == 0) {
                            //        if (countmain == 0) {
                            //            str += '<li class="k-state-active"><span><b>' + claimcomplaint + ' Assign Details</b></span><div id="' + divassignhistory + '" style="width: 98%; margin-left: 15px; ">'
                            //            str += "<table id='tblstatus' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='11%' ><strong><b>Assigned City</b></strong></td><td align='center' width='11%' ><strong><b>Assigned User</b></strong></td><td align='center' width='11%'><strong><b>Assign Date</b></strong></td><td align='center' width='12%'><strong><b>Assign Message</b></strong></td><td align='center' width='11%'><strong><b>Assign By</b></strong></td></tr>"
                            //            countmain += 1;
                            //        }

                            //        str += "<tr style='background-color: #eae7e7;'><td align='center' width='11%' >" + myData.Table3[k].CityName + "</td><td align='center' width='11%' >" + myData.Table3[k].UserName + "</td><td align='center' width='11%'>" + myData.Table3[k].AssignDate + "</td><td align='center' width='11%'>" + myData.Table3[k].AssignMessage + "</td><td align='center' width='12%'>" + myData.Table3[k].CreatedBy + "</td></tr>"
                            //    }
                            //    else {



                            //        if (countmain == 0) {
                            //            str += '<li class="k-state-active"><span><b>' + claimcomplaint + ' Assign Details</b></span><div id="' + divassignhistory + '" style="width: 98%; margin-left: 15px; ">'
                            //            str += "<table id='tblstatus' cellspacing='0' cellpadding='8' border='0' width='100%' align='center'><tbody><tr style='background-color:#bfbbbb; '><td align='center' width='11%' ><strong><b>Assigned City</b></strong></td><td align='center' width='11%' ><strong><b>Assigned User</b></strong></td><td align='center' width='11%'><strong><b>Assign Date</b></strong></td><td align='center' width='12%'><strong><b>Assign Message</b></strong></td><td align='center' width='11%'><strong><b>Assign By</b></strong></td></tr>"
                            //            countmain += 1;
                            //        }

                            //        str += "<tr style='background-color: #eae7e7;'><td align='center' width='11%' >" + myData.Table3[k].CityName + "</td><td align='center' width='11%' >" + myData.Table3[k].UserName + "</td><td align='center' width='11%'>" + myData.Table3[k].AssignDate + "</td><td align='center' width='11%'>" + myData.Table3[k].AssignMessage + "</td><td align='center' width='12%'>" + myData.Table3[k].CreatedBy + "</td></tr>"




                            //    }
                            //}
                            //str += "</tbody></table>"

                            //str += '</ul></div></li>';
                    
                        }
                        str += "</ul>";
                        $("#ClaimComplaintracking").append(str);
                        $("#tblbkdrcs tr:odd,#tblstatus tr:odd").css("background-color", "#ffffff");
                        $("#AWBOuterSearchPanelBar").kendoPanelBar();
                        $("[id^=AWBInnerSearchpanelbar]").kendoPanelBar();

                    }
                    else {
                        $("#tbl").html('');
                        ShowMessage('warning', 'Claim/Complaint Tracking', "No Record Found");
                    }

                },
                error: function (xhr) {
                    var a = "";
                }

            });
        }
    });
});






function ExtraCondition(textId) {

    var filterEmbargo = cfi.getFilter("AND");

    var BasedOn = parseInt($("input[name='BasedOn']:checked").val());

    
    //var filterEmbargo1 = cfi.getFilter("OR");
    //StatusOfClaim
    //if (textId == "Text_BranchOffice") {

    //    cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
    //    //cfi.setFilter(filterEmbargo, "IsHeadOffice", "eq", 0);
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //    return OriginCityAutoCompleteFilter2;

    //}

    if (textId=="Text_ClaimComplaintNo") {

        cfi.setFilter(filterEmbargo, "Isclaimcomplaint", "eq", BasedOn);
        //cfi.setFilter(filterEmbargo, "ApplicationSNo", "eq", 6);
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;

    }

}
