/*
*****************************************************************************
Javascript Name:	UserProfile JS     
Purpose:		    This JS used to get Tab for UserProgile.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Pradeep Sharma
Created On:		    27 March 2015
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/

var UserSNo = "";
var CitySNo = "";
var getdata = "";
var getCitydata = "";
$(document).ready(function () {
    
    cfi.ValidateForm();
    cfi.AutoComplete("CitySNo", "CityName,CityCode", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("WareHouseMasterSNo", "WarehouseName,AirportSNo", "WarehouseMaster", "SNo", "WarehouseName", null, "contains");
    cfi.AutoComplete("AllowCitySNo", "CityName,CityCode", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains", ",");
    cfi.AutoComplete("LanguaugeSNo", "LanguaugeName", "Language", "SNo", "LanguaugeName", null, "contains");
    cfi.AutoComplete("MobileCountryCode", "MobileCountryCode", "Country", "MobileCountryCode", "MobileCountryCode", null, null, "contains");
    cfi.AutoComplete("GroupSNo", "GroupName", "Groups", "SNo", "GroupName", ["GroupName"], OnAdminChange, "contains");
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if ($('#Text_GroupSNo').val() == "ADMIN") {
            $("#spnCompanyName").hide();

        }
        if ($("#CityChangeAllowed").val() == "NO") {
            $("#spnMultipleCity").hide();
        }
        $('#MasterDuplicate').css('display', 'none');
        $('.floatingHeader').css('display', 'none');
        $('#aspnetForm').attr("enctype", "multipart/form-data");
        $("input[name='operation']").addClass('removeop');
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liAllowDoor'));
        $('#btnBack1').click(function () {
            navigateUrl('Default.aspx?Module=Security&Apps=UserProfile&FormAction=INDEXVIEW');
        });
        UserSNo = $('#hdnUesrSNo')[0].value;
        CitySNo = $('#hdnCitySNo')[0].value;
        UsersCity(UserSNo)
        UsersCityData(UserSNo)
        CreateAllowDoorToUserTab();
        $('#aspnetForm').attr("enctype", "multipart/form-data");
        $("input[name='operation']").addClass('removeop');
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liAllowDoor'));
        $('#btnBack1').click(function () {
            navigateUrl('Default.aspx?Module=Security&Apps=UserProfile&FormAction=INDEXVIEW');
        });
       
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        if ($('#Text_GroupSNo').val() == "ADMIN") {
            $("#spnCompanyName").hide();

        }
        if ($("#CityChangeAllowed").val() == "NO") {
            $("#spnMultipleCity").hide();
        }
        $('#aspnetForm').attr("enctype", "multipart/form-data");
        $("input[name='operation']").addClass('removeop');
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liAllowDoor'));
        $('#btnBack1').click(function () {
            navigateUrl('Default.aspx?Module=Security&Apps=UserProfile&FormAction=INDEXVIEW');
        });

        UserSNo = $('#hdnUesrSNo')[0].value;
        CitySNo = $('#hdnCitySNo')[0].value;
        UsersCity(UserSNo)
        UsersCityData(UserSNo)
        CreateAllowDoorToUserTab();
        $('#MobileCountryCode').closest('td').find('.k-combobox ').css('width', '70px');
        if ($('#MobileCountryCode').val() == "")
            $('#Phone').attr('readOnly', 'readOnly');
        $("#Password").hide();
        $("#Password").addClass('pwdtextbox');
        $("#Address").removeClass('k-nput');
        $("#Address").addClass('pwdtextbox');     
    }
    $("#tblUserDoorRights_btnRemoveLast").hide();
});
function OnAdminChange() {
    var val = $("#Text_GroupSNo").val();
    if (val == "ADMIN") {

        var closestTr = $('input:text[id^=Company]').closest('tr');
        closestTr.find('td').hide();

    }
    else {
        $('input:text[id^=Company]').attr("data-valid", "required");
        var closestTr = $('input:text[id^=Company]').closest('tr');
        closestTr.find('td').show();
    }

}

function ShowHidePassword() {
    if ($("#Password").val() != "") {
        if ($('#ShowPassword').val().toLowerCase() == "hide password") {
            $('span#TempPassword').text("");
            $('#ShowPassword').val("Show Password");
        }
        else {
            $('span#TempPassword').text('(Entered Password - ' + $("#Password").val() + ')');
            $('#ShowPassword').val("Hide Password");
        }
    }
    else {
        ShowMessage('info', 'Information', "Enter Password");
    }
}
function AllowDoorToUserTab() {
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        CreateAllowDoorToUserTab();
    }

}
function CreateAllowDoorToUserTab() {
    //AutoComplete("logincity", "CityWithTimeZone", "UserSNo = " + $("#UserLoginSNo").val(), "CitySNo", "CityWithTimeZone", null, ClearAirportandWarehouse, "contains", null, null, null, "ChangeCityAutoCompleteGetList");
    if (cfi.IsValidSubmitSection()) {
        var UserDoorRights = "UserDoorRights";
        var pageType = $('#hdnPageType').val();
        $('#tbl' + UserDoorRights).appendGrid({
            tableID: 'tbl' + UserDoorRights,
            contentEditable: true,
            tableColume: 'UserSNo,AirPortSNo,WareHouseMasterSNo,BayMasterSNo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdateOn',
            masterTableSNo: $('#hdnUesrSNo').val(),
            contentEditable: pageType != 'READ',
            currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: '',
            servicePath: './Services/Permissions/UserProfileService.svc',
            getRecordServiceMethod: 'GetUserDoorRightsRecord',
            createUpdateServiceMethod: 'CreateUpdateUserDoorRights',
           // deleteServiceMethod: 'DeleteUserDoorRights',
            caption: 'Allow User Door',
            initRows: 1,
            columns: [{ name: 'SNo', type: 'hidden', value: '0' },
                      { name: 'UserSNo', type: 'hidden', value: $('#hdnUesrSNo').val() },
                      { name: 'CitySNo', display: 'City', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, onChange: function (evt, rowIndex) { }, addOnFunction: "ClearAirportandWareHouseAndDoor(this.id);", isRequired: true, tableName: 'City', textColumn: 'CityName', keyColumn: 'SNo', filterCriteria: "contains" },
                      { name: 'AirPortSNo', display: 'Airport Name', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, onChange: function (evt, rowIndex) { }, addOnFunction: "ClearWareHouseAndDoor(this.id);", isRequired: true, tableName: 'Airport', textColumn: 'AirportName', keyColumn: 'SNo', filterCriteria: "contains" },
                      { name: 'WareHouseMasterSNo', display: 'Warehouse Name', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, onChange: function (evt, rowIndex) { }, addOnFunction: "ClearDoor(this.id);", isRequired: true, tableName: 'WarehouseMaster', textColumn: 'WarehouseName', keyColumn: 'SNo', filterCriteria: "contains", separator: null },
                      { name: 'BayMasterSNo', display: 'Door Name', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, onChange: function (evt, rowIndex) { }, isRequired: false, tableName: 'BayMaster', textColumn: 'BayName', keyColumn: 'SNo', filterCriteria: "contains", separator: "," },
                    { name: pageType == 'READ' ? 'Active' : 'IsActive', display: 'Active', type: 'select', ctrlAttr: { class: 'k-dropdown-wrap k-input' }, ctrlOptions: { 0: 'No', 1: 'Yes' }, onChange: function (evt, rowIndex) { }, isRequired: true, selectedIndex: 1 },

                   { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                      { name: 'UpdatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
               { name: 'CreatedUser', display: 'Created By', type: 'label', value: '' },
               { name: 'UpdatedUser', display: 'Updated By', type: 'label', value: '' }
            ],

            hideButtons: { append: false, remove: true, removeLast: true },
            isPaging: true
        });
        getRecord();
    }
    else {
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liAllowDoor'));
        return false;
    }

    

    $("#tblUserDoorRights_btnRemoveLast").hide();
}
function ClearDoor(id) { 
    var rowIndex = id.split('_')[2];
    $("#tblUserDoorRights_HdnBayMasterSNo_" + rowIndex).val('');
    $("#tblUserDoorRights_BayMasterSNo_" + rowIndex).val('');
    //$("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').remove();
    $("#Multi_tblUserDoorRights_BayMasterSNo_" + rowIndex).val('');
    $("#FieldKeyValuestblUserDoorRights_BayMasterSNo_" + rowIndex)[0].innerHTML='';
    $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').each(function (i) {
        if (i > 0) {
            $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').eq(1).remove();
        }
    });
}
function ClearWareHouseAndDoor(id)
{
    var rowIndex = id.split('_')[2];
    $('#tblUserDoorRights_WareHouseMasterSNo_' + rowIndex).val('');
    $('#tblUserDoorRights_HdnWareHouseMasterSNo_' + rowIndex).val('');
    $("#tblUserDoorRights_HdnBayMasterSNo_" + rowIndex).val('');
    $("#tblUserDoorRights_BayMasterSNo_" + rowIndex).val('');
  //  $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').remove();

    $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').each(function (i)
    {
        if (i > 0) {
            $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').eq(1).remove();
        }
    });
}
function ClearAirportandWareHouseAndDoor(id) {
    var rowIndex = id.split('_')[2];
    $('#tblUserDoorRights_AirPortSNo_' + rowIndex).val('');
    $('#tblUserDoorRights_HdnAirPortSNo_' + rowIndex).val('');

    $('#tblUserDoorRights_WareHouseMasterSNo_' + rowIndex).val('');
    $('#tblUserDoorRights_HdnWareHouseMasterSNo_' + rowIndex).val('');
    $("#tblUserDoorRights_HdnBayMasterSNo_" + rowIndex).val('');
    $("#tblUserDoorRights_BayMasterSNo_" + rowIndex).val('');
    //  $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').remove();

    $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').each(function (i) {
        if (i > 0) {
            $("#divMultitblUserDoorRights_BayMasterSNo_" + rowIndex).find('ul >li').eq(1).remove();
        }
    });
}
function ExtraCondition(textId) {
    var filterConsolidatorSNo = cfi.getFilter("AND");
    if (textId == "Text_AllowCitySNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        
        if (textId.indexOf("CitySNo") >= 0)
            cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $("#Text_CitySNo").data("kendoAutoComplete").key());
    }

    //====================Condition For Grid City================================================
    if (textId.indexOf("tblUserDoorRights_CitySNo") >= 0) {
        var noOfRows = $('#tblUserDoorRights_rowOrder').val();
        for (var i = 0; i <= noOfRows.split(',').length; i++) {
            if ($('#tblUserDoorRights_HdnCitySNo_' + noOfRows.split(',')[i]).val() != undefined &&
                $('#tblUserDoorRights_HdnCitySNo_' + noOfRows.split(',')[i]).val() != '') {
                cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
                
                if (getCitydata != "0")
                    cfi.setFilter(filterConsolidatorSNo, "SNo", "in", getCitydata);
            }
            else {
                cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
                
                if (getCitydata != "0")
                    cfi.setFilter(filterConsolidatorSNo, "SNo", "in", getCitydata);
            }
        }
    }


    //====================Condition For Airport================================================
    if (textId.indexOf("tblUserDoorRights_AirPortSNo") >= 0) {
        //var noOfRows = $('#tblUserDoorRights_rowOrder').val();
        //for (var i = 0; i <= noOfRows.split(',').length; i++) {
        //    if ($('#tblUserDoorRights_HdnAirPortSNo_' + noOfRows.split(',')[i]).val() != undefined &&
        //        $('#tblUserDoorRights_HdnAirPortSNo_' + noOfRows.split(',')[i]).val() != '' &&
        //        'tblUserDoorRights_HdnAirPortSNo_' + noOfRows.split(',')[i] != 'tblUserDoorRights_HdnAirPortSNo_' + textId.split('_')[2]) {
        //        cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $('#tblUserDoorRights_HdnAirPortSNo_' + noOfRows.split(',')[i]).val());
        //        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $('#tblUserDoorRights_HdnCitySNo_' + noOfRows.split(',')[i]).val());
        //    }
        //}
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
     
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $('#tblUserDoorRights_HdnCitySNo_' + textId.split('_')[2]).val());
        
    }

    ////====================Condition For Airport================================================
    //if (textId.indexOf("tblUserDoorRights_AirPortSNo") >= 0) {
    //    var noOfRows = $('#tblUserDoorRights_rowOrder').val();
    //    for (var i = 0; i <= noOfRows.split(',').length; i++) {
    //        if ($('#tblUserDoorRights_HdnAirPortSNo_' + noOfRows.split(',')[i]).val() != undefined &&
    //            $('#tblUserDoorRights_HdnAirPortSNo_' + noOfRows.split(',')[i]).val() != '') {
               
    //            cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
   
    //            cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", getdata);
    //            //'tblUserDoorRights_WareHouseMasterSNo_' + noOfRows.split(',')[i].val()==""
    //            //$('#tblUserDoorRights_HdnWareHouseMasterSNo_' + noOfRows.split(',')[i]).val()==""
    //        }
    //        else {
    //            cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);

    //            cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", getdata);

    //        }
    //    }
    //}
    //====================Condition For Warehouse================================================
    if (textId.indexOf("tblUserDoorRights_WareHouseMasterSNo") >= 0) {
        var noOfRows = $('#tblUserDoorRights_rowOrder').val();
        for (var i = 0; i <= noOfRows.split(',').length; i++) {

            if ($('#tblUserDoorRights_HdnWareHouseMasterSNo_' + noOfRows.split(',')[i]).val() != undefined &&
                $('#tblUserDoorRights_HdnWareHouseMasterSNo_' + noOfRows.split(',')[i]).val() != '' &&
                'tblUserDoorRights_HdnWareHouseMasterSNo_' + noOfRows.split(',')[i] != 'tblUserDoorRights_HdnWareHouseMasterSNo_' + textId.split('_')[2])
             cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $('#tblUserDoorRights_HdnWareHouseMasterSNo_' + noOfRows.split(',')[i]).val());            
        }
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        //cfi.setFilter(filterConsolidatorSNo, "AirPortSNo", "in", $('#tblUserDoorRights_HdnAirPortSNo_' + noOfRows.split(',').length).val());
        cfi.setFilter(filterConsolidatorSNo, "AirPortSNo", "in", $('#tblUserDoorRights_HdnAirPortSNo_' + textId.split('_')[2]).val());
    }

    //====================Condition For BayMaster================================================
    if (textId.indexOf("tblUserDoorRights_BayMasterSNo") >= 0) {
        var noOfRows = $('#tblUserDoorRights_rowOrder').val();
        var rowIndex = textId.split('_')[2];
        //for (var i = 0; i <= noOfRows.split(',').length; i++) {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        
        cfi.setFilter(filterConsolidatorSNo, "WhareHouseSNo", "in", $('#tblUserDoorRights_HdnWareHouseMasterSNo_' + rowIndex).val());
        //cfi.setFilter(filterConsolidatorSNo, "SNo", "notin", $('#tblUserDoorRights_HdnBayMasterSNo_' + rowIndex).val());
            //cfi.setFilter(filterConsolidatorSNo, "WhareHouseSNo", "in", $('#tblUserDoorRights_HdnWareHouseMasterSNo_' + noOfRows.split(',').length).val());
        //}
        //tblUserDoorRights_HdnBayMasterSNo_1
    }
    if (textId == "Text_AirportSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
     
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "eq", $("#Text_CitySNo").data("kendoAutoComplete").key());
    }

    if (textId == "Text_WareHouseMasterSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "AirportSNo", "eq", $("#Text_AirportSNo").data("kendoAutoComplete").key());
    }
    if (textId == "Text_AllowAirportSNo") {

        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_AllowCitySNo").data("kendoAutoComplete").key() || $("#Text_CitySNo").data("kendoAutoComplete").key());

    }
    if (textId == "Text_AllowWarehouseSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
        cfi.setFilter(filterConsolidatorSNo, "CitySNo", "in", $("#Text_AllowCitySNo").data("kendoAutoComplete").key() || $("#Text_CitySNo").data("kendoAutoComplete").key());

    }

    else if (textId == "Text_GroupSNo") {
        cfi.setFilter(filterConsolidatorSNo, "IsActive", "eq", 1);
      
    }
    var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterConsolidatorSNo);
    return RegionAutoCompleteFilter;
}
function UsersCity(UserSNo) {
    $.ajax({
        type: "POST",
        url: "Services/Permissions/UserProfileService.svc/UsersCity?UserSNo=" + UserSNo,
        dataType: "json",
        success: function (data) {
            if (data != '') {
                getdata = CitySNo + ',' + data;
            }
            else { getdata = CitySNo; }


        }
    });

}

function UsersCityData(UserSNo) {
    $.ajax({
        type: "POST",
        url: "Services/Permissions/UserProfileService.svc/UsersCityData?UserSNo=" + UserSNo,
        dataType: "json",
        success: function (data) {
            if (data != '') {
                getCitydata = data;
            }
            else { getCitydata = CitySNo; }


        }
    });

}





