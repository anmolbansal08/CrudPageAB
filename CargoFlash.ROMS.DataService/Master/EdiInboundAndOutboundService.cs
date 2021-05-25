using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class EdiInboundAndOutboundService : SignatureAuthenticate, IEdiInboundAndOutboundService
    {

        public KeyValuePair<string, List<EdiInboundAndOutboundResult>> GetEdiInboundOutbound(string recid, int pageNo, int pageSize, GetEdiInboundOutbound model, string sort)//(DateTime FromDate, DateTime ToDate, string Carrier, string Type, string MessageType, string FlightNo, string AWbNo, string Airport, string Status)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                          new SqlParameter("@FromDate", model.FromDate),
                                          new SqlParameter("@ToDate", model.ToDate),
                                          new SqlParameter("@Carrier",model.Carrier),
                                          new SqlParameter("@Type", model.EventType),
                                          new SqlParameter("@MessageTypeCheck", model.MessageTypeCheck),
                                          new SqlParameter("@MessageType", model.MessageType),
                                          new SqlParameter("@FlightNo", model.FlightNo),
                                           new SqlParameter("@FlightDate", model.FlightDate),
                                          new SqlParameter("@AWb", model.AWBNo),
                                          new SqlParameter("@Origin",model.CityCode),
                                          new SqlParameter("@Status", model.Status),
                                          new SqlParameter("@SenderID", model.SenderID),
                                          new SqlParameter("@PageNo", pageNo),
                                          new SqlParameter("@PageSize", pageSize),
                                           new SqlParameter("@MessageFormat", model.MessageFormat),
                                         // new SqlParameter("@WhereCondition", whereCondition),
                                         // new SqlParameter("@WhereCondition", CargoFlash.Cargo.Business.Common.Base64ToString(whereCondition)),                                        
                                          new SqlParameter("@OrderBy", sort),
                                          new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()),
                                          new SqlParameter("@Reportfilter", model.Reportfilter)
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetEdiInboundOutbound", Parameters);
                // DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetEdiInboundOutbound_Fortest1", Parameters);

                var ediInboundOutbound = ds.Tables[0].AsEnumerable().Select(e => new EdiInboundAndOutboundResult
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ActualMessage = e["ActualMessage"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    Carrier = e["Carrier"].ToString(),
                    CityCode = e["CityCode"].ToString(),
                    CitySNo = e["CitySNo"].ToString(),
                    EventDate = e["EventDate"] == DBNull.Value ? "" : Convert.ToDateTime(e["EventDate"].ToString()).ToString("dd-MMM-yyyy HH:mm:ss"),
                    EventType = e["EventType"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd-MMM-yyyy"),
                    FlightNo = e["FlightNo"].ToString(),
                    MessageType = e["MessageType"].ToString(),
                    Reason = e["Reason"].ToString(),
                    SenderID = e["SenderID"].ToString().Replace(',',' '),
                    Status = e["Status"].ToString(),
                    MessageVersion = e["MessageVersion"].ToString(),
                    ProcessedAt = e["ProcessedAt"] == DBNull.Value ? "" : Convert.ToDateTime(e["ProcessedAt"].ToString()).ToString("dd-MMM-yyyy HH:mm:ss"),
                });
                return new KeyValuePair<string, List<EdiInboundAndOutboundResult>>(ds.Tables[1].Rows[0][0].ToString(), ediInboundOutbound.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



        public KeyValuePair<string, List<InvalidRecipient>> GetInvalidRecipient(string recid, int pageNo, int pageSize, GetInvalidRecipient model, string sort)//(DateTime FromDate, DateTime ToDate, string Carrier, string Type, string MessageType, string FlightNo, string AWbNo, string Airport, string Status)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                          new SqlParameter("@FromDate", model.FromDate),
                                          new SqlParameter("@ToDate", model.ToDate),
                                      
                                          new SqlParameter("@PageNo", pageNo),
                                          new SqlParameter("@PageSize", pageSize),
                                         // new SqlParameter("@WhereCondition", whereCondition),
                                         // new SqlParameter("@WhereCondition", CargoFlash.Cargo.Business.Common.Base64ToString(whereCondition)),                                        
                                          new SqlParameter("@OrderBy", sort),
                                          new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "uspGetInvalidRecipientData", Parameters);
                // DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetEdiInboundOutbound_Fortest1", Parameters);

                var InvalidRecipient = ds.Tables[0].AsEnumerable().Select(e => new InvalidRecipient
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ActualFileContent=e["ActualFileContent"].ToString(),
                    FileName = e["FileName"].ToString(),
                    FileContent = e["FileContent"].ToString(),
                    ReadAt = e["ReadAt1"].ToString(),
                    Senderaddress = e["Senderaddress"].ToString(),
                    ErrorMessage = e["ErrorMessage"].ToString()
                 
                });
                return new KeyValuePair<string, List<InvalidRecipient>>(ds.Tables[1].Rows[0][0].ToString(), InvalidRecipient.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string ReExecutedMessage(string SNo, string EDIBoundType, string UpdatedMessage)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo",Convert.ToInt32(SNo)),
                                            new SqlParameter("@EDIBoundType",EDIBoundType),
                                            new SqlParameter("@UpdatedMessage",CargoFlash.Cargo.Business.Common.Base64ToString(UpdatedMessage))
                                        };
                string ret = ((int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spEdiInboundOutbound_ReExecuteMessage", Parameters)).ToString();
                return ret;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string GetMessageTrail(GetMessageTrail Model)
        {
            try
            {
                DataSet ds = null;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Model.SNo),
                                          new SqlParameter("@EDIBoundType",Model.EDIBoundType)};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spEdiInboundOutbound_MessageTrail", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAllStatus(GetEdiInboundOutbound model)
        {
            try
            {
                DataSet ds = null;
                SqlParameter[] Parameters = { 
                                             new SqlParameter("@FromDate", model.FromDate),
                                          new SqlParameter("@ToDate", model.ToDate),
                                          new SqlParameter("@Carrier",model.Carrier),
                                          new SqlParameter("@Type", model.EventType),
                                          new SqlParameter("@MessageTypeCheck", model.MessageTypeCheck),
                                          new SqlParameter("@MessageType", model.MessageType),
                                          new SqlParameter("@FlightNo", model.FlightNo),
                                          new SqlParameter("@AWb", model.AWBNo),
                                          new SqlParameter("@Origin",model.CityCode),
                                          new SqlParameter("@Status", model.Status),
                                          new SqlParameter("@SenderID", model.SenderID)
                                          
                                         // new SqlParameter("@WhereCondition", CargoFlash.Cargo.Business.Common.Base64ToString(whereCondition)),
                                        // new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()) 
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "uspGetEdiInboundOutboundStatus", Parameters);
                // ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "uspGetEdiInboundOutboundStatus1", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public string GetutcdateByAirportSno(GetutcdateByAirport Model)
        {
            try
            {
                DataSet ds = null;
                SqlParameter[] Parameters = { 
                                          
                                          new SqlParameter("@FromDate", Model.FromDate),
                                          new SqlParameter("@FromTime", Model.StartTime),
                                          new SqlParameter("@ToDate", Model.ToDate),
                                          new SqlParameter("@ToTime", Model.EndTime),
                                            new SqlParameter("@AirportSno", Model.AirportSNo),
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_getutcdateByAirportSno", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);

            }
            catch(Exception ex)//
            {
                throw ex;
            }
           


        }


    }
}
