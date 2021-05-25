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
    public class BookingVarianceReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //
        // GET: /BookingVarianceReport/
        public ActionResult Index()
        {
            return View();
        }
        //, string CheckedStatus
        public ActionResult GetBookingReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string flightNo, string DateType, string AWBSNo, string FlightNo,int IsAutoProcess)
        {
            DataSet ds = new DataSet();
            IEnumerable<BookingVarianceReport> CommodityList = null;
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
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@DateType", DateType),
                                                                   new System.Data.SqlClient.SqlParameter("@AWBSNo", AWBSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo", FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@IsAutoProcess", IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spBookingvarianceReport_GetRecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new BookingVarianceReport
                   {
                       SNo = Convert.ToInt32(e["SNo"]),
                       AWBNo = e["AWBNo"].ToString().ToUpper(),
                       BookingType = e["BookingType"].ToString().ToUpper(),
                       AWBDATE = e["AWBDATE"].ToString().ToUpper(),
                       FlightNo = e["FlightNo"].ToString().ToUpper(),
                       FlightDate = Convert.ToDateTime(e["FlightDate"]).ToString("dd-MMM-yyyy"),
                       BookingDate = Convert.ToDateTime(e["BookingDate"]).ToString("dd-MMM-yyyy"),
                       AccountName = e["AccountName"].ToString().ToUpper(),
                       ORIGIN = e["Origin"].ToString().ToUpper(),
                       DESTINATION = e["Destination"].ToString().ToUpper(),
                       CommodityCode = e["CommodityCode"].ToString().ToUpper(),
                       ProductName = e["ProductName"].ToString().ToUpper(),
                       BookingPieces = e["BookingPieces"].ToString().ToUpper() + '/' + e["BookingGrossWeight"].ToString().ToUpper(),
                       ExecutedPieces = e["ExecutedPieces"].ToString().ToUpper() + '/' + e["ExecutedGrossWeight"].ToString().ToUpper(),
                       AcceptedPieces = e["AcceptedPieces"].ToString().ToUpper() + '/' + e["AcceptedGrossWeight"].ToString().ToUpper(),
                       //TotalChargeableWeight = e["ChargeableWeight"].ToString().ToUpper(),
                       BookingStatus = e["Status"].ToString().ToUpper(),
                       //BookingGrossWeight = e["BookingGrossWeight"].ToString().ToUpper(),
                       //AcceptedGrossWeight = e["AcceptedGrossWeight"].ToString().ToUpper(),
                       //ExecutedGrossWeight = e["ExecutedGrossWeight"].ToString().ToUpper(),
                       BookingVolume = e["BookingVolume"].ToString().ToUpper(),
                       ExecutedVolume = e["ExecutedVolume"].ToString().ToUpper(),
                       AcceptedVolume = e["AcceptedVolume"].ToString().ToUpper(),
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spBookingvarianceReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void GetBookingReportForExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string DateType, string AWBSNo, string FlightNo,int IsAutoProcess)
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
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048540),
                                                                   new System.Data.SqlClient.SqlParameter("@DateType", DateType),
                                                                   new System.Data.SqlClient.SqlParameter("@AWBSNo", AWBSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo", FlightNo),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess", IsAutoProcess),
                                                                      new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
            try
            {
                //spBookingvarianceReport_GetRecordForExcel
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spBookingvarianceReport_GetRecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spBookingvarianceReport_GetRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=BookingVSAcceptedReport_'" + date + "'.xlsx");
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