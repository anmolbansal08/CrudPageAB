var PageType;
var flage = true;

$(document).ready(function () {
    PageType = getQueryStringValue("FormAction").toUpperCase();
    $("#SCMDiscrepancyContainer").load("HtmlFiles/ULD/SCMDiscrepancy.html", onLoad);

});

function onLoad() {
    $("input[name='operation']").unbind("click").click(function () {
        debugger
        cfi.ValidateSubmitSection("tbl");
        dirtyForm.isDirty = false;//to track the changes
        if (!cfi.IsValidSubmitSection()) return false;


    });
    cfi.AutoCompleteV2("ScmRemarks", "Remarks", "Scm_SCMDiscrepancyRemakrks", null, "contains");
    cfi.AutoCompleteV2("ULDNumber", "uldno", "Scm_SCMDiscrepancyULDno", null, "contains", ",");

    ScmDetails()
    ScmDetailsAppendgrid()


}

function OnSelectScm() {

    ScmDetailsAppendgrid()

}

var ClosedDiscrepancy = 0
function ScmDetails() {

    $("#tbldiscrepancyDetails tbody").html('');
    $("#tblPrint tbody").html('');
    var tr = "", tr1 = "", tr2 = "";
    $.ajax({
        url: "Services/ULD/SCMDiscrepancyService.svc/ScmiscrepancyReportDetail?scmdiscrepancysno=" + getQueryStringValue("RecID").toUpperCase(),
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;

            $("#Airport").text("")
            $("#Airline").text("")
            $("#Date").text("")
            $("#Remarks").text("")
            $("#Airport1").text("")
            $("#Airline1").text("")
            $("#Date1").text("")
            $("#Remarks1").text("")
            if (FinalData.length > 0) {
                $("#Airport").text(FinalData[0].AirportName)
                $("#Airline").text(FinalData[0].AirlineName)
                $("#Date").text(FinalData[0].ScmDate)
                $("#Remarks").text(FinalData[0].Remarks)
                $("#Airport1").text(FinalData[0].AirportName)
                $("#Airline1").text(FinalData[0].AirlineName)
                $("#Date1").text(FinalData[0].ScmDate)
                $("#Remarks1").text(FinalData[0].Remarks)

            }
            var Disabled = "";
            if (FinalData.length > 0) {

                for (var i = 0; i < FinalData.length; i++) {
                    var ID2 = i + 1;
                    if (FinalData[i].IsClosedDiscrepancy == "True") {
                        $("#execute").attr("disabled", true)
                        ClosedDiscrepancy = "1";
                    }
                    //if (FinalData[i].SCMStatus == "" && FinalData[i].ProULD == "") {
                    //    $("#execute").attr("disabled", true)
                    //}
                }
            }

        }

    });
}

function BtnSearch()
{
    ScmDetailsAppendgrid()
}

function ScmDetailsAppendgrid() {

    var RecID = getQueryStringValue("RecID").toUpperCase()
    var GetVal = $("#ScmRemarks").val();
    var GetULD = $("#FieldKeyValuesULDNumber").text();
  

    $('#divUldDivtblScmDetails').remove();
    $("#ScmDv").append("<div id='divUldDivtblScmDetails' style='width:100%'><table id='TblDivUldDivtblScmDetails' style='width:100%;'></table></div>");
    $("#TblDivUldDivtblScmDetails").appendGrid({
        tableID: "TblDivUldDivtblScmDetails",
        contentEditable: true,
        isGetRecord: true,
        tableColume: "SNo,IsClosedDiscrepancy,EDI_SCMSno",
        masterTableSNo: RecID,
        currentPage: 1, itemsPerPage: 20, whereCondition: GetVal + '-' + GetULD, sort: "",
        servicePath: "./Services/ULD/SCMDiscrepancyService.svc",
        getRecordServiceMethod: "GetScmiscrepancyReportDetail",
        caption: "SCM DISCREPANCY",
        initRows: 1,
        columns: [
                  { name: "SNo", type: "hidden", },
                  { name: "IsClosedDiscrepancy", type: "hidden", },
                  { name: "EDI_SCMSno", type: "hidden", },

                  { name: 'currentinventory', display: 'CURRENT INVENTORY', type: 'label', ctrlCss: {}, },
                  { name: 'ReqULDs', display: 'RECEIVED', type: 'label', ctrlCss: {}, },
                  { name: 'ProULDs', display: 'PROCESS', type: 'label', ctrlCss: {}, },
                  { name: 'DisULDs', display: 'DISCREPANCY', type: 'label', ctrlCss: {}, },
                  { name: 'Remarks', display: 'REMARKS', type: 'label', ctrlCss: {}, },
                  { name: 'scmstatus', display: 'SCM STATUS', type: 'label', ctrlCss: {}, },
                  { name: 'InsertButton', display: '', type: 'label', ctrlCss: { width: '150px', }, },



        ],

        isPaging: true,
        isExtraPaging: true,
        isPageRefresh: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            InsertButton()
        }, rowUpdateExtraFunction: function (id) {
            InsertButton()
        },
    });


}

