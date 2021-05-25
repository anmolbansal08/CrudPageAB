$(document).ready(function () {
    cfi.ValidateForm();

    cfi.AutoCompleteV2("ReturnFrom", "SNo,Name", "Inventory_Name",clearcontaint, "contains");
    cfi.AutoCompleteV2("ReturnableItem", "Sno,Item", "Inventory_ReturnableItem", null, "contains", null, null, null, null, OnSelectReturnableItem);
    $("#MasterSaveAndNew").hide();

    $("input[name=ReturnType]:radio").click(function () {
        cfi.ResetAutoComplete("ReturnFrom");
        if ($(this).attr("value") == "0") {
        
         
            var data = GetDataSourceV2("ReturnFrom", "IssueConsumables_ReturnFrom", null);
            cfi.ChangeAutoCompleteDataSource("ReturnFrom", data, false,  clearcontaint, "Name");

         
        }
        else {

            var data = GetDataSourceV2("ReturnFrom", "IssueConsumables_ReturnFrom2", null);
       
            cfi.ChangeAutoCompleteDataSource("ReturnFrom", data, false, clearcontaint, "AirlineName");
           
        }
        clearcontaint();
    });
    // BindConsumableStockView();


    $("#NoOfItems").blur(function (e) {

        if ($("#NoOfItems").val() != '' ) {
            var stockNoOfItem = $('#ReturnableItem').val().split('-')[1];
            var ReturnNoOfItem = $('#NoOfItems').val();
            if (parseInt(stockNoOfItem) < parseInt(ReturnNoOfItem)) {
                ShowMessage('warning', 'Warning - Return Stock Not Available.', null);
                $('#NoOfItems').val('');
                $("#NoOfItems").data("kendoNumericTextBox").value('');
                $('#divReturnConsumables').hide();
            } else {
                $('#divReturnConsumables').show();
                BindConsumableStockView();
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

            ConsumableArray = $("#listReturnConsumables option").map(function () { return $(this).val() }).get()

            if ($('#hdnNumberd').val() == 'True') {
                if (parseInt(ConsumableArray.length) == 0) {
                    ShowMessage('warning', 'Warning - Please add atleast 1 stock to return.', null);
                    return false;
                }
            }

         
            if (ConsumableArray.length > 0) {

             

                if (parseInt(ConsumableArray.length) != parseInt($('#NoOfItems').val())) {
                    ShowMessage('warning', 'Warning - Returnable item or no of item should be equal.', null);
                    return false;
                }


                for (var i = 0; i <= ConsumableArray.length; i++) {
                    //  $("#tblIssueConsumables tbody tr").each(function (i, e) {

                    var r = {

                        ConsumableSNo: $('#ReturnableItem').val().split('-')[0],
                        ConsumableStockTransSno: ConsumableArray[i],
                        ReturnType: $("input[name=ReturnType]:checked").val(),
                        ReturnToSNo: $('#ReturnFrom').val(),
                        NoOfItems: $('#NoOfItems').val(),
                        IssueConsumableSno: 0



           
                    }
                    lstItem.push(r);

                    //  });
                }
            } else {

                var r = {

                    ConsumableSNo: $('#ReturnableItem').val().split('-')[0],
                    ConsumableStockTransSno: 0,
                     ReturnType: $("input[name=ReturnType]:checked").val(),
                    ReturnToSNo: $('#ReturnFrom').val(),
                    NoOfItems: $('#NoOfItems').val(),
                    IssueConsumableSno: 0

                }
                lstItem.push(r);
            }

            var lstConsumabIssue = JSON.stringify(lstItem);
            $.ajax({
                url: "./Services/Inventory/ReturnConsumableService.svc/CreateReturnConsumables",
                async: false, type: "POST", dataType: "json", cache: false,
                data: lstConsumabIssue,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (eval(data) == 2003) {
                        //BindAWBSwap();
                        ShowMessage('success', 'Success!', 'Saved Successfully');

                    }

                },
                error: function (ex) {
                    var ss = 1;

                }
            });

        }

    })
    $('#divReturnConsumables').hide();
    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' ) {
        $('#__SpanHeader__').html("Return Inventory Form - Detail View:")
     
     //   if ($('#ReturnableItem').val().split('-')[1] == 1)
            BindIssueConsumableEdit();
        $('#NoOfItems').attr('disabled', 'disabled');
        $('#divReturnConsumables').hide();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == 'READ') {
        $('#__SpanHeader__').html("Return Inventory Form - Detail View:")
      //  if ($('#IssuableItems').val().split('-')[1] == 1)
        BindIssueConsumableEdit();
        $('#divReturnConsumables').hide();

    }

    
});


