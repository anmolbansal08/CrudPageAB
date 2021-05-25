using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data;
using ClosedXML.Excel;
using System.IO;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlashCargoWebApps.Controllers
{
    public class MarineInsuranceReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: MarineInsuranceReport
        public ActionResult Index()
        {
            return View();
        }
        //[HttpPost]
        //public ActionResult SearchMarineInsuranceReport([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, MarineInsuranceReport Model)
        //{
        //    try
        //    {
        //        string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
        //        string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

        //        if (string.IsNullOrEmpty(Model.Airline))
        //        {
        //            Model.Airline = "";
        //        }
        //        if (string.IsNullOrEmpty(Model.City))
        //        {
        //            Model.City = "";
        //        }
        //        if (string.IsNullOrEmpty(Model.Agent))
        //        {
        //            Model.Agent = "";
        //        }
        //        string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
        //        string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.MarineInsuranceReport>(filter);

        //        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //        System.Data.SqlClient.SqlParameter[] Parameters = {
        //                                                            new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
        //                                                            new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
        //                                                            new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.Airline),
        //                                                            new System.Data.SqlClient.SqlParameter("@CitySNo",Model.City),
        //                                                            new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.Agent),
        //                                                            new System.Data.SqlClient.SqlParameter("@UserSNo",Model.UserSNo),
        //                                                            new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
        //                                                            new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
        //                                                         };
        //        System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetMarineCargoInsuranceReport", Parameters);

        //        var MarineInsuranceList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.MarineInsuranceReport
        //        {
        //            No = e["No"].ToString().ToUpper(),
        //            BOREPORT = e["BOREPORT"].ToString().ToUpper(),
        //            GASALESatauCARGOASSISTANCE = e["GASALESatauCARGOASSISTANCE"].ToString().ToUpper(),
        //            customername = e["customername"].ToString().ToUpper(),
        //            AWB = e["AWB"].ToString().ToUpper(),
        //            ROUTE = e["ROUTE"].ToString().ToUpper(),
        //            FLIGHT = e["FLIGHT"].ToString().ToUpper(),
        //            DATE = e["DATE"].ToString().ToUpper(),
        //            PCS = e["PCS"].ToString().ToUpper(),
        //            Weight = e["Weight"].ToString().ToUpper(),
        //            Commodity = e["Commodity"].ToString().ToUpper(),
        //            DecleredvalueIDR = e["DecleredvalueIDR"].ToString().ToUpper(),
        //            CommodityClassification = e["CommodityClassification"].ToString().ToUpper(),
        //            CertificateNumber = e["CertificateNumber"].ToString().ToUpper(),
        //            PremiumRate = e["PremiumRate"].ToString().ToUpper(),
        //            PublishPremiumRate = e["PublishPremiumRate"].ToString().ToUpper(),
        //            ChargeablePremi = e["ChargeablePremi"].ToString().ToUpper(),
        //            ChargeableInsuranceRate = e["ChargeableInsuranceRate"].ToString().ToUpper(),
        //            MinimumPremiApplied = e["MinimumPremiApplied"].ToString().ToUpper(),
        //            NETRATE = e["NETRATE"].ToString().ToUpper(),
        //            ChargeableInsuranceRateForGA = e["ChargeableInsuranceRateForGA"].ToString().ToUpper(),
        //            GAFeeGeneral = (Convert.ToInt32(e["MinimumPremiApplied"])- Convert.ToInt32(e["ChargeableInsuranceRateForGA"])).ToString().ToUpper(),
        //            GAFeePremium = e["PremiumGAFee"].ToString().ToUpper(),
        //            //Formula = e["Formula"].ToString().ToUpper(),
        //            //Nominal = e["Nominal"].ToString().ToUpper(),
        //            //FormulaForGA = e["FormulaForGA"].ToString().ToUpper(),
        //            //NominalIDR = e["NominalIDR"].ToString().ToUpper(),
        //        });
        //        ds.Dispose();
        //        return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
        //        {
        //            Data = MarineInsuranceList.AsQueryable().ToList(),
        //            Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public ActionResult SearchMarineInsuranceReport(string Airline, string City, string FromDate, string ToDate, string Agent, string UserSNo)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
            DateTime fromdt = DateTime.ParseExact(FromDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            var fromdate_result = fromdt.ToString("yyyy-MM-dd");

            DateTime todt = DateTime.ParseExact(ToDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

            var todate_result = todt.ToString("yyyy-MM-dd");
            //CargoClaimReport_ objallotment;
            //List<CargoClaimReport_> CargoClaimReport_ = new List<CargoClaimReport_>();
            try
            {


                System.Data.SqlClient.SqlParameter[] Parameters ={
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",Airline),
                                                                     new System.Data.SqlClient.SqlParameter("@CitySNo",City),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",todate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",Agent),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo",UserSNo),


                                                                  };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetMarineCargoInsuranceReport_New", Parameters);

                dsrowsvalue = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetMarineCargoInsuranceReport_New"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            var result = new { Result = dsrowsvalue, ID = ds.Tables[0].Columns.Count, ROWSID = ds.Tables[0].Rows.Count };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, MarineInsuranceReport Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

                if (string.IsNullOrEmpty(Model.Airline))
                {
                    Model.Airline = "";
                }
                if (string.IsNullOrEmpty(Model.City))
                {
                    Model.City = "";
                }
                if (string.IsNullOrEmpty(Model.Agent))
                {
                    Model.Agent = "";
                }
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.MarineInsuranceReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.Airline),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySNo",Model.City),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.Agent),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo",Model.UserSNo),
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetMarineCargoInsuranceReportForExcel_New", Parameters);

                var MarineInsuranceList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.MarineInsuranceReport
                {
                    No = e["No"].ToString().ToUpper(),
                    BOREPORT = e["BOREPORT"].ToString().ToUpper(),
                    GASALESatauCARGOASSISTANCE = e["GASALESatauCARGOASSISTANCE"].ToString().ToUpper(),
                    customername = e["customername"].ToString().ToUpper(),
                    AWB = e["AWB"].ToString().ToUpper(),
                    ROUTE = e["ROUTE"].ToString().ToUpper(),
                    FLIGHT = e["FLIGHT"].ToString().ToUpper(),
                    DATE = e["DATE"].ToString().ToUpper(),
                    PCS = e["PCS"].ToString().ToUpper(),
                    Weight = e["Weight"].ToString().ToUpper(),
                    Commodity = e["Commodity"].ToString().ToUpper(),
                    CommodityClassification = e["CommodityClassification"].ToString().ToUpper(),
                    DecleredvalueIDR = e["DecleredvalueIDR"].ToString().ToUpper(),
                    CertificateNumber = e["CertificateNumber"].ToString().ToUpper(),
                    PremiumRate = e["PremiumRate"].ToString().ToUpper(),//Publish Rate
                    ChargeableInsuranceRate = e["ChargeableInsuranceRate"].ToString().ToUpper(),
                    MinimumPremiApplied = e["MinimumPremiApplied"].ToString().ToUpper(),
                    PublishPremiumRate = e["PublishPremiumRate"].ToString().ToUpper(),
                    ChargeablePremi = e["ChargeablePremi"].ToString().ToUpper(),
                    NETRATE = e["NETRATE"].ToString().ToUpper(),
                    ChargeableInsuranceRateForGA = e["ChargeableInsuranceRateForGA"].ToString().ToUpper(),
                    ChargeablePremiGAToInsurence = e["ChargeablePremiGAToInsurence"].ToString().ToUpper(),
                    PremiumGAFee = e["PremiumGAFee"].ToString().ToUpper(),
                    //Formula = e["Formula"].ToString().ToUpper(),
                    //Nominal = e["Nominal"].ToString().ToUpper(),
                    //FormulaForGA = e["FormulaForGA"].ToString().ToUpper(),
                    //NominalIDR = e["NominalIDR"].ToString().ToUpper(),
                });
                ds.Dispose();
                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = MarineInsuranceList.AsQueryable().ToList(),
                }, JsonRequestBehavior.AllowGet);
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
                Response.AddHeader("content-disposition", "attachment;filename=MarineInsuranceReport_'" + date + "'.xlsx");
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