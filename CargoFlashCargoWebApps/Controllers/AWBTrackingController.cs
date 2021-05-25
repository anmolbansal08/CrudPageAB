using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class TrackingController : Controller
    {
        //
        // GET: /AWBTracking/
        public ActionResult AWB(string id)
       {

            if (!string.IsNullOrEmpty(id))
            {
                    if (id.Split('-').Length > 1)                
                    ViewBag.AWBNo = id.Split('-')[1];
                    ViewBag.PreFix = id.Split('-')[0];
            
            }
           // ViewBag.Id = id;
            return View("AWBTracking");
        }






    }

}