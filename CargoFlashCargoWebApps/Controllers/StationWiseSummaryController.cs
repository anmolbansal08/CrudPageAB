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
using ClosedXML.Excel;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class StationWiseSummaryController : Controller
    {

        string vproc = "";
        //
        // GET: /StationWiseSummary/
        public ActionResult Index()
        {
            return View();
        }

       

        [HttpPost]
        public ActionResult StationWiseSummaryGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, StationWiseSummaryModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<StationWiseSummary>(filter);
            System.Data.DataSet dsSailySales = new DataSet();



            if (Model.BookingFilter.ToUpper() == "INVOICED")
                vproc = "spStationWiseSummary_getrecord";
            else
                vproc = "spStationWiseSummary_getrecord_Dep";

            IEnumerable<StationWiseSummary> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
																	new System.Data.SqlClient.SqlParameter("@AirportSNo",Model.Airport ==""?"0":Model.Airport)
                                                                    //,
                                                                    //new System.Data.SqlClient.SqlParameter("@DateType", Model.DateType) 
                                                              };

                dsSailySales = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, vproc, Parameters);
                if (dsSailySales.Tables.Count > 1 && dsSailySales.Tables != null)
                {
                    CommodityList = dsSailySales.Tables[0].AsEnumerable().Select(e => new StationWiseSummary
                    {
                        //SNo = Convert.ToInt32(e["SNo"]),
                        Station = e["CityCode"].ToString().ToUpper(),
                        GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                        ChargeableWeight = e["ChargeableWeight"].ToString().ToUpper()
                    });
                    dsSailySales.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsSailySales.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<StationWiseSummary>().ToList<StationWiseSummary>(),
                    Total = dsSailySales.Tables.Count > 1 ? Convert.ToInt32(dsSailySales.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spStationWiseSummary_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpPost]
        public ActionResult GetSumofCharges(StationWiseSummaryModel Model)
        {

            System.Data.DataSet dsSailySales = new DataSet();

          
			if(Model.BookingFilter==null)
				vproc = "spStationWiseSummary_SumOfcharges";
			else if (Model.BookingFilter.ToUpper() == "INVOICED")
                vproc = "spStationWiseSummary_SumOfcharges";
            else
                vproc = "spStationWiseSummary_SumOfcharges_Dep";
            IEnumerable<SumOfCharges> CommodityList = null;
            try
            {
				System.Data.SqlClient.SqlParameter[] Parameters = {
																   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
																	new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
																	new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
																	new System.Data.SqlClient.SqlParameter("@AirportSNo",Model.Airport ==""?"0":Model.Airport)
															  };

                dsSailySales = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, vproc, Parameters);
                if (dsSailySales.Tables.Count > 0 && dsSailySales.Tables != null)
                {
                    CommodityList = dsSailySales.Tables[0].AsEnumerable().Select(e => new SumOfCharges
                    {
                        SumOfGrossWeight = e["GrossWeight"].ToString().ToUpper(),
                        SumOfChargeableWeight = e["ChargeableWeight"].ToString().ToUpper()
                    });
                    dsSailySales.Dispose();
                }
                return Json(new DataSourceResult
                {
                    Data = dsSailySales.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<SumOfCharges>().ToList<SumOfCharges>()
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spStationWiseSummary_SumOfcharges"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


       
            public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, StationWiseSummaryModel Model)
        {

			// System.Data.DataSet ds = new DataSet();
			if (Model.BookingFilter == null)
				vproc = "spStationWiseSummary_getrecord";
			else if (Model.BookingFilter.ToUpper() == "INVOICED")
                vproc = "spStationWiseSummary_getrecord";
            else
                vproc = "spStationWiseSummary_getrecord_Dep";
          
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<StationWiseSummary>(filter);

           
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.DataSet ds = new DataSet(); 
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                    new System.Data.SqlClient.SqlParameter("@AirportSNo", Model.Airport)
                   
                                                              };

            try
            {
                 
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, vproc, Parameters);
                DataTable dt1 = ds.Tables[0];
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName",vproc),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
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
                Response.AddHeader("content-disposition", "attachment;filename=StationWiseSummary_'" + date + "'.xlsx");
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