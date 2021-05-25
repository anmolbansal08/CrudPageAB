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
    /// <summary>
    /// This is Vehicle Type Service Class.
    /// Created By : Naveen
    /// Created On : 13 APR 2020
    /// Approved By : Manish Kumar
    /// </summary>
    //[GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    //[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))] [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class VehicleTypeService : IVehicleTypeService
    {
        
        public VehicleType GetVehicleTypeRecord(int recordID,string UserID)
        {
            VehicleType v = new VehicleType();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordVehicleType", Parameters);
            if (dr.Read())
            {
                v.SNo = Convert.ToInt32(dr["SNo"]);
                v.vehicletype = dr["vehicletype"].ToString();
                v.CreatedUser = dr["CreatedUser"].ToString();
                v.UpdatedUser = dr["UpdatedUser"].ToString();
                v.IsActive = Convert.ToBoolean(dr["IsActive"]);
                v.Active = dr["Active"].ToString();
               // v.Capacity = Convert.ToInt64(dr["Capacity"]);
            }
            dr.Close();
            return v;
        }
        /// <summary>
        /// Get grid data 
        /// Created By : 
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        //public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        //{
        //    string sorts = GridSort.ProcessSorting(sort);
        //    string filters = GridFilter.ProcessFilters<VehicleTypeGridData>(filter);
        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListVehicleType", Parameters);

        //    var VehicleTypeList = ds.Tables[0].AsEnumerable().Select(e => new VehicleTypeGridData
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        vehicletype = e["vehicletype"].ToString(),
        //       // Capacity = Convert.ToInt64(e["Capacity"]),
        //        Active = e["Active"].ToString()
               
        //    });
        //    ds.Dispose();
        //    return new DataSourceResult
        //    {
        //        Data = VehicleTypeList.AsQueryable().ToList(),
        //        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
        //        FilterCondition = filters,
        //        SortCondition = sorts,
        //        StoredProcedure = "GetListVehicleType"
        //    };

        //}

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<VehicleTypeGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListVehicleType", Parameters);

                var VehicleTypeList = ds.Tables[0].AsEnumerable().Select(e => new VehicleTypeGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    vehicletype = e["vehicletype"].ToString(),
                    // Capacity = Convert.ToInt64(e["Capacity"]),
                    Active = e["Active"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = VehicleTypeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = "GetListVehicleType"
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }
        /// <summary>
        /// Save VehicleType 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        public List<string> SaveVehicleType(List<VehicleType> VehicleType)
        {

            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateVehicleType = CollectionHelper.ConvertTo(VehicleType, "Active");

            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("VehicleType", dtCreateVehicleType, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@VehicleTypeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateVehicleType;

            SqlParameter[] Parameters = { param};

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateVehicleType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "VehicleType");
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
        /// <summary>
        /// Update VehicleType 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        public List<string> UpdateVehicleType(List<VehicleType> VehicleType)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateVehicleType = CollectionHelper.ConvertTo(VehicleType, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("VehicleType", dtCreateVehicleType, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@VehicleTypeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateVehicleType;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateVehicleType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "VehicleType");
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
        /// <summary>
        /// Delete VehicleType 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        public List<string> DeleteVehicleType(List<string> listID)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteVehicleType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "VehicleType");
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
    }
}