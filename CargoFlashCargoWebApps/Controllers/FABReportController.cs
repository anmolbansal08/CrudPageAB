using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Data;

using CargoFlash.Cargo.Model;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using System.IO;
using System.Collections;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlashCargoWebApps.Controllers
{
    public class FABReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: FABReport
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetFABReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate)
        {
            DataSet ds = new DataSet();
            IEnumerable<FABReport> CommodityList = null;
            try
            {
                DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);



                var todate_result = todt.ToString("yyyy-MM-dd");
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                   new System.Data.SqlClient.SqlParameter("@AgentSno",Convert.ToInt32(Agentsno)),
                                                                   new System.Data.SqlClient.SqlParameter("@productSno",Convert.ToInt32(productSno)),
                                                                   new System.Data.SqlClient.SqlParameter("@CommoditySno",Convert.ToInt32(CommoditySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spFABReport_GetRecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new FABReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),                        
                        StationName = e["StationName"].ToString().ToUpper(),
                        TotalAcceptedNoOfShipts = e["TotalAcceptedNoOfShipts"].ToString().ToUpper(),
                        TotalAcceptedPCS = e["TotalAcceptedPCS"].ToString().ToUpper(),
                        TotalAcceptedGWt = e["TotalAcceptedGWt"].ToString().ToUpper(),
                        TotalAcceptedChwt = e["TotalAcceptedChwt"].ToString().ToUpper(),
                        TotalAcceptedVolwt = e["TotalAcceptedVolwt"].ToString().ToUpper(),
                        UpliftedNoOfShipts = e["UpliftedNoOfShipts"].ToString().ToUpper(),
                        UpliftedPCS = e["UpliftedPCS"].ToString().ToUpper(),
                        UpliftedGWt = e["UpliftedGWt"].ToString().ToUpper(),
                        UpliftedChwt = e["UpliftedChwt"].ToString().ToUpper(),
                        UpliftedVolwt = e["UpliftedVolwt"].ToString().ToUpper(),
                        TotalFlownasbookedNoOfShipts = e["TotalFlownasbookedNoOfShipts"].ToString().ToUpper(),
                        TotalFlownasbookedChwt = e["TotalFlownasbookedChwt"].ToString().ToUpper(),
                        TotalFlownasbookedFABPercentage = e["TotalFlownasbookedFABPercentage"].ToString().ToUpper(),
                        OffloadNoOfShipts = e["OffloadNoOfShipts"].ToString().ToUpper(),
                        OffloadChwt = e["OffloadChwt"].ToString().ToUpper(),
                        OffloadOLPercentageNoOfShipts = e["OffloadOLPercentageNoOfShipts"].ToString().ToUpper(),
                        OffloadOLPercentageBasedOnChwt = e["OffloadOLPercentageBasedOnChwt"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFABReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void GetFABReportForExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string DateType, string AWBSNo, string FlightNo)
        {


            DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            var fromdate_result = fromdt.ToString("yyyy-MM-dd");

            DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            DataSet ds = new DataSet();

            var todate_result = todt.ToString("yyyy-MM-dd");
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                   new System.Data.SqlClient.SqlParameter("@AgentSno",Convert.ToInt32(Agentsno)),
                                                                   new System.Data.SqlClient.SqlParameter("@productSno",Convert.ToInt32(productSno)),
                                                                   new System.Data.SqlClient.SqlParameter("@CommoditySno",Convert.ToInt32(CommoditySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", 1),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048540)
                                                              };
            try
            {
                //spFABReport_GetRecordForExcel
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spFABReport_GetRecord", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFABReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=FABReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }


        }
    }
}