using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.SessionState;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using Image = System.Drawing.Image;

namespace CargoFlashCargoWebApps.Handler
{
    /// <summary>
    /// Summary description for UploadImage
    /// </summary>
    public class UploadImage : IHttpHandler, IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.QueryString["f"] != null && context.Request.QueryString["l"] != null)
            {
                DownloadFile(context.Request.QueryString["l"], context.Request.QueryString["f"]);
            }

            if (context.Request.QueryString["CustomerSNo"] != null && context.Request.QueryString["CustomerAuthorizedPERSONNELSNo"] != null)
            {
                DownloadAuthorizedPersonFile(context.Request.QueryString["CustomerSNo"], context.Request.QueryString["CustomerAuthorizedPERSONNELSNo"], context.Request.QueryString["FileName"], context.Request.QueryString["ImageId"]);
            }
            if (context.Request.QueryString["SpecialCargoSNo"] != null)
            {
                DownloaSpecialCargoDoc(context.Request.QueryString["SpecialCargoSNo"]);
            }
            if (context.Request.QueryString["Irr"] == "Delete")
            {
                string Finalfilename = context.Request.QueryString["filename"];
                string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                string path = BaseDirectory + "UploadImage\\";
                System.IO.File.Delete(Path.GetFullPath(path + Finalfilename));
            }

            if (context.Request.QueryString["Download"] == "Download")
            {
                if (context.Request.QueryString["ImageSNo"] == "a")
                {
                    DownloadFileIrregularity("UploadImage", context.Request.QueryString["filename"], ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                }
                else
                {
                    DownloadFileFromDBIrregularity(context.Request.QueryString["ImageSNo"], context.Request.QueryString["filename"]);
                }
            }

            if (context.Request.QueryString["Download"] == "DownloadImage" || context.Request.QueryString["Download"] == "DownloadInvoice")
            {
                DownloadFileFromDBULDRepair(context.Request.QueryString["Download"], context.Request.QueryString["attchmntSNo"]);
            }

            if (context.Request.QueryString["Irr"] == "Irregularity")
            {
                if (context.Request.Files.Count > 0)
                {
                    //string Finalfilename = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "_" + context.Request.QueryString["IrregularitySNo"] + "_" + context.Request.QueryString["IrregularityTransSNo"] + "_" + context.Request.QueryString["gridType"];

                    //if(Validation(Finalfilename) == false) return;
                    string allFileName = "";
                    string fileNames = "";
                    System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
                    String[] inputName = uploadedFile.AllKeys;
                    string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                    foreach (string upload in uploadedFile)
                    {
                        string path = BaseDirectory + "UploadImage\\";
                        string filename = Path.GetFileName(uploadedFile[upload].FileName);
                        string _Extension = Path.GetExtension(filename);
                        string UploadedFileName = "";
                        fileNames = fileNames + (fileNames == "" ? "" : "#UploadImage#") + filename;
                        UploadedFileName = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "_" + context.Request.QueryString["IrregularitySNo"] + "_" + context.Request.QueryString["IrregularityTransSNo"] + "_" + context.Request.QueryString["gridType"] + "_" + context.Request.QueryString["Position"] + "_" + System.Web.HttpContext.Current.Request.Url.Host + "_" + System.DateTime.UtcNow.ToString("dd-MMM-yyyy") + "_" + System.DateTime.UtcNow.ToLongTimeString().Replace(":", "-") + "_" + filename).Replace("\\", "$$").Replace("/", "@@");
                        if (System.IO.File.Exists(Path.GetFullPath(path + UploadedFileName)))
                        {
                            System.IO.File.Delete(Path.GetFullPath(path + UploadedFileName));
                        }
                        uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
                        allFileName = allFileName + (allFileName == "" ? "" : "#UploadImage#") + UploadedFileName;
                    }
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(allFileName + "#UploadImage#" + fileNames);
                    context.Response.End();
                }
            }
            else if (context.Request.QueryString["ULD"] == "ULDRepairReturnImage" || context.Request.QueryString["ULD"] == "ULDRepairReturnInvoice")
            {
                if (context.Request.Files.Count > 0)
                {
                    //string Finalfilename = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "_" + context.Request.QueryString["IrregularitySNo"] + "_" + context.Request.QueryString["IrregularityTransSNo"] + "_" + context.Request.QueryString["gridType"];

                    //if(Validation(Finalfilename) == false) return;
                    string allFileName = "";
                    string fileNames = "";
                    System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
                    String[] inputName = uploadedFile.AllKeys;
                    string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                    foreach (string upload in uploadedFile)
                    {
                        string path = BaseDirectory + "UploadImage\\";
                        string filename = Path.GetFileName(uploadedFile[upload].FileName);
                        string _Extension = Path.GetExtension(filename);
                        string UploadedFileName = "";
                        fileNames = fileNames + (fileNames == "" ? "" : "#UploadImage#") + filename;
                        UploadedFileName = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "_" + context.Request.QueryString["ULDRepairSNo"] + "_" + context.Request.QueryString["ULD"] + "_" + System.Web.HttpContext.Current.Request.Url.Host + "_" + System.DateTime.UtcNow.ToString("dd-MMM-yyyy") + "_" + System.DateTime.UtcNow.ToLongTimeString().Replace(":", "-") + "_" + filename).Replace("\\", "$$").Replace("/", "@@");
                        if (System.IO.File.Exists(Path.GetFullPath(path + UploadedFileName)))
                        {
                            System.IO.File.Delete(Path.GetFullPath(path + UploadedFileName));
                        }
                        uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
                        allFileName = allFileName + (allFileName == "" ? "" : "#UploadImage#") + UploadedFileName;
                    }
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(allFileName + "#UploadImage#" + fileNames);
                    context.Response.End();
                }
            }
            else
            {
                if (System.Web.HttpContext.Current.Session["UserDetail"] == null)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("Session has been expired!!!");
                    context.Response.End();
                    return;
                }
                if (context.Request.Files.Count > 0)
                {
                    string allFileName = "";
                    string fileNames = "";
                    System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
                    String[] inputName = uploadedFile.AllKeys;
                    string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                    foreach (string upload in uploadedFile)
                    {
                        string path = BaseDirectory + "UploadImage\\";
                        string filename = Path.GetFileName(uploadedFile[upload].FileName);
                        string _Extension = Path.GetExtension(filename);
                        string UploadedFileName = "";
                        fileNames = fileNames + (fileNames == "" ? "" : "#UploadImage#") + filename;
                        UploadedFileName = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "_" + System.Web.HttpContext.Current.Request.Url.Host + "_" + System.DateTime.UtcNow.ToString("dd-MMM-yyyy") + "_" + System.DateTime.UtcNow.ToLongTimeString().Replace(":", "-") + "_" + filename).Replace("\\", "$$").Replace("/", "@@");
                        if (System.IO.File.Exists(Path.GetFullPath(path + UploadedFileName)))
                        {
                            System.IO.File.Delete(Path.GetFullPath(path + UploadedFileName));
                        }
                        uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
                        allFileName = allFileName + (allFileName == "" ? "" : "#UploadImage#") + UploadedFileName;
                    }
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(allFileName + "#UploadImage#" + fileNames);
                    context.Response.End();
                }
            }
        }

        public static bool DownloadFile(string FileLocation, string FileName)
        {
            WebClient request = new WebClient();
            try
            {
                string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                string path = BaseDirectory + FileLocation + "\\";
                byte[] newFileData = request.DownloadData(path + FileName);
                string fileString = System.Text.Encoding.UTF8.GetString(newFileData);
                HttpResponse response = HttpContext.Current.Response;
                response.Clear();
                response.ClearContent();
                response.ContentType = "image/jpeg";
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

        public static bool DownloadAuthorizedPersonFile(string CustomerSNo, string CustomerAuthorizedPersonalSNo, string FileName, string ImageId)
        {

            try
            {
                SqlParameter[] Parameters = {
                                          new SqlParameter("@CustomerSNo", CustomerSNo),
                                          new SqlParameter("@CustomerAuthorizedPersonalSNo", CustomerAuthorizedPersonalSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAuthorizedImage", Parameters);
                if (ImageId == "IdCardAttachement")
                {
                    byte[] newFileData = (byte[])ds.Tables[0].Rows[0]["IdCardAttachement"];
                    HttpResponse response = HttpContext.Current.Response;
                    response.Clear();
                    response.ClearContent();
                    response.ClearHeaders();
                    response.Buffer = true;
                    response.AddHeader("Content-Disposition", "attachment;filename=\"" + FileName + "\"");
                    response.BinaryWrite(newFileData);
                    response.End();
                }
                else if (ImageId == "AuthorizationLetterAttachement")
                {
                    byte[] newFileData = (byte[])ds.Tables[0].Rows[0]["AuthorizationLetterAttachement"];
                    HttpResponse response = HttpContext.Current.Response;
                    response.Clear();
                    response.ClearContent();
                    response.ClearHeaders();
                    response.Buffer = true;
                    response.AddHeader("Content-Disposition", "attachment;filename=\"" + FileName + "\"");
                    response.BinaryWrite(newFileData);
                    response.End();
                }
                else if (ImageId == "PhotoAttachement")
                {
                    byte[] newFileData = (byte[])ds.Tables[0].Rows[0]["PhotoAttachement"];
                    HttpResponse response = HttpContext.Current.Response;
                    response.Clear();
                    response.ClearContent();
                    response.ClearHeaders();
                    response.Buffer = true;
                    response.AddHeader("Content-Disposition", "attachment;filename=\"" + FileName + "\"");
                    response.BinaryWrite(newFileData);
                    response.End();
                }
                // WebClient request = new WebClient(); 
                // string fileString = System.Text.Encoding.UTF8.GetString(newFileData);

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
            //WebClient request = new WebClient();
            //request.Credentials = new NetworkCredential(FTPConnection.FTPUserId, FTPConnection.FTPPassword);

            SqlParameter[] Parameters = {
                                          new SqlParameter("@ImageSNo", ImageSNo),
                                          new SqlParameter("@filename", filename)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetIrregularityImage", Parameters);
            try
            {
                //byte[] bytes = (byte[])ds.Tables[0].Rows[0]["UploadDocument"];
                //Image img = ByteArrayToImage(bytes);

                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.ContentType = "image/jpeg";
                //response.ContentType = "image/jpeg";
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["ImageName"].ToString());
                System.Web.HttpContext.Current.Response.BinaryWrite((byte[])ds.Tables[0].Rows[0]["UploadDocument"]);
                System.Web.HttpContext.Current.Response.End();

                //byte[] newFileData = (byte[])ds.Tables[0].Rows[0]["UploadDocument"];
                //HttpResponse response = HttpContext.Current.Response;
                //response.Clear();
                //response.ClearContent();
                //response.ClearHeaders();
                //response.Buffer = true;
                //response.AddHeader("Content-Disposition", "attachment;filename=" + ds.Tables[0].Rows[0]["ImageName"].ToString());
                //response.BinaryWrite(newFileData);
                //response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }

        //Added by Vinay
        public static bool DownloadFileIrregularity(string FileLocation, string FileName, string UserSNo)
        {
            WebClient request = new WebClient();
            try
            {
                string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                string path = BaseDirectory + FileLocation + "\\";
                string[] filePaths = Directory.GetFiles(path, "*.*");
                for (int i = 0; i < filePaths.Length; i++)
                {
                    string[] filename = Path.GetFileName(filePaths[i]).Split('_');
                    //int length = filename[0].Length;
                    //string FinalFileName1 = filename[0].Substring(filename[0].Length - 1);
                    string ab = UserSNo + "_" + System.Web.HttpContext.Current.Request.QueryString["irregularitySNo"] + "_" + System.Web.HttpContext.Current.Request.QueryString["IrregularityTransSNo"] + "_" + System.Web.HttpContext.Current.Request.QueryString["position"];
                    string FinalFileName = filename[0] + "_" + filename[1] + "_" + filename[2] + "_" + filename[4];
                    if (FinalFileName == ab)
                    {
                        string UploadFileName = Path.GetFileName(filePaths[i]);
                        byte[] newFileData = request.DownloadData(path + UploadFileName);
                        string fileString = System.Text.Encoding.UTF8.GetString(newFileData);
                        HttpResponse response = HttpContext.Current.Response;
                        response.Clear();
                        response.ClearContent();
                        response.ContentType = "image/jpeg";
                        response.ClearHeaders();
                        response.Buffer = true;
                        response.AddHeader("Content-Disposition", "attachment;filename=\"" + FileName + "\"");
                        response.BinaryWrite(newFileData);
                        response.End();
                        //var serverPath = filePaths[i];
                        i = filePaths.Length;
                    }
                }
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }

        public static bool DownloaSpecialCargoDoc(string SpecialCargoSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                          new SqlParameter("@SpecialCargoSNo", SpecialCargoSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSpecialCargoDoc", Parameters);
                byte[] newFileData = (byte[])ds.Tables[0].Rows[0]["Document"];
                HttpResponse response = HttpContext.Current.Response;
                response.Clear();
                response.ClearContent();
                response.ClearHeaders();
                response.Buffer = true;
                response.AddHeader("Content-Disposition", "attachment;filename=\"" + ds.Tables[0].Rows[0]["ImageName"].ToString() + "\"");
                response.BinaryWrite(newFileData);
                response.End();
            }
            catch (WebException e)
            {

            }
            return true;
        }

        public static bool DownloadFileFromDBULDRepair(string DownloadLink, string attchmntSNo)
        {

            try
            {
                SqlParameter[] Parameters = {
                                          new SqlParameter("@attchmntSNo", attchmntSNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetReturnULDRepairImage", Parameters);
                byte[] newFileData = (byte[])ds.Tables[0].Rows[0]["UploadDocument"];
                HttpResponse response = HttpContext.Current.Response;
                response.Clear();
                response.ClearContent();
                response.ClearHeaders();
                response.Buffer = true;
                response.AddHeader("Content-Disposition", "attachment;filename=\"" + ds.Tables[0].Rows[0]["ImageName"] + "\"");
                response.BinaryWrite(newFileData);
                response.End();
            }
            catch (WebException e)
            {
                //Console.WriteLine(e.ToString());
            }
            return true;
        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        public Image ByteArrayToImage(byte[] byteArrayIn)
        {
            MemoryStream ms = new MemoryStream(byteArrayIn);
            ms.Position = 0;
            Image returnImage = Image.FromStream(ms);
            return returnImage;
        }

        //private bool Validation(string Finalfilename)
        //{
        //    bool a = true;
        //    System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
        //    String[] inputName = uploadedFile.AllKeys;
        //    string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
        //    foreach (string upload in uploadedFile)
        //    {
        //        string path = BaseDirectory + "UploadImage\\";
        //        string filename = Path.GetFileName(uploadedFile[upload].FileName);
        //        string[] filePaths = Directory.GetFiles(path, "*.*");
        //        for (int i = 0; i < filePaths.Length; i++)
        //        {
        //            string[] newfilename = Path.GetFileName(filePaths[i]).Split('_');
        //            string existFinalFileName = newfilename[0] + "_" + newfilename[1] + "_" + newfilename[2] + "_" + newfilename[3];
        //            //string Finalfilename = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "_" + context.Request.QueryString["IrregularitySNo"] + "_" + context.Request.QueryString["IrregularityTransSNo"] + "_" + context.Request.QueryString["gridType"];
        //            if (Finalfilename == existFinalFileName)
        //            {
        //                if (filename == newfilename[7])
        //                {
        //                    i = filePaths.Length;
        //                    a = false;
        //                }
        //                else
        //                {
        //                    a = true;
        //                }
        //            }
        //        }
        //    }

        //    return a;
        //}
    }
}