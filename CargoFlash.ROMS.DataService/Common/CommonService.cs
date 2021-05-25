using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Common;
using CargoFlash.Cargo.Business;
using System.Net;
using System.Net.Sockets;
//using Excel = Microsoft.Office.Interop.Excel;
using System.Web;
using System.Xml;
using CargoFlash.Cargo.Model;
using System.Linq;
using System.Runtime.Serialization;
using System.Net.Configuration;
using System.Net.Mail;
using System.Security.Cryptography;
using System.IO;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;
//using System.DirectoryServices;


namespace CargoFlash.Cargo.DataService.Common
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class CommonService : SignatureAuthenticate, ICommonService
    {
        static readonly string PasswordHash = "P@@Sw0rd";
        static readonly string SaltKey = "S@LT&KEY";
        static readonly string VIKey = "@1B2c3D4e5F6g7H8";

        public string GetWeighingData(string mip, string mport)
        {
            string result = "";

            IPEndPoint ip = new IPEndPoint(IPAddress.Parse(mip), int.Parse(mport));
            Socket server = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

            try
            {
                server.Connect(ip);
            }
            catch (Exception ex)// (SocketException e)
            {
                result = ex.ToString();
                return result;
            }

            byte[] data = new byte[1024];
            int receivedDataLength = server.Receive(data);
            string stringData = Encoding.ASCII.GetString(data, 0, receivedDataLength);
            result = stringData;
            server.Shutdown(SocketShutdown.Both);
            server.Close();
            return result;
        }

        public string GetRateReferenceCode(string Keysno)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@KeySNo",Keysno)

                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_GetRateRefrenceAuditLog", param);
                string LocatDate = "";
                if (ds != null && ds.Tables.Count > 0)
                {
                    LocatDate = Convert.ToString(ds.Tables[0].Rows[0][0]);
                }
                return LocatDate;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        //Added By Shivali Thakur
        public string GetFlightNo(string FlightSNo)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@FlightSNo",FlightSNo)

                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_GetFlightNo", param);
                string FlightNo = "";
                if (ds != null && ds.Tables.Count > 0)
                {
                    FlightNo = Convert.ToString(ds.Tables[0].Rows[0][0]);
                }
                return FlightNo;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetWeighingDataByTerminalID(string terminalid)
        {
            string mip = ""; string mport = "";
            string result = "0";
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.Text, "select top 1 IPAddress,PortNo from WeighingScale where TerminalSNo=" + terminalid);
            if (dr.Read())
            {
                mip = dr[0].ToString();
                mport = dr[1].ToString();
            }
            dr.Close();
            if (mip != "" && mport != "")
            {
                IPEndPoint ip = new IPEndPoint(IPAddress.Parse(mip), int.Parse(mport));
                Socket server = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                try
                {
                    server.Connect(ip);
                }
                catch (Exception ex)// (SocketException e)
                {
                    //result = e.ToString();
                    result = "0";
                    return result;
                }
                try
                {
                    byte[] data = new byte[1024];
                    int receivedDataLength = server.Receive(data);
                    string stringData = Encoding.ASCII.GetString(data, 0, receivedDataLength);
                    result = stringData;
                    server.Shutdown(SocketShutdown.Both);
                    server.Close();
                    int val = 0;
                    string[] re = result.Replace("\r\n", " ").Split(' ');
                    for (int i = 0; i < re.Length; i++)
                    {
                        if (i < 5)
                            val = val + int.Parse(re[i].ToString().Replace("-", ""));
                        if (i == 4) break;
                    }
                    if (val > 0)
                    {
                        val = val / 5;
                        result = val.ToString();
                    }
                    else
                        result = "0";
                }
                catch (Exception ex)//(Exception ex)
                {
                    result = "0";
                    return result;
                }
            }
            return result;
        }
        public void SaveROMSException(List<ROMSException> ROMSExceptions)
        {   //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateROMSExceptions = CollectionHelper.ConvertTo(ROMSExceptions, "");
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ROMSExceptionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateROMSExceptions;
                SqlParameter[] Parameters = { param };
                BaseBusiness baseBusiness = new BaseBusiness();
                int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "InsertROMSExceptions", Parameters);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public PageRightsByAppName GetPageRightsByAppName(GetPageRightsByUser getPageRightsByUser)
        {
            try
            {
                PageRightsByAppName pageRights = new PageRightsByAppName();
                SqlParameter[] param = { new SqlParameter("@Module",getPageRightsByUser.Module),
                                     new SqlParameter("@Apps",getPageRightsByUser.Apps),
                                     new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo )
                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPageRightsByAppName", param);
                if (ds != null && ds.Tables.Count > 0)
                {
                    DataRow dr = ds.Tables[0].Rows[0];
                    pageRights.IsRead = Convert.ToBoolean(dr["Read"]);
                    pageRights.IsEdit = Convert.ToBoolean(dr["Edit"]);
                    pageRights.IsNew = Convert.ToBoolean(dr["New"]);
                    pageRights.IsDelete = Convert.ToBoolean(dr["Delete"]);
                }
                return pageRights;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetUserLocalTime(string strDate, string Format, string UserSNo)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@strDate",strDate),
                                     new SqlParameter("@Format",Format),
                                     new SqlParameter("@UserSNo", UserSNo)
                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUserLocalTime", param);
                string LocatDate = "";
                if (ds != null && ds.Tables.Count > 0)
                {
                    LocatDate = Convert.ToString(ds.Tables[0].Rows[0][0]);
                }
                return LocatDate;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetUserCurrentUTCTime(string Format, string UserSNo)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@Format",Format),
                                     new SqlParameter("@UserSNo", UserSNo)
                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUserCurrentUTCTime", param);
                string LocatDate = "";
                if (ds != null && ds.Tables.Count > 0)
                {
                    LocatDate = Convert.ToString(ds.Tables[0].Rows[0][0]);
                }
                return LocatDate;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GenerateCIMPMessage(string MessageType, string SerialNo, string SubType, string flightNumber, string flightDate, string OriginAirport, bool isDoubleSignature, string version, ref string nop, ref string grossWeight, ref string volumeWeight, ref string eventTimeStamp, ref string MsgSeqNo)
        {
            try
            {
                var m = new WebServiceCIMPMessageGenerationSoapClient();
                decimal s = 0;
                return m.GenerateMessage(MessageType, SerialNo, "Text", false, SubType, "", "", "", flightNumber, Convert.ToDateTime(flightDate), s, OriginAirport, isDoubleSignature, version, ref nop, ref grossWeight, ref volumeWeight, ref eventTimeStamp, ref MsgSeqNo);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string InsertCIMPMessage(string MessageText, string ReceivedFrom, string MessageRecAddress)
        {
            string dsrowsvalue = string.Empty;
            try
            {
                string MsgTxt = CargoFlash.Cargo.Business.Common.Base64ToString(MessageText);
                //Added by Shahbaz Akhtar on 2018-01-08
                int userid = 0;
                if (System.Web.HttpContext.Current.Session["UserDetail"] != null)
                {
                    userid = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
                }
                var edi = new WebServiceEDIMSGValidateAndReturnDS();
                DataSet ds = edi.ValidateMSGAndReturnDataSet(MessageText, ReceivedFrom, MessageRecAddress, userid);

                if (ds == null || ds.Tables[0].Rows.Count == 0)
                {
                    dsrowsvalue = "Message Validation Failed";
                }
                else
                {
                    dsrowsvalue = "Data Inserted";
                }

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

            return dsrowsvalue;

        }
        public lstValidateDataRetun ValidateCIMPMessage(string MessageText)
        {
            lstValidateDataRetun lstValidateDataRetun1 = new lstValidateDataRetun();
            try
            {
                //string MsgTxt = CargoFlash.Cargo.Business.Common.Base64ToString(MessageText);
                var edi = new WebServiceEDIMSGValidateAndReturnDS();
                //var edi = new WebServiceEDIMSGValidateAndReturnDSSoapClient();
                //MsgTxt = edi.HelloWorld(MsgTxt);

                lstValidateDataRetun1 = edi.ValidateMSGJQuery(MessageText);

            }
            catch (Exception ex)//(Exception ex)
            {
                //throw ex;
            }
            return lstValidateDataRetun1;
        }
        /// Session check for cra
        /// </summary>
        /// <returns></returns>
        public string CheckSessionforcra()
        {
            try
            {
                if (System.Web.HttpContext.Current.Session["UserDetail"] != null)
                {
                    SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.Text, "select UserSignature from users where Islogin=1 and lower(UserSignature)='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).Signature.ToLower().Trim() + "' and lower(username)='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName.ToLower().Trim() + "'");
                    if (dr.Read())
                    {
                        dr.Close();
                        string str = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "#" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName + "#" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName + "#" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode;
                        return str;
                    }
                    else
                    {
                        dr.Close();
                        return "";
                    }
                }
                else
                    return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>       
        /// Create one Excel-XML-Document with SpreadsheetML from a DataTable
        /// </summary>        
        /// <param name="dataSource">Datasource which would be exported in Excel</param>
        /// <param name="fileName">Name of exported file</param>
        public string ExportDataSetToExcel(DataTable dtSource, string strFileName)
        {
            try
            {
                strFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + strFileName;
                string filepath = HttpContext.Current.Server.MapPath("~/") + "UploadDoc\\ExcelDocs\\" + strFileName;
                // Create XMLWriter
                XmlTextWriter xtwWriter = new XmlTextWriter(filepath, Encoding.UTF8);

                //Format the output file for reading easier
                xtwWriter.Formatting = Formatting.Indented;

                // <?xml version="1.0"?>
                xtwWriter.WriteStartDocument();

                // <?mso-application progid="Excel.Sheet"?>
                xtwWriter.WriteProcessingInstruction("mso-application", "progid=\"Excel.Sheet\"");

                // <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet >"
                xtwWriter.WriteStartElement("Workbook", "urn:schemas-microsoft-com:office:spreadsheet");

                //Write definition of namespace
                xtwWriter.WriteAttributeString("xmlns", "o", null, "urn:schemas-microsoft-com:office:office");
                xtwWriter.WriteAttributeString("xmlns", "x", null, "urn:schemas-microsoft-com:office:excel");
                xtwWriter.WriteAttributeString("xmlns", "ss", null, "urn:schemas-microsoft-com:office:spreadsheet");
                xtwWriter.WriteAttributeString("xmlns", "html", null, "http://www.w3.org/TR/REC-html40");

                // <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
                xtwWriter.WriteStartElement("DocumentProperties", "urn:schemas-microsoft-com:office:office");

                // Write document properties
                xtwWriter.WriteElementString("Author", Environment.UserName);
                xtwWriter.WriteElementString("LastAuthor", Environment.UserName);
                xtwWriter.WriteElementString("Created", DateTime.Now.ToString("u") + "Z");
                xtwWriter.WriteElementString("Company", "Unknown");
                xtwWriter.WriteElementString("Version", "11.8122");

                // </DocumentProperties>
                xtwWriter.WriteEndElement();

                // <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
                xtwWriter.WriteStartElement("ExcelWorkbook", "urn:schemas-microsoft-com:office:excel");

                // Write settings of workbook
                xtwWriter.WriteElementString("WindowHeight", "13170");
                xtwWriter.WriteElementString("WindowWidth", "17580");
                xtwWriter.WriteElementString("WindowTopX", "120");
                xtwWriter.WriteElementString("WindowTopY", "60");
                xtwWriter.WriteElementString("ProtectStructure", "False");
                xtwWriter.WriteElementString("ProtectWindows", "False");

                // </ExcelWorkbook>
                xtwWriter.WriteEndElement();

                // <Styles>
                xtwWriter.WriteStartElement("Styles");

                // <Style ss:ID="Default" ss:Name="Normal">
                xtwWriter.WriteStartElement("Style");
                xtwWriter.WriteAttributeString("ss", "ID", null, "Default");
                xtwWriter.WriteAttributeString("ss", "Name", null, "Normal");

                // <Alignment ss:Vertical="Bottom"/>
                xtwWriter.WriteStartElement("Alignment");
                xtwWriter.WriteAttributeString("ss", "Vertical", null, "Bottom");
                xtwWriter.WriteEndElement();

                // Write null on the other properties
                xtwWriter.WriteElementString("Borders", null);
                xtwWriter.WriteElementString("Font", null);
                xtwWriter.WriteElementString("Interior", null);
                xtwWriter.WriteElementString("NumberFormat", null);
                xtwWriter.WriteElementString("Protection", null);

                // </Style>
                xtwWriter.WriteEndElement();

                // </Styles>
                xtwWriter.WriteEndElement();

                // <Worksheet ss:Name="xxx">
                xtwWriter.WriteStartElement("Worksheet");
                xtwWriter.WriteAttributeString("ss", "Name", null, dtSource.TableName);

                // <Table ss:ExpandedColumnCount="2" ss:ExpandedRowCount="3" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="60">
                xtwWriter.WriteStartElement("Table");
                xtwWriter.WriteAttributeString("ss", "ExpandedColumnCount", null, dtSource.Columns.Count.ToString());
                xtwWriter.WriteAttributeString("ss", "ExpandedRowCount", null, (dtSource.Rows.Count + 1).ToString());
                xtwWriter.WriteAttributeString("x", "FullColumns", null, "1");
                xtwWriter.WriteAttributeString("x", "FullRows", null, "1");
                xtwWriter.WriteAttributeString("ss", "DefaultColumnWidth", null, "60");

                // Run through all cell of columns
                // <Row>
                xtwWriter.WriteStartElement("Row");
                foreach (DataColumn col in dtSource.Columns)
                {
                    // <Cell>
                    xtwWriter.WriteStartElement("Cell");

                    // <Data ss:Type="String">xxx</Data>
                    xtwWriter.WriteStartElement("Data");
                    xtwWriter.WriteAttributeString("ss", "Type", null, "String");

                    // Write content of cell
                    xtwWriter.WriteValue(col.ColumnName);

                    // </Data>
                    xtwWriter.WriteEndElement();

                    // </Cell>
                    xtwWriter.WriteEndElement();
                }
                // </Row>
                xtwWriter.WriteEndElement();

                // Run through all rows of data source
                foreach (DataRow row in dtSource.Rows)
                {
                    // <Row>
                    xtwWriter.WriteStartElement("Row");

                    // Run through all cell of current rows
                    foreach (object cellValue in row.ItemArray)
                    {
                        // <Cell>
                        xtwWriter.WriteStartElement("Cell");

                        // <Data ss:Type="String">xxx</Data>
                        xtwWriter.WriteStartElement("Data");
                        xtwWriter.WriteAttributeString("ss", "Type", null, "String");

                        // Write content of cell
                        xtwWriter.WriteValue(cellValue == DBNull.Value ? "" : cellValue);

                        // </Data>
                        xtwWriter.WriteEndElement();

                        // </Cell>
                        xtwWriter.WriteEndElement();
                    }
                    // </Row>
                    xtwWriter.WriteEndElement();
                }
                // </Table>
                xtwWriter.WriteEndElement();

                // <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
                xtwWriter.WriteStartElement("WorksheetOptions", "urn:schemas-microsoft-com:office:excel");

                // Write settings of page
                xtwWriter.WriteStartElement("PageSetup");
                xtwWriter.WriteStartElement("Header");
                xtwWriter.WriteAttributeString("x", "Margin", null, "0.4921259845");
                xtwWriter.WriteEndElement();
                xtwWriter.WriteStartElement("Footer");
                xtwWriter.WriteAttributeString("x", "Margin", null, "0.4921259845");
                xtwWriter.WriteEndElement();
                xtwWriter.WriteStartElement("PageMargins");
                xtwWriter.WriteAttributeString("x", "Bottom", null, "0.984251969");
                xtwWriter.WriteAttributeString("x", "Left", null, "0.78740157499999996");
                xtwWriter.WriteAttributeString("x", "Right", null, "0.78740157499999996");
                xtwWriter.WriteAttributeString("x", "Top", null, "0.984251969");
                xtwWriter.WriteEndElement();
                xtwWriter.WriteEndElement();

                // <Selected/>
                xtwWriter.WriteElementString("Selected", null);

                // <Panes>
                xtwWriter.WriteStartElement("Panes");

                // <Pane>
                xtwWriter.WriteStartElement("Pane");

                // Write settings of active field
                xtwWriter.WriteElementString("Number", "1");
                xtwWriter.WriteElementString("ActiveRow", "1");
                xtwWriter.WriteElementString("ActiveCol", "1");

                // </Pane>
                xtwWriter.WriteEndElement();

                // </Panes>
                xtwWriter.WriteEndElement();

                // <ProtectObjects>False</ProtectObjects>
                xtwWriter.WriteElementString("ProtectObjects", "False");

                // <ProtectScenarios>False</ProtectScenarios>
                xtwWriter.WriteElementString("ProtectScenarios", "False");

                // </WorksheetOptions>
                xtwWriter.WriteEndElement();

                // </Worksheet>
                xtwWriter.WriteEndElement();

                // </Workbook>
                xtwWriter.WriteEndElement();

                // Write file on hard disk
                xtwWriter.Flush();
                xtwWriter.Close();

                //Return new file name
                return strFileName;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetWeighingDataByWeighingScaleID(string weighingid)
        {
            try
            {
                string mip = ""; string mport = "";
                string result = "0";
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.Text, "select top 1 IPAddress,PortNo from WeighingScale where SNo=" + weighingid);
                if (dr.Read())
                {
                    mip = dr[0].ToString();
                    mport = dr[1].ToString();
                }
                dr.Close();
                if (mip != "" && mport != "")
                {
                    IPEndPoint ip = new IPEndPoint(IPAddress.Parse(mip), int.Parse(mport));
                    Socket server = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                    try
                    {
                        server.Connect(ip);
                    }
                    catch (Exception ex)// (SocketException e)
                    {
                        //result = e.ToString();
                        result = "0";
                        return result;
                    }
                    try
                    {
                        byte[] data = new byte[1024];
                        int receivedDataLength = server.Receive(data);
                        string stringData = Encoding.ASCII.GetString(data, 0, receivedDataLength);
                        result = stringData;
                        server.Shutdown(SocketShutdown.Both);
                        server.Close();
                        int val = 0;
                        string[] re = result.Replace("\r\n", " ").Split(' ');
                        for (int i = 0; i < re.Length; i++)
                        {
                            if (i < 5)
                                val = val + int.Parse(re[i].ToString().Replace("-", ""));
                            if (i == 4) break;
                        }
                        if (val > 0)
                        {
                            val = val / 5;
                            result = val.ToString();
                        }
                        else
                            result = "0";
                    }
                    catch (Exception ex)//(Exception ex)
                    {
                        result = "0";
                        return result;
                    }
                }
                return result;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public bool CheckSession()
        {
            try
            {
                //Added By Amit Yadav to check session is null or not
                if (System.Web.HttpContext.Current.Session["UserDetail"] == null) return false;

                SqlParameter[] parameter = {
                    new SqlParameter("@Signature",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).Signature),
                    new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCheckSession", parameter);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string ReLogin(string UserID, string Password, string CaptchaCode)
        {
            try
            {
                //ip Code Commented By Akash on 14 Sep 2017
                CargoFlash.Cargo.DataService.LoginService loginservice = new CargoFlash.Cargo.DataService.LoginService();
                string ip = loginservice.GetIPAddress();

                var Browser = HttpContext.Current.Request.Browser.Type;
                var HostName = Dns.GetHostName();
                var SessionID = HttpContext.Current.Session.SessionID;

                string url = HttpContext.Current.Request.Url.Host.ToString();
                UserLogin userLogin = loginservice.GetLoginRecord(UserID, Password, ip, HostName, Browser, SessionID, CaptchaCode);

                HttpContext.Current.Session["UserDetail"] = userLogin;

                System.Web.Script.Serialization.JavaScriptSerializer s = new System.Web.Script.Serialization.JavaScriptSerializer();
                var obj = s.Serialize(userLogin);
                return obj;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, HttpStatusCode.BadRequest);
            }

        }

        public bool InsertAjaxRequestError(AjaxRequestError ajaxRequestError)
        {
            //Added By Amit Yadav to check session is null or not
            if (System.Web.HttpContext.Current.Session["UserDetail"] == null) return false;

            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@URL",CargoFlash.Cargo.Business.Common.Base64ToString(ajaxRequestError.URL) ),
                                               new SqlParameter("@status",ajaxRequestError.status ),
                                                new SqlParameter("@statusText",CargoFlash.Cargo.Business.Common.Base64ToString(ajaxRequestError.statusText) ),
                                                 new SqlParameter("@responseText",CargoFlash.Cargo.Business.Common.Base64ToString(ajaxRequestError.responseText) ),
                                                  new SqlParameter("@RequestUrl",CargoFlash.Cargo.Business.Common.Base64ToString(ajaxRequestError.RequestUrl) ),
                                                   new SqlParameter("@PageURL",CargoFlash.Cargo.Business.Common.Base64ToString(ajaxRequestError.PageURL) ),
                                                    new SqlParameter("@module",ajaxRequestError.module ),
                                                     new SqlParameter("@Apps",ajaxRequestError. Apps)};
                var ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_AjaxErrorLog", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    SendMail(ds.Tables[0].Rows[0]["EmailSubJect"].ToString(), ds.Tables[0].Rows[0]["MailBody"].ToString(), true, "", ds.Tables[0].Rows[0]["EmailID"].ToString());
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return true;
        }
        public string ShowTickerOnPublish()
        {
            var res = "";
            try
            {
                var dt = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_ShowTickerOnPublish");
                if (dt != null && dt.Tables.Count > 0)
                    return dt.Tables[0].Rows[0]["SysValue"].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return res;
        }
        public string CompareSession(string UserID, string CaptchaCode)
        {
            try
            {
                var SessionID = HttpContext.Current.Session.SessionID;

                CommonService CS = new CommonService();
                int ISCaptcha = Convert.ToInt32(CS.GetSystemSetting("ISCaptcha"));

                ////////Validate Captcha before login///////////////////////////////////////////////////////////////////////////////////////////
                bool Valid = false;

                if (ISCaptcha == 2)
                {
                    if (HttpContext.Current.Session["CaptchaCode"] != null && CaptchaCode != null)
                    {
                        Valid = HttpContext.Current.Session["CaptchaCode"].ToString() == CaptchaCode ? true : false;
                    }
                }
                else if (ISCaptcha == 3)
                {
                    var response = CaptchaCode;

                    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(" https://www.google.com/recaptcha/api/siteverify?secret=6LdYXhUUAAAAAG_RXWxWmKimgSPD2v-PhfNNakLZ&response=" + response);
                    using (WebResponse wResponse = req.GetResponse())
                    {
                        using (StreamReader readStream = new StreamReader(wResponse.GetResponseStream()))
                        {
                            string jsonResponse = readStream.ReadToEnd();
                            List<string> lst = new List<string>();
                            System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
                            CargoFlash.Cargo.Model.CaptchaResponse data = js.Deserialize<CargoFlash.Cargo.Model.CaptchaResponse>(jsonResponse);// Deserialize Json
                            Valid = Convert.ToBoolean(data.success);
                        }
                    }
                }
                else { Valid = true; }
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (!Valid)
                    throw new FaultException(new FaultReason("Captcha not valid!"));

                SqlParameter param = new SqlParameter();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@EMailID",  UserID),
                                               new SqlParameter("@SessionID",  SessionID),
                                                 new SqlParameter("@ErrorMessage",SqlDbType.VarChar) { Size=250, Direction=ParameterDirection.Output} };
                var ds = SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_CompareSession", Parameters);
                if (!string.IsNullOrEmpty(Parameters[Parameters.Length - 1].Value.ToString()))
                {
                    return Parameters[Parameters.Length - 1].Value.ToString();
                }
                return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public bool CompareSessionAfterLogin()
        {
            try
            {
                if (HttpContext.Current.Session["UserDetail"] == null)
                    return false;

                string UserID = ((UserLogin)HttpContext.Current.Session["UserDetail"]).UserName;
                string SessionID = HttpContext.Current.Session.SessionID;

                SqlParameter param = new SqlParameter();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@EMailID",  UserID),
                                               new SqlParameter("@SessionID",  SessionID),
                                                 new SqlParameter("@ErrorMessage",SqlDbType.VarChar) { Size=250, Direction=ParameterDirection.Output} };
                var ds = SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_CompareSession", Parameters);
                if (!string.IsNullOrEmpty(Parameters[Parameters.Length - 1].Value.ToString()))
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public bool Logout(string UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UserSNo",  UserSNo)
                                        };
                SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_Logout", Parameters);
                return true;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateAirPort(string AirportSNo, string UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AirportSNo",  AirportSNo),
                                             new SqlParameter("@UserSNo",  UserSNo)
                                        };
                SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommmon_UpdateAirport", Parameters);
                return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public bool SendMail(string EmailSubject, string EmailBody, bool IsBodyHtml, string EmailFrom = "", string EmailTo = "", string EmailCC = "", string EmailBCC = "", string Importance = "")
        {

            //  Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

            System.Configuration.Configuration config = null;
            if (System.Web.HttpContext.Current != null)
            {
                config =
                    System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("~");
            }
            else
            {
                config =
                    ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            }
            //System.Net.Configuration.MailSettingsSectionGroup settings = (System.Net.Configuration.MailSettingsSectionGroup)config.GetSectionGroup("mailSettings/smtp_1");

            SmtpSection smtpSection = config.GetSection("mailSettings/smtp_1") as SmtpSection;
            SmtpNetworkElement network = smtpSection.Network;


            MailMessage message = new MailMessage(EmailFrom == "" ? smtpSection.From : EmailFrom, EmailTo);
            message.Subject = EmailSubject;
            message.Body = EmailBody;
            message.IsBodyHtml = IsBodyHtml;

            //if (!string.IsNullOrEmpty(FileAttachmentsPath))
            //{
            //    // Create  the file attachment for this e-mail message.
            //    Attachment data = new Attachment(FileAttachmentsPath, MediaTypeNames.Application.Octet);
            //    // Add time stamp information for the file.
            //    ContentDisposition disposition = data.ContentDisposition;
            //    disposition.CreationDate = System.IO.File.GetCreationTime(FileAttachmentsPath);
            //    disposition.ModificationDate = System.IO.File.GetLastWriteTime(FileAttachmentsPath);
            //    disposition.ReadDate = System.IO.File.GetLastAccessTime(FileAttachmentsPath);
            //    // Add the file attachment to this e-mail message.
            //    message.Attachments.Add(data);
            //}
            ////Add Reply To
            //if (!string.IsNullOrEmpty(ReplyTo))
            //{
            //    MailAddressCollection m = new MailAddressCollection();
            //    foreach (string replyTo in ReplyTo.Split(','))
            //        m.Add(replyTo);
            //}
            //Add Email CC
            if (!string.IsNullOrEmpty(EmailCC))
                foreach (string cc in EmailCC.Split(','))
                    message.CC.Add(cc);
            //Add Email BCC
            if (!string.IsNullOrEmpty(EmailBCC))
                foreach (string bcc in EmailBCC.Split(','))
                    message.Bcc.Add(bcc);
            //Set Priority
            if (!string.IsNullOrEmpty(Importance))
            {
                if (Importance.ToLower() == "low")
                    message.Priority = MailPriority.Low;
                else if (Importance.ToLower() == "high")
                    message.Priority = MailPriority.High;
                else
                    message.Priority = MailPriority.Normal;
            }


            SmtpClient client = new SmtpClient(network.Host);
            client.Credentials = new System.Net.NetworkCredential(network.UserName, network.Password);
            client.Port = network.Port;
            client.Timeout = 10 * 60 * 1000;
            //client.UseDefaultCredentials = settings.Smtp.Network.DefaultCredentials;

            try
            {
                //string userState = "test State";
                //client.SendAsync(message, userState);
                client.Send(message);
                message.Dispose();
                return true;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
            return false;
        }

        public string Decrypt(string encryptedText) // function for Decrypt data :: by Parvez Khan
        {
            byte[] cipherTextBytes = Convert.FromBase64String(encryptedText);
            byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

            var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));
            var memoryStream = new MemoryStream(cipherTextBytes);
            var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];

            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
        }
        public string Encrypt(string plainText)     // function for encrypt data :: by Parvez Khan
        {
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.Zeros };
            var encryptor = symmetricKey.CreateEncryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));

            byte[] cipherTextBytes;

            using (var memoryStream = new MemoryStream())
            {
                using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                {
                    cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                    cryptoStream.FlushFinalBlock();
                    cipherTextBytes = memoryStream.ToArray();
                    cryptoStream.Close();
                }
                memoryStream.Close();
            }
            return Convert.ToBase64String(cipherTextBytes);
        }

        public string GenerateSHA256String(string inputString)
        {
            SHA256 sha256 = SHA256Managed.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(inputString);
            byte[] hash = sha256.ComputeHash(bytes);
            return GetStringFromHash(hash);
        }

        //public string GenerateSHA512String(string inputString)
        //{
        //    SHA512 sha512 = SHA512Managed.Create();
        //    byte[] bytes = Encoding.UTF8.GetBytes(inputString);
        //    byte[] hash = sha512.ComputeHash(bytes);
        //    return GetStringFromHash(hash);
        //}

        private static string GetStringFromHash(byte[] hash)
        {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                result.Append(hash[i].ToString("X2"));
            }
            return result.ToString();
        }

        public string GenerateSHA512String(string inputvalue) // Encrypt and decrypt data using SHA512 :: Parvez Khan
        {
            string salt = "16characterslong12345" + SaltKey;

            HashAlgorithm hasher = null;

            try
            {

                hasher = new SHA512CryptoServiceProvider();

            }

            catch (Exception ex)//(Exception ex)
            {

                hasher = new SHA512Managed();

            }

            byte[] textWithSaltBytes = Encoding.UTF8.GetBytes(string.Concat(inputvalue, salt));

            byte[] hashedBytes = hasher.ComputeHash(textWithSaltBytes);

            hasher.Clear();

            return Convert.ToBase64String(hashedBytes);

        }
        public static string EncryptorDecrypt(string key, bool encrypt)  // Encrypt and decrypt data using MD5 :: Parvez Khan
        {
            //static readonly string securityCode= "S@LT&KEY";
            byte[] toEncryptorDecryptArray;
            ICryptoTransform cTransform;
            // Transform the specified region of bytes array to resultArray
            MD5CryptoServiceProvider md5Hasing = new MD5CryptoServiceProvider();
            byte[] keyArrays = md5Hasing.ComputeHash(UTF8Encoding.UTF8.GetBytes(SaltKey));
            md5Hasing.Clear();
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider() { Key = keyArrays, Mode = CipherMode.ECB, Padding = PaddingMode.PKCS7 };
            if (encrypt == true)
            {
                toEncryptorDecryptArray = UTF8Encoding.UTF8.GetBytes(key);
                cTransform = tdes.CreateEncryptor();
            }
            else
            {
                toEncryptorDecryptArray = Convert.FromBase64String(key.Replace(' ', '+'));
                cTransform = tdes.CreateDecryptor();
            }
            byte[] resultsArray = cTransform.TransformFinalBlock(toEncryptorDecryptArray, 0, toEncryptorDecryptArray.Length);
            tdes.Clear();
            if (encrypt == true)
            { //if encrypt we need to return encrypted string
                return Convert.ToBase64String(resultsArray, 0, resultsArray.Length);
            }
            //else we need to return decrypted string
            return UTF8Encoding.UTF8.GetString(resultsArray);
        }

        public string GetSystemSetting(string SysKey)
        {
            string result = string.Empty;
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@SysKey",SysKey ), };
                var ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetSystemSettingsBySysKey", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    result = ds.Tables[0].Rows[0]["SysValue"].ToString();
                }
            }
            catch (Exception ex)// (Exception ex)
            {

            }
            return result;
        }

        public static void SaveFlightSubProcessTrans(Int64 DailyFlightSNo, int ProcessSNo, int SubProcessSNo, bool Status, string Remark)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                new SqlParameter("@ProcessSNo", ProcessSNo),
                new SqlParameter("@SubProcessSNo", SubProcessSNo),
                new SqlParameter("@Status", Status),
                new SqlParameter("@Remark", Remark),
                new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };

                int result = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spProcess_SaveFlightSubProcessTrans", Parameters);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //Added by KK 03/05/2017 for Check AWB or Flight Locked or not
        // Changes by Vipin Kumar
        //public string GetAWBLockedEvent(string UserSNo, string AWBSNo, string DailyFlightSNo, string FlightNo, string FlightDate, string ULDNo)
        public string GetAWBLockedEvent(AWBLockedEvent awbLockedEvent)
        // Ends
        {




            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@UserSNo",awbLockedEvent.UserSNo),
                                                new SqlParameter("@AWBSNo",awbLockedEvent.AWBSNo),
                                                new SqlParameter("@DailyFlightSNo",awbLockedEvent.DailyFlightSNo),
                                                new SqlParameter("@FlightNo",awbLockedEvent.FlightNo),
                                                new SqlParameter("@FlightDate",awbLockedEvent.FlightDate ),
                                                 new SqlParameter("@ULDNo",awbLockedEvent.ULDNo ),
                                                  new SqlParameter("@SubProcessSNo",awbLockedEvent.SubProcessSNo ),
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spLocking_CheckLock", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        //Added by KK 03/05/2017 for Save AWB or Flight Locked info
        public string SaveUpdateLockedProcess(string AWBSNo, string DailyFlightSNo, string FlightNo, string FlightDate, string UpdatedBy, string SubprocessSNo, string SUbprocess, string Event, string ULDNo)
        {

            var Message = "";
            AWBSNo = AWBSNo == "" ? "0" : AWBSNo;
            SqlParameter[] Parameters = {   new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                            new SqlParameter("@FlightNo", FlightNo),
                                            new SqlParameter("@FlightDate", FlightDate),
                                            new SqlParameter("@UpdatedBy", UpdatedBy),
                                            new SqlParameter("@SubprocessSNo", SubprocessSNo),
                                            new SqlParameter("@SUbprocess", SUbprocess),
                                            new SqlParameter("@Event", Event) ,
                                              new SqlParameter("@ULDNo",ULDNo )};
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spLocking_SaveAndUpdate", Parameters);
                if (ds != null)
                {
                    if (ds.Tables[ds.Tables.Count - 1].Rows.Count > 0)
                        return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                }
                return "Error";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public void SaveAppendGridAuditLog(string data, string ModuleName, string AppsName, string KeyColumn, string KeyValue, string KeySNo, string FormAction, string TerminalSNo, string TerminalName)
        {
            try
            {

                List<AuditLog> auditLog = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AuditLog>>(CargoFlash.Cargo.Business.Common.Base64ToString(data));


                string KeyColumn1 = "", KeyColumn2 = "", KeyColumn3 = "", KeyColumn4 = "";
                string KeyValue1 = "", KeyValue2 = "", KeyValue3 = "", KeyValue4 = "";
                KeyColumn = KeyColumn == "A~A" ? "" : KeyColumn;
                KeyValue = KeyValue == "A~A" ? "" : KeyValue;
                var KeyCol = KeyColumn.Split(',');
                var KeyVal = KeyValue.Split(',');
                var count = KeyCol.Count();
                if (KeyCol.Count() >= 1)
                {
                    KeyColumn = KeyCol[0];
                }
                if (KeyCol.Count() >= 2)
                {
                    KeyColumn1 = KeyCol[1];
                }
                if (KeyCol.Count() >= 3)
                {
                    KeyColumn2 = KeyCol[2];
                }
                if (KeyCol.Count() >= 4)
                {
                    KeyColumn3 = KeyCol[3];
                }
                if (KeyCol.Count() >= 5)
                {
                    KeyColumn4 = KeyCol[4];
                }
                if (KeyVal.Count() >= 1)
                {
                    KeyValue = KeyVal[0];
                }
                if (KeyVal.Count() >= 2)
                {
                    KeyValue1 = KeyVal[1];
                }
                if (KeyVal.Count() >= 3)
                {
                    KeyValue2 = KeyVal[2];
                }
                if (KeyVal.Count() >= 4)
                {
                    KeyValue3 = KeyVal[3];
                }
                if (KeyVal.Count() >= 5)
                {
                    KeyValue4 = KeyVal[4];
                }
                var res = CollectionHelper.ConvertTo(auditLog, "");
                CargoFlash.Cargo.Model.UserLogin userLogin = new CargoFlash.Cargo.Model.UserLogin();
                CargoFlash.Cargo.DataService.LoginService loginservice = new CargoFlash.Cargo.DataService.LoginService();

                string ip = loginservice.GetIPAddress();
                var usr = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]));
                //IPAddress ipAddress = Array.FindLast(Dns.GetHostEntry(string.Empty).AddressList, a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
                //string ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_FORWARDED_FOR"];
                //if (!string.IsNullOrEmpty(ipAddress))
                //{
                //    string[] forwardedIps = ipAddress.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                //    ipAddress = forwardedIps[forwardedIps.Length - 1];
                //}
                //else
                //{
                //    ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                //}
                System.Web.HttpBrowserCapabilities browser = System.Web.HttpContext.Current.Request.Browser;
                SqlParameter[] Parameters = {
                        new SqlParameter("@ModuleName", ModuleName.ToUpper()),
                        new SqlParameter("@ApplicationName", AppsName.ToUpper()),
                        new SqlParameter("@KeyColumn",KeyColumn),
                        new SqlParameter("@KeyColumn1", KeyColumn1),
                        new SqlParameter("@KeyColumn2", KeyColumn2),
                        new SqlParameter("@KeyColumn3", KeyColumn3),
                        new SqlParameter("@KeyColumn4", KeyColumn4),
                        new SqlParameter("@KeyValue", KeyValue),
                        new SqlParameter("@KeyValue1", KeyValue1),
                        new SqlParameter("@KeyValue2", KeyValue2),
                        new SqlParameter("@KeyValue3", KeyValue3),
                        new SqlParameter("@KeyValue4", KeyValue4),
                        new SqlParameter("@KeySNo", KeySNo),
                        new SqlParameter("@UserName",usr.UserName.ToString()),
                        new SqlParameter("@UserSno",usr.UserSNo),
                        new SqlParameter("@UserGroup",usr.GroupName),
                        new SqlParameter("@IpAddress",ip),
                        new SqlParameter("@Browser",browser.Browser),
                        new SqlParameter("@LoginCity",usr.CityCode),
                        new SqlParameter("@dt",res),
                        new SqlParameter("@FormAction",FormAction),
                        new SqlParameter("@TerminalSNo",TerminalSNo),
                        new SqlParameter("@TerminalName",TerminalName)
                    };

                SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCommon_SaveAuditLog", Parameters);

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public int GetServiceStatus()
        {
            int Result = 0;
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spScheduler_GetSchedulerStatus");
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                Result = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
            return Result;
        }

        public string GetSchedulerStatusDetails()
        {
            string Result = string.Empty;
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spScheduler_GetSchedulerStatusDetails");
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            return Result;
        }
       
    }
    [KnownType(typeof(AuditLog))]
    public class AuditLog
    {

        public string ProcessName { get; set; }
        public string SubprocessName { get; set; }
        public string ColumnName { get; set; }
        private string _OldValue;
        public string OldValue { get; set; }
        //{
        //    get
        //    {
        //        return CargoFlash.Cargo.Business.Common.Base64ToString(_OldValue);
        //    }
        //    set
        //    {
        //        _OldValue = value;
        //    }
        //}

        private string _NewValue;
        public string NewValue { get; set; }
        //{
        //    get
        //    {
        //        return CargoFlash.Cargo.Business.Common.Base64ToString(_NewValue);
        //    }
        //    set
        //    {
        //        _NewValue = value;
        //    }
        //}
    }

    public class PageRightsByAppName
    {
        public bool IsRead { get; set; }
        public bool IsNew { get; set; }
        public bool IsEdit { get; set; }
        public bool IsDelete { get; set; }

    }
    [KnownType(typeof(AjaxRequestError))]
    public class AjaxRequestError
    {
        public string URL { get; set; }
        public string status { get; set; }
        public string statusText { get; set; }
        public string responseText { get; set; }
        public string RequestUrl { get; set; }
        public string PageURL { get; set; }
        public string module { get; set; }
        public string Apps { get; set; }
    }


}