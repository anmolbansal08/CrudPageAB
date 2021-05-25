///*
//*****************************************************************************
//Javascript Name:	AircraftDimensionMatrix.JS     
//Purpose:		    This JS used to get Grid Data for AircraftDimensionMatrix.
//Company:		    CargoFlash Infotech Pvt Ltd.
//Author:			    Laxmikanta Pradhan
//Created On:		    3rd jan 2016
//Updated By:           Arman Ali 
//Updated On:	        23 Mar, 2017
//Approved By:        
//Approved On:	
// purpose   :         for generating matrix before saving record and add css for generate button
//*****************************************************************************
//*/
//var bt = null;


    cfi.ValidateForm();
    var holdtypelist = [{ Key: "0", Text: "Max FWD" }, { Key: "1", Text: "Long FWD" }, { Key: "2", Text: "Max AFT" }, { Key: "3", Text: "Long AFT" }]

    cfi.AutoCompleteV2("Aircraft", "AircraftType", "AircraftDimensionMatrix_Aircraft", null, "contains");

    cfi.AutoCompleteByDataSource("HoldType", holdtypelist);
    $('#aspnetForm').attr("enctype", "multipart/form-data");
  //================= Added by arman Ali===============================
    $("#Cols").after('&nbsp; &nbsp; &nbsp;' + '<input type="button" name="Generate" id="Generate" value="Generate">')
 
    $('#Generate').addClass('btn btn-inverse');
    $('#Generate').attr('style', 'width: 125px, display: block');
    //==========================end====================================

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $('#Generate').toggle(false);
        $('#MasterDuplicate').toggle(false);

        readAircraftMatrixData();
    }
    //if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
    //    $("#Cols").after('<input type="button" name="Generate" id="Generate" value="Generate">')
    //}
    //if (bt == 1) {
    //    $("#Cols").after('<input type="button" name="Generate" id="Generate" value="Generate">')
    //}



    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('#Generate').toggle(false);
        EidtAircraftMatrixData();
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        $('#Generate').toggle(false);
        //EidtAircraftMatrixData();
        readAircraftMatrixData();
    }
    //cfi.ResetAutoComplete("tblAirCraftULD_ContourType_");
   


function createTable(x, y) {
    var divelement, fldElement, lgndElemnet, tableElement, rowElement, colElement, input;
    //a = document.getElementById($('#Rows'));
    //b = document.getElementById($('#Cols'));

    if (x == "" || y == "") {
        alert("Please Enter Some Numeric Values");
    }
    else {
        divelement = document.createElement('div');
        divelement.id = 'divmatrix';
        fldElement = document.createElement('fieldset')
        fldElement.id = 'fldmatrix';
        lgndElemnet = document.createElement('legend');
        fldElement.appendChild(lgndElemnet);
        //divelement.appendChild(fldElement);
        tableElement = document.createElement('table');
        tableElement.id = 'tblmatrix';
        tableElement.align = "center";
        for (var i = 0; i < x; i++) {
            rowElement = document.createElement('tr');

            for (var j = 0; j < y; j++) {
                colElement = document.createElement('td');

                if (j == 0 && i == 0) {
                    //$("#td").append('<label for="Height">Height</label>');
                    //var $label = $("<label>").text('Height');

                    input = document.createElement('input');
                    input.type = "text";

                    input.style.width = '50px';
                    input.id = 'txt' + i + j;
                    //input.appendChild($label);
                    colElement.appendChild(input);
                    //colElement.appendChild($label);
                    rowElement.appendChild(colElement);
                    tableElement.appendChild(rowElement);
                    fldElement.appendChild(tableElement);
                    divelement.appendChild(fldElement);
                    //$('#txt' + i + j).val("Height");
                    //input.id.val("Height");
                    //$('#txt00').val('height');
                    //$('#txt' + i + j).val('Height');
                    input.readOnly = true;
                }
                else {
                    input = document.createElement('input');
                    //input.type = "text";
                    input.type = "number";
                    input.style.width = '50px';
                    input.id = 'txt' + i + j;
                    input.maxLength = 2;
                    input.defaultValue = 0;
                    input.oninput = "javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    colElement.appendChild(input);
                    rowElement.appendChild(colElement);
                    tableElement.appendChild(rowElement);
                    fldElement.appendChild(tableElement);
                    divelement.appendChild(fldElement);
                    //input.readOnly = true;
                }

                //var input = document.createElement('input');
                //input.type = "text";
                //input.style.width = '50px';
                //input.id = 'txt' + i + j;
                //colElement.appendChild(input);
                //colElement.appendChild(document.createTextNode(j + 1));
                //rowElement.appendChild(colElement);
            }

            //tableElement.appendChild(rowElement);
            //fldElement.appendChild(tableElement);
            //divelement.appendChild(fldElement);
        }

        document.body.appendChild(divelement);
    }
}
$('#Rows').blur(function(){
    if ($(this).val() < 1) {
        ShowMessage('info', 'Need your Kind Attention!', "Rows should be greater than zero");
        $(this).val('');
    }
});

