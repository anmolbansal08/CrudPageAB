using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Drawing;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System.IO;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;
using CargoFlash.SoftwareFactory.Data;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class BLOBUploadAndDownloadController : Controller
    {
        // GET: BLOBUploadAndDownload
        [HttpPost]
        public ActionResult UploadToBlob()
        {
            try
            {
                HttpFileCollectionBase files = Request.Files;
                if (files.Count > 0)
                {
                string containerName = "";
                string StorageName = "";
                string key = "";
                GetCredentials(out StorageName, out key, out containerName);
                if (StorageName =="" || key== "" || containerName=="")
                    {
                        return Json("Error", JsonRequestBehavior.AllowGet);
                    }
                StorageCredentialsAccountAndKey cred = new StorageCredentialsAccountAndKey(StorageName, key);
                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, false);
                CloudBlobClient blobClient = new CloudBlobClient(storageAccount.BlobEndpoint.AbsoluteUri, cred);
                CloudBlobContainer blobContainer = blobClient.GetContainerReference(containerName);
                blobContainer.CreateIfNotExist();
                    string fname; string outputurl;
                    //string path = AppDomain.CurrentDomain.BaseDirectory + "Uploads/";  
                    //string filename = Path.GetFileName(Request.Files[i].FileName);  

                    HttpPostedFileBase file = files[0];


                        // Checking for Internet Explorer  
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = files.AllKeys[0].ToString();
                        }


                        fname = fname.Replace(' ', '_').ToLower();

                        CloudBlob blob = blobContainer.GetBlobReference(fname.ToLower());
                        
                        blob.Properties.ContentType = file.ContentType;
                        blob.UploadFromStream(file.InputStream);
                        var a= System.Text.Encoding.UTF8.GetBytes("https://" + StorageName + ".blob.core.windows.net/" + containerName + "/" + fname.ToLower());
                        outputurl= System.Convert.ToBase64String(a);



                    return Json(outputurl, JsonRequestBehavior.AllowGet);
                }
            
                else
                    {
                        return Json("Error", JsonRequestBehavior.AllowGet);
                    }
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetCredentialsForAzureStorage"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public FileResult DownloadFromBlob(string filenameOrUrl)
        {
            try
            {
                filenameOrUrl = CargoFlash.Cargo.Business.Common.Base64ToString(filenameOrUrl);
                string storageName = "";
                string storgkey = "";
                string containerName = "";
                GetCredentials(out storageName, out storgkey, out containerName);
                if(storageName=="" || storgkey=="" || containerName=="")
                {
                    return null;
                }
                string str = filenameOrUrl;
                if (filenameOrUrl.Contains('/'))
                {
                    // filenameOrUrl = filenameOrUrl.ToLower();
                    containerName = filenameOrUrl.Substring(filenameOrUrl.IndexOf("windows.net") + ("windows.net".Length) + 1, filenameOrUrl.LastIndexOf('/') - filenameOrUrl.IndexOf("windows.net") - ("windows.net".Length) - 1);
                    filenameOrUrl = filenameOrUrl.Substring(filenameOrUrl.LastIndexOf('/') + 1);
                    filenameOrUrl = filenameOrUrl.Replace(' ', '_').ToLower();
                }
                byte[] downloadStream = null;
                StorageCredentialsAccountAndKey cred = new StorageCredentialsAccountAndKey(storageName, storgkey);
                //  create a blob client.

                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, false);
                CloudBlobClient blobClient = new CloudBlobClient(storageAccount.BlobEndpoint.AbsoluteUri, cred);
                
                    CloudBlob blob = blobClient.GetBlobReference(string.Format("{0}/{1}", containerName, filenameOrUrl));
                //if(blob)
                    downloadStream = blob.DownloadByteArray();
                  
                    return File(downloadStream,System.Net.Mime.MediaTypeNames.Application.Octet,System.IO.Path.GetFileName(filenameOrUrl));
                    
               
            }
            catch (Exception ex)
            {
               
                throw ex;
            }

        }

        public static void GetCredentials(out string account, out string key, out string container)
        {
            account = ""; key = ""; container = "";
            SqlParameter[] Parameters = { };
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCredentialsForAzureStorage", Parameters);
                DataTable dt = ds.Tables[0];

                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["Syskey"].ToString().ToUpper() == "AZUREACCOUNT")
                    {
                        account = dr["Sysvalue"].ToString();
                    }
                    if (dr["Syskey"].ToString().ToUpper() == "AZUREKEY")
                    {
                        key = dr["Sysvalue"].ToString();
                    }
                    if (dr["Syskey"].ToString().ToUpper() == "AZURECONTAINER")
                    {
                        container = dr["Sysvalue"].ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetCredentialsForAzureStorage"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}