using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class POMailReportController : Controller
    {

        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //
        // GET: /POMailReport/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetPOMailReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode,string OriginCitySno, string DestinationCitySno, string fromdate, string todate,string CNNo, string CN38No, string CN47No, string DateType)
        {
            DataSet ds = new DataSet();
            IEnumerable<POMailReport> CommodityList = null;
            try
            {
                DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var todate_result = todt.ToString("yyyy-MM-dd");




                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@CNNo", CNNo),
                                                                   new System.Data.SqlClient.SqlParameter("@CN38No", CN38No),
                                                                   new System.Data.SqlClient.SqlParameter("@CN47No", CN47No),
                                                                   new System.Data.SqlClient.SqlParameter("@DateType", DateType),
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "POMailReport_GetRecord", Parameters);

                CommodityList = ds.Tables[0].AsEnumerable().Select(e => new POMailReport
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CN38No = e["CN38No"].ToString().ToUpper(),
                    //CN47No = e["CN47No"].ToString().ToUpper(),
                    ORIGIN = e["Origin"].ToString().ToUpper(),
                    DESTINATION = e["Destination"].ToString().ToUpper(),
                    BookedPieces = e["BOOKEDPCS"].ToString().ToUpper(),
                    AcceptedPieces = e["ACCEPTEDPCS"].ToString().ToUpper(),
                    BookedWeight = e["BOOKEDWT"].ToString().ToUpper(),
                    AcceptedWeight = e["ACCEPTEDWT"].ToString().ToUpper(),
                    BookingStatus = e["BookingStatus"].ToString().ToUpper(),
                    AccountName = e["AgentName"].ToString().ToUpper(),
                    ParticipantID = e["ParticipantID"].ToString().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    DNNo = e["DNNO"].ToString().ToUpper(),
                    BookingDate = e["BookingDate"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                });
                ds.Dispose();

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","POMailReport_GetRecord"),
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

        public void GetPOMailReportForExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string CN38No, string CN47No, string DateType)
        {

            DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            var fromdate_result = fromdt.ToString("yyyy-MM-dd");

            DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            var todate_result = todt.ToString("yyyy-MM-dd");


            DataSet ds = new DataSet();

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                   //new System.Data.SqlClient.SqlParameter("@FtFromDate",Ftfromdate),
                                                                   //new System.Data.SqlClient.SqlParameter("@Fttodate",Fttodate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", 1), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048540),
                                                                   new System.Data.SqlClient.SqlParameter("@CN38No", CN38No),
                                                                   new System.Data.SqlClient.SqlParameter("@CN47No", CN47No),
                                                                   new System.Data.SqlClient.SqlParameter("@DateType", DateType),
                                                              };

            try
            {
                //spBookingvarianceReport_GetRecordForExcel
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "POMailReport_GetRecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","POMailReport_GetRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=POMailReport_'" + date + "'.xlsx");
                using(MemoryStream MyMemoryStream = new MemoryStream())
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