using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.Report;
using System.ServiceModel.Web;
using System.Net;
using CargoFlash.Cargo.Model.Reservation;
namespace CargoFlashCargoWebApps.Controllers
{
    public class FlightWisePerformanceReportController : Controller
    {
        //
        // GET: /FlightWisePerformanceReport/
        public ActionResult Index()
        {
            return View();
        }

        public string FlightWisePerformanceReportGetRecord(FlightWisePerformanceRequestModel Model)
        {


            System.Data.DataSet ds = new DataSet();

            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@Month",Model.Month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",Model.Year),
                                                                    new System.Data.SqlClient.SqlParameter("@ChargeType",Model.Type)
                                                              };

            try
            {

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_FlightWisePerformanceReport", Parameters);

                if (ds.Tables.Count > 0 && ds.Tables[0] != null)
                {
                    for (int rowIndex = 0; rowIndex < ds.Tables[0].Rows.Count; rowIndex++)
                    {
                        for (int colums = 0; colums < ds.Tables[0].Columns.Count; colums++)
                        {
                            if (ds.Tables[0].Rows[rowIndex][colums].ToString() == "")
                            {
                                ds.Tables[0].Rows[rowIndex][colums] = "0.00";
                            }
                        }
                    }
                }


                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_FlightWisePerformanceReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }





        public void ExportToExcel(string airlineCode, string Month, string Year, int Type)
        {

            System.Data.DataSet ds = new DataSet();

            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineCode),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@Month",Month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",Year),
                                                                    new System.Data.SqlClient.SqlParameter("@ChargeType",Type)
                                                                   
                                                              };
            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_FlightWisePerformanceReport", Parameters);

                for (int rowIndex = 0; rowIndex < ds.Tables[0].Rows.Count; rowIndex++)
                {
                    for (int colums = 0; colums < ds.Tables[0].Columns.Count; colums++)
                    {
                        if (ds.Tables[0].Rows[rowIndex][colums].ToString() == "")
                        {
                            ds.Tables[0].Rows[rowIndex][colums] = "0.00";
                        }
                    }
                }


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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_FlightWisePerformanceReport"),
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
                Response.AddHeader("content-disposition", "attachment;filename=FlightWisePerformanceReport_'" + date + "'.xlsx");
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