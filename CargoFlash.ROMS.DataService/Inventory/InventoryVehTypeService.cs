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
using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.Inventory
{
    #region Vehicle Type Service Description
    /*
	*****************************************************************************
	Service Name:	InventoryVehType      
	Purpose:		This Service used to get details of Vehicle Type save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Anju Rani
	Created On:		26 Oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class InventoryVehTypeService : IInventoryVehTypeService
    {


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<InventoryVehType>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListInventoryVehType", Parameters);
                var InventoryVehTypeList = ds.Tables[0].AsEnumerable().Select(e => new InventoryVehType
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    VehicleType = e["VehicleType"].ToString().ToUpper(),
                    VehicleName = e["VehicleName"].ToString().ToUpper(),
                    Text_ManufacturerSNo = e["Text_ManufacturerSNo"].ToString().ToUpper(),
                    ModelNo = e["ModelNo"].ToString().ToUpper(),
                    IsActive = Convert.ToBoolean(e["IsActive"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = InventoryVehTypeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public InventoryVehType GetInventoryVehTypeRecord(string recordID, string UserID)
        {
            InventoryVehType inventoryVehType = new InventoryVehType();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordInventoryVehType", Parameters);
                if (dr.Read())
                {
                    inventoryVehType.SNo = Convert.ToInt32(dr["SNo"]);
                    inventoryVehType.VehicleType = Convert.ToString(dr["VehicleType"]);
                    inventoryVehType.VehicleName = Convert.ToString(dr["VehicleName"]);
                    inventoryVehType.ManufacturerSNo = Convert.ToInt32(dr["ManufacturerSNo"]);
                    inventoryVehType.Text_ManufacturerSNo = Convert.ToString(dr["Text_ManufacturerSNo"]);
                    inventoryVehType.ModelNo = Convert.ToString(dr["ModelNo"]);

                    inventoryVehType.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                    inventoryVehType.CreatedBy = Convert.ToString(dr["CreatedBy"]);
                    inventoryVehType.UpdatedBy = Convert.ToString(dr["UpdatedBy"]);
                    inventoryVehType.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
                    inventoryVehType.IsActive = Convert.ToBoolean(dr["IsActive"]);                  
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return inventoryVehType;
        }

        public List<string> SaveInventoryVehType(List<Model.Inventory.InventoryVehType> InventoryVehType)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateInventoryVehType = CollectionHelper.ConvertTo(InventoryVehType, "Active,CreatedOn,UpdatedOn,Text_ManufacturerSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("InventoryVehType", dtCreateInventoryVehType, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@InventoryVehTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateInventoryVehType;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateInventoryVehType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "InventoryVehType");
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

        public List<string> UpdateInventoryVehType(List<Model.Inventory.InventoryVehType> InventoryVehType)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateInventoryVehType = CollectionHelper.ConvertTo(InventoryVehType, "Active,CreatedOn,UpdatedOn,Text_ManufacturerSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("InventoryVehType", dtCreateInventoryVehType, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@InventoryVehTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateInventoryVehType;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateInventoryVehType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "InventoryVehType");
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

        public List<string> DeleteInventoryVehType(List<string> RecordID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteInventoryVehType", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "InventoryVehType");
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
