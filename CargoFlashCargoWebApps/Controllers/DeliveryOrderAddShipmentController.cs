using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CargoFlash.Cargo.DataService.Import;

namespace CargoFlashCargoWebApps.Controllers
{
    public class DeliveryOrderAddShipmentController : Controller
    {
        // GET: DeliveryOrderAddShipment
        [HttpPost]
        public ActionResult addShipment()
        {
            try
            {
                return PartialView("DeliveryOrderAddShipment");
            }
            catch (Exception ex)
            {
                var a = ex;
                return View("DeliveryOrderAddShipment");
            }
           
        }
    }
}