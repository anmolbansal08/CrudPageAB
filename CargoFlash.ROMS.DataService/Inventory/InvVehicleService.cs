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
    #region Vehicle Type Service Description
    /*
	*****************************************************************************
	Service Name:	InvVehicleType      
	Purpose:		This Service used to get details of Vehicle save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Anju Rani
	Created On:		28 Oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class InvVehicleService : IInvVehicleService
    {

        public SoftwareFactory.Data.DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<InvVehicle>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListInvVehicle", Parameters);
                var InventoryVehTypeList = ds.Tables[0].AsEnumerable().Select(e => new InvVehicle
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Text_VehicleTypeSNo = e["Text_VehicleType"].ToString().ToUpper(),
                    ManufactureDate = DateTime.Parse(e["ManufactureDate"].ToString()),
                    EngineNo = e["EngineNo"].ToString().ToUpper(),
                    ChasisNo = e["ChasisNo"].ToString().ToUpper(),
                    RegistrationNo = e["RegistrationNo"].ToString().ToUpper(),
                    DateofPurchase = DateTime.Parse(e["DateofPurchase"].ToString()),
                    VehicleType = e["VehicleType"].ToString().ToUpper(),
                    PurchasedFrom = e["PurchasedFrom"].ToString().ToUpper(),
                    CostOfVehicle = Convert.ToDecimal(e["CostOfVehicle"]),
                    CityCode = e["CityCode"].ToString().ToUpper(),
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

        public Model.Inventory.InvVehicle GetInvVehicleRecord(string recordID, string UserID)
        {
            InvVehicle InvVehicle = new InvVehicle();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordInvVehicle", Parameters);
                if (dr.Read())
                {
                    InvVehicle.SNo = Convert.ToInt32(dr["SNo"]);

                    InvVehicle.VehicleTypeSNo = Convert.ToInt32(dr["VehicleTypeSNo"]);
                    InvVehicle.ManufactureDate = Convert.ToDateTime(dr["ManufactureDate"]);
                    InvVehicle.Text_VehicleTypeSNo = Convert.ToString(dr["Text_VehicleTypeSNo"]);
                    InvVehicle.EngineNo = Convert.ToString(dr["EngineNo"]);
                    InvVehicle.ChasisNo = Convert.ToString(dr["ChasisNo"]);
                    InvVehicle.RegistrationNo = Convert.ToString(dr["RegistrationNo"]);
                    InvVehicle.DateofPurchase = Convert.ToDateTime(dr["DateofPurchase"]);
                    InvVehicle.TypeOfVehicle = Convert.ToBoolean(dr["TypeOfVehicle"]);
                    InvVehicle.VehicleType = Convert.ToString(dr["VehicleType"]);
                    InvVehicle.PurchasedFrom = Convert.ToString(dr["PurchasedFrom"]);
                    InvVehicle.CostOfVehicle = Convert.ToDecimal(dr["CostOfVehicle"]);
                    InvVehicle.CityCode = Convert.ToString(dr["CityCode"]);
                    InvVehicle.CurrentMileageReading = Convert.ToInt32(dr["CurrentMileageReading"]);
                    InvVehicle.NextServiceDueOn = Convert.ToDateTime(dr["NextServiceDueOn"]);
                    InvVehicle.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                    InvVehicle.CreatedBy = Convert.ToString(dr["CreatedBy"]);
                    InvVehicle.UpdatedBy = Convert.ToString(dr["UpdatedBy"]);
                    InvVehicle.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
                    InvVehicle.IsActive = Convert.ToBoolean(dr["IsActive"]);
                   
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return InvVehicle;
        }

        public List<string> SaveInvVehicle(List<Model.Inventory.InvVehicle> InvVehicle)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateInvVehicle = CollectionHelper.ConvertTo(InvVehicle, "Active,CreatedOn,UpdatedOn,Text_VehicleTypeSNo,VehicleType");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("InvVehicle", dtCreateInvVehicle, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@InvVehicleTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateInvVehicle;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateInvVehicle", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "InvVehicle");
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

        public List<string> UpdateInvVehicle(List<Model.Inventory.InvVehicle> InvVehicle)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateInvVehicle = CollectionHelper.ConvertTo(InvVehicle, "Active,CreatedOn,UpdatedOn,Text_VehicleTypeSNo,VehicleType");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("InventoryVehType", dtCreateInvVehicle, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@InvVehicleTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateInvVehicle;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateInvVehicle", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "InvVehicle");
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

        public List<string> DeleteInvVehicle(List<string> RecordID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteInvVehicle", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "InvVehicle");
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
