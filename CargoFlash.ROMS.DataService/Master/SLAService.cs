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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region SLA Service Description
    /*
	*****************************************************************************
	Service Name:	SLAService      
	Purpose:		This Service used to get details of SLA save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Jan 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SLAService : SignatureAuthenticate, ISLAService
    {
        public SLA GetSLARecord(string recordID, string UserSNo)
        {
            
            SqlDataReader dr = null;
            try
            {
                SLA c = new SLA();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordSLA", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.SLAType = dr["SLAType"].ToString().ToUpper() == "FALSE" ? "0" : "1";
                    c.SLATypeTxt = dr["SLATypeTxt"].ToString();
                    c.AirportSNo = Convert.ToInt32(dr["AirportSNo"].ToString() == "" ? "0" : dr["AirportSNo"]);
                    c.Text_AirportSNo = dr["AirportName"].ToString();
                    c.TerminalSNo = Convert.ToInt32(dr["TerminalSNo"].ToString() == "" ? "0" : dr["TerminalSNo"]);
                    c.Text_TerminalSNo = dr["TerminalName"].ToString();
                    c.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"].ToString() == "" ? "0" : dr["AirlineSNo"]);
                    c.Text_AirlineSNo = dr["AirlineName"].ToString();
                    c.StandardName = dr["StandardName"].ToString();
                    c.MovementType = dr["MovementType"].ToString();
                    c.Text_MovementType = dr["MovementTypeTxt"].ToString().ToUpper();
                    c.Basis = dr["BasisValue"].ToString();
                    c.BasisTxt = dr["Basis"].ToString();
                    c.EventSNo = Convert.ToInt32(dr["EventSNo"].ToString() == "" ? "0" : dr["EventSNo"]);
                    c.Text_EventSNo = dr["ProcessName"].ToString().ToUpper();
                    c.DisplayOrder = Convert.ToInt32(dr["DisplayOrder"].ToString() == "" ? "0" : dr["DisplayOrder"]);
                    c.MinimumCutOffMins = Convert.ToInt32(dr["MinimumCutOffMins"].ToString() == "" ? "0" : dr["MinimumCutOffMins"]);
                    c.AircraftSNo = dr["AircraftSNo"].ToString();
                    c.Text_AircraftSNo = dr["Text_AircraftSNo"].ToString();
                    c.SHCSNo = dr["SHCSNo"].ToString();
                    c.Text_SHCSNo = dr["Text_SHCSNo"].ToString();
                    c.UpdatedBy = dr["UpdatedUser"].ToString();
                    c.SLAAirlineSno = dr["SLAAirlineSno"].ToString();
                    c.Text_SLAAirlineSno = dr["Text_SLAAirlineSno"].ToString();
                    c.TargetPercentage = dr["TargetPercentage"].ToString();
                    c.MessageTypeSNo = Convert.ToInt32(dr["MessageTypeSNo"].ToString() == "" ? "0" : dr["MessageTypeSNo"]);
                    c.Text_MessageTypeSNo = dr["Text_MessageTypeSNo"].ToString();
                }
                dr.Close();
                return c;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }

        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                var user = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]));
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<SLA>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@WhereCondition", filters),
                new SqlParameter("@OrderBy", sorts),
                  new SqlParameter("@IsShowAllData", user.IsShowAllData.ToString()),
                    new SqlParameter("@AirPortSNo", user.AirportSNo),
                    new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSLA", Parameters);
                var SLAList = ds.Tables[0].AsEnumerable().Select(e => new SLA
                {
                    SNo = Convert.ToInt16(e["SNo"]),
                    StandardName = e["StandardName"].ToString().ToUpper(),
                    MovementType = e["MovementType"].ToString(),
                    SLAType = e["SLAType"].ToString(),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString(),
                    Text_EventSNo = e["Text_EventSNo"].ToString(),
                    MinimumCutOffMins = Convert.ToInt16(e["MinimumCutOffMins"].ToString()),
                    Text_AirportSNo = e["Text_AirportSNo"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = SLAList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveSLA(List<SLA> SLA)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateSLA = CollectionHelper.ConvertTo(SLA, "Text_CurrencyCode,Text_Continent,Text_IATAAreaCode");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("SLA", dtCreateSLA, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SLATable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSLA;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSLA", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SLA");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> UpdateSLA(List<SLA> SLA)
        {
            try
            {
                //validate Business Rule
                DataTable dtUpdateSLA = CollectionHelper.ConvertTo(SLA, "Text_CurrencyCode,Text_Continent,Text_IATAAreaCode");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("SLA", dtUpdateSLA, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SLATable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateSLA;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSLA", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SLA");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> DeleteSLA(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)) };

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSLA", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SLA");
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

                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                    //Error
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveSLAData(string itemlist, String SLAType, String AirportSNo, String TerminalSNo, String AirlineSNo, string StandardName, string MovementType, string Basis, string EventSNo, string DisplayOrder, string MinimumCutOffMins, string AircraftSNo, string SHCSNo, string UpdatedBy, string SLAAirlineSno, string MessageType, string TargetPercentage)
        {
            try
            {
                DataSet ds = new DataSet();
                // convert JSON string into datatable
                itemlist = CargoFlash.Cargo.Business.Common.Base64ToString(itemlist);
                var dtSLATransData = JsonConvert.DeserializeObject<DataTable>(itemlist);
                SqlParameter[] Parameters = {
                new SqlParameter("@SLATrans",dtSLATransData),
                new SqlParameter("@SLAType", SLAType),
                new SqlParameter("@AirportSNo", AirportSNo),
                new SqlParameter("@TerminalSNo", TerminalSNo),
                new SqlParameter("@AirlineSNo", AirlineSNo),
                new SqlParameter("@StandardName", StandardName),
                new SqlParameter("@MovementType", MovementType),
                new SqlParameter("@Basis", Basis),
                new SqlParameter("@EventSNo", EventSNo),
                new SqlParameter("@DisplayOrder", DisplayOrder),
                new SqlParameter("@MinimumCutOffMins", MinimumCutOffMins),
                new SqlParameter("@AircraftSNo", AircraftSNo),
                new SqlParameter("@SHCSNo", SHCSNo),
                new SqlParameter("@UpdatedBy", UpdatedBy),
                new SqlParameter("@SLAAirlineSno", SLAAirlineSno),
                new SqlParameter("@MessageTypeSNo", MessageType),
                new SqlParameter("@TargetPercentage", SLAAirlineSno)
                                        };

                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveSLAData", Parameters);
                //Finish:
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateSLAData(string itemlist, int SLASNo, String SLAType, String AirportSNo, String TerminalSNo, String AirlineSNo, string StandardName, string MovementType, string Basis, string EventSNo, string DisplayOrder, string MinimumCutOffMins, string AircraftSNo, string SHCSNo, string UpdatedBy, string SLAAirlineSno, string MessageType, string TargetPercentage)
        {
            try
            {
                DataSet ds = new DataSet();
                // convert JSON string into datatable
                itemlist = CargoFlash.Cargo.Business.Common.Base64ToString(itemlist);
                var dtSLATransData = JsonConvert.DeserializeObject<DataTable>(itemlist);
                SqlParameter[] Parameters = {
                new SqlParameter("@SLATrans",dtSLATransData),
                new SqlParameter("@SLASNo",SLASNo),
                new SqlParameter("@AirportSNo", AirportSNo),
                new SqlParameter("@TerminalSNo", TerminalSNo),
                new SqlParameter("@AirlineSNo", AirlineSNo),
                new SqlParameter("@StandardName", StandardName),
                new SqlParameter("@MovementType", MovementType),
                new SqlParameter("@Basis", Basis),
                new SqlParameter("@EventSNo", EventSNo),
                new SqlParameter("@DisplayOrder", DisplayOrder),
                new SqlParameter("@MinimumCutOffMins", MinimumCutOffMins),
                new SqlParameter("@AircraftSNo", AircraftSNo),
                new SqlParameter("@SHCSNo", SHCSNo),
                new SqlParameter("@UpdatedBy", UpdatedBy),
                new SqlParameter("@SLAAirlineSno", SLAAirlineSno),
                new SqlParameter("@MessageTypeSNo", MessageType),
                new SqlParameter("@TargetPercentage", TargetPercentage)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateSLAData", Parameters);
                //Finish:
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<SLATrans>> GetSLATransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                SLATrans SLATrans = new SLATrans();
                SqlParameter[] Parameters = { new SqlParameter("@SLASNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordSLATrans", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var SLATransList = ds.Tables[0].AsEnumerable().Select(e => new SLATrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    SLASNo = Convert.ToInt32(e["SLASNo"]),
                    SlabName = e["SlabName"].ToString().ToUpper(),
                    HdnAircraftBodyType = e["AircraftBodyType"].ToString().ToUpper(),
                    AircraftBodyType = e["AircraftBodyType"].ToString().ToUpper(),
                    Type = e["Type"].ToString().ToUpper() == "FALSE" ? "0" : "1",
                    TypeTxt = e["Type"].ToString().ToUpper() == "FALSE" ? "Weight" : "Percentage",
                    StartWeight = e["StartWeight"].ToString(),
                    EndWeight = e["EndWeight"].ToString(),
                    StartPercentage = e["StartPercentage"].ToString(),
                    EndPercentage = e["EndPercentage"].ToString(),
                    CutOffMins = e["CutOffMins"].ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<SLATrans>>(ds.Tables[1].Rows[0][0].ToString(), SLATransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteSLATrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSLATrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SLA");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
