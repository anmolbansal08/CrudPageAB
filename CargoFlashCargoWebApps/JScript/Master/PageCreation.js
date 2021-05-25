var listarray = [];
var allTables = "";
$(document).ready(function () {

    cfi.AutoCompleteV2("ProcessSno", "SNo,ProcessName", "Master_PageCreation_Process",  null, OnSelectProcess, "contains");
    $("#MasterSaveAndNew").hide();
    $("#Text_SubprocessSno").prop("disabled", true);
    $("#Text_SNo").prop("disabled", true);
    $("#SectionName").prop("disabled", true);
    //cfi.AutoComplete("SNo", "SNo,name", "GetAlltables", "SNo", "name", null, OnSelectTable, "contains");
    //cfi.AutoComplete("SNo", "SNo,name", "GetAlltables", "SNo", "name", null, OnSelectTable, "contains");SectionName

    $('input[name="operation"]').click(function (e) {
        var strData = "";
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {

             strData = $('#tblPageCreation').appendGrid('getStringJson');
        }
        if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {

             strData = $('#tblPageCreation1').appendGrid('getStringJson');
        }

        //if ($.isArray(updatedRows)) {
        //    updatedRows.sort();
        //    updatedRows = jQuery.unique(updatedRows);
        //}
        //if (validateTableData(settings.tableID, updatedRows)) {
        //    var strData = tableToJSON(settings.tableID, settings.columns, updatedRows);
        //}
        //}
        // var data = { obj: JSON.stringify($("#tbl").serializeToJSON()) };


        if ($("#App_Id").val() != "" && $("#SectionName").val() != "" && $("#Name").val() != "" && $("#Description").val() != "" && $("#Heading").val() != "" && $("#Caption").val() != "") {

            var App_Id = $("#App_Id").val(); var Name = $("#Name").val(); var SectionName = $("#SectionName").val(); var Description = $("#Description").val();
            var CurrentHeadingName = $("#Heading").val(); var Caption = $("#Caption").val(); var SubprocessSno = $("#SubprocessSno").val();
            var TableName = $("#Text_SNo").val();
            var ProcessSno = $("#ProcessSno").val();
            //../Services/Master/PageCreationService.svc/CreateUpdateTableDesc

            $.ajax({
                type: "POST",
                url: "./Services/Master/PageCreationService.svc/CreateUpdateTableDesc?App_Id=" + App_Id + "&Name=" + Name + "&Description=" + Description + "&Heading=" + CurrentHeadingName + "&Caption=" + Caption + "&SubprocessSno=" + SubprocessSno + "&ProcessSno=" + ProcessSno + "&TableName=" + allTables + "&SectionName=" + SectionName + "&strData=" + strData,
                dataType: "json",
                success: function (response) {
                    navigateUrl('Default.cshtml?Module=Master&Apps=PAGECREATION&FormAction=INDEXVIEW');
                },
                error: function (er) {
                    debugger
                    return false;
                }
            });
        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        $("#Text_SubprocessSno").prop("disabled", false)
        $("#Text_SNo").prop("disabled", false);
        $("#SectionName").prop("disabled", false);
        //var TableName = $("#Text_SNo").val();       
        //listarray.push(TableName);
        cfi.AutoCompleteV2("SubprocessSno", "SNo,SubProcessName", "Master_PageCreation_SubProcess", null, OnSelectSubProcessName, "contains");
        cfi.AutoCompleteV2("SNo", "SNo,name", "Master_PageCreation_Name",null, OnSelectFillGrid, "contains");
        GetTableDescRecordEdit(getQueryStringValue("FormAction").toUpperCase());

    }

    //$.each(allTables, function (i, el) {
    //    if ($.inArray(el, listarray) === -1) listarray.push(el);
    //});

});

function OnSelectProcess(e) {
    $("#Text_ProcessSno").prop("disabled", true);
    $("#Text_SubprocessSno").prop("disabled", false);
    $("#Text_SubprocessSno").val("");
    $("#Text_SNo").val("");
    cfi.AutoCompleteV2("SubprocessSno", "SNo,SubProcessName", "Master_PageCreation_SubProcess",  null, OnSelectSubProcessName, "contains");

}
function OnSelectSubProcessName(e) {
    $("#Text_SubprocessSno").prop("disabled", true);
    $("#Text_SNo").prop("disabled", false);
    $("#Text_SNo").val("");
    $("#MasterSaveAndNew").hide();
    cfi.AutoComplete("SNo", "SNo,name", "Master_PageCreation_Name",  null, OnSelectFillGrid, "contains");
    $("#SectionName").prop("disabled", false);
}

var pageType = $('#hdnPageType').val();
function OnSelectFillGrid(e) {

    $("#SectionName").focus();
    if (getQueryStringValue("FormAction").toUpperCase() != 'EDIT') {
        var TableName = $("#Text_SNo").val();

        listarray.push(TableName);
        for (var i = 0; i < listarray.length; i++) {
            if (listarray[i] == TableName) {
                var newTable = listarray[i] + "-";
                allTables = allTables + "" + newTable;
            }
        }

    }
    else {

        GetTableDescRecordEdit(getQueryStringValue("FormAction").toUpperCase());
        return true;
    }
    //allTables.split("-");

    if (getQueryStringValue("FormAction").toUpperCase() != 'EDIT') {
        //var dbtableName = TableName;
        $('#tblPageCreation').appendGrid({
            tableID: 'tblPageCreation',
            contentEditable: true,
            tableColume: 'ColumnName,Datatype,DISPLAY_ORDER,Assembley_Name,LABEL_CELL_TEXT,DATA_FIELDNAME,DATA_FIELD_CSSCLASS,DATA_CELL_CSSCLASS,Onclick_Handler,Tooltip, tn_Usesubmit_Behaviour,Visible , Readonly ,Enable_Viewstate , Maxlength ,Multiline , Width ,Height ,Section_Name , Onkey_Handler ,Onblur_Handler ,Enable_Requirevalidation , Required_Field_Message , Lookup_Name ,Tab_Index ,XmlFolderName ,XmlFileName ',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 200, whereCondition: allTables, sort: '',
            servicePath: './Services/Master/PageCreationService.svc',
            getRecordServiceMethod: 'GetTableDescRecord',
            createUpdateServiceMethod: 'CreateUpdateTableDesc',
            deleteServiceMethod: 'DeleteTableDesc',
            isGetRecord: true,
            caption: "Page Creation",
            initRows: 1,
            columns: [
                      { name: 'ColumnName', display: 'Column Name', type: 'text', ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                       { name: 'Datatype', display: 'Data Type', type: 'text', ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                        { name: 'DISPLAY_ORDER', display: 'DISPLAY_ORDER', type: 'text', ctrlCss: { width: '20px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                       {
                           name: 'ASSEMBLY_NAME', display: 'ASSEMBLY_NAME', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, onSelect: FillFields, isRequired: true, AutoCompleteName: 'Master_PageCreation_Assembly', filterField: 'Assembley_Name', filterCriteria: "contains"
                       },
                        { name: 'LABEL_CELL_TEXT', display: 'LABEL_CELL_TEXT', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true }, { name: 'LABEL_CELL_CSSCLASS', display: 'Label_Cell_CssClass', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, isRequired: true, tableName: 'PageCreationWFControls', textColumn: 'Label_Cell_CssClass', keyColumn: 'Label_Cell_CssClass', filterCriteria: "contains" },
                       { name: 'DATA_FIELDNAME', display: 'DATA_FIELDNAME', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                       { name: 'DATA_FIELD_CSSCLASS', display: 'DATA_FIELD_CSSCLASS', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'DATA_CELL_CSSCLASS', display: 'DATA_CELL_CSSCLASS', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, isRequired: false, AutoCompleteName: 'Master_PageCreation_DATA_CELL', filterField: 'Data_Cell_Cssclass', filterCriteria: "contains" },
                      { name: 'TOOLTIP', display: 'TOOLTIP', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                       { name: 'BTN_USESUBMIT_BEHAVIOUR', display: 'BTN_USESUBMIT_BEHAVIOUR', type: 'checkbox', ctrlAttr: { checked: false, }, isRequired: false },
                       { name: 'VISIBLE', display: 'VISIBLE', type: 'checkbox', ctrlAttr: { checked: true, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                        { name: 'READONLY', display: 'READONLY', type: 'checkbox', ctrlAttr: { checked: false, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                            { name: 'ENABLE_VIEWSTATE', display: 'ENABLE_VIEWSTATE', type: 'checkbox', ctrlAttr: { checked: false, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                       { name: 'MAXLENGTH', display: 'MAXLENGTH', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                        { name: 'MULTILINE', display: 'MULTILINE', type: 'checkbox', ctrlAttr: { checked: false, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                       { name: 'WIDTH', display: 'WIDTH', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                       { name: 'HEIGHT', display: 'HEIGHT', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                       { name: 'Section_Name', display: 'Section_Name', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'ONKEY_HANDLER', display: 'ONKEY_HANDLER', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'ONBLUR_HANDLER', display: 'ONBLUR_HANDLER', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'ENABLE_REQUIREVALIDATION', display: 'ENABLE_REQUIREVALIDATION', type: 'checkbox', ctrlAttr: { checked: false, }, isRequired: false },
                       { name: 'REQUIRED_FIELD_MESSAGE', display: 'REQUIRED_FIELD_MESSAGE', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'LOOKUP_NAME', display: 'LOOKUP_NAME', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'TAB_INDEX', display: 'TAB_INDEX', type: 'text', ctrlCss: { width: '30px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'XmlFolderName', display: 'XmlFolderName', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                       { name: 'XmlFileName', display: 'XmlFileName', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false }],
            isPaging: false,
            hideButtons: { updateAll: true, append: (pageType == "NEW" ? true : false), insert: (pageType == "EDIT" ? true : false), remove: (pageType == "NEW" ? true : false), removeLast: true }
        });
    }
}
var CurrentTable = "";
function GetTableDescRecordEdit(mode) {
    var APPID = "";
    var OTName = $("#TableName").val();

    $("#spnTableName").hide();
    $("span#TableName").hide();
    $("#SectionName").focus();
    listarray.pop();

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        allTables = $("#TableName").val();
        APPID = $("#App_Id").val();
    }
    else {
        APPID = $("#App_Id").val();
        var TableName = $("#Text_SNo").val();

        listarray.push(TableName);
        for (var i = 0; i < listarray.length; i++) {
            if (listarray[i] == TableName) {
                var newTable = listarray[i] + "_";
                CurrentTable = CurrentTable + "" + newTable;
            }
        }
    }

    CurrentTable = OTName + '_' + CurrentTable;
    $('#tblPageCreation1').appendGrid({
        tableID: 'tblPageCreation1',
        contentEditable: true,
        tableColume: 'ColumnName,Datatype,DISPLAY_ORDER,Assembley_Name,LABEL_CELL_TEXT,DATA_FIELDNAME,DATA_FIELD_CSSCLASS,DATA_CELL_CSSCLASS,Onclick_Handler,Tooltip, tn_Usesubmit_Behaviour,Visible , Readonly ,Enable_Viewstate , Maxlength ,Multiline , Width ,Height ,Section_Name , Onkey_Handler ,Onblur_Handler ,Enable_Requirevalidation , Required_Field_Message , Lookup_Name ,Tab_Index ,XmlFolderName ,XmlFileName ',
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 200, whereCondition: CurrentTable+"~"+APPID, sort: '',
        servicePath: './Services/Master/PageCreationService.svc',
        getRecordServiceMethod: 'GetTableDescRecordEdit',
        createUpdateServiceMethod: 'CreateUpdateTableDesc',
        deleteServiceMethod: 'DeleteTableDesc',
        isGetRecord: true,
        caption: "Page Creation",
        initRows: 1,
        columns: [
                  { name: 'ColumnName', display: 'Column Name', type: 'text', ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                   //{ name: 'Datatype', display: 'Data Type', type: 'text', ctrlCss: { width: '90px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                    { name: 'DISPLAY_ORDER', display: 'DISPLAY_ORDER', type: 'text', ctrlCss: { width: '20px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                   {
                       name: 'ASSEMBLY_NAME', display: 'ASSEMBLY_NAME', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, onSelect: FillFields, isRequired: true, AutoCompleteName: 'Master_PageCreation_Assembly', filterField: 'Assembley_Name', filterCriteria: "contains"
                   },
                    { name: 'LABEL_CELL_TEXT', display: 'LABEL_CELL_TEXT', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true }, { name: 'LABEL_CELL_CSSCLASS', display: 'Label_Cell_CssClass', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, isRequired: true, tableName: 'PageCreationWFControls', textColumn: 'Label_Cell_CssClass', keyColumn: 'Label_Cell_CssClass', filterCriteria: "contains" },
                   { name: 'DATA_FIELDNAME', display: 'DATA_FIELDNAME', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                   { name: 'DATA_FIELD_CSSCLASS', display: 'DATA_FIELD_CSSCLASS', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'DATA_CELL_CSSCLASS', display: 'DATA_CELL_CSSCLASS', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '90px', height: '20px' }, isRequired: false, AutoCompleteName: 'Master_PageCreation_DATA_CELL', filterField: 'Data_Cell_Cssclass', filterCriteria: "contains" },
                  { name: 'TOOLTIP', display: 'TOOLTIP', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                   { name: 'BTN_USESUBMIT_BEHAVIOUR', display: 'BTN_USESUBMIT_BEHAVIOUR', type: 'checkbox', ctrlAttr: { checked: false, }, isRequired: false },
                   { name: 'VISIBLE', display: 'VISIBLE', type: 'checkbox', ctrlAttr: { checked: true, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                    { name: 'READONLY', display: 'READONLY', type: 'checkbox', ctrlAttr: { checked: false, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                        { name: 'ENABLE_VIEWSTATE', display: 'ENABLE_VIEWSTATE', type: 'checkbox', ctrlAttr: { checked: false, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                   { name: 'MAXLENGTH', display: 'MAXLENGTH', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                    { name: 'MULTILINE', display: 'MULTILINE', type: 'checkbox', ctrlAttr: { checked: false, }, ctrlCss: { width: '20px', height: '20px' }, isRequired: false },
                   { name: 'WIDTH', display: 'WIDTH', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                   { name: 'HEIGHT', display: 'HEIGHT', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: true },
                   { name: 'Section_Name', display: 'Section_Name', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'ONKEY_HANDLER', display: 'ONKEY_HANDLER', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'ONBLUR_HANDLER', display: 'ONBLUR_HANDLER', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'ENABLE_REQUIREVALIDATION', display: 'ENABLE_REQUIREVALIDATION', type: 'checkbox', ctrlAttr: { checked: false, }, isRequired: false },
                   { name: 'REQUIRED_FIELD_MESSAGE', display: 'REQUIRED_FIELD_MESSAGE', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'LOOKUP_NAME', display: 'LOOKUP_NAME', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'TAB_INDEX', display: 'TAB_INDEX', type: 'text', ctrlCss: { width: '30px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'XmlFolderName', display: 'XmlFolderName', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false },
                   { name: 'XmlFileName', display: 'XmlFileName', type: 'text', ctrlCss: { width: '80px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false }],
        isPaging: false,
        hideButtons: { updateAll: true, append: (pageType == "NEW" ? true : false), insert: (pageType == "EDIT" ? true : false), remove: (pageType == "NEW" ? true : false), removeLast: true }
    });

}


function FillFields(e) {
    try {
        var Data = this.dataItem(e.item.index());
        var id = this.element[0].name;
        var Id = id.substr(30, 31);
        if (textId = "tblPageCreation_ASSEMBLY_NAME_" + Id + "") {
            var NewId = "#" + textId.toString();

            $.ajax({
                type: "GET",
                url: "./Services/Master/PageCreationService.svc/GetProcessTemplate/" + Data.Text,
                dataType: "html",
                success: function (response) {
                    var Data = JSON.parse(response);

                    var Newdata = JSON.parse(Data)[0];

                    $("#tblPageCreation_LABEL_CELL_CSSCLASS_" + Id + "").val(Newdata.Label_Cell_Cssclass);
                    $("#tblPageCreation_DATA_FIELD_CSSCLASS_" + Id + "").val(Newdata.Data_Field_Cssclass);

                }

            });
        }
    }
    catch (exp)
    { }
}

function ExtraCondition(textId) {
    var filterProcess = cfi.getFilter("AND");
    try {
        if (textId == "Text_SubprocessSno") {

            cfi.setFilter(filterProcess, "ProcessSNo", "eq", $("#ProcessSno").data("kendoAutoComplete").value(), "AirlineCode")
            var SubProcessAutoCompleteFilter2 = cfi.autoCompleteFilter([filterProcess]);
            return SubProcessAutoCompleteFilter2;
        }

    }
    catch (exp)
    { }
}


