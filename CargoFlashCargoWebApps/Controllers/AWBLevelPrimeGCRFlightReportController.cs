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
using System.ServiceModel.Web;
using System.Net;
using ClosedXML.Excel;

namespace CargoFlashCargoWebApps.Controllers
{
    public class AWBLevelPrimeGCRFlightReportController : Controller
    {
        //
        // GET: /AgentStockReport/
        public ActionResult Index()
        {
            return View();
        }

        public void GetRecordInExcel(string FromDate, string ToDate, string CustomerType, string CityCode, string AgentCode, string BasedOn, string CarrierCode)
        {
            try
            {


                System.Data.DataSet ds = new DataSet();

                string connectionString = CargoFlash.SoftwareFactory.Data.CRAConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@CustomerType",CustomerType),
                                                                    new System.Data.SqlClient.SqlParameter("@CityCode",CityCode),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentCode",AgentCode),
                                                                    new System.Data.SqlClient.SqlParameter("@BasedOn",BasedOn),
                                                                    new System.Data.SqlClient.SqlParameter("@CarrierCode",CarrierCode)
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "AWBLevelPrimeGCRFlightReport", Parameters);


                DataTable dt1 = ds.Tables[0];
                
                ConvertDSToExcel_Success(dt1, 0);

            }

            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","AWBLevelPrimeGCRFlightReport"),
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
                Response.AddHeader("content-disposition", "attachment;filename=AWB Flown Report_'" + date + "'.xlsx");
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