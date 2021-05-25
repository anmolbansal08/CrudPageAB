
$(document).ready(function () {
  
    $("input[type='text']:eq(0)").focus();
  
    $(document).on("contextmenu", function (e) {
        alert('Right click disabled');
        return false;
    });

    $(document).on('drop', function () {
        return false;
    });
    //$('#basisOfCharge').keypress(function (e) {

    //    if (e.keyCode != 32)
    //        return true;
    //    else
    //        return false;
    //})
});
