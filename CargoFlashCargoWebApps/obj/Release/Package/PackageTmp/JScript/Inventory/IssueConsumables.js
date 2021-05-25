$(document).ready(function () {
    cfi.ValidateForm();
    $('#divIssueConsumables').hide();

    cfi.AutoComplete("IssuedTo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");

    
    cfi.AutoComplete("IssuableItem", "Sno,Item", "VConsumablesStockItem", "Sno", "Item", null, null, "contains", null, null, null, null, OnSelectIssuableItem);
    $("#MasterSaveAndNew").hide();

    $("input[name=IssueType]:radio").click(function () {

      
        if ($(this).attr("value") == "0") {

         
            var data = GetDataSource("IssuedTo", "Account", "SNo", "Name", [ "Name"], null);
            cfi.ChangeAutoCompleteDataSource("IssuedTo", data, true, null, "Name", "contains");

            $("#Text_IssuableItem").data("kendoAutoComplete").enable(true);



            //cfi.ResetAutoComplete("IssuedTo");
            //var dataSource = new kendo.data.DataSource({
            //    data: []
            //});
            //var autocomplete = $("#Text_IssuedTo").data("kendoAutoComplete");
            //autocomplete.setDataSource(dataSource);       
            //cfi.AutoComplete("IssuedTo", "SNo,Name", "Account", "SNo", "Name", null, null, "contains");
           
        }
        else {

            var data = GetDataSource("IssuedTo", "Airline", "SNo", "AirlineName", ["AirlineName"], null);
            cfi.ChangeAutoCompleteDataSource("IssuedTo", data, true, null, "AirlineName", "contains");
           

            //cfi.ResetAutoComplete("IssuedTo");
            //var dataSource = new kendo.data.DataSource({
            //    data: []
            //});
            //var autocomplete = $("#Text_IssuedTo").data("kendoAutoComplete");
            //autocomplete.setDataSource(dataSource);
        
            //cfi.AutoComplete("IssuedTo", "SNo,AirlineName", "Airline", "SNo", "AirlineName", null, null, "contains");
      
        }

        cfi.ResetAutoComplete("IssuableItem");
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(true);
        $("#tblIssueConsumables").html('');
        $("#tblIssueConsumables").innerHTML = "";
        $('#divIssueConsumables').hide();
        $('#NoOfItems').val('');
        $('#_tempNoOfItems').val('')
    });
    // BindConsumableStockView();


    $("#NoOfItems").blur(function (e) {
        if (($("#NoOfItems").val() == '' ? '0' : $("#NoOfItems").val()) != '0' ) {
            if ($('#IssuableItem').val().split('-')[1] == '1') {
                // BindConsumableStock();
                BindConsumableStockView();
                $('#divIssueConsumables').show();
            } else {
              BindConsumableStockView();
                $("#tblIssueConsumables").html('');
                $("#tblIssueConsumables").innerHTML = "";
                $('#divIssueConsumables').hide();
            }
        }
    })

    $(".btn-success").click(function () {
        if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {


            if (!cfi.IsValidForm()) {
                return false;
            }


            var lstItem = [];


            var ConsumableArray = [];
            
            ConsumableArray = $("#listIssueConsumables option").map(function () { return $(this).val() }).get()

         
            if ($('#IssuableItem').val().split('-')[1] == '1') {

                if (parseInt(ConsumableArray.length) == 0) {

                    ShowMessage('warning', 'Warning - Please add atleast 1 stock to issue.', null);
                    return false;
                }

                if (parseInt(ConsumableArray.length) != parseInt($('#NoOfItems').val())) {
                    ShowMessage('warning', 'Warning - Issued item or no of item should be equal.', null);
                    return false;
                }
                for (var i = 0; i <= ConsumableArray.length; i++) {
                    //  $("#tblIssueConsumables tbody tr").each(function (i, e) {

                    var r = {

                        ConsumableSNo: $('#IssuableItem').val().split('-')[0],
                        ConsumableStockTransSno: ConsumableArray[i],
                        IssueType: $("input[name=IssueType]:checked").val(),
                        IssuedToSNo: $('#IssuedTo').val(),
                        NoOfItems: $('#NoOfItems').val(),
                        ConsumableStockSno: 0
                    }
                    lstItem.push(r);

                    //  });
                }
            } else {
                if ($('#NoOfItems').val() == '') {
                    ShowMessage('warning', 'Warning - Please add atleast 1 stock to issue.', null);
                    return false;
                } else {
                    var r = {

                        ConsumableSNo: $('#IssuableItem').val().split('-')[0],
                        ConsumableStockTransSno: 0,
                        IssueType: $("input[name=IssueType]:checked").val(),
                        IssuedToSNo: $('#IssuedTo').val(),
                        NoOfItems: $('#NoOfItems').val(),
                        ConsumableStockSno: 0
                    }
                    lstItem.push(r);
                }
            }

            var lstConsumabIssue = JSON.stringify(lstItem);
            $.ajax({
                url: "./Services/Inventory/IssueConsumablesService.svc/CreateIssueConsumables",
                async: false, type: "POST", dataType: "json", cache: false,
                data: lstConsumabIssue,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (eval(data) == 2003) {
                        //BindAWBSwap();
                        ShowMessage('success', 'Success!', 'Saved Successfully');

                    }
                   
                }
            });

        }

    })

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT') {

        $('#__SpanHeader__').html("Issue Inventory Edit:")
        if($('#IssuableItem').val().split('-')[1]==1)
            BindIssueConsumableEdit();
        $('#NoOfItems').attr('disabled', 'disabled');
        $('#divIssueConsumables').hide();
    }
    if ( getQueryStringValue("FormAction").toUpperCase() == 'READ') {      
        $('#__SpanHeader__').html("Issue Inventory Form - Detail View:")
        if($('#IssuableItems').val().split('-')[1]==1)
             BindIssueConsumableEdit();

    }
});



