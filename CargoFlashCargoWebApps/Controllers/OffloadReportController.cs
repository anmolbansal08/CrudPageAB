using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data.SqlClient;
using System.IO;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlashCargoWebApps.Controllers
{
    public class OffloadReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;


        // GET: OffloadReport
        public ActionResult OffloadReport()
        {
            return View();
        }



        // public string GetSpecialCargoDetail(SpecialCargoDetail model)
        public ActionResult GetOffloadDetail([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, OffloadReportDetail model)
        {
            try
            {
                List<OffloadReportResponse> obj = new List<OffloadReportResponse>();
               
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@Origin",model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Dest",model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@From",model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@To",model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                     new System.Data.SqlClient.SqlParameter("@PageSize",request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_OffloadReport", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    var DailyDepartedFlightReportReportList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.OffloadReportResponse
                    {
                        SNo = Convert.ToString(e["SNo"]).ToUpper(),
                        Date = Convert.ToString(e["Date"]).ToUpper(),
                        AWBNo = Convert.ToString(e["AWBNo"]).ToUpper(),
                        FlightNo= Convert.ToString(e["FlightNo"]).ToUpper(),
                        TailNo = Convert.ToString(e["TailNo"]).ToUpper(),
                        STD = Convert.ToString(e["STD"]).ToUpper(),                       
                        Origin = Convert.ToString(e["Origin"]).ToUpper(),
                        Destination = Convert.ToString(e["Destination"]).ToUpper(),
                        Plannedpieces= Convert.ToString(e["Plannedpieces"]).ToUpper(),
                        PlannedGrossWeight= Convert.ToString(e["PlannedGrossWeight"]).ToUpper(),
                        PlannedChargeableWeight= Convert.ToString(e["PlannedChargeableWeight"]).ToUpper(),
                        Upliftedpieces= Convert.ToString(e["Upliftedpieces"]).ToUpper(),
                        UpliftedGrossWeight= Convert.ToString(e["UpliftedGrossWeight"]).ToUpper(),
                        UpliftedChargeableWeight= Convert.ToString(e["UpliftedChargeableWeight"]).ToUpper(),
                        OffloadedPieces= Convert.ToString(e["OffloadedPieces"]).ToUpper(),
                        OffloadedGrossWeight= Convert.ToString(e["OffloadedGrossWeight"]).ToUpper(),
                        OffloadedChargeableWeight= Convert.ToString(e["OffloadedChargeableWeight"]).ToUpper(),
                   
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_OffloadReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public void ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, SpecialCargoDetail Model)

        {
            try
            {

                //string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                // string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.SpecialCargoDetail>(filter);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new SqlParameter("@From",Model.FromDate),
                                                                    new SqlParameter("@To",Model.ToDate),
                                                                    new SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new SqlParameter("@Origin",Model.OriginSNo),
                                                                    new SqlParameter("@Dest",Model.DestinationSNo),
                                                                    new SqlParameter ("@PageSize", request.PageSize),
                                                                    new SqlParameter("@PageNo", request.Page),

            };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_OffloadReport", Parameters);


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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_OffloadReport"),
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
                Response.AddHeader("content-disposition", "attachment;filename=OffloadReport'" + date + "'.xlsx");
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