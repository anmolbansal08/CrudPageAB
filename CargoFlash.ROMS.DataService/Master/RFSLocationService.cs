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
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RFSLocationService : IRFSLocationService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public RFSLocation GetRFSLocationRecord(string recordID, string UserSNo)
        {
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            RFSLocation RFSLocation = new RFSLocation();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "GetRecordRFSLocation", Parameters);
                if (dr.Read())
                {
                    RFSLocation.SNo = Convert.ToInt32(recordID);
                    RFSLocation.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        RFSLocation.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        RFSLocation.Active = dr["Active"].ToString().ToUpper();
                    }
                    RFSLocation.LocationCode = Convert.ToString(dr["LocationCode"]).ToUpper();
                    RFSLocation.Location = Convert.ToString(dr["Location"]).ToUpper();
                    RFSLocation.UpdatedBy = dr["UpdatedUser"].ToString();
                    RFSLocation.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch (Exception ex)
            {
                dr.Close();
            }
            return RFSLocation;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<RFSLocation>(filter);
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRFSLocation", Parameters);
            var RFSLocationList = ds.Tables[0].AsEnumerable().Select(e => new RFSLocation
            {
                SNo = Convert.ToInt32(e["SNo"]),
                LocationCode = e["LocationCode"].ToString().ToUpper(),
                Location = e["Location"].ToString().ToUpper(),
                Active = e["Active"].ToString().ToUpper()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = RFSLocationList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        public List<string> SaveRFSLocation(List<RFSLocation> RFSLocation)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateHtype = CollectionHelper.ConvertTo(RFSLocation, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RFSLocation", dtCreateHtype, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RFSLocationTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateHtype;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRFSLocation", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RFSLocation");
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
            catch (Exception e)
            {

            }
            return ErrorMessage;
        }
        public List<string> UpdateRFSLocation(List<RFSLocation> RFSLocation)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateRFSLocation = CollectionHelper.ConvertTo(RFSLocation, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("RFSLocation", dtCreateRFSLocation, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@RFSLocationTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateRFSLocation;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRFSLocation", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RFSLocation");
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
        public List<string> DeleteRFSLocation(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@RFSLocation", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRFSLocation", Parameters);
                if (ret > 0)
                {
                    if (ret == 1)
                    {
                        string serverErrorMessage = "This RFS Loction is already used. So this can not be deleted!";
                        ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RFSLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        ret = 548;
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
            return ErrorMessage;
        }
    }
}
