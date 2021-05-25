$(document).ready(function () {
    cfi.ValidateForm();
    var check = "";
    //$("#StartDate").prop('disabled', true); COMMENTED BY DEVENDRA ON 1 JUNE 2018 BUG 3652
    //$("#EndDate").prop('disabled', true);
 
   

});
//Added by Shivali Thakur for Audit Log
$('input[type="submit"][name="operation"]').click(function () {
    $("#StartDate").prop('disabled', false);
    $("#EndDate").prop('disabled', false);
});


$("input[id^=EndDate]").change(function (e) {
    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    var StartDate = $(this).attr("id").replace("End", "Start");
    k = $("#" + StartDate).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    if (dfrom > dto) {
        $(this).val("");
        alert('End date can not be Less than Start Date.');
    }
    
});

$("input[id^=StartDate]").change(function (e) {
    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    var StartDate = $(this).attr("id").replace("Start", "End");
    k = $("#" + StartDate).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    if (dfrom > dto) {
        $(this).val("");
        alert('Start Date date can not be greater than End Date');
    }
});

