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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class MaintenanceTypeService : SignatureAuthenticate, IMaintenanceTypeService
    {
        /// <summary>
        /// Retrieve MaintenanceType information from the database
        /// </summary>
        /// <param name="recordID">record ID according to which the touple is to be retrieved</param>
        /// <returns></returns>
        public MaintenanceType GetMaintenanceTypeRecord(int recordID, string UserID)
        {
            try
            {
            MaintenanceType MainType = new MaintenanceType();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordMaintenanceType", Parameters);
            if (dr.Read())
            {
                MainType.SNo = Convert.ToInt32(dr["SNo"]);
                MainType.MaintenancType = Convert.ToString(dr["Descriptions"]);
                MainType.MaintenanceDesc = Convert.ToString(dr["MaintenanceDesc"]);
                MainType.ManhourCost = Convert.ToString(dr["ManhourCost"]);
                MainType.uldtype = Convert.ToString(dr["ULDType"]);
                MainType.uldtypesno = Convert.ToString(dr["uldtypesno"]);
                MainType.MaintenanceCategorys = Convert.ToString(dr["MaintenanceCategoryS"]);
                MainType.MaintenanceCategory = Convert.ToInt32(dr["MaintenanceCategory"]);
                if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                {
                    MainType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    MainType.Active = dr["IsActive"].ToString().ToUpper();
                }
                MainType.UpdatedBy = dr["UpdatedUser"].ToString();
                MainType.CreatedBy = dr["CreatedUser"].ToString();
            }
            dr.Close();
            return MainType;
           }
           catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get the list of records to be shown n the database
        /// </summary>
        /// <param name="skip">no. of records to be Skipped</param>
        /// <param name="take">no. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">size of the page i.e. No of record to be displayed at once</param>
        /// <param name="sort">column no according to which records are to be Ordered</param>
        /// <param name="filter">values/parameter according to which record are to be Filtered</param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<MaintenanceType>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListMaintenanceType", Parameters);

            var MaintenanceTypeList = ds.Tables[0].AsEnumerable().Select(e => new MaintenanceType
            {
                SNo = Convert.ToInt32(e["SNo"]),
                MaintenanceCategorys = Convert.ToString(e["MaintenanceCategorys"]).ToUpper(),
                MaintenancType = Convert.ToString(e["MaintenancType"]),
                MaintenanceDesc = Convert.ToString(e["MaintenanceDesc"]),
                ManhourCost = Convert.ToString(e["ManhourCost"]),
                uldtype = Convert.ToString(e["ULDType"]),
                //Active = e["Active"].ToString().ToUpper(),
                //IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                ReferenceNo = e["ReferenceNo"].ToString().ToUpper(),
                Active = e["Active"].ToString().ToUpper(),//foriegn key
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = MaintenanceTypeList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
          }
           catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Save the entity into the database
        /// </summary>
        /// <param name="MaintenanceType"></param>
        public List<string> SaveMaintenanceType(List<MaintenanceType> MainType)
        {
            try
            { 
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateMaintenanceType = CollectionHelper.ConvertTo(MainType, "Active,uldtypesno,MaintenanceCategorys,Description,ReferenceNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("MaintenanceType", dtCreateMaintenanceType, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@MaintenanceType";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateMaintenanceType;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateMaintenanceType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "MaintenanceType");
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
        /// Update the Entity into the database
        /// </summary>
        /// <param name=""></param>

        public List<string> UpdateMaintenanceType(List<MaintenanceType> MainType)
        {
            try
            { 
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateMaintenanceType = CollectionHelper.ConvertTo(MainType, "Active,uldtypesno,MaintenanceCategorys,Description,ReferenceNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("MaintenanceType", dtCreateMaintenanceType, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@MaintenanceType";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateMaintenanceType;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateMaintenanceType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "MaintenanceType");
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
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> DeleteMaintenanceType(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteMaintenanceType", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "MaintenanceType");
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
    }
}