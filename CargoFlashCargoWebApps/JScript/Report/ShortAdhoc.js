var AirlineAccess = "";
var IsAllAirline = 0;
$(document).ready(function () {
   
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "SpotRate_AirlineCode", null, "contains");
    cfi.AutoCompleteV2("OriginCitySNo", "CityCode,CityName", "SpotRate_OriginCode", null, "contains");
    //cfi.AutoCompleteV2("OriginCitySNo", "CityCode,CityName", "ShortAdhoc_Origin", null, "contains");
    cfi.AutoCompleteV2("DestinationCitySNo", "CityCode,CityName", "SpotRate_DestinationCode", null, "contains"); 
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    //$('#AirlineSNo').val(userContext.AirlineSNo)
    //$('#Text_AirlineSNo').val(userContext.AirlineName);
    $('#Approve').css('display', 'none')
    $('#Reject').css('display', 'none')
   
  
    $.ajax({
        url: "../schedule/GetAirports", async: false, type: "POST", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result[0] != undefined && result[0] != null) {

                AirlineAccess = result[0].Airlines.TrimRight();
                IsAllAirline = parseInt(result[0].IsAllAirlines);
            }
        }
    });
});


function ExtraCondition(textId) {

    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }

    else if (textId.indexOf("Text_OriginCitySNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNo", "neq", $("#DestinationCitySNo").val().split('-')[0]);
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        //cfi.setFilter(filter1, "CitySNo", "eq", userContext.CitySNo);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    else if (textId.indexOf("Text_DestinationCitySNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "SNo", "neq", $("#OriginCitySNo").val().split('-')[0]);
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
  
    var filterOrigin = cfi.getFilter("AND");
    var filterDest = cfi.getFilter("AND");
  
    if (textId == "Text_OriginSNo") {
        try {

            cfi.setFilter(filterOrigin, "SNo", "notin", $("#DestinationSNo").val());

            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterOrigin]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_DestinationSNo") {
        try {
            cfi.setFilter(filterDest, "SNo", "notin", $("#OriginSNo").val());
            var Dest = cfi.autoCompleteFilter([filterDest]);
            return Dest;
        }
        catch (exp)
        { }
    }
   
}



