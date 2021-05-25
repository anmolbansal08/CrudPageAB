using System;
using System.Web.Mvc;
using System.Data;
using CargoFlash.Cargo.Model.ULD.Stock;
using CargoFlash.Cargo.Model.Reservation;
using CargoFlash.Cargo.Model.Report;
using Kendo.Mvc.UI;
using CargoFlash.Cargo.Model.Export;
using System.Collections.Generic;
using System.Linq;
using Kendo.Mvc.Extensions;
using System.Web.UI.WebControls;
using System.IO;
using ClosedXML.Excel;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.Cargo.Model.Accounts;

namespace CargoFlashCargoWebApps.Controllers
{
    public class ReportsController : Controller
    {
        public bool ReportGenerateOnBlob(string Apps)
        {
            bool Res = false;
            try
            {
                System.Data.SqlClient.SqlParameter Parameters = new System.Data.SqlClient.SqlParameter("@Apps", Apps);

                Res = (bool)SqlHelper.ExecuteScalar(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spGet_ReportGenenrateOnBlob", Parameters);

                return Res;
            }
            catch (Exception ex)
            {

                throw ex;

                //DataSet dsError;
                //System.Data.SqlClient.SqlParameter[] ParametersError = {
                //                                                  new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                //                                                   new System.Data.SqlClient.SqlParameter("@ProcName","spGet_ReportGenenrateOnBlob"),
                //                                                  new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                //                                             };
                //dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                //return false;
            }

        }


        // GET: Reports
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult BillingReport()
        {

            return View();
        }
        [HttpPost]

        public ActionResult GetBillingDetail([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, BillingReport Model)

        {
            try
            {

                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.BillingReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {

                new System.Data.SqlClient.SqlParameter("@Airline",Model.Airline),
                new System.Data.SqlClient.SqlParameter("@BookingDate",Model.BookingDate),
                new System.Data.SqlClient.SqlParameter("@FlightDate",Model.FlightDate),
                new System.Data.SqlClient.SqlParameter("@Product",Model.Product),
                new System.Data.SqlClient.SqlParameter("@Origin",Model.Origin),
                new System.Data.SqlClient.SqlParameter("@Destination",Model.Destination),
                 new System.Data.SqlClient.SqlParameter("@Aircraft",Model.Aircraft),
                new System.Data.SqlClient.SqlParameter("@Agent",Model.Agent),
                new System.Data.SqlClient.SqlParameter("@Commodity",Model.Commodity),
                new System.Data.SqlClient.SqlParameter("@SHC",Model.SHC),
                new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                new System.Data.SqlClient.SqlParameter("@From",dateFrom),
                new System.Data.SqlClient.SqlParameter("@To", datetodate),
                new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
               // new System.Data.SqlClient.SqlParameter("@whereCondition", Model.whereCondition),
              //  new System.Data.SqlClient.SqlParameter("@OrderBy", Model.OrderBy),

};




                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetBillingRecord ", Parameters);

                var BillingReportList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.BillingReport1

                {   //SNo=e["SNo"].ToString(),
                    //RowNumber= e["RowNumber"].ToString(),
                    FlightDate = Convert.ToDateTime(e["FlightDate"]).ToString("dd-MMM-yyyy"),
                    // FlightDate = e["FlightDate"].ToString(), //e["FlightDate"].ToString(),
                    Flightno = e["Flightno"].ToString(),
                    Flightroute = e["Flightroute"].ToString(),
                    Code = e["Code"].ToString(),
                    Aircraft = e["Aircraft"].ToString(),
                    Mawb = e["Mawb"].ToString(),
                    Shipper = e["Shipper"].ToString(),
                    AgentorCustomer = e["AgentorCustomer"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Pcs = e["Pcs"].ToString(),
                    Cargo_Dimensions = e["Cargo_Dimensions"].ToString(),
                    Cnee = e["Cnee"].ToString(),
                    //Length = e["Length"].ToString(),
                    //Width = e["Width"].ToString(),
                    //Height = e["Height"].ToString(),
                    Actual_Weight = e["Actual_Weight"].ToString(),
                    Chargeable_Weight = e["Chargeable_Weight"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    Cass = e["Cass"].ToString(),
                    Rating = e["Rating"].ToString(),
                    Airfreight_Rate = e["Airfreight_Rate"].ToString(),
                    Total_Airfreight = e["Total_Airfreight"].ToString(),
                    Block_Space = e["Block_Space"].ToString(),
                    FSC_Rate = e["FSC_Rate"].ToString(),
                    FSC_Total = e["FSC_Total"].ToString(),
                    OVS_Rate = e["OVS_Rate"].ToString(),
                    OVS_Total = e["OVS_Total"].ToString(),
                    TC_RateOrigin = e["TC_RateOrigin"].ToString(),
                    TC_RateDest = e["TC_RateDest"].ToString(),
                    Tc_Total = e["Tc_Total"].ToString(),
                    Secuirty = e["Secuirty"].ToString(),
                    Custom_Clr = e["Custom_Clr"].ToString(),
                    AWB_Cutting = e["AWB_Cutting"].ToString(),
                    AWB_Fees = e["AWB_Fees"].ToString(),
                    EDI_Fees = e["EDI_Fees"].ToString(),
                    DGR_Fees = e["DGR_Fees"].ToString(),
                    Secuirty_Surcharge = e["Secuirty_Surcharge"].ToString(),
                    Trucking_Fees = e["Trucking_Fees"].ToString(),
                    Other_Fees = e["Other_Fees"].ToString(),
                    Total_GST = e["Total_GST"].ToString(),
                    GST_Summary = e["GST_Summary"].ToString(),
                    GST_6 = e["GST_6"].ToString(),
                    Total_Billing = e["Total_Billing"].ToString(),
                    InvoiceNo = e["InvoiceNo"].ToString(),
                    Payment = e["Payment"].ToString(),
                    Trucking_Cost = e["Trucking_Cost"].ToString(),
                    Third_Party = e["Third_Party"].ToString(),
                    Other_Cost = e["Other_Cost"].ToString(),

                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = BillingReportList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                new System.Data.SqlClient.SqlParameter("@ProcName","GetBillingRecord"),
                new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)
                (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
};
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, BillingReport Model)

        {
            try
            {

                //string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                // string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.BillingReport>(filter);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                new System.Data.SqlClient.SqlParameter("@Airline",Model.Airline),
                new System.Data.SqlClient.SqlParameter("@BookingDate",Model.BookingDate),
                new System.Data.SqlClient.SqlParameter("@FlightDate",Model.FlightDate),
                new System.Data.SqlClient.SqlParameter("@Product",Model.Product),
                new System.Data.SqlClient.SqlParameter("@Origin",Model.Origin),
                new System.Data.SqlClient.SqlParameter("@Destination",Model.Destination),
                new System.Data.SqlClient.SqlParameter("@Aircraft",Model.Aircraft),
                new System.Data.SqlClient.SqlParameter("@Agent",Model.Agent),
                new System.Data.SqlClient.SqlParameter("@Commodity",Model.Commodity),
                new System.Data.SqlClient.SqlParameter("@SHC",Model.SHC),
                new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                new System.Data.SqlClient.SqlParameter("@From",Model.FromDate),
                new System.Data.SqlClient.SqlParameter("@To",Model.ToDate),
                new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                new System.Data.SqlClient.SqlParameter("@PageSize",10000),
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetBillingRecord", Parameters);


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
                Response.AddHeader("content-disposition", "attachment;filename=BillingReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }

        [HttpGet]
        public string StockAgeing(StockAgeingRequestModel Model)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@Quater",Model.Quater),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",Model.Year),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };
               
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spStockAgeingReport_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spStockAgeingReport_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string DailyStockTransactionReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string airlineSNo, string fromDate, string toDate, string OriginSNo)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailyStockTransactionReport_getrecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyStockTransactionReport_getrecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpGet]
        public string DailySales([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, DailySalesRequestModel Model)
        {
          
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                        new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                      new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                      new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                      new System.Data.SqlClient.SqlParameter("@Type",Model.Type),
                      new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                      new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                      new System.Data.SqlClient.SqlParameter("@DateType", Model.DateType),
                      new System.Data.SqlClient.SqlParameter("@AgentSno",Model.AgentSNo),
                      new System.Data.SqlClient.SqlParameter("@OriginCitySno",Model.Origin),
                      new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Model.Destination),
                      new System.Data.SqlClient.SqlParameter("@AWBSNo", Model.AWBSNo),
                      new System.Data.SqlClient.SqlParameter("@OfficeSNo", Model.OfficeSNo),
                      new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                     new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailySalesReport_getrecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailySalesReport_getrecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpGet]
        public string Allotment(string airlineSno, string fromdate, string todate, string flightNo, string Agentsno, int IsAutoProcess)
        {
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@CarrierCode",airlineSno),
                                                                    new System.Data.SqlClient.SqlParameter("@fromdate",fromdate),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                    new System.Data.SqlClient.SqlParameter("@flightNo",flightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "Usp_GetallotmentReport", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Usp_GetallotmentReport"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string GroupPermission(GroupPermissionDetail model)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@GroupName",model.GroupName==null ? "" :model.GroupName),
                                                                    new System.Data.SqlClient.SqlParameter("@ModuleName",model.ModuleName == null ? "" : model.ModuleName ),
                                                                    new System.Data.SqlClient.SqlParameter("@PageName",model.PageName == null ? "" : model.PageName),new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo == null ? "0" : model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess)
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_GroupsPermissionDetails", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_GroupsPermissionDetails"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string UserGroupLevel(UserGroupsLevelDetails model)
        {
           
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@GroupSNo",model.GroupSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spGetUserGroupsLevelDetails", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spGetUserGroupsLevelDetails"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

       // [HttpGet]
    //  public string UserSpecialPermission(UserSpecialPermissionDetails model)
  //      {
           
  //          System.Data.DataSet ds = new DataSet();
  //          try
  //          {
  //              System.Data.SqlClient.SqlParameter[] Parameters = {
  //                                                                new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo),
  //                                                                 new System.Data.SqlClient.SqlParameter("@GroupSNo",model.GroupSNo),
  //                                                                 new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
  //                                                                  new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess)
  //};

  //              ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_UserSpecialPermission", Parameters);

  //              return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


  //          }
  //          catch (Exception ex)
  //          {
  //              DataSet dsError;
  //              System.Data.SqlClient.SqlParameter[] ParametersError = {
  //                                                                 new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
  //                                                                  new System.Data.SqlClient.SqlParameter("@ProcName","spReport_UserSpecialPermission"),
  //                                                                 new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  //                                                            };
  //              dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
  //              throw ex;
  //          }
  //      }

        [HttpGet]
        public string DailyReportPOD([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, DailyReportPOD Model)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@AirportSNo",Model.AirportSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailyReportPOD", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyReportPOD"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


         [HttpGet]
        public string ReservationVSCRA(string airlineSNo, string fromDate, string toDate, string reportType, string AWBNo, int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                               new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                               new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                               new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                               new System.Data.SqlClient.SqlParameter("@ReportType",reportType),
                                               new System.Data.SqlClient.SqlParameter("@AWBNo",AWBNo),
                                               new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                               new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess)
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReservationVSCRAComparision_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReservationVSCRAComparision_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpGet]
        public string AWBStock([DataSourceRequest]DataSourceRequest request, string airlineSNo, string officeSNo, string citySNo, string agentSNo, string StockType, int IsAutoProcess, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter)
        {
           
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSno",officeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSno",agentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@StockType",StockType),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    //new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    //new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAwbStockStatus_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAwbStockStatus_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string ClaimReport(string Status, string fromdate, string todate, string ClaimType, int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@Status",Status),
                                                                    new System.Data.SqlClient.SqlParameter("@fromdate",fromdate),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                    new System.Data.SqlClient.SqlParameter("@ClaimType",ClaimType),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetClaimReport_New", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetClaimReport_New"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string ComplainReport(string Status, string fromdate, string todate, string ComplaintSource, int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@Status",Status),
                                                                    new System.Data.SqlClient.SqlParameter("@fromdate",fromdate),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                    new System.Data.SqlClient.SqlParameter("@ComplaintSource",ComplaintSource),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetComplainReport_New", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetComplainReport"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string CargoClaimReport(string BranchOffice, string MonthofClaim, string YearofClaim, string StatusOfClaim, int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@BranchOffice",BranchOffice),
                                                                    new System.Data.SqlClient.SqlParameter("@MonthofClaim",MonthofClaim),
                                                                    new System.Data.SqlClient.SqlParameter("@YearofClaim",YearofClaim),
                                                                    new System.Data.SqlClient.SqlParameter("@StatusOfClaim",StatusOfClaim),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetCargoClaimReport", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetCargoClaimReport"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string BookingProfileReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request,string airlineCode, string FlightNo, string Fromdate, string Todate, string OriginSno, string DestinationSno, string AgentSno, string DateType, string OfficeSNo, int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",airlineCode),
                                                                            new System.Data.SqlClient.SqlParameter("@FlightNo",FlightNo),
                                                                            new System.Data.SqlClient.SqlParameter("@Fromdate",Fromdate),
                                                                            new System.Data.SqlClient.SqlParameter("@Todate",Todate),
                                                                            new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginSno)),
                                                                            new System.Data.SqlClient.SqlParameter("@DestinationCitysno",Convert.ToInt32(DestinationSno)),
                                                                            new System.Data.SqlClient.SqlParameter("@AgentSno",AgentSno),
                                                                            new System.Data.SqlClient.SqlParameter("@DateType",DateType),
                                                                             new System.Data.SqlClient.SqlParameter("@OfficeSNo", OfficeSNo),
                                                                             new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                              new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                              new System.Data.SqlClient.SqlParameter("@IsAutoProcess", IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "usp_BookingProfile_Report", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_BookingProfile_Report"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string PostFlightReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, PostFlightReportRequest Model)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo ",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),

                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spPostFlightReport_getrecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPostFlightReport_getrecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string CCAReport(CCAReportRequestModel Model)
        {
           
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@StatusType",Model.StatusType),
                                                                     new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     new System.Data.SqlClient.SqlParameter("@UserId", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                                     new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CCASNo",Model.CCASNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spCCAReport_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCCAReport_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpGet]
        public string BookingVSAcceptedReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string flightNo, string DateType, string AWBSNo, string FlightNo, int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
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
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess", IsAutoProcess),
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spBookingvarianceReport_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spBookingvarianceReport_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string AgentAnalysisReport(string careerCode, string Agentsno, string OriginCitySno, string fromdate, string todate, string flightNo, int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                       new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                          new System.Data.SqlClient.SqlParameter("@AgentSno",Agentsno),
                                                                      new System.Data.SqlClient.SqlParameter("@FlightNo",flightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Fromdate",fromdate),
                                                                    new System.Data.SqlClient.SqlParameter("@Todate",todate),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "usp_GetAgentAnalysisReport", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_GetAgentAnalysisReport"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string BookingReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string OfficeName, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string bookingFlightNo, string CheckedStatus, int IsAutoProcess,int ShipmentType)
        {
           
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                              new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Convert.ToInt32(Agentsno)),
                                                                    new System.Data.SqlClient.SqlParameter("@productSno",Convert.ToInt32(productSno)),
                                                                    new System.Data.SqlClient.SqlParameter("@CommoditySno",Convert.ToInt32(CommoditySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",bookingFlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@statusCheck",CheckedStatus),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo", Convert.ToInt32(OfficeName)),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@ShipmentType",ShipmentType),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "usp_GetBookingReport", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_GetBookingReport"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string CampaignUtilisationReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CampaignUtilisationRequestModel Model)
        {
            string dateFropm = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
            string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters =  {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@CampaignCode",Model.CampaignCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFropm),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo", Model.OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSNo", Model.AgentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CodeType", Model.CodeType),
                                                                    new System.Data.SqlClient.SqlParameter("@Status", Model.Status),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                 new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
               new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spCampaignUtilisationReport_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCampaignUtilisationReport_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpGet]
        public string CancelInvoiceandRefundReport([DataSourceRequest]DataSourceRequest request,CancelInvoicereRequest Model)
        {
           
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@airlineSno",Model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@originSno",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@destinationSno",Model.DestinationSno),
                                                                     new System.Data.SqlClient.SqlParameter("@fromDate",Model.FromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@Todate",Model.ToDate),
                                                                      new System.Data.SqlClient.SqlParameter("@awbsno",Model.AWBSNo),
                                                                       new System.Data.SqlClient.SqlParameter("@cancelType",Model.CancelType),
                                                                        new System.Data.SqlClient.SqlParameter("@optionType",Model.OptionType),
                                                                        new System.Data.SqlClient.SqlParameter("@agentSno",Model.agentsno),
                                                                         new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                         new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "usp_getCancelInvoiceRefund_Report", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_getCancelInvoiceRefund_Report"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpGet]
        public string PenaltyReport([DataSourceRequest]DataSourceRequest request,PenaltyRquestReport Model,int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirLineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PenaltyType",Model.PenaltyType),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OrigicitySno",Model.OriginCity),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ReferenceNumber",Model.ReferenceNumber),
                                                                      new System.Data.SqlClient.SqlParameter("@FlightDate",Model.FlightDate),
                                                                      new System.Data.SqlClient.SqlParameter("@BookingDate",Model.BookingDate),
                                                                       new System.Data.SqlClient.SqlParameter("@ReportType",Model.ReportType),
                                                                        new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                        new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                        new System.Data.SqlClient.SqlParameter("@IsAutoProcess", IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "uspGetVoidData", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","uspGetVoidData"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string WarehouseAccountingReport(string airlineSNo, string originSNo, string fromDate, string toDate, string awbSNo, string reportType,int IsAutoProcess)
        {
            
            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                     new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",originSNo),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBSNo",awbSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType",reportType),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_WareHouseAccounting", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_WareHouseAccounting"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpPost]
        public string DownloadBlobReports()
        {
           
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spGenerateReport_View", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }

            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spGenerateReport_View"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                return "Failed";
            }
        }
        [HttpGet]
        public ActionResult FlownAsBookedReport()
        {
            return View();
        }
        [HttpPost]
        public ActionResult FlownAsBookedReport([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter,FlownAsBookedReport Model)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters =CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.FlownAsBookedReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {

                   // new System.Data.SqlClient.SqlParameter("@Airline",Model.Airline),
                    new System.Data.SqlClient.SqlParameter("@Origin",Model.Origin),
                    new System.Data.SqlClient.SqlParameter("@Destination",Model.Destination),
                    new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                    new System.Data.SqlClient.SqlParameter("@ToDate", Model.ToDate),
                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                   new System.Data.SqlClient.SqlParameter("@whereCondition", Model.whereCondition),
                   new System.Data.SqlClient.SqlParameter("@OrderBy", Model.OrderBy),

};

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_FlownAsBooked ", Parameters);

                var FlownAsBookedList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.FlownAsBookedReport

                {
                AWBNo=e["AWBNo"].ToString(),
                AgentName= e["AgentName"].ToString(),
                Commodity= e["Commodity"].ToString(),
                BookedFlightNo = e["BookedFlightNo"].ToString(),
                BookedFlightDate = e["BookedFlightDate"].ToString(),
                BookedOri = e["BookedOri"].ToString(),
                BookedDest = e["BookedDest"].ToString(),
                BookedPieces = Convert.ToInt32(e["BookedPieces"]),
                BookedGrossWeight = Convert.ToDecimal(e["BookedGrossWeight"]),
                BookedVolumeWeight = Convert.ToDecimal(e["BookedVolumeWeight"]),
                AcceptanceFlightNo = e["AcceptanceFlightNo"].ToString(),
                AcceptanceFlightDate = e["AcceptanceFlightDate"].ToString(),
                AcceptancePieces= Convert.ToDecimal(e["AcceptancePieces"].ToString()),
                AcceptanceGrossWeight = Convert.ToDecimal(e["AcceptanceGrossWeight"].ToString()),
                AcceptanceVolumeWeight = Convert.ToDecimal(e["AcceptanceVolumeWeight"].ToString()),
                FlownFlightNo = e["FlownFlightNo"].ToString(),
                FlownFlightDate =e["FlownFlightDate"].ToString(),
                FlownOrigin = e["FlownOrigin"].ToString(),
                FlownDestination = e["FlownDestination"].ToString(),
                FlownPieces = Convert.ToInt32(e["FlownPieces"]),
                FlownGrossWeight = Convert.ToDecimal(e["FlownGrossWeight"]),
                FlownVolumeWeight = Convert.ToDecimal(e["FlownVolumeWeight"]),
                Status = e["Status"].ToString(),
            });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = FlownAsBookedList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                new System.Data.SqlClient.SqlParameter("@ProcName","spReport_FlownAsBooked"),
                new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)
                (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
};
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        [HttpGet]
        public string FPRReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, FPRLionReportRequestModel Model)
        {

            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                      new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   //new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@CurrencySNo",Model.CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@ToCurrencySNo", Model.CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFPRLionReport_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFPRLionReport_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        [HttpGet]
        public string FMRReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, FPRReportRequestModel Model)
        {

            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFPRReport_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFPRReport_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        //Added by shivam
        [HttpGet]
        public string FMRDailyReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, FPRReportRequestModel Model)
        {

            System.Data.DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
  };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFMRDailyReport_GetRecord", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFMRDailyReport_GetRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string CreditLimitReport(string recordID, int page, int pageSize, CreditLimitReportRequest model, string sort)
        {
            System.Data.DataSet ds = new DataSet();
            try
            {
                
                System.Data.SqlClient.SqlParameter[] Parameters = { new System.Data.SqlClient.SqlParameter("@PageNo", page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", pageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",model.OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",model.AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ValidFrom",model.ValidFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ValidTo",model.ValidTo),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sort),
                                                                    new System.Data.SqlClient.SqlParameter("@CurrencySNo", model.CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo", model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@TransactionMode", model.TransactionMode),
                                                                    new System.Data.SqlClient.SqlParameter("@AwbRefType", model.AwbRefType),
                                                                    new System.Data.SqlClient.SqlParameter("@AwbNumber",model.AwbNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

            };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetListCreditLimitReport", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetListCreditLimitReport"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public string CreateBGReport(string recordID, int page, int pageSize, CreditLimitReportRequest model, string sort)
        {
            System.Data.DataSet ds = new DataSet();
            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = { new System.Data.SqlClient.SqlParameter("@PageNo", page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", pageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",model.OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",model.AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ValidFrom",model.ValidFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ValidTo",model.ValidTo),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sort),
                                                                    new System.Data.SqlClient.SqlParameter("@CurrencySNo", model.CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo", model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@TransactionMode", model.TransactionMode),
                                                                    new System.Data.SqlClient.SqlParameter("@BgType",model.BgType),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

            };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "CreditLimitBGReport", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","CreditLimitBGReport"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        
    }
    }
