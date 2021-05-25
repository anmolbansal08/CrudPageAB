$(function () {
    var opsType = [{ Key: "1", Text: "Export" }, { Key: "2", Text: "Import" }, { Key: "3", Text: "Transit" }];
    cfi.AutoCompleteByDataSource("OpsType", opsType)

});

//$(document).ready(function () {
//    $("#LocationCode").css('text-transform', 'uppercase');
//    var mask = new RegExp('^[A-Za-z0-9 ]*$')
//    $("#LocationCode").regexMask(mask)
//    //$("#LocationCode").on('keyup change', function () {
//    //    $("#LocationCode").val(this.value.toUpperCase())

     
//    //    //  return this.value.toUpperCase();
//    //})
//});
$(function () {
    $('#LocationCode').keydown(function (e) {
        $("#LocationCode").css('text-transform', 'uppercase');
        if (e.shiftKey || e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                e.preventDefault();
            }
        }
    });
});