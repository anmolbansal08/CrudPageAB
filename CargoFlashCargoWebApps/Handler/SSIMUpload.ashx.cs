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

namespace CargoFlashCargoWebApps.Handler
{
    /// <summary>
    /// Summary description for SSIMUpload
    /// </summary>
    public class SSIMUpload : IHttpHandler
    {
        string Origin = string.Empty;
        string Destination = string.Empty;
        string OriginAirportCode = string.Empty;
        string DestinationAirportCode = string.Empty;
        string AircraftType = string.Empty;

        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.QueryString["SASSSIMUpload"] == "Yes")
                SASSSIMUpload(context);

            if (context.Request.QueryString["ULD"] == "ULD")
                ULDStock(context);
            //if (context.Request.QueryString["FileName"]!= "")
            //    DownloadULDExcel(System.Web.HttpContext.Current.Request.QueryString["Excelpath"], System.Web.HttpContext.Current.Request.QueryString["FileName"]);
            else
                SSIMUpload1(context);

        }
        private DataTable GetScheduleTable()
        {
            var dtSchedule = new DataTable();
            dtSchedule.Columns.Add("SNo");
            dtSchedule.Columns.Add("AirlineCode");
            dtSchedule.Columns.Add("FlightNo");
            dtSchedule.Columns.Add("ValidFrom");
            dtSchedule.Columns.Add("ValidTo");
            dtSchedule.Columns.Add("Days");
            dtSchedule.Columns.Add("Origin");
            dtSchedule.Columns.Add("ETD");
            dtSchedule.Columns.Add("Destination");
            dtSchedule.Columns.Add("ValidationMessage");
            dtSchedule.Columns.Add("ETA");
            dtSchedule.Columns.Add("AircraftType");
            dtSchedule.Columns.Add("AircraftSNo");
            dtSchedule.Columns.Add("AllocatedGrossWeight");
            dtSchedule.Columns.Add("AllocatedVolumeWeight");
            dtSchedule.Columns.Add("FlightTypeSNo");
            dtSchedule.Columns.Add("Active");
            dtSchedule.Columns.Add("IsValid");
            dtSchedule.Columns.Add("Stops");
            dtSchedule.Columns.Add("DayDifference");
            dtSchedule.Columns.Add("CreatedBy");
            dtSchedule.Columns.Add("CreatedOn");
            dtSchedule.Columns.Add("OriginAirportCode");
            dtSchedule.Columns.Add("DestinationAirportCode");
            return dtSchedule;
        }
        private DataTable SSIMTable(string[] SSIMString, DataTable dtSchedule)
        {
            var WeekDays = new[] { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
            var Month = new[] { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };
            int SNo = 0;
            var controlCity = string.Empty;
            for (int i = 1; i < SSIMString.Length; i++)
            {
                if (i == 1)
                {
                    controlCity = SSIMString[i];
                    continue;
                }

                var flightArray = SSIMString[i].Split(' ');
                for (int j = 0; j < 2; j++)
                {
                    if (j == 0)
                    {
                        DataRow drFlightSchedule = dtSchedule.NewRow();
                        drFlightSchedule["SNo"] = ++SNo;
                        drFlightSchedule["AirlineCode"] = flightArray[0].Substring(0, 2);
                        drFlightSchedule["FlightNo"] = flightArray[0].Substring(0, 2) + "-" + flightArray[0].Substring(2, 3).Trim();
                        drFlightSchedule["ValidFrom"] = Convert.ToDateTime(flightArray[2].Substring(0, 2) + '-' + flightArray[2].Substring(2, 3) + DateTime.Now.Year);
                        drFlightSchedule["ValidTo"] = Convert.ToDateTime(flightArray[2].Substring(5, 2) + '-' + flightArray[2].Substring(7, 3) + DateTime.Now.Year);
                        drFlightSchedule["Days"] = flightArray[3].Substring(0, 7);
                        drFlightSchedule["Origin"] = flightArray[5].Substring(0, 3);
                        drFlightSchedule["ETD"] = flightArray[5].Substring(6, 2) + ":" + flightArray[5].Substring(8, 2);
                        drFlightSchedule["Destination"] = controlCity;
                        drFlightSchedule["OriginAirportCode"] = flightArray[5].Substring(3, 3);
                        drFlightSchedule["DestinationAirportCode"] = controlCity;



                        //drFlightSchedule["ETA"] = SSIMString[i].Substring(57, 2) + ":" + SSIMString[i].Substring(59, 2);


                        //drFlightSchedule["Stops"] = "0";
                        //drFlightSchedule["FlightTypeSNo"] = "1";
                        //drFlightSchedule["DayDifference"] = "0";
                        //drFlightSchedule["Active"] = "Y";
                        //drFlightSchedule["CreatedBy"] = "SSIM";
                        //drFlightSchedule["CreatedOn"] = DateTime.Now;
                        dtSchedule.Rows.Add(drFlightSchedule);
                    }
                    else if (j == 1)
                    {

                        DataRow drFlightSchedule = dtSchedule.NewRow();
                        drFlightSchedule["SNo"] = ++SNo;
                        drFlightSchedule["AirlineCode"] = flightArray[1].Substring(0, 2);
                        drFlightSchedule["FlightNo"] = flightArray[1].Substring(0, 2) + "-" + flightArray[1].Substring(2, 3).Trim();
                        drFlightSchedule["ValidFrom"] = Convert.ToDateTime(flightArray[2].Substring(0, 2) + '-' + flightArray[2].Substring(2, 3) + DateTime.Now.Year);
                        drFlightSchedule["ValidTo"] = Convert.ToDateTime(flightArray[2].Substring(5, 2) + '-' + flightArray[2].Substring(7, 3) + DateTime.Now.Year);
                        drFlightSchedule["Days"] = flightArray[3].Substring(0, 7);
                        drFlightSchedule["Origin"] = controlCity;
                        drFlightSchedule["ETD"] = flightArray[6].Substring(0, 2) + ":" + flightArray[6].Substring(2, 2);
                        drFlightSchedule["Destination"] = flightArray[6].Substring(4, 3);
                        drFlightSchedule["OriginAirportCode"] = controlCity;
                        drFlightSchedule["DestinationAirportCode"] = flightArray[6].Substring(7, 3);

                        //drFlightSchedule["ETA"] = SSIMString[i].Substring(57, 2) + ":" + SSIMString[i].Substring(59, 2);


                        //drFlightSchedule["Stops"] = "0";
                        //drFlightSchedule["FlightTypeSNo"] = "1";
                        //drFlightSchedule["DayDifference"] = "0";
                        //drFlightSchedule["Active"] = "Y";
                        //drFlightSchedule["CreatedBy"] = "SSIM";
                        //drFlightSchedule["CreatedOn"] = DateTime.Now;
                        dtSchedule.Rows.Add(drFlightSchedule);
                    }
                }
            }

            return dtSchedule;
        }
        public static String CheckDuplicationInSchedule(string FlightNo, string vf, string vt, string Days, string Origin, String Destination, string OriginAirportCode, string DestinationAirportCode, string AircraftType)
        {
            SqlParameter[] param = {
                                     new SqlParameter("@FlightNo", FlightNo),
                                     new SqlParameter("@ValidFrom",vf),
                                     new SqlParameter("@ValidTo", vt),
                                     new SqlParameter("@Days", Days),
                                      new SqlParameter("@Origin", Origin),
                                       new SqlParameter("@Destination", Destination),
                                       new SqlParameter("@OriginAirportCode", OriginAirportCode),
                                       new SqlParameter("@DestinationAirportCode", DestinationAirportCode),
                                       new SqlParameter("@AircraftType", AircraftType)
                                   };
            return Convert.ToString(SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckDuplicationInSchedule", param));
        }
        public void SSIMUpload1(HttpContext context)
        {
            string responseData = string.Empty;
            System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
            System.Collections.Generic.List<object> objList = new System.Collections.Generic.List<object>();

            if (context.Request.Files.Count > 0)
            {
                DataTable dtFlightSchedule = GetScheduleTable();
                List<SSIMUpload> listSSIMDocument = new List<SSIMUpload>();

                System.Web.HttpPostedFile uploadedFile = System.Web.HttpContext.Current.Request.Files[0];
                String ext = System.IO.Path.GetExtension(uploadedFile.FileName);

                //if (file.PostedFile.ContentLength > 2000000)
                if (ext.ToLower() == ".txt")
                {
                    byte[] byteArray = new byte[Convert.ToInt32(uploadedFile.InputStream.Length)];
                    uploadedFile.InputStream.Read(byteArray, 0, Convert.ToInt32(uploadedFile.InputStream.Length));
                    string SSIMFullString = (new ASCIIEncoding()).GetString((byte[])byteArray);
                    string[] SSIMString = SSIMFullString.Split(new[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);
                    dtFlightSchedule = SSIMTable(SSIMString, dtFlightSchedule);
                    for (int i = 0; i < dtFlightSchedule.Rows.Count; i++)
                    {

                        Origin = dtFlightSchedule.Rows[i]["Origin"].ToString();
                        Destination = dtFlightSchedule.Rows[i]["Destination"].ToString();
                        OriginAirportCode = dtFlightSchedule.Rows[i]["OriginAirportCode"].ToString();
                        DestinationAirportCode = dtFlightSchedule.Rows[i]["DestinationAirportCode"].ToString();
                        AircraftType = dtFlightSchedule.Rows[i]["AircraftType"].ToString();
                        var checkDuplication = CheckDuplicationInSchedule(dtFlightSchedule.Rows[i]["FlightNo"].ToString(), dtFlightSchedule.Rows[i]["ValidFrom"].ToString(), dtFlightSchedule.Rows[i]["ValidTo"].ToString(), dtFlightSchedule.Rows[i]["Days"].ToString(), Origin, Destination, OriginAirportCode, DestinationAirportCode, AircraftType);
                        dtFlightSchedule.Rows[i]["ValidationMessage"] = "VALID";
                        if (checkDuplication.ToString().ToUpper() != "VALID")
                        {
                            dtFlightSchedule.Rows[i]["ValidationMessage"] = checkDuplication.ToString();
                            dtFlightSchedule.AcceptChanges();
                        }


                    }

                    foreach (DataRow dr in dtFlightSchedule.Rows)
                    {
                        objList.Add(new { SNo = dr["SNo"], AirlineCode = dr["AirlineCode"], FlightNo = dr["FlightNo"], ValidFrom = dr["ValidFrom"], ValidTo = dr["ValidTo"], Days = dr["Days"].ToString().ToUpper(), Origin = dr["Origin"].ToString().ToUpper(), Destination = dr["Destination"].ToString().ToUpper(), ETD = dr["ETD"].ToString().ToUpper(), ETA = dr["ETA"].ToString().ToUpper(), OriginAirportCode = dr["OriginAirportCode"].ToString().ToUpper(), DestinationAirportCode = dr["DestinationAirportCode"].ToString().ToUpper(), ValidationMessage = dr["ValidationMessage"].ToString() });
                    }

                    var items = new { items = objList };
                    string jsonstring = js.Serialize(items);
                    HttpContext.Current.Response.ClearContent();
                    HttpContext.Current.Response.ContentType = "application/json";
                    HttpContext.Current.Response.Write(jsonstring);
                    HttpContext.Current.Response.End();
                }
                else
                {
                    objList.Add(new { Error = "File is not valid, only text file allowed." });
                    var items = new { items = objList };
                    string jsonstring = js.Serialize(items);
                    HttpContext.Current.Response.ClearContent();
                    HttpContext.Current.Response.ContentType = "application/json";
                    HttpContext.Current.Response.Write(jsonstring);
                    HttpContext.Current.Response.End();
                }


            }
        }

        public void SASSSIMUpload(HttpContext context)
        {

            string responseData = string.Empty;
            System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
            System.Collections.Generic.List<object> objList = new System.Collections.Generic.List<object>();


            System.Web.HttpFileCollection uploadedFile = System.Web.HttpContext.Current.Request.Files;
            String[] inputName = uploadedFile.AllKeys;
            string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
            string[] SSIMString = null;
            //string _Extension = string.Empty;
            //foreach (string upload in uploadedFile)
            //{
            //    //if (!Request.Files[upload].HasFile()) continue;
            //    string path = BaseDirectory + "UploadDoc\\SSIM\\";
            //    string filename = Path.GetFileName(uploadedFile[upload].FileName);

            //    _Extension = Path.GetExtension(filename);
            //    //Checking for the extentions, if XLS connect using Jet OleDB                

            //    string UploadedFileName = (System.DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss") + "_" + filename).Replace("\\", "$$").Replace("/", "@@");

            //    uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
            //    File.ReadAllBytes(Path.Combine(path, UploadedFileName));
            //    byte[] SSIMBytes = File.ReadAllBytes(Path.Combine(path, UploadedFileName));
            //    string SSIMFullString = ((new ASCIIEncoding()).GetString(SSIMBytes));
            //    SSIMString = SSIMFullString.Split(new[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);

            //}
            ////if (_Extension == ".txt")
            ////{
            //    DataTable dtFlightSchedule = SASGetScheduleTable();
            //    dtFlightSchedule = SASGenerateSSIMTable(SSIMString, dtFlightSchedule);
            //    var ScheduleTable = dtFlightSchedule;

            string _Extension = string.Empty;
            string path = string.Empty;
            string fullPath = string.Empty;
            string UploadedFileName = string.Empty;
            string SSIMFullString = string.Empty;
            foreach (string upload in uploadedFile)
            {
                //if (!Request.Files[upload].HasFile()) continue;
                path = BaseDirectory + "UploadDoc\\SSIM\\";

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                string filename = Path.GetFileName(uploadedFile[upload].FileName);

                _Extension = Path.GetExtension(filename);
                //Checking for the extentions, if XLS connect using Jet OleDB                

                UploadedFileName = (System.DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss") + "_" + filename).Replace("\\", "$$").Replace("/", "@@");

                if (File.Exists(path))
                    File.Delete(path);
                else
                {
                    uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
                    fullPath = Path.Combine(path, UploadedFileName);
                }

            }
            //if (_Extension == ".txt")
            //{
            DataTable dtFlightSchedule = SASGetScheduleTable();
            switch (_Extension.ToUpper())
            {
                case ".XLS":
                case ".XLSX":
                    dtFlightSchedule = SASGenerateSSIMTableFromExcel(fullPath, dtFlightSchedule);
                    break;
                case ".SSIM":
                    File.ReadAllBytes(Path.Combine(path, UploadedFileName));
                    byte[] SSIMBytes = File.ReadAllBytes(Path.Combine(path, UploadedFileName));
                    SSIMFullString = ((new ASCIIEncoding()).GetString(SSIMBytes));
                    string Environment = (context.Request.QueryString["Environment"]).ToString().ToUpper();
                    SSIMString = SSIMFullString.Split(new[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);
                    dtFlightSchedule = SASGenerateSSIMTable(SSIMString, dtFlightSchedule);
                    if (!(dtFlightSchedule.Rows.Count > 0))
                    {
                        SSIMString = null;
                        SSIMString = SSIMFullString.Split(new[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);
                        dtFlightSchedule = SASGenerateSSIMTable(SSIMString, dtFlightSchedule);
                    }
                    break;
                default :
                    objList.Add(new { ErrorMsg = "File is not valid, only .XLS, .XLSX, .SSIM files are allowed." });
                    string jsonstring = JsonConvert.SerializeObject(objList);
                    HttpContext.Current.Response.ClearContent();
                    HttpContext.Current.Response.ContentType = "application/json";
                    HttpContext.Current.Response.Write(jsonstring);
                    HttpContext.Current.Response.End();
                    break;

                    //default :
                    //    File.ReadAllBytes(Path.Combine(path, UploadedFileName));
                    //    byte[] SSIMBytes1 = File.ReadAllBytes(Path.Combine(path, UploadedFileName));
                    //    SSIMFullString = ((new ASCIIEncoding()).GetString(SSIMBytes1));
                    //    SSIMString = SSIMFullString.Split(new[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);
                    //    dtFlightSchedule = SASGenerateSSIMTable(SSIMString, dtFlightSchedule);
                    //    break;


            }

            DataSet Data = new DataSet();
            if (dtFlightSchedule.Rows.Count > 0)
            {
                SqlParameter[] param = {
                new SqlParameter("@SSIM_Type", SqlDbType.Structured){Value=dtFlightSchedule},
                new SqlParameter("@SSIMStartDate", Convert.ToDateTime(context.Request.QueryString["SSIMDate"]).ToString("yyyy-MM-dd"))
                                       };
                Data = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSSIM_Validate", param);
                //Data = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSSIM_ValidateData", param);
                js.MaxJsonLength = int.MaxValue;
                objList.Add(new
                {
                    ErrorMsg = Data.Tables[0].Rows[0][0],
                    Data = Data.Tables[1],
                    Total = Data.Tables[2].Rows[0][0]
                });
                string jsonstring = JsonConvert.SerializeObject(objList);//js.Serialize(Data);
            HttpContext.Current.Response.ClearContent();
            HttpContext.Current.Response.ContentType = "application/json";
            HttpContext.Current.Response.Write(jsonstring);
            HttpContext.Current.Response.End();
            }
            else
            {
                objList.Add(new { ErrorMsg = "There are no records found in file to process." });
                string jsonstring = JsonConvert.SerializeObject(objList);
                HttpContext.Current.Response.ClearContent();
                HttpContext.Current.Response.ContentType = "application/json";
                HttpContext.Current.Response.Write(jsonstring);
                HttpContext.Current.Response.End();
            }

            //else
            //{
            //    objList.Add(new { Error = "File is not valid, only text file allowed." });
            //    var items = new { items = objList };
            //    string jsonstring = js.Serialize(items);
            //    HttpContext.Current.Response.ClearContent();
            //    HttpContext.Current.Response.ContentType = "application/json";
            //    HttpContext.Current.Response.Write(jsonstring);
            //    HttpContext.Current.Response.End();
            //}

            //string returnval = SASuploadSSIM(ScheduleTable);
            //if (Convert.ToInt16(returnval) > 0)
            //{

            //    //SUCCESS
            //}
            //else
            //{

            //    //FAILURE
            //}
        }
        private DataTable SASGetScheduleTable()
        {
            DataTable dtSchedule = new DataTable();
            dtSchedule.Columns.Add("SNo");
            dtSchedule.Columns.Add("AirlineCode");
            dtSchedule.Columns.Add("FlightNo");
            dtSchedule.Columns.Add("FlightType");
            dtSchedule.Columns.Add("StartDate");
            dtSchedule.Columns.Add("EndDate");
            dtSchedule.Columns.Add("ValidFrom");
            dtSchedule.Columns.Add("ValidTo");
            dtSchedule.Columns.Add("DaysNo");
            dtSchedule.Columns.Add("Days");
            dtSchedule.Columns.Add("Origin");
            dtSchedule.Columns.Add("ETD");
            dtSchedule.Columns.Add("ETD (GMT)");
            dtSchedule.Columns.Add("Destination");
            dtSchedule.Columns.Add("ETA");
            dtSchedule.Columns.Add("ETA (GMT)");
            dtSchedule.Columns.Add("AircraftType");
            dtSchedule.Columns.Add("AircraftSNo");
            dtSchedule.Columns.Add("GrossWeight");
            dtSchedule.Columns.Add("VolumeWeight");
            dtSchedule.Columns.Add("TimeDifference");
            dtSchedule.Columns.Add("ValidationMessage");
            dtSchedule.Columns.Add("BatchNo");
            dtSchedule.Columns.Add("LegID");
            return dtSchedule;
        }
        private DataTable SASGenerateSSIMTable(string[] SSIMString, DataTable dtFlightSchedule)
        {
            string DayNum = "";
            string DayName = "";
            int SNo = 0;
            Dictionary<string, int> DesignatorBatch = new Dictionary<string, int>();
            string carrierCode = "", aircraft = "", oCity = "", dCity = "", startDate = "", endDate = "";
            for (int i = 1; i < SSIMString.Length; i++)
            {
                carrierCode = aircraft = oCity = dCity = startDate = endDate = "";
                if (SSIMString[i].Substring(0, 1) == "3" && SSIMString[i].Length >= 65)
                {
                    DataRow drFlightSchedule = dtFlightSchedule.NewRow();
                    if (SSIMString[i].Substring(0, 1) == "3" && SSIMString[i].Length >= 65)
                    {
                        carrierCode = SSIMString[i].Substring(2, 2).Trim();
                        int value=0;
                        if (DesignatorBatch.TryGetValue(carrierCode + "-" + SSIMString[i].Substring(5, 4).Trim(),out value) && SSIMString[i].Substring(9, 2)=="00")
                        {
                            DesignatorBatch[carrierCode + "-" + SSIMString[i].Substring(5, 4).Trim()] = value+1;
                        }
                        else if(!DesignatorBatch.TryGetValue(carrierCode + "-" + SSIMString[i].Substring(5, 4).Trim(), out value))
                        {
                            DesignatorBatch[carrierCode + "-" + SSIMString[i].Substring(5, 4).Trim()] = value;
                        }
                        
                        drFlightSchedule["SNo"] = ++SNo;
                        drFlightSchedule["AirlineCode"] = carrierCode;
                        drFlightSchedule["FlightNo"] = carrierCode + "-" + SSIMString[i].Substring(5, 4).Trim();

                        drFlightSchedule["BatchNo"] = DesignatorBatch[carrierCode + "-" + SSIMString[i].Substring(5, 4).Trim()].ToString()+SSIMString[i].Substring(9, 2);
                        drFlightSchedule["LegID"] = SSIMString[i].Substring(11, 2);
                        startDate = SSIMString[i].Substring(14, 7);
                        endDate = SSIMString[i].Substring(21, 7);

                        drFlightSchedule["ValidFrom"] = Convert.ToDateTime(startDate).ToString("MM/dd/yyyy");
                        drFlightSchedule["ValidTo"] = (endDate == "00XXX00" ? endDate : Convert.ToDateTime(endDate).ToString("MM/dd/yyyy"));
                        drFlightSchedule["StartDate"] = Convert.ToDateTime(startDate).ToString("yyyy-MM-dd");
                        drFlightSchedule["EndDate"] = (endDate == "00XXX00" ? endDate : Convert.ToDateTime(endDate).ToString("yyyy-MM-dd"));
                        DayNum = SSIMString[i].Substring(28, 7);
                        try
                        {
                            DayName = string.Join(",", Array.ConvertAll(DayNum.Replace(" ", "").ToCharArray(), c => c.ToString()));
                            DayName = DayName.Replace("1", "Mon").Replace("2", "Tue").Replace("3", "Wed").Replace("4", "Thu").Replace("5", "Fri").Replace("6", "Sat").Replace("7", "Sun");
                        }
                        catch
                        {

                        }
                        drFlightSchedule["Days"] = DayName;
                        drFlightSchedule["DaysNo"] = string.Join(",", Array.ConvertAll(DayNum.Replace(" ", "").ToCharArray(), c => c.ToString()));

                        aircraft = SSIMString[i].Substring(72, 3).Trim();
                        drFlightSchedule["AircraftType"] = aircraft;
                        drFlightSchedule["AircraftSNo"] = "0";
                        drFlightSchedule["GrossWeight"] = "0.00";
                        drFlightSchedule["VolumeWeight"] = "0.000";
                        oCity = SSIMString[i].Substring(36, 3).Trim();
                        drFlightSchedule["Origin"] = oCity;

                        drFlightSchedule["ETD"] = SSIMString[i].Substring(39, 2) + ":" + SSIMString[i].Substring(41, 2);
                        drFlightSchedule["ETD (GMT)"] = SSIMString[i].Substring(47, 3) + ":" + SSIMString[i].Substring(50, 2);

                        dCity = SSIMString[i].Substring(54, 3).Trim();
                        drFlightSchedule["Destination"] = dCity;
                        drFlightSchedule["TimeDifference"] = SSIMString[i].Substring(65, 5);

                        drFlightSchedule["ETA"] = SSIMString[i].Substring(57, 2) + ":" + SSIMString[i].Substring(59, 2);
                        drFlightSchedule["ETA (GMT)"] = SSIMString[i].Substring(65, 3) + ":" + SSIMString[i].Substring(68, 2);

                        dtFlightSchedule.Rows.Add(drFlightSchedule);
                    }
                }
            }
            return dtFlightSchedule;
        }
        private DataTable SASGenerateSSIMTableFromExcel(string path, DataTable dtFlightSchedule)
        {
            int SNo = 0;
            string connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + path + ";" + "Extended Properties='Excel 12.0;HDR=Yes'";
            var con = new OleDbConnection(connString);
            var exAdp = new OleDbDataAdapter("select *from [Sheet1$]", con);
            var ds = new DataSet();
            con.Open();
            exAdp.Fill(ds);
            con.Close();

            if (File.Exists(path))
                File.Delete(path);


            //for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            //{
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {


                DataRow drFlightSchedule = dtFlightSchedule.NewRow();
                drFlightSchedule["SNo"] = ++SNo;
                drFlightSchedule["AirlineCode"] = ds.Tables[0].Rows[i]["AirlineCode"].ToString().ToUpper();
                drFlightSchedule["FlightNo"] = ds.Tables[0].Rows[i]["FlightNo"].ToString().ToUpper();
                drFlightSchedule["ValidFrom"] = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDate"].ToString()).ToString("MM/dd/yyyy");
                drFlightSchedule["ValidTo"] = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDate"].ToString()).ToString("MM/dd/yyyy");
                drFlightSchedule["StartDate"] = Convert.ToDateTime(ds.Tables[0].Rows[i]["StartDate"].ToString()).ToString("MM/dd/yyyy"); ;
                drFlightSchedule["EndDate"] = Convert.ToDateTime(ds.Tables[0].Rows[i]["EndDate"].ToString()).ToString("MM/dd/yyyy");

                //  drFlightSchedule["Days"] = ds.Tables[0].Rows[i]["Days"].ToString();
                drFlightSchedule["DaysNo"] = ds.Tables[0].Rows[i]["DaysNo"].ToString();
                drFlightSchedule["Origin"] = ds.Tables[0].Rows[i]["Origin"].ToString().ToUpper();
                drFlightSchedule["ETD"] = ds.Tables[0].Rows[i]["ETD"].ToString().ToUpper();
                drFlightSchedule["Destination"] = ds.Tables[0].Rows[i]["Destination"].ToString().ToUpper();
                drFlightSchedule["ETA"] = ds.Tables[0].Rows[i]["ETA"].ToString().ToUpper();
                drFlightSchedule["AircraftType"] = ds.Tables[0].Rows[i]["AircraftType"].ToString();
                drFlightSchedule["AircraftSNo"] = "0";
                drFlightSchedule["GrossWeight"] = "35000.00";
                drFlightSchedule["VolumeWeight"] = "35000.00";
                drFlightSchedule["TimeDifference"] = ds.Tables[0].Rows[i]["TimeDifference"].ToString().ToUpper();
                dtFlightSchedule.Rows.Add(drFlightSchedule);
            }
            return dtFlightSchedule;
        }
        public static String SASCheckDuplicationInSchedule(string FlightNo, string vf, string vt, string Days, string Origin, String Destination, string OriginAirportCode, string DestinationAirportCode, string AircraftType)
        {
            SqlParameter[] param = {
                                     new SqlParameter("@FlightNo", FlightNo),
                                     new SqlParameter("@ValidFrom",vf),
                                     new SqlParameter("@ValidTo", vt),
                                     new SqlParameter("@Days", Days),
                                      new SqlParameter("@Origin", Origin),
                                       new SqlParameter("@Destination", Destination),
                                       new SqlParameter("@AircraftType", AircraftType)
                                   };
            return Convert.ToString(SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SASCheckDuplicationInSchedule", param));
        }
        public string SASuploadSSIM(DataTable dtSchedule)
        {

            string returnVal = string.Empty;
            try
            {
                string connectionstring = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["ConnectionString"].ToString();


                SqlParameter paramScheduleTable = new SqlParameter();
                paramScheduleTable.ParameterName = "@SSIMScheduleTable";
                paramScheduleTable.SqlDbType = System.Data.SqlDbType.Structured;
                paramScheduleTable.Value = dtSchedule;

                SqlParameter paramLoginSNo = new SqlParameter();
                paramLoginSNo.ParameterName = "@LoginSNo";
                paramLoginSNo.SqlDbType = System.Data.SqlDbType.Structured;
                paramLoginSNo.Value = 1;

                SqlParameter[] Parameters = { paramScheduleTable, paramLoginSNo };

                returnVal = SqlHelper.ExecuteScalar(connectionstring, "UploadSSIM", Parameters).ToString();
                return returnVal;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public bool IsReusable
        {
            get { throw new NotImplementedException(); }
        }



        public void ULDStock(HttpContext context)
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
            string SSIMFullString = string.Empty;
            foreach (string upload in uploadedFile)
            {
                path = BaseDirectory + "UploadDoc\\ULDStock\\";

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                string filename = Path.GetFileName(uploadedFile[upload].FileName);

                _Extension = Path.GetExtension(filename);
                //Checking for the extentions, if XLS connect using Jet OleDB                

                UploadedFileName = (System.DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss") + "_" + filename).Replace("\\", "$$").Replace("/", "@@");

                if (File.Exists(path))
                    File.Delete(path);
                else
                {
                    uploadedFile[upload].SaveAs(Path.Combine(path, UploadedFileName));
                    fullPath = Path.Combine(path, UploadedFileName);
                }

            }

            DataTable dtULDStock = GetULDStockTable();
            dtULDStock = ULDStockTableFromExcel(fullPath, dtULDStock);

            if (dtULDStock.Columns.Count > 1)
            {
                if (dtULDStock.Rows.Count < 10001)
                {
                    DataTable dtULDStocks = ErrorCheck(dtULDStock);
                    DataSet nds = UploadULDStock(dtULDStocks);
                    if (nds.Tables.Count > 1)
                    {
                        if (nds.Tables[0].Rows.Count > 0 && nds.Tables[1].Rows[0][0].ToString() == "")
                        {
                            foreach (DataRow dr in nds.Tables[0].Rows)
                            {
                                Listobj.Add(new
                                {
                                    SNo = dr["SNo"],
                                    AirlineCode = dr["AirlineCode"],
                                    CityCode = dr["CityCode"],
                                    AirportCode = dr["AirportCode"],
                                    //TotalNoOfULD=dr["TotalNoOfULD"],
                                    ULDCode = dr["ULDCode"],
                                    ULDType = dr["ULDType"],
                                    ULDSerialNo = dr["ULDSerialNo"],
                                    Ownership = dr["Ownership"],
                                    OwnerCode = dr["OwnerCode"],
                                    PurchaseDate = dr["PurchaseDate"],
                                    PurchaseFrom = dr["PurchaseFrom"],
                                    PurchaseAt = dr["PurchaseAt"],
                                    TareWeight = dr["TareWeight"],
                                    Available = dr["Available"],
                                    SHC = dr["SHC"],
                                    SHCGroup = dr["SHCGroup"],
                                    PurchasedPrice = dr["PurchasedPrice"],
                                    ContentType = dr["ContentType"],
                                    ContentCategory = dr["ContentCategory"],
                                    Serviceable = dr["Serviceable"],
                                    Damaged = dr["Damaged"],
                                    Active = dr["Active"],
                                    ValidationMessage = dr["ValidationMessage"].ToString()
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
                    Error = dtULDStock.Rows[0][0].ToString()
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

        private DataTable GetULDStockTable()
        {
            DataTable dtUld = new DataTable();
            dtUld.Columns.Add("SNo");
            dtUld.Columns.Add("AirlineCode");
            dtUld.Columns.Add("CityCode");
            dtUld.Columns.Add("AirportCode");
            //dtUld.Columns.Add("TotalNoOfULD");
            dtUld.Columns.Add("ULDCode");
            dtUld.Columns.Add("ULDType");
            dtUld.Columns.Add("ULDSerialNo");
            dtUld.Columns.Add("Ownership");
            dtUld.Columns.Add("OwnerCode");
            dtUld.Columns.Add("PurchaseDate");
            dtUld.Columns.Add("PurchaseFrom");
            dtUld.Columns.Add("PurchaseAt");
            dtUld.Columns.Add("TareWeight");
            dtUld.Columns.Add("SHC");
            dtUld.Columns.Add("SHCGroup");
            dtUld.Columns.Add("PurchasedPrice");
            dtUld.Columns.Add("ContentType");
            dtUld.Columns.Add("ContentCategory");
            dtUld.Columns.Add("Available");
            dtUld.Columns.Add("Serviceable");
            dtUld.Columns.Add("Damaged");
            dtUld.Columns.Add("Active");
            dtUld.Columns.Add("ValidationMessage");
            return dtUld;
        }

        private DataTable ULDStockTableFromExcel(string path, DataTable dtFlightSchedule)
        {
            try
            {
                int SNo = 1;
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
                    if (ds.Tables[0].Rows[i][0].ToString() != "" || ds.Tables[0].Rows[i][1].ToString() != "" || ds.Tables[0].Rows[i][2].ToString() != "" || ds.Tables[0].Rows[i][3].ToString() != "" || ds.Tables[0].Rows[i][4].ToString() != "" || ds.Tables[0].Rows[i][5].ToString() != "" || ds.Tables[0].Rows[i][6].ToString() != "" || ds.Tables[0].Rows[i][7].ToString() != "" || ds.Tables[0].Rows[i][8].ToString() != "" || ds.Tables[0].Rows[i][9].ToString() != "" || ds.Tables[0].Rows[i][10].ToString() != "")
                    {
                        DataRow drFlightSchedule = dtFlightSchedule.NewRow();
                        drFlightSchedule["SNo"] = ++SNo;
                        drFlightSchedule["AirlineCode"] = ds.Tables[0].Rows[i][0].ToString().ToUpper();//"AirlineCode"
                        drFlightSchedule["CityCode"] = ds.Tables[0].Rows[i][1].ToString().ToUpper();//"CityCode"
                        drFlightSchedule["AirportCode"] = ds.Tables[0].Rows[i][2].ToString();//"AirportCode"
                        //drFlightSchedule["TotalNoOfULD"] = "";
                        drFlightSchedule["ULDCode"] = ds.Tables[0].Rows[i][3].ToString();//"ULDCode"
                        //drFlightSchedule["ULDType"] = ds.Tables[0].Rows[i][4].ToString();      //"ULDType"  
                        drFlightSchedule["ULDType"] = "";
                        drFlightSchedule["ULDSerialNo"] = ds.Tables[0].Rows[i][4].ToString();//"ULDSerialNo"
                        drFlightSchedule["Ownership"] = ds.Tables[0].Rows[i][5].ToString().ToUpper();//"Ownership"
                        drFlightSchedule["OwnerCode"] = ds.Tables[0].Rows[i][6].ToString().ToUpper();//"OwnerCode"
                        drFlightSchedule["PurchaseDate"] = ds.Tables[0].Rows[i][7].ToString();                       //"PurchaseDate"
                        //Convert.ToDateTime(ds.Tables[0].Rows[i]["PurchaseDate"].ToString()).ToString("MM/dd/yyyy");
                        drFlightSchedule["PurchaseFrom"] = ds.Tables[0].Rows[i][8].ToString();//"PurchaseFrom"
                        drFlightSchedule["PurchaseAt"] = ds.Tables[0].Rows[i][9].ToString().ToUpper();//"PurchaseAt"
                        drFlightSchedule["TareWeight"] = ds.Tables[0].Rows[i][10] == DBNull.Value ? DBNull.Value : ds.Tables[0].Rows[i]["TareWeight"];//"TareWeight"
                        drFlightSchedule["SHC"] = ds.Tables[0].Rows[i][11].ToString().ToUpper();//"SHC"
                        drFlightSchedule["SHCGroup"] = ds.Tables[0].Rows[i][12].ToString().ToUpper();//"TareWeight"
                        drFlightSchedule["ContentType"] = ds.Tables[0].Rows[i][13].ToString().ToUpper();//"SHC"
                        drFlightSchedule["ContentCategory"] = ds.Tables[0].Rows[i][14].ToString().ToUpper();//"TareWeight"
                        drFlightSchedule["PurchasedPrice"] = ds.Tables[0].Rows[i][15].ToString().ToUpper();//"PurchasePrice"
                        drFlightSchedule["Available"] = "YES";
                        drFlightSchedule["Serviceable"] = "YES";
                        drFlightSchedule["Damaged"] = "NO";
                        drFlightSchedule["Active"] = "YES";
                        //drFlightSchedule["Available"] = ds.Tables[0].Rows[i][12].ToString().ToUpper();//"Available"
                        //drFlightSchedule["Serviceable"] = ds.Tables[0].Rows[i][13].ToString().ToUpper();//"Serviceable"
                        //drFlightSchedule["Damaged"] = ds.Tables[0].Rows[i][14].ToString().ToUpper();//"Damaged"
                        //drFlightSchedule["Active"] = ds.Tables[0].Rows[i][15].ToString().ToUpper();  //"Active"                  
                        dtFlightSchedule.Rows.Add(drFlightSchedule);
                    }
                }
                return dtFlightSchedule;
            }
            catch (FormatException ex)
            {
                if (File.Exists(path))
                    File.Delete(path);
                DataTable ulderror = new DataTable();
                ulderror.Columns.Add("Error");
                DataRow ulderrorR = ulderror.NewRow();
                //ulderrorR["Error"] = ex.Message.ToString();
                ulderrorR["Error"] = "Uploaded File not in Valid Format,  ";
                ulderror.Rows.Add(ulderrorR);
                //throw ex;
                return ulderror;
            }
            catch (Exception ex)
            {
                if (File.Exists(path))
                    File.Delete(path);
                DataTable ulderror = new DataTable();
                ulderror.Columns.Add("Error");
                DataRow ulderrorR = ulderror.NewRow();
                //ulderrorR["Error"] = ex.Message.ToString();
                ulderrorR["Error"] = "Uploaded File not in Valid Format,  ";
                ulderror.Rows.Add(ulderrorR);
                //throw ex;
                return ulderror;
            }
        }

        private DataTable ErrorCheck(DataTable dtULDStock)
        {
            for (int i = 0; i < dtULDStock.Rows.Count; i++)
            {
                DateTime dt;
                float f;
                string message = "";
                if (dtULDStock.Rows[i][1].ToString() == "" || dtULDStock.Rows[i][2].ToString() == "" || dtULDStock.Rows[i][3].ToString() == "" || dtULDStock.Rows[i][4].ToString() == "" || dtULDStock.Rows[i][6].ToString() == "" || dtULDStock.Rows[i][8].ToString() == "" || dtULDStock.Rows[i][7].ToString() == "")
                {
                    message = message + "All Fields Are Mandatory, ";
                }
                if (dtULDStock.Rows[i][1].ToString().Length > 3 || dtULDStock.Rows[i][1].ToString().Length < 2)
                {
                    message = message + "Airline Code field must have minimum 2 & maximum 3 characters, ";
                }
                if (dtULDStock.Rows[i][2].ToString().Length > 3 || dtULDStock.Rows[i][2].ToString().Length < 3)
                {
                    message = message + "City Code must have minimum & maximum 3 characters, ";
                }
                if (dtULDStock.Rows[i][3].ToString().Length > 3 || dtULDStock.Rows[i][3].ToString().Length < 3)
                {
                    message = message + "Airport Code must have  minimum & maximum 3 characters, ";
                }
                if (dtULDStock.Rows[i][7].ToString().Length > 10)
                {
                    message = message + "Ownership field must Have Maximum 10 Characters, ";
                }
                if (dtULDStock.Rows[i][7].ToString().ToUpper() != "AIRLINE" && dtULDStock.Rows[i][7].ToString().ToUpper() != "HIRED")
                {
                    message = message + "Ownership field value can be AIRLINE or HIRED only, ";
                }
                if (dtULDStock.Rows[i][7].ToString().ToUpper() == "HIRED" && (dtULDStock.Rows[i][9].ToString() == "" || dtULDStock.Rows[i][10].ToString() == ""))
                {
                    message = message + "Purchase Date and Purchased From Are Mandatory for Ownership Type-Hired, ";
                }

                if (!dtULDStock.Rows[i][8].ToString().All(char.IsLetterOrDigit))
                {
                    message = message + "Owner Code can be in Alphabets or Numbers only, ";
                }
                if (dtULDStock.Rows[i][8].ToString().Length > 3 || dtULDStock.Rows[i][8].ToString().Length < 2)
                {
                    message = message + "Owner Code must have minimum 2 & maximum 3 characters, ";
                }
                //if (dtULDStock.Rows[i][8].ToString().Length < 2)
                //{
                //    message = message + "Owner Code Must Have Minimum 2 Characters, ";
                //}
                //if ((dtULDStock.Rows[i][5].ToString().Length < 2 && dtULDStock.Rows[i][5].ToString() != "") || (dtULDStock.Rows[i][5].ToString().Length > 50 && dtULDStock.Rows[i][5].ToString() != ""))
                //{
                //    message = message + "ULD Type value can be minimum 2 & maximum 50 characters, ";
                //}
                //if (dtULDStock.Rows[i][5].ToString().Length > 50 && dtULDStock.Rows[i][5].ToString() != "")
                //{
                //    message = message + "ULD Type Must Have Maximum 50 Characters, ";
                //}

                if (dtULDStock.Rows[i][6].ToString().All(char.IsDigit) != true)
                {
                    message = message + "ULD Serial No. Not Valid!, ";
                }
                if (dtULDStock.Rows[i][6].ToString().Length < 4)
                {
                    message = message + "ULD Serial No. Must Have Minimum 4 digit, ";
                }
                if (dtULDStock.Rows[i][6].ToString().Length > 5)
                {
                    message = message + "ULD Serial No. Have Maximum 5 digit, ";
                }
                if ((!float.TryParse(dtULDStock.Rows[i][12].ToString(), out f)) && dtULDStock.Rows[i][12].ToString() != "")
                {
                    message = message + "Invalid Tare Weight, ";
                }
                if (((!DateTime.TryParse(dtULDStock.Rows[i][9].ToString(), out dt)) && dtULDStock.Rows[i][9].ToString() != "") || dtULDStock.Rows[i][9].ToString().Length > 20)
                {
                    message = message + "Purchase Date not in Valid Format, ";
                }
                if (dtULDStock.Rows[i][10].ToString().Length > 100)
                {
                    message = message + "Purchased From can have Maximum 100 characters, ";
                }
                if (dtULDStock.Rows[i][11].ToString().Length > 3)
                {
                    message = message + "Purchased At field can only be a 3 letter City Code, ";
                }

                //if (dtULDStock.Rows[i][13].ToString().ToUpper() != "YES" && dtULDStock.Rows[i][13].ToString().ToUpper() != "NO")
                //{
                //    message = message + "Available Should be 'Yes/No'!, ";
                //}
                //if (dtULDStock.Rows[i][14].ToString().ToUpper() != "YES" && dtULDStock.Rows[i][14].ToString().ToUpper() != "NO")
                //{
                //    message = message + "Serviceable Should be 'Yes/No'!, ";
                //}
                //if (dtULDStock.Rows[i][15].ToString().ToUpper() != "YES" && dtULDStock.Rows[i][15].ToString().ToUpper() != "NO")
                //{
                //    message = message + "Damaged Should be 'Yes/No'!, ";
                //}
                //if (dtULDStock.Rows[i][15].ToString().ToUpper() != "YES" && dtULDStock.Rows[i][15].ToString().ToUpper() != "NO")
                //{
                //    message = message + "Active Should be 'Yes/No'!, ";
                //}

                if (message == "")
                {
                    dtULDStock.Rows[i]["ValidationMessage"] = "VALID";
                }
                else
                {
                    dtULDStock.Rows[i]["ValidationMessage"] = message.ToUpper();
                }

                dtULDStock.AcceptChanges();
            }
            return dtULDStock;
        }

        public DataSet UploadULDStock(DataTable dtULDStockUpload)
        {
            try
            {
                int UserSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["UserSNo"]);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EXCEL";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtULDStockUpload;
                SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", Convert.ToInt32(UserSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ULDStockUploadExcel", Parameters);
               
                return ds;

            }
            catch (Exception ex)
            {
                DataSet ulderror = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("Error", typeof(string));
                //ulderrorR["Error"] = ex.Message.ToString();
                dt.Rows.Add("Uploaded File not in Valid Format,  ");
                ulderror.Tables.Add(dt);
                return ulderror;
            }
        }

        public void InsertInToDB()
        {
            SqlParameter[] param = { new SqlParameter("@SSIMCDocumentTable", (DataTable)HttpContext.Current.Session["FlightSchedule"]) };

            string result = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SASCreateSSIMDocument", param).Tables[0].Rows[0][0].ToString();
        }

        //public static bool DownloadULDExcel(string FileLocation, string FileName)
        //{
        //    WebClient request = new WebClient();
        //    try
        //    {
        //        string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
        //        string path = BaseDirectory + FileLocation + "\\" + "UploadDoc\\ULDStock"+"\\";
        //        byte[] newFileData = request.DownloadData(path + FileName);
        //        string fileString = System.Text.Encoding.UTF8.GetString(newFileData);
        //        HttpResponse response = HttpContext.Current.Response;
        //        response.Clear();
        //        response.ClearContent();
        //        response.ContentType = "image/jpeg";
        //        response.ClearHeaders();
        //        response.Buffer = true;
        //        response.AddHeader("Content-Disposition", "attachment;filename=\"" + FileName + "\"");
        //        response.BinaryWrite(newFileData);
        //        response.End();
        //    }
        //    catch (WebException e)
        //    {
        //        //Console.WriteLine(e.ToString());
        //    }
        //    return true;
        //}
    }
}