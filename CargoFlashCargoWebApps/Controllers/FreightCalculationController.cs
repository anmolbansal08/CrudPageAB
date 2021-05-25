using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class FreightCalculationController : Controller
    {
        // GET: FreightCalculation
        public ActionResult Index() { 
            return View();
        }
        [HttpPost]
       public ActionResult FreightCalculation([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, FreightCalculation Model)
        {
            try
            {
                List<FreightCalculationResponce> obj = new List<FreightCalculationResponce>();
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.FreightCalculation>(filter);

                System.Data.SqlClient.SqlParameter[] Parameters = {
                          new SqlParameter("@FromDate",Model.FromDate),
                          new SqlParameter("@ToDate",Model.ToDate),
                          new SqlParameter ("@PageNo", request.Page),
                          new SqlParameter("@PageSize",request.PageSize),
                          new SqlParameter ("@AwbNO", Model.AwbNO),
                       };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_Freight_Calculation", Parameters);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    var DailyDepartedFlightReportReportList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.FreightCalculationResponce


                    {
                        AwbNO = Convert.ToString(e["AwbNO"]).ToUpper(),
                        SNo = Convert.ToString(e["SNo"]).ToUpper(),
                         FlightNO = Convert.ToString(e["FlightNO"]).ToUpper(),
                        FlightDate = Convert.ToString(e["FlightDate"]).ToUpper(),
                        OriginAirportCode = Convert.ToString(e["OriginAirportCode"]).ToUpper(),
                        Remarks = Convert.ToString(e["Remarks"]).ToUpper(),

                    });

                    ds.Dispose();
                    return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                    {
                        Data = DailyDepartedFlightReportReportList.AsQueryable().ToList(),

                        Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                    {
                        Data = obj,
                        Total = 0
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                        new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                        new System.Data.SqlClient.SqlParameter("@ProcName","sp_Freight_Calculation"),
                                                                        new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)
                                                                        (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                        };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, FreightCalculation Model)

        {
            try
            {

                //string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                // string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.FreightCalculation>(filter);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                          new SqlParameter("@FromDate",Model.FromDate),
                          new SqlParameter("@ToDate",Model.ToDate),
                          new SqlParameter ("@PageNo", request.Page),
                          new SqlParameter("@PageSize",request.PageSize),
                          new SqlParameter ("@AwbNO", Model.AwbNO),
                       };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_Freight_Calculation", Parameters);


                DataTable dt1 = ds.Tables[0];
                // dt1.Columns.Remove("Aircraft1");
                //dt1.Columns.Remove("Agent1");
                //
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetBillingRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
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
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=FreightCalculation'" + date + "'.xlsx");
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