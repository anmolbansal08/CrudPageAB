
/****************** Function to export HTML to PDF and Excel by NReco (Dll used NReco.PdfGenerator and ExportHtmlToPDF )  *******************/
/****************** Created by Bhupendra Singh Bhandari *******************/

function ExportToPDF(DivName, TableColumnHide, ReportHeading, PageType, UserSNo) {
    /// <summary>Function to convert HTML to PDF and Excel.</summary>
    /// <param name="DivName">Name of the Div  with selector which contains all the html to print.</param>
    /// <param name="TableColumnHide" type="array">Pass array of columns to be hidden like [2,5,6] in a Table.</param>
    /// <param name="ReportHeading">Heading of the Report</param>
    /// <param name="PageType">Provide page type from enum PDFPageType </param>
    /// <returns>PDF File</returns>

    //Below commented code can be added to HTML provided to printContents variable. DLL accepts full path for images,external css etc.Keep it in mind.
    //../.. keyword will be handled in Handler by replacing it with full application path.:)

    //<img src="../../Logo/SASNew-Logo1.png" width="50px" height="50px"/>  //Image

    //<link href="../../Style/Style.css" rel="stylesheet" />  //external css

    //<style type="text/css">*{font-family:Time New Roman;}</style>               //inline css   //You can provide inline css directly like this.uncomment it and cut and paste it in printContents html.


    var PDFtable = DivName.find('table');
    if (TableColumnHide) {
        $.each(TableColumnHide, function (index, value) {
            PDFtable.find('td:nth-child(' + value + '),th:nth-child(' + value + ')').hide();  //hiding the columns of the table inside Div
        });
    }
    PDFtable.attr('border', '0');//applied 0 to table attribute border so we border can't be display in the Table 
    var printContents = '<html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><div style="font-size: 25px;" ><center>' + ReportHeading + '</center></div><br />' + DivName.html() + '</body></html>';
    var printdata = printContents.replace('../../', '../../' + (window.location.href.split('/Default')[0].split('//')[1].split('/')[1] == undefined ? '' : (window.location.href.split('/Default')[0].split('//')[1].split('/')[1] + '/')));
    var path = window.location.protocol + '//' + window.location.href.split('/Default')[0].split('//')[1];
    $('body').prepend("<form method='post' action='" + path + "/Handler/ExportHandler.ashx?Invoice=Invoice&UserSNo=" + UserSNo + "' id='tempForm' onsuccess=fn_test();><input type='hidden' name='data' value='" + printContents + "' ><input type='hidden' name='PageType' value='" + PageType + "'  ><input type='hidden' name='PageFolder' value='" + (path + '/') + "'  ></form>");
    
    //$('#tempForm').submit();
        $.ajax({
            type: $('#tempForm').attr('method'),
            url: $('#tempForm').attr('action'),
            data: $('#tempForm').serialize(),
            success: function (result) {
                //if (result.items.length > 0)
                //{
                                      
                //}
                //path = xlspath + ',' + pdfpath;
                //localStorage.setItem("Download", path);

                //var pathURL = window.location.protocol + '//' + window.location.href.split('/HtmlFiles')[0].split('//')[1];
                //$.ajax({                    
                //    url: pathURL + "/Services/Tariff/TariffInvoiceService.svc/SendMail",
                //    contentType: "application/json; charset=utf-8",
                //    data: JSON.stringify({ Sno: UserSNo, path: path }),
                //    async: false,
                //    type: "POST",
                //    cache:false,
                //    success: function (result) {

                //    },
                //    error: function (err) {

                //    }

                //});
            },
            error:function(err){
            }
        });
    $("tempForm").remove(); 
    if (TableColumnHide) {
        $.each(TableColumnHide, function (index, value) {
            PDFtable.find('td:nth-child(' + value + '),th:nth-child(' + value + ')').show(); // //Again Showing the columns of the table inside Div
        });
    }
}

function fn_test()
{
alert('test')}
/// <summary>Enum for Page Type</summary>
var PDFPageType = {
    Default: 'Default',
    Portrait: 'Portrait',
    Landscape: 'Landscape'
}



