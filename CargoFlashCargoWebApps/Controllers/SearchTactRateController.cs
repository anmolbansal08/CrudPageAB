using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.Cargo.Model;

namespace CargoFlashCargoWebApps.Controllers
{
    public class SearchTactRateController : Controller
    {
        //
        // GET: /SearchTactRate/

        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();

        public ActionResult SearchTactRate()
        {
            return View();
        }

        public ActionResult GetTactRate_Slab(string Origin, string Destination, string Carrier)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
          
            List<SlabRate> listAllotment = new List<SlabRate>();
            try
            {


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@OriginCity",(Origin)),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationCity", (Destination)),
                                                                    new System.Data.SqlClient.SqlParameter("@CarrierCode", (Carrier))
                                                                 
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "Usp_GetTactRate_slab", Parameters);



                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Columns.Contains("N"))
                        ds.Tables[0].Columns.Remove("N");
                    if (ds.Tables[0].Columns.Contains("11-45"))
                        ds.Tables[0].Columns.Remove("11-45");
                    if (ds.Tables[0].Columns.Contains("46-100"))
                        ds.Tables[0].Columns.Remove("46-100");
                    if (ds.Tables[0].Columns.Contains("101-500"))
                        ds.Tables[0].Columns.Remove("101-500");
                    if (ds.Tables[0].Columns.Contains("501-1000"))
                        ds.Tables[0].Columns.Remove("501-1000");
                    if (ds.Tables[0].Columns.Contains("1001-999999"))
                        ds.Tables[0].Columns.Remove("1001-999999");
                    if (ds.Tables[0].Columns.Contains("Rates"))
                        ds.Tables[0].Columns.Remove("Rates");
                    if (ds.Tables[0].Columns.Contains("RateSNo"))
                        ds.Tables[0].Columns.Remove("RateSNo");
                    dsrowsvalue = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

                }
              

            }

            catch (Exception ex)
            {


            }
            var result = new { Result = dsrowsvalue, ID = ds.Tables[0].Columns.Count, ROWSID = ds.Tables[0].Rows.Count };
            return Json(result, JsonRequestBehavior.AllowGet);



        }

        public class SlabRate
        {
            public int TactRateSNO { get; set; }
            public string CarrierCode { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
            public string SlabName { get; set; }
            public decimal Rate { get; set; }

        }
    }
}