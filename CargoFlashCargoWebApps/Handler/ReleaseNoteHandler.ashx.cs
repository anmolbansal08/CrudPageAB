using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.SessionState;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using System.Data.OleDb;
using CargoFlash.Cargo.Model.ULD;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlashCargoWebApps.Handler
{
    /// <summary>
    /// Summary description for ReleaseNoteHandler
    /// </summary>
    public class ReleaseNoteHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.QueryString["UserSNo"] != "")
            { 
                ReleaseNote(context);
            }
        }
        public void ReleaseNote(HttpContext context)
        {
            string responseData = string.Empty;
            System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
            System.Collections.Generic.List<object> Listobj = new System.Collections.Generic.List<object>();
            System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
            String[] inputName = uploadedFile.AllKeys;
            string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
            string _Extension = string.Empty;
            string path = string.Empty;
            string fullPath = string.Empty;
            string UploadedFileName = string.Empty;
            foreach (string upload in uploadedFile)
            {
                path = BaseDirectory + "UploadDoc\\ReleaseNote\\";
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                string filename = Path.GetFileName(uploadedFile[upload].FileName);
                _Extension = Path.GetExtension(filename);
                UploadedFileName = (System.DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss") + "_" + filename).Replace("\\", "$$").Replace("/", "@@");
                if (File.Exists(path))
                    File.Delete(path);
                else
                {
                    uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
                    fullPath = Path.Combine(path, UploadedFileName);
                }
            }
            DataTable dtReleaseNote = GetReleaseNoteTable();
            dtReleaseNote = ReleaseNoteTableFromExcel(fullPath, dtReleaseNote);

            if (dtReleaseNote.Columns.Count > 1)
            {
                if (dtReleaseNote.Rows.Count < 10001)
                {
                    DataSet nds = UploadReleaseNote(dtReleaseNote);
                    if (nds.Tables.Count > 1)
                    {
                        if (nds.Tables[0].Rows.Count > 0 && nds.Tables[1].Rows[0][0].ToString() == "")
                        {
                            foreach (DataRow dr in nds.Tables[0].Rows)
                            {
                                Listobj.Add(new
                                {
                                    Module = dr["Module"],
                                    ModuleDescription = dr["ModuleDescription"],
                                    TFSId = dr["TFSId"],
                                    ModuleOwner = dr["ModuleOwner"],
                                });
                            }
                        }
                        else if (nds.Tables[0].Rows.Count == 0)
                        {
                            Listobj.Add(new
                            {
                                Error = "No Rows Found to Upload"
                            });
                        }
                        else
                        {
                            Listobj.Add(new
                            {
                                Error = nds.Tables[1].Rows[0][0].ToString()
                            });
                        }
                    }
                    else
                    {
                        Listobj.Add(new
                        {
                            Error = nds.Tables[0].Rows[0][0].ToString()
                        });
                    }
                }
                else
                {
                    Listobj.Add(new
                    {
                        Error = "Maximum 10000 rows are allowed!"
                    });
                }
            }
            else
            {
                Listobj.Add(new
                {
                    Error = dtReleaseNote.Rows[0][0].ToString()
                });
            }

            var items = new { items = Listobj };
            js.MaxJsonLength = 99999999;
            string jsonstring = js.Serialize(items);
            HttpContext.Current.Response.ClearContent();
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(jsonstring);
            HttpContext.Current.Response.End();
        }
        private DataTable GetReleaseNoteTable()
        {
            DataTable dtReleaseNote = new DataTable();
            dtReleaseNote.Columns.Add("Module");
            dtReleaseNote.Columns.Add("ModuleDescription");
            dtReleaseNote.Columns.Add("TFSId");
            dtReleaseNote.Columns.Add("ModuleOwner");
            return dtReleaseNote;
        }
        private DataTable ReleaseNoteTableFromExcel(string path, DataTable dtReleaseNote)
        {
            try
            {
                string connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + path + ";" + "Extended Properties='Excel 12.0;HDR=Yes;READONLY=FALSE'";
                var con = new OleDbConnection(connString);
                var exAdp = new OleDbDataAdapter("select *from [Sheet1$]", con);
                var ds = new DataSet();
                con.Open();
                exAdp.Fill(ds);
                con.Close();
                if (File.Exists(path))
                    File.Delete(path);
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (ds.Tables[0].Rows[i][0].ToString() != "" || ds.Tables[0].Rows[i][1].ToString() != "" || ds.Tables[0].Rows[i][2].ToString() != "" || ds.Tables[0].Rows[i][3].ToString() != "")
                    {
                        DataRow drReleaseNote = dtReleaseNote.NewRow();
                        drReleaseNote["Module"] = ds.Tables[0].Rows[i][0].ToString().ToUpper();
                        drReleaseNote["ModuleDescription"] = ds.Tables[0].Rows[i][1].ToString().ToUpper();
                        drReleaseNote["TFSId"] = ds.Tables[0].Rows[i][2].ToString();
                        drReleaseNote["ModuleOwner"] = ds.Tables[0].Rows[i][3].ToString().ToUpper();
                        dtReleaseNote.Rows.Add(drReleaseNote);
                    }
                }
                return dtReleaseNote;
            }
            catch (FormatException ex)
            {
                if (File.Exists(path))
                    File.Delete(path);
                DataTable releasenote = new DataTable();
                releasenote.Columns.Add("Error");
                DataRow releasenoteR = releasenote.NewRow();
                releasenoteR["Error"] = "Uploaded File not in Valid Format,  ";
                releasenote.Rows.Add(releasenoteR);
                return releasenote;
            }
        }
        public DataSet UploadReleaseNote(DataTable dtCreateExceldata)
        {
            try
            {
                SqlParameter Parameters = new SqlParameter();
                Parameters.ParameterName = "@UploadReleaseNoteExcel";
                Parameters.SqlDbType = System.Data.SqlDbType.Structured;
                Parameters.Value = dtCreateExceldata;
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Usp_CreateReleaseNoteExport", Parameters);
                return ds;
            }
            catch (Exception ex)
            {
                DataSet releaseNote = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("Error", typeof(string));
                dt.Rows.Add("Uploaded File not in Valid Format,");
                releaseNote.Tables.Add(dt);
                return releaseNote;
            }
        }
        public bool IsReusable
        {
            get { throw new NotImplementedException(); }
        }
    }
}