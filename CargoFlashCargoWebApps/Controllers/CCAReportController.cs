using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model.Export;
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlashCargoWebApps.Controllers
{
    public class CCAReportController : Controller
    {
        //
        // GET: /CCAReport/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetCCARecord(CCAReportRequestModel Model)
        {

            try
            {
                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = { 

                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@StatusType",Model.StatusType),
                                                                     new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     new System.Data.SqlClient.SqlParameter("@UserId", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                                     new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CCASNo",Model.CCASNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess)
                                                              };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spCCAReport_GetRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Shipment.CCAReport
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CCANo = e["CCANo"].ToString().ToUpper(),
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    flightno = e["flightno"].ToString().ToUpper(),
                    CCAGrossWeight = e["CCAGrossWeight"].ToString().ToUpper(),
                    CCAPieces = e["CCAPieces"].ToString().ToUpper(),
                    CCAVolume = e["CCAVolume"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    Status = e["Status"].ToString().ToUpper(),
                    CreatedBy = e["CreatedUser"].ToString().ToUpper(),
                    UpdatedUser = e["UpdatedUser"].ToString().ToUpper()
                });
                ds.Dispose();



                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCCAReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}