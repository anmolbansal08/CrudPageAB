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
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region RateHeavyWeightSurchargeService Class Description

    /*
	*****************************************************************************
	Class Name:		RateHeavyWeightSurchargeService      
	Purpose:		This class used to Extend Interface IRateHeavyWeightSurchargeService. This Class Communicate with SQL Server for CRUD Operation.
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:		24 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateHeavyWeightSurchargeService : SignatureAuthenticate, IRateHeavyWeightSurchargeService
    {
        /// <summary>
        /// Retrieve RateHeavyWeightSurcharge infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        public RateHeavyWeightSurcharge GetRateHeavyWeightSurchargeRecord(string recordID, string UserID)
        {
            try
            {
                int number = 0;

                RateHeavyWeightSurcharge RateHeavyWeightSurcharge = new RateHeavyWeightSurcharge();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRateHeavyWeightSurcharge", Parameters);
                if (dr.Read())
                {
                    RateHeavyWeightSurcharge.SNo = Convert.ToInt32(recordID);
                    RateHeavyWeightSurcharge.HeavyWeightName = dr["HeavyWeightName"].ToString();
                    RateHeavyWeightSurcharge.StartWeight = Convert.ToDecimal(dr["StartWeight"] == "" ? "0" : dr["StartWeight"]);
                    RateHeavyWeightSurcharge.EndWeight = Convert.ToDecimal(dr["EndWeight"] == "" ? "0" : dr["EndWeight"]);
                    RateHeavyWeightSurcharge.ValueType = Int32.TryParse(dr["ValueType"].ToString(), out number) ? number : 0;
                    RateHeavyWeightSurcharge.Text_ValueType = dr["ValueTypeName"].ToString();
                    RateHeavyWeightSurcharge.Value = Convert.ToDecimal(dr["Value"] == "" ? "0" : dr["Value"]);
                    RateHeavyWeightSurcharge.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    RateHeavyWeightSurcharge.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    RateHeavyWeightSurcharge.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    RateHeavyWeightSurcharge.IsInternational = Convert.ToBoolean(dr["IsInternational"]);
                    RateHeavyWeightSurcharge.IsEditable = Convert.ToBoolean(dr["IsEditable"]);
                    RateHeavyWeightSurcharge.CreatedBy = dr["UpdatedUser"].ToString();
                    RateHeavyWeightSurcharge.UpdatedBy = dr["CreatedUser"].ToString();
                    RateHeavyWeightSurcharge.UpdatedBy = Convert.ToString(dr["UpdatedUser"]);



                }
                dr.Close();
                return RateHeavyWeightSurcharge;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateHeavyWeightSurcharge>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateHeavyWeightSurcharge", Parameters);
                var RateHeavyWeightSurchargeList = ds.Tables[0].AsEnumerable().Select(e => new RateHeavyWeightSurchargeGridData
                {
                    HeavyWeightName = e["HeavyWeightName"].ToString().ToUpper(),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"]),
                    ValueType = Convert.ToInt32(e["ValueType"]),
                    Text_ValueType = e["Text_ValueType"].ToString(),
                    Active = e["Active"].ToString(),
                    Value = Convert.ToDecimal(e["Value"]),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"]).ToString(DateFormat.DateFormatString),
                    ValidTo = Convert.ToDateTime(e["ValidTo"]).ToString(DateFormat.DateFormatString),
                    SNo = Convert.ToInt32(e["SNo"])
                    //Text_CitySNo = e["CityCode"].ToString(),//foriegn key
                    //Text_AirlineSNo = e["AirlineCode"].ToString(),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateHeavyWeightSurchargeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        /// <summary>
        /// Save the RateHeavyWeightSurcharge Information into RateHeavyWeightSurcharge and CreditLimit Entity 
        /// </summary>
        /// <param name="RateHeavyWeightSurcharge">object of the Entity</param>
        public List<string> SaveRateHeavyWeightSurcharge(List<RateHeavyWeightSurcharge> RateHeavyWeightSurcharge)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                //List<RateHeavyWeightSurcharge> listRateHeavyWeightSurcharge = new List<RateHeavyWeightSurcharge>();
                //List<CreditLimit1> listCreditLimit = new List<CreditLimit1>();
                //listRateHeavyWeightSurcharge = RateHeavyWeightSurchargeCollection[0].RateHeavyWeightSurcharge;
                //listCreditLimit = RateHeavyWeightSurchargeCollection[0].creditLimit;
                DataTable dtCreateRateHeavyWeightSurcharge = CollectionHelper.ConvertTo(RateHeavyWeightSurcharge, "Active,International,Editable,Deleted,Text_ValueType");


                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("RateHeavyWeightSurcharge", dtCreateRateHeavyWeightSurcharge, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }



                SqlParameter paramRateHeavyWeightSurcharge = new SqlParameter();
                paramRateHeavyWeightSurcharge.ParameterName = "@RateHeavyWeightSurchargeTable";
                paramRateHeavyWeightSurcharge.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateHeavyWeightSurcharge.Value = dtCreateRateHeavyWeightSurcharge;

                SqlParameter[] Parameters = { paramRateHeavyWeightSurcharge };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateHeavyWeightSurcharge", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateHeavyWeightSurcharge");
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



        /// <summary>
        /// Update the RateHeavyWeightSurcharge Information into RateHeavyWeightSurcharge and Credit Limit Entity
        /// </summary>
        /// <param name="RateHeavyWeightSurcharge">list of RateHeavyWeightSurcharge to be updated</param>
        public List<string> UpdateRateHeavyWeightSurcharge(List<RateHeavyWeightSurcharge> RateHeavyWeightSurcharge)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateRateHeavyWeightSurcharge = CollectionHelper.ConvertTo(RateHeavyWeightSurcharge, "Active,International,Editable,Deleted,Text_ValueType");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("RateHeavyWeightSurcharge", dtCreateRateHeavyWeightSurcharge, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateHeavyWeightSurchargeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateRateHeavyWeightSurcharge;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateHeavyWeightSurcharge", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateHeavyWeightSurcharge");
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
        /// <summary>
        /// InActive the perticular RateHeavyWeightSurcharge information
        /// </summary>
        /// <param name="RecordID">Id of that RateHeavyWeightSurcharge </param>
        public List<string> DeleteRateHeavyWeightSurcharge(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@RateHeavyWeightSurchargeCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateHeavyWeightSurcharge", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateHeavyWeightSurcharge");
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


        public DataSourceResult GetCurrency(String CityCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCurrencyCity", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CurrencyCode"].ToString());
                    cur.Add(dr["CurrencyName"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

    }

}