function clear() {

    cfi.ResetAutoComplete("ReturnableItem");
}


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");
    if (textId == "Text_ReturnableItem") {
        try {
            cfi.setFilter(filterAirline, "IssuedType", "eq", $("input[name=ReturnType]:checked").val())
            cfi.setFilter(filterAirline, "IssuedToSno", "eq", $('#ReturnFrom').val())
            cfi.setFilter(filterAirline, "CitySno", "eq", userContext.CitySNo);
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }

   
  
}

//function OnSelectReturnItem(e) {   
//    if ($('#ReturnableItem').val().split('-').length > 0) {
//        $("#NoOfItems").val($('#ReturnableItem').val().split('-')[1]);
//        $("#_tempNoOfItems").val($('#ReturnableItem').val().split('-')[1]);
//        $("#TotalNoOfItems").val($('#ReturnableItem').val().split('-')[1]);
//        $("#TotalNoOfItems").textContent = $('#ReturnableItem').val().split('-')[1];
//    }
//}



function BindConsumableStockView() {
    var consumableSno = $('#ReturnableItem').val().split('-')[0];
    $("#lstIssueConsumablesRecord").html("");
    $("#listReturnConsumables").html("");
    if (consumableSno == '') {
        $('#divReturnConsumables').hide();
        return false;
    }

  
    $.ajax({
        url: "./Services/Inventory/ReturnConsumableService.svc/GetConsumableIssueRecordForRetun",
        async: false,
        type: "GET",
        dataType: "json",
        data: { ConsumableSno: consumableSno, NoOfItems: $('#NoOfItems').val(), ReturnType: $("input[name=ReturnType]:checked").val(), ReturnFrom: $('#ReturnFrom').val() },
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
                    $('#hdnNumberd').val(myData.Table0[0].Numbered);
                    SPHCvaluecount = myData.length;
                    for (var num = 0; num < myData.Table0.length; num++) {

                        if (num < (item)) {
                            genHtml = genHtml + ('<option value="' + myData.Table0[num].ConsumableStockTransSno + '" >' + myData.Table0[num].Consumables + '</option>');

                        } else {
                           
                            listrecord = listrecord + ('<option value="' + myData.Table0[num].ConsumableStockTransSno + '" >' + myData.Table0[num].Consumables + '</option>');
                        }
                    }
                   
                    $("#lstIssueConsumablesRecord").html("");
                    $("#lstIssueConsumablesRecord").html(listrecord);

                    $("#listReturnConsumables").html("");
                    $("#listReturnConsumables").html(genHtml);
                    
                    $("#Text_ReturnableItem").data("kendoAutoComplete").enable(false)
                    $('ul').sortable({

                        connectWith: 'ul',
                        dropOnEmpty: true
                        //items: "div:not(.ignoreMe)"
                    });

                } else { $('#divReturnConsumables').hide(); }

                //else { $(".btn-success").show(); }
            } else {
                ShowMessage('warning', 'Warning - Stock Not Available', null);
            }
            return false
        },

        error: function (xhr) {
            var a = "";
        }
    });
}


