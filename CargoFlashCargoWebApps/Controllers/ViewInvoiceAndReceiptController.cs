using CargoFlash.Cargo.Model.Report;
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
    public class ViewInvoiceAndReceiptController : Controller
    {
        // GET: ViewInvoiceAndReceipt
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetInvoiceByInvoiceNo([FromUri] string InvoiceNo)//,string AWBNo)
        {
            DataSet ds = new DataSet();
            IEnumerable<GenerateAndViewInvoice> ResponseList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@InvoiceNo",InvoiceNo)
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetCSRInvoiceByInvoiceNo", Parameters);


                ResponseList = ds.Tables[0].AsEnumerable().Select(e => new GenerateAndViewInvoice
                {
                    AirlineName = Convert.ToString(e["AirlineName"]),
                    GSA_CSA_AirlineName = Convert.ToString(e["GSA_CSA_AirlineName"]),
                    AirlineAddress = Convert.ToString(e["AirlineAddress"]),
                    Attention = Convert.ToString(e["Attention"]),
                    GSA_CSA_Address = Convert.ToString(e["GSA_CSA_Address"]),
                    GSA_CSA_Country = Convert.ToString(e["GSA_CSA_Country"]),
                    InvoiceARCode = Convert.ToString(e["InvoiceARCode"]),
                    InvoiceCurrency = Convert.ToString(e["InvoiceCurrency"]),
                    InvoiceDate = Convert.ToString(e["InvoiceDate"]),
                    InvoiceDueDate = Convert.ToString(e["InvoiceDueDate"]),
                    InvoiceNo = Convert.ToString(e["InvoiceNo"]),
                    InvoicePeriod = Convert.ToString(e["InvoicePeriod"]),
                    Remarks = Convert.ToString(e["Remarks"]),
                    AccountName = Convert.ToString(e["AccountName"]),
                    AccountNo = Convert.ToString(e["AccountNo"]),
                    BankAddress = Convert.ToString(e["BankAddress"]),
                    BankName = Convert.ToString(e["BankName"]),
                    IBAN = Convert.ToString(e["IBAN"]),
                    Swift = Convert.ToString(e["Swift"]),
                    SNo = Convert.ToInt32(e["SNo"]),
                    TotalAmlount = Convert.ToDecimal(e["TotalAmlount"]),
                    AirlineLogo = Convert.ToString(e["AirlineLogo"]),
                    IsInvoiceType =Convert.ToString(e["IsInvoiceType"]),
                    ExchangeRate=Convert.ToInt32(e["ExchangeRate"]),
                    //Commodity = Convert.ToString(e["Commodity"]),
                    CompanyName=Convert.ToString(e["CompanyName"])

                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = ResponseList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAWBStockHistoryReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}