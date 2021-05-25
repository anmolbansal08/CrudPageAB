using CargoFlash.SoftwareFactory.Data;
using Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Runtime.InteropServices;
using System.Web.Hosting;
using System.Text;
using Newtonsoft.Json;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;
using ClosedXML.Excel;
using System.Globalization;
using CargoFlash.Cargo.DataService.Common;
using System.Web;
using System.Linq;
using System.Data.Entity;
using iTextSharp.text;
using iTextSharp.text.pdf;
//using iTextSharp.tool.xml;
using iTextSharp.text.html.simpleparser;
using CargoFlash.Cargo.WebUI;
using System.Threading.Tasks;




namespace CargoFlashCargoWebApps.Controllers
{
    public class MasterController : Controller
    {
        /// <summary>
        /// This methos on created for testing purpose for refreshing autocomplete data
        /// </summary>
        /// <returns></returns>
        public JsonResult RefreshAutocomplete()
        {
            CargoFlash.Cargo.Business.Common.RefreshAutocompletes();
            return Json("Successs");
        }

        public void DownloadExcel(string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, string ReferenceNo, string OriginAirport, string DestinationAirport, string AWBStatusSearch)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", "1"),
                                            new SqlParameter("@PageSize", "10000"),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@OrderBy", ""),
                                            new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@OriginCity", OriginCity=="0"?"":OriginCity),
                                            new SqlParameter("@DestinationCity", DestinationCity=="0"?"":DestinationCity),
                                            new SqlParameter("@FlightNo", FlightNo=="0"?"":FlightNo),
                                            new SqlParameter("@FlightDate", FlightDate=="0"?"":FlightDate),
                                            new SqlParameter("@AWBPrefix", AWBPrefix=="0"?"":AWBPrefix),
                                            new SqlParameter("@AWBNo", AWBNo=="0"?"":AWBNo),
                                            new SqlParameter("@LoggedInCity", LoggedInCity),
                                            new SqlParameter("@ReferenceNo", ReferenceNo=="0"?"":ReferenceNo),
                                            new SqlParameter("@OriginAirport", OriginAirport=="0"?"":OriginAirport),
                                            new SqlParameter("@DestinationAirport", DestinationAirport=="0"?"":DestinationAirport),
                                            new SqlParameter("@AWBStatus", AWBStatusSearch=="0"?"":AWBStatusSearch),
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_GetList_AWB_DownloadExcel_NEW", Parameters);
                DataTable dt1 = ds.Tables[0];
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["IsManageExcelcolumns"].ToString() == "True")
                {
                    dt1.Columns.Remove("Reference No");
                    dt1.Columns.Remove("Origin");
                    dt1.Columns.Remove("Destination");

                }
                else
                {
                    dt1.Columns.Remove("Origin Airport");
                    dt1.Columns.Remove("Destination Airport");
                    dt1.Columns.Remove("AcceptanceCutOffTime");
                    dt1.Columns.Remove("Created by");
                    dt1.Columns.Remove("ETD");
                    dt1.Columns.Remove("ETA");
                }

                ConvertDSToExcel_Common(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReservation_GetList_AWB_DownloadExcel_NEW"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void ConvertDSToExcel_Common(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=ReservationBooking_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }


        /// <summary>
        /// This method used for print PDF from from html string.
        /// </summary>
        /// <param name="html"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [ValidateInput(false)]
        public FileResult DownloadPdf(string html, string fileName)
        {

            using (MemoryStream stream = new System.IO.MemoryStream())
            {

                //StringReader sr = new StringReader("<h1>Hello World</h1>");
                TextReader txtReader = new StringReader(html);
                Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 100f, 0f);
                PdfWriter writer = PdfWriter.GetInstance(pdfDoc, stream);
                HTMLWorker htmlWorker = new HTMLWorker(pdfDoc);
                htmlWorker.StartDocument();
                pdfDoc.Open();
                ////XMLWorkerHelper.GetInstance().ParseXHtml(writer, pdfDoc, sr);
                //pdfDoc.Close();
                htmlWorker.StartDocument();
                // 5: parse the html into the document  
                htmlWorker.Parse(txtReader);

                // 6: close the document and the worker  
                htmlWorker.EndDocument();
                htmlWorker.Close();
                pdfDoc.Close();
                return File(stream.ToArray(), "application/pdf", fileName + ".pdf");
            }
        }


        public ActionResult UploadExcel()
        {
            //ViewBag.MessageError = "Hell";
            return View();
        }


        [HttpPost]
        public async Task<ActionResult> UploadExcel(HttpPostedFileBase ExcelFile, string Text_PageSNo, string PageSNo, string RateType, string UploadActive, string OtherChargeType, FormCollection form)
        {
            try
            {
                //  DataSet ds = new DataSet();
                DataSet Excel_DS = new DataSet();
                DataSet Excel_Slab = new DataSet();
                DataTable table1 = new DataTable();
                DateTime datetime1;
                DateTime datetime2;
                datetime1 = DateTime.Now;
                int success = 0;
                //decimal checkSlab = 0;
                Stream stream = null;
                if (ExcelFile != null)
                {
                    stream = ExcelFile.InputStream;
                }


                var results = new List<string>();
                //  string extenstion = ExcelFile.GetExtension();


                table1.Columns.Add("SNo");
                table1.Columns.Add("OriginCountrySNo");
                table1.Columns.Add("OriginCitySNo");
                table1.Columns.Add("OriginCityNumeric", typeof(int));
                table1.Columns.Add("DestinationCountrySNo");
                table1.Columns.Add("DestinationCitySNo");
                table1.Columns.Add("DestinationNumeric", typeof(int));
                table1.Columns.Add("Category");
                table1.Columns.Add("AreaSNo");
                table1.Columns.Add("Note");
                table1.Columns.Add("CarrierCode");
                table1.Columns.Add("RateType");
                table1.Columns.Add("Commodity");
                table1.Columns.Add("ChangeIndicator");
                table1.Columns.Add("IntendedEffectiveDate");
                table1.Columns.Add("ActualEffectiveDate");
                table1.Columns.Add("ExpiryDate");
                table1.Columns.Add("GovtStatus");
                table1.Columns.Add("OriginGateway");
                table1.Columns.Add("DestinationGateway");
                table1.Columns.Add("UniqueAreaCode");
                table1.Columns.Add("Source");
                table1.Columns.Add("ActionCode");
                table1.Columns.Add("ConstAllowedIndicator");
                table1.Columns.Add("CatSortIndicator");
                table1.Columns.Add("IdentificationCode");
                table1.Columns.Add("CurrencySno");
                table1.Columns.Add("Directioncode");
                table1.Columns.Add("ProportionalCode");
                table1.Columns.Add("DecimalPlace", typeof(int));
                table1.Columns.Add("Rate", typeof(decimal));
                table1.Columns.Add("Minimum", typeof(string));
                table1.Columns.Add("Normal", typeof(int));
                table1.Columns.Add("+45", typeof(int));
                table1.Columns.Add("+100", typeof(int));
                table1.Columns.Add("+250", typeof(int));
                table1.Columns.Add("+300", typeof(int));
                table1.Columns.Add("+500", typeof(int));
                table1.Columns.Add("+1000", typeof(int));
                table1.Columns.Add("MinWeight", typeof(decimal));
                table1.Columns.Add("ULDClass");
                table1.Columns.Add("CreatedBy", typeof(int));
                table1.Columns.Add("CreatedOn", typeof(DateTime));
                table1.Columns.Add("UpdatedBy", typeof(int));
                table1.Columns.Add("UpdatedOn", typeof(DateTime));
                table1.Columns.Add("Itemnumber");
                table1.Columns.Add("ULDchargecode");
                table1.Columns.Add("Weightbreakpointplusunit");

                IExcelDataReader reader = null;
                if (ExcelFile.FileName.EndsWith(".xls"))
                {
                    reader = ExcelReaderFactory.CreateBinaryReader(stream);
                }
                else if (ExcelFile.FileName.EndsWith(".xlsx"))
                {
                    reader = ExcelReaderFactory.CreateOpenXmlReader(stream);

                }
                else if (ExcelFile.FileName.EndsWith(".CRL"))
                {
                    // StreamReader s = new StreamReader(stream);

                    int counter = 0;
                    string line, s1;
                    System.IO.StreamReader file = new System.IO.StreamReader(stream);

                    while ((line = file.ReadLine()) != null)
                    {
                        results.Add(line.ToString());

                        counter++;
                    }

                    int i = 1;
                    int mid = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(results.Count) / 300000));

                    for (int j = 1; j <= mid; j++)
                    {

                        // int  i=(i-1)*300000;
                        table1.Clear();

                        for (i = (j - 1) * 300000; i < (j * 300000); i++)
                        {
                            if (i <= counter - 1)
                            {
                                s1 = results[i].ToString();

                                try
                                {

                                    DataRow dr = table1.NewRow();
                                    dr = table1.NewRow();
                                    dr[0] = 1;//SNo
                                    dr[1] = s1.Substring(21, 2) == "  " ? null : s1.Substring(21, 2); //OriginCountry
                                    dr[2] = s1.Substring(18, 3) == "   " ? null : s1.Substring(18, 3);//OriginCity
                                    dr[3] = s1.Substring(13, 5) == "     " ? null : s1.Substring(13, 5); //OriginNumeric
                                    dr[4] = s1.Substring(31, 2) == "  " ? null : s1.Substring(31, 2);//DestinationCountry                               
                                    dr[5] = s1.Substring(28, 3) == "   " ? null : s1.Substring(28, 3); //DestinationCity
                                    dr[6] = s1.Substring(23, 5) == "     " ? null : s1.Substring(23, 5); //DestinationNumeric
                                    dr[7] = s1.Substring(0, 2) == "  " ? null : s1.Substring(0, 2);//category
                                    dr[8] = s1.Substring(2, 4) == "  " ? null : s1.Substring(2, 4);//Area
                                    dr[9] = s1.Substring(33, 4) == "    " ? null : s1.Substring(33, 4);//Uniquenote or Note
                                    dr[10] = s1.Substring(37, 3) == "   " ? null : s1.Substring(37, 3);//Participatingcode
                                    dr[11] = 0; //Rating Type
                                    dr[12] = s1.Substring(45, 5) == "        " ? null : s1.Substring(45, 5);  //commodity
                                    dr[13] = s1.Substring(62, 6) == "      " ? null : s1.Substring(62, 6); //Changeindicators
                                    dr[14] = s1.Substring(108, 4) == "        " ? null : s1.Substring(108, 4) + "-" + s1.Substring(112, 2) + "-" + s1.Substring(114, 2); //Intendeddate 
                                    dr[15] = s1.Substring(116, 8) == "        " ? null : s1.Substring(116, 4) + "-" + s1.Substring(120, 2) + "-" + s1.Substring(122, 2); //Actualdate
                                    dr[16] = s1.Substring(124, 8) == "        " ? null : s1.Substring(124, 4) + "-" + s1.Substring(128, 2) + "-" + s1.Substring(130, 2);//ExpiryDate//(s.Substring(124, 8).Length == 0 ? "" : s.Substring(124, 4) + "-" + s.Substring(128, 2) + "-" + 
                                    dr[17] = s1.Substring(132, 1) == " " ? null : s1.Substring(132, 1);//GovtStatus
                                    dr[18] = s1.Substring(133, 3) == "   " ? null : s1.Substring(133, 3); //OriginGateway
                                    dr[19] = s1.Substring(136, 3) == "   " ? null : s1.Substring(136, 3);//DestinationGateway
                                    dr[20] = s1.Substring(139, 3) == "   " ? null : s1.Substring(139, 3);//UniqueAreaCode
                                    dr[21] = s1.Substring(142, 5) == "     " ? null : s1.Substring(142, 5); //Source
                                    dr[22] = s1.Substring(147, 1) == " " ? null : s1.Substring(147, 1);//ActionCode
                                    dr[23] = s1.Substring(148, 1) == " " ? null : s1.Substring(148, 1);//ConstructionIndicator
                                    dr[24] = s1.Substring(149, 1) == " " ? null : s1.Substring(149, 1);
                                    dr[25] = s1.Substring(7, 6) == "      " ? null : s1.Substring(7, 6); //IdentificationMethod
                                    dr[26] = s1.Substring(95, 3) == "   " ? null : s1.Substring(95, 3);//Currencycode
                                    dr[27] = s1.Substring(40, 1) == " " ? null : s1.Substring(40, 1);//Directioncode
                                    dr[28] = s1.Substring(42, 1) == " " ? null : s1.Substring(42, 1);//Proportionalaction
                                    dr[29] = s1.Substring(98, 1) == " " ? null : s1.Substring(98, 1); //DecimalPlace
                                    dr[30] = s1.Substring(99, 9) == "         " ? null : s1.Substring(99, 9);//Rate
                                    dr[31] = 0;//Minimum
                                    dr[32] = 0;//Normal
                                    dr[33] = 0; //+45
                                    dr[34] = 0; //+100
                                    dr[35] = 0;//+250
                                    dr[36] = 0; //+300
                                    dr[37] = 0; //+500
                                    dr[38] = 0;//+1000
                                    dr[39] = 0;
                                    dr[40] = s1.Substring(51, 4) == "    " ? null : s1.Substring(52, 3).Trim();//ULDratingtypeClass
                                    dr[41] = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();//CreatedBy
                                    dr[42] = DateTime.Now;//CreatedOn
                                    dr[43] = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();//UpdatedBy
                                    dr[44] = DateTime.Now;//UpdatedOn
                                    dr[45] = s1.Substring(43, 8) == "        " ? null : s1.Substring(43, 8);//Itemnumber                              
                                    dr[46] = s1.Substring(55, 1) == " " ? null : s1.Substring(55, 1);//ULDchargecode
                                    dr[47] = s1.Substring(56, 6) == "      " ? null : s1.Substring(56, 6);//Weightbreakpointplusunit             


                                    table1.Rows.Add(dr);


                                }
                                catch (Exception ee) { }

                            }
                            else
                            {
                                break;
                            }

                        }

                        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                        using (SqlConnection sqlConn = new SqlConnection(connectionString))
                        {
                            //   DataSet ds = new DataSet();
                            //ds.ReadXml(Server.MapPath("~/Data.xml"));  
                            //DataTable dtStudentMaster = ds.Tables["Student"];  
                            sqlConn.Open();
                            using (SqlBulkCopy sqlbc = new SqlBulkCopy(sqlConn))
                            {
                                sqlbc.DestinationTableName = "RateAirlineTactRate";
                                sqlbc.BatchSize = 10000;
                                sqlbc.WriteToServer(table1);
                                success++;
                                //Response.Write("Bulk data stored successfully");
                            }
                            sqlConn.Close();
                        }

                    }

                    if (success == mid)
                    {
                        //return Content("Record Saved", "text/plain", Encoding.UTF8);
                        //   return JavaScript("<script>alert(\"Record Inserted\")</script>");

                        datetime2 = DateTime.Now;
                        var diffInSeconds = (datetime2 - datetime1).TotalSeconds;
                        //  ViewBag.Message = "File Uploaded Successfully";
                        return View();
                    }
                }
                // === arman
                else if (ExcelFile.FileName.EndsWith(".txt"))
                {
                    int counter = 0;
                    string line, s1;
                    string created = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
                    System.IO.StreamReader file = new System.IO.StreamReader(stream);
                    DataTable dt = new DataTable();
                    dt.Columns.Add("FromCurrencyCode");
                    dt.Columns.Add("ToCurrencyCode");

                    dt.Columns.Add("Rate", typeof(decimal));
                    dt.Columns.Add("ValidFrom", typeof(DateTime));
                    //  dt.Columns.Add("CreatedBy", typeof(int));
                    //    dt.Columns.Add("ValidFrom", typeof(DateTime));
                    while ((line = file.ReadLine()) != null)
                    {
                        results.Add(line.ToString());

                        counter++;
                    }
                    int count = counter;
                    if (Text_PageSNo.ToUpper() == "EXCHANGE RATE")
                    {
                        try
                        {
                            for (int i = 1; i < counter; i++)
                            {
                                s1 = results[i].ToString();
                                DataRow dr = dt.NewRow();
                                dr = dt.NewRow();
                                dr[1] = s1.Substring(39, 3);
                                dr[0] = "EUR";
                                dr[2] = s1.Substring(42, 7) + "." + s1.Substring(49, 5);
                                dr[3] = DateTime.ParseExact(results[0].Substring(15, 8), "yyyyMMdd", null);

                                dt.Rows.Add(dr);
                                DataRow dr1 = dt.NewRow();
                                dr1[1] = s1.Substring(39, 3);
                                dr1[0] = "GBP";
                                dr1[2] = s1.Substring(54, 7) + "." + s1.Substring(61, 5);
                                dr1[3] = DateTime.ParseExact(results[0].Substring(15, 8), "yyyyMMdd", null);

                                dt.Rows.Add(dr1);
                                DataRow dr2 = dt.NewRow();
                                dr2[1] = s1.Substring(39, 3);
                                dr2[0] = "USD";
                                dr2[2] = s1.Substring(66, 7) + "." + s1.Substring(73, 5);
                                dr2[3] = DateTime.ParseExact(results[0].Substring(15, 8), "yyyyMMdd", null);
                                dt.Rows.Add(dr2);
                            }
                            // DataTable dt1 = new DataTable();
                            var dt1 = dt.AsEnumerable().ToList();
                            var distinctValues = dt.AsEnumerable().Select(row => new
                            {
                                FromCurrencyCode = row.Field<string>("FromCurrencyCode"),
                                ToCurrencyCode = row.Field<string>("ToCurrencyCode"),
                                Rate = row.Field<decimal>("Rate"),
                                ValidFrom = row.Field<DateTime>("ValidFrom")
                            })
                          .Distinct().ToList();

                            //  DataTable dtr = (DataTable)distinctValues;
                            DataTable dtr = new DataTable();
                            dtr.Columns.Add("FromCurrencyCode", typeof(string));
                            dtr.Columns.Add("ToCurrencyCode", typeof(string));
                            dtr.Columns.Add("Rate", typeof(decimal));
                            dtr.Columns.Add("ValidFrom", typeof(DateTime));

                            foreach (var item in distinctValues)
                            {
                                DataRow dr = dtr.NewRow();

                                dr["FromCurrencyCode"] = item.FromCurrencyCode.ToString();
                                dr["ToCurrencyCode"] = item.ToCurrencyCode.ToString();
                                dr["Rate"] = item.Rate.ToString();
                                dr["ValidFrom"] = item.ValidFrom.ToString();
                                dtr.Rows.Add(dr);


                            }

                            DataSet ds1 = new DataSet();
                            DataTable table = new DataTable();
                            SqlParameter[] Parameters = { new SqlParameter("@ExchangeRate", SqlDbType.Structured) { Value = dtr },
                                             new SqlParameter("@CreatedBy",int.Parse(created) ) };
                            ds1 = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_SaveExchangeRate", Parameters);


                            if (ds1.Tables[0].Rows.Count > 0 && ds1.Tables[0].Columns.Count > 0)
                            {
                                ViewBag.Message = ds1.Tables[0].Rows[0][0].ToString();
                                //  return RedirectToAction("UploadExcel", "Master", ViewBag.MessageError);
                                //  return View();
                            }
                            else
                            {
                                ViewBag.Message = "Unable To Upload File";
                                //  return View();
                            }
                        }
                        catch (Exception e)
                        {
                            //    ViewBag.Message = "Error ";
                            //    return View();
                        }
                    }

                }
                // end here
                else
                {
                    ModelState.AddModelError("File", "This file format is not supported!!!");
                    return View();
                }