function BindIssueConsumableEdit() {

    var ConsumableSno = $('#hdnReturnConsumablesSNo').val();


    $.ajax({
        url: "./Services/Inventory/ReturnConsumableService.svc/GetReturnConsumableTransRecord",
        async: false,
        type: "GET",
        dataType: "json",
        data: { Sno: ConsumableSno },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            var myData = jQuery.parseJSON(result);



            if (myData.Table1.length > 0) {
                BindReturnConsumable();
                var item = $('#NoOfItem').val();
                var startrange = $('#ConsumableNoStart').val();
                var lstItem = [];
                for (var i = 0; i < myData.Table1.length; i++) {
                    var r = {
                        SNo: 0,
                        ConsumablePrefix: myData.Table1[i].ConsumablePrefix,
                        ConsumableType: myData.Table1[i].ConsumableType,
                        ConsumableNo: myData.Table1[i].ConsumableNo

                    }

                    lstItem.push(r);

                }


                $("#tblReturnConsumables").appendGrid('load', JSON.parse(JSON.stringify(lstItem)));


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
function BindReturnConsumable() {

    //var citycode = $('#hdnCityCode').val();
    var consumableSno = $('#ReturnableItem').val().split('-')[0];

    var ConsumableStock = "ReturnConsumables";
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
        caption: "Return Inventory Stock",
        initRows: 1,
        rowNumColumnName: 'SNo',

        columns: [{ name: 'SNo', type: 'hidden' },
                { name: 'ConsumablePrefix', display: 'Consumable Prefix', type: 'label' },
                { name: 'ConsumableType', display: 'Consumable Type', type: 'label' },
                { name: 'ConsumableNo', display: 'Consumable No.', type: 'label' }  


        ],

        //  hideButtons: { remove: true, removeLast: true },
        //hideButtons: { append: true, remove: true, removeLast: true },
        hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true },
        isPaging: true

    });
}

function MovetoNextAllIssueConsumables() {

    var listoldrecord;
    $('#listReturnConsumables option').each(function (i, selectedElement) {
        if ($("#listReturnConsumables option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $('#lstIssueConsumablesRecord option').each(function (i, selectedElement) {
        if ($("#lstIssueConsumablesRecord option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $("#lstIssueConsumablesRecord").html('');
    //  $("#lstIssueConsumablesRecord").html(listrecord);
    $("#listReturnConsumables").html('');
    $("#listReturnConsumables").html(listoldrecord);

    $('#NoOfItems').val('');
    $("#NoOfItems").data("kendoNumericTextBox").value($("#listReturnConsumables")[0].length);
    if ($("#listReturnConsumables")[0].length == 0) {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(false);
    }


}

function MovetoNextIssueConsumables() {


    var listoldrecord;
    var listrecord;


    $('#listReturnConsumables option').each(function (i, selectedElement) {
        if ($("#listReturnConsumables option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $('#lstIssueConsumablesRecord option').each(function (i, selectedElement) {
        if ($("#lstIssueConsumablesRecord option").length > 0) {

            if ($('#lstIssueConsumablesRecord option')[i].selected) {
                listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');

            } else {

                listrecord = listrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
            }
        }
    });

    $("#lstIssueConsumablesRecord").html('');
    $("#lstIssueConsumablesRecord").html(listrecord);
    $("#listReturnConsumables").html('');
    $("#listReturnConsumables").html(listoldrecord);

    $('#NoOfItems').val('');
    $("#NoOfItems").data("kendoNumericTextBox").value($("#listReturnConsumables")[0].length);
    if ($("#listReturnConsumables")[0].length == 0) {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(false);
    }
}

function ReverseIssueConsumables() {

    var listoldrecord;
    var listrecord;


    $('#lstIssueConsumablesRecord option').each(function (i, selectedElement) {
        if ($("#lstIssueConsumablesRecord option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $('#listReturnConsumables option').each(function (i, selectedElement) {
        if ($("#listReturnConsumables option").length > 0) {

            if ($('#listReturnConsumables option')[i].selected) {
                listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');

            } else {

                listrecord = listrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
            }
        }
    });

    $("#lstIssueConsumablesRecord").html('');
    $("#lstIssueConsumablesRecord").html(listoldrecord);
    $("#listReturnConsumables").html('');
    $("#listReturnConsumables").html(listrecord);

    $('#NoOfItems').val('');
    $("#NoOfItems").data("kendoNumericTextBox").value($("#listReturnConsumables")[0].length);
    if ($("#listReturnConsumables")[0].length == 0) {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(false);
    }
}

function ReverseAllIssueConsumables() {

    var listoldrecord;
    var listrecord;


    $('#lstIssueConsumablesRecord option').each(function (i, selectedElement) {
        if ($("#lstIssueConsumablesRecord option").length > 0) {
            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');
        }
    });

    $('#listReturnConsumables option').each(function (i, selectedElement) {
        if ($("#listReturnConsumables option").length > 0) {

            listoldrecord = listoldrecord + ('<option value=' + $(selectedElement).val() + ' >' + $(selectedElement).html() + '</option>');


        }
    });

    $("#lstIssueConsumablesRecord").html('');
    $("#lstIssueConsumablesRecord").html(listoldrecord);
    $("#listReturnConsumables").html('');

    $('#NoOfItems').val('');
    $("#NoOfItems").data("kendoNumericTextBox").value($("#listReturnConsumables")[0].length);
    if ($("#listReturnConsumables")[0].length == 0) {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(true);
    } else {
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(false);
    }
}
function OnSelectReturnableItem() {

    $("#lstIssueConsumablesRecord").html('');
    $("#listReturnConsumables").html('');
    $("#listReturnConsumables").innerHTML = "";
}

function clearcontaint() {
    $('#NoOfItems').val('');
    $("#NoOfItems").data("kendoNumericTextBox").value('');  
        $("#Text_ReturnableItem").data("kendoAutoComplete").enable(true);
        $("#lstIssueConsumablesRecord").html('');
        $("#listReturnConsumables").html('');
        $("#listReturnConsumables").innerHTML = "";

        cfi.ResetAutoComplete("ReturnableItem");
}