var Model = [];
function search1() {

    Model = {
        FromDate: $('#FromDate').val(),
        ToDate: $('#ToDate').val(),
        AirlineSNo: $('#AirlineSNo').val() == "" ? "" : $('#AirlineSNo').val(),
        AWBSNo: $('#Text_AwbSNo').val() == "" ? "" : $('#Text_AwbSNo').val(),
        OriginSNo: $('#OriginCitySNo').val() == "" ? "" : $('#OriginCitySNo').val(),
        DestinationSNo: $('#DestinationCitySNo').val() == "" ? "" : $('#DestinationCitySNo').val()

    };
    $('#grid').css('display', 'none')
    $("#grid").show();
    var grid=  $("#grid").kendoGrid({
        autoBind: true,
        dataSource: new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: false,
            serverFiltering: false,
            pageSize: 10,
            transport: {
                read: {
                    url: "../ShortAdhoc/GetShortAdhocRequest",
                    dataType: "json",
                    global: true,
                    type: 'GET',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    data: function GetDetail() {
                        return { Model: Model };
                    }

                }, parameterMap: function (options) {
                    if (options.filter == undefined)
                        options.filter = null;
                    if (options.sort == undefined)
                        options.sort = null; return JSON.stringify(options);
                },
            },
            schema: {
                model: {
                    id: "SNo",
                    fields: {
                        AWBNo: { type: "string",editable:false },
                        Origin: { type: "string", editable: false },
                        Destination: { type: "string", editable: false },
                        AirlineName: { type: "string", editable: false },
                        ReqType: { type: "string", editable: false },
                        AgentName: { type: "string", editable: false },
                        Commodity: { type: "string", editable: false },
                        ChargeableWeight: { type: "number", editable: false },
                        VolumeWeight: { type: "number", editable: false },
                        Currency: { type: "string", editable: false },
                        ApprovedStatus: { type: "string", editable: false },
                        RASNo: { type: "string", editable: false },
                        RequestedRate: { type: "number", editable: false },
                        Rate: { type: "number", editable: false },
                        ApprovedRate: { type: "number", validation: { min: 0, required: true } },
                        RequestedBy: { type: "string", editable: false },
                        RequestedOn: { type: "string", editable: false },                  
                    
                    }
                },

                data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
            },

        }),
        editable: true,
        selectable: "multiple row",
        sortable: false,
        pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: true, },

        scrollable: true,
        
        columns: [

           //{ template: "<input type='checkbox' class='checkbox' />",title:"Select", width: 10},

            {template: function (dataItem) {
                return "<input type='checkbox'  id='cb1_" + dataItem.RASNo + "' class='check-box-inner'>";
            },
            width: 10,
            headerTemplate: "<input type='checkbox' id='allcb' name='allcb'  /> <label>Select</label>",
            title: 'Select',
            field: "RASNo",
            },
           
            { field: "AirlineName", title: "Airline Name", width: 20 },
            { field: "ReqType", title: "Req Type", width: 20 },
            { field: "AWBNo", title: "AWB No", width: 20 },
            { field: "Origin", title: "Origin", width: 20 },
            { field: "Destination", title: "Destination", width: 20 },
            { field: "AgentName", title: "AgentName", width: 20 },
            { field: "Commodity", title: "Commodity", width: 20 },
            { field: "ChargeableWeight", title: "Chargeable Weight", width: 20 },
            { field: "VolumeWeight", title: "Volume Weight", width: 20 },
            { field: "Currency", title: "Currency", width: 20 },
            { field: "Rate", title: "Rate", width: 20, },
            { field: "RequestedRate", title: "Requested Rate", width: 20, },
            {
                field: "ApprovedRate", title: "Approved Rate", width: 20,
                template: function (dataItem) {
                    return " <input value='" + dataItem.ApprovedRate + "'  id='txtRate_" + dataItem.RASNo + "'  data-bind='value:ApprovedRate' type='number' width='10' class='k-textbox check-box-inner' data-role='numerictextbox' />";
                    }
            },

            { field: "ApprovedStatus", title: "Approved Status", width: 20 },
            { field: "RequestedBy", title: "Requested By", width: 20 },
            { field: "RequestedOn", title: "Requested Date", width: 20 },
        ]
    });
    $("#grid").data('kendoGrid').dataSource.page(1);

    $('#allcb').prop('checked', false);


    $('#allcb').change(function () {

        if ($(this).prop('checked')) {

            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', true);
            });
        } else {
            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', false);
            });
        }
    });

   
    $('#Approve').css('display', 'inline-block')
     $('#Reject').css('display', 'inline-block')
}
function onDataBound(e) {
    var view = this.dataSource.view();
    for (var i = 0; i < view.length; i++) {
        if (checkedIds[view[i].id]) {
            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
              .addClass("k-state-selected")
              .find(".checkbox")
              .attr("checked", "checked");
        }
    }
}
function Approve() {
   
    var arrayOfValues = [];

    $('[id^="cb1_"]').each(function () {


        var $this = $(this);
        if ($this.is(":checked")) {
      
            var sno = $(this).attr('id').replace('cb1_', '');
            var Array = {
                RASNo: sno,
                ApprovalStatus: "Approve",
                ApprovedAmount: $(this).closest('tr').find('#txtRate_'+ sno).val(),
            }
            arrayOfValues.push(Array);
        }
       
    });
 
    if (arrayOfValues.length > 0) {

        $.ajax({
            url: "Approve", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AwbNoList: arrayOfValues }),
            success: function (result) {
                var GetSucessResult = JSON.parse(result).Table0[0].Column1;
                if (GetSucessResult == 0) {
                 
                    ShowMessage('success', 'Success - Short Adhoc request !', "Short Adhoc request approved Successfully !");
                    search1();
                   
                }
                else {

                }
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Short Adhoc request ', "Kindly select at-least one Air Waybill");
    }
}


function Reject() {

    var arrayOfValues = [];

    $('[id^="cb1_"]').each(function () {


        var $this = $(this);
        if ($this.is(":checked")) {
            var Array = {
                RASNo: $(this).attr('id').replace('cb1_', ''),
                ApprovalStatus: "Reject",
                ApprovedAmount: 0
            }

            arrayOfValues.push(Array);
        }

    });
    if (arrayOfValues.length > 0) {

        $.ajax({
            url: "Approve", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AwbNoList: arrayOfValues }),
            success: function (result) {
                var GetSucessResult = JSON.parse(result).Table0[0].Column1;
                if (GetSucessResult == 0) {                  
                    ShowMessage('success', 'Success - Short Adhoc request !', "Short Adhoc request rejected Successfully !");
                    search1();                    
                }
                else {

                }
            }
        });
    }
    else {
        //alert('Please Check atlease One AWB No')
        ShowMessage('warning', 'Warning - Short Adhoc request ', "Kindly select at-least one Air Waybill");
    }
}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_Airline") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}


if (typeof String.prototype.TrimRight !== 'function') {
    String.prototype.TrimRight = function (char) {
        if (this.lastIndexOf(char))
            return this.slice(0, this.length - 1);
        else
            return this;

    }
}