using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model;
using CargoFlash.SoftwareFactory.Data;
using System.Web;
using System.Web.UI;
using System.IO;
using System.Xml;
using CargoFlash.Cargo.Business;
using System.Collections.Specialized;
using System.Security.Cryptography;
using CargoFlash.Cargo.DataService.Common;
using System.Net;


namespace CargoFlash.Cargo.DataService
{
    public class SignatureAuthenticate
    {

        public SignatureAuthenticate()
        {
            //if (System.Web.HttpContext.Current.Session["ActingLoginType"] == null || System.Web.HttpContext.Current.Session["LoginSNo"] == null)
            //{
            //    throw new Exception("Unauthorized Request.");
            //}
            if (Authenticate())
            {
            }
            else
            {
                //throw new WebFaultException<string>("Unauthorized Request.", HttpStatusCode.Unauthorized);
            }
        }

        public SignatureAuthenticate(bool authenticationCheck)
        {
            string sessionToken = string.Empty;

            if (HttpContext.Current.Session["UserDetail"] != null)
                sessionToken = ((UserLogin)HttpContext.Current.Session["UserDetail"]).Signature;

            if (!ValidToken(sessionToken))
                throw new WebFaultException<string>("Unauthorized Request.", HttpStatusCode.Unauthorized);
        }

        private bool Authenticate()
        {
            bool Authenticated = false;
            //HttpContext.Current.Request.Url.AbsolutePath.ToLower().EndsWith("/services/autocompleteservice.svc/autocompletedatasource") ||
            if (HttpContext.Current.Request.Url.AbsolutePath.ToLower().Contains("login")
                || HttpContext.Current.Request.Url.AbsolutePath.ToLower().Contains("default.cshtml")
                || HttpContext.Current.Request.Url.AbsolutePath.ToLower().Contains("index.cshtml")
                || HttpContext.Current.Request.Url.AbsolutePath.ToLower().Contains("comparesession")
                || HttpContext.Current.Request.Url.AbsolutePath.ToLower().Contains("resetpassword")
                || HttpContext.Current.Request.Url.AbsoluteUri.ToLower().Contains("module=n/a")
                || HttpContext.Current.Request.Url.AbsolutePath.ToLower().Contains("updatechangepassword"))
            {
                Authenticated = true;
            }
            else
            {
                //Uri theRealURL = new Uri(HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + HttpContext.Current.Request.RawUrl);
                string sessionToken = string.Empty;

                //if (HttpContext.Current.Session["UserDetail"] != null)
                //    sessionToken = ((UserLogin)HttpContext.Current.Session["UserDetail"]).Signature;

                if (WebOperationContext.Current != null)
                {
                    IncomingWebRequestContext request = WebOperationContext.Current.IncomingRequest;
                    WebHeaderCollection headers = request.Headers;
                    foreach (string headerName in headers.AllKeys)
                    {
                        if (headerName == "Token")
                            sessionToken = headers[headerName].ToString();
                    }
                }
                else if (HttpContext.Current != null && HttpContext.Current.Request != null)


                {

                    foreach (string headerName in HttpContext.Current.Request.Headers.AllKeys)
                    {
                        if (headerName == "Token")
                            sessionToken = HttpContext.Current.Request.Headers[headerName].ToString();
                    }
                }

                return ValidToken(sessionToken);

            }
            return Authenticated;
        }

