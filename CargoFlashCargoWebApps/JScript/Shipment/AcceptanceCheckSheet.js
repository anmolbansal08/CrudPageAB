/// <reference path="../../Services/Shipment/AcceptanceCheckSheetService.svc" />
var headerHeight = 145;
var tableHeight = 500;
var i = 0;
var nextPage = 0;
var SPHC = 0;
$(document).ready(function () {
  
    var SPHCSNo = '';
    GetAcceptanceCheckSheetDetails();
   
    if (SPHCSNo != '') {
        i = 0;
        nextPage = 0;
        SPHC = 1;
        GetAcceptanceCheckSheetOtherDetails();
        
    }
    getfooter();
});

function GetAcceptanceCheckSheetDetails() {

    var awbSNo = "40386";//
    var startPage = '1';
    var pageSize = '400';
    var where = '';
    var orderBy = '';
    var checkListTypeSNo = '5';
    var SPHCSNo = '';
    $.ajax({
        url: "../../Services/Shipment/AcceptanceCheckSheetService.svc/GetAcceptanceCheckSheetRecordGeneral",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ pageNo: startPage, pageSize: pageSize, WhereCondition: where, orderBy: orderBy, awbSNo: awbSNo, checkListTypeSNo: checkListTypeSNo, SPHCSNo: SPHCSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                //CheckListHeader(FinalData);
                //PrintData(FinalData);
            }
        },
        error: function (err) {
            alert("Generated error" + err.status);
        }
    });

}
function GetAcceptanceCheckSheetOtherDetails() {
    var awbSNo = "";
    var startPage = '1';
    var pageSize = '400';
    var where = '';
    var orderBy = '';
    var checkListTypeSNo = '-1';
    var SPHCSNo = '';
    $.ajax({
        url: "../../Services/Shipment/AcceptanceCheckSheetService.svc/GetAcceptanceCheckSheetRecordOther",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ pageNo: startPage, pageSize: pageSize, WhereCondition: where, orderBy: orderBy, SPHCSNo: SPHCSNo, checkListTypeSNo: checkListTypeSNo }),  
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                //CheckListHeader1(FinalData);
                //PrintData(FinalData);
               // nextPageInfo(FinalData);
            }
        },
        error: function (err) {
            alert("Generated error");
        }
    });
}
function CheckListHeader() {
    var checkHeader = '';
    checkHeader += '<table><tr><td style=width:33%;></td><td colspan=2 ><strong>Acceptance Check Sheet-<span id=spnLiveAnml></span></strong></td></tr><tr><td style=width:33%;></td> <td style=width:33%;><strong><span id=spnLive></span></strong></td> <td style=width:33%;></td></tr> <tr> <td style=width:33%;>AWB No.:<span id="spnAWBNo"></span></td><td style=width:33%;>Origin:<span id=spnOrigin></span></td><td style=width:33%;>Destination:<span id=spnDestination></span></td> </tr> <tr> <td style=width:33%;>Via:<span id=spnVia></span></td> <td colspan=2>Flight/Date:<span id=spnDate></span></td> </tr> <tr><td colspan=3>Name of LCAG/Handling agent staff (Block Capitals):</td></tr><tr><td colspan=3><strong>Important:</strong> This check sheet does <strong>not</strong> replace the respective regulations of CHM/GHP!</td></tr> <tr><td colspan=3><hr /></td></tr></table> ';
    if ((nextPage == 0)&&(SPHC==0))
        $('#divHeader').append(checkHeader);
}

function CheckListHeader1() {
    if (SPHC == 1) {
        var setHeight = tableHeight-$("#leftTbl").height();
        $("#leftTbl").css("height", setHeight);
        $("#rightTbl").css("height", setHeight);
            var checkHeader = '';
            checkHeader += '<tr class=page-break><td style=width:33%;></td><td colspan=2 ><strong>Acceptance Check Sheet-<span id=spnLiveAnml></span></strong></td></tr><tr><td style=width:33%;></td> <td style=width:33%;><strong><span id=spnLive></span></strong></td> <td style=width:33%;></td></tr> <tr> <td style=width:33%;>AWB No.:<span id="spnAWBNo"></span></td><td style=width:33%;>Origin:<span id=spnOrigin></span></td><td style=width:33%;>Destination:<span id=spnDestination></span></td> </tr> <tr> <td style=width:33%;>Via:<span id=spnVia></span></td> <td colspan=2>Flight/Date:<span id=spnDate></span></td> </tr> <tr><td colspan=3>Name of LCAG/Handling agent staff (Block Capitals):</td></tr><tr><td colspan=3><strong>Important:</strong> This check sheet does <strong>not</strong> replace the respective regulations of CHM/GHP!</td></tr> <tr><td colspan=3><hr /></td></tr>';
            $('#divHeader').append(checkHeader);
    }
}

