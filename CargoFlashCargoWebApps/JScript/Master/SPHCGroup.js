
/*
*****************************************************************************
Javascript Name:	SPHCGroupJS     
Purpose:		    This JS used to get Grid data for SPHC Group Trans.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    21 May 2014
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
//var strData = [];
$(function () {
    debugger
    cfi.AutoCompleteV2("SHCCode", "SNo,Code", "SHCGroup_SHCCode", null, "contains", ",");
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    if ((pageType != "READ" && pageType != "DELETE") && $("#Text_SHCCode").val() == "" && $("#SHCCode").val() != "") {
        var values = $('#SHCCode').val();
        $.ajax({
            url: "Services/Master/SPHCGroupService.svc/GetSPHCCodes",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ Values: values }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                debugger
                $("#Text_SHCCode").val(result);
            }
        });
    }
    cfi.BindMultiValue("SHCCode", $("#Text_SHCCode").val(), $("#SHCCode").val());
    $("#Name").on('drop', function () {
        return false;
    });
  
    $('#Name').on("contextmenu", function (e) {
        //alert('Right click disabled');
        return false;
    });

});
function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_SHCCode")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#SHCCode").val()), cfi.autoCompleteFilter(textId);
}

//$.validator.addMethod(
//        "alphabetsOnly",
//        function (value, element, regexp) {
//            var re = new RegExp(regexp);
//            return this.optional(element) || re.test(value);
//        },
//        "Please check your input values again!!!."
//);
//$("#Name").rules("add", { alphabetsOnly: "^[a-zA-Z'.\\s]$" })