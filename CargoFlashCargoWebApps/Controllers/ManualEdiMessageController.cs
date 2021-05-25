using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.DataService.Common;
using System.ServiceModel.Web;
using System.Net;
using CargoFlash.SoftwareFactory.Data;
//using CargoFlashCargoWebApps.ManualEdiMessage;

namespace CargoFlashCargoWebApps.Controllers
{
    public class ManualEdiMessageController : Controller
    {
        //
        // GET: /ManualEdiMessage/

        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public ActionResult Index()
        {
            return View();
        }

        public string SendMailRequest(ManualEdiMessage model)
        {
            try
            {
                string msg = CargoFlash.Cargo.Business.Common.Base64ToString(model.Message);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@MsgType", model.MsgType),
                                                                  new System.Data.SqlClient.SqlParameter("@MsgSubType", model.MsgSubType) ,
                                                                  new System.Data.SqlClient.SqlParameter("@Version", model.TxtVersion) ,
                                                                  new System.Data.SqlClient.SqlParameter("@Message", msg),
                                                                      new System.Data.SqlClient.SqlParameter("@Email", model.Email) ,
                                                                  new System.Data.SqlClient.SqlParameter("@SitaId", model.SitaId),
                                                                  new System.Data.SqlClient.SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.Edi_Generate_SendMailRequest", Parameters);
                if (ds == null || ds.Tables[0].Rows.Count == 0)
                {
                    return "1";
                }
                else {
                return ds.Tables[0].Rows[0][0].ToString();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        
       
    }
}