function BindConsumableStock() {  

    var citycode = $('#hdnCityCode').val();
    var consumableSno = $('#IssuableItem').val().split('-')[0];

    var ConsumableStock = "IssueConsumables";
    $('#tbl' + ConsumableStock).appendGrid({
        tableID: 'tbl' + ConsumableStock,
        contentEditable: true,
        // contentEditable: false,
        // tableColumns: 'SNo,CFTNumber,MawbNo,TotalPcs,TotalGrossWt,TotalCBM,NoOfBUP,ShipmentType,ForwarderName,AirlineName,IsSecure,Origin,SPHCSNo,FlightNo,Origin,Destination,FlightNo,CarrierCode',
        isGetRecord: false,
        masterTableSNo: consumableSno,
        currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
        servicePath: './Services/Inventory/ConsumableStockService.svc',
        getRecordServiceMethod: null,
        createUpdateServiceMethod: 'createUpdateConsumableStock',
        deleteServiceMethod: 'deletetblConsumableStock',
        caption: "Inventory Stock",
        initRows: 1,
        rowNumColumnName: 'SNo',

        columns: [{ name: 'SNo', type: 'hidden' },
                { name: 'ConsumablePrefix', display: 'Consumable Prefix', type: 'label' },
                { name: 'ConsumableType', display: 'Consumable Type', type: 'label' },
                { name: 'ConsumableNo', display: 'Consumable No.', type: 'label' },
                { name: 'ConsumableSno', type: 'hidden' },
                { name: 'ConsumableStockSno', type: 'hidden' },
                { name: 'ConsumableStockTransSno',type:'hidden' }
                 

        ],

        //  hideButtons: { remove: true, removeLast: true },
        //hideButtons: { append: true, remove: true, removeLast: true },
        hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true },
        isPaging: true

    });
}