function PrintData(FinalData) {
    //var tbl = '';
    var checkFirstRow = 0;
    var checkBold = '<b>'
    var mainHead = 0;
    checkFirstRight = 0;
    
    for ( ; i < FinalData.length; i++) {
        tbl = '';
        if ($('#leftTbl').height() < 600) {

            if ((FinalData[i].Description).indexOf(checkBold) > -1) {
                if (checkFirstRow == 0) {
                    tbl += '<tr ><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                    mainHead++;
                    checkFirstRow++;
                }
                else {
                    tbl += '<tr><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;></td><td style=width:5px;></td><td style=width:5px;></td></tr>';
                    mainHead++;
                }
                $('#leftTbl').append(tbl);
            }
            else {
                tbl += '<tr ><td style=vertical-align:top;width:5px;>' + FinalData[i].SrNO + '</td><td>' + FinalData[i].Description + '</td>';
                if (FinalData[i].y == '1')
                    tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                if (FinalData[i].y == '')
                    tbl += '<td width=5px></td>';
                if (FinalData[i].y == '2')
                    tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                if (FinalData[i].N == '1')
                    tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                if (FinalData[i].N == '')
                    tbl += '<td width=5px></td>';
                if (FinalData[i].N == '2')
                    tbl += '<td><input type=checkbox checked=checked disabled=disabled></td>';
                if (FinalData[i].NA == '1')
                    tbl += '<td><input type=checkbox disabled=disabled></td>';
                if (FinalData[i].NA == '')
                    tbl += '<td width=5px></td>';
                if (FinalData[i].NA == '2')
                    tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                tbl += '</tr>'
                $('#leftTbl').append(tbl);
            }


        }
        else {
           
            if ($('#rightTbl').height() < 700) {
                // 
          
                if (checkFirstRight == 0) {
                    //  checkFirstRow = 0;+
                    tbl = '';
                    tbl += '<tr ><td style=width:5px;><strong></strong></td><td style=width:376px;><b></b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                    $('#rightTbl').append(tbl);
                    checkFirstRight++;
                    if ((FinalData[i].Description).indexOf(checkBold) > -1) {
                        if (checkFirstRow == 0) {
                            tbl += '<tr ><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                            mainHead++;
                            checkFirstRow++;
                            // $('#rightTbl').append(tbl);
                        }
                        else {
                            tbl += '<tr ><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;></td><td style=width:5px;></td><td style=width:5px;></td></tr>';
                            mainHead++;
                            $('#rightTbl').append(tbl);
                        }

                    }
                    else {
                        tbl = '';
                        tbl += '<tr ><td  style=vertical-align:top>' + FinalData[i].SrNO + '</td><td>' + FinalData[i].Description + '</td>';

                        if (FinalData[i].y == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].y == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].y == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].N == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].N == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].N == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].NA == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].NA == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].NA == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        tbl += '</tr>'
                        $('#rightTbl').append(tbl);
                    }

                }
                else {
                    if ((FinalData[i].Description).indexOf(checkBold) > -1) {
                        if (checkFirstRow == 0) {
                            tbl += '<tr ><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                            mainHead++;
                            checkFirstRow++;
                        }
                        else {
                            tbl += '<tr ><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;></td><td style=width:5px;></td><td style=width:5px;></td></tr>';
                            mainHead++;
                        }
                        $('#rightTbl').append(tbl);
                    }
                    else {

                        tbl += '<tr ><td  style=vertical-align:top>' + FinalData[i].SrNO + '</td><td>' + FinalData[i].Description + '</td>';

                        if (FinalData[i].y == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].y == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].y == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].N == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].N == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].N == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].NA == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].NA == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].NA == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        tbl += '</tr>'
                        $('#rightTbl').append(tbl);

                    }

                }
            }
            else {
                nextPage = 1;
                //break;
            }
        }
    }
    if (nextPage == 1) {
        nextPageInfo(FinalData)
    }
    if (nextPage == 0) {
        if (($('#leftTbl').height() < 700) && (i <= FinalData.length)) {
            tbl = '';
            tbl += '<tr height=30px><td colspan=5 ><strong>Comments/Remarks:</strong></td></tr>';
            tbl += '<tr height=10px><td colspan=5><strong>Company Name/Name of:</strong></td></tr>';
            tbl += '<tr height=20px><td colspan=5 >Shipper:</td></tr>';
            tbl += '<tr height=20px><td colspan=5 >Agent:</td></tr>';
            tbl += '<tr height=20px><td colspan=5 >Signature of LCAG/Handling agent staff:</td></tr>';
            tbl += '<tr height=5px><td colspan=5><hr/></td></tr>';
            //tbl += '<tr><td colspan=5></td></tr>'
            $('#leftTbl').append(tbl);
        }

        if (($('#rightTbl').height() > 100)&&($('#rightTbl').height() < 700) && (i < FinalData.length)) {
            tbl = '';
            tbl += '<tr height=30px><td colspan=5 ><strong>Comments/Remarks:</strong></td></tr>';
            tbl += '<tr height=10px><td colspan=5><strong>Company Name/Name of:</strong></td></tr>';
            tbl += '<tr height=20px><td colspan=5 >Shipper:</td></tr>';
            tbl += '<tr height=20px><td colspan=5 >Agent:</td></tr>';
            tbl += '<tr height=20px><td colspan=5 >Signature of LCAG/Handling agent staff:</td></tr>';
            tbl += '<tr ><td colspan=5><hr/></td></tr>';
            $('#rightTbl').append(tbl);
        }
        if (($('#rightTbl').height() > 700) && (i <= FinalData.length)) {

            nextPage = 1;
            nextPageInfo(FinalData);
        }

    }
    

}

