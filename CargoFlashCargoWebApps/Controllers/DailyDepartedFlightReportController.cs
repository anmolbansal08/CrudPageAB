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
    public class DailyDepartedFlightReportController : Controller
    {
        private object connectionString=null;

        // GET: DailyDepartedFlightReport
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetDailyDepartedFlightReportSummary([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyDepartedFlightReport Model)
        {
            try
            {
                 List<DailyDepartedFlightReportResponse> obj = new List<DailyDepartedFlightReportResponse>();
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.DailyDepartedFlightReport>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new SqlParameter("@FromDate",Model.FromDate),
                                                                    new SqlParameter("@ToDate",Model.ToDate),
                                                                    new SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new SqlParameter("@Origin", Model.Origin),
                                                                    new SqlParameter("@Destination", Model.Destination),
                                                                    new SqlParameter("@PageSize",request.PageSize),
                                                                    new SqlParameter("@PageNo", request.Page),



            };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spBuildUp_Man", Parameters);

                if (ds.Tables[2].Rows.Count > 0)
                {
                var DailyDepartedFlightReportReportList = ds.Tables[2].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.DailyDepartedFlightReportResponse


                {
                    SNo = Convert.ToString(e["SNo"]).ToUpper(),
                    // FromDate = e["FromDate"].ToString().ToUpper(),
                    FLIGHT_NO = Convert.ToString(e["FLIGHT_NO"]).ToUpper(),
                    //FLIGHT_DATE = e["FLIGHT_DATE"].ToString().ToUpper(),
                    FLIGHT_DATE = Convert.ToString(e["FLIGHT_DATE"]).ToUpper(),
                    Flight_OD = Convert.ToString(e["Flight_OD"]).ToUpper(),
                    ULD_Count = Convert.ToString(e["ULD_Count"]).ToUpper(),
                    Total_AWB = Convert.ToString(e["Total_AWB"]).ToUpper(),
                    Total_Awb_Pieces = Convert.ToString(e["Total_Awb_Pieces"]).ToUpper(),
                    Total_Awb_Weight = Convert.ToString(e["Total_Awb_Weight"]).ToUpper(),
                    UserID=Convert.ToString(e["UserID"]).ToUpper(),


                });

                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = DailyDepartedFlightReportReportList.AsQueryable().ToList(),
                     Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[3].Rows[0][0].ToString()) : 0
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
                                                                        new System.Data.SqlClient.SqlParameter("@ProcName","spBuildUp_Man"),
                                                                        new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)
                                                                        (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                        };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public ActionResult GetDailyDepartedFlightReportDetails([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyDepartedFlightReport Model)
        {
            try
            {
                List<DailyDepartedFlightReportResponse> obj = new List<DailyDepartedFlightReportResponse>();
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.DailyDepartedFlightReport>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new SqlParameter("@FromDate",Model.FromDate),
                                                                    new SqlParameter("@ToDate",Model.ToDate),
                                                                    new SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new SqlParameter("@Origin",Model.Origin),
                                                                    new SqlParameter("@Destination",Model.Destination),
                                                                    new SqlParameter("@PageSize", request.PageSize),
                                                                    new SqlParameter("@PageNo", request.Page),
                                                                    
                                                                    

            };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spBuildUp_Man", Parameters);
                if (ds.Tables[0].Rows.Count > 0)           
                {
                    var DailyDepartedFlightReportReportList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.DailyDepartedFlightReportResponse
                    {
                        //SNo = e["SNo"].ToString().ToUpper(),
                        SNo=Convert.ToString(e["SNo"]).ToUpper(),
                        //DATETIME_UPDATED = e["DATETIME_UPDATED"].ToString().ToUpper(),
                        // DATETIME_UPDATED=Convert.ToString(e["DATETIME_UPDATED"]).ToUpper(),
                        FLIGHT_NO = Convert.ToString(e["FLIGHT_NO"]).ToUpper(),
                        FLIGHT_DATE = Convert.ToString(e["FLIGHT_DATE"]).ToUpper(),
                        Flight_OD = Convert.ToString(e["Flight_OD"]).ToUpper(),
                        AWB_OD = Convert.ToString(e["AWB_OD"]).ToUpper(),
                       // BOARD_POINT = Convert.ToString(e["BOARD_POINT"]).ToUpper(),
                        //OFF_POINT = Convert.ToString(e["OFF_POINT"]).ToUpper(),
                        //AC_TYPE = Convert.ToString(e["AC_TYPE"]).ToUpper(),
                        ULD_NO = Convert.ToString(e["ULD_NO"]).ToUpper(),
                        AWB_NO = Convert.ToString(e["AWB_NO"]).ToUpper(),
                        awb_pieces = Convert.ToString(e["awb_pieces"]).ToUpper(),
                        GRS_WT = Convert.ToString(e["GRS_WT"]).ToUpper(),
                        //VOL = Convert.ToString(e["VOL"]).ToUpper(),
                       no_of_ship = Convert.ToString(e["LoadedPieces"]).ToUpper(),
                        SHC = Convert.ToString(e["SHC"]).ToUpper(),
                        UserID=Convert.ToString(e["UserID"]).ToUpper(),
                        awb_weight = Convert.ToString(e["awb_weight"]).ToUpper(),

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
                                                                        new System.Data.SqlClient.SqlParameter("@ProcName","spBuildUp_Man"),
                                                                        new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)
                                                                        (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                        };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public void ExportToExcel_Summary([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyDepartedFlightReport Model)

        {
            try
            {

                //string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                // string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.DailyDepartedFlightReport>(filter);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new SqlParameter("@FromDate",Model.FromDate),
                                                                    new SqlParameter("@ToDate",Model.ToDate),
                                                                    new SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new SqlParameter("@Origin",Model.Origin),
                                                                    new SqlParameter("@Destination",Model.Destination),
                                                                    new SqlParameter ("@PageSize", request.PageSize),
                                                                    new SqlParameter("@PageNo", request.Page),

            };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spBuildUp_Man", Parameters);


                DataTable dt1 = ds.Tables[2];
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



        public void ExportToExcel_Details([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyDepartedFlightReport Model)

        {
            try
            {

                //string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                // string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.DailyDepartedFlightReport>(filter);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new SqlParameter("@FromDate",Model.FromDate),
                                                                    new SqlParameter("@ToDate",Model.ToDate),
                                                                    new SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new SqlParameter("@Origin",Model.Origin),
                                                                    new SqlParameter("Destination",Model.Destination),
                                                                    new SqlParameter("@PageSize", request.PageSize),
                                                                    new SqlParameter("@PageNo", request.Page),


            };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spBuildUp_Man", Parameters);


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
                Response.AddHeader("content-disposition", "attachment;filename=DailyFlightReport'" + date + "'.xlsx");
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