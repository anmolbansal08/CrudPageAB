using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.SessionState;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using System.Data.OleDb;
using System.Web.UI;
using System.Drawing.Printing;
//using NReco.PdfGenerator;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
//using iTextSharp.tool.xml;


namespace CargoFlashCargoWebApps.Handler
{
    /// <summary>
    /// Summary description for ExportHandler
    /// </summary>
    public class ExportHandler : IHttpHandler
    {


        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.QueryString["Invoice"] == "Invoice")
                HTMLtoPDFEXL(context);
            if (context.Request.QueryString["I"] == "A")
                GETPDFEXL(context);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }


        public void HTMLtoPDFEXL(HttpContext context)
        {

            //StringReader sr = new StringReader(context.Request.Form["data"]);
            //Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
            //PdfWriter writer = PdfWriter.GetInstance(pdfDoc, HttpContext.Current.Response.OutputStream);
            //pdfDoc.Open();
            //XMLWorkerHelper.GetInstance().ParseXHtml(writer, pdfDoc, sr);
            //pdfDoc.Close();
            //HttpContext.Current.Response.ContentType = "application/pdf";
            //HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=HTML.pdf");
            //HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            //HttpContext.Current.Response.Write(pdfDoc);
            //HttpContext.Current.Response.End();
            //StringBuilder sb = new StringBuilder();
            //sb.Append(context.Request.Form["data"]);


            //StringReader sr = new StringReader(sb.ToString());
            //using (System.IO.FileStream fs = new FileStream("D:\\First PDF document1456677.pdf", FileMode.Create))
            //{
            //    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
            //    iTextSharp.text.html.simpleparser.HTMLWorker htmlparser = new iTextSharp.text.html.simpleparser.HTMLWorker(pdfDoc);
            //    using (MemoryStream memoryStream = new MemoryStream())
            //    {
            //        PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
            //        pdfDoc.Open();

            //        htmlparser.Parse(sr);
            //        pdfDoc.Close();

            //        byte[] bytes = memoryStream.ToArray();
            //        memoryStream.Close();

            //    }
            //}

            //using (System.IO.FileStream fs = new FileStream("D:\\First PDF document1456.pdf", FileMode.Create))
            //{
            //    Document document = new Document(PageSize.A4, 25, 25, 30, 30);
            //    PdfWriter writer = PdfWriter.GetInstance(document, fs);

            //    document.Open();
            //    //PdfPTable table = new PdfPTable(3);

            //    //PdfPCell cell = new PdfPCell(new Phrase("Row 1, Col 1"));
            //    //table.AddCell(cell);
            //    //cell = new PdfPCell(new Phrase("Row 1, Col 2"));
            //    //table.AddCell(cell);
            //    //cell = new PdfPCell(new Phrase("Row 1, Col 3"));
            //    //table.AddCell(cell);

            //    //cell = new PdfPCell(new Phrase("Row 2 , Col 1"));
            //    //table.AddCell(cell);
            //    //cell = new PdfPCell(new Phrase("Row 2, Col 2"));
            //    //table.AddCell(cell);
            //    //cell = new PdfPCell(new Phrase("Row 2 and Row 3, Col 3"));
            //    //cell.Rowspan = 2;
            //    //table.AddCell(cell);

            //    //cell = new PdfPCell(new Phrase("Row 3, Col 1"));
            //    //table.AddCell(cell);
            //    //cell = new PdfPCell(new Phrase("Row 3, Col 2"));
            //    //table.AddCell(cell);

            //    //document.Add(table); 
            //    document.Add(new Paragraph(sb.ToString()));

            //    // Add a simple and wellknown phrase to the document
            //    //for (int x = 0; x != 100; x++)
            //    //{
            //    //    document.Add(new Paragraph("Paragraph - Hello World!"));
            //    //}

            //    // Close the document
            //    document.Close();
            //    writer.Close();
            //    fs.Close();

            //}

            //using (MemoryStream ms = new MemoryStream())
            //{
            //    // Creae the document object, assigning the page margins
            //    Document document = new Document(PageSize.A4, 25F, 25F, 30F, 30F);
            //    PdfWriter writer = PdfWriter.GetInstance(document, ms);
            //    // Open the document, enabeling writing to the document
            //    document.Open();
            //    document.Add(new Paragraph("Hello World"));
            //    document.Close();
            //    writer.Close();
            //    ms.Close();
            //    HttpContext.Current.Response.ContentType = "pdf/application";
            //    HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=First PDF document.pdf");
            //    HttpContext.Current.Response.OutputStream.Write(ms.GetBuffer(), 0, ms.GetBuffer().Length);
            //}
        }

        public void GETPDFEXL(HttpContext context)
        {
            System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
            System.Collections.Generic.List<object> Listobj = new System.Collections.Generic.List<object>();

            string Sno = context.Request.QueryString["RecordNo"];
            SqlParameter[] Parameters = { new SqlParameter("@RecordNo", Convert.ToInt32(Sno)) };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GETPDFEXLBytes", Parameters);
            if (ds.Tables[0].Rows.Count > 0)
            {
                byte[] pdfBytes = (byte[])ds.Tables[0].Rows[0]["PDF"];

                string filename = (System.DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss") + "_" + Sno + "_ExportedFile.pdf").Replace("\\", "$$").Replace("/", "@@");
                System.IO.FileStream file = System.IO.File.Create(HttpContext.Current.Server.MapPath("~/UploadDoc\\Invoice\\" + filename));

                file.Write(pdfBytes, 0, pdfBytes.Length);



                byte[] xlsbytes = (byte[])ds.Tables[0].Rows[0]["XLS"];
                string filenamexls = (System.DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss") + "_" + Sno + "_ExportedFile.xls").Replace("\\", "$$").Replace("/", "@@");
                System.IO.FileStream filexls = System.IO.File.Create(HttpContext.Current.Server.MapPath("~/UploadDoc\\Invoice\\" + filenamexls));
                filexls.Write(xlsbytes, 0, xlsbytes.Length);
                filexls.Dispose();
                file.Dispose();
                filexls.Close();
                file.Close();
                Listobj.Add(new
                {
                    //pdflink = HttpContext.Current.Server.MapPath("~/UploadDoc\\Invoice\\" + filename),
                    //xlslink = HttpContext.Current.Server.MapPath("~/UploadDoc\\Invoice\\" + filenamexls)
                    pdflink = "/UploadDoc\\Invoice\\" + filename,
                    xlslink = "/UploadDoc\\Invoice\\" + filenamexls
                });
            }
            else
            {
                Listobj.Add(new
                {
                    Error = "Invoice Print Can't Generate properly"
                });
            }
            var items = new { items = Listobj };
            string jsonstring = js.Serialize(items);
            HttpContext.Current.Response.ClearContent();
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(jsonstring);
            HttpContext.Current.Response.End();
        }
    }
}