function nextPageInfo(FinalData) {
    
    //CheckListHeader();
   
    $("#leftTbl").css("height", tableHeight + 700);
    if ((nextPage == 1) && (i == FinalData.length)) {
        tbl = '';
        tbl += '<tr height=30px><td colspan=5 ><strong>Comments/Remarks:</strong></td></tr>';
        tbl += '<tr height=10px><td colspan=5><strong>Company Name/Name of:</strong></td></tr>';
        tbl += '<tr height=20px><td colspan=5 >Shipper:</td></tr>';
        tbl += '<tr height=20px><td colspan=5 >Agent:</td></tr>';
        tbl += '<tr height=30px><td colspan=5 >Signature of LCAG/Handling agent staff:</td></tr>';
        tbl += '<tr height=5px><td colspan=5><hr/></td></tr>';
        tbl += '<tr><td colspan=5></td></tr>';
        $('#leftTbl').append(tbl);
    }
    for (; i < FinalData.length; i++) {
        tbl = '';
        if ($('#leftTbl').height() < tableHeight + 700) {
            if ((nextPage == 1) && (i == FinalData.length)) {
                tbl = '';
                tbl += '<tr height=30px><td colspan=5 ><strong>Comments/Remarks:</strong></td></tr>';
                tbl += '<tr height=10px><td colspan=5><strong>Company Name/Name of:</strong></td></tr>';
                tbl += '<tr height=20px><td colspan=5 >Shipper:</td></tr>';
                tbl += '<tr height=20px><td colspan=5 >Agent:</td></tr>';
                tbl += '<tr height=30px><td colspan=5 >Signature of LCAG/Handling agent staff:</td></tr>';
                tbl += '<tr height=5px><td colspan=5><hr/></td></tr>';
                tbl += '<tr><td colspan=5></td></tr>';
                $('#leftTbl').append(tbl);
               
            }
            if ((FinalData[i].Description).indexOf(checkBold) > -1) {
                if (checkFirstRow == 0) {
                    tbl += '<tr ><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                    mainHead++;
                    checkFirstRow++;
                }
                else {
                    tbl += '<tr ><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;></td><td style=width:5px;></td><td style=width:5px;></td></tr>';
                    mainHead++;
                }
                $('#leftTbl').append(tbl);
            }
            else {
                tbl += '<tr ><td style=vertical-align:top>' + FinalData[i].SrNO + '</td><td>' + FinalData[i].Description + '</td>';
                if (FinalData[i].y == '1')
                    tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                if (FinalData[i].y == '')
                    tbl += '<td width=5px></td>';
                if (FinalData[i].y == '2')
                    tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                if (FinalData[i].N == '1')
                    tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                if (FinalData[i].N == '')
                    tbl += '<td width=5px></td>';
                if (FinalData[i].N == '2')
                    tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                if (FinalData[i].NA == '1')
                    tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                if (FinalData[i].NA == '')
                    tbl += '<td></td>';
                if (FinalData[i].NA == '2')
                    tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                tbl += '</tr>'
                $('#leftTbl').append(tbl);
            }


        }
        else {
            $("#rightTbl").css("height", tableHeight + 700);
            if ((nextPage == 1) && (i == FinalData.length)) {
                tbl = '';
                tbl += '<tr height=30px><td colspan=5 ><strong>Comments/Remarks:</strong></td></tr>';
                tbl += '<tr height=10px><td colspan=5><strong>Company Name/Name of:</strong></td></tr>';
                tbl += '<tr height=20px><td colspan=5 >Shipper:</td></tr>';
                tbl += '<tr height=20px><td colspan=5 >Agent:</td></tr>';
                tbl += '<tr height=30px><td colspan=5 >Signature of LCAG/Handling agent staff:</td></tr>';
                tbl += '<tr height=5px><td colspan=5><hr/></td></tr>';
                tbl += '<tr><td colspan=5></td></tr>';
                $('#rightTbl').append(tbl);
            }
            if ($('#rightTbl').height() < tableHeight + 700) {
                // 
                if (checkFirstRight == 0) {
                    //  checkFirstRow = 0;+
                    tbl = '';
                    tbl += '<tr><td style=width:5px;><strong></strong></td><td style=width:376px;><b></b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                    $('#rightTbl').append(tbl);
                    checkFirstRight++;
                    if ((FinalData[i].Description).indexOf(checkBold) > -1) {
                        if (checkFirstRow == 0) {
                            tbl += '<tr><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                            mainHead++;
                            checkFirstRow++;
                            // $('#rightTbl').append(tbl);
                        }
                        else {
                            tbl += '<tr><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;></td><td style=width:5px;></td><td style=width:5px;></td></tr>';
                            mainHead++;
                            $('#rightTbl').append(tbl);
                        }

                    }
                    else {
                        tbl = '';
                        tbl += '<tr><td  style=vertical-align:top>' + FinalData[i].SrNO + '</td><td>' + FinalData[i].Description + '</td>';

                        if (FinalData[i].y == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].y == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].y == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].N == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].N == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].N == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].NA == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].NA == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].NA == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        tbl += '</tr>'
                        $('#rightTbl').append(tbl);
                    }

                }
                else {
                    if ((FinalData[i].Description).indexOf(checkBold) > -1) {
                        if (checkFirstRow == 0) {
                            tbl += '<tr><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;>Yes</td><td style=width:5px;>No</td><td style=width:5px;>N/A</td></tr>';
                            mainHead++;
                            checkFirstRow++;
                        }
                        else {
                            tbl += '<tr><td style=width:5px;><strong>' + (mainHead + 1) + '.</strong></td><td style=width:376px;><b>' + FinalData[i].Description + '</b></td><td style=width:5px;></td><td style=width:5px;></td><td style=width:5px;></td></tr>';
                            mainHead++;
                        }
                        $('#rightTbl').append(tbl);
                    }
                    else {

                        tbl += '<tr><td  style=vertical-align:top>' + FinalData[i].SrNO + '</td><td>' + FinalData[i].Description + '</td>';

                        if (FinalData[i].y == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].y == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].y == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].N == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].N == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].N == '2')
                            tbl += '<td><input type=checkbox checked=checked disabled=disabled></td>';
                        if (FinalData[i].NA == '1')
                            tbl += '<td width=5px><input type=checkbox disabled=disabled></td>';
                        if (FinalData[i].NA == '')
                            tbl += '<td width=5px></td>';
                        if (FinalData[i].NA == '2')
                            tbl += '<td width=5px><input type=checkbox checked=checked disabled=disabled></td>';
                        tbl += '</tr>'
                        $('#rightTbl').append(tbl);

                    }

                }
            }
            else {
                nextPage = 1;
                //break;
            }
        }
    }
    
    if ((nextPage == 1)&&i<FinalData.length) {
        nextPageInfo(FinalData)
    }
   

}

function getfooter()
{
    var SPHCSNo = getParameterByName("SSno", "");
    var awbSNo = getParameterByName("Sno", "");
    if (SPHCSNo == null)
        SPHCSNo = 0;
    $.ajax({
        url: "../../Services/Shipment/AcceptanceCheckSheetService.svc/GetAcceptanceCheckSheetRecordFooter",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ awbSNo: awbSNo, SPHCSNo: SPHCSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var ResultData = JSON.parse(result);
            FinalData = ResultData.Table0;
            ChargeData = ResultData.Table1;
            if (FinalData.length > 0) {
                $('#spnComment').text(FinalData[0].Comment);
                $("#spnChecked").text(FinalData[0].CheckedBy);
                $("#spnStation").text(FinalData[0].StationCode);
                $("#spnSignature").text('');
                $('#spnName').text(FinalData[0].Name);
                $("#spnTime").text(FinalData[0].Time);
                $("#spnDate").text(FinalData[0].Date);
                $('#spnShipper').text(FinalData[0].ShipperAgent);
            }
        },
            error: function (err) {
                alert("Generated error");
            }
        });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}