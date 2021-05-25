var isNewrequest = true;

$(document).ready(function () {
    var DurationValue = [{ Key: "7", Text: "7 Days" }, { Key: "15", Text: "15 Days" }, { Key: "30", Text: "30 Days" }, { Key: "60", Text: "60 Days" }, { Key: "90", Text: "90 Days" }];
    cfi.AutoCompleteByDataSource("DurationSNo", DurationValue);

    var ModuleValue = [{ Key: "1", Text: "Class Rate" }, { Key: "2", Text: "Rate" }, { Key: "3", Text: "Due Carrier Charges" }, { Key: "4", Text: "Allocation" }, { Key: "5", Text: "Open Flight" }, { Key: "6", Text: "Schedule" }];
    cfi.AutoCompleteByDataSource("ModuleSNo", ModuleValue);


});
var objModel = [];
function GetValidityOfModules() {

    isNewrequest = true;

    objModel =
       {
           DurationSNo: $('#DurationSNo').val(),
           ModuleSNo: $('#ModuleSNo').val()
       };
    var WhereCondition = "";
    if (objModel.DurationSNo == "" || objModel.ModuleSNo == "") {
        ShowMessage('warning', 'Warning - Validity Of Modules ', "Duration & Module can not be blank !");
        return;
    }

    $.ajax({
        url: "../ValidityOfModules/GetValidityOfModules",
        dataType: "json",
        global: true,
        type: 'POST',
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(objModel),
        success: function (data) {
            populateGrid(data.Table0 || []);
        }

    })



    //$('#grid').css('display', '')
    //$("#grid").data('kendoGrid').dataSource.page(1);
    //$("#imgexcel").show();

}

function populateGrid(response) {
    var columns = generateColumns(response);
    var gridOptions = {
        dataSource: {
            transport: {
                read: function (options) {
                    options.success(response);
                }
            },
            pageSize: 10,
            page: 1
        },
        columns: columns,
        pageable: true,
        height: 300
    };

    // reuse the same grid, swapping its options as needed
    var grid = $("#grid").data("kendoGrid");
    if (grid) {
        grid.setOptions(gridOptions);
    } else {
        $("#grid").kendoGrid(gridOptions);
    }
}
function generateColumns(sampleDataItem) {
    var columnNames = Object.keys(sampleDataItem[0] || {});
    return columnNames.map(function (name) {
        var isIdField = name.indexOf("ID") !== -1;
        return {
            field: name,
            headerTemplate: '<pre>' + name.replace('_', ' ') + '</pre>',
            //width: (isIdField ? 40 : 200),
            title: (isIdField ? "Id" : name)
        };
    });
}

function ExportToExcel() {    

    Model =
     {
         DurationSNo: $('#DurationSNo').val(),
         ModuleSNo: $('#ModuleSNo').val()
     };
    if (Model.DurationSNo == "" || Model.ModuleSNo == "") {
        ShowMessage('warning', 'Warning - Validity Of Modules ', "Duration & Module can not be blank !");
        return;
    }
    $('#ASToExcel #DurationSNo').val(Model.DurationSNo);
    $('#ASToExcel #ModuleSNo').val(Model.ModuleSNo);

    $('#ASToExcel').submit();
}

