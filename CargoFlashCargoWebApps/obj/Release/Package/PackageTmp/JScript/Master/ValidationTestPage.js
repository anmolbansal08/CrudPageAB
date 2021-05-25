/// <reference path="../Scripts/common.js" />
$(document).ready(function () {
    //    $('#ctl01').cfValidator();
    var options = {        
         onBeforeValidate: function(element, action){
                     // do something here        
            alert("onBeforeValidate");
         },    
     };
    cfi.ValidateSection("div7",options);
    cfi.ValidateSection("divCheck");
    cfi.ValidateSection("divCheck2");
    cfi.ValidateSection("divCheck3");
    cfi.ValidateForm();
    $("#btnTest").click(function () {
        if (cfi.IsValidSection("divCheck"))
            alert("abc");
    });
    $("#btnTest1").click(function () {
        if (cfi.IsValidSection("divCheck2"))
            alert("abc");
    });
    $("#btnTest2").click(function () {
        if(cfi.IsValidSection("divCheck3"))
            alert("abc");
    });
    $("#btnFormValidate").click(function () {
        if(cfi.IsValidForm())
            alert("abc");
    });

});
function checkIfValid() {
    if (cfi.IsValidSection("div7"))
        alert('Is valid!');
}
