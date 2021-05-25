/// <reference path="../../Scripts/references.js" />

$(document).ready(function () {


    cfi.AutoCompleteV2("UserNameSNo", "UserSno,UserName", "AuditLog_UserName", null, "contains");
    //cfi.AutoCompleteV2("PageNameSNo", "ApplicationName", "AuditLog_PageName", null, "contains");
    cfi.AutoCompleteV2("PageNameSNo", "ApplicationName", "AuditLog_Page", null, "contains")
    cfi.AutoCompleteV2("MasterFieldNameSNo", "Sno,KeyColumn", "AuditLog_KeyColumn",  null, "contains");
    cfi.AutoCompleteV2("KeyValueNameSNo", "SNO,KeyValue", "AuditLog_Value", null, "contains");
    cfi.AutoCompleteV2("FieldNameSNo", "ApplicationName,ColumnName", "AuditLog_FieldName", null, "contains", ",");
    cfi.DateType("Text_StartDate");
    cfi.DateType("Text_EndDate");
    $("#Text_StartDate").data("kendoDatePicker").value(new Date());
    $("#Text_EndDate").data("kendoDatePicker").value(new Date())
    
    var todaydate = new Date();
    var validfromdate = $("#Text_StartDate").data("kendoDatePicker");
    var validTodate = $("#Text_EndDate").data("kendoDatePicker");
    $("input[id^=Text_EndDate]").change(function (e) {

        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("End", "Start");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });

    $("input[id^=Text_StartDate]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("Start", "End");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");

    });

  

});

var PageNameSNo = "";


function ExportToExcel() {

    if (cfi.IsValidSection('ApplicationTabs'))
    {
        var PageName = $('#PageNameSNo').val();
        var KeyColumn = $('#MasterFieldNameSNo').val();
        var KeyValue = $('#KeyValueNameSNo').val();
        var UserName = $('#UserNameSNo').val();
        var StartDate = $('#Text_StartDate').val();
        var EndDate = $('#Text_EndDate').val();
        var FieldName = $('#FieldNameSNo').val();
        var Name = PageName.replace(" ", "").replace(" ","");
      
    }
    else  {
        return false;
          }
        $.post("/AuditLog/GetRecordInExcel",

             { applicationName: Name, keyColumn: KeyColumn, keyValue: KeyValue, userName: UserName, startDate: StartDate, endDate: EndDate, columnName: FieldName },
                            function (response) {

                                

                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!

                                var yyyy = today.getFullYear();
                                if (dd < 10) {
                                    dd = '0' + dd;
                                }
                                if (mm < 10) {
                                    mm = '0' + mm;
                                }
                                var today = dd + '_' + mm + '_' + yyyy;
                                var a = document.createElement('a');
                                var data_type = 'data:application/vnd.ms-excel';
                                var table_div = response;
                                var table_html = table_div.replace(/ /g, '%20');
                                a.href = data_type + ', ' + table_html;
                                a.download = 'AuditLogData_' + today + '_.xls';
                                a.click();
                                //}
                                return false
                            }
                         );
    
}



function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_MasterFieldNameSNo") {
        try {
           
            cfi.setFilter(filterAirline, "ApplicationName", "eq", $("#Text_PageNameSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }

        catch (exp)
        { }
    }

    if (textId == "Text_KeyValueNameSNo") {
        try {
            
            cfi.setFilter(filterAirline, "ApplicationName", "eq", $("#Text_PageNameSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }

        catch (exp)
        { }
    }
    if (textId == "Text_FieldNameSNo") {
        try {
            cfi.setFilter(filterAirline, "ApplicationName", "eq", $("#Text_PageNameSNo").data("kendoAutoComplete").key())
            cfi.setFilter(filterAirline, "ColumnName", "notin", $("#FieldNameSNo").val());
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }

        catch (exp)
        { }
    }

    

    
}







