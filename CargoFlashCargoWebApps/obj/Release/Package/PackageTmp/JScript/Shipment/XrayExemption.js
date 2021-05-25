
//var count = 0;
$(document).ready(function () {
   
   
   
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineCode", ["CarrierCode", "AirlineName"], null, "contains",",");
    cfi.AutoComplete("CommoditySNo", "CommodityCode,CommodityDescription","Commodity", "SNo", "CommodityCode", ["CommodityCode", "CommodityDescription"], null, "contains", ",");
    cfi.AutoComplete("SHCSNo", "SNo,Code", "SPHC", "SNo", "Code", ["Code"], null, "contains", ",");
    //cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    //cfi.BindMultiValue("AirlineSNo", $("#Text_AirlineSNo").val(), $("#AirlineSNo").val());
    //cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());
    cfi.AutoComplete("AirportCode", "AirportCode", "vwAirport", "SNo", "AirportCode", ["AirportCode"], null, "contains");
  
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    if ((pageType != "READ" && pageType != "DELETE") && $("#Text_AirlineSNo").val() == "" && $("#AirlineSNo").val() != "") {
        var values = $('#AirlineSNo').val();
       
       
        $.ajax({
            url: "Services/Shipment/XrayExemptionService.svc/GetXrayExemptionAirline",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ Values: values }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                debugger
                $("#Text_AirlineSNo").val(result);
            }
        });
    }
   
    cfi.BindMultiValue("AirlineSNo", $("#Text_AirlineSNo").val(), $("#AirlineSNo").val());
    
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    if ((pageType != "READ" && pageType != "DELETE") && $("#Text_CommoditySNo").val() == "" && $("#CommoditySNo").val() != "") {
        var values = $('#CommoditySNo').val();
        $.ajax({
            url: "Services/Shipment/XrayExemptionService.svc/GetXrayExemptionCommodity",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ Values: values }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                debugger
                $("#Text_CommoditySNo").val(result);
            }
        });
    }
    cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());

    var pageType = getQueryStringValue("FormAction").toUpperCase();
    if ((pageType != "READ" && pageType != "DELETE") && $("#Text_SHCSNo").val() == "" && $("#SHCSNo").val() != "") {
        var values = $('#SHCSNo').val();
        $.ajax({
            url: "Services/Shipment/XrayExemptionService.svc/GETSPECIAL",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ Values: values }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                debugger
                $("#Text_SHCSNo").val(result);


                }
            });
    }
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
  
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" )
    {
       
        if ($('#AirportCode').val() == '') {
            $("#ValidTo").val('');
        }
        $("#AirportCode").attr("value", userContext.AirportSNo);
        $("#Text_AirportCode").attr("value", userContext.AirportCode);
      
        $("#Text_AirportCode").attr("data-valid", "required");
        $("#Text_AirportCode").attr("data-valid-msg", "Select Airport");
        $("td[title='Select Airport']").html("<span style='color:red'>* </span>Airport").css("color", "black");
        $("#Text_AirportCode").closest("span").show();
    
    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto) {
            $(this).val("");
            alert('Valid From date cannot be greater than Valid To date.');
        }
    })

        $("input[id^=ValidTo]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("To", "From");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            //if (dfrom > dto) {
            //    $(this).val("");
            //    alert('Valid From date can not be greater than Valid To date.');
            //}
            if (dto < dfrom) {
                $(this).val("");
                alert('Valid To date cannot be Less than Valid From date.');
            }
        })

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#Text_AirportCode").attr("data-valid", "required");
        $("#Text_AirportCode").attr("data-valid-msg", "Select Airport");
        $("td[title='Select Airport']").html("<span style='color:red'>*</span>Airport").css("color", "black");
        $("Text_AirportCode").closest("span").show();

        //var NewVF;
        //var NewVT;
        //var obj = {
        //    //FromDate: $("#FromDate").val(),
        //    //ToDate: $("#ToDate").val(),
        //     NewVF: $("#ValidFrom").val(),
        //     NewVT: $("#ValidTo").val()

        

        //$("input[id^=ValidFrom]").change(function (e) {
        //    $.ajax({
        //        type: "GET",
        //        url: "Services/Shipment/XrayExemptionService.svc/CheckVFVTExistence",
        //        data: JSON.stringify(obj),
        //       // url: "Services/Shipment/FHLExportService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
        //        async: false,
        //        type: "POST",
        //        dataType: "json",
        //        cache: false,
        //       // data: JSON.stringify({ Values: values }),
        //        contentType: "application/json; charset=utf-8",
        //        success: function (result) {
        //            debugger
        //            alert('Airline Already Exists For this period');
        //        }
        //    });
        
            
      


        
        




    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto) {
            $(this).val("");
            alert('Valid From date can not be greater than Valid To date.');
        }
    });

        $("input[id^=ValidFrom]").change(function (e) {
            var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dfrom = new Date(Date.parse(k));
            var validFrom = $(this).attr("id").replace("From", "To");
            k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
            var dto = new Date(Date.parse(k));
            if (dfrom > dto) {
                $(this).val("");
                alert('Valid From date can not be greater than Valid To date.');
            }
        });
            
    }
      
        if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

            $("#Text_AirportCode").attr("data-valid", "required");
            $("#Text_AirportCode").attr("data-valid-msg", "Select Airport");
            $("td[title='Select Airport']").html("<span style='color:red'>* </span>Airport").css("color", "black");
            $("#Text_AirportCode").closest("span").show();

            $("input[id^=ValidFrom]").change(function (e) {
                var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dfrom = new Date(Date.parse(k));
                var validFrom = $(this).attr("id").replace("From", "To");
                k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dto = new Date(Date.parse(k));
                if (dfrom > dto) {
                    $(this).val("");
                    alert('Valid From date cannot be greater than Valid To date.');
                }
            })


            $("input[id^=ValidTo]").change(function (e) {
                var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dto = new Date(Date.parse(k));
                var validFrom = $(this).attr("id").replace("To", "From");
                k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
                var dfrom = new Date(Date.parse(k));
                //if (dfrom > dto) {
                //    $(this).val("");
                //    alert('Valid From date can not be greater than Valid To date.');
                //}
                if (dto < dfrom) {
                    $(this).val("");
                    alert('Valid To date cannot be Less than Valid From date.');
                }
            })
        }
});


