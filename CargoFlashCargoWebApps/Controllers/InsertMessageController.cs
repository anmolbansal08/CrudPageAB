using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.Cargo.Model;
using CargoFlashCargoWebApps.ValidateAndInsertMessage;
using CargoFlash.Cargo.WebUI;

namespace CargoFlashCargoWebApps.Controllers
{
    public class InsertMessageController : Controller
    {
        //
        // GET: /InsertMessage/

        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();

        public ActionResult InsertMessage()
        {
           
            return View();
        }
        //public JsonResult  ValidateMessage(InsertEDImessage model)
        //{
        //    DataSet ds = new DataSet();
        //    string dsrowsvalue = string.Empty;
        //    string Msg;
        //    Msg = CargoFlash.Cargo.Business.Common.Base64ToString(model.TxtMessage);
        //    ////List<SlabRate> listAllotment = new List<SlabRate>();
        //    try
        //    {
        //        WebServiceEDIMSGValidateAndReturnDSSoapClient a = new WebServiceEDIMSGValidateAndReturnDSSoapClient();
        //       ds = a.ValidateMSGAndReturnDataSet(Msg, "TEST", "TEST", 0);

        //       if (ds == null || ds.Tables[0].Rows.Count == 0)
        //       {
        //           dsrowsvalue = "Message Validation Failed";
        //       }
        //       else
        //       {
        //           dsrowsvalue = "Data Inserted";
        //       }


        //    }

        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }
        //    string result = dsrowsvalue;
        //    return Json(result, JsonRequestBehavior.AllowGet);



        //}

        public class InsertEDImessage
        {
            public string TxtMessage{get;set;}
        }

	}
}