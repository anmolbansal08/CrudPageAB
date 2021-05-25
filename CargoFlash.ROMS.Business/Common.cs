using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Net.Mail;
using System.Net;
using System.Web;
using System.IO;
using System.Collections;
using System.Web.Script.Serialization;
using CargoFlash.SoftwareFactory.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace CargoFlash.Cargo.Business
{


    public sealed class Common
    {


        /// <summary>
        /// This method is used for decrypt data from base64 to string 
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string Base64ToString(string data)
        {
            if (!IsBase64String(data))
                return data;

            byte[] dataBytes = Convert.FromBase64String(data);
            string decodedString = Encoding.UTF8.GetString(dataBytes);
            return decodedString;

        }

        public static bool IsBase64String(string s)
        {
            if (string.IsNullOrWhiteSpace(s))
                return false;

            s = s.Trim();
            return (s.Length % 4 == 0) && System.Text.RegularExpressions.Regex.IsMatch(s, @"^[a-zA-Z0-9\+/]*={0,3}$", System.Text.RegularExpressions.RegexOptions.None);

        }
        /// <summary>
        /// Created By: BrajRaj Singh Tomar
        /// Created Date:27 May 2017
        /// Modified Date:27 May 2017
        /// Description: This method used for converting dataset to json string
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        public static string CompleteDStoJSON(DataSet ds)
        {
            StringBuilder json = new StringBuilder();
            if (ds != null && ds.Tables.Count > 0)
            {
                json.Append("{");
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                serializer.MaxJsonLength = Int32.MaxValue;
                List<Dictionary<string, object>> table;
                Dictionary<string, object> data;
                int count = 0;
                bool isList = false;
                foreach (DataTable dt in ds.Tables)
                {
                    isList = dt.Columns.Contains("list");
                    if (count > 0)
                        json.Append(",\"Table" + count + "\":");
                    else
                        json.Append("\"Table" + count + "\":");

                    table = new List<Dictionary<string, object>>();
                    foreach (DataRow dr in dt.Rows)
                    {
                        data = new Dictionary<string, object>();
                        foreach (DataColumn dc in dt.Columns)
                        {
                            if (dc.DataType.Name.ToUpper() == "DATETIME")
                                data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString(CargoFlash.SoftwareFactory.Data.DateFormat.DateFormatString));
                            else
                                data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                        }
                        table.Add(data);
                    }
                    json.Append(serializer.Serialize(table));
                    count++;
                }
                json.Append("}");
            }
            else
            {
                json.Append("[");
                json.Append("]");
            }

            return json.ToString();

        }

        //public static string CompleteDStoJSON1(DataSet ds)
        //{
        //    StringBuilder json = new StringBuilder();
        //    if (ds != null && ds.Tables.Count > 0)
        //    {
        //        json.Append("{");
        //        bool isList = false;
        //        for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
        //        {
        //            if (tblCount > 0)
        //                json.Append(",");
        //            json.Append("\"Table" + tblCount.ToString() + "\":");
        //            int lInteger = 0;
        //            json.Append("[");
        //            isList = ds.Tables[tblCount].Columns.Contains("list");
        //            foreach (DataRow dr in ds.Tables[tblCount].Rows)
        //            {
        //                lInteger = lInteger + 1;
        //                json.Append("{");
        //                int i = 0;
        //                int colcount = dr.Table.Columns.Count;
        //                foreach (DataColumn dc in dr.Table.Columns)
        //                {
        //                    json.Append("\"");
        //                    json.Append((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName));
        //                    json.Append("\":\"");
        //                    if (dc.DataType.Name.ToUpper() == "DATETIME")
        //                    {
        //                        json.Append(dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString(CargoFlash.SoftwareFactory.Data.DateFormat.DateFormatString));
        //                    }
        //                    else
        //                        json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
        //                    json.Append("\"");
        //                    i++;
        //                    if (i < colcount) json.Append(",");
        //                }

        //                if (lInteger < ds.Tables[tblCount].Rows.Count)
        //                {
        //                    json.Append("},");
        //                }
        //                else
        //                {
        //                    json.Append("}");
        //                }
        //            }
        //            json.Append("]");
        //        }
        //        json.Append("}");
        //    }
        //    else
        //    {
        //        json.Append("[");
        //        json.Append("]");
        //    }


        //    return json.ToString();
        //}

        public static string CompleteDStoJSONOnlyString(DataSet ds)
        {
            return CompleteDStoJSON(ds);

            //StringBuilder json = new StringBuilder();
            //if (ds != null && ds.Tables.Count > 0)
            //{
            //    json.Append("{");
            //    bool isList = false;
            //    for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
            //    {
            //        if (tblCount > 0)
            //            json.Append(",");
            //        json.Append("\"Table" + tblCount.ToString() + "\":");
            //        int lInteger = 0;
            //        json.Append("[");
            //        isList = ds.Tables[tblCount].Columns.Contains("list");
            //        foreach (DataRow dr in ds.Tables[tblCount].Rows)
            //        {
            //            lInteger = lInteger + 1;
            //            json.Append("{");
            //            int i = 0;
            //            int colcount = dr.Table.Columns.Count;
            //            foreach (DataColumn dc in dr.Table.Columns)
            //            {
            //                json.Append("\"");
            //                json.Append((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName));
            //                json.Append("\":\"");
            //                json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
            //                json.Append("\"");
            //                i++;
            //                if (i < colcount) json.Append(",");
            //            }

            //            if (lInteger < ds.Tables[tblCount].Rows.Count)
            //            {
            //                json.Append("},");
            //            }
            //            else
            //            {
            //                json.Append("}");
            //            }
            //        }
            //        json.Append("]");
            //    }
            //    json.Append("}");
            //}
            //else
            //{
            //    json.Append("[");
            //    json.Append("]");
            //}


            //return json.ToString();
        }
        /// <summary>
        /// This method used for only single table convert from dataset to json string 
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        public static string DStoJSON(DataSet ds)
        {
            // Modified By Brajraj Singh Tomar
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> table = new List<Dictionary<string, object>>();
            if (ds != null && ds.Tables.Count > 0)
            {
                Dictionary<string, object> data;
                bool isList = false;
                DataTable dt = ds.Tables[ds.Tables.Count - 1];
                isList = dt.Columns.Contains("list");

                foreach (DataRow dr in dt.Rows)
                {
                    data = new Dictionary<string, object>();
                    foreach (DataColumn dc in dt.Columns)
                    {
                        if (dc.DataType.Name.ToUpper() == "DATETIME")
                            data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString(CargoFlash.SoftwareFactory.Data.DateFormat.DateFormatString));
                        else
                            data.Add((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName), dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                    }
                    table.Add(data);
                }

            }
            return serializer.Serialize(table);
        }

        public static string ReturnNewTime(string timeValue, int minuteToAdd)
        {
            var timeArray = timeValue.Split(':');
            var oldHour = int.Parse(timeArray[0]);
            var oldMinute = int.Parse(timeArray[1]);
            var minAdd = minuteToAdd % 60;
            var hourAdd = Math.Floor(Convert.ToDouble(minuteToAdd / 60));
            var newHour = oldHour + hourAdd;
            var newMinute = oldMinute + minAdd;
            if (newMinute > 59)
            {
                newMinute = newMinute - 60;
                newHour = newHour + 1;
            }
            if (newHour > 23)
            {
                newHour = newHour - 24;
            }
            return (newHour < 10 ? "0" + newHour.ToString() : newHour.ToString()) + ":" + (newMinute < 10 ? "0" + newMinute.ToString() : newMinute.ToString());
        }

        public static Boolean SendMail(string subject, string body, string smtpServer, string serverUserId, string mailPassword, string smtpsenderid, int MailserverPort, string mailTo, string mailCC = "", string mailBCC = "")
        {
            var excp = false;
            var msg = new MailMessage();

            if (mailTo != "")
            {
                if (mailTo.Contains(","))
                {
                    var mailEmailTo = mailTo.Split(',');
                    foreach (var t in mailEmailTo)
                        msg.To.Add(new MailAddress(t));
                }
                else
                    msg.To.Add(mailTo);

                if (mailCC.Trim() != "")
                {
                    if (mailCC.Contains(","))
                    {
                        var mailEmailCC = mailCC.Split(',');
                        foreach (var t in mailEmailCC)
                            msg.CC.Add(new MailAddress(t));
                    }
                    else
                        msg.CC.Add(mailCC);
                }

                if (mailBCC.Trim() != "")
                {
                    if (mailBCC.Contains(","))
                    {
                        var mailEmailBCC = mailBCC.Split(',');
                        foreach (var t in mailEmailBCC)
                            msg.Bcc.Add(new MailAddress(t));
                    }
                    else
                        msg.Bcc.Add(mailBCC);
                }

                msg.From = new MailAddress(smtpsenderid, "Lion Express- System Generated Message", Encoding.UTF8);
                msg.Subject = subject;
                msg.IsBodyHtml = true;
                msg.Body = body;
                var smtp = new SmtpClient(smtpServer, MailserverPort) { Credentials = new NetworkCredential(serverUserId, mailPassword) };

                try
                {
                    smtp.Send(msg);
                    excp = true;
                }
                catch (Exception ex)
                {
                    excp = false;
                }
            }
            return excp;
        }

        /// Upload File to Specified FTP Url with username and password and Upload Directory 
        /// if need to upload in sub folders  
        ///Base FtpUrl of FTP Server
        ///Local Filename to Upload
        ///Username of FTP Server
        ///Password of FTP Server
        ///[Optional]Specify sub Folder if any
        /// Status String from Server
        public static bool UploadFile(string ftpUrl, string userName, string password, Stream fileStream, string fileName, string
   UploadDirectory = "")
        {
            try
            {
                System.Net.FtpWebRequest rq = (System.Net.FtpWebRequest)System.Net.FtpWebRequest.Create(ftpUrl + "/" + UploadDirectory + "/" + fileName);
                rq.Credentials = new System.Net.NetworkCredential(userName, password);
                rq.Method = System.Net.WebRequestMethods.Ftp.UploadFile;
                byte[] buffer = new byte[fileStream.Length];
                fileStream.Read(buffer, 0, buffer.Length);
                fileStream.Close();
                System.IO.Stream ftpstream = rq.GetRequestStream();
                ftpstream.Write(buffer, 0, buffer.Length);
                ftpstream.Close();
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            return true;
        }

        public static void RefreshAutocompletes()
        {



            DataSet ds = SqlHelper.ExecuteDataset(SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAutoCompletes");
            AutoCompletes = ds.Tables[0].AsEnumerable().Select(s => new AutoCompleteNGen
            {
                SNo = Convert.ToInt32(s["SNo"]),
                keyColumn = Convert.ToString(s["keyColumn"]),
                TextColumn = Convert.ToString(s["TextColumn"]),
                AutoCompleteName = Convert.ToString(s["AutoCompleteName"]),
                DESC = Convert.ToString(s["DESC"]),
                Module = Convert.ToString(s["Module"]),
                TemplateColumn = Convert.ToString(s["TemplateColumn"]),
                TableName = Convert.ToString(s["TableName"]),
                ProcName = Convert.ToString(s["ProcName"]),
                IsActive = Convert.ToBoolean(s["IsActive"]),
                IsAccessOutSide = Convert.ToBoolean(s.Field<bool?>("IsAccessOutSide"))


            }).ToList();
        }
        public static void UserSignOutOrSessionExpire(int UserSNo, string UserSignature)
        {
            try
            {
                string Result = string.Empty;
                SqlParameter[] Parameters = { new SqlParameter("@UserSNo", UserSNo),
                                              new SqlParameter("@UserSignature", UserSignature)};
                //SqlHelper.ExecuteNonQuery(SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_UserSignOutOrSessionExpire", Parameters);
                var result = SqlHelper.ExecuteNonQuery(SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_UserSignOutOrSessionExpire", Parameters);
             

            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static IEnumerable<AutoCompleteNGen> AutoCompletes { get; set; }

        /// <summary>
        /// Created By: Brajraj Singh Tomar
        /// This method used for do exceptions log
        /// </summary>
        /// <param name="error"></param>
        /// <param name="methodName"></param>
        /// <param name="moduleName"></param>
        /// <param name="userId"></param>
        /// 
        
        public static void insertAppException(Exception error, string methodName = null, string moduleName = null, string userId = null)
        {


            try
            {

                var trace = new StackTrace(error);
                var frame = trace.GetFrame(0);
                var method = frame.GetMethod();
                SqlParameter[] Parameters = {   new SqlParameter("@Name",method.DeclaringType.FullName),
                                                new SqlParameter("@MethodName", method.Name),
                                                new SqlParameter("@ClientDetails",HttpContext.Current.Request.ServerVariables["ALL_HTTP"].ToString()),
                                                new SqlParameter("@CreatedOn", System.DateTime.Now),
                                                new SqlParameter("@MachineName", Environment.MachineName.ToString()),
                                                new SqlParameter("@Message", error.Message.ToString()),
                                                new SqlParameter("@RequestedUrl", HttpContext.Current.Request.Url.ToString()),
                                                new SqlParameter("@Source",error.Source.ToString()),
                                                new SqlParameter("@StackTrace",error.StackTrace.ToString()),
                                                new SqlParameter("@UserId",userId)
                        };
                SqlHelper.ExecuteNonQuery(SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "InsertAppException", Parameters);
            }
            catch { }
        }




    }


    public class SQLParameterList
    {
        public string ParameterName { get; set; }
        public string ParameterValue { get; set; }

    }
    public class AutoCompleteNGen
    {
        public int SNo { get; set; }
        public string keyColumn { get; set; }
        public string TextColumn { get; set; }
        public string TemplateColumn { get; set; }
        public string TableName { get; set; }
        public string ProcName { get; set; }
        public string Module { get; set; }
        public string AutoCompleteName { get; set; }
        public string DESC { get; set; }
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets Is access from out side application(without login)
        /// </summary>
        public bool? IsAccessOutSide { get; set; }

    }
    // Changes by Vipin Kumar
    public class AWBLockedEvent
    {
        public int? UserSNo { get; set; }
        public int? AWBSNo { get; set; }
        /*public int? DailyFlightSNo { get; set; }*/
        public string DailyFlightSNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string ULDNo { get; set; }
        public int SubProcessSNo { get; set; }
    }
    // Ends
    // Changes by Shahbaz Akhtar
    public class GetPageRightsByUser
    {
        public string Module { get; set; }
        public string Apps { get; set; }
    }



    public class AppException

    {
        public int Id { get; set; }
        //public Exception innerException { get; set; }
        public string ApplicationDomainName { get; set; }
        public string AssemblyName { get; set; }
        public string MethodName { get; set; }
        public string AssemblyVersion { get; set; }
        public string ClientDetails { get; set; }
        public DateTime DateTimeOfException { get; set; }
        public string MachineName { get; set; }
        public string Message { get; set; }
        public string RequestedUrl { get; set; }
        public string Source { get; set; }
        public string StackTrace { get; set; }
        public string TypeName { get; set; }
        public string ThreadId { get; set; }
        public string ThreadUser { get; set; }
        public string UserId { get; set; }


        public AppException()
        {
            // TODO: Complete member initialization
        }




    }


}