$('#Cols').blur(function () {
    if ($(this).val() < 1) {
        ShowMessage('info', 'Need your Kind Attention!', "Columns should be greater than zero");
        $(this).val('');
    }
});
 
$(document).on("click", "#Generate", function () {
    //alert("Hii...");
    var a, b;
    a = document.getElementById('Rows').value;
    b = document.getElementById('Cols').value;

    if ($('#tblmatrix').length) {
        $('#tblmatrix').remove();
        $('#divmatrix').remove();
        $('#fldmatrix').remove();
        createTable(a, b);
    }
    else {
        createTable(a, b);
    }
    //$('#txt00').readOnly = true;
    $('#txt00').val('Height');

});

//$('#Cols').blur(function () {

//    var a, b;
//    a = document.getElementById('Rows').value;
//    b = document.getElementById('Cols').value;

//    if ($('#tblmatrix').length) {
//        $('#tblmatrix').remove();
//        $('#divmatrix').remove();
//        $('#fldmatrix').remove();
//        createTable(a, b);
//    }
//    else {
//        createTable(a, b);
//    }

//});
//================= Added by arman Ali=============================================================================================
$('input[type="submit"][name="operation"][value="Save"]').click(function () {
    if ($('#tblmatrix tr').length < 1) {
        ShowMessage('info', 'Need your Kind Attention!', "Please Generate Matrix Before Saving Record.");
        $("#Generate").focus();
        return false;
    }
    else
        saveAircraftMatrixData();
  
});

$('input[type="submit"][name="operation"][value="Save & New"]').click(function () {
    if ($('#tblmatrix tr').length < 1) {
        ShowMessage('info', 'Need your Kind Attention!', "Please Generate Matrix Before Saving Record.");
        $("#Generate").focus();
        return false;
    }
    else
        saveAircraftMatrixData();
});
$('input[type="submit"][name="operation"][value="Update"]').click(function () {
    if ($('#tblmatrix tr').length < 1) {
        ShowMessage('info', 'Need your Kind Attention!', "Please Generate Matrix Before Updating Record.");
        $("#Generate").focus();
  
        return false;
    }
    else
        UpdateAircraftMatrixData();

    //var KeyValue = "";
    //var KeyColumn = "Aircraft Dimension Matrix";
    //KeyValue = document.getElementById('__SpanHeader__').innerText
    //var SKeyValue = KeyValue.split(':')

    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

    //    AuditLogSaveNewValue("tbl", true, '', KeyColumn, SKeyValue[1]);
    //}
});

//=======================================================End here===========================================================================

function prevent() {
    $('#aspnetForm').on('submit', function (e) {
        e.preventDefault();
    });
}

