using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class EmbargoReportController : Controller
    {
        //
        // GET: /EmbargoReport/


        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetSoftEmbargoReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string SHCSNo, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string AWBNumber, string ReferenceNumber, string DateType)
        {
            DataSet ds = new DataSet();
            IEnumerable<EmbargoReport> CommodityList = null;
            try
            {
                DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var todate_result = todt.ToString("yyyy-MM-dd");




                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                   new System.Data.SqlClient.SqlParameter("@SHCSNo",Convert.ToInt32(SHCSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@productSno",Convert.ToInt32(productSno)),
                                                                   new System.Data.SqlClient.SqlParameter("@CommoditySno",Convert.ToInt32(CommoditySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                   //new System.Data.SqlClient.SqlParameter("@FtFromDate",Ftfromdate),
                                                                   //new System.Data.SqlClient.SqlParameter("@Fttodate",Fttodate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@AWBNumber", AWBNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@ReferenceNumber", ReferenceNumber),
                                                                     new System.Data.SqlClient.SqlParameter("@DateType", DateType),
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "SoftEmbargoReport_GetRecord", Parameters);

                CommodityList = ds.Tables[0].AsEnumerable().Select(e => new EmbargoReport
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ReferenceNumber = e["ReferenceNumber"].ToString().ToUpper(),
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    BookingDate = e["BookingDate"].ToString().ToUpper(),
                    ORIGIN = e["Origin"].ToString().ToUpper(),
                    DESTINATION = e["Destination"].ToString().ToUpper(),
                    NatureOfGoods = e["NatureOfGoods"].ToString().ToUpper(),
                    SHC = e["SHC"].ToString().ToUpper(),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    COMMODITYCODE = e["CommodityCode"].ToString().ToUpper(),
                    BookedPieces = e["BookingPieces"].ToString().ToUpper() + '/' + e["BookingGrossWeight"].ToString().ToUpper(),
                    ExecutedPieces = e["ExecutedPieces"].ToString().ToUpper() + '/' + e["ExecutedGrossWeight"].ToString().ToUpper(),
                    BookingStatus = e["BookingStatus"].ToString().ToUpper(),
                    AccountName = e["AgentName"].ToString().ToUpper(),
                    ParticipantID = e["ParticipantID"].ToString().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    SoftEmbargo = e["SoftEmbargo"].ToString().ToUpper(),
                    
                });
                ds.Dispose();

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SoftEmbargoReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
            }
            return Json(new DataSourceResult
            {
                Data = CommodityList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            }, JsonRequestBehavior.AllowGet);

        }

        public void GetSoftEmbargoReportForExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string SHCSNo, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string AWBNumber, string ReferenceNumber, string DateType)
        {

             DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

              DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
              var todate_result = todt.ToString("yyyy-MM-dd");

                     
            DataSet ds = new DataSet();

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                   new System.Data.SqlClient.SqlParameter("@SHCSNo",Convert.ToInt32(SHCSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@productSno",Convert.ToInt32(productSno)),
                                                                   new System.Data.SqlClient.SqlParameter("@CommoditySno",Convert.ToInt32(CommoditySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                   //new System.Data.SqlClient.SqlParameter("@FtFromDate",Ftfromdate),
                                                                   //new System.Data.SqlClient.SqlParameter("@Fttodate",Fttodate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", 1), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048540),
                                                                   new System.Data.SqlClient.SqlParameter("@AWBNumber", AWBNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@ReferenceNumber", ReferenceNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@DateType", DateType),
                                                              };

            try
            {
                //spBookingvarianceReport_GetRecordForExcel
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "SoftEmbargoReport_GetRecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SoftEmbargoReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
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
                Response.AddHeader("content-disposition", "attachment;filename=SoftEmbargoReport_'" + date + "'.xlsx");
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