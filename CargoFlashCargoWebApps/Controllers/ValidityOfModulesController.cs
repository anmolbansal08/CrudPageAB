using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data;
using ClosedXML.Excel;
using System.IO;
using CargoFlash.Cargo.Model.Report;
using System.Data.SqlClient;

namespace CargoFlashCargoWebApps.Controllers
{
    public class ValidityOfModulesController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: ValidityOfModules
        public ActionResult Index()
        {
            return View();

        }
        [HttpPost]
        public string GetValidityOfModules(ValadityOfModuleModel Model)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@DurationSNo", Model.DurationSNo),
                                     new SqlParameter("@ModuleSNo", Model.ModuleSNo),                                    
            };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_GetValidityOfModules", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public ActionResult ExportToExcel(ValadityOfModuleModel Model)
        {
            try
            {




                SqlParameter[] param = { new SqlParameter("@DurationSNo", Model.DurationSNo),
                                     new SqlParameter("@ModuleSNo", Model.ModuleSNo),
            };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_GetValidityOfModules", param);
                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
                return Json(CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds));               
                
            }
            catch (Exception ex)
            {
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
                Response.AddHeader("content-disposition", "attachment;filename=Report_'" + date + "'.xlsx");
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