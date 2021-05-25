function ShowStockAction() {
    $('.k-grid-content').find("tr").each(function () {
        $(this).unbind("click").bind("click", function () {
            var recId = $(this).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(this).find("input[type='radio']").attr("checked", true);
               
                if ($(this).find("td")[4].innerText == "0") {
                   
                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "AGENT") {
                            $(this).closest("a").css("display", "none");
                        }
                    });
                    
                } else {
                   
                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "AGENT") {
                            $(this).closest("a").css("display", "block");
                        }
                    });
                   
                }

            }
        });
    });



}
