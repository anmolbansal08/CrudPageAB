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
    public class PointOfSalesController : Controller
    {
        //
        // GET: /PointOfSales/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult PointOfSalesGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            IEnumerable<PointOfSales> CommodityList = null;
            System.Data.DataSet ds = new DataSet();
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo), 
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),                                                                    
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),     
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                    new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)
 

                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spPointOfSales_getrecord", Parameters);

                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        RowNo = Convert.ToInt32(e["RowNo"]),
                        POSCode = e["POSCode"].ToString().ToUpper(),
                        POSName = e["POSName"].ToString().ToUpper(),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        MOP = e["MOP"].ToString().ToUpper(),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        CCANo = e["CCANo"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        Commodity = e["Commodity"].ToString().ToUpper(),
                        FrtCharges = e["FrtCharges"].ToString().ToUpper(),
                        Comm = e["Comm"].ToString().ToUpper(),
                        Disc = e["Disc"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalNet = e["TotalNet"].ToString().ToUpper(),
                        RefundFee = e["RefundFee"].ToString().ToUpper(),
                        Curr = e["Curr"].ToString().ToUpper(),
                        RecieptNo = e["RecieptNo"].ToString().ToUpper(),
                        PaymentDetailsFormOfPayment = e["PaymentDetailsFormOfPayment"].ToString().ToUpper(),
                        PaymentDetailsAmount = e["PaymentDetailsAmount"].ToString().ToUpper(),
                        PaymentDetailsBankName = e["PaymentDetailsBankName"].ToString().ToUpper(),
                        PaymentDetailsCardType = e["PaymentDetailsCardType"].ToString().ToUpper(),
                        PaymentDetailsCardNo = e["PaymentDetailsCardNo"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        IssueDate = e["IssueDate"].ToString().ToUpper(),
                        PaymentDate = e["PaymentDate"].ToString().ToUpper(),
                        Remarks = e["Remarks"].ToString().ToUpper(),
                        PaymentStatus = e["PaymentStatus"].ToString().ToUpper(),
                        Tax = e["Tax"].ToString().ToUpper(),
                        AWBStatus = e["AWBStatus"].ToString().ToUpper()
                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<PointOfSales>().ToList<PointOfSales>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public ActionResult PointOfSalesGetRecordForSummary([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<PointOfSales> CommodityList = null;
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                 new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo), 
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),                                                                    
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),     
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                    new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)

                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spPointOfSales_getrecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {

                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        Curr = e["Curr"].ToString().ToUpper(),
                        TotalFreightCharges = e["TotalFreightCharges"].ToString().ToUpper(),
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
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<PointOfSales>().ToList<PointOfSales>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public ActionResult ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<PointOfSales> CommodityList = null;

            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo), 
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),                                                                    
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),     
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 10000000),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                    new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)
                                                              };
            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spPointOfSales_getrecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        RowNo = Convert.ToInt32(e["RowNo"]),
                        POSCode = e["POSCode"].ToString().ToUpper(),
                        POSName = e["POSName"].ToString().ToUpper(),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        MOP = e["MOP"].ToString().ToUpper(),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        CCANo = e["CCANo"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        Commodity = e["Commodity"].ToString().ToUpper(),
                        FrtCharges = e["FrtCharges"].ToString().ToUpper(),
                        Comm = e["Comm"].ToString().ToUpper(),
                        Disc = e["Disc"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalNet = e["TotalNet"].ToString().ToUpper(),
                        RefundFee = e["RefundFee"].ToString().ToUpper(),
                        Curr = e["Curr"].ToString().ToUpper(),
                        RecieptNo = e["RecieptNo"].ToString().ToUpper(),
                        PaymentDetailsFormOfPayment = e["PaymentDetailsFormOfPayment"].ToString().ToUpper(),
                        PaymentDetailsAmount = e["PaymentDetailsAmount"].ToString().ToUpper(),
                        PaymentDetailsBankName = e["PaymentDetailsBankName"].ToString().ToUpper(),
                        PaymentDetailsCardType = e["PaymentDetailsCardType"].ToString().ToUpper(),
                        PaymentDetailsCardNo = e["PaymentDetailsCardNo"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        IssueDate = e["IssueDate"].ToString().ToUpper(),
                        PaymentDate = e["PaymentDate"].ToString().ToUpper(),
                        Remarks = e["Remarks"].ToString().ToUpper(),
                        PaymentStatus = e["PaymentStatus"].ToString().ToUpper(),
                        Tax = e["Tax"].ToString().ToUpper(),
                        AWBStatus= e["AWBStatus"].ToString().ToUpper()
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        public ActionResult DistinctExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<PointOfSales> CommodityList = null;

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 10000000),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                    new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)
                                                              };
            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "DistinctspPointOfSales_getrecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        RowNo = Convert.ToInt32(e["RowNo"]),
                        POSCode = e["POSCode"].ToString().ToUpper(),
                        POSName = e["POSName"].ToString().ToUpper(),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        MOP = e["MOP"].ToString().ToUpper(),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        CCANo = e["CCANo"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        Commodity = e["Commodity"].ToString().ToUpper(),
                        FrtCharges = e["FrtCharges"].ToString().ToUpper(),
                        Comm = e["Comm"].ToString().ToUpper(),
                        Disc = e["Disc"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalNet = e["TotalNet"].ToString().ToUpper(),
                        RefundFee = e["RefundFee"].ToString().ToUpper(),
                        Curr = e["Curr"].ToString().ToUpper(),
                        RecieptNo = e["RecieptNo"].ToString().ToUpper(),
                        PaymentDetailsFormOfPayment = e["PaymentDetailsFormOfPayment"].ToString().ToUpper(),
                        PaymentDetailsAmount = e["PaymentDetailsAmount"].ToString().ToUpper(),
                        PaymentDetailsBankName = e["PaymentDetailsBankName"].ToString().ToUpper(),
                        PaymentDetailsCardType = e["PaymentDetailsCardType"].ToString().ToUpper(),
                        PaymentDetailsCardNo = e["PaymentDetailsCardNo"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        IssueDate = e["IssueDate"].ToString().ToUpper(),
                        PaymentDate = e["PaymentDate"].ToString().ToUpper(),
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","DistinctspPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }




        public ActionResult ExportToExcelForSummary([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<PointOfSales> CommodityList = null;

            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo), 
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),                                                                    
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),     
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1000000),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                     new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)
                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spPointOfSales_getrecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        Curr = e["Curr"].ToString().ToUpper(),
                        TotalFreightCharges = e["TotalFreightCharges"].ToString().ToUpper(),
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }
        public ActionResult DistinctExportToExcelForSummary([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<PointOfSales> CommodityList = null;

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1000000),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                     new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)
                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "DistinctspPointOfSales_getrecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        Curr = e["Curr"].ToString().ToUpper(),
                        TotalFreightCharges = e["TotalFreightCharges"].ToString().ToUpper(),
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","DistinctspPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public ActionResult Index_distinctPos()
        {
            return View();
        }
       
      
        public ActionResult DistinctPointOfSalesGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            IEnumerable<PointOfSales> CommodityList = null;
            System.Data.DataSet ds = new DataSet();
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                    new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)


                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "DistinctspPointOfSales_getrecord", Parameters);

                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        RowNo = Convert.ToInt32(e["RowNo"]),
                        POSCode = e["POSCode"].ToString().ToUpper(),
                        POSName = e["POSName"].ToString().ToUpper(),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        MOP = e["MOP"].ToString().ToUpper(),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        CCANo = e["CCANo"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        Commodity = e["Commodity"].ToString().ToUpper(),
                        FrtCharges = e["FrtCharges"].ToString().ToUpper(),
                        Comm = e["Comm"].ToString().ToUpper(),
                        Disc = e["Disc"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        TotalNet = e["TotalNet"].ToString().ToUpper(),
                        RefundFee = e["RefundFee"].ToString().ToUpper(),
                        Curr = e["Curr"].ToString().ToUpper(),
                        RecieptNo = e["RecieptNo"].ToString().ToUpper(),
                        PaymentDetailsFormOfPayment = e["PaymentDetailsFormOfPayment"].ToString().ToUpper(),
                        PaymentDetailsAmount = e["PaymentDetailsAmount"].ToString().ToUpper(),
                        PaymentDetailsBankName = e["PaymentDetailsBankName"].ToString().ToUpper(),
                        PaymentDetailsCardType = e["PaymentDetailsCardType"].ToString().ToUpper(),
                        PaymentDetailsCardNo = e["PaymentDetailsCardNo"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        IssueDate = e["IssueDate"].ToString().ToUpper(),
                        PaymentDate = e["PaymentDate"].ToString().ToUpper(),
                        Remarks = e["Remarks"].ToString().ToUpper(),
                        PaymentStatus = e["PaymentStatus"].ToString().ToUpper(),
                        Tax = e["Tax"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<PointOfSales>().ToList<PointOfSales>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","DistinctspPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public ActionResult DistinctPointOfSalesGetRecordForSummary([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, PointOfSalesRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PointOfSales>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<PointOfSales> CommodityList = null;
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                 new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsSummary", Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo", Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@POSCode", Model.POSCode),
                                                                    new System.Data.SqlClient.SqlParameter("@PaymentStatus", Model.PaymentStatus)

                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "DistinctspPointOfSales_getrecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {

                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PointOfSales
                    {
                        Curr = e["Curr"].ToString().ToUpper(),
                        TotalFreightCharges = e["TotalFreightCharges"].ToString().ToUpper(),
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
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<PointOfSales>().ToList<PointOfSales>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","DistinctspPointOfSales_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}