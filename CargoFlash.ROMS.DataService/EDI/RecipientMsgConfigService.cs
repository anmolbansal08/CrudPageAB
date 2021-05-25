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
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.EDI
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class RecipientMsgConfigService : SignatureAuthenticate, IRecipientMsgConfigService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RecipientMsgConfig>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRecipientMsgConfig", Parameters);
                var RecipientMsgConfigList = ds.Tables[0].AsEnumerable().Select(e => new RecipientMsgConfig
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirlineName = e["AirlineName"].ToString(),
                    // OfficeName = e["OfficeName"].ToString(),
                    //AgentName = e["AgentName"].ToString(),
                    ExecutionType = e["ExecutionType"].ToString(),
                    MessageMovementType = e["MessageMovementType"].ToString(),
                    MessageTypeVersion = e["MessageTypeVersion"].ToString(),
                    Active = e["Active"].ToString(),
                    OriginAirport = e["OriginAirport"].ToString(),
                    DestinationCity = e["DestinationCity"].ToString(),
                    // DestinationCountry = e["DestinationCountry"].ToString(),
                     FlightNo = e["FlightNo"].ToString(),
                    RecipientType1 = e["RecipientType1"].ToString(),
                    Version = e["Version"].ToString(),
                    CreatedBy = e["CreatedBy"].ToString(),
                    UpdatedBy = e["UpdatedBy"].ToString(),
                    RecipientId= e["Text_RecipientId"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RecipientMsgConfigList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public RecipientMsgConfig GetRecipientMsgConfigRecord(string recordID, string UserID)
        {
            SqlDataReader dr = null;
            try
            {


                RecipientMsgConfig recpMsgConfRead = new RecipientMsgConfig();

                //try
                //{
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRecipientMsgConfigRead", Parameters);
                if (dr.Read())
                {
                    recpMsgConfRead.SNo = Convert.ToInt32(dr["SNo"]);
                    recpMsgConfRead.RecipientType = Convert.ToInt32(dr["ReceipentType"]);
                    recpMsgConfRead.AirlineName = dr["AirlineNameSNo"].ToString();
                    recpMsgConfRead.Text_AirlineName = dr["AirlineName"].ToString();
                    recpMsgConfRead.AirportName = dr["AirportNameSNo"].ToString();
                    recpMsgConfRead.Text_AirportName = dr["AirportName"].ToString();
                    recpMsgConfRead.MessageMovementType = dr["MessageMovementTypeSNo"].ToString();
                    recpMsgConfRead.Text_MessageMovementType = dr["MessageMovementType"].ToString();
                    recpMsgConfRead.Basis = dr["Basis"].ToString();
                    recpMsgConfRead.Text_Basis = dr["Basis"].ToString();
                    recpMsgConfRead.CutOffMins = Convert.ToInt32(dr["CutOffMins"]);
                    recpMsgConfRead.Text_DestinationCountry = dr["DestinationCountry"].ToString();
                    recpMsgConfRead.DestinationCountry = dr["DestinationCountrySNo"].ToString();
                    recpMsgConfRead.Text_DestinationCity = dr["DestinationCity"].ToString();
                    recpMsgConfRead.DestinationCity = dr["DestinationCitySNo"].ToString();
                    recpMsgConfRead.Text_MessageType = dr["MessageType"].ToString();
                    recpMsgConfRead.MessageType = dr["MessageTypeSNo"].ToString();
                    recpMsgConfRead.Text_MessageVersion = dr["MessageVersion"].ToString();
                    recpMsgConfRead.MessageVersion = dr["MessageVersionSNo"].ToString();
                    recpMsgConfRead.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    recpMsgConfRead.IsDoubleSignature = Convert.ToBoolean(dr["IsDoubleSignature"]);
                    recpMsgConfRead.ExecutionType = dr["ExecutionType"].ToString();
                    recpMsgConfRead.Text_ExecutionType = dr["Text_ExecutionType"].ToString();
                    recpMsgConfRead.FlightNo = dr["FlightNo"].ToString();
                    recpMsgConfRead.Text_FlightNo = dr["Text_FlightNo"].ToString();
                    recpMsgConfRead.CreatedBy = dr["CreatedBy"].ToString();
                    recpMsgConfRead.UpdatedBy = dr["UpdatedBy"].ToString();
                }
                //}
                //catch(Exception ex)// (Exception ex)
                //{
                //    dr.Close();
                //}
                return recpMsgConfRead;
            }
            catch (Exception ex)//
            {
                dr.Close();
                throw ex;
            }
        }

        //public List<RecipientMsgConfigUpdateTrans> GetRecipientMsgConfigTransRecord(string recordID)
        //{
        //    try
        //    {
        //        List<RecipientMsgConfigUpdateTrans> listtariffForwardRateTrans = new List<RecipientMsgConfigUpdateTrans>();
        //        //RecipientMsgConfigUpdateTrans TariffForwardRateTrans = new RecipientMsgConfigUpdateTrans();

        //        SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //        DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecipientMsgConfigUpdateTrans", Parameters);

        //        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //        {
        //            foreach (DataRow dr in ds.Tables[0].Rows)
        //            {
        //                listtariffForwardRateTrans.Add(new RecipientMsgConfigUpdateTrans
        //                {
        //                    SNo = Convert.ToInt32(dr["SNo"]),
        //                    Mode = Convert.ToInt32(dr["Mode"]),
        //                    ReceivingID = dr["ReceivingID"].ToString(),
        //                    ReceivingUserId = dr["ReceivingUserId"].ToString(),
        //                    ReceivingPassword = dr["ReceivingPassword"].ToString(),
        //                    RecipientMsgConfigSNo = Convert.ToInt32(dr["RecipientMsgConfigSNo"]),
        //                    TriggerEvent = dr["TriggerEvent"].ToString(),
        //                    Text_TriggerEvent = dr["Text_TriggerEvent"].ToString(),
        //                });
        //            }
        //        }
        //        return listtariffForwardRateTrans;
        //    }
        //    catch (Exception ex)//
        //    {
        //        throw ex;
        //    }

        //}
        public KeyValuePair<string, List<RecipientMsgConfigUpdateTrans>> GetRecipientMsgConfigTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                RecipientMsgConfigUpdateTrans contactInformation = new RecipientMsgConfigUpdateTrans();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@SNo", recordID),
                                           new SqlParameter("@PageNo", page),
                                           new SqlParameter("@PageSize", pageSize),
                                           new SqlParameter("@WhereCondition", CargoFlash.Cargo.Business.Common.Base64ToString(whereCondition)),
                                           new SqlParameter("@OrderBy", sort)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecipientMsgConfigUpdateTrans", Parameters);

                var obj = ds.Tables[0].AsEnumerable().Select(e => new RecipientMsgConfigUpdateTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Mode = Convert.ToInt32(e["Mode"]),
                    ReceivingID = e["ReceivingID"].ToString(),
                    ReceivingUserId = e["ReceivingUserId"].ToString(),
                    ReceivingPassword = e["ReceivingPassword"].ToString(),
                    RecipientMsgConfigSNo = Convert.ToInt32(e["RecipientMsgConfigSNo"]),
                    TriggerEvent = e["Text_TriggerEvent"].ToString(),
                   // Text_TriggerEvent = e["Text_TriggerEvent"].ToString(),
                    HdnTriggerEvent = Convert.ToInt32(e["TriggerEvent"]),
                    ModeText = e["ModeText"].ToString()

                });

                if (obj.Any())
                    return new KeyValuePair<string, List<RecipientMsgConfigUpdateTrans>>(ds.Tables[1].Rows[0][0].ToString(), obj.AsQueryable().ToList());
                else
                    return new KeyValuePair<string, List<RecipientMsgConfigUpdateTrans>>("", obj.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveRecipientMsgConfig(List<RecipientMsgConfigSaveTrans> RecipientMsgConfigTransInfo, List<RecipientMsgConfigSave> RecipientMsgConfigInfo)
        {
            try
            {

                if (RecipientMsgConfigTransInfo != null)
                {
                    RecipientMsgConfigTransInfo.ForEach(u => u.ReceivingID = CargoFlash.Cargo.Business.Common.Base64ToString(u.ReceivingID));
                }

                //DataTable dtEventMessageParentTrans = CollectionHelper.ConvertTo(EventMessageTransParentInfo, "EventName,MessageType,MessageTypeSNo");
                DataTable dtRecipientMsgConfigInfoTrans = CollectionHelper.ConvertTo(RecipientMsgConfigTransInfo, "");
                DataTable dtRecipientMsgConfigInfo = CollectionHelper.ConvertTo(RecipientMsgConfigInfo, "Text_FlightNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = { new SqlParameter("@RecipientMsgConfigInfoTable",

             dtRecipientMsgConfigInfo),
                new SqlParameter("@RecipientMsgConfigInfoTableTrans", dtRecipientMsgConfigInfoTrans),
                new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRecipientMsgConfig", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RecipientMsgConfig");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> UpdateRecipientMsgConfig(List<RecipientMsgConfigUpdateTrans> RecipientMsgConfigTransInfoUpdate, List<RecipientMsgConfigSave> RecipientMsgConfigInfo)
        {
            try
            {
                if (RecipientMsgConfigTransInfoUpdate != null)
                {
                    RecipientMsgConfigTransInfoUpdate.ForEach(u => u.ReceivingID = CargoFlash.Cargo.Business.Common.Base64ToString(u.ReceivingID));
                }
                //validate Business Rule
                //  DataTable dtUpdateRecipientMsgConfig = CollectionHelper.ConvertTo(RecipientMsgConfigTransInfoUpdate, "Text_TriggerEvent");
                DataTable dtUpdateRecipientMsgConfig = CollectionHelper.ConvertTo(RecipientMsgConfigTransInfoUpdate, "Mode,Text_TriggerEvent,HdnTriggerEvent,ModeText");
                DataTable dtRecipientMsgConfigInfo = CollectionHelper.ConvertTo(RecipientMsgConfigInfo, "Text_FlightNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = { new SqlParameter("@RecipientMsgConfigTable", dtUpdateRecipientMsgConfig),
                                    new SqlParameter("@RecipientMsgConfigInfo",dtRecipientMsgConfigInfo),
                                    new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};

                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateRecipientMsgConfig", param);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRecipientMsgConfig", param);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RecipientMsgConfig");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }



        public List<string> DeleteRecipientMsgConfig(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "usp_DeleteRecipientMsgConfig", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RecipientMsgConfig");
                            if (!string.IsNullOrEmpty(serverErrorMessage))
                                ErrorMessage.Add(serverErrorMessage);
                        }
                        else
                        {
                            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(dataBaseExceptionMessage);
                        }
                    }
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                    //Error
                }
                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string GetCountry(int CitySNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@CitySNo", CitySNo),
                                        };
                //try
                //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetTaxCountry", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                //}
                //catch(Exception ex)// (Exception ex)
                //{
                //    return ex.Message;
                //}
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }



        public string GetCityInformation(string SNo)
        {
            try
            {
                DataSet ds = new DataSet();
                //try
                //{
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityInformation", Parameters);
                ds.Dispose();
                //}
                //catch(Exception ex)// (Exception) { }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }


        }


        public string GetAirportInformation(string SNo)
        {
            try
            {
                DataSet ds = new DataSet();
                //try
                //{
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportInformation", Parameters);
                ds.Dispose();
                //}
                //catch(Exception ex)// (Exception) { }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> DeleteRecipientMsgConfigTransRecord(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;

                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRecipientMsgConfigTransRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RecipientMsgConfig");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }


            }
            catch (Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public string GetRecipientMsgConfigExcel(string recordID,string Defaultpara)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo", recordID),new SqlParameter("@Defaultpara", Defaultpara),
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetRecipientMsgConfigExcel", Parameters);
                 return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {

                throw ex;
            }
        }
    }
}
