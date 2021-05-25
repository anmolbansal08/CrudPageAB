using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Reservation;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlashCargoWebApps.Controllers
{
    public class IndividualSalesReportController : Controller
    {
        //
        // GET: /IndividualSalesReport/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult IndividualSalesReportGetRecord(IndividualSalesReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string destinationSNo, string fromDate, string toDate, int Type, int AccountSNo, int UserSNo, string PaymentStatus)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<IndividualSalesReport>(filter);
            IEnumerable<IndividualSalesReport> CommodityList = null;
            System.Data.DataSet ds = new DataSet();
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",originSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",destinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", UserSNo),
                                                                      new System.Data.SqlClient.SqlParameter("@PaymentStatus", PaymentStatus)

                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spIndividualSalesReport_getrecord", Parameters);

                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new IndividualSalesReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        RowNo = Convert.ToInt32(e["RowNo"]),
                        DocNo = e["DocNo"].ToString().ToUpper(),
                        POSName = e["POSName"].ToString().ToUpper(),
                        MOP = e["MOP"].ToString().ToUpper(),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        GrossWt = e["GrossWt"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        Curr = e["Curr"].ToString().ToUpper(),
                        FrtCharges = e["FrtCharges"].ToString().ToUpper(),
                        TotalValuationCharges = e["TotalValuationCharges"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalNet = e["TotalNet"].ToString().ToUpper(),
                        AWBRefundFee = e["AWBRefundFee"].ToString().ToUpper(),
                        RecieptNo = e["RecieptNo"].ToString().ToUpper(),
                        TypeofPayment = e["TypeofPayment"].ToString().ToUpper(),
                        Amount = e["Amount"].ToString().ToUpper(),
                        DetailsBank = e["DetailsBank"].ToString().ToUpper(),
                        DetailsCardType = e["DetailsCardType"].ToString().ToUpper(),
                        DetailsCardNo = e["DetailsCardNo"].ToString().ToUpper(),
                        IssueDate = e["IssueDate"].ToString().ToUpper(),
                        PaymentDate = e["PaymentDate"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        Remarks = e["Remarks"].ToString().ToUpper(),
                        PaymentStatus = e["PaymentStatus"].ToString().ToUpper(),
                        Tax = e["Tax"].ToString().ToUpper(),
                    });


                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<IndividualSalesReport>().ToList<IndividualSalesReport>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spIndividualSalesReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public ActionResult IndividualSalesReportGetRecordForSummary(IndividualSalesReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string destinationSNo, string fromDate, string toDate, int Type, int AccountSNo, int UserSNo)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<IndividualSalesReport>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<IndividualSalesReport> CommodityList = null;
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",originSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",destinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", UserSNo)

                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spIndividualSalesReport_getrecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {

                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new IndividualSalesReport
                    {
                        Curr = e["Curr"].ToString().ToUpper(),
                        TotalFreightAmount = e["TotalFreightAmount"].ToString().ToUpper(),
                        TotalValuationCharges = e["TotalValuationCharges"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalAWBRefundFee = e["TotalAWBRefundFee"].ToString().ToUpper(),
                        TotalCash = e["TotalCash"].ToString().ToUpper(),
                        TotalCredit = e["TotalCredit"].ToString().ToUpper(),
                        TotalAutodebet = e["TotalAutodebet"].ToString().ToUpper(),
                        TotalSettlement = e["TotalSettlement"].ToString().ToUpper(),
                        Difference = e["Difference"].ToString().ToUpper()
                    });

                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<IndividualSalesReport>().ToList<IndividualSalesReport>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spIndividualSalesReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public ActionResult ExportToExcel(IndividualSalesReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string destinationSNo, string fromDate, string toDate, int Type, int AccountSNo, int UserSNo,string PaymentStatus)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<IndividualSalesReport>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<IndividualSalesReport> CommodityList = null;

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",originSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",destinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1000000),
                                                                      new System.Data.SqlClient.SqlParameter("@IsSummary", Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", UserSNo),
                                                                      new System.Data.SqlClient.SqlParameter("@PaymentStatus", PaymentStatus)
                                                              };
            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spIndividualSalesReport_getrecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new IndividualSalesReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        RowNo = Convert.ToInt32(e["RowNo"]),
                        DocNo = e["DocNo"].ToString().ToUpper(),
                        POSName = e["POSName"].ToString().ToUpper(),
                        MOP = e["MOP"].ToString().ToUpper(),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        GrossWt = e["GrossWt"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        Curr = e["Curr"].ToString().ToUpper(),
                        FrtCharges = e["FrtCharges"].ToString().ToUpper(),
                        TotalValuationCharges = e["TotalValuationCharges"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalNet = e["TotalNet"].ToString().ToUpper(),
                        AWBRefundFee = e["AWBRefundFee"].ToString().ToUpper(),
                        RecieptNo = e["RecieptNo"].ToString().ToUpper(),
                        TypeofPayment = e["TypeofPayment"].ToString().ToUpper(),
                        Amount = e["Amount"].ToString().ToUpper(),
                        DetailsBank = e["DetailsBank"].ToString().ToUpper(),
                        DetailsCardType = e["DetailsCardType"].ToString().ToUpper(),
                        DetailsCardNo = e["DetailsCardNo"].ToString().ToUpper(),
                        IssueDate = e["IssueDate"].ToString().ToUpper(),
                        PaymentDate = e["PaymentDate"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        Remarks = e["Remarks"].ToString().ToUpper(),
                        PaymentStatus = e["PaymentStatus"].ToString().ToUpper(),
                        Tax = e["Tax"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                }
                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    // Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spIndividualSalesReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }





        public ActionResult ExportToExcelForSummary(IndividualSalesReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string destinationSNo, string fromDate, string toDate, int Type, int AccountSNo, int UserSNo)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<IndividualSalesReport>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<IndividualSalesReport> CommodityList = null;

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",originSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",destinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1000000),
                                                                      new System.Data.SqlClient.SqlParameter("@IsSummary", Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", UserSNo)
                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spIndividualSalesReport_getrecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new IndividualSalesReport
                    {
                        Curr = e["Curr"].ToString().ToUpper(),
                        TotalFreightAmount = e["TotalFreightAmount"].ToString().ToUpper(),
                        TotalValuationCharges = e["TotalValuationCharges"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalAWBRefundFee = e["TotalAWBRefundFee"].ToString().ToUpper(),
                        TotalCash = e["TotalCash"].ToString().ToUpper(),
                        TotalCredit = e["TotalCredit"].ToString().ToUpper(),
                        TotalAutodebet = e["TotalAutodebet"].ToString().ToUpper(),
                        TotalSettlement = e["TotalSettlement"].ToString().ToUpper(),
                        Difference = e["Difference"].ToString().ToUpper()
                    });
                    ds.Dispose();
                }
                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    // Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spIndividualSalesReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

    }
}