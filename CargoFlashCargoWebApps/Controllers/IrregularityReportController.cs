using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class IrregularityReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: IrregularityReport
        public ActionResult IrregularityReport()
        {
            return View();
        }
        public ActionResult GetIrregularityReport(string Status, string fromdate, string todate)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
            DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            var fromdate_result = fromdt.ToString("yyyy-MM-dd");

            DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

            var todate_result = todt.ToString("yyyy-MM-dd");
            //CargoClaimReport_ objallotment;
            //List<CargoClaimReport_> CargoClaimReport_ = new List<CargoClaimReport_>();
            try
            {


                System.Data.SqlClient.SqlParameter[] Parameters ={
                                                                    new System.Data.SqlClient.SqlParameter("@Status",Status),
                                                                    new System.Data.SqlClient.SqlParameter("@fromdate",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate_result),



                                                                  };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetIrregularityAWBReportRecord", Parameters);

                dsrowsvalue = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetIrregularityAWBReportRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetIrregularityAWBReportRecord", ParametersError);
                throw ex;
            }
            var result = new { Result = dsrowsvalue, ID = ds.Tables[0].Columns.Count, ROWSID = ds.Tables[0].Rows.Count };
            return Json(result, JsonRequestBehavior.AllowGet);

        }
    }
}