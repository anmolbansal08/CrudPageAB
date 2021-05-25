using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class InterlineFlownShipmentsController : Controller
    {
        // GET: InterlineFlownShipments
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetInterlineFlownShipmentDetail([FromUri]string FromDate, string ToDate, int InterlineCarrier)//,string AWBNo)
        {
            DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@InterlineCarrier",InterlineCarrier)
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetInterlineFlownShipmentDetail", Parameters);
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetInterlineFlownShipmentDetail_Summary"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public JsonResult GetInterlineFlownShipmentDetail_Summary([FromUri]string FromDate, string ToDate, int InterlineCarrier)//,string AWBNo)
        {
            DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@InterlineCarrier",InterlineCarrier)
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetInterlineFlownShipmentDetail_Summary", Parameters);
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetInterlineFlownShipmentDetail_Summary"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}