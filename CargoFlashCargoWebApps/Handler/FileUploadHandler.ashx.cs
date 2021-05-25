using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlashCargoWebApps.Handler
{
    /// <summary>
    /// Summary description for FileUploadHandler
    /// </summary>
    public class FileUploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.UrlReferrer.Query.IndexOf("Apps=uldout&FormAction=INDEXVIEW") > 0)
            {
                if (context.Request.QueryString["ULDImage"] == "DBULDIMAGE")
                    DownloadFileFromDBULDIMAGE(context.Request.QueryString["FlagSNo"].ToString());
                else
                    UldOutImageUpload(context);
            }
            else if (context.Request.UrlReferrer.Query.IndexOf("Apps=LUC&FormAction=INDEXVIEW") > 0)
            {
                if (context.Request.QueryString["ULDImage"] == "DBAuthorityIMAGE")
                    DownloadFileFromAuthorityIMAGE(context.Request.QueryString["FlagSNo"].ToString());
                else if (context.Request.QueryString["ULDImage"] == "DocumentIMAGE")
                    DownloadFileFromDocumentIMAGE(context.Request.QueryString["FlagSNo"].ToString());
                else
                    LUCImageUpload(context);
            }
            else
            {
                if (context.Request.QueryString["f"] != null && context.Request.QueryString["l"] != null)
                {
                    DownloadFile(context.Request.QueryString["l"], context.Request.QueryString["f"]);
                }
                if (context.Request.QueryString["Download"] == "Download")
                {
                    if (context.Request.QueryString["ImageSNo"] != "undefined" || context.Request.QueryString["ImageSNo"] != "0")
                    {
                        DownloadFileFromDBIrregularity(context.Request.QueryString["ImageSNo"], context.Request.QueryString["filename"]);
                    }
                    else
                    {
                        DownloadFile("UploadImage", context.Request.QueryString["filename"]);
                    }
                }
                if (context.Request.QueryString["DocSNo"] != null && context.Request.QueryString["DocFlag"] != null)
                {
                    DownloadFileFromDB(context.Request.QueryString["DocSNo"], context.Request.QueryString["DocFlag"]);
                }
                //Added By Tarun
                if (context.Request.QueryString["ImportDocSNo"] != null && context.Request.QueryString["ImportDocFlag"] != null)
                {
                    DownloadFileFromDBImport(context.Request.QueryString["ImportDocSNo"], context.Request.QueryString["ImportDocFlag"]);
                }
                //END By Tarun
                if (context.Request.Files.Count > 0)
                {
                    //HttpFileCollection files = context.Request.Files;
                    //for (int i = 0; i < files.Count; i++)
                    //{
                    //    HttpPostedFile file = files[i];
                    //    string fname = context.Server.MapPath("~/HtmlForm/" + context.Request.Files.AllKeys[0]);
                    //    file.SaveAs(fname);
                    //}
                    //context.Response.ContentType = "text/plain";
                    //context.Response.Write("File Uploaded Successfully!");
                    string allFileName = "";
                    string fileNames = "";
                    System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
                    String[] inputName = uploadedFile.AllKeys;
                    string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                    foreach (string upload in uploadedFile)
                    {
                        //if (!Request.Files[upload].HasFile()) continue;
                        string path = BaseDirectory + "e-Dox\\";
                        string filename = Path.GetFileName(uploadedFile[upload].FileName);

                        string _Extension = Path.GetExtension(filename);
                        string UploadedFileName = "";
                        //Checking for the extentions, if XLS connect using Jet OleDB

                        fileNames = fileNames + (fileNames == "" ? "" : "#e-dox#") + filename;

                        UploadedFileName = (System.Web.HttpContext.Current.Request.Url.Host + "_" + System.DateTime.UtcNow.ToString("dd-MMM-yyyy") + "_" + System.DateTime.UtcNow.ToLongTimeString().Replace(":", "-") + "_" + filename).Replace("\\", "$$").Replace("/", "@@").Replace("&","@");
                        if (System.IO.File.Exists(Path.GetFullPath(path + UploadedFileName)))
                        {
                            // Delete our file
                            System.IO.File.Delete(Path.GetFullPath(path + UploadedFileName));
                        }
                        uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
                        allFileName = allFileName + (allFileName == "" ? "" : "#e-dox#") + UploadedFileName;
                    }
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(allFileName + "#eDox#" + fileNames);
                }
            }


        }
        public static bool DownloadFile(string FileLocation, string FileName)
        {
            // The serverUri parameter should start with the ftp:// scheme. 

            // Get the object used to communicate with the server.
            WebClient request = new WebClient();

            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);
            try
            {
                string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                string path = BaseDirectory + FileLocation + "\\";

                byte[] newFileData = request.DownloadData(path + FileName);
                string fileString = System.Text.Encoding.UTF8.GetString(newFileData);
                HttpResponse response = HttpContext.Current.Response;
                response.Clear();
                response.ClearContent();
                response.ClearHeaders();
                response.Buffer = true;
                response.AddHeader("Content-Disposition", "attachment;filename=\"" + FileName + "\"");
                response.BinaryWrite(newFileData);
                response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }

        public static bool DownloadFileFromDB(string DocSNo, string DocFlag)
        {
            // The serverUri parameter should start with the ftp:// scheme. 
            // Get the object used to communicate with the server.
            WebClient request = new WebClient();
            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);

            SqlParameter[] Parameters = {
                                          new SqlParameter("@DocSNo", DocSNo),
                                          new SqlParameter("@DocFlag", DocFlag)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetEdoxFile", Parameters);
            try
            {
                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["FileName"].ToString());
                System.Web.HttpContext.Current.Response.BinaryWrite((byte[])ds.Tables[0].Rows[0]["SampleDocument"]);
                System.Web.HttpContext.Current.Response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }
        //Added By Tarun
        public static bool DownloadFileFromDBImport(string DocSNo, string DocFlag)
        {
            // The serverUri parameter should start with the ftp:// scheme. 
            // Get the object used to communicate with the server.
            WebClient request = new WebClient();
            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);

            SqlParameter[] Parameters = {
                                          new SqlParameter("@DocSNo", DocSNo),
                                          new SqlParameter("@DocFlag", DocFlag)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetEdoxFileImport", Parameters);
            try
            {
                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["FileName"].ToString());
                System.Web.HttpContext.Current.Response.BinaryWrite((byte[])ds.Tables[0].Rows[0]["SampleDocument"]);
                System.Web.HttpContext.Current.Response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }
        //END By Tarun

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        public void UldOutImageUpload(HttpContext context)
        {
            if (context.Request.Files.Count > 0)
            {
                byte[] fileData;
                foreach (string upload in System.Web.HttpContext.Current.Request.Files)
                {
                    string[] fname = upload.Split('~');
                    String mimeType = System.Web.HttpContext.Current.Request.Files[upload].ContentType;
                    Stream filestream = System.Web.HttpContext.Current.Request.Files[upload].InputStream;
                    string filename = Path.GetFileName(System.Web.HttpContext.Current.Request.Files[upload].FileName);
                    int filelength = System.Web.HttpContext.Current.Request.Files[upload].ContentLength;
                    fileData = new byte[filelength];
                    filestream.Read(fileData, 0, filelength);
                    SqlParameter[] Parameters = {
                                          new SqlParameter("@ULDImage", fileData),
                                          new SqlParameter("@ULDSNo", fname[1]),
                                          new SqlParameter("@CreatedBy", fname[2]),
                                          new SqlParameter("@FName", fname[0])
                                        };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SetULDImage", Parameters);
                    context.Response.Write(ret);
                }
            }
        }

        public void LUCImageUpload(HttpContext context)
        {
            int ret = 0;
            if (context.Request.Files.Count > 0)
            {
                byte[] fileData;
                foreach (string upload in System.Web.HttpContext.Current.Request.Files)
                {
                    string[] fname = upload.Split('~');
                    String mimeType = System.Web.HttpContext.Current.Request.Files[upload].ContentType;
                    Stream filestream = System.Web.HttpContext.Current.Request.Files[upload].InputStream;
                    string filename = Path.GetFileName(System.Web.HttpContext.Current.Request.Files[upload].FileName);
                    int filelength = System.Web.HttpContext.Current.Request.Files[upload].ContentLength;
                    fileData = new byte[filelength];
                    filestream.Read(fileData, 0, filelength);
                    if (fname[2].ToString() == "Authority Letter Upload")
                    {
                        SqlParameter[] Parameters = {
                                          new SqlParameter("@UTUTSNo", fname[1]),
                                          new SqlParameter("@AuthorityLetter", fileData),
                                          new SqlParameter("@ALFName", fname[0])
                                        };
                        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SetTransferDocumentAuthorityLetter", Parameters);
                    }
                    else
                    {
                        SqlParameter[] Parameters = {
                                          new SqlParameter("@UTUTSNo", fname[1]),
                                          new SqlParameter("@UCRSignedDoc", fileData),
                                          new SqlParameter("@ALFName", fname[0])
                                        };
                        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SetTransferDocumentUCRDoc", Parameters);
                    }
                    context.Response.Write(ret);
                }
            }
        }
        public static bool DownloadFileFromDBULDIMAGE(string ULDSNO)
        {
            // The serverUri parameter should start with the ftp:// scheme. 
            // Get the object used to communicate with the server.
            WebClient request = new WebClient();
            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);

            SqlParameter[] Parameters = {
                                          new SqlParameter("@ULDSNO", ULDSNO)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_DownloadFileImage", Parameters);
            try
            {
                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["FName"].ToString());
                System.Web.HttpContext.Current.Response.BinaryWrite((byte[])ds.Tables[0].Rows[0]["ULDImage"]);
                System.Web.HttpContext.Current.Response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }

        public static bool DownloadFileFromAuthorityIMAGE(string ULDSNO)
        {
            // The serverUri parameter should start with the ftp:// scheme. 
            // Get the object used to communicate with the server.
            WebClient request = new WebClient();
            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);

            SqlParameter[] Parameters = {
                                          new SqlParameter("@UTUTSNo", ULDSNO)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_DownloadFileImageULDAuthorityLetter", Parameters);
            try
            {
                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["AuthorityLetterFName"].ToString());
                System.Web.HttpContext.Current.Response.BinaryWrite((byte[])ds.Tables[0].Rows[0]["AuthorityLetter"]);
                System.Web.HttpContext.Current.Response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }

        public static bool DownloadFileFromDocumentIMAGE(string ULDSNO)
        {
            // The serverUri parameter should start with the ftp:// scheme. 
            // Get the object used to communicate with the server.
            WebClient request = new WebClient();
            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);

            SqlParameter[] Parameters = {
                                          new SqlParameter("@UTUTSNo", ULDSNO)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_DownloadFileImageULDDocumentLetter", Parameters);
            try
            {
                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["ucrSignedDocFName"].ToString());
                System.Web.HttpContext.Current.Response.BinaryWrite((byte[])ds.Tables[0].Rows[0]["ucrSignedDoc"]);
                System.Web.HttpContext.Current.Response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }


        //Added by Vinay
        public static bool DownloadFileFromDBIrregularity(string ImageSNo, string filename)
        {
            // The serverUri parameter should start with the ftp:// scheme. 
            // Get the object used to communicate with the server.
            WebClient request = new WebClient();
            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);

            SqlParameter[] Parameters = {
                                          new SqlParameter("@ImageSNo", ImageSNo),
                                          new SqlParameter("@filename", filename)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetIrregularityImage", Parameters);
            try
            {
                //System.Web.HttpContext.Current.Response.Clear();
                //System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;ImageName=" + ds.Tables[0].Rows[0]["ImageName"].ToString());
                //System.Web.HttpContext.Current.Response.BinaryWrite((byte[])ds.Tables[0].Rows[0]["UploadDocument"]);
                //System.Web.HttpContext.Current.Response.End();

                byte[] newFileData = (byte[])ds.Tables[0].Rows[0]["UploadDocument"];
                HttpResponse response = HttpContext.Current.Response;
                response.Clear();
                response.ClearContent();
                response.ClearHeaders();
                response.Buffer = true;
                response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["ImageName"].ToString());
                response.BinaryWrite(newFileData);
                response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }

    }
}