function getGrid() {
    $.ajax({
        url: "./Services/Master/AircraftDimensionMatrixService.svc/GetGridData", async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ skip: 0, take: 10, page: 1, pageSize: 10, sort: null, filter: null }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MsgTable = jQuery.parseJSON(result);
            var BasicData = MsgTable.Table0;
          
            if (BasicData.length > 0) {
               
            }
            //if (MatrixData.length > 0) {
            //    createTable(rowcount, columncount);
            //    for (var p = 0; p < rowcount; p++) {
            //        for (var q = 0; q < columncount; q++) {
            //            //$('#txt' + p + q).text(MatrixData);
            //            if (q == 0 && p == 0) {
            //                $('#txt' + p + q).val("Height");
            //            }
            //            else {
            //                i++;
            //                $('#txt' + p + q).val(MatrixData[i].CellValue);
            //            }
            //        }
            //    }

            //}
        }
    });
}

function saveAircraftMatrixData() {
    $("#Text_Aircraft").attr('data-valid', 'required');
    $("#Text_HoldType").attr('data-valid', 'required');
    //if (cfi.IsValidTransSection('divareaTrans_buildup_agentbuilduptrans')) {

    //    $('#dvMessageTable').html('');
    if ($('#Aircraft').val() == "") {
        Model.push("0");
    }
    if ($('#HoldType').val() == "") {
        Model.push("0","0");
    }
    if ($('#Rows').val() == "") {
        Model.push("0","0","0");
    }
    if ($('#Cols').val() == "") {
        Model.push("0", "0", "0","0");
    }
    var a, b, ADRowNo, ADColNo, CellValue, AircraftSNo, HoldType, Unit, CreatedBy, UpdatedBy;
    var Length, Width, Height, UpdatedUser, adrowno, adcolno, Rows, Cols;
    var Model = [];
    var TransModel = [];
    var MatrixTransValModel = [];

    if (Model == "" && Model == null) {
      
        //Model.push(
        //{
        //    AircraftSNo: 0,
        //    HoldType: 0,
        //    //Unit: document.getElementById('Unit').value,    
        //    Unit: 0,
        //    Rows: 0,
        //    Cols: 0,
        //    CreatedBy: userContext.UserSNo,
        //    UpdatedBy: userContext.UserSNo,
        //}
        //);
    }
    else {
        Model.push(
        {
            AircraftSNo: $("#Text_Aircraft").data("kendoAutoComplete").key(),
            HoldType: $("#Text_HoldType").data("kendoAutoComplete").key(),
            //Unit: document.getElementById('Unit').value,    
            Unit: $("input[name='Unit']:checked").val(),
            Rows: document.getElementById('Rows').value,
            Cols: document.getElementById('Cols').value,
            CreatedBy: userContext.UserSNo,
            UpdatedBy: userContext.UserSNo,
        }
        );
    }

    if ($('#Rows').val() == " ") {
        a = 0
    }
    else {
        a = $('#Rows').val();
    }
    if ($('#Cols').val() == " ") {
        b = 0
    }
    else {
        b = $('#Cols').val();
    }

    //if (document.getElementById('Rows').value = " ") {
    //    a = 0
    //}
    //else {
    //    a = document.getElementById('Rows').value;
    //}
    //if (document.getElementById('Cols').value = " ") {
    //    b = 0
    //}
    //else {
    //    b = document.getElementById('Cols').value;
    //}
    //a = document.getElementById('Rows').value;
    //b = document.getElementById('Cols').value;

    // ********************* For AircraftDimensionMatrix and AircraftDimensionTrans table ********************
    for (var x = 0; x < a; x++) {
        for (var y = 0; y < b; y++) {
            ADRowNo = x;
            ADColNo = y;

            if (x == 0 && y == 0) {
                //x++;
                //y++;
                MatrixTransValModel.push(
                   {
                       //adrowno: x,
                       //adcolno: y,
                       //CellValue: 0,
                       Length: 0,
                       Height: 0,
                       Width: 0,
                       UpdatedBy: userContext.UserSNo,
                   }
                   );
            }
            else if (x == 0) {
                //x++;
                //y++;
                MatrixTransValModel.push(
                      {
                          //adrowno: x,
                          //adcolno: y,
                          //CellValue: $('#txt' + x + y).val(),
                          Length: 0,
                          Height: 0,
                          //Width: $('#txt' + 0 + y).val(),.
                          Width: 0,
                          UpdatedBy: userContext.UserSNo,
                      }
                      );
            }
            else if (y == 0) {
                //x++;
                //y++;
                MatrixTransValModel.push(
                  {
                      //adrowno: x,
                      //adcolno: y,

                      Length: 0,
                      //Height: $('#txt' + x + 0).val(),
                      Height: 0,
                      Width: 0,
                      UpdatedBy: userContext.UserSNo,
                  }
                  );
            }
            else {
                MatrixTransValModel.push(
                 {
                     // adrowno: x,
                     //ADColNo: y,
                     //CellValue: $('#txt' + x + y).val(),
                     Length: $('#txt' + x + y).val(),
                     Height: $('#txt' + x + 0).val(),
                     Width: $('#txt' + 0 + y).val(),
                     UpdatedBy: userContext.UserSNo,
                 }
               );
            }
        }
    }
    // *************** ENd ************************

    // ********************* For Only AircraftDimensionMatrix table ***************************
    for (var x = 0; x < a; x++) {
        for (var y = 0; y < b; y++) {
            ADRowNo = x;
            ADColNo = y;
            if (x == 0 && y == 0) {
                TransModel.push(
                   {
                       ADRowNo: x,
                       ADColNo: y,
                       CellValue: 0,
                   }
                   );
            }
            else {
                var yourInput = $('#txt' + x + y).val();
                re = /[aA-zZ`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
                var isSplChar = re.test(yourInput);
                if (isSplChar) {
                    //  var no_spl_char = yourInput.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                    //$(this).val(no_spl_char);
                    //ShowMessage('warning', 'warning - Information', "This Record is Alredy Exits..", "bottom-right");
                    //alert('Characters and Special Character are not allowed..');
                }
                else {
                    TransModel.push(
                       {
                           ADRowNo: x,
                           ADColNo: y,
                           CellValue: $('#txt' + x + y).val(),
                       }
                       );
                }

                //var chkval = $('#txt' + x + y).val();
                //if(chkval.match())

                //TransModel.push(
                //   {
                //       ADRowNo: x,
                //       ADColNo: y,
                //       CellValue: $('#txt' + x + y).val(),
                //   }
                //   );
            }

        }
    }
    // *************** ENd ************************
    if (Model != "" && Model != null) {
        $.ajax({
            url: "./Services/Master/AircraftDimensionMatrixService.svc/SaveAircraftDimensionMatrix", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AircraftDimensionMatrix: Model, AircraftMatrixTransVal: TransModel, AircraftMatrixTrans: MatrixTransValModel }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].Column1 == 0) {
                    setTimeout(function () {
                        navigateUrl('Default.cshtml?Module=Master&Apps=AircraftDimensionMatrix&FormAction=INDEXVIEW');
                    }, 500);
                    ShowMessage('success', 'Success - Information', "Aircraft Dimension Matrix Saved Successfully", "bottom-right");
                   
                    ClearFields();
                    prevent();
                    //ShowMessage('success', 'Information', "Aircraft Dimension Matrix Saved Successfully");
                    //$("input[type='submit'][name='operation'][value='Save']").click(); // Saved message comming from Management WebUI
                }
                else if (MsgData[0].Column1 == 22) {
                    //alert('This Record is Alredy Exits..');
                    //ShowMessage('555', 'Information', "This Record is Alredy Exits..");
                    ShowMessage('warning', 'warning - Information', "This Record Already Exists", "bottom-right");
                    $('#Rows').val('');
                    $('#_tempRows').val('');
                    $('#_tempCols').val('');
                    prevent();
                    //e.preventDefault();
                    //return false;
                }
                else
                    //if (MsgData[0].Result == "Invalid")
                {
                    //var errorMessage = "Sorry There is Some Error During Saving the Data";
                    ShowMessage('warning', 'warning - Information', "Sorry There is Some Error During Saving the Data..", "bottom-right");

                }

            }

        });
    }
    else {
        cfi.ValidateForm();
    }
    
    //}
}

function ClearFields() {
    $('#Aircraft').val('');
    $("#Text_Aircraft").val('');
    $("#Text_Aircraft").removeAttr('data-valid');
    cfi.AutoCompleteV2("Aircraft", "AircraftType", "AircraftDimensionMatrix_Aircraft", null, "contains");
    $('#HoldType').val('');
    $("#Text_HoldType").val('');
    $("#Text_HoldType").removeAttr('data-valid');
    var holdtypelist = [{ Key: "0", Text: "Max FWD" }, { Key: "1", Text: "Long FWD" }, { Key: "2", Text: "Max AFT" }, { Key: "3", Text: "Long AFT" }]
    cfi.AutoCompleteByDataSource("HoldType", holdtypelist);
    $('#Rows').val("0");
    $('#Cols').val("0");
    if ($('#tblmatrix').length) {
        $('#tblmatrix').remove();
        $('#divmatrix').remove();
        $('#fldmatrix').remove();
       
    }
}

function readAircraftMatrixData() {
    //var obj = {};
    //obj.recid = $('#hdnAirCraftSNo').val();
    //obj.userid = userContext.UserSNo;
    var recid = $('#hdnAircraftSNo').val();
    var userid = userContext.UserSNo;
    var rowcount, columncount;
    var i = 0;
    //var userid = $('#hdnuserID').val();
    $.ajax({
        url: "./Services/Master/AircraftDimensionMatrixService.svc/GetAircraftDimensionMatrixRecord?RecordID=" + recid + "&UserSNo= " + userid, type: "get", async: false, dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MsgTable = jQuery.parseJSON(result);
            var BasicData = MsgTable.Table0;
            var MatrixData = MsgTable.Table1;
            //if (BasicData[0].Result == "Success") {
            if (BasicData.length > 0) {
                //alert("Hi");
                $('span#AircraftType').text(BasicData[0].Aircraft);
                $('span#HoldType').text(BasicData[0].HoldType);
                $('span#Unit').text(BasicData[0].Unit);
                $('span#Rows').text(BasicData[0].Rows);
                $('span#Cols').text(BasicData[0].Cols);
                $('span#CreatedUser').text(BasicData[0].CreatedBy);
                $('span#UpdatedUser').text(BasicData[0].UpdatedBy);
                $('span#CreatedOn').text(BasicData[0].CreatedOn);
                $('span#UpdatedOn').text(BasicData[0].UpdatedOn);
                rowcount = BasicData[0].Rows;
                columncount = BasicData[0].Cols;
            }
            if (MatrixData.length > 0) {
                CreateReadMatrix(rowcount, columncount);
                for (var p = 0; p < rowcount; p++) {
                    for (var q = 0; q < columncount; q++) {
                        //$('#txt' + p + q).text(MatrixData);
                        if (q == 0 && p == 0) {
                            $('#txt' + p + q).val("Height");
                        }
                        else {
                            i++;
                            $('#txt' + p + q).val(MatrixData[i].CellValue);
                        }
                    }
                }

            }
        }


        //},
        //error: function (result) {
        //    alert("Error");
        //}

    });
}

function CreateReadMatrix(x, y) {
    var divelement, fldElement, lgndElemnet, tableElement, rowElement, colElement;
    //a = document.getElementById($('#Rows'));
    //b = document.getElementById($('#Cols'));

    //if (x == "" || y == "") {
    //    alert("Please Enter Some Numeric Values");
    //}
    //else {
    divelement = document.createElement('div');
    divelement.id = 'divReadmatrix';
    fldElement = document.createElement('fieldset')
    fldElement.id = 'fldReadmatrix';
    lgndElemnet = document.createElement('legend');
    fldElement.appendChild(lgndElemnet);
    //divelement.appendChild(fldElement);
    tableElement = document.createElement('table');
    tableElement.id = 'tbReadlmatrix';
    tableElement.align = "center";
    for (var i = 0; i < x; i++) {
        rowElement = document.createElement('tr');

        for (var j = 0; j < y; j++) {
            colElement = document.createElement('td');
            var input = document.createElement('input');
            input.type = "text";
            input.style.width = '50px';
            input.id = 'txt' + i + j;
            input.readOnly = true;
            colElement.appendChild(input);
            //colElement.appendChild(document.createTextNode(j + 1));
            rowElement.appendChild(colElement);
        }

        tableElement.appendChild(rowElement);
        fldElement.appendChild(tableElement);
        divelement.appendChild(fldElement);
    }

    document.body.appendChild(divelement);
    //}
}

$('input[type="button"][value="Edit"]').click(function () {
    $('#Generate').toggle(false);
    EidtAircraftMatrixData();
});

function EidtAircraftMatrixData() {
    var recid = $('#hdnAircraftSNo').val();
    var userid = userContext.UserSNo;
    var rowcount, columncount;
    var i = 0;
    //var userid = $('#hdnuserID').val();
    $.ajax({
        url: "./Services/Master/AircraftDimensionMatrixService.svc/GetAircraftDimensionMatrixRecord?RecordID=" + recid + "&UserSNo= " + userid, type: "get", async: false, dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MsgTable = jQuery.parseJSON(result);
            var BasicData = MsgTable.Table0;
            var MatrixData = MsgTable.Table1;
            //if (BasicData[0].Result == "Success") {
            if (BasicData.length > 0) {
                //alert("Hi");
                //$('#AircraftSNo').text(BasicData[0].SNo)[0].innerHTML;
                $('#AircraftSNo').text(recid);
                $('span#Text_Aircraft').text(BasicData[0].Aircraft)[0].innerHTML;
                $('span#HoldType').text(BasicData[0].HoldType);
                //$('#Text_HoldType').val(BasicData[0].HoldType)[0].value;
                //$("#Text_HoldType").data("kendoAutoComplete").setDefaultValue(BasicData[0].HoldType);
                //$('#Unit').val(BasicData[0].Unit)[0].value;
                $('span#Unit').text(BasicData[0].Unit)[0].innerHTML;
                //$('#Rows').val(BasicData[0].Rows)[0].value;
                //$('#Cols').val(BasicData[0].Cols)[0].value;
                $('span#Rows').text(BasicData[0].Rows);
                $('span#Cols').text(BasicData[0].Cols);

                rowcount = BasicData[0].Rows;
                columncount = BasicData[0].Cols;
            }
            if (MatrixData.length > 0) {
                createTable(rowcount, columncount);
                for (var p = 0; p < rowcount; p++) {
                    for (var q = 0; q < columncount; q++) {
                        //$('#txt' + p + q).text(MatrixData);
                        if (q == 0 && p == 0) {
                            $('#txt' + p + q).val("Height");
                        }
                        else {
                            i++;
                            //$('#txt' + p + q).val(MatrixData[0].CellValue);
                            $('#txt' + p + q).val(MatrixData[i].CellValue);
                        }
                    }
                }

            }
        }


        //},
        //error: function (result) {
        //    alert("Error");
        //}

    });
}




function UpdateAircraftMatrixData() {
    //if (cfi.IsValidTransSection('divareaTrans_buildup_agentbuilduptrans')) {

    //    $('#dvMessageTable').html('');
    var a, b, ADRowNo, ADColNo, CellValue, aircraftSNo, AircraftSNo, AircraftType, holdtype, HoldType, unit, Unit, Rows, Cols, CreatedBy, UpdatedBy;
    var Length, Width, Height, UpdatedUser, adrowno, adcolno;
    var Model = [];
    var TransModel = [];
    var MatrixTransValModel = [];

    if ($('span#HoldType').text() == "Max FWD") {
        holdtype = 0;
    }
    else if ($('span#HoldType').text() == "Long FWD") {
        holdtype = 1;
    }
    else if ($('span#HoldType').text() == "Max AFT") {
        holdtype = 2;
    }
    else {
        holdtype = 3;
    }

    //if ($("#Text_HoldType").val() == "Max FWD") {
    //    holdtype = 0;
    //}
    //else if ($("#Text_HoldType").val() == "Long FWD") {
    //    holdtype = 1;
    //}
    //else if ($("#Text_HoldType").val() == "Max AFT") {
    //    holdtype = 2;
    //}
    //else {
    //    holdtype = 3;
    //}

    if ($('span#Unit').text() == "Inch") {
        unit = 0;
    }
    else {
        unit = 1;
    }

    //if ($("input[name='Unit']:checked").val() == "Inch") {
    //    unit = 0;
    //}
    //else {
    //    unit = 1;
    //}

    Model.push(
        {
            AircraftSNo: $('#AircraftSNo').text(),
            //HoldType: $("#Text_HoldType").data("kendoAutoComplete").key(),
            HoldType: holdtype,
            //Unit: document.getElementById('Unit').value,
            Unit: unit,
            //Rows: document.getElementById('Rows').value,
            Rows: $('span#Rows').text(),
            //Cols: document.getElementById('Cols').value,
            Cols: $('span#Cols').text(),
            CreatedBy: userContext.UserSNo,
            UpdatedBy: userContext.UserSNo,

            //AircraftSNo: $('#AircraftSNo').text(),
            ////AircraftType: $("#Text_Aircraft").val(),
            //HoldType: $("#Text_HoldType").val(),
            //Unit: document.getElementById('Unit').value,
            //Rows: document.getElementById('Rows').value,
            //Cols:document.getElementById('Cols').value,
            //CreatedBy: userContext.UserSNo,
            //UpdatedBy: userContext.UserSNo,
        }
        );
    //aircraftSNo: $('#AircraftSNo').text();
    a = $('span#Rows').text();
    b = $('span#Cols').text();

    // ********************* For AircraftDimensionMatrix and AircraftDimensionTrans table ********************
    for (var x = 0; x < a; x++) {
        for (var y = 0; y < b; y++) {
            ADRowNo = x;
            ADColNo = y;

            if (x == 0 && y == 0) {
                //x++;
                //y++;
                MatrixTransValModel.push(
                   {
                       //adrowno: x,
                       //adcolno: y,
                       //CellValue: 0,
                       Length: 0,
                       Height: 0,
                       Width: 0,
                       UpdatedBy: userContext.UserSNo,
                   }
                   );
            }
            else if (x == 0) {
                //x++;
                //y++;
                MatrixTransValModel.push(
                      {
                          //adrowno: x,
                          //adcolno: y,
                          //CellValue: $('#txt' + x + y).val(),
                          Length: 0,
                          Height: 0,
                          //Width: $('#txt' + 0 + y).val(),.
                          Width: 0,
                          UpdatedBy: userContext.UserSNo,
                      }
                      );
            }
            else if (y == 0) {
                //x++;
                //y++;
                MatrixTransValModel.push(
                  {
                      //adrowno: x,
                      //adcolno: y,

                      Length: 0,
                      //Height: $('#txt' + x + 0).val(),
                      Height: 0,
                      Width: 0,
                      UpdatedBy: userContext.UserSNo,
                  }
                  );
            }
            else {
                MatrixTransValModel.push(
                 {
                     // adrowno: x,
                     //ADColNo: y,
                     //CellValue: $('#txt' + x + y).val(),
                     Length: $('#txt' + x + y).val(),
                     Height: $('#txt' + x + 0).val(),
                     Width: $('#txt' + 0 + y).val(),
                     UpdatedBy: userContext.UserSNo,
                 }
               );
            }
        }
    }
    // *************** ENd ************************

    // ********************* For Only AircraftDimensionMatrix table ***************************
    for (var x = 0; x < a; x++) {
        for (var y = 0; y < b; y++) {
            ADRowNo = x;
            ADColNo = y;
            if (x == 0 && y == 0) {
                TransModel.push(
                   {
                       ADRowNo: x,
                       ADColNo: y,
                       CellValue: 0,
                   }
                   );
            }
            else {

                var yourInput = $('#txt' + x + y).val();
                re = /[aA-zZ`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
                var isSplChar = re.test(yourInput);
                if (isSplChar) {
                    var no_spl_char = yourInput.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                    //$(this).val(no_spl_char);
                    alert('Characters and Special Character are not allowed..');
                }
                else {
                    TransModel.push(
                       {
                           ADRowNo: x,
                           ADColNo: y,
                           CellValue: $('#txt' + x + y).val(),
                       }
                       );
                }

                //TransModel.push(
                //   {
                //       ADRowNo: x,
                //       ADColNo: y,
                //       CellValue: $('#txt' + x + y).val(),
                //   }
                //   );
            }

        }
    }
    // *************** ENd ************************

    $.ajax({
        url: "./Services/Master/AircraftDimensionMatrixService.svc/UpdateAircraftDimensionMatrix", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AircraftDimensionMatrix: Model, AircraftMatrixTransVal: TransModel, AircraftMatrixTrans: MatrixTransValModel }),
        //, AircraftSNo: aircraftSNo 
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MsgTable = jQuery.parseJSON(result);
            var MsgData = MsgTable.Table0;
            //if (MsgData[0].Result == "Success") {
            if (MsgData[0].column1 == 0) {
                //alert("Record Saved Successfully");
                ShowMessage('success', 'Success - Information', "Aircraft Dimension Matrix Updated Successfully", "bottom-right");
                //ShowMessage('success', 'Information', "Record Saved Successfully");
                //$("input[type='submit'][name='operation'][value='Update']").click(); // Saved message comming from Management WebUI
            }
            //else if (MsgData[0].Column1 == 22) {
            //    //alert('This Record is Alredy Exits..');
            //    //ShowMessage('555', 'Information', "This Record is Alredy Exits..");
            //    ShowMessage('warning', 'warning - Information', "Record is Alredy Exits..", "bottom-right");
            //}
            else if (MsgData[0].Result == "Invalid") {
                //var errorMessage = "Sorry There is Some Error During Saving the Data";
                ShowMessage('warning', 'warning - Information', "Sorry There is Some Error During Saving the Data..", "bottom-right");
                //var errorMessage = "<table align='left' style='padding:5px'><tr><td colspan='3' style='color:red; font-weight:bold'>Please Correct The Below Points.</td></tr><tr style='font-weight:bold'><td style='width:60px'>S.No.</td><td style='width:150px'>AWB No.</td><td style='width:100px'>ULD No.</td><td>Message</td></tr>";
                //$.each(MsgData, function (index, item) {
                //    errorMessage = errorMessage + "<tr><td>" + (index + 1) + "</td><td>" + item.AWBNo + "</td><td>" + item.ULDNo + "</td><td>" + item.ErrorMessage + "</td></tr>";
                //});
                //errorMessage = errorMessage + "</table>";
                //$('#dvMessageTable').html(errorMessage);
            }
            //else {
            //    ShowMessage('warning', 'Information', MsgData[0].Result);
            //}
        }
        //error: function (xhr) {
        //    ShowMessage('warning', 'Information', result);

        //}
    });
    //}
}