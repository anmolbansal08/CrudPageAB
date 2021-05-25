$(document).ready(function () {
    cfi.ValidateForm();
    cfi.AutoCompleteV2("TeamSNo", "Name", "Roster_TeamIDName",  null, "contains");
    cfi.AutoCompleteV2("DutyAreaSNo", "AreaName", "Roster_AreaName", null, "contains");
    //cfi.AutoComplete("ShiftSNo", "ShiftName", "vShift", "SNo", "ShiftName", ["ShiftName"], null, "contains"); 

    $('input[name="operation"]').click(function (e) {

        var arrRosterEmployee = new Array();
        var isValid = true;
        var message = "";
      
        $('#tblRoster tbody tr').each(function (row, tr) {
            if ($(tr).find("td:nth-child(2) input[type=checkbox]:checked").length > 0) {

                var currentID = this.id;
                var arrRowIDNo = currentID.split('_');
               
                if ($('#tblRoster_HdnShiftSNo_' + arrRowIDNo[2]).val() == "" || $('#tblRoster_HdnShiftSNo_' + arrRowIDNo[2]).val() == undefined || $('#tblRoster_HdnShiftSNo_' + arrRowIDNo[2]).val() == "undefined")
                {
                    if (isValid) {
                        isValid = false;
                        message = "Please select shift for row no. " + arrRowIDNo[2];
                    }
                   
                }
                arrRosterEmployee.push({
                    SNo: $('#tblRoster_SNo_' + arrRowIDNo[2]).val(),
                    FromDate: $('#FromDate').val(),
                    ToDate: $('#ToDate').val(),
                    DuteyAreaSNo: $('#DuteyAreaSNo').val(),
                    ShiftSNo: $('#tblRoster_HdnShiftSNo_' + arrRowIDNo[2]).val(),                   
                })
            
            }
        });

        if(isValid)
            {
        $.ajax({
            url: "/Services/Roster/ManageRosterService.svc/SaveRoster", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ RosterEmployee: arrRosterEmployee }),
            contentType: "application/json; charset=utf-8",           
            success: function (result) {
                navigateUrl('Default.cshtml?Module=Roster&Apps=ManageRoster&FormAction=INDEXVIEW');
            },
            error: function (xhr) {
                debugger

            }
        });
        }
        else {

            alert(message);
            return false;

        }
    });
});

var formatUTCDate = function (d) {
    var str = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 0);
    return str;
}

function ExtraCondition(textId) {
    var filtertextId = cfi.getFilter("AND");
    if (textId == "Text_TeamSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_DutyAreaSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
    else if (textId == "Text_ShiftSNo") {
        
        cfi.setFilter(filtertextId, "IsActive", "eq", 1);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filtertextId);
        return RegionAutoCompleteFilter;
    }
}
function SelectShiftCriteria(obj) {
    if (obj.value == "1")
    {
        //$('#Text_TeamSNo').show();
        BindEmployee();
    }
    //else {
    //    $('#Text_TeamSNo').hide();
    //}

}

function BindEmployee() {
    //pageType = 'READ';
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        var ManageTeam = "Roster";
        var teamname=''
        $('#tbl' + ManageTeam).appendGrid({
            tableID: 'tbl' + ManageTeam,
            contentEditable: true,
            // contentEditable: false,
            tableColumns: 'Name,DepartmentName,DesignationName,TeamName,CityName',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
            servicePath: './Services/Roster/ManageRosterService.svc',
            getRecordServiceMethod: 'GetRosterEmployee',
            //  createUpdateServiceMethod: 'SaveConsumableStock',
            //deleteServiceMethod: 'deletetblConsumableStock',
            caption: "Manage Roster",
            initRows: 1,
            isGetRecord: true,
            //rowNumColumnName: 'S.No.',

            columns: [
                      { name: 'chk1', display: '', type: 'checkbox', ctrlAttr: { checked: false }, onChange: function (evt, rowIndex) { Checkboxcheck(evt.target.id.split('_')[2]); } },
                      { name: 'SNo', type: 'hidden' },
                      { name: 'Name', display: 'Employee Name', type: 'label' },
                      { name: 'DepartmentName', display: 'Department Name', type: 'label' },
                      { name: 'DesignationName', display: 'Designation Name', type: 'label' },
                      { name: 'TeamName', display: 'Team Name', type: 'label' },
                      { name: 'CityName', display: 'City Name', type: 'label' },                  
                      { name: 'ShiftSNo', display: 'Shift Name', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '200px' }, isRequired: false, AutoCompleteName: 'Roster_ShiftName', filterField: 'ShiftName', filterCriteria: "contains" }
          
            ],



            hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true },
            isPaging: true
        });
        
    }
    else {
        //ShowMessage('info', 'Need your Kind Attention!', "Manage Team not found.");
        return;
    }
}

function Checkboxcheck(id) {

    //var EmpSNo = $('#tblManageTeam_EmpSNo_' + id).val();
    //var TeamIdSNo = $('#tblManageTeam_TeamIdSNo_' + id).val();
    //alert(EmpSNo);
    //alert(TeamIdSNo);


}