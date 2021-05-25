using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DriverMasterService : IDriverMasterService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<DriverMaster>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDriverMaster", Parameters);

            var DriverMasterList = ds.Tables[0].AsEnumerable().Select(e => new DriverMaster
            {
                SNo = Convert.ToInt32(e["SNo"]),
                ID = e["ID"].ToString().ToUpper(),
                //FirstName = e["FirstName"].ToString().ToUpper() + " " + e["LastName"].ToString().ToUpper(),
                DriverName = e["DriverName"].ToString().ToUpper(),
                Text_Nationality = e["Text_Nationality"].ToString().ToUpper(),
               // Nationality = e["Nationality"].ToString().ToUpper(),
                Mobile = e["Mobile"].ToString().ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                Active = (e["Active"].ToString().ToUpper()),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = DriverMasterList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };

        }


        public DriverMaster GetDriverMasterRecord(string recordID, string UserSNo)
        {
            DriverMaster driverMaster = new DriverMaster();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDriverMaster", Parameters);

            if (dr.Read())
            {
                driverMaster.SNo = Convert.ToInt32(dr["SNo"]);
                driverMaster.ID = dr["ID"].ToString().ToUpper().ToUpper();
                driverMaster.Nationality = dr["Nationality"].ToString().ToUpper();
                driverMaster.Text_Nationality = dr["Text_Nationality"].ToString().ToUpper();
                driverMaster.FirstName = dr["FirstName"].ToString().ToUpper();
                driverMaster.LastName = dr["LastName"].ToString().ToUpper();
                driverMaster.Mobile = dr["Mobile"].ToString();
            //    driverMaster.Active = dr["Active"].ToString();

                if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                {
                    driverMaster.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    driverMaster.Active = dr["Active"].ToString().ToUpper();
                }
                driverMaster.UpdatedBy = dr["UpdatedUser"].ToString();
                driverMaster.CreatedBy = dr["CreatedUser"].ToString();
            }

            dr.Close();
            return driverMaster;
        }


        /// <summary>
        /// Save the Entity into the database
        /// </summary>
        /// <param name="FlightType"></param>
        public List<string> SaveDriverMaster(List<DriverMaster> DriverMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateDriverMaster = CollectionHelper.ConvertTo(DriverMaster, "Active,Text_Nationality,DriverName");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("DriverMaster", dtCreateDriverMaster, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DriverMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDriverMaster;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDriverMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DriverMaster");
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

        public List<string> UpdateDriverMaster(List<DriverMaster> DriverMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateDriverMaster = CollectionHelper.ConvertTo(DriverMaster, "Active,Text_Nationality,DriverName");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("DriverMaster", dtCreateDriverMaster, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DriverMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDriverMaster;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDriverMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DriverMaster");
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

        public List<string> DeleteDriverMaster(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDriverMaster", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DriverMaster");
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

     
    }
}