function BindConsumableStockView() {
    var consumableSno = $('#IssuableItem').val().split('-')[0];


    $("lstConsumablesStockRecord").html("");
    $("#listIssueConsumables").html('');
    if (consumableSno == '') {


        return false;
    }

    $.ajax({
        url: "./Services/Inventory/IssueConsumablesService.svc/GetConsumableIssueStockRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: { ConsumableSno: consumableSno, NoOfItems: $('#NoOfItems').val() == '' ? 0 : $('#NoOfItems').val() },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            var myData = jQuery.parseJSON(result);

            if (myData.length > 0 || myData.length == undefined) {

                if (myData.Table0.length > 0) {
                   // BindConsumableStock();
                    var item = $('#NoOfItems').val();
                    var startrange = $('#ConsumableNoStart').val();


                    //   var myData = jQuery.parseJSON(myData.Table0);
                   
                    var genHtml = '';
                    var listrecord = '';
                    var itemCheck = '';
                    var checkedstatus = 0;
                    SPHCvaluecount = myData.length;
                    for (var num = 0; num < myData.Table0.length; num++) {
                        if (num < (item)) {
                            genHtml = genHtml + ('<option value="' + myData.Table0[num].ConsumableStockTransSno + '" >' + myData.Table0[num].Consumables + '</option>');

                        } else {

                          

                            listrecord = listrecord + ('<option value="' + myData.Table0[num].ConsumableStockTransSno + '" >' + myData.Table0[num].Consumables + '</option>');
                        }
                    }
                
                    $("#lstConsumablesStockRecord").html("");

                    $("#lstConsumablesStockRecord").html(listrecord);

                    $("#listIssueConsumables").html("");
                    $("#listIssueConsumables").html(genHtml);

                    $('ul').sortable({

                        connectWith: 'ul',
                        dropOnEmpty: true
                        //items: "div:not(.ignoreMe)"
                    });

                    $("#Text_IssuableItem").data("kendoAutoComplete").enable(false)
                    
                }

                //else { $(".btn-success").show(); }
            } else {

                
                ShowMessage('warning', 'Warning - Stock Not Available', null);
                $('#NoOfItems').val('');
                $('#_tempNoOfItems').val('');
            }
            return false
        },

        error: function (xhr) {
            var a = "";
        }
    });
}

function BindIssueConsumableEdit() {

    var Consumablesno = $('#hdnIssueConsumablesSNo').val();


    $.ajax({
        url: "./Services/Inventory/IssueConsumablesService.svc/GetIssueConsumablesTransRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: { ConsumableSno: Consumablesno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            var myData = jQuery.parseJSON(result);

            //if (myData.Table0.length > 0) {
               
            //    $('#Text_IssuableItem').html(myData.Table0[0].Text_IssuableItem);
            //    $('#IssueableItem').val(myData.Table0[0].IssueableItem);
                
            //    $('#Text_IssuedTo').html(myData.Table0[0].Text_IssuedTo);
            //    $('#IssuedTo').val(myData.Table0[0].IssuedTo);

            //    $('#_tempNoOfItem').val(myData.Table0[0].NoOfItems);

            //    $('#NoOfItem').val(myData.Table0[0].NoOfItems);
            

            //}

            if (myData.Table0.length > 0) {
                BindConsumableStock();
                var item = $('#NoOfItem').val();
                var startrange = $('#ConsumableNoStart').val();
                var lstItem = [];
                for (var i = 0; i < myData.Table0.length; i++) {
                    var r = {
                        SNo: 0,
                        ConsumablePrefix: myData.Table0[i].ConsumablePrefix,
                        ConsumableType: myData.Table0[i].ConsumableType,
                        ConsumableNo: myData.Table0[i].ConsumableNo,
                        ConsumableSno: myData.Table0[i].SNo,
                        ConsumableStockSno: myData.Table0[i].ConsumableNo,
                        ConsumableStockTransSno: myData.Table0[i].ConsumableStockTransSno
                    }

                    lstItem.push(r);

                }


                $("#tblIssueConsumables").appendGrid('load', JSON.parse(JSON.stringify(lstItem)));

             
                $(".btn-success").hide();
            }
            else {
                $(".btn-success").show();
            }
            return false
        },

        error: function (xhr) {
            var a = "";
        }
    });

}


