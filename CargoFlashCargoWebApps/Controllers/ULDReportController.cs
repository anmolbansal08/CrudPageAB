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
using CargoFlash.Cargo.Model.ULD;
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlashCargoWebApps.Controllers
{
    public class ULDReportController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        string connectionString = CargoFlash.SoftwareFactory.Data.ReadConnectionString.WebConfigConnectionString;

        public ActionResult GetRecord([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, ULDRecord uldRecord)
        {
            try
            {

                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",uldRecord.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",uldRecord.CitySNo),
                                                                      new System.Data.SqlClient.SqlParameter("@OwnershipSNo",uldRecord.OwnershipSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetULDReportAirlineRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.ULD.ULDReport
                {
                    ASNo = Convert.ToInt32(e["AirlineSNo"]),
                    Name = e["AirlineName"].ToString().ToUpper(),
                    Total = Convert.ToInt32(e["TotalULD"]),
                    Serviceable = e["Serviceable"].ToString().ToUpper(),
                    Damaged = e["Damaged"].ToString().ToUpper()
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)//
            {
                throw ex;

            }

        }


        public ActionResult GetCityData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string citySNo, string OwnershipSNo)
        {
            try
            {

                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                  new System.Data.SqlClient.SqlParameter("@AirlineSno",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OwnershipSNo",OwnershipSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetULDReportCityRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.ULD.ULDReport
                {
                    ASNo = Convert.ToInt32(e["AirlineSNo"].ToString()),
                    CSNo = Convert.ToInt32(e["CitySNo"].ToString()),
                    Name = e["CityName"].ToString().ToUpper(),
                    Total = Convert.ToInt32(e["TotalULD"]),
                    Serviceable = e["Serviceable"].ToString(),
                    Damaged = (e["Damaged"].ToString().ToUpper())
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch(Exception ex)//
            {
                throw ex;

            }
        }

        public ActionResult GetULDTypeData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string citySNo, string OwnershipSNo)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                  new System.Data.SqlClient.SqlParameter("@AirlineSno",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySNo),
                                                                     new System.Data.SqlClient.SqlParameter("@OwnershipSNo",OwnershipSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetULDTypeData", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.ULD.ULDReport
                {
                    ASNo = Convert.ToInt32(e["AirlineSNo"]),
                    CSNo = Convert.ToInt32(e["citysno"]),
                    ULDTp = Convert.ToInt32(e["ULDTp"]),
                    ULDType = e["ULDType"].ToString().ToUpper(),
                    Total = Convert.ToInt32(e["TotalULD"]),
                    Serviceable = (e["Serviceable"].ToString().ToUpper()),
                    Damaged = (e["Damaged"].ToString().ToUpper())
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch(Exception ex)//
            {
                throw ex;

            }
        }

        public ActionResult GetULDTypeMainData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string citySNo, string ULDType, string OwnershipSNo)
        {
            try
            {

                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                  new System.Data.SqlClient.SqlParameter("@AirlineSno",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySNo),
                                                                     new System.Data.SqlClient.SqlParameter("@OwnershipSNo",OwnershipSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ULDType",ULDType),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetULDTypeMainData", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.ULD.ULDReport
                {
                    ASNo = Convert.ToInt32(e["airlinesno"]),
                    CSNo = Convert.ToInt32(e["citysno"]),
                    ULDTp = Convert.ToInt32(e["uldtp"]),
                    ULDType = e["ULDType"].ToString().ToUpper(),
                    Total = Convert.ToInt32(e["TotalULD"]),
                    Serviceable = (e["Serviceable"].ToString().ToUpper()),
                    Damaged = (e["Damaged"].ToString().ToUpper()),
                    Deviation = e["Deviation"].ToString().ToUpper(),
                    DeviationPercentage = e["DeviationPercentage"].ToString().ToUpper()
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch(Exception ex)//
            {

                throw ex;

            }
        }

        public ActionResult GetRecordInExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string AirlineSNo, string CitySNo, string field, string Status, string ULDTp, string ULD, string OwnershipSNo)
        {
            try
            {

                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.ULD.ULDReport>(filter);

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySNo",CitySNo),
                                                                     new System.Data.SqlClient.SqlParameter("@OwnershipSNo",OwnershipSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@field",field),
                                                                    new System.Data.SqlClient.SqlParameter("@Status",Status),
                                                                    new System.Data.SqlClient.SqlParameter("@ULDTp",ULDTp),
                                                                    new System.Data.SqlClient.SqlParameter("@ULD",ULD)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetULDReportRecordForExcel", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.ULD.ULDReport
                {
                    StockType = e["StockType"].ToString().ToUpper(),
                    ULDType = e["ULDType"].ToString().ToUpper(),
                    ULDNo = e["ULDNo"].ToString().ToUpper(),
                    Serviceable = (e["Serviceable"].ToString().ToUpper()),
                    Damaged = (e["Damaged"].ToString().ToUpper()),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    CityName = e["CityName"].ToString().ToUpper()
                });
                ds.Dispose();



                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)//
            {
                throw ex;

            }

        }
    }
}