        public bool ValidToken(string sessionToken)
        {
            bool Authenticated = false;
            if (!string.IsNullOrEmpty(sessionToken))
            {
                SqlParameter IsValidSignature = new SqlParameter("@IsValidSignature", SqlDbType.Bit);
                IsValidSignature.Direction = ParameterDirection.Output;

                SqlParameter[] Parameters = { new SqlParameter("@Signature", sessionToken),
                        new SqlParameter("@RequestURL", HttpContext.Current.Request.Url.AbsoluteUri),
                        IsValidSignature };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AuthenticateCF_Signature", Parameters);
                Authenticated = Convert.ToBoolean(IsValidSignature.Value.ToString().ToLower());
            }

            return Authenticated;
        }

    }

    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "LoginService" in both code and config file together.
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class LoginService : SignatureAuthenticate, ILoginService
    {
        CommonService c = new CommonService();

        //to get envoirnment created by nipun.
        public string GetAirline()
        {
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetEnvoirnment");
            if (ds != null && ds.Tables.Count > 0)
            {
                return ds.Tables[0].Rows[0]["SysValue"].ToString();
            }
            else
            {
                return "";
            }
            
        }
        public UserLogin GetLoginRecord(string UserID, string Password, string IP, string HostName, string Browser, string SessionID, string CaptchaCode)
        {
            string errorMessage = string.Empty;
            int NoOfBadAttempts = 0;

            string resultval = GetValidLoginMessage(UserID, Password, out NoOfBadAttempts);
            //string resultval = loginservice.GetValidLoginMessage(email, password);
            if (resultval == "1" || resultval == "4") { errorMessage = "Invalid User ID."; }
            else if (resultval == "2" || resultval == "3") { errorMessage = "Invalid Password- Remaining Attempt :- " + NoOfBadAttempts.ToString(); }
            else if (resultval == "5") { errorMessage = "Account disabled,Please contact Admin."; }
            else if (resultval == "6") { errorMessage = "Account disabled After 3 bad attempts,Please contact Admin."; }
            else if (resultval == "11") { errorMessage = "User Id is Inactivated. Please contact Admin."; }
            else if (resultval == "7" || resultval == "8")
            {
                errorMessage = "Password Expired.";
                //@Html.Hidden("HdnPasswordExpire", result);
                //@Html.Hidden("HdnUserEmail", email) 
            }

            else if (resultval == "10")
            {
                errorMessage = "Your password has been expired kindly proceed with change password";
                //@Html.Hidden("HdnPasswordExpire", result);
                //@Html.Hidden("HdnUserEmail", email) 
            }
            if (!string.IsNullOrEmpty(errorMessage))
                throw new FaultException(new FaultReason(errorMessage));

            var captchavalue = HttpContext.Current.Session["CaptchaCode"];

            CommonService CS = new CommonService();
            int ISCaptcha = Convert.ToInt32(CS.GetSystemSetting("ISCaptcha"));

            ////////Validate Captcha before login/////////////////////////////////////////////////////////////////////////////////////////// by Parvez Khan
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




            //Commented by akash  on 29 sep 2017
            //if (Convert.ToInt32(Password.Length) >= 20) { pwd = Password; }
            //else { pwd = c.GenerateSHA512String(Password); }


            string pwd = c.GenerateSHA512String(Password);  //added by akash  on 29 sep 2017


            UserLogin userLogin = new UserLogin();
            string url = HttpContext.Current.Request.Url.Host.ToString();
            SqlParameter param = new SqlParameter();

            string Absolutepath = HttpContext.Current.Request.Url.AbsoluteUri;
            url = Absolutepath.Replace("Account/GarudaLogin.cshtml", "");
            //if (url.Contains("icms.garuda-indonesia.com"))
            //    url = "https://icms.garuda-indonesia.com";

            var uri = new Uri(url);
            var oAuth = new CargoFlash.Cargo.Model.CFAuthenticate();
            var signature = oAuth.GenerateSignature(uri, "POST", UserID);

            SqlParameter[] Parameters = {
                                            new SqlParameter("@EMailID",  UserID),
                                            new SqlParameter("@Password", pwd),
                                            new SqlParameter("@IP",  IP),
                                            new SqlParameter("@HostName",  HostName),
                                            new SqlParameter("@Browser",  Browser),
                                            new SqlParameter("@SessionID",  SessionID),
                                            new SqlParameter("@RequestUrl",url),
                                            new SqlParameter("@Signature",signature)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSecureLogin", Parameters);
            if (ds != null && ds.Tables.Count > 0)
            {
                var dr = ds.Tables[0].Rows[0];
                if (dr["SNo"] != DBNull.Value)
                {
                    userLogin = ds.Tables[1].AsEnumerable().Select(e => new UserLogin
                    {
                        UserSNo = Convert.ToInt16(e["SNo"]),
                        UserName = e["UserId"].ToString(),
                        FirstName = e["FirstName"].ToString(),
                        LastName = e["LastName"].ToString(),
                        // Password = e["Password"].ToString(),  //Comment By Akash
                        CityCode = e["CityCode"].ToString(),
                        CityName = e["CityName"].ToString(),
                        CitySNo = e["CitySNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["CitySNo"]),
                        AirportCode = e["AirportCode"].ToString(),
                        AirportName = e["AirportName"].ToString(),
                        AirportSNo = e["AirportSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["AirportSNo"]),
                        CurrencySNo = e["CurrencySNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["CurrencySNo"]),
                        CountrySNo = e["CountrySNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["CountrySNo"]),
                        CurrencyCode = e["CurrencyCode"].ToString(),
                        CurrencyName = e["CurrencyName"].ToString(),
                        MenuDetails = e["MenuDetails"].ToString(),
                        GroupSNo = e["GroupSNo"] == DBNull.Value ? 57 : Convert.ToInt32(e["GroupSNo"]),
                        OfficeSNo = e["OfficeSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["OfficeSNo"]),
                        OfficeName = e["OfficeName"].ToString(),
                        NewTerminalSNo = e["NewTerminalSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["NewTerminalSNo"]),
                        NewTerminalName = e["NewTerminalName"].ToString(),
                        TerminalSNo = e["TerminalSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TerminalSNo"]),
                        DefaultTerminalSNo = e["DefaultTerminalSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["DefaultTerminalSNo"]),
                        IsLogin = false,
                        WarehouseSNo = e["WarehouseSno"].ToString(),
                        WarehouseName = e["WarehouseName"].ToString(),
                        GroupName = e["GroupName"].ToString(),
                        AgentName = e["AgentName"].ToString(),
                        AgentSNo = e["AgentSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["AgentSNo"]),
                        IsShowAllData = Convert.ToBoolean(e["IsShowAllData"]),
                        AirlineSNo = e["AirlineSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["AirlineSNo"]),
                        AirlineName = e["AirlineName"].ToString(),
                        AirlineCarrierCode = Convert.ToString(e["AirlineCarrierCode"]),
                        VAccountNo = e["VAccountNo"].ToString(),
                        Signature = e["UserSignature"].ToString(),
                        UserType= e["UserType"].ToString(),
                        UserTypeName = e["UserTypeName"].ToString(),
                        AllowedUserCreation=e["AllowedUserCreation"].ToString(),
                        MasterOffice= e["MasterOffice"].ToString(),
                        CountryCode=e["CountryCode"].ToString(),
                        CountryName=e["CountryName"].ToString(),
                        PageRights = ds.Tables[2].AsEnumerable().Select(m => new PageRights
                        {
                            Apps = m["Apps"].ToString(),
                            PageRight = m["Rights"].ToString(),
                            Hyperlink = Convert.ToString(m["Hyperlink"]),
                            PageName = Convert.ToString(m["PageName"])

                        }).ToList(),
                        ProcessRights = ds.Tables[4].AsEnumerable().Select(m => new ProcessRights
                        {
                            SubProcessSNo = m["SubProcessSNo"].ToString(),
                            SubProcessName = m["SubProcessName"].ToString(),
                            IsView = Convert.ToBoolean(m["IsView"]),
                            IsEdit = Convert.ToBoolean(m["IsEdit"]),
                            IsBlocked = Convert.ToBoolean(m["IsBlocked"])
                        }).ToList(),
                        //SpecialRights = ds.Tables[5].AsEnumerable().Select(m => new SpecialRights {
                        //    PageSNo=m["PageSNo"].ToString(),
                        //    Code=m["Code"].ToString(),
                        //    IsEnabled=Convert.ToBoolean(m["IsEnabled"])
                        //}).ToList(),
                        SpecialRights = ds.Tables[5].AsEnumerable().ToDictionary<DataRow, string, bool>(row => row.Field<string>(0), row => row.Field<bool>(1)),
                        SysSetting = ds.Tables[3].AsEnumerable().ToDictionary<DataRow, string, string>(row => row.Field<string>(0), row => row.Field<string>(1))
                    }).First();
                }
            }

            return userLogin;

        }

        public string GetValidLoginMessage(string UserID, string Password, out int NoOfBadAttempts) // Used For get proper login validation message :Created by : Parvez Khan
        {
            string returnVal = string.Empty;
            NoOfBadAttempts = 0;
            var pwd = "";

            //Commented by akash  on 29 sep 2017
            //if (Convert.ToInt32(Password.Length) >= 20) { pwd = Password; }
            //else { pwd = c.GenerateSHA512String(Password); }


            pwd = c.GenerateSHA512String(Password);  //added by akash  on 29 sep 2017


            UserLogin userLogin = new UserLogin();
            string url = HttpContext.Current.Request.Url.Host.ToString();
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@EMailID",  UserID),
                                            new SqlParameter("@Password",  pwd) 
                                            //new SqlParameter("@Password",  Password) 
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetValidLoginMessage", Parameters);
            if (ds != null && ds.Tables.Count > 0)
            {
                NoOfBadAttempts = Convert.ToInt32(ds.Tables[0].Rows[0]["NoOfBadAttemps"].ToString());
                returnVal = ds.Tables[0].Rows[0]["Flag"].ToString();
            }
            return returnVal;
        }

        public UserLogin GetTokenRecord(string UserID)
        {
            //  UserID = c.Decrypt(UserID);
            UserLogin userLogin = new UserLogin();
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@EMailID",  UserID),
                                             new SqlParameter("@IP",  null),
                                              new SqlParameter("@HostName",  null),
                                               new SqlParameter("@Browser",  null),
                                               new SqlParameter("@SessionID",  null)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSecureLoginEncrypted", Parameters);
            if (ds != null && ds.Tables.Count > 0)
            {
                var dr = ds.Tables[0].Rows[0];
                if (dr["SNo"] != DBNull.Value)
                {
                    userLogin = ds.Tables[1].AsEnumerable().Select(e => new UserLogin
                    {
                        UserSNo = Convert.ToInt16(e["SNo"]),
                        UserName = e["UserId"].ToString(),
                        Password = e["Password"].ToString(),
                        CityCode = e["CityCode"].ToString(),
                        CitySNo = e["CitySNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["CitySNo"]),
                        AirportCode = e["AirportCode"].ToString(),
                        AirportSNo = e["AirportSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["AirportSNo"]),
                        CurrencySNo = e["CurrencySNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["CurrencySNo"]),
                        CurrencyCode = e["CurrencyCode"].ToString(),
                        MenuDetails = e["MenuDetails"].ToString(),
                        GroupSNo = e["GroupSNo"] == DBNull.Value ? 57 : Convert.ToInt32(e["GroupSNo"]),
                        OfficeSNo = e["OfficeSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["OfficeSNo"]),
                        NewTerminalSNo = e["NewTerminalSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["NewTerminalSNo"]),
                        TerminalSNo = e["TerminalSNo"] == DBNull.Value ? 0 : Convert.ToInt32(e["TerminalSNo"]),
                        IsLogin = false,
                        PageRights = ds.Tables[2].AsEnumerable().Select(m => new PageRights
                        {
                            Apps = m["Apps"].ToString(),
                            PageRight = m["Rights"].ToString()
                        }).ToList(),
                        ProcessRights = ds.Tables[4].AsEnumerable().Select(m => new ProcessRights
                        {
                            SubProcessSNo = m["SubProcessSNo"].ToString(),
                            SubProcessName = m["SubProcessName"].ToString(),
                            IsView = Convert.ToBoolean(m["IsView"]),
                            IsEdit = Convert.ToBoolean(m["IsEdit"])
                        }).ToList(),
                        //SpecialRights = ds.Tables[5].AsEnumerable().Select(m => new SpecialRights
                        //{
                        //    PageSNo = m["PageSNo"].ToString(),
                        //    Code = m["Code"].ToString(),
                        //    IsEnabled = Convert.ToBoolean(m["IsEnabled"])
                        //}).ToList(),
                        SpecialRights = ds.Tables[5].AsEnumerable().ToDictionary<DataRow, string, bool>(row => row.Field<string>(0), row => row.Field<bool>(1)),
                        SysSetting = ds.Tables[3].AsEnumerable().ToDictionary<DataRow, string, string>(row => row.Field<string>(0), row => row.Field<string>(1))
                    }).First();
                }
            }

            return userLogin;

        }


        public void CheckPageRight(int userSNo, string module, string app, string formAction)
        {

            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UserSNo", userSNo),
                                            new SqlParameter("@Module", module),
                                            new SqlParameter("@Apps", app),
                                            new SqlParameter("@FormAction",formAction)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPageRights", Parameters);
                if (Convert.ToString(ds.Tables[0].Rows[0][0]) != "True")
                    throw new Exception("You do not have permission to access this page.");


            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }


        public void SetPageAccessLog(PageAccessLogModel p)
        {
            CheckPageRight(p.UserSNo, p.Module, p.AppName, p.FormAction);

            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UserSNo",  p.UserSNo),
                                            new SqlParameter("@UserID",  p.UserID),
                                            new SqlParameter("@CityCode",  p.CityCode),
                                            new SqlParameter("@Module",  p.Module),
                                            new SqlParameter("@AppName",  p.AppName),
                                            new SqlParameter("@FormAction",  p.FormAction),
                                            new SqlParameter("@IPAddress",  p.IPAddress),
                                            new SqlParameter("@HostName",  p.HostName),
                                            new SqlParameter("@TerminalSNo",  p.TerminalSNo),
                                            new SqlParameter("@Browser",  p.Browser),
                                            new SqlParameter("@Url",  p.URL),
                                            new SqlParameter("@SesstionId",HttpContext.Current.Session.SessionID)
                                        };
                SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SetPageAccessLog", Parameters);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //public NameValueCollection GetSystemSettings()
        //{
        //    NameValueCollection sysSetting = new NameValueCollection();
        //    try
        //    {
        //        SqlParameter[] Parameters = {
        //                                };
        //        DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSystemSetting_Get", Parameters);
        //        if(ds != null && ds.Tables.Count > 0)
        //        {
        //            foreach (DataRow dr in ds.Tables[0].Rows)
        //                sysSetting.Add(dr["SysKey"].ToString(), dr["SysValue"].ToString());
        //        }

        //    }
        //    catch(Exception ex)// { }
        //    return sysSetting;
        //}

        public DataSet GetCitySNo(int Airportsno, int UserSNo)//
        {
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@Airportsno",  Airportsno),
                                         new SqlParameter("@UserSNo",  UserSNo)};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCitySNo", Parameters);
            return ds;

        }

        public string GetNewTerminalName(int SNo)
        {
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo",  SNo)};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetNewTerminalName", Parameters);
            return ds.Tables[0].Rows[0]["NewTerminalName"].ToString();

        }


        public int UpdateUserInfoOnAirportChanges(int SNo, int TerminalSNo, int CitySNo, int AirportSNo)
        {
            //int Result=0
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo",  SNo),
                                            new SqlParameter("@TerminalSNo",  TerminalSNo),
                                            new SqlParameter("@CitySNo",  CitySNo),
                                            new SqlParameter("@AirportSNo",  AirportSNo),
                                        };
            int Result = SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUpdateUserInfoOnAirportChanges", Parameters);
            return Result;

        }

        public void RememberMe(bool rememberMe, string email, string password)
        {

            var pwd = "";
            if (Convert.ToInt32(password.Length) >= 20) { pwd = password; }
            else { pwd = c.GenerateSHA512String(password); }

            if (rememberMe)
            {
                HttpContext.Current.Response.Cookies["UserName"].Value = email.Trim();
                HttpContext.Current.Response.Cookies["Password"].Value = pwd;
                HttpContext.Current.Response.Cookies["UserName"].Expires = DateTime.Now.AddDays(1);
                HttpContext.Current.Response.Cookies["Password"].Expires = DateTime.Now.AddDays(1);
            }
            else
            {
                HttpContext.Current.Response.Cookies["UserName"].Expires = DateTime.Now.AddDays(-1);
                HttpContext.Current.Response.Cookies["Password"].Expires = DateTime.Now.AddDays(-1);

            }
        }
        //public bool Validate(string Response)
        //{
        //    //string Response = Request["g-recaptcha-response"];//Getting Response String Append to Post Method
        //    bool Valid = false;
        //    //Request to Google Server
        //    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(" https://www.google.com/recaptcha/api/siteverify?secret=6LdYXhUUAAAAAG_RXWxWmKimgSPD2v-PhfNNakLZ&response=" + Response);
        //    try
        //    {
        //        //Google recaptcha Response
        //        using (WebResponse wResponse = req.GetResponse())
        //        {

        //            using (StreamReader readStream = new StreamReader(wResponse.GetResponseStream()))
        //            {
        //                string jsonResponse = readStream.ReadToEnd();

        //                var s = new System.Web.Script.Serialization.JavaScriptSerializer();
        //                MyObject data = js.Deserialize<MyObject>(jsonResponse);// Deserialize Json

        //                Valid = Convert.ToBoolean(data.success);
        //            }
        //        }

        //        return Valid;
        //    }
        //    catch(Exception ex)// (WebException ex)
        //    {
        //        throw ex;
        //    }
        //}



        // added by arman 
        public DataSet GetCredit(int AgentSNo, int UserSNo)//
        {
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@AgentSNo",  AgentSNo), new SqlParameter("@UserSNo",  UserSNo)
};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCredit", Parameters);
            return ds;

        }
        /// <summary>
        /// added by preeti 
        /// </summary>
        /// <param name="AgentSNo"></param>
        /// <returns></returns>
        public DataSet GetFilePath(int UserSNo)//
        {
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@UserSNo",  UserSNo),
           };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFilePath", Parameters);
            return ds;

        }
        //public int updateRateDownload(string FilePath, int UserSNo)
        //{
        //    SqlParameter param = new SqlParameter();
        //    var stream = new MemoryStream();


            
        //    if (FilePath != null || FilePath != string.Empty)
        //        {

        //            //FilePath=FilePath.Replace(@"\\",@"\");
        //              //FilePath =FilePath;
        //            if ((System.IO.File.Exists(FilePath)))
        //            {
        //            using (var file = File.OpenRead(FilePath))
        //            {
        //                // write something to the stream:
        //                file.CopyTo(stream);
        //                // here, the MemoryStream is positioned at its end
        //            }
        //            // This is the crucial part:
        //            //stream.Position = 0L;
        //            //System.IO.File.Delete(FilePath);
        //            }

        //        }
        //    //TextWriter textWriter = new StreamWriter(stream);
        //    //textWriter.WriteLine("Something");
        //    //textWriter.Flush(); // added this line
        //    byte[] bytesInStream = stream.ToArray(); // simpler way of converting to array
        //    //stream.Close();
        //    //HttpResponse Response = HttpContext.Current.Response;
        //    //Response.Clear();
        //    //Response.ContentType = "application/vnd.ms-excel";
        //    //Response.AddHeader("content-disposition", "attachment;filename=name_you_file.xls");
        //    //Response.BinaryWrite(bytesInStream);
        //    //Response.Flush();

        //    HttpResponse response = HttpContext.Current.Response;
        //    try
        //    {
        //        response.Clear();
        //        response.ClearContent();
        //        response.ContentType = "application/octet-stream";
        //        response.ClearHeaders();
        //        response.Buffer = true;
        //        response.BufferOutput = true;
        //        //response.AddHeader("Content-Disposition", "attachment;filename=name_you_file.xls");
        //        response.BinaryWrite(bytesInStream);
        //        response.Flush();
        //        // HttpContext.Current.Response.Flush(); // Sends all currently buffered output to the client.
        //        response.SuppressContent = true;  // Gets or sets a value indicating whether to send HTTP content to the client.
        //        HttpContext.Current.ApplicationInstance.CompleteRequest();
        //        // response.End();
        //        stream.Close();
        //        //System.Web.HttpContext.Current.Response.Clear();
        //        //System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=name_you_file.xls");
        //        //System.Web.HttpContext.Current.Response.BinaryWrite(bytesInStream);
        //        //System.Web.HttpContext.Current.Response.Flush();
        //        SqlParameter[] Parameters = {
        //                                    new SqlParameter("@FilePath",  FilePath), new SqlParameter("@UserSNo",  UserSNo),
        //   };
        //        int result = SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateRateDownloadData", Parameters);
        //    }
        //    catch( Exception ex)
        //    {

        //    }
        //    finally
        //    {
        //        response.End();
        //    }
        //    return result;

        //}
        // Added by DEVENDRA SINGH 05 FEB 2019 FOR REQ. 9883(G9)
        public DataSet GetCreditLimit(int OfficeSNo, int UserSNo)//
        {
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@OfficeSNo",  OfficeSNo), new SqlParameter("@UserSNo",  UserSNo)
};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCreditLimitoffice", Parameters);
            return ds;

        }

        //====Created By Akash
        public string GetIP()
        {
            string Str = "";
            Str = System.Net.Dns.GetHostName();
            IPHostEntry ipEntry = System.Net.Dns.GetHostEntry(Str);
            IPAddress[] addr = ipEntry.AddressList;
            return addr[addr.Length - 1].ToString();

        }
        //====Created By Akash
        public string GetIPAddress()
        {
            System.Web.HttpContext context = System.Web.HttpContext.Current;
            string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }

            return context.Request.ServerVariables["REMOTE_ADDR"];
        }
        public string GetUserIP()
        {
            string ipList = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipList))
            {
                return ipList.Split(',')[0];
            }

            return System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
        }

        public int InsertIpAddres(string ip1, string ip2, string ip3, string ip4, string ip5, string ip6, string ip7, string ip8, string ip9, string ip10)
        {
            SqlParameter param = new SqlParameter();

            SqlParameter[] Parameters = {
                                            new SqlParameter("@ip1",  ip1),
                                            new SqlParameter("@ip2",  ip2),
                                            new SqlParameter("@ip3",  ip3),
                                            new SqlParameter("@ip4",  ip4),
                                            new SqlParameter("@ip5",  ip5),
                                            new SqlParameter("@ip6",  ip6),
                                            new SqlParameter("@ip7",  ip7),
                                            new SqlParameter("@ip8",  ip8),
                                            new SqlParameter("@ip9",  ip9),
                                            new SqlParameter("@ip10",  ip10),
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpTempStoreClientIp_ByAkash", Parameters);
            return 0;
        }

        public bool LogoutSession(UserLogin l)
        {
            //If Session expire then UserLogin object would be Null
            if (l == null)
                return true;

            SqlParameter IsLogOut = new SqlParameter("@IsLogOut", SqlDbType.Bit);
            IsLogOut.Direction = ParameterDirection.Output;
            SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo",  l.UserSNo),
                                            new SqlParameter("@Signature",l.Signature),
                                            IsLogOut
                                        };
            SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "LogoutSession", Parameters);
            return Convert.ToBoolean(IsLogOut.Value.ToString().ToLower());
        }

        public void SetPageAccessLogNew(PageAccessLogModel p)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UserSNo",  p.UserSNo),
                                            new SqlParameter("@UserID",  p.UserID),
                                            new SqlParameter("@CityCode",  p.CityCode),
                                            new SqlParameter("@Module",  p.Module),
                                            new SqlParameter("@AppName",  p.AppName),
                                            new SqlParameter("@FormAction",  p.FormAction),
                                            new SqlParameter("@IPAddress",  p.IPAddress),
                                            new SqlParameter("@HostName",  p.HostName),
                                            new SqlParameter("@TerminalSNo",  p.TerminalSNo),
                                            new SqlParameter("@Browser",  p.Browser),
                                            new SqlParameter("@Url",  p.URL),
                                            new SqlParameter("@SesstionId",HttpContext.Current.Session.SessionID)
                                        };
                SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SetPageAccessLog", Parameters);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

    }
    public static class IPhelper
    {
        public static string GetIPAddress()
        {
            if (System.Web.HttpContext.Current.Request.Headers["CF-CONNECTING-IP"] != null) return System.Web.HttpContext.Current.Request.Headers["CF-CONNECTING-IP"].ToString();

            if (System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null) return System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();

            return System.Web.HttpContext.Current.Request.UserHostAddress;
        }
    }




    // end here
}