function InsertButton() {

    var Append = "";
    var ID2 = 0;
    var ClosedDiscrepancy = "0";
    setTimeout(function () {
        $("tr[id^='TblDivUldDivtblScmDetails_Row_']").each(function (row, tr) {
            ID2++;

            if ($(tr).find("label[id^='TblDivUldDivtblScmDetails_scmstatus_']").text().toUpperCase() == "ADJUSTED") {
                Append += "<input type='button' class='btn-success Adjust' id='Adjust-" + ID2 + "' onclick='Adjust(1)' value='A' title='Adjust' />&nbsp&nbsp"
                Append += "<input type='button'  disabled='disabled' class='btn-info Ignored' id='Ignored-" + ID2 + "' onclick='Ignored(2)' value='I' title='Ignored' />&nbsp&nbsp"
                Append += "<input type='button' disabled='disabled' class='btn-warning Lost' id='Lost-" + ID2 + "' onclick='Lost(3)' value='L' title='Lost' />&nbsp&nbsp"
                Append += "<input type='button' class='btn-danger HistoryDetails' id='HistoryDetails-" + ID2 + "' onclick='HistoryDetails(4)' value='D' title='History / Details' />"
            } else if ($(tr).find("label[id^='TblDivUldDivtblScmDetails_scmstatus_']").text().toUpperCase() == "IGNORED") {
                Append += "<input type='button'  disabled='disabled' class='btn-success Adjust' id='Adjust-" + ID2 + "' onclick='Adjust(1)' value='A' title='Adjust' />&nbsp&nbsp"
                Append += "<input type='button'  class='btn-info Ignored' id='Ignored-" + ID2 + "' onclick='Ignored(2)' value='I' title='Ignored' />&nbsp&nbsp"
                Append += "<input type='button' disabled='disabled' class='btn-warning Lost' id='Lost-" + ID2 + "' onclick='Lost(3)' value='L' title='Lost' />&nbsp&nbsp"
                Append += "<input type='button' class='btn-danger HistoryDetails' id='HistoryDetails-" + ID2 + "' onclick='HistoryDetails(4)' value='D' title='History / Details' />"
            }
            else if ($(tr).find("label[id^='TblDivUldDivtblScmDetails_scmstatus_']").text().toUpperCase() == "LOST ULD") {

                Append += "<input type='button'  disabled='disabled' class='btn-success Adjust' id='Adjust-" + ID2 + "' onclick='Adjust(1)' value='A' title='Adjust' />&nbsp&nbsp"
                Append += "<input type='button'  disabled='disabled' class='btn-info Ignored' id='Ignored-" + ID2 + "' onclick='Ignored(2)' value='I' title='Ignored' />&nbsp&nbsp"
                Append += "<input type='button'  class='btn-warning Lost' id='Lost-" + ID2 + "' onclick='Lost(3)' value='L' title='Lost' />&nbsp&nbsp"
                Append += "<input type='button' class='btn-danger HistoryDetails' id='HistoryDetails-" + ID2 + "' onclick='HistoryDetails(4)' value='D' title='History / Details' />"
            } else if ($(tr).find("label[id^='TblDivUldDivtblScmDetails_DisULDs_']").text().toUpperCase() == "") {
                Append += "<input type='button'  disabled='disabled' class='btn-success Adjust' id='Adjust-" + ID2 + "' onclick='Adjust(1)' value='A' title='Adjust' />&nbsp&nbsp"
                Append += "<input type='button'  disabled='disabled' class='btn-info Ignored' id='Ignored-" + ID2 + "' onclick='Ignored(2)' value='I' title='Ignored' />&nbsp&nbsp"
                Append += "<input type='button'  disabled='disabled' class='btn-warning Lost' id='Lost-" + ID2 + "' onclick='Lost(3)' value='L' title='Lost' />&nbsp&nbsp"
                Append += "<input type='button' class='btn-danger HistoryDetails' id='HistoryDetails-" + ID2 + "' onclick='HistoryDetails(4)' value='D' title='History / Details' />"
            } else {
                if ($(tr).find("label[id^='TblDivUldDivtblScmDetails_Remarks_']").text().toUpperCase() == "ULD STOCK DOES NOT EXIST") {
                    Append += "<input type='button' disabled='disabled'  class='btn-success Adjust' id='Adjust-" + ID2 + "' onclick='Adjust(1)' value='A' title='Adjust' />&nbsp&nbsp"
                } else {
                    Append += "<input type='button'   class='btn-success Adjust' id='Adjust-" + ID2 + "' onclick='Adjust(1)' value='A' title='Adjust' />&nbsp&nbsp"
                }
                Append += "<input type='button'   class='btn-info Ignored' id='Ignored-" + ID2 + "' onclick='Ignored(2)' value='I' title='Ignored' />&nbsp&nbsp"
                Append += "<input type='button'  class='btn-warning Lost' id='Lost-" + ID2 + "' onclick='Lost(3)' value='L' title='Lost' />&nbsp&nbsp"
                Append += "<input type='button' class='btn-danger HistoryDetails' id='HistoryDetails-" + ID2 + "' onclick='HistoryDetails(4)' value='D' title='History / Details' />"
            }




            $(tr).find("label[id^='TblDivUldDivtblScmDetails_InsertButton_']").closest('td').html('<div align="center">' + Append + '</div>');
            Append = "";

            if ($(tr).find("input[id^='TblDivUldDivtblScmDetails_IsClosedDiscrepancy_']").val().toUpperCase() == "TRUE") {
                $("#execute").attr("disabled", true)
                ClosedDiscrepancy = "1";

            }
            //if ($(tr).find("label[id^='TblDivUldDivtblScmDetails_scmstatus_']").text().toUpperCase() == "" && $(tr).find("label[id^='TblDivUldDivtblScmDetails_ProULDs_']").text().toUpperCase() == "") {
            //    $("#execute").attr("disabled", true)

            //}
        });

        if (PageType == "READ") {
            $(".Adjust").attr("disabled", true)
            $(".Ignored").attr("disabled", true)
            $(".Lost").attr("disabled", true)
            $("#execute").attr("disabled", true)
        } else if (ClosedDiscrepancy == "1") {
            $(".Adjust").attr("disabled", true)
            $(".Ignored").attr("disabled", true)
            $(".Lost").attr("disabled", true)
        }
        $("#TblDivUldDivtblScmDetails_btnAppendRow").hide()
        $("#TblDivUldDivtblScmDetails_btnRemoveLast").hide()
    }, 100)



}



