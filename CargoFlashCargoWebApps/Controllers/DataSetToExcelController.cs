using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using ClosedXML.Excel;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Common;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlashCargoWebApps.Controllers
{
    public class DataSetToExcelController : Controller
    {
        //
        // GET: /DataSetToExcel/
        public ActionResult Index()
        {
            return View();
        }
        // Changes by Vipin Kumar
        //public void DataSetToExcelFile(int OfficeSNo, int AccountSNo, string ValidFrom, string ValidTo)
        public void DataSetToExcelFile(DataSetToExcel dataSetToExcelFile)
        // Ends
        {
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            string date = DateTime.Now.ToString();
            System.Data.SqlClient.SqlParameter[] parameters = { new SqlParameter("@OfficeSNo",dataSetToExcelFile.OfficeSNo),
                                                                new SqlParameter("@AccountSNo", dataSetToExcelFile.AccountSNo),
                                                                new SqlParameter("@ValidFrom", dataSetToExcelFile.ValidFrom),
                                                                new SqlParameter("@ValidTo", dataSetToExcelFile.ValidTo),
                                                                new SqlParameter("@AirlineSNo", dataSetToExcelFile.AirlineSNo),
                                                                new SqlParameter("@CurrencySNo", dataSetToExcelFile.CurrencySNo),
                                                                new SqlParameter("@TransactionMode", dataSetToExcelFile.TransactionMode),
                                                                new SqlParameter ("@BgType",dataSetToExcelFile.BgType),
                                                                new SqlParameter("@PageNo", 1),
                                                                new SqlParameter("@PageSize", 7000),
                                                                new SqlParameter("@IsAutoProcess",dataSetToExcelFile.IsAutoProcess),
                                                              };
            string proc = "";
            string fileName = "";
            if (dataSetToExcelFile.IsBGREport == 0)
            {
                //proc = "sp_GetAllCreditlimitRecordRecord";
                proc = "GetListCreditLimitReport";
                fileName = "CreditLimitReport_";
            }
            else
            { 
                proc = "CreditLimitBGReport";
                fileName = "CreditLimitBGReport_";
            }

            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, proc, parameters);
            DataTable dt = new DataTable();
            dt = ds.Tables[0];
            dt.Columns.RemoveAt(0);
          
            if (dataSetToExcelFile.Env != "GA" && dataSetToExcelFile.IsBGREport == 0) {
                dt.Columns.RemoveAt(0);
            }
            using (XLWorkbook wb = new XLWorkbook())
            {

                //wb.Worksheets.Add(dt);
                ////    IXLWorksheet wc = wb.Worksheet(1);
                ////    var StarrRange = wc.FirstCellUsed();
                ////    var EndRange = wc.LastCellUsed();
                ////    var Range = wc.Range(StarrRange.Address, EndRange.Address);
                ////  //  Range.Column(1).Style.NumberFormat.Format = "@";
                ////    Range.Style.NumberFormat.Format = "@";
                //////    Response.Write("<style> TD { mso-number-format:\\@; } </style>");  // added by arman ali 2017-10-20
                //Response.Clear();
                //Response.Buffer = true;
                //Response.Charset = "";

                //Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                //Response.AddHeader("content-disposition", "attachment;filename=CreditLimitReport_'" + date + "'.xlsx");
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename='"+ fileName+"''" + date + "'.xlsx");

                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(System.Web.HttpContext.Current.Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }
        //=============================
        public void ExportToExcelAll(string ReportNameSNo, string AirlineSNo, string Month, string Year, string type, string EIType, string ReportType)
        {
            string ProcName = string.Empty;
            SqlParameter[] Parameters =
                {
                    new SqlParameter("@PageNo", 1),
                    new SqlParameter("@PageSize", 1048576),
                    new SqlParameter("@WhereCondition", ""), 
                    new SqlParameter("@OrderBy", ""),
                    new SqlParameter("@Type", EIType),
                    new SqlParameter("@ReportType", type),
                    new SqlParameter("@ReportNameSNo", ReportNameSNo), 
                    new SqlParameter("@AirlineSNo", AirlineSNo),
                    new SqlParameter("@Month", Month), 
                    new SqlParameter("@Year", Year) 
                };

            //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReport_CommonExportImportReportDetails", Parameters);
            try
            {

                if (ReportType == "S")
                    ProcName = "spReport_CommonExportImportReport";
                else
                    ProcName = "spReport_CommonExportImportReportDetails";


                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, ProcName, Parameters);
                DataTable dt1 = ds.Tables[0];
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName",ProcName),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }
        public void ConvertDSToExcel_Success(DataTable dt)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=StandardOperationalReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(System.Web.HttpContext.Current.Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }
        //=============================Export To Excel All For UnCleared Shipment
        public void ExportToExcelAllForUnClearedShipment(string AirlineSNo, string AirportSNo, string Type, string Agent,string FromDt, string ToDt)
        {


            SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", FromDt),
                                            new SqlParameter("@ToDt", ToDt),
                                             new SqlParameter("@Airline",AirlineSNo),
                                              new SqlParameter("@Airport",AirportSNo),
                                                new SqlParameter("@Type",Type),
                                                  new SqlParameter("@Agent",Agent),
                                               new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),

                                               new SqlParameter("@PageNo", 1),
                                             new SqlParameter("@PageSize",1048576),        
                                       
                                        };

            //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReport_CommonExportImportReportDetails", Parameters);
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetUnclearedShipment", Parameters);
                DataTable dt1 = ds.Tables[0];
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcelUnclearedShipment(dt1);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetUnclearedShipment"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }
        public void ConvertDSToExcelUnclearedShipment(DataTable dt)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=UnclearedShipmentReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(System.Web.HttpContext.Current.Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }
        /*--------------------Save Release Note call by Pankaj Kumar Ishwar----------------------*/
        [HttpPost]
        public string SaveReleaseNote(ReleaseNoteRequestModel Model)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Author", Model.Author),
                                             new SqlParameter("@Major", Model.Major),
                                             new SqlParameter("@Minor", Model.Minor),
                                             new SqlParameter("@Build", Model.Build),
                                             new SqlParameter("@ReleaseDate", Model.ReleaseDate),
                                             new SqlParameter("@ReleaseDescription", Model.Description),
                                             new SqlParameter("@Usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                int ret = (int)CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteScalar(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, "Usp_CreateReleaseNotes", Parameters);

                return ret.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /*--------------------Update Release Note call by Pankaj Kumar Ishwar----------------------*/
        public string UpdateReleaseNote(ReleaseNoteRequestModel Model, List<ReleaseNote> ReleaseNote)
        {
            try
            {
                DataSet ds = new DataSet();
                DataTable dtUpdateReleaseNotes = CollectionHelper.ConvertTo(ReleaseNote, "SNo,Author,Major,Minor,Build,ReleaseDate,ReleaseDescription,Description,Version,UserSNo");
                DataTable dt = new DataTable();
                dt.Clear();
                dt.Columns.Add("Module");
                dt.Columns.Add("ModuleDescription");
                dt.Columns.Add("TFSId");
                dt.Columns.Add("ModuleOwner");

                for (int i = 0; i < dtUpdateReleaseNotes.Rows.Count; i++)
                {
                    DataRow dr = dt.NewRow();
                    dr = dtUpdateReleaseNotes.Rows[i];
                    dt.ImportRow(dr);
                }
                SqlParameter[] Parameters = {
                                             new SqlParameter("@Author", Model.Author),
                                             new SqlParameter("@Major", Model.Major),
                                             new SqlParameter("@Minor", Model.Minor),
                                             new SqlParameter("@Build", Model.Build),
                                             new SqlParameter("@ReleaseDate", Model.ReleaseDate),
                                             new SqlParameter("@ReleaseDescription", Model.Description),
                                             new SqlParameter("@UploadReleaseNoteExcel",dt),
                                             new SqlParameter("@SNo",ReleaseNote[0].SNo)
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Usp_UpdateReleaseNotes", Parameters);
                dt.Clear();

                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        //=======================================================Akash
        public string GetAirlineCode()
        {
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spGetAirlineCodeForTracking");
                return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string GetCityDestination()
        {
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spGetCityDestinationForSchedule");
                return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


    }
}