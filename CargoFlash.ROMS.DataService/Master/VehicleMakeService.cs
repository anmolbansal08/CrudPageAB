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
using CargoFlash.Cargo.DataService;


namespace CargoFlash.Cargo.DataService.Master
{
    /// <summary>
    /// This is Vehicle Type Service Class.
    /// Created By : Jasmine Kaur Sethi
    /// Created On : 29 APR 2013
    /// Approved By : Manish Kumar
    /// </summary>
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class VehicleMakeService : CargoFlash.Cargo.DataService.SignatureAuthenticate, IVehicleMakeService
    {
        /// <summary>
        /// Get Vehicle Type record as per the recordid and UserID
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="RecordID"></param>
        /// /// <param name="UserID"></param>
      
          public VehicleMake GetVehicleMakeRecord(int recordID, string UserID)
        {
            VehicleMake ba = new VehicleMake();

            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordVehicleMake", Parameters);
            if (dr.Read())
            {
              //  DateTime? d = null;
                ba.SNo = Convert.ToInt32(dr["SNo"]);
                ba.vehiclemake = dr["vehiclemake"].ToString();
                ba.Capacity = Convert.ToInt64(dr["Capacity"]);
                ba.VehicleTypeSNo = dr["VehicleTypeSNo"].ToString();
                ba.Text_VehicleTypeSNo = dr["vehicletype"].ToString();
                ba.IsActive = Convert.ToBoolean(dr["IsActive"]);
                ba.Active = dr["Active"].ToString();
                ba.CreatedUser = dr["CreatedUser"].ToString();
                ba.UpdatedUser = dr["UpdatedUser"].ToString();
           

            }
            dr.Close();
            return ba;
        }


        /// <summary>
        /// Get grid data 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<VehicleTypeGridData>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListVehicleMake", Parameters);

            var VehicleMakeList = ds.Tables[0].AsEnumerable().Select(e => new VehicleMakeGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                vehicletype = e["vehicletype"].ToString(),
                vehiclemake = e["vehiclemake"].ToString(),
               // Capacity = Convert.ToInt64(e["Capacity"]),
                Capacity = e["Capacity"].ToString(),
                Active = e["Active"].ToString()

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = VehicleMakeList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = "GetListVehicleMake"
            };

        }

 


        /// <summary>
        /// Save VehicleType 
        /// Created By : Jasmine Kaur Sethi
        /// Created On : 29 APR 2013
        /// </summary>
    
        public List<string> SaveVehicleMake(List<VehicleMake> VehicleMake)
        {
            //validate Business Rule
            //  int returnValue = 0;

            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateVehicleMake = CollectionHelper.ConvertTo(VehicleMake, "Active,Text_VehicleTypeSNo,vehicletype");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("VehicleMake", dtCreateVehicleMake, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@VehicleMakeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateVehicleMake;


            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateVehicleMake", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "VehicleMake");
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
    
        public List<string> UpdateVehicleMake(List<VehicleMake> VehicleMake)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateVehicleMake = CollectionHelper.ConvertTo(VehicleMake, "VehicleTypeSNo,vehiclemake,CreatedBy,CreatedOn,Active,Text_VehicleTypeSNo");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("VehicleMake", dtCreateVehicleMake, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@VehicleMakeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateVehicleMake;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateVehicleMake", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "VehicleMake");
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
    
        public List<string> DeleteVehicleMake(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteVehicleMake", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "VehicleMake");
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