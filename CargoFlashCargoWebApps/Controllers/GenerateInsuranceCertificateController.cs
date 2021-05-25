using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CargoFlashCargoWebApps.Controllers
{
    public class GenerateInsuranceCertificateController : Controller
    {
        // GET: GenerateInsuranceCertificate
        public ActionResult Index()
        {
            return View();
        }

        string _AWBSNo = string.Empty;

        public ActionResult GetInsuranceCertificateDetail(string AWBSNo)//,string AWBNo)
        {
            _AWBSNo = AWBSNo;
            DataSet ds = new DataSet();
            IEnumerable<GetInsuranceCertificate> ResponseList = null;
            InsuranceCertificate Response = new InsuranceCertificate();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AWBSNo",AWBSNo)//,
                                                                    //new System.Data.SqlClient.SqlParameter("@AWBNo",AWBNo)
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spGetInsuranceCertificate", Parameters);

                System.Data.DataColumn Status = new System.Data.DataColumn("Status", typeof(System.String));
                System.Data.DataColumn Message = new System.Data.DataColumn("Message", typeof(System.String));
                System.Data.DataColumn Certificate = new System.Data.DataColumn("Certificate", typeof(System.String));
                ds.Tables[0].Columns.Add(Status);
                ds.Tables[0].Columns.Add(Message);
                ds.Tables[0].Columns.Add(Certificate);
                if (ds.Tables != null && ds.Tables.Count > 1)
                {
                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        Response = GenerateInsuranceCertificate(ds.Tables[0].Rows[i]["cargo_owner"].ToString(), ds.Tables[0].Rows[i]["consignee"].ToString(), ds.Tables[0].Rows[i]["comodity"].ToString(), ds.Tables[0].Rows[i]["number_of_pieces"].ToString(), ds.Tables[0].Rows[i]["weight"].ToString(), ds.Tables[0].Rows[i]["currency"].ToString(), ds.Tables[0].Rows[i]["interest_insured_value"].ToString(), ds.Tables[0].Rows[i]["awb"].ToString(), ds.Tables[0].Rows[i]["origin_country"].ToString(), ds.Tables[0].Rows[i]["origin_city"].ToString(), ds.Tables[0].Rows[i]["destination_country"].ToString(), ds.Tables[0].Rows[i]["destination_city"].ToString(), ds.Tables[0].Rows[i]["flight_number"].ToString(), ds.Tables[0].Rows[i]["flight_date"].ToString(), ds.Tables[0].Rows[i]["issue_date"].ToString(), ds.Tables[1].Rows[0]["Serviceurl"].ToString(), ds.Tables[1].Rows[0]["UserName"].ToString(), ds.Tables[1].Rows[0]["Password"].ToString(), ds.Tables[0].Rows[0]["AWBStatus"].ToString());
                        
                        ds.Tables[0].Rows[i]["Status"] = Response.status.ToString();
                        ds.Tables[0].Rows[i]["Message"] = Response.msg.ToString();
                        ds.Tables[0].Rows[i]["Certificate"] = Response.certificate.ToString();
                    }                   
                }

                ResponseList = ds.Tables[0].AsEnumerable().Select(e => new GetInsuranceCertificate
                {
                    NoofCertificate = e["NoofCertificate"].ToString().ToUpper(),
                    cargo_owner = e["cargo_owner"].ToString().ToUpper(),
                    consignee = e["consignee"].ToString().ToUpper(),
                    comodity = e["comodity"].ToString().ToUpper(),
                    number_of_pieces = e["number_of_pieces"].ToString().ToUpper(),
                    weight = e["weight"].ToString().ToUpper(),
                    currency = e["currency"].ToString().ToUpper(),
                    interest_insured_value = e["interest_insured_value"].ToString().ToUpper(),
                    awb = e["awb"].ToString().ToUpper(),
                    origin_country = e["origin_country"].ToString().ToUpper(),
                    origin_city = e["origin_city"].ToString().ToUpper(),
                    destination_country = e["destination_country"].ToString().ToUpper(),
                    destination_city = e["destination_city"].ToString().ToUpper(),
                    flight_number = e["flight_number"].ToString().ToUpper(),
                    flight_date = e["flight_date"].ToString().ToUpper(),
                    issue_date = e["issue_date"].ToString().ToUpper(),
                    Status = e["Status"].ToString().ToUpper(),
                    Message = e["Message"].ToString().ToUpper(),
                    Certificate = e["Certificate"].ToString()

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

        public InsuranceCertificate GenerateInsuranceCertificate(string cargo_owner, string consignee, string comodity, string number_of_pieces, string weight, string currency, string interest_insured_value, string awb, string origin_country, string origin_city, string destination_country, string destination_city, string flight_number, string flight_date, string issue_date, string Serviceurl, string UserName, string Password,string AWBStatus)
        {
            string postData = "{\"cargo_owner\":\"" + cargo_owner + "\",\"consignee\":\"" + consignee + "\",\"comodity\":\"" + comodity + "\",\"number_of_pieces\":\"" + number_of_pieces + "\",\"weight\":\"" + weight + "\",\"currency\":\"" + currency + "\",\"interest_insured_value\":\"" + interest_insured_value + "\",\"awb\":\"" + awb + "\",\"origin_country\":\"" + origin_country + "\",\"origin_city\":\"" + origin_city + "\",\"destination_country\":\"" + destination_country + "\",\"destination_city\":\"" + destination_city + "\",\"flight_number\":\"" + flight_number + "\",\"flight_date\":\"" + flight_date + "\",\"issue_date\":\"" + issue_date + "\",\"awbstatus\":\"" + AWBStatus + "\"}";
            string user = UserName;
            string pass = Password;
            InsuranceCertificate GetResponsedata = new InsuranceCertificate();
            try
            {
                string sWebServiceUrl = Serviceurl;
                // Create a Web service Request for the URL.           
                // WebRequest objWebRequest = WebRequest.Create(sWebServiceUrl);
                HttpWebRequest objWebRequest = (HttpWebRequest)WebRequest.Create(sWebServiceUrl);
                Encoding encoding = new UTF8Encoding();
                byte[] data = encoding.GetBytes(postData);
                objWebRequest.ProtocolVersion = HttpVersion.Version11;
                //Create a proxy for the service request  
                objWebRequest.Proxy = new WebProxy();
                objWebRequest.Method = "POST";
                objWebRequest.ContentType = "application/json"; //charset=UTF-8"; 
                string _auth = string.Format("{0}:{1}", user, pass);
                string _enc = Convert.ToBase64String(Encoding.ASCII.GetBytes(_auth));
                string _cred = string.Format("{0} {1}", "Basic", _enc);
                objWebRequest.Headers[HttpRequestHeader.Authorization] = _cred;
                objWebRequest.ContentLength = data.Length;
                Stream stream = objWebRequest.GetRequestStream();
                stream.Write(data, 0, data.Length);
                stream.Close();
                HttpWebResponse response = (HttpWebResponse)objWebRequest.GetResponse();
                string s = response.ToString();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                String jsonresponse = "";
                String temp = null;
                while ((temp = reader.ReadLine()) != null)
                {
                    jsonresponse += temp;
                    //GetResponse
                    using (var ms = new MemoryStream(Encoding.Unicode.GetBytes(jsonresponse)))
                    {
                        // Deserialization from JSON  
                        DataContractJsonSerializer deserializer = new DataContractJsonSerializer(typeof(InsuranceCertificate));
                        GetResponsedata = (InsuranceCertificate)deserializer.ReadObject(ms);

                        // Insert Get Response of Insurance Certificate Detail
                        InsertInsuranceCertificateDetail(cargo_owner, consignee, comodity, number_of_pieces, weight, currency, interest_insured_value, awb, origin_country, origin_city, destination_country, destination_city, flight_number, flight_date, issue_date, GetResponsedata.status, GetResponsedata.msg, GetResponsedata.certificate);
                    }
                }
                return GetResponsedata;
            }
            catch (WebException e)
            {
                using (WebResponse response = e.Response)
                {
                    HttpWebResponse httpResponse = (HttpWebResponse)response;
                    Console.WriteLine("Error code: {0}", httpResponse.StatusCode);
                    using (Stream data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        string text = reader.ReadToEnd();
                        Console.WriteLine(text);
                    }
                }
                return GetResponsedata;
            }
        }

        public void InsertInsuranceCertificateDetail(string cargo_owner, string consignee, string comodity, string number_of_pieces, string weight, string currency, string interest_insured_value, string awb, string origin_country, string origin_city, string destination_country, string destination_city, string flight_number, string flight_date, string issue_date, string Status, string Message, string Certificate)
        {
            // Insert into Insurance Table
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AWBSNo",_AWBSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@cargo_owner",cargo_owner),
                                                                    new System.Data.SqlClient.SqlParameter("@consignee",consignee),
                                                                    new System.Data.SqlClient.SqlParameter("@comodity",comodity),
                                                                    new System.Data.SqlClient.SqlParameter("@number_of_pieces",number_of_pieces),
                                                                    new System.Data.SqlClient.SqlParameter("@weight",weight),
                                                                    new System.Data.SqlClient.SqlParameter("@currency",currency),
                                                                    new System.Data.SqlClient.SqlParameter("@interest_insured_value",interest_insured_value),
                                                                    new System.Data.SqlClient.SqlParameter("@awb",awb),
                                                                    new System.Data.SqlClient.SqlParameter("@origin_country",origin_country),
                                                                    new System.Data.SqlClient.SqlParameter("@origin_city",origin_city),
                                                                    new System.Data.SqlClient.SqlParameter("@destination_country",destination_country),
                                                                    new System.Data.SqlClient.SqlParameter("@destination_city",destination_city),
                                                                    new System.Data.SqlClient.SqlParameter("@flight_number",flight_number),
                                                                    new System.Data.SqlClient.SqlParameter("@flight_date",flight_date),
                                                                    new System.Data.SqlClient.SqlParameter("@issue_date",issue_date),
                                                                    new System.Data.SqlClient.SqlParameter("@Status",Status),
                                                                    new System.Data.SqlClient.SqlParameter("@Message",Message),
                                                                    new System.Data.SqlClient.SqlParameter("@Certificate",Certificate),
                                                                    new System.Data.SqlClient.SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };

            CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "InsertInsuranceCertificateDetail", Parameters);
        }
    }

    public class InsuranceCertificate
    {
        public string status { get; set; }
        public string msg { get; set; }
        public string certificate { get; set; }
    }

    public class GetInsuranceCertificate
    {
        public string NoofCertificate { get; set; }
        public string cargo_owner { get; set; }
        public string consignee { get; set; }
        public string comodity { get; set; }
        public string number_of_pieces { get; set; }
        public string weight { get; set; }
        public string currency { get; set; }
        public string interest_insured_value { get; set; }
        public string awb { get; set; }
        public string origin_country { get; set; }
        public string origin_city { get; set; }
        public string destination_country { get; set; }
        public string destination_city { get; set; }
        public string flight_number { get; set; }
        public string flight_date { get; set; }
        public string issue_date { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public string Certificate { get; set; }
    }
}