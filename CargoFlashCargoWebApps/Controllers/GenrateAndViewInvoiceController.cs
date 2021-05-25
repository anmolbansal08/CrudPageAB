using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage.File;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class GenrateAndViewInvoiceController : Controller
    {
        // GET: GenrateAndViewInvoice
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult GetSendMailDetails([FromUri]int AirlineSNo, int OfficeSNo, string month, string year = null, string Fortnight = null, string CurrencySNo=null)
        {
            DataSet ds = new DataSet();
            IEnumerable<SendMailDetails> ResponseList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Month",month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",year),
                                                                    new System.Data.SqlClient.SqlParameter("@Fortnight",Fortnight),
                                                                    new System.Data.SqlClient.SqlParameter("@CurrencySNo",Convert.ToInt32(CurrencySNo))
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetSendMailDetails", Parameters);


                ResponseList = ds.Tables[0].AsEnumerable().Select(e => new SendMailDetails
                {
                    GSA_CSA_AirlineName = Convert.ToString(e["GSA_CSA_AirlineName"]),
                    EmailID=Convert.ToString(e["EmailID"]),
                    InvoiceNo = Convert.ToString(e["InvoiceNo"]),
                    InvoiceSNo = Convert.ToInt32(e["InvoiceSNo"]),
                    IsChecked = Convert.ToBoolean(e["IsChecked"]),
                    MailSubject=Convert.ToString(e["MailSubject"])
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
        [System.Web.Mvc.HttpPost]
        public JsonResult saveSendMailDetail([FromBody] List<SaveMailDetails> MailDetails)
        {
            DataTable dtSendMailInfo = CollectionHelper.ConvertTo(MailDetails, "");
            SqlParameter paramSendMailInfo = new SqlParameter();
            paramSendMailInfo.ParameterName = "@SendMailInfo";
            paramSendMailInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramSendMailInfo.Value = dtSendMailInfo;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramSendMailInfo};
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "saveSendMailDetail", Parameters);
           return Json(Convert.ToString(ds.Tables[0].Rows[0][0]), JsonRequestBehavior.AllowGet);
        }

        
     
        public ActionResult GetInvoiceDetail([FromUri]int AirlineSNo,int OfficeSNo,string month,string year=null,string Fortnight=null, string CurrencySNo=null, string InvoiceNo = null)//,string AWBNo)
        {
            DataSet ds = new DataSet();
            IEnumerable<GenerateAndViewInvoice> ResponseList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Month",month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",year),
                                                                    new System.Data.SqlClient.SqlParameter("@Fortnight",Fortnight),
                                                                     new System.Data.SqlClient.SqlParameter("@CurrencySNo",Convert.ToInt32(CurrencySNo)),
                                                                    new System.Data.SqlClient.SqlParameter("@InvoiceNo",InvoiceNo)
                                                                   
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetCSRInvoiceDetails", Parameters);
               

                ResponseList = ds.Tables[0].AsEnumerable().Select(e => new GenerateAndViewInvoice
                { AirlineName=Convert.ToString(e["AirlineName"]),
                    GSA_CSA_AirlineName = Convert.ToString(e["GSA_CSA_AirlineName"]),
                    AirlineAddress = Convert.ToString(e["AirlineAddress"]),
                    Attention = Convert.ToString(e["Attention"]),
                    GSA_CSA_Address = Convert.ToString(e["GSA_CSA_Address"]),
                    GSA_CSA_Country = Convert.ToString(e["GSA_CSA_Country"]),
                    InvoiceARCode = Convert.ToString(e["InvoiceARCode"]),
                    InvoiceCurrency = Convert.ToString(e["InvoiceCurrency"]),
                    ConvertedCurrency = Convert.ToString(e["ConvertedCurrency"]),
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
                    AirlineLogo=Convert.ToString(e["AirlineLogo"]),
                    InvoiceDays = Convert.ToInt32(e["InvoiceDays"]),
                   IsInvoiceType = Convert.ToString(e["IsInvoiceType"]),
                    ExchangeRate = Convert.ToInt32(e["ExchangeRate"]),
                    //Commodity =Convert.ToString(e["Commodity"])
                    //CompanyName = Convert.ToString(e["CompanyName"]),


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




        public string GetCurrencyInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOfficeInformation", Parameters);
                ds.Dispose();

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        /*
        public string DownloadFileCloudStorage(string fileName)
        {
            // Parse the connection string for the storage account.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

            // Create a CloudFileClient object for credentialed access to Azure Files.
            CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

            // Get a reference to the file share we created previously.
            CloudFileShare share = fileClient.GetShareReference("crastorage");

            // Ensure that the share exists.
            if (share.Exists())
            {
                // Get a reference to the root directory for the share.
                CloudFileDirectory rootDir = share.GetRootDirectoryReference();

                // Get a reference to the directory we created previously.
                CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("emaillog");

                // Ensure that the directory exists.
                if (sampleDir.Exists())
                {
                    // Get a reference to the file we created previously.
                    CloudFile sourceFile = sampleDir.GetFileReference(fileName);

                    // Ensure that the source file exists.
                    if (sourceFile.Exists())
                    {
                        string filePath = System.Configuration.ConfigurationManager.AppSettings["LocalFilePath"].ToString() + "\\" + fileName;
                        Stream fileStream = new FileStream(filePath, FileMode.Create);
                        sourceFile.DownloadToStream(fileStream);
                        fileStream.Close();

                        return filePath;
                    }
                }
            }
            return string.Empty;
        }
public string UploadFileCloudStorage(string fileName, Stream ms)
        {
            //async Task< string >
            //await Task.Delay(100).ConfigureAwait(false);
            // Parse the connection string for the storage account.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

            // Create a CloudFileClient object for credentialed access to Azure Files.
            CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

            // Get a reference to the file share we created previously.
            CloudFileShare share = fileClient.GetShareReference("crastorage");

            // Ensure that the share exists.
            if (share.Exists())
            {
                // Get a reference to the root directory for the share.
                CloudFileDirectory rootDir = share.GetRootDirectoryReference();

                // Get a reference to the directory we created previously.
                CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("emaillog");

                // Ensure that the directory exists.
                if (sampleDir.Exists())
                {
                    // Get a reference to the file we created previously.
                    CloudFile sourceFile = sampleDir.GetFileReference(fileName);

                    ms.Seek(0, SeekOrigin.Begin);

                    sourceFile.SetProperties();

                    // Ensure that the source file exists.
                    //if (sourceFile.Exists())
                    //{
                    sourceFile.UploadFromStream(ms);
                    //}
                }
            }
            return string.Empty;
        }
        */
    }
}