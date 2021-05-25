﻿using System;
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
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    class TempratureSensorService : SignatureAuthenticate, ITempratureSensorService
    {

        public TempratureSensor GetTempratureSensorRecord(string recordID, string UserSNo)
        {
        
            TempratureSensor TempratureSensor = new TempratureSensor();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTempratureSensor", Parameters);
                if (dr.Read())
                {

                    TempratureSensor.SNo = Convert.ToInt32(dr["SNo"]);
                  
                    TempratureSensor.SensorName = dr["SensorName"].ToString().ToUpper();
                  
                    TempratureSensor.SensorID = dr["SensorID"].ToString();

                    TempratureSensor.CreatedBy = dr["CreatedUser"].ToString();

                    TempratureSensor.UpdatedBy = dr["UpdatedUser"].ToString();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return TempratureSensor;
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
                string filters = GridFilter.ProcessFilters<TempratureSensor>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTempratureSensor", Parameters);
                var DesignationMasterList = ds.Tables[0].AsEnumerable().Select(e => new TempratureSensor
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    SensorName = e["SensorName"].ToString().ToUpper(),
                    SensorID = e["SensorID"].ToString().ToUpper(),
                    //Hierarchy = Convert.ToString(e["Hierarchy"]),
                    //MaximumShiftHour = Convert.ToInt32(e["MaximumShiftHour"]),
                    ////CreatedBy = e["CreatedBy"].ToString(),
                    //Active = e["Active"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DesignationMasterList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }
        /// <summary>
        /// Save the AccountType Information into TempratureSensor
        /// </summary>
        /// <param name="TempratureSensor"></param>
        /// <returns></returns>
        public List<string> SaveTempratureSensor(List<TempratureSensor> TempratureSensor)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateTempratureSensor = CollectionHelper.ConvertTo(TempratureSensor,"");
                //                DataTable dtCreateTempratureSensor = CollectionHelper.ConvertTo(TempratureSensor, "Active,strDayLightSaving,Text_ZoneSNo,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea");

                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("TempratureSensor", dtCreateTempratureSensor, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@TempratureSensorTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateTempratureSensor;

                SqlParameter[] Parameters = { param };

                //int ret = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTempratureSensor", Parameters) == null ? 0 : (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTempratureSensor", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTempratureSensor", Parameters);
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTempratureSensor", Parameters);
                if (ret > 0)
                {
                   
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TempratureSensor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (ret == 545)
                    {
                        ErrorMessage.Add("Sensor Name " + dtCreateTempratureSensor.Rows[0]["SensorName"] + " already exist");
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
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return ErrorMessage;
        }
        /// <summary>
        ///  Update TempratureSensor record on the basis of ID
        /// </summary>
        /// <param name="TempratureSensor"></param>
        /// <returns></returns>
        public List<string> UpdateTempratureSensor(List<TempratureSensor> TempratureSensor)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateTempratureSensor = CollectionHelper.ConvertTo(TempratureSensor,"");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("TempratureSensor", dtCreateTempratureSensor, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@TempratureSensorTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateTempratureSensor;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateTempratureSensor", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TempratureSensor");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (ret == 545)
                    {
                        ErrorMessage.Add("Sensor Name " + dtCreateTempratureSensor.Rows[0]["SensorName"] + " already exist");
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
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return ErrorMessage;
        }
        /// <summary>
        ///  Delete TempratureSensor record on the basis of ID
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteTempratureSensor(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteTempratureSensor", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "TempratureSensor");
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
                }
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
            return ErrorMessage;
        }


    }
}
