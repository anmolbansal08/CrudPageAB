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
using CargoFlash.Cargo.Model.ULD;
using System.ServiceModel.Web;
using System.Net;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlashCargoWebApps.Controllers
{
    public class TACTsearchController : Controller
    {
        // GET: TACTsearch
        public ActionResult Index()
        {
            return View();
        }
    }
}