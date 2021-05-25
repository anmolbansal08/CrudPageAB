using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using ClosedXML.Excel;
using System.Configuration;
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlashCargoWebApps.Controllers
{
    public class AWBStockStatusController : Controller
    {
        //
        // GET: /AWBStockStatus/
        public ActionResult Index()
        {
            return View();
        }


        //
        public ActionResult GetRecord([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string officeSNo, string citySNo, string agentSNo, string StockType,int IsAutoProcess)
        {

            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Stock.AWBStockStatus>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<CargoFlash.Cargo.Model.Stock.AWBStockStatus> CommodityList = null;
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
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAwbStockStatus_GetRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockStatus
                   {
                       AWBPrefix = e["AWBPrefix"].ToString(),
                       Name = e["Name"].ToString().ToUpper(),
                       TotalStockIssued = Convert.ToInt32(e["TotalStockIssued"]),
                       StockUnused = Convert.ToInt32(e["StockUnused"]),
                        StockIssuedToOffice = Convert.ToInt32(e["StockIssuedToOffice"]),
                        StockIssuedToAgent = Convert.ToInt32(e["StockIssuedToAgent"])
                    });
                }
                ds.Dispose();

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<CargoFlash.Cargo.Model.Stock.AWBStockStatus>().ToList<CargoFlash.Cargo.Model.Stock.AWBStockStatus>(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAwbStockStatus_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }



        public ActionResult GetOfficeData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string aWBPrefix, string officeSNo, string citySNo, string agentSNo, string StockType)
        {

            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<CargoFlash.Cargo.Model.Stock.AWBStockStatus> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                  new System.Data.SqlClient.SqlParameter("@AirlineSno",aWBPrefix),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSno",officeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSno",agentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@StockType",StockType),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAwbStockStatus_GetOfficeRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockStatus
                    {
                        OfficeSNo = Convert.ToInt32(e["OfficeSNo"].ToString()),
                        Name = e["Name"].ToString().ToUpper(),
                        TotalStockIssued = Convert.ToInt32(e["TotalStockIssued"]),
                        StockUnused = Convert.ToInt32(e["StockUnused"]),
                        StockIssuedToAgent = Convert.ToInt32(e["StockIssuedToAgent"])
                    });
                }
                ds.Dispose();

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<CargoFlash.Cargo.Model.Stock.AWBStockStatus>().ToList<CargoFlash.Cargo.Model.Stock.AWBStockStatus>(),

                    //ds.Tables.Count > 1 ? airportList.AsQueryable().ToList() : Enumerable.Empty<StockManagement>().ToList<StockManagement>()

                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAwbStockStatus_GetOfficeRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        //                                 here is for city 



        public ActionResult GetCityData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string aWBPrefix, string officeSNo, string citySNo, string agentSNo, string StockType)
        {

            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<CargoFlash.Cargo.Model.Stock.AWBStockStatus> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                 new System.Data.SqlClient.SqlParameter("@AirlineSno",aWBPrefix),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSno",officeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSno",agentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@StockType",StockType),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAwbStockStatus_GetCityRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockStatus
                   {
                       CitySNo = Convert.ToInt32(e["CitySNo"].ToString()),
                       Name = e["Name"].ToString().ToUpper(),
                       TotalStockIssued = Convert.ToInt32(e["TotalStockIssued"]),
                       StockUnused = Convert.ToInt32(e["StockUnused"]),
                       StockIssuedToAgent = Convert.ToInt32(e["StockIssuedToAgent"]),
                       StockBooked = Convert.ToInt32(e["StockBooked"]),
                       Void = Convert.ToInt32(e["Void"]),
                       BlackListed = Convert.ToInt32(e["BlackListed"])
                   });
                }

                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<CargoFlash.Cargo.Model.Stock.AWBStockStatus>().ToList<CargoFlash.Cargo.Model.Stock.AWBStockStatus>(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAwbStockStatus_GetCityRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }



        //Account Get Record 

        public ActionResult GetAccountData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string aWBPrefix, string officeSNo, string citySNo, string agentSNo, string StockType)
        {

            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<CargoFlash.Cargo.Model.Stock.AWBStockStatus> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                 new System.Data.SqlClient.SqlParameter("@AirlineSno",aWBPrefix),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSno",officeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSno",agentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@StockType",StockType),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAwbStockStatus_GetAccountRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockStatus
                   {
                       AccountSNo = Convert.ToInt32(e["AccountSNo"].ToString()),
                       Name = e["Name"].ToString().ToUpper(),
                       TotalStockIssued = Convert.ToInt32(e["TotalStockIssued"]),
                       //StockUnused = Convert.ToInt32(e["StockUnused"]),
                       //StockIssuedToAgent = Convert.ToInt32(e["StockIssuedToAgent"]),
                       StockBooked = Convert.ToInt32(e["StockBooked"]),
                       UnusedStock = Convert.ToInt32(e["UnusedStock"]),
                        Void = Convert.ToInt32(e["Void"]),
                        BlackListed = Convert.ToInt32(e["BlackListed"])
                   });
                    ds.Dispose();
                }
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAwbStockStatus_GetAccountRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return Json(new DataSourceResult
            {
                Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<CargoFlash.Cargo.Model.Stock.AWBStockStatus>().ToList<CargoFlash.Cargo.Model.Stock.AWBStockStatus>(),
                //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            }, JsonRequestBehavior.AllowGet);


        }





        public void GetRecordInExcel(string aWBPrefix, string officeSNo, string citySNo, string agentSNo, string stockStatus, string StockType)
        {
            try
            {
                 
                System.Data.SqlClient.SqlParameter[] Parameters = {  
                                                                    new System.Data.SqlClient.SqlParameter("@AWBPrefix",aWBPrefix),
                                                                    new System.Data.SqlClient.SqlParameter("@StockType",StockType),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",officeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySNo",citySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSNo",agentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@StockStatus",stockStatus) 
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAWBStockStatus_GetRecordForExcel", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    DataTable dt1 = ds.Tables[0];
                    dt1.Columns.Remove("OfficeSNo");
                    dt1.Columns.Remove("CitySNo");
                    dt1.Columns.Remove("AccountSNo");
                    dt1.Columns.Remove("StockStatus");
                    ConvertDSToExcel_Success(dt1, 0);
                }


            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAWBStockStatus_GetRecordForExcel"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
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
                Response.AddHeader("content-disposition", "attachment;filename=AWBStockreport_'" + date + "'.xlsx");
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