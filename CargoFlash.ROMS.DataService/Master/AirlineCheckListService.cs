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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirlineCheckListService : SignatureAuthenticate, IAirlineCheckListService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Airline>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirlineCheckList", Parameters);
                var AirlineCList = ds.Tables[0].AsEnumerable().Select(e => new AirlineCheckList
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    Code = e["Code"].ToString().ToUpper(),
                    CheckListType = e["CheckListType"].ToString(),
                    name = e["name"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirlineCList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public AirlineCheckList GetAirlineCheckListRecord(string recordID, string UserID)
        {
            AirlineCheckList airlineCL = new AirlineCheckList();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CLType", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirlineCheckList", Parameters);
                if (dr.Read())
                {
                    airlineCL.SNo = Convert.ToInt32(dr["SNo"]);
                    airlineCL.AirlineName = Convert.ToString(dr["AirLineSno"]);
                    airlineCL.Code = Convert.ToString(dr["SPHCSNo"]);
                    airlineCL.CheckListType = Convert.ToString(dr["CheckListSNo"]);
                    airlineCL.Text_AirlineName = Convert.ToString(dr["AirlineName"]);
                    airlineCL.Text_Code = Convert.ToString(dr["Code"]);
                    airlineCL.Text_CheckListType = Convert.ToString(dr["CheckListType"]);
                    airlineCL.ISType = Convert.ToString(dr["ISSAS"]);
                    airlineCL.SPHCGroup = dr["SGSNo"].ToString();
                    airlineCL.Text_SPHCGroup = dr["GroupName"].ToString();
                    airlineCL.ISGROUP = dr["IsGroup"].ToString().ToUpper() == "FALSE" ? "0" : "1";
                    airlineCL.GROUP = dr["IsGroup"].ToString().ToUpper() == "FALSE" ? "Code" : "Group";
                }
            }
            
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return airlineCL;
        }

        public List<string> SaveAirlineCheckList(List<AirlineCList> AirlineCL)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirlineCL = CollectionHelper.ConvertTo(AirlineCL, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AirlineCheckList", dtCreateAirlineCL, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineCLTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirlineCL;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirlineCL", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirlineCheckList");
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
        public List<string> UpdateAirlineCheckList(List<AirlineCList> AirlineCL)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirlineCL = CollectionHelper.ConvertTo(AirlineCL, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AirlineCheckList", dtCreateAirlineCL, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineCLTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirlineCL;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirlineCL", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirlineCheckList");
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
        public List<string> DeleteAirlineCheckList(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNO", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirlineCL", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirlineCheckList");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public DataSourceResult ItemValue(string ItmVal)
        {
            try
            {
                List<String> value = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@ItmVal", ItmVal) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCheckListTypeValue", Parameters);
                if (dr.Read())
                {
                    value.Add(dr["IsSAS"].ToString());
                }
                return new DataSourceResult
                {
                    Data = value
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
