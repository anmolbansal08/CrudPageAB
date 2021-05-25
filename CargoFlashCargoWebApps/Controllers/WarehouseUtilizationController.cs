using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class WarehouseUtilizationController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: WarehouseUtilization
        public ActionResult WarehouseUtilizationReport()
        {
            return View();
        }

        public JsonResult GetWarehouseUtilizationData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter,
string Location , string Warehouse, string SubArea, string Airport, string Terminal,int GridType)
        {

            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseUtilization>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = 
                    {
                        new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                        new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                        new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                        new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                        new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()),
                        new System.Data.SqlClient.SqlParameter("@LocationSNo", Location),
                        new System.Data.SqlClient.SqlParameter("@WarehouseSNo",Warehouse),
                        new System.Data.SqlClient.SqlParameter("@SubAreaSNo", SubArea),
                        new System.Data.SqlClient.SqlParameter("@AirportSNo", Airport),
                        new System.Data.SqlClient.SqlParameter("@TerminalSNo",Terminal),
                        new System.Data.SqlClient.SqlParameter("@GridType", GridType)
                };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spWarehouseUtilization_Report", Parameters);

                var WarehouseUtilizationList = ds.Tables[0].AsEnumerable().Select(e => new WarehouseUtilization
                {
                    SNo = e["SNo"].ToString(),
                    Airport = e["Airport"].ToString(),
                    Warehouse = e["Warehouse"].ToString(),
                    Type = e["Type"].ToString(),
                    Terminal = e["Terminal"].ToString(),
                    AWBs = e["AWBs"].ToString(),
                    TotalGross = e["TotalGross"].ToString(),
                    TotalVol = e["TotalVol"].ToString(),
                    TotalGrossUsed = e["TotalGrossUsed"].ToString(),
                    TotalVolUsed = e["TotalVolUsed"].ToString(),
                    TotalGrossAvail = e["TotalGrossAvail"].ToString(),
                    TotalVolAvail = e["TotalVolAvail"].ToString()
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = WarehouseUtilizationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spWarehouseUtilization_Report"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }        

        public JsonResult GetSubAreaData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string Location, string Warehouse, string SubArea, string Airport, string Terminal, int GridType)
        {

            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseUtilization>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = {
                     new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                        new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                        new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                        new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                        new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()),
                        new System.Data.SqlClient.SqlParameter("@LocationSNo", Location),
                        new System.Data.SqlClient.SqlParameter("@WarehouseSNo",Warehouse),
                        new System.Data.SqlClient.SqlParameter("@SubAreaSNo", SubArea),
                        new System.Data.SqlClient.SqlParameter("@AirportSNo", Airport),
                        new System.Data.SqlClient.SqlParameter("@TerminalSNo",Terminal),
                        new System.Data.SqlClient.SqlParameter("@GridType", GridType)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spWarehouseUtilization_Report", Parameters);

                var SubAreaUtilizationList = ds.Tables[0].AsEnumerable().Select(e => new SubAreaUtilization
                {
                    SNo = e["SNo"].ToString(),
                     Agent = e["Agent"].ToString(),
                     Airline = e["Airline"].ToString(),
                     DestCity = e["DestCity"].ToString(),
                     DestCountry = e["DestCountry"].ToString(),
                     SHC = e["SHC"].ToString(),
                      StorageArea = e["StorageArea"].ToString(),
                    Type = e["Type"].ToString(),
                     SubLocationType = e["SubLocationType"].ToString(),
                    AWBs = e["AWBs"].ToString(),
                    TotalGross = e["TotalGross"].ToString(),
                    TotalVol = e["TotalVol"].ToString(),
                    TotalGrossUsed = e["TotalGrossUsed"].ToString(),
                    TotalVolUsed = e["TotalVolUsed"].ToString(),
                    TotalGrossAvail = e["TotalGrossAvail"].ToString(),
                    TotalVolAvail = e["TotalVolAvail"].ToString()
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = SubAreaUtilizationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spWarehouseUtilization_Report"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public JsonResult GetRackData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string Location, string Warehouse, string SubArea, string Airport, string Terminal, int GridType)
        {

            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseUtilization>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = {
                        new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                        new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                        new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                        new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                        new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()),
                        new System.Data.SqlClient.SqlParameter("@LocationSNo", Location),
                        new System.Data.SqlClient.SqlParameter("@WarehouseSNo",Warehouse),
                        new System.Data.SqlClient.SqlParameter("@SubAreaSNo", SubArea),
                        new System.Data.SqlClient.SqlParameter("@AirportSNo", Airport),
                        new System.Data.SqlClient.SqlParameter("@TerminalSNo",Terminal),
                        new System.Data.SqlClient.SqlParameter("@GridType", GridType)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spWarehouseUtilization_Report", Parameters);

                var RackUtilizationList = ds.Tables[0].AsEnumerable().Select(e => new RackUtilization
                {
                    SNo = e["SNo"].ToString(),
                     Name = e["Name"].ToString(),
                     RackNumber = e["RackNumber"].ToString(),
                     SlabNumber = e["SlabNumber"].ToString(),
                    AWBs = e["AWBs"].ToString(),
                    TotalGross = e["TotalGross"].ToString(),
                    TotalVol = e["TotalVol"].ToString(),
                    TotalGrossUsed = e["TotalGrossUsed"].ToString(),
                    TotalVolUsed = e["TotalVolUsed"].ToString(),
                    TotalGrossAvail = e["TotalGrossAvail"].ToString(),
                    TotalVolAvail = e["TotalVolAvail"].ToString()
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = RackUtilizationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spWarehouseUtilization_Report"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


    }
}