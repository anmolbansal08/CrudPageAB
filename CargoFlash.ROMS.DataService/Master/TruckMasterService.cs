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
    public class TruckMasterService : ITruckMasterService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<TruckMaster>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTruckMaster", Parameters);

            var TruckMasterList = ds.Tables[0].AsEnumerable().Select(e => new TruckMaster
            {
                SNo = Convert.ToInt32(e["SNo"]),
                TruckNo = e["TruckNo"].ToString().ToUpper(),
                AssignedTruckRegNo = e["AssignedTruckRegNo"].ToString().ToUpper(),
                EIDNo = e["EIDNo"].ToString().ToUpper(),
                PPNo = e["PPNo"].ToString().ToUpper(),
                SHJcustomsCardNo = e["SHJcustomsCardNo"].ToString().ToUpper(),
                DXBcustomsCardNo = e["DXBcustomsCardNo"].ToString().ToUpper(),
                ADPNo = e["ADPNo"].ToString().ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                Active = (e["Active"].ToString().ToUpper()),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = TruckMasterList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };

        }


        public TruckMaster GetTruckMasterRecord(string recordID, string UserSNo)
        {
            TruckMaster truckMaster = new TruckMaster();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTruckMaster", Parameters);

            if (dr.Read())
            {
                truckMaster.SNo = Convert.ToInt32(dr["SNo"]);
                truckMaster.TruckNo = dr["TruckNo"].ToString().ToUpper();
                truckMaster.AssignedTruckRegNo = dr["AssignedTruckRegNo"].ToString().ToUpper();
                truckMaster.AssignedTruckExpDate = Convert.ToDateTime(dr["AssignedTruckExpDate"].ToString());
                truckMaster.EIDNo = dr["EIDNo"].ToString().ToUpper();
                truckMaster.EIDNoExpDate = Convert.ToDateTime(dr["EIDNoExpDate"].ToString());
                truckMaster.PPNo = dr["PPNo"].ToString().ToUpper();
                truckMaster.PPExpDate = Convert.ToDateTime(dr["PPExpDate"].ToString());
                truckMaster.SHJcustomsCardNo = dr["SHJcustomsCardNo"].ToString().ToUpper();
                truckMaster.SHJcustomscardNoexpDate = Convert.ToDateTime(dr["SHJcustomscardNoexpDate"].ToString());
                truckMaster.DXBcustomsCardNo = dr["DXBcustomsCardNo"].ToString().ToUpper();
                truckMaster.DXBcustomsExpDate = Convert.ToDateTime(dr["DXBcustomsExpDate"].ToString());
                truckMaster.ADPNo = dr["ADPNo"].ToString().ToUpper();
                truckMaster.ADPNoExpDate = Convert.ToDateTime(dr["ADPNoExpDate"].ToString());

                if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                {
                    truckMaster.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    truckMaster.Active = dr["Active"].ToString().ToUpper();
                }
                truckMaster.UpdatedBy = dr["UpdatedUser"].ToString();
                truckMaster.CreatedBy = dr["CreatedUser"].ToString();
            }

            dr.Close();
            return truckMaster;
        }


        /// <summary>
        /// Save the Entity into the database
        /// </summary>
        /// <param name="FlightType"></param>
        public List<string> SaveTruckMaster(List<TruckMaster> TruckMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateTruckMaster = CollectionHelper.ConvertTo(TruckMaster, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("TruckMaster", dtCreateTruckMaster, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@TruckMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateTruckMaster;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTruckMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TruckMaster");
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

        public List<string> UpdateTruckMaster(List<TruckMaster> TruckMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateTruckMaster = CollectionHelper.ConvertTo(TruckMaster, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("TruckMaster", dtCreateTruckMaster, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@TruckMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateTruckMaster;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateTruckMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TruckMaster");
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

        public List<string> DeleteTruckMaster(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteTruckMaster", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "TruckMaster");
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