function MovetoNextAllIssueConsumables() {

    var listoldrecord;
    $('#listIssueConsumables option').each(function (i, selectedElement) {
        if ($("#listIssueConsumables option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $('#lstConsumablesStockRecord option').each(function (i, selectedElement) {
        if ($("#lstConsumablesStockRecord option").length > 0) {       
                listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');          
        }
    });

    $("#lstConsumablesStockRecord").html('');
  //  $("#lstConsumablesStockRecord").html(listrecord);
    $("#listIssueConsumables").html('');
    $("#listIssueConsumables").html(listoldrecord);
    //  $("#listIssueConsumables").sortSelect();

    $('#NoOfItems').val('');

    $("#NoOfItems").data("kendoNumericTextBox").value($("#listIssueConsumables")[0].length);
    if ($("#listIssueConsumables")[0].length == 0) {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(false);
    }
}

function MovetoNextIssueConsumables() {


    var listoldrecord;
    var listrecord;


    $('#listIssueConsumables option').each(function (i, selectedElement) {
        if ($("#listIssueConsumables option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });
 
    $('#lstConsumablesStockRecord option').each(function (i, selectedElement) {
        if ($("#lstConsumablesStockRecord option").length > 0) {

            if ($('#lstConsumablesStockRecord option')[i].selected) {
                listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');

            } else {

                listrecord = listrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
            }
        }
    });  

    $("#lstConsumablesStockRecord").html('');
    $("#lstConsumablesStockRecord").html(listrecord);
    $("#listIssueConsumables").html('');
    $("#listIssueConsumables").html(listoldrecord);
      
    $('#NoOfItems').val('');
  
    $("#NoOfItems").data("kendoNumericTextBox").value($("#listIssueConsumables")[0].length);
    if ($("#listIssueConsumables")[0].length == 0) {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(false);
    }

}

function ReverseIssueConsumables()
{

    var listoldrecord;
    var listrecord;


    $('#lstConsumablesStockRecord option').each(function (i, selectedElement) {
        if ($("#lstConsumablesStockRecord option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $('#listIssueConsumables option').each(function (i, selectedElement) {
        if ($("#listIssueConsumables option").length > 0) {

            if ($('#listIssueConsumables option')[i].selected) {
                listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');

            } else {

                listrecord = listrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
            }
        }
    });

    $("#lstConsumablesStockRecord").html('');
    $("#lstConsumablesStockRecord").html(listoldrecord);
    $("#listIssueConsumables").html('');
    $("#listIssueConsumables").html(listrecord);

    // $("#listIssueConsumables").sortSelect();

  

    $('#NoOfItems').val('');
  
    $("#NoOfItems").data("kendoNumericTextBox").value($("#listIssueConsumables")[0].length);
 
    if ($("#listIssueConsumables")[0].length == 0) {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(false);
    }
}

function ReverseAllIssueConsumables() {

    var listoldrecord;
    var listrecord;


    $('#lstConsumablesStockRecord option').each(function (i, selectedElement) {
        if ($("#lstConsumablesStockRecord option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $('#listIssueConsumables option').each(function (i, selectedElement) {
        if ($("#listIssueConsumables option").length > 0) {

            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');


        }
    });

    $("#lstConsumablesStockRecord").html('');
    $("#lstConsumablesStockRecord").html(listoldrecord);
    $("#listIssueConsumables").html('');

    if ($("#listIssueConsumables")[0].length == 0) {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_IssuableItem").data("kendoAutoComplete").enable(false);
    }

    $('#NoOfItems').val('');
  
    $("#NoOfItems").data("kendoNumericTextBox").value($("#listIssueConsumables")[0].length);
}

function OnSelectIssuableItem() {
    $("#lstConsumablesStockRecord").html('');
    $("#tblIssueConsumables").html('');
    $("#tblIssueConsumables").innerHTML = "";
    //   $('#divIssueConsumables').hide();

    //if ($('#IssuableItem').val().split('-')[1] == '1') {
    //    // BindConsumableStock();
    //    BindConsumableStockView();
    //    $('#divIssueConsumables').show();
    //} else {
    //    BindConsumableStockView();
    //    $("#tblIssueConsumables").html('');
    //    $("#tblIssueConsumables").innerHTML = "";
    //    $('#divIssueConsumables').hide();
    //}
}


function ExtraCondition(textId) {
    var filterAirport = cfi.getFilter("AND");

    if (textId == "Text_IssuableItem") {
        cfi.setFilter(filterAirport, "CitySno", "eq", userContext.CitySNo)
        var CurrencyAutoCompleteFilter = cfi.autoCompleteFilter([filterAirport]);
        return CurrencyAutoCompleteFilter;
    }

}