function ScmUldDetails(UldID) {

    var ULD = $("#TblDivUldDivtblScmDetails_ReqULDs_" + UldID + "").text();
    if (ULD != "") {
        $("#tblULDDetails tbody").html('');
        var tr = "", tr1 = "", tr2 = "";
        $.ajax({
            url: "Services/ULD/SCMDiscrepancyService.svc/ScmUldDetail?ULDnumber=" + ULD,
            async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                var FinalData = ResultData.Table1;
                var Disabled = "";
                if (FinalData.length > 0) {
                    for (var i = 0; i < FinalData.length; i++) {
                        var ID2 = i + 1;

                        var FlightDate = "";
                        if (FinalData[i].FlightDate.trim().toUpperCase() == "01-JAN-1900".trim().toUpperCase()) {
                            FlightDate = "";
                        } else {
                            FlightDate = FinalData[i].FlightDate.trim().toUpperCase();
                        }

                        tr += "<tr><td>" + ID2 + "</td>"
                        tr += "<td>" + FinalData[i].FlightNo.trim().toUpperCase() + "</td>"
                        tr += "<td>" + FlightDate + "</td>"
                        tr += "<td>" + FinalData[i].CityCode + "</td>"
                        tr += "<td>" + FinalData[i].DestinationCity + "</td>"
                        tr += "<td>" + FinalData[i].UldStation + "</td>"
                        tr += "<td>" + FinalData[i].StageName + "</td>"
                        tr += "<td>" + FinalData[i].StageDate + "</td>"
                        tr += "<td>" + FinalData[i].EventDetails + "</td>"
                        tr += "<td>" + FinalData[i].EventDateTime + "</td>"
                        tr += "<td>" + FinalData[i].UserID + "</td>"
                        tr += "</tr>"
                    }
                    $("#tblULDDetails tbody").append(tr)

                    $("#PopDivULD").dialog({
                        modal: true,
                        draggable: true,
                        resizable: true,
                        position: ['center', 'top'],
                        show: 'blind',
                        hide: 'blind',
                        width: 1000,
                        height: 500,
                        title: "SCM DISCREPANCY",
                        dialogClass: 'ui-dialog-osx',
                        buttons: {
                            "Cancel": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                } else {

                    ShowMessage('warning', 'Information', "Record not found!", "bottom-right");
                    return;
                }
            }

        });
    }
}
$(document).on('click', '.Adjust', function () {
    var Idd = $(this).attr('id')
    var spIdd = Idd.split("-")
    Popup($(this).val(), spIdd[1])
});
$(document).on('click', '.Ignored', function () {
    var Idd = $(this).attr('id')
    var spIdd = Idd.split("-")
    Popup($(this).val(), spIdd[1])
});
$(document).on('click', '.Lost', function () {
    var Idd = $(this).attr('id')
    var spIdd = Idd.split("-")
    Popup($(this).val(), spIdd[1])
});
$(document).on('click', '.HistoryDetails', function () {
    var Idd = $(this).attr('id')
    var spIdd = Idd.split("-")

    ScmUldDetails(spIdd[1])



});

function Popup(id, ScmID) {
    $("#ConfSms").text("");
    var Vall = 0;
    if (id == "A") {
        $("#ConfSms").text("Are you sure Adjust this?");
        Vall = 1
    } else if (id == "I") {
        $("#ConfSms").text("Are you sure Ignore this?");
        Vall = 2
    } else if (id == "L") {
        $("#ConfSms").text("Are you sure Lost this?");
        Vall = 3
    }
    $("#PopDiv").dialog({
        modal: true,
        draggable: true,
        resizable: true,
        position: ['center', 'top'],
        show: 'blind',
        hide: 'blind',
        title: "Confirmation Required",
        dialogClass: 'ui-dialog-osx',
        buttons: {
            "Save": function () {

                var Close = this;
                AganUpdated(Vall, ScmID, Close)

            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
}


function AganUpdated(Vall, ScmID, Close) {


    var EdiScmID = $("#TblDivUldDivtblScmDetails_SNo_" + ScmID + "").val();
    if (EdiScmID != 0) {
        $.ajax({
            url: "Services/ULD/SCMDiscrepancyService.svc/ScmiCiscrepancytUpdate?id=" + EdiScmID + "&Type=" + Vall,
            async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                var FinalData = ResultData.Table0;
                if (FinalData[0].ReturnErrorNo == "102") {
                    ShowMessage('warning', 'Information', FinalData[0].ReMessage, "bottom-right");
                    $(Close).dialog("close");
                    return;
                } else if (FinalData[0].ReturnErrorNo == "101") {
                    ShowMessage('success', '', "Saved successfully...", "bottom-right");
                    $(Close).dialog("close");
                    ScmDetails()
                    ScmDetailsAppendgrid()
                    return;
                } else if (FinalData[0].ReturnErrorNo == "1") {
                    ShowMessage('warning', 'Information', "ULD Already Adjusted!", "bottom-right");
                    $(Close).dialog("close");
                    return;
                } else if (FinalData[0].ReturnErrorNo == "2") {
                    ShowMessage('warning', 'Information!', "ULD Already Ignored!", "bottom-right");
                    $(Close).dialog("close");
                    return;
                } else if (FinalData[0].ReturnErrorNo == "3") {
                    ShowMessage('warning', 'Information!', "ULD Already marked as Lost!", "bottom-right");
                    $(Close).dialog("close");
                    return;
                }
            }
        });
    }
}

function BtnReload() {

    ScmDetails()
    ScmDetailsAppendgrid()
}

$(document).on('click', '#Print', function () {


    var divContents = $("#PrintDiv").html();
    var printWindow = window.open('', '', 'height=400,width=1000');
    printWindow.document.write('<html><head><title>SCM DISCREPANCY</title>' + css + '');
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();


});
var css = ' <style>table.blueTable {  border: 1px solid #1C6EA4;background-color: #fcfdfd;width: 100%;text-align: left;border-collapse: collapse;}'
css += 'table.blueTable td, table.blueTable th {border: 1px solid #AAAAAA;padding: 3px 2px;}'
css += 'table.blueTable tbody td {font-size: 13px;text-align: center;}'
css += 'table.blueTable thead {background: #daecf4;border-bottom: 2px solid #444444;'
css += 'table.blueTable thead th {font-size: 11px;font-weight: bold;color: black;}'
css += '</style>'


$(document).on('click', '#ExportToExcel', function () {
    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
    //creating a temporary HTML link element (they support setting file names)
    var a = document.createElement('a');
    //getting data from our div that contains the HTML table
    var data_type = 'data:application/vnd.ms-excel;charset=utf-8';
    var table_html = $('#tblPrint')[0].outerHTML;
    a.href = data_type + ',' + encodeURIComponent('<html><head>' + css + '</' + 'head><body>' + table_html + '</body></html>');
    //setting the file name
    a.download = 'Scm Discrepancy' + postfix + '.xls';
    //triggering the function

    a.click();
    //just in case, prevent default behaviour
    e.preventDefault();

});


$(document).on('click', '#execute', function () {
    $("#ConfSms").text("");
    $("#ConfSms").text("Are you sure re execute  this SCM");

    $("#PopDiv").dialog({
        modal: true,
        draggable: true,
        resizable: true,
        position: ['center', 'top'],
        show: 'blind',
        hide: 'blind',
        title: "Confirmation Required",
        dialogClass: 'ui-dialog-osx',
        buttons: {
            "Save": function () {

                var Close = this;
                var EdiScmID = $("#TblDivUldDivtblScmDetails_EDI_SCMSno_1").val()
                reexecuteScm(EdiScmID, Close)

            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
});

function reexecuteScm(EdiScmID, Close) {
    if (EdiScmID != 0) {
        $.ajax({
            url: "Services/ULD/SCMDiscrepancyService.svc/reexecuteEdiScm?EdiScmID=" + EdiScmID,
            async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                var FinalData = ResultData.Table0;
                if (FinalData[0].ReturnErrorNo == "1") {
                    ShowMessage('success', '', "SCM Message Re-Executed Successfully.", "bottom-right");
                    $(Close).dialog("close");
                    ScmDetails()
                    ScmDetailsAppendgrid()
                    return;
                }
            }
        });
    }

}
function ExtraCondition(textId) {
   
    var filter = cfi.getFilter("AND");
    var getval = $("#TblDivUldDivtblScmDetails_EDI_SCMSno_1").val();
    if (textId == "Text_ULDNumber") {
        cfi.setFilter(filter, "edi_scmsno", "eq", getval);
        var KeyValueNameSearch = cfi.autoCompleteFilter(filter);
        return KeyValueNameSearch;
    }

  

}