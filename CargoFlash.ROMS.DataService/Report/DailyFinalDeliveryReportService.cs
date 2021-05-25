using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;
using ClosedXML.Excel;
using System.IO;
using System.Web;

namespace CargoFlash.Cargo.DataService.Report
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DailyFinalDeliveryReportService : SignatureAuthenticate, IDailyFinalDeliveryReportService
    {

        public DataSourceResult GetDailyFinalDeliveryReport(String airportsno, String FromDate, String ToDate, int page, int pageSize)
        {

            try
            {
                IEnumerable<DailyFinalDeliveryReport> CommodityList = null;
                String procname = string.Empty;
                procname = "spDailyFinalDeliveryReport";
                System.Data.DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                                    //new  SqlParameter("@AirlineSno",Convert.ToInt32(airlinesno)),
                                                      new  SqlParameter("@AirportSno",Convert.ToInt32(airportsno)),
                                                      new SqlParameter("@FromDate", Convert.ToDateTime(FromDate.Replace('_', ':'))),
                                            new SqlParameter("@ToDate",Convert.ToDateTime(ToDate.Replace('_', ':'))),                                new SqlParameter("@PageNo",page),
                                            new SqlParameter("@PageSize",pageSize),
                                            };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new DailyFinalDeliveryReport
                    {
                        SNo =Convert.ToInt32(e["SNo"].ToString().ToUpper()),
                        MASTER_AWB = e["MASTER_AWB"].ToString().ToUpper(),
                        TANGGAL = e["TANGGAL"].ToString().ToUpper(),
                        NO_DB = e["NO_DB"].ToString().ToUpper(),
                        H_AWBNo = e["H_AWBNo"].ToString().ToUpper(),
                        KOLI = e["KOLI"].ToString().ToUpper(),
                        KILO = e["KILO"].ToString().ToUpper(),
                        VOL = e["VOL"].ToString().ToUpper(),
                        NOP_IBP = e["NOP_IBP"].ToString().ToUpper(),
                        POS = e["POS"].ToString().ToUpper(),
                        BC1_1 = e["BC1_1"].ToString().ToUpper(),
                        ConsigneeName = e["ConsigneeName"].ToString().ToUpper(),
                        No_SPPB = e["No_SPPB"].ToString().ToUpper(),
                        NO_DAFT = e["NO_DAFT"].ToString().ToUpper(),
                        TGL_SPPB = e["TGL_SPPB"].ToString().ToUpper(),
                        TGL_DAFT = e["TGL_DAFT"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                }



                return new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<DailyFinalDeliveryReport>().ToList<DailyFinalDeliveryReport>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                };


            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyFinalDeliveryReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void GetDailyFinalDeliveryReport_Excel(String airportsno, String FromDate, String ToDate, int page, int pageSize)
        {
            try
            {
                IEnumerable<DailyFinalDeliveryReport> CommodityList = null;
                String procname = string.Empty;
                procname = "spDailyFinalDeliveryReport";
                System.Data.DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                                    //new  SqlParameter("@AirlineSno",Convert.ToInt32(airlinesno)),
                                                      new  SqlParameter("@AirportSno",Convert.ToInt32(airportsno)),
                                                      new SqlParameter("@FromDate", Convert.ToDateTime(FromDate.Replace('_', ':'))),
                                            new SqlParameter("@ToDate",Convert.ToDateTime(ToDate.Replace('_', ':'))),                                new SqlParameter("@PageNo",page),
                                            new SqlParameter("@PageSize",pageSize),
                                            };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                DataTable dt = ds.Tables[0];
                dt.AcceptChanges();
                ConvertDSToExcel_Success(dt, 0);


            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyFinalDeliveryReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.Buffer = true;
                HttpContext.Current.Response.Charset = "";
                HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
               // HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=Rate'" + date + "'.xlsx");
               HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=DailyFinalReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
                    HttpContext.Current.Response.Flush();
                   // HttpContext.Current.Response.End();
                    //  Response.ClearHeaders();  
                }

            }
        }

     
    }
}