                // To Specify which procedure called according to selected Page Name
                string ProcedureName = "";
                // DataSet Excel_DS;
                //added by tarun kumar singh
                if (Text_PageSNo.ToUpper() == "CITY")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_City";
                }
                else if (Text_PageSNo.ToUpper() == "COUNTRY")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_Country";
                }
                else if (Text_PageSNo.ToUpper() == "CURRENCY")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_Currency";
                }
                else if (Text_PageSNo.ToUpper() == "USER")
                {
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    DataTable dtuser = new DataTable();
                    dtuser.Columns.Add("No", typeof(int));
                    dtuser.Columns.Add("UserType", typeof(string));
                    dtuser.Columns.Add("Airline", typeof(string));
                    dtuser.Columns.Add("Agent", typeof(string));
                    dtuser.Columns.Add("OfficeName", typeof(string));
                    dtuser.Columns.Add("CityCode", typeof(string));
                    dtuser.Columns.Add("AirportCode", typeof(string));
                    dtuser.Columns.Add("Terminal", typeof(string));
                    dtuser.Columns.Add("GroupName", typeof(string));
                    dtuser.Columns.Add("FirstName", typeof(string));
                    dtuser.Columns.Add("LastName", typeof(string));
                    dtuser.Columns.Add("UserID", typeof(string));
                    dtuser.Columns.Add("EmailAddress", typeof(string));
                    dtuser.Columns.Add("MobileCountryCode", typeof(string));
                    dtuser.Columns.Add("MobileNo", typeof(string));
                    dtuser.Columns.Add("Address", typeof(string));
                    dtuser.Columns.Add("Block", typeof(string));
                    dtuser.Columns.Add("UserExpiryDate", typeof(string));
                    dtuser.Columns.Add("OtherAirportAccess", typeof(string));
                    dtuser.Columns.Add("OtherAirportName", typeof(string));
                    dtuser.Columns.Add("OtherAirlineAccess", typeof(string));
                    dtuser.Columns.Add("OtherAirlineName", typeof(string));
                    dtuser.Columns.Add("Active", typeof(string));

                    int count = Excel_DS.Tables[0].Rows.Count;
                    for (int i = 0; i < count; i++)
                    {
                        DataRow druser = dtuser.NewRow();
                        druser["No"] = i + 1;
                        druser["UserType"] = Excel_DS.Tables[0].Rows[i]["UserType"].ToString();
                        druser["Airline"] = Excel_DS.Tables[0].Rows[i]["Airline"].ToString();
                        druser["Agent"] = Excel_DS.Tables[0].Rows[i]["Agent"].ToString();
                        druser["OfficeName"] = Excel_DS.Tables[0].Rows[i]["OfficeName"].ToString();
                        druser["CityCode"] = Excel_DS.Tables[0].Rows[i]["CityCode"].ToString();
                        druser["AirportCode"] = Excel_DS.Tables[0].Rows[i]["AirportCode"].ToString();
                        druser["Terminal"] = Excel_DS.Tables[0].Rows[i]["Terminal"].ToString();
                        druser["GroupName"] = Excel_DS.Tables[0].Rows[i]["GroupName"].ToString();
                        druser["FirstName"] = Excel_DS.Tables[0].Rows[i]["FirstName"].ToString();
                        druser["LastName"] = Excel_DS.Tables[0].Rows[i]["LastName"].ToString();
                        druser["UserID"] = Excel_DS.Tables[0].Rows[i]["UserID"].ToString();
                        druser["EmailAddress"] = Excel_DS.Tables[0].Rows[i]["EmailAddress"].ToString();
                        druser["MobileCountryCode"] = Excel_DS.Tables[0].Rows[i]["MobileCountryCode"].ToString();
                        druser["MobileNo"] = Excel_DS.Tables[0].Rows[i]["MobileNo"].ToString();
                        druser["Address"] = Excel_DS.Tables[0].Rows[i]["Address"].ToString();
                        druser["Block"] = Excel_DS.Tables[0].Rows[i]["Block"].ToString();
                        druser["UserExpiryDate"] = Excel_DS.Tables[0].Rows[i]["UserExpiryDate"].ToString();
                        druser["OtherAirportAccess"] = Excel_DS.Tables[0].Rows[i]["OtherAirportAccess"].ToString();
                        druser["OtherAirportName"] = Excel_DS.Tables[0].Rows[i]["OtherAirportName"].ToString();
                        druser["OtherAirlineAccess"] = Excel_DS.Tables[0].Rows[i]["OtherAirlineAccess"].ToString();
                        druser["OtherAirlineName"] = Excel_DS.Tables[0].Rows[i]["OtherAirlineName"].ToString();
                        druser["Active"] = Excel_DS.Tables[0].Rows[i]["Active"].ToString();
                        dtuser.Rows.Add(druser);
                    }
                    dtuser.TableName = "InputData";
                    Excel_DS.Reset();
                    Excel_DS.Tables.Add(dtuser);

                    ProcedureName = "User_ExcelUpload";

                }
                else if (Text_PageSNo.ToUpper() == "ACCOUNT")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    //ProcedureName = "spExcelUpload_Account";
                    ////ProcedureName = "Account_ExcelUpload_New";
                    //ProcedureName = "Account_ExcelUpload";

                    DataTable dtaccount = new DataTable();
                    dtaccount.Columns.Add("No", typeof(int));
                    dtaccount.Columns.Add("MasterAccount", typeof(string));
                    dtaccount.Columns.Add("MasterAccountCode", typeof(string));
                    dtaccount.Columns.Add("AccountCode", typeof(string));
                    dtaccount.Columns.Add("AccountType", typeof(string));
                    dtaccount.Columns.Add("CustomerType", typeof(string));
                    dtaccount.Columns.Add("TransactionType", typeof(string));
                    dtaccount.Columns.Add("AirlineCode", typeof(string));
                    dtaccount.Columns.Add("CountryCode", typeof(string));
                    dtaccount.Columns.Add("CityCode", typeof(string));
                    dtaccount.Columns.Add("OfficeName", typeof(string));
                    dtaccount.Columns.Add("Name", typeof(string));
                    dtaccount.Columns.Add("IndustryType", typeof(string));
                    dtaccount.Columns.Add("ParticipantID", typeof(string));
                    dtaccount.Columns.Add("RARegistrationNo", typeof(string));
                    dtaccount.Columns.Add("RARegistrationExpDate", typeof(string));
                    dtaccount.Columns.Add("ConsolidateInvoicing", typeof(string));
                    dtaccount.Columns.Add("ConsolidateStock", typeof(string));
                    dtaccount.Columns.Add("Warehouse", typeof(string));
                    dtaccount.Columns.Add("Blacklist", typeof(string));
                    dtaccount.Columns.Add("ERPCode", typeof(string));
                    dtaccount.Columns.Add("Address", typeof(string));
                    dtaccount.Columns.Add("ValidFrom", typeof(string));
                    dtaccount.Columns.Add("ValidTo", typeof(string));
                    dtaccount.Columns.Add("Currency", typeof(string));
                    dtaccount.Columns.Add("IATANo", typeof(string));
                    dtaccount.Columns.Add("CASSNo", typeof(string));
                    dtaccount.Columns.Add("RARegistration", typeof(string));
                    dtaccount.Columns.Add("RAExpiryDate", typeof(string));
                    dtaccount.Columns.Add("GarudaMiles", typeof(string));
                    dtaccount.Columns.Add("CustomCode", typeof(string));
                    dtaccount.Columns.Add("LoginColorCode", typeof(string));
                    dtaccount.Columns.Add("BusinessType", typeof(string));
                    dtaccount.Columns.Add("BillingDueDays", typeof(string));
                    dtaccount.Columns.Add("AllowedCreditLimit", typeof(string));
                    dtaccount.Columns.Add("Active", typeof(string));
                    dtaccount.Columns.Add("ConsolidatedCreditLimit", typeof(string));
                    dtaccount.Columns.Add("CreditLimit", typeof(string));
                    dtaccount.Columns.Add("MinimumCreditLimit", typeof(string));
                    dtaccount.Columns.Add("AlertCreditLimit", typeof(string));
                    dtaccount.Columns.Add("AutoStock", typeof(string));
                    dtaccount.Columns.Add("AccountNo", typeof(string));
                    dtaccount.Columns.Add("AccountNo(SAP)", typeof(string));
                    dtaccount.Columns.Add("BillingCode", typeof(string));
                    dtaccount.Columns.Add("InvoiceCycle", typeof(string));
                    dtaccount.Columns.Add("NotificationType", typeof(string));
                    dtaccount.Columns.Add("MobileNumber", typeof(string));
                    dtaccount.Columns.Add("Email", typeof(string));
                    dtaccount.Columns.Add("VirtualAccountNo", typeof(string));
                    dtaccount.Columns.Add("Forwarder(Agent)AsConsignee", typeof(string));
                    dtaccount.Columns.Add("Salutation", typeof(string));
                    dtaccount.Columns.Add("FirstName", typeof(string));
                    dtaccount.Columns.Add("LastName", typeof(string));
                    dtaccount.Columns.Add("Designation", typeof(string));
                    dtaccount.Columns.Add("Position", typeof(string));
                    dtaccount.Columns.Add("MobileNo", typeof(string));
                    dtaccount.Columns.Add("CustomerEmailId", typeof(string));
                    dtaccount.Columns.Add("Country", typeof(string));
                    dtaccount.Columns.Add("City", typeof(string));
                    dtaccount.Columns.Add("State", typeof(string));
                    dtaccount.Columns.Add("District", typeof(string));
                    dtaccount.Columns.Add("SubDistrict", typeof(string));
                    dtaccount.Columns.Add("Street1", typeof(string));
                    dtaccount.Columns.Add("Street2", typeof(string));
                    dtaccount.Columns.Add("PostalCode", typeof(string));
                    dtaccount.Columns.Add("OfficePhone", typeof(string));
                    dtaccount.Columns.Add("OffEmailId", typeof(string));
                    dtaccount.Columns.Add("Town/Place", typeof(string));
                    dtaccount.Columns.Add("Telex", typeof(string));
                    dtaccount.Columns.Add("ContactActive", typeof(string));
                    int countParticipateId = 0;
                    int countIATANo = 0;
                    int count = Excel_DS.Tables[0].Rows.Count;
                    for (int i = 0; i < count; i++)
                    {
                        DataRow draccount = dtaccount.NewRow();
                        draccount["No"] = i + 1;
                        draccount["MasterAccount"] = Excel_DS.Tables[0].Rows[i]["MasterAccount"].ToString();
                        draccount["MasterAccountCode"] = Excel_DS.Tables[0].Rows[i]["MasterAccountCode"].ToString();
                        draccount["AccountCode"] = Excel_DS.Tables[0].Rows[i]["AccountCode"].ToString();
                        draccount["AccountType"] = Excel_DS.Tables[0].Rows[i]["AccountType"].ToString();
                        draccount["CustomerType"] = Excel_DS.Tables[0].Rows[i]["CustomerType"].ToString();
                        draccount["TransactionType"] = Excel_DS.Tables[0].Rows[i]["TransactionType"].ToString();
                        draccount["AirlineCode"] = Excel_DS.Tables[0].Rows[i]["AirlineCode"].ToString();
                        draccount["CountryCode"] = Excel_DS.Tables[0].Rows[i]["Country"].ToString();
                        draccount["CityCode"] = Excel_DS.Tables[0].Rows[i]["City"].ToString();
                        draccount["OfficeName"] = Excel_DS.Tables[0].Rows[i]["OfficeName"].ToString();
                        draccount["Name"] = Excel_DS.Tables[0].Rows[i]["AccountName"].ToString();
                        draccount["IndustryType"] = Excel_DS.Tables[0].Rows[i]["IndustryType"].ToString();
                        draccount["ParticipantID"] = Excel_DS.Tables[0].Rows[i]["ParticipantID"].ToString();
                        if (Excel_DS.Tables[0].Rows[i]["ParticipantID"].ToString() != "")
                        {
                            countParticipateId++;
                        }
                        draccount["RARegistrationNo"] = Excel_DS.Tables[0].Rows[i]["RARegistrationNo"].ToString();
                        draccount["RARegistrationExpDate"] = Excel_DS.Tables[0].Rows[i]["RARegistrationExpDate"].ToString();
                        draccount["ConsolidateInvoicing"] = Excel_DS.Tables[0].Rows[i]["ConsolidateInvoicing"].ToString();
                        draccount["ConsolidateInvoicing"] = Excel_DS.Tables[0].Rows[i]["ConsolidateInvoicing"].ToString();
                        draccount["ConsolidateStock"] = Excel_DS.Tables[0].Rows[i]["ConsolidateStock"].ToString();
                        draccount["Warehouse"] = Excel_DS.Tables[0].Rows[i]["Warehouse"].ToString();
                        draccount["Blacklist"] = Excel_DS.Tables[0].Rows[i]["Blacklist"].ToString();
                        draccount["ERPCode"] = Excel_DS.Tables[0].Rows[i]["ERPCode"].ToString();
                        draccount["Address"] = Excel_DS.Tables[0].Rows[i]["Address"].ToString();
                        draccount["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString();
                        draccount["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString();
                        draccount["Currency"] = Excel_DS.Tables[0].Rows[i]["Currency"].ToString();
                        draccount["IATANo"] = Excel_DS.Tables[0].Rows[i]["IATANo"].ToString();
                        if (Excel_DS.Tables[0].Rows[i]["IATANo"].ToString() != "")
                        {
                            countIATANo++;
                        }
                        draccount["CASSNo"] = Excel_DS.Tables[0].Rows[i]["CASSNo"].ToString();
                        draccount["RARegistration"] = Excel_DS.Tables[0].Rows[i]["RARegistration"].ToString();
                        draccount["RAExpiryDate"] = Excel_DS.Tables[0].Rows[i]["RAExpiryDate"].ToString();
                        draccount["GarudaMiles"] = Excel_DS.Tables[0].Rows[i]["GarudaMiles"].ToString();
                        draccount["CustomCode"] = Excel_DS.Tables[0].Rows[i]["CustomCode"].ToString();
                        draccount["LoginColorCode"] = Excel_DS.Tables[0].Rows[i]["LoginColorCode"].ToString();
                        draccount["BusinessType"] = Excel_DS.Tables[0].Rows[i]["BusinessType"].ToString();
                        draccount["BillingDueDays"] = Excel_DS.Tables[0].Rows[i]["BillingDueDays"].ToString();
                        draccount["AllowedCreditLimit"] = Excel_DS.Tables[0].Rows[i]["AllowedCreditLimit"].ToString();
                        draccount["Active"] = Excel_DS.Tables[0].Rows[i]["Active"].ToString();
                        draccount["ConsolidatedCreditLimit"] = Excel_DS.Tables[0].Rows[i]["ConsolidatedCreditLimit"].ToString();
                        draccount["CreditLimit"] = Excel_DS.Tables[0].Rows[i]["CreditLimit"].ToString();
                        draccount["MinimumCreditLimit"] = Excel_DS.Tables[0].Rows[i]["MinimumCreditLimit"].ToString();
                        draccount["AlertCreditLimit"] = Excel_DS.Tables[0].Rows[i]["AlertCreditLimit"].ToString();
                        draccount["AutoStock"] = Excel_DS.Tables[0].Rows[i]["AutoStock"].ToString();
                        draccount["AccountNo"] = Excel_DS.Tables[0].Rows[i]["AccountNo"].ToString();
                        draccount["AccountNo(SAP)"] = Excel_DS.Tables[0].Rows[i]["AccountNo(SAP)"].ToString();
                        draccount["BillingCode"] = Excel_DS.Tables[0].Rows[i]["BillingCode"].ToString();
                        draccount["InvoiceCycle"] = Excel_DS.Tables[0].Rows[i]["InvoiceCycle"].ToString();
                        draccount["NotificationType"] = Excel_DS.Tables[0].Rows[i]["NotificationType"].ToString();
                        draccount["MobileNumber"] = Excel_DS.Tables[0].Rows[i]["MobileNumber"].ToString();
                        draccount["Email"] = Excel_DS.Tables[0].Rows[i]["EmailId"].ToString();
                        draccount["VirtualAccountNo"] = Excel_DS.Tables[0].Rows[i]["VirtualAccountNo"].ToString();
                        draccount["Forwarder(Agent)AsConsignee"] = Excel_DS.Tables[0].Rows[i]["Forwarder(Agent)AsConsignee"].ToString();
                        draccount["Salutation"] = Excel_DS.Tables[0].Rows[i]["Salutation"].ToString();
                        draccount["FirstName"] = Excel_DS.Tables[0].Rows[i]["FirstName"].ToString();
                        draccount["LastName"] = Excel_DS.Tables[0].Rows[i]["LastName"].ToString();
                        draccount["Designation"] = Excel_DS.Tables[0].Rows[i]["Designation"].ToString();
                        draccount["Position"] = Excel_DS.Tables[0].Rows[i]["Position"].ToString();
                        draccount["MobileNo"] = Excel_DS.Tables[0].Rows[i]["MobileNo"].ToString();
                        draccount["CustomerEmailId"] = Excel_DS.Tables[0].Rows[i]["EmailId"].ToString();
                        draccount["Country"] = Excel_DS.Tables[0].Rows[i]["Country_1"].ToString();
                        draccount["City"] = Excel_DS.Tables[0].Rows[i]["City_1"].ToString();
                        draccount["State"] = Excel_DS.Tables[0].Rows[i]["State"].ToString();
                        draccount["District"] = Excel_DS.Tables[0].Rows[i]["District"].ToString();
                        draccount["SubDistrict"] = Excel_DS.Tables[0].Rows[i]["SubDistrict"].ToString();
                        draccount["Street1"] = Excel_DS.Tables[0].Rows[i]["Street1"].ToString();
                        draccount["Street2"] = Excel_DS.Tables[0].Rows[i]["Street2"].ToString();
                        draccount["PostalCode"] = Excel_DS.Tables[0].Rows[i]["PostalCode"].ToString();
                        draccount["OfficePhone"] = Excel_DS.Tables[0].Rows[i]["OfficePhone"].ToString();
                        draccount["OffEmailId"] = Excel_DS.Tables[0].Rows[i]["OffEmailId"].ToString();
                        draccount["Town/Place"] = Excel_DS.Tables[0].Rows[i]["Town/Place"].ToString();
                        draccount["Telex"] = Excel_DS.Tables[0].Rows[i]["Telex"].ToString();
                        draccount["ContactActive"] = Excel_DS.Tables[0].Rows[i]["Active"].ToString();
                        dtaccount.Rows.Add(draccount);

                    }
                    dtaccount.TableName = "InputData";
                    Excel_DS.Reset();
                    Excel_DS.Tables.Add(dtaccount);

                    ProcedureName = "Account_ExcelUpload";

                    //if (count == countParticipateId)
                    //{
                    //    ProcedureName = "Account_ExcelUpload_NONCASS";

                    //}
                    //else
                    //{
                    //    if (Excel_DS.Tables[0].Rows[0]["ParticipantID"].ToString() != "")
                    //    {
                    //        ProcedureName = "Account_ExcelUpload_NONCASS";
                    //    }
                    //}
                    //if (count == countIATANo)
                    //{
                    //    ProcedureName = "Account_ExcelUpload_CASS_Test";
                    //}
                    //else
                    //{
                    //    if (Excel_DS.Tables[0].Rows[0]["IATANo"].ToString() != "")
                    //    {
                    //        ProcedureName = "Account_ExcelUpload_CASS_Test";
                    //    }
                    //}
                }
                else if (Text_PageSNo.ToUpper() == "AIRPORT")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_Airport";
                }

                // Uploading exchange rate from excel ===== DONE BY TARUN KUMAR SINGH
                #region ExchangeRate

                else if (Text_PageSNo.ToUpper() == "EXCHANGE RATE" && (ExcelFile.FileName.EndsWith(".xlsx") || ExcelFile.FileName.EndsWith(".xls")))
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_ExchangeRate";
                    SqlParameter[] Parameters1 = { new SqlParameter("@InputData", SqlDbType.Structured) { Value = Excel_DS.Tables["InputData"] },
                                                               new SqlParameter ("@CreatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};
                    DataSet dsEXC = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcedureName, Parameters1);
                    if (dsEXC.Tables.Count == 0)
                    {
                        ViewBag.Message = "Some Error Occured";
                    }
                    else if ((int.Parse(dsEXC.Tables[0].Rows[0][0].ToString()) == 2))
                    {
                        ViewBag.Message = "Exchange Rate Already Exists";
                    }
                    else if ((int.Parse(dsEXC.Tables[1].Rows[0][0].ToString()) != 0))
                    {
                        // ViewBag.Message = "File Uploaded Successfully";  // commented by arman ali date : 2017-08-04
                        //if ((int.Parse(dsEXC.Tables[1].Rows[0][0].ToString()) == '2'))
                        //    ViewBag.Message = "Exchange Rate Already Exists";
                        //else
                        ViewBag.Message = "File Uploaded Successfully";

                    }
                    else
                    {
                        ViewBag.Message = "Unable To Upload File";

                    }
                }
                /////////////////////////////*******END _ TARUN KAUMR SINGH****/////////////////////////////
                #endregion


                else if (Text_PageSNo.Trim().ToUpper() == "AIRCRAFT")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_Aircraft";
                }
                else if (Text_PageSNo.Trim().ToUpper() == "ACCOUNT BUSINESS TYPE")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_AccountBusinessType";
                }
                else if (Text_PageSNo.Trim().ToUpper() == "AIRLINE")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_Airline";
                }
                else if (Text_PageSNo.Trim().ToUpper() == "OFFICE")
                {
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    ProcedureName = "spExcelUpload_Office";
                }
                //else if (Text_PageSNo.Trim().ToUpper() == "SETUP OTHER CHARGES")
                else if (Text_PageSNo.Trim().ToUpper() == "MANAGE OTHER CHARGES")
                {
                    string errorMessage = string.Empty;
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();
                    Excel_Slab = reader.AsDataSet();

                    DataColumnCollection columns = Excel_DS.Tables[0].Columns;
                    if (OtherChargeType == "OTHERCHARGES")
                    {


                        if (columns.Count >= 73)
                        {

                        }
                        else
                        {
                            ViewBag.Error = "Please Select Right Excel File";
                            return View();
                        }
                        //if (Excel_DS.Tables.Count == 2)
                        //{

                        //}
                        //else
                        //{
                        //    ViewBag.Error = "Please Select Right Excel File";
                        //    return View();
                        //}


                    }
                    else
                    {
                        if (columns.Count == 48)
                        {

                        }
                        else
                        {
                            ViewBag.Error = "Please Select Right Excel File";
                            return View();
                        }

                    }

                    DataTable dtSlab = new DataTable();
                    DataTable dtDueCharges = new DataTable();
                    dtDueCharges.Columns.Add("SNo");
                    dtDueCharges.Columns.Add("Airline", typeof(string));
                    dtDueCharges.Columns.Add("OtherChargeType", typeof(string));
                    dtDueCharges.Columns.Add("DueCarrierCharges", typeof(string));
                    dtDueCharges.Columns.Add("Mandatory", typeof(string));
                    dtDueCharges.Columns.Add("OriginLevel", typeof(string));
                    dtDueCharges.Columns.Add("Origin", typeof(string));
                    dtDueCharges.Columns.Add("DestinationLevel", typeof(string));
                    dtDueCharges.Columns.Add("Destination", typeof(string));
                    dtDueCharges.Columns.Add("Unit", typeof(string));
                    dtDueCharges.Columns.Add("Currency", typeof(string));
                    dtDueCharges.Columns.Add("Status", typeof(string));
                    dtDueCharges.Columns.Add("PaymentType", typeof(string));
                    dtDueCharges.Columns.Add("ValidFrom", typeof(string));
                    dtDueCharges.Columns.Add("ValidTo", typeof(string));
                    dtDueCharges.Columns.Add("ChargeType", typeof(string));
                    dtDueCharges.Columns.Add("MinimumValue", typeof(decimal));
                    dtDueCharges.Columns.Add("ChargeValue", typeof(decimal));
                    dtDueCharges.Columns.Add("Taxable", typeof(string));
                    dtDueCharges.Columns.Add("Commissionable", typeof(string));
                    dtDueCharges.Columns.Add("ApplicableOn", typeof(string));
                    dtDueCharges.Columns.Add("ReplanCharges", typeof(string));
                    if (OtherChargeType == "OTHERCHARGES")
                    {
                        dtDueCharges.Columns.Add("SlabName", typeof(string));
                        dtDueCharges.Columns.Add("StartWeight", typeof(string));
                        dtDueCharges.Columns.Add("EndWeight", typeof(string));
                        dtDueCharges.Columns.Add("Type", typeof(string));
                        dtDueCharges.Columns.Add("Rate", typeof(decimal));
                        dtDueCharges.Columns.Add("SlabName1", typeof(string));
                        dtDueCharges.Columns.Add("StartWeight1", typeof(string));
                        dtDueCharges.Columns.Add("EndWeight1", typeof(string));
                        dtDueCharges.Columns.Add("Type1", typeof(string));
                        dtDueCharges.Columns.Add("Rate1", typeof(decimal));
                        dtDueCharges.Columns.Add("SlabName2", typeof(string));
                        dtDueCharges.Columns.Add("StartWeight2", typeof(string));
                        dtDueCharges.Columns.Add("EndWeight2", typeof(string));
                        dtDueCharges.Columns.Add("Type2", typeof(string));
                        dtDueCharges.Columns.Add("Rate2", typeof(decimal));
                        dtDueCharges.Columns.Add("SlabName3", typeof(string));
                        dtDueCharges.Columns.Add("StartWeight3", typeof(string));
                        dtDueCharges.Columns.Add("EndWeight3", typeof(string));
                        dtDueCharges.Columns.Add("Type3", typeof(string));
                        dtDueCharges.Columns.Add("Rate3", typeof(decimal));
                        dtDueCharges.Columns.Add("SlabName4", typeof(string));
                        dtDueCharges.Columns.Add("StartWeight4", typeof(string));
                        dtDueCharges.Columns.Add("EndWeight4", typeof(string));
                        dtDueCharges.Columns.Add("Type4", typeof(string));
                        dtDueCharges.Columns.Add("Rate4", typeof(decimal));

                    }
                    dtDueCharges.Columns.Add("IssueCarrier", typeof(string));
                    dtDueCharges.Columns.Add("IncludeIssueCarrier", typeof(string));
                    dtDueCharges.Columns.Add("FlightNumber", typeof(string));
                    dtDueCharges.Columns.Add("IncludeFlightNumber", typeof(string));
                    dtDueCharges.Columns.Add("DayofWeek", typeof(string));
                    dtDueCharges.Columns.Add("IncludeDayofWeek", typeof(string));
                    dtDueCharges.Columns.Add("StartTime", typeof(string));
                    dtDueCharges.Columns.Add("EndTime", typeof(string));
                    dtDueCharges.Columns.Add("IncludeSET", typeof(string));
                    dtDueCharges.Columns.Add("TransitStation", typeof(string));
                    dtDueCharges.Columns.Add("IncludeTransitStation", typeof(string));
                    dtDueCharges.Columns.Add("CommodityCode", typeof(string));
                    dtDueCharges.Columns.Add("IncludeCommodityCode", typeof(string));
                    dtDueCharges.Columns.Add("AgentGroup", typeof(string));
                    dtDueCharges.Columns.Add("IncludeAgentGroup", typeof(string));
                    dtDueCharges.Columns.Add("ProductType", typeof(string));
                    dtDueCharges.Columns.Add("IncludeProductType", typeof(string));
                    dtDueCharges.Columns.Add("AgentName", typeof(string));
                    dtDueCharges.Columns.Add("IncludeAgentName", typeof(string));
                    dtDueCharges.Columns.Add("SpecialHandlingCode", typeof(string));
                    dtDueCharges.Columns.Add("IncludeSpecialHandlingCode", typeof(string));
                    dtDueCharges.Columns.Add("ShipperName", typeof(string));
                    dtDueCharges.Columns.Add("IncludeShipperName", typeof(string));
                    dtDueCharges.Columns.Add("SpecialHandlingGroup", typeof(string));
                    dtDueCharges.Columns.Add("IncludeSpecialHandlingGroup", typeof(string));
                    dtDueCharges.Columns.Add("Remark", typeof(string));
                    dtDueCharges.Columns.Add("Message", typeof(string));
                    DataRow dr = dtDueCharges.NewRow();

                    int count = Excel_DS.Tables[0].Rows.Count;
                    for (int i = 0; i < count; i++)
                    {
                        //string errorMessage = string.Empty;
                        dr = dtDueCharges.NewRow();
                        dr["SNo"] = i + 1;
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Airline"])))
                        {
                            dr["Airline"] = Excel_DS.Tables[0].Rows[i]["Airline"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + "Airline must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OtherChargeType"])))
                        {
                            dr["OtherChargeType"] = Excel_DS.Tables[0].Rows[i]["OtherChargeType"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + "OtherChargeType must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["DueCarrierCharges"])))
                        {
                            dr["DueCarrierCharges"] = Excel_DS.Tables[0].Rows[i]["DueCarrierCharges"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + "DueCarrierCharges must not be empty";
                        }
                        dr["Mandatory"] = Excel_DS.Tables[0].Rows[i]["Mandatory"].ToString().Trim();
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OriginLevel"])))
                        {
                            dr["OriginLevel"] = Excel_DS.Tables[0].Rows[i]["OriginLevel"].ToString().Trim();
                            if (dr["OriginLevel"].ToString().ToUpper() != "CITY" && dr["OriginLevel"].ToString().ToUpper() != "COUNTRY" && dr["OriginLevel"].ToString().ToUpper() != "REGION" && dr["OriginLevel"].ToString().ToUpper() != "ZONE" && dr["OriginLevel"].ToString().ToUpper() != "AIRPORT")
                            {
                                errorMessage = errorMessage + ", Origin Level must be either City,Country,Airport,Region or Zone";
                            }
                        }
                        else
                        {
                            errorMessage = errorMessage + ", Origin Level must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Origin"])))
                        {
                            dr["Origin"] = Excel_DS.Tables[0].Rows[i]["Origin"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + "Origin must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["DestinationLevel"])))
                        {
                            dr["DestinationLevel"] = Excel_DS.Tables[0].Rows[i]["DestinationLevel"].ToString().Trim();
                            if (dr["DestinationLevel"].ToString().ToUpper() != "CITY" && dr["DestinationLevel"].ToString().ToUpper() != "COUNTRY" && dr["DestinationLevel"].ToString().ToUpper() != "REGION" && dr["DestinationLevel"].ToString().ToUpper() != "ZONE" && dr["DestinationLevel"].ToString().ToUpper() != "AIRPORT")
                            {
                                errorMessage = errorMessage + ", Destination Level must be either City,Country,Airport,Region or Zone";
                            }
                        }
                        else
                        {
                            errorMessage = errorMessage + ", Destination Level must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Destination"])))
                        {
                            dr["Destination"] = Excel_DS.Tables[0].Rows[i]["Destination"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + ", Destination must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Unit"])))
                        {
                            dr["Unit"] = Excel_DS.Tables[0].Rows[i]["Unit"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + ", Unit must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Currency"])))
                        {
                            dr["Currency"] = Excel_DS.Tables[0].Rows[i]["Currency"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + ", Currency must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Status"])))
                        {
                            dr["Status"] = Excel_DS.Tables[0].Rows[i]["Status"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + ", Status must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PaymentType"])))
                        {
                            dr["PaymentType"] = Excel_DS.Tables[0].Rows[i]["PaymentType"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + ", PaymentType must not be empty";
                        }
                        int dateresult = 0;
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ValidFrom"])))
                        {
                            try
                            {

                                string ValidDate = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                string[] ArrayValidDate = ValidDate.Split('/');

                                string[] formats = { "MM/dd/yyyy" };


                                ////string dt1 = DateTime.Today.ToString("MM/dd/yyyy");
                                ////string dt2 = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString();
                                ////var dateTime1 = DateTime.ParseExact(DateTime.Today.ToString(), "MM/dd/yyyy",null);
                                ////var dateTime2 = DateTime.ParseExact(dt2, formats, new CultureInfo("en-US"), DateTimeStyles.None);
                                ////DateTime dt3 = DateTime.ParseExact(dt1, "MM/dd/yyyy", CultureInfo.InvariantCulture);
                                ////DateTime dt4 = DateTime.ParseExact(dt2, "MM/dd/yyyy", CultureInfo.InvariantCulture);

                                if (int.TryParse(ArrayValidDate[0].ToString().Trim(), out dateresult))
                                {
                                    //    if (Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]) >= Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy")) || Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]) <= Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy")))
                                    //    {
                                    dr["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                    //    }
                                }
                                else
                                {
                                    dr["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                    errorMessage = errorMessage + "ValidFrom Date Format should be MM/DD/YYYY";
                                }
                            }
                            catch (Exception ex)
                            {
                                int j = i + 1;
                                ViewBag.Error = "File not Uploaded...Some Data Problem in ValidFrom Date at Row No. " + j;
                                ModelState.AddModelError("Error", "Error Occurred!!");
                                return View();
                            }
                            //    errorMessage = errorMessage + "ValidFrom Date must not be less than ValidTo Date";
                            //}

                        }
                        else
                        {
                            errorMessage = errorMessage + ", ValidFrom Date must not be empty";
                        }

                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ValidTo"])))
                        {
                            try
                            {
                                if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ValidFrom"])))
                                {
                                    string ValidDate = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                    string[] ArrayValidDate = ValidDate.Split('/');
                                    if (int.TryParse(ArrayValidDate[0].ToString().Trim(), out dateresult))
                                    {

                                        //if (Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidTo"]) >= Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy")))
                                        //{

                                        //    if (Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidTo"]) >= Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]))
                                        //    {
                                        dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                        //    }
                                        //    else
                                        //    {
                                        //        dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                        //        errorMessage = errorMessage + ", ValidTo Date must be greater than ValidFrom Date";
                                        //    }
                                        //}
                                        //else
                                        //{
                                        //    dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                        //    errorMessage = errorMessage + ", ValidTo Date can not be less than Todaydate";
                                        //}
                                        // dr["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                    }
                                    else
                                    {
                                        dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                        errorMessage = errorMessage + ", ValidTo Date Format should be MM/DD/YYYY";
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                int j = i + 1;
                                ViewBag.Error = "File not Uploaded...Some Data Problem in ValidTo Date at Row No. " + j;
                                ModelState.AddModelError("Error", "Error Occurred!!");
                                return View();
                            }

                        }
                        else
                        {
                            errorMessage = errorMessage + ", ValidTo Date Name must not be empty";
                        }
                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ChargeType"])))
                        {
                            dr["ChargeType"] = Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim();

                        }
                        else
                        {
                            errorMessage = errorMessage + ", ChargeType Name must not be empty";
                        }

                        if (Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim() == "PER HOUSE")
                        {
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["MinimumValue"])))
                            {
                                dr["MinimumValue"] = Excel_DS.Tables[0].Rows[i]["MinimumValue"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + ", MinimumValue should not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ChargeValue"])))
                            {
                                dr["ChargeValue"] = Excel_DS.Tables[0].Rows[i]["ChargeValue"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + ", ChargeValue should not be empty";
                            }
                        }
                        else
                        {
                            dr["MinimumValue"] = 0;
                            dr["ChargeValue"] = 0;
                        }
                        if (Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim() == "FLAT CHARGES")
                        {
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ChargeValue"])))
                            {
                                dr["ChargeValue"] = Excel_DS.Tables[0].Rows[i]["ChargeValue"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + ", ChargeValue should not be empty";
                            }
                        }
                        else
                        {
                            dr["ChargeValue"] = 0;
                        }
                        if (Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim() == "PER PIECE" || Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim() == "CHARGEABLE WEIGHT" || Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim() == "GROSS WEIGHT")
                        {
                            dr["MinimumValue"] = 0;
                            dr["ChargeValue"] = 0;
                        }

                        dr["Taxable"] = Excel_DS.Tables[0].Rows[i]["Taxable"].ToString().Trim();
                        dr["Commissionable"] = Excel_DS.Tables[0].Rows[i]["Commissionable"].ToString().Trim();


                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ApplicableOn"])))
                        {
                            dr["ApplicableOn"] = Excel_DS.Tables[0].Rows[i]["ApplicableOn"].ToString().Trim();
                        }
                        else
                        {
                            errorMessage = errorMessage + ", ApplicableOn must not be empty";
                        }

                        dr["ReplanCharges"] = Excel_DS.Tables[0].Rows[i]["ReplanCharges"].ToString().Trim();

                        decimal result = 0;
                        if (OtherChargeType == "OTHERCHARGES")
                        {
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["SlabName"])))
                            {
                                dr["SlabName"] = Excel_DS.Tables[0].Rows[i]["SlabName"].ToString();
                            }
                            else
                            {
                                dr["SlabName"] = "";
                                errorMessage = errorMessage + "' SlabName should not be blank";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["StartWeight"])))
                            {
                                dr["StartWeight"] = Excel_DS.Tables[0].Rows[i]["StartWeight"].ToString();
                            }
                            else
                            {
                                dr["StartWeight"] = "";
                                errorMessage = errorMessage + "' StartWeight should not be blank";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["EndWeight"])))
                            {
                                dr["EndWeight"] = Excel_DS.Tables[0].Rows[i]["EndWeight"].ToString();
                            }
                            else
                            {
                                dr["EndWeight"] = "";
                                errorMessage = errorMessage + "' EndWeight should not be blank";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Type"])))
                            {
                                dr["Type"] = Excel_DS.Tables[0].Rows[i]["Type"].ToString();
                            }
                            else
                            {
                                dr["Type"] = "";
                                errorMessage = errorMessage + "' Type should not be blank";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate"]), out result))
                                {
                                    dr["Rate"] = Excel_DS.Tables[0].Rows[i]["Rate"].ToString().Trim();
                                    //checkSlab = Convert.ToDecimal(dr["Rate"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Rate"].ToString().Trim();
                                    // dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Rate should be decimal value";
                                }
                            }
                            else
                            {
                                dr["Rate"] = 0;
                                // errorMessage = errorMessage + "Minimum must not be empty";
                            }


                            //dr["SlabName"] = Excel_DS.Tables[0].Rows[i]["SlabName"].ToString().Trim();
                            //dr["StartWeight"] = Excel_DS.Tables[0].Rows[i]["StartWeight"].ToString().Trim();
                            //dr["EndWeight"] = Excel_DS.Tables[0].Rows[i]["EndWeight"].ToString().Trim();
                            //dr["Type"] = Excel_DS.Tables[0].Rows[i]["Type"].ToString().Trim();
                            //dr["Rate"] = Excel_DS.Tables[0].Rows[i]["Rate"].ToString().Trim();
                            dr["SlabName1"] = Excel_DS.Tables[0].Rows[i]["SlabName_1"].ToString().Trim();
                            dr["StartWeight1"] = Excel_DS.Tables[0].Rows[i]["StartWeight_1"].ToString().Trim();
                            dr["EndWeight1"] = Excel_DS.Tables[0].Rows[i]["EndWeight_1"].ToString().Trim();
                            dr["Type1"] = Excel_DS.Tables[0].Rows[i]["Type_1"].ToString().Trim();
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_1"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_1"]), out result))
                                {
                                    dr["Rate1"] = Excel_DS.Tables[0].Rows[i]["Rate_1"].ToString().Trim();
                                    //checkSlab = Convert.ToDecimal(dr["Rate"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Rate_1"].ToString().Trim();
                                    // dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Rate should be decimal value";
                                }
                            }
                            else
                            {
                                dr["Rate1"] = 0;
                                // errorMessage = errorMessage + "Minimum must not be empty";
                            }

                            //dr["Rate2"] = Excel_DS.Tables[0].Rows[i]["Rate_1"].ToString().Trim();
                            dr["SlabName2"] = Excel_DS.Tables[0].Rows[i]["SlabName_2"].ToString().Trim();
                            dr["StartWeight2"] = Excel_DS.Tables[0].Rows[i]["StartWeight_2"].ToString().Trim();
                            dr["EndWeight2"] = Excel_DS.Tables[0].Rows[i]["EndWeight_2"].ToString().Trim();
                            dr["Type2"] = Excel_DS.Tables[0].Rows[i]["Type_2"].ToString().Trim();
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_2"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_2"]), out result))
                                {
                                    dr["Rate2"] = Excel_DS.Tables[0].Rows[i]["Rate_2"].ToString().Trim();
                                    //checkSlab = Convert.ToDecimal(dr["Rate"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Rate_2"].ToString().Trim();
                                    // dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Rate should be decimal value";
                                }
                            }
                            else
                            {
                                dr["Rate2"] = 0;
                                // errorMessage = errorMessage + "Minimum must not be empty";
                            }
                            //dr["Rate3"] = Excel_DS.Tables[0].Rows[i]["Rate_2"].ToString().Trim();
                            dr["SlabName3"] = Excel_DS.Tables[0].Rows[i]["SlabName_3"].ToString().Trim();
                            dr["StartWeight3"] = Excel_DS.Tables[0].Rows[i]["StartWeight_3"].ToString().Trim();
                            dr["EndWeight3"] = Excel_DS.Tables[0].Rows[i]["EndWeight_3"].ToString().Trim();
                            dr["Type3"] = Excel_DS.Tables[0].Rows[i]["Type_3"].ToString().Trim();
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_3"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_3"]), out result))
                                {
                                    dr["Rate3"] = Excel_DS.Tables[0].Rows[i]["Rate_3"].ToString().Trim();
                                    //checkSlab = Convert.ToDecimal(dr["Rate"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Rate_3"].ToString().Trim();
                                    // dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Rate should be decimal value";
                                }
                            }
                            else
                            {
                                dr["Rate3"] = 0;
                                // errorMessage = errorMessage + "Minimum must not be empty";
                            }
                            //dr["Rate4"] = Excel_DS.Tables[0].Rows[i]["Rate_3"].ToString().Trim();
                            dr["SlabName4"] = Excel_DS.Tables[0].Rows[i]["SlabName_4"].ToString().Trim();
                            dr["StartWeight4"] = Excel_DS.Tables[0].Rows[i]["StartWeight_4"].ToString().Trim();
                            dr["EndWeight4"] = Excel_DS.Tables[0].Rows[i]["EndWeight_4"].ToString().Trim();
                            dr["Type4"] = Excel_DS.Tables[0].Rows[i]["Type_4"].ToString().Trim();
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_4"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Rate_4"]), out result))
                                {
                                    dr["Rate4"] = Excel_DS.Tables[0].Rows[i]["Rate_4"].ToString().Trim();
                                    //checkSlab = Convert.ToDecimal(dr["Rate"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Rate_4"].ToString().Trim();
                                    // dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Rate should be decimal value";
                                }
                            }
                            else
                            {
                                dr["Rate4"] = 0;
                                // errorMessage = errorMessage + "Minimum must not be empty";
                            }
                            // dr["Rate5"] = Excel_DS.Tables[0].Rows[i]["Rate_4"].ToString().Trim();
                        }
                        dr["IssueCarrier"] = Excel_DS.Tables[0].Rows[i]["IssueCarrier"].ToString().Trim();
                        dr["IncludeIssueCarrier"] = Excel_DS.Tables[0].Rows[i]["Include"].ToString().Trim();
                        dr["FlightNumber"] = Excel_DS.Tables[0].Rows[i]["FlightNumber"].ToString().Trim();
                        dr["IncludeFlightNumber"] = Excel_DS.Tables[0].Rows[i]["Include_1"].ToString().Trim();
                        dr["DayofWeek"] = Excel_DS.Tables[0].Rows[i]["DayofWeek"].ToString().Trim();
                        dr["IncludeDayofWeek"] = Excel_DS.Tables[0].Rows[i]["Include_2"].ToString().Trim();
                        dr["StartTime"] = Excel_DS.Tables[0].Rows[i]["StartTime"].ToString().Trim();
                        dr["EndTime"] = Excel_DS.Tables[0].Rows[i]["EndTime"].ToString().Trim();
                        dr["IncludeSET"] = Excel_DS.Tables[0].Rows[i]["Include_3"].ToString().Trim();
                        dr["TransitStation"] = Excel_DS.Tables[0].Rows[i]["TransitStation"].ToString().Trim();
                        dr["IncludeTransitStation"] = Excel_DS.Tables[0].Rows[i]["Include_4"].ToString().Trim();
                        dr["CommodityCode"] = Excel_DS.Tables[0].Rows[i]["CommodityCode"].ToString().Trim();
                        dr["IncludeCommodityCode"] = Excel_DS.Tables[0].Rows[i]["Include_5"].ToString().Trim();
                        dr["AgentGroup"] = Excel_DS.Tables[0].Rows[i]["AgentGroup"].ToString().Trim();
                        dr["IncludeAgentGroup"] = Excel_DS.Tables[0].Rows[i]["Include_6"].ToString().Trim();
                        dr["ProductType"] = Excel_DS.Tables[0].Rows[i]["ProductType"].ToString().Trim();
                        dr["IncludeProductType"] = Excel_DS.Tables[0].Rows[i]["Include_7"].ToString().Trim();
                        dr["AgentName"] = Excel_DS.Tables[0].Rows[i]["AgentName"].ToString().Trim();
                        dr["IncludeAgentName"] = Excel_DS.Tables[0].Rows[i]["Include_8"].ToString();
                        dr["IncludeSpecialHandlingCode"] = Excel_DS.Tables[0].Rows[i]["Include_9"].ToString().Trim();
                        dr["IncludeShipperName"] = Excel_DS.Tables[0].Rows[i]["Include_10"].ToString().Trim();
                        dr["IncludeSpecialHandlingGroup"] = Excel_DS.Tables[0].Rows[i]["Include_11"].ToString().Trim();
                        dr["SpecialHandlingCode"] = Excel_DS.Tables[0].Rows[i]["SpecialHandlingCode"].ToString().Trim();
                        // dr["IncludeSpecialHandlingCode"] = Excel_DS.Tables[0].Rows[i]["Include_8"].ToString();
                        dr["ShipperName"] = Excel_DS.Tables[0].Rows[i]["ShipperName"].ToString().Trim();
                        dr["SpecialHandlingGroup"] = Excel_DS.Tables[0].Rows[i]["SpecialHandlingGroup"].ToString().Trim();
                        // dr["IncludeShipperName"] = Excel_DS.Tables[0].Rows[i]["Include_9"].ToString();
                        dr["Remark"] = Excel_DS.Tables[0].Rows[i]["Remark"].ToString().Trim();
                        dr["Message"] = errorMessage;

                        dtDueCharges.Rows.Add(dr);
                        errorMessage = "";
                    }
                    ////if (Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim() != "PER HOUSE" || Excel_DS.Tables[0].Rows[i]["ChargeType"].ToString().Trim() != "FLAT CHARGES")
                    ////{
                    //if (OtherChargeType == "OTHERCHARGES")
                    //{

                    //    dtSlab.TableName = "SlabDetails";
                    //    dtSlab.Columns.Add("RateSNo", typeof(int));
                    //    dtSlab.Columns.Add("SlabName", typeof(string));
                    //    dtSlab.Columns.Add("StartWeight", typeof(string));
                    //    dtSlab.Columns.Add("EndWeight", typeof(string));
                    //    dtSlab.Columns.Add("Type", typeof(string));
                    //    dtSlab.Columns.Add("Rate", typeof(string));
                    //    //dtSlab.Columns.Add("Message", typeof(string));
                    //    DataRow drSlab = dtSlab.NewRow();
                    //    if (Excel_DS.Tables[1].Rows.Count > 0)
                    //    {
                    //        int countslab = Excel_DS.Tables[1].Rows.Count;

                    //        for (int a = 0; a < countslab; a++)
                    //        {
                    //            decimal result = 0;
                    //            decimal checkSlab = 0;
                    //            drSlab = dtSlab.NewRow();
                    //            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[1].Rows[a]["RateSNo"])))
                    //            {
                    //                drSlab["RateSNo"] = Excel_DS.Tables[1].Rows[a]["RateSNo"].ToString();
                    //            }
                    //            else
                    //            {
                    //                drSlab["RateSNo"] = 0;
                    //                errorMessage = errorMessage + "' RateSNo should not be blank";
                    //            }
                    //            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[1].Rows[a]["SlabName"])))
                    //            {
                    //                drSlab["SlabName"] = Excel_DS.Tables[1].Rows[a]["SlabName"].ToString();
                    //            }
                    //            else
                    //            {
                    //                drSlab["SlabName"] = "";
                    //                errorMessage = errorMessage + "' SlabName should not be blank";
                    //            }
                    //            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[1].Rows[a]["StartWeight"])))
                    //            {
                    //                drSlab["StartWeight"] = Excel_DS.Tables[1].Rows[a]["StartWeight"].ToString();
                    //            }
                    //            else
                    //            {
                    //                drSlab["StartWeight"] = "";
                    //                errorMessage = errorMessage + "' StartWeight should not be blank";
                    //            }
                    //            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[1].Rows[a]["EndWeight"])))
                    //            {
                    //                drSlab["EndWeight"] = Excel_DS.Tables[1].Rows[a]["EndWeight"].ToString();
                    //            }
                    //            else
                    //            {
                    //                drSlab["EndWeight"] = "";
                    //                errorMessage = errorMessage + "' EndWeight should not be blank";
                    //            }
                    //            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[1].Rows[a]["Type"])))
                    //            {
                    //                drSlab["Type"] = Excel_DS.Tables[1].Rows[a]["Type"].ToString();
                    //            }
                    //            else
                    //            {
                    //                drSlab["Type"] = "";
                    //                errorMessage = errorMessage + "' Type should not be blank";
                    //            }
                    //            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[1].Rows[a]["Rate"])))
                    //            {
                    //                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[1].Rows[a]["Rate"]), out result))
                    //                {
                    //                    drSlab["Rate"] = Excel_DS.Tables[1].Rows[a]["Rate"].ToString().Trim();
                    //                    //checkSlab = Convert.ToDecimal(dr["Rate"]);
                    //                }
                    //                else
                    //                {
                    //                    string str = Excel_DS.Tables[1].Rows[a]["Rate"].ToString().Trim();
                    //                    // dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                    //                    errorMessage = errorMessage + ", '" + str + "' Rate should be decimal value";
                    //                }
                    //            }
                    //            else
                    //            {
                    //                drSlab["Rate"] = 0;
                    //                // errorMessage = errorMessage + "Minimum must not be empty";
                    //            }
                    //            //drSlab["Message"] = errorMessage;
                    //            dtSlab.Rows.Add(drSlab);
                    //        }
                    //    }
                    //}

                    DataRow[] drOkCharges = dtDueCharges.Select("Message = ''");
                    DataTable dtFinalCharges = new DataTable();
                    dtFinalCharges.TableName = "InputData";
                    dtFinalCharges.Columns.Add("SNo");
                    dtFinalCharges.Columns.Add("Airline", typeof(string));
                    dtFinalCharges.Columns.Add("OtherChargeType", typeof(string));
                    dtFinalCharges.Columns.Add("DueCarrierCharges", typeof(string));
                    dtFinalCharges.Columns.Add("Mandatory", typeof(string));
                    dtFinalCharges.Columns.Add("OriginLevel", typeof(string));
                    dtFinalCharges.Columns.Add("Origin", typeof(string));
                    dtFinalCharges.Columns.Add("DestinationLevel", typeof(string));
                    dtFinalCharges.Columns.Add("Destination", typeof(string));
                    dtFinalCharges.Columns.Add("Unit", typeof(string));
                    dtFinalCharges.Columns.Add("Currency", typeof(string));
                    dtFinalCharges.Columns.Add("Status", typeof(string));
                    dtFinalCharges.Columns.Add("PaymentType", typeof(string));
                    dtFinalCharges.Columns.Add("ValidFrom", typeof(string));
                    dtFinalCharges.Columns.Add("ValidTo", typeof(string));
                    dtFinalCharges.Columns.Add("ChargeType", typeof(string));
                    dtFinalCharges.Columns.Add("MinimumValue", typeof(decimal));
                    dtFinalCharges.Columns.Add("ChargeValue", typeof(decimal));
                    dtFinalCharges.Columns.Add("Taxable", typeof(string));
                    dtFinalCharges.Columns.Add("Commissionable", typeof(string));
                    dtFinalCharges.Columns.Add("ApplicableOn", typeof(string));
                    dtFinalCharges.Columns.Add("ReplanCharges", typeof(string));
                    if (OtherChargeType == "OTHERCHARGES")
                    {
                        dtFinalCharges.Columns.Add("SlabName", typeof(string));
                        dtFinalCharges.Columns.Add("StartWeight", typeof(string));
                        dtFinalCharges.Columns.Add("EndWeight", typeof(string));
                        dtFinalCharges.Columns.Add("Type", typeof(string));
                        dtFinalCharges.Columns.Add("Rate", typeof(decimal));
                        dtFinalCharges.Columns.Add("SlabName1", typeof(string));
                        dtFinalCharges.Columns.Add("StartWeight1", typeof(string));
                        dtFinalCharges.Columns.Add("EndWeight1", typeof(string));
                        dtFinalCharges.Columns.Add("Type1", typeof(string));
                        dtFinalCharges.Columns.Add("Rate1", typeof(decimal));
                        dtFinalCharges.Columns.Add("SlabName2", typeof(string));
                        dtFinalCharges.Columns.Add("StartWeight2", typeof(string));
                        dtFinalCharges.Columns.Add("EndWeight2", typeof(string));
                        dtFinalCharges.Columns.Add("Type2", typeof(string));
                        dtFinalCharges.Columns.Add("Rate2", typeof(decimal));
                        dtFinalCharges.Columns.Add("SlabName3", typeof(string));
                        dtFinalCharges.Columns.Add("StartWeight3", typeof(string));
                        dtFinalCharges.Columns.Add("EndWeight3", typeof(string));
                        dtFinalCharges.Columns.Add("Type3", typeof(string));
                        dtFinalCharges.Columns.Add("Rate3", typeof(decimal));
                        dtFinalCharges.Columns.Add("SlabName4", typeof(string));
                        dtFinalCharges.Columns.Add("StartWeight4", typeof(string));
                        dtFinalCharges.Columns.Add("EndWeight4", typeof(string));
                        dtFinalCharges.Columns.Add("Type4", typeof(string));
                        dtFinalCharges.Columns.Add("Rate4", typeof(decimal));

                    }
                    dtFinalCharges.Columns.Add("IssueCarrier", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeIssueCarrier", typeof(string));
                    dtFinalCharges.Columns.Add("FlightNumber", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeFlightNumber", typeof(string));
                    dtFinalCharges.Columns.Add("DayofWeek", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeDayofWeek", typeof(string));
                    dtFinalCharges.Columns.Add("StartTime", typeof(string));
                    dtFinalCharges.Columns.Add("EndTime", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeSET", typeof(string));
                    dtFinalCharges.Columns.Add("TransitStation", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeTransitStation", typeof(string));
                    dtFinalCharges.Columns.Add("CommodityCode", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeCommodityCode", typeof(string));
                    dtFinalCharges.Columns.Add("AgentGroup", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeAgentGroup", typeof(string));
                    dtFinalCharges.Columns.Add("ProductType", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeProductType", typeof(string));
                    dtFinalCharges.Columns.Add("AgentName", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeAgentName", typeof(string));
                    dtFinalCharges.Columns.Add("SpecialHandlingCode", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeSpecialHandlingCode", typeof(string));
                    dtFinalCharges.Columns.Add("ShipperName", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeShipperName", typeof(string));
                    dtFinalCharges.Columns.Add("SpecialHandlingGroup", typeof(string));
                    dtFinalCharges.Columns.Add("IncludeSpecialHandlingGroup", typeof(string));
                    dtFinalCharges.Columns.Add("Remark", typeof(string));
                    dtFinalCharges.Columns.Add("Message", typeof(string));



                    foreach (DataRow dr1 in drOkCharges)
                    {
                        //dtFinal.Rows.Add(drOk);
                        dtFinalCharges.ImportRow(dr1);
                    }

                    DataRow[] drerrorCharge = dtDueCharges.Select("Message <> ''");
                    DataTable dtErrorCharge = new DataTable();
                    dtErrorCharge.Columns.Add("SNo");
                    dtErrorCharge.Columns.Add("Airline", typeof(string));
                    dtErrorCharge.Columns.Add("OtherChargeType", typeof(string));
                    dtErrorCharge.Columns.Add("DueCarrierCharges", typeof(string));
                    dtErrorCharge.Columns.Add("Mandatory", typeof(string));
                    dtErrorCharge.Columns.Add("OriginLevel", typeof(string));
                    dtErrorCharge.Columns.Add("Origin", typeof(string));
                    dtErrorCharge.Columns.Add("DestinationLevel", typeof(string));
                    dtErrorCharge.Columns.Add("Destination", typeof(string));
                    dtErrorCharge.Columns.Add("Unit", typeof(string));
                    dtErrorCharge.Columns.Add("Currency", typeof(string));
                    dtErrorCharge.Columns.Add("Status", typeof(string));
                    dtErrorCharge.Columns.Add("PaymentType", typeof(string));
                    dtErrorCharge.Columns.Add("ValidFrom", typeof(string));
                    dtErrorCharge.Columns.Add("ValidTo", typeof(string));
                    dtErrorCharge.Columns.Add("ChargeType", typeof(string));
                    dtErrorCharge.Columns.Add("MinimumValue", typeof(decimal));
                    dtErrorCharge.Columns.Add("ChargeValue", typeof(decimal));
                    dtErrorCharge.Columns.Add("Taxable", typeof(string));
                    dtErrorCharge.Columns.Add("Commissionable", typeof(string));
                    dtErrorCharge.Columns.Add("ApplicableOn", typeof(string));
                    dtErrorCharge.Columns.Add("ReplanCharges", typeof(string));
                    if (OtherChargeType == "OTHERCHARGES")
                    {
                        dtErrorCharge.Columns.Add("SlabName", typeof(string));
                        dtErrorCharge.Columns.Add("StartWeight", typeof(string));
                        dtErrorCharge.Columns.Add("EndWeight", typeof(string));
                        dtErrorCharge.Columns.Add("Type", typeof(string));
                        dtErrorCharge.Columns.Add("Rate", typeof(decimal));
                        dtErrorCharge.Columns.Add("SlabName1", typeof(string));
                        dtErrorCharge.Columns.Add("StartWeight1", typeof(string));
                        dtErrorCharge.Columns.Add("EndWeight1", typeof(string));
                        dtErrorCharge.Columns.Add("Type1", typeof(string));
                        dtErrorCharge.Columns.Add("Rate1", typeof(decimal));
                        dtErrorCharge.Columns.Add("SlabName2", typeof(string));
                        dtErrorCharge.Columns.Add("StartWeight2", typeof(string));
                        dtErrorCharge.Columns.Add("EndWeight2", typeof(string));
                        dtErrorCharge.Columns.Add("Type2", typeof(string));
                        dtErrorCharge.Columns.Add("Rate2", typeof(decimal));
                        dtErrorCharge.Columns.Add("SlabName3", typeof(string));
                        dtErrorCharge.Columns.Add("StartWeight3", typeof(string));
                        dtErrorCharge.Columns.Add("EndWeight3", typeof(string));
                        dtErrorCharge.Columns.Add("Type3", typeof(string));
                        dtErrorCharge.Columns.Add("Rate3", typeof(decimal));
                        dtErrorCharge.Columns.Add("SlabName4", typeof(string));
                        dtErrorCharge.Columns.Add("StartWeight4", typeof(string));
                        dtErrorCharge.Columns.Add("EndWeight4", typeof(string));
                        dtErrorCharge.Columns.Add("Type4", typeof(string));
                        dtErrorCharge.Columns.Add("Rate4", typeof(decimal));

                    }
                    dtErrorCharge.Columns.Add("IssueCarrier", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeIssueCarrier", typeof(string));
                    dtErrorCharge.Columns.Add("FlightNumber", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeFlightNumber", typeof(string));
                    dtErrorCharge.Columns.Add("DayofWeek", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeDayofWeek", typeof(string));
                    dtErrorCharge.Columns.Add("StartTime", typeof(string));
                    dtErrorCharge.Columns.Add("EndTime", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeSET", typeof(string));
                    dtErrorCharge.Columns.Add("TransitStation", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeTransitStation", typeof(string));
                    dtErrorCharge.Columns.Add("CommodityCode", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeCommodityCode", typeof(string));
                    dtErrorCharge.Columns.Add("AgentGroup", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeAgentGroup", typeof(string));
                    dtErrorCharge.Columns.Add("ProductType", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeProductType", typeof(string));
                    dtErrorCharge.Columns.Add("AgentName", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeAgentName", typeof(string));
                    dtErrorCharge.Columns.Add("SpecialHandlingCode", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeSpecialHandlingCode", typeof(string));
                    dtErrorCharge.Columns.Add("ShipperName", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeShipperName", typeof(string));
                    dtErrorCharge.Columns.Add("SpecialHandlingGroup", typeof(string));
                    dtErrorCharge.Columns.Add("IncludeSpecialHandlingGroup", typeof(string));
                    dtErrorCharge.Columns.Add("Remark", typeof(string));
                    dtErrorCharge.Columns.Add("Message", typeof(string));

                    foreach (DataRow dr2 in drerrorCharge)
                    {
                        //dtFinal.Rows.Add(drOk);
                        dtErrorCharge.ImportRow(dr2);
                    }
                    DataSet dserrorCharge = new DataSet();
                    dserrorCharge.Tables.Add(dtErrorCharge);
                    if (dtErrorCharge.Rows.Count > 0)
                    {
                        Session["BlankRate"] = dserrorCharge.Tables[0];
                        if (Session["BlankRate"] != null)
                        {
                            ViewBag.BlankTrue = true;
                        }
                    }
                    //ConvertDSToExcel_Duplicate(dserror, 1);


                    //DataSet dsFinal = new DataSet();
                    //dsFinal.Tables.Add(dtFinal);

                    dtFinalCharges.Columns.Remove("Message");
                    //dtFinalCharges.Columns.Remove("SNo");

                    Excel_DS.Reset();

                    errorMessage = "";
                    Excel_DS.Tables.Add(dtFinalCharges);
                    //Excel_Slab.Reset();
                    //if (OtherChargeType == "OTHERCHARGES")
                    //{
                    //    Excel_DS.Tables.Add(dtSlab);
                    //}
                    if (OtherChargeType == "OTHERCHARGES")
                    {
                        ProcedureName = "OtherCharges_ExcelUpload_WithSlab";
                    }
                    else
                    {
                        ProcedureName = "OtherCharges_ExcelUpload_FlatCharges";
                    }
                }
                // added by tarun kumar singh
                else if (Text_PageSNo.Trim().ToUpper() == "RATE")
                {
                    int count = 0;
                    //Converting Excel file data into DataSet
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();

                    // added by Priti Yadav : TFS ID: 14818
                    if (UploadActive == "InactiveRate")
                    {

                        DataColumnCollection columns = Excel_DS.Tables[0].Columns;
                        string InactiveRateCodeColumn = "Reference No";
                        if (columns.Contains(InactiveRateCodeColumn))
                        {

                        }
                        else
                        {
                            ViewBag.Error = "Please Select Right Excel File";
                            return View();
                        }

                        DataTable table2 = new DataTable();
                        table2.Columns.Add("SNo");
                        table2.Columns.Add("Reference No", typeof(string));
                        table2.Columns.Add("Message", typeof(string));
                        DataRow dr = table2.NewRow();
                        count = Excel_DS.Tables[0].Rows.Count;
                        for (int i = 0; i < count; i++)
                        {
                            string errorMessage = string.Empty;
                            dr = table2.NewRow();
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Reference No"])))
                            {
                                dr["Reference No"] = Excel_DS.Tables[0].Rows[i]["Reference No"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + "Reference No must not be empty";
                            }
                            dr["Message"] = errorMessage;
                            dr["SNo"] = i + 1;
                            table2.Rows.Add(dr);
                        }

                        DataRow[] drOk = table2.Select("Message = ''");
                        DataTable dtFinal = new DataTable();
                        dtFinal.TableName = "InputData";
                        dtFinal.Columns.Add("SNo");
                        dtFinal.Columns.Add("Reference No", typeof(string));
                        dtFinal.Columns.Add("Message", typeof(string));
                        foreach (DataRow dr1 in drOk)
                        {
                            dtFinal.ImportRow(dr1);
                        }

                        DataRow[] drerror = table2.Select("Message <> ''");
                        DataTable dtError = new DataTable();
                        dtError.Columns.Add("SNo");
                        dtError.Columns.Add("Reference No", typeof(string));
                        dtError.Columns.Add("Message", typeof(string));

                        foreach (DataRow dr2 in drerror)
                        {
                            dtError.ImportRow(dr2);
                        }
                        DataSet dserror = new DataSet();
                        dserror.Tables.Add(dtError);
                        if (dtError.Rows.Count > 0)
                        {
                            Session["BlankRate"] = dserror.Tables[0];
                            if (Session["BlankRate"] != null)
                            {
                                ViewBag.BlankTrue = true;
                            }
                        }

                        dtFinal.Columns.Remove("Message");
                        dtFinal.Columns.Remove("SNo");
                        Excel_DS.Reset();
                        Excel_DS.Tables.Add(dtFinal);

                        ProcedureName = "Rate_InActiveRateExcelUpload";
                    }
                    else
                    {
                        if (RateType == "MailRating")
                        {
                            DataColumnCollection columns = Excel_DS.Tables[0].Columns;
                            string MailRatingCodeColumn = "MailRatingCode";
                            if (columns.Contains(MailRatingCodeColumn))
                            {

                            }
                            else
                            {
                                //string msg = "bmbjm";
                                ViewBag.Error = "Please Select Right Excel File";
                                return View();
                            }

                        }
                        if (RateType == "AllotmentRate")
                        {
                            DataColumnCollection columns = Excel_DS.Tables[0].Columns;
                            string AllotmentCodeColumn = "AllotmentCode";
                            if (columns.Contains(AllotmentCodeColumn))
                            {

                            }
                            else
                            {
                                ViewBag.Error = "Please Select Right Excel File";
                                return View();
                            }

                        }
                        if (RateType == "PublishRate")
                        {
                            DataColumnCollection columns = Excel_DS.Tables[0].Columns;
                            string AllotmentCodeColumn = "AllotmentCode";
                            string MailRatingCodeColumn = "MailRatingCode";
                            string AgentNameColumn = "AgentName";
                            if (!columns.Contains(AllotmentCodeColumn))
                            {
                                if (!columns.Contains(MailRatingCodeColumn))
                                {
                                    if (!columns.Contains(AgentNameColumn))
                                    {
                                        // string AgentName = Excel_DS.Tables[0].Rows[0]["AgentName"].ToString();
                                    }
                                    else
                                    {
                                        ViewBag.Error = "Please Select Right Excel File";
                                        return View();
                                    }
                                }
                                else
                                {
                                    ViewBag.Error = "Please Select Right Excel File";
                                    return View();
                                }
                            }
                            else
                            {
                                ViewBag.Error = "Please Select Right Excel File";
                                return View();
                            }
                        }


                        if (RateType == "AgentSpecificRate")
                        {
                            DataColumnCollection columns = Excel_DS.Tables[0].Columns;
                            string AgentNameColumn = "AgentName";
                            if (columns.Contains(AgentNameColumn))
                            {

                            }
                            else
                            {
                                ViewBag.Error = "Please Select Right Excel File";
                                return View();
                            }
                        }

                        DataTable table2 = new DataTable();
                        table2.Columns.Add("SNo");
                        table2.Columns.Add("RateCardName", typeof(string));
                        table2.Columns.Add("MailRatingCode", typeof(string));
                        table2.Columns.Add("AirlineName", typeof(string));
                        table2.Columns.Add("OfficeName", typeof(string));
                        table2.Columns.Add("OriginLevel", typeof(string));
                        table2.Columns.Add("Origin", typeof(string));
                        table2.Columns.Add("DestinationLevel", typeof(string));
                        table2.Columns.Add("Destination", typeof(string));
                        table2.Columns.Add("Status", typeof(string));
                        table2.Columns.Add("RateTypeName", typeof(string));
                        table2.Columns.Add("AllotmentCode", typeof(string));
                        table2.Columns.Add("ValidFrom", typeof(string));
                        table2.Columns.Add("ValidTo", typeof(string));
                        table2.Columns.Add("RateBasedOn", typeof(string));
                        table2.Columns.Add("Currency", typeof(string));
                        table2.Columns.Add("WeightType", typeof(string));
                        table2.Columns.Add("FlightTypeName", typeof(string));
                        table2.Columns.Add("RateReferenceNumber", typeof(string));
                        table2.Columns.Add("IsNextSlab", typeof(string));
                        table2.Columns.Add("IsCommissionable", typeof(string));
                        table2.Columns.Add("Minimum", typeof(decimal));
                        table2.Columns.Add("Normal", typeof(decimal));
                        table2.Columns.Add("Plus30", typeof(decimal));
                        table2.Columns.Add("Plus45", typeof(decimal));
                        table2.Columns.Add("Plus50", typeof(decimal));
                        table2.Columns.Add("Plus150", typeof(decimal));
                        table2.Columns.Add("Plus200", typeof(decimal));
                        table2.Columns.Add("Plus250", typeof(decimal));
                        table2.Columns.Add("Plus500", typeof(decimal));
                        table2.Columns.Add("Plus1000", typeof(decimal));
                        table2.Columns.Add("Plus100", typeof(decimal));
                        table2.Columns.Add("Plus300", typeof(decimal));
                        table2.Columns.Add("Plus1500", typeof(decimal));
                        table2.Columns.Add("Plus2000", typeof(decimal));
                        table2.Columns.Add("Plus3000", typeof(decimal));
                        table2.Columns.Add("ULDType", typeof(string));
                        table2.Columns.Add("PivotWeight", typeof(decimal));
                        table2.Columns.Add("PivoteRate", typeof(decimal));
                        table2.Columns.Add("OverPivoteRAte", typeof(decimal));
                        table2.Columns.Add("IssueCarrier", typeof(string));
                        table2.Columns.Add("IncludeIssueCarrier", typeof(string));
                        table2.Columns.Add("FlightNumber", typeof(string));
                        table2.Columns.Add("IncludeFlightNumber", typeof(string));
                        table2.Columns.Add("DayofWeek", typeof(string));
                        table2.Columns.Add("IncludeDayofWeek", typeof(string));
                        table2.Columns.Add("StartTime", typeof(string));
                        table2.Columns.Add("EndTime", typeof(string));
                        table2.Columns.Add("IncludeSET", typeof(string));
                        table2.Columns.Add("TransitStation", typeof(string));
                        table2.Columns.Add("IncludeTransitStation", typeof(string));
                        table2.Columns.Add("CommodityCode", typeof(string));
                        table2.Columns.Add("IncludeCommodityCode", typeof(string));
                        table2.Columns.Add("AgentGroup", typeof(string));
                        table2.Columns.Add("IncludeAgentGroup", typeof(string));
                        table2.Columns.Add("ProductType", typeof(string));
                        table2.Columns.Add("IncludeProductType", typeof(string));
                        table2.Columns.Add("AgentName", typeof(string));
                        table2.Columns.Add("IncludeAgentName", typeof(string));
                        table2.Columns.Add("SpecialHandlingCode", typeof(string));
                        table2.Columns.Add("IncludeSpecialHandlingCode", typeof(string));
                        table2.Columns.Add("ShipperName", typeof(string));
                        table2.Columns.Add("IncludeShipperName", typeof(string));
                        table2.Columns.Add("SpecialHandlingGroup", typeof(string));
                        table2.Columns.Add("IncludeSpecialHandlingGroup", typeof(string));
                        table2.Columns.Add("Remark", typeof(string));
                        table2.Columns.Add("Message", typeof(string));
                        table2.Columns.Add("Reference No", typeof(string));
                        // table2.Columns.Add("Reference No", typeof(string));
                        DataRow dr = table2.NewRow();

                        count = Excel_DS.Tables[0].Rows.Count;
                        for (int i = 0; i < count; i++)
                        {
                            string errorMessage = string.Empty;
                            dr = table2.NewRow();
                            dr["SNo"] = i + 1;
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["RateCardName"])))
                            {
                                if (RateType == "MailRating")
                                {
                                    string RateCardName = Convert.ToString(Excel_DS.Tables[0].Rows[i]["RateCardName"]).Trim();
                                    if (RateCardName == "MAIL")
                                    {
                                        dr["RateCardName"] = Excel_DS.Tables[0].Rows[i]["RateCardName"].ToString().Trim();
                                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["MailRatingCode"])))
                                        {

                                            if (Excel_DS.Tables[0].Rows[i]["MailRatingCode"].ToString() == "CN38")
                                            {
                                                dr["MailRatingCode"] = Excel_DS.Tables[0].Rows[i]["MailRatingCode"].ToString().Trim();
                                            }
                                            else if (Excel_DS.Tables[0].Rows[i]["MailRatingCode"].ToString() == "CN47")
                                            {
                                                dr["MailRatingCode"] = Excel_DS.Tables[0].Rows[i]["MailRatingCode"].ToString().Trim();
                                            }
                                            else
                                            {
                                                dr["MailRatingCode"] = Excel_DS.Tables[0].Rows[i]["MailRatingCode"].ToString().Trim();
                                                errorMessage = errorMessage + "MailRating Code should be CN38 OR CN47";
                                            }
                                        }
                                        else
                                        {
                                            errorMessage = errorMessage + "MailRating Code must not be empty";
                                        }
                                    }
                                    else
                                    {
                                        errorMessage = errorMessage + "RateCardName should be MAIL";
                                    }
                                }
                                else
                                {
                                    dr["RateCardName"] = Excel_DS.Tables[0].Rows[i]["RateCardName"].ToString().Trim();
                                }
                            }
                            else
                            {
                                errorMessage = errorMessage + "Rate card must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["AirlineName"])))
                            {
                                dr["AirlineName"] = Excel_DS.Tables[0].Rows[i]["AirlineName"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + "Airline Name must not be empty";
                            }

                            //if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OfficeName"])))
                            //{
                            dr["OfficeName"] = Excel_DS.Tables[0].Rows[i]["OfficeName"].ToString().Trim();
                            //}
                            //else
                            //{
                            //    errorMessage = errorMessage + "Office Name must not be empty";
                            //}
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OriginLevel"])))
                            {
                                dr["OriginLevel"] = Excel_DS.Tables[0].Rows[i]["OriginLevel"].ToString().Trim();
                                if (dr["OriginLevel"].ToString().ToUpper() != "CITY" && dr["OriginLevel"].ToString().ToUpper() != "COUNTRY" && dr["OriginLevel"].ToString().ToUpper() != "REGION" && dr["OriginLevel"].ToString().ToUpper() != "ZONE" && dr["OriginLevel"].ToString().ToUpper() != "AIRPORT")
                                {
                                    errorMessage = errorMessage + ", Origin Level must be either City,Country,Airport,Region or Zone";
                                }
                            }
                            else
                            {
                                errorMessage = errorMessage + ", Origin Level must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Origin"])))
                            {
                                dr["Origin"] = Excel_DS.Tables[0].Rows[i]["Origin"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + "Origin must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["DestinationLevel"])))
                            {
                                dr["DestinationLevel"] = Excel_DS.Tables[0].Rows[i]["DestinationLevel"].ToString().Trim();
                                if (dr["DestinationLevel"].ToString().ToUpper() != "CITY" && dr["DestinationLevel"].ToString().ToUpper() != "COUNTRY" && dr["DestinationLevel"].ToString().ToUpper() != "REGION" && dr["DestinationLevel"].ToString().ToUpper() != "ZONE" && dr["DestinationLevel"].ToString().ToUpper() != "AIRPORT")
                                {
                                    errorMessage = errorMessage + ", Destination Level must be either City,Country,Airport,Region or Zone";
                                }
                            }
                            else
                            {
                                errorMessage = errorMessage + ", Destination Level must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Destination"])))
                            {
                                dr["Destination"] = Excel_DS.Tables[0].Rows[i]["Destination"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + ", Destination must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Status"])))
                            {
                                dr["Status"] = Excel_DS.Tables[0].Rows[i]["Status"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + ", Status must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["RateTypeName"])))
                            {
                                if (RateType == "MailRating")
                                {
                                    string RateTypeName = Excel_DS.Tables[0].Rows[i]["RateTypeName"].ToString().Trim();
                                    if (RateTypeName == "MAIL RATE")
                                    {
                                        dr["RateTypeName"] = Excel_DS.Tables[0].Rows[i]["RateTypeName"].ToString().Trim();
                                    }
                                    else
                                    {
                                        errorMessage = errorMessage + ", RateType Name should be MAIL RATE";
                                    }
                                }
                                else if (RateType == "AllotmentRate")
                                {
                                    string RateTypeName = Excel_DS.Tables[0].Rows[i]["RateTypeName"].ToString().Trim();
                                    if (RateTypeName == "ALLOTMENT RATE")
                                    {
                                        dr["RateTypeName"] = Excel_DS.Tables[0].Rows[i]["RateTypeName"].ToString().Trim();
                                        if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["AllotmentCode"])))
                                        {
                                            dr["AllotmentCode"] = Excel_DS.Tables[0].Rows[i]["AllotmentCode"].ToString().Trim();
                                        }
                                        else
                                        {
                                            errorMessage = errorMessage + ", AllotmentCode must not be empty.";
                                        }

                                    }
                                    else
                                    {
                                        errorMessage = errorMessage + ", RateType Name should be ALLOTMENT RATE";
                                    }

                                }
                                else
                                {
                                    dr["RateTypeName"] = Excel_DS.Tables[0].Rows[i]["RateTypeName"].ToString().Trim();
                                }


                            }
                            else
                            {
                                errorMessage = errorMessage + ", RateType Name must not be empty";
                            }
                            int dateresult = 0;
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ValidFrom"])))
                            {
                                ////var dateTime = Convert.ToString(Excel_DS.Tables[0].Rows[i]["ValidFrom"]);
                                ////DateTime dt = DateTime.ParseExact(dateTime, "dd-MM-yyyy hh:mm:ss", CultureInfo.InvariantCulture);
                                ////var convertedDate = dt.ToString("dd/MM/yyyy");

                                ////var dateTimeToday = DateTime.Now.ToString();
                                ////DateTime dtToaday = DateTime.ParseExact(dateTimeToday, "dd-MM-yyyy hh:mm:ss", CultureInfo.InvariantCulture);
                                ////var convertedDateToday = dtToaday.ToString("dd/MM/yyyy");
                                //string date = DateTime.Now.ToString("dd/MM/yyyy");
                                //DateTime datetime = Convert.ToDateTime(DateTime.Now.ToString("dd/MM/yyyy"));

                                // DateTime electionPosDate = Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]);


                                //------------------ for part time only-------------------------------------------
                                //if (Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]) >= Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy")))
                                //{
                                //    dr["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                //}
                                //else
                                //{
                                try
                                {

                                    string ValidDate = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                    string[] ArrayValidDate = ValidDate.Split('/');
                                    if (int.TryParse(ArrayValidDate[0].ToString().Trim(), out dateresult))
                                    {
                                        if (Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]) >= Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy")) || Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]) <= Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy")))
                                        {
                                            dr["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                        }
                                    }
                                    else
                                    {
                                        dr["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                        errorMessage = errorMessage + "ValidFrom Date Format should be MM/DD/YYYY";
                                    }
                                }
                                catch (Exception ex)
                                {
                                    int j = i + 1;
                                    ViewBag.Error = "File not Uploaded...Some Data Problem in ValidFrom Date at Row No. " + j;
                                    ModelState.AddModelError("Error", "Error Occurred!!");
                                    return View();
                                }
                                //    errorMessage = errorMessage + "ValidFrom Date must not be less than ValidTo Date";
                                //}

                            }
                            else
                            {
                                errorMessage = errorMessage + ", ValidFrom Date must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ValidTo"])))
                            {
                                try
                                {
                                    if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ValidFrom"])))
                                    {
                                        string ValidDate = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                        string[] ArrayValidDate = ValidDate.Split('/');
                                        if (int.TryParse(ArrayValidDate[0].ToString().Trim(), out dateresult))
                                        {

                                            if (Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidTo"]) >= Convert.ToDateTime(DateTime.Now.ToString("MM/dd/yyyy")))
                                            {

                                                if (Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidTo"]) >= Convert.ToDateTime(Excel_DS.Tables[0].Rows[i]["ValidFrom"]))
                                                {
                                                    dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                                }
                                                else
                                                {
                                                    dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                                    errorMessage = errorMessage + ", ValidTo Date must be greater than ValidFrom Date";
                                                }
                                            }
                                            else
                                            {
                                                dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                                errorMessage = errorMessage + ", ValidTo Date can not be less than Todaydate";
                                            }
                                            // dr["ValidFrom"] = Excel_DS.Tables[0].Rows[i]["ValidFrom"].ToString().Trim();
                                        }
                                        else
                                        {
                                            dr["ValidTo"] = Excel_DS.Tables[0].Rows[i]["ValidTo"].ToString().Trim();
                                            errorMessage = errorMessage + ", ValidTo Date Format should be MM/DD/YYYY";
                                        }
                                    }
                                }
                                catch (Exception ex)
                                {
                                    int j = i + 1;
                                    ViewBag.Error = "File not Uploaded...Some Data Problem in ValidTo Date at Row No. " + j;
                                    ModelState.AddModelError("Error", "Error Occurred!!");
                                    return View();
                                }

                            }
                            else
                            {
                                errorMessage = errorMessage + ", ValidTo Date Name must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["RateBasedOn"])))
                            {
                                dr["RateBasedOn"] = Excel_DS.Tables[0].Rows[i]["RateBasedOn"].ToString().Trim();

                            }
                            else
                            {
                                errorMessage = errorMessage + ", RateBasedOn Name must not be empty";
                            }

                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Currency"])))
                            {
                                dr["Currency"] = Excel_DS.Tables[0].Rows[i]["Currency"].ToString().Trim();
                            }
                            else
                            {
                                errorMessage = errorMessage + ", Currency must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["WeightType"])))
                            {
                                dr["WeightType"] = Excel_DS.Tables[0].Rows[i]["WeightType"].ToString().Trim();
                                if (Excel_DS.Tables[0].Rows[i]["WeightType"].ToString() != "KG" && Excel_DS.Tables[0].Rows[i]["WeightType"].ToString() != "LBS")
                                {
                                    errorMessage = errorMessage + ", WeightType must be KG,LBS";
                                }
                            }
                            else
                            {
                                errorMessage = errorMessage + ", WeightType must not be empty";
                            }



                            dr["FlightTypeName"] = Excel_DS.Tables[0].Rows[i]["FlightTypeName"].ToString().Trim();
                            dr["RateReferenceNumber"] = Excel_DS.Tables[0].Rows[i]["RateReferenceNumber"].ToString().Trim();
                            dr["IsNextSlab"] = Excel_DS.Tables[0].Rows[i]["IsNextSlab"].ToString().Trim();
                            dr["IsCommissionable"] = Excel_DS.Tables[0].Rows[i]["IsCommissionable"].ToString().Trim();
                            decimal result = 0;
                            decimal checkSlab = 0;
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Minimum"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Minimum"]), out result))
                                {
                                    dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    checkSlab = Convert.ToDecimal(dr["Minimum"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    // dr["Minimum"] = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Minimum must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Minimum"] = 0;
                                // errorMessage = errorMessage + "Minimum must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Normal"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Normal"]), out result))
                                {
                                    dr["Normal"] = Excel_DS.Tables[0].Rows[i]["Normal"].ToString().Trim();
                                    checkSlab = Convert.ToDecimal(dr["Normal"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Normal"].ToString().Trim();
                                    //dr["Normal"] = Excel_DS.Tables[0].Rows[i]["Normal"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Normal must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Normal"] = 0;
                                // errorMessage = errorMessage + "Normal must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus30"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus30"]), out result))
                                {
                                    dr["Plus30"] = Excel_DS.Tables[0].Rows[i]["Plus30"].ToString().Trim();
                                    //if (Convert.ToDecimal(dr["Plus45"]) > Convert.ToDecimal(dr["Normal"]) || Convert.ToDecimal(dr["Plus45"]) > Convert.ToDecimal(dr["Minimum"]))
                                    //{
                                    //    errorMessage = errorMessage + ", Slab Plus45 cannot be greater than previous rate";
                                    //}
                                    if (Convert.ToDecimal(dr["Plus30"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus30 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus30"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus30"].ToString().Trim();
                                    // dr["Plus45"] = Excel_DS.Tables[0].Rows[i]["Plus45"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'Plus30 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus30"] = 0;
                                //errorMessage = errorMessage + "Plus45 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus45"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus45"]), out result))
                                {
                                    dr["Plus45"] = Excel_DS.Tables[0].Rows[i]["Plus45"].ToString().Trim();
                                    //if (Convert.ToDecimal(dr["Plus45"]) > Convert.ToDecimal(dr["Normal"]) || Convert.ToDecimal(dr["Plus45"]) > Convert.ToDecimal(dr["Minimum"]))
                                    //{
                                    //    errorMessage = errorMessage + ", Slab Plus45 cannot be greater than previous rate";
                                    //}
                                    if (Convert.ToDecimal(dr["Plus45"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus45 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus45"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus45"].ToString().Trim();
                                    // dr["Plus45"] = Excel_DS.Tables[0].Rows[i]["Plus45"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'Plus45 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus45"] = 0;
                                //errorMessage = errorMessage + "Plus45 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus50"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus50"]), out result))
                                {
                                    dr["Plus50"] = Excel_DS.Tables[0].Rows[i]["Plus50"].ToString().Trim();
                                    //if (Convert.ToDecimal(dr["Plus45"]) > Convert.ToDecimal(dr["Normal"]) || Convert.ToDecimal(dr["Plus45"]) > Convert.ToDecimal(dr["Minimum"]))
                                    //{
                                    //    errorMessage = errorMessage + ", Slab Plus45 cannot be greater than previous rate";
                                    //}
                                    if (Convert.ToDecimal(dr["Plus50"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus50 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus50"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus50"].ToString().Trim();
                                    // dr["Plus45"] = Excel_DS.Tables[0].Rows[i]["Plus45"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'Plus50 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus50"] = 0;
                                //errorMessage = errorMessage + "Plus45 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus100"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus100"]), out result))
                                {
                                    dr["Plus100"] = Excel_DS.Tables[0].Rows[i]["Plus100"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus100"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus100 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus100"]);
                                    //if (dr["Plus45"].ToString() != "0")
                                    //{
                                    //    if (Convert.ToDecimal(dr["Plus100"]) > Convert.ToDecimal(dr["Plus45"]))
                                    //    {
                                    //        errorMessage = errorMessage + ", Slab Plus100 cannot be greater than previous rate";
                                    //    }
                                    //}
                                    //else
                                    //{
                                    //    if (Convert.ToDecimal(dr["Plus100"]) > Convert.ToDecimal(dr["Normal"]) || Convert.ToDecimal(dr["Plus100"]) > Convert.ToDecimal(dr["Minimum"]))
                                    //    {
                                    //        errorMessage = errorMessage + ", Slab Plus100 cannot be greater than previous rate";
                                    //    }
                                    //}
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus45"].ToString().Trim();
                                    //dr["Plus100"] = Excel_DS.Tables[0].Rows[i]["Plus100"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Plus100 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus100"] = 0;
                                //errorMessage = errorMessage + "Plus100 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus150"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus150"]), out result))
                                {
                                    dr["Plus150"] = Excel_DS.Tables[0].Rows[i]["Plus150"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus150"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus150 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus150"]);
                                    //if (dr["Plus100"].ToString() != "0")
                                    //{
                                    //    if (Convert.ToDecimal(dr["Plus150"]) > Convert.ToDecimal(dr["Plus100"]))
                                    //    {
                                    //        errorMessage = errorMessage + ", Slab Plus150 cannot be greater than previous rate";
                                    //    }
                                    //}
                                    //else
                                    //{
                                    //    if (dr["Plus45"].ToString() != "0")
                                    //    {
                                    //        if (Convert.ToDecimal(dr["Plus150"]) > Convert.ToDecimal(dr["Plus45"]))
                                    //        {
                                    //            errorMessage = errorMessage + ", Slab Plus150 cannot be greater than previous rate";
                                    //        }
                                    //    }
                                    //    else
                                    //    {
                                    //        if (Convert.ToDecimal(dr["Plus150"]) > Convert.ToDecimal(dr["Normal"]) || Convert.ToDecimal(dr["Plus150"]) > Convert.ToDecimal(dr["Minimum"]))
                                    //        {
                                    //            errorMessage = errorMessage + ", Slab Plus150 cannot be greater than previous rate";
                                    //        }
                                    //    }
                                    //}
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus150"].ToString().Trim();
                                    // dr["Plus150"] = Excel_DS.Tables[0].Rows[i]["Plus150"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Plus150 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus150"] = 0;
                                //errorMessage = errorMessage + "Plus150 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus200"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus200"]), out result))
                                {
                                    dr["Plus200"] = Excel_DS.Tables[0].Rows[i]["Plus200"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus200"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus200 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus200"]);


                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus200"].ToString().Trim();
                                    // dr["Plus250"] = Excel_DS.Tables[0].Rows[i]["Plus250"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'  Plus200 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus200"] = 0;
                                //errorMessage = errorMessage + "Plus250 must not be empty";
                            }


                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus250"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus250"]), out result))
                                {
                                    dr["Plus250"] = Excel_DS.Tables[0].Rows[i]["Plus250"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus250"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus250 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus250"]);


                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus250"].ToString().Trim();
                                    // dr["Plus250"] = Excel_DS.Tables[0].Rows[i]["Plus250"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'  Plus250 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus250"] = 0;
                                //errorMessage = errorMessage + "Plus250 must not be empty";
                            }

                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus300"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus300"]), out result))
                                {
                                    dr["Plus300"] = Excel_DS.Tables[0].Rows[i]["Plus300"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus300"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus300 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus300"]);
                                    //if (Convert.ToDecimal(dr["Plus300"]) > Convert.ToDecimal(dr["Plus250"]))
                                    //{
                                    //    errorMessage = errorMessage + ", Slab Plus300 cannot be greater than previous rate";
                                    //}
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus300"].ToString().Trim();
                                    // dr["Plus300"] = Excel_DS.Tables[0].Rows[i]["Plus300"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'  Plus300 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus300"] = 0;
                                //errorMessage = errorMessage + "Plus300 must not be empty";
                            }

                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus500"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus500"]), out result))
                                {
                                    dr["Plus500"] = Excel_DS.Tables[0].Rows[i]["Plus500"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus500"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus500 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus500"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus500"].ToString().Trim();

                                    //dr["Plus500"] = Excel_DS.Tables[0].Rows[i]["Plus500"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Plus500 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus500"] = 0;
                                // errorMessage = errorMessage + "Plus500 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus1000"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus1000"]), out result))
                                {
                                    dr["Plus1000"] = Excel_DS.Tables[0].Rows[i]["Plus1000"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus1000"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus1000 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus1000"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus1000"].ToString().Trim();
                                    //dr["Plus1000"] = Excel_DS.Tables[0].Rows[i]["Plus1000"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'Plus1000 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus1000"] = 0;
                                //errorMessage = errorMessage + "Plus1000 must not be empty";
                            }


                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus1500"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus1500"]), out result))
                                {
                                    dr["Plus1500"] = Excel_DS.Tables[0].Rows[i]["Plus1500"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus1500"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus1500 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus1500"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus1500"].ToString().Trim();
                                    // dr["Plus1500"] = Excel_DS.Tables[0].Rows[i]["Plus1500"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Plus1500 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus1500"] = 0;
                                //errorMessage = errorMessage + "Plus2000 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus2000"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus2000"]), out result))
                                {
                                    dr["Plus2000"] = Excel_DS.Tables[0].Rows[i]["Plus2000"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus2000"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus2000 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus2000"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus2000"].ToString().Trim();
                                    //dr["Plus2000"] = Excel_DS.Tables[0].Rows[i]["Plus2000"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "' Plus2000 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus2000"] = 0;
                                //errorMessage = errorMessage + "Plus2000 must not be empty";
                            }
                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus3000"])))
                            {
                                if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["Plus3000"]), out result))
                                {
                                    dr["Plus3000"] = Excel_DS.Tables[0].Rows[i]["Plus3000"].ToString().Trim();
                                    if (Convert.ToDecimal(dr["Plus3000"]) > checkSlab && checkSlab != 0)
                                    {
                                        errorMessage = errorMessage + ", Slab Plus3000 cannot be greater than previous rate";
                                    }
                                    checkSlab = Convert.ToDecimal(dr["Plus3000"]);
                                }
                                else
                                {
                                    string str = Excel_DS.Tables[0].Rows[i]["Plus3000"].ToString().Trim();
                                    // dr["Plus3000"] = Excel_DS.Tables[0].Rows[i]["Plus3000"].ToString().Trim();
                                    errorMessage = errorMessage + ", '" + str + "'  Plus3000 must be decimal value";
                                }
                            }
                            else
                            {
                                dr["Plus3000"] = 0;
                                //errorMessage = errorMessage + "Plus3000 must not be empty";
                            }
                            if (dr["Minimum"].ToString() == "0" && dr["Normal"].ToString() == "0" && dr["Plus30"].ToString() == "0" && dr["Plus45"].ToString() == "0" && dr["Plus50"].ToString() == "0" && dr["Plus150"].ToString() == "0" && dr["Plus250"].ToString() == "0" && dr["Plus500"].ToString() == "0" && dr["Plus1000"].ToString() == "0" && dr["Plus100"].ToString() == "0" && dr["Plus200"].ToString() == "0" && dr["Plus300"].ToString() == "0" && dr["Plus1500"].ToString() == "0" && dr["Plus2000"].ToString() == "0" && dr["Plus3000"].ToString() == "0")
                            {
                                if (String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ULDType"])))
                                {
                                    errorMessage = errorMessage + ", At least one slab value required OR ULD Rate is required";
                                }
                            }

                            if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ULDType"])))
                            {
                                dr["ULDType"] = Excel_DS.Tables[0].Rows[i]["ULDType"].ToString().Trim();
                                if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotWeight"])))
                                {
                                    if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotWeight"]), out result))
                                    {
                                        if (Excel_DS.Tables[0].Rows[i]["PivotWeight"].ToString() != "0")
                                        {
                                            dr["PivotWeight"] = Excel_DS.Tables[0].Rows[i]["PivotWeight"].ToString().Trim();
                                        }
                                        else
                                        {
                                            dr["PivotWeight"] = Excel_DS.Tables[0].Rows[i]["PivotWeight"].ToString().Trim();
                                            errorMessage = errorMessage + ", Pivot Weight can not be 0";
                                        }
                                    }
                                    else
                                    {
                                        dr["PivotWeight"] = Excel_DS.Tables[0].Rows[i]["PivotWeight"].ToString().Trim();
                                        errorMessage = errorMessage + ", Pivot Weight must be integer value";
                                    }
                                }
                                else
                                {
                                    errorMessage = errorMessage + ", Pivot Weight must not be empty";
                                }
                                if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotRate"])))
                                {
                                    if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotRate"]), out result))
                                    {
                                        if (Excel_DS.Tables[0].Rows[i]["PivotRate"].ToString() != "0")
                                        {
                                            dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivotRate"].ToString().Trim();
                                        }
                                        else
                                        {
                                            dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivotRate"].ToString().Trim();
                                            errorMessage = errorMessage + ", Pivot Rate can not be 0";
                                        }
                                    }
                                    else
                                    {
                                        dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivotRate"].ToString().Trim();
                                        errorMessage = errorMessage + ", Pivot Rate must be integer value";
                                    }
                                }
                                else
                                {
                                    errorMessage = errorMessage + "Pivot Rate must not be empty";
                                }
                                if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OverPivotRAte"])))
                                {
                                    if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OverPivotRAte"]), out result))
                                    {
                                        if (Excel_DS.Tables[0].Rows[i]["OverPivotRAte"].ToString().Trim() != "0")
                                        {
                                            dr["OverPivoteRAte"] = Excel_DS.Tables[0].Rows[i]["OverPivotRAte"].ToString().Trim();
                                        }
                                        else
                                        {
                                            dr["OverPivoteRAte"] = Excel_DS.Tables[0].Rows[i]["OverPivotRAte"].ToString().Trim();
                                            errorMessage = errorMessage + ", OverPivot Rate Rate can not be 0";
                                        }
                                    }
                                    else
                                    {
                                        dr["OverPivoteRAte"] = Excel_DS.Tables[0].Rows[i]["OverPivotRAte"].ToString().Trim();
                                        errorMessage = errorMessage + ", OverPivot Rate must be integer value";
                                    }
                                }
                                else
                                {
                                    errorMessage = errorMessage + ", OverPivot Rate must not be empty";
                                }
                            }
                            else
                            {
                                dr["ULDType"] = Excel_DS.Tables[0].Rows[i]["ULDType"].ToString().Trim();
                                if (String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["ULDType"])))
                                {
                                    if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotWeight"])))
                                    {
                                        if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotWeight"]), out result))
                                        {
                                            if (Excel_DS.Tables[0].Rows[i]["PivotWeight"].ToString() == "0")
                                            {
                                                dr["PivotWeight"] = Excel_DS.Tables[0].Rows[i]["PivotWeight"].ToString().Trim();
                                            }
                                            else
                                            {
                                                dr["PivotWeight"] = Excel_DS.Tables[0].Rows[i]["PivotWeight"].ToString().Trim();
                                                errorMessage = errorMessage + ", Pivot Weight can not provide without ULD Type";
                                            }
                                        }
                                        else
                                        {
                                            errorMessage = errorMessage + ", Pivot Weight can not provide without ULD Type or Invalid Value";

                                        }
                                    }
                                    else
                                    {
                                        //  dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivoteRate"].ToString();
                                    }
                                    if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotRate"])))
                                    {
                                        if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["PivotRate"]), out result))
                                        {
                                            if (Excel_DS.Tables[0].Rows[i]["PivotRate"].ToString() == "0")
                                            {
                                                dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivotRate"].ToString().Trim();
                                            }
                                            else
                                            {
                                                dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivotRate"].ToString().Trim();
                                                errorMessage = errorMessage + ", Pivot Rate can not provide without ULD Type";
                                            }
                                        }
                                        else
                                        {
                                            errorMessage = errorMessage + "Pivot Rate can not provide without ULD Type or Invalid Value";
                                            //dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivoteRate"].ToString();
                                            //errorMessage = errorMessage + "Pivote Rate must be integer value";
                                        }
                                    }
                                    else
                                    {
                                        //  dr["PivoteRate"] = Excel_DS.Tables[0].Rows[i]["PivoteRate"].ToString();
                                    }
                                    if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OverPivotRAte"])))
                                    {
                                        if (decimal.TryParse(Convert.ToString(Excel_DS.Tables[0].Rows[i]["OverPivotRAte"]), out result))
                                        {
                                            if (Excel_DS.Tables[0].Rows[i]["OverPivotRAte"].ToString() == "0")
                                            {
                                                dr["OverPivoteRAte"] = Excel_DS.Tables[0].Rows[i]["OverPivotRAte"].ToString().Trim();
                                            }
                                            else
                                            {
                                                dr["OverPivoteRAte"] = Excel_DS.Tables[0].Rows[i]["OverPivotRAte"].ToString().Trim();
                                                errorMessage = errorMessage + ", OverPivot Rate can not provide without ULD Type";
                                            }
                                        }
                                        else
                                        {
                                            //dr["OverPivoteRAte"] = Excel_DS.Tables[0].Rows[i]["PivoteRate"].ToString();
                                            //errorMessage = errorMessage + "Pivote Rate must be integer value";
                                            errorMessage = errorMessage + ", OverPivot Rate can not provide without ULD Type or Invalid Value";
                                        }
                                    }
                                    else
                                    {
                                        //dr["OverPivoteRAte"] = Excel_DS.Tables[0].Rows[i]["PivoteRate"].ToString();
                                    }

                                }
                            }
                            dr["IssueCarrier"] = Excel_DS.Tables[0].Rows[i]["IssueCarrier"].ToString().Trim();
                            dr["IncludeIssueCarrier"] = Excel_DS.Tables[0].Rows[i]["Include"].ToString().Trim();
                            dr["FlightNumber"] = Excel_DS.Tables[0].Rows[i]["FlightNumber"].ToString().Trim();
                            dr["IncludeFlightNumber"] = Excel_DS.Tables[0].Rows[i]["Include_1"].ToString().Trim();
                            dr["DayofWeek"] = Excel_DS.Tables[0].Rows[i]["DayofWeek"].ToString().Trim();
                            dr["IncludeDayofWeek"] = Excel_DS.Tables[0].Rows[i]["Include_2"].ToString().Trim();
                            dr["StartTime"] = Excel_DS.Tables[0].Rows[i]["StartTime"].ToString().Trim();
                            dr["EndTime"] = Excel_DS.Tables[0].Rows[i]["EndTime"].ToString().Trim();
                            dr["IncludeSET"] = Excel_DS.Tables[0].Rows[i]["Include_3"].ToString().Trim();
                            dr["TransitStation"] = Excel_DS.Tables[0].Rows[i]["TransitStation"].ToString().Trim();
                            dr["IncludeTransitStation"] = Excel_DS.Tables[0].Rows[i]["Include_4"].ToString().Trim();
                            dr["CommodityCode"] = Excel_DS.Tables[0].Rows[i]["CommodityCode"].ToString().Trim();
                            dr["IncludeCommodityCode"] = Excel_DS.Tables[0].Rows[i]["Include_5"].ToString().Trim();
                            dr["AgentGroup"] = Excel_DS.Tables[0].Rows[i]["AgentGroup"].ToString().Trim();
                            dr["IncludeAgentGroup"] = Excel_DS.Tables[0].Rows[i]["Include_6"].ToString().Trim();
                            dr["ProductType"] = Excel_DS.Tables[0].Rows[i]["ProductType"].ToString().Trim();
                            dr["IncludeProductType"] = Excel_DS.Tables[0].Rows[i]["Include_7"].ToString().Trim();
                            if (RateType == "AgentSpecificRate")
                            {
                                if (!String.IsNullOrWhiteSpace(Convert.ToString(Excel_DS.Tables[0].Rows[i]["AgentName"])))
                                {
                                    dr["AgentName"] = Excel_DS.Tables[0].Rows[i]["AgentName"].ToString().Trim();
                                    dr["IncludeAgentName"] = Excel_DS.Tables[0].Rows[i]["Include_8"].ToString();
                                }
                                else
                                {
                                    errorMessage = errorMessage + ", Agent Name  must not be empty";
                                }
                                dr["IncludeSpecialHandlingCode"] = Excel_DS.Tables[0].Rows[i]["Include_9"].ToString().Trim();
                                dr["IncludeShipperName"] = Excel_DS.Tables[0].Rows[i]["Include_10"].ToString().Trim();
                                dr["IncludeSpecialHandlingGroup"] = Excel_DS.Tables[0].Rows[i]["Include_11"].ToString().Trim();
                            }
                            else
                            {
                                dr["IncludeSpecialHandlingCode"] = Excel_DS.Tables[0].Rows[i]["Include_8"].ToString().Trim();
                                dr["IncludeShipperName"] = Excel_DS.Tables[0].Rows[i]["Include_9"].ToString().Trim();
                                dr["IncludeSpecialHandlingGroup"] = Excel_DS.Tables[0].Rows[i]["Include_10"].ToString().Trim();
                            }

                            dr["SpecialHandlingCode"] = Excel_DS.Tables[0].Rows[i]["SpecialHandlingCode"].ToString().Trim();
                            // dr["IncludeSpecialHandlingCode"] = Excel_DS.Tables[0].Rows[i]["Include_8"].ToString();
                            dr["ShipperName"] = Excel_DS.Tables[0].Rows[i]["ShipperName"].ToString().Trim();
                            dr["SpecialHandlingGroup"] = Excel_DS.Tables[0].Rows[i]["SpecialHandlingGroup"].ToString().Trim();
                            // dr["IncludeShipperName"] = Excel_DS.Tables[0].Rows[i]["Include_9"].ToString();
                            dr["Remark"] = Excel_DS.Tables[0].Rows[i]["Remark"].ToString().Trim();
                            dr["Message"] = errorMessage;

                            table2.Rows.Add(dr);
                            //string RateCardName = Excel_DS.Tables[0].Rows[i]["RateCardName"].ToString();
                            //string Minimum = Excel_DS.Tables[0].Rows[i]["Minimum"].ToString();
                            //int result = 0;
                            //string Msg = "";
                            //if (int.TryParse(Minimum, out result)) 
                            //{ 
                            //    // The string was a valid integer => use result here } else { // invalid integer 
                            //    Msg = "The string was a valid integer";
                            //}
                            //else
                            //{
                            //    Msg = "invalid integer ";
                            //}
                        }

                        DataRow[] drOk = table2.Select("Message = ''");
                        DataTable dtFinal = new DataTable();
                        dtFinal.TableName = "InputData";
                        dtFinal.Columns.Add("SNo");
                        dtFinal.Columns.Add("RateCardName", typeof(string));
                        if (RateType == "MailRating")
                        {
                            dtFinal.Columns.Add("MailRatingCode", typeof(string));
                        }
                        dtFinal.Columns.Add("AirlineName", typeof(string));
                        dtFinal.Columns.Add("OfficeName", typeof(string));
                        dtFinal.Columns.Add("OriginLevel", typeof(string));
                        dtFinal.Columns.Add("Origin", typeof(string));
                        dtFinal.Columns.Add("DestinationLevel", typeof(string));
                        dtFinal.Columns.Add("Destination", typeof(string));
                        dtFinal.Columns.Add("Status", typeof(string));
                        dtFinal.Columns.Add("RateTypeName", typeof(string));
                        if (RateType == "AllotmentRate")
                        {
                            dtFinal.Columns.Add("AllotmentCode", typeof(string));
                        }
                        dtFinal.Columns.Add("ValidFrom", typeof(string));
                        dtFinal.Columns.Add("ValidTo", typeof(string));
                        dtFinal.Columns.Add("RateBasedOn", typeof(string));
                        dtFinal.Columns.Add("Currency", typeof(string));
                        dtFinal.Columns.Add("WeightType", typeof(string));
                        dtFinal.Columns.Add("FlightTypeName", typeof(string));
                        dtFinal.Columns.Add("RateReferenceNumber", typeof(string));
                        dtFinal.Columns.Add("IsNextSlab", typeof(string));
                        dtFinal.Columns.Add("IsCommissionable", typeof(string));
                        dtFinal.Columns.Add("Minimum", typeof(decimal));
                        dtFinal.Columns.Add("Normal", typeof(decimal));
                        dtFinal.Columns.Add("Plus30", typeof(decimal));
                        dtFinal.Columns.Add("Plus45", typeof(decimal));
                        dtFinal.Columns.Add("Plus50", typeof(decimal));
                        dtFinal.Columns.Add("Plus150", typeof(decimal));
                        dtFinal.Columns.Add("Plus200", typeof(decimal));
                        dtFinal.Columns.Add("Plus250", typeof(decimal));
                        dtFinal.Columns.Add("Plus500", typeof(decimal));
                        dtFinal.Columns.Add("Plus1000", typeof(decimal));
                        dtFinal.Columns.Add("Plus100", typeof(decimal));
                        dtFinal.Columns.Add("Plus300", typeof(decimal));
                        dtFinal.Columns.Add("Plus1500", typeof(decimal));
                        dtFinal.Columns.Add("Plus2000", typeof(decimal));
                        dtFinal.Columns.Add("Plus3000", typeof(decimal));
                        dtFinal.Columns.Add("ULDType", typeof(string));
                        dtFinal.Columns.Add("PivotWeight", typeof(decimal));
                        dtFinal.Columns.Add("PivoteRate", typeof(decimal));
                        dtFinal.Columns.Add("OverPivoteRAte", typeof(decimal));
                        dtFinal.Columns.Add("IssueCarrier", typeof(string));
                        dtFinal.Columns.Add("IncludeIssueCarrier", typeof(string));
                        dtFinal.Columns.Add("FlightNumber", typeof(string));
                        dtFinal.Columns.Add("IncludeFlightNumber", typeof(string));
                        dtFinal.Columns.Add("DayofWeek", typeof(string));
                        dtFinal.Columns.Add("IncludeDayofWeek", typeof(string));
                        dtFinal.Columns.Add("StartTime", typeof(string));
                        dtFinal.Columns.Add("EndTime", typeof(string));
                        dtFinal.Columns.Add("IncludeSET", typeof(string));
                        dtFinal.Columns.Add("TransitStation", typeof(string));
                        dtFinal.Columns.Add("IncludeTransitStation", typeof(string));
                        dtFinal.Columns.Add("CommodityCode", typeof(string));
                        dtFinal.Columns.Add("IncludeCommodityCode", typeof(string));
                        dtFinal.Columns.Add("AgentGroup", typeof(string));
                        dtFinal.Columns.Add("IncludeAgentGroup", typeof(string));
                        dtFinal.Columns.Add("ProductType", typeof(string));
                        dtFinal.Columns.Add("IncludeProductType", typeof(string));
                        if (RateType == "AgentSpecificRate")
                        {
                            dtFinal.Columns.Add("AgentName", typeof(string));
                            dtFinal.Columns.Add("IncludeAgentName", typeof(string));
                        }
                        dtFinal.Columns.Add("SpecialHandlingCode", typeof(string));
                        dtFinal.Columns.Add("IncludeSpecialHandlingCode", typeof(string));
                        dtFinal.Columns.Add("ShipperName", typeof(string));
                        dtFinal.Columns.Add("IncludeShipperName", typeof(string));
                        dtFinal.Columns.Add("SpecialHandlingGroup", typeof(string));
                        dtFinal.Columns.Add("IncludeSpecialHandlingGroup", typeof(string));
                        dtFinal.Columns.Add("Remark", typeof(string));
                        dtFinal.Columns.Add("Message", typeof(string));


                        foreach (DataRow dr1 in drOk)
                        {
                            //dtFinal.Rows.Add(drOk);
                            dtFinal.ImportRow(dr1);
                        }

                        DataRow[] drerror = table2.Select("Message <> ''");
                        DataTable dtError = new DataTable();
                        dtError.Columns.Add("SNo");
                        dtError.Columns.Add("RateCardName", typeof(string));
                        if (RateType == "MailRating")
                        {
                            dtError.Columns.Add("MailRatingCode", typeof(string));
                        }
                        dtError.Columns.Add("AirlineName", typeof(string));
                        dtError.Columns.Add("OfficeName", typeof(string));
                        dtError.Columns.Add("OriginLevel", typeof(string));
                        dtError.Columns.Add("Origin", typeof(string));
                        dtError.Columns.Add("DestinationLevel", typeof(string));
                        dtError.Columns.Add("Destination", typeof(string));
                        dtError.Columns.Add("Status", typeof(string));
                        dtError.Columns.Add("RateTypeName", typeof(string));
                        if (RateType == "AllotmentRate")
                        {
                            dtError.Columns.Add("AllotmentCode", typeof(string));
                        }
                        dtError.Columns.Add("ValidFrom", typeof(string));
                        dtError.Columns.Add("ValidTo", typeof(string));
                        dtError.Columns.Add("RateBasedOn", typeof(string));
                        dtError.Columns.Add("Currency", typeof(string));
                        dtError.Columns.Add("WeightType", typeof(string));
                        dtError.Columns.Add("FlightTypeName", typeof(string));
                        dtError.Columns.Add("RateReferenceNumber", typeof(string));
                        dtError.Columns.Add("IsNextSlab", typeof(string));
                        dtError.Columns.Add("IsCommissionable", typeof(string));
                        dtError.Columns.Add("Minimum", typeof(decimal));
                        dtError.Columns.Add("Normal", typeof(decimal));
                        dtError.Columns.Add("Plus30", typeof(decimal));
                        dtError.Columns.Add("Plus45", typeof(decimal));
                        dtError.Columns.Add("Plus50", typeof(decimal));
                        dtError.Columns.Add("Plus100", typeof(decimal));
                        dtError.Columns.Add("Plus150", typeof(decimal));
                        dtError.Columns.Add("Plus200", typeof(decimal));
                        dtError.Columns.Add("Plus250", typeof(decimal));
                        dtError.Columns.Add("Plus300", typeof(decimal));
                        dtError.Columns.Add("Plus500", typeof(decimal));
                        dtError.Columns.Add("Plus1000", typeof(decimal));
                        dtError.Columns.Add("Plus1500", typeof(decimal));
                        dtError.Columns.Add("Plus2000", typeof(decimal));
                        dtError.Columns.Add("Plus3000", typeof(decimal));
                        dtError.Columns.Add("ULDType", typeof(string));
                        dtError.Columns.Add("PivotWeight", typeof(decimal));
                        dtError.Columns.Add("PivoteRate", typeof(decimal));
                        dtError.Columns.Add("OverPivoteRAte", typeof(decimal));
                        dtError.Columns.Add("IssueCarrier", typeof(string));
                        dtError.Columns.Add("IncludeIssueCarrier", typeof(string));
                        dtError.Columns.Add("FlightNumber", typeof(string));
                        dtError.Columns.Add("IncludeFlightNumber", typeof(string));
                        dtError.Columns.Add("DayofWeek", typeof(string));
                        dtError.Columns.Add("IncludeDayofWeek", typeof(string));
                        dtError.Columns.Add("StartTime", typeof(string));
                        dtError.Columns.Add("EndTime", typeof(string));
                        dtError.Columns.Add("IncludeSET", typeof(string));
                        dtError.Columns.Add("TransitStation", typeof(string));
                        dtError.Columns.Add("IncludeTransitStation", typeof(string));
                        dtError.Columns.Add("CommodityCode", typeof(string));
                        dtError.Columns.Add("IncludeCommodityCode", typeof(string));
                        dtError.Columns.Add("AgentGroup", typeof(string));
                        dtError.Columns.Add("IncludeAgentGroup", typeof(string));
                        dtError.Columns.Add("ProductType", typeof(string));
                        dtError.Columns.Add("IncludeProductType", typeof(string));
                        if (RateType == "AgentSpecificRate")
                        {
                            dtError.Columns.Add("AgentName", typeof(string));
                            dtError.Columns.Add("IncludeAgentName", typeof(string));
                        }
                        dtError.Columns.Add("SpecialHandlingCode", typeof(string));
                        dtError.Columns.Add("IncludeSpecialHandlingCode", typeof(string));
                        dtError.Columns.Add("ShipperName", typeof(string));
                        dtError.Columns.Add("IncludeShipperName", typeof(string));
                        dtError.Columns.Add("SpecialHandlingGroup", typeof(string));
                        dtError.Columns.Add("IncludeSpecialHandlingGroup", typeof(string));
                        dtError.Columns.Add("Remark", typeof(string));
                        dtError.Columns.Add("Message", typeof(string));

                        foreach (DataRow dr2 in drerror)
                        {
                            //dtFinal.Rows.Add(drOk);
                            dtError.ImportRow(dr2);
                        }
                        DataSet dserror = new DataSet();
                        dserror.Tables.Add(dtError);
                        if (dtError.Rows.Count > 0)
                        {
                            Session["BlankRate"] = dserror.Tables[0];
                            if (Session["BlankRate"] != null)
                            {
                                ViewBag.BlankTrue = true;
                            }
                        }
                        //ConvertDSToExcel_Duplicate(dserror, 1);
                        //DataSet dsFinal = new DataSet();
                        //dsFinal.Tables.Add(dtFinal);

                        dtFinal.Columns.Remove("Message");
                        dtFinal.Columns.Remove("SNo");
                        //dtFinal.Columns.Remove("Plus1500");
                        Excel_DS.Reset();

                        Excel_DS.Tables.Add(dtFinal);
                        if (RateType == "PublishRate")
                        {
                            //ProcedureName = "RateType_ExcelUpload";
                            ProcedureName = "Rate_ExcelUpload_New";
                        }
                        else if (RateType == "AllotmentRate")
                        {

                            // ProcedureName = "Rate_ExcelUpload_AllotmentRate";
                            ProcedureName = "Rate_ExcelUpload_AllotmentRate_New";
                        }
                        else if (RateType == "AgentSpecificRate")
                        {
                            ProcedureName = "Rate_ExcelUpload_AgentSpecific";
                        }
                        else if (RateType == "MailRating")
                        {
                            ProcedureName = "Rate_ExcelUpload_MailRating";
                        }
                    }
                }
                //else if (Text_PageSNo.Trim().ToUpper() == "MANAGE TACT RATE")
                //{
                //    //Converting Excel file data into DataSet

                //    Excel_DS.Tables.Add(table1);
                //    ProcedureName = "SPTactRate_CreateAirlineTactRate_Upload";
                //}

                // ---------------------------- Added By Priti Yadav------------------------------

                else if (Text_PageSNo.Trim().ToUpper() == "OPERATION EXCEL UPLOAD")
                {
                    reader.IsFirstRowAsColumnNames = true;
                    Excel_DS = reader.AsDataSet();

                    DataTable dtExcelUploadOperation = new DataTable();
                    dtExcelUploadOperation.Columns.Add("SNo", typeof(string));
                    dtExcelUploadOperation.Columns.Add("FlightNo", typeof(string));
                    dtExcelUploadOperation.Columns.Add("FlightDate", typeof(DateTime));
                    dtExcelUploadOperation.Columns.Add("DestinationAirport", typeof(string));
                    dtExcelUploadOperation.Columns.Add("GrossWeight", typeof(string));
                    dtExcelUploadOperation.Columns.Add("UploadedOn", typeof(DateTime));
                    dtExcelUploadOperation.Columns.Add("UploadedBy", typeof(string));
                    int count1 = Excel_DS.Tables[0].Rows.Count;
                    for (int i = 0; i < count1; i++)
                    {
                        DataRow drExcelUploadOperation = dtExcelUploadOperation.NewRow();
                        drExcelUploadOperation["SNo"] = i + 1;
                        drExcelUploadOperation["FlightNo"] = Excel_DS.Tables[0].Rows[i]["FlightNumber"].ToString();
                        drExcelUploadOperation["FlightDate"] = Excel_DS.Tables[0].Rows[i]["FlightDate"].ToString();
                        drExcelUploadOperation["DestinationAirport"] = Excel_DS.Tables[0].Rows[i]["DestinationAirport"].ToString();
                        drExcelUploadOperation["GrossWeight"] = Excel_DS.Tables[0].Rows[i]["GrossWeight"].ToString();
                        dtExcelUploadOperation.Rows.Add(drExcelUploadOperation);
                    }

                    dtExcelUploadOperation.TableName = "InputData";
                    Excel_DS.Reset();
                    Excel_DS.Tables.Add(dtExcelUploadOperation);
                    ProcedureName = "spExcelUpload_OperationExcelUploadDetails";                  
                }

                // ----------------------------------End------------------------------------------

                DataSet ds = null;
                if (Text_PageSNo.Trim().ToUpper() != "MANAGE TACT RATE" && Text_PageSNo.Trim().ToUpper() != "EXCHANGE RATE")
                {
                    if (Excel_DS.Tables.Contains("InputData"))
                    {
                        if (Text_PageSNo.Trim().ToUpper() == "COUNTRY")
                        {
                            DataTable excelData = Excel_DS.Tables["InputData"];

                            DataTable duplicateData = new DataTable();
                            duplicateData.Columns.Add("CountryCode", typeof(string));
                            duplicateData.Columns.Add("CountryName", typeof(string));

                            duplicateData.Columns.Add("CurrencyCode", typeof(string));

                            duplicateData.Columns.Add("Continent", typeof(string));

                            duplicateData.Columns.Add("IATAAreaCode", typeof(string));
                            duplicateData.Columns.Add("ISDCode", typeof(Int32));

                            if (excelData.Rows.Count > 0)
                            {
                                foreach (DataRow dr in excelData.Rows)
                                {
                                    DataRow row = duplicateData.NewRow();
                                    row["CountryCode"] = dr["CountryCode"].ToString();
                                    row["CountryName"] = dr["CountryName"].ToString();
                                    row["CurrencyCode"] = dr["CurrencyCode"].ToString();
                                    row["Continent"] = dr["Continent"].ToString();



                                    //if (dr["IATAAreaCode"].ToString() == "")
                                    //{
                                    row["IATAAreaCode"] = dr["IATAAreaCode"].ToString();

                                    // }
                                    if (dr["ISDCode"].ToString() == "")
                                    {
                                        row["ISDCode"] = 0;

                                    }
                                    else
                                    {
                                        row["ISDCode"] = Convert.ToInt32(dr["ISDCode"].ToString());

                                    }
                                    duplicateData.Rows.Add(row);
                                }
                            }
                            SqlParameter[] Parameters = { new SqlParameter("@InputData", SqlDbType.Structured) { Value = duplicateData },
                                                new SqlParameter ("@CreatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};
                            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcedureName, Parameters);

                        }

                        else
                        {
                            if (Text_PageSNo.Trim().ToUpper() == "USER")
                            {
                                CommonService c = new CommonService();
                                String guid = Guid.NewGuid().ToString();
                                string NewPwd = guid.ToString().Substring(0, 8); //"cargo"; 

                                //List<string> ErrorMessage = new List<string>();
                                //List<Users> type = users[0].userstype;



                                SqlParameter param1 = new SqlParameter();
                                param1.ParameterName = "@NewPwd";
                                param1.SqlDbType = System.Data.SqlDbType.NVarChar;
                                param1.Value = NewPwd;


                                SqlParameter param2 = new SqlParameter();
                                param2.ParameterName = "@EncyNewPwd";
                                param2.SqlDbType = System.Data.SqlDbType.NVarChar;
                                param2.Value = c.GenerateSHA512String(NewPwd);



                                SqlParameter param3 = new SqlParameter();
                                param3.ParameterName = "@Path";
                                param3.SqlDbType = System.Data.SqlDbType.NVarChar;
                                param3.Value = System.Web.HttpContext.Current.Request.Url.AbsoluteUri.Replace(System.Web.HttpContext.Current.Request.Url.PathAndQuery, "/").ToString();



                                SqlParameter[] Parameters1 = { new SqlParameter("@InputData", SqlDbType.Structured) { Value = Excel_DS.Tables["InputData"] },
                                                             param1, param2, param3 ,
                                                new SqlParameter ("@CreatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

                                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcedureName, Parameters1);
                            }
                            else
                            {
                                if (Text_PageSNo.Trim().ToUpper() != "EXCHANGE RATE")
                                {
                                    //SqlParameter[] Parameters1 = { new SqlParameter("@InputData", SqlDbType.Structured) { Value = Excel_DS.Tables["InputData"] },
                                    //                           new SqlParameter ("@CreatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

                                    //SqlConnection con = new SqlConnection(ReadConnectionString.WebConfigConnectionString);

                                    //SqlCommand cmd = new SqlCommand(ProcedureName, con);
                                    //string StrTimeOut = ConfigurationManager.AppSettings["ExcellCommandTimeout"].ToString();
                                    //cmd.CommandTimeout = Convert.ToInt32(StrTimeOut);
                                    //cmd.CommandType = CommandType.StoredProcedure;
                                    //cmd.Parameters.Add(new SqlParameter("@InputData", SqlDbType.Structured) { Value = Excel_DS.Tables["InputData"] });
                                    //cmd.Parameters.Add(new SqlParameter("@CreatedBy", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()));
                                    //ds = new DataSet();
                                    //SqlDataAdapter adap = new SqlDataAdapter(cmd);
                                    //adap.Fill(ds);



                                    List<Task> tasks = new List<Task>();
                                    List<DataSet> excelResults = new List<DataSet>();

                                    string exceluploadBatchSize = "0";
                                    try
                                    {
                                        ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting.TryGetValue("ExcelUploadBatchSize", out exceluploadBatchSize);
                                    }
                                    catch { }
                                    int batchSize = Convert.ToInt32(exceluploadBatchSize);
                                    int max = batchSize > 0 ? batchSize : 500;

                                    string createdBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
                                    for (int i = 0; i < Excel_DS.Tables["InputData"].Rows.Count; i++)
                                    {

                                        IEnumerable<DataRow> query = from dataTable in Excel_DS.Tables["InputData"].AsEnumerable().Skip(i).Take(max)
                                                                     select dataTable;
                                        //IEnumerable<DataRow> query = from dataTable in Excel_DS.Tables["InputData"].AsEnumerable()
                                        //                             where dataTable.Field<int>("SNo") > i && dataTable.Field<int>("SNo") < max
                                        //                             select dataTable;
                                        DataTable boundTable = query.CopyToDataTable<DataRow>();
                                        // DataTable SlabDetails = Excel_DS.Tables["SlabDetails"];
                                        Task t = Task.Run(() =>
                                        {
                                            //if (ProcedureName == "OtherCharges_ExcelUpload")
                                            //{
                                            //    UploadExcelToDB(ProcedureName, boundTable, SlabDetails, excelResults, createdBy);
                                            //}
                                            //else
                                            //{
                                            UploadExcelToDB(ProcedureName, boundTable, null, excelResults, createdBy);
                                            // }

                                        });
                                        tasks.Add(t);
                                        i = i + max;

                                    }
                                    Task.WaitAll(tasks.ToArray());

                                    ds = new DataSet();



                                    foreach (var item in excelResults)
                                    {
                                        //if (Text_PageSNo.Trim().ToUpper() == "MANAGE OTHER CHARGES")
                                        //{


                                        //    if (OtherChargeType == "FLATCHARGES")
                                        //    {
                                        //        if (item.Tables.Count > 0 && item.Tables[0].Rows.Count > 0 && Convert.ToInt32(item.Tables[0].Rows[0]["IsValid"]) == 1)
                                        //        {

                                        //            if (ds.Tables.Count == 0)
                                        //            {
                                        //                ds.Tables.Add("FlatCharges");

                                        //            }
                                        //            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "FlatCharges")
                                        //            {
                                        //                ds.Tables.Add("FlatCharges");

                                        //            }

                                        //            ds.Tables["FlatCharges"].Merge(item.Tables[0]);


                                        //        }

                                        //        if (item.Tables.Count > 0 && item.Tables[0].Rows.Count > 0 && Convert.ToInt32(item.Tables[0].Rows[0]["IsValid"]) == 0)
                                        //        {
                                        //            if (ds.Tables.Count == 0)
                                        //                ds.Tables.Add("InValid_FlatCharges");
                                        //            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "InValid_FlatCharges")
                                        //                ds.Tables.Add("InValid_FlatCharges");

                                        //            ds.Tables["InValid_FlatCharges"].Merge(item.Tables[0]);

                                        //        }
                                        //        if (item.Tables.Count > 1 && item.Tables[1].Rows.Count > 0 && Convert.ToInt32(item.Tables[1].Rows[0]["IsValid"]) == 1)
                                        //        {
                                        //            if (ds.Tables.Count == 0)
                                        //                ds.Tables.Add("FlatCharges");
                                        //            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "FlatCharges")
                                        //                ds.Tables.Add("FlatCharges");

                                        //            ds.Tables["FlatCharges"].Merge(item.Tables[1]);
                                        //        }

                                        //        if (item.Tables.Count > 1 && item.Tables[1].Rows.Count > 0 && Convert.ToInt32(item.Tables[1].Rows[0]["IsValid"]) == 0)
                                        //        {
                                        //            if (ds.Tables.Count == 0)
                                        //                ds.Tables.Add("InValid_FlatCharges");
                                        //            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "InValid_FlatCharges")
                                        //                ds.Tables.Add("InValid_FlatCharges");

                                        //            ds.Tables["InValid_FlatCharges"].Merge(item.Tables[1]);
                                        //        }
                                        //    }
                                        //    if (OtherChargeType == "OTHERCHARGES")
                                        //    {
                                        //        if (item.Tables.Count > 0 && item.Tables[0].Rows.Count > 0 && Convert.ToInt32(item.Tables[0].Rows[0]["IsValid"]) == 1)
                                        //        {

                                        //            if (ds.Tables.Count == 0)
                                        //            {
                                        //                ds.Tables.Add("OtherCharges");
                                        //                ds.Tables.Add("Slab");

                                        //            }

                                        //            else if (ds.Tables.Count == 2 && ds.Tables[0].TableName != "OtherCharges")
                                        //            {
                                        //                ds.Tables.Add("OtherCharges");
                                        //                ds.Tables.Add("Slab");

                                        //            }

                                        //            ds.Tables["OtherCharges"].Merge(item.Tables[0]);
                                        //            ds.Tables["Slab"].Merge(item.Tables[1]);


                                        //        }

                                        //        if (item.Tables.Count > 0 && item.Tables[0].Rows.Count > 0 && Convert.ToInt32(item.Tables[0].Rows[0]["IsValid"]) == 0)
                                        //        {
                                        //            if (ds.Tables.Count == 0)
                                        //            {
                                        //                ds.Tables.Add("InValid_OtherCharges");
                                        //                ds.Tables.Add("InValid_Slab");

                                        //            }
                                        //            else if (ds.Tables.Count == 2 && ds.Tables[0].TableName != "InValid_OtherCharges")
                                        //            {
                                        //                ds.Tables.Add("InValid_OtherCharges");
                                        //                ds.Tables.Add("InValid_Slab");

                                        //            }

                                        //            ds.Tables["InValid_OtherCharges"].Merge(item.Tables[0]);
                                        //            ds.Tables["InValid_Slab"].Merge(item.Tables[1]);


                                        //        }
                                        //        if (item.Tables.Count > 2 && item.Tables[2].Rows.Count > 0 && Convert.ToInt32(item.Tables[2].Rows[0]["IsValid"]) == 1)
                                        //        {
                                        //            if (ds.Tables.Count == 0)
                                        //            {
                                        //                ds.Tables.Add("OtherCharges");
                                        //                ds.Tables.Add("Slab");
                                        //            }
                                        //            else if (ds.Tables.Count > 0 && ds.Tables[0].TableName != "OtherCharges")
                                        //            {
                                        //                ds.Tables.Add("OtherCharges");
                                        //                ds.Tables.Add("Slab");
                                        //            }

                                        //            ds.Tables["OtherCharges"].Merge(item.Tables[2]);
                                        //            ds.Tables["Slab"].Merge(item.Tables[3]);

                                        //        }

                                        //        //if (item.Tables.Count > 2 && item.Tables[1].Rows.Count > 0 && Convert.ToInt32(item.Tables[1].Rows[0]["IsValid"]) == 0)
                                        //        if (item.Tables.Count > 2 && item.Tables[2].Rows.Count > 0 && Convert.ToInt32(item.Tables[2].Rows[0]["IsValid"]) == 0)
                                        //        {
                                        //            if (ds.Tables.Count == 0)
                                        //            {
                                        //                ds.Tables.Add("InValid_OtherCharges");
                                        //                ds.Tables.Add("InValid_Slab");
                                        //            }
                                        //            else if (ds.Tables.Count > 0 && ds.Tables[0].TableName != "InValid_OtherCharges")
                                        //            {
                                        //                ds.Tables.Add("InValid_OtherCharges");
                                        //                ds.Tables.Add("InValid_Slab");
                                        //            }

                                        //            ds.Tables["InValid_OtherCharges"].Merge(item.Tables[2]);
                                        //            ds.Tables["InValid_Slab"].Merge(item.Tables[3]);

                                        //        }
                                        //    }
                                        //}
                                        //else
                                        //{

                                        if (item.Tables.Count > 0 && item.Tables[0].Rows.Count > 0 && Convert.ToInt32(item.Tables[0].Rows[0]["IsValid"]) == 1)
                                        {

                                            if (ds.Tables.Count == 0)
                                            {
                                                ds.Tables.Add("Valid");

                                            }
                                            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "Valid")
                                            {
                                                ds.Tables.Add("Valid");

                                            }

                                            ds.Tables["Valid"].Merge(item.Tables[0]);


                                        }

                                        if (item.Tables.Count > 0 && item.Tables[0].Rows.Count > 0 && Convert.ToInt32(item.Tables[0].Rows[0]["IsValid"]) == 0)
                                        {
                                            if (ds.Tables.Count == 0)
                                                ds.Tables.Add("InValid");
                                            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "InValid")
                                                ds.Tables.Add("InValid");

                                            ds.Tables["InValid"].Merge(item.Tables[0]);

                                        }


                                        if (item.Tables.Count > 1 && item.Tables[1].Rows.Count > 0 && Convert.ToInt32(item.Tables[1].Rows[0]["IsValid"]) == 1)
                                        {
                                            if (ds.Tables.Count == 0)
                                                ds.Tables.Add("Valid");
                                            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "Valid")
                                                ds.Tables.Add("Valid");

                                            ds.Tables["Valid"].Merge(item.Tables[1]);
                                        }

                                        if (item.Tables.Count > 1 && item.Tables[1].Rows.Count > 0 && Convert.ToInt32(item.Tables[1].Rows[0]["IsValid"]) == 0)
                                        {
                                            if (ds.Tables.Count == 0)
                                                ds.Tables.Add("InValid");
                                            else if (ds.Tables.Count == 1 && ds.Tables[0].TableName != "InValid")
                                                ds.Tables.Add("InValid");

                                            ds.Tables["InValid"].Merge(item.Tables[1]);
                                        }
                                        // }

                                    }


                                }
                            }
                        }
                        int flg = 0;

                        if (Text_PageSNo.Trim().ToUpper() == "COUNTRY")
                        {
                            int valid0 = 0;
                            valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                            if (valid0 == 1)
                            {
                                ViewBag.SuccessTrue = true;
                                ViewBag.DuplicateTrue = false;
                                Session["COUNTRY"] = true;
                                Session["TempData_Valid"] = ds.Tables[0];
                            }
                        }


                        if (Text_PageSNo.Trim().ToUpper() == "CITY")
                        {
                            int valid0 = 0;
                            valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                            if (valid0 == 1)
                            {
                                ViewBag.SuccessTrue = true;
                                ViewBag.DuplicateTrue = false;
                                Session["CITY"] = true;
                                Session["TempData_Valid"] = ds.Tables[0];
                            }
                        }

                        if (Text_PageSNo.Trim().ToUpper() == "AIRPORT")
                        {
                            int valid0 = 0;
                            valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                            if (valid0 == 1)
                            {
                                ViewBag.SuccessTrue = true;
                                ViewBag.DuplicateTrue = false;
                                Session["AIRPORT"] = true;
                                Session["TempData_Valid"] = ds.Tables[0];
                            }
                        }


                        if (Text_PageSNo.Trim().ToUpper() == "RATE" || Text_PageSNo.Trim().ToUpper() == "ACCOUNT" || Text_PageSNo.Trim().ToUpper() == "USER" || Text_PageSNo.Trim().ToUpper() == "MANAGE OTHER CHARGES")
                        {
                            int valid0 = 0;
                            int valid00 = 0;
                            int valid1 = 0;
                            int valid11 = 0;

                            if (Text_PageSNo.Trim().ToUpper() == "ACCOUNT")
                            {
                                if (ds.Tables.Count > 0)
                                {
                                    int count = ds.Tables.Count;
                                    if (count == 1)
                                    {
                                        valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                        valid00 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValidCustomer"].ToString());
                                        if (valid0 == 0 || valid00 == 0)
                                        {
                                            ViewBag.SuccessTrue = false;
                                            ViewBag.DuplicateTrue = true;
                                            Session["Account"] = true;
                                            Session["TempData_InValid"] = ds.Tables[0];
                                            //ds.Tables[0].TableName = "DuplicateRecord_Rate";
                                        }
                                        if (valid0 == 1 && valid00 == 1)
                                        {
                                            ViewBag.SuccessTrue = true;
                                            ViewBag.DuplicateTrue = false;
                                            Session["Account"] = true;
                                            Session["TempData_Valid"] = ds.Tables[0];
                                            //ds.Tables[0].TableName = "DuplicateRecord_Rate";
                                        }
                                    }
                                    else if (count == 2)
                                    {
                                        valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                        valid00 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValidCustomer"].ToString());
                                        valid1 = Convert.ToInt32(ds.Tables[1].Rows[0]["IsValid"].ToString());
                                        valid11 = Convert.ToInt32(ds.Tables[1].Rows[0]["IsValidCustomer"].ToString());
                                        if (valid0 == 0 || valid00 == 0)
                                        {
                                            //ViewBag.SuccessTrue = true;
                                            ViewBag.DuplicateTrue = true;
                                            Session["Account"] = true;
                                            Session["TempData_InValid"] = ds.Tables[0];
                                            //Session["TempData_Valid"] = ds.Tables[1];
                                        }
                                        if (valid1 == 1 && valid11 == 1)
                                        {
                                            ViewBag.SuccessTrue = true;
                                            //ViewBag.DuplicateTrue = true;

                                            Session["Account"] = true;
                                            Session["TempData_Valid"] = ds.Tables[1];
                                        }
                                    }
                                    Session["PageName"] = Text_PageSNo.Trim().ToUpper();
                                }
                            }
                            if (Text_PageSNo.Trim().ToUpper() == "RATE" || Text_PageSNo.Trim().ToUpper() == "USER" || Text_PageSNo.Trim().ToUpper() == "MANAGE OTHER CHARGES")
                            {
                                //if (Text_PageSNo.Trim().ToUpper() == "MANAGE OTHER CHARGES")
                                //{
                                //    if (ds.Tables.Count > 0)
                                //    {
                                //        //Button SuccRate = (Button)FindControl("SuccRate");
                                //        int count = ds.Tables.Count;
                                //        if (count == 1)
                                //        {
                                //            valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                //            //valid0 = Convert.ToInt32(ds.Tables[0].Rows[1]["IsValid"].ToString());
                                //            if (valid0 == 0)
                                //            {
                                //                ViewBag.SuccessTrue = false;
                                //                ViewBag.DuplicateTrue = true;
                                //                Session["TempData_InValid"] = ds;

                                //            }
                                //            if (valid0 == 1)
                                //            {
                                //                ViewBag.SuccessTrue = true;
                                //                ViewBag.DuplicateTrue = false;
                                //                Session["TempData_Valid"] = ds;

                                //            }
                                //        }
                                //        else if (count == 2)
                                //        {
                                //            if (OtherChargeType == "FLATCHARGES")
                                //            {
                                //                valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                //                valid1 = Convert.ToInt32(ds.Tables[1].Rows[0]["IsValid"].ToString());

                                //                if (valid0 == 0 && valid1 == 1)
                                //                {
                                //                    ViewBag.SuccessTrue = true;
                                //                    ViewBag.DuplicateTrue = true;

                                //                    Session["TempData_InValid"] = ds.Tables[0];
                                //                    Session["TempData_Valid"] = ds.Tables[1];
                                //                }
                                //            }
                                //            else
                                //            {
                                //                valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                //                // valid0 = Convert.ToInt32(ds.Tables[1].Rows[1]["IsValid"].ToString());
                                //                if (valid0 == 0)
                                //                {
                                //                    ViewBag.SuccessTrue = false;
                                //                    ViewBag.DuplicateTrue = true;
                                //                    Session["TempData_InValid"] = ds;

                                //                }
                                //                if (valid0 == 1)
                                //                {
                                //                    ViewBag.SuccessTrue = true;
                                //                    ViewBag.DuplicateTrue = false;
                                //                    Session["TempData_Valid"] = ds;

                                //                }
                                //            }
                                //        }
                                //        else if (count == 4)
                                //        {
                                //            valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                //            valid1 = Convert.ToInt32(ds.Tables[2].Rows[0]["IsValid"].ToString());

                                //            if (valid0 == 0 && valid1 == 1)
                                //            {
                                //                ViewBag.SuccessTrue = true;
                                //                ViewBag.DuplicateTrue = true;

                                //                Session["TempData_InValid"] = ds;
                                //                Session["TempData_Valid"] = ds;
                                //            }
                                //        }

                                //        Session["PageName"] = Text_PageSNo.Trim().ToUpper();
                                //        Session["Account"] = null;
                                //        //Session["TempData"] = ds;

                                //    }
                                //}

                                //else
                                //{
                                if (ds.Tables.Count > 0)
                                {
                                    //Button SuccRate = (Button)FindControl("SuccRate");
                                    int count = ds.Tables.Count;
                                    if (count == 1)
                                    {
                                        valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                        if (valid0 == 0)
                                        {
                                            ViewBag.SuccessTrue = false;
                                            ViewBag.DuplicateTrue = true;
                                            Session["TempData_InValid"] = ds.Tables[0];
                                            //ds.Tables[0].TableName = "DuplicateRecord_Rate";
                                        }
                                        if (valid0 == 1)
                                        {
                                            ViewBag.SuccessTrue = true;
                                            ViewBag.DuplicateTrue = false;
                                            Session["TempData_Valid"] = ds.Tables[0];
                                            // Session["TempSlabData_Valid"] = ds.Tables[1];
                                            //ds.Tables[0].TableName = "DuplicateRecord_Rate";
                                        }
                                    }
                                    else if (count == 2)
                                    {
                                        valid0 = Convert.ToInt32(ds.Tables[0].Rows[0]["IsValid"].ToString());
                                        valid1 = Convert.ToInt32(ds.Tables[1].Rows[0]["IsValid"].ToString());

                                        if (valid0 == 0 && valid1 == 1)
                                        {
                                            ViewBag.SuccessTrue = true;
                                            ViewBag.DuplicateTrue = true;

                                            Session["TempData_InValid"] = ds.Tables[0];
                                            Session["TempData_Valid"] = ds.Tables[1];
                                        }
                                    }

                                    Session["PageName"] = Text_PageSNo.Trim().ToUpper();
                                    Session["Account"] = null;
                                    //Session["TempData"] = ds;

                                }
                                //}
                            }
                            //if (ds.Tables[1].Rows.Count > 0)
                            //{
                            //   // ConvertDSToExcel_Success(ds);
                            //}
                        }
                        ModelState.Clear();

                        //ViewBag.Refresh = "Refresh";
                        //return View("UploadExcel");
                        // return RedirectToAction("UploadExcel");
                        //return View();
                        //return View(Content(CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds)));
                        // return Redirect(Request.UrlReferrer.ToString());
                    }
                    else
                    {
                        ModelState.AddModelError("File", "InputData Sheet not find!!!");

                    }
                }
                if (Text_PageSNo.Trim().ToUpper() != "EXCHANGE RATE")
                    reader.Close();

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ViewBag.Error = "File not Uploaded...Some Data Problem in Excel";
                ModelState.AddModelError("Error", "Error Occurred!!");
            }

            return View();
        }



        private void UploadExcelToDB(string procName, DataTable Excel_DS, DataTable Excel_Slab, List<DataSet> lstDs, string createdBy)
        {
            try
            {
                SqlConnection con = new SqlConnection(ReadConnectionString.WebConfigConnectionString);
                SqlCommand cmd = new SqlCommand(procName, con);
                string StrTimeOut = ConfigurationManager.AppSettings["ExcellCommandTimeout"].ToString();
                cmd.CommandTimeout = Convert.ToInt32(StrTimeOut);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@InputData", SqlDbType.Structured) { Value = Excel_DS });
                //if (procName == "OtherCharges_ExcelUpload")
                //{
                //    cmd.Parameters.Add(new SqlParameter("@SlabDetails", SqlDbType.Structured) { Value = Excel_Slab });
                //}
                cmd.Parameters.Add(new SqlParameter("@CreatedBy", createdBy));
                DataSet ds = new DataSet();
                SqlDataAdapter
                    adap = new SqlDataAdapter(cmd);
                adap.Fill(ds);
                lstDs.Add(ds);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }


        [HttpPost]
        public ActionResult GetSampleFile(int SNo)
        {
            // CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo", SNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPageSampleFile", Parameters);

            return Content(CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds));
        }


        [HttpPost]
        public void SuccessRateDownload(string id)
        {
            string ss = id;
            //if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
            //{
            //    if (Session["TempData_Valid"] != null)
            //    {
            //        DataSet ds = new DataSet();
            //        DataSet dsSUCCESS = (DataSet)Session["TempData_Valid"];

            //        //Session["SuccTable"] = dsSUCCESS;
            //        //DataSet SuccDS = new DataSet();
            //        //SuccDS = (DataSet)Session["SuccTable"];
            //        //SuccDS.Tables.Remove("InValid_OtherCharges");
            //        //SuccDS.Tables.Remove("InValid_Slab");

            //        //SuccDS.Tables[0].Columns.Remove("IsValid");
            //        ConvertDSToExcel_OtherChargesSuccess(dsSUCCESS, 0);
            //    }
            //}
            //else
            //{
            // DataSet ds = new DataSet();
            if (Session["TempData_Valid"] != null)
            {


                DataTable dtSUCCESS = (DataTable)Session["TempData_Valid"];
                dtSUCCESS.Columns.Remove("IsValid");

                if (Session["Account"] != null)
                {
                    dtSUCCESS.Columns.Remove("IsValidCustomer");
                }
                ConvertDSToExcel_Success(dtSUCCESS, 0);

                dtSUCCESS.Columns.Add("IsValid");
                if (Session["Account"] != null)
                {
                    dtSUCCESS.Columns.Add("IsValidCustomer");
                }
            }

            // }
            ViewBag.SuccessTrue = false;


        }

        [HttpPost]
        public void DuplicateRateDownload(string id)
        {
            string ss = id;
            //if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
            //{
            //    if (Session["TempData_InValid"] != null)
            //    {
            //        DataSet ds = new DataSet();
            //        DataSet dsDUPLICATE = (DataSet)Session["TempData_InValid"];

            //        //Session["DupliTable"] = dsDUPLICATE;
            //        //DataSet DupliDS = new DataSet();
            //        //DupliDS = (DataSet)Session["DupliTable"];
            //        //DupliDS.Tables.Remove("OtherCharges");
            //        //DupliDS.Tables.Remove("Slab");
            //        // dsDUPLICATE.Tables[0].Columns.Remove("IsValid");
            //        ConvertDSToExcel_OtherChargesSuccess(dsDUPLICATE, 1);
            //    }
            //}
            //else
            //{
            // DataSet ds = new DataSet();
            if (Session["TempData_InValid"] != null)
            {
                //int valid = 0;
                // DataSet ds = (DataSet)Session["TempData_InValid"];
                DataTable dtDUPLICATE = (DataTable)Session["TempData_InValid"];

                dtDUPLICATE.Columns.Remove("IsValid");
                if (Session["Account"] != null)
                {
                    dtDUPLICATE.Columns.Remove("IsValidCustomer");
                }
                ConvertDSToExcel_Success(dtDUPLICATE, 1);
                dtDUPLICATE.Columns.Add("IsValid");
                if (Session["Account"] != null)
                {
                    dtDUPLICATE.Columns.Add("IsValidCustomer");
                }

            }
            //}
            ViewBag.DuplicateTrue = false;
        }

        [HttpPost]
        public void BlankRateDownload(string id)
        {
            string ss = id;
            // DataSet ds = new DataSet();
            if (Session["BlankRate"] != null)
            {
                //int valid = 0;
                // DataSet ds = (DataSet)Session["TempData_InValid"];
                DataTable dtBlank = (DataTable)Session["BlankRate"];
                //DataSet dsDUPLICATE = new DataSet();
                //dsDUPLICATE.Tables.Add(dtDUPLICATE);
                //dtBlank.Columns.Remove("IsValid");
                //ConvertDSToExcel_Blank(dtBlank, 0);
                ConvertDSToExcel_Success(dtBlank, 2);

            }
            ViewBag.BlankTrue = false;
        }


        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            //int valid = 0;
            //if (mode == 0)
            //{
            //}
            //else
            //{
            //   // ds.Tables[0].TableName = "ErrorRecord_Rate";
            //}

            //if (valid == 1)
            //{

            using (XLWorkbook wb = new XLWorkbook())
            {
                //foreach (DataTable dt in ds.Tables)
                //{
                //foreach (DataTable dt in ds.Tables)
                //{
                //Add DataTable as Worksheet.
                if (mode == 0)
                {
                    if (Session["Account"] != null)
                    {
                        dt.TableName = "Success_Account";
                    }
                    else if (Session["COUNTRY"] != null)
                    {
                        dt.TableName = "Success_Country";
                    }
                    else if (Session["PageName"].ToString() == "RATE")
                    {
                        dt.TableName = "Success_Rate";
                    }
                    else if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                    {
                        dt.TableName = "Success_OtherCharges";
                    }
                    else if (Session["PageName"].ToString() == "USER")
                    {
                        dt.TableName = "Success_User";
                    }
                }
                if (mode == 1)
                {
                    if (Session["Account"] != null)
                    {
                        dt.TableName = "Duplicate_InValid_Account";
                    }
                    else if (Session["PageName"].ToString() == "RATE")
                    {
                        dt.TableName = "Duplicate_InValid_Rate";
                    }
                    else if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                    {
                        dt.TableName = "Duplicate_InValid_OtherCharges";
                    }
                    else if (Session["PageName"].ToString() == "USER")
                    {
                        dt.TableName = "Duplicate_InValid_User";
                    }
                }
                if (mode == 2)
                {
                    if (Session["Account"] != null)
                    {
                        dt.TableName = "Error_Blank_Account";
                    }
                    //else if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                    //{
                    //    dt.TableName = "Error_Blank_OtherCharges";
                    //}
                    else
                    {
                        dt.TableName = "Error_Blank_Rate";
                    }

                }
                wb.Worksheets.Add(dt);
                //}
                //}

                //Export the Excel file.
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                if (mode == 0)
                {
                    if (Session["Account"] != null)
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Success_AccountMaster_'" + date + "'.xlsx");
                    }
                    else if (Session["COUNTRY"] != null)
                    {

                        Response.AddHeader("content-disposition", "attachment;filename=Success_COUNTRY_'" + date + "'.xlsx");
                    }
                    else if (Session["CITY"] != null)
                    {

                        Response.AddHeader("content-disposition", "attachment;filename=Success_CITY_'" + date + "'.xlsx");
                    }
                    else if (Session["AIRPORT"] != null)
                    {

                        Response.AddHeader("content-disposition", "attachment;filename=Success_AIRPORT_'" + date + "'.xlsx");
                    }
                    else if (Session["PageName"].ToString() == "RATE")
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Success_RateMaster_'" + date + "'.xlsx");
                    }
                    else if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Success_OtherCharges_'" + date + "'.xlsx");
                    }
                    else if (Session["PageName"].ToString() == "USER")
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Success_UserMaster_'" + date + "'.xlsx");
                    }
                }
                if (mode == 1)
                {
                    if (Session["Account"] != null)
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Duplicate_AccountMaster_'" + date + "'.xlsx");
                    }
                    else
                    {
                        if (Session["PageName"].ToString() == "RATE")
                        {
                            Response.AddHeader("content-disposition", "attachment;filename=Duplicate_RateMaster_'" + date + "'.xlsx");
                        }
                         if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                        {
                            Response.AddHeader("content-disposition", "attachment;filename=Duplicate_OtherCharges_'" + date + "'.xlsx");
                        }
                            if (Session["PageName"].ToString() == "USER")
                        {
                            Response.AddHeader("content-disposition", "attachment;filename=Duplicate_UserMaster_'" + date + "'.xlsx");
                        }
                    }
                }
                if (mode == 2)
                {
                    if (Session["Account"] != null)
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Error_AccountMaster_'" + date + "'.xlsx");
                    }
                    
                   //else if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                   // {
                   //     Response.AddHeader("content-disposition", "attachment;filename=Error_OtherCharges_'" + date + "'.xlsx");
                   // }
                    else
                    {

                        Response.AddHeader("content-disposition", "attachment;filename=Error_RateMaster_'" + date + "'.xlsx");

                    }
                }
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }


            //}
            //  ---------------------------------------------------------------
            //Response.Clear();
            //Response.Charset = "";
            //string FileName = "Duplicate/Error_Rate" + DateTime.Now + ".xls";
            //StringWriter strwritter = new StringWriter();
            //HtmlTextWriter htmltextwrtter = new HtmlTextWriter(strwritter);
            //Response.Cache.SetCacheability(HttpCacheability.NoCache); 

            //Response.ContentType = "application/vnd.ms-excel";
            //Response.AddHeader("Content-Disposition", "attachment;filename=" + FileName); 
            //System.Web.UI.WebControls.DataGrid dg = new System.Web.UI.WebControls.DataGrid();
            //dg.GridLines = GridLines.Both;
            //dg.HeaderStyle.Font.Bold = true;
            //dg.DataSource = ds.Tables[0];
            //dg.DataBind();
            //dg.RenderControl(htmltextwrtter);
            //Response.Write(strwritter.ToString());
            //Response.End();
            ////Response.Clear();           // Already have this
            ////Response.ClearContent();    // Add this line
            ////Response.ClearHeaders();
            //Response.BufferOutput = true;
        }
        public void ConvertDSToExcel_OtherChargesSuccess(DataSet ds, int mode)
        {
            string date = DateTime.Now.ToString();

            using (XLWorkbook wb = new XLWorkbook())
            {

                if (mode == 0)
                {

                    //foreach (DataTable dt in ds.Tables)
                    if (ds.Tables.Count == 2)
                    {
                        foreach (DataTable dt in ds.Tables)
                        {
                            wb.Worksheets.Add(dt);
                        }
                    }
                    else
                    {
                        for (int i = 2; i < ds.Tables.Count; i++)
                        {


                            wb.Worksheets.Add(ds.Tables[i]);
                        }
                    }

                }
                if (mode == 1)
                {

                    // foreach (DataTable dt in ds.Tables)
                    if (ds.Tables.Count == 2)
                    {
                        foreach (DataTable dt in ds.Tables)
                        {
                            wb.Worksheets.Add(dt);
                        }
                    }
                    else
                    {
                        for (int i = 0; i < ds.Tables.Count - 2; i++)
                        {

                            wb.Worksheets.Add(ds.Tables[i]);


                        }

                    }
                }


                //Export the Excel file.
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                if (mode == 0)
                {

                    if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Success_OtherCharges_'" + date + "'.xlsx");
                    }

                }
                if (mode == 1)
                {
                    if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Duplicate_OtherCharges_'" + date + "'.xlsx");
                    }

                }
                if (mode == 2)
                {
                    if (Session["PageName"].ToString() == "MANAGE OTHER CHARGES")
                    {
                        Response.AddHeader("content-disposition", "attachment;filename=Error_OtherCharges_'" + date + "'.xlsx");
                    }

                }
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }


            //}
            //  ---------------------------------------------------------------
            //Response.Clear();
            //Response.Charset = "";
            //string FileName = "Duplicate/Error_Rate" + DateTime.Now + ".xls";
            //StringWriter strwritter = new StringWriter();
            //HtmlTextWriter htmltextwrtter = new HtmlTextWriter(strwritter);
            //Response.Cache.SetCacheability(HttpCacheability.NoCache); 

            //Response.ContentType = "application/vnd.ms-excel";
            //Response.AddHeader("Content-Disposition", "attachment;filename=" + FileName); 
            //System.Web.UI.WebControls.DataGrid dg = new System.Web.UI.WebControls.DataGrid();
            //dg.GridLines = GridLines.Both;
            //dg.HeaderStyle.Font.Bold = true;
            //dg.DataSource = ds.Tables[0];
            //dg.DataBind();
            //dg.RenderControl(htmltextwrtter);
            //Response.Write(strwritter.ToString());
            //Response.End();
            ////Response.Clear();           // Already have this
            ////Response.ClearContent();    // Add this line
            ////Response.ClearHeaders();
            //Response.BufferOutput = true;
        }
        // add BY Sushant 

        public void UldStockExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string AirLine
            , string AirportCode, string Ownership, string ExportType, string ULDId, string IdleDays, string IdleDaysval, string LostRemarks)
        {
            try
            {

                System.Data.DataSet ds = new DataSet();

                SqlParameter[] Parameters = { new SqlParameter("@AirLine", AirLine)
                                            , new SqlParameter("@Airport",  AirportCode)
                                            , new SqlParameter("@Ownership", Ownership)
                                            , new SqlParameter("@ULDId",  ULDId)
                                            , new SqlParameter("@IdleDays",  IdleDays)
                                            , new SqlParameter("@IdleDaysval",  IdleDaysval)
                                            , new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 10000), new SqlParameter("@WhereCondition", "")
                                            , new SqlParameter("@OrderBy", "")
                                            , new SqlParameter("@Lost",LostRemarks)
                                            };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDStockReportDetailsExcelPdfPrint", Parameters);
                DataTable dt1 = ds.Tables[0];
                if (dt1.Rows.Count > 0)
                    if (ExportType == "1")
                    {
                        UldStockConvertDSToExcel_Success(dt1, 0, "ULD_Stock_Report_Details_");
                    }
                //else if (ExportType == "2")
                //{
                //  //  DownloadPdf("sfsf", "sfsfas");
                //}
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        // add BY Sushant on 07-02-2018 
        public void ULDStatisticExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string AirLine
         , string AirportCode, string ULDId, string Manufactured, string Yearofwriteofdate, string PageSize, string UldNumber)
        {
            try
            {

                System.Data.DataSet ds = new DataSet();

                SqlParameter[] Parameters = {
                                             new SqlParameter("@Airport",  AirportCode)
                                            , new SqlParameter("@ULDId",  ULDId)
                                            , new SqlParameter("@Manufactured", Manufactured)
                                            , new SqlParameter("@Yearofwriteofdate",  Yearofwriteofdate)
                                            , new SqlParameter("@UldNo",  UldNumber)
                                            , new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", PageSize), new SqlParameter("@WhereCondition", "")
                                            , new SqlParameter("@OrderBy", "")

                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDStatisticULDUtilization", Parameters);
                DataTable dt1 = ds.Tables[0];
                if (dt1.Rows.Count > 0)
                    UldStockConvertDSToExcel_Success(dt1, 0, "ULD_Statistic_Report");

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        public void UldStockConvertDSToExcel_Success(DataTable dt, int mode, string ExportType)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=" + ExportType + "'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }

        //public void ConvertDSToExcel_Blank(DataTable dt, int mode = 0)
        //{

        //    using (XLWorkbook wb = new XLWorkbook())
        //    {
        //        string date = DateTime.Now.ToString();

        //        //foreach (DataTable dt in ds.Tables)
        //        //{
        //        //Add DataTable as Worksheet.

        //        wb.Worksheets.Add(dt);
        //        //}


        //        //Export the Excel file.
        //        Response.Clear();
        //        Response.Buffer = true;
        //        Response.Charset = "";
        //        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        //        Response.AddHeader("content-disposition", "attachment;filename=Error_RateMaster_'"+date+"'.xlsx");
        //        using (MemoryStream MyMemoryStream = new MemoryStream())
        //        {
        //            wb.SaveAs(MyMemoryStream);
        //            MyMemoryStream.WriteTo(Response.OutputStream);
        //            Response.Flush();
        //            Response.End();
        //        }
        //    }
        //    // ---------------------------------------------------------------

        //}
        //public void ConvertDSToExcel_Duplicate(DataTable dt, int mode = 0)
        //{
        //    string date = DateTime.Now.ToString();
        //    int valid = 0;
        //    if (mode == 0)
        //    {

        //    }
        //    else
        //    {
        //        //ds.Tables[0].TableName = "ErrorRecord_Rate";
        //    }

        //    //if (valid == 0)
        //    //{
        //    using (XLWorkbook wb = new XLWorkbook())
        //    {

        //        //foreach (DataTable dt in ds.Tables)
        //        //{
        //            //Add DataTable as Worksheet.

        //            wb.Worksheets.Add(dt);
        //        //}


        //        //Export the Excel file.
        //        Response.Clear();
        //        Response.Buffer = true;
        //        Response.Charset = "";
        //        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        //        Response.AddHeader("content-disposition", "attachment;filename=Duplicate_RateMaster_'"+date+"'.xlsx");
        //        using (MemoryStream MyMemoryStream = new MemoryStream())
        //        {
        //            wb.SaveAs(MyMemoryStream);
        //            MyMemoryStream.WriteTo(Response.OutputStream);
        //            Response.Flush();
        //            Response.End();
        //        }
        //    }
        //    //}
        //    //  ---------------------------------------------------------------

        //}
        //public void ConvertDSToExcel_Success(DataSet ds)
        //{
        //    Response.Clear();
        //    // Response.Charset = "";
        //    Response.Flush();
        //    string FileName = "SuccessfullySave_Rate" + DateTime.Now + ".xls";
        //    StringWriter strwritter1 = new StringWriter();
        //    HtmlTextWriter htmltextwrtter1 = new HtmlTextWriter(strwritter1);
        //    Response.Cache.SetCacheability(HttpCacheability.NoCache);

        //    Response.ContentType = "application/vnd.ms-excel";
        //    Response.AddHeader("Content-Disposition", "attachment;filename=" + FileName);
        //    System.Web.UI.WebControls.DataGrid dg = new System.Web.UI.WebControls.DataGrid();
        //    dg.GridLines = GridLines.Both;
        //    dg.HeaderStyle.Font.Bold = true;
        //    dg.DataSource = ds.Tables[1];
        //    dg.DataBind();
        //    dg.RenderControl(htmltextwrtter1);
        //    Response.Write(strwritter1.ToString());
        //    Response.End();
        //    //Response.ClearContent();    // Add this line
        //    //Response.ClearHeaders();
        //    Response.BufferOutput = true;
        //}
        /*-----Add By Pankaj Kumar Ishwar for save PDF File on 25-01-2019----*/
        [ValidateInput(false)]
        public string DownloadPdfForLI(string html, string mailto, string subject, string content, string filename)
        {
            try
            {
                string FinalPath = filename + "\\LIReport" + DateTime.Now.ToString("ddMMyyyy_hhmmss") + ".pdf";
                using (MemoryStream stream = new System.IO.MemoryStream())
                {
                    StringReader txtReader = new StringReader(CargoFlash.Cargo.Business.Common.Base64ToString(html));
                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 100f, 0f);
                    HTMLWorker htmlWorker = new HTMLWorker(pdfDoc);
                    PdfWriter writer = PdfWriter.GetInstance(pdfDoc, stream);
                    htmlWorker.StartDocument();
                    pdfDoc.Open();
                    htmlWorker.StartDocument();
                    htmlWorker.Parse(txtReader);
                    htmlWorker.EndDocument();
                    htmlWorker.Close();
                    pdfDoc.Close();
                    Response.Write(pdfDoc);
                    Response.End();
                    System.IO.File.WriteAllBytes(Path.Combine(FinalPath), stream.ToArray());
                    string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                    System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@MailTo",mailto),
                                                                    new System.Data.SqlClient.SqlParameter("@Subject",subject),
                                                                    new System.Data.SqlClient.SqlParameter("@Content",content),
                                                                    new System.Data.SqlClient.SqlParameter("@FileName",FinalPath),
                                                                    new System.Data.SqlClient.SqlParameter("@UsersNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                 };
                    System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "LyingListMailAttachment", Parameters);
                    return ds.ToString();
                }
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                    new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","LyingListMailAttachment"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}




