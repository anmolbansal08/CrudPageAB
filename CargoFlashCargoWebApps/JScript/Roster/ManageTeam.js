$(document).ready(function () {
    cfi.ValidateForm();

    cfi.AutoCompleteV2("TeamName", "SNo,Name", "Roster_TeamName", null, "contains");
    BindConsumableStock();
    $('input[name="operation"]').click(function (e) {
        // var ManageTeamInfoTrans = new Array();
        var ManageTeamInfo = [];
        if (!cfi.IsValidForm()) {
            return false;
        }
        //ManageTeamInfo.push({
        //    TeamName: $('#TeamName').val(),
        //    ValidFrom: $('#validFrom').val(),
        //    ValidTo: $('#ValidTo').val(),
        //    IsActive: $('#IsActive:checked').length
        //});
        var ManageTeamInfos = "";
        $('#tblManageTeam tbody tr').each(function (row, tr) {
            if ($(tr).find("td:nth-child(2) input[type=checkbox]:checked").length > 0) {
                 ManageTeamInfos = {
                    //ManageTeamInfo.push({
                    TeamID: $('#TeamName').val(),
                    ValidFrom: $('#validFrom').val(),
                    ValidTo: $('#ValidTo').val(),
                    IsActive: $('#IsActive:checked').length,
                    //TeamIdSNo: $(tr).find("td:last input[type=hidden]:last").val() == "undefined" ? 0 : ($(tr).find("td:last input[type=hidden]:last").val() == "" ? 0 : $(tr).find("td:last input[type=hidden]:last").val()),
                    EmpSNo: $(tr).find("td:last input[type=hidden]:first").val() == "undefined" ? 0 : ($(tr).find("td:last input[type=hidden]:first").val() == "" ? 0 : $(tr).find("td:last input[type=hidden]:first").val())
                    //})
                }
                ManageTeamInfo.push(ManageTeamInfos)
            }
            
        });
        if (ManageTeamInfos == "") {
            ShowMessage('warning', 'Need your Kind Attention!', 'No Employee selected');
            return false;
        }
        $.ajax({
            url: "/Services/Roster/ManageTeamService.svc/SaveTeam", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ManageTeamInfo: ManageTeamInfo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //navigateUrl('Default.cshtml?Module=Roster&Apps=ManageTeam&FormAction=INDEXVIEW');
                navigateUrl('Default.cshtml?Module=Roster&Apps=ManageTeam&FormAction=INDEXVIEW');
            },
            error: function (xhr) {
                debugger

            }
        });

        //  } 
        // });
    });
});


function BindConsumableStock() {
    //pageType = 'READ';
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        var ManageTeam = "ManageTeam";
        $('#tbl' + ManageTeam).appendGrid({
            tableID: 'tbl' + ManageTeam,
            contentEditable: true,
            // contentEditable: false,
            // tableColumns: 'SNo,CFTNumber,MawbNo,TotalPcs,TotalGrossWt,TotalCBM,NoOfBUP,ShipmentType,ForwarderName,AirlineName,IsSecure,Origin,SPHCSNo,FlightNo,Origin,Destination,FlightNo,CarrierCode',
            tableColumns: 'EmployeeName,TeamName,Designation',
            masterTableSNo: 1,
            currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
            servicePath: './Services/Roster/ManageTeamService.svc',
            getRecordServiceMethod: 'GetTeamRecord',
            //  createUpdateServiceMethod: 'SaveConsumableStock',
            //deleteServiceMethod: 'deletetblConsumableStock',
            caption: "Manage Team",
            isGetRecord: true,

            columns: [
                     //{ name: 'chk1', display: '', type: 'checkbox' },
                      { name: 'chk1', display: '', type: 'checkbox', ctrlAttr: { checked: false } },// onChange: function (evt, rowIndex) { Checkboxcheck(evt.target.id.split('_')[2]); }},
                      { name: 'EmpSNo', type: 'hidden' },
                      { name: 'TeamIdSNo', type: 'hidden' },
                      { name: 'EmployeeName', display: 'Employee Name', type: 'label' },
                      { name: 'TeamName', display: 'Team', type: 'label' },
                      { name: 'Designation', display: 'Designation', type: 'label' }],
            hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
            isPaging: true
        });

    }
    else {
        //ShowMessage('info', 'Need your Kind Attention!', "Manage Team not found.");
        return;
    }
}

function GetEmployeeData(valueId, value, keyId, key) {
    
    //$.ajax({
    //    type: "GET",
    //    url: "Services/Roster/ManageTeamService.svc/GetEmployeeData?TeamIDSNO=" + key,
    //    dataType: "html",
    //    success: function (response) {
    //        $("#tblManageTeam").appendGrid('load', JSON.parse(response));
    //    },
    //    error: function (er) {
    //        debugger
    //    }
    //})
}

//function Checkboxcheck(id)
//{

//       var  EmpSNo = $('#tblManageTeam_EmpSNo_' + id).val();
//        var TeamIdSNo = $('#tblManageTeam_TeamIdSNo_' + id).val();
//         alert(EmpSNo);
//         alert(TeamIdSNo);



//}




