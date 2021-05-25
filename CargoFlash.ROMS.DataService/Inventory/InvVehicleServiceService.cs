using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public  class InvVehicleServiceService : IInvVehicleServiceService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<InvVehicleService>(filter);
                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetListInvVehicleService", Parameters);
                var InvVehicleServiceList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Inventory.InvVehicleService
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Text_VehicleSNo = e["Text_VehicleSNo"].ToString().ToUpper(),
                    RegistrationNo = e["RegistrationNo"].ToString().ToUpper(),
                    Text_VehicleServiceType = e["Text_VehicleServiceType"].ToString().ToUpper(),
                    ServicedOn = DateTime.Parse(e["ServicedOn"].ToString()),
                    NextServiceDueOn = DateTime.Parse(e["NextServiceDueOn"].ToString()),
                    IsActive = Convert.ToBoolean(e["IsActive"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = InvVehicleServiceList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public CargoFlash.Cargo.Model.Inventory.InvVehicleService GetInvVehicleServiceRecord(string recordID, string UserID)
        {
            CargoFlash.Cargo.Model.Inventory.InvVehicleService InvVehicleService = new CargoFlash.Cargo.Model.Inventory.InvVehicleService();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordInvVehicleService", Parameters);
                if (dr.Read())
                {
                    InvVehicleService.SNo = Convert.ToInt32(dr["SNo"]);
                    InvVehicleService.VehicleSNo = Convert.ToInt32(dr["VehicleSNo"]);
                    InvVehicleService.Text_VehicleSNo = Convert.ToString(dr["Text_VehicleSNo"]);
                    InvVehicleService.ServicedOn = Convert.ToDateTime(dr["ServicedOn"]);
                    InvVehicleService.Text_VehicleServiceType = Convert.ToString(dr["Text_VehicleServiceType"]);
                    InvVehicleService.VehicleServiceTypeSNo = Convert.ToInt32(dr["VehicleServiceTypeSNo"]);
                    InvVehicleService.NextServiceDueOn = Convert.ToDateTime(dr["NextServiceDueOn"]);
                    InvVehicleService.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                    InvVehicleService.CreatedBy = Convert.ToString(dr["CreatedBy"]);
                    InvVehicleService.UpdatedBy = Convert.ToString(dr["UpdatedBy"]);
                    InvVehicleService.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
                    InvVehicleService.IsActive = Convert.ToBoolean(dr["IsActive"]);
               
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return InvVehicleService;
        }

        public List<string> SaveInvVehicleService(List<CargoFlash.Cargo.Model.Inventory.InvVehicleService> InvVehicleService)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateInvVehicleService = CollectionHelper.ConvertTo(InvVehicleService, "Active,CreatedOn,UpdatedOn,Text_VehicleSNo,Text_VehicleServiceType,RegistrationNo");

                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("InvVehicleService", dtCreateInvVehicleService, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@InvVehicleServiceTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateInvVehicleService;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateInvVehicleService", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "InvVehicleService");
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

        public List<string> UpdateInvVehicleService(List<CargoFlash.Cargo.Model.Inventory.InvVehicleService> InvVehicleService)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateInvVehicleService = CollectionHelper.ConvertTo(InvVehicleService, "Active,CreatedOn,UpdatedOn,Text_VehicleSNo,Text_VehicleServiceType,RegistrationNo");

                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("InventoryVehType", dtCreateInvVehicleService, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@InvVehicleServiceTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateInvVehicleService;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateInvVehicleService", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "InvVehicleService");
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

        public List<string> DeleteInvVehicleService(List<string> RecordID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteInvVehicleService", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "InvVehicleService");
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
    }
}
