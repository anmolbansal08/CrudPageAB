//Javascript file for CityConnectionTime Page for binding Autocomplete
var ListCommoditySubGroup = [];
$(document).ready(function () {


    //  bindCommoditySubGroup();

    cfi.ValidateForm();
    cfi.AutoCompleteByDataSource("CommoditySubGroupSNo", ListCommoditySubGroup, null, null);
    //  cfi.AutoComplete("CommoditySubGroupSNo", "SNo,SubGroupName", "vwCommoditySubGroup", "SNo", "SubGroupName", null, null, "contains");
    cfi.AutoComplete("DensityGroupSNo", "SNo,GroupName", "vwCommodityDensityGroup", "SNo", "GroupName", null, null, "contains");
    cfi.AutoComplete("SHCSNo", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains", ",");
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val())
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });

    $("#CommodityCode").keypress(function (evt) {

        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });

    $("#CommodityCode").blur(function (e) {
        bindCommoditySubGroup();
        if (ListCommoditySubGroup.length > 0) {
            cfi.ChangeAutoCompleteDataSource("CommoditySubGroupSNo", ListCommoditySubGroup, null, null);
        } else {
            $('#CommoditySubGroupSNo').val('');
            $('#Text_CommoditySubGroupSNo').val('');
            ListCommoditySubGroup = [];
            cfi.ChangeAutoCompleteDataSource("CommoditySubGroupSNo", ListCommoditySubGroup, null, null);
        }
    });
});


function bindCommoditySubGroup() {

    $.ajax({
        url: "Services/Master/CommodityService.svc/GetCommoditySubGroupType", async: false, type: "POST", dataType: "json", cache: false,

        data: JSON.stringify({ Code: $('#CommodityCode').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var routeDetail = Data.Table0;
            if (Data.Table0.length > 0) {
                var out = '[';
                $.each(routeDetail, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ Key: "' + routeDetail[i].SNO + '", Text: "' + routeDetail[i].Subgroupname + '"}'
                        }
                        else {
                            out = out + '{ Key: "' + routeDetail[i].SNO + '", Text: "' + routeDetail[i].Subgroupname + '"}'
                        }
                    }
                });

                out = out + ']';
                ListCommoditySubGroup = eval(out);
            }
            else { ListCommoditySubGroup = []; }

        }
    });

}