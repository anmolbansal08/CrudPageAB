using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using System.Net;
using CargoFlash.Cargo.Model.Shipment;
namespace CargoFlash.Cargo.DataService.Schedule
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UpdateSchedule : IUpdateSchedule
    {
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="flightSchedule"></param>
        /// <returns></returns>
        public KeyValuePair<string, ServiceResponse> updateFlightSchedule(FlightSchedule flightSchedule)
        {
            ServiceResponse serviceResponse = new ServiceResponse();
            List<FlightResponse> successResponse = new List<FlightResponse>();

            /*Added By Brajendra On 26 Jul, 2016*/
            //successResponse.Add(new FlightResponse() { Flightno = "", FlightDate = DateTime.Parse("01-01-1900"), Origin = "", Destination = "" });
            //serviceResponse.flightResponse = successResponse.ToList<FlightResponse>();
            //var IPAddress = GetIpAddress();
            //  if (IPAddress != "86.96.201.132")
            //      return new KeyValuePair<string, ServiceResponse>("FAILED", serviceResponse);
            /*Ended By Brajendra*/

            string errMsg = string.Empty, ret = string.Empty;
            var dsReturn = new DataSet();
            var dtData = new DataTable();
            //GeneralFunction gf = new GeneralFunction();
            SqlTransaction tr = null;
            //List<FlightRespone> serviceResponse = new List<FlightRespone>();
            var con = new SqlConnection(DMLConnectionString.WebConfigConnectionString);
            try
            {
                dtData.Columns.Add("RowNo", typeof(int));
                dtData.Columns.Add("flightNo", typeof(string));
                dtData.Columns.Add("flightDate", typeof(DateTime));
                dtData.Columns.Add("origin", typeof(string));
                dtData.Columns.Add("destination", typeof(string));
                dtData.Columns.Add("ETA", typeof(DateTime));
                dtData.Columns.Add("ETD", typeof(DateTime));
                dtData.Columns.Add("flightStatus", typeof(string));
                //BFlightSchedule BFS = new BFlightSchedule();
                DataRow drData;
                int rowNo = 0;

                foreach (var fd in flightSchedule.flightDetail)
                {
                    rowNo += 1;
                    drData = dtData.NewRow();
                    drData["RowNo"] = rowNo;
                    drData["flightNo"] = fd.flightNo;
                    drData["flightDate"] = fd.flightDate;
                    drData["origin"] = fd.origin;
                    drData["destination"] = fd.destination;
                    drData["ETA"] = fd.ETA;
                    drData["ETD"] = fd.ETD;
                    drData["flightStatus"] = fd.flightStatus == true ? "Y" : "N";
                    dtData.Rows.Add(drData);
                }

                con.Open();
                if (dtData.Rows.Count > 0)
                {

                    //if (dtData.Rows.Count > 200)
                    //{
                    //    int loopCount = int.Parse((dtData.Rows.Count / 200).ToString().Split('.')[0]) + 1;
                    //    for (int a = 0; a < loopCount; a++)
                    //    {
                    //        //tr = con.BeginTransaction();
                    //        DataView dvData = new DataView(dtData, "RowNo>=" + ((a * 200) + 1) + " and RowNo<=" + ((a * 200) + 200) + "", "RowNo", DataViewRowState.CurrentRows);
                    //        DataTable dtDataCopy = dvData.ToTable().Copy();
                    //        dtDataCopy.Columns.RemoveAt(0);
                    //        dtDataCopy.AcceptChanges();
                    //        dsReturn = UpdateFlightScheduleData(con,dtDataCopy);//(tr, dtDataCopy);
                    //        errMsg = dsReturn.Tables[0].Rows[0][0].ToString();

                    //        var ErrorMessage = dsReturn.Tables[1].Rows[0]["ErrorMessage"].ToString();
                    //        var ErrorNumber = Convert.ToInt16(dsReturn.Tables[1].Rows[0]["ErrorNumber"]);
                    //        if (errMsg.ToUpper().Contains("SUCCESS"))
                    //        { }// tr.Commit();
                    //        else
                    //        {
                    //            //tr.Rollback();
                    //            InsertErrorInDataBase(ErrorMessage, ErrorNumber);
                    //           // break;
                    //        }
                    //    }
                    //}
                   // else
                  //  {
                       // tr = con.BeginTransaction();
                        dtData.Columns.RemoveAt(0);
                        dtData.AcceptChanges();
                        dsReturn = UpdateFlightScheduleData(con, dtData);//(tr, dtData);
                        errMsg = dsReturn.Tables[0].Rows[0][0].ToString();

                        var ErrorMessage = dsReturn.Tables[1].Rows[0]["ErrorMessage"].ToString();
                        var ErrorNumber = Convert.ToInt16(dsReturn.Tables[1].Rows[0]["ErrorNumber"]);

                        if (errMsg.ToUpper().Contains("SUCCESS"))
                        { }// tr.Commit();
                        else
                        {

                            //tr.Rollback();
                            InsertErrorInDataBase(ErrorMessage, ErrorNumber);

                        }
                    //}

                }
                con.Close();
               // List<FlightResponse> successResponse = new List<FlightResponse>();
                if (errMsg.ToUpper().Contains("FAILED"))
                {
                    foreach (DataRow dr in dsReturn.Tables[1].Rows)
                        successResponse.Add(new FlightResponse() { Flightno = dr["FlightNo"].ToString(), FlightDate = DateTime.Parse(dr["FlightDate"].ToString()), Origin = dr["Origin"].ToString(), Destination = dr["Destination"].ToString() });
                    serviceResponse.flightResponse = successResponse.ToList<FlightResponse>();
                    return new KeyValuePair<string, ServiceResponse>(errMsg, serviceResponse);
                }
                else
                    return new KeyValuePair<string, ServiceResponse>(errMsg, null);
            }
            catch (Exception ex)
            {
                //if (tr != null)
                //{

                //    tr.Rollback();

                    InsertErrorInDataBase(ex.Message.ToString(), 10);
                //}

                //var msg = new MailMessage();
                //msg.To.Add(new MailAddress(ConfigurationManager.AppSettings["SMTPEdiErrorMailAddress"]));//"asrivastava@cargoflash.com,"
                //msg.From = new MailAddress("rcrown@airarabia.com", "AirArabia Cargo - System Generated Message", Encoding.UTF8);
                //msg.Subject = "UpdateFlightSchedule Error";
                //msg.IsBodyHtml = true;
                //msg.Body = ex.Message + " MSG:" + errMsg;
                //var smtp = new SmtpClient(ConfigurationManager.AppSettings["SMTPServer"]);
                //smtp.Credentials = new NetworkCredential(ConfigurationManager.AppSettings["SMTPUserID"], ConfigurationManager.AppSettings["SMTPPassword"]);
                //smtp.Port = int.Parse(ConfigurationManager.AppSettings["SMTPPort"]);
                //try
                //{
                //    smtp.Send(msg);
                //}
                //catch (Exception e)
                //{

                //}

                if (dtData.Columns.Contains("RowNo"))
                    dtData.Columns.Remove("RowNo");
                if (dtData.Columns.Contains("ETA"))
                    dtData.Columns.Remove("ETA");
                if (dtData.Columns.Contains("ETD"))
                    dtData.Columns.Remove("ETD");
                if (dtData.Columns.Contains("flightStatus"))
                    dtData.Columns.Remove("flightStatus");
                dtData.AcceptChanges();
                List<FlightResponse> failureResponse = new List<FlightResponse>();
                foreach (DataRow dr in dtData.Rows)
                    failureResponse.Add(new FlightResponse() { Flightno = dr["FlightNo"].ToString(), FlightDate = DateTime.Parse(dr["FlightDate"].ToString()), Origin = dr["Origin"].ToString(), Destination = dr["Destination"].ToString() });
                serviceResponse.flightResponse = failureResponse.ToList<FlightResponse>();
                return new KeyValuePair<string, ServiceResponse>("FAILED", serviceResponse);
            }

        }

        public DataSet UpdateFlightScheduleData(SqlConnection CON ,DataTable dtData)//SqlTransaction tr,
        {

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int) { Direction = ParameterDirection.Output };
            SqlParameter ValidationMessage = new SqlParameter("@ErrorMessage", SqlDbType.VarChar) { Direction = ParameterDirection.Output, Size = 250 };
            SqlParameter parameter = new SqlParameter();
            parameter.ParameterName = "@FlightSchedule";
            parameter.SqlDbType = SqlDbType.Structured;
            parameter.Value = dtData;

            SqlParameter[] Parameters = {
                                                parameter,
                                                new SqlParameter("@EnteredBy","ISA")
                                     };

            return SqlHelper.ExecuteDataset(CON, CommandType.StoredProcedure, "UpdateFlightScheduleNewest", Parameters);//tr,

        }

        /// <summary>
        ///  Flight Response Class use in Response return Schedule Integeration
        /// </summary>
        //public class FlightRespone
        //{
        //    public string Flightno { get; set; }
        //    public string Origin { get; set; }
        //    public string Destination { get; set; }
        //    public DateTime FlightDate { get; set; }
        //}

        public static string GetIpAddress()
        {
            //OperationContext context = OperationContext.Current;
            //MessageProperties prop = context.IncomingMessageProperties;
            //RemoteEndpointMessageProperty endpoint = prop[RemoteEndpointMessageProperty.Name] as RemoteEndpointMessageProperty;
            //return endpoint.Address;
            IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());
            IPAddress curAdd = heserver.AddressList[1];
            return curAdd.ToString();

        }


        public static void InsertErrorInDataBase(string ErrorMsg, int ErrorNumber)
        {
            SqlParameter[] parameters = { new SqlParameter("@ErrorMessage", ErrorMsg), new SqlParameter("@ErrorNumber", ErrorNumber) };
            SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "InsertErrorInDataBase", parameters);
        }

    }
}
